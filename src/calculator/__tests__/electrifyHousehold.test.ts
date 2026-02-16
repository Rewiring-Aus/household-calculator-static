import { describe, it, expect } from 'vitest';
import { electrifyHousehold } from '../models/electrifyHousehold';
import {
  LocationEnum,
  SpaceHeatingEnum,
  WaterHeatingEnum,
  CooktopEnum,
  VehicleFuelTypeEnum,
  type Household,
} from '../types';

describe('electrifyHousehold', () => {
  it('should convert gas appliances to electric equivalents', () => {
    const household: Household = {
      location: LocationEnum.NewSouthWales,
      occupancy: 2,
      spaceHeating: SpaceHeatingEnum.Gas,
      waterHeating: WaterHeatingEnum.Gas,
      cooktop: CooktopEnum.Gas,
      vehicles: [],
      solar: { hasSolar: false, size: 5, installSolar: true },
      battery: { hasBattery: false, capacity: 10, installBattery: true },
    };

    const result = electrifyHousehold(household);

    expect(result.spaceHeating).toBe(SpaceHeatingEnum.ElectricHeatPump);
    expect(result.waterHeating).toBe(WaterHeatingEnum.ElectricHeatPump);
    expect(result.cooktop).toBe(CooktopEnum.ElectricInduction);
  });

  it('should keep already-electric appliances unchanged', () => {
    const household: Household = {
      location: LocationEnum.NewSouthWales,
      occupancy: 2,
      spaceHeating: SpaceHeatingEnum.ElectricHeatPump,
      waterHeating: WaterHeatingEnum.ElectricHeatPump,
      cooktop: CooktopEnum.ElectricInduction,
      vehicles: [],
      solar: { hasSolar: true, size: 5, installSolar: false },
      battery: { hasBattery: true, capacity: 10, installBattery: false },
    };

    const result = electrifyHousehold(household);

    expect(result.spaceHeating).toBe(SpaceHeatingEnum.ElectricHeatPump);
    expect(result.waterHeating).toBe(WaterHeatingEnum.ElectricHeatPump);
    expect(result.cooktop).toBe(CooktopEnum.ElectricInduction);
  });

  it('should keep electric resistance water heating unchanged', () => {
    const household: Household = {
      location: LocationEnum.NewSouthWales,
      occupancy: 2,
      spaceHeating: SpaceHeatingEnum.Gas,
      waterHeating: WaterHeatingEnum.ElectricResistance,
      cooktop: CooktopEnum.Gas,
      vehicles: [],
      solar: { hasSolar: false, size: 0, installSolar: false },
      battery: { hasBattery: false, capacity: 0, installBattery: false },
    };

    const result = electrifyHousehold(household);

    expect(result.waterHeating).toBe(WaterHeatingEnum.ElectricResistance);
  });

  it('should convert vehicles to EV when switchToEV is true', () => {
    const household: Household = {
      location: LocationEnum.NewSouthWales,
      occupancy: 2,
      spaceHeating: SpaceHeatingEnum.ElectricHeatPump,
      waterHeating: WaterHeatingEnum.ElectricHeatPump,
      cooktop: CooktopEnum.ElectricInduction,
      vehicles: [
        { fuelType: VehicleFuelTypeEnum.Petrol, kmsPerWeek: 200, switchToEV: true },
        { fuelType: VehicleFuelTypeEnum.Diesel, kmsPerWeek: 300, switchToEV: false },
      ],
      solar: { hasSolar: false, size: 0, installSolar: false },
      battery: { hasBattery: false, capacity: 0, installBattery: false },
    };

    const result = electrifyHousehold(household);

    expect(result.vehicles![0].fuelType).toBe(VehicleFuelTypeEnum.Electric);
    expect(result.vehicles![1].fuelType).toBe(VehicleFuelTypeEnum.Diesel);
  });

  it('should install solar when installSolar is true and hasSolar is false', () => {
    const household: Household = {
      location: LocationEnum.NewSouthWales,
      occupancy: 2,
      spaceHeating: SpaceHeatingEnum.ElectricHeatPump,
      waterHeating: WaterHeatingEnum.ElectricHeatPump,
      cooktop: CooktopEnum.ElectricInduction,
      vehicles: [],
      solar: { hasSolar: false, size: 7, installSolar: true },
      battery: { hasBattery: false, capacity: 0, installBattery: false },
    };

    const result = electrifyHousehold(household);

    expect(result.solar!.hasSolar).toBe(true);
  });

  it('should convert wood heating to electric heat pump', () => {
    const household: Household = {
      location: LocationEnum.Victoria,
      occupancy: 3,
      spaceHeating: SpaceHeatingEnum.Wood,
      waterHeating: WaterHeatingEnum.Gas,
      cooktop: CooktopEnum.Lpg,
      vehicles: [],
      solar: { hasSolar: false, size: 0, installSolar: false },
      battery: { hasBattery: false, capacity: 0, installBattery: false },
    };

    const result = electrifyHousehold(household);

    expect(result.spaceHeating).toBe(SpaceHeatingEnum.ElectricHeatPump);
    expect(result.cooktop).toBe(CooktopEnum.ElectricInduction);
  });
});
