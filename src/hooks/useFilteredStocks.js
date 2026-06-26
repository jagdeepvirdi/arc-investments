import { useMemo } from 'react'
import { INDICES_MAP } from '../data/indices.js'
import { getStockHistory, getPriceAtDate } from '../data/mockPriceHistory.js'
import { calcRSI, calcMACD, calcSMA, calcEMA } from '../data/indicators.js'
import { getGrowthMetrics } from '../data/growthMetrics.js'

function getYTDDate() {
  return `${new Date().getUTCFullYear()}-01-01`
}

function getDateYearsAgo(years) {
  const d = new Date()
  d.setUTCFullYear(d.getUTCFullYear() - years)
  return d.toISOString().slice(0, 10)
}

// Lazy signal cache keyed by index ID -- computed once per index, never again
const _signalCache = new Map()

// Lazy growth-metrics cache keyed by index ID
const _growthCache = new Map()

function getGrowthMap(stocks, indexId) {
  if (_growthCache.has(indexId)) return _growthCache.get(indexId)
  const map = new Map()
  for (const stock of stocks) {
    map.set(stock.ticker, getGrowthMetrics(stock.ticker, stock.sector))
  }
  _growthCache.set(indexId, map)
  return map
}

function getSignals(stocks, indexId) {
  if (_signalCache.has(indexId)) return _signalCache.get(indexId)
  const map = new Map()
  for (const stock of stocks) {
    const history = getStockHistory(stock.ticker)
    if (history.length < 30) {
      map.set(stock.ticker, { rsiLast: 50, macdBullish: false, smaTrendSetupPass: false })
      continue
    }
    const closes = history.map(c => c.close)
    const rsiArr  = calcRSI(closes, 14)
    const macdArr = calcMACD(closes, 12, 26, 9)

    let rsiLast = 50
    for (let i = rsiArr.length - 1; i >= 0; i--) {
      if (rsiArr[i] !== null) { rsiLast = rsiArr[i]; break }
    }

    let macdBullish = false
    const recentMacd = macdArr.slice(-6).filter(Boolean)
    for (let i = 1; i < recentMacd.length; i++) {
      const prev = recentMacd[i - 1]
      const curr = recentMacd[i]
      if (prev.macd < prev.signal && curr.macd >= curr.signal) {
        macdBullish = true
        break
      }
    }

    // ── SMA Trend Setup: requires 220+ data points ───────────────────────────
    let smaTrendSetupPass = false
    if (history.length >= 220) {
      const sma50Arr  = calcSMA(closes, 50)
      const sma150Arr = calcSMA(closes, 150)
      const sma160Arr = calcSMA(closes, 160)
      const ema220Arr = calcEMA(closes, 220)
      const last = closes.length - 1

      const sma50Last  = sma50Arr[last]
      const sma150Last = sma150Arr[last]
      const sma160Last = sma160Arr[last]
      const ema220Last = ema220Arr[last]
      const closeLast  = closes[last]

      // Condition 4: price > 1.25× 52-week low (past 252 trading days)
      const start52w = Math.max(0, last + 1 - 252)
      let low52w = Infinity
      for (let i = start52w; i <= last; i++) {
        if (closes[i] < low52w) low52w = closes[i]
      }

      // Condition 5: dipped below EMA220 at least once in past 90 trading days
      const start90 = Math.max(0, last + 1 - 90)
      let touchedBelowEma220 = false
      for (let i = start90; i <= last; i++) {
        if (ema220Arr[i] !== null && closes[i] < ema220Arr[i]) {
          touchedBelowEma220 = true
          break
        }
      }

      smaTrendSetupPass = (
        sma150Last !== null && ema220Last !== null && sma150Last > ema220Last &&  // 1
        sma50Last  !== null && closeLast > sma50Last &&                           // 2
        sma160Last !== null && sma50Last > sma160Last &&                          // 3
        low52w < Infinity   && closeLast > 1.25 * low52w &&                      // 4
        touchedBelowEma220                                                        // 5
      )
    }

    map.set(stock.ticker, { rsiLast, macdBullish, smaTrendSetupPass })
  }
  _signalCache.set(indexId, map)
  return map
}

/**
 * @param {{
 *   activeIndex: string,
 *   searchQuery: string,
 *   trendHorizon: string,
 *   trendDirection: 'up'|'down'|null,
 *   hideMockData: boolean,
 *   selectedSectors: string[]|null,
 *   peMin: number|null, peMax: number|null,
 *   deMin: number|null, deMax: number|null,
 *   roeMin: number|null, roeMax: number|null,
 *   fcfFilter: 'any'|'positive'|'negative',
 *   rsiMin: number, rsiMax: number,
 *   macdFilter: 'any'|'bullish',
 *   epsGrowthMin: number|null,
 *   revenueGrowthMin: number|null,
 *   divYieldMin: number|null,
 *   payoutRatioMax: number|null,
 *   smaTrendSetup: boolean,
 *   sortKey: string,
 *   sortDir: 'asc'|'desc'
 * }} filters
 * @returns {{ stocks: any[], totalCount: number }}
 */
