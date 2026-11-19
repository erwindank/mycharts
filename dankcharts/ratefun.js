/* ===========================================================================
   RATING FUN — dankcharts.fm (RATING-FUN-PLAN.md, 2026-11-19)
   ===========================================================================
   The "make rating fun" ideas the user picked from the Rating Fun Ideas
   artifact: faster ways to rate (Rate Rush, Agree with your listening,
   rating what's playing, the album speed-run), rewards (daily goal and
   streak, critic levels and badges, discography plaques, the weekly
   report), sharing (critic card, one-line reviews) and smarter scores
   (settle the gap, your personal scale, score history and re-rates,
   well-timed nudges).

   Everything here reads the normalised allPlays and _ratings (app.js), so
   it works the same for Last.fm, Google Sheets and uploaded files.

   What it adds to _ratings (saved and synced with the ratings doc, merged
   in rfMerge from dcMergeRatings):
     hist  { 's:<songKey>' | 'a:<albumKey>': [{t, s}] }  score history.
           Objects, not [t, s] pairs: Firestore cannot hold nested arrays.
     fun   the game side: daily goal, days rated, badges, settled gaps…
           (see _rfFun for the fields)

   Prefix: rf. CSS: .rf-* at the end of style.css.
   =========================================================================== */

const RF_DAY_MS = 86400000;
// Score changes this close together are one change (a slider being dragged,
// a typo fixed): the newest replaces the last point instead of adding one
const RF_HIST_MERGE_MS = 10 * 60 * 1000;
const RF_HIST_MAX = 24;   // points kept per song / album

// ── Store ─────────────────────────────────────────────────────────────────

// The history map, made on first use
function _rfHistStore() {
  if (!_ratings.hist || typeof _ratings.hist !== 'object') _ratings.hist = {};
  return _ratings.hist;
}

/* The game side of rating, made on first use:
     goal     daily goal (5 / 10 / 25), 0 = not set yet
     days     { 'YYYY-MM-DD': how many things you scored that day }
     dayKeys  { d: today, k: [keys scored today] } so one song dragged
              across a slider counts once
     badges   { badgeId: when it was earned }
     settled  { key: the gap you kept, so Settle the gap doesn't ask again }
     ok       { key: when you said "Still a 9.5? Yes" }
     told     { kind: last day / week told } for the notifications
     funTs    last change, for the merge                                   */
function _rfFun() {
  if (!_ratings.fun || typeof _ratings.fun !== 'object') _ratings.fun = {};
  const f = _ratings.fun;
  for (const k of ['days', 'badges', 'settled', 'ok', 'told']) if (!f[k] || typeof f[k] !== 'object') f[k] = {};
  if (!f.dayKeys || typeof f.dayKeys !== 'object') f.dayKeys = { d: '', k: [] };
  return f;
}
function _rfFunTouch() { _rfFun().funTs = Date.now(); }

// Today in the user's time zone, as the rest of the app writes days
function rfToday() { return localDateStr(tzNow()); }
function rfDayOf(ms) { return localDateStr(tzDate(new Date(ms))); }

// ── Song → albums (for album history when a track changes) ───────────────
// From the same per-album track index the scores use, turned around once
let _rfSongAlbIdx = null, _rfSongAlbFor = null;
function rfAlbumsOfSong(sk) {
  const memo = _rtMemoFresh();
  const idx = _rtTrackIndex(memo);
  if (_rfSongAlbFor !== idx) {
    _rfSongAlbIdx = new Map();
    for (const [ak, songs] of idx) {
      if (!ak || ak.startsWith('—|||') || ak.startsWith('|||')) continue;
      for (const k of songs.keys()) {
        let a = _rfSongAlbIdx.get(k);
        if (!a) _rfSongAlbIdx.set(k, a = []);
        a.push(ak);
      }
    }
    _rfSongAlbFor = idx;
  }
  return _rfSongAlbIdx.get(sk) || [];
}

// ── Scores, the one way in ──────────────────────────────────────────────
// The score as it stands (yours only; Listening Scores are not history)
function rfOwnScore(kind, key) {
  if (kind === 'album') { const r = ratingAlbumScore(key); return r ? r.score : null; }
  return ratingSongScore(key);
}

