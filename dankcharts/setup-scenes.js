/* ═══════════════════════════════════════════════════════════════════════════
   SETUP GUIDE PICTURES (2026-11-07, SETUP-GUIDE-PLAN.md)

   Every step of setup-guide.html shows a picture of the screen you'll be
   looking at, with numbered dots on what to click. Screens on other sites
   (Google Sheets, Google's approval pages, Apps Script, Last.fm, Spotify …)
   are DRAWN here in HTML rather than photographed:
     • they read in all four languages (Google's own words per language),
     • they never show anybody's private data,
     • they stay sharp at any size, and the dots can't drift off target,
       because a dot is pinned to the element it points at, not to x/y.
   dankcharts.fm's own screens are real screenshots (setup/<lang>/*.webp),
   shown through the very same component (scene.img).

   Markup (in setup-guide.html):
     <figure class="shot" data-scene="gs-copy"></figure>
     <figure class="shot" data-scene="g-auth1,g-auth2,g-auth3,g-auth4"></figure>  → a mini slideshow
     <ol class="do"><li data-dot="1">Click <b>Make a copy</b></li>…</ol>         → the "Do this" list
   Inside a scene, any element with data-dot="N" gets dot N and a ring.
   A "Do this" line and its dot light each other up on hover; a line can
   carry data-frame="2" to flip a slideshow to its second screen first.

   Scene = { url, w, html(L), frame?, cap?, img? }
     url    what the address bar shows
     w      the width the scene is drawn at (it is scaled to fit)
     html   returns the scene's markup; L('key') = that language's label
     frame  'browser' (default) | 'app' (a dankcharts.fm window, no bar)
     cap    caption key (slideshows: one per screen)
     img    real screenshot name → setup/<lang>/<img>.webp, dots from
            setup/<lang>/shots.json (fractions of the picture)

   Public: window.SGShots.mountAll(root), .refresh(root), .relang(), .tour(fig)
   The styles live in setup-scenes.css.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function lang() {
    try { if (typeof currentLang !== 'undefined' && currentLang) return currentLang; } catch (e) {}
    return 'en';
  }
  function reduced() {
    return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ── Labels on the drawn screens ────────────────────────────────────────
     The products' own words in each language (what the reader really sees).
     English is the fallback for any key a language doesn't have. Our own
     template's names ("Settings" tab, the Last.fm menu) stay English — the
     template and its script are English. */
  var LBL = {
    en: {
      // Google Sheets "Make a copy" page
      gs_copy_title: 'Copy document',
      gs_copy_q: 'Would you like to make a copy of <b>Full Music History for Dankcharts.fm TEMPLATE</b>?',
      gs_copy_script: 'The attached Apps Script project will also be copied.',
      gs_copy_btn: 'Make a copy',
      gs_copy_note: 'Your copy is private to you — only you can see it until you share it.',
      cap_gs_copy: 'The page the template link opens',
      // Google Sheets window
      gs_doc: 'Copy of Full Music History for Dankcharts.fm TEMPLATE',
      gs_menu: 'File|Edit|View|Insert|Format|Data|Tools|Extensions|Help',
      gs_ext: 'Add-ons|Macros|Apps Script|AppSheet',
      gs_share: 'Share',
      cap_gs_settings: 'Your copy, on its Settings tab',
      cap_gs_ext: 'The Extensions menu in your copy',
      // Last.fm API pages (Last.fm shows these in English)
      cap_lfm_form: 'last.fm/api/account/create',
      cap_lfm_done: 'The page you get after Submit'
    },
    es: {
      gs_copy_title: 'Copiar documento',
      gs_copy_q: '¿Quieres hacer una copia de <b>Full Music History for Dankcharts.fm TEMPLATE</b>?',
      gs_copy_script: 'También se copiará el proyecto de Apps Script adjunto.',
      gs_copy_btn: 'Hacer una copia',
      gs_copy_note: 'Tu copia es privada: solo tú la ves hasta que la compartas.',
      cap_gs_copy: 'La página que abre el enlace de la plantilla',
      gs_doc: 'Copia de Full Music History for Dankcharts.fm TEMPLATE',
      gs_menu: 'Archivo|Editar|Ver|Insertar|Formato|Datos|Herramientas|Extensiones|Ayuda',
      gs_ext: 'Complementos|Macros|Apps Script|AppSheet',
      gs_share: 'Compartir',
      cap_gs_settings: 'Tu copia, en la pestaña Settings',
      cap_gs_ext: 'El menú Extensiones de tu copia',
      cap_lfm_done: 'La página que ves tras pulsar Submit'
    },
    'pt-BR': {
      gs_copy_title: 'Copiar documento',
      gs_copy_q: 'Quer fazer uma cópia de <b>Full Music History for Dankcharts.fm TEMPLATE</b>?',
      gs_copy_script: 'O projeto do Apps Script anexado também será copiado.',
      gs_copy_btn: 'Fazer uma cópia',
      gs_copy_note: 'Sua cópia é privada: só você vê até compartilhar.',
      cap_gs_copy: 'A página que o link do modelo abre',
      gs_doc: 'Cópia de Full Music History for Dankcharts.fm TEMPLATE',
      gs_menu: 'Arquivo|Editar|Ver|Inserir|Formatar|Dados|Ferramentas|Extensões|Ajuda',
      gs_ext: 'Complementos|Macros|Apps Script|AppSheet',
      gs_share: 'Compartilhar',
      cap_gs_settings: 'Sua cópia, na aba Settings',
      cap_gs_ext: 'O menu Extensões da sua cópia',
      cap_lfm_done: 'A página que aparece depois de Submit'
    },
    'pt-PT': {
      gs_copy_title: 'Copiar documento',
      gs_copy_q: 'Pretende fazer uma cópia de <b>Full Music History for Dankcharts.fm TEMPLATE</b>?',
      gs_copy_script: 'O projeto do Apps Script anexado também será copiado.',
      gs_copy_btn: 'Fazer uma cópia',
      gs_copy_note: 'A tua cópia é privada: só tu a vês até a partilhares.',
      cap_gs_copy: 'A página que o link do modelo abre',
      gs_doc: 'Cópia de Full Music History for Dankcharts.fm TEMPLATE',
      gs_menu: 'Ficheiro|Editar|Ver|Inserir|Formatar|Dados|Ferramentas|Extensões|Ajuda',
      gs_ext: 'Suplementos|Macros|Apps Script|AppSheet',
      gs_share: 'Partilhar',
      cap_gs_settings: 'A tua cópia, no separador Settings',
      cap_gs_ext: 'O menu Extensões da tua cópia',
      cap_lfm_done: 'A página que aparece depois de Submit'
    }
  };
  function L(key) {
    var l = LBL[lang()] || {};
    if (l[key] != null) return l[key];
    if (LBL.en[key] != null) return LBL.en[key];
    return key;
  }

  /* ── Shared drawing bits ─────────────────────────────────────────────── */
  // A Google-style multi-colour "G" disc (a neutral stand-in, not the logo)
  var G_DISC = '<span class="r-gdisc" aria-hidden="true"><i></i></span>';
  // Google Sheets' green document glyph
  var GS_ICON = '<span class="r-gs-icon" aria-hidden="true"><i></i></span>';

  /* ── Google Sheets window ───────────────────────────────────────────────
     gsApp(L, o) draws your copy of the template:
       o.tab      'data' | 'settings'       which bottom tab is open
       o.rows     [[A, B, …], …]            cell text (HTML allowed)
       o.minRows  8                         rows drawn even if empty
       o.cellDots { B1: 2 }                 a dot on a cell
       o.cellCls  { B1: 'r-gs-sel' }        extra class on a cell
       o.ref / o.fx                         name box / formula bar text
       o.lastfm   true                      the template's Last.fm menu is there
       o.open     'ext' | 'lastfm'          a menu is dropped down
       o.menuDot  { ext: 1, lastfm: 1 }     dot on a menu name
       o.itemDot  { 2: 2 }                  dot on a dropdown item (by index)
       o.lfmItems [label, …]                the Last.fm menu's items
       o.share    1                         dot on Share
       o.tabDot   1                         dot on the Settings tab
       o.overlay  '…'                       a dialog drawn over the sheet */
  function gsDropdown(items, dots) {
    return '<span class="r-dd">' + items.map(function (it, i) {
      if (it === '-') return '<span class="r-dd-sep"></span>';
      var d = dots && dots[i];
      return '<span class="r-dd-item"' + (d ? ' data-dot="' + d + '" data-dot-at="l"' : '') + '>' + it + '</span>';
    }).join('') + '</span>';
  }
  function gsApp(L, o) {
    o = o || {};
    var cols = ['A', 'B', 'C', 'D', 'E', 'F'];
    var menu = L('gs_menu').split('|');
    var menuHtml = menu.map(function (m, i) {
      var isExt = i === 7;
      var open = isExt && o.open === 'ext';
      var dot = isExt && o.menuDot && o.menuDot.ext;
      return '<span class="r-gs-mi' + (open ? ' open' : '') + '"' + (dot ? ' data-dot="' + dot + '"' : '') + '>' + m +
        (open ? gsDropdown(L('gs_ext').split('|'), o.itemDot) : '') + '</span>';
    }).join('');
    if (o.lastfm) {
      var lopen = o.open === 'lastfm';
      var ldot = o.menuDot && o.menuDot.lastfm;
      menuHtml += '<span class="r-gs-mi' + (lopen ? ' open' : '') + '"' + (ldot ? ' data-dot="' + ldot + '"' : '') + '>Last.fm' +
        (lopen ? gsDropdown(o.lfmItems || [], o.itemDot) : '') + '</span>';
    }
    var rows = o.rows || [];
    var nRows = Math.max(rows.length, o.minRows || 8);
    var grid = '<table class="r-gs-grid"><tr><th class="r-gs-corner"></th>' +
      cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>';
    for (var r = 0; r < nRows; r++) {
      grid += '<tr><th>' + (r + 1) + '</th>';
      for (var c = 0; c < cols.length; c++) {
        var ref = cols[c] + (r + 1);
        var val = (rows[r] && rows[r][c] != null) ? rows[r][c] : '';
        var cd = o.cellDots && o.cellDots[ref];
        var cls = (o.cellCls && o.cellCls[ref]) || '';
        if (r === 0 && o.tab === 'data') cls += ' r-gs-head';
        grid += '<td' + (cls ? ' class="' + cls + '"' : '') + '>' +
          (cd ? '<span class="r-gs-cellbox" data-dot="' + cd + '" data-dot-at="r"></span>' : '') + val + '</td>';
      }
      grid += '</tr>';
    }
    grid += '</table>';
    var tabs = '<div class="r-gs-tabs"><span class="r-gs-tabbtn">+</span><span class="r-gs-tabbtn">≡</span>' +
      '<span class="r-gs-tab' + (o.tab !== 'settings' ? ' on' : '') + '">Full Raw Listening History</span>' +
      '<span class="r-gs-tab' + (o.tab === 'settings' ? ' on' : '') + '"' + (o.tabDot ? ' data-dot="' + o.tabDot + '"' : '') + '>Settings</span></div>';
    return '<div class="r-page r-gs">' +
      '<div class="r-gs-top">' + GS_ICON +
        '<div class="r-gs-tt"><div class="r-gs-title">' + L('gs_doc') + ' <span class="r-gs-star">☆</span></div>' +
        '<div class="r-gs-menu">' + menuHtml + '</div></div>' +
        '<div class="r-gs-right"><span class="r-gs-share"' + (o.share ? ' data-dot="' + o.share + '"' : '') + '><span class="r-gs-lock">🔒</span>' + L('gs_share') + '</span><span class="r-avatar">A</span></div>' +
      '</div>' +
      '<div class="r-gs-tools"><i></i><i></i><i></i><b></b><i></i><i></i><b></b><i class="w"></i><b></b><i></i><i></i><i></i><i></i><b></b><i></i><i></i></div>' +
      '<div class="r-gs-fx"><span class="r-gs-ref">' + (o.ref || 'A1') + '</span><span class="r-gs-fxi">fx</span><span class="r-gs-fxv">' + (o.fx || '') + '</span></div>' +
      '<div class="r-gs-body">' + grid + (o.overlay ? '<div class="r-scrim"></div>' + o.overlay : '') + '</div>' +
      tabs +
    '</div>';
  }

  // The template's Settings tab, as it looks once filled in
  function settingsRows(fill) {
    return [
      ['Last.fm Username:', fill ? 'alex_listens' : ''],
      ['Last.fm API Key:', fill ? '3f7a1c9e0b2d4f6a…' : ''],
      ['Data Tab Name:', 'Full Raw Listening History']
    ];
  }
  // The data tab with a few plays in it (made-up rows)
  function dataRows() {
    return [
      ['Song Title', 'Artist', 'Album', 'Date and Time', 'Genre 1', 'Genre 2'],
      ['Espresso', 'Sabrina Carpenter', 'Short n\' Sweet', '2026-11-06 21:14:05', 'pop', ''],
      ['Not Like Us', 'Kendrick Lamar', 'GNX', '2026-11-06 20:58:41', 'hip hop', 'west coast'],
      ['Birds of a Feather', 'Billie Eilish', 'Hit Me Hard and Soft', '2026-11-06 20:41:10', 'pop', 'alt pop'],
      ['Die With A Smile', 'Lady Gaga', 'Mayhem', '2026-11-06 20:37:02', 'pop', ''],
      ['APT.', 'ROSÉ', 'rosie', '2026-11-06 20:33:47', 'k-pop', 'pop']
    ];
  }

  /* ── Last.fm pages: a simplified Last.fm header (red bar, wordmark text) ── */
  function lfmPage(inner) {
    return '<div class="r-page r-lfm">' +
      '<div class="r-lfm-head"><span class="r-lfm-mark">last.fm</span><span class="r-lfm-nav">Music&nbsp;&nbsp;&nbsp;Events&nbsp;&nbsp;&nbsp;Features</span><span class="r-avatar r-avatar-sm">A</span></div>' +
      '<div class="r-lfm-body">' + inner + '</div></div>';
  }
  function lfmField(label, value, dot, opt) {
    return '<div class="r-lfm-field"><label>' + label + (opt ? ' <i>(optional)</i>' : '') + '</label>' +
      '<span class="r-input' + (value ? '' : ' r-input-empty') + '"' + (dot ? ' data-dot="' + dot + '"' : '') + '>' + (value || '&nbsp;') + '</span></div>';
  }

  /* ── The scenes ──────────────────────────────────────────────────────── */
  var SCENES = {

    // Sheets step 2 / Last.fm step 2 — the API account form, filled in
    'lfm-form': {
      url: 'www.last.fm/api/account/create',
      w: 720,
      cap: 'cap_lfm_form',
      html: function () {
        return lfmPage(
          '<h4 class="r-lfm-h">Create API account</h4>' +
          lfmField('Contact email', 'you@example.com') +
          lfmField('Application name', 'My Music Charts', 1) +
          lfmField('Application description', 'Personal use', 2) +
          lfmField('Callback URL', 'https://dankcharts.fm', 0, true) +
          lfmField('Application homepage', 'https://dankcharts.fm', 0, true) +
          '<div class="r-lfm-actions"><span class="r-lfm-btn" data-dot="3">Submit</span></div>'
        );
      }
    },
    // …and the page you land on: the key (and the secret)
    'lfm-done': {
      url: 'www.last.fm/api/account/create',
      w: 720,
      cap: 'cap_lfm_done',
      html: function () {
        return lfmPage(
          '<h4 class="r-lfm-h">API account created</h4>' +
          '<p class="r-lfm-p">Here are the details of your new API account.</p>' +
          '<div class="r-lfm-kv"><span>Application name</span><span>My Music Charts</span></div>' +
          '<div class="r-lfm-kv"><span>API key</span><span class="r-mono" data-dot="4">3f7a1c9e0b2d4f6a8c1e3b5d7f9a2c4e</span></div>' +
          '<div class="r-lfm-kv"><span>Shared secret</span><span class="r-mono" data-dot="5">9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d</span></div>' +
          '<div class="r-lfm-kv"><span>Registered to</span><span>alex_listens</span></div>'
        );
      }
    },

    // Sheets step 3 — the Settings tab, B1 and B2 filled in
    'gs-settings': {
      url: 'docs.google.com/spreadsheets/d/…/edit',
      w: 840,
      cap: 'cap_gs_settings',
      html: function (L) {
        return gsApp(L, {
          tab: 'settings', tabDot: 1, rows: settingsRows(true), minRows: 7,
          cellDots: { B1: 2, B2: 3 }, cellCls: { B2: 'r-gs-sel' },
          ref: 'B2', fx: '3f7a1c9e0b2d4f6a8c1e3b5d7f9a2c4e'
        });
      }
    },

    // Sheets step 4 — Extensions → Apps Script
    'gs-ext': {
      url: 'docs.google.com/spreadsheets/d/…/edit',
      w: 840,
      cap: 'cap_gs_ext',
      html: function (L) {
        return gsApp(L, {
          tab: 'settings', rows: settingsRows(true), minRows: 7,
          open: 'ext', menuDot: { ext: 1 }, itemDot: { 2: 2 }, ref: 'A1', fx: 'Last.fm Username:'
        });
      }
    },

    // Sheets step 1 — the template's /copy link opens this page
    'gs-copy': {
      url: 'docs.google.com/spreadsheets/d/19brQQ…/copy',
      w: 720,
      cap: 'cap_gs_copy',
      html: function (L) {
        return '<div class="r-page r-gpage">' +
          '<div class="r-gbar">' + GS_ICON + '<span class="r-gbar-name">Google Sheets</span><span class="r-avatar">A</span></div>' +
          '<div class="r-copycard">' +
            '<h4>' + L('gs_copy_title') + '</h4>' +
            '<p>' + L('gs_copy_q') + '</p>' +
            '<p class="r-copy-script"><span class="r-ico-script" aria-hidden="true">&lt;/&gt;</span>' + L('gs_copy_script') + '</p>' +
            '<div class="r-copy-actions"><span class="r-btn-fill" data-dot="1">' + L('gs_copy_btn') + '</span></div>' +
            '<p class="r-copy-note">' + L('gs_copy_note') + '</p>' +
          '</div>' +
        '</div>';
      }
    }
  };

  /* ── Engine ──────────────────────────────────────────────────────────── */
  var mounted = [];   // every live figure controller
  var ro = 'ResizeObserver' in window ? new ResizeObserver(function (entries) {
    entries.forEach(function (e) { var c = e.target.__sg; if (c) c.layout(); });
  }) : null;

  // The pointer that glides to each dot
  var CURSOR_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2.5 19.5 12l-7 1.6 3.9 7.3-2.9 1.5-3.9-7.3L4 19.6z"/></svg>';

  function chrome(scene) {
    if (scene.frame === 'app' || scene.frame === 'none') return '';
    return '<div class="shot-bar" aria-hidden="true">' +
      '<span class="shot-lights"><i></i><i></i><i></i></span>' +
      '<span class="shot-url"><span class="shot-lock">🔒</span><span class="shot-url-text"></span></span>' +
    '</div>';
  }

  function Shot(fig) {
    var names = (fig.dataset.scenes || fig.dataset.scene || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    names = names.filter(function (n) { return SCENES[n]; });
    if (!names.length) return null;
    var self = this;
    var cur = Math.min(+(fig.dataset.start || 0), names.length - 1);
    var multi = names.length > 1;
    var big = fig.classList.contains('shot-big');   // the zoomed copy in the lightbox
    var toured = false;

    fig.classList.add('shot-ready');
    fig.innerHTML =
      '<div class="shot-win" ' + (big ? '' : 'role="button" tabindex="0"') + '>' +
        '<div class="shot-head"></div>' +
        '<div class="shot-view"><div class="shot-layer"></div></div>' +
        (big ? '' : '<span class="shot-zoom" aria-hidden="true">⤢</span>') +
      '</div>' +
      '<div class="shot-marks" aria-hidden="true"><span class="shot-cursor">' + CURSOR_SVG + '</span></div>' +
      '<figcaption class="shot-foot">' +
        (multi ? '<button type="button" class="shot-prev" aria-label="‹">‹</button>' : '') +
        '<span class="shot-cap"></span>' +
        (multi ? '<span class="shot-pips"></span><button type="button" class="shot-next" aria-label="›">›</button>' : '') +
      '</figcaption>';
    var win = fig.querySelector('.shot-win');
    var head = fig.querySelector('.shot-head');
    var view = fig.querySelector('.shot-view');
    var layer = fig.querySelector('.shot-layer');
    var marks = fig.querySelector('.shot-marks');
    var cursor = fig.querySelector('.shot-cursor');
    var capEl = fig.querySelector('.shot-cap');
    var pips = fig.querySelector('.shot-pips');
    var scale = 1;

    function scene() { return SCENES[names[cur]]; }

    this.render = function () {
      var sc = scene();
      head.innerHTML = chrome(sc);
      var urlText = head.querySelector('.shot-url-text');
      if (urlText) urlText.textContent = sc.url || '';
      fig.classList.toggle('shot-app', sc.frame === 'app');
      layer.style.width = sc.w + 'px';
      layer.innerHTML = sc.img ? imgScene(sc) : sc.html(L);
      var cap = sc.cap ? L(sc.cap) : '';
      capEl.textContent = (multi ? (cur + 1) + ' / ' + names.length + ' · ' : '') + cap;
      if (pips) {
        pips.innerHTML = names.map(function (n, i) { return '<i' + (i === cur ? ' class="on"' : '') + '></i>'; }).join('');
      }
      if (multi) {
        fig.querySelector('.shot-prev').disabled = cur === 0;
        fig.querySelector('.shot-next').disabled = cur === names.length - 1;
      }
      // Pictures inside a scene change its height once loaded
      layer.querySelectorAll('img').forEach(function (im) {
        if (!im.complete) im.addEventListener('load', function () { self.layout(); }, { once: true });
      });
      self.layout();
    };

    // Scale the drawn screen to the width it's given, then pin the marks
    this.layout = function () {
      var sc = scene();
      var cw = view.clientWidth;
      if (!cw) return;                         // hidden (another wizard step)
      scale = cw / sc.w;
      layer.style.transform = 'scale(' + scale + ')';
      view.style.height = Math.ceil(layer.offsetHeight * scale) + 'px';
      fig.style.setProperty('--s', scale);
      placeMarks();
    };

    function placeMarks() {
      marks.querySelectorAll('.shot-ring, .shot-dot').forEach(function (m) { m.remove(); });
      var fr = fig.getBoundingClientRect();
      layer.querySelectorAll('[data-dot]').forEach(function (el) {
        var n = el.getAttribute('data-dot');
        var r = el.getBoundingClientRect();
        if (!r.width && !r.height) return;
        var pad = 4;
        var ring = document.createElement('span');
        ring.className = 'shot-ring';
        ring.dataset.n = n;
        ring.style.left = (r.left - fr.left - pad) + 'px';
        ring.style.top = (r.top - fr.top - pad) + 'px';
        ring.style.width = (r.width + pad * 2) + 'px';
        ring.style.height = (r.height + pad * 2) + 'px';
        marks.appendChild(ring);
        var dot = document.createElement('span');
        dot.className = 'shot-dot';
        dot.dataset.n = n;
        dot.textContent = n;
        // Dots sit on the ring's top-left corner unless the scene asks for
        // another side (data-dot-at="r" right, "b" bottom-left)
        var at = el.getAttribute('data-dot-at') || 'tl';
        var x = r.left - fr.left - pad, y = r.top - fr.top - pad;
        if (at === 'r') { x = r.right - fr.left + pad; y = r.top - fr.top + r.height / 2; }
        if (at === 'b') { y = r.bottom - fr.top + pad; }
        if (at === 'l') { y = r.top - fr.top + r.height / 2; }
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        dot.style.animationDelay = (0.12 * (+n - 1)) + 's';
        marks.appendChild(dot);
      });
    }

    // Light dot n (and its ring), and glide the pointer onto it
    this.hot = function (n, on) {
      marks.querySelectorAll('[data-n="' + n + '"]').forEach(function (m) { m.classList.toggle('hot', on); });
      if (on) pointAt(n);
    };
    function pointAt(n) {
      var ring = marks.querySelector('.shot-ring[data-n="' + n + '"]');
      if (!ring) return;
      var x = ring.offsetLeft + ring.offsetWidth * 0.62;
      var y = ring.offsetTop + ring.offsetHeight * 0.62;
      cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      cursor.classList.add('on');
      clearTimeout(cursor.__t);
      cursor.classList.remove('click');
      cursor.__t = setTimeout(function () {
        cursor.classList.add('click');
        setTimeout(function () { cursor.classList.remove('click'); }, 450);
      }, reduced() ? 0 : 520);
    }

    // First time the picture is on screen: the pointer visits each dot once
    this.tour = function () {
      if (toured || reduced()) return;
      var dots = [].slice.call(marks.querySelectorAll('.shot-dot'));
      if (!dots.length) return;
      toured = true;
      // start from the lower right of the picture
      cursor.style.transition = 'none';
      cursor.style.transform = 'translate(' + (marks.offsetWidth * 0.86) + 'px,' + (marks.offsetHeight * 0.9) + 'px)';
      void cursor.offsetWidth;
      cursor.style.transition = '';
      var ns = dots.map(function (d) { return d.dataset.n; }).filter(function (n, i, a) { return a.indexOf(n) === i; });
      ns.forEach(function (n, i) {
        setTimeout(function () {
          self.hot(n, true);
          setTimeout(function () { self.hot(n, false); }, 1200);
        }, 450 + i * 1500);
      });
      setTimeout(function () { cursor.classList.remove('on'); }, 450 + ns.length * 1500 + 600);
    };

    this.go = function (i) {
      if (i < 0 || i >= names.length || i === cur) return;
      cur = i;
      toured = false;
      self.render();
      self.tour();
    };
    this.frame = function () { return cur; };
    this.names = names;

    if (multi) {
      fig.querySelector('.shot-prev').addEventListener('click', function () { self.go(cur - 1); });
      fig.querySelector('.shot-next').addEventListener('click', function () { self.go(cur + 1); });
    }
    if (!big) {
      var openZoom = function () { lightbox(fig, cur); };
      win.addEventListener('click', openZoom);
      win.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openZoom(); }
      });
      win.setAttribute('aria-label', (window.t ? t('sg_shot_zoom') : 'Zoom picture'));
    }
    fig.__sg = this;
    if (ro) ro.observe(view);
    this.render();
  }

  // A real screenshot as a scene: the picture, plus an invisible box per
  // measured spot so the dots work exactly like on a drawn screen
  var SHOTS_JSON = {};
  function imgScene(sc) {
    var l = lang();
    var meta = (SHOTS_JSON[l] || {})[sc.img] || (SHOTS_JSON.en || {})[sc.img] || {};
    var src = 'setup/' + (SHOTS_JSON[l] && SHOTS_JSON[l][sc.img] ? l : 'en') + '/' + sc.img + '.webp';
    var spots = (meta.spots || {});
    return '<div class="r-img"><img src="' + src + '" alt="" width="' + (meta.w || sc.w) + '" height="' + (meta.h || '') + '">' +
      Object.keys(spots).map(function (n) {
        var b = spots[n];
        return '<span class="r-spot" data-dot="' + n + '" style="left:' + (b[0] * 100) + '%;top:' + (b[1] * 100) + '%;width:' + (b[2] * 100) + '%;height:' + (b[3] * 100) + '%"></span>';
      }).join('') + '</div>';
  }

  // ── Zoom: the same picture, as big as the window allows ──
  var box = null;
  function lightbox(fig, frame) {
    if (!box) {
      box = document.createElement('div');
      box.className = 'shotbox';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.innerHTML = '<div class="shotbox-inner"><button type="button" class="shotbox-close" aria-label="Close">✕</button><div class="shotbox-slot"></div></div>';
      document.body.appendChild(box);
      box.addEventListener('click', function (e) { if (e.target === box || e.target.closest('.shotbox-close')) closeBox(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('open')) closeBox(); });
    }
    var slot = box.querySelector('.shotbox-slot');
    slot.innerHTML = '';
    var copy = document.createElement('figure');
    copy.className = 'shot shot-big';
    if (fig.dataset.scenes) copy.dataset.scenes = fig.dataset.scenes;
    if (fig.dataset.scene) copy.dataset.scene = fig.dataset.scene;
    copy.dataset.start = frame;
    slot.appendChild(copy);
    box.classList.add('open');
    document.documentElement.classList.add('shotbox-lock');
    var c = new Shot(copy);
    mounted.push(c);
    box.querySelector('.shotbox-close').focus();
    box.__opener = fig.querySelector('.shot-win');
    setTimeout(function () { c.layout(); c.tour(); }, 60);
  }
  function closeBox() {
    box.classList.remove('open');
    document.documentElement.classList.remove('shotbox-lock');
    var slot = box.querySelector('.shotbox-slot');
    var copy = slot.querySelector('.shot');
    mounted = mounted.filter(function (c) { return !copy || c !== copy.__sg; });
    slot.innerHTML = '';
    if (box.__opener) box.__opener.focus();
  }

  // ── "Do this" lists ⇄ dots ──
  // A list and its picture share the closest .step (or .shot-pair) box.
  function linkLists(root) {
    (root || document).querySelectorAll('ol.do').forEach(function (ol) {
      if (ol.__sgLinked) return;
      ol.__sgLinked = true;
      var host = ol.closest('.shot-pair') || ol.closest('.step') || ol.parentNode;
      function shot() {
        var f = ol.dataset.shot ? document.getElementById(ol.dataset.shot) : host.querySelector('.shot');
        return f && f.__sg;
      }
      ol.querySelectorAll('li[data-dot]').forEach(function (li) {
        function on() {
          var s = shot(); if (!s) return;
          if (li.dataset.frame) s.go(+li.dataset.frame - 1);
          s.hot(li.dataset.dot, true);
          li.classList.add('hot');
        }
        function off() {
          var s = shot(); if (s) s.hot(li.dataset.dot, false);
          li.classList.remove('hot');
        }
        li.addEventListener('mouseenter', on);
        li.addEventListener('mouseleave', off);
        li.addEventListener('focusin', on);
        li.addEventListener('focusout', off);
        // Tapping a line on a phone: light it for a moment
        li.addEventListener('click', function (e) {
          if (e.target.closest('a, button')) return;
          on(); setTimeout(off, 1600);
        });
      });
    });
    // …and hovering a dot lights its line
    (root || document).querySelectorAll('.shot:not(.shot-big)').forEach(function (fig) {
      if (fig.__sgDotLinked) return;
      fig.__sgDotLinked = true;
      var host = fig.closest('.shot-pair') || fig.closest('.step');
      fig.addEventListener('mouseover', function (e) {
        var ring = e.target.closest('.shot-ring, .shot-dot');
        if (!host) return;
        host.querySelectorAll('ol.do li.hot').forEach(function (li) { li.classList.remove('hot'); });
        if (ring) {
          var li = host.querySelector('ol.do li[data-dot="' + ring.dataset.n + '"]');
          if (li) li.classList.add('hot');
        }
      });
      fig.addEventListener('mouseleave', function () {
        if (host) host.querySelectorAll('ol.do li.hot').forEach(function (li) { li.classList.remove('hot'); });
      });
    });
  }

  // The pointer tour plays the first time each picture scrolls into view
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && e.intersectionRatio > 0.55 && e.target.__sg) {
        e.target.__sg.layout();
        e.target.__sg.tour();
      }
    });
  }, { threshold: [0.55] }) : null;

  function mountAll(root) {
    (root || document).querySelectorAll('figure.shot:not(.shot-ready):not(.shot-big)').forEach(function (fig) {
      var c = new Shot(fig);
      if (!c || !c.names) return;
      mounted.push(c);
      if (io) io.observe(fig);
    });
    linkLists(root);
  }
  function refresh(root) {
    mounted.forEach(function (c) { c.layout(); });
  }
  function relang() {
    mounted.forEach(function (c) { c.render(); });
  }

  // Real screenshots' measurements, one file per language, loaded once
  function loadShots(l, cb) {
    if (SHOTS_JSON[l]) return cb();
    fetch('setup/' + l + '/shots.json').then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (j) { SHOTS_JSON[l] = j || {}; cb(); })
      .catch(function () { SHOTS_JSON[l] = {}; cb(); });
  }
  function needsShots() {
    return Object.keys(SCENES).some(function (k) { return SCENES[k].img; });
  }

  // Webfonts change the drawn screens' text widths; re-pin once they land
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  window.addEventListener('beforeprint', refresh);

  window.SGShots = {
    mountAll: function (root) {
      if (!needsShots()) return mountAll(root);
      loadShots('en', function () { loadShots(lang(), function () { mountAll(root); }); });
    },
    refresh: refresh,
    relang: function () {
      if (!needsShots()) return relang();
      loadShots(lang(), relang);
    },
    tour: function (fig) { if (fig && fig.__sg) fig.__sg.tour(); },
    SCENES: SCENES,
    LBL: LBL
  };
})();
