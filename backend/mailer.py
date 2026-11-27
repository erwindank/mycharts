from flask import Blueprint, request, jsonify
from html import escape
import os
import threading
import time
import resend

from auth import signed_in_user, rate_limited, client_ip


bp = Blueprint('email', __name__)

# How new an account must be to get the welcome mail (15 minutes)
WELCOME_WINDOW_MS = 15 * 60 * 1000
# Accounts already welcomed by this server process
_sent_to = set()
_sent_lock = threading.Lock()

WELCOME_HTML = """<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <tr>
            <td style="background:#08121e;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              <div style="font-size:26px;color:#4aacff;letter-spacing:-0.5px;font-weight:bold;">dankcharts.fm</div>
              <div style="color:#7aa0d0;font-size:13px;margin-top:6px;">Your listening history. Your charts. Your legacy.</div>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;padding:40px;">
              <p style="margin:0 0 16px;font-size:17px;color:#1a2a3a;">Hey {{NAME}},</p>
              <p style="margin:0 0 24px;font-size:15px;color:#3a4a5a;line-height:1.75;">Welcome to <strong>dankcharts.fm</strong>! You now have a personal music chart dashboard that visualizes your complete listening history — every artist, album, and track you've ever played, all in one place.</p>

              <h2 style="margin:0 0 16px;font-size:15px;font-weight:700;color:#1a2a3a;text-transform:uppercase;letter-spacing:0.06em;border-bottom:2px solid #e8f0f8;padding-bottom:10px;">Three ways to bring in your music</h2>

              <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;width:100%;">
                <tr>
                  <td style="padding:18px 20px;background:#f8fafc;border-radius:8px;border-left:3px solid #4aacff;">
                    <div style="font-size:22px;margin-bottom:8px;">&#128202;</div>
                    <div style="font-size:15px;font-weight:600;color:#1a2a3a;margin-bottom:6px;">Google Sheets</div>
                    <div style="font-size:14px;color:#5a6a7a;line-height:1.65;margin-bottom:12px;">Your full listening history, your way — no limits, no API restrictions. Every song you've ever played lives in a spreadsheet you fully own and control. Last.fm tracks your plays automatically and writes them to the sheet in real time.</div>
                    <a href="https://dankcharts.fm/setup-guide.html?tab=sheets" style="font-size:13px;color:#4aacff;text-decoration:none;font-weight:500;margin-right:16px;">&#128196; Google Sheets setup guide &rarr;</a>
                    <a href="https://docs.google.com/spreadsheets/d/19brQQYXn1WQNhCkSMCYnGVYmxhmLzKOE2A3E3QFCeqk/copy" style="font-size:13px;color:#4aacff;text-decoration:none;font-weight:500;">Copy our ready-to-use template &rarr;</a>
                  </td>
                </tr>
              </table>

              <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;width:100%;">
                <tr>
                  <td style="padding:18px 20px;background:#f8fafc;border-radius:8px;border-left:3px solid #4aacff;">
                    <div style="font-size:22px;margin-bottom:8px;">&#127925;</div>
                    <div style="font-size:15px;font-weight:600;color:#1a2a3a;margin-bottom:6px;">Last.fm Scrobbling</div>
                    <div style="font-size:14px;color:#5a6a7a;line-height:1.65;margin-bottom:12px;">Last.fm automatically tracks every song you listen to across Spotify, Apple Music, YouTube Music, Tidal, Deezer, Amazon Music, and many more. Connect it once and your history grows automatically, forever.</div>
                    <a href="https://dankcharts.fm/setup-guide.html?tab=lastfm" style="font-size:13px;color:#4aacff;text-decoration:none;font-weight:500;margin-right:16px;">&#128196; Last.fm setup guide &rarr;</a>
                    <a href="https://www.last.fm/join" style="font-size:13px;color:#4aacff;text-decoration:none;font-weight:500;">Create a free Last.fm account &rarr;</a>
                  </td>
                </tr>
              </table>

              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;width:100%;">
                <tr>
                  <td style="padding:18px 20px;background:#f8fafc;border-radius:8px;border-left:3px solid #4aacff;">
                    <div style="font-size:22px;margin-bottom:8px;">&#128194;</div>
                    <div style="font-size:15px;font-weight:600;color:#1a2a3a;margin-bottom:6px;">File Upload</div>
                    <div style="font-size:14px;color:#5a6a7a;line-height:1.65;">Got an existing export? Import directly from a CSV, Last.fm export file, Spotify ZIP, or Deezer XLSX — no extra setup needed.</div>
                  </td>
                </tr>
              </table>

              <div style="text-align:center;margin:32px 0;">
                <a href="https://dankcharts.fm" style="display:inline-block;background:#4aacff;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:8px;">Go to dankcharts.fm &rarr;</a>
              </div>

              <p style="margin:24px 0 0;font-size:14px;color:#7a8a9a;line-height:1.7;">Questions or need help getting set up? Just reply to this email or reach out at <a href="mailto:support@dankcharts.fm" style="color:#4aacff;text-decoration:none;">support@dankcharts.fm</a> — happy to help.</p>
              <p style="margin:20px 0 0;font-size:15px;color:#3a4a5a;">Happy charting,<br><strong>Erwin @ dankcharts.fm</strong></p>
            </td>
          </tr>

          <tr>
            <td style="background:#f0f4f8;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9aabbb;">dankcharts.fm &middot; Your personal music charts &middot; <a href="https://dankcharts.fm/terms.html" style="color:#9aabbb;text-decoration:none;">Terms &amp; Privacy</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


@bp.route('/send-welcome', methods=['POST'])
def send_welcome():
    """Send the welcome mail to the account that just signed up.

    Security fix 2026-11-27: this used to send to whatever address and name the
    request gave, so anyone could use it to send our mail (with their own text
    in the name) to anyone. Now it needs the new account's sign-in token, sends
    only to that account's own address, only while the account is new, and
    only once per account. The name is escaped so it can't add HTML.
    """
    api_key = os.environ.get('RESEND_API_KEY', '')
    if not api_key:
        return jsonify({'error': 'email service not configured'}), 503

    # A script hammering this from one place gets stopped before we even ask Firebase
    if rate_limited('welcome-ip:' + client_ip(), 5, 3600):
        return jsonify({'error': 'too many requests'}), 429

    user = signed_in_user()
    if not user:
        return jsonify({'error': 'sign in required'}), 401

    to_email = (user.get('email') or '').strip()
    if not to_email or '@' not in to_email or not user.get('email_verified'):
        return jsonify({'error': 'no verified email on this account'}), 400

    # Only for accounts made in the last 15 minutes (the site calls this right
    # after the first sign-in), so an old account can't be used to resend it
    if not user.get('created_ms') or time.time() * 1000 - user['created_ms'] > WELCOME_WINDOW_MS:
        return jsonify({'error': 'account is not new'}), 403

    # Once per account (per server process; the 15-minute window covers restarts)
    with _sent_lock:
        if user['uid'] in _sent_to:
            return jsonify({'ok': True, 'already': True})
        _sent_to.add(user['uid'])

    data = request.get_json(silent=True) or {}
    display_name = str(data.get('displayName') or '').strip()
    first_name = display_name.split()[0][:40] if display_name else 'there'
    # Escaped: a name like <a href=...> shows as text, never as a link
    html = WELCOME_HTML.replace('{{NAME}}', escape(first_name))

    resend.api_key = api_key
    try:
        resend.Emails.send({
            'from': 'hello@dankcharts.fm',
            'to': [to_email],
            'subject': 'Welcome to dankcharts.fm!',
            'html': html,
        })
        return jsonify({'ok': True})
    except Exception:
        with _sent_lock:
            _sent_to.discard(user['uid'])   # let a retry try again
        return jsonify({'error': 'could not send'}), 500
