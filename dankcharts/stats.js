/* ─── STATS PAGE (phase 15) ─────────────────────────────────────────────────
   The Stats page rebuilt in five tabs, one shown at a time like Records:
     Overview  one sentence and four tiles for the range picked in the bar
     Story     what the stretch was about (step 5–6)
     Games     quizzes on your own library, played full screen (step 7–8)
     Compare   anything side by side, the race included (step 3–4)
     Charts    play volume, discoveries, the clock, the heatmap (step 2)

   Lives in its own file like daily.js and insights.js; it only reads app.js
   globals (allPlays, graphRange, graphRangeDates, graphRangeTs,
   firstSeenMaps, currentPeriod…). app.js's renderGraphs() hands the
   Overview tab to stRenderOverview() and draws its charts for the others.

   Works the same for Last.fm, Google Sheets and CSV: everything comes from
   allPlays. */

// ── The tabs ──────────────────────────────────────────────────────────────
/* The open tab sits on #graphsView as data-st-tab; CSS hides every card
   whose data-st-group names another tab. Story and Games are hidden in the
   tab row until they are built, so a saved choice of one falls back to
   Overview. */
const ST_TABS = ['overview', 'story', 'games', 'compare', 'charts'];
let statsTab = (() => {
  try { const v = localStorage.getItem('dc_stats_tab'); return ST_TABS.includes(v) ? v : 'overview'; }
  catch (e) { return 'overview'; }
})();

function _stTabShown(tab) {
  const b = document.querySelector('.stats-tabs [data-st-tab="' + tab + '"]');
  return !!b && !b.hidden;
}

function _syncStatsTab() {
  if (!_stTabShown(statsTab)) statsTab = 'overview';
  const view = document.getElementById('graphsView');
  if (view) view.dataset.stTab = statsTab;
  document.querySelectorAll('.stats-tabs > button').forEach(btn => {
    const on = btn.dataset.stTab === statsTab;
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-selected', String(on));
  });
}

function setStatsTab(tab) {
  if (!ST_TABS.includes(tab) || !_stTabShown(tab)) return;
  statsTab = tab;
  try { localStorage.setItem('dc_stats_tab', tab); } catch (e) { }
  _syncStatsTab();
  // Each tab is drawn when it is opened (charts drawn while hidden come out 0 wide)
  if (currentPeriod === 'graphs' && allPlays.length) renderGraphs();
}

_syncStatsTab();

// ── Overview ──────────────────────────────────────────────────────────────
/* One sentence and four tiles (Plays / Songs / Artists / Albums) for the
   range in the bar, each against the same stretch just before it. The
   comparison is left out when that stretch starts before the first play
   (All, or a range that reaches back to the start), because it would
   compare against a part-empty stretch. No Hours tile: there is no song
   length in the data. */

const _ST_DAY = 86400000;

