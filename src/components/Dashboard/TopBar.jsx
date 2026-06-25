import { Search } from 'lucide-react'
import { Dropdown } from '../UI/Dropdown.jsx'
import useAppStore from '../../store/useAppStore.js'
import { INDICES } from '../../data/indices.js'

const TREND_OPTIONS = [
  { value: 'ytd',    label: 'YTD' },
  { value: '1y',     label: '1-Year' },
  { value: '5y',     label: '5-Year' },
  { value: 'launch', label: 'Since Launch' },
]

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
      </div>
    </header>
  )
}
