// GENERATED FILE — do not edit by hand.
// Built by scripts/build-model-data.mjs from the Energy Savings 2026 model's
// input CSVs (energy-savings-2026-model/data). Re-run the script to update.

export const STATES = [
  "NSW",
  "VIC",
  "QLD",
  "SA",
  "WA",
  "TAS",
  "NT",
  "ACT"
] as const;
export type StateCode = (typeof STATES)[number];

export interface FuelPrice {
  current: number;
  forecast15: number;
  dailyCurrent: number | null;
  dailyForecast15: number | null;
}

/** Retail $/kWh and $/day supply charges (current 2026 and 15-year average forecast). The NT has no gas row. */
export const FUEL_PRICES: Record<StateCode, Partial<Record<string, FuelPrice>>> = {
  "NSW": {
    "electricity": {
      "current": 0.3788,
      "forecast15": 0.4431,
      "dailyCurrent": 1.3905,
      "dailyForecast15": 1.6265
    },
    "electricity_off_peak": {
      "current": 0.2841,
      "forecast15": 0.3323,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "solar_export": {
      "current": 0.05,
      "forecast15": 0.05,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "gas": {
      "current": 0.1686,
      "forecast15": 0.2106,
      "dailyCurrent": 0.7016,
      "dailyForecast15": 0.8763
    },
    "lpg": {
      "current": 0.2743,
      "forecast15": 0.3426,
      "dailyCurrent": 0.2841,
      "dailyForecast15": 0.3549
    },
    "petrol": {
      "current": 0.1941,
      "forecast15": 0.219,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "diesel": {
      "current": 0.1915,
      "forecast15": 0.2161,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "ev_fast_charge": {
      "current": 0.65,
      "forecast15": 0.7603,
      "dailyCurrent": null,
      "dailyForecast15": null
    }
  },
  "VIC": {
    "electricity": {
      "current": 0.2884,
      "forecast15": 0.3373,
      "dailyCurrent": 1.178,
      "dailyForecast15": 1.3779
    },
    "electricity_off_peak": {
      "current": 0.2327,
      "forecast15": 0.2722,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "solar_export": {
      "current": 0.02,
      "forecast15": 0.02,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "gas": {
      "current": 0.142,
      "forecast15": 0.1774,
      "dailyCurrent": 0.8512,
      "dailyForecast15": 1.0632
    },
    "lpg": {
      "current": 0.2271,
      "forecast15": 0.2837,
      "dailyCurrent": 0.3082,
      "dailyForecast15": 0.385
    },
    "petrol": {
      "current": 0.1957,
      "forecast15": 0.2208,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "diesel": {
      "current": 0.1932,
      "forecast15": 0.218,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "ev_fast_charge": {
      "current": 0.65,
      "forecast15": 0.7603,
      "dailyCurrent": null,
      "dailyForecast15": null
    }
  },
  "QLD": {
    "electricity": {
      "current": 0.3333,
      "forecast15": 0.3899,
      "dailyCurrent": 1.5959,
      "dailyForecast15": 1.8667
    },
    "electricity_off_peak": {
      "current": 0.2577,
      "forecast15": 0.3014,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "solar_export": {
      "current": 0.03,
      "forecast15": 0.03,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "gas": {
      "current": 0.2105,
      "forecast15": 0.2629,
      "dailyCurrent": 0.7689,
      "dailyForecast15": 0.9604
    },
    "lpg": {
      "current": 0.2425,
      "forecast15": 0.3029,
      "dailyCurrent": 0.2975,
      "dailyForecast15": 0.3716
    },
    "petrol": {
      "current": 0.1979,
      "forecast15": 0.2233,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "diesel": {
      "current": 0.1932,
      "forecast15": 0.218,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "ev_fast_charge": {
      "current": 0.65,
      "forecast15": 0.7603,
      "dailyCurrent": null,
      "dailyForecast15": null
    }
  },
  "SA": {
    "electricity": {
      "current": 0.4376,
      "forecast15": 0.5119,
      "dailyCurrent": 1.2228,
      "dailyForecast15": 1.4303
    },
    "electricity_off_peak": {
      "current": 0.3252,
      "forecast15": 0.3804,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "solar_export": {
      "current": 0.03,
      "forecast15": 0.03,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "gas": {
      "current": 0.2296,
      "forecast15": 0.2868,
      "dailyCurrent": 0.8617,
      "dailyForecast15": 1.0763
    },
    "lpg": {
      "current": 0.2515,
      "forecast15": 0.3141,
      "dailyCurrent": 0.3044,
      "dailyForecast15": 0.3802
    },
    "petrol": {
      "current": 0.1888,
      "forecast15": 0.213,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "diesel": {
      "current": 0.1923,
      "forecast15": 0.217,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "ev_fast_charge": {
      "current": 0.65,
      "forecast15": 0.7603,
      "dailyCurrent": null,
      "dailyForecast15": null
    }
  },
  "WA": {
    "electricity": {
      "current": 0.3237,
      "forecast15": 0.3786,
      "dailyCurrent": 1.1605,
      "dailyForecast15": 1.3574
    },
    "electricity_off_peak": {
      "current": 0.2369,
      "forecast15": 0.2771,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "solar_export": {
      "current": 0.02,
      "forecast15": 0.02,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "gas": {
      "current": 0.112,
      "forecast15": 0.1399,
      "dailyCurrent": 0.2561,
      "dailyForecast15": 0.3199
    },
    "lpg": {
      "current": 0.284,
      "forecast15": 0.3547,
      "dailyCurrent": 0.2685,
      "dailyForecast15": 0.3354
    },
    "petrol": {
      "current": 0.1902,
      "forecast15": 0.2146,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "diesel": {
      "current": 0.1895,
      "forecast15": 0.2138,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "ev_fast_charge": {
      "current": 0.65,
      "forecast15": 0.7603,
      "dailyCurrent": null,
      "dailyForecast15": null
    }
  },
  "TAS": {
    "electricity": {
      "current": 0.2789,
      "forecast15": 0.3262,
      "dailyCurrent": 1.3486,
      "dailyForecast15": 1.5775
    },
    "electricity_off_peak": {
      "current": 0.1669,
      "forecast15": 0.1952,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "solar_export": {
      "current": 0.0878,
      "forecast15": 0.0878,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "gas": {
      "current": 0.197,
      "forecast15": 0.2461,
      "dailyCurrent": 0.817,
      "dailyForecast15": 1.0205
    },
    "lpg": {
      "current": 0.2433,
      "forecast15": 0.3039,
      "dailyCurrent": 0.3592,
      "dailyForecast15": 0.4487
    },
    "petrol": {
      "current": 0.1941,
      "forecast15": 0.219,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "diesel": {
      "current": 0.1933,
      "forecast15": 0.2181,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "ev_fast_charge": {
      "current": 0.65,
      "forecast15": 0.7603,
      "dailyCurrent": null,
      "dailyForecast15": null
    }
  },
  "NT": {
    "electricity": {
      "current": 0.3008,
      "forecast15": 0.3518,
      "dailyCurrent": 0.5931,
      "dailyForecast15": 0.6937
    },
    "electricity_off_peak": {
      "current": 0.2453,
      "forecast15": 0.2869,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "solar_export": {
      "current": 0.0933,
      "forecast15": 0.0933,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "lpg": {
      "current": 0.3198,
      "forecast15": 0.3994,
      "dailyCurrent": 0.2923,
      "dailyForecast15": 0.3651
    },
    "petrol": {
      "current": 0.2153,
      "forecast15": 0.2429,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "diesel": {
      "current": 0.2119,
      "forecast15": 0.2391,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "ev_fast_charge": {
      "current": 0.65,
      "forecast15": 0.7603,
      "dailyCurrent": null,
      "dailyForecast15": null
    }
  },
  "ACT": {
    "electricity": {
      "current": 0.3127,
      "forecast15": 0.3658,
      "dailyCurrent": 1.2741,
      "dailyForecast15": 1.4903
    },
    "electricity_off_peak": {
      "current": 0.2841,
      "forecast15": 0.3323,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "solar_export": {
      "current": 0.04,
      "forecast15": 0.04,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "gas": {
      "current": 0.1558,
      "forecast15": 0.1946,
      "dailyCurrent": 0.6961,
      "dailyForecast15": 0.8695
    },
    "lpg": {
      "current": 0.2588,
      "forecast15": 0.3233,
      "dailyCurrent": 0.2841,
      "dailyForecast15": 0.3549
    },
    "petrol": {
      "current": 0.1941,
      "forecast15": 0.219,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "diesel": {
      "current": 0.1915,
      "forecast15": 0.2161,
      "dailyCurrent": null,
      "dailyForecast15": null
    },
    "ev_fast_charge": {
      "current": 0.65,
      "forecast15": 0.7603,
      "dailyCurrent": null,
      "dailyForecast15": null
    }
  }
};

/** kgCO2e/kWh. Gas is null where the source has no factor (NT, TAS). */
export const EMISSIONS_FACTORS: Record<StateCode, { electricity: number; gas: number | null; lpg: number; petrol: number; diesel: number }> = {
  "ACT": {
    "electricity": 0.67,
    "gas": 0.232668,
    "lpg": 0.2909,
    "petrol": 0.305352,
    "diesel": 0.315756
  },
  "NSW": {
    "electricity": 0.67,
    "gas": 0.232668,
    "lpg": 0.2909,
    "petrol": 0.305352,
    "diesel": 0.315756
  },
  "NT": {
    "electricity": 0.65,
    "gas": null,
    "lpg": 0.2909,
    "petrol": 0.305352,
    "diesel": 0.315756
  },
  "QLD": {
    "electricity": 0.76,
    "gas": 0.217188,
    "lpg": 0.2909,
    "petrol": 0.305352,
    "diesel": 0.315756
  },
  "SA": {
    "electricity": 0.26,
    "gas": 0.224028,
    "lpg": 0.2909,
    "petrol": 0.305352,
    "diesel": 0.315756
  },
  "TAS": {
    "electricity": 0.23,
    "gas": null,
    "lpg": 0.2909,
    "petrol": 0.305352,
    "diesel": 0.315756
  },
  "VIC": {
    "electricity": 0.87,
    "gas": 0.199908,
    "lpg": 0.2909,
    "petrol": 0.305352,
    "diesel": 0.315756
  },
  "WA": {
    "electricity": 0.56,
    "gas": 0.200268,
    "lpg": 0.2909,
    "petrol": 0.305352,
    "diesel": 0.315756
  }
};

export const AUS_GAS_EMISSIONS_FACTOR = 0.218628;

/** Average household energy use, kWh/day, by category → appliance type → state (2.7 occupants, detached house). */
export const ENERGY_USE: Record<string, Record<string, Record<StateCode, number>>> = {
  "Space Heating": {
    "Electric heat pump": {
      "NSW": 2.273,
      "VIC": 6.007,
      "QLD": 1.253,
      "SA": 2.745,
      "WA": 1.969,
      "TAS": 7.362,
      "NT": 0.263,
      "ACT": 8.531
    },
    "Electric resistance": {
      "NSW": 9.09,
      "VIC": 23.34,
      "QLD": 5.16,
      "SA": 10.98,
      "WA": 7.87,
      "TAS": 26.92,
      "NT": 1.11,
      "ACT": 31.2
    },
    "Natural gas": {
      "NSW": 11.36,
      "VIC": 29.18,
      "QLD": 6.44,
      "SA": 13.72,
      "WA": 9.84,
      "TAS": 33.65,
      "NT": 1.39,
      "ACT": 39
    },
    "LPG": {
      "NSW": 11.36,
      "VIC": 29.18,
      "QLD": 6.44,
      "SA": 13.72,
      "WA": 9.84,
      "TAS": 33.65,
      "NT": 1.39,
      "ACT": 39
    },
    "Wood": {
      "NSW": 13.99,
      "VIC": 35.91,
      "QLD": 7.93,
      "SA": 16.89,
      "WA": 12.12,
      "TAS": 41.42,
      "NT": 1.71,
      "ACT": 48
    }
  },
  "Space Cooling": {
    "Heat pump": {
      "NSW": 0.77,
      "VIC": 0.1,
      "QLD": 1.89,
      "SA": 0.63,
      "WA": 1.65,
      "TAS": 0.09,
      "NT": 7.58,
      "ACT": 0.74
    }
  },
  "Water Heating": {
    "Electric heat pump": {
      "NSW": 1.76,
      "VIC": 2.05,
      "QLD": 1.64,
      "SA": 1.81,
      "WA": 1.84,
      "TAS": 1.9,
      "NT": 1.27,
      "ACT": 2
    },
    "Electric resistance": {
      "NSW": 6.54,
      "VIC": 7.41,
      "QLD": 6.28,
      "SA": 6.75,
      "WA": 6.84,
      "TAS": 6.46,
      "NT": 4.99,
      "ACT": 6.8
    },
    "Natural gas": {
      "NSW": 7.69,
      "VIC": 8.7,
      "QLD": 7.38,
      "SA": 7.93,
      "WA": 8.04,
      "TAS": 7.59,
      "NT": 5.86,
      "ACT": 7.99
    },
    "LPG": {
      "NSW": 7.69,
      "VIC": 8.7,
      "QLD": 7.38,
      "SA": 7.93,
      "WA": 8.04,
      "TAS": 7.59,
      "NT": 5.86,
      "ACT": 7.99
    }
  },
  "Cooktop": {
    "Electric resistance": {
      "NSW": 0.95,
      "VIC": 0.92,
      "QLD": 0.93,
      "SA": 1,
      "WA": 0.97,
      "TAS": 1,
      "NT": 0.99,
      "ACT": 0.88
    },
    "Electric induction": {
      "NSW": 0.86,
      "VIC": 0.83,
      "QLD": 0.84,
      "SA": 0.91,
      "WA": 0.87,
      "TAS": 0.91,
      "NT": 0.9,
      "ACT": 0.8
    },
    "Natural gas": {
      "NSW": 2.21,
      "VIC": 2.14,
      "QLD": 2.17,
      "SA": 2.35,
      "WA": 2.26,
      "TAS": 2.34,
      "NT": 2.32,
      "ACT": 2.07
    },
    "LPG": {
      "NSW": 2.21,
      "VIC": 2.14,
      "QLD": 2.17,
      "SA": 2.35,
      "WA": 2.26,
      "TAS": 2.34,
      "NT": 2.32,
      "ACT": 2.07
    }
  },
  "Other Cooking": {
    "Refrigeration": {
      "NSW": 2.07,
      "VIC": 2.01,
      "QLD": 2.03,
      "SA": 2.21,
      "WA": 2.1,
      "TAS": 2.22,
      "NT": 2.17,
      "ACT": 1.93
    },
    "Dishwashers": {
      "NSW": 0.3,
      "VIC": 0.29,
      "QLD": 0.3,
      "SA": 0.32,
      "WA": 0.31,
      "TAS": 0.32,
      "NT": 0.31,
      "ACT": 0.28
    },
    "Microwave": {
      "NSW": 0.3,
      "VIC": 0.3,
      "QLD": 0.3,
      "SA": 0.32,
      "WA": 0.31,
      "TAS": 0.32,
      "NT": 0.32,
      "ACT": 0.29
    },
    "Ovens": {
      "NSW": 0.34,
      "VIC": 0.34,
      "QLD": 0.34,
      "SA": 0.36,
      "WA": 0.35,
      "TAS": 0.37,
      "NT": 0.36,
      "ACT": 0.33
    },
    "Uprights": {
      "NSW": 0.39,
      "VIC": 0.38,
      "QLD": 0.38,
      "SA": 0.41,
      "WA": 0.4,
      "TAS": 0.42,
      "NT": 0.41,
      "ACT": 0.37
    }
  },
  "Other Electronics": {
    "Washers and dryers": {
      "NSW": 0.44,
      "VIC": 0.44,
      "QLD": 0.44,
      "SA": 0.46,
      "WA": 0.45,
      "TAS": 0.47,
      "NT": 0.46,
      "ACT": 0.42
    },
    "Lighting": {
      "NSW": 0.91,
      "VIC": 0.9,
      "QLD": 0.9,
      "SA": 0.96,
      "WA": 0.93,
      "TAS": 0.96,
      "NT": 0.95,
      "ACT": 0.87
    },
    "Other appliances": {
      "NSW": 3.97,
      "VIC": 3.87,
      "QLD": 3.75,
      "SA": 3.79,
      "WA": 3.76,
      "TAS": 3.78,
      "NT": 4.11,
      "ACT": 3.89
    }
  },
  "Pool Equipment": {
    "Electric": {
      "NSW": 0.74,
      "VIC": 0.35,
      "QLD": 1,
      "SA": 0.49,
      "WA": 0.87,
      "TAS": 0.25,
      "NT": 1.75,
      "ACT": 0.24
    },
    "Natural gas": {
      "NSW": 0.27,
      "VIC": 0.13,
      "QLD": 0.37,
      "SA": 0.18,
      "WA": 0.33,
      "TAS": 0.09,
      "NT": 0.65,
      "ACT": 0.09
    }
  },
  "Vehicles": {
    "Petrol": {
      "NSW": 36.7,
      "VIC": 35.9,
      "QLD": 37.2,
      "SA": 33.2,
      "WA": 35.8,
      "TAS": 33.6,
      "NT": 38.6,
      "ACT": 33.5
    },
    "Diesel": {
      "NSW": 29,
      "VIC": 28,
      "QLD": 29,
      "SA": 26,
      "WA": 28,
      "TAS": 26,
      "NT": 30,
      "ACT": 26
    },
    "Electric": {
      "NSW": 9.4,
      "VIC": 9.2,
      "QLD": 9.6,
      "SA": 8.5,
      "WA": 9.2,
      "TAS": 8.6,
      "NT": 9.9,
      "ACT": 8.6
    }
  }
};

/** [occupants, scaling factor] — linearly interpolated, 5 = 5+. */
export const OCCUPANCY_SCALING: [number, number][] = [
  [
    1,
    0.56
  ],
  [
    2,
    0.9
  ],
  [
    2.7,
    1
  ],
  [
    3,
    1.03
  ],
  [
    4,
    1.07
  ],
  [
    5,
    1.37
  ]
];

export const VEHICLE_EFFICIENCY: Record<'hatchback' | 'sedan' | 'suv', { evWhPerKm: number; iceWhPerKm: number }> = {
  "hatchback": {
    "evWhPerKm": 161.8,
    "iceWhPerKm": 831.6
  },
  "sedan": {
    "evWhPerKm": 173.9,
    "iceWhPerKm": 1036.8
  },
  "suv": {
    "evWhPerKm": 190.8,
    "iceWhPerKm": 1019.2
  }
};

/** Annual servicing, tyres and consumables per vehicle ($/yr). */
export const VEHICLE_MAINTENANCE: Record<'hatchback' | 'sedan' | 'suv', { ev: number; ice: number }> = {
  "hatchback": {
    "ev": 510,
    "ice": 750
  },
  "suv": {
    "ev": 800,
    "ice": 790
  },
  "sedan": {
    "ev": 640,
    "ice": 790
  }
};

/** Middle-tier km per vehicle per day. */
export const KM_PER_DAY: Record<StateCode, number> = {
  "NSW": 36.2,
  "ACT": 35.1,
  "NT": 35.9,
  "QLD": 36.9,
  "SA": 35,
  "TAS": 33.1,
  "VIC": 38,
  "WA": 33.8
};

export const SOLAR_BY_STATE: Record<StateCode, { capacityFactor: number; costPerKw: number; inverterCost: number }> = {
  "ACT": {
    "capacityFactor": 0.185619,
    "costPerKw": 533,
    "inverterCost": 1800
  },
  "NSW": {
    "capacityFactor": 0.17969,
    "costPerKw": 649,
    "inverterCost": 1800
  },
  "NT": {
    "capacityFactor": 0.24082,
    "costPerKw": 1490,
    "inverterCost": 1800
  },
  "QLD": {
    "capacityFactor": 0.211311,
    "costPerKw": 689,
    "inverterCost": 1800
  },
  "SA": {
    "capacityFactor": 0.182423,
    "costPerKw": 701,
    "inverterCost": 1800
  },
  "TAS": {
    "capacityFactor": 0.143815,
    "costPerKw": 921,
    "inverterCost": 1800
  },
  "VIC": {
    "capacityFactor": 0.15653,
    "costPerKw": 679,
    "inverterCost": 1800
  },
  "WA": {
    "capacityFactor": 0.206398,
    "costPerKw": 750,
    "inverterCost": 1800
  }
};

export interface SolarFractionRow {
  category: string;
  applianceType: string | null;
  grid_only: number;
  solar: number;
  solar_optimised: number;
  min_retail: number;
}
export const SOLAR_FRACTIONS: SolarFractionRow[] = [
  {
    "category": "Water Heating",
    "applianceType": null,
    "grid_only": 0,
    "solar": 0.5,
    "solar_optimised": 0.9,
    "min_retail": 0.1
  },
  {
    "category": "Water Heating",
    "applianceType": "Electric resistance",
    "grid_only": 0,
    "solar": 0.4,
    "solar_optimised": 0.7,
    "min_retail": 0.1
  },
  {
    "category": "Space Heating",
    "applianceType": null,
    "grid_only": 0,
    "solar": 0.15,
    "solar_optimised": 0.3,
    "min_retail": 0.1
  },
  {
    "category": "Space Cooling",
    "applianceType": null,
    "grid_only": 0,
    "solar": 0.4,
    "solar_optimised": 0.65,
    "min_retail": 0.1
  },
  {
    "category": "Cooktop",
    "applianceType": null,
    "grid_only": 0,
    "solar": 0.1,
    "solar_optimised": 0.1,
    "min_retail": 0.1
  },
  {
    "category": "Other Cooking",
    "applianceType": null,
    "grid_only": 0,
    "solar": 0.25,
    "solar_optimised": 0.25,
    "min_retail": 0.1
  },
  {
    "category": "Other Electronics",
    "applianceType": null,
    "grid_only": 0,
    "solar": 0.3333333333333333,
    "solar_optimised": 0.3333333333333333,
    "min_retail": 0.1
  },
  {
    "category": "Pool Equipment",
    "applianceType": null,
    "grid_only": 0,
    "solar": 0.6,
    "solar_optimised": 0.85,
    "min_retail": 0.1
  },
  {
    "category": "Vehicles",
    "applianceType": null,
    "grid_only": 0,
    "solar": 0.1,
    "solar_optimised": 0.25,
    "min_retail": 0.1
  }
];

/** Installed costs ($, AUS). Battery figures are per kWh. */
export const CAPEX = {
  "heatPumpHeater": 3200,
  "heatPumpWaterHeater": 3900,
  "inductionCooktop": 2200,
  "batteryPerKwhWithSolar": 620,
  "batteryPerKwhRetrofit": 940,
  "batteryInstallation": 2300
};

export const HEATERS_PER_HOME: Record<StateCode, number> = {
  "ACT": 3,
  "NSW": 2,
  "NT": 1,
  "QLD": 1,
  "SA": 2,
  "TAS": 3,
  "VIC": 3,
  "WA": 2
};

export const SUBSIDIES: { state: string; appliance: string; value: number; eligibility: string }[] = [
  {
    "state": "VIC",
    "appliance": "Solar",
    "value": 1400,
    "eligibility": "All"
  },
  {
    "state": "VIC",
    "appliance": "Heat pump",
    "value": 1000,
    "eligibility": "All"
  },
  {
    "state": "VIC",
    "appliance": "Solar",
    "value": 2400,
    "eligibility": "Apartment"
  },
  {
    "state": "NSW",
    "appliance": "Solar",
    "value": 2400,
    "eligibility": "Apartment"
  },
  {
    "state": "ACT",
    "appliance": "Solar",
    "value": 2400,
    "eligibility": "Apartment"
  }
];

export const MODEL_DEFAULTS = {
  "apartmentEnergyFactor": 0.79,
  "fastChargeFraction": 0.15,
  "batteryRoundTripEfficiency": 0.9,
  "batteryUseableCapacityPct": 0.9,
  "batteryDegradation1yr": 0.04,
  "batteryDegradation15yr": 0.022,
  "householdSafeguardPct": 0,
  "solarSeasonalWeights": {
    "spring": 2,
    "summer": 3,
    "autumn": 2,
    "winter": 1
  },
  "inverterReplacementYear": 12,
  "microinverterMaxSolarKwp": 5,
  "microinverterCostPerKw": 300
};
