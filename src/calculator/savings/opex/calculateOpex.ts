import {
  COST_PER_FUEL_KWH_AVG_15_YEARS,
  COST_PER_FUEL_KWH_TODAY,
} from '../../constants/fuelStats';
import { FuelTypeEnum } from '../../types';
import { OPERATIONAL_LIFETIME } from '../../constants/params';
import {
  SOLAR_FEEDIN_TARIFF_2024,
  SOLAR_FEEDIN_TARIFF_AVG_15_YEARS,
} from '../../constants/solar';
import {
  PeriodEnum,
  type ElectricityConsumption,
  type FuelDict,
  type Household,
  type LocationEnum,
  type Opex,
} from '../../types';
import { getElectricityConsumption } from '../energy/getElectricityConsumption';
import { getTotalEnergyNeeds } from '../energy/getMachineEnergy';
import { getOtherEnergyConsumption } from '../energy/getOtherEnergyConsumption';
import { getFixedCosts } from './getFixedCosts';
import { getOtherEnergyCosts } from './getOtherEnergyCosts';

export function getGridVolumeCost(
  eConsumedFromGrid: number,
  eFromBattery: number,
  period: PeriodEnum,
  location: LocationEnum,
): number {
  const gridPrice = getEffectiveGridPrice(eConsumedFromGrid, eFromBattery, period, location);
  return eConsumedFromGrid * gridPrice;
}

export function getEffectiveGridPrice(
  eConsumedFromGrid: number,
  eFromBattery: number,
  period: PeriodEnum,
  location: LocationEnum,
): number {
  let gridPrice: number;
  if (period === PeriodEnum.OperationalLifetime) {
    gridPrice = COST_PER_FUEL_KWH_AVG_15_YEARS[FuelTypeEnum.Electricity][location];
  } else {
    gridPrice = COST_PER_FUEL_KWH_TODAY[FuelTypeEnum.Electricity][location].volume_rate;
  }

  if (eFromBattery > 0) {
    if (eFromBattery >= eConsumedFromGrid) {
      gridPrice = COST_PER_FUEL_KWH_TODAY[FuelTypeEnum.Electricity][location].off_peak;
    } else {
      const percentFromBattery = eFromBattery / eConsumedFromGrid;
      gridPrice =
        COST_PER_FUEL_KWH_TODAY[FuelTypeEnum.Electricity][location].off_peak * percentFromBattery +
        COST_PER_FUEL_KWH_TODAY[FuelTypeEnum.Electricity][location].volume_rate *
          (1 - percentFromBattery);
    }
  }
  return gridPrice;
}

export function getSolarFeedinTariff(
  eExported: number,
  period: PeriodEnum,
  location: LocationEnum,
): number {
  if (period === PeriodEnum.OperationalLifetime) {
    return eExported * SOLAR_FEEDIN_TARIFF_AVG_15_YEARS[location];
  }
  return eExported * SOLAR_FEEDIN_TARIFF_2024;
}

function getTotalBills(
  household: Household,
  electricityConsumption: ElectricityConsumption,
  otherEnergyConsumption: FuelDict,
  period: PeriodEnum,
): number {
  const gridVolumeCosts = getGridVolumeCost(
    electricityConsumption.consumed_from_grid,
    electricityConsumption.consumed_from_battery,
    period,
    household.location!,
  );
  const otherEnergyCosts = getOtherEnergyCosts(otherEnergyConsumption, period, household.location!);
  const fixedCosts = getFixedCosts(household, period);
  const revenueFromSolarExport = getSolarFeedinTariff(
    electricityConsumption.exported_to_grid,
    period,
    household.location!,
  );
  return gridVolumeCosts + otherEnergyCosts + fixedCosts - revenueFromSolarExport;
}

function getTotalOpex(household: Household, period: PeriodEnum, location: LocationEnum): number {
  const energyNeeds = getTotalEnergyNeeds(household, period, location);
  const electricityConsumption = getElectricityConsumption(
    energyNeeds,
    household.solar!,
    household.battery!,
    household.location!,
    period,
  );
  const otherEnergyConsumption = getOtherEnergyConsumption(energyNeeds);
  return getTotalBills(household, electricityConsumption, otherEnergyConsumption, period);
}

export function calculateOpex(currentHousehold: Household, electrifiedHousehold: Household): Opex {
  const weeklyBefore = getTotalOpex(currentHousehold, PeriodEnum.Weekly, currentHousehold.location!);
  const weeklyAfter = getTotalOpex(electrifiedHousehold, PeriodEnum.Weekly, electrifiedHousehold.location!);

  const yearlyBefore = getTotalOpex(currentHousehold, PeriodEnum.Yearly, currentHousehold.location!);
  const yearlyAfter = getTotalOpex(electrifiedHousehold, PeriodEnum.Yearly, electrifiedHousehold.location!);

  const lifetimeBefore = getTotalOpex(currentHousehold, PeriodEnum.OperationalLifetime, currentHousehold.location!);
  const lifetimeAfter = getTotalOpex(electrifiedHousehold, PeriodEnum.OperationalLifetime, electrifiedHousehold.location!);

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
