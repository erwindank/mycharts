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
  _rfRev++;   // anything worked out from the scores is out of date now
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
  if (typeof _rfRev === 'number') _rfRev++;   // scores may have come in from another device
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
  // A finished round counts toward the Rusher badge (step 9)
  if (R.done.length) { const f = _rfFun(); f.rushes = (f.rushes || 0) + 1; _rfFunTouch(); ratingsPersist(true); setTimeout(() => rfCheckBadges(), 400); }
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

// ── Your personal scale (18) ─────────────────────────────────────────────
/* How you use the 0–10 scale: a harsh ↔ generous meter from the average of
   your own scores, how many get 9 or more, and a tip when your scores bunch
   up in one point of the scale. Albums when you have scored RF_SCALE_MIN of
   them, else songs. Your own scores only: Listening Scores are spread
   evenly on purpose, so they would say nothing about you. */
const RF_SCALE_MIN = 5;
const RF_SCALE_TYPES = [   // by average, lowest first
  { max: 5.5, key: 'harsh' }, { max: 6.5, key: 'tough' }, { max: 7.5, key: 'fair' },
  { max: 8.3, key: 'generous' }, { max: 99, key: 'kind' }
];

// From ratingLibrarySummary(): { kind, n, mean, pos 0–1, type, top9 %, low5 %, bunch } or null
function rfScale(sum) {
  const yours = sum && sum.yours ? sum.yours : sum;
  if (!yours) return null;
  let kind = 'albums', rows = yours.albums || [];
  if (rows.length < RF_SCALE_MIN) { kind = 'songs'; rows = yours.songs || []; }
  if (rows.length < RF_SCALE_MIN) return null;
  const sc = rows.map(r => r.score);
  const n = sc.length, mean = sc.reduce((a, b) => a + b, 0) / n;
  // 4.0 average reads as the harsh end, 9.0 as the generous end
  const pos = Math.max(0, Math.min(1, (mean - 4) / 5));
  const type = RF_SCALE_TYPES.find(x => mean < x.max).key;
  const top9 = Math.round(sc.filter(s => s >= 9).length / n * 100);
  const low5 = Math.round(sc.filter(s => s < 5).length / n * 100);
  // The busiest whole point (7.0–7.9…): a tip when half or more sit there
  const bins = new Array(11).fill(0);
  for (const s of sc) bins[Math.min(10, Math.floor(s))]++;
  const bi = bins.indexOf(Math.max(...bins));
  const bunch = n >= 8 && bins[bi] / n >= 0.5 ? { from: bi, pct: Math.round(bins[bi] / n * 100) } : null;
  return { kind, n, mean: Math.round(mean * 10) / 10, pos, type, top9, low5, bunch };
}

function rfScaleHTML(sum) {
  const s = rfScale(sum);
  if (!s) return '';
  const range = s.bunch ? (s.bunch.from >= 10 ? '10.0' : `${s.bunch.from}.0–${s.bunch.from}.9`) : '';
  return `<div class="rp-block rf-scale">
    <div class="ao-head rk-head">${esc(t('rf_scale_title'))}</div>
    <p class="rp-block-sub">${esc(t('rf_scale_sub_' + s.kind, { n: s.n.toLocaleString() }))}</p>
    <div class="rf-scale-top">
      <b class="rf-scale-type">${esc(t('rf_scale_t_' + s.type))}</b>
      <span class="rf-scale-avg">${esc(t('rf_scale_avg'))} ${ratingChip(s.mean)}</span>
    </div>
    <div class="rf-scale-meter" role="img" aria-label="${esc(t('rf_scale_t_' + s.type))}">
      <span class="rf-scale-bar"></span>
      <span class="rf-scale-pin" style="left:${(s.pos * 100).toFixed(1)}%"></span>
    </div>
    <div class="rf-scale-ends"><span>${esc(t('rf_scale_harsh'))}</span><span>${esc(t('rf_scale_generous'))}</span></div>
    <div class="rf-scale-facts">
      <span><b>${s.top9}%</b> ${esc(t('rf_scale_top9_' + s.kind))}</span>
      <span><b>${s.low5}%</b> ${esc(t('rf_scale_low5'))}</span>
    </div>
    ${s.bunch ? `<p class="rf-scale-tip">💡 ${esc(t('rf_scale_tip', { pct: s.bunch.pct, range }))}</p>` : ''}
  </div>`;
}

// ── Critic levels and badges (7) ─────────────────────────────────────────
/* Listener → Reviewer → Critic → Tastemaker → Legend as you score more (your
   own song and album scores; Listening Scores don't count). Badges mark
   moments; once earned they stay (fun.badges, synced, earliest date wins). */
const RF_LEVELS = [
  { key: 'listener', min: 0 }, { key: 'reviewer', min: 25 }, { key: 'critic', min: 100 },
  { key: 'tastemaker', min: 500 }, { key: 'legend', min: 2000 }
];

// What you have scored yourself: { songs, albums, all, scores: [every own score] }
function rfOwnCounts() {
  let songs = 0, albums = 0;
  const scores = [];
  for (const k of Object.keys(_ratings.songs)) { const s = ratingSongScore(k); if (s != null) { songs++; scores.push(s); } }
  const albs = new Set(Object.keys(_ratings.albums));
  for (const k of Object.keys(_ratings.songs)) for (const ak of rfAlbumsOfSong(k)) albs.add(ak);
  let full = 0;
  for (const ak of albs) {
    const r = ratingAlbumScore(ak);
    // An album counts once it is really yours: its aspects, or at least half
    // of the tracks you play from it (one rated song puts it on every
    // edition it was played from, which would count those too)
    if (!r || (r.aspectAvg == null && r.ratedTracks < r.totalTracks / 2)) continue;
    albums++; scores.push(r.score);
    if (r.totalTracks >= 3 && r.ratedTracks === r.totalTracks) full++;
  }
  return { songs, albums, all: songs + albums, scores, full };
}

function rfLevel(n) {
  let i = 0;
  while (i + 1 < RF_LEVELS.length && n >= RF_LEVELS[i + 1].min) i++;
  const cur = RF_LEVELS[i], next = RF_LEVELS[i + 1] || null;
  return { i, key: cur.key, n, next, toNext: next ? next.min - n : 0,
    pct: next ? (n - cur.min) / (next.min - cur.min) : 1 };
}

/* The badges, in shelf order. test(c) gets rfOwnCounts() plus the game
   side; it says whether the badge is earned now. */
const RF_BADGES = [
  { id: 'first',    e: '🎯', test: c => c.all >= 1 },
  { id: 'master',   e: '🏆', test: c => c.scores.some(s => s >= 9) },
  { id: 'harsh',    e: '🧊', test: c => c.scores.some(s => s <= 2) },
  { id: 'spread',   e: '🌈', test: c => c.scores.some(s => s <= 1) && c.scores.some(s => s >= 10) },
  { id: 'century',  e: '💯', test: c => c.all >= 100 },
  { id: 'thousand', e: '🏛️', test: c => c.all >= 1000 },
  { id: 'album10',  e: '💿', test: c => c.full >= 10 },
  { id: 'disco',    e: '🧱', test: c => c.discos >= 1 },
  { id: 'streak7',  e: '🔥', test: c => c.best >= 7 },
  { id: 'streak30', e: '☄️', test: c => c.best >= 30 },
  { id: 'rush',     e: '⚡', test: c => (c.f.rushes || 0) >= 1 },
  { id: 'run',      e: '🏁', test: c => (c.f.runs || 0) >= 1 },
  { id: 'words',    e: '✍️', test: c => c.lines >= 10 },
  { id: 'changed',  e: '🔄', test: c => c.changed >= 5 },
  { id: 'settle',   e: '⚖️', test: c => Object.keys(c.f.settled || {}).length >= 10 }
];

function _rfBadgeCtx() {
  const c = rfOwnCounts();
  c.f = _rfFun();
  c.best = rfStreak().best;
  c.discos = typeof rfDiscos === 'function' ? rfDiscos().filter(d => d.done).length : 0;
  c.lines = 0;
  for (const b of ['songs', 'albums']) for (const e of Object.values(_ratings[b])) if (e && (e.line || '').trim()) c.lines++;
  c.changed = 0;
  for (const arr of Object.values(_ratings.hist || {})) if (Array.isArray(arr) && arr.length >= 2) c.changed++;
  return c;
}

