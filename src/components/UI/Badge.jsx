/**
 * @param {{ variant?: 'bullish'|'bearish'|'neutral'|'info', children: React.ReactNode, className?: string }} props
 */
export function Badge({ variant = 'neutral', children, className = '' }) {
  const variants = {
    bullish: 'bg-bullish/15 text-bullish border border-bullish/30',
    bearish: 'bg-bearish/15 text-bearish border border-bearish/30',
    neutral: 'bg-surface text-muted border border-border',
    info:    'bg-accent/15 text-accent border border-accent/30',
  }
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium font-price ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
