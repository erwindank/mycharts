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

// ── Story (steps 5–6) ─────────────────────────────────────────────────────
/* What the range was about, as cards one under the other (sxRenderStory):
     Your obsession   the top artist of each month (weeks for a short range)
     Your eras        stretches where one artist was #1 on the weekly chart
                      week after week
     Taste drift      how your yearly top 10 artists moved, year to year
   Step 6 adds more cards after these. Artist pictures come through
   fetchAndInjectImage, so a picture picked by hand (✎) shows here too. */

// An artist picture slot, filled after the HTML is on the page
let _sxFaceN = 0;
const _sxFaces = [];
function _sxFace(name, cls) {
  const id = 'sx-face-' + (++_sxFaceN);
  _sxFaces.push({ id, name });
  return `<span class="sx-face ${cls || ''}" id="${id}"><span class="thumb-initials">${esc(initials(name))}</span></span>`;
}
function _sxLoadFaces() {
  _sxFaces.splice(0).forEach(f => {
    const el = document.getElementById(f.id);
    if (el) fetchAndInjectImage(el, { imgId: f.id, name: f.name, prefKey: 'artist:' + f.name.toLowerCase() }, 'artist');
  });
}

// The start of the week a date falls in (the week start day from Settings)
function _sxWeekKey(d) {
  const w = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() - weekStartDay + 7) % 7));
  return localDateStr(w);
}

function _sxCard(title, sub, body, extra) {
  return `<section class="dc-card graph-card sx-story-card${extra ? ' ' + extra : ''}">` +
    `<div class="graph-card-title">${esc(title)}</div>${sub ? `<div class="graph-card-sub">${esc(sub)}</div>` : ''}${body}</section>`;
}

function sxRenderStory() {
  const box = document.getElementById('sxStory');
  if (!box || !allPlays.length) return;
  _sxFaces.length = 0;
  const { fromTs, toTs } = graphRangeTs();
  const cards = [_sxObsessionCard(fromTs, toTs), _sxErasCard(fromTs, toTs), _sxDriftCard()];
  if (typeof _sxStoryMore === 'function') cards.push(..._sxStoryMore(fromTs, toTs));
  box.innerHTML = cards.filter(Boolean).join('');
  _sxLoadFaces();
  _sxDriftWire();
}

// ── Your obsession ──
function _sxObsessionCard(fromTs, toTs) {
  const short = toTs - fromTs < 62 * _SX_DAY;
  const per = short ? 'week' : 'month';
  const buckets = new Map();
  for (const p of allPlays) {
    const d = tzDateOf(p), ts = d.getTime();
    if (ts < fromTs || ts > toTs) continue;
    const k = short ? _sxWeekKey(d) : localDateStr(d).slice(0, 7);
    let m = buckets.get(k);
    if (!m) buckets.set(k, m = new Map());
    for (const a of p.artists) m.set(a, (m.get(a) || 0) + 1);
  }
  // At most the last 36 (an All range would be too long a strip)
  const keys = [...buckets.keys()].sort().slice(-36);
  if (!keys.length) return '';
  // The charts' own labels ("Mar 26", "Mar 3, 26"), with translated month names
  const label = k => crPeriodLabel(per, k);
  const tiles = keys.map(k => {
    const top = _sxTop(buckets.get(k)), n = buckets.get(k).get(top);
    const tip = `${label(k)}: ${top} (${n.toLocaleString()})`;
    return `<button type="button" class="sx-obs" title="${esc(tip)}" onclick="navigateToRecPeriod('${per}', ${esc(JSON.stringify(k))})">` +
      `${_sxFace(top)}<span class="sx-obs-when">${esc(label(k))}</span><span class="sx-obs-name">${esc(top)}</span>` +
      `<span class="sx-obs-n">${n.toLocaleString()}</span></button>`;
  }).join('');
  // The artist who topped the most of them
  const wins = new Map();
  keys.forEach(k => { const a = _sxTop(buckets.get(k)); wins.set(a, (wins.get(a) || 0) + 1); });
  const champ = _sxTop(wins);
  const line = t(short ? 'sx_obs_line_w' : 'sx_obs_line_m').replace('{artist}', champ).replace('{n}', wins.get(champ)).replace('{of}', keys.length);
  return _sxCard(t(short ? 'sx_obs_title_w' : 'sx_obs_title_m'), t('sx_obs_sub'),
    `<div class="sx-obs-strip">${tiles}</div><p class="sx-note">${esc(line)}</p>`);
}

// ── Your eras ──
/* Runs of at least three weeks in a row with the same #1 artist on the
   weekly chart (_crFull('week'), the real chart, with its tie rules). */
function _sxErasCard(fromTs, toTs) {
  const run = _crFull('week');
  const ones = new Map();
  const tab = run.result.artists || {};
  for (const a in tab) for (const e of tab[a].entries) if (e.rank === 1 && !ones.has(e.periodKey)) ones.set(e.periodKey, a);
  const weeks = Object.keys(run.periodMap).filter(k => { const s = new Date(k + 'T00:00:00').getTime(); return s >= fromTs - 6 * _SX_DAY && s <= toTs; }).sort();
  if (weeks.length < 3) return '';
  const eras = [];
  let cur = null;
  weeks.forEach((w, i) => {
    const a = ones.get(w) || null;
    if (cur && a === cur.artist) { cur.end = w; cur.n++; }
    else { if (cur) eras.push(cur); cur = { artist: a, start: w, end: w, n: 1, i }; }
  });
  if (cur) eras.push(cur);
  const real = eras.filter(e => e.artist && e.n >= 3);
  if (!real.length) return _sxCard(t('sx_eras_title'), t('sx_eras_sub'), `<p class="sx-note">${esc(t('sx_eras_none'))}</p>`);
  // One colour per era artist, in order of first appearance
  const colorOf = new Map();
  real.forEach(e => { if (!colorOf.has(e.artist)) colorOf.set(e.artist, colorOf.size); });
  const locale = currentLang === 'en' ? 'en-US' : currentLang;
  const day = k => new Date(k + 'T12:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  const band = eras.map(e => {
    const isEra = e.artist && e.n >= 3;
    const w = (e.n / weeks.length * 100).toFixed(3);
    if (!isEra) return `<span class="sx-era-gap" style="width:${w}%"></span>`;
    const tip = `${t('sx_era_name').replace('{artist}', e.artist)} · ${day(e.start)} – ${day(e.end)} · ${t('sx_era_weeks').replace('{n}', e.n)}`;
    return `<span class="sx-era" style="width:${w}%;--c:${_sxCmpColor(colorOf.get(e.artist) % 8)}" title="${esc(tip)}"></span>`;
  }).join('');
  const list = [...real].sort((a, b) => b.n - a.n).slice(0, 6).map(e =>
    `<li><button type="button" class="sx-era-row" onclick="navigateToRecPeriod('week', ${esc(JSON.stringify(e.start))})">` +
    `<i style="background:${_sxCmpColor(colorOf.get(e.artist) % 8)}"></i>${_sxFace(e.artist, 'sx-face-sm')}` +
    `<span class="sx-era-t"><b>${esc(t('sx_era_name').replace('{artist}', e.artist))}</b><span>${esc(day(e.start))} – ${esc(day(e.end))}</span></span>` +
    `<span class="sx-era-n">${esc(t('sx_era_weeks').replace('{n}', e.n))}</span></button></li>`).join('');
  const axis = `<div class="sx-era-axis"><span>${esc(day(weeks[0]))}</span><span>${esc(day(weeks[weeks.length - 1]))}</span></div>`;
  return _sxCard(t('sx_eras_title'), t('sx_eras_sub'), `<div class="sx-era-band">${band}</div>${axis}<ul class="sx-era-list">${list}</ul>`);
}

