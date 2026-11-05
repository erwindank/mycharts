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

// ─── STEP 2: SETTINGS + THE RUNNER ────────────────────────────────────────
/* Settings live in Firestore (users/{uid}/data/autoPlaylists, firebase.js):
     { day|week|month|year: { on, size, lastDay } }
   Signed-in users only. lastDay is the last calendar day of the newest period
   a playlist was made for — a day string rather than a period key, so that
   changing the week start day can't make an overlapping week look new.

   The runner (apRun) is called after every data load and refresh (app.js
   finalizeLoad / refreshAfterPoll) and after sign-in (firebase.js). For each
   chart type that's on, it makes a playlist for every finished period since
   lastDay, oldest first, claiming each one in a Firestore transaction first
   so two devices never make the same one. */

const AP_SIZES = [10, 20, 40, 50, 100];
const AP_MAX_CATCHUP = 10;              // missed periods made per chart type in one go
const AP_GRACE_MS = 2 * 60 * 60 * 1000; // see _apDataCoversDay

let apSettings = null;   // last copy loaded from Firestore (the setup UI reads it)
let _apRunning = false;
let _apAgain = false;    // another run was asked for while one was going

// Signed in, and not the demo library (whose playlists would be nonsense on
// the user's account). The demo is the sample Google Sheet; dank100.js has
// the same check.
const AP_SAMPLE_SHEET_ID = '1ulWuTKxreKLUWGBEI0g2d5iMgjHu6y02IFzg6A7BzVA';
function _apAllowed() {
  if (typeof dcIsSignedIn !== 'function' || !dcIsSignedIn()) return false;
  try {
    if (getDataSource() === 'sheets' && (localStorage.getItem('dc_sheet_id') || '').indexOf(AP_SAMPLE_SHEET_ID) >= 0) return false;
  } catch (e) {}
  return true;
}

// ─── Period key → its first and last calendar day ('YYYY-MM-DD')
function apFirstDay(period, key) {
  if (period === 'month') return key + '-01';
  if (period === 'year') return key + '-01-01';
  return key;   // day and week keys already are their first day
}
function apLastDay(period, key) {
  if (period === 'day') return key;
  if (period === 'week') return dyShift(key, 6);
  if (period === 'month') {
    const [y, m] = key.split('-').map(Number);
    return localDateStr(new Date(y, m, 0));   // day 0 of next month = last day of this one
  }
  return key + '-12-31';
}

/* Whether the loaded plays can be trusted to hold everything up to the end
   of `lastDay`. A playlist is made once and never changed, so making it from
   data that hasn't caught up yet would leave it short for good.
   - Last.fm / Google Sheets: the data was synced at least AP_GRACE_MS after
     the day ended (late scrobbles, and the sheet's own sync, get time to land).
     lastSyncTime is the cache's time when the charts came from the cache.
   - CSV upload: nothing syncs, so the file itself has to have a play from
     after that day — an upload made mid-week waits for the next upload. */
function _apDataCoversDay(lastDay) {
  if (getDataSource() === 'file') {
    const newest = allPlays[0];   // allPlays is newest-first for every source
    return !!newest && dayStrOf(newest) > lastDay;
  }
  if (!lastSyncTime) return false;
  return localDateStr(tzDate(new Date(+lastSyncTime - AP_GRACE_MS))) > lastDay;
}

// The day before the running period starts: lastDay for a chart type that has
// just been turned on, so its first playlist is the period running now (no
// back-fill of older ones).
function apStartLastDay(period) {
  return dyShift(apFirstDay(period, apCurrentKey(period)), -1);
}

// ─── Names ─────────────────────────────────────────────────────────────────
// "Weekly Top 40 · 26 Oct – 1 Nov 2026", "Monthly Top 50 · October 2026"…
// Written in the language in use when it's made; it's the user's playlist
// from then on and they can rename it.
function apPlaylistName(period, key, n) {
  let when;
  if (period === 'day') when = fmt(dyDate(key));
  else if (period === 'week') {
    const a = dyDate(key), b = dyDate(apLastDay('week', key));
    const ma = t(_CR_MON_SHORT[a.getMonth()]), mb = t(_CR_MON_SHORT[b.getMonth()]);
    when = a.getFullYear() === b.getFullYear()
      ? `${a.getDate()} ${ma} – ${b.getDate()} ${mb} ${b.getFullYear()}`
      : `${fmt(a)} – ${fmt(b)}`;
  } else when = crPeriodTitle(period, key);   // "October 2026" / "2026"
  return t('ap_name_' + period, { n, when });
}

// Never overwrite: a taken name gets " (2)", " (3)"…
function _apFreeName(name) {
  if (!_ytPlaylists[name]) return name;
  let i = 2;
  while (_ytPlaylists[name + ' (' + i + ')']) i++;
  return name + ' (' + i + ')';
}

