import { lazy, Suspense } from 'react'
import { TopBar } from './TopBar.jsx'
import { MarketOverviewBar } from './MarketOverviewBar.jsx'
import { ScannerBar } from './ScannerBar.jsx'
import { StockTable } from './StockTable.jsx'
import { Spinner } from '../UI/Spinner.jsx'
import useAppStore from '../../store/useAppStore.js'
import { useFilteredStocks } from '../../hooks/useFilteredStocks.js'

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

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      <MarketOverviewBar />
      <ScannerBar scannerCounts={scannerCounts} />

      {/* Row count */}
      <div className="px-6 py-2 border-b border-border/40 text-[10px] text-muted shrink-0">
        {stocks.length} / {totalCount} stocks
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
