/* ─── CHART REPLAY: ▶ Animate Chart (phase 7 step 11) ──────────────────────────
   Replays how the chart on screen came to be. It starts on the previous
   period's chart and walks through the play records one at a time: each step
   either drops one of the previous period's plays or adds one of this
   period's, in the order they happened, until it lands on the chart on
   screen. Play counts, ranks, movement arrows and the #1–#3 tints all change
   as it goes, and a row glides past the row it overtakes.

   The same in all six layouts (Table, Card grid, Compact, Mosaic, Filmstrip,
   Stack): while it runs, the chart is swapped for a stage that draws the
   entries in the shape of the layout that is on, and swapped back when the
   replay closes. On Daily, Weekly and Monthly, the periods with a previous
   chart to start from.

   Controls: play / pause, a speed (½× to 20×), one play back or forward, one
   day back or forward (an hour on Daily), a slider over every play, a strip
   of the days to click, and the keyboard. Nothing moves until the covers of
   every entry that will show have loaded (or 8 seconds have passed), so rows
   never slide around as empty squares.

   Replaced the Table-only runSlideWindowAnim (2026-10-22): it moved rows
   before their covers had loaded, its counts jumped in big frames, and the
   other five layouts had no animation at all.

   The renderers call crpRegister() with both periods' plays; the ▶ Animate
   Chart button calls crpOpen(); "Animate charts on load" (chartAnimEnabled)
   opens it by itself once the chart scrolls into view, and closes it again
   when it reaches the end unless the replay was touched. */

const CRP_SPEEDS = [0.5, 1, 2, 5, 20];
const CRP_SPEED_KEY = 'dc_crp_speed';
let _crpSpeed = (() => {
  try { const v = parseFloat(localStorage.getItem(CRP_SPEED_KEY)); return CRP_SPEEDS.includes(v) ? v : 1; }
  catch (e) { return 1; }
})();
const _crpData = { songs: null, artists: null, albums: null };   // what each chart can replay
const _crpPlayers = {};   // type → the open replay
const _crpObs = {};       // type → the "animate on load" observer
const _crpReduceMq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
const _crpNoMotion = () => !!(_crpReduceMq && _crpReduceMq.matches);

// The part of a chart section the replay takes over
function _crpBody(type) { return document.querySelector('#' + type + 'Section .section-body'); }

/* Called by renderSongs / renderArtists / renderAlbums after drawing the chart.
   finalKeys are the chart's entries in order, so the replay ends exactly on it. */
function crpRegister(type, prevPlays, currPlays, ms, finalKeys) {
  crpClose(type);
  if (_crpObs[type]) { _crpObs[type].disconnect(); delete _crpObs[type]; }
  const ok = !!(prevPlays && prevPlays.length && currPlays && currPlays.length && finalKeys && finalKeys.length &&
    ['day', 'week', 'month'].includes(currentPeriod));
  _crpData[type] = ok ? { prev: prevPlays, curr: currPlays, ms: ms || null, finalKeys, size: chartSize, period: currentPeriod } : null;
  const btn = document.getElementById(type + 'ReplayBtn');
  if (btn) {
    btn.disabled = !ok;
    btn.title = ok ? t('crp_btn_title') : t('crp_no_prev');
  }
  if (!ok || !chartAnimEnabled) return;
  const body = _crpBody(type);
  if (!body) return;
  const obs = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) return;
    obs.disconnect();
    delete _crpObs[type];
    crpOpen(type, true);
  }, { threshold: 0.2 });
  _crpObs[type] = obs;
  obs.observe(body);
}

function crpCloseAll() {
  ['songs', 'artists', 'albums'].forEach(tp => {
    crpClose(tp);
    if (_crpObs[tp]) { _crpObs[tp].disconnect(); delete _crpObs[tp]; }
  });
}

// Puts the chart back. `refocus` returns focus to the ▶ Animate Chart button.
function crpClose(type, refocus) {
  const pl = _crpPlayers[type];
  if (!pl) return;
  delete _crpPlayers[type];
  pl.closed = true;
  pl.playing = false;
  cancelAnimationFrame(pl.raf);
  clearTimeout(pl.endTimer);
  if (pl.io) pl.io.disconnect();
  if (pl.mini) pl.mini.remove();
  pl.root.remove();
  pl.hidden.forEach(([el, disp]) => { el.style.display = disp; });
  if (refocus) document.getElementById(type + 'ReplayBtn')?.focus({ preventScroll: true });
}

// ── The model: every play in or out, in order ──────────────────────────────────