// Checks every badge; new ones are saved and told with a toast
function rfCheckBadges(quiet) {
  const c = _rfBadgeCtx(), f = _rfFun(), now = Date.now();
  const fresh = [];
  for (const b of RF_BADGES) if (!f.badges[b.id] && b.test(c)) { f.badges[b.id] = now; fresh.push(b); }
  if (fresh.length) {
    _rfFunTouch();
    ratingsPersist(true);
    if (!quiet && typeof dcPlToast === 'function') dcPlToast(`${fresh[0].e} ${t('rf_badge_new', { name: t('rf_b_' + fresh[0].id) })}`);
  }
  return c;
}
_rfAfterHooks.push(() => rfCheckBadges());

function rfLevelHTML() {
  // Quiet: badges earned before this update (or on another device) are
  // filed without a toast each
  const c = rfCheckBadges(true), f = _rfFun();
  const L = rfLevel(c.all);
  const got = RF_BADGES.filter(b => f.badges[b.id]).length;
  return `<div class="rp-block rf-level">
    <div class="ao-head rk-head">${esc(t('rf_level_title'))}</div>
    <div class="rf-level-top">
      <span class="rf-level-steps" aria-hidden="true">${RF_LEVELS.map((x, i) => `<i class="${i <= L.i ? 'is-on' : ''}"></i>`).join('')}</span>
      <div class="rf-level-txt">
        <b class="rf-level-name">${esc(t('rf_lv_' + L.key))}</b>
        <span class="rf-level-sub">${esc(t('rf_level_sub', { n: c.all.toLocaleString(), lv: L.i + 1 }))}${L.next ? ' · ' + esc(t('rf_level_next', { n: L.toNext.toLocaleString(), name: t('rf_lv_' + L.next.key) })) : ''}</span>
        <span class="rf-prog"><i style="width:${(L.pct * 100).toFixed(1)}%"></i></span>
      </div>
    </div>
    <div class="rf-badges-h"><span>${esc(t('rf_badges'))}</span><b>${got} / ${RF_BADGES.length}</b></div>
    <div class="rf-badges">${RF_BADGES.map(b => {
      const at = f.badges[b.id];
      return `<div class="rf-badge${at ? ' is-on' : ''}" title="${esc(t('rf_b_' + b.id + '_d'))}${at ? ' · ' + esc(fmt(tzDate(new Date(at)))) : ''}">
        <span class="rf-badge-e" aria-hidden="true">${b.e}</span>
        <span class="rf-badge-n">${esc(t('rf_b_' + b.id))}</span>
        <span class="rf-badge-d">${esc(at ? fmt(tzDate(new Date(at))) : t('rf_b_' + b.id + '_d'))}</span>
      </div>`;
    }).join('')}</div>
  </div>`;
}

// ── Discography plaques (8) ──────────────────────────────────────────────
/* Each artist shows "7 of 9 albums rated". Score them all and they get a
   plaque on the Ratings page's wall. A discography is the artist's own
   albums (the album artist, not features), counted as albums (not singles
   or EPs, ratingReleaseKind), with RF_DISCO_PLAYS plays or more — a
   compilation you once played a song from shouldn't stand in the way. An
   album is rated when it is really yours: its aspects, or at least half of
   the tracks you play from it. Two albums at least for a plaque. */
const RF_DISCO_PLAYS = 3;
const RF_DISCO_MIN = 2;
let _rfDiscoMemo = null;   // { plays, len, rev, list }
let _rfRev = 0;            // bumped on every score change (rfScored)

function _rfAlbumYours(ak) {
  const r = ratingAlbumScore(ak);
  return !!r && (r.aspectAvg != null || r.ratedTracks >= r.totalTracks / 2);
}

// Every artist's discography: [{ artist, keys, total, rated, done, avg }]
function rfDiscos() {
  if (!allPlays || !allPlays.length) return [];
  const m = _rfDiscoMemo;
  if (m && m.plays === allPlays && m.len === allPlays.length && m.rev === _rfRev && m.rel === _releaseEpoch) return m.list;
  const plays = new Map();
  for (const p of allPlays) {
    if (!p.album || p.album === '—') continue;
    const k = albumKeyOf(p);
    plays.set(k, (plays.get(k) || 0) + 1);
  }
  const by = new Map();
  for (const [k, n] of plays) {
    if (n < RF_DISCO_PLAYS) continue;
    const artist = k.split('|||')[1] || '';
    if (!artist || ratingReleaseKind(k).kind !== 'album') continue;
    let d = by.get(artist);
    if (!d) by.set(artist, d = { artist, keys: [] });
    d.keys.push(k);
  }
  const list = [];
  for (const d of by.values()) {
    if (d.keys.length < RF_DISCO_MIN) continue;
    d.keys.sort((a, b) => plays.get(b) - plays.get(a));
    const yours = d.keys.filter(_rfAlbumYours);
    d.total = d.keys.length;
    d.rated = yours.length;
    d.done = d.rated === d.total;
    d.avg = yours.length ? Math.round(yours.reduce((a, k) => a + ratingAlbumScore(k).score, 0) / yours.length * 10) / 10 : null;
    list.push(d);
  }
  _rfDiscoMemo = { plays: allPlays, len: allPlays.length, rev: _rfRev, rel: _releaseEpoch, list };
  return list;
}
function rfDiscoOf(artist) {
  const low = String(artist || '').toLowerCase();
  return rfDiscos().find(d => d.artist.toLowerCase() === low) || null;
}

// A small cover strip: each album in its verdict colour, grey while unrated
function _rfCoversHTML(d, idp, max) {
  return `<span class="rf-covers">${d.keys.slice(0, max).map((k, i) => {
    const r = _rfAlbumYours(k) ? ratingAlbumScore(k) : null;
    const b = r ? ratingBand(r.score) : null;
    return `<button type="button" class="rf-cover ${b ? b.cls + ' is-on' : ''}" id="${idp}${i}" onclick="openAlbumModal(${esc(JSON.stringify(k))})" title="${esc(k.split('|||')[0])}${r ? ' · ' + ratingFmt(r.score) : ' · ' + esc(t('rtp_unrated'))}"><span class="thumb-initials">${esc(initials(k.split('|||')[0]))}</span></button>`;
  }).join('')}${d.keys.length > max ? `<span class="rf-cover-more">+${d.keys.length - max}</span>` : ''}</span>`;
}
function _rfCoversArt(d, idp, max) {
  d.keys.slice(0, max).forEach((k, i) => { const [a, ar] = k.split('|||'); rfArt(document.getElementById(idp + i), 'album', a, ar || d.artist); });
}

// The artist Rating tab: progress, or the plaque once it's all done
function rfDiscoArtistHTML(artist) {
  const d = rfDiscoOf(artist);
  if (!d) return '';
  return `<div class="rf-card rf-disco${d.done ? ' is-done' : ''}">
    <div class="rf-card-k">${d.done ? '🏅' : '💿'}<span>${esc(t(d.done ? 'rf_disco_done_k' : 'rf_disco_k'))}</span><span class="rf-card-n">${d.rated} / ${d.total}</span></div>
    <b class="rf-disco-h">${esc(d.done ? t('rf_disco_done', { n: d.total }) : t('rf_disco_prog', { n: d.rated, of: d.total }))}</b>
    <span class="rf-prog"><i style="width:${(d.rated / d.total * 100).toFixed(1)}%"></i></span>
    ${_rfCoversHTML(d, 'rfDiscoA', 14)}
  </div>`;
}
function rfDiscoArtistFill(artist) {
  const d = rfDiscoOf(artist);
  if (d) _rfCoversArt(d, 'rfDiscoA', 14);
}

