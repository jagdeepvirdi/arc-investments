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

## Deferred (Post-MVP)

- Real-time WebSocket price feed integration
- User watchlists (localStorage persistence)
- Portfolio tracker
- News feed panel per stock
- Export to CSV
- Thai language toggle
