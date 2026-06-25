import { TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react'
import { Chip } from '../UI/Chip.jsx'
import useAppStore from '../../store/useAppStore.js'

const SCANNERS = [
  { id: 'RSI_OVERSOLD',   label: 'RSI Oversold (<30)' },
  { id: 'RSI_OVERBOUGHT', label: 'RSI Overbought (>70)' },
  { id: 'MACD_BULLISH',   label: 'MACD Bullish Cross' },
]

const DIVIDER = <span className="w-px h-4 bg-border mx-1" />

/** @param {{ scannerCounts: Object }} props */
export function ScannerBar({ scannerCounts }) {
  const activeScanners  = useAppStore(s => s.activeScanners)
  const trendDirection  = useAppStore(s => s.trendDirection)
  const todayDirection  = useAppStore(s => s.todayDirection)
  const hideMockData      = useAppStore(s => s.hideMockData)
  const toggleScanner     = useAppStore(s => s.toggleScanner)
  const setTrendDirection = useAppStore(s => s.setTrendDirection)
  const setTodayDirection = useAppStore(s => s.setTodayDirection)
  const toggleHideMockData = useAppStore(s => s.toggleHideMockData)

  return (
    <div className="flex items-center flex-wrap gap-2 px-6 py-2.5 border-b border-border bg-bg shrink-0">

      {/* ── Trend direction ───────────────────────────────────────────────── */}
      <span className="text-[10px] text-muted uppercase tracking-wider">Trend:</span>
      <Chip
        active={trendDirection === 'up'}
        onClick={() => setTrendDirection('up')}
        variant="bullish"
      >
        <TrendingUp size={11} />
        Uptrend
      </Chip>
      <Chip
        active={trendDirection === 'down'}
        onClick={() => setTrendDirection('down')}
        variant="bearish"
      >
        <TrendingDown size={11} />
        Downtrend
      </Chip>

      {DIVIDER}

      {/* ── Today's change ────────────────────────────────────────────────── */}
      <span className="text-[10px] text-muted uppercase tracking-wider">Today:</span>
      <Chip
        active={todayDirection === 'up'}
        onClick={() => setTodayDirection('up')}
        variant="bullish"
      >
        ↑ Up
      </Chip>
      <Chip
        active={todayDirection === 'down'}
        onClick={() => setTodayDirection('down')}
        variant="bearish"
      >
        ↓ Down
      </Chip>

      {DIVIDER}

      {/* ── Technical scanners ────────────────────────────────────────────── */}
      <span className="text-[10px] text-muted uppercase tracking-wider">Scanners:</span>
      {SCANNERS.map(s => (
        <Chip
          key={s.id}
          active={activeScanners.includes(s.id)}
          count={scannerCounts[s.id]}
          onClick={() => toggleScanner(s.id)}
        >
          {s.label}
        </Chip>
      ))}

      {DIVIDER}

      {/* ── Data quality ──────────────────────────────────────────────────── */}
      <Chip
        active={hideMockData}
        onClick={toggleHideMockData}
        variant="bullish"
      >
        <ShieldCheck size={11} />
        Real Data Only
      </Chip>
    </div>
  )
}
