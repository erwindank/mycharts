/* ═══════════════════════════════════════════════════════════════════
   SETUP GUIDE SCREENSHOTS (SETUP-GUIDE-PLAN.md step 7, 2026-11-07)

   The setup guide draws other sites' screens itself (setup-scenes.js),
   but dankcharts.fm's own screens are real pictures, taken here from the
   real app in all four languages. Like tools/guide-shots.mjs, each shot
   also measures where its controls sit, so the guide's numbered dots
   land on them in every language. Spots here are named by their dot
   number ("1", "2" …) — the number shown in the guide's "Do this" list.

   Run (from the repo root, with the site served on :8777):
     cd dankcharts && python -m http.server 8777
     node tools/setup-shots.mjs                every shot, every language
     node tools/setup-shots.mjs dc-set-file en one shot, one language

   Writes  dankcharts/setup/<lang>/<shot>.webp
           dankcharts/setup/<lang>/shots.json   { shot: { w, h, spots } }
   w/h are CSS pixels (the picture itself is DPR times larger).

   Nothing here changes saved state: a made-up "connected" Last.fm status
   and the Push button are set on screen only, never stored.
   Playwright comes from C:/tmp (PW_FROM to override); WebP via Pillow.
   ═══════════════════════════════════════════════════════════════════ */
import { createRequire } from 'module';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire((process.env.PW_FROM || 'C:/tmp') + '/package.json');
const { chromium } = require('playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dankcharts', 'setup');
const URL = 'http://localhost:8777/index.html';
const LANGS = ['en', 'es', 'pt-BR', 'pt-PT'];
const LOCALE = { en: 'en-GB', es: 'es-ES', 'pt-BR': 'pt-BR', 'pt-PT': 'pt-PT' };
const DPR = 2;                               // the guide zooms pictures; keep them sharp
const DESK = { width: 1280, height: 1600 };
const wait = (pg, ms) => pg.waitForTimeout(ms);

// A made-up sheet link / Web App URL for the filled-in fields
const SHEET = 'https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz0123456789/edit?usp=sharing';
const WEBAPP = 'https://script.google.com/macros/s/AKfycbx3Qm8Lz0Example7hT2/exec';

/* ── Page states ─────────────────────────────────────────────────── */
// The Settings window on the Data source tab, with one source card picked
async function settings(pg, card) {
  await pg.evaluate(card => {
    if (document.getElementById('sourceModal').classList.contains('open')) closeSourceModal();
    openSourceModal(); switchSettingsTab('source');
    if (card) document.getElementById(card).click();
    document.querySelector('#sourceModal .dc-modal').scrollTop = 0;
  }, card);
  await wait(pg, 1200);
}
// Last.fm Account shown as connected — on screen only
async function fakeConnected(pg) {
  await pg.evaluate(() => {
    const s = document.getElementById('lfmAuthStatus');
    s.innerHTML = '<span class="lfm-auth-dot connected"></span> ' + t('set_lfm_connected', { user: 'alex_listens' });
    document.getElementById('lfmConnectBtn').style.display = 'none';
    const d = document.getElementById('lfmDisconnectBtn'); d.style.display = ''; d.textContent = t('set_lfm_disconnect');
  });
}
async function rawData(pg) {
  await pg.evaluate(() => { try { closeEditScrobbleModal(); } catch (e) {} if (document.getElementById('sourceModal').classList.contains('open')) closeSourceModal(); });
  await pg.evaluate(() => document.querySelector('#periodNav button[data-period="rawdata"]').click());
  await pg.waitForFunction(() => document.querySelectorAll('#rawBody tr').length > 5, null, { timeout: 60000 });
  await wait(pg, 800);
  await pg.evaluate(() => window.scrollTo(0, 0));
}

/* ── The shots ───────────────────────────────────────────────────
   id      file name (= the scene name the guide asks for)
   fresh   start from the landing screen (no data loaded)
   setup   gets the page into the right state
   clip    { from, to, pad, narrow } — the picture runs from the top of
           `from` to the bottom of `to`; narrow = only as wide as them
   spots   dot number → selector (or { js })                         */