// Which chart entries one play counts toward, exactly as the chart counts it
function _crpCredits(type, p, roll, want) {
  if (type === 'songs') return [songKey(p)];
  if (type === 'artists') return p.artists || [];
  if (!p.album || p.album === '—') return [];
  const ak = albumKeyOf(p), out = [ak];
  const par = roll ? rollupParentOf(p) : null;
  if (par && par !== ak) out.push(par);
  return want ? out.filter(k => albumBucketOfKey(k) === want) : out;
}

// Names and the artwork lookup for one entry
function _crpMeta(type, k, p) {
  if (type === 'songs') return { ttl: p.title, sub: p.artist, kind: 'song', name: p.title, artist: p.artist, album: p.album || '' };
  if (type === 'artists') return { ttl: k, sub: '', kind: 'artist', name: k, artist: k, album: '' };
  const i = k.lastIndexOf('|||');
  const album = k.slice(0, i), artist = k.slice(i + 3);
  return { ttl: album, sub: artist, kind: 'album', name: album, artist, album };
}

/* The period a set of plays belongs to, in the same shifted-timezone time as
   tzMsOf(). The period still running is replayed up to now, so its plays
   spread over the time that has actually passed and the slide ends on the
   last one. `units` are the cells of the day strip: 3-hour blocks on Daily,
   days otherwise. */
function _crpRange(plays, period, running) {
  let lo = Infinity, hi = -Infinity;
  for (const p of plays) { const m = tzMsOf(p); if (m < lo) lo = m; if (m > hi) hi = m; }
  const d = new Date(lo);
  let s, e;
  if (period === 'day') {
    s = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    e = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  } else if (period === 'week') {
    const off = (d.getDay() - weekStartDay + 7) % 7;
    s = new Date(d.getFullYear(), d.getMonth(), d.getDate() - off);
    e = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 7);
  } else {
    s = new Date(d.getFullYear(), d.getMonth(), 1);
    e = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  }
  let end = +e;
  if (running) end = Math.max(Math.min(end, +tzNow()), hi + 1);
  const unitMs = period === 'day' ? 3 * 3600000 : 86400000;
  // Days are counted on the calendar (a DST change makes one 23 or 25 hours)
  const units = [];
  for (let u = new Date(s); +u < end; ) {
    units.push(+u);
    u = period === 'day' ? new Date(+u + unitMs) : new Date(u.getFullYear(), u.getMonth(), u.getDate() + 1);
  }
  return { s: +s, e: end, full: +e, units };
}

function _crpModel(type, d) {
  const roll = type === 'albums' && rollupAffectsCharts();
  const want = type === 'albums' ? albumsFilterBucket() : null;
  const pr = _crpRange(d.prev, d.period, false);
  const cr = _crpRange(d.curr, d.period, true);
  const meta = new Map(), init = new Map(), seen = new Map();
  const ev = [];
  const add = (plays, rng, dir) => {
    for (const p of plays) {
      const ks = _crpCredits(type, p, roll, want);
      if (!ks.length) continue;
      const ms = tzMsOf(p);
      for (const k of ks) {
        if (!meta.has(k)) { meta.set(k, _crpMeta(type, k, p)); seen.set(k, seen.size); init.set(k, 0); }
        if (dir < 0) init.set(k, init.get(k) + 1);
      }
      // f: how far into its own period the play happened (0–1). The window
      // reaches a previous play and the same moment of this period together.
      ev.push({ f: Math.min(1, Math.max(0, (ms - rng.s) / (rng.e - rng.s))), dir, p, ks, ms });
    }
  };
  add(d.prev, pr, -1);
  add(d.curr, cr, 1);
  // Same moment: the old play leaves before the new one arrives
  ev.sort((a, b) => a.f - b.f || a.dir - b.dir || a.ms - b.ms);

  // Last period's chart, from the period stats when there are any (their
  // arrows are the ones the chart itself shows), else from the start state
  const ms = d.ms;
  const prevChart = ms && ms.prevChart ? ms.prevChart[type] : null;
  const prevRankOf = k => (prevChart && prevChart[k] ? prevChart[k].rank : null);
  const initOrder = [...meta.keys()].sort((a, b) =>
    init.get(b) - init.get(a) || (prevRankOf(a) ?? 1e9) - (prevRankOf(b) ?? 1e9) || seen.get(a) - seen.get(b));
  const startRank = new Map(initOrder.map((k, i) => [k, i + 1]));
  const model = {
    type, ev, meta, init, initOrder, pr, cr, period: d.period, size: d.size,
    finalKeys: d.finalKeys.filter(k => meta.has(k)),
    lastRank: k => prevChart ? prevRankOf(k) : (init.get(k) > 0 && startRank.get(k) <= d.size ? startRank.get(k) : null),
    everBefore: k => !!(ms && ms.everChartedBefore && ms.everChartedBefore[type] && ms.everChartedBefore[type].has(k)),
  };

  // Every entry that is ever on the chart during the replay: their covers
  // load before anything moves. A key only enters the top by gaining a play,
  // or by moving up into the last place when the entry there loses one.
  const st = _crpState(model);
  const ever = new Set(_crpTopOf(st, model));
  for (let i = 0; i < ev.length; i++) {
    _crpGo(st, model, i + 1);
    for (const k of ev[i].ks) if (st.pos.get(k) < model.size && st.cnt.get(k) > 0) ever.add(k);
    const edge = st.ord[model.size - 1];
    if (edge && st.cnt.get(edge) > 0) ever.add(edge);
  }
  model.finalKeys.forEach(k => ever.add(k));
  model.ever = ever;
  return model;
}