// The Ratings page: the wall of finished ones, and the closest to finished
function rfDiscoWallHTML() {
  const all = rfDiscos();
  const done = all.filter(d => d.done).sort((a, b) => b.total - a.total || (b.avg || 0) - (a.avg || 0));
  const near = all.filter(d => !d.done && d.rated > 0).sort((a, b) => (b.rated / b.total) - (a.rated / a.total) || b.rated - a.rated).slice(0, 4);
  if (!done.length && !near.length) return '';
  const key = k => esc(JSON.stringify(k));
  return `<div class="rp-block rf-wall">
    <div class="ao-head rk-head">${esc(t('rf_wall_title'))}</div>
    <p class="rp-block-sub">${esc(t('rf_wall_sub'))}</p>
    ${done.length ? `<div class="rf-plaques">${done.map((d, i) => `<button type="button" class="rf-plaque" onclick="rpOpenArtist(${key(d.artist)})">
        <span class="rf-plaque-bolt" aria-hidden="true"></span><span class="rf-plaque-bolt" aria-hidden="true"></span>
        <span class="rf-plaque-art" id="rfPlq${i}"><span class="thumb-initials">${esc(initials(d.artist))}</span></span>
        <span class="rf-plaque-k">${esc(t('rf_disco_done_k'))}</span>
        <b class="rf-plaque-name">${esc(d.artist)}</b>
        <span class="rf-plaque-sub">${esc(t('rf_wall_albums', { n: d.total }))} · ${ratingChip(d.avg)}</span>
      </button>`).join('')}</div>` : `<p class="rf-wall-empty">${esc(t('rf_wall_none'))}</p>`}
    ${near.length ? `<div class="rf-near-h">${esc(t('rf_wall_near'))}</div><div class="rf-near">${near.map((d, i) => `<div class="rf-near-row">
        <button type="button" class="rf-near-name" onclick="rpOpenArtist(${key(d.artist)})"><b>${esc(d.artist)}</b><span>${esc(t('rf_disco_prog', { n: d.rated, of: d.total }))}</span></button>
        ${_rfCoversHTML(d, 'rfNear' + i + '_', 10)}
      </div>`).join('')}</div>` : ''}
  </div>`;
}
function rfDiscoWallFill() {
  const all = rfDiscos();
  const done = all.filter(d => d.done).sort((a, b) => b.total - a.total || (b.avg || 0) - (a.avg || 0));
  done.forEach((d, i) => { const el = document.getElementById('rfPlq' + i); if (el && typeof fetchAndInjectImage === 'function') fetchAndInjectImage(el, { imgId: el.id, name: d.artist, artist: d.artist, prefKey: 'artist:' + d.artist.toLowerCase() }, 'artist'); });
  const near = all.filter(d => !d.done && d.rated > 0).sort((a, b) => (b.rated / b.total) - (a.rated / a.total) || b.rated - a.rated).slice(0, 4);
  near.forEach((d, i) => _rfCoversArt(d, 'rfNear' + i + '_', 10));
}

// ── Settle the gap (17) ──────────────────────────────────────────────────
/* A queue built from "You vs. your listening": your scores furthest from
   your plays (a point or more apart), biggest gap first. For each one: keep
   it, move it, or hear the preview again. Kept gaps are remembered
   (fun.settled, key → the gap kept) and not asked again unless the gap
   changes. Moving an album opens its speed-run, since an album's score is
   made from its tracks. */
const RF_GAP_MIN = 1;

function rfGapPairs(sum) {
  if (!sum || !sum.lsOn || typeof asAlbumLs !== 'function') return [];
  const settled = _rfFun().settled, out = [];
  const add = (kind, key, name, artist, own, ls) => {
    const d = Math.round((own - ls) * 10) / 10, id = (kind === 'album' ? 'a:' : 's:') + key;
    if (Math.abs(d) < RF_GAP_MIN || settled[id] === d) return;
    out.push({ kind, key, id, name, artist, own, ls, d });
  };
  // Albums only once really yours (see _rfAlbumYours), not every edition one rated song sits on
  for (const x of sum.allRel) if (x.own != null && _rfAlbumYours(x.key)) { const ls = asAlbumLs(x.key); if (ls != null) add('album', x.key, x.name, x.artist, x.own, ls); }
  for (const x of sum.allSongs) if (x.own != null) { const ls = asSong(x.key); if (ls) add('song', x.key, x.title, x.artist, x.own, ls.score); }
  return out.sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
}

let _rfGap = null;   // { list, at, kept, moved }
function rfSettlePromoHTML(sum) {
  const n = rfGapPairs(sum).length;
  if (!n) return '';
  return `<button type="button" class="rf-promo rf-promo--gap" onclick="rfSettleOpen()">
    <span class="rf-promo-ico" aria-hidden="true">⚖️</span>
    <span class="rf-promo-txt"><b>${esc(t('rf_gap_title'))}</b><span>${esc(t(n === 1 ? 'rf_gap_desc_one' : 'rf_gap_desc', { n }))}</span></span>
    <span class="rf-promo-go">${esc(t('rf_rush_go'))} ▸</span>
  </button>`;
}

function rfSettleOpen() {
  const list = rfGapPairs(ratingLibrarySummary('yours'));
  if (!list.length) return;
  _rfGap = { list, at: 0, kept: 0, moved: 0, moving: false };
  rfStageOpen('', { cls: 'rf-stage--gap', label: t('rf_gap_title'),
    keys: e => { if (_rfGap && _rfGap.moving) rfTenKeys(rfGapMove)(e); },
    onClose: () => { _rfGap = null; if (document.getElementById('ratingsView')?.offsetParent) renderRatingsPage(); if (typeof _ratingsRefreshWhenUncovered === 'function') _ratingsRefreshWhenUncovered(); } });
  _rfGapCard();
}

function _rfGapCard() {
  const G = _rfGap;
  if (!G) return;
  const x = G.list[G.at];
  if (!x) {
    rfStopPreview();
    rfStageSet(`<div class="rf-end">
      <div class="rf-end-burst" aria-hidden="true">⚖️</div>
      <h2 class="rf-end-h">${esc(t('rf_gap_end'))}</h2>
      <p class="rf-end-sub">${esc(t('rf_gap_end_sub', { k: G.kept, m: G.moved }))}</p>
      <div class="rf-end-btns"><button type="button" class="dc-btn dc-btn-main" data-rf-focus onclick="rfStageClose()">${esc(t('rte_done'))}</button></div>
    </div>`);
    return;
  }
  const up = x.d > 0;
  rfStageSet(`<div class="rf-gap">
    <div class="rf-rush-top"><span class="rf-kicker">⚖️ ${esc(t('rf_gap_title'))}</span><span class="rf-rush-count">${esc(t('rf_rush_of', { n: G.at + 1, of: G.list.length }))}</span></div>
    <div class="rf-prog"><i style="width:${(G.at / G.list.length * 100).toFixed(1)}%"></i></div>
    <div class="rf-rush-card">
      <span class="rf-rush-art rf-gap-art" id="rfGapArt"><span class="thumb-initials">${esc(initials(x.name))}</span></span>
      <div class="rf-rush-name">${esc(x.name)}</div>
      <div class="rf-rush-artist">${x.kind === 'album' ? '💿 ' : ''}${esc(x.artist)}</div>
      <div class="rf-gap-vs">
        <span class="rf-gap-side"><span class="rf-kicker">${esc(t('rf_gap_you'))}</span><span class="rf-gap-big ${ratingBand(x.own).cls}">${ratingFmt(x.own)}</span></span>
        <b class="rf-gap-d ${up ? 'is-up' : 'is-down'}">${up ? '+' : '−'}${ratingFmt(Math.abs(x.d))}</b>
        <span class="rf-gap-side is-ls"><span class="rf-kicker">${esc(t('rf_gap_ls'))}</span><span class="rf-gap-big ${ratingBand(x.ls).cls}">${ratingFmt(x.ls)}</span></span>
      </div>
      <p class="rf-gap-say">${esc(t(up ? 'rf_gap_say_up' : 'rf_gap_say_down'))}</p>
    </div>
    <div id="rfGapActs">${_rfGapActs(x)}</div>
  </div>`);
  rfArt(document.getElementById('rfGapArt'), x.kind, x.name, x.artist, x.kind === 'song' ? rfSongAlbum(x.key) : '');
}
function _rfGapActs(x) {
  if (_rfGap.moving) return `<p class="rf-gap-move-q">${esc(t('rf_gap_move_q'))}</p>${rfTenHTML('rfGapMove', Math.round(x.own))}
    <div class="rf-rush-foot"><button type="button" class="dc-btn dc-btn-plain" onclick="rfGapMoveCancel()">← ${esc(t('rf_gap_back'))}</button><span class="rf-rush-hint">${esc(t('rf_keys_hint'))}</span></div>`;
  return `<div class="rf-gap-acts">
    <button type="button" class="dc-btn dc-btn-main" data-rf-focus onclick="rfGapKeep()">✓ ${esc(t('rf_gap_keep', { score: ratingFmt(x.own) }))}</button>
    <button type="button" class="dc-btn dc-btn-normal" onclick="rfGapMoveStart()">↕ ${esc(t('rf_gap_move'))}</button>
    ${x.kind === 'song' ? `<button type="button" class="rf-play" id="rfGapPlay" onclick="rfGapListen()">▶ <span>${esc(t('rf_gap_listen'))}</span></button>` : ''}
    <button type="button" class="dc-btn dc-btn-plain" onclick="rfGapSkip()">${esc(t('rf_skip'))} →</button>
  </div>`;
}
function rfGapKeep() {
  const G = _rfGap, x = G && G.list[G.at];
  if (!x) return;
  _rfFun().settled[x.id] = x.d;
  _rfFunTouch();
  ratingsPersist();
  G.kept++; G.at++; G.moving = false;
  rfStopPreview();
  _rfGapCard();
  clearTimeout(_rfAfterTimer);
  _rfAfterTimer = setTimeout(() => { try { rfAfterScoring(); } catch (e) {} }, 900);
}
function rfGapMoveStart() {
  const G = _rfGap, x = G && G.list[G.at];
  if (!x) return;
  // An album's score comes from its tracks: move it there
  if (x.kind === 'album') { rfStageClose(); rfSpeedOpen(x.key); return; }
  G.moving = true;
  const box = document.getElementById('rfGapActs');
  if (box) { box.innerHTML = _rfGapActs(x); box.querySelector('.rf-ten-b')?.focus(); }
}
function rfGapMoveCancel() {
  const G = _rfGap, x = G && G.list[G.at];
  if (!x) return;
  G.moving = false;
  const box = document.getElementById('rfGapActs');
  if (box) box.innerHTML = _rfGapActs(x);
}
function rfGapMove(n) {
  const G = _rfGap, x = G && G.list[G.at];
  if (!x || x.kind !== 'song') return;
  rfSetSong(x.key, n);
  // Moved is settled too, at the new gap
  _rfFun().settled[x.id] = Math.round((n - x.ls) * 10) / 10;
  _rfFunTouch();
  ratingsPersist();
  G.moved++; G.at++; G.moving = false;
  rfStopPreview();
  if (typeof dcPlToast === 'function') dcPlToast(t('rf_agree_done', { score: ratingFmt(n) }));
  _rfGapCard();
}
function rfGapSkip() {
  const G = _rfGap;
  if (!G) return;
  G.at++; G.moving = false;
  rfStopPreview();
  _rfGapCard();
}
function rfGapListen() {
  const G = _rfGap, x = G && G.list[G.at];
  if (!x) return;
  const btn = document.getElementById('rfGapPlay');
  if (btn && btn.dataset.state === 'playing') { rfStopPreview(); _rfPlayBtn(btn, 'ended'); return; }
  rfPreview(x.name, x.artist, rfSongAlbum(x.key), s => _rfPlayBtn(document.getElementById('rfGapPlay'), s));
}
window.rfSettleOpen = rfSettleOpen;
window.rfGapKeep = rfGapKeep;
window.rfGapMoveStart = rfGapMoveStart;
window.rfGapMoveCancel = rfGapMoveCancel;
window.rfGapMove = rfGapMove;
window.rfGapSkip = rfGapSkip;
window.rfGapListen = rfGapListen;

