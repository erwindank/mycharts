"""Sign-in check and simple rate limits for the API (security fix 2026-11-27).

Before this, anyone on the internet could call /send-welcome (send our welcome
mail, with any name in it, to any address — free spam/phishing from
hello@dankcharts.fm) and /api/youtube/search (burn the site's shared ~100
searches a day). Now both need a real dankcharts.fm account.

How the check works: the site sends the Firebase sign-in token of the account
(`Authorization: Bearer <idToken>`), and we ask Firebase who it belongs to with
the accounts:lookup call. That needs no extra package and no service account,
only the site's Firebase web key, which is public anyway (it is in firebase.js).
"""

import os
import threading
import time

import requests
from flask import request

# The same key as dankcharts/firebase.js. It only identifies the Firebase
# project; it is not a secret. FIREBASE_API_KEY on Render overrides it.
FIREBASE_API_KEY = os.environ.get('FIREBASE_API_KEY', 'AIzaSyAftPCYx8Ja3z8n-gYAM5iDhJI_NfHwgTY')
LOOKUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup'

_lock = threading.Lock()
# token → (account, expires at). A sign-in token lives an hour; we trust a
# checked one for 5 minutes so each YouTube search doesn't ask Firebase again.
_token_cache = {}
TOKEN_CACHE_SECONDS = 300
# bucket key → list of request times, for rate_limited()
_hits = {}


def signed_in_user():
    """The Firebase account behind this request, or None.

    Returns a dict with uid, email, email_verified and created_ms (when the
    account was made, in milliseconds since 1970).
    """
    header = request.headers.get('Authorization', '')
    if not header.startswith('Bearer '):
        return None
    token = header[7:].strip()
    if not token or len(token) > 4096:
        return None

    now = time.time()
    with _lock:
        hit = _token_cache.get(token)
        if hit and hit[1] > now:
            return hit[0]

    try:
        r = requests.post(LOOKUP_URL, params={'key': FIREBASE_API_KEY},
                          json={'idToken': token}, timeout=8)
        if r.status_code != 200:
            return None
        users = r.json().get('users') or []
        if not users:
            return None
        u = users[0]
        account = {
            'uid': u.get('localId', ''),
            'email': u.get('email', ''),
            'email_verified': bool(u.get('emailVerified')),
            'created_ms': int(u.get('createdAt') or 0),
        }
        if not account['uid']:
            return None
    except Exception:
        return None

    with _lock:
        # Keep the cache small: drop expired entries when it grows
        if len(_token_cache) > 5000:
            for k in [k for k, v in _token_cache.items() if v[1] <= now]:
                _token_cache.pop(k, None)
        _token_cache[token] = (account, now + TOKEN_CACHE_SECONDS)
    return account


def client_ip():
    """The visitor's IP. Render puts the real one first in X-Forwarded-For."""
    fwd = request.headers.get('X-Forwarded-For', '')
    return (fwd.split(',')[0].strip() if fwd else '') or (request.remote_addr or '?')


def rate_limited(key, limit, per_seconds):
    """True when `key` has already made `limit` requests in the last
    `per_seconds`; otherwise counts this one and returns False.

    Kept in memory, so each server process counts on its own and a restart
    starts over. That's fine for stopping scripts that hammer the API.
    """
    now = time.time()
    with _lock:
        times = [t for t in _hits.get(key, []) if t > now - per_seconds]
        if len(times) >= limit:
            _hits[key] = times
            return True
        times.append(now)
        _hits[key] = times
        # Every so often forget keys that have gone quiet
        if len(_hits) > 20000:
            for k in [k for k, v in _hits.items() if not v or v[-1] < now - 86400]:
                _hits.pop(k, None)
    return False
