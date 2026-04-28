"""
Spotify OAuth module.

IMPORTANT - Development Mode limit (as of Feb 2026):
  Only 5 users total can authorize this app until you apply for Extended Quota Mode.
  Apply at: https://developer.spotify.com/documentation/web-api/concepts/quota-modes
  Spotify will ask for a working product, so build Last.fm features first.
"""
from flask import Blueprint, jsonify, request, redirect
import requests
import os
import base64
import secrets

bp = Blueprint('spotify', __name__, url_prefix='/api/spotify')

CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
REDIRECT_URI = os.getenv('SPOTIFY_REDIRECT_URI')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'https://dankcharts.fm')

AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
API_BASE = 'https://api.spotify.com/v1'

SCOPES = 'user-read-recently-played user-top-read user-read-private'


def _basic_auth_header():
    credentials = f'{CLIENT_ID}:{CLIENT_SECRET}'.encode()
    return 'Basic ' + base64.b64encode(credentials).decode()


@bp.route('/login')
def login():
    """Returns the Spotify authorization URL for the frontend to redirect to."""
    state = secrets.token_hex(16)
    params = (
        f'client_id={CLIENT_ID}'
        f'&response_type=code'
        f'&redirect_uri={REDIRECT_URI}'
        f'&state={state}'
        f'&scope={SCOPES.replace(" ", "%20")}'
    )
    return jsonify({'auth_url': f'{AUTH_URL}?{params}', 'state': state})


@bp.route('/callback')
def callback():
    """Spotify redirects here after user authorizes. Exchanges code for tokens."""
    error = request.args.get('error')
    if error:
        return redirect(f'{FRONTEND_URL}?spotify_error={error}')

    code = request.args.get('code')
    r = requests.post(TOKEN_URL, data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
    }, headers={
        'Authorization': _basic_auth_header(),
        'Content-Type': 'application/x-www-form-urlencoded',
    }, timeout=10)

    if not r.ok:
        return jsonify({'error': 'Token exchange failed', 'detail': r.text}), 400

    tokens = r.json()
    # TODO: save tokens['access_token'] and tokens['refresh_token'] to database
    # linked to the user, then redirect to frontend with a session token
    return jsonify(tokens)


@bp.route('/recent')
def recent_tracks():
    """Fetch recently played tracks. Requires a valid access token."""
    # TODO: retrieve stored access token for authenticated user
    # For now this is a placeholder showing what the response shape will be
    return jsonify({'message': 'Not yet implemented — requires user authentication'}), 501
