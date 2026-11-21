/* ═══════════════════════════════════════════════════════════════════════
   SONG CHART TAB — artist window + album / single / EP window (2026-11-21)
   Plan: SONG-CHART-PLAN.md. Ranks only this artist's (or this release's)
   songs against each other, day by day, week by week, month by month or
   year by year, two ways:

     • Standing — every song stays on, ranked by ALL its plays up to the end
       of the picked period. Rows show the move since the last period and
       the plays added in it. Ties: whoever reached that count first.
     • This period — only songs played in the period, ranked by plays in it
       (ties: first to get there). NEW = first play ever, RE = played
       before. The rest drop off; empty periods are skipped with a note.

   Also here: activity ribbon (tap / drag to jump), quiet rows fade, Only
   moved, fell-off tray, album Track order, artist Songs / Releases, rank
   sparklines, peak / times at #1 chips, milestone badges, a summary line
   with the artist's or album's rank on the main chart, Number ones, Rank
   race (bump chart), jump shortcuts + date box, ▶ play through, Compare,
   open at the main chart's date, share image and make playlist.

   Everything is worked out from allPlays with the main charts' own period
   keys (dayStrOf / playWeekKeyOf / monthKeyOf / yearKeyOf), so Last.fm,
   Google Sheets and uploaded plays all get it and the week start day and
   time zone match the charts.

   Loaded AFTER app.js and BEFORE panel.js: it wraps openArtistModal /
   openAlbumModal, and panel.js wraps the result, so the tab's shell is
   already in the window when panel.js decides which tabs have content.
   The heavy part is built only when the tab is first shown (dp-show).
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const SCH_LS = 'dc_sch_prefs';          // remembered: period size, mode, toggles, speed
  const SCH_PAGE = 25;                    // rows before "Show all"
  const SCH_SPARK = 12;                   // periods in a row's rank line
  const SCH_BUMP_STEPS = 12;              // periods in the Rank race
  const SCH_BUMP_LINES = 6;               // songs in the Rank race
  const SCH_MILESTONES = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
  const SCH_GRANS = ['day', 'week', 'month', 'year'];
  // Rank race line colours: theme tokens, so every theme keeps its look
  // (teal and gold2 sit too close to accent / amber in several themes, so the
  // 5th is a rose-accent blend and the 6th the text colour)
  const SCH_LINE_COLORS = ['var(--accent)', 'var(--green)', 'var(--amber)', 'var(--rose)', 'color-mix(in srgb, var(--rose) 50%, var(--accent))', 'var(--text)', 'var(--text3)'];

  /* ── small helpers ─────────────────────────────────────────────────── */
  const T = (k, v) => (typeof t === 'function' ? t(k, v) : k);
  const E = s => (typeof esc === 'function' ? esc(s) : String(s == null ? '' : s));
  const unit = g => T('sch_u_' + g);                 // "week"
  const units = (g, n) => T(n === 1 ? 'sch_u_' + g : 'sch_us_' + g);   // "weeks"
  const plays = n => (typeof tCount === 'function' ? tCount('plays', n) : n + ' plays');
  function lsGet() { try { return JSON.parse(localStorage.getItem(SCH_LS) || '{}') || {}; } catch (e) { return {}; } }
  function lsSet(o) { try { localStorage.setItem(SCH_LS, JSON.stringify(o)); } catch (e) {} }
  const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ico = n => (typeof dcIco === 'function' ? dcIco(n) : '');

  /* ── period keys (the main charts' own) ────────────────────────────── */
  const KEY_OF = {
    day: p => dayStrOf(p),
    week: p => playWeekKeyOf(p),
    month: p => monthKeyOf(p),
    year: p => yearKeyOf(p)
  };
  function parseDay(k) { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); }
  // The key after `k` in a period size: days +1, weeks +7, months, years
  function nextKey(g, k) {
    if (g === 'day' || g === 'week') { const d = parseDay(k); d.setDate(d.getDate() + (g === 'day' ? 1 : 7)); return localDateStr(d); }
    if (g === 'month') { let [y, m] = k.split('-').map(Number); m++; if (m > 12) { m = 1; y++; } return y + '-' + String(m).padStart(2, '0'); }
    return String(+k + 1);
  }
  // Today's key, so the list runs up to now (recent quiet periods count too)
  function nowKey(g) {
    const n = tzNow();
    if (g === 'day') return localDateStr(n);
    if (g === 'week') return playWeekKey(new Date());
    if (g === 'month') return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0');
    return String(n.getFullYear());
  }
  // A date box value (YYYY-MM-DD) → the key of the period holding it
  function keyForDate(g, ds) {
    if (g === 'day') return ds;
    const d = parseDay(ds);
    if (g === 'week') { const off = (d.getDay() - weekStartDay + 7) % 7; return localDateStr(new Date(d.getFullYear(), d.getMonth(), d.getDate() - off)); }
    if (g === 'month') return ds.slice(0, 7);
    return ds.slice(0, 4);
  }
  const title = (g, k) => (typeof crPeriodTitle === 'function' ? crPeriodTitle(g, k) : k);
  const shortLabel = (g, k) => (typeof crPeriodLabel === 'function' ? crPeriodLabel(g, k) : k);

  /* ── all plays per period across the whole library (for "% of all your
        plays"), cached per period size until the plays change ─────────── */
  let _libTot = { sig: '', g: {} };
  function libTotals(g) {
    const sig = (typeof _playsVersion !== 'undefined' ? _playsVersion : '') + '|' + (typeof _stampEpoch !== 'undefined' ? _stampEpoch : '') + '|' + allPlays.length;
    if (_libTot.sig !== sig) _libTot = { sig, g: {} };
    if (_libTot.g[g]) return _libTot.g[g];
    const m = new Map(), f = KEY_OF[g];
    for (const p of allPlays) { const k = f(p); m.set(k, (m.get(k) || 0) + 1); }
    return (_libTot.g[g] = m);
  }

  /* ═══ STATE — one per window kind (artist / album) ═══════════════════ */
  const ST = {};
  function freshState(kind, arg) {
    const pr = lsGet();
    return {
      kind, arg,
      name: kind === 'artist' ? arg : arg.split('|||')[0],
      credit: kind === 'artist' ? arg : (arg.split('|||')[1] || ''),
      root: document.getElementById(kind === 'artist' ? 'artistSongChart' : 'albumSongChart'),
      plays: null,                       // this window's plays, oldest first
      items: 'songs',                    // artist: 'songs' | 'releases'
      g: SCH_GRANS.includes(pr.g) ? pr.g : 'week',
      mode: pr.mode === 'period' ? 'period' : 'standing',
      skip: pr.skip !== false,
      onlyMoved: !!pr.onlyMoved,
      speed: [1, 2, 4].includes(pr.speed) ? pr.speed : 1,
      order: 'rank',                     // album: 'rank' | 'track'
      idx: -1, skipped: null,
      cmp: null,                         // Compare: the other period's index
      showAll: false, open: null, focus: null,
      sameDate: null,                    // the main chart's period this opened on
      timer: null, built: false, models: {}, stats: {}, imgObs: null
    };
  }
  function savePrefs(st) { lsSet({ g: st.g, mode: st.mode, skip: st.skip, onlyMoved: st.onlyMoved, speed: st.speed }); }

  /* ═══ MODEL ══════════════════════════════════════════════════════════
     items = the songs (or releases) in this window. Per period size:
       keys       every period from the first play to now, empty ones too
       tot        this window's plays per period
       pOrd/pCnt  This period: who played, best first, and their plays
       stand/standCum  Standing: everyone ranked by plays so far + totals
     Standing is kept as one sorted list that each period only nudges
     (a song that gains plays can only move up), so a long Day history is
     a quick walk, not a full sort per day. Empty periods share the last
     snapshot. */
  function playsFor(st) {
    if (st.plays) return st.plays;
    let list;
    if (st.kind === 'artist') list = allPlays.filter(p => p.artists.includes(st.arg));
    else {
      const ak = st.arg;
      list = (typeof rollupAffectsModal === 'function' && rollupAffectsModal())
        ? allPlays.filter(p => albumKeyOf(p) === ak || rollupBelongsTo(p, ak))
        : allPlays.filter(p => albumKeyOf(p) === ak);
    }
    return (st.plays = list.reverse());    // allPlays is newest first; this is oldest first
  }

  function model(st) {
    const which = st.items;
    if (st.models[which]) return st.models[which];
    const P = playsFor(st);
    const ids = new Map(), items = [], itemOf = new Int32Array(P.length);
    for (let i = 0; i < P.length; i++) {
      const p = P[i];
      let k, rel = which === 'releases';
      if (rel) {
        if (!p.album || p.album === '—') { itemOf[i] = -1; continue; }
        const credit = albumArtist(p);
        // the artist's own releases (or joint ones they co-own), like the artist window's album lists
        if (typeof isAlbumOwner === 'function' && !isAlbumOwner(p.album, credit, st.arg)) { itemOf[i] = -1; continue; }
        k = albumKeyOf(p);
      } else k = songKey(p);
      let id = ids.get(k);
      if (id === undefined) {
        id = items.length; ids.set(k, id);
        if (rel) {
          const credit = albumArtist(p), ty = typeof releaseTypeOf === 'function' ? releaseTypeOf(p.album, credit) : 'album';
          items.push({ id, key: k, kind: 'album', name: p.album, artist: credit, album: p.album, type: ty,
            sub: T('sch_rel_' + ty), total: 0, songs: new Map(),
            img: { name: p.album, album: p.album, artist: credit, prefKey: 'album:' + credit.toLowerCase() + '|||' + p.album.toLowerCase() } });
        } else {
          const sub = st.kind === 'artist' ? (p.album && p.album !== '—' ? p.album : '') : (p.artist !== st.credit ? p.artist : '');
          items.push({ id, key: k, kind: 'song', name: p.title, artist: p.artist, album: p.album || '', albumKey: albumKeyOf(p), sub, total: 0,
            img: { name: p.title, title: p.title, artist: p.artist, album: '', prefKey: 'song:' + p.artist.toLowerCase() + '|||' + p.title.toLowerCase() } });
        }
      }
      itemOf[i] = id;
      items[id].total++;
      // a release's most played song, for its playlist pick
      if (rel) { const s = items[id].songs, sk = p.title; s.set(sk, (s.get(sk) || 0) + 1); }
    }
    return (st.models[which] = { items, itemOf, grans: {} });
  }

  function gran(st, g) {
    const M = model(st);
    if (M.grans[g]) return M.grans[g];
    const P = playsFor(st), f = KEY_OF[g], n = M.items.length;
    let firstK = null, lastK = null;
    for (let i = 0; i < P.length; i++) if (M.itemOf[i] >= 0) { const k = f(P[i]); if (firstK === null || k < firstK) firstK = k; if (lastK === null || k > lastK) lastK = k; }
    const G = { g, keys: [], at: new Map(), tot: [], pOrd: [], pCnt: [], stand: [], standCum: [], n };
    if (firstK === null) return (M.grans[g] = G);
    const endK = nowKey(g) > lastK ? nowKey(g) : lastK;
    for (let k = firstK, guard = 0; k <= endK && guard < 40000; k = nextKey(g, k), guard++) { G.at.set(k, G.keys.length); G.keys.push(k); }
    const K = G.keys.length;
    const per = new Array(K);
    for (let i = 0; i < P.length; i++) {
      const id = M.itemOf[i]; if (id < 0) continue;
      const pi = G.at.get(f(P[i])); if (pi === undefined) continue;
      const m = per[pi] || (per[pi] = new Map());
      const ts = +P[i].date, e = m.get(id);
      if (e) { e.c++; e.l = ts; } else m.set(id, { c: 1, f: ts, l: ts });
    }
    const cum = new Float64Array(n), reach = new Float64Array(n), pos = new Int32Array(n).fill(-1), order = [];
    // a ranks above b: more plays, or the same and got there first
    const better = (a, b) => cum[a] !== cum[b] ? cum[a] > cum[b] : reach[a] !== reach[b] ? reach[a] < reach[b] : a < b;
    let snap = null, snapCum = null;
    for (let pi = 0; pi < K; pi++) {
      const m = per[pi];
      if (!m) { G.tot.push(0); G.pOrd.push(null); G.pCnt.push(null); G.stand.push(snap); G.standCum.push(snapCum); continue; }
      const idsHere = [...m.keys()];
      let tot = 0; idsHere.forEach(id => tot += m.get(id).c);
      G.tot.push(tot);
      idsHere.sort((a, b) => m.get(b).c - m.get(a).c || m.get(a).f - m.get(b).f || a - b);
      G.pOrd.push(Uint32Array.from(idsHere));
      G.pCnt.push(Uint32Array.from(idsHere, id => m.get(id).c));
      // Standing: add the plays in the order they finished, nudging each up
      const upd = idsHere.slice().sort((a, b) => m.get(a).l - m.get(b).l);
      for (const id of upd) {
        const e = m.get(id);
        cum[id] += e.c; reach[id] = e.l;
        let j = pos[id];
        if (j < 0) { j = order.length; order.push(id); }
        while (j > 0 && better(id, order[j - 1])) { const o = order[j - 1]; order[j] = o; pos[o] = j; j--; }
        order[j] = id; pos[id] = j;
      }
      snap = Uint32Array.from(order); snapCum = Uint32Array.from(order, id => cum[id]);
      G.stand.push(snap); G.standCum.push(snapCum);
    }
    return (M.grans[g] = G);
  }

  /* ── reading the model ─────────────────────────────────────────────── */
  const isEmpty = (G, i) => !G.tot[i];
  function lastFull(G, from) { for (let i = from == null ? G.keys.length - 1 : from; i >= 0; i--) if (!isEmpty(G, i)) return i; return 0; }
  function inv(arr, n) { const r = new Int32Array(n); if (arr) for (let i = 0; i < arr.length; i++) r[arr[i]] = i + 1; return r; }
  // The ranked list for a period in a mode: [{id, rank, value}]
  function listAt(G, mode, i) {
    if (i < 0 || i >= G.keys.length) return [];
    const ord = mode === 'standing' ? G.stand[i] : G.pOrd[i], val = mode === 'standing' ? G.standCum[i] : G.pCnt[i];
    if (!ord) return [];
    const out = new Array(ord.length);
    for (let j = 0; j < ord.length; j++) out[j] = { id: ord[j], rank: j + 1, value: val[j] };
    return out;
  }
  function countsAt(G, i) { const m = new Map(); const o = G.pOrd[i], c = G.pCnt[i]; if (o) for (let j = 0; j < o.length; j++) m.set(o[j], c[j]); return m; }
  function cumAt(G, i) { const m = new Map(); if (i < 0) return m; const o = G.stand[i], c = G.standCum[i]; if (o) for (let j = 0; j < o.length; j++) m.set(o[j], c[j]); return m; }

  /* Peak, times at #1, periods played and when first on, as of period i.
     Standing counts every period (a #1 holds through quiet weeks); This
     period counts only periods with plays. Cached per view. */
  function statsAt(st, G, i) {
    const key = st.items + '|' + G.g + '|' + st.mode + '|' + i;
    if (st.stats[key]) return st.stats[key];
    const n = G.n, peak = new Int32Array(n), no1 = new Int32Array(n), on = new Int32Array(n), since = new Int32Array(n).fill(-1);
    for (let j = 0; j <= i; j++) {
      const ord = st.mode === 'standing' ? G.stand[j] : G.pOrd[j];
      if (!ord) continue;
      no1[ord[0]]++;
      for (let r = 0; r < ord.length; r++) {
        const id = ord[r];
        if (!peak[id] || r + 1 < peak[id]) peak[id] = r + 1;
        on[id]++;
        if (since[id] < 0) since[id] = j;
      }
    }
    if (Object.keys(st.stats).length > 40) st.stats = {};
    return (st.stats[key] = { peak, no1, on, since });
  }

  /* ═══ OPENING A WINDOW ═══════════════════════════════════════════════ */
  function onOpen(kind, arg) {
    stopPlay(ST[kind]);
    const st = ST[kind] = freshState(kind, arg);
    if (!st.root) return;
    // The tab only shows when there are 2+ songs to rank (panel.js hides an empty part)
    const P = playsFor(st), seen = new Set();
    for (const p of P) { seen.add(songKey(p)); if (seen.size > 1) break; }
    if (seen.size < 2) { st.root.innerHTML = ''; return; }
    // Opened from a past period of the main chart: land on that same period (idea 19)
    try {
      const cp = typeof currentPeriod !== 'undefined' ? currentPeriod : '';
      if (cp === 'day' && typeof dyViewedDay === 'function') {
        const k = dyViewedDay(); if (k && k !== nowKey('day')) st.sameDate = { g: 'day', key: k };
      } else if ((cp === 'week' || cp === 'month' || cp === 'year') && currentOffset > 0 && typeof _crCurKey === 'function') {
        st.sameDate = { g: cp, key: _crCurKey(cp) };
      }
    } catch (e) {}
    if (st.sameDate) st.g = st.sameDate.g;
    // A light shell now (so the tab is listed); the chart itself is built when shown
    st.root.innerHTML = `<div class="sch sch-wait"><div class="sch-wait-t">${E(T('sch_loading'))}</div></div>`;
    st.built = false;
  }

  function onShow(kind) {
    const st = ST[kind];
    if (!st || !st.root || !st.root.firstChild) return;
    if (st.built) return;
    st.built = true;
    const G = gran(st, st.g);
    st.idx = lastFull(G);
    if (st.sameDate) {
      const at = G.at.get(st.sameDate.key);
      if (at !== undefined) st.idx = at; else st.sameDate = null;
    }
    renderShell(st);
    paint(st);
  }

  // Wrap the two open functions (panel.js wraps these wrappers afterwards)
  function wrapOpen(name, kind) {
    const orig = window[name];
    if (typeof orig !== 'function' || orig._schWrapped) return;
    const w = function (arg) {
      const r = orig.apply(this, arguments);
      try { onOpen(kind, arg); } catch (e) { console.error('songchart', e); }
      return r;
    };
    w._schWrapped = true;
    window[name] = w;
  }
  wrapOpen('openArtistModal', 'artist');
  wrapOpen('openAlbumModal', 'album');

  // The tab was opened: build it (each part listens for panel.js's dp-show)
  function hookShow() {
    [['artistSongChart', 'artist'], ['albumSongChart', 'album']].forEach(([id, kind]) => {
      const el = document.getElementById(id), sec = el && el.closest('.dp-sec');
      if (sec && !sec._schHooked) { sec._schHooked = true; sec.addEventListener('dp-show', () => onShow(kind)); }
    });
    // Stop ▶ when a window closes
    ['artistModal', 'albumModal'].forEach((id, n) => {
      const ov = document.getElementById(id);
      if (ov && !ov._schObs) {
        ov._schObs = new MutationObserver(() => { if (!ov.classList.contains('open')) stopPlay(ST[n ? 'album' : 'artist']); });
        ov._schObs.observe(ov, { attributes: true, attributeFilter: ['class'] });
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hookShow); else hookShow();

  /* ═══ SHELL — the controls (drawn again when the period size or the
        Songs / Releases switch changes) ══════════════════════════════════ */
  function seg(act, opts, cur, label) {
    return `<div class="dc-seg sch-seg" role="group" aria-label="${E(label)}">` + opts.map(([v, txt]) =>
      `<button type="button" data-sch="${act}" data-v="${v}" aria-pressed="${v === cur}">${txt}</button>`).join('') + '</div>';
  }
  function renderShell(st) {
    const g = st.g;
    const items = st.kind === 'artist'
      ? seg('items', [['songs', E(T('sch_items_songs'))], ['releases', E(T('sch_items_releases'))]], st.items, T('sch_items_label')) : '';
    const order = st.kind === 'album'
      ? seg('order', [['rank', E(T('sch_order_rank'))], ['track', E(T('sch_order_track'))]], st.order, T('sch_order_label')) : '';
    st.root.innerHTML = `<div class="sch" data-kind="${st.kind}">
      <div class="sch-head">
        <div class="sch-head-l">${items}${order}</div>
        <div class="sch-head-r">
          <button type="button" class="dc-btn dc-btn-plain dc-btn-sm" data-sch="playlist" title="${E(T('sch_playlist_tip'))}">${ico('listmusic')}${E(T('sch_playlist'))}</button>
          <button type="button" class="dc-btn dc-btn-plain dc-btn-sm" data-sch="share" title="${E(T('sch_share_tip'))}">${ico('share')}${E(T('sch_share'))}</button>
        </div>
      </div>
      <div class="sch-bar">
        ${seg('g', SCH_GRANS.map(x => [x, E(T('sch_g_' + x))]), g, T('sch_g_label'))}
        ${seg('mode', [['standing', E(T('sch_mode_standing'))], ['period', E(T('sch_mode_period_' + g))]], st.mode, T('sch_mode_label'))}
      </div>
      <p class="sch-help"></p>
      <div class="sch-nav">
        <button type="button" class="sch-arrow" data-sch="prev" aria-label="${E(T('sch_prev', { unit: unit(g) }))}">‹</button>
        <div class="sch-when" aria-live="polite"><div class="sch-when-t"></div><div class="sch-when-s"></div></div>
        <button type="button" class="sch-arrow" data-sch="next" aria-label="${E(T('sch_next', { unit: unit(g) }))}">›</button>
        <button type="button" class="sch-play" data-sch="play" aria-pressed="false" title="${E(T('sch_play_tip'))}"><span class="sch-play-i">▶</span><span class="sch-play-l">${E(T('sch_play'))}</span></button>
        <button type="button" class="sch-speed" data-sch="speed" title="${E(T('sch_speed'))}">${st.speed}×</button>
      </div>
      <div class="sch-rib-wrap">
        <svg class="sch-rib" preserveAspectRatio="none" role="slider" tabindex="0" aria-label="${E(T('sch_ribbon', { unit: unit(g) }))}"></svg>
        <div class="sch-rib-cap"><span class="sch-rib-a"></span><span class="sch-rib-h"></span><span class="sch-rib-b"></span></div>
      </div>
      <div class="sch-tools">
        <div class="sch-jumps">
          <button type="button" class="sch-chip" data-sch="jfirst">⏮ ${E(T('sch_jump_first'))}</button>
          <button type="button" class="sch-chip" data-sch="jbusy">🔥 ${E(T('sch_jump_busiest', { unit: unit(g) }))}</button>
          <button type="button" class="sch-chip" data-sch="jlast">${E(T('sch_jump_latest'))} ⏭</button>
          <label class="sch-chip sch-date">📅 <span>${E(T('sch_jump_date'))}</span><input type="date" class="sch-date-in" data-sch="jdate" aria-label="${E(T('sch_jump_date'))}"></label>
        </div>
        <div class="sch-toggles">
          <button type="button" class="sch-chip sch-tg" data-sch="skip" aria-pressed="${st.skip}">${E(T('sch_skip'))}</button>
          <button type="button" class="sch-chip sch-tg" data-sch="moved" aria-pressed="${st.onlyMoved}">${E(T('sch_only_moved'))}</button>
          <button type="button" class="sch-chip sch-tg" data-sch="cmp" aria-pressed="${!!st.cmp}">⇆ ${E(T('sch_compare'))}</button>
        </div>
      </div>
      <div class="sch-notes"></div>
      <div class="sch-cmpbar" hidden></div>
      <div class="sch-sum"></div>
      <div class="sch-body"></div>
      <div class="sch-extra"></div>
    </div>`;
    drawRibbon(st);
  }

  /* ═══ PAINT — everything that changes with the period ═══════════════ */
  function paint(st, opts) {
    const root = st.root && st.root.querySelector('.sch');
    if (!root) return;
    const G = gran(st, st.g), g = st.g, i = st.idx, K = G.keys.length;
    if (!K) { root.querySelector('.sch-body').innerHTML = `<div class="sch-empty">${E(T('sch_nothing'))}</div>`; return; }
    const isRel = st.items === 'releases';
    // help line
    root.querySelector('.sch-help').textContent = T((st.mode === 'standing' ? 'sch_help_standing' : 'sch_help_period') + (isRel ? '_rel' : ''), { unit: unit(g) });
    // where we are
    const full = G.tot.slice(0, i + 1).filter(Boolean).length, allFull = G.tot.filter(Boolean).length;
    root.querySelector('.sch-when-t').textContent = title(g, G.keys[i]);
    root.querySelector('.sch-when-s').textContent = G.tot[i]
      ? T('sch_when_sub', { n: full, total: allFull, units: units(g, allFull), plays: plays(G.tot[i]) })
      : T('sch_when_quiet', { unit: unit(g) });
    root.querySelector('[data-sch="prev"]').disabled = i <= 0;
    root.querySelector('[data-sch="next"]').disabled = i >= K - 1;
    const pb = root.querySelector('[data-sch="play"]');
    pb.setAttribute('aria-pressed', !!st.timer);
    pb.querySelector('.sch-play-i').textContent = st.timer ? '❚❚' : '▶';
    pb.querySelector('.sch-play-l').textContent = T(st.timer ? 'sch_pause' : 'sch_play');
    root.querySelector('[data-sch="moved"]').hidden = st.mode !== 'standing';
    const di = root.querySelector('.sch-date-in');
    if (di) { di.min = firstDayOf(G.keys[0], g); di.max = localDateStr(tzNow()); }
    moveRibbonMark(st);
    paintNotes(st, G);
    paintSummary(st, G);
    if (st.cmp != null) paintCompare(st, G); else { root.querySelector('.sch-cmpbar').hidden = true; paintList(st, G, opts); }
    if (!opts || !opts.fast) paintExtra(st, G);
  }
  function firstDayOf(k, g) { return g === 'month' ? k + '-01' : g === 'year' ? k + '-01-01' : k; }

  /* Notes: skipped empty periods, opened at the main chart's date, track
     list lookups */
  function paintNotes(st, G) {
    const box = st.root.querySelector('.sch-notes'), g = st.g, out = [];
    if (st.sameDate && G.keys[st.idx] === st.sameDate.key) {
      out.push(`<div class="sch-note">${E(T('sch_same_date', { unit: unit(g) }))} <button type="button" class="sch-link" data-sch="jlast">${E(T('sch_jump_latest'))} ⏭</button></div>`);
    }
    if (st.skipped && st.skipped.n) {
      const a = st.skipped.a, b = st.skipped.b;
      out.push(`<div class="sch-note sch-note-skip"><span class="sch-note-i">⤼</span> ${T('sch_skipped', {
        n: `<b>${st.skipped.n}</b>`, units: E(units(g, st.skipped.n)),
        range: E(a === b ? title(g, G.keys[a]) : shortLabel(g, G.keys[a]) + ' – ' + shortLabel(g, G.keys[b]))
      })} <button type="button" class="sch-link" data-sch="noskip">${E(T('sch_show_them'))}</button></div>`);
    }
    if (st.kind === 'album' && st.order === 'track') {
      const store = typeof _rtTracklistStore === 'function' ? _rtTracklistStore() : {};
      if (!(st.arg in store)) out.push(`<div class="sch-note">${E(T('sch_track_loading'))}</div>`);
      else if (!store[st.arg]) out.push(`<div class="sch-note">${E(T('sch_track_missing'))}</div>`);
    }
    box.innerHTML = out.join('');
  }

  /* Summary line (idea 13): plays, songs played, new, share of all your
     plays, and the artist's / album's rank on the main chart then */
  function paintSummary(st, G) {
    const box = st.root.querySelector('.sch-sum'), g = st.g, i = st.idx, k = G.keys[i];
    const here = G.pOrd[i] ? G.pOrd[i].length : 0;
    const everOn = G.stand[i] ? G.stand[i].length : 0;
    const before = cumAt(G, i - 1);
    let fresh = 0; if (G.pOrd[i]) for (const id of G.pOrd[i]) if (!before.get(id)) fresh++;
    const lib = libTotals(g).get(k) || 0;
    const parts = [];
    parts.push(`<span><b>${(G.tot[i] || 0).toLocaleString()}</b> ${E(typeof tUnit === 'function' ? tUnit('plays', G.tot[i] || 0) : 'plays')}</span>`);
    parts.push(`<span>${T('sch_sum_played', { n: `<b>${here}</b>`, total: everOn })}</span>`);
    if (fresh) parts.push(`<span class="sch-sum-new">${T('sch_sum_new', { n: `<b>${fresh}</b>` })}</span>`);
    if (lib && G.tot[i]) parts.push(`<span>${T('sch_sum_share', { pct: `<b>${Math.max(1, Math.round(G.tot[i] / lib * 100))}%</b>` })}</span>`);
    // rank on the main chart that period
    const run = typeof allChartRun !== 'undefined' ? allChartRun[g] : null;
    const rec = run && run.result && (st.kind === 'artist' ? run.result.artists && run.result.artists[st.arg] : run.result.albums && run.result.albums[st.arg]);
    const ent = rec && rec.entries ? rec.entries.find(e => e.periodKey === k) : null;
    const chartName = T('sch_chart_' + g);
    if (ent) parts.push(`<button type="button" class="sch-sum-rank" data-sch="mainchart" title="${E(T('sch_open_main'))}">${T('sch_sum_rank', { rank: `<b>#${ent.rank}</b>`, chart: E(chartName) })} ↗</button>`);
    else if (G.tot[i]) parts.push(`<span class="sch-sum-off">${E(T('sch_sum_off', { chart: chartName }))}</span>`);
    box.innerHTML = parts.join('<span class="sch-dot" aria-hidden="true">·</span>');
  }

  /* ═══ THE LIST ═══════════════════════════════════════════════════════ */
  function rowsFor(st, G, i) {
    const M = model(st), mode = st.mode;
    const list = listAt(G, mode, i);
    const prevInv = inv(mode === 'standing' ? G.stand[i - 1] : G.pOrd[i - 1], G.n);
    const adds = countsAt(G, i), before = cumAt(G, i - 1), now = mode === 'standing' ? null : cumAt(G, i);
    return list.map(r => {
      const it = M.items[r.id], was = prevInv[r.id] || 0, add = adds.get(r.id) || 0, cb = before.get(r.id) || 0;
      let mv;
      if (!was) mv = mode === 'period' && cb ? 're' : 'new';
      else mv = was > r.rank ? 'up' : was < r.rank ? 'down' : 'same';
      return { it, id: r.id, rank: r.rank, value: r.value, was, add, cumBefore: cb, cum: mode === 'standing' ? r.value : (now.get(r.id) || 0), mv };
    });
  }
  function mvChip(r) {
    if (r.mv === 'new') return `<span class="sch-mv sch-mv-new">${E(T('badge_new'))}</span>`;
    if (r.mv === 're') return `<span class="sch-mv sch-mv-re">${E(T('badge_re'))}</span>`;
    if (r.mv === 'same') return `<span class="sch-mv sch-mv-same" aria-label="${E(T('sch_mv_same'))}">=</span>`;
    const d = Math.abs(r.was - r.rank);
    return r.mv === 'up' ? `<span class="sch-mv sch-mv-up" aria-label="${E(T('sch_mv_up', { n: d }))}">▲${d}</span>` : `<span class="sch-mv sch-mv-down" aria-label="${E(T('sch_mv_down', { n: d }))}">▼${d}</span>`;
  }

  // Milestones (idea 12): a play count crossed, or songs passed, this period
  function badgesFor(st, r, rows, byId) {
    if (st.mode !== 'standing' || !r.add) return '';
    const out = [];
    const crossed = SCH_MILESTONES.filter(m => r.cumBefore < m && r.cum >= m).pop();
    if (crossed) out.push(`<span class="sch-badge sch-badge-ms">🎯 ${E(T('sch_ms_plays', { n: crossed.toLocaleString() }))}</span>`);
    if (r.was && r.was > r.rank) {
      // songs now below it that were above it before
      const passed = [];
      for (let j = r.rank; j < rows.length && j < r.was; j++) { const o = rows[j]; if (o.was && o.was < r.was) passed.push(o); }
      if (passed.length) out.push(`<span class="sch-badge">⤴ ${E(passed.length > 1 ? T('sch_ms_passed_more', { name: passed[0].it.name, n: passed.length - 1 }) : T('sch_ms_passed', { name: passed[0].it.name }))}</span>`);
    }
    return out.join('');
  }

  // Rank line over the last periods (idea 10), as a tiny SVG
  function sparkInvs(st, G, i) {
    const steps = [];
    for (let j = i; j >= 0 && steps.length < SCH_SPARK; j--) if (!isEmpty(G, j)) steps.unshift(j);
    return steps.map(j => inv(st.mode === 'standing' ? G.stand[j] : G.pOrd[j], G.n));
  }
  function spark(invs, id) {
    if (invs.length < 2) return '';
    const rs = invs.map(a => a[id] || 0), have = rs.filter(Boolean);
    if (have.length < 2) return '<span class="sch-spark"></span>';
    const lo = Math.min(...have), hi = Math.max(...have), W = 56, H = 18, span = Math.max(1, hi - lo);
    const x = j => (j / (rs.length - 1) * (W - 4) + 2).toFixed(1), y = r => (2 + (r - lo) / span * (H - 4)).toFixed(1);
    let d = '', pen = false, dots = '';
    rs.forEach((r, j) => { if (!r) { pen = false; return; } d += (pen ? 'L' : 'M') + x(j) + ' ' + y(r); pen = true; dots += `<circle cx="${x(j)}" cy="${y(r)}" r="1.1"/>`; });
    const lastR = rs[rs.length - 1], firstR = have[0];
    const tone = !lastR ? 'var(--text3)' : lastR < firstR ? 'var(--chart-up)' : lastR > firstR ? 'var(--chart-down)' : 'var(--text3)';
    const end = lastR ? `<circle cx="${x(rs.length - 1)}" cy="${y(lastR)}" r="2.2" fill="${tone}"/>` : '';
    return `<svg class="sch-spark" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true"><path d="${d}" fill="none" stroke="${tone}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><g fill="${tone}">${dots}</g>${end}</svg>`;
  }

  // Album Track order (idea 8): the Deezer track list the score card uses
  function trackOrder(st, rows) {
    const store = typeof _rtTracklistStore === 'function' ? _rtTracklistStore() : {};
    if (!(st.arg in store)) {
      if (typeof rtPrefetchTracklist === 'function' && !st._trackAsked) {
        st._trackAsked = true;
        rtPrefetchTracklist(st.arg).then(() => { if (ST[st.kind] === st) paint(st); }).catch(() => {});
      }
      return rows;
    }
    const list = store[st.arg];
    if (!list) return rows;
    const norm = s => (typeof _cerNorm === 'function' ? _cerNorm(s) : String(s).toLowerCase());
    const core = s => (typeof _cerCoreTitle === 'function' ? _cerCoreTitle(s) : norm(s));
    const used = new Set(), out = [];
    list.forEach((tt, n) => {
      const hit = rows.find(r => !used.has(r) && norm(r.it.name) === norm(tt)) || rows.find(r => !used.has(r) && core(r.it.name) === core(tt));
      if (hit) { used.add(hit); hit.track = n + 1; out.push(hit); }
    });
    rows.forEach(r => { if (!used.has(r)) out.push(r); });
    return out;
  }

  function rowHtml(st, G, r, rows, invs, stats, n) {
    const it = r.it, isOpen = st.open === it.key;
    const quiet = st.mode === 'standing' && !r.add;
    const tone = r.rank === 1 ? 'gold' : r.rank <= 3 ? 'silver' : r.rank <= 10 ? 'bronze' : 'plain';
    const val = st.mode === 'standing'
      ? `<span class="sch-val"><b>${r.value.toLocaleString()}</b><small class="${r.add ? 'sch-plus' : ''}">+${r.add.toLocaleString()}</small></span>`
      : `<span class="sch-val"><b>${r.value.toLocaleString()}</b><small>${E(T('sch_alltime', { n: r.cum.toLocaleString() }))}</small></span>`;
    const pk = stats.peak[r.id], n1 = stats.no1[r.id], on = stats.on[r.id];
    const meta = [
      pk === 1 ? `<span class="sch-m sch-m-gold">👑 ${E(n1 > 1 ? T('sch_meta_no1', { n: n1, units: units(st.g, n1) }) : T('sch_meta_no1_one', { unit: unit(st.g) }))}</span>`
        : `<span class="sch-m">${E(T('sch_meta_peak', { n: pk }))}</span>`,
      st.mode === 'period' ? `<span class="sch-m">${E(T('sch_meta_on', { n: on, units: units(st.g, on) }))}</span>` : ''
    ].join('');
    const trackNo = r.track ? `<span class="sch-track">${E(T('sch_track_n', { n: r.track }))}</span>` : '';
    const imgId = `schImg-${st.kind}-${n}`;
    const detail = isOpen ? detailHtml(st, G, r, stats) : '';
    return `<div class="sch-row sch-tone-${tone}${quiet ? ' is-quiet' : ''}${isOpen ? ' is-open' : ''}${st.focus === it.key ? ' is-focus' : ''}" data-id="${r.id}" data-key="${E(it.key)}"
        data-ea-type="${it.kind === 'song' ? 'songs' : 'albums'}" data-ea-title="${E(it.kind === 'song' ? it.name : '')}" data-ea-artist="${E(it.artist)}" data-ea-album="${E(it.album)}" data-ea-key="${E(it.key)}" data-ea-img="${imgId}">
      <button type="button" class="sch-main" data-sch="row" aria-expanded="${isOpen}">
        <span class="sch-rank">${r.rank}</span>
        ${mvChip(r)}
        <span class="sch-art" id="${imgId}"><span class="thumb-initials">${E(typeof initials === 'function' ? initials(it.name) : it.name.slice(0, 2))}</span></span>
        <span class="sch-txt">
          <span class="sch-name">${trackNo}${E(it.name)}</span>
          <span class="sch-sub">${it.sub ? `<span class="sch-sub-t">${E(it.sub)}</span>` : ''}${meta}${badgesFor(st, r, rows)}</span>
        </span>
        ${spark(invs, r.id)}
        ${val}
      </button>
      ${detail}
    </div>`;
  }

  // A row unfolded: its numbers, its own path, and where to go from it
  function detailHtml(st, G, r, stats) {
    const it = r.it, g = st.g;
    const since = stats.since[r.id] >= 0 ? title(g, G.keys[stats.since[r.id]]) : '—';
    // its best period in this mode (for "Go to its peak")
    const peakIdx = peakPeriodOf(st, G, r.id);
    const facts = [
      [T('sch_d_peak'), '#' + stats.peak[r.id]],
      [T('sch_d_no1', { units: units(g, 2) }), stats.no1[r.id]],
      [T(st.mode === 'standing' ? 'sch_d_ranked' : 'sch_d_played', { units: units(g, 2) }), stats.on[r.id]],
      [T('sch_d_since'), since],
      [T('sch_d_total'), it.total.toLocaleString()]
    ].map(([k, v]) => `<div class="sch-fact"><span>${E(k)}</span><b>${E(String(v))}</b></div>`).join('');
    return `<div class="sch-detail">
      <div class="sch-facts">${facts}</div>
      <div class="sch-detail-acts">
        ${peakIdx >= 0 && peakIdx !== st.idx ? `<button type="button" class="dc-btn dc-btn-normal dc-btn-sm" data-sch="gopeak" data-i="${peakIdx}">🏔 ${E(T('sch_jump_peak'))} · ${E(shortLabel(g, G.keys[peakIdx]))}</button>` : ''}
        <button type="button" class="dc-btn dc-btn-normal dc-btn-sm" data-sch="follow">${E(T(st.focus === it.key ? 'sch_unfollow' : 'sch_follow'))}</button>
        <button type="button" class="dc-btn dc-btn-main dc-btn-sm" data-sch="openitem">${E(T(it.kind === 'song' ? 'sch_open_song' : 'sch_open_release'))} ↗</button>
      </div>
    </div>`;
  }
  // First period where it reached its best rank (up to the selected one)
  function peakPeriodOf(st, G, id) {
    let best = 0, at = -1;
    for (let j = 0; j <= st.idx; j++) {
      const ord = st.mode === 'standing' ? G.stand[j] : G.pOrd[j];
      if (!ord) continue;
      const r = ord.indexOf(id) + 1;
      if (r && (!best || r < best)) { best = r; at = j; if (r === 1) break; }
    }
    return at;
  }

  function paintList(st, G, opts) {
    const body = st.root.querySelector('.sch-body'), i = st.idx, g = st.g;
    // where each row was, for the slide (FLIP) when the period moves
    const oldTops = {};
    if (opts && opts.slide && !reduceMotion()) body.querySelectorAll('.sch-row').forEach(el => { oldTops[el.dataset.id] = el.getBoundingClientRect().top; });
    let rows = rowsFor(st, G, i);
    const stats = statsAt(st, G, i), invs = sparkInvs(st, G, i);
    let html = '';
    if (st.mode === 'period' && !rows.length) {
      html = `<div class="sch-empty"><div class="sch-empty-i">🌙</div><b>${E(T('sch_empty_period', { unit: unit(g) }))}</b><span>${E(T(st.skip ? 'sch_empty_hint_on' : 'sch_empty_hint', { unit: unit(g) }))}</span></div>`;
    } else {
      if (st.mode === 'standing' && !G.tot[i]) html += `<div class="sch-note sch-note-quiet">${E(T('sch_quiet_standing', { unit: unit(g) }))}</div>`;
      let view = rows;
      if (st.mode === 'standing' && st.onlyMoved) view = rows.filter(r => r.add);
      if (st.kind === 'album' && st.order === 'track') view = trackOrder(st, view.slice());
      const shown = st.showAll ? view : view.slice(0, SCH_PAGE);
      html += `<div class="sch-list" role="list">${shown.map((r, n) => rowHtml(st, G, r, rows, invs, stats, n)).join('')}</div>`;
      if (st.onlyMoved && st.mode === 'standing' && view.length < rows.length) html += `<div class="sch-hidden-n">${E(T('sch_hidden_quiet', { n: rows.length - view.length }))}</div>`;
      if (view.length > SCH_PAGE) html += `<button type="button" class="dc-btn dc-btn-plain dc-btn-sm sch-more" data-sch="more">${E(st.showAll ? T('dp_show_fewer') : T('dp_show_all', { n: view.length }))}</button>`;
      st._shown = shown;
    }
    // Fell off (idea 7): played last period, not this one
    if (st.mode === 'period' && i > 0 && G.pOrd[i - 1]) {
      const nowSet = new Set(G.pOrd[i] || []), M = model(st);
      const fell = [...G.pOrd[i - 1]].map((id, r) => ({ id, r: r + 1 })).filter(x => !nowSet.has(x.id));
      if (fell.length) html += `<details class="sch-fell"><summary>${E(T('sch_fell', { n: fell.length, unit: unit(g) }))}</summary><ul>${fell.map(x =>
        `<li><button type="button" class="sch-link" data-sch="openid" data-id="${x.id}">${E(M.items[x.id].name)}</button> <span>${E(T('sch_was', { n: x.r }))}</span></li>`).join('')}</ul></details>`;
    }
    body.innerHTML = html;
    // covers as they scroll into view
    if (st.imgObs) { try { st.imgObs.disconnect(); } catch (e) {} }
    if (st._shown && typeof loadImages === 'function') {
      const songs = [], rels = [];
      st._shown.forEach((r, n) => (r.it.kind === 'song' ? songs : rels).push(Object.assign({ imgId: `schImg-${st.kind}-${n}` }, r.it.img)));
      if (songs.length) st.imgObs = loadImages(songs, 'song');
      if (rels.length) st.imgObs = loadImages(rels, 'album');
    }
    // the slide: rows start where they were and glide to their new place
    if (opts && opts.slide && !reduceMotion()) {
      body.querySelectorAll('.sch-row').forEach(el => {
        const was = oldTops[el.dataset.id];
        if (was === undefined) { el.classList.add('sch-in'); return; }
        const dy = was - el.getBoundingClientRect().top;
        if (!dy) return;
        el.style.transition = 'none'; el.style.transform = `translateY(${dy}px)`;
        requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transition = ''; el.style.transform = ''; }));
      });
    }
  }

  /* ═══ COMPARE (idea 18) — the picked period next to another one ═════ */
  function paintCompare(st, G) {
    const bar = st.root.querySelector('.sch-cmpbar'), body = st.root.querySelector('.sch-body'), g = st.g;
    const a = st.idx, b = st.cmp, M = model(st);
    const yearBack = yearBefore(G, a);
    bar.hidden = false;
    bar.innerHTML = `<span class="sch-cmp-l">${E(T('sch_compare_with'))}</span>
      <button type="button" class="sch-arrow sch-arrow-sm" data-sch="cprev" aria-label="${E(T('sch_prev', { unit: unit(g) }))}" ${b <= 0 ? 'disabled' : ''}>‹</button>
      <b class="sch-cmp-when">${E(title(g, G.keys[b]))}</b>
      <button type="button" class="sch-arrow sch-arrow-sm" data-sch="cnext" aria-label="${E(T('sch_next', { unit: unit(g) }))}" ${b >= G.keys.length - 1 ? 'disabled' : ''}>›</button>
      <button type="button" class="sch-chip" data-sch="cpick" data-i="${prevFull(G, a)}">${E(T('sch_cmp_prev', { unit: unit(g) }))}</button>
      ${yearBack >= 0 && g !== 'year' ? `<button type="button" class="sch-chip" data-sch="cpick" data-i="${yearBack}">${E(T('sch_cmp_year'))}</button>` : ''}`;
    const la = listAt(G, st.mode, a), lb = listAt(G, st.mode, b);
    const ia = inv(la.map(x => x.id), G.n), ib = inv(lb.map(x => x.id), G.n);
    const both = la.filter(x => ib[x.id]).length;
    const col = (list, other, when, side) => `<div class="sch-cmp-col">
      <div class="sch-cmp-h">${E(shortLabel(g, G.keys[when]))}<small>${E(plays(G.tot[when] || 0))}</small></div>
      ${list.length ? list.slice(0, st.showAll ? 999 : 15).map(x => {
        const o = other[x.id], d = o ? o - x.rank : null;
        const tag = side === 'a' ? (d === null ? `<span class="sch-mv sch-mv-new">${E(T('sch_cmp_only'))}</span>` : d > 0 ? `<span class="sch-mv sch-mv-up">▲${d}</span>` : d < 0 ? `<span class="sch-mv sch-mv-down">▼${-d}</span>` : `<span class="sch-mv sch-mv-same">=</span>`)
          : (o ? `<span class="sch-mv sch-mv-same">#${o}</span>` : `<span class="sch-mv sch-mv-re">${E(T('sch_cmp_gone'))}</span>`);
        return `<div class="sch-cmp-row${st.focus === M.items[x.id].key ? ' is-focus' : ''}" data-id="${x.id}" data-cmp-id="${x.id}"><span class="sch-rank">${x.rank}</span>${tag}<span class="sch-cmp-n">${E(M.items[x.id].name)}</span><span class="sch-cmp-v">${x.value.toLocaleString()}</span></div>`;
      }).join('') : `<div class="sch-empty sch-empty-sm">${E(T('sch_empty_period', { unit: unit(g) }))}</div>`}
    </div>`;
    body.innerHTML = `<div class="sch-cmp-sum">${E(T('sch_cmp_both', { n: both }))}</div><div class="sch-cmp">${col(la, ib, a, 'a')}${col(lb, ia, b, 'b')}</div>` +
      (Math.max(la.length, lb.length) > 15 ? `<button type="button" class="dc-btn dc-btn-plain dc-btn-sm sch-more" data-sch="more">${E(st.showAll ? T('dp_show_fewer') : T('dp_show_all', { n: Math.max(la.length, lb.length) }))}</button>` : '');
  }
  function prevFull(G, i) { for (let j = i - 1; j >= 0; j--) if (!isEmpty(G, j)) return j; return Math.max(0, i - 1); }
  function yearBefore(G, i) {
    const k = G.keys[i];
    let want;
    if (G.g === 'month') want = (+k.slice(0, 4) - 1) + k.slice(4);
    else if (G.g === 'day') want = (+k.slice(0, 4) - 1) + k.slice(4);
    else if (G.g === 'week') { const d = parseDay(k); d.setDate(d.getDate() - 364); want = localDateStr(d); }
    else return -1;
    const at = G.at.get(want);
    return at === undefined ? -1 : at;
  }

  /* ═══ NUMBER ONES + RANK RACE (ideas 14, 15) ═════════════════════════ */
  function paintExtra(st, G) {
    const box = st.root.querySelector('.sch-extra');
    if (!box) return;
    const open = box.querySelector('.sch-no1-list.is-all') ? true : false;
    box.innerHTML = no1Html(st, G, open) + bumpHtml(st, G);
  }
  function reigns(st, G) {
    const out = [];
    for (let j = 0; j <= st.idx; j++) {
      const ord = st.mode === 'standing' ? G.stand[j] : G.pOrd[j];
      if (!ord) continue;
      const lead = ord[0], last = out[out.length - 1];
      if (last && last.id === lead) { last.end = j; last.n++; }
      else out.push({ id: lead, start: j, end: j, n: 1 });
    }
    // Standing: a reign also lasts through quiet periods
    if (st.mode === 'standing') out.forEach((r, x) => { const nx = out[x + 1]; r.n = (nx ? nx.start : st.idx + 1) - r.start; });
    return out;
  }
  function no1Html(st, G, all) {
    const R = reigns(st, G), M = model(st), g = st.g;
    if (!R.length) return '';
    const list = R.slice().reverse(), shown = all ? list : list.slice(0, 6);
    return `<section class="sch-sec">
      <div class="sch-sec-h"><h4>👑 ${E(T('sch_no1_title'))}</h4><span>${E((n1 => n1 === 1 ? T('sch_no1_sub_one') : T('sch_no1_sub', { n: n1 }))(new Set(R.map(r => r.id)).size))}</span></div>
      <ol class="sch-no1-list${all ? ' is-all' : ''}">${shown.map((r, x) => {
        const cur = x === 0;
        return `<li class="${cur ? 'is-cur' : ''}"><button type="button" class="sch-no1" data-sch="goto" data-i="${r.start}">
          <span class="sch-no1-when">${E(shortLabel(g, G.keys[r.start]))}</span>
          <span class="sch-no1-name">${E(M.items[r.id].name)}</span>
          <span class="sch-no1-len">${E(cur ? T('sch_no1_holding', { n: r.n, units: units(g, r.n) }) : T('sch_no1_held', { n: r.n, units: units(g, r.n) }))}</span>
        </button></li>`;
      }).join('')}</ol>
      ${list.length > 6 ? `<button type="button" class="dc-btn dc-btn-plain dc-btn-sm" data-sch="no1all">${E(all ? T('dp_show_fewer') : T('dp_show_all', { n: list.length }))}</button>` : ''}
    </section>`;
  }

  function bumpHtml(st, G) {
    const M = model(st), g = st.g;
    const steps = [];
    for (let j = st.idx; j >= 0 && steps.length < SCH_BUMP_STEPS; j--) if (!isEmpty(G, j)) steps.unshift(j);
    if (steps.length < 2) return '';
    const invs = steps.map(j => inv(st.mode === 'standing' ? G.stand[j] : G.pOrd[j], G.n));
    const top = listAt(G, st.mode, steps[steps.length - 1]).slice(0, SCH_BUMP_LINES).map(x => x.id);
    const focusId = st.focus != null ? M.items.findIndex(it => it.key === st.focus) : -1;
    if (focusId >= 0 && !top.includes(focusId)) top.push(focusId);
    const maxR = Math.max(SCH_BUMP_LINES, ...top.map(id => Math.min(10, Math.max(...invs.map(a => a[id] || 0)))));
    const W = 600, H = 34 + maxR * 22, L = 34, Rm = 26;
    const x = j => L + j / (steps.length - 1) * (W - L - Rm), y = r => 18 + (r - 1) * 22;
    let grid = '';
    for (let r = 1; r <= maxR; r++) grid += `<text x="${L - 10}" y="${y(r) + 4}" class="sch-bump-r">#${r}</text><line x1="${L}" x2="${W - Rm}" y1="${y(r)}" y2="${y(r)}" class="sch-bump-g"/>`;
    const axis = steps.map((j, n) => (n === 0 || n === steps.length - 1 || n % Math.ceil(steps.length / 4) === 0)
      ? `<text x="${x(n)}" y="${H - 4}" class="sch-bump-x" text-anchor="${n === 0 ? 'start' : n === steps.length - 1 ? 'end' : 'middle'}">${E(shortLabel(g, G.keys[j]))}</text>` : '').join('');
    const lines = top.map((id, c) => {
      const col = SCH_LINE_COLORS[c % SCH_LINE_COLORS.length];
      let d = '', pen = false, dots = '';
      invs.forEach((a, n) => {
        const r = a[id];
        if (!r || r > maxR) { pen = false; return; }
        d += (pen ? 'L' : 'M') + x(n).toFixed(1) + ' ' + y(r); pen = true;
        dots += `<circle cx="${x(n).toFixed(1)}" cy="${y(r)}" r="3.2" fill="${col}"/>`;
      });
      const on = st.focus === M.items[id].key;
      return `<g class="sch-bump-l${on ? ' is-on' : ''}" data-sch="bumpline" data-key="${E(M.items[id].key)}" style="--c:${col}"><title>${E(M.items[id].name)}</title><path d="${d}" fill="none" stroke="${col}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="transparent" stroke-width="14"/>${dots}</g>`;
    }).join('');
    const legend = top.map((id, c) => `<button type="button" class="sch-leg${st.focus === M.items[id].key ? ' is-on' : ''}" data-sch="bumpline" data-key="${E(M.items[id].key)}" style="--c:${SCH_LINE_COLORS[c % SCH_LINE_COLORS.length]}"><i></i>${E(M.items[id].name)}</button>`).join('');
    return `<section class="sch-sec">
      <div class="sch-sec-h"><h4>🏁 ${E(T('sch_bump_title'))}</h4><span>${E(T('sch_bump_sub', { n: steps.length, units: units(g, steps.length) }))}</span></div>
      <div class="sch-bump-wrap${st.focus ? ' has-focus' : ''}"><svg class="sch-bump" viewBox="0 0 ${W} ${H}" role="img" aria-label="${E(T('sch_bump_title'))}">${grid}${lines}${axis}</svg></div>
      <div class="sch-legend">${legend}</div>
    </section>`;
  }

  /* ═══ RIBBON (idea 5) — plays per period; tap or drag to jump ═══════ */
  function drawRibbon(st) {
    const svg = st.root.querySelector('.sch-rib');
    if (!svg) return;
    const G = gran(st, st.g), K = G.keys.length, H = 40;
    if (!K) return;
    const max = Math.max(1, ...G.tot);
    svg.setAttribute('viewBox', `0 0 ${K} ${H}`);
    const gap = K > 160 ? 0 : 0.22;
    let bars = '';
    for (let j = 0; j < K; j++) {
      const v = G.tot[j];
      const h = v ? Math.max(4, Math.sqrt(v / max) * (H - 4)) : 1.5;
      bars += `<rect x="${j + gap / 2}" y="${H - h}" width="${1 - gap}" height="${h}" class="${v ? 'sch-rib-b1' : 'sch-rib-b0'}"/>`;
    }
    svg.innerHTML = bars + `<rect class="sch-rib-mark" y="0" height="${H}"/>`;
    st.root.querySelector('.sch-rib-a').textContent = shortLabel(st.g, G.keys[0]);
    st.root.querySelector('.sch-rib-b').textContent = shortLabel(st.g, G.keys[K - 1]);
    moveRibbonMark(st);
  }
  function moveRibbonMark(st) {
    const svg = st.root.querySelector('.sch-rib'), m = svg && svg.querySelector('.sch-rib-mark');
    if (!m) return;
    const G = gran(st, st.g), K = G.keys.length, w = Math.max(1, K / 120);
    m.setAttribute('x', Math.min(K - w, Math.max(0, st.idx + 0.5 - w / 2)));
    m.setAttribute('width', w);
    svg.setAttribute('aria-valuemin', 1); svg.setAttribute('aria-valuemax', K); svg.setAttribute('aria-valuenow', st.idx + 1);
    svg.setAttribute('aria-valuetext', title(st.g, G.keys[st.idx]));
  }
  function ribbonIndex(st, e) {
    const svg = st.root.querySelector('.sch-rib'), r = svg.getBoundingClientRect(), G = gran(st, st.g);
    return Math.min(G.keys.length - 1, Math.max(0, Math.floor((e.clientX - r.left) / r.width * G.keys.length)));
  }

  /* ═══ MOVING AROUND ══════════════════════════════════════════════════ */
  function go(st, j, opts) {
    const G = gran(st, st.g);
    st.idx = Math.max(0, Math.min(G.keys.length - 1, j));
    st.skipped = (opts && opts.skipped) || null;
    if (!(opts && opts.keepOpen)) st.open = null;
    paint(st, opts);
  }
  // One step back or forward, over empty periods when Skip empty is on
  function step(st, dir, opts) {
    const G = gran(st, st.g), K = G.keys.length;
    let j = st.idx + dir, n = 0, a = -1, b = -1;
    if (st.skip) while (j > 0 && j < K - 1 && isEmpty(G, j)) { n++; if (a < 0 || j < a) a = j; if (b < 0 || j > b) b = j; j += dir; }
    if (j < 0 || j >= K) return false;
    go(st, j, Object.assign({ skipped: n ? { n, a, b } : null, slide: true }, opts));
    return true;
  }
  function setGran(st, g) {
    if (st.g === g) return;
    const G0 = gran(st, st.g), k0 = G0.keys[st.idx];
    // keep about the same date: the new period holding the old one's first day
    const day = firstDayOf(k0, st.g);
    st.g = g; st.cmp = null; st.showAll = false; st.open = null; st.skipped = null;
    const G = gran(st, g);
    let j = G.at.get(keyForDate(g, day));
    if (j === undefined) j = lastFull(G);
    if (st.skip && isEmpty(G, j)) j = lastFull(G, j);
    st.idx = j; savePrefs(st);
    renderShell(st); paint(st);
  }

  /* ▶ Play through (idea 17) */
  function stopPlay(st) { if (st && st.timer) { clearInterval(st.timer); st.timer = null; if (st.root && st.root.querySelector('.sch')) paintPlayBtn(st); } }
  function paintPlayBtn(st) {
    const pb = st.root.querySelector('[data-sch="play"]');
    if (!pb) return;
    pb.setAttribute('aria-pressed', !!st.timer);
    pb.querySelector('.sch-play-i').textContent = st.timer ? '❚❚' : '▶';
    pb.querySelector('.sch-play-l').textContent = T(st.timer ? 'sch_pause' : 'sch_play');
  }
  function togglePlay(st) {
    if (st.timer) { stopPlay(st); paint(st); return; }
    const G = gran(st, st.g);
    if (st.idx >= lastFull(G)) go(st, 0);          // at the end: start from the first play
    st.timer = setInterval(() => {
      if (!st.root.isConnected || !step(st, 1, { fast: true })) { stopPlay(st); paint(st); }
      else if (st.idx >= G.keys.length - 1) { stopPlay(st); paint(st); }
    }, 1100 / st.speed);
    paintPlayBtn(st);
  }

  /* ═══ CLICKS ═════════════════════════════════════════════════════════ */
  function stOf(el) { const w = el.closest('.sch'); return w ? ST[w.dataset.kind] : null; }
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('[data-sch]');
    if (!b || !b.closest('.sch')) return;
    const st = stOf(b); if (!st) return;
    const act = b.dataset.sch, G = gran(st, st.g);
    if (act !== 'play' && act !== 'speed' && act !== 'row' && act !== 'bumpline' && act !== 'jdate') stopPlay(st);
    switch (act) {
      case 'g': setGran(st, b.dataset.v); break;
      case 'mode': if (st.mode !== b.dataset.v) { st.mode = b.dataset.v; st.open = null; st.stats = {}; savePrefs(st); renderShell(st); paint(st); } break;
      case 'items':
        if (st.items !== b.dataset.v) {
          const k = G.keys[st.idx]; st.items = b.dataset.v; st.open = null; st.focus = null; st.cmp = null; st.stats = {};
          const G2 = gran(st, st.g); const j = G2.at.get(k); st.idx = j === undefined ? lastFull(G2) : j;
          renderShell(st); paint(st);
        } break;
      case 'order': st.order = b.dataset.v; renderShell(st); paint(st); break;
      case 'prev': step(st, -1); break;
      case 'next': step(st, 1); break;
      case 'play': togglePlay(st); break;
      case 'speed': st.speed = st.speed === 4 ? 1 : st.speed * 2; b.textContent = st.speed + '×'; savePrefs(st);
        if (st.timer) { stopPlay(st); togglePlay(st); } break;
      case 'jfirst': go(st, 0, { slide: true }); break;
      case 'jlast': st.sameDate = null; go(st, lastFull(G), { slide: true }); break;
      case 'jbusy': { let best = 0; G.tot.forEach((v, j) => { if (v > G.tot[best]) best = j; }); go(st, best, { slide: true }); break; }
      case 'skip': st.skip = !st.skip; b.setAttribute('aria-pressed', st.skip); st.skipped = null; savePrefs(st); paint(st); break;
      case 'noskip': st.skip = false; st.skipped = null; savePrefs(st); renderShell(st); paint(st); break;
      case 'moved': st.onlyMoved = !st.onlyMoved; b.setAttribute('aria-pressed', st.onlyMoved); savePrefs(st); paint(st); break;
      case 'cmp':
        st.cmp = st.cmp == null ? (yearBefore(G, st.idx) >= 0 && st.g !== 'week' && st.g !== 'day' ? yearBefore(G, st.idx) : prevFull(G, st.idx)) : null;
        st.showAll = false; b.setAttribute('aria-pressed', st.cmp != null); paint(st); break;
      case 'cprev': case 'cnext': {
        let j = st.cmp + (act === 'cprev' ? -1 : 1);
        if (st.skip) while (j > 0 && j < G.keys.length - 1 && isEmpty(G, j)) j += act === 'cprev' ? -1 : 1;
        st.cmp = Math.max(0, Math.min(G.keys.length - 1, j)); paint(st); break;
      }
      case 'cpick': st.cmp = +b.dataset.i; paint(st); break;
      case 'more': st.showAll = !st.showAll; paint(st, { fast: true }); break;
      case 'row': {
        const row = b.closest('.sch-row'), key = row && row.dataset.key;
        st.open = st.open === key ? null : key; paint(st, { fast: true, keepOpen: true });
        break;
      }
      case 'openitem': case 'openid': {
        const M = model(st);
        const it = act === 'openid' ? M.items[+b.dataset.id] : M.items[+b.closest('.sch-row').dataset.id];
        if (it) { if (it.kind === 'song') openSongModal(it.key); else openAlbumModal(it.key); }
        break;
      }
      case 'gopeak': go(st, +b.dataset.i, { keepOpen: true, slide: true }); break;
      case 'goto': go(st, +b.dataset.i, { slide: true }); break;
      case 'follow': { const key = b.closest('.sch-row').dataset.key; st.focus = st.focus === key ? null : key; paint(st, { keepOpen: true }); break; }
      case 'bumpline': { const key = b.dataset.key; st.focus = st.focus === key ? null : key; paint(st, { keepOpen: true }); break; }
      case 'no1all': { const box = st.root.querySelector('.sch-extra'); const open = !box.querySelector('.sch-no1-list.is-all'); box.innerHTML = no1Html(st, G, open) + bumpHtml(st, G); break; }
      case 'mainchart': {
        const k = G.keys[st.idx];
        if (st.kind === 'artist') goToPeriodFromArtistModal(st.g, k, 'artists');
        else goToPeriodFromAlbumModal(st.g, k, typeof releaseTypeOf === 'function' ? releaseTypeOf(st.name, st.credit) : 'album');
        break;
      }
      case 'playlist': makePlaylist(st); break;
      case 'share': shareImage(st, b); break;
    }
  });
  // the date box
  document.addEventListener('change', e => {
    const inp = e.target.closest && e.target.closest('.sch-date-in');
    if (!inp || !inp.value) return;
    const st = stOf(inp); if (!st) return;
    stopPlay(st);
    const G = gran(st, st.g), k = keyForDate(st.g, inp.value);
    let j = G.at.get(k);
    if (j === undefined) j = k < G.keys[0] ? 0 : G.keys.length - 1;
    go(st, j, { slide: true });
  });
  // ← → step through periods while the tab has focus (not in a text box)
  document.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const w = e.target.closest && e.target.closest('.sch');
    if (!w || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.closest('.dc-seg')) return;
    const st = ST[w.dataset.kind]; if (!st) return;
    e.preventDefault(); stopPlay(st); step(st, e.key === 'ArrowLeft' ? -1 : 1);
  });
  // the ribbon: tap, drag, and a hover readout
  document.addEventListener('pointerdown', e => {
    const svg = e.target.closest && e.target.closest('.sch-rib');
    if (!svg) return;
    const st = stOf(svg); if (!st) return;
    stopPlay(st);
    svg.setPointerCapture && svg.setPointerCapture(e.pointerId);
    st._drag = true;
    const j = ribbonIndex(st, e); if (j !== st.idx) go(st, j, { fast: true });
  });
  document.addEventListener('pointermove', e => {
    const svg = e.target.closest && e.target.closest('.sch-rib');
    if (!svg) return;
    const st = stOf(svg); if (!st) return;
    const G = gran(st, st.g), j = ribbonIndex(st, e);
    const h = st.root.querySelector('.sch-rib-h');
    if (h) h.textContent = shortLabel(st.g, G.keys[j]) + ' · ' + plays(G.tot[j]);
    if (st._drag && j !== st.idx) { if (!st._raf) st._raf = requestAnimationFrame(() => { st._raf = 0; go(st, j, { fast: true }); }); }
  });
  function endDrag(e) {
    const svg = e.target.closest && e.target.closest('.sch-rib');
    const st = svg && stOf(svg);
    if (st && st._drag) { st._drag = false; paint(st); }
  }
  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);
  document.addEventListener('pointerleave', e => {
    const svg = e.target.closest && e.target.closest('.sch-rib');
    const st = svg && stOf(svg); const h = st && st.root.querySelector('.sch-rib-h'); if (h) h.textContent = '';
  }, true);
  // keyboard on the ribbon slider
  document.addEventListener('keydown', e => {
    const svg = e.target.closest && e.target.closest('.sch-rib');
    if (!svg || (e.key !== 'Home' && e.key !== 'End')) return;
    const st = stOf(svg); if (!st) return;
    e.preventDefault(); go(st, e.key === 'Home' ? 0 : lastFull(gran(st, st.g)));
  });

  /* ═══ PLAYLIST + SHARE (idea 20) ═════════════════════════════════════ */
  function currentList(st) {
    const G = gran(st, st.g);
    let rows = rowsFor(st, G, st.idx);
    if (st.mode === 'standing' && st.onlyMoved) rows = rows.filter(r => r.add);
    return rows;
  }
  function makePlaylist(st) {
    const rows = currentList(st);
    const tracks = rows.map(r => {
      const it = r.it;
      if (it.kind === 'song') return { title: it.name, artist: it.artist, album: it.album };
      // a release: its most played song
      let best = null, n = 0; it.songs.forEach((c, s) => { if (c > n) { n = c; best = s; } });
      return best ? { title: best, artist: it.artist, album: it.album } : null;
    }).filter(Boolean);
    const G = gran(st, st.g), when = title(st.g, G.keys[st.idx]);
    const label = T('sch_pl_label', { name: st.name, when });
    if (typeof dcOpenPlaylistPicker === 'function') dcOpenPlaylistPicker(tracks, label, label);
  }

  /* The share picture: a card drawn off screen from the list on screen,
     saved (or shared on a phone) with the Filmstrip's _wvSaveImage */
  function shareImage(st, btn) {
    if (typeof _wvSaveImage !== 'function') return;
    const G = gran(st, st.g), rows = currentList(st).slice(0, 10), g = st.g;
    const modeName = st.mode === 'standing' ? T('sch_mode_standing') : T('sch_mode_period_' + g);
    const card = document.createElement('div');
    card.className = 'sch-card';
    card.innerHTML = `<div class="sch-card-top"><div class="sch-card-eyebrow">${E(T('dp_tab_songchart'))} · ${E(modeName)}</div>
        <div class="sch-card-title">${E(st.name)}</div>
        <div class="sch-card-when">${E(title(g, G.keys[st.idx]))}</div></div>
      <div class="sch-card-list">${rows.map(r => `<div class="sch-card-row${r.rank === 1 ? ' is-1' : ''}">
        <span class="sch-card-rank">${r.rank}</span>
        <span class="sch-card-mv sch-card-mv-${r.mv}">${r.mv === 'new' ? E(T('badge_new')) : r.mv === 're' ? E(T('badge_re')) : r.mv === 'same' ? '=' : (r.mv === 'up' ? '▲' : '▼') + Math.abs(r.was - r.rank)}</span>
        <span class="sch-card-name">${E(r.it.name)}</span>
        <span class="sch-card-val">${r.value.toLocaleString()}</span></div>`).join('')}</div>
      <div class="sch-card-foot">${E(plays(G.tot[st.idx] || 0))}<span>dankcharts.fm</span></div>`;
    const holder = document.createElement('div');
    holder.className = 'sch-card-holder';
    holder.appendChild(card);
    document.body.appendChild(holder);
    const name = ('song-chart-' + st.name).replace(/[^a-z0-9]+/gi, '-').slice(0, 60);
    Promise.resolve(_wvSaveImage(card, btn, name, null, { share: true })).finally(() => holder.remove());
  }

  /* What's New card button: the most played artist (with 2+ songs) opens
     on this tab */
  function openForTopArtist() {
    if (!allPlays || !allPlays.length) return;
    const n = new Map(), songs = new Map();
    for (const p of allPlays) for (const a of p.artists) {
      n.set(a, (n.get(a) || 0) + 1);
      let s = songs.get(a); if (!s) songs.set(a, s = new Set());
      if (s.size < 2) s.add(p.title);
    }
    const best = [...n.entries()].filter(([a]) => songs.get(a).size > 1).sort((x, y) => y[1] - x[1])[0];
    if (!best) return;
    openArtistModal(best[0]);
    if (window.dcPanelShowTab) window.dcPanelShowTab('artist', 'songchart');
  }

  // for tests, the What's New card and other files
  window.dcSongChart = { state: ST, gran, model };
  window.dcSongChartOpenTop = openForTopArtist;
})();
