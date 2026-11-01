/* ===========================================================================
   THE DANK 100 - EVERYONE'S WEEKLY CHARTS ADDED UP INTO ONE
   ===========================================================================
   Plan: DANK100-PLAN.md (repo root). Step 1 is the data side (the week,
   match keys, building and saving an entry); step 2 is the Dank 100 tab with
   the send-in card and the auto-send switch in Settings → Charts.

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
    if (openWeeks().indexOf(weekId) < 0) return Promise.reject(new Error('week-closed'));
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

    // The chart itself arrives in step 4: for now, when the next one is out
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
  }

  // ── Actions ──
  function send(w, quiet) {
    var uid = signedInUid();
    if (!uid || S.busy[w] || isDemo()) return Promise.resolve(false);
    S.busy[w] = true; delete S.err[w];
    if (!quiet) render();
    return sendEntry(w).then(function () {
      lsSet(sentKey(uid, w), String(Date.now()));
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
  }
  function hide() { S.active = false; }

  // Signing in or out changes the whole card (and may make a week due).
  function hookAuth() {
    try {
      firebase.auth().onAuthStateChanged(function () {
        S.mine = {}; S.err = {};
        syncSwitch();
        if (S.active) { render(); loadMine().then(render); }
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
