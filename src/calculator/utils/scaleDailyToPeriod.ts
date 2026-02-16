import { DAYS_PER_YEAR } from '../constants/params';
import { OPERATIONAL_LIFETIME } from '../constants/params';
import { PeriodEnum } from '../types';

export function scaleDailyToPeriod(
  dailyVal: number,
  period: PeriodEnum,
  operationalLifetime: number = OPERATIONAL_LIFETIME,
): number {
  if (period === PeriodEnum.Daily) return dailyVal;
  if (period === PeriodEnum.Weekly) return dailyVal * 7;
  if (period === PeriodEnum.Yearly) return dailyVal * DAYS_PER_YEAR;
  if (period === PeriodEnum.OperationalLifetime) return dailyVal * DAYS_PER_YEAR * operationalLifetime;
  return dailyVal;
}
