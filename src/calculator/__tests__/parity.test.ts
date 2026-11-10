// Parity with the Energy Savings 2026 R model.
//
// The R model prices fixed whole-home scenarios; for each one we build the same
// household in the calculator and compare annual running cost (energy + supply
// charges + vehicle servicing − solar/battery credits) and emissions.
// Reference figures: scripts/parity/r_reference.R → fixtures/r_reference.csv.

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { evaluateHousehold } from '../engine/evaluateHousehold';
import { KM_PER_DAY, STATE_CODE, type Period } from '../constants/model2026';
import {
  CooktopEnum,
  LocationEnum,
  SpaceHeatingEnum,
  VehicleClassEnum,
  VehicleFuelTypeEnum,
  WaterHeatingEnum,
  type Household,
} from '../types';

interface RefRow {
  state: string;
  period: Period;
  scenario: string;
  tariff: string;
  running: number;
  tco2e: number;
}

const csv = fs.readFileSync(path.join(__dirname, 'fixtures', 'r_reference.csv'), 'utf8').trim().split('\n');
const header = csv[0].split(',');
const ref: RefRow[] = csv.slice(1).map((line) => {
  const f = Object.fromEntries(line.split(',').map((v, i) => [header[i], v]));
  return {
    state: f.state, period: f.period as Period, scenario: f.scenario, tariff: f.tariff,
    running: Number(f.running), tco2e: Number(f.tco2e),
  };
});

const LOCATION_FOR: Record<string, LocationEnum> = Object.fromEntries(
  Object.entries(STATE_CODE).map(([loc, code]) => [code, loc as LocationEnum]),
);

function household(location: LocationEnum, scenario: string): Household | null {
  const km = KM_PER_DAY[STATE_CODE[location]] * 7;
  const fossil = (heat: SpaceHeatingEnum, water: WaterHeatingEnum, cook: CooktopEnum, solar: boolean): Household => ({
    location, occupancy: 3, spaceHeating: heat, waterHeating: water, cooktop: cook,
    vehicles: [{ fuelType: VehicleFuelTypeEnum.Petrol, vehicleClass: VehicleClassEnum.Suv, kmsPerWeek: km }],
    solar: { hasSolar: solar, size: 10 }, battery: { hasBattery: solar, capacity: 15 },
  });
  const electric = (solar: boolean): Household => ({
    location, occupancy: 3,
    spaceHeating: SpaceHeatingEnum.ElectricHeatPump, waterHeating: WaterHeatingEnum.ElectricHeatPump,
    cooktop: CooktopEnum.ElectricInduction,
    vehicles: [{ fuelType: VehicleFuelTypeEnum.Electric, vehicleClass: VehicleClassEnum.Suv, kmsPerWeek: km }],
    solar: { hasSolar: solar, size: 10 }, battery: { hasBattery: solar, capacity: 15 },
  });
  switch (scenario) {
    case 'Gas': return fossil(SpaceHeatingEnum.Gas, WaterHeatingEnum.Gas, CooktopEnum.Gas, false);
    case 'Gas + solar': return fossil(SpaceHeatingEnum.Gas, WaterHeatingEnum.Gas, CooktopEnum.Gas, true);
    case 'LPG': return fossil(SpaceHeatingEnum.Lpg, WaterHeatingEnum.Lpg, CooktopEnum.Lpg, false);
    case 'Electric (grid_only)': return electric(false);
    case 'Electric (solar_optimised)': return electric(true);
    default: return null; // Electric (solar): the calculator always optimises an all-electric solar home
  }
}

describe('parity with the R model', () => {
  const cases = ref.filter((r) => Number.isFinite(r.running) && household(LOCATION_FOR[r.state], r.scenario));
  it.each(cases.map((r) => [`${r.state} ${r.period} ${r.scenario}`, r] as const))('%s', (_, r) => {
    const result = evaluateHousehold(household(LOCATION_FOR[r.state], r.scenario)!, r.period);
    expect(result.tariff).toBe(r.tariff);
    // Within $5/yr and 0.01 t/yr.
    expect(Math.abs(result.annualCost - r.running)).toBeLessThan(5);
    // Known difference: the source data has no TAS gas emissions factor, which R
    // counts as zero. The calculator uses the national factor instead.
    if (r.state === 'TAS' && r.scenario.startsWith('Gas')) return;
    expect(Math.abs(result.annualEmissionsKg / 1000 - r.tco2e)).toBeLessThan(0.01);
  });
});
