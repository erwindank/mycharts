/* ===========================================================================
   SMART PLAYLISTS (SMART-PLAYLISTS-PLAN.md)

   A smart playlist is a saved set of rules ("plays at least 50, not played in
   6 months, genre is Pop"). Everything in the feature runs the same engine:
   the ready-made lists, the user's own lists, presets, Mix it, sharing,
   notifications. This file holds the whole feature; it reads app.js globals,
   so it loads after app.js.

   Step 1 (this part): the engine, no UI yet.
     spSongFacts()  one record per song, built once per data load and cached
     spRun(list)    runs a rule set → the songs, sorted and cut to size

   Works the same for Last.fm, Google Sheets and CSV: every fact comes from
   allPlays (which all three sources fill) or from things built from it
   (ratings, certifications, genres).

   ─── The rule format (what gets saved) ────────────────────────────────────
   A list:
     {
       match: 'all' | 'any',          // how its rules combine
       rules: [ rule | group, ... ],
       limit: 50,                     // max songs (0 or missing = no limit)
       sort:  { f: 'plays', dir: 'desc', win: {...} },  // any number/date/text field, or 'random'
       perArtist: 2                   // max songs per artist (0 = no limit)
     }
   A group is { match, rules } and can sit inside a list's rules.
   A rule is { f: field id, op: condition, v: value, win?: window }.
     win (only on fields with `win: true`, e.g. plays):
       { last: 30 }                           the last 30 days
       { from: '2025-01-01', to: '2025-12-31' } day strings, both included
       …and since 2026-11-16 named periods, last N weeks / months / years,
       this month in earlier years and a song's first N days: see _spWinRange
   =========================================================================== */

// ─── SMALL HELPERS ────────────────────────────────────────────────────────

const SP_DAY_MS = 86400000;

// The same song key the ratings and playlists use (title|||artist, lower case)
function _spKey(p) {
  return (typeof songKey === 'function') ? songKey(p)
    : (p.title || '').toLowerCase().trim() + '|||' + (p.artist || '').toLowerCase().trim();
}

// A play's day as 'YYYY-MM-DD' in the user's own time zone
function _spDay(p) {
  return (typeof dayStrOf === 'function') ? dayStrOf(p) : p.date.toISOString().slice(0, 10);
}

// Lower case + trimmed, for text rules
function _spNorm(s) { return String(s == null ? '' : s).toLowerCase().trim(); }

// Anything that changes the facts has to change this string. The play data,
// the time zone / week start / autocorrect (_stampEpoch) and release marks.
function _spGeneration() {
  return (typeof _stampEpoch !== 'undefined' ? _stampEpoch : 0) + '|' +
    (typeof _playsVersion !== 'undefined' ? _playsVersion : 0) + '|' +
    (typeof _releaseEpoch !== 'undefined' ? _releaseEpoch : 0) + '|' +
    (allPlays ? allPlays.length : 0);
}

// ─── SONG FACTS ───────────────────────────────────────────────────────────
/* One record per song. Built in a single pass over allPlays, which runs
   newest → oldest, so the first play seen is the last one played.

   Facts that can change without the plays changing (ratings, Last.fm genre
   tags looked up later) are NOT stored here; the fields read them live, so a
   new rating shows up in a list without rebuilding anything. */

let _spFactsCache = null;   // { gen, list, byKey }

function spSongFacts() {
  const gen = _spGeneration();
  if (_spFactsCache && _spFactsCache.gen === gen) return _spFactsCache;
  const byKey = new Map();
  const plays = allPlays || [];
  for (let i = 0; i < plays.length; i++) {
    const p = plays[i];
    const k = _spKey(p);
    let s = byKey.get(k);
    if (!s) {
      s = {
        key: k, title: p.title, artist: p.artist || '',
        artists: (Array.isArray(p.artists) && p.artists.length) ? p.artists : [p.artist || ''],
        plays: 0, last: +p.date, first: +p.date,
        _albums: {},          // album → plays, for the most common one
        _days: new Map(),     // day string → plays that day
        genres: null          // the sheet's / CSV's own genre columns, if any
      };
      byKey.set(k, s);
    }
    s.plays++;
    const t = +p.date;
    if (t > s.last) s.last = t;
    if (t < s.first) s.first = t;
    if (p.album && p.album !== '—') s._albums[p.album] = (s._albums[p.album] || 0) + 1;
    const ds = _spDay(p);
    s._days.set(ds, (s._days.get(ds) || 0) + 1);
    if (!s.genres && Array.isArray(p.genres) && p.genres.length) s.genres = p.genres;
  }

  // Finish each record: main album, day counts, release type, certification
  const list = [];
  for (const s of byKey.values()) {
    let best = '', bestN = 0;
    for (const a in s._albums) if (s._albums[a] > bestN) { best = a; bestN = s._albums[a]; }
    s.album = best;
    s.days = s._days.size;
    let mx = 0;
    for (const n of s._days.values()) if (n > mx) mx = n;
    s.maxDay = mx;
    s.dayMap = s._days;   // kept for windowed counts' fast path and later steps
    delete s._days; delete s._albums;
    s.release = _spReleaseType(s);
    s.cert = _spCertLevel(s.plays);
    list.push(s);
  }
  _spFactsCache = { gen, list, byKey };
  _spWinCache = new Map();
  return _spFactsCache;
}

// single / ep / album / live / soundtrack, from the release-type system.
// A song with no album counts as a single would on a chart: 'album' is what
// releaseTypeOf answers for no album, so we keep that rather than guess.
function _spReleaseType(s) {
  if (typeof releaseTypeOf !== 'function') return 'album';
  const fake = { title: s.title, artist: s.artist, artists: s.artists, album: s.album || '—' };
  const aa = (typeof albumArtist === 'function') ? albumArtist(fake) : s.artist;
  try { return releaseTypeOf(s.album || '—', aa) || 'album'; } catch (e) { return 'album'; }
}

/* A song's certification from its plays, with the user's own thresholds
   (CERT.song). Diamond counts in multiples, like the plaque wall:
   400 plays with diamond at 200 = 2× diamond. */
const SP_CERT_ORDER = ['none', 'gold', 'platinum', 'diamond'];
function _spCertLevel(n) {
  const c = (typeof CERT !== 'undefined' && CERT.song) || { gold: 50, plat: 100, diamond: 200 };
  if (n >= c.diamond) return { tier: 'diamond', mult: Math.floor(n / c.diamond) };
  if (n >= c.plat)    return { tier: 'platinum', mult: 1 };
  if (n >= c.gold)    return { tier: 'gold', mult: 1 };
  return { tier: 'none', mult: 0 };
}

// ─── WINDOWED PLAY COUNTS ─────────────────────────────────────────────────
/* "Plays in the last 30 days" / "plays in 2025". Each distinct window is
   counted once per data load (one pass over allPlays) and shared by every
   rule and sort that uses it. "Last N days" windows are keyed by today too,
   so they move on at midnight. */

let _spWinCache = new Map();

// ─── NAMED PERIODS (2026-11-16) ───────────────────────────────────────────
/* Periods a plays window or a first / last played rule can name, as short
   codes so they're easy to store and share:
     today · yesterday · thisWeek · lastWeek · thisMonth · lastMonth ·
     thisYear · lastYear       move on by themselves (thisWeek = so far,
                               from the user's own week start day)
     y:2023                    a whole calendar year
     m:2025-03                 a whole calendar month
     s:summer:2025             a season: spring Mar–May, summer Jun–Aug,
                               autumn Sep–Nov, winter Dec 2025 – Feb 2026 */
const SP_PERIODS = ['today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth', 'thisYear', 'lastYear'];
const SP_SEASONS = ['spring', 'summer', 'autumn', 'winter'];

function _spDs(d) { return (typeof localDateStr === 'function') ? localDateStr(d) : d.toISOString().slice(0, 10); }
function _spToday() {
  return (typeof localDateStr === 'function' && typeof tzNow === 'function') ? localDateStr(tzNow()) : new Date().toISOString().slice(0, 10);
}
// A day string moved by n days
function _spShift(ds, n) { const d = new Date(ds + 'T12:00:00'); d.setDate(d.getDate() + n); return _spDs(d); }
// The last day of a month (m = 1–12)
function _spMonthEnd(y, m) { return y + '-' + String(m).padStart(2, '0') + '-' + String(new Date(y, m, 0).getDate()).padStart(2, '0'); }

// A period code → { from, to } day strings (both included), or null
function _spPeriodRange(code) {
  code = String(code || '');
  const today = _spToday();
  const Y = +today.slice(0, 4), M = +today.slice(5, 7);
  const ws = (typeof _spNowKey === 'function') ? _spNowKey('week') : today;   // this week's first day
  switch (code) {
    case 'today':     return { from: today, to: today };
    case 'yesterday': { const y = _spShift(today, -1); return { from: y, to: y }; }
    case 'thisWeek':  return { from: ws, to: today };
    case 'lastWeek':  return { from: _spShift(ws, -7), to: _spShift(ws, -1) };
    case 'thisMonth': return { from: today.slice(0, 8) + '01', to: today };
    case 'lastMonth': { const y = M === 1 ? Y - 1 : Y, m = M === 1 ? 12 : M - 1; return { from: y + '-' + String(m).padStart(2, '0') + '-01', to: _spMonthEnd(y, m) }; }
    case 'thisYear':  return { from: Y + '-01-01', to: today };
    case 'lastYear':  return { from: (Y - 1) + '-01-01', to: (Y - 1) + '-12-31' };
  }
  let x;
  if ((x = /^y:(\d{4})$/.exec(code))) return { from: x[1] + '-01-01', to: x[1] + '-12-31' };
  if ((x = /^m:(\d{4})-(\d{2})$/.exec(code))) return { from: x[1] + '-' + x[2] + '-01', to: _spMonthEnd(+x[1], +x[2]) };
  if ((x = /^s:(spring|summer|autumn|winter):(\d{4})$/.exec(code))) {
    const y = +x[2];
    if (x[1] === 'spring') return { from: y + '-03-01', to: y + '-05-31' };
    if (x[1] === 'summer') return { from: y + '-06-01', to: y + '-08-31' };
    if (x[1] === 'autumn') return { from: y + '-09-01', to: y + '-11-30' };
    return { from: y + '-12-01', to: _spMonthEnd(y + 1, 2) };
  }
  return null;
}
function _spPeriodOk(code) { return !!_spPeriodRange(code); }

/* A plays window → what to count. Shapes (rule.win):
     { last: 30 }                    the last 30 days, today included
     { last: 3, unit: 'month' }      the last 3 weeks / months / years
     { from, to }                    between two days
     { p: 'lastMonth' }              a named period (see above)
     { p: 'monthPast' }              this calendar month in every earlier year
     { first: 30 }                   a song's own first 30 days (worked out per
                                     song in the plays field, not here)
   Returns { from, to } or { id, test(dayString) }, or null for no window. */
function _spWinRange(win) {
  if (!win) return null;
  if (win.p === 'monthPast') {
    const today = _spToday(), mm = today.slice(5, 7), yy = today.slice(0, 4);
    return { id: 'mp:' + today.slice(0, 7), test: ds => ds.slice(5, 7) === mm && ds.slice(0, 4) < yy };
  }
  if (win.p) return _spPeriodRange(win.p);
  if (win.last > 0) {
    const today = _spToday();
    const d = new Date(today + 'T12:00:00');
    const u = win.unit;
    // The last N units including today: from the day after "N units ago"
    if (u === 'week') d.setDate(d.getDate() - win.last * 7 + 1);
    else if (u === 'month') { d.setMonth(d.getMonth() - win.last); d.setDate(d.getDate() + 1); }
    else if (u === 'year') { d.setFullYear(d.getFullYear() - win.last); d.setDate(d.getDate() + 1); }
    else d.setDate(d.getDate() - (win.last - 1));   // days: today and the N-1 days before it
    return { from: _spDs(d), to: today };
  }
  if (win.from || win.to) return { from: win.from || '0000-00-00', to: win.to || '9999-99-99' };
  return null;
}

// A song's plays in its own first N days (the day it was first played = day 1)
function _spFirstDaysPlays(s, n) {
  if (!s.dayMap) return 0;
  const from = _spDayOf(s.first), to = _spShift(from, Math.max(1, n) - 1);
  let c = 0;
  for (const [ds, k] of s.dayMap) if (ds <= to) c += k;
  return c;
}

// song key → plays inside the window (songs with none are missing)
function _spWinCounts(win) {
  const r = _spWinRange(win);
  if (!r) return null;
  const id = r.test ? r.id : r.from + '~' + r.to;
  let m = _spWinCache.get(id);
  if (m) return m;
  m = new Map();
  for (const p of (allPlays || [])) {
    const ds = _spDay(p);
    if (r.test ? !r.test(ds) : (ds < r.from || ds > r.to)) continue;
    const k = _spKey(p);
    m.set(k, (m.get(k) || 0) + 1);
  }
  _spWinCache.set(id, m);
  return m;
}

// ─── WHAT DATA THE USER HAS ───────────────────────────────────────────────
/* Some rules need data not every library has. The builder greys those out
   (step 5); the engine skips them rather than letting them empty the list. */

function spDataHas(need) {
  if (need === 'genres') {
    const facts = spSongFacts();
    for (const s of facts.list) if (s.genres) return true;
    // Last.fm users get genres from the tag lookups the Awards tab caches
    return typeof _awardsGenreCache !== 'undefined' &&
      Object.values(_awardsGenreCache).some(v => Array.isArray(v) && v.length);
  }
  if (need === 'ratings') {
    // Counted Listening Scores (autoscore.js) give every played song a score
    if (typeof asCounts === 'function' && asCounts()) return true;
    return typeof _ratings !== 'undefined' && _ratings.songs && Object.keys(_ratings.songs).length > 0;
  }
  // Real play times, for the habit rules (step 2)
  if (need === 'times') return spHabitFacts().timed;
  return true;
}

// A song's genre tags: its own (sheet/CSV columns), else its artist's Last.fm
// tags. null = nothing known.
function spGenresOf(s) {
  if (s.genres) return s.genres;
  if (typeof _awardsGenreCache === 'undefined') return null;
  const a = _spNorm(s.artists[0] || s.artist);
  const v = _awardsGenreCache[a];
  return (Array.isArray(v) && v.length) ? v : null;
}

// A song's rating (0–10), or null when it isn't rated. Your own score; a
// Listening Score only when "Count Listening Scores where I haven't rated"
// is on (autoscore.js, off by default)
function spRatingOf(s) {
  const key = (s.title + '|||' + s.artist).toLowerCase();
  if (typeof ratingSongScoreCounted === 'function') return ratingSongScoreCounted(key);
  if (typeof ratingSongScore !== 'function') return null;
  return ratingSongScore(key);
}

// ─── FIELDS ───────────────────────────────────────────────────────────────
/* Every field a rule can use. kind picks the conditions it offers:
     number  gte lte gt lt eq between   (v = number, or [a, b] for between)
     date    within older after before between
             (within/older: v = days; after/before: 'YYYY-MM-DD'; between: [from, to])
     text    is isNot has hasNot starts (v = text)
     list    has hasNot                 (v = text; genres)
     enum    is isNot gte lte           (v = one id or an array of ids; gte/lte
                                         use the field's order, e.g. cert)
   get(s, rule) reads the value off a song's facts; null = not known.
   needs: data a library may not have (see spDataHas).
   win: the field takes a date window (plays in the last N days). */

const SP_FIELDS = {
  title:   { kind: 'text',   get: s => s.title },
  // Any credited artist counts, so "artist is Drake" finds his features too
  artist:  { kind: 'text',   get: s => s.artists, multi: true },
  album:   { kind: 'text',   get: s => s.album },
  genre:   { kind: 'list',   get: s => spGenresOf(s), needs: 'genres' },
  release: { kind: 'enum',   get: s => s.release, values: RELEASE_TYPE_IDS_SAFE() },
  plays:   { kind: 'number', win: true, get: (s, r) => {
    if (!r || !r.win) return s.plays;
    if (r.win.first > 0) return _spFirstDaysPlays(s, r.win.first);   // its own first N days
    return (_spWinCounts(r.win) || new Map()).get(s.key) || 0;
  } },
  days:    { kind: 'number', get: s => s.days },        // distinct days it was played
  maxDay:  { kind: 'number', get: s => s.maxDay },      // most plays in one day
  first:   { kind: 'date',   get: s => s.first },
  last:    { kind: 'date',   get: s => s.last },
  rating:  { kind: 'number', get: s => spRatingOf(s), needs: 'ratings' },
  cert:    { kind: 'enum',   get: s => s.cert.tier, values: SP_CERT_ORDER, ordered: true }
};

// The release-type ids, read safely in case app.js renames the constant
function RELEASE_TYPE_IDS_SAFE() {
  return (typeof RELEASE_TYPE_IDS !== 'undefined') ? RELEASE_TYPE_IDS.slice() : ['album', 'single', 'ep', 'live', 'soundtrack'];
}

// Lets later steps (chart facts, playlists) add fields without touching this list
function spAddField(id, def) { SP_FIELDS[id] = def; }

// ─── CONDITIONS ───────────────────────────────────────────────────────────
// Each returns true / false for a known value. Unknown values never match.

function _spDayOf(ms) {
  const d = (typeof tzDate === 'function') ? tzDate(new Date(ms)) : new Date(ms);
  return (typeof localDateStr === 'function') ? localDateStr(d) : d.toISOString().slice(0, 10);
}

const SP_OPS = {
  number: {
    gte: (x, v) => x >= +v,
    lte: (x, v) => x <= +v,
    gt:  (x, v) => x > +v,
    lt:  (x, v) => x < +v,
    eq:  (x, v) => x === +v,
    between: (x, v) => Array.isArray(v) && x >= +v[0] && x <= +v[1]
  },
  date: {
    within: (x, v) => x >= Date.now() - (+v) * SP_DAY_MS,   // in the last v days
    older:  (x, v) => x <  Date.now() - (+v) * SP_DAY_MS,   // more than v days ago
    after:  (x, v) => _spDayOf(x) >= String(v),             // on or after the day
    before: (x, v) => _spDayOf(x) <= String(v),             // on or before the day
    between: (x, v) => Array.isArray(v) && _spDayOf(x) >= String(v[0]) && _spDayOf(x) <= String(v[1]),
    // During a named period: "first played last month", "last played in 2023"
    in: (x, v) => { const r = _spPeriodRange(v); if (!r) return false; const d = _spDayOf(x); return d >= r.from && d <= r.to; }
  },
  text: {
    is:      (x, v) => _spNorm(x) === _spNorm(v),
    isNot:   (x, v) => _spNorm(x) !== _spNorm(v),
    has:     (x, v) => _spNorm(x).includes(_spNorm(v)),
    hasNot:  (x, v) => !_spNorm(x).includes(_spNorm(v)),
    starts:  (x, v) => _spNorm(x).startsWith(_spNorm(v))
  },
  list: {
    has:    (x, v) => _spGenreHas(x, v),
    hasNot: (x, v) => !_spGenreHas(x, v)
  },
  enum: {
    is:    (x, v) => (Array.isArray(v) ? v : [v]).includes(x),
    isNot: (x, v) => !(Array.isArray(v) ? v : [v]).includes(x)
    // gte / lte are added per field in _spTest, since they need the field's order
  },
  // In / not in one of the user's playlists (step 6). x is the song's key.
  pl: {
    in:    (k, v) => _spPlSet(v).has(k),
    notIn: (k, v) => !_spPlSet(v).has(k)
  },
  // Yes/no facts ("has charted", "is the artist's most-played song")
  bool: {
    is: (x, v) => x === (v === true || v === 'true' || v === 1)
  }
};

/* Does a tag list have this genre? Uses the Awards tab's alias lists when
   they're there, so "rock" also finds "hard rock"-style aliases the same way
   the genre award categories do. */
function _spGenreHas(tags, g) {
  if (!Array.isArray(tags) || !tags.length) return false;
  if (typeof _genreMatch === 'function') {
    try { if (_genreMatch(tags, 'genre:' + _spNorm(g).replace(/\s+/g, '-'))) return true; } catch (e) {}
  }
  const want = _spNorm(g).replace(/[\s\-_]+/g, '');
  return tags.some(t => _spNorm(t).replace(/[\s\-_]+/g, '') === want);
}

/* One rule against one song:
     true  / false  the song matches / doesn't
     null           the rule can't be judged (unknown field or condition, or
                    data this library doesn't have) — ignored by its group */
function _spTest(rule, s, skip) {
  const f = SP_FIELDS[rule.f];
  if (!f || (f.needs && skip.has(f.needs))) return null;
  let op = SP_OPS[f.kind] && SP_OPS[f.kind][rule.op];
  if (!op && f.kind === 'enum' && f.ordered && (rule.op === 'gte' || rule.op === 'lte')) {
    const ord = f.values;
    op = rule.op === 'gte' ? (x, v) => ord.indexOf(x) >= ord.indexOf(v) : (x, v) => ord.indexOf(x) <= ord.indexOf(v);
  }
  if (!op) return null;
  const x = f.get(s, rule);
  // A yes/no fact that isn't known counts as "no" (never charted = not charted)
  if (f.kind === 'bool') return op(x === true, rule.v);
  // "Not" conditions match songs with nothing known (a song with no genre
  // tags is "not Pop"); every other condition needs a value.
  const negative = rule.op === 'isNot' || rule.op === 'hasNot';
  if (x == null || (Array.isArray(x) && !x.length)) return negative ? true : false;
  // Multi-value text (artists): positive conditions need one match,
  // negative ones need every value to pass
  if (f.multi && Array.isArray(x)) return negative ? x.every(y => op(y, rule.v)) : x.some(y => op(y, rule.v));
  return op(x, rule.v);
}

