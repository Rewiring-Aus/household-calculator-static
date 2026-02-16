import { FuelTypeEnum, LocationEnum, WaterHeatingEnum, type MachineInfoMap } from '../../types';

export const WATER_HEATING_INFO: MachineInfoMap = {
  [WaterHeatingEnum.Gas]: {
    fuel_type: FuelTypeEnum.NaturalGas,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 8.70 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 7.69 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 5.86 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 7.99 },
      [LocationEnum.Tasmania]: { kwh_per_day: 7.59 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 8.04 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 7.93 },
      [LocationEnum.Queensland]: { kwh_per_day: 7.38 },
    },
  },
  [WaterHeatingEnum.Lpg]: {
    fuel_type: FuelTypeEnum.Lpg,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 8.70 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 7.69 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 5.86 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 7.99 },
      [LocationEnum.Tasmania]: { kwh_per_day: 7.59 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 8.04 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 7.93 },
      [LocationEnum.Queensland]: { kwh_per_day: 7.38 },
    },
  },
  [WaterHeatingEnum.ElectricResistance]: {
    fuel_type: FuelTypeEnum.Electricity,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 7.41 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 6.54 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 4.99 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 6.80 },
      [LocationEnum.Tasmania]: { kwh_per_day: 6.46 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 6.84 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 6.75 },
      [LocationEnum.Queensland]: { kwh_per_day: 6.28 },
    },
  },
  [WaterHeatingEnum.ElectricHeatPump]: {
    fuel_type: FuelTypeEnum.Electricity,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 2.05 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 1.76 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 1.27 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 2.00 },
      [LocationEnum.Tasmania]: { kwh_per_day: 1.90 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 1.84 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 1.81 },
      [LocationEnum.Queensland]: { kwh_per_day: 1.64 },
    },
  },
  [WaterHeatingEnum.Solar]: {
    fuel_type: FuelTypeEnum.Solar,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 2.05 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 1.76 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 1.27 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 2.00 },
      [LocationEnum.Tasmania]: { kwh_per_day: 1.90 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 1.84 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 1.81 },
      [LocationEnum.Queensland]: { kwh_per_day: 1.64 },
    },
  },
};

export const WATER_HEATING_UPFRONT_COST: Record<string, { item_price: number | null; install_cost: number | null }> = {
  [WaterHeatingEnum.ElectricResistance]: { item_price: 1400, install_cost: 700 },
  [WaterHeatingEnum.Gas]: { item_price: 1200, install_cost: 700 },
  [WaterHeatingEnum.Lpg]: { item_price: 1200, install_cost: 700 },
  [WaterHeatingEnum.ElectricHeatPump]: { item_price: 3500, install_cost: 0 },
  [WaterHeatingEnum.Solar]: { item_price: null, install_cost: null },
};
