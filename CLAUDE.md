# CLAUDE.md — ArcInvestments

## Project Identity

**ArcInvestments** is a professional-grade Thai stock market analysis dashboard covering three indices: **SET100**, **sSET**, and **MAI** (~254 equities total). It is a frontend-only React application built on Vite + Tailwind CSS with a dark financial terminal aesthetic.

Data comes from two layers: **real data** fetched from Yahoo Finance via `fetch_data.py` (stored as JSON in `src/data/real/`), merged with a **mock data fallback** for any ticker Yahoo cannot serve. Components consume data exclusively through the `data/` layer — no component generates values inline.

---

## Architecture

```
src/
├── App.jsx                       ← BrowserRouter + single "/" route → DashboardPage
├── main.jsx                      ← React 18 StrictMode entry point
├── data/
│   ├── indices.js                ← INDICES array (SET100, sSET, MAI), INDICES_MAP, ALL_STOCKS_MAP
│   ├── mockStocks.js             ← 121 mock SET100 stocks (11 sectors)
│   ├── mockSset.js               ← 71 mock sSET stocks
│   ├── mockMai.js                ← 83 mock MAI stocks
│   ├── realStocks.js             ← Merges real JSON + mock fallback → SET100/SSET/MAI exports
│   ├── mockPriceHistory.js       ← Seeded PRNG OHLCV generation (mulberry32), SET_INDEX baseline
│   ├── realPriceHistory.js       ← Loads real OHLCV from JSON files
│   ├── indicators.js             ← Pure math: SMA, EMA, Bollinger, RSI, MACD, Support/Resistance
│   ├── fundamentals.js           ← getFundamentals(ticker) → { pe, de, fcf, roe, dividendYield, sectorAvgPE }
│   ├── growthMetrics.js          ← getGrowthMetrics(ticker, sector) → { epsGrowth, revenueGrowth, payoutRatio }
│   ├── screenerPresets.js        ← 13 named presets + FILTER_DEFAULTS
│   └── real/                     ← Output from fetch_data.py (never edit manually)
│       ├── set100_stocks.json
│       ├── set100_history.json
│       ├── sset_stocks.json
│       ├── sset_history.json
│       ├── mai_stocks.json
│       ├── mai_history.json
│       └── meta.json             ← lastFetched timestamp, counts, skipped tickers
├── components/
│   ├── Dashboard/
│   │   ├── DashboardPage.jsx     ← Root layout: TopBar → MarketOverviewBar → ActiveFilterBar → FilterPanel + StockTable
│   │   ├── TopBar.jsx            ← Index selector tabs, search, trend horizon dropdown, last updated
│   │   ├── MarketOverviewBar.jsx ← Market summary stats bar
│   │   ├── ActiveFilterBar.jsx   ← Active filter chips with clear button
│   │   ├── FilterPanel.jsx       ← Collapsible side panel: all filter controls + presets
│   │   ├── StockTable.jsx        ← Main table: sort, row click, keyboard nav, CSV export
│   │   └── ScannerBar.jsx        ← Scanner/screener controls
│   ├── Terminal/
│   │   ├── StockTerminal.jsx     ← Modal: CandlestickChart + RSIChart + MACDChart + FundamentalPanel
│   │   └── FundamentalPanel.jsx  ← pe, de, fcf, roe, dividendYield, sectorAvgPE display
│   ├── Charts/
│   │   ├── CandlestickChart.jsx  ← lightweight-charts OHLCV candlestick + volume
│   │   ├── RSIChart.jsx          ← RSI(14) with 30/70 zones
│   │   ├── MACDChart.jsx         ← MACD line + signal + histogram
│   │   └── ChartOverlayControls.jsx ← Toggle buttons for SMA/EMA/Bollinger/SR overlays
│   └── UI/
│       ├── Badge.jsx
│       ├── Chip.jsx
│       ├── Dropdown.jsx
│       ├── Spinner.jsx           ← Used in Suspense fallback for lazy StockTerminal
│       └── Tooltip.jsx
├── hooks/
│   ├── useFilteredStocks.js      ← Filter + sort + search; returns { stocks, totalCount }
│   └── useStockData.js           ← Returns { history, closes, indicators } for a ticker
├── store/
│   └── useAppStore.js            ← Zustand: all global state (see State Management below)
└── utils/
    └── exportCsv.js              ← exportToCSV(stocks, { activeIndex, trendHorizon })
```

