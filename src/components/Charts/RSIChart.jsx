import { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import { calcRSI } from '../../data/indicators.js'

const DARK_OPTS = {
  layout: { background: { color: '#111827' }, textColor: '#6B7280' },
  grid: { vertLines: { color: '#1F2937' }, horzLines: { color: '#1F2937' } },
  rightPriceScale: { borderColor: '#1F2937', textColor: '#6B7280', scaleMargins: { top: 0.1, bottom: 0.1 } },
  timeScale: { borderColor: '#1F2937', textColor: '#6B7280', visible: false },
  crosshair: { mode: 1 },
}

/** @param {{ history: import('../../data/mockPriceHistory').Candle[] }} props */
export function RSIChart({ history }) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)

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
    chart.addLineSeries({
      color: '#EF4444',
      lineWidth: 1,
      lineStyle: 2, // dashed
      priceLineVisible: false,
      lastValueVisible: false,
    }).setData(history.map(c => ({ time: c.time, value: 70 })))

    // 30 line
    chart.addLineSeries({
      color: '#10B981',
      lineWidth: 1,
      lineStyle: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    }).setData(history.map(c => ({ time: c.time, value: 30 })))

    const closes = history.map(c => c.close)
    const rsiArr = calcRSI(closes, 14)
    const rsiData = history
      .map((c, i) => rsiArr[i] !== null ? { time: c.time, value: rsiArr[i] } : null)
      .filter(Boolean)

    rsiSeries.setData(rsiData)
    chart.timeScale().fitContent()

    const ro = new ResizeObserver(entries => {
      for (const e of entries) chart.resize(e.contentRect.width, 100)
    })
    ro.observe(containerRef.current)

    chartRef.current = chart
    return () => { ro.disconnect(); chart.remove(); chartRef.current = null }
  }, [history])

  return (
    <div>
      <div className="text-[10px] text-muted mb-1 px-0.5">RSI (14)</div>
      <div ref={containerRef} className="h-24 w-full rounded overflow-hidden" />
    </div>
  )
}
