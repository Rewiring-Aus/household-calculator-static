import { describe, it, expect } from 'vitest';
import { scaleDailyToPeriod } from '../utils/scaleDailyToPeriod';
import { scaleEnergyByOccupancy } from '../utils/scaleEnergyByOccupancy';
import { validateHousehold } from '../utils/validateHousehold';
import { cleanHousehold } from '../utils/cleanHousehold';
import { PeriodEnum, LocationEnum, SpaceHeatingEnum, WaterHeatingEnum, CooktopEnum, VehicleFuelTypeEnum } from '../types';
import type { Household } from '../types';

describe('scaleDailyToPeriod', () => {
  it('should return daily value unchanged', () => {
    expect(scaleDailyToPeriod(10, PeriodEnum.Daily)).toBe(10);
  });

  it('should multiply by 7 for weekly', () => {
    expect(scaleDailyToPeriod(10, PeriodEnum.Weekly)).toBe(70);
  });

  it('should multiply by 365.25 for yearly', () => {
    expect(scaleDailyToPeriod(10, PeriodEnum.Yearly)).toBeCloseTo(3652.5);
  });

  it('should multiply by 365.25 * 15 for lifetime', () => {
    expect(scaleDailyToPeriod(10, PeriodEnum.OperationalLifetime)).toBeCloseTo(54787.5);
  });
});

describe('scaleEnergyByOccupancy', () => {
  it('should scale down for 1 occupant', () => {
    expect(scaleEnergyByOccupancy(10, 1)).toBeCloseTo(5.6);
  });

  it('should scale up slightly for 4 occupants', () => {
    expect(scaleEnergyByOccupancy(10, 4)).toBeCloseTo(10.7);
  });

  it('should cap at 5+ occupants', () => {
    const scale5 = scaleEnergyByOccupancy(10, 5);
    const scale6 = scaleEnergyByOccupancy(10, 6);
    expect(scale5).toBeCloseTo(13.7);
    expect(scale6).toBeCloseTo(scale5);
  });
});

describe('validateHousehold', () => {
  const baseHousehold: Household = {
    location: LocationEnum.NewSouthWales,
    occupancy: 2,
    spaceHeating: SpaceHeatingEnum.Gas,
    waterHeating: WaterHeatingEnum.Gas,
    cooktop: CooktopEnum.Gas,
    vehicles: [],
    solar: { hasSolar: false, size: 0, installSolar: false },
    battery: { hasBattery: false, capacity: 0, installBattery: false },
  };

  it('should not throw for valid household', () => {
    expect(() => validateHousehold(baseHousehold)).not.toThrow();
  });

  it('should throw if battery requested without solar', () => {
    const invalid: Household = {
      ...baseHousehold,
      solar: { hasSolar: false, size: 0, installSolar: false },
      battery: { hasBattery: false, capacity: 11, installBattery: true },
    };
    expect(() => validateHousehold(invalid)).toThrow();
  });

  it('should not throw if battery requested with existing solar', () => {
    const valid: Household = {
      ...baseHousehold,
      solar: { hasSolar: true, size: 5, installSolar: false },
      battery: { hasBattery: false, capacity: 11, installBattery: true },
    };
    expect(() => validateHousehold(valid)).not.toThrow();
  });
});

describe('cleanHousehold', () => {
  it('should fill in missing kmsPerWeek with average', () => {
    const household: Household = {
      location: LocationEnum.NewSouthWales,
      occupancy: 2,
      spaceHeating: SpaceHeatingEnum.Gas,
      waterHeating: WaterHeatingEnum.Gas,
      cooktop: CooktopEnum.Gas,
      vehicles: [
        { fuelType: VehicleFuelTypeEnum.Petrol, switchToEV: true },
      ],
      solar: { hasSolar: false, size: 0, installSolar: false },
      battery: { hasBattery: false, capacity: 0, installBattery: false },
    };

    const cleaned = cleanHousehold(household);
    expect(cleaned.vehicles![0].kmsPerWeek).toBeGreaterThan(0);
  });

  it('should preserve specified kmsPerWeek', () => {
    const household: Household = {
      location: LocationEnum.NewSouthWales,
      occupancy: 2,
      spaceHeating: SpaceHeatingEnum.Gas,
      waterHeating: WaterHeatingEnum.Gas,
      cooktop: CooktopEnum.Gas,
      vehicles: [
        { fuelType: VehicleFuelTypeEnum.Petrol, kmsPerWeek: 300, switchToEV: true },
      ],
      solar: { hasSolar: false, size: 0, installSolar: false },
      battery: { hasBattery: false, capacity: 0, installBattery: false },
    };

    const cleaned = cleanHousehold(household);
    expect(cleaned.vehicles![0].kmsPerWeek).toBe(300);
  });
});
