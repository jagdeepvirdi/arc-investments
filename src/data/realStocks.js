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
 * Real-data-first merge: iterate real tickers, use mock only as fallback for
 * fields not available from Yahoo Finance / thaifin (volatility, sectorAvgPE).
 * Tickers in mock but absent from real are excluded (stale index composition).
 * Tickers in real but absent from mock are included with isRealData: true.
 * @param {object[]} realArr - fetched from Yahoo Finance + thaifin
 * @param {object[]} mockArr - mock list (fallback for volatility, sectorAvgPE)
 * @returns {object[]}
 */
function buildStocks(realArr, mockArr) {
  const mockMap = Object.fromEntries(mockArr.map(s => [s.ticker, s]))

  return realArr.map(real => {
    const mock = mockMap[real.ticker] || {}

    return {
      // Mock base supplies volatility + sectorAvgPE (not in real data)
      ...mock,
      // Identity — real always wins
      ticker:       real.ticker,
      name:         real.name         || mock.name     || real.ticker,
      sector:       real.sector       || mock.sector   || 'Other',
      ipoDate:      real.ipoDate      || mock.ipoDate,
      ipoPrice:     real.ipoPrice     || mock.ipoPrice,
      // Price — always real
      currentPrice: real.currentPrice,
      change:       real.change,
      changePct:    real.changePct,
      volume:       real.volume,
      // Market cap — real (from thaifin) when available, mock as fallback
      ...(real.marketCap     != null ? { marketCap: real.marketCap }
                                     : mock.marketCap != null ? { marketCap: mock.marketCap } : {}),
      // Fundamentals — real when present, mock as fallback
      pe:            real.pe            ?? mock.pe,
      de:            real.de            ?? mock.de,
      fcf:           real.fcf           ?? mock.fcf,
      roe:           real.roe           ?? mock.roe,
      dividendYield: real.dividendYield ?? mock.dividendYield,
      payoutRatio:   real.payoutRatio   ?? mock.payoutRatio,
      epsGrowth:     real.epsGrowth     ?? mock.epsGrowth,
      revenueGrowth: real.revenueGrowth ?? mock.revenueGrowth,
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