/* The live chart: counts, and every key in rank order. A play moves one key
   (two for a rolled-up album, one per credited artist) by one, so the order
   is kept by sliding that key past its neighbours rather than sorting. A key
   only passes keys it now has strictly more (or fewer) plays than, so ties
   keep the order they had. */
function _crpState(model) {
  const ord = model.initOrder.slice();
  return { cnt: new Map(model.init), ord, pos: new Map(ord.map((k, i) => [k, i])), step: 0 };
}
function _crpBump(st, k, dlt) {
  const c = st.cnt.get(k) + dlt;
  st.cnt.set(k, c);
  const o = st.ord;
  let i = st.pos.get(k);
  if (dlt > 0) while (i > 0 && st.cnt.get(o[i - 1]) < c) { o[i] = o[i - 1]; st.pos.set(o[i], i); i--; }
  else while (i < o.length - 1 && st.cnt.get(o[i + 1]) > c) { o[i] = o[i + 1]; st.pos.set(o[i], i); i++; }
  o[i] = k;
  st.pos.set(k, i);
}
// Walk forward or back to step s (s plays applied)
function _crpGo(st, model, s) {
  s = Math.max(0, Math.min(model.ev.length, s));
  while (st.step < s) { const e = model.ev[st.step++]; for (const k of e.ks) _crpBump(st, k, e.dir); }
  while (st.step > s) { const e = model.ev[--st.step]; for (const k of e.ks) _crpBump(st, k, -e.dir); }
}
// The chart at the current step. At the end it is the real chart, whose
// tie-breaks (status, last rank) the replay doesn't reproduce.
function _crpTopOf(st, model) {
  if (st.step >= model.ev.length && model.finalKeys.length) return model.finalKeys;
  const out = [];
  for (const k of st.ord) {
    if (out.length >= model.size || !(st.cnt.get(k) > 0)) break;
    out.push(k);
  }
  return out;
}
// The first step at or past window position f (0–1)
function _crpStepAt(model, f) {
  let lo = 0, hi = model.ev.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (model.ev[mid].f <= f) lo = mid + 1; else hi = mid; }
  return lo;
}
function _crpPos(pl) {
  const st = pl.st, ev = pl.model.ev;
  return st.step === 0 ? 0 : st.step >= ev.length ? 1 : ev[st.step - 1].f;
}

// ── Opening ─────────────────────────────────────────────────────────────────

async function crpOpen(type, auto) {
  const d = _crpData[type];
  if (!d) return;
  if (_crpPlayers[type]) { if (!auto) _crpPlayers[type].root.querySelector('.crp-play')?.focus(); return; }
  const body = _crpBody(type);
  if (!body) return;
  const model = _crpModel(type, d);
  if (!model.ev.length) return;
  const pl = {
    type, model, auto, interacted: false, ready: false, playing: false, closed: false,
    raf: 0, acc: 0, tPrev: 0, endTimer: 0, lastShuffle: 0,
    st: _crpState(model), shown: [], nodes: new Map(), art: new Map(),
    layout: weeklyChartViewMode[type] || 'table',
  };
  _crpPlayers[type] = pl;
  // The chart, its layouts and page bar step aside while the replay runs
  pl.hidden = [...body.children].filter(el => getComputedStyle(el).display !== 'none').map(el => [el, el.style.display]);
  pl.hidden.forEach(([el]) => { el.style.display = 'none'; });
  pl.root = _crpBuildDom(pl);
  body.prepend(pl.root);
  _crpDrawPlayer(pl);
  // Keys work from the start: the replay holds focus while Play is still
  // disabled (covers loading), then Play takes it
  if (!auto) pl.root.focus({ preventScroll: true });

  await _crpLoadCovers(pl);
  if (pl.closed) return;
  pl.ready = true;
  pl.root.classList.remove('crp-is-loading');
  _crpPlace(pl, _crpTopOf(pl.st, model));
  _crpDrawPlayer(pl);
  if (!auto && pl.root.contains(document.activeElement)) pl.root.querySelector('.crp-play').focus({ preventScroll: true });
  // A moment on last period's chart before it starts sliding
  setTimeout(() => { if (!pl.closed && !pl.interacted) _crpPlay(pl); }, 700);
}

