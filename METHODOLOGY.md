# Methodology

## 1 Summary of modelling approach

Our modelling uses household and vehicle energy use data at a per machine level (e.g. energy use per gas water heater, or per petrol car), primarily from government sources, combined with up-to-date (2025) energy pricing and product pricing, to understand the economics of electrifying each type of individual machine occurring in Australia's housing stock. This includes:

- operating costs
    - the gas, electricity, or petrol bills paid to operate that machine
    - fixed connection costs for gas, LPG, and electricity.
- emissions: the amount of emissions saved based on energy consumption and emissions factor of the fuel type
- product replacement costs: the costs to replace like for like, or to replace a fossil fuel option with an electrified option including installation costs

## 2 Electrifying the house

For the given household inputs, we create a before & after state by "electrifying" the household. This means replacing appliances with the most efficient electric models.

- Space heaters: everything except A/C is replaced with A/C. This includes electric resistive heaters, because the efficiency gains in upgrading to a heat pump are usually worth it.
- Water heaters: fossil fuel models (gas and LPG) upgraded to electric water heat pumps.
- Cooktops: fossil fuel models (gas and LPG) upgraded to electric induction cooktops.
- Vehicles: if the household has indicated that they would like to switch to an EV, we will replace those specified vehicles with an EV.

We also add solar & batteries if the household has indicated that they would like them.

## 3 Energy Use

Next, we calculate the energy use, which we use to determine the emissions and operating costs.

### 3.1 Appliances