// ── Re-rates: "Still a 9.5?" (19) ────────────────────────────────────────
/* A year after you scored something you still play (RF_STILL_PLAYS plays in
   the last 30 days), ask whether the score still stands. Yes stamps it
   (fun.ok, so it isn't asked again for another year); Re-rate opens the
   rating window, and the change lands in its score history. Shown as a card
   on the Ratings page and on the item's own Rating tab. */
const RF_STILL_AGE = 365 * RF_DAY_MS;
const RF_STILL_RECENT = 30 * RF_DAY_MS;
const RF_STILL_PLAYS = 3;
const _rfStillSkip = new Set();

// When the score last changed (or was last confirmed)
function rfScoredAt(kind, key) {
  const h = rfHist(kind, key);
  let at = h.length ? h[h.length - 1].t : 0;
  if (!at) {
    if (kind === 'song') at = _ratings.songs[key]?.ts || 0;
    else {
      at = _ratings.albums[key]?.ts || 0;
      for (const tr of ratingAlbumTrackKeys(key)) at = Math.max(at, _ratings.songs[tr.key]?.ts || 0);
    }
  }
  const ok = _rfFun().ok[(kind === 'album' ? 'a:' : 's:') + key] || 0;
  return Math.max(at, ok);
}

// Plays in the last 30 days, per song and per album (once per library load)
let _rfRecent = null;
function _rfRecentPlays() {
  if (_rfRecent && _rfRecent.plays === allPlays && _rfRecent.len === allPlays.length) return _rfRecent;
  const since = Date.now() - RF_STILL_RECENT, songs = new Map(), albums = new Map();
  for (const p of allPlays) {
    if (!p.date || +p.date < since) continue;
    const sk = songKey(p);
    songs.set(sk, (songs.get(sk) || 0) + 1);
    if (p.album && p.album !== '—') { const ak = albumKeyOf(p); albums.set(ak, (albums.get(ak) || 0) + 1); }
  }
  return _rfRecent = { plays: allPlays, len: allPlays.length, songs, albums };
}

// Everything due a check, most played lately first
function rfStillDue() {
  if (!allPlays || !allPlays.length) return [];
  const R = _rfRecentPlays(), old = Date.now() - RF_STILL_AGE, out = [];
  for (const [k, n] of R.songs) {
    if (n < RF_STILL_PLAYS || _rfStillSkip.has('s:' + k)) continue;
    const s = ratingSongScore(k);
    if (s == null) continue;
    const at = rfScoredAt('song', k);
    if (at && at < old) out.push({ kind: 'song', key: k, score: s, at, n });
  }
  for (const [k, n] of R.albums) {
    if (n < RF_STILL_PLAYS * 2 || _rfStillSkip.has('a:' + k) || !_rfAlbumYours(k)) continue;
    const at = rfScoredAt('album', k);
    if (at && at < old) out.push({ kind: 'album', key: k, score: ratingAlbumScore(k).score, at, n });
  }
  return out.sort((a, b) => b.n - a.n);
}
function rfStillOf(kind, key) {
  if (_rfStillSkip.has((kind === 'album' ? 'a:' : 's:') + key)) return null;
  return rfStillDue().find(x => x.kind === kind && x.key === key) || null;
}

function _rfStillName(x) {
  if (x.kind === 'song') return ratingSongNames(x.key);
  const [title, artist = ''] = x.key.split('|||');
  return { title, artist };
}
function _rfStillBody(x, where) {
  const nm = _rfStillName(x), k = esc(JSON.stringify(x.key));
  return `<p class="rf-still-say">${esc(t('rf_still_say', { date: fmt(tzDate(new Date(x.at))), n: x.n }))}</p>
    <div class="rf-still-q"><b>${esc(t('rf_still_q', { score: ratingFmt(x.score) }))}</b>
      <span class="rf-agree-btns">
        <button type="button" class="rf-agree-b is-main" onclick="rfStillYes('${x.kind}', ${k}, '${where}')">✓ ${esc(t('rf_still_yes'))}</button>
        <button type="button" class="rf-agree-b" onclick="rfStillRerate('${x.kind}', ${k})">${esc(t('rf_still_rerate'))}</button>
        <button type="button" class="rf-agree-b is-plain" onclick="rfStillSkip('${x.kind}', ${k}, '${where}')">${esc(t('rf_still_later'))}</button>
      </span></div>`;
}

// On the item's own Rating tab
function rfStillHTML(kind, key) {
  const x = rfStillOf(kind, key);
  return x ? `<div class="rf-still rf-still--tab">${_rfStillBody(x, 'tab')}</div>` : '';
}