// A group (or a whole list) against one song. Rules that can't be judged drop
// out; a group left with nothing to judge matches everything.
function _spTestGroup(g, s, skip) {
  const any = g.match === 'any';
  let judged = 0;
  for (const r of (g.rules || [])) {
    const res = r.rules ? _spTestGroup(r, s, skip) : _spTest(r, s, skip);
    if (res == null) continue;
    judged++;
    if (any && res) return true;
    if (!any && !res) return false;
  }
  if (!judged) return null;
  return !any;
}

// Every field id a rule set uses, nested groups included
function _spFieldsUsed(g, out) {
  out = out || new Set();
  for (const r of (g.rules || [])) r.rules ? _spFieldsUsed(r, out) : out.add(r.f);
  return out;
}

// ─── SORTING ──────────────────────────────────────────────────────────────

/* A small seeded random, so "random" order stays the same all day instead of
   reshuffling every time the list is opened (later steps compare one day's
   result with the next to show what changed). */
function _spSeeded(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) { h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => {
    h += 0x6D2B79F5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function _spSort(songs, sort, seed) {
  const sf = (sort && sort.f) || 'plays';
  /* With no direction given, best comes first: most plays, latest date, and
     for "lowFirst" fields (peak, debut, ranks) the smallest number, #1. */
  const lowFirst = !!(SP_FIELDS[sf] && SP_FIELDS[sf].lowFirst);
  const desc = (sort && sort.dir) ? sort.dir !== 'asc' : !lowFirst;
  if (sf === 'random') {
    const rnd = _spSeeded(seed || 'sp');
    const tagged = songs.map(s => [rnd(), s]);
    tagged.sort((a, b) => a[0] - b[0]);
    return tagged.map(x => x[1]);
  }
  const f = SP_FIELDS[sf] || SP_FIELDS.plays;
  // The sort carries the same extras a rule does (win, ch), so fields read it as one
  const rule = sort || null;
  const val = s => {
    let x = f.get(s, rule);
    if (Array.isArray(x)) x = x[0];
    if (f.kind === 'enum' && f.ordered) x = f.values.indexOf(x);
    return x;
  };
  const tagged = songs.map(s => [val(s), s]);
  tagged.sort((a, b) => {
    const x = a[0], y = b[0];
    // Unknown values (unrated songs) always go last, whichever way it sorts
    if (x == null && y == null) return b[1].plays - a[1].plays;
    if (x == null) return 1;
    if (y == null) return -1;
    let c = (typeof x === 'string') ? x.localeCompare(y) : x - y;
    if (desc) c = -c;
    // Ties: more plays first, then the most recently played
    return c || (b[1].plays - a[1].plays) || (b[1].last - a[1].last);
  });
  return tagged.map(x => x[1]);
}

// ─── RUNNING A LIST ───────────────────────────────────────────────────────
/* list → {
     songs:   [{ title, artist, album, key }]  ready for the playlist code
     count:   how many songs matched before the limit
     skipped: data the list asked for that this library doesn't have
              (e.g. ['genres']) — the builder says so
   }
   opts.seed fixes the random order (default: today's date + the list's rules). */

function spRun(list, opts) {
  opts = opts || {};
  const facts = spSongFacts();
  list = list || {};
  // Ratings can change between runs without the plays changing, so the
  // average rating (step 2's aboveAvg) is worked out fresh every run
  _spAvgRating = null;
  // Playlists can change between runs too (step 6)
  _spPlSets = new Map();

  // Which "needs" this library can't meet, so those rules are skipped
  const skip = new Set();
  for (const id of _spFieldsUsed(list)) {
    const f = SP_FIELDS[id];
    if (f && f.needs && !skip.has(f.needs) && !spDataHas(f.needs)) skip.add(f.needs);
  }
  if (list.sort && SP_FIELDS[list.sort.f] && SP_FIELDS[list.sort.f].needs && !spDataHas(SP_FIELDS[list.sort.f].needs)) {
    skip.add(SP_FIELDS[list.sort.f].needs);
  }

  // Filter
  const hit = [];
  for (const s of facts.list) {
    const res = _spTestGroup(list, s, skip);
    if (res !== false) hit.push(s);   // null = no rules to judge → everything matches
  }

  // Sort, then the per-artist cap, then the size limit
  const today = (typeof localDateStr === 'function' && typeof tzNow === 'function') ? localDateStr(tzNow()) : '';
  const sorted = _spSort(hit, list.sort, opts.seed || (today + JSON.stringify(list.rules || [])));
  let out = sorted;
  if (list.perArtist > 0) {
    const per = new Map();
    out = sorted.filter(s => {
      const a = _spNorm(s.artists[0] || s.artist);
      const n = per.get(a) || 0;
      if (n >= list.perArtist) return false;
      per.set(a, n + 1);
      return true;
    });
  }
  if (list.limit > 0) out = out.slice(0, list.limit);

  return {
    songs: out.map(s => ({ title: s.title, artist: s.artist, album: s.album || '', key: s.key })),
    count: hit.length,
    skipped: [...skip]
  };
}

/* ===========================================================================
   STEP 2: CHART, HABIT AND RELATIVE FACTS

   These are heavier than the basic facts, so each group is worked out only
   the first time a rule (or a sort) asks for it, then cached until the data
   changes. A plain "most played" list never pays for any of them.
   =========================================================================== */

// ─── CHART FACTS ──────────────────────────────────────────────────────────
/* Each chart rule picks its chart with rule.ch: 'day', 'week' (default),
   'month' or 'year'. The facts come from the same chart runs the Charts tab
   and the chart-run panel use (_crFull in app.js, dyFullRun in daily.js), so
   a song's peak here is exactly the peak the site shows everywhere else,
   with the user's own chart sizes.

   Per song, per chart:
     peak     best rank
     wks      periods on the chart
     at1      periods at #1
     debut    rank in its first charting period
     climb    most places gained from one period to the next
     runs     separate chart runs (2+ = dropped off and came back)
     longest  longest unbroken run, in periods
     toPeak   periods from its debut to first hitting its peak (0 = debuted at its peak)
     at1At    when it first reached #1 (ms), for "in the order it happened"
     peakAt   when it first hit its peak (ms) */

const SP_CHARTS = ['day', 'week', 'month', 'year'];
let _spChartCache = {};   // ch → { gen, map: songKey → facts }

// The chart a rule asked for, with weekly as the default
function _spCh(r) { return (r && SP_CHARTS.includes(r.ch)) ? r.ch : 'week'; }

// A chart's period key → the period's first moment (ms)
function _spKeyMs(key) {
  if (key.length === 4) return +new Date(key + '-01-01T00:00:00');
  if (key.length === 7) return +new Date(key + '-01T00:00:00');
  return +new Date(key + 'T00:00:00');
}

// The calendar period just before this one, in the chart's own key format.
// Used to tell an unbroken run from a comeback.
function _spPrevKey(ch, key) {
  if (ch === 'year') return String(+key - 1);
  if (ch === 'month') {
    let [y, m] = key.split('-').map(Number);
    m--; if (!m) { m = 12; y--; }
    return y + '-' + String(m).padStart(2, '0');
  }
  const d = new Date(key + 'T12:00:00');
  d.setDate(d.getDate() - (ch === 'week' ? 7 : 1));
  return (typeof localDateStr === 'function') ? localDateStr(d) : d.toISOString().slice(0, 10);
}

// The full-history songs run for a chart: { songKey → { entries, peak } }
function _spRunSongs(ch) {
  try {
    if (ch === 'day') return (typeof dyFullRun === 'function') ? dyFullRun().result.songs : {};
    return (typeof _crFull === 'function') ? _crFull(ch).result.songs : {};
  } catch (e) { return {}; }
}

function spChartFacts(ch) {
  // The chart runs also change with the chart sizes, which _crGeneration covers
  const gen = _spGeneration() + '|' + ((typeof _crGeneration === 'function') ? _crGeneration() : '');
  const c = _spChartCache[ch];
  if (c && c.gen === gen) return c.map;
  const map = new Map();
  const songs = _spRunSongs(ch);
  for (const k in songs) {
    const E = songs[k].entries || [];
    if (!E.length) continue;
    const peak = songs[k].peak;
    let at1 = 0, climb = 0, runs = 0, longest = 0, cur = 0, at1At = null, peakAt = null, toPeak = 0;
    for (let i = 0; i < E.length; i++) {
      const e = E[i];
      if (e.rank === 1) { at1++; if (at1At == null) at1At = _spKeyMs(e.periodKey); }
      if (peakAt == null && e.rank === peak) { peakAt = _spKeyMs(e.periodKey); toPeak = i; }
      // Unbroken when the entry before is the calendar period right before
      const joined = i > 0 && E[i - 1].periodKey === _spPrevKey(ch, e.periodKey);
      if (joined) {
        cur++;
        const up = E[i - 1].rank - e.rank;
        if (up > climb) climb = up;
      } else { runs++; cur = 1; }
      if (cur > longest) longest = cur;
    }
    // E rides along for the "around the chart" rules (on the chart now, new
    // entry, re-entry, dropped off), which look up one period in it
    map.set(k, { peak, wks: E.length, at1, debut: E[0].rank, climb, runs, longest, toPeak, at1At, peakAt, E });
  }
  _spChartCache[ch] = { gen, map };
  return map;
}

// One chart fact for a song, or null when it never charted on that chart
function _spChartGet(name) {
  return (s, r) => { const f = spChartFacts(_spCh(r)).get(s.key); return f ? f[name] : null; };
}

// chart: true = the rule picks its chart (rule.ch). lowFirst = smaller is better.
spAddField('charted',  { kind: 'bool',   chart: true, get: (s, r) => spChartFacts(_spCh(r)).has(s.key) });
spAddField('peak',     { kind: 'number', chart: true, get: _spChartGet('peak'), lowFirst: true });
spAddField('wks',      { kind: 'number', chart: true, get: _spChartGet('wks') });
spAddField('at1',      { kind: 'number', chart: true, get: _spChartGet('at1') });
spAddField('debut',    { kind: 'number', chart: true, get: _spChartGet('debut'), lowFirst: true });
spAddField('climb',    { kind: 'number', chart: true, get: _spChartGet('climb') });
spAddField('runs',     { kind: 'number', chart: true, get: _spChartGet('runs') });
spAddField('longest',  { kind: 'number', chart: true, get: _spChartGet('longest') });
spAddField('toPeak',   { kind: 'number', chart: true, get: _spChartGet('toPeak') });
spAddField('at1At',    { kind: 'date',   chart: true, get: _spChartGet('at1At') });
spAddField('peakAt',   { kind: 'date',   chart: true, get: _spChartGet('peakAt') });

// ─── AROUND THE CHART ─────────────────────────────────────────────────────
/* The lists that sit around each chart on the chart pages, as rules:
     onChart   on that chart in the period
     newEntry  first time ever on that chart (a New Entry)
     reEntry   back on that chart after time off it
     offChart  on the chart the period before, not in this one (Off the Chart)
     buNow     in the Bubbling Under zone in the period (Daily / Weekly only,
               like the chart pages)
     buWks     periods spent in Bubbling Under, all time
     buPeak    best Bubbling Under spot (1 = just under the chart)
   rule.when picks which charts count (since 2026-11-16 more than two):
     'now' (or none)  the running day / week / month / year (what the chart
                      pages open on)
     'last'           the one before it, finished
     'ago'            r.n charts back ("3 weeks ago")
     'yearAgo'        the chart for the same day one year ago
     'ever'           any chart, all time
     'lastN'          any of the last r.n charts (the running one included)
     'allLastN'       every one of the last r.n charts (on the chart / in
                      Bubbling Under only: "stayed on for 4 weeks running")
     'period'         any chart in r.per, a period code (see SP_PERIODS):
                      last month, a year, a month, a season…
     'date'           the one chart that holds day r.d
     'range'          any chart from day r.d to day r.d2
   A chart counts for a period when it overlaps it (a week that starts in
   October still counts for "during November" if it runs into it). */

const SP_BU_CHARTS = ['day', 'week'];   // Bubbling Under only runs on these
const SP_WHENS = ['now', 'last', 'ago', 'yearAgo', 'ever', 'lastN', 'allLastN', 'period', 'date', 'range'];

// The chart key a day string falls in: the day, its week's first day, 'YYYY-MM', 'YYYY'
function _spKeyOf(ch, ds) {
  if (ch === 'day') return ds;
  if (ch === 'month') return ds.slice(0, 7);
  if (ch === 'year') return ds.slice(0, 4);
  const d = new Date(ds + 'T12:00:00');
  const wsd = (typeof weekStartDay !== 'undefined') ? weekStartDay : 1;
  d.setDate(d.getDate() - (d.getDay() - wsd + 7) % 7);
  return _spDs(d);
}

// The running period's key for a chart, never the period the user is viewing
function _spNowKey(ch) { return _spKeyOf(ch, _spToday()); }

// The chart period after this one (the other way round from _spPrevKey)
function _spNextKey(ch, key) {
  if (ch === 'year') return String(+key + 1);
  if (ch === 'month') {
    let [y, m] = key.split('-').map(Number);
    m++; if (m > 12) { m = 1; y++; }
    return y + '-' + String(m).padStart(2, '0');
  }
  return _spShift(key, ch === 'week' ? 7 : 1);
}

/* Which charts a rule's "when" means, as { has(key), list, every }:
   has    does this chart count
   list   the charts, when there's a short fixed set of them
   every  the song must be in every one of them, not just one
   Keys never go past the running chart. Kept per rule and day. */
let _spWhenCache = new Map();
function _spWhenSet(r, ch) {
  const w = (r && SP_WHENS.includes(r.when)) ? r.when : 'now';
  const n = Math.max(1, Math.min(520, Math.round(+(r && r.n) || 1)));
  const now = _spNowKey(ch);
  const id = [ch, w, n, r && r.per, r && r.d, r && r.d2, now].join('|');
  let m = _spWhenCache.get(id);
  if (m) return m;
  const one = k => ({ has: x => x === k, list: [k], every: false });
  const back = (k, steps) => { for (let i = 0; i < steps; i++) k = _spPrevKey(ch, k); return k; };
  const span = (a, b) => ({ has: x => x >= a && x <= b && x <= now, list: null, every: false });
  if (w === 'last') m = one(_spPrevKey(ch, now));
  else if (w === 'ago') m = one(back(now, n));
  else if (w === 'yearAgo') m = one(_spKeyOf(ch, (+_spToday().slice(0, 4) - 1) + _spToday().slice(4)));
  else if (w === 'ever') m = span('0', now);
  else if (w === 'lastN' || w === 'allLastN') {
    const list = [now];
    while (list.length < n) list.push(_spPrevKey(ch, list[list.length - 1]));
    const set = new Set(list);
    m = { has: x => set.has(x), list, every: w === 'allLastN' };
  } else if (w === 'period') {
    const p = _spPeriodRange(r.per);
    m = p ? span(_spKeyOf(ch, p.from), _spKeyOf(ch, p.to)) : one('none');
  } else if (w === 'date') m = /^\d{4}-\d{2}-\d{2}$/.test(r.d || '') ? one(_spKeyOf(ch, r.d)) : one('none');
  else if (w === 'range') {
    const a = /^\d{4}-\d{2}-\d{2}$/.test(r.d || '') ? r.d : '0000-00-00', b = /^\d{4}-\d{2}-\d{2}$/.test(r.d2 || '') ? r.d2 : _spToday();
    m = span(_spKeyOf(ch, a <= b ? a : b), _spKeyOf(ch, a <= b ? b : a));
  } else m = one(now);
  if (_spWhenCache.size > 200) _spWhenCache.clear();
  _spWhenCache.set(id, m);
  return m;
}

// Where period `key` sits in a chronological entry list (-1 = not there).
// Walks back from the end, since rules almost always ask about recent periods.
function _spEntryAt(E, key) {
  for (let i = E.length - 1; i >= 0; i--) {
    const pk = E[i].periodKey;
    if (pk === key) return i;
    if (pk < key) return -1;
  }
  return -1;
}

// A yes/no fact about a song's chart run in the charts the rule's "when" means
function _spAroundGet(test) {
  return (s, r) => {
    const ch = _spCh(r);
    const f = spChartFacts(ch).get(s.key);
    if (!f) return false;   // never charted: not on it, not new, not dropped
    return test(f.E, _spWhenSet(r, ch), ch);
  };
}

// On the chart: in one of the charts (or every one of them, for "each of the last N")
spAddField('onChart',  { kind: 'bool', chart: true, when: true, every: true, get: _spAroundGet((E, M) =>
  M.every ? M.list.every(k => _spEntryAt(E, k) >= 0) : (M.list ? M.list.some(k => _spEntryAt(E, k) >= 0) : E.some(e => M.has(e.periodKey)))) });
// New entry: its very first chart is one of them
spAddField('newEntry', { kind: 'bool', chart: true, when: true, get: _spAroundGet((E, M) => M.has(E[0].periodKey)) });
// Re-entry: it came back in one of them, after at least one chart away
spAddField('reEntry',  { kind: 'bool', chart: true, when: true, get: _spAroundGet((E, M, ch) =>
  E.some((e, i) => i > 0 && M.has(e.periodKey) && E[i - 1].periodKey !== _spPrevKey(ch, e.periodKey))) });
// Off the Chart: one of them is the first chart it was missing from, after being on the one before
spAddField('offChart', { kind: 'bool', chart: true, when: true, get: _spAroundGet((E, M, ch) => {
  const now = _spNowKey(ch);
  return E.some((e, i) => { const nk = _spNextKey(ch, e.periodKey); return nk <= now && M.has(nk) && (i + 1 >= E.length || E[i + 1].periodKey !== nk); });
}) });

/* Bubbling Under history for songs: songKey → { keys: Set of periods, wks, peak }.
   Daily reads the zones daily.js already stores; weekly runs the chart page's
   own BU builder, with the weekly chart sizes in place (the builder reads the
   sizes of whatever chart is on screen). */
let _spBuCache = {};
function _spBuFacts(ch) {
  ch = ch === 'day' ? 'day' : 'week';
  let gen = '', zones = null;
  try {
    if (ch === 'day') {
      if (typeof dyHistory !== 'function') return new Map();
      const h = dyHistory();
      gen = 'd|' + h.gen;
      if (_spBuCache[ch] && _spBuCache[ch].gen === gen) return _spBuCache[ch].map;
      zones = [];
      for (const day of h.days) for (const z of (h.bu.songs[day] || [])) zones.push([z.k, day, z.buRank]);
    } else {
      if (typeof _buildBuChartRunFull !== 'function') return new Map();
      gen = 'w|' + _crGeneration();
      if (_spBuCache[ch] && _spBuCache[ch].gen === gen) return _spBuCache[ch].map;
      const keep = [chartSizeSongs, chartSizeArtists, chartSizeAlbums];
      let run;
      try {
        chartSizeSongs = chartSizeSongsW; chartSizeArtists = chartSizeArtistsW; chartSizeAlbums = chartSizeAlbumsW;
        run = _buildBuChartRunFull();
      } finally { [chartSizeSongs, chartSizeArtists, chartSizeAlbums] = keep; }
      zones = [];
      for (const k in run.result.songs) for (const e of run.result.songs[k].entries) zones.push([k, e.periodKey, e.buRank]);
    }
  } catch (e) { return new Map(); }
  const map = new Map();
  for (const [k, pk, rank] of zones) {
    const x = map.get(k) || { keys: new Set(), wks: 0, peak: Infinity };
    x.keys.add(pk); x.wks++; if (rank < x.peak) x.peak = rank;
    map.set(k, x);
  }
  _spBuCache[ch] = { gen, map };
  return map;
}

function _spBuCh(r) { return r && r.ch === 'day' ? 'day' : 'week'; }
spAddField('buNow',  { kind: 'bool',   chart: true, buOnly: true, when: true, every: true, get: (s, r) => {
  const ch = _spBuCh(r), x = _spBuFacts(ch).get(s.key);
  if (!x) return false;
  const M = _spWhenSet(r, ch);
  if (M.every) return M.list.every(k => x.keys.has(k));
  if (M.list) return M.list.some(k => x.keys.has(k));
  for (const k of x.keys) if (M.has(k)) return true;
  return false;
} });
spAddField('buWks',  { kind: 'number', chart: true, buOnly: true, get: (s, r) => { const x = _spBuFacts(_spBuCh(r)).get(s.key); return x ? x.wks : 0; } });
spAddField('buPeak', { kind: 'number', chart: true, buOnly: true, lowFirst: true, get: (s, r) => { const x = _spBuFacts(_spBuCh(r)).get(s.key); return x ? x.peak : null; } });

// ─── LISTENING HABITS ─────────────────────────────────────────────────────
/* When in the day and week a song gets played. Needs real play times: a
   date-only Google Sheet puts every play at midnight, so those libraries get
   these rules greyed out (spDataHas('times')).

   Per song:
     morning    % of plays from 04:00 to 11:59
     afternoon  % of plays from 12:00 to 17:29
     evening    % of plays from 17:30 to 19:59
     night      % of plays from 20:00 to 00:59
     lateNight  % of plays from 01:00 to 03:59
     topPart    the part of the day it's played most (morning … late night)
     weekend    % of plays on Saturday or Sunday
     topHour    the hour (0–23) it's played most
     topDay     the weekday ('0' = Sunday … '6' = Saturday) it's played most
   The parts of the day are the user's own (2026-11-09). */

// Where each part of the day starts, in minutes after midnight, in clock
// order from midnight. Night runs from 20:00 round past midnight to 01:00.
const SP_PARTS = [['lateNight', 1 * 60], ['morning', 4 * 60], ['afternoon', 12 * 60], ['evening', 17 * 60 + 30], ['night', 20 * 60]];
// The order they're offered in (the day as people think of it)
const SP_PART_IDS = ['morning', 'afternoon', 'evening', 'night', 'lateNight'];
function _spPartOf(mins) {
  let part = 'night';   // 00:00–00:59 is still the night before
  for (const [id, from] of SP_PARTS) if (mins >= from) part = id;
  return part;
}
let _spHabitCache = null;   // { gen, map, timed }

function spHabitFacts() {
  const gen = _spGeneration();
  if (_spHabitCache && _spHabitCache.gen === gen) return _spHabitCache;
  const raw = new Map();
  let timed = 0, total = 0;
  for (const p of (allPlays || [])) {
    const td = (typeof tzDateOf === 'function') ? tzDateOf(p) : p.date;
    const h = td.getHours(), wd = td.getDay();
    total++;
    if (h || td.getMinutes()) timed++;
    const k = _spKey(p);
    let x = raw.get(k);
    if (!x) raw.set(k, x = { n: 0, morning: 0, afternoon: 0, evening: 0, night: 0, lateNight: 0, weekend: 0, hours: new Array(24).fill(0), days: new Array(7).fill(0) });
    x.n++;
    x[_spPartOf(h * 60 + td.getMinutes())]++;
    if (wd === 0 || wd === 6) x.weekend++;
    x.hours[h]++; x.days[wd]++;
  }
  const argmax = a => a.reduce((bi, v, i) => v > a[bi] ? i : bi, 0);
  const map = new Map();
  for (const [k, x] of raw) {
    const parts = SP_PART_IDS.map(id => x[id]);
    map.set(k, {
      morning: Math.round(x.morning / x.n * 100),
      afternoon: Math.round(x.afternoon / x.n * 100),
      evening: Math.round(x.evening / x.n * 100),
      night: Math.round(x.night / x.n * 100),
      lateNight: Math.round(x.lateNight / x.n * 100),
      topPart: SP_PART_IDS[argmax(parts)],
      weekend: Math.round(x.weekend / x.n * 100),
      topHour: argmax(x.hours),
      topDay: String(argmax(x.days))
    });
  }
  // A library "has times" when at least a fifth of its plays aren't at midnight
  _spHabitCache = { gen, map, timed: total > 0 && timed / total >= 0.2 };
  return _spHabitCache;
}

function _spHabitGet(name) {
  return s => { const h = spHabitFacts().map.get(s.key); return h ? h[name] : null; };
}
spAddField('morning',   { kind: 'number', needs: 'times', get: _spHabitGet('morning') });
spAddField('afternoon', { kind: 'number', needs: 'times', get: _spHabitGet('afternoon') });
spAddField('evening',   { kind: 'number', needs: 'times', get: _spHabitGet('evening') });
spAddField('night',     { kind: 'number', needs: 'times', get: _spHabitGet('night') });
spAddField('lateNight', { kind: 'number', needs: 'times', get: _spHabitGet('lateNight') });
spAddField('topPart',   { kind: 'enum',   needs: 'times', get: _spHabitGet('topPart'), values: SP_PART_IDS });
spAddField('weekend', { kind: 'number', needs: 'times', get: _spHabitGet('weekend') });
spAddField('topHour', { kind: 'number', needs: 'times', get: _spHabitGet('topHour') });
spAddField('topDay',  { kind: 'enum',   needs: 'times', get: _spHabitGet('topDay'), values: ['0', '1', '2', '3', '4', '5', '6'] });

// ─── RELATIVE FACTS ───────────────────────────────────────────────────────
/* How a song stands next to the rest of the library:
     rankAll      its place by plays across the whole library (1 = most played)
     topPct       that place as a percentage: "top 5%" = topPct ≤ 5
     artistBest   it's its artist's most-played song
     artistShare  % of its artist's plays that are this song (high = a one-hit wonder)
     artistPlays  its artist's total plays
     artistSongs  how many songs its artist has (a one-hit wonder needs 2+)
     albumPlays   its album's total plays (deep cuts: a loved album…)
     albumRank    its place by plays inside its album (…where it sits low)
     albumTop     its album's place among all albums by plays (1 = most played album)
     aboveAvg     its rating is above the user's average song rating (needs ratings)
   Artists here are the primary credited artist, as the per-artist cap uses. */

let _spRelCache = null;   // { gen, map }

function spRelativeFacts() {
  const gen = _spGeneration();
  if (_spRelCache && _spRelCache.gen === gen) return _spRelCache.map;
  const list = spSongFacts().list;
  const byPlays = list.slice().sort((a, b) => b.plays - a.plays || b.last - a.last);
  const art = new Map(), alb = new Map();
  for (const s of list) {
    const a = _spNorm(s.artists[0] || s.artist);
    const ax = art.get(a) || { n: 0, songs: 0, best: null };
    ax.n += s.plays; ax.songs++;
    if (!ax.best || s.plays > ax.best.plays) ax.best = s;
    art.set(a, ax);
    if (s.album) {
      const ak = _spNorm(s.album) + '|||' + a;
      if (!alb.has(ak)) alb.set(ak, []);
      alb.get(ak).push(s);
    }
  }
  const map = new Map();
  byPlays.forEach((s, i) => {
    const ax = art.get(_spNorm(s.artists[0] || s.artist));
    map.set(s.key, {
      rankAll: i + 1,
      topPct: Math.max(1, Math.ceil((i + 1) / byPlays.length * 100)),
      artistBest: ax.best === s,
      artistShare: Math.round(s.plays / ax.n * 100),
      artistPlays: ax.n,
      artistSongs: ax.songs,
      albumPlays: null, albumRank: null, albumTop: null
    });
  });
  /* "Its album's place among all albums" ranks albums proper: a single or
     EP set Apart or Leave out in Settings → Releases is not an album here,
     so its songs get no albumTop (and the albums behind it move up). */
  const _sepOn = typeof albumBucketsOn === 'function' && albumBucketsOn();
  const albums = [...alb.values()]
    .filter(songs => !_sepOn || albumBucketOf(songs[0].album, songs[0].artist) === 'album')
    .map(songs => ({ songs, total: songs.reduce((t, s) => t + s.plays, 0) }));
  albums.sort((a, b) => b.total - a.total);
  albums.forEach(({ songs, total }, ai) => {
    songs.sort((a, b) => b.plays - a.plays).forEach((s, i) => {
      const m = map.get(s.key);
      m.albumPlays = total; m.albumRank = i + 1; m.albumTop = ai + 1;
    });
  });
  _spRelCache = { gen, map };
  return map;
}

function _spRelGet(name) {
  return s => { const m = spRelativeFacts().get(s.key); return m ? m[name] : null; };
}
spAddField('rankAll',     { kind: 'number', get: _spRelGet('rankAll'), lowFirst: true });
spAddField('topPct',      { kind: 'number', get: _spRelGet('topPct'), lowFirst: true });
spAddField('artistBest',  { kind: 'bool',   get: _spRelGet('artistBest') });
spAddField('artistShare', { kind: 'number', get: _spRelGet('artistShare') });
spAddField('artistPlays', { kind: 'number', get: _spRelGet('artistPlays') });
spAddField('artistSongs', { kind: 'number', get: _spRelGet('artistSongs') });
spAddField('albumPlays',  { kind: 'number', get: _spRelGet('albumPlays') });
spAddField('albumRank',   { kind: 'number', get: _spRelGet('albumRank'), lowFirst: true });
spAddField('albumTop',    { kind: 'number', get: _spRelGet('albumTop'), lowFirst: true });

// The user's average song rating; spRun clears it at the start of every run
let _spAvgRating = null;
function _spRatingAvg() {
  if (_spAvgRating != null) return _spAvgRating;
  if (typeof _ratings === 'undefined' || typeof ratingSongScore !== 'function') return (_spAvgRating = NaN);
  let sum = 0, n = 0;
  if (typeof asCounts === 'function' && asCounts()) {
    // Counting Listening Scores: the average of every song's counted score
    for (const s of spSongFacts().list) { const v = spRatingOf(s); if (v != null) { sum += v; n++; } }
  } else {
    for (const k in _ratings.songs) { const v = ratingSongScore(k); if (v != null) { sum += v; n++; } }
  }
  return (_spAvgRating = n ? sum / n : NaN);
}
spAddField('aboveAvg', { kind: 'bool', needs: 'ratings', get: s => {
  const v = spRatingOf(s), avg = _spRatingAvg();
  return (v == null || isNaN(avg)) ? null : v > avg;
} });

/* ===========================================================================
   STEP 3: SMART PLAYLISTS IN THE PLAYLISTS TAB

   A smart playlist is a normal playlist (_ytPlaylists in app.js, so the
   player, Play / Shuffle, export and the player's own list all just work)
   plus a saved rule set here. Whenever the data loads or the list is opened,
   the rules run again and the playlist's songs are replaced with the result.

   Rules are stored on their own (localStorage 'dc-smart-playlists', and the
   Firestore doc users/{uid}/data/smartPlaylists for signed-in users), with
   the same "last change wins, deletions stick" merge the playlists use, so a
   smart list made on one device shows up on the others.

   Songs can't be added, removed or dragged by hand: the rules decide. app.js
   asks spIsSmart() in those places and shows spLockedToast() instead.
   =========================================================================== */

const SP_LS = 'dc-smart-playlists';
/* The most songs a smart playlist keeps. The songs sync inside the one
   Firestore playlists doc (1 MB at most), so "every song I've ever played"
   can't be allowed to fill it and break syncing for every playlist. */
const SP_MAX_SONGS = 500;

/* lists: name → rules; modified / deleted: name → ms (for the merge);
   seeded: the ready-made lists have been added once (step 4) */
let _spStore = { lists: {}, modified: {}, deleted: {}, seeded: false };

function _spLoad() {
  try {
    const v = JSON.parse(localStorage.getItem(SP_LS) || 'null');
    if (v && v.lists) _spStore = { lists: v.lists, modified: v.modified || {}, deleted: v.deleted || {}, seeded: !!v.seeded };
  } catch (e) {}
}
_spLoad();

// Saves locally, and to the account when signed in
function _spSave() {
  const json = JSON.stringify(_spStore);
  try { localStorage.setItem(SP_LS, json); } catch (e) {}
  if (typeof dcSaveSmartPlaylists === 'function') dcSaveSmartPlaylists(json);
}

// A rule set with the song cap applied, for running into a playlist
function _spCapped(def) {
  return Object.assign({}, def, { limit: Math.min(SP_MAX_SONGS, def.limit > 0 ? def.limit : SP_MAX_SONGS) });
}

function spIsSmart(name) { return !!(name && _spStore.lists[name]); }
function spGet(name) { return _spStore.lists[name] || null; }
function spNames() { return Object.keys(_spStore.lists); }

// Only the parts of a rule set that mean something are kept
function _spClean(def) {
  const out = { match: def.match === 'any' ? 'any' : 'all', rules: def.rules || [] };
  if (def.sort) out.sort = def.sort;
  // The size the user picked (none = as many as match, up to SP_MAX_SONGS)
  if (def.limit > 0) out.limit = Math.min(SP_MAX_SONGS, +def.limit);
  if (def.perArtist > 0) out.perArtist = +def.perArtist;
  if (def.ready) out.ready = def.ready;   // which ready-made list it came from (step 4)
  if (def.readyOpt) out.readyOpt = def.readyOpt;   // its picker setting (year, day / week)
  if (def.readyEdited) out.readyEdited = true;     // its rules were changed in the builder (step 5)
  if (def.notify) out.notify = true;               // tell me when it changes a lot (step 9)
  return out;
}

/* Makes (or replaces) a smart playlist. Returns false when the name belongs
   to a normal playlist or to Favorites, which a smart one must never
   overwrite. */
function spCreate(name, def) {
  name = String(name || '').trim();
  if (!name || !spSignedIn()) return false;
  if (typeof _ytIsFavName === 'function' && _ytIsFavName(name)) return false;
  if (_ytPlaylists[name] && !spIsSmart(name)) return false;
  _spStore.lists[name] = _spClean(def || {});
  _spStore.modified[name] = Date.now();
  delete _spStore.deleted[name];
  _spSave();
  spRefresh(name, true);
  return true;
}

/* Runs one smart playlist's rules and puts the result into its playlist.
   Only writes (and syncs) when the songs actually changed, so opening a list
   doesn't touch its "updated" time. Never runs before the data has loaded:
   an empty library would wipe every smart list. Returns true when changed. */
function spRefresh(name, save) {
  const def = spGet(name);
  if (!def || !allPlays || !allPlays.length || !spSignedIn()) return false;
  // Smart lists this one's rules read go first, so it sees their current
  // songs (step 6). _spRefreshing stops a loop from going round forever.
  if (_spRefreshing.has(name)) return false;
  _spRefreshing.add(name);
  let depChanged = false;
  try {
    for (const dep of spDeps(def)) if (spIsSmart(dep) && spRefresh(dep, false)) depChanged = true;
  } finally { _spRefreshing.delete(name); }
  if (depChanged && save !== false && typeof _ytSavePlaylists === 'function') _ytSavePlaylists();
  const res = spRun(_spCapped(def));
  const tracks = res.songs.map(s => ({ title: s.title, artist: s.artist, album: s.album || '' }));
  const old = _ytPlaylists[name];
  if (old && JSON.stringify(old) === JSON.stringify(tracks)) return false;
  _ytPlaylists[name] = tracks;
  if (typeof _ytTouchPlaylist === 'function') _ytTouchPlaylist(name);
  if (save !== false && typeof _ytSavePlaylists === 'function') _ytSavePlaylists();
  // A list's first fill is where "what changed" starts from (step 7)
  if (!_spSeenGet(name)) _spSeenSet(name, tracks);
  return true;
}

// Every smart playlist, after a data load / refresh / sign-in. One save at the end.
let _spRefreshTok = 0;
function spRefreshAll() {
  if (!allPlays || !allPlays.length || !spSignedIn()) return;
  _spFixReadyNames();
  if (!_spStore.seeded) spSeedReady();
  // One list per tick: the first chart rule on a huge library can take a
  // second to build, and the page should stay usable meanwhile. A newer call
  // (data refreshed again) takes over from an older one.
  const tok = ++_spRefreshTok;
  const names = spNames();
  let changed = false, i = 0;
  const next = () => {
    if (tok !== _spRefreshTok) return;
    if (i < names.length) {
      if (spRefresh(names[i++], false)) changed = true;
      setTimeout(next, 0);
      return;
    }
    if (!changed) return;
    if (typeof _ytSavePlaylists === 'function') _ytSavePlaylists();
    if (typeof currentPeriod !== 'undefined' && currentPeriod === 'playlists' && typeof dcRenderPlaylistsView === 'function') dcRenderPlaylistsView();
    spNotifyWatch();   // step 9
  };
  setTimeout(next, 0);
}

// app.js: a playlist was deleted → its rules go too (and stay deleted on other devices)
function spOnDelete(name) {
  if (!spIsSmart(name)) return;
  delete _spStore.lists[name];
  delete _spStore.modified[name];
  _spStore.deleted[name] = Date.now();
  _spSave();
  _spSeenMove(name, null);   // step 7
}

// app.js: a playlist was renamed → its rules follow it
function spOnRename(oldName, newName) {
  if (oldName === newName) return;
  // Rules that point at the renamed playlist follow it (step 6)
  let refs = false;
  for (const n of spNames()) {
    if (_spRenameRefs(_spStore.lists[n], oldName, newName)) { _spStore.modified[n] = Date.now(); refs = true; }
  }
  if (!spIsSmart(oldName)) { if (refs) _spSave(); return; }
  _spStore.lists[newName] = _spStore.lists[oldName];
  delete _spStore.lists[oldName];
  delete _spStore.modified[oldName];
  _spStore.modified[newName] = Date.now();
  delete _spStore.deleted[newName];
  _spStore.deleted[oldName] = Date.now();
  _spSave();
  _spSeenMove(oldName, newName);   // step 7
}

/* Sign-in: the account's rules merged with this device's. For each name the
   newest action wins: a create/edit keeps it, a delete drops it. Deletion
   records are kept for a year so a stale device can't bring a list back. */
function spMerge(remote) {
  if (remote && remote.lists) {
    const rMod = remote.modified || {};
    const L = Object.assign({}, remote.lists, _spStore.lists);   // this device wins a same-name tie
    const M = Object.assign({}, rMod);
    for (const [n, ts] of Object.entries(_spStore.modified)) if (!M[n] || ts > M[n]) M[n] = ts;
    const D = Object.assign({}, remote.deleted || {});
    for (const [n, ts] of Object.entries(_spStore.deleted)) if (!D[n] || ts > D[n]) D[n] = ts;
    for (const n of Object.keys(L)) {
      // The newer edit's rules win, whichever device has them
      if (remote.lists[n] && _spStore.lists[n] && (rMod[n] || 0) > (_spStore.modified[n] || 0)) L[n] = remote.lists[n];
      if ((D[n] || 0) > (M[n] || 0)) {
        delete L[n];
        // The songs went with it on the other device; drop them here too
        if (_ytPlaylists[n] && typeof _ytMarkPlaylistDeleted === 'function') { _ytMarkPlaylistDeleted(n); _ytSavePlaylists(); }
      }
    }
    // One copy per ready-made list: the account's (older) copy wins
    const seen = new Map();
    for (const n of Object.keys(remote.lists).concat(Object.keys(_spStore.lists))) {
      const id = L[n] && L[n].ready;
      if (!id) continue;
      if (!seen.has(id)) { seen.set(id, n); continue; }
      if (seen.get(id) === n) continue;
      delete L[n]; delete M[n];
      D[n] = Date.now();
      if (_ytPlaylists[n]) { delete _ytPlaylists[n]; if (typeof _ytSavePlaylists === 'function') _ytSavePlaylists(); }
    }
    const YEAR = 365 * SP_DAY_MS;
    for (const n of Object.keys(D)) if (n in L || Date.now() - D[n] > YEAR) delete D[n];
    _spStore = { lists: L, modified: M, deleted: D, seeded: !!(remote.seeded || _spStore.seeded) };
  }
  _spSave();
  spRefreshAll();
}

// ─── THE RULES IN PLAIN WORDS ─────────────────────────────────────────────
/* One sentence under a smart playlist's title, e.g.
     "Plays at least 50, last played more than 180 days ago · sorted by plays · up to 50 songs"
   Built from translation pieces (sp_f_* field names, sp_o_* conditions), so
   it reads in all four languages. Steps 5 and 10 reuse it (builder preview,
   Board posts). */

// Percentages get a % sign in the sentence
const SP_PCT_FIELDS = ['morning', 'afternoon', 'evening', 'night', 'lateNight', 'weekend', 'artistShare', 'topPct'];

// The words for a rule's chart: "weekly" and its unit, "weeks", and for the
// "around the chart" rules the period: "this week" / "last week"
function _spChWords(r) {
  const ch = _spCh(r);
  return { ch: t('sp_ch_' + ch), units: t('sp_u_' + ch), when: _spWhenWords(r, ch) };
}

/* A rule's "when" in words, to follow "on the weekly chart":
   "this week", "3 weeks ago", "at any time", "in the last 4 weeks",
   "last month", "in 2023", "(Week of 3 Nov 2025)", "from … to …" */
function _spWhenWords(r, ch) {
  const w = r && r.when;
  const n = Math.max(1, Math.round(+(r && r.n) || 1));
  const units = t('sp_u_' + ch);
  if (w === 'last') return t('sp_when_last_' + ch);
  if (w === 'ago') return t('sp_whenw_ago', { n, units });
  if (w === 'yearAgo') return t('sp_when_yearAgo_' + ch);
  if (w === 'ever') return t('sp_whenw_ever');
  if (w === 'lastN') return t('sp_whenw_lastN_' + ch, { n });
  if (w === 'allLastN') return t('sp_whenw_allLastN_' + ch, { n });
  if (w === 'period') return spPeriodWords(r.per);
  if (w === 'date' && r.d) {
    const key = _spKeyOf(ch, r.d);
    const title = (typeof crPeriodTitle === 'function') ? crPeriodTitle(ch, key) : key;
    return t('sp_whenw_date', { d: title });
  }
  if (w === 'range') return t('sp_whenw_range', { a: _spFmtDay(r.d), b: _spFmtDay(r.d2) });
  return t('sp_when_now_' + ch);
}

// A field's name, with its chart or date window filled in
function spFieldLabel(id, r) {
  const f = SP_FIELDS[id];
  if (!f) return id;
  if (id === 'otd') return t((r && +r.span === 0) ? 'sp_f_otd_day' : 'sp_f_otd_week');
  if (id === 'plays' && r && r.win) {
    const w = r.win;
    // Named periods: "plays last month", "plays in March 2025"
    if (w.p === 'monthPast') return t('sp_f_plays_monthPast', { m: _spMonthName(_spToday().slice(0, 7), false) });
    if (w.p) return t('sp_f_plays_when', { w: spPeriodWords(w.p) });
    if (w.first > 0) return t('sp_f_plays_first', { n: w.first });
    if (w.last > 0 && w.unit && w.unit !== 'day') return t('sp_f_plays_lastu_' + w.unit, { n: w.last });
    // A whole calendar year reads "plays in 2025"
    const y = String(w.from || '').slice(0, 4);
    if (w.from === y + '-01-01' && w.to === y + '-12-31') return t('sp_f_plays_year', { y });
    if (r.win.last > 0) return t('sp_f_plays_last', { n: r.win.last });
    return t('sp_f_plays_range', { a: _spFmtDay(r.win.from), b: _spFmtDay(r.win.to) });
  }
  return t('sp_f_' + id, f.chart ? _spChWords(r) : undefined);
}

// 'YYYY-MM' → "March 2025" (or just "March"), in the site's language
function _spMonthName(ym, withYear = true) {
  try {
    const d = new Date(+ym.slice(0, 4), +ym.slice(5, 7) - 1, 15);
    return d.toLocaleDateString(currentLang || 'en', withYear ? { month: 'long', year: 'numeric' } : { month: 'long' });
  } catch (e) { return ym; }
}

/* A period code in words, ready to follow "plays" or "first played":
   "today", "last week", "in 2023", "in March 2025", "in summer 2025" */
function spPeriodWords(code) {
  code = String(code || '');
  const ch = { today: 'now_day', yesterday: 'last_day', thisWeek: 'now_week', lastWeek: 'last_week',
    thisMonth: 'now_month', lastMonth: 'last_month', thisYear: 'now_year', lastYear: 'last_year' }[code];
  if (ch) return t('sp_when_' + ch);
  let x;
  if ((x = /^y:(\d{4})$/.exec(code))) return t('sp_per_in', { x: x[1] });
  if ((x = /^m:(\d{4}-\d{2})$/.exec(code))) return t('sp_per_in', { x: _spMonthName(x[1]) });
  if ((x = /^s:(\w+):(\d{4})$/.exec(code))) {
    const y = +x[2];
    return t('sp_season_y_' + x[1], { y, y2: String(y + 1).slice(-2) });   // carries its own "in" (pt: "no verão")
  }
  return code;
}

function _spFmtDay(ds) {
  if (!ds) return '…';
  const d = new Date(ds + 'T12:00:00');
  return (typeof fmt === 'function') ? fmt(d) : ds;
}

// Weekday i (0 = Sunday) in the site's language. 1 Nov 2026 is a Sunday.
function _spWeekday(i) {
  try { return new Date(2026, 10, 1 + (+i)).toLocaleDateString(currentLang || 'en', { weekday: 'long' }); }
  catch (e) { return String(i); }
}

// One enum value in words (release type, certification, weekday)
function _spEnumWord(id, v) {
  if (id === 'topDay') return _spWeekday(v);
  return t('sp_v_' + id + '_' + v);
}

function _spNum(id, v) {
  if (id === 'topHour') return String(v).padStart(2, '0') + ':00';
  const n = (+v).toLocaleString();
  return SP_PCT_FIELDS.includes(id) ? n + '%' : n;
}

// One rule in words: "plays at least 50"
function _spDescRule(r) {
  const f = SP_FIELDS[r.f];
  if (!f) return '';
  // "in the playlist “Gym”" (step 6)
  if (f.kind === 'pl') return t('sp_o_p_' + (r.op === 'notIn' ? 'notIn' : 'in'), { v: String(r.v || '') });
  if (f.kind === 'bool') {
    const yes = r.v === true || r.v === 'true' || r.v === 1;
    return t('sp_b_' + r.f + (yes ? '_yes' : '_no'), f.chart ? _spChWords(r) : undefined);
  }
  const label = spFieldLabel(r.f, r);
  const v = r.v;
  let cond = '';
  if (f.kind === 'number') {
    const pair = Array.isArray(v) ? { a: _spNum(r.f, v[0]), b: _spNum(r.f, v[1]) } : {};
    if (f.lowFirst) {
      // Ranks read the chart way round: "in the top 10", "#5 or lower"
      const top = r.op === 'lt' ? +v - 1 : r.op === 'gt' ? +v + 1 : v;
      const key = { lte: 'lte', lt: 'lte', gte: 'gte', gt: 'gte', eq: 'eq', between: 'between' }[r.op] || 'eq';
      cond = t('sp_o_rank_' + key, Object.assign({ v: Array.isArray(v) ? '' : _spNum(r.f, top) }, pair));
    } else {
      cond = t('sp_o_n_' + r.op, Object.assign({ v: Array.isArray(v) ? '' : _spNum(r.f, v) }, pair));
    }
  } else if (f.kind === 'date') {
    if (r.op === 'in') cond = spPeriodWords(v);   // "first played last month"
    else if (r.op === 'within' || r.op === 'older') cond = t('sp_o_d_' + r.op, { v: (+v).toLocaleString() });
    else if (r.op === 'between') cond = t('sp_o_d_between', { a: _spFmtDay(v && v[0]), b: _spFmtDay(v && v[1]) });
    else cond = t('sp_o_d_' + r.op, { v: _spFmtDay(v) });
  } else if (f.kind === 'text' || f.kind === 'list') {
    cond = t('sp_o_' + (f.kind === 'list' ? 'l_' : 't_') + r.op, { v: String(v == null ? '' : v) });
  } else if (f.kind === 'enum') {
    const vals = (Array.isArray(v) ? v : [v]).map(x => _spEnumWord(r.f, x)).join(t('sp_d_or'));
    cond = t('sp_o_e_' + r.op, { v: vals });
  }
  return t('sp_d_rule', { f: label, o: cond });
}

// A group in words; nested groups of 2+ rules go in brackets
function _spDescGroup(g, nested) {
  const parts = (g.rules || []).map(r => r.rules ? _spDescGroup(r, true) : _spDescRule(r)).filter(Boolean);
  if (!parts.length) return '';
  const s = parts.join(g.match === 'any' ? t('sp_d_or') : t('sp_d_and'));
  return nested && parts.length > 1 ? '(' + s + ')' : s;
}

function spDescribe(def) {
  if (!def) return '';
  let s = _spDescGroup(def, false) || t('sp_d_all_songs');
  // Capital first letter, even when the sentence opens with a bracket
  s = s.replace(/^(\(?)(.)/, (m, br, c) => br + c.toUpperCase());
  const tail = [];
  const sort = def.sort || { f: 'plays' };
  if (sort.f === 'random') tail.push(t('sp_d_sort_random'));
  else if (SP_FIELDS[sort.f]) {
    // "reversed" only when it runs against the field's natural best-first order
    const lowFirst = !!SP_FIELDS[sort.f].lowFirst;
    const flipped = !!sort.dir && ((sort.dir === 'asc') !== lowFirst);
    // Turned round: dates read "oldest first", counts "fewest first"
    const kind = SP_FIELDS[sort.f].kind;
    const key = !flipped ? 'sp_d_sort' : kind === 'date' ? 'sp_d_sort_old' : (kind === 'number' && !lowFirst) ? 'sp_d_sort_low' : 'sp_d_sort_rev';
    tail.push(t(key, { f: spFieldLabel(sort.f, sort) }));
  }
  if (def.limit > 0) tail.push(t('sp_d_limit', { n: (+def.limit).toLocaleString() }));
  if (def.perArtist > 0) tail.push(t('sp_d_per_artist', { n: def.perArtist }));
  return [s].concat(tail).join(' · ');
}

// ─── PIECES app.js PUTS ON THE PAGE ───────────────────────────────────────

// The label on a library card's cover
function spCardTagHtml() {
  return `<span class="plx-smart-tag"><span aria-hidden="true">✨</span>${esc(t('sp_tag'))}</span>`;
}

// The small line above an open smart playlist's name
function spKickerHtml() {
  return `<span class="plx-kicker plx-kicker-smart"><span aria-hidden="true">✨ </span>${esc(t('sp_tag'))}</span>`;
}

// Under the name: the rules in words, plus what was skipped or why it's empty
function spRulesLineHtml(name) {
  const def = spGet(name);
  if (!def) return '';
  let html = `<p class="plx-smart-rules">${esc(spDescribe(def))}</p>` + spReadyPickerHtml(name) + spNotifySwitchHtml(name);
  const res = (allPlays && allPlays.length) ? spRun(_spCapped(def)) : null;
  if (res && res.skipped.length) {
    html += `<p class="plx-smart-note">${esc(res.skipped.map(n => t('sp_skip_' + n)).join(' '))}</p>`;
  }
  if (res && !res.songs.length) html += `<p class="plx-smart-note">${esc(t('sp_empty'))}</p>`;
  return html;
}

// Shown when someone tries to add, remove or drag songs in a smart playlist
function spLockedToast() {
  if (typeof dcPlToast === 'function') dcPlToast(t('sp_locked'));
}


/* ===========================================================================
   STEP 4: READY-MADE SMART PLAYLISTS

   Twelve lists written with the same rules as everything else, so each one
   can later be opened in the builder as a preset (step 5). The first time
   the data loads they're added to the user's playlists, but only the ones
   this library can fill (a list that would be empty, or needs ratings or
   genres the library doesn't have, is left out). Deleting one hides it; the
   "Ready-made smart playlists" row under the grid adds it back.

   Names are written in the language in use when the list is added. The
   `ready` id on the rules is what ties a list to its ready-made source, so
   renaming it is fine and two devices never end up with two copies.
   =========================================================================== */

// The year "Your year in 50" starts on: last year, or this one if the
// library has nothing older
function _spDefaultYear() {
  const now = (typeof tzNow === 'function') ? tzNow() : new Date();
  const years = spYears();
  const last = now.getFullYear() - 1;
  return years.includes(last) ? last : (years[0] || now.getFullYear());
}

// Every year the library has plays in, newest first
function spYears() {
  return [..._spYearCounts().keys()].sort((a, b) => b - a);
}
let _spYearCache = null;
function _spYearCounts() {
  const gen = _spGeneration();
  if (_spYearCache && _spYearCache.gen === gen) return _spYearCache.m;
  const m = new Map();
  for (const p of (allPlays || [])) { const y = (typeof tzDateOf === 'function' ? tzDateOf(p) : p.date).getFullYear(); m.set(y, (m.get(y) || 0) + 1); }
  _spYearCache = { gen, m };
  return m;
}

/* The rule sets. opt: the list's own setting from its picker
   (year for "Your year in 50", span for "On this day"). */
const SP_READY = {
  heavy:        () => ({ rules: [{ f: 'plays', op: 'gte', v: 3, win: { last: 30 } }], sort: { f: 'plays', win: { last: 30 } }, limit: 50 }),
  forgotten:    () => ({ rules: [{ f: 'topPct', op: 'lte', v: 10 }, { f: 'plays', op: 'gte', v: 20 }, { f: 'last', op: 'older', v: 180 }], sort: { f: 'plays' }, limit: 50 }),
  newToYou:     () => ({ rules: [{ f: 'first', op: 'within', v: 30 }], sort: { f: 'plays' }, limit: 50 }),
  neverCharted: () => ({ rules: [{ f: 'charted', op: 'is', v: false, ch: 'week' }, { f: 'plays', op: 'gte', v: 10 }], sort: { f: 'plays' }, limit: 50 }),
  no1s:         () => ({ rules: [{ f: 'at1', op: 'gte', v: 1, ch: 'week' }], sort: { f: 'at1At', ch: 'week', dir: 'asc' } }),
  topRated:     () => ({ rules: [{ f: 'rating', op: 'gte', v: 7 }], sort: { f: 'rating' }, limit: 50 }),
  onThisDay:    o => ({ rules: [{ f: 'otd', op: 'gte', v: 1, span: (o && o.span != null) ? o.span : 3 }], sort: { f: 'otd', span: (o && o.span != null) ? o.span : 3 }, limit: 50 }),
  oneHit:       () => ({ rules: [{ f: 'artistShare', op: 'gte', v: 75 }, { f: 'artistSongs', op: 'gte', v: 2 }, { f: 'plays', op: 'gte', v: 10 }], sort: { f: 'plays' }, limit: 50 }),
  slow:         () => ({ rules: [{ f: 'toPeak', op: 'gte', v: 6, ch: 'week' }], sort: { f: 'toPeak', ch: 'week' }, limit: 50 }),
  year50:       o => { const y = (o && o.year) || _spDefaultYear(); const win = { from: y + '-01-01', to: y + '-12-31' };
                       return { rules: [{ f: 'plays', op: 'gte', v: 1, win }], sort: { f: 'plays', win }, limit: 50 }; },
  almost1:      () => ({ rules: [{ f: 'peak', op: 'eq', v: 2, ch: 'week' }], sort: { f: 'wks', ch: 'week' }, limit: 50 }),
  deep:         () => ({ rules: [{ f: 'albumTop', op: 'lte', v: 25 }, { f: 'albumRank', op: 'gte', v: 4 }], sort: { f: 'plays', dir: 'asc' }, limit: 50, perArtist: 3 })
};
const SP_READY_IDS = Object.keys(SP_READY);

function spReadyDef(id, opt) {
  const make = SP_READY[id];
  if (!make) return null;
  const def = make(opt);
  def.match = 'all';
  def.ready = id;
  if (opt) def.readyOpt = opt;
  return def;
}

// Can this library fill this ready-made list? (no skipped rules, 1+ song)
function spReadyFits(id) {
  const res = spRun(spReadyDef(id));
  return !res.skipped.length && res.count > 0;
}

// The ready-made ids already in the user's playlists
function _spReadyInUse() {
  const ids = new Set();
  for (const n of spNames()) if (_spStore.lists[n].ready) ids.add(_spStore.lists[n].ready);
  return ids;
}

// A free name for a ready-made list: its translated name, numbered if a
// normal playlist already uses it
function _spReadyName(id) {
  const base = t('sp_ready_' + id);
  let name = base, n = 2;
  while (_ytPlaylists[name] || spIsSmart(name)) name = base + ' ' + n++;
  return name;
}

// Adds one ready-made list. Returns its name, or '' when it couldn't be added.
function spAddReady(id) {
  if (!SP_READY[id] || _spReadyInUse().has(id)) return '';
  const name = _spReadyName(id);
  return spCreate(name, spReadyDef(id)) ? name : '';
}

/* The first time: every ready-made list this library can fill. Runs once
   per account (the flag syncs), so deleting one later doesn't bring it back. */
function spSeedReady() {
  if (_spStore.seeded || !allPlays || !allPlays.length) return;
  // Never before the words have loaded, or the lists get named after their
  // translation keys ("sp_ready_deep"), which happened once (2026-11-09)
  if (!_spWordsReady()) return;
  const used = _spReadyInUse();
  for (const id of SP_READY_IDS) {
    if (used.has(id) || !spReadyFits(id)) continue;
    const name = _spReadyName(id);
    _spStore.lists[name] = _spClean(spReadyDef(id));
    _spStore.modified[name] = Date.now();
  }
  _spStore.seeded = true;
  _spSave();
}

// A ready-made list's own setting changed (the year, or day / week)
function spSetReadyOpt(name, opt) {
  const def = spGet(name);
  if (!def || !def.ready) return;
  const next = spReadyDef(def.ready, Object.assign({}, def.readyOpt || {}, opt));
  if (def.limit && !next.limit) next.limit = def.limit;
  _spStore.lists[name] = _spClean(next);
  _spStore.modified[name] = Date.now();
  _spSave();
  spRefresh(name, true);
  if (typeof dcRenderPlaylistsView === 'function') dcRenderPlaylistsView();
}

// ─── "ON THIS DAY" ────────────────────────────────────────────────────────
/* otd = plays in earlier years within `span` days of today's date
   (span 0 = this exact day, 3 = this week). One pass per data load, day and
   span. */
let _spOtdCache = null;
function _spOtdCounts(span) {
  const now = (typeof tzNow === 'function') ? tzNow() : new Date();
  const id = _spGeneration() + '|' + now.toDateString() + '|' + span;
  if (_spOtdCache && _spOtdCache.id === id) return _spOtdCache.m;
  const m = new Map();
  const y0 = now.getFullYear();
  const today = new Date(y0, now.getMonth(), now.getDate());
  for (const p of (allPlays || [])) {
    const td = (typeof tzDateOf === 'function') ? tzDateOf(p) : p.date;
    if (td.getFullYear() >= y0) continue;
    // The play's day moved into this year, compared both ways round New Year
    const same = new Date(y0, td.getMonth(), td.getDate());
    let diff = Math.abs(Math.round((same - today) / SP_DAY_MS));
    diff = Math.min(diff, 365 - diff);
    if (diff > span) continue;
    const k = _spKey(p);
    m.set(k, (m.get(k) || 0) + 1);
  }
  _spOtdCache = { id, m };
  return m;
}
spAddField('otd', { kind: 'number', get: (s, r) => _spOtdCounts(r && r.span != null ? +r.span : 3).get(s.key) || 0 });

// ─── ON THE PAGE ──────────────────────────────────────────────────────────

/* Under the library grid: the ready-made lists that aren't in the user's
   playlists (deleted, or not added because they were empty then) and that
   this library can fill now. Each button adds one. */
function spReadyRowHtml() {
  if (!allPlays || !allPlays.length) return '';
  const used = _spReadyInUse();
  const ids = SP_READY_IDS.filter(id => !used.has(id) && spReadyFits(id));
  if (!ids.length) return '';
  // Same heading look as the Automatic playlists section under it
  return `<div class="dc-pl-part sp-ready" id="spReady">` +
    `<div class="dc-pl-part-head"><h3 class="dc-pl-part-title"><span aria-hidden="true">✨ </span>${esc(t('sp_ready_title'))}</h3></div>` +
    `<p class="dc-pl-part-sub">${esc(t('sp_ready_sub'))}</p>` +
    `<div class="sp-ready-list">` +
    ids.map(id => `<button type="button" class="dc-btn dc-btn-normal dc-btn-sm sp-ready-btn" onclick="spAddReadyFromRow('${id}')" title="${esc(spDescribe(spReadyDef(id)))}">` +
      `<span aria-hidden="true">＋</span>${esc(t('sp_ready_' + id))}</button>`).join('') +
    `</div></div>`;
}

function spAddReadyFromRow(id) {
  if (!spSignedIn()) { spSignInvite(); return; }
  const name = spAddReady(id);
  if (!name) return;
  if (typeof dcPlToast === 'function') dcPlToast(t('sp_ready_added', { name }));
  if (typeof dcRenderPlaylistsView === 'function') dcRenderPlaylistsView();
}

/* On an open ready-made list with a setting: the year picker for "Your year
   in 50", day / week for "On this day". Empty for the others. */
function spReadyPickerHtml(name) {
  const def = spGet(name);
  // A ready-made list changed in the builder has its own rules now
  if (!def || !def.ready || def.readyEdited) return '';
  const nameJson = esc(JSON.stringify(name));
  if (def.ready === 'year50') {
    const cur = (def.readyOpt && def.readyOpt.year) || _spDefaultYear();
    const years = spYears();
    if (years.length < 2) return '';
    return `<label class="sp-pick">${esc(t('sp_pick_year'))} ` +
      `<select class="dc-input sp-pick-select" onchange="spSetReadyOpt(${nameJson},{year:+this.value})">` +
      years.map(y => `<option value="${y}"${y === +cur ? ' selected' : ''}>${y}</option>`).join('') +
      `</select></label>`;
  }
  if (def.ready === 'onThisDay') {
    const span = (def.readyOpt && def.readyOpt.span != null) ? def.readyOpt.span : 3;
    return `<div class="dc-seg sp-pick-seg" role="group" aria-label="${esc(t('sp_ready_onThisDay'))}">` +
      `<button type="button" aria-pressed="${span === 0}" onclick="spSetReadyOpt(${nameJson},{span:0})">${esc(t('sp_pick_otd_day'))}</button>` +
      `<button type="button" aria-pressed="${span !== 0}" onclick="spSetReadyOpt(${nameJson},{span:3})">${esc(t('sp_pick_otd_week'))}</button>` +
      `</div>`;
  }
  return '';
}


/* ===========================================================================
   STEP 5: THE BUILDER

   One window (#spBuilderModal in index.html) to make a new smart playlist or
   change an existing one's rules:
     name · start from (blank or a ready-made list, when making a new one)
     all / any · rule rows (field → its chart or date window → condition →
       value) · one level of groups · sort, size, songs per artist
     keeps updating (smart) or save once (a normal playlist)
   with a live count, the rules in plain words and the first songs, updated
   as the rules change.

   Rules a library can't use yet (genres, ratings, times of day) stay in the
   field list, greyed out with what they need.

   The window works on a copy (_spB.def); nothing is saved until Save.
   Clicks and typing are handled by listeners on the window body, with each
   rule row carrying its place as data-path ("2" = third rule, "2.1" = second
   rule inside the third item's group, "sort" = the sort settings).
   =========================================================================== */

// The builder's field list, in groups, in the order they're offered
const SP_B_GROUPS = [
  ['song',     ['title', 'artist', 'album', 'genre', 'release']],
  ['plays',    ['plays', 'days', 'maxDay', 'first', 'last', 'otd']],
  ['charts',   ['charted', 'peak', 'wks', 'at1', 'debut', 'climb', 'runs', 'longest', 'toPeak', 'at1At', 'peakAt']],
  // On the chart now, New Entries, Off the Chart, Bubbling Under (2026-11-16)
  ['around',   ['onChart', 'newEntry', 'reEntry', 'offChart', 'buNow', 'buWks', 'buPeak']],
  ['habits',   ['topPart', 'morning', 'afternoon', 'evening', 'night', 'lateNight', 'weekend', 'topHour', 'topDay']],
  ['compared', ['rankAll', 'topPct', 'artistBest', 'artistShare', 'artistPlays', 'artistSongs', 'albumPlays', 'albumRank', 'albumTop']],
  ['ratings',  ['rating', 'aboveAvg', 'cert']],
  ['lists',    ['inList']]
];

// One emoji per group, shown on the picker's tabs and cards and on each rule
const SP_B_ICONS = { song: '🎵', plays: '🔁', charts: '📈', around: '🫧', habits: '🕒', compared: '⚖️', ratings: '⭐', lists: '📂' };

// The group a field sits in ('song' when it's in none)
function _spBGroupOf(id) {
  for (const [g, ids] of SP_B_GROUPS) if (ids.includes(id)) return g;
  return 'song';
}

// The conditions each kind of field offers, in order
const SP_B_OPS = {
  number: ['gte', 'lte', 'gt', 'lt', 'eq', 'between'],
  rank:   ['lte', 'gte', 'eq', 'between'],            // lowFirst numbers: "in the top"
  date:   ['in', 'within', 'older', 'after', 'before', 'between'],   // 'in' = a named period (2026-11-16)
  text:   ['is', 'isNot', 'has', 'hasNot', 'starts'],
  list:   ['has', 'hasNot'],
  enum:   ['is', 'isNot'],
  enumOrd:['is', 'isNot', 'gte', 'lte'],
  bool:   ['yes', 'no'],                               // stored as op 'is', v true / false
  pl:     ['in', 'notIn']
};

/* _spB = { orig: name being edited or null, name, def, mode: 'live'|'once', err,
            pick: null or { path, cat, q, scroll } while the rule picker is open } */
let _spB = null;
let _spBTimer = null;

function _spBToday() {
  return (typeof localDateStr === 'function' && typeof tzNow === 'function') ? localDateStr(tzNow()) : new Date().toISOString().slice(0, 10);
}
function _spBDaysAgo(n) {
  const d = new Date(_spBToday() + 'T12:00:00'); d.setDate(d.getDate() - n);
  return (typeof localDateStr === 'function') ? localDateStr(d) : d.toISOString().slice(0, 10);
}

// The list of conditions for a field
function _spBOpsFor(id) {
  const f = SP_FIELDS[id];
  if (!f) return [];
  if (f.kind === 'number') return f.lowFirst ? SP_B_OPS.rank : SP_B_OPS.number;
  if (f.kind === 'enum') return f.ordered ? SP_B_OPS.enumOrd : SP_B_OPS.enum;
  return SP_B_OPS[f.kind] || [];
}

// A fresh rule for a field, with sensible starting values
function _spBNewRule(id) {
  const f = SP_FIELDS[id];
  const r = { f: id };
  if (f.chart) r.ch = 'week';
  if (f.kind === 'number') {
    if (f.lowFirst) { r.op = 'lte'; r.v = 10; }
    else { r.op = 'gte'; r.v = SP_PCT_FIELDS.includes(id) ? 50 : id === 'topHour' ? 22 : 1; }
    if (id === 'plays') r.v = 10;
    if (id === 'otd') r.span = 3;
  } else if (f.kind === 'date') { r.op = 'within'; r.v = 30; }
  else if (f.kind === 'text') { r.op = 'is'; r.v = ''; }
  else if (f.kind === 'list') { r.op = 'has'; r.v = ''; }
  else if (f.kind === 'enum') { r.op = f.ordered ? 'gte' : 'is'; r.v = f.values[f.ordered ? 1 : 0]; }
  else if (f.kind === 'bool') { r.op = 'is'; r.v = true; }
  else if (f.kind === 'pl') { r.op = 'in'; r.v = _spBOtherLists()[0] || ''; }
  return r;
}

// When a rule's condition changes, its value changes shape (one number,
// two numbers, days, a date…)
function _spBFixValue(r) {
  const f = SP_FIELDS[r.f];
  if (!f) return;
  if (f.kind === 'number') {
    if (r.op === 'between') { if (!Array.isArray(r.v)) r.v = [f.lowFirst ? 1 : (+r.v || 1), f.lowFirst ? 10 : (+r.v || 1) * 2]; }
    else if (Array.isArray(r.v)) r.v = r.v[0];
  } else if (f.kind === 'date') {
    if (r.op === 'within' || r.op === 'older') { if (typeof r.v !== 'number') r.v = r.op === 'older' ? 180 : 30; }
    else if (r.op === 'between') { if (!Array.isArray(r.v)) r.v = [_spBDaysAgo(365), _spBToday()]; }
    else if (r.op === 'in') { if (!_spPeriodOk(r.v)) r.v = 'lastMonth'; }
    else if (typeof r.v !== 'string' || !/^\d{4}-/.test(r.v)) r.v = _spBDaysAgo(r.op === 'after' ? 365 : 0);
  }
}

// ─── Opening and closing ──────────────────────────────────────────────────

// New smart playlist (preset = a ready-made id to start from, optional).
// copy = true opens a copy of smart playlist `name` instead: same rules,
// a free name ("… (copy)"), both can be changed before it's saved as a new list
function spOpenBuilder(name, preset, copy) {
  if (!spSignedIn()) { spSignInvite(); return; }
  const modal = document.getElementById('spBuilderModal');
  if (!modal) return;
  document.querySelectorAll('.ctrl-group.open').forEach(g => g.classList.remove('open'));
  if (name && copy && spIsSmart(name)) {
    const def = JSON.parse(JSON.stringify(spGet(name)));
    // The copy is the user's own list: not the ready-made one it may have
    // come from (so that one is still offered), and no change alerts
    delete def.ready; delete def.readyOpt; delete def.readyEdited; delete def.notify;
    _spB = { orig: null, copyOf: name, name: _spCopyName(name), def, mode: 'live', err: '' };
  } else if (name && spIsSmart(name)) {
    const def = JSON.parse(JSON.stringify(spGet(name)));
    _spB = { orig: name, name, def, mode: 'live', err: '' };
  } else {
    const def = preset ? spReadyDef(preset) : { match: 'all', rules: [_spBNewRule('plays')], sort: { f: 'plays' }, limit: 50 };
    if (def) { delete def.ready; delete def.readyOpt; }
    _spB = { orig: null, name: preset ? t('sp_ready_' + preset) : '', def, mode: 'live', err: '', preset: preset || '' };
  }
  document.getElementById('spBTitle').textContent = t(_spB.orig ? 'sp_b_title_edit' : _spB.copyOf ? 'sp_b_title_copy' : 'sp_b_title_new');
  _spBRender();
  modal.classList.add('open');
  if (typeof dcFillIcons === 'function') dcFillIcons(modal);
  // A copy's name is picked whole, so typing replaces "… (copy)" straight away
  setTimeout(() => { const n = document.getElementById('spBName'); if (n && !_spB.orig) { n.focus(); if (_spB.copyOf) n.select(); } }, 60);
}

// A free name for a copy: "Name (copy)", then "Name (copy 2)"… (40 letters max, like the name box)
function _spCopyName(name) {
  const taken = n => !!_ytPlaylists[n] || spIsSmart(n) || (typeof _ytIsFavName === 'function' && _ytIsFavName(n));
  for (let i = 1; i < 100; i++) {
    const tag = ' ' + t(i === 1 ? 'sp_b_copy_tag' : 'sp_b_copy_tag_n', { n: i });
    const out = name.slice(0, 40 - tag.length).trim() + tag;
    if (!taken(out)) return out;
  }
  return '';
}

function spCloseBuilder() {
  document.getElementById('spBuilderModal')?.classList.remove('open');
  _spB = null;
}

// ─── Drawing ──────────────────────────────────────────────────────────────

function _spBOpt(value, label, selected, disabled) {
  return `<option value="${esc(String(value))}"${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}>${esc(label)}</option>`;
}

/* The field button at the top of a rule (2026-11-16). It used to be one long
   dropdown of ~45 terse names; now it shows the rule's plain name and opens
   the picker (_spBPickerHtml), where every choice has a short explanation. */
function _spBFieldBtn(cur, forSort) {
  const name = cur === 'random' ? t('sp_p_random') : t('sp_p_' + cur);
  const icon = cur === 'random' ? '🎲' : SP_B_ICONS[_spBGroupOf(cur)];
  return `<button type="button" class="spb-pick" data-act="pick" aria-haspopup="dialog" aria-label="${esc(t(forSort ? 'sp_b_sort' : 'sp_b_field') + ': ' + name)}">` +
    `<span class="spb-pick-ico" aria-hidden="true">${icon}</span>` +
    `<span class="spb-pick-name">${esc(name)}</span>` +
    `<span class="spb-pick-change">${esc(t('sp_b_change'))}</span></button>`;
}

/* The rule picker: replaces the window's body until a choice is made.
   Tabs per group (or a search across all of them), and one card per choice
   with its name and a one-line explanation. Choices the library can't use
   yet stay visible, greyed, saying what they need. In sort mode (path
   'sort') yes/no choices are left out and "Random" leads. */
function _spBPickerHtml() {
  const p = _spB.pick;
  const forSort = p.path === 'sort';
  const cur = _spBAt(p.path).node;
  const curF = cur ? cur.f : '';
  const q = _spNorm(p.q || '');
  const card = (id, icon) => {
    const f = SP_FIELDS[id];
    const missing = !!(f && f.needs && !spDataHas(f.needs));
    return `<button type="button" class="spb-pcard${id === curF ? ' is-cur' : ''}" data-act="pickField" data-v="${esc(id)}"${missing ? ' disabled' : ''}>` +
      `<span class="spb-pcard-ico" aria-hidden="true">${icon}</span>` +
      `<span class="spb-pcard-txt"><span class="spb-pcard-name">${esc(t('sp_p_' + id))}</span>` +
      `<span class="spb-pcard-hint">${esc(missing ? t('sp_skip_' + f.needs) : t('sp_h_' + id))}</span></span></button>`;
  };
  let cards = '';
  if (forSort && !q) cards += card('random', '🎲');   // on every tab
  for (const [g, ids] of SP_B_GROUPS) {
    if (!q && g !== p.cat) continue;
    for (const id of ids) {
      const f = SP_FIELDS[id];
      if (!f || (forSort && (f.kind === 'bool' || f.kind === 'pl'))) continue;
      if (q && !_spNorm(t('sp_p_' + id) + ' ' + t('sp_h_' + id) + ' ' + t('sp_g_' + g)).includes(q)) continue;
      cards += card(id, SP_B_ICONS[g]);
    }
  }
  if (!cards) cards = `<p class="spb-none">${esc(t('sp_b_pick_none'))}</p>`;
  const tabs = SP_B_GROUPS.filter(([g]) => !(forSort && g === 'lists')).map(([g]) =>
    `<button type="button" class="spb-ptab" data-act="pickCat" data-v="${g}" aria-pressed="${!q && g === p.cat}">` +
    `<span aria-hidden="true">${SP_B_ICONS[g]}</span> ${esc(t('sp_g_' + g))}</button>`).join('');
  return `<div class="spb-picker" role="dialog" aria-label="${esc(t(forSort ? 'sp_b_pick_sort' : 'sp_b_pick_title'))}">` +
    `<div class="spb-picker-head">` +
      // aria-expanded="true" also tells popups.js a picker is open inside the
      // window, so Escape is left to us (back to the rules) instead of closing it
      `<button type="button" class="dc-btn dc-btn-plain dc-btn-sm" data-act="pickClose" aria-expanded="true">← ${esc(t('sp_b_pick_back'))}</button>` +
      `<h4 class="spb-h">${esc(t(forSort ? 'sp_b_pick_sort' : 'sp_b_pick_title'))}</h4>` +
    `</div>` +
    `<input id="spBPickQ" class="dc-input spb-pick-q" type="search" value="${esc(p.q || '')}" placeholder="${esc(t('sp_b_pick_search'))}" aria-label="${esc(t('sp_b_pick_search'))}">` +
    `<div class="spb-ptabs" role="group">${tabs}</div>` +
    `<div class="spb-pcards" id="spBPickCards">${cards}</div>` +
    `</div>`;
}

// ─── Periods in the builder (2026-11-16) ──────────────────────────────────

// A period code's kind: one of SP_PERIODS, or 'year' / 'month' / 'season'
function _spPerKind(code) {
  code = String(code || '');
  if (SP_PERIODS.includes(code)) return code;
  if (code.startsWith('y:')) return 'year';
  if (code.startsWith('m:')) return 'month';
  if (code.startsWith('s:')) return 'season';
  return '';
}

// A fresh code for a kind, keeping the year of the old code where it has one
function _spPerFresh(kind, old) {
  if (SP_PERIODS.includes(kind)) return kind;
  const today = _spToday();
  const r = _spPeriodRange(old);
  const y = r ? r.from.slice(0, 4) : String(+today.slice(0, 4) - (kind === 'season' ? 1 : 0));
  if (kind === 'year') return 'y:' + (r ? y : today.slice(0, 4));
  if (kind === 'month') return 'm:' + (r ? r.from.slice(0, 7) : today.slice(0, 7));
  // Summer of that year, or the year before when that summer hasn't started yet
  return 's:summer:' + (_spPeriodRange('s:summer:' + y).from > today ? +y - 1 : y);
}

// The plays window's menu value
function _spBWinMode(w) {
  if (!w) return 'all';
  if (w.p === 'monthPast') return 'monthPast';
  if (w.p) return _spPerKind(w.p) || 'all';
  if (w.first > 0) return 'first';
  if (w.last > 0) return 'last';
  return 'range';
}

// The years the library has plays in (newest first), plus this year
function _spBYearList(cur) {
  const ys = new Set(spYears().map(String));
  ys.add(_spToday().slice(0, 4));
  if (cur) ys.add(String(cur));
  return [...ys].sort((a, b) => b - a);
}

/* The extra boxes for a year, month or season code: a year list, a month
   box, or a season list + year list. k = 'win' (plays window) or 'per'
   (a first / last played rule), which prefixes the boxes' data-k. */
function _spBPerExtras(code, k) {
  const kind = _spPerKind(code);
  if (kind === 'year') {
    const y = code.slice(2);
    return `<select class="dc-input spb-small" data-k="${k}Y" aria-label="${esc(t('sp_win_year'))}">` +
      _spBYearList(y).map(x => _spBOpt(x, x, x === y)).join('') + `</select>`;
  }
  if (kind === 'month') {
    return `<input class="dc-input spb-date" type="month" data-k="${k}M" value="${esc(code.slice(2))}" max="${_spToday().slice(0, 7)}" aria-label="${esc(t('sp_win_month'))}">`;
  }
  if (kind === 'season') {
    const [, s, y] = code.split(':');
    return `<select class="dc-input spb-small" data-k="${k}S" aria-label="${esc(t('sp_win_season'))}">` +
        SP_SEASONS.map(x => _spBOpt(x, t('sp_season_' + x), x === s)).join('') + `</select>` +
      `<select class="dc-input spb-small" data-k="${k}SY" aria-label="${esc(t('sp_win_year'))}">` +
        _spBYearList(y).map(x => _spBOpt(x, x, x === y)).join('') + `</select>`;
  }
  return '';
}

// The period list for a first / last played rule ("during last month")
// (k = 'per' for first / last played, 'wp' for an "around the chart" rule's period)
function _spBPerValueHtml(code, k = 'per') {
  const kind = _spPerKind(code);
  return `<select class="dc-input spb-small" data-k="${k}Kind" aria-label="${esc(t('sp_b_value'))}">` +
    SP_PERIODS.map(p => _spBOpt(p, t('sp_win_p_' + p), kind === p)).join('') +
    ['year', 'month', 'season'].map(m => _spBOpt(m, t('sp_win_' + m), kind === m)).join('') +
    `</select>` + _spBPerExtras(code, k);
}

/* Which chart a chart rule reads, as buttons right in the rule (it used to be
   a second dropdown that only showed up after a chart rule was picked, so the
   daily / monthly / yearly charts were easy to miss). Bubbling Under only
   exists on the daily and weekly charts. */
function _spBChartSeg(r) {
  const f = SP_FIELDS[r.f];
  const chs = f.buOnly ? SP_BU_CHARTS : SP_CHARTS;
  const cur = f.buOnly ? _spBuCh(r) : _spCh(r);
  return `<div class="dc-seg spb-chseg" role="group" aria-label="${esc(t('sp_b_chart'))}">` +
    chs.map(c => `<button type="button" data-act="ch" data-v="${c}" aria-pressed="${c === cur}">${esc(t('sp_b_chs_' + c))}</button>`).join('') +
    `</div>`;
}

// The extras between field and condition: the plays window, day / week, and
// for the "around the chart" rules this period or the one before
function _spBExtrasHtml(r) {
  const f = SP_FIELDS[r.f];
  if (!f) return '';
  let html = '';
  if (f.when) {
    const ch = f.buOnly ? _spBuCh(r) : _spCh(r);
    const w = SP_WHENS.includes(r.when) ? r.when : 'now';
    const units = t('sp_u_' + ch);
    // Which charts count: the two the chart pages show first, then the rest (2026-11-16)
    const opt = m => {
      if (m === 'now' || m === 'last') return _spBOpt(m, t('sp_when_' + m + '_' + ch), w === m);
      if (m === 'yearAgo') return ch === 'year' ? '' : _spBOpt(m, t('sp_when_yearAgo_' + ch), w === m);
      if (m === 'allLastN' && !f.every) return '';   // "every one of" only fits on the chart / in BU
      return _spBOpt(m, t(m === 'lastN' || m === 'allLastN' ? 'sp_wo_' + m + '_' + ch : 'sp_wo_' + m, { units }), w === m);
    };
    html += `<select class="dc-input spb-small" data-k="when" aria-label="${esc(t('sp_b_when'))}">` +
      opt('now') + opt('last') +
      `<optgroup label="${esc(t('sp_win_g_more'))}">` + SP_WHENS.slice(2).map(opt).join('') + `</optgroup>` +
      `</select>`;
    if (w === 'ago' || w === 'lastN' || w === 'allLastN') {
      html += `<input class="dc-input spb-num" type="number" min="1" max="520" data-k="whenN" value="${esc(String(r.n || 1))}" aria-label="${esc(t('sp_b_value'))}"><span class="spb-unit">${esc(units)}</span>`;
    }
    if (w === 'period') html += _spBPerValueHtml(r.per, 'wp');
    if (w === 'date') html += `<input class="dc-input spb-date" type="date" data-k="whenD" max="${_spToday()}" value="${esc(r.d || '')}" aria-label="${esc(t('sp_wo_date', { units }))}">`;
    if (w === 'range') html += `<input class="dc-input spb-date" type="date" data-k="whenD" value="${esc(r.d || '')}" aria-label="${esc(t('sp_b_from'))}"><span class="spb-unit">–</span>` +
      `<input class="dc-input spb-date" type="date" data-k="whenD2" value="${esc(r.d2 || '')}" aria-label="${esc(t('sp_b_to'))}">`;
  }
  if (r.f === 'plays') {
    const mode = _spBWinMode(r.win);
    // One list of every window, quick ones first (2026-11-16)
    html += `<select class="dc-input spb-small" data-k="winMode" aria-label="${esc(t('sp_b_when'))}">` +
      _spBOpt('all', t('sp_win_all'), mode === 'all') +
      `<optgroup label="${esc(t('sp_win_g_quick'))}">` + SP_PERIODS.map(p => _spBOpt(p, t('sp_win_p_' + p), mode === p)).join('') + `</optgroup>` +
      `<optgroup label="${esc(t('sp_win_g_pick'))}">` +
        ['last', 'year', 'month', 'season', 'range'].map(m => _spBOpt(m, t('sp_win_' + m), mode === m)).join('') + `</optgroup>` +
      `<optgroup label="${esc(t('sp_win_g_more'))}">` +
        _spBOpt('first', t('sp_win_first'), mode === 'first') + _spBOpt('monthPast', t('sp_win_monthPast'), mode === 'monthPast') + `</optgroup>` +
      `</select>`;
    if (mode === 'last') {
      html += `<input class="dc-input spb-num" type="number" min="1" max="3650" data-k="winN" value="${r.win.last}" aria-label="${esc(t('sp_win_last'))}">` +
        `<select class="dc-input spb-small" data-k="winUnit" aria-label="${esc(t('sp_win_last'))}">` +
        ['day', 'week', 'month', 'year'].map(u => _spBOpt(u, t('sp_u_' + u), (r.win.unit || 'day') === u)).join('') + `</select>`;
    }
    if (mode === 'year' || mode === 'month' || mode === 'season') html += _spBPerExtras(r.win.p, 'win');
    if (mode === 'first') html += `<input class="dc-input spb-num" type="number" min="1" max="3650" data-k="winFirst" value="${r.win.first}" aria-label="${esc(t('sp_win_first'))}"><span class="spb-unit">${esc(t('sp_b_days'))}</span>`;
    if (mode === 'range') html += `<input class="dc-input spb-date" type="date" data-k="winFrom" value="${esc(r.win.from || '')}" aria-label="${esc(t('sp_b_from'))}"><span class="spb-unit">–</span><input class="dc-input spb-date" type="date" data-k="winTo" value="${esc(r.win.to || '')}" aria-label="${esc(t('sp_b_to'))}">`;
  }
  if (r.f === 'otd') {
    html += `<select class="dc-input spb-small" data-k="span" aria-label="${esc(t('sp_ready_onThisDay'))}">` +
      _spBOpt(0, t('sp_pick_otd_day'), +r.span === 0) + _spBOpt(3, t('sp_pick_otd_week'), +r.span !== 0) + `</select>`;
  }
  return html;
}

// Shared lists for the text boxes: the user's own artists, albums and genres
function _spBDatalists() {
  const facts = spSongFacts().list.slice().sort((a, b) => b.plays - a.plays);
  const artists = new Map(), albums = new Map(), genres = new Map();
  for (const s of facts) {
    for (const a of s.artists) if (artists.size < 400 && !artists.has(a.toLowerCase())) artists.set(a.toLowerCase(), a);
    if (s.album && albums.size < 400 && !albums.has(s.album.toLowerCase())) albums.set(s.album.toLowerCase(), s.album);
    const g = spGenresOf(s);
    if (g) for (const x of g) if (genres.size < 200 && !genres.has(String(x).toLowerCase())) genres.set(String(x).toLowerCase(), x);
  }
  const dl = (id, m) => `<datalist id="${id}">` + [...m.values()].map(v => `<option value="${esc(v)}"></option>`).join('') + `</datalist>`;
  return dl('spbDlArtist', artists) + dl('spbDlAlbum', albums) + dl('spbDlGenre', genres);
}

// The value box(es) for a rule
function _spBValueHtml(r) {
  const f = SP_FIELDS[r.f];
  if (!f || f.kind === 'bool') return '';
  const v = r.v;
  if (f.kind === 'number') {
    const pct = SP_PCT_FIELDS.includes(r.f) ? `<span class="spb-unit">%</span>` : '';
    const num = (k, x) => `<input class="dc-input spb-num" type="number" data-k="${k}" value="${esc(String(x == null ? '' : x))}" aria-label="${esc(t('sp_b_value'))}">`;
    if (r.op === 'between') return num('v0', v && v[0]) + `<span class="spb-unit">${esc(t('sp_b_and'))}</span>` + num('v1', v && v[1]) + pct;
    return num('v', v) + pct;
  }
  if (f.kind === 'date') {
    if (r.op === 'in') return _spBPerValueHtml(v);
    if (r.op === 'within' || r.op === 'older') return `<input class="dc-input spb-num" type="number" min="1" data-k="v" value="${esc(String(v))}" aria-label="${esc(t('sp_b_value'))}"><span class="spb-unit">${esc(t(r.op === 'older' ? 'sp_b_days_ago' : 'sp_b_days'))}</span>`;
    const date = (k, x) => `<input class="dc-input spb-date" type="date" data-k="${k}" value="${esc(String(x || ''))}" aria-label="${esc(t('sp_b_value'))}">`;
    if (r.op === 'between') return date('v0', v && v[0]) + `<span class="spb-unit">${esc(t('sp_b_and'))}</span>` + date('v1', v && v[1]);
    return date('v', v);
  }
  if (f.kind === 'text' || f.kind === 'list') {
    const dl = r.f === 'artist' ? 'spbDlArtist' : r.f === 'album' ? 'spbDlAlbum' : r.f === 'genre' ? 'spbDlGenre' : '';
    return `<input class="dc-input spb-text" type="text" data-k="v" value="${esc(String(v || ''))}"${dl ? ` list="${dl}"` : ''} maxlength="120" aria-label="${esc(t('sp_b_value'))}">`;
  }
  if (f.kind === 'enum') {
    return `<select class="dc-input spb-small" data-k="v" aria-label="${esc(t('sp_b_value'))}">` +
      f.values.map(x => _spBOpt(x, _spEnumWord(r.f, x), String(x) === String(v))).join('') + `</select>`;
  }
  if (f.kind === 'pl') {
    // The user's other playlists; a smart one is marked ✨. A playlist that
    // was deleted since stays in the list so the rule still shows it.
    const names = _spBOtherLists();
    if (v && !names.includes(v)) names.unshift(v);
    if (!names.length) return `<span class="spb-unit">${esc(t('sp_b_no_lists'))}</span>`;
    return `<select class="dc-input spb-text" data-k="v" aria-label="${esc(t('sp_b_value'))}">` +
      names.map(n => _spBOpt(n, (spIsSmart(n) ? '✨ ' : '') + n + (_ytPlaylists[n] ? '' : ' ' + t('sp_b_gone')), n === v)).join('') + `</select>`;
  }
  return '';
}

// Every playlist a rule can point at: all of them except the one being edited
function _spBOtherLists() {
  const me = _spB && _spB.orig;
  return Object.keys(_ytPlaylists).filter(n => n !== me).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }));
}

