/* ===========================================================================
   NOTIFICATIONS (SCHEDULED-PLAYLISTS-PLAN.md, step 4)

   A list of things the site did for the user, under the profile picture:
   the menu gets a "Notifications" row with the unread count, the picture
   gets a dot while anything is unread, and the row opens #ntModal (a bottom
   sheet on phones, via popups.js). Each notification links to the place it's
   about.

   Signed-in only: the list lives in the account (users/{uid}/data/
   notifications, firebase.js) so every device shows the same one.

   Built generic. Any feature posts one with
     dcNotify({ kind, ...params, link })
   and adds a line to NT_KINDS below saying how it reads. Automatic chart
   playlists (autoplaylists.js) is the first user.

   Each notification is stored as { id, kind, at, read, p, link }. The text
   isn't stored, only its params (p), so it follows the language the site
   is in when the list is opened.
   =========================================================================== */

const NT_MAX = 100;                          // kept per account, newest first
const NT_MAX_AGE = 90 * 24 * 60 * 60 * 1000; // older than 90 days are dropped

let ntItems = [];        // the list as last loaded or saved
let _ntQueue = [];       // posted, not yet saved (saved together, see dcNotify)
let _ntFlushTimer = null;
let _ntLastAt = 0;        // time of the last one posted (see dcNotify)

// How each kind reads: an emoji (the site uses emoji, not line icons, for
// these) and its text.
const NT_KINDS = {
  // A playlist made by automatic chart playlists
  ap_made: { emoji: '🎵', text: p => t('nt_ap_made', { name: p.name }) },
  // Missed periods past the 10-at-a-time limit
  ap_skipped: { emoji: '⏭️', text: p => t('nt_ap_skipped', { n: p.n, chart: t('ap_row_' + p.period) }) },
  // A month has ended: its Soundtrack is ready to look back on (p.key 'YYYY-MM')
  st_month: { emoji: '🎬', text: p => t('nt_st_month', { month: crPeriodTitle('month', p.key) }) },
  // A year has ended: its Soundtrack is ready (p.key 'YYYY')
  st_year: { emoji: '🎉', text: p => t('nt_st_year', { year: p.key }) },
  // A song or album reached Gold / Platinum / Diamond (p.tier, p.mult)
  cert_new: { emoji: '🏆', text: p => t(p.type === 'album' ? 'nt_cert_album' : 'nt_cert_song', {
    title: p.title, artist: p.artist,
    tier: p.tier === 'diamond' ? tDiamondLabel(p.mult || 1) : tTierLabel(p.tier) }) },
  // More certifications at once than get one each (NT_CERT_MAX)
  cert_more: { emoji: '🏆', text: p => t('nt_cert_more', { n: p.n }) },
  // A new holder at the top of a Records list (p.title = the list, in the
  // language it was read in; p.type song / album / artist)
  // p.n > 1: the same holder took several lists at once (p.title = the first)
  rec_new: { emoji: '🥇', text: p => {
    const multi = p.n > 1 ? '_multi' : '';
    return p.type === 'artist'
      ? t('nt_rec_new_artist' + multi, { name: p.name, record: p.title, n: p.n })
      : t('nt_rec_new' + multi, { name: p.name, artist: p.artist, record: p.title, n: p.n });
  } },
  // Many lists changed at once (NT_REC_MAX)
  rec_many: { emoji: '🥇', text: p => t('nt_rec_many', { n: p.n }) },
  // Someone else replied to one of the user's Board posts (p.n of them)
  bd_reply: { emoji: '💬', text: p => p.n > 1
    ? t('nt_bd_replies', { n: p.n, title: p.title })
    : t('nt_bd_reply', { name: p.name, title: p.title }) },
  // A moderator changed the status of one of the user's Board posts
  bd_status: { emoji: '📌', text: p => t('nt_bd_status', { title: p.title, status: t('board_status_' + p.status) }) }
};

// Newest first, no more than NT_MAX, nothing older than NT_MAX_AGE
function _ntTrim(list) {
  const cutoff = Date.now() - NT_MAX_AGE;
  return list.filter(x => x && x.at >= cutoff).sort((a, b) => b.at - a.at).slice(0, NT_MAX);
}

/* Posts a notification. Several posted together (a run that made three
   playlists) are saved in one write a moment later. Signed out: nothing —
   there is no list to put it in. */
