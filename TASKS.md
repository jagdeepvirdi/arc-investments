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

**Full strategy library — see T-091b below for detailed specifications.**

---

### T-091b — Strategy Library (full catalog with entry/exit rules)

> **Data analysis findings (SET100, 2022-07-01 → 2026-06-26):**
> - 64.3% of stock-days were in SMA50 < SMA200 (persistent downtrend market)
> - Average 3-year return across SET100: **−11%** — this market punishes buy-and-hold
> - Daily volatility: **2.1%** — high enough for short-term mean reversion to be viable
> - Stocks can lose 80–99% (RS: −99%, NOK: −89%) → **stop losses are mandatory on every strategy**
> - Best performers (DELTA +442%, KTB +244%) shared: strong fundamentals + clear uptrend
> - Bollinger lower band + RSI<40 + EMA200 filter produced 59.6% raw win rate (most promising signal)
>
> **Design principles applied to all strategies:**
> 1. Every strategy has a hard stop loss — no exceptions
> 2. Fundamental quality screens (ROE, FCF) block the catastrophic losers
> 3. EMA200 or SMA200 trend filter prevents buying into multi-year downtrends
> 4. Universe is ALL stocks (SET100 + sSET + MAI) unless noted — more opportunities
> 5. Max 5 concurrent positions unless noted — equal position sizing

---

#### CATEGORY A — Trend Following

---

**S1 · Golden Cross + Quality Filter** `golden_cross_quality`
> Rationale: Classic SMA50/SMA200 cross, but with fundamental screen to avoid the RS/NOK losers.
> Raw golden cross has only ~2.9 events/stock over 5yr — quality filter keeps only the real breakouts.

| Field | Value |
|---|---|
| Universe | ALL stocks |
| Max positions | 5 |
| Selection | ROE > 10% AND FCF positive AND market cap > 5B THB |
| Entry | SMA50 crosses above SMA200 (golden cross) |
| Exit | SMA50 crosses below SMA200 (death cross) OR price drops below SMA200 |
| Stop loss | 10% |
| Take profit | None — let trend run |
| Commission | 0.15% per leg |

---

**S2 · EMA Ribbon Alignment** `ema_ribbon`
> Rationale: Requires EMA20 > EMA50 > EMA200 all aligned bullishly AND price above EMA20.
> Stricter than golden cross — only enters when multiple timeframes agree.
> RSI 45–65 filter prevents chasing overbought rallies.

| Field | Value |
|---|---|
| Universe | ALL stocks |
| Max positions | 5 |
| Selection | Any |
| Entry | EMA20 > EMA50 > EMA200 AND price > EMA20 AND RSI between 45–65 |
| Exit | EMA20 crosses below EMA50 |
| Stop loss | 8% |
| Take profit | None |
| Commission | 0.15% per leg |

---

**S3 · EMA200 Reclaim** `ema200_reclaim`
> Rationale: Price dips below EMA200 (shakeout), then closes back above it.
> Captures the start of trend resumption after a correction.
> Requires the dip to have lasted at least 3 days (not a one-day wick).

| Field | Value |
|---|---|
| Universe | ALL stocks |
| Max positions | 5 |
| Selection | Any |
| Entry | Price closes above EMA200 after being below it for 3+ consecutive days |
| Exit | Price closes below EMA200 for 2 consecutive days |
| Stop loss | 8% |
| Take profit | None |
| Commission | 0.15% per leg |

---

**S4 · MACD Crossover + Volume Confirmation** `macd_volume`
> Rationale: MACD bullish cross filtered by volume spike (> 1.5× 20-day avg).
> Volume confirmation separates genuine institutional buying from noise.

| Field | Value |
|---|---|
| Universe | ALL stocks |
| Max positions | 5 |
| Selection | Price > EMA200 (only in overall uptrend) |
| Entry | MACD line crosses above signal line AND volume > 1.5× 20-day avg volume |
| Exit | MACD line crosses below signal line |
| Stop loss | 8% |
| Take profit | None |
| Commission | 0.15% per leg |

---

#### CATEGORY B — Mean Reversion

---

**S5 · Bollinger Band Quality Bounce** `boll_quality_bounce`
> Rationale: Best raw signal found in data analysis (59.6% win rate unoptimised).
> Price touches lower Bollinger Band + RSI oversold, but only in quality stocks above EMA200.
> Quality filter (ROE + FCF) is critical — prevents catching stocks in terminal decline like RS.

