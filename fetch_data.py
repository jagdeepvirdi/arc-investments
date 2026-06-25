#!/usr/bin/env python3
"""
Fetch real SET market data from Yahoo Finance:
  • Chart API (v8)        — daily OHLCV candles, 5-year range
  • quoteSummary (v10)    — P/E, D/E, FCF, ROE, dividendYield,
                            payoutRatio, epsGrowth, revenueGrowth

Usage:  python fetch_data.py

Outputs:
  src/data/real/set100_stocks.json   — price + fundamental fields
  src/data/real/set100_history.json  — daily OHLCV arrays
  src/data/real/sset_stocks.json / sset_history.json
  src/data/real/mai_stocks.json  / mai_history.json
  src/data/real/meta.json            — run stats ("Last updated")
"""

import sys, io, warnings, requests, urllib3, json, os, time
from datetime import datetime, timezone

warnings.filterwarnings('ignore')
urllib3.disable_warnings()

# Force UTF-8 on Windows Thai-locale terminals
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SESSION = requests.Session()
SESSION.verify = False
SESSION.headers.update({
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/125.0.0.0 Safari/537.36'
    ),
    'Accept': 'application/json',
    'Referer': 'https://finance.yahoo.com/',
})

YF_CHART   = 'https://query1.finance.yahoo.com/v8/finance/chart/{symbol}'
YF_SUMMARY = 'https://query1.finance.yahoo.com/v10/finance/quoteSummary/{symbol}'

CRUMB = None  # populated by init_session()

# ── Ticker lists ──────────────────────────────────────────────────────────────

SET100_TICKERS = [
    'PTT','PTTEP','GULF','GPSC','BGRIM','BPP','RATCH','EGCO',
    'IRPC','TOP','SPRC','PTTGC','BANPU','BCP','OR',
    'KBANK','SCB','BBL','KTB','TTB','TISCO','KKP','TCAP',
    'CPN','AWC','LH','SPALI','AP','QH','SC','ORI',
    'NOBLE','ANAN','SIRI','LPN','PRUK','AMATA','WHA',
    'ADVANC','TRUE','INTUCH',
    'CPALL','HMPRO','CRC','BJC','COM7','DOHOME','CPAXT','GLOBAL','CBG','OSP',
    'BDMS','BH','BCH','CHG','MEGA','VGI','DMK','RJH',
    'SCC','IVL','SCGP','TPIPL','TASCO','HANA','DELTA','KCE','CCET','EASTW',
    'CPF','TU','GFPT','BTG','MINT','ERW','CENTEL',
    'AOT','BEM','BTS','AAV','BA','NOK','THAI','TTA',
    'MAJOR','RS','WORK','JMART',
    'MTC','SAWAD','AEONTS','ASK','GL','TIDLOR','THANI','TMT','KTC','TLI','JMT','PHOL',
]

SSET_TICKERS = [
    'MALEE','ICHI','ZEN','SAPPE','SNP','OISHI','TFG',
    'WPH','SKR','RAM','THG','LPH','KDH',
    'INET','MFEC','SVI','SVOA','CS','TEAMG','SIS',
    'LALIN','SENA','NUSA','RICHY','PRIN','GRAND','JSP','PACE',
    'PYLON','NWR','SEAFCO','ITD','COTTO','CHOW','STEC','MASTER',
    'MBK','SINGER','BEAUTY','JUBILE','TNP',
    'CHAYO','EASY','AIRA','CIMBT','ASP',
    'LEO','WICE','JWD','NCL',
]

MAI_TICKERS = [
    'JKN','PLANET','MST','SMART','UBIS','NMG','SMT','ROBOT',
    'DRT','HPMT','INOX','SIMAT','SNC','STANLY','SYNTEC','TYM','TWFP','UNIUN','PANKO',
    'CHO','GENCO','YONG',
    'SORKON','SKN','PDI','MOONG','TMI',
    'TIGER','WFRESH','COCOCO',
    'VIBHA',
    'BGC',
    'TSE','TAE','PSTC',
    'PRANDA','JCK','SLC',
]

