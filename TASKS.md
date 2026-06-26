# TASKS.md — ArcInvestments

## Build Order

Follow this exact sequence. Complete each phase fully before moving to the next. Run `npm run dev` after each phase to confirm nothing is broken.

---

## Phase 1 — Project Scaffold

- [x] **T-001** Init Vite + React project: `npm create vite@latest arc-investments -- --template react`
- [x] **T-002** Install dependencies:
  ```
  npm install tailwindcss postcss autoprefixer lucide-react lightweight-charts zustand react-router-dom
  npx tailwindcss init -p
  ```
- [x] **T-003** Configure `tailwind.config.js` with the ArcInvestments design tokens (colors, fonts) per CLAUDE.md Design System
- [x] **T-004** Add Google Fonts import in `index.html`: `Inter` + `JetBrains Mono`
- [x] **T-005** Set up global CSS reset in `index.css` with dark background `#0A0E17` as body default
- [x] **T-006** Create the full `src/` directory tree as specified in CLAUDE.md Architecture section

---

## Phase 2 — Mock Data Layer (Foundation)

> All data work before any UI work.

- [x] **T-010** Create `src/data/mockStocks.js`
  - Export `STOCKS` array of 100 objects with: `ticker, name, sector, ipoDate, ipoPrice, currentPrice, change, changePct, volume, marketCap, pe, de, fcf, roe, dividendYield, sectorAvgPE`
  - Cover all 11 sectors listed in CLAUDE.md
  - Values must be realistic for SET-listed Thai companies (prices in THB)

- [x] **T-011** Create `src/data/indicators.js`
  - Implement and export pure functions: `calcSMA`, `calcEMA`, `calcBollingerBands`, `calcRSI`, `calcMACD`, `calcSupportResistance`
  - Each function: input array → output array, no side effects
  - Add JSDoc comment with param/return types on every function

