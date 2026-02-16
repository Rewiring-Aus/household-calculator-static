import {
  BATTERY_AVG_DEGRADED_PERFORMANCE_15_YRS,
  BATTERY_CYCLES_PER_DAY,
  BATTERY_LOSSES,
} from '../../constants/battery';
import { DAYS_PER_YEAR, OPERATIONAL_LIFETIME } from '../../constants/params';
import {
  MACHINE_CATEGORY_TO_SELF_CONSUMPTION_RATE,
  SOLAR_AVG_DEGRADED_PERFORMANCE_30_YRS,
  SOLAR_CAPACITY_FACTOR,
} from '../../constants/solar';
import {
  FuelTypeEnum,
  MACHINE_CATEGORIES,
  PeriodEnum,
  type Battery,
  type ElectricityConsumption,
  type LocationEnum,
  type MachineEnergyNeeds,
  type Solar,
} from '../../types';
import { scaleDailyToPeriod } from '../../utils/scaleDailyToPeriod';

function sumEnergyForFuelType(eNeeds: MachineEnergyNeeds, fuelType: string): number {
  let e = 0;
  for (const cat of MACHINE_CATEGORIES) {
    const catNeeds = (eNeeds as any)[cat];
    if (catNeeds != null) {
      for (const [fuel, need] of Object.entries(catNeeds)) {
        if (fuel === fuelType) e += need as number;
      }
    }
  }
  return e;
}

export function getEGeneratedFromSolar(
  solar: Solar,
  location: LocationEnum,
  period: PeriodEnum = PeriodEnum.Yearly,
): number {
  let eDaily = 0;
  if (solar.hasSolar === true && solar.size != null && solar.size > 0) {
    eDaily =
      solar.size *
      SOLAR_CAPACITY_FACTOR[location] *
      SOLAR_AVG_DEGRADED_PERFORMANCE_30_YRS *
      24; // hours per day
  }
  return scaleDailyToPeriod(eDaily, period);
}

function getMaxEConsumedFromSolar(eNeeds: MachineEnergyNeeds): MachineEnergyNeeds {
  const result: any = {};
  for (const cat of MACHINE_CATEGORIES) {
    if (cat in eNeeds) {
      result[cat] = {
        [FuelTypeEnum.Electricity]:
          (((eNeeds as any)[cat] as any)[FuelTypeEnum.Electricity] ?? 0) *
          MACHINE_CATEGORY_TO_SELF_CONSUMPTION_RATE[cat],
      };
    }
  }
  return result;
}

function calculateEConsumedFromSolarWithDeficit(
  eDemand: number,
  totalDemand: number,
  totalDeficit: number,
): number {
  const proportionOfDemand = eDemand / totalDemand;
  const deficitPortion = totalDeficit * proportionOfDemand;
  return eDemand - deficitPortion;
}

export function getEConsumedFromSolar(
  eGeneratedFromSolar: number,
  eNeeds: MachineEnergyNeeds,
): [MachineEnergyNeeds, number, MachineEnergyNeeds] {
  // Default to meeting all electricity needs at self-consumption rate
  const eConsumedFromSolar = getMaxEConsumedFromSolar(eNeeds);

  // Calculate total maximum energy consumed from solar
  let totalMaxConsumedFromSolar = 0;
  for (const cat of MACHINE_CATEGORIES) {
    if ((eConsumedFromSolar as any)[cat]) {
      totalMaxConsumedFromSolar += (eConsumedFromSolar as any)[cat][FuelTypeEnum.Electricity] ?? 0;
    }
  }

  let remainingSolar: number;

  if (totalMaxConsumedFromSolar <= eGeneratedFromSolar) {
    remainingSolar = eGeneratedFromSolar - totalMaxConsumedFromSolar;
  } else {
    // Not enough solar - distribute deficit proportionally
    remainingSolar = 0;
  }

  if (totalMaxConsumedFromSolar > eGeneratedFromSolar) {
    const deficit = totalMaxConsumedFromSolar - eGeneratedFromSolar;
    for (const cat of MACHINE_CATEGORIES) {
      if ((eConsumedFromSolar as any)[cat]) {
        (eConsumedFromSolar as any)[cat][FuelTypeEnum.Electricity] =
          calculateEConsumedFromSolarWithDeficit(
            (eConsumedFromSolar as any)[cat][FuelTypeEnum.Electricity],
            totalMaxConsumedFromSolar,
            deficit,
          );
      }
    }
    remainingSolar = 0;
  }

  const eNeedsRemaining: any = {};
  for (const cat of MACHINE_CATEGORIES) {
    if (cat in eNeeds) {
      eNeedsRemaining[cat] = {};
      for (const [fuelType, val] of Object.entries((eNeeds as any)[cat])) {
        if (fuelType === FuelTypeEnum.Electricity) {
          eNeedsRemaining[cat][fuelType] =
            (val as number) -
            ((eConsumedFromSolar as any)[cat]?.[fuelType] ?? 0);
        } else {
          eNeedsRemaining[cat][fuelType] = val;
        }
      }
    }
  }

  return [eConsumedFromSolar, remainingSolar, eNeedsRemaining];
}