// The condition picker
function _spBOpHtml(r) {
  const f = SP_FIELDS[r.f];
  if (!f) return '';
  const ops = _spBOpsFor(r.f);
  const kindKey = f.kind === 'number' ? (f.lowFirst ? 'rank' : 'n') : f.kind === 'date' ? 'd' : f.kind === 'text' ? 't' : f.kind === 'list' ? 'l' : f.kind === 'enum' ? 'e' : f.kind === 'pl' ? 'p' : 'b';
  const cur = f.kind === 'bool' ? ((r.v === true || r.v === 'true') ? 'yes' : 'no') : r.op;
  return `<select class="dc-input spb-small" data-k="op" aria-label="${esc(t('sp_b_condition'))}">` +
    ops.map(o => _spBOpt(o, t('sp_bo_' + kindKey + '_' + o), o === cur)).join('') + `</select>`;
}

function _spBRuleHtml(r, path) {
  const f = SP_FIELDS[r.f];
  const missing = f && f.needs && !spDataHas(f.needs);
  // Two lines: what the rule looks at (and which chart), then the condition
  return `<div class="spb-rule${missing ? ' spb-rule-off' : ''}" data-path="${path}">` +
    `<div class="spb-rule-head">${_spBFieldBtn(r.f, false)}${f && f.chart ? _spBChartSeg(r) : ''}` +
    `<button type="button" class="dc-btn dc-btn-plain dc-btn-icon dc-btn-sm spb-del" data-act="del" title="${esc(t('sp_b_remove'))}" aria-label="${esc(t('sp_b_remove'))}">✕</button></div>` +
    `<div class="spb-rule-body">${_spBExtrasHtml(r)}${_spBOpHtml(r)}${_spBValueHtml(r)}</div>` +
    (missing ? `<p class="spb-rule-note">${esc(t('sp_skip_' + f.needs))}</p>` : '') +
    `</div>`;
}

