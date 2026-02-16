import {
  COST_PER_FUEL_KWH_AVG_15_YEARS,
  COST_PER_FUEL_KWH_TODAY,
} from '../../constants/fuelStats';
import { FuelTypeEnum } from '../../types';
import { PeriodEnum, type FuelDict, type LocationEnum } from '../../types';

export function getOtherEnergyCosts(
  otherEConsumption: FuelDict,
  period: PeriodEnum,
  location: LocationEnum,
): number {
  const costs =
    period === PeriodEnum.OperationalLifetime
      ? COST_PER_FUEL_KWH_AVG_15_YEARS
      : COST_PER_FUEL_KWH_TODAY;
  let total = 0;
  for (const [fuelType, energy] of Object.entries(otherEConsumption)) {
    total += (energy as number) * costs[fuelType][location];
  }
  return total;
}

export function getOtherEnergyCostsByFuelType(
  otherEConsumption: FuelDict,
  period: PeriodEnum,
  location: LocationEnum,
): Record<string, number> {
  const costs =
    period === PeriodEnum.OperationalLifetime
      ? COST_PER_FUEL_KWH_AVG_15_YEARS
      : COST_PER_FUEL_KWH_TODAY;
  const result: Record<string, number> = {};
  for (const [fuelType, energy] of Object.entries(otherEConsumption)) {
    const key = fuelType === FuelTypeEnum.NaturalGas ? 'gas' : fuelType;
    result[key] = (energy as number) * costs[fuelType][location];
  }
  return result;
}
