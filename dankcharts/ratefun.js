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
  // Today's goal (step 7) may just have been reached
  if (typeof _rfCheckGoal === 'function') _rfCheckGoal();
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
    // Days the goal was reached: from either side
    if (r.hit && typeof r.hit === 'object') {
      if (!f.hit || typeof f.hit !== 'object') f.hit = {};
      for (const [d, g] of Object.entries(r.hit)) if (!f.hit[d]) { f.hit[d] = g; changed = true; }
    }
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

// ── Rate what's playing (3) ──────────────────────────────────────────────
/* A score row in the Now Playing card, under the chart story: your score
   (or the Listening Score, dashed), and 1–10 to tap while it plays. A tap
   saves a quick score and the row glows; "More" opens the full rating
   window for decimals, the rubric and a one-line review. Hidden on the
   landing page (no library) and in Stage / TV mode, which have no room. */
let _rfNowKey = null;
function rfPlayerRate(title, artist) {
  const el = document.getElementById('ytRateRow');
  if (!el) return;
  if (typeof allPlays === 'undefined' || !allPlays || !allPlays.length || !title || !artist) { el.hidden = true; _rfNowKey = null; return; }
  _rfNowKey = songKey({ title, artist });
  rfPlayerRateRender();
}
function rfPlayerRateRender(glow) {
  const el = document.getElementById('ytRateRow');
  if (!el || !_rfNowKey) return;
  const own = ratingSongScore(_rfNowKey);
  const ls = own == null && typeof asSong === 'function' ? asSong(_rfNowKey) : null;
  const on = own == null ? -1 : Math.round(own);
  const chip = own != null ? ratingChip(own) : ls ? asChip({ score: ls.score, state: 'listening' }) : '';
  const k = esc(JSON.stringify(_rfNowKey));
  el.innerHTML = `<span class="ytp-rate-l">${esc(t(own != null ? 'rf_np_yours' : 'rf_np_rate'))}</span>
    <span class="ytp-rate-dots" role="group" aria-label="${esc(t('rf_np_rate'))}">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n =>
      `<button type="button" class="ytp-rate-dot${n === on ? ' is-on' : ''}${own != null && n <= on ? ' is-fill' : ''}" onclick="rfPlayerTap(${n})" aria-label="${n}" aria-pressed="${n === on}">${n}</button>`).join('')}</span>
    ${chip}
    <button type="button" class="ytp-rate-more" onclick="openRatingModal('song', ${k})" title="${esc(t('rf_np_more_tip'))}">${esc(t('rf_np_more'))}</button>`;
  el.hidden = false;
  if (glow) { el.classList.remove('is-glow'); void el.offsetWidth; el.classList.add('is-glow'); }
}
function rfPlayerTap(n) {
  if (!_rfNowKey) return;
  rfSetSong(_rfNowKey, n);
  rfPlayerRateRender(true);
  if (typeof dcPlToast === 'function') dcPlToast(t('rf_agree_done', { score: ratingFmt(n) }));
  if (typeof _ratingsRefreshWhenUncovered === 'function') _ratingsRefreshWhenUncovered();
}
window.rfPlayerTap = rfPlayerTap;

// ── Shared: the full-screen stage, art, previews ─────────────────────────
/* One full-screen window for the rating games (Rate Rush, the album
   speed-run, Settle the gap, the weekly report). Made on first use, at the
   end of <body> so it sits above every other window. Escape or ✕ closes it;
   focus goes back to whatever opened it. */
