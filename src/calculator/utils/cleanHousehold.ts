import { DEFAULT_VEHICLE_CLASS, KM_PER_DAY, STATE_CODE } from '../constants/model2026';
import { DwellingEnum, type Household, type LocationEnum, type Vehicle } from '../types';

/** Average km/week per vehicle for a state (middle driving tier). */
export function averageKmsPerWeek(location: LocationEnum): number {
  return Math.round(KM_PER_DAY[STATE_CODE[location]] * 7);
}

function cleanVehicle(vehicle: Vehicle, location: LocationEnum): Vehicle {
  return {
    ...vehicle,
    vehicleClass: vehicle.vehicleClass ?? DEFAULT_VEHICLE_CLASS,
    kmsPerWeek: vehicle.kmsPerWeek ?? averageKmsPerWeek(location),
  };
}

export function cleanHousehold(household: Household): Household {
  return {
    ...household,
    dwelling: household.dwelling ?? DwellingEnum.House,
    vehicles: (household.vehicles ?? []).map((v) => cleanVehicle(v, household.location!)),
  };
}
