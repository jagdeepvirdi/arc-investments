#!/usr/bin/env python3
"""
Validate that real market data (src/data/real/) has full price + volume
coverage from each stock's launch (IPO) date through today.

Checks per ticker:
  1. Present in both _stocks.json and _history.json
  2. History is non-empty
  3. First candle date is close to ipoDate (flags if history starts later
     than IPO — meaning early years are missing)
  4. Last candle date is recent (flags stale/no longer updating tickers)
  5. No abnormally large gaps between consecutive trading days
     (Thai market holidays are normally a few days; SET-wide halts can be
     longer — anything > 15 calendar days is flagged for review)
  6. No zero/negative price or missing volume within the series

Reads only local JSON already fetched by fetch_data.py — no network calls.
"""

import json
import os
from datetime import datetime, timedelta, timezone

STOCKS_BASE = os.path.join('src', 'data', 'real')
HISTORY_BASE = os.path.join('public', 'data')
TODAY = datetime.now(timezone.utc).date()

INDICES = [
    ('SET100', 'set100_stocks.json', 'set100_history.json'),
    ('sSET',   'sset_stocks.json',   'sset_history.json'),
    ('MAI',    'mai_stocks.json',    'mai_history.json'),
]

GAP_THRESHOLD_DAYS = 15       # flag gaps between trading days larger than this
STALE_THRESHOLD_DAYS = 10     # flag if last candle is older than this vs today


def load(base, path):
    with open(os.path.join(base, path), 'r', encoding='utf-8') as f:
        return json.load(f)


def parse_date(s):
    return datetime.strptime(s, '%Y-%m-%d').date()


def validate_index(label, stocks_file, history_file):
    stocks = load(STOCKS_BASE, stocks_file)
    history = load(HISTORY_BASE, history_file)

    issues = {
        'missing_history': [],
        'empty_history': [],
        'late_start': [],
        'stale_end': [],
        'large_gaps': [],
        'bad_values': [],
    }

    stock_map = {s['ticker']: s for s in stocks}

    for ticker, stock in stock_map.items():
        candles = history.get(ticker)
        if candles is None:
            issues['missing_history'].append(ticker)
            continue
        if len(candles) == 0:
            issues['empty_history'].append(ticker)
            continue

        ipo_date = parse_date(stock['ipoDate'])
        first_date = parse_date(candles[0]['time'])
        last_date = parse_date(candles[-1]['time'])

        # 1. history should start at/near IPO date
        start_gap = (first_date - ipo_date).days
        if start_gap > GAP_THRESHOLD_DAYS:
            issues['late_start'].append(
                f"{ticker}: ipo={ipo_date} history_starts={first_date} (+{start_gap}d missing)"
            )

        # 2. history should end near today
        end_gap = (TODAY - last_date).days
        if end_gap > STALE_THRESHOLD_DAYS:
            issues['stale_end'].append(
                f"{ticker}: last_candle={last_date} ({end_gap}d stale)"
            )

        # 3. gaps between consecutive candles
        prev = first_date
        max_gap = 0
        max_gap_range = None
        for c in candles[1:]:
            d = parse_date(c['time'])
            gap = (d - prev).days
            if gap > max_gap:
                max_gap = gap
                max_gap_range = (prev, d)
            prev = d
        if max_gap > GAP_THRESHOLD_DAYS:
            issues['large_gaps'].append(
                f"{ticker}: {max_gap}d gap between {max_gap_range[0]} and {max_gap_range[1]}"
            )

        # 4. bad price/volume values anywhere in series
        bad = 0
        for c in candles:
            if c['close'] <= 0 or c['open'] <= 0 or c['high'] <= 0 or c['low'] <= 0:
                bad += 1
            if c.get('volume') is None or c['volume'] < 0:
                bad += 1
        if bad:
            issues['bad_values'].append(f"{ticker}: {bad} bad candle(s)")

    return stock_map, issues


def main():
    grand_total = 0
    grand_clean = 0

    for label, stocks_file, history_file in INDICES:
        stock_map, issues = validate_index(label, stocks_file, history_file)
        total = len(stock_map)
        problem_tickers = set()
        for k in issues:
            for entry in issues[k]:
                problem_tickers.add(entry.split(':')[0])
        clean = total - len(problem_tickers)
        grand_total += total
        grand_clean += clean

        print(f"\n{'='*70}")
        print(f" {label}  —  {total} tickers, {clean} fully clean, {len(problem_tickers)} flagged")
        print(f"{'='*70}")

        for key, title in [
            ('missing_history', 'Missing history entirely'),
            ('empty_history',   'Empty history array'),
            ('late_start',      'History starts AFTER IPO date (missing early years)'),
            ('stale_end',       f'History ends >{STALE_THRESHOLD_DAYS}d before today (not updating)'),
            ('large_gaps',      f'Gap >{GAP_THRESHOLD_DAYS}d between trading days (possible missing range)'),
            ('bad_values',      'Zero/negative price or invalid volume'),
        ]:
            entries = issues[key]
            if entries:
                print(f"\n  [{title}] ({len(entries)})")
                for e in entries[:25]:
                    print(f"    - {e}")
                if len(entries) > 25:
                    print(f"    ... and {len(entries) - 25} more")

    print(f"\n{'='*70}")
    print(f" TOTAL: {grand_clean}/{grand_total} tickers fully clean "
          f"({grand_total - grand_clean} flagged for review)")
    print(f"{'='*70}")


if __name__ == '__main__':
    main()