let _rfStageFocus = null, _rfStageOnClose = null, _rfStageKeys = null;
function rfStageOpen(html, opts = {}) {
  let el = document.getElementById('rfStage');
  if (!el) {
    el = document.createElement('div');
    el.id = 'rfStage';
    el.className = 'rf-stage';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    document.body.appendChild(el);
    el.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); rfStageClose(); return; }
      if (_rfStageKeys) _rfStageKeys(e);
    });
  }
  if (!el.classList.contains('open')) _rfStageFocus = document.activeElement;
  _rfStageOnClose = opts.onClose || null;
  _rfStageKeys = opts.keys || null;
  el.className = 'rf-stage open' + (opts.cls ? ' ' + opts.cls : '');
  el.setAttribute('aria-label', opts.label || '');
  el.innerHTML = `<div class="rf-stage-box">
      <button type="button" class="rf-stage-x dc-btn dc-btn-plain dc-btn-icon" onclick="rfStageClose()" aria-label="${esc(t('set_close'))}">✕</button>
      <div class="rf-stage-body" id="rfStageBody">${html}</div>
    </div>`;
  document.body.classList.add('rf-stage-on');
  if (typeof dcFillIcons === 'function') dcFillIcons(el);
  setTimeout(() => (el.querySelector('[data-rf-focus]') || el.querySelector('.rf-stage-x')).focus(), 30);
  return el;
}
// Swaps what's inside without closing (next card, end screen)
function rfStageSet(html) {
  const body = document.getElementById('rfStageBody');
  if (!body) return;
  body.innerHTML = html;
  if (typeof dcFillIcons === 'function') dcFillIcons(body);
  const f = body.querySelector('[data-rf-focus]');
  if (f) f.focus();
}
function rfStageClose() {
  const el = document.getElementById('rfStage');
  if (!el || !el.classList.contains('open')) return;
  el.classList.remove('open');
  el.innerHTML = '';
  document.body.classList.remove('rf-stage-on');
  rfStopPreview();
  const done = _rfStageOnClose;
  _rfStageOnClose = null; _rfStageKeys = null;
  if (_rfStageFocus && _rfStageFocus.focus) try { _rfStageFocus.focus(); } catch (e) {}
  if (done) try { done(); } catch (e) {}
}

// Cover art into a box, the same way the rest of the site finds it
function rfArt(el, kind, title, artist, album) {
  if (!el || typeof fetchAndInjectImage !== 'function') return;
  if (!el.id) el.id = 'rfArt' + Math.random().toString(36).slice(2, 8);
  const item = kind === 'album'
    ? { imgId: el.id, name: title, album: title, artist, prefKey: 'album:' + artist.toLowerCase() + '|||' + title.toLowerCase() }
    : { imgId: el.id, name: title, title, artist, album: album || '', prefKey: 'song:' + artist.toLowerCase() + '|||' + title.toLowerCase() };
  fetchAndInjectImage(el, item, kind === 'album' ? 'album' : 'song');
}

// The album a song is most often played from (for its preview and cover)
function rfSongAlbum(key) {
  const albs = rfAlbumsOfSong(key);
  if (!albs.length) return '';
  const memo = _rtMemoFresh(), idx = _rtTrackIndex(memo);
  let best = '', n = -1;
  for (const ak of albs) { const c = idx.get(ak)?.get(key)?.count || 0; if (c > n) { n = c; best = ak; } }
  return best.split('|||')[0] || '';
}

/* 30-second previews (the same iTunes + Deezer search as the Awards ♪
   buttons). One at a time; a newer request wins. onState(state) is told
   'loading' | 'playing' | 'none' | 'ended' so a button can follow. */
let _rfAudio = null, _rfAudioTok = 0;
async function rfPreview(title, artist, album, onState) {
  rfStopPreview();
  const tok = ++_rfAudioTok;
  const say = s => { if (tok === _rfAudioTok && onState) try { onState(s); } catch (e) {} };
  say('loading');
  let takes = [];
  try { takes = typeof _ceremonyPreviewTakes === 'function' ? await _ceremonyPreviewTakes({ title, artist, album: album || '' }, 'song') : []; } catch (e) { takes = []; }
  if (tok !== _rfAudioTok) return;
  if (!takes.length) { say('none'); return; }
  // Only one sound at a time on the site: stop an awards sample first
  if (typeof _ceremonyStopAudio === 'function') try { _ceremonyStopAudio(); } catch (e) {}
  const a = _rfAudio = new Audio(takes[0].url);
  a.volume = 0.8;
  a.addEventListener('ended', () => { if (_rfAudio === a) { _rfAudio = null; say('ended'); } });
  try { await a.play(); if (tok !== _rfAudioTok) { a.pause(); return; } say('playing'); }
  catch (e) { if (_rfAudio === a) _rfAudio = null; say('none'); }
}
function rfStopPreview() {
  _rfAudioTok++;
  if (_rfAudio) { try { _rfAudio.pause(); } catch (e) {} _rfAudio = null; }
}

