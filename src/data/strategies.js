/**
 * Strategy library — 16 strategies across 5 categories.
 *
 * Each strategy is a plain JS object (no React, no side effects).
 *
 * ctx shape passed to every criteria function:
 *   {
 *     stock,       // Stock object (with growth metrics merged in)
 *     history,     // full OHLCV array for this stock
 *     closes,      // number[] — close prices aligned with history
 *     indicators,  // { sma20, sma50, sma150, sma160, sma200, ema20, ema50, ema200, ema220,
 *                  //   boll, rsi14, macd, vol20 }
 *     i,           // current index in history
 *     date,        // 'YYYY-MM-DD'
 *     setIndex,    // { history, closes, ema200, dateIndex } — SET index data
 *   }
 *
 * exitCriteria also receives `pos` as a second argument:
 *   pos.customState — plain object strategies may write to for per-position state
 *                     (e.g. trailing peak price for S8)
 *
 * marketCap unit: THB billions  (PTT = 1,224 ≈ 1.2T THB)
 * fcf unit:       THB billions  (positive = positive free cash flow)
 * roe:            percent       (e.g. 15 = 15%)
 * de:             ratio         (e.g. 1.2 = D/E of 1.2)
 * dividendYield:  percent       (e.g. 4.5 = 4.5%)
 * payoutRatio:    percent       (e.g. 60 = 60%)
 * pe:             raw ratio     (e.g. 12 = P/E of 12)
 */

/**
 * @typedef {{
 *   id: string,
 *   label: string,
 *   description: string,
 *   universe: 'ALL' | 'SET100' | 'SSET' | 'MAI',
 *   maxPositions: number,
 *   stopLossPct: number | null,
 *   takeProfitPct: number | null,
 *   commissionPct: number,
 *   selectionCriteria: (ctx: object) => boolean,
 *   entryCriteria: (ctx: object) => boolean,
 *   exitCriteria: (ctx: object, pos: object) => boolean,
 * }} StrategyDef
 */

// ── CATEGORY A — Trend Following ──────────────────────────────────────────────

/** S1 · Golden Cross + Quality Filter */
const GOLDEN_CROSS_QUALITY = {
  id:          'golden_cross_quality',
  label:       'S1 · Golden Cross + Quality',
  description: 'SMA50/SMA200 golden cross filtered by fundamental quality (ROE, FCF, market cap). Avoids catastrophic losers by requiring positive free cash flow.',
  universe:    'ALL',
  maxPositions:  5,
  stopLossPct:   0.10,
  takeProfitPct: null,
  commissionPct: 0.0015,

  selectionCriteria({ stock }) {
    return stock.roe > 10 && stock.fcf > 0 && stock.marketCap > 5
  },

  entryCriteria({ indicators, i }) {
    if (i < 1) return false
    const { sma50, sma200 } = indicators
    if (sma50[i] === null || sma200[i] === null) return false
    if (sma50[i - 1] === null || sma200[i - 1] === null) return false
    // Golden cross: SMA50 crosses above SMA200
    return sma50[i] > sma200[i] && sma50[i - 1] <= sma200[i - 1]
  },

  exitCriteria({ indicators, closes, i }) {
    if (i < 1) return false
    const { sma50, sma200 } = indicators
    if (sma50[i] === null || sma200[i] === null) return false
    // Death cross
    const deathCross = sma50[i] < sma200[i] &&
      sma50[i - 1] !== null && sma200[i - 1] !== null &&
      sma50[i - 1] >= sma200[i - 1]
    // Price breaks below SMA200
    const belowSMA200 = closes[i] < sma200[i]
    return deathCross || belowSMA200
  },
}

// ─────────────────────────────────────────────────────────────────────────────

