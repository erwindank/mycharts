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
// Daily uses 27 Oct 2026: a busy day in the demo library. Its offset is worked out
// from today, so a retake on a later day still lands on the same day.
async function at(pg, period, offset, { spotlight = false } = {}) {
  await go(pg, period); await wait(pg, 900);
  await pg.evaluate(o => { setChartTypeView('songs'); currentOffset = o; renderAll(); }, offset);
  await pg.waitForFunction(sp => document.querySelectorAll('#songsBody tr[data-ea-key]').length >= 3 &&
    document.querySelector('#statsHeroTop') && (!sp || document.querySelector('.spotlight-card')), spotlight, { timeout: 60000 });
  await wait(pg, 2200);
}
const DAY_OFF = (() => {
  const n = new Date(), today = Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
  return Math.round((today - Date.UTC(2026, 9, 27)) / 864e5);
})();
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
// Your Soundtrack on a period (year / month / alltime), every chapter drawn.
// Chapters fade in as they scroll into view, so they are all marked shown and
// the page is scrolled through once; pop-ups from the shot before are closed.
async function stView(pg, period = 'year') {
  await pg.evaluate(() => {
    try { stStoryClose(); } catch (e) {} try { stCloseCard(); } catch (e) {}
    try { stCloseArtistModal(); } catch (e) {} try { stStopReplay(); } catch (e) {}
  });
  await unfold(pg, false);
  await go(pg, 'soundtrack'); await wait(pg, 3000);
  await pg.evaluate(p => { if (stPeriodType !== p) stSetPeriod(p); }, period);
  await pg.waitForFunction(() => document.querySelector('#stStatsStrip .st-stat-val') && /\d/.test(document.getElementById('stStatPlaysVal').textContent), null, { timeout: 90000 });
  for (let y = 0; y < 12000; y += 900) { await pg.evaluate(y => window.scrollTo(0, y), y); await wait(pg, 250); }
  await pg.evaluate(() => { document.querySelectorAll('#soundtrackView .st-reveal').forEach(e => e.classList.add('st-in')); window.scrollTo(0, 0); });
  await wait(pg, 3500);
}
// The Dank 100 shots can pretend to be signed in with your own library (for
// the Send buttons): undone before every Dank 100, Ratings and Events shot.
async function d1Unfake(pg) {
  await pg.evaluate(() => {
    if (window._gdSheet === undefined) return;
    if (window._gdSheet) localStorage.setItem('dc_sheet_id', window._gdSheet);
    window._gdSheet = undefined;
    _currentUser = null;
  });
}
// The Dank 100 (live data from dankcharts.fm: localhost has no Functions),
// the latest chart, on a type, with row 1's run open or closed
async function d1View(pg, { type = 'songs', open = false } = {}) {
  await d1Unfake(pg);
  await pg.evaluate(() => { try { dcDank100.hideWeekPreview(); } catch (e) {} });
  await go(pg, 'dank100');
  // the chart, and the archive (records + runs) that loads after it
  await pg.waitForFunction(() => document.querySelectorAll('#dank100View .d100-row').length >= 10 &&
    document.querySelector('#dank100View .d100-recs'), null, { timeout: 90000 });
  await pg.evaluate(t => {
    const on = document.querySelector('#dank100View .d100-seg button.active');
    if (!on || !on.getAttribute('onclick').includes("'" + t + "'")) dcDank100.setType(t);
  }, type);
  await wait(pg, 800);
  await pg.evaluate(o => {
    const r = document.querySelector('#dank100View .d100-row');
    if ((r.getAttribute('aria-expanded') === 'true') !== o) r.click();
    window.scrollTo(0, 0);
  }, open);
  if (open) await pg.waitForFunction(() => document.querySelector('#dank100View .is-open .cr-boxes'), null, { timeout: 30000 });
  await wait(pg, 3000);
}
// Ratings: the demo library has no scores, so the 14 most played albums after
// the first get some (every track a quick score, most of them the six album
// aspects too), plus one song on the full rubric. Done once per browser; the
// rated albums' keys are kept in gd_rt_keys for the editor shots.
async function rtSeed(pg) {
  await pg.evaluate(() => {
    if (localStorage.getItem('gd_rt_keys')) return;
    const sum = ratingLibrarySummary();
    const keys = sum.todo.filter(k => ratingReleaseKind(k).kind === 'album').slice(1, 15);
    const base = [8.6, 7.9, 9.1, 6.8, 8.2, 7.4, 9.4, 5.9, 7.7, 8.8, 6.3, 8.0, 7.1, 9.0];
    let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const sc = (b, spread) => Math.max(3, Math.min(10, Math.round((b + (rnd() - 0.5) * spread) * 10) / 10));
    const day = 864e5, now = Date.now();
    keys.forEach((k, i) => {
      const ts = now - (i * 2 + 1) * day;
      ratingAlbumTrackKeys(k).forEach(tr => { _ratings.songs[tr.key] = { m: 'quick', q: sc(base[i], 2.4), c: {}, note: '', ts }; });
      if (i % 4 !== 3) {
        const c = {};
        RATING_ALBUM_CRITERIA.forEach(cr => { c[cr.id] = sc(base[i], 2); });
        _ratings.albums[k] = { c, note: '', ts };
      }
    });
    // The first album's first track on the full rubric
    const t0 = ratingAlbumTrackKeys(keys[0])[0];
    if (t0) _ratings.songs[t0.key] = { m: 'detailed', q: null, c: { comp: 9.2, lyr: 8.8, voc: 9.0, prod: 8.6, mel: 9.5, rhy: 8.4 }, note: '', ts: now - day };
    ratingsPersist(true);
    localStorage.setItem('gd_rt_keys', JSON.stringify(keys));
  });
}
// The Ratings page on one of its lists (albums / todo), editor closed
async function rtView(pg, list = 'albums') {
  await d1Unfake(pg);
  await pg.evaluate(() => { try { closeRatingModal(); } catch (e) {} });
  await unfold(pg, false);
  await rtSeed(pg);
  await go(pg, 'ratings');
  await pg.waitForFunction(() => document.querySelector('#ratingsPageBody .ar-list'), null, { timeout: 60000 });
  await pg.evaluate(v => {
    arSetView('p', v);
    // the highs and lows slide by themselves: hold them on their first entry
    clearInterval(_rpHiTimer);
    document.querySelectorAll('#ratingsPageBody .rp-hi').forEach(c => rpHiGo(+c.dataset.hi, 0));
    window.scrollTo(0, 0);
  }, list);
  await wait(pg, 3000);
}
// The rating editor on the first rated album: tab 'aspects' / 'tracks', or
// song: 'detailed' (its first track, opened from the album) / 'quick' (its second)
async function rtEditor(pg, { tab = 'aspects', song = null } = {}) {
  await rtView(pg);
  await pg.evaluate(({ tab, song }) => {
    const k = JSON.parse(localStorage.getItem('gd_rt_keys'))[0];
    openRatingModal('album', k, { tab });
    if (song) openRatingModal('song', ratingAlbumTrackKeys(k)[song === 'quick' ? 1 : 0].key, { push: true });
  }, { tab, song });
  await wait(pg, 2500);
}
const rtAlbumKey = pg => pg.evaluate(() => JSON.parse(localStorage.getItem('gd_rt_keys'))[0]);

