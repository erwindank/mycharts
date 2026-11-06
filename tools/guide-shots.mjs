/* ═══════════════════════════════════════════════════════════════════
   CHARTS GUIDE SCREENSHOTS (GUIDE-PLAN.md)

   Takes every picture the guide's lessons use, in all four languages,
   from the real app with the demo library, and measures where each
   control sits inside each picture. The guide draws its numbered dots,
   rings and zooms from those measurements, so they land on the control
   in every language without anyone placing them by hand.

   Run (from the repo root, with the site served on :8777):
     cd dankcharts && python -m http.server 8777
     node tools/guide-shots.mjs                 every lesson, every language
     node tools/guide-shots.mjs week en         one lesson, one language
   A shot can set vp: { width, height } for its own window size.

   Writes  dankcharts/guide/<lang>/<shot>.webp      (phone shots end in -m)
           dankcharts/guide/<lang>/shots.json       { shot: { w, h, spots } }
   Spot boxes are fractions of the picture (0–1): [x, y, w, h].

   Playwright is not a dependency of the site. It is picked up from
   C:/tmp (where the earlier phase scripts live) unless PW_FROM points at
   another folder with playwright installed. Pictures are saved as PNG
   and turned into WebP by Pillow (python), the same as the What's New
   pictures.
   ═══════════════════════════════════════════════════════════════════ */
import { createRequire } from 'module';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire((process.env.PW_FROM || 'C:/tmp') + '/package.json');
const { chromium } = require('playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dankcharts', 'guide');
const URL = 'http://localhost:8777/index.html';
const LANGS = ['en', 'es', 'pt-BR', 'pt-PT'];
// Browser locale per language, so native pickers (the date picker) match too
const LOCALE = { en: 'en-GB', es: 'es-ES', 'pt-BR': 'pt-BR', 'pt-PT': 'pt-PT' };
const DPR = 1.5;           // pictures are zoomed into, so take them sharper than 1x
const DESK = { width: 1280, height: 2400 }; // tall: most shots need no scrolling, so the sticky bar stays put
const PHONE = { width: 390, height: 2000 };

/* ── Helpers used by the shot setups ─────────────────────────────── */
const wait = (pg, ms) => pg.waitForTimeout(ms);
// Nav buttons sit behind the collapsing period nav; clicking them in JS is the reliable way
const go = (pg, period) => pg.evaluate(p => document.querySelector('#periodNav button[data-period="' + p + '"]').click(), period);
const closeMenus = pg => pg.evaluate(() => {
  document.querySelectorAll('.kebab-menu-wrap.open, .kebab-menu.open').forEach(e => e.classList.remove('open'));
  document.body.click();
});
async function lastWeek(pg) {
  await go(pg, 'week'); await wait(pg, 800);
  // Last finished week: its banner says "Your week belonged to", and movement is complete
  // Songs chart in the Table layout unless a shot asks for something else
  await pg.evaluate(() => { setChartTypeView('songs'); currentOffset = 1; renderAll(); });
  // Wait for the chart, its banner and the "of the moment" cards to be drawn:
  // on a busy machine a fixed wait took pictures of a half-built page
  await pg.waitForFunction(() => document.querySelectorAll('#songsBody tr[data-ea-key]').length >= 6 &&
    document.querySelector('#statsHeroTop .sh-name') && document.querySelector('.spotlight-card'), null, { timeout: 60000 });
  await wait(pg, 1500);
}
// Any chart window at a given offset (periods back from now), Songs, ready to photograph.
// Daily uses 27 Oct 2026 (offset 9 from the 5 Nov capture day): a busy day in the demo library.
async function at(pg, period, offset, { spotlight = false } = {}) {
  await go(pg, period); await wait(pg, 900);
  await pg.evaluate(o => { setChartTypeView('songs'); currentOffset = o; renderAll(); }, offset);
  await pg.waitForFunction(sp => document.querySelectorAll('#songsBody tr[data-ea-key]').length >= 3 &&
    document.querySelector('#statsHeroTop') && (!sp || document.querySelector('.spotlight-card')), spotlight, { timeout: 60000 });
  await wait(pg, 2200);
}
const DAY_OFF = 9;
// Open a song / artist / album window on one of its tabs, ready to photograph
// Unfold the pop-up windows: on screen they are capped at the window height and
// scroll inside, which would cut every picture off at the fold
async function unfold(pg, on) {
  await pg.evaluate(on => {
    document.getElementById('gdUnfold')?.remove();
    if (!on) return;
    const st = document.createElement('style'); st.id = 'gdUnfold';
    st.textContent = '.dp-overlay.open,#streakModal.open{align-items:flex-start!important;overflow:visible!important;position:absolute!important;height:auto!important}' +
      '.dp-overlay .dc-modal,#streakModal .dc-modal{max-height:none!important;height:auto!important}' +
      '.dp-overlay .dp-scroll,.dp-overlay .dp-body,#streakModal .modal-body,#streakModal .sk-tab-pane{max-height:none!important;height:auto!important;overflow:visible!important}';
    document.head.appendChild(st);
  }, on);
}
// Long lists (an artist's 120 songs) stay folded: the window at its normal height
async function win(pg, kind, arg, tab, { full = true } = {}) {
  await lastWeek(pg);
  const fn = { song: 'openSongModal', artist: 'openArtistModal', album: 'openAlbumModal' }[kind];
  await unfold(pg, full);
  await pg.evaluate(([fn, arg]) => window[fn](arg), [fn, arg]); await wait(pg, 3800);
  if (tab) { await pg.evaluate(id => document.getElementById(id).click(), 'dpTab-' + kind + '-' + tab); await wait(pg, 2500); }
}
const W = k => '#' + k + 'Modal';
const WBOX = k => '#' + k + 'Modal .dc-modal';
const winHead = k => ({
  art: W(k) + ' .modal-thumb-wrap', title: W(k) + ' .modal-artist-name', sub: W(k) + ' .modal-artist-sub',
  sample: W(k) + ' .dp-actions .dp-act-main', playlist: W(k) + ' .dp-actions [data-dp-act="playlist"]',
  rate: W(k) + ' .dp-actions [data-dp-act="rate"]', more: W(k) + ' .dp-actions .ea-more',
  links: W(k) + ' .dp-link', share: W(k) + ' .dp-share-card', tabs: W(k) + ' .dp-tabs', close: W(k) + ' .dp-bar button:last-child'
});

// Around the chart: pick a tab (0 Bubbling Under, 1 Off the Chart, 2 New) and leave the
// box well below the pinned bars so they don't print over it
async function atcTab(pg, i) {
  await pg.evaluate(i => { const t = document.querySelectorAll('#atcSongs .atc-tab')[i]; if (t) t.click(); }, i);
  await wait(pg, 900);
  await pg.evaluate(() => window.scrollTo(0, document.getElementById('atcSongs').getBoundingClientRect().top + scrollY - 800));
  await wait(pg, 1500);
}
async function showAll(pg) { await pg.evaluate(() => setSectionDisplayShowAll(true)); await wait(pg, 500); }
async function layout(pg, v) { await pg.evaluate(v => setWeeklyChartView(v), v); await wait(pg, 1800); }
async function openKebab(pg, tab) {
  await pg.evaluate(() => window.scrollTo(0, 0));
  await pg.click('#songsSection .kebab-menu-btn');
  await wait(pg, 300);
  if (tab) { await pg.click('#songsSection .kebab-tab[data-tab="' + tab + '"]'); await wait(pg, 300); }
}
// The Stats page on one of its tabs (overview, story, games, compare, charts), the
// 12-month range; Compare on Artists with its mode (cum, per, run, race)
async function statsTab(pg, tab, cmode = 'cum') {
  await pg.evaluate(() => { if (typeof sxGameClose === 'function' && document.getElementById('sxGameLayer')) sxGameClose(); });
  await go(pg, 'graphs'); await wait(pg, 1500);
  await pg.evaluate(() => { const b = document.querySelector('#graphRangePresets [data-range="12m"]'); if (b && !b.classList.contains('active')) b.click(); });
  await wait(pg, 600);
  await pg.evaluate(t => setStatsTab(t), tab); await wait(pg, 2500);
  if (tab === 'compare') {
    await pg.evaluate(m => {
      const ty = document.querySelector('#sxCmpType [data-ctype="artists"]'); if (ty && !ty.classList.contains('active')) ty.click();
      const b = document.querySelector('#sxCmpMode [data-cmode="' + m + '"]'); if (b && !b.classList.contains('active')) b.click();
    }, cmode);
    await wait(pg, 2500);
  }
  if (tab === 'charts') {
    await pg.evaluate(() => { const b = document.querySelector('#graphGranularity [data-gran="month"]'); if (b && !b.classList.contains('active')) b.click(); });
    await wait(pg, 1500);
  }
  await pg.waitForFunction(id => { const el = document.getElementById(id); return el && el.offsetHeight > 100; },
    { overview: 'sxOverview', story: 'sxStory', games: 'sxGames', compare: 'sxCmpMore', charts: 'heatmapCard' }[tab], { timeout: 60000 });
  await wait(pg, 1500);
}
// Records on one section (the nav's data-rec-view), built and at the top.
// A search left in the box would filter every section, so it is cleared first.
async function recView(pg, view) {
  await go(pg, 'records');
  await pg.waitForFunction(() => { const r = document.getElementById('recBuilding'); return !r || r.hidden; }, null, { timeout: 120000 });
  await pg.evaluate(() => { const c = document.getElementById('recordsSearchClear'); if (c && c.offsetParent) c.click(); });
  await pg.evaluate(v => { document.querySelector('#recordsNav [data-rec-view="' + v + '"]').click(); window.scrollTo(0, 0); }, view);
  await pg.waitForFunction(v => { const el = document.getElementById(v); return el && el.offsetHeight > 200; }, view, { timeout: 60000 });
  await wait(pg, 2500);
}
// Awards on My Grammys for the sample year, with six categories on and their
// nominees picked, and winners in the first three (done once per browser: the
// ballot is kept, so later shots find it ready). empty: another year, untouched.
const AW_ON = 'song_of_year|album_of_year|artist_of_year|new_artist|best_collab|song_summer';
async function awSetup(pg, { winners = true, empty = false } = {}) {
  // a ceremony or share window left open by the shot before
  await pg.evaluate(() => {
    const o = document.getElementById('awardsCeremonyOverlay');
    if (o && o.style.display && o.style.display !== 'none' && typeof closeCeremony === 'function') closeCeremony();
    if (typeof closeCeremonyShare === 'function') closeCeremonyShare();
    // the nominee picker from the picker shot
    if (document.querySelector('.awards-picker-modal') && typeof awardsPickerClose === 'function') awardsPickerClose();
  });
  await go(pg, 'awards'); await wait(pg, 2500);
  await pg.evaluate(() => awardsSubTab('mygrammys')); await wait(pg, 800);
  const year = await pg.evaluate(() => new Date().getFullYear() - 1);
  if (empty) { await pg.evaluate(y => _awardsSetYear('mygrammys', y), year - 1); await wait(pg, 3000); return; }
  await pg.evaluate(y => _awardsSetYear('mygrammys', y), year); await wait(pg, 2500);
  await pg.evaluate(async on => {
    const re = new RegExp('^(' + on + ')$');
    const data = await _awardsLoad(_awardsYear);
    const has = () => AWARD_CATEGORIES.some(c => re.test(c.id) && _awardsYearData[_awardsYear]?.categories[c.id]?.nominees?.length);
    if (has()) return;
    for (const c of AWARD_CATEGORIES) data.categories[c.id].enabled = re.test(c.id);
    _awardsRenderCatList(data);
    await awardsGenerateCandidates();
    // the first run can come back empty while the library settles
    if (!has()) await awardsGenerateCandidates();
  }, AW_ON);
  if (winners) await pg.evaluate(async () => {
    const data = _awardsYearData[_awardsYear];
    for (const id of ['song_of_year', 'album_of_year', 'artist_of_year']) {
      const cd = data.categories[id];
      if (cd?.nominees?.length && !cd.winner) await awardsPickWinner(_awardsYear, id, cd.nominees[0]);
    }
  });
  await pg.evaluate(() => { awardsSetView('ballot'); window.scrollTo(0, 0); });
  await pg.waitForFunction(() => document.querySelectorAll('#awardsCatList .awards-nominee-row').length >= 8, null, { timeout: 60000 });
  await wait(pg, 2000);
}
// The ceremony, full screen, on one of its slides
async function awCeremony(pg, slide) {
  await awSetup(pg);
  await pg.evaluate(() => startAwardsCeremony()); await wait(pg, 2500);
  // slide: 'cat' the first category, 'fin' the winners at the end
  if (slide === 'cat') { await pg.evaluate(() => ceremonyNav(1)); await wait(pg, 2500); }
  if (slide === 'fin') { await pg.evaluate(() => ceremonyGoTo(_ceremonyCats.length)); await wait(pg, 2500); }
}
// Spot finders that need more than a selector: run in the page, return an element
const byText = (scope, sel, re) => ({ js: `[...document.querySelectorAll(${JSON.stringify(scope + ' ' + sel)})].find(e => ${re}.test(e.textContent.trim()))` });

