/* ═══════════════════════════════════════════════════════════════════
   CHARTS GUIDE — the engine (GUIDE-PLAN.md)

   The Charts Guide tab is a set of lessons, one per part of the app.
   Each lesson has:
     · Know your screen — real screenshots with numbered spots. Picking a
       spot zooms the picture onto it and dims the rest (the "camera").
     · How to… — step-by-step slideshows, played in a full-window player.
     · Every option — the full reference, each item with a small crop of
       the picture showing exactly that control.
     · Try it yourself — challenges done in the real app. This file
       watches the app's own functions and clicks, so a challenge is
       noticed wherever it is done, and a toast says so.
     · Quick check — three questions.

   This file is loaded on every page (it is small) so challenges can be
   noticed anywhere. The lessons and their words (guide-lessons.js and
   guide-lessons.<lang>.js) and the picture measurements
   (guide/<lang>/shots.json) load only when the guide opens.

   The old guide (dcRenderChartsGuideView in app.js) is kept whole as the
   hub's Reference tab until GUIDE-PLAN.md step 12 moves its content.

   Progress is kept in localStorage (dc_guide_progress):
     { ch: { id: time }, quiz: { lesson: { q: true } }, seen: { lesson: time },
       last: lessonId, mastered: { lesson: time } }
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Bump when the lesson files or the pictures change (it's their ?v=)
  const GUIDE_V = '11';
  const STORE = 'dc_guide_progress';
  const LANG_FILES = ['es', 'pt-BR', 'pt-PT'];

  /* ── Progress ─────────────────────────────────────────────────── */
  function loadP() {
    let p = null;
    try { p = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) {}
    p = p && typeof p === 'object' ? p : {};
    p.ch = p.ch || {}; p.quiz = p.quiz || {}; p.seen = p.seen || {}; p.mastered = p.mastered || {};
    return p;
  }
  const P = loadP();
  function saveP() { try { localStorage.setItem(STORE, JSON.stringify(P)); } catch (e) {} }

  /* ── Small helpers ────────────────────────────────────────────── */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const h = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // {{name}} is a value passed in; {{t:key}} is the app's own word for something
  // in the current language (translations*.js), so a badge or button is always
  // called exactly what the app shows. A leading emoji on the app's label is dropped.
  const appWord = k => {
    const w = typeof window.t === 'function' ? window.t(k) : '';
    return String(w && w !== k ? w : '').replace(/^\p{Extended_Pictographic}\uFE0F?\s*/u, '');
  };
  const fill = (s, v) => String(s || '')
    .replace(/\{\{t:(\w+)\}\}/g, (m, k) => appWord(k))
    .replace(/\{\{(\w+)\}\}/g, (m, k) => (v && v[k] != null ? v[k] : ''));
  const lang = () => (typeof currentLang !== 'undefined' && currentLang) || 'en';
  const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // The two icons of the Computer / Phone switch (not in the shared icon set)
  const ICO = {
    monitor: '<svg class="gd-ico" viewBox="0 0 16 16" aria-hidden="true"><rect x="1.8" y="2.6" width="12.4" height="8.4" rx="1.4"/><path d="M5.6 13.6h4.8M8 11v2.6"/></svg>',
    phone: '<svg class="gd-ico" viewBox="0 0 16 16" aria-hidden="true"><rect x="4.4" y="1.6" width="7.2" height="12.8" rx="1.6"/><path d="M7.2 12.2h1.6"/></svg>'
  };
  const ico = name => ICO[name] || '';

  /* ═══════════════════════════════════════════════════════════════
     CHALLENGE DETECTORS — always on
     Each challenge is noticed one of three ways:
       fn     the app calls one of its own functions (wrapped here)
       click  a click lands on a matching element
       key    a key is pressed
     `period` limits it to one chart window. Only actions that follow a
     real click or key press count, so the app setting itself up on load
     never completes anything.
     ═══════════════════════════════════════════════════════════════ */
  const GD_CHALLENGES = {
    'week.prev':    { lesson: 'week', period: 'week', click: '#prevBtn, #nextBtn', key: ['ArrowLeft', 'ArrowRight'] },
    'week.jump':    { lesson: 'week', period: 'week', click: '#periodLabel' },
    'week.type':    { lesson: 'week', fn: 'setChartTypeView', test: a => a[0] === 'artists' || a[0] === 'albums' },
    'week.layout':  { lesson: 'week', fn: 'setWeeklyChartView', test: a => a[0] && a[0] !== 'table' },
    'week.size':    { lesson: 'week', click: '.size-btns button' },
    'week.show':    { lesson: 'week', fn: 'toggleSectionDisplay' },
    'week.animate': { lesson: 'week', fn: 'replayChartAnimation' },
    'week.run':     { lesson: 'week', click: '.cr-toggle-btn' },
    // Daily (daily.js functions)
    'day.prev':     { lesson: 'daily', period: 'day', click: '#prevBtn, #nextBtn', key: ['ArrowLeft', 'ArrowRight'] },
    'day.cmp':      { lesson: 'daily', fn: 'dySetCompare', test: a => a[0] === 'weekday' },
    'day.recap':    { lesson: 'daily', fn: 'dyOpenRecap' },
    'day.cal':      { lesson: 'daily', fn: 'dyOpenCalendar' },
    'day.mood':     { lesson: 'daily', fn: 'dySetMood' },
    'day.hour':     { lesson: 'daily', fn: 'dyPickHour' },
    'day.tab':      { lesson: 'daily', fn: 'dyTabGo' },
    'day.save':     { lesson: 'daily', fn: 'dySavePlaylist' },
    // Monthly and Yearly
    'per.month':    { lesson: 'periods', click: '#periodNav button[data-period="month"]' },
    'per.year':     { lesson: 'periods', click: '#periodNav button[data-period="year"]' },
    'per.day':      { lesson: 'periods', click: '#statsHeroDays .sh-day', period: ['month', 'year'] },
    'per.new':      { lesson: 'periods', click: '.ne-chips button' },
    'per.cert':     { lesson: 'periods', click: '#certReelSection .creel-btn' },
    'per.search':   { lesson: 'periods', period: 'year', input: '#songsSearchInput, #artistsSearchInput, #albumsSearchInput' },
    // All-Time
    'at.size':      { lesson: 'alltime', period: 'alltime', click: '#atInsights [data-ati="size"], [id^="sizeBtns"][id$="AT"] button' },
    'at.fact':      { lesson: 'alltime', click: '#atInsights .ati-hero .ati-btn--ghost' },
    'at.stats':     { lesson: 'alltime', click: '#atInsights .ati-toggle' },
    'at.travel':    { lesson: 'alltime', period: 'alltime', click: '#prevBtn', key: ['ArrowLeft'], input: '#atPicker' },
    'at.search':    { lesson: 'alltime', period: 'alltime', input: '#songsSearchInput, #artistsSearchInput, #albumsSearchInput' },
    'at.export':    { lesson: 'alltime', period: 'alltime', click: '.chart-export-btn' },
    // Around the chart, share image, PDF, export, play
    'around.tab':    { lesson: 'around', click: '.atc-tab' },
    'around.legend': { lesson: 'around', click: '.atc-info' },
    'around.share':  { lesson: 'around', fn: 'openIgPreviewModal' },
    'around.design': { lesson: 'around', click: '#igPreviewModal .sh-tpl, #igPreviewModal .sh-swatch, #igFormatBtns button' },
    'around.pdf':    { lesson: 'around', fn: 'openPdfModal' },
    'around.export': { lesson: 'around', fn: 'openExportModal' },
    'around.copy':   { lesson: 'around', click: '#exportCopyBtn, #exportModal .export-name-chip' },
    'around.play':   { lesson: 'around', click: '.yt-playall-btn' },
    // Windows, search, menus, streaks
    // A window can open several ways (a link, a row, the search, another window),
    // so these watch the window itself: noticed when it opens after a click or key
    'win.song':      { lesson: 'windows', open: '#songModal' },
    'win.artist':    { lesson: 'windows', open: '#artistModal' },
    'win.album':     { lesson: 'windows', open: '#albumModal' },
    'win.tab':       { lesson: 'windows', click: '.dp-tab' },
    'win.search':    { lesson: 'windows', input: '.lsx-input' },
    'win.menu':      { lesson: 'windows', click: '.ea-more' },
    'win.cover':     { lesson: 'windows', fn: 'applyImgChoice' },
    'win.streak':    { lesson: 'windows', open: '#streakModal' },
    // Stats (stats.js functions; Graphs is period 'graphs')
    'stats.range':   { lesson: 'stats', period: 'graphs', click: '#graphRangePresets button', input: '#gRangeFrom, #gRangeTo' },
    'stats.story':   { lesson: 'stats', fn: 'setStatsTab', test: a => a[0] === 'story' },
    'stats.go':      { lesson: 'stats', click: '.sx-tile-go' },
    'stats.game':    { lesson: 'stats', fn: 'sxGameOpen' },
    'stats.add':     { lesson: 'stats', fn: 'sxCmpAddKey' },
    'stats.race':    { lesson: 'stats', click: '#sxCmpMode [data-cmode="race"]' },
    'stats.drill':   { lesson: 'stats', fn: 'sxShowVolDrill' },
    'stats.heat':    { lesson: 'stats', click: '#heatmapThemeBtns button, #heatmapCard .hm-step, #heatmapTypeBtns button, #heatmapCard .hm-strip > *' },
    // Records (app.js + records-look.js)
    'rec.view':      { lesson: 'records', click: '#recordsNav .records-nav-btn' },
    'rec.ent':       { lesson: 'records', click: '#recordsView .rec-ent-tab, #recordsView .rec-ov-type, #recordsView .mil-tab, #recordsView .fast-tab, #recordsView .nc-rec-tab' },
    'rec.per':       { lesson: 'records', click: '#recordsView .rec-per-tab, #recordsView .rec-ov-sw-btn' },
    'rec.consec':    { lesson: 'records', click: '#recordsView [data-rec-run="consec"]' },
    'rec.run':       { lesson: 'records', click: '#recordsView .rec-run-toggle-btn, #recordsView .rec-expand-all-btn' },
    'rec.search':    { lesson: 'records', input: '#recordsSearch' },
    'rec.ledger':    { lesson: 'records', click: '#recordsView .certw-open, #recCertsSection .rec-run-toggle-btn' },
    'rec.show':      { lesson: 'records', click: '#recordsSizeBtns button' },
    // Awards (app.js)
    'aw.config':     { lesson: 'awards', fn: 'awardsToggleConfig' },
    'aw.gen':        { lesson: 'awards', fn: 'awardsGenerateCandidates' },
    'aw.pick':       { lesson: 'awards', fn: 'awardsGenerateCatCandidates' },
    'aw.win':        { lesson: 'awards', fn: 'awardsPickWinner' },
    'aw.view':       { lesson: 'awards', fn: 'awardsSetView', test: a => a[0] && a[0] !== 'ballot' },
    'aw.cer':        { lesson: 'awards', fn: 'startAwardsCeremony' },
    'aw.reveal':     { lesson: 'awards', fn: 'ceremonyReveal' },
    'aw.real':       { lesson: 'awards', fn: 'awardsSubTab', test: a => a[0] === 'reallife' },
    // Your Soundtrack (app.js st* functions)
    'st.period':     { lesson: 'soundtrack', fn: 'stSetPeriod', test: a => a[0] === 'month' || a[0] === 'alltime' },
    'st.nav':        { lesson: 'soundtrack', fn: 'stNavigate' },
    'st.story':      { lesson: 'soundtrack', fn: 'stStoryOpen' },
    'st.stat':       { lesson: 'soundtrack', fn: 'stSetReelMode' },
    'st.no1':        { lesson: 'soundtrack', fn: 'stSetNo1Type', test: a => a[0] && a[0] !== 'songs' },
    // a bubble opens its pop-up after a short pop, so watch the window itself
    'st.bubble':     { lesson: 'soundtrack', open: '#stArtistModal' },
    'st.replay':     { lesson: 'soundtrack', fn: 'stStartReplay' },
    'st.card':       { lesson: 'soundtrack', fn: 'stOpenCard' }
  };
  // Where "Show me" takes you for each challenge, and what it rings there.
  // open/tab: open the chart's ⋮ menu on a tab first.
  const GD_SHOW = {
    'week.prev':    { nav: 'week', ring: '#prevBtn' },
    'week.jump':    { nav: 'week', ring: '#periodLabel' },
    'week.type':    { nav: 'week', ring: '.chart-type-seg' },
    'week.layout':  { nav: 'week', ring: '#chartLayoutBar' },
    'week.size':    { nav: 'week', menu: 'size', ring: '#songsSection .kebab-panel[data-panel="size"]' },
    'week.show':    { nav: 'week', menu: 'show', ring: '#songsSection .kebab-panel[data-panel="show"]' },
    'week.animate': { nav: 'week', ring: '.section-replay-btn' },
    'week.run':     { nav: 'week', ring: '.cr-toggle-btn' },
    'day.prev':     { nav: 'day', ring: '#prevBtn' },
    'day.cmp':      { nav: 'day', ring: '.dy-cmp' },
    'day.recap':    { nav: 'day', ring: '.dy-act-main' },
    'day.cal':      { nav: 'day', ring: '.dy-actions .dy-act:nth-child(4)' },
    'day.mood':     { nav: 'day', ring: '.dy-moods' },
    'day.hour':     { nav: 'day', ring: '.dy-hours' },
    'day.tab':      { nav: 'day', ring: '.dy-mem .dy-tab-row' },
    'day.save':     { nav: 'day', ring: '.dy-actions .dy-act:nth-child(5)' },
    'per.month':    { nav: 'week', ring: '#periodNav button[data-period="month"]' },
    'per.year':     { nav: 'week', ring: '#periodNav button[data-period="year"]' },
    'per.day':      { nav: 'month', ring: '#statsHeroDays' },
    'per.new':      { nav: 'month', ring: '#atcSongs' },
    'per.cert':     { nav: 'month', ring: '#certReelSection .creel-filter-btns' },
    'per.search':   { nav: 'year', ring: '#songsSearch' },
    'at.size':      { nav: 'alltime', ring: '#atInsights' },
    'at.fact':      { nav: 'alltime', ring: '#atInsights' },
    'at.stats':     { nav: 'alltime', ring: '#atInsights' },
    'at.travel':    { nav: 'alltime', ring: '#prevBtn' },
    'at.search':    { nav: 'alltime', ring: '#songsSearch' },
    'at.export':    { nav: 'alltime', ring: '#songsExportBar' },
    'around.tab':    { nav: 'week', ring: '#atcSongs .atc-tabs' },
    // the button only shows with ⋮ → Show → BU legend on, so point at that switch
    'around.legend': { nav: 'week', menu: 'show', ring: '#toggleBuLegendBtn' },
    'around.share':  { nav: 'week', menu: 'actions', ring: '#songsShareBtn' },
    'around.design': { nav: 'week', menu: 'actions', ring: '#songsShareBtn' },
    'around.pdf':    { nav: 'week', menu: 'actions', ring: '#songsPdfBtn' },
    'around.export': { nav: 'week', menu: 'actions', ring: '#exportPlaylistBtn' },
    'around.copy':   { nav: 'week', menu: 'actions', ring: '#exportPlaylistBtn' },
    'around.play':   { nav: 'week', menu: 'actions', ring: '#ytPlayAllRow' },
    'win.song':      { nav: 'week', ring: '#songsBody .song-title' },
    'win.artist':    { nav: 'week', ring: '#songsBody .song-artist' },
    'win.album':     { nav: 'week', ring: '#songsBody .song-album' },
    'win.tab':       { nav: 'week', ring: '#songsBody .song-title' },
    'win.search':    { nav: 'week', ring: '#topbar [class*="search"]' },
    'win.menu':      { nav: 'week', ring: '#songsBody .ea-more' },
    'win.cover':     { nav: 'week', ring: '#songsBody .thumb-cell' },
    'win.streak':    { nav: 'week', ring: '#nsDayStreak, #nsSummary' },
    // stab: the Stats tab to open first
    'stats.range':   { nav: 'graphs', ring: '#graphsControls' },
    'stats.story':   { nav: 'graphs', ring: '.stats-tabs [data-st-tab="story"]' },
    'stats.go':      { nav: 'graphs', stab: 'overview', ring: '#sxOverview .sx-tiles' },
    'stats.game':    { nav: 'graphs', stab: 'games', ring: '#sxGames .sx-daily, #sxGames .sx-game-card' },
    'stats.add':     { nav: 'graphs', stab: 'compare', ring: '#sxCmpAddCard' },
    'stats.race':    { nav: 'graphs', stab: 'compare', ring: '#sxCmpMode' },
    'stats.drill':   { nav: 'graphs', stab: 'charts', ring: '.sx-vol-card' },
    'stats.heat':    { nav: 'graphs', stab: 'charts', ring: '#heatmapCard .hm-bar' },
    // rview: the Records section to open first
    'rec.view':      { nav: 'records', ring: '#recordsNav, #recPicker' },
    'rec.ent':       { nav: 'records', rview: 'recAllOnesSection', ring: '#recAllOnesSection .rec-ent-tabs' },
    'rec.per':       { nav: 'records', rview: 'recAllOnesSection', ring: '#recAllOnesSection .rec-per-tabs' },
    'rec.consec':    { nav: 'records', rview: 'recAllOnesSection', ring: '#recAllOnesSection .rec-run-seg' },
    'rec.run':       { nav: 'records', rview: 'recAllOnesSection', ring: '#recAllOnesSection .rec-run-toggle-btn' },
    'rec.search':    { nav: 'records', ring: '#recordsSearchBar' },
    'rec.ledger':    { nav: 'records', rview: 'recCertsSection', ring: '#recCertsSection .certw-open' },
    'rec.show':      { nav: 'records', rview: 'recAllOnesSection', ring: '#recordsSizeBar' },
    'aw.config':     { nav: 'awards', ring: '#awardsConfigToggleBtn' },
    'aw.gen':        { nav: 'awards', ring: '#awardsGenerateBtn' },
    'aw.pick':       { nav: 'awards', ring: '#awardsCatList .awards-cat-action-btn' },
    'aw.win':        { nav: 'awards', ring: '#awardsCatList .awards-nominee-row, #awardsGenerateBtn' },
    'aw.view':       { nav: 'awards', ring: '#awardsViewBar .awards-view-pick' },
    'aw.cer':        { nav: 'awards', ring: '#awardsMyGrammys .awards-ceremony-launch-btn, #awardsGenerateBtn' },
    'aw.reveal':     { nav: 'awards', ring: '#awardsMyGrammys .awards-ceremony-launch-btn, #awardsGenerateBtn' },
    'aw.real':       { nav: 'awards', ring: '#awardsView .awards-subnav' },
    'st.period':     { nav: 'soundtrack', ring: '#stPeriodNav' },
    'st.nav':        { nav: 'soundtrack', ring: '#stNavBar' },
    'st.story':      { nav: 'soundtrack', ring: '#stStoryBtn' },
    'st.stat':       { nav: 'soundtrack', ring: '#stStatsStrip' },
    'st.no1':        { nav: 'soundtrack', ring: '#stNo1Section .st-no1-seg' },
    'st.bubble':     { nav: 'soundtrack', ring: '#stDiscoveriesBubbles' },
    'st.replay':     { nav: 'soundtrack', ring: '#stTopReplayBtn, #stReplayBtn' },
    'st.card':       { nav: 'soundtrack', ring: '#soundtrackView .st-controls [onclick*="stOpenCard"]' }
  };

  let lastInput = 0;
  const userActed = () => Date.now() - lastInput < 1500;
  const periodOk = c => !c.period || (typeof currentPeriod !== 'undefined' && [].concat(c.period).includes(currentPeriod));

  function noteChallenge(id) {
    if (P.ch[id]) return;
    P.ch[id] = Date.now();
    saveP();
    // Anything on screen that shows this challenge updates at once
    onProgress(GD_CHALLENGES[id] && GD_CHALLENGES[id].lesson, id);
  }

  document.addEventListener('pointerdown', () => { lastInput = Date.now(); }, true);
  document.addEventListener('keydown', e => {
    lastInput = Date.now();
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    for (const [id, c] of Object.entries(GD_CHALLENGES)) {
      if (c.key && c.key.includes(e.key) && periodOk(c)) setTimeout(() => noteChallenge(id), 0);
    }
  }, true);
  document.addEventListener('click', e => {
    if (!e.isTrusted) return;
    for (const [id, c] of Object.entries(GD_CHALLENGES)) {
      if (c.click && e.target.closest && e.target.closest(c.click) && periodOk(c)) noteChallenge(id);
    }
  }, true);

  document.addEventListener('input', e => {
    if (!e.isTrusted) return;
    for (const [id, c] of Object.entries(GD_CHALLENGES)) {
      if (c.input && e.target.closest && e.target.closest(c.input) && periodOk(c)) noteChallenge(id);
    }
  }, true);

  // open: a pop-up window gaining its "open" class soon after the user acted
  function watchOpens() {
    for (const [id, c] of Object.entries(GD_CHALLENGES)) {
      if (!c.open) continue;
      const el = document.querySelector(c.open);
      if (!el || el._gdWatch) continue;
      el._gdWatch = true;
      let was = el.classList.contains('open');
      new MutationObserver(() => {
        const now = el.classList.contains('open');
        // a window can open a moment after the click (it loads first): allow 4s
        if (now && !was && Date.now() - lastInput < 4000 && periodOk(c)) noteChallenge(id);
        was = now;
      }).observe(el, { attributes: true, attributeFilter: ['class'] });
    }
  }

  // Wrap the app's functions once they exist (app.js loads before this file)
  function wrapFns() {
    const byFn = {};
    for (const [id, c] of Object.entries(GD_CHALLENGES)) if (c.fn) (byFn[c.fn] = byFn[c.fn] || []).push(id);
    for (const [name, ids] of Object.entries(byFn)) {
      const orig = window[name];
      if (typeof orig !== 'function' || orig._gdWrapped) continue;
      const wrapped = function () {
        const r = orig.apply(this, arguments);
        if (userActed()) {
          const a = [...arguments];
          ids.forEach(id => { const c = GD_CHALLENGES[id]; if (periodOk(c) && (!c.test || c.test(a))) noteChallenge(id); });
        }
        return r;
      };
      wrapped._gdWrapped = true;
      window[name] = wrapped;
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     LOADING — lessons, translations and picture measurements
     ═══════════════════════════════════════════════════════════════ */
  const loaded = {};   // url → Promise
  function loadScript(src) {
    if (loaded[src]) return loaded[src];
    return (loaded[src] = new Promise(res => {
      const s = document.createElement('script');
      s.src = src; s.onload = () => res(true); s.onerror = () => res(false);
      document.head.appendChild(s);
    }));
  }
  const shots = {};    // lang → manifest
  function loadShots(l) {
    if (shots[l]) return Promise.resolve(shots[l]);
    return fetch('guide/' + l + '/shots.json?v=' + GUIDE_V).then(r => (r.ok ? r.json() : {})).catch(() => ({}))
      .then(m => (shots[l] = m || {}));
  }
  function ensure() {
    const l = lang();
    const jobs = [loadScript('guide-lessons.js?v=' + GUIDE_V), loadShots('en')];
    if (l !== 'en') {
      if (LANG_FILES.includes(l)) jobs.push(loadScript('guide-lessons.' + l + '.js?v=' + GUIDE_V));
      jobs.push(loadShots(l));
    }
    return Promise.all(jobs);
  }

  /* ── Text lookup: language first, English for anything missing ── */
  function T() {
    const all = window.GL_TEXT || {};
    return { L: all[lang()] || {}, E: all.en || {} };
  }
  // Walks a dotted path in the language's text, then in English
  function tx(path, vars) {
    const { L, E } = T();
    const get = o => path.split('.').reduce((a, k) => (a && a[k] != null ? a[k] : undefined), o);
    // Strings inside arrays ([title, text], quiz choices) get filled too
    const deep = x => (typeof x === 'string' ? fill(x, vars) : Array.isArray(x) ? x.map(deep) : x);
    const v = get(L);
    return deep(v !== undefined ? v : get(E));
  }
  const ui = (k, v) => tx('ui.' + k, v) || '';
  // A challenge's [title, how]. Its id has a dot in it ("week.prev"), so it
  // can't be part of a dotted tx() path
  function chText(lessonId, id) {
    const { L, E } = T();
    const pick = o => o && o.lessons && o.lessons[lessonId] && o.lessons[lessonId].challenges && o.lessons[lessonId].challenges[id];
    return (pick(L) || pick(E) || [id, '']).map(x => fill(x));
  }
  const lessonById = id => (window.GL && GL.lessons.find(x => x.id === id)) || null;

  // A shot's picture + measurements, in the user's language when it has one
  function shot(id, phone) {
    const key = id + (phone ? '-m' : '');
    const l = lang();
    const m = (shots[l] && shots[l][key]) ? { l, d: shots[l][key] } : (shots.en && shots.en[key] ? { l: 'en', d: shots.en[key] } : null);
    if (!m) return null;
    return { id: key, w: m.d.w, h: m.d.h, spots: m.d.spots || {}, src: 'guide/' + m.l + '/' + key + '.webp?v=' + GUIDE_V };
  }

  /* ── Lesson progress ──────────────────────────────────────────── */
  function lessonStats(ls) {
    if (!ls || ls.soon) return { done: 0, total: 0, pct: 0 };
    const ch = (ls.challenges || []).filter(id => P.ch[id]).length;
    const q = Object.keys(P.quiz[ls.id] || {}).filter(k => P.quiz[ls.id][k]).length;
    const total = (ls.challenges || []).length + (ls.quiz || []).length;
    const done = ch + Math.min(q, (ls.quiz || []).length);
    return { done, total, pct: total ? Math.round(done / total * 100) : 0 };
  }
  function overall() {
    const ready = GL.lessons.filter(x => !x.soon);
    const mastered = ready.filter(x => lessonStats(x).pct === 100).length;
    const chTotal = ready.reduce((n, x) => n + (x.challenges || []).length, 0);
    const chDone = ready.reduce((n, x) => n + (x.challenges || []).filter(id => P.ch[id]).length, 0);
    let d = 0, t = 0;
    ready.forEach(x => { const s = lessonStats(x); d += s.done; t += s.total; });
    return { ready: ready.length, all: GL.lessons.length, mastered, chTotal, chDone, pct: t ? Math.round(d / t * 100) : 0 };
  }

  // Progress ring (SVG). pct 0–100.
  function ring(pct, size, label) {
    const r = 15.5, c = 2 * Math.PI * r;
    return `<span class="gd-ring" style="--gd-ring:${size || 44}px" role="img" aria-label="${h(pct + '%')}">
      <svg viewBox="0 0 36 36" aria-hidden="true"><circle class="gd-ring-bg" cx="18" cy="18" r="${r}"/>
      <circle class="gd-ring-fg" cx="18" cy="18" r="${r}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${(c * (1 - pct / 100)).toFixed(2)}"/></svg>
      <span class="gd-ring-txt">${pct === 100 ? '✓' : (label != null ? label : pct + '%')}</span></span>`;
  }

  /* ═══════════════════════════════════════════════════════════════
     THE CAMERA — one picture that can zoom onto any of its spots.
     Used by Know your screen, the step player and Today's tip.
       <div class="gd-stage">          fixed aspect, clips
         <div class="gd-cam">          moves + scales (transform only)
           <img> · .gd-focus (ring + dim) · .gd-dot × n
     ═══════════════════════════════════════════════════════════════ */
  // opts.minAr: the frame is never narrower than this width / height, so a
  // tall picture (a phone screenshot, a long chart) sits in a shorter frame
  // and the camera pans inside it. The picture keeps its own shape.
  function stageHTML(s, opts) {
    opts = opts || {};
    const ar = s.w / s.h;
    const sar = Math.max(ar, opts.minAr || 0);
    const dots = (opts.dots || []).map((k, i) => {
      const b = s.spots[k];
      if (!b) return '';
      // On the spot's top-left corner, so the dot never covers the control
      // itself; kept just inside the picture's edge
      const x = Math.min(0.985, Math.max(0.015, b[0]));
      const y = Math.min(0.985, Math.max(0.015, b[1]));
      return `<button type="button" class="gd-dot" data-k="${h(k)}" style="left:${(x * 100).toFixed(2)}%;top:${(y * 100).toFixed(2)}%" aria-label="${i + 1}">${i + 1}</button>`;
    }).join('');
    return `<div class="gd-stage${opts.cls ? ' ' + opts.cls : ''}" style="aspect-ratio:${sar.toFixed(4)};--ar:${sar.toFixed(4)}" data-shot="${h(s.id)}">
      <div class="gd-cam" style="height:${(sar / ar * 100).toFixed(3)}%"><img src="${h(s.src)}" alt="" width="${s.w}" height="${s.h}" decoding="async"${opts.eager ? '' : ' loading="lazy"'}>
      <div class="gd-focus" hidden></div>${dots}</div></div>`;
  }

  // Point the camera at a spot, or show the whole picture when k is null.
  // Works in pixels: the camera (the picture) is as wide as the frame and may
  // be taller than it.
  function focus(stage, s, k, zoom) {
    const cam = $('.gd-cam', stage), f = $('.gd-focus', stage);
    const b = k && s.spots[k];
    stage._gdFocus = [s, k, zoom];   // so a resize can aim again
    $$('.gd-dot', stage).forEach(d => d.classList.toggle('on', d.dataset.k === k));
    stage.classList.toggle('gd-focused', !!b);
    const W = stage.clientWidth, H = stage.clientHeight;
    if (!W || !H) return;
    const Hc = W * s.h / s.w;          // the picture's height at frame width
    let sc, tx, ty;
    if (!b) {
      // The whole picture: shrunk to fit if it is taller than the frame
      sc = Math.min(1, H / Hc);
      tx = (W - W * sc) / 2; ty = 0;
      f.hidden = true;
    } else {
      // Zoom so the spot fills a good part of the frame with its surroundings
      // still in view; never past 2.2× (the pictures are taken at 1.5×)
      sc = zoom === false ? 1 : Math.max(1, Math.min(2.2, 0.45 / b[2], 0.5 * H / (b[3] * Hc)));
      const cx = (b[0] + b[2] / 2) * W * sc, cy = (b[1] + b[3] / 2) * Hc * sc;
      // Centre the spot, but keep the picture's edges inside the frame
      tx = Math.min(0, Math.max(W - W * sc, W / 2 - cx));
      ty = Math.min(0, Math.max(H - Hc * sc, H / 2 - cy));
      // The ring sits a little outside the control
      const px = 0.006, py = 0.006 * s.w / s.h;
      Object.assign(f.style, {
        left: ((b[0] - px) * 100).toFixed(3) + '%', top: ((b[1] - py) * 100).toFixed(3) + '%',
        width: ((b[2] + 2 * px) * 100).toFixed(3) + '%', height: ((b[3] + 2 * py) * 100).toFixed(3) + '%'
      });
      f.hidden = false;
    }
    cam.style.setProperty('--s', sc.toFixed(3));
    cam.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${sc.toFixed(3)})`;
  }
  // Frames change size with the window: aim every camera again
  let refocusT = 0;
  window.addEventListener('resize', () => {
    clearTimeout(refocusT);
    refocusT = setTimeout(() => $$('.gd-stage').forEach(st => { if (st._gdFocus) focus(st, ...st._gdFocus); }), 150);
  });

  // A small crop of a picture around one spot, drawn as a background
  function cropHTML(s, k, w, hgt, mode) {
    if (!s) return `<span class="gd-crop gd-crop-none" style="width:${w}px;height:${hgt}px"></span>`;
    const b = k && s.spots[k];
    const bx = b ? b[0] * s.w : 0, by = b ? b[1] * s.h : 0, bw = b ? b[2] * s.w : s.w, bh = b ? b[3] * s.h : s.h;
    // A whole picture is shown from the top. A spot is zoomed so it's readable:
    // fitted by height first; a wide one (a menu row) then shows from its left
    // edge rather than shrinking until its text is too small to read
    let z, x, y;
    if (!b) { z = w / s.w; x = 0; y = 0; }
    else if (mode === 'area') {
      // The top-left part of a big spot (a layout, a whole chart), about half its width
      z = Math.min(0.8, w / (bw * 0.55)); x = 6 - bx * z; y = 6 - by * z;
    } else {
      z = Math.min(2.2, hgt * 0.62 / bh, Math.max(w * 0.86 / bw, 0.9));
      x = bw * z > w * 0.9 ? 8 - bx * z : w / 2 - (bx + bw / 2) * z;
      y = hgt / 2 - (by + bh / 2) * z;
    }
    // Don't show empty space past the picture's edge when it can be helped
    x = Math.min(0, Math.max(w - s.w * z, x)); y = Math.min(0, Math.max(hgt - s.h * z, y));
    return `<span class="gd-crop" style="width:${w}px;height:${hgt}px;background-image:url('${h(s.src)}');background-size:${(s.w * z).toFixed(1)}px ${(s.h * z).toFixed(1)}px;background-position:${x.toFixed(1)}px ${y.toFixed(1)}px"></span>`;
  }

  /* ═══════════════════════════════════════════════════════════════
     RENDERING
     ═══════════════════════════════════════════════════════════════ */
  const view = { page: 'hub', lesson: null, phone: window.matchMedia && matchMedia('(max-width: 640px)').matches, sceneIdx: {} };
  let host = null;

  function render() {
    host = document.getElementById('chartsguideView');
    if (!host) return;
    host.classList.add('gd-host');
    if (!window.GL) host.innerHTML = `<div class="gd-loading">${h((window.GL_TEXT && ui('loading')) || 'Loading the guide…')}</div>`;
    ensure().then(() => {
      if (!window.GL) return;
      if (view.page === 'lesson' && lessonById(view.lesson) && !lessonById(view.lesson).soon) renderLesson(view.lesson);
      else if (view.page === 'ref') renderHub('ref');
      else renderHub('lessons');
    });
  }

  /* ── The hub ──────────────────────────────────────────────────── */
  function renderHub(tab) {
    view.page = tab === 'ref' ? 'ref' : 'hub';
    const o = overall();
    const ready = GL.lessons.filter(x => !x.soon);
    // Continue: the last lesson opened that isn't finished, else the first unfinished one
    const last = lessonById(P.last);
    const cont = (last && !last.soon && lessonStats(last).pct < 100) ? last : ready.find(x => lessonStats(x).pct < 100) || ready[0];
    const contStats = lessonStats(cont);
    const nextCh = cont && (cont.challenges || []).find(id => !P.ch[id]);

    const areas = GL.areas.map(a => {
      const list = GL.lessons.filter(x => x.area === a);
      if (!list.length) return '';
      return `<section class="gd-area"><h3 class="gd-area-h">${h(tx('ui.area.' + a))}</h3>
        <div class="gd-cards">${list.map(cardHTML).join('')}</div></section>`;
    }).join('');

    host.innerHTML = `
      <div class="gd-hub">
        <header class="gd-hero">
          <div class="gd-hero-txt">
            <div class="gd-eyebrow">${h(ui('eyebrow'))}</div>
            <h2 class="gd-hero-h">${h(ui('hero_title'))}</h2>
            <p class="gd-hero-sub">${h(ui('hero_sub'))}</p>
            <div class="gd-hero-actions">
              ${cont ? `<button type="button" class="dc-btn dc-btn-main gd-go" data-open="${h(cont.id)}">${h(contStats.done ? ui('continue') : ui('start'))} · ${h(tx('lessons.' + cont.id + '.title'))} →</button>` : ''}
              ${nextCh ? `<span class="gd-hero-next">${h(ui('continue_note', { what: chText(cont.id, nextCh)[0] }))}</span>` : ''}
            </div>
          </div>
          <div class="gd-hero-ring">
            ${ring(o.pct, 132, o.pct + '%')}
            <div class="gd-hero-ring-cap"><strong>${h(ui('ring_of', { done: o.mastered, total: o.ready }))}</strong> ${h(ui('ring_label'))}</div>
            <div class="gd-hero-ring-sub">${h(ui('hero_stats', { lessons: o.all, ch: o.chDone + ' / ' + o.chTotal }))}</div>
          </div>
        </header>
        ${tipHTML()}
        <div class="gd-tabs" role="tablist">
          <button type="button" role="tab" class="gd-tab${tab !== 'ref' ? ' on' : ''}" data-tab="lessons" aria-selected="${tab !== 'ref'}">${h(ui('tab_lessons'))}</button>
          <button type="button" role="tab" class="gd-tab${tab === 'ref' ? ' on' : ''}" data-tab="ref" aria-selected="${tab === 'ref'}">${h(ui('tab_ref'))}</button>
        </div>
        <div class="gd-tabpanel" ${tab === 'ref' ? 'hidden' : ''}>${areas}</div>
        <div class="gd-tabpanel gd-ref" ${tab === 'ref' ? '' : 'hidden'}>
          <p class="gd-ref-note">${h(ui('ref_note'))}</p>
          <div id="gdRefHost"></div>
        </div>
      </div>`;
    if (tab === 'ref') renderRef();
    bindHub();
    const tipStage = $('.gd-tip .gd-stage', host);
    if (tipStage) { const t = todaysTip(); const s = t && shot(t.shot); if (s) requestAnimationFrame(() => focus(tipStage, s, t.spot)); }
  }

  function cardHTML(ls) {
    const title = tx('lessons.' + ls.id + '.title') || ls.id;
    const promise = tx('lessons.' + ls.id + '.promise') || '';
    const icon = ls.nav && typeof window.cgNavIco === 'function' ? window.cgNavIco(ls.nav, 'gd-card-ico') : '';
    if (ls.soon) {
      return `<div class="gd-card gd-card-soon" aria-disabled="true">
        <div class="gd-card-art gd-card-art-soon">${icon}</div>
        <div class="gd-card-body"><div class="gd-card-top"><strong class="gd-card-t">${h(title)}</strong><span class="gd-chip">${h(ui('soon'))}</span></div>
        <p class="gd-card-p">${h(promise)}</p></div></div>`;
    }
    const st = lessonStats(ls);
    const s = shot(ls.cover);
    const state = st.pct === 100 ? `<span class="gd-chip gd-chip-ok">✓ ${h(ui('mastered'))}</span>` : st.done ? `<span class="gd-chip">${h(ui('in_progress', { pct: st.pct }))}</span>` : `<span class="gd-chip gd-chip-dim">${h(ui('not_started'))}</span>`;
    return `<button type="button" class="gd-card" data-open="${h(ls.id)}">
      <div class="gd-card-art">${s ? `<img src="${h(s.src)}" alt="" loading="lazy">` : ''}<span class="gd-card-ring">${ring(st.pct, 40)}</span></div>
      <div class="gd-card-body"><div class="gd-card-top">${icon}<strong class="gd-card-t">${h(title)}</strong></div>
      <p class="gd-card-p">${h(promise)}</p>
      <div class="gd-card-meta">${state}<span class="gd-card-min">${h(ui('mins', { n: ls.mins || 5 }))}</span></div></div></button>`;
  }

  // Today's tip: one per day, picked from every ready lesson's tips
  function todaysTip() {
    const pool = [];
    GL.lessons.filter(x => !x.soon).forEach(ls => (ls.tips || []).forEach((t, i) => pool.push({ ls, i, shot: t[0], spot: t[1], ch: t[2] || null })));
    if (!pool.length) return null;
    const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    return pool[day % pool.length];
  }
  function tipHTML() {
    const t = todaysTip();
    if (!t) return '';
    const s = shot(t.shot);
    const text = (tx('lessons.' + t.ls.id + '.tips') || [])[t.i] || '';
    const ch = t.ch && GD_SHOW[t.ch] ? t.ch : null;
    return `<section class="gd-tip">
      <div class="gd-tip-pic">${s ? stageHTML(s, { cls: 'gd-stage-tip', minAr: 1.7 }) : ''}</div>
      <div class="gd-tip-txt"><div class="gd-tip-h"><span class="gd-tip-bulb" aria-hidden="true">💡</span>${h(ui('tip_title'))}<span class="gd-tip-new">${h(ui('tip_new'))}</span></div>
        <p class="gd-tip-p">${h(text)}</p>
        <div class="gd-tip-act"><button type="button" class="dc-btn dc-btn-normal dc-btn-sm" data-open="${h(t.ls.id)}">${h(ui('tip_open'))}</button>
        ${ch ? `<button type="button" class="dc-btn dc-btn-plain dc-btn-sm" data-show="${h(ch)}">${h(ui('tip_try'))} →</button>` : ''}</div></div>
    </section>`;
  }

  function renderRef() {
    const box = document.getElementById('gdRefHost');
    if (box && typeof renderRefOrig === 'function') renderRefOrig(box);
  }

  function bindHub() {
    $$('[data-open]', host).forEach(b => b.addEventListener('click', () => openLesson(b.dataset.open)));
    $$('[data-show]', host).forEach(b => b.addEventListener('click', () => showMe(b.dataset.show)));
    $$('.gd-tab', host).forEach(b => b.addEventListener('click', () => {
      const ref = b.dataset.tab === 'ref';
      $$('.gd-tab', host).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
      const panels = $$('.gd-tabpanel', host);
      panels[0].hidden = ref; panels[1].hidden = !ref;
      view.page = ref ? 'ref' : 'hub';
      if (ref && !$('#gdRefHost', host).children.length) renderRef();
      try { history.replaceState(null, '', '#t=chartsguide' + (ref ? '/reference' : '')); } catch (e) {}
    }));
  }

  /* ── A lesson ─────────────────────────────────────────────────── */
  function openLesson(id) {
    const ls = lessonById(id);
    if (!ls || ls.soon) return;
    view.page = 'lesson'; view.lesson = id;
    P.last = id; P.seen[id] = P.seen[id] || Date.now(); saveP();
    try { history.replaceState(null, '', '#t=chartsguide/lesson-' + id); } catch (e) {}
    renderLesson(id);
    const top = host.getBoundingClientRect().top + scrollY - 80;
    window.scrollTo({ top: Math.max(0, top), behavior: reduced() ? 'auto' : 'smooth' });
  }

  function renderLesson(id) {
    const ls = lessonById(id);
    const base = 'lessons.' + id;
    const st = lessonStats(ls);
    const idx = GL.lessons.filter(x => !x.soon).indexOf(ls);
    const nextLs = GL.lessons.filter(x => !x.soon)[idx + 1] || GL.lessons.find(x => x.soon);

    const scenes = ls.scenes.map((sc, i) => `<button type="button" class="gd-seg${i === (view.sceneIdx[id] || 0) ? ' on' : ''}" data-scene="${i}">${h(tx(base + '.scenes.' + sc.id + '.title'))}</button>`).join('');

    const howto = ls.howto.map(w => {
      const s = shot(w.slides[0].shot);
      return `<button type="button" class="gd-walk" data-walk="${h(w.id)}">
        <span class="gd-walk-pic">${cropHTML(s, w.slides[0].spot, 280, 150)}<span class="gd-walk-play" aria-hidden="true">▶</span></span>
        <span class="gd-walk-body"><strong>${h(tx(base + '.howto.' + w.id + '.title'))}</strong>
        <span class="gd-walk-meta">${h(ui('steps', { n: w.slides.length }))}${w.challenge && P.ch[w.challenge] ? ` · <span class="gd-ok">✓ ${h(ui('done_chip'))}</span>` : ''}</span></span></button>`;
    }).join('');

    const options = ls.options.map(g => `<div class="gd-optgroup"><h4 class="gd-optgroup-h">${h(tx(base + '.options.' + g.id + '.title'))}</h4>
      <div class="gd-opts${g.big ? ' gd-opts-big' : ''}">${g.items.map(it => {
        const t = tx(base + '.options.' + g.id + '.items.' + it.id) || [];
        const s = shot(it.shot);
        const def = it.def ? `<span class="gd-def">${h(ui('default'))}: ${h(it.def === 'on' ? ui('def_on') : it.def === 'off' ? ui('def_off') : fill(it.def))}</span>` : '';
        return `<button type="button" class="gd-opt" data-zoom="${h(it.shot)}" data-spot="${h(it.spot || '')}">
          ${g.big ? cropHTML(s, it.spot, 320, 150, it.crop) : cropHTML(s, it.spot, 112, 64, it.crop)}<span class="gd-opt-body"><strong>${h(t[0] || it.id)}</strong><span>${h(t[1] || '')}</span>${def}</span></button>`;
      }).join('')}</div></div>`).join('');

    const challenges = ls.challenges.map(cid => {
      const t = chText(id, cid);
      const done = !!P.ch[cid];
      return `<li class="gd-ch${done ? ' done' : ''}" data-ch="${h(cid)}">
        <span class="gd-ch-box" aria-hidden="true">${done ? '✓' : ''}</span>
        <span class="gd-ch-body"><strong>${h(t[0] || cid)}</strong><span>${h(t[1] || '')}</span></span>
        ${done ? `<span class="gd-chip gd-chip-ok">${h(ui('done_chip'))}</span>` : `<button type="button" class="dc-btn dc-btn-normal dc-btn-sm" data-show="${h(cid)}">${h(ui('show_me'))} →</button>`}</li>`;
    }).join('');

    const qa = P.quiz[id] || {};
    const quiz = ls.quiz.map((q, qi) => {
      const t = tx(base + '.quiz.' + q.id) || ['', [], ''];
      const ok = !!qa[q.id];
      return `<div class="gd-q${ok ? ' ok' : ''}" data-q="${h(q.id)}" data-a="${q.answer}">
        <div class="gd-q-n">${qi + 1}</div><div class="gd-q-body"><p class="gd-q-t">${h(t[0])}</p>
        <div class="gd-q-opts">${(t[1] || []).map((c, ci) => `<button type="button" class="gd-q-opt${ok && ci === q.answer ? ' right' : ''}" data-c="${ci}" ${ok ? 'disabled' : ''}>${h(c)}</button>`).join('')}</div>
        <p class="gd-q-why" ${ok ? '' : 'hidden'}><strong>${h(ui('correct'))}</strong> ${h(t[2])}</p></div></div>`;
    }).join('');

    host.innerHTML = `
      <div class="gd-lesson" data-lesson="${h(id)}">
        <nav class="gd-crumbs"><button type="button" class="gd-back" data-hub>← ${h(ui('back_hub'))}</button></nav>
        <header class="gd-lhead">
          <div class="gd-lhead-txt">
            <div class="gd-eyebrow">${ls.nav && typeof window.cgNavIco === 'function' ? window.cgNavIco(ls.nav, 'gd-lhead-ico') : ''}${h(tx('ui.area.' + ls.area))} · ${h(ui('mins', { n: ls.mins || 5 }))}</div>
            <h2 class="gd-lhead-h">${h(tx(base + '.title'))}</h2>
            <p class="gd-lhead-p">${h(tx(base + '.promise'))}</p>
          </div>
          <div class="gd-lhead-ring">${ring(st.pct, 76)}</div>
        </header>
        <div class="gd-jump" role="navigation">
          <a href="#gd-screen">${h(ui('sec_screen'))}</a><a href="#gd-howto">${h(ui('sec_howto'))}</a>
          <a href="#gd-options">${h(ui('sec_options'))}</a><a href="#gd-try">${h(ui('sec_try'))}</a><a href="#gd-quiz">${h(ui('sec_quiz'))}</a>
        </div>

        <section class="gd-sec" id="gd-screen">
          <div class="gd-sec-head"><div><h3>${h(ui('sec_screen'))}</h3><p>${h(ui('sec_screen_sub'))}</p></div>
            <div class="gd-device" role="group">
              <button type="button" class="gd-seg${view.phone ? '' : ' on'}" data-device="0">${ico('monitor')}${h(ui('device_desktop'))}</button>
              <button type="button" class="gd-seg${view.phone ? ' on' : ''}" data-device="1">${ico('phone')}${h(ui('device_phone'))}</button></div></div>
          <div class="gd-scenes" role="tablist">${scenes}</div>
          <div class="gd-explorer" id="gdExplorer"></div>
        </section>

        <section class="gd-sec" id="gd-howto"><div class="gd-sec-head"><div><h3>${h(ui('sec_howto'))}</h3><p>${h(ui('sec_howto_sub'))}</p></div></div>
          <div class="gd-walks">${howto}</div></section>

        <section class="gd-sec" id="gd-options"><div class="gd-sec-head"><div><h3>${h(ui('sec_options'))}</h3><p>${h(ui('sec_options_sub'))}</p></div></div>
          ${options}</section>

        <section class="gd-sec" id="gd-try"><div class="gd-sec-head"><div><h3>${h(ui('sec_try'))}</h3><p>${h(ui('sec_try_sub'))}</p></div>
          <div class="gd-try-count">${h(ui('ring_of', { done: ls.challenges.filter(c => P.ch[c]).length, total: ls.challenges.length }))}</div></div>
          <ul class="gd-chs">${challenges}</ul></section>

        <section class="gd-sec" id="gd-quiz"><div class="gd-sec-head"><div><h3>${h(ui('sec_quiz'))}</h3><p>${h(ui('sec_quiz_sub'))}</p></div></div>
          <div class="gd-quiz">${quiz}</div></section>

        ${nextLs ? `<button type="button" class="gd-next${nextLs.soon ? ' soon' : ''}" ${nextLs.soon ? 'disabled' : `data-open="${h(nextLs.id)}"`}>
          <span class="gd-next-k">${h(ui('next_lesson'))}${nextLs.soon ? ' · ' + h(ui('soon')) : ''}</span>
          <strong>${h(tx('lessons.' + nextLs.id + '.title'))}</strong><span>${h(tx('lessons.' + nextLs.id + '.promise'))}</span></button>` : ''}
      </div>`;
    bindLesson(ls);
    renderExplorer(ls);
  }

  function bindLesson(ls) {
    $('[data-hub]', host).addEventListener('click', () => { view.page = 'hub'; renderHub('lessons'); try { history.replaceState(null, '', '#t=chartsguide'); } catch (e) {} });
    $$('[data-open]', host).forEach(b => b.addEventListener('click', () => openLesson(b.dataset.open)));
    $$('.gd-jump a', host).forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      const t = $(a.getAttribute('href'), host);
      if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 140, behavior: reduced() ? 'auto' : 'smooth' });
    }));
    $$('[data-scene]', host).forEach(b => b.addEventListener('click', () => {
      view.sceneIdx[ls.id] = +b.dataset.scene;
      $$('[data-scene]', host).forEach(x => x.classList.toggle('on', x === b));
      renderExplorer(ls);
    }));
    $$('[data-device]', host).forEach(b => b.addEventListener('click', () => {
      view.phone = b.dataset.device === '1';
      $$('[data-device]', host).forEach(x => x.classList.toggle('on', x === b));
      renderExplorer(ls);
    }));
    $$('[data-walk]', host).forEach(b => b.addEventListener('click', () => {
      const w = ls.howto.find(x => x.id === b.dataset.walk);
      openPlayer(ls, w.slides, tx('lessons.' + ls.id + '.howto.' + w.id + '.title'), tx('lessons.' + ls.id + '.howto.' + w.id + '.slides') || [], w.challenge);
    }));
    $$('[data-zoom]', host).forEach(b => b.addEventListener('click', () => {
      const g = ls.options.find(gr => gr.items.some(it => it.shot === b.dataset.zoom && (it.spot || '') === b.dataset.spot));
      const it = g && g.items.find(x => x.shot === b.dataset.zoom && (x.spot || '') === b.dataset.spot);
      const t = (it && tx('lessons.' + ls.id + '.options.' + g.id + '.items.' + it.id)) || [];
      openPlayer(ls, [{ shot: b.dataset.zoom, spot: b.dataset.spot || null }], t[0] || '', [t[1] || ''], null);
    }));
    $$('[data-show]', host).forEach(b => b.addEventListener('click', () => showMe(b.dataset.show)));
    $$('.gd-q', host).forEach(q => $$('.gd-q-opt', q).forEach(o => o.addEventListener('click', () => answer(ls, q, o))));
  }

  /* ── Know your screen ─────────────────────────────────────────── */
  function renderExplorer(ls) {
    const box = $('#gdExplorer', host);
    if (!box) return;
    const sc = ls.scenes[view.sceneIdx[ls.id] || 0];
    const phone = view.phone && sc.phone;
    const s = shot(sc.shot, phone) || shot(sc.shot);
    if (!s) { box.innerHTML = ''; return; }
    const base = 'lessons.' + ls.id + '.scenes.' + sc.id + '.spots.';
    const keys = sc.spots.filter(k => s.spots[k]);   // a spot missing from this picture is left out
    box.innerHTML = `
      <div class="gd-ex${phone ? ' gd-ex-phone' : ''}">
        <div class="gd-ex-pic">${stageHTML(s, { dots: keys, eager: true, cls: phone ? 'gd-stage-phone' : '', minAr: phone ? 0.62 : 1.2 })}
          <div class="gd-ex-ctl"><button type="button" class="gd-ex-btn" data-step="-1" aria-label="${h(ui('prev'))}">‹</button>
          <button type="button" class="gd-ex-whole" data-whole>${h(ui('whole'))}</button>
          <button type="button" class="gd-ex-btn" data-step="1" aria-label="${h(ui('next'))}">›</button></div>
          <div class="gd-ex-cap" aria-live="polite" hidden></div></div>
        <ol class="gd-ex-list">${keys.map((k, i) => {
          const t = tx(base + k) || [k, ''];
          return `<li><button type="button" class="gd-ex-item" data-k="${h(k)}"><span class="gd-ex-n">${i + 1}</span>
            <span class="gd-ex-t"><strong>${h(t[0])}</strong><span class="gd-ex-d">${h(t[1])}</span></span></button></li>`;
        }).join('')}</ol>
      </div>`;
    const stage = $('.gd-stage', box);
    let cur = -1;
    const set = i => {
      cur = i;
      const k = i >= 0 ? keys[i] : null;
      focus(stage, s, k);
      $$('.gd-ex-item', box).forEach((b, j) => { b.classList.toggle('on', j === i); b.setAttribute('aria-current', j === i); });
      // Phones and tablets: the list sits below the picture, so the picked
      // spot's words also show right under the picture
      const cap = $('.gd-ex-cap', box);
      const t = k ? (tx(base + k) || [k, '']) : null;
      cap.hidden = !t;
      if (t) cap.innerHTML = `<span class="gd-ex-n">${i + 1}</span><span class="gd-ex-t"><strong>${h(t[0])}</strong><span>${h(t[1])}</span></span>`;
      const on = $$('.gd-ex-item', box)[i];
      // Keep the active description in view inside the list, without moving the page
      if (on) { const list = $('.gd-ex-list', box); const top = on.offsetTop - list.offsetTop; if (top < list.scrollTop || top + on.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTo({ top: top - 8, behavior: reduced() ? 'auto' : 'smooth' }); }
    };
    requestAnimationFrame(() => set(-1));
    $$('.gd-dot', stage).forEach(d => d.addEventListener('click', () => set(keys.indexOf(d.dataset.k))));
    $$('.gd-ex-item', box).forEach((b, i) => b.addEventListener('click', () => set(cur === i ? -1 : i)));
    // ‹ › wrap around the spots (from the whole picture, › goes to spot 1 and ‹ to the last)
    const stepBy = d => set(cur < 0 ? (d > 0 ? 0 : keys.length - 1) : (cur + d + keys.length) % keys.length);
    $$('[data-step]', box).forEach(b => b.addEventListener('click', () => stepBy(+b.dataset.step)));
    $('[data-whole]', box).addEventListener('click', () => set(-1));
    // ← → step through the spots while the explorer has focus
    box.tabIndex = -1;
    box.onkeydown = e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); stepBy(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); stepBy(-1); }
      else if (e.key === 'Escape') set(-1);
    };
    stage.addEventListener('click', e => { if (!e.target.closest('.gd-dot')) box.focus({ preventScroll: true }); });
  }

  /* ── The step player ──────────────────────────────────────────── */
  let player = null;
  function openPlayer(ls, slides, title, texts, challenge) {
    closePlayer();
    const el = document.createElement('div');
    el.className = 'gd-player';
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = `<div class="gd-pl-box">
      <header class="gd-pl-head"><div><div class="gd-pl-step"></div><h3 class="gd-pl-title">${h(title)}</h3></div>
        <button type="button" class="gd-pl-x" aria-label="${h(ui('close'))}">✕</button></header>
      ${slides.length > 1 ? `<div class="gd-pl-bars">${slides.map((_, i) => `<button type="button" class="gd-pl-bar" data-i="${i}" aria-label="${h(ui('step_of', { n: i + 1, total: slides.length }))}"><i></i></button>`).join('')}</div>` : ''}
      <div class="gd-pl-stagewrap"></div>
      <div class="gd-pl-cap"><span class="gd-pl-num"></span><p class="gd-pl-text"></p></div>
      <footer class="gd-pl-foot">
        <button type="button" class="dc-btn dc-btn-plain gd-pl-prev">← ${h(ui('prev'))}</button>
        <span class="gd-pl-sp"></span>
        ${challenge && !P.ch[challenge] ? `<button type="button" class="dc-btn dc-btn-normal gd-pl-try" style="display:none">${h(ui('try_now'))} →</button>` : ''}
        <button type="button" class="dc-btn dc-btn-main gd-pl-next"></button>
      </footer></div>`;
    document.body.appendChild(el);
    document.body.classList.add('gd-player-open');
    player = { el, i: -1, curShot: null, stage: null };
    const go = i => {
      if (i < 0 || i >= slides.length) return;
      const sl = slides[i];
      const s = shot(sl.shot, false);
      const wrap = $('.gd-pl-stagewrap', el);
      if (!s) return;
      if (player.curShot !== s.id) {
        // A new picture fades in; the same picture just moves the camera
        const old = player.stage;
        wrap.insertAdjacentHTML('beforeend', stageHTML(s, { eager: true, cls: 'gd-stage-pl', minAr: 1.25 }));
        const ns = wrap.lastElementChild;
        player.stage = ns; player.curShot = s.id;
        const img = $('img', ns);
        const show = () => {
          focus(ns, s, sl.spot);
          requestAnimationFrame(() => ns.classList.add('in'));
          if (old) { old.classList.remove('in'); old.classList.add('out'); setTimeout(() => old.remove(), 420); }
        };
        if (img.complete) requestAnimationFrame(show); else { img.onload = show; img.onerror = show; }
      } else focus(player.stage, s, sl.spot);
      player.i = i;
      $('.gd-pl-step', el).textContent = slides.length > 1 ? ui('step_of', { n: i + 1, total: slides.length }) : '';
      $('.gd-pl-num', el).textContent = slides.length > 1 ? i + 1 : 'i';
      $('.gd-pl-text', el).textContent = texts[i] || '';
      $$('.gd-pl-bar', el).forEach((b, j) => { b.classList.toggle('done', j < i); b.classList.toggle('on', j === i); });
      $('.gd-pl-prev', el).style.visibility = i > 0 ? '' : 'hidden';
      const last = i === slides.length - 1;
      $('.gd-pl-next', el).textContent = last ? ui('done') : ui('next') + ' →';
      const tryBtn = $('.gd-pl-try', el);
      if (tryBtn) tryBtn.style.display = last ? '' : 'none';
    };
    $('.gd-pl-x', el).onclick = closePlayer;
    $('.gd-pl-prev', el).onclick = () => go(player.i - 1);
    $('.gd-pl-next', el).onclick = () => (player.i >= slides.length - 1 ? closePlayer() : go(player.i + 1));
    const tryBtn = $('.gd-pl-try', el);
    if (tryBtn) tryBtn.onclick = () => { closePlayer(); showMe(challenge); };
    $$('.gd-pl-bar', el).forEach(b => b.onclick = () => go(+b.dataset.i));
    el.addEventListener('click', e => { if (e.target === el) closePlayer(); });
    player.key = e => {
      if (e.key === 'Escape') { e.preventDefault(); closePlayer(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); go(player.i + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); go(player.i - 1); }
    };
    document.addEventListener('keydown', player.key, true);
    // Swipe between steps on a phone
    let sx = null;
    const wrap = $('.gd-pl-stagewrap', el);
    wrap.addEventListener('pointerdown', e => { sx = e.clientX; });
    wrap.addEventListener('pointerup', e => {
      if (sx == null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 50) go(player.i + (dx < 0 ? 1 : -1));
    });
    requestAnimationFrame(() => { el.classList.add('in'); go(0); $('.gd-pl-next', el).focus({ preventScroll: true }); });
  }
  function closePlayer() {
    if (!player) return;
    const el = player.el;
    document.removeEventListener('keydown', player.key, true);
    player = null;
    el.classList.remove('in');
    document.body.classList.remove('gd-player-open');
    setTimeout(() => el.remove(), 250);
  }

  /* ── Quick check ──────────────────────────────────────────────── */
  function answer(ls, q, opt) {
    const right = +q.dataset.a === +opt.dataset.c;
    const t = tx('lessons.' + ls.id + '.quiz.' + q.dataset.q) || ['', [], ''];
    const why = $('.gd-q-why', q);
    if (right) {
      P.quiz[ls.id] = P.quiz[ls.id] || {};
      P.quiz[ls.id][q.dataset.q] = true; saveP();
      q.classList.add('ok'); q.classList.remove('bad');
      $$('.gd-q-opt', q).forEach(o => { o.disabled = true; o.classList.toggle('right', o === opt); o.classList.remove('wrong'); });
      why.innerHTML = `<strong>${h(ui('correct'))}</strong> ${h(t[2])}`;
      why.hidden = false;
      onProgress(ls.id, null, true);
    } else {
      opt.classList.add('wrong');
      q.classList.remove('bad'); void q.offsetWidth; q.classList.add('bad');
      why.innerHTML = `<strong>${h(ui('wrong'))}</strong> ${h(ui('retry'))}.`;
      why.hidden = false;
    }
  }

  /* ── Progress changed: refresh what's on screen, celebrate ──── */
  // inPlace: only refresh the lesson's ring (a quiz answer; the rest of the page is already right)
  function onProgress(lessonId, chId, inPlace) {
    if (!window.GL) { ensure().then(() => onProgress(lessonId, chId, inPlace)); return; }
    const ls = lessonById(lessonId);
    const st = lessonStats(ls);
    const inGuide = host && host.isConnected && host.offsetParent !== null;
    if (chId) toastChallenge(ls, chId, st, inGuide);
    if (chId && coach && coach.chId === chId) closeCoach();
    if (ls && st.pct === 100 && !P.mastered[ls.id]) {
      P.mastered[ls.id] = Date.now(); saveP();
      setTimeout(() => celebrate(ls), chId ? 900 : 200);
    }
    if (inGuide) {
      if (view.page === 'lesson' && view.lesson === lessonId && inPlace) {
        const r = $('.gd-lhead-ring', host);
        if (r) r.innerHTML = ring(st.pct, 76);
      } else if (view.page === 'lesson' && view.lesson === lessonId) {
        // Re-render in place, keeping the scroll position
        const y = scrollY; renderLesson(lessonId); window.scrollTo(0, y);
      } else if (view.page === 'hub') renderHub('lessons');
    }
  }

  let toastTimer = null;
  function toastChallenge(ls, chId, st, inGuide) {
    const t = chText(ls.id, chId);
    let el = $('#gdToast');
    if (!el) { el = document.createElement('div'); el.id = 'gdToast'; el.className = 'gd-toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    const chDone = ls.challenges.filter(c => P.ch[c]).length;
    el.innerHTML = `<span class="gd-toast-ic" aria-hidden="true">✓</span>
      <span class="gd-toast-body"><span class="gd-toast-k">${h(ui('toast_title'))}</span><strong>${h(t[0])}</strong>
      <span class="gd-toast-p">${h(ui('toast_progress', { done: chDone, total: ls.challenges.length, lesson: tx('lessons.' + ls.id + '.title') }))}</span>
      <span class="gd-toast-bar"><i style="width:${Math.round(chDone / ls.challenges.length * 100)}%"></i></span></span>
      ${inGuide ? '' : `<button type="button" class="dc-btn dc-btn-normal dc-btn-sm gd-toast-go">${h(ui('toast_back'))}</button>`}
      <button type="button" class="gd-toast-x" aria-label="${h(ui('close'))}">✕</button>`;
    el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
    const go = $('.gd-toast-go', el);
    if (go) go.onclick = () => { el.classList.remove('in'); backToLesson(ls.id); };
    $('.gd-toast-x', el).onclick = () => el.classList.remove('in');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('in'), 7000);
  }

  function celebrate(ls) {
    const el = document.createElement('div');
    el.className = 'gd-cele';
    el.setAttribute('role', 'status');
    const bits = reduced() ? '' : Array.from({ length: 28 }, (_, i) => `<i style="--a:${(i * 360 / 28).toFixed(1)}deg;--d:${(90 + (i * 37) % 70)}px;--c:${i % 3}"></i>`).join('');
    el.innerHTML = `<div class="gd-cele-box"><div class="gd-cele-burst" aria-hidden="true">${bits}</div>
      <div class="gd-cele-medal" aria-hidden="true">${ls.nav && typeof window.cgNavIco === 'function' ? window.cgNavIco(ls.nav, 'gd-cele-ico') : '★'}</div>
      <div class="gd-cele-k">${h(ui('mastered_title'))}</div>
      <strong>${h(ui('mastered_text', { lesson: tx('lessons.' + ls.id + '.title') }))}</strong></div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));
    const off = () => { el.classList.remove('in'); setTimeout(() => el.remove(), 400); };
    el.addEventListener('click', off);
    setTimeout(off, 3600);
  }

  /* ═══════════════════════════════════════════════════════════════
     SHOW ME — go to the real tab and ring the control
     ═══════════════════════════════════════════════════════════════ */
  let coach = null;
  function showMe(chId) {
    const sh = GD_SHOW[chId];
    if (!sh) return;
    const lessonId = (GD_CHALLENGES[chId] || {}).lesson;
    const navBtn = sh.nav && document.querySelector('#periodNav button[data-period="' + sh.nav + '"]');
    if (navBtn && (typeof currentPeriod === 'undefined' || currentPeriod !== sh.nav)) navBtn.click();
    setTimeout(() => {
      // A Stats tab first (it is drawn as it opens)
      if (sh.stab && typeof window.setStatsTab === 'function') window.setStatsTab(sh.stab);
      if (sh.menu) {
        // Open the songs chart's ⋮ on the right tab
        const wrap = $('#songsSection .kebab-menu-wrap');
        const btn = wrap && $('.kebab-menu-btn', wrap);
        if (btn && !(wrap.classList.contains('open') || $('.kebab-menu', wrap).classList.contains('open'))) btn.click();
        const tab = wrap && $('.kebab-tab[data-tab="' + (sh.menu === 'actions' ? 'export' : sh.menu) + '"]', wrap);
        if (tab) tab.click();
      }
      // A Records section next (rview: its data-rec-view)
      if (sh.rview) {
        const rb = $('#recordsNav [data-rec-view="' + sh.rview + '"]');
        if (rb && !rb.classList.contains('active')) rb.click();
      }
      // Records builds the first time it opens, so the control is looked
      // for again (up to ~7 s) until it shows
      let tries = 0;
      const ring = () => {
        const el = $$(sh.ring).find(x => x.offsetParent !== null || x.getClientRects().length);
        if (!el) { if (++tries < 25) setTimeout(ring, 300); return; }
        if (typeof window._dcTourScrollTo === 'function') window._dcTourScrollTo(el);
        else el.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
        el.classList.add('cg-tour-spotlight', 'gd-spot');
        setTimeout(() => el.classList.remove('cg-tour-spotlight', 'gd-spot'), 6000);
        openCoach(lessonId, chId, el);
      };
      ring();
    }, navBtn ? 700 : 50);
  }

  // A floating card while the user is away from the guide doing a challenge
  function openCoach(lessonId, chId, target) {
    closeCoach();
    const t = chText(lessonId, chId);
    const el = document.createElement('div');
    el.className = 'gd-coach';
    el.innerHTML = `<span class="gd-coach-k">${h(ui('coach_hint'))}</span><strong>${h(t[0])}</strong><span class="gd-coach-p">${h(t[1])}</span>
      <div class="gd-coach-act"><button type="button" class="dc-btn dc-btn-plain dc-btn-sm gd-coach-back">← ${h(ui('coach_back'))}</button>
      <button type="button" class="gd-coach-x" aria-label="${h(ui('close'))}">✕</button></div>`;
    document.body.appendChild(el);
    coach = { el, lessonId, chId };
    requestAnimationFrame(() => el.classList.add('in'));
    $('.gd-coach-back', el).onclick = () => { closeCoach(); backToLesson(lessonId); };
    $('.gd-coach-x', el).onclick = closeCoach;
  }
  function closeCoach() { if (coach) { const el = coach.el; coach = null; el.classList.remove('in'); setTimeout(() => el.remove(), 250); } }

  function backToLesson(lessonId) {
    view.page = 'lesson'; view.lesson = lessonId;
    const btn = document.querySelector('#periodNav button[data-period="chartsguide"]');
    if (btn) btn.click();
    setTimeout(() => { const t = $('#gd-try'); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 140, behavior: 'auto' }); }, 120);
  }

  /* ═══════════════════════════════════════════════════════════════
     WIRING INTO THE APP
     ═══════════════════════════════════════════════════════════════ */
  // The old guide renderer becomes the Reference tab
  let renderRefOrig = null;
  function install() {
    wrapFns();
    watchOpens();
    if (typeof window.dcRenderChartsGuideView === 'function' && !window.dcRenderChartsGuideView._gd) {
      renderRefOrig = window.dcRenderChartsGuideView;
      const r = function () { render(); };
      r._gd = true;
      window.dcRenderChartsGuideView = r;
    }
    // Deep links: #t=chartsguide/lesson-week opens a lesson, /reference the Reference
    // tab, and any old section name (e.g. /faq) opens Reference at that section
    if (typeof window.dcGuideJump === 'function' && !window.dcGuideJump._gd) {
      const oldJump = window.dcGuideJump;
      const j = function (slug) {
        if (/^lesson-/.test(slug)) { view.page = 'lesson'; view.lesson = slug.slice(7); render(); return; }
        view.page = 'ref';
        ensure().then(() => { renderHub('ref'); if (slug !== 'reference') setTimeout(() => oldJump(slug), 80); });
      };
      j._gd = true;
      window.dcGuideJump = j;
    }
    // Coming back to the guide from the nav always starts at the hub, unless
    // "Back to the lesson" asked for a lesson
    document.addEventListener('click', e => {
      const b = e.target.closest && e.target.closest('#periodNav button[data-period="chartsguide"], .tb-more-item[data-go="chartsguide"]');
      if (b && e.isTrusted) { view.page = 'hub'; closeCoach(); }
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();

  window.dcGuide = { open: id => { view.page = 'lesson'; view.lesson = id; render(); }, progress: () => P, showMe };
})();
