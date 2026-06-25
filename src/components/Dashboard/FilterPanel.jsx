import { X, SlidersHorizontal } from 'lucide-react'
import useAppStore from '../../store/useAppStore.js'
import { PRESETS } from '../../data/screenerPresets.js'
import { INDICES_MAP } from '../../data/indices.js'

function Section({ title, children }) {
  return (
    <div className="py-3 border-b border-border/30 last:border-0">
      <p className="text-[9px] text-muted uppercase tracking-widest mb-2.5">{title}</p>
      {children}
    </div>
  )
}

function NumInput({ value, onChange, placeholder, min, max }) {
  return (
    <input
      type="number"
      value={value ?? ''}
      min={min}
      max={max}
      onChange={e => onChange(e.target.value === '' ? null : +e.target.value)}
      placeholder={placeholder || '--'}
      className="w-[68px] bg-bg border border-border text-body text-xs font-price rounded
                 px-2 py-1 focus:outline-none focus:border-accent/60 placeholder:text-muted/30"
    />
  )
}

function RangeRow({ label, minVal, maxVal, onMinChange, onMaxChange }) {
  return (
    <div className="mb-2 last:mb-0">
      <p className="text-[10px] text-muted mb-1">{label}</p>
      <div className="flex items-center gap-1.5">
        <NumInput value={minVal} onChange={onMinChange} placeholder="min" />
        <span className="text-muted text-xs">-</span>
        <NumInput value={maxVal} onChange={onMaxChange} placeholder="max" />
      </div>
    </div>
  )
}

