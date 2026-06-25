import { create } from 'zustand'

/** @typedef {'launch'|'5y'|'1y'|'ytd'} TrendHorizon */
/** @typedef {'RSI_OVERSOLD'|'RSI_OVERBOUGHT'|'MACD_BULLISH'} ScannerTag */

const useAppStore = create((set) => ({
  /** @type {string|null} */
  selectedStock: null,
  /** @type {TrendHorizon} */
  trendHorizon: 'ytd',
  /** @type {ScannerTag[]} */
  activeScanners: [],
  /** @type {string} */
  searchQuery: '',
  /** @type {'ticker'|'name'|'currentPrice'|'changePct'|'volume'|'pe'|'marketCap'|'trend'} */
  sortKey: 'marketCap',
  /** @type {'asc'|'desc'} */
  sortDir: 'desc',

  setSelectedStock: (ticker) => set({ selectedStock: ticker }),
  setTrendHorizon: (horizon) => set({ trendHorizon: horizon }),
  toggleScanner: (tag) => set((state) => ({
    activeScanners: state.activeScanners.includes(tag)
      ? state.activeScanners.filter(t => t !== tag)
      : [...state.activeScanners, tag],
  })),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSort: (key) => set((state) => ({
    sortKey: key,
    sortDir: state.sortKey === key && state.sortDir === 'desc' ? 'asc' : 'desc',
  })),
}))

export default useAppStore