// The Ratings page card: one at a time
function rfStillCardHTML() {
  const due = rfStillDue();
  if (!due.length) return '';
  const x = due[0], nm = _rfStillName(x);
  return `<div class="rf-card rf-still" id="rfStillCard">
    <div class="rf-card-k">🔁<span>${esc(t('rf_still_title'))}</span><span class="rf-card-n">${due.length}</span></div>
    <div class="rf-agree-item">
      <span class="am-art rf-agree-art" id="rfStillArt"><span class="thumb-initials">${esc(initials(nm.title))}</span></span>
      <button type="button" class="rf-agree-txt" onclick="${x.kind === 'album' ? 'openAlbumModal' : 'openSongModal'}(${esc(JSON.stringify(x.key))})"><b>${esc(nm.title)}</b><span>${x.kind === 'album' ? '💿 ' : ''}${esc(nm.artist)}</span></button>
      ${ratingChip(x.score)}
    </div>
    ${_rfStillBody(x, 'page')}
  </div>`;
}
function rfStillCardFill() {
  const x = rfStillDue()[0];
  if (!x) return;
  const nm = _rfStillName(x);
  rfArt(document.getElementById('rfStillArt'), x.kind, nm.title, nm.artist, x.kind === 'song' ? rfSongAlbum(x.key) : '');
}
function _rfStillRefresh(where, kind, key) {
  if (where === 'page') {
    const el = document.getElementById('rfStillCard');
    if (el) { const html = rfStillCardHTML(); if (html) { el.outerHTML = html; rfStillCardFill(); } else el.remove(); }
  } else {
    if (kind === 'song' && typeof renderSongRatingSection === 'function') renderSongRatingSection(key);
    if (kind === 'album' && typeof renderAlbumRatingSection === 'function') renderAlbumRatingSection(key);
  }
}
function rfStillYes(kind, key, where) {
  _rfFun().ok[(kind === 'album' ? 'a:' : 's:') + key] = Date.now();
  _rfFunTouch();
  ratingsPersist(true);
  if (typeof dcPlToast === 'function') dcPlToast(t('rf_still_kept'));
  _rfStillRefresh(where, kind, key);
}
function rfStillSkip(kind, key, where) {
  _rfStillSkip.add((kind === 'album' ? 'a:' : 's:') + key);
  _rfStillRefresh(where, kind, key);
}
function rfStillRerate(kind, key) {
  // This visit: don't ask again while the window is open
  _rfStillSkip.add((kind === 'album' ? 'a:' : 's:') + key);
  openRatingModal(kind, key);
}
window.rfStillYes = rfStillYes;
window.rfStillSkip = rfStillSkip;
window.rfStillRerate = rfStillRerate;

// ── Well-timed nudges (20) ───────────────────────────────────────────────
/* Ask at the right moment, at most once a day (fun.told.nudge):
     1. a song you haven't scored is #1 on your weekly chart this week
     2. else, an album you haven't scored was played through 3 times or more
        in the last 7 days (plays ≥ 3 × the tracks you play from it, 4
        tracks or more)
   The same song or album is never nudged twice (fun.told.nudged keeps the
   last RF_NUDGE_KEEP). Looked for at most every RF_NUDGE_EVERY while the
   site is open; the weekly chart run is the charts' own cached one. */
const RF_NUDGE_EVERY = 3 * 3600 * 1000;
const RF_NUDGE_KEEP = 60;
let _rfNudgeTried = 0;

function _rfNudgeFind() {
  const f = _rfFun(), seen = new Set(f.told.nudged || []);
  // 1. This week's #1
  try {
    const run = typeof _crFull === 'function' ? _crFull('week') : null;
    const songs = run && run.result && run.result.songs;
    if (songs) {
      const wk = playWeekKey(new Date());
      for (const [k, d] of Object.entries(songs)) {
        const cur = d.entries && d.entries.find(e => e.periodKey === wk);
        if (!cur || cur.rank !== 1 || seen.has('s:' + k) || ratingSongScore(k) != null) continue;
        const nm = ratingSongNames(k);
        return { kind: 'song', key: k, why: 'no1', title: nm.title, artist: nm.artist };
      }
    }
  } catch (e) { /* no chart yet: try the album rule */ }
  // 2. An album played through three times this week
  const since = Date.now() - 7 * RF_DAY_MS, plays = new Map();
  for (let i = allPlays.length - 1; i >= 0; i--) {
    const p = allPlays[i];
    if (!p.date || +p.date < since) continue;
    if (!p.album || p.album === '—') continue;
    const ak = albumKeyOf(p);
    plays.set(ak, (plays.get(ak) || 0) + 1);
  }
  let best = null;
  for (const [ak, n] of plays) {
    const tracks = ratingAlbumTrackKeys(ak).length;
    if (tracks < 4 || n < tracks * 3 || seen.has('a:' + ak) || _rfAlbumYours(ak)) continue;
    if (!best || n / tracks > best.times) best = { kind: 'album', key: ak, why: 'thrice', times: n / tracks };
  }
  if (best) { const [title, artist = ''] = best.key.split('|||'); return { ...best, title, artist, times: Math.floor(best.times) }; }
  return null;
}

function _rfWatchNudge() {
  const f = _rfFun(), d = rfToday();
  if (f.told.nudge === d || Date.now() - _rfNudgeTried < RF_NUDGE_EVERY) return;
  _rfNudgeTried = Date.now();
  const x = _rfNudgeFind();
  if (!x) return;
  f.told.nudge = d;
  f.told.nudged = [...(f.told.nudged || []), (x.kind === 'album' ? 'a:' : 's:') + x.key].slice(-RF_NUDGE_KEEP);
  _rfFunTouch();
  ratingsPersist(true);
  dcNotify({ kind: 'rt_nudge', why: x.why, title: x.title, artist: x.artist, times: x.times || 0,
    link: { tab: 'rfun', what: 'rate', kind: x.kind, key: x.key } });
}
_rfWatchers.push(_rfWatchNudge);

// The link: the song or album's window, ready to score
_rfFollowers.rate = link => {
  if (link.kind === 'album') {
    openAlbumModal(link.key);
    if (window.dcPanelShowTab) dcPanelShowTab('album', 'rating');
  } else {
    openSongModal(link.key);
    openRatingModal('song', link.key);
  }
};

// ── Shared: share pictures (weekly report, critic card) ──────────────────
/* One preview window for the rating pictures, built like the site's other
   share windows (cert-plaque.js): the card is drawn at full size into a
   hidden node, the same markup is scaled into the preview, and the picture
   is made from the hidden node with shCapture (html2canvas). The card
   markup uses inline styles and fixed colours only (html2canvas can't read
   color-mix), no letter-spacing on display text, and artwork inlined as
   data URLs (_rfShArt). */
