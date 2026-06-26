import { create } from 'zustand'
import { DEFAULT_INDEX_ID, INDICES_MAP } from '../data/indices.js'
import { PRESETS_MAP, FILTER_DEFAULTS } from '../data/screenerPresets.js'
import { runBacktest as runBacktestEngine } from '../data/backtester.js'
import { STRATEGIES_MAP } from '../data/strategies.js'

/** @typedef {'up'|'down'|null} Direction */

const useAppStore = create((set) => ({
  /** @type {string} */
  activeIndex: DEFAULT_INDEX_ID,
  /** @type {string|null} */
  selectedStock: null,
  /** @type {'launch'|'5y'|'1y'|'ytd'} */
  trendHorizon: 'launch',
  /** @type {string} */
  searchQuery: '',
  /** @type {string} */
  sortKey: 'marketCap',
  /** @type {'asc'|'desc'} */
  sortDir: 'desc',
  /** @type {boolean} */
  hideMockData: true,
  /** @type {boolean} */
  filterPanelOpen: false,
  /** @type {string[]} Column keys that are currently hidden */
  hiddenColumns: ['changePct', 'volume'],

  // -- Filter state --
  ...FILTER_DEFAULTS,

  // -- Actions --

  setActiveIndex: (id) => set({
    activeIndex: id,
    selectedStock: null,
    searchQuery: '',
    hideMockData: true,
    filterPanelOpen: false,
    ...FILTER_DEFAULTS,
  }),
  setSelectedStock: (ticker) => set({ selectedStock: ticker }),
  setTrendHorizon: (horizon) => set({ trendHorizon: horizon }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSort: (key) => set((state) => ({
    sortKey: key,
    sortDir: state.sortKey === key && state.sortDir === 'desc' ? 'asc' : 'desc',
  })),

  toggleFilterPanel: () => set((state) => ({ filterPanelOpen: !state.filterPanelOpen })),
  toggleColumn: (key) => set((state) => ({
    hiddenColumns: state.hiddenColumns.includes(key)
      ? state.hiddenColumns.filter(k => k !== key)
      : [...state.hiddenColumns, key],
  })),
  toggleHideMockData: () => set((state) => ({ hideMockData: !state.hideMockData })),

  /** Set a single filter field and clear any active preset */
  setFilter: (key, val) => set({ [key]: val, activePreset: null }),

  /** Set multiple filter fields atomically and clear any active preset */
  setFilters: (updates) => set({ ...updates, activePreset: null }),

  /** Set selected sectors -- null means all sectors */
  setSelectedSectors: (sectors) => set({ selectedSectors: sectors, activePreset: null }),

  /** Toggle trend direction; clicking the active direction clears it */
  setTrendDirection: (dir) => set((state) => ({
    trendDirection: state.trendDirection === dir ? null : dir,
    activePreset: null,
  })),

  /** Apply a named screener preset -- resets all other filters first */
  applyPreset: (presetId) => {
    const preset = PRESETS_MAP[presetId]
    if (!preset) return
    set({ ...FILTER_DEFAULTS, ...preset.filters, activePreset: presetId })
  },

  /** Clear all filters and search back to defaults */
  clearAllFilters: () => set({ ...FILTER_DEFAULTS, searchQuery: '', hideMockData: true }),

  // ── Backtest state ─────────────────────────────────────────────────────────
  /** @type {Object.<string, import('../data/backtester.js').BacktestResult>} */
  backtestResults:  {},
  backtestRunning:  false,
  /** @type {string|null} */
  activeBacktestId: null,

  runBacktest: (strategyId, budget, startDate, endDate, maxPositionPct = 100) => {
    const strategy = STRATEGIES_MAP[strategyId]
    if (!strategy) return
    set({ backtestRunning: true })
    const allStocks = INDICES_MAP['ALL'].stocks
    const result    = runBacktestEngine({ strategy, allStocks, startDate, endDate: endDate || null, budget, maxPositionPct })
    const key       = `${strategyId}_${Date.now()}`
    set(state => ({
      backtestResults:  { ...state.backtestResults, [key]: result },
      activeBacktestId: key,
      backtestRunning:  false,
    }))
  },

  setActiveBacktest: (resultId) => set({ activeBacktestId: resultId }),

  clearBacktestResult: (resultId) => set(state => {
    const next = { ...state.backtestResults }
    delete next[resultId]
    return {
      backtestResults:  next,
      activeBacktestId: state.activeBacktestId === resultId
        ? (Object.keys(next).at(-1) ?? null)
        : state.activeBacktestId,
    }
  }),

  clearAllBacktestResults: () => set({ backtestResults: {}, activeBacktestId: null }),
}))

export default useAppStore
