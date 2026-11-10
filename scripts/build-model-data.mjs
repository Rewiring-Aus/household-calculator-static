#!/usr/bin/env node
// Builds src/calculator/constants/model2026.generated.ts from the input CSVs of
// the Energy Savings 2026 model (https://github.com/Rewiring-Aus/energy-savings-2026-model).
//
// Usage:
//   node scripts/build-model-data.mjs [path/to/energy-savings-2026-model/data]
//
// Defaults to ../energy-savings-2026-model/data (a sibling checkout). Re-run it
// whenever the model's input data changes, then `npx vitest run` and commit the
// regenerated file. Nothing in the calculator reads the CSVs at runtime.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');
const dataDir = path.resolve(process.argv[2] ?? path.join(repoRoot, '..', 'energy-savings-2026-model', 'data'));
const outFile = path.join(repoRoot, 'src', 'calculator', 'constants', 'model2026.generated.ts');

const STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];

// --- CSV ------------------------------------------------------------------

function parseCsv(text) {
  text = text.replace(/^﻿/, '');
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f !== '')) rows.push(row);
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

function readCsv(name) {
  const file = path.join(dataDir, name);
  if (!fs.existsSync(file)) throw new Error(`Missing input file: ${file}`);
  return parseCsv(fs.readFileSync(file, 'utf8'));
}

function num(value, what) {
  if (value === '' || value === 'NA' || value == null) return null;
  const n = Number(String(value).replace(/,/g, '').replace(/%$/, ''));
  if (!Number.isFinite(n)) throw new Error(`Not a number for ${what}: ${value}`);
  return n;
}

function req(value, what) {
  const n = num(value, what);
  if (n == null) throw new Error(`Missing value for ${what}`);
  return n;
}

// --- Fuel prices ------------------------------------------------------------

const PRICE_FUELS = ['electricity', 'electricity_off_peak', 'solar_export', 'gas', 'lpg', 'petrol', 'diesel', 'ev_fast_charge'];
const fuelPrices = {};
for (const s of STATES) fuelPrices[s] = {};
for (const r of readCsv('fuel_prices_by_state_simple.csv')) {
  if (!STATES.includes(r.state) || !PRICE_FUELS.includes(r.fuel)) continue;
  fuelPrices[r.state][r.fuel] = {
    current: req(r.current_dol_kwh, `${r.state} ${r.fuel} current`),
    forecast15: req(r.forecast_15yr_avg_dol_kwh, `${r.state} ${r.fuel} forecast`),
    dailyCurrent: num(r.daily_charge_dol_day, `${r.state} ${r.fuel} daily`),
    dailyForecast15: num(r.forecast_15yr_avg_daily_dol, `${r.state} ${r.fuel} daily forecast`),
  };
}
for (const s of STATES) {
  for (const f of PRICE_FUELS) {
    if (f === 'gas' && s === 'NT') continue; // no reticulated gas in the NT
    if (!fuelPrices[s][f]) throw new Error(`No ${f} price for ${s}`);
  }
}

// --- Emissions --------------------------------------------------------------

const emissions = {};
for (const r of readCsv('emissions_factors_by_state.csv')) {
  if (!STATES.includes(r.state)) continue;
  emissions[r.state] = {
    electricity: req(r.grid_electricity_kgCO2e_per_kWh, `${r.state} grid EF`),
    gas: num(r.natural_gas_kgCO2e_per_kWh, `${r.state} gas EF`),
    lpg: req(r.lpg_kgCO2e_per_kWh, `${r.state} LPG EF`),
    petrol: req(r.petrol_kgCO2e_per_kWh, `${r.state} petrol EF`),
    diesel: req(r.diesel_kgCO2e_per_kWh, `${r.state} diesel EF`),
  };
}
const ausGasEf = req(
  readCsv('emissions_factors_by_state.csv').find((r) => r.state === 'AUS').natural_gas_kgCO2e_per_kWh,
  'AUS gas EF',
);

// --- Appliance energy -------------------------------------------------------

const energyUse = {};
for (const r of readCsv('average_energy_use_by_appliance_and_state.csv')) {
  const cat = r.Category;
  const type = r['Appliance Type'];
  energyUse[cat] ??= {};
  energyUse[cat][type] = Object.fromEntries(STATES.map((s) => [s, req(r[s], `${cat}/${type}/${s}`)]));
}

