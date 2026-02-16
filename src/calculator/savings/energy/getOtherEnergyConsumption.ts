import { FuelTypeEnum, type FuelDict, type MachineEnergyNeeds } from '../../types';

export function getOtherEnergyConsumption(energyNeeds: MachineEnergyNeeds): FuelDict {
  const result: FuelDict = {};
  for (const categoryNeeds of Object.values(energyNeeds)) {
    for (const [fuelType, consumption] of Object.entries(categoryNeeds as FuelDict)) {
      if (fuelType !== FuelTypeEnum.Electricity) {
        (result as any)[fuelType] = ((result as any)[fuelType] ?? 0) + (consumption as number);
      }
    }
  }
  return result;
}
