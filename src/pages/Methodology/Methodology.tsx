import React, { useEffect } from "react";
import { Box, IconButton, Link, Typography, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowBackIcon from "../../assets/icons/arrow-back.svg?react";
import CloseIcon from "../../assets/icons/x-window1.svg?react";
import "./Methodology.css";

const Methodology: React.FC = () => {
  const theme = useTheme();

  useEffect(() => {
    // Scroll to the top when the component is mounted
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.6rem 1.5rem 0.6rem 1.7rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton
            edge="start"
            color="inherit"
            component={RouterLink}
            to="/"
            aria-label="back"
          >
            <ArrowBackIcon
              style={{
                width: "1.5rem",
                height: "1.5rem",
              }}
            />
          </IconButton>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ textDecoration: "none", color: "inherit", marginLeft: "8px" }}
          >
            Back
          </Typography>
        </div>
        <IconButton
          edge="end"
          color="inherit"
          component={RouterLink}
          to="/"
          aria-label="close"
        >
          <CloseIcon
            style={{
              width: "1.5rem",
              height: "1.5rem",
            }}
          />
        </IconButton>
      </div>

      <Box
        className="content"
        id="methodology-content"
        sx={{
          maxWidth: "30rem",
          padding: "1rem",
          [theme.breakpoints.up("sm")]: {
            maxWidth: "35rem",
            margin: "2.5rem auto",
          },
          [theme.breakpoints.up("md")]: {
            maxWidth: "80rem",
            margin: "2.5rem 7rem",
          },
        }}
      >
        <Typography variant="h1">How we calculated this result</Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: "1.5rem" }}>
          Our calculator helps you understand the potential financial and
          environmental benefits of electrifying your home.
        </Typography>

        <Box
          className="paragraphs"
          sx={{
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
            [theme.breakpoints.up("md")]: {
              flexDirection: "row",
              gap: "2rem",
            },
          }}
        >
          <Box>
            <Typography variant="h2">Our Approach</Typography>

            <Typography variant="body2">
              Our model looks at your specific household's entire energy use,
              including heating, water heating, cooking, other electronics,
              transportation, and the options of solar and batteries, to
              calculate your personal savings estimates. Our calculations are
              based on real-world data from Australian government sources,
              energy pricing, and household energy consumption studies.
            </Typography>

            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              Note: Actual savings may vary based on individual household
              characteristics, energy use patterns, and future energy price
              changes.
            </Typography>

            <Typography variant="h2">Cost & Emissions Savings</Typography>
            <Typography variant="body2">
              We compare your current energy setup and costs with an upgraded, all-electric
              version of your home. This means:
              <ul style={{ paddingLeft: "1.5rem", margin: 0 }}>
                <li>
                  Replacing fossil fuel heaters (gas, LPG, diesel), wood, or
                  electric resistive heaters (like oil columns or fan heaters)
                  with efficient air conditioners for maximum heating savings
                </li>
                <li>
                  Switching to heat pump water heaters and induction cooktops
                </li>
                <li>Installing solar and/or batteries (based on your selection)</li>
                <li>
                  Switching from fossil fuel vehicles to EVs
                </li>
              </ul>
            </Typography>

            <Typography variant="h3">Energy Consumption</Typography>
            <Typography variant="body2">
              The calculator uses the assumptions of Rewiring Australia's{" "}
              <Link
                href="https://github.com/Rewiring-Aus/energy-savings-2026-model"
                target="_blank"
              >
                Energy Savings 2026 model
              </Link>
              . Average household energy use for each appliance, by state, comes
              from the{" "}
              <Link
                href="https://www.energyrating.gov.au/industry-information/publications/report-2021-residential-baseline-study-australia-and-new-zealand-2000-2040"
                target="_blank"
              >
                Australian and New Zealand Residential Baseline Study 2021
              </Link>
              . These are measured figures, so the efficiency gap between, say, a
              gas heater and a heat pump is already built in. Lighting,
              refrigeration, laundry, cooling and other appliances use the same
              energy in every scenario. Energy use is scaled by the number of
              occupants (using the AER residential consumption benchmarks), and
              apartments use 21% less energy than houses.
            </Typography>
            <Typography variant="body2">
              Vehicle energy use is the average efficiency of each vehicle size
              (small car, sedan or SUV) multiplied by the distance you drive.
              Petrol and diesel efficiency is calibrated to the ABS Survey of
              Motor Vehicle Use fleet average of 11.1 L/100 km. We assume 15% of
              EV charging happens at public fast chargers ($0.65/kWh); the rest
              is charged at home. Hybrids are modelled as 70% petrol and 30%
              electric, and plug-in hybrids as 60% petrol and 40% electric.
            </Typography>
            <Typography variant="body2">
              Solar generation is based on panel size and your state's average
              capacity factor, with more output in summer than winter. Each
              appliance can use a different share of its energy from solar (for
              example, a heat pump hot water system on a timer can run mostly on
              solar, while overnight heating cannot), and at least 10% of every
              load is always bought from the grid. Batteries are modelled across
              a typical day in each season: stored solar first covers your
              evening use, then charges your EV, and any surplus is exported. We
              assume 90% of the battery's capacity is usable, 90% round-trip
              efficiency, and gradual capacity loss over time.
            </Typography>

            <Typography variant="h3">Emissions Reduction</Typography>
            <Typography variant="body2">
              To calculate emissions, we multiply the energy each appliance and
              vehicle uses by its emissions factor, from Australia's{" "}
              <Link
                href="https://greenhouseaccounts.climatechange.gov.au/"
                target="_blank"
              >
                National Greenhouse Accounts
              </Link>
              . Grid electricity uses your state's current factor; solar you use
              directly or through your battery is zero-emission. We don't assume
              the grid gets cleaner over time, so the emissions of electric
              options are likely overstated.
            </Typography>
            <Typography variant="body2">
              To calculate emissions savings, we simply take the difference
              between the current and electrified household's total emissions.
            </Typography>

            <Typography variant="h3">
              Operating Costs (Energy & Fuel Bill)
            </Typography>
            <Typography variant="body2">
              We price each fuel using 2026 retail prices for your state:
              electricity, gas, LPG, petrol, diesel and public fast charging.
              Weekly and yearly savings use current prices; savings over 15
              years use forecast prices that rise in line with each fuel's
              long-run price growth.
            </Typography>
            <Typography variant="body2">
              Homes that still use gas, or don't have both solar and a battery,
              are priced on a flat electricity tariff. A fully electric home with
              solar and a battery can shift its use away from expensive times, so
              we price it on a time-of-use tariff. Where this applies, we show
              how much of your saving comes from the tariff switch.
            </Typography>
            <Typography variant="body2">
              Each fuel you're connected to adds its daily supply charge, so
              disconnecting from gas is a real saving. Solar you export earns
              your state's average feed-in tariff, which is subtracted from your
              bills. Car servicing (including tyres and consumables, but not
              registration or insurance) is added for each vehicle, based on its
              size and whether it&apos;s electric: for example $750 a year for a
              small petrol car and $510 for a small EV. Learn more about our sister org Rewiring
              Aotearoa's advocacy on fair solar export prices from{" "}
              <Link
                href="https://www.rewiring.nz/symmetrical-export-tariffs"
                target="_blank"
              >
                their paper on symmetrical export tariffs
              </Link>
              .
            </Typography>
            <Typography variant="body2">
              The difference between current and electrified household's
              operating costs gives the savings.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h2">Upgrade Costs</Typography>
            <Typography variant="body2">
              Upgrade costs are the cost to replace your machines with electric
              alternatives - whether you upgrade them early, or as they reach
              their end of life. These are averages based on over 100 quotes,
              comparing mid-range options for typical appliances. Prices include
              both capital and installation costs, sourced from both online and
              direct quotes from installers. Due to variations in installation
              costs per region and installer, we recognise that a more detailed
              analysis of household conditions and installation costs per
              appliance and region would be valuable for planning household
              upgrades - we plan to include this analysis in future. In the
              meantime, you can check out our{" "}
              <Link
                href="https://rewiringaustralia.org/go-electric/resources"
                target="_blank"
              >
                electrification fact sheets
              </Link>{" "}
              for more information on how to electrify.
            </Typography>
            <Typography variant="body2">
              For vehicles, we provide a general range for replacing fossil fuel
              vehicles with new EVs, based on Australian prices for popular
              vehicles. This estimate does not include any savings available from the FBT exemption for salary packaged cars.
              It should be noted that buying an EV is a car purchase
              like any other. You don’t have to buy new; there are growing numbers of
              secondhand EVs available in the market now. Also, when buying a
              new car, you would usually take into account the purchase price
              (what we’ve shown) minus the resale value. So you wouldn’t
              normally be losing $30k-$70k outright for every EV you buy.
            </Typography>
            <Typography variant="body2">
              Solar panels are priced per kW for your state (from $533/kW in
              the ACT to $1,490/kW in the NT), plus an inverter ($1,800, or
              microinverters at $300/kW for systems of 5 kW or less). Batteries
              are $620 per kWh of storage, including the Cheaper Home Batteries
              discount, with a $2,300 installation charge if added to existing
              solar. Heat pump heating assumes $3,200 per unit, with 1 to 3 units
              depending on your state&apos;s climate. State rebates available to
              every household (and to apartments) are deducted. Real costs will
              vary by region and installer.
            </Typography>
            <Typography variant="h2">Recommendations (Next Steps)</Typography>
            <Typography variant="body2">
              The calculator's recommendation for your next steps currently
              takes the first item off a prioritised list that your current
              household does not yet have. The list has been prioritised based
              on Rewiring's prior knowledge and research of what upgrades
              typically bring the most savings for a reasonable upfront cost:
              <ol>
                <li>Rooftop solar</li>
                <li>First EV</li>
                <li>Space heater</li>
                <li>Hot water</li>
                <li>Cooktop</li>
                <li>Battery</li>
                <li>All other EVs (high savings but expensive upfront cost)</li>
              </ol>
              In future, we may improve this recommendation algorithm to take
              into account machine-specific savings and upgrade costs.
            </Typography>
            <Typography variant="h2">Further reading</Typography>
            <Typography variant="h3">More information & analysis</Typography>
            <Typography variant="body2">
              🔧&nbsp;
              <Link
                href="https://rewiringaustralia.org/research-and-resources"
                target="_blank"
              >
                Visit Rewiring Australia's Research and Resources page
              </Link>{" "}
              to find fact sheets, research reports and submissions on electrification
            </Typography>
            
            <Typography variant="h3">About this calculator</Typography>
            <Typography variant="body2">
              🤓&nbsp;
              <Link
                href="https://github.com/Rewiring-Aus/energy-savings-2026-model/blob/main/Methodology_v1.md"
                target="_blank"
              >
                Dive into our detailed methodology
              </Link>{" "}
              including energy consumption values, prices, and emissions factors
            </Typography>

            <Typography variant="body2">
              This tool was created by our friends across the ditch at{" "}
              <Link href="https://www.rewiring.nz/" target="_blank">
                Rewiring Aotearoa
              </Link>
              , a nonprofit representing everyday New Zealanders in the energy
              transition. Whakahiko te ao! (Electrify everything!) ⚡️
            </Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Methodology;
