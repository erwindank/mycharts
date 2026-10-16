/* ===========================================================================
   DAILY CHART — the Daily tab, before Weekly (phase 1, 2026-10-16)
   ===========================================================================
   One day's listening as a chart, with its own stats.

   What is here (phase 1 of the plan in the project notes):
     - the tab and day-by-day navigation: the shared date bar's ‹ › arrows and
       a date picker (#dayPicker) move one day at a time; currentOffset counts
       days back from today while currentPeriod === 'day'
     - top songs, artists and albums for the day, sized in each chart's
       ⋮ → Size like the other periods (chartSizeSongsD / ArtistsD / AlbumsD)
     - movement against a comparison day: yesterday, or the same weekday last
       week (▲3, ▼2, NEW, RE)
     - days on the daily chart this month, the peak (rank and date), and the
       daily #1 line ("#1 for 3 days in a row · 5 days at #1 this month")
     - the four stat tiles in #statsStrip, each against the comparison day,
       with first-ever plays, the day's share of its week and how the day
       ranks against every other day and every other same weekday

   Phase 1 drew its own table; since phase 9 the chart itself goes through
   the same sections and row builder as every other period (see RENDER
   below), so its ⋮ settings match. This file still works out the day's
   history (dyHistory), its stats in the shape the charts read, and
   everything around the chart.

   Daily charts are built from allPlays alone, so they work the same for
   Last.fm, Google Sheets and CSV uploads.

   Ties: two songs on the same count never share a rank. They are ordered the
   way the weekly chart orders them: whoever was on the previous day's chart
   first (by its rank there), then a re-entry, then a debut, then whoever got
   to the count first that day.
   =========================================================================== */

const DY_DAY_KEYS = ['day_sunday', 'day_monday', 'day_tuesday', 'day_wednesday', 'day_thursday', 'day_friday', 'day_saturday'];

/* The day's chart size, per chart: chartSizeSongsD / ArtistsD / AlbumsD in
   app.js, set from each chart's ⋮ → Size like the other periods. */
function dySizeOf(type) {
  const v = type === 'artists' ? chartSizeArtistsD : type === 'albums' ? chartSizeAlbumsD : chartSizeSongsD;
  return isFinite(v) && v > 0 ? v : 20;
}

// What the movement column compares against, remembered per browser
let dyCompare = (() => {
  try { return localStorage.getItem('dc_daily_compare') === 'weekday' ? 'weekday' : 'yesterday'; } catch (e) { return 'yesterday'; }
})();

let _dyHist = null;   // { gen, days, byDay, charts, timed } — see dyHistory()

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
   before's chart, which is why it runs in order). Only each chart's Daily
   size is kept. Cached until the plays, a chart size or the album settings
   change. Ties end on the first play met in allPlays (newest first), the
   same "firstAchieved" the weekly sort (rankSortWithStatus) uses, so a
   day's ranks here and on screen agree. */
