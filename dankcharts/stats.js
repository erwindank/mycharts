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

// ── Compare studio (step 3) ───────────────────────────────────────────────
/* Up to ten artists, songs, albums or years side by side. Replaces the two
   artist comparison charts (Cumulative Plays and Play Volume by artist).
     Running total  plays added up over the range (the old cumulative chart)
     Per period     plays in each day / month / year (the old volume chart)
     Chart run      where each one ranked on the daily / weekly / monthly /
                    yearly chart, period by period (not for years)
   Under the chart, a verdict row says who won what. Years are compared
   month by month over whole years, so the date range doesn't apply to them.
   A type opens on your top 3 for the range until you change its picks;
   picks are kept per type in dc_sxCmp. */
const SX_CMP_MAX = 10;
const SX_CMP_TYPES = ['artists', 'songs', 'albums', 'years'];
let sxCmp = (() => {
  const d = { type: 'artists', mode: 'cum', run: 'week', picks: { artists: null, songs: null, albums: null, years: null } };
  try {
    const s = JSON.parse(localStorage.getItem('dc_sxCmp') || 'null');
    if (s && SX_CMP_TYPES.includes(s.type)) return { ...d, ...s, picks: { ...d.picks, ...(s.picks || {}) } };
  } catch (e) { }
  return d;
})();
function _sxCmpSave() { try { localStorage.setItem('dc_sxCmp', JSON.stringify(sxCmp)); } catch (e) { } }

// The keys a play counts towards, for each type
function _sxPlayKeys(type, p) {
  if (type === 'artists') return p.artists;
  if (type === 'songs') return [songKey(p)];
  if (type === 'albums') return p.album && p.album !== '—' ? [albumKeyOf(p)] : [];
  return [String(tzDateOf(p).getFullYear())];
}

/* Names, totals and first plays of everything, per type, for the picker,
   the chips and the verdict. Built once per data change. */
let _sxIdx = null;
function _sxIndex() {
  const gen = allPlays.length + '|' + (typeof _playsVersion !== 'undefined' ? _playsVersion : '') + '|' + (typeof _stampEpoch !== 'undefined' ? _stampEpoch : '');
  if (_sxIdx && _sxIdx.gen === gen) return _sxIdx;
  const idx = { gen };
  for (const type of SX_CMP_TYPES) idx[type] = new Map();
  for (const p of allPlays) {
    for (const type of SX_CMP_TYPES) {
      for (const k of _sxPlayKeys(type, p)) {
        let o = idx[type].get(k);
        if (!o) {
          const label = type === 'songs' ? p.title : type === 'albums' ? p.album : k;
          const sub = type === 'songs' || type === 'albums' ? p.artist : '';
          idx[type].set(k, o = { label, sub, n: 0 });
        }
        o.n++;
      }
    }
  }
  // The picker's choices: most played first; songs and albums read "Title — Artist"
  idx.lists = {};
  idx.byText = {};
  for (const type of SX_CMP_TYPES) {
    const all = [...idx[type].entries()].sort((a, b) => type === 'years' ? b[0].localeCompare(a[0]) : b[1].n - a[1].n);
    const top = type === 'songs' || type === 'albums' ? all.slice(0, 4000) : all;
    idx.byText[type] = new Map();
    idx.lists[type] = top.map(([k, o]) => {
      const text = o.sub ? o.label + ' — ' + o.sub : o.label;
      idx.byText[type].set(text.toLowerCase(), k);
      return text;
    });
  }
  return (_sxIdx = idx);
}

function _sxCmpLabel(type, k) {
  const o = _sxIndex()[type].get(k);
  return o ? o.label : k;
}

// Series colours: the eight comparison colours, then lighter, dashed copies
function _sxCmpColor(i) {
  const gc = getGraphColors();
  return i < 8 ? graphColor(i) : mixHex(graphColor(i - 8), gc.text, 0.55);
}