/* ── The shots ──────────────────────────────────────────────────────
   id       file name (phone: id + '-m')
   lesson   which lesson needs it (for running one lesson)
   phone    also take it on a phone
   setup    gets the page into the right state
   clip     { from, to, pad } selectors: the picture runs from the top of
            `from` to the bottom of `to`, full content width
   spots    name → selector (or { js }) — measured inside the clip      */
const ROW = '#songsBody tr';
// The n-th real entry row of a chart body; hidden chart-run rows sit between entries,
// so :nth-of-type counts them too and can't be used
const nth = (body, n) => ({ js: `[...document.querySelectorAll('${body} tr[data-ea-key]')][${n - 1}]` });
const R = n => '#songsBody tr[data-ea-key]:nth-child(' + (2 * n - 1) + ')';
const SHOTS = [
  { id: 'week-top', lesson: 'week', phone: true,
    setup: async pg => { await lastWeek(pg); },
    clip: { from: '#topbar', to: '#statsStrip', pad: 18 },
    spots: {
      streak: '#nowStrip', periods: '#periodNav', prev: '#prevBtn', label: '#periodLabel', next: '#nextBtn',
      banner: '#statsHeroTop', tiles: '#statsStrip', tile: '#statsStrip .stat-box', delta: '#statsStrip .stat-delta',
      compare: '#statsStrip .sh-bars-tog'
    } },
  { id: 'week-chart', lesson: 'week', phone: true,
    setup: async pg => { await lastWeek(pg); await showAll(pg); await layout(pg, 'table'); },
    clip: { from: '.spotlight-card', to: nth('#songsBody', 3), pad: 14 },
    spots: {
      spotlight: '.spotlight-card', type: '.chart-type-seg', layouts: '#chartLayoutBar',
      collapse: '#songsSection .section-collapse-btn', title: '#songsSectionTitle', animate: '#songsReplayBtn',
      menu: '#songsSection .kebab-menu-btn', heads: '#songsHeadRow', first: R(1), desc: '#songsSubtitle',
      'lay-table': '.chart-layout-btn[data-view="table"]', 'lay-grid': '.chart-layout-btn[data-view="grid"]',
      'lay-compact': '.chart-layout-btn[data-view="compact"]', 'lay-mosaic': '.chart-layout-btn[data-view="mosaic"]',
      'lay-filmstrip': '.chart-layout-btn[data-view="filmstrip"]', 'lay-stack': '.chart-layout-btn[data-view="stack"]',
      'type-artists': '.chart-type-toggle-btn[data-type="artists"]', 'type-albums': '.chart-type-toggle-btn[data-type="albums"]'
    } },
  { id: 'week-rows', lesson: 'week', phone: true,
    setup: async pg => { await lastWeek(pg); await showAll(pg); await layout(pg, 'table'); },
    clip: { from: R(1), to: nth('#songsBody', 6), pad: 10 },
    spots: {
      body: '#songsTable', rank: R(1) + ' .rank-cell', move: R(1) + ' td.m-col',
      prev: R(1) + ' td.m-col .m-prev-rank',
      up: byText('#songsBody', 'td.m-col', '/^▲/'), down: byText('#songsBody', 'td.m-col', '/^▼/'),
      newe: byText('#songsBody', 'td.m-col', '/^NEW|^NUEV|^NOV/i'), re: byText('#songsBody', 'td.m-col', '/^RE$/i'),
      art: R(1) + ' .thumb-cell', title: R(1) + ' .song-title',
      artist: R(1) + ' .song-artist',
      peak: '#songsBody [class^="peak-badge"]', cert: '#songsBody .song-tags .cert',
      album: R(1) + ' .song-album', weeks: R(1) + ' td.m-col + td.meta-col ~ td.m-col, ' + R(1) + ' .m-mths',
      plays: R(1) + ' .play-count', pdelta: R(1) + ' .m-inline',
      best: '#songsBody .plays-peak-badge', spotify: R(1) + ' .ea-spotify',
      more: R(1) + ' .ea-more', run: R(1) + ' .cr-toggle-btn'
    } },
  { id: 'week-menu-show', lesson: 'week',
    setup: async pg => { await lastWeek(pg); await showAll(pg); await openKebab(pg, 'show'); },
    clip: { from: '#songsSection .section-header', to: '#songsSection .kebab-menu', pad: 14 },
    spots: {
      menu: '#songsSection .kebab-menu-btn', tabs: '#songsSection .kebab-tabs',
      'tab-show': '#songsSection .kebab-tab[data-tab="show"]', 'tab-size': '#songsSection .kebab-tab[data-tab="size"]',
      'tab-actions': '#songsSection .kebab-tab[data-tab="export"]',
      cert: '#toggleCertBtn', score: '#toggleScoreBtn', ppeak: '#togglePlaysPeakBtn', ptags: '#togglePeakTagsBtn',
      bulegend: '#toggleBuLegendBtn', desc: '#toggleDescBtn', sections: '#subChartRows-songs',
      'sub-normal': '#subChartRows-songs [data-sub="normal"]', 'sub-bu': '#subChartRows-songs [data-sub="bu"]',
      'sub-off': '#subChartRows-songs [data-sub="off"]', 'sub-new': '#subChartRows-songs [data-sub="new"]'
    } },
  { id: 'week-menu-size', lesson: 'week',
    setup: async pg => { await lastWeek(pg); await openKebab(pg, 'size'); },
    clip: { from: '#songsSection .section-header', to: '#songsSection .kebab-menu', pad: 14 },
    spots: { 'tab-size': '#songsSection .kebab-tab[data-tab="size"]', sizes: '#sizeBtnsSongsW',
      s10: '#sizeBtnsSongsW [data-size="10"]', s50: '#sizeBtnsSongsW [data-size="50"]', s100: '#sizeBtnsSongsW [data-size="100"]' } },
  { id: 'week-menu-actions', lesson: 'week',
    setup: async pg => { await lastWeek(pg); await openKebab(pg, 'export'); },
    clip: { from: '#songsSection .section-header', to: '#songsSection .kebab-menu', pad: 14 },
    spots: { 'tab-actions': '#songsSection .kebab-tab[data-tab="export"]', playall: '#ytPlayAllRow .yt-playall-btn',
      shuffle: '#ytPlayAllRow .yt-playall-btn + .yt-playall-btn', export: '#exportPlaylistBtn', share: '#songsShareBtn',
      pdf: '#songsPdfBtn' } },
  ...['grid', 'compact', 'mosaic', 'filmstrip', 'stack'].map(v => ({
    id: 'week-layout-' + v, lesson: 'week',
    setup: async pg => { await lastWeek(pg); await layout(pg, v); },
    clip: { from: '#chartTypeToggleBar', to: '#songsSection', pad: 10, maxH: 760 },
    spots: { layouts: '#chartLayoutBar', btn: '.chart-layout-btn[data-view="' + v + '"]', two: '.stk-2col-btn', view: '#weeklyAltView-songs' }
  })),
  { id: 'week-albums', lesson: 'week',
    setup: async pg => { await lastWeek(pg); await pg.evaluate(() => setChartTypeView('albums')); await wait(pg, 1500); },
    clip: { from: '#chartTypeToggleBar', to: nth('#albumsBody', 3), pad: 12 },
    spots: { type: '.chart-type-seg', albums: '.chart-type-toggle-btn[data-type="albums"]', filter: '#albumsFilterBar' } },
  { id: 'week-artists', lesson: 'week',
    setup: async pg => { await lastWeek(pg); await pg.evaluate(() => setChartTypeView('artists')); await wait(pg, 1500); },
    clip: { from: '#chartTypeToggleBar', to: nth('#artistsBody', 3), pad: 12 },
    spots: { type: '.chart-type-seg', artists: '.chart-type-toggle-btn[data-type="artists"]' } },
  { id: 'week-run', lesson: 'week',
    setup: async pg => { await lastWeek(pg); await layout(pg, 'table');
      await pg.evaluate(() => document.querySelector('#songsBody tr .cr-toggle-btn').click()); await wait(pg, 1800); },
    clip: { from: R(1), to: '#songsBody tr.cr-row.open', pad: 10 },
    spots: { run: R(1) + ' .cr-toggle-btn', panel: '#songsBody tr.cr-row.open',
      facts: '.cr-row.open .ea-dr-facts', acts: '.cr-row.open .ea-dr-acts', sample: '.cr-row.open .ea-dr-btn.ea-sample',
      range: '.cr-row.open .cr-range-bar', now: '.cr-row.open .cr-now', story: '.cr-row.open .cr-story',
      ribbon: '.cr-row.open .cr-ribbon', boxes: '.cr-row.open .cr-boxes', goals: '.cr-row.open .cr-goals',
      more: '.cr-row.open .cr-subsection', close: '.cr-row.open .ea-dr-x, .cr-row.open [class*="close"]' } },
  { id: 'week-rowmenu', lesson: 'week',
    setup: async pg => { await lastWeek(pg); await layout(pg, 'table');
      await pg.evaluate(() => document.querySelector('#songsBody tr[data-ea-key] .ea-more').click()); await wait(pg, 700); },
    clip: { from: R(1), to: '.ea-menu, [role="menu"]', pad: 12 },
    spots: { more: R(1) + ' .ea-more', menu: '.ea-menu, [role="menu"]',
      change: { js: "[...document.querySelectorAll('.ea-menu [role=menuitem], .ea-menu button')].find(b => /image|imagen|imagem/i.test(b.textContent))" } } },
  { id: 'week-replay', lesson: 'week',
    // The replay plays inside the chart: let it load its covers, run a few
    // seconds so the chart is mid-shuffle, then pause it for the picture
    setup: async pg => { await lastWeek(pg); await layout(pg, 'table');
      await pg.evaluate(() => replayChartAnimation('songs'));
      await pg.waitForSelector('.crp:not(.crp-is-loading)', { timeout: 60000 });
      await wait(pg, 4200);
      await pg.evaluate(() => document.querySelector('.crp .crp-play').click()); await wait(pg, 900); },
    clip: { from: '#songsSection .section-header', to: '.crp', pad: 12, maxH: 1300 },
    spots: { when: '.crp .crp-when', count: '.crp .crp-count', close: '.crp .crp-close', days: '.crp .crp-days',
      ends: '.crp .crp-ends', scrub: '.crp .crp-scrub', transport: '.crp .crp-transport', play: '.crp .crp-play',
      step: '.crp .crp-uback', speeds: '.crp .crp-speeds', log: '.crp .crp-log', keys: '.crp .crp-keys' } },
  /* ── Lesson: Daily ─────────────────────────────────────────────── */
  { id: 'day-top', lesson: 'daily', phone: true,
    setup: async pg => { await at(pg, 'day', DAY_OFF); },
    clip: { from: '#topbar', to: '#statsHeroDays', pad: 18 },
    spots: { daily: '#periodNav button[data-period="day"]', prev: '#prevBtn', label: '#periodLabel', next: '#nextBtn',
      banner: '#statsHeroTop', peak: '#statsStrip .stat-peak-badge', tiles: '#statsStrip', hours: '#statsHeroDays',
      best: '#statsHeroDays .sh-day.is-best', share: '#statsHeroDays .sh-share' } },
  { id: 'day-tools', lesson: 'daily', phone: true,
    setup: async pg => { await at(pg, 'day', DAY_OFF); await layout(pg, 'table'); },
    clip: { from: '#chartTypeToggleBar', to: nth('#songsBody', 3), pad: 14 },
    spots: { type: '.chart-type-seg', layouts: '#chartLayoutBar', cmp: '.dy-cmp', cmp1: '.dy-seg-btn', cmp2: '.dy-seg-btn + .dy-seg-btn',
      no1: '.dy-no1', recap: '.dy-act-main', share: '.dy-actions .dy-act:nth-child(2)', play: '.dy-actions .dy-act:nth-child(3)',
      cal: '.dy-actions .dy-act:nth-child(4)', save: '.dy-actions .dy-act:nth-child(5)', export: '.dy-actions .dy-act:nth-child(6)',
      title: '#songsSectionTitle', animate: '#songsReplayBtn', menu: '#songsSection .kebab-menu-btn', heads: '#songsHeadRow' } },
  { id: 'day-panel', lesson: 'daily', phone: true,
    setup: async pg => { await at(pg, 'day', DAY_OFF); },
    clip: { from: '.dy-panel', to: '.dy-diary', pad: 12 },
    spots: { today: '.dy-ptop .dy-pblock', week: '.dy-ptop .dy-pblock + .dy-pblock', first: '.dy-ptiles .dy-ptile:nth-child(1)',
      last: '.dy-ptiles .dy-ptile:nth-child(2)', topart: '.dy-ptiles .dy-ptile:nth-child(3)', repeat: '.dy-ptiles .dy-rep',
      moods: '.dy-moods', note: '.dy-note', status: '.dy-diary-status' } },
  { id: 'day-time', lesson: 'daily',
    setup: async pg => { await at(pg, 'day', DAY_OFF); },
    clip: { from: '.dy-tod-sec', to: '.dy-pats', pad: 12 },
    spots: { busiest: '.dy-tod-sec .dy-chip', sessions: '.dy-tod-sec .dy-chip:nth-child(2)', longest: '.dy-tod-sec .dy-chip:nth-child(3)',
      tl: '.dy-tl', hours: '.dy-hours', busy: '.dy-hr.is-busy', hourcard: '.dy-tod-sec [class*="dy-hr-"]:not(.dy-hr), .dy-tod-sec .dy-sess',
      parts: '.dy-tod-sec [class*="dy-parts"], .dy-tod-sec [class*="dy-part"]', replayed: '.dy-pat-grid .dy-pat:nth-child(1)',
      b2b: '.dy-pat-grid .dy-pat:nth-child(2)', full: '.dy-pat-grid .dy-pat:nth-child(3)', variety: '.dy-pat-grid .dy-pat:nth-child(4)',
      genres: '.dy-genres' } },
  { id: 'day-mem', lesson: 'daily',
    setup: async pg => { await at(pg, 'day', DAY_OFF); },
    clip: { from: '.dy-mem', to: '.dy-ms', pad: 12 },
    spots: { otd: '.dy-mem .dy-tab:nth-child(1)', forgot: '.dy-mem .dy-tab:nth-child(2)', back: '.dy-mem .dy-tab:nth-child(3)',
      firsth: '.dy-mem .dy-tab:nth-child(4)', list: '.dy-mem .dy-mem-list', awards: '.dy-awards', mshit: '.dy-ms .dy-tab:nth-child(1)',
      msrec: '.dy-ms .dy-tab:nth-child(2)', msstreak: '.dy-ms .dy-tab:nth-child(3)', msgoal: '.dy-ms .dy-tab:nth-child(4)',
      msnear: '.dy-ms .dy-tab:nth-child(5)' } },
  { id: 'day-recap', lesson: 'daily',
    setup: async pg => { await at(pg, 'day', DAY_OFF); await pg.evaluate(() => dyOpenRecap()); await wait(pg, 2500); },
    clip: { from: '.dy-rc-bars', to: '.dy-rc-stage', pad: 40, narrow: true },
    spots: { bars: '.dy-rc-bars', x: '.dy-rc-x', next: '.dy-rc-nav.is-next', prev: '.dy-rc-nav.is-prev', big: '.dy-rc-big' } },
  { id: 'day-cal', lesson: 'daily',
    setup: async pg => { await at(pg, 'day', DAY_OFF); await pg.evaluate(() => dyOpenCalendar()); await wait(pg, 3500); },
    clip: { from: '.dy-cal-card', to: '.dy-cal-card', pad: 16, narrow: true },
    spots: { prev: '.dy-cal-head .dy-cal-nav', title: '.dy-cal-title',
      next: { js: "[...document.querySelectorAll('.dy-cal-head .dy-cal-nav:not(.dy-cal-share)')][1]" },
      share: '.dy-cal-share', x: '.dy-cal-x', grid: '.dy-cal-grid', day: '.dy-cal-cell.has-plays' } },

  /* ── Lesson: Monthly and Yearly ───────────────────────────────── */
  { id: 'month-top', lesson: 'periods', phone: true,
    setup: async pg => { await at(pg, 'month', 1); },
    clip: { from: '#topbar', to: '#statsHeroDays', pad: 18 },
    spots: { monthly: '#periodNav button[data-period="month"]', yearly: '#periodNav button[data-period="year"]', label: '#periodLabel',
      banner: '#statsHeroTop', peak: '#statsStrip .stat-peak-badge', tiles: '#statsStrip', days: '#statsHeroDays',
      day: '#statsHeroDays .sh-day', best: '#statsHeroDays .sh-day.is-best', share: '#statsHeroDays .sh-share' } },
  { id: 'month-chart', lesson: 'periods',
    setup: async pg => { await at(pg, 'month', 1); await layout(pg, 'table'); },
    clip: { from: '#chartTypeToggleBar', to: nth('#songsBody', 4), pad: 14 },
    spots: { title: '#songsSectionTitle', heads: '#songsHeadRow', newe: byText('#songsBody', 'td.m-col', '/^NEW|^NUEV|^NOV/i'),
      re: byText('#songsBody', 'td.m-col', '/^RE$/i'), up: byText('#songsBody', 'td.m-col', '/^▲/'),
      months: R(1) + ' .m-mths', plays: R(1) + ' .play-count' } },
  { id: 'month-new', lesson: 'periods',
    setup: async pg => { await at(pg, 'month', 1); await pg.evaluate(() => window.scrollTo(0, document.getElementById('atcSongs').getBoundingClientRect().top + scrollY - 800)); await wait(pg, 1200); },
    clip: { from: '#atcSongs .atc-bar', to: nth('#newSongsBody', 4), pad: 12 },
    spots: { bar: '#atcSongs .atc-bar', tabs: '#atcSongs .atc-tabs', fold: '#atcSongs .atc-fold', chips: '#newSongsChips',
      chip1: '#newSongsChips button', chip2: '#newSongsChips button:nth-child(2)', chip3: '#newSongsChips button:nth-child(3)',
      row: nth('#newSongsBody', 1), debut: '#newSongsBody .atc-tag', biggest: '#newSongsBody .ne-big',
      caps: '#newSongsBody .ne-caps', ndays: '#newSongsBody .ne-days' } },
  { id: 'month-cert', lesson: 'periods',
    setup: async pg => { await at(pg, 'month', 1); await pg.evaluate(() => window.scrollTo(0, document.getElementById('certReelSection').getBoundingClientRect().top + scrollY - 800)); await wait(pg, 2500); },
    clip: { from: '#certReelSection', to: '#certReelSection', pad: 12 },
    spots: { title: '#certReelSection .section-title', count: '#certReelSection .creel-count', filter: '#certReelSection .creel-filter-btns',
      plaque: '#certReelSection .creel-track > *', hint: '#certReelSection .creel-hint', collapse: '#certReelSection .section-header button' } },
  { id: 'year-top', lesson: 'periods', phone: true,
    setup: async pg => { await at(pg, 'year', 1); },
    clip: { from: '#topbar', to: '#statsHeroDays', pad: 18 },
    spots: { yearly: '#periodNav button[data-period="year"]', label: '#periodLabel', banner: '#statsHeroTop',
      peak: '#statsStrip .stat-peak-badge', tiles: '#statsStrip', months: '#statsHeroDays', best: '#statsHeroDays .sh-day.is-best' } },
  { id: 'year-chart', lesson: 'periods',
    setup: async pg => { await at(pg, 'year', 0); await layout(pg, 'table'); },
    clip: { from: '#songsSection .section-header', to: nth('#songsBody', 4), pad: 14 },
    spots: { title: '#songsSectionTitle', search: '#songsSearch', heads: '#songsHeadRow', menu: '#songsSection .kebab-menu-btn',
      years: R(1) + ' .m-mths', up: byText('#songsBody', 'td.m-col', '/^▲/'), newe: byText('#songsBody', 'td.m-col', '/^NEW|^NUEV|^NOV/i') } },

  /* ── Lesson: All-Time ─────────────────────────────────────────── */
  { id: 'at-top', lesson: 'alltime', phone: true,
    setup: async pg => { await at(pg, 'alltime', 0); },
    clip: { from: '#topbar', to: '#statsHeroDays', pad: 18 },
    spots: { alltime: '#periodNav button[data-period="alltime"]', prev: '#prevBtn', label: '#periodLabel', banner: '#statsHeroTop',
      tiles: '#statsStrip', total: '#statsStrip .stat-box', years: '#statsHeroDays', best: '#statsHeroDays .sh-day.is-best',
      share: '#statsHeroDays .sh-share' } },
  { id: 'at-chart', lesson: 'alltime', phone: true,
    setup: async pg => { await at(pg, 'alltime', 0); await layout(pg, 'table'); },
    clip: { from: '#chartTypeToggleBar', to: nth('#songsBody', 3), pad: 14 },
    spots: { type: '.chart-type-seg', tip: '#atInsights .ati-tip', size: '#atInsights [data-ati="size"]', hide: '#atInsights .ati-x',
      title: '#songsSectionTitle', search: '#songsSearch', heads: '#songsHeadRow', menu: '#songsSection .kebab-menu-btn' } },
  { id: 'at-ati', lesson: 'alltime',
    setup: async pg => { await at(pg, 'alltime', 0);
      await pg.evaluate(() => document.querySelector('#atInsights [data-ati="size"]').click()); await wait(pg, 2500);
      await pg.evaluate(() => { const b = document.querySelector('#atInsights .ati-toggle'); if (b && !/hide|ocultar|esconder/i.test(b.textContent)) b.click(); }); await wait(pg, 1800); },
    clip: { from: '#atInsights', to: '#atInsights', pad: 12, maxH: 1500 },
    spots: { head: '#atInsights .ati-head-tx', toggle: '#atInsights .ati-toggle', hero: '#atInsights .ati-hero', fact: '#atInsights .ati-hero .ati-btn--ghost',
      tiles: '#atInsights .ati-tiles', tile: '#atInsights .ati-tile', tabs: '#atInsights .ati-tabs', panel: '#atInsights .ati-panel' } },
  { id: 'at-pages', lesson: 'alltime',
    // Back to All Entries (the insights shot set Top 100), where the pages and export bar show
    setup: async pg => { await at(pg, 'alltime', 0); await layout(pg, 'table');
      await pg.evaluate(() => document.querySelector('#sizeBtnsSongsAT [data-size="0"]').click()); await wait(pg, 2500); },
    clip: { from: nth('#songsBody', 97), to: '#songsExportBar', pad: 14 },
    spots: { pages: '#songsPagination', label: '#songsPageLabel', input: '#songsPageInput', next: '#songsPagination .page-nav-next',
      last: '#songsPagination .page-nav-last', export: '#songsExportBar' } },
  { id: 'at-travel', lesson: 'alltime',
    // Time travel: one press of ‹ on All-Time = the chart as it stood a month ago
    setup: async pg => { await at(pg, 'alltime', 0); await pg.click('#prevBtn'); await wait(pg, 3500); },
    clip: { from: '#stickyNavBar', to: '#statsStrip', pad: 14 },
    spots: { prev: '#prevBtn', label: '#periodLabel', next: '#nextBtn', banner: '#statsHeroTop', tiles: '#statsStrip' } },
  /* ── Lesson: Around the chart and taking it out ───────────────── */
  { id: 'atc-bu', lesson: 'around',
    setup: async pg => { await lastWeek(pg); await showAll(pg); await atcTab(pg, 0); },
    clip: { from: '#atcSongs .atc-bar', to: nth('#buSongsTableBody', 5), pad: 12 },
    spots: { bar: '#atcSongs .atc-bar', tbu: '#atcSongs .atc-tab', toff: '#atcSongs .atc-tab:nth-child(2)',
      tnew: '#atcSongs .atc-tab:nth-child(3)', fold: '#atcSongs .atc-fold', sub: '#buSongsSection .bu-sub',
      meter: '#buSongsMeterNote', info: '#atcSongs .atc-info', row: nth('#buSongsTableBody', 1),
      rank: '#buSongsTableBody tr[data-ea-key] .atc-rank', badge: '#buSongsTableBody .bu-word',
      weeks: '#buSongsTableBody tr[data-ea-key] .bu-word:last-child', away: '#buSongsTableBody tr[data-ea-key] td:nth-last-child(2), #buSongsTableBody .atc-plays' } },
  { id: 'atc-legend', lesson: 'around',
    setup: async pg => { await lastWeek(pg); await showAll(pg); await atcTab(pg, 0);
      await pg.evaluate(() => document.querySelector('#atcSongs .atc-info').click()); await wait(pg, 900); },
    clip: { from: '#buSongsSection .bu-legend', to: '#buSongsSection .bu-legend', pad: 12 },
    spots: { fresh: '.bu-legend .bu-badge-debut', trending: '.bu-legend .bu-badge-trending', persistent: '.bu-legend .bu-badge-persistent',
      fading: '.bu-legend .bu-badge-fading', resurgence: '.bu-legend .bu-badge-resurgence', resurgent: '.bu-legend .bu-badge-resurgent',
      clinging: '.bu-legend .bu-badge-clinging', fallen: '.bu-legend .bu-badge-fallen', surging: '.bu-legend .bu-badge-surging',
      freefall: '.bu-legend .bu-badge-freefall', yoyo: '.bu-legend .bu-badge-yoyo', weeks: '.bu-legend .bu-badge-weeks',
      streak: '.bu-legend .bu-badge-streak' } },
  { id: 'atc-off', lesson: 'around',
    setup: async pg => { await lastWeek(pg); await showAll(pg); await atcTab(pg, 1); },
    clip: { from: '#atcSongs .atc-bar', to: '#offSongsContent', pad: 12 },
    spots: { toff: '#atcSongs .atc-tab:nth-child(2)', row: '#offSongsContent .dropout-row', was: '#offSongsContent .atc-was',
      exit: '#offSongsContent .atc-exit', peak: '#offSongsContent [class^="peak-badge"]',
      where: { js: "[...document.querySelectorAll('#offSongsContent .atc-ln')].find(e => /Bubbling|Aspirantes|Under/i.test(e.textContent) && !e.querySelector('.atc-title'))" },
      stats: '#offSongsContent .atc-offstats', streak: { js: "[...document.querySelectorAll('#offSongsContent .atc-offstats *')].find(e => /🔥/.test(e.textContent) && !e.children.length)" } } },
  { id: 'atc-new', lesson: 'around',
    setup: async pg => { await lastWeek(pg); await atcTab(pg, 2); },
    clip: { from: '#atcSongs .atc-bar', to: nth('#newSongsBody', 4), pad: 12 },
    spots: { tnew: '#atcSongs .atc-tab:nth-child(3)', chips: '#newSongsChips', row: nth('#newSongsBody', 1),
      debut: '#newSongsBody .atc-tag', caps: '#newSongsBody .ne-caps' } },
  { id: 'share', lesson: 'around',
    setup: async pg => { await lastWeek(pg); await pg.evaluate(() => openIgPreviewModal('songs')); await wait(pg, 4000); },
    clip: { from: '#igPreviewModal .ig-modal-box', to: '#igPreviewModal .ig-modal-box', pad: 10, narrow: true },
    spots: { preview: '#igPreviewFrame', design: '#igPreviewModal .sh-group:nth-of-type(1)', tpl: '#igPreviewModal .sh-tpl',
      palette: { js: "[...document.querySelectorAll('#igPreviewModal .sh-group')][1]" }, swatch: '#igPreviewModal .sh-swatch',
      format: '#igFormatBtns', show: { js: "[...document.querySelectorAll('#igPreviewModal .sh-group')][3]" },
      src: '#igPreviewModal .ig-art-src-btn', pick: '#igPreviewModal .ig-art-pick', toggles: '#igPreviewModal .ig-ctrl-row:nth-of-type(2)',
      entries: { js: "[...document.querySelectorAll('#igPreviewModal .sh-group')][4]" }, text: '#igTextScale',
      quality: { js: "[...document.querySelectorAll('#igPreviewModal .sh-group')][5]" },
      copy: { js: "[...document.querySelectorAll('#igPreviewModal button')].find(b => /copy|copiar/i.test(b.textContent))" },
      download: { js: "[...document.querySelectorAll('#igPreviewModal button')].find(b => /download|descargar|descarregar|baixar|transferir/i.test(b.textContent))" } } },
  { id: 'share-poster', lesson: 'around',
    setup: async pg => { await lastWeek(pg); await pg.evaluate(() => openIgPreviewModal('songs')); await wait(pg, 3000);
      await pg.evaluate(() => [...document.querySelectorAll('#igPreviewModal .sh-tpl')][4].click()); await wait(pg, 1500);
      await pg.evaluate(() => [...document.querySelectorAll('#igFormatBtns button')][2].click()); await wait(pg, 3000); },
    clip: { from: '#igPreviewFrame', to: '#igPreviewFrame', pad: 16, narrow: true },
    spots: { preview: '#igPreviewFrame' } },
  { id: 'pdf', lesson: 'around',
    setup: async pg => { await lastWeek(pg); await pg.evaluate(() => openPdfModal('songs')); await wait(pg, 2500); },
    clip: { from: '#pdfModal > *', to: '#pdfModal > *', pad: 10, narrow: true },
    spots: { scope: '#pdfScopeOne', all: '#pdfScopeOne + button', cover: '#pdfModal .src-switch-row', bu: '#pdfOptBuRow',
      create: '#pdfCreateBtn' } },
  { id: 'export', lesson: 'around',
    setup: async pg => { await lastWeek(pg); await pg.evaluate(() => openExportModal()); await wait(pg, 2500); },
    clip: { from: '#exportModal > *', to: '#exportModal > *', pad: 10, narrow: true, maxH: 1400 },
    spots: { names: '#exportModal .export-name-chip', order: '#exportOrderFirst', album: '#exportModal .export-switch',
      list: { js: "document.querySelector('#exportModal ol, #exportModal ul, #exportModal [class*=export-list], #exportModal [class*=export-preview]')" },
      copy: '#exportCopyBtn', txt: '#exportModal .export-btn-dl', csv: '#exportModal .export-btn-dl + .export-btn-dl',
      open: { js: "[...document.querySelectorAll('#exportModal a, #exportModal button')].find(b => /Soundiiz/.test(b.textContent))" },
      services: { js: "[...document.querySelectorAll('#exportModal *')].find(e => e.children.length > 2 && /Spotify/.test(e.textContent) && /Tidal/.test(e.textContent) && e.getBoundingClientRect().height < 60)" } } },
  /* ── Lesson: Song, artist and album windows ───────────────────── */
  { id: 'win-song', lesson: 'windows',
    setup: async pg => { await win(pg, 'song', 'housewife|||tate mcrae'); },
    clip: { from: WBOX('song'), to: WBOX('song'), pad: 10, narrow: true, maxH: 3200 },
    spots: { ...winHead('song'), hero: '#songModal .ao-hero-top', span: '#songModal .ao-span', trio: '#songModal .ao-trio',
      favs: '#songModal .ao-favs', habits: '#songModal .ao-habits', rating: '#songModalRating', trophies: '#songModalAccomplishments' } },
  { id: 'win-song-charts', lesson: 'windows',
    setup: async pg => { await win(pg, 'song', 'housewife|||tate mcrae', 'charts'); },
    clip: { from: WBOX('song'), to: WBOX('song'), pad: 10, narrow: true, maxH: 3200 },
    spots: { tabs: '#songModal .dp-tabs', rktop: '#songModal .dp-on .rk-top', rkhero: '#songModal .dp-on .rk-hero',
      plot: '#songModal .dp-on .rk-plot-wrap', detail: '#songModal .dp-on .rk-detail', moments: '#songModal .dp-on .rk-moments',
      fam: '#songModal .dp-on .rk-fam-list', hof: '#songHeldRecordsReel', run: '#songModalChartRun' } },
  { id: 'win-song-listening', lesson: 'windows',
    setup: async pg => { await win(pg, 'song', 'housewife|||tate mcrae', 'listening'); },
    clip: { from: WBOX('song'), to: WBOX('song'), pad: 10, narrow: true, maxH: 3200 },
    spots: { lshero: '#songModal .dp-on .ls-hero', spark: '#songSparklineWrap', found: '#songModal .dp-on .sl-found',
      along: '#songModal .dp-on .sl-along', clock: '#songModal .dp-on .ls-clock', seasons: '#songModal .dp-on .sl-seasons',
      miles: '#songModal .dp-on .ls-miles', next: '#songModal .dp-on .ls-next', heat: '#songListeningHeat', more: '#songModal .dp-on .ls-more' } },
  { id: 'win-artist', lesson: 'windows',
    setup: async pg => { await win(pg, 'artist', 'Tate McRae'); },
    clip: { from: WBOX('artist'), to: WBOX('artist'), pad: 10, narrow: true, maxH: 3200 },
    spots: { ...winHead('artist'), hero: '#artistModal .ao-hero', favs: '#artistModal .ao-favs', habits: '#artistModal .ao-habits',
      slam: '#modalGrandSlam', trophies: '#modalAccomplishments', rating: '#modalArtistRatingMini' } },
  { id: 'win-artist-music', lesson: 'windows',
    setup: async pg => { await win(pg, 'artist', 'Tate McRae', 'music', { full: false }); },
    clip: { from: WBOX('artist'), to: WBOX('artist'), pad: 10, narrow: true, maxH: 3200 },
    spots: { tabs: '#artistModal .dp-tabs', top: '#artistModal .am-top', intro: '#artistModal .am-intro', charts: '#artistModal .am-charts',
      sum: '#artistModal .am-sum', tools: '#artistModal .am-tools', list: '#artistModal .am-list' } },
  { id: 'win-artist-awards', lesson: 'windows',
    setup: async pg => { await win(pg, 'artist', 'Tate McRae', 'awards', { full: false });
      await pg.evaluate(() => { const b = [...document.querySelectorAll('#artistModal .aw-switch button')][1]; if (b) b.click(); }); await wait(pg, 3500); },
    clip: { from: WBOX('artist'), to: WBOX('artist'), pad: 10, narrow: true, maxH: 3200 },
    spots: { tabs: '#artistModal .dp-tabs', sw: '#artistModal .aw-switch', real: '#awReal' } },
  { id: 'win-album', lesson: 'windows',
    setup: async pg => { await win(pg, 'album', 'Housewife|||Tate McRae'); },
    clip: { from: WBOX('album'), to: WBOX('album'), pad: 10, narrow: true, maxH: 3200 },
    spots: { ...winHead('album'), hero: '#albumModal .ao-hero', favs: '#albumModal .ao-favs', habits: '#albumModal .ao-habits',
      rating: '#albumModalRatingMini', trophies: '#albumModalAccomplishments', plaques: '#albumModalCertPlaques' } },
  { id: 'win-more', lesson: 'windows',
    setup: async pg => { await win(pg, 'song', 'housewife|||tate mcrae');
      await pg.click('#songModal .dp-actions .ea-more'); await wait(pg, 900); },
    clip: { from: '#songModal .dp-head', to: '.ea-menu', pad: 16, maxH: 1100 },
    spots: { more: '#songModal .dp-actions .ea-more', menu: '.ea-menu' } },
  { id: 'search', lesson: 'windows',
    setup: async pg => { await lastWeek(pg); await pg.evaluate(() => window.scrollTo(0, 0));
      // a search left open by the shot before would swallow the keys below
      for (let i = 0; i < 2; i++) { await pg.keyboard.press('Escape'); await wait(pg, 300); }
      await pg.keyboard.press('/'); await wait(pg, 800); await pg.keyboard.type('tate'); await wait(pg, 2200); },
    clip: { from: '.lsx-panel', to: '.lsx-panel', pad: 12, narrow: true },
    spots: { field: '.lsx-field', esc: '.lsx-esc', group: '.lsx-group', top: '.lsx-item', songs: '.lsx-group:nth-of-type(2)',
      n: '.lsx-item .lsx-n', foot: '.lsx-foot', btn: '#topbar [class*="search"]' } },
  { id: 'search-hist', lesson: 'windows',
    // After opening something from the search, the empty box lists what you looked at
    setup: async pg => { await lastWeek(pg); await pg.evaluate(() => window.scrollTo(0, 0));
      // a search left open by the shot before would swallow the keys below
      for (let i = 0; i < 2; i++) { await pg.keyboard.press('Escape'); await wait(pg, 300); }
      await pg.keyboard.press('/'); await wait(pg, 800); await pg.keyboard.type('tate'); await wait(pg, 1800);
      await pg.keyboard.press('Enter'); await wait(pg, 2500);
      for (let i = 0; i < 3; i++) { await pg.keyboard.press('Escape'); await wait(pg, 500); }
      await pg.evaluate(() => { document.querySelectorAll('.dp-overlay.open').forEach(o => o.classList.remove('open')); });
      await pg.evaluate(() => document.querySelector('#topbar [class*="search"]').click()); await wait(pg, 1500); },
    clip: { from: '.lsx-panel', to: '.lsx-panel', pad: 12, narrow: true },
    spots: { chips: '.lsx-chips', chip: '.lsx-chip', item: '.lsx-item', rm: '.lsx-rm', clear: '.lsx-clear' } },
  { id: 'streak-records', lesson: 'windows',
    setup: async pg => { await lastWeek(pg); await unfold(pg, true); await pg.evaluate(() => openStreakModal()); await wait(pg, 2500);
      await pg.evaluate(() => [...document.querySelectorAll('#streakModal .sk-tab-btn')][2].click()); await wait(pg, 2500); },
    clip: { from: '#streakModal .dc-modal', to: '#streakModal .dc-modal', pad: 10, narrow: true, maxH: 3200 },
    spots: { tabs: '#streakModal .sk-tab-btn', today: '#streakModal .sk-tab-btn', fire: '#streakModal .sk-tab-btn:nth-child(2)',
      recs: '#streakModal .sk-tab-btn:nth-child(3)', cal: '#streakModal .sk-tab-btn:nth-child(4)',
      fame: '#streakModal .streak-section--fame', badges: '#streakModal .streak-section--badges', tl: '#streakModal .streak-section--tl',
      grave: '#skGraveList' } },
  { id: 'streak-cal', lesson: 'windows',
    setup: async pg => { await lastWeek(pg); await unfold(pg, true); await pg.evaluate(() => openStreakModal()); await wait(pg, 2500);
      await pg.evaluate(() => [...document.querySelectorAll('#streakModal .sk-tab-btn')][3].click()); await wait(pg, 3000); },
    clip: { from: '#streakModal .dc-modal', to: '#streakModal .dc-modal', pad: 10, narrow: true, maxH: 3200 },
    spots: { cal: '#streakModal .sk-tab-btn:nth-child(4)', wrap: '#streakModal .sk-hm-wrap',
      filters: { js: "document.querySelector('#streakModal .sk-hm-wrap').firstElementChild" } } },
  /* ── Changing a cover (windows lesson) ────────────────────────── */
  { id: 'cover-hover', lesson: 'windows',
    // On a computer the ✎ shows while the pointer is over a cover
    setup: async pg => { await lastWeek(pg); await layout(pg, 'table');
      await pg.evaluate(() => window.scrollTo(0, document.getElementById('songsTable').getBoundingClientRect().top + scrollY - 300)); await wait(pg, 600);
      await pg.hover('#songsBody tr[data-ea-key] .thumb-cell'); await wait(pg, 700); },
    clip: { from: R(1), to: nth('#songsBody', 2), pad: 10 },
    spots: { cover: R(1) + ' .thumb-cell', pencil: R(1) + ' .img-src-btn', play: R(1) + ' .ea-cover-play' } },
  { id: 'cover-picker', lesson: 'windows',
    setup: async pg => { await lastWeek(pg); await layout(pg, 'table');
      await pg.evaluate(() => { const st = document.createElement('style'); st.id = 'gdUnfoldPk';
        st.textContent = '.imgpk-panel{max-height:none!important;height:auto!important}.imgpk-body{max-height:none!important;overflow:visible!important}.imgpk-overlay{align-items:flex-start!important;position:absolute!important;height:auto!important}';
        document.head.appendChild(st); });
      await pg.evaluate(() => document.querySelector('#songsBody tr[data-ea-key] .img-src-btn').click());
      // every source has to finish searching before the picture
      await pg.waitForFunction(() => document.querySelector('.imgpk-panel') && !document.querySelector('.imgpk-panel .imgpk-loading'), null, { timeout: 60000 });
      await wait(pg, 2500); },
    clip: { from: '.imgpk-panel', to: '.imgpk-panel', pad: 10, narrow: true, maxH: 2000 },
    spots: { now: '.imgpk-now', title: '#imgpkTitle', close: '.imgpk-close', deezer: '.imgpk-section[data-src="deezer"]',
      itunes: '.imgpk-section[data-src="itunes"]', lastfm: '.imgpk-section[data-src="lastfm"]', youtube: '.imgpk-section[data-src="youtube"]',
      current: '.imgpk-tile--current', tile: '.imgpk-section[data-src="itunes"] .imgpk-tile:nth-child(2)',
      url: '.imgpk-url-input', set: '.imgpk-url-apply', none: '.imgpk-panel [data-act="off"]', auto: '.imgpk-panel [data-act="auto"]' } },

  /* ── Lesson: Stats (GUIDE-PLAN.md step 5) ─────────────────────────
     Every Stats shot opens the page on one of its five tabs with the
     12-month range (the one people start with), Artists in Compare as
     a running total, and the Graphs volume chart by month. */
  { id: 'stats-top', lesson: 'stats', phone: true,
    setup: async pg => { await statsTab(pg, 'overview'); },
    clip: { from: '#graphsView .graphs-header', to: '#sxOverview .sx-hero', pad: 14 },
    spots: { presets: '#graphRangePresets', p12: '#graphRangePresets [data-range="12m"]', dates: '#graphsView .graphs-range-dates',
      tabs: '#graphsView .stats-tabs', line: '#sxOverview .sx-hero-line', share: '#sxOverview .sx-hero-share',
      tiles: '#sxOverview .sx-tiles', tile: '#sxOverview .sx-tile', delta: '#sxOverview .sx-tile .stat-foot',
      trend: '#sxOverview .sx-tile .sx-trend', sub: '#sxOverview .sx-tile .stat-sub', go: '#sxOverview .sx-tile-go' } },
  { id: 'stats-ov', lesson: 'stats',
    setup: async pg => { await statsTab(pg, 'overview'); },
    clip: { from: '#sxTop5', to: '#sxSplit', pad: 12, maxH: 2300 },
    spots: { top5: '#sxTop5', t5seg: '#sxTop5 .dc-seg', t5lead: '#sxTop5 .sx-t5-lead', t5rows: '#sxTop5 .sx-t5-rows',
      sotp: '#sxSotp', movers: '#sxMovers', mvseg: '#sxMovers .dc-seg', persona: '#sxPersona', facts: '#sxFacts',
      shuffle: '#sxFacts .sx-ov-head button', cal: '#sxCal', calmore: '#sxCal .sx-cal-more', otd: '#sxOtd', split: '#sxSplit' } },
  { id: 'stats-story', lesson: 'stats',
    setup: async pg => { await statsTab(pg, 'story'); },
    clip: { from: '#sxStory', to: '#sxStory', pad: 12, maxH: 2300 },
    spots: { obs: '#sxStory > section:nth-of-type(1)', obsone: '#sxStory .sx-obs', eras: '#sxStory > section:nth-of-type(2)',
      drift: '#sxStory .sx-drift-card', driftkeys: '#sxStory .sx-drift-keys',
      loyal: '#sxStory > .sx-row2:nth-of-type(1) > section:first-child', comfort: '#sxStory > .sx-row2:nth-of-type(1) > section:last-child',
      disc: '#sxStory .sx-disc-card', fun: '#sxStory > .sx-row2:nth-of-type(2) > section:last-child',
      miles: '#sxStory > section:nth-of-type(4)' } },
  { id: 'stats-games', lesson: 'stats',
    setup: async pg => { await statsTab(pg, 'games'); },
    clip: { from: '#sxGames .sx-games-head', to: '#sxGames .sx-game-card', pad: 12 },
    spots: { head: '#sxGames .sx-games-head', tally: '#sxGames .sx-games-tally', daily: '#sxGames .sx-daily',
      dailygo: '#sxGames .sx-daily-go', card: '#sxGames .sx-game-card', tag: '#sxGames .sx-game-tag', go: '#sxGames .sx-game-go' } },
  // A game in play, full screen. A shorter window so the stage isn't mostly empty.
  { id: 'stats-game', lesson: 'stats', vp: { width: 1280, height: 860 },
    setup: async pg => { await statsTab(pg, 'games');
      await pg.evaluate(() => sxGameOpen('hl')); await wait(pg, 2500); },
    clip: { from: '#sxGameLayer .sx-game-top', to: '#sxGameLayer', pad: 0, narrow: true },
    spots: { title: '#sxGameTitle', score: '#sxGameScore', close: '#sxGameLayer .sx-game-close', q: '#sxGameStage .sx-game-q',
      known: '#sxGameStage .sx-gsong', guess: { js: "[...document.querySelectorAll('#sxGameStage .sx-gsong')].pop()" },
      btns: '#sxGameStage .sx-hl-btns' } },
  { id: 'stats-cmp', lesson: 'stats', phone: true,
    setup: async pg => { await statsTab(pg, 'compare'); },
    clip: { from: '#graphsControls', to: '#sxCmpVerdict', pad: 12 },
    spots: { gran: '#graphGranularity', types: '#sxCmpType', modes: '#sxCmpMode', top: '#sxCmpTop', saved: '#sxCmpSavedBtn',
      chip: '#sxCmpChips .sx-lu-card', x: '#sxCmpChips .sx-lu-x', add: '#sxCmpAddCard', legend: '#sxCmpLegend',
      chart: '.sx-cmp-canvas', verdict: '#sxCmpVerdict' } },
  { id: 'stats-cmp-more', lesson: 'stats',
    setup: async pg => { await statsTab(pg, 'compare'); },
    clip: { from: '#sxCmpMore', to: '#sxCmpMore', pad: 12, maxH: 2300 },
    spots: { h2h: '#sxCmpMore .sx-cmp-h2h', share: '#sxCmpMore .sx-cmp-h2h .sx-ov-head button', table: '#sxCmpMore .sx-h2h',
      own: '#sxCmpMore .sx-cmp-own', gaps: '#sxCmpMore .sx-cmp-gaps', ts: '#sxCmpMore .sx-cmp-ts', hab: '#sxCmpMore .sx-cmp-hab' } },
  { id: 'stats-run', lesson: 'stats',
    setup: async pg => { await statsTab(pg, 'compare', 'run'); },
    clip: { from: '#graphsView .sx-cmp-bar', to: '.sx-cmp-canvas', pad: 12 },
    spots: { run: '#sxCmpMode [data-cmode="run"]', crun: '#sxCmpRun', chart: '.sx-cmp-canvas' } },
  { id: 'stats-race', lesson: 'stats',
    setup: async pg => { await statsTab(pg, 'compare', 'race'); },
    clip: { from: '#graphsView .sx-cmp-bar', to: '#sxCmpRaceBox', pad: 12 },
    spots: { race: '#sxCmpMode [data-cmode="race"]', canvas: '#gBarRace', play: '#racePlayBtn', step: '#raceStepFwdBtn',
      start: '#raceRestartBtn', seek: '#raceSeekSlider', speeds: '#raceSpeedBtns', gif: '#raceGifBtn', range: '#sxCmpRaceBox .sx-race-range' } },
  { id: 'stats-vol', lesson: 'stats', phone: true,
    setup: async pg => { await statsTab(pg, 'charts'); },
    clip: { from: '#graphsControls', to: '.sx-vol-card', pad: 12 },
    spots: { gran: '#graphGranularity', vol: '.sx-vol-card', mode: '#sxVolMode', labels: '#gTotalVolumeLabelsBtn',
      zoom: '#gTotalVolumeResetZoom', figs: '#sxVolFigs', busiest: '#sxVolFigs .sx-fig.is-go', canvas: '.sx-vol-canvas' } },
  { id: 'stats-drill', lesson: 'stats',
    setup: async pg => { await statsTab(pg, 'charts');
      await pg.evaluate(() => document.querySelector('#sxVolFigs .sx-fig.is-go').click()); await wait(pg, 2500);
      await pg.evaluate(() => window.scrollTo(0, document.getElementById('sxVolDrill').getBoundingClientRect().top + scrollY - 800)); await wait(pg, 800); },
    clip: { from: '#sxVolDrill', to: '#sxVolDrill', pad: 12 },
    spots: { when: '#sxVolDrill .sx-dr-when', step: '#sxVolDrill .sx-dr-step', close: '#sxVolDrill .sx-dr-head > button',
      figs: '#sxVolDrill .sx-dr-figs', hero: '#sxVolDrill .sx-dr-hero', spark: '#sxVolDrill .sx-dr-rh',
      tabs: '#sxVolDrill .sx-dr-tabs', rows: '#sxDrRows', open: '#sxVolDrill .sx-drill-foot button' } },
  { id: 'stats-clock', lesson: 'stats',
    setup: async pg => { await statsTab(pg, 'charts'); },
    clip: { from: '.sx-clock-card', to: '.sx-week-card', pad: 12 },
    spots: { clock: '#sxClock', parts: '#sxClockParts', cnote: '#sxClockNote', wfigs: '#sxWeekFigs', week: '#sxWeek', wnote: '#sxWeekNote' } },
  { id: 'stats-heat', lesson: 'stats',
    setup: async pg => { await statsTab(pg, 'charts'); },
    clip: { from: '#heatmapCard', to: '#heatmapCard', pad: 12, maxH: 2300 },
    spots: { types: '#heatmapTypeBtns', colors: '#heatmapThemeBtns', year: '#heatmapCard .hm-stepper', best: '#heatmapCard .hm-streak-chip',
      figs: '#heatmapCard .hm-figs', grid: '#heatmapCard .hm-y-scroll', strip: '#heatmapCard .hm-strip',
      patterns: '#heatmapCard .hm-patterns-section', scope: '#heatmapCard .hm-pat-scope', rhythm: '#heatmapCard .hm-pat-weekday',
      hours: '#heatmapCard .hm-pat-hourblock' } },

  /* ── Lesson: Records (GUIDE-PLAN.md step 6) ───────────────────────
     Every section shares one look: a sentence, the switches, a podium
     of the top three, then the list. Shots open one section each. */
  { id: 'rec-top', lesson: 'records', phone: true,
    setup: async pg => { await recView(pg, 'recOverviewSection'); },
    clip: { from: '#recordsView > .section-header', to: '#recHeroArtist', pad: 12, maxH: 1700, box: '#recordsView' },
    spots: { intro: '#recIntro', search: '#recordsSearchBar', nav: '#recordsNav', grp: '#recordsNav .rec-nav-grp',
      count: '#recordsNav .rec-nav-n', picker: '#recPicker', hero: '#recHeroBanner', reel: '#recHeroReel',
      card: '#recHeroReel .rec-hero-card',
      // one per section's menu button (pictures for Every option)
      ...Object.fromEntries(['AllOnes', 'PAK', 'Appearances', 'Debuts', 'NewCharts', 'PeakPlays', 'Milestones', 'Fastest', 'Streaks', 'Certs']
        .map(k => ['n-' + k, '#recordsNav [data-rec-view="rec' + k + 'Section"]'])) } },
  { id: 'rec-ov', lesson: 'records',
    setup: async pg => { await recView(pg, 'recOverviewSection'); },
    clip: { from: '#recOverviewBody', to: '#recOverviewBody', pad: 12, maxH: 2000, box: '#recordsView' },
    spots: { intro: '#recOverviewBody .rec-ov-intro', types: '#recOverviewBody .rec-ov-types', grp: '#recOverviewBody .rec-ov-grp',
      cell: '#recOverviewBody .rec-ov-cell', value: '#recOverviewBody .rec-ov-value', sw: '#recOverviewBody .rec-ov-sw' } },
  { id: 'rec-ones', lesson: 'records', phone: true,
    setup: async pg => { await recView(pg, 'recAllOnesSection'); },
    clip: { from: '#recAllOnesSection .section-header', to: '#recAllOnesSection .rec1-podium', pad: 14, box: '#recordsView' },
    spots: { story: '#rec1Story', ent: '#recAllOnesSection .rec-ent-tabs', per: '#recAllOnesSection .rec-per-tabs',
      run: '#recAllOnesSection .rec-run-seg', sort: '#rec1SortBtn', champ: '#recAllOnesSection .rec1-champ',
      boxes: '#recAllOnesSection .rec1-champ .cr-boxes', sample: '#recAllOnesSection .rec1-acts .ea-sample',
      details: '#recAllOnesSection .rec1-details', runner: '#recAllOnesSection .rec1-runner-2' } },
  // The list under the podium, with the first row's chart run open
  { id: 'rec-list', lesson: 'records',
    setup: async pg => { await recView(pg, 'recAllOnesSection');
      await pg.evaluate(() => [...document.querySelectorAll('#recAllOnesBody .rec-run-toggle-btn')].find(e => e.offsetParent).click()); await wait(pg, 1800);
      await pg.evaluate(() => window.scrollTo(0, [...document.querySelectorAll('#recAllOnesBody table')].find(e => e.offsetParent).getBoundingClientRect().top + scrollY - 800)); await wait(pg, 800); },
    clip: { from: '#recAllOnesBody table thead', to: { js: "[...document.querySelectorAll('#recAllOnesBody .rec-run-toggle-btn')].filter(e => e.offsetParent)[3].closest('tr')" }, pad: 10, box: '#recordsView' },
    spots: { heads: '#recAllOnesBody th.rec-sortable', all: '#recAllOnesBody .rec-expand-all-btn', name: '#recAllOnesBody .rec-name',
      tl: '#recAllOnesBody .rec1-tl', date: '#recAllOnesBody .rec-date-link', toggle: '#recAllOnesBody .rec-run-toggle-btn.active',
      runrow: '#recAllOnesBody tr.open' } },
  { id: 'rec-sort', lesson: 'records',
    setup: async pg => { await recView(pg, 'recAllOnesSection');
      await pg.evaluate(() => document.getElementById('rec1SortBtn').click()); await wait(pg, 700); },
    clip: { from: '#rec1Story', to: '#rec1SortMenu', pad: 14, box: '#recordsView' },
    spots: { btn: '#rec1SortBtn', menu: '#rec1SortMenu', rank: '[data-rec1-sort="rank"]', recent: '[data-rec1-sort="recent"]',
      oldest: '[data-rec1-sort="oldest"]', name: '[data-rec1-sort="name"]' } },
  { id: 'rec-foot', lesson: 'records',
    setup: async pg => { await recView(pg, 'recAllOnesSection');
      await pg.evaluate(() => window.scrollTo(0, document.querySelector('#recAllOnesSection .rec1-foot').getBoundingClientRect().top + scrollY - 900)); await wait(pg, 800); },
    clip: { from: { js: "[...document.querySelectorAll('#recAllOnesBody .rec-run-toggle-btn')].filter(e => e.offsetParent).slice(-2)[0].closest('tr')" }, to: '#recAllOnesSection .rec1-foot', pad: 10, box: '#recordsView' },
    spots: { note: '#rec1FootNote', show: '#recordsSizeBar', sizes: '#recordsSizeBtns' } },
  { id: 'rec-search', lesson: 'records',
    setup: async pg => { await recView(pg, 'recOverviewSection');
      await pg.click('#recordsSearch'); await pg.keyboard.type('taylor', { delay: 40 }); await wait(pg, 3500); },
    clip: { from: '#recordsSearchBar', to: '#recLayout', pad: 12, maxH: 1000, box: '#recordsView' },
    spots: { field: '#recordsSearch', clear: '#recordsSearchClear', status: '#recordsSearchStatus', nav: '#recordsNav' } },
  { id: 'rec-pak', lesson: 'records',
    setup: async pg => { await recView(pg, 'recPAKSection');
      await pg.evaluate(() => document.querySelector('#recPAKSection .pak-info-btn').click()); await wait(pg, 800); },
    clip: { from: '#recPAKSection .section-header', to: '#recPAKSection .recx-pod-room', pad: 14, box: '#recordsView' },
    spots: { story: '#recPAKSection .recx-story', about: '#recPAKSection .recx-about', info: '#recPAKSection .pak-info-btn',
      infotext: '#pakInfo', per: '#recPAKSection .rec-per-tabs', champ: '#recPAKSection .rec1-champ', details: '#recPAKSection .rec1-details' } },
  { id: 'rec-nc', lesson: 'records',
    setup: async pg => { await recView(pg, 'recNewChartsSection'); },
    clip: { from: '#recNewChartsSection .section-header', to: '#recNewChartsSection .recx-pod-room', pad: 14, box: '#recordsView' },
    spots: { about: '#recNewChartsSection .recx-about', tabs: '#ncRecTypeTabs', title: '#recNewChartsSection .rec-section-title',
      fold: '#recNewChartsSection .rec-collapse-btn', champ: '#recNewChartsSection .rec1-champ' } },
  { id: 'rec-mil', lesson: 'records',
    setup: async pg => { await recView(pg, 'recMilestonesSection'); },
    clip: { from: '#recMilestonesSection .section-header', to: '#recMilestonesSection .mil-panel', pad: 14, box: '#recordsView' },
    spots: { tabs: '#milRecTypeTabs', sub: '#recMilestonesSection .rec-section-sub', tier: '#recMilestonesSection .milestone-number',
      art: '#recMilestonesSection .mil-art-box', more: '#recMilestonesSection .recx-mil-more', table: '#recMilestonesSection .mil-timeline' } },
  { id: 'rec-fast', lesson: 'records',
    setup: async pg => { await recView(pg, 'recFastestSection'); },
    clip: { from: '#recFastestSection .section-header', to: '#recFastestSection .recx-pod-room', pad: 14, box: '#recordsView' },
    spots: { tabs: '#fastRecTypeTabs', pick: '#recFastestSection .fast-pick', sub: '#recFastestSection .rec-section-sub',
      champ: '#recFastestSection .rec1-champ' } },
  { id: 'rec-streaks', lesson: 'records',
    setup: async pg => { await recView(pg, 'recStreaksSection'); },
    clip: { from: '#recStreaksSection .section-header', to: '#recStreaksSection .recx-pod-room', pad: 14, box: '#recordsView' },
    spots: { ent: '#recStreaksSection .rec-ent-tabs', per: '#recStreaksSection .rec-per-tabs',
      b2b: { js: "[...document.querySelectorAll('#recStreaksSection .rec-per-tab')].filter(e => e.offsetParent).pop()" },
      sub: '#recStreaksSection .rec-section-sub', champ: '#recStreaksSection .rec1-champ' } },
  { id: 'rec-certs', lesson: 'records',
    setup: async pg => { await recView(pg, 'recCertsSection'); },
    clip: { from: '#recCertsSection .section-header', to: '#recCertsSection .certw', pad: 14, box: '#recordsView' },
    spots: { story: '#recCertsSection .recx-story', tiers: '#recCertsSection .rec-section-sub', card: '#recCertsSection .certw-card--1',
      total: '#recCertsSection .certw-total', bar: '#recCertsSection .certw-bar', tally: '#recCertsSection .certw-tally',
      open: '#recCertsSection .certw-open' } },
  { id: 'rec-ledger', lesson: 'records',
    setup: async pg => { await recView(pg, 'recCertsSection');
      await pg.evaluate(() => document.querySelector('#recCertsSection .certw-open').click()); await wait(pg, 2500);
      await pg.evaluate(() => window.scrollTo(0, document.querySelector('.certd').getBoundingClientRect().top + scrollY - 800)); await wait(pg, 800); },
    clip: { from: '.certd', to: '.certd', pad: 10, maxH: 1050, box: '#recordsView' },
    spots: { tally: '.certd .certd-tally', facts: '.certd .certd-facts', types: '.certd .certd-seg', tiers: '.certd .certd-seg-tier',
      sort: '.certd .certd-sortwrap',
      row: { js: "[...document.querySelectorAll('.certd .certd-row')].filter(e => e.offsetParent).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0]" },
      medal: { js: "[...document.querySelectorAll('.certd .certd-medal')].filter(e => e.offsetParent).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0]" },
      journey: { js: "[...document.querySelectorAll('.certd .certd-journey')].filter(e => e.offsetParent).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0]" } } },

  /* ── Lesson: Awards (GUIDE-PLAN.md step 7) ────────────────────────
     My Grammys for last year with six categories, nominees and three
     winners (awSetup), the ceremony, and Real-Life Awards (the VMAs:
     Wikipedia has them for the demo library; the Grammys come from a
     proxy that only answers the live site). */
  { id: 'aw-top', lesson: 'awards', phone: true,
    setup: async pg => { await awSetup(pg); },
    clip: { from: '#awardsView .awards-header', to: '#awardsViewBar', pad: 14 },
    spots: { sub: '#awardsView .awards-subnav', year: '#awardsMyGrammys .awards-year-stepper', config: '#awardsConfigToggleBtn',
      gen: '#awardsGenerateBtn', cer: '#awardsMyGrammys .awards-ceremony-launch-btn', share: '#awardsMyGrammys .awards-ceremony-share-btn',
      sum: '#awardsSummary', tools: '#awardsViewBar .awards-bar-tools', views: '#awardsViewBar .awards-view-pick' } },
  { id: 'aw-empty', lesson: 'awards',
    setup: async pg => { await awSetup(pg, { empty: true }); },
    clip: { from: '#awardsMyGrammys .awards-year-bar', to: { js: "[...document.querySelectorAll('#awardsCatList .awards-cat-card')][2]" }, pad: 14 },
    spots: { year: '#awardsMyGrammys .awards-year-stepper', gen: '#awardsGenerateBtn', card: '#awardsCatList .awards-cat-card',
      onoff: '#awardsCatList .awards-cat-onoff', fav: '#awardsCatList .awards-cat-fav', pick: '#awardsCatList .awards-cat-action-btn' } },
  { id: 'aw-cards', lesson: 'awards', phone: true,
    setup: async pg => { await awSetup(pg); },
    clip: { from: '#awardsViewBar', to: '#awardsCat_artist_of_year', pad: 14 },
    spots: { left: { js: "document.querySelector('#awardsViewBar .awards-bar-tools').firstElementChild" }, hide: '#awardsViewBar .awards-hide-decided',
      fold: '#awardsViewBar .awards-fold-scopes', views: '#awardsViewBar .awards-view-pick', hint: '#awardsView .awards-bar-hint',
      card: '#awardsCat_song_of_year', head: '#awardsCat_song_of_year .awards-cat-header', onoff: '#awardsCat_song_of_year .awards-cat-onoff',
      fav: '#awardsCat_song_of_year .awards-cat-fav', fold1: '#awardsCat_song_of_year .awards-cat-collapse',
      winner: '#awardsCat_song_of_year .awards-nominee-row.is-winner', nom: '#awardsCat_song_of_year .awards-nominee-row:not(.is-winner)',
      change: '#awardsCat_song_of_year .awards-cat-action-btn', playlist: '#awardsCat_song_of_year .awards-cat-pl-btn',
      reorder: '#awardsCat_song_of_year .awards-cat-reorder-btn' } },
  ...['spotlight', 'tiles', 'collage', 'reel'].map(v => ({
    id: 'aw-view-' + v, lesson: 'awards',
    setup: async pg => { await awSetup(pg); await pg.evaluate(v => awardsSetView(v), v); await wait(pg, 2500); },
    clip: { from: '#awardsViewBar', to: '#awardsCatList', pad: 12, maxH: 900 },
    spots: { btn: '#awardsViewBar .awards-view-opt[onclick*="' + v + '"]', list: '#awardsCatList' }
  })),
  { id: 'aw-sum', lesson: 'awards',
    setup: async pg => { await awSetup(pg);
      await pg.evaluate(() => { const b = document.querySelector('#awardsSummary .aw-sum-toggle'); if (b && document.querySelector('#awardsSummary .is-folded')) b.click(); }); await wait(pg, 1500); },
    clip: { from: '#awardsSummary', to: '#awardsSummary', pad: 12, maxH: 1400 },
    spots: { head: '#awardsSummary .aw-sum-head', toggle: '#awardsSummary .aw-sum-toggle' } },
  { id: 'aw-config', lesson: 'awards',
    setup: async pg => { await awSetup(pg); await pg.evaluate(() => awardsToggleConfig()); await wait(pg, 1200); },
    clip: { from: '#awardsConfigPanel', to: '#awardsConfigPanel', pad: 12, maxH: 1250 },
    spots: { elig: '#awardsConfigPanel .awards-config-row', gemini: '#awardsConfigPanel .awards-gemini-row',
      credit: { js: "document.getElementById('awardsCreditFeatures').closest('label')" }, hideplays: { js: "document.getElementById('awardsHidePlays').closest('label')" },
      rating: { js: "document.getElementById('awardsShowRating').closest('label')" }, samples: { js: "document.getElementById('awardsSamples').closest('label')" },
      count: '#awardsCatCount', bulk: '#awardsCatBrowser .awc-bulk', favs: '#awardsCatFavsOnly', search: '#awardsCatSearch',
      type: '#awardsCatTypeSeg', status: '#awardsCatStatusSeg', groups: '#awardsCatGroups', group: '#awardsCatToggles .awc-group-head',
      cat: '#awardsCatToggles .awc-card', catfav: '#awardsCatToggles .awc-fav' } },
  { id: 'aw-picker', lesson: 'awards',
    setup: async pg => { await awSetup(pg); await pg.evaluate(() => window.scrollTo(0, 0));
      await pg.evaluate(() => awardsGenerateCatCandidates(_awardsYear, 'song_summer'));
      await pg.waitForFunction(() => document.querySelectorAll('.awards-picker-result-row').length >= 4, null, { timeout: 60000 }); await wait(pg, 2500); },
    clip: { from: '.awards-picker-modal', to: '.awards-picker-modal', pad: 10, narrow: true },
    spots: { title: '.awards-picker-title', fav: '.awards-picker-fav', close: '.awards-picker-close', ballot: '.awards-picker-ballot',
      tally: '#awardsPickerTally', quick: '.awards-picker-quick', nom: '.awards-picker-nom-row', clip: '.awards-picker-nom-row .awards-picker-clip-btn',
      x: '.awards-picker-nom-x', search: '#awardsPickerSearch', sort: '#awardsPickerSort', group: '.awards-picker-group',
      row: '.awards-picker-result-row', save: '.awards-picker-modal .dc-btn-main' } },
  // The ceremony: full screen, so a shorter window keeps the stage filled
  { id: 'aw-cer-intro', lesson: 'awards', vp: { width: 1280, height: 860 },
    setup: async pg => { await awCeremony(pg); },
    clip: { from: '#awardsCeremonyModal', to: '#awardsCeremonyModal', narrow: true },
    spots: { badge: '#ceremonyYearBadge', dots: '#ceremonyDots', cats: '#ceremonyCatsBtn', sound: '#ceremonySoundBtn',
      close: '#awardsCeremonyModal .ceremony-close-btn', title: '#ceremonyCatName', slide: '#ceremonySlide', progress: '#ceremonyProgress',
      next: '#ceremonyNextBtn' } },
  { id: 'aw-cer-cat', lesson: 'awards', vp: { width: 1280, height: 860 },
    setup: async pg => { await awCeremony(pg, 'cat'); },
    clip: { from: '#awardsCeremonyModal', to: '#awardsCeremonyModal', narrow: true },
    spots: { title: '#ceremonyCatName', noms: '#ceremonySlide .cer-nominees', nom: '#ceremonySlide .cer-nom-card', env: '#ceremonySlide .cer-envelope-wrap',
      meet: { js: "document.querySelector('#ceremonySlide .cer-cta-row').firstElementChild" },
      open: { js: "document.querySelector('#ceremonySlide .cer-cta-row').lastElementChild" },
      prev: '#ceremonyPrevBtn', progress: '#ceremonyProgress', next: '#ceremonyNextBtn', dots: '#ceremonyDots' } },
  { id: 'aw-cer-win', lesson: 'awards', vp: { width: 1280, height: 860 },
    setup: async pg => { await awCeremony(pg, 'cat'); await pg.evaluate(() => ceremonyReveal()); await wait(pg, 8000); },
    clip: { from: '#awardsCeremonyModal', to: '#awardsCeremonyModal', narrow: true },
    spots: { winner: '#ceremonySlide .cer-winner', label: '#ceremonySlide .cer-winner-label', name: '#ceremonySlide .cer-winner-name',
      art: '#ceremonySlide .cer-winner-art-wrap', play: '#ceremonySlide .cer-player, #ceremonyPlayer', take: '#ceremonyTakeBtn', next: '#ceremonyNextBtn' } },
  { id: 'aw-cer-fin', lesson: 'awards', vp: { width: 1280, height: 860 },
    setup: async pg => { await awCeremony(pg, 'fin'); },
    clip: { from: '#awardsCeremonyModal', to: '#awardsCeremonyModal', narrow: true },
    spots: { grid: '#ceremonySlide .cer-finale-grid', card: '#ceremonySlide .cer-fin-card', stats: '#ceremonySlide .cer-finale-stats', prev: '#ceremonyPrevBtn' } },
  { id: 'aw-cer-side', lesson: 'awards', vp: { width: 1280, height: 860 },
    setup: async pg => { await awCeremony(pg, 'cat'); await pg.evaluate(() => ceremonyToggleDrawer(true)); await wait(pg, 1200); },
    clip: { from: '#awardsCeremonyModal', to: '#awardsCeremonyModal', narrow: true },
    spots: { side: '#ceremonySidebar', cats: '#ceremonyCatsBtn' } },
  { id: 'aw-share', lesson: 'awards',
    setup: async pg => { await awSetup(pg); await pg.evaluate(() => window.scrollTo(0, 0)); await pg.evaluate(() => openCeremonyShare()); await wait(pg, 2000); },
    clip: { from: '#cerShareModal .cer-share-box', to: '#cerShareModal .cer-share-box', pad: 10, narrow: true },
    spots: { title: '#cerShareTitle', body: '#cerShareBody', foot: '#cerShareFoot' } },
  { id: 'aw-real', lesson: 'awards',
    setup: async pg => {
      // the share window or ceremony from the shot before
      await pg.evaluate(() => { if (typeof closeCeremonyShare === 'function') closeCeremonyShare();
        if (document.querySelector('.awards-picker-modal') && typeof awardsPickerClose === 'function') awardsPickerClose();
        const o = document.getElementById('awardsCeremonyOverlay'); if (o && o.style.display && o.style.display !== 'none') closeCeremony(); });
      await go(pg, 'awards'); await wait(pg, 2500);
      await pg.evaluate(() => awardsSubTab('reallife')); await wait(pg, 2500);
      await pg.evaluate(() => realLifeSetShow('vmas'));
      await pg.waitForFunction(() => document.querySelector('#realLifeContent .awards-reallife-card'), null, { timeout: 90000 }); await wait(pg, 4000); },
    clip: { from: '#awardsView .awards-subnav', to: '#realLifeContent .awards-reallife-card', pad: 14 },
    spots: { sub: '#awardsView .awards-subnav', shows: '#awardsRealLife .awards-show-seg', year: '#awardsRealLife .awards-year-stepper',
      head: '#realLifeContent .awards-reallife-head', sub2: '#realLifeContent .awards-reallife-sub', tally: '#realLifeContent .awards-reallife-tally',
      card: '#realLifeContent .awards-reallife-card', portrait: '#realLifeContent .awards-reallife-portrait',
      plays: '#realLifeContent .awards-reallife-alltime', won: '#realLifeContent .awards-reallife-badge.won',
      nomd: '#realLifeContent .awards-reallife-badge.nom', work: '#realLifeContent .awards-reallife-work' } }
];

