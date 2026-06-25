import { useCallback, useRef } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, TrendingUp, TrendingDown } from 'lucide-react'
import useAppStore from '../../store/useAppStore.js'

const TREND_START_LABELS = {
  launch: 'IPO Price',
  ytd:    'Jan 1 Price',
  '1y':   '1Y Ago Price',
  '5y':   '5Y Ago Price',
}

function buildColumns(trendHorizon) {
  return [
    { key: 'ticker',          label: 'Ticker',                              align: 'left',  sortable: true },
    { key: 'name',            label: 'Company',                             align: 'left',  sortable: true },
    { key: 'currentPrice',    label: 'Price (THB)',                         align: 'right', sortable: true },
    { key: 'trendBasePrice',  label: TREND_START_LABELS[trendHorizon] ?? 'Start Price', align: 'right', sortable: false },
    { key: 'changePct',       label: 'Change %',                            align: 'right', sortable: true },
    { key: 'volume',          label: 'Volume',                              align: 'right', sortable: true },
    { key: 'pe',              label: 'P/E',                                 align: 'right', sortable: true },
    { key: 'de',              label: 'D/E',                                 align: 'right', sortable: true },
    { key: 'roe',             label: 'ROE',                                 align: 'right', sortable: true },
    { key: 'fcf',             label: 'FCF (B)',                             align: 'right', sortable: true },
    { key: 'marketCap',       label: 'Mkt Cap (B)',                         align: 'right', sortable: true },
    { key: 'trend',           label: 'Trend',                               align: 'right', sortable: true },
  ]
}

function fmt(val, key) {
  if (val === null || val === undefined) return '—'
  switch (key) {
    case 'currentPrice':
    case 'trendBasePrice': return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    case 'changePct':    return (val >= 0 ? '+' : '') + val.toFixed(2) + '%'
    case 'volume':       return val >= 1_000_000 ? (val / 1_000_000).toFixed(1) + 'M' : val.toLocaleString()
    case 'pe':           return val <= 0 ? '—' : val.toFixed(1) + 'x'
    case 'de':           return val.toFixed(2) + 'x'
    case 'roe':          return val.toFixed(1) + '%'
    case 'fcf':          return (val >= 0 ? '+' : '') + val.toFixed(2) + 'B'
    case 'marketCap':    return val.toFixed(1)
    case 'trend':        return (val >= 0 ? '+' : '') + val.toFixed(1) + '%'
    default: return val
  }
}

