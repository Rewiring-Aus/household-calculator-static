import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import HouseholdForm from "../../components/HouseholdForm/HouseholdForm";
import HouseholdSavings from "../../components/HouseholdSavings/HouseholdSavings";
import { Box, Link, Typography, useMediaQuery } from "@mui/material";
import useHouseholdData from "src/hooks/useHouseholdData/useHouseholdData";
import { LocationEnum } from "src/calculator/types";
import {
  cooktopMapping,
  spaceHeatingMapping,
  waterHeatingMapping,
} from "src/components/HouseholdForm/data/householdForm.text";
import MobileSavingsDrawer from "src/components/MobileSavingsDrawer/MobileSavingsDrawer";
import { useDrawer } from "src/components/MobileSavingsDrawer/DrawerContext";
import { decodeHousehold, encodeHousehold } from "src/utils/householdUrlEncoding";
import "./Home.css";

const stateParamToLocation: Record<string, LocationEnum> = {
  nsw: LocationEnum.NewSouthWales,
  vic: LocationEnum.Victoria,
  qld: LocationEnum.Queensland,
  sa: LocationEnum.SouthAustralia,
  wa: LocationEnum.WesternAustralia,
  nt: LocationEnum.NorthernTerritory,
  act: LocationEnum.AustralianCapitalTerritory,
  tas: LocationEnum.Tasmania,
};

