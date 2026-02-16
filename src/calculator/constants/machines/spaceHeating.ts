import { FuelTypeEnum, LocationEnum, SpaceHeatingEnum, type MachineInfoMap } from '../../types';

export const SPACE_HEATING_INFO: MachineInfoMap = {
  [SpaceHeatingEnum.Wood]: {
    fuel_type: FuelTypeEnum.Wood,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 35.91 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 13.99 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 1.71 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 48.00 },
      [LocationEnum.Tasmania]: { kwh_per_day: 41.42 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 12.12 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 16.89 },
      [LocationEnum.Queensland]: { kwh_per_day: 7.93 },
    },
  },
  [SpaceHeatingEnum.Gas]: {
    fuel_type: FuelTypeEnum.NaturalGas,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 29.18 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 11.36 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 1.39 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 39.00 },
      [LocationEnum.Tasmania]: { kwh_per_day: 33.65 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 9.84 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 13.72 },
      [LocationEnum.Queensland]: { kwh_per_day: 6.44 },
    },
  },
  [SpaceHeatingEnum.Lpg]: {
    fuel_type: FuelTypeEnum.Lpg,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 29.18 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 11.36 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 1.39 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 39.00 },
      [LocationEnum.Tasmania]: { kwh_per_day: 33.65 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 9.84 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 13.72 },
      [LocationEnum.Queensland]: { kwh_per_day: 6.44 },
    },
  },
  [SpaceHeatingEnum.Diesel]: {
    fuel_type: FuelTypeEnum.Diesel,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 0 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 0 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 0 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 0 },
      [LocationEnum.Tasmania]: { kwh_per_day: 0 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 0 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 0 },
      [LocationEnum.Queensland]: { kwh_per_day: 0 },
    },
  },
  [SpaceHeatingEnum.ElectricResistance]: {
    fuel_type: FuelTypeEnum.Electricity,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 23.34 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 9.09 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 1.11 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 31.20 },
      [LocationEnum.Tasmania]: { kwh_per_day: 26.92 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 7.87 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 10.98 },
      [LocationEnum.Queensland]: { kwh_per_day: 5.16 },
    },
  },
  [SpaceHeatingEnum.ElectricHeatPump]: {
    fuel_type: FuelTypeEnum.Electricity,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 6.007 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 2.273 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 0.263 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 8.531 },
      [LocationEnum.Tasmania]: { kwh_per_day: 7.362 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 1.969 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 2.745 },
      [LocationEnum.Queensland]: { kwh_per_day: 1.253 },
    },
  },
};

export const SPACE_HEATING_UPFRONT_COST: Record<string, { item_price: number; install_cost: number }> = {
  [SpaceHeatingEnum.ElectricHeatPump]: { item_price: 1700, install_cost: 900 },
  [SpaceHeatingEnum.Gas]: { item_price: 1740, install_cost: 500 },
  [SpaceHeatingEnum.Lpg]: { item_price: 1740, install_cost: 500 },
  [SpaceHeatingEnum.Wood]: { item_price: 1400, install_cost: 1000 },
  [SpaceHeatingEnum.ElectricResistance]: { item_price: 220, install_cost: 0 },
};

export const N_HEAT_PUMPS_NEEDED_PER_LOCATION: Record<string, number> = {
  [LocationEnum.Victoria]: 3,
  [LocationEnum.NewSouthWales]: 2,
  [LocationEnum.NorthernTerritory]: 1,
  [LocationEnum.AustralianCapitalTerritory]: 3,
  [LocationEnum.Tasmania]: 3,
  [LocationEnum.WesternAustralia]: 2,
  [LocationEnum.SouthAustralia]: 2,
  [LocationEnum.Queensland]: 1,
};
