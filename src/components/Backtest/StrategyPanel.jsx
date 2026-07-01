import { useState, useMemo } from 'react'
import { Play, Trash2, ChevronRight, Clock } from 'lucide-react'
import { STRATEGIES } from '../../data/strategies.js'
import useAppStore from '../../store/useAppStore.js'

const CATEGORIES = [
  { label: 'Trend Following',           ids: ['golden_cross_quality', 'ema_ribbon', 'ema200_reclaim', 'macd_volume'] },
  { label: 'Mean Reversion',            ids: ['boll_quality_bounce', 'rsi_double_dip', 'sma50_pullback'] },
  { label: 'Momentum',                  ids: ['high52w_breakout', 'relative_strength', 'macd_histogram_reversal'] },
  { label: 'Hybrid Tech + Fundamental', ids: ['quality_uptrend', 'value_breakout', 'dividend_uptrend', 'sma_trend_setup'] },
  { label: 'Market Timing',             ids: ['set_market_timer', 'boll_squeeze'] },
  { label: 'Enhanced / Experimental',   ids: ['ema200_reclaim_quality', 'high52w_breakout_enhanced', 'ema200_reclaim_breakout', 'ema220_reclaim'] },
  { label: 'Breakout Systems',          ids: ['ema220_trend_52w_breakout'] },
]

const TODAY = new Date().toISOString().slice(0, 10)

