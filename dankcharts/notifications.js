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
// these), its category (cat: the coloured tile and the small label above the
// text, nt_cat_<cat>) and its text.
/* What a certified release is called right now: 'single' / 'ep' while that
   type is Apart and the release is marked as one, else ''. Read from the
   saved album title + artist (app.js certReleaseLabelType); the rtype saved
   on the notification is only a fallback if app.js isn't ready. */
function _ntCertRtype(p) {
  if (typeof certReleaseLabelType === 'function' && p.title) {
    try { return certReleaseLabelType(p.title, p.artist || ''); } catch (e) {}
  }
  return p.rtype || '';
}

const NT_KINDS = {
  // A playlist made by automatic chart playlists
  ap_made: { emoji: '🎵', cat: 'playlist', text: p => t('nt_ap_made', { name: p.name }) },
  // A smart playlist with its bell on got a lot of new songs (smartplaylists.js step 9)
  sp_changed: { emoji: '✨', cat: 'playlist', text: p => t(p.dropped ? 'nt_sp_changed' : 'nt_sp_changed_in', { name: p.name, n: p.added, gone: p.dropped }) },
  // Missed periods past the 10-at-a-time limit
  ap_skipped: { emoji: '⏭️', cat: 'playlist', text: p => t('nt_ap_skipped', { n: p.n, chart: t('ap_row_' + p.period) }) },
  // A month has ended: its Soundtrack is ready to look back on (p.key 'YYYY-MM')
  st_month: { emoji: '🎬', cat: 'soundtrack', text: p => t('nt_st_month', { month: crPeriodTitle('month', p.key) }) },
  // A year has ended: its Soundtrack is ready (p.key 'YYYY')
  st_year: { emoji: '🎉', cat: 'soundtrack', text: p => t('nt_st_year', { year: p.key }) },
  // A song or album reached Gold / Platinum / Diamond (p.tier, p.mult)
  // The emoji follows the tier, same as the Certifications wall: 📀 gold, 💿 platinum, 💎 diamond
  // Single / EP / album is decided when the list is drawn, from the release's
  // current mark and the Apart setting (_ntCertRtype), so old notifications
  // follow too and a type put back "With albums" says album again.
  cert_new: { emoji: p => ({ platinum: '💿', diamond: '💎' })[p.tier] || '📀', cat: 'cert', text: p => {
    const rt = p.type === 'album' ? _ntCertRtype(p) : '';
    return t(p.type !== 'album' ? 'nt_cert_song'
      : rt === 'single' ? 'nt_cert_single' : rt === 'ep' ? 'nt_cert_ep' : 'nt_cert_album', {
    title: p.title, artist: p.artist,
    tier: p.tier === 'diamond' ? tDiamondLabel(p.mult || 1) : tTierLabel(p.tier) }); } },
  // More certifications at once than get one each (NT_CERT_MAX)
  cert_more: { emoji: '📀', cat: 'cert', text: p => t('nt_cert_more', { n: p.n }) },
  // A year's awards period (its own eligibility window) has ended: time to
  // pick nominees (p.year). Opens Awards → My Grammys on that year.
  aw_open: { emoji: '🏆', cat: 'awards', text: p => t('nt_aw_open', { year: p.year }) },
  // Every switched-on category of a year has a winner: the ceremony is ready
  // to watch (p.year). Opens the ceremony itself.
  aw_ready: { emoji: '🎬', cat: 'awards', text: p => t('nt_aw_ready', { year: p.year }) },
  // A new holder at the top of a Records list (p.title = the list, in the
  // language it was read in; p.type song / album / artist)
  // p.n > 1: the same holder took several lists at once (p.title = the first)
  rec_new: { emoji: '🥇', cat: 'record', text: p => {
    const multi = p.n > 1 ? '_multi' : '';
    return p.type === 'artist'
      ? t('nt_rec_new_artist' + multi, { name: p.name, record: p.title, n: p.n })
      : t('nt_rec_new' + multi, { name: p.name, artist: p.artist, record: p.title, n: p.n });
  } },
  // Many lists changed at once (NT_REC_MAX)
  rec_many: { emoji: '🥇', cat: 'record', text: p => t('nt_rec_many', { n: p.n }) },
  // New #1s that a chart settings change made (sizes, week start…), not new plays
  rec_settings: { emoji: '🥇', cat: 'record', text: p => p.n === 1 && p.name
    ? t('nt_rec_settings_one', { name: p.name, record: p.title })
    : t('nt_rec_settings', { n: p.n }) },
  // Someone else replied to one of the user's Board posts (p.n of them)
  bd_reply: { emoji: '💬', cat: 'board', text: p => p.n > 1
    ? t('nt_bd_replies', { n: p.n, title: p.title })
    : t('nt_bd_reply', { name: p.name, title: p.title }) },
  // A moderator changed the status of one of the user's Board posts
  bd_status: { emoji: '📌', cat: 'board', text: p => t('nt_bd_status', { title: p.title, status: t('board_status_' + p.status) }) },
  // A one-time note from the site about a change that moved the user's
  // numbers (p.key names the text, nt_notice_<key>). The first one
  // (2026-11-09) explains the singles/EPs Records fix — see NT_NOTICE_REC_UNTIL.
  notice: { emoji: '📣', cat: 'news', text: p => t('nt_notice_' + p.key) }
};

