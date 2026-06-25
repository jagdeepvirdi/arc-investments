import { ALL_STOCKS_MAP } from './indices.js'

/**
 * @typedef {Object} Fundamentals
 * @property {number} pe
 * @property {number} de
 * @property {number} fcf       - THB billions
 * @property {number} roe       - percent
 * @property {number} dividendYield - percent
 * @property {number} sectorAvgPE
 */

/**
 * Returns fundamental data for a ticker.
 * Thin wrapper over STOCKS_MAP — swap this for an API call when live data is available.
 * @param {string} ticker
 * @returns {Fundamentals|null}
 */
export function getFundamentals(ticker) {
  const stock = ALL_STOCKS_MAP[ticker]
  if (!stock) return null
  return {
    pe: stock.pe,
    de: stock.de,
    fcf: stock.fcf,
    roe: stock.roe,
    dividendYield: stock.dividendYield,
    sectorAvgPE: stock.sectorAvgPE,
  }
}