// "12 Mar 2026" / "Mar 12, 2026" in the page language
function _stDate(ts) {
  const locale = currentLang === 'en' ? 'en-US' : currentLang;
  return new Date(ts).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

// Totals for plays whose (time-zone) time is in [fromTs, toTs]. `trend` adds
// the per-bucket counts for the tiles' small lines.
function _stTally(fromTs, toTs, trend) {
  const songs = new Set(), artists = new Set(), albums = new Set();
  const artistPlays = new Map(), dayPlays = new Map();
  let plays = 0;
  // Buckets for the trend lines: days for a short range, weeks up to ~3
  // years, months beyond that, so each line has 28–160 points.
  const span = toTs - fromTs;
  const bucketMs = span <= 62 * _ST_DAY ? _ST_DAY : span <= 3.2 * 365 * _ST_DAY ? 7 * _ST_DAY : 30.44 * _ST_DAY;
  const nB = trend ? Math.max(1, Math.ceil(span / bucketMs)) : 0;
  const bPlays = new Array(nB).fill(0);
  const bSongs = trend ? Array.from({ length: nB }, () => new Set()) : null;
  const bArtists = trend ? Array.from({ length: nB }, () => new Set()) : null;
  const bAlbums = trend ? Array.from({ length: nB }, () => new Set()) : null;
  for (const p of allPlays) {
    const d = tzDateOf(p), ts = d.getTime();
    if (ts < fromTs || ts > toTs) continue;
    plays++;
    const sk = songKey(p);
    songs.add(sk);
    for (const a of p.artists) { artists.add(a); artistPlays.set(a, (artistPlays.get(a) || 0) + 1); }
    const ak = p.album && p.album !== '—' ? albumKeyOf(p) : null;
    if (ak) albums.add(ak);
    const dk = localDateStr(d);
    dayPlays.set(dk, (dayPlays.get(dk) || 0) + 1);
    if (trend) {
      const b = Math.min(nB - 1, Math.floor((ts - fromTs) / bucketMs));
      bPlays[b]++;
      bSongs[b].add(sk);
      for (const a of p.artists) bArtists[b].add(a);
      if (ak) bAlbums[b].add(ak);
    }
  }
  return {
    plays, songs, artists, albums, artistPlays, dayPlays,
    trend: trend ? { plays: bPlays, songs: bSongs.map(s => s.size), artists: bArtists.map(s => s.size), albums: bAlbums.map(s => s.size) } : null,
  };
}

// "▲ 18%" / "▼ 4%" / "Same" in the tiles' own delta style
function _stDelta(cur, prev) {
  if (prev === null) return '';
  if (!prev) return cur ? '<span class="stat-delta up">▲</span>' : '';
  const pct = Math.round((cur - prev) / prev * 100);
  if (pct > 0) return `<span class="stat-delta up">▲ ${pct}%</span>`;
  if (pct < 0) return `<span class="stat-delta down">▼ ${Math.abs(pct)}%</span>`;
  return `<span class="stat-delta same">${esc(t('stat_same'))}</span>`;
}

// One small stat under a tile's divider: a value over a label
function _stSub(val, label, plain) {
  return `<div class="stat-sub-cell${plain ? ' is-plain' : ''}"><span class="stat-sub-val">${val}</span><span class="stat-sub-lbl">${esc(label)}</span></div>`;
}

function _stTile(cat, labelKey, val, prev, trendVals, subHtml) {
  const vs = prev !== null ? `<span class="st-vs">${esc(t('st_vs').replace('{n}', prev.toLocaleString()))}</span>` : '';
  const foot = prev !== null ? `<div class="stat-foot">${_stDelta(val, prev)}${vs}</div>` : '';
  return `<div class="stat-box st-tile" data-cat="${cat}">
    <div class="stat-head"><span class="stat-label">${esc(t(labelKey))}</span></div>
    <div class="stat-val" data-val="${val}">${val.toLocaleString()}</div>
    ${foot}${_stTrendSvg(trendVals)}
    ${subHtml ? `<div class="stat-sub">${subHtml}</div>` : ''}
  </div>`;
}

// A wide, soft trend line with a filled area (the tiles' "how it went")
function _stTrendSvg(vals) {
  if (!vals || vals.length < 2) return '';
  const w = 100, h = 28, max = Math.max(...vals, 1);
  const pts = vals.map((v, i) => [(i / (vals.length - 1)) * w, h - 2 - (v / max) * (h - 4)]);
  const line = pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  return `<svg class="st-trend" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true" focusable="false">` +
    `<polygon points="0,${h} ${line} ${w},${h}"/><polyline points="${line}"/></svg>`;
}

function stRenderOverview() {
  const box = document.getElementById('stOverview');
  if (!box || !allPlays.length) return;
  if (!firstSeenMaps) firstSeenMaps = buildFirstSeenMaps();
  const { songFirst, artistFirst, albumFirst } = firstSeenMaps;

  const { fromTs, toTs } = graphRangeTs();
  const firstTs = new Date(graphRangeDates().from + 'T00:00:00').getTime();
  const firstPlayTs = Math.min(...Object.values(artistFirst).map(d => d.getTime()));
  const span = toTs - fromTs + 1;
  const prevFrom = fromTs - span, prevTo = fromTs - 1;
  const hasPrev = graphRange.preset !== 'all' && prevFrom >= firstPlayTs - _ST_DAY;

  const cur = _stTally(fromTs, toTs, true);
  const prev = hasPrev ? _stTally(prevFrom, prevTo, false) : null;

  // New to you: heard for the first time ever inside the range
  const isNew = (first, k) => first[k] && first[k].getTime() >= fromTs;
  const newSongs = [...cur.songs].filter(k => isNew(songFirst, k)).length;
  const newArtists = [...cur.artists].filter(k => isNew(artistFirst, k)).length;
  const newAlbums = [...cur.albums].filter(k => isNew(albumFirst, k)).length;

  // Top artist and best day of the range
  let topArtist = null, topN = 0;
  cur.artistPlays.forEach((n, a) => { if (n > topN) { topN = n; topArtist = a; } });
  let bestDay = null, bestN = 0;
  cur.dayPlays.forEach((n, d) => { if (n > bestN) { bestN = n; bestDay = d; } });
  const days = Math.max(1, Math.round(span / _ST_DAY));

  // ── The sentence ──
  const P = graphRange.preset;
  const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
  const b = v => `<b>${v}</b>`;
  const artistLink = topArtist
    ? `<button type="button" class="st-link" onclick="openArtistModal(${esc(JSON.stringify(topArtist))})">${esc(topArtist)}</button>`
    : '';
  let line;
  if (P === 'all') {
    line = fmt(t('st_hero_all'), { plays: b(cur.plays.toLocaleString()), date: esc(_stDate(firstTs)) });
  } else {
    const spanTxt = P === 'custom'
      ? fmt(t('st_span_custom'), { from: esc(_stDate(fromTs)), to: esc(_stDate(toTs)) })
      : t('st_span_' + P);
    if (prev && prev.plays) {
      const pct = Math.round((cur.plays - prev.plays) / prev.plays * 100);
      const change = pct >= 1 ? fmt(t('st_more'), { pct: `<span class="st-up">${pct}%</span>` })
        : pct <= -1 ? fmt(t('st_fewer'), { pct: `<span class="st-down">${Math.abs(pct)}%</span>` })
        : t('st_about_same');
      line = fmt(t('st_hero_main'), { plays: b(cur.plays.toLocaleString()), span: spanTxt, change, prev: t('st_prev_' + P) });
    } else {
      line = fmt(t('st_hero_main_noprev'), { plays: b(cur.plays.toLocaleString()), span: spanTxt });
    }
  }
  let line2 = '';
  if (topArtist) {
    // All time: every song was new once, so it counts artists instead
    const key = P === 'all' ? 'st_hero_top_all' : newSongs ? 'st_hero_top_new' : 'st_hero_top';
    line2 = fmt(t(key), {
      artist: artistLink, n: topN.toLocaleString(), songs: b(newSongs.toLocaleString()),
      artists: b(cur.artists.size.toLocaleString()),
    });
  }

  // ── The four tiles ──
  const pv = k => prev ? prev[k] : null;
  // Best day as "345 / best day · Jun 22" (no year, so the tile keeps two
  // small stats like the others and the numbers stay in line)
  const locale = currentLang === 'en' ? 'en-US' : currentLang;
  const bestDayTxt = bestDay ? new Date(bestDay + 'T12:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'short' }) : '';
  const playsSub = _stSub(Math.round(cur.plays / days).toLocaleString(), t('hero_plays_per_day')) +
    (bestDay ? _stSub(bestN.toLocaleString(), t('stat_best_day_short') + ' · ' + bestDayTxt) : '');
  const songPct = cur.songs.size ? Math.round(newSongs / cur.songs.size * 100) : 0;
  const tiles =
    _stTile('plays', 'stat_total_plays', cur.plays, pv('plays'), cur.trend.plays, playsSub) +
    _stTile('songs', 'stat_unique_songs', cur.songs.size, prev ? prev.songs.size : null, cur.trend.songs,
      _stSub('+' + newSongs.toLocaleString(), t('stat_sub_new_songs')) + _stSub(songPct + '%', t('stat_sub_of_total'))) +
    _stTile('artists', 'stat_artists', cur.artists.size, prev ? prev.artists.size : null, cur.trend.artists,
      _stSub('+' + newArtists.toLocaleString(), t('stat_sub_new_artists'))) +
    _stTile('albums', 'stat_albums', cur.albums.size, prev ? prev.albums.size : null, cur.trend.albums,
      _stSub('+' + newAlbums.toLocaleString(), t('stat_sub_new_albums')));

  box.innerHTML = `<div class="st-hero">
      <p class="st-hero-line">${line}${line2 ? ' ' + line2 : ''}</p>
      <div class="stats-strip st-tiles">${tiles}</div>
    </div>`;
  animateStatStrip(box, 900);
}
