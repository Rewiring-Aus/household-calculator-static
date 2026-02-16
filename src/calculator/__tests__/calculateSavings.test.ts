import { describe, it, expect } from 'vitest';
import { calculateSavings } from '../calculateSavings';
import {
  LocationEnum,
  SpaceHeatingEnum,
  WaterHeatingEnum,
  CooktopEnum,
  VehicleFuelTypeEnum,
  type Household,
} from '../types';
import { defaultHouseholdData, defaultSavingsData } from '../../assets/data/householdDefaults';

const TOLERANCE = 0.5; // Allow ±$0.50 or ±0.5 kg CO2

function expectClose(actual: number, expected: number, tol = TOLERANCE) {
  expect(Math.abs(actual - expected)).toBeLessThan(tol);
}

describe('calculateSavings - golden test with default household', () => {
  const result = calculateSavings(defaultHouseholdData);

  it('should calculate emissions per week correctly', () => {
    expectClose(result.emissions.perWeek.before, defaultSavingsData.emissions.perWeek.before);
    expectClose(result.emissions.perWeek.after, defaultSavingsData.emissions.perWeek.after);
    expectClose(result.emissions.perWeek.difference, defaultSavingsData.emissions.perWeek.difference);
  });

  it('should calculate emissions per year correctly', () => {
    expectClose(result.emissions.perYear.before, defaultSavingsData.emissions.perYear.before, 5);
    expectClose(result.emissions.perYear.after, defaultSavingsData.emissions.perYear.after, 5);
    expectClose(result.emissions.perYear.difference, defaultSavingsData.emissions.perYear.difference, 5);
  });

  it('should calculate opex per week correctly', () => {
    expectClose(result.opex.perWeek.before, defaultSavingsData.opex.perWeek.before, 1);
    expectClose(result.opex.perWeek.after, defaultSavingsData.opex.perWeek.after, 1);
    expectClose(result.opex.perWeek.difference, defaultSavingsData.opex.perWeek.difference, 1);
  });

  it('should calculate opex per year correctly', () => {
    expectClose(result.opex.perYear.before, defaultSavingsData.opex.perYear.before, 50);
    expectClose(result.opex.perYear.after, defaultSavingsData.opex.perYear.after, 50);
    expectClose(result.opex.perYear.difference, defaultSavingsData.opex.perYear.difference, 50);
  });

  it('should calculate upfront costs correctly', () => {
    // Solar cost: SOLAR_COST_PER_KW[NSW] * 7kW = 791 * 7 = 5537
    expectClose(result.upfrontCost!.solar!, 5537, 1);
    // Battery cost: BATTERY_COST_PER_KWH * 11kWh = 1100 * 11 = 12100
    expectClose(result.upfrontCost!.battery!, 12100, 1);
    // Cooktop: gas → induction = item_price + install_cost = 1400 + 600 = 2000
    expectClose(result.upfrontCost!.cooktop!, 2000, 1);
    // Water heating: electric resistance → stays same = 0
    expect(result.upfrontCost!.waterHeating).toBe(0);
    // Space heating: heat pump → stays same = 0
    expect(result.upfrontCost!.spaceHeating).toBe(0);
  });

  it('should recommend SOLAR as next action', () => {
    expect(result.recommendation?.action).toBe('SOLAR');
  });
});

describe('calculateSavings - fully electric household', () => {
  const fullyElectric: Household = {
    location: LocationEnum.NewSouthWales,
    occupancy: 2,
    spaceHeating: SpaceHeatingEnum.ElectricHeatPump,
    waterHeating: WaterHeatingEnum.ElectricHeatPump,
    cooktop: CooktopEnum.ElectricInduction,
    vehicles: [
      { fuelType: VehicleFuelTypeEnum.Electric, kmsPerWeek: 200, switchToEV: false },
    ],
    solar: { hasSolar: true, size: 7, installSolar: false },
    battery: { hasBattery: true, capacity: 11, installBattery: false },
  };

  const result = calculateSavings(fullyElectric);

  it('should have zero or near-zero savings (already electrified)', () => {
    expect(Math.abs(result.emissions.perWeek.difference)).toBeLessThan(1);
    expect(Math.abs(result.opex.perWeek.difference)).toBeLessThan(1);
  });

  it('should have zero upfront costs', () => {
    expect(result.upfrontCost!.solar).toBe(0);
    expect(result.upfrontCost!.battery).toBe(0);
    expect(result.upfrontCost!.cooktop).toBe(0);
    expect(result.upfrontCost!.waterHeating).toBe(0);
    expect(result.upfrontCost!.spaceHeating).toBe(0);
  });

  it('should recommend FULLY_ELECTRIFIED', () => {
    expect(result.recommendation?.action).toBe('FULLY_ELECTRIFIED');
  });
});

