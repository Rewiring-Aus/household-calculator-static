import { EMISSIONS_FACTORS } from '../../constants/fuelStats';
import { ENERGY_NEEDS_OTHER_MACHINES_PER_DAY } from '../../constants/machines/otherMachines';
import { VEHICLE_AVG_KMS_PER_WEEK, VEHICLE_INFO } from '../../constants/machines/vehicles';
import {
  FuelTypeEnum,
  PeriodEnum,
  SpaceHeatingEnum,
  VehicleFuelTypeEnum,
  type LocationEnum,
  type MachineInfoMap,
  type Vehicle,
} from '../../types';
import { scaleEnergyByOccupancy } from '../../utils/scaleEnergyByOccupancy';
import { scaleDailyToPeriod } from '../../utils/scaleDailyToPeriod';

export function getEmissionsPerDay(
  machineType: string,
  machineStatsMap: MachineInfoMap,
  location: LocationEnum,
  occupancy?: number | null,
): number {
  if (machineType === SpaceHeatingEnum.None) return 0;

  const info = machineStatsMap[machineType] as any;
  const energy = info.per_location[location].kwh_per_day;
  const fuelType = info.fuel_type;
  const energyScaled = scaleEnergyByOccupancy(energy, occupancy);

  if (fuelType === FuelTypeEnum.Electricity) {
    return energyScaled * (EMISSIONS_FACTORS[fuelType] as Record<string, number>)[location];
  }
  return energyScaled * (EMISSIONS_FACTORS[fuelType] as number);
}

export function getApplianceEmissions(
  appliance: string,
  applianceInfo: MachineInfoMap,
  location: LocationEnum,
  occupancy?: number | null,
  period: PeriodEnum = PeriodEnum.Daily,
): number {
  const emissionsDaily = getEmissionsPerDay(appliance, applianceInfo, location, occupancy);
  return scaleDailyToPeriod(emissionsDaily, period);
}

export function getOtherApplianceEmissions(
  location: LocationEnum,
  occupancy?: number | null,
  period: PeriodEnum = PeriodEnum.Daily,
): number {
  const energyScaled = scaleEnergyByOccupancy(
    ENERGY_NEEDS_OTHER_MACHINES_PER_DAY[location].kwh_per_day,
    occupancy,
  );
  const emissionsDaily =
    energyScaled * (EMISSIONS_FACTORS[FuelTypeEnum.Electricity] as Record<string, number>)[location];
  return scaleDailyToPeriod(emissionsDaily, period);
}

function getHybridEmissionsPerDay(
  vehicleType: string,
  location: LocationEnum,
): number {
  const petrol = getEmissionsPerDay(VehicleFuelTypeEnum.Petrol, VEHICLE_INFO, location);
  const ev = getEmissionsPerDay(VehicleFuelTypeEnum.Electric, VEHICLE_INFO, location);
  if (vehicleType === VehicleFuelTypeEnum.PlugInHybrid) {
    return petrol * 0.6 + ev * 0.4;
  }
  if (vehicleType === VehicleFuelTypeEnum.Hybrid) {
    return petrol * 0.7 + ev * 0.3;
  }
  return 0;
}

export function getVehicleEmissions(
  vehicles: Vehicle[],
  location: LocationEnum,
  period: PeriodEnum = PeriodEnum.Daily,
): number {
  let totalEmissions = 0;
  for (const vehicle of vehicles) {
    let avgEmissionsDaily: number;
    if (
      vehicle.fuelType === VehicleFuelTypeEnum.PlugInHybrid ||
      vehicle.fuelType === VehicleFuelTypeEnum.Hybrid
    ) {
      avgEmissionsDaily = getHybridEmissionsPerDay(vehicle.fuelType, location);
    } else {
      avgEmissionsDaily = getEmissionsPerDay(vehicle.fuelType, VEHICLE_INFO, location);
    }

    const weightingFactor = (vehicle.kmsPerWeek ?? 0) / VEHICLE_AVG_KMS_PER_WEEK[location];
    const weightedEmissionsDaily = avgEmissionsDaily * weightingFactor;
    const emissionsPeriod = scaleDailyToPeriod(weightedEmissionsDaily, period);
    totalEmissions += emissionsPeriod;
  }
  return totalEmissions;
}
