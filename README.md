# Rewiring Australia Household Calculator (Static)

A standalone, frontend-only version of the [Rewiring Australia Household Calculator](https://github.com/Rewiring-Aus/household-calculator-app). All calculation logic runs in the browser — no backend required. Deployable to GitHub Pages or any static host.

**Live:** https://rewiring-aus.github.io/household-calculator-static/

## How it works

Users enter their household details (location, appliances, vehicles, solar/battery) and instantly see estimated savings from electrifying — covering energy bills, emissions, and upgrade costs. The calculation engine is a TypeScript port of the [Python household model](https://github.com/Rewiring-Aus/household-model).

## Development

```bash
npm install
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build to dist/
npx vitest run    # Run tests (49 tests)
```

## Query string parameters

Pre-select a location by passing `?state=` with one of: `nsw`, `vic`, `qld`, `sa`, `wa`, `nt`, `act`, `tas`.

```
https://rewiring-aus.github.io/household-calculator-static/?state=sa
```

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

This handles two things:
- **Query string forwarding** — if the parent page URL has `?state=sa`, it gets passed into the iframe so the calculator pre-selects that location.
- **Auto-resizing** — the calculator posts its content height via `postMessage` whenever the DOM changes (e.g. adding vehicles, expanding sections). The parent listens and resizes the iframe to match, so the page scrolls naturally with no nested scrollbar.

## Tech stack

- Vite + React 18 + TypeScript
- MUI v5
- react-hook-form
- react-router-dom (HashRouter for GitHub Pages)
- Vitest

## Project structure

```
src/
  calculator/           # TypeScript port of Python calculation engine
    constants/          # Energy data, fuel costs, emissions factors
    models/             # Electrification logic, recommendations
    savings/            # Emissions, opex, upfront cost calculations
    types.ts            # All enums and interfaces
    calculateSavings.ts # Main entry point
  components/           # React UI components
  pages/                # Home, Methodology
  hooks/                # useHouseholdData
  services/             # householdDataService (calls calculator directly)
```

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.