// Your top n of a type for the range (years: the last n with plays)
function _sxCmpTop(type, n) {
  if (type === 'years') return [..._sxIndex().years.keys()].sort().slice(-n).reverse();
  let { fromTs, toTs } = graphRangeTs();
  // Race mode counts over the race's own range (from the first play), so
  // "Fill with my top 10" gives the classic all-time race
  if (sxCmp.mode === 'race') {
    const f = document.getElementById('raceFrom')?.value, to = document.getElementById('raceTo')?.value;
    fromTs = f ? new Date(f + 'T00:00:00').getTime() : -Infinity;
    toTs = to ? new Date(to + 'T23:59:59').getTime() : Infinity;
  }
  const c = new Map();
  for (const p of allPlays) {
    const ts = tzDateOf(p).getTime();
    if (ts < fromTs || ts > toTs) continue;
    for (const k of _sxPlayKeys(type, p)) c.set(k, (c.get(k) || 0) + 1);
  }
  return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(e => e[0]);
}

function _sxCmpPicks() {
  const type = sxCmp.type;
  if (!Array.isArray(sxCmp.picks[type])) sxCmp.picks[type] = _sxCmpTop(type, 3);
  // Drop picks that are no longer in the library (another data source)
  const idx = _sxIndex()[type];
  sxCmp.picks[type] = sxCmp.picks[type].filter(k => idx.has(k)).slice(0, SX_CMP_MAX);
  return sxCmp.picks[type];
}

function _sxCmpPaint() {
  const set = (sel, attr, val) => document.querySelectorAll(sel).forEach(b => {
    const on = b.dataset[attr] === val;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', String(on));
  });
  set('#sxCmpType [data-ctype]', 'ctype', sxCmp.type);
  set('#sxCmpMode [data-cmode]', 'cmode', sxCmp.mode);
  set('#sxCmpRun [data-crun]', 'crun', sxCmp.run);
  // Years have no chart run and no race
  document.querySelectorAll('#sxCmpMode [data-cmode="run"], #sxCmpMode [data-cmode="race"]')
    .forEach(b => { b.disabled = sxCmp.type === 'years'; });
  const runSeg = document.getElementById('sxCmpRun');
  if (runSeg) runSeg.hidden = sxCmp.mode !== 'run';
  const input = document.getElementById('sxCmpInput');
  if (input) input.placeholder = t('sx_cmp_add_' + sxCmp.type);
  const top = document.getElementById('sxCmpTop');
  // Race mode fills ten, so the classic top-10 race is one tap away
  if (top) {
    const n = _sxCmpTopN();
    top.textContent = n === 10 ? t('sx_cmp_fill10') : t('sx_cmp_top').replace('{n}', n);
    top.title = t('sx_cmp_top_tip').replace('{n}', n);
  }
}

function _sxCmpChips(picks) {
  const wrap = document.getElementById('sxCmpChips');
  if (!wrap) return;
  const idx = _sxIndex()[sxCmp.type];
  wrap.innerHTML = picks.map((k, i) => {
    const o = idx.get(k), name = o ? o.label : k;
    const tip = o && o.sub ? name + ' — ' + o.sub : name;
    return `<span class="sx-chip" title="${esc(tip)}"><i style="background:${_sxCmpColor(i)}"></i>${esc(name)}` +
      `<button type="button" onclick="sxCmpRemove(${i})" aria-label="${esc(t('sx_cmp_remove').replace('{name}', name))}">` +
      `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4.5 4.5 7 7M11.5 4.5l-7 7"/></svg></button></span>`;
  }).join('');
  const dl = document.getElementById('sxCmpList');
  if (dl && dl.dataset.type !== sxCmp.type + _sxIndex().gen) {
    dl.dataset.type = sxCmp.type + _sxIndex().gen;
    dl.innerHTML = _sxIndex().lists[sxCmp.type].map(v => `<option value="${esc(v)}">`).join('');
  }
}

