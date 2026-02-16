import { COOKTOP_INFO } from '../../constants/machines/cooktop';
import { ENERGY_NEEDS_OTHER_MACHINES_PER_DAY } from '../../constants/machines/otherMachines';
import { SPACE_HEATING_INFO } from '../../constants/machines/spaceHeating';
import { VEHICLE_AVG_KMS_PER_WEEK, VEHICLE_INFO } from '../../constants/machines/vehicles';
import { WATER_HEATING_INFO } from '../../constants/machines/waterHeating';
import {
  FuelTypeEnum,
  PeriodEnum,
  SpaceHeatingEnum,
  type FuelDict,
  type Household,
  type LocationEnum,
  type MachineEnergyNeeds,
  type MachineInfo,
  type MachineInfoMap,
  type Vehicle,
} from '../../types';
import { scaleEnergyByOccupancy } from '../../utils/scaleEnergyByOccupancy';
import { scaleDailyToPeriod } from '../../utils/scaleDailyToPeriod';
import { sumDicts } from '../../utils/sumDicts';

export function getTotalEnergyNeeds(
  household: Household,
  period: PeriodEnum,
  location: LocationEnum,
): MachineEnergyNeeds {
  const applianceEnergy = getTotalApplianceEnergy(household, period, location);
  const vehicleEnergy = getVehicleEnergy(household.vehicles ?? [], location, period);
  const otherEnergy = getOtherAppliancesEnergyPerPeriod(location, household.occupancy, period);
  return {
    appliances: applianceEnergy,
    vehicles: vehicleEnergy,
    other_appliances: otherEnergy,
  };
}

export function getEnergyPerDay(
  machineType: string,
  machineStatsMap: MachineInfoMap,
  location: LocationEnum,
  occupancy?: number | null,
): FuelDict {
  let machineInfos = machineStatsMap[machineType];
  if (!Array.isArray(machineInfos)) {
    machineInfos = [machineInfos as MachineInfo];
  }

  const eFuelType: FuelDict = {};
  for (const machineInfo of machineInfos as MachineInfo[]) {
    const eDaily = machineInfo.per_location[location]?.kwh_per_day;
    if (eDaily == null) {
      throw new Error(`Cannot find kwh_per_day value for ${machineType}`);
    }
    const fuelType = machineInfo.fuel_type;
    if (fuelType == null) {
      throw new Error(`Cannot find fuel type value for ${machineType}`);
    }
    const eDailyScaled = scaleEnergyByOccupancy(eDaily, occupancy);
    (eFuelType as any)[fuelType] = eDailyScaled;
  }
  return eFuelType;
}

export function getEnergyPerPeriod(
  machine: string,
  machineInfo: MachineInfoMap,
  location: LocationEnum,
  occupancy?: number | null,
  period: PeriodEnum = PeriodEnum.Daily,
): FuelDict {
  const eDaily = getEnergyPerDay(machine, machineInfo, location, occupancy);
  const scaled: FuelDict = {};
  for (const [fuelType, e] of Object.entries(eDaily)) {
    (scaled as any)[fuelType] = scaleDailyToPeriod(e as number, period);
  }
  return scaled;
}

function getTotalApplianceEnergy(
  household: Household,
  period: PeriodEnum,
  location: LocationEnum,
): FuelDict {
  let spaceHeatingEnergy: FuelDict;
  if (household.spaceHeating === SpaceHeatingEnum.None) {
    spaceHeatingEnergy = { [FuelTypeEnum.None]: 0 };
  } else {
    spaceHeatingEnergy = getEnergyPerPeriod(
      household.spaceHeating!,
      SPACE_HEATING_INFO,
      location,
      household.occupancy,
      period,
    );
  }

  const waterHeatingEnergy = getEnergyPerPeriod(
    household.waterHeating!,
    WATER_HEATING_INFO,
    location,
    household.occupancy,
    period,
  );

  const cooktopEnergy = getEnergyPerPeriod(
    household.cooktop!,
    COOKTOP_INFO,
    location,
    household.occupancy,
    period,
  );

  const energyDict: FuelDict = {};
  const allFuelTypes = Object.values(FuelTypeEnum);

  for (const fuel of allFuelTypes) {
    if (fuel === FuelTypeEnum.None) continue;
    if (fuel === FuelTypeEnum.Solar) continue;
    (energyDict as any)[fuel] =
      ((energyDict as any)[fuel] ?? 0) +
      ((spaceHeatingEnergy as any)[fuel] ?? 0) +
      ((waterHeatingEnergy as any)[fuel] ?? 0) +
      ((cooktopEnergy as any)[fuel] ?? 0);
  }

  return energyDict;
}

export function getVehicleEnergy(
  vehicles: Vehicle[],
  location: LocationEnum,
  period: PeriodEnum = PeriodEnum.Daily,
): FuelDict {
  let totalEnergy: FuelDict = {};
  for (const vehicle of vehicles) {
    const avgEDaily = getEnergyPerDay(vehicle.fuelType, VEHICLE_INFO, location);

    // Weight energy by km usage compared to average
    const weightingFactor = (vehicle.kmsPerWeek ?? 0) / VEHICLE_AVG_KMS_PER_WEEK[location];
    const weightedEDaily: FuelDict = {};
    for (const [fuelType, e] of Object.entries(avgEDaily)) {
      (weightedEDaily as any)[fuelType] = (e as number) * weightingFactor;
    }

    // Scale to period
    const weightedEScaled: FuelDict = {};
    for (const [fuelType, e] of Object.entries(weightedEDaily)) {
      (weightedEScaled as any)[fuelType] = scaleDailyToPeriod(e as number, period);
    }

    totalEnergy = sumDicts([totalEnergy, weightedEScaled]);
  }
  return totalEnergy;
}

function getOtherAppliancesEnergyPerPeriod(
  location: LocationEnum,
  occupancy?: number | null,
  period: PeriodEnum = PeriodEnum.Daily,
): FuelDict {
  const eDaily: FuelDict = {
    [FuelTypeEnum.Electricity]: scaleEnergyByOccupancy(
      ENERGY_NEEDS_OTHER_MACHINES_PER_DAY[location].kwh_per_day,
      occupancy,
    ),
  };
  const scaled: FuelDict = {};
  for (const [fuelType, e] of Object.entries(eDaily)) {
    (scaled as any)[fuelType] = scaleDailyToPeriod(e as number, period);
  }
  return scaled;
}
