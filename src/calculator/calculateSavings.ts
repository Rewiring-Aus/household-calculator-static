import type { Emissions, Household, Opex, Savings, TariffSwitch } from './types';
import { validateHousehold } from './utils/validateHousehold';
import { cleanHousehold } from './utils/cleanHousehold';
import { electrifyHousehold } from './models/electrifyHousehold';
import { calculateUpfrontCost } from './savings/upfrontCost/calculateUpfrontCost';
import { recommendNextAction } from './models/recommendNextAction';
import { evaluateHousehold } from './engine/evaluateHousehold';
import { DAYS_PER_YEAR, OPERATIONAL_LIFETIME } from './constants/model2026';

const round2 = (n: number) => Math.round(n * 100) / 100;
const perWeek = (annual: number) => (annual * 7) / DAYS_PER_YEAR;

function beforeAfter(before: number, after: number) {
  return { before: round2(before), after: round2(after), difference: round2(after - before) };
}

export function calculateSavings(currentHousehold: Household): Savings {
  validateHousehold(currentHousehold);
  currentHousehold = cleanHousehold(currentHousehold);
  const electrifiedHousehold = electrifyHousehold(currentHousehold);

  // Weekly and yearly figures use current 2026 prices; the 15-year figure uses
  // the 15-year average price forecast and average battery degradation.
  const before1 = evaluateHousehold(currentHousehold, '1year');
  const after1 = evaluateHousehold(electrifiedHousehold, '1year');
  const before15 = evaluateHousehold(currentHousehold, '15year');
  const after15 = evaluateHousehold(electrifiedHousehold, '15year');

  const opex: Opex = {
    perWeek: beforeAfter(perWeek(before1.annualCost), perWeek(after1.annualCost)),
    perYear: beforeAfter(before1.annualCost, after1.annualCost),
    overLifetime: beforeAfter(
      before15.annualCost * OPERATIONAL_LIFETIME,
      after15.annualCost * OPERATIONAL_LIFETIME,
    ),
    operationalLifetime: OPERATIONAL_LIFETIME,
  };

  const emissions: Emissions = {
    perWeek: beforeAfter(perWeek(before1.annualEmissionsKg), perWeek(after1.annualEmissionsKg)),
    perYear: beforeAfter(before1.annualEmissionsKg, after1.annualEmissionsKg),
    overLifetime: beforeAfter(
      before15.annualEmissionsKg * OPERATIONAL_LIFETIME,
      after15.annualEmissionsKg * OPERATIONAL_LIFETIME,
    ),
    operationalLifetime: OPERATIONAL_LIFETIME,
  };

  // How much of the saving comes from the electrified home moving onto
  // time-of-use, which it can only use once it has solar, a battery and no gas.
  let tariffSwitch: TariffSwitch | undefined;
  if (after1.tariff === 'tou' && before1.tariff === 'flat') {
    const flat1 = evaluateHousehold(electrifiedHousehold, '1year', { tariff: 'flat' });
    const flat15 = evaluateHousehold(electrifiedHousehold, '15year', { tariff: 'flat' });
    const perYear = flat1.annualCost - after1.annualCost;
    tariffSwitch = {
      tariff: 'TIME_OF_USE',
      perWeek: round2(perWeek(perYear)),
      perYear: round2(perYear),
      overLifetime: round2((flat15.annualCost - after15.annualCost) * OPERATIONAL_LIFETIME),
    };
  }

  return {
    emissions,
    opex,
    tariffSwitch,
    upfrontCost: calculateUpfrontCost(currentHousehold, electrifiedHousehold),
    recommendation: recommendNextAction(currentHousehold),
    opexBefore: before1.opex,
    opexAfter: after1.opex,
  };
}
