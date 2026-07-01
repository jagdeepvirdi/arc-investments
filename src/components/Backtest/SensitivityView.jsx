import { useState, useCallback } from 'react'
import { TrendingUp, Play, Loader2 } from 'lucide-react'
import { runBacktest } from '../../data/backtester.js'
import { STRATEGIES } from '../../data/strategies.js'
import { INDICES_MAP } from '../../data/indices.js'
import { SET_INDEX_HISTORY } from '../../data/mockPriceHistory.js'

// ── Constants ─────────────────────────────────────────────────────────────────

const ALL_STOCKS = INDICES_MAP['ALL'].stocks

const DATA_END = SET_INDEX_HISTORY.at(-1)?.time ?? '2024-12-31'

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

const POS_VARIANTS = [10, 20, 30, 50, 100]   // max % of capital per position
const FIXED_POS_PCT   = 20                    // used for duration sweep
const FIXED_3Y_START  = shiftDate(DATA_END, -3) // used for position sweep
const TOTAL_RUNS = STRATEGIES.length * (DUR_VARIANTS.length + POS_VARIANTS.length)

const LINE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

// ── Helpers ───────────────────────────────────────────────────────────────────

function cellStyle(pct, isMax) {
  const base = isMax ? { outline: '1px solid rgba(255,255,255,0.12)', outlineOffset: '-1px' } : {}
  if (pct === null || pct === undefined) return { color: '#4B5563', ...base }
  if (pct > 0) {
    const intensity = Math.min(pct / 80, 1)
    return { backgroundColor: `rgba(16,185,129,${(intensity * 0.35).toFixed(2)})`, color: pct >= 5 ? '#10B981' : '#9CA3AF', ...base }
  }
  const intensity = Math.min(Math.abs(pct) / 50, 1)
  return { backgroundColor: `rgba(239,68,68,${(intensity * 0.35).toFixed(2)})`, color: '#EF4444', ...base }
}

