import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { createChart } from 'lightweight-charts'
import { ChartOverlayControls } from './ChartOverlayControls.jsx'
import { sliceByTimeframe, SET_INDEX_HISTORY } from '../../data/mockPriceHistory.js'
import { calcSMA, calcEMA, calcBollingerBands, calcSupportResistance } from '../../data/indicators.js'

const DARK_CHART_OPTIONS = {
  layout: { background: { color: '#111827' }, textColor: '#6B7280' },
  grid: { vertLines: { color: '#1F2937' }, horzLines: { color: '#1F2937' } },
  crosshair: {
    mode: 1,
    vertLine: { color: '#374151', width: 1, style: 3 },
    horzLine: { color: '#374151', width: 1, style: 3 },
  },
  rightPriceScale: { borderColor: '#1F2937', textColor: '#6B7280' },
  timeScale: { borderColor: '#1F2937', textColor: '#6B7280', timeVisible: true },
}

const SET_INDEX_MAP = new Map(SET_INDEX_HISTORY.map(c => [c.time, c.close]))

/** @param {{ history: import('../../data/mockPriceHistory').Candle[], timeframe: string, onChartCreated?: (chart: any) => void }} props */
export function CandlestickChart({ history, timeframe, onChartCreated }) {
  const chartContainerRef = useRef(null)
  const volumeContainerRef = useRef(null)
  const chartRef = useRef(null)
  const volumeChartRef = useRef(null)
  const candleSeriesRef = useRef(null)
  const volumeSeriesRef = useRef(null)
  const overlaySeriesRef = useRef({}) // key → series instance

  const [activeOverlays, setActiveOverlays] = useState({ EMA200: true })

  // Pre-compute all indicator arrays — stable as long as `history` reference is stable
  const overlayData = useMemo(() => {
    const closes = history.map(c => c.close)
    return {
      SMA20:  calcSMA(closes, 20),
      SMA50:  calcSMA(closes, 50),
      EMA20:  calcEMA(closes, 20),
      EMA50:  calcEMA(closes, 50),
      EMA200: calcEMA(closes, 200),
      BOLL:   calcBollingerBands(closes, 20, 2),
      SR:     calcSupportResistance(history),
    }
  }, [history])

  // ── Chart init (once per mount) ──────────────────────────────────────────────
  useEffect(() => {
    if (!chartContainerRef.current || !volumeContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      ...DARK_CHART_OPTIONS,
      height: chartContainerRef.current.clientHeight || 300,
      width: chartContainerRef.current.clientWidth,
    })

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#10B981', downColor: '#EF4444',
      borderUpColor: '#10B981', borderDownColor: '#EF4444',
      wickUpColor: '#10B981', wickDownColor: '#EF4444',
    })

    const volChart = createChart(volumeContainerRef.current, {
      ...DARK_CHART_OPTIONS,
      height: 60,
      width: volumeContainerRef.current.clientWidth,
    })
    const volSeries = volChart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    })
    volChart.priceScale('').applyOptions({ scaleMargins: { top: 0.1, bottom: 0 } })

    // Sync crosshair
    chart.subscribeCrosshairMove(param => {
      if (param.time) volChart.setCrosshairPosition(0, param.time, volSeries)
      else volChart.clearCrosshairPosition()
    })

    const ro = new ResizeObserver(() => {
      const w = chartContainerRef.current?.clientWidth ?? 0
      const h = chartContainerRef.current?.clientHeight ?? 300
      if (w > 0) { chart.resize(w, h); volChart.resize(w, 60) }
    })
    ro.observe(chartContainerRef.current)

    chartRef.current = chart
    volumeChartRef.current = volChart
    candleSeriesRef.current = candleSeries
    volumeSeriesRef.current = volSeries

    if (onChartCreated) onChartCreated(chart)

    return () => {
      ro.disconnect()
      if (onChartCreated) onChartCreated(null)
      chart.remove()
      volChart.remove()
      chartRef.current = null
      volumeChartRef.current = null
      candleSeriesRef.current = null
      volumeSeriesRef.current = null
      overlaySeriesRef.current = {}
    }
  }, [])

  // ── Feed candle + volume + overlay data when timeframe changes ───────────────
  useEffect(() => {
    const candle = candleSeriesRef.current
    const vol = volumeSeriesRef.current
    const chart = chartRef.current
    if (!candle || !vol || !chart) return

    const sliced = sliceByTimeframe(history, timeframe)

    candle.setData(sliced.map(c => ({
      time: c.time, open: c.open, high: c.high, low: c.low, close: c.close,
    })))
    vol.setData(sliced.map(c => ({
      time: c.time, value: c.volume,
      color: c.close >= c.open ? '#10B98130' : '#EF444430',
    })))

    // Update active overlays with the new timeframe's sliced data
    const defs = buildOverlayDefs(sliced)
    Object.entries(activeOverlays).forEach(([key, active]) => {
      if (!active) return

      const groupKeys = key === 'BOLL'
        ? ['BOLL_U', 'BOLL_M', 'BOLL_L']
        : key === 'SET_INDEX' ? ['SET'] : [key]

      for (const gk of groupKeys) {
        const series = overlaySeriesRef.current[gk]
        const def = defs[gk]
        if (series && def) {
          series.setData(def.data())
        }
      }

      if (key === 'SR') {
        const lines = overlaySeriesRef.current._srLines ?? []
        for (const ln of lines) {
          try { candleSeriesRef.current?.removePriceLine(ln) } catch {}
        }
        const sr = overlayData.SR
        const allLevels = [
          ...sr.support.map(p => ({ price: p, color: '#10B98160', axisLabelVisible: false })),
          ...sr.resistance.map(p => ({ price: p, color: '#EF444460', axisLabelVisible: false })),
        ]
        overlaySeriesRef.current._srLines = allLevels.map(lvl =>
          candleSeriesRef.current?.createPriceLine(lvl)
        ).filter(Boolean)
      }
    })

    chart.timeScale().fitContent()
    volumeChartRef.current?.timeScale().fitContent()
  }, [history, timeframe, activeOverlays, buildOverlayDefs, overlayData])

  // ── Build overlay data helpers ────────────────────────────────────────────────
  const buildOverlayDefs = useCallback((sliced) => {
    const historyIndexMap = new Map(history.map((c, i) => [c.time, i]))

    const fromIndicator = (arr) =>
      sliced.map(c => {
        const i = historyIndexMap.get(c.time)
        const v = i !== undefined ? arr[i] : null
        return v !== null && v !== undefined ? { time: c.time, value: v } : null
      }).filter(Boolean)

    const fromBoll = (band) =>
      sliced.map(c => {
        const i = historyIndexMap.get(c.time)
        const v = i !== undefined ? overlayData.BOLL[i] : null
        return v ? { time: c.time, value: v[band] } : null
      }).filter(Boolean)

    return {
      SMA20:  { color: '#F59E0B', data: () => fromIndicator(overlayData.SMA20) },
      SMA50:  { color: '#8B5CF6', data: () => fromIndicator(overlayData.SMA50) },
      EMA20:  { color: '#06B6D4', data: () => fromIndicator(overlayData.EMA20) },
      EMA50:  { color: '#EC4899', data: () => fromIndicator(overlayData.EMA50) },
      EMA200: { color: '#F97316', lineWidth: 2, data: () => fromIndicator(overlayData.EMA200) },
      BOLL_U: { color: '#9CA3AF50', lineStyle: 2, data: () => fromBoll('upper') },
      BOLL_M: { color: '#9CA3AF',   lineStyle: 2, data: () => fromBoll('mid') },
      BOLL_L: { color: '#9CA3AF50', lineStyle: 2, data: () => fromBoll('lower') },
      SET: {
        color: '#6B728050', lineStyle: 2,
        data: () => {
          const firstSliced = sliced[0]
          if (!firstSliced) return []
          const setBase = SET_INDEX_MAP.get(firstSliced.time) ?? 1
          const stockBase = firstSliced.close
          return sliced.map(c => {
            const setClose = SET_INDEX_MAP.get(c.time)
            if (!setClose) return null
            // Normalize SET index to stock's price scale
            return { time: c.time, value: stockBase * (setClose / setBase) }
          }).filter(Boolean)
        },
      },
    }
  }, [history, overlayData])

  // ── Toggle overlays ───────────────────────────────────────────────────────────
  const toggleOverlay = useCallback((key) => {
    const chart = chartRef.current
    if (!chart) return

    setActiveOverlays(prev => {
      const next = { ...prev, [key]: !prev[key] }
      const sliced = sliceByTimeframe(history, timeframe)
      const defs = buildOverlayDefs(sliced)

      // Resolve which internal series keys this overlay controls
      const groupKeys = key === 'BOLL'
        ? ['BOLL_U', 'BOLL_M', 'BOLL_L']
        : key === 'SET_INDEX' ? ['SET'] : [key]

      // Remove existing series for this group
      for (const gk of groupKeys) {
        if (overlaySeriesRef.current[gk]) {
          try { chart.removeSeries(overlaySeriesRef.current[gk]) } catch { /* already removed */ }
          delete overlaySeriesRef.current[gk]
        }
      }

      // Add if turning on
      if (!prev[key]) {
        for (const gk of groupKeys) {
          const def = defs[gk]
          if (!def) continue
          const s = chart.addLineSeries({
            color: def.color ?? '#6B7280',
            lineWidth: def.lineWidth ?? 1,
            lineStyle: def.lineStyle ?? 0,
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: false,
          })
          s.setData(def.data())
          overlaySeriesRef.current[gk] = s
        }

        // S/R: add horizontal price lines to candle series instead
        if (key === 'SR') {
          const sr = overlayData.SR
          const allLevels = [
            ...sr.support.map(p => ({ price: p, color: '#10B98160', axisLabelVisible: false })),
            ...sr.resistance.map(p => ({ price: p, color: '#EF444460', axisLabelVisible: false })),
          ]
          overlaySeriesRef.current._srLines = allLevels.map(lvl =>
            candleSeriesRef.current?.createPriceLine(lvl)
          ).filter(Boolean)
        }
      } else if (key === 'SR') {
        // Remove SR price lines
        const lines = overlaySeriesRef.current._srLines ?? []
        for (const ln of lines) {
          try { candleSeriesRef.current?.removePriceLine(ln) } catch {}
        }
        delete overlaySeriesRef.current._srLines
      }

      return next
    })
  }, [history, timeframe, buildOverlayDefs, overlayData])

  // ── Apply EMA200 on first mount ───────────────────────────────────────────────
  const ema200Applied = useRef(false)
  useEffect(() => {
    if (!ema200Applied.current && chartRef.current) {
      ema200Applied.current = true
      toggleOverlay('EMA200')
    }
  }, [toggleOverlay])

  return (
    <div className="flex flex-col gap-2">
      {/* Timeframe + overlay row */}
      <div className="flex items-center justify-end flex-wrap gap-2">
        <ChartOverlayControls activeOverlays={activeOverlays} onToggle={toggleOverlay} />
      </div>

      {/* Main chart */}
      <div ref={chartContainerRef} className="h-72 w-full rounded overflow-hidden" />
      {/* Volume */}
      <div ref={volumeContainerRef} className="h-16 w-full rounded overflow-hidden" />
    </div>
  )
}
