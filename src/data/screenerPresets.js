/**
 * Screener preset definitions.
 * Each preset declares which filter fields to set; all unmentioned fields reset to defaults.
 */
export const PRESETS = [
  {
    id: 'value',
    label: 'Value',
    description: 'Low P/E, positive FCF, manageable debt',
    filters: { peMax: 15, deMax: 1.5, fcfFilter: 'positive' },
  },
  {
    id: 'high_roe',
    label: 'High ROE',
    description: 'Strong return on equity > 20%',
    filters: { roeMin: 20 },
  },
  {
    id: 'quality',
    label: 'Quality',
    description: 'High ROE, low debt, positive FCF',
    filters: { roeMin: 15, deMax: 1.0, fcfFilter: 'positive' },
  },
  {
    id: 'growth',
    label: 'Growth',
    description: 'Strong ROE with positive free cash flow',
    filters: { roeMin: 15, fcfFilter: 'positive' },
  },
  {
    id: 'low_debt',
    label: 'Low Debt',
    description: 'Conservative balance sheet D/E < 0.5',
    filters: { deMax: 0.5 },
  },
  {
    id: 'deep_value',
    label: 'Deep Value',
    description: 'Very low P/E with positive cash flow',
    filters: { peMax: 10, fcfFilter: 'positive' },
  },
  {
    id: 'oversold_entry',
    label: 'Oversold Entry',
    description: 'RSI < 35 — potential bounce candidates',
    filters: { rsiMax: 35 },
  },
  {
    id: 'oversold_div',
    label: 'Oversold Dividend',
    description: 'Oversold stocks with positive cash flow',
    filters: { rsiMax: 35, fcfFilter: 'positive' },
  },
  {
    id: 'momentum',
    label: 'Momentum',
    description: 'MACD bullish cross, RSI 45–70',
    filters: { macdFilter: 'bullish', rsiMin: 45, rsiMax: 70 },
  },
  {
    id: 'turnaround',
    label: 'Turnaround',
    description: 'Downtrend + oversold with positive FCF',
    filters: { rsiMax: 40, fcfFilter: 'positive', trendDirection: 'down' },
  },
  {
    id: 'overbought',
    label: 'Overbought',
    description: 'RSI > 70 — potential selling pressure',
    filters: { rsiMin: 70 },
  },
  {
    id: 'growth_stocks',
    label: 'Growth Stocks',
    description: 'EPS Growth > 10% and Revenue Growth > 10% — expanding Thai companies',
    filters: { epsGrowthMin: 10, revenueGrowthMin: 10 },
  },
  {
    id: 'dividend_stocks',
    label: 'Dividend Stocks',
    description: 'Dividend Yield > 4% with sustainable Payout Ratio < 70%',
    filters: { divYieldMin: 4, payoutRatioMax: 70 },
  },
]

export const PRESETS_MAP = Object.fromEntries(PRESETS.map(p => [p.id, p]))

/** Default state for all filter fields — spread this to reset */
export const FILTER_DEFAULTS = {
  selectedSectors: null,  // null = all sectors
  peMin: null,
  peMax: null,
  deMin: null,
  deMax: null,
  roeMin: null,
  roeMax: null,
  fcfFilter: 'any',       // 'any' | 'positive' | 'negative'
  rsiMin: 0,
  rsiMax: 100,
  macdFilter: 'any',      // 'any' | 'bullish'
  trendDirection: null,   // null | 'up' | 'down'
  epsGrowthMin: null,     // % — EPS growth YoY minimum
  revenueGrowthMin: null, // % — Revenue growth YoY minimum
  divYieldMin: null,      // % — Dividend yield minimum
  payoutRatioMax: null,   // % — Payout ratio maximum
  activePreset: null,
}
