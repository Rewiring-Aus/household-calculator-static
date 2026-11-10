import { describe, expect, it } from 'vitest';
import { calculateSavings } from '../calculateSavings';
import { evaluateHousehold } from '../engine/evaluateHousehold';
import {
  CooktopEnum,
  DwellingEnum,
  LocationEnum,
  SpaceHeatingEnum,
  VehicleClassEnum,
  VehicleFuelTypeEnum,
  WaterHeatingEnum,
  type Household,
  type Vehicle,
} from '../types';

const base: Household = {
  location: LocationEnum.NewSouthWales,
  occupancy: 3,
  spaceHeating: SpaceHeatingEnum.Gas,
  waterHeating: WaterHeatingEnum.Gas,
  cooktop: CooktopEnum.Gas,
  vehicles: [],
  solar: { hasSolar: false, size: 0 },
  battery: { hasBattery: false, capacity: 0 },
};

const withCar = (v: Vehicle): Household => ({ ...base, vehicles: [{ kmsPerWeek: 250, ...v }] });

describe('evaluateHousehold', () => {
  it('apartments use 21% less appliance energy than houses', () => {
    const house = evaluateHousehold(base, '1year');
    const apt = evaluateHousehold({ ...base, dwelling: DwellingEnum.Apartment }, '1year');
    expect(apt.opex.otherEnergyCostsByFuelType!.gas).toBeCloseTo(house.opex.otherEnergyCostsByFuelType!.gas! * 0.79, 6);
  });

  it('larger vehicle classes use more energy', () => {
    const hatch = evaluateHousehold(withCar({ fuelType: VehicleFuelTypeEnum.Electric, vehicleClass: VehicleClassEnum.Hatchback }), '1year');
    const suv = evaluateHousehold(withCar({ fuelType: VehicleFuelTypeEnum.Electric, vehicleClass: VehicleClassEnum.Suv }), '1year');
    expect(suv.opex.gridVolumeCosts!).toBeGreaterThan(hatch.opex.gridVolumeCosts!);
  });

  it('hybrids cost between petrol and electric', () => {
    const cost = (fuelType: VehicleFuelTypeEnum) =>
      evaluateHousehold(withCar({ fuelType, vehicleClass: VehicleClassEnum.Sedan }), '1year').annualCost;
    const petrol = cost(VehicleFuelTypeEnum.Petrol);
    const ev = cost(VehicleFuelTypeEnum.Electric);
    const hybrid = cost(VehicleFuelTypeEnum.Hybrid);
    const phev = cost(VehicleFuelTypeEnum.PlugInHybrid);
    expect(hybrid).toBeCloseTo(0.7 * petrol + 0.3 * ev, 6);
    expect(phev).toBeCloseTo(0.6 * petrol + 0.4 * ev, 6);
  });

  it('adds yearly servicing per vehicle, by class and drivetrain', () => {
    const service = (fuelType: VehicleFuelTypeEnum, vehicleClass: VehicleClassEnum) =>
      evaluateHousehold(withCar({ fuelType, vehicleClass }), '1year').opex.vehicleMaintenanceCosts;
    expect(service(VehicleFuelTypeEnum.Petrol, VehicleClassEnum.Hatchback)).toBe(750);
    expect(service(VehicleFuelTypeEnum.Electric, VehicleClassEnum.Hatchback)).toBe(510);
    expect(service(VehicleFuelTypeEnum.Diesel, VehicleClassEnum.Suv)).toBe(790);
    expect(service(VehicleFuelTypeEnum.Electric, VehicleClassEnum.Suv)).toBe(800);
    expect(service(VehicleFuelTypeEnum.Hybrid, VehicleClassEnum.Sedan)).toBeCloseTo(0.7 * 790 + 0.3 * 640, 6);
    expect(evaluateHousehold(base, '1year').opex.vehicleMaintenanceCosts).toBe(0);
  });

  it('solar hot water costs nothing to run', () => {
    const gasWater = evaluateHousehold(base, '1year');
    const solarWater = evaluateHousehold({ ...base, waterHeating: WaterHeatingEnum.Solar }, '1year');
    expect(solarWater.opex.otherEnergyCostsByFuelType!.gas).toBeLessThan(gasWater.opex.otherEnergyCostsByFuelType!.gas!);
    expect(solarWater.opex.gridVolumeCosts).toBeCloseTo(gasWater.opex.gridVolumeCosts!, 6);
  });

  it('keeps homes with gas, or without a battery, on a flat tariff', () => {
    const solarBattery = { solar: { hasSolar: true, size: 10 }, battery: { hasBattery: true, capacity: 15 } };
    const electric = {
      spaceHeating: SpaceHeatingEnum.ElectricHeatPump,
      waterHeating: WaterHeatingEnum.ElectricHeatPump,
      cooktop: CooktopEnum.ElectricInduction,
    };
    expect(evaluateHousehold({ ...base, ...solarBattery }, '1year').tariff).toBe('flat');
    expect(evaluateHousehold({ ...base, ...electric }, '1year').tariff).toBe('flat');
    expect(evaluateHousehold({ ...base, ...electric, solar: solarBattery.solar }, '1year').tariff).toBe('flat');
    expect(evaluateHousehold({ ...base, ...electric, ...solarBattery }, '1year').tariff).toBe('tou');
  });

  it('prices NT gas as LPG (no reticulated gas)', () => {
    const nt = { ...base, location: LocationEnum.NorthernTerritory };
    const gas = evaluateHousehold(nt, '1year');
    const lpg = evaluateHousehold({ ...nt, spaceHeating: SpaceHeatingEnum.Lpg, waterHeating: WaterHeatingEnum.Lpg, cooktop: CooktopEnum.Lpg }, '1year');
    expect(gas.annualCost).toBeCloseTo(lpg.annualCost, 6);
  });

  it('never stores more than the battery can hold', () => {
    const h = { ...base, solar: { hasSolar: true, size: 20 }, battery: { hasBattery: true, capacity: 5 } };
    const { flows } = evaluateHousehold(h, '1year');
    expect((flows.batteryToHomeKwh + flows.batteryToEvKwh + flows.eveningExportKwh) / 365).toBeLessThanOrEqual(5 * 0.9 + 1e-9);
  });
});

describe('upfront costs', () => {
  it('charges battery installation when adding to existing solar', () => {
    const h = { ...base, solar: { hasSolar: true, size: 6 }, battery: { hasBattery: false, capacity: 10, installBattery: true } };
    expect(calculateSavings(h).upfrontCost!.battery).toBe(620 * 10 + 2300);
  });

  it('nets the VIC heat pump rebate and scales heating by heaters per home', () => {
    const h = { ...base, location: LocationEnum.Victoria };
    const cost = calculateSavings(h).upfrontCost!;
    expect(cost.spaceHeating).toBe(3200 * 3 - 1000);
    expect(cost.waterHeating).toBe(3900 - 1000);
  });

  it('gives apartments the larger VIC solar rebate and microinverters for small arrays', () => {
    const h = {
      ...base,
      location: LocationEnum.Victoria,
      dwelling: DwellingEnum.Apartment,
      solar: { hasSolar: false, size: 4, installSolar: true },
    };
    expect(calculateSavings(h).upfrontCost!.solar).toBe(Math.max(0, 679 * 4 - 2400) + 300 * 4);
  });
});