// 1–10 buttons, big. fn = the global function each one calls with its number.
function rfTenHTML(fn, on, extraCls) {
  return `<div class="rf-ten${extraCls ? ' ' + extraCls : ''}" role="group">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
    const b = ratingBand(n);
    return `<button type="button" class="rf-ten-b ${b.cls}${n === on ? ' is-on' : ''}" onclick="${fn}(${n})" aria-pressed="${n === on}"${n === 1 ? ' data-rf-focus' : ''}>${n}</button>`;
  }).join('')}</div>`;
}
// Number keys 1–9 and 0 (= 10) for the 1–10 buttons on a stage
function rfTenKeys(fn) {
  return e => {
    if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (/^[0-9]$/.test(e.key)) { e.preventDefault(); fn(e.key === '0' ? 10 : +e.key); }
  };
}

// ── Rate Rush (1) ────────────────────────────────────────────────────────
/* A stack of your most played songs you haven't scored. A 30-second preview
   plays, you tap a number, the next card slides in. RF_RUSH_N a round.
   Skip moves on (and leaves that song out for the rest of this visit). */
const RF_RUSH_N = 10;
let _rfRush = null;   // { list: [{k, n}], at, done: [{k, s}], skipped, t0 }
const _rfRushSkip = new Set();

function rfRushPool() {
  const out = [];
  for (const [k, n] of rfSongPlays().list) {
    if (ratingSongScore(k) != null || _rfRushSkip.has(k)) continue;
    out.push({ k, n });
    if (out.length >= RF_RUSH_N) break;
  }
  return out;
}

function rfRushOpen() {
  if (typeof allPlays === 'undefined' || !allPlays.length) return;
  const list = rfRushPool();
  _rfRush = { list, at: 0, done: [], skipped: 0, t0: Date.now() };
  rfStageOpen('', { cls: 'rf-stage--rush', label: t('rf_rush_title'), keys: rfTenKeys(rfRushPick),
    onClose: () => { _rfRush = null; if (typeof _ratingsRefreshWhenUncovered === 'function') _ratingsRefreshWhenUncovered(); if (document.getElementById('ratingsView')?.offsetParent) renderRatingsPage(); } });
  _rfRushCard();
}

function _rfRushCard() {
  const R = _rfRush;
  if (!R) return;
  const x = R.list[R.at];
  if (!x) { _rfRushEnd(); return; }
  const nm = ratingSongNames(x.k), album = rfSongAlbum(x.k);
  const ls = typeof asSong === 'function' ? asSong(x.k) : null;
  rfStageSet(`<div class="rf-rush">
      <div class="rf-rush-top">
        <span class="rf-kicker">⚡ ${esc(t('rf_rush_title'))}</span>
        <span class="rf-rush-count">${esc(t('rf_rush_of', { n: R.at + 1, of: R.list.length }))}</span>
      </div>
      <div class="rf-prog"><i style="width:${(R.at / R.list.length * 100).toFixed(1)}%"></i></div>
      <div class="rf-rush-card">
        <span class="rf-rush-art" id="rfRushArt"><span class="thumb-initials">${esc(initials(nm.title))}</span></span>
        <div class="rf-rush-name">${esc(nm.title)}</div>
        <div class="rf-rush-artist">${esc(nm.artist)}${album ? ' · ' + esc(album) : ''}</div>
        <div class="rf-rush-meta">${x.n.toLocaleString()} ${esc(tUnit('plays', x.n))}${ls ? ` · ${esc(t('as_said'))} ${asChip({ score: ls.score, state: 'listening' })}` : ''}</div>
        <button type="button" class="rf-play" id="rfRushPlay" onclick="rfRushPlay()">♪ <span>${esc(t('rf_preview_loading'))}</span></button>
      </div>
      ${rfTenHTML('rfRushPick')}
      <div class="rf-rush-foot">
        <button type="button" class="dc-btn dc-btn-plain" onclick="rfRushSkip()">${esc(t('rf_skip'))} →</button>
        <span class="rf-rush-hint">${esc(t('rf_keys_hint'))}</span>
      </div>
    </div>`);
  rfArt(document.getElementById('rfRushArt'), 'song', nm.title, nm.artist, album);
  rfRushPlay();
}