function sxCmpRemove(i) {
  _sxCmpPicks().splice(i, 1);
  _sxCmpSave();
  sxRenderCompare();
}

function sxCmpAdd() {
  const input = document.getElementById('sxCmpInput');
  const note = document.getElementById('sxCmpNote');
  const q = (input.value || '').trim();
  if (!q) return;
  const type = sxCmp.type, idx = _sxIndex();
  let k = idx.byText[type].get(q.toLowerCase());
  // Typed a bare title or name: take the most played one that matches
  if (!k) {
    const ql = q.toLowerCase();
    let best = null, bestN = -1;
    idx[type].forEach((o, key) => { if (o.label.toLowerCase() === ql && o.n > bestN) { best = key; bestN = o.n; } });
    k = best;
  }
  if (!k) { if (note) note.textContent = t('sx_cmp_not_found').replace('{q}', q); return; }
  const picks = _sxCmpPicks();
  if (!picks.includes(k)) {
    if (picks.length >= SX_CMP_MAX) { if (note) note.textContent = t('sx_cmp_full').replace('{n}', SX_CMP_MAX); return; }
    picks.push(k);
  }
  input.value = '';
  _sxCmpSave();
  sxRenderCompare();
}

function sxCmpFillTop(n) {
  sxCmp.picks[sxCmp.type] = _sxCmpTop(sxCmp.type, n);
  _sxCmpSave();
  sxRenderCompare();
}

// The verdict row: four tiles, each naming the pick that won it
function _sxVerdictTile(label, name, i, val) {
  if (name == null) return `<div class="sx-verdict-tile"><span>${esc(label)}</span><b>–</b></div>`;
  return `<div class="sx-verdict-tile"><span>${esc(label)}</span><b style="--c:${_sxCmpColor(i)}">${esc(name)}</b>${val ? `<em>${esc(val)}</em>` : ''}</div>`;
}