- [x] **T-012** Create `src/data/mockPriceHistory.js`
  - Implement a seeded pseudo-random number generator (mulberry32 or similar)
  - Export `generateOHLCV(ticker, ipoDate, ipoPrice, volatility)` → daily OHLCV array from ipoDate to today
  - Export `SET_INDEX_HISTORY` — a realistic SET Index baseline series (1,200 to ~1,700 range, 2010–present)
  - Export `getStockHistory(ticker)` → cached OHLCV array (memoized so it's only generated once)
  - Sector-based volatility map as per CLAUDE.md

- [x] **T-013** Create `src/data/fundamentals.js`
  - Export `getFundamentals(ticker)` → `{ pe, de, fcf, roe, dividendYield, sectorAvgPE }`
  - This is a thin wrapper over `STOCKS` data for now, but kept separate for future API swap

- [x] **T-014** Write smoke tests in browser console (not a test framework):
  - `getStockHistory('PTT')` returns 3000+ OHLCV candles ✅ (6,428 candles)
  - `calcRSI(closes, 14)` returns array of same length with nulls for first 13 ✅
  - `calcMACD(closes, 12, 26, 9)` returns `{ macd, signal, hist }` arrays ✅

---

## Phase 3 — Global State & Routing

- [x] **T-020** Create `src/store/useAppStore.js` (Zustand)
  - State: `selectedStock` (null or ticker string), `trendHorizon` ('launch'|'5y'|'1y'|'ytd'), `activeScanners` (string[]), `searchQuery` (string)
  - Actions: `setSelectedStock`, `setTrendHorizon`, `toggleScanner`, `setSearchQuery`

- [x] **T-021** Set up React Router in `App.jsx`
  - Route `/` → Dashboard
  - Stock detail as an overlay/modal on top of Dashboard (not a separate route)

---

## Phase 4 — Dashboard (Main Table)

- [x] **T-030** Create `src/components/Dashboard/DashboardPage.jsx`
  - Layout: TopBar → ScannerBar → Table

- [x] **T-031** Create `src/components/Dashboard/TopBar.jsx`
  - Left: "ArcInvestments" wordmark + "SET 100" badge
  - Right: Search input + Trend Horizon dropdown (`Since Launch | 5-Year | 1-Year | YTD`)
  - Connect to Zustand store

- [x] **T-032** Create `src/components/Dashboard/ScannerBar.jsx`
  - Three filter chips: `RSI Oversold (<30)` | `RSI Overbought (>70)` | `MACD Bullish Cross`
  - Active chip: solid blue bg. Inactive: outline style
  - Clicking a chip toggles it; multiple can be active simultaneously (AND logic)
  - Chips should show a count badge of matching stocks when active

- [x] **T-033** Create `src/components/Dashboard/StockTable.jsx`
  - Columns: Ticker | Company Name | Price | Change % | Volume | P/E | Market Cap | Trend
  - Client-side sort on every column header click (asc/desc toggle)
  - Rows are filtered by: `searchQuery` (ticker or name match) AND any active scanner tags
  - Trend cell: uses `trendHorizon` from store to calculate direction, shows ↑ green or ↓ red arrow + % diff
  - Each row is clickable → calls `setSelectedStock(ticker)`
  - Zebra striping on rows, hover highlight

- [x] **T-034** Create `src/hooks/useFilteredStocks.js`
  - Computes filtered + sorted stock list
  - Inputs from store: `searchQuery`, `activeScanners`, `trendHorizon`, sort state
  - Pre-computes latest RSI and MACD state for scanner filtering (use `calcRSI` and `calcMACD` from indicators.js)
  - Memoized with `useMemo`

---

## Phase 5 — Stock Terminal (Detail View)

- [x] **T-040** Create `src/components/Terminal/StockTerminal.jsx`
  - Full-screen overlay (fixed position, z-50, dark bg)
  - Two-column layout on desktop: Chart (65%) | Fundamentals (35%)
  - Single column stacked on mobile
  - Header: ticker, company name, current price, change badge, close (X) button

- [x] **T-041** Create `src/components/Charts/CandlestickChart.jsx`
  - Use `lightweight-charts` `createChart()` API
  - Add `CandlestickSeries` for OHLCV data
  - Add `HistogramSeries` for volume (separate pane below)
  - Timeframe buttons (1D | 1W | 1M | 1Y | ALL) filter visible data range
  - Chart must be responsive — resize on container resize using ResizeObserver
  - Dark theme config matching design tokens

- [x] **T-042** Create `src/components/Charts/ChartOverlayControls.jsx`
  - Toggle buttons for overlays: SMA20 | SMA50 | EMA20 | EMA50 | EMA200 | Bollinger Bands | Support/Resistance | SET Index
  - EMA200 is ON by default
  - Each toggle adds/removes the corresponding `LineSeries` from the chart
  - SET Index overlay renders as a faint dotted line (opacity 40%)

- [x] **T-043** Create `src/components/Charts/RSIChart.jsx`
  - Separate `lightweight-charts` chart instance (smaller height)
  - RSI line in blue
  - Horizontal reference lines at 30 (green dashed) and 70 (red dashed)
  - Shaded band between 30-70

- [x] **T-044** Create `src/components/Charts/MACDChart.jsx`
  - Separate chart instance
  - MACD line (blue) + Signal line (orange)
  - Histogram bars: green when positive, red when negative

- [x] **T-045** Create `src/components/Terminal/FundamentalPanel.jsx`
  - Data grid with 5 metrics: P/E, D/E, FCF, ROE, Dividend Yield
  - P/E row shows stock value AND sector average side by side with a comparison badge (Above/Below/In-line)
  - FCF formatted as THB billions
  - ROE and Dividend Yield as percentages
  - Add a mini "Company Info" section at top: Sector tag, IPO date, Market Cap

---

## Phase 6 — UI Primitives & Polish

- [x] **T-050** Create `src/components/UI/Badge.jsx` — variant prop: `bullish`, `bearish`, `neutral`, `info`
- [x] **T-051** Create `src/components/UI/Dropdown.jsx` — accessible select replacement styled to dark theme
- [x] **T-052** Create `src/components/UI/Chip.jsx` — filter chip with active/inactive states + optional count badge
- [x] **T-053** Create `src/components/UI/Spinner.jsx` — minimal loading indicator for chart render delay
- [x] **T-054** Create `src/components/UI/Tooltip.jsx` — hover tooltip for metric explanations (e.g. hover P/E → shows definition)
- [x] **T-055** Add tooltips to all fundamental metrics in `FundamentalPanel`
- [x] **T-056** Add empty state to table: "No stocks match your filters" with a reset button

---

## Phase 7 — Performance & Accessibility

- [x] **T-060** Memoize all indicator calculations in `useStockData.js` hook with `useMemo`
- [x] **T-061** Lazy-load `StockTerminal` component (React.lazy + Suspense)
- [x] **T-062** Add keyboard navigation to table rows (arrow keys, Enter to open terminal)
- [x] **T-063** Add `aria-label` to all icon-only buttons
- [x] **T-064** Confirm chart containers clean up `lightweight-charts` instances on unmount (prevent memory leak)
- [ ] **T-065** Test all 100 stocks open without error in the terminal

---

## Phase 8 — Final QA Checklist

- [ ] **T-070** All 100 SET 100 stocks appear in table
- [ ] **T-071** Search filters correctly by ticker and name
- [ ] **T-072** All 4 Trend Horizon modes produce different trend arrows
- [ ] **T-073** All 3 scanner chips filter correctly
- [ ] **T-074** Scanner chips show correct match counts
- [ ] **T-075** Clicking any stock opens terminal without error
- [x] **T-076** All 5 timeframes work on candlestick chart
- [x] **T-077** All 8 overlay toggles work (add/remove lines on chart)
- [x] **T-078** EMA 200 is visible by default on chart open
- [x] **T-079** RSI chart renders with 30/70 reference lines
- [x] **T-080** MACD chart renders with histogram coloring
- [ ] **T-081** Fundamental panel shows all 5 metrics
- [ ] **T-082** P/E shows sector average comparison badge correctly
- [ ] **T-083** Terminal closes cleanly and table is still intact
- [ ] **T-084** No console errors in any interaction path
- [ ] **T-085** Responsive layout works on 375px (mobile) and 1440px (desktop)

---

---

## Phase 9 — Backtesting Engine

> Build a self-contained backtesting system that runs entirely in the browser against
> the existing real OHLCV history. Zero disruption to the dashboard — new route `/backtest`,
> new files only, one small addition to TopBar and App.jsx.

### Data context
- Real OHLCV history: **2021-06-28 → 2026-06-26** (~1 215 candles / stock, all indices)
- Earliest meaningful backtest start: **2022-07-01**
  (≈250 trading days of warm-up from data start → EMA200 is fully valid by then)
- Stocks with < 400 candles (some MAI names) auto-skip entry signals until indicators warm up

---

### T-090 — Core backtesting engine (`src/data/backtester.js`)

Pure function, no React imports, no side effects.

**Input:**
```js
runBacktest({
  strategy,    // StrategyDef (see T-091)
  allStocks,   // Stock[] — full universe passed in; engine applies selectionCriteria internally
  startDate,   // 'YYYY-MM-DD' — first date trades may fire
  endDate,     // 'YYYY-MM-DD' — force-close everything on this date (default: last candle)
  budget,      // number — initial capital in THB
})
```

**Engine algorithm (daily loop):**
1. Pre-compute full indicator arrays for every stock in universe once before the loop
   (`calcSMA`, `calcEMA`, `calcBollingerBands`, `calcRSI`, `calcMACD`)
2. Build a sorted union of all trading dates across all stocks
3. Walk each date from `startDate` → `endDate`:
   - **Exit pass** (check open positions first to free up cash):
     - Stop-loss hit: if `candle.low ≤ buyPrice × (1 − stopLossPct)` → sell at stop price
     - Take-profit hit: if `candle.high ≥ buyPrice × (1 + takeProfitPct)` → sell at target
     - Strategy exit signal: call `strategy.exitCriteria(ctx)` → sell at `candle.close`
   - **Entry pass** (open new positions if cash available and below `maxPositions`):
     - Call `strategy.selectionCriteria(stock)` → skip if false
     - Call `strategy.entryCriteria(ctx)` → buy at next-day open (avoid look-ahead bias)
     - Position size = `availableCash / (maxPositions − openPositionCount)`
     - `quantity = Math.floor(positionSize / entryPrice)` (whole shares only)
4. After `endDate`: force-close all open positions at last available candle close

**Output — `BacktestResult`:**
```js
{
  strategyId,
  runAt,           // ISO timestamp
  startDate,
  endDate,
  initialBudget,
  finalValue,      // cash + open-position mark-to-market
  trades: [{
    ticker,
    buyDate,       // 'YYYY-MM-DD'
    buyPrice,      // THB
    quantity,
    sellDate,      // null if still open at end
    sellPrice,
    pnl,           // THB — positive = profit
    pnlPct,        // %
    daysHeld,
    exitReason,    // 'signal' | 'stop_loss' | 'take_profit' | 'end_of_data'
  }],
  summary: {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,       // %
    totalPnl,      // THB
    totalPnlPct,   // %
    maxDrawdown,   // % — largest peak-to-trough drawdown on equity curve
    avgDaysHeld,
    bestTrade,     // Trade with highest pnlPct
    worstTrade,    // Trade with lowest pnlPct
    equityCurve,   // [{ date, value }] — daily portfolio value for charting
  },
}
```

**Important constraints:**
- Entries execute at **next-day open** (not same-day close) to avoid look-ahead bias
- Indicators that return `null` (warm-up period) must never trigger a trade
- A ticker already in the portfolio cannot be bought again until sold
- Commission: configurable per-strategy (`commissionPct`, default `0.0015` = 0.15% per leg)

---

### T-091 — Strategy definition schema (`src/data/strategies.js`)

Each strategy is a plain JS object:
```js
{
  id: string,
  label: string,
  description: string,
  universe: 'ALL' | 'SET100' | 'SSET' | 'MAI',
  maxPositions: number,        // max concurrent open trades
  stopLossPct: number | null,  // e.g. 0.08 = 8% hard stop; null = no stop
  takeProfitPct: number | null,
  commissionPct: number,       // default 0.0015

  // ctx = { stock, history, closes, indicators, i, date }
  selectionCriteria: (ctx) => boolean,
  entryCriteria:     (ctx) => boolean,
  exitCriteria:      (ctx) => boolean,  // only called when a position is open
}
```

**`indicators` object passed to each criteria function:**
```js
{
  sma20, sma50, sma150, sma160, sma200,   // number[] | null[]
  ema20, ema50, ema200, ema220,
  boll,   // { upper, mid, lower }[]
  rsi14,  // number[]
  macd,   // { macd, signal, hist }[]
}
```

**Starter strategies to implement (one per strategy file section):**

| # | ID | Entry Signal | Exit Signal | Stop |
|---|---|---|---|---|
| 1 | `golden_cross` | SMA50 crosses above SMA200 | SMA50 crosses below SMA200 | 8% |
| 2 | `rsi_oversold_bounce` | RSI(14) crosses above 30 (was below) | RSI > 70 OR RSI crosses below 50 | 8% |
| 3 | `ema200_pullback` | Price closes above EMA200 after dipping below it | Price closes below EMA200 | 5% |
| 4 | `macd_crossover` | MACD line crosses above signal line | MACD line crosses below signal line | 8% |
| 5 | `sma_trend_setup` | All 5 SMA Trend Setup screener conditions met | SMA50 falls below SMA160 | 10% |
| 6 | `bollinger_breakout` | Close breaks above upper Bollinger band | Close back inside upper band for 2 days | 8% |

---

### T-092 — Backtest state slice in Zustand (`src/store/useAppStore.js`)

Add to the existing store — do not touch any existing state or actions:
```js
// state
backtestResults: {},         // { [strategyId_runId]: BacktestResult }
backtestRunning: false,
activeBacktestId: null,      // currently viewed result key

// actions
runBacktest(strategyId, budget, startDate, endDate),
setActiveBacktest(resultId),
clearBacktestResult(resultId),
clearAllBacktestResults(),
```

`runBacktest` action:
- Sets `backtestRunning: true`
- Calls `runBacktest()` from `backtester.js` synchronously
  (all data in memory; runs in < 2s for 254 stocks × 5 years)
- Stores result under key `${strategyId}_${Date.now()}`
- Sets `activeBacktestId` to the new key
- Sets `backtestRunning: false`

---

### T-093 — Backtest route + TopBar nav link

**`src/App.jsx`** — add second route:
```jsx
<Route path="/backtest" element={<BacktestPage />} />
```

**`src/components/Dashboard/TopBar.jsx`** — add a nav link alongside the index tabs:
- "⚡ Backtest" button styled as a secondary action (outline, not accent-filled)
- Uses React Router `<Link>` to `/backtest`
- Active state when on `/backtest`

---

### T-094 — `BacktestPage` layout (`src/components/Backtest/BacktestPage.jsx`)

Two-column layout matching the financial terminal aesthetic:

```
┌────────────────────────────────────────────────────────────────┐
│ TopBar (same as dashboard — includes back-nav to "/" )         │
├──────────────────┬─────────────────────────────────────────────┤
│  Strategy Panel  │  Results Area                               │
│  (280px fixed)   │                                             │
│                  │  [no run yet]  → "Select a strategy and     │
│  ○ Golden Cross  │                   click Run"                │
│  ○ RSI Bounce    │                                             │
│  ○ EMA200 Pull   │  [result ready] → SummaryStats + TradeTable │
│  ○ MACD Cross    │                                             │
│  ○ SMA Trend     │                                             │
│  ○ Boll Break    │                                             │
│                  │                                             │
│  Budget: [____]  │                                             │
│  Start:  [____]  │                                             │
│  End:    [____]  │                                             │
│                  │                                             │
│  [ Run Backtest ]│                                             │
│                  │                                             │
│ Past Runs:       │                                             │
│  Golden Cross ✓  │                                             │
│  RSI Bounce   ✓  │                                             │
└──────────────────┴─────────────────────────────────────────────┘
```

Defaults: Budget = 100,000 THB · Start = 2022-07-01 · End = today

---

### T-095 — `SummaryStats` component (`src/components/Backtest/SummaryStats.jsx`)

Metric cards row + equity curve chart:

**Cards (2 rows of 4):**
```
Final Value  │ Total P&L  │ Total P&L % │ Win Rate
Total Trades │ Avg Days   │ Max Drawdown │ Best / Worst Trade
```

**Equity Curve:**
- `lightweight-charts` LineSeries
- X-axis: dates from startDate → endDate
- Y-axis: portfolio value in THB
- Horizontal dashed line at initial budget
- Area fill below the line: green if above budget, red if below

---

### T-096 — `BacktestResultsTable` component (`src/components/Backtest/BacktestResultsTable.jsx`)

Sortable table — one row per closed trade (open positions shown at bottom, greyed out):

| Ticker | Buy Date | Buy Price | Qty | Sell Date | Sell Price | P&L (฿) | P&L % | Days | Exit Reason |
|---|---|---|---|---|---|---|---|---|---|

- P&L ฿ and P&L % colored bullish/bearish
- Exit Reason shown as a small badge: `SIGNAL` · `STOP` · `TARGET` · `EOD`
- Click a row → opens the StockTerminal modal for that ticker
- Sortable on every column
- Footer row: totals for P&L ฿, and averages for P&L %, Days Held

---

### T-097 — `StrategyPanel` component (`src/components/Backtest/StrategyPanel.jsx`)

Left panel:
- Radio list of all strategies with description on hover
- Number inputs: Budget (THB), Start Date, End Date
- "Run Backtest" button — disabled while `backtestRunning`
- "Past Runs" section below: lists previous results by strategy name + run time
  - Click → sets `activeBacktestId` to show that result
  - Delete (×) button → calls `clearBacktestResult`

---

### T-098 — Export backtest results to CSV

Extend `src/utils/exportCsv.js` with:
```js
exportBacktestToCSV(result)
```
- Exports the full trade log with all columns
- UTF-8 BOM header for Excel
- Button in `BacktestResultsTable` toolbar: "Export CSV"

---

### T-099 — Strategy comparison view

After running 2+ strategies with the same date range and budget:
- "Compare" button appears above the results area
- Side-by-side table: each strategy as a column, each summary metric as a row
- Highlight the best value in each row in accent color

---

## Deferred (Post-MVP)

- Real-time WebSocket price feed integration
- User watchlists (localStorage persistence)
- Portfolio tracker
- News feed panel per stock
- Thai language toggle
