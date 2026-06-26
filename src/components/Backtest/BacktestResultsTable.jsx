import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Download } from 'lucide-react'
import { exportBacktestToCSV } from '../../utils/exportCsv.js'
import useAppStore from '../../store/useAppStore.js'

const EXIT_BADGE = {
  signal:      { label: 'SIGNAL',  cls: 'bg-accent/15 text-accent' },
  stop_loss:   { label: 'STOP',    cls: 'bg-bearish/15 text-bearish' },
  take_profit: { label: 'TARGET',  cls: 'bg-bullish/15 text-bullish' },
  end_of_data: { label: 'EOD',     cls: 'bg-border/60 text-muted' },
}

const COLS = [
  { key: 'ticker',     label: 'Ticker',    align: 'left'   },
  { key: 'buyDate',    label: 'Buy Date',  align: 'left'   },
  { key: 'buyPrice',   label: 'Buy (฿)',   align: 'right'  },
  { key: 'quantity',   label: 'Qty',       align: 'right'  },
  { key: 'sellDate',   label: 'Sell Date', align: 'left'   },
  { key: 'sellPrice',  label: 'Sell (฿)', align: 'right'  },
  { key: 'pnl',        label: 'P&L (฿)', align: 'right'  },
  { key: 'pnlPct',     label: 'P&L %',    align: 'right'  },
  { key: 'daysHeld',   label: 'Days',      align: 'right'  },
  { key: 'exitReason', label: 'Exit',      align: 'center' },
]

function fmtTHB(n) {
  if (n == null) return '—'
  const abs = Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 })
  return n < 0 ? `-฿${abs}` : `฿${abs}`
}

function fmtPct(n) {
  if (n == null) return '—'
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

/**
 * @param {{ result: import('../../data/backtester.js').BacktestResult }} props
 */
export function BacktestResultsTable({ result }) {
  const setSelectedStock = useAppStore(s => s.setSelectedStock)

  const [sortKey, setSortKey] = useState('pnlPct')
  const [sortDir, setSortDir] = useState('desc')

  const sorted = useMemo(() => {
    return [...result.trades].sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ?  1 : -1
      return 0
    })
  }, [result.trades, sortKey, sortDir])

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const totalPnl  = result.trades.reduce((s, t) => s + t.pnl, 0)
  const avgPnlPct = result.trades.length
    ? result.trades.reduce((s, t) => s + t.pnlPct, 0) / result.trades.length
    : 0
  const avgDays   = result.trades.length
    ? Math.round(result.trades.reduce((s, t) => s + t.daysHeld, 0) / result.trades.length)
    : 0

  if (!result.trades.length) {
    return (
      <div className="flex items-center justify-center py-12 text-muted text-sm">
        No trades were generated for this period.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-muted text-[10px] uppercase tracking-wider">
          Trade Log ({result.trades.length} trades)
        </p>
        <button
          type="button"
          onClick={() => exportBacktestToCSV(result)}
          className="inline-flex items-center gap-1.5 text-muted hover:text-body text-[11px]
                     border border-border rounded px-2.5 py-1 transition-colors duration-150
                     hover:border-accent/40"
        >
          <Download size={11} aria-hidden="true" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="border border-border rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface border-b border-border">
                {COLS.map(col => {
                  const isActive = sortKey === col.key
                  const SortIcon = sortDir === 'asc' ? ChevronUp : ChevronDown
                  return (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={`
                        px-3 py-2 font-medium text-[10px] uppercase tracking-wider
                        cursor-pointer select-none transition-colors duration-100 whitespace-nowrap
                        ${col.align === 'right'  ? 'text-right'  : ''}
                        ${col.align === 'center' ? 'text-center' : ''}
                        ${col.align === 'left'   ? 'text-left'   : ''}
                        ${isActive ? 'text-accent' : 'text-muted hover:text-body'}
                      `}
                    >
                      <span className="inline-flex items-center gap-0.5">
                        {col.label}
                        {isActive && <SortIcon size={10} aria-hidden="true" />}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {sorted.map((trade, i) => {
                const badge    = EXIT_BADGE[trade.exitReason] ?? { label: trade.exitReason, cls: 'bg-border/60 text-muted' }
                const isEod    = trade.exitReason === 'end_of_data'
                const rowProfit= trade.pnl >= 0
                return (
                  <tr
                    key={i}
                    onClick={() => setSelectedStock(trade.ticker)}
                    title={`Open ${trade.ticker} in terminal`}
                    className={`
                      cursor-pointer transition-colors duration-75 hover:bg-surface/60
                      ${isEod ? 'opacity-60' : ''}
                    `}
                  >
                    <td className="px-3 py-2 text-heading font-semibold font-mono whitespace-nowrap">
                      {trade.ticker}
                    </td>
                    <td className="px-3 py-2 text-muted whitespace-nowrap">{trade.buyDate}</td>
                    <td className="px-3 py-2 text-body font-mono text-right whitespace-nowrap">
                      {trade.buyPrice.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-body font-mono text-right">
                      {trade.quantity.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-muted whitespace-nowrap">
                      {trade.sellDate ?? '—'}
                    </td>
                    <td className="px-3 py-2 text-body font-mono text-right whitespace-nowrap">
                      {trade.sellPrice != null ? trade.sellPrice.toFixed(2) : '—'}
                    </td>
                    <td className={`px-3 py-2 font-mono text-right whitespace-nowrap font-semibold
                                   ${rowProfit ? 'text-bullish' : 'text-bearish'}`}>
                      {fmtTHB(trade.pnl)}
                    </td>
                    <td className={`px-3 py-2 font-mono text-right whitespace-nowrap font-semibold
                                   ${rowProfit ? 'text-bullish' : 'text-bearish'}`}>
                      {fmtPct(trade.pnlPct)}
                    </td>
                    <td className="px-3 py-2 text-body font-mono text-right">
                      {trade.daysHeld}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wide ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>

            <tfoot>
              <tr className="border-t-2 border-border bg-surface">
                <td colSpan={6} className="px-3 py-2 text-muted text-[10px]">
                  {result.trades.length} trades
                </td>
                <td className={`px-3 py-2 font-mono font-semibold text-right text-xs
                               ${totalPnl >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                  {fmtTHB(totalPnl)}
                </td>
                <td className={`px-3 py-2 font-mono font-semibold text-right text-xs
                               ${avgPnlPct >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                  {fmtPct(avgPnlPct)} avg
                </td>
                <td className="px-3 py-2 text-muted font-mono text-right text-[11px]">
                  {avgDays}d avg
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