### The Data Contract

Every component consumes data through the `data/` layer. If you need a new field:
1. Add it to the appropriate `data/` file first
2. Consume it in the component

To swap in a live API later, only `data/` files change — components are untouched.

---

## Stack

| Concern | Library | Version |
|---|---|---|
| Framework | React + Vite | 18.3.1 / 5.3.4 |
| Styling | Tailwind CSS | v3.4.6 |
| Charting | `lightweight-charts` (TradingView) | v4.1.7 |
| Icons | `lucide-react` | 0.400.0 |
| State | Zustand | 4.5.4 |
| Routing | React Router | v6.24.1 |

**Dev server:** port 5179 (strictPort). **Preview:** port 4179.

---

## Design System

**Theme: Dark financial terminal**

| Token | Value | Usage |
|---|---|---|
| Background | `#0A0E17` | Page background |
| Surface | `#111827` | Card/panel backgrounds |
| Border | `#1F2937` | Dividers, table borders |
| Accent | `#3B82F6` | Primary blue — CTAs, selected state |
| Bullish | `#10B981` | Positive change, up trend |
| Bearish | `#EF4444` | Negative change, down trend |
| Muted | `#6B7280` | Secondary labels |
| Body | `#D1D5DB` | Primary text |
| Heading | `#F9FAFB` | Titles |
| Font (UI) | `Inter` | All non-numeric text |
| Font (numbers) | `JetBrains Mono` | Prices, percentages, volumes |

No `rounded-xl` or heavy shadows. Prefer clean grid lines and tight spacing — financial terminals are dense, not airy.

---

## Real Data Layer

`fetch_data.py` fetches from Yahoo Finance and writes to `src/data/real/`. Run it to refresh data:

```bash
python fetch_data.py
```

**Coverage:**
- SET100: ~100 tickers (`.BK` suffix on Yahoo)
- sSET: ~50 tickers
- MAI: ~37 tickers

**Fields fetched per ticker:**
- Chart API (v8): 5y daily OHLCV, currentPrice, change, changePct, volume, ipoDate, ipoPrice
- quoteSummary (v10): pe, de (debtToEquity ÷ 100), fcf (freeCashflow ÷ 1e9 → THB billions), roe (× 100 → %), dividendYield (× 100 → %), payoutRatio (× 100 → %), epsGrowth (earningsGrowth × 100 → %), revenueGrowth (× 100 → %)

**Merge strategy in `realStocks.js`:**
- Price fields (currentPrice, change, changePct, volume, ipoDate, ipoPrice) → always from real JSON
- Fundamental fields → real JSON value if present, else mock fallback
- Tickers missing from real JSON entirely → 100% mock data

---

## State Management (`useAppStore.js`)

Zustand store — single source of truth for all interactive state:

