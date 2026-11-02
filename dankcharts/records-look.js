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
const RECX_NO_PODIUM = ['recNewChartsSection', 'recMilestonesSection']; // own podium / a timeline
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
  if (rows.some(function (r) { return !r; })) return null;   // needs a #4 to go on with
  const top = rows.slice(0, 3);
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
  const html = '<div class="rec1-podium recx-podium" data-rec1-podium-for="' + table.id + '">'
    + card(top[0], recs[0], 0)
    + '<div class="rec1-runners">' + card(top[1], recs[1], 1) + card(top[2], recs[2], 2) + '</div></div>';
  return { html: html, rows: top, loads: loads };
}

function recxPodiums(sec) {
  if (RECX_NO_PODIUM.indexOf(sec.id) !== -1) return;
  sec.querySelectorAll('table.rec-table').forEach(function (table) {
    if (!recxVisible(table) || !table.tBodies[0]) return;
    if (table.classList.contains('nc-sd-table') || table.classList.contains('rec1-table')) return;
    recxBars(table);
    if (table.dataset.recxPod) return;
    table.dataset.recxPod = '1';
    const pod = recxPodiumFor(table);
    if (!pod) return;
    const anchor = table.closest('.app-table-wrap') || table;
    anchor.insertAdjacentHTML('beforebegin', pod.html);
    pod.rows.forEach(function (r) { r.classList.add('rec1-podium-row'); });
    table.classList.add('rec1-podium-on');
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
