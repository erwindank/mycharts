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
  ap_skipped: { emoji: '⏭️', text: p => t('nt_ap_skipped', { n: p.n, chart: t('ap_row_' + p.period) }) }
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
  if (link.tab === 'playlists' && link.playlist) {
    // Open that playlist; it may have been deleted or renamed since
    if (_ytPlaylists[link.playlist]) _dcPlExpandedName = link.playlist;
    else setTimeout(() => dcPlToast(t('nt_pl_gone', { name: link.playlist })), 300);
  }
  if (currentPeriod === link.tab && link.tab === 'playlists') dcRenderPlaylistsView();
  else dcGoTab(link.tab);
  // Bring an opened playlist into view
  if (link.playlist) setTimeout(() => document.querySelector('.dc-pl-card-open')?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 150);
}

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
    });
  } catch (e) {}
});
