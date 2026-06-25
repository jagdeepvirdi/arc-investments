/**
 * Real data adapter — loaded after running fetch_data.py.
 *
 * Strategy:
 *   Stocks with real data  → real currentPrice, change, changePct, volume, name, ipoDate, ipoPrice
 *                            + mock pe, de, fcf, roe, dividendYield, marketCap, sectorAvgPE, volatility
 *   Skipped stocks (404)   → 100% mock data so the index count stays complete
 *
 * Charts use realPriceHistory.js for real candles; PRNG fallback for skipped stocks.
 *
 * To activate: in src/data/indices.js swap the two import lines to point here.
 */
import set100Raw from './real/set100_stocks.json'
import ssetRaw   from './real/sset_stocks.json'

import { STOCKS as MOCK_SET100 } from './mockStocks.js'
import { STOCKS as MOCK_SSET   } from './mockSset.js'

/**
 * Merge: keep all mock stocks; overlay real price fields where available.
 * @param {object[]} realArr - fetched from Yahoo Finance
 * @param {object[]} mockArr - full mock list (all stocks)
 * @returns {object[]}
 */
function buildStocks(realArr, mockArr) {
  const realMap = Object.fromEntries(realArr.map(s => [s.ticker, s]))

  return mockArr.map(mock => {
    const real = realMap[mock.ticker]
    if (!real) return { ...mock, isRealData: false }

    return {
      ...mock,                          // pe, de, fcf, roe, dividendYield, marketCap, sectorAvgPE, volatility
      // override with real fields
      name:         real.name         || mock.name,
      sector:       real.sector       || mock.sector,
      ipoDate:      real.ipoDate      || mock.ipoDate,
      ipoPrice:     real.ipoPrice     || mock.ipoPrice,
      currentPrice: real.currentPrice,
      change:       real.change,
      changePct:    real.changePct,
      volume:       real.volume,
      isRealData:   true,
    }
  })
}

export const SET100_STOCKS  = buildStocks(set100Raw, MOCK_SET100)
export const SET100_MAP     = Object.fromEntries(SET100_STOCKS.map(s => [s.ticker, s]))
export const SET100_SECTORS = [...new Set(SET100_STOCKS.map(s => s.sector))]

export const SSET_STOCKS  = buildStocks(ssetRaw, MOCK_SSET)
export const SSET_MAP     = Object.fromEntries(SSET_STOCKS.map(s => [s.ticker, s]))
export const SSET_SECTORS = [...new Set(SSET_STOCKS.map(s => s.sector))]