const occupancyScaling = readCsv('energy_consumption_scaling_factors.csv').map((r) => [
  req(r.Occupants, 'occupants'),
  req(r['Energy Consumption Scaling Factor'], 'scaling factor'),
]);

// --- Vehicles ---------------------------------------------------------------

const CLASS_KEYS = { 'hatchback/micro car': 'hatchback', sedan: 'sedan', SUV: 'suv' };
const vehicleEfficiency = {};
for (const r of readCsv('vehicle_average_efficiency_by_class.csv')) {
  const key = CLASS_KEYS[r.vehicle_class];
  if (!key) continue;
  vehicleEfficiency[key] = {
    evWhPerKm: req(r.avg_energy_consumption_wh_per_km, `${key} EV Wh/km`),
    iceWhPerKm: req(r.ice_avg_energy_consumption_wh_per_km, `${key} ICE Wh/km`),
  };
}

// Annual servicing, tyres and consumables per vehicle (registration and insurance excluded).
const MAINT_CLASS = { Hatchback: 'hatchback', Sedan: 'sedan', SUV: 'suv' };
const vehicleMaintenance = {};
for (const r of readCsv('Vehicle_maintenance.csv')) {
  const key = MAINT_CLASS[r.Model];
  if (!key) continue;
  vehicleMaintenance[key] ??= {};
  vehicleMaintenance[key][r.Fuel === 'EV' ? 'ev' : 'ice'] = req(r.Annual, `${r.Model} ${r.Fuel} maintenance`);
}
for (const k of Object.values(MAINT_CLASS)) {
  if (vehicleMaintenance[k]?.ev == null || vehicleMaintenance[k]?.ice == null) throw new Error(`Missing maintenance for ${k}`);
}

const kmPerDay = {};
for (const r of readCsv('average_km_per_day_by_state.csv')) {
  if (STATES.includes(r.state)) kmPerDay[r.state] = req(r.km_per_day_middle, `${r.state} km/day`);
}

// --- Solar ------------------------------------------------------------------

const solarByState = {};
for (const r of readCsv('solar_lcoe_by_state.csv')) {
  if (!STATES.includes(r.state)) continue;
  solarByState[r.state] = {
    capacityFactor: req(r.capacity_factor, `${r.state} capacity factor`),
    costPerKw: req(r.cost_per_kw, `${r.state} PV $/kW`),
    inverterCost: req(r.inverter_cost, `${r.state} inverter`),
  };
}

const solarFractions = readCsv('solar_fraction_table.csv').map((r) => ({
  category: r.category,
  applianceType: r.appliance_type || null,
  grid_only: req(r.grid_only, 'grid_only'),
  solar: req(r.solar, 'solar'),
  solar_optimised: req(r.solar_optimised, 'solar_optimised'),
  min_retail: req(r.min_retail, 'min_retail'),
}));

// --- Capex ------------------------------------------------------------------

const productPrices = {};
for (const r of readCsv('Energy Savings 2026 - input data - FINAL product prices.csv')) {
  if (!r.Technology || r.Region !== 'AUS') continue;
  productPrices[r.Technology] = req(r['Total installed'], r.Technology);
}
const PRODUCTS = {
  heatPumpHeater: 'Reverse cycle AC ~7kW',
  heatPumpWaterHeater: 'Water Heater Heat Pumps',
  inductionCooktop: 'Induction Cooktops',
  batteryPerKwhWithSolar: 'Subsidised home battery cost per kW',
  batteryPerKwhRetrofit: 'Unsubsidised home battery cost per kW',
  batteryInstallation: 'Battery installation',
};
const capex = Object.fromEntries(
  Object.entries(PRODUCTS).map(([k, name]) => {
    if (productPrices[name] == null) throw new Error(`Missing product price: ${name}`);
    return [k, productPrices[name]];
  }),
);

const heatersPerHome = {};
for (const r of readCsv('Heater_numbers_by_state.csv')) {
  if (STATES.includes(r.State)) heatersPerHome[r.State] = req(r['Number of heaters'], `${r.State} heaters`);
}

// Only the subsidies the calculator can test eligibility for: everyone, or by
// dwelling type. Landlord, VPP and network-specific rows need inputs the
// calculator doesn't collect.
const subsidies = readCsv('Appliance_subsidies.csv')
  .filter((r) => STATES.includes(r.State) && ['All', 'Apartment'].includes(r.Eligibility))
  .filter((r) => ['Solar', 'Heat pump'].includes(r.Appliance))
  .map((r) => ({
    state: r.State,
    appliance: r.Appliance,
    value: req(r['Subsidy value'], 'subsidy'),
    eligibility: r.Eligibility,
  }));

