/**
 * sSET Index — small and mid-cap companies listed on SET.
 * Same Stock shape as mockStocks.js; kept fully independent so indices never share state.
 * @typedef {import('./mockStocks.js').Stock} Stock
 */

/** @type {Stock[]} */
export const STOCKS = [
  // ── Food & Beverage (7) ───────────────────────────────────────────────────
  {
    ticker: 'MALEE', name: 'Malee Sampran PCL', sector: 'Food & Beverage',
    ipoDate: '1993-01-01', ipoPrice: 10,
    currentPrice: 22.50, change: 0.50, changePct: 2.27, volume: 8_500_000, marketCap: 12.5,
    pe: 18.5, de: 0.4, fcf: 0.8, roe: 14.5, dividendYield: 4.5, sectorAvgPE: 20.0, volatility: 0.022,
  },
  {
    ticker: 'ICHI', name: 'Ichitan Group PCL', sector: 'Food & Beverage',
    ipoDate: '2012-06-22', ipoPrice: 4.5,
    currentPrice: 4.82, change: -0.08, changePct: -1.63, volume: 18_500_000, marketCap: 9.6,
    pe: 22.5, de: 0.5, fcf: 0.5, roe: 12.5, dividendYield: 5.5, sectorAvgPE: 20.0, volatility: 0.028,
  },
  {
    ticker: 'ZEN', name: 'Zen Corporation Group PCL', sector: 'Food & Beverage',
    ipoDate: '2017-04-20', ipoPrice: 8,
    currentPrice: 6.25, change: 0.05, changePct: 0.81, volume: 12_000_000, marketCap: 5.2,
    pe: 15.5, de: 0.8, fcf: 0.4, roe: 10.5, dividendYield: 3.8, sectorAvgPE: 20.0, volatility: 0.030,
  },
  {
    ticker: 'SAPPE', name: 'Sappe PCL', sector: 'Food & Beverage',
    ipoDate: '2013-07-09', ipoPrice: 14,
    currentPrice: 28.75, change: 0.25, changePct: 0.88, volume: 4_200_000, marketCap: 8.5,
    pe: 20.5, de: 0.3, fcf: 0.6, roe: 18.5, dividendYield: 6.2, sectorAvgPE: 20.0, volatility: 0.024,
  },
  {
    ticker: 'SNP', name: 'S & P Syndicate PCL', sector: 'Food & Beverage',
    ipoDate: '1994-01-01', ipoPrice: 10,
    currentPrice: 38.50, change: -0.50, changePct: -1.28, volume: 3_200_000, marketCap: 11.5,
    pe: 24.5, de: 0.6, fcf: 0.5, roe: 16.5, dividendYield: 3.5, sectorAvgPE: 20.0, volatility: 0.020,
  },
  {
    ticker: 'OISHI', name: 'Oishi Group PCL', sector: 'Food & Beverage',
    ipoDate: '2004-08-11', ipoPrice: 5,
    currentPrice: 42.25, change: 0.75, changePct: 1.81, volume: 2_800_000, marketCap: 8.5,
    pe: 28.5, de: 0.4, fcf: 0.4, roe: 22.5, dividendYield: 4.8, sectorAvgPE: 20.0, volatility: 0.022,
  },
  {
    ticker: 'TFG', name: 'Thai Foods Group PCL', sector: 'Food & Beverage',
    ipoDate: '2012-01-01', ipoPrice: 3,
    currentPrice: 3.28, change: 0.02, changePct: 0.61, volume: 28_000_000, marketCap: 7.5,
    pe: 12.5, de: 1.2, fcf: 0.6, roe: 9.5, dividendYield: 5.2, sectorAvgPE: 20.0, volatility: 0.026,
  },

  // ── Healthcare (6) ───────────────────────────────────────────────────────
  {
    ticker: 'WPH', name: 'Wattana Pakorn Hospital PCL', sector: 'Healthcare',
    ipoDate: '2013-01-01', ipoPrice: 6,
    currentPrice: 9.45, change: 0.05, changePct: 0.53, volume: 8_500_000, marketCap: 4.8,
    pe: 22.5, de: 0.4, fcf: 0.3, roe: 12.5, dividendYield: 3.5, sectorAvgPE: 30.0, volatility: 0.024,
  },
  {
    ticker: 'SKR', name: 'Sikarin PCL', sector: 'Healthcare',
    ipoDate: '2005-01-01', ipoPrice: 4,
    currentPrice: 7.80, change: -0.10, changePct: -1.27, volume: 6_200_000, marketCap: 4.5,
    pe: 20.5, de: 0.3, fcf: 0.3, roe: 11.5, dividendYield: 4.2, sectorAvgPE: 30.0, volatility: 0.026,
  },
  {
    ticker: 'RAM', name: 'Ramkhamhaeng Hospital PCL', sector: 'Healthcare',
    ipoDate: '1997-01-01', ipoPrice: 5,
    currentPrice: 14.20, change: 0.20, changePct: 1.43, volume: 8_500_000, marketCap: 5.5,
    pe: 24.5, de: 0.5, fcf: 0.4, roe: 13.5, dividendYield: 3.8, sectorAvgPE: 30.0, volatility: 0.022,
  },
  {
    ticker: 'THG', name: 'Thonburi Healthcare Group PCL', sector: 'Healthcare',
    ipoDate: '2017-01-01', ipoPrice: 16,
    currentPrice: 22.50, change: -0.25, changePct: -1.10, volume: 5_200_000, marketCap: 9.5,
    pe: 28.5, de: 0.6, fcf: 0.5, roe: 10.5, dividendYield: 2.5, sectorAvgPE: 30.0, volatility: 0.024,
  },
  {
    ticker: 'LPH', name: 'Ladprao General Hospital PCL', sector: 'Healthcare',
    ipoDate: '2006-01-01', ipoPrice: 5,
    currentPrice: 8.60, change: 0.10, changePct: 1.18, volume: 4_800_000, marketCap: 3.8,
    pe: 18.5, de: 0.3, fcf: 0.3, roe: 10.5, dividendYield: 4.5, sectorAvgPE: 30.0, volatility: 0.026,
  },
  {
    ticker: 'KDH', name: 'Kasemrad International Hospital PCL', sector: 'Healthcare',
    ipoDate: '2015-01-01', ipoPrice: 7,
    currentPrice: 11.40, change: 0.10, changePct: 0.88, volume: 6_200_000, marketCap: 6.5,
    pe: 25.5, de: 0.5, fcf: 0.4, roe: 12.5, dividendYield: 3.2, sectorAvgPE: 30.0, volatility: 0.024,
  },

  // ── Technology / IT (7) ──────────────────────────────────────────────────
  {
    ticker: 'INET', name: 'Internet Thailand PCL', sector: 'Technology',
    ipoDate: '2002-01-01', ipoPrice: 5,
    currentPrice: 4.56, change: 0.04, changePct: 0.88, volume: 22_000_000, marketCap: 8.5,
    pe: 18.5, de: 0.3, fcf: 0.6, roe: 12.5, dividendYield: 5.5, sectorAvgPE: 22.0, volatility: 0.022,
  },
  {
    ticker: 'MFEC', name: 'MFEC PCL', sector: 'Technology',
    ipoDate: '2013-11-11', ipoPrice: 10,
    currentPrice: 15.80, change: 0.30, changePct: 1.94, volume: 8_500_000, marketCap: 7.2,
    pe: 22.5, de: 0.2, fcf: 0.5, roe: 18.5, dividendYield: 4.8, sectorAvgPE: 22.0, volatility: 0.026,
  },
  {
    ticker: 'SVI', name: 'SVI PCL', sector: 'Technology',
    ipoDate: '2002-01-01', ipoPrice: 5,
    currentPrice: 6.45, change: -0.05, changePct: -0.77, volume: 28_000_000, marketCap: 9.8,
    pe: 14.5, de: 0.5, fcf: 0.8, roe: 15.5, dividendYield: 5.5, sectorAvgPE: 22.0, volatility: 0.026,
  },
  {
    ticker: 'SVOA', name: 'SVOA PCL', sector: 'Technology',
    ipoDate: '2010-01-01', ipoPrice: 4,
    currentPrice: 5.25, change: 0.05, changePct: 0.96, volume: 12_000_000, marketCap: 4.5,
    pe: 16.5, de: 0.3, fcf: 0.4, roe: 14.5, dividendYield: 5.0, sectorAvgPE: 22.0, volatility: 0.028,
  },
  {
    ticker: 'CS', name: 'CS Loxinfo PCL', sector: 'Technology',
    ipoDate: '2001-01-01', ipoPrice: 5,
    currentPrice: 4.18, change: -0.02, changePct: -0.48, volume: 8_500_000, marketCap: 3.8,
    pe: 12.5, de: 0.4, fcf: 0.4, roe: 10.5, dividendYield: 6.5, sectorAvgPE: 22.0, volatility: 0.024,
  },
  {
    ticker: 'TEAMG', name: 'Team Corporation PCL', sector: 'Technology',
    ipoDate: '2004-01-01', ipoPrice: 5,
    currentPrice: 8.75, change: 0.25, changePct: 2.94, volume: 18_500_000, marketCap: 5.8,
    pe: 20.5, de: 0.6, fcf: 0.5, roe: 16.5, dividendYield: 4.5, sectorAvgPE: 22.0, volatility: 0.030,
  },
  {
    ticker: 'SIS', name: 'SiS Distribution (Thailand) PCL', sector: 'Technology',
    ipoDate: '2005-01-01', ipoPrice: 4,
    currentPrice: 12.80, change: 0.20, changePct: 1.59, volume: 5_200_000, marketCap: 5.5,
    pe: 14.5, de: 0.4, fcf: 0.5, roe: 18.5, dividendYield: 5.8, sectorAvgPE: 22.0, volatility: 0.024,
  },

  // ── Property — small-cap (8) ─────────────────────────────────────────────
  {
    ticker: 'LALIN', name: 'Lalin Property PCL', sector: 'Property',
    ipoDate: '2002-01-01', ipoPrice: 3,
    currentPrice: 5.85, change: 0.05, changePct: 0.86, volume: 8_500_000, marketCap: 6.5,
    pe: 9.5, de: 0.7, fcf: 0.5, roe: 10.5, dividendYield: 7.5, sectorAvgPE: 14.0, volatility: 0.026,
  },
  {
    ticker: 'SENA', name: 'Sena Development PCL', sector: 'Property',
    ipoDate: '2013-01-01', ipoPrice: 3.5,
    currentPrice: 4.62, change: -0.04, changePct: -0.86, volume: 12_000_000, marketCap: 5.8,
    pe: 8.5, de: 1.2, fcf: 0.4, roe: 11.5, dividendYield: 6.8, sectorAvgPE: 14.0, volatility: 0.030,
  },
  {
    ticker: 'NUSA', name: 'Nusasiri PCL', sector: 'Property',
    ipoDate: '2008-01-01', ipoPrice: 3,
    currentPrice: 1.28, change: 0.02, changePct: 1.59, volume: 48_000_000, marketCap: 3.2,
    pe: 10.5, de: 2.5, fcf: 0.2, roe: 7.5, dividendYield: 3.5, sectorAvgPE: 14.0, volatility: 0.040,
  },
  {
    ticker: 'RICHY', name: 'Richy Place 2002 PCL', sector: 'Property',
    ipoDate: '2010-01-01', ipoPrice: 2,
    currentPrice: 1.95, change: 0.01, changePct: 0.52, volume: 22_000_000, marketCap: 2.5,
    pe: 8.5, de: 1.8, fcf: 0.2, roe: 9.5, dividendYield: 5.5, sectorAvgPE: 14.0, volatility: 0.038,
  },
  {
    ticker: 'PRIN', name: 'Prinsiri PCL', sector: 'Property',
    ipoDate: '2009-01-01', ipoPrice: 2.5,
    currentPrice: 1.72, change: -0.02, changePct: -1.15, volume: 28_000_000, marketCap: 3.5,
    pe: 7.5, de: 2.2, fcf: 0.2, roe: 8.5, dividendYield: 4.8, sectorAvgPE: 14.0, volatility: 0.038,
  },
  {
    ticker: 'GRAND', name: 'Grand Asset Hotels and Property PCL', sector: 'Property',
    ipoDate: '2006-01-01', ipoPrice: 5,
    currentPrice: 3.48, change: 0.02, changePct: 0.58, volume: 18_000_000, marketCap: 4.5,
    pe: 14.5, de: 1.5, fcf: 0.3, roe: 7.5, dividendYield: 3.5, sectorAvgPE: 14.0, volatility: 0.032,
  },
  {
    ticker: 'JSP', name: 'J.S.P. Property PCL', sector: 'Property',
    ipoDate: '2015-01-01', ipoPrice: 4,
    currentPrice: 3.82, change: 0.04, changePct: 1.06, volume: 15_000_000, marketCap: 3.8,
    pe: 9.5, de: 1.8, fcf: 0.3, roe: 10.5, dividendYield: 5.5, sectorAvgPE: 14.0, volatility: 0.034,
  },
  {
    ticker: 'PACE', name: 'Pace Development Corporation PCL', sector: 'Property',
    ipoDate: '2012-01-01', ipoPrice: 5,
    currentPrice: 1.18, change: -0.01, changePct: -0.84, volume: 38_000_000, marketCap: 4.2,
    pe: 0.0, de: 4.5, fcf: -0.2, roe: -5.5, dividendYield: 0.0, sectorAvgPE: 14.0, volatility: 0.045,
  },

  // ── Manufacturing / Construction (8) ─────────────────────────────────────
  {
    ticker: 'PYLON', name: 'Pylon PCL', sector: 'Manufacturing',
    ipoDate: '2012-09-12', ipoPrice: 5,
    currentPrice: 8.45, change: 0.15, changePct: 1.81, volume: 8_500_000, marketCap: 5.5,
    pe: 14.5, de: 0.8, fcf: 0.5, roe: 12.5, dividendYield: 5.5, sectorAvgPE: 12.0, volatility: 0.028,
  },
  {
    ticker: 'NWR', name: 'Nawarat Patanakarn PCL', sector: 'Manufacturing',
    ipoDate: '1994-01-01', ipoPrice: 5,
    currentPrice: 4.20, change: 0.05, changePct: 1.20, volume: 12_000_000, marketCap: 4.5,
    pe: 10.5, de: 1.5, fcf: 0.4, roe: 10.5, dividendYield: 4.8, sectorAvgPE: 12.0, volatility: 0.030,
  },
  {
    ticker: 'SEAFCO', name: 'Seafco PCL', sector: 'Manufacturing',
    ipoDate: '2014-05-23', ipoPrice: 6,
    currentPrice: 8.25, change: 0.25, changePct: 3.12, volume: 6_200_000, marketCap: 4.8,
    pe: 12.5, de: 0.5, fcf: 0.4, roe: 14.5, dividendYield: 5.5, sectorAvgPE: 12.0, volatility: 0.028,
  },
  {
    ticker: 'ITD', name: 'Italian-Thai Development PCL', sector: 'Manufacturing',
    ipoDate: '1994-01-01', ipoPrice: 5,
    currentPrice: 1.82, change: 0.02, changePct: 1.11, volume: 62_000_000, marketCap: 8.5,
    pe: 0.0, de: 5.5, fcf: -0.5, roe: -8.5, dividendYield: 0.0, sectorAvgPE: 12.0, volatility: 0.040,
  },
  {
    ticker: 'COTTO', name: 'Cotto PCL', sector: 'Manufacturing',
    ipoDate: '2001-01-01', ipoPrice: 5,
    currentPrice: 5.45, change: -0.05, changePct: -0.91, volume: 8_500_000, marketCap: 5.5,
    pe: 12.5, de: 0.6, fcf: 0.4, roe: 9.5, dividendYield: 4.5, sectorAvgPE: 12.0, volatility: 0.026,
  },
  {
    ticker: 'CHOW', name: 'Chow Steel Industries PCL', sector: 'Manufacturing',
    ipoDate: '2008-01-01', ipoPrice: 4,
    currentPrice: 3.62, change: 0.04, changePct: 1.12, volume: 12_000_000, marketCap: 4.2,
    pe: 8.5, de: 1.2, fcf: 0.3, roe: 10.5, dividendYield: 5.5, sectorAvgPE: 12.0, volatility: 0.030,
  },
  {
    ticker: 'STEC', name: 'Sino-Thai Engineering and Construction PCL', sector: 'Manufacturing',
    ipoDate: '1996-01-01', ipoPrice: 5,
    currentPrice: 18.50, change: 0.50, changePct: 2.78, volume: 8_500_000, marketCap: 18.5,
    pe: 15.5, de: 0.8, fcf: 1.2, roe: 12.5, dividendYield: 4.8, sectorAvgPE: 12.0, volatility: 0.024,
  },
  {
    ticker: 'MASTER', name: 'Master Ad PCL', sector: 'Manufacturing',
    ipoDate: '2002-01-01', ipoPrice: 3,
    currentPrice: 5.85, change: -0.05, changePct: -0.85, volume: 5_200_000, marketCap: 3.8,
    pe: 14.5, de: 0.4, fcf: 0.3, roe: 11.5, dividendYield: 4.5, sectorAvgPE: 12.0, volatility: 0.026,
  },

  // ── Consumer / Retail (5) ────────────────────────────────────────────────
  {
    ticker: 'MBK', name: 'MBK PCL', sector: 'Consumer',
    ipoDate: '1993-01-01', ipoPrice: 10,
    currentPrice: 8.75, change: 0.25, changePct: 2.94, volume: 5_200_000, marketCap: 14.5,
    pe: 14.5, de: 0.7, fcf: 0.8, roe: 8.5, dividendYield: 5.5, sectorAvgPE: 18.0, volatility: 0.022,
  },
  {
    ticker: 'SINGER', name: 'Singer Thailand PCL', sector: 'Consumer',
    ipoDate: '1993-01-01', ipoPrice: 5,
    currentPrice: 4.52, change: -0.04, changePct: -0.88, volume: 12_000_000, marketCap: 4.5,
    pe: 9.5, de: 1.8, fcf: 0.4, roe: 10.5, dividendYield: 6.5, sectorAvgPE: 18.0, volatility: 0.028,
  },
  {
    ticker: 'BEAUTY', name: 'Beauty Community PCL', sector: 'Consumer',
    ipoDate: '2016-01-01', ipoPrice: 7,
    currentPrice: 12.50, change: 0.50, changePct: 4.17, volume: 18_500_000, marketCap: 12.5,
    pe: 22.5, de: 0.2, fcf: 0.5, roe: 18.5, dividendYield: 4.8, sectorAvgPE: 18.0, volatility: 0.030,
  },
  {
    ticker: 'JUBILE', name: 'Jubilee Enterprise PCL', sector: 'Consumer',
    ipoDate: '2006-01-01', ipoPrice: 8,
    currentPrice: 18.80, change: 0.30, changePct: 1.62, volume: 4_200_000, marketCap: 5.5,
    pe: 16.5, de: 0.5, fcf: 0.4, roe: 14.5, dividendYield: 5.5, sectorAvgPE: 18.0, volatility: 0.024,
  },
  {
    ticker: 'TNP', name: 'Tanayong PCL', sector: 'Consumer',
    ipoDate: '1993-01-01', ipoPrice: 5,
    currentPrice: 3.24, change: -0.02, changePct: -0.61, volume: 8_500_000, marketCap: 5.5,
    pe: 12.5, de: 1.5, fcf: 0.3, roe: 7.5, dividendYield: 4.5, sectorAvgPE: 18.0, volatility: 0.028,
  },

  // ── Finance — smaller (5) ────────────────────────────────────────────────
  {
    ticker: 'CHAYO', name: 'Chayo Group PCL', sector: 'Financials',
    ipoDate: '2018-05-31', ipoPrice: 4,
    currentPrice: 8.25, change: 0.25, changePct: 3.13, volume: 12_500_000, marketCap: 5.5,
    pe: 12.5, de: 2.5, fcf: 0.5, roe: 16.5, dividendYield: 3.5, sectorAvgPE: 14.0, volatility: 0.030,
  },
  {
    ticker: 'EASY', name: 'Easy Buy PCL', sector: 'Financials',
    ipoDate: '2015-01-01', ipoPrice: 10,
    currentPrice: 38.50, change: -0.50, changePct: -1.28, volume: 3_200_000, marketCap: 12.5,
    pe: 14.5, de: 3.5, fcf: 1.2, roe: 14.5, dividendYield: 4.5, sectorAvgPE: 14.0, volatility: 0.022,
  },
  {
    ticker: 'AIRA', name: 'AIRA Capital PCL', sector: 'Financials',
    ipoDate: '2005-01-01', ipoPrice: 5,
    currentPrice: 3.42, change: 0.02, changePct: 0.59, volume: 8_500_000, marketCap: 3.5,
    pe: 10.5, de: 0.8, fcf: 0.3, roe: 10.5, dividendYield: 4.5, sectorAvgPE: 14.0, volatility: 0.030,
  },
  {
    ticker: 'CIMBT', name: 'CIMB Thai Bank PCL', sector: 'Financials',
    ipoDate: '2000-01-01', ipoPrice: 5,
    currentPrice: 0.98, change: 0.01, changePct: 1.03, volume: 85_000_000, marketCap: 12.5,
    pe: 12.5, de: 0.0, fcf: 1.5, roe: 7.5, dividendYield: 2.5, sectorAvgPE: 14.0, volatility: 0.026,
  },
  {
    ticker: 'ASP', name: 'Asia Plus Group Holdings PCL', sector: 'Financials',
    ipoDate: '2004-01-01', ipoPrice: 5,
    currentPrice: 4.28, change: 0.04, changePct: 0.94, volume: 12_000_000, marketCap: 4.5,
    pe: 14.5, de: 0.5, fcf: 0.4, roe: 11.5, dividendYield: 5.5, sectorAvgPE: 14.0, volatility: 0.026,
  },

  // ── Logistics / Services (4) ─────────────────────────────────────────────
  {
    ticker: 'LEO', name: 'Leo Global Logistics PCL', sector: 'Logistics',
    ipoDate: '2016-12-22', ipoPrice: 4,
    currentPrice: 6.25, change: 0.05, changePct: 0.81, volume: 8_500_000, marketCap: 4.5,
    pe: 16.5, de: 0.6, fcf: 0.4, roe: 14.5, dividendYield: 4.8, sectorAvgPE: 16.0, volatility: 0.026,
  },
  {
    ticker: 'WICE', name: 'WICE Freight Services PCL', sector: 'Logistics',
    ipoDate: '2014-12-26', ipoPrice: 4,
    currentPrice: 5.85, change: 0.05, changePct: 0.86, volume: 6_200_000, marketCap: 4.2,
    pe: 14.5, de: 0.4, fcf: 0.4, roe: 18.5, dividendYield: 5.2, sectorAvgPE: 16.0, volatility: 0.026,
  },
  {
    ticker: 'JWD', name: 'JWD InfoLogistics PCL', sector: 'Logistics',
    ipoDate: '2015-08-19', ipoPrice: 5,
    currentPrice: 8.75, change: 0.25, changePct: 2.94, volume: 8_500_000, marketCap: 6.5,
    pe: 18.5, de: 1.2, fcf: 0.5, roe: 12.5, dividendYield: 3.5, sectorAvgPE: 16.0, volatility: 0.028,
  },
  {
    ticker: 'NCL', name: 'NCL International Logistics PCL', sector: 'Logistics',
    ipoDate: '2017-06-21', ipoPrice: 3,
    currentPrice: 4.28, change: 0.04, changePct: 0.94, volume: 5_200_000, marketCap: 3.5,
    pe: 15.5, de: 0.8, fcf: 0.3, roe: 14.5, dividendYield: 4.5, sectorAvgPE: 16.0, volatility: 0.028,
  },
]

/** @type {Object.<string, import('./mockStocks.js').Stock>} */
export const STOCKS_MAP = Object.fromEntries(STOCKS.map(s => [s.ticker, s]))

export const SECTORS = [...new Set(STOCKS.map(s => s.sector))]
