import { STOCKS as SET100_STOCKS, STOCKS_MAP as SET100_MAP, SECTORS as SET100_SECTORS } from './mockStocks.js'
import { STOCKS as SSET_STOCKS, STOCKS_MAP as SSET_MAP, SECTORS as SSET_SECTORS } from './mockSset.js'

/**
 * @typedef {{ id: string, label: string, description: string, stocks: import('./mockStocks.js').Stock[], stocksMap: Object, sectors: string[] }} IndexDef
 */

/** @type {IndexDef[]} */
export const INDICES = [
  {
    id: 'SET100',
    label: 'SET 100',
    description: 'Top 100 stocks by market capitalisation',
    stocks: SET100_STOCKS,
    stocksMap: SET100_MAP,
    sectors: SET100_SECTORS,
  },
  {
    id: 'SSET',
    label: 'sSET',
    description: 'Small and mid-cap index',
    stocks: SSET_STOCKS,
    stocksMap: SSET_MAP,
    sectors: SSET_SECTORS,
  },
]

/** @type {Object.<string, IndexDef>} */
export const INDICES_MAP = Object.fromEntries(INDICES.map(i => [i.id, i]))

/** Combined lookup across all indices — used by price history, fundamentals, and terminal */
export const ALL_STOCKS_MAP = Object.fromEntries(
  INDICES.flatMap(idx => Object.entries(idx.stocksMap))
)

export const DEFAULT_INDEX_ID = 'SET100'