| Field | Type | Default | Description |
|---|---|---|---|
| `activeIndex` | string | `'SET100'` | Selected index (SET100/SSET/MAI) |
| `selectedStock` | object\|null | `null` | Opens StockTerminal modal |
| `trendHorizon` | string | `'launch'` | launch / 5y / 1y / ytd |
| `searchQuery` | string | `''` | Text filter on ticker/name |
| `sortKey` | string | `'marketCap'` | Column to sort by |
| `sortDir` | string | `'desc'` | asc / desc |
| `hideMockData` | boolean | `true` | Hide stocks with no real data |
| `filterPanelOpen` | boolean | `false` | Side filter panel open/closed |
| `activePreset` | string\|null | `null` | Active screener preset name |
| `selectedSectors` | string[] | `[]` | Sector multi-select |
| `trendDirection` | string\|null | `null` | 'up' / 'down' / null |
| `peMin/Max` | number\|'' | `''` | P/E range filter |
| `deMin/Max` | number\|'' | `''` | D/E range filter |
| `roeMin/Max` | number\|'' | `''` | ROE range filter |
| `fcfFilter` | string | `''` | '' / 'positive' / 'negative' |
| `rsiMin/Max` | number\|'' | `''` | RSI range filter |
| `macdFilter` | string | `''` | '' / 'bullish' / 'bearish' |
| `epsGrowthMin` | number\|'' | `''` | EPS growth % minimum |
| `revenueGrowthMin` | number\|'' | `''` | Revenue growth % minimum |
| `divYieldMin` | number\|'' | `''` | Dividend yield % minimum |
| `payoutRatioMax` | number\|'' | `''` | Payout ratio % maximum |

Key actions: `setActiveIndex` (resets all filters), `applyPreset`, `clearAllFilters`, `setFilter`, `setSort` (toggles direction), `setSelectedSectors`, `setTrendDirection` (toggles).

---

## Component Contracts

### Dashboard Table (`StockTable.jsx`)

Columns (in order): Ticker | Company Name | Current Price (THB) | Change % | Volume | P/E | D/E | ROE | FCF | Market Cap | Trend

All columns sortable. Click a row to open StockTerminal modal.

**Trend column logic** (respects `trendHorizon` from store):
- `launch` → Current Price vs `ipoPrice`
- `5y` → Current Price vs price 5 years ago
- `1y` → Current Price vs price 1 year ago
- `ytd` → Current Price vs Jan 1 of current year

### Filter Panel (`FilterPanel.jsx`)

Collapsible side panel. Contains:
- Sector multi-select
- Trend direction toggle (up/down)
- Range inputs for P/E, D/E, ROE, RSI
- FCF filter (positive/negative)
- MACD filter (bullish/bearish)
- Growth inputs: epsGrowthMin, revenueGrowthMin
- Dividend inputs: divYieldMin, payoutRatioMax
- 13 screener presets (see Screener Presets below)

### Screener Presets (`screenerPresets.js`)

13 named presets covering multiple strategies:

| # | Name | Key Criteria |
|---|---|---|
| 1 | Value | PE ≤ 15, D/E ≤ 1.5, FCF positive |
| 2 | High ROE | ROE ≥ 20% |
| 3 | Quality | ROE ≥ 15%, D/E ≤ 1.0, FCF positive |
| 4 | Growth | ROE ≥ 15%, FCF positive |
| 5 | Low Debt | D/E ≤ 0.5 |
| 6 | Deep Value | PE ≤ 10, FCF positive |
| 7 | Oversold Entry | RSI ≤ 35 |
| 8 | Oversold Dividend | RSI ≤ 35, FCF positive |
| 9 | Momentum | MACD bullish, RSI 45–70 |
| 10 | Turnaround | RSI ≤ 40, FCF positive, trend down |
| 11 | Overbought | RSI ≥ 70 |
| 12 | Growth Stocks | EPS growth ≥ 10%, Revenue growth ≥ 10% |
| 13 | Dividend Stocks | Div yield ≥ 4%, Payout ratio ≤ 70% |

### Stock Terminal (`StockTerminal.jsx`)

Modal overlay (dismissible via backdrop click or Escape). Lazy-loaded with Suspense + Spinner fallback.

**Chart Panel:**
- Candlestick chart (OHLCV) via `lightweight-charts`
- Volume bars below main chart
- Timeframe switcher: 1D | 1W | 1M | 1Y | ALL
- Toggleable overlays (via `ChartOverlayControls.jsx`):
  - SMA 20 / SMA 50
  - EMA 20 / EMA 50
  - EMA 200 (ON by default — institutional benchmark)
  - Bollinger Bands (20, 2)
  - Support & Resistance horizontal lines
  - SET Index overlay line (relative strength)