// The preview button follows the sound: loading, playing (tap = stop), none
function rfRushPlay() {
  const R = _rfRush; if (!R) return;
  const x = R.list[R.at]; if (!x) return;
  const btn = document.getElementById('rfRushPlay');
  if (btn && btn.dataset.state === 'playing') { rfStopPreview(); _rfPlayBtn(btn, 'ended'); return; }
  const nm = ratingSongNames(x.k);
  rfPreview(nm.title, nm.artist, rfSongAlbum(x.k), s => _rfPlayBtn(document.getElementById('rfRushPlay'), s));
}
function _rfPlayBtn(btn, s) {
  if (!btn) return;
  btn.dataset.state = s;
  btn.classList.toggle('is-playing', s === 'playing');
  btn.disabled = s === 'none';
  btn.querySelector('span').textContent = t(s === 'loading' ? 'rf_preview_loading' : s === 'playing' ? 'rf_preview_stop' : s === 'none' ? 'rf_preview_none' : 'rf_preview_play');
}

function rfRushPick(n) {
  const R = _rfRush; if (!R) return;
  const x = R.list[R.at]; if (!x) return;
  rfSetSong(x.k, n);
  R.done.push({ k: x.k, s: n });
  R.at++;
  _rfRushCard();
}
function rfRushSkip() {
  const R = _rfRush; if (!R) return;
  const x = R.list[R.at]; if (!x) return;
  _rfRushSkip.add(x.k);
  R.skipped++;
  R.at++;
  _rfRushCard();
}

function _rfRushEnd() {
  const R = _rfRush;
  rfStopPreview();
  const secs = Math.max(1, Math.round((Date.now() - R.t0) / 1000));
  const avg = R.done.length ? Math.round(R.done.reduce((a, d) => a + d.s, 0) / R.done.length * 10) / 10 : null;
  const top = [...R.done].sort((a, b) => b.s - a.s)[0];
  const more = rfRushPool().length;
  rfStageSet(`<div class="rf-rush rf-end">
      <div class="rf-end-burst" aria-hidden="true">⚡</div>
      <h2 class="rf-end-h">${esc(R.done.length ? t('rf_rush_end', { n: R.done.length, s: secs }) : t('rf_rush_end_none'))}</h2>
      ${avg != null ? `<p class="rf-end-sub">${esc(t('rf_rush_avg'))} ${ratingChip(avg)}${top ? ` · ${esc(t('rf_rush_top'))} <b>${esc(ratingSongNames(top.k).title)}</b> ${ratingChip(top.s)}` : ''}</p>` : ''}
      ${typeof rfGoalMiniHTML === 'function' ? rfGoalMiniHTML() : ''}
      <div class="rf-end-btns">
        ${more ? `<button type="button" class="dc-btn dc-btn-main" data-rf-focus onclick="rfRushOpen()">⚡ ${esc(t('rf_rush_again'))}</button>` : ''}
        <button type="button" class="dc-btn dc-btn-normal" onclick="rfStageClose()" ${more ? '' : 'data-rf-focus'}>${esc(t('rte_done'))}</button>
      </div>
    </div>`);
}

/* The way in: a wide card on the Ratings page and on the Games page. */
function rfRushPromoHTML() {
  if (typeof allPlays === 'undefined' || !allPlays.length) return '';
  let left = 0;
  for (const [k] of rfSongPlays().list) { if (ratingSongScore(k) == null) left++; if (left > 999) break; }
  if (!left) return '';
  return `<button type="button" class="rf-promo rf-promo--rush" onclick="rfRushOpen()">
    <span class="rf-promo-ico" aria-hidden="true">⚡</span>
    <span class="rf-promo-txt"><b>${esc(t('rf_rush_title'))}</b><span>${esc(t('rf_rush_desc', { n: RF_RUSH_N }))}</span></span>
    <span class="rf-promo-go">${esc(t('rf_rush_go'))} ▸</span>
  </button>`;
}

window.rfStageClose = rfStageClose;
window.rfRushOpen = rfRushOpen;
window.rfRushPick = rfRushPick;
window.rfRushSkip = rfRushSkip;
window.rfRushPlay = rfRushPlay;

