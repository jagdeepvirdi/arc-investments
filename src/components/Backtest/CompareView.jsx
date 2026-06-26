import { useMemo } from 'react'
import { STRATEGIES } from '../../data/strategies.js'

function fmtTHB(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('th-TH', {
    style: 'currency', currency: 'THB', maximumFractionDigits: 0,
  }).format(n)
}

function fmtPct(n) {
  if (n == null) return '—'
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

/**
 * Row definition:
 *  label        – displayed in first column
 *  render(r)    – string | number to display in each result column
 *  getValue(r)  – numeric value used for best-value detection; null = no highlight
 *  higherBetter – true = highest value wins; false = lowest value wins; null = no highlight
 *  isProfit(r)  – optional fn → boolean to color the value bullish/bearish
 *  separator    – if true, render a thin divider row above this row
 */
const METRIC_ROWS = [
  // ── Info ──────────────────────────────────────────────────────────────────
  {
    label: 'Strategy',
    render: r => STRATEGIES.find(s => s.id === r.strategyId)?.label ?? r.strategyId,
    getValue: null,
  },
  {
    label: 'Date Range',
    render: r => `${r.startDate} → ${r.endDate}`,
    getValue: null,
  },
  {
    label: 'Budget',
    render: r => fmtTHB(r.initialBudget),
    getValue: null,
  },
  {
    label: 'Max / Stock',
    render: r => {
      const pct = r.maxPositionPct ?? 100
      return pct < 100
        ? `${pct}% (${fmtTHB(r.initialBudget * pct / 100)})`
        : '100% (no cap)'
    },
    getValue: null,
  },

  // ── Returns ───────────────────────────────────────────────────────────────
  {
    separator: true,
    label: 'Final Value',
    render: r => fmtTHB(r.finalValue),
    getValue: r => r.finalValue,
    higherBetter: true,
    isProfit: r => r.finalValue >= r.initialBudget,
  },
  {
    label: 'Total P&L',
    render: r => fmtTHB(r.summary.totalPnl),
    getValue: r => r.summary.totalPnl,
    higherBetter: true,
    isProfit: r => r.summary.totalPnl >= 0,
  },
  {
    label: 'Total P&L %',
    render: r => fmtPct(r.summary.totalPnlPct),
    getValue: r => r.summary.totalPnlPct,
    higherBetter: true,
    isProfit: r => r.summary.totalPnlPct >= 0,
  },

  // ── Trade stats ───────────────────────────────────────────────────────────
  {
    separator: true,
    label: 'Win Rate',
    render: r => `${r.summary.winRate}%`,
    getValue: r => r.summary.winRate,
    higherBetter: true,
    isProfit: r => r.summary.winRate >= 50,
  },
  {
    label: 'Total Trades',
    render: r => r.summary.totalTrades,
    getValue: null,
  },
  {
    label: 'Winners / Losers',
    render: r => `${r.summary.winningTrades} / ${r.summary.losingTrades}`,
    getValue: null,
  },
  {
    label: 'Avg Days Held',
    render: r => `${r.summary.avgDaysHeld}d`,
    getValue: null,
  },

  // ── Risk ──────────────────────────────────────────────────────────────────
  {
    separator: true,
    label: 'Max Drawdown',
    render: r => `-${Math.abs(r.summary.maxDrawdown).toFixed(2)}%`,
    getValue: r => r.summary.maxDrawdown,
    higherBetter: false, // lower drawdown = better
    isProfit: () => false,
  },
  {
    label: 'Best Trade',
    render: r => r.summary.bestTrade
      ? `${r.summary.bestTrade.ticker} ${fmtPct(r.summary.bestTrade.pnlPct)}`
      : '—',
    getValue: r => r.summary.bestTrade?.pnlPct ?? -Infinity,
    higherBetter: true,
    isProfit: r => (r.summary.bestTrade?.pnlPct ?? 0) >= 0,
  },
  {
    label: 'Worst Trade',
    render: r => r.summary.worstTrade
      ? `${r.summary.worstTrade.ticker} ${fmtPct(r.summary.worstTrade.pnlPct)}`
      : '—',
    getValue: r => r.summary.worstTrade?.pnlPct ?? -Infinity,
    higherBetter: true, // higher (less negative) worst trade = better risk control
    isProfit: r => (r.summary.worstTrade?.pnlPct ?? 0) >= 0,
  },
]

/**
 * @param {{ results: import('../../data/backtester.js').BacktestResult[] }} props
 */
export function CompareView({ results }) {
  // For each metric row, compute which result index has the best value
  const bestIdx = useMemo(() => {
    return METRIC_ROWS.map(row => {
      if (!row.getValue || row.higherBetter == null) return null
      const vals = results.map(r => row.getValue(r))
      const best = row.higherBetter ? Math.max(...vals) : Math.min(...vals)
      // Only highlight if there's an actual winner (not all equal)
      const idx = vals.indexOf(best)
      return vals.filter(v => v === best).length === vals.length ? null : idx
    })
  }, [results])

  return (
    <div className="space-y-3">
      <p className="text-muted text-[10px] uppercase tracking-wider">
        Comparing {results.length} runs
      </p>

      <div className="border border-border rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface border-b border-border">
                {/* Metric label header */}
                <th className="px-4 py-2.5 text-left text-muted text-[10px] uppercase tracking-wider
                               w-36 min-w-36 sticky left-0 bg-surface z-10">
                  Metric
                </th>
                {results.map((r, i) => {
                  const strategy = STRATEGIES.find(s => s.id === r.strategyId)
                  const profit   = r.summary.totalPnlPct >= 0
                  return (
                    <th
                      key={i}
                      className="px-4 py-2.5 text-right text-[11px] font-medium min-w-[160px]"
                    >
                      <span className="block text-heading truncate">{strategy?.label ?? r.strategyId}</span>
                      <span className={`block font-mono text-xs font-semibold ${profit ? 'text-bullish' : 'text-bearish'}`}>
                        {fmtPct(r.summary.totalPnlPct)}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody>
              {METRIC_ROWS.map((row, rowIdx) => (
                <>
                  {row.separator && (
                    <tr key={`sep-${rowIdx}`}>
                      <td colSpan={results.length + 1} className="h-px bg-border/60" />
                    </tr>
                  )}
                  <tr
                    key={row.label}
                    className="border-b border-border/40 last:border-0 hover:bg-surface/40 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-muted text-[11px] sticky left-0 bg-bg z-10
                                   hover:bg-surface/40 whitespace-nowrap">
                      {row.label}
                    </td>
                    {results.map((r, colIdx) => {
                      const isBest     = bestIdx[rowIdx] === colIdx
                      const profitFlag = row.isProfit ? row.isProfit(r) : null
                      const colorClass = isBest
                        ? 'text-accent font-semibold'
                        : profitFlag === true
                          ? 'text-bullish'
                          : profitFlag === false
                            ? 'text-bearish'
                            : 'text-body'

                      return (
                        <td
                          key={colIdx}
                          className={`px-4 py-2.5 text-right font-mono whitespace-nowrap
                                     ${colorClass}
                                     ${isBest ? 'bg-accent/5' : ''}`}
                        >
                          {row.render(r)}
                          {isBest && (
                            <span className="ml-1 text-accent text-[9px] align-middle">★</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