SECTOR_MAP = {
    'PTT':'Energy','PTTEP':'Energy','GULF':'Energy','GPSC':'Energy',
    'BGRIM':'Energy','BPP':'Energy','RATCH':'Energy','EGCO':'Energy',
    'IRPC':'Energy','TOP':'Energy','SPRC':'Energy','PTTGC':'Energy',
    'BANPU':'Energy','BCP':'Energy','OR':'Energy',
    'KBANK':'Banking','SCB':'Banking','BBL':'Banking','KTB':'Banking',
    'TTB':'Banking','TISCO':'Banking','KKP':'Banking','TCAP':'Banking',
    'CPN':'Property','AWC':'Property','LH':'Property','SPALI':'Property',
    'AP':'Property','QH':'Property','SC':'Property','ORI':'Property',
    'NOBLE':'Property','ANAN':'Property','SIRI':'Property','LPN':'Property',
    'PRUK':'Property','AMATA':'Property','WHA':'Property',
    'ADVANC':'Telecom','TRUE':'Telecom','INTUCH':'Telecom',
    'CPALL':'Consumer','HMPRO':'Consumer','CRC':'Consumer','BJC':'Consumer',
    'COM7':'Consumer','DOHOME':'Consumer','CPAXT':'Consumer','GLOBAL':'Consumer',
    'CBG':'Consumer','OSP':'Consumer',
    'BDMS':'Healthcare','BH':'Healthcare','BCH':'Healthcare','CHG':'Healthcare',
    'MEGA':'Healthcare','VGI':'Healthcare','DMK':'Healthcare','RJH':'Healthcare',
    'SCC':'Industry','IVL':'Industry','SCGP':'Industry','TPIPL':'Industry',
    'TASCO':'Industry','HANA':'Industry','DELTA':'Industry','KCE':'Industry',
    'CCET':'Industry','EASTW':'Industry',
    'CPF':'Food & Agri','TU':'Food & Agri','GFPT':'Food & Agri','BTG':'Food & Agri',
    'MINT':'Food & Agri','ERW':'Food & Agri','CENTEL':'Food & Agri',
    'AOT':'Transport','BEM':'Transport','BTS':'Transport','AAV':'Transport',
    'BA':'Transport','NOK':'Transport','THAI':'Transport','TTA':'Transport',
    'MAJOR':'Tech / Media','RS':'Tech / Media','WORK':'Tech / Media','JMART':'Tech / Media',
    'MTC':'Financials','SAWAD':'Financials','AEONTS':'Financials','ASK':'Financials',
    'GL':'Financials','TIDLOR':'Financials','THANI':'Financials','TMT':'Financials',
    'KTC':'Financials','TLI':'Financials','JMT':'Financials','PHOL':'Financials',
    'MALEE':'Food & Beverage','ICHI':'Food & Beverage','ZEN':'Food & Beverage',
    'SAPPE':'Food & Beverage','SNP':'Food & Beverage','OISHI':'Food & Beverage','TFG':'Food & Beverage',
    'WPH':'Healthcare','SKR':'Healthcare','RAM':'Healthcare','THG':'Healthcare',
    'LPH':'Healthcare','KDH':'Healthcare',
    'INET':'Technology','MFEC':'Technology','SVI':'Technology','SVOA':'Technology',
    'CS':'Technology','TEAMG':'Technology','SIS':'Technology',
    'LALIN':'Property','SENA':'Property','NUSA':'Property','RICHY':'Property',
    'PRIN':'Property','GRAND':'Property','JSP':'Property','PACE':'Property',
    'PYLON':'Manufacturing','NWR':'Manufacturing','SEAFCO':'Manufacturing',
    'ITD':'Manufacturing','COTTO':'Manufacturing','CHOW':'Manufacturing',
    'STEC':'Manufacturing','MASTER':'Manufacturing',
    'MBK':'Consumer','SINGER':'Consumer','BEAUTY':'Consumer','JUBILE':'Consumer','TNP':'Consumer',
    'CHAYO':'Financials','EASY':'Financials','AIRA':'Financials','CIMBT':'Financials','ASP':'Financials',
    'LEO':'Logistics','WICE':'Logistics','JWD':'Logistics','NCL':'Logistics',
    'JKN':'Technology','PLANET':'Technology','MST':'Technology','SMART':'Technology',
    'UBIS':'Technology','NMG':'Technology','SMT':'Technology','ROBOT':'Technology',
    'DRT':'Manufacturing','HPMT':'Manufacturing','INOX':'Manufacturing','SIMAT':'Manufacturing',
    'SNC':'Manufacturing','STANLY':'Manufacturing','SYNTEC':'Manufacturing','TYM':'Manufacturing',
    'TWFP':'Manufacturing','UNIUN':'Manufacturing','PANKO':'Manufacturing',
    'CHO':'Industrial','GENCO':'Industrial','YONG':'Industrial',
    'SORKON':'Property','SKN':'Property','PDI':'Property','MOONG':'Property','TMI':'Property',
    'TIGER':'Food & Beverage','WFRESH':'Food & Beverage','COCOCO':'Food & Beverage',
    'VIBHA':'Healthcare',
    'BGC':'Consumer',
    'TSE':'Energy','TAE':'Energy','PSTC':'Energy',
    'PRANDA':'Services','JCK':'Services','SLC':'Services',
}

