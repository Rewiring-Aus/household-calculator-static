# Reference running costs from the Energy Savings 2026 R model, for the parity
# test in src/calculator/__tests__/parity.test.ts. Run from the repo root:
#   Rscript scripts/parity/r_reference.R [path/to/energy-savings-2026-model]
# "running" = net_annual_opex: energy, supply charges and vehicle servicing,
# less solar/battery credits.
suppressMessages(library(tidyverse))
args <- commandArgs(trailingOnly = TRUE)
repo <- normalizePath(if (length(args) >= 1) args[1] else "../energy-savings-2026-model")
out <- if (length(args) >= 2) args[2] else "src/calculator/__tests__/fixtures/r_reference.csv"
options(esm.model_dir = repo, esm.data_dir = file.path(repo, "data"), readr.show_col_types = FALSE)
suppressMessages(source(file.path(repo, "energy_savings_model.R")))
rows <- list()
for (st in c("NSW","VIC","QLD","SA","WA","TAS","ACT","NT")) for (per in c("1year","15year")) {
  hh <- household(state = st, n_occupants = 3, n_vehicles = 1, vehicle_class = "SUV",
                  period = per, tariff = "tou", use_loan = FALSE,
                  solar_kwp = 10, battery_size_kwh = 15)
  r <- suppressWarnings(evaluate_household(hh))
  rows[[length(rows)+1]] <- r$summary |>
    transmute(state = st, period = per, scenario, tariff,
              running = net_annual_opex, tco2e = annual_tCO2e)
}
write_csv(bind_rows(rows), out)