function _spBMatchSeg(match, path) {
  return `<div class="dc-seg spb-match" role="group" data-path="${path}">` +
    `<button type="button" data-act="match" data-v="all" aria-pressed="${match !== 'any'}">${esc(t('sp_b_match_all'))}</button>` +
    `<button type="button" data-act="match" data-v="any" aria-pressed="${match === 'any'}">${esc(t('sp_b_match_any'))}</button>` +
    `</div>`;
}

function _spBRulesHtml() {
  const def = _spB.def;
  let html = `<div class="spb-rules">`;
  (def.rules || []).forEach((r, i) => {
    if (r.rules) {
      html += `<div class="spb-group" data-path="${i}">` +
        `<div class="spb-group-head">${_spBMatchSeg(r.match, String(i))}` +
        `<button type="button" class="dc-btn dc-btn-plain dc-btn-sm spb-del" data-act="del" data-path="${i}" title="${esc(t('sp_b_remove_group'))}" aria-label="${esc(t('sp_b_remove_group'))}">✕</button></div>` +
        r.rules.map((x, j) => _spBRuleHtml(x, i + '.' + j)).join('') +
        `<button type="button" class="dc-btn dc-btn-plain dc-btn-sm spb-add" data-act="addRule" data-path="${i}">＋ ${esc(t('sp_b_add_rule'))}</button>` +
        `</div>`;
    } else html += _spBRuleHtml(r, String(i));
  });
  if (!(def.rules || []).length) html += `<p class="spb-none">${esc(t('sp_b_no_rules'))}</p>`;
  html += `</div><div class="spb-adds">` +
    `<button type="button" class="dc-btn dc-btn-normal dc-btn-sm spb-add" data-act="addRule">＋ ${esc(t('sp_b_add_rule'))}</button>` +
    `<button type="button" class="dc-btn dc-btn-plain dc-btn-sm spb-add" data-act="addGroup">＋ ${esc(t('sp_b_add_group'))}</button>` +
    `</div>`;
  return html;
}