| Field | Value |
|---|---|
| Universe | ALL stocks |
| Max positions | 8 (more positions because short average hold time) |
| Selection | ROE > 10% AND FCF positive AND price > EMA200 |
| Entry | Close ≤ lower Bollinger Band (20, 2σ) AND RSI(14) < 40 |
| Exit | Close ≥ middle Bollinger Band (SMA20) OR RSI > 60 |
| Stop loss | 8% |
| Take profit | None — middle band is the target |
| Commission | 0.15% per leg |

---

**S6 · RSI Double-Dip Recovery** `rsi_double_dip`
> Rationale: RSI makes a higher low below 40 while price also makes a higher low = bullish divergence.
> Two-touch confirmation reduces false signals vs. single RSI dip.
> Only in uptrending stocks (price above SMA200).

| Field | Value |
|---|---|
| Universe | ALL stocks |
| Max positions | 5 |
| Selection | Price > SMA200 |
| Entry | RSI was below 40, bounced above 40, then dipped back towards 40 (but higher low), and crosses 40 again |
| Exit | RSI > 65 OR price drops below SMA200 |
| Stop loss | 8% |
| Take profit | 15% |
| Commission | 0.15% per leg |

---

**S7 · Pullback to Rising SMA50** `sma50_pullback`
> Rationale: In uptrending stocks, pullbacks to SMA50 are re-entry points.
> SMA50 must be rising (higher than 10 days ago) — not a declining support.
> RSI 40–55 confirms neither overbought nor broken down.

