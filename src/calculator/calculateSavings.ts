import { PeriodEnum, type Household, type OpexWeekly, type Savings } from './types';
import { validateHousehold } from './utils/validateHousehold';
import { cleanHousehold } from './utils/cleanHousehold';
import { electrifyHousehold } from './models/electrifyHousehold';
import { calculateEmissions } from './savings/emissions/calculateEmissions';
import { calculateOpex, getGridVolumeCost, getSolarFeedinTariff } from './savings/opex/calculateOpex';
import { calculateUpfrontCost } from './savings/upfrontCost/calculateUpfrontCost';
import { recommendNextAction } from './models/recommendNextAction';
import { getTotalEnergyNeeds } from './savings/energy/getMachineEnergy';
import { getElectricityConsumption } from './savings/energy/getElectricityConsumption';
import { getOtherEnergyConsumption } from './savings/energy/getOtherEnergyConsumption';
import { getFixedCosts, getFixedCostsByFuelType } from './savings/opex/getFixedCosts';
import { getOtherEnergyCosts, getOtherEnergyCostsByFuelType } from './savings/opex/getOtherEnergyCosts';

function calculateRawOpex(household: Household): OpexWeekly {
  const energyNeeds = getTotalEnergyNeeds(household, PeriodEnum.Yearly, household.location!);
  const electricityConsumption = getElectricityConsumption(
    energyNeeds,
    household.solar!,
    household.battery!,
    household.location!,
    PeriodEnum.Yearly,
  );
  const otherEnergyConsumption = getOtherEnergyConsumption(energyNeeds);

  const gridVolumeCosts = getGridVolumeCost(
    electricityConsumption.consumed_from_grid,
    electricityConsumption.consumed_from_battery,
    PeriodEnum.Yearly,
    household.location!,
  );

  const otherEnergyCosts = getOtherEnergyCosts(
    otherEnergyConsumption,
    PeriodEnum.Yearly,
    household.location!,
  );
  const otherEnergyCostsByFuelType = getOtherEnergyCostsByFuelType(
    otherEnergyConsumption,
    PeriodEnum.Yearly,
    household.location!,
  );

  const fixedCosts = getFixedCosts(household, PeriodEnum.Yearly);
  const fixedCostsByFuelType = getFixedCostsByFuelType(household, PeriodEnum.Yearly);

  const revenueFromSolarExport = getSolarFeedinTariff(
    electricityConsumption.exported_to_grid,
    PeriodEnum.Yearly,
    household.location!,
  );

  return {
    gridVolumeCosts,
    otherEnergyCosts,
    otherEnergyCostsByFuelType: otherEnergyCostsByFuelType as any,
    fixedCosts,
    fixedCostsByFuelType: fixedCostsByFuelType as any,
    revenueFromSolarExport,
  };
}

export function calculateSavings(currentHousehold: Household): Savings {
  validateHousehold(currentHousehold);
  currentHousehold = cleanHousehold(currentHousehold);
  const electrifiedHousehold = electrifyHousehold(currentHousehold);

  const emissions = calculateEmissions(currentHousehold, electrifiedHousehold);
  const opex = calculateOpex(currentHousehold, electrifiedHousehold);
  const upfrontCost = calculateUpfrontCost(currentHousehold, electrifiedHousehold);
  const recommendation = recommendNextAction(currentHousehold);

  const opexBefore = calculateRawOpex(currentHousehold);
  const opexAfter = calculateRawOpex(electrifiedHousehold);

  return {
    emissions,
    opex,
    upfrontCost,
    recommendation,
    opexBefore,
    opexAfter,
  };
}