let _rfSh = null;   // { title, file, draw(fmt) → html, fmt }
const RF_SH_FMTS = ['post', 'portrait', 'story'];
function _rfShEnsure() {
  if (document.getElementById('rfShareModal')) return;
  const wrap = document.createElement('div');
  wrap.innerHTML = `<div class="ig-modal-overlay rf-sh-modal" id="rfShareModal" role="dialog" aria-modal="true" aria-labelledby="rfShareTitle">
    <div class="dc-modal ig-modal-box">
      <div class="ig-modal-header">
        <h3 id="rfShareTitle"></h3>
        <button class="dc-btn dc-btn-plain dc-btn-icon dc-modal-close ig-modal-close" onclick="rfShareClose()" aria-label="${esc(t('set_close'))}">✕</button>
      </div>
      <div class="ig-modal-body">
        <div class="ig-preview-panel">
          <div class="ig-preview-label">${esc(t('ig_preview_label'))}</div>
          <div class="ig-preview-frame" id="rfShFrame"><div class="ig-preview-inner" id="rfShInner"></div></div>
        </div>
        <div class="ig-controls-panel">
          <div class="sh-group">
            <div class="sh-group-title">${esc(t('ig_format'))}</div>
            <div class="dc-seg dc-seg-fill sh-seg" id="rfShFmt">${RF_SH_FMTS.map(f => `<button class="sh-seg-btn" data-fmt="${f}" onclick="rfShareFmt('${f}')">${esc(t('sh_fmt_' + f))}</button>`).join('')}</div>
          </div>
        </div>
      </div>
      <div class="ig-modal-footer">
        <button class="dc-btn dc-btn-plain" onclick="rfShareClose()">${esc(t('btn_cancel'))}</button>
        <button class="dc-btn dc-btn-normal" id="rfShCopyBtn" onclick="rfShareCopy()">${esc(t('sh_copy'))}</button>
        <button class="dc-btn dc-btn-normal ig-share-native-btn" id="rfShShareBtn" onclick="rfShareNative()">${esc(t('sh_share'))}</button>
        <button class="dc-btn dc-btn-main" id="rfShDownloadBtn" onclick="rfShareDownload()">${esc(t('btn_download_image'))}</button>
      </div>
    </div>
  </div>
  <div id="rfShareCanvas" class="share-stage"></div>`;
  while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  const m = document.getElementById('rfShareModal');
  m.addEventListener('click', e => { if (e.target === m) rfShareClose(); });
  m.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); rfShareClose(); } });
}
function rfShareOpen(opts) {
  _rfShEnsure();
  let fmt = 'portrait';
  try { fmt = localStorage.getItem('dc_rf_sh_fmt') || fmt; } catch (e) {}
  if (!RF_SH_FMTS.includes(fmt)) fmt = 'portrait';
  _rfSh = { ...opts, fmt };
  document.getElementById('rfShareTitle').textContent = opts.title;
  document.getElementById('rfShareModal').classList.add('open');
  _rfShRender();
  setTimeout(() => document.getElementById('rfShDownloadBtn')?.focus(), 40);
}
function rfShareClose() {
  const m = document.getElementById('rfShareModal');
  if (m) m.classList.remove('open');
  const c = document.getElementById('rfShareCanvas');
  if (c) c.innerHTML = '';
  _rfSh = null;
}
function rfShareFmt(f) {
  if (!_rfSh || !RF_SH_FMTS.includes(f)) return;
  _rfSh.fmt = f;
  try { localStorage.setItem('dc_rf_sh_fmt', f); } catch (e) {}
  _rfShRender();
}
function _rfShRender() {
  if (!_rfSh) return;
  document.querySelectorAll('#rfShFmt .sh-seg-btn').forEach(b => b.classList.toggle('active', b.dataset.fmt === _rfSh.fmt));
  const html = _rfSh.draw(_rfSh.fmt);
  const canvas = document.getElementById('rfShareCanvas'), d = shDims(_rfSh.fmt);
  canvas.style.width = d.w + 'px'; canvas.style.height = d.h + 'px';
  canvas.innerHTML = html;
  shFitPreview('rfShFrame', 'rfShInner', _rfSh.fmt, html);
  if (typeof shPrepareShare === 'function') shPrepareShare('rfShareCanvas', 'rfShShareBtn', _rfShOpts);
}
// Redraw once artwork has arrived
function rfShareRefresh() { if (_rfSh && document.getElementById('rfShareModal')?.classList.contains('open')) _rfShRender(); }
function _rfShOpts() { return { format: _rfSh.fmt, quality: 2, fileName: `dankcharts_${_rfSh.file}_${_rfSh.fmt}.png` }; }
async function rfShareDownload() {
  if (!_rfSh) return;
  const btn = document.getElementById('rfShDownloadBtn'), orig = btn.textContent;
  btn.textContent = '⏳ …'; btn.disabled = true;
  try {
    const cvs = await shCapture('rfShareCanvas', _rfSh.fmt, 2);
    const a = document.createElement('a');
    a.download = _rfShOpts().fileName;
    a.href = cvs.toDataURL('image/png');
    a.click();
  } catch (e) { console.error('[dankcharts] rating picture failed', e); }
  btn.textContent = orig; btn.disabled = false;
}
async function rfShareCopy() {
  if (!navigator.clipboard || !navigator.clipboard.write) { rfShareDownload(); return; }
  const btn = document.getElementById('rfShCopyBtn'), orig = btn.textContent;
  btn.textContent = '…'; btn.disabled = true;
  try {
    const cvs = await shCapture('rfShareCanvas', _rfSh.fmt, 2);
    const blob = await shCanvasBlob(cvs);
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    btn.textContent = '✓ ' + t('sh_copied');
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1800);
  } catch (e) { btn.textContent = orig; btn.disabled = false; rfShareDownload(); }
}
function rfShareNative() { shShareNow('rfShareCanvas', 'rfShShareBtn', _rfShOpts, rfShareDownload); }

// Artwork for a picture, as a data URL (cached for the visit)
const _rfShArtCache = new Map();
async function _rfShArt(kind, title, artist) {
  const id = kind + '|' + title + '|' + artist;
  if (_rfShArtCache.has(id)) return _rfShArtCache.get(id);
  let url = null;
  try {
    const raw = await _igFetchArtWithFallback(kind === 'album' ? 'albums' : kind === 'artist' ? 'artists' : 'songs',
      kind === 'album' ? { album: title, artist } : kind === 'artist' ? { name: title } : { title, artist });
    url = raw ? (await _igToDataUrl(raw)) || null : null;
  } catch (e) { url = null; }
  _rfShArtCache.set(id, url);
  return url;
}

// Picture parts (inline styles, fixed colours)
const RF_SH = { bg: '#100e1e', panel: '#1c1932', line: '#34305a', text: '#f1effa', text2: '#b9b5d6', text3: '#8a85ad', accent: '#8d7dff', gold: '#f5c451' };
function _rfShHex(score) { const b = ratingBand(score); return b ? RT_CARD_BAND_HEX[b.key][0] : RF_SH.text3; }
function _rfShChip(score, size) {
  const c = _rfShHex(score), s = size || 30;
  return `<span style="display:inline-block;min-width:${Math.round(s * 2.6)}px;padding:${Math.round(s * .18)}px ${Math.round(s * .4)}px;border-radius:${Math.round(s * .3)}px;border:3px solid ${c};color:${c};font:800 ${s}px/1.15 ${SH_FONT.mono};text-align:center;background:${c}22;">${ratingFmt(score)}</span>`;
}
function _rfShCover(url, label, size) {
  return url ? `<img src="${url}" alt="" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:${Math.round(size * .12)}px;display:block;flex-shrink:0;">`
    : `<span style="width:${size}px;height:${size}px;border-radius:${Math.round(size * .12)}px;background:${RF_SH.line};color:${RF_SH.text3};display:flex;align-items:center;justify-content:center;font:800 ${Math.round(size * .3)}px ${SH_FONT.sans};flex-shrink:0;">${esc(initials(label || ''))}</span>`;
}
function _rfShFrame(fmt, inner) {
  const d = shDims(fmt);
  return `<div style="width:${d.w}px;height:${d.h}px;position:relative;overflow:hidden;background:radial-gradient(120% 70% at 20% 0%, #2a2160 0%, ${RF_SH.bg} 60%);font-family:${SH_FONT.sans};color:${RF_SH.text};">
    <div style="position:absolute;left:72px;right:72px;top:${shSafeTop(fmt) + 20}px;bottom:${shSafeBottom(fmt) + 90}px;display:flex;flex-direction:column;justify-content:center;gap:${fmt === 'post' ? 26 : 38}px;">${inner}</div>
    <div style="position:absolute;left:0;right:0;bottom:${shSafeBottom(fmt)}px;display:flex;justify-content:center;">${shBrandLockup({ text: '#ffffff', accent: RF_SH.accent, dark: true }, { size: 30 })}</div>
  </div>`;
}
function _rfShRow(art, kicker, name, sub, right) {
  return `<div style="display:flex;align-items:center;gap:26px;padding:22px 26px;border-radius:26px;background:${RF_SH.panel};border:2px solid ${RF_SH.line};">
    ${art}
    <div style="flex:1;min-width:0;">
      <div style="font:700 22px ${SH_FONT.mono};color:${RF_SH.text3};text-transform:uppercase;">${esc(kicker)}</div>
      <div style="font:800 38px/1.15 ${SH_FONT.display};color:${RF_SH.text};overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${esc(name)}</div>
      <div style="font:500 26px ${SH_FONT.sans};color:${RF_SH.text2};overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${esc(sub)}</div>
    </div>
    ${right}
  </div>`;
}
window.rfShareClose = rfShareClose;
window.rfShareFmt = rfShareFmt;
window.rfShareDownload = rfShareDownload;
window.rfShareCopy = rfShareCopy;
window.rfShareNative = rfShareNative;

// ── Weekly critic's report (9) ───────────────────────────────────────────
/* Every week (the user's own week start): what you rated last week, your
   highest and harshest call, and your biggest surprise against your
   listening. A notification when a new week starts (if last week had any
   scores), the report itself on the full-screen stage, and a picture to
   share. Built from the score history (and, for scores from before it
   existed, when the entry was last edited). */
function rfWeekStart(offsetWeeks) { return dyShift(playWeekKey(new Date()), -7 * (offsetWeeks || 0)); }

