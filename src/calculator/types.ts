// ---- Enums ----

export const LocationEnum = {
  Victoria: 'VICTORIA',
  NewSouthWales: 'NEW_SOUTH_WALES',
  NorthernTerritory: 'NORTHERN_TERRITORY',
  AustralianCapitalTerritory: 'AUSTRALIAN_CAPITAL_TERRITORY',
  Tasmania: 'TASMANIA',
  WesternAustralia: 'WESTERN_AUSTRALIA',
  SouthAustralia: 'SOUTH_AUSTRALIA',
  Queensland: 'QUEENSLAND',
} as const;
export type LocationEnum = (typeof LocationEnum)[keyof typeof LocationEnum];

export const SpaceHeatingEnum = {
  Wood: 'WOOD',
  Gas: 'GAS',
  Lpg: 'LPG',
  Diesel: 'DIESEL',
  ElectricResistance: 'ELECTRIC_RESISTANCE',
  ElectricHeatPump: 'ELECTRIC_HEAT_PUMP',
  None: 'NONE',
} as const;
export type SpaceHeatingEnum = (typeof SpaceHeatingEnum)[keyof typeof SpaceHeatingEnum];

export const WaterHeatingEnum = {
  Gas: 'GAS',
  Lpg: 'LPG',
  ElectricResistance: 'ELECTRIC_RESISTANCE',
  ElectricHeatPump: 'ELECTRIC_HEAT_PUMP',
  Solar: 'SOLAR',
} as const;
export type WaterHeatingEnum = (typeof WaterHeatingEnum)[keyof typeof WaterHeatingEnum];

export const CooktopEnum = {
  Gas: 'GAS',
  Lpg: 'LPG',
  ElectricResistance: 'ELECTRIC_RESISTANCE',
  ElectricInduction: 'ELECTRIC_INDUCTION',
} as const;
export type CooktopEnum = (typeof CooktopEnum)[keyof typeof CooktopEnum];

export const VehicleFuelTypeEnum = {
  Petrol: 'PETROL',
  Diesel: 'DIESEL',
  Hybrid: 'HYBRID',
  PlugInHybrid: 'PLUG_IN_HYBRID',
  Electric: 'ELECTRIC',
} as const;
export type VehicleFuelTypeEnum = (typeof VehicleFuelTypeEnum)[keyof typeof VehicleFuelTypeEnum];

export const VehicleClassEnum = {
  Hatchback: 'HATCHBACK',
  Sedan: 'SEDAN',
  Suv: 'SUV',
} as const;
export type VehicleClassEnum = (typeof VehicleClassEnum)[keyof typeof VehicleClassEnum];

export const DwellingEnum = {
  House: 'HOUSE',
  Apartment: 'APARTMENT',
} as const;
export type DwellingEnum = (typeof DwellingEnum)[keyof typeof DwellingEnum];

export const FuelTypeEnum = {
  Electricity: 'electricity',
  NaturalGas: 'natural_gas',
  Lpg: 'lpg',
  Wood: 'wood',
  Petrol: 'petrol',
  Diesel: 'diesel',
  Solar: 'solar',
  None: 'none',
} as const;
export type FuelTypeEnum = (typeof FuelTypeEnum)[keyof typeof FuelTypeEnum];

export const PeriodEnum = {
  Daily: 'DAILY',
  Weekly: 'WEEKLY',
  Yearly: 'YEARLY',
  OperationalLifetime: 'OPERATIONAL_LIFETIME',
} as const;
export type PeriodEnum = (typeof PeriodEnum)[keyof typeof PeriodEnum];

export const RecommendationActionEnum = {
  SpaceHeating: 'SPACE_HEATING',
  WaterHeating: 'WATER_HEATING',
  Cooking: 'COOKING',
  Vehicle: 'VEHICLE',
  Solar: 'SOLAR',
  Battery: 'BATTERY',
  FullyElectrified: 'FULLY_ELECTRIFIED',
} as const;
export type RecommendationActionEnum = (typeof RecommendationActionEnum)[keyof typeof RecommendationActionEnum];