// ── Taste drift ──
/* A bump chart of your yearly top 10 artists (the yearly chart), the last
   eight years. Always years, whatever the range: drift needs time. The six
   artists with the most top-10 years get colours, the rest are grey; tap a
   line (or a name) to follow one artist. */
function _sxDriftCard() {
  const run = _crFull('year');
  const tab = run.result.artists || {};
  const years = Object.keys(run.periodMap).sort().slice(-8);
  if (years.length < 2) return '';
  const rows = [];
  for (const a in tab) {
    const ranks = years.map(y => { const e = tab[a].entries.find(x => x.periodKey === y); return e && e.rank <= 10 ? e.rank : null; });
    const n = ranks.filter(r => r != null).length;
    if (n) rows.push({ a, ranks, n, best: Math.min(...ranks.filter(r => r != null)) });
  }
  rows.sort((x, y) => y.n - x.n || x.best - y.best);
  // Coloured: this year's top 3 first, then the most top-10 years
  const lastI = years.length - 1;
  const lead = rows.filter(r => r.ranks[lastI] != null && r.ranks[lastI] <= 3).sort((x, y) => x.ranks[lastI] - y.ranks[lastI]).map(r => r.a);
  for (const r of rows) { if (lead.length >= 6) break; if (!lead.includes(r.a)) lead.push(r.a); }
  const W = 900, H = 330, L = 40, R = 760, T = 30, B = 312;
  const x = i => L + i * (R - L) / (years.length - 1), y = r => T + (r - 1) * (B - T) / 9;
  let svg = `<svg class="sx-drift" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('sx_drift_title'))}">`;
  years.forEach((yr, i) => { svg += `<text class="sx-drift-yr" x="${x(i)}" y="14">${yr}</text>`; });
  for (let r = 1; r <= 10; r++) svg += `<text class="sx-drift-rk" x="${L - 16}" y="${y(r) + 4}">#${r}</text>`;
  const line = (row, color, lead) => {
    let d = '', dots = '';
    row.ranks.forEach((r, i) => {
      if (r == null) return;
      d += (row.ranks[i - 1] == null ? 'M' : 'L') + x(i) + ',' + y(r);
      dots += `<circle cx="${x(i)}" cy="${y(r)}" r="${lead ? 5 : 2.5}"/>`;
    });
    const last = row.ranks.length - 1;
    const tag = row.ranks[last] != null ? `<text class="sx-drift-name" x="${R + 14}" y="${y(row.ranks[last]) + 4}">${esc(row.a)}</text>` : '';
    return `<g class="sx-drift-line${lead ? ' is-lead' : ''}" data-a="${esc(row.a)}" style="--c:${color}" tabindex="0" role="button" aria-label="${esc(row.a)}">` +
      `<title>${esc(row.a)}</title><path d="${d}"/>${dots}${tag}</g>`;
  };
  rows.filter(r => !lead.includes(r.a)).forEach(r => { svg += line(r, 'var(--border2)', false); });
  lead.forEach((a, i) => { svg += line(rows.find(r => r.a === a), _sxCmpColor(i), true); });
  svg += '</svg>';
  const legend = lead.map((a, i) => `<button type="button" class="sx-chip sx-drift-key" data-a="${esc(a)}"><i style="background:${_sxCmpColor(i)}"></i>${esc(a)}</button>`).join('');
  return _sxCard(t('sx_drift_title'), t('sx_drift_sub').replace('{a}', years[0]).replace('{b}', years[years.length - 1]),
    `<div class="sx-drift-wrap">${svg}</div><div class="sx-chips sx-drift-keys">${legend}</div>`, 'sx-drift-card');
}

// Tap a line or a name: that artist stands out, the rest fade; tap again to clear
function _sxDriftWire() {
  const card = document.querySelector('#sxStory .sx-drift-card');
  if (!card) return;
  const pick = a => {
    const on = card.dataset.pick === a ? '' : a;
    card.dataset.pick = on;
    card.classList.toggle('has-pick', !!on);
    card.querySelectorAll('[data-a]').forEach(g => g.classList.toggle('is-picked', g.dataset.a === on));
  };
  card.addEventListener('click', e => { const g = e.target.closest('[data-a]'); if (g) pick(g.dataset.a); });
  card.addEventListener('keydown', e => {
    const g = e.target.closest && e.target.closest('g[data-a]');
    if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(g.dataset.a); }
  });
}

// ── Story, part 2 (step 6) ────────────────────────────────────────────────
/* More cards after taste drift, for the range in the bar:
     Loyal or adventurous?   the share of plays that went to the top 10
     Comfort vs new finds    plays of songs known before the range, against
                             songs first heard in it
     Discoveries             the biggest new artists, and how they are doing
     To put it another way   the plays turned into everyday numbers (no
                             hours: the data has no song lengths)
     Milestones              round numbers passed in the range */

