import { useMemo } from 'react'
import { INDICES_MAP } from '../data/indices.js'
import { getStockHistory, getPriceAtDate } from '../data/mockPriceHistory.js'
import { calcRSI, calcMACD } from '../data/indicators.js'

function getYTDDate() {
  return `${new Date().getUTCFullYear()}-01-01`
}

function getDateYearsAgo(years) {
  const d = new Date()
  d.setUTCFullYear(d.getUTCFullYear() - years)
  return d.toISOString().slice(0, 10)
}

// Lazy signal cache keyed by index ID — computed once per index, never again
const _signalCache = new Map()

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
 *   activeScanners: string[],
 *   trendHorizon: string,
 *   trendDirection: 'up'|'down'|null,
 *   todayDirection: 'up'|'down'|null,
 *   sortKey: string,
 *   sortDir: 'asc'|'desc'
 * }} filters
 * @returns {{ stocks: any[], totalCount: number, scannerCounts: Object }}
 */
export function useFilteredStocks({
  activeIndex,
  searchQuery,
  activeScanners,
  trendHorizon,
  trendDirection,
  todayDirection,
  sortKey,
  sortDir,
}) {
  const indexDef = INDICES_MAP[activeIndex]
  const allStocks = indexDef.stocks
  const signals = getSignals(allStocks, activeIndex)

  const scannerCounts = useMemo(() => {
    const counts = { RSI_OVERSOLD: 0, RSI_OVERBOUGHT: 0, MACD_BULLISH: 0 }
    for (const stock of allStocks) {
      const sig = signals.get(stock.ticker)
      if (!sig) continue
      if (sig.rsiLast < 30) counts.RSI_OVERSOLD++
      if (sig.rsiLast > 70) counts.RSI_OVERBOUGHT++
      if (sig.macdBullish) counts.MACD_BULLISH++
    }
    return counts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

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
      const sig = signals.get(stock.ticker) ?? { rsiLast: 50, macdBullish: false }

      const baseDate = trendHorizon === 'launch' ? stock.ipoDate : refDate
      const basePrice = trendHorizon === 'launch'
        ? stock.ipoPrice
        : getPriceAtDate(stock.ticker, baseDate)

      const trend = basePrice && basePrice > 0
        ? ((stock.currentPrice - basePrice) / basePrice) * 100
        : 0

      return { ...stock, trend, rsiLast: sig.rsiLast, macdBullish: sig.macdBullish }
    })

    if (q) {
      list = list.filter(s =>
        s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      )
    }

    if (trendDirection === 'up')   list = list.filter(s => s.trend > 0)
    if (trendDirection === 'down') list = list.filter(s => s.trend < 0)
    if (todayDirection === 'up')   list = list.filter(s => s.changePct > 0)
    if (todayDirection === 'down') list = list.filter(s => s.changePct < 0)

    if (activeScanners.includes('RSI_OVERSOLD'))   list = list.filter(s => s.rsiLast < 30)
    if (activeScanners.includes('RSI_OVERBOUGHT')) list = list.filter(s => s.rsiLast > 70)
    if (activeScanners.includes('MACD_BULLISH'))   list = list.filter(s => s.macdBullish)

    list.sort((a, b) => {
      const aVal = a[sortKey] ?? 0
      const bVal = b[sortKey] ?? 0
      const cmp = typeof aVal === 'string'
        ? aVal.localeCompare(bVal)
        : aVal - bVal
      return sortDir === 'asc' ? cmp : -cmp
    })

    return list
  }, [activeIndex, searchQuery, activeScanners, trendHorizon, trendDirection, todayDirection, sortKey, sortDir])

  return { stocks, totalCount: allStocks.length, scannerCounts }
}
