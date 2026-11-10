// Annual running cost and emissions of ONE household, as configured.
//
// Ported from the Energy Savings 2026 R model (energy_savings_model.R +
// battery_model.R) via its parity-tested TypeScript port in
// energy-savings-explorer (src/comparison/model.ts: householdBreakdown,
// batterySeasonRow, annualBatteryFlows). The R model only prices fixed
// whole-home scenarios (all gas, all electric); this generalises the same
// steps to any mix of appliances, which is what the calculator needs.
//
// Steps, per household:
//   1. Daily load of each appliance (state average × occupancy × dwelling).
//   2. Tariff and solar behaviour (see resolveTariff / resolveSolarScenario).
//   3. Solar: each electric load can take up to its solar share, never more
//      than (1 - min_retail) of the load, all scaled back pro rata if demand
//      exceeds daily generation.
//   4. Battery: four typical seasonal days. Stored solar goes to house load
//      first, then to EV charging, and the rest is exported in the evening.
//   5. Bill: paid grid kWh at the tariff's import rate (less the battery's
//      contribution), public fast charging, fossil fuels, one supply charge per
//      connected fuel, vehicle servicing, minus feed-in tariff income.
//
// Not modelled here (the calculator reports running costs only): equipment
// capex inside the totals, loan finance, Solar Sharer and Amber tariffs.

import {
  COOKTOP_ROW,
  DAYS_PER_YEAR,
  KM_PER_DAY,
  MODEL_DEFAULTS,
  PLUG_IN_HYBRID_PETROL_SHARE,
  HYBRID_PETROL_SHARE,
  SOLAR_BY_STATE,
  SPACE_HEATING_ROW,
  STATE_CODE,
  WATER_HEATING_ROW,
  WOOD_PRICE,
  dailySupplyCharge,
  dwellingScale,
  emissionsFactor,
  energyKwhDay,
  energyPrice,
  minRetailFraction,
  occupancyScale,
  solarFraction,
  sumCategoryKwhDay,
  vehicleEfficiency,
  vehicleMaintenance,
  type Period,
  type SolarScenario,
  type StateCode,
  type Tariff,
} from '../constants/model2026';
import {
  SpaceHeatingEnum,
  VehicleFuelTypeEnum,
  type Household,
  type OpexWeekly,
} from '../types';

type LoadKey = 'heating' | 'cooling' | 'hotwater' | 'cooking' | 'otherCooking' | 'otherElec';
const LOAD_KEYS: LoadKey[] = ['heating', 'cooling', 'hotwater', 'cooking', 'otherCooking', 'otherElec'];

interface ElectricLoad {
  kwh: number;
  category: string;
  applianceType?: string;
}

type FossilFuel = 'gas' | 'lpg' | 'wood' | 'petrol' | 'diesel';

export interface HouseholdLoads {
  state: StateCode;
  electric: Record<LoadKey, ElectricLoad>;
  /** Home-charged EV kWh/day (EVs plus the electric share of hybrids). */
  evHomeKwh: number;
  /** Public DC fast-charged EV kWh/day — never solar, priced at the fast-charge rate. */
  evFastKwh: number;
  fossil: Record<FossilFuel, number>;
  /** $/yr servicing, tyres and consumables across all vehicles. */
  vehicleMaintenance: number;
  usesGas: boolean;
  usesLpg: boolean;
}

export interface SolarBatteryFlows {
  pvDailyKwh: number;
  applianceSolarKwhDay: number;
  vehicleSolarKwhDay: number;
  /** kWh/yr */
  exportKwh: number;
  eveningExportKwh: number;
  batteryToHomeKwh: number;
  batteryToEvKwh: number;
}

export interface HouseholdResult {
  tariff: Tariff;
  solarScenario: SolarScenario;
  /** Annual figures, in the calculator's existing breakdown shape. */
  opex: OpexWeekly;
  annualCost: number;
  annualEmissionsKg: number;
  flows: SolarBatteryFlows;
}

// ---------------------------------------------------------------------------
// 1. Loads
// ---------------------------------------------------------------------------