function dcNotify(n) {
  if (typeof dcIsSignedIn !== 'function' || !dcIsSignedIn() || !n || !NT_KINDS[n.kind]) return;
  const { kind, link, ...p } = n;
  // Each one a millisecond after the last, so several posted in the same
  // moment (oldest first) still list newest first
  const at = _ntLastAt = Math.max(Date.now(), _ntLastAt + 1);
  _ntQueue.push({
    id: at.toString(36) + Math.random().toString(36).slice(2, 7),
    kind, at, read: false, p, link: link || null
  });
  clearTimeout(_ntFlushTimer);
  _ntFlushTimer = setTimeout(_ntFlush, 300);
}

async function _ntFlush() {
  if (!_ntQueue.length) return;
  const add = _ntQueue;
  _ntQueue = [];
  const saved = await dcUpdateNotifications(cur => _ntTrim(add.concat(cur)));
  // Couldn't save (offline): still show them on this device for now
  ntItems = saved || _ntTrim(add.concat(ntItems));
  ntRefresh();
}

// ─── Showing it ────────────────────────────────────────────────────────────

function _ntUnread() { return ntItems.filter(x => !x.read).length; }

// The dot on the profile picture, the count in the menu, and the window if open
function ntRefresh() {
  const n = _ntUnread();
  const dot = document.getElementById('ntDot');
  if (dot) dot.hidden = n === 0;
  const cnt = document.getElementById('ntCount');
  if (cnt) { cnt.hidden = n === 0; cnt.textContent = n > 99 ? '99+' : String(n); }
  const btn = document.getElementById('acctGroupBtn');
  if (btn) btn.setAttribute('aria-label', n ? t('nt_acct_unread', { n }) : t('tb_account'));
  const modal = document.getElementById('ntModal');
  if (modal && modal.classList.contains('open')) _ntRenderList();
}

// "Just now", "5 min ago", "3 h ago", "Yesterday", then the date
function ntAgo(ms) {
  const s = (Date.now() - ms) / 1000;
  if (s < 60) return t('nt_now');
  if (s < 3600) return t('nt_min', { n: Math.floor(s / 60) });
  const d = new Date(ms), today = tzNow();
  const ds = localDateStr(tzDate(d)), td = localDateStr(today);
  if (ds === td) return t('nt_hr', { n: Math.floor(s / 3600) });
  if (ds === dyShift(td, -1)) return t('nt_yesterday');
  return fmt(tzDate(d));
}

function _ntRenderList() {
  const body = document.getElementById('ntBody');
  if (!body) return;
  const unread = _ntUnread();
  const sub = document.getElementById('ntSub');
  if (sub) sub.textContent = ntItems.length ? t('nt_sub', { n: unread }) : '';
  const foot = document.getElementById('ntFoot');
  if (foot) foot.hidden = !ntItems.length;
  const all = document.getElementById('ntReadAllBtn');
  if (all) all.disabled = !unread;
  if (!ntItems.length) {
    body.innerHTML = `<div class="dc-empty">${dcIco('bell')}<span>${esc(t('nt_empty'))}</span></div>`;
    return;
  }
  body.innerHTML = `<div class="dc-list nt-list">` + ntItems.map(x => {
    const k = NT_KINDS[x.kind];
    if (!k) return '';
    return `<button type="button" class="dc-list-row nt-row${x.read ? '' : ' nt-unread'}" onclick="ntOpenItem('${esc(x.id)}')">` +
      `<span class="nt-emoji" aria-hidden="true">${k.emoji}</span>` +
      `<span class="dc-list-main"><span class="dc-list-title">${esc(k.text(x.p || {}))}</span>` +
      `<span class="dc-list-sub">${esc(ntAgo(x.at))}</span></span>` +
      (x.read ? '' : `<span class="nt-row-dot" aria-label="${esc(t('nt_unread'))}"></span>`) +
      `</button>`;
  }).join('') + `</div>`;
}

function ntOpen() {
  document.querySelectorAll('.ctrl-group.open').forEach(g => g.classList.remove('open'));
  const modal = document.getElementById('ntModal');
  if (!modal) return;
  _ntRenderList();
  modal.classList.add('open');
  // Fresh copy from the account, in case another device added some
  dcLoadNotifications().then(list => { if (list) { ntItems = _ntTrim(list); ntRefresh(); } });
}

function ntClose() {
  document.getElementById('ntModal')?.classList.remove('open');
}

// ─── Changing it ───────────────────────────────────────────────────────────

