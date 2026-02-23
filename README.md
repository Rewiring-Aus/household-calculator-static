# Rewiring Australia Household Calculator (Static)

A standalone, frontend-only version of the [Rewiring Australia Household Calculator](https://github.com/Rewiring-Aus/household-calculator-app). All calculation logic runs in the browser — no backend required for the calculator itself. Deployable to Cloudflare Pages or GitHub Pages.

**Live:** https://rewiring-aus.github.io/household-calculator-static/

---

## How it works

Users enter their household details (location, appliances, vehicles, solar/battery) and instantly see estimated savings from electrifying — covering energy bills, emissions, and upgrade costs. The calculation engine is a TypeScript port of the [Python household model](https://github.com/Rewiring-Aus/household-model).

As the user changes form selections, their state is automatically encoded into the URL as a `?h=` query parameter (base64-encoded JSON). This makes every calculator state shareable and bookmarkable — anyone with the link will see the same selections.

---

## Development

```bash
npm install
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # Production build to dist/
npx vitest run    # Run tests
```

### Running with Cloudflare Pages Functions locally (email + API)

The email capture feature requires a Cloudflare Pages Function (`functions/api/send-email.ts`) which runs at the edge. To test this locally, use [Wrangler](https://developers.cloudflare.com/workers/wrangler/) which proxies the Vite dev server and serves the function alongside it.

**1. Create a `.dev.vars` file** in the project root (already gitignored):

```
LOOPS_API_KEY=your_loops_api_key
LOOPS_TRANSACTIONAL_ID=your_loops_template_id
HUBSPOT_API_KEY=your_hubspot_private_app_token
```

**2. Run both servers in separate terminals:**

```bash
# Terminal 1 — Vite
npm run dev

# Terminal 2 — Wrangler (proxies Vite, adds Functions)
npx wrangler pages dev --proxy 5173
```

**3. Open `http://localhost:8788`** — not 5173. Wrangler serves the full app including the `/api/send-email` endpoint with your `.dev.vars` injected as environment variables.

---

## Features

### Shareable / bookmarkable URLs (`?h=` parameter)

The entire household state is encoded into the URL in real time as the user changes form selections. The `?h=` parameter contains a base64-encoded JSON representation of the household object.

- **Encoding:** `src/utils/householdUrlEncoding.ts` — `encodeHousehold()` / `decodeHousehold()`
- **Live sync:** A `useEffect` in `Home.tsx` watches `householdData` and calls `setSearchParams({ h: encodeHousehold(householdData) })` on every change
- **Restore on load:** On mount, `Home.tsx` reads the `?h=` param, decodes it, and passes the result as `initialHousehold` to `useHouseholdData`, which skips the default data fetch and initialises directly with the decoded state
- **Fallback:** The existing `?state=` parameter still works when `?h=` is absent

### Email report (`/api/send-email`)

Users can enter their email address in the results panel to receive a copy of their report. Submitting the form POSTs to `/api/send-email` with their email, savings data, and household state. The endpoint:

1. **Sends a transactional email via [Loops](https://loops.so)** — the email template is managed by the marketing team in the Loops dashboard, not in code. The following data variables are passed to the template:

   | Variable | Example value |
   |---|---|
   | `calc_yearly_savings` | `$2,531` |
   | `calc_weekly_savings` | `$48` |
   | `calc_reco_label` | `Install solar panels` |
   | `calc_reco_url` | `https://rewiringaustralia.org/...` |
   | `calc_report_url` | `https://.../#/?h=...` (shareable link back to their exact calculator state) |

2. **Upserts a contact in HubSpot** (fire-and-forget via `waitUntil` — does not block the response). Sets the following custom contact properties:

   | Property | Type | Notes |
   |---|---|---|
   | `calculator_annual_savings` | Number (currency) | Raw integer, e.g. `2531` |
   | `calculator_recommendation` | Text | Enum value, e.g. `SOLAR` |
   | `calculator_last_submitted_at` | Datetime | Unix milliseconds |
   | `state` | Text (standard) | AU state abbreviation, e.g. `NSW`. **Only set if the contact doesn't already have a state** — to avoid overwriting a cleaner value from another source. |

   The HubSpot upsert uses the contact's email as the unique identifier (`idProperty: email`). If the contact doesn't exist it will be created; if it does, properties are updated.

### Cloudflare Pages Function (`functions/api/send-email.ts`)

The function runs at the edge (Cloudflare Workers runtime) so API keys are never exposed to the browser. It requires three environment variables set in the Cloudflare Pages dashboard:

| Variable | Description |
|---|---|
| `LOOPS_API_KEY` | Loops API key |
| `LOOPS_TRANSACTIONAL_ID` | ID of the transactional email template in Loops |
| `HUBSPOT_API_KEY` | HubSpot Private App access token |

The HubSpot Private App needs the following scopes: `crm.objects.contacts.read`, `crm.objects.contacts.write`.

---

## Query string parameters

| Parameter | Description | Example |
|---|---|---|
| `?h=` | Full household state (base64 JSON). Takes precedence over `?state=`. | `?h=eyJsb2Nhd...` |
| `?state=` | Pre-select a location. Fallback when `?h=` is absent. | `?state=sa` |

Valid state values: `nsw`, `vic`, `qld`, `sa`, `wa`, `nt`, `act`, `tas`.

---

## Embedding in a website (e.g. Webflow)

The calculator is designed to be embedded via iframe. It posts its content height to the parent page so the iframe can expand to fit without its own scrollbar.

Add this as a custom HTML embed:

```html
<div id="calculator-container">
  <iframe
    id="calculator-iframe"
    style="width:100%;border:none;overflow:hidden;"
    scrolling="no"
    src="https://rewiring-aus.github.io/household-calculator-static/"
  ></iframe>
</div>

<script>
  // Forward parent query string into iframe
  var qs = window.location.search;
  if (qs) {
    var iframe = document.getElementById('calculator-iframe');
    iframe.src = iframe.src.replace(/\/?$/, '/') + qs;
  }

  // Resize iframe to match content height
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'calculator-resize') {
      var iframe = document.getElementById('calculator-iframe');
      iframe.style.height = e.data.height + 'px';
    }
  });
</script>
```

- **Query string forwarding** — if the parent page URL has `?state=sa` or `?h=...`, it gets passed into the iframe so the calculator pre-selects that state or restores a full saved state.
- **Auto-resizing** — the calculator posts its content height via `postMessage` whenever the DOM changes. The parent listens and resizes the iframe to match.

---

## Tech stack

- Vite + React 19 + TypeScript
- MUI v5
- react-hook-form
- react-router-dom v7 (HashRouter for static hosting compatibility)
- Vitest
- Cloudflare Pages Functions (Workers runtime) for the email API

---

## Project structure

```
src/
  calculator/           # TypeScript port of Python calculation engine
    constants/          # Energy data, fuel costs, emissions factors
    models/             # Electrification logic, recommendations
    savings/            # Emissions, opex, upfront cost calculations
    types.ts            # All enums and interfaces
    calculateSavings.ts # Main entry point
  components/
    HouseholdForm/      # Input form
    HouseholdSavings/   # Results panel (desktop)
    MobileSavingsDrawer/# Results drawer (mobile/tablet)
    EmailReportForm/    # Email capture form
  pages/                # Home, Methodology
  hooks/
    useHouseholdData/   # State management — fetches defaults, computes savings
  services/             # householdDataService (calls calculator directly)
  utils/
    householdUrlEncoding.ts  # encodeHousehold / decodeHousehold for ?h= param

functions/
  api/
    send-email.ts       # Cloudflare Pages Function — Loops email + HubSpot upsert
```

---

## Deployment

| Branch | Environment | URL |
|---|---|---|
| `main` | GitHub Pages (production) | https://rewiring-aus.github.io/household-calculator-static/ |
| `lead-capture` | Cloudflare Pages (preview) | Cloudflare preview URL |

Pushes to `main` deploy to GitHub Pages via `.github/workflows/deploy.yml`. Pushes to any branch on Cloudflare Pages auto-deploy a preview environment with the branch's environment variables applied.

> **Note:** The email capture feature (`functions/`) only works on Cloudflare Pages deployments — GitHub Pages does not support serverless functions. The calculator itself works on both.
