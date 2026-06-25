/**
 * Accessible dark-themed select replacement.
 * @param {{
 *   value: string,
 *   onChange: (v: string) => void,
 *   options: {value: string, label: string}[],
 *   label?: string,
 *   className?: string
 * }} props
 */
export function Dropdown({ value, onChange, options, label, className = '' }) {
  return (
    <label className={`inline-flex items-center gap-2 ${className}`}>
      {label && <span className="text-xs text-muted whitespace-nowrap">{label}</span>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-surface border border-border text-body text-xs rounded px-2 py-1.5
                   focus:outline-none focus:border-accent/60 cursor-pointer appearance-none
                   pr-6"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236B7280'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  )
}
