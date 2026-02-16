import { describe, it, expect } from 'vitest';
import { recommendNextAction } from '../models/recommendNextAction';
import {
  LocationEnum,
  SpaceHeatingEnum,
  WaterHeatingEnum,
  CooktopEnum,
  VehicleFuelTypeEnum,
  RecommendationActionEnum,
  type Household,
} from '../types';

const baseHousehold: Household = {
  location: LocationEnum.NewSouthWales,
  occupancy: 2,
  spaceHeating: SpaceHeatingEnum.ElectricHeatPump,
  waterHeating: WaterHeatingEnum.ElectricHeatPump,
  cooktop: CooktopEnum.ElectricInduction,
  vehicles: [],
  solar: { hasSolar: true, size: 7, installSolar: false },
  battery: { hasBattery: true, capacity: 11, installBattery: false },
};

describe('recommendNextAction', () => {
  it('should recommend SOLAR when no solar and wants solar', () => {
    const household: Household = {
      ...baseHousehold,
      solar: { hasSolar: false, size: 7, installSolar: true },
    };
    const result = recommendNextAction(household);
    expect(result.action).toBe(RecommendationActionEnum.Solar);
  });

  it('should recommend VEHICLE when has solar but has petrol vehicles switching to EV', () => {
    const household: Household = {
      ...baseHousehold,
      vehicles: [
        { fuelType: VehicleFuelTypeEnum.Petrol, kmsPerWeek: 200, switchToEV: true },
      ],
    };
    const result = recommendNextAction(household);
    expect(result.action).toBe(RecommendationActionEnum.Vehicle);
  });

  it('should recommend SPACE_HEATING when gas heater and all higher priorities met', () => {
    const household: Household = {
      ...baseHousehold,
      spaceHeating: SpaceHeatingEnum.Gas,
    };
    const result = recommendNextAction(household);
    expect(result.action).toBe(RecommendationActionEnum.SpaceHeating);
  });

  it('should recommend WATER_HEATING when gas water heater and higher priorities met', () => {
    const household: Household = {
      ...baseHousehold,
      waterHeating: WaterHeatingEnum.Gas,
    };
    const result = recommendNextAction(household);
    expect(result.action).toBe(RecommendationActionEnum.WaterHeating);
  });

  it('should recommend COOKTOP when gas cooktop and higher priorities met', () => {
    const household: Household = {
      ...baseHousehold,
      cooktop: CooktopEnum.Gas,
    };
    const result = recommendNextAction(household);
    expect(result.action).toBe(RecommendationActionEnum.Cooking);
  });

  it('should recommend BATTERY when no battery and all appliances electrified', () => {
    const household: Household = {
      ...baseHousehold,
      battery: { hasBattery: false, capacity: 11, installBattery: true },
    };
    const result = recommendNextAction(household);
    expect(result.action).toBe(RecommendationActionEnum.Battery);
  });

  it('should recommend FULLY_ELECTRIFIED when everything is electrified', () => {
    const result = recommendNextAction(baseHousehold);
    expect(result.action).toBe(RecommendationActionEnum.FullyElectrified);
  });

  it('should prioritize SOLAR over everything else', () => {
    const household: Household = {
      ...baseHousehold,
      spaceHeating: SpaceHeatingEnum.Gas,
      waterHeating: WaterHeatingEnum.Gas,
      cooktop: CooktopEnum.Gas,
      solar: { hasSolar: false, size: 7, installSolar: true },
      battery: { hasBattery: false, capacity: 11, installBattery: true },
      vehicles: [
        { fuelType: VehicleFuelTypeEnum.Petrol, kmsPerWeek: 200, switchToEV: true },
      ],
    };
    const result = recommendNextAction(household);
    expect(result.action).toBe(RecommendationActionEnum.Solar);
  });
});