/* ── Measuring + capture ────────────────────────────────────────── */
async function measure(pg, clip, spots) {
  return pg.evaluate(({ clip, spots }) => {
    const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(el).visibility !== 'hidden'; };
    const first = sel => { for (const s of sel.split(/,(?![^(]*\))/)) { const el = [...document.querySelectorAll(s.trim())].find(vis); if (el) return el; } return null; };
    const pick = s => typeof s === 'string' ? first(s) : (new Function('return ' + s.js))();
    const a = pick(clip.from), b = pick(clip.to);
    if (!a || !b) return { err: 'clip not found: ' + JSON.stringify(!a ? clip.from : clip.to) };
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    // Full content width: the app's .container, so every picture of one lesson lines up
    // clip.box: a page wider than the app's column (Records reaches past it)
    const box = (document.querySelector(clip.box || '#mainApp') || document.body).getBoundingClientRect();
    const pad = clip.pad || 0;
    // Always the app's own width (the top bar is full-window, the content isn't),
    // except a pop-up card (narrow: true), which is cut to its own width
    const L = clip.narrow ? Math.min(ra.left, rb.left) : box.left, Rr = clip.narrow ? Math.max(ra.right, rb.right) : box.right;
    const x = Math.max(0, L - pad);
    const right = Math.min(innerWidth, Rr + pad);
    const y = Math.max(0, Math.min(ra.top, rb.top) - pad + scrollY);
    let bottom = Math.max(ra.bottom, rb.bottom) + pad + scrollY;
    if (clip.maxH) bottom = Math.min(bottom, y + clip.maxH);
    const r = { x, y, width: right - x, height: bottom - y };
    const out = {};
    for (const [k, sel] of Object.entries(spots)) {
      let el;
      try { el = typeof sel === 'string' ? first(sel) : (new Function('return ' + sel.js))(); } catch (e) { el = null; }
      if (!vis(el)) continue;
      const q = el.getBoundingClientRect();
      const sx = q.left - r.x, sy = q.top + scrollY - r.y;
      // Drop spots that fall outside the picture
      if (sx > r.width || sy > r.height || sx + q.width < 0 || sy + q.height < 0) continue;
      const cx = Math.max(0, sx), cy = Math.max(0, sy);
      const cw = Math.min(r.width, sx + q.width) - cx, ch = Math.min(r.height, sy + q.height) - cy;
      out[k] = [cx / r.width, cy / r.height, cw / r.width, ch / r.height].map(v => +v.toFixed(4));
    }
    return { clip: r, spots: out };
  }, { clip, spots });
}

