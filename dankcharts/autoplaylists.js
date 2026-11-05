/* ===========================================================================
   AUTOMATIC CHART PLAYLISTS (SCHEDULED-PLAYLISTS-PLAN.md)

   The user turns on a chart type (Daily / Weekly / Monthly / Yearly) and picks
   a size. Each time one of that chart's periods finishes, the finished chart's
   songs become a playlist. This file holds the whole feature; it reads app.js
   and daily.js globals, so it loads after both.

   Step 1 (this part): "the chart for any finished period". Everything here is
   read-only — it never touches currentPeriod, currentOffset or any render
   state, so it can run at load time while the user is on any tab.

   Why it reuses the chart-run caches instead of re-counting plays:
   the Charts tab breaks ties by chart status (on last period's chart → came
   back → new), then last period's rank, then who got there first. Those need
   every earlier period's chart, which the chart-run builders (_crFull in
   app.js, dyHistory in daily.js) already work out and cache. Ranking from
   them means a playlist's order is exactly the order on the Charts tab.

   Works the same for Last.fm, Google Sheets and CSV: everything comes from
   allPlays, which all three sources fill.
   =========================================================================== */

const AP_PERIODS = ['day', 'week', 'month', 'year'];

// ─── PERIOD KEYS ──────────────────────────────────────────────────────────
/* Keys are the same strings the chart runs use:
     day   'YYYY-MM-DD'
     week  'YYYY-MM-DD' (the week's first day, from the user's week start day)
     month 'YYYY-MM'
     year  'YYYY'
   They sort as plain strings, which is what "finished" relies on. */

// The key of the period that's running right now (not finished yet)
function apCurrentKey(period) {
  const now = tzNow();
  if (period === 'day') return localDateStr(now);
  if (period === 'week') return playWeekKey(new Date());   // playWeekKey applies the timezone itself
  if (period === 'month') return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  return String(now.getFullYear());
}

// The key just before `key` — the period the Charts tab compares against
// for its movement arrows and tie-breaks. Gaps count: if the week before had
// no plays, there is simply no previous chart (as on the Charts tab).
function apPrevKey(period, key) {
  if (period === 'day') return dyShift(key, -1);
  if (period === 'week') return dyShift(key, -7);
  if (period === 'month') {
    const [y, m] = key.split('-').map(Number);
    const d = new Date(y, m - 2, 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }
  return String(+key - 1);
}

/* Every finished period that has plays, oldest first, after `afterKey`
   (exclusive; null = from the start). The running period is never included.
   Periods with no plays aren't listed at all — there'd be nothing to make. */
function apFinishedKeys(period, afterKey) {
  if (!allPlays || !allPlays.length) return [];
  const cur = apCurrentKey(period);
  const keys = period === 'day' ? dyHistory().days.slice() : Object.keys(_crFull(period).periodMap).sort();
  return keys.filter(k => k < cur && (!afterKey || k > afterKey));
}

// ─── THE CHART FOR ONE FINISHED PERIOD ────────────────────────────────────
/* The top `size` songs of one period, in Charts-tab order:
   [{ title, artist, album, count }]. `size` may be bigger than the user's
   chart size — songs past it are ordered by the same tie rules.

   Returns [] for a period with no plays. */
function apChartSongs(period, key, size) {
  if (!allPlays || !allPlays.length || !(size > 0)) return [];
  const rows = period === 'day' ? _apRankDay(key) : _apRankPeriod(period, key);
  if (!rows) return [];
  const top = rows.slice(0, size);
  const albums = _apAlbumsFor(period, key, new Set(top.map(r => r.k)));
  return top.map(r => ({
    title: r.title,
    artist: r.artist,
    // The same "best album" the chart row shows: the most-played non-single
    // album for this song within the period
    album: albums[r.k] ? bestAlbum(r.title, albums[r.k]) : '',
    count: r.count
  }));
}

/* Week / month / year. The tallies come from the cached full chart run
   (_crFull(period).periodMap[key].songs: count, firstAchieved, _title,
   _artist). The chart status is worked out here rather than read off the
   tallies: the run sets it against the last period that HAD plays, while the
   Charts tab (buildPeriodStats) sets it against the calendar period just
   before — and the playlist must match what's on screen. */
function _apRankPeriod(period, key) {
  const full = _crFull(period);
  const pm = full.periodMap[key];
  if (!pm) return null;
  const prevKey = apPrevKey(period, key);
  const songsRun = full.result.songs;
  const rows = [];
  for (const k in pm.songs) {
    const d = pm.songs[k];
    let prevRank = Infinity, before = false;
    const run = songsRun[k];
    if (run) {
      // Entries are in date order: the first one says whether it charted
      // before this period at all; the one at prevKey is last period's rank.
      before = run.entries[0].periodKey < key;
      for (const e of run.entries) {
        if (e.periodKey === prevKey) { prevRank = e.rank; break; }
        if (e.periodKey > prevKey) break;
      }
    }
    rows.push({
      k, title: d._title, artist: d._artist, count: d.count, firstAchieved: d.firstAchieved,
      chartStatus: prevRank !== Infinity ? 0 : before ? 1 : 2, prevRank
    });
  }
  return rows.sort(rankSortWithStatus);
}

/* Day: the daily chart's own rules (daily.js dyHistory) — previous day's
   chart, then re-entry, then debut, then first play of the day. dyHistory
   keeps only the Daily chart size, so the rest of the day is ranked here with
   the same comparison. */
function _apRankDay(ds) {
  const h = dyHistory();
  const day = h.byDay[ds];
  if (!day) return null;
  const prevRank = {};
  for (const r of h.charts.songs[dyShift(ds, -1)] || []) prevRank[r.k] = r.rank;
  // Charted on any earlier day (re-entry rather than debut)
  const ever = new Set();
  for (const d of h.days) {
    if (d >= ds) break;
    for (const r of h.charts.songs[d] || []) ever.add(r.k);
  }
  const rows = Object.keys(day.songs).map(k => {
    const s = day.songs[k];
    const pr = prevRank[k];
    return { k, title: s.title, artist: s.artist, count: s.count, first: s.first,
             status: pr ? 0 : ever.has(k) ? 1 : 2, prevRank: pr || Infinity };
  });
  rows.sort((a, b) => b.count - a.count || a.status - b.status || a.prevRank - b.prevRank || a.first - b.first);
  return rows;
}

/* Album play counts per song within the period, for the chosen songs only —
   one pass over the library, matching plays by the same cached period key
   the charts use, so no date range has to be rebuilt here. */
function _apAlbumsFor(period, key, want) {
  const keyOf = period === 'day' ? dayStrOf : period === 'week' ? playWeekKeyOf : period === 'month' ? monthKeyOf : yearKeyOf;
  const out = {};
  for (const p of allPlays) {
    if (keyOf(p) !== key) continue;
    const k = songKey(p);
    if (!want.has(k)) continue;
    const a = out[k] || (out[k] = {});
    a[p.album] = (a[p.album] || 0) + 1;
  }
  return out;
}
