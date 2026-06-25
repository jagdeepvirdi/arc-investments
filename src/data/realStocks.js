/**
 * Real data adapter — loaded after running fetch_data.py.
 *
 * Strategy:
 *   Stocks with real data  → real price fields always
 *                            + real fundamentals (pe, de, fcf, roe, dividendYield,
 *                              payoutRatio, epsGrowth, revenueGrowth) when available
 *                            + mock fallback for any missing fundamentals
 *   Skipped stocks (404)   → 100% mock data so the index count stays complete
 *
 * Charts use realPriceHistory.js for real candles; PRNG fallback for skipped stocks.
 *
 * To activate: in src/data/indices.js swap the two import lines to point here.
 */
import set100Raw from './real/set100_stocks.json'
import ssetRaw   from './real/sset_stocks.json'
import maiRaw    from './real/mai_stocks.json'

import { STOCKS as MOCK_SET100 } from './mockStocks.js'
import { STOCKS as MOCK_SSET   } from './mockSset.js'
import { STOCKS as MOCK_MAI    } from './mockMai.js'

/**
 * Merge: keep all mock stocks; overlay real fields where available.
 * Price fields are always taken from real data.
 * Fundamental fields are overlaid only when present in the real JSON —
 * missing/null fields silently fall back to mock values.
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
      ...mock,
      // Price / identity — always from real
      name:         real.name         || mock.name,
      sector:       real.sector       || mock.sector,
      ipoDate:      real.ipoDate      || mock.ipoDate,
      ipoPrice:     real.ipoPrice     || mock.ipoPrice,
      currentPrice: real.currentPrice,
      change:       real.change,
      changePct:    real.changePct,
      volume:       real.volume,
      // Fundamentals — real when present, mock as fallback
      ...(real.pe            != null && { pe:            real.pe }),
      ...(real.de            != null && { de:            real.de }),
      ...(real.fcf           != null && { fcf:           real.fcf }),
      ...(real.roe           != null && { roe:           real.roe }),
      ...(real.dividendYield != null && { dividendYield: real.dividendYield }),
      ...(real.payoutRatio   != null && { payoutRatio:   real.payoutRatio }),
      ...(real.epsGrowth     != null && { epsGrowth:     real.epsGrowth }),
      ...(real.revenueGrowth != null && { revenueGrowth: real.revenueGrowth }),
      isRealData: true,
    }
  })
}

export const SET100_STOCKS  = buildStocks(set100Raw, MOCK_SET100)
export const SET100_MAP     = Object.fromEntries(SET100_STOCKS.map(s => [s.ticker, s]))
export const SET100_SECTORS = [...new Set(SET100_STOCKS.map(s => s.sector))]

export const SSET_STOCKS  = buildStocks(ssetRaw, MOCK_SSET)
export const SSET_MAP     = Object.fromEntries(SSET_STOCKS.map(s => [s.ticker, s]))
export const SSET_SECTORS = [...new Set(SSET_STOCKS.map(s => s.sector))]

export const MAI_STOCKS  = buildStocks(maiRaw, MOCK_MAI)
export const MAI_MAP     = Object.fromEntries(MAI_STOCKS.map(s => [s.ticker, s]))
export const MAI_SECTORS = [...new Set(MAI_STOCKS.map(s => s.sector))]
