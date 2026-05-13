from flask import Blueprint, jsonify, request
import os
import requests

bp = Blueprint('youtube', __name__, url_prefix='/api/youtube')

YOUTUBE_API_KEY = os.environ.get('YOUTUBE_API_KEY', '')


@bp.route('/search', methods=['GET'])
def search():
    q = request.args.get('q', '').strip()
    if not q:
        return jsonify({'error': 'Missing query'}), 400
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
    except Exception as e:
        return jsonify({'error': str(e)}), 500