/* Record notifications that cover several lists (one holder taking many,
   or many holders at once) keep the lists themselves in p.items, so the
   row can open into a breakdown with a link to each one. Each item is
   { nm, ar, ty, ti, v, nth }: holder name, its artist, its type, the
   list's title, its Records section and which list of that title it is
   (the same fields a single record's link uses). Capped so one
   notification can't grow the account's notifications document much. */
const NT_REC_LIST_MAX = 60;
// Which notifications have their breakdown open (this visit only)
const _ntOpenLists = new Set();

// Newest first, no more than NT_MAX, nothing older than NT_MAX_AGE
function _ntTrim(list) {
  const cutoff = Date.now() - NT_MAX_AGE;
  const out = list.filter(x => x && x.at >= cutoff).sort((a, b) => b.at - a.at).slice(0, NT_MAX);
  /* Record breakdowns (p.items, up to NT_REC_LIST_MAX lines each) are kept
     only on the NT_LISTS_KEEP newest notifications that have one, so the
     account's notifications document stays far below Firestore's 1 MB limit.
     Older ones keep their text; they just lose the "See all" list. */
  let lists = 0;
  return out.map(x => {
    if (!x.p || !Array.isArray(x.p.items)) return x;
    if (++lists <= NT_LISTS_KEEP) return x;
    const p = Object.assign({}, x.p);
    delete p.items;
    return Object.assign({}, x, { p });
  });
}
const NT_LISTS_KEEP = 20;

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

/* The list (redesigned 2026-11-05): All / Unread tabs at the top, then the
   notifications grouped under Today / Yesterday / Earlier. Each one has a
   coloured tile with its emoji (colour by category; a certification takes
   its tier's colour), a small category label with the time, the text, a
   dot while unread, and an ✕ to remove just that one. */
let _ntFilter = 'all';   // 'all' | 'unread'

/* The certified seal on a certification's tile (redone 2026-11-09 as an
   award ribbon): a shiny metal rosette on the tile's bottom-right corner
   with two V-cut ribbon tails hanging below it, like a prize ribbon.
   The metal follows the tier so they read apart at a glance: shiny gold,
   silvery platinum, icy-blue diamond. A multi-diamond shows its
   multiplier ("3×") on the disc; a word wouldn't be readable at this size. */
const NT_SEAL_METAL = {   // light, bright, mid, dark, deep (rosette sheen + tails)
  gold:     ['#fff8d6', '#ffe27a', '#e9b330', '#b07a14', '#7a5208'],
  platinum: ['#ffffff', '#eef2f7', '#c3ccd8', '#8592a5', '#566275'],
  diamond:  ['#f2feff', '#bff3ff', '#6fd3f2', '#2a93c0', '#155f85']
};
// The pleated edge: a 26-point star around the disc (viewBox 0 0 32 40)
const NT_SEAL_EDGE = (() => {
  const pts = [], n = 26;
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? 11.6 : 13.4, a = (i / (n * 2)) * Math.PI * 2;
    pts.push((16 + r * Math.cos(a)).toFixed(2) + ',' + (14 + r * Math.sin(a)).toFixed(2));
  }
  return pts.join(' ');
})();
function _ntSealHtml(k, p) {
  if (k.cat !== 'cert') return '';
  const tier = NT_SEAL_METAL[p.tier] ? p.tier : 'gold';
  const [lt, br, md, dk, dp] = NT_SEAL_METAL[tier];
  const id = 'ntSeal-' + tier;   // the same gradients for every seal of this tier
  // Multi-diamond: the multiplier on the disc
  const label = p.tier === 'diamond' && p.mult > 1
    ? `<text x="16" y="16.4" text-anchor="middle" font-size="6.4" font-weight="800" fill="${dp}">${esc(p.mult + '×')}</text>` : '';
  return `<span class="nt-seal"><svg viewBox="0 0 32 40" width="24" height="30">` +
    `<defs>` +
    // Shiny metal: a diagonal sweep with a bright band through the middle
    `<linearGradient id="${id}-m" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${lt}"/><stop offset=".28" stop-color="${md}"/><stop offset=".5" stop-color="${dk}"/>` +
    `<stop offset=".68" stop-color="${br}"/><stop offset="1" stop-color="${dk}"/></linearGradient>` +
    // The disc: lit from the top-left
    `<radialGradient id="${id}-d" cx="35%" cy="30%" r="80%">` +
    `<stop offset="0" stop-color="${lt}"/><stop offset=".45" stop-color="${br}"/><stop offset="1" stop-color="${md}"/></radialGradient>` +
    // The tails: satin, darker toward the cut ends
    `<linearGradient id="${id}-t" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${md}"/><stop offset="1" stop-color="${dk}"/></linearGradient>` +
    `</defs>` +
    // The two tails behind the rosette, each with a V-cut end and a bright edge stripe
    `<path d="M9.5 19 L15.5 21.5 L12.6 39 L10.3 35.6 L6.6 37.6 Z" fill="url(#${id}-t)"/>` +
    `<path d="M16.5 21.5 L22.5 19 L25.4 37.6 L21.7 35.6 L19.4 39 Z" fill="url(#${id}-t)"/>` +
    `<path d="M8.4 22.4 L7.4 36.8 M14.3 22.6 L11.9 37.6 M17.7 22.6 L20.1 37.6 M23.6 22.4 L24.6 36.8" stroke="${br}" stroke-width=".7" opacity=".85"/>` +
    // The pleated rosette, its rim and the disc
    `<polygon points="${NT_SEAL_EDGE}" fill="url(#${id}-m)" stroke="${dp}" stroke-width=".4" stroke-opacity=".6"/>` +
    `<circle cx="16" cy="14" r="10" fill="url(#${id}-m)" stroke="${dp}" stroke-width=".5" stroke-opacity=".7"/>` +
    // Fine ticks round the rim, like the engraved ring on a medal
    `<circle cx="16" cy="14" r="8.6" fill="none" stroke="${dk}" stroke-width="1.6" stroke-dasharray=".35 1.25" opacity=".55"/>` +
    `<circle cx="16" cy="14" r="7" fill="url(#${id}-d)" stroke="${lt}" stroke-width=".6"/>` +
    // The shine: a soft diagonal glint across the disc
    `<path d="M11.2 15.6 L15.6 8.4 L17.8 8.2 L12.4 17.6 Z" fill="#fff" opacity=".45"/>` +
    label +
    `</svg></span>`;
}

