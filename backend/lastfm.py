from flask import Blueprint, jsonify, request
import requests
import os

bp = Blueprint('lastfm', __name__, url_prefix='/api/lastfm')

LASTFM_API_KEY = os.getenv('LASTFM_API_KEY')
LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/'


def lastfm_get(method, params=None):
    if params is None:
        params = {}
    all_params = {
        'method': method,
        'api_key': LASTFM_API_KEY,
        'format': 'json',
        **params,
    }
    r = requests.get(LASTFM_BASE_URL, params=all_params, timeout=10)
    r.raise_for_status()
    data = r.json()
    if 'error' in data:
        raise ValueError(data.get('message', 'Last.fm API error'))
    return data


def api_error(message, status=400):
    return jsonify({'error': message}), status


@bp.route('/user/<username>')
def user_info(username):
    try:
        data = lastfm_get('user.getInfo', {'user': username})
        user = data.get('user', {})
        try:
            from database import get_db
            import datetime
            db = get_db()
            registered_ts = user.get('registered', {}).get('unixtime')
            db.table('dc_users').upsert({
                'lastfm_username': user.get('name', username),
                'playcount': int(user.get('playcount', 0)),
                'registered_at': datetime.datetime.fromtimestamp(int(registered_ts), tz=datetime.timezone.utc).isoformat() if registered_ts else None,
                'last_seen_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            }, on_conflict='lastfm_username').execute()
        except Exception:
            pass
        return jsonify(data)
    except ValueError as e:
        return api_error(str(e))
    except requests.RequestException:
        return api_error('Could not reach Last.fm', 502)


@bp.route('/recenttracks/<username>')
def recent_tracks_paged(username):
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 200, type=int)
    from_ts = request.args.get('from', type=int)
    params = {'user': username, 'limit': min(limit, 200), 'page': page, 'extended': 0}
    if from_ts:
        params['from'] = from_ts
    try:
        return jsonify(lastfm_get('user.getRecentTracks', params))
    except ValueError as e:
        return api_error(str(e))
    except requests.RequestException:
        return api_error('Could not reach Last.fm', 502)


@bp.route('/recent/<username>')
def recent_tracks(username):
    limit = request.args.get('limit', 200)
    try:
        return jsonify(lastfm_get('user.getRecentTracks', {
            'user': username,
            'limit': limit,
            'extended': 1,
        }))
    except ValueError as e:
        return api_error(str(e))
    except requests.RequestException:
        return api_error('Could not reach Last.fm', 502)


@bp.route('/top/artists/<username>')
def top_artists(username):
    period = request.args.get('period', '7day')
    limit = request.args.get('limit', 50)
    try:
        return jsonify(lastfm_get('user.getTopArtists', {
            'user': username,
            'period': period,
            'limit': limit,
        }))
    except ValueError as e:
        return api_error(str(e))
    except requests.RequestException:
        return api_error('Could not reach Last.fm', 502)


@bp.route('/top/tracks/<username>')
def top_tracks(username):
    period = request.args.get('period', '7day')
    limit = request.args.get('limit', 50)
    try:
        return jsonify(lastfm_get('user.getTopTracks', {
            'user': username,
            'period': period,
            'limit': limit,
        }))
    except ValueError as e:
        return api_error(str(e))
    except requests.RequestException:
        return api_error('Could not reach Last.fm', 502)


@bp.route('/top/albums/<username>')
def top_albums(username):
    period = request.args.get('period', '7day')
    limit = request.args.get('limit', 50)
    try:
        return jsonify(lastfm_get('user.getTopAlbums', {
            'user': username,
            'period': period,
            'limit': limit,
        }))
    except ValueError as e:
        return api_error(str(e))
    except requests.RequestException:
        return api_error('Could not reach Last.fm', 502)


@bp.route('/weekly/charts/<username>')
def weekly_chart_list(username):
    try:
        return jsonify(lastfm_get('user.getWeeklyChartList', {'user': username}))
    except ValueError as e:
        return api_error(str(e))
    except requests.RequestException:
        return api_error('Could not reach Last.fm', 502)


@bp.route('/weekly/artists/<username>')
def weekly_artists(username):
    from_ts = request.args.get('from')
    to_ts = request.args.get('to')
    params = {'user': username}
    if from_ts:
        params['from'] = from_ts
    if to_ts:
        params['to'] = to_ts
    try:
        return jsonify(lastfm_get('user.getWeeklyArtistChart', params))
    except ValueError as e:
        return api_error(str(e))
    except requests.RequestException:
        return api_error('Could not reach Last.fm', 502)


@bp.route('/weekly/tracks/<username>')
def weekly_tracks(username):
    from_ts = request.args.get('from')
    to_ts = request.args.get('to')
    params = {'user': username}
    if from_ts:
        params['from'] = from_ts
    if to_ts:
        params['to'] = to_ts
    try:
        return jsonify(lastfm_get('user.getWeeklyTrackChart', params))
    except ValueError as e:
        return api_error(str(e))
    except requests.RequestException:
        return api_error('Could not reach Last.fm', 502)


@bp.route('/weekly/albums/<username>')
def weekly_albums(username):
    from_ts = request.args.get('from')
    to_ts = request.args.get('to')
    params = {'user': username}
    if from_ts:
        params['from'] = from_ts
    if to_ts:
        params['to'] = to_ts
    try:
        return jsonify(lastfm_get('user.getWeeklyAlbumChart', params))
    except ValueError as e:
        return api_error(str(e))
    except requests.RequestException:
        return api_error('Could not reach Last.fm', 502)
