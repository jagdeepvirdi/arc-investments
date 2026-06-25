import { create } from 'zustand'
import { DEFAULT_INDEX_ID } from '../data/indices.js'
import { PRESETS_MAP, FILTER_DEFAULTS } from '../data/screenerPresets.js'

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
}))

export default useAppStore