function ntSetFilter(f) {
  _ntFilter = f === 'unread' ? 'unread' : 'all';
  _ntRenderList();
}

// Which day group a time falls in
function _ntGroupOf(ms) {
  const ds = localDateStr(tzDate(new Date(ms))), td = localDateStr(tzNow());
  if (ds === td) return 'today';
  if (ds === dyShift(td, -1)) return 'yesterday';
  return 'earlier';
}

function _ntRenderList() {
  const body = document.getElementById('ntBody');
  if (!body) return;
  const unread = _ntUnread();
  const sub = document.getElementById('ntSub');
  if (sub) sub.textContent = ntItems.length ? (unread ? t('nt_sub', { n: unread }) : t('nt_caught_up')) : '';
  const foot = document.getElementById('ntFoot');
  if (foot) foot.hidden = !ntItems.length;
  const all = document.getElementById('ntReadAllBtn');
  if (all) all.disabled = !unread;
  if (!ntItems.length) {
    _ntFilter = 'all';
    body.innerHTML = `<div class="nt-empty"><span class="nt-empty-ico">${dcIco('bell')}</span>` +
      `<span class="nt-empty-title">${esc(t('nt_caught_up'))}</span>` +
      `<span class="nt-empty-text">${esc(t('nt_empty'))}</span></div>`;
    return;
  }
  // The tabs
  const tab = (f, label, n) => `<button type="button" role="tab" aria-selected="${_ntFilter === f}" class="nt-tab" onclick="ntSetFilter('${f}')">` +
    `${esc(label)}${n ? `<span class="nt-tab-n">${n > 99 ? '99+' : n}</span>` : ''}</button>`;
  let html = `<div class="nt-tabs" role="tablist">` + tab('all', t('nt_f_all'), 0) + tab('unread', t('nt_unread'), unread) + `</div>`;

  const list = _ntFilter === 'unread' ? ntItems.filter(x => !x.read) : ntItems;
  if (!list.length) {
    html += `<div class="nt-empty nt-empty-sm"><span class="nt-empty-ico">${dcIco('check')}</span>` +
      `<span class="nt-empty-title">${esc(t('nt_caught_up'))}</span>` +
      `<span class="nt-empty-text">${esc(t('nt_no_unread'))}</span></div>`;
    body.innerHTML = html;
    return;
  }
  let group = null, i = 0;
  list.forEach(x => {
    const k = NT_KINDS[x.kind];
    if (!k) return;
    const g = _ntGroupOf(x.at);
    if (g !== group) {
      if (group) html += `</div>`;
      group = g;
      html += `<div class="nt-group-h">${esc(t(g === 'yesterday' ? 'nt_yesterday' : 'nt_grp_' + g))}</div><div class="nt-list">`;
    }
    const p = x.p || {};
    // A certification wears its tier's colour (gold / platinum / diamond)
    const tone = k.cat === 'cert' && p.tier ? 'cert-' + p.tier : k.cat;
    // nt-has-list pins the ✕ to the top row instead of the middle of the item
    const hasList = !!(p.items && p.items.length > 1);
    html += `<div class="nt-item${x.read ? '' : ' nt-unread'}${hasList ? ' nt-has-list' : ''}" style="--nt-i:${i++}">` +
      // The tone class sits on the row so the tile and the category label share it
      `<button type="button" class="nt-row nt-tone-${esc(tone)}" onclick="ntOpenItem('${esc(x.id)}')">` +
      // emoji is a string, or a function of the stored params (certifications pick by tier)
      `<span class="nt-tile" aria-hidden="true">${typeof k.emoji === 'function' ? k.emoji(p) : k.emoji}${_ntSealHtml(k, p)}</span>` +
      `<span class="nt-main">` +
      `<span class="nt-meta"><span class="nt-cat">${esc(t('nt_cat_' + k.cat))}</span><span class="nt-time">${esc(ntAgo(x.at))}</span></span>` +
      `<span class="nt-text">${esc(k.text(p))}</span>` +
      `</span>` +
      (x.read ? '' : `<span class="nt-row-dot" role="img" aria-label="${esc(t('nt_unread'))}"></span>`) +
      `</button>` +
      `<button type="button" class="nt-dismiss" onclick="ntDismiss('${esc(x.id)}')" title="${esc(t('nt_dismiss'))}" aria-label="${esc(t('nt_dismiss'))}">${dcIco('x')}</button>` +
      _ntListHtml(x) +
      `</div>`;
  });
  if (group) html += `</div>`;
  body.innerHTML = html;
}

