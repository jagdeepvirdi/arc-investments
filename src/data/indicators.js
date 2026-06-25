/**
 * Pure indicator math functions. Input array in, computed array out. No side effects.
 * Arrays are padded with null for the warm-up period so indices align with source data.
 */

/**
 * Simple Moving Average
 * @param {number[]} closes
 * @param {number} period
 * @returns {(number|null)[]}
 */
export function calcSMA(closes, period) {
  const result = new Array(closes.length).fill(null)
  for (let i = period - 1; i < closes.length; i++) {
    let sum = 0
    for (let j = i - period + 1; j <= i; j++) sum += closes[j]
    result[i] = sum / period
  }
  return result
}

/**
 * Exponential Moving Average
 * @param {number[]} closes
 * @param {number} period
 * @returns {(number|null)[]}
 */
export function calcEMA(closes, period) {
  const result = new Array(closes.length).fill(null)
  const k = 2 / (period + 1)

  // seed with SMA of first `period` values
  let sum = 0
  for (let i = 0; i < period; i++) sum += closes[i]
  result[period - 1] = sum / period

  for (let i = period; i < closes.length; i++) {
    result[i] = closes[i] * k + result[i - 1] * (1 - k)
  }
  return result
}

/**
 * Bollinger Bands
 * @param {number[]} closes
 * @param {number} period
 * @param {number} stdDev - multiplier (typically 2)
 * @returns {({upper: number, mid: number, lower: number}|null)[]}
 */
export function calcBollingerBands(closes, period, stdDev) {
  const result = new Array(closes.length).fill(null)
  for (let i = period - 1; i < closes.length; i++) {
    const slice = closes.slice(i - period + 1, i + 1)
    const mean = slice.reduce((a, b) => a + b, 0) / period
    const variance = slice.reduce((sum, v) => sum + (v - mean) ** 2, 0) / period
    const sd = Math.sqrt(variance)
    result[i] = {
      upper: mean + stdDev * sd,
      mid: mean,
      lower: mean - stdDev * sd,
    }
  }
  return result
}

/**
 * Relative Strength Index
 * @param {number[]} closes
 * @param {number} period
 * @returns {(number|null)[]}
 */
export function calcRSI(closes, period) {
  const result = new Array(closes.length).fill(null)
  if (closes.length < period + 1) return result

  const deltas = closes.slice(1).map((c, i) => c - closes[i])

  // seed with simple average of first period
  let avgGain = 0
  let avgLoss = 0
  for (let i = 0; i < period; i++) {
    if (deltas[i] >= 0) avgGain += deltas[i]
    else avgLoss += Math.abs(deltas[i])
  }
  avgGain /= period
  avgLoss /= period

  const rs0 = avgLoss === 0 ? Infinity : avgGain / avgLoss
  result[period] = 100 - 100 / (1 + rs0)

  for (let i = period + 1; i < closes.length; i++) {
    const delta = deltas[i - 1]
    const gain = delta >= 0 ? delta : 0
    const loss = delta < 0 ? Math.abs(delta) : 0
    // Wilder smoothing
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    const rs = avgLoss === 0 ? Infinity : avgGain / avgLoss
    result[i] = 100 - 100 / (1 + rs)
  }
  return result
}

/**
 * MACD
 * @param {number[]} closes
 * @param {number} fast
 * @param {number} slow
 * @param {number} signal
 * @returns {({macd: number, signal: number, hist: number}|null)[]}
 */
export function calcMACD(closes, fast, slow, signal) {
  const result = new Array(closes.length).fill(null)
  const emaFast = calcEMA(closes, fast)
  const emaSlow = calcEMA(closes, slow)

  const macdLine = closes.map((_, i) =>
    emaFast[i] !== null && emaSlow[i] !== null ? emaFast[i] - emaSlow[i] : null
  )

  // build signal EMA over the macd values (starting where macdLine is non-null)
  const firstValid = macdLine.findIndex(v => v !== null)
  if (firstValid === -1) return result

  const macdValues = macdLine.slice(firstValid)
  const sigEma = calcEMA(macdValues, signal)

  for (let i = 0; i < sigEma.length; i++) {
    const absIdx = firstValid + i
    if (sigEma[i] !== null && macdLine[absIdx] !== null) {
      result[absIdx] = {
        macd: macdLine[absIdx],
        signal: sigEma[i],
        hist: macdLine[absIdx] - sigEma[i],
      }
    }
  }
  return result
}

/**
 * Support and Resistance levels (pivot-based, simple swing detection)
 * @param {{high: number, low: number, close: number}[]} ohlcv
 * @returns {{support: number[], resistance: number[]}}
 */
export function calcSupportResistance(ohlcv) {
  const lookback = 10
  const support = []
  const resistance = []

  for (let i = lookback; i < ohlcv.length - lookback; i++) {
    const low = ohlcv[i].low
    const high = ohlcv[i].high

    const isSwingLow = ohlcv.slice(i - lookback, i + lookback + 1)
      .every((c, idx) => idx === lookback || c.low >= low)
    const isSwingHigh = ohlcv.slice(i - lookback, i + lookback + 1)
      .every((c, idx) => idx === lookback || c.high <= high)

    if (isSwingLow) support.push(low)
    if (isSwingHigh) resistance.push(high)
  }

  // deduplicate levels within 0.5% of each other
  const dedup = (levels) => {
    const sorted = [...levels].sort((a, b) => a - b)
    const out = []
    for (const lvl of sorted) {
      if (out.length === 0 || Math.abs(lvl - out[out.length - 1]) / out[out.length - 1] > 0.005) {
        out.push(lvl)
      }
    }
    return out.slice(-8) // keep last 8 levels
  }

  return { support: dedup(support), resistance: dedup(resistance) }
}