// Applies a change here straight away, then to the account
async function _ntChange(change) {
  ntItems = change(ntItems);
  ntRefresh();
  const saved = await dcUpdateNotifications(cur => _ntTrim(change(cur)));
  if (saved) { ntItems = saved; ntRefresh(); }
}

function ntReadAll() {
  _ntChange(list => list.map(x => Object.assign({}, x, { read: true })));
}

// Clear all asks first, in the site's own warning window
function ntClearAsk() {
  if (typeof window.dcConfirmBox !== 'function') return;
  window.dcConfirmBox(t('nt_clear_title'), t('nt_clear_text'), t('nt_clear'), () => _ntChange(() => []));
}

/* A notification was clicked: mark it read, close the window, go to the
   place it's about. link: { tab, playlist }. */
function ntOpenItem(id) {
  const x = ntItems.find(i => i.id === id);
  if (!x) return;
  if (!x.read) _ntChange(list => list.map(i => i.id === id ? Object.assign({}, i, { read: true }) : i));
  ntClose();
  ntFollow(x.link);
}

function ntFollow(link) {
  if (!link || !link.tab) return;
  // A playlist: open it (app.js handles one deleted or renamed since)
  if (link.tab === 'playlists' && link.playlist) { dcPlOpenByName(link.playlist, false); return; }
  // A month's Soundtrack
  if (link.tab === 'soundtrack' && link.month) { stOpenMonth(link.month); return; }
  // A year's Soundtrack
  if (link.tab === 'soundtrack' && link.year) { stOpenYear(link.year); return; }
  // A record with a new #1
  if (link.tab === 'records' && link.view) { _ntOpenRecord(link); return; }
  // A Board post
  if (link.tab === 'board' && link.post && window.dcBoard) { window.dcBoard.openFromLink(link.post); return; }
  // A certified song or album: its own window, over whatever is on screen.
  // Needs the plays loaded; before that (or if it's gone from the library
  // since) the window would be empty, so go to Records instead.
  if (link.tab === 'cert') {
    const has = allPlays && allPlays.some(p => link.type === 'album' ? albumKeyOf(p) === link.key : songKey(p) === link.key);
    if (!has) { dcGoTab('records'); return; }
    if (link.type === 'album') openAlbumModal(link.key); else openSongModal(link.key);
    return;
  }
  if (currentPeriod !== link.tab) dcGoTab(link.tab);
}

// ─── Watchers: things worth telling the user about ─────────────────────────
/* Run after every data load and refresh (app.js finalizeLoad /
   refreshAfterPoll), after sign-in, and every few minutes for the Board.
   What has already been told is kept in the account (users/{uid}/data/
   notifyState, firebase.js) and moved forward in a transaction, so each
   thing is told once across all the user's devices. None of them back-fill:
   the first run only notes where things stand.
   Works the same for Last.fm, Google Sheets and CSV uploads — the Soundtrack
   and certification watchers only read the loaded plays. */

const NT_CERT_MAX = 10;                      // certifications told one by one per run
const NT_BOARD_EVERY = 10 * 60 * 1000;       // Board check while the site is open

let _ntWatching = false;
let _ntWatchAgain = false;

async function ntWatch() {
  if (_ntWatching) { _ntWatchAgain = true; return; }
  if (typeof dcIsSignedIn !== 'function' || !dcIsSignedIn()) return;
  _ntWatching = true;
  try {
    // Soundtrack and certifications need the user's own library (not the demo)
    if (typeof _apAllowed === 'function' && _apAllowed() && allPlays && allPlays.length) {
      await _ntWatchSoundtrack();
      await _ntWatchCerts();
      _ntRecordsCheck();   // reads Records now if built, else builds it later in idle time
    }
    await _ntWatchBoard();
  } catch (e) {
    console.warn('[dankcharts] Notification watch failed:', e);
  } finally {
    _ntWatching = false;
    if (_ntWatchAgain) { _ntWatchAgain = false; ntWatch(); }
  }
}

/* The month that just ended: once the data covers its last day (the same
   check automatic playlists use) and it had plays, one notification that
   opens the Soundtrack on that month. Only the latest finished month — a
   user back after three months hears about the last one. */
async function _ntWatchSoundtrack() {
  const key = apCurrentKey('month');
  const [y, m] = key.split('-').map(Number);
  const prev = m === 1 ? (y - 1) + '-12' : y + '-' + String(m - 1).padStart(2, '0');
  if (!apFinishedKeys('month', null).includes(prev)) return;   // no plays that month
  if (!_apDataCoversDay(apLastDay('month', prev))) return;      // data still catching up
  const tell = await dcUpdateNotifyState(cur => {
    if (cur.stMonth && cur.stMonth >= prev) return { state: null, out: false };
    return { state: Object.assign({}, cur, { stMonth: prev }), out: true };
  });
  if (tell === true) dcNotify({ kind: 'st_month', key: prev, link: { tab: 'soundtrack', month: prev } });
  // After the month, so in January the year's notification lists above December's
  await _ntWatchSoundtrackYear();
}

