import type { Household } from '../calculator/types';

export function encodeHousehold(h: Household): string {
  return encodeURIComponent(btoa(JSON.stringify(h)));
}

export function decodeHousehold(encoded: string): Household | null {
  try {
    return JSON.parse(atob(decodeURIComponent(encoded))) as Household;
  } catch {
    return null;
  }
}
