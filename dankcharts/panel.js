/* ═══════════════════════════════════════════════════════════════════════
   DETAILS SIDE PANEL — redesign phase 10 step 3
   The song, album and artist pop-ups (#songModal, #albumModal, #artistModal)
   become one side panel that slides in from the right (full screen on a
   phone), so the chart stays in view. app.js still fills every part of them
   (openSongModal / openAlbumModal / openArtistModal are unchanged); this file
   wraps those three functions and adds what the panel needs around them:
     • a header with the cover large on a blurred copy of itself,
     • a row of buttons: ▶ sample, ＋ playlist, ★ rate, share and ⋮ (the same
       action menu the chart rows use — the header is marked as an "entry"
       with data-ea-* attributes, so app.js's handlers run it),
     • tabs over the parts (Overview · Charts · Listening · Awards …): each
       part in index.html is a <section class="dp-sec" data-dp-tab="…">,
     • ← back: going from a song to its album to its artist keeps a history
       inside the panel, so you can step back without closing it.
   Loaded after app.js (it wraps app.js's functions).
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var KINDS = {
    song:   { overlay: 'songModal',   img: 'songModalImg',   fn: 'openSongModal',   tabs: ['overview', 'charts', 'listening', 'awards'] },
    album:  { overlay: 'albumModal',  img: 'albumModalImg',  fn: 'openAlbumModal',  tabs: ['overview', 'tracks', 'charts', 'listening', 'rating'] },
    artist: { overlay: 'artistModal', img: 'modalArtistImg', fn: 'openArtistModal', tabs: ['overview', 'music', 'charts', 'listening', 'awards'] }
  };

  var hist = [];        // where ← back goes: [{ kind, arg, tab, scroll }]
  var cur = null;       // what is on screen: { kind, arg }
  var goingBack = false;
  var lastClose = 0;    // when a panel last closed (a link that closes one panel
                        // and opens the next 50ms later is still a step)
  var tabNow = {};      // the open tab per kind

  function ico(n) { return typeof dcIco === 'function' ? dcIco(n) : ''; }
  function tt(k, v) { return typeof t === 'function' ? t(k, v) : k; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function overlayOf(kind) { return document.getElementById(KINDS[kind].overlay); }
  function openKind() {
    for (var k in KINDS) { var o = overlayOf(k); if (o && o.classList.contains('open')) return k; }
    return null;
  }
  function scroller(kind) { var o = overlayOf(kind); return o && o.querySelector('.dp-scroll'); }

  /* ── Wrapping the three open functions ───────────────────────────────── */
  function wrap(kind) {
    var name = KINDS[kind].fn, orig = window[name];
    if (typeof orig !== 'function' || orig._dpWrapped) return;
    var wrapped = function (arg) {
      var openNow = openKind();
      var stepping = !!openNow || (Date.now() - lastClose < 450);
      if (!goingBack) {
        if (stepping && cur && !(cur.kind === kind && cur.arg === arg)) {
          var sc = scroller(cur.kind);
          hist.push({ kind: cur.kind, arg: cur.arg, tab: tabNow[cur.kind], scroll: sc ? sc.scrollTop : 0 });
          if (hist.length > 20) hist.shift();
        } else if (!stepping) {
          hist = [];
        }
      }
      // One panel at a time: the one being left goes without its slide-out
      // (the new one slides over it)
      if (openNow && openNow !== kind) {
        var old = overlayOf(openNow);
        old.classList.add('dp-leaving');
        old.classList.remove('open');
        setTimeout(function () { old.classList.remove('dp-leaving'); }, 250);
      }
      var o = overlayOf(kind);
      if (o) o.classList.toggle('dp-step', stepping);
      cur = { kind: kind, arg: arg };
      var r = orig.apply(this, arguments);
      afterOpen(kind, arg);
      return r;
    };
    wrapped._dpWrapped = true;
    window[name] = wrapped;
  }

  /* ── After app.js has filled the panel ───────────────────────────────── */
  function afterOpen(kind, arg) {
    var o = overlayOf(kind);
    if (!o) return;
    var data = entryData(kind, arg);
    paintHero(kind, o, data);
    buildTabs(kind, o, goingBack && tabNow[kind] ? tabNow[kind] : 'overview');
    var back = o.querySelector('.dp-back');
    if (back) back.hidden = !hist.length;
    var sc = o.querySelector('.dp-scroll');
    if (sc && !goingBack) sc.scrollTop = 0;
    // Parts that fill in a moment later (records, heatmap) may make a tab worth showing
    setTimeout(function () { if (o.classList.contains('open')) refreshTabs(kind, o); }, 700);
    if (typeof _eaPaintSamples === 'function') _eaPaintSamples();
  }

  // The entry the header stands for, in the shape app.js's action menu reads
  function entryData(kind, arg) {
    if (kind === 'song') {
      var p = null;
      if (typeof allPlays !== 'undefined' && typeof songKey === 'function') {
        for (var i = 0; i < allPlays.length; i++) { if (songKey(allPlays[i]) === arg) { p = allPlays[i]; break; } }
      }
      var parts = String(arg).split('|||');
      return { type: 'songs', title: p ? p.title : parts[0], artist: p ? p.artist : parts[1] || '', album: p ? (p.album || '') : '', key: arg, imgId: KINDS.song.img };
    }
    if (kind === 'album') {
      var a = String(arg).split('|||');
      return { type: 'albums', title: '', artist: a[1] || '', album: a[0], key: arg, imgId: KINDS.album.img };
    }
    return { type: 'artists', title: '', artist: arg, album: '', key: arg, imgId: KINDS.artist.img };
  }

  /* ── Header: blurred cover behind, buttons under the title ───────────── */
  function paintHero(kind, o, d) {
    var hero = o.querySelector('.dp-hero');
    if (!hero) return;
    // data-ea-* make the header an "entry": ▶ and ⋮ in it run app.js's
    // sample and action menu, exactly as on a chart row
    hero.setAttribute('data-ea-type', d.type);
    hero.setAttribute('data-ea-title', d.title);
    hero.setAttribute('data-ea-artist', d.artist);
    hero.setAttribute('data-ea-album', d.album);
    hero.setAttribute('data-ea-key', d.key);
    hero.setAttribute('data-ea-img', d.imgId);

    var acts = o.querySelector('.dp-actions');
    if (acts) {
      var b = function (cls, icon, label, extra) {
        // every button has a tooltip: on a phone only Sample keeps its word
        var tip = extra && extra.indexOf(' title=') !== -1 ? '' : ' title="' + esc(label) + '"';
        return '<button type="button" class="dp-act ' + cls + '"' + (extra || '') + tip + '>' + ico(icon) + '<span>' + esc(label) + '</span></button>';
      };
      var h = b('ea-sample dp-act-main', 'play', tt('ea_s_sample'), ' title="' + esc(tt('ea_sample')) + '"');
      h += b('', 'listmusic', tt('dp_playlist'), ' data-dp-act="playlist" title="' + esc(tt('ea_add_playlist')) + '"');
      if (kind !== 'artist') h += b('', 'star', tt('dp_rate'), ' data-dp-act="rate"');
      h += b('', 'share', tt('dp_share'), ' data-dp-act="share"');
      h += '<button type="button" class="dp-act dp-act-icon ea-more" title="' + esc(tt('ea_more')) + '" aria-label="' + esc(tt('ea_more')) + '" aria-haspopup="menu">' + ico('more') + '</button>';
      acts.innerHTML = h;
    }
    var kick = o.querySelector('.dp-kicker');
    if (kick) kick.textContent = tt('dp_kind_' + kind);
    // The name again in the top bar, shown once the header has scrolled away
    var name = o.querySelector('.dp-titles .modal-artist-name'), barT = o.querySelector('.dp-bar-title');
    if (name && barT) barT.textContent = name.textContent;
    o.classList.remove('dp-scrolled');
    watchCover(kind, o);
  }

  // The blurred backdrop copies the cover once app.js's lookup has found it
  function watchCover(kind, o) {
    var holder = document.getElementById(KINDS[kind].img);
    var bg = o.querySelector('.dp-hero-bg');
    if (!holder || !bg) return;
    var paint = function () {
      var img = holder.querySelector('img');
      var src = img && (img.dataset.fullSrc || img.currentSrc || img.src);
      bg.style.backgroundImage = src ? 'url("' + src.replace(/"/g, '%22') + '")' : '';
      bg.classList.toggle('has-img', !!src);
    };
    paint();
    if (holder._dpObs) holder._dpObs.disconnect();
    holder._dpObs = new MutationObserver(paint);
    holder._dpObs.observe(holder, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  }

  /* ── Tabs ─────────────────────────────────────────────────────────────── */
  // A part counts as empty when nothing in it has text or a picture / chart
  function hasContent(sec) {
    if (sec.hidden) return false;
    var kids = sec.querySelectorAll(':scope > *');
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      if (k.classList.contains('modal-section-title')) continue;
      if (k.style.display === 'none') continue;
      if ((k.textContent || '').trim() || k.querySelector('img, canvas, svg')) return true;
    }
    return false;
  }

  function tabsWithContent(o, kind) {
    var secs = o.querySelectorAll('.dp-sec[data-dp-tab]');
    return KINDS[kind].tabs.filter(function (tab) {
      for (var i = 0; i < secs.length; i++) if (secs[i].getAttribute('data-dp-tab') === tab && hasContent(secs[i])) return true;
      return false;
    });
  }

  function buildTabs(kind, o, want) {
    var bar = o.querySelector('.dp-tabs');
    if (!bar) return;
    var tabs = tabsWithContent(o, kind);
    if (!tabs.length) tabs = ['overview'];
    if (tabs.indexOf(want) === -1) want = tabs[0];
    bar.innerHTML = tabs.map(function (tab) {
      return '<button type="button" role="tab" class="dp-tab" data-tab="' + tab + '" id="dpTab-' + kind + '-' + tab + '" aria-selected="false" tabindex="-1">' + esc(tt('dp_tab_' + tab)) + '</button>';
    }).join('') + '<span class="dp-tab-ink" aria-hidden="true"></span>';
    bar.hidden = tabs.length < 2;
    showTab(kind, o, want, true);
  }

  function refreshTabs(kind, o) {
    var bar = o.querySelector('.dp-tabs');
    if (!bar) return;
    var have = Array.prototype.map.call(bar.querySelectorAll('.dp-tab'), function (b) { return b.dataset.tab; }).join();
    if (tabsWithContent(o, kind).join() !== have) buildTabs(kind, o, tabNow[kind]);
  }

  function showTab(kind, o, tab, instant) {
    tabNow[kind] = tab;
    var secs = o.querySelectorAll('.dp-sec[data-dp-tab]');
    for (var i = 0; i < secs.length; i++) {
      var on = secs[i].getAttribute('data-dp-tab') === tab;
      secs[i].classList.toggle('dp-on', on);
      if (on && !instant) { secs[i].classList.remove('dp-in'); void secs[i].offsetWidth; secs[i].classList.add('dp-in'); }
    }
    var btns = o.querySelectorAll('.dp-tab'), active = null;
    for (var j = 0; j < btns.length; j++) {
      var sel = btns[j].dataset.tab === tab;
      btns[j].setAttribute('aria-selected', sel ? 'true' : 'false');
      btns[j].tabIndex = sel ? 0 : -1;
      btns[j].classList.toggle('is-on', sel);
      if (sel) active = btns[j];
    }
    // The underline slides to the chosen tab
    var ink = o.querySelector('.dp-tab-ink');
    if (ink && active) {
      requestAnimationFrame(function () {
        ink.style.width = active.offsetWidth + 'px';
        ink.style.transform = 'translateX(' + active.offsetLeft + 'px)';
        ink.classList.toggle('no-anim', !!instant);
      });
      if (!instant && active.scrollIntoView) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    // Back to the top of the parts when the tab changes (but not under the header)
    var sc = o.querySelector('.dp-scroll'), bar = o.querySelector('.dp-tabs');
    if (sc && bar && !instant && sc.scrollTop > bar.offsetTop) sc.scrollTop = bar.offsetTop;
  }

  /* ── Clicks and keys inside a panel ──────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var o = e.target.closest && e.target.closest('.dp-overlay');
    if (!o) return;
    var kind = o.getAttribute('data-dp-kind');
    var tab = e.target.closest('.dp-tab');
    if (tab) { showTab(kind, o, tab.dataset.tab); return; }
    if (e.target.closest('.dp-back')) { back(); return; }
    var act = e.target.closest('[data-dp-act]');
    if (act) runAct(kind, o, act.getAttribute('data-dp-act'));
  });

  document.addEventListener('keydown', function (e) {
    var tab = e.target.closest && e.target.closest('.dp-tab');
    if (!tab || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End')) return;
    var o = tab.closest('.dp-overlay'), all = Array.prototype.slice.call(o.querySelectorAll('.dp-tab'));
    var i = all.indexOf(tab);
    var n = e.key === 'Home' ? 0 : e.key === 'End' ? all.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length;
    e.preventDefault();
    all[n].focus();
    showTab(o.getAttribute('data-dp-kind'), o, all[n].dataset.tab);
  });

  function runAct(kind, o, act) {
    var hero = o.querySelector('.dp-hero');
    var d = hero && typeof _eaEntryData === 'function' ? _eaEntryData(hero) : null;
    if (!d) return;
    if (act === 'playlist' && typeof _eaRunAction === 'function') _eaRunAction('playlist', hero);
    else if (act === 'rate' && typeof openRatingModal === 'function') openRatingModal(kind === 'album' ? 'album' : 'song', d.key);
    else if (act === 'share') {
      if (kind === 'song' && typeof openCrIgModalFromPanel === 'function') openCrIgModalFromPanel('songs', encodeURIComponent(d.key));
      else if (kind === 'album' && typeof tpOpenCard === 'function') tpOpenCard();
      else if (kind === 'artist' && typeof tpOpenArtistCard === 'function') tpOpenArtistCard(d.artist);
    }
  }

  // ← back: the previous song / album / artist, on the tab and spot it was left
  function back() {
    var prev = hist.pop();
    if (!prev) return;
    goingBack = true;
    tabNow[prev.kind] = prev.tab;
    try { window[KINDS[prev.kind].fn](prev.arg); }
    finally { goingBack = false; }
    var sc = scroller(prev.kind);
    if (sc) sc.scrollTop = prev.scroll || 0;
    var o = overlayOf(prev.kind), bk = o && o.querySelector('.dp-back');
    if (bk) bk.hidden = !hist.length;
  }
  window.dcPanelBack = back;

  /* ── The header turns solid once it has scrolled away ────────────────── */
  function onScroll(e) {
    var sc = e.target;
    if (!sc.classList || !sc.classList.contains('dp-scroll')) return;
    var o = sc.closest('.dp-overlay');
    var hero = o.querySelector('.dp-hero');
    o.classList.toggle('dp-scrolled', sc.scrollTop > (hero ? hero.offsetHeight - 64 : 120));
  }

  /* ── The ⋮ menu opened from the header ───────────────────────────────── */
  // "Details" would only open this same panel again, so it goes; "Chart run"
  // shows the Charts tab instead of looking for a chart row to open.
  function wrapMenu() {
    var orig = window._eaOpenMenu;
    if (typeof orig !== 'function' || orig._dpWrapped) return;
    var w = function (el) {
      var r = orig.apply(this, arguments);
      if (el && el.classList && el.classList.contains('dp-hero')) {
        var m = document.getElementById('eaMenu');
        var det = m && m.querySelector('.wv-ctx-item[data-action="details"]');
        if (det) det.remove();
      }
      return r;
    };
    w._dpWrapped = true;
    window._eaOpenMenu = w;
  }
  document.addEventListener('click', function (e) {
    var item = e.target.closest && e.target.closest('#eaMenu .wv-ctx-item[data-action="chartrun"]');
    if (!item || typeof _eaMenuEntry === 'undefined' || !_eaMenuEntry || !_eaMenuEntry.classList.contains('dp-hero')) return;
    e.stopPropagation();
    var o = _eaMenuEntry.closest('.dp-overlay');
    if (typeof _eaCloseMenu === 'function') _eaCloseMenu();
    if (o && o.querySelector('.dp-tab[data-tab="charts"]')) showTab(o.getAttribute('data-dp-kind'), o, 'charts');
  }, true);

  function start() {
    wrapMenu();
    for (var k in KINDS) {
      wrap(k);
      var o = overlayOf(k);
      if (!o) continue;
      // Remember when a panel closes, so a link that closes it and opens the
      // next one a moment later still counts as a step (← back stays)
      (function (ov) {
        new MutationObserver(function () {
          if (!ov.classList.contains('open') && ov._dpWasOpen) lastClose = Date.now();
          ov._dpWasOpen = ov.classList.contains('open');
        }).observe(ov, { attributes: true, attributeFilter: ['class'] });
      })(o);
      var sc = o.querySelector('.dp-scroll');
      if (sc) sc.addEventListener('scroll', onScroll, { passive: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
