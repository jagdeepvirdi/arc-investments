/**
 * Real price history adapter — loaded after running fetch_data.py.
 * Drop-in replacement for the PRNG section in mockPriceHistory.js.
 *
 * History JSON is fetched at runtime from /public/data/ rather than
 * statically imported: full-lifetime daily OHLCV for ~427 tickers is
 * 100MB+, which crashes the Vite/Rollup build if bundled directly.
 * See loadAllHistory() — call it once at app startup before any
 * component reads getStockHistory().
 */

const HISTORY_FILES = ['set100_history.json', 'sset_history.json', 'mai_history.json']

/** @type {Object.<string, Array>} Merged ticker -> candles, populated by loadAllHistory() */
const _all = {}

let _loaded = false
let _loadPromise = null

/**
 * Fetches all three history JSON files from /data/ and merges them into
 * the in-memory cache. Safe to call multiple times — only fetches once.
 * @returns {Promise<void>}
 */
export function loadAllHistory() {
  if (_loaded) return Promise.resolve()
  if (_loadPromise) return _loadPromise

  const base = import.meta.env.BASE_URL
  _loadPromise = Promise.all(
    HISTORY_FILES.map(file =>
      fetch(`${base}data/${file}`).then(res => {
        if (!res.ok) throw new Error(`Failed to load ${file}: ${res.status}`)
        return res.json()
      })
    )
  ).then(results => {
    for (const data of results) Object.assign(_all, data)
    _loaded = true
  })

  return _loadPromise
}

/**
 * @returns {boolean} true once loadAllHistory() has resolved
 */
export function isHistoryLoaded() {
  return _loaded
}

/**
 * Returns real OHLCV candles for a ticker.
 * Same signature as the mock version so nothing else needs to change.
 * Returns [] until loadAllHistory() has resolved.
 * @param {string} ticker
 * @returns {Array<{time:string, open:number, high:number, low:number, close:number, volume:number}>}
 */
export function getStockHistory(ticker) {
  return _all[ticker] ?? []
}