# ── Session / crumb ────────────────────────────────────────────────────────────

def init_session():
    """Visit Yahoo Finance homepage to set cookies, then fetch the API crumb."""
    global CRUMB
    try:
        SESSION.get('https://finance.yahoo.com', timeout=12)
        r = SESSION.get('https://query1.finance.yahoo.com/v1/test/getcrumb', timeout=12)
        if r.ok and r.text.strip():
            CRUMB = r.text.strip()
            print(f'  Crumb obtained: {CRUMB[:12]}...')
        else:
            print('  No crumb — quoteSummary will try without it.')
    except Exception as e:
        print(f'  Session init warning: {e}')

# ── Helpers ────────────────────────────────────────────────────────────────────

def _raw(d, key):
    """Extract the raw numeric value from a Yahoo Finance formatted field."""
    if not isinstance(d, dict):
        return None
    v = d.get(key)
    if v is None:
        return None
    if isinstance(v, dict):
        return v.get('raw')
    try:
        return float(v)
    except (TypeError, ValueError):
        return None

# ── Chart fetch (OHLCV + price meta) ─────────────────────────────────────────

def fetch_chart(ticker, retries=3):
    """
    Fetch 5y of daily candles + current price metadata via v8 chart API.
    Returns (stock_dict, candles_list) or (None, []) on failure.
    """
    symbol = f'{ticker}.BK'
    params = {'range': '5y', 'interval': '1d', 'includePrePost': 'false'}

    for attempt in range(retries):
        try:
            r = SESSION.get(YF_CHART.format(symbol=symbol), params=params, timeout=25)
            if r.status_code == 429:
                wait = 90 * (attempt + 1)
                print(f' rate-limit, waiting {wait}s...', flush=True)
                time.sleep(wait)
                continue
            if not r.ok:
                print(f' HTTP {r.status_code}', flush=True)
                return None, []
            data = r.json()
            break
        except Exception as e:
            if attempt == retries - 1:
                print(f' error: {e}', flush=True)
                return None, []
            time.sleep(3)
    else:
        return None, []

    try:
        result = data['chart']['result']
        if not result:
            return None, []
        res  = result[0]
        meta = res['meta']
        q    = res['indicators']['quote'][0]
        ts   = res.get('timestamp', [])

        candles = []
        for i, stamp in enumerate(ts):
            try:
                o = q['open'][i];  h = q['high'][i]
                l = q['low'][i];   c = q['close'][i]
                if any(v is None or float(v) <= 0 for v in (o, h, l, c)):
                    continue
                dt = datetime.fromtimestamp(stamp, tz=timezone.utc)
                candles.append({
                    'time':   dt.strftime('%Y-%m-%d'),
                    'open':   round(float(o), 2),
                    'high':   round(float(h), 2),
                    'low':    round(float(l), 2),
                    'close':  round(float(c), 2),
                    'volume': int(q['volume'][i] or 0),
                })
            except (IndexError, TypeError, ValueError):
                continue

        if not candles:
            return None, []

        current = float(meta.get('regularMarketPrice', candles[-1]['close']))
        prev    = float(meta.get('chartPreviousClose', candles[-2]['close'] if len(candles) > 1 else current))
        change  = round(current - prev, 2)
        chg_pct = round(change / prev * 100, 2) if prev else 0
        volume  = int(meta.get('regularMarketVolume', candles[-1]['volume']))
        name    = meta.get('longName') or meta.get('shortName') or ticker

        ipo_ts = meta.get('firstTradeDate')
        ipo_date  = datetime.fromtimestamp(ipo_ts, tz=timezone.utc).strftime('%Y-%m-%d') if ipo_ts else candles[0]['time']
        ipo_price = candles[0]['close']

        stock = {
            'ticker':       ticker,
            'name':         name,
            'sector':       SECTOR_MAP.get(ticker, 'Other'),
            'ipoDate':      ipo_date,
            'ipoPrice':     round(ipo_price, 2),
            'currentPrice': round(current, 2),
            'change':       change,
            'changePct':    chg_pct,
            'volume':       volume,
        }
        return stock, candles

    except Exception as e:
        print(f' parse error: {e}', flush=True)
        return None, []


