import type { FuelDict } from '../types';

export function sumDicts(dicts: FuelDict[]): FuelDict {
  const allKeys = new Set<string>();
  for (const d of dicts) {
    for (const k of Object.keys(d)) allKeys.add(k);
  }
  const result: FuelDict = {};
  for (const k of allKeys) {
    result[k as keyof FuelDict] = dicts.reduce((sum, d) => sum + ((d as any)[k] ?? 0), 0);
  }
  return result;
}