// --- Model defaults ---------------------------------------------------------

const defaults = Object.fromEntries(readCsv('model_defaults.csv').map((r) => [r.parameter, r.value]));
const d = (k) => req(defaults[k], k);
const modelDefaults = {
  apartmentEnergyFactor: d('apartment_energy_factor'),
  fastChargeFraction: d('fast_charge_fraction'),
  batteryRoundTripEfficiency: d('battery_round_trip_efficiency'),
  batteryUseableCapacityPct: d('battery_useable_capacity_pct'),
  batteryDegradation1yr: d('battery_degradation_1yr'),
  batteryDegradation15yr: d('battery_degradation_15yr'),
  householdSafeguardPct: d('household_safeguard_pct'),
  solarSeasonalWeights: {
    spring: d('solar_seasonal_weight_spring'),
    summer: d('solar_seasonal_weight_summer'),
    autumn: d('solar_seasonal_weight_autumn'),
    winter: d('solar_seasonal_weight_winter'),
  },
  inverterReplacementYear: d('inverter_replacement_year'),
  microinverterMaxSolarKwp: d('microinverter_max_solar_kwp'),
  microinverterCostPerKw: d('microinverter_cost_per_kw'),
};

// --- Write ------------------------------------------------------------------

const json = (v) => JSON.stringify(v, null, 2);
const out = `// GENERATED FILE — do not edit by hand.
// Built by scripts/build-model-data.mjs from the Energy Savings 2026 model's
// input CSVs (energy-savings-2026-model/data). Re-run the script to update.

export const STATES = ${json(STATES)} as const;
export type StateCode = (typeof STATES)[number];

export interface FuelPrice {
  current: number;
  forecast15: number;
  dailyCurrent: number | null;
  dailyForecast15: number | null;
}

/** Retail $/kWh and $/day supply charges (current 2026 and 15-year average forecast). The NT has no gas row. */
export const FUEL_PRICES: Record<StateCode, Partial<Record<string, FuelPrice>>> = ${json(fuelPrices)};

/** kgCO2e/kWh. Gas is null where the source has no factor (NT, TAS). */
export const EMISSIONS_FACTORS: Record<StateCode, { electricity: number; gas: number | null; lpg: number; petrol: number; diesel: number }> = ${json(emissions)};

export const AUS_GAS_EMISSIONS_FACTOR = ${ausGasEf};

/** Average household energy use, kWh/day, by category → appliance type → state (2.7 occupants, detached house). */
export const ENERGY_USE: Record<string, Record<string, Record<StateCode, number>>> = ${json(energyUse)};

/** [occupants, scaling factor] — linearly interpolated, 5 = 5+. */
export const OCCUPANCY_SCALING: [number, number][] = ${json(occupancyScaling)};

export const VEHICLE_EFFICIENCY: Record<'hatchback' | 'sedan' | 'suv', { evWhPerKm: number; iceWhPerKm: number }> = ${json(vehicleEfficiency)};

/** Annual servicing, tyres and consumables per vehicle ($/yr). */
export const VEHICLE_MAINTENANCE: Record<'hatchback' | 'sedan' | 'suv', { ev: number; ice: number }> = ${json(vehicleMaintenance)};

/** Middle-tier km per vehicle per day. */
export const KM_PER_DAY: Record<StateCode, number> = ${json(kmPerDay)};

export const SOLAR_BY_STATE: Record<StateCode, { capacityFactor: number; costPerKw: number; inverterCost: number }> = ${json(solarByState)};

export interface SolarFractionRow {
  category: string;
  applianceType: string | null;
  grid_only: number;
  solar: number;
  solar_optimised: number;
  min_retail: number;
}
export const SOLAR_FRACTIONS: SolarFractionRow[] = ${json(solarFractions)};

/** Installed costs ($, AUS). Battery figures are per kWh. */
export const CAPEX = ${json(capex)};

export const HEATERS_PER_HOME: Record<StateCode, number> = ${json(heatersPerHome)};

export const SUBSIDIES: { state: string; appliance: string; value: number; eligibility: string }[] = ${json(subsidies)};

export const MODEL_DEFAULTS = ${json(modelDefaults)};
`;

fs.writeFileSync(outFile, out);
console.log(`Wrote ${path.relative(repoRoot, outFile)} from ${dataDir}`);
