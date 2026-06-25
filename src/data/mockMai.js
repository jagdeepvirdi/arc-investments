/**
 * MAI (Market for Alternative Investment) — smaller Thai companies.
 * Same Stock shape as mockStocks.js and mockSset.js.
 * Prices / fundamentals are mock; real values are overlaid by realStocks.js after fetch_data.py.
 * @typedef {import('./mockStocks.js').Stock} Stock
 */

/** @type {Stock[]} */
export const STOCKS = [
  // ── Technology / Media (8) ────────────────────────────────────────────────
  {
    ticker: 'JKN',    name: 'JKN Global Media PCL',              sector: 'Technology',
    ipoDate: '2012-06-14', ipoPrice: 3.50,
    currentPrice: 6.80,  change:  0.10, changePct:  1.49, volume: 2_500_000, marketCap: 1.8,
    pe: 22.5, de: 0.45, fcf:  0.12, roe:  8.5, dividendYield: 1.2, sectorAvgPE: 26.0, volatility: 0.032,
  },
  {
    ticker: 'PLANET', name: 'Planet Communications Asia PCL',    sector: 'Technology',
    ipoDate: '2007-09-12', ipoPrice: 1.50,
    currentPrice: 2.90,  change:  0.04, changePct:  1.40, volume: 3_800_000, marketCap: 0.6,
    pe: 18.2, de: 0.32, fcf:  0.05, roe:  7.2, dividendYield: 0.8, sectorAvgPE: 26.0, volatility: 0.033,
  },
  {
    ticker: 'MST',    name: 'M Solutions Technology PCL',        sector: 'Technology',
    ipoDate: '2014-05-20', ipoPrice: 2.00,
    currentPrice: 3.40,  change:  0.06, changePct:  1.79, volume:   890_000, marketCap: 0.4,
    pe: 24.5, de: 0.28, fcf:  0.04, roe:  6.5, dividendYield: 1.0, sectorAvgPE: 26.0, volatility: 0.031,
  },
  {
    ticker: 'SMART',  name: 'Smart I Holdings PCL',              sector: 'Technology',
    ipoDate: '2015-11-10', ipoPrice: 3.20,
    currentPrice: 4.10,  change: -0.05, changePct: -1.21, volume: 1_560_000, marketCap: 0.5,
    pe: 19.8, de: 0.37, fcf:  0.06, roe:  7.8, dividendYield: 0.9, sectorAvgPE: 26.0, volatility: 0.030,
  },
  {
    ticker: 'UBIS',   name: 'Unified Business Communications PCL', sector: 'Technology',
    ipoDate: '2010-03-15', ipoPrice: 1.80,
    currentPrice: 2.20,  change:  0.03, changePct:  1.38, volume: 2_100_000, marketCap: 0.3,
    pe: 15.5, de: 0.40, fcf:  0.03, roe:  5.5, dividendYield: 1.5, sectorAvgPE: 26.0, volatility: 0.032,
  },
  {
    ticker: 'NMG',    name: 'Nation Multimedia Group PCL',        sector: 'Technology',
    ipoDate: '2001-09-28', ipoPrice: 5.00,
    currentPrice: 1.90,  change: -0.02, changePct: -1.04, volume: 4_200_000, marketCap: 0.7,
    pe:  0.0, de: 0.55, fcf: -0.02, roe:  2.1, dividendYield: 0.0, sectorAvgPE: 26.0, volatility: 0.035,
  },
  {
    ticker: 'SMT',    name: 'S.M.T. Technology PCL',             sector: 'Technology',
    ipoDate: '2016-08-25', ipoPrice: 2.50,
    currentPrice: 3.20,  change:  0.05, changePct:  1.59, volume:   680_000, marketCap: 0.4,
    pe: 20.0, de: 0.29, fcf:  0.04, roe:  7.0, dividendYield: 0.8, sectorAvgPE: 26.0, volatility: 0.031,
  },
  {
    ticker: 'ROBOT',  name: 'Robot PCL',                         sector: 'Technology',
    ipoDate: '2019-08-08', ipoPrice: 4.80,
    currentPrice: 5.50,  change: -0.10, changePct: -1.79, volume: 1_200_000, marketCap: 0.8,
    pe: 31.0, de: 0.21, fcf:  0.07, roe:  9.8, dividendYield: 0.5, sectorAvgPE: 26.0, volatility: 0.034,
  },

  // ── Manufacturing (11) ────────────────────────────────────────────────────
  {
    ticker: 'DRT',    name: 'Diamond Roofing Tiles PCL',         sector: 'Manufacturing',
    ipoDate: '2003-07-14', ipoPrice: 4.50,
    currentPrice: 8.20,  change:  0.15, changePct:  1.86, volume: 1_800_000, marketCap: 1.2,
    pe: 14.5, de: 0.52, fcf:  0.15, roe: 11.2, dividendYield: 2.5, sectorAvgPE: 15.5, volatility: 0.026,
  },
  {
    ticker: 'HPMT',   name: 'Hua Phan Manufacturing PCL',        sector: 'Manufacturing',
    ipoDate: '2005-04-20', ipoPrice: 3.80,
    currentPrice: 5.10,  change: -0.08, changePct: -1.55, volume:   950_000, marketCap: 0.7,
    pe: 12.8, de: 0.61, fcf:  0.09, roe:  9.5, dividendYield: 3.0, sectorAvgPE: 15.5, volatility: 0.027,
  },
  {
    ticker: 'INOX',   name: 'Inox (Thailand) PCL',               sector: 'Manufacturing',
    ipoDate: '2011-09-05', ipoPrice: 2.20,
    currentPrice: 3.50,  change:  0.06, changePct:  1.74, volume: 1_300_000, marketCap: 0.5,
    pe: 16.2, de: 0.48, fcf:  0.07, roe: 10.0, dividendYield: 2.0, sectorAvgPE: 15.5, volatility: 0.028,
  },
  {
    ticker: 'SIMAT',  name: 'Siam Alloy Products PCL',           sector: 'Manufacturing',
    ipoDate: '2008-06-18', ipoPrice: 3.00,
    currentPrice: 4.40,  change:  0.07, changePct:  1.61, volume:   720_000, marketCap: 0.6,
    pe: 13.5, de: 0.55, fcf:  0.08, roe:  8.8, dividendYield: 2.8, sectorAvgPE: 15.5, volatility: 0.027,
  },
  {
    ticker: 'SNC',    name: 'SNC Former PCL',                    sector: 'Manufacturing',
    ipoDate: '2006-10-25', ipoPrice: 5.50,
    currentPrice: 7.80,  change:  0.12, changePct:  1.56, volume: 1_100_000, marketCap: 1.0,
    pe: 11.5, de: 0.44, fcf:  0.14, roe: 12.5, dividendYield: 3.5, sectorAvgPE: 15.5, volatility: 0.025,
  },
  {
    ticker: 'STANLY', name: 'Stanley Electric (Thailand) PCL',   sector: 'Manufacturing',
    ipoDate: '2002-03-12', ipoPrice: 8.00,
    currentPrice: 14.20, change:  0.20, changePct:  1.43, volume:   560_000, marketCap: 1.8,
    pe: 17.0, de: 0.35, fcf:  0.22, roe: 14.0, dividendYield: 2.2, sectorAvgPE: 15.5, volatility: 0.024,
  },
  {
    ticker: 'SYNTEC', name: 'Syntec Construction PCL',           sector: 'Manufacturing',
    ipoDate: '2007-01-15', ipoPrice: 2.80,
    currentPrice: 3.90,  change: -0.05, changePct: -1.27, volume:   830_000, marketCap: 0.5,
    pe: 14.0, de: 0.68, fcf:  0.06, roe:  8.0, dividendYield: 2.5, sectorAvgPE: 15.5, volatility: 0.028,
  },
  {
    ticker: 'TYM',    name: 'Tycoons Group Enterprise PCL',      sector: 'Manufacturing',
    ipoDate: '2004-08-30', ipoPrice: 1.50,
    currentPrice: 2.80,  change:  0.04, changePct:  1.45, volume: 2_400_000, marketCap: 0.4,
    pe: 10.5, de: 0.72, fcf:  0.05, roe:  7.5, dividendYield: 3.2, sectorAvgPE: 15.5, volatility: 0.030,
  },
  {
    ticker: 'TWFP',   name: 'Thai Wire Products PCL',            sector: 'Manufacturing',
    ipoDate: '2009-11-20', ipoPrice: 3.20,
    currentPrice: 5.60,  change:  0.09, changePct:  1.63, volume:   680_000, marketCap: 0.7,
    pe: 15.0, de: 0.43, fcf:  0.10, roe: 11.0, dividendYield: 2.8, sectorAvgPE: 15.5, volatility: 0.026,
  },
  {
    ticker: 'UNIUN',  name: 'Union Pioneer PCL',                 sector: 'Manufacturing',
    ipoDate: '2010-07-08', ipoPrice: 4.00,
    currentPrice: 6.50,  change:  0.10, changePct:  1.56, volume:   770_000, marketCap: 0.9,
    pe: 16.5, de: 0.40, fcf:  0.12, roe: 10.5, dividendYield: 2.4, sectorAvgPE: 15.5, volatility: 0.026,
  },
  {
    ticker: 'PANKO',  name: 'Pan Koat PCL',                      sector: 'Manufacturing',
    ipoDate: '2013-04-22', ipoPrice: 1.80,
    currentPrice: 2.50,  change: -0.03, changePct: -1.19, volume: 1_200_000, marketCap: 0.3,
    pe: 11.8, de: 0.65, fcf:  0.04, roe:  6.8, dividendYield: 3.5, sectorAvgPE: 15.5, volatility: 0.029,
  },

  // ── Industrial / Engineering (3) ──────────────────────────────────────────
  {
    ticker: 'CHO',    name: 'Cho Thavee Dollasien PCL',          sector: 'Industrial',
    ipoDate: '2001-11-12', ipoPrice: 2.00,
    currentPrice: 3.10,  change:  0.05, changePct:  1.64, volume: 2_800_000, marketCap: 0.4,
    pe: 12.0, de: 0.58, fcf:  0.06, roe:  8.0, dividendYield: 2.8, sectorAvgPE: 15.0, volatility: 0.029,
  },
  {
    ticker: 'GENCO',  name: 'General Engineering PCL',           sector: 'Industrial',
    ipoDate: '2008-11-20', ipoPrice: 3.80,
    currentPrice: 5.80,  change:  0.09, changePct:  1.57, volume:   890_000, marketCap: 0.8,
    pe: 15.0, de: 0.42, fcf:  0.10, roe:  9.0, dividendYield: 2.8, sectorAvgPE: 15.0, volatility: 0.028,
  },
  {
    ticker: 'YONG',   name: 'Yong Se Engineering PCL',           sector: 'Industrial',
    ipoDate: '2015-09-15', ipoPrice: 3.50,
    currentPrice: 5.20,  change:  0.08, changePct:  1.56, volume:   580_000, marketCap: 0.7,
    pe: 14.8, de: 0.47, fcf:  0.09, roe:  9.8, dividendYield: 2.6, sectorAvgPE: 15.0, volatility: 0.027,
  },

  // ── Property (5) ──────────────────────────────────────────────────────────
  {
    ticker: 'SORKON', name: 'Sorkon Estate PCL',                 sector: 'Property',
    ipoDate: '2014-12-18', ipoPrice: 1.50,
    currentPrice: 2.20,  change:  0.03, changePct:  1.38, volume: 3_500_000, marketCap: 0.4,
    pe: 18.5, de: 0.80, fcf:  0.04, roe:  7.5, dividendYield: 1.8, sectorAvgPE: 19.0, volatility: 0.030,
  },
  {
    ticker: 'SKN',    name: 'S.Kijchai Enterprise PCL',          sector: 'Property',
    ipoDate: '2008-03-25', ipoPrice: 2.80,
    currentPrice: 4.30,  change:  0.06, changePct:  1.42, volume: 1_900_000, marketCap: 0.6,
    pe: 21.0, de: 0.75, fcf:  0.07, roe:  8.2, dividendYield: 1.5, sectorAvgPE: 19.0, volatility: 0.029,
  },
  {
    ticker: 'PDI',    name: 'Property Development Industry PCL', sector: 'Property',
    ipoDate: '2016-06-20', ipoPrice: 1.20,
    currentPrice: 1.80,  change:  0.02, changePct:  1.12, volume: 4_200_000, marketCap: 0.3,
    pe: 15.5, de: 0.90, fcf:  0.03, roe:  6.5, dividendYield: 2.0, sectorAvgPE: 19.0, volatility: 0.031,
  },
  {
    ticker: 'MOONG',  name: 'Moong Pattana International PCL',  sector: 'Property',
    ipoDate: '2017-03-14', ipoPrice: 3.00,
    currentPrice: 4.50,  change:  0.07, changePct:  1.58, volume: 1_500_000, marketCap: 0.6,
    pe: 22.5, de: 0.68, fcf:  0.08, roe:  8.5, dividendYield: 1.4, sectorAvgPE: 19.0, volatility: 0.028,
  },
  {
    ticker: 'TMI',    name: 'Thai Metal Industry PCL',          sector: 'Property',
    ipoDate: '2012-05-10', ipoPrice: 2.60,
    currentPrice: 4.20,  change:  0.06, changePct:  1.45, volume:   950_000, marketCap: 0.6,
    pe: 13.2, de: 0.56, fcf:  0.08, roe:  9.2, dividendYield: 3.0, sectorAvgPE: 19.0, volatility: 0.027,
  },

  // ── Food & Beverage (3) ───────────────────────────────────────────────────
  {
    ticker: 'TIGER',  name: 'Tiger Flavors & Fragrances PCL',   sector: 'Food & Beverage',
    ipoDate: '2015-07-06', ipoPrice: 4.20,
    currentPrice: 7.80,  change:  0.12, changePct:  1.56, volume:   890_000, marketCap: 1.0,
    pe: 25.0, de: 0.35, fcf:  0.14, roe: 12.5, dividendYield: 2.0, sectorAvgPE: 21.0, volatility: 0.028,
  },
  {
    ticker: 'WFRESH', name: 'W Fresh PCL',                       sector: 'Food & Beverage',
    ipoDate: '2018-11-20', ipoPrice: 5.50,
    currentPrice: 9.20,  change:  0.15, changePct:  1.66, volume: 1_200_000, marketCap: 1.3,
    pe: 28.0, de: 0.28, fcf:  0.16, roe: 13.8, dividendYield: 1.5, sectorAvgPE: 21.0, volatility: 0.027,
  },
  {
    ticker: 'COCOCO', name: 'Coconut Palm PCL',                  sector: 'Food & Beverage',
    ipoDate: '2020-02-18', ipoPrice: 6.00,
    currentPrice: 8.50,  change:  0.10, changePct:  1.19, volume:   780_000, marketCap: 0.9,
    pe: 22.0, de: 0.25, fcf:  0.12, roe: 11.0, dividendYield: 1.8, sectorAvgPE: 21.0, volatility: 0.028,
  },

  // ── Healthcare (2) ────────────────────────────────────────────────────────
  {
    ticker: 'VIBHA',  name: 'Vibhavadi Medical Center PCL',      sector: 'Healthcare',
    ipoDate: '2009-12-10', ipoPrice: 6.50,
    currentPrice: 12.40, change:  0.20, changePct:  1.64, volume:   420_000, marketCap: 1.6,
    pe: 32.0, de: 0.30, fcf:  0.22, roe: 16.5, dividendYield: 1.0, sectorAvgPE: 33.0, volatility: 0.022,
  },
  {
    ticker: 'BGC',    name: 'Bangkok Glass PCL',                  sector: 'Consumer',
    ipoDate: '1998-03-10', ipoPrice: 10.00,
    currentPrice: 11.20, change:  0.15, changePct:  1.36, volume:   580_000, marketCap: 4.5,
    pe: 22.5, de: 0.38, fcf:  0.35, roe:  9.0, dividendYield: 2.0, sectorAvgPE: 18.0, volatility: 0.022,
  },

  // ── Energy (3) ────────────────────────────────────────────────────────────
  {
    ticker: 'TSE',    name: 'Thai Solar Energy PCL',              sector: 'Energy',
    ipoDate: '2013-05-30', ipoPrice: 3.00,
    currentPrice: 4.50,  change:  0.07, changePct:  1.58, volume: 2_800_000, marketCap: 0.9,
    pe: 18.0, de: 0.65, fcf:  0.10, roe:  9.5, dividendYield: 3.5, sectorAvgPE: 19.0, volatility: 0.028,
  },
  {
    ticker: 'TAE',    name: 'Thai Agri Energy PCL',               sector: 'Energy',
    ipoDate: '2011-11-08', ipoPrice: 2.50,
    currentPrice: 3.80,  change:  0.05, changePct:  1.33, volume: 1_900_000, marketCap: 0.5,
    pe: 15.5, de: 0.58, fcf:  0.07, roe:  8.0, dividendYield: 4.0, sectorAvgPE: 19.0, volatility: 0.030,
  },
  {
    ticker: 'PSTC',   name: 'Premier Service PCL',                sector: 'Energy',
    ipoDate: '2016-04-25', ipoPrice: 4.80,
    currentPrice: 7.50,  change:  0.11, changePct:  1.49, volume: 1_100_000, marketCap: 1.0,
    pe: 20.5, de: 0.48, fcf:  0.12, roe: 10.5, dividendYield: 2.8, sectorAvgPE: 19.0, volatility: 0.027,
  },

  // ── Services (3) ──────────────────────────────────────────────────────────
  {
    ticker: 'PRANDA', name: 'Pranda Jewelry PCL',                sector: 'Services',
    ipoDate: '2002-04-22', ipoPrice: 15.00,
    currentPrice: 8.20,  change: -0.10, changePct: -1.21, volume:   380_000, marketCap: 1.1,
    pe: 20.0, de: 0.42, fcf:  0.10, roe:  7.5, dividendYield: 2.5, sectorAvgPE: 16.5, volatility: 0.025,
  },
  {
    ticker: 'JCK',    name: 'J.C.K. International PCL',          sector: 'Services',
    ipoDate: '2006-02-14', ipoPrice: 3.50,
    currentPrice: 4.80,  change:  0.07, changePct:  1.48, volume: 1_200_000, marketCap: 0.7,
    pe: 14.0, de: 0.45, fcf:  0.09, roe:  8.5, dividendYield: 3.0, sectorAvgPE: 16.5, volatility: 0.028,
  },
  {
    ticker: 'SLC',    name: 'Siam Local PCL',                    sector: 'Services',
    ipoDate: '2014-07-18', ipoPrice: 2.80,
    currentPrice: 4.10,  change:  0.06, changePct:  1.49, volume: 1_600_000, marketCap: 0.6,
    pe: 16.5, de: 0.35, fcf:  0.08, roe:  9.8, dividendYield: 2.2, sectorAvgPE: 16.5, volatility: 0.027,
  },
]

export const STOCKS_MAP = Object.fromEntries(STOCKS.map(s => [s.ticker, s]))
export const SECTORS    = [...new Set(STOCKS.map(s => s.sector))]