// ── Album speed-run (4) ──────────────────────────────────────────────────
/* The whole tracklist on one screen: each track a row of 1–10 taps with its
   preview. The album score fills in live as you go, and when the last track
   is scored there's a "Fully yours" moment. Album order when the official
   tracklist is known (the share card's Deezer lookup), else most played
   first. Tracks you never played can't be scored (they aren't part of your
   album score), so they show greyed out. */
let _rfRun = null;   // { key, rows: [{key, title, count}], wasFull }

function rfSpeedPromoHTML(albumKey) {
  const tracks = ratingAlbumTrackKeys(albumKey);
  if (tracks.length < 2) return '';
  const left = tracks.filter(tr => ratingSongScore(tr.key) == null).length;
  return `<button type="button" class="rf-promo rf-promo--run" onclick="rfSpeedOpen(${esc(JSON.stringify(albumKey))})">
    <span class="rf-promo-ico" aria-hidden="true">🏁</span>
    <span class="rf-promo-txt"><b>${esc(t('rf_run_title'))}</b><span>${esc(left ? t('rf_run_desc', { n: left }) : t('rf_run_desc_done'))}</span></span>
    <span class="rf-promo-go">${esc(t(left ? 'rf_rush_go' : 'rf_run_again'))} ▸</span>
  </button>`;
}

async function rfSpeedOpen(albumKey) {
  const [album, artist = ''] = albumKey.split('|||');
  rfStageOpen(`<div class="rf-run-load">${esc(t('rf_run_loading'))}</div>`, { cls: 'rf-stage--wide rf-stage--run', label: t('rf_run_title'),
    onClose: () => {
      const k = _rfRun && _rfRun.key;
      _rfRun = null;
      if (k && document.getElementById('albumModal')?.classList.contains('open') && typeof renderAlbumRatingSection === 'function') renderAlbumRatingSection(k);
      if (typeof _ratingsRefreshWhenUncovered === 'function') _ratingsRefreshWhenUncovered();
    } });
  // Album order: wait a moment for the official tracklist, never long
  if (typeof rtPrefetchTracklist === 'function') {
    try { await Promise.race([rtPrefetchTracklist(albumKey), new Promise(r => setTimeout(r, 2500))]); } catch (e) {}
  }
  if (!document.getElementById('rfStage')?.classList.contains('open')) return;
  const lib = ratingAlbumTrackKeys(albumKey);
  let rows;
  if (typeof _rtGridTracks === 'function') {
    const g = _rtGridTracks(albumKey);
    const byKey = new Map(lib.map(tr => [tr.key, tr]));
    rows = g.tracks.map(x => x.key ? byKey.get(x.key) || { key: x.key, title: x.title, count: 0 } : { key: null, title: x.title, count: 0 });
    // Played tracks the tracklist didn't know about go on the end
    const have = new Set(rows.map(r => r.key));
    for (const tr of lib) if (!have.has(tr.key)) rows.push(tr);
  } else rows = lib.slice();
  _rfRun = { key: albumKey, album, artist, rows, wasFull: rows.every(r => !r.key || ratingSongScore(r.key) != null) };
  rfStageSet(_rfRunHTML());
  rfArt(document.getElementById('rfRunArt'), 'album', album, artist);
}

