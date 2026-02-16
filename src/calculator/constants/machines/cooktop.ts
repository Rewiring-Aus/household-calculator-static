import { CooktopEnum, FuelTypeEnum, LocationEnum, type MachineInfoMap } from '../../types';

export const COOKTOP_INFO: MachineInfoMap = {
  [CooktopEnum.Gas]: {
    fuel_type: FuelTypeEnum.NaturalGas,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 2.14 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 2.21 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 2.32 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 2.07 },
      [LocationEnum.Tasmania]: { kwh_per_day: 2.34 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 2.26 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 2.35 },
      [LocationEnum.Queensland]: { kwh_per_day: 2.17 },
    },
  },
  [CooktopEnum.Lpg]: {
    fuel_type: FuelTypeEnum.Lpg,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 2.14 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 2.21 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 2.32 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 2.07 },
      [LocationEnum.Tasmania]: { kwh_per_day: 2.34 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 2.26 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 2.35 },
      [LocationEnum.Queensland]: { kwh_per_day: 2.17 },
    },
  },
  [CooktopEnum.ElectricResistance]: {
    fuel_type: FuelTypeEnum.Electricity,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 0.92 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 0.95 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 0.99 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 0.88 },
      [LocationEnum.Tasmania]: { kwh_per_day: 1.00 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 0.97 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 1.00 },
      [LocationEnum.Queensland]: { kwh_per_day: 0.93 },
    },
  },
  [CooktopEnum.ElectricInduction]: {
    fuel_type: FuelTypeEnum.Electricity,
    per_location: {
      [LocationEnum.Victoria]: { kwh_per_day: 0.83 },
      [LocationEnum.NewSouthWales]: { kwh_per_day: 0.86 },
      [LocationEnum.NorthernTerritory]: { kwh_per_day: 0.90 },
      [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 0.80 },
      [LocationEnum.Tasmania]: { kwh_per_day: 0.91 },
      [LocationEnum.WesternAustralia]: { kwh_per_day: 0.87 },
      [LocationEnum.SouthAustralia]: { kwh_per_day: 0.91 },
      [LocationEnum.Queensland]: { kwh_per_day: 0.84 },
    },
  },
};

export const COOKTOP_UPFRONT_COST: Record<string, { item_price: number; install_cost: number }> = {
  [CooktopEnum.Gas]: { item_price: 700, install_cost: 400 },
  [CooktopEnum.Lpg]: { item_price: 700, install_cost: 400 },
  [CooktopEnum.ElectricResistance]: { item_price: 600, install_cost: 400 },
  [CooktopEnum.ElectricInduction]: { item_price: 1400, install_cost: 600 },
};