const SHOTS = [
  { id: 'dc-landing-lfm', fresh: true,
    setup: async pg => {
      await pg.evaluate(() => { selectLandingSource('lastfm'); });
      await wait(pg, 700);
      await pg.fill('#landingLastfmUser', 'alex_listens');
      await pg.evaluate(() => { document.getElementById('landingCta').style.display = ''; document.activeElement.blur(); });
      await wait(pg, 900);
    },
    clip: { from: '.landing-cards', to: '#landingCta', pad: 16, narrow: true },
    spots: { 1: '#landingCardLastfm', 2: '#landingLastfmUser', 3: '.landing-start-btn' } },

  { id: 'dc-set-sheets',
    setup: async pg => { await settings(pg, 'srcCardSheets'); await pg.fill('#srcSheetId', SHEET); await pg.fill('#srcSheetTab', ''); },
    clip: { from: '#sourceModal .src-modal-header', to: '#sourceModal .set-save', pad: 10, narrow: true },
    spots: { 1: '#srcCardSheets', 2: '#srcSheetId', 3: '#srcSheetTab', 4: '#sourceModal .set-save' } },

  { id: 'dc-set-webapp',
    setup: async pg => {
      await settings(pg, 'srcCardSheets');
      await pg.fill('#srcSheetId', SHEET);
      await pg.evaluate(() => { const d = document.getElementById('srcSheetWriteUrl').closest('details'); d.open = true; });
      await pg.fill('#srcSheetWriteUrl', WEBAPP);
      await pg.evaluate(() => document.getElementById('srcSheetWriteUrl').scrollIntoView({ block: 'center' }));
      await wait(pg, 600);
    },
    // The field and the last line of the "Set up once" list just above it
    clip: { from: { js: "document.getElementById('srcSheetWriteUrl').closest('label').previousElementSibling.lastElementChild" }, to: { js: "document.getElementById('srcSheetWriteUrl').closest('label').nextElementSibling" }, pad: 14, narrow: true },
    spots: { 1: '#srcSheetWriteUrl' } },

  { id: 'dc-set-lfm-creds',
    setup: async pg => {
      await settings(pg, 'srcCardLastfm');
      await pg.evaluate(() => { document.querySelector('#lfmAccountSection details.lfm-custom-creds').open = true; });
      await pg.fill('#srcLfmApiKey', '3f7a1c9e0b2d4f6a8c1e3b5d7f9a2c4e');
      await pg.fill('#srcLfmApiSecret', '9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d');
      await pg.evaluate(() => document.getElementById('lfmAccountSection').scrollIntoView({ block: 'center' }));
      await wait(pg, 600);
    },
    clip: { from: '#lfmAccountSection', to: '#lfmAccountSection', pad: 14, narrow: true },
    spots: { 1: '#lfmAccountSection .lfm-auth-divider', 2: '#lfmAccountSection details.lfm-custom-creds > summary', 3: '#srcLfmApiKey', 4: '#srcLfmApiSecret' } },

  { id: 'dc-set-lfm-connect',
    setup: async pg => {
      await settings(pg, 'srcCardLastfm');
      await pg.evaluate(() => { updateLfmAuthStatus(); document.querySelector('#lfmAccountSection details.lfm-custom-creds').open = false;
        document.getElementById('lfmAccountSection').scrollIntoView({ block: 'center' }); });
      await wait(pg, 600);
    },
    clip: { from: '#lfmAccountSection', to: '#lfmAccountSection', pad: 14, narrow: true },
    spots: { 1: '#lfmConnectBtn' } },

  { id: 'dc-set-lfm-connected',
    setup: async pg => {
      await settings(pg, 'srcCardLastfm');
      await fakeConnected(pg);
      await pg.evaluate(() => { document.querySelector('#lfmAccountSection details.lfm-custom-creds').open = false;
        document.getElementById('lfmAccountSection').scrollIntoView({ block: 'center' }); });
      await wait(pg, 600);
    },
    clip: { from: '#lfmAccountSection', to: '#lfmAccountSection', pad: 14, narrow: true },
    spots: { 1: '#lfmAuthStatus' } },

  { id: 'dc-set-file',
    setup: async pg => { await settings(pg, 'srcCardFile'); },
    clip: { from: '#sourceModal .src-modal-header', to: '#srcFileDrop', pad: 12, narrow: true },
    spots: { 1: '#setTabSource', 2: '#srcCardFile', 3: '#srcFileDrop' } },

  // Raw Data sits in the top bar's More menu
  { id: 'dc-more',
    setup: async pg => {
      await pg.evaluate(() => { window.scrollTo(0, 0); document.querySelector('#moreCtrlGroup .ctrl-group-btn').click(); });
      await wait(pg, 800);
    },
    clip: { from: '#topbarNav', to: '#moreCtrlGroup .tb-more-panel', pad: 14, narrow: true },
    spots: { 1: '#moreCtrlGroup .tb-more-btn', 2: '#moreCtrlGroup .tb-more-item[data-go="rawdata"]' } },

  { id: 'dc-raw',
    setup: async pg => { await rawData(pg); },
    clip: { from: '#rawDataView .raw-bar', to: { js: "[...document.querySelectorAll('#rawBody tr')][4]" }, pad: 10 },
    spots: { 1: '#rawBody .raw-edit-btn' } },

  { id: 'dc-raw-edit',
    setup: async pg => {
      await rawData(pg);
      await pg.evaluate(() => { openEditScrobbleModal(2); });
      await wait(pg, 900);
      await pg.evaluate(() => { document.getElementById('editPushLfmBtn').style.display = ''; });
    },
    clip: { from: '#editScrobbleModal .dc-modal', to: '#editScrobbleModal .dc-modal', pad: 10, narrow: true },
    spots: { 1: { js: "document.getElementById('editScrobbleArtist').closest('.dc-modal').querySelector('#editScrobbleArtist').parentElement.parentElement" }, 2: '#editPushLfmBtn' } }
];

