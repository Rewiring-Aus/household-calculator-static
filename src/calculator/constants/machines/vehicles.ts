import { FuelTypeEnum, LocationEnum, VehicleFuelTypeEnum, type MachineInfoMap, type MachineInfo } from '../../types';

export const VEHICLE_INFO: MachineInfoMap = {
  [VehicleFuelTypeEnum.Petrol]: {
    fuel_type: FuelTypeEnum.Petrol,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 35.9 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 36.7 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 38.6 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 33.5 },
      [LocationEnum.Tasmania]: { kwh_per_day: 33.6 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 35.8 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 33.2 },
      [LocationEnum.Queensland]: { kwh_per_day: 37.2 },
    },
  } as MachineInfo,
  [VehicleFuelTypeEnum.Diesel]: {
    fuel_type: FuelTypeEnum.Diesel,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 28 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 29 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 30 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 26 },
      [LocationEnum.Tasmania]: { kwh_per_day: 26 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 28 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 26 },
      [LocationEnum.Queensland]: { kwh_per_day: 29 },
    },
  } as MachineInfo,
  [VehicleFuelTypeEnum.Hybrid]: [
    // 70% petrol, 30% electric
    {
      fuel_type: FuelTypeEnum.Petrol,
      per_location: {
        [LocationEnum.Victoria]: { kwh_per_day: 35.9 * 0.7 },
        [LocationEnum.NewSouthWales]: { kwh_per_day: 36.7 * 0.7 },
        [LocationEnum.NorthernTerritory]: { kwh_per_day: 38.6 * 0.7 },
        [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 33.5 * 0.7 },
        [LocationEnum.Tasmania]: { kwh_per_day: 33.6 * 0.7 },
        [LocationEnum.WesternAustralia]: { kwh_per_day: 35.8 * 0.7 },
        [LocationEnum.SouthAustralia]: { kwh_per_day: 33.2 * 0.7 },
        [LocationEnum.Queensland]: { kwh_per_day: 37.2 * 0.7 },
      },
    },
    {
      fuel_type: FuelTypeEnum.Electricity,
      per_location: {
        [LocationEnum.Victoria]: { kwh_per_day: 9.2 * 0.3 },
        [LocationEnum.NewSouthWales]: { kwh_per_day: 9.4 * 0.3 },
        [LocationEnum.NorthernTerritory]: { kwh_per_day: 9.9 * 0.3 },
        [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 8.6 * 0.3 },
        [LocationEnum.Tasmania]: { kwh_per_day: 8.6 * 0.3 },
        [LocationEnum.WesternAustralia]: { kwh_per_day: 9.2 * 0.3 },
        [LocationEnum.SouthAustralia]: { kwh_per_day: 8.5 * 0.3 },
        [LocationEnum.Queensland]: { kwh_per_day: 9.6 * 0.3 },
      },
    },
  ],
  [VehicleFuelTypeEnum.PlugInHybrid]: [
    // 60% petrol, 40% electric
    {
      fuel_type: FuelTypeEnum.Petrol,
      per_location: {
        [LocationEnum.Victoria]: { kwh_per_day: 35.9 * 0.6 },
        [LocationEnum.NewSouthWales]: { kwh_per_day: 36.7 * 0.6 },
        [LocationEnum.NorthernTerritory]: { kwh_per_day: 38.6 * 0.6 },
        [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 33.5 * 0.6 },
        [LocationEnum.Tasmania]: { kwh_per_day: 33.6 * 0.6 },
        [LocationEnum.WesternAustralia]: { kwh_per_day: 35.8 * 0.6 },
        [LocationEnum.SouthAustralia]: { kwh_per_day: 33.2 * 0.6 },
        [LocationEnum.Queensland]: { kwh_per_day: 37.2 * 0.6 },
      },
    },
    {
      fuel_type: FuelTypeEnum.Electricity,
      per_location: {
        [LocationEnum.Victoria]: { kwh_per_day: 9.2 * 0.4 },
        [LocationEnum.NewSouthWales]: { kwh_per_day: 9.4 * 0.4 },
        [LocationEnum.NorthernTerritory]: { kwh_per_day: 9.9 * 0.4 },
        [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 8.6 * 0.4 },
        [LocationEnum.Tasmania]: { kwh_per_day: 8.6 * 0.4 },
        [LocationEnum.WesternAustralia]: { kwh_per_day: 9.2 * 0.4 },
        [LocationEnum.SouthAustralia]: { kwh_per_day: 8.5 * 0.4 },
        [LocationEnum.Queensland]: { kwh_per_day: 9.6 * 0.4 },
      },
    },
  ],
  [VehicleFuelTypeEnum.Electric]: {
    fuel_type: FuelTypeEnum.Electricity,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 9.2 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 9.4 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 9.9 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 8.6 },
      [LocationEnum.Tasmania]: { kwh_per_day: 8.6 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 9.2 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 8.5 },
      [LocationEnum.Queensland]: { kwh_per_day: 9.6 },
    },
  } as MachineInfo,
};

export const VEHICLE_AVG_KMS_PER_WEEK: Record<string, number> = {
  [LocationEnum.Victoria]: 38.0 * 7,
  [LocationEnum.NewSouthWales]: 36.2 * 7,
  [LocationEnum.NorthernTerritory]: 35.9 * 7,
  [LocationEnum.AustralianCapitalTerritory]: 35.1 * 7,
  [LocationEnum.Tasmania]: 33.1 * 7,
  [LocationEnum.WesternAustralia]: 33.8 * 7,
  [LocationEnum.SouthAustralia]: 35.0 * 7,
  [LocationEnum.Queensland]: 36.9 * 7,
};
