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

   Step 3: the tab itself. The chart buttons and the loading / error /
   "old copy" states.
   Step 4: the rows in the site's chart look, reusing The Dank 100's row
   classes (d100-li / d100-row / d100-art …) with wc-* additions for the
   per-source number columns.
   Step 5: "your plays" on every row (matched in allPlays, see the step 5
   block below), a filter for rows you know / don't, and clicking a row you
   know opens its window.
   Step 6: past weeks for the Billboard charts (week picker, "Latest week",
   and a link to your own Weekly chart for the days Billboard counted). Kworb
   has no history pages, so its charts only show the current one.
   Step 7: a sample (▶), Spotify and YouTube button beside every row, and a
   "Share top 10" picture of the chart with how many of them you've played.

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
    { id: 'hot-100',               source: 'billboard', kind: 'songs',  period: 'week', pastWeeks: true, first: '1958-08-04' },
    { id: 'billboard-200',         source: 'billboard', kind: 'albums', period: 'week', pastWeeks: true, first: '1963-08-17' },
    { id: 'billboard-global-200',  source: 'billboard', kind: 'songs',  period: 'week', pastWeeks: true, first: '2020-09-19' },
    { id: 'spotify-global-daily',  source: 'kworb',     kind: 'songs',  period: 'day'  },
    { id: 'spotify-global-weekly', source: 'kworb',     kind: 'songs',  period: 'week' },
    { id: 'youtube-top',           source: 'kworb',     kind: 'videos', period: 'day'  }
  ];

  var LS_CHART = 'dc_wc_chart';            // the chart you looked at last
  var LS_RANGE = 'dc_wc_range';            // 'all' | 'week': which plays the badges count
  var KEEP_MS = 30 * 60 * 1000;            // a loaded chart is reused for 30 min
  var STEP = 50;                           // rows shown before "Show all"
  var WEEK_MS = 7 * 86400000;
  var TYPE_WAIT = 700;                     // ms after typing in the date box before the week loads

  var S = {
    active: false,
    menu: FALLBACK_MENU,
    chart: null,                           // id of the chart on screen
    cache: {},                             // ckey(id, date) -> { at, data }
    date: null,                            // step 6: the Billboard week on screen, null = the latest
    latest: {},                            // id -> date of its latest chart, once known
    loading: false,
    err: false,
    all: false,                            // "Show all" pressed
    filter: 'all',                         // 'all' | 'known' | 'new' (step 5)
    range: null                            // 'all' | 'week', read from LS_RANGE on first show
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

  // ── Step 6: past weeks ──
  // Chart dates are "YYYY-MM-DD" strings, stepped in UTC so no time zone can
  // move them a day.
  function isoAdd(iso, days) {
    var d = new Date(iso + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  }
  function todayIso() { return new Date().toISOString().slice(0, 10); }
  // The same day at local midnight, to compare with the time of a play
  function localDay(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  // A chart's menu entry. Fields the server's menu leaves out (an older
  // function without `first`, say) come from FALLBACK_MENU.
  function chartDef(id) {
    var fb = null, m = null, i;
    for (i = 0; i < FALLBACK_MENU.length; i++) if (FALLBACK_MENU[i].id === id) fb = FALLBACK_MENU[i];
    for (i = 0; i < S.menu.length; i++) if (S.menu[i].id === id) m = S.menu[i];
    if (!m) return fb;
    var out = {}, k;
    if (fb) for (k in fb) out[k] = fb[k];
    for (k in m) if (m[k] != null) out[k] = m[k];
    return out;
  }
  function hasPast(id) { var c = chartDef(id); return !!(c && c.pastWeeks); }
  // The week to ask for: only Billboard charts have past weeks, and never
  // before the chart's first week (Hot 100 and Billboard 200 started apart,
  // and both share S.date)
  function dateFor(id) {
    if (!hasPast(id) || !S.date) return null;
    var first = chartDef(id).first;
    return first && S.date < first ? first : S.date;
  }
  function ckey(id, date) { return id + (date ? '@' + date : ''); }
  function current() { var hit = S.cache[ckey(S.chart, dateFor(S.chart))]; return hit && hit.data; }

  // Billboard counts a chart's plays in the week ending the Thursday 9 days
  // before its date: the chart of Saturday Nov 7 covers Fri Oct 23 – Thu Oct 29.
  // (Before 1962 charts were dated Mondays; this is close enough for those.)
  function trackingDays(d) {
    if (!d || !d.date || brandOf(d.chart) !== 'billboard') return null;
    return { from: isoAdd(d.date, -15), to: isoAdd(d.date, -9) };
  }

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
    var date = dateFor(id), key = ckey(id, date);
    var hit = S.cache[key];
    // A past week never changes, so it's reused for as long as the page is open
    if (!force && hit && (date || Date.now() - hit.at < KEEP_MS)) { S.err = false; render(); return; }
    S.loading = true; S.err = false;
    render();
    fetch(API + '/world-charts?chart=' + encodeURIComponent(id) + (date ? '&date=' + date : ''))
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (j) {
        if (!j || !j.rows || !j.rows.length) throw new Error('empty');
        var entry = { at: Date.now(), data: j };
        S.cache[key] = entry;
        if (!date && j.date) S.latest[id] = j.date;
        if (date && j.date) {
          // Billboard moves any day to its chart week (Wed Oct 28 → Sat Oct
          // 31), so the picker follows to the chart's real date. Landing on
          // the latest week counts as "latest".
          var isLatest = S.latest[id] && j.date >= S.latest[id];
          S.cache[ckey(id, j.date)] = entry;
          if (isLatest) S.cache[ckey(id, null)] = entry;
          if (S.date === date) S.date = isLatest ? null : j.date;
        }
      })
      .catch(function () { if (S.chart === id && dateFor(id) === date) S.err = true; })
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
          brandHTML(c.id) +
          '<span class="wc-pick-name">' + esc(chartName(c.id)) + '</span></button>';
      }).join('') + '</div>';
  }
  function brandOf(id) { return /^spotify/.test(id) ? 'spotify' : /^youtube/.test(id) ? 'youtube' : 'billboard'; }
  function brandName(id) { return { billboard: 'Billboard', spotify: 'Spotify', youtube: 'YouTube' }[brandOf(id)]; }
  // The top line of a chart button: the source's logo (2026-11-09). Spotify
  // and YouTube use the same icons as the row buttons (app.js); Billboard is
  // its name in lowercase bold, the way it writes itself.
  function brandHTML(id) {
    var b = brandOf(id);
    if (b === 'billboard') return '<span class="wc-pick-brand wc-pick-brand--word">billboard</span>';
    var svg = b === 'spotify' ? (typeof _EA_SP_SVG !== 'undefined' ? _EA_SP_SVG : '')
      : (typeof _ST_AM_YT_SVG !== 'undefined' ? _ST_AM_YT_SVG : '');
    return '<span class="wc-pick-brand"><span class="wc-pick-logo">' + svg + '</span>' + esc(brandName(id)) + '</span>';
  }

  function statusHTML(d) {
    var h = '';
    if (d && d.stale) {
      h += '<p class="wc-note wc-note--stale">' + esc(tr('wc_stale')) + '</p>';
    }
    return h;
  }

  // ── Step 6: the week picker (Billboard charts only) ──
  //   ‹  [ date box ]  ›   Latest week            Your chart that week →
  // The date box takes any day; Billboard moves it to that day's chart week.
  function weekNavHTML(d) {
    if (!hasPast(S.chart)) return '';
    var c = chartDef(S.chart);
    var cur = (d && d.date) || dateFor(S.chart) || S.latest[S.chart] || '';
    var max = S.latest[S.chart] || todayIso();
    var prevOk = !!cur && !(c.first && cur <= c.first);
    var nextOk = !!S.date;
    var h = '<div class="wc-weekbar"><div class="d100-weeknav wc-weeknav">';
    h += '<button type="button" class="d100-wk-btn" aria-label="' + esc(tr('d100_prev_week')) + '"' + (prevOk ? '' : ' disabled') +
      ' onclick="dcWorldCharts.stepWeek(-1)">‹</button>';
    h += '<input type="date" class="d100-wk-select wc-wk-date" aria-label="' + esc(tr('d100_pick_week')) + '"' +
      ' value="' + esc(cur) + '" min="' + esc(c.first || '') + '" max="' + esc(max) + '"' +
      ' oninput="dcWorldCharts.typeDate(this.value)">';
    h += '<button type="button" class="d100-wk-btn" aria-label="' + esc(tr('d100_next_week')) + '"' + (nextOk ? '' : ' disabled') +
      ' onclick="dcWorldCharts.stepWeek(1)">›</button>';
    if (S.date) h += '<button type="button" class="d100-link wc-latest" onclick="dcWorldCharts.pickDate(\'\')">' + esc(tr('wc_latest')) + '</button>';
    h += '</div>' + yourWeekHTML(d) + '</div>';
    return h;
  }

  // "Your chart that week →": your own Weekly chart for the days Billboard
  // counted. Only when you have plays from then.
  function yourWeekHTML(d) {
    var days = trackingDays(d);
    if (!days || !hasLibrary() || typeof goToWeek !== 'function') return '';
    var first = libIndex(rangeWin(null)).first;
    if (!first || +localDay(days.to) + 86400000 <= first) return '';
    var tip = tr('wc_counted', { from: fmtDate(days.from), to: fmtDate(days.to) });
    return '<button type="button" class="d100-link wc-yourweek" title="' + esc(tip) + '" onclick="dcWorldCharts.myWeek()">' +
      esc(tr('wc_your_week')) + ' →</button>';
  }

  // Opens your Weekly chart for the week (by your own week start) that holds
  // the middle of Billboard's counted days.
  function goMyWeek() {
    var days = trackingDays(current());
    if (!days) return;
    var mid = localDay(isoAdd(days.from, 3));
    var wsd = typeof weekStartDay === 'number' ? weekStartDay : 0;
    var start = new Date(mid.getFullYear(), mid.getMonth(), mid.getDate() - (mid.getDay() - wsd + 7) % 7);
    var off = typeof weekOffset === 'function' ? Math.max(0, weekOffset(start)) : 0;
    // The tab switch (app.js) saves currentOffset under the tab it opens when
    // it leaves this page, then reads it back, so set both
    try { currentOffset = off; savedOffsets.week = off; } catch (e) {}
    var btn = document.querySelector('#periodNav button[data-period="week"]');
    if (btn) { btn.click(); window.scrollTo(0, 0); }
  }

  function sourceHTML(d) {
    // "Source: Billboard · Week of November 7, 2026"
    var when = d.date ? tr(d.period === 'day' ? 'wc_day_of' : 'wc_week_of', { date: fmtDate(d.date) }) : '';
    return '<div class="wc-srcbar"><p class="wc-source">' + esc(tr('wc_source')) + ' <a href="' + esc(d.sourceUrl) +
      '" target="_blank" rel="noopener">' + esc(d.source) + '</a>' + (when ? ' · ' + esc(when) : '') + '</p>' +
      // Step 7: the chart's top 10 as a picture
      '<button type="button" class="dc-btn dc-btn-normal dc-btn-sm wc-share-btn" onclick="dcWorldCharts.share(this)">' +
      esc(tr('d100_share')) + '</button></div>';
  }

  // ── Step 4: the rows in the site's chart look ──
  // Same layout as The Dank 100's rows: position | move badge | cover |
  // title + artist | the chart's own numbers. Which numbers depends on the
  // source, so each source has a column set:
  //   billboard: Last wk | Peak | Weeks
  //   spotify:   Streams | Change | Peak | Days or Weeks
  //   youtube:   Views | Likes
  // On phones only the first column marked `phone` stays, written short (5.1M).
  function colsFor(d) {
    var brand = brandOf(d.chart);
    if (brand === 'billboard') return [
      { key: 'd100_col_lw', val: function (r) { return r.last || '–'; } },
      { key: 'd100_col_pk', val: function (r) { return r.peak; } },
      { key: 'd100_col_wk', val: function (r) { return r.onChart; }, phone: true }
    ];
    if (brand === 'spotify') return [
      { key: 'wc_col_streams', val: function (r) { return fmtNum(r.streams); }, short: function (r) { return fmtShort(r.streams); }, phone: true, wide: true },
      { key: 'wc_col_change', val: changeHTML, html: true },
      { key: 'd100_col_pk', val: function (r) { return r.peak; } },
      { key: d.period === 'day' ? 'wc_col_days' : 'd100_col_wk', val: function (r) { return r.onChart; } }
    ];
    return [
      { key: 'wc_col_views', val: function (r) { return fmtNum(r.views); }, short: function (r) { return fmtShort(r.views); }, phone: true, wide: true },
      { key: 'wc_col_likes', val: function (r) { return fmtNum(r.likes); }, wide: true }
    ];
  }

  // 5,075,633 → "5.1M" (in the site language's own short form)
  function fmtShort(n) {
    if (n == null) return '';
    try { return new Intl.NumberFormat(locale(), { notation: 'compact', maximumFractionDigits: 1 }).format(n); }
    catch (e) { return fmtNum(n); }
  }
  // Spotify's stream change since the day / week before, coloured up or down
  function changeHTML(r) {
    var c = r.streamsChange;
    if (c == null || r.status) return '<span class="wc-chg">–</span>';
    var up = c >= 0;
    return '<span class="wc-chg wc-chg--' + (up ? 'up' : 'down') + '">' + (up ? '+' : '−') + esc(fmtShort(Math.abs(c))) + '</span>';
  }

  // ▲3 / ▼2 / = / NEW / RE, the same badges as The Dank 100
  function moveHTML(r, d) {
    if (r.status === 'new') return '<span class="d100-mv d100-mv-new">' + esc(tr(d.kind === 'albums' ? 'badge_new' : 'badge_new_songs')) + '</span>';
    if (r.status === 're') return '<span class="d100-mv d100-mv-re">' + esc(tr('badge_re')) + '</span>';
    if (r.last == null) return '';
    var diff = r.last - r.rank;
    if (!diff) return '<span class="d100-mv d100-mv-same" aria-label="=">=</span>';
    return '<span class="d100-mv ' + (diff > 0 ? 'd100-mv-up">▲' : 'd100-mv-down">▼') + Math.abs(diff) + '</span>';
  }

  function initials(s) {
    return String(s || '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase() || '♪';
  }

  // The cover. Billboard sends its own, and for YouTube the video's thumbnail
  // is the cover. Anything else (Spotify rows, Billboard rows with no cover)
  // is looked up lazily the same way the rest of the site finds artwork
  // (getArtAuto in app.js), once the row scrolls near the screen.
  function artHTML(r, d) {
    var src = r.image || (r.videoId ? 'https://i.ytimg.com/vi/' + r.videoId + '/mqdefault.jpg' : '');
    var h = '<span class="d100-art wc-art' + (r.videoId ? ' wc-art--video' : '') + '"';
    if (!src) h += ' data-art="' + (d.kind === 'albums' ? 'album' : 'song') + '" data-t="' + esc(r.title) + '" data-a="' + esc(r.artist || '') + '"';
    h += '><span class="d100-art-ini" aria-hidden="true">' + esc(initials(r.title)) + '</span>';
    if (src) h += '<img src="' + esc(src) + '" alt="" loading="lazy" decoding="async" onload="this.parentNode.classList.add(\'has-img\')">';
    return h + '</span>';
  }

  // Billboard rows say where they first charted: shown on hover
  function debutTitle(r) {
    if (!r.debutPos || !r.debutDate) return '';
    return tr('wc_debut', { pos: r.debutPos, date: fmtDate(r.debutDate) });
  }

  // m: the row's match in your plays (step 5): { n, key, type }, null (not in
  // your library) or undefined (no library to look in)
  function rowHTML(r, d, cols, m) {
    var sub = r.artist || '';
    if (r.feat && r.feat.length) sub += ' ' + tr('wc_with', { names: r.feat.join(', ') });
    // The #1 row says how long it has been there (Billboard: weeks at #1;
    // Spotify: days or weeks at its peak, which for #1 is #1)
    var atOne = r.rank === 1 && r.peak === 1 && r.atPeak > 1
      ? '<span class="wc-at1">' + esc(tr(d.period === 'day' ? 'wc_at_one_days' : 'wc_at_one', { n: r.atPeak })) + '</span>' : '';
    var tip = debutTitle(r);
    var h = '<li class="d100-li wc-li' + (r.rank === 1 ? ' d100-row-1' : '') + (m ? ' wc-li--mine' : '') + '"' + (tip ? ' title="' + esc(tip) + '"' : '') + '>';
    // A row you've played opens its window from your library when clicked
    h += m && m.key
      ? '<div class="d100-row wc-row wc-row--open" role="button" tabindex="0" data-type="' + m.type + '" data-key="' + esc(m.key) + '"' +
        ' aria-label="' + esc(tr('wc_open_hint') + ': ' + r.title) + '"' +
        ' onclick="dcWorldCharts.openRow(this)" onkeydown="dcWorldCharts.rowKey(event, this)">'
      : '<div class="d100-row wc-row">';
    h += '<span class="d100-pos">' + r.rank + '</span>';
    h += '<span class="d100-move">' + moveHTML(r, d) + '</span>';
    h += artHTML(r, d);
    h += '<span class="d100-name"><span class="d100-t">' + esc(r.title) + atOne + '</span>' +
      (sub ? '<span class="d100-a">' + esc(sub) + '</span>' : '') + mineHTML(m) + '</span>';
    cols.forEach(function (c) {
      var v = c.val(r);
      h += '<span class="d100-num wc-num' + (c.phone ? ' wc-num--phone' : '') + '">' +
        (c.html ? v : (c.short ? '<span class="wc-full">' + esc(v) + '</span><span class="wc-short">' + esc(c.short(r)) + '</span>' : esc(v))) +
        '</span>';
    });
    h += '</div>' + actsHTML(r, d) + '</li>';
    return h;
  }

  // ── Step 7: a row's three buttons, the same as The Dank 100's: play a
  // sample (app.js's sample player, never YouTube), open it on the music
  // service the user picked, and YouTube. They sit beside the row (the row
  // itself can be a button). The data-ea-* attributes live on this little box
  // only, so the sample player reads the entry from here and right-clicking
  // the row doesn't open the library's ⋮ menu for a song never played.
  // Rows that carry their own id link straight to it: Spotify charts to the
  // track, YouTube charts to the video.
  function actsHTML(r, d) {
    if (typeof _eaSampleBtn !== 'function') return '';
    var type = d.kind === 'albums' ? 'albums' : 'songs';
    var artist = r.artist || '';
    var q = encodeURIComponent(artist ? r.title + ' ' + artist : (r.raw || r.title));
    var yt = esc(tr(r.videoId ? 'wc_yt_watch' : 'awx_yt'));
    var ytUrl = r.videoId ? 'https://www.youtube.com/watch?v=' + encodeURIComponent(r.videoId)
      : 'https://www.youtube.com/results?search_query=' + q;
    var sp = typeof _eaSpotifyBtn === 'function' ? _eaSpotifyBtn(type, r.title, artist) : '';
    // A Spotify chart row opens its own track when the user listens on Spotify
    if (r.spotifyId && sp && /open\.spotify\.com/.test(sp)) {
      sp = sp.replace(/href="[^"]*"/, 'href="https://open.spotify.com/track/' + esc(encodeURIComponent(r.spotifyId)) + '"');
    }
    return '<span class="d100-acts wc-acts" data-ea-type="' + type + '"' +
      ' data-ea-title="' + esc(type === 'songs' ? r.title : '') + '" data-ea-artist="' + esc(artist) + '"' +
      ' data-ea-album="' + esc(type === 'albums' ? r.title : '') + '" data-ea-key="' + esc('wc:' + d.chart + ':' + r.rank) + '">' +
      _eaSampleBtn() + sp +
      '<a class="d100-yt" href="' + esc(ytUrl) + '" target="_blank" rel="noopener"' +
      ' title="' + yt + '" aria-label="' + yt + '">' + (typeof _ST_AM_YT_SVG !== 'undefined' ? _ST_AM_YT_SVG : '▶') + '</a>' +
      '</span>';
  }

  function listHTML(d) {
    // Step 5: each row with its match, then the filter (All / Played / New to you)
    var list = withMatches(d);
    var shownList = list.filter(function (x) {
      return S.filter === 'known' ? x.m : S.filter === 'new' ? x.m === null : true;
    });
    if (!hasLibrary()) shownList = list;
    var rows = S.all ? shownList : shownList.slice(0, STEP);
    var cols = colsFor(d);
    var brand = brandOf(d.chart);
    // The column labels, lined up with the numbers below them
    var h = mineBarHTML(d, list);
    if (!rows.length) {
      return h + '<p class="wc-msg">' + esc(tr(S.filter === 'known' ? 'wc_none_known' : 'wc_none_new')) + '</p>';
    }
    h += '<div class="d100-cols wc-cols" aria-hidden="true"><span></span><span></span><span></span><span></span>' +
      cols.map(function (c) { return '<span class="wc-num' + (c.phone ? ' wc-num--phone' : '') + '">' + esc(tr(c.key)) + '</span>'; }).join('') + '</div>';
    h += '<ol class="d100-list wc-list wc-list--' + brand + '">' + rows.map(function (x) { return rowHTML(x.r, d, cols, x.m); }).join('') + '</ol>';
    if (shownList.length > rows.length) {
      h += '<button type="button" class="dc-btn dc-btn-normal wc-more" onclick="dcWorldCharts.showAll()">' +
        esc(tr('wc_show_all', { n: shownList.length })) + '</button>';
    }
    return h;
  }

  // ══ Step 5: your plays on every row ═══════════════════════════════════════
  // Each chart row is looked up in the user's own plays (allPlays, which every
  // data source fills the same way: Last.fm, Google Sheets, CSV). Names are
  // matched with The Dank 100's match keys (dcDank100.songMatchKey etc.):
  // accents, case, punctuation and "(feat. X)" don't matter.
  //
  // Charts write artists in their own way ("Tame Impala & JENNIE",
  // "Karol G With Judeline & rusowsky", "Shakira, Burna Boy"), and a library
  // may credit any one of them. So the library is indexed under every
  // credited artist of a play, and a chart row tries its whole artist string
  // and then each artist named in it.
  //
  // YouTube rows are video titles. When the proxy couldn't split out an
  // artist (or the split one doesn't match), a row also counts as yours if
  // one of your artists AND one of their songs both appear in the full title.

  // Built once per library (and range), rebuilt when the plays change.
  var _lib = { tag: null, idx: {} };

  // Step 6: which plays a badge counts: all of them, the last 7 days, or (on
  // a past Billboard week) the days Billboard counted for that chart.
  // → { key, from, to } in ms (to is exclusive)
  function rangeWin(d) {
    if (S.range !== 'week' || !d) return { key: 'all', from: -Infinity, to: Infinity };
    var days = S.date && trackingDays(d);
    if (days) return { key: days.from, from: +localDay(days.from), to: +localDay(days.to) + 86400000 };
    return { key: 'week', from: Date.now() - WEEK_MS, to: Infinity };
  }
  function pastWeekRange(d) { return S.range === 'week' && !!(S.date && trackingDays(d)); }

  function libPlays() { return (typeof allPlays !== 'undefined' && allPlays) || []; }
  function hasLibrary() { return libPlays().length > 0 && !!window.dcDank100; }

  function libIndex(win) {
    var P = libPlays();
    var tag = P.length + '|' + (P[0] ? +P[0].date : '') + '|' + (typeof _stampEpoch !== 'undefined' ? _stampEpoch : '');
    if (_lib.tag !== tag) _lib = { tag: tag, idx: {} };
    if (_lib.idx[win.key]) return _lib.idx[win.key];

    var D = window.dcDank100;
    var msFn = typeof msOf === 'function' ? msOf : function (p) { return +p.date; };
    var from = win.from, to = win.to, limited = from > -Infinity || to < Infinity;
    var first = Infinity;                  // time of your first play (for "Your chart that week")
    var songs = new Map(), albums = new Map(), byArtist = new Map();

    // n = plays; key = the site's own song/album key, to open its window;
    // keyN tracks which spelling of the site key has the most plays.
    function add(map, mk, siteKey) {
      var r = map.get(mk);
      if (!r) { r = { n: 0, keys: {} }; map.set(mk, r); }
      r.n++;
      if (siteKey) r.keys[siteKey] = (r.keys[siteKey] || 0) + 1;
    }

    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      if (!p.title || !p.artist) continue;
      var ms = msFn(p);
      if (ms < first) first = ms;
      if (limited && !(ms >= from && ms < to)) continue;
      var credits = p.artists && p.artists.length ? p.artists : [p.artist];
      var sk = typeof songKey === 'function' ? songKey(p) : '';
      var ak = p.album && p.album !== '—' && typeof albumKeyOf === 'function' ? albumKeyOf(p) : '';
      // The whole credit string too, so "A & B" on a chart matches "A & B" here
      var names = credits.indexOf(p.artist) >= 0 ? credits : credits.concat([p.artist]);
      for (var j = 0; j < names.length; j++) {
        if (!names[j]) continue;
        add(songs, D.songMatchKey(p.title, names[j]), sk);
        if (ak) add(albums, D.albumMatchKey(p.album, names[j]), ak);
        // For YouTube titles: artist → their song title keys
        var arK = D.artistMatchKey(names[j]);
        var tk = D.songMatchKey(p.title, '').replace(/\|$/, '');
        if (arK.length >= 2 && tk.length >= 2) {
          var set = byArtist.get(arK);
          if (!set) { set = new Map(); byArtist.set(arK, set); }
          set.set(tk, D.songMatchKey(p.title, names[j]));
        }
      }
    }
    return (_lib.idx[win.key] = { songs: songs, albums: albums, byArtist: byArtist, first: first < Infinity ? first : 0 });
  }

  // "Karol G With Judeline & rusowsky" → ["karol g with judeline and rusowsky",
  // "karol g", "judeline", "rusowsky"] (as match keys), plus any featured names.
  function artistParts(r) {
    var D = window.dcDank100, out = [];
    function push(s) { var k = D.artistMatchKey(s); if (k && out.indexOf(k) < 0) out.push(k); }
    if (r.artist) {
      push(r.artist);
      String(r.artist).split(/\s*(?:,|&|\+|\/|\bx\b|\bwith\b|\bfeat\.?|\bft\.?|\bfeaturing\b|\band\b|\by\b|\be\b)\s*/i).forEach(push);
    }
    (r.feat || []).forEach(push);
    return out;
  }

  // The most-played site key behind a match, so the right window opens
  function bestKey(rec) {
    var best = '', n = -1;
    for (var k in rec.keys) if (rec.keys[k] > n) { best = k; n = rec.keys[k]; }
    return best;
  }

  // → { n, key, type } or null
  function matchRow(r, d, idx) {
    var D = window.dcDank100;
    var parts = artistParts(r);
    var map = d.kind === 'albums' ? idx.albums : idx.songs;
    var hit = null;
    for (var i = 0; i < parts.length; i++) {
      var mk = d.kind === 'albums' ? D.albumMatchKey(r.title, parts[i]) : D.songMatchKey(r.title, parts[i]);
      var rec = map.get(mk);
      if (rec && (!hit || rec.n > hit.n)) hit = rec;
    }
    // YouTube: look for one of your artists and their song inside the raw title
    if (!hit && d.kind === 'videos' && r.raw) hit = matchRaw(r.raw, idx);
    return hit ? { n: hit.n, key: bestKey(hit), type: d.kind === 'albums' ? 'album' : 'song' } : null;
  }

  function matchRaw(raw, idx) {
    var D = window.dcDank100;
    var hay = ' ' + D.artistMatchKey(raw) + ' ';
    var best = null;
    idx.byArtist.forEach(function (titles, arK) {
      // Short names ("u2", "ok") would match by accident inside longer words,
      // so they need to stand as whole words, like every name here does
      if (arK.length < 3 || hay.indexOf(' ' + arK + ' ') < 0) return;
      titles.forEach(function (mk, tk) {
        if (tk.length < 3 || hay.indexOf(' ' + tk + ' ') < 0) return;
        var rec = idx.songs.get(mk);
        if (rec && (!best || rec.n > best.n)) best = rec;
      });
    });
    return best;
  }

  // Every row of the chart with its match, worked out once per draw
  function withMatches(d) {
    if (!hasLibrary() || d.kind === 'artists') return d.rows.map(function (r) { return { r: r, m: undefined }; });
    var idx = libIndex(rangeWin(d));
    return d.rows.map(function (r) { return { r: r, m: matchRow(r, d, idx) }; });
  }

  // The bar above the list: "You've played 37 of these 100", the filter
  // (All · Played · New to you) and which plays count (All time · Last 7 days).
  function mineBarHTML(d, list) {
    if (!hasLibrary()) {
      return '<p class="wc-note wc-note--lib">' + esc(tr('wc_no_lib')) +
        (typeof openSourceModal === 'function' ? ' <button type="button" class="d100-link" onclick="openSourceModal()">' + esc(tr('wc_connect')) + '</button>' : '') + '</p>';
    }
    var known = list.filter(function (x) { return x.m; }).length, total = list.length;
    var seg = function (cls, items, cur, fn) {
      return '<div class="dc-seg wc-seg ' + cls + '" role="group">' + items.map(function (it) {
        return '<button type="button" class="' + (cur === it[0] ? 'active' : '') + '" aria-pressed="' + (cur === it[0]) +
          '" onclick="dcWorldCharts.' + fn + '(\'' + it[0] + '\')">' + esc(it[1]) + '</button>';
      }).join('') + '</div>';
    };
    return '<div class="wc-mine">' +
      '<p class="wc-mine-sum"><strong>' + esc(tr(pastWeekRange(d) ? 'wc_you_know_that_week' : S.range === 'week' ? 'wc_you_know_week' : 'wc_you_know', { n: known, total: total })) + '</strong></p>' +
      '<div class="wc-mine-ctrls">' +
      seg('wc-seg--filter', [['all', tr('wc_filter_all') + ' ' + total], ['known', tr('wc_filter_known') + ' ' + known], ['new', tr('wc_filter_new') + ' ' + (total - known)]], S.filter, 'setFilter') +
      // On a past Billboard week, "Last 7 days" becomes "That week" (the days Billboard counted)
      seg('wc-seg--range', [['all', tr('wc_range_all')], ['week', tr(S.date && trackingDays(d) ? 'wc_range_that_week' : 'wc_range_week')]], S.range, 'setRange') +
      '</div></div>';
  }

  // The little line under a row's artist: "42 plays" or "New to you"
  function mineHTML(m) {
    if (m === undefined) return '';
    if (!m) return '<span class="wc-mine-tag wc-mine-tag--new">' + esc(tr('wc_new_to_you')) + '</span>';
    var unit = typeof tUnit === 'function' ? tUnit('plays', m.n) : (m.n === 1 ? 'play' : 'plays');
    return '<span class="wc-mine-tag wc-mine-tag--yes">' + esc(fmtNum(m.n) + ' ' + unit) + '</span>';
  }

  // Clicking a row you've played opens its window, as from All-Time (the
  // same trick as the top-bar search: the windows read currentPeriod).
  function openMine(type, key) {
    var fn = type === 'album' ? window.openAlbumModal : window.openSongModal;
    if (typeof fn !== 'function' || !key) return;
    var prev;
    try { prev = currentPeriod; currentPeriod = 'alltime'; } catch (e) { prev = undefined; }
    try { fn(key); }
    finally { if (prev !== undefined) { try { currentPeriod = prev; } catch (e) {} } }
  }

  // ══ Step 7: the share card ════════════════════════════════════════════════
  // The chart's top 10 as a 1080×1350 PNG, drawn straight onto a canvas like
  // The Dank 100's card (no html2canvas). Each source has its own colour.
  // Played rows get a "42 plays" tag and the footer says how many of the
  // whole chart you've played (with the same plays the badges count).
  // Pictures must be data URLs or the canvas can't be saved: YouTube
  // thumbnails can be read directly; Billboard's pictures can't be read by
  // other sites, so those (and Spotify rows) are looked up like the rows'
  // lazy covers (getArtAuto).
  // On phones navigator.share() needs the tap itself, so the file is drawn
  // ahead of time after each render and shared at once when it's ready.
  var BRAND_HEX = { billboard: '#ff4d5e', spotify: '#1ed760', youtube: '#ff3355' };
  var _card = { key: '', file: null, busy: null };
  function cardKey() {
    return S.chart + '|' + (dateFor(S.chart) || '') + '|' + S.range + '|' + _lib.tag + '|' +
      (typeof currentLang !== 'undefined' ? currentLang : '');
  }

  function loadCardImg(r, d) {
    if (typeof _igToDataUrl !== 'function') return Promise.resolve(null);
    var direct = r.videoId ? 'https://i.ytimg.com/vi/' + r.videoId + '/hqdefault.jpg' : '';
    var find = direct ? Promise.resolve(direct)
      : typeof getArtAuto !== 'function' ? Promise.resolve(null)
      : d.kind === 'albums' ? getArtAuto('album', r.title, r.artist || '', r.title) : getArtAuto('song', r.title, r.artist || '');
    return find.then(function (url) {
      if (!url) return null;
      return _igToDataUrl(typeof shHiResArt === 'function' ? shHiResArt(url) : url);
    }).then(function (data) {
      if (!data || !/^data:image\//.test(data)) return null;
      var img = new Image();
      img.src = data;
      return img.decode().then(function () { return img; });
    }).catch(function () { return null; });
  }

  function renderCard() {
    var d = current();
    if (!d || !d.rows || !d.rows.length) return Promise.resolve(null);
    var list = withMatches(d), top = list.slice(0, 10);
    var lib = hasLibrary() && d.kind !== 'artists';
    var known = list.filter(function (x) { return x.m; }).length;
    var brand = brandOf(d.chart), COL = BRAND_HEX[brand] || '#2dd4bf';
    var W = 1080, H = 1350;
    var cvs = document.createElement('canvas');
    cvs.width = W; cvs.height = H;
    var g = cvs.getContext('2d');
    var css = getComputedStyle(document.documentElement);
    var display = (css.getPropertyValue('--font-display') || 'sans-serif').trim();
    var sans = (css.getPropertyValue('--font-sans') || 'sans-serif').trim();
    var UP = '#4ade80', DOWN = '#fb7185';
    var fonts = Promise.all([document.fonts.load('800 100px ' + display), document.fonts.load('600 40px ' + sans)]).catch(function () {});
    return Promise.all([fonts].concat(top.map(function (x) { return loadCardImg(x.r, d); }))).then(function (res) {
      var imgs = res.slice(1);
      var clip = function (str, max) {
        str = String(str || '');
        if (g.measureText(str).width <= max) return str;
        while (str.length > 1 && g.measureText(str + '…').width > max) str = str.slice(0, -1);
        return str + '…';
      };
      var rgba = function (hex, a) {
        var n = parseInt(hex.slice(1), 16);
        return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
      };
      var pill = function (x, y, w, h, r) {
        g.beginPath();
        if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h);
      };

      // Background: deep navy with the source's colour glowing in a corner
      g.fillStyle = '#0a0f1c'; g.fillRect(0, 0, W, H);
      var glow = g.createRadialGradient(W, 0, 0, W, 0, 950);
      glow.addColorStop(0, rgba(COL, 0.30)); glow.addColorStop(1, rgba(COL, 0));
      g.fillStyle = glow; g.fillRect(0, 0, W, H);

      // Header: BILLBOARD / Hot 100 / Week of November 7, 2026
      g.textBaseline = 'alphabetic'; g.textAlign = 'left';
      g.font = '800 30px ' + sans; g.fillStyle = COL;
      g.fillText(brandName(d.chart).toUpperCase(), 80, 110);
      g.font = '800 88px ' + display; g.fillStyle = '#ffffff';
      g.fillText(clip(chartName(d.chart), W - 160), 80, 196);
      var when = d.date ? tr(d.period === 'day' ? 'wc_day_of' : 'wc_week_of', { date: fmtDate(d.date) }) : '';
      g.font = '600 30px ' + sans; g.fillStyle = 'rgba(255,255,255,0.7)';
      g.fillText(clip(when, W - 160), 80, 246);

      // Rows
      var y0 = 290, rowH = 88, art = 70;
      top.forEach(function (x, i) {
        var r = x.r, m = x.m;
        var y = y0 + i * rowH, mid = y + rowH / 2 - 4;
        if (i === 0) {
          g.fillStyle = rgba(COL, 0.14);
          pill(56, y - 4, W - 112, rowH - 6, 20); g.fill();
        }
        g.textAlign = 'right';
        g.font = '800 ' + (i === 0 ? 54 : 44) + 'px ' + display;
        g.fillStyle = i === 0 ? COL : '#ffffff';
        g.fillText(String(r.rank), 150, mid + 17);
        // Move: ▲3 / ▼2 / = / NEW / RE
        g.textAlign = 'center'; g.font = '800 22px ' + sans;
        var mv = '', mc = 'rgba(255,255,255,0.5)';
        if (r.status === 'new') { mv = tr(d.kind === 'albums' ? 'badge_new' : 'badge_new_songs'); mc = COL; }
        else if (r.status === 're') { mv = tr('badge_re'); mc = COL; }
        else if (r.last != null) {
          var diff = r.last - r.rank;
          mv = diff ? (diff > 0 ? '▲' : '▼') + Math.abs(diff) : '=';
          mc = diff > 0 ? UP : diff < 0 ? DOWN : mc;
        }
        g.fillStyle = mc; g.fillText(mv, 212, mid + 8);
        // Artwork, cropped square from the middle (video thumbnails are 16:9)
        var ax = 260, ay = mid - art / 2;
        g.save();
        pill(ax, ay, art, art, 12); g.clip();
        g.fillStyle = rgba(COL, 0.18); g.fillRect(ax, ay, art, art);
        var img = imgs[i];
        if (img) {
          var k = Math.max(art / img.naturalWidth, art / img.naturalHeight);
          var sw = art / k, sh = art / k;
          g.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, ax, ay, art, art);
        } else {
          g.textAlign = 'center'; g.font = '700 24px ' + sans; g.fillStyle = 'rgba(255,255,255,0.6)';
          g.fillText(initials(r.title), ax + art / 2, ay + art / 2 + 8);
        }
        g.restore();
        // "42 plays" on the right for rows you've played
        var tagW = 0;
        if (lib && m) {
          var unit = typeof tUnit === 'function' ? tUnit('plays', m.n) : (m.n === 1 ? 'play' : 'plays');
          var tag = fmtNum(m.n) + ' ' + unit;
          g.font = '700 24px ' + sans;
          tagW = g.measureText(tag).width + 28;
          g.fillStyle = rgba(COL, 0.18);
          pill(W - 80 - tagW, mid - 20, tagW, 40, 20); g.fill();
          g.fillStyle = COL; g.textAlign = 'center';
          g.fillText(tag, W - 80 - tagW / 2, mid + 8);
          tagW += 20;
        }
        // Title and artist
        g.textAlign = 'left';
        var tx = ax + art + 26, tw = W - tx - 80 - tagW;
        var sub = r.artist || '';
        g.font = '700 34px ' + sans; g.fillStyle = '#ffffff';
        g.fillText(clip(r.title, tw), tx, sub ? mid - 2 : mid + 12);
        if (sub) {
          g.font = '500 26px ' + sans; g.fillStyle = 'rgba(255,255,255,0.6)';
          g.fillText(clip(sub, tw), tx, mid + 32);
        }
      });

      // Footer: "You've played 37 of these 100" and the site's name
      var fy = H - 70;
      g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(80, fy - 56); g.lineTo(W - 80, fy - 56); g.stroke();
      g.textAlign = 'left'; g.font = '700 30px ' + sans; g.fillStyle = '#ffffff';
      if (lib) {
        var sum = tr(pastWeekRange(d) ? 'wc_you_know_that_week' : S.range === 'week' ? 'wc_you_know_week' : 'wc_you_know',
          { n: known, total: list.length });
        g.fillText(clip(sum, W - 160 - 260), 80, fy);
      }
      g.textAlign = 'right'; g.font = '600 28px ' + sans; g.fillStyle = 'rgba(255,255,255,0.5)';
      g.fillText('dankcharts.fm', W - 80, fy);

      return new Promise(function (res2) { cvs.toBlob(res2, 'image/png'); });
    }).then(function (blob) {
      if (!blob) return null;
      return new File([blob], 'world-charts-' + d.chart + (d.date ? '-' + d.date : '') + '.png', { type: 'image/png' });
    });
  }

  function prepareCard() {
    var key = cardKey();
    if (_card.key === key && (_card.file || _card.busy)) return _card.busy || Promise.resolve(_card.file);
    _card.key = key; _card.file = null;
    _card.busy = renderCard().then(function (f) {
      if (_card.key === key) { _card.file = f; _card.busy = null; }
      return f;
    }, function (e) { console.warn('[dankcharts] World Charts card failed:', e); if (_card.key === key) _card.busy = null; return null; });
    return _card.busy;
  }

  function shareCard(btn) {
    var ready = _card.key === cardKey() ? _card.file : null;
    if (ready && navigator.canShare && navigator.canShare({ files: [ready] })) {
      navigator.share({ files: [ready] }).catch(function () {});
      return;
    }
    var orig = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = tr('d100_share_busy'); }
    prepareCard().then(function (file) {
      if (file) {
        var a = document.createElement('a');
        a.download = file.name;
        a.href = URL.createObjectURL(file);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      }
    }).then(function () { if (btn) { btn.disabled = false; btn.textContent = orig; } });
  }

  // Only phones share files; there, draw the card while the user reads.
  var _prepTimer = null;
  function schedulePrepare() {
    if (!(navigator.canShare && current())) return;
    clearTimeout(_prepTimer);
    _prepTimer = setTimeout(function () { if (S.active) prepareCard(); }, 1500);
  }

  // ── Lazy covers (rows with no picture of their own) ──
  var _artCache = {};     // "song|title|artist" -> url, null, or a pending promise
  var _artObs = null;
  function paintArt(el, url) {
    if (!url || el.querySelector('img')) return;
    var img = new Image();
    img.alt = '';
    img.decoding = 'async';
    img.onload = function () { el.classList.add('has-img'); };
    img.src = typeof sizedArtUrl === 'function' ? sizedArtUrl(url, 96) : url;
    el.appendChild(img);
  }
  function loadArt(el) {
    var type = el.getAttribute('data-art'), t = el.getAttribute('data-t'), a = el.getAttribute('data-a');
    var key = type + '|' + t + '|' + a;
    if (key in _artCache) {
      var c = _artCache[key];
      if (c && typeof c.then === 'function') c.then(function (u) { paintArt(el, u); });
      else paintArt(el, c);
      return;
    }
    if (typeof getArtAuto !== 'function') return;
    var p = (type === 'album' ? getArtAuto('album', t, a, t) : getArtAuto('song', t, a))
      .catch(function () { return null; });
    _artCache[key] = p;
    p.then(function (u) { _artCache[key] = u || null; paintArt(el, u); });
  }
  function observeArt(root) {
    if (_artObs) _artObs.disconnect();
    var els = root.querySelectorAll('.wc-art[data-art]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { Array.prototype.forEach.call(els, loadArt); return; }
    _artObs = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        _artObs.unobserve(en.target);
        loadArt(en.target);
      });
    }, { rootMargin: '200px' });
    Array.prototype.forEach.call(els, function (el) { _artObs.observe(el); });
  }

  function bodyHTML() {
    var d = current();
    var nav = weekNavHTML(d);
    var past = !!S.date && hasPast(S.chart);
    if (S.err && !d) {
      // A past week that won't load can go back to the latest one
      return nav + '<div class="wc-msg"><p>' + esc(tr(past ? 'wc_err_week' : 'wc_err')) + '</p>' +
        '<button type="button" class="dc-btn dc-btn-normal dc-btn-sm" onclick="dcWorldCharts.reload()">' + esc(tr('wc_retry')) + '</button>' +
        (past ? ' <button type="button" class="dc-btn dc-btn-normal dc-btn-sm" onclick="dcWorldCharts.pickDate(\'\')">' + esc(tr('wc_latest')) + '</button>' : '') +
        '</div>';
    }
    if (!d) {
      // Loading: a few grey rows, so the page doesn't jump when the chart lands
      var sk = '';
      for (var i = 0; i < 8; i++) sk += '<li class="wc-sk"><span class="wc-sk-rank"></span><span class="wc-sk-art"></span><span class="wc-sk-text"><span class="wc-sk-t"></span><span class="wc-sk-a"></span></span></li>';
      return nav + '<p class="wc-source">' + esc(tr('wc_loading')) + '</p><ol class="wc-sk-list" aria-hidden="true">' + sk + '</ol>';
    }
    return nav + statusHTML(d) + sourceHTML(d) + listHTML(d);
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
    observeArt(root);
    schedulePrepare();
    // Phones: the chart buttons scroll sideways, so bring the chosen one into
    // view (only the button row scrolls, never the page)
    var menu = root.querySelector('.wc-menu'), on = menu && menu.querySelector('.wc-pick.active');
    if (on && menu.scrollWidth > menu.clientWidth) {
      menu.scrollLeft = Math.max(0, on.offsetLeft - menu.offsetLeft - (menu.clientWidth - on.offsetWidth) / 2);
    }
  }

  // ── Actions ──
  function pick(id) {
    if (!S.menu.some(function (c) { return c.id === id; })) return;
    S.chart = id; S.all = false; S.err = false;
    lsSet(LS_CHART, id);
    loadChart(id);
  }

  // Step 6: go to a week. '' = the latest; any day = that day's chart week.
  function pickDate(v) {
    clearTimeout(_typeT);
    var c = chartDef(S.chart);
    if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) v = null;
    if (v && c && c.first && v < c.first) v = c.first;
    var latest = S.latest[S.chart];
    if (v && ((latest && v >= latest) || v > todayIso())) v = null;
    S.date = v; S.all = false; S.err = false;
    loadChart(S.chart);
  }
  function stepWeek(n) {
    var d = current();
    var base = (d && d.date) || dateFor(S.chart) || S.latest[S.chart];
    if (!base) return;
    pickDate(isoAdd(base, 7 * n));
  }
  // Typing in the date box: wait until a whole date has been typed (the box
  // reports half-typed years like 0019 along the way)
  var _typeT = null;
  function typeDate(v) {
    clearTimeout(_typeT);
    var c = chartDef(S.chart);
    if (!v || (c && c.first && v.slice(0, 4) < c.first.slice(0, 4))) return;
    _typeT = setTimeout(function () { pickDate(v); }, TYPE_WAIT);
  }

  function show() {
    S.active = true;
    if (!S.range) S.range = lsGet(LS_RANGE) === 'week' ? 'week' : 'all';
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
    // Step 6: past weeks
    pickDate: pickDate,
    stepWeek: stepWeek,
    typeDate: typeDate,
    myWeek: goMyWeek,
    // Step 7: the share picture
    share: shareCard,
    showAll: function () { S.all = true; render(); },
    // Step 5: filter rows by whether you've played them, and which plays count
    setFilter: function (f) { S.filter = f; S.all = false; render(); },
    setRange: function (r) { S.range = r === 'week' ? 'week' : 'all'; lsSet(LS_RANGE, S.range); render(); },
    openRow: function (el) { openMine(el.getAttribute('data-type'), el.getAttribute('data-key')); },
    // Enter or Space on a focused row opens it too, like a real button
    rowKey: function (e, el) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      openMine(el.getAttribute('data-type'), el.getAttribute('data-key'));
    }
  };
})();