/** S2 · EMA Ribbon Alignment */
const EMA_RIBBON = {
  id:          'ema_ribbon',
  label:       'S2 · EMA Ribbon Alignment',
  description: 'Requires EMA20 > EMA50 > EMA200 all aligned bullishly with price above EMA20. RSI 45–65 prevents chasing overbought rallies.',
  universe:    'ALL',
  maxPositions:  5,
  stopLossPct:   0.08,
  takeProfitPct: null,
  commissionPct: 0.0015,

  selectionCriteria() { return true },

  entryCriteria({ indicators, closes, i }) {
    const { ema20, ema50, ema200, rsi14 } = indicators
    if (ema20[i] === null || ema50[i] === null || ema200[i] === null || rsi14[i] === null) return false
    return (
      ema20[i] > ema50[i] &&
      ema50[i] > ema200[i] &&
      closes[i] > ema20[i] &&
      rsi14[i] >= 45 && rsi14[i] <= 65
    )
  },

  exitCriteria({ indicators, i }) {
    if (i < 1) return false
    const { ema20, ema50 } = indicators
    if (ema20[i] === null || ema50[i] === null) return false
    if (ema20[i - 1] === null || ema50[i - 1] === null) return false
    // EMA20 crosses below EMA50
    return ema20[i] < ema50[i] && ema20[i - 1] >= ema50[i - 1]
  },
}

// ─────────────────────────────────────────────────────────────────────────────

/** S3 · EMA200 Reclaim */
const EMA200_RECLAIM = {
  id:          'ema200_reclaim',
  label:       'S3 · EMA200 Reclaim',
  description: 'Price dips below EMA200 for 3+ days then closes back above — captures trend resumption after a correction.',
  universe:    'ALL',
  maxPositions:  5,
  stopLossPct:   0.08,
  takeProfitPct: null,
  commissionPct: 0.0015,

  selectionCriteria() { return true },

  entryCriteria({ indicators, closes, i }) {
    if (i < 3) return false
    const { ema200 } = indicators
    if (ema200[i] === null || ema200[i - 1] === null || ema200[i - 2] === null || ema200[i - 3] === null) return false
    // Price closes above EMA200 today after being below it for 3+ consecutive days
    return (
      closes[i]     > ema200[i]     &&
      closes[i - 1] < ema200[i - 1] &&
      closes[i - 2] < ema200[i - 2] &&
      closes[i - 3] < ema200[i - 3]
    )
  },

  exitCriteria({ indicators, closes, i }) {
    if (i < 2) return false
    const { ema200 } = indicators
    if (ema200[i] === null || ema200[i - 1] === null) return false
    // Close below EMA200 for 2 consecutive days
    return closes[i] < ema200[i] && closes[i - 1] < ema200[i - 1]
  },
}

// ─────────────────────────────────────────────────────────────────────────────

/** S4 · MACD Crossover + Volume Confirmation */
const MACD_VOLUME = {
  id:          'macd_volume',
  label:       'S4 · MACD + Volume Spike',
  description: 'MACD bullish crossover confirmed by volume > 1.5× 20-day average. Only in stocks already above EMA200.',
  universe:    'ALL',
  maxPositions:  5,
  stopLossPct:   0.08,
  takeProfitPct: null,
  commissionPct: 0.0015,

  selectionCriteria({ indicators, closes, i }) {
    const { ema200 } = indicators
    return ema200[i] !== null && closes[i] > ema200[i]
  },

  entryCriteria({ indicators, history, i }) {
    if (i < 1) return false
    const { macd, vol20 } = indicators
    if (!macd[i] || !macd[i - 1] || vol20[i] === null) return false
    const macdCross = macd[i].macd > macd[i].signal && macd[i - 1].macd <= macd[i - 1].signal
    const volSpike  = history[i].volume > vol20[i] * 1.5
    return macdCross && volSpike
  },

  exitCriteria({ indicators, i }) {
    if (i < 1) return false
    const { macd } = indicators
    if (!macd[i] || !macd[i - 1]) return false
    // MACD crosses below signal
    return macd[i].macd < macd[i].signal && macd[i - 1].macd >= macd[i - 1].signal
  },
}

// ── CATEGORY B — Mean Reversion ───────────────────────────────────────────────

