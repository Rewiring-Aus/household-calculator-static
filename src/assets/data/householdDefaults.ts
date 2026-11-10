import type {
  HouseholdFormState,
  UsageType,
} from 'src/components/HouseholdForm/data/interfaces';
import {
  LocationEnum,
  SpaceHeatingEnum,
  WaterHeatingEnum,
  CooktopEnum,
  DwellingEnum,
  VehicleClassEnum,
  VehicleFuelTypeEnum,
  type Household,
  type Savings,
} from 'src/calculator/types';
import { calculateSavings } from 'src/calculator/calculateSavings';

export const defaultHouseholdData: Household = {
  location: LocationEnum.NewSouthWales,
  occupancy: 2,
  dwelling: DwellingEnum.House,
  spaceHeating: SpaceHeatingEnum.ElectricHeatPump,
  waterHeating: WaterHeatingEnum.Gas,
  cooktop: CooktopEnum.Gas,
  vehicles: [],
  solar: {
    hasSolar: false,
    size: 10,
    installSolar: true,
  },
  battery: {
    hasBattery: false,
    capacity: 13,
    installBattery: true,
  },
};

export const defaultFormState: HouseholdFormState = {
  location: defaultHouseholdData.location || LocationEnum.NewSouthWales,
  occupancy: defaultHouseholdData.occupancy || 2,
  dwelling: defaultHouseholdData.dwelling ?? DwellingEnum.House,
  spaceHeating:
    defaultHouseholdData.spaceHeating || SpaceHeatingEnum.ElectricHeatPump,
  waterHeating:
    defaultHouseholdData.waterHeating || WaterHeatingEnum.Gas,
  cooktop: defaultHouseholdData.cooktop || CooktopEnum.Gas,
  numberOfVehicles: defaultHouseholdData?.vehicles?.length || 0,
  vehicleObjs:
    defaultHouseholdData?.vehicles?.map((vehicle, index) => ({
      id: index + 1,
      fuelType: vehicle.fuelType || VehicleFuelTypeEnum.Petrol,
      vehicleClass: vehicle.vehicleClass ?? VehicleClassEnum.Suv,
      usageType: 'Medium' as UsageType,
      switchToEV: vehicle.switchToEV ?? false,
    })) || [],
  solar: {
    hasSolar: defaultHouseholdData?.solar?.hasSolar ?? false,
    size: defaultHouseholdData?.solar?.size || 10,
    installSolar: defaultHouseholdData?.solar?.installSolar,
    unit: 'kW',
  },
  battery: {
    hasBattery: defaultHouseholdData?.battery?.hasBattery ?? false,
    capacity: defaultHouseholdData?.battery?.capacity ?? 13,
    installBattery: defaultHouseholdData?.battery?.installBattery ?? true,
    unit: 'kWh',
  },
};

// Shown before the first calculation completes; computed so it never goes stale.
export const defaultSavingsData: Savings = calculateSavings(defaultHouseholdData);