function rfReportData(weekStart) {
  const end = dyShift(weekStart, 7), inWeek = t => { const d = rfDayOf(t); return d >= weekStart && d < end; };
  const keys = new Map();   // id → { kind, key }
  for (const [id, arr] of Object.entries(_ratings.hist || {})) {
    if (Array.isArray(arr) && arr.some(p => inWeek(p.t))) keys.set(id, { kind: id[0] === 'a' ? 'album' : 'song', key: id.slice(2) });
  }
  for (const [k, e] of Object.entries(_ratings.songs)) if (e && e.ts && inWeek(e.ts) && !keys.has('s:' + k)) keys.set('s:' + k, { kind: 'song', key: k });
  for (const [k, e] of Object.entries(_ratings.albums)) if (e && e.ts && inWeek(e.ts) && !keys.has('a:' + k)) keys.set('a:' + k, { kind: 'album', key: k });
  const items = [];
  for (const x of keys.values()) {
    if (x.kind === 'album' && (!_rfAlbumYours(x.key) || ratingAlbumTrackKeys(x.key).length < 3)) continue;
    const s = rfOwnScore(x.kind, x.key);
    if (s == null) continue;
    const nm = x.kind === 'album' ? { title: x.key.split('|||')[0], artist: x.key.split('|||')[1] || '' } : ratingSongNames(x.key);
    const lsv = typeof asOn === 'function' && asOn() ? (x.kind === 'album' ? asAlbumLs(x.key) : asSong(x.key)?.score) : null;
    const e = x.kind === 'album' ? _ratings.albums[x.key] : _ratings.songs[x.key];
    items.push({ ...x, ...nm, score: s, ls: lsv == null ? null : lsv, line: e && (e.line || '').trim() ? e : null });
  }
  if (!items.length) return null;
  const by = (a, b) => b.score - a.score;
  const sorted = [...items].sort(by);
  // The biggest surprise, but not the song already shown as highest / harshest
  const high = sorted[0], low = sorted.length > 1 ? sorted[sorted.length - 1] : null;
  const surprise = items.filter(x => x.ls != null && x !== high && x !== low).sort((a, b) => Math.abs(b.score - b.ls) - Math.abs(a.score - a.ls))[0] || null;
  const hits = Object.keys(_rfHits()).filter(d => d >= weekStart && d < end).length;
  return {
    weekStart, end, n: items.length,
    songs: items.filter(x => x.kind === 'song').length, albums: items.filter(x => x.kind === 'album').length,
    high, low,
    surprise: surprise && Math.abs(surprise.score - surprise.ls) >= 1 ? surprise : null,
    line: items.find(x => x.line) || null,
    avg: Math.round(items.reduce((a, x) => a + x.score, 0) / items.length * 10) / 10,
    hits, streak: rfStreak().cur
  };
}
function _rfWeekLabel(ws) {
  const a = new Date(ws + 'T12:00:00'), b = new Date(dyShift(ws, 6) + 'T12:00:00');
  return `${fmt(a)} – ${fmt(b)}`;
}

let _rfRep = null;   // the report on screen
function rfReportOpen(weekStart) {
  const ws = weekStart || rfWeekStart(1);
  const R = rfReportData(ws);
  _rfRep = R;
  if (!R) {
    rfStageOpen(`<div class="rf-end"><div class="rf-end-burst" aria-hidden="true">📰</div><h2 class="rf-end-h">${esc(t('rf_rep_none'))}</h2>
      <p class="rf-end-sub">${esc(_rfWeekLabel(ws))}</p><div class="rf-end-btns"><button type="button" class="dc-btn dc-btn-main" data-rf-focus onclick="rfStageClose();rfRushOpen()">⚡ ${esc(t('rf_rush_title'))}</button></div></div>`, { label: t('rf_rep_title') });
    return;
  }
  const row = (kicker, x, right, id) => x ? `<div class="rf-rep-row">
      <span class="rf-rep-art" id="${id}"><span class="thumb-initials">${esc(initials(x.title))}</span></span>
      <button type="button" class="rf-rep-txt" onclick="rfStageClose();${x.kind === 'album' ? 'openAlbumModal' : 'openSongModal'}(${esc(JSON.stringify(x.key))})"><span class="rf-kicker">${esc(kicker)}</span><b>${esc(x.title)}</b><span>${x.kind === 'album' ? '💿 ' : ''}${esc(x.artist)}</span></button>
      ${right}
    </div>` : '';
  rfStageOpen(`<div class="rf-rep">
    <div class="rf-rush-top"><span class="rf-kicker">📰 ${esc(t('rf_rep_title'))}</span><span class="rf-rush-count">${esc(_rfWeekLabel(ws))}</span></div>
    <div class="rf-rep-hero">
      <span class="rf-rep-big">${R.n.toLocaleString()}</span>
      <span class="rf-rep-big-l">${esc(t(R.n === 1 ? 'rf_rep_rated_one' : 'rf_rep_rated'))}<span>${esc(t('rf_rep_split', { s: R.songs, a: R.albums }))} · ${esc(t('rf_rush_avg'))} ${ratingChip(R.avg)}</span></span>
    </div>
    ${row(t('rf_rep_high'), R.high, ratingChip(R.high.score), 'rfRepA0')}
    ${row(t('rf_rep_low'), R.low, R.low ? ratingChip(R.low.score) : '', 'rfRepA1')}
    ${R.surprise ? row(t('rf_rep_surprise'), R.surprise, `<span class="rf-rep-vs">${ratingChip(R.surprise.score)}<i>vs</i>${asChip({ score: R.surprise.ls, state: 'listening' })}</span>`, 'rfRepA2') : ''}
    ${R.line ? `<p class="rf-rep-line">${rfLineHTML(R.line.line)} <span>— ${esc(R.line.title)}</span></p>` : ''}
    ${R.hits || R.streak ? `<div class="rf-rep-foot">${R.hits ? `<span>🎯 ${esc(t('rf_rep_goal', { n: R.hits }))}</span>` : ''}${R.streak ? `<span>🔥 ${esc(t('rf_rep_streak', { n: R.streak }))}</span>` : ''}</div>` : ''}
    <div class="rf-end-btns">
      <button type="button" class="dc-btn dc-btn-main" data-rf-focus onclick="rfReportShare()">📤 ${esc(t('rf_rep_share'))}</button>
      <button type="button" class="dc-btn dc-btn-normal" onclick="rfStageClose()">${esc(t('rte_done'))}</button>
    </div>
  </div>`, { label: t('rf_rep_title') });
  [R.high, R.low, R.surprise].forEach((x, i) => { if (x) rfArt(document.getElementById('rfRepA' + i), x.kind, x.title, x.artist, x.kind === 'song' ? rfSongAlbum(x.key) : ''); });
}

// The picture
function rfReportShare() {
  const R = _rfRep;
  if (!R) return;
  const art = {};
  const draw = fmt => {
    const big = fmt === 'story';
    const cover = (x, i) => _rfShCover(art[i], x.title, big ? 120 : 104);
    const rows = [
      R.high && _rfShRow(cover(R.high, 0), t('rf_rep_high'), R.high.title, R.high.artist, _rfShChip(R.high.score, 34)),
      R.low && _rfShRow(cover(R.low, 1), t('rf_rep_low'), R.low.title, R.low.artist, _rfShChip(R.low.score, 34)),
      R.surprise && fmt !== 'post' && _rfShRow(cover(R.surprise, 2), t('rf_rep_surprise'), R.surprise.title, `${t('rf_gap_you')} ${ratingFmt(R.surprise.score)} · ${t('rf_gap_ls')} ${ratingFmt(R.surprise.ls)}`, '')
    ].filter(Boolean).join('');
    return _rfShFrame(fmt, `
      <div style="font:700 26px ${SH_FONT.mono};color:${RF_SH.accent};text-transform:uppercase;">${esc(t('rf_rep_title'))}</div>
      <div style="font:600 30px ${SH_FONT.sans};color:${RF_SH.text2};margin-top:-14px;">${esc(_rfWeekLabel(R.weekStart))}</div>
      <div style="display:flex;align-items:baseline;gap:22px;">
        <span style="font:800 ${big ? 190 : 150}px/0.9 ${SH_FONT.display};color:${RF_SH.text};">${R.n}</span>
        <span style="font:800 44px/1.1 ${SH_FONT.display};color:${RF_SH.text};">${esc(t(R.n === 1 ? 'rf_rep_rated_one' : 'rf_rep_rated'))}<br><span style="font:500 28px ${SH_FONT.sans};color:${RF_SH.text2};">${esc(t('rf_rep_split', { s: R.songs, a: R.albums }))}</span></span>
      </div>
      ${rows}
      ${R.hits || R.streak ? `<div style="display:flex;gap:40px;font:600 30px ${SH_FONT.sans};color:${RF_SH.text2};">${R.hits ? `<span>🎯 ${esc(t('rf_rep_goal', { n: R.hits }))}</span>` : ''}${R.streak ? `<span>🔥 ${esc(t('rf_rep_streak', { n: R.streak }))}</span>` : ''}</div>` : ''}`);
  };
  rfShareOpen({ title: t('rf_rep_title'), file: 'week_in_ratings', draw });
  [R.high, R.low, R.surprise].forEach((x, i) => { if (x) _rfShArt(x.kind, x.title, x.artist).then(u => { art[i] = u; rfShareRefresh(); }); });
}

