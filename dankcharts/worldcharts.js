/* ===========================================================================
   WORLD CHARTS - THE REAL CHARTS EVERYONE ELSE IS LISTENING TO
   ===========================================================================
   Plan: WORLDCHARTS-PLAN.md (repo root).

   The rows come from our own Cloudflare Function, functions/world-charts.js,
   which reads billboard.com and kworb.net (neither can be read from the
   browser) and returns small JSON:
     GET /world-charts?chart=list        → the chart menu
     GET /world-charts?chart=<id>        → one chart (see the function's header
                                           comment for every field)

   Step 3 (this file's first version): the tab itself. The chart buttons,
   loading / error / "old copy" states, and a plain list of the rows.
   Step 4 gives the rows the site's chart look, step 5 adds "your plays" on every
   row, and step 6 adds past weeks for Billboard.

   The tab needs no sign-in and no data source: it only shows public charts.
   That's why #worldchartsView sits outside #mainApp, like the Dank 100 and the
   Board.

   app.js switches tabs. When this tab opens it calls dcWorldCharts.show(),
   and when another opens it calls hide().
   =========================================================================== */

(function () {
  // On localhost there is no Cloudflare Function, so ask the live site (the
  // function sends Access-Control-Allow-Origin: *). Same switch as dank100.js.
  var API = (typeof location !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\]|)$/.test(location.hostname))
    ? 'https://dankcharts.fm' : '';

  // The menu, used until /world-charts?chart=list answers (and if it never
  // does), so the buttons are there straight away. Keep in step with CHARTS
  // in functions/world-charts.js.
  var FALLBACK_MENU = [
    { id: 'hot-100',               source: 'billboard', kind: 'songs',  period: 'week' },
    { id: 'billboard-200',         source: 'billboard', kind: 'albums', period: 'week' },
    { id: 'spotify-global-daily',  source: 'kworb',     kind: 'songs',  period: 'day'  },
    { id: 'spotify-global-weekly', source: 'kworb',     kind: 'songs',  period: 'week' },
    { id: 'youtube-top',           source: 'kworb',     kind: 'videos', period: 'day'  }
  ];

  var LS_CHART = 'dc_wc_chart';            // the chart you looked at last
  var KEEP_MS = 30 * 60 * 1000;            // a loaded chart is reused for 30 min
  var STEP = 50;                           // rows shown before "Show all"

  var S = {
    active: false,
    menu: FALLBACK_MENU,
    chart: null,                           // id of the chart on screen
    cache: {},                             // id -> { at, data }
    loading: false,
    err: false,
    all: false                             // "Show all" pressed
  };

  // ── Small helpers ──
  function tr(key, vars) {
    try { if (typeof t === 'function') return t(key, vars); } catch (e) {}
    return key;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function locale() { try { if (typeof _lsLocale === 'function') return _lsLocale(); } catch (e) {} return undefined; }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function fmtNum(n) { return n == null ? '' : Number(n).toLocaleString(locale()); }
  // Chart dates are plain days ("2026-11-07"), so they're shown in UTC so they
  // don't slip a day west of Greenwich.
  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00Z');
    if (isNaN(d)) return '';
    return d.toLocaleDateString(locale(), { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  }
  // Every chart's name comes from the translations (wc_chart_<id>), so the
  // buttons follow the site language. Brand names stay as they are.
  function chartName(id) { return tr('wc_chart_' + id.replace(/-/g, '_')); }

  function pickStart() {
    var saved = lsGet(LS_CHART);
    var ids = S.menu.map(function (c) { return c.id; });
    return ids.indexOf(saved) >= 0 ? saved : ids[0];
  }

  // ── Loading ──
  function loadMenu() {
    fetch(API + '/world-charts?chart=list')
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (j) {
        // Only charts this file knows a name for, so a chart added to the
        // function shows up once its translation is added too.
        var known = (j.charts || []).filter(function (c) { return tr('wc_chart_' + c.id.replace(/-/g, '_')) !== 'wc_chart_' + c.id.replace(/-/g, '_'); });
        if (known.length) { S.menu = known; if (S.active) render(); }
      })
      .catch(function () { /* keep the fallback menu */ });
  }

  function loadChart(id, force) {
    var hit = S.cache[id];
    if (!force && hit && Date.now() - hit.at < KEEP_MS) { S.err = false; render(); return; }
    S.loading = true; S.err = false;
    render();
    fetch(API + '/world-charts?chart=' + encodeURIComponent(id))
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (j) {
        if (!j || !j.rows || !j.rows.length) throw new Error('empty');
        S.cache[id] = { at: Date.now(), data: j };
      })
      .catch(function () { if (S.chart === id) S.err = true; })
      .then(function () { if (S.chart === id) { S.loading = false; render(); } });
  }

  // ── Drawing ──
  function menuHTML() {
    // Grouped by where the chart comes from: Billboard | Spotify | YouTube
    return '<div class="wc-menu" role="tablist" aria-label="' + esc(tr('wc_title')) + '">' +
      S.menu.map(function (c) {
        var on = c.id === S.chart;
        return '<button type="button" role="tab" class="wc-pick wc-pick--' + esc(brandOf(c.id)) + (on ? ' active' : '') +
          '" aria-selected="' + on + '" onclick="dcWorldCharts.pick(\'' + esc(c.id) + '\')">' +
          '<span class="wc-pick-brand">' + esc(brandName(c.id)) + '</span>' +
          '<span class="wc-pick-name">' + esc(chartName(c.id)) + '</span></button>';
      }).join('') + '</div>';
  }
  function brandOf(id) { return /^spotify/.test(id) ? 'spotify' : /^youtube/.test(id) ? 'youtube' : 'billboard'; }
  function brandName(id) { return { billboard: 'Billboard', spotify: 'Spotify', youtube: 'YouTube' }[brandOf(id)]; }

  function statusHTML(d) {
    var h = '';
    if (d && d.stale) {
      h += '<p class="wc-note wc-note--stale">' + esc(tr('wc_stale')) + '</p>';
    }
    return h;
  }

  function sourceHTML(d) {
    // "Source: Billboard · Week of November 7, 2026"
    var when = d.date ? tr(d.period === 'day' ? 'wc_day_of' : 'wc_week_of', { date: fmtDate(d.date) }) : '';
    return '<p class="wc-source">' + esc(tr('wc_source')) + ' <a href="' + esc(d.sourceUrl) +
      '" target="_blank" rel="noopener">' + esc(d.source) + '</a>' + (when ? ' · ' + esc(when) : '') + '</p>';
  }

  // Plain rows for now. Step 4 replaces this with the site's chart look.
  function listHTML(d) {
    var rows = S.all ? d.rows : d.rows.slice(0, STEP);
    var h = '<ol class="wc-list">' + rows.map(function (r) {
      var sub = r.artist || '';
      if (r.feat && r.feat.length) sub += ' ' + tr('wc_with', { names: r.feat.join(', ') });
      return '<li class="wc-row"><span class="wc-rank">' + r.rank + '</span>' +
        '<span class="wc-text"><span class="wc-t">' + esc(r.title) + '</span>' +
        (sub ? '<span class="wc-a">' + esc(sub) + '</span>' : '') + '</span></li>';
    }).join('') + '</ol>';
    if (d.rows.length > rows.length) {
      h += '<button type="button" class="dc-btn dc-btn-normal wc-more" onclick="dcWorldCharts.showAll()">' +
        esc(tr('wc_show_all', { n: d.rows.length })) + '</button>';
    }
    return h;
  }

  function bodyHTML() {
    var hit = S.cache[S.chart];
    var d = hit && hit.data;
    if (S.err && !d) {
      return '<div class="wc-msg"><p>' + esc(tr('wc_err')) + '</p>' +
        '<button type="button" class="dc-btn dc-btn-normal dc-btn-sm" onclick="dcWorldCharts.reload()">' + esc(tr('wc_retry')) + '</button></div>';
    }
    if (!d) {
      // Loading: a few grey rows, so the page doesn't jump when the chart lands
      var sk = '';
      for (var i = 0; i < 8; i++) sk += '<li class="wc-row wc-row--sk"><span class="wc-rank"></span><span class="wc-text"><span class="wc-t"></span><span class="wc-a"></span></span></li>';
      return '<p class="wc-source wc-source--sk">' + esc(tr('wc_loading')) + '</p><ol class="wc-list" aria-hidden="true">' + sk + '</ol>';
    }
    return statusHTML(d) + sourceHTML(d) + listHTML(d);
  }

  function viewHTML() {
    var h = '<div class="wc-section">';
    h += '<div class="section-header wc-page-header"><h2 class="section-header-h2">' +
      (typeof window.dcGlowIco === 'function' ? window.dcGlowIco('world') : '') +
      '<span>' + esc(tr('wc_title')) + '</span></h2>' +
      '<div class="section-rule"></div></div>';
    h += '<p class="wc-page-sub">' + esc(tr('wc_sub')) + '</p>';
    h += menuHTML();
    h += '<section class="wc-chart" aria-live="polite" aria-busy="' + (S.loading ? 'true' : 'false') + '">' + bodyHTML() + '</section>';
    h += '</div>';
    return h;
  }

  function render() {
    var root = document.getElementById('worldchartsView');
    if (!root || !S.active) return;
    root.innerHTML = viewHTML();
  }

  // ── Actions ──
  function pick(id) {
    if (!S.menu.some(function (c) { return c.id === id; })) return;
    S.chart = id; S.all = false; S.err = false;
    lsSet(LS_CHART, id);
    loadChart(id);
  }

  function show() {
    S.active = true;
    if (!S.chart) S.chart = pickStart();
    loadMenu();
    loadChart(S.chart);
  }
  function hide() { S.active = false; }

  // ── Exports ──
  window.dcWorldCharts = {
    show: show,
    hide: hide,
    rerender: render,
    pick: pick,
    reload: function () { loadChart(S.chart, true); },
    showAll: function () { S.all = true; render(); }
  };
})();
