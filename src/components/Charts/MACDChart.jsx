import { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import { calcMACD } from '../../data/indicators.js'

const DARK_OPTS = {
  layout: { background: { color: '#111827' }, textColor: '#6B7280' },
  grid: { vertLines: { color: '#1F2937' }, horzLines: { color: '#1F2937' } },
  rightPriceScale: { borderColor: '#1F2937', textColor: '#6B7280', scaleMargins: { top: 0.1, bottom: 0.1 } },
  timeScale: { borderColor: '#1F2937', textColor: '#6B7280' },
  crosshair: { mode: 1 },
}

/** @param {{ history: import('../../data/mockPriceHistory').Candle[] }} props */
export function MACDChart({ history }) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      ...DARK_OPTS,
      height: 120,
      width: containerRef.current.clientWidth,
    })

    const closes = history.map(c => c.close)
    const macdArr = calcMACD(closes, 12, 26, 9)

    const macdData    = []
    const signalData  = []
    const histData    = []

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

    chart.addHistogramSeries({
      priceLineVisible: false,
      lastValueVisible: false,
    }).setData(histData)

    chart.addLineSeries({
      color: '#3B82F6',
      lineWidth: 1.5,
      priceLineVisible: false,
      lastValueVisible: true,
    }).setData(macdData)

    chart.addLineSeries({
      color: '#F97316',
      lineWidth: 1.5,
      priceLineVisible: false,
      lastValueVisible: true,
    }).setData(signalData)

    chart.timeScale().fitContent()

    const ro = new ResizeObserver(entries => {
      for (const e of entries) chart.resize(e.contentRect.width, 120)
    })
    ro.observe(containerRef.current)

    chartRef.current = chart
    return () => { ro.disconnect(); chart.remove(); chartRef.current = null }
  }, [history])

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
