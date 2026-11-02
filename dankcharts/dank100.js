/* ===========================================================================
   THE DANK 100 - EVERYONE'S WEEKLY CHARTS ADDED UP INTO ONE
   ===========================================================================
   Plan: DANK100-PLAN.md (repo root). Step 1 is the data side (the week,
   match keys, building and saving an entry); step 2 is the Dank 100 tab with
   the send-in card and the auto-send switch in Settings → Charts; step 4 is
   the chart itself, read from the Cloudflare Function (functions/dank100);
   step 5 older weeks, runs and number ones; step 6 records and the share card.

   Every listener can send in their own chart for a week. A Cloudflare Function
   (step 3) adds all the entries up into The Dank 100 (songs), Dank 100 Artists
   and Dank 100 Albums. Points come from your chart position (#1 = 100 points,
   #100 = 1), never from raw play counts, so one heavy listener can't take over.

   The week
     Everyone shares one tracking week: Friday 00:00 UTC to Thursday 23:59 UTC,
     whatever their own week start day and time zone are. A week is named by
     the date of its Friday, e.g. "2026-10-30". Entries for a week can be sent
     or updated until the Sunday after it ends (GRACE_DAYS); the chart is built
     on the Monday.

   The entry
     dank100Entries/{week}_{uid}
       uid, week, weekStart (Timestamp of the Friday), updatedAt (server time),
       v (shape version), plays (all plays that week),
       songs   [{ k, t, a, n }]   up to 100, best first
       artists [{ k, t, n }]      up to 100
       albums  [{ k, t, a, n }]   up to 100
     k = match key, t = title/name, a = artist, n = plays that week.
     Order is the rank. n is kept so the server can give tied plays equal points.

   It is built from allPlays, which every data source (Last.fm, Google Sheets,
   CSV) fills the same way, with the user's autocorrect rules already applied
   when the plays were loaded (applyAutocorrectRules in app.js).

   Only the user can read their own entry; only the combined chart will be
   public. firestore.rules enforces that, and must be pasted into
   Firebase Console → Firestore → Rules after changing it.

   firebase.js keeps _currentUser and _ensureDb() as top-level script globals,
   and app.js keeps allPlays, msOf() and albumArtist(); this file reads them
   directly, the same way board.js does.
   =========================================================================== */

