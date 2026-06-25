import { useEffect, useCallback } from 'react'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
import { CandlestickChart } from '../Charts/CandlestickChart.jsx'
import { RSIChart } from '../Charts/RSIChart.jsx'
import { MACDChart } from '../Charts/MACDChart.jsx'
import { FundamentalPanel } from './FundamentalPanel.jsx'
import { Badge } from '../UI/Badge.jsx'
import { getStockHistory } from '../../data/mockPriceHistory.js'
import { ALL_STOCKS_MAP } from '../../data/indices.js'
import useAppStore from '../../store/useAppStore.js'

export default function StockTerminal() {
  const ticker = useAppStore(s => s.selectedStock)
  const setSelectedStock = useAppStore(s => s.setSelectedStock)

  const stock = ticker ? ALL_STOCKS_MAP[ticker] : null
  const history = ticker ? getStockHistory(ticker) : []

  const close = useCallback(() => setSelectedStock(null), [setSelectedStock])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [close])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!stock) return null

  const isUp = stock.changePct >= 0

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed inset-0 z-50 flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={`${stock.ticker} — ${stock.name}`}
      >
        <div className="flex flex-col h-full bg-bg border-l border-border mx-auto w-full max-w-[1400px]">

          {/* Header */}
          <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface shrink-0">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-heading font-semibold text-base font-price">{stock.ticker}</span>
                  <span className={`font-price text-base font-medium ${isUp ? 'text-bullish' : 'text-bearish'}`}>
                    ฿{stock.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <Badge variant={isUp ? 'bullish' : 'bearish'}>
                    {isUp ? '+' : ''}{stock.changePct.toFixed(2)}%
                  </Badge>
                  {isUp
                    ? <TrendingUp size={14} className="text-bullish" />
                    : <TrendingDown size={14} className="text-bearish" />
                  }
                </div>
                <p className="text-muted text-xs mt-0.5">{stock.name}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={close}
              aria-label="Close terminal"
              className="p-1.5 rounded text-muted hover:text-heading hover:bg-surface transition-colors"
            >
              <X size={18} />
            </button>
          </header>

          {/* Body — two-panel */}
          <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">

            {/* Left: Charts (65%) */}
            <div className="flex-1 lg:w-[65%] overflow-y-auto p-4 flex flex-col gap-4 border-r border-border">
              <CandlestickChart history={history} />
              <RSIChart history={history} />
              <MACDChart history={history} />
            </div>

            {/* Right: Fundamentals (35%) */}
            <div className="lg:w-[35%] overflow-y-auto p-4">
              <FundamentalPanel ticker={ticker} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
