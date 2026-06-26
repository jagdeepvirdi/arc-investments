import { lazy, Suspense, useCallback, useRef, useState, useEffect } from 'react'
import { Download, Columns3 } from 'lucide-react'
import { TopBar } from './TopBar.jsx'
import { MarketOverviewBar } from './MarketOverviewBar.jsx'
import { ActiveFilterBar } from './ActiveFilterBar.jsx'
import { FilterPanel } from './FilterPanel.jsx'
import { StockTable } from './StockTable.jsx'
import { Spinner } from '../UI/Spinner.jsx'
import useAppStore from '../../store/useAppStore.js'
import { useFilteredStocks } from '../../hooks/useFilteredStocks.js'
import { exportToCSV } from '../../utils/exportCsv.js'

const StockTerminal = lazy(() => import('../Terminal/StockTerminal.jsx'))

const TOGGLEABLE_COLUMNS = [
  { key: 'name',           label: 'Company' },
  { key: 'sector',         label: 'Sector' },
  { key: 'currentPrice',   label: 'Price (THB)' },
  { key: 'trendBasePrice', label: 'Start Price' },
  { key: 'changePct',      label: 'Change %' },
  { key: 'volume',         label: 'Volume' },
  { key: 'pe',             label: 'P/E' },
  { key: 'de',             label: 'D/E' },
  { key: 'roe',            label: 'ROE' },
  { key: 'fcf',            label: 'FCF (B)' },
  { key: 'marketCap',      label: 'Mkt Cap (B)' },
]

function ColumnPicker() {
  const hiddenColumns = useAppStore(s => s.hiddenColumns)
  const toggleColumn  = useAppStore(s => s.toggleColumn)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  const hiddenCount = hiddenColumns.filter(k => TOGGLEABLE_COLUMNS.some(c => c.key === k)).length

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1.5 text-[10px] transition-colors
          ${open ? 'text-accent' : 'text-muted hover:text-accent'}`}
      >
        <Columns3 size={11} />
        Columns
        {hiddenCount > 0 && (
          <span className="px-1 py-0.5 rounded bg-accent/20 text-accent text-[9px] font-medium leading-none">
            {hiddenCount} hidden
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-30 w-44
                        bg-surface border border-border rounded shadow-lg py-1">
          {TOGGLEABLE_COLUMNS.map(col => {
            const visible = !hiddenColumns.includes(col.key)
            return (
              <label
                key={col.key}
                className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer
                           hover:bg-white/5 select-none"
              >
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={() => toggleColumn(col.key)}
                  className="accent-accent w-3 h-3"
                />
                <span className={`text-[11px] ${visible ? 'text-body' : 'text-muted'}`}>
                  {col.label}
                </span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const activeIndex      = useAppStore(s => s.activeIndex)
  const selectedStock    = useAppStore(s => s.selectedStock)
  const filterPanelOpen  = useAppStore(s => s.filterPanelOpen)
  const searchQuery      = useAppStore(s => s.searchQuery)
  const trendHorizon     = useAppStore(s => s.trendHorizon)
  const trendDirection   = useAppStore(s => s.trendDirection)
  const hideMockData     = useAppStore(s => s.hideMockData)
  const selectedSectors  = useAppStore(s => s.selectedSectors)
  const peMin            = useAppStore(s => s.peMin)
  const peMax            = useAppStore(s => s.peMax)
  const deMin            = useAppStore(s => s.deMin)
  const deMax            = useAppStore(s => s.deMax)
  const roeMin           = useAppStore(s => s.roeMin)
  const roeMax           = useAppStore(s => s.roeMax)
  const fcfFilter        = useAppStore(s => s.fcfFilter)
  const rsiMin           = useAppStore(s => s.rsiMin)
  const rsiMax           = useAppStore(s => s.rsiMax)
  const macdFilter       = useAppStore(s => s.macdFilter)
  const epsGrowthMin     = useAppStore(s => s.epsGrowthMin)
  const revenueGrowthMin = useAppStore(s => s.revenueGrowthMin)
  const divYieldMin      = useAppStore(s => s.divYieldMin)
  const payoutRatioMax   = useAppStore(s => s.payoutRatioMax)
  const sortKey          = useAppStore(s => s.sortKey)
  const sortDir          = useAppStore(s => s.sortDir)

  const { stocks, totalCount } = useFilteredStocks({
    activeIndex, searchQuery, trendHorizon, trendDirection, hideMockData,
    selectedSectors, peMin, peMax, deMin, deMax, roeMin, roeMax,
    fcfFilter, rsiMin, rsiMax, macdFilter,
    epsGrowthMin, revenueGrowthMin, divYieldMin, payoutRatioMax,
    sortKey, sortDir,
  })

  const handleExport = useCallback(() => {
    exportToCSV(stocks, { activeIndex, trendHorizon })
  }, [stocks, activeIndex, trendHorizon])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      <MarketOverviewBar />
      <ActiveFilterBar />

      {/* Main content row: optional filter panel + table */}
      <div className="flex flex-1 overflow-hidden">
        {filterPanelOpen && <FilterPanel />}

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Row count + export */}
          <div className="flex items-center justify-between px-6 py-2 border-b border-border/40 shrink-0">
            <span className="text-[10px] text-muted">
              {stocks.length} / {totalCount} stocks
            </span>
            <div className="flex items-center gap-4">
              <ColumnPicker />
              <button
                type="button"
                onClick={handleExport}
                disabled={stocks.length === 0}
                title={`Download ${stocks.length} rows as CSV`}
                className="flex items-center gap-1.5 text-[10px] text-muted hover:text-accent
                           disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Download size={11} />
                Export CSV
              </button>
            </div>
          </div>

          <StockTable stocks={stocks} />
        </div>
      </div>

      {selectedStock && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90">
            <Spinner size={32} />
          </div>
        }>
          <StockTerminal />
        </Suspense>
      )}
    </div>
  )
}
