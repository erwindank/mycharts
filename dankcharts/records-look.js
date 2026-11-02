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
