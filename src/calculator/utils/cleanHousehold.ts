import { VEHICLE_AVG_KMS_PER_WEEK } from '../constants/machines/vehicles';
import type { Household, LocationEnum, Vehicle } from '../types';

function cleanVehicle(vehicle: Vehicle, location: LocationEnum): Vehicle {
  return {
    ...vehicle,
    kmsPerWeek:
      vehicle.kmsPerWeek == null
        ? Math.round(VEHICLE_AVG_KMS_PER_WEEK[location])
        : vehicle.kmsPerWeek,
  };
}

export function cleanHousehold(household: Household): Household {
  return {
    ...household,
    vehicles: (household.vehicles ?? []).map((v) => cleanVehicle(v, household.location!)),
  };
}