# ── Fundamentals fetch (quoteSummary) ────────────────────────────────────────

def fetch_fundamentals(ticker, retries=3):
    """
    Fetch fundamental data via Yahoo Finance quoteSummary v10.
    Returns a dict with only the fields that were successfully retrieved
    (missing/null fields are omitted so realStocks.js falls back to mock).

    Field notes (Yahoo Finance units → stored units):
      pe            trailingPE                 → as-is (ratio)
      de            debtToEquity ÷ 100         → ratio  (Yahoo returns %, e.g. 120.5 = 1.205x)
      fcf           freeCashflow ÷ 1e9         → THB billions
      roe           returnOnEquity × 100       → percent (Yahoo returns decimal, e.g. 0.098 = 9.8%)
      dividendYield dividendYield × 100        → percent (decimal in Yahoo)
      payoutRatio   payoutRatio × 100          → percent (decimal in Yahoo)
      epsGrowth     earningsGrowth × 100       → percent YoY TTM
      revenueGrowth revenueGrowth × 100        → percent YoY TTM
    """
    symbol = f'{ticker}.BK'
    params = {'modules': 'financialData,summaryDetail', 'formatted': 'true'}
    if CRUMB:
        params['crumb'] = CRUMB

    for attempt in range(retries):
        try:
            r = SESSION.get(YF_SUMMARY.format(symbol=symbol), params=params, timeout=20)
            if r.status_code == 429:
                time.sleep(60 * (attempt + 1))
                continue
            if not r.ok:
                return {}
            data = r.json()
            break
        except Exception:
            if attempt == retries - 1:
                return {}
            time.sleep(3)
    else:
        return {}

    try:
        qs_result = data.get('quoteSummary', {}).get('result') or []
        if not qs_result:
            return {}
        qs = qs_result[0]
        fd = qs.get('financialData') or {}
        sd = qs.get('summaryDetail') or {}

        out = {}

        pe = _raw(sd, 'trailingPE')
        if pe is not None and pe > 0:
            out['pe'] = round(float(pe), 1)

        de_raw = _raw(fd, 'debtToEquity')
        if de_raw is not None:
            out['de'] = round(de_raw / 100, 2)

        fcf_raw = _raw(fd, 'freeCashflow')
        if fcf_raw is not None:
            out['fcf'] = round(fcf_raw / 1e9, 2)

        roe_raw = _raw(fd, 'returnOnEquity')
        if roe_raw is not None:
            out['roe'] = round(roe_raw * 100, 1)

        dy_raw = _raw(sd, 'dividendYield')
        if dy_raw is not None:
            out['dividendYield'] = round(dy_raw * 100, 2)

        pr_raw = _raw(sd, 'payoutRatio')
        if pr_raw is not None:
            out['payoutRatio'] = round(pr_raw * 100, 1)

        eg_raw = _raw(fd, 'earningsGrowth')
        if eg_raw is not None:
            out['epsGrowth'] = round(eg_raw * 100, 1)

        rg_raw = _raw(fd, 'revenueGrowth')
        if rg_raw is not None:
            out['revenueGrowth'] = round(rg_raw * 100, 1)

        return out

    except Exception:
        return {}


