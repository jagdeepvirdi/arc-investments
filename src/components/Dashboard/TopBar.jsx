import { Search } from 'lucide-react'
import { Dropdown } from '../UI/Dropdown.jsx'
import useAppStore from '../../store/useAppStore.js'

const TREND_OPTIONS = [
  { value: 'ytd',    label: 'YTD' },
  { value: '1y',     label: '1-Year' },
  { value: '5y',     label: '5-Year' },
  { value: 'launch', label: 'Since Launch' },
]

export function TopBar() {
  const searchQuery  = useAppStore(s => s.searchQuery)
  const trendHorizon = useAppStore(s => s.trendHorizon)
  const setSearchQuery  = useAppStore(s => s.setSearchQuery)
  const setTrendHorizon = useAppStore(s => s.setTrendHorizon)

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface shrink-0">
      {/* Wordmark */}
      <div className="flex items-center gap-3">
        <span className="text-heading font-semibold tracking-tight text-base">ArcInvestments</span>
        <span className="bg-accent/15 text-accent border border-accent/30 text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider">
          SET 100
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <label className="relative flex items-center">
          <Search size={13} className="absolute left-2.5 text-muted pointer-events-none" />
          <input
            type="search"
            placeholder="Ticker or name…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-bg border border-border text-body text-xs rounded pl-7 pr-3 py-1.5
                       w-48 focus:outline-none focus:border-accent/60 placeholder:text-muted/50"
            aria-label="Search stocks"
          />
        </label>

        {/* Trend Horizon */}
        <Dropdown
          label="Trend:"
          value={trendHorizon}
          onChange={setTrendHorizon}
          options={TREND_OPTIONS}
        />
      </div>
    </header>
  )
}
