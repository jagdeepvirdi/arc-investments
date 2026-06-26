/**
 * Core backtesting engine — pure function, no React imports, no side effects.
 * Runs entirely in-browser against existing real OHLCV history.
 *
 * Entry signals fire on day D and execute at day D+1 open to avoid look-ahead bias.
 * Indicators returning null (warm-up period) never trigger a trade.
 */
import { getStockHistory, SET_INDEX_HISTORY } from './mockPriceHistory.js'
import { calcSMA, calcEMA, calcBollingerBands, calcRSI, calcMACD } from './indicators.js'
import { getGrowthMetrics } from './growthMetrics.js'

// ── SET index pre-computation (shared across all backtest runs) ────────────────
const SET_CLOSES   = SET_INDEX_HISTORY.map(c => c.close)
const SET_EMA200   = calcEMA(SET_CLOSES, 200)
const SET_DATE_IDX = new Map(SET_INDEX_HISTORY.map((c, i) => [c.time, i]))

/**
 * Immutable SET index context passed inside every strategy ctx.
 * @type {{ history: object[], closes: number[], ema200: (number|null)[], dateIndex: Map<string,number> }}
 */
export const SET_INDEX_CTX = {
  history:   SET_INDEX_HISTORY,
  closes:    SET_CLOSES,
  ema200:    SET_EMA200,
  dateIndex: SET_DATE_IDX,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Pre-compute all indicator arrays for a single stock. */
function computeIndicators(closes, volumes) {
  return {
    sma20:  calcSMA(closes, 20),
    sma50:  calcSMA(closes, 50),
    sma150: calcSMA(closes, 150),
    sma160: calcSMA(closes, 160),
    sma200: calcSMA(closes, 200),
    ema20:  calcEMA(closes, 20),
    ema50:  calcEMA(closes, 50),
    ema200: calcEMA(closes, 200),
    ema220: calcEMA(closes, 220),
    boll:   calcBollingerBands(closes, 20, 2),
    rsi14:  calcRSI(closes, 14),
    macd:   calcMACD(closes, 12, 26, 9),
    vol20:  calcSMA(volumes, 20),  // 20-day avg volume for volume-spike detection
  }
}

/** Calendar days between two YYYY-MM-DD strings. */
function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86_400_000)
}

/** Largest peak-to-trough drawdown on the equity curve, as a percentage. */
function computeMaxDrawdown(curve) {
  let peak = 0
  let maxDD = 0
  for (const { value } of curve) {
    if (value > peak) peak = value
    if (peak > 0) {
      const dd = (peak - value) / peak
      if (dd > maxDD) maxDD = dd
    }
  }
  return +(maxDD * 100).toFixed(2)
}

// ── Engine ────────────────────────────────────────────────────────────────────

/**
 * Run a backtest for the given strategy over real OHLCV history.
 *
 * @param {{
 *   strategy: import('./strategies.js').StrategyDef,
 *   allStocks: object[],
 *   startDate: string,
 *   endDate: string|null,
 *   budget: number,
 *   maxPositionPct: number,  // 1-100 — max % of initial budget per single position (default 100)
 * }} params
 * @returns {BacktestResult}
 */
