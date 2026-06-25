# CLAUDE.md — ArcInvestments

## Project Identity

**ArcInvestments** is a professional-grade SET 100 stock analysis dashboard for the Thai stock market. It is a frontend-only React application built on Vite + Tailwind CSS with a dark financial UI aesthetic. There is no backend — all data comes from a dedicated Mock Data Service layer designed for easy real API swap-in later.

---

## Architecture Principles

### Strict Separation of Concerns

```
src/
├── data/                    ← MOCK DATA LAYER (swap this for live API later)
│   ├── mockStocks.js        ← SET 100 stock list with metadata
│   ├── mockPriceHistory.js  ← OHLCV generator per stock + SET Index baseline
│   ├── indicators.js        ← Pure math: SMA, EMA, Bollinger, RSI, MACD
│   └── fundamentals.js      ← P/E, D/E, FCF, ROE, Dividend Yield, Sector Avg P/E
├── components/
│   ├── Dashboard/           ← Main SET 100 table view
│   ├── Terminal/            ← Full-screen stock detail view
│   ├── Charts/              ← Charting sub-components (candlestick, RSI, MACD)
│   └── UI/                  ← Shared primitives (Badge, Button, Dropdown, etc.)
├── hooks/                   ← useStockData, useIndicators, useFilter
├── store/                   ← Zustand or React Context for global state
└── App.jsx
```

### The Data Contract

Every component must consume data through the `data/` layer. No component should generate mock values inline. If you need a new data field, add it to the appropriate file in `data/` first, then consume it in the component.

When real APIs are available later, only `data/` files need to change.

---

## Stack

| Concern | Library |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Charting | `lightweight-charts` v4 (TradingView) |
| Icons | `lucide-react` |
| State | Zustand |
| Routing | React Router v6 |

---

## Design System

**Theme: Dark financial terminal**
- Background: `#0A0E17` (near-black navy)
- Surface: `#111827` (card backgrounds)
- Border: `#1F2937`
- Primary Accent: `#3B82F6` (electric blue — institutional feel)
- Bullish Green: `#10B981`
- Bearish Red: `#EF4444`
- Muted Text: `#6B7280`
- Body Text: `#D1D5DB`
- Headings: `#F9FAFB`
- Font: `Inter` (numbers: `JetBrains Mono` for price data)

No rounded-xl or card shadows unless subtle. Prefer clean grid lines and tight spacing. Financial terminals are dense, not airy.

---

## Component Contracts

### Dashboard Table

Required columns (in order): Ticker | Company Name | Current Price (THB) | Change % | Volume | P/E | Market Cap | Trend

**Trend column logic** respects the active "Trend Horizon" dropdown:
- `Since Launch`: compare Current Price vs IPO Price
- `5-Year`: compare Current Price vs price 5 years ago
- `1-Year`: compare Current Price vs price 1 year ago
- `YTD`: compare Current Price vs Jan 1 of current year

**Quick Scanner Tags** (filter chips above the table):
- `RSI Oversold (<30)` — filter where latest RSI14 < 30
- `RSI Overbought (>70)` — filter where latest RSI14 > 70
- `MACD Bullish Cross` — filter where MACD line crossed above Signal line in last 5 sessions

### Stock Terminal (Detail View)

Two-panel layout (can be tabs on mobile):

**Left/Top: Chart Panel**
- Candlestick chart (OHLCV) via `lightweight-charts`
- Volume bars below main chart
- Timeframe switcher: 1D | 1W | 1M | 1Y | ALL
- Toggleable overlays on price chart:
  - SMA 20 / SMA 50
  - EMA 20 / EMA 50
  - EMA 200 (ON by default — institutional benchmark)
  - Bollinger Bands (20, 2)
  - Support & Resistance horizontal lines
  - SET Index overlay line (faint, for relative strength)
- Sub-charts below:
  - RSI (14): line chart with 30/70 shaded zones
  - MACD: MACD line + Signal line + Histogram bars