export function getEStoredInBattery(
  batteryCapacity: number,
  eGeneratedFromSolar: number,
  eConsumedFromSolar: number,
  period: PeriodEnum = PeriodEnum.Yearly,
): number {
  if (eConsumedFromSolar > eGeneratedFromSolar) {
    throw new Error('Energy consumed is higher than energy generated.');
  }

  const eRemainingAfterSelfConsumption = eGeneratedFromSolar - eConsumedFromSolar;

  const capacityPerDay =
    batteryCapacity *
    BATTERY_CYCLES_PER_DAY *
    BATTERY_AVG_DEGRADED_PERFORMANCE_15_YRS *
    (1 - BATTERY_LOSSES);

  let eBatteryStorageCapacity = capacityPerDay;
  if (period === PeriodEnum.Weekly) {
    eBatteryStorageCapacity = capacityPerDay * 7;
  }
  if (period === PeriodEnum.Yearly) {
    eBatteryStorageCapacity = capacityPerDay * DAYS_PER_YEAR;
  }
  if (period === PeriodEnum.OperationalLifetime) {
    eBatteryStorageCapacity = capacityPerDay * DAYS_PER_YEAR * OPERATIONAL_LIFETIME;
  }

  if (eRemainingAfterSelfConsumption < eBatteryStorageCapacity) {
    return eRemainingAfterSelfConsumption;
  }
  return eBatteryStorageCapacity;
}

export function getElectricityConsumption(
  energyNeeds: MachineEnergyNeeds,
  solar: Solar,
  battery: Battery,
  location: LocationEnum,
  period: PeriodEnum = PeriodEnum.Daily,
): ElectricityConsumption {
  // Energy generated by solar
  const totalEGeneratedFromSolar = getEGeneratedFromSolar(solar, location, period);

  // Consumed from solar
  const [eConsumedFromSolar, _eGeneratedRemaining, eNeedsRemaining] = getEConsumedFromSolar(
    totalEGeneratedFromSolar,
    energyNeeds,
  );

  const totalEConsumedFromSolar = sumEnergyForFuelType(
    eConsumedFromSolar,
    FuelTypeEnum.Electricity,
  );

  // Consumed by battery
  let totalEStoredInBattery = 0;
  if (battery.hasBattery && battery.capacity != null) {
    totalEStoredInBattery = getEStoredInBattery(
      battery.capacity,
      totalEGeneratedFromSolar,
      totalEConsumedFromSolar,
      period,
    );
  }

  // Exported to grid
  const totalEExported =
    totalEGeneratedFromSolar - totalEStoredInBattery - totalEConsumedFromSolar;

  // Remaining energy needs met by grid
  const totalENeedsRemaining = sumEnergyForFuelType(eNeedsRemaining, FuelTypeEnum.Electricity);
  let totalEConsumedFromGrid = totalENeedsRemaining - totalEStoredInBattery;
  if (totalEConsumedFromGrid < 0) {
    totalEConsumedFromGrid = 0;
  }

  return {
    consumed_from_solar: totalEConsumedFromSolar,
    consumed_from_battery: totalEStoredInBattery,
    consumed_from_grid: totalEConsumedFromGrid,
    exported_to_grid: totalEExported,
  };
}
