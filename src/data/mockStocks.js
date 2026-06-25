/**
 * @typedef {Object} Stock
 * @property {string} ticker
 * @property {string} name
 * @property {string} sector
 * @property {string} ipoDate  - ISO date string YYYY-MM-DD
 * @property {number} ipoPrice - THB
 * @property {number} currentPrice - THB
 * @property {number} change   - absolute THB change today
 * @property {number} changePct - percent change today
 * @property {number} volume   - shares traded today
 * @property {number} marketCap - THB billions
 * @property {number} pe
 * @property {number} de
 * @property {number} fcf      - THB billions
 * @property {number} roe      - percent
 * @property {number} dividendYield - percent
 * @property {number} sectorAvgPE
 * @property {number} volatility - used by price history generator
 */

/** @type {Stock[]} */
export const STOCKS = [
  // ── Energy (15) ─────────────────────────────────────────────────────────────
  {
    ticker: 'PTT', name: 'PTT Public Company Limited', sector: 'Energy',
    ipoDate: '2001-11-06', ipoPrice: 35,
    currentPrice: 34.25, change: -0.50, changePct: -1.44, volume: 28_500_000, marketCap: 1_224.0,
    pe: 12.4, de: 1.2, fcf: 48.5, roe: 9.8, dividendYield: 4.8, sectorAvgPE: 13.5, volatility: 0.022,
  },
  {
    ticker: 'PTTEP', name: 'PTT Exploration and Production PCL', sector: 'Energy',
    ipoDate: '1994-09-01', ipoPrice: 10,
    currentPrice: 148.50, change: 1.50, changePct: 1.02, volume: 8_200_000, marketCap: 572.0,
    pe: 10.8, de: 0.5, fcf: 72.3, roe: 13.2, dividendYield: 5.1, sectorAvgPE: 13.5, volatility: 0.024,
  },
  {
    ticker: 'GULF', name: 'Gulf Energy Development PCL', sector: 'Energy',
    ipoDate: '2017-12-18', ipoPrice: 38,
    currentPrice: 41.75, change: 0.25, changePct: 0.60, volume: 42_000_000, marketCap: 553.0,
    pe: 32.1, de: 2.1, fcf: 8.2, roe: 11.5, dividendYield: 0.8, sectorAvgPE: 13.5, volatility: 0.026,
  },
  {
    ticker: 'GPSC', name: 'Global Power Synergy PCL', sector: 'Energy',
    ipoDate: '2015-05-27', ipoPrice: 45,
    currentPrice: 52.25, change: -0.75, changePct: -1.42, volume: 6_800_000, marketCap: 108.0,
    pe: 19.4, de: 1.8, fcf: 5.1, roe: 7.8, dividendYield: 2.1, sectorAvgPE: 13.5, volatility: 0.021,
  },
  {
    ticker: 'BGRIM', name: 'B.Grimm Power PCL', sector: 'Energy',
    ipoDate: '2017-10-12', ipoPrice: 29,
    currentPrice: 26.50, change: -0.25, changePct: -0.93, volume: 9_100_000, marketCap: 63.0,
    pe: 22.8, de: 2.3, fcf: 2.8, roe: 8.2, dividendYield: 1.5, sectorAvgPE: 13.5, volatility: 0.025,
  },
  {
    ticker: 'BPP', name: 'Banpu Power PCL', sector: 'Energy',
    ipoDate: '2016-10-07', ipoPrice: 12,
    currentPrice: 7.85, change: -0.10, changePct: -1.26, volume: 14_500_000, marketCap: 28.5,
    pe: 15.2, de: 1.6, fcf: 1.8, roe: 6.4, dividendYield: 3.8, sectorAvgPE: 13.5, volatility: 0.028,
  },
  {
    ticker: 'RATCH', name: 'Ratch Group PCL', sector: 'Energy',
    ipoDate: '2000-11-13', ipoPrice: 10,
    currentPrice: 38.75, change: 0.50, changePct: 1.31, volume: 3_200_000, marketCap: 55.2,
    pe: 14.8, de: 0.9, fcf: 4.2, roe: 8.5, dividendYield: 4.2, sectorAvgPE: 13.5, volatility: 0.018,
  },
  {
    ticker: 'EGCO', name: 'Electricity Generating PCL', sector: 'Energy',
    ipoDate: '1995-01-12', ipoPrice: 10,
    currentPrice: 155.00, change: -1.50, changePct: -0.96, volume: 1_800_000, marketCap: 50.8,
    pe: 11.2, de: 0.8, fcf: 5.6, roe: 9.1, dividendYield: 5.5, sectorAvgPE: 13.5, volatility: 0.017,
  },
  {
    ticker: 'IRPC', name: 'IRPC PCL', sector: 'Energy',
    ipoDate: '1994-08-01', ipoPrice: 10,
    currentPrice: 2.46, change: 0.02, changePct: 0.82, volume: 85_000_000, marketCap: 36.5,
    pe: 18.5, de: 0.7, fcf: 1.2, roe: 4.1, dividendYield: 2.8, sectorAvgPE: 13.5, volatility: 0.030,
  },
  {
    ticker: 'TOP', name: 'Thai Oil PCL', sector: 'Energy',
    ipoDate: '2004-10-08', ipoPrice: 35,
    currentPrice: 52.50, change: 0.75, changePct: 1.45, volume: 6_500_000, marketCap: 63.0,
    pe: 9.8, de: 0.6, fcf: 7.8, roe: 8.5, dividendYield: 5.2, sectorAvgPE: 13.5, volatility: 0.022,
  },
  {
    ticker: 'SPRC', name: 'Star Petroleum Refining PCL', sector: 'Energy',
    ipoDate: '2015-07-10', ipoPrice: 10,
    currentPrice: 8.95, change: 0.05, changePct: 0.56, volume: 22_000_000, marketCap: 21.5,
    pe: 7.5, de: 0.3, fcf: 2.8, roe: 9.4, dividendYield: 6.8, sectorAvgPE: 13.5, volatility: 0.026,
  },
  {
    ticker: 'PTTGC', name: 'PTT Global Chemical PCL', sector: 'Energy',
    ipoDate: '2011-10-19', ipoPrice: 48,
    currentPrice: 38.25, change: -0.75, changePct: -1.92, volume: 8_500_000, marketCap: 138.0,
    pe: 11.2, de: 0.8, fcf: 8.5, roe: 7.5, dividendYield: 4.8, sectorAvgPE: 13.5, volatility: 0.022,
  },
  {
    ticker: 'BANPU', name: 'Banpu PCL', sector: 'Energy',
    ipoDate: '1993-01-01', ipoPrice: 10,
    currentPrice: 5.50, change: -0.05, changePct: -0.90, volume: 42_000_000, marketCap: 24.5,
    pe: 6.8, de: 1.5, fcf: 3.2, roe: 8.5, dividendYield: 5.5, sectorAvgPE: 13.5, volatility: 0.030,
  },
  {
    ticker: 'BCP', name: 'Bangchak Corporation PCL', sector: 'Energy',
    ipoDate: '1993-06-01', ipoPrice: 10,
    currentPrice: 31.50, change: 0.25, changePct: 0.80, volume: 8_200_000, marketCap: 44.0,
    pe: 8.5, de: 1.0, fcf: 5.5, roe: 10.5, dividendYield: 5.8, sectorAvgPE: 13.5, volatility: 0.022,
  },
  {
    ticker: 'OR', name: 'PTT Oil and Retail Business PCL', sector: 'Energy',
    ipoDate: '2021-02-11', ipoPrice: 18,
    currentPrice: 15.80, change: -0.10, changePct: -0.63, volume: 42_000_000, marketCap: 237.0,
    pe: 22.5, de: 0.5, fcf: 4.5, roe: 8.5, dividendYield: 2.5, sectorAvgPE: 13.5, volatility: 0.018,
  },

  // ── Banking (8) ──────────────────────────────────────────────────────────────
  {
    ticker: 'KBANK', name: 'Kasikornbank PCL', sector: 'Banking',
    ipoDate: '1976-01-01', ipoPrice: 10,
    currentPrice: 138.00, change: -1.50, changePct: -1.08, volume: 12_000_000, marketCap: 328.5,
    pe: 9.8, de: 0.0, fcf: 52.0, roe: 10.2, dividendYield: 3.6, sectorAvgPE: 9.2, volatility: 0.018,
  },
  {
    ticker: 'SCB', name: 'SCB X PCL', sector: 'Banking',
    ipoDate: '1989-01-01', ipoPrice: 10,
    currentPrice: 92.75, change: 0.75, changePct: 0.81, volume: 15_500_000, marketCap: 250.0,
    pe: 8.5, de: 0.0, fcf: 42.0, roe: 9.5, dividendYield: 5.4, sectorAvgPE: 9.2, volatility: 0.019,
  },
  {
    ticker: 'BBL', name: 'Bangkok Bank PCL', sector: 'Banking',
    ipoDate: '1975-01-01', ipoPrice: 10,
    currentPrice: 148.00, change: 1.00, changePct: 0.68, volume: 8_200_000, marketCap: 210.5,
    pe: 7.8, de: 0.0, fcf: 58.0, roe: 8.8, dividendYield: 4.1, sectorAvgPE: 9.2, volatility: 0.016,
  },
  {
    ticker: 'KTB', name: 'Krungthai Bank PCL', sector: 'Banking',
    ipoDate: '1994-01-01', ipoPrice: 10,
    currentPrice: 22.10, change: -0.20, changePct: -0.90, volume: 48_000_000, marketCap: 283.5,
    pe: 9.2, de: 0.0, fcf: 38.0, roe: 8.1, dividendYield: 4.5, sectorAvgPE: 9.2, volatility: 0.017,
  },
  {
    ticker: 'TTB', name: 'TMBThanachart Bank PCL', sector: 'Banking',
    ipoDate: '2004-01-01', ipoPrice: 2.5,
    currentPrice: 1.68, change: 0.01, changePct: 0.60, volume: 220_000_000, marketCap: 118.0,
    pe: 10.5, de: 0.0, fcf: 12.0, roe: 7.2, dividendYield: 3.0, sectorAvgPE: 9.2, volatility: 0.020,
  },
  {
    ticker: 'TISCO', name: 'TISCO Financial Group PCL', sector: 'Banking',
    ipoDate: '2005-01-01', ipoPrice: 10,
    currentPrice: 89.25, change: 0.25, changePct: 0.28, volume: 2_800_000, marketCap: 52.0,
    pe: 11.2, de: 0.0, fcf: 8.5, roe: 14.5, dividendYield: 6.7, sectorAvgPE: 9.2, volatility: 0.016,
  },
  {
    ticker: 'KKP', name: 'Kiatnakin Phatra Bank PCL', sector: 'Banking',
    ipoDate: '2011-01-01', ipoPrice: 30,
    currentPrice: 52.75, change: -0.25, changePct: -0.47, volume: 3_500_000, marketCap: 36.5,
    pe: 8.8, de: 0.0, fcf: 6.2, roe: 12.8, dividendYield: 7.2, sectorAvgPE: 9.2, volatility: 0.018,
  },
  {
    ticker: 'TCAP', name: 'Thanachart Capital PCL', sector: 'Banking',
    ipoDate: '2004-01-01', ipoPrice: 10,
    currentPrice: 38.50, change: 0.50, changePct: 1.32, volume: 4_200_000, marketCap: 32.0,
    pe: 7.2, de: 0.0, fcf: 5.8, roe: 9.5, dividendYield: 5.2, sectorAvgPE: 9.2, volatility: 0.017,
  },

  // ── Property (15) ────────────────────────────────────────────────────────────
  {
    ticker: 'CPN', name: 'Central Pattana PCL', sector: 'Property',
    ipoDate: '1995-09-01', ipoPrice: 5,
    currentPrice: 58.25, change: 0.75, changePct: 1.30, volume: 12_500_000, marketCap: 258.0,
    pe: 28.5, de: 0.9, fcf: 9.2, roe: 11.5, dividendYield: 2.8, sectorAvgPE: 20.5, volatility: 0.020,
  },
  {
    ticker: 'AWC', name: 'Asset World Corp PCL', sector: 'Property',
    ipoDate: '2019-10-10', ipoPrice: 6.50,
    currentPrice: 4.62, change: -0.04, changePct: -0.86, volume: 38_000_000, marketCap: 178.0,
    pe: 28.5, de: 1.2, fcf: 3.5, roe: 5.5, dividendYield: 1.2, sectorAvgPE: 20.5, volatility: 0.020,
  },
  {
    ticker: 'LH', name: 'Land and Houses PCL', sector: 'Property',
    ipoDate: '1991-01-01', ipoPrice: 4,
    currentPrice: 8.10, change: -0.05, changePct: -0.61, volume: 52_000_000, marketCap: 98.5,
    pe: 14.8, de: 0.8, fcf: 5.2, roe: 10.8, dividendYield: 6.2, sectorAvgPE: 20.5, volatility: 0.022,
  },
  {
    ticker: 'SPALI', name: 'Supalai PCL', sector: 'Property',
    ipoDate: '2003-01-01', ipoPrice: 8,
    currentPrice: 18.40, change: 0.10, changePct: 0.55, volume: 18_000_000, marketCap: 37.0,
    pe: 7.2, de: 0.6, fcf: 3.5, roe: 14.2, dividendYield: 7.8, sectorAvgPE: 20.5, volatility: 0.024,
  },
  {
    ticker: 'AP', name: 'AP (Thailand) PCL', sector: 'Property',
    ipoDate: '2007-01-01', ipoPrice: 4,
    currentPrice: 9.75, change: 0.05, changePct: 0.52, volume: 24_000_000, marketCap: 30.5,
    pe: 8.5, de: 1.1, fcf: 2.8, roe: 13.5, dividendYield: 5.2, sectorAvgPE: 20.5, volatility: 0.025,
  },
  {
    ticker: 'QH', name: 'Quality Houses PCL', sector: 'Property',
    ipoDate: '1993-01-01', ipoPrice: 3,
    currentPrice: 3.02, change: -0.02, changePct: -0.66, volume: 62_000_000, marketCap: 28.5,
    pe: 9.8, de: 0.9, fcf: 2.1, roe: 8.5, dividendYield: 6.6, sectorAvgPE: 20.5, volatility: 0.028,
  },
  {
    ticker: 'SC', name: 'SC Asset Corporation PCL', sector: 'Property',
    ipoDate: '2003-01-01', ipoPrice: 3.5,
    currentPrice: 4.14, change: 0.04, changePct: 0.98, volume: 35_000_000, marketCap: 12.5,
    pe: 6.8, de: 1.4, fcf: 1.1, roe: 11.2, dividendYield: 8.2, sectorAvgPE: 20.5, volatility: 0.030,
  },
  {
    ticker: 'ORI', name: 'Origin Property PCL', sector: 'Property',
    ipoDate: '2015-01-01', ipoPrice: 4.5,
    currentPrice: 7.85, change: -0.05, changePct: -0.63, volume: 28_000_000, marketCap: 18.5,
    pe: 7.5, de: 2.1, fcf: 1.2, roe: 15.8, dividendYield: 4.8, sectorAvgPE: 20.5, volatility: 0.032,
  },
  {
    ticker: 'NOBLE', name: 'Noble Development PCL', sector: 'Property',
    ipoDate: '1998-01-01', ipoPrice: 10,
    currentPrice: 11.30, change: 0.30, changePct: 2.73, volume: 18_500_000, marketCap: 8.5,
    pe: 12.5, de: 1.6, fcf: 0.8, roe: 10.5, dividendYield: 3.5, sectorAvgPE: 20.5, volatility: 0.035,
  },
  {
    ticker: 'ANAN', name: 'Ananda Development PCL', sector: 'Property',
    ipoDate: '2012-01-01', ipoPrice: 3,
    currentPrice: 1.55, change: -0.01, changePct: -0.64, volume: 48_000_000, marketCap: 5.8,
    pe: 11.2, de: 2.5, fcf: 0.5, roe: 8.2, dividendYield: 3.2, sectorAvgPE: 20.5, volatility: 0.038,
  },
  {
    ticker: 'SIRI', name: 'Sansiri PCL', sector: 'Property',
    ipoDate: '2002-01-01', ipoPrice: 3,
    currentPrice: 1.28, change: 0.01, changePct: 0.79, volume: 58_000_000, marketCap: 8.5,
    pe: 10.8, de: 2.2, fcf: 0.6, roe: 9.5, dividendYield: 5.5, sectorAvgPE: 20.5, volatility: 0.035,
  },
  {
    ticker: 'LPN', name: 'L.P.N. Development PCL', sector: 'Property',
    ipoDate: '1994-01-01', ipoPrice: 5,
    currentPrice: 6.45, change: 0.05, changePct: 0.78, volume: 22_000_000, marketCap: 8.5,
    pe: 9.5, de: 0.6, fcf: 0.8, roe: 9.8, dividendYield: 7.5, sectorAvgPE: 20.5, volatility: 0.028,
  },
  {
    ticker: 'PRUK', name: 'Pruksa Real Estate PCL', sector: 'Property',
    ipoDate: '2013-01-01', ipoPrice: 22,
    currentPrice: 19.80, change: -0.20, changePct: -1.00, volume: 12_000_000, marketCap: 26.5,
    pe: 10.5, de: 1.2, fcf: 1.8, roe: 12.5, dividendYield: 5.8, sectorAvgPE: 20.5, volatility: 0.026,
  },
  {
    ticker: 'AMATA', name: 'Amata Corporation PCL', sector: 'Property',
    ipoDate: '1996-01-01', ipoPrice: 10,
    currentPrice: 22.50, change: 0.25, changePct: 1.12, volume: 8_500_000, marketCap: 22.5,
    pe: 14.5, de: 0.8, fcf: 1.5, roe: 10.5, dividendYield: 4.2, sectorAvgPE: 20.5, volatility: 0.024,
  },
  {
    ticker: 'WHA', name: 'WHA Corporation PCL', sector: 'Property',
    ipoDate: '2012-01-01', ipoPrice: 2,
    currentPrice: 3.42, change: 0.02, changePct: 0.59, volume: 48_000_000, marketCap: 18.5,
    pe: 18.5, de: 1.5, fcf: 0.8, roe: 8.5, dividendYield: 3.5, sectorAvgPE: 20.5, volatility: 0.028,
  },

  // ── Telecom (3) ──────────────────────────────────────────────────────────────
  {
    ticker: 'ADVANC', name: 'Advanced Info Service PCL', sector: 'Telecom',
    ipoDate: '1991-11-05', ipoPrice: 10,
    currentPrice: 195.00, change: -2.00, changePct: -1.02, volume: 8_500_000, marketCap: 570.0,
    pe: 24.5, de: 2.5, fcf: 28.5, roe: 38.5, dividendYield: 4.2, sectorAvgPE: 22.0, volatility: 0.015,
  },
  {
    ticker: 'TRUE', name: 'True Corporation PCL', sector: 'Telecom',
    ipoDate: '1993-01-01', ipoPrice: 5,
    currentPrice: 8.25, change: -0.05, changePct: -0.60, volume: 125_000_000, marketCap: 168.0,
    pe: 38.5, de: 4.5, fcf: -2.5, roe: 5.8, dividendYield: 0.5, sectorAvgPE: 22.0, volatility: 0.022,
  },
  {
    ticker: 'INTUCH', name: 'Intouch Holdings PCL', sector: 'Telecom',
    ipoDate: '1991-01-01', ipoPrice: 5,
    currentPrice: 62.50, change: 0.50, changePct: 0.81, volume: 5_800_000, marketCap: 178.0,
    pe: 20.2, de: 0.5, fcf: 12.5, roe: 18.5, dividendYield: 5.6, sectorAvgPE: 22.0, volatility: 0.015,
  },

  // ── Consumer (10) ────────────────────────────────────────────────────────────
  {
    ticker: 'CPALL', name: 'CP All PCL', sector: 'Consumer',
    ipoDate: '2003-12-16', ipoPrice: 5,
    currentPrice: 56.75, change: 0.25, changePct: 0.44, volume: 22_000_000, marketCap: 505.0,
    pe: 31.5, de: 2.8, fcf: 15.8, roe: 18.5, dividendYield: 1.8, sectorAvgPE: 26.5, volatility: 0.016,
  },
  {
    ticker: 'HMPRO', name: 'Home Product Center PCL', sector: 'Consumer',
    ipoDate: '2001-01-01', ipoPrice: 2,
    currentPrice: 14.10, change: -0.10, changePct: -0.70, volume: 32_000_000, marketCap: 197.0,
    pe: 29.2, de: 0.8, fcf: 7.2, roe: 22.8, dividendYield: 3.2, sectorAvgPE: 26.5, volatility: 0.017,
  },
  {
    ticker: 'CRC', name: 'Central Retail Corporation PCL', sector: 'Consumer',
    ipoDate: '2019-12-20', ipoPrice: 42,
    currentPrice: 32.25, change: -0.25, changePct: -0.77, volume: 8_500_000, marketCap: 161.0,
    pe: 38.5, de: 1.2, fcf: 4.8, roe: 7.8, dividendYield: 1.5, sectorAvgPE: 26.5, volatility: 0.020,
  },
  {
    ticker: 'BJC', name: 'Berli Jucker PCL', sector: 'Consumer',
    ipoDate: '1993-01-01', ipoPrice: 5,
    currentPrice: 28.75, change: 0.25, changePct: 0.88, volume: 6_200_000, marketCap: 112.0,
    pe: 22.5, de: 1.5, fcf: 5.2, roe: 8.5, dividendYield: 2.5, sectorAvgPE: 26.5, volatility: 0.018,
  },
  {
    ticker: 'COM7', name: 'COM7 PCL', sector: 'Consumer',
    ipoDate: '2015-12-11', ipoPrice: 5,
    currentPrice: 23.80, change: 0.30, changePct: 1.28, volume: 12_500_000, marketCap: 53.5,
    pe: 18.5, de: 0.5, fcf: 3.2, roe: 28.5, dividendYield: 4.2, sectorAvgPE: 26.5, volatility: 0.022,
  },
  {
    ticker: 'DOHOME', name: 'Dohome PCL', sector: 'Consumer',
    ipoDate: '2020-12-25', ipoPrice: 8,
    currentPrice: 7.25, change: -0.05, changePct: -0.68, volume: 18_000_000, marketCap: 24.5,
    pe: 15.8, de: 0.8, fcf: 1.2, roe: 12.5, dividendYield: 2.8, sectorAvgPE: 26.5, volatility: 0.025,
  },
  {
    ticker: 'CPAXT', name: 'CP Axtra PCL (formerly Makro)', sector: 'Consumer',
    ipoDate: '1994-01-01', ipoPrice: 10,
    currentPrice: 38.50, change: 0.50, changePct: 1.32, volume: 4_800_000, marketCap: 207.0,
    pe: 35.5, de: 1.1, fcf: 5.8, roe: 15.5, dividendYield: 1.8, sectorAvgPE: 26.5, volatility: 0.016,
  },
  {
    ticker: 'GLOBAL', name: 'Siam Global House PCL', sector: 'Consumer',
    ipoDate: '2010-01-01', ipoPrice: 5,
    currentPrice: 16.20, change: -0.20, changePct: -1.22, volume: 18_000_000, marketCap: 48.5,
    pe: 18.5, de: 0.6, fcf: 2.8, roe: 16.5, dividendYield: 3.8, sectorAvgPE: 26.5, volatility: 0.022,
  },
  {
    ticker: 'CBG', name: 'Carabao Group PCL', sector: 'Consumer',
    ipoDate: '2014-05-21', ipoPrice: 20,
    currentPrice: 68.50, change: 0.50, changePct: 0.74, volume: 5_200_000, marketCap: 55.5,
    pe: 22.5, de: 0.5, fcf: 2.8, roe: 28.5, dividendYield: 3.5, sectorAvgPE: 26.5, volatility: 0.022,
  },
  {
    ticker: 'OSP', name: 'Osotspa PCL', sector: 'Consumer',
    ipoDate: '2019-06-21', ipoPrice: 35,
    currentPrice: 37.25, change: 0.25, changePct: 0.67, volume: 6_800_000, marketCap: 58.0,
    pe: 28.5, de: 0.8, fcf: 1.5, roe: 18.5, dividendYield: 2.8, sectorAvgPE: 26.5, volatility: 0.020,
  },

  // ── Healthcare (8) ───────────────────────────────────────────────────────────
  {
    ticker: 'BDMS', name: 'Bangkok Dusit Medical Services PCL', sector: 'Healthcare',
    ipoDate: '1990-01-01', ipoPrice: 3,
    currentPrice: 22.50, change: 0.10, changePct: 0.45, volume: 28_000_000, marketCap: 450.0,
    pe: 42.5, de: 0.8, fcf: 10.5, roe: 12.5, dividendYield: 1.2, sectorAvgPE: 38.0, volatility: 0.014,
  },
  {
    ticker: 'BH', name: 'Bumrungrad Hospital PCL', sector: 'Healthcare',
    ipoDate: '1989-01-01', ipoPrice: 10,
    currentPrice: 202.00, change: -1.00, changePct: -0.49, volume: 3_200_000, marketCap: 108.5,
    pe: 38.5, de: 0.4, fcf: 4.8, roe: 18.5, dividendYield: 1.5, sectorAvgPE: 38.0, volatility: 0.015,
  },
  {
    ticker: 'BCH', name: 'Bangkok Chain Hospital PCL', sector: 'Healthcare',
    ipoDate: '2010-01-01', ipoPrice: 5,
    currentPrice: 13.50, change: 0.20, changePct: 1.50, volume: 22_000_000, marketCap: 62.5,
    pe: 32.5, de: 0.3, fcf: 2.2, roe: 14.8, dividendYield: 2.8, sectorAvgPE: 38.0, volatility: 0.018,
  },
  {
    ticker: 'CHG', name: 'Chularat Hospital PCL', sector: 'Healthcare',
    ipoDate: '2013-01-01', ipoPrice: 2.5,
    currentPrice: 3.82, change: -0.02, changePct: -0.52, volume: 68_000_000, marketCap: 41.5,
    pe: 28.5, de: 0.5, fcf: 1.5, roe: 16.5, dividendYield: 2.1, sectorAvgPE: 38.0, volatility: 0.020,
  },
  {
    ticker: 'MEGA', name: 'Mega Lifesciences PCL', sector: 'Healthcare',
    ipoDate: '2009-01-01', ipoPrice: 8,
    currentPrice: 40.25, change: 0.25, changePct: 0.63, volume: 5_200_000, marketCap: 42.5,
    pe: 22.5, de: 0.2, fcf: 2.5, roe: 22.5, dividendYield: 3.8, sectorAvgPE: 38.0, volatility: 0.018,
  },
  {
    ticker: 'VGI', name: 'VGI PCL', sector: 'Healthcare',
    ipoDate: '2012-10-04', ipoPrice: 6,
    currentPrice: 4.36, change: -0.04, changePct: -0.91, volume: 42_000_000, marketCap: 38.5,
    pe: 45.5, de: 0.6, fcf: 0.8, roe: 8.2, dividendYield: 1.5, sectorAvgPE: 38.0, volatility: 0.025,
  },
  {
    ticker: 'DMK', name: 'Dusit Medical Services PCL', sector: 'Healthcare',
    ipoDate: '2010-01-01', ipoPrice: 6,
    currentPrice: 20.50, change: 0.25, changePct: 1.23, volume: 8_500_000, marketCap: 18.5,
    pe: 32.5, de: 0.6, fcf: 0.8, roe: 10.5, dividendYield: 2.5, sectorAvgPE: 38.0, volatility: 0.020,
  },
  {
    ticker: 'RJH', name: 'Rajavithi Hospital PCL', sector: 'Healthcare',
    ipoDate: '2018-01-01', ipoPrice: 12,
    currentPrice: 18.40, change: -0.10, changePct: -0.54, volume: 5_800_000, marketCap: 8.5,
    pe: 28.5, de: 0.3, fcf: 0.5, roe: 12.5, dividendYield: 2.2, sectorAvgPE: 38.0, volatility: 0.022,
  },

  // ── Industry / Materials (10) ─────────────────────────────────────────────────
  {
    ticker: 'SCC', name: 'Siam Cement Group PCL', sector: 'Industry',
    ipoDate: '1992-01-01', ipoPrice: 100,
    currentPrice: 302.00, change: -3.00, changePct: -0.98, volume: 3_500_000, marketCap: 362.0,
    pe: 14.5, de: 1.2, fcf: 22.5, roe: 10.5, dividendYield: 4.0, sectorAvgPE: 15.5, volatility: 0.018,
  },
  {
    ticker: 'IVL', name: 'Indorama Ventures PCL', sector: 'Industry',
    ipoDate: '2010-02-05', ipoPrice: 28,
    currentPrice: 30.75, change: -0.25, changePct: -0.81, volume: 12_000_000, marketCap: 110.0,
    pe: 12.5, de: 1.8, fcf: 8.5, roe: 8.5, dividendYield: 4.2, sectorAvgPE: 15.5, volatility: 0.022,
  },
  {
    ticker: 'SCGP', name: 'SCG Packaging PCL', sector: 'Industry',
    ipoDate: '2020-10-09', ipoPrice: 35,
    currentPrice: 44.25, change: 0.25, changePct: 0.57, volume: 8_500_000, marketCap: 175.0,
    pe: 22.5, de: 1.2, fcf: 5.5, roe: 9.5, dividendYield: 2.8, sectorAvgPE: 15.5, volatility: 0.018,
  },
  {
    ticker: 'TPIPL', name: 'TPI Polene PCL', sector: 'Industry',
    ipoDate: '1993-01-01', ipoPrice: 10,
    currentPrice: 2.16, change: 0.02, changePct: 0.93, volume: 85_000_000, marketCap: 28.5,
    pe: 11.5, de: 1.8, fcf: 1.2, roe: 6.5, dividendYield: 4.6, sectorAvgPE: 15.5, volatility: 0.028,
  },
  {
    ticker: 'TASCO', name: 'Tipco Asphalt PCL', sector: 'Industry',
    ipoDate: '1998-01-01', ipoPrice: 10,
    currentPrice: 24.50, change: -0.25, changePct: -1.01, volume: 8_500_000, marketCap: 12.5,
    pe: 8.5, de: 0.5, fcf: 1.5, roe: 11.5, dividendYield: 6.5, sectorAvgPE: 15.5, volatility: 0.022,
  },
  {
    ticker: 'HANA', name: 'Hana Microelectronics PCL', sector: 'Industry',
    ipoDate: '1995-01-01', ipoPrice: 10,
    currentPrice: 42.50, change: 0.50, changePct: 1.19, volume: 5_200_000, marketCap: 18.5,
    pe: 12.5, de: 0.2, fcf: 2.5, roe: 18.5, dividendYield: 7.5, sectorAvgPE: 15.5, volatility: 0.022,
  },
  {
    ticker: 'DELTA', name: 'Delta Electronics (Thailand) PCL', sector: 'Industry',
    ipoDate: '1988-01-01', ipoPrice: 10,
    currentPrice: 68.50, change: 1.00, changePct: 1.48, volume: 8_500_000, marketCap: 128.5,
    pe: 28.5, de: 0.3, fcf: 4.5, roe: 22.5, dividendYield: 2.8, sectorAvgPE: 15.5, volatility: 0.020,
  },
  {
    ticker: 'KCE', name: 'KCE Electronics PCL', sector: 'Industry',
    ipoDate: '2001-01-01', ipoPrice: 5,
    currentPrice: 42.75, change: -0.75, changePct: -1.72, volume: 4_800_000, marketCap: 28.5,
    pe: 18.5, de: 0.5, fcf: 2.2, roe: 15.5, dividendYield: 4.5, sectorAvgPE: 15.5, volatility: 0.022,
  },
  {
    ticker: 'CCET', name: 'Cal-Comp Electronics (Thailand) PCL', sector: 'Industry',
    ipoDate: '2005-01-01', ipoPrice: 5,
    currentPrice: 3.82, change: 0.04, changePct: 1.06, volume: 22_000_000, marketCap: 14.0,
    pe: 12.5, de: 0.6, fcf: 1.2, roe: 8.5, dividendYield: 4.5, sectorAvgPE: 15.5, volatility: 0.025,
  },
  {
    ticker: 'EASTW', name: 'Eastern Water Resources PCL', sector: 'Industry',
    ipoDate: '1997-01-01', ipoPrice: 5,
    currentPrice: 8.25, change: 0.05, changePct: 0.61, volume: 12_000_000, marketCap: 12.5,
    pe: 14.5, de: 0.9, fcf: 0.8, roe: 10.5, dividendYield: 5.5, sectorAvgPE: 15.5, volatility: 0.018,
  },

  // ── Food & Agri (7) ──────────────────────────────────────────────────────────
  {
    ticker: 'CPF', name: 'Charoen Pokphand Foods PCL', sector: 'Food & Agri',
    ipoDate: '1989-01-01', ipoPrice: 5,
    currentPrice: 22.80, change: 0.30, changePct: 1.33, volume: 18_500_000, marketCap: 183.0,
    pe: 18.5, de: 2.2, fcf: 8.5, roe: 12.5, dividendYield: 2.2, sectorAvgPE: 22.0, volatility: 0.018,
  },
  {
    ticker: 'TU', name: 'Thai Union Group PCL', sector: 'Food & Agri',
    ipoDate: '1994-01-01', ipoPrice: 10,
    currentPrice: 14.80, change: -0.20, changePct: -1.34, volume: 22_000_000, marketCap: 74.0,
    pe: 14.5, de: 1.5, fcf: 4.8, roe: 14.5, dividendYield: 4.8, sectorAvgPE: 22.0, volatility: 0.020,
  },
  {
    ticker: 'GFPT', name: 'GFPT PCL', sector: 'Food & Agri',
    ipoDate: '2011-01-01', ipoPrice: 12,
    currentPrice: 12.20, change: 0.20, changePct: 1.67, volume: 8_500_000, marketCap: 18.5,
    pe: 11.5, de: 0.8, fcf: 1.5, roe: 11.5, dividendYield: 4.9, sectorAvgPE: 22.0, volatility: 0.022,
  },
  {
    ticker: 'BTG', name: 'Better World Green PCL', sector: 'Food & Agri',
    ipoDate: '2017-01-01', ipoPrice: 4,
    currentPrice: 6.05, change: -0.05, changePct: -0.82, volume: 28_000_000, marketCap: 10.5,
    pe: 16.5, de: 0.6, fcf: 0.8, roe: 9.5, dividendYield: 3.5, sectorAvgPE: 22.0, volatility: 0.025,
  },
  {
    ticker: 'MINT', name: 'Minor International PCL', sector: 'Food & Agri',
    ipoDate: '1997-01-01', ipoPrice: 3,
    currentPrice: 28.75, change: 0.25, changePct: 0.88, volume: 22_000_000, marketCap: 178.0,
    pe: 32.5, de: 2.8, fcf: 5.8, roe: 10.5, dividendYield: 1.2, sectorAvgPE: 22.0, volatility: 0.022,
  },
  {
    ticker: 'ERW', name: 'The Erawan Group PCL', sector: 'Food & Agri',
    ipoDate: '1994-01-01', ipoPrice: 5,
    currentPrice: 5.45, change: 0.05, changePct: 0.93, volume: 32_000_000, marketCap: 18.5,
    pe: 28.5, de: 1.8, fcf: 0.8, roe: 7.5, dividendYield: 1.0, sectorAvgPE: 22.0, volatility: 0.026,
  },
  {
    ticker: 'CENTEL', name: 'Central Plaza Hotel PCL', sector: 'Food & Agri',
    ipoDate: '1991-01-01', ipoPrice: 5,
    currentPrice: 36.50, change: -0.50, changePct: -1.35, volume: 8_500_000, marketCap: 48.5,
    pe: 35.5, de: 1.5, fcf: 1.5, roe: 9.5, dividendYield: 1.5, sectorAvgPE: 22.0, volatility: 0.022,
  },

  // ── Transport (8) ────────────────────────────────────────────────────────────
  {
    ticker: 'AOT', name: 'Airports of Thailand PCL', sector: 'Transport',
    ipoDate: '2004-06-30', ipoPrice: 10,
    currentPrice: 58.75, change: -0.25, changePct: -0.42, volume: 28_000_000, marketCap: 888.0,
    pe: 42.5, de: 0.8, fcf: 15.5, roe: 12.5, dividendYield: 0.8, sectorAvgPE: 30.0, volatility: 0.016,
  },
  {
    ticker: 'BEM', name: 'Bangkok Expressway and Metro PCL', sector: 'Transport',
    ipoDate: '2012-01-01', ipoPrice: 6,
    currentPrice: 8.75, change: 0.05, changePct: 0.57, volume: 28_000_000, marketCap: 88.0,
    pe: 35.5, de: 2.2, fcf: 2.5, roe: 7.5, dividendYield: 2.5, sectorAvgPE: 30.0, volatility: 0.018,
  },
  {
    ticker: 'BTS', name: 'BTS Group Holdings PCL', sector: 'Transport',
    ipoDate: '2009-04-21', ipoPrice: 0.97,
    currentPrice: 5.25, change: -0.05, changePct: -0.94, volume: 52_000_000, marketCap: 75.0,
    pe: 28.5, de: 3.5, fcf: 3.5, roe: 8.5, dividendYield: 5.8, sectorAvgPE: 30.0, volatility: 0.020,
  },
  {
    ticker: 'AAV', name: 'Asia Aviation PCL', sector: 'Transport',
    ipoDate: '2012-05-23', ipoPrice: 3.5,
    currentPrice: 2.68, change: 0.02, changePct: 0.75, volume: 42_000_000, marketCap: 21.5,
    pe: 15.5, de: 4.8, fcf: 0.8, roe: 12.5, dividendYield: 0.0, sectorAvgPE: 30.0, volatility: 0.030,
  },
  {
    ticker: 'BA', name: 'Bangkok Airways PCL', sector: 'Transport',
    ipoDate: '2014-07-25', ipoPrice: 28,
    currentPrice: 12.50, change: -0.10, changePct: -0.79, volume: 8_500_000, marketCap: 18.5,
    pe: 22.5, de: 2.8, fcf: 0.5, roe: 5.5, dividendYield: 0.0, sectorAvgPE: 30.0, volatility: 0.028,
  },
  {
    ticker: 'NOK', name: 'Nok Airlines PCL', sector: 'Transport',
    ipoDate: '2013-07-16', ipoPrice: 27,
    currentPrice: 2.82, change: 0.04, changePct: 1.44, volume: 32_000_000, marketCap: 4.5,
    pe: 0.0, de: 8.5, fcf: -0.5, roe: -15.5, dividendYield: 0.0, sectorAvgPE: 30.0, volatility: 0.045,
  },
  {
    ticker: 'THAI', name: 'Thai Airways International PCL', sector: 'Transport',
    ipoDate: '1991-01-01', ipoPrice: 10,
    currentPrice: 5.35, change: 0.05, changePct: 0.94, volume: 62_000_000, marketCap: 22.5,
    pe: 0.0, de: 12.5, fcf: -2.5, roe: -8.5, dividendYield: 0.0, sectorAvgPE: 30.0, volatility: 0.040,
  },
  {
    ticker: 'TTA', name: 'Thoresen Thai Agencies PCL', sector: 'Transport',
    ipoDate: '1994-01-01', ipoPrice: 10,
    currentPrice: 16.80, change: 0.30, changePct: 1.82, volume: 8_500_000, marketCap: 14.5,
    pe: 8.5, de: 1.2, fcf: 1.5, roe: 8.5, dividendYield: 3.5, sectorAvgPE: 30.0, volatility: 0.028,
  },

  // ── Tech / Media (4) ─────────────────────────────────────────────────────────
  {
    ticker: 'MAJOR', name: 'Major Cineplex Group PCL', sector: 'Tech / Media',
    ipoDate: '2002-01-01', ipoPrice: 5,
    currentPrice: 22.50, change: 0.50, changePct: 2.27, volume: 12_500_000, marketCap: 28.5,
    pe: 28.5, de: 0.9, fcf: 1.5, roe: 12.5, dividendYield: 3.5, sectorAvgPE: 25.0, volatility: 0.022,
  },
  {
    ticker: 'RS', name: 'RS PCL', sector: 'Tech / Media',
    ipoDate: '2003-01-01', ipoPrice: 5,
    currentPrice: 12.40, change: -0.10, changePct: -0.80, volume: 18_500_000, marketCap: 12.5,
    pe: 18.5, de: 0.4, fcf: 0.8, roe: 18.5, dividendYield: 5.5, sectorAvgPE: 25.0, volatility: 0.026,
  },
  {
    ticker: 'WORK', name: 'WorkPoint Entertainment PCL', sector: 'Tech / Media',
    ipoDate: '2012-01-01', ipoPrice: 25,
    currentPrice: 9.85, change: 0.15, changePct: 1.55, volume: 8_200_000, marketCap: 4.5,
    pe: 12.5, de: 0.2, fcf: 0.5, roe: 12.5, dividendYield: 6.5, sectorAvgPE: 25.0, volatility: 0.030,
  },
  {
    ticker: 'JMART', name: 'JMT Group PCL', sector: 'Tech / Media',
    ipoDate: '2011-01-01', ipoPrice: 10,
    currentPrice: 22.25, change: -0.25, changePct: -1.11, volume: 18_500_000, marketCap: 38.5,
    pe: 22.5, de: 1.2, fcf: 1.5, roe: 18.5, dividendYield: 3.5, sectorAvgPE: 25.0, volatility: 0.028,
  },

  // ── Financials non-bank (12) ──────────────────────────────────────────────────
  {
    ticker: 'MTC', name: 'Muangthai Capital PCL', sector: 'Financials',
    ipoDate: '2015-07-21', ipoPrice: 20,
    currentPrice: 48.75, change: 0.25, changePct: 0.52, volume: 8_500_000, marketCap: 65.5,
    pe: 18.5, de: 3.2, fcf: 4.5, roe: 22.5, dividendYield: 3.8, sectorAvgPE: 18.0, volatility: 0.020,
  },
  {
    ticker: 'SAWAD', name: 'Srisawad Corporation PCL', sector: 'Financials',
    ipoDate: '2014-06-12', ipoPrice: 24,
    currentPrice: 35.50, change: -0.50, changePct: -1.39, volume: 12_500_000, marketCap: 38.5,
    pe: 14.5, de: 4.5, fcf: 2.8, roe: 18.5, dividendYield: 4.5, sectorAvgPE: 18.0, volatility: 0.022,
  },
  {
    ticker: 'AEONTS', name: 'AEON Thana Sinsap (Thailand) PCL', sector: 'Financials',
    ipoDate: '2005-01-01', ipoPrice: 10,
    currentPrice: 205.00, change: -3.00, changePct: -1.44, volume: 1_200_000, marketCap: 30.5,
    pe: 15.8, de: 5.2, fcf: 2.5, roe: 16.5, dividendYield: 3.5, sectorAvgPE: 18.0, volatility: 0.019,
  },
  {
    ticker: 'ASK', name: 'Asia Sermkij Leasing PCL', sector: 'Financials',
    ipoDate: '2012-01-01', ipoPrice: 8,
    currentPrice: 28.25, change: 0.25, changePct: 0.89, volume: 3_500_000, marketCap: 14.5,
    pe: 12.5, de: 3.8, fcf: 1.5, roe: 14.5, dividendYield: 5.5, sectorAvgPE: 18.0, volatility: 0.022,
  },
  {
    ticker: 'GL', name: 'Group Lease PCL', sector: 'Financials',
    ipoDate: '2006-01-01', ipoPrice: 5,
    currentPrice: 2.86, change: 0.04, changePct: 1.42, volume: 48_000_000, marketCap: 8.5,
    pe: 8.5, de: 6.5, fcf: 0.8, roe: 8.5, dividendYield: 2.5, sectorAvgPE: 18.0, volatility: 0.032,
  },
  {
    ticker: 'TIDLOR', name: 'Ngern Tid Lor PCL', sector: 'Financials',
    ipoDate: '2021-05-28', ipoPrice: 36.5,
    currentPrice: 24.50, change: -0.50, changePct: -2.00, volume: 12_500_000, marketCap: 32.5,
    pe: 16.5, de: 4.2, fcf: 2.5, roe: 16.5, dividendYield: 3.2, sectorAvgPE: 18.0, volatility: 0.022,
  },
  {
    ticker: 'THANI', name: 'Ratchthani Leasing PCL', sector: 'Financials',
    ipoDate: '2010-01-01', ipoPrice: 5,
    currentPrice: 4.82, change: 0.02, changePct: 0.42, volume: 28_000_000, marketCap: 8.5,
    pe: 9.5, de: 5.2, fcf: 0.8, roe: 12.5, dividendYield: 6.5, sectorAvgPE: 18.0, volatility: 0.024,
  },
  {
    ticker: 'TMT', name: 'Thai Metal Trade PCL', sector: 'Financials',
    ipoDate: '2008-01-01', ipoPrice: 4,
    currentPrice: 3.68, change: -0.02, changePct: -0.54, volume: 18_000_000, marketCap: 4.5,
    pe: 10.5, de: 1.8, fcf: 0.4, roe: 9.5, dividendYield: 5.5, sectorAvgPE: 18.0, volatility: 0.030,
  },
  {
    ticker: 'KTC', name: 'Krungthai Card PCL', sector: 'Financials',
    ipoDate: '2002-11-27', ipoPrice: 5,
    currentPrice: 54.25, change: 0.75, changePct: 1.40, volume: 8_500_000, marketCap: 65.0,
    pe: 18.5, de: 4.5, fcf: 4.5, roe: 22.5, dividendYield: 3.8, sectorAvgPE: 18.0, volatility: 0.019,
  },
  {
    ticker: 'TLI', name: 'Thai Life Insurance PCL', sector: 'Financials',
    ipoDate: '2022-09-28', ipoPrice: 10,
    currentPrice: 13.80, change: 0.20, changePct: 1.47, volume: 12_500_000, marketCap: 55.0,
    pe: 18.5, de: 0.2, fcf: 5.5, roe: 8.5, dividendYield: 2.5, sectorAvgPE: 18.0, volatility: 0.017,
  },
  {
    ticker: 'JMT', name: 'JMT Network Services PCL', sector: 'Financials',
    ipoDate: '2017-02-16', ipoPrice: 5,
    currentPrice: 22.50, change: -0.25, changePct: -1.10, volume: 18_000_000, marketCap: 28.0,
    pe: 18.5, de: 2.5, fcf: 1.5, roe: 18.5, dividendYield: 2.8, sectorAvgPE: 18.0, volatility: 0.025,
  },
  {
    ticker: 'PHOL', name: 'Phol Dhanya PCL', sector: 'Financials',
    ipoDate: '2005-01-01', ipoPrice: 5,
    currentPrice: 8.25, change: 0.05, changePct: 0.61, volume: 8_500_000, marketCap: 6.5,
    pe: 12.5, de: 2.5, fcf: 0.6, roe: 11.5, dividendYield: 4.8, sectorAvgPE: 18.0, volatility: 0.026,
  },
]

/** @type {Object.<string, Stock>} */
export const STOCKS_MAP = Object.fromEntries(STOCKS.map(s => [s.ticker, s]))

export const SECTORS = [...new Set(STOCKS.map(s => s.sector))]
