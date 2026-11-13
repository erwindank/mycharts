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

   The old guide's content (its words are still CG_TEXT in
   charts-guide-i18n.js) lives on since GUIDE-PLAN.md step 12: its setup
   check and first steps in the Getting started lesson, everything else in
   the hub's Reference tab (refRender). The old renderer was removed from app.js
   in step 13; dcRenderChartsGuideView is now an empty name guide.js fills.

   Progress is kept in localStorage (dc_guide_progress):
     { ch: { id: time }, quiz: { lesson: { q: true } }, seen: { lesson: time },
       last: lessonId, mastered: { lesson: time } }
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Bump when the lesson files or the pictures change (it's their ?v=)
  const GUIDE_V = '27';
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
  // Saved here at once, and to the signed-in account a moment later (one
  // write for a burst of changes). firebase.js loads the account's copy on
  // sign-in and hands it to dcMergeGuideProgress below.
  let _cloudTimer = null;
  function saveP() {
    try { localStorage.setItem(STORE, JSON.stringify(P)); } catch (e) {}
    if (typeof window.dcSaveGuideProgress !== 'function' || typeof dcIsSignedIn !== 'function' || !dcIsSignedIn()) return;
    clearTimeout(_cloudTimer);
    _cloudTimer = setTimeout(() => window.dcSaveGuideProgress(JSON.parse(JSON.stringify(P))), 1500);
  }
  // Merges the account's progress into this device's: a challenge or a
  // mastered lesson keeps its earliest time, a lesson opened keeps its latest,
  // a right quiz answer stays right. Nothing is ever taken away, so two
  // devices can't undo each other. Then the merged copy is saved back.
  window.dcMergeGuideProgress = function (remote) {
    if (remote && typeof remote === 'object') {
      const early = (a, b) => (a && b ? Math.min(a, b) : a || b);
      for (const [k, t] of Object.entries(remote.ch || {})) P.ch[k] = early(P.ch[k], t);
      for (const [k, t] of Object.entries(remote.mastered || {})) P.mastered[k] = early(P.mastered[k], t);
      for (const [k, t] of Object.entries(remote.seen || {})) P.seen[k] = Math.max(P.seen[k] || 0, t || 0);
      for (const [ls, qs] of Object.entries(remote.quiz || {})) {
        P.quiz[ls] = P.quiz[ls] || {};
        for (const [q, ok] of Object.entries(qs || {})) if (ok) P.quiz[ls][q] = true;
      }
      if (!P.last && remote.last) P.last = remote.last;
      // Redraw the guide if it's on screen (it reads P as it draws)
      if (host && host.isConnected && host.offsetParent !== null) render();
    }
    saveP();
  };

  /* ── Small helpers ────────────────────────────────────────────── */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const h = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // {{name}} is a value passed in; {{t:key}} is the app's own word for something
  // in the current language (translations*.js), so a badge or button is always
  // called exactly what the app shows. A leading emoji on the app's label is dropped.
  const appWord = k => {
    const w = typeof window.t === 'function' ? window.t(k) : '';
    // Some app labels carry markup ("Last.fm Account <span>(optional)</span>"):
    // the guide escapes what it shows, so only their words are kept
    return String(w && w !== k ? w : '').replace(/<[^>]*>/g, '').replace(/^\p{Extended_Pictographic}\uFE0F?\s*/u, '');
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
    'st.card':       { lesson: 'soundtrack', fn: 'stOpenCard' },
    // The Dank 100 (dank100.js draws it with inline onclick handlers on
    // dcDank100.*, which is an object, so these are noticed by their clicks)
    'd1.week':       { lesson: 'dank100', click: '#dank100View .d100-wk-btn', input: '#dank100View .d100-wk-select' },
    'd1.type':       { lesson: 'dank100', click: '#dank100View .d100-seg button:not(:first-child)' },
    'd1.run':        { lesson: 'dank100', click: '#dank100View .d100-row' },
    'd1.box':        { lesson: 'dank100', click: '#dank100View .cr-boxes [onclick]' },
    'd1.no1':        { lesson: 'dank100', click: '#dank100View .d100-no1-row, #dank100View .d100-no1-more' },
    'd1.export':     { lesson: 'dank100', click: '#dank100View [onclick*="dcDank100.exportPlaylist"]' },
    'd1.share':      { lesson: 'dank100', click: '#dank100View [onclick*="dcDank100.share"]' },
    // World Charts (worldcharts.js: inline onclick handlers on dcWorldCharts.*,
    // an object, so these are noticed by their clicks too)
    'wc.chart':      { lesson: 'worldcharts', click: '#worldchartsView .wc-pick:not(.active)' },
    'wc.week':       { lesson: 'worldcharts', click: '#worldchartsView .wc-weeknav .d100-wk-btn', input: '#worldchartsView .wc-wk-date' },
    'wc.filter':     { lesson: 'worldcharts', click: '#worldchartsView .wc-seg--filter button:not(:first-child)' },
    'wc.range':      { lesson: 'worldcharts', click: '#worldchartsView .wc-seg--range button:not(:first-child)' },
    'wc.open':       { lesson: 'worldcharts', click: '#worldchartsView .wc-li--mine .wc-row' },
    'wc.listen':     { lesson: 'worldcharts', click: '#worldchartsView .wc-acts .ea-sample, #worldchartsView .wc-acts .ea-spotify, #worldchartsView .wc-acts .d100-yt' },
    'wc.myweek':     { lesson: 'worldcharts', click: '#worldchartsView .wc-yourweek' },
    'wc.share':      { lesson: 'worldcharts', click: '#worldchartsView .wc-share-btn' },
    // Ratings (app.js rating* / ar* / rp* functions)
    'rt.rate':       { lesson: 'ratings', open: '#ratingModal' },
    'rt.tracks':     { lesson: 'ratings', fn: 'ratingSwitchTab', test: a => a[0] === 'tracks' },
    'rt.mode':       { lesson: 'ratings', fn: 'ratingSetSongMode' },
    'rt.view':       { lesson: 'ratings', fn: 'arSetView', test: a => a[1] && a[1] !== 'albums' },
    'rt.band':       { lesson: 'ratings', fn: 'arSetBand' },
    'rt.sort':       { lesson: 'ratings', fn: 'arSort' },
    'rt.artist':     { lesson: 'ratings', fn: 'rpOpenArtist' },
    // Events (app.js)
    'ev.tab':        { lesson: 'events', fn: 'setEventsTab', test: a => a[0] && a[0] !== 'today' },
    'ev.type':       { lesson: 'events', fn: 'toggleEventsType' },
    'ev.view':       { lesson: 'events', fn: 'setEventsView' },
    'ev.cal':        { lesson: 'events', fn: 'setCalView', test: a => a[0] === 'week' || a[0] === 'day' },
    'ev.day':        { lesson: 'events', fn: 'calOpenDay' },
    'ev.tm':         { lesson: 'events', fn: 'tmToggleType' },
    'ev.card':       { lesson: 'events', click: '#eventsView .ev-carousel-card, #eventsView .tm-card, #eventsView .cal-ev' },
    'ev.info':       { lesson: 'events', fn: 'toggleEventsStatus' },
    // Playlists (app.js dcPl* functions, autoplaylists.js)
    'pl.open':       { lesson: 'playlists', fn: 'dcPlToggleExpand', test: a => !!a[0] },
    'pl.sort':       { lesson: 'playlists', fn: 'dcPlSetSort' },
    'pl.search':     { lesson: 'playlists', input: '#dcPlMain .plx-search input' },
    'pl.play':       { lesson: 'playlists', click: '#dcPlMain .plx-play, #dcPlMain .plx-shuffle, #dcPlMain .plx-cover-play' },
    'pl.add':        { lesson: 'playlists', open: '#dcPlPickModal' },
    'pl.export':     { lesson: 'playlists', fn: 'dcPlExportMenu' },
    'pl.auto':       { lesson: 'playlists', fn: 'apToggle' },
    // Smart playlists (smartplaylists.js — SMART-PLAYLISTS-PLAN.md step 11)
    'sp.open':       { lesson: 'smart', fn: 'dcPlToggleExpand', test: a => typeof spIsSmart === 'function' && spIsSmart(a[0]) },
    'sp.build':      { lesson: 'smart', open: '#spBuilderModal' },
    'sp.mix':        { lesson: 'smart', open: '#spMixModal' },
    'sp.bell':       { lesson: 'smart', fn: 'spSetNotify', test: a => a[1] === true },
    'sp.copy':       { lesson: 'smart', fn: 'spSaveCopy' },
    'sp.share':      { lesson: 'smart', fn: 'spShareToBoard' },
    // Music player (app.js _yt* functions — PLAYER-PLAN.md step 13)
    'np.open':       { lesson: 'player', fn: 'openYtPlayer' },
    'np.tab':        { lesson: 'player', fn: '_ytShowTab', test: a => a[0] && a[0] !== 'next' },
    'np.love':       { lesson: 'player', fn: '_ytToggleLove' },
    'np.find':       { lesson: 'player', fn: '_ytToggleSearch' },
    'np.sleep':      { lesson: 'player', fn: '_ytStartSleep' },
    'np.stage':      { lesson: 'player', fn: '_ytToggleStage', test: () => typeof _ytInStage === 'function' && _ytInStage() },
    'np.bar':        { lesson: 'player', fn: '_ytSetBar', test: a => !!a[0] },
    'np.tour':       { lesson: 'player', fn: '_ytStartTour' },
    // Raw Data (app.js; the table's clicks are handled by one listener)
    'rd.filter':     { lesson: 'rawdata', input: '#rawFilterSong, #rawFilterArtist, #rawFilterAlbum, #rawFilterDate' },
    'rd.page':       { lesson: 'rawdata', click: '#rawDataView [data-raw-page]', input: '#rawDataView .raw-page-input' },
    'rd.size':       { lesson: 'rawdata', click: '#rawDataView .raw-pager-size button' },
    'rd.sort':       { lesson: 'rawdata', click: '#rawDataView .raw-th' },
    'rd.corr':       { lesson: 'rawdata', input: '#rawFilterCorrected' },
    'rd.edit':       { lesson: 'rawdata', open: '#editScrobbleModal' },
    'rd.rules':      { lesson: 'rawdata', open: '#rulesModal' },
    // Board (board.js draws inline onclick handlers on the dcBoard object)
    'bd.cat':        { lesson: 'board', click: '#boardView .bd-chip:not(.active)' },
    'bd.sort':       { lesson: 'board', click: '#boardView .bd-seg button:not(.active)' },
    'bd.status':     { lesson: 'board', input: '#boardView .bd-select' },
    'bd.search':     { lesson: 'board', input: '#boardView .bd-search' },
    'bd.open':       { lesson: 'board', click: '#boardView [onclick*="dcBoard.toggle"]' },
    'bd.new':        { lesson: 'board', click: '#boardView .bd-new-btn' },
    // Settings & account
    'set.open':      { lesson: 'settings', open: '#sourceModal' },
    'set.tab':       { lesson: 'settings', fn: 'switchSettingsTab', test: a => a[0] && a[0] !== 'source' },
    'set.search':    { lesson: 'settings', input: '#setSearch' },
    'set.theme':     { lesson: 'settings', click: '.theme-btn' },
    'set.lang':      { lesson: 'settings', click: '.lang-btn:not(.active)' },
    'set.backup':    { lesson: 'settings', fn: 'backupsDownload' },
    'set.nt':        { lesson: 'settings', open: '#ntModal' },
    // Getting started: the old Start Here checklist, one challenge per step.
    // start.data is ticked by itself once plays are loaded (checkStart)
    'start.data':    { lesson: 'start' },
    'start.chart':   { lesson: 'start', click: '#periodNav button[data-period="week"], [data-go="charts"]' },
    'start.tour':    { lesson: 'start', fn: 'dcStartChartsGuideTour' },
    'start.explore': { lesson: 'start', click: '#periodNav button[data-period]:not([data-period="week"]):not([data-period="chartsguide"]), .tb-tab[data-go]:not([data-go="charts"]), .tb-more-item[data-go]:not([data-go="chartsguide"]), .bt-tab[data-go]:not([data-go="charts"])' },
    'start.size':    { lesson: 'start', click: '.size-btns button' },
    'start.card':    { lesson: 'start', fn: 'openIgPreviewModal' },
    'start.playlist': { lesson: 'start', open: '#dcPlPickModal' }
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
    'st.card':       { nav: 'soundtrack', ring: '#soundtrackView .st-controls [onclick*="stOpenCard"]' },
    'd1.week':       { nav: 'dank100', ring: '#dank100View .d100-weeknav' },
    'd1.type':       { nav: 'dank100', ring: '#dank100View .d100-seg' },
    'd1.run':        { nav: 'dank100', ring: '#dank100View .d100-row' },
    'd1.box':        { nav: 'dank100', ring: '#dank100View .cr-boxes, #dank100View .d100-row' },
    'd1.no1':        { nav: 'dank100', ring: '#dank100View .d100-no1' },
    'd1.export':     { nav: 'dank100', ring: '#dank100View [onclick*="dcDank100.exportPlaylist"]' },
    'd1.share':      { nav: 'dank100', ring: '#dank100View [onclick*="dcDank100.share"]' },
    'wc.chart':      { nav: 'worldcharts', ring: '#worldchartsView .wc-menu' },
    'wc.week':       { nav: 'worldcharts', ring: '#worldchartsView .wc-weeknav, #worldchartsView .wc-menu' },
    'wc.filter':     { nav: 'worldcharts', ring: '#worldchartsView .wc-seg--filter' },
    'wc.range':      { nav: 'worldcharts', ring: '#worldchartsView .wc-seg--range' },
    'wc.open':       { nav: 'worldcharts', ring: '#worldchartsView .wc-li--mine .wc-row, #worldchartsView .wc-seg--filter' },
    'wc.listen':     { nav: 'worldcharts', ring: '#worldchartsView .wc-acts' },
    'wc.myweek':     { nav: 'worldcharts', ring: '#worldchartsView .wc-yourweek, #worldchartsView .wc-menu' },
    'wc.share':      { nav: 'worldcharts', ring: '#worldchartsView .wc-share-btn' },
    'rt.rate':       { nav: 'ratings', ring: '#ratingsPageBody .ar-next, #ratingsPageBody .ar-list' },
    'rt.tracks':     { nav: 'ratings', ring: '#ratingsPageBody .ar-next, #ratingsPageBody .ar-list' },
    'rt.mode':       { nav: 'ratings', ring: '#ratingsPageBody .ar-tabs' },
    'rt.view':       { nav: 'ratings', ring: '#ratingsPageBody .ar-tabs' },
    'rt.band':       { nav: 'ratings', ring: '#ratingsPageBody .ar-dist-cols' },
    'rt.sort':       { nav: 'ratings', ring: '#ratingsPageBody .am-sort' },
    'rt.artist':     { nav: 'ratings', ring: '#ratingsPageBody .rp-duo .rp-col' },
    'ev.tab':        { nav: 'events', ring: '#eventsView .events-tabs' },
    'ev.type':       { nav: 'events', ring: '#eventsView .events-type-filters' },
    'ev.view':       { nav: 'events', prep: ['setEventsTab', 'coming'], ring: '#eventsViewBtns' },
    'ev.cal':        { nav: 'events', prep: ['setEventsTab', 'calendar'], ring: '#eventsView .cal-view-btns' },
    'ev.day':        { nav: 'events', prep: ['setEventsTab', 'calendar'], ring: '#eventsCalendarGrid .cal-today .cal-cell-num, #eventsCalendarGrid' },
    'ev.tm':         { nav: 'events', prep: ['setEventsTab', 'today'], ring: '#timeMachineSection .tm-toggle-btns' },
    'ev.card':       { nav: 'events', prep: ['setEventsTab', 'today'], ring: '#eventsTodayBody' },
    'ev.info':       { nav: 'events', ring: '#eventsInfoBtn' },
    'pl.open':       { nav: 'playlists', ring: '#dcPlMain .plx-grid, #dcPlMain .plx-new' },
    'pl.sort':       { nav: 'playlists', ring: '#dcPlMain .plx-sort' },
    'pl.search':     { nav: 'playlists', ring: '#dcPlMain .plx-search' },
    'pl.play':       { nav: 'playlists', ring: '#dcPlMain .plx-play, #dcPlMain .plx-grid, #dcPlMain .plx-new' },
    'pl.add':        { nav: 'week', ring: '#songsBody tr[data-ea-key]' },
    'pl.export':     { nav: 'playlists', ring: '#dcPlMain [onclick*="dcPlExportMenu"], #dcPlMain .plx-grid, #dcPlMain .plx-new' },
    'pl.auto':       { nav: 'playlists', ring: '#apSetup' },
    'sp.open':       { nav: 'playlists', ring: '#dcPlMain .plx-smart-tag, #dcPlMain .plx-grid' },
    'sp.build':      { nav: 'playlists', ring: '#dcPlMain .plx-new-smart' },
    'sp.mix':        { nav: 'playlists', ring: '#dcPlMain .plx-new-smart' },
    'sp.bell':       { nav: 'playlists', ring: '#dcPlMain .sp-nt-row, #dcPlMain .plx-smart-tag' },
    'sp.copy':       { nav: 'playlists', ring: '#dcPlMain [onclick^="spSaveCopy"], #dcPlMain .plx-smart-tag' },
    'sp.share':      { nav: 'playlists', ring: '#dcPlMain .sp-share-btn, #dcPlMain .plx-smart-tag' },
    // Music player: open it first (with this week's top song) if it is closed
    'np.open':       { prep: ['_ytGuideOpen'], ring: '#ytMiniPauseBtn' },
    'np.tab':        { prep: ['_ytGuideOpen'], ring: '#ytMiniPlayer .ytp-tabs' },
    'np.love':       { prep: ['_ytGuideOpen'], ring: '#ytLoveBtn' },
    'np.find':       { prep: ['_ytGuideOpen'], ring: '#ytVideoSource .ytp-src-fix, #ytMiniPlayer .ytp-tab[data-tab="tools"]' },
    'np.sleep':      { prep: ['_ytGuideOpen'], ring: '#ytSleepBtn' },
    'np.stage':      { prep: ['_ytGuideOpen'], ring: '#ytMiniExpandBtn, #ytMiniPlayer .yt-player-header' },
    'np.bar':        { prep: ['_ytGuideOpen'], ring: '#ytMiniCollapseBtn' },
    'np.tour':       { prep: ['_ytGuideOpen'], ring: '#ytMiniShortcutsBtn' },
    'rd.filter':     { nav: 'rawdata', ring: '#rawDataView .raw-filters' },
    'rd.page':       { nav: 'rawdata', ring: '#rawPagerTop .raw-pager-nav' },
    'rd.size':       { nav: 'rawdata', ring: '#rawPagerTop .raw-pager-size' },
    'rd.sort':       { nav: 'rawdata', ring: '#rawDataView .raw-table thead' },
    'rd.corr':       { nav: 'rawdata', ring: '#rawDataView .raw-corrected-toggle' },
    'rd.edit':       { nav: 'rawdata', ring: '#rawBody .raw-edit-btn' },
    'rd.rules':      { nav: 'rawdata', ring: '#manageRulesBtn' },
    'bd.cat':        { nav: 'board', ring: '#boardView .bd-chips' },
    'bd.sort':       { nav: 'board', ring: '#boardView .bd-seg' },
    'bd.status':     { nav: 'board', ring: '#boardView .bd-select' },
    'bd.search':     { nav: 'board', ring: '#boardView .bd-search' },
    'bd.open':       { nav: 'board', ring: '#boardView .bd-list' },
    'bd.new':        { nav: 'board', ring: '#boardView .bd-new-btn' },
    'set.open':      { ring: '#configureSourceBtn' },
    'set.tab':       { prep: ['openSourceModal'], ring: '#setTabCharts' },
    'set.search':    { prep: ['openSourceModal'], ring: '#setSearch' },
    'set.theme':     { ring: '#themeGroupBtn' },
    'set.lang':      { ring: '#langGroupBtn' },
    'set.backup':    { prep: ['openSourceModal'], ring: '#setTabProfile' },
    'set.nt':        { ring: '#acctGroupBtn, .tb-signin-btn' },
    'start.data':    { ring: '#configureSourceBtn' },
    'start.chart':   { ring: '.tb-tab[data-go="charts"], .bt-tab[data-go="charts"]' },
    'start.tour':    { ring: '#gdStartTour' },
    'start.explore': { ring: '#topbarNav, #bottomTabs' }
  };
  // The same places as their lessons' challenges
  GD_SHOW['start.size'] = GD_SHOW['week.size'];
  GD_SHOW['start.card'] = GD_SHOW['around.share'];
  GD_SHOW['start.playlist'] = GD_SHOW['pl.add'];

  // The old guide's checklist ticks (dc_guide_checks) carry over to these
  // challenges, so nobody starts again from nothing
  (function migrateChecks() {
    let old = null;
    try { old = JSON.parse(localStorage.getItem('dc_guide_checks') || 'null'); } catch (e) {}
    if (!old) return;
    let changed = false;
    ['data', 'chart', 'tour', 'explore', 'size', 'card', 'playlist'].forEach(k => {
      if (old[k] && !P.ch['start.' + k]) { P.ch['start.' + k] = Date.now(); changed = true; }
    });
    if (changed) saveP();
  })();
  // Plays loaded = the first step is done; ticked quietly (no toast)
  function checkStart() {
    if (!P.ch['start.data'] && typeof allPlays !== 'undefined' && allPlays && allPlays.length) { P.ch['start.data'] = Date.now(); saveP(); }
  }

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
    // One watcher per window, for every challenge on it: the Add to Playlist
    // window counts for both Playlists (pl.add) and Getting started
    // (start.playlist). One watcher per challenge used to skip the second.
    const bySel = {};
    for (const [id, c] of Object.entries(GD_CHALLENGES)) if (c.open) (bySel[c.open] = bySel[c.open] || []).push(id);
    for (const [sel, ids] of Object.entries(bySel)) {
      const el = document.querySelector(sel);
      if (!el || el._gdWatch) continue;
      el._gdWatch = true;
      let was = el.classList.contains('open');
      new MutationObserver(() => {
        const now = el.classList.contains('open');
        // a window can open a moment after the click (it loads first): allow 4s
        if (now && !was && Date.now() - lastInput < 4000) ids.forEach(id => { if (periodOk(GD_CHALLENGES[id])) noteChallenge(id); });
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
    checkStart();
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
        <!-- The tab title, like every other tab's (glow kit icon: an open book
             whose page turns). It replaces the hero's small CHARTS GUIDE eyebrow. -->
        <div class="section-header gd-page-header"><h2 class="section-header-h2">${typeof window.dcGlowIco === 'function' ? window.dcGlowIco('guide') : ''}<span>${h(typeof t === 'function' ? t('nav_chartsguide') : 'Charts Guide')}</span></h2><div class="section-rule"></div></div>
        <header class="gd-hero">
          <div class="gd-hero-txt">
            <h2 class="gd-hero-h">${h(ui('hero_title'))}</h2>
            <p class="gd-hero-sub">${h(ui('hero_sub'))}</p>
            <div class="gd-hero-actions">
              ${cont ? `<button type="button" class="dc-btn dc-btn-main gd-go" data-open="${h(cont.id)}">${h(contStats.done ? ui('continue') : ui('start'))} · ${h(tx('lessons.' + cont.id + '.title'))} →</button>` : ''}
              ${nextCh ? `<span class="gd-hero-next">${h(ui('continue_note', { what: chText(cont.id, nextCh)[0] }))}</span>` : ''}
            </div>
            <div class="gd-hero-more">
              <button type="button" class="dc-btn dc-btn-plain dc-btn-sm" data-act="tour">${h(cgW('btn_tour'))}</button>
              <button type="button" class="dc-btn dc-btn-plain dc-btn-sm" data-act="welcome">${h(cgW('btn_replay'))}</button>
            </div>
          </div>
          <div class="gd-hero-ring">
            ${ring(o.pct, 132, o.pct + '%')}
            <div class="gd-hero-ring-cap"><strong>${h(ui('ring_of', { done: o.mastered, total: o.ready }))}</strong> ${h(ui('ring_label'))}</div>
            <div class="gd-hero-ring-sub">${h(ui('hero_stats', { lessons: o.all, ch: o.chDone + ' / ' + o.chTotal }))}</div>
          </div>
        </header>
        <div class="gd-search" role="search">
          <label class="gd-search-box"><svg class="gd-ico" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6"/><path d="M10.4 10.4 14 14"/></svg>
            <input type="search" id="gdSearch" placeholder="${h(ui('search_ph'))}" aria-label="${h(ui('search_ph'))}" autocomplete="off"></label>
          <div class="gd-search-res" id="gdSearchRes" hidden></div>
        </div>
        ${tipHTML()}
        <div class="gd-tabs" role="tablist">
          <button type="button" role="tab" class="gd-tab${tab !== 'ref' ? ' on' : ''}" data-tab="lessons" aria-selected="${tab !== 'ref'}">${h(ui('tab_lessons'))}</button>
          <button type="button" role="tab" class="gd-tab${tab === 'ref' ? ' on' : ''}" data-tab="ref" aria-selected="${tab === 'ref'}">${h(ui('tab_ref'))}</button>
        </div>
        <div class="gd-tabpanel" ${tab === 'ref' ? 'hidden' : ''}>${areas}</div>
        <div class="gd-tabpanel gd-ref" ${tab === 'ref' ? '' : 'hidden'}>
          <div id="gdRefHost"></div>
        </div>
      </div>`;
    if (tab === 'ref') renderRef();
    bindHub();
    const tipStage = $('.gd-tip .gd-stage', host);
    if (tipStage) { const t = todaysTip(); const s = t && shot(t.shot); if (s) requestAnimationFrame(() => focus(tipStage, s, t.spot)); }
  }

  /* A lesson's icon: its tab's glow icon, or (for the two lessons with no tab
     behind them) a drawing of its own from glowkit.js: a rocket for Getting
     started, a gear for Settings (glow kit, 2026-11-07). */
  // Lessons with a drawing of their own. It wins over the tab's icon, so the
  // two weekly-chart side lessons (Around the chart, the windows) don't repeat
  // the Weekly strip.
  const LESSON_GICO = { start: 'start', settings: 'settings', around: 'around', windows: 'windows' };
  function lessonIco(ls, cls) {
    const g = LESSON_GICO[ls.id];
    if (g && typeof window.dcGlowIco === 'function') return window.dcGlowIco(g, cls);
    if (ls.nav && typeof window.cgNavIco === 'function') return window.cgNavIco(ls.nav, cls);
    return '';
  }

  function cardHTML(ls) {
    const title = tx('lessons.' + ls.id + '.title') || ls.id;
    const promise = tx('lessons.' + ls.id + '.promise') || '';
    const icon = lessonIco(ls, 'gd-card-ico');
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
    if (box) refRender(box);
  }

  function bindHub() {
    $$('[data-act="tour"]', host).forEach(b => b.addEventListener('click', () => { if (typeof window.dcStartChartsGuideTour === 'function') window.dcStartChartsGuideTour(); }));
    $$('[data-act="welcome"]', host).forEach(b => b.addEventListener('click', () => { if (typeof window.dcReplayWelcomeGate === 'function') window.dcReplayWelcomeGate(); }));
    bindSearch();
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

  /* ═══════════════════════════════════════════════════════════════
     THE OLD GUIDE'S CONTENT, NEW HOME (GUIDE-PLAN.md step 12)
     Its words stay in charts-guide-i18n.js (CG_TEXT, four languages);
     the setup check and first steps live in the Getting started lesson,
     everything else in the Reference tab below.
     ═══════════════════════════════════════════════════════════════ */
  // A CG_TEXT string in the current language (English for anything missing)
  const cgAll = () => Object.assign({}, (window.CG_TEXT || {}).en || {}, (window.CG_TEXT || {})[lang()] || {});
  const cgW = k => cgAll()[k] || '';
  const cgFill = (str, v) => String(str || '').replace(/\{\{(\w+)\}\}/g, (m, k) => (v && v[k] != null ? v[k] : m));
  const navIco = (nav, cls) => (nav && typeof window.cgNavIco === 'function' ? window.cgNavIco(nav, cls || 'gd-ref-navico') : '');
  const plays = () => (typeof allPlays !== 'undefined' && allPlays) || [];

  /* ── Getting started: your setup, live ── */
  function setupHTML() {
    const G = cgAll(), n = plays().length, loc = lang();
    const src = typeof getDataSource === 'function' ? getDataSource() : '';
    const lfmUser = typeof getLastFmUser === 'function' ? getLastFmUser() : '';
    const ls = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
    const srcLabel = src === 'lastfm' ? 'Last.fm' : src === 'sheets' ? 'Google Sheets' : G.src_csv;
    const srcOk = src === 'lastfm' ? !!lfmUser : src === 'sheets' ? !!ls('dc_sheet_id') : n > 0;
    const hasName = !!ls('dc_display_name'), hasTz = !!ls('dc_timezone');
    const nPlays = n.toLocaleString(loc);
    // Data quality, as the old Start Here checked it
    const warn = [];
    if (!n) warn.push(['bad', G.q_none]);
    else {
      warn.push(['ok', cgFill(G.q_ok, { n: nPlays, src: srcLabel })]);
      const tracks = new Set(plays().map(p => p.title + '|||' + p.artist)).size;
      if (tracks < 10) warn.push(['warn', G.q_few]);
      if (!window.firstScrobbleDate && !(plays()[0] && plays()[0].date)) warn.push(['warn', G.q_nodate]);
      const noAlbum = plays().filter(p => !p.album || p.album === '—').length;
      if (n > 100 && noAlbum / n > 0.3) warn.push(['warn', cgFill(G.q_noalbum, { pct: Math.round(noAlbum / n * 100) })]);
    }
    if (src === 'lastfm' && !lfmUser) warn.push(['warn', G.q_lfm_nouser]);
    const mark = t => (t === 'ok' ? '✓' : t === 'bad' ? '✗' : t === 'warn' ? '!' : '○');
    const item = (t, msg) => `<li class="gd-si gd-si-${t}"><span aria-hidden="true">${mark(t)}</span>${h(msg)}</li>`;
    const step = (done, num, title, text, act, btn, id) => `<div class="gd-step${done ? ' done' : ''}">
        <span class="gd-step-n">${done ? '✓' : num}</span>
        <div class="gd-step-b"><strong>${h(title)}</strong><p>${h(text)}</p>
        <button type="button" class="dc-btn dc-btn-normal dc-btn-sm" data-act="${act}"${id ? ` id="${id}"` : ''}>${h(btn)} →</button></div></div>`;
    return `<section class="gd-setup" aria-label="${h(G.setup_title)}">
      <div class="gd-steps">
        ${step(srcOk, 1, G.step1_title, srcOk ? cgFill(G.step1_ok, { src: srcLabel, n: nPlays }) : G.step1_no, 'settings', srcOk ? G.step1_btn_ok : G.step1_btn_no)}
        ${step(hasName && hasTz, 2, G.step2_title, [G.step2_text, hasName ? G.name_set : G.name_unset, hasTz ? G.tz_set : G.tz_unset].join(' '), 'settings', G.open_settings)}
        ${step(!!P.ch['start.tour'], 3, G.step3_title, G.step3_text, 'tour', G.step3_btn, 'gdStartTour')}
      </div>
      <a class="gd-setup-guide" href="setup-guide.html${src ? '?tab=' + (src === 'csv' ? 'file' : src) : ''}" target="_blank" rel="noopener">📘 ${h(t('gd_setup_guide_link'))}</a>
      <div class="gd-panels">
        <div class="gd-panel"><h4>${h(G.setup_title)}</h4><ul class="gd-si-list">
          ${item(srcOk ? 'ok' : 'warn', cgFill(srcOk ? G.si_src_ok : G.si_src_no, { src: srcLabel }))}
          ${item(n ? 'ok' : 'warn', n ? cgFill(G.si_plays, { n: nPlays }) : G.si_noplays)}
          ${item(hasName ? 'ok' : 'none', hasName ? G.si_name_set : G.si_name_unset)}
          ${item(hasTz ? 'ok' : 'none', hasTz ? G.si_tz_set : G.si_tz_unset)}</ul></div>
        <div class="gd-panel"><h4>${h(G.quality_title)}</h4><ul class="gd-si-list">${warn.map(w => item(w[0], w[1])).join('')}</ul></div>
        <div class="gd-panel"><h4>${h(cgFill(G.source_title, { src: srcLabel }))}</h4><p class="gd-panel-p">${h((G.src_desc || {})[src] || '')}</p>
          <div class="gd-src-dots">${['lastfm', 'sheets', 'file'].map(x => `<span class="gd-chip${x === src ? ' gd-chip-on' : ''}">${x === 'lastfm' ? 'Last.fm' : x === 'sheets' ? 'Sheets' : 'CSV'}</span>`).join('')}</div></div>
      </div>
    </section>`;
  }

  /* ── Reference: the tabs, how charts work, glossary, tips & shortcuts,
     your data, FAQ, export, what's new and your notes ── */
  const REF_SECS = ['tabs', 'concepts', 'glossary', 'tips', 'yourdata', 'faq', 'export', 'news', 'notes'];
  // Old guide section names (deep links like #t=chartsguide/help) → new sections
  const REF_ALIAS = { help: 'faq', shortcuts: 'tips' };
  // Which lesson teaches a tab (the old "The Tabs" chapter links to them now)
  const lessonForNav = nav => {
    const map = { month: 'periods', year: 'periods', graphs: 'stats', day: 'daily' };
    const id = map[nav] || nav;
    const l = window.GL && GL.lessons.find(x => x.id === id);
    return l && !l.soon ? l : null;
  };
  function refTitle(k) {
    const G = cgAll(), ch = G.ch || {};
    return { tabs: ch.tabs, concepts: ch.concepts, glossary: G.glossary_head, tips: ch.tips, yourdata: ch.yourdata,
      faq: G.faq_title, export: G.export_head, news: G.new_title, notes: G.stuck_title }[k] || k;
  }
  function refRender(box) {
    const G = cgAll(), loc = lang(), all = plays(), n = all.length;
    const tName = k => (typeof window.t === 'function' ? window.t(k) : k);
    const TAB_NAME = { day: 'nav_daily', week: 'nav_weekly', month: 'nav_monthly', year: 'nav_yearly', alltime: 'nav_alltime',
      graphs: 'tab_stats', records: 'nav_records', awards: 'nav_awards', soundtrack: 'nav_soundtrack', events: 'nav_events',
      playlists: 'nav_playlists', rawdata: 'nav_rawdata', board: 'nav_board', chartsguide: 'nav_chartsguide', dank100: 'nav_dank100', worldcharts: 'nav_worldcharts', ratings: 'nav_ratings' };
    const recSections = ['rec_nav_overview', 'rec_nav_all_ones', 'rec_nav_pak', 'rec_nav_appearances', 'rec_nav_debuts', 'rec_nav_new_charts',
      'rec_nav_peak_plays', 'rec_nav_milestones', 'rec_nav_fastest', 'rec_nav_streaks', 'rec_nav_certs'].map(tName).join(', ');
    const sec = (k, inner, sub) => `<section class="gd-rsec" id="gd-ref-${k}"><h3 class="gd-rsec-h">${h(refTitle(k))}</h3>
      ${sub ? `<p class="gd-rsec-sub">${h(sub)}</p>` : ''}${inner}</section>`;
    const filter = (id, ph) => `<label class="gd-filter"><svg class="gd-ico" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6"/><path d="M10.4 10.4 14 14"/></svg>
      <input type="search" data-filter="${id}" placeholder="${h(ph)}" aria-label="${h(ph)}" autocomplete="off"><span class="gd-filter-n" data-count="${id}"></span></label>`;

    // The tabs, as the top bar groups them, each with its lesson
    const tabs = (G.groups || []).map(row => `<div class="gd-rgroup"><h4>${h(row.group)}</h4><p class="gd-rsec-sub">${h(row.note)}</p>
      <div class="gd-rtabs">${row.tabs.map(tb => {
        const name = tName(TAB_NAME[tb.period] || tb.period), lsn = lessonForNav(tb.period);
        return `<div class="gd-rtab"><div class="gd-rtab-h">${navIco(tb.period)}<strong>${h(name)}</strong></div>
          <p>${h(cgFill(tb.desc, { sections: recSections }))}</p><p class="gd-rtab-use"><span>${h(G.best_for)}</span> ${h(tb.use)}</p>
          <div class="gd-rtab-act">${lsn ? `<button type="button" class="dc-btn dc-btn-normal dc-btn-sm" data-open="${h(lsn.id)}">${h(ui('ref_lesson'))} →</button>` : ''}
          ${tb.period !== 'chartsguide' ? `<button type="button" class="dc-btn dc-btn-plain dc-btn-sm" data-go="${h(tb.period)}">${h(cgFill(G.open_tab, { name }))}</button>` : `<span class="gd-chip">${h(G.you_are_here)}</span>`}</div></div>`;
      }).join('')}</div></div>`).join('');

    const concepts = `<div class="gd-rconcepts">${(G.concepts || []).map(c => `<div class="gd-rconcept"><span class="gd-rconcept-i" aria-hidden="true">${h(c.icon)}</span>
      <strong>${h(c.title)}</strong><p>${h(c.body)}</p></div>`).join('')}</div>`;

    const gloss = filter('gloss', G.glossary_ph) + `<dl class="gd-rgloss" id="gdRefGloss">${(G.glossary || []).map((g, i) => `<div class="gd-rgloss-row" id="gd-gl-${i}" data-text="${h((g.term + ' ' + g.def).toLowerCase())}">
      <dt>${h(g.term)}</dt><dd>${h(g.def)}</dd></div>`).join('')}</dl>`;

    // Tips are trusted HTML from charts-guide-i18n.js (they may hold <strong>)
    const tips = `<div class="gd-rduo"><div class="gd-panel"><h4>${h(G.shortcuts_title)}</h4>${(G.shortcuts || []).map(([k, d], i) => `<div class="gd-rkey" id="gd-sc-${i}">
        <kbd>${h(k)}</kbd><span>${h(d)}</span></div>`).join('')}</div>
      <div class="gd-panel"><h4>${h(G.tips_title)}</h4><ul class="gd-rtips">${(G.tips || []).map(tp => `<li>${tp}</li>`).join('')}</ul></div></div>`;

    // Your data: totals, what to look at next, on this day, milestones
    const artists = n ? new Set(all.map(p => p.artist)).size : 0;
    const tracks = n ? new Set(all.map(p => p.title + '|||' + p.artist)).size : 0;
    const albums = n ? new Set(all.filter(p => p.album && p.album !== '—').map(p => p.album + '|||' + p.artist)).size : 0;
    const first = n ? (window.firstScrobbleDate || all.reduce((m, p) => (p.date < m ? p.date : m), all[0].date)) : null;
    const span = first ? Date.now() - first : 0;
    const spanTxt = span >= 365 * 864e5 ? cgFill(G.years, { n: (span / (365.25 * 864e5)).toLocaleString(loc, { maximumFractionDigits: 1 }) })
      : cgFill(G.days, { n: Math.round(span / 864e5) });
    const tile = (v, l) => `<div class="gd-rstat"><b>${h(v)}</b><span>${h(l)}</span></div>`;
    const sugg = [];
    const S = (key, nav, act) => { if (G.sugg && G.sugg[key]) sugg.push({ t: G.sugg[key].text, b: G.sugg[key].btn, nav, act }); };
    if (!n) S('settings', null, 'settings');
    else {
      S('records', 'records'); if (artists > 20) S('events', 'events'); if (n > 500) S('graphs', 'graphs');
      if (n > 1000) S('playlists', 'playlists'); S('week', 'week');
    }
    const today = typeof tzNow === 'function' ? tzNow() : new Date();
    const otd = [];
    if (n && first) {
      const dOf = p => (typeof tzDateOf === 'function' ? tzDateOf(p) : p.date);
      for (let y = today.getFullYear() - 1; y >= Math.max(today.getFullYear() - 5, first.getFullYear()); y--) {
        const dp = all.filter(p => { const d = dOf(p); return d.getMonth() === today.getMonth() && d.getDate() === today.getDate() && d.getFullYear() === y; });
        if (!dp.length) continue;
        const ac = {}; dp.forEach(p => { ac[p.artist] = (ac[p.artist] || 0) + 1; });
        const top = Object.entries(ac).sort((a, b) => b[1] - a[1])[0];
        otd.push({ y, plays: dp.length, artist: top[0], count: top[1] });
      }
    }
    const ms = [];
    if (n && first) {
      const sorted = [...all].sort((a, b) => a.date - b.date);
      ms.push({ l: G.ms_first, d: first, p: sorted[0] });
      for (const c of [100, 500, 1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000]) if (sorted.length >= c) ms.push({ l: cgFill(G.ms_nth, { n: c.toLocaleString(loc) }), d: sorted[c - 1].date, p: sorted[c - 1] });
    }
    const playsWord = c => (typeof tCount === 'function' ? tCount('plays', c) : c + ' plays');
    const yourdata = `<div class="gd-rstats">${tile(artists.toLocaleString(loc), G.stat_artists)}${tile(tracks.toLocaleString(loc), G.stat_tracks)}
        ${tile(albums.toLocaleString(loc), G.stat_albums)}${tile(n ? spanTxt : '—', G.stat_history)}${tile(first ? first.toLocaleDateString(loc, { month: 'short', year: 'numeric' }) : '—', G.stat_first)}</div>
      <h4 class="gd-rsub">${h(G.next_title)}</h4>
      <div class="gd-rsugg">${sugg.map(x => `<button type="button" class="gd-rsugg-row" ${x.nav ? `data-go="${h(x.nav)}"` : `data-act="${h(x.act)}"`}>
        ${x.nav ? navIco(x.nav) : ''}<span>${h(x.t)}</span><b>${h(x.b)} →</b></button>`).join('')}</div>
      <div class="gd-rduo">
        <div class="gd-panel"><h4>${h(cgFill(G.otd_title, { date: today.toLocaleDateString(loc, { month: 'long', day: 'numeric' }) }))}</h4>
          ${otd.length ? otd.map(r => `<div class="gd-rotd"><b>${r.y}</b><span>${cgFill(G.otd_row, { plays: h(playsWord(r.plays)), artist: h(r.artist), count: r.count })}</span></div>`).join('')
            : `<p class="gd-panel-p">${h(n ? G.otd_empty : G.otd_empty_noplays)}</p>`}</div>
        <div class="gd-panel"><h4>${h(G.ms_title)}</h4>
          ${ms.length ? `<ol class="gd-rms">${ms.map(m => `<li><strong>${h(m.l)}</strong><span>${h(m.d.toLocaleDateString(loc, { year: 'numeric', month: 'short', day: 'numeric' }))}</span>
            ${m.p ? `<em>${cgFill(G.ms_by, { title: h(m.p.title), artist: h(m.p.artist) })}</em>` : ''}</li>`).join('')}</ol>`
            : `<p class="gd-panel-p">${h(G.ms_empty)}</p>`}</div>
      </div>`;

    const faq = filter('faq', G.faq_ph) + `<div class="gd-rfaq" id="gdRefFaq">${(G.faqs || []).map((f, i) => `<details class="gd-rfaq-row" id="gd-fq-${i}" data-text="${h((f.q + ' ' + f.a).toLowerCase())}">
      <summary>${h(f.q)}</summary><p>${h(f.a)}</p></details>`).join('')}</div>`;

    const expIco = [navIco('week'), navIco('rawdata'), navIco('playlists')];
    const exp = `<div class="gd-rexport">${(G.export || []).map((e, i) => `<div class="gd-panel"><h4>${expIco[i] || ''}${h(e.title)}</h4>
      <ol>${e.steps.map(st => `<li>${h(st)}</li>`).join('')}</ol></div>`).join('')}</div>`;

    const count = typeof DC_CHANGELOG !== 'undefined' ? DC_CHANGELOG.length.toLocaleString(loc) : '…';
    const news = `<div class="gd-panel gd-rnews"><p id="gdRefNews">${h(cgFill(G.new_text, { n: count }))}</p>
      <button type="button" class="dc-btn dc-btn-normal dc-btn-sm" data-act="changelog">${h(G.new_btn)}</button></div>`;

    let note = ''; try { note = localStorage.getItem('dc_guide_feedback') || ''; } catch (e) {}
    // stuck_text is trusted HTML from charts-guide-i18n.js (it holds a link)
    const notes = `<div class="gd-panel"><p class="gd-panel-p">${G.stuck_text || ''}</p>
      <textarea class="gd-rnote dc-input" id="gdRefNote" rows="4" placeholder="${h(G.stuck_ph)}" aria-label="${h(G.stuck_ph)}">${h(note)}</textarea>
      <div class="gd-rnote-row"><button type="button" class="dc-btn dc-btn-normal dc-btn-sm" data-act="note">${h(G.stuck_save)}</button><span class="gd-rnote-ok" aria-live="polite"></span></div></div>`;

    box.innerHTML = `<div class="gd-refview">
      <nav class="gd-rnav" aria-label="${h(ui('tab_ref'))}">${REF_SECS.map(k => `<a href="#gd-ref-${k}" data-jump="${k}">${h(refTitle(k))}</a>`).join('')}</nav>
      <div class="gd-rbody">
        ${sec('tabs', tabs, G.blurb && G.blurb.tabs)}
        ${sec('concepts', concepts, G.blurb && G.blurb.concepts)}
        ${sec('glossary', gloss)}
        ${sec('tips', tips, G.blurb && G.blurb.tips)}
        ${sec('yourdata', yourdata, G.blurb && G.blurb.yourdata)}
        ${sec('faq', faq)}
        ${sec('export', exp)}
        ${sec('news', news)}
        ${sec('notes', notes)}
      </div></div>`;

    if (typeof DC_CHANGELOG === 'undefined' && typeof window.dcClEnsureData === 'function') window.dcClEnsureData(() => {
      const el = document.getElementById('gdRefNews');
      if (el && typeof DC_CHANGELOG !== 'undefined') el.textContent = cgFill(cgAll().new_text, { n: DC_CHANGELOG.length.toLocaleString(lang()) });
    });
    // Wiring
    $$('[data-open]', box).forEach(b => b.addEventListener('click', () => openLesson(b.dataset.open)));
    $$('[data-go]', box).forEach(b => b.addEventListener('click', () => { const nb = document.querySelector('#periodNav button[data-period="' + b.dataset.go + '"]'); if (nb) nb.click(); }));
    $$('[data-act="settings"]', box).forEach(b => b.addEventListener('click', () => window.openSourceModal && window.openSourceModal()));
    $$('[data-act="changelog"]', box).forEach(b => b.addEventListener('click', () => window.openChangelog && window.openChangelog()));
    $$('[data-act="note"]', box).forEach(b => b.addEventListener('click', () => {
      try { localStorage.setItem('dc_guide_feedback', $('#gdRefNote', box).value); } catch (e) {}
      const ok = $('.gd-rnote-ok', box); ok.textContent = cgAll().stuck_saved || '✓'; setTimeout(() => { ok.textContent = ''; }, 2000);
    }));
    $$('[data-jump]', box).forEach(a => a.addEventListener('click', e => { e.preventDefault(); refJump(a.dataset.jump); }));
    $$('[data-filter]', box).forEach(inp => inp.addEventListener('input', () => {
      const q = norm(inp.value), wrap = inp.dataset.filter === 'faq' ? $('#gdRefFaq', box) : $('#gdRefGloss', box);
      let shown = 0;
      $$('[data-text]', wrap).forEach(r => {
        const m = !q || norm(r.dataset.text).includes(q);
        r.hidden = !m; if (m) shown++;
        if (r.tagName === 'DETAILS') r.open = !!q && m;
      });
      const c = $('[data-count="' + inp.dataset.filter + '"]', box), GG = cgAll();
      c.textContent = !q ? '' : shown ? cgFill(shown === 1 ? GG.match_one : GG.match_other, { n: shown }) : GG.match_none;
    }));
  }
  // Scroll the Reference to a section (and open / light up a row in it)
  function refJump(k, rowId) {
    const el = document.getElementById(rowId || 'gd-ref-' + (REF_ALIAS[k] || k));
    if (!el) return;
    if (el.tagName === 'DETAILS') el.open = true;
    if (rowId) { el.classList.add('gd-flash'); setTimeout(() => el.classList.remove('gd-flash'), 1800); }
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 140, behavior: reduced() ? 'auto' : 'smooth' });
  }

  /* ── Search the whole guide: lessons, every spot, walkthrough, option
     and challenge, and the Reference's FAQ, glossary and shortcuts ── */
  // Lower case, accents off ("música" finds "musica")
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  let _index = null, _indexLang = null;
  function searchIndex() {
    if (_index && _indexLang === lang()) return _index;
    const out = [];
    const add = (kind, title, text, go, where) => {
      if (title) out.push({ kind, title: String(title), text: String(text || ''), go, where: where || '', key: norm(title + ' ' + (text || '') + ' ' + (where || '')) });
    };
    GL.lessons.filter(x => !x.soon).forEach(ls => {
      const b = 'lessons.' + ls.id, lt = tx(b + '.title');
      add('lesson', lt, tx(b + '.promise'), { lesson: ls.id });
      ls.scenes.forEach((sc, si) => sc.spots.forEach(k => { const t = tx(b + '.scenes.' + sc.id + '.spots.' + k) || []; add('spot', t[0], t[1], { lesson: ls.id, scene: si, spot: k }, lt); }));
      ls.howto.forEach(w => add('howto', tx(b + '.howto.' + w.id + '.title'), (tx(b + '.howto.' + w.id + '.slides') || []).join(' '), { lesson: ls.id, walk: w.id }, lt));
      ls.options.forEach(g => g.items.forEach(it => { const t = tx(b + '.options.' + g.id + '.items.' + it.id) || []; add('option', t[0], t[1], { lesson: ls.id, zoom: it.shot, spot: it.spot || '' }, lt); }));
      (ls.challenges || []).forEach(c => { const t = chText(ls.id, c); add('challenge', t[0], t[1], { lesson: ls.id, sec: 'gd-try' }, lt); });
    });
    const G = cgAll();
    (G.faqs || []).forEach((f, i) => add('faq', f.q, f.a, { ref: 'faq', row: 'gd-fq-' + i }));
    (G.glossary || []).forEach((g, i) => add('gloss', g.term, g.def, { ref: 'glossary', row: 'gd-gl-' + i }));
    (G.shortcuts || []).forEach(([k, d], i) => add('key', d, k, { ref: 'tips', row: 'gd-sc-' + i }));
    (G.concepts || []).forEach(c => add('ref', c.title, c.body, { ref: 'concepts' }));
    _index = out; _indexLang = lang();
    return out;
  }
  function bindSearch() {
    const inp = $('#gdSearch', host), res = $('#gdSearchRes', host);
    if (!inp) return;
    let hits = [];
    const show = () => {
      const words = norm(inp.value).split(/\s+/).filter(Boolean);
      if (!words.length) { res.hidden = true; res.innerHTML = ''; hits = []; return; }
      const order = { lesson: 0, howto: 1, faq: 2, spot: 3, option: 4, gloss: 5, challenge: 6, key: 7, ref: 8 };
      const inTitle = x => words.every(w => norm(x.title).includes(w));
      hits = searchIndex().filter(x => words.every(w => x.key.includes(w)))
        .sort((a, b) => (inTitle(b) - inTitle(a)) || (order[a.kind] - order[b.kind])).slice(0, 12);
      res.hidden = false;
      res.innerHTML = hits.length ? hits.map((x, i) => `<button type="button" class="gd-sr" data-i="${i}">
          <span class="gd-sr-k">${h(ui('sr_' + x.kind))}</span><span class="gd-sr-t"><strong>${h(x.title)}</strong>
          <span>${h(x.where ? x.where + ' · ' + x.text : x.text)}</span></span></button>`).join('')
        : `<p class="gd-sr-none">${h(ui('search_none'))}</p>`;
      $$('.gd-sr', res).forEach(b => b.addEventListener('click', () => goHit(hits[+b.dataset.i])));
    };
    inp.addEventListener('input', show);
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter' && hits[0]) { e.preventDefault(); goHit(hits[0]); }
      if (e.key === 'Escape') { inp.value = ''; show(); }
    });
  }
  function goHit(x) {
    if (!x) return;
    const g = x.go;
    if (g.ref) {
      renderHub('ref');
      try { history.replaceState(null, '', '#t=chartsguide/reference'); } catch (e) {}
      setTimeout(() => refJump(g.ref, g.row), 60);
      return;
    }
    const ls = lessonById(g.lesson);
    if (!ls) return;
    if (g.scene != null) view.sceneIdx[ls.id] = g.scene;
    openLesson(ls.id);
    setTimeout(() => {
      const to = el => { if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 130, behavior: 'auto' }); };
      if (g.spot && g.scene != null) {
        const it = $('.gd-ex-item[data-k="' + g.spot + '"]', host); if (it) it.click();
        to($('#gd-screen', host));
      } else if (g.walk) {
        const b = $('[data-walk="' + g.walk + '"]', host); if (b) b.click();
      } else if (g.zoom) {
        const b = $('[data-zoom="' + g.zoom + '"][data-spot="' + g.spot + '"]', host); if (b) b.click();
      } else if (g.sec) to($('#' + g.sec, host));
    }, 120);
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
    checkStart();
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
            <div class="gd-eyebrow">${lessonIco(ls, 'gd-lhead-ico')}${h(tx('ui.area.' + ls.area))} · ${h(ui('mins', { n: ls.mins || 5 }))}</div>
            <h2 class="gd-lhead-h">${h(tx(base + '.title'))}</h2>
            <p class="gd-lhead-p">${h(tx(base + '.promise'))}</p>
          </div>
          <div class="gd-lhead-ring">${ring(st.pct, 76)}</div>
        </header>
        ${ls.live === 'setup' ? setupHTML() : ''}
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
    $$('[data-act="settings"]', host).forEach(b => b.addEventListener('click', () => { if (typeof window.openSourceModal === 'function') window.openSourceModal(); }));
    $$('[data-act="tour"]', host).forEach(b => b.addEventListener('click', () => { if (typeof window.dcStartChartsGuideTour === 'function') window.dcStartChartsGuideTour(); }));
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
      <div class="gd-cele-medal" aria-hidden="true">${lessonIco(ls, 'gd-cele-ico') || '★'}</div>
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
      // prep: [app function, ...args] that opens the right part of the tab
      // first (an Events tab). It runs as if nobody clicked, so it never
      // completes a challenge on the user's behalf.
      if (sh.prep && typeof window[sh.prep[0]] === 'function') { lastInput = 0; window[sh.prep[0]](...sh.prep.slice(1)); }
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

  /* ── The tour's "This tab's lesson" button ──
     Shown on each tour step that is about a tab with a lesson; it ends the
     tour and opens that lesson. Lesson words load with the guide, so the
     label is read when the step changes. */
  function tourLessonBtn() {
    const bar = document.querySelector('#cgTourBanner .cg-tour-controls');
    if (!bar) return;
    let b = document.getElementById('gdTourLesson');
    if (!b) {
      b = document.createElement('button');
      b.type = 'button'; b.id = 'gdTourLesson'; b.className = 'dc-btn dc-btn-plain dc-btn-sm gd-tour-lesson';
      b.addEventListener('click', () => {
        const id = b.dataset.lesson;
        if (typeof window.dcEndTour === 'function') window.dcEndTour();
        if (id) { view.page = 'lesson'; view.lesson = id; const nb = document.querySelector('#periodNav button[data-period="chartsguide"]'); if (nb) nb.click(); render(); }
      });
      bar.insertBefore(b, bar.firstChild);
    }
    let nav = null;
    try { nav = _cgTourSteps[_cgTourStep] && _cgTourSteps[_cgTourStep].nav; } catch (e) {}
    ensure().then(() => {
      const ls = nav ? lessonForNav(nav) : lessonById('start');
      b.hidden = !ls;
      if (!ls) return;
      b.dataset.lesson = ls.id;
      b.textContent = ui('tour_lesson', { lesson: tx('lessons.' + ls.id + '.title') });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     WIRING INTO THE APP
     ═══════════════════════════════════════════════════════════════ */
  // The guide takes over the old guide renderer (dcRenderChartsGuideView); its
  // content now lives in the Getting started lesson and the Reference tab
  function install() {
    wrapFns();
    watchOpens();
    if (typeof window.dcRenderChartsGuideView === 'function' && !window.dcRenderChartsGuideView._gd) {
      const r = function () { render(); };
      r._gd = true;
      window.dcRenderChartsGuideView = r;
    }
    // Deep links: #t=chartsguide/lesson-week opens a lesson, /reference the Reference
    // tab, and any old section name (e.g. /faq) opens Reference at that section
    if (typeof window.dcGuideJump === 'function' && !window.dcGuideJump._gd) {
      const j = function (slug) {
        if (/^lesson-/.test(slug)) { view.page = 'lesson'; view.lesson = slug.slice(7); render(); return; }
        // The old Start Here chapter is the Getting started lesson now
        if (slug === 'start') { view.page = 'lesson'; view.lesson = 'start'; render(); return; }
        view.page = 'ref';
        ensure().then(() => { renderHub('ref'); if (slug !== 'reference') setTimeout(() => refJump(slug), 80); });
      };
      j._gd = true;
      window.dcGuideJump = j;
    }
    if (typeof window.dcGateChoose === 'function' && !window.dcGateChoose._gd) {
      const gate = window.dcGateChoose;
      const g = function (mode) {
        gate.apply(this, arguments);
        if (mode === 'guide') { view.page = 'lesson'; view.lesson = 'start'; render(); }
      };
      g._gd = true;
      window.dcGateChoose = g;
    }
    if (typeof window._dcApplyTourStep === 'function' && !window._dcApplyTourStep._gd) {
      const apply = window._dcApplyTourStep;
      const a = function () { const r = apply.apply(this, arguments); tourLessonBtn(); return r; };
      a._gd = true;
      window._dcApplyTourStep = a;
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