// Small drawn icons for "To put it another way" (no emoji, phase 11)
const _SX_ICO = {
  day: '<path d="M3 5.5h10v8H3z"/><path d="M3 8h10M6 3.5v3M10 3.5v3"/>',
  loop: '<path d="M4 6.5h7.5l-2-2M12 9.5H4.5l2 2"/>',
  step: '<path d="M5.5 3.2c1.2 0 1.8 1.4 1.6 3s-1 2.3-1.9 2.3-1.4-1-1.3-2.4 .4-2.9 1.6-2.9zM4.4 10.2l2.5.3-.3 2.3-2.4-.3zM10.5 5.2c1.2 0 1.6 1.4 1.4 3s-1 2.3-1.9 2.2-1.4-1.1-1.2-2.5.5-2.7 1.7-2.7zM9.4 12.2l2.5.2-.2 2.2-2.5-.2z"/>',
};
const _sxIco = k => `<svg class="sx-ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false">${_SX_ICO[k]}</svg>`;

function _sxStoryMore(fromTs, toTs) {
  if (!firstSeenMaps) firstSeenMaps = buildFirstSeenMaps();
  const { songFirst, artistFirst } = firstSeenMaps;
  const span = toTs - fromTs + 1;
  const firstPlayTs = Math.min(...Object.values(artistFirst).map(d => d.getTime()));
  const hasPrev = graphRange.preset !== 'all' && fromTs - span >= firstPlayTs - _SX_DAY;

  // One pass over the range (and the stretch before it, for loyalty)
  const art = new Map(), prevArt = new Map(), songs = new Map(), lastPlay = new Map();
  let plays = 0, prevPlays = 0, oldPlays = 0;
  const recentFrom = toTs - 28 * _SX_DAY;
  const recent = new Map();
  for (const p of allPlays) {
    const ts = tzDateOf(p).getTime();
    if (ts >= fromTs && ts <= toTs) {
      plays++;
      for (const a of p.artists) {
        art.set(a, (art.get(a) || 0) + 1);
        if (ts >= recentFrom) recent.set(a, (recent.get(a) || 0) + 1);
        if (!lastPlay.has(a) || lastPlay.get(a) < ts) lastPlay.set(a, ts);
      }
      const sk = songKey(p);
      let o = songs.get(sk);
      if (!o) songs.set(sk, o = { n: 0, p });
      o.n++;
      if (songFirst[sk] && songFirst[sk].getTime() < fromTs) oldPlays++;
    } else if (hasPrev && ts >= fromTs - span && ts < fromTs) {
      prevPlays++;
      for (const a of p.artists) prevArt.set(a, (prevArt.get(a) || 0) + 1);
    }
  }
  if (!plays) return [];
  const cards = [];

  // ── Loyal or adventurous? ──
  // Artist plays are counted per credited artist, so the share is taken
  // of all artist credits, not of plays (a duet counts for both).
  const share = (m) => {
    const v = [...m.values()].sort((a, b) => b - a), all = v.reduce((a, b) => a + b, 0);
    return all ? v.slice(0, 10).reduce((a, b) => a + b, 0) / all : 0;
  };
  const pct = Math.round(share(art) * 100);
  const credits = [...art.values()].sort((a, b) => b - a), allCredits = credits.reduce((a, b) => a + b, 0);
  let half = 0, run = 0;
  for (const v of credits) { half++; run += v; if (run >= allCredits / 2) break; }
  let loyalNote = '';
  if (hasPrev && prevPlays) {
    const pp = Math.round(share(prevArt) * 100);
    if (pp !== pct) loyalNote = t(pct > pp ? 'sx_loyal_more' : 'sx_loyal_less').replace('{pct}', pp);
  }
  // The meter: 0% (every play a different artist) to 100% (only ten artists)
  const loyal = _sxCard(t('sx_loyal_title'), t('sx_loyal_sub'),
    `<div class="sx-big">${esc(t('sx_loyal_big').replace('{pct}', pct))}</div>` +
    `<div class="sx-meter" role="img" aria-label="${pct}%"><i style="left:${pct}%"></i></div>` +
    `<div class="sx-meter-ends"><span>${esc(t('sx_loyal_adv'))}</span><span>${esc(t('sx_loyal_loyal'))}</span></div>` +
    `<p class="sx-note">${esc(t('sx_loyal_half').replace('{n}', half.toLocaleString()))}${loyalNote ? ' ' + esc(loyalNote) : ''}</p>`);

  // ── Comfort songs vs new finds ──
  const oldPct = Math.round(oldPlays / plays * 100), newPct = 100 - oldPct;
  let topOld = null, topNew = null;
  songs.forEach((o, sk) => {
    const isOld = songFirst[sk] && songFirst[sk].getTime() < fromTs;
    if (isOld) { if (!topOld || o.n > topOld.o.n) topOld = { sk, o }; }
    else if (!topNew || o.n > topNew.o.n) topNew = { sk, o };
  });
  const locale = currentLang === 'en' ? 'en-US' : currentLang;
  const when = d => d.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
  const songRow = (x, label) => x
    ? `<li><button type="button" class="sx-row sx-row-plain" onclick="openSongModal(${esc(JSON.stringify(x.sk))})">` +
      `<span class="sx-row-t"><b>${esc(x.o.p.title)} · ${esc(x.o.p.artist)}</b><span>${esc(label)}</span></span><span class="sx-row-v">${x.o.n.toLocaleString()}</span></button></li>`
    : '';
  const split = `<div class="sx-split" role="img" aria-label="${oldPct}% / ${newPct}%">` +
    (oldPct ? `<span class="is-old" style="width:${oldPct}%">${oldPct}% ${esc(t('sx_comfort_old'))}</span>` : '') +
    (newPct ? `<span class="is-new" style="width:${newPct}%">${newPct}% ${esc(t('sx_comfort_new'))}</span>` : '') + '</div>';
  const comfort = _sxCard(t('sx_comfort_title'), t('sx_comfort_sub'), split +
    `<ul class="sx-rows">${songRow(topOld, topOld ? t('sx_comfort_top_old').replace('{y}', songFirst[topOld.sk].getFullYear()) : '')}` +
    `${songRow(topNew, topNew ? t('sx_comfort_top_new').replace('{d}', when(songFirst[topNew.sk])) : '')}</ul>`);
  cards.push(`<div class="sx-row2">${loyal}${comfort}</div>`);

  // ── Discoveries, and where they are now ──
  // New artists of the range by plays in it; "now" is the last four weeks
  // of the range against their usual four weeks since they were found.
  const finds = [...art.entries()].filter(([a]) => artistFirst[a] && artistFirst[a].getTime() >= fromTs)
    .sort((x, y) => y[1] - x[1]).slice(0, 5);
  const wk = _crFull('week').result.artists || {};
  let discBody;
  if (!finds.length) discBody = `<p class="sx-note">${esc(t('sx_disc_none'))}</p>`;
  else discBody = '<ul class="sx-rows">' + finds.map(([a, n]) => {
    const since = artistFirst[a].getTime();
    const weeks4 = Math.max(1, (toTs - since) / (28 * _SX_DAY));
    const usual = n / weeks4, now = recent.get(a) || 0;
    const status = now === 0 ? 'gone' : now >= usual * 0.6 ? 'hot' : 'cool';
    const peak = wk[a] ? Math.min(...wk[a].entries.filter(e => new Date(e.periodKey + 'T00:00:00').getTime() >= fromTs - 6 * _SX_DAY).map(e => e.rank).concat([Infinity])) : Infinity;
    const sub = t('sx_disc_found').replace('{d}', when(artistFirst[a])) + (peak < Infinity ? ' · ' + t('sx_disc_peak').replace('{r}', peak) : '');
    return `<li><button type="button" class="sx-row sx-row-face" onclick="openArtistModal(${esc(JSON.stringify(a))})">${_sxFace(a, 'sx-face-sm')}` +
      `<span class="sx-row-t"><b>${esc(a)}</b><span>${esc(sub)}</span></span>` +
      `<span class="sx-disc-st is-${status}">${esc(t('sx_disc_' + status))}</span></button></li>`;
  }).join('') + '</ul>';
  const disc = _sxCard(t('sx_disc_title'), t('sx_disc_sub'), discBody);

  // ── To put it another way ──
  const days = Math.max(1, Math.round(span / _SX_DAY));
  let top = null;
  songs.forEach((o, sk) => { if (!top || o.n > top.o.n) top = { sk, o }; });
  const every = (days / top.o.n);
  const km = Math.round(plays * 0.75 / 1000);
  const fun = (ico, big, sub) => `<div class="sx-fun-row">${_sxIco(ico)}<div><b>${esc(big)}</b><span>${esc(sub)}</span></div></div>`;
  const funCard = _sxCard(t('sx_fun_title'), '',
    `<div class="sx-fun">` +
    fun('day', t('sx_fun_day').replace('{n}', Math.round(plays / days).toLocaleString()), t('sx_fun_day_sub')) +
    fun('loop', t('sx_fun_song').replace('{n}', top.o.n.toLocaleString()).replace('{song}', top.o.p.title),
      t(every < 1 ? 'sx_fun_song_sub_day' : 'sx_fun_song_sub').replace('{d}', every < 1 ? (1 / every).toFixed(1) : every.toFixed(1))) +
    fun('step', t('sx_fun_walk').replace('{km}', km.toLocaleString()), t('sx_fun_walk_sub')) +
    `</div>`);
  cards.push(`<div class="sx-row2">${disc}${funCard}</div>`);

  // ── Milestones in this stretch ──
  cards.push(_sxMilestonesCard(fromTs, toTs));
  return cards;
}

