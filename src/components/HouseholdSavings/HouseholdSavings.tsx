import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

// ----------------- Styles & Material UI -------------------
import {
  Box,
  Typography,
  useTheme,
  Link,
} from "@mui/material";
import { FDivider } from "src/shared/styles/FDivider";

// ----------------- Components -------------------
import ResultBox from "./ResultBox";

import OpenIcon from "src/assets/icons/open-outline.svg?react";

// ----------------- Models & Interfaces -------------------
import { Household, Savings, UpfrontCost } from "src/calculator/types";
import EmailReportForm from "src/components/EmailReportForm/EmailReportForm";
import { electricVehicleURL } from "src/shared/links";

import {
  calcPercentage,
  formatKgs,
  formatSavingsNZD,
  roundToSigFigs,
} from "src/shared/utils/formatters";
import { SavingsFrameBox } from "./HouseholdSavings.styles";

export interface SavingsProps {
  results: Savings;
  loadingData: boolean;
  numEVsToBuy: number;
  appliances: {
    currentSpaceHeater: string;
    currentWaterHeater: string;
    currentCooktop: string;
  };
  household: Household;
  isMobile?: boolean;
}

const getVehicleCostStr = (numEVsToBuy: number): string => {
  const priceRangeLow = 30000;
  const priceRangeHigh = 70000;
  const totalPriceKsRangeLow = ((priceRangeLow * numEVsToBuy) / 1000).toFixed(
    0,
  );
  const totalPriceKsRangeHigh = ((priceRangeHigh * numEVsToBuy) / 1000).toFixed(
    0,
  );
  const vehicleCostStr = `$${totalPriceKsRangeLow}k-$${totalPriceKsRangeHigh}k`;
  return vehicleCostStr;
};

const getUpgradeCostSubtext = (upfrontCost?: UpfrontCost) => {
  if (!upfrontCost?.battery) {
    if (!upfrontCost?.solar) {
      return "for new appliances";
    }
    return "for new appliances & solar";
  }
  if (!upfrontCost?.solar) {
    return "for new appliances & battery";
  }
  return "for new appliances, solar, and battery";
};

const HouseholdSavings: React.FC<SavingsProps> = ({
  results,
  loadingData,
  appliances,
  numEVsToBuy,
  household,
  isMobile = false,
}) => {
  const theme = useTheme();

  const [upfrontCostTotal, setUpfrontCostTotal] = useState("0");
  const vehicleCostStr = getVehicleCostStr(numEVsToBuy);
  const upgradeCostSubtext = getUpgradeCostSubtext(results?.upfrontCost);

  useEffect(() => {
    // Round constituent values to nearest $100 first before summing for total
    const total = results?.upfrontCost
      ? Object.values(results.upfrontCost)
          .map((value) => Math.round(value / 100) * 100) // Round each value to the nearest $100
          .reduce((acc, val) => acc + val, 0) // Sum the rounded values
      : 0;
    const totalString = `$${total.toLocaleString("en-NZ")}`;
    setUpfrontCostTotal(totalString);
  }, [results, loadingData]);

  return (
    <Box
      className="HouseholdSavings"
      sx={{
        padding: "1.25rem",
        backgroundColor: theme.palette.primary.main,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "1rem",
        borderRadius: 0,
        margin: "auto 0",
        [theme.breakpoints.up("sm")]: {
          borderRadius: 1,
        },
      }}
      aria-label="Household Savings Section"
    >
      <Box
        className="ResultsHeader"
        sx={{
          margin: "0 0.1rem",
        }}
      >
        {!isMobile && (
          <Typography variant="h1" aria-label="Your Savings">
            Your Savings
          </Typography>
        )}
        <Typography variant="subtitle2">
          By electrifying your household, we estimate you could save:
        </Typography>
      </Box>

      <SavingsFrameBox
        className="Results"
        aria-label="Results"
        sx={{
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <ResultBox
          label="Energy & Fuel Bills"
          heading={`${formatSavingsNZD(results?.opex?.perYear?.difference, 0)} saved per year`}
        >
          <Typography variant="body1">
            <span style={{ fontWeight: "600" }}>
              {` ${formatSavingsNZD(results?.opex?.perWeek?.difference, 0)}`}
            </span>{" "}
            saved per week
          </Typography>
          <Typography variant="body1">
            <span style={{ fontWeight: "600" }}>
              {` ${formatSavingsNZD(results?.opex?.overLifetime?.difference, 0)}`}
            </span>{" "}
            saved over 15 year product lifetime
          </Typography>
        </ResultBox>

        <FDivider />

        <ResultBox
          label="Energy Emissions"
          heading={`${calcPercentage(results?.emissions?.perYear)}% saved`}
        >
          <Typography variant="body1">
            That's{" "}
            <span style={{ fontWeight: "600" }}>
              {formatKgs(results?.emissions?.perYear?.difference)}
            </span>
            of CO<sub>2</sub>e saved every year!
          </Typography>
        </ResultBox>

        <FDivider />

        <ResultBox
          label="Upgrade Cost"
          heading={upfrontCostTotal}
          subheading={upgradeCostSubtext}
          bulletPoints={[
            {
              label: "House heating",
              value: roundToSigFigs(results?.upfrontCost?.spaceHeating),
            },
            {
              label: "Water heating",
              value: roundToSigFigs(results?.upfrontCost?.waterHeating),
            },
            {
              label: "Cooktop",
              value: roundToSigFigs(results?.upfrontCost?.cooktop),
            },
            {
              label: "Solar",
              value: roundToSigFigs(results?.upfrontCost?.solar),
            },
            {
              label: "Battery",
              value: roundToSigFigs(results?.upfrontCost?.battery),
            },
          ]}
        >
          <p>
            Note that this is the <i>total</i> cost estimate of new electric
            alternatives. When comparing with savings, you should compare the
            cost <i>difference</i> between new fossil fuel and electric
            alternatives.
          </p>
          {numEVsToBuy > 0 && (
            <>
              <Typography
                variant="h2"
                sx={{
                  margin: "1.5rem 0 0.2rem 0",
                }}
              >
                + {vehicleCostStr}
              </Typography>
              <Typography variant="body2">
                <span style={{ fontWeight: "600" }}>
                  for {numEVsToBuy} new EVs.
                </span>{" "}
                New mid-range EVs cost $30k-$70k each, depending on the model.
                Secondhand EVs start at ~$3k.&nbsp;
                <Link
                  href={electricVehicleURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  Learn more here
                  <OpenIcon
                    style={{
                      marginLeft: "0.3rem",
                      maxWidth: "15px",
                      maxHeight: "15px",
                      stroke: "white",
                      fill: "none"
                    }}
                  />
                </Link>
              </Typography>
            </>
          )}
        </ResultBox>
        <FDivider />
        <Box sx={{ marginTop: "1.2rem", marginBottom: "0.4rem" }}>
          <Typography variant="body1">
            <Link component={RouterLink} to="/methodology">
              How did we calculate this?
            </Link>
          </Typography>
        </Box>
      </SavingsFrameBox>

      <SavingsFrameBox
        className="EmailReport"
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
        }}
      >
        <EmailReportForm results={results} household={household} />
      </SavingsFrameBox>

    </Box>
  );
};

export default HouseholdSavings;
