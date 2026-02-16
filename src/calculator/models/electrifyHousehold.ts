import {
  CooktopEnum,
  SpaceHeatingEnum,
  VehicleFuelTypeEnum,
  WaterHeatingEnum,
  type Battery,
  type Household,
  type Solar,
  type Vehicle,
} from '../types';

export function electrifyHousehold(current: Household): Household {
  return {
    location: current.location,
    occupancy: current.occupancy,
    spaceHeating: electrifySpaceHeating(current.spaceHeating!),
    waterHeating: electrifyWaterHeating(current.waterHeating!),
    cooktop: electrifyCooktop(current.cooktop!),
    vehicles: (current.vehicles ?? []).map(electrifyVehicle),
    solar: installSolar(current.solar!),
    battery: installBattery(current.battery!),
  };
}

export function shouldElectrify<T extends string>(current: T, electrifyFunc: (c: T) => T): boolean {
  return electrifyFunc(current) !== current;
}

export function shouldInstall(item: Solar | Battery): boolean {
  if ('hasSolar' in item) {
    return !item.hasSolar && !!item.installSolar;
  }
  if ('hasBattery' in item) {
    return !item.hasBattery && !!item.installBattery;
  }
  return false;
}

export function electrifySpaceHeating(current: SpaceHeatingEnum): SpaceHeatingEnum {
  if (current === SpaceHeatingEnum.None) return current;
  return SpaceHeatingEnum.ElectricHeatPump;
}

export function electrifyWaterHeating(current: WaterHeatingEnum): WaterHeatingEnum {
  if (
    current === WaterHeatingEnum.ElectricResistance ||
    current === WaterHeatingEnum.Solar ||
    current === WaterHeatingEnum.ElectricHeatPump
  ) {
    return current;
  }
  return WaterHeatingEnum.ElectricHeatPump;
}

export function electrifyCooktop(current: CooktopEnum): CooktopEnum {
  if (current === CooktopEnum.ElectricResistance || current === CooktopEnum.ElectricInduction) {
    return current;
  }
  return CooktopEnum.ElectricInduction;
}

export function electrifyVehicle(current: Vehicle): Vehicle {
  if (current.switchToEV) {
    return {
      fuelType: VehicleFuelTypeEnum.Electric,
      kmsPerWeek: current.kmsPerWeek,
      switchToEV: undefined,
    };
  }
  return current;
}

export function installSolar(current: Solar): Solar {
  if (shouldInstall(current)) {
    return { ...current, hasSolar: true, installSolar: undefined };
  }
  return current;
}

export function installBattery(current: Battery): Battery {
  if (shouldInstall(current)) {
    return { ...current, hasBattery: true, installBattery: undefined };
  }
  return current;
}
