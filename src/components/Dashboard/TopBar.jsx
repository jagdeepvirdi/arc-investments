import { Search } from 'lucide-react'
import { Dropdown } from '../UI/Dropdown.jsx'
import useAppStore from '../../store/useAppStore.js'
import { INDICES } from '../../data/indices.js'
import dataStatus from '../../data/real/meta.json'

const TREND_OPTIONS = [
  { value: 'ytd',    label: 'YTD' },
  { value: '1y',     label: '1-Year' },
  { value: '5y',     label: '5-Year' },
  { value: 'launch', label: 'Since Launch' },
]

const _fetched = new Date(dataStatus.lastFetched)
const LAST_UPDATED = _fetched.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function TopBar() {
  const searchQuery    = useAppStore(s => s.searchQuery)
  const trendHorizon   = useAppStore(s => s.trendHorizon)
  const activeIndex    = useAppStore(s => s.activeIndex)
  const setSearchQuery  = useAppStore(s => s.setSearchQuery)
  const setTrendHorizon = useAppStore(s => s.setTrendHorizon)
  const setActiveIndex  = useAppStore(s => s.setActiveIndex)

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface shrink-0">
      {/* Wordmark + Index Tabs */}
      <div className="flex items-center gap-4">
        <span className="text-heading font-semibold tracking-tight text-base">ArcInvestments</span>

        {/* Index selector */}
        <nav className="flex items-center gap-1" aria-label="Index selector">
          {INDICES.map(idx => (
            <button
              key={idx.id}
              type="button"
              onClick={() => setActiveIndex(idx.id)}
              title={idx.description}
              className={`
                text-[11px] font-medium px-2.5 py-1 rounded transition-colors duration-150
                ${activeIndex === idx.id
                  ? 'bg-accent text-white'
                  : 'text-muted border border-border hover:border-accent/40 hover:text-body'
                }
              `}
            >
              {idx.label}
            </button>
          ))}
        </nav>
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

        {/* Last data load timestamp */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-bullish/70 shrink-0" aria-hidden="true" />
          <span className="text-[10px] text-muted whitespace-nowrap">
            {LAST_UPDATED}
          </span>
        </div>
      </div>
    </header>
  )
}