/* The "Show the list" switch and, when open, the breakdown under a record
   notification that covers several lists. Each line is its own link to that
   list. Empty for every other notification — and for record notifications
   posted before 2026-11-09, which didn't keep their lists. */
function _ntListHtml(x) {
  const items = x.p && Array.isArray(x.p.items) ? x.p.items : null;
  if (!items || items.length < 2) return '';
  const open = _ntOpenLists.has(x.id);
  // More lists changed than were kept (NT_REC_LIST_MAX): say how many aren't shown
  const total = Math.max(items.length, x.p.n || 0);
  let h = `<button type="button" class="nt-more" aria-expanded="${open}" onclick="ntToggleList('${esc(x.id)}')">` +
    `${esc(open ? t('nt_list_hide') : t('nt_list_show', { n: total }))}<span class="nt-more-chev" aria-hidden="true">▾</span></button>`;
  if (!open) return h;
  h += `<div class="nt-sub" role="list">`;
  // "X now holds N records": one holder, already named above, so the lines
  // only name the lists. "N records have a new #1": each line names its holder.
  const oneHolder = x.kind === 'rec_new';
  const PD_LABEL = { day: 'rec_daily_label', week: 'rec_weekly_label', month: 'rec_monthly_label', year: 'rec_yearly_label' };
  items.forEach((it, i) => {
    // A song or album names its artist; an artist is the holder itself
    const who = oneHolder ? '' : it.ty === 'artist' || !it.ar ? it.nm : t('nt_list_by', { name: it.nm, artist: it.ar });
    const title = it.ti + (it.pd && PD_LABEL[it.pd] ? ' · ' + t(PD_LABEL[it.pd]) : '');
    h += `<button type="button" role="listitem" class="nt-sub-row" onclick="ntOpenListItem('${esc(x.id)}',${i})">` +
      `<span class="nt-sub-text"><span class="nt-sub-title">${esc(title)}</span>` +
      (who ? `<span class="nt-sub-who">${esc(who)}</span>` : '') + `</span>` +
      `<span class="nt-sub-go" aria-hidden="true">›</span></button>`;
  });
  if (total > items.length) h += `<div class="nt-sub-more">${esc(t('nt_list_rest', { n: total - items.length }))}</div>`;
  return h + `</div>`;
}

// Opens or closes one notification's breakdown
function ntToggleList(id) {
  if (_ntOpenLists.has(id)) _ntOpenLists.delete(id); else _ntOpenLists.add(id);
  _ntRenderList();
}

// One line of a breakdown was clicked: mark the notification read and open that list
function ntOpenListItem(id, i) {
  const x = ntItems.find(n => n.id === id);
  const it = x && x.p && x.p.items && x.p.items[i];
  if (!it) return;
  if (!x.read) _ntChange(list => list.map(n => n.id === id ? Object.assign({}, n, { read: true }) : n));
  ntClose();
  ntFollow({ tab: 'records', view: it.v, title: it.ti, nth: it.nth });
}

// Removes one notification (here and on the account)
function ntDismiss(id) {
  _ntChange(list => list.filter(i => i.id !== id));
}


function ntOpen() {
  document.querySelectorAll('.ctrl-group.open').forEach(g => g.classList.remove('open'));
  const modal = document.getElementById('ntModal');
  if (!modal) return;
  _ntFilter = 'all';
  _ntRenderList();
  modal.classList.add('open');
  // The rows slide in one after another only as the window opens, not on
  // every redraw after it (style.css .nt-anim)
  const body = document.getElementById('ntBody');
  if (body) {
    body.classList.add('nt-anim');
    clearTimeout(body._ntAnimT);
    body._ntAnimT = setTimeout(() => body.classList.remove('nt-anim'), 900);
  }
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
  // A year's awards: its ballot, or (ceremony) the ceremony itself
  if (link.tab === 'awards' && link.year) { _ntOpenAwards(+link.year, !!link.ceremony); return; }
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
      await _ntWatchAwards();
      _ntRecordsCheck();   // reads Records now if built, else builds it later in idle time
      // Smart playlists with their bell on (smartplaylists.js)
      if (typeof spNotifyWatch === 'function') await spNotifyWatch();
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
    dcNotify({ kind: 'cert_new', type: c.type, rtype: c.rtype || '', title: c.title, artist: c.artist, tier: c.tier, mult: c.mult,
               link: { tab: 'cert', type: c.type, key: c.key } });
  }
}

