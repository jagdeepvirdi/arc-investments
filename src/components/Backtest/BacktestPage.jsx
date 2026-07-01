import { lazy, Suspense, useState, useMemo } from 'react'
import { Zap, BarChart2, List, TrendingUp, Calculator } from 'lucide-react'
import { TopBar } from '../Dashboard/TopBar.jsx'
import { StrategyPanel } from './StrategyPanel.jsx'
import { SummaryStats } from './SummaryStats.jsx'
import { BacktestResultsTable } from './BacktestResultsTable.jsx'
import { CompareView } from './CompareView.jsx'
import { Spinner } from '../UI/Spinner.jsx'
import useAppStore from '../../store/useAppStore.js'

const StockTerminal = lazy(() => import('../Terminal/StockTerminal.jsx'))
const SensitivityView = lazy(() =>
  import('./SensitivityView.jsx').then(m => ({ default: m.SensitivityView }))
)
const ProfitMatrixView = lazy(() =>
  import('./ProfitMatrixView.jsx').then(m => ({ default: m.ProfitMatrixView }))
)

export default function BacktestPage() {
  const backtestResults  = useAppStore(s => s.backtestResults)
  const activeBacktestId = useAppStore(s => s.activeBacktestId)
  const selectedStock    = useAppStore(s => s.selectedStock)

  const [activeTab, setActiveTab] = useState('results')

  const activeResult = activeBacktestId ? backtestResults[activeBacktestId] : null

  // All results sorted newest-first for the compare view
  const allResults = useMemo(() =>
    Object.values(backtestResults).sort((a, b) => b.runAt.localeCompare(a.runAt)),
    [backtestResults]
  )

  const runCount = allResults.length
  const canCompare = runCount >= 2

  // Resolve effective mode — sensitivity and profit-matrix always available; compare needs 2+ runs
  const mode = activeTab === 'sensitivity'   ? 'sensitivity'
             : activeTab === 'profit-matrix' ? 'profit-matrix'
             : activeTab === 'compare' && canCompare ? 'compare'
             : 'results'

  const TAB = (id, icon, label, badge) => (
    <button
      key={id}
      type="button"
      onClick={() => setActiveTab(id)}
      className={`
        inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded
        transition-colors duration-150
        ${mode === id
          ? 'bg-accent/15 text-accent'
          : 'text-muted hover:text-body hover:bg-surface'
        }
      `}
    >
      {icon}
      {label}
      {badge != null && (
        <span className="bg-border/80 text-muted text-[9px] font-mono px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  )

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden">
      <TopBar />

      <div className="flex flex-1 min-h-0">
        <StrategyPanel />

        {/* Results area */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-6 space-y-5">

            {/* Mode tabs — always visible so Sensitivity and Profit Matrix are accessible without prior runs */}
            <div className="flex items-center gap-2 border-b border-border pb-4">
              {TAB('results',       <List size={12} />,        'Results')}
              {canCompare && TAB('compare', <BarChart2 size={12} />, 'Compare', runCount)}
              {TAB('sensitivity',   <TrendingUp size={12} />,  'Sensitivity')}
              {TAB('profit-matrix', <Calculator size={12} />,  'Profit Matrix')}
            </div>

            {/* Content */}
            {mode === 'sensitivity' ? (
              <Suspense fallback={
                <div className="flex justify-center py-12"><Spinner size={24} /></div>
              }>
                <SensitivityView />
              </Suspense>
            ) : mode === 'profit-matrix' ? (
              <Suspense fallback={
                <div className="flex justify-center py-12"><Spinner size={24} /></div>
              }>
                <ProfitMatrixView />
              </Suspense>
            ) : mode === 'compare' ? (
              <CompareView results={allResults} />
            ) : activeResult ? (
              <>
                <SummaryStats result={activeResult} />
                <BacktestResultsTable result={activeResult} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-center min-h-[420px]">
                <Zap size={42} className="text-muted/20" aria-hidden="true" />
                <p className="text-muted text-sm">
                  Select a strategy and click <strong className="text-body">Run Backtest</strong>
                </p>
                <p className="text-muted/50 text-xs">
                  Runs entirely in your browser against real OHLCV data
                </p>
              </div>
            )}

          </div>
        </main>
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