- Sub-charts: RSI(14) with 30/70 zones; MACD line + signal + histogram

**Fundamental Panel (`FundamentalPanel.jsx`):**
P/E (vs Sector Avg P/E) | D/E | FCF | ROE | Dividend Yield

---

## Indicator Math (`data/indicators.js`)

All functions are pure — input array in, computed array out. No side effects. Warm-up positions padded with `null`.

```js
export function calcSMA(closes, period)                          // → number[]
export function calcEMA(closes, period)                          // → number[]
export function calcBollingerBands(closes, period, stdDev)       // → { upper, mid, lower }[]
export function calcRSI(closes, period)                          // → number[]
export function calcMACD(closes, fast, slow, signal)             // → { macd, signal, hist }[]
export function calcSupportResistance(ohlcv)                     // → { support: number[], resistance: number[] }
```

---

## Mock Data

Three files, same stock typedef:

| File | Index | Count | Sectors |
|---|---|---|---|
| `mockStocks.js` | SET100 | 121 | Energy, Banking, Property, Telecom, Consumer, Healthcare, Industry, Food & Agri, Transport, Tech/Media, Financials |
| `mockSset.js` | sSET | 71 | Food & Beverage, Healthcare, Technology, Property, Manufacturing, Consumer, Financials, Logistics |
| `mockMai.js` | MAI | 83 | Technology, Manufacturing, Industrial, Property, Food & Beverage, Healthcare, Energy, Services |

**Stock typedef:**
```js
{
  ticker, name, sector, ipoDate, ipoPrice,
  currentPrice, change, changePct, volume, marketCap,
  pe, de, fcf, roe, dividendYield, sectorAvgPE, volatility
}
```

**Growth metrics** (`growthMetrics.js`) are generated separately via seeded PRNG:
```js
getGrowthMetrics(ticker, sector) // → { epsGrowth, revenueGrowth, payoutRatio }
```
Sector biases: Tech/Healthcare/Consumer/Food & Agri → higher growth. Energy/Banking/Telecom/Transport/Financials → higher payout ratios.

**Price history** (`mockPriceHistory.js`) uses mulberry32 seeded RNG for deterministic daily OHLCV from IPO date to present. Never use `Math.random()` in mock data.

---

## CSV Export (`utils/exportCsv.js`)

```js
exportToCSV(stocks, { activeIndex, trendHorizon })
```

Exports all currently filtered stocks with UTF-8 BOM for Thai character compatibility in Excel.

---

## Code Style

- Functional components only, no class components
- JSDoc comments on all `data/` functions (TypeScript is optional)
- Tailwind only — no inline styles, no CSS modules, no styled-components
- Component files under 300 lines; split if longer
- Named exports everywhere; only `App.jsx` uses default export
- All chart interactions keyboard-accessible where possible

---

## Performance Targets

- Initial load: < 2s
- Table (254 rows across all indices): smooth 60fps sort/filter
- Chart render on stock open: < 500ms
- No unnecessary re-renders — memoize computed indicator arrays
- Signal cache (RSI/MACD) and growth metric cache computed once per index switch

---

## File Naming Conventions

- Components: `PascalCase.jsx`
- Hooks: `useCamelCase.js`
- Data/utils: `camelCase.js`
- Constants: `UPPER_SNAKE_CASE` inside files
- JSON data files: `{index}_stocks.json`, `{index}_history.json`

---

## What NOT to Do

- Do not hardcode prices, indicators, or fundamentals inside components
- Do not use `Math.random()` without a seed (use mulberry32 seeded RNG)
- Do not edit files under `src/data/real/` manually — they are fetch_data.py output
- Do not use any charting library other than `lightweight-charts`
- Do not add a backend, Express server, or database — this is frontend-only
- Do not use CSS modules or styled-components — Tailwind only
- Do not create a separate route per stock — use the StockTerminal modal
- Do not add a new data field by hardcoding it in a component — add it to `data/` first