/* ─── Awards (2026-11-09) ─────────────────────────────────────────────────
   Two notifications per year of My Grammys:
     aw_open  — the year's awards period has ended (the day after its
                eligibility window ends, so a custom window like Oct–Sep is
                followed), time to pick nominees. Skipped when the ballot is
                already finished, or nothing was played in the window.
     aw_ready — every switched-on category has a winner, so the ceremony is
                ready to watch. Told the moment the last winner is picked
                (ntAwardsSaved, called from _awardsSave in app.js) and by the
                watcher, for a ballot finished on another device.
   Kept in notifyState: awOpen (newest year told as open) and awReady (years
   told as ready), so each is told once across all devices, and removing a
   winner and picking again doesn't tell it twice. The watcher only looks at
   last year and this year; picking winners tells any year (older ones too). Works for every data source: it reads the ballot and
   the loaded plays. */

// A year's ballot without touching the Awards tab's own copy: the one in
// memory if the tab loaded it, else the newer of the device and cloud copies
// (the same rule _awardsLoad uses), else the default calendar-year ballot.
async function _ntAwardsBallot(year) {
  if (_awardsYearData[year]) return _awardsYearData[year];
  const remote = (typeof dcLoadAwards === 'function') ? await dcLoadAwards(year) : null;
  const local = _awardsReadLocal(year);
  const pick = (local && remote) ? ((local.savedAt || 0) > (remote.savedAt || 0) ? local : remote) : (local || remote);
  return pick ? _awardsFillCats(JSON.parse(JSON.stringify(pick))) : _awardsDefaultData(year);
}

// Every switched-on category has a winner (and at least one is switched on)
function _ntAwardsDone(data) {
  if (!data || !data.categories) return false;
  const on = AWARD_CATEGORIES.filter(c => data.categories[c.id]?.enabled ?? c.defaultOn);
  return on.length > 0 && on.every(c => !!data.categories[c.id]?.winner);
}

// Anything played inside the year's window? (allPlays holds Date objects)
function _ntAwardsHasPlays(data) {
  const s = new Date(data.eligStart + 'T00:00:00'), e = new Date(data.eligEnd + 'T23:59:59');
  return allPlays.some(p => p.date >= s && p.date <= e);
}

async function _ntWatchAwards() {
  if (typeof AWARD_CATEGORIES === 'undefined') return;
  const thisYear = tzNow().getFullYear();
  const today = localDateStr(tzNow());
  const opened = [], done = [];   // years whose window has ended (with plays) / whose ballot is finished
  const ended = {};               // year → the day its window ended, for the first run
  for (const y of [thisYear - 1, thisYear]) {
    const data = await _ntAwardsBallot(y);
    if (!data || !data.eligEnd) continue;
    if (_ntAwardsDone(data)) { done.push(y); continue; }
    if (data.eligEnd < today && _ntAwardsHasPlays(data)) { opened.push(y); ended[y] = data.eligEnd; }
  }
  const out = await dcUpdateNotifyState(cur => {
    const state = Object.assign({}, cur);
    const tell = { open: [], ready: [] };
    let changed = false;
    // Open: the first run only tells a window that ended in the last 30 days
    // (no back-fill), then notes the newest ended year as told
    if (typeof cur.awOpen !== 'number') {
      const recent = dyShift(today, -30);
      tell.open = opened.filter(y => ended[y] >= recent);
      state.awOpen = Math.max(thisYear - 2, ...opened, ...done);
      changed = true;
    } else {
      tell.open = opened.filter(y => y > cur.awOpen);
      if (tell.open.length) { state.awOpen = Math.max(cur.awOpen, ...tell.open); changed = true; }
    }
    // Ready: the first run notes the finished ballots without telling them
    if (!Array.isArray(cur.awReady)) {
      state.awReady = done.slice();
      changed = true;
    } else {
      tell.ready = done.filter(y => !cur.awReady.includes(y));
      if (tell.ready.length) { state.awReady = cur.awReady.concat(tell.ready).slice(-20); changed = true; }
    }
    return { state: changed ? state : null, out: tell };
  });
  if (!out || typeof out !== 'object') return;
  for (const y of out.open) dcNotify({ kind: 'aw_open', year: y, link: { tab: 'awards', year: y } });
  for (const y of out.ready) {
    _ntAwReadyTold.add(y);
    dcNotify({ kind: 'aw_ready', year: y, link: { tab: 'awards', year: y, ceremony: true } });
  }
}

/* Called by _awardsSave (app.js) after every change to a ballot, for any
   year — an older year finished only now is told too. It tells only when
   this change is what finished the ballot (it wasn't finished just before),
   so editing an old ballot that was finished long ago tells nothing. Then it
   asks the account whether that year was told already. */
