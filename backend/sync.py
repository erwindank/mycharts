from flask import Blueprint, jsonify, request, Response, stream_with_context
import datetime
import zipfile
import io
import json
import csv
import os
import re
import urllib.parse
import requests as req_lib

bp = Blueprint('sync', __name__, url_prefix='/api/sync')

LASTFM_API_KEY = os.getenv('LASTFM_API_KEY')
LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/'


def api_error(message, status=400):
    return jsonify({'error': message}), status


def lastfm_api(method, params=None):
    all_params = {
        'method': method,
        'api_key': LASTFM_API_KEY,
        'format': 'json',
        **(params or {}),
    }
    r = req_lib.get(LASTFM_BASE_URL, params=all_params, timeout=30)
    r.raise_for_status()
    data = r.json()
    if 'error' in data:
        raise ValueError(data.get('message', 'Last.fm API error'))
    return data


def get_or_create_user(db, username):
    result = db.table('dc_users').select('id').eq('lastfm_username', username).execute()
    if result.data:
        return result.data[0]['id']
    result = db.table('dc_users').insert({
        'lastfm_username': username,
        'last_seen_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }).execute()
    return result.data[0]['id']


def insert_scrobbles(db, user_id, scrobbles):
    """Insert scrobbles in batches, silently skipping duplicates."""
    if not scrobbles:
        return 0
    seen_ts = set()
    deduped = []
    for s in scrobbles:
        ts = s.get('scrobbled_at')
        if ts and ts not in seen_ts:
            seen_ts.add(ts)
            deduped.append(s)

    rows = [{'user_id': user_id, **s} for s in deduped]
    total = 0
    for i in range(0, len(rows), 500):
        batch = rows[i:i + 500]
        try:
            db.table('dc_scrobbles').upsert(
                batch,
                on_conflict='user_id,scrobbled_at',
                ignore_duplicates=True,
            ).execute()
            total += len(batch)
        except Exception:
            for row in batch:
                try:
                    db.table('dc_scrobbles').insert(row).execute()
                    total += 1
                except Exception:
                    pass
    return total


def ts_to_iso(unix_ts):
    return datetime.datetime.fromtimestamp(int(unix_ts), tz=datetime.timezone.utc).isoformat()


_ES_MONTHS = {
    'ene': 1, 'feb': 2, 'mar': 3, 'abr': 4, 'may': 5, 'jun': 6,
    'jul': 7, 'ago': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dic': 12,
}


def parse_dt_str(s):
    if not s:
        return None
    s = str(s).strip()
    if s.isdigit() and len(s) >= 10:
        return ts_to_iso(int(s))
    # Spanish locale format from gviz/tq: "9/ene/2016 2:10:34"
    m = re.match(r'^(\d{1,2})/([a-zA-Z]{3})/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?', s)
    if m:
        mon = _ES_MONTHS.get(m.group(2).lower())
        if mon:
            try:
                dt = datetime.datetime(
                    int(m.group(3)), mon, int(m.group(1)),
                    int(m.group(4)), int(m.group(5)), int(m.group(6) or 0),
                    tzinfo=datetime.timezone.utc,
                )
                return dt.isoformat()
            except ValueError:
                pass
    formats = [
        '%Y-%m-%dT%H:%M:%SZ',
        '%Y-%m-%dT%H:%M:%S.%fZ',
        '%Y-%m-%dT%H:%M:%S',
        '%Y-%m-%d %H:%M:%S',
        '%d %b %Y, %H:%M',
        '%d/%m/%Y %H:%M:%S',
        '%d/%m/%Y %H:%M',
        '%m/%d/%Y %H:%M',
        '%Y-%m-%d %H:%M',
        '%Y-%m-%d',
    ]
    for fmt in formats:
        try:
            dt = datetime.datetime.strptime(s, fmt)
            return dt.replace(tzinfo=datetime.timezone.utc).isoformat()
        except ValueError:
            continue
    return None


# ── LAST.FM API SYNC ──────────────────────────────────────────────

@bp.route('/lastfm/<username>', methods=['POST'])
def sync_lastfm(username):
    from database import get_db

    body = request.get_json(silent=True) or {}
    page_start = int(body.get('page', 1))
    from_ts = body.get('from_ts')

    db = get_db()
    user_id = get_or_create_user(db, username)

    if not from_ts and page_start == 1:
        latest = (
            db.table('dc_scrobbles')
            .select('scrobbled_at')
            .eq('user_id', user_id)
            .order('scrobbled_at', desc=True)
            .limit(1)
            .execute()
        )
        if latest.data:
            dt = datetime.datetime.fromisoformat(latest.data[0]['scrobbled_at'])
            from_ts = int(dt.timestamp())

    params = {'user': username, 'limit': 200, 'extended': 0}
    if from_ts:
        params['from'] = from_ts

    try:
        first = lastfm_api('user.getRecentTracks', {**params, 'page': page_start})
    except Exception as e:
        return api_error(str(e))

    attrs = first.get('recenttracks', {}).get('@attr', {})
    total_pages = int(attrs.get('totalPages', 1))

    def parse_page(data):
        tracks = data.get('recenttracks', {}).get('track', [])
        result = []
        for t in tracks:
            if not isinstance(t, dict):
                continue
            if t.get('@attr', {}).get('nowplaying'):
                continue
            date_info = t.get('date', {})
            uts = date_info.get('uts') if isinstance(date_info, dict) else None
            if not uts:
                continue
            artist = t.get('artist', {})
            artist_name = artist.get('#text', '') if isinstance(artist, dict) else str(artist)
            album = t.get('album', {})
            album_name = album.get('#text', '') if isinstance(album, dict) else str(album)
            result.append({
                'artist': artist_name,
                'album': album_name,
                'track': t.get('name', ''),
                'scrobbled_at': ts_to_iso(uts),
            })
        return result

    all_scrobbles = parse_page(first)
    pages_fetched = 1
    max_pages = 25  # ~5000 scrobbles per call to avoid timeout

    for page in range(page_start + 1, min(page_start + max_pages, total_pages + 1)):
        try:
            data = lastfm_api('user.getRecentTracks', {**params, 'page': page})
            all_scrobbles.extend(parse_page(data))
            pages_fetched += 1
        except Exception:
            break

    count = insert_scrobbles(db, user_id, all_scrobbles)
    next_page = page_start + pages_fetched if (page_start + pages_fetched) <= total_pages else None

    return jsonify({
        'synced': count,
        'pages_fetched': pages_fetched,
        'total_pages': total_pages,
        'next_page': next_page,
        'has_more': next_page is not None,
    })


# ── FILE UPLOAD ───────────────────────────────────────────────────

@bp.route('/upload/<username>', methods=['POST'])
def upload_file(username):
    from database import get_db

    if 'file' not in request.files:
        return api_error('No file uploaded')

    f = request.files['file']
    filename = (f.filename or '').lower()

    db = get_db()
    user_id = get_or_create_user(db, username)

    try:
        content = f.read()
        if filename.endswith('.zip') or content[:2] == b'PK':
            scrobbles = parse_spotify_zip(io.BytesIO(content))
        elif filename.endswith('.xlsx') or filename.endswith('.xls'):
            scrobbles = parse_deezer_xlsx(io.BytesIO(content))
        else:
            scrobbles = parse_csv(content)
    except Exception as e:
        return api_error(f'Could not parse file: {str(e)}')

    count = insert_scrobbles(db, user_id, scrobbles)
    return jsonify({'synced': count, 'total': len(scrobbles)})


def parse_csv(content):
    try:
        text = content.decode('utf-8-sig')
    except Exception:
        text = content.decode('latin-1', errors='replace')

    reader = csv.DictReader(io.StringIO(text))
    fields = [f.lower().strip() for f in (reader.fieldnames or [])]

    is_lastfm_export = 'uts' in fields
    is_mycharts = any('song' in f or 'title' in f for f in fields) and any('date' in f for f in fields)

    scrobbles = []
    for row in reader:
        r = {k.lower().strip(): (v or '').strip() for k, v in row.items()}

        if is_lastfm_export:
            uts = r.get('uts', '')
            if not uts or not uts.isdigit():
                continue
            scrobbles.append({
                'artist': r.get('artist', ''),
                'album': r.get('album', ''),
                'track': r.get('track', ''),
                'scrobbled_at': ts_to_iso(int(uts)),
            })
        elif is_mycharts:
            dt_str = (r.get('date and time') or r.get('datetime') or
                      r.get('date') or r.get('time') or '')
            ts = parse_dt_str(dt_str)
            if not ts:
                continue
            scrobbles.append({
                'artist': r.get('artist', ''),
                'album': r.get('album', ''),
                'track': (r.get('song title') or r.get('track') or
                          r.get('title') or r.get('song') or ''),
                'scrobbled_at': ts,
            })
        else:
            ts = None
            for k in ['date and time', 'datetime', 'timestamp', 'utc_time', 'date', 'time']:
                v = r.get(k, '')
                if v:
                    ts = parse_dt_str(v)
                    if ts:
                        break
            if not ts:
                continue
            scrobbles.append({
                'artist': r.get('artist') or r.get('artist name') or '',
                'album': r.get('album') or r.get('album name') or '',
                'track': (r.get('song title') or r.get('track name') or
                          r.get('track') or r.get('title') or r.get('song') or ''),
                'scrobbled_at': ts,
            })

    return [s for s in scrobbles if s.get('track') and s.get('artist')]


def parse_spotify_zip(file_obj):
    scrobbles = []
    with zipfile.ZipFile(file_obj) as zf:
        for name in zf.namelist():
            lower = name.lower()
            if not lower.endswith('.json'):
                continue
            if not any(k in lower for k in ('streaming', 'endsong', 'audio')):
                continue
            with zf.open(name) as f:
                try:
                    data = json.load(f)
                except Exception:
                    continue
            if not isinstance(data, list):
                continue
            for item in data:
                if not isinstance(item, dict):
                    continue
                if int(item.get('ms_played', 0)) < 30000:
                    continue
                ts = parse_dt_str(item.get('ts') or item.get('endTime') or '')
                if not ts:
                    continue
                track = (item.get('master_metadata_track_name') or
                         item.get('trackName') or '')
                artist = (item.get('master_metadata_album_artist_name') or
                          item.get('artistName') or '')
                if not track or not artist:
                    continue
                scrobbles.append({
                    'artist': artist,
                    'album': item.get('master_metadata_album_album_name') or '',
                    'track': track,
                    'scrobbled_at': ts,
                })
    return scrobbles


def parse_deezer_xlsx(file_obj):
    try:
        import openpyxl
    except ImportError:
        raise RuntimeError('openpyxl not installed — contact support')

    wb = openpyxl.load_workbook(file_obj, read_only=True)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        return []

    header = [str(c or '').lower().strip() for c in rows[0]]
    col = {}
    for i, h in enumerate(header):
        if any(x in h for x in ['song', 'title', 'track', 'titre', 'piste']):
            col.setdefault('track', i)
        elif any(x in h for x in ['artist', 'artiste']):
            col.setdefault('artist', i)
        elif 'album' in h:
            col.setdefault('album', i)
        elif any(x in h for x in ['date', 'time', 'listened', 'ecoute']):
            col.setdefault('ts', i)

    scrobbles = []
    for row in rows[1:]:
        def get(key):
            idx = col.get(key)
            return str(row[idx] or '') if idx is not None and idx < len(row) else ''

        ts_raw = row[col['ts']] if 'ts' in col and col['ts'] < len(row) else None
        if isinstance(ts_raw, datetime.datetime):
            ts = ts_raw.replace(tzinfo=datetime.timezone.utc).isoformat()
        else:
            ts = parse_dt_str(str(ts_raw or ''))

        if not ts:
            continue
        artist = get('artist')
        track = get('track')
        if not artist or not track:
            continue
        scrobbles.append({
            'artist': artist,
            'album': get('album'),
            'track': track,
            'scrobbled_at': ts,
        })
    return scrobbles


# ── GOOGLE SHEETS ─────────────────────────────────────────────────

@bp.route('/sheets-proxy', methods=['GET'])
def sheets_proxy():
    """Proxy-fetch a public Google Sheet CSV using paginated gviz/tq calls.

    Google's export?format=csv silently truncates large public sheets at ~100-150k rows
    regardless of whether the request is from a browser or a server. The gviz/tq endpoint
    supports SQL-style LIMIT/OFFSET so we can page through the entire sheet in chunks.
    """
    sheet_id = request.args.get('sheetId', '').strip()
    gid = request.args.get('gid', '').strip()

    if not sheet_id or not re.match(r'^[a-zA-Z0-9_-]+$', sheet_id):
        return api_error('Invalid sheet ID')
    if gid and not gid.isdigit():
        return api_error('Invalid gid')

    req_headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    }

    PAGE_SIZE = 50000
    csv_header = None
    all_data_rows = []
    offset = 0
    first_page = True

    try:
        while True:
            tq = urllib.parse.quote(f"select * limit {PAGE_SIZE} offset {offset}")
            page_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv&tq={tq}"
            if gid and gid != '0':
                page_url += f"&gid={gid}"

            r = req_lib.get(page_url, headers=req_headers, timeout=120)
            r.raise_for_status()

            ct = r.headers.get('content-type', '')
            if 'text/html' in ct:
                return api_error('Sheet is not public — set sharing to "Anyone with the link can view"', 403)

            text = r.content.decode('utf-8').lstrip('﻿')
            rows = list(csv.reader(io.StringIO(text)))

            if not rows:
                break

            if first_page:
                csv_header = rows[0]
                data_rows = rows[1:]
                first_page = False
            else:
                # gviz/tq always includes the header row on every paginated response
                data_rows = rows[1:]

            all_data_rows.extend(data_rows)

            if len(data_rows) < PAGE_SIZE:
                break

            offset += PAGE_SIZE

        out = io.StringIO()
        writer = csv.writer(out)
        if csv_header:
            writer.writerow(csv_header)
        writer.writerows(all_data_rows)

        return Response(
            out.getvalue().encode('utf-8'),
            content_type='text/csv; charset=utf-8',
        )
    except req_lib.exceptions.Timeout:
        return api_error('Sheet fetch timed out — try again', 504)
    except req_lib.exceptions.HTTPError as e:
        return api_error(f'Could not fetch sheet ({e.response.status_code})', 502)
    except Exception as e:
        return api_error(f'Could not fetch sheet: {str(e)}', 502)


@bp.route('/sheets/<username>', methods=['POST'])
def sync_sheets(username):
    from database import get_db

    body = request.get_json(silent=True) or {}
    url = body.get('url', '').strip()
    if not url:
        return api_error('No URL provided')

    m = re.search(r'/spreadsheets/d/([a-zA-Z0-9_-]+)', url)
    if not m:
        return api_error('Invalid Google Sheets URL')
    sheet_id = m.group(1)
    gid_m = re.search(r'[?&]gid=(\d+)', url)
    gid = gid_m.group(1) if gid_m else '0'
    csv_url = f'https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid}'

    try:
        r = req_lib.get(csv_url, timeout=30)
        r.raise_for_status()
        content = r.content
    except Exception as e:
        return api_error(f'Could not fetch sheet: {str(e)}')

    try:
        scrobbles = parse_csv(content)
    except Exception as e:
        return api_error(f'Could not parse sheet: {str(e)}')

    db = get_db()
    user_id = get_or_create_user(db, username)
    count = insert_scrobbles(db, user_id, scrobbles)
    return jsonify({'synced': count, 'total': len(scrobbles)})


# ── PRE-PARSED ROWS ───────────────────────────────────────────────

@bp.route('/rows/<username>', methods=['POST'])
def sync_rows(username):
    from database import get_db

    try:
        body = request.get_json(silent=True) or {}
        rows = body.get('rows', [])
        if not isinstance(rows, list) or not rows:
            return api_error('No rows provided')

        scrobbles = []
        for row in rows:
            if not isinstance(row, dict):
                continue
            artist = str(row.get('artist', '') or '').strip()
            track  = str(row.get('track',  '') or '').strip()
            album  = str(row.get('album',  '') or '').strip()
            ts     = str(row.get('scrobbled_at', '') or '').strip()
            if artist and track and ts:
                scrobbles.append({'artist': artist, 'album': album, 'track': track, 'scrobbled_at': ts})

        db = get_db()
        user_id = get_or_create_user(db, username)
        count = insert_scrobbles(db, user_id, scrobbles)
        return jsonify({'synced': count, 'total': len(scrobbles)})
    except Exception as e:
        return api_error(f'Server error: {str(e)}', 500)


# ── STATUS ────────────────────────────────────────────────────────

@bp.route('/status/<username>', methods=['GET'])
def sync_status(username):
    from database import get_db
    db = get_db()

    result = db.table('dc_users').select('id').eq('lastfm_username', username).execute()
    if not result.data:
        return jsonify({'scrobbles': 0, 'latest': None, 'earliest': None})
    user_id = result.data[0]['id']

    count_r = (db.table('dc_scrobbles').select('id', count='exact')
               .eq('user_id', user_id).execute())
    latest_r = (db.table('dc_scrobbles').select('scrobbled_at')
                .eq('user_id', user_id).order('scrobbled_at', desc=True).limit(1).execute())
    earliest_r = (db.table('dc_scrobbles').select('scrobbled_at')
                  .eq('user_id', user_id).order('scrobbled_at').limit(1).execute())

    return jsonify({
        'scrobbles': count_r.count or 0,
        'latest': latest_r.data[0]['scrobbled_at'] if latest_r.data else None,
        'earliest': earliest_r.data[0]['scrobbled_at'] if earliest_r.data else None,
    })
