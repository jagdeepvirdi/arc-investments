import { useMemo } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { INDICES, INDICES_MAP } from '../../data/indices.js'
import { SET_INDEX_HISTORY } from '../../data/mockPriceHistory.js'

// ── Data helpers ────────────────────────────────────────────────────────────

function indexMetrics(stocks) {
  let adv = 0, dec = 0, sumChange = 0
  for (const s of stocks) {
    if (s.changePct > 0) adv++
    else if (s.changePct < 0) dec++
    sumChange += s.changePct
  }
  const total = stocks.length
  const avg = total ? sumChange / total : 0
  return { adv, dec, flat: total - adv - dec, avg, total }
}

/**
 * 0–100 score: breadth (60%) + avg move magnitude via sigmoid (40%)
 * 0 = Extreme Fear, 100 = Extreme Greed
 */
function calcSentiment(allStocks) {
  if (!allStocks.length) return 50
  let adv = 0, sumChg = 0
  for (const s of allStocks) {
    if (s.changePct > 0) adv++
    sumChg += s.changePct
  }
  const breadth   = (adv / allStocks.length) * 60
  const avgChg    = sumChg / allStocks.length
  const magnitude = (1 / (1 + Math.exp(-avgChg * 2))) * 40
  return Math.round(breadth + magnitude)
}

const SENTIMENT_ZONES = [
  { max: 20,  label: 'Extreme Fear', color: '#EF4444' },
  { max: 40,  label: 'Fear',         color: '#F97316' },
  { max: 60,  label: 'Neutral',      color: '#EAB308' },
  { max: 80,  label: 'Greed',        color: '#22C55E' },
  { max: 100, label: 'Extreme Greed',color: '#10B981' },
]

function sentimentInfo(score) {
  return SENTIMENT_ZONES.find(z => score <= z.max) ?? SENTIMENT_ZONES[4]
}

// ── Sub-components ──────────────────────────────────────────────────────────

function ChangeChip({ pct, size = 'sm' }) {
  const up = pct >= 0
  const cls = up ? 'text-bullish' : 'text-bearish'
  const Icon = up ? ArrowUp : ArrowDown
  const fs = size === 'lg' ? 'text-sm' : 'text-[11px]'
  const is = size === 'lg' ? 14 : 10
  return (
    <span className={`inline-flex items-center gap-0.5 font-price font-medium ${cls} ${fs}`}>
      <Icon size={is} />
      {(up ? '+' : '')}{pct.toFixed(2)}%
    </span>
  )
}

function BreadthBar({ adv, dec, total }) {
  const advPct = total > 0 ? (adv / total) * 100 : 50
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative h-1 w-20 rounded-full bg-border overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-bullish/70 rounded-full transition-all"
          style={{ width: `${advPct}%` }}
        />
      </div>
      <span className="text-[10px] font-price text-bullish">{adv}↑</span>
      <span className="text-[10px] font-price text-bearish">{dec}↓</span>
    </div>
  )
}

/** Horizontal gradient bar with a white dot marker at `score` percent. */
function SentimentGauge({ score }) {
  const info = sentimentInfo(score)
  const clampedPct = Math.max(2, Math.min(98, score))

  return (
    <div className="flex flex-col gap-1.5 min-w-[200px]">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-muted uppercase tracking-wider">Fear</span>
        <span className="text-[9px] text-muted uppercase tracking-wider">Greed</span>
      </div>

      {/* Gradient track */}
      <div className="relative h-2.5 rounded-full overflow-visible"
           style={{ background: 'linear-gradient(to right, #EF4444 0%, #F97316 25%, #EAB308 50%, #22C55E 75%, #10B981 100%)' }}>
        {/* Dot marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 shadow-md transition-all duration-500"
          style={{ left: `calc(${clampedPct}% - 7px)`, borderColor: info.color }}
        />
      </div>

      {/* Score + label */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-price font-bold" style={{ color: info.color }}>
          {score}
        </span>
        <span className="text-[10px] font-medium" style={{ color: info.color }}>
          {info.label}
        </span>
      </div>
    </div>
  )
}

function Divider() {
  return <div className="w-px self-stretch bg-border mx-2" />
}

// ── Main component ──────────────────────────────────────────────────────────

export function MarketOverviewBar() {
  const allMarketStocks = useMemo(
    () => INDICES.flatMap(idx => idx.stocks),
    [],
  )

  const { setLast, setChange, setChangePct } = useMemo(() => {
    const last = SET_INDEX_HISTORY.at(-1)
    const prev = SET_INDEX_HISTORY.at(-2)
    if (!last || !prev) return { setLast: null, setChange: 0, setChangePct: 0 }
    const chg    = last.close - prev.close
    const chgPct = (chg / prev.close) * 100
    return { setLast: last.close, setChange: chg, setChangePct: chgPct }
  }, [])

  const indexStats = useMemo(
    () => INDICES.map(idx => ({ id: idx.id, label: idx.label, ...indexMetrics(idx.stocks) })),
    [],
  )

  const sentiment = useMemo(() => calcSentiment(allMarketStocks), [allMarketStocks])

  const setIsUp = setChangePct >= 0

  return (
    <div className="flex items-center gap-0 px-6 py-3 border-b border-border bg-surface/60 shrink-0">

      {/* ── SET composite index ───────────────────────────────────────── */}
      <div className="flex flex-col gap-0.5 min-w-[130px]">
        <span className="text-[9px] text-muted uppercase tracking-widest">SET Index</span>
        {setLast !== null ? (
          <>
            <span className={`text-sm font-price font-semibold ${setIsUp ? 'text-bullish' : 'text-bearish'}`}>
              {setLast.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-1.5">
              <ChangeChip pct={setChangePct} />
              <span className={`text-[10px] font-price ${setIsUp ? 'text-bullish/70' : 'text-bearish/70'}`}>
                ({setIsUp ? '+' : ''}{setChange.toFixed(2)})
              </span>
            </div>
          </>
        ) : (
          <span className="text-muted text-xs">—</span>
        )}
      </div>

      {/* ── One card per registered index ─────────────────────────────── */}
      {indexStats.map(stat => (
        <div key={stat.id} className="flex items-center">
          <Divider />
          <div className="flex flex-col gap-0.5 min-w-[130px]">
            <span className="text-[9px] text-muted uppercase tracking-widest">{stat.label}</span>
            <ChangeChip pct={stat.avg} size="lg" />
            <BreadthBar adv={stat.adv} dec={stat.dec} total={stat.total} />
          </div>
        </div>
      ))}

      <Divider />

      {/* ── Sentiment Gauge ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-0.5 flex-1 max-w-[280px]">
        <span className="text-[9px] text-muted uppercase tracking-widest">Market Sentiment</span>
        <SentimentGauge score={sentiment} />
      </div>

    </div>
  )
}