# ── Process one index ─────────────────────────────────────────────────────────

def process(tickers, label, out_dir):
    print(f'\n{"="*60}')
    print(f' {label}  ({len(tickers)} tickers)')
    print(f'{"="*60}')

    stocks_out  = []
    history_out = {}
    skipped     = []

    for i, ticker in enumerate(tickers, 1):
        print(f'  [{i:>3}/{len(tickers)}] {ticker:<8}', end='', flush=True)

        stock, candles = fetch_chart(ticker)

        if not stock or not candles:
            skipped.append(ticker)
            print(' -- skipped')
            time.sleep(0.3)
            continue

        # Brief pause then fetch fundamentals
        time.sleep(0.3)
        fund = fetch_fundamentals(ticker)
        stock.update(fund)

        stocks_out.append(stock)
        history_out[ticker] = candles

        pe_s  = f"pe={fund.get('pe', '?')}"
        roe_s = f"roe={fund.get('roe', '?')}%"
        dy_s  = f"dy={fund.get('dividendYield', '?')}%"
        print(f' OK  {len(candles):>4}d  {stock["currentPrice"]} THB  {pe_s} {roe_s} {dy_s}')

        time.sleep(0.4)

    os.makedirs(out_dir, exist_ok=True)

    stocks_path  = os.path.join(out_dir, f'{label}_stocks.json')
    history_path = os.path.join(out_dir, f'{label}_history.json')

    with open(stocks_path,  'w', encoding='utf-8') as f:
        json.dump(stocks_out, f, ensure_ascii=False, indent=2)
    with open(history_path, 'w', encoding='utf-8') as f:
        json.dump(history_out, f, ensure_ascii=False)

    print(f'\n  Wrote {len(stocks_out)} stocks  -> {stocks_path}')
    print(f'  Wrote history        -> {history_path}')
    if skipped:
        print(f'  Skipped ({len(skipped)}): {", ".join(skipped)}')

    return {'fetched': len(stocks_out), 'skipped': skipped}


# ── Entry ─────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    out = os.path.join('src', 'data', 'real')

    print('Initializing Yahoo Finance session...')
    init_session()

    set100_result = process(SET100_TICKERS, 'set100', out)
    sset_result   = process(SSET_TICKERS,   'sset',   out)
    mai_result    = process(MAI_TICKERS,    'mai',    out)

    meta = {
        'lastFetched': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z'),
        'set100Count': set100_result['fetched'],
        'set100Total': len(SET100_TICKERS),
        'ssetCount':   sset_result['fetched'],
        'ssetTotal':   len(SSET_TICKERS),
        'maiCount':    mai_result['fetched'],
        'maiTotal':    len(MAI_TICKERS),
        'skipped': {
            'SET100': set100_result['skipped'],
            'SSET':   sset_result['skipped'],
            'MAI':    mai_result['skipped'],
        },
    }
    meta_path = os.path.join(out, 'meta.json')
    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(meta, f, indent=2)
    print(f'\n  Wrote metadata     -> {meta_path}')
    print('\nDone. Run: npm run dev\n')
