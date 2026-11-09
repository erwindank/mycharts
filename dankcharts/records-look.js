/* ===========================================================================
   RECORDS LOOK - PHASE 20 (2026-11-02)
   ===========================================================================
   All #1s was rebuilt by hand in app.js (rec1*: a sentence that tells the
   record, one row of switches, a podium for the top three, a list with bars).
   The other nine Records sections are built by nine different builders, most
   of them tables with their own columns, so instead of rewriting each one,
   this file lays the same look over what they build:

     recxInitFrames()  once: the frame. A sentence under the title, every
                       switch in one row, Show at the foot, no − buttons.
     recxSync()        after every build and every switch: rewrites the
                       sentence for the record on screen.

   Everything here reads the built tables (the same way the hero reel does)
   rather than the source maps, so a section that changes its columns keeps
   working, in every language, for Last.fm, Google Sheets and CSV alike.
   app.js calls in through `typeof recxSync === 'function'` guards, so the
   page still works if this file fails to load.
   =========================================================================== */

// The sections that wear the shared frame. All #1s has its own (rec1*).
const RECX_SECTIONS = [
  'recPAKSection', 'recAppearancesSection', 'recDebutsSection', 'recNewChartsSection',
  'recPeakPlaysSection', 'recFastestSection', 'recStreaksSection', 'recMilestonesSection',
  'recCertsSection'
];
/* Sections whose open panel shows one record at a time. Their inner record
   title and its −/+ button step aside (the sentence names the record), as in
   All #1s. New Charts shows ten records per panel and Certifications a
   leaderboard plus the wall, so they keep their titles. */
const RECX_ONE_RECORD = [
  'recPAKSection', 'recAppearancesSection', 'recDebutsSection', 'recPeakPlaysSection',
  'recFastestSection', 'recStreaksSection', 'recMilestonesSection', 'recCertsSection'
];

/* ── The frame ─────────────────────────────────────────────────────────
   Moves the static parts of each section in index.html into the All #1s
   shape. Runs once; the section bodies it wraps are refilled by every build,
   but the wrapper itself is never replaced. */
function recxInitFrames() {
  RECX_SECTIONS.forEach(function (id) {
    const sec = document.getElementById(id);
    if (!sec || sec.dataset.recxReady) return;
    sec.dataset.recxReady = '1';
    sec.classList.add('rec1', 'recx');
    if (RECX_ONE_RECORD.indexOf(id) !== -1) sec.classList.add('recx-one');
    // One section on screen at a time: nothing to collapse, and a stored
    // "collapsed" must not leave it hidden with no button to undo it.
    sec.classList.remove('collapsed');
    const col = sec.querySelector(':scope > .section-header .section-collapse-btn');
    if (col) col.remove();

    const header = sec.querySelector(':scope > .section-header');
    const sub = sec.querySelector(':scope > .section-sub');
    const body = sec.querySelector(':scope > .section-body');
    if (!header || !body) return;

    // The sentence goes straight under the title; the section's own fixed
    // description stays, smaller, under it, because it explains terms
    // ("Perfect All Kill") the sentence does not.
    const story = document.createElement('p');
    story.className = 'rec1-story recx-story';
    header.after(story);
    if (sub) { sub.classList.add('recx-about'); story.after(sub); }

    // Every switch in one row: the wrap holds the Total / In a row switch (if
    // any) and the body, and CSS lets the body's own switches join the row.
    const wrap = document.createElement('div');
    wrap.className = 'rec1-wrap recx-wrap';
    const run = sec.querySelector(':scope > .rec-run-seg');
    body.before(wrap);
    if (run) wrap.appendChild(run);
    wrap.appendChild(body);

    // Show 25 / 50 / 100 / All moves here (applyRecordsViewFilter looks for
    // .rec1-foot-show in the section on screen).
    const foot = document.createElement('div');
    foot.className = 'rec1-foot recx-foot';
    foot.innerHTML = '<span class="rec1-foot-show"></span>';
    wrap.after(foot);
  });
}