function sxRenderCompare() {
  const canvas = document.getElementById('sxCmpChart');
  if (!canvas || !allPlays.length) return;
  if (graphCharts.compare) { try { graphCharts.compare.destroy(); } catch (e) { } delete graphCharts.compare; }
  if (sxCmp.type === 'years' && (sxCmp.mode === 'run' || sxCmp.mode === 'race')) sxCmp.mode = 'cum';
  const type = sxCmp.type, picks = _sxCmpPicks();
  _sxCmpPaint();
  _sxCmpChips(picks);
  const note = document.getElementById('sxCmpNote');
  const verdict = document.getElementById('sxCmpVerdict');
  note.textContent = '';
  // Race mode (step 4) draws its own canvas
  if (typeof sxCmpRaceShow === 'function') sxCmpRaceShow(sxCmp.mode === 'race');
  if (sxCmp.mode === 'race') { if (typeof sxCmpRace === 'function') sxCmpRace(picks); verdict.innerHTML = ''; return; }
  if (!picks.length) { note.textContent = t('sx_cmp_empty'); verdict.innerHTML = ''; return; }

  const gc = getGraphColors();
  const pickIdx = new Map(picks.map((k, i) => [k, i]));
  const { fromTs, toTs } = graphRangeTs();
  const names = picks.map(k => _sxCmpLabel(type, k));
  const style = i => ({ borderColor: _sxCmpColor(i), backgroundColor: _sxCmpColor(i), borderDash: i >= 8 ? [5, 4] : undefined });
  let labels, datasets, yOpts = {};

  if (type === 'years') {
    // ── Years: twelve months on one axis, one line or bar set per year ──
    const locale = currentLang === 'en' ? 'en-US' : currentLang;
    labels = Array.from({ length: 12 }, (_, m) => new Date(2001, m, 1).toLocaleDateString(locale, { month: 'short' }));
    const cnt = picks.map(() => new Array(12).fill(0));
    for (const p of allPlays) {
      const d = tzDateOf(p), i = pickIdx.get(String(d.getFullYear()));
      if (i !== undefined) cnt[i][d.getMonth()]++;
    }
    // The months of this year still to come are left empty, not flat
    const now = tzNow();
    datasets = picks.map((k, i) => {
      let run = 0;
      const data = (sxCmp.mode === 'cum' ? cnt[i].map(v => (run += v)) : cnt[i])
        .map((v, m) => +k === now.getFullYear() && m > now.getMonth() ? null : v);
      return { label: names[i], data, ...style(i) };
    });
    note.textContent = t('sx_cmp_years_note');
  } else if (sxCmp.mode === 'run') {
    // ── Chart run: the rank in each period the pick was on the chart ──
    const per = sxCmp.run;
    const full = per === 'day' ? (typeof dyFullRun === 'function' ? dyFullRun() : null) : _crFull(per);
    const table = full && full.result ? full.result[type] : null;
    const pkStart = k => per === 'year' ? new Date(k + '-01-01T00:00:00').getTime() : per === 'month' ? new Date(k + '-01T00:00:00').getTime() : new Date(k + 'T00:00:00').getTime();
    const rankAt = picks.map(k => {
      const m = new Map();
      const e = table && table[k];
      if (e) for (const x of e.entries) { const s = pkStart(x.periodKey); if (s >= fromTs - 6 * _SX_DAY && s <= toTs) m.set(x.periodKey, x.rank); }
      return m;
    });
    const keys = [...new Set(rankAt.flatMap(m => [...m.keys()]))].sort();
    labels = keys.map(k => crPeriodLabel(per, k));
    datasets = picks.map((k, i) => ({ label: names[i], data: keys.map(pk => rankAt[i].get(pk) ?? null), spanGaps: false, pointRadius: keys.length > 60 ? 0 : 3, ...style(i) }));
    yOpts = { reverse: true, min: 1, ticks: { precision: 0, callback: v => '#' + v } };
    if (!keys.length) note.textContent = t('sx_cmp_run_none');
  } else {
    // ── Running total / per period, in the bar's Daily / Monthly / Yearly ──
    const keys = [];
    const seen = new Set();
    const cnt = picks.map(() => new Map());
    for (let j = allPlays.length - 1; j >= 0; j--) {
      const p = allPlays[j], ts = p.date.getTime();
      if (ts < fromTs || ts > toTs) continue;
      const gk = graphKey(p.date);
      if (!seen.has(gk)) { seen.add(gk); keys.push(gk); }
      for (const k of _sxPlayKeys(type, p)) {
        const i = pickIdx.get(k);
        if (i !== undefined) cnt[i].set(gk, (cnt[i].get(gk) || 0) + 1);
      }
    }
    keys.sort();
    labels = keys.map(graphKeyLabel);
    datasets = picks.map((k, i) => {
      let run = 0;
      const data = keys.map(gk => sxCmp.mode === 'cum' ? (run += cnt[i].get(gk) || 0) : (cnt[i].get(gk) || 0));
      return { label: names[i], data, pointRadius: keys.length > 60 ? 0 : 2, ...style(i) };
    });
  }

  const isBar = sxCmp.mode === 'per';
  // Ranks are drawn straight: a curve would dip above #1
  if (!isBar) datasets.forEach(d => { d.tension = sxCmp.mode === 'run' ? 0 : 0.25; d.borderWidth = 2; d.backgroundColor = d.borderColor; d.fill = false; });
  else datasets.forEach(d => { d.borderWidth = 0; d.borderRadius = 3; });
  const axes = graphAxes(gc, { maxTicks: 24 });
  Object.assign(axes.y, yOpts);
  graphCharts.compare = new Chart(canvas, {
    type: isBar ? 'bar' : 'line',
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: { itemSort: (a, b) => sxCmp.mode === 'run' ? a.raw - b.raw : b.raw - a.raw,
          callbacks: { label: c => ` ${c.dataset.label}: ${sxCmp.mode === 'run' ? '#' + c.raw : (c.raw || 0).toLocaleString()}` } },
      },
      scales: axes
    }
  });

  // ── The verdict ──
  verdict.innerHTML = _sxCmpVerdict(type, picks, names);
}