// Events: fetching the top 50 artists' events takes minutes, so the first
// fetch is kept in C:/tmp (for 20 hours) and put in place on every new page.
const EV_CACHE = 'C:/tmp/guide-ev-cache.json';
const EV_KEYS = ['dc_eventsCache', 'dc_concertsCache', 'dc_nmfCache', 'dc_nmfHistory'];
async function evView(pg, tab = 'today', { view = 'carousel', cal = 'month' } = {}) {
  await d1Unfake(pg);
  await pg.evaluate(() => { document.querySelectorAll('.tm-action-menu').forEach(m => m.remove()); });
  const fresh = fs.existsSync(EV_CACHE) && Date.now() - fs.statSync(EV_CACHE).mtimeMs < 20 * 3600e3;
  if (fresh) {
    const pre = JSON.parse(fs.readFileSync(EV_CACHE, 'utf8'));
    await pg.evaluate(pre => { if (window._gdEv) return; window._gdEv = 1; for (const [k, v] of Object.entries(pre)) localStorage.setItem(k, v); }, pre);
  }
  await go(pg, 'events');
  await pg.waitForFunction(() => !/\(\d+\/\d+\)/.test(document.getElementById('eventsStatus').textContent) &&
    document.querySelector('#eventsTodayBody .ev-carousel-card'), null, { timeout: 480000 });
  if (!fresh) {
    const dump = await pg.evaluate(K => Object.fromEntries(K.map(k => [k, localStorage.getItem(k)]).filter(x => x[1])), EV_KEYS);
    fs.writeFileSync(EV_CACHE, JSON.stringify(dump));
  }
  await pg.evaluate(({ tab, view, cal }) => {
    // ⓘ's status line closed, the tab, its view
    if (document.getElementById('eventsInfoBtn').getAttribute('aria-expanded') === 'true') toggleEventsStatus();
    setEventsTab(tab);
    if (tab === 'coming' || tab === 'recent') setEventsView(view);
    if (tab === 'calendar') setCalView(cal);
  }, { tab, view, cal });
  await wait(pg, 3500);
  // Reels roll by themselves: stop them at their start
  await pg.evaluate(() => {
    document.querySelectorAll('#eventsView .dcreel, #eventsView [data-reel-ready]').forEach(r => { r.dataset.reelPaused = '1'; r.scrollLeft = 0; });
    window.scrollTo(0, 0);
  });
  await wait(pg, 1500);
}

// The fetched Events kept in C:/tmp (above) put in place before a tab that
// shows releases (Events, the Playlists tab's two release lists)
async function evCacheIn(pg) {
  if (!(fs.existsSync(EV_CACHE) && Date.now() - fs.statSync(EV_CACHE).mtimeMs < 20 * 3600e3)) return;
  const pre = JSON.parse(fs.readFileSync(EV_CACHE, 'utf8'));
  await pg.evaluate(pre => { if (window._gdEv) return; window._gdEv = 1; for (const [k, v] of Object.entries(pre)) localStorage.setItem(k, v); }, pre);
}

// Playlists: three made-up playlists from the demo library's songs (once per
// browser), and the automatic playlists card as a signed-in listener sees it
// (Weekly and Monthly on). Never presses Play: that would use YouTube searches.
async function plView(pg, { open = null, auto = true } = {}) {
  await d1Unfake(pg);
  await evCacheIn(pg);
  await pg.evaluate(() => {
    document.querySelectorAll('.dc-pl-export-menu').forEach(m => m.remove());
    const pick = document.getElementById('dcPlPickModal'); if (pick) pick.classList.remove('open');
    if (_ytPlaylists['Late night drive']) return;
    const c = {};
    allPlays.forEach(p => { const k = p.title + '|||' + p.artist; (c[k] = c[k] || { title: p.title, artist: p.artist, album: p.album, n: 0 }).n++; });
    const top = Object.values(c).sort((a, b) => b.n - a.n);
    const T = a => a.map(x => ({ title: x.title, artist: x.artist, album: x.album }));
    // oldest first, so the newest ("Late night drive") leads the Recent sort
    _ytPlaylists['Best of 2026'] = T(top.slice(0, 40)); _ytTouchPlaylist('Best of 2026');
    _ytPlaylists['Gym'] = T(top.slice(40, 58)); _ytTouchPlaylist('Gym');
    _ytPlaylists['Late night drive'] = T(top.slice(10, 34)); _ytTouchPlaylist('Late night drive');
    _ytSavePlaylists();
  });
  await pg.evaluate(auto => {
    if (!window._gdApOrig) window._gdApOrig = { s: dcIsSignedIn, a: _apAllowed };
    if (auto) {
      dcIsSignedIn = () => true; _apAllowed = () => true;
      apSettings = { day: { on: false }, week: { on: true, size: 20 }, month: { on: true, size: 50 }, year: { on: false } };
    } else { dcIsSignedIn = window._gdApOrig.s; _apAllowed = window._gdApOrig.a; apSettings = null; }
  }, auto);
  await go(pg, 'playlists'); await wait(pg, 2500);
  // dcPlToggleExpand toggles: only call it when the open playlist must change
  await pg.evaluate(o => { if (_dcPlExpandedName !== o) dcPlToggleExpand(o); apRenderSetup(); window.scrollTo(0, 0); }, open);
  await pg.waitForFunction(() => document.querySelector('#dcPlMain .plx-card, #dcPlMain .plx-hero'), null, { timeout: 30000 });
  await wait(pg, 3500);
}
// Put the real sign-in check back after the Playlists shots
async function plUnfake(pg) {
  await pg.evaluate(() => {
    if (!window._gdApOrig) return;
    dcIsSignedIn = window._gdApOrig.s; _apAllowed = window._gdApOrig.a; apSettings = null;
  });
}