/* Call BEFORE a score is written: an item that has a score but no history
   yet gets its current score as the first point, dated when it was last
   edited, so the first change after this update still shows where it came
   from. For a song, its albums are seeded too (their score moves with it). */
function rfBefore(kind, key) {
  const seed = (k, hk) => {
    const H = _rfHistStore();
    if (H[hk] && H[hk].length) return;
    const s = rfOwnScore(k, hk.slice(2));
    if (s == null) return;
    let ts = 0;
    if (k === 'song') ts = _ratings.songs[hk.slice(2)]?.ts || 0;
    else {
      ts = _ratings.albums[hk.slice(2)]?.ts || 0;
      for (const tr of ratingAlbumTrackKeys(hk.slice(2))) ts = Math.max(ts, _ratings.songs[tr.key]?.ts || 0);
    }
    H[hk] = [{ t: ts || Date.now() - RF_HIST_MERGE_MS - 1, s }];
  };
  try {
    seed(kind, (kind === 'album' ? 'a:' : 's:') + key);
    if (kind === 'song') for (const ak of rfAlbumsOfSong(key)) seed('album', 'a:' + ak);
  } catch (e) { /* history is a bonus, never block a score */ }
}

// Adds the current score to an item's history (see RF_HIST_MERGE_MS)
function _rfHistPush(hk, s) {
  const H = _rfHistStore();
  const arr = H[hk] || (H[hk] = []);
  const now = Date.now();
  const last = arr[arr.length - 1];
  if (s == null) return;
  if (last && last.s === s) return;
  if (last && now - last.t < RF_HIST_MERGE_MS) {
    // Same moment: move the last point, and drop it if it went back to the
    // one before (dragged away and back is no change at all)
    last.s = s; last.t = now;
    const prev = arr[arr.length - 2];
    if (prev && prev.s === s) arr.pop();
  } else {
    arr.push({ t: now, s });
  }
  if (arr.length > RF_HIST_MAX) arr.splice(0, arr.length - RF_HIST_MAX);
}

/* Call AFTER a score is written (and ratingsPersist has run, so the memo is
   fresh). Records history for the item (and a song's albums), counts it
   toward today's goal, and lets the rest of this file react. */
let _rfAfterTimer = null;
function rfScored(kind, key) {
  try {
    const s = rfOwnScore(kind, key);
    _rfHistPush((kind === 'album' ? 'a:' : 's:') + key, s);
    if (kind === 'song') for (const ak of rfAlbumsOfSong(key)) _rfHistPush('a:' + ak, rfOwnScore('album', ak));
    if (s != null) _rfCountToday(kind, key);
  } catch (e) { console.warn('[dankcharts] rating fun:', e); }
  // Badges and the like once the user stops for a moment
  clearTimeout(_rfAfterTimer);
  _rfAfterTimer = setTimeout(() => { try { rfAfterScoring(); } catch (e) {} }, 900);
}

// Today's count: each song or album once per day
function _rfCountToday(kind, key) {
  const f = _rfFun(), d = rfToday(), id = (kind === 'album' ? 'a:' : 's:') + key;
  if (f.dayKeys.d !== d) f.dayKeys = { d, k: [] };
  if (f.dayKeys.k.includes(id)) return;
  f.dayKeys.k.push(id);
  f.days[d] = (f.days[d] || 0) + 1;
  // Keep about a year and a half of days
  const ks = Object.keys(f.days);
  if (ks.length > 550) ks.sort().slice(0, ks.length - 550).forEach(k => delete f.days[k]);
  _rfFunTouch();
}

/* Gives a song a quick score from one of the fast ways to rate (taps, the
   player, Rate Rush, Agree…). A song with a full rubric keeps its criteria
   (they come back if you switch to Detailed); the tap becomes its score. */
function rfSetSong(key, val) {
  const v = ratingClamp(val);
  if (v == null || !key) return;
  rfBefore('song', key);
  const e = _ratingEnsureEntry('song', key);
  e.m = 'quick'; e.q = v; e.ts = Date.now();
  ratingsPersist();
  rfScored('song', key);
}

