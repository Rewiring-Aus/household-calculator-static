import { defaultFormState } from "src/assets/data/householdDefaults";
import {
  LocationEnum,
  SpaceHeatingEnum,
  WaterHeatingEnum,
  CooktopEnum,
  VehicleFuelTypeEnum,
} from "src/calculator/types";

import {
  HouseholdFormState,
  Option,
  OptionNumber,
  OptionYesNo,
  VehicleOptions,
} from "./interfaces";

// -------------------- Mappings --------------------

export const locationMapping: Record<LocationEnum, string> = {
  [LocationEnum.NewSouthWales]: "New South Wales",
  [LocationEnum.Victoria]: "Victoria",
  [LocationEnum.Queensland]: "Queensland",
  [LocationEnum.SouthAustralia]: "South Australia",
  [LocationEnum.WesternAustralia]: "Western Australia",
  [LocationEnum.NorthernTerritory]: "Northern Territory",
  [LocationEnum.AustralianCapitalTerritory]: "Australian Capital Territory",
  [LocationEnum.Tasmania]: "Tasmania",
};


export const spaceHeatingMapping: Record<SpaceHeatingEnum, string> = {
  [SpaceHeatingEnum.ElectricHeatPump]: "Reverse cycle a/c",
  [SpaceHeatingEnum.ElectricResistance]:
    "Electric resistive heaters (e.g. oil column, fan, wall)",
  [SpaceHeatingEnum.Wood]: "Wood fire",
  [SpaceHeatingEnum.Gas]: "Gas heater",
  [SpaceHeatingEnum.Lpg]: "Bottled LPG heater",
  [SpaceHeatingEnum.Diesel]: "Diesel boiler",
  [SpaceHeatingEnum.None]: "No heating",
};

export const waterHeatingMapping: Record<WaterHeatingEnum, string> = {
  [WaterHeatingEnum.ElectricHeatPump]: "Hot water heat pump",
  [WaterHeatingEnum.ElectricResistance]: "Electric resistive",
  [WaterHeatingEnum.Gas]: "Gas",
  [WaterHeatingEnum.Lpg]: "Bottled LPG",
  [WaterHeatingEnum.Solar]: "Solar hot water",
};

export const cooktopMapping: Record<CooktopEnum, string> = {
  [CooktopEnum.ElectricInduction]: "Electric induction",
  [CooktopEnum.ElectricResistance]: "Electric resistive/ceramic",
  [CooktopEnum.Gas]: "Gas",
  [CooktopEnum.Lpg]: "Bottled LPG",
};

export const vehicleMapping: Record<VehicleFuelTypeEnum, string> = {
  [VehicleFuelTypeEnum.Petrol]: "Petrol",
  [VehicleFuelTypeEnum.Diesel]: "Diesel",
  [VehicleFuelTypeEnum.PlugInHybrid]: "Plug-in Hybrid",
  [VehicleFuelTypeEnum.Hybrid]: "Hybrid",
  [VehicleFuelTypeEnum.Electric]: "Electric",
};

// -----------------------------------------------------

// -------------------- Statuses --------------------

export const electrificationStatusMapping: Record<string, string> = {
  alreadyElectric: "⚡️ Already electric",
  alreadyElectricButWillUpgrade:
    "🔧 Already electric, but upgrading to heat pumps for more efficiency savings",
  alreadyMostEfficient: "⚡️ Already the most efficient option!",
};

// -----------------------------------------------------

// -------------------- Options --------------------

const locationList: string[] = Object.values(LocationEnum).map(
  (location: LocationEnum) => locationMapping[location],
);

const locationSet: string[] = [...new Set(locationList)];

const locationEntries = Object.entries(locationMapping);
// export const locationOptions = Object.entries(locationMapping).map(([key, value]) => ({
export const locationOptions = locationSet.map((locationName) => ({
  value: locationEntries.find(
    ([key, value]) => value === locationName,
  )![0] as LocationEnum,
  text: locationName,
})) as Option<LocationEnum>[];

const getOccupancyString = (occupancy: number): string => {
  if (occupancy === 1) {
    return "1 person";
  }
  if (occupancy === 5) {
    return "5+ people";
  }
  return occupancy + " people";
};

export const occupancyOptions = Array.from(Array(5).keys()).map(
  (occupancy) => ({
    value: occupancy + 1,
    text: getOccupancyString(occupancy + 1),
  }),
) as OptionNumber[];

export const spaceHeatingOptions = Object.entries(spaceHeatingMapping).map(
  ([key, value]) => ({
    value: key as SpaceHeatingEnum,
    text: value,
  }),
) as Option<SpaceHeatingEnum>[];