/* ── The sentence ──────────────────────────────────────────────────────
   Names the record on screen and who holds it, read off the table's own
   top row: recRowRecord() (app.js) gives the name and artist, and its
   figures are paired with their column headers, so the headline is in the
   section's own translated words. */
function recxVisible(el) { return !!(el && el.getClientRects().length); }

function recxTopRow(table) {
  const tb = table && table.tBodies[0];
  if (!tb) return null;
  // The canonical #1 (recIdx 0), wherever a column sort has moved it.
  return Array.from(tb.rows).find(function (r) {
    return r.dataset.recIdx === '0' && !r.matches(REC_DETAIL_ROW_SEL) && !r.classList.contains('mil-row-origin');
  }) || null;
}

// The record title, without its leading type icon text or "(Non-Consecutive)".
function recxTitleOf(sectionEl) {
  const tEl = sectionEl && sectionEl.querySelector('.rec-section-title');
  return tEl ? tEl.textContent.replace(/\s+/g, ' ').trim() : '';
}

function recxStoryFor(sec) {
  // The first record on screen: a visible .rec-section that holds a table.
  let recSec = Array.from(sec.querySelectorAll('.rec-section')).find(function (s) {
    return recxVisible(s) && s.querySelector('table');
  });
  let table = recSec ? recSec.querySelector('table') : null;
  let title = recxTitleOf(recSec);
  if (!table) {
    // Perfect All Kill puts its table under a caption, not a record title:
    // "Weekly Chart — 230 Perfect All Kill weeks across 96 artists".
    table = Array.from(sec.querySelectorAll('table.rec-table')).find(recxVisible);
    const cap = table && table.closest('.rec-section-sub-wrapper');
    const capEl = cap && cap.querySelector('.rec-section-sub');
    title = capEl ? capEl.textContent.replace(/\s+/g, ' ').trim() : '';
  }
  if (!table) return '';
  const row = recxTopRow(table);
  const rec = row ? recRowRecord(row) : null;
  let html = title ? '<span class="recx-eyebrow">' + esc(title) + '</span>' : '';
  if (!rec) return html;
  const fig = rec.details.length ? rec.details[pickHeadlineDetail(rec.details)] : null;
  // A bare number ("15") borrows its column's name for a unit: "15 perfect
  // all kill weeks".
  const figText = fig ? (/^[\d.,]+$/.test(fig.value) ? fig.value + ' ' + fig.label.toLowerCase() : fig.value) : '';
  const name = '<span class="rec1-gd">' + esc(rec.name) + '</span>';
  const vars = { name: name, artist: esc(rec.artist), figure: fig ? '<span class="rec1-hl">' + esc(figText) + '</span>' : '' };
  const solo = rec.type === 'artist' || rec.name === rec.artist;
  const key = fig ? (solo ? 'recx_story' : 'recx_story_by') : (solo ? 'recx_story_nofig' : 'recx_story_by_nofig');
  return html + t(key, vars);
}

/* The section on screen gets its sentence; called after every build, view
   change and switch (app.js: applyRecordsViewFilter, applyRecPerTabs, the
   switch handlers). Cheap: it reads one row. */
function recxSync() {
  RECX_SECTIONS.forEach(function (id) {
    const sec = document.getElementById(id);
    if (!sec || !sec.dataset.recxReady) return;
    const story = sec.querySelector('.recx-story');
    if (!story) return;
    if (!recxVisible(sec)) return;
    story.innerHTML = recxStoryFor(sec);
    if (!document.getElementById('recordsView').classList.contains('rec-searching')) recxPodiums(sec);
    if (id === 'recMilestonesSection') recxGroupMilestones(sec);
  });
}

/* Any click or change inside Records may have switched a pill, a period, a
   tier or the Total / In a row switch; their handlers in app.js run first
   (registered earlier), so the sentence is rewritten on the next frame. */
