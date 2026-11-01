/* ===========================================================================
   THE DANK 100 - EVERYONE'S WEEKLY CHARTS ADDED UP INTO ONE
   ===========================================================================
   Plan: DANK100-PLAN.md (repo root). This file is step 1: the data side only.
   No UI yet.

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

  // ── Exports ────────────────────────────────────────────────────────────────
  var api = {
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