function dyHistory() {
  const gen = [_stampEpoch, _playsVersion, _releaseEpoch, dySizeOf('songs'), dySizeOf('artists'), dySizeOf('albums'), albumsFilterBucket() || '', singleRollupLevel()].join('|');
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
    s.count++;
    s._albums[p.album] = (s._albums[p.album] || 0) + 1;
    for (const a of p.artists) {
      const e = d.artists[a] || (d.artists[a] = { count: 0, first: ms, songs: new Set() });
      e.count++;
      e.songs.add(p.title);
    }
    // Albums are credited the way the albums chart credits them (singles rolled up, buckets)
    tallyAlbumPlay(d.albums, p, roll, () => ({ count: 0, first: ms }));
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
      const top = rows.slice(0, dySizeOf(type)).map((r, i) => ({ k: r.k, rank: i + 1, count: r.count }));
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
/* Since phase 9 the Daily chart is the real chart: renderAll() runs as for any
   period (date bar, size groups, cert reel, Songs / Artists / Albums switch)
   and hands over to dyRenderAll() just before the stats, which:
     - fills the stat tiles (#statsStrip) with the day's own tiles
     - fills #dailyView above the chart: the day panel, your day, the compare
       switch, the actions and the daily #1 line
     - renders the day's charts into the same #songsSection / #artistsSection /
       #albumsSection as every other period (renderSongs and co., with the
       day's stats in the weekly shape), so ⋮ → Show / Size / Actions, cert
       badges, scores, peak tags, plays peaks, ▶ / ⋮, the chart-run panel,
       New Entries and Animate chart all behave as on Weekly. Bubbling Under
       and Off the Chart stay weekly-only, as on Monthly.
     - fills #dailyBottom under the chart: time of day, patterns, memories,
       milestones & goals */

// For callers that just want the Daily tab redrawn (compare switch, diary sync…)
function dyRender() {
  if (currentPeriod === 'day') renderAll();
}

function dyRenderAll(plays, start, end) {
  const h = dyHistory();
  const ds = dyViewedDay();

  // Nothing before your first play
  const first = h.days[0] || null;
  const prevDis = !first || ds <= first;
  document.getElementById('prevBtn').disabled = prevDis;
  document.querySelector('.swipe-arrow-right')?.classList.toggle('swipe-arrow-off', prevDis);

  ['statsStrip2', 'statsStrip3'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
  const ati = document.getElementById('atInsights'); if (ati) ati.hidden = true;
  document.getElementById('statsStrip').style.display = '';
  dyRenderTiles(h, ds);
  dyRenderTop(h, ds);

  const { stats, peaks } = dyPublishForShare(h, ds);
  renderTableHeaders();

  if (!plays.length) {
    ['songsBody', 'artistsBody', 'albumsBody'].forEach(id => {
      document.getElementById(id).innerHTML = `<tr><td colspan="8"><div class="empty-state"><p>${t('empty_no_plays')}</p></div></td></tr>`;
    });
    ['songsPagination', 'artistsPagination', 'albumsPagination'].forEach(id => { document.getElementById(id).style.display = 'none'; });
    COLLAPSE_ALL_TYPES.forEach(hideOffSection);
    NEW_ENTRY_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    dyRenderBottom(h, ds);
    dySyncLive();
    return;
  }

  // What the shared row builder (_chartItem) reads besides the stats
  lastPeaks = peaks;
  lastPeriodStats = stats;
  cumulativeMaps = buildCumulativeMapsForPeriod(end);
  playsPeakMaps = dyPlaysPeakMaps(h, ds);
  chartRunData = null;
  allChartRun = {};
  allChartRunIsFullHistory = false;
  buChartRunData = null;

  ['songsPagination', 'artistsPagination', 'albumsPagination'].forEach(id => { document.getElementById(id).style.display = 'none'; });
  const sizeS = dySizeOf('songs'), sizeA = dySizeOf('artists'), sizeB = dySizeOf('albums');
  document.querySelector('#songsSectionTitle .section-title-text').textContent   = t('sec_songs_top',   { n: sizeS }).replace(/^[★♦◈]\s*/, '');
  document.querySelector('#artistsSectionTitle .section-title-text').textContent = t('sec_artists_top', { n: sizeA }).replace(/^[★♦◈]\s*/, '');
  document.querySelector('#albumsSectionTitle .section-title-text').textContent  = t('sec_albums_top',  { n: sizeB }).replace(/^[★♦◈]\s*/, '');
  retitleAlbumsSectionForFilter();

  // Animate chart: from the comparison day's chart to this one
  const cmp = h.byDay[dyCompareDay(ds)];
  _animPrevPlays = cmp && cmp.list.length ? cmp.list : null;
  _animCurrentPlays = _animPrevPlays ? plays : null;
  chartSize = sizeS; renderSongs(plays, peaks, stats);
  chartSize = sizeA; renderArtists(plays, peaks, stats);
  chartSize = sizeB; renderAlbums(plays, peaks, stats);
  _animPrevPlays = null;
  _animCurrentPlays = null;

  renderNewEntries(plays, start, end);
  updateSubChartToggleBarAvailability();
  applySubChartToggles();
  updateExportBtn();
  updateShareBtns();
  updateChartExportBtns();
  dyRenderBottom(h, ds);
  dySyncLive();   // 2-minute Last.fm top-up while today is on screen (phase 8)
}

/* "As many plays in one day as on any day before": each key's best day up to
   and including this one, for the Plays Peak badge (_chartItem). */
function dyPlaysPeakMaps(h, ds) {
  const out = { songs: {}, artists: {}, albums: {} };
  const day = h.byDay[ds];
  if (!day) return out;
  for (const d of h.days) {
    if (d > ds) break;
    const x = h.byDay[d];
    for (const type of ['songs', 'artists', 'albums']) {
      const tgt = out[type];
      for (const k in day[type]) {
        const e = x[type][k];
        if (e && e.count > (tgt[k] || 0)) tgt[k] = e.count;
      }
    }
  }
  return out;
}

// ─── TOP AND BOTTOM ───────────────────────────────────────────────────────

/* Above the chart: the day panel, your day, the compare switch, the actions
   and the daily #1 line for the chart on screen. Also called on its own when
   the Songs / Artists / Albums switch changes (applyChartTypeView). */
function dyRenderTop(h, ds) {
  const view = document.getElementById('dailyView');
  if (!view) return;
  const type = ['songs', 'artists', 'albums'].includes(chartTypeView) ? chartTypeView : 'songs';

  // What the movement column compares against (the chart size is in ⋮ → Size)
  const cmpBtn = (v, lbl) => `<button type="button" class="dy-seg-btn${dyCompare === v ? ' active' : ''}" onclick="dySetCompare('${v}')">${esc(lbl)}</button>`;
  const toolbar = `
    <div class="dy-toolbar">
      <div class="dy-seg" role="group" aria-label="${esc(t('dy_compare_label'))}">
        ${cmpBtn('yesterday', t('dy_vs_yesterday'))}${cmpBtn('weekday', t('dy_vs_weekday', { day: dyDayName(ds) }))}
      </div>
    </div>`;

  // The daily #1 line
  const no1 = dyNo1Facts(h, type, ds);
  let no1Html = '';
  if (no1) {
    const bits = [no1.run > 1 ? t('dy_no1_run', { n: no1.run }) : t('dy_no1_today')];
    if (no1.month > 1) bits.push(t('dy_no1_month', { n: no1.month }));
    no1Html = `<p class="dy-no1"><span class="dy-no1-crown" aria-hidden="true">♛</span>${esc(bits.join(' · '))}</p>`;
  }

  // A live redraw must not throw away a note being typed: keep its text,
  // caret and focus across the innerHTML swap (phase 8)
  const ae = document.activeElement;
  const keepNote = ae && ae.id === 'dyNote' ? { v: ae.value, s: ae.selectionStart, e: ae.selectionEnd } : null;

  view.innerHTML = `
    ${dyPanelHtml(h, ds)}
    ${dyDiaryHtml(ds)}
    ${toolbar}
    ${dyActionsHtml(type, (h.charts.songs[ds] || []).length)}
    ${no1Html}`;

  if (keepNote) {
    const n = document.getElementById('dyNote');
    if (n) { n.value = keepNote.v; n.focus(); n.setSelectionRange(keepNote.s, keepNote.e); }
  }
}

// Under the chart: time of day, patterns, memories, milestones & goals
function dyRenderBottom(h, ds) {
  const el = document.getElementById('dailyBottom');
  if (!el) return;
  // Time of day (phase 3): collects its covers into todImgs to load below
  const todImgs = [];
  el.innerHTML = `
    ${dyTimeOfDayHtml(h, ds, todImgs)}
    ${dyPatternsHtml(h, ds)}
    ${dyMemoriesHtml(h, ds)}
    ${dyMilestonesHtml(h, ds)}`;
  for (const tp of ['album', 'song']) {
    const items = todImgs.filter(x => x.type === tp).map(x => x.item);
    if (items.length) loadImages(items, tp);
  }
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

// ─── PERSONAL & LIVE (phase 8) ────────────────────────────────────────────
/* Three things:
     - Your day: a mood (one emoji) and a short note for the day on screen.
       Kept in localStorage (dc_daily_diary) and, when signed in, in the
       Firestore document users/{uid}/data/diary (dcSaveDiary / dcLoadDiary in
       firebase.js). That path is already covered by the users/{uid}/data rule
       in firestore.rules, so no new rules are needed. Merged per day by
       last-edited time (dcMergeDiary, called on sign-in), the way ratings are;
       a cleared day keeps an empty entry with its time so the clear wins.
       Account backups carry it too (_backupCollect / _backupApply in app.js).
     - Calendar: a month grid of daily #1 covers, with each day's mood; click a
       day to open it (dyOpenCalendar).
     - Live: while you look at today and the source is Last.fm, new scrobbles
       are fetched every 2 minutes (pollLastFm, one page, the same call as the
       30-minute background poll) and the page redraws itself. */
const DY_MOODS = ['😄', '🙂', '😐', '😔', '😢', '😤', '🥳', '😴'];
const DY_MOOD_KEYS = ['great', 'good', 'okay', 'low', 'sad', 'stressed', 'party', 'tired'];
const DY_NOTE_MAX = 500;
const DY_LIVE_MS = 2 * 60 * 1000;

let _dyDiary = (() => {
  try { const d = JSON.parse(localStorage.getItem('dc_daily_diary') || 'null'); if (d && d.days) return d; } catch (e) {}
  return { v: 1, days: {} };
})();
let _dyDiaryTimer = null;
let _dyLiveTimer = null;

function dyDiaryGet(ds) {
  const e = _dyDiary.days[ds];
  return e && (e.note || e.mood) ? e : null;
}

// Saves locally now and to the account shortly after, so typing is not a write per key
function dyDiarySet(ds, patch) {
  const cur = _dyDiary.days[ds] || { note: '', mood: '' };
  _dyDiary.days[ds] = Object.assign({}, cur, patch, { ts: Date.now() });
  try { localStorage.setItem('dc_daily_diary', JSON.stringify(_dyDiary)); } catch (e) {}
  clearTimeout(_dyDiaryTimer);
  _dyDiaryTimer = setTimeout(dyDiaryPush, 800);
  dyDiaryStatus(t('dy_diary_saving'));
}

async function dyDiaryPush() {
  const signedIn = typeof dcIsSignedIn === 'function' && dcIsSignedIn();
  if (signedIn && typeof dcSaveDiary === 'function') await dcSaveDiary(_dyDiary);
  dyDiaryStatus(signedIn ? t('dy_diary_saved') : t('dy_diary_saved_local'));
}

function dyDiaryStatus(msg) {
  const el = document.querySelector('#dailyView .dy-diary-status');
  if (el) el.textContent = msg;
}

// Sign-in: take whichever side edited each day last, then push the result
function dcMergeDiary(remote) {
  let changed = false;
  const rem = remote && remote.days ? remote.days : {};
  for (const [ds, e] of Object.entries(rem)) {
    const mine = _dyDiary.days[ds];
    if (!mine || (e.ts || 0) > (mine.ts || 0)) { _dyDiary.days[ds] = e; changed = true; }
  }
  try { localStorage.setItem('dc_daily_diary', JSON.stringify(_dyDiary)); } catch (e) {}
  if (Object.keys(_dyDiary.days).length && typeof dcSaveDiary === 'function') dcSaveDiary(_dyDiary);
  if (changed && currentPeriod === 'day' && allPlays && allPlays.length) dyRender();
}
window.dcMergeDiary = dcMergeDiary;

// firebase.js merges on sign-in, but sign-in can settle before this file has
// run, when dcMergeDiary did not exist yet. Catch up once the page is loaded.
document.addEventListener('DOMContentLoaded', () => {
  if (typeof dcIsSignedIn === 'function' && dcIsSignedIn() && typeof dcLoadDiary === 'function') {
    dcLoadDiary().then(dcMergeDiary).catch(() => {});
  }
});

function dySetMood(m) {
  const ds = dyViewedDay();
  const cur = _dyDiary.days[ds];
  // The same emoji again clears it
  dyDiarySet(ds, { mood: cur && cur.mood === m ? '' : m });
  document.querySelectorAll('#dailyView .dy-mood').forEach(b => b.classList.toggle('active', b.dataset.mood === (_dyDiary.days[ds].mood || '')));
}

function dyNoteInput(el) {
  dyDiarySet(dyViewedDay(), { note: el.value.slice(0, DY_NOTE_MAX) });
  const c = document.querySelector('#dailyView .dy-note-count');
  if (c) c.textContent = el.value.length + ' / ' + DY_NOTE_MAX;
}

function dyDiaryHtml(ds) {
  const e = _dyDiary.days[ds] || {};
  const signedIn = typeof dcIsSignedIn === 'function' && dcIsSignedIn();
  const moods = DY_MOODS.map((m, i) =>
    `<button type="button" class="dy-mood${e.mood === m ? ' active' : ''}" data-mood="${m}" onclick="dySetMood('${m}')" title="${esc(t('dy_mood_' + DY_MOOD_KEYS[i]))}" aria-label="${esc(t('dy_mood_' + DY_MOOD_KEYS[i]))}" aria-pressed="${e.mood === m}">${m}</button>`).join('');
  const note = e.note || '';
  return `
    <section class="dy-tod dy-diary" aria-label="${esc(t('dy_diary_title'))}">
      <div class="dy-tod-head">
        <span class="ns-x-title">${esc(t('dy_diary_title'))}</span>
        <span class="dy-diary-status">${esc(signedIn ? '' : t('dy_diary_local_hint'))}</span>
      </div>
      <div class="dy-moods" role="group" aria-label="${esc(t('dy_mood_label'))}">${moods}</div>
      <div class="dy-note-wrap">
        <textarea class="dy-note" id="dyNote" rows="2" maxlength="${DY_NOTE_MAX}" placeholder="${esc(t('dy_note_ph'))}" oninput="dyNoteInput(this)">${esc(note)}</textarea>
        <span class="dy-note-count">${note.length} / ${DY_NOTE_MAX}</span>
      </div>
    </section>`;
}

// ─── CALENDAR ─────────────────────────────────────────────────────────────
let _dyCal = null;   // { y, m } of the month on show

function dyOpenCalendar() {
  const d = dyDate(dyViewedDay());
  _dyCal = { y: d.getFullYear(), m: d.getMonth() };
  let el = document.getElementById('dyCalendar');
  if (!el) {
    el = document.createElement('div');
    el.id = 'dyCalendar';
    el.className = 'dy-recap dy-cal-layer';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.addEventListener('click', e => { if (e.target === el) dyCloseCalendar(); });
    document.body.appendChild(el);
  }
  document.addEventListener('keydown', dyCalKeys);
  document.body.classList.add('dy-recap-open');
  dyRenderCalendar();
}

function dyCloseCalendar() {
  const el = document.getElementById('dyCalendar');
  if (el) el.remove();
  document.removeEventListener('keydown', dyCalKeys);
  document.body.classList.remove('dy-recap-open');
}

function dyCalKeys(e) {
  if (e.key === 'Escape') dyCloseCalendar();
  else if (e.key === 'ArrowLeft') dyCalMove(-1);
  else if (e.key === 'ArrowRight') dyCalMove(1);
}

function dyCalMove(n) {
  if (!_dyCal) return;
  const h = dyHistory();
  const first = h.days[0] ? dyDate(h.days[0]) : new Date();
  const now = tzNow();
  const d = new Date(_dyCal.y, _dyCal.m + n, 1);
  if (d > new Date(now.getFullYear(), now.getMonth(), 1) || d < new Date(first.getFullYear(), first.getMonth(), 1)) return;
  _dyCal = { y: d.getFullYear(), m: d.getMonth() };
  dyRenderCalendar();
}

function dyRenderCalendar() {
  const el = document.getElementById('dyCalendar');
  if (!el || !_dyCal) return;
  const h = dyHistory();
  const { y, m } = _dyCal;
  const lang = typeof currentLang !== 'undefined' ? currentLang : undefined;
  const today = localDateStr(tzNow());
  const viewed = dyViewedDay();
  const daysIn = new Date(y, m + 1, 0).getDate();
  const lead = (new Date(y, m, 1).getDay() - weekStartDay + 7) % 7;
  const heads = Array.from({ length: 7 }, (_, i) => new Date(2023, 0, 1 + ((weekStartDay + i) % 7)).toLocaleDateString(lang, { weekday: 'narrow' }));
  const imgs = { album: [], song: [] };
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push('<span class="dy-cal-cell is-pad"></span>');
  for (let dnum = 1; dnum <= daysIn; dnum++) {
    const ds = `${y}-${String(m + 1).padStart(2, '0')}-${String(dnum).padStart(2, '0')}`;
    const day = h.byDay[ds];
    const top = (h.charts.songs[ds] || [])[0];
    const diary = dyDiaryGet(ds);
    const future = ds > today;
    let art = '', tip = fmt(dyDate(ds));
    if (top && day) {
      const s = day.songs[top.k];
      const album = bestAlbum(s.title, s._albums);
      const imgId = 'dycal-' + dnum;
      const hasAlbum = album && album !== '—';
      (hasAlbum ? imgs.album : imgs.song).push(hasAlbum
        ? { imgId, album, name: album, artist: s.artist, prefKey: 'album:' + s.artist.toLowerCase() + '|||' + album.toLowerCase() }
        : { imgId, title: s.title, name: s.title, artist: s.artist, album: '', prefKey: 'song:' + s.artist.toLowerCase() + '|||' + s.title.toLowerCase() });
      art = `<span class="dy-cal-art" id="${imgId}"></span>`;
      tip += '\n#1 ' + s.title + ' — ' + s.artist + '\n' + tCount('plays', day.plays);
    }
    if (diary && diary.note) tip += '\n“' + diary.note.slice(0, 120) + '”';
    const off = Math.round((dyDate(today) - dyDate(ds)) / 86400000);
    cells.push(`<button type="button" class="dy-cal-cell${day ? ' has-plays' : ''}${ds === viewed ? ' is-viewed' : ''}${ds === today ? ' is-today' : ''}" ${future ? 'disabled' : `onclick="dyCloseCalendar();dyGoOffset(${off})"`} title="${esc(tip)}">
        ${art}<span class="dy-cal-num">${dnum}</span>
        ${diary && diary.mood ? `<span class="dy-cal-mood">${diary.mood}</span>` : ''}
        ${diary && diary.note ? '<span class="dy-cal-note" aria-hidden="true"></span>' : ''}
      </button>`);
  }
  const title = new Date(y, m, 1).toLocaleDateString(lang, { month: 'long', year: 'numeric' });
  el.setAttribute('aria-label', t('dy_cal_title') + ' · ' + title);
  el.innerHTML = `
    <div class="dy-cal-card">
      <div class="dy-cal-head">
        <button type="button" class="dy-cal-nav" onclick="dyCalMove(-1)" aria-label="${esc(t('btn_prev'))}">‹</button>
        <span class="dy-cal-title">${esc(title)}</span>
        <button type="button" class="dy-cal-nav" onclick="dyCalMove(1)" aria-label="${esc(t('btn_next'))}">›</button>
        <button type="button" class="dy-rc-x dy-cal-x" onclick="dyCloseCalendar()" aria-label="${esc(t('dy_rc_close'))}">×</button>
      </div>
      <div class="dy-cal-grid">
        ${heads.map(x => `<span class="dy-cal-wd">${esc(x)}</span>`).join('')}
        ${cells.join('')}
      </div>
      <p class="dy-cal-hint">${esc(t('dy_cal_hint'))}</p>
    </div>`;
  if (imgs.album.length) loadImages(imgs.album, 'album');
  if (imgs.song.length) loadImages(imgs.song, 'song');
}

// ─── LIVE ─────────────────────────────────────────────────────────────────
function dyIsLive() {
  return currentPeriod === 'day' && currentOffset === 0 &&
    typeof getDataSource === 'function' && getDataSource() === 'lastfm' &&
    typeof getLastFmUser === 'function' && !!getLastFmUser();
}

// Called on every Daily render: starts the 2-minute top-up on today, stops it elsewhere
function dySyncLive() {
  if (!dyIsLive()) { clearInterval(_dyLiveTimer); _dyLiveTimer = null; return; }
  if (_dyLiveTimer) return;
  _dyLiveTimer = setInterval(() => {
    if (!dyIsLive()) { clearInterval(_dyLiveTimer); _dyLiveTimer = null; return; }
    if (!document.hidden && typeof pollLastFm === 'function') pollLastFm();
  }, DY_LIVE_MS);
}

function dyLiveBadge() {
  if (!dyIsLive()) return '';
  const when = typeof lastSyncTime !== 'undefined' && lastSyncTime ? lastSyncTime.toLocaleTimeString(typeof currentLang !== 'undefined' ? currentLang : undefined, { hour: '2-digit', minute: '2-digit' }) : '';
  return `<span class="dy-live" title="${esc(t('dy_live_tip'))}"><i aria-hidden="true"></i>${esc(t('dy_live'))}${when ? ` <span>· ${esc(t('dy_live_updated', { time: when }))}</span>` : ''}</span>`;
}

// ─── SHARING (phase 7) ────────────────────────────────────────────────────
/* Three ways to take a day with you, in a row under the chart toolbar:
     - Share image: the same designer as the other charts (openIgPreviewModal
       in app.js, every template, palette and format). dyPublishForShare()
       builds the day's stats in the shape the weekly chart leaves them
       (lastPeriodStats / lastPeaks); the chart renderers fill fullData.
     - Play top N: the day's top songs into the YouTube player queue, the
       same as Play all on the weekly chart. Save as playlist keeps them under
       Playlists ("Daily chart · 16 Oct 2026").
     - Recap: a short full-screen story of the day, one slide at a time
       (dyOpenRecap below). */

// Puts the viewed day's charts where the share designer reads them
function dyPublishForShare(h, ds) {
  const day = h.byDay[ds];
  const cmp = dyCompareDay(ds);
  const stats = { prevChart: { songs: {}, artists: {}, albums: {} }, everChartedBefore: { songs: new Set(), artists: new Set(), albums: new Set() }, periodsOnChart: { songs: {}, artists: {}, albums: {} } };
  const peaks = { songPeakMap: {}, artistPeakMap: {}, albumPeakMap: {} };
  const peakKey = { songs: 'songPeakMap', artists: 'artistPeakMap', albums: 'albumPeakMap' };
  for (const type of ['songs', 'artists', 'albums']) {
    const chart = h.charts[type][ds] || [];
    for (const r of h.charts[type][cmp] || []) stats.prevChart[type][r.k] = { rank: r.rank, count: r.count };
    const facts = dyEntryFacts(h, type, ds);
    for (const r of chart) {
      const f = facts[r.k] || {};
      if (f.before) stats.everChartedBefore[type].add(r.k);
      stats.periodsOnChart[type][r.k] = f.monthDays || 1;
      if (f.peak && isFinite(f.peak)) peaks[peakKey[type]][r.k] = f.peak;
    }
    fullData[type] = !day ? [] : chart.map(r => {
      if (type === 'songs') { const s = day.songs[r.k]; return { title: s.title, artist: s.artist, album: bestAlbum(s.title, s._albums), count: r.count, firstAchieved: s.first }; }
      if (type === 'artists') return { name: r.k, count: r.count, songs: day.artists[r.k] ? day.artists[r.k].songs : new Set() };
      const i = r.k.lastIndexOf('|||');
      return { album: i < 0 ? r.k : r.k.slice(0, i), artist: i < 0 ? '' : r.k.slice(i + 3), count: r.count };
    });
  }
  lastPeriodStats = stats;
  lastPeaks = peaks;
  return { stats, peaks };
}

// The day's songs in chart order, for the player and playlists
function dyTopSongs(h, ds) {
  const day = h.byDay[ds];
  return (h.charts.songs[ds] || []).map(r => { const s = day.songs[r.k]; return { title: s.title, artist: s.artist, album: bestAlbum(s.title, s._albums) }; });
}

function dyPlayTop() {
  const songs = dyTopSongs(dyHistory(), dyViewedDay());
  if (!songs.length) return;
  const [first, ...rest] = songs;
  openYtPlayer(first.title, first.artist, first.album, null);
  rest.forEach(s => _ytQueue.push({ title: s.title, artist: s.artist, album: s.album, btn: null }));
  _ytUpdateQueueDisplay();
  _ytSaveQueue();
}

function dySavePlaylist() {
  const ds = dyViewedDay();
  const songs = dyTopSongs(dyHistory(), ds);
  if (!songs.length) return;
  const name = t('dy_pl_name', { date: fmt(dyDate(ds)) });
  _ytPlaylists[name] = songs;
  _ytTouchPlaylist(name);
  _ytSavePlaylists();
  _ytRenderPlaylists();
  if (typeof dcPlToast === 'function') dcPlToast(t('dy_pl_saved', { name }));
}

// type: the chart on screen (what Share image draws); nSongs: the day's song
// chart length (what Play and Save use, whichever chart is on screen)
/* Export playlist: the shared export window (openExportModal in app.js) —
   copy or download the day's songs as "Artist - Title" lines and import them
   in Soundiiz into Spotify, Apple Music, YouTube Music, Deezer… It reads
   fullData.songs, which dyPublishForShare() has filled with the day's songs
   chart whichever chart is on screen. */
function dyExportPlaylist() {
  if (typeof openExportModal === 'function') openExportModal();
}

function dyActionsHtml(type, nSongs) {
  const off = nSongs ? '' : ' disabled';
  return `
    <div class="dy-actions">
      <button type="button" class="dy-act dy-act-main" onclick="dyOpenRecap()"${off}>✦ ${esc(t('dy_recap'))}</button>
      <button type="button" class="dy-act" onclick="openIgPreviewModal('${type}')"${off}>📷 ${esc(t('dy_share_img'))}</button>
      <button type="button" class="dy-act" onclick="dyPlayTop()"${off}>▶ ${esc(t('dy_play_top', { n: nSongs }))}</button>
      <button type="button" class="dy-act" onclick="dyOpenCalendar()">📅 ${esc(t('dy_cal_title'))}</button>
      <button type="button" class="dy-act" onclick="dySavePlaylist()"${off}>＋ ${esc(t('dy_save_pl'))}</button>
      <button type="button" class="dy-act" onclick="dyExportPlaylist()"${off} title="${esc(t('dy_export_tip'))}">📤 ${esc(t('dy_export'))}</button>
    </div>`;
}

// ─── RECAP STORY ──────────────────────────────────────────────────────────
/* A full-screen story of the day, Wrapped style: progress bars across the
   top, one slide at a time, moving on by itself every 6 seconds. Tap or click
   the right side (or →) for the next slide, the left side (or ←) to go back,
   Esc or × to close; hovering or holding pauses it. Slides: the day in plays,
   the #1 song, the top artist, when you listened (or how varied it was, for
   date-only plays), the highlights, and an end slide with Share image and
   Play. Covers come from getArtAuto, the same lookup as the rest of the app. */
const DY_RECAP_MS = 6000;
let _dyRc = null;   // { slides, i, timer, started, paused, el }

function dyRecapSlides(h, ds) {
  const day = h.byDay[ds];
  if (!day) return [];
  const slides = [];
  const dayName = dyDayName(ds);

  // 1. The day in numbers, against your usual day
  let sum = 0, cnt = 0;
  for (let i = 1; i <= 30; i++) { const d = h.byDay[dyShift(ds, -i)]; if (d) { sum += d.plays; cnt++; } }
  const usual = cnt ? sum / cnt : 0;
  const pct = usual ? Math.round((day.plays - usual) / usual * 100) : null;
  const vs = pct === null ? '' : Math.abs(pct) < 5 ? t('dy_rc_same') : t(pct > 0 ? 'dy_rc_up' : 'dy_rc_down', { pct: Math.abs(pct) });
  slides.push({ cls: 'is-intro', html: `
    <p class="dy-rc-kicker">${esc(t('dy_rc_intro', { day: dayName }))}</p>
    <p class="dy-rc-date">${esc(fmt(dyDate(ds)))}</p>
    <p class="dy-rc-big">${day.plays.toLocaleString()}</p>
    <p class="dy-rc-label">${esc(tUnit('plays', day.plays))}</p>
    <p class="dy-rc-line">${esc(t('dy_rc_counts', { s: tCount('songs', Object.keys(day.songs).length), a: tCount('artists', Object.keys(day.artists).length) }))}</p>
    ${vs ? `<p class="dy-rc-line is-dim">${esc(vs)}</p>` : ''}` });

  // 2. The #1 song
  const s1 = (h.charts.songs[ds] || [])[0];
  if (s1) {
    const s = day.songs[s1.k];
    const album = bestAlbum(s.title, s._albums);
    slides.push({ cls: 'is-song', art: { type: album && album !== '—' ? 'album' : 'song', name: album && album !== '—' ? album : s.title, artist: s.artist, album }, html: `
      <p class="dy-rc-kicker">${esc(t('dy_rc_no1'))}</p>
      <div class="dy-rc-cover"></div>
      <p class="dy-rc-title">${esc(s.title)}</p>
      <p class="dy-rc-line">${esc(s.artist)}</p>
      <p class="dy-rc-line is-accent">${esc(tCount('plays', s1.count))}</p>` });
  }

  // 3. The top artist
  const a1 = (h.charts.artists[ds] || [])[0];
  if (a1) {
    const share = Math.round(a1.count / day.plays * 100);
    slides.push({ cls: 'is-artist', art: { type: 'artist', name: a1.k }, html: `
      <p class="dy-rc-kicker">${esc(t('dy_rc_artist'))}</p>
      <div class="dy-rc-cover is-round"></div>
      <p class="dy-rc-title">${esc(a1.k)}</p>
      <p class="dy-rc-line is-accent">${esc(tCount('plays', a1.count))}</p>
      <p class="dy-rc-line is-dim">${esc(t('dy_rc_share', { pct: share }))}</p>` });
  }

  // 4. When you listened (or, with date-only plays, how varied the day was)
  if (h.timed) {
    const hours = new Array(24).fill(0);
    for (const p of day.list) hours[tzDateOf(p).getHours()]++;
    let busy = 0;
    for (let i = 1; i < 24; i++) if (hours[i] > hours[busy]) busy = i;
    const max = Math.max(1, ...hours);
    const bars = hours.map((n, i) => `<i class="${i === busy ? 'is-busy' : ''}" style="height:${n ? Math.max(6, n / max * 100) : 2}%"></i>`).join('');
    slides.push({ cls: 'is-when', html: `
      <p class="dy-rc-kicker">${esc(t('dy_rc_when'))}</p>
      <div class="dy-rc-hours">${bars}</div>
      <p class="dy-rc-title">${esc(t('dy_rc_busiest', { hour: dyHourLabel(busy) }))}</p>
      <p class="dy-rc-line is-dim">${esc(tCount('plays', hours[busy]))}</p>` });
  } else {
    const v = Object.keys(day.songs).length / day.plays;
    const label = v >= 0.7 ? 'dy_var_explorer' : v <= 0.35 ? 'dy_var_loyal' : 'dy_var_mixed';
    slides.push({ cls: 'is-when', html: `
      <p class="dy-rc-kicker">${esc(t('dy_pat_variety'))}</p>
      <p class="dy-rc-title">${esc(t(label))}</p>
      <p class="dy-rc-line">${esc(t('dy_var_line', { songs: Object.keys(day.songs).length, plays: day.plays }))}</p>` });
  }

  // 5. Highlights: first-ever plays, the day's rank, and the #1 run
  if (!firstSeenMaps) firstSeenMaps = buildFirstSeenMaps();
  const newSongs = Object.keys(day.songs).filter(k => firstSeenMaps.songFirst[k] && localDateStr(firstSeenMaps.songFirst[k]) === ds).length;
  let rank = 1;
  for (const d of h.days) if (h.byDay[d].plays > day.plays) rank++;
  const no1 = dyNo1Facts(h, 'songs', ds);
  const hl = [];
  if (newSongs) hl.push(t('dy_rc_new', { n: newSongs }));
  hl.push(t('dy_rank_all_tip', { n: rank.toLocaleString(), total: h.days.length.toLocaleString() }));
  if (no1 && no1.run > 1) hl.push(t('dy_no1_run', { n: no1.run }));
  slides.push({ cls: 'is-high', html: `
    <p class="dy-rc-kicker">${esc(t('dy_rc_high'))}</p>
    <ul class="dy-rc-list">${hl.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` });

  // 6. The end: share or play it
  slides.push({ cls: 'is-end', html: `
    <p class="dy-rc-kicker">${esc(t('dy_rc_end'))}</p>
    <p class="dy-rc-title">${esc(fmt(dyDate(ds)))}</p>
    <div class="dy-rc-btns">
      <button type="button" class="dy-act dy-act-main" onclick="dyCloseRecap();openIgPreviewModal('songs')">📷 ${esc(t('dy_share_img'))}</button>
      <button type="button" class="dy-act" onclick="dyCloseRecap();dyPlayTop()">▶ ${esc(t('dy_play_top', { n: (h.charts.songs[ds] || []).length }))}</button>
    </div>` });
  return slides;
}

function dyOpenRecap() {
  const h = dyHistory(), ds = dyViewedDay();
  const slides = dyRecapSlides(h, ds);
  if (!slides.length) return;
  dyCloseRecap();
  const el = document.createElement('div');
  el.className = 'dy-recap';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', t('dy_recap'));
  el.innerHTML = `
    <div class="dy-rc-card">
      <div class="dy-rc-bars">${slides.map(() => '<span><i></i></span>').join('')}</div>
      <button type="button" class="dy-rc-x" aria-label="${esc(t('dy_rc_close'))}" title="${esc(t('dy_rc_close'))}">×</button>
      <div class="dy-rc-stage"></div>
      <button type="button" class="dy-rc-nav is-prev" aria-label="${esc(t('dy_rc_prev'))}"></button>
      <button type="button" class="dy-rc-nav is-next" aria-label="${esc(t('dy_rc_next'))}"></button>
    </div>`;
  document.body.appendChild(el);
  _dyRc = { slides, i: 0, timer: null, el, left: DY_RECAP_MS, at: 0, paused: false };
  el.querySelector('.dy-rc-x').onclick = dyCloseRecap;
  el.querySelector('.is-prev').onclick = () => dyRecapGo(_dyRc.i - 1);
  el.querySelector('.is-next').onclick = () => dyRecapGo(_dyRc.i + 1);
  el.addEventListener('click', e => { if (e.target === el) dyCloseRecap(); });
  const card = el.querySelector('.dy-rc-card');
  const pause = on => { if (!_dyRc || _dyRc.paused === on) return; _dyRc.paused = on; card.classList.toggle('is-paused', on); dyRecapTick(); };
  card.addEventListener('pointerenter', () => pause(true));
  card.addEventListener('pointerleave', () => pause(false));
  document.addEventListener('keydown', dyRecapKeys);
  document.body.classList.add('dy-recap-open');
  dyRecapGo(0);
  el.querySelector('.dy-rc-x').focus();
}

function dyRecapKeys(e) {
  if (!_dyRc) return;
  if (e.key === 'Escape') dyCloseRecap();
  else if (e.key === 'ArrowRight') { e.preventDefault(); dyRecapGo(_dyRc.i + 1); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); dyRecapGo(_dyRc.i - 1); }
}

function dyCloseRecap() {
  if (!_dyRc) return;
  clearTimeout(_dyRc.timer);
  _dyRc.el.remove();
  _dyRc = null;
  document.removeEventListener('keydown', dyRecapKeys);
  document.body.classList.remove('dy-recap-open');
}

function dyRecapGo(i) {
  const rc = _dyRc;
  if (!rc) return;
  if (i < 0) i = 0;
  if (i >= rc.slides.length) { dyCloseRecap(); return; }
  rc.i = i;
  const sl = rc.slides[i];
  const stage = rc.el.querySelector('.dy-rc-stage');
  stage.className = 'dy-rc-stage ' + sl.cls;
  stage.innerHTML = `<div class="dy-rc-slide">${sl.html}</div>`;
  rc.el.querySelectorAll('.dy-rc-bars > span').forEach((b, j) => {
    b.classList.toggle('is-done', j < i);
    b.classList.toggle('is-on', j === i);
  });
  // The slide's cover, once the lookup comes back
  if (sl.art && typeof getArtAuto === 'function') {
    const box = stage.querySelector('.dy-rc-cover');
    const a = sl.art;
    const p = a.type === 'artist' ? getArtAuto('artist', a.name) : a.type === 'album' ? getArtAuto('album', a.name, a.artist, a.album) : getArtAuto('song', a.name, a.artist);
    Promise.resolve(p).then(url => {
      if (url && box && box.isConnected) box.innerHTML = `<img src="${esc(typeof sizedArtUrl === 'function' ? sizedArtUrl(url, 600) : url)}" alt="">`;
    }).catch(() => {});
  }
  // The last slide waits for a choice; the others move on by themselves
  rc.left = i === rc.slides.length - 1 ? Infinity : DY_RECAP_MS;
  rc.at = performance.now();
  const bar = rc.el.querySelector('.dy-rc-bars > span.is-on i');
  if (bar) { bar.style.transition = 'none'; bar.style.width = '0%'; }
  dyRecapTick();
}

// (Re)starts the timer and the progress bar for whatever time the slide has left
function dyRecapTick() {
  const rc = _dyRc;
  if (!rc) return;
  clearTimeout(rc.timer);
  const bar = rc.el.querySelector('.dy-rc-bars > span.is-on i');
  if (rc.paused) {
    if (isFinite(rc.left)) rc.left = Math.max(0, rc.left - (performance.now() - rc.at));
    if (bar) { const w = getComputedStyle(bar).width; bar.style.transition = 'none'; bar.style.width = w; }
    return;
  }
  rc.at = performance.now();
  if (!isFinite(rc.left)) { if (bar) { bar.style.transition = 'none'; bar.style.width = '100%'; } return; }
  if (bar) {
    void bar.offsetWidth;
    bar.style.transition = `width ${rc.left}ms linear`;
    bar.style.width = '100%';
  }
  rc.timer = setTimeout(() => dyRecapGo(rc.i + 1), rc.left);
}

// ─── MILESTONES & GOALS (phase 6) ─────────────────────────────────────────
/* A card under Memories about what the day achieved and what is close:
     - daily awards: song, artist and album of the day (the daily #1s), the
       discovery of the day (the most played first-ever song) and the
       comeback of the day (the song back after the longest silence, 30+ days)
     - milestones hit: songs, artists and albums whose all-time play count
       crossed a round number that day (DY_MS lists)
     - records broken: your most plays of a song or artist in one day, beaten
       that day; and the most plays of any song / any artist in one day ever
     - streaks: songs and artists played on 3+ days in a row up to that day,
       and the ones whose run of 3+ days ended (not played that day)
     - goals: how far the day was from your best same weekday and your
       biggest day; close to a milestone (songs, artists, albums a few plays
       short of the next round number); and, on today only, streaks that end
       unless you play them today
   Certifications earned that day are the shared "Certified this period" reel
   further down (renderCertReel), the same plaques as on Weekly and Monthly. */
const DY_MS = {
  songs:   [25, 50, 100, 250, 500, 750, 1000, 1500, 2000, 3000, 5000],
  artists: [100, 250, 500, 1000, 2500, 5000, 7500, 10000, 15000, 20000, 25000, 50000],
  albums:  [100, 250, 500, 1000, 2500, 5000, 10000, 20000],
};

// The next round number above n for a type; past the list, steps of its last gap
function dyNextMs(type, n) {
  const list = DY_MS[type];
  const m = list.find(x => x > n);
  if (m) return m;
  const step = list[list.length - 1] - list[list.length - 2];
  return (Math.floor(n / step) + 1) * step;
}

// Every round number in (a, b]
function dyMsCrossed(type, a, b) {
  const out = [];
  for (let m = dyNextMs(type, a); m <= b; m = dyNextMs(type, m)) out.push(m);
  return out;
}

// How many days in a row, ending on `end`, a key was played (tally: 'songs' / 'artists' / 'albums')
function dyRunEnding(h, tally, k, end) {
  let n = 0;
  for (let d = end; h.byDay[d] && h.byDay[d][tally][k]; d = dyShift(d, -1)) n++;
  return n;
}

function dyMilestonesHtml(h, ds) {
  const day = h.byDay[ds];
  const blocks = [];
  const label = {
    songs: k => { const s = day.songs[k]; return s ? s.title + ' — ' + s.artist : k; },
    artists: k => k,
    albums: k => { const i = k.lastIndexOf('|||'); return i < 0 ? k : k.slice(0, i) + ' — ' + k.slice(i + 3); },
  };
  const row = (main, sub) => `<li class="dy-mem-row"><span class="dy-mem-text"><span class="ns-x-line" title="${esc(main)}"><b>${esc(main)}</b></span><span class="dy-mem-sub">${esc(sub)}</span></span></li>`;

  // ── Counts before the day and to its end, and each key's best single day before it ──
  const before = { songs: {}, artists: {}, albums: {} };
  const after = { songs: {}, artists: {}, albums: {} };
  const bestDay = { songs: {}, artists: {} };
  let anySongBest = 0, anyArtistBest = 0, bestWd = 0, bestAll = 0;
  const wd = dyDate(ds).getDay();
  for (const d of h.days) {
    if (d > ds) break;
    const x = h.byDay[d];
    for (const type of ['songs', 'artists', 'albums']) {
      const tgt = d < ds ? before[type] : null;
      for (const k in x[type]) {
        const c = x[type][k].count;
        if (tgt) tgt[k] = (tgt[k] || 0) + c;
        after[type][k] = (after[type][k] || 0) + c;
        if (d < ds && type !== 'albums') {
          if (c > (bestDay[type][k] || 0)) bestDay[type][k] = c;
          if (type === 'songs' && c > anySongBest) anySongBest = c;
          if (type === 'artists' && c > anyArtistBest) anyArtistBest = c;
        }
      }
    }
    if (d < ds) {
      if (x.plays > bestAll) bestAll = x.plays;
      if (dyDate(d).getDay() === wd && x.plays > bestWd) bestWd = x.plays;
    }
  }

  if (day) {
    // ── Daily awards ──
    const chips = [];
    const top = type => (h.charts[type][ds] || [])[0];
    const chip = (lbl, name) => `<li class="dy-award"><span class="dy-award-lbl">${esc(lbl)}</span><span class="dy-award-name" title="${esc(name)}">${esc(name)}</span></li>`;
    if (top('songs')) chips.push(chip(t('dy_aw_song'), label.songs(top('songs').k)));
    if (top('artists')) chips.push(chip(t('dy_aw_artist'), top('artists').k));
    if (top('albums')) chips.push(chip(t('dy_aw_album'), label.albums(top('albums').k)));
    const fresh = Object.keys(day.songs).filter(k => !before.songs[k]).sort((a, b) => day.songs[b].count - day.songs[a].count)[0];
    if (fresh) chips.push(chip(t('dy_aw_discovery'), label.songs(fresh)));
    // Comeback: the song whose last play before this day is the oldest (30+ days)
    let comeback = null;
    if (Object.keys(day.songs).length) {
      const last = {};
      for (const d of h.days) { if (d >= ds) break; for (const k in h.byDay[d].songs) if (day.songs[k]) last[k] = d; }
      for (const k in last) {
        const gap = Math.round((dyDate(ds) - dyDate(last[k])) / 86400000);
        if (gap >= 30 && (!comeback || gap > comeback.gap)) comeback = { k, gap };
      }
    }
    if (comeback) chips.push(chip(t('dy_aw_comeback'), label.songs(comeback.k)));
    if (chips.length) blocks.push(['awards', t('dy_aw_title'), `<ul class="dy-awards">${chips.join('')}</ul>`]);

    // ── Milestones hit ──
    const hit = [];
    for (const type of ['songs', 'artists', 'albums']) {
      for (const k in day[type]) {
        const ms = dyMsCrossed(type, before[type][k] || 0, after[type][k] || 0);
        if (ms.length) hit.push({ type, k, m: ms[ms.length - 1] });
      }
    }
    hit.sort((a, b) => b.m - a.m);
    if (hit.length) blocks.push(['list', t('dy_ms_hit'), hit.slice(0, 4).map(x => row(label[x.type](x.k), t('dy_ms_reached', { n: x.m.toLocaleString() }))).join('')]);

    // ── Records broken ──
    const recs = [];
    const topSong = Object.entries(day.songs).sort((a, b) => b[1].count - a[1].count)[0];
    const topArtist = Object.entries(day.artists).sort((a, b) => b[1].count - a[1].count)[0];
    if (topSong && anySongBest && topSong[1].count > anySongBest)
      recs.push(row(t('dy_rec_any_song'), label.songs(topSong[0]) + ' · ' + t('dy_rec_vs', { n: topSong[1].count, was: anySongBest })));
    if (topArtist && anyArtistBest && topArtist[1].count > anyArtistBest)
      recs.push(row(t('dy_rec_any_artist'), topArtist[0] + ' · ' + t('dy_rec_vs', { n: topArtist[1].count, was: anyArtistBest })));
    for (const type of ['songs', 'artists']) {
      Object.entries(day[type]).filter(([k, e]) => e.count >= 3 && bestDay[type][k] && e.count > bestDay[type][k])
        .sort((a, b) => b[1].count - a[1].count).slice(0, 2)
        .forEach(([k, e]) => recs.push(row(label[type](k), t('dy_rec_own', { n: e.count, was: bestDay[type][k] }))));
    }
    if (recs.length) blocks.push(['list', t('dy_rec_title'), recs.slice(0, 4).join('') +
      `<li class="dy-mem-more"><button type="button" class="dy-link" onclick="dcGoTab('records')">${esc(t('dy_rec_see'))} →</button></li>`]);

    // ── Streaks going and ended ──
    const going = [];
    for (const type of ['songs', 'artists']) {
      for (const k in day[type]) {
        const n = dyRunEnding(h, type, k, ds);
        if (n >= 3) going.push({ type, k, n });
      }
    }
    going.sort((a, b) => b.n - a.n);
    const yest = dyShift(ds, -1), ended = [];
    // Today is not over yet: its runs are not "ended" but listed under Goals
    // as "play it today to keep a … streak"
    if (h.byDay[yest] && currentOffset !== 0) {
      for (const type of ['songs', 'artists']) {
        for (const k in h.byDay[yest][type]) {
          if (day[type][k]) continue;
          const n = dyRunEnding(h, type, k, yest);
          if (n >= 3) ended.push({ type, k, n });
        }
      }
    }
    ended.sort((a, b) => b.n - a.n);
    const yLabel = (type, k) => type === 'songs' ? (h.byDay[yest].songs[k].title + ' — ' + h.byDay[yest].songs[k].artist) : k;
    const sRows = going.slice(0, 3).map(x => row(label[x.type](x.k), t('dy_streak_on', { n: x.n })))
      .concat(ended.slice(0, 2).map(x => row(yLabel(x.type, x.k), t('dy_streak_ended', { n: x.n }))));
    if (sRows.length) blocks.push(['list', t('dy_streaks'), sRows.join('')]);
  }

  // ── Goals ──
  const goals = [];
  const n = day ? day.plays : 0;
  const isToday = currentOffset === 0;
  const dayName = dyDayName(ds);
  const goal = (best, newKey, leftKey, shortKey) => {
    if (!best) return;
    if (n > best) goals.push(row(t(newKey, { day: dayName }), t('dy_goal_beat', { was: best.toLocaleString() })));
    else goals.push(row(t(isToday ? leftKey : shortKey, { n: (best - n + 1).toLocaleString(), day: dayName }), t('dy_goal_best', { n: best.toLocaleString() })));
  };
  goal(bestWd, 'dy_goal_new_wd', 'dy_goal_left_wd', 'dy_goal_short_wd');
  if (bestAll > bestWd || n > bestWd) goal(bestAll, 'dy_goal_new_all', 'dy_goal_left_all', 'dy_goal_short_all');

  // Close to a milestone, as the day ended: the smallest gaps, relative to the
  // round number. Only for what you played in the 30 days up to it, so a song
  // you dropped months ago is not "almost there".
  const recent = { songs: new Set(), artists: new Set(), albums: new Set() };
  for (let i = 0; i < 30; i++) {
    const x = h.byDay[dyShift(ds, -i)];
    if (x) for (const type of ['songs', 'artists', 'albums']) for (const k in x[type]) recent[type].add(k);
  }
  const close = [];
  for (const type of ['songs', 'artists', 'albums']) {
    for (const k of recent[type]) {
      const c = after[type][k] || 0;
      if (c < DY_MS[type][0] / 2) continue;
      const m = dyNextMs(type, c);
      const left = m - c;
      if (left <= Math.max(3, m * 0.05)) close.push({ type, k, m, left, r: left / m });
    }
  }
  close.sort((a, b) => a.r - b.r || b.m - a.m);
  const closeLabel = x => x.type === 'songs' ? (allSongName(x.k) || x.k) : label[x.type](x.k);
  // Its own list ("Almost there"), saying the count now and what is left:
  // "999 plays · 1 more to reach 1,000"
  const closeRows = close.slice(0, 3).map(x => row(closeLabel(x),
    t('dy_goal_close', { now: tCount('plays', x.m - x.left), left: x.left.toLocaleString(), m: x.m.toLocaleString() })));

  // Today only: streaks that end unless played today
  if (isToday) {
    const yest = dyShift(ds, -1);
    const alive = [];
    if (h.byDay[yest]) {
      for (const type of ['artists', 'songs']) {
        for (const k in h.byDay[yest][type]) {
          if (day && day[type][k]) continue;
          const len = dyRunEnding(h, type, k, yest);
          if (len >= 3) alive.push({ type, k, len, name: type === 'songs' ? h.byDay[yest].songs[k].title + ' — ' + h.byDay[yest].songs[k].artist : k });
        }
      }
    }
    var keepRows = alive.sort((a, b) => b.len - a.len).slice(0, 3).map(x => row(x.name, t('dy_goal_keep', { n: x.len })));
  }
  if (goals.length) blocks.push(['list', t('dy_goals'), goals.join('')]);
  if (closeRows.length) blocks.push(['list', t('dy_close_title'), closeRows.join('')]);
  // Its own list, so the day's goals and the streaks at stake read apart
  if (keepRows && keepRows.length) blocks.push(['list', t('dy_keep_title'), keepRows.join('')]);

  if (!blocks.length) return '';
  const awards = blocks.filter(b => b[0] === 'awards').map(b => `<div class="dy-awards-wrap"><span class="ns-x-title">${esc(b[1])}</span>${b[2]}</div>`).join('');
  const lists = blocks.filter(b => b[0] === 'list').map(([, title, body]) => `<div class="dy-mem-block"><span class="ns-x-title">${esc(title)}</span><ul class="dy-mem-list">${body}</ul></div>`).join('');
  return `
    <section class="dy-tod dy-ms" aria-label="${esc(t('dy_ms_title'))}">
      <div class="dy-tod-head"><span class="ns-x-title">${esc(t('dy_ms_title'))}</span></div>
      ${awards}
      ${lists ? `<div class="dy-mem-grid">${lists}</div>` : ''}
    </section>`;
}

// "Title — Artist" for a song key, from its newest play (for keys not played on the day)
let _dyNameCache = null;
function allSongName(k) {
  if (!_dyNameCache || _dyNameCache.n !== allPlays.length) {
    const m = new Map();
    for (const p of allPlays) { const sk = songKey(p); if (!m.has(sk)) m.set(sk, p.title + ' — ' + p.artist); }
    _dyNameCache = { n: allPlays.length, m };
  }
  return _dyNameCache.m.get(k);
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
  const el = document.querySelector('#dailyBottom .dy-pats');
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
/* A card above the chart about the day on screen:
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
      ${dyRingSvg(n, usual)}
      <div class="ns-x-text">
        <span class="ns-x-title">${esc(dayTitle)}${dyLiveBadge()}</span>
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

// A day's plays against your usual day, as a ring drawn in SVG (the day panel)
function dyRingSvg(n, usual) {
  const r = 20, c = 2 * Math.PI * r;
  const f = usual ? Math.min(1, n / usual) : 0;
  return `<svg class="ns-ring${n >= usual && usual ? ' is-full' : ''}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle class="ns-ring-track" cx="24" cy="24" r="${r}"/>
      <circle class="ns-ring-fill" cx="24" cy="24" r="${r}" stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 24 24)"/>
      <text x="24" y="24" dy="0.35em" text-anchor="middle">${n > 999 ? Math.round(n / 100) / 10 + 'k' : n}</text>
    </svg>`;
}

// ─── CONTROLS ─────────────────────────────────────────────────────────────

function dySetCompare(v) {
  dyCompare = v === 'weekday' ? 'weekday' : 'yesterday';
  try { localStorage.setItem('dc_daily_compare', dyCompare); } catch (e) {}
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
