import {
  RecommendationActionEnum,
  VehicleFuelTypeEnum,
  type Household,
  type Recommendation,
  type Vehicle,
} from '../types';
import {
  electrifyCooktop,
  electrifySpaceHeating,
  electrifyVehicle,
  electrifyWaterHeating,
  shouldElectrify,
  shouldInstall,
} from './electrifyHousehold';

const NEXT_STEP_URLS: Record<string, string | undefined> = {
  [RecommendationActionEnum.SpaceHeating]: 'https://www.rewiringaustralia.org/report/factsheet-for-space-heating',
  [RecommendationActionEnum.WaterHeating]: 'https://www.rewiringaustralia.org/report/factsheet-for-water-heating',
  [RecommendationActionEnum.Cooking]: 'https://www.rewiringaustralia.org/report/factsheet-for-cooktops',
  [RecommendationActionEnum.Vehicle]: 'https://www.rewiringaustralia.org/report/factsheet-for-electric-vehicles',
  [RecommendationActionEnum.Solar]: 'https://www.rewiringaustralia.org/report/factsheet-for-solar',
  [RecommendationActionEnum.Battery]: 'https://www.rewiringaustralia.org/report/factsheet-for-home-batteries',
  [RecommendationActionEnum.FullyElectrified]: undefined,
};

function nEvs(vehicles: Vehicle[]): number {
  return vehicles.filter((v) => v.fuelType === VehicleFuelTypeEnum.Electric).length;
}

function nVehiclesToElectrify(vehicles: Vehicle[]): number {
  return vehicles.filter((v) => {
    const electrified = electrifyVehicle(v);
    return electrified.fuelType !== v.fuelType;
  }).length;
}

export function recommendNextAction(household: Household): Recommendation {
  let action: string = RecommendationActionEnum.FullyElectrified;
  const vehicles = household.vehicles ?? [];

  // 1. Rooftop solar
  if (household.solar && shouldInstall(household.solar)) {
    action = RecommendationActionEnum.Solar;
  }
  // 2. First EV
  else if (nVehiclesToElectrify(vehicles) > 0 && nEvs(vehicles) === 0) {
    action = RecommendationActionEnum.Vehicle;
  }
  // 3. Space heater
  else if (shouldElectrify(household.spaceHeating!, electrifySpaceHeating)) {
    action = RecommendationActionEnum.SpaceHeating;
  }
  // 4. Water heater
  else if (shouldElectrify(household.waterHeating!, electrifyWaterHeating)) {
    action = RecommendationActionEnum.WaterHeating;
  }
  // 5. Cooktop
  else if (shouldElectrify(household.cooktop!, electrifyCooktop)) {
    action = RecommendationActionEnum.Cooking;
  }
  // 6. Battery
  else if (household.battery && shouldInstall(household.battery)) {
    action = RecommendationActionEnum.Battery;
  }
  // 7. Other vehicles
  else if (nVehiclesToElectrify(vehicles) > 0) {
    action = RecommendationActionEnum.Vehicle;
  }

  return {
    action: action as any,
    url: NEXT_STEP_URLS[action],
  };
}
