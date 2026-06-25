/**
 * @param {{
 *   active?: boolean,
 *   variant?: 'default'|'bullish'|'bearish',
 *   count?: number,
 *   onClick?: () => void,
 *   children: React.ReactNode,
 *   className?: string
 * }} props
 */
export function Chip({ active = false, variant = 'default', count, onClick, children, className = '' }) {
  const activeStyles = {
    default:  'bg-accent border-accent text-white',
    bullish:  'bg-bullish border-bullish text-white',
    bearish:  'bg-bearish border-bearish text-white',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded
        border transition-colors duration-150 cursor-pointer
        ${active
          ? activeStyles[variant]
          : 'bg-transparent border-border text-muted hover:border-accent/50 hover:text-body'
        } ${className}
      `}
    >
      {children}
      {count !== undefined && (
        <span className={`
          inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-price
          ${active ? 'bg-white/20 text-white' : 'bg-border text-muted'}
        `}>
          {count}
        </span>
      )}
    </button>
  )
}
