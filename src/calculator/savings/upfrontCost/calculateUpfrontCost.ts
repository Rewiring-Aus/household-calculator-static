import { BATTERY_COST_INTERCEPT, BATTERY_COST_PER_KWH } from '../../constants/battery';
import { COOKTOP_UPFRONT_COST } from '../../constants/machines/cooktop';
import {
  N_HEAT_PUMPS_NEEDED_PER_LOCATION,
  SPACE_HEATING_UPFRONT_COST,
} from '../../constants/machines/spaceHeating';
import { WATER_HEATING_UPFRONT_COST } from '../../constants/machines/waterHeating';
import { SOLAR_COST_PER_KW } from '../../constants/solar';
import { shouldInstall } from '../../models/electrifyHousehold';
import type { Battery, Household, LocationEnum, Solar, UpfrontCost } from '../../types';

function getSolarUpfrontCost(current: Solar, location: LocationEnum): number {
  if (shouldInstall(current)) {
    return Math.round(SOLAR_COST_PER_KW[location] * (current.size ?? 0) * 100) / 100;
  }
  return 0;
}

function getBatteryUpfrontCost(current: Battery): number {
  if (shouldInstall(current)) {
    return Math.round((BATTERY_COST_INTERCEPT + BATTERY_COST_PER_KWH * (current.capacity ?? 0)) * 100) / 100;
  }
  return 0;
}

function getCooktopUpfrontCost(current: string, electrified: string): number {
  if (current === electrified) return 0;
  const costInfo = COOKTOP_UPFRONT_COST[electrified];
  if (!costInfo) return 0;
  return Math.round((costInfo.item_price + costInfo.install_cost) * 100) / 100;
}

function getWaterHeatingUpfrontCost(current: string, electrified: string): number {
  if (current === electrified) return 0;
  const costInfo = WATER_HEATING_UPFRONT_COST[electrified];
  if (!costInfo || costInfo.item_price == null || costInfo.install_cost == null) return 0;
  return Math.round((costInfo.item_price + costInfo.install_cost) * 100) / 100;
}

function getSpaceHeatingUpfrontCost(
  current: string,
  electrified: string,
  location: LocationEnum,
): number {
  if (current === electrified) return 0;
  const costInfo = SPACE_HEATING_UPFRONT_COST[electrified];
  if (!costInfo) return 0;
  const costPerHeater = costInfo.item_price + costInfo.install_cost;
  const nHeaters = N_HEAT_PUMPS_NEEDED_PER_LOCATION[location] ?? 2;
  return Math.round(costPerHeater * nHeaters * 100) / 100;
}

export function calculateUpfrontCost(current: Household, electrified: Household): UpfrontCost {
  const installSolar = shouldInstall(current.solar!);
  const installBattery = shouldInstall(current.battery!);

  let batteryCost = getBatteryUpfrontCost(current.battery!);
  if (installSolar && installBattery) {
    batteryCost = Math.max(0, batteryCost - BATTERY_COST_INTERCEPT);
  }

  return {
    solar: getSolarUpfrontCost(current.solar!, current.location!),
    battery: batteryCost,
    cooktop: getCooktopUpfrontCost(current.cooktop!, electrified.cooktop!),
    waterHeating: getWaterHeatingUpfrontCost(current.waterHeating!, electrified.waterHeating!),
    spaceHeating: getSpaceHeatingUpfrontCost(
      current.spaceHeating!,
      electrified.spaceHeating!,
      electrified.location!,
    ),
  };
}