/* ── Measuring + capture (same method as guide-shots.mjs) ───────── */
async function measure(pg, clip, spots) {
  return pg.evaluate(({ clip, spots }) => {
    const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(el).visibility !== 'hidden'; };
    const first = sel => { for (const s of sel.split(/,(?![^(]*\))/)) { const el = [...document.querySelectorAll(s.trim())].find(vis); if (el) return el; } return null; };
    const pick = s => typeof s === 'string' ? first(s) : (new Function('return ' + s.js))();
    const a = pick(clip.from), b = pick(clip.to);
    if (!a || !b) return { err: 'clip not found: ' + JSON.stringify(!a ? clip.from : clip.to) };
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const box = (document.querySelector('#mainApp') || document.body).getBoundingClientRect();
    const pad = clip.pad || 0;
    const L = clip.narrow ? Math.min(ra.left, rb.left) : box.left, Rr = clip.narrow ? Math.max(ra.right, rb.right) : box.right;
    const x = Math.max(0, L - pad), right = Math.min(innerWidth, Rr + pad);
    const y = Math.max(0, Math.min(ra.top, rb.top) - pad + scrollY);
    const bottom = Math.max(ra.bottom, rb.bottom) + pad + scrollY;
    const r = { x, y, width: right - x, height: bottom - y };
    const out = {};
    for (const [k, sel] of Object.entries(spots)) {
      let el;
      try { el = typeof sel === 'string' ? first(sel) : (new Function('return ' + sel.js))(); } catch (e) { el = null; }
      if (!vis(el)) continue;
      const q = el.getBoundingClientRect();
      const sx = q.left - r.x, sy = q.top + scrollY - r.y;
      if (sx > r.width || sy > r.height || sx + q.width < 0 || sy + q.height < 0) continue;
      const cx = Math.max(0, sx), cy = Math.max(0, sy);
      const cw = Math.min(r.width, sx + q.width) - cx, ch = Math.min(r.height, sy + q.height) - cy;
      out[k] = [cx / r.width, cy / r.height, cw / r.width, ch / r.height].map(v => +v.toFixed(4));
    }
    return { clip: r, spots: out };
  }, { clip, spots });
}

async function openApp(b, lang, fresh) {
  const ctx = await b.newContext({ viewport: DESK, deviceScaleFactor: DPR, locale: LOCALE[lang] });
  await ctx.addInitScript(l => {
    try { localStorage.setItem('dankcharts-lang', l); localStorage.setItem('dc_guide_seen', '999'); } catch (e) {}
  }, lang);
  const pg = await ctx.newPage();
  pg.on('pageerror', e => console.log('  page error:', e.message));
  await pg.goto(URL);
  await wait(pg, 1800);
  if (!fresh) {
    await pg.evaluate(() => startWithSampleData());
    await pg.waitForFunction('allPlays && allPlays.length>0', null, { timeout: 120000 });
    await wait(pg, 3000);
  }
  await pg.evaluate(() => {
    document.getElementById('cgWelcomeGate')?.remove();
    document.body.classList.remove('cg-gate-open');
    const st = document.createElement('style');
    st.textContent = '.sync-toast,#syncToast,.dc-toast,#backToTop,.back-to-top,.gd-toast{display:none!important}';
    document.head.appendChild(st);
  });
  return { ctx, pg };
}

async function run() {
  const [only, onlyLang] = process.argv.slice(2);
  const langs = onlyLang ? [onlyLang] : LANGS;
  const shots = SHOTS.filter(s => !only || only === 'all' || s.id === only);
  const b = await chromium.launch();
  for (const lang of langs) {
    const dir = path.join(ROOT, lang);
    fs.mkdirSync(dir, { recursive: true });
    const mf = path.join(dir, 'shots.json');
    const manifest = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : {};
    for (const s of shots) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        // A fresh page per shot: shots open different windows and fake states
        const app = await openApp(b, lang, s.fresh);
        try {
          await s.setup(app.pg);
          await wait(app.pg, 500);
          const m = await measure(app.pg, s.clip, s.spots);
          if (m.err) throw new Error(m.err);
          const png = path.join(dir, s.id + '.png');
          await app.pg.screenshot({ path: png, clip: m.clip, fullPage: true });
          execFileSync('python', ['-c', 'import sys;from PIL import Image;im=Image.open(sys.argv[1]).convert("RGB");im.save(sys.argv[2],"WEBP",quality=82,method=6)', png, png.replace(/\.png$/, '.webp')]);
          fs.unlinkSync(png);
          manifest[s.id] = { w: Math.round(m.clip.width), h: Math.round(m.clip.height), spots: m.spots };
          const miss = Object.keys(s.spots).filter(k => !m.spots[k]);
          console.log(`  ${lang} ${s.id}: ${Object.keys(m.spots).length} spots` + (miss.length ? ` (not found: ${miss.join(', ')})` : ''));
          await app.ctx.close();
          break;
        } catch (e) {
          console.log(`  ${lang} ${s.id}: ${attempt === 1 ? 'retrying' : 'FAILED'} ${e.message.split('\n')[0]}`);
          await app.ctx.close();
        }
      }
    }
    fs.writeFileSync(mf, JSON.stringify(manifest));
  }
  await b.close();
}
run();
