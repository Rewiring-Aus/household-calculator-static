import type {
  HouseholdFormState,
  UsageType,
} from 'src/components/HouseholdForm/data/interfaces';
import {
  LocationEnum,
  SpaceHeatingEnum,
  WaterHeatingEnum,
  CooktopEnum,
  VehicleFuelTypeEnum,
  type Household,
  type Savings,
} from 'src/calculator/types';

export const defaultHouseholdData: Household = {
  location: LocationEnum.NewSouthWales,
  occupancy: 2,
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

export const defaultSavingsData: Savings = {
  emissions: {
    perWeek: {
      before: 31.12,
      after: 23.56,
      difference: -7.56,
    },
    perYear: {
      before: 1623.7,
      after: 1229.29,
      difference: -394.4,
    },
    overLifetime: {
      before: 24355.47,
      after: 18439.4,
      difference: -5916.06,
    },
    operationalLifetime: 15,
  },
  opex: {
    perWeek: {
      before: 48.33,
      after: 0.77,
      difference: -47.56,
    },
    perYear: {
      before: 2521.63,
      after: 39.99,
      difference: -2481.64,
    },
    overLifetime: {
      before: 45992.95,
      after: -2194.03,
      difference: -48186.98,
    },
    operationalLifetime: 15,
  },
  upfrontCost: {
    solar: 7910,
    battery: 7939.23,
    cooktop: 2000,
    waterHeating: 3500,
    spaceHeating: 0,
  },
  recommendation: {
    action: 'SOLAR' as any,
    url: 'https://www.rewiringaustralia.org/report/factsheet-for-solar',
  },
  opexBefore: {
    gridVolumeCosts: 1314.7093395000002,
    otherEnergyCosts: 497.9197575,
    otherEnergyCostsByFuelType: {
      gas: 497.9197575,
      lpg: 0.0,
      wood: 0.0,
      petrol: 0.0,
      diesel: 0.0,
    },
    fixedCosts: 708.9999999999999,
    fixedCostsByFuelType: {
      gas: 243.99999999999997,
      lpg: 0,
      electricity: 465.0,
    },
    revenueFromSolarExport: 0,
  },
  opexAfter: {
    gridVolumeCosts: 0.0,
    otherEnergyCosts: 0.0,
    otherEnergyCostsByFuelType: {
      gas: 0.0,
      lpg: 0.0,
      wood: 0.0,
      petrol: 0.0,
      diesel: 0.0,
    },
    fixedCosts: 465.0,
    fixedCostsByFuelType: {
      gas: 0,
      lpg: 0,
      electricity: 465.0,
    },
    revenueFromSolarExport: 425.009358972,
  },
};