/* Round numbers passed inside the range: the library's total plays, how
   many different songs and artists, and artists reaching big play counts.
   Needs the whole history, oldest first, to count up to the range. */
function _sxMilestonesCard(fromTs, toTs) {
  const out = [];
  let total = 0;
  const seenSong = new Set(), seenArtist = new Set(), artN = new Map();
  const ART_STEPS = [1000, 2500, 5000, 10000, 15000, 20000, 25000, 50000, 100000];
  for (let i = allPlays.length - 1; i >= 0; i--) {
    const p = allPlays[i], ts = tzDateOf(p).getTime();
    if (ts > toTs) break;
    const inRange = ts >= fromTs;
    total++;
    const step = total >= 100000 ? 50000 : total >= 10000 ? 10000 : 1000;
    if (inRange && total % step === 0) out.push({ ts, k: 'plays', n: total, p, w: 3 });
    const sk = songKey(p);
    if (!seenSong.has(sk)) {
      seenSong.add(sk);
      const s = seenSong.size, st = s >= 10000 ? 5000 : 1000;
      if (inRange && s % st === 0) out.push({ ts, k: 'songs', n: s, p, w: 2 });
    }
    for (const a of p.artists) {
      if (!seenArtist.has(a)) {
        seenArtist.add(a);
        const s = seenArtist.size, st = s >= 1000 ? 500 : 100;
        if (inRange && s % st === 0) out.push({ ts, k: 'artists', n: s, p, a, w: 2 });
      }
      const c = (artN.get(a) || 0) + 1;
      artN.set(a, c);
      if (inRange && ART_STEPS.includes(c)) out.push({ ts, k: 'artist', n: c, a, p, w: c >= 10000 ? 3 : 1 });
    }
  }
  if (!out.length) return _sxCard(t('sx_miles_title'), t('sx_miles_sub'), `<p class="sx-note">${esc(t('sx_miles_none'))}</p>`);
  // The twelve biggest, shown in date order
  const pick = out.map((m, i) => ({ ...m, i })).sort((a, b) => b.w - a.w || b.n - a.n).slice(0, 12).sort((a, b) => a.ts - b.ts);
  const locale = currentLang === 'en' ? 'en-US' : currentLang;
  const items = pick.map(m => {
    const date = new Date(m.ts).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
    const title = m.k === 'plays' ? t('sx_mile_plays').replace('{n}', m.n.toLocaleString())
      : m.k === 'songs' ? t('sx_mile_songs').replace('{n}', m.n.toLocaleString())
      : m.k === 'artists' ? t('sx_mile_artists').replace('{n}', m.n.toLocaleString())
      : t('sx_mile_artist').replace('{artist}', m.a).replace('{n}', m.n.toLocaleString());
    const what = m.k === 'artists' ? m.a : m.p.title + ' · ' + m.p.artist;
    return `<li><b>${esc(title)}</b><span>${esc(date)} · ${esc(what)}</span></li>`;
  }).join('');
  return _sxCard(t('sx_miles_title'), t('sx_miles_sub'), `<ol class="sx-miles">${items}</ol>`);
}

// ── Games (steps 7–8) ─────────────────────────────────────────────────────
/* Quizzes on your own library, played full screen like the awards
   ceremony. They use the whole history, not the range. Best scores stay on
   this device (dc_sxGameBest); at the end a score can be shared as a
   picture. Each game is { title, desc, icon, unit, start() } and draws its
   rounds into the stage with _sxStage(). */
const SX_GAMES = {};
let _sxGameBest = (() => { try { return JSON.parse(localStorage.getItem('dc_sxGameBest') || '{}') || {}; } catch (e) { return {}; } })();
let _sxGame = null;      // the game on screen: { id, score, round, ... }
let _sxGameFocus = null; // the button that opened it, focused again on close