function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer group">
          <input
            type="radio"
            name={name}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-accent w-3 h-3"
          />
          <span className="text-[11px] text-muted group-hover:text-body transition-colors">{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

const TREND_OPTS = [
  { dir: null,   label: 'All',         cls: 'text-muted' },
  { dir: 'up',   label: 'Up Trend',    cls: 'text-bullish' },
  { dir: 'down', label: 'Down Trend',  cls: 'text-bearish' },
]

export function FilterPanel() {
  const activeIndex        = useAppStore(s => s.activeIndex)
  const activePreset       = useAppStore(s => s.activePreset)
  const selectedSectors    = useAppStore(s => s.selectedSectors)
  const trendDirection     = useAppStore(s => s.trendDirection)
  const peMin              = useAppStore(s => s.peMin)
  const peMax              = useAppStore(s => s.peMax)
  const deMin              = useAppStore(s => s.deMin)
  const deMax              = useAppStore(s => s.deMax)
  const roeMin             = useAppStore(s => s.roeMin)
  const roeMax             = useAppStore(s => s.roeMax)
  const fcfFilter          = useAppStore(s => s.fcfFilter)
  const rsiMin             = useAppStore(s => s.rsiMin)
  const rsiMax             = useAppStore(s => s.rsiMax)
  const macdFilter         = useAppStore(s => s.macdFilter)
  const hideMockData       = useAppStore(s => s.hideMockData)
  const setFilter          = useAppStore(s => s.setFilter)
  const setSelectedSectors = useAppStore(s => s.setSelectedSectors)
  const setTrendDirection  = useAppStore(s => s.setTrendDirection)
  const applyPreset        = useAppStore(s => s.applyPreset)
  const clearAllFilters    = useAppStore(s => s.clearAllFilters)
  const toggleFilterPanel  = useAppStore(s => s.toggleFilterPanel)
  const toggleHideMockData = useAppStore(s => s.toggleHideMockData)

  const allSectors = INDICES_MAP[activeIndex]?.sectors ?? []

  function isSectorSelected(sector) {
    return selectedSectors === null || selectedSectors.includes(sector)
  }

  function toggleSector(sector) {
    if (selectedSectors === null) {
      const next = allSectors.filter(s => s !== sector)
      setSelectedSectors(next.length === 0 ? null : next)
    } else if (selectedSectors.includes(sector)) {
      const next = selectedSectors.filter(s => s !== sector)
      setSelectedSectors(next.length === 0 ? null : next)
    } else {
      const next = [...selectedSectors, sector]
      setSelectedSectors(next.length === allSectors.length ? null : next)
    }
  }

  return (
    <div className="flex flex-col w-[248px] shrink-0 border-r border-border bg-surface/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface/80 shrink-0">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={12} className="text-accent" />
          <span className="text-xs font-medium text-heading uppercase tracking-wider">Filters</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={clearAllFilters} className="text-[10px] text-muted hover:text-bearish transition-colors">Clear all</button>
          <button type="button" onClick={toggleFilterPanel} className="text-muted hover:text-body" aria-label="Close filters"><X size={12} /></button>
        </div>
      </div>

      <div className="px-4 pb-4 overflow-y-auto flex-1">
        <Section title="Screener Presets">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(p => (
              <button key={p.id} type="button" title={p.description}
                onClick={() => activePreset === p.id ? clearAllFilters() : applyPreset(p.id)}
                className={activePreset === p.id
                  ? 'text-[11px] px-2 py-0.5 rounded border bg-accent/20 border-accent text-accent'
                  : 'text-[11px] px-2 py-0.5 rounded border bg-transparent border-border text-muted hover:border-accent/50 hover:text-body'}
              >{p.label}</button>
            ))}
          </div>
        </Section>

        <Section title="Sector">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted">{allSectors.length} sectors</span>
            <button type="button" onClick={() => setSelectedSectors(null)}
              className={selectedSectors === null ? 'text-[10px] text-accent' : 'text-[10px] text-muted hover:text-body'}>All</button>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {allSectors.map(sector => (
              <label key={sector} className="flex items-center gap-1.5 cursor-pointer group">
                <input type="checkbox" checked={isSectorSelected(sector)} onChange={() => toggleSector(sector)} className="accent-accent w-3 h-3 shrink-0" />
                <span className="text-[10px] text-muted group-hover:text-body transition-colors truncate">{sector}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="Trend">
          <div className="flex gap-1.5">
            {TREND_OPTS.map(({ dir, label, cls }) => (
              <button key={String(dir)} type="button"
                onClick={() => dir === null ? setFilter('trendDirection', null) : setTrendDirection(dir)}
                className={'text-[11px] px-2 py-1 rounded border flex-1 transition-colors ' +
                  (trendDirection === dir ? 'bg-accent/20 border-accent text-accent' : 'bg-transparent border-border hover:border-accent/50 ' + cls)}
              >{label}</button>
            ))}
          </div>
        </Section>

        <Section title="Technicals">
          <div className="mb-3">
            <p className="text-[10px] text-muted mb-1">RSI (14)</p>
            <div className="flex items-center gap-1.5">
              <NumInput value={rsiMin === 0 ? null : rsiMin} onChange={v => setFilter('rsiMin', v === null ? 0 : Math.max(0, Math.min(99, v)))} placeholder="0" min={0} max={99} />
              <span className="text-muted text-xs">-</span>
              <NumInput value={rsiMax === 100 ? null : rsiMax} onChange={v => setFilter('rsiMax', v === null ? 100 : Math.max(1, Math.min(100, v)))} placeholder="100" min={1} max={100} />
            </div>
          </div>
          <p className="text-[10px] text-muted mb-1.5">MACD Signal</p>
          <RadioGroup name="macd" value={macdFilter} onChange={v => setFilter('macdFilter', v)}
            options={[{ value: 'any', label: 'Any' }, { value: 'bullish', label: 'Bullish Cross' }]} />
        </Section>

        <Section title="Fundamentals">
          <RangeRow label="P/E Ratio" minVal={peMin} maxVal={peMax} onMinChange={v => setFilter('peMin', v)} onMaxChange={v => setFilter('peMax', v)} />
          <RangeRow label="D/E Ratio" minVal={deMin} maxVal={deMax} onMinChange={v => setFilter('deMin', v)} onMaxChange={v => setFilter('deMax', v)} />
          <RangeRow label="ROE %" minVal={roeMin} maxVal={roeMax} onMinChange={v => setFilter('roeMin', v)} onMaxChange={v => setFilter('roeMax', v)} />
          <div className="mt-2">
            <p className="text-[10px] text-muted mb-1.5">Free Cash Flow</p>
            <RadioGroup name="fcf" value={fcfFilter} onChange={v => setFilter('fcfFilter', v)}
              options={[{ value: 'any', label: 'Any' }, { value: 'positive', label: 'Positive' }, { value: 'negative', label: 'Negative' }]} />
          </div>
        </Section>

        <Section title="Data Quality">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={hideMockData} onChange={toggleHideMockData} className="accent-accent w-3 h-3" />
            <span className="text-[11px] text-muted group-hover:text-body transition-colors">Real data only</span>
          </label>
        </Section>
      </div>
    </div>
  )
}