// What runs after a burst of scoring (filled in by later steps)
const _rfAfterHooks = [];
function rfAfterScoring() { for (const f of _rfAfterHooks) { try { f(); } catch (e) { console.warn('[dankcharts] rating fun hook:', e); } } }

// ── Merge (called from dcMergeRatings, before it saves) ─────────────────
// History: every point from both sides, one per moment, newest kept.
// fun: days by the higher count, badges by the earlier date, the rest by
// whichever side changed last.
function rfMerge(remote) {
  let changed = false;
  if (remote && remote.hist && typeof remote.hist === 'object') {
    const H = _rfHistStore();
    for (const [k, arr] of Object.entries(remote.hist)) {
      if (!Array.isArray(arr)) continue;
      const mine = H[k] || [];
      const by = new Map(mine.map(p => [p.t, p]));
      let add = false;
      for (const p of arr) if (p && typeof p.t === 'number' && !by.has(p.t)) { by.set(p.t, p); add = true; }
      if (add) { H[k] = [...by.values()].sort((a, b) => a.t - b.t).slice(-RF_HIST_MAX); changed = true; }
    }
  }
  if (remote && remote.fun && typeof remote.fun === 'object') {
    const f = _rfFun(), r = remote.fun;
    for (const [d, n] of Object.entries(r.days || {})) if ((n || 0) > (f.days[d] || 0)) { f.days[d] = n; changed = true; }
    for (const [b, ts] of Object.entries(r.badges || {})) if (!f.badges[b] || ts < f.badges[b]) { f.badges[b] = ts; changed = true; }
    if ((r.funTs || 0) > (f.funTs || 0)) {
      for (const k of ['goal', 'settled', 'ok', 'told', 'dayKeys']) if (r[k] !== undefined) f[k] = r[k];
      f.funTs = r.funTs;
      changed = true;
    }
  }
  return changed;
}

// ── Score history line (19) ─────────────────────────────────────────────
function rfHist(kind, key) {
  const arr = (_ratings.hist || {})[(kind === 'album' ? 'a:' : 's:') + key];
  return Array.isArray(arr) ? arr : [];
}

/* A small line of every score an item has had, on its Rating tab. Shown
   once there are two points; the last point is the score now. */
function rfHistHTML(kind, key) {
  const pts = rfHist(kind, key).filter(p => typeof p.s === 'number');
  if (pts.length < 2) return '';
  const W = 600, H = 96, pad = 8;
  const t0 = pts[0].t, t1 = pts[pts.length - 1].t, span = Math.max(1, t1 - t0);
  // Even spacing reads better than real time when two edits were minutes
  // apart and the next a year later; real dates are in the labels
  const x = i => pad + (pts.length === 1 ? 0 : i / (pts.length - 1)) * (W - pad * 2);
  const y = s => pad + (1 - s / RATING_MAX) * (H - pad * 2);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.s).toFixed(1)}`).join(' ');
  const first = pts[0], last = pts[pts.length - 1];
  const d = Math.round((last.s - first.s) * 10) / 10;
  const dots = pts.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.s).toFixed(1)}" r="${i === pts.length - 1 ? 4 : 2.6}" class="rf-hist-dot ${ratingBand(p.s).cls}"><title>${esc(ratingFmt(p.s))} · ${esc(fmt(tzDate(new Date(p.t))))}</title></circle>`).join('');
  return `<div class="rf-hist">
    <div class="rf-hist-head">
      <span class="ao-kicker">${esc(t('rf_hist_title'))}</span>
      <span class="rf-hist-sum">${ratingChip(first.s)}<span class="rf-hist-arrow" aria-hidden="true">→</span>${ratingChip(last.s)}
        <b class="rf-hist-d ${d > 0 ? 'is-up' : d < 0 ? 'is-down' : ''}">${d > 0 ? '+' : d < 0 ? '−' : '±'}${ratingFmt(Math.abs(d))}</b></span>
    </div>
    <svg class="rf-hist-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('rf_hist_aria', { n: pts.length }))}">
      <line x1="${pad}" x2="${W - pad}" y1="${y(5).toFixed(1)}" y2="${y(5).toFixed(1)}" class="rf-hist-mid"/>
      <path d="${path}" class="rf-hist-line" fill="none"/>
      ${dots}
    </svg>
    <div class="rf-hist-dates"><span>${esc(fmt(tzDate(new Date(first.t))))}</span><span>${esc(t(pts.length === 2 ? 'rf_hist_change_one' : 'rf_hist_changes', { n: pts.length - 1 }))}</span><span>${esc(fmt(tzDate(new Date(last.t))))}</span></div>
  </div>`;
}