function _spBSettingsHtml() {
  const def = _spB.def;
  const sort = def.sort || { f: 'plays' };
  const sf = SP_FIELDS[sort.f];
  const flipped = !!sort.dir && sf && ((sort.dir === 'asc') !== !!sf.lowFirst);
  return `<div class="spb-settings">` +
    `<div class="spb-set spb-rule" data-path="sort"><span class="spb-label">${esc(t('sp_b_sort'))}</span>` +
      _spBFieldBtn(sort.f, true) + (sf && sf.chart ? _spBChartSeg(sort) : '') + (sort.f === 'random' ? '' : _spBExtrasHtml(sort)) +
      (sort.f === 'random' ? '' : `<select class="dc-input spb-small" data-k="dir" aria-label="${esc(t('sp_b_order'))}">` +
        _spBOpt('best', t('sp_b_dir_best'), !flipped) + _spBOpt('rev', t('sp_b_dir_rev'), flipped) + `</select>`) +
    `</div>` +
    `<label class="spb-set"><span class="spb-label">${esc(t('sp_b_limit'))}</span>` +
      `<input class="dc-input spb-num" type="number" min="1" max="${SP_MAX_SONGS}" id="spBLimit" value="${def.limit > 0 ? def.limit : ''}" placeholder="${SP_MAX_SONGS}"><span class="spb-unit">${esc(t('sp_b_songs'))}</span></label>` +
    `<label class="spb-set"><span class="spb-label">${esc(t('sp_b_per_artist'))}</span>` +
      `<input class="dc-input spb-num" type="number" min="1" max="50" id="spBPer" value="${def.perArtist > 0 ? def.perArtist : ''}" placeholder="–"></label>` +
    `</div>`;
}

