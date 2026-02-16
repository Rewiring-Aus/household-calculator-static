import {
  defaultHouseholdData,
  defaultSavingsData,
} from 'src/assets/data/householdDefaults';
import { calculateSavings } from 'src/calculator/calculateSavings';
import type { Household, Savings } from 'src/calculator/types';

export const getHouseholdData = async (): Promise<Household> => {
  return defaultHouseholdData;
};

export const getDefaultSavingsData = (): Savings => {
  return defaultSavingsData;
};

export const postHouseholdData = (data: Household): Savings => {
  return calculateSavings(data);
};

const HouseholdDataService = {
  getHouseholdData,
  getDefaultSavingsData,
  postHouseholdData,
};

export default HouseholdDataService;
