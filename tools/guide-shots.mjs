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
      step: '.crp .crp-uback', speeds: '.crp .crp-speeds', log: '.crp .crp-log', keys: '.crp .crp-keys' } }
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
    // Always the app's own width (the top bar is full-window, the content isn't)
    const x = Math.max(0, box.left - pad);
    const right = Math.min(innerWidth, box.right + pad);
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