// Every cover the replay will show, loaded and decoded before anything moves
async function _crpLoadCovers(pl) {
  const keys = [...pl.model.ever];
  const msg = pl.root.querySelector('.crp-loading');
  const px = pl.layout === 'mosaic' ? 400 : (pl.layout === 'grid' || pl.layout === 'filmstrip') ? 300 : 160;
  let done = 0;
  const paint = () => { msg.textContent = t('crp_loading', { n: done.toLocaleString(), total: keys.length.toLocaleString() }); };
  paint();
  const one = async k => {
    const m = pl.model.meta.get(k);
    let url = null;
    try { url = await queueImg(() => getArtAuto(m.kind, m.name, m.artist, m.album)); } catch (e) {}
    if (url && !pl.closed) {
      const src = sizedArtUrl(url, px);
      const ok = await new Promise(res => {
        const im = new Image();
        im.onload = () => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(() => res(true));
        im.onerror = () => res(false);
        im.src = src;
      });
      if (ok) pl.art.set(k, src);
    }
    done++;
    paint();
  };
  await Promise.race([Promise.all(keys.map(one)), new Promise(r => setTimeout(r, 8000))]);
}

function _crpLocale() { return currentLang === 'en' ? 'en-US' : currentLang; }

// "Oct 5 – 11" / "Tue, Oct 13" / "September 2026": a period's name for the strip ends
function _crpRangeLabel(rng, period) {
  const loc = _crpLocale();
  const a = new Date(rng.s), b = new Date(Math.min(rng.e, rng.full) - 1);
  if (period === 'day') return a.toLocaleDateString(loc, { weekday: 'short', month: 'short', day: 'numeric' });
  if (period === 'month') return a.toLocaleDateString(loc, { month: 'long', year: 'numeric' });
  const sameMonth = a.getMonth() === b.getMonth();
  return a.toLocaleDateString(loc, { month: 'short', day: 'numeric' }) + ' – ' +
    (sameMonth ? b.toLocaleDateString(loc, { day: 'numeric' }) : b.toLocaleDateString(loc, { month: 'short', day: 'numeric' }));
}
function _crpWhen(ms, period) {
  const o = period === 'day' ? { hour: 'numeric', minute: '2-digit' }
    : { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
  return new Date(ms).toLocaleString(_crpLocale(), o);
}

function _crpBuildDom(pl) {
  const m = pl.model, day = m.period === 'day';
  const root = document.createElement('div');
  root.className = 'crp crp-is-loading';
  root.tabIndex = -1;
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', t('crp_region'));
  const loc = _crpLocale();
  // The strip: the previous period's units, then this one's (up to now)
  const cell = (ms, half, i) => {
    const lbl = day ? new Date(ms).toLocaleTimeString(loc, { hour: 'numeric' })
      : m.period === 'week' ? `${new Date(ms).toLocaleDateString(loc, { weekday: 'short' })}<b>${new Date(ms).getDate()}</b>` : '';
    return `<button type="button" class="crp-cell" data-half="${half}" data-i="${i}" title="${esc(t('crp_jump'))}">${lbl}</button>`;
  };
  const unit = day ? t('crp_unit_h') : t('crp_unit_d');
  const btn = (cls, lbl, txt) => `<button type="button" class="crp-tb ${cls}" title="${esc(lbl)}" aria-label="${esc(lbl)}">${txt}</button>`;
  root.innerHTML =
    `<div class="crp-bar">` +
      `<div class="crp-top"><div class="crp-when" aria-live="off"></div><div class="crp-count"></div>` +
        `<button type="button" class="crp-close" title="${esc(t('crp_close'))}" aria-label="${esc(t('crp_close'))}">✕</button></div>` +
      `<div class="crp-days crp-days-${m.period}">` +
        `<div class="crp-half">${m.pr.units.map((u, i) => cell(u, 0, i)).join('')}</div>` +
        `<div class="crp-half">${m.cr.units.map((u, i) => cell(u, 1, i)).join('')}</div>` +
        `<div class="crp-win" aria-hidden="true"></div>` +
      `</div>` +
      `<div class="crp-ends"><span>${esc(t('crp_prev_chart'))} · ${esc(_crpRangeLabel(m.pr, m.period))}</span><span>${esc(t('crp_this_chart'))} · ${esc(_crpRangeLabel(m.cr, m.period))}</span></div>` +
      `<input type="range" class="crp-scrub" min="0" max="${m.ev.length}" value="0" aria-label="${esc(t('crp_scrub'))}">` +
      `<div class="crp-ctrls">` +
        `<div class="crp-transport">` +
          btn('crp-start', t('crp_start'), '⏮') +
          btn('crp-uback', day ? t('crp_hour_back') : t('crp_day_back'), `−1<small>${esc(unit)}</small>`) +
          btn('crp-back', t('crp_back'), '◀') +
          `<button type="button" class="crp-tb crp-play"></button>` +
          btn('crp-fwd', t('crp_fwd'), '▶') +
          btn('crp-ufwd', day ? t('crp_hour_fwd') : t('crp_day_fwd'), `+1<small>${esc(unit)}</small>`) +
          btn('crp-end', t('crp_end'), '⏭') +
        `</div>` +
        `<div class="crp-speeds" role="group" aria-label="${esc(t('crp_speed'))}"><span class="crp-lbl">${esc(t('crp_speed'))}</span>` +
          CRP_SPEEDS.map(v => `<button type="button" class="crp-sp" data-v="${v}" aria-pressed="${v === _crpSpeed}">${v === 0.5 ? '½' : v}×</button>`).join('') +
        `</div>` +
      `</div>` +
      `<ul class="crp-log"></ul>` +
      `<div class="crp-keys">${esc(day ? t('crp_keys_day') : t('crp_keys'))}</div>` +
    `</div>` +
    `<div class="crp-stage crp-lay-${pl.layout}"><div class="crp-loading"></div></div>`;

  // The floating control for when the bar has scrolled away (see .crp-mini)
  const mini = document.createElement('div');
  mini.className = 'crp-mini';
  mini.hidden = true;
  mini.setAttribute('role', 'group');
  mini.setAttribute('aria-label', t('crp_region'));
  mini.innerHTML = `<span class="crp-count"></span>` + btn('crp-back', t('crp_back'), '◀') +
    `<button type="button" class="crp-tb crp-play"></button>` + btn('crp-fwd', t('crp_fwd'), '▶');
  document.body.appendChild(mini);
  pl.mini = mini;

  const act = fn => e => { e.preventDefault(); if (!pl.ready) return; pl.interacted = true; clearTimeout(pl.endTimer); fn(e); };
  const q = s => root.querySelector(s);
  const both = (s, fn) => { root.querySelector(s).onclick = fn; mini.querySelector(s).onclick = fn; };
  q('.crp-close').onclick = () => crpClose(pl.type, true);
  both('.crp-play', act(() => (pl.playing ? _crpPause(pl) : _crpPlay(pl))));
  q('.crp-start').onclick = act(() => _crpManual(pl, 0, 300));
  q('.crp-end').onclick = act(() => _crpManual(pl, m.ev.length, 300));
  both('.crp-back', act(() => _crpManual(pl, pl.st.step - 1, 220)));
  both('.crp-fwd', act(() => _crpManual(pl, pl.st.step + 1, 220)));
  mini.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); crpClose(pl.type, true); } });
  q('.crp-uback').onclick = act(() => _crpUnit(pl, -1));
  q('.crp-ufwd').onclick = act(() => _crpUnit(pl, 1));
  q('.crp-scrub').oninput = act(e => _crpManual(pl, +e.target.value, 160));
  root.querySelectorAll('.crp-cell').forEach(c => {
    c.onclick = act(() => {
      // A previous-period cell: the window starts there. This period's: the window ends after it.
      const half = +c.dataset.half, i = +c.dataset.i;
      const f = half === 0 ? i / m.pr.units.length : (i + 1) / m.cr.units.length;
      _crpPause(pl);
      _crpGo(pl.st, m, _crpStepAt(m, Math.min(1, f)));
      _crpRender(pl, 300, true);
    });
  });
  root.querySelectorAll('.crp-sp').forEach(b => {
    b.onclick = () => {
      _crpSpeed = +b.dataset.v;
      try { localStorage.setItem(CRP_SPEED_KEY, String(_crpSpeed)); } catch (e) {}
      root.querySelectorAll('.crp-sp').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    };
  });
  root.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); crpClose(pl.type, true); return; }
    if (!pl.ready || e.altKey || e.ctrlKey || e.metaKey) return;
    const onBtn = e.target.closest && e.target.closest('button');
    const k = e.key;
    let done = true;
    if (k === ' ' && !onBtn) q('.crp-play').click();
    else if (k === 'ArrowRight' && e.target !== q('.crp-scrub')) (e.shiftKey ? q('.crp-ufwd') : q('.crp-fwd')).click();
    else if (k === 'ArrowLeft' && e.target !== q('.crp-scrub')) (e.shiftKey ? q('.crp-uback') : q('.crp-back')).click();
    else if (k === 'Home') q('.crp-start').click();
    else if (k === 'End') q('.crp-end').click();
    else done = false;
    if (done) e.preventDefault();
  });

  // Show the floating control while the bar is out of view (under the top
  // bars counts as out) and some of the chart is still on screen
  const seen = { bar: true, stage: false };
  const bar = q('.crp-bar'), stage = q('.crp-stage');
  pl.io = new IntersectionObserver(ens => {
    for (const en of ens) seen[en.target === bar ? 'bar' : 'stage'] = en.isIntersecting;
    mini.hidden = seen.bar || !seen.stage;
  }, { rootMargin: '-120px 0px 0px 0px' });
  pl.io.observe(bar);
  pl.io.observe(stage);
  return root;
}