/* The year that just ended, the same way: once the data covers 31 December
   and it had plays, one notification that opens the Soundtrack on that year.
   The first run outside January only notes the last year as told, so a user
   doesn't hear about last year's Soundtrack in the middle of this one. */
async function _ntWatchSoundtrackYear() {
  const prev = String(+apCurrentKey('year') - 1);
  if (!apFinishedKeys('year', null).includes(prev)) return;    // no plays that year
  if (!_apDataCoversDay(apLastDay('year', prev))) return;       // data still catching up
  const january = tzNow().getMonth() === 0;
  const tell = await dcUpdateNotifyState(cur => {
    if (cur.stYear && cur.stYear >= prev) return { state: null, out: false };
    return { state: Object.assign({}, cur, { stYear: prev }), out: !!cur.stYear || january };
  });
  if (tell === true) dcNotify({ kind: 'st_year', key: prev, link: { tab: 'soundtrack', year: prev } });
}

/* Certifications earned since the last one told, from the same history the
   Certifications wall and "Certified this period" use (buildCertTimeline,
   app.js), newest first. Kept by date: certAt is the date of the newest
   certification already told. */
async function _ntWatchCerts() {
  if (!_certTimeline) _certTimeline = buildCertTimeline();
  const list = _certTimeline;
  if (!list.length) return;
  // Dates as plain ms (the timeline holds Date objects), so the account
  // stores a number
  const newest = +list[0].date;
  const fresh = await dcUpdateNotifyState(cur => {
    // First run: note where things stand, tell nothing (no back-fill)
    if (typeof cur.certAt !== 'number') return { state: Object.assign({}, cur, { certAt: newest }), out: [] };
    if (newest <= cur.certAt) return { state: null, out: [] };
    const out = list.filter(c => +c.date > cur.certAt);
    return { state: Object.assign({}, cur, { certAt: newest }), out };
  });
  if (!Array.isArray(fresh) || !fresh.length) return;
  // The newest NT_CERT_MAX one by one (posted oldest first, so the list reads
  // newest first), the rest as one "and N more"
  const told = fresh.slice(0, NT_CERT_MAX);
  if (fresh.length > told.length) dcNotify({ kind: 'cert_more', n: fresh.length - told.length, link: { tab: 'records' } });
  for (const c of told.reverse()) {
    dcNotify({ kind: 'cert_new', type: c.type, title: c.title, artist: c.artist, tier: c.tier, mult: c.mult,
               link: { tab: 'cert', type: c.type, key: c.key } });
  }
}

/* Replies from other people, and status changes, on the user's own Board
   posts. Per post the state keeps r (time of the newest activity already
   seen) and s (its status then). A post made since the last check starts
   from when it was made, so a quick first reply isn't missed. */
async function _ntWatchBoard() {
  const posts = await dcLoadMyBoardPosts();
  if (!posts) return;
  const me = typeof _currentUser !== 'undefined' ? _currentUser : null;   // firebase.js
  if (!me) return;
  // Where each post stood last time: read first, to know whose replies to fetch
  const st0 = await dcUpdateNotifyState(cur => ({ state: null, out: cur }));
  if (st0 === 'error' || !st0) return;
  const seenFrom = (board, p) => !board ? null : board.posts && board.posts[p.id] ? board.posts[p.id].r : p.createdAt;
  const replies = {};
  for (const p of posts) {
    const r = seenFrom(st0.board, p);
    if (r == null || p.lastActivity <= r) continue;
    replies[p.id] = await dcLoadBoardRepliesSince(p.id, r);
    if (!replies[p.id]) return;   // couldn't load (offline): try again next time
  }
  const out = await dcUpdateNotifyState(cur => {
    const first = !cur.board;
    const board = { since: first ? Date.now() : cur.board.since, posts: {} };
    const tell = [];
    for (const p of posts) {
      const known = !first && cur.board.posts && cur.board.posts[p.id];
      let r = first ? Math.max(p.lastActivity, p.createdAt) : known ? known.r : p.createdAt;
      const s = known ? known.s : 'open';
      if (!first) {
        const theirs = (replies[p.id] || []).filter(x => x.at > r && x.authorUid !== me.uid);
        if (theirs.length) tell.push({ kind: 'bd_reply', n: theirs.length, name: theirs[theirs.length - 1].authorName,
                                       title: p.title, link: { tab: 'board', post: p.id } });
        if (p.status !== s) tell.push({ kind: 'bd_status', status: p.status, title: p.title, link: { tab: 'board', post: p.id } });
      }
      (replies[p.id] || []).forEach(x => { if (x.at > r) r = x.at; });
      board.posts[p.id] = { r: Math.max(r, p.lastActivity), s: p.status };
    }
    // Posts deleted since drop out of the state on their own (not in `posts`)
    const same = !first && JSON.stringify(board.posts) === JSON.stringify(cur.board.posts || {});
    return { state: same ? null : Object.assign({}, cur, { board }), out: tell };
  });
  if (Array.isArray(out)) out.forEach(n => dcNotify(n));
}

