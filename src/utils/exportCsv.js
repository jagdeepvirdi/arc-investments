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
    'D/E',
    'ROE %',
    'FCF (B THB)',
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
    typeof s.de  === 'number' ? s.de.toFixed(2)  : 'N/A',
    typeof s.roe === 'number' ? s.roe.toFixed(1) : 'N/A',
    typeof s.fcf === 'number' ? s.fcf.toFixed(2) : 'N/A',
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

/**
 * Download a backtest result's full trade log as CSV.
 * @param {import('../data/backtester.js').BacktestResult} result
 */
export function exportBacktestToCSV(result) {
  const { strategyId, startDate, endDate, trades } = result

  const headers = [
    'Ticker', 'Buy Date', 'Buy Price (THB)', 'Qty',
    'Sell Date', 'Sell Price (THB)', 'P&L (THB)', 'P&L %',
    'Days Held', 'Exit Reason',
  ]

  const rows = trades.map(t => [
    cell(t.ticker),
    t.buyDate,
    t.buyPrice.toFixed(2),
    t.quantity,
    t.sellDate ?? '—',
    t.sellPrice != null ? t.sellPrice.toFixed(2) : '—',
    t.pnl.toFixed(2),
    t.pnlPct.toFixed(2),
    t.daysHeld,
    t.exitReason,
  ])

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const date = new Date().toISOString().slice(0, 10)

  const a = document.createElement('a')
  a.href     = url
  a.download = `ArcInvestments_Backtest_${strategyId}_${date}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
