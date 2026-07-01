import { ALL_STOCKS_MAP } from './indices.js'
import { getStockHistory as getRealHistory, loadAllHistory, isHistoryLoaded } from './realPriceHistory.js'

export { loadAllHistory, isHistoryLoaded }

/**
 * Mulberry32 seeded PRNG — deterministic, fast, good distribution.
 * Math.random() is BANNED in this file.
 * @param {number} seed
 * @returns {() => number} function returning [0, 1)
 */
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

/** @param {string} str @returns {number} */
function hashStr(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** @param {string} dateStr @returns {Date} */
function parseDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

const MS_PER_DAY = 86_400_000

/**
 * @typedef {Object} Candle
 * @property {string} time  - YYYY-MM-DD
 * @property {number} open
 * @property {number} high
 * @property {number} low
 * @property {number} close
 * @property {number} volume
 */

const SECTOR_VOLATILITY = {
  'Energy':         0.022,
  'Banking':        0.017,
  'Property':       0.025,
  'Telecom':        0.015,
  'Consumer':       0.018,
  'Healthcare':     0.016,
  'Industry':       0.020,
  'Food & Agri':    0.020,
  'Transport':      0.022,
  'Tech / Media':   0.025,
  'Financials':     0.020,
}

/**
 * Returns "YYYY-MM-DD" from a Date (UTC)
 * @param {Date} d
 * @returns {string}
 */
function toDateStr(d) {
  return d.toISOString().slice(0, 10)
}

/**
 * Returns true for weekday (Mon–Fri)
 * @param {Date} d
 * @returns {boolean}
 */
function isWeekday(d) {
  const dow = d.getUTCDay()
  return dow !== 0 && dow !== 6
}

/**
 * Generate realistic daily OHLCV from ipoDate to today.
 * Uses a seeded geometric Brownian motion walk.
 * @param {string} ticker
 * @param {string} ipoDate - YYYY-MM-DD
 * @param {number} ipoPrice - THB
 * @param {number} volatility - daily vol, e.g. 0.022
 * @returns {Candle[]}
 */
export function generateOHLCV(ticker, ipoDate, ipoPrice, volatility) {
  const rng = mulberry32(hashStr(ticker))
  const candles = []

  const today = new Date()
  const todayStr = toDateStr(today)

  let price = ipoPrice
  const drift = 0.00015 // slight positive drift ~4% annual

  const start = parseDate(ipoDate)
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))

  const current = new Date(start.getTime())

  while (current.getTime() <= end.getTime()) {
    if (isWeekday(current)) {
      const dateStr = toDateStr(current)

      // Box-Muller for normal random from uniform
      const u1 = rng()
      const u2 = rng()
      const z = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2)

      const logReturn = drift + volatility * z
      const closePrice = Math.max(price * Math.exp(logReturn), 0.01)

      // Intraday range simulation
      const rangeMult = 0.005 + rng() * volatility * 2
      const open = price * (1 + (rng() - 0.5) * rangeMult)
      const high = Math.max(open, closePrice) * (1 + rng() * rangeMult * 0.5)
      const low = Math.min(open, closePrice) * (1 - rng() * rangeMult * 0.5)

      // Volume: base + noise, higher on big moves
      const absMoveRatio = Math.abs(logReturn) / volatility
      const baseVolume = ipoPrice < 5 ? 50_000_000 : ipoPrice < 20 ? 8_000_000 : ipoPrice < 100 ? 3_000_000 : 500_000
      const volume = Math.floor(baseVolume * (0.5 + rng() * 1.5) * (1 + absMoveRatio))

      candles.push({
        time: dateStr,
        open: +open.toFixed(2),
        high: +high.toFixed(2),
        low: +low.toFixed(2),
        close: +closePrice.toFixed(2),
        volume,
      })

      price = closePrice
    }
    current.setUTCDate(current.getUTCDate() + 1)
  }

  return candles
}

