#!/usr/bin/env python3
"""
Fetch real SET market data from Yahoo Finance v8 chart API → src/data/real/
No auth required — v8 chart is publicly accessible.

Usage:  python fetch_data.py

Outputs (merged with mock fundamentals in realStocks.js):
  src/data/real/set100_stocks.json   — price/volume fields per ticker
  src/data/real/set100_history.json  — full OHLCV arrays per ticker
  src/data/real/sset_stocks.json
  src/data/real/sset_history.json
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
})

YF_CHART = 'https://query1.finance.yahoo.com/v8/finance/chart/{symbol}'

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
}

# ── Core fetch ────────────────────────────────────────────────────────────────

def fetch_ticker(ticker, retries=3):
    """
    Fetch from v8 chart (no auth needed).
    Returns (stock_meta_dict, candles_list) or (None, []) on failure.
    """
    symbol = f'{ticker}.BK'
    params = {'range': 'max', 'interval': '1d', 'includePrePost': 'false'}

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

        # Build candles
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

        # Current price data from meta
        current   = float(meta.get('regularMarketPrice', candles[-1]['close']))
        prev      = float(meta.get('chartPreviousClose', candles[-2]['close'] if len(candles) > 1 else current))
        change    = round(current - prev, 2)
        chg_pct   = round(change / prev * 100, 2) if prev else 0
        volume    = int(meta.get('regularMarketVolume', candles[-1]['volume']))
        name      = meta.get('longName') or meta.get('shortName') or ticker

        # IPO approximation from first candle
        ipo_ts    = meta.get('firstTradeDate')
        if ipo_ts:
            ipo_date = datetime.fromtimestamp(ipo_ts, tz=timezone.utc).strftime('%Y-%m-%d')
        else:
            ipo_date = candles[0]['time']
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

        stock, candles = fetch_ticker(ticker)

        if stock and candles:
            stocks_out.append(stock)
            history_out[ticker] = candles
            print(f' OK  {len(candles):>5} candles  {stock["currentPrice"]} THB')
        else:
            skipped.append(ticker)
            print(' --  skipped')

        time.sleep(0.5)

    os.makedirs(out_dir, exist_ok=True)

    stocks_path  = os.path.join(out_dir, f'{label}_stocks.json')
    history_path = os.path.join(out_dir, f'{label}_history.json')

    with open(stocks_path,  'w', encoding='utf-8') as f:
        json.dump(stocks_out,  f, ensure_ascii=False, indent=2)
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
    set100_result = process(SET100_TICKERS, 'set100', out)
    sset_result   = process(SSET_TICKERS,   'sset',   out)

    # Write meta.json so the UI can show "Last updated" timestamp
    meta = {
        'lastFetched':  datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z'),
        'set100Count':  set100_result['fetched'],
        'set100Total':  len(SET100_TICKERS),
        'ssetCount':    sset_result['fetched'],
        'ssetTotal':    len(SSET_TICKERS),
        'skipped': {
            'SET100': set100_result['skipped'],
            'SSET':   sset_result['skipped'],
        },
    }
    meta_path = os.path.join(out, 'meta.json')
    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(meta, f, indent=2)
    print(f'\n  Wrote metadata     -> {meta_path}')
    print('\nDone. Run: npm run dev\n')
