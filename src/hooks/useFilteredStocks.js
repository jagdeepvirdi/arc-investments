import { useMemo } from 'react'
import { INDICES_MAP } from '../data/indices.js'
import { getStockHistory, getPriceAtDate } from '../data/mockPriceHistory.js'
import { calcRSI, calcMACD } from '../data/indicators.js'
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
      map.set(stock.ticker, { rsiLast: 50, macdBullish: false })
      continue
    }
    const closes = history.map(c => c.close)
    const rsiArr = calcRSI(closes, 14)
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
    map.set(stock.ticker, { rsiLast, macdBullish })
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
      return { ...growth, ...stock, trend, trendBasePrice: basePrice ?? null, rsiLast: sig.rsiLast, macdBullish: sig.macdBullish }
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
    sortKey, sortDir,
  ])

  return { stocks, totalCount: allStocks.length }
}
