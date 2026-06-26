import { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import { calcMACD } from '../../data/indicators.js'
import { sliceByTimeframe } from '../../data/mockPriceHistory.js'

const DARK_OPTS = {
  layout: { background: { color: '#111827' }, textColor: '#6B7280' },
  grid: { vertLines: { color: '#1F2937' }, horzLines: { color: '#1F2937' } },
  rightPriceScale: { borderColor: '#1F2937', textColor: '#6B7280', scaleMargins: { top: 0.1, bottom: 0.1 } },
  timeScale: { borderColor: '#1F2937', textColor: '#6B7280' },
  crosshair: { mode: 1 },
}

/** @param {{ history: import('../../data/mockPriceHistory').Candle[], timeframe: string, onChartCreated?: (chart: any) => void }} props */
export function MACDChart({ history, timeframe, onChartCreated }) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const macdSeriesRef = useRef(null)
  const signalSeriesRef = useRef(null)
  const histSeriesRef = useRef(null)

  // Initialize chart (once on mount)
  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      ...DARK_OPTS,
      height: 120,
      width: containerRef.current.clientWidth,
    })

    const histSeries = chart.addHistogramSeries({
      priceLineVisible: false,
      lastValueVisible: false,
    })

    const macdSeries = chart.addLineSeries({
      color: '#3B82F6',
      lineWidth: 1.5,
      priceLineVisible: false,
      lastValueVisible: true,
    })

    const signalSeries = chart.addLineSeries({
      color: '#F97316',
      lineWidth: 1.5,
      priceLineVisible: false,
      lastValueVisible: true,
    })

    const ro = new ResizeObserver(entries => {
      for (const e of entries) chart.resize(e.contentRect.width, 120)
    })
    ro.observe(containerRef.current)

    chartRef.current = chart
    macdSeriesRef.current = macdSeries
    signalSeriesRef.current = signalSeries
    histSeriesRef.current = histSeries

    if (onChartCreated) onChartCreated(chart)

    return () => {
      ro.disconnect()
      if (onChartCreated) onChartCreated(null)
      chart.remove()
      chartRef.current = null
      macdSeriesRef.current = null
      signalSeriesRef.current = null
      histSeriesRef.current = null
    }
  }, [])

  // Feed data dynamically on timeframe / history changes
  useEffect(() => {
    const chart = chartRef.current
    const macdSeries = macdSeriesRef.current
    const signalSeries = signalSeriesRef.current
    const histSeries = histSeriesRef.current
    if (!chart || !macdSeries || !signalSeries || !histSeries) return

    const closes = history.map(c => c.close)
    const macdArr = calcMACD(closes, 12, 26, 9)

    const macdData = []
    const signalData = []
    const histData = []

    for (let i = 0; i < history.length; i++) {
      if (!macdArr[i]) continue
      const t = history[i].time
      macdData.push({ time: t, value: macdArr[i].macd })
      signalData.push({ time: t, value: macdArr[i].signal })
      histData.push({
        time: t,
        value: macdArr[i].hist,
        color: macdArr[i].hist >= 0 ? '#10B98160' : '#EF444460',
      })
    }

    const slicedMacd = sliceByTimeframe(macdData, timeframe)
    const slicedSignal = sliceByTimeframe(signalData, timeframe)
    const slicedHist = sliceByTimeframe(histData, timeframe)

    histSeries.setData(slicedHist)
    macdSeries.setData(slicedMacd)
    signalSeries.setData(slicedSignal)

    chart.timeScale().fitContent()
  }, [history, timeframe])

  return (
    <div>
      <div className="flex items-center gap-3 text-[10px] mb-1 px-0.5">
        <span className="text-muted">MACD (12, 26, 9)</span>
        <span className="text-accent">— MACD</span>
        <span style={{ color: '#F97316' }}>— Signal</span>
      </div>
      <div ref={containerRef} className="h-28 w-full rounded overflow-hidden" />
    </div>
  )
}