// Monday (the first visit of a new week): tell about last week, once
function _rfWatchReport() {
  const f = _rfFun(), cur = rfWeekStart(0);
  if (f.told.report === cur) return;
  f.told.report = cur;
  _rfFunTouch();
  ratingsPersist(true);
  const R = rfReportData(rfWeekStart(1));
  if (!R) return;
  dcNotify({ kind: 'rt_report', n: R.n, week: R.weekStart, link: { tab: 'rfun', what: 'report', week: R.weekStart } });
}
_rfWatchers.push(_rfWatchReport);
_rfFollowers.report = link => rfReportOpen(link.week);

// The way in on the Ratings page (last week, when it had scores)
function rfReportPromoHTML() {
  const R = rfReportData(rfWeekStart(1));
  if (!R) return '';
  return `<button type="button" class="rf-promo rf-promo--rep" onclick="rfReportOpen()">
    <span class="rf-promo-ico" aria-hidden="true">📰</span>
    <span class="rf-promo-txt"><b>${esc(t('rf_rep_title'))}</b><span>${esc(t('rf_rep_promo', { n: R.n, range: _rfWeekLabel(R.weekStart) }))}</span></span>
    <span class="rf-promo-go">${esc(t('rf_rep_open'))} ▸</span>
  </button>`;
}
window.rfReportOpen = rfReportOpen;
window.rfReportShare = rfReportShare;

// ── Critic profile card (14) ─────────────────────────────────────────────
/* A picture of your taste: your average and what kind of critic that makes
   you (rfScale), your level, your three top albums (songs when you have
   fewer than three albums), and your hottest take — the score furthest
   from your listening. Your own scores only. */
function rfCriticData() {
  const sum = ratingLibrarySummary('yours');
  const scale = rfScale(sum);
  const counts = rfOwnCounts();
  const level = rfLevel(counts.all);
  const albums = (sum.yours.albums || []).filter(a => _rfAlbumYours(a.key)).sort((a, b) => b.score - a.score || (b.plays || 0) - (a.plays || 0));
  const useAlb = albums.length >= 3;
  const top = (useAlb ? albums : (sum.yours.songs || [])).slice(0, 3).map(x => ({
    kind: useAlb ? 'album' : 'song', key: x.key, title: x.name || x.title, artist: x.artist, score: x.score }));
  // Hottest take: every own score against its Listening Score, biggest gap
  let hot = null;
  if (typeof asOn === 'function' && asOn()) {
    const consider = (kind, key, title, artist, own, ls) => {
      if (ls == null) return;
      const d = Math.abs(own - ls);
      if (d >= 2 && (!hot || d > hot.d)) hot = { kind, key, title, artist, own, ls, d };
    };
    for (const a of albums) consider('album', a.key, a.name, a.artist, a.score, asAlbumLs(a.key));
    for (const s of (sum.yours.songs || [])) consider('song', s.key, s.title, s.artist, s.score, asSong(s.key)?.score);
  }
  if (!scale && !top.length) return null;
  return { scale, level, n: counts.all, top, topKind: useAlb ? 'albums' : 'songs', hot, streak: rfStreak().best,
    badges: RF_BADGES.filter(b => _rfFun().badges[b.id]).length };
}

function rfCriticPromoHTML() {
  return `<button type="button" class="rf-promo rf-promo--card" onclick="rfCriticOpen()">
    <span class="rf-promo-ico" aria-hidden="true">🪪</span>
    <span class="rf-promo-txt"><b>${esc(t('rf_card_title'))}</b><span>${esc(t('rf_card_desc'))}</span></span>
    <span class="rf-promo-go">${esc(t('rf_card_make'))} ▸</span>
  </button>`;
}

function rfCriticOpen() {
  const C = rfCriticData();
  if (!C) { if (typeof dcPlToast === 'function') dcPlToast(t('rf_card_need')); return; }
  const art = {};
  const draw = fmt => {
    const big = fmt === 'story', post = fmt === 'post';
    const sc = C.scale;
    const avg = sc ? sc.mean : null;
    const tops = C.top.map((x, i) => `<div style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:14px;">
        ${_rfShCover(art['t' + i], x.title, post ? 210 : 250)}
        ${_rfShChip(x.score, 32)}
        <div style="width:100%;text-align:center;font:800 28px/1.15 ${SH_FONT.display};color:${RF_SH.text};overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${esc(x.title)}</div>
      </div>`).join('');
    const meter = sc ? `<div style="position:relative;height:22px;margin:6px 11px 0;">
        <div style="position:absolute;left:-11px;right:-11px;top:5px;height:12px;border-radius:12px;background:linear-gradient(90deg,${RT_CARD_BAND_HEX.poor[0]},${RT_CARD_BAND_HEX.mixed[0]},${RT_CARD_BAND_HEX.masterpiece[0]});"></div>
        <div style="position:absolute;top:-4px;left:${(sc.pos * 100).toFixed(1)}%;margin-left:-15px;width:30px;height:30px;border-radius:50%;background:${RF_SH.bg};border:6px solid #ffffff;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font:600 24px ${SH_FONT.sans};color:${RF_SH.text3};margin-top:10px;"><span>${esc(t('rf_scale_harsh'))}</span><span>${esc(t('rf_scale_generous'))}</span></div>` : '';
    const hot = C.hot && !post ? _rfShRow(_rfShCover(art.hot, C.hot.title, big ? 112 : 96), t('rf_card_hot'), C.hot.title,
      `${t('rf_gap_you')} ${ratingFmt(C.hot.own)} · ${t('rf_gap_ls')} ${ratingFmt(C.hot.ls)}`, _rfShChip(C.hot.own, 30)) : '';
    return _rfShFrame(fmt, `
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <span style="font:700 26px ${SH_FONT.mono};color:${RF_SH.accent};text-transform:uppercase;">${esc(t('rf_card_title'))}</span>
        <span style="font:800 30px ${SH_FONT.display};color:${RF_SH.gold};">${esc(t('rf_lv_' + C.level.key))}</span>
      </div>
      <div style="display:flex;align-items:center;gap:34px;">
        ${avg != null ? `<span style="font:800 ${big ? 170 : 140}px/0.9 ${SH_FONT.display};color:${_rfShHex(avg)};">${ratingFmt(avg)}</span>` : ''}
        <div style="display:flex;flex-direction:column;gap:8px;min-width:0;">
          <span style="font:800 52px/1.05 ${SH_FONT.display};color:${RF_SH.text};">${esc(sc ? t('rf_scale_t_' + sc.type) : t('rf_lv_' + C.level.key))}</span>
          <span style="font:500 28px ${SH_FONT.sans};color:${RF_SH.text2};">${esc(t('rf_card_sub', { n: C.n.toLocaleString(), b: C.badges }))}</span>
          ${sc ? `<span style="font:500 28px ${SH_FONT.sans};color:${RF_SH.text2};">${esc(t('rf_card_top9', { p: sc.top9 }))}</span>` : ''}
        </div>
      </div>
      ${meter}
      ${tops ? `<div style="font:700 24px ${SH_FONT.mono};color:${RF_SH.text3};text-transform:uppercase;">${esc(t(C.topKind === 'albums' ? 'rf_card_top_albums' : 'rf_card_top_songs'))}</div>
      <div style="display:flex;gap:28px;">${tops}</div>` : ''}
      ${hot}`);
  };
  rfShareOpen({ title: t('rf_card_title'), file: 'critic_card', draw });
  C.top.forEach((x, i) => _rfShArt(x.kind, x.title, x.artist).then(u => { art['t' + i] = u; rfShareRefresh(); }));
  if (C.hot) _rfShArt(C.hot.kind, C.hot.title, C.hot.artist).then(u => { art.hot = u; rfShareRefresh(); });
}
window.rfCriticOpen = rfCriticOpen;
