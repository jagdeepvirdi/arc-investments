import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardPage from './components/Dashboard/DashboardPage.jsx'

const BacktestPage = lazy(() => import('./components/Backtest/BacktestPage.jsx'))

export default function App() {
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