const _ntAwReadyTold = new Set();   // years told (or known told) this visit
const _ntAwWasDone = {};            // year → finished as of the last save seen
async function ntAwardsSaved(year) {
  year = +year;
  const data = _awardsYearData[year];
  // Finished before this change? The last save seen this visit, else the copy
  // the cloud held before it (_awardsSave hasn't replaced that yet; read
  // synchronously, before anything here waits)
  const was = (year in _ntAwWasDone) ? _ntAwWasDone[year]
    : (typeof _awardsGetBase === 'function' && _ntAwardsDone(_awardsGetBase(year)));
  const now = _ntAwardsDone(data);
  _ntAwWasDone[year] = now;
  if (was || !now || _ntAwReadyTold.has(year)) return;
  if (typeof _apAllowed !== 'function' || !_apAllowed()) return;
  _ntAwReadyTold.add(year);
  const tell = await dcUpdateNotifyState(cur => {
    const told = Array.isArray(cur.awReady) ? cur.awReady : [];
    if (told.includes(year)) return { state: null, out: false };
    return { state: Object.assign({}, cur, { awReady: told.concat([year]).slice(-20) }), out: true };
  });
  if (tell === true) dcNotify({ kind: 'aw_ready', year, link: { tab: 'awards', year, ceremony: true } });
  // Couldn't save: try again on the next save
  else if (tell === 'error') { _ntAwReadyTold.delete(year); _ntAwWasDone[year] = false; }
}

// Awards → My Grammys on that year (the same way awOpenCeremony goes there),
// then the ceremony on top when asked
async function _ntOpenAwards(year, ceremony) {
  _awardsRememberYear('mygrammys', year);
  _awardsYear = year;
  _awardsSubTab = 'mygrammys';
  if (currentPeriod === 'awards') awardsSubTab('mygrammys');
  else dcGoTab('awards');
  if (!ceremony) return;
  await _awardsLoad(year);
  if (typeof startAwardsCeremony === 'function') startAwardsCeremony();
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
/* The one-time "why did I get new #1s" note (notice / rec_singles). On
   2026-11-09 Records started ranking singles and EPs among themselves, as the
   charts do — before, a single only counted as a Singles #1 in a week no album
   out-played it — so anyone with singles or EPs set Apart saw a batch of new
   #1s. Told once per account, only to accounts that had Records notifications
   before this (a new account had nothing to be confused by), only while
   something is set Apart, and not after this date. */
const NT_NOTICE_REC_UNTIL = Date.UTC(2026, 11, 31);
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
      // nth goes into the notification's link so a tap can find this exact
      // table again (see _ntFindRecordTable)
      /* New Charts repeats each title in its Daily/Weekly/Monthly/Yearly
         panels without naming the period, so the breakdown list keeps the
         panel's period to tell those lines apart (pd, see _ntListHtml). */
      const pd = tb.closest('.nc-rec-panel')?.dataset.ncPeriod || '';
      out[_ntHash(base + '|' + seen[base])] = { k: rec.prefKey, name: rec.name, artist: rec.artist, type: rec.type, title, sec: secId, nth: seen[base], pd, tie: _ntTiedKeys(tb, row) };
    });
  });
  return out;
}

/* Everyone sharing first place with the #1 row (same .rec-count figure).
   Lists sort by the figure alone, so between equals the order is just
   build order and can flip from one build to the next. Before 2026-11-10
   every flip posted "New #1s!" again (two EPs with the same years on the
   yearly chart came back every check). ntRecordsBuilt uses this so a tie
   is never a new record and a tied holder keeps its place. */
function _ntTiedKeys(tb, row0) {
  const cnt = r => { const c = r.querySelector('.rec-count'); return c ? c.textContent.replace(/\s+/g, ' ').trim() : ''; };
  const top = cnt(row0);
  if (!top) return [];   // a list without a count column: no tie check
  const keys = [];
  // Real rows only (the chart-run rows under them share their data-rec-idx)
  for (const r of tb.querySelectorAll('tbody tr')) {
    if (r === row0 || !r.querySelector('.rec-rank') || !r.dataset.recIdx) continue;
    if (cnt(r) !== top) break;   // sorted, so the first different figure ends the tie
    const k = r.dataset.recPrefkey || r.querySelector('.img-src-btn[data-prefkey]')?.getAttribute('data-prefkey') || '';
    if (k) keys.push(k);
    if (keys.length >= 20) break;
  }
  return keys;
}

/* Which version of the Records rules the stored holders were read under.
   2 (2026-11-13): Records counts only finished days/weeks/months/years
   (recRunningKeys, app.js). Holders saved under the old rules include the
   running periods, so comparing against them would post a batch of "new #1s"
   that are only the switch — a different version starts over silently. */
const NT_REC_RULES = 2;

/* The settings that decide who leads a list without any new plays: chart
   sizes, the daily and New/Bubbling sizes, week start, timezone, how singles
   and EPs are set and whether they lend plays to their album. When any of
   these is not what the stored holders were read under (changed here, or a
   second device set up differently), holders are re-read silently: moving a
   setting is not anyone taking a record, and two devices with different
   chart sizes used to hand the same records back and forth on every check. */
