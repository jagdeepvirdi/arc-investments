import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardPage from './components/Dashboard/DashboardPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}
