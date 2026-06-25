import { Chip } from '../UI/Chip.jsx'
import useAppStore from '../../store/useAppStore.js'

const SCANNERS = [
  { id: 'RSI_OVERSOLD',  label: 'RSI Oversold (<30)' },
  { id: 'RSI_OVERBOUGHT', label: 'RSI Overbought (>70)' },
  { id: 'MACD_BULLISH',  label: 'MACD Bullish Cross' },
]

/** @param {{ scannerCounts: Object }} props */
export function ScannerBar({ scannerCounts }) {
  const activeScanners = useAppStore(s => s.activeScanners)
  const toggleScanner  = useAppStore(s => s.toggleScanner)

  return (
    <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border bg-bg shrink-0">
      <span className="text-xs text-muted mr-1">Scanners:</span>
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
    </div>
  )
}