function fmtPct(n) {
  if (n == null) return '—'
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function StrategyPanel() {
  const backtestRunning     = useAppStore(s => s.backtestRunning)
  const backtestResults     = useAppStore(s => s.backtestResults)
  const activeBacktestId    = useAppStore(s => s.activeBacktestId)
  const runBacktest         = useAppStore(s => s.runBacktest)
  const setActiveBacktest   = useAppStore(s => s.setActiveBacktest)
  const clearBacktestResult = useAppStore(s => s.clearBacktestResult)

  const [selectedId,      setSelectedId]      = useState(STRATEGIES[0].id)
  const [budget,          setBudget]          = useState(100_000)
  const [startDate,       setStartDate]       = useState('2022-07-01')
  const [endDate,         setEndDate]         = useState(TODAY)
  const [maxPositionPct,  setMaxPositionPct]  = useState(20)

  const selectedStrategy = STRATEGIES.find(s => s.id === selectedId)

  const pastRuns = useMemo(() =>
    Object.entries(backtestResults).sort(([, a], [, b]) => b.runAt.localeCompare(a.runAt)),
    [backtestResults]
  )

  function handleRun() {
    if (backtestRunning) return
    runBacktest(selectedId, Number(budget), startDate, endDate || null, maxPositionPct)
  }

  return (
    <aside className="w-[280px] shrink-0 border-r border-border bg-surface flex flex-col overflow-hidden">

      {/* Strategy list */}
      <div className="flex-1 overflow-y-auto py-3">
        <p className="text-muted text-[10px] uppercase tracking-wider px-4 pb-2">Strategy</p>

        {CATEGORIES.map(cat => (
          <div key={cat.label} className="mb-1">
            <p className="text-muted/50 text-[9px] uppercase tracking-widest px-4 pt-2 pb-1">
              {cat.label}
            </p>
            {cat.ids.map(id => {
              const s = STRATEGIES.find(s => s.id === id)
              if (!s) return null
              const isActive = selectedId === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedId(id)}
                  title={s.description}
                  className={`
                    w-full text-left px-4 py-2 text-xs transition-colors duration-100
                    ${isActive
                      ? 'bg-accent/15 text-heading border-l-2 border-accent'
                      : 'text-body hover:bg-bg/60 border-l-2 border-transparent'
                    }
                  `}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Strategy description */}
      {selectedStrategy && (
        <div className="px-4 py-3 border-t border-border bg-bg/40 max-h-56 overflow-y-auto">
          <p className="text-muted text-[10px] leading-relaxed mb-2">
            {selectedStrategy.description}
          </p>
          {selectedStrategy.selectionNote && (
            <div className="mb-1.5">
              <p className="text-muted/50 text-[9px] uppercase tracking-wider mb-0.5">Selection</p>
              <p className="text-body text-[10px] leading-relaxed">{selectedStrategy.selectionNote}</p>
            </div>
          )}
          {selectedStrategy.buyTrigger && (
            <div className="mb-1.5">
              <p className="text-bullish/70 text-[9px] uppercase tracking-wider mb-0.5">Buy trigger</p>
              <p className="text-body text-[10px] leading-relaxed">{selectedStrategy.buyTrigger}</p>
            </div>
          )}
          {selectedStrategy.sellTrigger && (
            <div className="mb-2">
              <p className="text-bearish/70 text-[9px] uppercase tracking-wider mb-0.5">Sell trigger</p>
              <p className="text-body text-[10px] leading-relaxed">{selectedStrategy.sellTrigger}</p>
            </div>
          )}
          <p className="text-muted/50 text-[9px] border-t border-border/50 pt-1.5 mt-1">
            Max {selectedStrategy.maxPositions} positions ·{' '}
            {selectedStrategy.stopLossPct != null
              ? `${(selectedStrategy.stopLossPct * 100).toFixed(0)}% stop`
              : 'No stop'} ·{' '}
            {selectedStrategy.universe}
          </p>
        </div>
      )}

      {/* Config inputs */}
      <div className="px-4 py-4 border-t border-border space-y-3">
        <div>
          <label className="text-muted text-[10px] uppercase tracking-wider block mb-1">
            Budget (THB)
          </label>
          <input
            type="number"
            value={budget}
            min={10_000}
            step={10_000}
            onChange={e => setBudget(e.target.value)}
            className="w-full bg-bg border border-border text-body text-xs font-mono rounded px-2.5 py-1.5
                       focus:outline-none focus:border-accent/60"
          />
        </div>

        <div>
          <label className="text-muted text-[10px] uppercase tracking-wider block mb-1">
            Max per stock
          </label>
          <div className="flex items-center gap-2">
            <select
              value={maxPositionPct}
              onChange={e => setMaxPositionPct(Number(e.target.value))}
              className="flex-1 bg-bg border border-border text-body text-xs font-mono rounded px-2.5 py-1.5
                         focus:outline-none focus:border-accent/60 appearance-none cursor-pointer"
            >
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(pct => (
                <option key={pct} value={pct}>{pct}%</option>
              ))}
            </select>
            <span className="text-muted text-[10px] whitespace-nowrap shrink-0">
              ≤ {((Number(budget) || 0) * maxPositionPct / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })} ฿
            </span>
          </div>
          <p className="text-muted/50 text-[9px] mt-1">
            Max {maxPositionPct < 100 ? `฿${((Number(budget)||0)*maxPositionPct/100).toLocaleString('en-US',{maximumFractionDigits:0})} of ฿${Number(budget||0).toLocaleString('en-US',{maximumFractionDigits:0})}` : 'unlimited'} per position
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-muted text-[10px] uppercase tracking-wider block mb-1">Start</label>
            <input
              type="date"
              value={startDate}
              min="2015-01-01"
              max={endDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full bg-bg border border-border text-body text-[11px] rounded px-2 py-1.5
                         focus:outline-none focus:border-accent/60"
            />
          </div>
          <div>
            <label className="text-muted text-[10px] uppercase tracking-wider block mb-1">End</label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              max={TODAY}
              onChange={e => setEndDate(e.target.value)}
              className="w-full bg-bg border border-border text-body text-[11px] rounded px-2 py-1.5
                         focus:outline-none focus:border-accent/60"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleRun}
          disabled={backtestRunning}
          className={`
            w-full flex items-center justify-center gap-2 py-2 rounded text-sm font-medium
            transition-colors duration-150
            ${backtestRunning
              ? 'bg-accent/40 text-white/50 cursor-not-allowed'
              : 'bg-accent text-white hover:bg-accent/90 active:bg-accent/80'
            }
          `}
        >
          <Play size={13} aria-hidden="true" />
          {backtestRunning ? 'Running…' : 'Run Backtest'}
        </button>
      </div>

      {/* Past runs */}
      {pastRuns.length > 0 && (
        <div className="border-t border-border overflow-y-auto max-h-52">
          <p className="text-muted text-[10px] uppercase tracking-wider px-4 pt-3 pb-1">Past Runs</p>
          {pastRuns.map(([key, result]) => {
            const s      = STRATEGIES.find(s => s.id === result.strategyId)
            const isView = key === activeBacktestId
            const profit = result.summary.totalPnlPct >= 0
            return (
              <div
                key={key}
                className={`
                  flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors duration-100
                  ${isView ? 'bg-accent/10' : 'hover:bg-bg/60'}
                `}
                onClick={() => setActiveBacktest(key)}
              >
                <ChevronRight
                  size={10}
                  className={isView ? 'text-accent' : 'text-muted/40'}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-body text-[11px] truncate">{s?.label ?? result.strategyId}</p>
                  <p className="text-muted/60 text-[9px] flex items-center gap-1">
                    <Clock size={8} aria-hidden="true" />
                    {fmtDate(result.runAt)} {fmtTime(result.runAt)}
                  </p>
                </div>
                <span className={`text-[11px] font-mono shrink-0 ${profit ? 'text-bullish' : 'text-bearish'}`}>
                  {fmtPct(result.summary.totalPnlPct)}
                </span>
                <button
                  type="button"
                  aria-label={`Delete ${s?.label ?? result.strategyId} run`}
                  onClick={e => { e.stopPropagation(); clearBacktestResult(key) }}
                  className="text-muted/40 hover:text-bearish transition-colors shrink-0"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </aside>
  )
}