// Drawn icons for the game cards (no emoji)
const _SX_GAME_ICO = {
  hl: '<path d="M8 3v10M4.5 6.5 8 3l3.5 3.5"/><path d="M8 13l-2-2M8 13l2-2" opacity=".55"/>',
  year: '<rect x="2.5" y="3.5" width="11" height="10" rx="1.5"/><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3"/><path d="M6 10h4"/>',
  first: '<circle cx="8" cy="8.5" r="5"/><path d="M8 5.5v3l2 1.5M6.5 1.5h3"/>',
  one: '<path d="M3 12.5h10M4 12.5 3 5l3 2.5L8 3l2 4.5L13 5l-1 7.5"/>',
};
const _sxGameIco = id => `<svg class="sx-ico sx-game-ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false">${_SX_GAME_ICO[id]}</svg>`;

function sxRenderGames() {
  const box = document.getElementById('sxGames');
  if (!box) return;
  const ready = Object.keys(SX_GAMES);
  box.innerHTML = `<p class="sx-games-intro">${esc(t('sx_games_intro'))}</p><div class="sx-games-grid">` +
    ['hl', 'year', 'first', 'one'].map(id => {
      const g = SX_GAMES[id], best = _sxGameBest[id];
      const bestTxt = best != null ? t('sx_game_best').replace('{n}', best.toLocaleString()) : t('sx_game_new');
      const on = ready.includes(id);
      return `<section class="dc-card sx-game-card">${_sxGameIco(id)}<h3>${esc(t('sx_game_' + id))}</h3>` +
        `<p>${esc(t('sx_game_' + id + '_desc'))}</p><span class="sx-game-best">${esc(on ? bestTxt : t('sx_game_soon'))}</span>` +
        `<button type="button" class="dc-btn dc-btn-main dc-btn-sm" ${on ? `onclick="sxGameOpen('${id}', this)"` : 'disabled'}>${esc(t('sx_game_play'))}</button></section>`;
    }).join('') + '</div>';
}

// ── The full-screen stage ──
function sxGameOpen(id, opener) {
  const g = SX_GAMES[id];
  if (!g || !allPlays.length) return;
  let el = document.getElementById('sxGameLayer');
  // Play again keeps the button that first opened the game
  if (!el) _sxGameFocus = opener || document.activeElement;
  if (!el) {
    el = document.createElement('div');
    el.id = 'sxGameLayer';
    el.className = 'sx-game';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'sxGameTitle');
    document.body.appendChild(el);
    el.addEventListener('keydown', _sxGameKeys);
  }
  el.innerHTML = `<div class="sx-game-top"><div class="sx-game-head">${_sxGameIco(id)}<div><h2 id="sxGameTitle">${esc(t('sx_game_' + id))}</h2>` +
    `<span id="sxGameScore" class="sx-game-score"></span></div></div>` +
    `<button type="button" class="dc-btn dc-btn-plain dc-btn-icon sx-game-close" onclick="sxGameClose()" aria-label="${esc(t('sx_drill_close'))}" title="${esc(t('sx_drill_close'))}">` +
    `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4 4 8 8M12 4l-8 8"/></svg></button></div>` +
    `<div id="sxGameStage" class="sx-game-stage" aria-live="polite"></div>`;
  document.documentElement.classList.add('sx-game-open');
  requestAnimationFrame(() => el.classList.add('is-in'));
  _sxGame = { id, score: 0, round: 0 };
  g.start();
}

function sxGameClose() {
  const el = document.getElementById('sxGameLayer');
  const id = _sxGame && _sxGame.id;
  if (_sxGame && _sxGame.timer) clearTimeout(_sxGame.timer);
  _sxGame = null;
  if (el) el.remove();
  document.documentElement.classList.remove('sx-game-open');
  // The cards are drawn again (new best), so focus goes to the same game's
  // new Play button rather than the old one
  sxRenderGames();
  const again = id ? document.querySelector(`#sxGames [onclick^="sxGameOpen('${id}'"]`) : null;
  try { (again || (document.contains(_sxGameFocus) ? _sxGameFocus : null))?.focus(); } catch (e) { }
}

// Esc closes; Tab stays inside the stage; each game can add its own keys
function _sxGameKeys(e) {
  if (e.key === 'Escape') { e.preventDefault(); sxGameClose(); return; }
  if (e.key === 'Tab') {
    const f = [...document.querySelectorAll('#sxGameLayer button:not([disabled]), #sxGameLayer input')].filter(x => x.offsetParent);
    if (!f.length) return;
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    return;
  }
  const g = _sxGame && SX_GAMES[_sxGame.id];
  if (g && g.key) g.key(e);
}

function _sxStage(html, focusSel) {
  const st = document.getElementById('sxGameStage');
  if (!st) return null;
  st.innerHTML = html;
  const f = focusSel && st.querySelector(focusSel);
  if (f) f.focus({ preventScroll: true });
  return st;
}

function _sxScoreLine(txt) {
  const el = document.getElementById('sxGameScore');
  if (el) el.textContent = txt;
}

// Pictures for the songs on the stage (picked pictures win)
function _sxSongArt(el, s) {
  if (el) fetchAndInjectImage(el, { imgId: el.id, title: s.title, name: s.title, artist: s.artist, prefKey: 'song:' + s.artist.toLowerCase() + '|||' + s.title.toLowerCase() }, 'song');
}

/* The end of a game: the score, a new best when it is one, and Play again /
   Share score / Back to games. better(a, b) says if a beats b. */
function _sxGameOver(score, scoreTxt, extraHtml) {
  const id = _sxGame.id, old = _sxGameBest[id];
  const isBest = old == null || score > old;
  if (isBest) { _sxGameBest[id] = score; try { localStorage.setItem('dc_sxGameBest', JSON.stringify(_sxGameBest)); } catch (e) { } }
  _sxGame.done = { score, scoreTxt };
  _sxStage(`<div class="sx-game-over">` +
    `<span class="sx-game-over-k">${esc(t('sx_game_over'))}</span>` +
    `<div class="sx-game-over-n">${esc(scoreTxt)}</div>` +
    (isBest && old != null ? `<div class="sx-game-newbest">${esc(t('sx_game_newbest'))}</div>`
      : `<div class="sx-game-over-best">${esc(t('sx_game_best').replace('{n}', (_sxGameBest[id]).toLocaleString()))}</div>`) +
    (extraHtml || '') +
    `<div class="sx-game-over-btns"><button type="button" class="dc-btn dc-btn-main" onclick="sxGameOpen('${id}')">${esc(t('sx_game_again'))}</button>` +
    `<button type="button" class="dc-btn dc-btn-normal" onclick="sxGameShare(this)">${esc(t('sx_game_share'))}</button>` +
    `<button type="button" class="dc-btn dc-btn-plain" onclick="sxGameClose()">${esc(t('sx_game_back'))}</button></div></div>`, '.dc-btn-main');
}