export function householdLoads(h: Household): HouseholdLoads {
  const state = STATE_CODE[h.location!];
  const scale = occupancyScale(h.occupancy) * dwellingScale(h.dwelling);

  const electric: Record<LoadKey, ElectricLoad> = {
    heating: { kwh: 0, category: 'Space Heating' },
    cooling: { kwh: energyKwhDay('Space Cooling', 'Heat pump', state) * scale, category: 'Space Cooling' },
    hotwater: { kwh: 0, category: 'Water Heating' },
    cooking: { kwh: 0, category: 'Cooktop' },
    otherCooking: { kwh: sumCategoryKwhDay('Other Cooking', state) * scale, category: 'Other Cooking' },
    otherElec: { kwh: sumCategoryKwhDay('Other Electronics', state) * scale, category: 'Other Electronics' },
  };
  const fossil: Record<FossilFuel, number> = { gas: 0, lpg: 0, wood: 0, petrol: 0, diesel: 0 };

  const heating = SPACE_HEATING_ROW[h.spaceHeating ?? SpaceHeatingEnum.None];
  if (heating.type) {
    const kwh = energyKwhDay('Space Heating', heating.type, state) * scale;
    if (heating.fuel === 'electricity') electric.heating.kwh = kwh;
    else if (heating.fuel !== 'none') fossil[heating.fuel] += kwh;
  }

  const water = WATER_HEATING_ROW[h.waterHeating!];
  const waterKwh = energyKwhDay('Water Heating', water.type, state) * scale;
  if (water.fuel === 'electricity') {
    electric.hotwater = { kwh: waterKwh, category: 'Water Heating', applianceType: water.type };
  } else if (water.fuel !== 'solar') {
    fossil[water.fuel] += waterKwh;
  }

  const cooktop = COOKTOP_ROW[h.cooktop!];
  const cooktopKwh = energyKwhDay('Cooktop', cooktop.type, state) * scale;
  if (cooktop.fuel === 'electricity') electric.cooking.kwh = cooktopKwh;
  else fossil[cooktop.fuel] += cooktopKwh;

  // Vehicles: efficiency (Wh/km by class) × distance. Not scaled by occupancy
  // or dwelling.
  let evTotalKwh = 0;
  let maintenance = 0;
  for (const v of h.vehicles ?? []) {
    const iceService = vehicleMaintenance(v.vehicleClass, 'ice');
    const evService = vehicleMaintenance(v.vehicleClass, 'ev');
    const kmPerDay = (v.kmsPerWeek ?? KM_PER_DAY[state] * 7) / 7;
    const eff = vehicleEfficiency(v.vehicleClass);
    const iceKwh = (eff.iceWhPerKm * kmPerDay) / 1000;
    const evKwh = (eff.evWhPerKm * kmPerDay) / 1000;
    switch (v.fuelType) {
      case VehicleFuelTypeEnum.Petrol:
        fossil.petrol += iceKwh;
        maintenance += iceService;
        break;
      case VehicleFuelTypeEnum.Diesel:
        fossil.diesel += iceKwh;
        maintenance += iceService;
        break;
      case VehicleFuelTypeEnum.Electric:
        evTotalKwh += evKwh;
        maintenance += evService;
        break;
      case VehicleFuelTypeEnum.Hybrid:
        fossil.petrol += iceKwh * HYBRID_PETROL_SHARE;
        evTotalKwh += evKwh * (1 - HYBRID_PETROL_SHARE);
        maintenance += iceService * HYBRID_PETROL_SHARE + evService * (1 - HYBRID_PETROL_SHARE);
        break;
      case VehicleFuelTypeEnum.PlugInHybrid:
        fossil.petrol += iceKwh * PLUG_IN_HYBRID_PETROL_SHARE;
        evTotalKwh += evKwh * (1 - PLUG_IN_HYBRID_PETROL_SHARE);
        maintenance += iceService * PLUG_IN_HYBRID_PETROL_SHARE + evService * (1 - PLUG_IN_HYBRID_PETROL_SHARE);
        break;
    }
  }
  const fast = MODEL_DEFAULTS.fastChargeFraction;

  const fuels = [heating.fuel, water.fuel, cooktop.fuel];
  return {
    state,
    electric,
    evHomeKwh: evTotalKwh * (1 - fast),
    evFastKwh: evTotalKwh * fast,
    fossil,
    vehicleMaintenance: maintenance,
    usesGas: fuels.includes('gas'),
    usesLpg: fuels.includes('lpg'),
  };
}

// ---------------------------------------------------------------------------
// 2. Tariff and solar behaviour
// ---------------------------------------------------------------------------

function hasSolar(h: Household): boolean {
  return !!h.solar?.hasSolar && (h.solar.size ?? 0) > 0;
}

function hasBattery(h: Household): boolean {
  return hasSolar(h) && !!h.battery?.hasBattery && (h.battery.capacity ?? 0) > 0;
}

/**
 * Time-of-use (every import at the off-peak rate) only for a home that can
 * actually shift its load: solar + a battery and no gas or LPG appliances.
 * Everything else stays on a flat plan. Mirrors the R model's tariff rules:
 * gas homes and grid-only electric homes are always billed flat
 * (fossil_baseline_tariff, grid_only_tariff); solar + battery electric homes
 * get the household's tariff, `tou` by default.
 */
export function resolveTariff(h: Household, loads: HouseholdLoads): Tariff {
  return hasBattery(h) && !loads.usesGas && !loads.usesLpg ? 'tou' : 'flat';
}

