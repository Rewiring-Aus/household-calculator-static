import { COOKTOP_INFO } from '../../constants/machines/cooktop';
import { SPACE_HEATING_INFO } from '../../constants/machines/spaceHeating';
import { WATER_HEATING_INFO } from '../../constants/machines/waterHeating';
import { OPERATIONAL_LIFETIME } from '../../constants/params';
import { PeriodEnum, type Emissions, type Household, type LocationEnum } from '../../types';
import {
  getApplianceEmissions,
  getOtherApplianceEmissions,
  getVehicleEmissions,
} from './getMachineEmissions';

function getTotalEmissions(
  household: Household,
  period: PeriodEnum,
  location: LocationEnum,
): number {
  const applianceEmissions =
    getApplianceEmissions(household.spaceHeating!, SPACE_HEATING_INFO, location, household.occupancy, period) +
    getApplianceEmissions(household.waterHeating!, WATER_HEATING_INFO, location, household.occupancy, period) +
    getApplianceEmissions(household.cooktop!, COOKTOP_INFO, location, household.occupancy, period);
  const vehicleEmissions = getVehicleEmissions(household.vehicles ?? [], location, period);
  const otherEmissions = getOtherApplianceEmissions(location, household.occupancy, period);
  return applianceEmissions + vehicleEmissions + otherEmissions;
}

export function calculateEmissions(
  currentHousehold: Household,
  electrifiedHousehold: Household,
): Emissions {
  const weeklyBefore = getTotalEmissions(currentHousehold, PeriodEnum.Weekly, currentHousehold.location!);
  const weeklyAfter = getTotalEmissions(electrifiedHousehold, PeriodEnum.Weekly, electrifiedHousehold.location!);

  const yearlyBefore = getTotalEmissions(currentHousehold, PeriodEnum.Yearly, currentHousehold.location!);
  const yearlyAfter = getTotalEmissions(electrifiedHousehold, PeriodEnum.Yearly, electrifiedHousehold.location!);

  const lifetimeBefore = getTotalEmissions(currentHousehold, PeriodEnum.OperationalLifetime, currentHousehold.location!);
  const lifetimeAfter = getTotalEmissions(electrifiedHousehold, PeriodEnum.OperationalLifetime, electrifiedHousehold.location!);

  return {
    perWeek: {
      before: Math.round(weeklyBefore * 100) / 100,
      after: Math.round(weeklyAfter * 100) / 100,
      difference: Math.round((weeklyAfter - weeklyBefore) * 100) / 100,
    },
    perYear: {
      before: Math.round(yearlyBefore * 100) / 100,
      after: Math.round(yearlyAfter * 100) / 100,
      difference: Math.round((yearlyAfter - yearlyBefore) * 100) / 100,
    },
    overLifetime: {
      before: Math.round(lifetimeBefore * 100) / 100,
      after: Math.round(lifetimeAfter * 100) / 100,
      difference: Math.round((lifetimeAfter - lifetimeBefore) * 100) / 100,
    },
    operationalLifetime: OPERATIONAL_LIFETIME,
  };
}