/** S5 · Bollinger Band Quality Bounce */
const BOLL_QUALITY_BOUNCE = {
  id:          'boll_quality_bounce',
  label:       'S5 · Bollinger Quality Bounce',
  description: 'Price touches lower Bollinger Band + RSI < 40, but only in quality stocks (ROE > 10%, FCF positive) above EMA200. Best raw signal from data analysis (59.6% win rate).',
  universe:    'ALL',
  maxPositions:  8,
  stopLossPct:   0.08,
  takeProfitPct: null,
  commissionPct: 0.0015,

  selectionCriteria({ stock, indicators, closes, i }) {
    const { ema200 } = indicators
    return stock.roe > 10 && stock.fcf > 0 && ema200[i] !== null && closes[i] > ema200[i]
  },

  entryCriteria({ indicators, closes, i }) {
    const { boll, rsi14 } = indicators
    if (!boll[i] || rsi14[i] === null) return false
    return closes[i] <= boll[i].lower && rsi14[i] < 40
  },

  exitCriteria({ indicators, closes, i }) {
    const { boll, rsi14 } = indicators
    if (!boll[i] || rsi14[i] === null) return false
    // Exit when price reaches middle band OR RSI recovers above 60
    return closes[i] >= boll[i].mid || rsi14[i] > 60
  },
}

// ─────────────────────────────────────────────────────────────────────────────

/** S6 · RSI Double-Dip Recovery */
const RSI_DOUBLE_DIP = {
  id:          'rsi_double_dip',
  label:       'S6 · RSI Double-Dip Recovery',
  description: 'RSI makes two lows below 40, with the second being higher (bullish divergence). Only in stocks above SMA200.',
  universe:    'ALL',
  maxPositions:  5,
  stopLossPct:   0.08,
  takeProfitPct: 0.15,
  commissionPct: 0.0015,

  selectionCriteria({ indicators, closes, i }) {
    const { sma200 } = indicators
    return sma200[i] !== null && closes[i] > sma200[i]
  },

  entryCriteria({ indicators, i }) {
    const { rsi14 } = indicators
    if (rsi14[i] === null || i < 2) return false
    // Current bar must cross above 40 from below
    if (rsi14[i] < 40) return false
    if (rsi14[i - 1] === null || rsi14[i - 1] >= 40) return false

    // State machine: scan back up to 20 bars for first-dip → recovery → second-dip (higher low)
    const lookStart = Math.max(0, i - 20)
    let phase        = 'seeking_first'
    let firstDipMin  = null
    let secondDipMin = null

    for (let j = lookStart; j <= i - 1; j++) {
      const r = rsi14[j]
      if (r === null) continue

      if (phase === 'seeking_first') {
        if (r < 40) { firstDipMin = r; phase = 'in_first' }
      } else if (phase === 'in_first') {
        if (r < 40) { if (r < firstDipMin) firstDipMin = r }
        else phase = 'recovered'
      } else if (phase === 'recovered') {
        if (r < 40) { secondDipMin = r; phase = 'in_second' }
      } else if (phase === 'in_second') {
        if (r < 40) { if (r < secondDipMin) secondDipMin = r }
        // stay in second dip
      }
    }

    return firstDipMin !== null && secondDipMin !== null && secondDipMin > firstDipMin
  },

  exitCriteria({ indicators, closes, i }) {
    const { rsi14, sma200 } = indicators
    if (rsi14[i] === null) return false
    return rsi14[i] > 65 || (sma200[i] !== null && closes[i] < sma200[i])
  },
}

// ─────────────────────────────────────────────────────────────────────────────

