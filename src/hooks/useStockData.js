import { useMemo } from 'react'
import { getStockHistory } from '../data/mockPriceHistory.js'
import { calcRSI, calcMACD, calcSMA, calcEMA, calcBollingerBands, calcSupportResistance } from '../data/indicators.js'

/**
 * Returns memoized stock history + all pre-computed indicator arrays.
 * Calculations are cached for the lifetime of the component.
 * @param {string|null} ticker
 */
export function useStockData(ticker) {
  const history = useMemo(
    () => (ticker ? getStockHistory(ticker) : []),
    [ticker]
  )

  const closes = useMemo(() => history.map(c => c.close), [history])

  const indicators = useMemo(() => {
    if (!closes.length) return {}
    return {
      sma20:  calcSMA(closes, 20),
      sma50:  calcSMA(closes, 50),
      ema20:  calcEMA(closes, 20),
      ema50:  calcEMA(closes, 50),
      ema200: calcEMA(closes, 200),
      boll:   calcBollingerBands(closes, 20, 2),
      rsi14:  calcRSI(closes, 14),
      macd:   calcMACD(closes, 12, 26, 9),
      sr:     calcSupportResistance(history),
    }
  }, [closes, history])

  return { history, closes, indicators }
}
