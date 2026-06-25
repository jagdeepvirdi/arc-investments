/**
 * Real price history adapter — loaded after running fetch_data.py.
 * Drop-in replacement for the PRNG section in mockPriceHistory.js.
 *
 * To activate: in mockPriceHistory.js replace getStockHistory() with this.
 */
import set100History from './real/set100_history.json'
import ssetHistory   from './real/sset_history.json'

const _all = { ...set100History, ...ssetHistory }

/**
 * Returns real OHLCV candles for a ticker.
 * Same signature as the mock version so nothing else needs to change.
 * @param {string} ticker
 * @returns {Array<{time:string, open:number, high:number, low:number, close:number, volume:number}>}
 */
export function getStockHistory(ticker) {
  return _all[ticker] ?? []
}
