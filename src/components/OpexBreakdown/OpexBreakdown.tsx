import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { FDivider } from "src/shared/styles/FDivider";
import type { Savings } from "src/calculator/types";

interface OpexBreakdownProps {
  savingsData?: Savings;
}

const OpexBreakdown: React.FC<OpexBreakdownProps> = ({ savingsData }) => {
  const theme = useTheme();
  const [showOpexBreakdown, setShowOpexBreakdown] = useState(false);

  const gridSx = {
    backgroundColor: theme.palette.background.paper,
    padding: "1rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
    width: "100%",
    boxSizing: "border-box",
  } as const;

  return (
    <>
      <FDivider />
      <Typography
        variant="h3"
        sx={{
          marginBottom: "1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          textDecoration: "underline",
          "&:hover": {
            color: theme.palette.primary.main,
          },
        }}
        onClick={() => setShowOpexBreakdown(!showOpexBreakdown)}
      >
        Annual opex costs breakdown
      </Typography>
      {showOpexBreakdown && (
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box sx={gridSx}>
            <Typography sx={{ fontWeight: "bold", gridColumn: "1 / -1" }}>
              Current household
            </Typography>
            <Box
              sx={{
                gridColumn: "1 / -1",
                borderBottom: `1px solid ${theme.palette.divider}`,
                marginBottom: "0.5rem",
              }}
            />
            <Typography>Grid electricity cost</Typography>
            <Typography>Fuel cost</Typography>
            <Typography>Fixed cost</Typography>
            <Typography>Solar export revenue</Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
              ${Math.round((savingsData?.opexBefore?.gridVolumeCosts || 0) / 100) * 100}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
              ${Math.round((savingsData?.opexBefore?.otherEnergyCosts || 0) / 100) * 100}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
              ${Math.round((savingsData?.opexBefore?.fixedCosts || 0) / 100) * 100}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
              ${Math.round((savingsData?.opexBefore?.revenueFromSolarExport || 0) / 100) * 100}
            </Typography>
            <Typography />
            <Typography>
              <Typography>Gas: ${Math.round((savingsData?.opexBefore?.otherEnergyCostsByFuelType?.gas || 0) / 100) * 100}</Typography>
              <Typography>LPG: ${Math.round((savingsData?.opexBefore?.otherEnergyCostsByFuelType?.lpg || 0) / 100) * 100}</Typography>
              <Typography>Wood: ${Math.round((savingsData?.opexBefore?.otherEnergyCostsByFuelType?.wood || 0) / 100) * 100}</Typography>
              <Typography>Petrol: ${Math.round((savingsData?.opexBefore?.otherEnergyCostsByFuelType?.petrol || 0) / 100) * 100}</Typography>
              <Typography>Diesel: ${Math.round((savingsData?.opexBefore?.otherEnergyCostsByFuelType?.diesel || 0) / 100) * 100}</Typography>
            </Typography>
            <Typography>
              <Typography>Gas: ${Math.round((savingsData?.opexBefore?.fixedCostsByFuelType?.gas || 0) / 100) * 100}</Typography>
              <Typography>LPG: ${Math.round((savingsData?.opexBefore?.fixedCostsByFuelType?.lpg || 0) / 100) * 100}</Typography>
              <Typography>Electricity: ${Math.round((savingsData?.opexBefore?.fixedCostsByFuelType?.electricity || 0) / 100) * 100}</Typography>
            </Typography>
          </Box>
          <Box sx={{ ...gridSx, marginBottom: 0 }}>
            <Typography sx={{ fontWeight: "bold", gridColumn: "1 / -1" }}>
              After electrifying
            </Typography>
            <Box
              sx={{
                gridColumn: "1 / -1",
                borderBottom: `1px solid ${theme.palette.divider}`,
                marginBottom: "0.5rem",
              }}
            />
            <Typography>Grid electricity cost</Typography>
            <Typography>Fuel cost</Typography>
            <Typography>Fixed cost</Typography>
            <Typography>Solar export revenue</Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
              ${Math.round((savingsData?.opexAfter?.gridVolumeCosts || 0) / 100) * 100}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
              ${Math.round((savingsData?.opexAfter?.otherEnergyCosts || 0) / 100) * 100}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
              ${Math.round((savingsData?.opexAfter?.fixedCosts || 0) / 100) * 100}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
              ${Math.round((savingsData?.opexAfter?.revenueFromSolarExport || 0) / 100) * 100}
            </Typography>
            <Typography />
            <Typography>
              <Typography>Gas: ${Math.round((savingsData?.opexAfter?.otherEnergyCostsByFuelType?.gas || 0) / 100) * 100}</Typography>
              <Typography>LPG: ${Math.round((savingsData?.opexAfter?.otherEnergyCostsByFuelType?.lpg || 0) / 100) * 100}</Typography>
              <Typography>Wood: ${Math.round((savingsData?.opexAfter?.otherEnergyCostsByFuelType?.wood || 0) / 100) * 100}</Typography>
              <Typography>Petrol: ${Math.round((savingsData?.opexAfter?.otherEnergyCostsByFuelType?.petrol || 0) / 100) * 100}</Typography>
              <Typography>Diesel: ${Math.round((savingsData?.opexAfter?.otherEnergyCostsByFuelType?.diesel || 0) / 100) * 100}</Typography>
            </Typography>
            <Typography>
              <Typography>Gas: ${Math.round((savingsData?.opexAfter?.fixedCostsByFuelType?.gas || 0) / 100) * 100}</Typography>
              <Typography>LPG: ${Math.round((savingsData?.opexAfter?.fixedCostsByFuelType?.lpg || 0) / 100) * 100}</Typography>
              <Typography>Electricity: ${Math.round((savingsData?.opexAfter?.fixedCostsByFuelType?.electricity || 0) / 100) * 100}</Typography>
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default OpexBreakdown;