/**
 * A home still on gas uses its solar passively (R "Gas + solar" scenario).
 * A home with no gas or LPG left is assumed to put its hot water and EV on
 * timers to soak up solar (R "Electric (solar optimised)").
 */
export function resolveSolarScenario(h: Household, loads: HouseholdLoads): SolarScenario {
  if (!hasSolar(h)) return 'grid_only';
  return loads.usesGas || loads.usesLpg ? 'solar' : 'solar_optimised';
}

// ---------------------------------------------------------------------------
// 3–4. Solar self-consumption and the seasonal battery
// ---------------------------------------------------------------------------

const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;

function batteryCapacityFactor(degradation: number, years: number): number {
  // Linear average of start-of-life and end-of-horizon capacity (battery_model.R).
  return (1 + Math.pow(1 - degradation, years)) / 2;
}

export function solarBatteryFlows(
  h: Household,
  loads: HouseholdLoads,
  scenario: SolarScenario,
  period: Period,
  evRate: number,
  fit: number,
): SolarBatteryFlows {
  const none: SolarBatteryFlows = {
    pvDailyKwh: 0, applianceSolarKwhDay: 0, vehicleSolarKwhDay: 0,
    exportKwh: 0, eveningExportKwh: 0, batteryToHomeKwh: 0, batteryToEvKwh: 0,
  };
  if (scenario === 'grid_only') return none;

  const pvDailyKwh = SOLAR_BY_STATE[loads.state].capacityFactor * 24 * (h.solar!.size ?? 0);

  let applianceLoad = 0;
  let applianceMinRetail = 0;
  let applianceSolarDemand = 0;
  for (const key of LOAD_KEYS) {
    const { kwh, category, applianceType } = loads.electric[key];
    if (kwh <= 0) continue;
    const minRetail = kwh * minRetailFraction(category, applianceType);
    applianceLoad += kwh;
    applianceMinRetail += minRetail;
    applianceSolarDemand += Math.min(kwh * solarFraction(category, scenario, applianceType), kwh - minRetail);
  }
  const evHome = loads.evHomeKwh;
  const evMinRetail = evHome * minRetailFraction('Vehicles');
  const vehicleSolarDemand = Math.min(evHome * solarFraction('Vehicles', scenario), evHome - evMinRetail);

  // Self-consumption can't exceed what the panels generate on an average day.
  const demand = applianceSolarDemand + vehicleSolarDemand;
  const solarScale = demand > pvDailyKwh ? (pvDailyKwh > 0 ? pvDailyKwh / demand : 0) : 1;
  const applianceSolar = applianceSolarDemand * solarScale;
  const vehicleSolar = vehicleSolarDemand * solarScale;

  const totalLoad = applianceLoad + evHome;
  const selfSufficiency = totalLoad > 0 ? (applianceSolar + vehicleSolar) / totalLoad : 0;

  const years = period === '1year' ? 1 : 15;
  const degradation = period === '1year' ? MODEL_DEFAULTS.batteryDegradation1yr : MODEL_DEFAULTS.batteryDegradation15yr;
  const batteryKwh = hasBattery(h) ? h.battery!.capacity ?? 0 : 0;
  const effectiveBattery =
    batteryKwh * MODEL_DEFAULTS.batteryUseableCapacityPct * batteryCapacityFactor(degradation, years);

  const rte = MODEL_DEFAULTS.batteryRoundTripEfficiency;
  const batteryEligibleLoad = Math.max(applianceLoad - applianceMinRetail, 0);
  const evUnmet = Math.max(evHome - vehicleSolar - evMinRetail, 0);
  // Surplus stored solar goes to whichever is worth more: the car's avoided
  // import or the evening feed-in tariff. In practice always the car.
  const surplusEvFirst = evUnmet > 0 && evRate >= fit;

  const w = MODEL_DEFAULTS.solarSeasonalWeights;
  const meanWeight = (w.spring + w.summer + w.autumn + w.winter) / 4;
  const daysPerSeason = DAYS_PER_YEAR / 4;

  const flows: SolarBatteryFlows = { ...none, pvDailyKwh, applianceSolarKwhDay: applianceSolar, vehicleSolarKwhDay: vehicleSolar };
  for (const s of SEASONS) {
    const solar = pvDailyKwh * (w[s] / meanWeight);
    const loadMetBySolar = Math.min(totalLoad * selfSufficiency, solar);
    const applianceSolarConsumed = Math.min(applianceSolar, loadMetBySolar);
    const loadUnmetBySolar = Math.max(batteryEligibleLoad - applianceSolarConsumed, 0);

    const stored = Math.min((solar - loadMetBySolar) * rte, effectiveBattery);
    const dayExport = solar - (stored / rte + loadMetBySolar);
    const usable = stored * (1 - MODEL_DEFAULTS.householdSafeguardPct);

    const toHome = Math.min(usable, loadUnmetBySolar);
    const surplus = Math.max(usable - loadUnmetBySolar, 0);
    const toEv = surplusEvFirst ? Math.min(surplus, evUnmet) : 0;

    flows.exportKwh += dayExport * daysPerSeason;
    flows.batteryToHomeKwh += toHome * daysPerSeason;
    flows.batteryToEvKwh += toEv * daysPerSeason;
    flows.eveningExportKwh += (surplus - toEv) * daysPerSeason;
  }
  return flows;
}