// ── Playing ─────────────────────────────────────────────────────────────────

// Plays per second at 1×: a whole replay takes about 40 seconds, but never
// crawls (a quiet week) or blurs (a busy month)
function _crpRate(pl) { return Math.min(400, Math.max(6, pl.model.ev.length / 40)); }
function _crpDur() { return Math.round(Math.max(140, Math.min(420, 420 / Math.sqrt(_crpSpeed)))); }

function _crpPlay(pl) {
  if (pl.playing || !pl.ready || pl.closed) return;
  const N = pl.model.ev.length;
  let delay = 0;
  if (pl.st.step >= N) {   // Replay: back to the start, a beat, then go
    _crpGo(pl.st, pl.model, 0);
    _crpRender(pl, 0, true);
    delay = 500;
  }
  pl.playing = true;
  _crpDrawPlayer(pl);
  pl.acc = 0;
  pl.tPrev = performance.now() + delay;
  const frame = now => {
    if (!pl.playing || pl.closed) return;
    if (now > pl.tPrev) {
      pl.acc += (now - pl.tPrev) / 1000 * _crpRate(pl) * _crpSpeed;
      pl.tPrev = now;
    }
    const n = Math.floor(pl.acc);
    if (n > 0) {
      pl.acc -= n;
      _crpGo(pl.st, pl.model, pl.st.step + n);
      _crpRender(pl, _crpDur(), pl.st.step >= N);
    }
    if (pl.st.step >= N) { _crpPause(pl); _crpEnded(pl); return; }
    pl.raf = requestAnimationFrame(frame);
  };
  pl.raf = requestAnimationFrame(frame);
}