function _spBRender() {
  const body = document.getElementById('spBBody');
  if (!body || !_spB) return;
  // The rule picker takes the whole body while it's open
  if (_spB.pick) {
    body.innerHTML = _spBPickerHtml();
    const scroller = body.closest('.dc-frame-body') || body;
    scroller.scrollTop = 0;
    return;
  }
  const def = _spB.def;
  let html = `<div class="spb-top">` +
    `<label class="spb-name"><span class="spb-label">${esc(t('sp_b_name'))}</span>` +
    `<input id="spBName" class="dc-input" type="text" maxlength="40" value="${esc(_spB.name)}" placeholder="${esc(t('sp_b_name_ph'))}"></label>`;
  // A new list can start from a ready-made one ("edit a copy"); a duplicate
  // already has its rules, so it doesn't get the choice
  if (!_spB.orig && !_spB.copyOf) {
    html += `<label class="spb-name"><span class="spb-label">${esc(t('sp_b_start'))}</span>` +
      `<select id="spBPreset" class="dc-input">` + _spBOpt('', t('sp_b_start_blank'), !_spB.preset) +
      SP_READY_IDS.map(id => _spBOpt(id, t('sp_ready_' + id), _spB.preset === id)).join('') + `</select></label>`;
  }
  html += `</div>`;
  html += `<div class="spb-section"><div class="spb-section-head"><h4 class="spb-h">${esc(t('sp_b_rules'))}</h4>${_spBMatchSeg(def.match, '')}</div>` + _spBRulesHtml() + `</div>`;
  html += `<div class="spb-section"><h4 class="spb-h">${esc(t('sp_b_settings'))}</h4>` + _spBSettingsHtml() + `</div>`;
  html += `<div class="spb-section"><h4 class="spb-h">${esc(t('sp_b_save_as'))}</h4>` +
    `<div class="dc-seg spb-mode" role="group">` +
    `<button type="button" data-act="mode" data-v="live" aria-pressed="${_spB.mode === 'live'}">✨ ${esc(t('sp_b_mode_live'))}</button>` +
    `<button type="button" data-act="mode" data-v="once" aria-pressed="${_spB.mode === 'once'}">${esc(t('sp_b_mode_once'))}</button>` +
    `</div><p class="spb-hint">${esc(t(_spB.mode === 'live' ? 'sp_b_mode_live_hint' : 'sp_b_mode_once_hint'))}</p></div>`;
  html += `<div class="spb-preview" id="spBPreview" aria-live="polite"></div>`;
  html += _spBDatalists();
  body.innerHTML = html;
  _spBPreview();
}

// Opens the rule picker for one rule (or the sort), on the rule's own group
function _spBOpenPick(path) {
  const node = _spBAt(path).node;
  const scroller = document.getElementById('spBBody')?.closest('.dc-frame-body');
  _spB.pick = { path, cat: node && node.f !== 'random' ? _spBGroupOf(node.f) : 'song', q: '', scroll: scroller ? scroller.scrollTop : 0, isNew: false };
  _spBRender();
  setTimeout(() => document.getElementById('spBPickQ')?.focus({ preventScroll: true }), 30);
}

// Back to the rules, where the window was scrolled to
function _spBClosePick() {
  const p = _spB.pick;
  _spB.pick = null;
  _spBRender();
  const scroller = document.getElementById('spBBody')?.closest('.dc-frame-body');
  if (scroller && p) scroller.scrollTop = p.scroll;
}

// Typing in the picker's search box redraws the cards only (keeps the focus)
function _spBPickSearch(q) {
  _spB.pick.q = q;
  const box = document.createElement('div');
  box.innerHTML = _spBPickerHtml();
  const cards = document.getElementById('spBPickCards');
  if (cards) cards.innerHTML = box.querySelector('#spBPickCards').innerHTML;
  document.querySelectorAll('#spBBody .spb-ptab').forEach(b => b.setAttribute('aria-pressed', String(!q && b.dataset.v === _spB.pick.cat)));
}

// The live part: how many songs match, the rules in words, the first songs
function _spBPreview() {
  const el = document.getElementById('spBPreview');
  if (!el || !_spB) return;
  const def = _spB.def;
  const res = spRun(_spCapped(def));
  let html = `<div class="spb-count"><b>${res.count.toLocaleString()}</b> ${esc(t(res.count === 1 ? 'sp_b_match_one' : 'sp_b_match_other'))}` +
    (res.count > res.songs.length ? ` <span>· ${esc(t('sp_b_keeps', { n: res.songs.length.toLocaleString() }))}</span>` : '') + `</div>`;
  html += `<p class="spb-desc">${esc(spDescribe(def))}</p>`;
  if (res.skipped.length) html += `<p class="spb-hint">${esc(res.skipped.map(n => t('sp_skip_' + n)).join(' '))}</p>`;
  if (res.songs.length) {
    html += `<ol class="spb-songs">` + res.songs.slice(0, 8).map(s =>
      `<li><span class="spb-song-t">${esc(s.title)}</span><span class="spb-song-a">${esc(s.artist)}</span></li>`).join('') + `</ol>`;
    if (res.songs.length > 8) html += `<p class="spb-hint">${esc(t('sp_b_and_more', { n: (res.songs.length - 8).toLocaleString() }))}</p>`;
  }
  el.innerHTML = html;
  const err = document.getElementById('spBErr');
  if (err) err.textContent = _spB.err || '';
}

function _spBSoon() {
  clearTimeout(_spBTimer);
  _spBTimer = setTimeout(_spBPreview, 180);
}

// ─── Changing the copy ────────────────────────────────────────────────────

// The rule (or group, or sort) a data-path points at, and the list it sits in
function _spBAt(path) {
  const def = _spB.def;
  if (path === 'sort') return { node: def.sort || (def.sort = { f: 'plays' }) };
  if (path === '' || path == null) return { node: def };
  const parts = String(path).split('.').map(Number);
  if (parts.length === 1) return { node: def.rules[parts[0]], list: def.rules, i: parts[0] };
  const g = def.rules[parts[0]];
  return { node: g.rules[parts[1]], list: g.rules, i: parts[1], group: g, gi: parts[0] };
}

// A value typed or picked in a rule row. Returns true when the row's shape
// changed and the window has to be redrawn.
function _spBSet(path, k, raw) {
  const { node: r } = _spBAt(path);
  if (!r) return false;
  const f = SP_FIELDS[r.f];
  const num = x => (x === '' || x == null) ? '' : +x;
  if (k === 'f') {
    if (path === 'sort') {
      const keep = { f: raw };
      if (SP_FIELDS[raw] && SP_FIELDS[raw].chart) keep.ch = r.ch || 'week';
      _spB.def.sort = keep;
    } else {
      const fresh = _spBNewRule(raw);
      // Going from one chart rule to another keeps the chart the user picked
      if (fresh.ch && r.ch) fresh.ch = SP_FIELDS[raw].buOnly && !SP_BU_CHARTS.includes(r.ch) ? 'week' : r.ch;
      Object.keys(r).forEach(x => delete r[x]);
      Object.assign(r, fresh);
    }
    return true;
  }
  if (k === 'op') {
    if (f.kind === 'bool') { r.op = 'is'; r.v = raw === 'yes'; return false; }
    r.op = raw; _spBFixValue(r); return true;
  }
  if (k === 'v') {
    if (f.kind === 'number' || (f.kind === 'date' && (r.op === 'within' || r.op === 'older'))) r.v = num(raw);
    else r.v = raw;
    return false;
  }
  if (k === 'v0' || k === 'v1') {
    if (!Array.isArray(r.v)) r.v = ['', ''];
    r.v[k === 'v0' ? 0 : 1] = f.kind === 'number' ? num(raw) : raw;
    return false;
  }
  if (k === 'ch') {
    r.ch = raw;
    // A yearly chart has no "same year last year": that's just last year
    if (raw === 'year' && r.when === 'yearAgo') r.when = 'last';
    return true;   // the labels name the chart
  }
  if (k === 'when') {
    // Each choice brings its own boxes, with a sensible start
    delete r.n; delete r.per; delete r.d; delete r.d2;
    if (raw === 'now' || !SP_WHENS.includes(raw)) { delete r.when; return true; }
    r.when = raw;
    if (raw === 'ago') r.n = 2;
    if (raw === 'lastN' || raw === 'allLastN') r.n = 4;
    if (raw === 'period') r.per = 'lastMonth';
    if (raw === 'date') r.d = _spBDaysAgo(30);
    if (raw === 'range') { r.d = _spBDaysAgo(90); r.d2 = _spBToday(); }
    return true;
  }
  if (k === 'whenN') { r.n = Math.max(1, Math.min(520, Math.round(+raw || 1))); return false; }
  if (k === 'whenD') { if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) r.d = raw; return false; }
  if (k === 'whenD2') { if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) r.d2 = raw; return false; }
  if (k === 'span') { r.span = +raw; return true; }
  if (k === 'dir') {
    const low = !!(SP_FIELDS[r.f] && SP_FIELDS[r.f].lowFirst);
    if (raw === 'best') delete r.dir; else r.dir = low ? 'desc' : 'asc';
    return false;
  }
  if (k === 'winMode') {
    if (raw === 'all') delete r.win;
    else if (raw === 'last') r.win = { last: 30 };
    else if (raw === 'first') r.win = { first: 30 };
    else if (raw === 'monthPast') r.win = { p: 'monthPast' };
    else if (raw === 'range') r.win = { from: _spBDaysAgo(365), to: _spBToday() };
    else r.win = { p: _spPerFresh(raw, r.win && r.win.p) };   // a named period, a year, a month, a season
    return true;
  }
  if (k === 'winN') { r.win = Object.assign({ last: Math.max(1, +raw || 1) }, r.win && r.win.unit ? { unit: r.win.unit } : {}); return false; }
  if (k === 'winUnit') { r.win = Object.assign({ last: (r.win && r.win.last) || 1 }, raw === 'day' ? {} : { unit: raw }); return false; }
  if (k === 'winFirst') { r.win = { first: Math.max(1, +raw || 1) }; return false; }
  // Year / month / season boxes, for the plays window (win…) and first / last played (per…)
  // (wp = an "around the chart" rule's period, kept in r.per)
  const per = /^(win|per|wp)(Kind|Y|M|S|SY)$/.exec(k);
  if (per) {
    const isWin = per[1] === 'win', isWp = per[1] === 'wp';
    const old = isWin ? (r.win && r.win.p) : isWp ? r.per : r.v;
    let code = old;
    if (per[2] === 'Kind') code = _spPerFresh(raw, old);
    else if (per[2] === 'Y') code = 'y:' + raw;
    else if (per[2] === 'M') { if (!/^\d{4}-\d{2}$/.test(raw)) return false; code = 'm:' + raw; }
    else if (per[2] === 'S') code = 's:' + raw + ':' + String(old).split(':')[2];
    else if (per[2] === 'SY') code = 's:' + String(old).split(':')[1] + ':' + raw;
    if (!_spPeriodOk(code)) return false;
    if (isWin) r.win = { p: code }; else if (isWp) r.per = code; else r.v = code;
    return per[2] === 'Kind';   // a new kind brings different boxes
  }
  if (k === 'winFrom') { r.win = Object.assign({}, r.win, { from: raw }); delete r.win.last; return false; }
  if (k === 'winTo') { r.win = Object.assign({}, r.win, { to: raw }); delete r.win.last; return false; }
  return false;
}

