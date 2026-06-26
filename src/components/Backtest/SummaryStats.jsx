import { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import { STRATEGIES } from '../../data/strategies.js'

function fmtPct(n) {
  if (n == null) return '—'
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

function fmtTHB(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('th-TH', {
    style: 'currency', currency: 'THB', maximumFractionDigits: 0,
  }).format(n)
}

function StatCard({ label, value, color = 'text-body' }) {
  return (
    <div className="bg-surface border border-border rounded p-3">
      <p className="text-muted text-[10px] uppercase tracking-wider mb-1">{label}</p>
      <p className={`font-mono font-semibold text-sm ${color}`}>{value}</p>
    </div>
  )
}

function EquityCurveChart({ equityCurve, budget }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !equityCurve?.length) return

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: 'solid', color: '#111827' },
        textColor: '#6B7280',
      },
      grid: {
        vertLines: { color: '#1F2937' },
        horzLines: { color: '#1F2937' },
      },
      rightPriceScale: {
        borderColor: '#1F2937',
        scaleMargins: { top: 0.08, bottom: 0.08 },
      },
      timeScale: {
        borderColor: '#1F2937',
        timeVisible: false,
      },
      crosshair: { mode: 1 },
      height: 200,
      width: containerRef.current.clientWidth,
    })

    const series = chart.addBaselineSeries({
      baseValue: { type: 'price', price: budget },
      topLineColor: '#10B981',
      topFillColor1: 'rgba(16,185,129,0.25)',
      topFillColor2: 'rgba(16,185,129,0.02)',
      bottomLineColor: '#EF4444',
      bottomFillColor1: 'rgba(239,68,68,0.02)',
      bottomFillColor2: 'rgba(239,68,68,0.25)',
      lineWidth: 2,
    })

    series.setData(equityCurve.map(p => ({ time: p.date, value: p.value })))
    chart.timeScale().fitContent()

    let alive = true
    const ro = new ResizeObserver(() => {
      if (alive && containerRef.current) {
        chart.resize(containerRef.current.clientWidth, 200)
      }
    })
    ro.observe(containerRef.current)

    return () => {
      alive = false
      ro.disconnect()
      chart.remove()
    }
  }, []) // intentionally empty — remounted via key prop on new result

  return <div ref={containerRef} className="w-full h-[200px]" />
}

/**
 * @param {{ result: import('../../data/backtester.js').BacktestResult }} props
 */
export function SummaryStats({ result }) {
  const { summary, initialBudget, finalValue, strategyId, startDate, endDate, maxPositionPct = 100 } = result
  const strategy = STRATEGIES.find(s => s.id === strategyId)
  const isProfit = summary.totalPnlPct >= 0

  const cards = [
    {
      label: 'Final Value',
      value: fmtTHB(finalValue),
      color: isProfit ? 'text-bullish' : 'text-bearish',
    },
    {
      label: 'Total P&L',
      value: fmtTHB(summary.totalPnl),
      color: isProfit ? 'text-bullish' : 'text-bearish',
    },
    {
      label: 'Total P&L %',
      value: fmtPct(summary.totalPnlPct),
      color: isProfit ? 'text-bullish' : 'text-bearish',
    },
    {
      label: 'Win Rate',
      value: `${summary.winRate}%`,
      color: summary.winRate >= 50 ? 'text-bullish' : 'text-bearish',
    },
    {
      label: 'Total Trades',
      value: summary.totalTrades,
      color: 'text-body',
    },
    {
      label: 'Avg Days Held',
      value: `${summary.avgDaysHeld}d`,
      color: 'text-body',
    },
    {
      label: 'Max Drawdown',
      value: `-${Math.abs(summary.maxDrawdown).toFixed(2)}%`,
      color: 'text-bearish',
    },
    {
      label: 'Best / Worst',
      value: summary.bestTrade && summary.worstTrade
        ? `${fmtPct(summary.bestTrade.pnlPct)} / ${fmtPct(summary.worstTrade.pnlPct)}`
        : '—',
      color: 'text-body',
    },
  ]

  return (
    <div className="space-y-4">
      {/* Run header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-heading font-semibold text-base">{strategy?.label ?? strategyId}</h2>
          <p className="text-muted text-[11px] mt-0.5">
            {startDate} → {endDate} · Budget{' '}
            <span className="font-mono text-body">{fmtTHB(initialBudget)}</span>
            {maxPositionPct < 100 && (
              <span className="ml-2 text-muted/70">
                · Max {maxPositionPct}% / stock ({fmtTHB(initialBudget * maxPositionPct / 100)})
              </span>
            )}
          </p>
        </div>
        <span className={`text-2xl font-mono font-semibold ${isProfit ? 'text-bullish' : 'text-bearish'}`}>
          {fmtPct(summary.totalPnlPct)}
        </span>
      </div>

      {/* 2×4 stat cards */}
      <div className="grid grid-cols-4 gap-3">
        {cards.map(card => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Equity curve — keyed on runAt so chart remounts on each new result */}
      <div className="bg-surface border border-border rounded overflow-hidden">
        <p className="text-muted text-[10px] uppercase tracking-wider px-3 pt-2.5 pb-1">
          Equity Curve
        </p>
        <EquityCurveChart
          key={result.runAt}
          equityCurve={summary.equityCurve}
          budget={initialBudget}
        />
      </div>
    </div>
  )
}
