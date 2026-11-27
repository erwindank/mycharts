from flask import Blueprint, jsonify, request
import os
import requests

from auth import signed_in_user, rate_limited, client_ip

bp = Blueprint('youtube', __name__, url_prefix='/api/youtube')

YOUTUBE_API_KEY = os.environ.get('YOUTUBE_API_KEY', '')

# Security fix 2026-11-27: the whole site shares ~100 searches a day, and this
# used to answer anyone on the internet, so one script could use them all up.
# Now a search needs a signed-in account (the site already asks signed-out
# visitors to sign in first), and each account and each IP has a cap.
PER_ACCOUNT_PER_HOUR = 40
PER_IP_PER_HOUR = 80


@bp.route('/search', methods=['GET'])
def search():
    q = request.args.get('q', '').strip()
    if not q:
        return jsonify({'error': 'Missing query'}), 400
    if len(q) > 300:
        return jsonify({'error': 'Query too long'}), 400
    if rate_limited('yt-ip:' + client_ip(), PER_IP_PER_HOUR, 3600):
        return jsonify({'error': 'Too many searches, try again later'}), 429
    user = signed_in_user()
    if not user:
        return jsonify({'error': 'Sign in to search YouTube'}), 401
    if rate_limited('yt-uid:' + user['uid'], PER_ACCOUNT_PER_HOUR, 3600):
        return jsonify({'error': 'Too many searches, try again later'}), 429
    if not YOUTUBE_API_KEY:
        return jsonify({'error': 'YouTube API not configured'}), 503

    try:
        resp = requests.get(
            'https://www.googleapis.com/youtube/v3/search',
            params={
                'part': 'snippet',
                'type': 'video',
                'q': q,
                'maxResults': 5,
                'videoCategoryId': '10',
                'key': YOUTUBE_API_KEY,
            },
            timeout=8,
        )
        data = resp.json()
        if 'error' in data:
            return jsonify({'error': data['error'].get('message', 'API error')}), 502
        items = data.get('items') or []
        video_ids = [item.get('id', {}).get('videoId') for item in items if item.get('id', {}).get('videoId')]
        if not video_ids:
            return jsonify({'error': 'No results'}), 404

        # Check which results allow embedding
        status_resp = requests.get(
            'https://www.googleapis.com/youtube/v3/videos',
            params={'part': 'status', 'id': ','.join(video_ids), 'key': YOUTUBE_API_KEY},
            timeout=8,
        )
        embeddable = {
            v['id'] for v in (status_resp.json().get('items') or [])
            if v.get('status', {}).get('embeddable')
        }
        for vid in video_ids:
            if vid in embeddable:
                return jsonify({'videoId': vid})
        # All restricted — return first result and let client retry
        return jsonify({'videoId': video_ids[0]})
    except Exception:
        # No error text back: it could include the request URL with our API key
        return jsonify({'error': 'Search failed'}), 500