function _crpPause(pl) {
  pl.playing = false;
  cancelAnimationFrame(pl.raf);
  _crpDrawPlayer(pl);
}

// Opened by "Animate charts on load" and left alone: hand the chart back
function _crpEnded(pl) {
  if (!pl.auto || pl.interacted) return;
  pl.endTimer = setTimeout(() => {
    if (pl.closed || pl.interacted) return;
    pl.root.classList.add('crp-out');
    setTimeout(() => crpClose(pl.type), _crpNoMotion() ? 0 : 260);
  }, 1800);
}

function _crpManual(pl, s, dur) {
  _crpPause(pl);
  _crpGo(pl.st, pl.model, s);
  _crpRender(pl, dur, true);
}

// One day (one hour on Daily) back or forward, landing on a whole unit
function _crpUnit(pl, dir) {
  const m = pl.model;
  const n = m.period === 'day' ? 24 : m.pr.units.length;
  const at = _crpPos(pl) * n;
  const target = dir < 0 ? Math.max(0, Math.ceil(at - 1e-9) - 1) : Math.min(n, Math.floor(at + 1e-9) + 1);
  _crpPause(pl);
  // Back: stop before the first play of that unit. Forward: after its last.
  const f = target / n;
  _crpGo(pl.st, m, dir < 0 ? _crpStepAt(m, f - 1e-12) : _crpStepAt(m, f));
  _crpRender(pl, 300, true);
}

// Bring the stage and the bar in line with the current step
function _crpRender(pl, dur, force) {
  const top = _crpTopOf(pl.st, pl.model);
  const same = top.length === pl.shown.length && top.every((k, i) => k === pl.shown[i]);
  const now = performance.now();
  if (!same && (force || now - pl.lastShuffle > Math.max(80, 300 / _crpSpeed))) {
    _crpReorder(pl, top, dur);
    pl.lastShuffle = now;
  } else {
    pl.shown.forEach((k, i) => _crpFill(pl, k, i + 1));
  }
  _crpDrawPlayer(pl);
}

// ── The bar ─────────────────────────────────────────────────────────────────