export function runBacktest({ strategy, allStocks, startDate, endDate, budget, maxPositionPct = 100 }) {
  const effectiveEnd = endDate ?? SET_INDEX_HISTORY.at(-1)?.time ?? startDate

  // ── Pre-compute per-stock data ──────────────────────────────────────────────
  const stockDataMap = {}
  for (const rawStock of allStocks) {
    if (strategy.universe !== 'ALL' && rawStock.sourceIndex !== strategy.universe) continue

    const history = getStockHistory(rawStock.ticker)
    if (!history.length) continue

    const closes  = history.map(c => c.close)
    const volumes = history.map(c => c.volume)
    // Merge growth metrics as fallback; real stock fields (from Yahoo) take priority
    const growth  = getGrowthMetrics(rawStock.ticker, rawStock.sector)

    stockDataMap[rawStock.ticker] = {
      stock:      { ...growth, ...rawStock },
      history,
      closes,
      volumes,
      indicators: computeIndicators(closes, volumes),
      dateIndex:  new Map(history.map((c, i) => [c.time, i])),
    }
  }

  // ── Build sorted union of all trading dates in [startDate, effectiveEnd] ───
  const dateSet = new Set()
  for (const { history } of Object.values(stockDataMap)) {
    for (const c of history) {
      if (c.time >= startDate && c.time <= effectiveEnd) dateSet.add(c.time)
    }
  }
  const allDates = [...dateSet].sort()

  // ── Simulation state ───────────────────────────────────────────────────────
  let cash = budget
  /** @type {Object.<string, {ticker,buyDate,buyPrice,quantity,stopPrice,targetPrice,customState}>} */
  const positions   = {}
  const trades      = []
  const equityCurve = []
  const pendingBuys = new Set()   // tickers: entry triggered, buying at next open

  for (const date of allDates) {

    // ── Execute pending buys at today's open ────────────────────────────────
    for (const ticker of [...pendingBuys]) {
      if (positions[ticker]) { pendingBuys.delete(ticker); continue }

      const sd  = stockDataMap[ticker]
      const idx = sd?.dateIndex.get(date)
      if (idx === undefined) continue  // no candle today — defer to next trading day

      const openCount = Object.keys(positions).length
      if (openCount >= strategy.maxPositions) { pendingBuys.delete(ticker); continue }

      const entryPrice = sd.history[idx].open
      if (!entryPrice || entryPrice <= 0) { pendingBuys.delete(ticker); continue }

      // Position sizing: equal share capped by maxPositionPct of initial budget
      const maxAlloc     = budget * (maxPositionPct / 100)
      const equalShare   = cash / (strategy.maxPositions - openCount)
      const positionSize = Math.min(equalShare, maxAlloc)
      const quantity     = Math.floor(positionSize / entryPrice)
      if (quantity <= 0) { pendingBuys.delete(ticker); continue }

      const cost = entryPrice * quantity * (1 + strategy.commissionPct)
      if (cost > cash) { pendingBuys.delete(ticker); continue }

      cash -= cost
      positions[ticker] = {
        ticker,
        buyDate:     date,
        buyPrice:    entryPrice,
        quantity,
        stopPrice:   strategy.stopLossPct   != null ? entryPrice * (1 - strategy.stopLossPct)   : null,
        targetPrice: strategy.takeProfitPct != null ? entryPrice * (1 + strategy.takeProfitPct) : null,
        customState: {},   // per-position scratchpad for trailing stops, etc.
      }
      pendingBuys.delete(ticker)
    }

    // ── Exit pass (check open positions before allowing new entries) ────────
    for (const [ticker, pos] of Object.entries(positions)) {
      const sd  = stockDataMap[ticker]
      const idx = sd?.dateIndex.get(date)
      if (idx === undefined) continue

      const candle = sd.history[idx]
      let exitPrice  = null
      let exitReason = null

      // Stop loss — if open gaps below stop, fill at open (realistic gap-down handling)
      if (pos.stopPrice != null) {
        if (candle.open <= pos.stopPrice) {
          exitPrice = candle.open; exitReason = 'stop_loss'
        } else if (candle.low <= pos.stopPrice) {
          exitPrice = pos.stopPrice; exitReason = 'stop_loss'
        }
      }

      // Take profit
      if (exitPrice === null && pos.targetPrice != null && candle.high >= pos.targetPrice) {
        exitPrice = pos.targetPrice; exitReason = 'take_profit'
      }

      // Strategy exit signal (only when neither stop nor target triggered)
      if (exitPrice === null) {
        const ctx = {
          stock: sd.stock, history: sd.history, closes: sd.closes,
          indicators: sd.indicators, i: idx, date, setIndex: SET_INDEX_CTX,
        }
        try {
          if (strategy.exitCriteria(ctx, pos)) {
            exitPrice = candle.close; exitReason = 'signal'
          }
        } catch (_) { /* skip malformed criteria */ }
      }

      if (exitPrice !== null) {
        const buyCost      = pos.buyPrice * pos.quantity * (1 + strategy.commissionPct)
        const sellProceeds = exitPrice    * pos.quantity * (1 - strategy.commissionPct)
        cash += sellProceeds
        trades.push({
          ticker,
          buyDate:    pos.buyDate,
          buyPrice:   pos.buyPrice,
          quantity:   pos.quantity,
          sellDate:   date,
          sellPrice:  +exitPrice.toFixed(2),
          pnl:        +(sellProceeds - buyCost).toFixed(2),
          pnlPct:     +((sellProceeds - buyCost) / buyCost * 100).toFixed(2),
          daysHeld:   daysBetween(pos.buyDate, date),
          exitReason,
        })
        delete positions[ticker]
      }
    }

    // ── Entry pass (signal fires today → buy at tomorrow's open) ───────────
    if (Object.keys(positions).length + pendingBuys.size < strategy.maxPositions && cash > 0) {
      for (const [ticker, sd] of Object.entries(stockDataMap)) {
        if (positions[ticker] || pendingBuys.has(ticker)) continue
        if (Object.keys(positions).length + pendingBuys.size >= strategy.maxPositions) break

        const idx = sd.dateIndex.get(date)
        if (idx === undefined) continue

        const ctx = {
          stock: sd.stock, history: sd.history, closes: sd.closes,
          indicators: sd.indicators, i: idx, date, setIndex: SET_INDEX_CTX,
        }
        try {
          if (strategy.selectionCriteria(ctx) && strategy.entryCriteria(ctx)) {
            pendingBuys.add(ticker)
          }
        } catch (_) { /* skip */ }
      }
    }

    // ── Daily equity snapshot ───────────────────────────────────────────────
    let portfolioValue = cash
    for (const [ticker, pos] of Object.entries(positions)) {
      const sd  = stockDataMap[ticker]
      const idx = sd?.dateIndex.get(date)
      portfolioValue += (idx !== undefined ? sd.history[idx].close : pos.buyPrice) * pos.quantity
    }
    equityCurve.push({ date, value: +portfolioValue.toFixed(2) })
  }

  // ── Force-close all open positions at end of data ─────────────────────────
  for (const [ticker, pos] of Object.entries(positions)) {
    const sd = stockDataMap[ticker]
    if (!sd?.history.length) continue
    const lastCandle   = sd.history.at(-1)
    const exitPrice    = lastCandle.close
    const buyCost      = pos.buyPrice * pos.quantity * (1 + strategy.commissionPct)
    const sellProceeds = exitPrice    * pos.quantity * (1 - strategy.commissionPct)
    cash += sellProceeds
    trades.push({
      ticker,
      buyDate:    pos.buyDate,
      buyPrice:   pos.buyPrice,
      quantity:   pos.quantity,
      sellDate:   lastCandle.time,
      sellPrice:  +exitPrice.toFixed(2),
      pnl:        +(sellProceeds - buyCost).toFixed(2),
      pnlPct:     +((sellProceeds - buyCost) / buyCost * 100).toFixed(2),
      daysHeld:   daysBetween(pos.buyDate, lastCandle.time),
      exitReason: 'end_of_data',
    })
    delete positions[ticker]
  }

  // ── Compute summary statistics ─────────────────────────────────────────────
  const winning  = trades.filter(t => t.pnl > 0)
  const byPnlPct = [...trades].sort((a, b) => a.pnlPct - b.pnlPct)
  const totalPnl = trades.reduce((s, t) => s + t.pnl, 0)

  return {
    strategyId:     strategy.id,
    runAt:          new Date().toISOString(),
    startDate,
    endDate:        effectiveEnd,
    initialBudget:  budget,
    maxPositionPct,
    finalValue:     +cash.toFixed(2),
    trades,
    summary: {
      totalTrades:   trades.length,
      winningTrades: winning.length,
      losingTrades:  trades.length - winning.length,
      winRate:       trades.length > 0
        ? +((winning.length / trades.length) * 100).toFixed(1)
        : 0,
      totalPnl:      +totalPnl.toFixed(2),
      totalPnlPct:   +((cash - budget) / budget * 100).toFixed(2),
      maxDrawdown:   computeMaxDrawdown(equityCurve),
      avgDaysHeld:   trades.length > 0
        ? Math.round(trades.reduce((s, t) => s + t.daysHeld, 0) / trades.length)
        : 0,
      bestTrade:     byPnlPct.at(-1) ?? null,
      worstTrade:    byPnlPct[0] ?? null,
      equityCurve,
    },
  }
}
