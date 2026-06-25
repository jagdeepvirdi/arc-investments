import { SlidersHorizontal, X } from 'lucide-react'
import useAppStore from '../../store/useAppStore.js'

function buildPills(state) {
  const {
    trendDirection, selectedSectors, peMin, peMax, deMin, deMax,
    roeMin, roeMax, fcfFilter, rsiMin, rsiMax, macdFilter, hideMockData,
    setFilter, setFilters, setSelectedSectors, toggleHideMockData,
  } = state
  const pills = []

  if (trendDirection) {
    pills.push({
      key: 'trend',
      label: trendDirection === 'up' ? '↑ Uptrend' : '↓ Downtrend',
      colorClass: trendDirection === 'up' ? 'text-bullish' : 'text-bearish',
      clear: () => setFilter('trendDirection', null),
    })
  }
  if (selectedSectors?.length) {
    const label = selectedSectors.length === 1
      ? selectedSectors[0]
      : `${selectedSectors.length} Sectors`
    pills.push({ key: 'sectors', label, clear: () => setSelectedSectors(null) })
  }
  if (peMin !== null || peMax !== null) {
    const lo = peMin !== null ? `≥${peMin}` : ''
    const hi = peMax !== null ? `≤${peMax}` : ''
    pills.push({
      key: 'pe',
      label: `P/E ${[lo, hi].filter(Boolean).join(' ')}`,
      clear: () => setFilters({ peMin: null, peMax: null }),
    })
  }
  if (deMin !== null || deMax !== null) {
    const lo = deMin !== null ? `≥${deMin}` : ''
    const hi = deMax !== null ? `≤${deMax}` : ''
    pills.push({
      key: 'de',
      label: `D/E ${[lo, hi].filter(Boolean).join(' ')}`,
      clear: () => setFilters({ deMin: null, deMax: null }),
    })
  }
  if (roeMin !== null || roeMax !== null) {
    const lo = roeMin !== null ? `≥${roeMin}%` : ''
    const hi = roeMax !== null ? `≤${roeMax}%` : ''
    pills.push({
      key: 'roe',
      label: `ROE ${[lo, hi].filter(Boolean).join(' ')}`,
      clear: () => setFilters({ roeMin: null, roeMax: null }),
    })
  }
  if (fcfFilter !== 'any') {
    pills.push({
      key: 'fcf',
      label: fcfFilter === 'positive' ? 'FCF +' : 'FCF –',
      clear: () => setFilter('fcfFilter', 'any'),
    })
  }
  if (rsiMin > 0 || rsiMax < 100) {
    pills.push({
      key: 'rsi',
      label: `RSI ${rsiMin}–${rsiMax}`,
      clear: () => setFilters({ rsiMin: 0, rsiMax: 100 }),
    })
  }
  if (macdFilter !== 'any') {
    pills.push({
      key: 'macd',
      label: 'MACD Bullish',
      clear: () => setFilter('macdFilter', 'any'),
    })
  }
  if (hideMockData) {
    pills.push({
      key: 'realdata',
      label: 'Real Data Only',
      clear: toggleHideMockData,
    })
  }
  return pills
}

export function ActiveFilterBar() {
  const filterPanelOpen   = useAppStore(s => s.filterPanelOpen)
  const toggleFilterPanel = useAppStore(s => s.toggleFilterPanel)
  const clearAllFilters   = useAppStore(s => s.clearAllFilters)
  const trendDirection    = useAppStore(s => s.trendDirection)
  const selectedSectors   = useAppStore(s => s.selectedSectors)
  const peMin             = useAppStore(s => s.peMin)
  const peMax             = useAppStore(s => s.peMax)
  const deMin             = useAppStore(s => s.deMin)
  const deMax             = useAppStore(s => s.deMax)
  const roeMin            = useAppStore(s => s.roeMin)
  const roeMax            = useAppStore(s => s.roeMax)
  const fcfFilter         = useAppStore(s => s.fcfFilter)
  const rsiMin            = useAppStore(s => s.rsiMin)
  const rsiMax            = useAppStore(s => s.rsiMax)
  const macdFilter        = useAppStore(s => s.macdFilter)
  const hideMockData      = useAppStore(s => s.hideMockData)
  const setFilter         = useAppStore(s => s.setFilter)
  const setFilters        = useAppStore(s => s.setFilters)
  const setSelectedSectors = useAppStore(s => s.setSelectedSectors)
  const toggleHideMockData = useAppStore(s => s.toggleHideMockData)

  const pills = buildPills({
    trendDirection, selectedSectors, peMin, peMax, deMin, deMax,
    roeMin, roeMax, fcfFilter, rsiMin, rsiMax, macdFilter, hideMockData,
    setFilter, setFilters, setSelectedSectors, toggleHideMockData,
  })

  const hasFilters = pills.length > 0

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-bg shrink-0 min-h-[40px] flex-wrap">
      {/* Filter panel toggle */}
      <button
        type="button"
        onClick={toggleFilterPanel}
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded border transition-colors shrink-0 ${
          filterPanelOpen
            ? 'bg-accent/20 border-accent text-accent'
            : 'border-border text-muted hover:border-accent/50 hover:text-body'
        }`}
      >
        <SlidersHorizontal size={11} />
        Filters
        {hasFilters && (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-price bg-accent text-white">
            {pills.length}
          </span>
        )}
      </button>

      {/* Active filter pills */}
      {pills.map(pill => (
        <span
          key={pill.key}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px]
                     bg-accent/10 border border-accent/30 text-accent rounded"
        >
          <span className={pill.colorClass || ''}>{pill.label}</span>
          <button
            type="button"
            onClick={pill.clear}
            className="text-muted hover:text-body ml-0.5 leading-none"
            aria-label={`Remove ${pill.label} filter`}
          >
            <X size={9} />
          </button>
        </span>
      ))}

      {/* Clear all */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="ml-auto text-[11px] text-muted hover:text-bearish transition-colors shrink-0"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