window.rfBefore = rfBefore;
window.rfScored = rfScored;
window.rfMerge = rfMerge;
window.rfSetSong = rfSetSong;

// ── One-line reviews (16) ───────────────────────────────────────────────
// A short take (RF_LINE_MAX characters) and an emoji beside a score, on the
// song or album entry as line / emo. Shown on the Rating tabs, in Recently
// rated, on the album score picture and on the critic card.
const RF_LINE_MAX = 140;
const RF_EMOJIS = ['😭', '🔥', '😍', '🤯', '✨', '🎧', '💃', '😌', '🤔', '😴', '💀', '👎'];

// The line as shown: emoji + quoted text. small = one line, cut with …
function rfLineHTML(e, small) {
  if (!e || !(e.line || '').trim()) return '';
  return `<span class="rf-line${small ? ' rf-line--sm' : ''}">${e.emo ? `<span class="rf-line-emo" aria-hidden="true">${esc(e.emo)}</span>` : ''}<q>${esc(String(e.line).trim())}</q></span>`;
}

// The editor part: emoji row + the line, above the longer note
function rfLineEditHTML(kind, key, e) {
  const line = e.line || '';
  return `<div class="rf-line-edit">
    <label class="rt-note-label" for="rfLine">${esc(t('rf_line_label'))} <span class="rt-note-opt">${esc(t('rte_note_opt'))}</span></label>
    <div class="rf-emo-row" role="group" aria-label="${esc(t('rf_line_emo'))}">
      ${RF_EMOJIS.map(m => `<button type="button" class="rf-emo${e.emo === m ? ' is-on' : ''}" data-rf-emo="${m}" aria-pressed="${e.emo === m}">${m}</button>`).join('')}
    </div>
    <div class="rf-line-box">
      <input id="rfLine" class="dc-input rf-line-in" maxlength="${RF_LINE_MAX}" placeholder="${esc(t(kind === 'album' ? 'rf_line_ph_album' : 'rf_line_ph_song'))}"
             data-rf-kind="${kind}" data-rf-key="${esc(key)}" value="${esc(line)}">
      <span class="rf-line-left" id="rfLineLeft">${RF_LINE_MAX - line.length}</span>
    </div>
  </div>`;
}

