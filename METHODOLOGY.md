# Methodology

The calculator uses the assumptions and maths of Rewiring Australia's
[Energy Savings 2026 model](https://github.com/Rewiring-Aus/energy-savings-2026-model). Its
[methodology](https://github.com/Rewiring-Aus/energy-savings-2026-model/blob/main/Methodology_v1.md)
is the reference for every number: energy use, prices, emissions factors, product prices, solar
and battery parameters. This file covers only how the calculator applies that model, and where the
two differ.

## 1 What the calculator reports

For the household the user describes, the calculator builds a "before" and an "after" (electrified)
household and reports:

- **Running costs** (weekly, yearly, over 15 years): energy and fuel bills, supply charges and
  vehicle servicing, less solar export income. This is the R model's `net_annual_opex`. Equipment
  costs and loan finance are **not** included, unlike the R model's headline `total_cost`.
- **Emissions** (per year).
- **Upgrade costs**: the installed cost of each electric upgrade, net of state rebates. Vehicles are
  shown as a price range, as before.
- **Time-of-use saving**: the part of the running-cost saving that comes from the electrified home
  moving onto a time-of-use tariff (see §4).

Weekly and yearly figures use current 2026 prices and first-year battery degradation. The 15-year
figure uses the model's 15-year average price forecast and average degradation, × 15.

## 2 Electrifying the household

- Space heating: everything except reverse-cycle A/C (and "no heating") becomes reverse-cycle A/C.
- Hot water: gas and LPG become a heat pump. Electric resistive, heat pump and solar hot water stay.
- Cooktop: gas and LPG become induction.
- Vehicles: each vehicle the user marks "switch to EV" becomes an EV of the **same size class**.
- Solar and battery are added if the user asks for them, at the size they enter.

## 3 Household model (`src/calculator/engine/evaluateHousehold.ts`)

The R model prices fixed whole-home scenarios (all gas, all electric). The calculator applies the
same steps to any mix of appliances:

1. **Loads.** Each appliance's state-average kWh/day × occupancy scaling × 0.79 for apartments.
   Cooling, other cooking and other electronics are always electric. Vehicles: Wh/km for the size
   class × the user's km/week; 15% of EV energy is public fast charging.
2. **Solar.** Each electric load can draw up to its share from `solar_fraction_table.csv`, never more
   than 90% of the load (`min_retail`), scaled back pro rata if total demand exceeds daily
   generation (state capacity factor × 24 × kW).
3. **Battery.** Four seasonal typical days (`battery_model.R`): stored solar covers remaining house
   load, then EV charging, and the rest is exported in the evening at the feed-in tariff.
4. **Bill.** Paid grid kWh at the tariff's rate, less battery discharge at the same rate; fast
   charging at $0.65/kWh (current); fossil fuels at their state prices; one daily supply charge per
   connected fuel; vehicle servicing (`Vehicle_maintenance.csv`: a flat $/yr per vehicle by size and
   drivetrain, the same at both horizons; hybrids blended 70/30 and plug-in hybrids 60/40); minus
   feed-in tariff income.
5. **Emissions.** Grid kWh (including fast charging, excluding solar and battery-supplied kWh) × the
   state grid factor, plus each fossil fuel × its factor.

`src/calculator/__tests__/parity.test.ts` checks this against the R model's `evaluate_household()`
for the Gas, Gas + solar, LPG, Electric (grid only) and Electric (solar optimised) scenarios in every
state, at both horizons: running cost within $5/yr and emissions within 0.01 t/yr.

## 4 Tariff and solar behaviour

Following the R model's rules (`fossil_baseline_tariff`, `grid_only_tariff`):

| Household | Tariff | Solar behaviour |
|---|---|---|
| Any gas or LPG appliance | Flat | Passive (`solar`) if it has panels |
| No gas/LPG, no solar | Flat | — |
| No gas/LPG, solar but no battery | Flat | Load shifting (`solar_optimised`) |
| No gas/LPG, solar **and** battery | Time-of-use: all imports at the off-peak rate | Load shifting (`solar_optimised`) |

When the electrified home lands on time-of-use and the current home doesn't, the calculator also
prices the electrified home on a flat tariff and reports the difference as the time-of-use saving.
The tariff isn't something the user chooses.

## 5 Upgrade costs

From `Energy Savings 2026 - input data - FINAL product prices.csv` (AUS):

- Reverse-cycle A/C $3,200 × heaters per home for the state (`Heater_numbers_by_state.csv`: 1–3).
- Heat pump hot water $3,900; induction cooktop $2,200.
- Solar: state $/kW × size, plus a $1,800 inverter (microinverters at $300/kW for 5 kW or less).
  The initial inverter only; the year-12 replacement in the R model is a lifetime cost.
- Battery: $620/kWh (with the federal discount). A battery added to **existing** solar also pays the
  $2,300 installation charge; installed with new solar it doesn't (as in the R model).
- State rebates from `Appliance_subsidies.csv`, where eligibility is "All" or "Apartment" (the
  calculator doesn't ask about landlord status or VPP membership). The most generous applicable
  rebate is used; solar rebates come off the panels only.

## 6 Where the calculator departs from the R model

| Item | Calculator | Why |
|---|---|---|
| Hybrids and plug-in hybrids | Blend of petrol and EV: 70/30 and 60/40 | Not in the R model. Same blend as the earlier household model and electric-saul. |
| Solar hot water | Heat-pump kWh row, priced at $0, zero emissions | Not in the R model. Same treatment as the earlier household model and electric-saul. |
| Wood heating | Energy from the 2026 table; price and emissions factor (0.40 kg/kWh) unchanged from the earlier household model | No 2026 wood price. Note the 2026 emissions file has 0.0043 kg/kWh for wood (biogenic CO₂ excluded). |
| Diesel space heating | Contributes no energy, as before | No data in either model. |
| Gas in the NT | Priced and emitted as LPG | No reticulated gas, so no 2026 gas price. |
| Gas emissions in TAS | National gas factor (0.219) | The source has no TAS factor; the R model counts it as zero. |
| Vehicle and equipment capex, finance | Not in running costs | The calculator reports running costs. |
| Driving distance | User's km/week (default: the state's middle tier) | R uses low/middle/high tiers. |
| Used vehicles, Solar Sharer, Amber, VPP, landlord rebates | Not offered | Not collected in the form. |

## 7 Updating

See "Updating the model numbers" in the [README](README.md).