/* A square score card drawn on a canvas, in the theme's colours, then
   handed to the phone's share sheet or downloaded. */
async function sxGameShare(btn) {
  if (!_sxGame || !_sxGame.done) return;
  const id = _sxGame.id, { scoreTxt } = _sxGame.done;
  const gc = getGraphColors(), S = 1080;
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, S, S);
  g.addColorStop(0, mixHex(gc.accent, gc.bg, 0.28)); g.addColorStop(0.55, gc.bg); g.addColorStop(1, gc.bg);
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  try { await document.fonts.load('800 120px "Bricolage Grotesque"'); } catch (e) { }
  x.textAlign = 'center';
  x.fillStyle = gc.accent; x.font = '600 40px "IBM Plex Sans", sans-serif';
  x.fillText(t('sx_game_' + id).toUpperCase(), S / 2, 300);
  x.fillStyle = gc.text; x.font = '800 150px "Bricolage Grotesque", sans-serif';
  // Long score lines ("7 / 10") shrink to fit
  let size = 150;
  while (x.measureText(scoreTxt).width > S - 140 && size > 60) { size -= 10; x.font = `800 ${size}px "Bricolage Grotesque", sans-serif`; }
  x.fillText(scoreTxt, S / 2, 520);
  x.fillStyle = gc.text3; x.font = '400 38px "IBM Plex Sans", sans-serif';
  x.fillText(t('sx_game_share_line'), S / 2, 620);
  x.fillStyle = gc.text; x.font = '700 46px "Bricolage Grotesque", sans-serif';
  x.fillText('dankcharts.fm', S / 2, S - 110);
  const blob = await new Promise(r => c.toBlob(r, 'image/png'));
  if (!blob) return;
  const name = 'dankcharts-' + id + '.png';
  const file = new File([blob], name, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file] }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.download = name; a.href = URL.createObjectURL(blob); a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  if (btn) { const o = btn.textContent; btn.textContent = '✓ ' + t('sx_game_saved'); setTimeout(() => { btn.textContent = o; }, 2000); }
}

/* Songs for the games: every song with 3+ plays, most played first, with
   its first play. Rebuilt when the plays change. */
let _sxPool = null;
function _sxSongPool() {
  const gen = _sxIndex().gen;
  if (_sxPool && _sxPool.gen === gen) return _sxPool.list;
  if (!firstSeenMaps) firstSeenMaps = buildFirstSeenMaps();
  const list = [];
  _sxIndex().songs.forEach((o, sk) => { if (o.n >= 3) list.push({ sk, title: o.label, artist: o.sub, n: o.n, first: firstSeenMaps.songFirst[sk] }); });
  list.sort((a, b) => b.n - a.n);
  _sxPool = { gen, list };
  return list;
}
const _sxRand = n => Math.floor(Math.random() * n);

// A song card on the stage: picture, title, artist and a line under it
let _sxArtN = 0;
function _sxSongCard(s, valHtml, cls) {
  const id = 'sx-gart-' + (++_sxArtN);
  return { id, html: `<div class="sx-gsong ${cls || ''}"><span class="sx-gart" id="${id}"><span class="thumb-initials">${esc(initials(s.title))}</span></span>` +
    `<span class="sx-gtxt"><b>${esc(s.title)}</b><span>${esc(s.artist)}</span></span><div class="sx-gval">${valHtml}</div></div>` };
}

// ── Higher or lower ──
/* Which song has more plays? The left one shows its count; say if the right
   one is higher or lower. Keep going until a wrong answer. Pairs come from
   the top 600 songs and are kept close (no more than 3x apart), with
   different counts. Keys: ↑ higher, ↓ lower. */
SX_GAMES.hl = {
  start() {
    const pool = _sxSongPool().slice(0, 600);
    if (pool.length < 10) { _sxStage(`<p class="sx-note">${esc(t('sx_game_small'))}</p>`); return; }
    _sxGame.pool = pool;
    _sxGame.left = pool[_sxRand(pool.length)];
    this.round();
  },
  pickRight(left) {
    const pool = _sxGame.pool;
    for (let i = 0; i < 200; i++) {
      const s = pool[_sxRand(pool.length)];
      if (s.sk !== left.sk && s.n !== left.n && s.n <= left.n * 3 && s.n * 3 >= left.n) return s;
    }
    return pool.find(s => s.sk !== left.sk && s.n !== left.n);
  },
  round() {
    const G = _sxGame, L = G.left, R = G.right = this.pickRight(L);
    G.locked = false;
    _sxScoreLine(t('sx_hl_streak').replace('{n}', G.score) + ' · ' + t('sx_game_best').replace('{n}', Math.max(G.score, _sxGameBest.hl || 0).toLocaleString()));
    const a = _sxSongCard(L, `<em>${L.n.toLocaleString()}</em> ${esc(t('sx_plays'))}`);
    const b = _sxSongCard(R, `<em id="sxHlAns">?</em>` +
      `<div class="sx-hl-btns"><button type="button" class="dc-btn dc-btn-main" data-hl="hi">▲ ${esc(t('sx_hl_higher'))}</button>` +
      `<button type="button" class="dc-btn dc-btn-normal" data-hl="lo">▼ ${esc(t('sx_hl_lower'))}</button></div>`);
    const st = _sxStage(`<p class="sx-game-q">${esc(t('sx_hl_q').replace('{song}', R.title))}</p>` +
      `<div class="sx-hl">${a.html}<span class="sx-vs">${esc(t('sx_vs_short'))}</span>${b.html}</div><p id="sxHlRes" class="sx-game-res"></p>`, '[data-hl="hi"]');
    if (!st) return;
    _sxSongArt(document.getElementById(a.id), L);
    _sxSongArt(document.getElementById(b.id), R);
    st.querySelectorAll('[data-hl]').forEach(btn => btn.addEventListener('click', () => this.answer(btn.dataset.hl)));
  },
  key(e) {
    if (e.key === 'ArrowUp') { e.preventDefault(); this.answer('hi'); }
    if (e.key === 'ArrowDown') { e.preventDefault(); this.answer('lo'); }
  },
  answer(dir) {
    const G = _sxGame;
    if (!G || G.locked || !G.right) return;
    G.locked = true;
    const L = G.left, R = G.right, right = dir === 'hi' ? R.n > L.n : R.n < L.n;
    document.querySelectorAll('#sxGameStage [data-hl]').forEach(b => { b.disabled = true; });
    const ans = document.getElementById('sxHlAns');
    if (ans) { ans.textContent = R.n.toLocaleString(); ans.classList.add(right ? 'is-right' : 'is-wrong'); }
    const res = document.getElementById('sxHlRes');
    if (right) {
      G.score++;
      if (res) res.innerHTML = `<span class="sx-right">${esc(t('sx_game_right'))}</span>`;
      _sxScoreLine(t('sx_hl_streak').replace('{n}', G.score) + ' · ' + t('sx_game_best').replace('{n}', Math.max(G.score, _sxGameBest.hl || 0).toLocaleString()));
      // The right song moves to the left for the next pair
      G.timer = setTimeout(() => { if (_sxGame === G) { G.left = R; this.round(); } }, 1300);
    } else {
      if (res) res.innerHTML = `<span class="sx-wrong">${esc(t(R.n > L.n ? 'sx_hl_was_more' : 'sx_hl_was_less').replace('{song}', R.title))}</span>`;
      G.timer = setTimeout(() => { if (_sxGame === G) _sxGameOver(G.score, t('sx_hl_final').replace('{n}', G.score)); }, 1600);
    }
  },
};