// Raw Data on page 1 with every filter cleared. Once per browser, one single's
// album is corrected the way a listener would (the edit window, "save as a
// rule"), and two more rules are added, so the ~ badge and the rules show.
async function rdView(pg, { corrected = false } = {}) {
  await d1Unfake(pg); await plUnfake(pg);
  await pg.evaluate(() => { try { closeEditScrobbleModal(); } catch (e) {} try { closeRulesModal(); } catch (e) {} });
  await go(pg, 'rawdata'); await wait(pg, 2500);
  await pg.evaluate(async () => {
    if (localStorage.getItem('gd_rd_seeded')) return;
    localStorage.setItem('gd_rd_seeded', '1');
    // The demo has both "Panic! at the Disco" and "Panic! At The Disco": one song's spelling fixed
    const p = allPlays.find(x => x.artist === 'Panic! at the Disco');
    if (p) saveAutocorrectRule(p.artist, p.title, rawAlbumOf(p), 'Panic! At The Disco', p.title, rawAlbumOf(p), { skipSheetSync: true });
    const q = allPlays.find(x => /\(feat\./i.test(x.title));
    if (q) saveAutocorrectRule(q.artist, q.title, rawAlbumOf(q), q.artist, q.title.replace(/\s*\(feat\..*\)$/i, ''), rawAlbumOf(q), { skipSheetSync: true });
    // as a load does: the rules rewrite the plays, then the derived keys are rebuilt
    allPlays = applyAutocorrectRules(allPlays);
    firstSeenMaps = null; _certTimeline = null;
    stampPlays(allPlays);
  });
  await pg.evaluate(c => {
    ['rawFilterSong', 'rawFilterArtist', 'rawFilterAlbum', 'rawFilterDate'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const cb = document.getElementById('rawFilterCorrected'); if (cb) cb.checked = c;
    applyRawFilters(); window.scrollTo(0, 0);
  }, corrected);
  await wait(pg, 2500);
}

// The Board with made-up posts (dcBoard._sample): the guide never shows real
// people's posts or names. open: a post id to open; compose: the new-post
// form as a signed-in listener sees it.
const BD_DAY = 864e5;
async function bdView(pg, { open = null, compose = false } = {}) {
  await d1Unfake(pg); await plUnfake(pg);
  await go(pg, 'board'); await wait(pg, 2500);
  await pg.evaluate(({ open, compose, D }) => {
    const now = Date.now(), P = (id, category, status, title, body, authorName, voteCount, replyCount, days, act, pinned) =>
      ({ id, category, status, title, body, authorName, authorPhoto: '', authorUid: 'u-' + id, voteCount, votes: [], replyCount,
        createdAt: now - days * D, lastActivity: now - act * D, pinned: !!pinned });
    const posts = [
      P('welcome', 'discussion', 'open', 'Welcome to the Board', 'Say hi, share what you are listening to, and tell us what you would like next.', 'dankcharts', 3, 5, 40, 2, true),
      P('season', 'suggestion', 'planned', 'Top songs for each season', 'A summer, autumn, winter and spring chart would be fun to look back on.', 'Maya R.', 14, 3, 6, 1),
      P('summer', 'discussion', 'open', 'What was your #1 song this summer?', 'Mine stayed at the top for nine weeks. Yours?', 'Ines', 9, 12, 9, 0.2),
      P('history', 'question', 'done', 'How do I add my older listening history?', 'I have years of plays in a CSV file. Can I add them?', 'Leo', 6, 2, 12, 5),
      P('art', 'bug', 'progress', 'Missing covers on a few singles', 'Some singles show initials instead of their cover.', 'Sam K.', 4, 1, 3, 1.5)
    ];
    const R = (id, authorName, body, days) => ({ id, authorName, authorPhoto: '', authorUid: 'r-' + id, body, createdAt: now - days * D });
    const replies = {
      season: [R('a', 'Ines', 'Yes please! Summer especially.', 5), R('b', 'Leo', 'Would love a share picture for it too.', 4),
        R('c', 'dankcharts', 'On the list. Thanks for the idea!', 1)]
    };
    if (compose) { _currentUser = { uid: 'guide-shot', displayName: 'You', photoURL: '' }; window._gdSheet = window._gdSheet ?? null; }
    dcBoard._sample(posts, replies);
    dcBoard.setCat('all'); dcBoard.setStatus('all'); dcBoard.setSort('top');
    if (open) dcBoard.toggle(open);
    if (compose) dcBoard.compose();
    window.scrollTo(0, 0);
  }, { open, compose, D: BD_DAY });
  await wait(pg, 1500);
}

// Settings & account. The account menu and Notifications are pictured signed
// in as a made-up listener ("Alex") with made-up notifications; acctUnfake
// signs that pretend account out again.
async function acctUnfake(pg) {
  await pg.evaluate(() => {
    if (!window._gdAcct) return;
    window._gdAcct = false;
    _currentUser = null; _refreshAuthUI(null);
    try { ntClose(); } catch (e) {}
    ntItems = []; ntRefresh();
  });
}
async function acctFake(pg) {
  await pg.evaluate(() => {
    window._gdAcct = true;
    _currentUser = { uid: 'guide-shot', displayName: 'Alex', email: '', photoURL: '' };
    _refreshAuthUI(_currentUser);
    // no account to load from: the made-up list below stays
    dcLoadNotifications = async () => null; dcUpdateNotifications = async () => null;
    const now = Date.now(), H = 36e5;
    const N = (kind, h, read, p) => ({ id: kind + h, kind, at: now - h * H, read, p, link: null });
    ntItems = [
      N('ap_made', 1, false, { name: t('ap_name_week', { n: 20, when: '30 Oct – 5 Nov' }) }),
      N('cert_new', 3, false, { type: 'song', title: 'Housewife', artist: 'Tate McRae', tier: 'gold' }),
      N('bd_reply', 26, true, { name: 'Ines', title: 'Top songs for each season' }),
      N('st_month', 30, true, { key: '2026-10' }),
      N('rec_new', 75, true, { type: 'song', name: 'The Fate of Ophelia', artist: 'Taylor Swift', title: t('d100_rec_at1'), n: 1 })
    ];
    ntRefresh();
  });
}
// The Settings window on a tab, as if just opened. The time zone list shows a
// city for the picture's language rather than this computer's own.
const TZ = { en: 'America/New_York', es: 'Europe/Madrid', 'pt-BR': 'America/Sao_Paulo', 'pt-PT': 'Europe/Lisbon' };
async function setView(pg, tab, { card = null } = {}) {
  await d1Unfake(pg); await plUnfake(pg); await acctUnfake(pg);
  await pg.evaluate(() => {
    document.querySelectorAll('.ctrl-group.open').forEach(g => g.classList.remove('open'));
    if (document.getElementById('sourceModal').classList.contains('open')) closeSourceModal();
  });
  await pg.evaluate(({ tab, card, TZ }) => {
    openSourceModal(); switchSettingsTab(tab);
    const s = document.getElementById('setSearch'); if (s && s.value) { s.value = ''; s.dispatchEvent(new Event('input')); }
    if (card) document.getElementById(card).click();
    const tz = document.getElementById('srcTimezone'), want = TZ[currentLang] || TZ.en;
    if (tz && [...tz.options].some(o => o.value === want)) tz.value = want;
    document.querySelector('#sourceModal .dc-modal, #sourceModal .modal').scrollTop = 0;
  }, { tab, card, TZ });
  await wait(pg, 1500);
}
// A top-bar menu (theme / language / account) opened
async function tbMenu(pg, groupId) {
  await pg.evaluate(() => { if (document.getElementById('sourceModal').classList.contains('open')) closeSourceModal(); window.scrollTo(0, 0); });
  await pg.evaluate(id => { document.querySelectorAll('.ctrl-group.open').forEach(g => g.classList.remove('open')); document.querySelector('#' + id + ' .ctrl-group-btn').click(); }, groupId);
  await wait(pg, 900);
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
      // Click the first result (Enter alone left the history empty): that saves the search and the pick
      await pg.waitForSelector('.lsx-item', { timeout: 15000 }); await pg.click('.lsx-item'); await wait(pg, 2500);
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
      nomd: '#realLifeContent .awards-reallife-badge.nom', work: '#realLifeContent .awards-reallife-work' } },

  /* ── Lesson: Your Soundtrack (GUIDE-PLAN.md step 8) ───────────────
     The year view (this year), one chapter per shot, plus Play your
     year, the share window, a discovery's pop-up and the replay. */
  { id: 'st-top', lesson: 'soundtrack', phone: true,
    setup: async pg => { await stView(pg); },
    clip: { from: '#soundtrackView > .section-header', to: '#stReelSection', pad: 14 },
    spots: { period: '#stPeriodNav', nav: '#stNavBar', label: '#stNavLabel', story: '#stStoryBtn', replay: '#stTopReplayBtn',
      share: '#soundtrackView .st-controls [onclick*="stOpenCard"]', hero: '#stChYear .st-chap-l', mosaic: '#stYearMosaic',
      stats: '#stStatsStrip', stat: '#stStatsStrip .st-stat.active', reel: '#stReelTickerOuter', pl: '#stReelPlBtn' } },
  { id: 'st-month', lesson: 'soundtrack',
    setup: async pg => { await stView(pg, 'month'); },
    clip: { from: '#soundtrackView > .section-header', to: '#stStatsStrip', pad: 14 },
    spots: { period: '#stPeriodNav', month: '#stPeriodNav [data-st-period="month"]', nav: '#stNavBar', hero: '#stChYear .st-chap-l' } },
  { id: 'st-alltime', lesson: 'soundtrack',
    setup: async pg => { await stView(pg, 'alltime'); },
    clip: { from: '#soundtrackView > .section-header', to: '#stStatsStrip', pad: 14 },
    spots: { period: '#stPeriodNav', all: '#stPeriodNav [data-st-period="alltime"]', hero: '#stChYear .st-chap-l' } },
  { id: 'st-artist', lesson: 'soundtrack',
    setup: async pg => { await stView(pg); },
    clip: { from: '#stFeaturedArtist', to: '#stFeaturedArtist', pad: 12 },
    spots: { name: '#stFeaturedArtistName', count: '#stFeaturedArtistCount', big: '#stFeaturedStats .st-fa-big',
      favs: '#stFeaturedStats .st-fa-favs', stats: '#stFeaturedStats .st-fa-stats' } },
  { id: 'st-tops', lesson: 'soundtrack',
    setup: async pg => { await stView(pg); },
    clip: { from: '#stChTop', to: '#stChTop', pad: 12, maxH: 1400 },
    spots: { head: '#stHead_top', songs: '#stTopSongsSection', center: '#stTopSongs .st-cf-card.is-center',
      prev: '#stTopSongsSection .st-cf-nav-prev', next: '#stTopSongsSection .st-cf-nav-next', count: '#stTopSongsSection .st-cf-count',
      artists: '#stTopArtistsSection', albums: '#stTopAlbumsSection' } },
  { id: 'st-no1', lesson: 'soundtrack',
    setup: async pg => { await stView(pg); },
    clip: { from: '#stNo1Section', to: '#stNo1Section', pad: 12 },
    spots: { head: '#stNo1Section .st-chap-head', seg: '#stNo1Section .st-no1-seg', sum: '#stNo1Section .d100-no1-sum',
      strip: { js: "document.querySelector('#stNo1Section .d100-no1-seg').parentElement" }, row: '#stNo1Section .d100-no1-row',
      more: '#stNo1Section .d100-no1-more' } },
  { id: 'st-activity', lesson: 'soundtrack',
    setup: async pg => { await stView(pg); },
    clip: { from: '#stActivitySection', to: '#stActivitySection', pad: 12 },
    spots: { head: '#stActivitySection .st-chap-head', chart: '#stActivitySection .st-activity-chart',
      bar: '#stActivitySection .st-activity-bar-wrap' } },
  { id: 'st-loyalty', lesson: 'soundtrack',
    setup: async pg => { await stView(pg); },
    clip: { from: '#stLoyaltySection', to: '#stLoyaltySection', pad: 12 },
    spots: { head: '#stLoyaltySection .st-chap-head', ring: '#stLoyaltySection .st-loyalty-ring', row: '#stLoyaltySection .st-row',
      next: '#stLoyaltySection .st-row-next' } },
  { id: 'st-new', lesson: 'soundtrack',
    setup: async pg => { await stView(pg);
      await pg.evaluate(() => window.scrollTo(0, document.getElementById('stDiscoveriesSection').getBoundingClientRect().top + scrollY - 300)); await wait(pg, 4000); },
    clip: { from: '#stDiscoveriesSection', to: '#stDiscoveriesSection', pad: 12 },
    spots: { head: '#stHead_new', bubbles: '#stDiscoveriesBubbles', bubble: '#stDiscoveriesBubbles .st-bubble' } },
  { id: 'st-pop', lesson: 'soundtrack',
    setup: async pg => { await stView(pg);
      await pg.evaluate(() => window.scrollTo(0, document.getElementById('stDiscoveriesSection').getBoundingClientRect().top + scrollY - 300)); await wait(pg, 4000);
      await unfold(pg, true);
      await pg.evaluate(() => { const b = document.querySelector('#stDiscoveriesBubbles .st-bubble'); if (b) b.click(); });
      await pg.waitForFunction(() => { const m = document.getElementById('stArtistModal'); return m && m.offsetParent !== null && document.getElementById('stArtistModalName').textContent.trim(); }, null, { timeout: 30000 });
      await wait(pg, 3000); },
    clip: { from: '#stArtistModal .dc-modal', to: '#stArtistModal .dc-modal', pad: 10, narrow: true },
    spots: { nav: '#stArtistModalNav', name: '#stArtistModalName', meta: '#stArtistModalMeta', play: '#stArtistModal .st-am-play',
      links: '#stArtistModal .st-am-hero-links', share: '#stArtistModal .st-am-share', stats: '#stArtistModal .st-am-stats',
      goal: '#stArtistModal .st-am-goal', close: '#stArtistModal .modal-close' } },
  { id: 'st-mil', lesson: 'soundtrack',
    setup: async pg => { await stView(pg); },
    clip: { from: '#stChMilestones', to: '#stChMilestones', pad: 12, maxH: 1000 },
    spots: { head: '#stHead_milestones', overall: '#stMilestonesSection', artist: '#stArtistMilestonesSection',
      toggle: '#stArtistMilestonesToggle' } },
  { id: 'st-streaks', lesson: 'soundtrack',
    setup: async pg => { await stView(pg); },
    clip: { from: '#stStreaksSection', to: '#stStreaksSection', pad: 12 },
    spots: { head: '#stHead_streaks', cards: '#stStreaksSection .st-streaks-grid', card: '#stStreaksSection .st-streak-card',
      detail: '#stStreaksSection .st-streak-detail', cal: '#stStreaksSection .st-cal-wrap', chips: '#stStreaksSection .st-streak-chips',
      entity: '#stStreaksSection .st-streaks-grid--entity' } },
  { id: 'st-grammys', lesson: 'soundtrack',
    setup: async pg => { await stView(pg); },
    clip: { from: '#stGrammysSection', to: '#stGrammysSection', pad: 12, maxH: 900 },
    spots: { head: '#stHead_grammys', grid: '#stGrammysSection .st-grammy-grid', card: '#stGrammysSection .st-grammy-card' } },
  { id: 'st-end', lesson: 'soundtrack',
    setup: async pg => { await stView(pg); },
    clip: { from: '#stReplaySection', to: '#stCardSection', pad: 12 },
    spots: { replay: '#stReplayBtn', share: '#stCardSection .st-act-btn' } },
  { id: 'st-replay', lesson: 'soundtrack',
    setup: async pg => { await stView(pg); await pg.evaluate(() => stStartReplay()); await wait(pg, 7000);
      await pg.evaluate(() => { try { stReplayTogglePause(); } catch (e) {} }); await wait(pg, 800); },
    clip: { from: '#stReplaySection', to: '#stReplaySection', pad: 12 },
    spots: { canvas: '#stReplayCanvas', speed: '#stReplaySpeedBtn', prev: '#stReplayPrevBtn', pause: '#stReplayPauseBtn',
      next: '#stReplayNextBtn', stop: '#stReplayStopBtn' } },
  // Play your year: full screen, a shorter window
  { id: 'st-story', lesson: 'soundtrack', vp: { width: 1280, height: 860 },
    setup: async pg => { await stView(pg); await pg.evaluate(() => stStoryOpen()); await wait(pg, 2000);
      await pg.evaluate(() => stStoryGo(1)); await wait(pg, 2500); },
    clip: { from: '#stStory', to: '#stStory', narrow: true },
    spots: { bars: '#stStory .st-story-bars', close: '#stStory .st-story-close', prev: '#stStory .st-story-prev', next: '#stStory .st-story-next' } },
  { id: 'st-card', lesson: 'soundtrack',
    setup: async pg => { await stView(pg); await pg.evaluate(() => stOpenCard()); await wait(pg, 4500); },
    clip: { from: '#stCardModal .dc-modal', to: '#stCardModal .dc-modal', pad: 10, narrow: true },
    spots: { preview: '#stCardFrame', tpl: '#stTemplateRow', pal: '#stPaletteRow', fmt: '#stFormatBtns',
      art: { js: "document.getElementById('stOpt_showArt').closest('label')" }, src: '#stCardModal .sh-src-row',
      topn: { js: "document.getElementById('stTopN').closest('.sh-slider-row')" }, copy: '#stCardCopyBtn', dl: '#stCardDownloadBtn' } },

  /* ── Lesson: The Dank 100 (GUIDE-PLAN.md step 9) ────────────────────
     The live chart (whatever week is newest when the pictures are taken). */
  { id: 'd1-top', lesson: 'dank100', phone: true,
    setup: async pg => { await d1View(pg); },
    clip: { from: '#dank100View .d100-page-header', to: { js: "document.querySelectorAll('#dank100View .d100-li')[6]" }, pad: 14 },
    spots: { title: '#dank100View .d100-page-header', signin: '#dank100View .d100-signin', week: '#dank100View .d100-wk-select',
      prev: '#dank100View .d100-wk-btn', next: { js: "[...document.querySelectorAll('#dank100View .d100-wk-btn')].pop()" },
      from: '#dank100View .d100-chart-meta', seg: '#dank100View .d100-seg', export: '#dank100View [onclick*="exportPlaylist"]',
      share: '#dank100View [onclick*="dcDank100.share"]', cols: '#dank100View .d100-cols', row: '#dank100View .d100-row',
      pos: '#dank100View .d100-pos', move: { js: "document.querySelectorAll('#dank100View .d100-move')[1]" },
      pts: '#dank100View .d100-row .d100-pts', l: '#dank100View .d100-row .d100-l', lw: '#dank100View .d100-row .d100-lw',
      pk: '#dank100View .d100-row .d100-pk', wk: '#dank100View .d100-row .d100-wk', acts: '#dank100View .d100-acts' } },
  { id: 'd1-artists', lesson: 'dank100',
    setup: async pg => { await d1View(pg, { type: 'artists' }); },
    clip: { from: '#dank100View .d100-chart-head', to: { js: "document.querySelectorAll('#dank100View .d100-li')[4]" }, pad: 14 },
    spots: { seg: '#dank100View .d100-seg', row: '#dank100View .d100-row' } },
  { id: 'd1-run', lesson: 'dank100',
    setup: async pg => { await d1View(pg, { open: true }); },
    clip: { from: '#dank100View .d100-li.is-open', to: '#dank100View .d100-li.is-open', pad: 12 },
    spots: { row: '#dank100View .is-open .d100-row', plot: '#dank100View .is-open .d100-run-plot', story: '#dank100View .is-open .cr-story',
      ribbon: '#dank100View .is-open .cr-ribbon', chip: '#dank100View .is-open .cr-rb-chip', boxes: '#dank100View .is-open .cr-boxes',
      box: { js: "[...document.querySelectorAll('#dank100View .is-open .cr-boxes [onclick]')].pop()" } } },
  // A week box opens that week's chart in a small window
  { id: 'd1-week', lesson: 'dank100',
    setup: async pg => { await d1View(pg, { open: true });
      await pg.evaluate(() => { const b = document.querySelector('#dank100View .is-open .cr-boxes [onclick]'); b.scrollIntoView({ block: 'center' }); b.click(); });
      await pg.waitForFunction(() => document.querySelector('.cr-preview .cr-preview-item'), null, { timeout: 30000 }); await wait(pg, 1500); },
    clip: { from: '.cr-preview', to: '.cr-preview', pad: 16, narrow: true },
    spots: { head: '.cr-preview .d100-pv-head', item: '.cr-preview .cr-preview-item', link: '.cr-preview .cr-preview-link', close: '.cr-preview .cr-preview-close' } },
  { id: 'd1-no1', lesson: 'dank100',
    setup: async pg => { await d1View(pg); },
    clip: { from: '#dank100View .d100-no1', to: '#dank100View .d100-no1', pad: 12 },
    spots: { head: '#dank100View .d100-no1-head', sum: '#dank100View .d100-no1-sum', strip: '#dank100View .d100-no1-strip',
      row: '#dank100View .d100-no1-row', back: '#dank100View .d100-no1-back', more: '#dank100View .d100-no1-more' } },
  { id: 'd1-recs', lesson: 'dank100',
    setup: async pg => { await d1View(pg); },
    clip: { from: '#dank100View .d100-recs', to: '#dank100View .d100-recs', pad: 12, maxH: 820 },
    spots: { grid: '#dank100View .d100-rec-grid', rec: '#dank100View .d100-rec', k: '#dank100View .d100-rec-k', v: '#dank100View .d100-rec-v',
      who: '#dank100View .d100-rec-who' } },
  // Your entry, as a signed-in listener with their own library sees it (Send buttons)
  { id: 'd1-entry', lesson: 'dank100',
    setup: async pg => { await d1View(pg);
      await pg.evaluate(() => {
        window._gdSheet = localStorage.getItem('dc_sheet_id') || '';
        localStorage.removeItem('dc_sheet_id');
        _currentUser = { uid: 'guide-shot' };
        dcDank100.rerender();
      });
      await wait(pg, 1500); },
    clip: { from: '#dank100View .d100-soon', to: '#dank100View .d100-how', pad: 12 },
    spots: { soon: '#dank100View .d100-soon', entries: '#dank100View .d100-entries', last: '#dank100View .d100-entry-last',
      note: '#dank100View .d100-entry-note', preview: '#dank100View .d100-preview', send: '#dank100View .d100-entry-last .d100-actions .dc-btn-main',
      year: '#dank100View .d100-year', yearbtn: '#dank100View .d100-year .dc-btn', auto: '#dank100View .d100-auto-line',
      how: '#dank100View .d100-how' } },

  /* ── Lesson: Ratings (GUIDE-PLAN.md step 9) ─────────────────────────
     With the scores rtSeed gives the demo library. */
  { id: 'rt-page', lesson: 'ratings', phone: true,
    setup: async pg => { await rtView(pg); },
    clip: { from: '#ratingsView .rp-header', to: '#ratingsPageBody .rp-duo', pad: 14, maxH: 1750, box: '#ratingsView' },
    spots: { intro: '#ratingsView .rp-intro', ring: '#ratingsPageBody .rp-hero .rt-ring', verdict: '#ratingsPageBody .rp-hero .ar-verdict',
      meters: '#ratingsPageBody .rp-hero .ar-meters', acts: '#ratingsPageBody .rp-acts', next: '#ratingsPageBody .ar-next',
      cta: '#ratingsPageBody .ar-next-cta', hi: '#ratingsPageBody .rp-hi', dots: '#ratingsPageBody .rp-hi-foot',
      recs: '#ratingsPageBody .rt-rec-grid', rec: '#ratingsPageBody .rt-rec-card',
      top: '#ratingsPageBody .rp-duo .rp-col:first-child', recent: '#ratingsPageBody .rp-duo .rp-col:last-child' } },
  { id: 'rt-list', lesson: 'ratings',
    setup: async pg => { await rtView(pg); },
    clip: { from: '#ratingsPageBody .ar-body', to: '#ratingsPageBody .ar-body', pad: 12, maxH: 1000, box: '#ratingsView' },
    spots: { tabs: '#ratingsPageBody .ar-tabs', spread: '#ratingsPageBody .ar-dist-cols', bar: '#ratingsPageBody .ar-dist-bar',
      search: '#ratingsPageBody .am-search', sort: '#ratingsPageBody .am-sort', row: '#ratingsPageBody .ar-list > *',
      score: '#ratingsPageBody .ar-list .ar-score', prog: '#ratingsPageBody .ar-list .ar-prog', band: '#ratingsPageBody .ar-list .ar-band',
      go: '#ratingsPageBody .ar-list .ar-go' } },
  { id: 'rt-todo', lesson: 'ratings',
    setup: async pg => { await rtView(pg, 'todo'); },
    clip: { from: '#ratingsPageBody .ar-body', to: '#ratingsPageBody .ar-body', pad: 12, maxH: 760, box: '#ratingsView' },
    spots: { tabs: '#ratingsPageBody .ar-tabs', row: '#ratingsPageBody .ar-list > *', cta: '#ratingsPageBody .ar-list .ar-cta' } },
  { id: 'rt-album', lesson: 'ratings',
    setup: async pg => { await rtEditor(pg); },
    clip: { from: '#ratingModal .dc-modal', to: '#ratingModal .dc-modal', pad: 10, narrow: true },
    spots: { kind: '#ratingModal .rt-edit-kind', title: '#ratingModal .rt-edit-title', ring: '#rtEditTotal', formula: '#rtFormula',
      tabs: '#ratingModal .rt-tabs', row: '#ratingModal .rt-edit-row', slider: '#ratingModal .rt-edit-row .rt-slider',
      num: '#ratingModal .rt-edit-row .rt-num', weight: '#ratingModal .rt-weight-row', note: '#ratingModal .rt-note-wrap',
      clear: '#ratingModal .dc-frame-foot-start', done: '#ratingModal .dc-frame-foot .dc-btn-main', close: '#ratingModal .dc-modal-close' } },
  { id: 'rt-tracks', lesson: 'ratings',
    setup: async pg => { await rtEditor(pg, { tab: 'tracks' }); },
    clip: { from: '#ratingModal .dc-modal', to: '#ratingModal .dc-modal', pad: 10, narrow: true },
    spots: { tab: { js: "document.querySelectorAll('#ratingModal .rt-tab')[1]" }, formula: '#rtFormula',
      row: { js: "document.querySelectorAll('#ratingModal .rt-track-row')[1]" }, slider: { js: "document.querySelectorAll('#ratingModal .rt-slider--track')[1]" },
      num: { js: "document.querySelectorAll('#ratingModal .rt-num--track')[1]" }, rubric: { js: "document.querySelectorAll('#ratingModal .rt-track-detail')[1]" },
      full: '#ratingModal .rt-track-row .rt-track-meta' } },
  { id: 'rt-song', lesson: 'ratings',
    setup: async pg => { await rtEditor(pg, { song: 'detailed' }); },
    clip: { from: '#ratingModal .dc-modal', to: '#ratingModal .dc-modal', pad: 10, narrow: true },
    spots: { back: '#ratingModal .rt-back', ring: '#rtEditTotal', mode: '#ratingModal .rt-mode-switch', row: '#ratingModal .rt-edit-row',
      na: '#ratingModal .rt-na-btn', note: '#ratingModal .rt-note-wrap', clear: '#ratingModal .dc-frame-foot-start' } },
  { id: 'rt-quick', lesson: 'ratings',
    setup: async pg => { await rtEditor(pg, { song: 'quick' }); },
    clip: { from: '#ratingModal .dc-modal', to: '#ratingModal .dc-modal', pad: 10, narrow: true },
    spots: { mode: '#ratingModal .rt-mode-switch', quick: '#ratingModal .rt-quick-wrap', ring: '#rtEditTotal' } },
  // Where else a score lives: the album window's Rate button and Rating tab
  { id: 'rt-albwin', lesson: 'ratings',
    setup: async pg => { await rtView(pg); const k = await rtAlbumKey(pg); await win(pg, 'album', k, 'rating', { full: false }); },
    clip: { from: WBOX('album'), to: WBOX('album'), pad: 10, narrow: true },
    spots: { rate: W('album') + ' .dp-actions [data-dp-act="rate"]', tab: '#dpTab-album-rating', ring: W('album') + ' .rt-ring' } },
  { id: 'rt-artwin', lesson: 'ratings',
    setup: async pg => { await rtView(pg); await win(pg, 'artist', 'Taylor Swift', 'rating', { full: false }); },
    clip: { from: WBOX('artist'), to: WBOX('artist'), pad: 10, narrow: true },
    spots: { tab: '#dpTab-artist-rating', ring: W('artist') + ' .rt-ring' } },

  /* ── Lesson: Events (GUIDE-PLAN.md step 9) ──────────────────────────
     Birthdays, releases and shows of the demo library's top 50 artists,
     on the day the pictures are taken. */
  { id: 'ev-today', lesson: 'events', phone: true,
    setup: async pg => { await evView(pg); },
    clip: { from: '#eventsView .events-header', to: '#timeMachineSection', pad: 14, maxH: 1750 },
    spots: { title: '#eventsView .events-header h2', info: '#eventsInfoBtn', refresh: '#eventsRefreshBtn', tabs: '#eventsView .events-tabs',
      types: '#eventsView .events-type-filters', bday: '#eventsView [data-etype="birthday"]', shows: '#showsFilterBtn',
      play: '#eventsPlayBtn', pl: '#eventsPlBtn', day: '#eventsTodayTitle', card: '#eventsTodayBody .ev-carousel-card',
      anniv: { js: "[...document.querySelectorAll('#eventsTodayBody .ev-today-sub')].pop()" },
      tm: '#timeMachineSection', tmtypes: '#timeMachineSection .tm-toggle-btns', tmpl: '#tmPlBtn', tmcard: '#tmTickerTrack .tm-card' } },
  // What a card opens
  { id: 'ev-menu', lesson: 'events',
    setup: async pg => { await evView(pg);
      await pg.evaluate(() => {
        const c = document.querySelector('#tmTickerTrack .tm-card');
        window.scrollTo(0, document.getElementById('timeMachineSection').getBoundingClientRect().top + scrollY - 700);
        c.click();
      });
      await pg.waitForFunction(() => document.querySelector('.tm-action-menu'), null, { timeout: 20000 }); await wait(pg, 1200); },
    clip: { from: '#timeMachineSection', to: '.tm-action-menu', pad: 12 },
    spots: { menu: '.tm-action-menu', card: '#tmTickerTrack .tm-card', tm: '#timeMachineSection .tm-toggle-btns' } },
  { id: 'ev-coming', lesson: 'events',
    setup: async pg => { await evView(pg, 'coming'); },
    clip: { from: '#eventsView .events-header', to: '#eventsComingSection', pad: 14 },
    spots: { tab: '#eventsView .events-tabs [data-ev-tab="coming"]', views: '#eventsViewBtns', week: '#evComingWeek', soon: '#evComingSoon',
      later: '#evComingLater', card: '#evComingWeekGrid .ev-carousel-card', when: '#evComingWeekGrid .ev-carousel-date',
      more: '#eventsComingSection .ev-today-more', note: '#evComingShowsNote' } },
  { id: 'ev-table', lesson: 'events',
    setup: async pg => { await evView(pg, 'coming', { view: 'table' }); },
    clip: { from: '#eventsView .events-toolbar', to: '#evComingWeek', pad: 14, maxH: 900 },
    spots: { views: '#eventsViewBtns', table: '#evComingWeekGrid table', th: '#evComingWeekGrid th' } },
  { id: 'ev-recent', lesson: 'events',
    setup: async pg => { await evView(pg, 'recent'); },
    clip: { from: '#eventsView .events-toolbar', to: '#nmfSection', pad: 14 },
    spots: { tab: '#eventsView .events-tabs [data-ev-tab="recent"]', past: '#evRecentWeek', weeks: '#evRecentSoon', earlier: '#evRecentEarlier',
      nmf: '#nmfSection', fridays: '#nmfPastBtn', more: '#eventsRecentListSection .ev-today-more' } },
  { id: 'ev-cal', lesson: 'events', phone: true,
    setup: async pg => { await evView(pg, 'calendar'); },
    clip: { from: '#eventsView .events-toolbar', to: '#eventsView .events-calendar-wrap', pad: 14 },
    spots: { tab: '#eventsView .events-tabs [data-ev-tab="calendar"]', prev: '#eventsView .events-calendar-header .cal-nav-btn',
      next: '#eventsCalendarTitle ~ .cal-nav-btn',
      title: '#eventsCalendarTitle', views: '#eventsView .cal-view-btns', today: '#eventsCalendarGrid .cal-today',
      num: '#eventsCalendarGrid .cal-today .cal-cell-num', ev: '#eventsCalendarGrid .cal-today .cal-ev',
      more: '#eventsCalendarGrid .cal-today .cal-ev-more' } },
  { id: 'ev-week', lesson: 'events',
    setup: async pg => { await evView(pg, 'calendar', { cal: 'week' }); },
    clip: { from: '#eventsView .events-calendar-wrap', to: '#eventsView .events-calendar-wrap', pad: 12, maxH: 1000 },
    spots: { views: '#eventsView .cal-view-btns', title: '#eventsCalendarTitle', today: '#eventsCalendarGrid .cal-today' } },
  { id: 'ev-day', lesson: 'events',
    setup: async pg => { await evView(pg, 'calendar', { cal: 'day' }); },
    clip: { from: '#eventsView .events-calendar-wrap', to: '#eventsView .events-calendar-wrap', pad: 12, maxH: 1000 },
    spots: { views: '#eventsView .cal-view-btns', title: '#eventsCalendarTitle', card: '#eventsCalendarGrid .ev-carousel-card',
      anniv: { js: "[...document.querySelectorAll('#eventsCalendarGrid .ev-today-sub')].pop()" } } },
  // ⓘ: what the lists hold and when they were fetched
  { id: 'ev-info', lesson: 'events',
    setup: async pg => { await evView(pg); await pg.evaluate(() => toggleEventsStatus()); await wait(pg, 800); },
    clip: { from: '#eventsView .events-header', to: '#eventsView .events-toolbar', pad: 14 },
    spots: { info: '#eventsInfoBtn', status: '#eventsStatus', refresh: '#eventsRefreshBtn' } },

  /* ── Lesson: Playlists (GUIDE-PLAN.md step 10) ──────────────────────
     Three made-up playlists; automatic playlists as when signed in. */
  { id: 'pl-top', lesson: 'playlists', phone: true,
    setup: async pg => { await plView(pg); },
    clip: { from: '#dcPlMain .dc-pl-page-header', to: '#apSetup', pad: 14, maxH: 1750 },
    spots: { title: '#dcPlMain .dc-pl-page-header', total: '#dcPlMain .plx-total', search: '#dcPlMain .plx-search', sort: '#dcPlMain .plx-sort',
      new: '#dcPlMain .plx-new', name: '#dcPlNewName', card: '#dcPlMain .plx-card', cover: '#dcPlMain .plx-cover',
      meta: '#dcPlMain .plx-card-meta', ap: '#apSetup', tile: '#apSetup .ap-tile.ap-row-on', sw: '#apSetup .ap-tile.ap-row-on .src-switch',
      size: '#apSetup .ap-tile.ap-row-on .ap-size' } },
  { id: 'pl-open', lesson: 'playlists', phone: true,
    setup: async pg => { await plView(pg, { open: 'Late night drive' }); },
    clip: { from: '#dcPlMain .plx-back', to: { js: "document.querySelectorAll('#dcPlMain .plx-track')[5]" }, pad: 14 },
    spots: { back: '#dcPlMain .plx-back', hero: '#dcPlMain .plx-hero', cover: '#dcPlMain .plx-hero-cover', name: '#dcPlMain .plx-hero-name',
      meta: '#dcPlMain .plx-hero-meta', play: '#dcPlMain .plx-play', shuffle: '#dcPlMain .plx-shuffle',
      export: '#dcPlMain [onclick*="dcPlExportMenu"]', rename: '#dcPlMain [onclick*="dcPlStartRename"]', del: '#dcPlMain [onclick*="dcPlDeleteFromView"]',
      track: '#dcPlMain .plx-track', drag: '#dcPlMain .dc-pl-drag-handle', acts: '#dcPlMain .dc-pl-track-actions',
      remove: '#dcPlMain [onclick*="dcPlRemoveTrack"]' } },
  { id: 'pl-export', lesson: 'playlists',
    setup: async pg => { await plView(pg, { open: 'Late night drive' });
      await pg.evaluate(() => document.querySelector('#dcPlMain [onclick*="dcPlExportMenu"]').click());
      await pg.waitForFunction(() => document.querySelector('.dc-pl-export-menu'), null, { timeout: 10000 }); await wait(pg, 800); },
    clip: { from: '#dcPlMain .plx-hero', to: '.dc-pl-export-menu', pad: 14 },
    spots: { menu: '.dc-pl-export-menu', item: '.dc-pl-export-menu .dc-pl-export-item', btn: '#dcPlMain [onclick*="dcPlExportMenu"]' } },
  // Adding to a playlist from anywhere: the picker (here for an album)
  { id: 'pl-pick', lesson: 'playlists',
    setup: async pg => { await plView(pg);
      await pg.evaluate(() => {
        const a = allPlays.find(p => p.album === 'The Life of a Showgirl') || allPlays[0];
        dcOpenPlaylistPicker(dcPlTracksFor('album', a.album, albumArtist(a), a.album), a.album, a.album);
      });
      await wait(pg, 1500); },
    clip: { from: '#dcPlPickModal .dc-modal', to: '#dcPlPickModal .dc-modal', pad: 10, narrow: true },
    spots: { sub: '#dcPlPickSub', list: '#dcPlPickModal .dc-plpick-list', item: '#dcPlPickModal .dc-plpick-list > *',
      new: '#dcPlPickModal .dc-plpick-new', text: '#dcPlPickModal .dc-plpick-text' } },
  { id: 'pl-rel', lesson: 'playlists',
    setup: async pg => { await plView(pg);
      await pg.waitForFunction(() => document.querySelector('#anniversariesGrid > *'), null, { timeout: 480000 }); await wait(pg, 2500); },
    clip: { from: '#anniversariesSection', to: '#eventsRecentSection', pad: 14, maxH: 1300 },
    spots: { anniv: '#anniversariesSection .dc-pl-part-head', annpl: '#anniversariesPlBtn', card: '#anniversariesGrid > *',
      recent: '#eventsRecentSection .dc-pl-part-head', recpl: '#eventsRecentPlBtn' } },

  /* ── Lesson: Board (GUIDE-PLAN.md step 10) ──────────────────────────
     Made-up posts only (dcBoard._sample). */
  { id: 'bd-top', lesson: 'board', phone: true,
    setup: async pg => { await bdView(pg); },
    clip: { from: '#boardView .bd-page-header', to: '#boardView .bd-list', pad: 14, maxH: 1750 },
    spots: { title: '#boardView .bd-page-header', signin: '#boardView .bd-signin', chips: '#boardView .bd-chips',
      chip: { js: "document.querySelectorAll('#boardView .bd-chip')[1]" }, search: '#boardView .bd-search', status: '#boardView .bd-select',
      sort: '#boardView .bd-seg', newbtn: '#boardView .bd-new-btn', pinned: '#boardView .bd-post.pinned',
      post: { js: "document.querySelectorAll('#boardView .bd-post')[1]" }, vote: { js: "document.querySelectorAll('#boardView .bd-vote')[1]" },
      cat: { js: "document.querySelectorAll('#boardView .bd-post')[1].querySelector('.bd-tag-cat')" },
      st: { js: "document.querySelectorAll('#boardView .bd-post')[1].querySelector('.bd-status')" },
      meta: { js: "document.querySelectorAll('#boardView .bd-post')[1].querySelector('.bd-meta')" } } },
  { id: 'bd-post', lesson: 'board',
    setup: async pg => { await bdView(pg, { open: 'season' }); },
    clip: { from: '#boardView .bd-post.open', to: '#boardView .bd-post.open', pad: 14 },
    spots: { title: '#boardView .bd-post.open .bd-post-title', body: '#boardView .bd-post.open .bd-post-body', actions: '#boardView .bd-post.open .bd-actions',
      replies: '#boardView .bd-post.open .bd-reply-list', reply: '#boardView .bd-post.open .bd-reply',
      form: '#boardView .bd-post.open .bd-reply-form, #boardView .bd-post.open .bd-signin-sm', vote: '#boardView .bd-post.open .bd-vote' } },
  { id: 'bd-new', lesson: 'board',
    setup: async pg => { await bdView(pg, { compose: true }); },
    clip: { from: '#boardView .bd-composer', to: '#boardView .bd-composer', pad: 14 },
    spots: { cats: '#boardView .bd-cat-pick', title: '#bdNewTitle', body: '#boardView .bd-composer .bd-textarea',
      foot: '#boardView .bd-composer-foot' } },

  /* ── Lesson: Settings & account (GUIDE-PLAN.md step 11) ──────────────
     The Settings window's four tabs, the top bar's controls, and the
     account menu and Notifications as a made-up signed-in listener. */
  { id: 'set-bar', lesson: 'settings', phone: true,
    setup: async pg => { await setView(pg, 'source'); await pg.evaluate(() => closeSourceModal()); await wait(pg, 600); },
    clip: { from: '#tbSearchBtn', to: '.tb-signin-btn', pad: 10, narrow: true },
    spots: { search: '#tbSearchBtn', news: '#clNewBtn', sync: '#syncNowBtn', settings: '#configureSourceBtn', theme: '#themeGroupBtn',
      lang: '#langGroupBtn', signin: '.tb-signin-btn' } },
  { id: 'set-source', lesson: 'settings', phone: true,
    setup: async pg => { await setView(pg, 'source'); },
    clip: { from: '#sourceModal .dc-modal', to: '#sourceModal .dc-modal', pad: 10, narrow: true },
    spots: { search: '#setSearch', tabs: '#sourceModal .set-tabs, #setTabSource', cards: { js: "document.getElementById('srcCardSheets').parentElement" },
      sheets: '#srcCardSheets', lastfm: '#srcCardLastfm', file: '#srcCardFile', url: '#srcSheetId', tab: '#srcSheetTab',
      auto: { js: "document.getElementById('srcSheetWriteUrl').closest('details')" }, account: '#lfmAccountSection', connect: '#lfmConnectBtn',
      close: '#sourceModal .set-close' } },
  { id: 'set-lastfm', lesson: 'settings',
    setup: async pg => { await setView(pg, 'source', { card: 'srcCardLastfm' }); },
    clip: { from: '#sourceModal .dc-modal', to: '#sourceModal .dc-modal', pad: 10, narrow: true },
    spots: { card: '#srcCardLastfm', user: '#srcLastfmUser', fields: '#srcLastfmFields', save: '#sourceModal .set-save', dirty: '#sourceModal .set-dirty-note' } },
  { id: 'set-file', lesson: 'settings',
    setup: async pg => { await setView(pg, 'source', { card: 'srcCardFile' }); },
    clip: { from: '#sourceModal .dc-modal', to: '#sourceModal .dc-modal', pad: 10, narrow: true },
    spots: { card: '#srcCardFile', drop: '#srcFileDrop', fields: '#srcFileFields' } },
  { id: 'set-charts', lesson: 'settings',
    setup: async pg => { await setView(pg, 'charts'); },
    clip: { from: '#sourceModal .dc-modal', to: '#sourceModal .dc-modal', pad: 10, narrow: true },
    spots: { tab: '#setTabCharts', week: '#daySwitcher', svc: '#musicSvcSwitcher',
      sections: { js: "document.getElementById('setCpTimeMachine').closest('.set-switch-row, label')" },
      stats: { js: "document.getElementById('setCpPeriodStats').closest('.set-switch-row, label')" },
      events: '#eventsArtistLimitSelect', d100: { js: "document.getElementById('setD100Auto').closest('.set-switch-row, label')" },
      anim: { js: "document.getElementById('srcChartAnim').closest('.set-switch-row, label')" },
      split: { js: "document.getElementById('srcNoArtistSplit').closest('.set-switch-row, label')" },
      credit: { js: "document.getElementById('srcAwardsCreditFeatures').closest('.set-switch-row, label')" } } },
  { id: 'set-releases', lesson: 'settings',
    setup: async pg => { await setView(pg, 'releases'); },
    clip: { from: '#sourceModal .dc-modal', to: '#sourceModal .dc-modal', pad: 10, narrow: true },
    spots: { tab: '#setTabReleases', detect: { js: "document.getElementById('rtAutodetectOn').closest('.set-switch-row, label')" },
      album: '#certAlbumGold', song: '#certSongGold', single: '#certColSingle', ep: '#certColEp',
      reset: '#setPanelReleases .cert-reset-btn', rollup: '#rollupHint' } },
  { id: 'set-profile', lesson: 'settings',
    setup: async pg => { await setView(pg, 'profile'); },
    clip: { from: '#sourceModal .dc-modal', to: '#sourceModal .dc-modal', pad: 10, narrow: true },
    spots: { tab: '#setTabProfile', name: '#srcDisplayName', tz: '#srcTimezone', themes: '#setPanelProfile .set-theme-grid',
      theme: '#setPanelProfile .set-theme-swatch.active', lang: '#setPanelProfile .set-lang-seg', backups: '#setPanelProfile .set-backups',
      dl: '#setPanelProfile [onclick*="backupsDownload"]', restore: '#setPanelProfile [onclick*="backupsFileInput"]' } },
  { id: 'set-search', lesson: 'settings',
    setup: async pg => { await setView(pg, 'source');
      await pg.locator('#setSearch').pressSequentially(await pg.evaluate(() => ({ en: 'week', es: 'semana', 'pt-BR': 'semana', 'pt-PT': 'semana' })[currentLang] || 'week'), { delay: 40 });
      await wait(pg, 1200); },
    clip: { from: '#sourceModal .dc-modal', to: '#setSearchResults', pad: 10, narrow: true },
    spots: { search: '#setSearch', results: '#setSearchResults', result: '#setSearchResults > *' } },
  { id: 'set-theme', lesson: 'settings',
    setup: async pg => { await setView(pg, 'source'); await tbMenu(pg, 'themeCtrlGroup'); },
    clip: { from: '#themeCtrlGroup', to: '#themeCtrlGroup .ctrl-group-panel', pad: 12, narrow: true },
    spots: { btn: '#themeGroupBtn', panel: '#themeCtrlGroup .ctrl-group-panel', on: '#themeCtrlGroup .theme-btn.active' } },
  { id: 'set-lang', lesson: 'settings',
    setup: async pg => { await setView(pg, 'source'); await tbMenu(pg, 'langCtrlGroup'); },
    clip: { from: '#langCtrlGroup', to: '#langCtrlGroup .ctrl-group-panel', pad: 12, narrow: true },
    spots: { btn: '#langGroupBtn', panel: '#langSwitcher', on: '#langSwitcher .lang-btn.active' } },
  { id: 'set-acct', lesson: 'settings',
    setup: async pg => { await setView(pg, 'source'); await acctFake(pg); await tbMenu(pg, 'acctCtrlGroup'); },
    clip: { from: '#acctCtrlGroup', to: '#acctCtrlGroup .ctrl-group-panel', pad: 12, narrow: true },
    spots: { btn: '#acctGroupBtn', dot: '#ntDot', name: '#acctCtrlGroup .dc-user-name', nt: '#acctCtrlGroup .tb-acct-nt',
      out: { js: "[...document.querySelectorAll('#acctCtrlGroup .tb-acct-signout')].pop()" } } },
  { id: 'set-nt', lesson: 'settings',
    setup: async pg => { await setView(pg, 'source'); await pg.evaluate(() => closeSourceModal()); await acctFake(pg);
      await pg.evaluate(() => ntOpen()); await wait(pg, 1500); },
    clip: { from: '#ntModal .dc-modal', to: '#ntModal .dc-modal', pad: 10, narrow: true },
    spots: { tabs: '#ntModal .nt-tabs', group: '#ntModal .nt-group-h', row: '#ntModal .nt-item.nt-unread', tile: '#ntModal .nt-tile',
      cat: '#ntModal .nt-cat', dismiss: '#ntModal .nt-dismiss', foot: '#ntFoot', close: '#ntModal .dc-modal-close' } },

  /* ── Lesson: Raw Data (GUIDE-PLAN.md step 10) ───────────────────────
     Last: its correction rules rewrite a couple of demo plays for the rest of
     the run. */
  { id: 'rd-top', lesson: 'rawdata', phone: true,
    setup: async pg => { await rdView(pg); },
    clip: { from: '#rawDataView .raw-header', to: { js: "document.querySelectorAll('#rawBody tr')[9]" }, pad: 14 },
    spots: { title: '#rawDataView .raw-header', song: '#rawFilterSong', artist: '#rawFilterArtist', album: '#rawFilterAlbum', date: '#rawFilterDate',
      summary: '#rawSummary', corr: '#rawDataView .raw-corrected-toggle', rules: '#manageRulesBtn',
      pager: '#rawPagerTop .raw-pager-nav', size: '#rawPagerTop .raw-pager-size', th: '#rawDataView .raw-th.sort-active',
      row: '#rawBody tr', edit: '#rawBody .raw-edit-btn' } },
  { id: 'rd-corr', lesson: 'rawdata',
    setup: async pg => { await rdView(pg, { corrected: true }); },
    clip: { from: '#rawDataView .raw-bar', to: { js: "[...document.querySelectorAll('#rawBody tr')].slice(0, 6).pop()" }, pad: 14 },
    spots: { corr: '#rawDataView .raw-corrected-toggle', row: '#rawBody tr.raw-corrected', badge: '#rawBody .raw-corrected-badge' } },
  { id: 'rd-edit', lesson: 'rawdata',
    setup: async pg => { await rdView(pg); await pg.evaluate(() => openEditScrobbleModal(2)); await wait(pg, 1200); },
    clip: { from: '#editScrobbleModal .dc-modal', to: '#editScrobbleModal .dc-modal', pad: 10, narrow: true },
    spots: { artist: '#editScrobbleArtist', track: '#editScrobbleTrack', album: '#editScrobbleAlbum', time: '#editScrobbleTime',
      now: '#editScrobbleModal [onclick*="setEditScrobbleNow"]', all: { js: "document.getElementById('editApplyAll').closest('label')" },
      rule: { js: "document.getElementById('editSaveRule').closest('label')" }, save: '#editSaveLocalBtn',
      cancel: '#editScrobbleModal .dc-btn[onclick*="closeEditScrobbleModal"]:not(.dc-modal-close)' } },
  { id: 'rd-rules', lesson: 'rawdata',
    setup: async pg => { await rdView(pg); await pg.evaluate(() => openRulesModal()); await wait(pg, 1200); },
    clip: { from: '#rulesModal .dc-modal', to: '#rulesModal .dc-modal', pad: 10, narrow: true },
    spots: { count: '#rulesCount', search: '#rulesSearch', list: '#rulesList', rule: '#rulesList > *',
      export: '#rulesModal [onclick*="exportRules"]', import: '#rulesModal [onclick*="importRules"]' } }
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
      let app = await openApp(b, lang, phone), lastLesson = list[0].lesson;
      for (const s of list) {
        const id = s.id + (phone ? '-m' : '');
        // A fresh page per lesson: a window one lesson leaves open (the cover picker,
        // the streaks window…) would otherwise darken every picture of the next one
        if (s.lesson !== lastLesson) { lastLesson = s.lesson; await app.ctx.close(); app = await openApp(b, lang, phone); }
        // Two tries: a slow page load is the usual reason a shot fails
        for (let attempt = 1; attempt <= 2; attempt++) try {
          // A fresh start per shot keeps one shot's open menu out of the next
          await app.pg.evaluate(() => { window.scrollTo(0, 0); document.querySelectorAll('.kebab-menu-wrap.open').forEach(e => e.classList.remove('open'));
            // The Day recap story pauses while the mouse is over it, so it never closes by
            // itself; it and the Daily calendar would dim every picture after them
            if (typeof dyCloseRecap === 'function') dyCloseRecap();
            if (typeof dyCloseCalendar === 'function') dyCloseCalendar(); });
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
