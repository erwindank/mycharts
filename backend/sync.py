from flask import Blueprint, jsonify, request, Response
import io
import csv
import re
import urllib.parse
import requests as req_lib

bp = Blueprint('sync', __name__, url_prefix='/api/sync')


def api_error(message, status=400):
    return jsonify({'error': message}), status


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
