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

  /* ── Sheets steps 5–7: labels ───────────────────────────────────────────
     Google's own words for the approval, Share and Apps Script screens.
     The script's project name is shown as "Last.fm Sync": Google prints the
     project's own name there, which the "Do this" text says may differ. */
  var MORE = {
    en: {
      cap_gs_lfm: 'Your sheet, with the template’s Last.fm menu',
      cap_auth1: 'Authorization required',
      cap_auth2: 'Choose an account',
      cap_auth3: 'The “unverified app” screen',
      cap_auth4: 'The permissions screen',
      a1_t: 'Authorization required',
      a1_p: 'A script attached to this document needs your permission to run.',
      a_cancel: 'Cancel',
      a1_ok: 'Review permissions',
      a2_t: 'Choose an account',
      a2_s: 'to continue to <b>Last.fm Sync</b>',
      a2_other: 'Use another account',
      a3_t: 'Google hasn’t verified this app',
      a3_p: 'The app is requesting access to sensitive info in your Google Account. Until the developer (alex@gmail.com) verifies this app with Google, you shouldn’t use it.',
      a3_adv: 'Advanced',
      a3_safe: 'BACK TO SAFETY',
      a3_risk: 'Continue only if you understand the risks and trust the developer (alex@gmail.com).',
      a3_go: 'Go to Last.fm Sync (unsafe)',
      a4_t: 'Last.fm Sync wants access to your Google Account',
      a4_p1: 'See, edit, create and delete all your Google Sheets spreadsheets',
      a4_p2: 'Connect to an external service',
      a4_p3: 'Allow this application to run when you are not present',
      a4_allow: 'Allow',
      cap_gs_sharebtn: 'The Share button, top right',
      cap_gs_share: 'The Share dialog',
      sh_t: 'Share “Copy of Full Music History…”',
      sh_add: 'Add people, groups and calendar events',
      sh_people: 'People with access',
      sh_owner: 'Owner',
      sh_you: 'Alex (you)',
      sh_general: 'General access',
      sh_anyone: 'Anyone with the link',
      sh_anyone_d: 'Anyone on the internet with the link can view',
      sh_viewer: 'Viewer',
      sh_copy: 'Copy link',
      sh_done: 'Done',
      cap_as_deploy: 'Apps Script: the Deploy menu',
      cap_as_new: 'The New deployment window',
      cap_as_done: 'The Web app URL, ready to copy',
      as_proj: 'Last.fm Sync',
      as_run: 'Run',
      as_debug: 'Debug',
      as_deploy: 'Deploy',
      as_new: 'New deployment',
      as_manage: 'Manage deployments',
      as_test: 'Test deployments',
      as_newt: 'New deployment',
      as_type: 'Select type',
      as_web: 'Web app',
      as_api: 'API Executable',
      as_addon: 'Add-on',
      as_lib: 'Library',
      as_conf: 'Configuration',
      as_desc: 'Description',
      as_webapp: 'Web app',
      as_exec: 'Execute as',
      as_me: 'Me (alex@gmail.com)',
      as_who: 'Who has access',
      as_anyone: 'Anyone',
      as_doit: 'Deploy',
      as_okt: 'New deployment',
      as_ok: 'Deployment successfully created.',
      as_id: 'Deployment ID',
      as_url: 'Web app',
      as_urll: 'URL',
      as_copy: 'Copy',
      as_donebtn: 'Done'
    },
    es: {
      cap_gs_lfm: 'Tu hoja, con el menú Last.fm de la plantilla',
      cap_auth1: 'Se requiere autorización',
      cap_auth2: 'Elige una cuenta',
      cap_auth3: 'La pantalla de “aplicación no verificada”',
      cap_auth4: 'La pantalla de permisos',
      a1_t: 'Se requiere autorización',
      a1_p: 'Una secuencia de comandos adjunta a este documento necesita tu permiso para ejecutarse.',
      a_cancel: 'Cancelar',
      a1_ok: 'Revisar permisos',
      a2_t: 'Elige una cuenta',
      a2_s: 'para ir a <b>Last.fm Sync</b>',
      a2_other: 'Usar otra cuenta',
      a3_t: 'Google no ha verificado esta aplicación',
      a3_p: 'La aplicación solicita acceso a información sensible de tu cuenta de Google. Hasta que el desarrollador (alex@gmail.com) verifique esta aplicación con Google, no deberías utilizarla.',
      a3_adv: 'Configuración avanzada',
      a3_safe: 'VOLVER A LUGAR SEGURO',
      a3_risk: 'Continúa solo si comprendes los riesgos y confías en el desarrollador (alex@gmail.com).',
      a3_go: 'Ir a Last.fm Sync (no seguro)',
      a4_t: 'Last.fm Sync quiere acceder a tu cuenta de Google',
      a4_p1: 'Ver, editar, crear y eliminar todas tus hojas de cálculo de Hojas de cálculo de Google',
      a4_p2: 'Conectarse a un servicio externo',
      a4_p3: 'Permitir que esta aplicación se ejecute cuando no estés presente',
      a4_allow: 'Permitir',
      cap_gs_sharebtn: 'El botón Compartir, arriba a la derecha',
      cap_gs_share: 'La ventana Compartir',
      sh_t: 'Compartir “Copia de Full Music History…”',
      sh_add: 'Añadir personas, grupos y eventos de calendario',
      sh_people: 'Personas con acceso',
      sh_owner: 'Propietario',
      sh_you: 'Alex (tú)',
      sh_general: 'Acceso general',
      sh_anyone: 'Cualquier persona que tenga el enlace',
      sh_anyone_d: 'Cualquier usuario de Internet que tenga el enlace puede ver',
      sh_viewer: 'Lector',
      sh_copy: 'Copiar enlace',
      sh_done: 'Hecho',
      cap_as_deploy: 'Apps Script: el menú Implementar',
      cap_as_new: 'La ventana Nueva implementación',
      cap_as_done: 'La URL de la aplicación web, lista para copiar',
      as_run: 'Ejecutar',
      as_debug: 'Depurar',
      as_deploy: 'Implementar',
      as_new: 'Nueva implementación',
      as_manage: 'Gestionar implementaciones',
      as_test: 'Probar implementaciones',
      as_newt: 'Nueva implementación',
      as_type: 'Seleccionar tipo',
      as_web: 'Aplicación web',
      as_api: 'Ejecutable de API',
      as_addon: 'Complemento',
      as_lib: 'Biblioteca',
      as_conf: 'Configuración',
      as_desc: 'Descripción',
      as_webapp: 'Aplicación web',
      as_exec: 'Ejecutar como',
      as_me: 'Yo (alex@gmail.com)',
      as_who: 'Quién tiene acceso',
      as_anyone: 'Cualquier usuario',
      as_doit: 'Implementar',
      as_okt: 'Nueva implementación',
      as_ok: 'La implementación se ha creado correctamente.',
      as_id: 'ID de implementación',
      as_url: 'Aplicación web',
      as_copy: 'Copiar',
      as_donebtn: 'Hecho'
    },
    'pt-BR': {
      cap_gs_lfm: 'Sua planilha, com o menu Last.fm do modelo',
      cap_auth1: 'Autorização necessária',
      cap_auth2: 'Escolha uma conta',
      cap_auth3: 'A tela de “app não verificado”',
      cap_auth4: 'A tela de permissões',
      a1_t: 'Autorização necessária',
      a1_p: 'Um script anexado a este documento precisa da sua permissão para ser executado.',
      a_cancel: 'Cancelar',
      a1_ok: 'Revisar permissões',
      a2_t: 'Escolha uma conta',
      a2_s: 'para continuar no app <b>Last.fm Sync</b>',
      a2_other: 'Usar outra conta',
      a3_t: 'O Google não verificou este app',
      a3_p: 'O app está solicitando acesso a informações confidenciais na sua Conta do Google. Não use este app até que o desenvolvedor (alex@gmail.com) faça a verificação com o Google.',
      a3_adv: 'Avançado',
      a3_safe: 'VOLTAR À SEGURANÇA',
      a3_risk: 'Continue apenas se você entende os riscos e confia no desenvolvedor (alex@gmail.com).',
      a3_go: 'Acessar Last.fm Sync (não seguro)',
      a4_t: 'Last.fm Sync quer acessar sua Conta do Google',
      a4_p1: 'Ver, editar, criar e excluir todas as suas planilhas do Google Planilhas',
      a4_p2: 'Conectar a um serviço externo',
      a4_p3: 'Permitir que este aplicativo seja executado quando você não estiver presente',
      a4_allow: 'Permitir',
      cap_gs_sharebtn: 'O botão Compartilhar, no canto superior direito',
      cap_gs_share: 'A janela Compartilhar',
      sh_t: 'Compartilhar “Cópia de Full Music History…”',
      sh_add: 'Adicionar pessoas, grupos e eventos da agenda',
      sh_people: 'Pessoas com acesso',
      sh_owner: 'Proprietário',
      sh_you: 'Alex (você)',
      sh_general: 'Acesso geral',
      sh_anyone: 'Qualquer pessoa com o link',
      sh_anyone_d: 'Qualquer pessoa na Internet com o link pode ver',
      sh_viewer: 'Leitor',
      sh_copy: 'Copiar link',
      sh_done: 'Concluído',
      cap_as_deploy: 'Apps Script: o menu Implantar',
      cap_as_new: 'A janela Nova implantação',
      cap_as_done: 'O URL do app da Web, pronto para copiar',
      as_run: 'Executar',
      as_debug: 'Depurar',
      as_deploy: 'Implantar',
      as_new: 'Nova implantação',
      as_manage: 'Gerenciar implantações',
      as_test: 'Testar implantações',
      as_newt: 'Nova implantação',
      as_type: 'Selecionar tipo',
      as_web: 'App da Web',
      as_api: 'Executável de API',
      as_addon: 'Complemento',
      as_lib: 'Biblioteca',
      as_conf: 'Configuração',
      as_desc: 'Descrição',
      as_webapp: 'App da Web',
      as_exec: 'Executar como',
      as_me: 'Eu (alex@gmail.com)',
      as_who: 'Quem pode acessar',
      as_anyone: 'Qualquer pessoa',
      as_doit: 'Implantar',
      as_okt: 'Nova implantação',
      as_ok: 'Implantação criada.',
      as_id: 'ID da implantação',
      as_url: 'App da Web',
      as_copy: 'Copiar',
      as_donebtn: 'Concluído'
    },
    'pt-PT': {
      cap_gs_lfm: 'A tua folha, com o menu Last.fm do modelo',
      cap_auth1: 'Autorização necessária',
      cap_auth2: 'Escolha uma conta',
      cap_auth3: 'O ecrã de “app não validada”',
      cap_auth4: 'O ecrã de autorizações',
      a1_t: 'Autorização necessária',
      a1_p: 'Um script anexado a este documento precisa da sua autorização para ser executado.',
      a_cancel: 'Cancelar',
      a1_ok: 'Rever autorizações',
      a2_t: 'Escolha uma conta',
      a2_s: 'para continuar para <b>Last.fm Sync</b>',
      a2_other: 'Utilizar outra conta',
      a3_t: 'A Google não validou esta app',
      a3_p: 'A app está a pedir acesso a informações confidenciais na sua Conta Google. Até o programador (alex@gmail.com) validar esta app com a Google, não a deve utilizar.',
      a3_adv: 'Avançadas',
      a3_safe: 'VOLTAR À SEGURANÇA',
      a3_risk: 'Continue apenas se compreender os riscos e confiar no programador (alex@gmail.com).',
      a3_go: 'Aceder a Last.fm Sync (não seguro)',
      a4_t: 'Last.fm Sync pretende aceder à sua Conta Google',
      a4_p1: 'Ver, editar, criar e eliminar todas as suas folhas de cálculo do Google Sheets',
      a4_p2: 'Ligar a um serviço externo',
      a4_p3: 'Permitir que esta aplicação seja executada quando não está presente',
      a4_allow: 'Permitir',
      cap_gs_sharebtn: 'O botão Partilhar, no canto superior direito',
      cap_gs_share: 'A janela Partilhar',
      sh_t: 'Partilhar “Cópia de Full Music History…”',
      sh_add: 'Adicionar pessoas, grupos e eventos do calendário',
      sh_people: 'Pessoas com acesso',
      sh_owner: 'Proprietário',
      sh_you: 'Alex (você)',
      sh_general: 'Acesso geral',
      sh_anyone: 'Qualquer pessoa com o link',
      sh_anyone_d: 'Qualquer pessoa na Internet com o link pode ver',
      sh_viewer: 'Leitor',
      sh_copy: 'Copiar link',
      sh_done: 'Concluído',
      cap_as_deploy: 'Apps Script: o menu Implementar',
      cap_as_new: 'A janela Nova implementação',
      cap_as_done: 'O URL da app Web, pronto a copiar',
      as_run: 'Executar',
      as_debug: 'Depurar',
      as_deploy: 'Implementar',
      as_new: 'Nova implementação',
      as_manage: 'Gerir implementações',
      as_test: 'Testar implementações',
      as_newt: 'Nova implementação',
      as_type: 'Selecionar tipo',
      as_web: 'App Web',
      as_api: 'Executável da API',
      as_addon: 'Suplemento',
      as_lib: 'Biblioteca',
      as_conf: 'Configuração',
      as_desc: 'Descrição',
      as_webapp: 'App Web',
      as_exec: 'Executar como',
      as_me: 'Eu (alex@gmail.com)',
      as_who: 'Quem tem acesso',
      as_anyone: 'Qualquer pessoa',
      as_doit: 'Implementar',
      as_okt: 'Nova implementação',
      as_ok: 'Implementação criada com êxito.',
      as_id: 'ID da implementação',
      as_url: 'App Web',
      as_copy: 'Copiar',
      as_donebtn: 'Concluído'
    }
  };
  Object.keys(MORE).forEach(function (l) { LBL[l] = LBL[l] || {}; Object.assign(LBL[l], MORE[l]); });

  // The four Google screens you meet the first time the script runs
  function gAuthPage(inner) {
    return '<div class="r-page r-gauth"><div class="r-gauth-card">' + inner + '</div></div>';
  }
  var LFM_ITEMS = ['Fetch Latest Tracks', 'Start Auto-Update (90 min)', '-', 'Start Genre Fetcher', 'Stop Genre Fetcher'];

  // A Google dialog drawn over the sheet
  function gDialog(cls, inner) { return '<div class="r-gdlg ' + (cls || '') + '">' + inner + '</div>'; }

  // Apps Script editor shell
  function asEditor(L, extra) {
    return '<div class="r-page r-as">' +
      '<div class="r-as-top"><span class="r-as-logo" aria-hidden="true"></span><span class="r-as-name">Apps Script</span>' +
        '<span class="r-as-proj">' + L('as_proj') + '</span>' +
        '<span class="r-as-right">' + (extra && extra.deploy || '<span class="r-btn-fill r-btn-pill r-as-dep">' + L('as_deploy') + ' ▾</span>') + '<span class="r-avatar r-avatar-sm">A</span></span></div>' +
      '<div class="r-as-main"><div class="r-as-side"><i></i><i class="on"></i><i></i><i></i><i></i></div>' +
        '<div class="r-as-files"><b>Code.gs</b></div>' +
        '<div class="r-as-code">' +
          '<div class="r-as-bar"><span>↶</span><span>↷</span><span>▶ ' + L('as_run') + '</span><span>' + L('as_debug') + '</span><span class="r-as-fn">fetchAndLogLastFmHistory ▾</span></div>' +
          '<pre><span class="k">function</span> <span class="f">getSettings_</span>() {\n  <span class="k">var</span> ss = SpreadsheetApp.getActiveSpreadsheet();\n  <span class="k">var</span> s  = ss.getSheetByName(<span class="s">\'Settings\'</span>);\n  …\n}\n\n<span class="k">function</span> <span class="f">doPost</span>(e) {\n  <span class="c">// receives a play from dankcharts.fm</span>\n  …\n}</pre>' +
        '</div>' +
      '</div>' +
      (extra && extra.overlay ? '<div class="r-scrim"></div>' + extra.overlay : '') +
    '</div>';
  }

  Object.assign(SCENES, {
    // Sheets step 5 — the Last.fm menu (reload the sheet if it's missing)
    'gs-lfm': {
      url: 'docs.google.com/spreadsheets/d/…/edit', w: 840, cap: 'cap_gs_lfm',
      html: function (L) {
        return gsApp(L, { tab: 'data', rows: dataRows(), minRows: 7, lastfm: true, open: 'lastfm',
          lfmItems: LFM_ITEMS, menuDot: { lastfm: 1 }, itemDot: { 1: 2 }, ref: 'A1', fx: 'Song Title' });
      }
    },
    'g-auth1': {
      url: 'docs.google.com/spreadsheets/d/…/edit', w: 840, cap: 'cap_auth1',
      html: function (L) {
        return gsApp(L, { tab: 'data', rows: dataRows(), minRows: 7, lastfm: true, ref: 'A1', fx: 'Song Title',
          overlay: gDialog('r-gdlg-sm',
            '<h4>' + L('a1_t') + '</h4><p>' + L('a1_p') + '</p>' +
            '<div class="r-gdlg-actions"><span class="r-btn-text">' + L('a_cancel') + '</span><span class="r-btn-fill" data-dot="3">' + L('a1_ok') + '</span></div>') });
      }
    },
    'g-auth2': {
      url: 'accounts.google.com/o/oauth2/…', w: 720, cap: 'cap_auth2',
      html: function (L) {
        return gAuthPage(G_DISC +
          '<h4 class="r-gauth-h">' + L('a2_t') + '</h4><p class="r-gauth-sub">' + L('a2_s') + '</p>' +
          '<div class="r-acct" data-dot="4"><span class="r-avatar">A</span><span><b>Alex</b><br><small>alex@gmail.com</small></span></div>' +
          '<div class="r-acct r-acct-other"><span class="r-acct-ico">⊕</span><span>' + L('a2_other') + '</span></div>');
      }
    },
    'g-auth3': {
      url: 'accounts.google.com/o/oauth2/…', w: 720, cap: 'cap_auth3',
      html: function (L) {
        return gAuthPage(G_DISC +
          '<h4 class="r-gauth-h r-gauth-warn"><span class="r-warn-ico">⚠</span>' + L('a3_t') + '</h4>' +
          '<p class="r-gauth-p">' + L('a3_p') + '</p>' +
          '<div class="r-gauth-row"><span class="r-link" data-dot="5">' + L('a3_adv') + '</span><span class="r-btn-fill">' + L('a3_safe') + '</span></div>' +
          '<div class="r-gauth-more"><p class="r-gauth-p">' + L('a3_risk') + '</p><span class="r-link r-link-u" data-dot="6">' + L('a3_go') + '</span></div>');
      }
    },
    'g-auth4': {
      url: 'accounts.google.com/o/oauth2/…', w: 720, cap: 'cap_auth4',
      html: function (L) {
        return gAuthPage(G_DISC +
          '<h4 class="r-gauth-h">' + L('a4_t') + '</h4>' +
          '<p class="r-gauth-acct"><span class="r-avatar r-avatar-xs">A</span>alex@gmail.com</p>' +
          '<ul class="r-perms"><li>' + L('a4_p1') + '</li><li>' + L('a4_p2') + '</li><li>' + L('a4_p3') + '</li></ul>' +
          '<div class="r-gauth-row r-gauth-end"><span class="r-btn-out">' + L('a_cancel') + '</span><span class="r-btn-fill r-btn-pill" data-dot="7">' + L('a4_allow') + '</span></div>');
      }
    },

    // Sheets step 6 — Share → Anyone with the link · Viewer → Copy link
    'gs-sharebtn': {
      url: 'docs.google.com/spreadsheets/d/…/edit', w: 840, cap: 'cap_gs_sharebtn',
      html: function (L) {
        return gsApp(L, { tab: 'data', rows: dataRows(), minRows: 7, lastfm: true, share: 1, ref: 'A1', fx: 'Song Title' });
      }
    },
    'gs-share': {
      url: 'docs.google.com/spreadsheets/d/…/edit', w: 840, cap: 'cap_gs_share',
      html: function (L) {
        return gsApp(L, { tab: 'data', rows: dataRows(), minRows: 9, lastfm: true, ref: 'A1', fx: 'Song Title',
          overlay: gDialog('r-gdlg-share',
            '<h4>' + L('sh_t') + '</h4>' +
            '<span class="r-input r-input-empty r-share-add">' + L('sh_add') + '</span>' +
            '<p class="r-share-lbl">' + L('sh_people') + '</p>' +
            '<div class="r-share-person"><span class="r-avatar r-avatar-xs">A</span><span>' + L('sh_you') + '<br><small>alex@gmail.com</small></span><span class="r-share-role">' + L('sh_owner') + '</span></div>' +
            '<p class="r-share-lbl">' + L('sh_general') + '</p>' +
            '<div class="r-share-general"><span class="r-share-globe">🌐</span>' +
              '<span class="r-share-gtext"><span class="r-share-sel" data-dot="1" data-dot-at="r">' + L('sh_anyone') + ' ▾</span><small>' + L('sh_anyone_d') + '</small></span>' +
              '<span class="r-share-sel r-share-rolesel" data-dot="2" data-dot-at="r">' + L('sh_viewer') + ' ▾</span></div>' +
            '<div class="r-gdlg-actions r-share-actions"><span class="r-btn-out" data-dot="3">🔗 ' + L('sh_copy') + '</span><span class="r-btn-fill r-btn-pill">' + L('sh_done') + '</span></div>') });
      }
    },

    // Sheets step 7 — Apps Script: Deploy → New deployment → ⚙ Web app
    'as-deploy': {
      url: 'script.google.com/u/0/home/projects/…/edit', w: 840, cap: 'cap_as_deploy',
      html: function (L) {
        return asEditor(L, { deploy:
          '<span class="r-dd-host"><span class="r-btn-fill r-btn-pill r-as-dep" data-dot="1">' + L('as_deploy') + ' ▾</span>' +
          '<span class="r-dd r-dd-right"><span class="r-dd-item" data-dot="2" data-dot-at="l">' + L('as_new') + '</span><span class="r-dd-item">' + L('as_manage') + '</span><span class="r-dd-item">' + L('as_test') + '</span></span></span>' });
      }
    },
    'as-new': {
      url: 'script.google.com/u/0/home/projects/…/edit', w: 840, cap: 'cap_as_new',
      html: function (L) {
        return asEditor(L, { overlay: gDialog('r-gdlg-dep',
          '<h4>' + L('as_newt') + '</h4>' +
          '<div class="r-dep-grid">' +
            '<div class="r-dep-left"><p class="r-share-lbl">' + L('as_type') + ' <span class="r-gear" data-dot="3" data-dot-at="r">⚙</span></p>' +
              '<div class="r-dep-pop"><span class="r-dd-item r-dd-on" data-dot="4" data-dot-at="l">' + L('as_web') + '</span><span class="r-dd-item">' + L('as_api') + '</span><span class="r-dd-item">' + L('as_addon') + '</span><span class="r-dd-item">' + L('as_lib') + '</span></div></div>' +
            '<div class="r-dep-right"><p class="r-share-lbl">' + L('as_conf') + '</p>' +
              '<span class="r-input r-input-empty">' + L('as_desc') + '</span>' +
              '<p class="r-dep-sub">' + L('as_webapp') + '</p>' +
              '<label class="r-dep-f"><small>' + L('as_exec') + '</small><span class="r-share-sel r-dep-sel" data-dot="5" data-dot-at="r">' + L('as_me') + ' ▾</span></label>' +
              '<label class="r-dep-f"><small>' + L('as_who') + '</small><span class="r-share-sel r-dep-sel" data-dot="6" data-dot-at="r">' + L('as_anyone') + ' ▾</span></label>' +
            '</div>' +
          '</div>' +
          '<div class="r-gdlg-actions"><span class="r-btn-text">' + L('a_cancel') + '</span><span class="r-btn-fill" data-dot="7">' + L('as_doit') + '</span></div>') });
      }
    },
    'as-done': {
      url: 'script.google.com/u/0/home/projects/…/edit', w: 840, cap: 'cap_as_done',
      html: function (L) {
        return asEditor(L, { overlay: gDialog('r-gdlg-dep',
          '<h4>' + L('as_okt') + '</h4>' +
          '<p class="r-dep-ok">✓ ' + L('as_ok') + '</p>' +
          '<p class="r-share-lbl">' + L('as_id') + '</p><p class="r-dep-mono">AKfycbx3Qm…7hT2</p>' +
          '<p class="r-share-lbl">' + L('as_url') + '</p>' +
          '<div class="r-dep-urlrow"><span class="r-dep-mono r-dep-url">https://script.google.com/macros/s/AKfycbx3Qm…7hT2/exec</span><span class="r-btn-out" data-dot="8">⧉ ' + L('as_copy') + '</span></div>' +
          '<div class="r-gdlg-actions"><span class="r-btn-fill">' + L('as_donebtn') + '</span></div>') });
      }
    }
  });

  /* ── Last.fm path: the "allow access" page Connect opens ──────────────── */
  ['en', 'es', 'pt-BR', 'pt-PT'].forEach(function (l) {
    LBL[l].cap_lfm_auth = {
      en: 'Last.fm asks you to allow access',
      es: 'Last.fm te pide que permitas el acceso',
      'pt-BR': 'O Last.fm pede que você permita o acesso',
      'pt-PT': 'O Last.fm pede-te que permitas o acesso'
    }[l];
  });
  SCENES['lfm-auth'] = {
    url: 'www.last.fm/api/auth/?api_key=…',
    w: 720,
    cap: 'cap_lfm_auth',
    html: function () {
      return lfmPage(
        '<h4 class="r-lfm-h">Connect application</h4>' +
        '<div class="r-lfm-app"><span class="r-lfm-appico">♫</span><span><b>My Music Charts</b><br><small>would like to connect to your Last.fm account <b>alex_listens</b></small></span></div>' +
        '<ul class="r-lfm-perms"><li>Scrobble tracks to your profile</li><li>See your profile and listening history</li></ul>' +
        '<div class="r-lfm-actions r-lfm-actions-c"><span class="r-lfm-btn" data-dot="1">Yes, allow access</span><span class="r-lfm-no">No thanks</span></div>'
      );
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
    // Offsets belong to the screen's place in the attribute, so pair them up
    // before dropping any screen this page doesn't have (yet)
    var allOffsets = (fig.dataset.offsets || '').split(',');
    var offsets = [], orig = [];
    names = names.filter(function (n, i) {
      if (!SCENES[n]) return false;
      offsets.push(allOffsets[i] || 0);
      orig.push(i);
      return true;
    });
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
      // data-offsets="0,2,2" shifts each screen's dot numbers, so a list that
      // runs across several screens counts 1, 2, 3 … straight through
      var off = +(offsets[cur] || 0);
      if (off) layer.querySelectorAll('[data-dot]').forEach(function (el) {
        el.setAttribute('data-dot', +el.getAttribute('data-dot') + off);
      });
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
      layer.querySelectorAll('[data-dot]').forEach(function (el, idx) {
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
        dot.style.animationDelay = (0.12 * idx) + 's';   // pop in one after another
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
    // A list line's data-frame counts screens as written in the attribute
    this.goOrig = function (i) { var k = orig.indexOf(i); if (k >= 0) self.go(k); };
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
    if (fig.dataset.offsets) copy.dataset.offsets = fig.dataset.offsets;
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
          if (li.dataset.frame) s.goOrig(+li.dataset.frame - 1);
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
