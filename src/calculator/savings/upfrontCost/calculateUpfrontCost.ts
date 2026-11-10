// Upfront cost of each upgrade, from the Energy Savings 2026 model's product
// prices (installed, AUS) net of state subsidies the calculator can check
// eligibility for (everyone, or by dwelling type).

import {
  CAPEX,
  HEATERS_PER_HOME,
  MODEL_DEFAULTS,
  SOLAR_BY_STATE,
  STATE_CODE,
  SUBSIDIES,
  type StateCode,
} from '../../constants/model2026';
import { shouldInstall } from '../../models/electrifyHousehold';
import {
  CooktopEnum,
  DwellingEnum,
  SpaceHeatingEnum,
  WaterHeatingEnum,
  type Household,
  type UpfrontCost,
} from '../../types';

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Most generous applicable subsidy (they don't stack), as in the R model. */
function subsidy(state: StateCode, appliance: 'Solar' | 'Heat pump', dwelling?: DwellingEnum): number {
  const eligible = SUBSIDIES.filter(
    (s) =>
      s.state === state &&
      s.appliance === appliance &&
      (s.eligibility === 'All' || (s.eligibility === 'Apartment' && dwelling === DwellingEnum.Apartment)),
  );
  return Math.max(0, ...eligible.map((s) => s.value));
}

/** Panels at the state $/kW less any rebate (off the panels only), plus the inverter. */
function solarCost(state: StateCode, kw: number, dwelling?: DwellingEnum): number {
  if (kw <= 0) return 0;
  const { costPerKw, inverterCost } = SOLAR_BY_STATE[state];
  const panels = Math.max(0, costPerKw * kw - subsidy(state, 'Solar', dwelling));
  const inverter =
    kw <= MODEL_DEFAULTS.microinverterMaxSolarKwp ? MODEL_DEFAULTS.microinverterCostPerKw * kw : inverterCost;
  return panels + inverter;
}

/**
 * Battery at the federally subsidised $/kWh. Installed alongside new solar the
 * crew is already on site, so there's no separate installation charge; added to
 * existing solar it pays the installation fee.
 */
function batteryCost(kwh: number, installingSolarToo: boolean): number {
  if (kwh <= 0) return 0;
  return CAPEX.batteryPerKwhWithSolar * kwh + (installingSolarToo ? 0 : CAPEX.batteryInstallation);
}

export function calculateUpfrontCost(current: Household, electrified: Household): UpfrontCost {
  const state = STATE_CODE[current.location!];
  const installSolar = shouldInstall(current.solar!);
  const installBattery = shouldInstall(current.battery!);
  const heatPumpSubsidy = subsidy(state, 'Heat pump', current.dwelling);

  const spaceHeating =
    current.spaceHeating !== electrified.spaceHeating && electrified.spaceHeating === SpaceHeatingEnum.ElectricHeatPump
      ? Math.max(0, CAPEX.heatPumpHeater * HEATERS_PER_HOME[state] - heatPumpSubsidy)
      : 0;
  const waterHeating =
    current.waterHeating !== electrified.waterHeating && electrified.waterHeating === WaterHeatingEnum.ElectricHeatPump
      ? Math.max(0, CAPEX.heatPumpWaterHeater - heatPumpSubsidy)
      : 0;
  const cooktop =
    current.cooktop !== electrified.cooktop && electrified.cooktop === CooktopEnum.ElectricInduction
      ? CAPEX.inductionCooktop
      : 0;

  return {
    solar: round2(installSolar ? solarCost(state, current.solar!.size ?? 0, current.dwelling) : 0),
    battery: round2(installBattery ? batteryCost(current.battery!.capacity ?? 0, installSolar) : 0),
    cooktop: round2(cooktop),
    waterHeating: round2(waterHeating),
    spaceHeating: round2(spaceHeating),
  };
}
