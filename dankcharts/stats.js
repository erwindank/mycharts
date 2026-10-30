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
   Overview tab to sxRenderOverview() and draws its charts for the others.

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

function _sxTabShown(tab) {
  const b = document.querySelector('.stats-tabs [data-st-tab="' + tab + '"]');
  return !!b && !b.hidden;
}

function _syncStatsTab() {
  if (!_sxTabShown(statsTab)) statsTab = 'overview';
  const view = document.getElementById('graphsView');
  if (view) view.dataset.stTab = statsTab;
  document.querySelectorAll('.stats-tabs > button').forEach(btn => {
    const on = btn.dataset.stTab === statsTab;
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-selected', String(on));
  });
}

function setStatsTab(tab) {
  if (!ST_TABS.includes(tab) || !_sxTabShown(tab)) return;
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

const _SX_DAY = 86400000;

// "12 Mar 2026" / "Mar 12, 2026" in the page language
function _sxDate(ts) {
  const locale = currentLang === 'en' ? 'en-US' : currentLang;
  return new Date(ts).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

// Totals for plays whose (time-zone) time is in [fromTs, toTs]. `trend` adds
// the per-bucket counts for the tiles' small lines.
function _sxTally(fromTs, toTs, trend) {
  const songs = new Set(), artists = new Set(), albums = new Set();
  const artistPlays = new Map(), dayPlays = new Map();
  let plays = 0;
  // Buckets for the trend lines: days for a short range, weeks up to ~3
  // years, months beyond that, so each line has 28–160 points.
  const span = toTs - fromTs;
  const bucketMs = span <= 62 * _SX_DAY ? _SX_DAY : span <= 3.2 * 365 * _SX_DAY ? 7 * _SX_DAY : 30.44 * _SX_DAY;
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
function _sxDelta(cur, prev) {
  if (prev === null) return '';
  if (!prev) return cur ? '<span class="stat-delta up">▲</span>' : '';
  const pct = Math.round((cur - prev) / prev * 100);
  if (pct > 0) return `<span class="stat-delta up">▲ ${pct}%</span>`;
  if (pct < 0) return `<span class="stat-delta down">▼ ${Math.abs(pct)}%</span>`;
  return `<span class="stat-delta same">${esc(t('stat_same'))}</span>`;
}

// One small stat under a tile's divider: a value over a label
function _sxSub(val, label, plain) {
  return `<div class="stat-sub-cell${plain ? ' is-plain' : ''}"><span class="stat-sub-val">${val}</span><span class="stat-sub-lbl">${esc(label)}</span></div>`;
}

function _sxTile(cat, labelKey, val, prev, trendVals, subHtml) {
  const vs = prev !== null ? `<span class="sx-vs">${esc(t('sx_vs').replace('{n}', prev.toLocaleString()))}</span>` : '';
  const foot = prev !== null ? `<div class="stat-foot">${_sxDelta(val, prev)}${vs}</div>` : '';
  return `<div class="stat-box sx-tile" data-cat="${cat}">
    <div class="stat-head"><span class="stat-label">${esc(t(labelKey))}</span></div>
    <div class="stat-val" data-val="${val}">${val.toLocaleString()}</div>
    ${foot}${_sxTrendSvg(trendVals)}
    ${subHtml ? `<div class="stat-sub">${subHtml}</div>` : ''}
  </div>`;
}

// A wide, soft trend line with a filled area (the tiles' "how it went")
function _sxTrendSvg(vals) {
  if (!vals || vals.length < 2) return '';
  const w = 100, h = 28, max = Math.max(...vals, 1);
  const pts = vals.map((v, i) => [(i / (vals.length - 1)) * w, h - 2 - (v / max) * (h - 4)]);
  const line = pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  return `<svg class="sx-trend" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true" focusable="false">` +
    `<polygon points="0,${h} ${line} ${w},${h}"/><polyline points="${line}"/></svg>`;
}

function sxRenderOverview() {
  const box = document.getElementById('sxOverview');
  if (!box || !allPlays.length) return;
  if (!firstSeenMaps) firstSeenMaps = buildFirstSeenMaps();
  const { songFirst, artistFirst, albumFirst } = firstSeenMaps;

  const { fromTs, toTs } = graphRangeTs();
  const firstTs = new Date(graphRangeDates().from + 'T00:00:00').getTime();
  const firstPlayTs = Math.min(...Object.values(artistFirst).map(d => d.getTime()));
  const span = toTs - fromTs + 1;
  const prevFrom = fromTs - span, prevTo = fromTs - 1;
  const hasPrev = graphRange.preset !== 'all' && prevFrom >= firstPlayTs - _SX_DAY;

  const cur = _sxTally(fromTs, toTs, true);
  const prev = hasPrev ? _sxTally(prevFrom, prevTo, false) : null;

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
  const days = Math.max(1, Math.round(span / _SX_DAY));

  // ── The sentence ──
  const P = graphRange.preset;
  const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
  const b = v => `<b>${v}</b>`;
  const artistLink = topArtist
    ? `<button type="button" class="sx-link" onclick="openArtistModal(${esc(JSON.stringify(topArtist))})">${esc(topArtist)}</button>`
    : '';
  let line;
  if (P === 'all') {
    line = fmt(t('sx_hero_all'), { plays: b(cur.plays.toLocaleString()), date: esc(_sxDate(firstTs)) });
  } else {
    const spanTxt = P === 'custom'
      ? fmt(t('sx_span_custom'), { from: esc(_sxDate(fromTs)), to: esc(_sxDate(toTs)) })
      : t('sx_span_' + P);
    if (prev && prev.plays) {
      const pct = Math.round((cur.plays - prev.plays) / prev.plays * 100);
      const change = pct >= 1 ? fmt(t('sx_more'), { pct: `<span class="sx-up">${pct}%</span>` })
        : pct <= -1 ? fmt(t('sx_fewer'), { pct: `<span class="sx-down">${Math.abs(pct)}%</span>` })
        : t('sx_about_same');
      line = fmt(t('sx_hero_main'), { plays: b(cur.plays.toLocaleString()), span: spanTxt, change, prev: t('sx_prev_' + P) });
    } else {
      line = fmt(t('sx_hero_main_noprev'), { plays: b(cur.plays.toLocaleString()), span: spanTxt });
    }
  }
  let line2 = '';
  if (topArtist) {
    // All time: every song was new once, so it counts artists instead
    const key = P === 'all' ? 'sx_hero_top_all' : newSongs ? 'sx_hero_top_new' : 'sx_hero_top';
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
  const playsSub = _sxSub(Math.round(cur.plays / days).toLocaleString(), t('hero_plays_per_day')) +
    (bestDay ? _sxSub(bestN.toLocaleString(), t('stat_best_day_short') + ' · ' + bestDayTxt) : '');
  const songPct = cur.songs.size ? Math.round(newSongs / cur.songs.size * 100) : 0;
  const tiles =
    _sxTile('plays', 'stat_total_plays', cur.plays, pv('plays'), cur.trend.plays, playsSub) +
    _sxTile('songs', 'stat_unique_songs', cur.songs.size, prev ? prev.songs.size : null, cur.trend.songs,
      _sxSub('+' + newSongs.toLocaleString(), t('stat_sub_new_songs')) + _sxSub(songPct + '%', t('stat_sub_of_total'))) +
    _sxTile('artists', 'stat_artists', cur.artists.size, prev ? prev.artists.size : null, cur.trend.artists,
      _sxSub('+' + newArtists.toLocaleString(), t('stat_sub_new_artists'))) +
    _sxTile('albums', 'stat_albums', cur.albums.size, prev ? prev.albums.size : null, cur.trend.albums,
      _sxSub('+' + newAlbums.toLocaleString(), t('stat_sub_new_albums')));

  box.innerHTML = `<div class="sx-hero">
      <p class="sx-hero-line">${line}${line2 ? ' ' + line2 : ''}</p>
      <div class="stats-strip sx-tiles">${tiles}</div>
    </div>`;
  animateStatStrip(box, 900);
}

// ── Charts: play volume and discoveries (step 2) ──────────────────────────
/* The old Total Play Volume and New Discoveries cards in one. Two views:
     Plays      each period's plays, split into songs you already knew and
                songs heard for the first time that period
     New finds  how many songs / artists / albums were heard for the first
                time each period (the old Discoveries chart)
   "New" always means first heard ever, so the counting runs over the whole
   history, oldest first; only the bars are cut to the range. Tap a bar to
   look inside that period (sxShowVolDrill). */
let sxVolMode = (() => { try { return localStorage.getItem('dc_sxVolMode') === 'new' ? 'new' : 'plays'; } catch (e) { return 'plays'; } })();
let _sxVol = null; // the last drawn data, for the look-inside box

function _sxKeyStart(k) {
  if (graphGranularity === 'day') return new Date(k + 'T00:00:00').getTime();
  if (graphGranularity === 'month') return new Date(k + '-01T00:00:00').getTime();
  return new Date(k + '-01-01T00:00:00').getTime();
}

function sxRenderVolume(sortedKeys, gc) {
  if (graphCharts.totalVolume) { try { graphCharts.totalVolume.destroy(); } catch (e) { } delete graphCharts.totalVolume; }
  const canvas = document.getElementById('gTotalVolume');
  if (!canvas) return;
  const { fromTs, toTs } = graphRangeTs();
  const keys = sortedKeys.filter(k => { const x = _sxKeyStart(k); return x >= fromTs && x <= toTs; });
  const inKey = new Set(keys);

  // One pass, oldest play first (allPlays is newest first)
  const plays = {}, newPlays = {}, nSong = {}, nArtist = {}, nAlbum = {};
  const firstKey = new Map(), seenArtist = new Set(), seenAlbum = new Set();
  for (let i = allPlays.length - 1; i >= 0; i--) {
    const p = allPlays[i], k = graphKey(p.date), sk = songKey(p);
    let fk = firstKey.get(sk);
    if (fk === undefined) { fk = k; firstKey.set(sk, k); if (inKey.has(k)) nSong[k] = (nSong[k] || 0) + 1; }
    for (const a of p.artists) if (!seenArtist.has(a)) { seenArtist.add(a); if (inKey.has(k)) nArtist[k] = (nArtist[k] || 0) + 1; }
    if (p.album && p.album !== '—') {
      const ak = albumKeyOf(p);
      if (!seenAlbum.has(ak)) { seenAlbum.add(ak); if (inKey.has(k)) nAlbum[k] = (nAlbum[k] || 0) + 1; }
    }
    if (inKey.has(k)) { plays[k] = (plays[k] || 0) + 1; if (fk === k) newPlays[k] = (newPlays[k] || 0) + 1; }
  }
  _sxVol = { keys, plays, newPlays, nSong, nArtist, nAlbum, firstKey, gran: graphGranularity };
  _sxPaintVolMode();

  const n = (o, k) => o[k] || 0;
  const bar = { borderColor: gc.cardBg, borderWidth: { top: 2 }, stack: 'v' };
  const datasets = sxVolMode === 'new' ? [
    { label: t('graph_new_songs'), data: keys.map(k => n(nSong, k)), backgroundColor: graphColor(0), ...bar },
    { label: t('graph_new_artists'), data: keys.map(k => n(nArtist, k)), backgroundColor: graphColor(1), ...bar },
    { label: t('graph_new_albums'), data: keys.map(k => n(nAlbum, k)), backgroundColor: graphColor(2), ...bar },
  ] : [
    { label: t('sx_vol_known'), data: keys.map(k => n(plays, k) - n(newPlays, k)), backgroundColor: gc.accent, ...bar },
    { label: t('sx_vol_new'), data: keys.map(k => n(newPlays, k)), backgroundColor: graphColor(2), ...bar },
  ];

  // Labels button: the bar's total over each stack
  const labelsPlugin = {
    id: 'sxVolLabels',
    afterDatasetsDraw(chart) {
      if (!gTotalVolumeLabels) return;
      const ctx = chart.ctx, last = chart.getDatasetMeta(chart.data.datasets.length - 1);
      last.data.forEach((el, i) => {
        const total = chart.data.datasets.reduce((s, ds) => s + (ds.data[i] || 0), 0);
        if (!total) return;
        ctx.save();
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillStyle = gc.text; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(total.toLocaleString(), el.x, el.y - 2);
        ctx.restore();
      });
    }
  };

  graphCharts.totalVolume = new Chart(canvas, {
    type: 'bar',
    data: { labels: keys.map(graphKeyLabel), datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      onClick: (e, els) => { if (els.length) sxShowVolDrill(keys[els[0].index]); },
      onHover: (e, els) => { e.native.target.style.cursor = els.length ? 'pointer' : ''; },
      plugins: {
        legend: graphLegend(gc),
        tooltip: {
          callbacks: {
            // Plays view: the period's first-time counts; New finds: its plays
            footer: items => {
              const k = keys[items[0].dataIndex];
              return sxVolMode === 'new'
                ? n(plays, k).toLocaleString() + ' ' + t('th_plays_mobile').toLowerCase()
                : _sxNewCounts(k);
            }
          }
        },
        zoom: { pan: { enabled: true, mode: 'x', onPanComplete: ({ chart }) => saveChartZoom(chart, 'totalVolume') }, zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x', onZoomComplete: ({ chart }) => saveChartZoom(chart, 'totalVolume') } }
      },
      scales: graphAxes(gc, { maxTicks: 24, stacked: true })
    },
    plugins: [labelsPlugin]
  });
  restoreChartZoom(graphCharts.totalVolume, 'totalVolume');
  // A box left open for a period no longer on the chart is closed
  const box = document.getElementById('sxVolDrill');
  if (box && !box.hidden && !inKey.has(box.dataset.key)) box.hidden = true;
}

function _sxNewCounts(k) {
  const v = _sxVol, n = o => (o[k] || 0).toLocaleString();
  return t('sx_vol_new_counts').replace('{s}', n(v.nSong)).replace('{a}', n(v.nArtist)).replace('{al}', n(v.nAlbum));
}

function _sxPaintVolMode() {
  document.querySelectorAll('#sxVolMode [data-vmode]').forEach(b => {
    const on = b.dataset.vmode === sxVolMode;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', String(on));
  });
}

document.getElementById('sxVolMode')?.addEventListener('click', e => {
  const b = e.target.closest('[data-vmode]');
  if (!b || b.dataset.vmode === sxVolMode) return;
  sxVolMode = b.dataset.vmode;
  try { localStorage.setItem('dc_sxVolMode', sxVolMode); } catch (err) { }
  if (typeof triggerTotalVolumeUpdate === 'function') triggerTotalVolumeUpdate();
});

// One song row in the look-inside box; opens the song's details
function _sxSongRow(i, sk, p, cnt) {
  return `<li><button type="button" class="sx-row" onclick="openSongModal(${esc(JSON.stringify(sk))})">` +
    `<span class="sx-row-n">${i + 1}</span><span class="sx-row-t"><b>${esc(p.title)}</b><span>${esc(p.artist)}</span></span>` +
    `<span class="sx-row-v">${cnt.toLocaleString()}</span></button></li>`;
}

/* The look-inside box under the chart: the period's plays, its top songs,
   the songs first heard in it, the first-time counts and a way to its
   chart (navigateToRecPeriod). */
function sxShowVolDrill(k) {
  const box = document.getElementById('sxVolDrill');
  if (!box || !_sxVol) return;
  const v = _sxVol, songs = new Map();
  for (const p of allPlays) {
    if (graphKey(p.date) !== k) continue;
    const sk = songKey(p), o = songs.get(sk);
    if (o) o.n++; else songs.set(sk, { n: 1, p });
  }
  const ranked = [...songs.entries()].sort((a, b) => b[1].n - a[1].n);
  const finds = ranked.filter(([sk]) => v.firstKey.get(sk) === k);
  const label = graphKeyLabel(k);
  const list = rows => rows.length
    ? `<ol class="sx-rows">${rows.slice(0, 5).map(([sk, o], i) => _sxSongRow(i, sk, o.p, o.n)).join('')}</ol>`
    : `<p class="sx-note">${esc(t('sx_drill_none'))}</p>`;
  const playsTxt = t('sx_drill_plays').replace('{n}', (v.plays[k] || 0).toLocaleString()).replace('{m}', (v.newPlays[k] || 0).toLocaleString());
  box.dataset.key = k;
  box.innerHTML =
    `<div class="sx-drill-head"><div><b>${esc(label)}</b><span>${esc(playsTxt)}</span></div>` +
    `<button type="button" class="dc-btn dc-btn-plain dc-btn-sm dc-btn-icon" onclick="this.closest('.sx-drill').hidden=true" aria-label="${esc(t('sx_drill_close'))}" title="${esc(t('sx_drill_close'))}">` +
    `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4 4 8 8M12 4l-8 8"/></svg></button></div>` +
    `<div class="sx-drill-cols"><div><h4>${esc(t('sx_drill_top'))}</h4>${list(ranked)}</div>` +
    `<div><h4>${esc(t('sx_drill_finds'))}</h4>${list(finds)}</div></div>` +
    `<div class="sx-drill-foot"><span>${esc(_sxNewCounts(k))}</span>` +
    `<button type="button" class="dc-btn dc-btn-normal dc-btn-sm" onclick="navigateToRecPeriod(${esc(JSON.stringify(v.gran))}, ${esc(JSON.stringify(k))})">${esc(t('sx_drill_open'))} →</button></div>`;
  box.hidden = false;
}

// ── Charts: the listening clock and your week (step 2) ────────────────────
/* For the range in the bar: plays by hour of the day (drawn as a clock) and
   the average plays on each day of the week. Tap an hour or a day for its
   count and most played artist. Times are in the chosen time zone
   (tzDateOf). The heatmap's Listening Patterns stay as they are: they follow
   the heatmap's year, these follow the range. */
let _sxWhen = null;

function _sxHourLabel(h) {
  const locale = currentLang === 'en' ? 'en-US' : currentLang;
  return new Date(2000, 0, 1, h).toLocaleTimeString(locale, { hour: 'numeric' });
}
function _sxDayLabel(d, long) {
  const locale = currentLang === 'en' ? 'en-US' : currentLang;
  // 2023-01-01 was a Sunday, so day d is Jan 1 + d
  return new Date(2023, 0, 1 + d).toLocaleDateString(locale, { weekday: long ? 'long' : 'short' });
}
const _sxTop = m => { let best = null, n = 0; m.forEach((c, a) => { if (c > n) { n = c; best = a; } }); return best; };

function sxRenderWhen() {
  const clock = document.getElementById('sxClock'), week = document.getElementById('sxWeek');
  if (!clock || !week || !allPlays.length) return;
  const { fromTs, toTs } = graphRangeTs();
  const hours = new Array(24).fill(0), days = new Array(7).fill(0);
  const hourArt = Array.from({ length: 24 }, () => new Map()), dayArt = Array.from({ length: 7 }, () => new Map());
  let first = Infinity;
  for (const p of allPlays) {
    const d = tzDateOf(p), ts = d.getTime();
    if (ts < fromTs || ts > toTs) continue;
    if (ts < first) first = ts;
    const h = d.getHours(), w = d.getDay(), a = p.artists[0];
    hours[h]++; days[w]++;
    hourArt[h].set(a, (hourArt[h].get(a) || 0) + 1);
    dayArt[w].set(a, (dayArt[w].get(a) || 0) + 1);
  }
  const total = hours.reduce((a, b) => a + b, 0);
  // How many of each weekday the range holds (from its first play)
  const nDays = new Array(7).fill(0);
  if (total) {
    const d = new Date(first); d.setHours(12, 0, 0, 0);
    for (; d.getTime() <= toTs; d.setDate(d.getDate() + 1)) nDays[d.getDay()]++;
  }
  const avg = days.map((n, i) => nDays[i] ? n / nDays[i] : 0);
  _sxWhen = { hours, total, avg, hourArt, dayArt };

  // ── The clock: 24 wedges, longer = more plays; 12 am at the top ──
  const cx = 150, cy = 150, r0 = 46, r1 = 128, max = Math.max(...hours, 1);
  const peak = hours.indexOf(Math.max(...hours));
  const low = hours.indexOf(Math.min(...hours));
  const pt = (a, r) => (cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1);
  let svg = `<svg viewBox="0 0 300 300" role="group" aria-label="${esc(t('sx_clock_title'))}">`;
  svg += `<circle class="sx-clock-ring" cx="${cx}" cy="${cy}" r="${r0 + (r1 - r0) / 2}"/><circle class="sx-clock-ring" cx="${cx}" cy="${cy}" r="${r1}"/>`;
  hours.forEach((n, h) => {
    const a0 = h / 24 * 2 * Math.PI - Math.PI / 2 + 0.018, a1 = (h + 1) / 24 * 2 * Math.PI - Math.PI / 2 - 0.018;
    const r = r0 + (r1 - r0) * (n / max);
    const lbl = `${_sxHourLabel(h)}: ${n.toLocaleString()}`;
    svg += `<path class="sx-clock-bar${h === peak ? ' is-peak' : ''}" data-h="${h}" tabindex="0" role="button" aria-label="${esc(lbl)}" style="--o:${(0.4 + 0.6 * n / max).toFixed(2)}"` +
      ` d="M${pt(a0, r0)} L${pt(a0, r)} A${r},${r} 0 0 1 ${pt(a1, r)} L${pt(a1, r0)} A${r0},${r0} 0 0 0 ${pt(a0, r0)}Z"><title>${esc(lbl)}</title></path>`;
  });
  [0, 6, 12, 18].forEach(h => {
    const a = h / 24 * 2 * Math.PI - Math.PI / 2;
    svg += `<text class="sx-clock-lbl" x="${(cx + Math.cos(a) * 141).toFixed(1)}" y="${(cy + Math.sin(a) * 141 + 4).toFixed(1)}">${esc(_sxHourLabel(h))}</text>`;
  });
  svg += `<text class="sx-clock-mid" x="${cx}" y="${cy + 2}">${esc(total ? _sxHourLabel(peak) : '–')}</text>` +
    `<text class="sx-clock-mid-sub" x="${cx}" y="${cy + 18}">${esc(t('sx_clock_peak'))}</text></svg>`;
  clock.innerHTML = svg;
  document.getElementById('sxClockNote').textContent = total
    ? t('sx_clock_note').replace('{peak}', _sxHourLabel(peak)).replace('{pct}', Math.round(hours[peak] / total * 100)).replace('{low}', _sxHourLabel(low))
    : '';

  // ── The week: one bar per day, starting on the week start day ──
  const order = Array.from({ length: 7 }, (_, i) => (weekStartDay + i) % 7);
  const amax = Math.max(...avg, 1);
  const wPeak = avg.indexOf(Math.max(...avg)), wLow = avg.indexOf(Math.min(...avg));
  week.innerHTML = order.map(d =>
    `<button type="button" class="sx-week-row${d === wPeak ? ' is-peak' : ''}" data-d="${d}">` +
    `<span class="sx-week-day">${esc(_sxDayLabel(d))}</span>` +
    `<span class="sx-week-bar"><i style="width:${(avg[d] / amax * 100).toFixed(1)}%"></i></span>` +
    `<span class="sx-week-val">${Math.round(avg[d]).toLocaleString()}</span></button>`).join('');
  document.getElementById('sxWeekNote').textContent = total
    ? t('sx_week_note').replace('{peak}', _sxDayLabel(wPeak, true)).replace('{low}', _sxDayLabel(wLow, true))
    : '';
}

// Tap an hour or a day: its numbers and most played artist in the note
document.getElementById('sxClock')?.addEventListener('click', e => {
  const b = e.target.closest('[data-h]');
  if (!b || !_sxWhen) return;
  const h = +b.dataset.h, n = _sxWhen.hours[h];
  document.querySelectorAll('#sxClock .sx-clock-bar').forEach(x => x.classList.toggle('is-picked', x === b));
  document.getElementById('sxClockNote').textContent = t('sx_clock_pick')
    .replace('{hour}', _sxHourLabel(h)).replace('{n}', n.toLocaleString())
    .replace('{pct}', _sxWhen.total ? Math.round(n / _sxWhen.total * 100) : 0)
    .replace('{artist}', _sxTop(_sxWhen.hourArt[h]) || '–');
});
document.getElementById('sxClock')?.addEventListener('keydown', e => {
  const b = e.target.closest && e.target.closest('[data-h]');
  if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); b.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
});
document.getElementById('sxWeek')?.addEventListener('click', e => {
  const b = e.target.closest('[data-d]');
  if (!b || !_sxWhen) return;
  const d = +b.dataset.d;
  document.querySelectorAll('#sxWeek .sx-week-row').forEach(x => x.classList.toggle('is-picked', x === b));
  document.getElementById('sxWeekNote').textContent = t('sx_week_pick')
    .replace('{day}', _sxDayLabel(d, true)).replace('{avg}', Math.round(_sxWhen.avg[d]).toLocaleString())
    .replace('{artist}', _sxTop(_sxWhen.dayArt[d]) || '–');
});