// ── Guess the year (step 8) ──
/* Ten songs; for each, tap the year you first played it. Spot on is 100
   points, a year off 50, two years off 20, so the most is 1,000. Songs are
   drawn year by year, so every year of the library turns up. Keys: the
   year buttons are ordinary buttons (Tab / Enter). */
SX_GAMES.year = {
  start() {
    const pool = _sxSongPool().slice(0, 2000).filter(s => s.first);
    const byYear = new Map();
    pool.forEach(s => { const y = s.first.getFullYear(); if (!byYear.has(y)) byYear.set(y, []); byYear.get(y).push(s); });
    const years = [...byYear.keys()].sort();
    if (years.length < 2) { _sxStage(`<p class="sx-note">${esc(t('sx_game_small'))}</p>`); return; }
    _sxGame.years = years;
    _sxGame.byYear = byYear;
    _sxGame.seen = new Set();
    this.round();
  },
  round() {
    const G = _sxGame;
    G.round++;
    G.locked = false;
    // A random year, then a random song from it not asked yet
    let s = null;
    for (let i = 0; i < 50 && !s; i++) {
      const list = G.byYear.get(G.years[_sxRand(G.years.length)]);
      const c = list[_sxRand(list.length)];
      if (!G.seen.has(c.sk)) s = c;
    }
    G.song = s;
    G.seen.add(s.sk);
    _sxScoreLine(t('sx_round').replace('{n}', G.round).replace('{of}', 10) + ' · ' + t('sx_points').replace('{n}', G.score.toLocaleString()));
    const card = _sxSongCard(s, `<em class="sx-gsmall">${s.n.toLocaleString()} ${esc(t('sx_plays'))}</em>`);
    const btns = G.years.map(y => `<button type="button" class="dc-btn dc-btn-normal sx-year-btn" data-y="${y}">${y}</button>`).join('');
    const st = _sxStage(`<p class="sx-game-q">${esc(t('sx_year_q'))}</p>${card.html}<div class="sx-year-btns">${btns}</div><p id="sxGameRes" class="sx-game-res"></p>`, '.sx-year-btn');
    _sxSongArt(document.getElementById(card.id), s);
    st.querySelectorAll('[data-y]').forEach(b => b.addEventListener('click', () => this.answer(+b.dataset.y)));
  },
  answer(y) {
    const G = _sxGame;
    if (!G || G.locked) return;
    G.locked = true;
    const real = G.song.first.getFullYear(), off = Math.abs(y - real);
    const pts = off === 0 ? 100 : off === 1 ? 50 : off === 2 ? 20 : 0;
    G.score += pts;
    document.querySelectorAll('#sxGameStage [data-y]').forEach(b => {
      b.disabled = true;
      if (+b.dataset.y === real) b.classList.add('is-right');
      else if (+b.dataset.y === y) b.classList.add('is-wrong');
    });
    const locale = currentLang === 'en' ? 'en-US' : currentLang;
    const date = G.song.first.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    const res = document.getElementById('sxGameRes');
    if (res) res.innerHTML = `<span class="${pts ? 'sx-right' : 'sx-wrong'}">${esc(t(pts === 100 ? 'sx_year_exact' : pts ? 'sx_year_close' : 'sx_year_miss').replace('{pts}', pts).replace('{date}', date))}</span>`;
    _sxScoreLine(t('sx_round').replace('{n}', G.round).replace('{of}', 10) + ' · ' + t('sx_points').replace('{n}', G.score.toLocaleString()));
    G.timer = setTimeout(() => {
      if (_sxGame !== G) return;
      if (G.round >= 10) _sxGameOver(G.score, t('sx_points').replace('{n}', G.score.toLocaleString()));
      else this.round();
    }, 1900);
  },
};

// ── Which came first? (step 8) ──
/* Two songs: tap the one you played first. Their first plays are at least
   30 days apart. Keep going until a wrong answer. Keys: ← / →. */
