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
                'maxResults': 1,
                'videoCategoryId': '10',
                'key': YOUTUBE_API_KEY,
            },
            timeout=8,
        )
        data = resp.json()
        if 'error' in data:
            return jsonify({'error': data['error'].get('message', 'API error')}), 502
        video_id = (data.get('items') or [{}])[0].get('id', {}).get('videoId')
        if not video_id:
            return jsonify({'error': 'No results'}), 404
        return jsonify({'videoId': video_id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
