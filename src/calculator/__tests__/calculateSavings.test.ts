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
import { defaultHouseholdData } from '../../assets/data/householdDefaults';

describe('calculateSavings - default household (NSW, gas hot water and cooktop, adding 10 kW solar + 13 kWh battery)', () => {
  const result = calculateSavings(defaultHouseholdData);

  it('saves money and emissions', () => {
    expect(result.opex!.perYear.difference).toBeLessThan(0);
    expect(result.emissions!.perYear.difference).toBeLessThan(0);
  });

  it('reports weekly figures consistent with yearly ones', () => {
    expect(result.opex!.perWeek.before).toBeCloseTo((result.opex!.perYear.before * 7) / 365, 1);
  });

  it('prices upgrades from the 2026 product prices', () => {
    // NSW panels $649/kW × 10 kW + one $1,800 string inverter
    expect(result.upfrontCost!.solar).toBe(8290);
    // Subsidised $620/kWh; no separate installation when installed with new solar
    expect(result.upfrontCost!.battery).toBe(8060);
    expect(result.upfrontCost!.cooktop).toBe(2200);
    expect(result.upfrontCost!.waterHeating).toBe(3900);
    expect(result.upfrontCost!.spaceHeating).toBe(0);
  });

  it('moves the electrified home onto time-of-use and reports that saving', () => {
    expect(result.tariffSwitch).toBeDefined();
    expect(result.tariffSwitch!.perYear).toBeGreaterThan(0);
    expect(result.tariffSwitch!.perYear).toBeLessThan(-result.opex!.perYear.difference);
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
    expect(Math.abs(result.emissions!.perWeek.difference)).toBeLessThan(1);
    expect(Math.abs(result.opex!.perWeek.difference)).toBeLessThan(1);
  });

  it('reports no tariff switch (already on time-of-use)', () => {
    expect(result.tariffSwitch).toBeUndefined();
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