/* ── New #1 on a record ──
   Records is ~150 lists (most times at #1, biggest debut, most plays in a
   week…). When the holder of a list's top spot changes, the user hears who
   took it. The lists only exist as the built Records tables (buildRecords,
   app.js) — the same reason the Records search and hero walk the DOM — so
   this reads the row each table built first (data-rec-idx="0", whatever
   column sort the user picked since) through recRowRecord().

   Building Records is slow on a big library (1–2 s), so it isn't done on
   every load: it's read whenever Records gets built anyway (opening the tab,
   buildRecords → ntRecordsBuilt), and otherwise built quietly in idle time
   at most every NT_REC_BG_EVERY per device.

   Kept in notifyState.rec = { lang, asOf, lead: { listId: holder key } }.
   A list's id comes from its translated title, so a language change starts
   over silently instead of reporting every list as new. asOf (the newest
   play the leaders were read from) stops a device with older data — a CSV
   upload from last month — from "taking back" records the newer data gave. */

const NT_REC_MAX = 8;                              // more changes at once → one summary
const NT_REC_BG_EVERY = 12 * 60 * 60 * 1000;       // background Records build, per device
const NT_REC_BG_DELAY = 20 * 1000;                 // after a load, before trying it
let _ntRecBgTimer = null;

// Short, stable id for one list (Firestore map keys stay small)
function _ntHash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

// Every ranked list's #1 in the built Records tables: { id: { k, name, artist, type, title, sec } }
function _ntRecordLeaders() {
  const out = {};
  REC_SECTION_IDS.forEach(secId => {
    if (secId === 'recOverviewSection') return;   // copies of the other sections' bests
    const sec = document.getElementById(secId);
    if (!sec) return;
    const seen = {};
    sec.querySelectorAll('table').forEach(tb => {
      const row = tb.querySelector('tbody tr[data-rec-idx="0"]');
      if (!row || !row.classList.contains('rec-rank-1')) return;   // only ranked lists
      const rec = recRowRecord(row);
      if (!rec || !rec.prefKey) return;
      const tEl = tb.closest('.rec-section')?.querySelector('.rec-section-title');
      const title = tEl ? tEl.textContent.replace(/\s+/g, ' ').trim() : '';
      if (!title) return;
      // Some titles repeat inside a section (Most Plays in a Single Day for
      // songs, artists and albums), so the nth list with a title is its own
      const base = secId + '|' + title;
      seen[base] = (seen[base] || 0) + 1;
      out[_ntHash(base + '|' + seen[base])] = { k: rec.prefKey, name: rec.name, artist: rec.artist, type: rec.type, title, sec: secId };
    });
  });
  return out;
}

function _ntRecordsBuilt() {
  return _recBuiltKey === _recBuildKey() && !!_recArtistTally;
}

// From ntWatch: read now if the tables are current, else plan a quiet build
function _ntRecordsCheck() {
  if (_ntRecordsBuilt()) { ntRecordsBuilt(); return; }
  let last = 0;
  try { last = +localStorage.getItem('dc_nt_rec_bg') || 0; } catch (e) {}
  if (Date.now() - last < NT_REC_BG_EVERY || _ntRecBgTimer) return;
  _ntRecBgTimer = setTimeout(() => {
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 0));
    idle(() => {
      _ntRecBgTimer = null;
      if (!allPlays.length || _ntRecordsBuilt() || !dcIsSignedIn()) return;
      try { localStorage.setItem('dc_nt_rec_bg', String(Date.now())); } catch (e) {}
      buildRecords();   // ends by calling ntRecordsBuilt
    }, { timeout: 60000 });
  }, NT_REC_BG_DELAY);
}