// ─── The runner ────────────────────────────────────────────────────────────
async function apRun() {
  if (_apRunning) { _apAgain = true; return; }
  if (!_apAllowed() || !allPlays || !allPlays.length) return;
  _apRunning = true;
  const made = [];
  try {
    const s = await dcLoadAutoPlaylists();
    if (!s) return;   // offline or signed out meanwhile: try again next load
    apSettings = s;
    for (const period of AP_PERIODS) {
      const cfg = s[period];
      if (!cfg || !cfg.on) continue;
      const size = AP_SIZES.includes(cfg.size) ? cfg.size : 40;
      const lastDay = cfg.lastDay || apStartLastDay(period);
      // Finished periods with plays, after lastDay, that the data covers
      let due = apFinishedKeys(period, null).filter(k =>
        apFirstDay(period, k) > lastDay && _apDataCoversDay(apLastDay(period, k)));
      const skipped = Math.max(0, due.length - AP_MAX_CATCHUP);
      if (skipped) due = due.slice(-AP_MAX_CATCHUP);   // keep the newest ones
      for (const key of due) {
        // Built before the claim (it's local and quick), saved after it
        const songs = apChartSongs(period, key, size);
        const claim = await dcClaimAutoPlaylist(period, apFirstDay(period, key), apLastDay(period, key));
        if (claim === 'error') return;   // offline / rules: stop, retry next load
        if (claim !== 'ok') continue;    // another device made it, or it was turned off
        cfg.lastDay = apLastDay(period, key);
        if (!songs.length) continue;
        const name = _apFreeName(apPlaylistName(period, key, songs.length));
        _ytPlaylists[name] = songs.map(x => ({ title: x.title, artist: x.artist, album: x.album }));
        // Same save path as a playlist made by hand: timestamps, localStorage,
        // Firestore, and a redraw of the player panel / Playlists tab
        _dcPickCommit(name);
        made.push({ period, key, name, n: songs.length });
      }
      if (skipped && typeof dcNotify === 'function') dcNotify({ kind: 'ap_skipped', period, n: skipped, link: { tab: 'playlists' } });
    }
  } catch (e) {
    console.warn('[dankcharts] Automatic playlists run failed:', e);
  } finally {
    _apRunning = false;
    // Each new playlist gets a notification (notifications.js) that opens it,
    // and a toast says so straight away for whoever is looking
    for (const m of made) {
      if (typeof dcNotify === 'function') dcNotify({ kind: 'ap_made', period: m.period, key: m.key, name: m.name, n: m.n,
                                                     link: { tab: 'playlists', playlist: m.name } });
    }
    if (made.length) dcPlToast(made.length === 1
      ? t('ap_toast_made', { name: made[0].name })
      : t('ap_toast_made_many', { n: made.length }));
    if (_apAgain) { _apAgain = false; apRun(); }
  }
}

/* Turns one chart type on or off, or changes its size (the setup UI in step
   3 calls this). Turning on, or back on, sets lastDay so the first playlist
   is the period running now: nothing from before, or from the time it was
   off, is made all at once. */
async function apSetPeriod(period, patch) {
  if (!_apAllowed() || !AP_PERIODS.includes(period)) return false;
  const cur = Object.assign({ on: false, size: 40, lastDay: null }, (apSettings || {})[period]);
  const next = Object.assign({}, cur, patch);
  if (next.on && !cur.on) next.lastDay = apStartLastDay(period);
  const ok = await dcSaveAutoPlaylist(period, next);
  if (ok) apSettings = Object.assign({}, apSettings, { [period]: next });
  return ok;
}

// ─── STEP 3: THE SETUP CARD (Playlists tab) ───────────────────────────────
/* "Automatic playlists" under the user's playlists: one row per chart type
   with an on/off switch and, while on, a size picker and when the next one
   is due. dcRenderPlaylistsView (app.js) leaves an empty #apSetup and calls
   apRenderSetup() to fill it, so the card can redraw on its own without
   redrawing the playlists. */

// Which period a calendar day falls in (day string → period key)
function apKeyOfDay(period, ds) {
  if (period === 'day') return ds;
  if (period === 'month') return ds.slice(0, 7);
  if (period === 'year') return ds.slice(0, 4);
  const back = (dyDate(ds).getDay() - weekStartDay + 7) % 7;   // same rule as playWeekKey
  return dyShift(ds, -back);
}

// The size a chart type starts at: the user's own chart size for it, when
// that's one of the choices
function _apDefaultSize(period) {
  const own = period === 'day' ? chartSizeSongsD : period === 'week' ? chartSizeSongsW : period === 'month' ? chartSizeSongsM : chartSizeSongsY;
  return AP_SIZES.includes(own) ? own : 40;
}

/* The line under a chart type that's on. The next playlist is for the
   period right after lastDay. If that period is already over, it's waiting
   for the data to catch up (see _apDataCoversDay); otherwise it's made once
   the period ends. */
