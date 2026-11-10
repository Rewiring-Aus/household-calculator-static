// Typed lookups over the Energy Savings 2026 model's input data
// (model2026.generated.ts), plus the few values the calculator keeps from the
// earlier household model because the 2026 model has no equivalent.

import {
  CooktopEnum,
  DwellingEnum,
  LocationEnum,
  SpaceHeatingEnum,
  VehicleClassEnum,
  WaterHeatingEnum,
} from '../types';
import {
  AUS_GAS_EMISSIONS_FACTOR,
  EMISSIONS_FACTORS,
  ENERGY_USE,
  FUEL_PRICES,
  MODEL_DEFAULTS,
  OCCUPANCY_SCALING,
  SOLAR_FRACTIONS,
  VEHICLE_EFFICIENCY,
  VEHICLE_MAINTENANCE,
  type FuelPrice,
  type StateCode,
} from './model2026.generated';

export * from './model2026.generated';

export type Period = '1year' | '15year';
export type SolarScenario = 'grid_only' | 'solar' | 'solar_optimised';
export type Tariff = 'flat' | 'tou';

export const OPERATIONAL_LIFETIME = 15;
export const DAYS_PER_YEAR = 365;

export const STATE_CODE: Record<LocationEnum, StateCode> = {
  [LocationEnum.NewSouthWales]: 'NSW',
  [LocationEnum.Victoria]: 'VIC',
  [LocationEnum.Queensland]: 'QLD',
  [LocationEnum.SouthAustralia]: 'SA',
  [LocationEnum.WesternAustralia]: 'WA',
  [LocationEnum.Tasmania]: 'TAS',
  [LocationEnum.NorthernTerritory]: 'NT',
  [LocationEnum.AustralianCapitalTerritory]: 'ACT',
};

// ---------------------------------------------------------------------------
// Prices
// ---------------------------------------------------------------------------

export type PriceFuel =
  | 'electricity'
  | 'electricity_off_peak'
  | 'solar_export'
  | 'gas'
  | 'lpg'
  | 'petrol'
  | 'diesel'
  | 'ev_fast_charge';

function priceRow(state: StateCode, fuel: PriceFuel): FuelPrice {
  // The NT has no reticulated gas, so the 2026 data has no gas row there. A
  // household that says it has gas in the NT is on bottled gas: price it as LPG.
  const resolved = fuel === 'gas' && FUEL_PRICES[state].gas == null ? 'lpg' : fuel;
  const row = FUEL_PRICES[state][resolved];
  if (!row) throw new Error(`No ${fuel} price for ${state}`);
  return row;
}

/** $/kWh. 1-year uses current 2026 prices; 15-year uses the 15-year average forecast. */
export function energyPrice(state: StateCode, fuel: PriceFuel, period: Period): number {
  const row = priceRow(state, fuel);
  return period === '1year' ? row.current : row.forecast15;
}

/** $/day supply charge for a connected fuel (electricity, gas, LPG). */
export function dailySupplyCharge(state: StateCode, fuel: 'electricity' | 'gas' | 'lpg', period: Period): number {
  const row = priceRow(state, fuel);
  const daily = period === '1year' ? row.dailyCurrent : row.dailyForecast15;
  return daily ?? 0;
}

// ---------------------------------------------------------------------------
// Wood — not in the 2026 model's price or emissions data. Carried over
// unchanged from the earlier household model.
// ---------------------------------------------------------------------------

export const WOOD_PRICE: Record<Period, Record<StateCode, number>> = {
  '1year': { VIC: 0.11, NSW: 0.14, NT: 0.151, ACT: 0.094, TAS: 0.067, WA: 0.14, SA: 0.111, QLD: 0.151 },
  '15year': { VIC: 0.15, NSW: 0.17, NT: 0.16, ACT: 0.12, TAS: 0.08, WA: 0.17, SA: 0.14, QLD: 0.18 },
};
export const WOOD_EMISSIONS_FACTOR = 0.4;

// ---------------------------------------------------------------------------
// Emissions (kgCO2e/kWh)
// ---------------------------------------------------------------------------

export type EmittingFuel = 'electricity' | 'gas' | 'lpg' | 'wood' | 'petrol' | 'diesel';

export function emissionsFactor(state: StateCode, fuel: EmittingFuel): number {
  const row = EMISSIONS_FACTORS[state];
  if (fuel === 'wood') return WOOD_EMISSIONS_FACTOR;
  if (fuel === 'gas') {
    // NT gas is priced as LPG (see priceRow), so it emits as LPG. TAS has no
    // gas factor in the source data; use the national figure.
    if (FUEL_PRICES[state].gas == null) return row.lpg;
    return row.gas ?? AUS_GAS_EMISSIONS_FACTOR;
  }
  return row[fuel];
}

// ---------------------------------------------------------------------------
// Energy use
// ---------------------------------------------------------------------------

export function energyKwhDay(category: string, applianceType: string, state: StateCode): number {
  const v = ENERGY_USE[category]?.[applianceType]?.[state];
  if (v == null) throw new Error(`No energy use for ${category} / ${applianceType} / ${state}`);
  return v;
}

export function sumCategoryKwhDay(category: string, state: StateCode): number {
  return Object.values(ENERGY_USE[category] ?? {}).reduce((sum, byState) => sum + byState[state], 0);
}