// Called at the end of every Records build (app.js), and from _ntRecordsCheck
let _ntRecBusy = false;
async function ntRecordsBuilt() {
  if (_ntRecBusy || typeof dcIsSignedIn !== 'function' || !dcIsSignedIn()) return;
  if (typeof _apAllowed === 'function' && !_apAllowed()) return;   // not the demo library
  if (!allPlays.length) return;
  _ntRecBusy = true;
  try {
    const now = _ntRecordLeaders();
    const ids = Object.keys(now);
    if (!ids.length) return;
    const lang = typeof currentLang !== 'undefined' ? currentLang : '';
    const asOf = +allPlays[0].date;   // allPlays is newest first
    const lead = {};
    ids.forEach(id => { lead[id] = now[id].k; });
    const changed = await dcUpdateNotifyState(cur => {
      const prev = cur.rec;
      const save = { state: Object.assign({}, cur, { rec: { lang, asOf, lead } }), out: [] };
      // First time, or another language: note where things stand, tell nothing
      if (!prev || !prev.lead || prev.lang !== lang) return save;
      if (asOf < prev.asOf) return { state: null, out: [] };   // older data than last time
      const out = ids.filter(id => prev.lead[id] && prev.lead[id] !== lead[id]);
      if (!out.length && JSON.stringify(prev.lead) === JSON.stringify(lead)) return { state: null, out: [] };
      save.out = out;
      return save;
    });
    if (!Array.isArray(changed) || !changed.length) return;
    // One notification per new holder: a song that had a huge day takes
    // most-plays, debut and fastest-to records together, and that reads
    // better as "now holds 12 records" than as 12 lines
    const byHolder = new Map();
    changed.forEach(id => {
      const r = now[id];
      if (!byHolder.has(r.k)) byHolder.set(r.k, []);
      byHolder.get(r.k).push(r);
    });
    // Many holders at once is usually a setting (chart size, week start)
    // moving everything, not a run of new records: one line for all of them
    if (byHolder.size > NT_REC_MAX) {
      dcNotify({ kind: 'rec_many', n: changed.length, link: { tab: 'records' } });
      return;
    }
    byHolder.forEach(list => {
      const r = list[0];
      dcNotify({ kind: 'rec_new', type: r.type, name: r.name, artist: r.artist, title: r.title, n: list.length,
                 link: { tab: 'records', view: r.sec, title: r.title } });
    });
  } catch (e) {
    console.warn('[dankcharts] Records notification check failed:', e);
  } finally {
    _ntRecBusy = false;
  }
}

/* Opens Records on the section a record is in and brings that list into
   view (when it's on screen; some sections show one entity type at a time). */
function _ntOpenRecord(link) {
  if (link.view && REC_SECTION_IDS.includes(link.view)) {
    try { localStorage.setItem('dc_records_active_view', link.view); } catch (e) {}
  }
  if (currentPeriod === 'records') applyRecordsViewFilter(link.view || REC_DEFAULT_VIEW);
  else dcGoTab('records');
  if (!link.title) return;
  setTimeout(() => {
    const sec = document.getElementById(link.view);
    const el = sec && [...sec.querySelectorAll('.rec-section-title')]
      .find(x => x.textContent.replace(/\s+/g, ' ').trim() === link.title && x.getClientRects().length);
    if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, 400);
}

// The Board isn't tied to a data load, so it's also checked every few minutes
// while the site is open and on screen
setInterval(() => { if (!document.hidden) ntWatch(); }, NT_BOARD_EVERY);

// ─── Loading ───────────────────────────────────────────────────────────────
// Each sign-in loads that account's list; signing out empties it.
document.addEventListener('DOMContentLoaded', () => {
  // The bell in the profile menu (popups.js only fills icons inside windows)
  const row = document.querySelector('.tb-acct-nt');
  if (row && typeof dcFillIcons === 'function') dcFillIcons(row);
  try {
    firebase.auth().onAuthStateChanged(async user => {
      ntItems = [];
      ntRefresh();
      if (!user) return;
      const list = await dcLoadNotifications();
      if (list) { ntItems = _ntTrim(list); ntRefresh(); }
      // Anything new since the last visit (the Board straight away; the
      // Soundtrack and certifications once the plays are loaded)
      ntWatch();
    });
  } catch (e) {}
});