// Wires the emoji buttons and the line (called from _ratingBindInputs)
function rfBindLine(root) {
  const inp = root.querySelector('.rf-line-in');
  if (!inp) return;
  const entry = () => _ratingEnsureEntry(inp.dataset.rfKind, inp.dataset.rfKey);
  inp.addEventListener('input', () => {
    const e = entry();
    e.line = inp.value.slice(0, RF_LINE_MAX);
    e.ts = Date.now();
    const left = root.querySelector('#rfLineLeft');
    if (left) { left.textContent = RF_LINE_MAX - e.line.length; left.classList.toggle('is-low', e.line.length > RF_LINE_MAX - 15); }
    ratingsPersist();
    _rfFunTouch();
  });
  root.querySelectorAll('[data-rf-emo]').forEach(btn => btn.addEventListener('click', () => {
    const e = entry(), m = btn.dataset.rfEmo;
    e.emo = e.emo === m ? '' : m;   // a second tap takes it off
    e.ts = Date.now();
    root.querySelectorAll('[data-rf-emo]').forEach(b => { const on = b.dataset.rfEmo === e.emo; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
    ratingsPersist();
  }));
}

// ── Agree with your listening (2) ────────────────────────────────────────
/* Under a Listening Score: lower / agree / higher. One tap turns the
   automatic score into one of yours.
     song   the song gets a quick score (the Listening Score, ±0.5)
     album  each played track you haven't scored gets ITS song's Listening
            Score (±0.5), so the album comes out at the same number and is
            fully yours. Tracks with no Listening Score (barely played,
            too new) get the album's. Aspects are left for you.            */
const RF_AGREE_STEP = 0.5;

function rfAgreeHTML(kind, key, ls) {
  if (ls == null) return '';
  const k = esc(JSON.stringify(key));
  const lo = ratingClamp(ls - RF_AGREE_STEP), hi = ratingClamp(ls + RF_AGREE_STEP);
  const n = kind === 'album' ? ratingAlbumTrackKeys(key).filter(tr => ratingSongScore(tr.key) == null).length : 0;
  return `<div class="rf-agree" role="group" aria-label="${esc(t('rf_agree_q'))}">
    <span class="rf-agree-q">${esc(t('rf_agree_q'))}</span>
    <span class="rf-agree-btns">
      ${lo < ls ? `<button type="button" class="rf-agree-b" onclick="rfAgree('${kind}', ${k}, ${lo})" title="${esc(t('rf_agree_lower'))}">− ${ratingFmt(lo)}</button>` : ''}
      <button type="button" class="rf-agree-b is-main" onclick="rfAgree('${kind}', ${k}, ${ratingClamp(ls)})">✓ ${esc(t('rf_agree'))} ${ratingFmt(ls)}</button>
      ${hi > ls ? `<button type="button" class="rf-agree-b" onclick="rfAgree('${kind}', ${k}, ${hi})" title="${esc(t('rf_agree_higher'))}">+ ${ratingFmt(hi)}</button>` : ''}
    </span>
    ${kind === 'album' && n ? `<span class="rf-agree-note">${esc(t(n === 1 ? 'rf_agree_album_one' : 'rf_agree_album', { n }))}</span>` : ''}
  </div>`;
}

/* Gives the score. v is the album / song number the button showed; an
   album passes the difference on to every track. Returns how many songs
   got a score. */
function rfAgreeWrite(kind, key, v) {
  if (kind !== 'album') { rfSetSong(key, v); return 1; }
  const view = typeof asAlbumView === 'function' ? asAlbumView(key) : null;
  const base = view ? view.score : v;
  const shift = Math.round((v - base) * 10) / 10;
  const done = [];
  rfBefore('album', key);
  for (const tr of ratingAlbumTrackKeys(key)) {
    if (ratingSongScore(tr.key) != null) continue;
    const ls = typeof asSong === 'function' ? asSong(tr.key) : null;
    const s = ratingClamp((ls ? ls.score : base) + shift);
    rfBefore('song', tr.key);
    const e = _ratingEnsureEntry('song', tr.key);
    e.m = 'quick'; e.q = s; e.ts = Date.now();
    done.push(tr.key);
  }
  ratingsPersist();
  // History and today's count, per song and once for the album
  for (const k of done) rfScored('song', k);
  rfScored('album', key);
  return done.length;
}

function rfAgree(kind, key, v) {
  const n = rfAgreeWrite(kind, key, v);
  if (typeof dcPlToast === 'function') dcPlToast(t(kind === 'album' ? 'rf_agree_done_album' : 'rf_agree_done', { score: ratingFmt(kind === 'album' ? ratingAlbumScore(key)?.score : ratingSongScore(key)), n }));
  // Repaint the window it was tapped in, and the chart behind once it's uncovered
  if (kind === 'album' && typeof renderAlbumRatingSection === 'function') renderAlbumRatingSection(key);
  if (kind === 'song' && typeof renderSongRatingSection === 'function') renderSongRatingSection(key);
  if (typeof _ratingsRefreshWhenUncovered === 'function') _ratingsRefreshWhenUncovered();
}

/* The Ratings page's "Agree with your listening" card: your most played
   songs with no score of yours, one at a time. Skip moves on (this visit
   only). Up to RF_AGREE_Q in the line, rebuilt with the page. */
const RF_AGREE_Q = 40;
let _rfAgreeQ = [], _rfAgreeAt = 0;
const _rfAgreeSkip = new Set();
// Plays per song, worked out once per library load
let _rfSongPlays = null, _rfSongPlaysFor = null;
function rfSongPlays() {
  if (_rfSongPlaysFor !== allPlays || !_rfSongPlays || _rfSongPlays.n !== allPlays.length) {
    const c = new Map();
    for (const p of allPlays) { const k = songKey(p); c.set(k, (c.get(k) || 0) + 1); }
    _rfSongPlays = { map: c, list: [...c.entries()].sort((a, b) => b[1] - a[1]), n: allPlays.length };
    _rfSongPlaysFor = allPlays;
  }
  return _rfSongPlays;
}
function rfAgreeCardHTML() {
  if (typeof asOn !== 'function' || !asOn() || !allPlays.length) return '';
  _rfAgreeQ = [];
  for (const [k, n] of rfSongPlays().list) {
    if (ratingSongScore(k) != null || _rfAgreeSkip.has(k) || !asSong(k)) continue;
    _rfAgreeQ.push({ k, n });
    if (_rfAgreeQ.length >= RF_AGREE_Q) break;
  }
  _rfAgreeAt = 0;
  if (!_rfAgreeQ.length) return '';
  return `<div class="rf-card rf-agree-card" id="rfAgreeCard"></div>`;
}
function rfAgreeCardRender() {
  const el = document.getElementById('rfAgreeCard');
  if (!el) return;
  while (_rfAgreeAt < _rfAgreeQ.length && ratingSongScore(_rfAgreeQ[_rfAgreeAt].k) != null) _rfAgreeAt++;
  const x = _rfAgreeQ[_rfAgreeAt];
  if (!x) { el.innerHTML = `<div class="rf-card-done">✓ ${esc(t('rf_agree_all_done'))}</div>`; return; }
  const ls = asSong(x.k), nm = ratingSongNames(x.k), k = esc(JSON.stringify(x.k));
  const lo = ratingClamp(ls.score - RF_AGREE_STEP), hi = ratingClamp(ls.score + RF_AGREE_STEP);
  el.innerHTML = `<div class="rf-card-k">${_amIco('headphones')}<span>${esc(t('rf_agree_title'))}</span><span class="rf-card-n">${_rfAgreeAt + 1} / ${_rfAgreeQ.length}</span></div>
    <div class="rf-agree-item">
      <span class="am-art rf-agree-art" id="rfAgreeArt"><span class="thumb-initials">${esc(initials(nm.title))}</span></span>
      <button type="button" class="rf-agree-txt" onclick="openSongModal(${k})"><b>${esc(nm.title)}</b><span>${esc(nm.artist)} · ${x.n.toLocaleString()} ${esc(tUnit('plays', x.n))}</span></button>
      ${asChip({ score: ls.score, state: 'listening' })}
    </div>
    <div class="rf-agree-btns">
      ${lo < ls.score ? `<button type="button" class="rf-agree-b" onclick="rfAgreeCardPick(${lo})">− ${ratingFmt(lo)}</button>` : ''}
      <button type="button" class="rf-agree-b is-main" onclick="rfAgreeCardPick(${ratingClamp(ls.score)})">✓ ${esc(t('rf_agree'))} ${ratingFmt(ls.score)}</button>
      ${hi > ls.score ? `<button type="button" class="rf-agree-b" onclick="rfAgreeCardPick(${hi})">+ ${ratingFmt(hi)}</button>` : ''}
      <button type="button" class="rf-agree-b is-plain" onclick="rfAgreeCardSkip()">${esc(t('rf_skip'))}</button>
    </div>`;
  if (typeof loadImages === 'function') loadImages([{ imgId: 'rfAgreeArt', name: nm.title, title: nm.title, artist: nm.artist, album: '', prefKey: 'song:' + nm.artist.toLowerCase() + '|||' + nm.title.toLowerCase() }], 'song');
}
function rfAgreeCardPick(v) {
  const x = _rfAgreeQ[_rfAgreeAt];
  if (!x) return;
  rfSetSong(x.k, v);
  if (typeof dcPlToast === 'function') dcPlToast(t('rf_agree_done', { score: ratingFmt(v) }));
  _rfAgreeAt++;
  rfAgreeCardRender();
}
function rfAgreeCardSkip() {
  const x = _rfAgreeQ[_rfAgreeAt];
  if (x) _rfAgreeSkip.add(x.k);
  _rfAgreeAt++;
  rfAgreeCardRender();
}
window.rfAgree = rfAgree;
window.rfAgreeCardPick = rfAgreeCardPick;
window.rfAgreeCardSkip = rfAgreeCardSkip;