function _crpDrawPlayer(pl) {
  const r = pl.root, m = pl.model, st = pl.st, N = m.ev.length;
  const f = _crpPos(pl);
  const win = r.querySelector('.crp-win');
  win.style.left = (f * 50) + '%';
  const when = r.querySelector('.crp-when');
  if (st.step === 0) when.textContent = `${t('crp_prev_chart')} · ${_crpRangeLabel(m.pr, m.period)}`;
  else if (st.step >= N) when.textContent = `${t('crp_this_chart')} · ${_crpRangeLabel(m.cr, m.period)}`;
  else when.textContent = `${_crpWhen(m.pr.s + f * (m.pr.e - m.pr.s), m.period)} → ${_crpWhen(m.cr.s + f * (m.cr.e - m.cr.s), m.period)}`;
  r.querySelector('.crp-scrub').value = st.step;
  const lbl = pl.playing ? t('crp_pause') : st.step >= N ? t('crp_replay') : t('crp_play');
  // The bar and the floating control show the same state
  [r, pl.mini].forEach(box => {
    if (!box) return;
    box.querySelector('.crp-count').textContent = t('crp_count', { n: st.step.toLocaleString(), total: N.toLocaleString() });
    const play = box.querySelector('.crp-play');
    play.innerHTML = `${pl.playing ? '⏸' : st.step >= N ? '↻' : '▶'} <span>${esc(lbl)}</span>`;
    play.setAttribute('aria-label', lbl);
    box.querySelectorAll('.crp-tb').forEach(b => { b.disabled = !pl.ready; });
  });
  // The last three plays in or out, newest first
  const rows = [];
  for (let i = st.step - 1; i >= Math.max(0, st.step - 3); i--) {
    const e = m.ev[i], p = e.p;
    rows.push(`<li class="${e.dir > 0 ? 'crp-add' : 'crp-drop'}"><span class="crp-sg">${e.dir > 0 ? '+' : '−'}</span>` +
      `<span class="crp-what"><span class="crp-verb">${esc(t(e.dir > 0 ? 'crp_added' : 'crp_dropped'))}</span> ${esc(p.title)} — ${esc(p.artist)}</span>` +
      `<span class="crp-at">${esc(_crpWhen(e.ms, m.period))}</span></li>`);
  }
  r.querySelector('.crp-log').innerHTML = rows.join('') ||
    `<li class="crp-empty">${esc(pl.ready ? t('crp_start_hint') : '')}</li>`;
}

// ── The stage ───────────────────────────────────────────────────────────────

// One entry, the same element in every layout; CSS gives it each layout's shape
function _crpNode(pl, k) {
  let el = pl.nodes.get(k);
  if (el) return el;
  const m = pl.model.meta.get(k), src = pl.art.get(k);
  el = document.createElement('div');
  el.className = 'crp-it';
  el.innerHTML = `<span class="crp-rk"></span><span class="crp-mv"></span>` +
    `<div class="crp-cv">${src ? `<img src="${esc(src)}" alt="" draggable="false">` : `<span class="crp-ini">${esc(initials(m.ttl || '?'))}</span>`}</div>` +
    `<div class="crp-nm"><span class="crp-tt">${esc(m.ttl)}</span>${m.sub ? `<span class="crp-sub">${esc(m.sub)}</span>` : ''}</div>` +
    `<span class="crp-pl"></span>`;
  el._c = undefined;
  el._mv = undefined;
  pl.nodes.set(k, el);
  return el;
}

// Rank, tint, arrow and plays for an entry at rank r
function _crpFill(pl, k, r) {
  const el = _crpNode(pl, k), m = pl.model, st = pl.st, N = m.ev.length;
  if (el._r !== r) {
    el._r = r;
    el.dataset.pos = r;
    el.classList.toggle('crp-r1', r === 1);
    el.classList.toggle('crp-r2', r === 2);
    el.classList.toggle('crp-r3', r === 3);
    el.querySelector('.crp-rk').textContent = r;
  }
  // The arrow against last period's chart; none while the replay sits on it
  let mv = '', mvCls = 'crp-mv-none';
  if (st.step > 0) {
    const lr = m.lastRank(k);
    if (!lr) { mv = m.everBefore(k) ? 'RE' : 'NEW'; mvCls = m.everBefore(k) ? 'crp-mv-re' : 'crp-mv-new'; }
    else if (lr > r) { mv = '▲' + (lr - r); mvCls = 'crp-mv-up'; }
    else if (lr < r) { mv = '▼' + (r - lr); mvCls = 'crp-mv-down'; }
    else { mv = '—'; mvCls = 'crp-mv-same'; }
  }
  if (el._mv !== mv) {
    el._mv = mv;
    const mvEl = el.querySelector('.crp-mv');
    mvEl.className = 'crp-mv ' + mvCls;
    mvEl.textContent = mv;
  }
  // Plays, with the change against last period while it slides, and a short
  // green / red flash when the number moves
  const c = st.cnt.get(k);
  const mid = st.step > 0 && st.step < N;
  const sig = c + '|' + mid;
  if (el._c !== sig) {
    const prevC = el._cn;
    el._c = sig;
    el._cn = c;
    const dlt = c - m.init.get(k);
    const plEl = el.querySelector('.crp-pl');
    plEl.innerHTML = `<b>${c.toLocaleString()}</b> <small>${esc(tUnit('plays', c))}</small>` +
      (mid && dlt ? `<span class="crp-d ${dlt > 0 ? 'crp-d-up' : 'crp-d-down'}">${dlt > 0 ? '+' : '−'}${Math.abs(dlt).toLocaleString()}</span>` : '');
    if (prevC !== undefined && prevC !== c && !_crpNoMotion()) {
      plEl.classList.remove('crp-fu', 'crp-fd');
      plEl.classList.add(c > prevC ? 'crp-fu' : 'crp-fd');
      clearTimeout(plEl._ft);
      plEl._ft = setTimeout(() => plEl.classList.remove('crp-fu', 'crp-fd'), 60);
    }
  }
}