// ---- Interfaces ----

export interface Vehicle {
  fuelType: VehicleFuelTypeEnum;
  /** Defaults to SUV when missing (e.g. links saved before classes existed). */
  vehicleClass?: VehicleClassEnum;
  kmsPerWeek?: number;
  switchToEV?: boolean;
}

export interface Solar {
  hasSolar: boolean;
  size?: number;
  installSolar?: boolean;
}

export interface Battery {
  hasBattery: boolean;
  capacity?: number;
  installBattery?: boolean;
}

export interface Household {
  location?: LocationEnum;
  occupancy?: number;
  /** Defaults to a house when missing. */
  dwelling?: DwellingEnum;
  spaceHeating?: SpaceHeatingEnum;
  waterHeating?: WaterHeatingEnum;
  cooktop?: CooktopEnum;
  vehicles?: Vehicle[];
  solar?: Solar;
  battery?: Battery;
}

export interface EmissionsValues {
  before: number;
  after: number;
  difference: number;
}

export interface Emissions {
  perWeek: EmissionsValues;
  perYear: EmissionsValues;
  overLifetime: EmissionsValues;
  operationalLifetime: number;
}

export interface OpexValues {
  before: number;
  after: number;
  difference: number;
}

export interface Opex {
  perWeek: OpexValues;
  perYear: OpexValues;
  overLifetime: OpexValues;
  operationalLifetime: number;
}

export interface UpfrontCost {
  solar?: number;
  battery?: number;
  cooktop?: number;
  waterHeating?: number;
  spaceHeating?: number;
}

export interface Recommendation {
  action: RecommendationActionEnum;
  url?: string;
}

export interface OpexWeeklyFixedCostsByFuelType {
  electricity?: number;
  gas?: number;
  lpg?: number;
}

export interface OpexWeeklyOtherEnergyCostsByFuelType {
  gas?: number;
  lpg?: number;
  wood?: number;
  petrol?: number;
  diesel?: number;
}

export interface OpexWeekly {
  gridVolumeCosts?: number;
  otherEnergyCosts?: number;
  otherEnergyCostsByFuelType?: OpexWeeklyOtherEnergyCostsByFuelType;
  fixedCosts?: number;
  fixedCostsByFuelType?: OpexWeeklyFixedCostsByFuelType;
  revenueFromSolarExport?: number;
  /** Servicing, tyres and consumables for the household's vehicles. */
  vehicleMaintenanceCosts?: number;
}

/**
 * Running-cost saving that comes from moving the electrified home from a flat
 * tariff onto time-of-use, which it can only make use of once it has solar, a
 * battery and no gas appliances left. Already included in `opex`; reported
 * separately so the UI can call it out. Positive = saving.
 */
export interface TariffSwitch {
  tariff: 'TIME_OF_USE';
  perWeek: number;
  perYear: number;
  overLifetime: number;
}

export interface Savings {
  emissions?: Emissions;
  opex?: Opex;
  tariffSwitch?: TariffSwitch;
  upfrontCost?: UpfrontCost;
  recommendation?: Recommendation;
  opexBefore?: OpexWeekly;
  opexAfter?: OpexWeekly;
}

// ---- Machine info types ----

export interface MachineLocationInfo {
  kwh_per_day: number;
}

export interface MachineInfo {
  fuel_type: FuelTypeEnum;
  per_location: Record<LocationEnum, MachineLocationInfo>;
}

export type MachineInfoMap = Record<string, MachineInfo | MachineInfo[]>;

export type FuelDict = Partial<Record<FuelTypeEnum, number>>;

export interface MachineEnergyNeeds {
  appliances: FuelDict;
  vehicles: FuelDict;
  other_appliances: FuelDict;
}

export interface ElectricityConsumption {
  consumed_from_solar: number;
  consumed_from_battery: number;
  consumed_from_grid: number;
  exported_to_grid: number;
}

export const MACHINE_CATEGORIES = ['appliances', 'vehicles', 'other_appliances'] as const;
export type MachineCategory = (typeof MACHINE_CATEGORIES)[number];
