import { useMemo } from 'react'
import { STOCKS } from '../data/mockStocks.js'
import { getStockHistory, getPriceAtDate } from '../data/mockPriceHistory.js'
import { calcRSI, calcMACD } from '../data/indicators.js'

const TODAY = new Date().toISOString().slice(0, 10)

function getYTDDate() {
  return `${new Date().getUTCFullYear()}-01-01`
}

function getDateYearsAgo(years) {
  const d = new Date()
  d.setUTCFullYear(d.getUTCFullYear() - years)
  return d.toISOString().slice(0, 10)
}

/**
 * Pre-compute scanner signals for all stocks once.
 * Returns a Map<ticker, {rsiLast, macdBullish}>
 */
const _signals = (() => {
  const map = new Map()
  for (const stock of STOCKS) {
    const history = getStockHistory(stock.ticker)
    if (history.length < 30) {
      map.set(stock.ticker, { rsiLast: 50, macdBullish: false })
      continue
    }
    const closes = history.map(c => c.close)
    const rsiArr = calcRSI(closes, 14)
    const macdArr = calcMACD(closes, 12, 26, 9)

    // Last valid RSI
    let rsiLast = 50
    for (let i = rsiArr.length - 1; i >= 0; i--) {
      if (rsiArr[i] !== null) { rsiLast = rsiArr[i]; break }
    }

    // MACD bullish cross in last 5 sessions
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
  return map
})()

/**
 * @param {{
 *   searchQuery: string,
 *   activeScanners: string[],
 *   trendHorizon: string,
 *   sortKey: string,
 *   sortDir: 'asc'|'desc'
 * }} filters
 * @returns {{ stocks: any[], scannerCounts: Object }}
 */
export function useFilteredStocks({ searchQuery, activeScanners, trendHorizon, sortKey, sortDir }) {
  const scannerCounts = useMemo(() => {
    const counts = { RSI_OVERSOLD: 0, RSI_OVERBOUGHT: 0, MACD_BULLISH: 0 }
    for (const stock of STOCKS) {
      const sig = _signals.get(stock.ticker)
      if (!sig) continue
      if (sig.rsiLast < 30) counts.RSI_OVERSOLD++
      if (sig.rsiLast > 70) counts.RSI_OVERBOUGHT++
      if (sig.macdBullish) counts.MACD_BULLISH++
    }
    return counts
  }, [])

  const stocks = useMemo(() => {
    const q = searchQuery.toLowerCase()

    // Determine reference date for trend horizon
    let refDate
    switch (trendHorizon) {
      case 'launch': refDate = null; break // use ipoDate per stock
      case '5y':  refDate = getDateYearsAgo(5); break
      case '1y':  refDate = getDateYearsAgo(1); break
      case 'ytd': refDate = getYTDDate(); break
      default:    refDate = getYTDDate()
    }

    let list = STOCKS.map(stock => {
      const sig = _signals.get(stock.ticker) ?? { rsiLast: 50, macdBullish: false }

      // Trend calculation
      const baseDate = trendHorizon === 'launch' ? stock.ipoDate : refDate
      const basePrice = trendHorizon === 'launch'
        ? stock.ipoPrice
        : getPriceAtDate(stock.ticker, baseDate)

      const trend = basePrice && basePrice > 0
        ? ((stock.currentPrice - basePrice) / basePrice) * 100
        : 0

      return { ...stock, trend, rsiLast: sig.rsiLast, macdBullish: sig.macdBullish }
    })

    // Search filter
    if (q) {
      list = list.filter(s =>
        s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      )
    }

    // Scanner filters (AND logic)
    if (activeScanners.includes('RSI_OVERSOLD'))  list = list.filter(s => s.rsiLast < 30)
    if (activeScanners.includes('RSI_OVERBOUGHT')) list = list.filter(s => s.rsiLast > 70)
    if (activeScanners.includes('MACD_BULLISH'))   list = list.filter(s => s.macdBullish)

    // Sort
    list.sort((a, b) => {
      const aVal = a[sortKey] ?? 0
      const bVal = b[sortKey] ?? 0
      const cmp = typeof aVal === 'string'
        ? aVal.localeCompare(bVal)
        : aVal - bVal
      return sortDir === 'asc' ? cmp : -cmp
    })

    return list
  }, [searchQuery, activeScanners, trendHorizon, sortKey, sortDir])

  return { stocks, scannerCounts }
}
