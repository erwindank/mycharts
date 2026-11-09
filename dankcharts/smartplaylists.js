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

function _spWinRange(win) {
  if (!win) return null;
  if (win.last > 0) {
    const today = (typeof localDateStr === 'function' && typeof tzNow === 'function')
      ? localDateStr(tzNow()) : new Date().toISOString().slice(0, 10);
    // The last N days including today: today and the N-1 days before it
    const d = new Date(today + 'T12:00:00');
    d.setDate(d.getDate() - (win.last - 1));
    const from = (typeof localDateStr === 'function') ? localDateStr(d) : d.toISOString().slice(0, 10);
    return { from, to: today };
  }
  if (win.from || win.to) return { from: win.from || '0000-00-00', to: win.to || '9999-99-99' };
  return null;
}

// song key → plays inside the window (songs with none are missing)
function _spWinCounts(win) {
  const r = _spWinRange(win);
  if (!r) return null;
  const id = r.from + '~' + r.to;
  let m = _spWinCache.get(id);
  if (m) return m;
  m = new Map();
  for (const p of (allPlays || [])) {
    const ds = _spDay(p);
    if (ds < r.from || ds > r.to) continue;
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

// A song's rating (0–10), or null when it isn't rated
function spRatingOf(s) {
  if (typeof ratingSongScore !== 'function') return null;
  return ratingSongScore((s.title + '|||' + s.artist).toLowerCase());
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
  plays:   { kind: 'number', get: (s, r) => r && r.win ? ((_spWinCounts(r.win) || new Map()).get(s.key) || 0) : s.plays, win: true },
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
    between: (x, v) => Array.isArray(v) && _spDayOf(x) >= String(v[0]) && _spDayOf(x) <= String(v[1])
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
    map.set(k, { peak, wks: E.length, at1, debut: E[0].rank, climb, runs, longest, toPeak, at1At, peakAt });
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

// ─── LISTENING HABITS ─────────────────────────────────────────────────────
/* When in the day and week a song gets played. Needs real play times: a
   date-only Google Sheet puts every play at midnight, so those libraries get
   these rules greyed out (spDataHas('times')).

   Per song:
     night     % of plays between 22:00 and 04:59
     weekend   % of plays on Saturday or Sunday
     topHour   the hour (0–23) it's played most
     topDay    the weekday ('0' = Sunday … '6' = Saturday) it's played most */

const SP_NIGHT_FROM = 22, SP_NIGHT_TO = 5;   // 22:00 up to (not including) 05:00
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
    if (!x) raw.set(k, x = { n: 0, night: 0, weekend: 0, hours: new Array(24).fill(0), days: new Array(7).fill(0) });
    x.n++;
    if (h >= SP_NIGHT_FROM || h < SP_NIGHT_TO) x.night++;
    if (wd === 0 || wd === 6) x.weekend++;
    x.hours[h]++; x.days[wd]++;
  }
  const argmax = a => a.reduce((bi, v, i) => v > a[bi] ? i : bi, 0);
  const map = new Map();
  for (const [k, x] of raw) {
    map.set(k, {
      night: Math.round(x.night / x.n * 100),
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
spAddField('night',   { kind: 'number', needs: 'times', get: _spHabitGet('night') });
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
      albumPlays: null, albumRank: null
    });
  });
  for (const songs of alb.values()) {
    const total = songs.reduce((t, s) => t + s.plays, 0);
    songs.sort((a, b) => b.plays - a.plays).forEach((s, i) => {
      const m = map.get(s.key);
      m.albumPlays = total; m.albumRank = i + 1;
    });
  }
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

// The user's average song rating; spRun clears it at the start of every run
let _spAvgRating = null;
function _spRatingAvg() {
  if (_spAvgRating != null) return _spAvgRating;
  if (typeof _ratings === 'undefined' || typeof ratingSongScore !== 'function') return (_spAvgRating = NaN);
  let sum = 0, n = 0;
  for (const k in _ratings.songs) { const v = ratingSongScore(k); if (v != null) { sum += v; n++; } }
  return (_spAvgRating = n ? sum / n : NaN);
}
spAddField('aboveAvg', { kind: 'bool', needs: 'ratings', get: s => {
  const v = spRatingOf(s), avg = _spRatingAvg();
  return (v == null || isNaN(avg)) ? null : v > avg;
} });
