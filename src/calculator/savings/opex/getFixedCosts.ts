import {
  FIXED_COSTS_PER_YEAR_2024,
  FIXED_COSTS_PER_YEAR_AVG_15_YEARS,
} from '../../constants/fuelStats';
import { FuelTypeEnum } from '../../types';
import { DAYS_PER_YEAR } from '../../constants/params';
import {
  CooktopEnum,
  PeriodEnum,
  SpaceHeatingEnum,
  WaterHeatingEnum,
  type Household,
  type LocationEnum,
} from '../../types';
import { scaleDailyToPeriod } from '../../utils/scaleDailyToPeriod';

function getDailyCost(fuelType: string, period: PeriodEnum, location: LocationEnum): number {
  const costs =
    period === PeriodEnum.OperationalLifetime
      ? FIXED_COSTS_PER_YEAR_AVG_15_YEARS
      : FIXED_COSTS_PER_YEAR_2024;
  const fuelCosts = costs[fuelType];
  if (!fuelCosts || fuelCosts[location] == null) {
    throw new Error(`Missing fixed cost data for fuel type: ${fuelType}`);
  }
  return fuelCosts[location] / DAYS_PER_YEAR;
}

export function getFixedCosts(
  household: Household,
  period: PeriodEnum = PeriodEnum.Daily,
): number {
  let dailyCosts = getDailyCost(FuelTypeEnum.Electricity, period, household.location!);

  const usesNaturalGas =
    household.spaceHeating === SpaceHeatingEnum.Gas ||
    household.waterHeating === WaterHeatingEnum.Gas ||
    household.cooktop === CooktopEnum.Gas;

  if (usesNaturalGas) {
    dailyCosts += getDailyCost(FuelTypeEnum.NaturalGas, period, household.location!);
  }

  const usesLpg =
    household.spaceHeating === SpaceHeatingEnum.Lpg ||
    household.waterHeating === WaterHeatingEnum.Lpg ||
    household.cooktop === CooktopEnum.Lpg;

  if (usesLpg) {
    dailyCosts += getDailyCost(FuelTypeEnum.Lpg, period, household.location!);
  }

  return scaleDailyToPeriod(dailyCosts, period);
}

export function getFixedCostsByFuelType(
  household: Household,
  period: PeriodEnum = PeriodEnum.Daily,
): Record<string, number> {
  const electricityCosts = getDailyCost(FuelTypeEnum.Electricity, period, household.location!);
  const result: Record<string, number> = {
    [FuelTypeEnum.Electricity]: scaleDailyToPeriod(electricityCosts, period),
  };

  const usesNaturalGas =
    household.spaceHeating === SpaceHeatingEnum.Gas ||
    household.waterHeating === WaterHeatingEnum.Gas ||
    household.cooktop === CooktopEnum.Gas;

  if (usesNaturalGas) {
    const gasCosts = getDailyCost(FuelTypeEnum.NaturalGas, period, household.location!);
    result['gas'] = scaleDailyToPeriod(gasCosts, period);
  }

  const usesLpg =
    household.spaceHeating === SpaceHeatingEnum.Lpg ||
    household.waterHeating === WaterHeatingEnum.Lpg ||
    household.cooktop === CooktopEnum.Lpg;

  if (usesLpg) {
    const lpgCosts = getDailyCost(FuelTypeEnum.Lpg, period, household.location!);
    result[FuelTypeEnum.Lpg] = scaleDailyToPeriod(lpgCosts, period);
  }

  return result;
}