function SortIcon({ col, sortKey, sortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={11} className="text-muted/40 ml-1" />
  return sortDir === 'asc'
    ? <ChevronUp size={11} className="text-accent ml-1" />
    : <ChevronDown size={11} className="text-accent ml-1" />
}

/** @param {{ stocks: any[] }} props */
export function StockTable({ stocks }) {
  const sortKey          = useAppStore(s => s.sortKey)
  const sortDir          = useAppStore(s => s.sortDir)
  const setSort          = useAppStore(s => s.setSort)
  const setSelectedStock = useAppStore(s => s.setSelectedStock)
  const trendHorizon     = useAppStore(s => s.trendHorizon)
  const tbodyRef = useRef(null)

  const COLUMNS = buildColumns(trendHorizon)

  const handleRowClick = useCallback((ticker) => {
    setSelectedStock(ticker)
  }, [setSelectedStock])

  const handleRowKey = useCallback((e, ticker) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setSelectedStock(ticker)
    }
    // Arrow key navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const rows = tbodyRef.current?.querySelectorAll('tr[tabindex]')
      if (!rows) return
      const rowArr = Array.from(rows)
      const idx = rowArr.indexOf(e.currentTarget)
      const next = e.key === 'ArrowDown' ? rowArr[idx + 1] : rowArr[idx - 1]
      next?.focus()
    }
  }, [setSelectedStock])

  if (stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted gap-3">
        <span className="text-sm">No stocks match your filters.</span>
        <button
          type="button"
          onClick={() => useAppStore.getState().clearAllFilters()}
          className="text-xs text-accent hover:underline"
        >
          Reset filters
        </button>
      </div>
    )
  }

  return (
    <div className="overflow-auto flex-1">
      <table className="w-full text-xs border-collapse min-w-[1260px]">
        <thead className="sticky top-0 z-10 bg-surface border-b border-border">
          <tr>
            {COLUMNS.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable && setSort(col.key)}
                className={`
                  px-4 py-2.5 text-muted font-medium tracking-wide uppercase text-[10px]
                  select-none whitespace-nowrap transition-colors
                  ${col.sortable ? 'cursor-pointer hover:text-body' : 'cursor-default'}
                  ${col.align === 'right' ? 'text-right' : 'text-left'}
                `}
              >
                <span className="inline-flex items-center gap-0.5">
                  {col.label}
                  {col.sortable && <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody ref={tbodyRef}>
          {stocks.map((stock, i) => {
            const isUp = stock.changePct >= 0
            const trendUp = stock.trend >= 0

            return (
              <tr
                key={stock.ticker}
                tabIndex={0}
                onClick={() => handleRowClick(stock.ticker)}
                onKeyDown={e => handleRowKey(e, stock.ticker)}
                className={`
                  border-b border-border/40 cursor-pointer transition-colors outline-none
                  focus-visible:bg-accent/10
                  ${i % 2 === 0 ? 'bg-bg' : 'bg-surface/50'}
                  hover:bg-accent/5
                `}
              >
                {/* Ticker */}
                <td className="px-4 py-2.5 font-price whitespace-nowrap">
                  <span className="text-accent font-medium">{stock.ticker}</span>
                  {!stock.isRealData && (
                    <span className="ml-1.5 text-[9px] font-medium px-1 py-0.5 rounded
                                     bg-amber-500/10 text-amber-500/80 border border-amber-500/20
                                     align-middle">
                      MOCK
                    </span>
                  )}
                </td>
                {/* Name */}
                <td className="px-4 py-2.5 text-body max-w-[200px] truncate">{stock.name}</td>
                {/* Price */}
                <td className="px-4 py-2.5 text-right font-price text-heading font-medium">
                  {fmt(stock.currentPrice, 'currentPrice')}
                </td>
                {/* Start Price (trend reference) */}
                <td className="px-4 py-2.5 text-right font-price text-muted">
                  {fmt(stock.trendBasePrice, 'trendBasePrice')}
                </td>
                {/* Change % */}
                <td className={`px-4 py-2.5 text-right font-price font-medium ${isUp ? 'text-bullish' : 'text-bearish'}`}>
                  {fmt(stock.changePct, 'changePct')}
                </td>
                {/* Volume */}
                <td className="px-4 py-2.5 text-right font-price text-muted">
                  {fmt(stock.volume, 'volume')}
                </td>
                {/* P/E */}
                <td className="px-4 py-2.5 text-right font-price text-body">
                  {fmt(stock.pe, 'pe')}
                </td>
                {/* D/E */}
                <td className={`px-4 py-2.5 text-right font-price ${stock.de > 2 ? 'text-bearish' : 'text-body'}`}>
                  {fmt(stock.de, 'de')}
                </td>
                {/* ROE */}
                <td className={`px-4 py-2.5 text-right font-price ${stock.roe >= 15 ? 'text-bullish' : stock.roe < 0 ? 'text-bearish' : 'text-body'}`}>
                  {fmt(stock.roe, 'roe')}
                </td>
                {/* FCF */}
                <td className={`px-4 py-2.5 text-right font-price ${stock.fcf >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                  {fmt(stock.fcf, 'fcf')}
                </td>
                {/* Market Cap */}
                <td className="px-4 py-2.5 text-right font-price text-body">
                  {fmt(stock.marketCap, 'marketCap')}
                </td>
                {/* Trend */}
                <td className={`px-4 py-2.5 text-right font-price font-medium ${trendUp ? 'text-bullish' : 'text-bearish'}`}>
                  <span className="inline-flex items-center justify-end gap-1">
                    {trendUp
                      ? <TrendingUp size={11} />
                      : <TrendingDown size={11} />
                    }
                    {fmt(stock.trend, 'trend')}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

