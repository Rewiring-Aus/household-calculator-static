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
  waterHeating: WaterHeatingEnum.ElectricResistance,
  cooktop: CooktopEnum.Gas,
  vehicles: [
    {
      fuelType: VehicleFuelTypeEnum.Petrol,
      kmsPerWeek: 200,
      switchToEV: true,
    },
    {
      fuelType: VehicleFuelTypeEnum.Petrol,
      kmsPerWeek: 200,
      switchToEV: true,
    },
  ],
  solar: {
    hasSolar: false,
    size: 7,
    installSolar: true,
  },
  battery: {
    hasBattery: false,
    capacity: 11,
    installBattery: true,
  },
};

export const defaultFormState: HouseholdFormState = {
  location: defaultHouseholdData.location || LocationEnum.NewSouthWales,
  occupancy: defaultHouseholdData.occupancy || 2,
  spaceHeating:
    defaultHouseholdData.spaceHeating || SpaceHeatingEnum.ElectricHeatPump,
  waterHeating:
    defaultHouseholdData.waterHeating || WaterHeatingEnum.ElectricResistance,
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
    size: defaultHouseholdData?.solar?.size || 7,
    installSolar: defaultHouseholdData?.solar?.installSolar,
    unit: 'kW',
  },
  battery: {
    hasBattery: defaultHouseholdData?.battery?.hasBattery ?? false,
    capacity: defaultHouseholdData?.battery?.capacity ?? 11,
    installBattery: defaultHouseholdData?.battery?.installBattery ?? true,
    unit: 'kWh',
  },
};

export const defaultSavingsData: Savings = {
  emissions: {
    perWeek: {
      before: 129.95,
      after: 58.39,
      difference: -71.56,
    },
    perYear: {
      before: 6780.69,
      after: 3046.94,
      difference: -3733.75,
    },
    overLifetime: {
      before: 101710.37,
      after: 45704.14,
      difference: -56006.23,
    },
    operationalLifetime: 15,
  },
  opex: {
    perWeek: {
      before: 136.03,
      after: 23.62,
      difference: -112.41,
    },
    perYear: {
      before: 7097.76,
      after: 1232.21,
      difference: -5865.54,
    },
    overLifetime: {
      before: 121837.13,
      after: 19400.12,
      difference: -102437.01,
    },
    operationalLifetime: 15,
  },
  upfrontCost: {
    solar: 5537,
    battery: 12100,
    cooktop: 2000,
    waterHeating: 0,
    spaceHeating: 0,
  },
  recommendation: {
    action: 'SOLAR' as any,
    url: 'https://www.rewiringaustralia.org/report/factsheet-for-solar',
  },
  opexBefore: {
    gridVolumeCosts: 2045.6622495,
    otherEnergyCosts: 4343.093378567284,
    otherEnergyCostsByFuelType: {
      gas: 111.15178425,
      lpg: 0.0,
      wood: 0.0,
      petrol: 4231.941594317284,
      diesel: 0.0,
    },
    fixedCosts: 708.9999999999999,
    fixedCostsByFuelType: {
      gas: 243.99999999999997,
      lpg: 0,
      electricity: 465.0,
    },
    revenueFromSolarExport: -1.3642420526593923e-14,
  },
  opexAfter: {
    gridVolumeCosts: 821.1419304044985,
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
    revenueFromSolarExport: 53.92820240137067,
  },
};
