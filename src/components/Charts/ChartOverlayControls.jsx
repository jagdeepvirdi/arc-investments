const OVERLAYS = [
  { key: 'SMA20',     label: 'SMA 20',   color: '#F59E0B' },
  { key: 'SMA50',     label: 'SMA 50',   color: '#8B5CF6' },
  { key: 'EMA20',     label: 'EMA 20',   color: '#06B6D4' },
  { key: 'EMA50',     label: 'EMA 50',   color: '#EC4899' },
  { key: 'EMA200',    label: 'EMA 200',  color: '#F97316' },
  { key: 'BOLL',      label: 'BB',       color: '#9CA3AF' },
  { key: 'SR',        label: 'S/R',      color: '#6B7280' },
  { key: 'SET_INDEX', label: 'SET',      color: '#6B7280' },
]

/**
 * @param {{
 *   activeOverlays: Record<string, boolean>,
 *   onToggle: (key: string) => void
 * }} props
 */
export function ChartOverlayControls({ activeOverlays, onToggle }) {
  return (
    <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Chart overlays">
      {OVERLAYS.map(o => {
        const isActive = !!activeOverlays[o.key]
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onToggle(o.key)}
            aria-pressed={isActive}
            className={`
              inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] rounded border transition-colors
              ${isActive
                ? 'border-current bg-transparent'
                : 'border-border text-muted hover:border-border/80 hover:text-body'
              }
            `}
            style={isActive ? { color: o.color, borderColor: o.color + '80' } : {}}
          >
            <span
              className="w-2.5 h-0.5 rounded-full inline-block"
              style={{ backgroundColor: isActive ? o.color : '#374151' }}
            />
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
