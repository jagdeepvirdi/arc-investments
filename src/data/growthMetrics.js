// Seeded PRNG (Mulberry32) — deterministic per ticker, no Math.random()
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashStr(s) {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h
}

// Sectors that tend to show stronger EPS/Revenue growth
const HIGH_GROWTH_SECTORS = new Set([
  'Technology', 'Healthcare', 'Consumer', 'Food & Agri', 'Food & Beverage',
])
// Sectors that tend to have higher dividend payout ratios
const HIGH_YIELD_SECTORS = new Set([
  'Energy', 'Banking', 'Telecom', 'Transport', 'Financials',
])

/**
 * Returns deterministic growth & dividend metrics for a stock.
 * Values are seeded on the ticker so they are stable across renders.
 *
 * @param {string} ticker
 * @param {string} sector
 * @returns {{ epsGrowth: number, revenueGrowth: number, payoutRatio: number }}
 */
export function getGrowthMetrics(ticker, sector = '') {
  const rEps = mulberry32(hashStr(ticker + ':eps'))
  const rRev = mulberry32(hashStr(ticker + ':rev'))
  const rPay = mulberry32(hashStr(ticker + ':pay'))

  const isHighGrowth = HIGH_GROWTH_SECTORS.has(sector)
  const isHighYield  = HIGH_YIELD_SECTORS.has(sector)

  // EPS Growth: growth sectors biased to +5..+40%, others -10..+30%
  const epsGrowth = +((isHighGrowth ? 5 : -10) + rEps() * 35).toFixed(1)

  // Revenue Growth: growth sectors biased to +3..+33%, others -5..+25%
  const revenueGrowth = +((isHighGrowth ? 3 : -5) + rRev() * 30).toFixed(1)

  // Payout Ratio: high-yield sectors 40..90%, others 15..65%
  const payoutRatio = +((isHighYield ? 40 : 15) + rPay() * 50).toFixed(1)

  return { epsGrowth, revenueGrowth, payoutRatio }
}