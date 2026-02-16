import type { Household } from '../types';

export function validateHousehold(household: Household): void {
  const solar = household.solar;
  const battery = household.battery;
  if (solar && battery) {
    const hasOrWantsSolar = solar.hasSolar || solar.installSolar;
    const hasOrWantsBattery = battery.hasBattery || battery.installBattery;
    if (!hasOrWantsSolar && hasOrWantsBattery) {
      throw new Error("Can't have battery without solar");
    }
  }
}
