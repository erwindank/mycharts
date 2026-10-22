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
  const facts = {};
  // days: every day on the daily chart up to and including the viewed one,
  // the same count as the chart run's "Days on chart" (dyChartRun). It used
  // to count only this month's days, so a song back after a month away read 1.
  for (const k of want) facts[k] = { peak: Infinity, peakDs: '', days: 0, before: false };
  for (const day of h.days) {
    if (day > ds) break;
    const rows = h.charts[type][day];
    if (!rows) continue;
    for (const r of rows) {
      const f = facts[r.k];
      if (!f) continue;
      if (r.rank < f.peak) { f.peak = r.rank; f.peakDs = day; }
      f.days++;
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
     - fills #dailyView above the chart: the compare
       switch, the actions and the daily #1 line; #dailyDay after the chart:
       the day panel and your day
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
  dyRenderTiles(h, ds, plays);
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
  // The chart-run panel reads the daily chart's own history only (dyChartRun)
  allChartRun = { day: dyChartRun(h, ds) };
  chartRunData = allChartRun.day;
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

/* The daily chart run, in the shape buildChartRun() gives the other periods:
   { period: 'day', curKey, periodMap, result: { songs: { key: { entries:
   [{ periodKey, rank, plays }], peak, peakPlays, … } }, … } }, up to the
   viewed day. The chart-run panel (buildCrPanelHTML), its boxes, gaps, range
   buttons and Share card all read it, so a Daily entry's run is its days on
   the daily chart and nothing else. periodMap is each day's tallies, which
   is what the run's play totals add up. */
function dyChartRun(h, ds) {
  if (h._run && h._run.curKey === ds) return h._run;
  const result = { songs: {}, artists: {}, albums: {} };
  const periodMap = {};
  for (const d of h.days) {
    if (d > ds) break;
    const x = h.byDay[d];
    periodMap[d] = x;
    for (const type of ['songs', 'artists', 'albums']) {
      for (const r of h.charts[type][d] || []) {
        const e = result[type][r.k] || (result[type][r.k] = { entries: [], peak: Infinity, peakPlays: 0, peakDays: 0, peakMonths: 0 });
        // label: what the share card's timeline prints at its two ends
        e.entries.push({ periodKey: d, rank: r.rank, plays: r.count, label: crPeriodLabel('day', d) });
        if (r.rank < e.peak) e.peak = r.rank;
        if (r.count > e.peakPlays) e.peakPlays = r.count;
        if (type === 'songs') { const s = x.songs[r.k]; e._title = s.title; e._artist = s.artist; }
        else if (type === 'albums') { const i = r.k.lastIndexOf('|||'); e._album = i < 0 ? r.k : r.k.slice(0, i); e._artist = i < 0 ? '' : r.k.slice(i + 3); }
      }
    }
  }
  // The albums chart on screen is already the bucket in view, mixed or not
  result.albumsMixed = result.albums;
  return (h._run = { period: 'day', curKey: ds, periodMap, result });
}

// One day's chart, for the pop-up a chart-run box opens: [{ rank, name, key }]
function dyChartOf(type, ds) {
  const h = dyHistory();
  const day = h.byDay[ds];
  return (h.charts[type][ds] || []).map(r => {
    let name = r.k;
    if (type === 'songs') name = day.songs[r.k].title;
    else if (type === 'albums') { const i = r.k.lastIndexOf('|||'); name = i < 0 ? r.k : r.k.slice(0, i); }
    return { rank: r.rank, name, key: r.k };
  });
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

/* Above the chart: the compare switch, the actions and the daily #1 line;
   the day panel and Your day go to #dailyDay right after the chart. Also
   called on its own when the Songs / Artists / Albums switch changes (applyChartTypeView). */
function dyRenderTop(h, ds) {
  const view = document.getElementById('dailyView');
  if (!view) return;
  const type = ['songs', 'artists', 'albums'].includes(chartTypeView) ? chartTypeView : 'songs';

  // What the movement column compares against (the chart size is in ⋮ → Size)
  const cmpBtn = (v, lbl) => `<button type="button" class="dy-seg-btn${dyCompare === v ? ' active' : ''}" onclick="dySetCompare('${v}')">${esc(lbl)}</button>`;

  // The daily #1 line
  const no1 = dyNo1Facts(h, type, ds);
  let no1Html = '';
  if (no1) {
    const bits = [no1.run > 1 ? t('dy_no1_run', { n: no1.run }) : t('dy_no1_today')];
    if (no1.month > 1) bits.push(t('dy_no1_month', { n: no1.month }));
    no1Html = `<p class="dy-no1"><span class="dy-no1-crown" aria-hidden="true">♛</span>${esc(bits.join(' · '))}</p>`;
  }

  // One block under the Songs / Artists / Albums switch, in the same chrome
  // (tidied 2026-10-20, when its four loose rows had nothing lined up):
  // "Compare with" and its switch on the left with the #1 chip on the right,
  // then the actions in one full-width tray (a 3 × 2 grid on phones)
  const toolbar = `
    <div class="dy-toolbar">
      <div class="dy-toolbar-row">
        <div class="dy-cmp">
          <span class="dy-cmp-lbl" aria-hidden="true">${esc(t('dy_compare_label'))}</span>
          <div class="dy-seg" role="group" aria-label="${esc(t('dy_compare_label'))}">
            ${cmpBtn('yesterday', t('dy_vs_yesterday'))}${cmpBtn('weekday', t('dy_vs_weekday', { day: dyDayName(ds) }))}
          </div>
        </div>
        ${no1Html}
      </div>
      ${dyActionsHtml(type, (h.charts.songs[ds] || []).length)}
    </div>`;

  // A live redraw must not throw away a note being typed: keep its text,
  // caret and focus across the innerHTML swap (phase 8)
  const ae = document.activeElement;
  const keepNote = ae && ae.id === 'dyNote' ? { v: ae.value, s: ae.selectionStart, e: ae.selectionEnd } : null;

  // The day panel and Your day sit right after the chart (#dailyDay)
  const dayEl = document.getElementById('dailyDay');
  // Its covers load as soon as it is on the page (dyFlushImgs), on their own
  // so the bottom cards' reset of _dyImgs does not drop them
  if (dayEl) {
    _dyImgs = [];
    dayEl.innerHTML = `
    ${dyPanelHtml(h, ds)}
    ${dyDiaryHtml(ds)}`;
    dyFlushImgs();
    dyRepStart();
  }

  view.innerHTML = toolbar;

  if (keepNote) {
    const n = document.getElementById('dyNote');
    if (n) { n.value = keepNote.v; n.focus(); n.setSelectionRange(keepNote.s, keepNote.e); }
  }
}

// Under the chart: time of day, patterns, memories, milestones & goals
function dyRenderBottom(h, ds) {
  const el = document.getElementById('dailyBottom');
  if (!el) return;
  // Every card adds its covers to _dyImgs (dyThumb); loaded once they are on the page
  _dyImgs = [];
  el.innerHTML = `
    ${dyTimeOfDayHtml(h, ds)}
    ${dyPatternsHtml(h, ds)}
    ${dyMemoriesHtml(h, ds)}
    ${dyMilestonesHtml(h, ds)}`;
  dyFlushImgs();
}

// ─── TILES ────────────────────────────────────────────────────────────────

function dyRenderTiles(h, ds, plays) {
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

  /* Stats banner on Daily too (2026-10-20, same as the other periods — see
     renderStatsHero in app.js): the best day ever for each tile (the record
     the bars' tick marks), the best before this day (record at the time) and
     the usual day per tile (median of the days before, 2026-10-21: all four
     tiles, it was plays only), for the bars, rings and the headline. The
     new-entry counts get the same, for the bars under "+N new songs"
     (2026-10-21). One pass over every day; cached on the history per day. */
  if (!h._shRec || h._shRec.ds !== ds) {
    // New songs / artists / albums per day, straight from the first-seen
    // dates (same keys as day.songs / .artists / .albums, so same as isNew)
    const nb = { newSongs: {}, newArtists: {}, newAlbums: {} };
    const tallyFirst = (map, into) => { for (const k in map) { const f = map[k]; if (f) { const k2 = localDateStr(f); into[k2] = (into[k2] || 0) + 1; } } };
    tallyFirst(songFirst, nb.newSongs); tallyFirst(artistFirst, nb.newArtists); tallyFirst(albumFirst, nb.newAlbums);
    const fields = ['plays', 'songs', 'artists', 'albums', 'newSongs', 'newArtists', 'newAlbums'];
    const rec = {}, before = {}, earlier = {};
    for (const f of fields) { rec[f] = 0; before[f] = 0; earlier[f] = []; }
    for (const day2 of h.days) {
      const u = uniq(h.byDay[day2]);
      for (const f in nb) u[f] = nb[f][day2] || 0;
      for (const f in rec) {
        if (u[f] > rec[f]) rec[f] = u[f];
        if (day2 < ds && u[f] > before[f]) before[f] = u[f];
      }
      if (day2 < ds) for (const f in earlier) earlier[f].push(u[f]);
    }
    // Median, same as shUsualStats in app.js (null before the first day)
    const med = a => {
      if (!a.length) return null;
      a.sort((x, y) => x - y);
      const m = a.length >> 1;
      return a.length % 2 ? a[m] : Math.round((a[m - 1] + a[m]) / 2);
    };
    // Only the most recent days you listened in count (SH_USUAL_WINDOW in
    // app.js, 90), so old listening habits don't set today's normal
    const win = (typeof SH_USUAL_WINDOW !== 'undefined' && SH_USUAL_WINDOW.day) || 90;
    for (const f in earlier) earlier[f] = earlier[f].slice(-win);
    const usual = {};
    for (const f of fields) usual[f] = med(earlier[f]);
    h._shRec = { ds, rec, before, usual, nb, nBefore: earlier.plays.length };
  }
  const { rec, before } = h._shRec;
  // Gold ring for a best day ever, silver for the best day up to then
  // (Total Plays keeps its own "biggest this month" tag below)
  const ring = (val, f) => {
    if (!day || !val) return { cls: '', tag: '' };
    if (val >= rec[f]) return { cls: ' stat-peak-alltime', tag: `<div class="stat-peak-badge stat-peak-badge-alltime">${t('stat_alltime_peak')}</div>` };
    if (h._shRec.nBefore && val >= before[f]) return { cls: ' stat-peak-attime', tag: `<div class="stat-peak-badge stat-peak-badge-attime">${t('stat_peak_at_time')}</div>` };
    return { cls: '', tag: '' };
  };
  // Pictures: the day's first-ever songs (top 3 if none), top artists, top albums
  const tally = shTally(plays, new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  const faceSongs = tally.newSongs.length ? tally.newSongs.slice(0, 5) : tally.songList.slice(0, 3);
  const faces = { songs: faceSongs, artists: tally.artistList.slice(0, 5), albums: tally.albumList.slice(0, 3) };

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
  // f: the tile's field (plays / songs / artists / albums), for its bars
  // against the comparison day and the record tick; ringCls: the tile's ring.
  // The record is the one as of this day (best before it, or this day if it
  // beat it), not today's all-time best; the tick is the usual day (both
  // user's calls 2026-10-21).
  const box = (val, key, prevVal, emoji, cat, extraLine, badge, f, ringCls, facesHtml) => `
    <div class="stat-box${ringCls || ''}" data-cat="${cat}">
      <div class="stat-head"><span class="stat-cat-icon">${emoji}</span><span class="stat-label">${t(key)}</span></div>
      <div class="stat-val" data-val="${val}">${val.toLocaleString()}</div>
      ${cmp ? `<div class="stat-foot">${delta(val, prevVal)}</div>` : ''}
      ${day ? shBarsHtml(val, prevVal, Math.max(before[f], val) || null, h._shRec.usual[f]) : ''}${facesHtml || ''}
      ${extraLine || ''}${badge || ''}
    </div>`;
  // "+N new songs" and under it the bars: this day vs. the comparison day,
  // your usual day and the record as of this day (f: field in h._shRec)
  const newLine = (n, key, f) => day ? `<div class="stat-sub">${subCell('+' + n.toLocaleString(), t(key))}</div>`
    + `<div class="sh-new-bars">${shBarsHtml(n, h._shRec.nb[f][cmpDs] || 0, Math.max(before[f], n) || null, h._shRec.usual[f])}</div>` : '';

  // Plays tile: share of the week and the weekday rank, with the full ranking in the tooltip
  const rankTip = [t('dy_rank_all_tip', { n: rankAll.toLocaleString(), total: h.days.length.toLocaleString() }),
                   t('dy_rank_wd_tip', { n: rankWd.toLocaleString(), total: totalWd.toLocaleString(), day: dyDayName(ds) })].join('\n');
  const playsLine = day ? `<div class="stat-sub">${subCell(share + '%', t('dy_sub_of_week'))}${subCell('#' + rankWd, dyDayName(ds), ' is-plain', ` title="${esc(rankTip)}"`)}</div>` : '';
  const badge = !day ? '' : rankAll === 1
    ? `<div class="stat-peak-badge stat-peak-badge-alltime">${esc(t('dy_biggest_ever'))}</div>`
    : rankMonth === 1 ? `<div class="stat-peak-badge stat-peak-badge-attime">${esc(t('dy_biggest_month'))}</div>` : '';
  const playsRing = !day ? '' : rankAll === 1 ? ' stat-peak-alltime' : rankMonth === 1 ? ' stat-peak-attime' : '';
  const rS = ring(cur.songs, 'songs'), rA = ring(cur.artists, 'artists'), rB = ring(cur.albums, 'albums');
  const songsTip = tally.newSongs.length ? t('sh_faces_new') : t('sh_faces_top_songs');

  el.innerHTML =
    box(cur.plays,   'stat_total_plays',  prv.plays,   '🎵', 'plays',   playsLine, badge, 'plays', playsRing) +
    box(cur.songs,   'stat_unique_songs', prv.songs,   '🎶', 'songs',   newLine(newSongs, 'stat_sub_new_songs', 'newSongs'), rS.tag, 'songs', rS.cls, shFacesHtml('songs', faces.songs, songsTip)) +
    box(cur.artists, 'stat_artists',      prv.artists, '🎤', 'artists', newLine(newArtists, 'stat_sub_new_artists', 'newArtists'), rA.tag, 'artists', rA.cls, shFacesHtml('artists', faces.artists, t('sh_faces_top_artists'))) +
    box(cur.albums,  'stat_albums',       prv.albums,  '💿', 'albums',  newLine(newAlbums, 'stat_sub_new_albums', 'newAlbums'), rB.tag, 'albums', rB.cls, shFacesHtml('albums', faces.albums, t('sh_faces_top_albums')));
  // Slow count-up, as on the other periods
  if (typeof animateStatStrip === 'function') animateStatStrip(el, 2400);   // same 2.4s as the other periods
  shLoadFaces(faces);

  // The banner around the tiles: the day's #1 artist photo once the day is
  // over, today's top covers while it runs; headline; plays by hour; Share
  const dayIndex = {};
  for (const day2 of h.days) dayIndex[day2] = { plays: h.byDay[day2].plays };
  renderStatsHero({
    period: 'day', offset: currentOffset, plays, start: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    end: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999), cutoffKey: ds, tally,
    peakStats: { maxPlays: rec.plays }, peakAtTimeStats: h._shRec.nBefore ? { maxPlays: before.plays } : null,
    usual: h._shRec.usual.plays !== null ? { plays: h._shRec.usual.plays } : null,
    agg: { index: dayIndex, keys: h.days }, timed: h.timed
  });
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

// ─── SHARED PIECES OF THE BOTTOM CARDS ───────────────────────────────────
/* The four cards under the daily chart (time of day, patterns, memories,
   milestones) share these:
     - dySecHead: an icon, a real heading and a one-line summary, so each card
       says what it found before it shows the numbers
     - dyThumb: a small cover or artist photo; collected in _dyImgs and loaded
       by dyFlushImgs once the HTML is on the page
     - dyTabsHtml: pills that show one list at a time (memories, milestones),
       instead of every list at once; the pill you picked is kept in _dyTab
       across redraws
     - dyRow: one row of those lists — cover or emoji, text, an optional
       progress bar, and a badge or the ▶ / ⋮ buttons */
let _dyImgs = [];
let _dyImgSeq = 0;
const _dyTab = {};

function dySecHead(icon, title, subHtml) {
  return `<header class="dy-sec-head">
      <span class="dy-sec-ic" aria-hidden="true">${icon}</span>
      <span class="dy-sec-titles"><h3 class="dy-sec-title">${esc(title)}</h3>${subHtml ? `<span class="dy-sec-sub">${subHtml}</span>` : ''}</span>
    </header>`;
}

// type: 'song' | 'album' | 'artist'; d: { title, album, artist }
function dyThumb(type, d, cls) {
  const imgId = 'dyi-' + (++_dyImgSeq);
  const name = type === 'artist' ? d.artist : type === 'album' ? d.album : d.title;
  const prefKey = type === 'artist' ? 'artist:' + d.artist.toLowerCase()
                                    : type + ':' + d.artist.toLowerCase() + '|||' + String(name).toLowerCase();
  _dyImgs.push({ type, item: { imgId, name, title: d.title || '', album: d.album || '', artist: d.artist, prefKey } });
  return `<span class="dy-thumb${type === 'artist' ? ' is-round' : ''}${cls ? ' ' + cls : ''}" id="${imgId}" aria-hidden="true"><span class="thumb-initials">${esc(initials(name))}</span></span>`;
}

function dyFlushImgs() {
  for (const tp of ['album', 'song', 'artist']) {
    const items = _dyImgs.filter(x => x.type === tp).map(x => x.item);
    if (items.length) loadImages(items, tp);
  }
  _dyImgs = [];
}

// blocks: [{ key, icon, title, n, body }] — body is the <li> rows of that list
function dyTabsHtml(sec, blocks) {
  if (!blocks.length) return '';
  const act = blocks.some(b => b.key === _dyTab[sec]) ? _dyTab[sec] : blocks[0].key;
  const tabs = blocks.map(b => `<button type="button" role="tab" class="dy-tab${b.key === act ? ' is-on' : ''}" aria-selected="${b.key === act}" data-dy-tab="${b.key}" onclick="dyTabGo(this)">
      <span class="dy-tab-ic" aria-hidden="true">${b.icon}</span>${esc(b.title)}${b.n ? `<span class="dy-tab-n">${b.n}</span>` : ''}
    </button>`).join('');
  const panels = blocks.map(b => `<div class="dy-tab-panel" role="tabpanel" data-dy-panel="${b.key}"${b.key === act ? '' : ' hidden'}><ul class="dy-mem-list">${b.body}</ul></div>`).join('');
  return `<div class="dy-tabs" data-dy-sec="${sec}"><div class="dy-tab-row" role="tablist">${tabs}</div>${panels}</div>`;
}

// DOM-only switch: the hidden panels' covers load when they come into view
function dyTabGo(btn) {
  const wrap = btn.closest('.dy-tabs');
  const k = btn.dataset.dyTab;
  _dyTab[wrap.dataset.dySec] = k;
  wrap.querySelectorAll('.dy-tab').forEach(b => { const on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
  wrap.querySelectorAll('.dy-tab-panel').forEach(p => { p.hidden = p.dataset.dyPanel !== k; });
}

/* o: { main (HTML), sub (HTML), tip, lead (HTML: cover or emoji), pct (0–100,
   a progress bar), badge (HTML), badgeCls, cls, attrs, tail (HTML) } */
function dyRow(o) {
  return `<li class="dy-mem-row${o.cls ? ' ' + o.cls : ''}"${o.attrs || ''}>
      ${o.lead || ''}
      <span class="dy-mem-text"><span class="ns-x-line"${o.tip ? ` title="${esc(o.tip)}"` : ''}>${o.main}</span>${o.sub ? `<span class="dy-mem-sub">${o.sub}</span>` : ''}${o.pct != null ? `<span class="dy-prog"><i style="width:${Math.max(2, Math.min(100, o.pct)).toFixed(1)}%"></i></span>` : ''}</span>
      ${o.badge ? `<span class="dy-badge${o.badgeCls ? ' ' + o.badgeCls : ''}">${o.badge}</span>` : ''}${o.tail || ''}
    </li>`;
}

// An emoji in a round tile, in place of a cover
function dyLead(emoji) {
  return `<span class="dy-thumb is-emoji" aria-hidden="true">${emoji}</span>`;
}

// "<b>Title</b> — Artist", the way every song line in these cards reads
function dySongMain(title, artist) {
  return `<b>${esc(title)}</b> <span>— ${esc(artist)}</span>`;
}

// ─── TIME OF DAY (phase 3) ────────────────────────────────────────────────
/* A summary line ("An afternoon kind of day"), three stat chips, then the
   day as 24 bars you can hover or tap: the box under them shows that hour's
   plays, top song (with ▶) and cover. Covers of each hour's top album sit
   over the bars (on phones only the hours that do not crowd each other);
   under them, the listening sessions as blocks on the same 24 hours. The four
   parts of the day are cards with their share of the day; tap one to light
   its six hours. */
const DY_PARTS = [['night', 0, 6, '🌙'], ['morning', 6, 12, '🌅'], ['afternoon', 12, 18, '☀️'], ['evening', 18, 24, '🌆']];
let _dyTod = null;   // the hours of the day on screen, for dyPickHour

function dyTimeOfDayHtml(h, ds) {
  const day = h.byDay[ds];
  if (!h.timed || !day || !day.list.length) { _dyTod = null; return ''; }

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

  // Minutes after midnight, for placing sessions on the 24 hours
  const minOf = ms => { const d = tzDate(new Date(ms)); return d.getHours() * 60 + d.getMinutes(); };
  const sessBlocks = sessions.map(s => {
    const a = minOf(s.start);
    const z = Math.min(1440, a + Math.max(1, (s.end - s.start + DY_SONG_MS) / 60000));
    const tip = dyClock(s.start) + '–' + dyClock(s.end + DY_SONG_MS) + ' · ' + tCount('plays', s.n);
    return `<i class="${s === longest ? 'is-long' : ''}" style="left:${(a / 1440 * 100).toFixed(2)}%;width:${Math.max(0.8, (z - a) / 1440 * 100).toFixed(2)}%" title="${esc(tip)}"></i>`;
  }).join('');

  // Stat chips
  const chip = (lbl, val, more) => `<span class="dy-chip"><em>${esc(lbl)}</em><b>${esc(val)}</b>${more ? `<span>${esc(more)}</span>` : ''}</span>`;
  const chips = chip(t('dy_busiest'), dyHourLabel(busy), tCount('plays', hours[busy].n)) +
    `<span class="dy-chip"><b>${esc(t(sessions.length === 1 ? 'dy_sessions_one' : 'dy_sessions_other', { n: sessions.length }))}</b></span>` +
    chip(t('dy_longest_lbl'), dyDuration(longest.end - longest.start + DY_SONG_MS), dyClock(longest.start) + '–' + dyClock(longest.end + DY_SONG_MS));

  // Cover strip: the most played album of each hour, placed at that hour.
  // On phones the strip is too narrow for 24 covers, so only the busiest
  // hours that have no shown neighbour keep theirs (the rest get is-minor).
  const shown = new Set();
  hours.map((b, i) => [b.n, i]).filter(x => x[0]).sort((a, b) => b[0] - a[0])
    .forEach(([, i]) => { if (!shown.has(i - 1) && !shown.has(i + 1)) shown.add(i); });
  _dyTod = { ds, busy, hours: hours.map((b, i) => {
    if (!b.n) return { n: 0 };
    const top = dyTopOf(b.albums), song = dyTopOf(b.songs);
    return { n: b.n, song, isAlbum: !!top.album, label: top.album || top.title, artist: top.artist };
  }) };
  const covers = hours.map((b, i) => {
    if (!b.n) return '';
    const x = _dyTod.hours[i];
    const imgId = 'dytl-' + i;
    const prefKey = (x.isAlbum ? 'album:' : 'song:') + x.artist.toLowerCase() + '|||' + x.label.toLowerCase();
    _dyImgs.push(x.isAlbum
      ? { type: 'album', item: { imgId, album: x.label, name: x.label, artist: x.artist, prefKey } }
      : { type: 'song', item: { imgId, title: x.label, name: x.label, artist: x.artist, album: '', prefKey } });
    return `<button type="button" class="dy-tl-cover${shown.has(i) ? '' : ' is-minor'}" style="left:${((i + 0.5) / 24 * 100).toFixed(2)}%" title="${esc(dyHourLabel(i) + ' · ' + x.label + ' — ' + x.artist)}" onclick="dyPickHour(${i})" tabindex="-1"><span id="${imgId}"><span class="thumb-initials">${esc(initials(x.label))}</span></span></button>`;
  }).join('');

  // Hour bars: buttons, so a tap (or hover, or the keyboard) picks the hour
  const max = Math.max(1, ...hours.map(b => b.n));
  const bars = hours.map((b, i) => `<button type="button" class="dy-hr${i === busy ? ' is-busy is-picked' : ''}${b.n ? '' : ' is-zero'}" data-hr="${i}"
      aria-label="${esc(dyHourLabel(i) + ' · ' + tCount('plays', b.n))}" onclick="dyPickHour(${i})" onmouseenter="dyPickHour(${i})" onfocus="dyPickHour(${i})"><i style="height:${b.n ? Math.max(6, b.n / max * 100).toFixed(0) : 0}%"></i></button>`).join('');
  const ticks = [0, 6, 12, 18].map(i => `<span style="left:${(i / 24 * 100).toFixed(2)}%">${esc(dyHourLabel(i))}</span>`).join('');

  // The four parts of the day, as cards with their share of the day
  let topPart = null;
  const partData = DY_PARTS.map(([key, a, z, icon]) => {
    let n = 0; const songs = {};
    for (let i = a; i < z; i++) {
      n += hours[i].n;
      for (const k in hours[i].songs) {
        const s = hours[i].songs[k];
        (songs[k] || (songs[k] = { n: 0, title: s.title, artist: s.artist })).n += s.n;
      }
    }
    const x = { key, a, z, icon, n, top: dyTopOf(songs) };
    if (n && (!topPart || n > topPart.n)) topPart = x;
    return x;
  });
  const parts = partData.map(x => {
    const pct = Math.round(x.n / plays.length * 100);
    // Number and word apart, so phones can shrink the word ("reproducciones"
    // is wider than a half-width card on a 330px screen)
    const cnt = tCount('plays', x.n);
    const cm = cnt.match(/^(\S+)\s+(.+)$/);
    const cntHtml = cm ? `<b>${esc(cm[1])}</b> <i class="dy-part-w">${esc(cm[2])}</i>` : esc(cnt);
    return `<button type="button" class="dy-part${x.n ? '' : ' is-empty'}${x === topPart ? ' is-top' : ''}" data-a="${x.a}" data-z="${x.z}" onclick="dyPickPart(this)" aria-pressed="false">
        <span class="dy-part-head"><span class="dy-part-ic" aria-hidden="true">${x.icon}</span><span class="dy-part-name">${esc(t('dy_part_' + x.key))}</span>${x === topPart ? `<span class="dy-part-tag">${esc(t('dy_part_peak'))}</span>` : ''}</span>
        <span class="dy-part-n"><span class="dy-part-cnt">${cntHtml}</span><span>${pct}%</span></span>
        <span class="dy-prog"><i style="width:${Math.max(x.n ? 2 : 0, pct)}%"></i></span>
        ${x.top ? `<span class="ns-x-line dy-part-song" title="${esc(x.top.title + ' — ' + x.top.artist)}">${dySongMain(x.top.title, x.top.artist)}</span>` : `<span class="dy-part-song is-none">${esc(t('dy_part_quiet'))}</span>`}
      </button>`;
  }).join('');

  const sub = topPart ? esc(t('dy_tod_persona_' + topPart.key)) : '';
  return `
    <section class="dy-tod dy-tod-sec" aria-label="${esc(t('dy_tod_title'))}">
      ${dySecHead('🕒', t('dy_tod_title'), sub)}
      <div class="dy-chips">${chips}</div>
      <div class="dy-tod-chart">
        <div class="dy-tl">${covers}</div>
        <div class="dy-hours" role="group" aria-label="${esc(t('dy_tod_title'))}">${bars}</div>
        <div class="dy-ticks" aria-hidden="true">${ticks}</div>
        <div class="dy-sess" title="${esc(t(sessions.length === 1 ? 'dy_sessions_one' : 'dy_sessions_other', { n: sessions.length }))}">${sessBlocks}</div>
      </div>
      <div class="dy-hr-detail" aria-live="polite">${dyHourDetailHtml(busy)}</div>
      <div class="dy-parts">${parts}</div>
    </section>`;
}

// The box under the bars: one hour's plays, top song (with ▶ ⋮) and cover
function dyHourDetailHtml(i) {
  const x = _dyTod && _dyTod.hours[i];
  if (!x) return '';
  const range = dyHourLabel(i) + ' – ' + dyHourLabel((i + 1) % 24);
  if (!x.n) return `<span class="dy-thumb is-emoji" aria-hidden="true">💤</span>
      <span class="dy-mem-text"><span class="dy-hr-range">${esc(range)}</span><span class="dy-mem-sub">${esc(t('dy_hr_none'))}</span></span>`;
  // The strip already loaded this hour's cover: reuse it
  const img = document.querySelector('#dytl-' + i + ' img');
  const cover = img && img.src ? `<span class="dy-thumb is-lg"><img src="${esc(img.src)}" alt=""></span>`
                               : `<span class="dy-thumb is-lg"><span class="thumb-initials">${esc(initials(x.label))}</span></span>`;
  const s = x.song;
  return `${cover}
      <span class="dy-mem-text">
        <span class="dy-hr-range">${esc(range)}${i === _dyTod.busy ? ` <span class="dy-part-tag">${esc(t('dy_busiest'))}</span>` : ''}</span>
        <span class="dy-hr-n">${esc(tCount('plays', x.n))}</span>
        <span class="ns-x-line" title="${esc(s.title + ' — ' + s.artist)}">${dySongMain(s.title, s.artist)}${s.n > 1 ? ` <span>· ${esc(t('dy_times', { n: s.n }))}</span>` : ''}</span>
      </span>
      <span class="dy-hr-play"${_eaAttrs('songs', { title: s.title, artist: s.artist, album: s.album && s.album !== '—' ? s.album : '', key: songKey(s) })}>${_eaBtns()}</span>`;
}

function dyPickHour(i) {
  const sec = document.querySelector('#dailyBottom .dy-tod-sec');
  if (!sec || !_dyTod) return;
  sec.querySelectorAll('.dy-hr').forEach(b => b.classList.toggle('is-picked', +b.dataset.hr === i));
  const box = sec.querySelector('.dy-hr-detail');
  if (box.dataset.hr === String(i)) return;
  box.dataset.hr = i;
  box.innerHTML = dyHourDetailHtml(i);
}

// Tap a part of the day: light its six hours (tap again to clear)
function dyPickPart(btn) {
  const sec = btn.closest('.dy-tod-sec');
  const on = btn.getAttribute('aria-pressed') !== 'true';
  sec.querySelectorAll('.dy-part').forEach(b => { b.setAttribute('aria-pressed', b === btn && on); b.classList.toggle('is-on', b === btn && on); });
  const a = +btn.dataset.a, z = +btn.dataset.z;
  sec.querySelector('.dy-hours').classList.toggle('has-part', on);
  sec.querySelectorAll('.dy-hr').forEach(b => { const hr = +b.dataset.hr; b.classList.toggle('in-part', on && hr >= a && hr < z); });
  if (!on) return;
  // Show the part's busiest hour in the box
  let best = a;
  for (let i = a; i < z; i++) if (_dyTod.hours[i].n > _dyTod.hours[best].n) best = i;
  dyPickHour(best);
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
  const el = document.querySelector('#dailyDay .dy-diary-status');
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
  const now = _dyDiary.days[ds].mood || '';
  document.querySelectorAll('#dailyDay .dy-mood').forEach(b => {
    b.classList.toggle('active', b.dataset.mood === now);
    b.setAttribute('aria-pressed', b.dataset.mood === now);
  });
  const sub = document.querySelector('#dailyDay .dy-diary-sub');
  if (sub) sub.innerHTML = dyDiarySubHtml(now);
}

function dyNoteInput(el) {
  dyDiarySet(dyViewedDay(), { note: el.value.slice(0, DY_NOTE_MAX) });
  const c = document.querySelector('#dailyDay .dy-note-count');
  if (c) {
    c.textContent = el.value.length + ' / ' + DY_NOTE_MAX;
    c.classList.toggle('is-near', el.value.length > DY_NOTE_MAX - 50);   // warn near the limit
  }
}

function dyDiaryHtml(ds) {
  const e = _dyDiary.days[ds] || {};
  const signedIn = typeof dcIsSignedIn === 'function' && dcIsSignedIn();
  // Each mood is a chip: the emoji with its name under it, so you can tell
  // them apart without hovering
  const moods = DY_MOODS.map((m, i) => {
    const lbl = t('dy_mood_' + DY_MOOD_KEYS[i]);
    return `<button type="button" class="dy-mood${e.mood === m ? ' active' : ''}" data-mood="${m}" onclick="dySetMood('${m}')" title="${esc(lbl)}" aria-pressed="${e.mood === m}"><span class="dy-mood-em" aria-hidden="true">${m}</span><span class="dy-mood-lbl">${esc(lbl)}</span></button>`;
  }).join('');
  const note = e.note || '';
  // Same header as the cards under it: icon, heading, and a line that is
  // either the mood you picked or a nudge to pick one
  return `
    <section class="dy-tod dy-diary" aria-label="${esc(t('dy_diary_title'))}">
      ${dySecHead('📝', t('dy_diary_title'), `<span class="dy-diary-sub">${dyDiarySubHtml(e.mood)}</span>`)}
      <div class="dy-moods" role="group" aria-label="${esc(t('dy_mood_label'))}">${moods}</div>
      <textarea class="dy-note" id="dyNote" rows="3" maxlength="${DY_NOTE_MAX}" placeholder="${esc(t('dy_note_ph'))}" oninput="dyNoteInput(this)">${esc(note)}</textarea>
      <div class="dy-note-foot">
        <span class="dy-diary-status">${esc(signedIn ? '' : t('dy_diary_local_hint'))}</span>
        <span class="dy-note-count${note.length > DY_NOTE_MAX - 50 ? ' is-near' : ''}">${note.length} / ${DY_NOTE_MAX}</span>
      </div>
    </section>`;
}

// The line under "Your day": the picked mood ("😄 Great") or the nudge
function dyDiarySubHtml(mood) {
  const i = DY_MOODS.indexOf(mood);
  return i < 0 ? esc(t('dy_diary_ask'))
    : `<span class="dy-diary-mood">${mood} ${esc(t('dy_mood_' + DY_MOOD_KEYS[i]))}</span>`;
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
  // While the share window is open on top, Esc closes it and the arrows do nothing
  const sh = document.getElementById('dyCalShareModal');
  if (sh && sh.classList.contains('open')) { if (e.key === 'Escape') dyCalShareClose(); return; }
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
        <!-- Share this month as a picture (dyCalShareOpen) -->
        <button type="button" class="dy-cal-nav dy-cal-share" onclick="dyCalShareOpen()" title="${esc(t('dy_cal_share_title'))}" aria-label="${esc(t('dy_cal_share_title'))}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg></button>
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

// ─── CALENDAR SHARE IMAGE ─────────────────────────────────────────────────
/* The month on show in the calendar as a picture: every day's #1 cover in a
   7-column grid, with the moods and a short month summary. Built on the same
   share-card system as the other images (app.js: SHARE_FORMATS, shPalette,
   shShell, shFooter, shCapture, shShareNow), so formats, palettes and the
   phone share sheet behave the same. The window is built here rather than in
   index.html because it only exists while the calendar is open. */
const dyCalCard = { palette: 'app', format: 'portrait', quality: 2, moods: true, stats: true, footer: true };
try { Object.assign(dyCalCard, JSON.parse(localStorage.getItem('dc_dy_cal_card') || '{}')); } catch {}
function dyCalCardSave() { try { localStorage.setItem('dc_dy_cal_card', JSON.stringify(dyCalCard)); } catch {} }

const _dyCalArt = {};   // prefKey → data URL (null = no picture found)
let _dyCalShareMonth = null;   // { y, m } the card is for

// The month's days with their #1, for the card
function dyCalMonthData(y, m) {
  const h = dyHistory();
  const today = localDateStr(tzNow());
  const daysIn = new Date(y, m + 1, 0).getDate();
  const days = [];
  const ones = {};   // song key → { title, artist, days }
  for (let dnum = 1; dnum <= daysIn; dnum++) {
    const ds = `${y}-${String(m + 1).padStart(2, '0')}-${String(dnum).padStart(2, '0')}`;
    const day = h.byDay[ds];
    const top = (h.charts.songs[ds] || [])[0];
    const diary = dyDiaryGet(ds);
    const cell = { dnum, ds, future: ds > today, mood: diary && diary.mood ? diary.mood : '' };
    if (top && day) {
      const s = day.songs[top.k];
      const album = bestAlbum(s.title, s._albums);
      const hasAlbum = album && album !== '—';
      cell.title = s.title; cell.artist = s.artist;
      cell.art = hasAlbum
        ? { kind: 'albums', item: { album, artist: s.artist }, prefKey: 'album:' + s.artist.toLowerCase() + '|||' + album.toLowerCase() }
        : { kind: 'songs', item: { title: s.title, artist: s.artist }, prefKey: 'song:' + s.artist.toLowerCase() + '|||' + s.title.toLowerCase() };
      const o = ones[top.k] || (ones[top.k] = { title: s.title, artist: s.artist, days: 0 });
      o.days++;
    }
    days.push(cell);
  }
  const best = Object.values(ones).sort((a, b) => b.days - a.days)[0] || null;
  return { days, listened: days.filter(d => d.title).length, distinct: Object.keys(ones).length, best };
}

// Same picture as the calendar shows: a pinned choice first, else the item's
// preferred source and the usual fallback chain — inlined as a data URL so
// the canvas is not tainted.
async function dyCalPrefetchArt(data) {
  const todo = data.days.filter(d => d.art && !(d.art.prefKey in _dyCalArt));
  await Promise.all(todo.map(async d => {
    const { kind, item, prefKey } = d.art;
    _dyCalArt[prefKey] = null;
    let url = null;
    const choice = typeof imgChoicePrefs !== 'undefined' && imgChoicePrefs[prefKey];
    if (choice) url = choice.source === 'off' ? null : choice.url;
    else {
      const pref = (typeof itemSourcePrefs !== 'undefined' && itemSourcePrefs[prefKey]) || 'deezer';
      if (pref !== 'off') url = await _igFetchArtWithFallback(kind, item, pref);
    }
    _dyCalArt[prefKey] = url ? await _igToDataUrl(url) : null;
  }));
}

function dyCalCardHTML(o) {
  const { y, m } = _dyCalShareMonth;
  const data = dyCalMonthData(y, m);
  const p = shPalette(o.palette === 'cover' ? 'app' : o.palette);
  const d = shDims(o.format);
  const lang = typeof currentLang !== 'undefined' ? currentLang : undefined;
  const title = new Date(y, m, 1).toLocaleDateString(lang, { month: 'long', year: 'numeric' });
  const lead = (new Date(y, m, 1).getDay() - weekStartDay + 7) % 7;
  const rows = Math.ceil((lead + data.days.length) / 7);
  const heads = Array.from({ length: 7 }, (_, i) => new Date(2023, 0, 1 + ((weekStartDay + i) % 7)).toLocaleDateString(lang, { weekday: 'narrow' }));

  // Height left for the grid once the header, weekday row, summary and footer
  // are placed; the cells are square and sized to whichever runs out first
  const padX = 72, gap = o.format === 'post' ? 10 : 12;
  const top = shSafeTop(o.format);
  const headH = 150, wdH = 40;
  const showStats = o.stats && data.listened > 0;
  const statsH = showStats ? (o.format === 'post' ? 96 : 128) : 0;
  const footH = o.footer ? 70 + shSafeBottom(o.format) : shSafeBottom(o.format);
  const availH = d.h - top - headH - wdH - statsH - footH - 24;
  const cell = Math.floor(Math.min((d.w - padX * 2 - gap * 6) / 7, (availH - gap * (rows - 1)) / rows));
  const gridW = cell * 7 + gap * 6;
  const r = Math.round(cell * 0.12);
  const numFs = Math.max(18, Math.round(cell * 0.2));

  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(`<div style="width:${cell}px;height:${cell}px;"></div>`);
  for (const c of data.days) {
    const art = c.art && _dyCalArt[c.art.prefKey];
    // Plain borders and an <img>, not an inset box-shadow or a CSS background
    // image: html2canvas draws both of those as stray boxes over the cover
    const bg = `background:${art ? p.panel : c.title ? _shA(p.accent, 0.18) : c.future ? 'transparent' : p.panel};`;
    const border = c.future ? `border:2px dashed ${p.line};` : `border:1px solid ${p.line2};`;
    const numCol = art ? '#ffffff' : c.title ? p.text : p.faint;
    // No gradient scrim — html2canvas drew its edge as a line across the cover;
    // a stronger shadow keeps the number readable on any picture
    const shadow = art ? 'text-shadow:0 1px 3px rgba(0,0,0,0.9),0 0 8px rgba(0,0,0,0.8),0 0 16px rgba(0,0,0,0.5);' : '';
    cells.push(`<div style="position:relative;width:${cell}px;height:${cell}px;border-radius:${r}px;overflow:hidden;box-sizing:border-box;${bg}${border}">
      ${art ? `<img src="${art}" width="${cell}" height="${cell}" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;display:block;">` : ''}
      <span style="position:absolute;left:${Math.round(cell * 0.09)}px;top:${Math.round(cell * 0.06)}px;font-family:${SH_FONT.display};font-size:${numFs}px;font-weight:800;line-height:1.1;color:${numCol};${shadow}">${c.dnum}</span>
      ${o.moods && c.mood ? `<span style="position:absolute;right:${Math.round(cell * 0.06)}px;bottom:${Math.round(cell * 0.04)}px;font-size:${Math.round(cell * 0.26)}px;line-height:1;">${c.mood}</span>` : ''}
    </div>`);
  }

  const stat = (val, lbl, wide) => `<div style="flex:${wide ? '2 1 0' : '1 1 0'};min-width:0;padding:${o.format === 'post' ? 14 : 20}px 22px;border-radius:18px;background:${p.panel};border:1px solid ${p.line};">
      <div style="font-family:${SH_FONT.display};font-size:${o.format === 'post' ? 30 : 38}px;font-weight:800;line-height:1.1;color:${p.accent};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${val}</div>
      <div style="margin-top:6px;font-family:${SH_FONT.mono};font-size:17px;font-weight:600;color:${p.dim};text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${lbl}</div>
    </div>`;
  const best = data.best;
  const statsHtml = !showStats ? '' : `<div style="display:flex;gap:14px;width:${gridW}px;margin:22px auto 0;">
      ${stat(data.listened, esc(t('dy_cal_st_days')))}
      ${stat(data.distinct, esc(t('dy_cal_st_ones')))}
      ${best ? stat(esc(best.title), esc(t('dy_cal_st_top', { n: best.days })) + ' · ' + esc(best.artist), true) : ''}
    </div>`;

  const headInner = `${shEyebrow(p, t('dy_cal_eyebrow'))}
      <div style="margin-top:18px;font-family:${SH_FONT.display};font-size:${o.format === 'post' ? 74 : 84}px;font-weight:800;line-height:1;color:${p.text};text-transform:capitalize;white-space:nowrap;overflow:hidden;">${esc(title)}</div>`;
  // Story is tall enough that a header pinned to the top leaves a gap above
  // the grid: there the title joins the grid as one block, centred in the frame
  const story = o.format === 'story';
  const inner = `
    ${story ? `<div style="flex-shrink:0;height:${top}px;"></div>` : `<div style="flex-shrink:0;padding:${top}px ${padX}px 0;height:${top + headH}px;box-sizing:border-box;">${headInner}</div>`}
    <div style="flex:1 1 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:24px;">
      ${story ? `<div style="width:${gridW}px;margin-bottom:48px;">${headInner}</div>` : ''}
      <div style="display:grid;grid-template-columns:repeat(7,${cell}px);column-gap:${gap}px;width:${gridW}px;height:${wdH}px;align-items:center;">
        ${heads.map(x => `<span style="text-align:center;font-family:${SH_FONT.mono};font-size:20px;font-weight:700;color:${p.dim};text-transform:uppercase;">${esc(x)}</span>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,${cell}px);gap:${gap}px;width:${gridW}px;">${cells.join('')}</div>
      ${statsHtml}
    </div>
    ${shFooter(p, o.format, { show: o.footer })}`;
  return shShell(p, o.format, inner);
}

function dyCalShareOpen() {
  if (!_dyCal) return;
  _dyCalShareMonth = { ..._dyCal };
  let el = document.getElementById('dyCalShareModal');
  if (!el) {
    el = document.createElement('div');
    el.id = 'dyCalShareModal';
    el.className = 'ig-modal-overlay';
    el.style.zIndex = '10060';   // above the calendar (.dy-recap, 10050)
    el.addEventListener('click', e => { if (e.target === el) dyCalShareClose(); });
    document.body.appendChild(el);
    const cv = document.createElement('div');
    cv.id = 'dyCalCardCanvas';
    cv.style.cssText = 'position:fixed;left:-9999px;top:0;pointer-events:none;';
    document.body.appendChild(cv);
  }
  const fmtBtn = (f, k) => `<button class="sh-seg-btn${dyCalCard.format === f ? ' active' : ''}" data-fmt="${f}" onclick="dyCalShareSet('format','${f}')">${esc(t(k))}</button>`;
  const chk = (k, lbl) => `<label class="ig-ctrl-row"><input type="checkbox"${dyCalCard[k] ? ' checked' : ''} onchange="dyCalShareSet('${k}',this.checked)"><span>${esc(lbl)}</span></label>`;
  el.innerHTML = `
    <div class="ig-modal-box">
      <div class="ig-modal-header">
        <h3>${esc(t('dy_cal_share_title'))}</h3>
        <button class="ig-modal-close" onclick="dyCalShareClose()">${esc(t('btn_close'))}</button>
      </div>
      <div class="ig-modal-body">
        <div class="ig-preview-panel">
          <div class="ig-preview-label">${esc(t('ig_preview_label'))}</div>
          <div class="ig-preview-frame" id="dyCalCardFrame"><div class="ig-preview-inner" id="dyCalCardInner"></div></div>
        </div>
        <div class="ig-controls-panel">
          <div class="sh-group">
            <div class="sh-group-title">${esc(t('sh_palette'))}</div>
            <div class="sh-swatch-row" id="dyCalPaletteRow"></div>
          </div>
          <div class="sh-group">
            <div class="sh-group-title">${esc(t('ig_format'))}</div>
            <div class="sh-seg" id="dyCalFormatBtns">${fmtBtn('post', 'sh_fmt_post')}${fmtBtn('portrait', 'sh_fmt_portrait')}${fmtBtn('story', 'sh_fmt_story')}</div>
          </div>
          <div class="sh-group">
            <div class="sh-group-title">${esc(t('ig_show_hide'))}</div>
            ${chk('moods', t('dy_cal_opt_moods'))}
            ${chk('stats', t('dy_cal_opt_stats'))}
            ${chk('footer', t('ig_footer_branding'))}
          </div>
          <div class="sh-group">
            <div class="sh-group-title">${esc(t('sh_quality'))}</div>
            <div class="sh-seg" id="dyCalQualityBtns">
              <button class="sh-seg-btn" data-q="1" onclick="dyCalShareSet('quality',1)">${esc(t('sh_quality_std'))}</button>
              <button class="sh-seg-btn" data-q="2" onclick="dyCalShareSet('quality',2)">${esc(t('sh_quality_high'))}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="ig-modal-footer">
        <button class="ig-modal-close" onclick="dyCalShareClose()">${esc(t('btn_cancel'))}</button>
        <button class="ig-copy-btn" id="dyCalCopyBtn" onclick="dyCalShareCopy()">📋 ${esc(t('dy_cal_copy'))}</button>
        <button class="ig-copy-btn ig-share-native-btn" id="dyCalShareBtn" onclick="dyCalShareNow()">📤 ${esc(t('dy_cal_share'))}</button>
        <button class="ig-download-btn" id="dyCalDownloadBtn" onclick="dyCalShareDownload()">${esc(t('btn_download_image'))}</button>
      </div>
    </div>`;
  el.classList.add('open');
  dyCalSharePickers();
  dyCalShareRender();
  // Covers arrive after the first paint; render again once they are in
  dyCalPrefetchArt(dyCalMonthData(_dyCalShareMonth.y, _dyCalShareMonth.m)).then(() => {
    if (document.getElementById('dyCalShareModal')?.classList.contains('open')) dyCalShareRender();
  });
}

function dyCalShareClose() {
  document.getElementById('dyCalShareModal')?.classList.remove('open');
}

// The palette chips, minus Cover (a month has no single cover to take it from)
function dyCalSharePickers() {
  const row = document.getElementById('dyCalPaletteRow');
  if (row) row.innerHTML = SHARE_PALETTES.filter(pl => pl.id !== 'cover').map(pl =>
    `<button class="sh-swatch${pl.id === dyCalCard.palette ? ' active' : ''}" onclick="dyCalShareSet('palette','${esc(pl.id)}')" title="${esc(pl.name)}">
       <span class="sh-swatch-dots"><span class="sh-swatch-dot" style="background:${pl.chip[0]};"></span><span class="sh-swatch-dot" style="background:${pl.chip[1]};"></span></span>
       <span class="sh-swatch-name">${esc(pl.name)}</span>
     </button>`).join('');
  document.querySelectorAll('#dyCalFormatBtns .sh-seg-btn').forEach(b => b.classList.toggle('active', b.dataset.fmt === dyCalCard.format));
  document.querySelectorAll('#dyCalQualityBtns .sh-seg-btn').forEach(b => b.classList.toggle('active', +b.dataset.q === dyCalCard.quality));
}

function dyCalShareSet(k, v) {
  dyCalCard[k] = v;
  dyCalCardSave();
  dyCalSharePickers();
  if (k !== 'quality') dyCalShareRender();
  else shPrepareShare('dyCalCardCanvas', 'dyCalShareBtn', _dyCalShareOpts);
}

function dyCalShareRender() {
  if (!_dyCalShareMonth) return;
  const html = dyCalCardHTML(dyCalCard);
  const cv = document.getElementById('dyCalCardCanvas');
  const d = shDims(dyCalCard.format);
  cv.style.width = d.w + 'px';
  cv.style.height = d.h + 'px';
  cv.innerHTML = html;
  shFitPreview('dyCalCardFrame', 'dyCalCardInner', dyCalCard.format, html);
  shPrepareShare('dyCalCardCanvas', 'dyCalShareBtn', _dyCalShareOpts);
}

function _dyCalShareOpts() {
  const { y, m } = _dyCalShareMonth;
  return { format: dyCalCard.format, quality: dyCalCard.quality, fileName: `dankcharts_daily_${y}-${String(m + 1).padStart(2, '0')}_${dyCalCard.format}.png` };
}

async function dyCalShareDownload() {
  const btn = document.getElementById('dyCalDownloadBtn');
  const orig = btn.textContent;
  btn.textContent = '⏳ …'; btn.disabled = true;
  try {
    const cvs = await shCapture('dyCalCardCanvas', dyCalCard.format, dyCalCard.quality);
    const link = document.createElement('a');
    link.download = _dyCalShareOpts().fileName;
    link.href = cvs.toDataURL('image/png');
    link.click();
  } catch (e) { console.error('Calendar image download failed', e); }
  btn.textContent = orig; btn.disabled = false;
}

async function dyCalShareCopy() {
  if (!navigator.clipboard?.write) { dyCalShareDownload(); return; }
  const btn = document.getElementById('dyCalCopyBtn');
  const orig = btn.textContent;
  btn.textContent = '⏳ …'; btn.disabled = true;
  try {
    const cvs = await shCapture('dyCalCardCanvas', dyCalCard.format, dyCalCard.quality);
    const blob = await shCanvasBlob(cvs);
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    btn.textContent = '✓ ' + t('dy_cal_copied');
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1800);
  } catch (e) {
    btn.textContent = orig; btn.disabled = false;
    dyCalShareDownload();
  }
}

function dyCalShareNow() {
  shShareNow('dyCalCardCanvas', 'dyCalShareBtn', _dyCalShareOpts, dyCalShareDownload);
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
      stats.periodsOnChart[type][r.k] = f.days || 1;
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
  // Line icons in the style of the chart type and layout buttons, instead of emoji
  const ic = d => `<svg class="dy-act-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const I = {
    recap:  ic('<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>'),
    share:  ic('<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>'),
    play:   ic('<path d="M7 4.5v15l12-7.5z"/>'),
    cal:    ic('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>'),
    save:   ic('<path d="M3 6h12M3 12h12M3 18h7"/><path d="M18 14v7M14.5 17.5h7"/>'),
    export: ic('<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>'),
  };
  return `
    <div class="dy-actions">
      <button type="button" class="dy-act dy-act-main" onclick="dyOpenRecap()"${off}>${I.recap}${esc(t('dy_recap'))}</button>
      <button type="button" class="dy-act" onclick="openIgPreviewModal('${type}')"${off}>${I.share}${esc(t('dy_share_img'))}</button>
      <button type="button" class="dy-act" onclick="dyPlayTop()"${off}>${I.play}${esc(t('dy_play_top', { n: nSongs }))}</button>
      <button type="button" class="dy-act" onclick="dyOpenCalendar()">${I.cal}${esc(t('dy_cal_title'))}</button>
      <button type="button" class="dy-act" onclick="dySavePlaylist()"${off}>${I.save}${esc(t('dy_save_pl'))}</button>
      <button type="button" class="dy-act" onclick="dyExportPlaylist()"${off} title="${esc(t('dy_export_tip'))}">${I.export}${esc(t('dy_export'))}</button>
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
  const lists = [];      // { key, icon, title, n, body } for the pills
  let cheer = 0;         // milestones + records + streaks going, for the summary line
  // What a key is, for its name and its cover
  const info = {
    songs: k => {
      const s = (day && day.songs[k]) || allSongObj(k);
      return s ? { type: 'song', title: s.title, artist: s.artist, album: s._albums ? bestAlbum(s.title, s._albums) : (s.album || ''), name: s.title + ' — ' + s.artist }
               : { type: 'song', title: k, artist: '', name: k };
    },
    artists: k => ({ type: 'artist', artist: k, name: k }),
    albums: k => { const i = k.lastIndexOf('|||'); const al = i < 0 ? k : k.slice(0, i), ar = i < 0 ? '' : k.slice(i + 3); return { type: 'album', album: al, artist: ar, name: ar ? al + ' — ' + ar : al }; },
  };
  // "<b>Title</b> — Artist" (or just the bold name) for a key
  const mainOf = x => x.type === 'song' && x.artist ? dySongMain(x.title, x.artist)
    : x.type === 'album' && x.artist ? dySongMain(x.album, x.artist) : `<b>${esc(x.name)}</b>`;
  const thumbOf = x => x.artist ? dyThumb(x.type, x) : dyLead('🎵');
  // A row about a song / artist / album: its cover, name, and a line under it
  const keyRow = (type, k, sub, o) => { const x = info[type](k); return dyRow(Object.assign({ lead: thumbOf(x), main: mainOf(x), tip: x.name, sub: esc(sub) }, o || {})); };

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

  let awards = '';
  if (day) {
    // ── Daily awards: trophy cards with the winner's cover ──
    const cards = [];
    const top = type => (h.charts[type][ds] || [])[0];
    const award = (icon, lbl, x) => `<li class="dy-award">
        <span class="dy-award-ic" aria-hidden="true">${icon}</span>
        ${x.artist ? dyThumb(x.type, x, 'is-lg') : ''}
        <span class="dy-award-lbl">${esc(lbl)}</span>
        <span class="dy-award-name" title="${esc(x.name)}">${esc(x.type === 'album' ? x.album : x.type === 'song' ? x.title : x.name)}</span>
        ${x.type !== 'artist' && x.artist ? `<span class="dy-award-by">${esc(x.artist)}</span>` : ''}
      </li>`;
    if (top('songs')) cards.push(award('🎵', t('dy_aw_song'), info.songs(top('songs').k)));
    if (top('artists')) cards.push(award('🎤', t('dy_aw_artist'), info.artists(top('artists').k)));
    if (top('albums')) cards.push(award('💿', t('dy_aw_album'), info.albums(top('albums').k)));
    const fresh = Object.keys(day.songs).filter(k => !before.songs[k]).sort((a, b) => day.songs[b].count - day.songs[a].count)[0];
    if (fresh) cards.push(award('🔭', t('dy_aw_discovery'), info.songs(fresh)));
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
    if (comeback) cards.push(award('🔄', t('dy_aw_comeback'), info.songs(comeback.k)));
    if (cards.length) awards = `<div class="dy-awards-wrap"><span class="ns-x-title">${esc(t('dy_aw_title'))}</span><ul class="dy-awards">${cards.join('')}</ul></div>`;

    // ── Milestones hit ──
    const hit = [];
    for (const type of ['songs', 'artists', 'albums']) {
      for (const k in day[type]) {
        const ms = dyMsCrossed(type, before[type][k] || 0, after[type][k] || 0);
        if (ms.length) hit.push({ type, k, m: ms[ms.length - 1] });
      }
    }
    hit.sort((a, b) => b.m - a.m);
    cheer += hit.length;
    if (hit.length) lists.push({ key: 'hit', icon: '🎉', title: t('dy_ms_hit'), n: hit.length,
      body: hit.slice(0, 4).map(x => keyRow(x.type, x.k, t('dy_ms_reached', { n: x.m.toLocaleString() }), { badge: esc(x.m.toLocaleString()), badgeCls: 'is-gold' })).join('') });

    // ── Records broken ──
    const recs = [];
    const topSong = Object.entries(day.songs).sort((a, b) => b[1].count - a[1].count)[0];
    const topArtist = Object.entries(day.artists).sort((a, b) => b[1].count - a[1].count)[0];
    if (topSong && anySongBest && topSong[1].count > anySongBest)
      recs.push(keyRow('songs', topSong[0], t('dy_rec_any_song') + ' · ' + t('dy_rec_vs', { n: topSong[1].count, was: anySongBest }), { badge: '📈 ' + topSong[1].count, badgeCls: 'is-gold' }));
    if (topArtist && anyArtistBest && topArtist[1].count > anyArtistBest)
      recs.push(keyRow('artists', topArtist[0], t('dy_rec_any_artist') + ' · ' + t('dy_rec_vs', { n: topArtist[1].count, was: anyArtistBest }), { badge: '📈 ' + topArtist[1].count, badgeCls: 'is-gold' }));
    for (const type of ['songs', 'artists']) {
      Object.entries(day[type]).filter(([k, e]) => e.count >= 3 && bestDay[type][k] && e.count > bestDay[type][k])
        .sort((a, b) => b[1].count - a[1].count).slice(0, 2)
        .forEach(([k, e]) => recs.push(keyRow(type, k, t('dy_rec_own', { n: e.count, was: bestDay[type][k] }), { badge: '📈 ' + e.count })));
    }
    cheer += recs.length;
    if (recs.length) lists.push({ key: 'rec', icon: '📈', title: t('dy_rec_title'), n: Math.min(4, recs.length), body: recs.slice(0, 4).join('') +
      `<li class="dy-mem-more"><button type="button" class="dy-link" onclick="dcGoTab('records')">${esc(t('dy_rec_see'))} →</button></li>` });

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
    // Today is not over yet: its runs are not "ended" but listed under
    // "Keep your streaks alive"
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
    cheer += going.length;
    const sRows = going.slice(0, 3).map(x => keyRow(x.type, x.k, t('dy_streak_on', { n: x.n }), { badge: '🔥 ' + x.n, badgeCls: 'is-hot' }))
      .concat(ended.slice(0, 2).map(x => {
        const s = x.type === 'songs' ? h.byDay[yest].songs[x.k] : null;
        const xi = s ? { type: 'song', title: s.title, artist: s.artist, album: bestAlbum(s.title, s._albums), name: s.title + ' — ' + s.artist } : info.artists(x.k);
        return dyRow({ lead: thumbOf(xi), main: mainOf(xi), tip: xi.name, sub: esc(t('dy_streak_ended', { n: x.n })), badge: '💔 ' + x.n, cls: 'is-ended' });
      }));
    if (sRows.length) lists.push({ key: 'streak', icon: '🔥', title: t('dy_streaks'), n: sRows.length, body: sRows.join('') });
  }

  // ── Goals: how the day stands against your best (same weekday, and ever) ──
  const goals = [];
  const n = day ? day.plays : 0;
  const isToday = currentOffset === 0;
  const dayName = dyDayName(ds);
  const goal = (best, newKey, leftKey, shortKey) => {
    if (!best) return;
    if (n > best) goals.push(dyRow({ lead: dyLead('🏅'), main: `<b>${esc(t(newKey, { day: dayName }))}</b>`, sub: esc(t('dy_goal_beat', { was: best.toLocaleString() })), pct: 100, badge: esc(n.toLocaleString()), badgeCls: 'is-gold' }));
    else goals.push(dyRow({ lead: dyLead('🎯'), main: `<b>${esc(t(isToday ? leftKey : shortKey, { n: (best - n + 1).toLocaleString(), day: dayName }))}</b>`, sub: esc(t('dy_goal_best', { n: best.toLocaleString() })), pct: n / best * 100, badge: esc(n.toLocaleString() + ' / ' + best.toLocaleString()) }));
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
  // Its own list ("Almost there"), saying the count now and what is left,
  // with a bar of how far along it is: "999 plays · 1 more to reach 1,000"
  const closeRows = close.slice(0, 3).map(x => keyRow(x.type, x.k,
    t('dy_goal_close', { now: tCount('plays', x.m - x.left), left: x.left.toLocaleString(), m: x.m.toLocaleString() }),
    { pct: (x.m - x.left) / x.m * 100, badge: '−' + x.left.toLocaleString() }));

  // Today only: streaks that end unless played today
  let keepRows = [];
  if (isToday) {
    const yest = dyShift(ds, -1);
    const alive = [];
    if (h.byDay[yest]) {
      for (const type of ['artists', 'songs']) {
        for (const k in h.byDay[yest][type]) {
          if (day && day[type][k]) continue;
          const len = dyRunEnding(h, type, k, yest);
          if (len >= 3) alive.push({ type, k, len });
        }
      }
    }
    keepRows = alive.sort((a, b) => b.len - a.len).slice(0, 3).map(x => {
      const s = x.type === 'songs' ? h.byDay[yest].songs[x.k] : null;
      const xi = s ? { type: 'song', title: s.title, artist: s.artist, album: bestAlbum(s.title, s._albums), name: s.title + ' — ' + s.artist } : info.artists(x.k);
      return dyRow({ lead: thumbOf(xi), main: mainOf(xi), tip: xi.name, sub: esc(t('dy_goal_keep', { n: x.len })), badge: '⏳ ' + x.len, badgeCls: 'is-hot' });
    });
  }
  if (goals.length) lists.push({ key: 'goals', icon: '🎯', title: t('dy_goals'), n: 0, body: goals.join('') });
  if (closeRows.length) lists.push({ key: 'close', icon: '⏳', title: t('dy_close_title'), n: closeRows.length, body: closeRows.join('') });
  // Its own list, so the day's goals and the streaks at stake read apart
  if (keepRows.length) lists.push({ key: 'keep', icon: '🕯️', title: t('dy_keep_title'), n: keepRows.length, body: keepRows.join('') });

  if (!awards && !lists.length) return '';
  const sub = cheer ? esc(t(cheer === 1 ? 'dy_ms_sub_one' : 'dy_ms_sub_other', { n: cheer })) : '';
  return `
    <section class="dy-tod dy-ms" aria-label="${esc(t('dy_ms_title'))}">
      ${dySecHead('🏆', t('dy_ms_title'), sub)}
      ${awards}
      ${dyTabsHtml('ms', lists)}
    </section>`;
}

// A song key's title, artist and album, from its newest play (for keys not played on the day)
let _dyNameCache = null;
function allSongObj(k) {
  if (!_dyNameCache || _dyNameCache.n !== allPlays.length) {
    const m = new Map();
    for (const p of allPlays) { const sk = songKey(p); if (!m.has(sk)) m.set(sk, { title: p.title, artist: p.artist, album: p.album && p.album !== '—' ? p.album : '' }); }
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

// One remembered song: cover, title, artist, a muted line, and ▶ ⋮
function dyMemSong(s, sub) {
  const k = s.title.toLowerCase().trim() + '|||' + s.artist.toLowerCase().trim();
  return dyRow({
    attrs: _eaAttrs('songs', { title: s.title, artist: s.artist, album: s.album || '', key: k }),
    lead: dyThumb('song', s), main: dySongMain(s.title, s.artist), tip: s.title + ' — ' + s.artist,
    sub: esc(sub), tail: _eaBtns(),
  });
}

function dyMemArtist(name, sub) {
  return dyRow({
    attrs: _eaAttrs('artists', { artist: name, key: name }),
    lead: dyThumb('artist', { artist: name }), main: `<b>${chartNameLink(name, 'openArtistModal', name)}</b>`,
    sub: esc(sub), tail: _eaBtns(),
  });
}

function dyMemoriesHtml(h, ds) {
  const day = h.byDay[ds];
  const startMs = +dyDate(ds) - 12 * 3600000;   // midnight at the start of ds
  const blocks = [];
  let yearAgo = null;   // last year's top song, for the card's summary line

  // ── On this day ──
  const otd = [];
  for (let y = 1; y <= 3; y++) {
    const past = (+ds.slice(0, 4) - y) + ds.slice(4);
    const d = h.byDay[past];
    if (!d) continue;
    let song = null, art = null;
    for (const k in d.songs) if (!song || d.songs[k].count > song.count) song = d.songs[k];
    for (const a in d.artists) if (!art || d.artists[a].count > art[1]) art = [a, d.artists[a].count];
    if (y === 1) yearAgo = song;
    const off = Math.round((dyDate(localDateStr(tzNow())) - dyDate(past)) / DY_DAY_MS);
    otd.push(dyRow({
      cls: 'is-link', attrs: ` role="button" tabindex="0" onclick="dyGoOffset(${off})" onkeydown="if(event.key==='Enter')dyGoOffset(${off})"`,
      lead: `<span class="dy-mem-year">${esc(t(y === 1 ? 'dy_years_ago_one' : 'dy_years_ago_other', { n: y }))}</span>` +
        dyThumb('song', { title: song.title, artist: song.artist, album: bestAlbum(song.title, song._albums) }),
      main: dySongMain(song.title, song.artist), tip: song.title + ' — ' + song.artist,
      sub: `${esc(t('ns_x_top'))}: ${esc(art[0])} · ${esc(tCount('plays', d.plays))}`,
      tail: `<span class="dy-go" aria-hidden="true">›</span>`,
    }));
  }
  if (otd.length) blocks.push({ key: 'otd', icon: '📅', title: t('dy_otd'), n: otd.length, body: otd.join('') });

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
  if (forgot.length) blocks.push({ key: 'forgot', icon: '💤', title: t('dy_forgot'), n: forgot.length, body: forgot.join('') });

  // ── Throwback artists ──
  const throwback = Object.entries(artists).sort((a, b) => b[1].n - a[1].n).slice(0, 20)
    .map(([a, r], i) => ({ a, r, rank: i + 1 }))
    .filter(x => startMs - x.r.last >= 30 * DY_DAY_MS && !(day && day.artists[x.a])).slice(0, 3)
    .map(x => dyMemArtist(x.a, t('dy_throw_line', { rank: x.rank, t: dyGap(startMs - x.r.last) })));
  if (throwback.length) blocks.push({ key: 'throw', icon: '📼', title: t('dy_throw'), n: throwback.length, body: throwback.join('') });

  if (day) {
    // ── Comebacks: back after 6+ months ──
    const back = [];
    for (const k in day.songs) {
      const s = songs[k];
      if (s && day.firstMs - s.last >= 182 * DY_DAY_MS) back.push({ k, s, gap: day.firstMs - s.last, cur: day.songs[k] });
    }
    back.sort((a, b) => b.gap - a.gap);
    if (back.length) blocks.push({ key: 'back', icon: '🔄', title: t('dy_comeback'), n: Math.min(3, back.length), body: back.slice(0, 3).map(x =>
      dyMemSong({ title: x.cur.title, artist: x.cur.artist, album: bestAlbum(x.cur.title, x.cur._albums) }, t('dy_comeback_line', { t: dyGap(x.gap) }))).join('') });

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
      blocks.push({ key: 'first', icon: '✨', title: t('dy_first'), n: newArtists.length + newSongs.length, body: rows.join('') + songRows.join('') + more });
    }
  }

  if (!blocks.length) return '';
  const sub = yearAgo ? esc(t('dy_mem_sub_year', { song: yearAgo.title })) : '';
  return `
    <section class="dy-tod dy-mem" aria-label="${esc(t('dy_mem_title'))}">
      ${dySecHead('📼', t('dy_mem_title'), sub)}
      ${dyTabsHtml('mem', blocks)}
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
  if (!el) return;
  _dyImgs = [];
  el.outerHTML = dyPatternsHtml(dyHistory(), ds);
  dyFlushImgs();
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

  /* Each pattern is a card: emoji, label, one big figure, then the detail.
     big is HTML (already escaped). */
  const card = (icon, title, big, body, extra, headExtra) => `<div class="dy-pat"${extra || ''}>
      <span class="dy-pat-head"><span class="dy-pat-ic" aria-hidden="true">${icon}</span><span class="ns-x-title">${esc(title)}</span>${headExtra || ''}</span>
      <span class="dy-pat-big">${big}</span>
      ${body}
    </div>`;
  const line = (html, tip) => `<span class="ns-x-line"${tip ? ` title="${esc(tip)}"` : ''}>${html}</span>`;

  // Most replayed carries ▶ / ⋮ like a chart row (in the card's head, so the
  // song keeps the width), and the song's cover
  const mostAlbum = most ? bestAlbum(most.title, most._albums) : '';
  const mostCard = card('🔁', t('dy_pat_most'), most ? `${most.count}<small>×</small>` : '—', most
    ? `<span class="dy-pat-song">${dyThumb('song', { title: most.title, artist: most.artist, album: mostAlbum })}
        <span class="dy-mem-text">${line(`<b>${esc(most.title)}</b>`, most.title + ' — ' + most.artist)}${line(`<span>${esc(most.artist)}</span>`)}</span></span>`
    : '', most ? _eaAttrs('songs', { title: most.title, artist: most.artist, album: mostAlbum || '', key: songKey(most) }) : '', most ? _eaBtns() : '');
  const b2bCard = card('⏩', t('dy_pat_b2b'), sRun.n > 1 ? `${sRun.n}<small>×</small>` : '—',
    (sRun.n > 1 ? line(`<b>${esc(sRun.title)}</b> <span>· ${esc(t('dy_in_a_row', { n: sRun.n }))}</span>`, sRun.title + ' — ' + sRun.artist) : line(`<span>${esc(t('dy_no_repeats'))}</span>`)) +
    (aRun.n > 1 ? line(`${esc(aRun.k)} <span>· ${esc(t('dy_plays_in_a_row', { n: aRun.n }))}</span>`) : ''));
  const fullCard = card('💿', t('dy_pat_full'), String(full.length), full.length
    ? full.slice(0, 2).map(f => `<span class="dy-pat-song">${dyThumb('album', { album: f.album, artist: f.artist })}<span class="dy-mem-text">${line(`<b>${esc(f.album)}</b>`, f.album + ' — ' + f.artist)}${line(`<span>${esc(t(f.official ? 'dy_full_tracks' : 'dy_full_tracks_lib', { n: f.tracks }))}</span>`)}</span></span>`).join('')
    : line(`<span>${esc(t('dy_full_none'))}</span>`), full.length ? ' data-has="1"' : '');
  const marker = `<span class="dy-gauge"><i style="left:${vPct}%"></i>${usualV !== null ? `<u style="left:${Math.round(usualV * 100)}%" title="${esc(t('dy_usual_mark'))}"></u>` : ''}</span>`;
  const label = v >= 0.7 ? 'dy_var_explorer' : v <= 0.35 ? 'dy_var_loyal' : 'dy_var_mixed';
  const varIcon = v >= 0.7 ? '🧭' : v <= 0.35 ? '💞' : '⚖️';
  const varCard = card(varIcon, t('dy_pat_variety'), esc(t(label)),
    line(`<span>${esc(t('dy_var_line', { songs: Object.keys(day.songs).length, plays: day.plays }))}</span>`) +
    marker + `<span class="dy-gauge-ends"><span>${esc(t('dy_var_loyal'))}</span><span>${esc(t('dy_var_explorer'))}</span></span>`);

  return `
    <section class="dy-tod dy-pats" aria-label="${esc(t('dy_pat_title'))}">
      ${dySecHead('🧩', t('dy_pat_title'), esc(t('dy_pat_persona_' + label.slice(7))))}
      <div class="dy-pat-grid">${mostCard}${b2bCard}${fullCard}${varCard}</div>
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
    const seg = `<circle data-i="${i}" cx="32" cy="32" r="${r}" fill="none" stroke="${DY_GENRE_COLORS[i]}" stroke-width="10" stroke-dasharray="${len.toFixed(2)} ${(c - len).toFixed(2)}" stroke-dashoffset="${(-at).toFixed(2)}" transform="rotate(-90 32 32)"/>`;
    at += len;
    return seg;
  }).join('');
  // Legend entries are buttons: hover or tap one to light its slice and show
  // it in the middle of the donut (dyGenreHl)
  const pct = n => Math.round(n / known * 100);
  const legend = top.map(([g, n], i) =>
    `<li><button type="button" data-i="${i}" data-g="${esc(g)}" data-p="${pct(n)}" onmouseenter="dyGenreHl(this)" onfocus="dyGenreHl(this)" onclick="dyGenreHl(this)" onmouseleave="dyGenreHl(null, this)">
      <i style="background:${DY_GENRE_COLORS[i]}"></i><span class="dy-genre-name">${esc(g)}</span><span class="dy-genre-pct">${pct(n)}%</span></button></li>`).join('');
  const cover = Math.round(known / plays.length * 100);
  return `
      <div class="dy-genres">
        <div class="dy-donut-wrap">
          <svg class="dy-donut" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${arcs}</svg>
          <span class="dy-donut-c" data-g="${esc(top[0][0])}" data-p="${pct(top[0][1])}"><b>${pct(top[0][1])}%</b><span>${esc(top[0][0])}</span></span>
        </div>
        <div class="ns-x-text">
          <span class="ns-x-title">${esc(t('dy_genre_title'))}</span>
          <ul class="dy-genre-list">${legend}</ul>
          ${cover < 100 ? `<span class="dy-genre-note">${esc(t('dy_genre_cover', { pct: cover }))}</span>` : ''}
        </div>
      </div>`;
}

// Light one genre's slice (btn) or go back to the top genre (btn = null)
function dyGenreHl(btn, from) {
  const wrap = (btn || from).closest('.dy-genres');
  const c = wrap.querySelector('.dy-donut-c');
  if (btn) wrap.dataset.hl = btn.dataset.i; else delete wrap.dataset.hl;
  wrap.querySelectorAll('.dy-donut circle').forEach(x => x.classList.toggle('is-hl', !!btn && x.dataset.i === btn.dataset.i));
  wrap.querySelectorAll('.dy-genre-list button').forEach(x => x.classList.toggle('is-hl', x === btn));
  const g = btn ? btn.dataset.g : c.dataset.g, p = btn ? btn.dataset.p : c.dataset.p;
  c.innerHTML = `<b>${esc(p)}%</b><span>${esc(g)}</span>`;
}

// ─── DAY PANEL (phase 2) ──────────────────────────────────────────────────
/* A card after the chart about the day on screen (redone 2026-10-18 with
   covers, so it is not just lines of text):
     - a ring of the day's plays against your usual day (the average over the
       days you listened in the 30 before it), with a ▲ / ▼ badge for how far
       above or below it the day is
     - the 7 days ending on it as bars, the day itself lit and a dashed line
       at the week's average; click a bar to go to that day. Beside them the
       change on the 7 days before
     - a strip of four tiles with covers: the day's first and last song (with
       their times when the library has them), its top artist, and the song
       on repeat (the one played on the most of those 7 days, 3 or more) */
function dyPanelHtml(h, ds) {
  const day = h.byDay[ds];
  const n = day ? day.plays : 0;

  // Your usual day, before this one
  let sum = 0, cnt = 0;
  for (let i = 1; i <= 30; i++) { const d = h.byDay[dyShift(ds, -i)]; if (d) { sum += d.plays; cnt++; } }
  const usual = cnt ? Math.round(sum / cnt) : 0;

  // ▲ 12% / ▼ 35% / ± 0%, in the same colours as the week's change
  const pctBadge = pct => `<span class="ns-wk-pct dy-pct-pill ${pct > 0 ? 'is-up' : pct < 0 ? 'is-down' : ''}">${pct > 0 ? '▲ ' : pct < 0 ? '▼ ' : '± '}${Math.abs(pct)}%</span>`;

  const dayTitle = currentOffset === 0 ? t('dy_today') : currentOffset === 1 ? t('dy_yesterday') : dyDayName(ds);
  const usualPct = usual && n ? Math.round((n - usual) / usual * 100) : null;
  const dayBlock = `
    <div class="dy-pblock">
      ${dyRingSvg(n, usual)}
      <div class="ns-x-text">
        <span class="ns-x-title">${esc(dayTitle)}${dyLiveBadge()}</span>
        <span class="ns-x-line dy-pbig"><b>${esc(tCount('plays', n))}</b></span>
        ${usualPct !== null ? `<span class="ns-x-line">${pctBadge(usualPct)} <span>${esc(t('dy_vs_usual', { n: usual.toLocaleString() }))}</span></span>`
          : day ? '' : `<span class="ns-x-line"><span>${esc(t('dy_nothing_played'))}</span></span>`}
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
  // The week's average as a dashed line across the bars (--avg: its height in %)
  const avg = wSum / 7;
  const avgLine = wSum ? `<span class="dy-wk-avg" style="--avg:${(avg / max * 100).toFixed(0)}%" title="${esc(t('dy_week_avg', { n: Math.round(avg).toLocaleString() }))}"></span>` : '';

  const weekBlock = `
    <div class="dy-pblock">
      <div class="ns-wk-bars dy-wk-bars">${bars}${avgLine}</div>
      <div class="ns-x-text">
        <span class="ns-x-title">${esc(t('ns_x_week'))}</span>
        <span class="ns-x-line dy-pbig"><b>${esc(tCount('plays', wSum))}</b></span>
        ${pct === null ? '' : `<span class="ns-x-line">${pctBadge(pct)} <span>${esc(t('ns_x_vs_week'))}</span></span>`}
      </div>
    </div>`;

  // ── The tiles ──
  // One tile: a cover, a small label (and time), the name and a quiet second line
  const tile = (lead, lbl, when, main, sub, tip) => `
      <div class="dy-ptile" title="${esc(tip)}">
        ${lead}
        <span class="dy-ptile-text">
          <span class="dy-ptile-lbl">${esc(lbl)}${when ? `<span class="dy-ptile-when">${esc(when)}</span>` : ''}</span>
          <span class="dy-ptile-main">${main}</span>
          <span class="dy-ptile-sub">${sub}</span>
        </span>
      </div>`;
  const tiles = [];
  if (day) {
    const songTile = (lbl, p, ms) => tile(dyThumb('song', { title: p.title, artist: p.artist, album: p.album || '' }), lbl,
      h.timed ? dyClock(ms) : '', esc(p.title), esc(p.artist), p.title + ' — ' + p.artist);
    tiles.push(songTile(t('ns_x_first'), day.firstP, day.firstMs));
    if (day.plays > 1) tiles.push(songTile(t('dy_last'), day.lastP, day.lastMs));
    let top = null;
    for (const [a, e] of Object.entries(day.artists)) if (!top || e.count > top[1]) top = [a, e.count];
    if (top) tiles.push(tile(dyThumb('artist', { artist: top[0] }), t('dy_top_artist'), '',
      chartNameLink(top[0], 'openArtistModal', top[0]), esc(tCount('plays', top[1])), top[0]));
  }

  // On repeat: every song played on 3 or more of these 7 days, most days
  // first (then most plays). With more than one the tile rotates through
  // them (dyRepStart), a thin bar along its foot shows the time to the next,
  // and clicking the tile moves on by hand.
  const songDays = {}, songPlays = {}, songInfo = {};
  for (const w of week) {
    const d = h.byDay[w.ds];
    if (d) for (const k in d.songs) { songDays[k] = (songDays[k] || 0) + 1; songPlays[k] = (songPlays[k] || 0) + d.songs[k].count; songInfo[k] = d.songs[k]; }
  }
  const reps = Object.keys(songDays).filter(k => songDays[k] >= 3)
    .sort((a, b) => songDays[b] - songDays[a] || songPlays[b] - songPlays[a]).slice(0, DY_REP_MAX);
  if (reps.length) {
    const slides = reps.map((k, i) => {
      const info = songInfo[k];
      return `<div class="dy-rep-slide${i ? '' : ' is-on'}" title="${esc(info.title + ' — ' + info.artist)}"${i ? ' aria-hidden="true"' : ''}>
          ${dyThumb('song', { title: info.title, artist: info.artist, album: bestAlbum(info.title, info._albums) })}
          <span class="dy-ptile-text">
            <span class="dy-ptile-lbl">${esc(t('ns_x_on_repeat'))}${reps.length > 1 ? `<span class="dy-ptile-when">${i + 1} / ${reps.length}</span>` : ''}</span>
            <span class="dy-ptile-main">${esc(info.title)}</span>
            <span class="dy-ptile-sub">${esc(info.artist)} · ${esc(t('ns_x_days_of_7', { n: songDays[k] }))}</span>
          </span>
        </div>`;
    }).join('');
    const many = reps.length > 1;
    tiles.push(`
      <div class="dy-ptile dy-rep${many ? ' is-many' : ''}"${many ? ` role="button" tabindex="0" aria-label="${esc(t('ns_x_on_repeat'))}" onclick="dyRepNext(this)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();dyRepNext(this)}"` : ''}>${slides}${many ? '<span class="dy-rep-bar" aria-hidden="true"></span>' : ''}</div>`);
  }

  return `<div class="dy-panel">
      <div class="dy-ptop">${dayBlock}${weekBlock}</div>
      ${tiles.length ? `<div class="dy-ptiles">${tiles.join('')}</div>` : ''}
    </div>`;
}

/* The On repeat tile's rotation: one song every few seconds. The timer bar
   along the tile's foot drives it: when its fill animation ends the next song
   comes in, so pausing the bar (pointer on the tile, or a hidden tab, where
   browsers hold animations) pauses the rotation exactly. With reduced motion
   the bar is hidden and a plain interval does the job. Restarted on every
   redraw of the panel (dyRenderTop). */
const DY_REP_MAX = 10;
const DY_REP_MS = 4000;   // also the bar's run time: --dy-rep-ms in style.css
let _dyRepTimer = null;

function dyRepStart() {
  clearInterval(_dyRepTimer);
  _dyRepTimer = null;
  const tile = document.querySelector('#dailyDay .dy-rep');
  if (!tile || tile.querySelectorAll('.dy-rep-slide').length < 2) return;
  const bar = tile.querySelector('.dy-rep-bar');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !bar) {
    _dyRepTimer = setInterval(() => {
      if (!tile.isConnected) { clearInterval(_dyRepTimer); _dyRepTimer = null; return; }
      if (document.hidden || tile.matches(':hover')) return;
      dyRepNext(tile);
    }, DY_REP_MS);
    return;
  }
  bar.onanimationend = () => dyRepNext(tile);
  dyRepBar(tile);
}

// Run the timer bar again from empty (a reflow restarts its animation)
function dyRepBar(tile) {
  const bar = tile.querySelector('.dy-rep-bar');
  if (!bar) return;
  bar.classList.remove('is-run');
  void bar.offsetWidth;
  bar.classList.add('is-run');
}

// The next song, and a fresh wait (the bar from empty) before the one after
function dyRepNext(tile) {
  const n = tile.querySelectorAll('.dy-rep-slide').length;
  dyRepGo(tile, ((+tile.dataset.i || 0) + 1) % n);
}

function dyRepGo(tile, i) {
  if (!tile) return;
  tile.dataset.i = i;
  tile.querySelectorAll('.dy-rep-slide').forEach((el, j) => {
    el.classList.toggle('is-on', j === i);
    if (j === i) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', 'true');
  });
  dyRepBar(tile);
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
