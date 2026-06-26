import { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import { calcRSI } from '../../data/indicators.js'
import { sliceByTimeframe } from '../../data/mockPriceHistory.js'

const DARK_OPTS = {
  layout: { background: { color: '#111827' }, textColor: '#6B7280' },
  grid: { vertLines: { color: '#1F2937' }, horzLines: { color: '#1F2937' } },
  rightPriceScale: { borderColor: '#1F2937', textColor: '#6B7280', scaleMargins: { top: 0.1, bottom: 0.1 } },
  timeScale: { borderColor: '#1F2937', textColor: '#6B7280', visible: false },
  crosshair: { mode: 1 },
}

/** @param {{ history: import('../../data/mockPriceHistory').Candle[], timeframe: string, onChartCreated?: (chart: any) => void }} props */
export function RSIChart({ history, timeframe, onChartCreated }) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const rsiSeriesRef = useRef(null)
  const line70Ref = useRef(null)
  const line30Ref = useRef(null)

  // Initialize chart (once on mount)
  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      ...DARK_OPTS,
      height: 100,
      width: containerRef.current.clientWidth,
    })

    const rsiSeries = chart.addLineSeries({
      color: '#3B82F6',
      lineWidth: 1.5,
      priceLineVisible: false,
      lastValueVisible: true,
      priceFormat: { type: 'price', precision: 1, minMove: 0.1 },
    })

    // 70 line
    const line70 = chart.addLineSeries({
      color: '#EF4444',
      lineWidth: 1,
      lineStyle: 2, // dashed
      priceLineVisible: false,
      lastValueVisible: false,
    })

    // 30 line
    const line30 = chart.addLineSeries({
      color: '#10B981',
      lineWidth: 1,
      lineStyle: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    })

    const ro = new ResizeObserver(entries => {
      for (const e of entries) chart.resize(e.contentRect.width, 100)
    })
    ro.observe(containerRef.current)

    chartRef.current = chart
    rsiSeriesRef.current = rsiSeries
    line70Ref.current = line70
    line30Ref.current = line30

    if (onChartCreated) onChartCreated(chart)

    return () => {
      ro.disconnect()
      if (onChartCreated) onChartCreated(null)
      chart.remove()
      chartRef.current = null
      rsiSeriesRef.current = null
      line70Ref.current = null
      line30Ref.current = null
    }
  }, [])

  // Feed data dynamically on timeframe / history changes
  useEffect(() => {
    const chart = chartRef.current
    const rsiSeries = rsiSeriesRef.current
    const line70 = line70Ref.current
    const line30 = line30Ref.current
    if (!chart || !rsiSeries || !line70 || !line30) return

    const closes = history.map(c => c.close)
    const rsiArr = calcRSI(closes, 14)
    const rsiData = history
      .map((c, i) => rsiArr[i] !== null ? { time: c.time, value: rsiArr[i] } : null)
      .filter(Boolean)

    const slicedRsi = sliceByTimeframe(rsiData, timeframe)
    const slicedHistory = sliceByTimeframe(history, timeframe)

    rsiSeries.setData(slicedRsi)
    line70.setData(slicedHistory.map(c => ({ time: c.time, value: 70 })))
    line30.setData(slicedHistory.map(c => ({ time: c.time, value: 30 })))

    chart.timeScale().fitContent()
  }, [history, timeframe])

  return (
    <div>
      <div className="text-[10px] text-muted mb-1 px-0.5">RSI (14)</div>
      <div ref={containerRef} className="h-24 w-full rounded overflow-hidden" />
    </div>
  )
}
