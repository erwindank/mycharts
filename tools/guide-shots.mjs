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
async function showAll(pg) { await pg.evaluate(() => setSectionDisplayShowAll(true)); await wait(pg, 500); }
async function layout(pg, v) { await pg.evaluate(v => setWeeklyChartView(v), v); await wait(pg, 1800); }
async function openKebab(pg, tab) {
  await pg.evaluate(() => window.scrollTo(0, 0));
  await pg.click('#songsSection .kebab-menu-btn');
  await wait(pg, 300);
  if (tab) { await pg.click('#songsSection .kebab-tab[data-tab="' + tab + '"]'); await wait(pg, 300); }
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
    spots: { more: R(1) + ' .ea-more', menu: '.ea-menu, [role="menu"]' } },
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
    spots: { prev: '#prevBtn', label: '#periodLabel', next: '#nextBtn', banner: '#statsHeroTop', tiles: '#statsStrip' } }
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
    const box = (document.querySelector('#mainApp') || document.body).getBoundingClientRect();
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
        try {
          // A fresh start per shot keeps one shot's open menu out of the next
          await app.pg.evaluate(() => { window.scrollTo(0, 0); document.querySelectorAll('.kebab-menu-wrap.open').forEach(e => e.classList.remove('open')); });
          await closeMenus(app.pg);
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
        } catch (e) {
          console.log(`  ${lang} ${id}: FAILED ${e.message.split('\n')[0]}`);
          // A failed setup can leave the page in any state: start again for the next shot
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
