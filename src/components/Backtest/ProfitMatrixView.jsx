import { useState, useCallback } from 'react'
import { Calculator, Play, Loader2 } from 'lucide-react'
import { runBacktest } from '../../data/backtester.js'
import { STRATEGIES } from '../../data/strategies.js'
import { INDICES_MAP } from '../../data/indices.js'
import { SET_INDEX_HISTORY } from '../../data/mockPriceHistory.js'

// ── Config ────────────────────────────────────────────────────────────────────

const ALL_STOCKS = INDICES_MAP['ALL'].stocks
const DATA_END   = SET_INDEX_HISTORY.at(-1)?.time ?? '2024-12-31'

function shiftDate(dateStr, years = 0, months = 0) {
  const d = new Date(dateStr)
  d.setFullYear(d.getFullYear() + years)
  d.setMonth(d.getMonth() + months)
  return d.toISOString().split('T')[0]
}

const DUR_VARIANTS = [
  { label: '6M', startDate: shiftDate(DATA_END, 0, -6) },
  { label: '1Y',  startDate: shiftDate(DATA_END, -1) },
  { label: '2Y',  startDate: shiftDate(DATA_END, -2) },
  { label: '3Y',  startDate: shiftDate(DATA_END, -3) },
  { label: '5Y',  startDate: shiftDate(DATA_END, -5) },
]

