import { useState, useEffect } from 'react';
import HouseholdDataService from '../../services/householdDataService';
import type { Household, LocationEnum, Savings } from '../../calculator/types';
import { defaultSavingsData } from '../../assets/data/householdDefaults';

const useHouseholdData = (initialLocation?: LocationEnum, initialHousehold?: Household) => {
  const [householdData, setHouseholdData] = useState<Household>();
  const [savingsData, setSavingsData] = useState<Savings>(defaultSavingsData);
  const [loadingData] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<any>(null);

  const getHouseholdData = () => {
    if (initialHousehold) {
      setHouseholdData(initialHousehold);
      try {
        const savings = HouseholdDataService.postHouseholdData(initialHousehold);
        setSavingsData(savings);
      } catch (error) {
        console.error('Calculation error:', error);
        setErrorData(error);
      }
      return;
    }

    HouseholdDataService.getHouseholdData()
      .then((data: Household) => {
        if (initialLocation) {
          data = { ...data, location: initialLocation };
        }
        setHouseholdData(data);
        // Calculate savings immediately for default data
        try {
          const savings = HouseholdDataService.postHouseholdData(data);
          setSavingsData(savings);
        } catch (error) {
          console.error('Calculation error:', error);
          setErrorData(error);
        }
      })
      .catch((error: any) => {
        setErrorData(error);
      });
  };

  useEffect(() => {
    getHouseholdData();
  }, []);

  const updateHouseholdData = (data: Household) => {
    setHouseholdData(data);
    try {
      const savings = HouseholdDataService.postHouseholdData(data);
      setSavingsData(savings);
    } catch (error) {
      console.error('Calculation error:', error);
      setErrorData(error);
    }
  };

  return {
    householdData,
    updateHouseholdData,
    savingsData,
    loadingData,
    errorData,
  };
};

export default useHouseholdData;
