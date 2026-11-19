// ── Phone as a TV remote (TV-PLAN.md steps 6–8) ────────────────────────
// A device in TV mode (the TV) and any other device signed in to the same
// account (the phone) talk through one document in the account:
//
//   users/{uid}/data/tvRemote
//     tv:    { id, kind, at, on }   which device is the TV; at = heartbeat
//                                   (TV clock, ms), on = still in TV mode
//     now:   { title, artist, album, art, playing, pos, dur, at, media, vol }
//     queue: [{ title, artist, album }]   the TV's Up Next (first 30)
//     cmds:  { <id>: { op, arg, at } }   the phone's button presses
//
// No pairing code and no Firestore rules change: the existing rule lets an
// account read and write its own users/{uid}/data/* documents, and only the
// owner's devices can reach this one. The last device to open TV mode is the
// TV. The phone sees it by itself (a pill at the bottom of the screen) and
// opens a remote: song, progress, Previous / Play / Next, volume, Artwork /
// Video, and the TV's Up Next (play, move up / down, remove). Song menus get
// "Play on TV" and "Add to TV queue" while a TV is on.
//
// One scrobble (step 8): only the TV plays the music, so only the TV
// scrobbles and sends Live on Last.fm. The phone's own player is never
// started by the remote.
//
// Reads app.js globals (_yt*, openYtPlayer, t, esc, dcPlToast) and
// firebase.js globals (_currentUser, _ensureDb).
(function () {
  'use strict';

  const BEAT_MS = 30000;       // TV heartbeat while nothing changes
  const LIVE_MS = 100000;      // a TV silent for longer than this is gone
  const QUEUE_MAX = 30;

  // This device's id for the session (a reload is the same device)
  let me = '';
  try { me = sessionStorage.getItem('dc_tv_dev') || ''; } catch (e) {}
  if (!me) {
    me = Math.random().toString(36).slice(2, 10);
    try { sessionStorage.setItem('dc_tv_dev', me); } catch (e) {}
  }

  const S = {
    uid: null,        // signed-in account being listened to
    unsub: null,      // Firestore listener
    doc: null,        // last copy of the document
    isTv: false,      // this device is the TV
    sig: '',          // what the TV last published (to skip repeats)
    lastPub: 0,
    done: new Set(),  // commands this TV already ran
    open: false,      // the remote window is open on this device
    dismissed: '',    // TV id whose pill was closed with ×
    tick: null,       // remote progress-bar timer
  };

  const uid = () => (typeof _currentUser !== 'undefined' && _currentUser) ? _currentUser.uid : null;
  async function ref(u) {
    if (typeof _ensureDb !== 'function') return null;
    const db = await _ensureDb();
    return db.collection('users').doc(u || S.uid).collection('data').doc('tvRemote');
  }
  const T = (k, v) => (typeof window.t === 'function' ? window.t(k, v) : k);
  const E = s => (typeof esc === 'function' ? esc(s) : String(s == null ? '' : s));
  const toast = msg => { if (typeof dcPlToast === 'function') dcPlToast(msg); };
  const fmt = s => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const qKey = q => (q ? (q.artist || '') + '|||' + (q.title || '') : '');

  // ── Listening (both sides) ──────────────────────────────────────────────
  // Follows sign-in / sign-out: every few seconds check who is signed in
  function watchAuth() {
    const u = uid();
    if (u === S.uid) return;
    if (S.isTv) leaveTv();
    if (S.unsub) { try { S.unsub(); } catch (e) {} S.unsub = null; }
    S.uid = u; S.doc = null;
    render();
    tvNote();
    if (!u) return;
    ref(u).then(r => {
      if (!r || S.uid !== u) return;
      S.unsub = r.onSnapshot(snap => onDoc(snap.exists ? snap.data() : null), () => {});
      // Signed in while TV mode was already on: become the TV now
      if (typeof _ytInTv === 'function' && _ytInTv()) becomeTv();
    });
  }
  function onDoc(d) {
    S.doc = d;
    if (S.isTv) {
      // Another device opened TV mode later: it is the TV now
      if (d && d.tv && d.tv.id !== me) { S.isTv = false; tvNote(); return; }
      runCmds(d && d.cmds);
      return;
    }
    render();
  }

  // ── The TV side ─────────────────────────────────────────────────────────
  function nowState() {
    const tr = (typeof _ytCurrentTrack !== 'undefined' && _ytCurrentTrack) || null;
    const card = document.getElementById('ytMiniPlayer');
    let pos = 0, dur = 0;
    try { pos = _ytPlayer && _ytPlayer.getCurrentTime ? _ytPlayer.getCurrentTime() : 0; dur = _ytPlayer && _ytPlayer.getDuration ? _ytPlayer.getDuration() : 0; } catch (e) {}
    return {
      title: tr ? tr.title || '' : '', artist: tr ? tr.artist || '' : '', album: tr ? tr.album || '' : '',
      art: (typeof _ytArtUrl !== 'undefined' && _ytArtUrl) || '',
      playing: !!(card && card.classList.contains('yt-is-playing')),
      pos: Math.round(pos * 10) / 10, dur: Math.round(dur), at: Date.now(),
      media: typeof _ytMediaMode !== 'undefined' ? _ytMediaMode : 'art',
      vol: typeof _ytVolume !== 'undefined' ? _ytVolume : 100,
    };
  }
  const queueState = () => (typeof _ytQueue !== 'undefined' ? _ytQueue : []).slice(0, QUEUE_MAX)
    .map(q => ({ title: q.title || '', artist: q.artist || '', album: q.album || '' }));
  function kind() { return typeof _ytTvDeviceKind === 'function' ? _ytTvDeviceKind() : 'tv'; }

  async function becomeTv() {
    const u = uid();
    tvNote();
    if (!u) return;
    const r = await ref(u);
    if (!r) return;
    S.isTv = true; S.done.clear(); S.sig = '';
    // A fresh document: this device is the TV, no commands waiting
    try { await r.set({ tv: { id: me, kind: kind(), at: Date.now(), on: true }, now: nowState(), queue: queueState(), cmds: {} }); } catch (e) { S.isTv = false; }
    tvNote();
  }
  function leaveTv() {
    if (!S.isTv) return;
    S.isTv = false;
    ref().then(r => r && r.update({ 'tv.on': false, 'tv.at': Date.now() }).catch(() => {}));
    tvNote();
  }
  // Every second while TV mode is on: publish what changed, or a heartbeat
  function publish() {
    if (!S.isTv || !S.uid) return;
    const now = nowState(), queue = queueState();
    const sig = JSON.stringify([now.title, now.artist, now.art, now.playing, now.dur, now.media, now.vol, queue]);
    const seekJump = S.doc && S.doc.now && now.playing && Math.abs((S.doc.now.pos + (Date.now() - S.doc.now.at) / 1000) - now.pos) > 4;
    if (sig === S.sig && !seekJump && Date.now() - S.lastPub < BEAT_MS) return;
    S.sig = sig; S.lastPub = Date.now();
    ref().then(r => r && r.update({ now, queue, 'tv.at': Date.now(), 'tv.on': true }).catch(() => {}));
  }
  // Run the phone's button presses, oldest first, then clear them
  function runCmds(cmds) {
    if (!cmds) return;
    const list = Object.entries(cmds).filter(([id]) => !S.done.has(id)).sort((a, b) => (a[1].at || 0) - (b[1].at || 0));
    if (!list.length) return;
    const clear = {};
    list.forEach(([id, c]) => {
      S.done.add(id);
      clear['cmds.' + id] = firebase.firestore.FieldValue.delete();
      try { runCmd(c.op, c.arg); } catch (e) { console.warn('[dankcharts] TV remote command failed', c && c.op, e); }
    });
    ref().then(r => r && r.update(clear).catch(() => {}));
    S.sig = '';               // publish the result straight away
    setTimeout(publish, 400);
  }
  function findQ(arg) {
    // The phone names the song as well as the place, in case the list moved
    if (!arg || typeof _ytQueue === 'undefined') return -1;
    if (qKey(_ytQueue[arg.i]) === arg.key) return arg.i;
    return _ytQueue.findIndex(q => qKey(q) === arg.key);
  }
  function queueChanged() { _ytUpdateQueueDisplay(); if (typeof _ytSaveQueue === 'function') _ytSaveQueue(); }
  function runCmd(op, arg) {
    switch (op) {
      case 'toggle': _ytPauseToggle(); break;
      case 'next': _ytSkip(); break;
      case 'prev': _ytPrev(); break;
      case 'seek': if (_ytPlayer) _ytPlayer.seekTo(Math.max(0, +arg || 0), true); break;
      case 'vol': _ytSetVolume(Math.max(0, Math.min(100, +arg || 0))); break;
      case 'media': _ytSetMediaMode(arg === 'video' ? 'video' : 'art', true); break;
      case 'play': if (arg && arg.title) openYtPlayer(arg.title, arg.artist || '', arg.album || '', null); break;
      case 'addNext': if (arg && arg.title) { _ytQueue.unshift({ title: arg.title, artist: arg.artist || '', album: arg.album || '', btn: null }); queueChanged(); } break;
      case 'addQueue': if (arg && arg.title) { _ytQueue.push({ title: arg.title, artist: arg.artist || '', album: arg.album || '', btn: null }); queueChanged(); } break;
      case 'playAt': { const i = findQ(arg); if (i >= 0) { const q = _ytQueue.splice(i, 1)[0]; queueChanged(); openYtPlayer(q.title, q.artist, q.album || '', null); } break; }
      case 'remove': { const i = findQ(arg); if (i >= 0) { _ytQueue.splice(i, 1); queueChanged(); } break; }
      case 'move': {
        const i = findQ(arg), j = i + (arg.dir < 0 ? -1 : 1);
        if (i >= 0 && j >= 0 && j < _ytQueue.length) { const q = _ytQueue.splice(i, 1)[0]; _ytQueue.splice(j, 0, q); queueChanged(); }
        break;
      }
      case 'exit': if (typeof _ytToggleTv === 'function') _ytToggleTv(false); break;
    }
    if (typeof _ytTvPoke === 'function' && op !== 'exit') _ytTvPoke();   // show on the TV what just changed
  }
  // A line in TV mode saying how to use the phone (or to sign in first)
  function tvNote() {
    const el = document.getElementById('ytTvRemoteNote');
    if (!el) return;
    el.textContent = !uid() ? T('yt_np_tvr_note_signin') : (S.isTv ? T('yt_np_tvr_note') : '');
  }

  // ── The phone side ──────────────────────────────────────────────────────
  function tvLive() {
    const d = S.doc;
    if (!d || !d.tv || !d.tv.on || d.tv.id === me || S.isTv) return false;
    return Math.abs(Date.now() - (d.tv.at || 0)) < LIVE_MS;
  }
  async function send(op, arg) {
    if (!tvLive()) return false;
    const r = await ref();
    if (!r) return false;
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    try { await r.update({ ['cmds.' + id]: { op, arg: arg == null ? null : arg, at: Date.now() } }); return true; } catch (e) { return false; }
  }
  // Where the song is now: the TV's last position plus the time since
  function posNow(n) {
    if (!n) return 0;
    const p = n.playing ? n.pos + (Date.now() - (n.at || Date.now())) / 1000 : n.pos;
    return Math.max(0, Math.min(n.dur || p, p));
  }
  const ICON = {
    tv: 'M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 21h8M12 18v3',
    prev: 'M6 5h2.5v14H6zM20 5v14L9.5 12z', next: 'M15.5 5H18v14h-2.5zM4 5v14l10.5-7z',
    play: 'M7 4l13 8-13 8z', pause: 'M7 4h3v16H7zM14 4h3v16h-3z',
    up: 'M18 15l-6-6-6 6', down: 'M6 9l6 6 6-6', x: 'M18 6L6 18M6 6l12 12',
    volDown: 'M11 5L6 9H2v6h4l5 4zM16 12h6', volUp: 'M11 5L6 9H2v6h4l5 4zM16 12h6M19 9v6',
  };
  const svg = (d, fill) => `<svg viewBox="0 0 24 24" ${fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true"><path d="${d}"/></svg>`;

  function ensureEls() {
    if (document.getElementById('tvrPill')) return;
    const pill = document.createElement('div');
    pill.id = 'tvrPill'; pill.className = 'tvr-pill'; pill.style.display = 'none';
    pill.innerHTML =
      `<button type="button" class="tvr-pill-main" onclick="dcTvRemote.openRemote()">` +
        `<span class="tvr-pill-art">${svg(ICON.tv)}<img alt="" style="display:none"></span>` +
        `<span class="tvr-pill-txt"><small>${svg(ICON.tv)}<span class="tvr-pill-k"></span></small><b></b></span></button>` +
      `<button type="button" class="tvr-pill-btn tvr-pill-play" onclick="dcTvRemote.send('toggle')"></button>` +
      `<button type="button" class="tvr-pill-btn tvr-pill-x" onclick="dcTvRemote.dismiss()">${svg(ICON.x)}</button>`;
    document.body.appendChild(pill);
    const sheet = document.createElement('div');
    sheet.id = 'tvrSheet'; sheet.className = 'tvr-sheet'; sheet.style.display = 'none';
    sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true');
    sheet.addEventListener('click', e => { if (e.target === sheet) closeRemote(); });
    document.body.appendChild(sheet);
  }
  function render() {
    ensureEls();
    const pill = document.getElementById('tvrPill');
    const live = tvLive();
    const n = live && S.doc.now;
    // The pill: shown while a TV plays, unless closed with × for this TV session
    pill.style.display = live && !S.open && S.dismissed !== S.doc.tv.id ? '' : 'none';
    document.body.classList.toggle('tvr-pill-open', pill.style.display === '');
    if (live) {
      const img = pill.querySelector('img');
      if (n && n.art) { if (img.getAttribute('src') !== n.art) img.src = n.art; img.style.display = ''; } else { img.removeAttribute('src'); img.style.display = 'none'; }
      pill.querySelector('.tvr-pill-k').textContent = T('yt_np_tvr_pill');
      pill.querySelector('b').textContent = n && n.title ? n.title + ' · ' + n.artist : T('yt_np_tvr_nothing');
      const pb = pill.querySelector('.tvr-pill-play');
      pb.innerHTML = svg(n && n.playing ? ICON.pause : ICON.play, true);
      pb.title = T(n && n.playing ? 'yt_np_t_pause' : 'yt_np_t_play');
      pill.querySelector('.tvr-pill-x').title = T('yt_np_close');
    }
    if (S.open) renderRemote();
  }
  function renderRemote() {
    const sheet = document.getElementById('tvrSheet');
    if (!sheet) return;
    const live = tvLive();
    if (!live) {
      sheet.innerHTML = `<div class="tvr-box"><div class="tvr-head"><span class="tvr-head-ic">${svg(ICON.tv)}</span><b>${E(T('yt_np_tvr_title'))}</b>` +
        `<button type="button" class="tvr-icon-btn" onclick="dcTvRemote.closeRemote()" title="${E(T('yt_np_close'))}">${svg(ICON.down)}</button></div>` +
        `<p class="tvr-gone">${E(T('yt_np_tvr_gone'))}</p></div>`;
      return;
    }
    const n = S.doc.now || {}, q = S.doc.queue || [];
    const kindName = T('yt_np_tvr_dev_' + ((S.doc.tv && S.doc.tv.kind) || 'tv'));
    sheet.innerHTML =
      `<div class="tvr-box">` +
        `<div class="tvr-head"><span class="tvr-head-ic">${svg(ICON.tv)}</span>` +
          `<span class="tvr-head-txt"><b>${E(T('yt_np_tvr_title'))}</b><small>${E(T('yt_np_tvr_on', { name: kindName }))}</small></span>` +
          `<button type="button" class="tvr-icon-btn" onclick="dcTvRemote.closeRemote()" title="${E(T('yt_np_close'))}" aria-label="${E(T('yt_np_close'))}">${svg(ICON.down)}</button></div>` +
        `<div class="tvr-now">` +
          `<div class="tvr-art">${n.art ? `<img src="${E(n.art)}" alt="">` : svg(ICON.tv)}</div>` +
          `<div class="tvr-song"><b>${E(n.title || T('yt_np_tvr_nothing'))}</b><span>${E(n.artist || '')}</span></div>` +
        `</div>` +
        `<div class="tvr-seek"><input type="range" id="tvrSeek" min="0" max="${Math.max(1, n.dur || 1)}" step="1" value="${Math.round(posNow(n))}" aria-label="${E(T('yt_np_seek'))}" onchange="dcTvRemote.send('seek', +this.value)">` +
          `<div class="tvr-times"><span id="tvrCur">${fmt(posNow(n))}</span><span>${fmt(n.dur)}</span></div></div>` +
        `<div class="tvr-ctrls">` +
          `<button type="button" class="tvr-ctrl" onclick="dcTvRemote.send('prev')" title="${E(T('yt_np_t_prev'))}" aria-label="${E(T('yt_np_t_prev'))}">${svg(ICON.prev, true)}</button>` +
          `<button type="button" class="tvr-ctrl tvr-play" onclick="dcTvRemote.send('toggle')" title="${E(T(n.playing ? 'yt_np_t_pause' : 'yt_np_t_play'))}" aria-label="${E(T(n.playing ? 'yt_np_t_pause' : 'yt_np_t_play'))}">${svg(n.playing ? ICON.pause : ICON.play, true)}</button>` +
          `<button type="button" class="tvr-ctrl" onclick="dcTvRemote.send('next')" title="${E(T('yt_np_t_next'))}" aria-label="${E(T('yt_np_t_next'))}">${svg(ICON.next, true)}</button>` +
        `</div>` +
        `<div class="tvr-row">` +
          `<div class="tvr-vol" role="group" aria-label="${E(T('yt_np_tvr_vol'))}">` +
            `<button type="button" class="tvr-icon-btn" onclick="dcTvRemote.vol(-10)" title="${E(T('yt_np_tvr_vol'))} −" aria-label="${E(T('yt_np_tvr_vol'))} −">${svg(ICON.volDown)}</button>` +
            `<span>${Math.round(n.vol == null ? 100 : n.vol)}</span>` +
            `<button type="button" class="tvr-icon-btn" onclick="dcTvRemote.vol(10)" title="${E(T('yt_np_tvr_vol'))} +" aria-label="${E(T('yt_np_tvr_vol'))} +">${svg(ICON.volUp)}</button></div>` +
          `<div class="ytp-seg tvr-seg" role="group">` +
            `<button type="button" aria-pressed="${n.media !== 'video'}" onclick="dcTvRemote.send('media','art')">${E(T('yt_np_art'))}</button>` +
            `<button type="button" aria-pressed="${n.media === 'video'}" onclick="dcTvRemote.send('media','video')">${E(T('yt_np_video'))}</button></div>` +
        `</div>` +
        `<div class="tvr-qh">${E(T('yt_np_tvr_upnext'))}<span>${q.length || ''}</span></div>` +
        (q.length ? `<ol class="tvr-q">` + q.map((s, i) => {
          const a = `{i:${i},key:${E(JSON.stringify(qKey(s)))}}`;
          return `<li><button type="button" class="tvr-q-main" onclick="dcTvRemote.send('playAt',${a})" title="${E(T('yt_np_t_play'))}"><b>${E(s.title)}</b><small>${E(s.artist)}</small></button>` +
            `<button type="button" class="tvr-icon-btn" onclick="dcTvRemote.send('move',Object.assign(${a},{dir:-1}))" ${i === 0 ? 'disabled' : ''} title="${E(T('yt_np_tvr_up'))}" aria-label="${E(T('yt_np_tvr_up'))}">${svg(ICON.up)}</button>` +
            `<button type="button" class="tvr-icon-btn" onclick="dcTvRemote.send('move',Object.assign(${a},{dir:1}))" ${i === q.length - 1 ? 'disabled' : ''} title="${E(T('yt_np_tvr_down'))}" aria-label="${E(T('yt_np_tvr_down'))}">${svg(ICON.down)}</button>` +
            `<button type="button" class="tvr-icon-btn" onclick="dcTvRemote.send('remove',${a})" title="${E(T('yt_np_tvr_remove'))}" aria-label="${E(T('yt_np_tvr_remove'))}">${svg(ICON.x)}</button></li>`;
        }).join('') + `</ol>` : `<p class="tvr-empty">${E(T('yt_np_tvr_empty'))}</p>`) +
        `<button type="button" class="tvr-exit" onclick="dcTvRemote.send('exit')">${E(T('yt_np_tvr_exit'))}</button>` +
      `</div>`;
  }
  // The progress bar moves on its own between updates (not while dragged)
  function tickRemote() {
    if (!S.open || !tvLive()) return;
    const n = S.doc.now, seek = document.getElementById('tvrSeek'), cur = document.getElementById('tvrCur');
    if (!n || !seek) return;
    if (document.activeElement !== seek) seek.value = Math.round(posNow(n));
    if (cur) cur.textContent = fmt(document.activeElement === seek ? +seek.value : posNow(n));
  }
  function openRemote() {
    ensureEls();
    S.open = true;
    const sheet = document.getElementById('tvrSheet');
    sheet.style.display = '';
    document.body.classList.add('tvr-open');
    render();
    clearInterval(S.tick); S.tick = setInterval(tickRemote, 500);
  }
  function closeRemote() {
    S.open = false;
    const sheet = document.getElementById('tvrSheet');
    if (sheet) sheet.style.display = 'none';
    document.body.classList.remove('tvr-open');
    clearInterval(S.tick); S.tick = null;
    render();
  }
  function dismiss() { if (S.doc && S.doc.tv) S.dismissed = S.doc.tv.id; render(); }
  function vol(d) {
    const n = S.doc && S.doc.now;
    send('vol', Math.max(0, Math.min(100, Math.round((n && n.vol != null ? n.vol : 100) + d))));
  }
  // From a song's ⋮ menu: play it on the TV, or add it to the TV's Up Next
  async function sendSong(op, tr) {
    if (!tr || !tr.title) return;
    const ok = await send(op, { title: tr.title, artist: tr.artist || '', album: tr.album || '' });
    toast(T(ok ? (op === 'play' ? 'yt_np_tvr_sent' : 'yt_np_tvr_queued') : 'yt_np_tvr_gone'));
  }
  document.addEventListener('keydown', e => { if (S.open && e.key === 'Escape') { e.stopPropagation(); closeRemote(); } }, true);

  // ── Wiring ──────────────────────────────────────────────────────────────
  function init() {
    // TV mode on / off (app.js) makes this device the TV / lets go
    const on = window._ytToggleTv;
    if (typeof on === 'function') window._ytToggleTv = function () { const r = on.apply(this, arguments); if (_ytInTv() && !S.isTv) becomeTv(); return r; };
    const off = window._ytTvTeardown;
    if (typeof off === 'function') window._ytTvTeardown = function () { const r = off.apply(this, arguments); leaveTv(); return r; };
    window.addEventListener('pagehide', leaveTv);
    setInterval(watchAuth, 3000);
    setInterval(publish, 1000);
    setInterval(() => { if (!S.isTv) render(); }, 15000);   // a TV that went quiet disappears
    watchAuth();
  }
  window.dcTvRemote = { send, openRemote, closeRemote, dismiss, vol, sendSong, live: tvLive, isTv: () => S.isTv };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