function _spBClick(e) {
  const btn = e.target.closest('[data-act]');
  if (!btn || !_spB) return;
  const act = btn.dataset.act;
  const row = btn.closest('[data-path]');
  const path = btn.dataset.path != null ? btn.dataset.path : (row ? row.dataset.path : '');
  const def = _spB.def;
  // ── The rule picker ──
  if (act === 'pick') { _spBOpenPick(path); return; }
  if (act === 'pickCat') { _spB.pick.cat = btn.dataset.v; _spB.pick.q = ''; _spBRender(); return; }
  if (act === 'pickClose') {
    // Backing out of a rule that was only just added drops it again
    const p = _spB.pick;
    if (p && p.isNew) {
      const at = _spBAt(p.path);
      if (at.list) at.list.splice(at.i, 1);
      if (at.group && !at.group.rules.length) def.rules.splice(at.gi, 1);
    }
    _spBClosePick();
    return;
  }
  if (act === 'pickField') {
    const p = _spB.pick;
    if (btn.dataset.v !== _spBAt(p.path).node.f || p.isNew) _spBSet(p.path, 'f', btn.dataset.v);
    _spBClosePick();
    return;
  }
  if (act === 'ch') {
    _spBSet(path, 'ch', btn.dataset.v);
    _spBRender();
    return;
  }
  if (act === 'match') {
    const seg = btn.closest('.spb-match');
    const target = _spBAt(seg.dataset.path).node;
    target.match = btn.dataset.v;
  } else if (act === 'mode') {
    _spB.mode = btn.dataset.v;
  } else if (act === 'addRule') {
    // A new rule goes straight to the picker, so the first thing the user
    // sees is the list of choices rather than a ready-filled "plays" row
    const inGroup = path !== '' && def.rules[+path] && def.rules[+path].rules;
    const list = inGroup ? def.rules[+path].rules : def.rules;
    list.push(_spBNewRule('plays'));
    _spBOpenPick(inGroup ? path + '.' + (list.length - 1) : String(list.length - 1));
    _spB.pick.isNew = true;
    _spB.pick.cat = 'song';
    _spBRender();
    return;
  } else if (act === 'addGroup') {
    def.rules.push({ match: 'any', rules: [_spBNewRule('genre'), _spBNewRule('genre')] });
  } else if (act === 'del') {
    const at = _spBAt(path);
    if (at.list) {
      at.list.splice(at.i, 1);
      // A group left empty goes too
      if (at.group && !at.group.rules.length) def.rules.splice(at.gi, 1);
    }
  } else return;
  _spBRender();
}

function _spBInput(e) {
  if (!_spB) return;
  const el = e.target;
  if (el.id === 'spBPickQ') { if (e.type === 'input') _spBPickSearch(el.value); return; }
  if (el.id === 'spBName') { _spB.name = el.value; _spB.err = ''; return; }
  if (el.id === 'spBLimit') { _spB.def.limit = Math.min(SP_MAX_SONGS, Math.max(0, +el.value || 0)); _spBSoon(); return; }
  if (el.id === 'spBPer') { _spB.def.perArtist = Math.max(0, +el.value || 0); _spBSoon(); return; }
  const k = el.dataset.k;
  const row = el.closest('[data-path]');
  if (!k || !row) return;
  // Typing in a box only updates the preview; picking from a list may
  // change the row, which is redrawn on 'change'
  if (e.type === 'input' && el.tagName === 'SELECT') return;
  const redraw = _spBSet(row.dataset.path, k, el.value);
  if (redraw && e.type === 'change') _spBRender(); else _spBSoon();
}

function _spBPreset(e) {
  if (!_spB || e.target.id !== 'spBPreset') return;
  const id = e.target.value;
  const def = id ? spReadyDef(id) : { match: 'all', rules: [_spBNewRule('plays')], sort: { f: 'plays' }, limit: 50 };
  delete def.ready; delete def.readyOpt;
  // The name follows the preset until the user types their own
  const typed = _spB.name && (!_spB.preset || _spB.name !== t('sp_ready_' + _spB.preset));
  _spB.def = def; _spB.preset = id;
  if (!typed) _spB.name = id ? t('sp_ready_' + id) : '';
  _spBRender();
}

// ─── Saving ───────────────────────────────────────────────────────────────

function spSaveBuilder() {
  if (!_spB) return;
  const name = String(_spB.name || '').trim();
  const fail = key => { _spB.err = t(key); const el = document.getElementById('spBErr'); if (el) el.textContent = _spB.err; };
  if (!name) return fail('sp_b_err_name');
  if (typeof _ytIsFavName === 'function' && _ytIsFavName(name)) return fail('sp_b_err_taken');
  // Another playlist already has the name (renaming onto itself is fine)
  if (name !== _spB.orig && _ytPlaylists[name]) return fail('sp_b_err_taken');
  const def = JSON.parse(JSON.stringify(_spB.def));
  // A smart list can't read itself, directly or through other smart lists
  if (spMakesLoop(name, def, _spB.orig)) return fail('sp_b_err_loop');
  // A ready-made list that's been changed keeps its id (so it isn't offered
  // again) but loses its picker, which would rebuild the old rules
  if (_spB.orig) {
    const old = spGet(_spB.orig);
    if (old && old.ready) { def.ready = old.ready; def.readyEdited = true; delete def.readyOpt; }
    if (old && old.notify) def.notify = true;   // step 9
  }

  if (_spB.mode === 'once') {
    // Save once: a normal playlist with today's songs and no rules
    const tracks = spRun(_spCapped(def)).songs.map(s => ({ title: s.title, artist: s.artist, album: s.album || '' }));
    if (!tracks.length) return fail('sp_b_err_empty');
    if (_spB.orig) {
      if (name !== _spB.orig) _dcPlDoRename(_spB.orig, name);
      spOnDelete(name);   // drop the rules, keep the playlist
    }
    _ytPlaylists[name] = tracks;
    _ytTouchPlaylist(name);
    _ytSavePlaylists();
  } else {
    if (_spB.orig && name !== _spB.orig) _dcPlDoRename(_spB.orig, name);
    _spStore.lists[name] = _spClean(def);
    _spStore.modified[name] = Date.now();
    delete _spStore.deleted[name];
    _spSave();
    spRefresh(name, true);
  }
  spCloseBuilder();
  if (typeof dcPlToast === 'function') dcPlToast(t('sp_b_saved', { name }));
  // Open the saved list so the user sees the result (the builder is only
  // opened from the Playlists tab)
  if (typeof _dcPlExpandedName !== 'undefined' && typeof dcRenderPlaylistsView === 'function') {
    _dcPlExpandedName = name;
    dcRenderPlaylistsView();
  }
}

// ─── Pieces app.js puts on the page ───────────────────────────────────────

// The library grid's "New smart playlist" card, next to "Save your queue"
function spNewCardHtml() {
  return `<div class="plx-new plx-new-smart">` +
    `<div class="plx-new-ico" aria-hidden="true">✨</div>` +
    `<div class="plx-new-title">${esc(t('sp_b_card_title'))}</div>` +
    `<div class="plx-new-sub">${esc(t(spSignedIn() ? 'sp_b_card_sub' : 'sp_signin_card'))}</div>` +
    `<div class="plx-new-form"><button type="button" class="dc-btn dc-btn-main dc-btn-sm" onclick="spOpenBuilder()">${esc(t('sp_b_card_btn'))}</button>` +
    // Mix it (step 8): needs two playlists to blend
    (!spSignedIn() || Object.keys(_ytPlaylists).length >= 2 ? `<button type="button" class="dc-btn dc-btn-normal dc-btn-sm" onclick="spOpenMix()">🎛️ ${esc(t('sp_mix_btn'))}</button>` : '') +
    `</div>` +
    `</div>`;
}

// "Edit rules" on an open smart playlist, and "Duplicate" next to it
// (opens the builder on a copy, to rename and change before saving)
function spEditBtnHtml(name) {
  const nj = esc(JSON.stringify(name));
  return `<button type="button" class="dc-btn dc-btn-normal spb-edit-btn" onclick="spOpenBuilder(${nj})">` +
    `<span aria-hidden="true">✨</span><span>${esc(t('sp_b_edit'))}</span></button>` +
    `<button type="button" class="dc-btn dc-btn-normal spb-edit-btn spb-dup-btn" onclick="spOpenBuilder(${nj},null,true)" title="${esc(t('sp_b_dup_hint'))}">` +
    `<span aria-hidden="true">⧉</span><span>${esc(t('sp_b_dup'))}</span></button>`;
}