/** S7 · Pullback to Rising SMA50 */
const SMA50_PULLBACK = {
  id:          'sma50_pullback',
  label:       'S7 · Pullback to Rising SMA50',
  description: 'In uptrending stocks (SMA50 > SMA200), buy pullbacks to rising SMA50 with RSI 40–55.',
  universe:    'ALL',
  maxPositions:  5,
  stopLossPct:   0.06,
  takeProfitPct: 0.15,
  commissionPct: 0.0015,

  selectionCriteria({ indicators, i }) {
    if (i < 10) return false
    const { sma50, sma200 } = indicators
    if (sma50[i] === null || sma200[i] === null || sma50[i - 10] === null) return false
    // SMA50 above SMA200 and rising
    return sma50[i] > sma200[i] && sma50[i] > sma50[i - 10]
  },

  entryCriteria({ indicators, closes, i }) {
    const { sma50, rsi14 } = indicators
    if (sma50[i] === null || rsi14[i] === null) return false
    const pctAboveSma50 = (closes[i] - sma50[i]) / sma50[i]
    // Price within 0–2% above SMA50 (pullback zone), RSI 40–55
    return pctAboveSma50 >= 0 && pctAboveSma50 <= 0.02 && rsi14[i] >= 40 && rsi14[i] <= 55
  },

  exitCriteria({ indicators, i }) {
    const { sma50, sma200 } = indicators
    if (sma50[i] === null || sma200[i] === null) return false
    return sma50[i] < sma200[i]
  },
}

// ── CATEGORY C — Momentum ─────────────────────────────────────────────────────

/** S8 · 52-Week High Breakout + Market Filter */
const HIGH52W_BREAKOUT = {
  id:          'high52w_breakout',
  label:       'S8 · 52-Week High Breakout',
  description: 'New 52-week closing high, only when the SET index itself is above its EMA200. Trailing exit from peak close.',
  universe:    'SET100',
  maxPositions:  5,
  stopLossPct:   0.08,
  takeProfitPct: null,
  commissionPct: 0.0015,

  selectionCriteria({ setIndex, date }) {
    const idx = setIndex.dateIndex.get(date)
    if (idx === undefined) return false
    const setEma200 = setIndex.ema200[idx]
    return setEma200 !== null && setIndex.closes[idx] > setEma200
  },

  entryCriteria({ closes, i }) {
    if (i < 252) return false
    // New 52-week closing high (close > every close in the prior 252 days)
    const high52w = Math.max(...closes.slice(i - 252, i))
    return closes[i] > high52w
  },

  exitCriteria({ closes, indicators, i }, pos) {
    // Update trailing peak since entry
    if (!pos.customState.peakClose) pos.customState.peakClose = pos.buyPrice
    if (closes[i] > pos.customState.peakClose) pos.customState.peakClose = closes[i]

    // Trailing stop: 12% below peak close
    if (closes[i] < pos.customState.peakClose * 0.88) return true
    // Also exit if price falls below SMA50
    const { sma50 } = indicators
    return sma50[i] !== null && closes[i] < sma50[i]
  },
}

// ─────────────────────────────────────────────────────────────────────────────

/** S9 · Relative Strength vs SET Index */
const RELATIVE_STRENGTH = {
  id:          'relative_strength',
  label:       'S9 · Relative Strength vs SET',
  description: 'Buy stocks outperforming the SET index by 10%+ over 3 months. Entry when stock makes a new 1-month high.',
  universe:    'ALL',
  maxPositions:  5,
  stopLossPct:   0.10,
  takeProfitPct: null,
  commissionPct: 0.0015,

  selectionCriteria({ closes, i, setIndex, date }) {
    if (i < 63) return false
    const setIdx = setIndex.dateIndex.get(date)
    if (setIdx === undefined || setIdx < 63) return false
    const stockReturn3m = (closes[i] - closes[i - 63]) / closes[i - 63] * 100
    const setReturn3m   = (setIndex.closes[setIdx] - setIndex.closes[setIdx - 63]) / setIndex.closes[setIdx - 63] * 100
    // Stock outperforms SET by 10+ percentage points over 3 months
    return stockReturn3m > setReturn3m + 10
  },

  entryCriteria({ closes, i }) {
    if (i < 21) return false
    // New 1-month closing high
    const high1m = Math.max(...closes.slice(i - 21, i))
    return closes[i] > high1m
  },

  exitCriteria({ closes, i, setIndex, date }) {
    if (i < 21) return false
    const setIdx = setIndex.dateIndex.get(date)
    if (setIdx === undefined || setIdx < 21) return false
    const stockReturn1m = (closes[i] - closes[i - 21]) / closes[i - 21] * 100
    const setReturn1m   = (setIndex.closes[setIdx] - setIndex.closes[setIdx - 21]) / setIndex.closes[setIdx - 21] * 100
    // Exit when stock's 1-month return drops below SET's 1-month return (underperformance)
    return stockReturn1m < setReturn1m
  },
}

