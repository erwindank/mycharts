from flask import Blueprint, jsonify, request
import datetime
import zipfile
import io
import json
import csv
import os
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


def parse_dt_str(s):
    if not s:
        return None
    s = str(s).strip()
    if s.isdigit() and len(s) >= 10:
        return ts_to_iso(int(s))
    formats = [
        '%Y-%m-%dT%H:%M:%SZ',
        '%Y-%m-%dT%H:%M:%S.%fZ',
        '%Y-%m-%dT%H:%M:%S',
        '%Y-%m-%d %H:%M:%S',
        '%d %b %Y, %H:%M',
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

@bp.route('/sheets/<username>', methods=['POST'])
def sync_sheets(username):
    from database import get_db
    import re

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