const POS_OPTIONS     = [10, 20, 30, 50, 100]
const DEFAULT_BUDGETS = [50_000, 100_000, 500_000, 1_000_000, 2_000_000]
const BUDGET_COLORS   = ['#6B7280', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtThb(val) {
  if (val === null || val === undefined) return '—'
  const sign = val < 0 ? '-' : '+'
  const abs  = Math.abs(val)
  if (abs >= 1_000_000) return `${sign}฿${(abs / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000)     return `${sign}฿${(abs / 1_000).toFixed(1)}K`
  return `${sign}฿${abs.toFixed(0)}`
}

function fmtThbAxis(val) {
  const sign = val < 0 ? '-' : ''
  const abs  = Math.abs(val)
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000)     return `${sign}${(abs / 1_000).toFixed(0)}K`
  return String(+val.toFixed(0))
}

function fmtPct(pct) {
  if (pct === null || pct === undefined) return ''
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`
}

function fmtBudget(b) {
  if (b >= 1_000_000) return `฿${(b / 1_000_000 % 1 === 0 ? (b / 1_000_000).toFixed(0) : (b / 1_000_000).toFixed(1))}M`
  if (b >= 1_000)     return `฿${(b / 1_000 % 1 === 0 ? (b / 1_000).toFixed(0) : (b / 1_000).toFixed(1))}K`
  return `฿${b}`
}

function cellStyle(pnlPct) {
  if (pnlPct === null || pnlPct === undefined) return { color: '#4B5563' }
  if (pnlPct > 0) {
    const intensity = Math.min(pnlPct / 80, 1)
    return {
      backgroundColor: `rgba(16,185,129,${(intensity * 0.4).toFixed(2)})`,
      color: pnlPct >= 5 ? '#10B981' : '#9CA3AF',
    }
  }
  const intensity = Math.min(Math.abs(pnlPct) / 50, 1)
  return {
    backgroundColor: `rgba(239,68,68,${(intensity * 0.4).toFixed(2)})`,
    color: '#EF4444',
  }
}

// ── Profit Line Chart ─────────────────────────────────────────────────────────

function ProfitLineChart({ budgets, getPnl }) {
  const series = budgets
    .map((b, bi) => ({ b, color: BUDGET_COLORS[bi], vals: DUR_VARIANTS.map(d => getPnl(b, d.label)) }))
    .filter(s => s.vals.some(v => v !== null))

  if (!series.length) return null

  const allVals = series.flatMap(s => s.vals.filter(v => v !== null))
  const rawMin  = Math.min(0, ...allVals)
  const rawMax  = Math.max(0, ...allVals)
  const vPad    = (rawMax - rawMin) * 0.1 || 5_000
  const lo = rawMin - vPad
  const hi = rawMax + vPad
  const range = hi - lo

  const VW = 560, VH = 210
  const P  = { t: 8, r: 14, b: 26, l: 72 }
  const cW = VW - P.l - P.r
  const cH = VH - P.t - P.b

  const n   = DUR_VARIANTS.length
  const px  = i => P.l + (n > 1 ? (i / (n - 1)) * cW : cW / 2)
  const py  = v => P.t + (1 - (v - lo) / range) * cH

  // Nice y ticks
  const approxStep = range / 5
  const mag  = Math.pow(10, Math.floor(Math.log10(approxStep || 1)))
  const step = ([1, 2, 5, 10].map(m => m * mag).find(s => s >= approxStep)) || mag * 10
  const firstTick  = Math.ceil(lo / step) * step
  const yTicks = []
  for (let v = firstTick; v <= hi + step * 0.1; v += step) yTicks.push(+v.toFixed(0))

  return (
    <div>
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ height: '210px' }}>
        {/* Grid + Y labels */}
        {yTicks.map(v => (
          <g key={v}>
            <line x1={P.l} x2={VW - P.r} y1={py(v)} y2={py(v)}
              stroke={v === 0 ? '#374151' : '#1E2535'}
              strokeWidth={v === 0 ? 1 : 0.5}
              strokeDasharray={v === 0 ? '4 4' : undefined} />
            <text x={P.l - 5} y={py(v) + 3.5} textAnchor="end"
              fill="#6B7280" fontSize="9" fontFamily="monospace">
              {fmtThbAxis(v)}
            </text>
          </g>
        ))}

        {/* X labels */}
        {DUR_VARIANTS.map((d, i) => (
          <text key={d.label} x={px(i)} y={VH - 7} textAnchor="middle"
            fill="#6B7280" fontSize="9" fontFamily="monospace">{d.label}</text>
        ))}

        {/* Lines */}
        {series.map(s => {
          let d = ''; let open = false
          s.vals.forEach((v, i) => {
            if (v !== null) {
              d += open ? ` L${px(i).toFixed(1)},${py(v).toFixed(1)}`
                        : ` M${px(i).toFixed(1)},${py(v).toFixed(1)}`
              open = true
            } else { open = false }
          })
          return (
            <path key={s.b} d={d} fill="none" stroke={s.color}
              strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          )
        })}

        {/* Dots at data points */}
        {series.map(s =>
          s.vals.map((v, i) => v !== null ? (
            <circle key={`${s.b}-${i}`} cx={px(i)} cy={py(v)} r="3"
              fill={s.color} stroke="#0A0E17" strokeWidth="1" />
          ) : null)
        )}

        {/* Value labels on last point */}
        {series.map(s => {
          const last = s.vals.at(-1)
          if (last === null) return null
          return (
            <text key={`lbl-${s.b}`}
              x={px(n - 1) + 6} y={py(last) + 3.5}
              fill={s.color} fontSize="8" fontFamily="monospace" textAnchor="start">
              {fmtThbAxis(last)}
            </text>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1.5">
        {series.map(s => (
          <div key={s.b} className="flex items-center gap-1.5">
            <div style={{ width: 16, height: 2, background: s.color, borderRadius: 1 }} />
            <span className="text-[10px] text-muted font-mono">{fmtBudget(s.b)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function ProfitMatrixView() {
  const [strategyId, setStrategyId] = useState(STRATEGIES[2].id)  // S3 default (most profitable)
  const [posPct,     setPosPct]     = useState(20)
  const [budgets,    setBudgets]    = useState([...DEFAULT_BUDGETS])
  const [results,    setResults]    = useState({})       // `budget:durLabel` → { pnl, pnlPct }
  const [isRunning,  setIsRunning]  = useState(false)
  const [progress,   setProgress]   = useState(0)
  const [dirty,      setDirty]      = useState(false)
  const [runLabel,   setRunLabel]   = useState(null)     // describes last completed run

  const hasResults = Object.keys(results).length > 0
  const strategy   = STRATEGIES.find(s => s.id === strategyId)
  const totalRuns  = budgets.length * DUR_VARIANTS.length

  const runMatrix = useCallback(async (sid, pct, bdgts) => {
    const strat = STRATEGIES.find(s => s.id === sid)
    if (!strat) return
    setIsRunning(true)
    setProgress(0)
    setDirty(false)
    let done = 0
    const res = {}

    for (const budget of bdgts) {
      for (const dur of DUR_VARIANTS) {
        await new Promise(r => setTimeout(r, 0))
        const bt = runBacktest({
          strategy: strat, allStocks: ALL_STOCKS,
          startDate: dur.startDate, endDate: null,
          budget, maxPositionPct: pct,
        })
        res[`${budget}:${dur.label}`] = { pnl: bt.summary.totalPnl, pnlPct: bt.summary.totalPnlPct }
        setProgress(Math.round((++done / (bdgts.length * DUR_VARIANTS.length)) * 100))
      }
    }

    setResults(res)
    setRunLabel(`${strat.label} · ${pct}% per position · ends ${DATA_END}`)
    setIsRunning(false)
  }, [])

  const handleRun = () => runMatrix(strategyId, posPct, budgets)

  const getPnl    = (b, lbl) => results[`${b}:${lbl}`]?.pnl    ?? null
  const getPnlPct = (b, lbl) => results[`${b}:${lbl}`]?.pnlPct ?? null

  const markDirty = () => setDirty(true)

  const updateBudget = (i, val) => {
    setBudgets(prev => { const n = [...prev]; n[i] = Math.max(10_000, val); return n })
    markDirty()
  }

  return (
    <div className="p-6 space-y-6">

      {/* Controls panel */}
      <div className="border border-border rounded bg-surface px-4 py-4 space-y-4">

        {/* Row 1: Strategy + Position % */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted whitespace-nowrap">Strategy</label>
            <select value={strategyId} disabled={isRunning} onChange={e => { setStrategyId(e.target.value); markDirty() }}
              className="bg-bg border border-border rounded px-2 py-1.5 text-xs text-body focus:outline-none focus:border-accent disabled:opacity-50 cursor-pointer min-w-[210px]">
              {STRATEGIES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted whitespace-nowrap">Position per stock</label>
            <select value={posPct} disabled={isRunning} onChange={e => { setPosPct(Number(e.target.value)); markDirty() }}
              className="bg-bg border border-border rounded px-2 py-1.5 text-xs font-mono text-body focus:outline-none focus:border-accent disabled:opacity-50 cursor-pointer">
              {POS_OPTIONS.map(p => <option key={p} value={p}>{p}% of capital</option>)}
            </select>
          </div>
        </div>

        {/* Row 2: Investment amounts */}
        <div className="space-y-1.5">
          <p className="text-xs text-muted">Investment amounts to compare (THB)</p>
          <div className="flex flex-wrap gap-3">
            {budgets.map((b, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: BUDGET_COLORS[i] }} />
                <input type="number" value={b} disabled={isRunning}
                  onChange={e => updateBudget(i, Number(e.target.value))}
                  className="w-32 bg-bg border border-border rounded px-2 py-1 text-xs font-mono text-body focus:outline-none focus:border-accent disabled:opacity-50" />
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Run button */}
        <div className="flex items-center gap-3">
          {dirty && hasResults && (
            <span className="text-[10px] text-amber-400/90">Settings changed — recalculate to update</span>
          )}
          <div className="ml-auto flex items-center gap-3">
            {isRunning && (
              <div className="flex items-center gap-2">
                <Loader2 size={12} className="animate-spin text-accent" />
                <span className="text-xs font-mono text-muted">{progress}%</span>
                <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            <button type="button" onClick={handleRun} disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs font-medium rounded hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
              {isRunning ? `Calculating… (${totalRuns} runs)` : hasResults ? 'Recalculate' : 'Calculate'}
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {!hasResults && !isRunning && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <Calculator size={40} className="text-muted/20" />
          <p className="text-muted text-sm">
            Choose a strategy, set your investment levels and position size, then click Calculate
          </p>
          <p className="text-muted/50 text-xs">
            Only {budgets.length * DUR_VARIANTS.length} backtests · results in seconds
          </p>
        </div>
      )}

      {(hasResults || isRunning) && (
        <>
          {runLabel && (
            <p className="text-xs text-muted">{runLabel}</p>
          )}

          {/* Line chart */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-heading">Profit Growth by Investment Level</h2>
            <p className="text-[11px] text-muted">THB profit as time horizon increases — each line is one investment amount</p>
            <ProfitLineChart budgets={budgets} getPnl={getPnl} />
          </section>

          {/* Matrix table */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-heading">Profit Matrix</h2>
            <p className="text-[11px] text-muted">
              Rows = investment amount · Columns = time horizon · ★ = best duration per investment level
            </p>
            <div className="overflow-x-auto rounded border border-border">
              <table className="text-xs border-collapse w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2.5 px-4 text-muted font-medium min-w-[130px]">
                      Investment
                    </th>
                    {DUR_VARIANTS.map(d => (
                      <th key={d.label} className="text-center py-2.5 px-3 text-muted font-mono font-medium min-w-[120px]">
                        {d.label}
                        <div className="text-[9px] font-normal opacity-50 mt-0.5">
                          {d.startDate} →&nbsp;{DATA_END}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {budgets.map((budget, bi) => {
                    const pnls    = DUR_VARIANTS.map(d => getPnl(budget, d.label))
                    const pnlPcts = DUR_VARIANTS.map(d => getPnlPct(budget, d.label))
                    const maxPnl  = Math.max(...pnls.filter(v => v !== null))
                    return (
                      <tr key={budget} className="border-b border-border/30 hover:bg-surface/40">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                              style={{ background: BUDGET_COLORS[bi] }} />
                            <span className="font-mono font-bold text-body text-[13px]">
                              {fmtBudget(budget)}
                            </span>
                          </div>
                          <div className="text-[9px] text-muted/50 mt-0.5 ml-4.5 pl-0.5">
                            ฿{budget.toLocaleString()}
                          </div>
                        </td>
                        {pnls.map((pnl, di) => {
                          const pct   = pnlPcts[di]
                          const isMax = pnl !== null && pnl === maxPnl && pnl > 0
                          return (
                            <td key={DUR_VARIANTS[di].label}
                              className="py-3 px-3 text-center tabular-nums"
                              style={cellStyle(pct)}>
                              <div className="font-mono font-bold text-[13px]">
                                {fmtThb(pnl)}{isMax ? ' ★' : ''}
                              </div>
                              {pct !== null && (
                                <div className="text-[10px] opacity-70 mt-0.5 font-mono">
                                  {fmtPct(pct)}
                                </div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-muted/40">
              All horizons measured backwards from the last extracted data date ({DATA_END})
            </p>
          </section>
        </>
      )}
    </div>
  )
}