function fmt(pct) {
  if (pct === null || pct === undefined) return '—'
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`
}

// ── HeatmapTable ──────────────────────────────────────────────────────────────

function HeatmapTable({ columns, getValue }) {
  return (
    <div className="overflow-x-auto rounded border border-border">
      <table className="text-xs border-collapse w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-1.5 px-3 text-muted font-medium w-44">Strategy</th>
            {columns.map(col => (
              <th key={col} className="text-center py-1.5 px-3 text-muted font-mono font-medium min-w-[72px]">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STRATEGIES.map(s => {
            const vals = columns.map(col => getValue(s.id, col))
            const maxVal = Math.max(...vals.filter(v => v !== null && v !== undefined))
            return (
              <tr key={s.id} className="border-b border-border/30 hover:bg-surface/40">
                <td className="py-1.5 px-3 text-body font-medium truncate max-w-[11rem]" title={s.label}>
                  {s.label}
                </td>
                {vals.map((pct, ci) => {
                  const isMax = pct !== null && pct === maxVal && pct > 0
                  return (
                    <td key={columns[ci]} className="py-1.5 px-3 text-center font-mono tabular-nums"
                      style={cellStyle(pct, isMax)}>
                      {fmt(pct)}{isMax ? ' ★' : ''}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── SvgLineChart ──────────────────────────────────────────────────────────────

function SvgLineChart({ series, xLabels }) {
  const visible = [...series]
    .filter(s => s.values.some(v => v !== null))
    .sort((a, b) => {
      const last = arr => [...arr].reverse().find(v => v !== null) ?? -Infinity
      return last(b.values) - last(a.values)
    })
    .slice(0, 5)

  if (!visible.length) return null

  const allVals = visible.flatMap(s => s.values.filter(v => v !== null))
  const rawMin = Math.min(0, ...allVals)
  const rawMax = Math.max(0, ...allVals)
  const vPad = (rawMax - rawMin) * 0.1 || 5
  const lo = rawMin - vPad
  const hi = rawMax + vPad
  const rangeY = hi - lo

  const VW = 560, VH = 180
  const P = { t: 8, r: 12, b: 22, l: 48 }
  const cW = VW - P.l - P.r
  const cH = VH - P.t - P.b

  const px = i => P.l + (xLabels.length > 1 ? (i / (xLabels.length - 1)) * cW : cW / 2)
  const py = v => P.t + (1 - (v - lo) / rangeY) * cH

  const approxStep = rangeY / 5
  const step = approxStep > 30 ? 20 : approxStep > 15 ? 10 : approxStep > 6 ? 5 : 2
  const firstTick = Math.ceil(lo / step) * step
  const yTicks = []
  for (let v = firstTick; v <= hi + step * 0.1; v += step) yTicks.push(+v.toFixed(0))

  return (
    <div>
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ height: '180px' }}>
        {yTicks.map(v => (
          <g key={v}>
            <line x1={P.l} x2={VW - P.r} y1={py(v)} y2={py(v)}
              stroke={v === 0 ? '#374151' : '#1E2535'}
              strokeWidth={v === 0 ? 1 : 0.5}
              strokeDasharray={v === 0 ? '4 4' : undefined} />
            <text x={P.l - 5} y={py(v) + 3.5} textAnchor="end"
              fill="#6B7280" fontSize="9" fontFamily="monospace">
              {v > 0 ? '+' : ''}{v}%
            </text>
          </g>
        ))}
        {xLabels.map((lbl, i) => (
          <text key={lbl} x={px(i)} y={VH - 5} textAnchor="middle"
            fill="#6B7280" fontSize="9" fontFamily="monospace">{lbl}</text>
        ))}
        {visible.map((s, si) => {
          const color = LINE_COLORS[si]
          let d = ''
          let open = false
          s.values.forEach((v, i) => {
            if (v !== null) {
              d += open ? ` L${px(i).toFixed(1)},${py(v).toFixed(1)}`
                        : ` M${px(i).toFixed(1)},${py(v).toFixed(1)}`
              open = true
            } else { open = false }
          })
          return (
            <path key={s.id} d={d} fill="none" stroke={color}
              strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
          )
        })}
      </svg>
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1.5">
        {visible.map((s, si) => (
          <div key={s.id} className="flex items-center gap-1.5">
            <div style={{ width: 16, height: 2, background: LINE_COLORS[si], borderRadius: 1 }} />
            <span className="text-[10px] text-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function SensitivityView() {
  const [durResults, setDurResults] = useState({})
  const [posResults, setPosResults] = useState({})
  const [isRunning,  setIsRunning]  = useState(false)
  const [progress,   setProgress]   = useState(0)
  const [budget,     setBudget]     = useState(1_000_000)

  const hasResults = Object.keys(durResults).length > 0

  const runSweep = useCallback(async () => {
    setIsRunning(true)
    setProgress(0)
    let done = 0
    const dr = {}, pr = {}

    for (const strat of STRATEGIES) {
      for (const dur of DUR_VARIANTS) {
        await new Promise(r => setTimeout(r, 0))
        const res = runBacktest({
          strategy: strat, allStocks: ALL_STOCKS,
          startDate: dur.startDate, endDate: null,
          budget, maxPositionPct: FIXED_POS_PCT,
        })
        dr[`${strat.id}:${dur.label}`] = res.summary.totalPnlPct
        setProgress(Math.round((++done / TOTAL_RUNS) * 100))
      }
      for (const pct of POS_VARIANTS) {
        await new Promise(r => setTimeout(r, 0))
        const res = runBacktest({
          strategy: strat, allStocks: ALL_STOCKS,
          startDate: FIXED_3Y_START, endDate: null,
          budget, maxPositionPct: pct,
        })
        pr[`${strat.id}:${pct}`] = res.summary.totalPnlPct
        setProgress(Math.round((++done / TOTAL_RUNS) * 100))
      }
    }

    setDurResults(dr)
    setPosResults(pr)
    setIsRunning(false)
  }, [budget])

  const durSeries = STRATEGIES.map(s => ({
    id: s.id, label: s.label,
    values: DUR_VARIANTS.map(d => durResults[`${s.id}:${d.label}`] ?? null),
  }))
  const posSeries = STRATEGIES.map(s => ({
    id: s.id, label: s.label,
    values: POS_VARIANTS.map(p => posResults[`${s.id}:${p}`] ?? null),
  }))

  return (
    <div className="p-6 space-y-8">

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 border border-border rounded bg-surface px-4 py-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted whitespace-nowrap">Budget (THB)</label>
          <input type="number" value={budget} disabled={isRunning}
            onChange={e => setBudget(Math.max(10_000, Number(e.target.value)))}
            className="w-32 bg-bg border border-border rounded px-2 py-1 text-xs font-mono text-body focus:outline-none focus:border-accent disabled:opacity-50" />
        </div>
        <p className="text-[10px] text-muted/60">
          Duration sweep · position fixed at {FIXED_POS_PCT}% · end date {DATA_END}
          &nbsp;|&nbsp;
          Position sweep · 3-year window ending {DATA_END}
        </p>
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
          <button type="button" onClick={runSweep} disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs font-medium rounded hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
            {isRunning ? 'Running…' : hasResults ? 'Re-run Analysis' : 'Run Sensitivity Analysis'}
          </button>
        </div>
      </div>

      {/* Empty state */}
      {!hasResults && !isRunning && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <TrendingUp size={40} className="text-muted/20" />
          <p className="text-muted text-sm">Compare all 16 strategies across durations and position sizes</p>
          <p className="text-muted/50 text-xs">
            Runs {TOTAL_RUNS} backtests in-browser · typically 30–90 seconds · ★ marks each strategy's best parameter
          </p>
        </div>
      )}

      {(hasResults || isRunning) && (
        <>
          {/* Duration Impact */}
          <section className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-heading">Duration Impact</h2>
              <p className="text-[11px] text-muted mt-0.5">
                Top 5 strategies shown in chart (by {DUR_VARIANTS.at(-1).label} return) · ★ = optimal horizon per strategy
              </p>
            </div>
            <SvgLineChart series={durSeries} xLabels={DUR_VARIANTS.map(d => d.label)} />
            <HeatmapTable
              columns={DUR_VARIANTS.map(d => d.label)}
              getValue={(id, col) => durResults[`${id}:${col}`] ?? null}
            />
          </section>

          {/* Position Size Impact */}
          <section className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-heading">Position Size Impact</h2>
              <p className="text-[11px] text-muted mt-0.5">
                Top 5 strategies shown in chart (by 50% allocation return) · ★ = optimal position size per strategy
              </p>
            </div>
            <SvgLineChart series={posSeries} xLabels={POS_VARIANTS.map(p => `${p}%`)} />
            <HeatmapTable
              columns={POS_VARIANTS.map(p => `${p}%`)}
              getValue={(id, col) => posResults[`${id}:${parseInt(col)}`] ?? null}
            />
          </section>
        </>
      )}
    </div>
  )
}