// The window's listeners, set once
(function () {
  const wire = () => {
    const body = document.getElementById('spBBody');
    if (!body || body._spWired) return;
    body._spWired = true;
    body.addEventListener('click', _spBClick);
    body.addEventListener('input', _spBInput);
    body.addEventListener('change', e => { if (e.target.id === 'spBPreset') _spBPreset(e); else _spBInput(e); });
    // Escape in the rule picker goes back to the rules, not out of the window.
    // On window in the capture phase, so it runs before the site's own
    // document-level Escape handlers that close the open window.
    window.addEventListener('keydown', e => {
      if (e.key !== 'Escape' || !_spB || !_spB.pick) return;
      e.preventDefault(); e.stopImmediatePropagation();
      document.querySelector('#spBBody [data-act="pickClose"]')?.click();
    }, true);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();


/* ===========================================================================
   READY-MADE NAMES (2026-11-09)

   The ready-made lists got friendlier names. Two kinds of saved name are
   moved to the new ones the next time the lists refresh:
     • a raw translation key ("sp_ready_deep"): a browser once had an older
       copy of the language file cached when the lists were first added
     • the first plain names, in any language ("Deep cuts", "Lados B"…)
   A name the user picked themselves is never touched.
   =========================================================================== */

const SP_OLD_READY_NAMES = new Set(["A fuego lento", "Almost #1", "Casi n.º 1", "Crescimento lento", "Deep cuts", "Favoritas esquecidas", "Favoritas olvidadas", "Forgotten favourites", "Heavy rotation", "Joyas escondidas", "Lados B", "Lo que más suena", "Mais bem avaliadas", "Mais bem classificadas", "Mais tocadas do momento", "Mejor puntuadas", "Neste dia", "Never charted", "New to you", "Novas para ti", "Novas para você", "Nuevas para ti", "Nunca en la lista", "Nunca entraram na parada", "Nunca entraram na tabela", "O teu ano em 50", "On this day", "One-hit wonders", "Os teus #1", "Quase #1", "Seu ano em 50", "Seus #1", "Slow burners", "Sucessos de uma música só", "Tal día como hoy", "Top rated", "Tu año en 50", "Tus n.º 1", "Your #1s", "Your year in 50", "Éxitos únicos", "Êxitos únicos"]);

// Have the ready-made names loaded? (t() hands back the key when a word is missing)
function _spWordsReady() {
  return typeof t === 'function' && t('sp_ready_heavy') !== 'sp_ready_heavy';
}

function _spFixReadyNames() {
  if (!_spWordsReady() || typeof _dcPlDoRename !== 'function') return;
  for (const name of spNames()) {
    const def = spGet(name);
    if (!def || !def.ready) continue;
    const stale = /^sp_ready_/.test(name) || SP_OLD_READY_NAMES.has(name.replace(/ \d+$/, ''));
    if (!stale) continue;
    const fresh = t('sp_ready_' + def.ready);
    if (!fresh || fresh === name || /^sp_ready_/.test(fresh)) continue;
    // A free name: the new one, numbered if a playlist already has it
    let target = fresh, n = 2;
    while (_ytPlaylists[target] || spIsSmart(target)) target = fresh + ' ' + n++;
    _dcPlDoRename(name, target);
  }
}


/* ===========================================================================
   STEP 6: RULES ABOUT OTHER PLAYLISTS

   "In playlist" / "not in playlist" point at any of the user's playlists:
   normal ones, automatic chart ones, other smart ones. A smart list reads
   another smart list's current songs, so:
     • refreshing a list refreshes the smart lists it reads first (spRefresh)
     • a list can't read itself, directly or round a loop (spMakesLoop)
     • renaming a playlist renames it in every rule that points at it
   A rule pointing at a playlist that's been deleted reads it as empty:
   "in it" matches nothing, "not in it" matches everything.
   =========================================================================== */

let _spPlSets = new Map();      // playlist name → Set of song keys, per run
const _spRefreshing = new Set(); // lists being refreshed right now (loop guard)

// A playlist's songs as song keys (the same title|||artist form as songKey)
function _spPlSet(name) {
  let set = _spPlSets.get(name);
  if (set) return set;
  set = new Set();
  for (const tr of (_ytPlaylists[name] || [])) {
    set.add(String(tr.title || '').toLowerCase().trim() + '|||' + String(tr.artist || '').toLowerCase().trim());
  }
  _spPlSets.set(name, set);
  return set;
}

spAddField('inList', { kind: 'pl', get: s => s.key });

// The playlists a rule set reads, nested groups included
function spDeps(def, out) {
  out = out || new Set();
  for (const r of ((def && def.rules) || [])) {
    if (r.rules) spDeps(r, out);
    else if (r.f === 'inList' && r.v) out.add(r.v);
  }
  return out;
}

/* Would saving `def` under `name` make a loop? It would if the rules read
   `name` itself, or a smart list that (through any chain) reads `name`.
   `orig` is the list's old name when it's being renamed: other lists may
   still point at the old name, which becomes this list too. */
function spMakesLoop(name, def, orig) {
  const me = new Set([name, orig].filter(Boolean));
  const seen = new Set();
  const walk = deps => {
    for (const d of deps) {
      if (me.has(d)) return true;
      if (seen.has(d) || !spIsSmart(d)) continue;
      seen.add(d);
      if (walk(spDeps(spGet(d)))) return true;
    }
    return false;
  };
  return walk(spDeps(def));
}

// Renames a playlist inside one rule set; true when something changed
function _spRenameRefs(def, oldName, newName) {
  let hit = false;
  for (const r of ((def && def.rules) || [])) {
    if (r.rules) { if (_spRenameRefs(r, oldName, newName)) hit = true; }
    else if (r.f === 'inList' && r.v === oldName) { r.v = newName; hit = true; }
  }
  return hit;
}


/* ===========================================================================
   STEP 7: SAVE A COPY, AND WHAT CHANGED SINCE YOU LAST LOOKED

   Save a copy: today's songs as a normal playlist ("Stuck in My Head · Nov
   9"), which stays as it is and can be edited by hand.

   What changed: each device remembers the songs a smart list had the last
   time it was opened (localStorage 'dc-smart-seen', not synced: the old
   songs of every list would eat into the account's 1 MB playlists doc).
     • the library card says "+3 new · 1 gone" until the list is opened
     • the open list shows which songs came in and which dropped out, and
       marks the new ones in the song list
   Opening a list takes a snapshot of the difference (kept while it stays
   open, so redraws don't lose it) and makes today's songs the new "last
   looked". Only which songs are in it counts, not their order.
   =========================================================================== */

const SP_SEEN_LS = 'dc-smart-seen';
let _spSeen = null;       // name → [{ title, artist }]
let _spOpenDiff = null;   // { name, added, dropped } for the list that's open

function _spTrKey(tr) {
  return String(tr.title || '').toLowerCase().trim() + '|||' + String(tr.artist || '').toLowerCase().trim();
}

function _spSeenAll() {
  if (_spSeen) return _spSeen;
  try { _spSeen = JSON.parse(localStorage.getItem(SP_SEEN_LS) || '{}') || {}; } catch (e) { _spSeen = {}; }
  return _spSeen;
}
function _spSeenSave() {
  try { localStorage.setItem(SP_SEEN_LS, JSON.stringify(_spSeenAll())); } catch (e) {}
}
function _spSeenGet(name) { return _spSeenAll()[name] || null; }
function _spSeenSet(name, tracks) {
  _spSeenAll()[name] = (tracks || []).map(tr => ({ title: tr.title, artist: tr.artist }));
  _spSeenSave();
}
// Rename (to) or delete (to = null)
function _spSeenMove(from, to) {
  const all = _spSeenAll();
  if (!(from in all)) return;
  if (to) all[to] = all[from];
  delete all[from];
  _spSeenSave();
}

// The difference between a list's songs now and when it was last looked at
function _spDiffNow(name) {
  const seen = _spSeenGet(name);
  const now = _ytPlaylists[name] || [];
  if (!seen) return { added: [], dropped: [] };
  const was = new Set(seen.map(_spTrKey));
  const is = new Set(now.map(_spTrKey));
  return {
    added: now.filter(tr => !was.has(_spTrKey(tr))),
    dropped: seen.filter(tr => !is.has(_spTrKey(tr)))
  };
}

// The open list's snapshot: taken once per opening, then "last looked" moves on
function _spDiffFor(name) {
  if (_spOpenDiff && _spOpenDiff.name === name) return _spOpenDiff;
  const d = _spDiffNow(name);
  _spOpenDiff = { name, added: d.added, dropped: d.dropped, newKeys: new Set(d.added.map(_spTrKey)) };
  if (_ytPlaylists[name]) _spSeenSet(name, _ytPlaylists[name]);
  return _spOpenDiff;
}

// app.js: the library page is showing, so no list is open any more
function spLeftList() { _spOpenDiff = null; }

// Library card: "+3 new · 1 gone", or nothing when nothing changed
function spCardChangeHtml(name) {
  if (!spIsSmart(name)) return '';
  const d = _spDiffNow(name);
  if (!d.added.length && !d.dropped.length) return '';
  const parts = [];
  if (d.added.length) parts.push(`<span class="sp-cg-add">${esc(t('sp_cg_new', { n: d.added.length }))}</span>`);
  if (d.dropped.length) parts.push(`<span class="sp-cg-drop">${esc(t('sp_cg_gone', { n: d.dropped.length }))}</span>`);
  return `<div class="sp-cg-card">${parts.join(' · ')}</div>`;
}

// Is this song new in the open list? (for the NEW mark on its row)
function spIsNew(name, key) {
  return spIsSmart(name) && _spDiffFor(name).newKeys.has(key);
}
function spNewPillHtml() {
  return `<span class="sp-new-pill">${esc(t('badge_new_songs'))}</span>`;
}

// The open list's "Since you last looked" box, between the header and the songs
function spChangesHtml(name) {
  if (!spIsSmart(name)) return '';
  const d = _spDiffFor(name);
  if (!d.added.length && !d.dropped.length) return '';
  const MAX = 8;
  const list = (tracks, cls, sign) => `<ul class="sp-cg-list ${cls}">` +
    tracks.slice(0, MAX).map(tr => `<li><span class="sp-cg-sign" aria-hidden="true">${sign}</span><b>${esc(tr.title)}</b> <span>${esc(tr.artist || '')}</span></li>`).join('') +
    (tracks.length > MAX ? `<li class="sp-cg-more">${esc(t('sp_b_and_more', { n: tracks.length - MAX }))}</li>` : '') + `</ul>`;
  return `<section class="sp-cg" aria-label="${esc(t('sp_cg_title'))}">` +
    `<h3 class="sp-cg-title">${esc(t('sp_cg_title'))}</h3><div class="sp-cg-cols">` +
    (d.added.length ? `<div><h4 class="sp-cg-h">${esc(t('sp_cg_added', { n: d.added.length }))}</h4>${list(d.added, 'sp-cg-in', '+')}</div>` : '') +
    (d.dropped.length ? `<div><h4 class="sp-cg-h">${esc(t('sp_cg_dropped', { n: d.dropped.length }))}</h4>${list(d.dropped, 'sp-cg-out', '−')}</div>` : '') +
    `</div></section>`;
}

// ─── Save a copy ──────────────────────────────────────────────────────────

// Share on the Board (step 10), next to Save a copy
function spShareBtnHtml(name) {
  return `<button type="button" class="dc-btn dc-btn-plain dc-btn-icon sp-share-btn" onclick="spShareToBoard(${esc(JSON.stringify(name))})" title="${esc(t('sp_share'))}" aria-label="${esc(t('sp_share'))}">📣</button>`;
}

function spCopyBtnHtml(name) {
  const ico = typeof dcIco === 'function' ? dcIco('copy') : '⧉';
  return `<button type="button" class="dc-btn dc-btn-plain dc-btn-icon" onclick="spSaveCopy(${esc(JSON.stringify(name))})" title="${esc(t('sp_copy'))}" aria-label="${esc(t('sp_copy'))}">${ico}</button>`;
}

function spSaveCopy(name) {
  const tracks = _ytPlaylists[name];
  if (!tracks || !tracks.length) { if (typeof dcPlToast === 'function') dcPlToast(t('sp_b_err_empty')); return; }
  const tag = typeof _dcPlDateTag === 'function' ? _dcPlDateTag() : _spBToday();
  const base = name + ' · ' + tag;
  let copy = base, n = 2;
  while (_ytPlaylists[copy] || spIsSmart(copy)) copy = base + ' (' + n++ + ')';
  _ytPlaylists[copy] = tracks.map(tr => ({ title: tr.title, artist: tr.artist, album: tr.album || '' }));
  _ytTouchPlaylist(copy);
  _ytSavePlaylists();
  if (typeof dcPlToast === 'function') dcPlToast(t('sp_copy_saved', { name: copy }));
}


/* ===========================================================================
   STEP 8: MIX IT

   Blend 2 to 4 playlists into one. Smart lists are offered first, normal
   ones too. The mix takes one song from each list in turn, from the top of
   each, skipping songs already in the mix and artists that have hit the
   per-artist cap, until it's the chosen size or the lists run out. Then it
   plays straight away or is saved as a normal playlist.

   The last picks are remembered on this device (dc_sp_mix) so the same mix
   is one tap away next time.
   =========================================================================== */

const SP_MIX_LS = 'dc_sp_mix';
const SP_MIX_SIZES = [25, 50, 100];
let _spMix = null;   // { picked: [names], size, per, name }

// Smart lists first (A–Z), then the others (A–Z)
function _spMixNames() {
  const by = (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
  const all = Object.keys(_ytPlaylists).filter(n => (_ytPlaylists[n] || []).length);
  return all.filter(spIsSmart).sort(by).concat(all.filter(n => !spIsSmart(n)).sort(by));
}

/* The blend. Returns [{ title, artist, album, from }] where `from` is the
   list each song came from (shown in the preview). */
function spBlend(names, size, per) {
  const lists = names.map(n => ({ n, tracks: _ytPlaylists[n] || [], i: 0 }));
  const seen = new Set(), perArtist = new Map(), out = [];
  let going = true;
  while (out.length < size && going) {
    going = false;
    for (const L of lists) {
      if (out.length >= size) break;
      while (L.i < L.tracks.length) {
        const tr = L.tracks[L.i++];
        const k = _spTrKey(tr);
        const a = String(tr.artist || '').toLowerCase().trim();
        if (seen.has(k) || (per > 0 && (perArtist.get(a) || 0) >= per)) continue;
        seen.add(k);
        perArtist.set(a, (perArtist.get(a) || 0) + 1);
        out.push({ title: tr.title, artist: tr.artist, album: tr.album || '', from: L.n });
        going = true;
        break;
      }
    }
  }
  return out;
}

function spOpenMix() {
  if (!spSignedIn()) { spSignInvite(); return; }
  const modal = document.getElementById('spMixModal');
  if (!modal) return;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(SP_MIX_LS) || '{}') || {}; } catch (e) {}
  const names = _spMixNames();
  // Last time's picks that still exist; else the first two smart lists
  let picked = (saved.picked || []).filter(n => names.includes(n)).slice(0, 4);
  if (picked.length < 2) picked = names.slice(0, 2);
  const tag = typeof _dcPlDateTag === 'function' ? _dcPlDateTag() : '';
  _spMix = {
    picked,
    size: SP_MIX_SIZES.includes(saved.size) ? saved.size : 50,
    per: saved.per >= 0 ? saved.per : 2,
    name: t('sp_mix_default', { date: tag })
  };
  _spMixRender();
  modal.classList.add('open');
  if (typeof dcFillIcons === 'function') dcFillIcons(modal);
}

function spCloseMix() {
  document.getElementById('spMixModal')?.classList.remove('open');
  _spMix = null;
}

function _spMixRemember() {
  try { localStorage.setItem(SP_MIX_LS, JSON.stringify({ picked: _spMix.picked, size: _spMix.size, per: _spMix.per })); } catch (e) {}
}

function _spMixRender() {
  const body = document.getElementById('spMixBody');
  if (!body || !_spMix) return;
  const full = _spMix.picked.length >= 4;
  let html = `<h4 class="spb-h">${esc(t('sp_mix_pick'))}</h4><div class="spm-lists">` +
    _spMixNames().map(n => {
      const on = _spMix.picked.includes(n);
      const order = on ? _spMix.picked.indexOf(n) + 1 : '';
      return `<button type="button" class="spm-list${on ? ' is-on' : ''}" data-mix="${esc(n)}" aria-pressed="${on}"${!on && full ? ' disabled' : ''}>` +
        `<span class="spm-check" aria-hidden="true">${order}</span>` +
        `<span class="spm-name">${spIsSmart(n) ? '<span aria-hidden="true">✨ </span>' : ''}${esc(n)}</span>` +
        `<span class="spm-n">${esc(tCount('songs', (_ytPlaylists[n] || []).length))}</span></button>`;
    }).join('') + `</div>`;
  html += `<div class="spb-settings spm-settings">` +
    `<div class="spb-set"><span class="spb-label">${esc(t('sp_mix_size'))}</span><div class="dc-seg" role="group">` +
      SP_MIX_SIZES.map(n => `<button type="button" data-mix-size="${n}" aria-pressed="${_spMix.size === n}">${n}</button>`).join('') + `</div></div>` +
    `<label class="spb-set"><span class="spb-label">${esc(t('sp_b_per_artist'))}</span><select class="dc-input" id="spMixPer">` +
      [0, 1, 2, 3, 5].map(n => `<option value="${n}"${_spMix.per === n ? ' selected' : ''}>${n ? n : esc(t('sp_mix_any'))}</option>`).join('') + `</select></label>` +
    `<label class="spb-set"><span class="spb-label">${esc(t('sp_b_name'))}</span><input class="dc-input" id="spMixName" type="text" maxlength="40" value="${esc(_spMix.name)}"></label>` +
    `</div>`;
  html += `<div class="spb-preview" aria-live="polite">${_spMixPreviewHtml()}</div>`;
  body.innerHTML = html;
  const ready = _spMix.picked.length >= 2;
  document.querySelectorAll('#spMixModal [data-mix-go]').forEach(b => { b.disabled = !ready; });
}

function _spMixPreviewHtml() {
  if (_spMix.picked.length < 2) return `<p class="spb-hint">${esc(t('sp_mix_need'))}</p>`;
  const mix = spBlend(_spMix.picked, _spMix.size, _spMix.per);
  return `<div class="spb-count"><b>${mix.length.toLocaleString()}</b> ${esc(t('sp_mix_count'))}</div>` +
    `<ol class="spb-songs">` + mix.slice(0, 10).map(s =>
      `<li><span class="spb-song-t">${esc(s.title)}</span><span class="spb-song-a">${esc(s.artist)}</span><span class="spm-from">${esc(s.from)}</span></li>`).join('') + `</ol>` +
    (mix.length > 10 ? `<p class="spb-hint">${esc(t('sp_b_and_more', { n: (mix.length - 10).toLocaleString() }))}</p>` : '');
}

function _spMixClick(e) {
  if (!_spMix) return;
  const pick = e.target.closest('[data-mix]');
  const size = e.target.closest('[data-mix-size]');
  if (pick) {
    const n = pick.dataset.mix;
    const i = _spMix.picked.indexOf(n);
    if (i >= 0) _spMix.picked.splice(i, 1);
    else if (_spMix.picked.length < 4) _spMix.picked.push(n);
  } else if (size) _spMix.size = +size.dataset.mixSize;
  else return;
  _spMixRemember();
  _spMixRender();
}

function _spMixInput(e) {
  if (!_spMix) return;
  if (e.target.id === 'spMixName') { _spMix.name = e.target.value; return; }
  if (e.target.id === 'spMixPer') { _spMix.per = +e.target.value; _spMixRemember(); _spMixRender(); }
}

// Play the mix now, in the site player (it joins the queue like Play does)
function spMixPlay() {
  if (!_spMix || _spMix.picked.length < 2) return;
  const mix = spBlend(_spMix.picked, _spMix.size, _spMix.per);
  if (!mix.length) return;
  spCloseMix();
  const [first, ...rest] = mix;
  openYtPlayer(first.title, first.artist, first.album, null);
  rest.forEach(tr => _ytQueue.push({ title: tr.title, artist: tr.artist, album: tr.album, btn: null }));
  _ytUpdateQueueDisplay();
  _ytSaveQueue();
}

// Save the mix as a normal playlist (numbered if the name is taken) and open it
function spMixSave() {
  if (!_spMix || _spMix.picked.length < 2) return;
  const mix = spBlend(_spMix.picked, _spMix.size, _spMix.per);
  if (!mix.length) return;
  const base = String(_spMix.name || '').trim() || t('sp_mix_default', { date: typeof _dcPlDateTag === 'function' ? _dcPlDateTag() : '' });
  let name = base, n = 2;
  while (_ytPlaylists[name] || spIsSmart(name) || (typeof _ytIsFavName === 'function' && _ytIsFavName(name))) name = base + ' (' + n++ + ')';
  _ytPlaylists[name] = mix.map(s => ({ title: s.title, artist: s.artist, album: s.album }));
  _ytTouchPlaylist(name);
  _ytSavePlaylists();
  spCloseMix();
  if (typeof dcPlToast === 'function') dcPlToast(t('sp_b_saved', { name }));
  if (typeof dcRenderPlaylistsView === 'function') { _dcPlExpandedName = name; dcRenderPlaylistsView(); }
}

(function () {
  const wire = () => {
    const body = document.getElementById('spMixBody');
    if (!body || body._spWired) return;
    body._spWired = true;
    body.addEventListener('click', _spMixClick);
    body.addEventListener('input', _spMixInput);
    body.addEventListener('change', _spMixInput);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();


/* ===========================================================================
   STEP 9: TELL ME WHEN THIS LIST CHANGES A LOT

   A switch on each open smart list. When it's on, the user gets a
   notification (notifications.js, kind sp_changed) once enough new songs
   have come into the list since the last time they were told:
     at least SP_NT_MIN songs, and at least SP_NT_SHARE of the list
   ("a lot" for a 10-song list is 3, for a 50-song list 10).

   The songs the list had when the user was last told are kept in the
   account's notifyState doc (field sp: { name: [short song hashes] }), in
   the same transaction-guarded way as the other watchers, so two devices
   never send the same notification twice. Hashes, not titles: 500 songs
   fit in ~4 KB.

   Runs after the smart lists refresh and with the other watchers (ntWatch).
   Signed-in users only, and not on the demo library (the same rule the
   other watchers follow).
   =========================================================================== */

const SP_NT_MIN = 3;
const SP_NT_SHARE = 0.2;
let _spNtBusy = false;

// A short, steady hash of a song key, so the baseline stays small
function _spHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}

function _spNtOn() {
  return typeof dcIsSignedIn === 'function' && dcIsSignedIn() && typeof dcNotify === 'function';
}

function spNotifySwitchHtml(name) {
  const def = spGet(name);
  if (!def) return '';
  const signedIn = _spNtOn();
  const on = !!def.notify && signedIn;
  return `<label class="src-switch-row sp-nt-row">` +
    `<span class="src-switch-label">🔔 ${esc(t('sp_nt_switch'))}` +
    `<span class="set-switch-note">${esc(t(signedIn ? 'sp_nt_note' : 'sp_nt_signin'))}</span></span>` +
    `<span class="src-switch"><input type="checkbox"${on ? ' checked' : ''}${signedIn ? '' : ' disabled'} onchange="spSetNotify(${esc(JSON.stringify(name))}, this.checked)"><span class="src-switch-slider"></span></span>` +
    `</label>`;
}

function spSetNotify(name, on) {
  const def = spGet(name);
  if (!def) return;
  if (on) def.notify = true; else delete def.notify;
  _spStore.modified[name] = Date.now();
  _spSave();
  // Turning it on starts counting from today's songs
  if (on) spNotifyWatch();
}

/* The check. For each list with the switch on: no baseline yet → today's
   songs become it (nothing to tell). Otherwise count the songs that came
   in since; past the bar → tell the user and move the baseline on. */
async function spNotifyWatch() {
  if (_spNtBusy || !_spNtOn() || typeof dcUpdateNotifyState !== 'function') return;
  if (typeof _apAllowed === 'function' && !_apAllowed()) return;   // not on the demo library
  const watched = spNames().filter(n => spGet(n).notify && _ytPlaylists[n]);
  if (!watched.length) return;
  _spNtBusy = true;
  try {
    const now = {};
    for (const n of watched) now[n] = _ytPlaylists[n].map(tr => _spHash(_spTrKey(tr)));
    const tell = await dcUpdateNotifyState(cur => {
      const sp = Object.assign({}, cur.sp || {});
      const out = [];
      let dirty = false;
      for (const n of watched) {
        const base = sp[n];
        if (!Array.isArray(base)) { sp[n] = now[n]; dirty = true; continue; }
        const was = new Set(base), is = new Set(now[n]);
        const added = now[n].filter(h => !was.has(h)).length;
        const dropped = base.filter(h => !is.has(h)).length;
        const bar = Math.max(SP_NT_MIN, Math.ceil(now[n].length * SP_NT_SHARE));
        if (added >= bar) { out.push({ name: n, added, dropped }); sp[n] = now[n]; dirty = true; }
      }
      // Lists that no longer exist or were switched off drop their baseline
      for (const n of Object.keys(sp)) if (!watched.includes(n)) { delete sp[n]; dirty = true; }
      return dirty ? { state: Object.assign({}, cur, { sp }), out } : { state: null, out };
    });
    if (Array.isArray(tell)) {
      for (const x of tell) dcNotify({ kind: 'sp_changed', name: x.name, added: x.added, dropped: x.dropped, link: { tab: 'playlists', playlist: x.name } });
    }
  } catch (e) {
    console.warn('[dankcharts] Smart playlist notify check failed:', e);
  } finally { _spNtBusy = false; }
}


/* ===========================================================================
   STEP 10: SHARE A SMART PLAYLIST ON THE BOARD

   "Share on the Board" (📣 on an open smart list) opens the Board's new-post
   form with the list attached. What's shared is the RULES, not the songs:
   anyone who opens the post sees the rules in plain words (in their own
   language), how many of their own songs match, and "Add to my playlists",
   which makes the same smart list from their library.

   The rules travel as a short code at the end of the post's body (board.js
   hides it and shows the card). Left out of what's shared: rules about the
   sharer's own playlists (nobody else has them), the ready-made link, the
   bell. Everything read back from a post is someone else's text, so it's
   cleaned to the known fields and conditions before it's used.
   =========================================================================== */

const SP_SHARE_V = 1;

function _spB64Enc(str) {
  return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function _spB64Dec(code) {
  let b = String(code).replace(/-/g, '+').replace(/_/g, '/');
  while (b.length % 4) b += '=';
  return decodeURIComponent(escape(atob(b)));
}

// Only what the engine knows, from a rule set someone else wrote
function _spSafeRules(list, depth) {
  const out = [];
  for (const r of (Array.isArray(list) ? list : []).slice(0, 30)) {
    if (!r || typeof r !== 'object') continue;
    if (Array.isArray(r.rules)) {
      if (depth > 0) continue;   // one level of groups, like the builder
      const inner = _spSafeRules(r.rules, depth + 1);
      if (inner.length) out.push({ match: r.match === 'any' ? 'any' : 'all', rules: inner });
      continue;
    }
    const f = SP_FIELDS[r.f];
    if (!f || f.kind === 'pl') continue;   // unknown, or about someone's own playlists
    const x = { f: r.f, op: String(r.op || '') };
    const okV = v => (typeof v === 'number' && isFinite(v)) || typeof v === 'boolean' || (typeof v === 'string' && v.length <= 120);
    if (Array.isArray(r.v)) { if (r.v.length === 2 && r.v.every(okV)) x.v = r.v.slice(); else continue; }
    else if (okV(r.v)) x.v = r.v; else if (r.v != null) continue;
    if (SP_CHARTS.includes(r.ch)) x.ch = r.ch;
    // "Around the chart" rules: which charts count (see _spWhenSet)
    if (SP_WHENS.includes(r.when) && r.when !== 'now') {
      x.when = r.when;
      if (r.n > 0 && r.n <= 520) x.n = Math.round(r.n);
      if (_spPeriodOk(r.per)) x.per = String(r.per);
      if (/^\d{4}-\d{2}-\d{2}$/.test(r.d || '')) x.d = r.d;
      if (/^\d{4}-\d{2}-\d{2}$/.test(r.d2 || '')) x.d2 = r.d2;
    }
    if (r.span === 0 || r.span === 3) x.span = r.span;
    if (r.win && typeof r.win === 'object') {
      if (r.win.last > 0 && r.win.last <= 3650) {
        x.win = { last: Math.round(r.win.last) };
        if (['week', 'month', 'year'].includes(r.win.unit)) x.win.unit = r.win.unit;
      }
      // Named periods, this month in earlier years, a song's first N days (2026-11-16)
      else if (r.win.p === 'monthPast' || _spPeriodOk(r.win.p)) x.win = { p: String(r.win.p) };
      else if (r.win.first > 0 && r.win.first <= 3650) x.win = { first: Math.round(r.win.first) };
      else if (/^\d{4}-\d{2}-\d{2}$/.test(r.win.from || '') && /^\d{4}-\d{2}-\d{2}$/.test(r.win.to || '')) x.win = { from: r.win.from, to: r.win.to };
    }
    out.push(x);
  }
  return out;
}
function _spSafeDef(d) {
  if (!d || typeof d !== 'object') return null;
  const def = { match: d.match === 'any' ? 'any' : 'all', rules: _spSafeRules(d.rules, 0) };
  if (d.sort && (d.sort.f === 'random' || SP_FIELDS[d.sort.f])) {
    def.sort = _spSafeRules([Object.assign({}, d.sort, { op: 'x' })], 0)[0] || { f: 'random' };
    delete def.sort.op;
    if (d.sort.dir === 'asc' || d.sort.dir === 'desc') def.sort.dir = d.sort.dir;
    if (d.sort.f === 'random') def.sort = { f: 'random' };
  }
  if (d.limit > 0) def.limit = Math.min(SP_MAX_SONGS, Math.round(d.limit));
  if (d.perArtist > 0) def.perArtist = Math.min(50, Math.round(d.perArtist));
  return def;
}

// A smart list → the code that goes in a post
function spShareCode(name) {
  const def = spGet(name);
  if (!def) return null;
  const clean = _spSafeDef(def);
  return _spB64Enc(JSON.stringify({ v: SP_SHARE_V, n: String(name).slice(0, 40), d: clean }));
}

// A code from a post → { name, def }, or null when it can't be read
function spShareRead(code) {
  try {
    const o = JSON.parse(_spB64Dec(code));
    const def = _spSafeDef(o && o.d);
    if (!def) return null;
    return { name: String(o.n || t('sp_tag')).slice(0, 40), def };
  } catch (e) { return null; }
}

// Does sharing leave rules out (ones about the user's own playlists)?
function _spShareDrops(def) {
  return spDeps(def).size > 0;
}

function spShareToBoard(name) {
  const def = spGet(name);
  if (!def || !window.dcBoard) return;
  if (typeof dcIsSignedIn === 'function' && !dcIsSignedIn()) { if (typeof dcPlToast === 'function') dcPlToast(t('sp_share_signin')); return; }
  const code = spShareCode(name);
  if (!code) return;
  if (_spShareDrops(def) && typeof dcPlToast === 'function') dcPlToast(t('sp_share_dropped'));
  window.dcBoard.composeSmart({ code, name }, t('sp_share_title', { name }), t('sp_share_body'));
}

// The card on an open Board post
function spSharedCardHtml(code) {
  const got = spShareRead(code);
  if (!got) return `<div class="bd-smart-card"><p class="spb-hint">${esc(t('sp_share_bad'))}</p></div>`;
  let match = '';
  if (allPlays && allPlays.length) {
    const n = spRun(_spCapped(got.def)).songs.length;
    match = `<p class="bd-smart-match">${esc(t(n ? 'sp_share_match' : 'sp_share_match_none', { n: n.toLocaleString() }))}</p>`;
  }
  return `<div class="bd-smart-card">` +
    `<div class="bd-smart-head"><span class="bd-smart-ico" aria-hidden="true">✨</span><div>` +
    `<span class="plx-kicker">${esc(t('sp_tag'))}</span><div class="bd-smart-name">${esc(got.name)}</div></div></div>` +
    `<p class="bd-smart-desc">${esc(spDescribe(got.def))}</p>` + match +
    `<button type="button" class="dc-btn dc-btn-main dc-btn-sm" onclick="spAddShared('${code}')">＋ ${esc(t('sp_share_add'))}</button>` +
    `</div>`;
}

// "Add to my playlists": the same rules, run on this user's library
function spAddShared(code) {
  if (!spSignedIn()) { spSignInvite(); return; }
  const got = spShareRead(code);
  if (!got) return;
  let name = got.name, n = 2;
  while (_ytPlaylists[name] || spIsSmart(name) || (typeof _ytIsFavName === 'function' && _ytIsFavName(name))) name = got.name + ' (' + n++ + ')';
  if (!spCreate(name, got.def)) return;
  if (typeof dcPlToast === 'function') dcPlToast(t('sp_share_added', { name }));
  if (typeof dcPlOpenByName === 'function') dcPlOpenByName(name, false);
}


/* ===========================================================================
   SIGNED IN ONLY (2026-11-09)

   Smart playlists are for signed-in listeners. Signed out, the doors are
   still there (the Smart playlist card's Create and Mix it, the ready-made
   row, "Add to my playlists" on the Board), but each one opens a window
   that invites the visitor to sign in with Google (#spSignModal). Nothing
   is added, run or refreshed while signed out, and smart lists already on
   this device stay hidden until the visitor signs in again (spHidden, used
   by the library, the player's list and an open playlist).
   =========================================================================== */

function spSignedIn() { return typeof dcIsSignedIn === 'function' && dcIsSignedIn(); }

// app.js: should this playlist be left out right now?
function spHidden(name) { return spIsSmart(name) && !spSignedIn(); }

function spSignInvite() {
  const m = document.getElementById('spSignModal');
  if (!m) { if (typeof dcPlToast === 'function') dcPlToast(t('sp_signin_text')); return; }
  spCloseBuilder(); spCloseMix();
  m.classList.add('open');
  if (typeof dcFillIcons === 'function') dcFillIcons(m);
}
function spCloseSignInvite() { document.getElementById('spSignModal')?.classList.remove('open'); }
function spSignInFromInvite() {
  spCloseSignInvite();
  if (typeof dcSignIn === 'function') dcSignIn();
}

// firebase.js: signed in or out. The Playlists tab redraws so smart lists
// appear or hide; signing in also runs them (spMerge does that).
function spOnAuth() {
  if (typeof currentPeriod !== 'undefined' && currentPeriod === 'playlists' && typeof dcRenderPlaylistsView === 'function') dcRenderPlaylistsView();
}