**Right/Bottom: Fundamental Panel**
| Metric | Value | Context |
|---|---|---|
| P/E Ratio | stock value | vs Sector Avg P/E shown inline |
| D/E Ratio | stock value | |
| Free Cash Flow | stock value | |
| ROE | stock value | |
| Dividend Yield | stock value | |

---

## Indicator Math (in `data/indicators.js`)

All indicator functions must be pure — input array in, computed array out. No side effects.

```js
// Required exports
export function calcSMA(closes, period)       // → number[]
export function calcEMA(closes, period)       // → number[]
export function calcBollingerBands(closes, period, stdDev) // → { upper, mid, lower }[]
export function calcRSI(closes, period)       // → number[]
export function calcMACD(closes, fast, slow, signal) // → { macd, signal, hist }[]
export function calcSupportResistance(ohlcv)  // → { support: number[], resistance: number[] }
```

---

## Mock Data Requirements

### SET 100 Coverage

Include all 100 stocks with realistic Thai company data. Group into sectors:
- Energy (PTT, PTTEP, GULF, GPSC, BGRIM, BPP, RATCH, EGCO, IRPC, TOP, ESSO, SPRC)
- Banking (KBANK, SCB, BBL, KTB, TTB, TISCO, KKP, TCAP, BAY)
- Property (CPN, LH, SPALI, AP, QH, SC, ORI, NOBLE, ANAN, SIRI)
- Telecom (ADVANC, DTAC, TRUE, INTUCH)
- Consumer (CPALL, HMPRO, CRC, BJC, COM7, DOHOME, MAKRO)
- Healthcare (BDMS, BH, BCH, CHG, MEGA, VGI)
- Industry / Materials (SCC, SCCC, TPIPL, TASCO)
- Food & Agri (CPF, TU, GFPT, BTG, MINT, ERW, CENTEL)
- Transport (AOT, BEM, BTS, AAV, BA, NOK)
- Tech / Media (MAJOR, RS, WORK, JMART)
- Financials non-bank (MTC, SAWAD, AEONTS, ASK, GL)

Each stock must have:
- `ticker`, `name`, `sector`, `ipoDate`, `ipoPrice`
- `currentPrice`, `change`, `changePct`, `volume`, `marketCap`
- `pe`, `de`, `fcf`, `roe`, `dividendYield`
- `sectorAvgPE`
- Candlestick OHLCV history from IPO date to present (daily, generated realistically)

### Price History Generation Rules

Use seeded pseudo-random walks so results are deterministic (same data on every render). Base volatility on sector:
- Energy: high vol
- Banking: medium vol
- Property: medium-high vol
- Telecom: low-medium vol

Include a `SET_INDEX` baseline series used for the relative strength overlay.

---

## Code Style

- Functional components only, no class components
- TypeScript is optional but JSDoc comments on all data functions are required
- No `any` shortcuts in data layer
- Tailwind only — no inline styles, no external CSS files
- Component files under 300 lines; split if longer
- Named exports everywhere; only `App.jsx` uses default export
- All chart interactions must be keyboard accessible where possible

---

## Performance Targets

- Initial load: < 2s on average connection
- Table with 100 rows: smooth 60fps sort/filter
- Chart render on stock open: < 500ms
- No unnecessary re-renders — memoize computed indicator arrays

---

## File Naming Conventions

- Components: `PascalCase.jsx`
- Hooks: `useCamelCase.js`
- Data/utils: `camelCase.js`
- Constants: `UPPER_SNAKE_CASE` inside files

---

## What NOT to Do

- Do not hardcode prices or indicators inside components
- Do not use `Math.random()` without a seed (use seeded RNG for mock data)
- Do not use any charting library other than `lightweight-charts`
- Do not add a backend, Express server, or database — this is frontend-only
- Do not use CSS modules or styled-components — Tailwind only
- Do not create a separate page/route for each stock — use a modal or slide-in panel