| Field | Value |
|---|---|
| Universe | ALL stocks |
| Max positions | 5 |
| Selection | SMA50 > SMA200 AND SMA50 is rising (SMA50[i] > SMA50[i−10]) |
| Entry | Price within 2% above SMA50 AND RSI between 40–55 |
| Exit | Price rises 15% above entry OR SMA50 crosses below SMA200 |
| Stop loss | 6% (tight — we're buying near support) |
| Take profit | 15% |
| Commission | 0.15% per leg |

---

#### CATEGORY C — Momentum

---

**S8 · 52-Week High Breakout + Market Filter** `high52w_breakout`
> Rationale: 505 breakout events found; 44% raw win rate.
> Adding SET index filter (only trade when SET index itself is above its EMA200) is expected
> to significantly improve win rate by preventing buying breakouts in a falling market.

| Field | Value |
|---|---|
| Universe | SET100 only (most liquid, avoids thin MAI names) |
| Max positions | 5 |
| Selection | SET index close > SET index EMA200 (market timing gate) |
| Entry | Price makes a new 52-week closing high (close > highest close of past 252 days) |
| Exit | Price drops 12% from highest close since entry (trailing from peak) OR falls below SMA50 |
| Stop loss | 8% hard stop from entry |
| Take profit | None — trailing exit |
| Commission | 0.15% per leg |

---

**S9 · Relative Strength vs SET Index** `relative_strength`
> Rationale: In a declining market, buy the stocks that are still going UP.
> These are the market leaders — DELTA, KTB, ADVANC showed this pattern.
> Measured as stock's 3-month return minus SET index 3-month return.

| Field | Value |
|---|---|
| Universe | ALL stocks |
| Max positions | 5 |
| Selection | 3-month return of stock > 3-month return of SET index + 10% (outperforming by 10%) |
| Entry | Stock makes new 1-month closing high (price > highest close in past 21 days) |
| Exit | Stock's 1-month return drops below SET index 1-month return (underperformance) |
| Stop loss | 10% |
| Take profit | None |
| Rebalance | Re-evaluate entry conditions weekly |
| Commission | 0.15% per leg |

---

**S10 · MACD Histogram Momentum Shift** `macd_histogram_reversal`
> Rationale: MACD histogram turning positive after 5+ consecutive negative bars
> is the earliest measurable sign of momentum reversal — earlier than line crossover.
> Catches the beginning of a move, exits on first sign of loss of momentum.

| Field | Value |
|---|---|
| Universe | ALL stocks |
| Max positions | 6 |
| Selection | Price > EMA200 |
| Entry | MACD histogram was negative for 5+ consecutive days, then turns positive (first positive bar) |
| Exit | MACD histogram turns negative again (first negative bar) |
| Stop loss | 7% |
| Take profit | None |
| Commission | 0.15% per leg |

---

#### CATEGORY D — Hybrid Technical + Fundamental

---

**S11 · Quality Uptrend (Minervini-Style)** `quality_uptrend`
> Rationale: Mimics Mark Minervini's SEPA criteria adapted for Thai market.
> Only buy high-quality companies (ROE + FCF + low debt) that are in confirmed uptrends.
> This is what DELTA, KTB, ADVANC, TTB all looked like before their big runs.

| Field | Value |
|---|---|
| Universe | ALL stocks |
| Max positions | 5 |
| Selection | ROE > 15% AND FCF positive AND D/E < 1.5 AND market cap > 10B THB |
| Entry | Price > EMA200 AND SMA50 > SMA200 AND price makes new 1-month closing high |
| Exit | Price drops below EMA200 OR SMA50 crosses below SMA200 |
| Stop loss | 8% |
| Take profit | None — let the winners run |
| Commission | 0.15% per leg |

---

**S12 · Value Breakout** `value_breakout`
> Rationale: Fundamentally cheap stocks (PE < 12, FCF positive) that are starting to move.
> The breakout above 3-month high signals the market is re-rating the value.
> Combines a margin-of-safety valuation entry with a price momentum trigger.

| Field | Value |
|---|---|
| Universe | ALL stocks |
| Max positions | 5 |
| Selection | PE between 1–12 AND FCF positive AND D/E < 1.0 |
| Entry | Price breaks above the highest close of the past 63 trading days (3-month high) |
| Exit | Price drops below SMA50 |
| Stop loss | 10% (wider — value stocks can stay cheap longer) |
| Take profit | 25% |
| Commission | 0.15% per leg |

---

**S13 · Dividend Defensive Uptrend** `dividend_uptrend`
> Rationale: High-yield dividend stocks with low payout ratios are the safest bet in a
> bearish market. Adding a trend filter (price > SMA50 > SMA200) ensures we only hold
> while the stock is healthy, not catching yield traps in decline.

| Field | Value |
|---|---|
| Universe | ALL stocks |
| Max positions | 6 |
| Selection | Dividend yield > 3.5% AND payout ratio < 70% AND FCF positive |
| Entry | Price > SMA50 AND SMA50 > SMA200 AND RSI < 65 (not overbought) |
| Exit | Price drops below SMA50 for 3 consecutive days |
| Stop loss | 10% |
| Take profit | None — hold for income + capital gain |
| Commission | 0.15% per leg |

---

**S14 · SMA Trend Setup (screener as strategy)** `sma_trend_setup`
> Rationale: The 5-condition screener we built — now run as a backtest strategy.
> Conditions: SMA150>EMA220, Price>SMA50, SMA50>SMA160, Price>1.25×52wLow, touched EMA220 in 90d.
> This is a high-conviction setup that requires many conditions to align simultaneously.

| Field | Value |
|---|---|
| Universe | ALL stocks |
| Max positions | 5 |
| Selection | history.length ≥ 220 (needs EMA220) |
| Entry | All 5 SMA Trend Setup conditions true on the same day |
| Exit | SMA50 falls below SMA160 (condition 3 violated) |
| Stop loss | 10% |
| Take profit | None |
| Commission | 0.15% per leg |

---

#### CATEGORY E — Market Timing / Regime

---

**S15 · SET Index Market Timer** `set_market_timer`
> Rationale: The most powerful filter found in the data: 64.3% of days were in downtrend.
> This strategy does nothing except act as a regime gate: it wraps ANY other strategy
> and blocks all entries when the SET composite index is below its own EMA200.
> Implement as a boolean helper `isMarketInUptrend(date)` that all strategies can optionally use.
> Standalone: holds cash when SET below EMA200, switches to equal-weight SET100 top-20 by ROE when above.

| Field | Value |
|---|---|
| Universe | SET100 |
| Max positions | 20 |
| Selection | SET index close > SET index EMA200 (market regime is bullish) |
| Entry | Price > EMA50 AND RSI < 65 (buy quality in bulk when market cooperates) |
| Exit | SET index drops below its EMA200 (exit ALL positions) OR individual price < EMA50 |
| Stop loss | 12% (wider because market filter does the heavy lifting) |
| Take profit | None |
| Commission | 0.15% per leg |

---

**S16 · Bollinger Band Squeeze Breakout** `boll_squeeze`
> Rationale: Periods of low volatility (narrow Bollinger Bands) are consistently followed
> by large directional moves. The squeeze signals energy building; the breakout direction
> shows which way it releases. 2.1% daily vol makes these squeezes meaningful.

| Field | Value |
|---|---|
| Universe | ALL stocks |
| Max positions | 5 |
| Selection | Price > EMA200 |
| Entry signal | Bollinger Band width (upper − lower) is at its lowest in 20 days (squeeze) AND price closes above upper band (breakout direction confirmed) |
| Exit | Price closes below SMA20 (middle band) for 2 consecutive days |
| Stop loss | 8% |
| Take profit | None |
| Commission | 0.15% per leg |

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
