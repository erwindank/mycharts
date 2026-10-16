/* ===========================================================================
   DAILY CHART — the Daily tab, before Weekly (phase 1, 2026-10-16)
   ===========================================================================
   One day's listening as a chart, with its own stats.

   What is here (phase 1 of the plan in the project notes):
     - the tab and day-by-day navigation: the shared date bar's ‹ › arrows and
       a date picker (#dayPicker) move one day at a time; currentOffset counts
       days back from today while currentPeriod === 'day'
     - top songs, artists and albums for the day, Top 10 / 20 / 50
     - movement against a comparison day: yesterday, or the same weekday last
       week (▲3, ▼2, NEW, RE)
     - days on the daily chart this month, the peak (rank and date), and the
       daily #1 line ("#1 for 3 days in a row · 5 days at #1 this month")
     - the four stat tiles in #statsStrip, each against the comparison day,
       with first-ever plays, the day's share of its week and how the day
       ranks against every other day and every other same weekday

   Why its own file and not a fifth case in renderAll(): the weekly / monthly /
   yearly pipeline (period stats, chart runs, Bubbling Under, peaks, certs,
   share images) branches on currentPeriod in well over a hundred places, and
   most of them fall through to "year" for anything they do not know. Teaching
   all of them about days would be a large, risky change for features the
   Daily tab does not need yet. So renderAll() hands 'day' straight to
   dyRender() and this file builds the view itself, reusing the same tile and
   chart table markup (and so the same CSS) as the other periods.

   Daily charts are built from allPlays alone, so they work the same for
   Last.fm, Google Sheets and CSV uploads.

   Ties: two songs on the same count never share a rank. They are ordered the
   way the weekly chart orders them: whoever was on the previous day's chart
   first (by its rank there), then a re-entry, then a debut, then whoever got
   to the count first that day.
   =========================================================================== */

const DY_SIZES = [10, 20, 50];
const DY_DAY_KEYS = ['day_sunday', 'day_monday', 'day_tuesday', 'day_wednesday', 'day_thursday', 'day_friday', 'day_saturday'];

// Chart size and what to compare against, remembered per browser
let dySize = (() => {
  try { const n = parseInt(localStorage.getItem('dc_daily_size'), 10); return DY_SIZES.includes(n) ? n : 20; } catch (e) { return 20; }
})();
let dyCompare = (() => {
  try { return localStorage.getItem('dc_daily_compare') === 'weekday' ? 'weekday' : 'yesterday'; } catch (e) { return 'yesterday'; }
})();

let _dyHist = null;

// The icon each chart heading carries, the same ones as the Songs / Artists / Albums sections
const DY_TYPE_ICONS = {
  songs: '<svg class="section-type-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  artists: '<svg class="section-type-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
  albums: '<svg class="section-type-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>',
};   // { gen, days, byDay, charts } — see dyHistory()

// ─── DATE HELPERS ─────────────────────────────────────────────────────────
// Days are YYYY-MM-DD strings in the app's timezone, the same as dayStrOf(p).

