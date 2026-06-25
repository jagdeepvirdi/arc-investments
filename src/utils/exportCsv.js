const TREND_LABELS = {
  ytd:    'YTD',
  '1y':   '1-Year',
  '5y':   '5-Year',
  launch: 'Since Launch',
}

/** Wrap a cell value in quotes if it contains commas, quotes, or newlines. */
function cell(val) {
  const s = String(val ?? '')
  return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/**
 * Download the currently visible (filtered + sorted) stocks as a CSV file.
 * Includes all table columns plus RSI, MACD signal, and data source.
 *
 * @param {object[]} stocks  - array from useFilteredStocks (has trend, rsiLast, macdBullish)
 * @param {object}   ctx
 * @param {string}   ctx.activeIndex    - e.g. 'SET100'
 * @param {string}   ctx.trendHorizon   - e.g. 'ytd'
 */
export function exportToCSV(stocks, { activeIndex, trendHorizon }) {
  const trendLabel = TREND_LABELS[trendHorizon] ?? trendHorizon.toUpperCase()

  const headers = [
    'Ticker',
    'Company',
    'Sector',
    'Price (THB)',
    'Change (THB)',
    'Change %',
    'Volume',
    'P/E',
    'Market Cap (B THB)',
    `Trend % (${trendLabel})`,
    'RSI (14)',
    'MACD Signal',
    'Data Source',
  ]

  const rows = stocks.map(s => [
    cell(s.ticker),
    cell(s.name),
    cell(s.sector),
    s.currentPrice.toFixed(2),
    s.change.toFixed(2),
    s.changePct.toFixed(2),
    s.volume,
    s.pe > 0 ? s.pe.toFixed(1) : 'N/A',
    s.marketCap.toFixed(2),
    typeof s.trend    === 'number' ? s.trend.toFixed(2)    : '0.00',
    typeof s.rsiLast  === 'number' ? s.rsiLast.toFixed(1)  : 'N/A',
    s.macdBullish ? 'Bullish Cross' : 'Bearish',
    s.isRealData === false ? 'Mock' : 'Real',
  ])

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n')

  // UTF-8 BOM so Excel opens Thai company names correctly
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const date = new Date().toISOString().slice(0, 10)

  const a = document.createElement('a')
  a.href     = url
  a.download = `ArcInvestments_${activeIndex}_${date}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