export function useFilteredStocks({
  activeIndex,
  searchQuery,
  trendHorizon,
  trendDirection,
  hideMockData,
  selectedSectors,
  peMin, peMax,
  deMin, deMax,
  roeMin, roeMax,
  fcfFilter,
  rsiMin, rsiMax,
  macdFilter,
  epsGrowthMin,
  revenueGrowthMin,
  divYieldMin,
  payoutRatioMax,
  smaTrendSetup,
  sortKey,
  sortDir,
}) {
  const indexDef = INDICES_MAP[activeIndex]
  const allStocks = indexDef.stocks
  const signals   = getSignals(allStocks, activeIndex)
  const growthMap = getGrowthMap(allStocks, activeIndex)

  const stocks = useMemo(() => {
    const q = searchQuery.toLowerCase()

    let refDate
    switch (trendHorizon) {
      case 'launch': refDate = null; break
      case '5y':  refDate = getDateYearsAgo(5); break
      case '1y':  refDate = getDateYearsAgo(1); break
      case 'ytd': refDate = getYTDDate(); break
      default:    refDate = getYTDDate()
    }

    let list = allStocks.map(stock => {
      const sig    = signals.get(stock.ticker)  ?? { rsiLast: 50, macdBullish: false }
      const growth = growthMap.get(stock.ticker) ?? { epsGrowth: 0, revenueGrowth: 0, payoutRatio: 50 }

      const baseDate = trendHorizon === 'launch' ? stock.ipoDate : refDate
      const basePrice = trendHorizon === 'launch'
        ? stock.ipoPrice
        : getPriceAtDate(stock.ticker, baseDate)

      const trend = basePrice && basePrice > 0
        ? ((stock.currentPrice - basePrice) / basePrice) * 100
        : 0

      // Spread growth first so real stock fields (epsGrowth, revenueGrowth, payoutRatio
      // from Yahoo Finance via realStocks.js) take priority over seeded mock values.
      return { ...growth, ...stock, trend, trendBasePrice: basePrice ?? null, rsiLast: sig.rsiLast, macdBullish: sig.macdBullish, smaTrendSetupPass: sig.smaTrendSetupPass ?? false }
    })

    // Data quality
    if (hideMockData) list = list.filter(s => s.isRealData !== false)

    // Text search
    if (q) list = list.filter(s =>
      s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    )

    // Sector
    if (selectedSectors?.length) list = list.filter(s => selectedSectors.includes(s.sector))

    // Trend direction
    if (trendDirection === 'up')   list = list.filter(s => s.trend > 0)
    if (trendDirection === 'down') list = list.filter(s => s.trend < 0)

    // Fundamentals
    if (peMin !== null) list = list.filter(s => s.pe > 0 && s.pe >= peMin)
    if (peMax !== null) list = list.filter(s => s.pe > 0 && s.pe <= peMax)
    if (deMin !== null) list = list.filter(s => s.de >= deMin)
    if (deMax !== null) list = list.filter(s => s.de <= deMax)
    if (roeMin !== null) list = list.filter(s => s.roe >= roeMin)
    if (roeMax !== null) list = list.filter(s => s.roe <= roeMax)
    if (fcfFilter === 'positive') list = list.filter(s => s.fcf > 0)
    if (fcfFilter === 'negative') list = list.filter(s => s.fcf < 0)

    // Technicals
    if (rsiMin > 0 || rsiMax < 100) list = list.filter(s => s.rsiLast >= rsiMin && s.rsiLast <= rsiMax)
    if (macdFilter === 'bullish') list = list.filter(s => s.macdBullish)
    if (smaTrendSetup) list = list.filter(s => s.smaTrendSetupPass)

    // Growth metrics
    if (epsGrowthMin    !== null) list = list.filter(s => s.epsGrowth     >= epsGrowthMin)
    if (revenueGrowthMin !== null) list = list.filter(s => s.revenueGrowth >= revenueGrowthMin)
    if (divYieldMin     !== null) list = list.filter(s => s.dividendYield  >= divYieldMin)
    if (payoutRatioMax  !== null) list = list.filter(s => s.payoutRatio    <= payoutRatioMax)

    list.sort((a, b) => {
      const aVal = a[sortKey] ?? 0
      const bVal = b[sortKey] ?? 0
      const cmp = typeof aVal === 'string'
        ? aVal.localeCompare(bVal)
        : aVal - bVal
      return sortDir === 'asc' ? cmp : -cmp
    })

    return list
  }, [
    activeIndex, searchQuery, trendHorizon, trendDirection, hideMockData,
    selectedSectors, peMin, peMax, deMin, deMax, roeMin, roeMax,
    fcfFilter, rsiMin, rsiMax, macdFilter,
    epsGrowthMin, revenueGrowthMin, divYieldMin, payoutRatioMax,
    smaTrendSetup, sortKey, sortDir,
  ])

  return { stocks, totalCount: allStocks.length }
}
