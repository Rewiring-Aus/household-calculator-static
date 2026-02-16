import { LocationEnum } from '../../types';

export const ENERGY_NEEDS_SPACE_COOLING: Record<string, { kwh_per_day: number }> = {
  [LocationEnum.Victoria]: { kwh_per_day: 0.10 },
  [LocationEnum.NewSouthWales]: { kwh_per_day: 0.77 },
  [LocationEnum.NorthernTerritory]: { kwh_per_day: 7.58 },
  [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 0.74 },
  [LocationEnum.Tasmania]: { kwh_per_day: 0.09 },
  [LocationEnum.WesternAustralia]: { kwh_per_day: 1.65 },
  [LocationEnum.SouthAustralia]: { kwh_per_day: 0.63 },
  [LocationEnum.Queensland]: { kwh_per_day: 1.89 },
};

export const ENERGY_NEEDS_OTHER_APPLIANCES: Record<string, { kwh_per_day: number }> = {
  [LocationEnum.Victoria]: { kwh_per_day: 5.21 },
  [LocationEnum.NewSouthWales]: { kwh_per_day: 5.32 },
  [LocationEnum.NorthernTerritory]: { kwh_per_day: 5.52 },
  [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 5.18 },
  [LocationEnum.Tasmania]: { kwh_per_day: 5.21 },
  [LocationEnum.WesternAustralia]: { kwh_per_day: 5.14 },
  [LocationEnum.SouthAustralia]: { kwh_per_day: 5.21 },
  [LocationEnum.Queensland]: { kwh_per_day: 5.09 },
};

export const ENERGY_NEEDS_OTHER_COOKING: Record<string, { kwh_per_day: number }> = {
  [LocationEnum.Victoria]: { kwh_per_day: 3.32 },
  [LocationEnum.NewSouthWales]: { kwh_per_day: 3.40 },
  [LocationEnum.NorthernTerritory]: { kwh_per_day: 3.57 },
  [LocationEnum.AustralianCapitalTerritory]: { kwh_per_day: 3.20 },
  [LocationEnum.Tasmania]: { kwh_per_day: 3.65 },
  [LocationEnum.WesternAustralia]: { kwh_per_day: 3.47 },
  [LocationEnum.SouthAustralia]: { kwh_per_day: 3.62 },
  [LocationEnum.Queensland]: { kwh_per_day: 3.35 },
};

// Pre-computed totals per location
export const ENERGY_NEEDS_OTHER_MACHINES_PER_DAY: Record<string, { kwh_per_day: number }> = {};

for (const loc of Object.values(LocationEnum)) {
  const total =
    (ENERGY_NEEDS_SPACE_COOLING[loc]?.kwh_per_day ?? 0) +
    (ENERGY_NEEDS_OTHER_APPLIANCES[loc]?.kwh_per_day ?? 0) +
    (ENERGY_NEEDS_OTHER_COOKING[loc]?.kwh_per_day ?? 0);
  ENERGY_NEEDS_OTHER_MACHINES_PER_DAY[loc] = { kwh_per_day: total };
}