function _rfRunHTML() {
  const R = _rfRun;
  const res = ratingAlbumScore(R.key);
  // Tracks you never played fold into one line under the list (a deluxe
  // edition can have a dozen); the numbers stay the album's own
  const off = R.rows.filter(r => !r.key);
  const rows = R.rows.map((r, i) => r.key ? `<li class="rf-run-row" data-k="${esc(r.key)}">${_rfRunRowInner(r, i)}</li>` : '').join('');
  return `<div class="rf-run">
    <div class="rf-run-head">
      <span class="rf-run-art" id="rfRunArt"><span class="thumb-initials">${esc(initials(R.album))}</span></span>
      <div class="rf-run-titles">
        <span class="rf-kicker">🏁 ${esc(t('rf_run_title'))}</span>
        <h2 class="rf-run-h">${esc(R.album)}</h2>
        <span class="rf-run-artist">${esc(R.artist)}</span>
        <div class="rf-run-prog" id="rfRunProg">${_rfRunProgHTML()}</div>
      </div>
      <div class="rf-run-ring" id="rfRunRing">${ratingRing(res ? res.score : null, { size: 92, label: t('rf_run_so_far') })}</div>
    </div>
    <div id="rfRunFull">${_rfRunFullHTML()}</div>
    <ol class="rf-run-list">${rows}</ol>
    ${off.length ? `<p class="rf-run-off"><b>${esc(t('rf_run_unplayed_n', { n: off.length }))}</b> ${esc(off.map(r => r.title).join(' · '))}</p>` : ''}
  </div>`;
}
function _rfRunRowInner(r, i) {
  const s = ratingSongScore(r.key);
  const ls = s == null && typeof asSong === 'function' ? asSong(r.key) : null;
  const k = esc(JSON.stringify(r.key));
  return `<span class="rf-run-n">${i + 1}</span>
    <span class="rf-run-t"><b>${esc(r.title)}</b><span>${r.count.toLocaleString()} ${esc(tUnit('plays', r.count))}</span></span>
    <button type="button" class="rf-run-play" onclick="rfRunPlay(this, ${k})" aria-label="${esc(t('rf_preview_play'))}">▶</button>
    <span class="rf-run-ten">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `<button type="button" class="rf-ten-b ${ratingBand(n).cls}${s != null && Math.round(s) === n ? ' is-on' : ''}" onclick="rfRunPick(${k}, ${n}, this)" aria-label="${n}">${n}</button>`).join('')}</span>
    <span class="rf-run-s">${s != null ? ratingChip(s) : ls ? asChip({ score: ls.score, state: 'listening' }) : '<span class="rf-run-dash">–</span>'}</span>`;
}
function _rfRunCounts() {
  const R = _rfRun, play = R.rows.filter(r => r.key);
  return { done: play.filter(r => ratingSongScore(r.key) != null).length, of: play.length };
}
function _rfRunProgHTML() {
  const c = _rfRunCounts();
  // The album so far as a chip too: phones hide the ring to make room
  const res = ratingAlbumScore(_rfRun.key);
  return `<span>${esc(t('rf_run_prog', { n: c.done, of: c.of }))}</span><span class="rf-prog"><i style="width:${(c.of ? c.done / c.of * 100 : 0).toFixed(1)}%"></i></span>${res ? `<span class="rf-run-chip">${ratingChip(res.score)}</span>` : ''}`;
}
function _rfRunFullHTML(justNow) {
  const c = _rfRunCounts();
  if (!c.of || c.done < c.of) return '';
  const res = ratingAlbumScore(_rfRun.key);
  return `<div class="rf-run-full${justNow ? ' is-new' : ''}">
    <span class="rf-run-full-e" aria-hidden="true">🎉</span>
    <span><b>${esc(t('rf_run_full'))}</b> ${esc(t('rf_run_full_sub', { score: ratingFmt(res ? res.score : null) }))}</span>
    <button type="button" class="dc-btn dc-btn-normal dc-btn-sm" onclick="rfStageClose();openRatingModal('album', ${esc(JSON.stringify(_rfRun.key))})">${esc(t('rf_run_aspects'))}</button>
  </div>`;
}