const Home: React.FC = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchParams, setSearchParams] = useSearchParams();

  const initialLocation = useMemo(() => {
    // Check hash-based search params first (/#/?state=sa),
    // then fall back to regular query string (?state=sa) for
    // compatibility with links that put params before the hash.
    const stateParam =
      searchParams.get("state")?.toLowerCase() ||
      new URLSearchParams(window.location.search).get("state")?.toLowerCase();
    return stateParam ? stateParamToLocation[stateParam] : undefined;
  }, [searchParams]);

  const initialHousehold = useMemo(() => {
    const hParam =
      searchParams.get("h") ||
      new URLSearchParams(window.location.search).get("h");
    if (hParam) return decodeHousehold(hParam) ?? undefined;
    return undefined;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { householdData, updateHouseholdData, savingsData, loadingData } =
    useHouseholdData(initialLocation, initialHousehold);

  // Keep URL in sync with current household selections
  useEffect(() => {
    if (householdData) {
      setSearchParams({ h: encodeHousehold(householdData) });
    }
  }, [householdData, setSearchParams]);

  const numEVsToBuy =
    householdData?.vehicles?.filter((vehicle) => vehicle.switchToEV).length ||
    0;

  const appliances = {
    currentSpaceHeater: householdData?.spaceHeating
      ? spaceHeatingMapping[householdData?.spaceHeating]
      : "",
    currentWaterHeater: householdData?.waterHeating
      ? waterHeatingMapping[householdData?.waterHeating]
      : "",
    currentCooktop: householdData?.cooktop
      ? cooktopMapping[householdData?.cooktop]
      : "",
  };

  // -----------------------------------------------------------
  // Savings Reactive Sticky
  const savingsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [savingsStyle, setSavingsStyle] = useState({
    position: "sticky",
    top: "3.5rem",
  });

  useEffect(() => {
    const handleScroll = () => {
      const savingsElement = savingsRef.current;
      const formElement = formRef.current;

      if (savingsElement && formElement) {
        const savingsRect = savingsElement.getBoundingClientRect();
        const formRect = formElement.getBoundingClientRect();

        if (savingsRect.bottom > formRect.bottom) {
          setSavingsStyle({
            position: "absolute",
            top: `${formRect.bottom - savingsRect.height}px`,
          });
        } else {
          setSavingsStyle({ position: "sticky", top: "1rem" });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // -----------------------------------------------------------
  // Drawer
  const { drawerOpen, toggleDrawer, scrollPosition, setScrollPosition } =
    useDrawer();

  useEffect(() => {
    window.scrollTo(0, scrollPosition);
  }, [scrollPosition]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [setScrollPosition]);

  // -----------------------------------------------------------
  return (
    <Box
      className="Home"
      sx={{
        maxWidth: "90rem", // '1440px',
        margin: "auto",
      }}
    >
      <Box
        className="Home-content"
        sx={{
          display: "flex",
          flexDirection: "column",
          [theme.breakpoints.up("md")]: {
            flexDirection: "row",
          },
        }}
      >
        {/* ----------------------------------------------------------- */}
        {/* Home Form */}
        <Box
          className="Home-form"
          sx={{
            flex: 1,
            padding: "1rem",
            backgroundColor: theme.palette.background.default,
            [theme.breakpoints.up("md")]: {
              padding: "2rem 1.6rem 1.5rem 2rem",
            },
            [theme.breakpoints.up("lg")]: {
              padding: "2rem 2rem 2rem 3rem",
              width: "60vw",
            },
          }}
        >
          <Typography
            variant="h1"
          >
            How much could you save by going electric?
          </Typography>
          <Typography variant="subtitle1">
            Upgrading your fossil fuel appliances & vehicles can cut costs and
            emissions.
            <br />
            Enter your details to see your potential savings.
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: "0.5rem",
              lineHeight: "0.5rem",
              fontStyle: "italic"
            }}
          >
            The legal bit - Rewiring Australia disclaims and excludes all liability for any claim, loss, demand or damages of any kind whatsoever (including for negligence) arising out of or in connection with the use of either this website or the tools, information, content or materials included on this site or on any website we link to.
          </Typography>

          {householdData && (
            <HouseholdForm
              householdData={householdData}
              updateHouseholdData={updateHouseholdData}
              savingsData={savingsData}
            />
          )}

          {/* ----------------------------------------------------------- */}
          {/* Home Footer */}
          <Box
            className="Home-footer"
            sx={{
              padding: "1rem 1rem 5rem 1rem",
              position: "relative",
              display: "flex",
              backgroundColor: theme.palette.background.default,
              textAlign: "center",
              [theme.breakpoints.up("md")]: {
                // padding: '1rem 2rem 1.5rem 2rem',
                padding: "0",
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                lineHeight: "1.625rem",
                paddingTop: "1rem"
              }}
            >
              © Copyright{" "}
              <Link
                href="https://www.rewiringaustralia.org/"
                aria-label="Go to Rewiring Australia home page"
              >
                Rewiring Australia
              </Link>{" "}
              2025
            </Typography>
          </Box>
          {/* ------------------------------------------------------------------ */}
        </Box>
        {/* ----------------------------------------------------------- */}

        {/* -------------------------------------------------- */}
        {/* Home Savings Desktop */}

        {!isMobile && !isTablet && (
          <Box
            className="Home-savings"
            sx={{
              backgroundColor: theme.palette.background.default,
              padding: "0",
              [theme.breakpoints.up("sm")]: {
                padding: "1rem",
              },
              [theme.breakpoints.up("md")]: {
                padding: "2rem 2rem 1rem 1rem",
                "@media (min-aspect-ratio: 1/1)": {
                  width: "min(480px, 33%)",
                },
                "@media (max-aspect-ratio: 1/1)": {
                  width: "min(480px, 38%)",
                },
              },
            }}
            ref={savingsRef}
            style={{
              ...savingsStyle,
              position: savingsStyle.position as "sticky" | "absolute",
            }}
          >
            {/* HouseholdSavings Desktop */}
            <HouseholdSavings
              appliances={appliances}
              results={savingsData}
              numEVsToBuy={numEVsToBuy}
              loadingData={loadingData}
              household={householdData ?? {}}
            />
          </Box>
        )}
        {/* -------------------------------------------------- */}

        {/* Home Savings Mobile */}
        {(isMobile || isTablet) && (
          <MobileSavingsDrawer
            appliances={appliances}
            results={savingsData}
            loadingData={loadingData}
            numEVsToBuy={numEVsToBuy}
            drawerOpen={drawerOpen}
            toggleDrawer={toggleDrawer}
            household={householdData ?? {}}
          />
        )}
        {/* ----------------------------------------------------------- */}
      </Box>
      {/* ----------------------------------------------------------- */}
    </Box>
  );
};

export default Home;