function _ntRecSettingsSig() {
  const g = (fn, ...a) => { try { return typeof fn === 'function' ? fn(...a) : ''; } catch (e) { return ''; } };
  return _ntHash([
    chartSizeSongsW, chartSizeArtistsW, chartSizeAlbumsW,
    chartSizeSongsM, chartSizeArtistsM, chartSizeAlbumsM,
    chartSizeSongsY, chartSizeArtistsY, chartSizeAlbumsY,
    g(window.dySizeOf, 'songs'), g(window.dySizeOf, 'artists'), g(window.dySizeOf, 'albums'),
    g(window._aroundSizesSig), weekStartDay, userTimezone,
    typeof releaseSeparation !== 'undefined' ? JSON.stringify(releaseSeparation) : '',
    g(window.singleRollupLevel)
  ].join('|'));
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
    const sepOn = typeof separatedTypes === 'function' && separatedTypes().length > 0;
    const sig = _ntRecSettingsSig();   // see NT_REC_RULES / _ntRecSettingsSig
    const res = await dcUpdateNotifyState(cur => {
      const prev = cur.rec;
      const notices = cur.notices || {};
      // The one-time note (NT_NOTICE_REC_UNTIL). Decided once per account:
      // told if it had Records notifications already and something is Apart,
      // otherwise marked 'skip' so it never turns up later out of context.
      let noticeVal = null, notice = false;
      if (!notices.recSingles && Date.now() < NT_NOTICE_REC_UNTIL) {
        notice = !!(prev && prev.lead) && sepOn;
        noticeVal = notice ? Date.now() : 'skip';
      }
      let rec = null, out = [], bySettings = false;
      // First time, another language or older Records rules: note where
      // things stand, tell nothing
      if (!prev || !prev.lead || prev.lang !== lang || prev.v !== NT_REC_RULES) rec = { lang, asOf, lead, v: NT_REC_RULES, sig };
      else if (asOf >= prev.asOf) {   // older data than last time: leave it alone
        // Other chart settings than last time (sizes, week start…): the new
        // #1s are told, but as one "your settings changed" notification
        // (rec_settings) rather than as records anyone took
        bySettings = prev.sig !== sig;
        // Last holder still level with the top (only build order put another
        // first): they keep the record and nothing is new (see _ntTiedKeys)
        ids.forEach(id => {
          const p = prev.lead[id];
          if (p && p !== lead[id] && (now[id].tie || []).includes(p)) lead[id] = p;
        });
        out = ids.filter(id => prev.lead[id] && prev.lead[id] !== lead[id]);
        if (out.length || bySettings || JSON.stringify(prev.lead) !== JSON.stringify(lead)) rec = { lang, asOf, lead, v: NT_REC_RULES, sig };
      }
      if (!rec && !noticeVal) return { state: null, out: { changed: [], notice: false, settings: false } };
      const state = Object.assign({}, cur);
      if (rec) state.rec = rec;
      if (noticeVal) state.notices = Object.assign({}, notices, { recSingles: noticeVal });
      return { state, out: { changed: out, notice, settings: bySettings } };
    });
    if (!res || typeof res !== 'object') return;   // 'error' (offline)
    // Posted after the record notifications (finally, below), so it lists
    // above them and is read first
    _ntRecNotice = !!res.notice;
    const changed = res.changed;
    if (!Array.isArray(changed) || !changed.length) return;
    /* Moved by a settings change (see _ntRecSettingsSig): one notification
       for every list, worded as the setting's doing — the same breakdown
       list as rec_many. One list alone opens that list directly. */
    if (res.settings) {
      const all = changed.map(id => now[id]);
      const n = { kind: 'rec_settings', n: all.length, link: { tab: 'records' } };
      if (all.length > 1) n.items = _ntRecItems(all);
      else Object.assign(n, { name: all[0].name, title: all[0].title,
                              link: { tab: 'records', view: all[0].sec, title: all[0].title, nth: all[0].nth } });
      dcNotify(n);
      return;
    }
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
      // Every changed list, grouped by holder so one song's lists sit together
      const all = [];
      byHolder.forEach(list => list.forEach(r => all.push(r)));
      dcNotify({ kind: 'rec_many', n: changed.length, items: _ntRecItems(all), link: { tab: 'records' } });
      return;
    }
    byHolder.forEach(list => {
      const r = list[0];
      const n = { kind: 'rec_new', type: r.type, name: r.name, artist: r.artist, title: r.title, n: list.length,
                  link: { tab: 'records', view: r.sec, title: r.title, nth: r.nth } };
      // Several lists for one holder: keep them for the breakdown
      if (list.length > 1) n.items = _ntRecItems(list);
      dcNotify(n);
    });
  } catch (e) {
    console.warn('[dankcharts] Records notification check failed:', e);
  } finally {
    if (_ntRecNotice) { _ntRecNotice = false; dcNotify({ kind: 'notice', key: 'rec_singles', link: { tab: 'records' } }); }
    _ntRecBusy = false;
  }
}
let _ntRecNotice = false;   // the one-time note is due (set inside ntRecordsBuilt)

// The stored breakdown of a record notification (see NT_REC_LIST_MAX).
// Firestore refuses undefined, so a missing field stores ''.
function _ntRecItems(list) {
  return list.slice(0, NT_REC_LIST_MAX).map(r => ({
    nm: r.name || '', ar: r.artist || '', ty: r.type || '', ti: r.title || '', v: r.sec || '', nth: r.nth || 1, pd: r.pd || ''
  }));
}