(function () {
  // ── Constants ──────────────────────────────────────────────────────────────
  // Kept in step with the checks in firestore.rules (dank100Entries).
  var MAX_ROWS   = 100;
  var GRACE_DAYS = 3;          // Fri–Thu week, then Fri/Sat/Sun to send it in
  var WEEK_START_DOW = 5;      // Friday (Date#getUTCDay numbering)
  var DAY_MS  = 86400000;
  var WEEK_MS = 7 * DAY_MS;
  var ENTRY_VERSION = 1;
  // Longest title/name stored per row, so one odd tag can't bloat the doc.
  var MAX_TEXT = 200;

  // ── The week ───────────────────────────────────────────────────────────────

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  // The Friday 00:00 UTC that starts the tracking week holding `date`.
  function weekStartOf(date) {
    var d = new Date(date);
    var back = (d.getUTCDay() - WEEK_START_DOW + 7) % 7;
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - back));
  }

  // "2026-10-30" for the week holding `date`.
  function weekIdOf(date) {
    var s = weekStartOf(date);
    return s.getUTCFullYear() + '-' + pad2(s.getUTCMonth() + 1) + '-' + pad2(s.getUTCDate());
  }

  // Start (inclusive) and end (exclusive) of a week, plus when sending closes.
  function weekBounds(weekId) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(weekId || '');
    if (!m) return null;
    var start = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    if (start.getUTCDay() !== WEEK_START_DOW || weekIdOf(start) !== weekId) return null;
    return {
      id: weekId,
      start: start,
      end: new Date(+start + WEEK_MS),
      closes: new Date(+start + WEEK_MS + GRACE_DAYS * DAY_MS)
    };
  }

  // Weeks an entry can still be sent for right now: the running week, and the
  // one before it during Fri–Sun. Newest first.
  function openWeeks(now) {
    now = now ? new Date(now) : new Date();
    var cur = weekIdOf(now);
    var out = [cur];
    var prev = weekBounds(weekIdOf(new Date(+weekBounds(cur).start - DAY_MS)));
    if (now < prev.closes) out.push(prev.id);
    return out;
  }

  // ── Match keys ─────────────────────────────────────────────────────────────
  // Two people's "Beyoncé" and "Beyonce", or "Song (feat. X)" and "Song",
  // must land on the same row. The key is only for matching; the chart shows
  // the spelling most entries used.

  function baseKey(s) {
    return String(s || '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')   // accents off
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9À-￿]+/g, ' ')            // punctuation → space
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Titles also lose "(feat. X)", "[with X]" and a trailing " ft. X".
  function titleKey(s) {
    var t = String(s || '')
      .replace(/\s*[\(\[]\s*(feat\.?|ft\.?|featuring|with)\s[^\)\]]*[\)\]]/gi, '')
      .replace(/\s+(feat\.?|ft\.?|featuring)\s.*$/i, '');
    return baseKey(t) || baseKey(s);
  }

  function songMatchKey(title, artist)  { return titleKey(title) + '|' + baseKey(artist); }
  function albumMatchKey(album, artist) { return titleKey(album) + '|' + baseKey(artist); }

  // ── Building an entry ──────────────────────────────────────────────────────

  function clip(s) { s = String(s || ''); return s.length > MAX_TEXT ? s.slice(0, MAX_TEXT) : s; }

  // Adds one play to a tally keyed by match key. Each row also counts how
  // often each spelling was used, so the entry keeps the user's most common one.
  function tally(map, key, title, artist, ms) {
    var r = map[key];
    if (!r) r = map[key] = { k: key, n: 0, last: 0, spell: {} };
    r.n++;
    if (ms > r.last) r.last = ms;
    var sp = title + '\u0000' + (artist || '');
    r.spell[sp] = (r.spell[sp] || 0) + 1;
  }

  // Most plays first; equal plays go to the one played more recently, then
  // by key so the order never depends on the order plays were loaded in.
  function ranked(map, withArtist) {
    var rows = Object.keys(map).map(function (k) { return map[k]; });
    rows.sort(function (a, b) {
      return (b.n - a.n) || (b.last - a.last) || (a.k < b.k ? -1 : a.k > b.k ? 1 : 0);
    });
    return rows.slice(0, MAX_ROWS).map(function (r) {
      var best = '', bestN = -1;
      for (var sp in r.spell) if (r.spell[sp] > bestN) { best = sp; bestN = r.spell[sp]; }
      var parts = best.split('\u0000');
      var row = { k: r.k, t: clip(parts[0]) };
      if (withArtist) row.a = clip(parts[1]);
      row.n = r.n;
      return row;
    });
  }

  // The user's chart for one Dank 100 week. `plays` defaults to allPlays;
  // passing a list in is how the node test drives it.
  function buildEntry(weekId, plays) {
    var b = weekBounds(weekId);
    if (!b) throw new Error('dank100: bad week id ' + weekId);
    plays = plays || (typeof allPlays !== 'undefined' ? allPlays : []);
    var from = +b.start, to = +b.end;
    // msOf() is the play's real instant (no time-zone shift), which is what a
    // UTC week needs. Outside app.js (the test) fall back to the Date itself.
    var msFn = typeof msOf === 'function' ? msOf : function (p) { return +p.date; };
    var aaFn = typeof albumArtist === 'function' ? albumArtist
      : function (p) { return (p.artists && p.artists[0]) || p.artist; };

    var songs = {}, artists = {}, albums = {}, count = 0;
    for (var i = 0; i < plays.length; i++) {
      var p = plays[i];
      var ms = msFn(p);
      if (!(ms >= from && ms < to) || !p.title || !p.artist) continue;
      count++;
      // A song is credited to its lead artist so "A & B" and "A feat. B" match.
      var lead = (p.artists && p.artists[0]) || p.artist;
      tally(songs, songMatchKey(p.title, lead), p.title, p.artist, ms);
      // Every credited artist gets the play, as on the site's own artist chart.
      var credits = (p.artists && p.artists.length) ? p.artists : [p.artist];
      for (var j = 0; j < credits.length; j++) {
        if (credits[j]) tally(artists, baseKey(credits[j]), credits[j], '', ms);
      }
      if (p.album && p.album !== '—') {
        var aa = aaFn(p);
        tally(albums, albumMatchKey(p.album, aa), p.album, aa, ms);
      }
    }

    return {
      week: weekId,
      weekStart: b.start,
      v: ENTRY_VERSION,
      plays: count,
      songs: ranked(songs, true),
      artists: ranked(artists, false),
      albums: ranked(albums, true)
    };
  }

  // ── History weeks ("Send my year") ─────────────────────────────────────────
  // Every closed week of 2026 can be sent in one go until 30 Nov: the weeks
  // before the first live week, and since 2026-11-01 also the live weeks that
  // have already closed, so someone joining late still gets those counted.
  // Those charts are recounted each time someone sends theirs (the function
  // recounts every week after /dank100/dirty), then fixed. Kept in step with
  // functions/dank100 and firestore.rules.
  var HISTORY_FIRST = '2026-01-02';
  var HISTORY_LAST = '2026-10-16';                // last week before the live ones
  var HISTORY_CLOSES = Date.UTC(2026, 11, 1);     // 1 Dec 2026 00:00 UTC

  function historyOpen() { return Date.now() < HISTORY_CLOSES; }
  // Any closed week from 2 Jan on (latestClosedWeek is further down; hoisted)
  function isHistoryWeek(w) { return w >= HISTORY_FIRST && w <= latestClosedWeek(); }
  function nextWeek(w) { return weekIdOf(new Date(+weekBounds(w).start + 7 * DAY_MS)); }
  function historyWeeks() {
    var out = [], last = latestClosedWeek();
    for (var w = HISTORY_FIRST; w <= last; w = nextWeek(w)) out.push(w);
    return out;
  }
  // A week an entry may be sent (or replaced) for right now.
  function canSend(w) { return openWeeks().indexOf(w) >= 0 || (isHistoryWeek(w) && historyOpen()); }

  // ── Firestore ──────────────────────────────────────────────────────────────

  function signedInUid() {
    return (typeof _currentUser !== 'undefined' && _currentUser) ? _currentUser.uid : null;
  }
  function entryRef(db, weekId, uid) { return db.collection('dank100Entries').doc(weekId + '_' + uid); }

  // Sends (or replaces) the signed-in user's entry for a week that is still
  // open. Resolves to the entry that was saved.
  function sendEntry(weekId) {
    var uid = signedInUid();
    if (!uid) return Promise.reject(new Error('signed-out'));
    if (!canSend(weekId)) return Promise.reject(new Error('week-closed'));
    var e = buildEntry(weekId);
    if (!e.plays) return Promise.reject(new Error('no-plays'));
    return _ensureDb().then(function (db) {
      var doc = {
        uid: uid,
        week: e.week,
        weekStart: firebase.firestore.Timestamp.fromDate(e.weekStart),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        v: e.v,
        plays: e.plays,
        songs: e.songs,
        artists: e.artists,
        albums: e.albums
      };
      return entryRef(db, weekId, uid).set(doc).then(function () { return e; });
    });
  }

  // The signed-in user's saved entry for a week, or null.
  function getMyEntry(weekId) {
    var uid = signedInUid();
    if (!uid) return Promise.resolve(null);
    return _ensureDb().then(function (db) {
      return entryRef(db, weekId, uid).get().then(function (s) {
        return s.exists ? s.data({ serverTimestamps: 'estimate' }) : null;
      });
    });
  }

  // Takes the user's entry back out (allowed while the week is open).
  function deleteMyEntry(weekId) {
    var uid = signedInUid();
    if (!uid) return Promise.reject(new Error('signed-out'));
    return _ensureDb().then(function (db) { return entryRef(db, weekId, uid).delete(); });
  }

  // ══ Step 2: the Dank 100 tab and sending in ═══════════════════════════════
  // The tab shows a card per open week (the running week, plus last week
  // until Sunday) with a preview of what would be sent, and Send / Update /
  // Take it back. The chart itself comes in step 4; until then a line says
  // when the next one comes out.

  var AUTO_KEY = 'dc_d100_autosend';          // '1' = send by itself (synced)
  var AUTO_EVERY_MS = 30 * 60000;             // re-send a week at most every 30 min
  // The live demo library (app.js SAMPLE_SHEET_URL) must never count.
  var SAMPLE_SHEET_ID = '1ulWuTKxreKLUWGBEI0g2d5iMgjHu6y02IFzg6A7BzVA';
  var PREVIEW_ROWS = 5;

  var TYPES = ['songs', 'artists', 'albums'];
  // Where the Cloudflare Function lives. It only runs on the real site, so a
  // local copy (Live Server, python http.server, file://) asks the live one;
  // the function answers any origin (Access-Control-Allow-Origin: *).
  var API = (typeof location !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\]|)$/.test(location.hostname)) ? 'https://dankcharts.fm' : '';
  // The chart on screen (step 4): week, data from the function, loading state
  var C = { week: null, data: null, loading: false, err: false, mine: null };

  var S = {
    active: false,     // tab on screen
    mine: {},          // weekId -> saved entry, null (none) or undefined (not looked up)
    busy: {},          // weekId -> true while sending / taking back
    err: {}            // weekId -> error message key
  };

  // ── Small helpers ──
  function tr(key, vars) {
    try { if (typeof t === 'function') return t(key, vars); } catch (e) {}
    return key;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function locale() { try { if (typeof _lsLocale === 'function') return _lsLocale(); } catch (e) {} return undefined; }
  // Weeks are UTC, so their dates are shown in UTC too (else a Friday could
  // read as Thursday west of Greenwich).
  // `opts` replaces the default "Oct 30" format when given.
  function fmtDay(d, opts) {
    var o = opts || { month: 'short', day: 'numeric' };
    o.timeZone = 'UTC';
    return new Date(d).toLocaleDateString(locale(), o);
  }
  function rangeLabel(b) { return fmtDay(b.start) + ' – ' + fmtDay(+b.end - DAY_MS); }
  // When an entry was saved, in the user's own clock ("Sat 14:05").
  function fmtWhen(ts) {
    var d = ts && typeof ts.toDate === 'function' ? ts.toDate() : (ts ? new Date(ts) : null);
    if (!d || isNaN(d)) return '';
    return d.toLocaleDateString(locale(), { weekday: 'short' }) + ' ' +
      d.toLocaleTimeString(locale(), { hour: 'numeric', minute: '2-digit' });
  }
  function playsLabel(n) {
    var unit = (typeof tUnit === 'function') ? tUnit('plays', n) : (n === 1 ? 'play' : 'plays');
    return n + ' ' + unit;
  }
  function isDemo() {
    try { return (localStorage.getItem('dc_sheet_id') || '').indexOf(SAMPLE_SHEET_ID) >= 0; } catch (e) { return false; }
  }
  function hasPlays() { return typeof allPlays !== 'undefined' && allPlays && allPlays.length > 0; }
  function autoOn() { try { return localStorage.getItem(AUTO_KEY) === '1'; } catch (e) { return false; } }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  // Per account and week: when it was last sent, and whether it was taken back
  // (auto-send must not quietly put back an entry the user removed).
  function sentKey(uid, w) { return 'dc_d100_sent_' + uid + '_' + w; }
  function backKey(uid, w) { return 'dc_d100_back_' + uid + '_' + w; }

  // The Monday 00:00 UTC a week's chart comes out (the day after sending closes).
  function chartDay(b) { return b.closes; }

  // The Settings → Charts switch mirrors the saved choice.
  function syncSwitch() {
    var el = document.getElementById('setD100Auto');
    if (el) el.checked = autoOn();
  }

  // ── Loading the user's saved entries ──
  function loadMine() {
    var uid = signedInUid();
    if (!uid) { S.mine = {}; return Promise.resolve(); }
    var weeks = openWeeks();
    return Promise.all(weeks.map(function (w) {
      return getMyEntry(w).then(function (e) { S.mine[w] = e; }, function () { S.mine[w] = null; });
    }));
  }

  // ── Rendering ──
  // The nav's podium, at page-title size
  var TITLE_ICO = '<svg class="graphs-h2-ico d100-h2-ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
    '<line x1="1.4" y1="14.2" x2="14.6" y2="14.2"/><rect x="5.9" y="7" width="4.2" height="7.2" rx="0.5"/>' +
    '<rect x="1.8" y="9.6" width="4.1" height="4.6" rx="0.5"/><rect x="10.1" y="11" width="4.1" height="3.2" rx="0.5"/>' +
    '<path d="M8 2.1l.7 1.4 1.5.2-1.1 1 .3 1.5L8 5.5l-1.4.7.3-1.5-1.1-1 1.5-.2z"/></svg>';

  function entryCardHTML(w, isLast) {
    var b = weekBounds(w);
    var e = hasPlays() ? buildEntry(w) : { plays: 0, songs: [] };
    var saved = S.mine[w];
    var u = signedInUid();
    var h = '<article class="d100-entry' + (isLast ? ' d100-entry-last' : '') + '">';
    h += '<header class="d100-entry-head"><div>' +
      '<div class="d100-entry-kicker">' + esc(tr(isLast ? 'd100_week_last' : 'd100_week_this')) + '</div>' +
      '<div class="d100-entry-range">' + esc(tr('d100_week_of', { range: rangeLabel(b) })) + '</div></div>';
    if (u && saved) {
      h += '<span class="d100-status d100-status-sent">✓ ' + esc(tr('d100_status_sent', { when: fmtWhen(saved.updatedAt) })) + '</span>';
    } else if (u && saved === null) {
      h += '<span class="d100-status">' + esc(tr('d100_status_none')) + '</span>';
    }
    h += '</header>';
    if (isLast) h += '<p class="d100-entry-note">' + esc(tr('d100_closes', { day: fmtDay(+b.closes - 1, { weekday: 'long' }) })) + '</p>';

    if (!e.plays) {
      h += '<p class="d100-empty">' + esc(tr('d100_no_plays')) + '</p>';
    } else {
      h += '<div class="d100-preview-title">' + esc(tr('d100_preview')) + '</div>';
      h += '<ol class="d100-preview">' + e.songs.slice(0, PREVIEW_ROWS).map(function (s) {
        return '<li><span class="d100-pv-t">' + esc(s.t) + '</span><span class="d100-pv-a">' + esc(s.a) + '</span>' +
          '<span class="d100-pv-n">' + esc(playsLabel(s.n)) + '</span></li>';
      }).join('') + '</ol>';
      h += '<p class="d100-entry-meta">' + esc(tr('d100_entry_meta', {
        plays: playsLabel(e.plays), songs: e.songs.length, artists: e.artists.length, albums: e.albums.length
      })) + '</p>';
    }

    if (S.err[w]) h += '<p class="d100-err" role="alert">' + esc(tr(S.err[w])) + '</p>';

    // Actions: only for a signed-in user with their own data
    if (u && !isDemo() && e.plays) {
      var busy = !!S.busy[w];
      h += '<div class="d100-actions">';
      h += '<button type="button" class="dc-btn dc-btn-main" ' + (busy ? 'disabled ' : '') +
        'onclick="dcDank100.send(\'' + w + '\')">' + esc(busy ? tr('d100_sending') : tr(saved ? 'd100_update' : 'd100_send')) + '</button>';
      if (saved) {
        h += '<button type="button" class="dc-btn dc-btn-normal d100-back-btn" ' + (busy ? 'disabled ' : '') +
          'onclick="dcDank100.takeBack(\'' + w + '\')">' + esc(tr('d100_take_back')) + '</button>';
      }
      h += '</div>';
    }
    h += '</article>';
    return h;
  }

  function viewHTML() {
    var u = signedInUid();
    var weeks = openWeeks();
    var h = '<div class="d100-section">';
    h += '<div class="section-header d100-page-header"><h2 class="section-header-h2">' + TITLE_ICO +
      '<span>' + esc(tr('d100_title')) + '</span></h2><div class="section-rule"></div></div>';
    h += '<p class="d100-page-sub">' + esc(tr('d100_sub')) + '</p>';
    h += '<div class="d100-body">';

    // Who can send: signed in, with their own library
    if (!u) {
      h += '<div class="bd-signin d100-signin"><span>' + esc(tr('d100_signin_note')) + '</span>' +
        '<button type="button" class="dc-btn dc-btn-main" onclick="dcSignIn()">' + esc(tr('board_signin_btn')) + '</button></div>';
    } else if (isDemo()) {
      h += '<div class="bd-signin d100-signin"><span>' + esc(tr('d100_demo')) + '</span></div>';
    }

    // The latest finished chart (step 4)
    h += chartHTML();

    // When the next one is out
    var closed = weekBounds(weeks[weeks.length - 1]);
    h += '<section class="d100-soon"><div class="d100-soon-n" aria-hidden="true">100</div><div>' +
      '<div class="d100-soon-title">' + esc(tr('d100_soon_title')) + '</div>' +
      '<p>' + esc(tr('d100_soon', { range: rangeLabel(closed), day: fmtDay(chartDay(closed), { weekday: 'long', month: 'long', day: 'numeric' }) })) + '</p>' +
      '</div></section>';

    // Your entry: last week first while it can still be sent, then this week
    h += '<h3 class="d100-h3">' + esc(tr('d100_entry_title')) + '</h3>';
    h += '<div class="d100-entries">';
    weeks.slice().reverse().forEach(function (w, i, arr) { h += entryCardHTML(w, arr.length > 1 && i === 0); });
    h += '</div>';

    h += yearCardHTML();

    if (u && !isDemo()) {
      h += '<p class="d100-auto-line">' + esc(tr(autoOn() ? 'd100_auto_is_on' : 'd100_auto_is_off')) +
        ' <button type="button" class="d100-link" onclick="dcDank100.openSettings()">' + esc(tr('d100_auto_settings')) + '</button></p>';
    }

    // How it works
    h += '<h3 class="d100-h3">' + esc(tr('d100_how_title')) + '</h3>';
    h += '<ul class="d100-how">' + ['d100_how_1', 'd100_how_2', 'd100_how_3', 'd100_how_4'].map(function (k) {
      return '<li>' + esc(tr(k)) + '</li>';
    }).join('') + '</ul>';
    h += '</div></div>';
    return h;
  }

  function render() {
    var root = document.getElementById('dank100View');
    if (!root || !S.active) return;
    root.innerHTML = viewHTML();
    observeArt(root);
    schedulePrepare();
  }

  // ══ Steps 4–5: the chart, older weeks, runs and number ones ══════════════
  // Charts come from the Cloudflare Function (functions/dank100), which
  // builds a week on the first visit after it closes. Songs / Artists /
  // Albums switch; rows the user's own entry helped chart are marked "You".
  // Step 5 adds the archive (/dank100/archive): every published week and each
  // row's positions over them, which feeds the week picker, the run that opens
  // under a row when it is clicked, and the list of number ones.

  var CHART_STEP = 50;          // rows shown before "Show all 100"
  var BUILD_RETRY_MS = 5000;    // someone else is counting: look again
  var BUILD_RETRIES = 6;

  C.type = 'songs';
  C.all = false;
  C.cache = {};                 // week -> finished chart (they never change)
  C.arch = null;                // { through, weeks: [{ w, status, entries }], runs }
  C.open = null;                // key of the row whose run is open

  // The newest week whose sending has closed (dank100Charts id).
  function latestClosedWeek() {
    var w = openWeeks();
    return weekIdOf(new Date(+weekBounds(w[w.length - 1]).start - DAY_MS));
  }

  // `week` defaults to the newest closed week. `force` re-asks the server
  // (used while another visitor is still counting it).
  function loadChart(force, week) {
    var latest = latestClosedWeek();
    week = week || C.week || latest;
    if (week > latest) week = latest;
    if (!force && C.week === week && (C.data || C.loading)) return;
    if (C.week !== week) { C.open = null; C.all = false; }
    C.week = week; C.err = false;
    if (!force && C.cache[week]) {
      C.data = C.cache[week]; C.loading = false;
      loadMyKeys(week); render();
      return;
    }
    C.loading = true;
    if (!force) C.data = null;
    C.tries = C.tries || 0;
    render();
    // no-store: never reuse a browser-saved answer (an old 'no chart yet' for
    // a week stuck around for an hour once the history weeks were added)
    fetch(API + '/dank100/chart?week=' + encodeURIComponent(week), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (d) {
        if (C.week !== week) return;          // picked another week meanwhile
        C.loading = false;
        C.data = d;
        if (d.status === 'done' || d.status === 'small') C.cache[week] = d;
        if (d.status === 'pending' && (C.pendTries || 0) < 60) {
          // The server is counting earlier weeks first, a few per request
          C.pendTries = (C.pendTries || 0) + 1;
          C.pending = d.left || 0;
          setTimeout(function () { if (C.week === week) loadChart(true, week); }, 60);
        } else if (d.status === 'building' && C.tries < BUILD_RETRIES) {
          C.tries++;
          setTimeout(function () { if (C.week === week) loadChart(true, week); }, BUILD_RETRY_MS);
        } else { C.tries = 0; C.pendTries = 0; C.pending = 0; }
        if (week === latest && d.status !== 'building' && d.status !== 'pending') loadArchive(latest);
        loadMyKeys(week);
        render();
      }, function (err) {
        console.warn('[dankcharts] Dank 100 chart failed:', err && err.message);
        C.loading = false; C.err = true; C.tries = 0;
        render();
      });
  }

  function loadArchive(through) {
    if (C.arch && C.arch.through === through) return;
    fetch(API + '/dank100/archive?through=' + encodeURIComponent(through), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (a) {
        if (!a || !Array.isArray(a.weeks)) return;
        C.arch = a;
        render();
      }, function (err) { console.warn('[dankcharts] Dank 100 archive failed:', err && err.message); });
  }

  // Which rows the user's own entry for that week helped chart.
  function loadMyKeys(week) {
    C.mine = null;
    if (!signedInUid()) return;
    getMyEntry(week).then(function (e) {
      if (!e || C.week !== week) return;
      C.mine = {};
      TYPES.forEach(function (type) {
        C.mine[type] = {};
        (e[type] || []).forEach(function (r) { C.mine[type][r.k] = 1; });
      });
      render();
    }, function () {});
  }

  function moveHTML(r) {
    if (r.st === 'new') return '<span class="d100-mv d100-mv-new">' + esc(tr(C.type === 'songs' ? 'badge_new_songs' : 'badge_new')) + '</span>';
    if (r.st === 're') return '<span class="d100-mv d100-mv-re">' + esc(tr('badge_re')) + '</span>';
    var diff = (r.lw || r.p) - r.p;
    if (!diff) return '<span class="d100-mv d100-mv-same" aria-label="=">=</span>';
    return '<span class="d100-mv ' + (diff > 0 ? 'd100-mv-up">▲' : 'd100-mv-down">▼') + Math.abs(diff) + '</span>';
  }

  function initials(s) {
    return String(s || '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase() || '♪';
  }

  function artHTML(type, t, a) {
    var artType = type === 'songs' ? 'song' : type === 'artists' ? 'artist' : 'album';
    return '<span class="d100-art" data-art="' + artType + '" data-t="' + esc(t) + '" data-a="' + esc(a || '') + '">' +
      '<span class="d100-art-ini" aria-hidden="true">' + esc(initials(t)) + '</span></span>';
  }

  // Each row is a button: clicking it opens the row's Dank 100 run under it.
  function rowHTML(r) {
    var mine = C.mine && C.mine[C.type] && C.mine[C.type][r.k];
    var open = C.open === r.k;
    var h = '<li class="d100-li' + (r.p === 1 ? ' d100-row-1' : '') + (mine ? ' d100-row-mine' : '') + (open ? ' is-open' : '') + '">';
    h += '<button type="button" class="d100-row" data-k="' + esc(r.k) + '" aria-expanded="' + open + '" onclick="dcDank100.toggleRun(this)">';
    h += '<span class="d100-pos">' + r.p + '</span>';
    h += '<span class="d100-move">' + moveHTML(r) + '</span>';
    h += artHTML(C.type, r.t, r.a);
    h += '<span class="d100-name"><span class="d100-t">' + esc(r.t) +
      (mine ? ' <span class="d100-you" title="' + esc(tr('d100_you_legend')) + '">' + esc(tr('d100_you')) + '</span>' : '') + '</span>' +
      (r.a ? '<span class="d100-a">' + esc(r.a) + '</span>' : '') + '</span>';
    h += '<span class="d100-num d100-pts">' + r.pts + '</span>';
    h += '<span class="d100-num d100-l">' + r.l + '</span>';
    h += '<span class="d100-num d100-lw">' + (r.lw || '–') + '</span>';
    h += '<span class="d100-num d100-pk">' + r.pk + '</span>';
    h += '<span class="d100-num d100-wk">' + r.wk + '</span>';
    h += '</button>';
    h += actsHTML(r);
    if (open) h += runHTML(r);
    h += '</li>';
    return h;
  }

  // ── A row's three buttons: play a sample, search on Spotify, search on
  // YouTube. They sit beside the row's button (a button can't hold buttons).
  // The data-ea-* attributes live on this little box only, not on the whole
  // row, so app.js's sample player (.ea-sample) reads the entry from here,
  // and right-clicking the row itself doesn't open the library's ⋮ menu for
  // something the user may never have played.
  function actsHTML(r) {
    if (typeof _eaSampleBtn !== 'function') return '';   // app.js not loaded (node tests)
    var type = C.type, isArtist = type === 'artists';
    var artist = isArtist ? r.t : (r.a || '');
    var q = encodeURIComponent(isArtist || !r.a ? r.t : r.t + ' ' + r.a);
    var yt = esc(tr('awx_yt'));
    return '<span class="d100-acts" data-ea-type="' + type + '"' +
      ' data-ea-title="' + esc(type === 'songs' ? r.t : '') + '" data-ea-artist="' + esc(artist) + '"' +
      ' data-ea-album="' + esc(type === 'albums' ? r.t : '') + '" data-ea-key="' + esc('d100:' + r.k) + '">' +
      _eaSampleBtn() +
      _eaSpotifyBtn(type, r.t, isArtist ? '' : r.a) +
      '<a class="d100-yt" href="https://www.youtube.com/results?search_query=' + q + '" target="_blank" rel="noopener"' +
      ' title="' + yt + '" aria-label="' + yt + '">' + (typeof _ST_AM_YT_SVG !== 'undefined' ? _ST_AM_YT_SVG : '▶') + '</a>' +
      '</span>';
  }

  // ── A row's run: its positions week by week, from its debut to the newest
  // chart, as a small line (gaps where it was off the chart) plus four facts.
  function runHTML(r) {
    var a = C.arch, run = a && a.runs && a.runs[C.type] && a.runs[C.type][r.k];
    var h = '<div class="d100-run">';
    if (!run || !run.r.length) {
      // Archive not here yet (or failed): the row's own numbers still tell most of it
      h += '<div class="d100-run-facts">' + fact('d100_run_peak', '#' + r.pk) + fact('d100_run_weeks', r.wk) + '</div></div>';
      return h;
    }
    var pts = run.r, first = pts[0][0], last = a.weeks.length - 1;
    // Scale to the run itself (at least #1–#5), so a run in the top 3 isn't a
    // flat line along the top of a #1–#100 box
    var maxP = 5;
    pts.forEach(function (x) { if (x[1] > maxP) maxP = x[1]; });
    maxP = Math.min(100, Math.ceil(maxP / 5) * 5);
    // In percent of the box: the line is an SVG stretched to fit, the dots are
    // HTML on top so they stay round at any width
    var X = function (i) { return last > first ? 3 + (i - first) / (last - first) * 94 : 50; };
    var Y = function (p) { return 8 + (p - 1) / (maxP - 1) * 84; };
    // Break the line where the row left the chart
    var path = '', prevI = null;
    pts.forEach(function (x) {
      path += (prevI !== null && x[0] === prevI + 1 ? ' L' : ' M') + X(x[0]).toFixed(2) + ' ' + Y(x[1]).toFixed(2);
      prevI = x[0];
    });
    var dots = pts.map(function (x) {
      return '<span class="d100-run-dot' + (x[1] === 1 ? ' is-1' : '') + '" style="left:' + X(x[0]).toFixed(2) + '%;top:' + Y(x[1]).toFixed(2) + '%"' +
        ' title="' + esc(rangeLabel(weekBounds(a.weeks[x[0]].w))) + ': #' + x[1] + '"></span>';
    }).join('');
    h += '<div class="d100-run-plot" role="img" aria-label="' + esc(tr('d100_run_title')) + '">' +
      '<span class="d100-run-lbl d100-run-lbl-top">#1</span><span class="d100-run-lbl d100-run-lbl-bot">#' + maxP + '</span>' +
      '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      '<line class="d100-run-top" x1="0" x2="100" y1="' + Y(1) + '" y2="' + Y(1) + '"/>' +
      '<path d="' + path.trim() + '"/></svg>' + dots + '</div>';
    var peak = 100, at1 = 0;
    pts.forEach(function (x) { if (x[1] < peak) peak = x[1]; if (x[1] === 1) at1++; });
    h += '<div class="d100-run-facts">' +
      fact('d100_run_debut', '#' + pts[0][1] + ' · ' + fmtDay(weekBounds(a.weeks[first].w).start)) +
      fact('d100_run_peak', '#' + peak) +
      fact('d100_run_weeks', pts.length) +
      fact('d100_run_at1', at1) + '</div>';
    h += '</div>';
    return h;
  }
  function fact(key, val) {
    return '<div class="d100-fact"><div class="d100-fact-v">' + esc(val) + '</div><div class="d100-fact-k">' + esc(tr(key)) + '</div></div>';
  }

  // ── Week picker: ‹ previous, a list of every published week, next ›
  function weekIds() {
    // Weeks nobody sent (the history weeks before anyone's year) stay out of the list
    var ids = C.arch ? C.arch.weeks.filter(function (w) { return w.entries > 0; }).map(function (w) { return w.w; }) : [];
    if (C.week && ids.indexOf(C.week) < 0) ids.push(C.week);
    return ids.sort();
  }
  function weekNavHTML() {
    var ids = weekIds();
    if (!ids.length) return '';
    var i = ids.indexOf(C.week);
    var h = '<div class="d100-weeknav">';
    h += '<button type="button" class="d100-wk-btn" aria-label="' + esc(tr('d100_prev_week')) + '"' + (i <= 0 ? ' disabled' : '') +
      ' onclick="dcDank100.pickWeek(\'' + (ids[i - 1] || '') + '\')">‹</button>';
    h += '<select class="d100-wk-select" aria-label="' + esc(tr('d100_pick_week')) + '" onchange="dcDank100.pickWeek(this.value)">' +
      ids.slice().reverse().map(function (w) {
        return '<option value="' + w + '"' + (w === C.week ? ' selected' : '') + '>' + esc(tr('d100_week_of', { range: rangeLabel(weekBounds(w)) })) + '</option>';
      }).join('') + '</select>';
    h += '<button type="button" class="d100-wk-btn" aria-label="' + esc(tr('d100_next_week')) + '"' + (i < 0 || i >= ids.length - 1 ? ' disabled' : '') +
      ' onclick="dcDank100.pickWeek(\'' + (ids[i + 1] || '') + '\')">›</button>';
    h += '</div>';
    return h;
  }

  function chartHTML() {
    var d = C.data;
    var h = '<section class="d100-chart" aria-live="polite">';
    if (C.loading && !d) {
      h += weekNavHTML() + '<p class="d100-chart-msg">' + esc(tr('d100_loading')) + '</p>';
    } else if (C.err) {
      h += weekNavHTML() + '<p class="d100-chart-msg">' + esc(tr('d100_err_chart')) +
        ' <button type="button" class="d100-link" onclick="dcDank100.reloadChart()">' + esc(tr('d100_retry')) + '</button></p>';
    } else if (!d || d.status === 'none' || d.status === 'open') {
      return '';    // no chart yet: the "next chart" box below says when
    } else if (d.status === 'building') {
      h += '<p class="d100-chart-msg">' + esc(tr('d100_building')) + '</p>';
    } else if (d.status === 'pending') {
      h += '<p class="d100-chart-msg">' + esc(tr('d100_counting', { n: C.pending || d.left || '' })) + '</p>';
    } else if (d.status === 'small' || !d.songs) {
      h += weekNavHTML() + '<p class="d100-chart-msg">' + esc(tr('d100_empty_week', { range: rangeLabel(weekBounds(d.week)) })) + '</p>';
    } else {
      var n = d.entries || 0;
      h += '<header class="d100-chart-head">' + weekNavHTML() +
        '<div class="d100-chart-meta">' + esc(tr('d100_from', { n: n, unit: tr(n === 1 ? 'd100_listener_one' : 'd100_listener_other') })) + '</div>';
      h += '<div class="dc-seg d100-seg" role="group" aria-label="' + esc(tr('d100_title')) + '">' +
        TYPES.map(function (type) {
          return '<button type="button" class="' + (C.type === type ? 'active' : '') + '" aria-pressed="' + (C.type === type) +
            '" onclick="dcDank100.setType(\'' + type + '\')">' + esc(tr('d100_type_' + type)) + '</button>';
        }).join('') + '</div>' +
        '<button type="button" class="dc-btn dc-btn-normal dc-btn-sm d100-share-btn" onclick="dcDank100.share(this)"' +
        ((d[C.type] || []).length ? '' : ' disabled') + '>' + esc(tr('d100_share')) + '</button></header>';
      if (d.hist) {
        h += '<p class="d100-hist-label">' + esc(tr(historyOpen() ? 'd100_hist_label' : 'd100_hist_label_done',
          { day: fmtDay(HISTORY_CLOSES - 1, { month: 'long', day: 'numeric' }) })) + '</p>';
      }
      var rows = d[C.type] || [];
      var shown = C.all ? rows : rows.slice(0, CHART_STEP);
      // An empty list (say, nobody's plays had album names) keeps the switch above
      if (!rows.length) return h + '<p class="d100-chart-msg">' + esc(tr('d100_empty_list')) + '</p></section>' + numberOnesHTML() + recordsHTML();
      h += '<div class="d100-cols" aria-hidden="true"><span></span><span></span><span></span><span></span>' +
        '<span>' + esc(tr('d100_col_pts')) + '</span><span>' + esc(tr('d100_col_l')) + '</span>' +
        '<span>' + esc(tr('d100_col_lw')) + '</span><span>' + esc(tr('d100_col_pk')) + '</span><span>' + esc(tr('d100_col_wk')) + '</span></div>';
      h += '<ol class="d100-list d100-list-' + C.type + '">' + shown.map(rowHTML).join('') + '</ol>';
      if (rows.length > shown.length) {
        h += '<button type="button" class="dc-btn dc-btn-normal d100-more" onclick="dcDank100.showAll()">' +
          esc(tr('d100_show_all', { n: rows.length })) + '</button>';
      }
      var legend = [];
      if (C.mine) legend.push('<span class="d100-you">' + esc(tr('d100_you')) + '</span> ' + esc(tr('d100_you_legend')));
      legend.push(esc(tr('d100_click_hint')));
      h += '<p class="d100-legend">' + legend.join(' · ') + '</p>';
    }
    h += '</section>';
    return h + numberOnesHTML() + recordsHTML();
  }

  // ── Number ones: every #1 of the chosen type, newest first, a run of
  // weeks in a row shown once ("3 weeks"). Clicking one opens that week.
  function numberOnesHTML() {
    var a = C.arch;
    if (!a || !a.weeks.length) return '';
    var byWeek = {};
    var runs = a.runs[C.type] || {};
    Object.keys(runs).forEach(function (k) {
      runs[k].r.forEach(function (x) { if (x[1] === 1) byWeek[x[0]] = k; });
    });
    var groups = [];
    for (var i = 0; i < a.weeks.length; i++) {
      var k = byWeek[i];
      if (!k) continue;
      var g = groups[groups.length - 1];
      if (g && g.k === k && g.to === i - 1) { g.to = i; g.n++; }
      else groups.push({ k: k, from: i, to: i, n: 1 });
    }
    if (!groups.length) return '';
    var h = '<section class="d100-no1"><h3 class="d100-h3">' + esc(tr('d100_no1_title')) + '</h3><ol class="d100-no1-list">';
    groups.reverse().forEach(function (g) {
      var x = runs[g.k], w = a.weeks[g.from].w;
      h += '<li><button type="button" class="d100-no1-row" onclick="dcDank100.pickWeek(\'' + a.weeks[g.to].w + '\')">' +
        artHTML(C.type, x.t, x.a) +
        '<span class="d100-name"><span class="d100-t">' + esc(x.t) + '</span>' + (x.a ? '<span class="d100-a">' + esc(x.a) + '</span>' : '') + '</span>' +
        '<span class="d100-no1-when">' + esc(fmtDay(weekBounds(w).start)) + '</span>' +
        '<span class="d100-no1-n">' + esc(tr(g.n === 1 ? 'd100_no1_weeks_one' : 'd100_no1_weeks_other', { n: g.n })) + '</span>' +
        '</button></li>';
    });
    h += '</ol></section>';
    return h;
  }

  // ══ Step 6: records and the share card ═══════════════════════════════════

  // ── Dank 100 records, from the archive, for the chosen type. Each record is
  // one winner (ties go to whoever got there first).
  function recordsList() {
    var a = C.arch;
    if (!a || !a.weeks.length) return [];
    var runs = a.runs[C.type] || {};
    var best = {};
    function offer(id, k, val, extra, lowerWins) {
      var cur = best[id];
      if (!cur || (lowerWins ? val < cur.val : val > cur.val)) best[id] = { k: k, val: val, extra: extra || '' };
    }
    Object.keys(runs).forEach(function (k) {
      var r = runs[k].r;
      var at1 = 0, streak = 1, longest = 1, maxL = 0;
      r.forEach(function (x, j) {
        if (x[1] === 1) at1++;
        if (j > 0) {
          if (x[0] === r[j - 1][0] + 1) {
            streak++;
            // A climb only counts between two weeks in a row
            var climb = r[j - 1][1] - x[1];
            if (climb > 0) offer('jump', k, climb, '#' + r[j - 1][1] + ' → #' + x[1]);
          } else streak = 1;
          if (streak > longest) longest = streak;
        }
        if ((x[2] || 0) > maxL) maxL = x[2];
      });
      if (at1) offer('at1', k, at1);
      offer('weeks', k, r.length);
      offer('run', k, longest);
      offer('debut', k, r[0][1], fmtDay(weekBounds(a.weeks[r[0][0]].w).start), true);
      if (maxL) offer('listeners', k, maxL);
    });
    var unit = function (n) { return tr(n === 1 ? 'd100_no1_weeks_one' : 'd100_no1_weeks_other', { n: n }); };
    var defs = [
      ['at1', 'd100_rec_at1', function (v) { return unit(v); }],
      ['weeks', 'd100_rec_weeks', function (v) { return unit(v); }],
      ['run', 'd100_rec_run', function (v) { return unit(v); }],
      ['jump', 'd100_rec_jump', function (v) { return '+' + v; }],
      ['debut', 'd100_rec_debut', function (v) { return '#' + v; }],
      ['listeners', 'd100_rec_listeners', function (v) { return v + ' ' + tr(v === 1 ? 'd100_listener_one' : 'd100_listener_other'); }]
    ];
    return defs.filter(function (d) { return best[d[0]]; }).map(function (d) {
      var b = best[d[0]], x = runs[b.k];
      return { label: tr(d[1]), value: d[2](b.val), extra: b.extra, t: x.t, a: x.a };
    });
  }

  function recordsHTML() {
    var recs = recordsList();
    if (!recs.length) return '';
    var h = '<section class="d100-recs"><h3 class="d100-h3">' + esc(tr('d100_rec_title')) + '</h3><div class="d100-rec-grid">';
    recs.forEach(function (r) {
      h += '<div class="d100-rec">' +
        '<div class="d100-rec-k">' + esc(r.label) + '</div>' +
        '<div class="d100-rec-v">' + esc(r.value) + (r.extra ? ' <span class="d100-rec-x">' + esc(r.extra) + '</span>' : '') + '</div>' +
        '<div class="d100-rec-who">' + artHTML(C.type, r.t, r.a) +
        '<span class="d100-name"><span class="d100-t">' + esc(r.t) + '</span>' + (r.a ? '<span class="d100-a">' + esc(r.a) + '</span>' : '') + '</span></div>' +
        '</div>';
    });
    h += '</div></section>';
    return h;
  }

  // ── Share card: the week's top 10 of the chosen type as a 1080×1350 PNG,
  // drawn straight onto a canvas (no html2canvas). Artwork is inlined as data
  // URLs (_igToDataUrl) so the canvas isn't tainted. The finished file is kept
  // per week/type/language: on phones navigator.share() needs the tap itself,
  // so a ready file is shared at once, otherwise the card is drawn and saved.
  var _card = { key: '', file: null, busy: null };
  function cardKey() { return C.week + '|' + C.type + '|' + (typeof currentLang !== 'undefined' ? currentLang : ''); }

  function loadCardImg(type, t, a) {
    if (typeof getArtAuto !== 'function' || typeof _igToDataUrl !== 'function') return Promise.resolve(null);
    var p = type === 'artists' ? getArtAuto('artist', t) : type === 'albums' ? getArtAuto('album', t, a, t) : getArtAuto('song', t, a);
    return p.then(function (url) {
      if (!url) return null;
      return _igToDataUrl(typeof shHiResArt === 'function' ? shHiResArt(url) : url);
    }).then(function (data) {
      if (!data) return null;
      var img = new Image();
      img.src = data;
      return img.decode().then(function () { return img; });
    }).catch(function () { return null; });
  }

  function renderCard() {
    var d = C.data, type = C.type;
    var rows = (d && d[type] || []).slice(0, 10);
    if (!rows.length) return Promise.resolve(null);
    var W = 1080, H = 1350;
    var cvs = document.createElement('canvas');
    cvs.width = W; cvs.height = H;
    var g = cvs.getContext('2d');
    var css = getComputedStyle(document.documentElement);
    var display = (css.getPropertyValue('--font-display') || 'sans-serif').trim();
    var sans = (css.getPropertyValue('--font-sans') || 'sans-serif').trim();
    var TEAL = '#2dd4bf', UP = '#4ade80', DOWN = '#fb7185';
    var fonts = Promise.all([document.fonts.load('800 100px ' + display), document.fonts.load('600 40px ' + sans)]).catch(function () {});
    return Promise.all([fonts].concat(rows.map(function (r) { return loadCardImg(type, r.t, r.a); }))).then(function (res) {
      var imgs = res.slice(1);
      var clip = function (s, max) {
        s = String(s || '');
        if (g.measureText(s).width <= max) return s;
        while (s.length > 1 && g.measureText(s + '…').width > max) s = s.slice(0, -1);
        return s + '…';
      };
      // Background: deep navy with a teal glow in the corner
      g.fillStyle = '#0a0f1c'; g.fillRect(0, 0, W, H);
      var glow = g.createRadialGradient(W, 0, 0, W, 0, 900);
      glow.addColorStop(0, 'rgba(45,212,191,0.28)'); glow.addColorStop(1, 'rgba(45,212,191,0)');
      g.fillStyle = glow; g.fillRect(0, 0, W, H);

      // Header
      g.textBaseline = 'alphabetic'; g.textAlign = 'left';
      g.font = '800 92px ' + display; g.fillStyle = '#ffffff';
      g.fillText('THE DANK', 80, 150);
      var wDank = g.measureText('THE DANK ').width;
      g.fillStyle = TEAL; g.fillText('100', 80 + wDank, 150);
      g.font = '600 32px ' + sans; g.fillStyle = 'rgba(255,255,255,0.7)';
      var n = d.entries || 0;
      g.fillText(clip(tr('d100_type_' + type) + ' · ' + tr('d100_week_of', { range: rangeLabel(weekBounds(d.week)) }) + ' · ' +
        tr('d100_from', { n: n, unit: tr(n === 1 ? 'd100_listener_one' : 'd100_listener_other') }), W - 160), 80, 205);

      // Rows
      var top = 260, rowH = 96, art = 76;
      rows.forEach(function (r, i) {
        var y = top + i * rowH;
        if (i === 0) {
          g.fillStyle = 'rgba(45,212,191,0.14)';
          g.beginPath();
          if (g.roundRect) g.roundRect(56, y - 6, W - 112, rowH - 4, 20); else g.rect(56, y - 6, W - 112, rowH - 4);
          g.fill();
        }
        var mid = y + rowH / 2 - 4;
        g.textAlign = 'right';
        g.font = '800 ' + (i === 0 ? 56 : 46) + 'px ' + display;
        g.fillStyle = i === 0 ? TEAL : '#ffffff';
        g.fillText(String(r.p), 150, mid + 18);
        // Move
        g.textAlign = 'center'; g.font = '800 22px ' + sans;
        var mv, col;
        if (r.st === 'new') { mv = tr(type === 'songs' ? 'badge_new_songs' : 'badge_new'); col = TEAL; }
        else if (r.st === 're') { mv = tr('badge_re'); col = TEAL; }
        else {
          var diff = (r.lw || r.p) - r.p;
          mv = diff ? (diff > 0 ? '▲' : '▼') + Math.abs(diff) : '=';
          col = diff > 0 ? UP : diff < 0 ? DOWN : 'rgba(255,255,255,0.5)';
        }
        g.fillStyle = col; g.fillText(mv, 215, mid + 8);
        // Artwork (round for artists)
        var ax = 265, ay = mid - art / 2;
        g.save();
        g.beginPath();
        if (type === 'artists') g.arc(ax + art / 2, ay + art / 2, art / 2, 0, Math.PI * 2);
        else if (g.roundRect) g.roundRect(ax, ay, art, art, 12); else g.rect(ax, ay, art, art);
        g.clip();
        g.fillStyle = 'rgba(45,212,191,0.18)'; g.fillRect(ax, ay, art, art);
        var img = imgs[i];
        if (img) {
          var k = Math.max(art / img.naturalWidth, art / img.naturalHeight);
          var sw = art / k, sh = art / k;
          g.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, ax, ay, art, art);
        } else {
          g.textAlign = 'center'; g.font = '700 26px ' + sans; g.fillStyle = 'rgba(255,255,255,0.6)';
          g.fillText(initials(r.t), ax + art / 2, ay + art / 2 + 9);
        }
        g.restore();
        // Title and artist
        g.textAlign = 'left';
        var tx = ax + art + 28, tw = W - tx - 90;
        g.font = '700 36px ' + sans; g.fillStyle = '#ffffff';
        g.fillText(clip(r.t, tw), tx, r.a ? mid - 2 : mid + 12);
        if (r.a) {
          g.font = '500 27px ' + sans; g.fillStyle = 'rgba(255,255,255,0.6)';
          g.fillText(clip(r.a, tw), tx, mid + 34);
        }
      });

      // Footer
      g.textAlign = 'center'; g.font = '600 30px ' + sans; g.fillStyle = 'rgba(255,255,255,0.5)';
      g.fillText('dankcharts.fm', W / 2, H - 50);

      return new Promise(function (res2) { cvs.toBlob(res2, 'image/png'); });
    }).then(function (blob) {
      if (!blob) return null;
      return new File([blob], 'dank100-' + d.week + '-' + type + '.png', { type: 'image/png' });
    });
  }

  // Drawn ahead of time (after the chart shows) so the Share tap can use it.
  function prepareCard() {
    var key = cardKey();
    if (_card.key === key && (_card.file || _card.busy)) return _card.busy || Promise.resolve(_card.file);
    _card.key = key; _card.file = null;
    _card.busy = renderCard().then(function (f) {
      if (_card.key === key) { _card.file = f; _card.busy = null; }
      return f;
    }, function (e) { console.warn('[dankcharts] Dank 100 card failed:', e); if (_card.key === key) _card.busy = null; return null; });
    return _card.busy;
  }

  function shareCard(btn) {
    var ready = _card.key === cardKey() ? _card.file : null;
    if (ready && navigator.canShare && navigator.canShare({ files: [ready] })) {
      navigator.share({ files: [ready] }).catch(function () {});
      return;
    }
    var orig = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = tr('d100_share_busy'); }
    prepareCard().then(function (file) {
      if (file) {
        var a = document.createElement('a');
        a.download = file.name;
        a.href = URL.createObjectURL(file);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      }
    }).then(function () { if (btn) { btn.disabled = false; btn.textContent = orig; } });
  }

  // Only phones share files; there, draw the card while the user reads.
  var _prepTimer = null;
  function schedulePrepare() {
    if (!(navigator.canShare && C.data && C.data.status === 'done')) return;
    clearTimeout(_prepTimer);
    _prepTimer = setTimeout(prepareCard, 1500);
  }

  // Artwork, fetched only once a row scrolls into view (getArtAuto in
  // app.js: the same lookup and picked pictures as the rest of the site).
  var _artCache = {};
  var _artObs = null;
  function paintArt(el, url) {
    if (!url) return;
    var img = new Image();
    img.alt = '';
    img.decoding = 'async';
    img.onload = function () { el.classList.add('has-img'); };
    img.src = typeof sizedArtUrl === 'function' ? sizedArtUrl(url, 96) : url;
    el.appendChild(img);
  }
  function loadArt(el) {
    var type = el.getAttribute('data-art'), t = el.getAttribute('data-t'), a = el.getAttribute('data-a');
    var key = type + '|' + t + '|' + a;
    if (key in _artCache) {
      if (_artCache[key] && typeof _artCache[key].then === 'function') _artCache[key].then(function (u) { paintArt(el, u); });
      else paintArt(el, _artCache[key]);
      return;
    }
    if (typeof getArtAuto !== 'function') return;
    var p = (type === 'artist' ? getArtAuto('artist', t)
      : type === 'album' ? getArtAuto('album', t, a, t)
      : getArtAuto('song', t, a)).catch(function () { return null; });
    _artCache[key] = p;
    p.then(function (u) { _artCache[key] = u || null; paintArt(el, u); });
  }
  function observeArt(root) {
    if (_artObs) _artObs.disconnect();
    var els = root.querySelectorAll('.d100-art[data-art]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { Array.prototype.forEach.call(els, loadArt); return; }
    _artObs = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        _artObs.unobserve(en.target);
        loadArt(en.target);
      });
    }, { rootMargin: '200px' });
    Array.prototype.forEach.call(els, function (el) { _artObs.observe(el); });
  }

  function setType(type) {
    if (TYPES.indexOf(type) < 0) return;
    C.type = type; C.all = false; C.open = null;
    render();
  }

  function toggleRun(btn) {
    var k = btn && btn.getAttribute('data-k');
    if (!k) return;
    C.open = C.open === k ? null : k;
    render();
    // Keep focus on the same row after the redraw
    var again = document.querySelector('#dank100View .d100-row[data-k="' + (window.CSS && CSS.escape ? CSS.escape(k) : k) + '"]');
    if (again) again.focus({ preventScroll: true });
  }

  function pickWeek(w) {
    if (!weekBounds(w)) return;
    loadChart(false, w);
    var el = document.querySelector('#dank100View .d100-chart');
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── "Send my year": every history week with plays, one after the other,
  // then the server is told to recount (POST /dank100/dirty).
  var Y = { busy: false, i: 0, n: 0, err: 0 };
  var _yearCount = { key: '', n: 0 };
  function yearKey(uid) { return 'dc_d100_year_' + uid; }
  // How many history weeks have plays (cached: it walks every play per week)
  function yearWeeksWithPlays() {
    if (!hasPlays()) return [];
    var key = allPlays.length + '|' + (allPlays[0] && +allPlays[0].date);
    if (_yearCount.key !== key) {
      _yearCount = { key: key, weeks: historyWeeks().filter(function (w) { return buildEntry(w).plays > 0; }) };
    }
    return _yearCount.weeks;
  }

  function yearCardHTML() {
    if (!historyOpen()) return '';
    var u = signedInUid();
    if (!u || isDemo() || !hasPlays()) return '';
    var weeks = yearWeeksWithPlays();
    if (!weeks.length) return '';
    var done = null;
    try { done = JSON.parse(lsGet(yearKey(u)) || 'null'); } catch (e) {}
    var closeDay = fmtDay(HISTORY_CLOSES - 1, { month: 'long', day: 'numeric' });
    var h = '<section class="d100-year">';
    h += '<div class="d100-year-n" aria-hidden="true">' + weeks.length + '</div><div class="d100-year-body">';
    h += '<div class="d100-year-title">' + esc(tr('d100_year_title')) + '</div>';
    h += '<p>' + esc(tr('d100_year_text', { n: weeks.length, day: closeDay })) + '</p>';
    if (Y.busy) {
      h += '<p class="d100-year-status">' + esc(tr('d100_year_sending', { i: Y.i, n: Y.n })) + '</p>';
    } else if (Y.err) {
      h += '<p class="d100-err" role="alert">' + esc(tr('d100_year_err')) + '</p>';
    } else if (done) {
      h += '<p class="d100-year-status d100-status-sent">✓ ' + esc(tr('d100_year_sent', { n: done.n, when: fmtWhen(done.at) })) + '</p>';
    }
    h += '<div class="d100-actions"><button type="button" class="dc-btn ' + (done ? 'dc-btn-normal' : 'dc-btn-main') + '"' + (Y.busy ? ' disabled' : '') +
      ' onclick="dcDank100.sendYear()">' + esc(tr(done ? 'd100_year_again' : 'd100_year_btn')) + '</button></div>';
    h += '</div></section>';
    return h;
  }

  function sendYear() {
    var uid = signedInUid();
    if (Y.busy || !uid || isDemo() || !historyOpen()) return;
    var weeks = yearWeeksWithPlays();
    if (!weeks.length) return;
    Y = { busy: true, i: 0, n: weeks.length, err: 0 };
    render();
    var sent = 0;
    weeks.reduce(function (p, w) {
      return p.then(function () {
        Y.i++; render();
        return sendEntry(w).then(function () { sent++; }, function (e) {
          console.warn('[dankcharts] Dank 100 year week failed:', w, e && (e.code || e.message));
          Y.err++;
        });
      });
    }, Promise.resolve()).then(function () {
      // `through` = the newest week this send covered; catchUpYear() sends
      // the ones that close after it
      if (sent) lsSet(yearKey(uid), JSON.stringify({ at: Date.now(), n: sent, through: weeks[weeks.length - 1] }));
      renderPromo();
      return askRecount();
    }).then(function () {
      Y.busy = false;
      C.cache = {}; C.arch = null; C.pendTries = 0;
      render();
      loadChart(true, C.week || latestClosedWeek());
    });
  }

  // Tells the server history entries came in, so it recounts. Asked twice if
  // the first try fails: without it the new weeks would wait for someone else's.
  function askRecount() {
    var ask = function () {
      return fetch(API + '/dank100/dirty', { method: 'POST' }).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); });
    };
    return ask().catch(function () {
      return new Promise(function (res) { setTimeout(res, 2000); }).then(ask);
    }).catch(function (e) { console.warn('[dankcharts] Dank 100 recount signal failed:', e && e.message); });
  }

  // For people who already pressed "Send my year": the weeks that were still
  // running when they pressed it (so it couldn't send them) are sent by
  // themselves once they close, until 30 Nov. Older sends kept no `through`;
  // those covered up to HISTORY_LAST. Weeks the user took back are skipped.
  // Runs after every data load and sign-in (autoSend), only in the browser
  // that sent the year (the marker is in localStorage).
  var _catchUpRunning = false;
  function catchUpYear() {
    var uid = signedInUid();
    if (_catchUpRunning || !uid || isDemo() || !hasPlays() || !historyOpen() || Y.busy) return;
    var done = null;
    try { done = JSON.parse(lsGet(yearKey(uid)) || 'null'); } catch (e) {}
    if (!done || !done.at) return;
    var through = done.through || HISTORY_LAST, last = latestClosedWeek();
    var weeks = [];
    for (var w = nextWeek(through); w <= last; w = nextWeek(w)) {
      if (+weekBounds(w).start >= done.at) break;   // started after the send: not part of it
      weeks.push(w);
    }
    if (!weeks.length) return;
    _catchUpRunning = true;
    var sent = 0, failed = 0;
    weeks.reduce(function (p, w) {
      return p.then(function () {
        if (lsGet(backKey(uid, w)) || !(buildEntry(w).plays > 0)) return;
        return sendEntry(w).then(function () { sent++; lsSet(sentKey(uid, w), String(Date.now())); }, function (e) {
          console.warn('[dankcharts] Dank 100 catch-up week failed:', w, e && (e.code || e.message));
          failed++;
        });
      });
    }, Promise.resolve()).then(function () {
      // Only move on once every week went in, so a failed one is tried again
      if (!failed) {
        done.through = weeks[weeks.length - 1];
        done.n = (done.n || 0) + sent;
        lsSet(yearKey(uid), JSON.stringify(done));
      }
      if (!sent) return;
      return askRecount().then(function () {
        C.cache = {}; C.arch = null; C.pendTries = 0;
        if (S.active) { render(); loadChart(true, C.week || latestClosedWeek()); }
      });
    }).then(function () { _catchUpRunning = false; }, function () { _catchUpRunning = false; });
  }

  // ── The invite banner on the chart tabs ──
  // Tells people The Dank 100 exists and asks them to join. Hidden for the
  // demo library, after the × (dc_d100_promo_off), and once this browser has
  // sent anything for the signed-in account (a week or the year).
  var PROMO_OFF = 'dc_d100_promo_off';
  function hasJoined() {
    var uid = signedInUid();
    if (!uid) return false;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && (k.indexOf('dc_d100_sent_' + uid + '_') === 0 || k === yearKey(uid))) return true;
      }
    } catch (e) {}
    return false;
  }
  function renderPromo() {
    var el = document.getElementById('d100Promo');
    if (!el) return;
    if (lsGet(PROMO_OFF) === '1' || isDemo() || !hasPlays() || hasJoined()) {
      el.style.display = 'none'; el.innerHTML = '';
      return;
    }
    var year = historyOpen();
    var day = fmtDay(HISTORY_CLOSES - 1, { month: 'long', day: 'numeric' });
    el.innerHTML =
      '<div class="d100-promo-ico" aria-hidden="true">' + TITLE_ICO + '</div>' +
      '<div class="d100-promo-body">' +
        '<div class="d100-promo-title"><span class="d100-promo-new">' + esc(tr('d100_promo_new')) + '</span>' + esc(tr('d100_title')) + '</div>' +
        '<p>' + esc(tr(year ? 'd100_promo_text_year' : 'd100_promo_text', { day: day })) + '</p>' +
      '</div>' +
      '<div class="d100-promo-actions">' +
        '<button type="button" class="dc-btn dc-btn-main" onclick="dcDank100.openFromPromo()">' + esc(tr(year ? 'd100_promo_btn_year' : 'd100_promo_btn')) + '</button>' +
        '<button type="button" class="d100-promo-x" aria-label="' + esc(tr('d100_promo_hide')) + '" title="' + esc(tr('d100_promo_hide')) + '" onclick="dcDank100.hidePromo()">×</button>' +
      '</div>';
    el.style.display = '';
  }
  // Opens the tab and brings the "Send my year" card (or this week's) into view
  function openFromPromo() {
    if (typeof dcGoTab === 'function') dcGoTab('dank100');
    setTimeout(function () {
      var target = document.querySelector('#dank100View .d100-year') || document.querySelector('#dank100View .d100-entries') ||
        document.querySelector('#dank100View .d100-signin');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 250);
  }
  function hidePromo() {
    lsSet(PROMO_OFF, '1');
    renderPromo();
  }

  // ── Actions ──
  function send(w, quiet) {
    var uid = signedInUid();
    if (!uid || S.busy[w] || isDemo()) return Promise.resolve(false);
    S.busy[w] = true; delete S.err[w];
    if (!quiet) render();
    return sendEntry(w).then(function () {
      lsSet(sentKey(uid, w), String(Date.now()));
      renderPromo();
      lsSet(backKey(uid, w), null);          // sending again undoes a take-back
      return getMyEntry(w).then(function (e) { S.mine[w] = e; }, function () {});
    }).then(function () { return true; }, function (err) {
      console.warn('[dankcharts] Dank 100 send failed:', err && (err.code || err.message));
      if (!quiet) S.err[w] = 'd100_err_send';
      return false;
    }).then(function (ok) { delete S.busy[w]; render(); return ok; });
  }

  function takeBack(w) {
    var uid = signedInUid();
    if (!uid || S.busy[w]) return;
    var go = function () {
      S.busy[w] = true; delete S.err[w]; render();
      deleteMyEntry(w).then(function () {
        S.mine[w] = null;
        lsSet(backKey(uid, w), '1');
      }, function (err) {
        console.warn('[dankcharts] Dank 100 take-back failed:', err && (err.code || err.message));
        S.err[w] = 'd100_err_back';
      }).then(function () { delete S.busy[w]; render(); });
    };
    // A real in-site warning window (board.js), never the browser's confirm()
    if (window.dcConfirmBox) window.dcConfirmBox(tr('d100_back_title'), tr('d100_back_text'), tr('d100_take_back'), go);
    else go();
  }

  // Called after every data load (app.js finalizeLoad) and on sign-in. Sends
  // each open week that has plays, at most every AUTO_EVERY_MS, unless the
  // user took that week's entry back.
  var _autoRunning = false;
  function autoSend() {
    syncSwitch();
    renderPromo();          // called after every data load (app.js finalizeLoad)
    catchUpYear();          // weeks a "Send my year" couldn't send yet (own check, no switch needed)
    var uid = signedInUid();
    if (_autoRunning || !uid || !autoOn() || isDemo() || !hasPlays()) return;
    var due = openWeeks().filter(function (w) {
      if (lsGet(backKey(uid, w))) return false;
      var last = +lsGet(sentKey(uid, w)) || 0;
      return Date.now() - last >= AUTO_EVERY_MS && buildEntry(w).plays > 0;
    });
    if (!due.length) return;
    _autoRunning = true;
    due.reduce(function (p, w) { return p.then(function () { return send(w, true); }); }, Promise.resolve())
      .then(function () { _autoRunning = false; });
  }

  function setAutoSend(on) {
    var v = on ? '1' : '0';
    lsSet(AUTO_KEY, v);
    // Targeted write so a racing full-config save can't push a stale value back
    if (typeof dcSaveConfigKey === 'function') dcSaveConfigKey(AUTO_KEY, v);
    syncSwitch();
    render();
    if (on) autoSend();
  }

  function openSettings() {
    if (typeof openSourceModal === 'function') openSourceModal();
    if (typeof switchSettingsTab === 'function') switchSettingsTab('charts');
  }

  function show() {
    S.active = true;
    render();
    loadMine().then(render);
    loadChart();
  }
  function hide() { S.active = false; }

  // Signing in or out changes the whole card (and may make a week due).
  function hookAuth() {
    try {
      firebase.auth().onAuthStateChanged(function () {
        S.mine = {}; S.err = {};
        syncSwitch();
        renderPromo();
        if (S.active) { render(); loadMine().then(render); if (C.week) loadMyKeys(C.week); }
        // Give the cloud settings a moment to land in localStorage first
        setTimeout(autoSend, 4000);
      });
    } catch (e) {}
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      syncSwitch();
      if (typeof firebase !== 'undefined' && firebase.apps) hookAuth();
    });
  }

  // ── Exports ────────────────────────────────────────────────────────────────
  var api = {
    show: show,
    hide: hide,
    rerender: render,
    setType: setType,
    toggleRun: toggleRun,
    share: shareCard,
    pickWeek: pickWeek,
    showAll: function () { C.all = true; render(); },
    reloadChart: function () { C.tries = 0; loadChart(true, C.week); },
    sendYear: sendYear,
    renderPromo: renderPromo,
    openFromPromo: openFromPromo,
    hidePromo: hidePromo,
    send: function (w) { return send(w, false); },
    takeBack: takeBack,
    autoSend: autoSend,
    setAutoSend: setAutoSend,
    openSettings: openSettings,
    MAX_ROWS: MAX_ROWS,
    weekIdOf: weekIdOf,
    weekBounds: weekBounds,
    openWeeks: openWeeks,
    songMatchKey: songMatchKey,
    albumMatchKey: albumMatchKey,
    artistMatchKey: baseKey,
    buildEntry: buildEntry,
    sendEntry: sendEntry,
    getMyEntry: getMyEntry,
    deleteMyEntry: deleteMyEntry
  };
  if (typeof window !== 'undefined') window.dcDank100 = api;
  // The Cloudflare Function (step 3) and the node test reuse the same week and
  // key rules, so there is only one copy of them.
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