let _recxPending = false;
function recxSoon() {
  if (_recxPending) return;
  _recxPending = true;
  requestAnimationFrame(function () { _recxPending = false; recxSync(); });
}
document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('#recordsView')) recxSoon(); });
document.addEventListener('change', function (e) { if (e.target.closest && e.target.closest('#recordsView')) recxSoon(); });

/* ── The podium (phase 20 step 5) ──────────────────────────────────────
   The list on screen gets the All #1s podium: its #1 on a big card, #2 and
   #3 beside it, all read off the table's own top three rows. Those rows stay
   in the table, hidden while the podium is up (.rec1-podium-on), so search,
   the hero reel and the row limit see what they always saw; a column sort
   retires the podium and a sort by rank brings it back (standDownPodium /
   restorePodium in app.js, which find it by data-rec1-podium-for).
   Built only for tables actually on screen, on first sight, so a build costs
   nothing extra and only three covers are looked up per list opened. */
// Milestones is a timeline, not a ranking. (New Charts had its own podium
// until 2026-11-02; it now takes this one too.)
const RECX_NO_PODIUM = ['recMilestonesSection'];
let _recxTblN = 0, _recxPodN = 0;

// The row a record's detail (its chart run) sits in, if it has one.
function recxDetailRowOf(row) {
  const next = row.nextElementSibling;
  return next && next.matches(REC_DETAIL_ROW_SEL) ? next : null;
}

// A row's chart-run boxes, without opening the row: from the on-demand
// store (recLazy) or from the row itself once it has been opened.
function recxBoxesOf(row) {
  const det = recxDetailRowOf(row);
  if (!det) return '';
  let html = '';
  if (_recLazyHtml.has(det.id)) {
    html = _recLazyHtml.get(det.id);
    if (typeof html === 'function') { html = html(); _recLazyHtml.set(det.id, html); }
  } else html = det.innerHTML;
  return html.indexOf('cr-boxes') !== -1 ? html : '';
}

// What the picture slot asks for: the row's own ✎ picker button carries it
// when there is one; otherwise the row's data-rec-* attributes.
function recxImgItem(row, rec, imgId) {
  const btn = row.querySelector('.img-src-btn[data-type]');
  const d = btn ? btn.dataset : null;
  const type = d ? d.type : (rec.type || 'song');
  return {
    type: type,
    item: {
      imgId: imgId,
      name: d ? d.name : rec.name,
      title: d ? d.name : rec.name,
      artist: d ? d.artist : rec.artist,
      album: d ? (d.album || '') : (type === 'album' ? rec.name : ''),
      prefKey: d ? d.prefkey : rec.prefKey
    }
  };
}

// What opens the record's details window, by the keys app.js uses.
function recxOpenJs(type, rec) {
  const low = function (x) { return String(x || '').toLowerCase().trim(); };
  if (type === 'artist') return 'openArtistModal(' + esc(JSON.stringify(rec.name)) + ')';
  if (type === 'album') return 'openAlbumModal(' + esc(JSON.stringify(rec.name + '|||' + rec.artist)) + ')';
  return 'openSongModal(' + esc(JSON.stringify(low(rec.name) + '|||' + low(rec.artist))) + ')';
}

// "30 weeks" → a big "30" and "weeks"; "6h" and other short codes stay whole.
function recxFigHtml(fig) {
  if (!fig) return '';
  const v = /^[\d.,]+$/.test(fig.value) ? fig.value + ' ' + fig.label.toLowerCase() : fig.value;
  const m = v.match(/^([\d.,]+)\s+(.+)$/);
  const big = m ? m[1] : v, unit = m ? m[2] : '';
  return '<div class="rec1-fig' + (big.length > 9 ? ' is-long' : '') + '"><b>' + esc(big) + '</b>'
    + (unit ? '<span>' + esc(unit) + '</span>' : '') + '</div>';
}

