import { describe, it, expect } from 'vitest';
import { validateHousehold } from '../utils/validateHousehold';
import { cleanHousehold } from '../utils/cleanHousehold';
import { LocationEnum, SpaceHeatingEnum, WaterHeatingEnum, CooktopEnum, VehicleFuelTypeEnum } from '../types';
import type { Household } from '../types';

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
