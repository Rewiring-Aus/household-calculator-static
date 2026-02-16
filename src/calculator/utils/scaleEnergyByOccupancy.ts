const OCCUPANCY_MULTIPLIER: Record<number, number> = {
  1: 0.56,
  2: 0.90,
  3: 1.03,
  4: 1.07,
  5: 1.37, // 5+
};

export function scaleEnergyByOccupancy(
  energyPerAverageHousehold: number,
  occupancy?: number | null,
): number {
  if (occupancy == null) return energyPerAverageHousehold;
  if (occupancy === 0) throw new Error('Occupancy must be greater than 0');
  const capped = Math.min(occupancy, 5);
  return energyPerAverageHousehold * OCCUPANCY_MULTIPLIER[capped];
}
