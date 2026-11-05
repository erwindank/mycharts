/* ═══════════════════════════════════════════════════════════════════════
   LIBRARY SEARCH — the magnifier in the top bar (2026-11-04)
   Replaces the "Search your library" button that used to sit on the Charts
   Guide, which only listed names and then dropped you on the All-Time chart.
   This one is on every page (top bar; also "/" or Ctrl/⌘+K) and searches
   artists, songs and albums across every play you have — Last.fm, Google
   Sheets and CSV uploads alike, since it only reads allPlays.
   Picking a result:
     • saves it to the search history (what you typed + what you picked),
     • opens that artist / song / album exactly as a click on the All-Time
       chart would (currentPeriod is 'alltime' while the window is built, so
       the Rankings tab picks the same chart it would from there).
   With the box empty it shows the history: recent searches as chips (click
   one to run it again) and recent picks as rows (click to reopen).
   History is per browser (localStorage 'dc_lib_search_hist').
   Loaded after app.js and panel.js; reads their globals at click time.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Words in the four site languages (English fills any gap) ─────── */
  const TXT = {
    en: {
      btn: 'Search', ph: 'Search artists, songs and albums…',
      artists: 'Artists', songs: 'Songs', albums: 'Albums',
      recent_q: 'Recent searches', recent: 'Recently opened', clear: 'Clear history',
      none: 'Nothing in your library matches “{q}”.', empty: 'Type an artist, song or album name.',
      nodata: 'Your library is still loading — try again in a moment.',
      plays_one: 'play', plays_other: 'plays', remove: 'Remove from history',
      hint_nav: 'to move', hint_open: 'to open', hint_close: 'to close'
    },
    es: {
      btn: 'Buscar', ph: 'Busca artistas, canciones y álbumes…',
      artists: 'Artistas', songs: 'Canciones', albums: 'Álbumes',
      recent_q: 'Búsquedas recientes', recent: 'Abiertos hace poco', clear: 'Borrar historial',
      none: 'Nada en tu biblioteca coincide con «{q}».', empty: 'Escribe un artista, una canción o un álbum.',
      nodata: 'Tu biblioteca aún se está cargando; inténtalo en un momento.',
      plays_one: 'reproducción', plays_other: 'reproducciones', remove: 'Quitar del historial',
      hint_nav: 'para moverte', hint_open: 'para abrir', hint_close: 'para cerrar'
    },
    'pt-BR': {
      btn: 'Buscar', ph: 'Busque artistas, músicas e álbuns…',
      artists: 'Artistas', songs: 'Músicas', albums: 'Álbuns',
      recent_q: 'Buscas recentes', recent: 'Abertos recentemente', clear: 'Limpar histórico',
      none: 'Nada na sua biblioteca corresponde a “{q}”.', empty: 'Digite um artista, uma música ou um álbum.',
      nodata: 'Sua biblioteca ainda está carregando — tente de novo em instantes.',
      plays_one: 'play', plays_other: 'plays', remove: 'Remover do histórico',
      hint_nav: 'para mover', hint_open: 'para abrir', hint_close: 'para fechar'
    },
    'pt-PT': {
      btn: 'Pesquisar', ph: 'Pesquisa artistas, músicas e álbuns…',
      artists: 'Artistas', songs: 'Músicas', albums: 'Álbuns',
      recent_q: 'Pesquisas recentes', recent: 'Abertos recentemente', clear: 'Limpar histórico',
      none: 'Nada na tua biblioteca corresponde a “{q}”.', empty: 'Escreve um artista, uma música ou um álbum.',
      nodata: 'A tua biblioteca ainda está a carregar — tenta de novo daqui a pouco.',
      plays_one: 'reprodução', plays_other: 'reproduções', remove: 'Remover do histórico',
      hint_nav: 'para mover', hint_open: 'para abrir', hint_close: 'para fechar'
    }
  };
  function tx(k, q) {
    const lang = (typeof currentLang !== 'undefined' && TXT[currentLang]) ? currentLang : 'en';
    const s = (TXT[lang] && TXT[lang][k]) || TXT.en[k] || k;
    return q == null ? s : s.replace('{q}', q);
  }
  const plays = n => n.toLocaleString() + ' ' + tx(n === 1 ? 'plays_one' : 'plays_other');
  const escH = s => (typeof esc === 'function') ? esc(s) : String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  /* Same line icons as the guide used: mic = artist, note = song, disc = album */
  const ICO = {
    artist: '<path d="M8 1.8a2.2 2.2 0 0 1 2.2 2.2v3.2a2.2 2.2 0 0 1-4.4 0V4A2.2 2.2 0 0 1 8 1.8Z"/><path d="M4 7.2a4 4 0 0 0 8 0M8 11.2v3"/>',
    song: '<path d="M6 12.2V3.6l7-1.6v8.6"/><circle cx="4.3" cy="12.2" r="1.7"/><circle cx="11.3" cy="10.6" r="1.7"/>',
    album: '<circle cx="8" cy="8" r="6.2"/><circle cx="8" cy="8" r="1.6"/>',
    search: '<circle cx="7" cy="7" r="4.6"/><path d="M10.4 10.4 14 14"/>',
    clock: '<circle cx="8" cy="8" r="6.2"/><path d="M8 4.6V8l2.3 1.5"/>',
    x: '<path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/>'
  };
  const ico = (n, cls) => `<svg class="${cls || 'lsx-ico'}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICO[n]}</svg>`;

  /* ── Matching helpers ──────────────────────────────────────────────── */
  // Lower case, accents dropped, so "beyonce" finds "Beyoncé"
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  /* ── The index: one pass over allPlays, rebuilt only when the plays change ── */
  let _idx = null, _idxTag = '';
  function buildIndex() {
    const P = (typeof allPlays !== 'undefined' && allPlays) || [];
    const tag = P.length + '|' + (P[0] ? +P[0].date : '') + '|' + (typeof _stampEpoch !== 'undefined' ? _stampEpoch : '');
    if (_idx && tag === _idxTag) return _idx;
    const artists = new Map(), songs = new Map(), albums = new Map();
    for (const p of P) {
      // Split credits, the same list openArtistModal() filters on
      const credits = p.artists && p.artists.length ? p.artists : [p.artist];
      for (const a of credits) {
        const r = artists.get(a);
        if (r) r.n++; else artists.set(a, { kind: 'artist', key: a, name: a, n: 1 });
      }
      const sk = songKey(p);
      const s = songs.get(sk);
      if (s) { s.n++; s.title = p.title; s.artist = p.artist; } // newest→oldest: keeps the first-played spelling
      else songs.set(sk, { kind: 'song', key: sk, title: p.title, artist: p.artist, n: 1 });
      if (p.album && p.album !== '—') {
        const ak = albumKeyOf(p);
        const al = albums.get(ak);
        if (al) al.n++;
        else albums.set(ak, { kind: 'album', key: ak, title: p.album, artist: ak.split('|||')[1] || p.artist, n: 1 });
      }
    }
    // Pre-normalised text: the name to rank on, and everything to filter on
    const prep = (r, main, rest) => { r.nm = norm(main); r.all = r.nm + ' ' + norm(rest); return r; };
    _idx = {
      artists: [...artists.values()].map(r => prep(r, r.name, '')),
      songs: [...songs.values()].map(r => prep(r, r.title, r.artist)),
      albums: [...albums.values()].map(r => prep(r, r.title, r.artist))
    };
    _idxTag = tag;
    return _idx;
  }

  /* Best first: the name equals the query, starts with it, has a word that
     starts with it, then anything that merely contains every word; ties go
     to the most played. Every word typed must appear somewhere (title or
     artist), so "stay hayley" finds Stay The Night by Zedd ft. Hayley. */
  function rank(list, q, words, max) {
    const out = [];
    for (const r of list) {
      let ok = true;
      for (const w of words) if (!r.all.includes(w)) { ok = false; break; }
      if (!ok) continue;
      const tier = r.nm === q ? 0 : r.nm.startsWith(q) ? 1 : (' ' + r.nm).includes(' ' + q) ? 2 : r.nm.includes(q) ? 3 : 4;
      out.push({ r, tier });
    }
    out.sort((a, b) => a.tier - b.tier || b.r.n - a.r.n);
    return out.slice(0, max).map(o => o.r);
  }

  /* ── History ───────────────────────────────────────────────────────── */
  const HKEY = 'dc_lib_search_hist';
  const H_MAX = 8;
  function loadHist() {
    try { const h = JSON.parse(localStorage.getItem(HKEY) || '{}'); return { q: h.q || [], picks: h.picks || [] }; }
    catch (e) { return { q: [], picks: [] }; }
  }
  function saveHist(h) { try { localStorage.setItem(HKEY, JSON.stringify(h)); } catch (e) {} }
  function remember(query, r) {
    const h = loadHist();
    const q = String(query || '').trim();
    if (q) h.q = [q, ...h.q.filter(x => x.toLowerCase() !== q.toLowerCase())].slice(0, H_MAX);
    const pick = { kind: r.kind, key: r.key, title: r.kind === 'artist' ? r.name : r.title, artist: r.kind === 'artist' ? '' : r.artist, ts: Date.now() };
    h.picks = [pick, ...h.picks.filter(p => !(p.kind === pick.kind && p.key === pick.key))].slice(0, H_MAX);
    saveHist(h);
  }

  /* ── The window ────────────────────────────────────────────────────── */
  let root, input, body, items = [], active = -1, lastFocus = null;

  function mount() {
    if (root) return;
    root = document.createElement('div');
    root.id = 'lsx';
    root.className = 'lsx';
    root.hidden = true;
    root.innerHTML = `
      <div class="lsx-backdrop" data-lsx-close></div>
      <div class="lsx-panel" role="dialog" aria-modal="true">
        <div class="lsx-field">
          ${ico('search', 'lsx-field-ico')}
          <input type="search" id="lsxInput" class="lsx-input" autocomplete="off" spellcheck="false"
            role="combobox" aria-expanded="true" aria-controls="lsxBody" aria-autocomplete="list">
          <button type="button" class="lsx-esc" data-lsx-close>Esc</button>
        </div>
        <div id="lsxBody" class="lsx-body" role="listbox"></div>
        <div class="lsx-foot"><span><kbd>↑</kbd><kbd>↓</kbd> <span data-lsx-t="hint_nav"></span></span><span><kbd>↵</kbd> <span data-lsx-t="hint_open"></span></span><span><kbd>Esc</kbd> <span data-lsx-t="hint_close"></span></span></div>
      </div>`;
    document.body.appendChild(root);
    input = root.querySelector('#lsxInput');
    body = root.querySelector('#lsxBody');

    input.addEventListener('input', () => render());
    input.addEventListener('keydown', onKey);
    root.addEventListener('click', onClick);
  }

  function open(prefill) {
    mount();
    lastFocus = document.activeElement;
    // Words follow the language picked at the moment the window opens
    input.placeholder = tx('ph');
    input.setAttribute('aria-label', tx('ph'));
    root.querySelector('.lsx-panel').setAttribute('aria-label', tx('ph'));
    root.querySelectorAll('[data-lsx-t]').forEach(el => { el.textContent = tx(el.dataset.lsxT); });
    input.value = prefill || '';
    root.hidden = false;
    document.documentElement.classList.add('lsx-open');
    render();
    requestAnimationFrame(() => { input.focus(); input.select(); });
  }

  function close(restoreFocus) {
    if (!root || root.hidden) return;
    root.hidden = true;
    document.documentElement.classList.remove('lsx-open');
    if (restoreFocus && lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ── Drawing ───────────────────────────────────────────────────────── */
  function hl(text, words) {
    // Highlight the typed words inside a name (accent-blind, on the raw text)
    const raw = String(text);
    const n = norm(raw);
    if (n.length !== raw.length || !words.length) return escH(raw); // accents changed the length: skip highlighting
    const mark = new Array(raw.length).fill(false);
    for (const w of words) { let i = n.indexOf(w); while (i !== -1) { for (let j = i; j < i + w.length; j++) mark[j] = true; i = n.indexOf(w, i + w.length); } }
    let out = '', on = false;
    for (let i = 0; i < raw.length; i++) {
      if (mark[i] !== on) { out += mark[i] ? '<mark>' : '</mark>'; on = mark[i]; }
      out += escH(raw[i]);
    }
    return out + (on ? '</mark>' : '');
  }

  function row(r, words, i, extra) {
    const name = r.kind === 'artist' ? r.name : r.title;
    const sub = r.kind === 'artist' ? '' : r.artist;
    const meta = r.n != null ? `<span class="lsx-n">${escH(plays(r.n))}</span>` : '';
    return `<div class="lsx-item" role="option" id="lsxOpt${i}" data-i="${i}">
      <span class="lsx-kind lsx-kind-${r.kind}">${ico(r.kind)}</span>
      <span class="lsx-txt"><span class="lsx-name">${hl(name, words)}</span>${sub ? `<span class="lsx-sub">${hl(sub, words)}</span>` : ''}</span>
      ${meta}${extra || ''}
    </div>`;
  }

  function render() {
    const P = (typeof allPlays !== 'undefined' && allPlays) || [];
    const raw = input.value;
    const q = norm(raw);
    items = [];
    active = -1;
    let html = '';

    if (!q) {
      // Empty box: the history
      const h = loadHist();
      if (h.q.length) {
        html += `<div class="lsx-group"><div class="lsx-head">${escH(tx('recent_q'))}</div><div class="lsx-chips">`
          + h.q.map(s => `<button type="button" class="lsx-chip" data-q="${escH(s)}">${ico('clock')}${escH(s)}</button>`).join('')
          + '</div></div>';
      }
      if (h.picks.length) {
        // Live play counts where the library has the entry; a pick no longer in it is dropped from view
        const idx = P.length ? buildIndex() : null;
        const find = p => idx && (p.kind === 'artist' ? idx.artists : p.kind === 'song' ? idx.songs : idx.albums).find(r => r.key === p.key);
        const rows = [];
        for (const p of h.picks) {
          const live = find(p);
          if (P.length && !live) continue;
          const r = live || { kind: p.kind, key: p.key, name: p.title, title: p.title, artist: p.artist };
          items.push(r);
          rows.push(row(r, [], items.length - 1, `<button type="button" class="lsx-rm" data-rm="${escH(p.kind + '\u0001' + p.key)}" title="${escH(tx('remove'))}" aria-label="${escH(tx('remove'))}">${ico('x')}</button>`));
        }
        if (rows.length) html += `<div class="lsx-group"><div class="lsx-head">${escH(tx('recent'))}</div>${rows.join('')}</div>`;
      }
      if (h.q.length || h.picks.length) html += `<button type="button" class="lsx-clear" data-clear>${escH(tx('clear'))}</button>`;
      if (!html) html = `<div class="lsx-empty">${escH(tx(P.length ? 'empty' : 'nodata'))}</div>`;
    } else if (!P.length) {
      html = `<div class="lsx-empty">${escH(tx('nodata'))}</div>`;
    } else {
      const idx = buildIndex();
      const words = q.split(/\s+/).filter(Boolean);
      const groups = [
        ['artists', rank(idx.artists, q, words, 5)],
        ['songs', rank(idx.songs, q, words, 6)],
        ['albums', rank(idx.albums, q, words, 4)]
      ];
      for (const [g, list] of groups) {
        if (!list.length) continue;
        html += `<div class="lsx-group"><div class="lsx-head">${escH(tx(g))}</div>`;
        for (const r of list) { items.push(r); html += row(r, words, items.length - 1); }
        html += '</div>';
      }
      if (!items.length) html = `<div class="lsx-empty">${escH(tx('none', raw.trim()))}</div>`;
    }
    body.innerHTML = html;
    if (q && items.length) setActive(0);
    else input.removeAttribute('aria-activedescendant');
  }

  function setActive(i) {
    const els = body.querySelectorAll('.lsx-item');
    if (!els.length) return;
    active = (i + els.length) % els.length;
    els.forEach((el, j) => { el.classList.toggle('is-active', j === active); el.setAttribute('aria-selected', j === active ? 'true' : 'false'); });
    input.setAttribute('aria-activedescendant', 'lsxOpt' + active);
    els[active].scrollIntoView({ block: 'nearest' });
  }

  /* ── Picking: save, close, open as from the All-Time chart ─────────── */
  function pick(r) {
    remember(input.value, r);
    close(false);
    const fn = r.kind === 'artist' ? window.openArtistModal : r.kind === 'album' ? window.openAlbumModal : window.openSongModal;
    if (typeof fn !== 'function') return;
    // The windows read currentPeriod to choose their first chart (Rankings);
    // pretend we are on All-Time while they are built, then put it back.
    let prev;
    try { prev = currentPeriod; currentPeriod = 'alltime'; } catch (e) { prev = undefined; }
    try { fn(r.key); }
    finally { if (prev !== undefined) { try { currentPeriod = prev; } catch (e) {} } }
  }

  function onClick(e) {
    if (e.target.closest('[data-lsx-close]')) { close(true); return; }
    const rm = e.target.closest('[data-rm]');
    if (rm) {
      e.stopPropagation();
      const [kind, key] = rm.dataset.rm.split('\u0001');
      const h = loadHist();
      h.picks = h.picks.filter(p => !(p.kind === kind && p.key === key));
      saveHist(h);
      render();
      input.focus();
      return;
    }
    if (e.target.closest('[data-clear]')) { saveHist({ q: [], picks: [] }); render(); input.focus(); return; }
    const chip = e.target.closest('[data-q]');
    if (chip) { input.value = chip.dataset.q; render(); input.focus(); return; }
    const it = e.target.closest('.lsx-item');
    if (it) { const r = items[+it.dataset.i]; if (r) pick(r); }
  }

  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const r = items[active >= 0 ? active : 0];
      if (r) pick(r);
    } else if (e.key === 'Escape') {
      // Ours alone: don't let the page's own Esc handlers also close things behind
      e.preventDefault(); e.stopPropagation();
      if (input.value) { input.value = ''; render(); } else close(true);
    }
  }

  /* ── Opening it: the top-bar button, "/" and Ctrl/⌘+K anywhere ─────── */
  document.addEventListener('keydown', e => {
    const tgt = e.target;
    const typing = tgt && (tgt.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(tgt.tagName));
    const isK = (e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'k' || e.key === 'K');
    const isSlash = e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !typing;
    if (!isK && !isSlash) return;
    if (root && !root.hidden) { if (isK) { e.preventDefault(); input.focus(); input.select(); } return; }
    e.preventDefault();
    open();
  });

  // Exposed for the top-bar button (index.html) and anything else that wants it
  window.dcOpenLibrarySearch = open;
  window.dcCloseLibrarySearch = close;
})();
