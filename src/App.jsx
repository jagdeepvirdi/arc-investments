import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardPage from './components/Dashboard/DashboardPage.jsx'
import { Spinner } from './components/UI/Spinner.jsx'
import { loadAllHistory } from './data/mockPriceHistory.js'

const BacktestPage = lazy(() => import('./components/Backtest/BacktestPage.jsx'))

function LoadingScreen() {
  return (
    <div className="h-screen bg-bg flex flex-col items-center justify-center gap-3">
      <Spinner size={32} />
      <span className="text-[11px] text-muted">Loading market data…</span>
    </div>
  )
}

export default function App() {
  const [historyReady, setHistoryReady] = useState(false)

  useEffect(() => {
    loadAllHistory().then(() => setHistoryReady(true))
  }, [])

  if (!historyReady) return <LoadingScreen />

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="h-screen bg-bg" />}>
        <Routes>
          <Route path="/"         element={<DashboardPage />} />
          <Route path="/backtest" element={<BacktestPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
