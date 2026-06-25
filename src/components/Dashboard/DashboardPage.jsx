import { lazy, Suspense, useCallback } from 'react'
import { Download } from 'lucide-react'
import { TopBar } from './TopBar.jsx'
import { MarketOverviewBar } from './MarketOverviewBar.jsx'
import { ScannerBar } from './ScannerBar.jsx'
import { StockTable } from './StockTable.jsx'
import { Spinner } from '../UI/Spinner.jsx'
import useAppStore from '../../store/useAppStore.js'
import { useFilteredStocks } from '../../hooks/useFilteredStocks.js'
import { exportToCSV } from '../../utils/exportCsv.js'

const StockTerminal = lazy(() => import('../Terminal/StockTerminal.jsx'))

export default function DashboardPage() {
  const searchQuery    = useAppStore(s => s.searchQuery)
  const activeScanners = useAppStore(s => s.activeScanners)
  const trendHorizon   = useAppStore(s => s.trendHorizon)
  const trendDirection = useAppStore(s => s.trendDirection)
  const todayDirection = useAppStore(s => s.todayDirection)
  const sortKey        = useAppStore(s => s.sortKey)
  const sortDir        = useAppStore(s => s.sortDir)
  const activeIndex    = useAppStore(s => s.activeIndex)
  const hideMockData   = useAppStore(s => s.hideMockData)
  const selectedStock  = useAppStore(s => s.selectedStock)

  const { stocks, totalCount, scannerCounts } = useFilteredStocks({
    activeIndex,
    searchQuery,
    activeScanners,
    trendHorizon,
    trendDirection,
    todayDirection,
    hideMockData,
    sortKey,
    sortDir,
  })

  const handleExport = useCallback(() => {
    exportToCSV(stocks, { activeIndex, trendHorizon })
  }, [stocks, activeIndex, trendHorizon])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      <MarketOverviewBar />
      <ScannerBar scannerCounts={scannerCounts} />

      {/* Row count + export */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-border/40 shrink-0">
        <span className="text-[10px] text-muted">
          {stocks.length} / {totalCount} stocks
        </span>
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

      <StockTable stocks={stocks} />

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