describe('calculateSavings - gas heavy household', () => {
  const gasHeavy: Household = {
    location: LocationEnum.Victoria,
    occupancy: 4,
    spaceHeating: SpaceHeatingEnum.Gas,
    waterHeating: WaterHeatingEnum.Gas,
    cooktop: CooktopEnum.Gas,
    vehicles: [
      { fuelType: VehicleFuelTypeEnum.Diesel, kmsPerWeek: 300, switchToEV: true },
    ],
    solar: { hasSolar: false, size: 10, installSolar: true },
    battery: { hasBattery: false, capacity: 13, installBattery: true },
  };

  const result = calculateSavings(gasHeavy);

  it('should show significant emissions savings', () => {
    expect(result.emissions.perYear.difference).toBeLessThan(-1000);
  });

  it('should show significant opex savings', () => {
    expect(result.opex.perYear.difference).toBeLessThan(-1000);
  });

  it('should have non-zero upfront costs for all appliances', () => {
    expect(result.upfrontCost!.spaceHeating!).toBeGreaterThan(0);
    expect(result.upfrontCost!.waterHeating!).toBeGreaterThan(0);
    expect(result.upfrontCost!.cooktop!).toBeGreaterThan(0);
    expect(result.upfrontCost!.solar!).toBeGreaterThan(0);
    expect(result.upfrontCost!.battery!).toBeGreaterThan(0);
  });

  it('should recommend SOLAR as highest priority', () => {
    expect(result.recommendation?.action).toBe('SOLAR');
  });
});

describe('calculateSavings - no solar no battery', () => {
  const noSolarBattery: Household = {
    location: LocationEnum.Queensland,
    occupancy: 1,
    spaceHeating: SpaceHeatingEnum.ElectricResistance,
    waterHeating: WaterHeatingEnum.Gas,
    cooktop: CooktopEnum.ElectricResistance,
    vehicles: [],
    solar: { hasSolar: false, size: 0, installSolar: false },
    battery: { hasBattery: false, capacity: 0, installBattery: false },
  };

  const result = calculateSavings(noSolarBattery);

  it('should have zero solar and battery upfront costs', () => {
    expect(result.upfrontCost!.solar).toBe(0);
    expect(result.upfrontCost!.battery).toBe(0);
  });

  it('should still show some savings from water heating upgrade', () => {
    expect(result.opex.perYear.difference).toBeLessThan(0);
  });
});

describe('calculateSavings - all locations produce valid results', () => {
  const locations = Object.values(LocationEnum);

  for (const location of locations) {
    it(`should produce valid results for ${location}`, () => {
      const household: Household = {
        location,
        occupancy: 2,
        spaceHeating: SpaceHeatingEnum.Gas,
        waterHeating: WaterHeatingEnum.Gas,
        cooktop: CooktopEnum.Gas,
        vehicles: [{ fuelType: VehicleFuelTypeEnum.Petrol, kmsPerWeek: 200, switchToEV: true }],
        solar: { hasSolar: false, size: 5, installSolar: true },
        battery: { hasBattery: false, capacity: 10, installBattery: true },
      };

      const result = calculateSavings(household);

      expect(result.emissions.perWeek.before).toBeGreaterThan(0);
      expect(result.emissions.perWeek.after).toBeGreaterThanOrEqual(0);
      expect(result.opex.perWeek.before).toBeGreaterThan(0);
      expect(result.upfrontCost).toBeDefined();
      expect(result.recommendation).toBeDefined();
    });
  }
});