/** Occupancy multiplier, linearly interpolated between the AER benchmark points (1.00 at 2.7). */
export function occupancyScale(occupants: number | undefined | null): number {
  if (occupants == null) return 1;
  const pts = OCCUPANCY_SCALING;
  if (occupants <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    if (occupants <= x1) {
      const [x0, y0] = pts[i - 1];
      return y0 + ((occupants - x0) * (y1 - y0)) / (x1 - x0);
    }
  }
  return pts[pts.length - 1][1];
}

export function dwellingScale(dwelling: DwellingEnum | undefined): number {
  return dwelling === DwellingEnum.Apartment ? MODEL_DEFAULTS.apartmentEnergyFactor : 1;
}

/** Fuel and 2026 energy-table row for each household option. */
export const SPACE_HEATING_ROW: Record<SpaceHeatingEnum, { fuel: EmittingFuel | 'none'; type: string | null }> = {
  [SpaceHeatingEnum.Gas]: { fuel: 'gas', type: 'Natural gas' },
  [SpaceHeatingEnum.Lpg]: { fuel: 'lpg', type: 'LPG' },
  [SpaceHeatingEnum.Wood]: { fuel: 'wood', type: 'Wood' },
  // Diesel space heating has no energy data in either model; it contributes nothing.
  [SpaceHeatingEnum.Diesel]: { fuel: 'diesel', type: null },
  [SpaceHeatingEnum.ElectricResistance]: { fuel: 'electricity', type: 'Electric resistance' },
  [SpaceHeatingEnum.ElectricHeatPump]: { fuel: 'electricity', type: 'Electric heat pump' },
  [SpaceHeatingEnum.None]: { fuel: 'none', type: null },
};

export const WATER_HEATING_ROW: Record<WaterHeatingEnum, { fuel: EmittingFuel | 'solar'; type: string }> = {
  [WaterHeatingEnum.Gas]: { fuel: 'gas', type: 'Natural gas' },
  [WaterHeatingEnum.Lpg]: { fuel: 'lpg', type: 'LPG' },
  [WaterHeatingEnum.ElectricResistance]: { fuel: 'electricity', type: 'Electric resistance' },
  [WaterHeatingEnum.ElectricHeatPump]: { fuel: 'electricity', type: 'Electric heat pump' },
  // Solar thermal: energy approximated by the heat-pump row and priced at $0
  // with zero emissions (as in the earlier household model and electric-saul).
  [WaterHeatingEnum.Solar]: { fuel: 'solar', type: 'Electric heat pump' },
};

export const COOKTOP_ROW: Record<CooktopEnum, { fuel: EmittingFuel; type: string }> = {
  [CooktopEnum.Gas]: { fuel: 'gas', type: 'Natural gas' },
  [CooktopEnum.Lpg]: { fuel: 'lpg', type: 'LPG' },
  [CooktopEnum.ElectricResistance]: { fuel: 'electricity', type: 'Electric resistance' },
  [CooktopEnum.ElectricInduction]: { fuel: 'electricity', type: 'Electric induction' },
};

// ---------------------------------------------------------------------------
// Vehicles
// ---------------------------------------------------------------------------

const CLASS_KEY: Record<VehicleClassEnum, keyof typeof VEHICLE_EFFICIENCY> = {
  [VehicleClassEnum.Hatchback]: 'hatchback',
  [VehicleClassEnum.Sedan]: 'sedan',
  [VehicleClassEnum.Suv]: 'suv',
};

export const DEFAULT_VEHICLE_CLASS = VehicleClassEnum.Suv;

export function vehicleEfficiency(vehicleClass: VehicleClassEnum | undefined) {
  return VEHICLE_EFFICIENCY[CLASS_KEY[vehicleClass ?? DEFAULT_VEHICLE_CLASS]];
}

/** Annual servicing, tyres and consumables ($/yr) for one vehicle of this class. */
export function vehicleMaintenance(vehicleClass: VehicleClassEnum | undefined, drivetrain: 'ev' | 'ice'): number {
  return VEHICLE_MAINTENANCE[CLASS_KEY[vehicleClass ?? DEFAULT_VEHICLE_CLASS]][drivetrain];
}

/** Hybrids are a fixed blend of the petrol and EV figures (earlier household model, also used by electric-saul). */
export const HYBRID_PETROL_SHARE = 0.7;
export const PLUG_IN_HYBRID_PETROL_SHARE = 0.6;

// ---------------------------------------------------------------------------
// Solar fractions (solar_fraction_table.csv)
// ---------------------------------------------------------------------------

function fractionRow(category: string, applianceType?: string) {
  const exact = applianceType
    ? SOLAR_FRACTIONS.find((r) => r.category === category && r.applianceType === applianceType)
    : undefined;
  const row = exact ?? SOLAR_FRACTIONS.find((r) => r.category === category && r.applianceType == null);
  if (!row) throw new Error(`No solar fraction row for ${category}`);
  return row;
}

/** Share of a load that falls inside the solar generation window. */
export function solarFraction(category: string, scenario: SolarScenario, applianceType?: string): number {
  return fractionRow(category, applianceType)[scenario];
}

/** Share of a load always bought from the grid, whatever storage exists. */
export function minRetailFraction(category: string, applianceType?: string): number {
  return fractionRow(category, applianceType).min_retail;
}
