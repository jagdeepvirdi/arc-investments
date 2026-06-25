import { getFundamentals } from '../../data/fundamentals.js'
import { ALL_STOCKS_MAP } from '../../data/indices.js'
import { Badge } from '../UI/Badge.jsx'
import { Tooltip } from '../UI/Tooltip.jsx'
import { HelpCircle } from 'lucide-react'

const METRIC_TIPS = {
  pe:            'Price-to-Earnings ratio. Lower may indicate undervaluation vs peers.',
  de:            'Debt-to-Equity ratio. Higher = more leverage.',
  fcf:           'Free Cash Flow in THB billions. Cash generated after capex.',
  roe:           'Return on Equity %. Measures profitability relative to shareholder equity.',
  dividendYield: 'Annual dividend as % of current price.',
}

function peBadge(pe, sectorAvgPE) {
  if (!pe || pe <= 0) return null
  const diff = ((pe - sectorAvgPE) / sectorAvgPE) * 100
  if (diff < -10) return <Badge variant="bullish">Below avg</Badge>
  if (diff > 10)  return <Badge variant="bearish">Above avg</Badge>
  return <Badge variant="neutral">In-line</Badge>
}

function MetricRow({ label, value, tip, extra }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
      <Tooltip text={tip} className="gap-1">
        <span className="text-muted text-xs">{label}</span>
        <HelpCircle size={11} className="text-muted/40" />
      </Tooltip>
      <div className="flex items-center gap-2">
        {extra}
        <span className="font-price text-xs text-heading">{value}</span>
      </div>
    </div>
  )
}

/** @param {{ ticker: string }} props */
export function FundamentalPanel({ ticker }) {
  const stock = ALL_STOCKS_MAP[ticker]
  const fund  = getFundamentals(ticker)
  if (!stock || !fund) return null

  const fmtPE  = fund.pe > 0 ? fund.pe.toFixed(1) + 'x' : '—'
  const fmtDE  = fund.de.toFixed(2) + 'x'
  const fmtFCF = (fund.fcf >= 0 ? '+' : '') + fund.fcf.toFixed(2) + ' B'
  const fmtROE = fund.roe.toFixed(1) + '%'
  const fmtDY  = fund.dividendYield.toFixed(2) + '%'

  return (
    <div className="flex flex-col gap-4">
      {/* Company info */}
      <div className="p-4 bg-surface border border-border rounded">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-heading font-semibold text-sm">{stock.name}</h2>
            <p className="text-muted text-xs mt-0.5">{stock.ticker}</p>
          </div>
          <Badge variant="info">{stock.sector}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <span className="text-muted">IPO Date</span>
          <span className="font-price text-body text-right">{stock.ipoDate}</span>
          <span className="text-muted">IPO Price</span>
          <span className="font-price text-body text-right">฿{stock.ipoPrice.toFixed(2)}</span>
          <span className="text-muted">Market Cap</span>
          <span className="font-price text-body text-right">฿{stock.marketCap.toFixed(1)}B</span>
        </div>
      </div>

      {/* Fundamentals */}
      <div className="p-4 bg-surface border border-border rounded">
        <h3 className="text-[10px] text-muted uppercase tracking-wider mb-1">Fundamentals</h3>
        <MetricRow
          label="P/E Ratio"
          value={fmtPE}
          tip={METRIC_TIPS.pe}
          extra={
            <span className="flex items-center gap-1.5">
              {peBadge(fund.pe, fund.sectorAvgPE)}
              <span className="text-muted text-[10px] font-price">Sector {fund.sectorAvgPE.toFixed(1)}x</span>
            </span>
          }
        />
        <MetricRow label="D/E Ratio"      value={fmtDE}  tip={METRIC_TIPS.de} />
        <MetricRow label="Free Cash Flow"  value={fmtFCF} tip={METRIC_TIPS.fcf} />
        <MetricRow label="ROE"             value={fmtROE} tip={METRIC_TIPS.roe} />
        <MetricRow label="Dividend Yield"  value={fmtDY}  tip={METRIC_TIPS.dividendYield} />
      </div>
    </div>
  )
}