// ─────────────────────────────────────────────────────────────────────────────

/** S10 · MACD Histogram Momentum Shift */
const MACD_HISTOGRAM_REVERSAL = {
  id:          'macd_histogram_reversal',
  label:       'S10 · MACD Histogram Reversal',
  description: 'MACD histogram turns positive after 5+ consecutive negative bars — earliest measurable momentum reversal signal.',
  universe:    'ALL',
  maxPositions:  6,
  stopLossPct:   0.07,
  takeProfitPct: null,
  commissionPct: 0.0015,

  selectionCriteria({ indicators, closes, i }) {
    const { ema200 } = indicators
    return ema200[i] !== null && closes[i] > ema200[i]
  },

  entryCriteria({ indicators, i }) {
    if (i < 6) return false
    const { macd } = indicators
    if (!macd[i] || !macd[i - 1]) return false
    // First positive histogram bar after being negative
    if (macd[i].hist <= 0 || macd[i - 1].hist >= 0) return false
    // Must have had 5+ consecutive negative bars
    let negCount = 0
    for (let j = i - 1; j >= Math.max(0, i - 20); j--) {
      if (!macd[j] || macd[j].hist >= 0) break
      negCount++
    }
    return negCount >= 5
  },

  exitCriteria({ indicators, i }) {
    if (i < 1) return false
    const { macd } = indicators
    if (!macd[i] || !macd[i - 1]) return false
    // Histogram turns negative again
    return macd[i].hist < 0 && macd[i - 1].hist >= 0
  },
}

// ── CATEGORY D — Hybrid Technical + Fundamental ───────────────────────────────

/** S11 · Quality Uptrend (Minervini-Style) */
const QUALITY_UPTREND = {
  id:          'quality_uptrend',
  label:       'S11 · Quality Uptrend (SEPA)',
  description: 'Minervini SEPA criteria adapted for Thai market: high-quality companies (ROE > 15%, FCF positive, D/E < 1.5) in confirmed price uptrends.',
  universe:    'ALL',
  maxPositions:  5,
  stopLossPct:   0.08,
  takeProfitPct: null,
  commissionPct: 0.0015,

  selectionCriteria({ stock }) {
    return stock.roe > 15 && stock.fcf > 0 && stock.de != null && stock.de < 1.5 && stock.marketCap > 10
  },

  entryCriteria({ indicators, closes, i }) {
    if (i < 21) return false
    const { ema200, sma50, sma200 } = indicators
    if (ema200[i] === null || sma50[i] === null || sma200[i] === null) return false
    // Price above EMA200 and SMA50 above SMA200
    if (closes[i] <= ema200[i] || sma50[i] <= sma200[i]) return false
    // New 1-month closing high (momentum entry trigger)
    const high1m = Math.max(...closes.slice(i - 21, i))
    return closes[i] > high1m
  },

  exitCriteria({ indicators, closes, i }) {
    if (i < 1) return false
    const { ema200, sma50, sma200 } = indicators
    if (ema200[i] === null || sma50[i] === null || sma200[i] === null) return false
    const belowEMA200  = closes[i] < ema200[i]
    const deathCross   = sma50[i] < sma200[i] &&
      sma50[i - 1] !== null && sma200[i - 1] !== null &&
      sma50[i - 1] >= sma200[i - 1]
    return belowEMA200 || deathCross
  },
}

// ─────────────────────────────────────────────────────────────────────────────

