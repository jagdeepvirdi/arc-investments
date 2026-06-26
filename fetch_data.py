#!/usr/bin/env python3
"""
Fetch real SET market data from Yahoo Finance:
  • Chart API (v8)        — daily OHLCV candles, 5-year range
  • quoteSummary (v10)    — P/E, D/E, FCF, ROE, dividendYield,
                            payoutRatio, epsGrowth, revenueGrowth

Usage:  python fetch_data.py                  # fetch all three indices
        python fetch_data.py --index sset     # sSET only
        python fetch_data.py --index set100   # SET100 only
        python fetch_data.py --index mai      # MAI only

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
    # Food & Beverage
    'ASIAN','COCOCO','KCG','MALEE','RBF','SAPPE','SNNP','TEGH','TKN',
    # Healthcare
    'EKH','ILM','KLINIQ','MEDEZE','RJH','RPH','THG','WPH',
    # Technology
    'ADVICE','AIT','BBIK','DITTO','FORTH','III','ILINK','RABBIT',
    'SAMART','SIS','SKY','SYNEX','TEAMG','THCOM','TKS','XPG',
    # Property
    'BLAND','LPN','NEX','NOBLE','ORI','PSH','SC',
    # Manufacturing
    'BYD','EPG','HFT','HTC','MCS','NER','NYT','OKJ','SAK','SAT','SCGD','STPI','TFM',
    # Consumer
    'FM','KAMART','MC','PLAT','SABINA','SINGER','SPA','SUN','TMAN',
    # Financials
    'ASK','CB','HENG','KGI','NCAP','NSL','PTL','SCAP','THANI','TQM',
    # Energy
    'BAFS','BBGI','LANNA','PCE','PT','SUPER',
    # Transport
    'AAI','DMT','PM','PSL','TTA',
    # Media & Entertainment
    'BEC','MAJOR','MASTER','ONEE','PSP',
    # Services
    'AH','BLC','EASTW','HUMAN','KBS','NEO','ROJNA','SHR','SRICHA','TIPH','UVAN','VIH',
]

MAI_TICKERS = [
    # Food & Agri
    'APO','AU','CFARM','KASET','MAGURO','MUD','NTF','NTSC','QDC','CB',
    'TACC','TMILL','WINNER','XO',
    # Consumer
    '88TH','BGT','DOD','ECF','EFORL','EURO','HPT','ITTHI','JSP','JUBILE',
    'LTS','MGI','MOONG','NPK','NUT','SEI','SKIN','SMD100','TM','WARRIX','WINMED',
    # Financials
    'ACAP','AF','AIRA','ASN','BTC','GCAP','KCC','LIT','MITSIB','SGF','TQR',
    # Manufacturing
    'ADB','BM','BPS','CHO','CHOW','CIG','COLOR','CPR','FPI','GTB','HARN',
    'KCM','KJL','KUMWEL','KWM','MBAX','MGT','MTW','NDR','PACO','PDG','PHOL',
    'PIMO','PMC','PPM','PRAPAT','RWI','SAF','SALEE','SANKO','SCL','SFT','STP',
    'SWC','TATG','TMC','TMI','TMW','TPLAS','TRT','TRV','UBIS','UEC','UKEM',
    'UREKA','YUASA','ZIGA',
    # Property
    'ARIN','ARROW','BC','BKA','BLESS','BSM','BTW','CAZ','CHEWA','CPANEL',
    'CRD','DHOUSE','DIMET','DPAINT','EMPIRE','FLOYD','HYDRO','IND','JAK','META',
    'MMM','PANEL','PPS','PRI','PROS','PSGC','QTCG','SENX','SK','SMART',
    'STC','STX','SVR','TAPAC','THANA','TIGER','WELL','YONG',
    # Energy
    'ABM','ALPHAX','GTV','PSTC','PTC','SAAM','SR','STOWER','TAKUNI','TPCH','UMS',
    # Services
    'ADD','AKP','AMA','AMARC','ARIP','ASTR','ATP30','AUCT','BIS','BOL','CEYE',
    'CHIC','CMO','D','DEXON','ETE','FSMART','FVC','GFC','GLORY','HANN','HL',
    'IMH','IROYAL','IVF','JPARK','K','KGEN','KK','KOOL','KTMS','LDC','LEO',
    'LTMH','MCA','MEB','MORE','MOTHER','MPJ','MVP','NCL','NCP','PEER','PICO',
    'PLT','QLT','RP','SONIC','SPTX','THMUI','TNDT','TNH','TNP','TPL','TRP',
    'TURTLE','TVDH','TVT','UBA','VIBE','VL','VS','WASH','YGG',
    # Technology
    'APP','BE8','BVG','COMAN','I2','IDG','IIG','IRCP','ITNS','NAT','NETBAY',
    'PIS','PLANET','PROEN','READY','SECURE','SICT','SIMAT','SPVI','SRS','TBN',
    'TERA','TPS','VCOM',
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
    # sSET — Food & Beverage
    'ASIAN':'Food & Beverage','COCOCO':'Food & Beverage','KCG':'Food & Beverage',
    'MALEE':'Food & Beverage','RBF':'Food & Beverage','SAPPE':'Food & Beverage',
    'SNNP':'Food & Beverage','TEGH':'Food & Beverage','TKN':'Food & Beverage',
    # sSET — Healthcare
    'EKH':'Healthcare','ILM':'Healthcare','KLINIQ':'Healthcare','MEDEZE':'Healthcare',
    'RJH':'Healthcare','RPH':'Healthcare','THG':'Healthcare','WPH':'Healthcare',
    # sSET — Technology
    'ADVICE':'Technology','AIT':'Technology','BBIK':'Technology','DITTO':'Technology',
    'FORTH':'Technology','III':'Technology','ILINK':'Technology','RABBIT':'Technology',
    'SAMART':'Technology','SIS':'Technology','SKY':'Technology','SYNEX':'Technology',
    'TEAMG':'Technology','THCOM':'Technology','TKS':'Technology','XPG':'Technology',
    # sSET — Property
    'BLAND':'Property','NEX':'Property','NOBLE':'Property','PSH':'Property',
    # sSET — Manufacturing
    'BYD':'Manufacturing','EPG':'Manufacturing','HFT':'Manufacturing','HTC':'Manufacturing',
    'MCS':'Manufacturing','NER':'Manufacturing','NYT':'Manufacturing','OKJ':'Manufacturing',
    'SAK':'Manufacturing','SAT':'Manufacturing','SCGD':'Manufacturing',
    'STPI':'Manufacturing','TFM':'Manufacturing',
    # sSET — Consumer
    'FM':'Consumer','KAMART':'Consumer','MC':'Consumer','PLAT':'Consumer',
    'SABINA':'Consumer','SINGER':'Consumer','SPA':'Consumer','SUN':'Consumer','TMAN':'Consumer',
    # sSET — Financials
    'CB':'Financials','HENG':'Financials','KGI':'Financials','NCAP':'Financials',
    'NSL':'Financials','PTL':'Financials','SCAP':'Financials','TQM':'Financials',
    # sSET — Energy
    'BAFS':'Energy','BBGI':'Energy','LANNA':'Energy','PCE':'Energy','PT':'Energy','SUPER':'Energy',
    # sSET — Transport
    'AAI':'Transport','DMT':'Transport','PM':'Transport','PSL':'Transport',
    # sSET — Media & Entertainment
    'BEC':'Media & Entertainment','MASTER':'Media & Entertainment',
    'ONEE':'Media & Entertainment','PSP':'Media & Entertainment',
    # sSET — Services
    'AH':'Services','BLC':'Services','HUMAN':'Services','KBS':'Services',
    'NEO':'Services','ROJNA':'Services','SHR':'Services','SRICHA':'Services',
    'TIPH':'Services','UVAN':'Services','VIH':'Services',
    # MAI — Food & Agri
    'APO':'Food & Agri','AU':'Food & Agri','CFARM':'Food & Agri','KASET':'Food & Agri',
    'MAGURO':'Food & Agri','MUD':'Food & Agri','NTF':'Food & Agri','NTSC':'Food & Agri',
    'QDC':'Food & Agri','CB':'Food & Agri','TACC':'Food & Agri','TMILL':'Food & Agri',
    'WINNER':'Food & Agri','XO':'Food & Agri',
    # MAI — Consumer
    '88TH':'Consumer','BGT':'Consumer','DOD':'Consumer','ECF':'Consumer',
    'EFORL':'Consumer','EURO':'Consumer','HPT':'Consumer','ITTHI':'Consumer',
    'JSP':'Consumer','JUBILE':'Consumer','LTS':'Consumer','MGI':'Consumer',
    'MOONG':'Consumer','NPK':'Consumer','NUT':'Consumer','SEI':'Consumer',
    'SKIN':'Consumer','SMD100':'Consumer','TM':'Consumer','WARRIX':'Consumer',
    'WINMED':'Consumer',
    # MAI — Financials
    'ACAP':'Financials','AF':'Financials','AIRA':'Financials','ASN':'Financials',
    'BTC':'Financials','GCAP':'Financials','KCC':'Financials','LIT':'Financials',
    'MITSIB':'Financials','SGF':'Financials','TQR':'Financials',
    # MAI — Manufacturing
    'ADB':'Manufacturing','BM':'Manufacturing','BPS':'Manufacturing','CHO':'Manufacturing',
    'CHOW':'Manufacturing','CIG':'Manufacturing','COLOR':'Manufacturing','CPR':'Manufacturing',
    'FPI':'Manufacturing','GTB':'Manufacturing','HARN':'Manufacturing','KCM':'Manufacturing',
    'KJL':'Manufacturing','KUMWEL':'Manufacturing','KWM':'Manufacturing','MBAX':'Manufacturing',
    'MGT':'Manufacturing','MTW':'Manufacturing','NDR':'Manufacturing','PACO':'Manufacturing',
    'PDG':'Manufacturing','PHOL':'Manufacturing','PIMO':'Manufacturing','PMC':'Manufacturing',
    'PPM':'Manufacturing','PRAPAT':'Manufacturing','RWI':'Manufacturing','SAF':'Manufacturing',
    'SALEE':'Manufacturing','SANKO':'Manufacturing','SCL':'Manufacturing','SFT':'Manufacturing',
    'STP':'Manufacturing','SWC':'Manufacturing','TATG':'Manufacturing','TMC':'Manufacturing',
    'TMI':'Manufacturing','TMW':'Manufacturing','TPLAS':'Manufacturing','TRT':'Manufacturing',
    'TRV':'Manufacturing','UBIS':'Manufacturing','UEC':'Manufacturing','UKEM':'Manufacturing',
    'UREKA':'Manufacturing','YUASA':'Manufacturing','ZIGA':'Manufacturing',
    # MAI — Property
    'ARIN':'Property','ARROW':'Property','BC':'Property','BKA':'Property',
    'BLESS':'Property','BSM':'Property','BTW':'Property','CAZ':'Property',
    'CHEWA':'Property','CPANEL':'Property','CRD':'Property','DHOUSE':'Property',
    'DIMET':'Property','DPAINT':'Property','EMPIRE':'Property','FLOYD':'Property',
    'HYDRO':'Property','IND':'Property','JAK':'Property','META':'Property',
    'MMM':'Property','PANEL':'Property','PPS':'Property','PRI':'Property',
    'PROS':'Property','PSGC':'Property','QTCG':'Property','SENX':'Property',
    'SK':'Property','SMART':'Property','STC':'Property','STX':'Property',
    'SVR':'Property','TAPAC':'Property','THANA':'Property','TIGER':'Property',
    'WELL':'Property','YONG':'Property',
    # MAI — Energy
    'ABM':'Energy','ALPHAX':'Energy','GTV':'Energy','PSTC':'Energy','PTC':'Energy',
    'SAAM':'Energy','SR':'Energy','STOWER':'Energy','TAKUNI':'Energy','TPCH':'Energy',
    'UMS':'Energy',
    # MAI — Services
    'ADD':'Services','AKP':'Services','AMA':'Services','AMARC':'Services',
    'ARIP':'Services','ASTR':'Services','ATP30':'Services','AUCT':'Services',
    'BIS':'Services','BOL':'Services','CEYE':'Services','CHIC':'Services',
    'CMO':'Services','D':'Services','DEXON':'Services','ETE':'Services',
    'FSMART':'Services','FVC':'Services','GFC':'Services','GLORY':'Services',
    'HANN':'Services','HL':'Services','IMH':'Services','IROYAL':'Services',
    'IVF':'Services','JPARK':'Services','K':'Services','KGEN':'Services',
    'KK':'Services','KOOL':'Services','KTMS':'Services','LDC':'Services',
    'LEO':'Services','LTMH':'Services','MCA':'Services','MEB':'Services',
    'MORE':'Services','MOTHER':'Services','MPJ':'Services','MVP':'Services',
    'NCL':'Services','NCP':'Services','PEER':'Services','PICO':'Services',
    'PLT':'Services','QLT':'Services','RP':'Services','SONIC':'Services',
    'SPTX':'Services','THMUI':'Services','TNDT':'Services','TNH':'Services',
    'TNP':'Services','TPL':'Services','TRP':'Services','TURTLE':'Services',
    'TVDH':'Services','TVT':'Services','UBA':'Services','VIBE':'Services',
    'VL':'Services','VS':'Services','WASH':'Services','YGG':'Services',
    # MAI — Technology
    'APP':'Technology','BE8':'Technology','BVG':'Technology','COMAN':'Technology',
    'I2':'Technology','IDG':'Technology','IIG':'Technology','IRCP':'Technology',
    'ITNS':'Technology','NAT':'Technology','NETBAY':'Technology','PIS':'Technology',
    'PLANET':'Technology','PROEN':'Technology','READY':'Technology','SECURE':'Technology',
    'SICT':'Technology','SIMAT':'Technology','SPVI':'Technology','SRS':'Technology',
    'TBN':'Technology','TERA':'Technology','TPS':'Technology','VCOM':'Technology',
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
    import argparse

    parser = argparse.ArgumentParser(description='Fetch SET market data from Yahoo Finance.')
    parser.add_argument(
        '--index', choices=['set100', 'sset', 'mai'], default=None,
        help='Fetch a single index only (default: fetch all three)',
    )
    args = parser.parse_args()

    out = os.path.join('src', 'data', 'real')

    print('Initializing Yahoo Finance session...')
    init_session()

    # Load existing meta so unchanged indices keep their stats
    meta_path = os.path.join(out, 'meta.json')
    try:
        with open(meta_path, 'r', encoding='utf-8') as f:
            existing_meta = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        existing_meta = {}

    run_all = args.index is None

    if run_all or args.index == 'set100':
        set100_result = process(SET100_TICKERS, 'set100', out)
    else:
        set100_result = {
            'fetched': existing_meta.get('set100Count', 0),
            'skipped': existing_meta.get('skipped', {}).get('SET100', []),
        }

    if run_all or args.index == 'sset':
        sset_result = process(SSET_TICKERS, 'sset', out)
    else:
        sset_result = {
            'fetched': existing_meta.get('ssetCount', 0),
            'skipped': existing_meta.get('skipped', {}).get('SSET', []),
        }

    if run_all or args.index == 'mai':
        mai_result = process(MAI_TICKERS, 'mai', out)
    else:
        mai_result = {
            'fetched': existing_meta.get('maiCount', 0),
            'skipped': existing_meta.get('skipped', {}).get('MAI', []),
        }

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
    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(meta, f, indent=2)
    print(f'\n  Wrote metadata     -> {meta_path}')
    print('\nDone. Run: npm run dev\n')
