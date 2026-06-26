import { useState } from 'react'

/**
 * @param {{ text: string, children: React.ReactNode, className?: string }} props
 */
export function Tooltip({ text, children, className = '' }) {
  const [visible, setVisible] = useState(false)

  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50
                     bg-surface border border-border text-body text-xs rounded px-2 py-1
                     max-w-[200px] whitespace-normal text-center shadow-lg pointer-events-none"
        >
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border" />
        </span>
      )}
    </span>
  )
}