/** S12 · Value Breakout */
const VALUE_BREAKOUT = {
  id:          'value_breakout',
  label:       'S12 · Value Breakout',
  description: 'Fundamentally cheap stocks (P/E 1–12, FCF positive, D/E < 1) that break out above their 3-month high — market re-rating the value.',
  universe:    'ALL',
  maxPositions:  5,
  stopLossPct:   0.10,
  takeProfitPct: 0.25,
  commissionPct: 0.0015,

  selectionCriteria({ stock }) {
    return stock.pe > 0 && stock.pe <= 12 && stock.fcf > 0 && stock.de != null && stock.de < 1.0
  },

  entryCriteria({ closes, i }) {
    if (i < 63) return false
    // Break above 3-month (63 trading day) closing high
    const high3m = Math.max(...closes.slice(i - 63, i))
    return closes[i] > high3m
  },

  exitCriteria({ indicators, closes, i }) {
    const { sma50 } = indicators
    return sma50[i] !== null && closes[i] < sma50[i]
  },
}

// ─────────────────────────────────────────────────────────────────────────────

/** S13 · Dividend Defensive Uptrend */
const DIVIDEND_UPTREND = {
  id:          'dividend_uptrend',
  label:       'S13 · Dividend Defensive Uptrend',
  description: 'High-yield dividend stocks (yield > 3.5%, payout < 70%, FCF positive) held only while the trend is healthy.',
  universe:    'ALL',
  maxPositions:  6,
  stopLossPct:   0.10,
  takeProfitPct: null,
  commissionPct: 0.0015,

  selectionCriteria({ stock }) {
    return (
      stock.dividendYield > 3.5 &&
      stock.payoutRatio != null && stock.payoutRatio < 70 &&
      stock.fcf > 0
    )
  },

  entryCriteria({ indicators, closes, i }) {
    const { sma50, sma200, rsi14 } = indicators
    if (sma50[i] === null || sma200[i] === null || rsi14[i] === null) return false
    return closes[i] > sma50[i] && sma50[i] > sma200[i] && rsi14[i] < 65
  },

  exitCriteria({ indicators, closes, i }) {
    if (i < 3) return false
    const { sma50 } = indicators
    if (sma50[i] === null || sma50[i - 1] === null || sma50[i - 2] === null) return false
    // Three consecutive closes below SMA50
    return closes[i] < sma50[i] && closes[i - 1] < sma50[i - 1] && closes[i - 2] < sma50[i - 2]
  },
}

// ─────────────────────────────────────────────────────────────────────────────

/** S14 · SMA Trend Setup (screener-as-strategy) */
const SMA_TREND_SETUP = {
  id:          'sma_trend_setup',
  label:       'S14 · SMA Trend Setup',
  description: '5-condition Minervini-style setup: SMA150 > EMA220, Price > SMA50, SMA50 > SMA160, Price > 1.25× 52-week low, touched EMA220 within 90 days.',
  universe:    'ALL',
  maxPositions:  5,
  stopLossPct:   0.10,
  takeProfitPct: null,
  commissionPct: 0.0015,

  selectionCriteria({ history }) {
    return history.length >= 220
  },

  entryCriteria({ indicators, closes, i }) {
    if (i < 252) return false
    const { sma50, sma150, sma160, ema220 } = indicators
    if (sma50[i] === null || sma150[i] === null || sma160[i] === null || ema220[i] === null) return false

    // Condition 1: SMA150 > EMA220
    if (sma150[i] <= ema220[i]) return false
    // Condition 2: Price > SMA50
    if (closes[i] <= sma50[i]) return false
    // Condition 3: SMA50 > SMA160
    if (sma50[i] <= sma160[i]) return false
    // Condition 4: Price > 1.25× 52-week low
    const start52w = Math.max(0, i + 1 - 252)
    let low52w = Infinity
    for (let j = start52w; j <= i; j++) { if (closes[j] < low52w) low52w = closes[j] }
    if (closes[i] <= low52w * 1.25) return false
    // Condition 5: Price dipped below EMA220 at least once in past 90 trading days
    const start90 = Math.max(0, i + 1 - 90)
    for (let j = start90; j <= i; j++) {
      if (ema220[j] !== null && closes[j] < ema220[j]) return true
    }
    return false
  },

  exitCriteria({ indicators, i }) {
    const { sma50, sma160 } = indicators
    return sma50[i] !== null && sma160[i] !== null && sma50[i] < sma160[i]
  },
}

// ── CATEGORY E — Market Timing / Regime ──────────────────────────────────────

