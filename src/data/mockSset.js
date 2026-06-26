/**
 * sSET Index — 100 constituents.
 * Same Stock shape as mockStocks.js; kept fully independent so indices never share state.
 * @typedef {import('./mockStocks.js').Stock} Stock
 */

/** @type {Stock[]} */
export const STOCKS = [
  // ── Food & Beverage (9) ──────────────────────────────────────────────────
  {
    ticker: 'ASIAN', name: 'Asian Sea Corporation PCL', sector: 'Food & Beverage',
    ipoDate: '1998-01-01', ipoPrice: 5,
    currentPrice: 7.40, change: 0.10, changePct: 1.37, volume: 9_200_000, marketCap: 6.8,
    pe: 14.5, de: 0.6, fcf: 0.5, roe: 12.5, dividendYield: 5.2, sectorAvgPE: 20.0, volatility: 0.025,
  },
  {
    ticker: 'COCOCO', name: 'Coco Experience PCL', sector: 'Food & Beverage',
    ipoDate: '2020-01-01', ipoPrice: 4,
    currentPrice: 3.82, change: -0.04, changePct: -1.04, volume: 6_500_000, marketCap: 2.8,
    pe: 18.5, de: 0.3, fcf: 0.2, roe: 10.5, dividendYield: 3.2, sectorAvgPE: 20.0, volatility: 0.030,
  },
  {
    ticker: 'KCG', name: 'Khon Kaen Sugar Industry PCL', sector: 'Food & Beverage',
    ipoDate: '1993-01-01', ipoPrice: 10,
    currentPrice: 4.28, change: 0.04, changePct: 0.94, volume: 14_500_000, marketCap: 8.5,
    pe: 10.5, de: 1.2, fcf: 0.6, roe: 9.5, dividendYield: 4.8, sectorAvgPE: 20.0, volatility: 0.028,
  },
  {
    ticker: 'MALEE', name: 'Malee Sampran PCL', sector: 'Food & Beverage',
    ipoDate: '1993-01-01', ipoPrice: 10,
    currentPrice: 22.50, change: 0.50, changePct: 2.27, volume: 8_500_000, marketCap: 12.5,
    pe: 18.5, de: 0.4, fcf: 0.8, roe: 14.5, dividendYield: 4.5, sectorAvgPE: 20.0, volatility: 0.022,
  },
  {
    ticker: 'RBF', name: 'Royal Benja Foods PCL', sector: 'Food & Beverage',
    ipoDate: '2016-01-01', ipoPrice: 4,
    currentPrice: 5.15, change: 0.05, changePct: 0.98, volume: 5_800_000, marketCap: 3.5,
    pe: 16.5, de: 0.5, fcf: 0.3, roe: 11.5, dividendYield: 4.0, sectorAvgPE: 20.0, volatility: 0.026,
  },
  {
    ticker: 'SAPPE', name: 'Sappe PCL', sector: 'Food & Beverage',
    ipoDate: '2013-07-09', ipoPrice: 14,
    currentPrice: 28.75, change: 0.25, changePct: 0.88, volume: 4_200_000, marketCap: 8.5,
    pe: 20.5, de: 0.3, fcf: 0.6, roe: 18.5, dividendYield: 6.2, sectorAvgPE: 20.0, volatility: 0.024,
  },
  {
    ticker: 'SNNP', name: 'S.N.N.P. Group PCL', sector: 'Food & Beverage',
    ipoDate: '2019-01-01', ipoPrice: 6,
    currentPrice: 9.80, change: 0.20, changePct: 2.08, volume: 7_200_000, marketCap: 5.2,
    pe: 22.5, de: 0.4, fcf: 0.4, roe: 15.5, dividendYield: 3.8, sectorAvgPE: 20.0, volatility: 0.028,
  },
  {
    ticker: 'TEGH', name: 'Thai Eastern Group Holdings PCL', sector: 'Food & Beverage',
    ipoDate: '2015-01-01', ipoPrice: 5,
    currentPrice: 6.40, change: -0.10, changePct: -1.54, volume: 8_800_000, marketCap: 4.8,
    pe: 12.5, de: 0.8, fcf: 0.5, roe: 11.5, dividendYield: 5.5, sectorAvgPE: 20.0, volatility: 0.026,
  },
  {
    ticker: 'TKN', name: 'Taokaenoi Food & Marketing PCL', sector: 'Food & Beverage',
    ipoDate: '2015-12-22', ipoPrice: 12,
    currentPrice: 14.20, change: 0.30, changePct: 2.16, volume: 6_500_000, marketCap: 7.5,
    pe: 24.5, de: 0.2, fcf: 0.5, roe: 18.5, dividendYield: 3.5, sectorAvgPE: 20.0, volatility: 0.026,
  },

  // ── Healthcare (8) ───────────────────────────────────────────────────────
  {
    ticker: 'EKH', name: 'Ekarat Hospital PCL', sector: 'Healthcare',
    ipoDate: '2018-01-01', ipoPrice: 5,
    currentPrice: 7.25, change: 0.15, changePct: 2.11, volume: 5_200_000, marketCap: 3.8,
    pe: 22.5, de: 0.4, fcf: 0.3, roe: 12.5, dividendYield: 3.2, sectorAvgPE: 30.0, volatility: 0.026,
  },
  {
    ticker: 'ILM', name: 'ILM PCL', sector: 'Healthcare',
    ipoDate: '2017-01-01', ipoPrice: 4,
    currentPrice: 5.45, change: -0.05, changePct: -0.91, volume: 4_800_000, marketCap: 2.8,
    pe: 18.5, de: 0.3, fcf: 0.2, roe: 10.5, dividendYield: 4.0, sectorAvgPE: 30.0, volatility: 0.028,
  },
  {
    ticker: 'KLINIQ', name: 'Kliniq PCL', sector: 'Healthcare',
    ipoDate: '2021-01-01', ipoPrice: 7,
    currentPrice: 10.80, change: 0.30, changePct: 2.86, volume: 8_500_000, marketCap: 5.5,
    pe: 35.5, de: 0.2, fcf: 0.3, roe: 18.5, dividendYield: 1.8, sectorAvgPE: 30.0, volatility: 0.032,
  },
  {
    ticker: 'MEDEZE', name: 'Medeze Group PCL', sector: 'Healthcare',
    ipoDate: '2019-01-01', ipoPrice: 5,
    currentPrice: 6.85, change: 0.10, changePct: 1.48, volume: 6_200_000, marketCap: 3.5,
    pe: 28.5, de: 0.3, fcf: 0.3, roe: 15.5, dividendYield: 2.5, sectorAvgPE: 30.0, volatility: 0.030,
  },
  {
    ticker: 'RJH', name: 'Rajthanee Hospital PCL', sector: 'Healthcare',
    ipoDate: '2011-01-01', ipoPrice: 6,
    currentPrice: 9.45, change: 0.15, changePct: 1.61, volume: 5_500_000, marketCap: 4.2,
    pe: 24.5, de: 0.5, fcf: 0.3, roe: 13.5, dividendYield: 3.5, sectorAvgPE: 30.0, volatility: 0.024,
  },
  {
    ticker: 'RPH', name: 'Rama PCL', sector: 'Healthcare',
    ipoDate: '2014-01-01', ipoPrice: 5,
    currentPrice: 6.20, change: -0.10, changePct: -1.59, volume: 4_800_000, marketCap: 3.2,
    pe: 20.5, de: 0.4, fcf: 0.3, roe: 11.5, dividendYield: 4.2, sectorAvgPE: 30.0, volatility: 0.026,
  },
  {
    ticker: 'THG', name: 'Thonburi Healthcare Group PCL', sector: 'Healthcare',
    ipoDate: '2017-01-01', ipoPrice: 16,
    currentPrice: 22.50, change: -0.25, changePct: -1.10, volume: 5_200_000, marketCap: 9.5,
    pe: 28.5, de: 0.6, fcf: 0.5, roe: 10.5, dividendYield: 2.5, sectorAvgPE: 30.0, volatility: 0.024,
  },
  {
    ticker: 'WPH', name: 'Wattana Pakorn Hospital PCL', sector: 'Healthcare',
    ipoDate: '2013-01-01', ipoPrice: 6,
    currentPrice: 9.45, change: 0.05, changePct: 0.53, volume: 8_500_000, marketCap: 4.8,
    pe: 22.5, de: 0.4, fcf: 0.3, roe: 12.5, dividendYield: 3.5, sectorAvgPE: 30.0, volatility: 0.024,
  },

  // ── Technology (16) ──────────────────────────────────────────────────────
  {
    ticker: 'ADVICE', name: 'Advice IT Infinite PCL', sector: 'Technology',
    ipoDate: '2007-01-01', ipoPrice: 5,
    currentPrice: 3.42, change: 0.04, changePct: 1.18, volume: 18_500_000, marketCap: 4.5,
    pe: 12.5, de: 0.4, fcf: 0.4, roe: 12.5, dividendYield: 6.5, sectorAvgPE: 22.0, volatility: 0.028,
  },
  {
    ticker: 'AIT', name: 'Advanced Information Technology PCL', sector: 'Technology',
    ipoDate: '2012-01-01', ipoPrice: 6,
    currentPrice: 9.85, change: 0.15, changePct: 1.55, volume: 8_500_000, marketCap: 5.8,
    pe: 16.5, de: 0.3, fcf: 0.5, roe: 16.5, dividendYield: 5.5, sectorAvgPE: 22.0, volatility: 0.026,
  },
  {
    ticker: 'BBIK', name: 'Baania (Thailand) PCL', sector: 'Technology',
    ipoDate: '2020-01-01', ipoPrice: 3,
    currentPrice: 1.82, change: -0.02, changePct: -1.09, volume: 22_000_000, marketCap: 2.5,
    pe: 0.0, de: 0.5, fcf: -0.1, roe: -5.5, dividendYield: 0.0, sectorAvgPE: 22.0, volatility: 0.040,
  },
  {
    ticker: 'DITTO', name: 'Ditto (Thailand) PCL', sector: 'Technology',
    ipoDate: '2016-01-01', ipoPrice: 5,
    currentPrice: 6.80, change: 0.10, changePct: 1.49, volume: 12_000_000, marketCap: 5.2,
    pe: 18.5, de: 0.4, fcf: 0.4, roe: 14.5, dividendYield: 4.8, sectorAvgPE: 22.0, volatility: 0.028,
  },
  {
    ticker: 'FORTH', name: 'Forth Corporation PCL', sector: 'Technology',
    ipoDate: '2002-01-01', ipoPrice: 5,
    currentPrice: 38.50, change: 0.50, changePct: 1.32, volume: 2_800_000, marketCap: 12.5,
    pe: 14.5, de: 0.5, fcf: 1.2, roe: 18.5, dividendYield: 5.5, sectorAvgPE: 22.0, volatility: 0.024,
  },
  {
    ticker: 'III', name: 'III PCL', sector: 'Technology',
    ipoDate: '2018-01-01', ipoPrice: 4,
    currentPrice: 5.20, change: 0.10, changePct: 1.96, volume: 9_500_000, marketCap: 3.8,
    pe: 20.5, de: 0.3, fcf: 0.3, roe: 13.5, dividendYield: 4.5, sectorAvgPE: 22.0, volatility: 0.028,
  },
  {
    ticker: 'ILINK', name: 'iLink Technology PCL', sector: 'Technology',
    ipoDate: '2019-01-01', ipoPrice: 3,
    currentPrice: 2.96, change: -0.04, changePct: -1.33, volume: 14_000_000, marketCap: 2.2,
    pe: 14.5, de: 0.4, fcf: 0.2, roe: 10.5, dividendYield: 4.0, sectorAvgPE: 22.0, volatility: 0.032,
  },
  {
    ticker: 'RABBIT', name: 'Rabbit Internet PCL', sector: 'Technology',
    ipoDate: '2021-01-01', ipoPrice: 5,
    currentPrice: 3.85, change: 0.05, changePct: 1.32, volume: 18_000_000, marketCap: 3.5,
    pe: 22.5, de: 0.5, fcf: 0.2, roe: 8.5, dividendYield: 2.5, sectorAvgPE: 22.0, volatility: 0.034,
  },
  {
    ticker: 'SAMART', name: 'Samart Corporation PCL', sector: 'Technology',
    ipoDate: '1998-01-01', ipoPrice: 10,
    currentPrice: 8.45, change: 0.15, changePct: 1.81, volume: 8_500_000, marketCap: 12.5,
    pe: 14.5, de: 0.8, fcf: 0.8, roe: 12.5, dividendYield: 5.5, sectorAvgPE: 22.0, volatility: 0.026,
  },
  {
    ticker: 'SIS', name: 'SiS Distribution (Thailand) PCL', sector: 'Technology',
    ipoDate: '2005-01-01', ipoPrice: 4,
    currentPrice: 12.80, change: 0.20, changePct: 1.59, volume: 5_200_000, marketCap: 5.5,
    pe: 14.5, de: 0.4, fcf: 0.5, roe: 18.5, dividendYield: 5.8, sectorAvgPE: 22.0, volatility: 0.024,
  },
  {
    ticker: 'SKY', name: 'Sky ICT PCL', sector: 'Technology',
    ipoDate: '2020-01-01', ipoPrice: 5,
    currentPrice: 7.25, change: 0.25, changePct: 3.57, volume: 12_000_000, marketCap: 4.8,
    pe: 25.5, de: 0.4, fcf: 0.3, roe: 15.5, dividendYield: 3.2, sectorAvgPE: 22.0, volatility: 0.030,
  },
  {
    ticker: 'SYNEX', name: 'Synnex (Thailand) PCL', sector: 'Technology',
    ipoDate: '2011-01-01', ipoPrice: 5,
    currentPrice: 9.60, change: 0.10, changePct: 1.05, volume: 5_500_000, marketCap: 4.5,
    pe: 12.5, de: 0.5, fcf: 0.5, roe: 14.5, dividendYield: 5.5, sectorAvgPE: 22.0, volatility: 0.024,
  },
  {
    ticker: 'TEAMG', name: 'Team Corporation PCL', sector: 'Technology',
    ipoDate: '2004-01-01', ipoPrice: 5,
    currentPrice: 8.75, change: 0.25, changePct: 2.94, volume: 18_500_000, marketCap: 5.8,
    pe: 20.5, de: 0.6, fcf: 0.5, roe: 16.5, dividendYield: 4.5, sectorAvgPE: 22.0, volatility: 0.030,
  },
  {
    ticker: 'THCOM', name: 'Thaicom PCL', sector: 'Technology',
    ipoDate: '1994-01-01', ipoPrice: 10,
    currentPrice: 7.85, change: -0.15, changePct: -1.87, volume: 12_000_000, marketCap: 8.5,
    pe: 0.0, de: 1.2, fcf: 0.5, roe: -2.5, dividendYield: 0.0, sectorAvgPE: 22.0, volatility: 0.034,
  },
  {
    ticker: 'TKS', name: 'TKS Technologies PCL', sector: 'Technology',
    ipoDate: '2010-01-01', ipoPrice: 4,
    currentPrice: 5.85, change: 0.05, changePct: 0.86, volume: 6_500_000, marketCap: 3.5,
    pe: 14.5, de: 0.3, fcf: 0.3, roe: 12.5, dividendYield: 5.0, sectorAvgPE: 22.0, volatility: 0.026,
  },
  {
    ticker: 'XPG', name: 'XPG PCL', sector: 'Technology',
    ipoDate: '2022-01-01', ipoPrice: 4,
    currentPrice: 4.65, change: 0.05, changePct: 1.09, volume: 8_500_000, marketCap: 2.8,
    pe: 18.5, de: 0.3, fcf: 0.2, roe: 12.5, dividendYield: 3.5, sectorAvgPE: 22.0, volatility: 0.030,
  },

  // ── Property (7) ─────────────────────────────────────────────────────────
  {
    ticker: 'BLAND', name: 'Bangkok Land PCL', sector: 'Property',
    ipoDate: '1993-01-01', ipoPrice: 10,
    currentPrice: 0.88, change: 0.01, changePct: 1.15, volume: 85_000_000, marketCap: 8.5,
    pe: 0.0, de: 0.5, fcf: 0.2, roe: 1.5, dividendYield: 0.0, sectorAvgPE: 14.0, volatility: 0.030,
  },
  {
    ticker: 'LPN', name: 'L.P.N. Development PCL', sector: 'Property',
    ipoDate: '1994-01-01', ipoPrice: 5,
    currentPrice: 5.25, change: -0.05, changePct: -0.94, volume: 18_500_000, marketCap: 8.5,
    pe: 8.5, de: 0.8, fcf: 0.6, roe: 9.5, dividendYield: 8.5, sectorAvgPE: 14.0, volatility: 0.028,
  },
  {
    ticker: 'NEX', name: 'NEX Point PCL', sector: 'Property',
    ipoDate: '2018-01-01', ipoPrice: 5,
    currentPrice: 4.15, change: 0.05, changePct: 1.22, volume: 12_000_000, marketCap: 3.8,
    pe: 10.5, de: 1.5, fcf: 0.3, roe: 8.5, dividendYield: 5.5, sectorAvgPE: 14.0, volatility: 0.032,
  },
  {
    ticker: 'NOBLE', name: 'Noble Development PCL', sector: 'Property',
    ipoDate: '1997-01-01', ipoPrice: 5,
    currentPrice: 2.82, change: 0.02, changePct: 0.71, volume: 28_000_000, marketCap: 5.8,
    pe: 6.5, de: 1.8, fcf: 0.5, roe: 10.5, dividendYield: 7.5, sectorAvgPE: 14.0, volatility: 0.032,
  },
  {
    ticker: 'ORI', name: 'Origin Property PCL', sector: 'Property',
    ipoDate: '2015-01-01', ipoPrice: 4,
    currentPrice: 4.98, change: 0.04, changePct: 0.81, volume: 22_000_000, marketCap: 12.5,
    pe: 7.5, de: 2.2, fcf: 0.8, roe: 14.5, dividendYield: 6.8, sectorAvgPE: 14.0, volatility: 0.030,
  },
  {
    ticker: 'PSH', name: 'Pruksa Holding PCL', sector: 'Property',
    ipoDate: '2012-01-01', ipoPrice: 12,
    currentPrice: 14.80, change: 0.20, changePct: 1.37, volume: 8_500_000, marketCap: 22.5,
    pe: 9.5, de: 0.8, fcf: 1.5, roe: 12.5, dividendYield: 7.5, sectorAvgPE: 14.0, volatility: 0.024,
  },
  {
    ticker: 'SC', name: 'SC Asset Corporation PCL', sector: 'Property',
    ipoDate: '2005-01-01', ipoPrice: 5,
    currentPrice: 3.42, change: -0.04, changePct: -1.16, volume: 18_000_000, marketCap: 8.5,
    pe: 8.5, de: 1.2, fcf: 0.5, roe: 10.5, dividendYield: 6.5, sectorAvgPE: 14.0, volatility: 0.028,
  },

  // ── Manufacturing (13) ──────────────────────────────────────────────────
  {
    ticker: 'BYD', name: 'BYD (Thailand) PCL', sector: 'Manufacturing',
    ipoDate: '2023-01-01', ipoPrice: 8,
    currentPrice: 11.50, change: 0.50, changePct: 4.55, volume: 18_500_000, marketCap: 8.5,
    pe: 28.5, de: 0.5, fcf: 0.4, roe: 14.5, dividendYield: 1.5, sectorAvgPE: 12.0, volatility: 0.038,
  },
  {
    ticker: 'EPG', name: 'Epoch PCL', sector: 'Manufacturing',
    ipoDate: '2014-01-01', ipoPrice: 6,
    currentPrice: 8.20, change: 0.10, changePct: 1.23, volume: 8_500_000, marketCap: 6.5,
    pe: 16.5, de: 0.6, fcf: 0.5, roe: 14.5, dividendYield: 5.2, sectorAvgPE: 12.0, volatility: 0.026,
  },
  {
    ticker: 'HFT', name: 'HFT PCL', sector: 'Manufacturing',
    ipoDate: '2019-01-01', ipoPrice: 4,
    currentPrice: 4.85, change: 0.05, changePct: 1.04, volume: 7_500_000, marketCap: 3.2,
    pe: 12.5, de: 0.7, fcf: 0.3, roe: 10.5, dividendYield: 4.5, sectorAvgPE: 12.0, volatility: 0.028,
  },
  {
    ticker: 'HTC', name: 'Hydrotek PCL', sector: 'Manufacturing',
    ipoDate: '2007-01-01', ipoPrice: 5,
    currentPrice: 6.45, change: 0.05, changePct: 0.78, volume: 6_200_000, marketCap: 4.2,
    pe: 12.5, de: 0.8, fcf: 0.4, roe: 11.5, dividendYield: 5.0, sectorAvgPE: 12.0, volatility: 0.026,
  },
  {
    ticker: 'MCS', name: 'MCS Steel PCL', sector: 'Manufacturing',
    ipoDate: '2011-01-01', ipoPrice: 5,
    currentPrice: 4.62, change: -0.04, changePct: -0.86, volume: 9_800_000, marketCap: 4.8,
    pe: 8.5, de: 1.2, fcf: 0.4, roe: 10.5, dividendYield: 5.5, sectorAvgPE: 12.0, volatility: 0.028,
  },
  {
    ticker: 'NER', name: 'Northeast Rubber PCL', sector: 'Manufacturing',
    ipoDate: '2015-01-01', ipoPrice: 5,
    currentPrice: 3.85, change: 0.05, changePct: 1.32, volume: 12_000_000, marketCap: 3.5,
    pe: 9.5, de: 1.0, fcf: 0.3, roe: 9.5, dividendYield: 4.8, sectorAvgPE: 12.0, volatility: 0.030,
  },
  {
    ticker: 'NYT', name: 'N.Y.T. Steel Works PCL', sector: 'Manufacturing',
    ipoDate: '2010-01-01', ipoPrice: 4,
    currentPrice: 3.42, change: 0.02, changePct: 0.59, volume: 15_000_000, marketCap: 3.8,
    pe: 10.5, de: 1.5, fcf: 0.3, roe: 8.5, dividendYield: 4.5, sectorAvgPE: 12.0, volatility: 0.030,
  },
  {
    ticker: 'OKJ', name: 'OKJ PCL', sector: 'Manufacturing',
    ipoDate: '2018-01-01', ipoPrice: 3,
    currentPrice: 3.85, change: 0.05, changePct: 1.32, volume: 8_500_000, marketCap: 2.8,
    pe: 11.5, de: 0.8, fcf: 0.2, roe: 9.5, dividendYield: 4.0, sectorAvgPE: 12.0, volatility: 0.030,
  },
  {
    ticker: 'SAK', name: 'Sornsub PCL', sector: 'Manufacturing',
    ipoDate: '2016-01-01', ipoPrice: 3,
    currentPrice: 2.85, change: -0.05, changePct: -1.72, volume: 9_500_000, marketCap: 2.5,
    pe: 9.5, de: 1.0, fcf: 0.2, roe: 8.5, dividendYield: 4.5, sectorAvgPE: 12.0, volatility: 0.032,
  },
  {
    ticker: 'SAT', name: 'Somboon Advance Technology PCL', sector: 'Manufacturing',
    ipoDate: '2003-01-01', ipoPrice: 5,
    currentPrice: 18.50, change: 0.50, changePct: 2.78, volume: 5_200_000, marketCap: 12.5,
    pe: 12.5, de: 0.8, fcf: 0.8, roe: 14.5, dividendYield: 5.5, sectorAvgPE: 12.0, volatility: 0.024,
  },
  {
    ticker: 'SCGD', name: 'SCG Decor PCL', sector: 'Manufacturing',
    ipoDate: '2022-01-01', ipoPrice: 10,
    currentPrice: 8.65, change: -0.15, changePct: -1.71, volume: 8_500_000, marketCap: 18.5,
    pe: 14.5, de: 0.6, fcf: 0.8, roe: 12.5, dividendYield: 4.5, sectorAvgPE: 12.0, volatility: 0.026,
  },
  {
    ticker: 'STPI', name: 'Steel Technologies PCL', sector: 'Manufacturing',
    ipoDate: '2014-01-01', ipoPrice: 4,
    currentPrice: 3.62, change: 0.04, changePct: 1.12, volume: 10_000_000, marketCap: 3.2,
    pe: 9.5, de: 1.2, fcf: 0.3, roe: 9.5, dividendYield: 4.5, sectorAvgPE: 12.0, volatility: 0.030,
  },
  {
    ticker: 'TFM', name: 'Thai Film Industries PCL', sector: 'Manufacturing',
    ipoDate: '1998-01-01', ipoPrice: 5,
    currentPrice: 5.25, change: 0.05, changePct: 0.96, volume: 7_200_000, marketCap: 4.5,
    pe: 10.5, de: 0.9, fcf: 0.4, roe: 10.5, dividendYield: 5.0, sectorAvgPE: 12.0, volatility: 0.026,
  },

  // ── Consumer (9) ─────────────────────────────────────────────────────────
  {
    ticker: 'FM', name: 'FMC PCL', sector: 'Consumer',
    ipoDate: '2017-01-01', ipoPrice: 4,
    currentPrice: 5.45, change: 0.05, changePct: 0.93, volume: 7_500_000, marketCap: 3.5,
    pe: 14.5, de: 0.4, fcf: 0.3, roe: 12.5, dividendYield: 4.5, sectorAvgPE: 18.0, volatility: 0.026,
  },
  {
    ticker: 'KAMART', name: 'K-Art PCL', sector: 'Consumer',
    ipoDate: '2020-01-01', ipoPrice: 3,
    currentPrice: 2.85, change: -0.05, changePct: -1.72, volume: 8_500_000, marketCap: 2.2,
    pe: 12.5, de: 0.5, fcf: 0.2, roe: 9.5, dividendYield: 3.8, sectorAvgPE: 18.0, volatility: 0.030,
  },
  {
    ticker: 'MC', name: 'MC Fashion PCL', sector: 'Consumer',
    ipoDate: '2015-01-01', ipoPrice: 6,
    currentPrice: 8.25, change: 0.25, changePct: 3.13, volume: 6_200_000, marketCap: 5.5,
    pe: 18.5, de: 0.3, fcf: 0.4, roe: 15.5, dividendYield: 5.5, sectorAvgPE: 18.0, volatility: 0.026,
  },
  {
    ticker: 'PLAT', name: 'Platinum Group PCL', sector: 'Consumer',
    ipoDate: '2014-01-01', ipoPrice: 5,
    currentPrice: 4.62, change: -0.08, changePct: -1.70, volume: 12_000_000, marketCap: 4.8,
    pe: 12.5, de: 0.5, fcf: 0.4, roe: 11.5, dividendYield: 5.5, sectorAvgPE: 18.0, volatility: 0.028,
  },
  {
    ticker: 'SABINA', name: 'Sabina PCL', sector: 'Consumer',
    ipoDate: '2005-01-01', ipoPrice: 5,
    currentPrice: 12.80, change: 0.20, changePct: 1.59, volume: 5_500_000, marketCap: 6.5,
    pe: 16.5, de: 0.3, fcf: 0.5, roe: 18.5, dividendYield: 6.5, sectorAvgPE: 18.0, volatility: 0.024,
  },
  {
    ticker: 'SINGER', name: 'Singer Thailand PCL', sector: 'Consumer',
    ipoDate: '1993-01-01', ipoPrice: 5,
    currentPrice: 4.52, change: -0.04, changePct: -0.88, volume: 12_000_000, marketCap: 4.5,
    pe: 9.5, de: 1.8, fcf: 0.4, roe: 10.5, dividendYield: 6.5, sectorAvgPE: 18.0, volatility: 0.028,
  },
  {
    ticker: 'SPA', name: 'S.P.A. Natural PCL', sector: 'Consumer',
    ipoDate: '2019-01-01', ipoPrice: 5,
    currentPrice: 6.20, change: 0.10, changePct: 1.64, volume: 6_500_000, marketCap: 3.5,
    pe: 20.5, de: 0.3, fcf: 0.3, roe: 14.5, dividendYield: 4.2, sectorAvgPE: 18.0, volatility: 0.028,
  },
  {
    ticker: 'SUN', name: 'Sun PCL', sector: 'Consumer',
    ipoDate: '2017-01-01', ipoPrice: 4,
    currentPrice: 3.62, change: 0.02, changePct: 0.56, volume: 9_200_000, marketCap: 2.8,
    pe: 13.5, de: 0.6, fcf: 0.3, roe: 10.5, dividendYield: 4.5, sectorAvgPE: 18.0, volatility: 0.028,
  },
  {
    ticker: 'TMAN', name: 'Thaimart PCL', sector: 'Consumer',
    ipoDate: '2012-01-01', ipoPrice: 5,
    currentPrice: 4.25, change: -0.05, changePct: -1.16, volume: 8_500_000, marketCap: 3.5,
    pe: 11.5, de: 0.8, fcf: 0.3, roe: 9.5, dividendYield: 5.5, sectorAvgPE: 18.0, volatility: 0.028,
  },

  // ── Financials (10) ──────────────────────────────────────────────────────
  {
    ticker: 'ASK', name: 'Asia Sermkij Leasing PCL', sector: 'Financials',
    ipoDate: '2001-01-01', ipoPrice: 5,
    currentPrice: 3.42, change: 0.02, changePct: 0.59, volume: 18_500_000, marketCap: 5.5,
    pe: 9.5, de: 4.5, fcf: 0.8, roe: 12.5, dividendYield: 6.5, sectorAvgPE: 14.0, volatility: 0.026,
  },
  {
    ticker: 'CB', name: 'CB PCL', sector: 'Financials',
    ipoDate: '2018-01-01', ipoPrice: 4,
    currentPrice: 5.25, change: 0.05, changePct: 0.96, volume: 9_500_000, marketCap: 4.2,
    pe: 12.5, de: 0.8, fcf: 0.4, roe: 12.5, dividendYield: 5.0, sectorAvgPE: 14.0, volatility: 0.026,
  },
  {
    ticker: 'HENG', name: 'Heng Leasing & Capital PCL', sector: 'Financials',
    ipoDate: '2015-01-01', ipoPrice: 4,
    currentPrice: 4.85, change: 0.05, changePct: 1.04, volume: 12_000_000, marketCap: 3.8,
    pe: 10.5, de: 3.5, fcf: 0.6, roe: 14.5, dividendYield: 6.5, sectorAvgPE: 14.0, volatility: 0.028,
  },
  {
    ticker: 'KGI', name: 'KGI Securities (Thailand) PCL', sector: 'Financials',
    ipoDate: '2003-01-01', ipoPrice: 5,
    currentPrice: 2.28, change: 0.02, changePct: 0.88, volume: 22_000_000, marketCap: 4.5,
    pe: 14.5, de: 0.5, fcf: 0.5, roe: 9.5, dividendYield: 4.5, sectorAvgPE: 14.0, volatility: 0.028,
  },
  {
    ticker: 'NCAP', name: 'N Capital PCL', sector: 'Financials',
    ipoDate: '2019-01-01', ipoPrice: 3,
    currentPrice: 3.25, change: 0.05, changePct: 1.56, volume: 8_500_000, marketCap: 2.5,
    pe: 11.5, de: 2.5, fcf: 0.3, roe: 11.5, dividendYield: 5.5, sectorAvgPE: 14.0, volatility: 0.030,
  },
  {
    ticker: 'NSL', name: 'Nithipat Capital PCL', sector: 'Financials',
    ipoDate: '2010-01-01', ipoPrice: 4,
    currentPrice: 3.82, change: -0.04, changePct: -1.04, volume: 7_500_000, marketCap: 2.8,
    pe: 10.5, de: 2.0, fcf: 0.3, roe: 10.5, dividendYield: 5.5, sectorAvgPE: 14.0, volatility: 0.028,
  },
  {
    ticker: 'PTL', name: 'Petro-Thai Leasing PCL', sector: 'Financials',
    ipoDate: '2012-01-01', ipoPrice: 4,
    currentPrice: 4.25, change: 0.05, changePct: 1.19, volume: 9_200_000, marketCap: 3.2,
    pe: 10.5, de: 3.0, fcf: 0.5, roe: 12.5, dividendYield: 6.0, sectorAvgPE: 14.0, volatility: 0.026,
  },
  {
    ticker: 'SCAP', name: 'Seamico Securities PCL', sector: 'Financials',
    ipoDate: '1995-01-01', ipoPrice: 5,
    currentPrice: 1.85, change: 0.02, changePct: 1.09, volume: 28_000_000, marketCap: 3.5,
    pe: 12.5, de: 0.4, fcf: 0.4, roe: 8.5, dividendYield: 4.5, sectorAvgPE: 14.0, volatility: 0.030,
  },
  {
    ticker: 'THANI', name: 'Thani Leasing PCL', sector: 'Financials',
    ipoDate: '2008-01-01', ipoPrice: 5,
    currentPrice: 4.62, change: -0.04, changePct: -0.86, volume: 12_000_000, marketCap: 4.5,
    pe: 9.5, de: 3.5, fcf: 0.8, roe: 13.5, dividendYield: 7.5, sectorAvgPE: 14.0, volatility: 0.026,
  },
  {
    ticker: 'TQM', name: 'TQM Corporation PCL', sector: 'Financials',
    ipoDate: '2016-01-01', ipoPrice: 10,
    currentPrice: 38.25, change: 0.75, changePct: 2.00, volume: 3_200_000, marketCap: 14.5,
    pe: 18.5, de: 0.3, fcf: 0.8, roe: 22.5, dividendYield: 4.5, sectorAvgPE: 14.0, volatility: 0.022,
  },

  // ── Energy (6) ───────────────────────────────────────────────────────────
  {
    ticker: 'BAFS', name: 'Bangkok Aviation Fuel Services PCL', sector: 'Energy',
    ipoDate: '1993-01-01', ipoPrice: 10,
    currentPrice: 22.50, change: 0.50, changePct: 2.27, volume: 5_200_000, marketCap: 12.5,
    pe: 16.5, de: 0.5, fcf: 0.8, roe: 14.5, dividendYield: 5.5, sectorAvgPE: 15.0, volatility: 0.022,
  },
  {
    ticker: 'BBGI', name: 'BBGI PCL', sector: 'Energy',
    ipoDate: '2015-01-01', ipoPrice: 5,
    currentPrice: 6.45, change: 0.05, changePct: 0.78, volume: 8_500_000, marketCap: 5.5,
    pe: 18.5, de: 0.8, fcf: 0.5, roe: 10.5, dividendYield: 4.5, sectorAvgPE: 15.0, volatility: 0.026,
  },
  {
    ticker: 'LANNA', name: 'Lanna Resources PCL', sector: 'Energy',
    ipoDate: '1993-01-01', ipoPrice: 10,
    currentPrice: 14.80, change: -0.20, changePct: -1.34, volume: 4_800_000, marketCap: 8.5,
    pe: 8.5, de: 0.3, fcf: 1.2, roe: 16.5, dividendYield: 8.5, sectorAvgPE: 15.0, volatility: 0.028,
  },
  {
    ticker: 'PCE', name: 'PCE Group PCL', sector: 'Energy',
    ipoDate: '2018-01-01', ipoPrice: 4,
    currentPrice: 3.85, change: 0.05, changePct: 1.32, volume: 9_500_000, marketCap: 2.8,
    pe: 12.5, de: 0.6, fcf: 0.3, roe: 10.5, dividendYield: 4.5, sectorAvgPE: 15.0, volatility: 0.030,
  },
  {
    ticker: 'PT', name: 'PT PCL', sector: 'Energy',
    ipoDate: '2016-01-01', ipoPrice: 5,
    currentPrice: 6.20, change: 0.10, changePct: 1.64, volume: 7_200_000, marketCap: 4.5,
    pe: 14.5, de: 0.5, fcf: 0.4, roe: 12.5, dividendYield: 5.5, sectorAvgPE: 15.0, volatility: 0.026,
  },
  {
    ticker: 'SUPER', name: 'SUPER Energy Corporation PCL', sector: 'Energy',
    ipoDate: '2014-01-01', ipoPrice: 4,
    currentPrice: 1.82, change: 0.02, changePct: 1.11, volume: 62_000_000, marketCap: 5.5,
    pe: 0.0, de: 2.5, fcf: 0.4, roe: 3.5, dividendYield: 0.0, sectorAvgPE: 15.0, volatility: 0.038,
  },

  // ── Transport (5) ────────────────────────────────────────────────────────
  {
    ticker: 'AAI', name: 'Asia Aviation PCL', sector: 'Transport',
    ipoDate: '2012-01-01', ipoPrice: 4,
    currentPrice: 3.62, change: 0.04, changePct: 1.12, volume: 28_000_000, marketCap: 12.5,
    pe: 18.5, de: 1.5, fcf: 0.8, roe: 10.5, dividendYield: 3.5, sectorAvgPE: 16.0, volatility: 0.032,
  },
  {
    ticker: 'DMT', name: 'Don Muang Tollway PCL', sector: 'Transport',
    ipoDate: '1993-01-01', ipoPrice: 10,
    currentPrice: 6.85, change: 0.05, changePct: 0.74, volume: 8_500_000, marketCap: 8.5,
    pe: 22.5, de: 2.5, fcf: 0.8, roe: 12.5, dividendYield: 5.5, sectorAvgPE: 16.0, volatility: 0.022,
  },
  {
    ticker: 'PM', name: 'PM Thoresen Asia Holdings PCL', sector: 'Transport',
    ipoDate: '2010-01-01', ipoPrice: 5,
    currentPrice: 4.85, change: -0.05, changePct: -1.02, volume: 8_500_000, marketCap: 4.2,
    pe: 12.5, de: 0.8, fcf: 0.4, roe: 10.5, dividendYield: 5.5, sectorAvgPE: 16.0, volatility: 0.028,
  },
  {
    ticker: 'PSL', name: 'Precious Shipping PCL', sector: 'Transport',
    ipoDate: '1993-01-01', ipoPrice: 10,
    currentPrice: 18.50, change: 0.50, changePct: 2.78, volume: 5_200_000, marketCap: 12.5,
    pe: 8.5, de: 0.8, fcf: 1.5, roe: 14.5, dividendYield: 8.5, sectorAvgPE: 16.0, volatility: 0.028,
  },
  {
    ticker: 'TTA', name: 'Thoresen Thai Agencies PCL', sector: 'Transport',
    ipoDate: '1993-01-01', ipoPrice: 10,
    currentPrice: 15.80, change: 0.30, changePct: 1.93, volume: 8_500_000, marketCap: 12.5,
    pe: 10.5, de: 0.6, fcf: 1.2, roe: 12.5, dividendYield: 6.5, sectorAvgPE: 16.0, volatility: 0.026,
  },

  // ── Media & Entertainment (5) ────────────────────────────────────────────
  {
    ticker: 'BEC', name: 'BEC World PCL', sector: 'Media & Entertainment',
    ipoDate: '1993-01-01', ipoPrice: 10,
    currentPrice: 5.25, change: -0.05, changePct: -0.94, volume: 18_500_000, marketCap: 8.5,
    pe: 12.5, de: 0.2, fcf: 0.6, roe: 8.5, dividendYield: 7.5, sectorAvgPE: 20.0, volatility: 0.026,
  },
  {
    ticker: 'MAJOR', name: 'Major Cineplex Group PCL', sector: 'Media & Entertainment',
    ipoDate: '2002-01-01', ipoPrice: 5,
    currentPrice: 22.50, change: 0.50, changePct: 2.27, volume: 6_200_000, marketCap: 14.5,
    pe: 28.5, de: 1.2, fcf: 0.8, roe: 12.5, dividendYield: 3.5, sectorAvgPE: 20.0, volatility: 0.026,
  },
  {
    ticker: 'MASTER', name: 'Master Ad PCL', sector: 'Media & Entertainment',
    ipoDate: '2002-01-01', ipoPrice: 3,
    currentPrice: 5.85, change: -0.05, changePct: -0.85, volume: 5_200_000, marketCap: 3.8,
    pe: 14.5, de: 0.4, fcf: 0.3, roe: 11.5, dividendYield: 4.5, sectorAvgPE: 20.0, volatility: 0.026,
  },
  {
    ticker: 'ONEE', name: 'One Enterprise PCL', sector: 'Media & Entertainment',
    ipoDate: '2014-01-01', ipoPrice: 4,
    currentPrice: 2.85, change: 0.05, changePct: 1.79, volume: 18_500_000, marketCap: 5.5,
    pe: 14.5, de: 0.5, fcf: 0.4, roe: 8.5, dividendYield: 5.5, sectorAvgPE: 20.0, volatility: 0.028,
  },
  {
    ticker: 'PSP', name: 'P.S.P. Entertainment PCL', sector: 'Media & Entertainment',
    ipoDate: '2018-01-01', ipoPrice: 3,
    currentPrice: 2.62, change: -0.04, changePct: -1.50, volume: 9_500_000, marketCap: 2.2,
    pe: 10.5, de: 0.6, fcf: 0.2, roe: 8.5, dividendYield: 4.5, sectorAvgPE: 20.0, volatility: 0.030,
  },

  // ── Services (12) ────────────────────────────────────────────────────────
  {
    ticker: 'AH', name: 'Amata Holdings PCL', sector: 'Services',
    ipoDate: '2018-01-01', ipoPrice: 5,
    currentPrice: 6.45, change: 0.05, changePct: 0.78, volume: 8_500_000, marketCap: 5.8,
    pe: 16.5, de: 0.8, fcf: 0.5, roe: 12.5, dividendYield: 4.5, sectorAvgPE: 16.0, volatility: 0.026,
  },
  {
    ticker: 'BLC', name: 'BLS International Services PCL', sector: 'Services',
    ipoDate: '2019-01-01', ipoPrice: 4,
    currentPrice: 4.82, change: 0.08, changePct: 1.69, volume: 7_500_000, marketCap: 3.2,
    pe: 14.5, de: 0.3, fcf: 0.3, roe: 14.5, dividendYield: 5.0, sectorAvgPE: 16.0, volatility: 0.026,
  },
  {
    ticker: 'EASTW', name: 'East Water Resources Management PCL', sector: 'Services',
    ipoDate: '2000-01-01', ipoPrice: 5,
    currentPrice: 9.85, change: 0.15, changePct: 1.55, volume: 6_200_000, marketCap: 8.5,
    pe: 18.5, de: 1.2, fcf: 0.8, roe: 14.5, dividendYield: 5.5, sectorAvgPE: 16.0, volatility: 0.020,
  },
  {
    ticker: 'HUMAN', name: 'Human Holdings PCL', sector: 'Services',
    ipoDate: '2020-01-01', ipoPrice: 3,
    currentPrice: 2.85, change: -0.05, changePct: -1.72, volume: 9_200_000, marketCap: 2.2,
    pe: 12.5, de: 0.4, fcf: 0.2, roe: 10.5, dividendYield: 4.0, sectorAvgPE: 16.0, volatility: 0.028,
  },
  {
    ticker: 'KBS', name: 'K-Biz Holdings PCL', sector: 'Services',
    ipoDate: '2019-01-01', ipoPrice: 3,
    currentPrice: 3.42, change: 0.04, changePct: 1.18, volume: 8_500_000, marketCap: 2.5,
    pe: 13.5, de: 0.5, fcf: 0.2, roe: 11.5, dividendYield: 4.5, sectorAvgPE: 16.0, volatility: 0.028,
  },
  {
    ticker: 'NEO', name: 'Neo Corporate PCL', sector: 'Services',
    ipoDate: '2016-01-01', ipoPrice: 4,
    currentPrice: 4.62, change: 0.04, changePct: 0.87, volume: 6_500_000, marketCap: 3.2,
    pe: 14.5, de: 0.4, fcf: 0.3, roe: 12.5, dividendYield: 4.8, sectorAvgPE: 16.0, volatility: 0.026,
  },
  {
    ticker: 'ROJNA', name: 'Rojana Industrial Park PCL', sector: 'Services',
    ipoDate: '1994-01-01', ipoPrice: 10,
    currentPrice: 4.85, change: 0.05, changePct: 1.04, volume: 12_000_000, marketCap: 5.5,
    pe: 10.5, de: 0.5, fcf: 0.5, roe: 8.5, dividendYield: 5.5, sectorAvgPE: 16.0, volatility: 0.026,
  },
  {
    ticker: 'SHR', name: 'S Hotels and Resorts PCL', sector: 'Services',
    ipoDate: '2019-01-01', ipoPrice: 5,
    currentPrice: 3.42, change: -0.04, changePct: -1.16, volume: 15_000_000, marketCap: 5.5,
    pe: 0.0, de: 1.5, fcf: 0.3, roe: -2.5, dividendYield: 0.0, sectorAvgPE: 16.0, volatility: 0.034,
  },
  {
    ticker: 'SRICHA', name: 'Sricha Holdings PCL', sector: 'Services',
    ipoDate: '2017-01-01', ipoPrice: 3,
    currentPrice: 2.95, change: 0.03, changePct: 1.03, volume: 7_500_000, marketCap: 2.2,
    pe: 11.5, de: 0.6, fcf: 0.2, roe: 9.5, dividendYield: 4.5, sectorAvgPE: 16.0, volatility: 0.028,
  },
  {
    ticker: 'TIPH', name: 'Thai Interglobe PCL', sector: 'Services',
    ipoDate: '2015-01-01', ipoPrice: 4,
    currentPrice: 3.82, change: -0.04, changePct: -1.04, volume: 8_500_000, marketCap: 2.8,
    pe: 12.5, de: 0.5, fcf: 0.3, roe: 10.5, dividendYield: 5.0, sectorAvgPE: 16.0, volatility: 0.028,
  },
  {
    ticker: 'UVAN', name: 'U Van PCL', sector: 'Services',
    ipoDate: '2018-01-01', ipoPrice: 3,
    currentPrice: 2.65, change: 0.03, changePct: 1.14, volume: 9_500_000, marketCap: 2.0,
    pe: 10.5, de: 0.5, fcf: 0.2, roe: 9.5, dividendYield: 4.5, sectorAvgPE: 16.0, volatility: 0.030,
  },
  {
    ticker: 'VIH', name: 'Victory Intersolution Holdings PCL', sector: 'Services',
    ipoDate: '2020-01-01', ipoPrice: 3,
    currentPrice: 2.85, change: 0.05, changePct: 1.79, volume: 8_500_000, marketCap: 2.2,
    pe: 13.5, de: 0.4, fcf: 0.2, roe: 10.5, dividendYield: 4.0, sectorAvgPE: 16.0, volatility: 0.028,
  },
]

/** @type {Object.<string, import('./mockStocks.js').Stock>} */
export const STOCKS_MAP = Object.fromEntries(STOCKS.map(s => [s.ticker, s]))

export const SECTORS = [...new Set(STOCKS.map(s => s.sector))]