/** @type {Map<string, Candle[]>} */
const _cache = new Map()

/**
 * Returns cached OHLCV history for a ticker (generated on first call).
 * @param {string} ticker
 * @returns {Candle[]}
 */
export function getStockHistory(ticker) {
  if (_cache.has(ticker)) return _cache.get(ticker)

  // Real data takes priority; PRNG fallback for tickers not in Yahoo Finance
  const real = getRealHistory(ticker)
  if (real.length > 0) {
    _cache.set(ticker, real)
    return real
  }

  const stock = ALL_STOCKS_MAP[ticker]
  if (!stock) return []

  const vol = stock.volatility ?? SECTOR_VOLATILITY[stock.sector] ?? 0.020
  const candles = generateOHLCV(stock.ticker, stock.ipoDate, stock.ipoPrice, vol)
  _cache.set(ticker, candles)
  return candles
}

/**
 * Slice history to a timeframe window.
 * @param {Candle[]} history
 * @param {'1D'|'1W'|'1M'|'1Y'|'ALL'} timeframe
 * @returns {Candle[]}
 */
export function sliceByTimeframe(history, timeframe) {
  if (!history.length || timeframe === 'ALL') return history
  const last = history[history.length - 1]
  const endDate = parseDate(last.time)
  let startDate = new Date(endDate.getTime())

  switch (timeframe) {
    case '1D': startDate.setUTCDate(endDate.getUTCDate() - 1); break
    case '1W': startDate.setUTCDate(endDate.getUTCDate() - 7); break
    case '1M': startDate.setUTCMonth(endDate.getUTCMonth() - 1); break
    case '1Y': startDate.setUTCFullYear(endDate.getUTCFullYear() - 1); break
    default: return history
  }

  const cutoff = toDateStr(startDate)
  return history.filter(c => c.time >= cutoff)
}

/**
 * SET Index baseline series: realistic range 1,200–1,700 (2010–present).
 * Generated once with a fixed seed.
 */
export const SET_INDEX_HISTORY = (() => {
  const rng = mulberry32(hashStr('SET_INDEX_2010'))
  const candles = []
  const start = parseDate('2010-01-04')
  const end = new Date()
  const current = new Date(start.getTime())

  let price = 700 // Jan 2010 level

  while (current.getTime() <= end.getTime()) {
    if (isWeekday(current)) {
      const u1 = rng()
      const u2 = rng()
      const z = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2)
      const logReturn = 0.00012 + 0.010 * z
      price = Math.max(price * Math.exp(logReturn), 100)

      const open = price * (1 + (rng() - 0.5) * 0.004)
      const high = Math.max(open, price) * (1 + rng() * 0.003)
      const low = Math.min(open, price) * (1 - rng() * 0.003)

      candles.push({
        time: toDateStr(current),
        open: +open.toFixed(2),
        high: +high.toFixed(2),
        low: +low.toFixed(2),
        close: +price.toFixed(2),
        volume: Math.floor(15_000_000 + rng() * 10_000_000),
      })
    }
    current.setUTCDate(current.getUTCDate() + 1)
  }
  return candles
})()

/** @type {Map<string, Candle[]>} */
const _setIndexByTime = new Map(SET_INDEX_HISTORY.map(c => [c.time, c]))

/**
 * Returns SET Index close for a given date string, or null if not found.
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {number|null}
 */
export function getSetIndexClose(dateStr) {
  return _setIndexByTime.get(dateStr)?.close ?? null
}

/**
 * Returns the close price of a stock at a given date (or nearest available before).
 * Used for Trend Horizon calculations.
 * @param {string} ticker
 * @param {string} targetDate - YYYY-MM-DD
 * @returns {number|null}
 */
export function getPriceAtDate(ticker, targetDate) {
  const history = getStockHistory(ticker)
  if (!history.length) return null
  // Walk backwards from targetDate to find closest candle
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].time <= targetDate) return history[i].close
  }
  return history[0].close
}
