import { LocationEnum } from '../types';

export const MACHINE_CATEGORY_TO_SELF_CONSUMPTION_RATE: Record<string, number> = {
  appliances: 0.5,
  vehicles: 0.5,
  other_appliances: 0.5,
};

// $/kWh
export const SOLAR_FEEDIN_TARIFF_2024 = 0.06;

export const SOLAR_FEEDIN_TARIFF_AVG_15_YEARS: Record<string, number> = {
  [LocationEnum.Victoria]: 0.06,
  [LocationEnum.NewSouthWales]: 0.10,
  [LocationEnum.NorthernTerritory]: 0.10,
  [LocationEnum.AustralianCapitalTerritory]: 0.12,
  [LocationEnum.Tasmania]: 0.11,
  [LocationEnum.WesternAustralia]: 0.04,
  [LocationEnum.SouthAustralia]: 0.09,
  [LocationEnum.Queensland]: 0.12,
};

export const SOLAR_AVG_DEGRADED_PERFORMANCE_30_YRS = 0.9308;

export const SOLAR_CAPACITY_FACTOR: Record<string, number> = {
  [LocationEnum.Victoria]: 0.1537,
  [LocationEnum.NewSouthWales]: 0.1629,
  [LocationEnum.NorthernTerritory]: 0.1898,
  [LocationEnum.AustralianCapitalTerritory]: 0.1632,
  [LocationEnum.Tasmania]: 0.1586,
  [LocationEnum.WesternAustralia]: 0.2104,
  [LocationEnum.SouthAustralia]: 0.1788,
  [LocationEnum.Queensland]: 0.1868,
};

export const SOLAR_COST_PER_KW: Record<string, number> = {
  [LocationEnum.Victoria]: 792,
  [LocationEnum.NewSouthWales]: 791,
  [LocationEnum.NorthernTerritory]: 1306,
  [LocationEnum.AustralianCapitalTerritory]: 821,
  [LocationEnum.Tasmania]: 949,
  [LocationEnum.WesternAustralia]: 882,
  [LocationEnum.SouthAustralia]: 805,
  [LocationEnum.Queensland]: 811,
};