function recxPodiumFor(table) {
  const rows = [0, 1, 2, 3].map(function (i) {
    return Array.from(table.tBodies[0].rows).find(function (r) {
      return r.dataset.recIdx === String(i) && !r.matches(REC_DETAIL_ROW_SEL);
    });
  });
  // Any list gets the podium, however short (2026-11-02: lists of three or
  // fewer, like a new EPs list, kept the plain table). One or two entries
  // make a smaller podium: the #1 alone, or the #1 and one runner-up
  // (.recx-pod-1 / .recx-pod-2 in style.css). When nothing is left after
  // the podium the table under it hides too (podOnly, see recxPodiums).
  const count = rows.slice(0, 3).filter(Boolean).length;
  if (!count || rows.slice(0, count).some(function (r) { return !r; })) return null;
  const top = rows.slice(0, count);
  const recs = top.map(recRowRecord);
  if (recs.some(function (r) { return !r; })) return null;
  const n = ++_recxPodN;
  const loads = [];
  const card = function (row, rec, i) {
    const imgId = 'recx-pod-' + n + '-' + i;
    const img = recxImgItem(row, rec, imgId);
    loads.push(img);
    if (i === 0) loads.push({ type: img.type, item: Object.assign({}, img.item, { imgId: imgId + '-bg' }) });
    const hi = rec.details.length ? pickHeadlineDetail(rec.details) : -1;
    const fig = hi >= 0 ? rec.details[hi] : null;
    // The other figures, one short line: "First streamed 16 Jun 2017 · …"
    const more = rec.details.filter(function (d, k) { return k !== hi; }).slice(0, 2)
      .map(function (d) { return d.label + ' ' + d.value; }).join(' · ');
    const solo = img.type === 'artist' || rec.name === rec.artist;
    const open = recxOpenJs(img.type, rec);
    // The cover opens the details too, for the mouse (the ✎ picker lands
    // inside it, so it is a box, not a button; the name is the keyboard way).
    const artOpen = 'if(!event.target.closest(\'.img-src-btn\'))' + open;
    const eaType = img.type === 'artist' ? 'artists' : img.type === 'album' ? 'albums' : 'songs';
    const ea = _eaAttrs(eaType, img.type === 'artist'
      ? { artist: rec.name, key: rec.name, imgId: imgId }
      : { title: img.type === 'song' ? rec.name : '', artist: rec.artist, album: img.item.album, key: '', imgId: imgId });
    const art = '<div class="rec1-pod-art' + (img.type === 'artist' ? ' is-round' : '') + '" id="' + imgId + '"><div class="thumb-initials">' + esc(initials(rec.name)) + '</div></div>';
    const boxes = recxBoxesOf(row);
    if (i === 0) {
      const sample = typeof _sxSampleBtn === 'function' ? _sxSampleBtn() : _eaSampleBtn();
      return '<article class="rec1-champ"' + ea + '>'
        + '<div class="rec1-champ-bg" aria-hidden="true" data-no-picker="1" id="' + imgId + '-bg"></div>'
        + '<div class="rec1-champ-art" onclick="' + artOpen + '">' + art + '<span class="rec1-medal rec1-medal-1">1</span></div>'
        + '<div class="rec1-champ-info">'
        + (fig ? '<span class="rec1-eyebrow">' + esc(fig.label) + '</span>' : '')
        + '<button type="button" class="rec1-champ-name" onclick="' + open + '">' + esc(rec.name) + '</button>'
        + (solo ? '' : '<span class="rec1-by">' + esc(rec.artist) + '</span>')
        + recxFigHtml(fig)
        + (more ? '<div class="rec1-when">' + esc(more) + '</div>' : '')
        + boxes
        + '<div class="rec1-acts">' + sample
        + '<button type="button" class="dc-btn dc-btn-normal rec1-details" onclick="' + open + '">' + esc(t('ea_details')) + '</button></div>'
        + '</div></article>';
    }
    return '<article class="rec1-runner rec1-runner-' + (i + 1) + '"' + ea + '>'
      + '<div class="rec1-runner-art" onclick="' + artOpen + '">' + art + '<span class="rec1-medal rec1-medal-' + (i + 1) + '">' + (i + 1) + '</span></div>'
      + '<div class="rec1-runner-info">'
      + '<button type="button" class="rec1-runner-name" onclick="' + open + '">' + esc(rec.name) + '</button>'
      + (solo ? '' : '<span class="rec1-by">' + esc(rec.artist) + '</span>')
      + recxFigHtml(fig)
      + (more ? '<div class="rec1-when">' + esc(more) + '</div>' : '')
      + '</div>' + _eaSampleBtn('rec1-runner-play')
      + (boxes ? '<div class="rec1-runner-run">' + boxes + '</div>' : '')
      + '</article>';
  };
  if (!table.id) table.id = 'recx-tbl-' + (++_recxTblN);
  const runners = top.slice(1).map(function (r, k) { return card(r, recs[k + 1], k + 1); }).join('');
  // The .recx-pod-room around it is the podium's own sizing room, so its
  // phone layout kicks in wherever it sits (Fastest's .fast-panel and other
  // panels are not size containers; 2026-11-02 the podium stayed two
  // columns on phones there).
  const html = '<div class="recx-pod-room"><div class="rec1-podium recx-podium' + (count < 3 ? ' recx-pod-' + count : '') + '" data-rec1-podium-for="' + table.id + '">'
    + card(top[0], recs[0], 0)
    + (runners ? '<div class="rec1-runners">' + runners + '</div>' : '') + '</div></div>';
  return { html: html, rows: top, loads: loads, podOnly: !rows[count] };
}