function _sxCmpVerdict(type, picks, names) {
  if (!picks.length) return '';
  const best = arr => { let bi = -1, bv = -Infinity; arr.forEach((v, i) => { if (v != null && v > bv) { bv = v; bi = i; } }); return bi < 0 || bv <= 0 ? null : bi; };
  const fmtN = n => n.toLocaleString();
  const tiles = [];
  if (type === 'years') {
    if (!firstSeenMaps) firstSeenMaps = buildFirstSeenMaps();
    const plays = picks.map(() => 0), arts = picks.map(() => new Set()), news = picks.map(() => 0), months = picks.map(() => new Array(12).fill(0));
    const pi = new Map(picks.map((k, i) => [k, i]));
    for (const p of allPlays) {
      const d = tzDateOf(p), i = pi.get(String(d.getFullYear()));
      if (i === undefined) continue;
      plays[i]++; months[i][d.getMonth()]++;
      for (const a of p.artists) arts[i].add(a);
    }
    for (const [sk, d] of Object.entries(firstSeenMaps.songFirst)) { const i = pi.get(String(d.getFullYear())); if (i !== undefined) news[i]++; }
    let mI = null, mM = 0, mV = 0;
    months.forEach((ms, i) => ms.forEach((v, m) => { if (v > mV) { mV = v; mI = i; mM = m; } }));
    const locale = currentLang === 'en' ? 'en-US' : currentLang;
    const a = best(plays), b = best(arts.map(s => s.size)), c = best(news);
    tiles.push(_sxVerdictTile(t('sx_v_most'), a == null ? null : names[a], a, a == null ? '' : fmtN(plays[a])));
    tiles.push(_sxVerdictTile(t('sx_v_artists'), b == null ? null : names[b], b, b == null ? '' : fmtN(arts[b].size)));
    tiles.push(_sxVerdictTile(t('sx_v_new'), c == null ? null : names[c], c, c == null ? '' : fmtN(news[c])));
    tiles.push(_sxVerdictTile(t('sx_v_month'), mI == null ? null : new Date(+picks[mI], mM, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' }), mI, mI == null ? '' : fmtN(mV)));
    return tiles.join('');
  }
  // Plays in the range and in its last four weeks
  const { fromTs, toTs } = graphRangeTs();
  const recentFrom = Math.max(fromTs, toTs - 28 * _SX_DAY);
  const pi = new Map(picks.map((k, i) => [k, i]));
  const plays = picks.map(() => 0), recent = picks.map(() => 0);
  for (const p of allPlays) {
    const ts = tzDateOf(p).getTime();
    if (ts < fromTs || ts > toTs) continue;
    for (const k of _sxPlayKeys(type, p)) {
      const i = pi.get(k);
      if (i === undefined) continue;
      plays[i]++;
      if (ts >= recentFrom) recent[i]++;
    }
  }
  // Weeks at #1 on the weekly chart, all time
  const wk = _crFull('week').result[type] || {};
  const ones = picks.map(k => (wk[k] ? wk[k].entries.filter(e => e.rank === 1).length : 0));
  // First play ever
  if (!firstSeenMaps) firstSeenMaps = buildFirstSeenMaps();
  const fm = type === 'artists' ? firstSeenMaps.artistFirst : type === 'songs' ? firstSeenMaps.songFirst : firstSeenMaps.albumFirst;
  // Earliest first play wins (best() looks for the biggest number, so not it)
  let d = null;
  picks.forEach((k, i) => { if (fm[k] && (d == null || fm[k] < fm[picks[d]])) d = i; });
  const a = best(plays), b = best(ones), c = best(recent);
  tiles.push(_sxVerdictTile(t('sx_v_most'), a == null ? null : names[a], a, a == null ? '' : fmtN(plays[a])));
  tiles.push(_sxVerdictTile(t('sx_v_ones'), b == null ? null : names[b], b, b == null ? '' : fmtN(ones[b])));
  tiles.push(_sxVerdictTile(t('sx_v_now'), c == null ? null : names[c], c, c == null ? '' : fmtN(recent[c])));
  tiles.push(_sxVerdictTile(t('sx_v_longest'), d == null ? null : names[d], d, d == null ? '' : t('sx_v_since').replace('{y}', fm[picks[d]].getFullYear())));
  return tiles.join('');
}

// The studio's controls
document.getElementById('sxCmpType')?.addEventListener('click', e => {
  const b = e.target.closest('[data-ctype]');
  if (!b || b.dataset.ctype === sxCmp.type) return;
  sxCmp.type = b.dataset.ctype;
  _sxCmpSave();
  sxRenderCompare();
});
document.getElementById('sxCmpMode')?.addEventListener('click', e => {
  const b = e.target.closest('[data-cmode]');
  if (!b || b.disabled || b.dataset.cmode === sxCmp.mode) return;
  sxCmp.mode = b.dataset.cmode;
  _sxCmpSave();
  sxRenderCompare();
});
document.getElementById('sxCmpRun')?.addEventListener('click', e => {
  const b = e.target.closest('[data-crun]');
  if (!b || b.dataset.crun === sxCmp.run) return;
  sxCmp.run = b.dataset.crun;
  _sxCmpSave();
  sxRenderCompare();
});
document.getElementById('sxCmpAddBtn')?.addEventListener('click', sxCmpAdd);
document.getElementById('sxCmpInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); sxCmpAdd(); } });
// Picking from the list adds it straight away
document.getElementById('sxCmpInput')?.addEventListener('change', e => {
  if (_sxIndex().byText[sxCmp.type].has((e.target.value || '').trim().toLowerCase())) sxCmpAdd();
});
document.getElementById('sxCmpTop')?.addEventListener('click', () => sxCmpFillTop(_sxCmpTopN()));
const _sxCmpTopN = () => (sxCmp.mode === 'race' ? 10 : 3);

// ── Race mode (step 4) ────────────────────────────────────────────────────
/* The old Play Count Race, now a Compare mode: it races whatever is picked
   (artists, songs or albums) instead of a fixed top N. "Fill with my top 10"
   brings back the classic race. Its own range still starts at the first
   play. app.js's buildRaceFrames reads sxRaceKeys() to race only the picks. */
function sxRaceKeys() {
  if (sxCmp.mode !== 'race' || sxCmp.type === 'years') return null;
  return new Set(sxCmp.picks[sxCmp.type] || []);
}

function sxCmpRaceShow(on) {
  const box = document.getElementById('sxCmpRaceBox');
  if (box) box.hidden = !on;
  const wrap = document.querySelector('.sx-cmp-canvas');
  if (wrap) wrap.hidden = on;
  const v = document.getElementById('sxCmpVerdict');
  if (v) v.hidden = on;
  // Leaving the race stops it
  if (!on && typeof racePlaying !== 'undefined' && racePlaying) document.getElementById('racePlayBtn')?.click();
}

function sxCmpRace(picks) {
  if (!picks.length) { document.getElementById('sxCmpNote').textContent = t('sx_cmp_empty_race'); }
  raceType = sxCmp.type;
  raceTopN = Math.max(1, picks.length);
  // The race's own range: from the first play to today, until changed
  const rf = document.getElementById('raceFrom');
  if (rf && !rf.value) {
    rf.value = localDateStr(tzDate(allPlays[allPlays.length - 1].date));
    document.getElementById('raceTo').value = localDateStr(tzNow());
  }
  initRace();
}