We derive average household energy use across different appliances through the [Australian and New Zealand Residential Baseline Study 2021](https://www.energyrating.gov.au/industry-information/publications/report-2021-residential-baseline-study-australia-and-new-zealand-2000-2040), published November 2022. From here, these are scaled to the appropriate period (e.g. weekly, yearly, operational lifetime of 15 years).

#### 3.1.2 Space heating

Space heating energy factors for all heater types except heat pumps are calculated based on (this method is described in detail in our [Electrification Tipping Point Report 2025: p57](https://rewiringaustralia.org/report/the-electrification-tipping-point)). Average heat pump energy use was calculated using a coefficient of performance of 4.08.

Average energy use per day (in kWh/day) for space heater types:

| Location                             | OT | NSW  | ACT   | NT    | QLD   | SA    | TAS   | VIC   | WA    |
|-------------------------------------|-------|-------|--------|--------|--------|--------|--------|--------|--------|
| Electric heat pump                | 3.3   | 2.273 | 8.531  | 0.263  | 1.253  | 2.745  | 7.362  | 6.007  | 1.969  |
| Electric resistance | 12.8  | 9.09  | 31.20  | 1.11   | 5.16   | 10.98  | 26.92  | 23.34  | 7.87   |
| Natural gas                              | 16.0  | 11.36 | 39.00  | 1.39   | 6.44   | 13.72  | 33.65  | 29.18  | 9.84   |
| LPG                              | 16.0  | 11.36 | 39.00  | 1.39   | 6.44   | 13.72  | 33.65  | 29.18  | 9.84   |
| Wood                             | 19.7  | 13.99 | 48.00  | 1.71   | 7.93   | 16.89  | 41.42  | 35.91  | 12.12  |

#### 3.1.3 Water heating

Water heating efficiencies are sourced from the [US Department of Energy Energy Star ratings scheme](https://www.energystar.gov/products/water_heaters/residential_water_heaters_key_product_criteria). Electric resistive tank water heating is assumed at 90%, and heat pump water heaters are assumed at 367%, which is based upon the 10% tank losses combined with the EECA's 408% heat pump efficiency for space heating. 

Average energy use per day (in kWh/day) for water heater types:

| Water heater type | OT | NSW | ACT | NT | QLD | SA | TAS | VIC | WA |
|-------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| Electric heat pump | 1.83 | 1.76 | 2.00 | 1.27 | 1.64 | 1.81 | 1.90 | 2.05 | 1.84 |
| Electric resistance | 6.75 | 6.54 | 6.80 | 4.99 | 6.28 | 6.75 | 6.46 | 7.41 | 6.84 |
| Natural gas | 7.93 | 7.69 | 7.99 | 5.86 | 7.38 | 7.93 | 7.59 | 8.70 | 8.04 |
| LPG | 7.93 | 7.69 | 7.99 | 5.86 | 7.38 | 7.93 | 7.59 | 8.70 | 8.04 |

#### 3.1.4 Cooktop

Cooktop efficiency is sourced from the Frontier Energy [Residential Cooktop Performance and Energy Comparison Study #501318071-R0](https://cao-94612.s3.amazonaws.com/documents/Induction-Range-Final-Report-July-2019.pdf), published in July 2019. Electric efficiency is assumed at 95%, and gas/LPG at 90%. 

Average energy use per day (in kWh/day) for cooktop types:

| Location                             | OT    | NSW   | ACT   | NT    | QLD   | SA    | TAS   | VIC   | WA    |
|-------------------------------------|-------|-------|--------|--------|--------|--------|--------|--------|--------|
| Electric resistance                  | 0.94  | 0.95  | 0.88   | 0.99   | 0.93   | 1.00   | 1.00   | 0.92   | 0.97   |
| Electric induction                   | 0.85  | 0.86  | 0.80   | 0.90   | 0.84   | 0.91   | 0.91   | 0.83   | 0.87   |
| Natural gas                          | 2.20  | 2.21  | 2.07   | 2.32   | 2.17   | 2.35   | 2.34   | 2.14   | 2.26   |
| LPG                                  | 2.20  | 2.21  | 2.07   | 2.32   | 2.17   | 2.35   | 2.34   | 2.14   | 2.26   |

#### 3.1.5 Other appliances

For other ubiquitous appliances around the home, we assume they are all electric and use the following values (in kWh/day):

| Space cooling                                         | OT    | NSW   | ACT   | NT    | QLD   | SA    | TAS   | VIC   | WA    |
|-----------------------------------------------------|-------|-------|--------|--------|--------|--------|--------|--------|--------|
| Heat pump                                            | 0.94  | 0.77  | 0.74   | 7.58   | 1.89   | 0.63   | 0.09   | 0.10   | 1.65   |

| Other electronics                                     | OT    | NSW   | ACT   | NT    | QLD   | SA    | TAS   | VIC   | WA    |
|-----------------------------------------------------|-------|-------|--------|--------|--------|--------|--------|--------|--------|
| Washers and dryers                                   | 0.44  | 0.44  | 0.42   | 0.46   | 0.44   | 0.46   | 0.47   | 0.44   | 0.45   |
| Lighting                                             | 0.91  | 0.91  | 0.87   | 0.95   | 0.90   | 0.96   | 0.96   | 0.90   | 0.93   |
| Other appliances                                     | 3.86  | 3.97  | 3.89   | 4.11   | 3.75   | 3.79   | 3.78   | 3.87   | 3.76   |

| Other cooking                                         | OT    | NSW   | ACT   | NT    | QLD   | SA    | TAS   | VIC   | WA    |
|-----------------------------------------------------|-------|-------|--------|--------|--------|--------|--------|--------|--------|
| Refrigeration                                        | 2.06  | 2.07  | 1.93   | 2.17   | 2.03   | 2.21   | 2.22   | 2.01   | 2.10   |
| Dishwashers                                          | 0.30  | 0.30  | 0.28   | 0.31   | 0.30   | 0.32   | 0.32   | 0.29   | 0.31   |
| Microwave                                            | 0.30  | 0.30  | 0.29   | 0.32   | 0.30   | 0.32   | 0.32   | 0.30   | 0.31   |
| Ovens                                                | 0.34  | 0.34  | 0.33   | 0.36   | 0.34   | 0.36   | 0.37   | 0.34   | 0.35   |
| Uprights                                             | 0.39  | 0.39  | 0.37   | 0.41   | 0.38   | 0.41   | 0.42   | 0.38   | 0.40   |

| Pool equipment                                        | OT    | NSW   | ACT   | NT    | QLD   | SA    | TAS   | VIC   | WA    |
|-----------------------------------------------------|-------|-------|--------|--------|--------|--------|--------|--------|--------|
| Electric                                             | 0.67  | 0.74  | 0.24   | 1.75   | 1.00   | 0.49   | 0.25   | 0.35   | 0.87   |
| Natural gas                                          | 0.25  | 0.27  | 0.09   | 0.65   | 0.37   | 0.18   | 0.09   | 0.13   | 0.33   |

### 3.2 Scaling appliance energy use by occupancy

Household energy consumption does not scale linearly with the number of occupants. Shared resources and economies of scale mean that additional occupants do not proportionally increase energy usage. For example, a 1-bedroom apartment with two people living in it does not have twice the energy consumption as one person living in it. The ratio is likely to be lower, as some of the energy needs are shared (e.g. heating the living room, cooking 1 meal that is shared). 

Given that much of our energy consumption rates for each household appliances was based on averages from the Australian and New Zealand Residential Baseline Study 2021 (published November 2022), and given that the average Australian household has 2.7 occupants according to 2021 Census data, we needed to calculate a multiplier for the occupancy options given in the calculator.

#### 3.2.1 Data collection

We used electricity consumption numbers from data collected by the Australian Energy Regulator in their [Electricity and Gas consumption benchmarks for residential customers 2020 study](https://www.aer.gov.au/industry/registers/resources/guidelines/electricity-and-gas-consumption-benchmarks-residential-customers-2020). From the [Frontier Economics - Simple electricity and gas benchmarks - From June 2021](https://www.aer.gov.au/documents/frontier-economics-simple-electricity-and-gas-benchmarks-june-2021) data sheet, on the "Climate zone 6" sheet (Mild temperate, such as urban Melbourne, Adelaide Hills, Ulladulla; [see Table 1 on page 15](https://www.aer.gov.au/system/files/Residential%20energy%20consumption%20benchmarks%20-%209%20December%202020_0.pdf)), we averaged across all states and seasons, and we found the following electricity consumption and ratios.

_Table 1: Energy consumption by household size ([Source](https://www.aer.gov.au/documents/frontier-economics-simple-electricity-and-gas-benchmarks-june-2021))_
| Household Size | Average Electricity Use per Season (kWh) | Ratio |
|----------------|-----------------------------------------|-------|
| 1              | 803                                     | 1.00   |
| 2              | 1,328                                   | 1.65   |
| 3              | 1,410                                   | 1.75   |
| 4              | 1,583                                   | 1.97   |
| 5+             | 2,018                                   | 2.51   |


We did not use the separate gas energy consumption numbers to scale gas energy use as the ratios turned out to be very similar to the electricity consumption ratios for household size, and the immaterial difference was not worth the extra complexity.

#### 3.2.2 Nonlinear interpolation

In order to calculate the multiplier of the average energy consumption values, we first needed to find the ratio value for our reference occupancy of 2.7. To do this, we fitted an exponential model to the data in Table 1, using the first four data points and excluding `5+` as this is not actually a discrete data point, but a range. Please refer to [notebooks/occupancy.ipynb](notebooks/occupancy.ipynb) for the working on model fitting.

$f(x) = a \cdot (1 - e^{-b \cdot (x-1)}) + c$

Where:

- $x$ is the number of occupants
- $a$, $b$, and $c$ are fitted parameters

We selected this nonlinear exponential model because the relationship should:

- be nonlinear
- start close to 1 when x = 1
- have a sharp initial increase in consumption (from 1 to 2 occupants)
- show diminishing returns as occupancy increases (plateau)

There are limitations to this modelling approach given that it is based on very few data points, and certainly does not account for specific household characteristics (e.g. a 2-person apartment that luxuriates in fresh hot baths every day).

The interpolated value of the fitted exponential model at 2.7 occupants was 1.79.

#### 3.2.3 Scaling multiplier

To find the multiplier that we can use to scale our reference energy values, we then use the following formula:

$E_{new} = E_{ref} \cdot \frac{f(x)}{f(x_{ref})}$

Where:

- $E_{new}$ is the estimated energy consumption for the new  given household size
- $E_{ref}$ is the reference energy consumption from our existing data about the average household
- $f(x)$ is the exponential scaling function
- $x$ is the number of occupants
- $x_{ref}$ is the reference occupancy (2.7)

Since this formula was fitted to only the first four values of household size, and is not intended to work with a range like `5+ occupants`, it will not work for the `5+` category. The jump from 4 to 5+ occupants in the original data (Table 1) is actually quite high. The jump from 3 to 4 occupants is 0.2, but 4 to 5+ is 0.5. This makes sense because 5+ includes households larger than 5, so extrapolating for $x = 5$ would not give an accurate figure.

Instead, we've instead taken the relative increase in energy consumption between `4` and `5+` occupants from Table 1 (27.5% increase from 1,583 kWh to 2,018 kWh) and applied this to the energy consumption scaling factor $f(4)$.

$f(5+) = f(4) \cdot (1+\frac{2,018 - 1,583}{1,583}) \approx 1.37$

This rounds out our table of scaling factors for all the occupancy options that we have available:

Table 2: Scaling factors for energy consumption based on occupancy

| Occupants | Energy Consumption scaling factor |
|-----------|--------------------------|
| 1 | 0.56 |
| 2 | 0.90 |
| 2.7 (reference) | 1.00 |
| 3 | 1.03 |
| 4 | 1.07 |
| 5+ | 1.37 |

### 3.3 Vehicles

We derive average vehicle energy use through the Australian Bureau of Statistics (ABS) [Survey of Motor Vehicle Use 2018](https://www.abs.gov.au/statistics/industry/tourism-and-transport/survey-motor-vehicle-use-australia/12-months-ended-30-june-2018) for 2018. We use data from 2018 for vehicles, as this is before COVID lockdowns and the database for vehicles has not been updated since 2020. The assumption made here is that Australians drive similar amounts per year today as they did in 2018.

Energy use (in kWh/day) for different vehicle types:
| Vehicle Type | OT  | NSW  | ACT  | NT   | QLD  | SA   | TAS  | VIC  | WA   |
| ------------ | --- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Petrol       | 36  | 36.7 | 33.5 | 38.6 | 37.2 | 33.2 | 33.6 | 35.9 | 35.8 |
| Diesel       | 28  | 29   | 26   | 30   | 29   | 26   | 26   | 28   | 28   |
| Electric     | 9.3 | 9.4  | 8.6  | 9.9  | 9.6  | 8.5  | 8.6  | 9.2  | 9.2  |

Plug-in hybrids are assumed to be 60% petrol and 40% electric, while hybrids are considered to be 70% petrol and 30% electric.

We scale this average energy use by each vehicle's stated usage. The average Australian car drives 13,000 km, rounded to 255 km per week, taken from 2018 stats on light passenger and light commercial vehicles from the ABS.

|         | OT   | NSW  | ACT  | NT   | QLD  | SA   | TAS  | VIC  | WA   |
| ------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| kms/day  | 36.4 | 36.2 | 35.1 | 35.9 | 36.9 | 35.0 | 33.1 | 38.0 | 33.8 |

We use this to scale the energy usage per vehicle. For example, in New South Wales, if a petrol vehicle's mileage is 300 kms/week, then its energy usage would be:

$36.7 \space\text{kWh/day} \times \frac{300\space\text{km/week}}{(36.2 \times 7)\space\text{km/week}} \times 24\space\text{hours/day} \times 7\space\text{days/week}$.

The dropdown options for vehicle usage in our [household calculator frontend app](https://github.com/rewiring-nz/household-calculator-app/) are `Low (<100 km/wk)`, `Medium (100-300 km/wk)`, and `High (300+ km/wk)`. These options correspond to values `50 km/wk`, `255 km/wk` (the national average), and `400 km/wk` respectively.

### 3.4 Solar

The formula for calculating electricity generation from solar is as follows:

$E_{generated} = S \cdot C_{loc} \cdot D$

Where:

- $E_{generated}$ is the energy generated per hour
- $S$ is the solar panel size in kW
- $C_{loc}$ is the solar capacity factor for a given location
- $D$ is the degradation over the 30 year lifespan of the panels

We assume 0.5% degradation per year over a 30-year lifetime, which averages out to $D = 6.92%$ degradation over 30 years, or 93.08% performance of nameplate capacity over 30 years.

We assume the following solar capacity factors $C_{loc}$ per region:

> [!NOTE]
> These are conservative, static estimates of solar capacity factor. They are likely to increase over the years due to technology advancements, as it has rapidly in recent history.

|                       | OT | NSW   | ACT   | NT    | QLD   | SA    | TAS   | VIC   | WA    |
| --------------------- | --------- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Solar capacity factor | 17.1%     | 16.3% | 16.3% | 19.0% | 18.7% | 17.9% | 15.9% | 15.4% | 21.0% |
### 3.5 Battery

The formula for calculating battery capacity per day is as follows:

$E_{battery} = C \cdot c_{day} \cdot \bar{D}_{15} \cdot (1-L)$

Where:

- $E_{battery}$ is the energy storage capacity in kWh/day
- $C$ is the battery capacity in kWh/cycle
- $c_{day}$ is the number of battery cycles per day, assumed to be 1 (it is filled up and depleted once per day)
- $\bar{D}_{15}$ is the average degraded performance of the battery over a 15 year product lifetime, calculated to be 85.22%
- $L$ are the losses from the internal electronics & wiring of the battery, assumed to be 5%. In other words, we assume the round-trip efficiency is 95%.

We assume that all the electricity stored in the battery is from solar. The model does not handle the scenario where there are batteries but no solar (we don't model arbitrage).

## 4 Emissions

To calculate emissions, we take the energy consumption from the various machines and their fuel types, and multiply these by the emissions factors. The emissions factors are taken from Australia's [National Greenhouse Accounts](https://greenhouseaccounts.climatechange.gov.au/).

| Emissions factors (kgCO₂e/kWh)         | OT | NSW  | ACT  | NT   | QLD  | SA   | TAS  | VIC  | WA   |
| -------------------------- | --------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Grid  | 0.77      | 0.79 | 0.79 | 0.57 | 0.80 | 0.35 | 0.16 | 0.96 | 0.63 |
| Natural Gas        | 0.19      | 0.19 | 0.19 | 0.19 | 0.19 | 0.19 | 0.19 | 0.19 | 0.19 |
| Petrol     | 0.24      | 0.24 | 0.24 | 0.24 | 0.24 | 0.24 | 0.24 | 0.24 | 0.24 |
| Diesel     | 0.25      | 0.25 | 0.25 | 0.25 | 0.25 | 0.25 | 0.25 | 0.25 | 0.25 |
| Wood       | 0.40      | 0.40 | 0.40 | 0.40 | 0.40 | 0.40 | 0.40 | 0.40 | 0.40 |
| LPG                        | 0.22      | 0.22 | 0.22 | 0.22 | 0.22 | 0.22 | 0.22 | 0.22 | 0.22 |

To calculate emissions savings, we simply take the difference between the current and electrified household's total emissions.

> [!NOTE]
> Emissions reductions from electrification are likely conservative, as it currently does not distinguish the amount of electricity that is self-consumed from solar (zero emissions) from the electricity consumed from the grid (emissions factor of 0.074). This has been noted as a future improvement in #46.

## 5 Operating Costs

After calculating energy consumption across fuel types, we first calculate how much of the electricity need is met by solar, battery storage, or straight from the grid, and how much solar-generated electricity is left over for export. Then, we calculate the volume energy costs for each fuel type, including the various sources of electricity, using the appropriate pricing.

We add the fixed costs (gas, LPG, or grid connections) and subtract the revenue from solar export. This gives the total operating costs for a given household. We take the difference between the total operating costs for the current and electrified household to get the savings.

### 5.1 Solar self-consumption

How much a household is able to self-consume ($E_{self-consumed}$) from their generated solar electricity will influence their savings.

We assume a self-consumption rate of 50% for appliance electricity needs, and 50% for vehicle electricity needs. This is based on the following assumptions:

- Water heating, which is around a quarter of average household loads, can be moved almost entirely into the solar window in what is described as a “thermal battery”. This is similar to existing "ripple control" used in Australian electric water heaters to avoid peak electricity times.
- Other appliances, such as space heaters, can only be moved a small amount, with significant energy needs being met outside the solar window.
- We consider this to be a conservative estimate of the load shifting possible by households. For example, with new electric vehicles having more range than a week or even two weeks of driving, households could choose to charge near 100% from solar on weekends or, if they are at home during sunlight hours, any time during the week.
- The other electricity consumption is assumed at full grid electricity costs, which we also consider to be conservative as households often have access to low cost electric vehicle charging rates during off peak periods.

Please refer to the logic in [get_e_consumed_from_solar()](src/savings/energy/get_electricity_consumption.py) for more details.

### 5.2 Battery impact

We then calculate how much of the solar generation is stored in battery, then consumed or exported. This impacts how much of the grid's peak prices can be offset by night rates.

We assume that all the electricity stored in the battery is from solar. We don't yet allow for batteries (and therefore arbitrage) without solar. If the energy remaining from generation after self-consumption is less than the battery's capacity, battery stores all the remaining energy. If there is more energy remaining than the capacity, the battery is filled to capacity. We assume that all machine types have the same self-consumption rates from the battery. A future improvement may be to have different battery consumption rates for each machine type, since certain machines are able to shift their consumption times more easily than others (e.g. water heaters vs. cooking).

### 5.3 Solar export

The amount of electricity exported to the grid is calculated as follows:

$E_{exported} = E_{generated} - E_{battery} - E_{self-consumed}$

### 5.4 Grid consumption

The amount of electricity consumed from the grid to meet any remaining electricity needs is follows:

$E_{grid} = E_{needs remaining} - E_{battery}$

The energy needs remaining are whatever is left after solar self-consumption ($E_{self-consumed}$).

### 5.5 Energy Prices

From here, we can multiply the electricity and fuel consumed with their prices, as well as the energy exported with the solar export tariff. We also include the fixed costs of grid and gas/LPG connections. All houses remain connected to the grid, paying yearly grid connection fixed costs, but electrified homes no longer need to pay yearly fixed costs for gas connections.

Our opex calculations for daily, weekly, and yearly savings use 2025 prices, while our lifetime savings use the average prices over 15 years. Prices for petrol and diesel come from AIP data, and natural gas pricing is based on Australian Energy Regulator data, based on 2025 Australian dollars. Where data is not provided (e.g. wood), an online comparison of prices is used. While MBIE provides combined residential gas fixed and volume costs in a combined rate, this is split into a lower cost volume rate, and a fixed yearly rate from natural gas offers available on Energy Made Easy.

We base the rate of inflation on Australia's CPI history from 2000 to 2024 at 2.81%. We set future product price base inflation at 2%. The real inflation rates used for energy are the nominal value minus the All CPI groups rate over the same period of 2.81% pa (All Groups CPI). The specific rate of inflation for each fuel type, alongside today's fixed & volume costs versus the average over the next 15 years, can be found in the table below. 

Energy prices:

### Cost per fuel kWh today ($/kWh)
|           | OT      | NSW     | ACT      | NT       | QLD      | SA       | TAS      | VIC      | WA       |
| -------------------- | ------- | ------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
| Electricity volume   | $0.320  | $0.340  | $0.260   | $0.280   | $0.320   | $0.440   | $0.300   | $0.270   | $0.310   |
| Electricity off peak | $0.211  | $0.220  | $0.170   | $0.190   | $0.210   | $0.290   | $0.200   | $0.180   | $0.210   |
| Natural gas          | $0.146  | $0.153  | $0.159   | $0.146   | $0.209   | $0.202   | $0.194   | $0.133   | $0.115   |
| LPG                  | $0.280  | $0.310  | $0.280   | $0.400   | $0.300   | $0.300   | $0.240   | $0.260   | $0.220   |
| Wood                 | $0.130  | $0.140  | $0.094   | $0.151   | $0.151   | $0.111   | $0.067   | $0.110   | $0.140   |
| Petrol               | $0.199  | $0.200  | $0.200   | $0.208   | $0.202   | $0.193   | $0.199   | $0.199   | $0.192   |
| Diesel               | $0.180  | $0.180  | $0.180   | $0.200   | $0.180   | $0.180   | $0.180   | $0.180   | $0.170   |

### Fixed costs per year ($/year)
|           | OT      | NSW     | ACT      | NT       | QLD      | SA       | TAS      | VIC      | WA       |
| -------------------- | ------- | ------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
| Electricity          | $432    | $465    | $441.000 | $210.000 | $450.000 | $415.000 | $435.000 | $396.000 | $414.000 |
| Natural gas          | $247    | $244    | $260.000 | $247     | $247.000 | $297.000 | $235.000 | $296.000 | $80.000  |
| LPG                  | $95.47  | $96.00  | $96.000  | $105.000 | $95.000  | $99.000  | $96.000  | $96.000  | $90.000  |

### Cost per fuel kWh average 15 years ($/kWh)
|           | OT      | NSW     | ACT      | NT       | QLD      | SA       | TAS      | VIC      | WA       |
| -------------------- | ------- | ------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
| Electricity          | $0.39   | $0.41   | $0.300   | $0.280   | $0.550   | $0.540   | $0.360   | $0.310   | $0.380   |
| Natural gas          | $0.19   | $0.19   | $0.21    | $0.19    | $0.25    | $0.25    | $0.26    | $0.22    | $0.18    |
| LPG                  | $0.36   | $0.38   | $0.36    | $0.41    | $0.35    | $0.38    | $0.27    | $0.35    | $0.26    |
| Wood                 | $0.17   | $0.17   | $0.12    | $0.16    | $0.18    | $0.14    | $0.08    | $0.15    | $0.17    |
| Petrol               | $0.22   | $0.22   | $0.220   | $0.210   | $0.230   | $0.210   | $0.210   | $0.220   | $0.210   |
| Diesel               | $0.20   | $0.20   | $0.190   | $0.200   | $0.200   | $0.190   | $0.190   | $0.200   | $0.190   |

### Fixed costs per year avg 15 years ($/year)
|           | OT      | NSW     | ACT      | NT       | QLD      | SA       | TAS      | VIC      | WA       |
| -------------------- | ------- | ------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
| Electricity          | $532.04 | $562.08 | $511.120 | $205.940 | $777.940 | $507.180 | $517.420 | $446.050 | $509.480 |
| Natural gas          | $314.22 | $300.40 | $337.020 | $314.22  | $291.000 | $291.280 | $375.070 | $265.210 | $398.600 |
| LPG                  | $121.53 | $118.16 | $124.580 | $108.220 | $112.170 | $125.030 | $108.120 | $129.280 | $108.540 |

### Solar feedin tariff
|           | OT      | NSW     | ACT      | NT       | QLD      | SA       | TAS      | VIC      | WA       |
| -------------------- | ------- | ------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
| Electricity          | $0.06   | $0.06   | $0.06    | $0.06    | $0.06    | $0.06    | $0.06    | $0.06    | $0.06    |

### Solar feedin tariff avg 15 years
|           | OT      | NSW     | ACT      | NT       | QLD      | SA       | TAS      | VIC      | WA       |
| -------------------- | ------- | ------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
| Electricity          | $0.08   | $0.10   | $0.12    | $0.10    | $0.12    | $0.09    | $0.11    | $0.06    | $0.04    |

The battery export feed-in-tariff is assumed to be the same as the solar feed-in-tariff. This is considered conservative, as the battery can feed in at peak times when electricity prices are significantly higher, and where some networks and retailers provide higher reward for peak feed-in. 

> [!NOTE]
> In order to take into account the impact of the battery, we use an adjusted grid price that reflects the proportion of electricity that could be purchased off peak. Please refer to the logic in [get_effective_grid_price()](src/savings/opex/calculate_opex.py) for more details.


## 5 Replacement & Upfront Costs

### 5.1 Appliances

Appliance replacement costs come from a comparison of over 100 different quotes for appliance costs, sourced both online and direct from installers. An average capital cost and average install cost is used for each individual appliance. The scope of the appliance cost comparison aims to compare products that are not the cheapest possible product, nor the most expensive, as appliance costs can vary significantly. The aim of the comparison was to create an assumed common cost for each option, in the middle of the cost spectrum. 

Appliance installation specific costing is scarce, and we acknowledge the need for detailed work in the area of obtaining these "soft costs" or installation costs of devices. Installation costs also vary significantly between installers, creating further complexity. This model uses installation costs that are the result of real quotes from both online and direct installers.
   
The following appliance price and installation cost are assumed:


| Appliance     | Fuel type                   | Item price ($) | Install cost ($) |
|---------------|-----------------------------|----------------|------------------|
| Space heater  | Electricity (heat pump)     | 2600           | 900             |
| Water heater  | Electricity (heat pump)     | 3500           | 1000            |
| Cooktop       | Electricity (induction)     | 2000           | 1200            |

### 5.2 Vehicles

The model does not provide upfront costs for vehicles, although the calculator app provides a general range to give an indication of replacing fossil fuel vehicles with EVs. The range is based on a comparison of popular Australian petrol vehicles and their prices, compared to a similar EV option and its price, using pricing data from vehicle manufacturer websites accessed in August 2024.

### 5.3 Solar

The upfront cost of installing solar is estimated at $950/kW using data from Solar Choice. This is essentially $800/kW plus the cost of an inverter which lasts 15 years. Inverter replacement costs are assumed at $2,500.

### 5.4 Batteries

Battery upfront costs are assumed at $950/kWh, based on data from Solar Choice and over 50 quotes from installers.

## 6 Recommendations

The API's recommendation for the household's next steps is currently a simple heuristic. It simply takes the first recommendation from a prioritised list, that the household currently does not have. The list has been prioritised based on Rewiring's prior knowledge and research of what upgrades typically bring the most savings:

1. Rooftop solar
1. First EV
1. Space heater
1. Water heater
1. Cooktop
1. Battery
1. All other EVs

In future, we may improve this recommendation algorithm to take into account machine-specific savings and replacement costs.