function rfRunPick(key, n, btn) {
  const R = _rfRun;
  if (!R) return;
  rfSetSong(key, n);
  const li = btn && btn.closest('.rf-run-row');
  const i = R.rows.findIndex(r => r.key === key);
  if (li && i >= 0) { li.innerHTML = _rfRunRowInner(R.rows[i], i); li.classList.add('is-done'); }
  const res = ratingAlbumScore(R.key);
  const ring = document.getElementById('rfRunRing');
  if (ring && typeof _ratingSetRing === 'function') { _ratingSetRing(ring, res ? res.score : null); }
  const prog = document.getElementById('rfRunProg');
  if (prog) prog.innerHTML = _rfRunProgHTML();
  const c = _rfRunCounts();
  if (c.done === c.of && !R.wasFull) {
    R.wasFull = true;
    // A finished speed-run counts toward its badge (step 9)
    const f = _rfFun();
    f.runs = (f.runs || 0) + 1;
    _rfFunTouch();
    ratingsPersist();
    rfStopPreview();
    const full = document.getElementById('rfRunFull');
    if (full) { full.innerHTML = _rfRunFullHTML(true); full.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  }
  // The next unscored row's first button gets focus, so a keyboard can keep going
  const next = li && [...li.parentElement.querySelectorAll('.rf-run-row')].find(x => ratingSongScore(x.dataset.k) == null);
  if (next && next !== li) next.querySelector('.rf-ten-b')?.focus({ preventScroll: false });
}

function rfRunPlay(btn, key) {
  const R = _rfRun;
  if (!R) return;
  if (btn.classList.contains('is-playing')) { rfStopPreview(); btn.classList.remove('is-playing'); btn.textContent = '▶'; return; }
  document.querySelectorAll('.rf-run-play.is-playing').forEach(b => { b.classList.remove('is-playing'); b.textContent = '▶'; });
  const nm = ratingSongNames(key);
  rfPreview(nm.title, nm.artist, R.album, s => {
    btn.classList.toggle('is-playing', s === 'playing' || s === 'loading');
    btn.textContent = s === 'loading' ? '…' : s === 'playing' ? '■' : s === 'none' ? '✕' : '▶';
    btn.disabled = s === 'none';
  });
}

window.rfSpeedOpen = rfSpeedOpen;
window.rfRunPick = rfRunPick;
window.rfRunPlay = rfRunPlay;

// ── Daily goal and rating streak (6) ─────────────────────────────────────
/* Pick a goal (5, 10 or 25 a day). A ring fills as you rate, and a 🔥 streak
   counts the days in a row you hit it. fun.hit keeps the days the goal was
   reached (with the goal of that day), so changing the goal later doesn't
   rewrite old days. In the evening, with a streak going and today's goal
   not reached yet, one notification says the streak is at risk. */
const RF_GOALS = [5, 10, 25];
const RF_GOAL_DEFAULT = 10;
const RF_RISK_HOUR = 18;   // the reminder waits until 6 pm, the user's time

function rfGoal() { const g = _rfFun().goal; return RF_GOALS.includes(g) ? g : RF_GOAL_DEFAULT; }
function rfTodayCount() { return _rfFun().days[rfToday()] || 0; }

function _rfHits() {
  const f = _rfFun();
  if (!f.hit || typeof f.hit !== 'object') f.hit = {};
  return f.hit;
}

// Marks today when the goal is reached (called after each count)
function _rfCheckGoal() {
  const d = rfToday(), n = rfTodayCount(), g = rfGoal(), H = _rfHits();
  if (n < g || H[d]) return;
  H[d] = g;
  _rfFunTouch();
  const s = rfStreak();
  if (typeof dcPlToast === 'function') dcPlToast(t('rf_goal_hit_toast', { n: s.cur }));
  const card = document.getElementById('rfGoalCard');
  if (card) { card.outerHTML = rfGoalCardHTML(true); }
}

/* { cur, best, today, atRisk }. A streak still counts while today isn't
   over: it runs up to yesterday until today's goal is reached. */
function rfStreak() {
  const H = _rfHits(), today = rfToday();
  const hitToday = !!H[today];
  let cur = 0, d = hitToday ? today : dyShift(today, -1);
  while (H[d]) { cur++; d = dyShift(d, -1); }
  // Best ever: the longest run in the kept days
  const days = Object.keys(H).sort();
  let best = 0, run = 0, prev = null;
  for (const x of days) { run = prev && dyShift(prev, 1) === x ? run + 1 : 1; prev = x; if (run > best) best = run; }
  return { cur, best: Math.max(best, cur), today: hitToday, atRisk: !hitToday && cur > 0 };
}

function rfSetGoal(g) {
  if (!RF_GOALS.includes(g)) return;
  _rfFun().goal = g;
  _rfFunTouch();
  ratingsPersist(true);
  _rfCheckGoal();
  const card = document.getElementById('rfGoalCard');
  if (card) card.outerHTML = rfGoalCardHTML();
}

// The card on the Ratings page: today's ring, the goal picker, the streak
function rfGoalCardHTML(justHit) {
  const n = rfTodayCount(), g = rfGoal(), s = rfStreak();
  const pct = Math.min(1, n / g), R = 30, C = 2 * Math.PI * R;
  const done = n >= g;
  return `<div class="rf-card rf-goal${done ? ' is-done' : ''}${justHit ? ' is-new' : ''}" id="rfGoalCard">
    <div class="rf-goal-ring" aria-hidden="true">
      <svg viewBox="0 0 72 72" width="72" height="72"><circle cx="36" cy="36" r="${R}" class="rf-goal-track"/><circle cx="36" cy="36" r="${R}" class="rf-goal-arc" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - pct)).toFixed(1)}" transform="rotate(-90 36 36)"/></svg>
      <span class="rf-goal-n">${done ? '✓' : n}</span>
    </div>
    <div class="rf-goal-txt">
      <span class="rf-kicker">${esc(t('rf_goal_title'))}</span>
      <b class="rf-goal-big">${esc(done ? t('rf_goal_done', { n }) : t('rf_goal_prog', { n, g }))}</b>
      <span class="rf-goal-pick" role="group" aria-label="${esc(t('rf_goal_pick'))}"><span>${esc(t('rf_goal_pick'))}</span>${RF_GOALS.map(x =>
        `<button type="button" class="rf-goal-b${x === g ? ' is-on' : ''}" aria-pressed="${x === g}" onclick="rfSetGoal(${x})">${x}</button>`).join('')}</span>
    </div>
    <div class="rf-streak${s.atRisk ? ' is-risk' : ''}${s.cur ? '' : ' is-zero'}" title="${esc(t('rf_streak_best', { n: s.best }))}">
      <span class="rf-streak-n">🔥 ${s.cur}</span>
      <span class="rf-streak-l">${esc(t(s.cur === 1 ? 'rf_streak_day' : 'rf_streak_days'))}</span>
      ${s.atRisk ? `<span class="rf-streak-risk">${esc(t('rf_streak_risk'))}</span>` : s.best > s.cur ? `<span class="rf-streak-best">${esc(t('rf_streak_best', { n: s.best }))}</span>` : ''}
    </div>
  </div>`;
}

// One line for the end of a Rate Rush round
function rfGoalMiniHTML() {
  const n = rfTodayCount(), g = rfGoal(), s = rfStreak();
  return `<div class="rf-goal-mini"><span>${esc(t('rf_goal_mini', { n, g }))}</span><span class="rf-prog"><i style="width:${Math.min(100, n / g * 100).toFixed(1)}%"></i></span><b>🔥 ${s.cur}</b></div>`;
}

/* The evening reminder: signed in, own library (not the demo), a streak of
   two days or more, today not reached yet, after RF_RISK_HOUR, once a day.
   rfWatch runs with the notification watchers (notifications.js). */
function _rfWatchStreak() {
  const s = rfStreak(), d = rfToday(), f = _rfFun();
  if (!s.atRisk || s.cur < 2 || tzNow().getHours() < RF_RISK_HOUR || f.told.streak === d) return;
  f.told.streak = d;
  _rfFunTouch();
  ratingsPersist(true);
  dcNotify({ kind: 'rt_streak', n: s.cur, left: Math.max(1, rfGoal() - rfTodayCount()), link: { tab: 'ratings' } });
}

const _rfWatchers = [_rfWatchStreak];
function rfWatch() {
  if (typeof dcIsSignedIn !== 'function' || !dcIsSignedIn() || typeof dcNotify !== 'function') return;
  if (typeof _apAllowed === 'function' && !_apAllowed()) return;
  if (!allPlays || !allPlays.length) return;
  for (const w of _rfWatchers) { try { w(); } catch (e) { console.warn('[dankcharts] rating watch:', e); } }
}

window.rfSetGoal = rfSetGoal;
window.rfWatch = rfWatch;

/* Where a rating notification leads (notifications.js ntFollow, link.tab
   'rfun'): link.what picks the handler; later steps add theirs. */
const _rfFollowers = {};
function rfFollow(link) {
  const h = link && _rfFollowers[link.what];
  if (h) { try { h(link); return; } catch (e) { console.warn('[dankcharts] rating link:', e); } }
  if (typeof dcGoTab === 'function') dcGoTab('ratings');
}
window.rfFollow = rfFollow;