/* Opens Records on the exact list a record notification is about.

   Until 2026-11-06 this only picked the section and looked for a *visible*
   title, so a list behind a switch (Artists instead of Songs, Monthly
   instead of Weekly, In a row instead of Total, another Fastest tier) was
   never found and the tap just landed on whatever the section showed last.
   Now it finds the list's table (same walk as _ntRecordLeaders, so the nth
   list with a repeated title is the right one), stores every switch that
   hides it, re-applies the section, and scrolls to it. */

// The table a link points at: the nth ranked list titled link.title in its
// section (nth missing on older notifications → the first one)
function _ntFindRecordTable(link) {
  const sec = document.getElementById(link.view);
  if (!sec || !link.title) return null;
  const want = link.nth || 1;
  let n = 0, first = null;
  for (const tb of sec.querySelectorAll('table')) {
    const tEl = tb.closest('.rec-section')?.querySelector('.rec-section-title');
    if (!tEl || tEl.textContent.replace(/\s+/g, ' ').trim() !== link.title) continue;
    if (!first) first = tb;
    // Count only ranked lists, exactly as _ntRecordLeaders did
    const row = tb.querySelector('tbody tr[data-rec-idx="0"]');
    if (!row || !row.classList.contains('rec-rank-1')) continue;
    if (++n === want) return tb;
  }
  return first;
}

// Stores the choice of every switch between the table and its section, so
// the next applyRecordsViewFilter() shows it. Returns the Total / In a row
// mode the table needs (or null), which is applied separately.
function _ntPickSwitchesFor(tb) {
  let run = null;
  const set = (k, v) => { try { if (v) localStorage.setItem(k, v); } catch (e) {} };
  for (let el = tb; el && !el.matches('.chart-section'); el = el.parentElement) {
    const d = el.dataset;
    if (el.matches('.rec-ent-panel')) set('dc_rec_ent_' + d.recEntScope, d.recEnt);       // Songs / Artists / Albums
    if (el.matches('.rec-per-panel')) set('dc_rec_per_' + d.recPerScope, d.recPer);       // Daily / Weekly / Monthly / Yearly
    if (el.matches('.nc-rec-panel')) { set('dc_nc_rec_type', d.ncType); set('dc_nc_rec_period', d.ncPeriod); }   // New Charts
    if (el.matches('.mil-panel')) set('dc_mil_rec_type', d.milType);                    // Milestones
    if (el.matches('.fast-panel')) set('dc_fast_rec_type', d.fastType);                 // Fastest
    if (el.matches('.rec-section[data-fast-tier]')) {                                    // Fastest tier ("to 100 plays")
      const panel = el.closest('.fast-panel');
      if (panel) set('dc_fast_tier_' + panel.dataset.fastType, d.fastTier);
    }
    if (el.matches('.rec-run-consec')) run = 'consec';                                  // In a row
    if (el.matches('.rec-run-total')) run = 'total';                                    // Total
    if (el.classList.contains('rec-collapsed')) el.classList.remove('rec-collapsed');   // a folded list
  }
  return run;
}

function _ntOpenRecord(link) {
  if (link.view && REC_SECTION_IDS.includes(link.view)) {
    try { localStorage.setItem('dc_records_active_view', link.view); } catch (e) {}
  }
  // A search shows its own matches instead of the section
  if (typeof recSearchQuery === 'function' && recSearchQuery() && typeof clearRecordsSearch === 'function') clearRecordsSearch();
  if (currentPeriod === 'records') applyRecordsViewFilter(link.view || REC_DEFAULT_VIEW);
  else dcGoTab('records');
  if (!link.title) return;

  // Records may be building (1–2 s on a big library), so wait for the tables
  let tries = 0;
  const go = () => {
    const tb = _ntRecordsBuilt() ? _ntFindRecordTable(link) : null;
    if (!tb) { if (++tries < 40) setTimeout(go, 150); return; }
    const run = _ntPickSwitchesFor(tb);
    applyRecordsViewFilter(link.view);
    if (run) {
      // The Total / In a row switch keeps its state on the section; its own
      // click handler stores it and updates the sentence
      const sec = document.getElementById(link.view);
      const btn = sec && sec.querySelector('.rec-run-seg [data-rec-run="' + run + '"]');
      if (btn && sec.dataset.recRun !== run) btn.click();
    }
    // Scroll to the list (its title if that shows, else the list's box),
    // leaving room for the sticky bars, and flash it so the eye finds it
    requestAnimationFrame(() => {
      const box = tb.closest('.rec-section') || tb;
      const tEl = box.querySelector('.rec-section-title');
      const target = [tEl, box, tb].find(x => x && x.getClientRects().length);
      if (!target) return;
      const y = target.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      box.classList.remove('nt-rec-flash');
      void box.offsetWidth;   // restart the animation on a second tap
      box.classList.add('nt-rec-flash');
      setTimeout(() => box.classList.remove('nt-rec-flash'), 2200);
    });
  };
  setTimeout(go, 100);
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