/** S15 · SET Index Market Timer */
const SET_MARKET_TIMER = {
  id:          'set_market_timer',
  label:       'S15 · SET Market Timer',
  description: 'Holds cash when SET index is below its EMA200 (64.3% of days were in downtrend). Buys quality SET100 stocks when market regime turns bullish.',
  universe:    'SET100',
  maxPositions:  20,
  stopLossPct:   0.12,
  takeProfitPct: null,
  commissionPct: 0.0015,

  selectionCriteria({ setIndex, date }) {
    const idx = setIndex.dateIndex.get(date)
    if (idx === undefined) return false
    const setEma200 = setIndex.ema200[idx]
    return setEma200 !== null && setIndex.closes[idx] > setEma200
  },

  entryCriteria({ indicators, closes, i }) {
    const { ema50, rsi14 } = indicators
    if (ema50[i] === null || rsi14[i] === null) return false
    return closes[i] > ema50[i] && rsi14[i] < 65
  },

  exitCriteria({ indicators, closes, i, setIndex, date }) {
    // Exit all if SET index drops below its EMA200
    const setIdx = setIndex.dateIndex.get(date)
    if (setIdx !== undefined) {
      const setEma200 = setIndex.ema200[setIdx]
      if (setEma200 !== null && setIndex.closes[setIdx] < setEma200) return true
    }
    // Or exit individual position if price falls below EMA50
    const { ema50 } = indicators
    return ema50[i] !== null && closes[i] < ema50[i]
  },
}

// ─────────────────────────────────────────────────────────────────────────────

/** S16 · Bollinger Band Squeeze Breakout */
const BOLL_SQUEEZE = {
  id:          'boll_squeeze',
  label:       'S16 · Bollinger Band Squeeze',
  description: 'Periods of low volatility (narrowest Bollinger Bands in 20 days) followed by a breakout above the upper band. Only in stocks above EMA200.',
  universe:    'ALL',
  maxPositions:  5,
  stopLossPct:   0.08,
  takeProfitPct: null,
  commissionPct: 0.0015,

  selectionCriteria({ indicators, closes, i }) {
    const { ema200 } = indicators
    return ema200[i] !== null && closes[i] > ema200[i]
  },

  entryCriteria({ indicators, closes, i }) {
    if (i < 20) return false
    const { boll } = indicators
    if (!boll[i]) return false
    // Price breaks above upper band
    if (closes[i] <= boll[i].upper) return false
    // Band width at 20-day low (squeeze)
    const currentWidth = boll[i].upper - boll[i].lower
    for (let j = i - 20; j < i; j++) {
      if (!boll[j]) continue
      if (boll[j].upper - boll[j].lower < currentWidth) return false
    }
    return true
  },

  exitCriteria({ indicators, closes, i }) {
    if (i < 2) return false
    const { boll } = indicators
    if (!boll[i] || !boll[i - 1]) return false
    // Close below middle band for 2 consecutive days
    return closes[i] < boll[i].mid && closes[i - 1] < boll[i - 1].mid
  },
}

// ── Export ────────────────────────────────────────────────────────────────────

/** @type {StrategyDef[]} */
export const STRATEGIES = [
  // A — Trend Following
  GOLDEN_CROSS_QUALITY,
  EMA_RIBBON,
  EMA200_RECLAIM,
  MACD_VOLUME,
  // B — Mean Reversion
  BOLL_QUALITY_BOUNCE,
  RSI_DOUBLE_DIP,
  SMA50_PULLBACK,
  // C — Momentum
  HIGH52W_BREAKOUT,
  RELATIVE_STRENGTH,
  MACD_HISTOGRAM_REVERSAL,
  // D — Hybrid Technical + Fundamental
  QUALITY_UPTREND,
  VALUE_BREAKOUT,
  DIVIDEND_UPTREND,
  SMA_TREND_SETUP,
  // E — Market Timing / Regime
  SET_MARKET_TIMER,
  BOLL_SQUEEZE,
]

export const STRATEGIES_MAP = Object.fromEntries(STRATEGIES.map(s => [s.id, s]))