async function openApp(b, lang, phone) {
  const ctx = await b.newContext({
    viewport: phone ? PHONE : DESK, deviceScaleFactor: DPR, locale: LOCALE[lang],
    ...(phone ? { isMobile: true, hasTouch: true } : {})
  });
  await ctx.addInitScript(l => {
    try {
      localStorage.setItem('dankcharts-lang', l);
      // Seen the welcome, so it doesn't cover the app; and no "new" pings in the pictures
      localStorage.setItem('dc_guide_seen', '999');
    } catch (e) {}
  }, lang);
  const pg = await ctx.newPage();
  pg.on('pageerror', e => console.log('  page error:', e.message));
  await pg.goto(URL);
  await wait(pg, 1500);
  await pg.evaluate(() => startWithSampleData());
  await pg.waitForFunction('allPlays && allPlays.length>0', null, { timeout: 120000 });
  await wait(pg, 3500);
  await pg.evaluate(() => {
    document.getElementById('cgWelcomeGate')?.remove();
    document.body.classList.remove('cg-gate-open');
    // Toasts ("Synced…") and the back-to-top button are not part of any lesson
    const st = document.createElement('style');
    st.textContent = '.sync-toast,#syncToast,.dc-toast,#backToTop,.back-to-top,.gd-toast{display:none!important}';
    document.head.appendChild(st);
  });
  return { ctx, pg };
}