/* ── The plaque wall (Certifications, 2026-11-02) ──────────────────────
   Certifications does not take the podium above: its rows open onto a whole
   ledger, which the podium had no room or button for, so the top three lost
   it. Instead three equal plaques: the artist's photo, every certification
   in one big number, a bar of how it splits into 💎 / 💿 / 📀, the song and
   album tallies, and "Show every certification", which opens that artist's
   ledger full width under the wall (one at a time). The ledger is the one
   the hidden table row would open: its .certd host is borrowed into the
   wall's stage and handed back when the row's own ▶ is used
   (recxCertReturn, called by toggleCertLedger in app.js). */
const RECX_CERT_TABLE = 'rec-certs-tbl';

function recxCertWallFor(table) {
  const all = Array.from(table.tBodies[0].rows).filter(function (r) { return !r.matches(REC_DETAIL_ROW_SEL); });
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const r = all.find(function (x) { return x.dataset.recIdx === String(i); });
    if (!r || !_certLedgers[i]) break;
    rows.push(r);
  }
  if (!rows.length) return null;
  const n = ++_recxPodN;
  const loads = [];
  // One tally line: "Songs  17× 💎  19× 💿  50× 📀", zeros left out.
  const tally = function (label, d, p, g) {
    const chip = function (v, icon, cls) {
      return v ? '<span class="certw-chip certw-chip--' + cls + '"><b>' + v.toLocaleString() + '×</b> ' + icon + '</span>' : '';
    };
    const chips = chip(d, '💎', 'd') + chip(p, '💿', 'p') + chip(g, '📀', 'g');
    return '<div class="certw-tally"><span class="certw-tally-l">' + esc(label) + '</span>'
      + '<span class="certw-chips">' + (chips || '<span class="certw-none">—</span>') + '</span></div>';
  };
  const cards = rows.map(function (row, i) {
    const src = _certLedgers[i];
    const imgId = 'recx-certw-' + n + '-' + i;
    loads.push({ type: 'artist', item: { imgId: imgId, name: src.artist, title: src.artist, artist: src.artist, album: '', prefKey: 'artist:' + src.artist.toLowerCase() } });
    // Every certification the ledger lists (Gold, Platinum and each Diamond
    // are their own line there), so this number and the ledger's agree.
    const per = { d: 0, p: 0, g: 0 };
    src.songs.concat(src.albums).forEach(function (it) {
      it.events.forEach(function (ev) { per[ev.tier === 'diamond' ? 'd' : ev.tier === 'plat' ? 'p' : 'g']++; });
    });
    const total = per.d + per.p + per.g;
    const pct = function (v) { return total ? (v / total * 100).toFixed(2) : 0; };
    const open = 'openArtistModal(' + esc(JSON.stringify(src.artist)) + ')';
    return '<article class="certw-card certw-card--' + (i + 1) + '" data-certw-idx="' + i + '">'
      + '<div class="certw-head">'
        + '<div class="certw-art" onclick="if(!event.target.closest(\'.img-src-btn\'))' + open + '">'
          + '<div class="rec1-pod-art is-round" id="' + imgId + '"><div class="thumb-initials">' + esc(initials(src.artist)) + '</div></div>'
          + '<span class="rec1-medal rec1-medal-' + (i + 1) + '">' + (i + 1) + '</span>'
        + '</div>'
        + '<div class="certw-id">'
          + '<button type="button" class="certw-name" onclick="' + open + '">' + esc(src.artist) + '</button>'
          + '<div class="certw-total"><b>' + total.toLocaleString() + '</b><span>' + esc(t('certd_awards')) + '</span></div>'
        + '</div>'
      + '</div>'
      // How the total splits by tier, as one bar.
      + '<div class="certw-bar" title="💎 ' + per.d + ' · 💿 ' + per.p + ' · 📀 ' + per.g + '">'
        + (per.d ? '<i class="certw-bar--d" style="width:' + pct(per.d) + '%"></i>' : '')
        + (per.p ? '<i class="certw-bar--p" style="width:' + pct(per.p) + '%"></i>' : '')
        + (per.g ? '<i class="certw-bar--g" style="width:' + pct(per.g) + '%"></i>' : '')
      + '</div>'
      + tally(t('rec_th_song_cert'), src.sd, src.sp, src.sg)
      + tally(t('rec_th_album_cert'), src.ad, src.ap, src.ag)
      // Singles and EPs get their own line while that type is Apart (app.js
      // counts them apart from albums then)
      + separatedTypes().map(function (ty) {
          const x = ty === 'ep' ? 'e' : 'n';
          return tally(t('rec_th_' + ty + '_cert'), src[x + 'd'] || 0, src[x + 'p'] || 0, src[x + 'g'] || 0);
        }).join('')
      + '<button type="button" class="dc-btn dc-btn-normal certw-open" aria-expanded="false" onclick="recxCertToggle(this,' + i + ')">'
        + '<span class="certw-open-l">' + esc(t('certd_open_ledger')) + '</span><span class="certw-caret" aria-hidden="true">▾</span></button>'
      + '</article>';
  }).join('');
  if (!table.id) table.id = 'recx-tbl-' + (++_recxTblN);
  const html = '<div class="recx-pod-room"><div class="certw" data-rec1-podium-for="' + table.id + '">'
    + '<div class="certw-wall certw-n' + rows.length + '">' + cards + '</div>'
    + '<div class="certw-stage" hidden></div>'
    + '</div></div>';
  return { html: html, rows: rows, loads: loads, podOnly: !all.some(function (r) { return r.dataset.recIdx === String(rows.length); }) };
}