function dyShift(ds, n) {
  const d = new Date(ds + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return localDateStr(d);
}

function dyDate(ds) { return new Date(ds + 'T12:00:00'); }

// The day on screen: currentOffset days before today
function dyViewedDay() {
  return dyShift(localDateStr(tzNow()), -currentOffset);
}

// The day the movement column compares against
function dyCompareDay(ds) {
  return dyShift(ds, dyCompare === 'weekday' ? -7 : -1);
}

function dyDayName(ds) { return t(DY_DAY_KEYS[dyDate(ds).getDay()]); }

/* Date range for getDateRange(): the whole of the viewed day, plus the label
   and sub line for the date bar ("Today" / "Yesterday" / "Wednesday", and the
   full date under it). */
function dyDateRange() {
  const ds = dyViewedDay();
  const d = dyDate(ds);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  const label = currentOffset === 0 ? t('dy_today') : currentOffset === 1 ? t('dy_yesterday') : dyDayName(ds);
  return { start, end, label, sub: `${dyDayName(ds)} · ${fmt(start)}` };
}

// ─── HISTORY: every day's chart ───────────────────────────────────────────
/* One pass groups every play by day; a second, oldest day first, ranks each
   day's songs, artists and albums with the tie rules above (they need the day
   before's chart, which is why it runs in order). Only the top dySize of each
   day is kept. Cached until the plays, the chart size or the album settings
   change. */
function dyHistory() {
  const gen = [_stampEpoch, _playsVersion, _releaseEpoch, dySize, albumsFilterBucket() || '', singleRollupLevel()].join('|');
  if (_dyHist && _dyHist.gen === gen) return _dyHist;

  const byDay = {};   // ds → { plays, songs: {k: e}, artists: {k: e}, albums: {k: e}, list: [plays] }
  let timedN = 0;
  const roll = rollupAffectsCharts();
  for (const p of allPlays) {
    const ds = dayStrOf(p);
    const ms = msOf(p);
    const d = byDay[ds] || (byDay[ds] = { plays: 0, songs: {}, artists: {}, albums: {}, firstP: p, firstMs: ms, lastP: p, lastMs: ms, list: [] });
    d.plays++;
    d.list.push(p);   // the day's plays, for the time-of-day card (phase 3)
    // Plays with a time of day other than midnight: date-only sheets have none
    const td = tzDateOf(p);
    if (td.getHours() || td.getMinutes()) timedN++;
    // The day's first and last play, for the day panel (phase 2)
    if (ms < d.firstMs) { d.firstMs = ms; d.firstP = p; }
    if (ms > d.lastMs) { d.lastMs = ms; d.lastP = p; }
    const sk = songKey(p);
    const s = d.songs[sk] || (d.songs[sk] = { count: 0, first: ms, title: p.title, artist: p.artist, _albums: {} });
    s.count++; if (ms < s.first) s.first = ms;
    s._albums[p.album] = (s._albums[p.album] || 0) + 1;
    for (const a of p.artists) {
      const e = d.artists[a] || (d.artists[a] = { count: 0, first: ms, songs: new Set() });
      e.count++; if (ms < e.first) e.first = ms;
      e.songs.add(p.title);
    }
    // Albums are credited the way the albums chart credits them (singles rolled up, buckets)
    tallyAlbumPlay(d.albums, p, roll, () => ({ count: 0, first: ms }));
    const ak = p.album && p.album !== '—' ? albumKeyOf(p) : null;
    if (ak && d.albums[ak] && ms < d.albums[ak].first) d.albums[ak].first = ms;
  }

  const days = Object.keys(byDay).sort();
  const charts = { songs: {}, artists: {}, albums: {} };   // type → ds → [{ k, rank, count }]
  const ever = { songs: new Set(), artists: new Set(), albums: new Set() };
  for (const type of ['songs', 'artists', 'albums']) {
    for (const ds of days) {
      let counts = byDay[ds][type];
      if (type === 'albums') counts = applyAlbumsFilterByKey(counts);
      const prev = charts[type][dyShift(ds, -1)];
      const prevRank = {};
      if (prev) for (const r of prev) prevRank[r.k] = r.rank;
      const rows = Object.keys(counts).map(k => {
        const e = counts[k];
        const pr = prevRank[k];
        return { k, count: e.count, first: e.first, status: pr ? 0 : ever[type].has(k) ? 1 : 2, prevRank: pr || Infinity };
      });
      rows.sort((a, b) => b.count - a.count || a.status - b.status || a.prevRank - b.prevRank || a.first - b.first);
      const top = rows.slice(0, dySize).map((r, i) => ({ k: r.k, rank: i + 1, count: r.count }));
      charts[type][ds] = top;
      for (const r of top) ever[type].add(r.k);
    }
  }

  // Real times of day if more than half the plays have one (see dyTimeOfDayHtml)
  _dyHist = { gen, days, byDay, charts, timed: timedN > allPlays.length / 2 };
  return _dyHist;
}

/* For the entries on the viewed day's chart: their peak (best rank and the
   first day they reached it), days on the chart this month, and whether they
   ever charted before this day. Walks the stored charts up to the viewed day
   only, so going back in time shows the peak as it stood then. */
function dyEntryFacts(h, type, ds) {
  const chart = h.charts[type][ds] || [];
  const want = new Set(chart.map(r => r.k));
  const monthStart = ds.slice(0, 7) + '-01';
  const facts = {};
  for (const k of want) facts[k] = { peak: Infinity, peakDs: '', monthDays: 0, before: false };
  for (const day of h.days) {
    if (day > ds) break;
    const rows = h.charts[type][day];
    if (!rows) continue;
    for (const r of rows) {
      const f = facts[r.k];
      if (!f) continue;
      if (r.rank < f.peak) { f.peak = r.rank; f.peakDs = day; }
      if (day >= monthStart) f.monthDays++;
      if (day < ds) f.before = true;
    }
  }
  return facts;
}

/* The daily #1 line for the viewed day's chart-topper: days in a row at #1
   ending on this day, and days at #1 so far this month. */
function dyNo1Facts(h, type, ds) {
  const top = (h.charts[type][ds] || [])[0];
  if (!top) return null;
  const isTop = day => { const c = h.charts[type][day]; return !!(c && c[0] && c[0].k === top.k); };
  let run = 0;
  for (let day = ds; isTop(day); day = dyShift(day, -1)) run++;
  let month = 0;
  const monthStart = ds.slice(0, 7) + '-01';
  for (let day = monthStart; day <= ds; day = dyShift(day, 1)) if (isTop(day)) month++;
  return { key: top.k, run, month };
}

// ─── RENDER ───────────────────────────────────────────────────────────────

/* Called from renderAll() while the Daily tab is open. Takes down the parts
   of the chart page that belong to the other periods, then fills the stat
   tiles and #dailyView. */
function dyRender() {
  // The other periods' charts and extras; renderAll() and applyChartTypeView()
  // put them back when you switch to Weekly or another period.
  ['songsChartGroup', 'artistsChartGroup', 'albumsChartGroup', 'statsStrip2', 'statsStrip3'].forEach(id => {
    const el = document.getElementById(id); if (el) el.style.display = 'none';
  });
  const ati = document.getElementById('atInsights'); if (ati) ati.hidden = true;
  if (typeof hideCertReel === 'function') hideCertReel();
  document.getElementById('statsStrip').style.display = '';
  // The Songs / Artists / Albums switch is shared with the other periods
  const bar = document.getElementById('chartTypeToggleBar');
  if (bar) bar.style.display = 'flex';
  document.querySelectorAll('#chartTypeToggleBar .chart-type-toggle-btn').forEach(b => b.classList.toggle('active', b.dataset.type === chartTypeView));

  // Date bar
  const { label, sub } = dyDateRange();
  document.getElementById('periodLabel').innerHTML = `<strong>${esc(label)}</strong><span class="period-sub">${esc(sub)}</span>`;
  const h = dyHistory();
  const first = h.days[0] || null;
  const ds = dyViewedDay();
  const prevDis = !first || ds <= first;   // nothing before your first play
  const nextDis = currentOffset === 0;
  document.getElementById('prevBtn').disabled = prevDis;
  document.getElementById('nextBtn').disabled = nextDis;
  document.querySelector('.swipe-arrow-left')?.classList.toggle('swipe-arrow-off', nextDis);
  document.querySelector('.swipe-arrow-right')?.classList.toggle('swipe-arrow-off', prevDis);
  if (typeof syncPicker === 'function') syncPicker();

  dyRenderTiles(h, ds);
  dyRenderChart(h, ds);
}

// ─── TILES ────────────────────────────────────────────────────────────────

function dyRenderTiles(h, ds) {
  const el = document.getElementById('statsStrip');
  const day = h.byDay[ds];
  const cmpDs = dyCompareDay(ds);
  const cmp = h.byDay[cmpDs];
  const cmpName = dyCompare === 'weekday' ? t('dy_vs_weekday_short', { day: dyDayName(cmpDs) }) : t('dy_vs_yesterday');

  // Unique counts the way the other periods count them (albums by name)
  const uniq = d => {
    if (!d) return { plays: 0, songs: 0, artists: 0, albums: 0 };
    const albums = new Set();
    for (const k in d.albums) { const i = k.lastIndexOf('|||'); albums.add(i < 0 ? k : k.slice(0, i)); }
    return { plays: d.plays, songs: Object.keys(d.songs).length, artists: Object.keys(d.artists).length, albums: albums.size };
  };
  const cur = uniq(day), prv = uniq(cmp);

  // First-ever plays on this day
  if (!firstSeenMaps) firstSeenMaps = buildFirstSeenMaps();
  const { songFirst, artistFirst, albumFirst } = firstSeenMaps;
  const isNew = f => !!f && localDateStr(f) === ds;
  let newSongs = 0, newArtists = 0, newAlbums = 0;
  if (day) {
    for (const k in day.songs) if (isNew(songFirst[k])) newSongs++;
    for (const k in day.artists) if (isNew(artistFirst[k])) newArtists++;
    for (const k in day.albums) if (isNew(albumFirst[k])) newAlbums++;
  }

  // Share of the week the day falls in (weekStartDay, as on the Weekly tab)
  const d = dyDate(ds);
  const wkStart = dyShift(ds, -((d.getDay() - weekStartDay + 7) % 7));
  let weekPlays = 0;
  for (let i = 0; i < 7; i++) weekPlays += (h.byDay[dyShift(wkStart, i)] || {}).plays || 0;
  const share = weekPlays ? Math.round(cur.plays / weekPlays * 100) : 0;

  // How the day ranks: against every day you listened, the same weekday, and this month
  let rankAll = 1, rankWd = 1, totalWd = 0, rankMonth = 1;
  const wd = d.getDay(), month = ds.slice(0, 7);
  for (const day2 of h.days) {
    const n = h.byDay[day2].plays;
    const sameWd = dyDate(day2).getDay() === wd;
    if (sameWd) totalWd++;
    if (n > cur.plays) {
      rankAll++;
      if (sameWd) rankWd++;
      if (day2.slice(0, 7) === month) rankMonth++;
    }
  }

  const delta = (a, b) => {
    if (!cmp) return '';
    const diff = a - b;
    const tip = ` title="${esc(cmpName)}"`;
    if (diff > 0) return `<span class="stat-delta up"${tip}>▲ ${diff.toLocaleString()}</span>`;
    if (diff < 0) return `<span class="stat-delta down"${tip}>▼ ${Math.abs(diff).toLocaleString()}</span>`;
    return `<span class="stat-delta same"${tip}>${t('stat_same')}</span>`;
  };
  const subCell = (val, lbl, extra = '', attrs = '') =>
    `<div class="stat-sub-cell${extra}"${attrs}><span class="stat-sub-val">${val}</span><span class="stat-sub-lbl">${esc(lbl)}</span></div>`;
  const box = (val, key, prevVal, emoji, cat, extraLine, badge) => `
    <div class="stat-box${badge ? ' stat-peak-attime' : ''}" data-cat="${cat}">
      <div class="stat-head"><span class="stat-cat-icon">${emoji}</span><span class="stat-label">${t(key)}</span></div>
      <div class="stat-val" data-val="${val}">${val.toLocaleString()}</div>
      ${cmp ? `<div class="stat-foot">${delta(val, prevVal)}</div>` : ''}
      ${extraLine || ''}${badge || ''}
    </div>`;
  const newLine = (n, key) => day ? `<div class="stat-sub">${subCell('+' + n.toLocaleString(), t(key))}</div>` : '';

  // Plays tile: share of the week and the weekday rank, with the full ranking in the tooltip
  const rankTip = [t('dy_rank_all_tip', { n: rankAll.toLocaleString(), total: h.days.length.toLocaleString() }),
                   t('dy_rank_wd_tip', { n: rankWd.toLocaleString(), total: totalWd.toLocaleString(), day: dyDayName(ds) })].join('\n');
  const playsLine = day ? `<div class="stat-sub">${subCell(share + '%', t('dy_sub_of_week'))}${subCell('#' + rankWd, dyDayName(ds), ' is-plain', ` title="${esc(rankTip)}"`)}</div>` : '';
  const badge = !day ? '' : rankAll === 1
    ? `<div class="stat-peak-badge stat-peak-badge-alltime">${esc(t('dy_biggest_ever'))}</div>`
    : rankMonth === 1 ? `<div class="stat-peak-badge stat-peak-badge-attime">${esc(t('dy_biggest_month'))}</div>` : '';

  el.innerHTML =
    box(cur.plays,   'stat_total_plays',  prv.plays,   '🎵', 'plays',   playsLine, badge) +
    box(cur.songs,   'stat_unique_songs', prv.songs,   '🎶', 'songs',   newLine(newSongs, 'stat_sub_new_songs')) +
    box(cur.artists, 'stat_artists',      prv.artists, '🎤', 'artists', newLine(newArtists, 'stat_sub_new_artists')) +
    box(cur.albums,  'stat_albums',       prv.albums,  '💿', 'albums',  newLine(newAlbums, 'stat_sub_new_albums'));
  if (typeof animateStatStrip === 'function') animateStatStrip(el);
}

// ─── CHART ────────────────────────────────────────────────────────────────

function dyRenderChart(h, ds) {
  const view = document.getElementById('dailyView');
  if (!view) return;
  const type = ['songs', 'artists', 'albums'].includes(chartTypeView) ? chartTypeView : 'songs';
  const chart = h.charts[type][ds] || [];
  const day = h.byDay[ds];
  const cmpDs = dyCompareDay(ds);
  const cmpRank = {};
  for (const r of h.charts[type][cmpDs] || []) cmpRank[r.k] = r.rank;
  const facts = dyEntryFacts(h, type, ds);

  // Toolbar: what to compare against, and the chart size
  const cmpBtn = (v, lbl) => `<button type="button" class="dy-seg-btn${dyCompare === v ? ' active' : ''}" onclick="dySetCompare('${v}')">${esc(lbl)}</button>`;
  const sizeBtn = n => `<button type="button" class="dy-seg-btn${dySize === n ? ' active' : ''}" onclick="dySetSize(${n})">${esc(t('dy_top_n', { n }))}</button>`;
  const toolbar = `
    <div class="dy-toolbar">
      <div class="dy-seg" role="group" aria-label="${esc(t('dy_compare_label'))}">
        ${cmpBtn('yesterday', t('dy_vs_yesterday'))}${cmpBtn('weekday', t('dy_vs_weekday', { day: dyDayName(ds) }))}
      </div>
      <div class="dy-seg" role="group" aria-label="${esc(t('dy_size_label'))}">${DY_SIZES.map(sizeBtn).join('')}</div>
    </div>`;

  // The daily #1 line
  const no1 = dyNo1Facts(h, type, ds);
  let no1Html = '';
  if (no1) {
    const bits = [no1.run > 1 ? t('dy_no1_run', { n: no1.run }) : t('dy_no1_today')];
    if (no1.month > 1) bits.push(t('dy_no1_month', { n: no1.month }));
    no1Html = `<p class="dy-no1"><span class="dy-no1-crown" aria-hidden="true">♛</span>${esc(bits.join(' · '))}</p>`;
  }

  const titleKey = type === 'songs' ? 'sec_songs_top' : type === 'artists' ? 'sec_artists_top' : 'sec_albums_top';
  const head = `
    <tr>
      <th>${t('th_rank')}</th>
      <th class="m-th m-th-prev"><span class="th-prev-full">${t('th_prev')}</span><span class="th-prev-short">${t('th_prev_mobile')}</span><span class="th-prev-sub">${t('th_prev_sub')}</span></th>
      <th class="thumb-th" style="width:52px;"></th>
      <th>${type === 'songs' ? t('th_title_artist') : type === 'artists' ? t('th_artist') : t('th_album_artist')}</th>
      <th class="m-th" title="${esc(t('dy_th_days_tip'))}"><span class="th-period-full">${t('dy_th_days')}</span><span class="th-period-short">${t('dy_th_days_mobile')}</span></th>
      <th class="m-th dy-peak">${t('dy_th_peak')}</th>
      <th style="text-align:right;"><span class="th-plays-full">${t('th_plays')}</span><span class="th-plays-short">${t('th_plays_mobile')}</span></th>
      <th class="cr-th"></th>
    </tr>`;

  const max = chart[0]?.count || 1;
  const imgItems = [];
  const rows = chart.map((r, i) => {
    const f = facts[r.k] || {};
    const imgId = 'dyimg-' + i;
    // Movement against the comparison day
    let move;
    const was = cmpRank[r.k];
    if (was) {
      const diff = was - r.rank;
      move = diff === 0 ? `<span class="m-same">=</span>` : `<span class="m-${diff > 0 ? 'up' : 'down'}">${diff > 0 ? '▲' : '▼'}${Math.abs(diff)}</span>`;
      move += `<div class="m-prev-rank">#${was}</div>`;
    } else {
      move = f.before ? `<span class="m-re">${t('badge_re')}</span>` : `<span class="m-new">${t(type === 'songs' ? 'badge_new_songs' : 'badge_new')}</span>`;
    }
    const peakTip = f.peakDs ? t('dy_peak_tip', { rank: f.peak, date: fmt(dyDate(f.peakDs)) }) : '';
    const peakCell = `<td class="m-col dy-peak" title="${esc(peakTip)}"><span class="m-mths">#${f.peak}</span>${f.peakDs && f.peakDs !== ds ? `<div class="m-prev-rank">${esc(nsShortDateSafe(f.peakDs))}</div>` : ''}</td>`;

    let thumb, main, ea;   // ea: the entry attributes behind ▶ / ⋮ (_eaAttrs in app.js)
    if (type === 'songs') {
      const s = day.songs[r.k];
      const album = bestAlbum(s.title, s._albums);
      const prefKey = 'song:' + s.artist.toLowerCase() + '|||' + s.title.toLowerCase();
      imgItems.push({ imgId, title: s.title, name: s.title, artist: s.artist, album, type: 'song', prefKey });
      thumb = dyThumb(imgId, s.title, 'song', prefKey, s.title, s.artist, album);
      main = `<div class="song-title">${chartNameLink(s.title, 'openSongModal', r.k)}</div><div class="song-artist">${chartArtistLinks(s.artist)}</div>`;
      ea = _eaAttrs('songs', { title: s.title, artist: s.artist, album, key: r.k, imgId });
    } else if (type === 'artists') {
      const prefKey = 'artist:' + r.k.toLowerCase();
      imgItems.push({ imgId, name: r.k, prefKey });
      thumb = dyThumb(imgId, r.k, 'artist', prefKey, r.k, r.k, '');
      const n = day.artists[r.k] ? day.artists[r.k].songs.size : 0;
      main = `<div class="song-title">${chartNameLink(r.k, 'openArtistModal', r.k)}</div><div class="song-artist">${esc(tCount('songs', n))}</div>`;
      ea = _eaAttrs('artists', { artist: r.k, key: r.k, imgId });
    } else {
      const cut = r.k.lastIndexOf('|||');
      const album = cut < 0 ? r.k : r.k.slice(0, cut), artist = cut < 0 ? '' : r.k.slice(cut + 3);
      const prefKey = 'album:' + artist.toLowerCase() + '|||' + album.toLowerCase();
      imgItems.push({ imgId, album, name: album, artist, prefKey });
      thumb = dyThumb(imgId, album, 'album', prefKey, album, artist, album);
      main = `<div class="song-title">${chartNameLink(album, 'openAlbumModal', r.k)}</div><div class="song-artist">${chartArtistLinks(artist)}</div>`;
      ea = _eaAttrs('albums', { album, artist, key: r.k, imgId });
    }
    const statusCls = !was ? (f.before ? ' wv-row-re' : ' wv-row-new') : '';
    return `<tr${ea} class="${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''}${statusCls}">
      <td class="rank-cell">${r.rank}</td>
      <td class="m-col">${move}</td>
      <td class="thumb-cell">${thumb}</td>
      <td>${main}</td>
      <td class="m-col" title="${esc(t('dy_th_days_tip'))}"><span class="m-mths">${f.monthDays || 1}</span></td>
      ${peakCell}
      <td>
        <div class="play-count">${tCountHtml('plays', r.count)}</div>
        <div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(r.count / max * 100)}%"></div></div>
      </td>
      <td class="cr-cell">${_eaBtns()}</td>
    </tr>`;
  }).join('');

  const body = chart.length
    ? `<table class="chart-table dy-table"><thead>${head}</thead><tbody>${rows}</tbody></table>`
    : `<div class="empty-state"><p>${t('empty_no_plays')}</p></div>`;

  // Time of day (phase 3): collects its covers into todImgs to load below
  const todImgs = [];
  const tod = dyTimeOfDayHtml(h, ds, todImgs);

  view.innerHTML = `
    ${dyPanelHtml(h, ds)}
    ${toolbar}
    <div class="chart-section dy-section">
      <div class="section-header">
        <h2>${DY_TYPE_ICONS[type]}<span class="section-title-text">${esc(t(titleKey, { n: dySize }).replace(/^[★♦◈]\s*/, ''))}</span></h2>
        <div class="section-rule"></div>
      </div>
      ${no1Html}
      <div class="section-body">${body}</div>
    </div>
    ${tod}
    ${dyPatternsHtml(h, ds)}
    ${dyMemoriesHtml(h, ds)}`;

  if (imgItems.length) loadImages(imgItems, type === 'songs' ? 'song' : type === 'artists' ? 'artist' : 'album');
  for (const tp of ['album', 'song']) {
    const items = todImgs.filter(x => x.type === tp).map(x => x.item);
    if (items.length) loadImages(items, tp);
  }
}

// ─── TIME OF DAY (phase 3) ────────────────────────────────────────────────
/* A card under the Daily chart about when in the day you listened:
     - the busiest hour, and listening sessions: runs of plays with no gap
       longer than 30 minutes, with the longest one's length and times
     - 24 bars, one per hour (hover for the hour's plays and top song)
     - the day in four parts (night 0–6, morning 6–12, afternoon 12–18,
       evening 18–24), each with its plays and top song
     - a strip of covers through the day: the most played album (or song,
       when it has no album) of each hour you listened, at that hour
   Only shown when the library carries real times of day. A Google Sheet or
   CSV with dates only stamps every play at midnight, which would put a whole
   day in one bar, so h.timed (worked out in dyHistory) turns the card off. */
const DY_SESSION_GAP = 30 * 60 * 1000;   // a longer gap starts a new session
const DY_SONG_MS = 3.5 * 60 * 1000;      // a play's rough length, added to a session's end

function dyHourLabel(hr) {
  try {
    return new Date(2000, 0, 1, hr).toLocaleTimeString(typeof currentLang !== 'undefined' ? currentLang : undefined, { hour: 'numeric' });
  } catch (e) { return String(hr).padStart(2, '0') + ':00'; }
}

function dyClock(ms) {
  const d = tzDate(new Date(ms));
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

function dyDuration(ms) {
  const m = Math.max(1, Math.round(ms / 60000));
  return m >= 60 ? t('dy_dur_hm', { h: Math.floor(m / 60), m: m % 60 }) : t('dy_dur_m', { m });
}

// The most played entry of a { key: { n, ... } } tally
function dyTopOf(tally) {
  let best = null;
  for (const k in tally) if (!best || tally[k].n > best.n) best = tally[k];
  return best;
}

function dyTimeOfDayHtml(h, ds, imgOut) {
  const day = h.byDay[ds];
  if (!h.timed || !day || !day.list.length) return '';

  const plays = day.list.slice().sort((a, b) => msOf(a) - msOf(b));
  const hours = Array.from({ length: 24 }, () => ({ n: 0, songs: {}, albums: {} }));
  for (const p of plays) {
    const hr = tzDateOf(p).getHours();
    const b = hours[hr];
    b.n++;
    const sk = songKey(p);
    (b.songs[sk] || (b.songs[sk] = { n: 0, title: p.title, artist: p.artist, album: p.album })).n++;
    const ak = p.album && p.album !== '—' ? albumKeyOf(p) : 'song:' + sk;
    (b.albums[ak] || (b.albums[ak] = { n: 0, title: p.title, artist: p.artist, album: p.album && p.album !== '—' ? p.album : '' })).n++;
  }

  // Busiest hour
  let busy = 0;
  for (let i = 1; i < 24; i++) if (hours[i].n > hours[busy].n) busy = i;

  // Sessions
  const sessions = [];
  let cur = null;
  for (const p of plays) {
    const ms = msOf(p);
    if (cur && ms - cur.end <= DY_SESSION_GAP) { cur.end = ms; cur.n++; }
    else { cur = { start: ms, end: ms, n: 1 }; sessions.push(cur); }
  }
  const longest = sessions.reduce((a, b) => (b.end - b.start > a.end - a.start ? b : a), sessions[0]);
  const sessLine = t(sessions.length === 1 ? 'dy_sessions_one' : 'dy_sessions_other', { n: sessions.length }) + ' · ' +
    t('dy_longest', { dur: dyDuration(longest.end - longest.start + DY_SONG_MS), from: dyClock(longest.start), to: dyClock(longest.end + DY_SONG_MS) });

  // Hour bars
  const max = Math.max(1, ...hours.map(b => b.n));
  const bars = hours.map((b, i) => {
    const top = dyTopOf(b.songs);
    const tip = dyHourLabel(i) + ' · ' + tCount('plays', b.n) + (top ? '\n' + top.title + ' — ' + top.artist : '');
    return `<span class="dy-hr${i === busy && b.n ? ' is-busy' : ''}" title="${esc(tip)}"><i style="height:${b.n ? Math.max(6, b.n / max * 100).toFixed(0) : 0}%"></i></span>`;
  }).join('');
  const ticks = [0, 6, 12, 18].map(i => `<span style="left:${(i / 24 * 100).toFixed(2)}%">${esc(dyHourLabel(i))}</span>`).join('');

  // Four parts of the day
  const parts = [['night', 0, 6], ['morning', 6, 12], ['afternoon', 12, 18], ['evening', 18, 24]].map(([key, a, z]) => {
    let n = 0; const songs = {};
    for (let i = a; i < z; i++) {
      n += hours[i].n;
      for (const k in hours[i].songs) {
        const s = hours[i].songs[k];
        (songs[k] || (songs[k] = { n: 0, title: s.title, artist: s.artist })).n += s.n;
      }
    }
    const top = dyTopOf(songs);
    return `<div class="dy-part${n ? '' : ' is-empty'}">
        <span class="ns-x-title">${esc(t('dy_part_' + key))}</span>
        <span class="dy-part-n">${esc(tCount('plays', n))}</span>
        ${top ? `<span class="ns-x-line" title="${esc(top.title + ' — ' + top.artist)}">${esc(top.title)} <span>— ${esc(top.artist)}</span></span>` : ''}
      </div>`;
  }).join('');

  // Cover strip: the most played album of each hour, placed at that hour
  const covers = hours.map((b, i) => {
    if (!b.n) return '';
    const top = dyTopOf(b.albums);
    const imgId = 'dytl-' + i;
    const isAlbum = !!top.album;
    const label = isAlbum ? top.album : top.title;
    const prefKey = isAlbum ? 'album:' + top.artist.toLowerCase() + '|||' + top.album.toLowerCase()
                            : 'song:' + top.artist.toLowerCase() + '|||' + top.title.toLowerCase();
    imgOut.push(isAlbum
      ? { type: 'album', item: { imgId, album: top.album, name: top.album, artist: top.artist, prefKey } }
      : { type: 'song', item: { imgId, title: top.title, name: top.title, artist: top.artist, album: '', prefKey } });
    return `<span class="dy-tl-cover" style="left:${((i + 0.5) / 24 * 100).toFixed(2)}%" title="${esc(dyHourLabel(i) + ' · ' + label + ' — ' + top.artist)}"><span id="${imgId}"><span class="thumb-initials">${esc(initials(label))}</span></span></span>`;
  }).join('');

  return `
    <section class="dy-tod" aria-label="${esc(t('dy_tod_title'))}">
      <div class="dy-tod-head">
        <span class="ns-x-title">${esc(t('dy_tod_title'))}</span>
        <span class="dy-tod-sum"><em>${esc(t('dy_busiest'))}</em> ${esc(dyHourLabel(busy))} <span>· ${esc(tCount('plays', hours[busy].n))}</span></span>
        <span class="dy-tod-sum">${esc(sessLine)}</span>
      </div>
      <div class="dy-tl" aria-hidden="true">${covers}</div>
      <div class="dy-hours" aria-hidden="true">${bars}</div>
      <div class="dy-ticks" aria-hidden="true">${ticks}</div>
      <div class="dy-parts">${parts}</div>
    </section>`;
}

// ─── MEMORIES (phase 5) ───────────────────────────────────────────────────
/* A card under Patterns, looking back from the day on screen (not from
   today, so an old day shows what was forgotten back then):
     - on this day: the top song and artist on the same date 1, 2 and 3 years
       before; click one to open that day's chart
     - forgotten favourites: your top 100 songs as of that day that had gone
       90+ days without a play (and were not played that day), with ▶
     - throwback artists: your top 20 artists as of that day with no play in
       the 30+ days before it (and none that day)
     - comebacks: songs played that day for the first time in 6+ months
     - first heard: artists and songs whose first play ever was that day
   The ▶ / ⋮ buttons are the shared entry actions (_eaAttrs / _eaBtns in
   app.js): sample, play on YouTube, add to a playlist. */
const DY_DAY_MS = 86400000;

// "5 months" / "47 days", for how long something went unplayed
function dyGap(ms) {
  const d = Math.floor(ms / DY_DAY_MS);
  if (d >= 60) { const m = Math.round(d / 30.44); return m >= 24 ? tCount('years', Math.floor(m / 12)) : tCount('months', m); }
  return tCount('days', d);
}

// One remembered song: title, artist, a muted line, and ▶ ⋮
function dyMemSong(s, sub) {
  const k = s.title.toLowerCase().trim() + '|||' + s.artist.toLowerCase().trim();
  return `<li class="dy-mem-row"${_eaAttrs('songs', { title: s.title, artist: s.artist, album: s.album || '', key: k })}>
      <span class="dy-mem-text"><span class="ns-x-line" title="${esc(s.title + ' — ' + s.artist)}"><b>${esc(s.title)}</b> <span>— ${esc(s.artist)}</span></span><span class="dy-mem-sub">${esc(sub)}</span></span>
      ${_eaBtns()}
    </li>`;
}

function dyMemArtist(name, sub) {
  return `<li class="dy-mem-row"${_eaAttrs('artists', { artist: name, key: name })}>
      <span class="dy-mem-text"><span class="ns-x-line"><b>${chartNameLink(name, 'openArtistModal', name)}</b></span><span class="dy-mem-sub">${esc(sub)}</span></span>
      ${_eaBtns()}
    </li>`;
}

function dyMemoriesHtml(h, ds) {
  const day = h.byDay[ds];
  const startMs = +dyDate(ds) - 12 * 3600000;   // midnight at the start of ds
  const blocks = [];

  // ── On this day ──
  const otd = [];
  for (let y = 1; y <= 3; y++) {
    const past = (+ds.slice(0, 4) - y) + ds.slice(4);
    const d = h.byDay[past];
    if (!d) continue;
    let song = null, art = null;
    for (const k in d.songs) if (!song || d.songs[k].count > song.count) song = d.songs[k];
    for (const a in d.artists) if (!art || d.artists[a].count > art[1]) art = [a, d.artists[a].count];
    const off = Math.round((dyDate(localDateStr(tzNow())) - dyDate(past)) / DY_DAY_MS);
    otd.push(`<li class="dy-mem-row is-link" role="button" tabindex="0" onclick="dyGoOffset(${off})" onkeydown="if(event.key==='Enter')dyGoOffset(${off})">
        <span class="dy-mem-year">${esc(t(y === 1 ? 'dy_years_ago_one' : 'dy_years_ago_other', { n: y }))}</span>
        <span class="dy-mem-text"><span class="ns-x-line" title="${esc(song.title + ' — ' + song.artist)}"><b>${esc(song.title)}</b> <span>— ${esc(song.artist)}</span></span>
        <span class="dy-mem-sub">${esc(t('ns_x_top'))}: ${esc(art[0])} · ${esc(tCount('plays', d.plays))}</span></span>
      </li>`);
  }
  if (otd.length) blocks.push([t('dy_otd'), otd.join('')]);

  // ── Everything before this day: counts and last plays ──
  const songs = {}, artists = {};
  for (const p of allPlays) {
    const pd = dayStrOf(p);
    if (pd >= ds) continue;
    const ms = msOf(p);
    const sk = songKey(p);
    const s = songs[sk] || (songs[sk] = { n: 0, last: 0, title: p.title, artist: p.artist, album: p.album && p.album !== '—' ? p.album : '' });
    s.n++; if (ms > s.last) s.last = ms;
    for (const a of p.artists) { const r = artists[a] || (artists[a] = { n: 0, last: 0 }); r.n++; if (ms > r.last) r.last = ms; }
  }
  const playedToday = k => !!(day && day.songs[k]);

  // ── Forgotten favourites ──
  const forgot = Object.entries(songs).sort((a, b) => b[1].n - a[1].n).slice(0, 100)
    .filter(([k, s]) => startMs - s.last >= 90 * DY_DAY_MS && !playedToday(k)).slice(0, 3)
    .map(([, s]) => dyMemSong(s, tCount('plays', s.n) + ' · ' + t('dy_not_for', { t: dyGap(startMs - s.last) })));
  if (forgot.length) blocks.push([t('dy_forgot'), forgot.join('')]);

  // ── Throwback artists ──
  const throwback = Object.entries(artists).sort((a, b) => b[1].n - a[1].n).slice(0, 20)
    .map(([a, r], i) => ({ a, r, rank: i + 1 }))
    .filter(x => startMs - x.r.last >= 30 * DY_DAY_MS && !(day && day.artists[x.a])).slice(0, 3)
    .map(x => dyMemArtist(x.a, t('dy_throw_line', { rank: x.rank, t: dyGap(startMs - x.r.last) })));
  if (throwback.length) blocks.push([t('dy_throw'), throwback.join('')]);

  if (day) {
    // ── Comebacks: back after 6+ months ──
    const back = [];
    for (const k in day.songs) {
      const s = songs[k];
      if (s && day.firstMs - s.last >= 182 * DY_DAY_MS) back.push({ k, s, gap: day.firstMs - s.last, cur: day.songs[k] });
    }
    back.sort((a, b) => b.gap - a.gap);
    if (back.length) blocks.push([t('dy_comeback'), back.slice(0, 3).map(x =>
      dyMemSong({ title: x.cur.title, artist: x.cur.artist, album: bestAlbum(x.cur.title, x.cur._albums) }, t('dy_comeback_line', { t: dyGap(x.gap) }))).join('')]);

    // ── First heard: songs and artists never played before this day ──
    const newArtists = Object.keys(day.artists).filter(a => !artists[a]).sort((a, b) => day.artists[b].count - day.artists[a].count);
    const newSongs = Object.keys(day.songs).filter(k => !songs[k]).sort((a, b) => day.songs[b].count - day.songs[a].count);
    if (newArtists.length || newSongs.length) {
      const rows = newArtists.slice(0, 2).map(a => dyMemArtist(a, t('dy_first_artist') + ' · ' + tCount('plays', day.artists[a].count)));
      const songRows = newSongs.slice(0, Math.max(1, 3 - rows.length)).map(k => {
        const s = day.songs[k];
        return dyMemSong({ title: s.title, artist: s.artist, album: bestAlbum(s.title, s._albums) }, t('dy_first_song') + ' · ' + tCount('plays', s.count));
      });
      const shown = songRows.length;
      const more = newSongs.length > shown ? `<li class="dy-mem-more">${esc(t('dy_first_more', { n: newSongs.length - shown }))}</li>` : '';
      blocks.push([t('dy_first'), rows.join('') + songRows.join('') + more]);
    }
  }

  if (!blocks.length) return '';
  return `
    <section class="dy-tod dy-mem" aria-label="${esc(t('dy_mem_title'))}">
      <div class="dy-tod-head"><span class="ns-x-title">${esc(t('dy_mem_title'))}</span></div>
      <div class="dy-mem-grid">
        ${blocks.map(([title, body]) => `<div class="dy-mem-block"><span class="ns-x-title">${esc(title)}</span><ul class="dy-mem-list">${body}</ul></div>`).join('')}
      </div>
    </section>`;
}

// ─── PATTERNS (phase 4) ───────────────────────────────────────────────────
/* A card under the time-of-day card about how you listened that day:
     - most replayed: the song played the most times
     - back to back: the longest run of the same song in a row, and of the
       same artist in a row (needs plays in order, so it uses the play times;
       date-only plays keep the order they came in)
     - albums played in full: every track of an album played that day. The
       tracklist is the real one from Deezer when it has been looked up
       (rtPrefetchTracklist, the same store the album grid card uses); until
       then, or when Deezer has no match, every track of it in your library,
       and only for albums with 5 or more of those. Only albums with 4+
       different tracks that day are checked, so few lookups ever happen.
     - variety: different songs per play, on a scale from loyal (the same few
       songs again and again) to explorer (nearly every play a new song),
       against your usual over the 30 days before
     - genre mix: a donut of the day's plays by genre. Each play takes the
       first real genre of its song (the sheet's Genre columns) or else of
       its artist (Last.fm tags, looked up for the day's top artists and then
       cached). Hidden while nothing is known. */
const DY_TAG_JUNK = /^(seen live|favou?rites?|my favou?rites?|female vocalists?|male vocalists?|awesome|love|beautiful|cool|amazing|spotify|under \d+ listeners|all|[0-9]{2,4}s|british|american|english|uk|usa|canadian|australian|swedish|german|french|spanish|korean|japanese|brazilian|irish|scottish)$/;
const DY_GENRE_COLORS = ['var(--accent)', 'var(--green)', 'var(--amber)', 'var(--rose)', 'var(--accent2)', 'var(--text3)'];
let _dyTagFetching = false;     // one round of Last.fm lookups at a time
const _dyTrackFetch = new Set(); // albums whose Deezer tracklist was asked for this session

// "Song (feat. X) - Remastered" → "song", so library titles match Deezer's
function dyPlainTitle(s) {
  return String(s || '').toLowerCase().replace(/\s*[\(\[][^\)\]]*[\)\]]/g, '').replace(/\s+-\s+.*$/, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

// A play's genre, or undefined when its artist has not been looked up yet
function dyPlayGenre(p) {
  let tags = p.genres;
  if (!tags && typeof _awardsSongTags === 'function') tags = _awardsSongTags(p);
  if (tags === undefined) return undefined;
  for (const g of tags || []) if (!DY_TAG_JUNK.test(g)) return g;
  return null;   // looked up, nothing usable
}

/* Redraws only the patterns card, once a Deezer tracklist or Last.fm tags
   arrive, so the rest of the page (tiles, chart, covers) is left alone. */
function dyRefreshPatterns(ds) {
  if (currentPeriod !== 'day' || dyViewedDay() !== ds) return;
  const el = document.querySelector('#dailyView .dy-pats');
  if (el) el.outerHTML = dyPatternsHtml(dyHistory(), ds);
}

function dyPatternsHtml(h, ds) {
  const day = h.byDay[ds];
  if (!day || !day.list.length) return '';
  const plays = day.list.slice().sort((a, b) => msOf(a) - msOf(b));

  // Most replayed
  let most = null;
  for (const k in day.songs) if (!most || day.songs[k].count > most.count) most = day.songs[k];

  // Back to back: longest run of one song, and of one artist
  let sRun = { n: 0 }, aRun = { n: 0 }, sCur = null, aCur = null;
  for (const p of plays) {
    const sk = songKey(p), ar = _pa(p);
    sCur = sCur && sCur.k === sk ? { ...sCur, n: sCur.n + 1 } : { k: sk, n: 1, title: p.title, artist: p.artist };
    aCur = aCur && aCur.k === ar ? { ...aCur, n: aCur.n + 1 } : { k: ar, n: 1 };
    if (sCur.n > sRun.n) sRun = sCur;
    if (aCur.n > aRun.n) aRun = aCur;
  }

  // Albums played in full
  const full = dyFullAlbums(h, ds);

  // Variety, and your usual before this day
  const variety = d => d.plays ? Object.keys(d.songs).length / d.plays : 0;
  const v = variety(day);
  let vs = 0, vc = 0;
  for (let i = 1; i <= 30; i++) { const d = h.byDay[dyShift(ds, -i)]; if (d && d.plays >= 5) { vs += variety(d); vc++; } }
  const usualV = vc ? vs / vc : null;
  const vPct = Math.round(v * 100);

  const tile = (title, body) => `<div class="dy-pat"><span class="ns-x-title">${esc(title)}</span>${body}</div>`;
  const line = (html, tip) => `<span class="ns-x-line"${tip ? ` title="${esc(tip)}"` : ''}>${html}</span>`;

  const mostTile = tile(t('dy_pat_most'), most
    ? line(`<b>${esc(most.title)}</b>`, most.title + ' — ' + most.artist) + line(`<span>${esc(most.artist)} · ${esc(t('dy_times', { n: most.count }))}</span>`)
    : '');
  const b2bTile = tile(t('dy_pat_b2b'),
    (sRun.n > 1 ? line(`<b>${esc(sRun.title)}</b> <span>· ${esc(t('dy_in_a_row', { n: sRun.n }))}</span>`, sRun.title + ' — ' + sRun.artist) : line(`<span>${esc(t('dy_no_repeats'))}</span>`)) +
    (aRun.n > 1 ? line(`${esc(aRun.k)} <span>· ${esc(t('dy_plays_in_a_row', { n: aRun.n }))}</span>`) : ''));
  const fullTile = tile(t('dy_pat_full'), full.length
    ? full.slice(0, 2).map(f => line(`<b>${esc(f.album)}</b> <span>· ${esc(t(f.official ? 'dy_full_tracks' : 'dy_full_tracks_lib', { n: f.tracks }))}</span>`, f.album + ' — ' + f.artist)).join('')
    : line(`<span>${esc(t('dy_full_none'))}</span>`));
  const marker = `<span class="dy-gauge"><i style="left:${vPct}%"></i>${usualV !== null ? `<u style="left:${Math.round(usualV * 100)}%" title="${esc(t('dy_usual_mark'))}"></u>` : ''}</span>`;
  const label = v >= 0.7 ? 'dy_var_explorer' : v <= 0.35 ? 'dy_var_loyal' : 'dy_var_mixed';
  const varTile = tile(t('dy_pat_variety'),
    line(`<b>${esc(t(label))}</b> <span>· ${esc(t('dy_var_line', { songs: Object.keys(day.songs).length, plays: day.plays }))}</span>`) +
    marker + `<span class="dy-gauge-ends"><span>${esc(t('dy_var_loyal'))}</span><span>${esc(t('dy_var_explorer'))}</span></span>`);

  return `
    <section class="dy-tod dy-pats" aria-label="${esc(t('dy_pat_title'))}">
      <div class="dy-tod-head"><span class="ns-x-title">${esc(t('dy_pat_title'))}</span></div>
      <div class="dy-pat-grid">${mostTile}${b2bTile}${fullTile}${varTile}</div>
      ${dyGenreHtml(h, ds, plays)}
    </section>`;
}

/* Albums with every track played on the day. Asks Deezer for the tracklist of
   each candidate once per session; the answer is cached by the album grid's
   store, and the view is redrawn when it lands. */
function dyFullAlbums(h, ds) {
  const day = h.byDay[ds];
  const byAlbum = {};
  for (const p of day.list) {
    if (!p.album || p.album === '—') continue;
    const ak = albumKeyOf(p);
    (byAlbum[ak] || (byAlbum[ak] = new Set())).add(dyPlainTitle(p.title));
  }
  const store = typeof _rtTracklistStore === 'function' ? _rtTracklistStore() : {};
  const out = [];
  for (const [ak, titles] of Object.entries(byAlbum)) {
    if (titles.size < 4) continue;
    const [album, artist] = ak.split('|||');
    const list = store[ak];
    if (Array.isArray(list)) {
      const need = [...new Set(list.map(dyPlainTitle))];
      if (need.length && need.every(x => titles.has(x))) out.push({ album, artist, tracks: need.length, official: true });
      continue;
    }
    if (list === undefined && typeof rtPrefetchTracklist === 'function' && !_dyTrackFetch.has(ak)) {
      _dyTrackFetch.add(ak);
      rtPrefetchTracklist(ak).then(() => { if (Array.isArray(_rtTracklistStore()[ak])) dyRefreshPatterns(ds); });
    }
    // No tracklist (yet): every track of it in your library
    const known = new Set();
    for (const d of h.days) for (const p of h.byDay[d].list) if (p.album === album && albumKeyOf(p) === ak) known.add(dyPlainTitle(p.title));
    if (known.size >= 5 && [...known].every(x => titles.has(x))) out.push({ album, artist, tracks: known.size, official: false });
  }
  return out.sort((a, b) => b.tracks - a.tracks);
}

// The day's genre mix as a donut with a legend
function dyGenreHtml(h, ds, plays) {
  const counts = {};
  const missing = new Set();
  let known = 0;
  for (const p of plays) {
    const g = dyPlayGenre(p);
    if (g === undefined) { missing.add(_pa(p)); continue; }
    if (!g) continue;
    counts[g] = (counts[g] || 0) + 1;
    known++;
  }
  // Look up the day's top artists that have no tags yet, then redraw once
  if (missing.size && !_dyTagFetching && typeof _awardsGetArtistGenre === 'function') {
    const byPlays = {};
    for (const p of plays) { const a = _pa(p); if (missing.has(a)) byPlays[a] = (byPlays[a] || 0) + 1; }
    const want = Object.keys(byPlays).sort((a, b) => byPlays[b] - byPlays[a]).slice(0, 15);
    _dyTagFetching = true;
    Promise.all(want.map(a => _awardsGetArtistGenre(a))).finally(() => {
      _dyTagFetching = false;
      dyRefreshPatterns(ds);
    });
  }
  if (!known) return '';

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5).reduce((s, [, n]) => s + n, 0);
  if (rest) top.push([t('dy_genre_other'), rest]);
  const r = 26, c = 2 * Math.PI * r;
  let at = 0;
  const arcs = top.map(([, n], i) => {
    const len = n / known * c;
    const seg = `<circle cx="32" cy="32" r="${r}" fill="none" stroke="${DY_GENRE_COLORS[i]}" stroke-width="10" stroke-dasharray="${len.toFixed(2)} ${(c - len).toFixed(2)}" stroke-dashoffset="${(-at).toFixed(2)}" transform="rotate(-90 32 32)"/>`;
    at += len;
    return seg;
  }).join('');
  const legend = top.map(([g, n], i) =>
    `<li><i style="background:${DY_GENRE_COLORS[i]}"></i><span class="dy-genre-name">${esc(g)}</span><span class="dy-genre-pct">${Math.round(n / known * 100)}%</span></li>`).join('');
  const cover = Math.round(known / plays.length * 100);
  return `
      <div class="dy-genres">
        <svg class="dy-donut" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${arcs}</svg>
        <div class="ns-x-text">
          <span class="ns-x-title">${esc(t('dy_genre_title'))}</span>
          <ul class="dy-genre-list">${legend}</ul>
          ${cover < 100 ? `<span class="dy-genre-note">${esc(t('dy_genre_cover', { pct: cover }))}</span>` : ''}
        </div>
      </div>`;
}

// ─── DAY PANEL (phase 2) ──────────────────────────────────────────────────
/* A card above the chart about the day on screen, moved over from the
   listening streak card's extras (renderNowStripExtra in app.js), which only
   ever describe today:
     - a ring of the day's plays against your usual day (the average over the
       days you listened in the 30 before it), with the day's first and last
       song and its top artist
     - the 7 days ending on it as bars, the day itself lit; click a bar to go
       to that day. Beside them the change on the 7 days before, and the song
       on repeat: the one played on the most of those 7 days (3 or more). */
function dyPanelHtml(h, ds) {
  const day = h.byDay[ds];
  const n = day ? day.plays : 0;

  // Your usual day, before this one
  let sum = 0, cnt = 0;
  for (let i = 1; i <= 30; i++) { const d = h.byDay[dyShift(ds, -i)]; if (d) { sum += d.plays; cnt++; } }
  const usual = cnt ? Math.round(sum / cnt) : 0;

  const songLine = (lbl, p) => p
    ? `<span class="ns-x-line" title="${esc(p.title + ' — ' + p.artist)}"><em>${esc(lbl)}</em> ${esc(p.title)} <span>— ${esc(p.artist)}</span></span>` : '';
  let top = null;
  if (day) for (const [a, e] of Object.entries(day.artists)) if (!top || e.count > top[1]) top = [a, e.count];
  const dayTitle = currentOffset === 0 ? t('dy_today') : currentOffset === 1 ? t('dy_yesterday') : dyDayName(ds);
  const dayBlock = `
    <div class="dy-pblock">
      ${nsRingSvg(n, usual)}
      <div class="ns-x-text">
        <span class="ns-x-title">${esc(dayTitle)}</span>
        <span class="ns-x-line"><b>${esc(tCount('plays', n))}</b>${usual ? ` <span>${esc(t('ns_x_usual', { n: usual.toLocaleString() }))}</span>` : ''}</span>
        ${day ? songLine(t('ns_x_first'), day.firstP) + (day.plays > 1 ? songLine(t('dy_last'), day.lastP) : '') : `<span class="ns-x-line"><span>${esc(t('dy_nothing_played'))}</span></span>`}
        ${top ? `<span class="ns-x-line"><em>${esc(t('ns_x_top'))}</em> ${esc(top[0])} <span>· ${esc(tCount('plays', top[1]))}</span></span>` : ''}
      </div>
    </div>`;

  // The 7 days ending on this one
  const week = [];
  let wSum = 0, pSum = 0;
  for (let i = 6; i >= 0; i--) { const d = dyShift(ds, -i); const c = (h.byDay[d] || {}).plays || 0; week.push({ ds: d, n: c }); wSum += c; }
  for (let i = 7; i < 14; i++) pSum += (h.byDay[dyShift(ds, -i)] || {}).plays || 0;
  const pct = pSum ? Math.round((wSum - pSum) / pSum * 100) : null;
  const max = Math.max(1, ...week.map(d => d.n));
  const lang = typeof currentLang !== 'undefined' ? currentLang : undefined;
  const today = localDateStr(tzNow());
  const bars = week.map(d => {
    const dt = dyDate(d.ds);
    const tip = dt.toLocaleDateString(lang, { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + tCount('plays', d.n);
    // Clicking a bar goes to that day (currentOffset counts days back from today)
    const off = Math.round((dyDate(today) - dt) / 86400000);
    return `<button type="button" class="ns-wk-col dy-wk-col${d.ds === ds ? ' is-today' : ''}" title="${esc(tip)}" onclick="dyGoOffset(${off})"><i style="height:${d.n ? Math.max(8, d.n / max * 100).toFixed(0) : 0}%"></i><small>${esc(dt.toLocaleDateString(lang, { weekday: 'narrow' }))}</small></button>`;
  }).join('');

  // On repeat: the song played on the most of these 7 days
  const songDays = {};
  for (const w of week) { const d = h.byDay[w.ds]; if (d) for (const k in d.songs) songDays[k] = (songDays[k] || 0) + 1; }
  let rep = null;
  for (const [k, c] of Object.entries(songDays)) if (c >= 3 && (!rep || c > rep[1])) rep = [k, c];
  let repLine = '';
  if (rep) {
    let info = null;
    for (const w of week) { const d = h.byDay[w.ds]; if (d && d.songs[rep[0]]) info = d.songs[rep[0]]; }
    repLine = `<span class="ns-x-line" title="${esc(info.title + ' — ' + info.artist)}"><em>${esc(t('ns_x_on_repeat'))}</em> ${esc(info.title)} <span>· ${esc(t('ns_x_days_of_7', { n: rep[1] }))}</span></span>`;
  }
  const pctHtml = pct === null ? '' :
    `<span class="ns-x-line"><span class="ns-wk-pct ${pct > 0 ? 'is-up' : pct < 0 ? 'is-down' : ''}">${pct > 0 ? '▲ ' : pct < 0 ? '▼ ' : '± '}${Math.abs(pct)}%</span> <span>${esc(t('ns_x_vs_week'))}</span></span>`;
  const weekBlock = `
    <div class="dy-pblock">
      <div class="ns-wk-bars">${bars}</div>
      <div class="ns-x-text">
        <span class="ns-x-title">${esc(t('ns_x_week'))}</span>
        <span class="ns-x-line"><b>${esc(tCount('plays', wSum))}</b></span>
        ${pctHtml}${repLine}
      </div>
    </div>`;

  return `<div class="dy-panel">${dayBlock}${weekBlock}</div>`;
}

// A bar in the panel: go to that day
function dyGoOffset(off) {
  if (off < 0) return;
  currentOffset = off;
  renderAll();
}

// The cover cell, the same markup the other charts use (so the picture picker works)
function dyThumb(imgId, label, type, prefKey, name, artist, album) {
  return `<div class="thumb-wrap ea-cover"><div id="${imgId}"><div class="thumb-initials">${esc(initials(label))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="${type}" data-prefkey="${esc(prefKey)}" data-name="${esc(name)}" data-artist="${esc(artist)}" data-album="${esc(album)}">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div>`;
}

// "12 Oct": nsShortDate() lives in app.js; fall back to the full date if it is missing
function nsShortDateSafe(ds) {
  return typeof nsShortDate === 'function' ? nsShortDate(ds) : fmt(dyDate(ds));
}

// ─── CONTROLS ─────────────────────────────────────────────────────────────

function dySetCompare(v) {
  dyCompare = v === 'weekday' ? 'weekday' : 'yesterday';
  try { localStorage.setItem('dc_daily_compare', dyCompare); } catch (e) {}
  if (currentPeriod === 'day') dyRender();
}

function dySetSize(n) {
  if (!DY_SIZES.includes(n)) return;
  dySize = n;
  try { localStorage.setItem('dc_daily_size', String(n)); } catch (e) {}
  if (currentPeriod === 'day') dyRender();
}

// The date picker: jump straight to a day
document.addEventListener('DOMContentLoaded', () => {
  const dp = document.getElementById('dayPicker');
  if (!dp) return;
  dp.addEventListener('change', e => {
    if (!e.target.value) return;
    const today = dyDate(localDateStr(tzNow()));
    const offset = Math.round((today - dyDate(e.target.value)) / 86400000);
    if (offset >= 0) { currentOffset = offset; renderAll(); }
  });
});