async function run() {
  const [onlyLesson, onlyLang] = process.argv.slice(2);
  const langs = onlyLang ? [onlyLang] : LANGS;
  // The first argument can be a lesson (every shot it uses) or one shot's id
  const shots = SHOTS.filter(s => !onlyLesson || onlyLesson === 'all' || s.lesson === onlyLesson || s.id === onlyLesson);
  const b = await chromium.launch();
  for (const lang of langs) {
    const dir = path.join(ROOT, lang);
    fs.mkdirSync(dir, { recursive: true });
    const mf = path.join(dir, 'shots.json');
    const manifest = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : {};
    for (const phone of [false, true]) {
      const list = shots.filter(s => !phone || s.phone);
      if (!list.length) continue;
      let app = await openApp(b, lang, phone);
      for (const s of list) {
        const id = s.id + (phone ? '-m' : '');
        // Two tries: a slow page load is the usual reason a shot fails
        for (let attempt = 1; attempt <= 2; attempt++) try {
          // A fresh start per shot keeps one shot's open menu out of the next
          await app.pg.evaluate(() => { window.scrollTo(0, 0); document.querySelectorAll('.kebab-menu-wrap.open').forEach(e => e.classList.remove('open')); });
          await closeMenus(app.pg);
          // vp: a shot that needs its own window size (a full-screen layer); put back after
          await app.pg.setViewportSize(s.vp && !phone ? s.vp : (phone ? PHONE : DESK));
          await s.setup(app.pg);
          await wait(app.pg, 600);
          const m = await measure(app.pg, s.clip, s.spots);
          if (m.err) { console.log(`  ${lang} ${id}: ${m.err}`); continue; }
          const png = path.join(dir, id + '.png');
          await app.pg.screenshot({ path: png, clip: m.clip, fullPage: true });
          execFileSync('python', ['-c', 'import sys;from PIL import Image;im=Image.open(sys.argv[1]).convert("RGB");im.save(sys.argv[2],"WEBP",quality=80,method=6)', png, png.replace(/\.png$/, '.webp')]);
          fs.unlinkSync(png);
          manifest[id] = { w: Math.round(m.clip.width), h: Math.round(m.clip.height), spots: m.spots };
          const miss = Object.keys(s.spots).filter(k => !m.spots[k]);
          console.log(`  ${lang} ${id}: ${Object.keys(m.spots).length} spots` + (miss.length ? ` (not found: ${miss.join(', ')})` : ''));
          break;
        } catch (e) {
          console.log(`  ${lang} ${id}: ${attempt === 1 ? 'retrying' : 'FAILED'} ${e.message.split('\n')[0]}`);
          // A failed setup can leave the page in any state: start again
          await app.ctx.close(); app = await openApp(b, lang, phone);
        }
      }
      await app.ctx.close();
    }
    fs.writeFileSync(mf, JSON.stringify(manifest));
  }
  await b.close();
}
run();