// Lays the entries out in the layout's containers, in order
function _crpPlace(pl, order) {
  const stage = pl.root.querySelector('.crp-stage');
  const lay = pl.layout;
  let lists;
  if (lay === 'filmstrip') {
    if (!stage.querySelector('.crp-pod')) stage.innerHTML = '<div class="crp-pod"></div><div class="crp-strip"></div>';
    lists = [stage.querySelector('.crp-pod'), stage.querySelector('.crp-strip')];
  } else {
    if (!stage.querySelector('.crp-list')) {
      const cls = lay === 'stack' && _stkTwoCol ? ' crp-2col' : lay === 'grid' && _wvGridLarge ? ' crp-lg' : '';
      stage.innerHTML = `<div class="crp-list${cls}"></div>`;
    }
    lists = [stage.querySelector('.crp-list')];
  }
  lists.forEach(l => l.replaceChildren());
  // Stack's two columns fill down first, like the real one
  if (lay === 'stack' && _stkTwoCol) lists[0].style.setProperty('--crp-rows', Math.ceil(order.length / 2));
  order.forEach((k, i) => {
    _crpFill(pl, k, i + 1);
    (lay === 'filmstrip' && i >= 3 ? lists[1] : lists[0]).appendChild(_crpNode(pl, k));
  });
  pl.shown = order;
}

/* Moves entries from where they are now (even mid-glide) to their new
   places: measure, rearrange, then play the difference back as a transform
   (FLIP). An entry leaving the chart fades out where it was; one arriving
   rises in at its place. */
function _crpReorder(pl, order, dur) {
  const stage = pl.root.querySelector('.crp-stage');
  if (!dur || _crpNoMotion()) {
    order.forEach(k => { const el = _crpNode(pl, k); el.style.transition = 'none'; el.style.transform = ''; el.style.opacity = ''; el.style.zIndex = ''; });
    _crpPlace(pl, order);
    return;
  }
  const sRect = stage.getBoundingClientRect();
  const first = new Map(pl.shown.map(k => [k, _crpNode(pl, k).getBoundingClientRect()]));
  const keep = new Set(order);
  pl.shown.filter(k => !keep.has(k)).forEach(k => {
    const r = first.get(k), g = _crpNode(pl, k).cloneNode(true);
    g.classList.add('crp-ghost');
    g.style.transform = '';
    g.style.transition = '';
    Object.assign(g.style, { left: (r.left - sRect.left) + 'px', top: (r.top - sRect.top) + 'px', width: r.width + 'px', height: r.height + 'px' });
    stage.appendChild(g);
    requestAnimationFrame(() => { g.style.opacity = '0'; g.style.transform = 'translateY(10px) scale(.96)'; });
    setTimeout(() => g.remove(), 420);
  });
  order.forEach(k => { const el = _crpNode(pl, k); el.style.transition = 'none'; el.style.transform = ''; });
  _crpPlace(pl, order);
  const moves = [];
  order.forEach(k => {
    const el = _crpNode(pl, k), l = el.getBoundingClientRect(), fr = first.get(k);
    if (fr) {
      const dx = fr.left - l.left, dy = fr.top - l.top;
      const sx = l.width ? fr.width / l.width : 1, sy = l.height ? fr.height / l.height : 1;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) { el.style.opacity = ''; el.style.zIndex = ''; return; }
      // A climber glides over the entry it passes
      el.style.zIndex = (dy > 0 || (dy === 0 && dx > 0)) ? '3' : '1';
      el.style.transformOrigin = '0 0';
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    } else {
      el.style.zIndex = '2';
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
    }
    moves.push(el);
  });
  if (!moves.length) return;
  void stage.offsetWidth;   // one layout read for the whole batch
  moves.forEach(el => {
    el.style.transition = `transform ${dur}ms cubic-bezier(.25,.8,.25,1), opacity ${dur}ms ease`;
    el.style.transform = '';
    el.style.opacity = '';
  });
}