export const waterHeatingOptions = Object.entries(waterHeatingMapping).map(
  ([key, value]) => ({
    value: key as WaterHeatingEnum,
    text: value,
  }),
) as Option<WaterHeatingEnum>[];

export const cooktopOptions = Object.entries(cooktopMapping).map(
  ([key, value]) => ({
    value: key as CooktopEnum,
    text: value,
  }),
) as Option<CooktopEnum>[];

export const vehicleOptions: VehicleOptions = {
  amount: Array.from(Array(6).keys()).map((amount) => ({
    value: amount,
    text: amount.toString(),
  })) as OptionNumber[],
  fuelTypeOptions: Object.entries(vehicleMapping).map(([key, value]) => ({
    value: key as VehicleFuelTypeEnum,
    text: value,
  })) as Option<VehicleFuelTypeEnum>[],
  usageOptions: [
    { type: "Low", value: 50, unit: "< 100 km/wk" },
    { type: "Medium", value: 255, unit: "100-300 km/wk" },
    { type: "High", value: 400, unit: "300+ km/wk" },
  ],
};

export const solarOptions = {
  hasSolar: [
    { value: false, text: "No" },
    { value: true, text: "Yes" },
  ] as OptionYesNo[],
  sizeList: Array.from(Array(20).keys()).map(
    (size) => ({ value: size, text: size.toString() + " kW" }),
    // { value: size, text: size.toString() })
  ) as OptionNumber[],
};

export const batteryOptions = {
  hasBattery: [
    { value: false, text: "No" },
    { value: true, text: "Yes" },
  ] as OptionYesNo[],
  capacityList: Array.from(Array(20).keys()).map(
    (size) => ({ value: size, text: size.toString() + " kWh" }),
    // { value: size, text: size.toString() })
  ) as OptionNumber[],
};

// -----------------------------------------------------

// -------------------- Tooltip Text --------------------
// Text that appears when hovering over the question mark icons
const tooltipText: Record<string, string> = {
  spaceHeating:
    "If you have multiple ways of heating your house, pick the one that you use the most.",
  waterHeating: "How your hot water tank is heated.",
  cooktop: "If you have multiple cooktops, pick the one that you use the most.",
  hasSolar:
    "If you have any solar panels in use (whether on roof or ground), select Yes. If you don’t have solar yet, select whether you would like to calculate your savings based on getting solar.",
  solarSize:
    "The total capacity of your solar panel system. 9 kW is the average in Australia and enough for 2 EVs, 7 kW is enough for 1 EV.",
  hasBattery:
    "If you have a home battery, select Yes. If you don’t have a battery yet, select whether you would like to calculate your savings based on getting one. We currently only include battery calculations if you include solar.",
  batteryCapacity:
    "The total size of your home battery system. Aim to cover at least 1/3, ideally 2/3, of your energy usage taking into account when you mostly use energy. An average Australian household uses 16kWh of energy a day with 70% at night (so a 11kWh battery would cover most but not all needs).",
  vehicleNumber:
    "Select the number of vehicles that you use reasonably regularly.",
};

export default tooltipText;
// -----------------------------------------------------

// ---------------------------------------------------

// -------------------- Form Text --------------------

export type LocationOptionType = typeof locationOptions;
export type OccupancyOptionType = typeof occupancyOptions;
export type SpaceHeatingOptionType = typeof spaceHeatingOptions;
export type WaterHeatingOptionType = typeof waterHeatingOptions;
export type CooktopOptionType = typeof cooktopOptions;
export type SolarOptionType = typeof solarOptions;
export type BatteryOptionType = typeof batteryOptions;
export type VehicleOptionType = typeof vehicleOptions;
export type TooltipTextType = typeof tooltipText;

export interface FormText {
  options: {
    location: LocationOptionType;
    occupancy: OccupancyOptionType;
    spaceHeating: SpaceHeatingOptionType;
    waterHeating: WaterHeatingOptionType;
    cooktop: CooktopOptionType;
    vehicle: VehicleOptionType;
    solar: SolarOptionType;
    battery: BatteryOptionType;
  };
  defaultFormState: HouseholdFormState;
  tooltipText: TooltipTextType;
}

export const formText: FormText = {
  options: {
    location: locationOptions,
    occupancy: occupancyOptions,
    spaceHeating: spaceHeatingOptions,
    waterHeating: waterHeatingOptions,
    cooktop: cooktopOptions,
    vehicle: vehicleOptions,
    solar: solarOptions,
    battery: batteryOptions,
  },
  defaultFormState: defaultFormState,
  tooltipText: tooltipText,
};

// -----------------------------------------------------

// -----------------------------------------------------