function _apNextNote(period, cfg) {
  const lastDay = cfg.lastDay || apStartLastDay(period);
  const nextKey = apKeyOfDay(period, dyShift(lastDay, 1));
  const ends = apLastDay(period, nextKey);
  if (ends < localDateStr(tzNow())) return t('ap_row_pending');
  return t('ap_row_next', { date: fmt(dyDate(ends)) });
}

// The icon on each chart type's tile: a sun for a day, a calendar for a
// week, a moon for a month, a sparkle for a whole year
const AP_ICONS = { day: 'sun', week: 'calendar', month: 'moon', year: 'sparkle' };

let _apSetupLoading = false;
function apRenderSetup() {
  const el = document.getElementById('apSetup');
  if (!el) return;
  let body;
  const signedIn = typeof dcIsSignedIn === 'function' && dcIsSignedIn();
  if (!signedIn) {
    body = `<div class="ap-note">${esc(t('ap_signin'))}` +
      ` <button type="button" class="dc-btn dc-btn-normal dc-btn-sm" onclick="dcSignIn()">${esc(t('tb_sign_in'))}</button></div>`;
  } else if (!_apAllowed()) {
    body = `<div class="ap-note">${esc(t('ap_demo'))}</div>`;
  } else if (!apSettings) {
    body = `<div class="ap-note">${esc(t('ap_loading'))}</div>`;
    if (!_apSetupLoading) {
      _apSetupLoading = true;
      dcLoadAutoPlaylists().then(s => {
        _apSetupLoading = false;
        if (s) apSettings = s;
        else { const e = document.getElementById('apSetup'); if (e) e.querySelector('.ap-note').textContent = t('ap_load_err'); return; }
        apRenderSetup();
      });
    }
  } else {
    // One tile per chart type (redesigned 2026-11-05): an icon, the
    // name and its note, the switch top right, the size picker along the
    // bottom (greyed while the chart type is off, so every tile lines up)
    body = `<div class="ap-grid">` + AP_PERIODS.map(period => {
      const cfg = apSettings[period] || {};
      const on = !!cfg.on;
      const size = AP_SIZES.includes(cfg.size) ? cfg.size : _apDefaultSize(period);
      let h = `<div class="ap-tile${on ? ' ap-row-on' : ''}">` +
        // A <label>, so the whole top of the tile works the switch (as in Settings)
        `<label class="src-switch-row ap-tile-top">` +
        `<span class="ap-badge ap-badge-${period}" aria-hidden="true">${typeof dcIco === 'function' ? dcIco(AP_ICONS[period]) : ''}</span>` +
        `<span class="src-switch-label"><span class="ap-row-title">${esc(t('ap_row_' + period))}</span>` +
        `<span class="set-switch-note">${esc(on ? _apNextNote(period, cfg) : t('ap_row_off_' + period))}</span></span>` +
        `<span class="src-switch"><input type="checkbox"${on ? ' checked' : ''} onchange="apToggle('${period}', this.checked, this)"><span class="src-switch-slider"></span></span>` +
        `</label>`;
      // The size picker sits outside the label, so pressing a size never
      // flips the switch
      h += `<div class="ap-size"><span class="ap-size-lbl">${esc(t('ap_size'))}</span>` +
        `<div class="dc-seg dc-seg-fill" role="group" aria-label="${esc(t('ap_size'))}">` +
        AP_SIZES.map(n => `<button type="button" aria-pressed="${on && n === size}"${on ? '' : ' disabled'} onclick="apPickSize('${period}', ${n})">${n}</button>`).join('') +
        `</div></div>`;
      return h + `</div>`;
    }).join('') + `</div>`;
  }
  el.innerHTML = `<div class="dc-pl-part-head"><h3 class="dc-pl-part-title">${esc(t('ap_setup_title'))}</h3></div>` +
    `<p class="dc-pl-part-sub">${esc(t('ap_setup_sub'))}</p>` + body;
}

// The switch. Saved straight away; if the save fails the switch goes back
// and a toast says so.
async function apToggle(period, on, input) {
  if (input) input.disabled = true;
  const patch = { on };
  if (on && !(apSettings && apSettings[period] && AP_SIZES.includes(apSettings[period].size))) patch.size = _apDefaultSize(period);
  const ok = await apSetPeriod(period, patch);
  if (!ok) dcPlToast(t('ap_save_err'));
  apRenderSetup();
}

async function apPickSize(period, n) {
  const ok = await apSetPeriod(period, { size: n });
  if (!ok) dcPlToast(t('ap_save_err'));
  apRenderSetup();
}

// Signing in or out changes the card; settings belong to the account
document.addEventListener('DOMContentLoaded', () => {
  try {
    firebase.auth().onAuthStateChanged(() => { apSettings = null; apRenderSetup(); });
  } catch (e) {}
});
