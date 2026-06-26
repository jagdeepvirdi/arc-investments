import { lazy, Suspense, useState, useMemo } from 'react'
import { Zap, BarChart2, List } from 'lucide-react'
import { TopBar } from '../Dashboard/TopBar.jsx'
import { StrategyPanel } from './StrategyPanel.jsx'
import { SummaryStats } from './SummaryStats.jsx'
import { BacktestResultsTable } from './BacktestResultsTable.jsx'
import { CompareView } from './CompareView.jsx'
import { Spinner } from '../UI/Spinner.jsx'
import useAppStore from '../../store/useAppStore.js'

const StockTerminal = lazy(() => import('../Terminal/StockTerminal.jsx'))

export default function BacktestPage() {
  const backtestResults  = useAppStore(s => s.backtestResults)
  const activeBacktestId = useAppStore(s => s.activeBacktestId)
  const selectedStock    = useAppStore(s => s.selectedStock)

  const [showCompare, setShowCompare] = useState(false)

  const activeResult = activeBacktestId ? backtestResults[activeBacktestId] : null

  // All results sorted newest-first for the compare view
  const allResults = useMemo(() =>
    Object.values(backtestResults).sort((a, b) => b.runAt.localeCompare(a.runAt)),
    [backtestResults]
  )

  const runCount = allResults.length
  const canCompare = runCount >= 2

  // If the last run was deleted and we were comparing, drop back to results view
  const mode = showCompare && canCompare ? 'compare' : 'results'

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden">
      <TopBar />

      <div className="flex flex-1 min-h-0">
        <StrategyPanel />

        {/* Results area */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {(activeResult || canCompare) ? (
            <div className="p-6 space-y-5">

              {/* Mode tabs */}
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <button
                  type="button"
                  onClick={() => setShowCompare(false)}
                  className={`
                    inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded
                    transition-colors duration-150
                    ${mode === 'results'
                      ? 'bg-accent/15 text-accent'
                      : 'text-muted hover:text-body hover:bg-surface'
                    }
                  `}
                >
                  <List size={12} aria-hidden="true" />
                  Results
                </button>

                {canCompare && (
                  <button
                    type="button"
                    onClick={() => setShowCompare(true)}
                    className={`
                      inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded
                      transition-colors duration-150
                      ${mode === 'compare'
                        ? 'bg-accent/15 text-accent'
                        : 'text-muted hover:text-body hover:bg-surface'
                      }
                    `}
                  >
                    <BarChart2 size={12} aria-hidden="true" />
                    Compare
                    <span className="bg-border/80 text-muted text-[9px] font-mono px-1.5 py-0.5 rounded-full">
                      {runCount}
                    </span>
                  </button>
                )}
              </div>

              {/* Content */}
              {mode === 'compare' ? (
                <CompareView results={allResults} />
              ) : activeResult ? (
                <>
                  <SummaryStats result={activeResult} />
                  <BacktestResultsTable result={activeResult} />
                </>
              ) : null}

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-8">
              <Zap size={42} className="text-muted/20" aria-hidden="true" />
              <p className="text-muted text-sm">
                Select a strategy and click <strong className="text-body">Run Backtest</strong>
              </p>
              <p className="text-muted/50 text-xs">
                Runs entirely in your browser against real OHLCV data
              </p>
            </div>
          )}
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
