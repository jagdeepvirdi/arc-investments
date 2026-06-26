import { SET100_STOCKS, SET100_MAP, SET100_SECTORS, SSET_STOCKS, SSET_MAP, SSET_SECTORS, MAI_STOCKS, MAI_MAP, MAI_SECTORS } from './realStocks.js'

/**
 * @typedef {{ id: string, label: string, description: string, stocks: import('./mockStocks.js').Stock[], stocksMap: Object, sectors: string[], isAggregate?: boolean }} IndexDef
 */

// ALL: combine all three indices, tagging each stock with its source index
const ALL_STOCKS = [
  ...SET100_STOCKS.map(s => ({ ...s, sourceIndex: 'SET100' })),
  ...SSET_STOCKS.map(s => ({ ...s, sourceIndex: 'SSET' })),
  ...MAI_STOCKS.map(s => ({ ...s, sourceIndex: 'MAI' })),
]
const ALL_STOCKS_OBJ = Object.fromEntries(ALL_STOCKS.map(s => [s.ticker, s]))
const ALL_SECTORS = [...new Set([...SET100_SECTORS, ...SSET_SECTORS, ...MAI_SECTORS])].sort()

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
  {
    id: 'MAI',
    label: 'mai',
    description: 'Market for Alternative Investment — smaller growth companies',
    stocks: MAI_STOCKS,
    stocksMap: MAI_MAP,
    sectors: MAI_SECTORS,
  },
  {
    id: 'ALL',
    label: 'ALL',
    description: 'All indices combined — SET100 + sSET + MAI (~254 stocks)',
    stocks: ALL_STOCKS,
    stocksMap: ALL_STOCKS_OBJ,
    sectors: ALL_SECTORS,
    isAggregate: true,
  },
]

/** @type {Object.<string, IndexDef>} */
export const INDICES_MAP = Object.fromEntries(INDICES.map(i => [i.id, i]))

/** Combined lookup across all indices — used by price history, fundamentals, and terminal */
export const ALL_STOCKS_MAP = Object.fromEntries(
  INDICES.filter(i => !i.isAggregate).flatMap(idx => Object.entries(idx.stocksMap))
)

export const DEFAULT_INDEX_ID = 'SET100'