SX_GAMES.first = {
  start() {
    const pool = _sxSongPool().slice(0, 1500).filter(s => s.first);
    if (pool.length < 10) { _sxStage(`<p class="sx-note">${esc(t('sx_game_small'))}</p>`); return; }
    _sxGame.pool = pool;
    this.round();
  },
  round() {
    const G = _sxGame, pool = G.pool;
    G.locked = false;
    let a = null, b = null;
    for (let i = 0; i < 300; i++) {
      a = pool[_sxRand(pool.length)]; b = pool[_sxRand(pool.length)];
      if (a.sk !== b.sk && Math.abs(a.first - b.first) >= 30 * _SX_DAY) break;
    }
    G.pair = [a, b];
    _sxScoreLine(t('sx_hl_streak').replace('{n}', G.score) + ' · ' + t('sx_game_best').replace('{n}', Math.max(G.score, _sxGameBest.first || 0).toLocaleString()));
    const ca = _sxSongCard(a, `<button type="button" class="dc-btn dc-btn-main" data-f="0">${esc(t('sx_first_this'))}</button><em class="sx-gsmall" id="sxF0"></em>`);
    const cb = _sxSongCard(b, `<button type="button" class="dc-btn dc-btn-main" data-f="1">${esc(t('sx_first_this'))}</button><em class="sx-gsmall" id="sxF1"></em>`);
    const st = _sxStage(`<p class="sx-game-q">${esc(t('sx_first_q'))}</p><div class="sx-hl">${ca.html}<span class="sx-vs">${esc(t('sx_vs_short'))}</span>${cb.html}</div><p id="sxGameRes" class="sx-game-res"></p>`, '[data-f="0"]');
    _sxSongArt(document.getElementById(ca.id), a);
    _sxSongArt(document.getElementById(cb.id), b);
    st.querySelectorAll('[data-f]').forEach(x => x.addEventListener('click', () => this.answer(+x.dataset.f)));
  },
  key(e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); this.answer(0); }
    if (e.key === 'ArrowRight') { e.preventDefault(); this.answer(1); }
  },
  answer(i) {
    const G = _sxGame;
    if (!G || G.locked || !G.pair) return;
    G.locked = true;
    const [a, b] = G.pair, firstI = a.first < b.first ? 0 : 1, right = i === firstI;
    const locale = currentLang === 'en' ? 'en-US' : currentLang;
    [a, b].forEach((s, j) => {
      const el = document.getElementById('sxF' + j);
      if (el) { el.textContent = s.first.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }); el.classList.add(j === firstI ? 'is-right' : 'is-other'); }
    });
    document.querySelectorAll('#sxGameStage [data-f]').forEach(x => { x.disabled = true; });
    const res = document.getElementById('sxGameRes');
    if (right) {
      G.score++;
      if (res) res.innerHTML = `<span class="sx-right">${esc(t('sx_game_right'))}</span>`;
      _sxScoreLine(t('sx_hl_streak').replace('{n}', G.score) + ' · ' + t('sx_game_best').replace('{n}', Math.max(G.score, _sxGameBest.first || 0).toLocaleString()));
      G.timer = setTimeout(() => { if (_sxGame === G) this.round(); }, 1600);
    } else {
      if (res) res.innerHTML = `<span class="sx-wrong">${esc(t('sx_first_wrong').replace('{song}', [a, b][firstI].title))}</span>`;
      G.timer = setTimeout(() => { if (_sxGame === G) _sxGameOver(G.score, t('sx_hl_final').replace('{n}', G.score)); }, 1900);
    }
  },
};

// ── Guess the #1 (step 8) ──
/* Ten weeks from your weekly chart; for each, pick its #1 song from four.
   The other three charted that same week (or near it), so it takes
   memory, not just knowing your favourites. Keys: 1–4. */
SX_GAMES.one = {
  start() {
    const run = _crFull('week');
    const tab = run.result.songs || {};
    const weeks = new Map(); // week -> [{ sk, rank }]
    for (const sk in tab) for (const e of tab[sk].entries) {
      if (e.rank > 15) continue;
      if (!weeks.has(e.periodKey)) weeks.set(e.periodKey, []);
      weeks.get(e.periodKey).push({ sk, rank: e.rank });
    }
    const usable = [...weeks.entries()].filter(([, l]) => l.some(x => x.rank === 1) && l.length >= 4).map(([w]) => w);
    if (usable.length < 10) { _sxStage(`<p class="sx-note">${esc(t('sx_game_small'))}</p>`); return; }
    _sxGame.weeks = weeks;
    _sxGame.usable = usable;
    _sxGame.tab = tab;
    _sxGame.seen = new Set();
    this.round();
  },
  song(sk) {
    const e = _sxGame.tab[sk], o = _sxIndex().songs.get(sk);
    return { sk, title: (e && e._title) || (o && o.label) || sk, artist: (e && e._artist) || (o && o.sub) || '' };
  },
  round() {
    const G = _sxGame;
    G.round++;
    G.locked = false;
    let w;
    do { w = G.usable[_sxRand(G.usable.length)]; } while (G.seen.has(w) && G.seen.size < G.usable.length);
    G.seen.add(w);
    const list = G.weeks.get(w);
    const one = list.find(x => x.rank === 1);
    const others = list.filter(x => x.rank !== 1).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [one, ...others].sort(() => Math.random() - 0.5).map(x => this.song(x.sk));
    G.ans = opts.findIndex(o => o.sk === one.sk);
    G.opts = opts;
    _sxScoreLine(t('sx_round').replace('{n}', G.round).replace('{of}', 10) + ' · ' + t('sx_one_score').replace('{n}', G.score));
    const ids = [];
    const html = opts.map((o, i) => {
      const id = 'sx-gart-' + (++_sxArtN);
      ids.push(id);
      return `<button type="button" class="sx-one-opt" data-o="${i}"><span class="sx-one-k">${i + 1}</span>` +
        `<span class="sx-gart sx-gart-sm" id="${id}"><span class="thumb-initials">${esc(initials(o.title))}</span></span>` +
        `<span class="sx-gtxt"><b>${esc(o.title)}</b><span>${esc(o.artist)}</span></span></button>`;
    }).join('');
    const st = _sxStage(`<p class="sx-game-q">${esc(t('sx_one_q').replace('{week}', crPeriodTitle('week', w)))}</p>` +
      `<div class="sx-one-opts">${html}</div><p id="sxGameRes" class="sx-game-res"></p>`, '.sx-one-opt');
    opts.forEach((o, i) => _sxSongArt(document.getElementById(ids[i]), o));
    st.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => this.answer(+b.dataset.o)));
  },
  key(e) {
    if (/^[1-4]$/.test(e.key)) { e.preventDefault(); this.answer(+e.key - 1); }
  },
  answer(i) {
    const G = _sxGame;
    if (!G || G.locked || !G.opts || i >= G.opts.length) return;
    G.locked = true;
    const right = i === G.ans;
    if (right) G.score++;
    document.querySelectorAll('#sxGameStage [data-o]').forEach(b => {
      b.disabled = true;
      if (+b.dataset.o === G.ans) b.classList.add('is-right');
      else if (+b.dataset.o === i) b.classList.add('is-wrong');
    });
    const res = document.getElementById('sxGameRes');
    if (res) res.innerHTML = right ? `<span class="sx-right">${esc(t('sx_game_right'))}</span>`
      : `<span class="sx-wrong">${esc(t('sx_one_was').replace('{song}', G.opts[G.ans].title))}</span>`;
    _sxScoreLine(t('sx_round').replace('{n}', G.round).replace('{of}', 10) + ' · ' + t('sx_one_score').replace('{n}', G.score));
    G.timer = setTimeout(() => {
      if (_sxGame !== G) return;
      if (G.round >= 10) _sxGameOver(G.score, t('sx_one_final').replace('{n}', G.score));
      else this.round();
    }, 1700);
  },
};