// ---------------------------------------------------------------------------
// 5. Bill and emissions
// ---------------------------------------------------------------------------

export function evaluateHousehold(
  h: Household,
  period: Period,
  opts: { tariff?: Tariff } = {},
): HouseholdResult {
  const loads = householdLoads(h);
  const { state } = loads;
  const tariff = opts.tariff ?? resolveTariff(h, loads);
  const solarScenario = resolveSolarScenario(h, loads);

  const importRate = energyPrice(state, tariff === 'tou' ? 'electricity_off_peak' : 'electricity', period);
  const fastRate = energyPrice(state, 'ev_fast_charge', period);
  const fit = energyPrice(state, 'solar_export', period);

  const flows = solarBatteryFlows(h, loads, solarScenario, period, importRate, fit);

  const applianceLoad = LOAD_KEYS.reduce((sum, k) => sum + loads.electric[k].kwh, 0);
  const paidHomeKwhDay =
    applianceLoad - flows.applianceSolarKwhDay + (loads.evHomeKwh - flows.vehicleSolarKwhDay);
  const batteryKwhYear = flows.batteryToHomeKwh + flows.batteryToEvKwh;

  // Battery discharge displaces grid imports at the same rate they're billed at.
  const gridVolumeCosts =
    paidHomeKwhDay * DAYS_PER_YEAR * importRate
    + loads.evFastKwh * DAYS_PER_YEAR * fastRate
    - batteryKwhYear * importRate;

  const fossilCost: Record<FossilFuel, number> = {
    gas: loads.fossil.gas * DAYS_PER_YEAR * energyPrice(state, 'gas', period),
    lpg: loads.fossil.lpg * DAYS_PER_YEAR * energyPrice(state, 'lpg', period),
    wood: loads.fossil.wood * DAYS_PER_YEAR * WOOD_PRICE[period][state],
    petrol: loads.fossil.petrol * DAYS_PER_YEAR * energyPrice(state, 'petrol', period),
    diesel: loads.fossil.diesel * DAYS_PER_YEAR * energyPrice(state, 'diesel', period),
  };
  const otherEnergyCosts = Object.values(fossilCost).reduce((a, b) => a + b, 0);

  // One full supply charge per connected fuel. Every home stays on the grid.
  const fixedCostsByFuelType = {
    electricity: dailySupplyCharge(state, 'electricity', period) * DAYS_PER_YEAR,
    gas: loads.usesGas ? dailySupplyCharge(state, 'gas', period) * DAYS_PER_YEAR : 0,
    lpg: loads.usesLpg ? dailySupplyCharge(state, 'lpg', period) * DAYS_PER_YEAR : 0,
  };
  const fixedCosts = fixedCostsByFuelType.electricity + fixedCostsByFuelType.gas + fixedCostsByFuelType.lpg;

  const revenueFromSolarExport = (flows.exportKwh + flows.eveningExportKwh) * fit;

  // Servicing is a flat yearly cost per vehicle (not scaled by distance), the
  // same at both horizons, as in the R model.
  const vehicleMaintenanceCosts = loads.vehicleMaintenance;

  const annualCost =
    gridVolumeCosts + otherEnergyCosts + fixedCosts + vehicleMaintenanceCosts - revenueFromSolarExport;

  // Emissions: solar used directly or via the battery is zero-emission;
  // fast-charged and other grid kWh emit at the state grid factor.
  const gridKwhYear = Math.max(
    (paidHomeKwhDay + loads.evFastKwh) * DAYS_PER_YEAR - batteryKwhYear,
    0,
  );
  let annualEmissionsKg = gridKwhYear * emissionsFactor(state, 'electricity');
  for (const fuel of Object.keys(loads.fossil) as FossilFuel[]) {
    annualEmissionsKg += loads.fossil[fuel] * DAYS_PER_YEAR * emissionsFactor(state, fuel);
  }

  return {
    tariff,
    solarScenario,
    opex: {
      gridVolumeCosts,
      otherEnergyCosts,
      otherEnergyCostsByFuelType: fossilCost,
      fixedCosts,
      fixedCostsByFuelType,
      revenueFromSolarExport,
      vehicleMaintenanceCosts,
    },
    annualCost,
    annualEmissionsKg,
    flows,
  };
}
