import { useEffect, useCallback, useState } from 'react'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
import { CandlestickChart } from '../Charts/CandlestickChart.jsx'
import { RSIChart } from '../Charts/RSIChart.jsx'
import { MACDChart } from '../Charts/MACDChart.jsx'
import { FundamentalPanel } from './FundamentalPanel.jsx'
import { Badge } from '../UI/Badge.jsx'
import { getStockHistory } from '../../data/mockPriceHistory.js'
import { ALL_STOCKS_MAP } from '../../data/indices.js'
import useAppStore from '../../store/useAppStore.js'

const TIMEFRAMES = ['1D', '1W', '1M', '1Y', 'ALL']

export default function StockTerminal() {
  const ticker = useAppStore(s => s.selectedStock)
  const setSelectedStock = useAppStore(s => s.setSelectedStock)
  const [timeframe, setTimeframe] = useState('1Y')
  const [charts, setCharts] = useState({ main: null, rsi: null, macd: null })

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

  // Synchronise timescales of all 3 charts
  useEffect(() => {
    const { main, rsi, macd } = charts
    if (!main || !rsi || !macd) return

    let isSyncing = false

    const handleMainRange = (range) => {
      if (isSyncing || !range) return
      isSyncing = true
      rsi.timeScale().setVisibleLogicalRange(range)
      macd.timeScale().setVisibleLogicalRange(range)
      isSyncing = false
    }

    const handleRsiRange = (range) => {
      if (isSyncing || !range) return
      isSyncing = true
      main.timeScale().setVisibleLogicalRange(range)
      macd.timeScale().setVisibleLogicalRange(range)
      isSyncing = false
    }

    const handleMacdRange = (range) => {
      if (isSyncing || !range) return
      isSyncing = true
      main.timeScale().setVisibleLogicalRange(range)
      rsi.timeScale().setVisibleLogicalRange(range)
      isSyncing = false
    }

    main.timeScale().subscribeVisibleLogicalRangeChange(handleMainRange)
    rsi.timeScale().subscribeVisibleLogicalRangeChange(handleRsiRange)
    macd.timeScale().subscribeVisibleLogicalRangeChange(handleMacdRange)

    return () => {
      try { main.timeScale().unsubscribeVisibleLogicalRangeChange(handleMainRange) } catch {}
      try { rsi.timeScale().unsubscribeVisibleLogicalRangeChange(handleRsiRange) } catch {}
      try { macd.timeScale().unsubscribeVisibleLogicalRangeChange(handleMacdRange) } catch {}
    }
  }, [charts])

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
                  {!stock.isRealData && (
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded
                                     bg-amber-500/10 text-amber-500/80 border border-amber-500/25">
                      MOCK DATA
                    </span>
                  )}
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
              {/* Range Selector Bar */}
              <div className="flex items-center gap-1 bg-surface/40 p-1 border border-border/40 rounded shrink-0">
                <span className="text-[10px] text-muted px-2 uppercase font-semibold tracking-wider">Range</span>
                {TIMEFRAMES.map(tf => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf)}
                    aria-pressed={timeframe === tf}
                    className={`px-3 py-1 text-[10px] font-medium rounded transition-colors
                      ${timeframe === tf ? 'bg-accent text-white font-semibold' : 'text-muted hover:text-body hover:bg-surface'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <CandlestickChart
                history={history}
                timeframe={timeframe}
                onChartCreated={c => setCharts(prev => ({ ...prev, main: c }))}
              />
              <RSIChart
                history={history}
                timeframe={timeframe}
                onChartCreated={c => setCharts(prev => ({ ...prev, rsi: c }))}
              />
              <MACDChart
                history={history}
                timeframe={timeframe}
                onChartCreated={c => setCharts(prev => ({ ...prev, macd: c }))}
              />
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