// Opens (or closes) one plaque's ledger in the stage under the wall.
function recxCertToggle(btn, idx) {
  const wall = btn.closest('.certw');
  const stage = wall && wall.querySelector('.certw-stage');
  if (!stage) return;
  const wasOpen = btn.getAttribute('aria-expanded') === 'true';
  // One ledger at a time: whatever is on the stage goes back to its row.
  Array.from(stage.querySelectorAll('.certd')).forEach(function (h) { recxCertReturn(+h.id.replace('certd-', '')); });
  wall.querySelectorAll('.certw-open').forEach(function (b) {
    b.setAttribute('aria-expanded', 'false');
    b.querySelector('.certw-open-l').textContent = t('certd_open_ledger');
    b.closest('.certw-card').classList.remove('is-open');
  });
  stage.hidden = true;
  if (wasOpen) return;
  const row = document.getElementById('rec-cert-ledger-' + idx);
  if (!row) return;
  recFillLazy(row); // the ledger's empty host, from the on-demand store
  // Closed in the table first, so the row's own ▶ and this stay in step.
  row.classList.remove('open');
  const rowBtn = row.previousElementSibling && row.previousElementSibling.querySelector('.rec-run-toggle-btn');
  if (rowBtn) { rowBtn.classList.remove('active'); rowBtn.textContent = '▶'; }
  buildCertLedger(idx);
  const host = document.getElementById('certd-' + idx);
  if (!host) return;
  stage.appendChild(host);
  stage.hidden = false;
  btn.setAttribute('aria-expanded', 'true');
  btn.querySelector('.certw-open-l').textContent = t('certw_hide_ledger');
  btn.closest('.certw-card').classList.add('is-open');
  host.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Hands a borrowed ledger back to its table row (and resets its plaque).
function recxCertReturn(idx) {
  const host = document.getElementById('certd-' + idx);
  const row = document.getElementById('rec-cert-ledger-' + idx);
  if (!host || !row || !host.closest('.certw-stage')) return;
  const stage = host.closest('.certw-stage');
  // recFillLazy puts the host straight into the row's one cell.
  (row.cells[0] || row).appendChild(host);
  if (!stage.querySelector('.certd')) stage.hidden = true;
  const b = stage.parentElement.querySelector('.certw-card[data-certw-idx="' + idx + '"] .certw-open');
  if (b) {
    b.setAttribute('aria-expanded', 'false');
    b.querySelector('.certw-open-l').textContent = t('certd_open_ledger');
    b.closest('.certw-card').classList.remove('is-open');
  }
}

function recxPodiums(sec) {
  if (RECX_NO_PODIUM.indexOf(sec.id) !== -1) return;
  sec.querySelectorAll('table.rec-table').forEach(function (table) {
    if (!recxVisible(table) || !table.tBodies[0]) return;
    if (table.classList.contains('rec1-table')) return;
    recxBars(table);
    if (table.dataset.recxPod) return;
    table.dataset.recxPod = '1';
    const pod = table.id === RECX_CERT_TABLE ? recxCertWallFor(table) : recxPodiumFor(table);
    if (!pod) return;
    const anchor = table.closest('.app-table-wrap') || table;
    anchor.insertAdjacentHTML('beforebegin', pod.html);
    pod.rows.forEach(function (r) { r.classList.add('rec1-podium-row'); });
    table.classList.add('rec1-podium-on');
    // Nothing left under the podium: hide the empty table head as well
    // (style.css; it comes back with the rows on a sort or a search).
    if (pod.podOnly) table.classList.add('recx-pod-only');
    /* A sort put back after a rebuild arrived before this podium did: if the
       table is not in rank order, the podium starts retired. */
    const ths = Array.from(table.tHead ? table.tHead.rows[0].cells : []);
    const on = ths.findIndex(function (th) { return !!th.dataset.sortDir; });
    if (on !== -1 && !(on === 0 && ths[0].dataset.sortDir === 'asc')) standDownPodium(table);
    pod.loads.forEach(function (x) {
      const el = document.getElementById(x.item.imgId);
      if (el) fetchAndInjectImage(el, x.item, x.type);
    });
  });
  if (typeof _eaPaintSamples === 'function') _eaPaintSamples();
}

/* ── Bars under the figure (phase 20 step 6) ───────────────────────────
   Each list's headline figure (its first count column) gets a bar against
   the list's #1, so "21 weeks" next to "30 weeks" reads at a glance, as in
   All #1s. Only where every row is one number with the same unit: a column
   of mixed units ("6h", "1d 0h") or of tallies would make the bars lie, so
   it gets none. The bar carries no text, so sorting, search and the hero
   reel read the cell exactly as before. */
function recxBars(table) {
  if (table.dataset.recxBars) return;
  table.dataset.recxBars = '1';
  const rows = Array.from(table.tBodies[0].rows).filter(function (r) { return !r.matches(REC_DETAIL_ROW_SEL); });
  if (rows.length < 2) return;
  const first = rows[0].querySelector('td.rec-count');
  if (!first) return;
  const col = Array.prototype.indexOf.call(rows[0].cells, first);
  let unit = null, ok = true, max = 0;
  const vals = rows.map(function (r) {
    const td = r.cells[col];
    const m = td ? td.textContent.replace(/\s+/g, ' ').trim().match(/^([\d.,]+)\s*([^\d\s]*)$/) : null;
    if (!m) { ok = false; return null; }
    if (unit === null) unit = m[2];
    else if (m[2] !== unit) ok = false;
    const v = parseFloat(m[1].replace(/,/g, ''));
    if (v > max) max = v;
    return v;
  });
  if (!ok || !max) return;
  rows.forEach(function (r, i) {
    const td = r.cells[col];
    td.classList.add('recx-fig-cell');
    td.insertAdjacentHTML('beforeend', '<span class="recx-bar" aria-hidden="true"><i style="width:' + Math.max(3, Math.round(vals[i] / max * 100)) + '%"></i></span>');
  });
}

/* ── Milestones: one row per run (phase 20 step 7) ─────────────────────
   The timeline lists every rung, so one song that took every milestone
   from 525 to 650 filled six rows in a row. A run of the same record now
   shows as its top rung, with "+5 more · 525 – 625" to unfold the rest.
   The folded rows stay in the table (search finds them, and shows them,
   since the fold only applies outside a search); a column sort unfolds
   everything, because sorted rows no longer sit in runs. */
let _recxMilN = 0;
function recxGroupMilestones(sec) {
  sec.querySelectorAll('table.mil-timeline').forEach(function (table) {
    if (!recxVisible(table) || !table.tBodies[0]) return;
    // A sort by any column breaks the runs apart: show every rung.
    const sorted = Array.from(table.tHead ? table.tHead.rows[0].cells : []).some(function (th) { return !!th.dataset.sortDir; });
    table.classList.toggle('recx-mil-unfold', sorted);
    if (table.dataset.recxGroup) return;
    table.dataset.recxGroup = '1';
    const rows = Array.from(table.tBodies[0].rows).filter(function (r) { return r.classList.contains('mil-row'); });
    let i = 0;
    while (i < rows.length) {
      const key = rows[i].dataset.recPrefkey;
      let j = i + 1;
      while (j < rows.length && key && rows[j].dataset.recPrefkey === key) j++;
      const run = rows.slice(i, j);
      if (run.length >= 3) {
        const id = 'recx-mil-' + (++_recxMilN);
        const num = function (r) { const n = r.querySelector('.milestone-number'); return n ? n.textContent.trim() : ''; };
        run.slice(1).forEach(function (r) { r.classList.add('recx-mil-folded'); r.dataset.recxGrp = id; });
        const who = run[0].querySelector('.mil-who');
        if (who) {
          who.insertAdjacentHTML('beforeend', '<button type="button" class="recx-mil-more" aria-expanded="false" data-recx-grp="' + id + '">'
            + esc(t('recx_mil_more', { n: run.length - 1, from: num(run[run.length - 1]), to: num(run[1]) })) + '</button>');
        }
      }
      i = j;
    }
  });
}
document.addEventListener('click', function (e) {
  const btn = e.target.closest && e.target.closest('.recx-mil-more');
  if (!btn) return;
  const open = btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.querySelectorAll('tr[data-recx-grp="' + btn.dataset.recxGrp + '"]').forEach(function (r) {
    r.classList.toggle('recx-mil-open', open);
  });
});

/* Opens one Records section by id, as the sidebar does: the What's New card
   for this phase calls it ("Take me there" → All #1s) after switching tabs. */
window.dcOpenRecordsView = function (view) {
  try { localStorage.setItem('dc_records_active_view', view); } catch (e) {}
  if (typeof recSearchReset === 'function') recSearchReset();
  if (typeof applyRecordsViewFilter === 'function') applyRecordsViewFilter(view);
};
