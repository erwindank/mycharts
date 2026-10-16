/* ─── ALL-TIME CHART INSIGHTS ("Inside your Top N") ─────────────────────────
   A stats section for the All-Time charts (songs, artists and albums), shown
   once the chart on screen is set to a real size (Top 50 / 100 / 200 / a
   custom number) rather than All Entries, because "who has the most songs in
   it" only means something when the chart has a cut-off. With All Entries it
   shows a dismissible tip that offers to switch to Top 100 instead.

   It follows the Songs / Artists / Albums switch: each chart gets the stats
   that make sense for it (an artists chart has no "albums with the most
   songs", an albums chart has no "one song carries them").

   Layout, top to bottom:
     1. Heading "Inside your Top N songs/artists/albums" + See all stats
     2. A hero fact with artwork and an "Another fact" button (always shown)
     3. When opened: four headline tiles, then the chart type's tabs. Rows,
        bars and tiers open the entries behind them; every entry opens its
        own window.

   Everything is worked out from allPlays and fullData (the chart that is on
   screen), so it works the same for Last.fm, Google Sheets and CSV. The
   chart from a year ago is ranked by the chart's own builders
   (buildSongsFull / buildArtistsFull / buildAlbumsFull), so it follows the
   same roll-up, bucket and tie-break rules as the real one. The one outside
   lookup is release years: the same album-year lookup the awards picker uses
   (_awardsAlbumYearOnce: iTunes → Deezer → MusicBrainz), cached in
   localStorage forever, and only asked for once the Eras tab is opened.

   Lives in its own file like board.js and support.js; it only reads app.js
   globals (allPlays, fullData, chartSize*AT, chartTypeView, currentPeriod…).
   renderAll() calls atiRender() at the end of every render, and
   setChartTypeView() calls it when the chart type is switched. */

const ATI_LS_OPEN = 'dc_ati_open';      // '1' when the stats are opened
const ATI_LS_TAB  = 'dc_ati_tab';       // last tab picked
const ATI_LS_HINT = 'dc_ati_hint_off';  // '1' once the All Entries tip is dismissed
// Which tabs each chart type gets, in order
const ATI_TYPE_TABS = {
  songs:   ['artists', 'eras', 'plays', 'badges', 'new'],
  albums:  ['artists', 'eras', 'plays', 'badges', 'new'],
  artists: ['songs', 'plays', 'discovery', 'new'],
};
const ATI_YEAR_PARALLEL = 4;            // release-year lookups in flight at once

function _atiLsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function _atiLsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

const _ati = {
  open: _atiLsGet(ATI_LS_OPEN) === '1',
  tab: _atiLsGet(ATI_LS_TAB) || 'artists',   // checked against the chart type's tabs when used
  data: null,        // the last _atiCompute() result
  sig: '',           // what that result was computed from
  fact: 0,           // which hero fact is showing
  eraSel: null,      // picked decade on the Eras tab
  discSel: null,     // picked discovery year
  imgSeq: 0,         // unique ids for artwork placeholders
  imgQ: [],          // artwork waiting for loadImages()
  years: { running: false, total: 0, done: 0 },
  yearTimer: null,
};

// ── Small helpers ────────────────────────────────────────────────────────────

// A number in the number font (DESIGN.md: mono means numbers)
function _atiN(n) { return `<span class="ati-n">${typeof n === 'number' ? n.toLocaleString() : n}</span>`; }
function _atiPct(x) {
  const v = x * 100;
  return (v >= 10 || v === 0 ? Math.round(v) : v.toFixed(1)) + '%';
}
function _atiCount(key, n) { return `${_atiN(n)} ${tUnit(key, n)}`; }
function _atiB(text) { return `<b>${esc(text)}</b>`; }
function _atiYearKey(e) { return e.alb ? e.alb.toLowerCase() + '|||' + e.albArtist.toLowerCase() : ''; }
// Release year of an entry's album: a number, null (looked up, not found) or undefined (not asked yet)
function _atiYearOf(e) {
  const k = _atiYearKey(e);
  if (!k) return null;
  return (k in _awardsAlbumYearCache) ? _awardsAlbumYearCache[k] : undefined;
}
function _atiDays(ms) { return Math.max(0, Math.round(ms / 864e5)); }
function _atiDaysText(d) { return d < 1 ? t('ati_same_day') : _atiCount('days', d); }
// The unit word for one entry of a chart type ("songs", "artists", "albums")
function _atiUnit(type) { return type; }
function _atiTabs(type) { return ATI_TYPE_TABS[type] || ATI_TYPE_TABS.songs; }
function _atiTab(type) { const tabs = _atiTabs(type); return tabs.includes(_ati.tab) ? _ati.tab : tabs[0]; }
// The All-Time size of each chart, and the size bar that sets it
function _atiSize(type) { return type === 'artists' ? chartSizeArtistsAT : type === 'albums' ? chartSizeAlbumsAT : chartSizeSongsAT; }
function _atiSizeBarId(type) { return 'sizeBtns' + type.charAt(0).toUpperCase() + type.slice(1) + 'AT'; }

/* Artwork placeholder. The picture is filled in by loadImages() after the
   HTML lands (see _atiFlushImages), the same lazy path the chart rows use. */
function _atiArt(kind, o, cls) {
  const imgId = 'ati-img-' + (++_ati.imgSeq);
  let item;
  if (kind === 'artist') {
    item = { imgId, name: o.name, prefKey: 'artist:' + o.name.toLowerCase() };
  } else if (kind === 'album') {
    item = { imgId, album: o.album, artist: o.artist, name: o.album, prefKey: 'album:' + o.artist.toLowerCase() + '|||' + o.album.toLowerCase() };
  } else {
    item = { imgId, title: o.title, artist: o.artist, album: o.album || '', name: o.title, prefKey: 'song:' + o.artist.toLowerCase() + '|||' + o.title.toLowerCase() };
  }
  item._kind = kind;
  _ati.imgQ.push(item);
  return `<span class="ati-art ${cls || ''}${kind === 'artist' ? ' ati-art--round' : ''}"><span id="${imgId}" class="ati-art-in"><span class="thumb-initials">${esc(initials(item.name))}</span></span></span>`;
}
function _atiEntryArt(e, cls) { return _atiArt(e.art[0], e.art[1], cls); }
function _atiFlushImages() {
  const q = _ati.imgQ; _ati.imgQ = [];
  ['song', 'album', 'artist'].forEach(kind => {
    const items = q.filter(i => i._kind === kind);
    if (items.length) loadImages(items, kind);
  });
}
// What clicking something opens: its own window
function _atiOpenAttrs(kind, key) { return `data-ati="open" data-kind="${kind}" data-key="${esc(key)}"`; }

// ── The numbers ──────────────────────────────────────────────────────────────

/* One chart entry, the same shape for all three chart types, so every stat
   below can be written once. `open` is what clicking it opens, `art` its
   picture, `artists` who it is credited to (for the per-artist stats). */
function _atiEntry(type, it, i) {
  if (type === 'artists') {
    return { type, it, rank: i + 1, key: it.name, ttl: it.name, sub: '', count: it.count,
             artists: [it.name], alb: '', albArtist: '', songsN: it.songs ? it.songs.size : 0,
             songMap: new Map(), open: ['artist', it.name], art: ['artist', { name: it.name }], times: [], prevRank: null };
  }
  if (type === 'albums') {
    const key = it.album + '|||' + it.artist;
    return { type, it, rank: i + 1, key, ttl: it.album, sub: it.artist, count: it.count,
             artists: it.artist && it.artist !== VARIOUS_ARTISTS ? [it.artist] : [],
             alb: it.album, albArtist: it.artist, tracksN: it.tracks ? it.tracks.size : 0,
             open: ['album', key], art: ['album', { album: it.album, artist: it.artist }], times: [], prevRank: null };
  }
  const alb = (it.album && it.album !== '—') ? it.album : '';
  const key = songKey(it);
  return { type, it, rank: i + 1, key, ttl: it.title, sub: it.artist, count: it.count,
           artists: splitArtists(it.artist).filter(a => a && a !== VARIOUS_ARTISTS),
           alb, albArtist: alb ? albumArtistOfSong(it) : '',
           open: ['song', key], art: ['song', { title: it.title, artist: it.artist, album: it.album }], times: [], prevRank: null };
}
// The key a chart builder's row would have as an entry
function _atiKeyOf(type, it) {
  return type === 'artists' ? it.name : type === 'albums' ? it.album + '|||' + it.artist : songKey(it);
}

/* Everything the section shows, from the chart on screen. Cached on a
   signature so the frequent re-renders (marking a release, opening a modal)
   cost a string compare, not two passes over every play. */
function _atiCompute(type, items, N) {
  const last = items[items.length - 1];
  const sig = [type, allPlays.length, typeof _stampEpoch !== 'undefined' ? _stampEpoch : 0,
               typeof albumsChartFilter !== 'undefined' ? albumsChartFilter : '', N, items.length,
               _atiKeyOf(type, items[0]), items[0].count, _atiKeyOf(type, last), last.count].join('|');
  if (_ati.data && _ati.sig === sig) return _ati.data;

  const E = items.map((it, i) => _atiEntry(type, it, i));
  const byKey = new Map(E.map(e => [e.key, e]));

  /* One pass: each entry's play times (and, for artists, which of their
     songs), the plays up to a year ago, how many different songs / artists /
     albums exist at all, and when the library starts. */
  const yearAgo = tzNow(); yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  const cut = +yearAgo;
  const before = [];
  const uniq = new Set();
  const roll = type === 'albums' && typeof rollupAffectsCharts === 'function' && rollupAffectsCharts();
  let earliest = Infinity;
  /* Plays that count toward any entry, each counted once. Summing the
     entries' play counts double-counts a duet on the artists chart (both
     artists get the play) and a rolled-up single on the albums chart, so the
     chart's share of all listening uses this instead. */
  let playsOnce = 0;
  for (const p of allPlays) {
    const m = tzMsOf(p);
    if (m < earliest) earliest = m;
    if (m <= cut) before.push(p);
    if (type === 'songs') {
      const k = songKey(p);
      uniq.add(k);
      const e = byKey.get(k);
      if (e) { e.times.push(m); playsOnce++; }
    } else if (type === 'artists') {
      let hit = false;
      for (const a of p.artists) {
        uniq.add(a);
        const e = byKey.get(a);
        if (!e) continue;
        hit = true;
        e.times.push(m);
        const sk = songKey(p), s = e.songMap.get(sk);
        if (s) s.count++; else e.songMap.set(sk, { key: sk, title: p.title, artist: p.artist, album: p.album, count: 1 });
      }
      if (hit) playsOnce++;
    } else {
      if (!p.album || p.album === '—') continue;
      const k = albumKeyOf(p);
      uniq.add(k);
      const e = byKey.get(k);
      if (e) e.times.push(m);
      // A single's play also counts toward its album when roll-up is on (as in buildAlbumsFull)
      const par = roll ? rollupParentOf(p) : null;
      const e2 = par && par !== k ? byKey.get(par) : null;
      if (e2) e2.times.push(m);
      if (e || e2) playsOnce++;
    }
  }
  E.forEach(e => e.times.sort((a, b) => a - b));

  // The chart a year ago, ranked by the chart's own builder
  const build = type === 'artists' ? buildArtistsFull : type === 'albums' ? buildAlbumsFull : buildSongsFull;
  build(before, null).forEach((it, i) => { const e = byKey.get(_atiKeyOf(type, it)); if (e) e.prevRank = i + 1; });
  const young = earliest > cut;    // no chart a year ago to compare against
  const fresh = E.filter(e => !e.prevRank || e.prevRank > N);

  // Artists, by entries in the chart (songs and albums charts)
  const byArtist = new Map();
  E.forEach(e => e.artists.forEach(a => { (byArtist.get(a) || byArtist.set(a, []).get(a)).push(e); }));
  const artists = type === 'artists' ? [] : [...byArtist.entries()].map(([name, list]) => ({ name, list }))
    .sort((a, b) => (b.list.length - a.list.length) || (a.list[0].rank - b.list[0].rank));

  // Songs chart: albums by songs in the chart
  const byAlbum = new Map();
  if (type === 'songs') E.forEach(e => {
    if (!e.alb) return;
    const k = e.alb + '|||' + e.albArtist;
    if (!byAlbum.has(k)) byAlbum.set(k, { key: k, album: e.alb, artist: e.albArtist, list: [] });
    byAlbum.get(k).list.push(e);
  });
  const albums = [...byAlbum.values()].filter(a => a.list.length >= 2)
    .sort((a, b) => (b.list.length - a.list.length) || (a.list[0].rank - b.list[0].rank));

  // Albums chart: the albums with the most different tracks played
  const tracks = type === 'albums' ? [...E].sort((a, b) => (b.tracksN - a.tracksN) || (a.rank - b.rank)).slice(0, 5) : [];

  // Artists chart: depth (different songs played) and how much one song carries each
  let depth = [], carry = [];
  if (type === 'artists') {
    E.forEach(e => {
      e.songs = [...e.songMap.values()].sort((a, b) => b.count - a.count);
      e.carry = e.songs[0] && e.count ? e.songs[0].count / e.count : 0;
    });
    depth = [...E].sort((a, b) => (b.songsN - a.songsN) || (a.rank - b.rank)).slice(0, 10);
    // One-song artists are trivially 100%; the interesting ones have a catalogue
    carry = E.filter(e => e.songs.length >= 2).sort((a, b) => (b.carry - a.carry) || (a.rank - b.rank)).slice(0, 5);
  }

  // Who owns the top 10 (songs and albums charts)
  const top10 = new Map();
  if (type !== 'artists') E.slice(0, 10).forEach(e => e.artists.forEach(a => top10.set(a, (top10.get(a) || 0) + 1)));
  const top10Max = Math.max(0, ...top10.values());
  const top10Owners = top10Max >= 2 ? [...top10.entries()].filter(([, n]) => n === top10Max).map(([a]) => a) : [];

  /* The top 3 artists' share. Songs/albums: entries credited to any of them,
     counted once. Artists chart: the top 3 entries' share of the chart's plays. */
  const totalPlays = E.reduce((n, e) => n + e.count, 0);
  const top3 = type === 'artists' ? E.slice(0, 3).map(e => ({ name: e.ttl, list: [e], plays: e.count })) : artists.slice(0, 3);
  const top3Set = new Set(top3.map(a => a.name));
  const top3N = type === 'artists' ? top3.reduce((n, a) => n + a.plays, 0)
                                   : E.filter(e => e.artists.some(a => top3Set.has(a))).length;
  const top3Share = type === 'artists' ? (totalPlays ? top3N / totalPlays : 0) : top3N / E.length;

  const oneHit = artists.filter(a => a.list.length === 1);

  /* Fastest into the chart: days from an entry's first play to the play
     count the last spot has today, the bar every entry had to clear.
     Pointless when the bar is a handful of plays (half the chart "gets in"
     the same day), so it needs at least five. */
  const bar = last.count;
  let fast = [], slow = [];
  if (bar >= 5) {
    const timed = E.filter(e => e.times.length >= bar)
      .map(e => ({ e, days: (e.times[bar - 1] - e.times[0]) / 864e5 }));
    fast = [...timed].sort((a, b) => (a.days - b.days) || (a.e.rank - b.e.rank)).slice(0, 5);
    slow = [...timed].sort((a, b) => (b.days - a.days) || (a.e.rank - b.e.rank)).slice(0, 3);
  }

  // The year each entry got its first play, and who has been around longest
  const disc = new Map();
  E.forEach(e => { if (!e.times.length) return; const y = new Date(e.times[0]).getFullYear(); (disc.get(y) || disc.set(y, []).get(y)).push(e); });
  const byFirst = E.filter(e => e.times.length).sort((a, b) => a.times[0] - b.times[0]);

  /* Certification tiers and how far each entry is from its next plaque.
     Songs use the song ladder; albums the ladder of their release type
     (album / single / EP), exactly like the chart's badges. Artists have none. */
  const tiers = { diamond: [], plat: [], gold: [], none: [] };
  const next = [];
  const ladders = new Set();
  if (type !== 'artists') E.forEach(e => {
    const kind = type === 'songs' ? 'song' : certKindFor(e.alb, e.albArtist);
    const C = CERT[kind] || CERT.album;
    ladders.add(kind);
    const c = e.count;
    if (c >= C.diamond) {
      tiers.diamond.push(e);
      const mult = Math.floor(c / C.diamond);
      next.push({ e, need: (mult + 1) * C.diamond - c, label: tDiamondLabel(mult + 1) });
    } else if (c >= C.plat) { tiers.plat.push(e); next.push({ e, need: C.diamond - c, label: t('cert_diamond') }); }
    else if (c >= C.gold)   { tiers.gold.push(e); next.push({ e, need: C.plat - c, label: t('cert_plat') }); }
    else                    { tiers.none.push(e); next.push({ e, need: C.gold - c, label: t('cert_gold') }); }
  });
  next.sort((a, b) => (a.need - b.need) || (a.e.rank - b.e.rank));

  const d = {
    type, N, E, young, fresh, cut, artists, albums, tracks, depth, carry, top10Owners, top10Max,
    top3, top3N, top3Share, oneHit, totalPlays, playsOnce, allPlaysN: allPlays.length, uniqN: uniq.size,
    bar, fast, slow, disc, byFirst, tiers, next: next.slice(0, 5), ladders: [...ladders],
  };
  _ati.data = d; _ati.sig = sig;
  return d;
}

// Release types are read live (marking one re-renders), not cached with the rest
function _atiReleaseTypes(d) {
  const groups = { album: [], single: [], ep: [], live: [], soundtrack: [], none: [] };
  d.E.forEach(e => {
    const ty = e.alb ? releaseTypeOf(e.alb, e.albArtist) : 'none';
    (groups[ty] || groups.album).push(e);
  });
  return groups;
}

// Years are read live too: they keep arriving while the section is open
function _atiEras(d) {
  const thisYear = tzNow().getFullYear();
  const known = [], pending = [];
  d.E.forEach(e => {
    const y = _atiYearOf(e);
    if (typeof y === 'number') known.push({ e, y });
    else if (y === undefined) pending.push(e);
  });
  const decades = new Map();
  known.forEach(k => { const dec = Math.floor(k.y / 10) * 10; (decades.get(dec) || decades.set(dec, []).get(dec)).push(k.e); });
  const byYear = [...known].sort((a, b) => (a.y - b.y) || (a.e.rank - b.e.rank));
  const avgAge = known.length ? known.reduce((n, k) => n + (thisYear - k.y), 0) / known.length : null;
  // Years between release and the first play, where both are known
  const gaps = known.filter(k => k.e.times.length).map(k => Math.max(0, new Date(k.e.times[0]).getFullYear() - k.y));
  const avgGap = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : null;
  return {
    known, pending, decades,
    oldest: byYear[0] || null,
    newest: byYear.length ? [...byYear].sort((a, b) => (b.y - a.y) || (a.e.rank - b.e.rank))[0] : null,
    avgAge, avgGap, unknown: d.E.length - known.length - pending.length,
  };
}

// ── Release-year lookups ─────────────────────────────────────────────────────

/* Asks for the year of every album in the chart that has not been looked up
   yet, a few at a time, and redraws the Eras tab as answers arrive. Started
   only once the Eras tab is opened; answers are kept forever by the awards
   cache, so a second visit starts with them. */
function _atiPumpYears(d) {
  if (_ati.years.running) return;
  const seen = new Set(), todo = [];
  d.E.forEach(e => {
    const k = _atiYearKey(e);
    if (!k || seen.has(k)) return;
    seen.add(k);
    if (_atiYearOf(e) === undefined) todo.push(e);
  });
  if (!todo.length) return;
  _ati.years = { running: true, total: todo.length, done: 0 };
  let i = 0;
  const worker = async () => {
    while (i < todo.length) {
      const e = todo[i++];
      try { await _awardsAlbumYearOnce(e.alb, e.albArtist); } catch (err) {}
      _ati.years.done++;
      _atiYearsChanged();
    }
  };
  Promise.all(Array.from({ length: ATI_YEAR_PARALLEL }, worker)).then(() => {
    _ati.years.running = false;
    _atiYearsChanged(true);
  });
}

// Redraw what depends on years, at most every 700ms while lookups land
function _atiYearsChanged(now) {
  clearTimeout(_ati.yearTimer);
  _ati.yearTimer = setTimeout(() => {
    const el = document.getElementById('atInsights');
    if (!el || el.hidden || !_ati.data) return;
    if (_ati.open && _atiTab(_ati.data.type) === 'eras') _atiRenderPanel();
  }, now ? 0 : 700);
}

// ── Markup pieces ────────────────────────────────────────────────────────────

/* A list of chart entries (rank, title over artist, a number); each opens
   its own window. `extra(e)` replaces the play count on the right. */
function _atiList(list, extra) {
  return `<ol class="ati-songs">${list.map(e => `
    <li><button type="button" class="ati-song" ${_atiOpenAttrs(e.open[0], e.open[1])}>
      <span class="ati-song-rk">${_atiN('#' + e.rank)}</span>
      <span class="ati-song-tx"><span class="ati-song-t">${esc(e.ttl)}</span>${e.sub ? `<span class="ati-song-a">${esc(e.sub)}</span>` : ''}</span>
      <span class="ati-song-pl">${extra ? extra(e) : _atiCount('plays', e.count)}</span>
    </button></li>`).join('')}</ol>`;
}

/* A row that opens the entries behind it. `head` is the row's visible part,
   `link` an optional "Open artist / album" action shown with the list,
   `body` the list itself (defaults to _atiList(list)). */
function _atiRow(head, count, max, list, link, body) {
  const w = max ? Math.max(4, Math.round(count / max * 100)) : 0;
  return `<div class="ati-row-wrap">
    <button type="button" class="ati-row" data-ati="row" aria-expanded="false">
      ${head}
      <span class="ati-row-bar" aria-hidden="true"><span class="ati-bar-fill" style="--w:${w}%"></span></span>
      <span class="ati-row-n">${_atiN(count)}</span>
      <svg class="ati-chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="ati-sub" hidden>${link || ''}${body !== undefined ? body : _atiList(list)}</div>
  </div>`;
}

/* Column chart (decades, discovery years). The picked column's entries show
   underneath; `sel` is the picked label, kept in _ati so a redraw keeps it. */
function _atiColumns(groups, kind, sel, label, unit) {
  if (!groups.length) return '';
  const max = Math.max(...groups.map(g => g.list.length));
  const cols = groups.map(g => {
    const h = Math.max(6, Math.round(g.list.length / max * 100));
    const on = String(g.id) === String(sel);
    return `<button type="button" class="ati-col${on ? ' is-on' : ''}" data-ati="col" data-kind="${kind}" data-id="${esc(String(g.id))}" aria-pressed="${on}"
        title="${esc(label(g.id))}: ${g.list.length.toLocaleString()} ${esc(tUnit(unit, g.list.length))}">
      <span class="ati-col-n">${_atiN(g.list.length)}</span>
      <span class="ati-col-track"><span class="ati-col-fill" style="--h:${h}%"></span></span>
      <span class="ati-col-l">${esc(label(g.id))}</span>
    </button>`;
  }).join('');
  const picked = groups.find(g => String(g.id) === String(sel));
  return `<div class="ati-cols" role="group">${cols}</div>
    ${picked ? `<div class="ati-col-pick"><div class="ati-col-pick-h">${esc(label(picked.id))} · ${_atiCount(unit, picked.list.length)}</div>${_atiList(picked.list)}</div>` : ''}`;
}

// A highlighted single entry (oldest, newest…) with its picture
function _atiSpot(label, e, line) {
  if (!e) return '';
  return `<button type="button" class="ati-spot" ${_atiOpenAttrs(e.open[0], e.open[1])}>
    ${_atiEntryArt(e, 'ati-art--md')}
    <span class="ati-spot-tx">
      <span class="ati-spot-l">${esc(label)}</span>
      <span class="ati-spot-t">${esc(e.ttl)}</span>
      <span class="ati-spot-a">${e.sub ? esc(e.sub) : ''}${e.sub && line ? ' · ' : ''}${line || ''}</span>
    </span>
  </button>`;
}

function _atiDecadeLabel(dec) { return t('ati_decade_short', { d: dec }); }

/* The discovery-year columns, picking the busiest year the first time */
function _atiDiscoveryHtml(d) {
  const groups = [...d.disc.entries()].sort((a, b) => a[0] - b[0]).map(([id, list]) => ({ id, list }));
  if (groups.length && (_ati.discSel === null || !d.disc.has(+_ati.discSel))) {
    _ati.discSel = [...groups].sort((a, b) => b.list.length - a.list.length)[0].id;
  }
  const subKey = d.type === 'artists' ? 'ati_discover_sub_artist' : d.type === 'albums' ? 'ati_discover_sub_album' : 'ati_discover_sub';
  return `<h3 class="ati-h">${esc(t('ati_discover_title'))}</h3>
    <p class="ati-note">${esc(t(subKey))}</p>
    ${_atiColumns(groups, 'disc', _ati.discSel, id => String(id), _atiUnit(d.type))}`;
}

// ── Hero facts ───────────────────────────────────────────────────────────────

/* One-liners for the hero, built from whatever the chart has. Each carries
   the entry whose picture shows beside it and opens when it is clicked. */
function _atiFacts(d) {
  const N = _atiN(d.N), f = [];
  const unit = _atiUnit(d.type);
  const add = (html, art, open) => f.push({ html, art, open });
  const artistArt = name => [['artist', { name }], ['artist', name]];
  const s0 = d.E[0], s1 = d.E[1];

  if (d.type === 'artists') {
    if (s0) add(t('ati_f_art_share', { artist: _atiB(s0.ttl), pct: _atiN(_atiPct(s0.count / d.totalPlays)), N }), ...artistArt(s0.ttl));
    const dp = d.depth[0];
    if (dp) add(t('ati_f_depth', { artist: _atiB(dp.ttl), n: _atiCount('songs', dp.songsN) }), ...artistArt(dp.ttl));
    const cr = d.carry[0];
    if (cr && cr.songs[0]) add(t('ati_f_carry', { artist: esc(cr.ttl), pct: _atiN(_atiPct(cr.carry)), title: _atiB(cr.songs[0].title) }), ...artistArt(cr.ttl));
    if (d.top3.length === 3) add(t('ati_share_line_artists', { pct: _atiN(_atiPct(d.top3Share)) }), ...artistArt(d.top3[0].name));
    const fr = d.byFirst[0];
    if (fr) add(t('ati_f_friend', { artist: _atiB(fr.ttl), date: esc(fmtDate(new Date(fr.times[0]))) }), ...artistArt(fr.ttl));
  } else {
    const a0 = d.artists[0];
    if (a0 && a0.list.length >= 2) add(t('ati_f_most', { artist: _atiB(a0.name), n: _atiCount(unit, a0.list.length), N }), ...artistArt(a0.name));
    if (a0) add(t('ati_f_artists', { n: _atiN(d.artists.length), N }), ...artistArt(a0.name));
    if (d.type === 'songs' && d.albums[0]) {
      const al = d.albums[0];
      add(t('ati_f_album', { album: _atiB(al.album), artist: esc(al.artist), n: _atiCount('songs', al.list.length) }),
          ['album', { album: al.album, artist: al.artist }], ['album', al.key]);
    }
    if (d.type === 'albums' && d.tracks[0] && d.tracks[0].tracksN > 1) {
      const tr = d.tracks[0];
      add(t('ati_f_tracks', { album: _atiB(tr.ttl), n: _atiCount('songs', tr.tracksN) }), tr.art, tr.open);
    }
    if (d.top10Owners.length === 1) add(t('ati_f_top10', { artist: _atiB(d.top10Owners[0]), n: _atiN(d.top10Max) }), ...artistArt(d.top10Owners[0]));
    if (d.top3.length === 3) add(t('ati_f_share', { pct: _atiN(_atiPct(d.top3Share)) }), ...artistArt(d.top3[0].name));
    if (d.oneHit.length) add(t(d.type === 'albums' ? 'ati_f_onealb' : 'ati_f_onehit', { n: _atiN(d.oneHit.length) }), ...artistArt(d.oneHit[0].name));
    if (d.tiers.diamond.length) add(t('ati_f_diamond', { n: _atiCount(unit, d.tiers.diamond.length) }), d.tiers.diamond[0].art, d.tiers.diamond[0].open);
  }
  if (s0 && s1 && s0.count > s1.count) add(t('ati_f_gap', { title: _atiB(s0.ttl), n: _atiN(s0.count - s1.count) }), s0.art, s0.open);
  if (s0) add(t('ati_f_total', { N, pct: _atiN(_atiPct(d.playsOnce / d.allPlaysN)) }), s0.art, s0.open);
  if (d.fast[0]) {
    const x = d.fast[0], days = _atiDays(x.days * 864e5);
    add(days < 1 ? t('ati_f_fast0', { title: _atiB(x.e.ttl), n: _atiN(d.bar) })
                 : t('ati_f_fast', { title: _atiB(x.e.ttl), days: _atiCount('days', days), n: _atiN(d.bar) }), x.e.art, x.e.open);
  }
  if (!d.young && d.fresh.length) add(t('ati_f_new', { n: _atiCount(unit, d.fresh.length) }), d.fresh[0].art, d.fresh[0].open);
  const discTop = [...d.disc.entries()].sort((a, b) => b[1].length - a[1].length)[0];
  if (discTop && d.disc.size > 1) add(t('ati_f_found', { n: _atiCount(unit, discTop[1].length), year: _atiN(String(discTop[0])) }), discTop[1][0].art, discTop[1][0].open);
  // Year facts only once the years are in (never fetched just for the hero)
  if (d.type !== 'artists') {
    const er = _atiEras(d);
    if (er.known.length >= Math.min(10, d.E.length / 2)) {
      const decTop = [...er.decades.entries()].sort((a, b) => b[1].length - a[1].length)[0];
      if (decTop) add(t('ati_f_decade', { decade: esc(t('ati_decade_long', { d: decTop[0] })) }), decTop[1][0].art, decTop[1][0].open);
      if (er.oldest) add(t(d.type === 'albums' ? 'ati_f_oldest_album' : 'ati_f_oldest', { title: _atiB(er.oldest.e.ttl), year: _atiN(String(er.oldest.y)) }), er.oldest.e.art, er.oldest.e.open);
    }
  }
  return f;
}

function _atiHeroHtml(d) {
  const facts = _atiFacts(d);
  if (!facts.length) return '';
  const i = ((_ati.fact % facts.length) + facts.length) % facts.length;
  const f = facts[i];
  const art = f.art
    ? `<button type="button" class="ati-hero-art" ${_atiOpenAttrs(f.open[0], f.open[1])} aria-label="${esc(t('ati_open'))}">${_atiArt(f.art[0], f.art[1], 'ati-art--hero')}</button>`
    : '';
  return `<div class="ati-hero">
    ${art}
    <p class="ati-hero-fact" aria-live="polite">${f.html}</p>
    <button type="button" class="ati-btn ati-btn--ghost ati-hero-next" data-ati="fact">
      <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v2.6h-2.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>${esc(t('ati_another'))}</span>
      <span class="ati-hero-count">${_atiN((i + 1) + '/' + facts.length)}</span>
    </button>
  </div>`;
}

// ── Tiles and tabs ───────────────────────────────────────────────────────────

function _atiTilesHtml(d) {
  const tile = (tab, num, label, sub) => `<button type="button" class="ati-tile" data-ati="tab" data-tab="${tab}">
      <span class="ati-tile-num">${num}</span>
      <span class="ati-tile-l">${esc(label)}</span>
      ${sub ? `<span class="ati-tile-sub">${sub}</span>` : ''}
    </button>`;
  const share = _atiN(d.top3.length ? _atiPct(d.top3Share) : '–');
  const first = d.type === 'artists'
    ? tile('songs', _atiN(d.E.reduce((n, e) => n + e.songsN, 0)), t('ati_tile_songs'), esc(t('ati_tile_songs_sub', { n: d.E.length.toLocaleString() })))
      + tile('songs', share, t('ati_tile_share_plays'), esc(d.top3.map(a => a.name).join(', ')))
    : tile('artists', _atiN(d.artists.length), t('ati_tile_artists'),
           esc(t(d.type === 'albums' ? 'ati_tile_artists_sub_albums' : 'ati_tile_artists_sub', { n: d.E.length.toLocaleString() })))
      + tile('artists', share, t('ati_tile_share'), d.top3[0] ? esc(d.top3.map(a => a.name).join(', ')) : '');
  return `<div class="ati-tiles">
    ${first}
    ${tile('plays', _atiN(_atiPct(d.playsOnce / d.allPlaysN)), t('ati_tile_plays'), _atiCount('plays', d.playsOnce))}
    ${tile('new', _atiN(d.young ? '–' : d.fresh.length), t('ati_tile_new'), d.young ? esc(t('ati_tile_new_young')) : esc(t('ati_tile_new_sub')))}
  </div>`;
}

function _atiTabsHtml(type) {
  const cur = _atiTab(type);
  // The site's one segmented control (DESIGN.md "one of each"), same as Songs/Artists/Albums
  return `<div class="chart-type-seg ati-tabs" role="tablist" aria-label="${esc(t('ati_tabs_label'))}">${_atiTabs(type).map(tb =>
    `<button type="button" role="tab" class="chart-type-toggle-btn${tb === cur ? ' active' : ''}" aria-selected="${tb === cur}" data-ati="tab" data-tab="${tb}">${esc(t('ati_tab_' + tb))}</button>`).join('')}</div>`;
}

// Top 10 owner, top 3 share and one-entry artists, shared by the songs and albums charts
function _atiArtistFacts(d) {
  const isAlb = d.type === 'albums';
  let top10 = '';
  if (d.top10Owners.length === 1) top10 = t('ati_top10_line', { artist: _atiB(d.top10Owners[0]), n: _atiN(d.top10Max) });
  else if (d.top10Owners.length > 1) top10 = t('ati_top10_tie', { artists: d.top10Owners.map(_atiB).join(', '), n: _atiN(d.top10Max) });
  else top10 = esc(t(isAlb ? 'ati_top10_none_albums' : 'ati_top10_none'));

  // Top 3 share as one stacked bar: each artist's own entries, then everyone else
  let share = '';
  if (d.top3.length) {
    const segs = d.top3.map((a, i) => ({ name: a.name, n: a.list.length, cls: 'ati-seg--' + (i + 1) }));
    const restN = Math.max(0, d.E.length - d.top3N);
    share = `<p class="ati-line">${t(isAlb ? 'ati_share_line_albums' : 'ati_share_line', { n: _atiN(d.top3N), total: _atiN(d.E.length), pct: _atiN(_atiPct(d.top3Share)) })}</p>
      ${_atiStack(segs, restN)}
      ${isAlb ? '' : `<p class="ati-note">${esc(t('ati_share_note'))}</p>`}`;
  }

  // Artists with one entry, as chips: the first 24, the rest one click away
  let oneHit = `<p class="ati-line">${esc(t(isAlb ? 'ati_onealb_none' : 'ati_onehit_none'))}</p>`;
  if (d.oneHit.length) {
    const chip = a => `<button type="button" class="ati-chip" ${_atiOpenAttrs(a.list[0].open[0], a.list[0].open[1])} title="${esc(a.list[0].ttl)}">${esc(a.name)}<span class="ati-chip-r">${_atiN('#' + a.list[0].rank)}</span></button>`;
    const first = d.oneHit.slice(0, 24).map(chip).join('');
    const more = d.oneHit.slice(24).map(chip).join('');
    oneHit = `<p class="ati-line">${t(isAlb ? 'ati_onealb_line' : 'ati_onehit_line', { n: _atiN(d.oneHit.length) })}</p>
      <div class="ati-chips">${first}${more ? `<span class="ati-chips-more" hidden>${more}</span>` : ''}</div>
      ${more ? `<button type="button" class="ati-link ati-more-chips" data-ati="chips" data-more="${esc(t('ati_show_all', { n: d.oneHit.length.toLocaleString() }))}" data-less="${esc(t('ati_show_less'))}">${esc(t('ati_show_all', { n: d.oneHit.length.toLocaleString() }))}</button>` : ''}`;
  }

  return `<h3 class="ati-h">${esc(t('ati_top10_title'))}</h3>
    <p class="ati-line">${top10}</p>
    <h3 class="ati-h">${esc(t('ati_share_title'))}</h3>
    ${share}
    <h3 class="ati-h">${esc(t(isAlb ? 'ati_onealb_title' : 'ati_onehit_title'))}</h3>
    ${oneHit}`;
}

// A stacked bar with its legend. segs: [{ name, n, cls }]
function _atiStack(segs, restN) {
  return `<div class="ati-stack" aria-hidden="true">${segs.map(s => `<span class="ati-seg ${s.cls}" style="flex:${s.n}"></span>`).join('')}<span class="ati-seg ati-seg--rest" style="flex:${restN}"></span></div>
    <ul class="ati-legend">${segs.map(s => `<li><span class="ati-dot ${s.cls}"></span><button type="button" class="ati-link" ${_atiOpenAttrs('artist', s.name)}>${esc(s.name)}</button> ${_atiN(s.n)}</li>`).join('')}
      <li><span class="ati-dot ati-seg--rest"></span>${esc(t('ati_share_rest'))} ${_atiN(restN)}</li></ul>`;
}

// Artists tab (songs and albums charts)
function _atiPanelArtists(d) {
  const isAlb = d.type === 'albums';
  const top = d.artists.slice(0, 10);
  const max = top[0] ? top[0].list.length : 0;
  const artistRows = top.map(a => _atiRow(
    `${_atiArt('artist', { name: a.name }, 'ati-art--sm')}<span class="ati-row-name">${esc(a.name)}</span>`,
    a.list.length, max, a.list,
    `<button type="button" class="ati-link" ${_atiOpenAttrs('artist', a.name)}>${esc(t('ati_open_artist'))}</button>`)).join('');

  let second;
  if (isAlb) {
    // Albums with the most different tracks played
    const tmax = d.tracks[0] ? d.tracks[0].tracksN : 0;
    second = `<h3 class="ati-h">${esc(t('ati_most_tracks'))}</h3>
      <p class="ati-note">${esc(t('ati_most_tracks_note'))}</p>
      <div class="ati-rows">${d.tracks.map(e => `<button type="button" class="ati-pod" ${_atiOpenAttrs(e.open[0], e.open[1])}>
          <span class="ati-pod-rk">${_atiN('#' + e.rank)}</span>
          ${_atiEntryArt(e, 'ati-art--sm')}
          <span class="ati-pod-tx"><span class="ati-song-t">${esc(e.ttl)}</span><span class="ati-song-a">${esc(e.sub)}</span></span>
          <span class="ati-row-bar" aria-hidden="true"><span class="ati-bar-fill" style="--w:${tmax ? Math.round(e.tracksN / tmax * 100) : 0}%"></span></span>
          <span class="ati-row-n">${_atiN(e.tracksN)}</span>
        </button>`).join('')}</div>`;
  } else {
    const amax = d.albums[0] ? d.albums[0].list.length : 0;
    const albumRows = d.albums.slice(0, 5).map(al => _atiRow(
      `${_atiArt('album', { album: al.album, artist: al.artist }, 'ati-art--sm')}<span class="ati-row-name">${esc(al.album)}<span class="ati-row-sub">${esc(al.artist)}</span></span>`,
      al.list.length, amax, al.list,
      `<button type="button" class="ati-link" ${_atiOpenAttrs('album', al.key)}>${esc(t('ati_open_album'))}</button>`)).join('');
    second = `<h3 class="ati-h">${esc(t('ati_most_albums'))}</h3>
      ${albumRows ? `<div class="ati-rows">${albumRows}</div>` : `<p class="ati-line">${esc(t('ati_albums_none'))}</p>`}`;
  }

  return `<div class="ati-grid">
    <div class="ati-block">
      <h3 class="ati-h">${esc(t(isAlb ? 'ati_most_albums_by' : 'ati_most_entries'))}</h3>
      <p class="ati-note">${esc(t(isAlb ? 'ati_row_hint_albums' : 'ati_row_hint'))}</p>
      <div class="ati-rows">${artistRows}</div>
    </div>
    <div class="ati-block">
      ${second}
      ${_atiArtistFacts(d)}
    </div>
  </div>`;
}

// Songs tab (artists chart): depth, how much one song carries them, top 3 share of plays
function _atiPanelSongs(d) {
  const songList = e => `<ol class="ati-songs">${e.songs.slice(0, 10).map((s, i) => `
    <li><button type="button" class="ati-song" ${_atiOpenAttrs('song', s.key)}>
      <span class="ati-song-rk">${_atiN(i + 1)}</span>
      <span class="ati-song-tx"><span class="ati-song-t">${esc(s.title)}</span>${s.artist !== e.ttl ? `<span class="ati-song-a">${esc(s.artist)}</span>` : ''}</span>
      <span class="ati-song-pl">${_atiCount('plays', s.count)}</span>
    </button></li>`).join('')}</ol>`;
  const max = d.depth[0] ? d.depth[0].songsN : 0;
  const depthRows = d.depth.map(e => _atiRow(
    `${_atiEntryArt(e, 'ati-art--sm')}<span class="ati-row-name">${esc(e.ttl)}<span class="ati-row-sub">${esc('#' + e.rank)}</span></span>`,
    e.songsN, max, null,
    `<button type="button" class="ati-link" ${_atiOpenAttrs('artist', e.ttl)}>${esc(t('ati_open_artist'))}</button>`,
    songList(e))).join('');

  const carry = `<ol class="ati-songs">${d.carry.map(e => `
    <li><button type="button" class="ati-song" ${_atiOpenAttrs('song', e.songs[0].key)}>
      <span class="ati-song-rk">${_atiN('#' + e.rank)}</span>
      <span class="ati-song-tx"><span class="ati-song-t">${esc(e.ttl)}</span><span class="ati-song-a">${esc(e.songs[0].title)}</span></span>
      <span class="ati-song-pl">${_atiN(_atiPct(e.carry))}</span>
    </button></li>`).join('')}</ol>`;

  let share = '';
  if (d.top3.length) {
    const segs = d.top3.map((a, i) => ({ name: a.name, n: a.plays, cls: 'ati-seg--' + (i + 1) }));
    share = `<p class="ati-line">${t('ati_share_line_artists', { pct: _atiN(_atiPct(d.top3Share)) })}</p>
      ${_atiStack(segs, Math.max(0, d.totalPlays - d.top3N))}`;
  }

  return `<div class="ati-grid">
    <div class="ati-block">
      <h3 class="ati-h">${esc(t('ati_depth_title'))}</h3>
      <p class="ati-note">${esc(t('ati_depth_note'))}</p>
      <div class="ati-rows">${depthRows}</div>
    </div>
    <div class="ati-block">
      <h3 class="ati-h">${esc(t('ati_carry_title'))}</h3>
      <p class="ati-note">${esc(t('ati_carry_note'))}</p>
      ${carry}
      <h3 class="ati-h">${esc(t('ati_share_title_plays'))}</h3>
      ${share}
    </div>
  </div>`;
}

// Eras tab (songs and albums charts)
function _atiPanelEras(d) {
  _atiPumpYears(d);
  const isAlb = d.type === 'albums';
  const unit = _atiUnit(d.type);
  const er = _atiEras(d);
  const y = _ati.years;
  const progress = (y.running && y.total)
    ? `<div class="ati-progress" role="status"><span>${esc(t('ati_years_loading', { done: y.done.toLocaleString(), total: y.total.toLocaleString() }))}</span><span class="ati-progress-bar"><span style="--w:${Math.round(y.done / y.total * 100)}%"></span></span></div>`
    : '';

  let decades = '';
  if (er.known.length) {
    const groups = [...er.decades.entries()].sort((a, b) => a[0] - b[0]).map(([id, list]) => ({ id, list }));
    if (_ati.eraSel === null || !er.decades.has(+_ati.eraSel)) {
      _ati.eraSel = [...groups].sort((a, b) => b.list.length - a.list.length)[0].id;
    }
    decades = _atiColumns(groups, 'era', _ati.eraSel, _atiDecadeLabel, unit)
      + (er.unknown ? `<p class="ati-note">${esc(t('ati_years_unknown', { n: er.unknown.toLocaleString() }))}</p>` : '');
  } else if (!y.running) {
    decades = `<p class="ati-line">${esc(t('ati_years_none'))}</p>`;
  }

  let age = '';
  if (er.avgAge !== null) {
    age = `<p class="ati-line">${t(isAlb ? 'ati_avg_age_line_album' : 'ati_avg_age_line', { n: _atiN(Math.round(er.avgAge * 10) / 10) })}</p>`;
    if (er.avgGap !== null) {
      const g = Math.round(er.avgGap * 10) / 10;
      age += `<p class="ati-line">${g < 1 ? esc(t('ati_found_fresh')) : t('ati_found_after', { n: _atiN(g) })}</p>`;
    }
  }
  const spots = (er.oldest || er.newest) ? `<div class="ati-spots">
      ${_atiSpot(t(isAlb ? 'ati_oldest_album' : 'ati_oldest'), er.oldest && er.oldest.e, er.oldest ? _atiN(String(er.oldest.y)) : '')}
      ${er.newest && er.newest.e !== (er.oldest && er.oldest.e) ? _atiSpot(t(isAlb ? 'ati_newest_album' : 'ati_newest'), er.newest.e, _atiN(String(er.newest.y))) : ''}
    </div>` : '';

  return `${progress}
    <div class="ati-grid">
      <div class="ati-block">
        <h3 class="ati-h">${esc(t('ati_decades_title'))}</h3>
        <p class="ati-note">${esc(t('ati_decades_sub'))}</p>
        ${decades}
      </div>
      <div class="ati-block">
        <h3 class="ati-h">${esc(t('ati_age_title'))}</h3>
        ${age || `<p class="ati-line">${esc(y.running ? t('ati_years_wait') : t('ati_years_none'))}</p>`}
        ${spots}
        ${_atiDiscoveryHtml(d)}
      </div>
    </div>`;
}

// Discovery tab (artists chart): the year you found each one, longest known, newest arrival
function _atiPanelDiscovery(d) {
  const first = d.byFirst[0], newest = d.byFirst[d.byFirst.length - 1];
  const when = e => _atiN(esc(fmtDate(new Date(e.times[0]))));
  return `<div class="ati-grid">
    <div class="ati-block">${_atiDiscoveryHtml(d)}</div>
    <div class="ati-block">
      <div class="ati-spots ati-spots--stack">
        ${first ? _atiSpot(t('ati_first_friend'), first, when(first)) : ''}
        ${newest && newest !== first ? _atiSpot(t('ati_new_arrival'), newest, when(newest)) : ''}
      </div>
    </div>
  </div>`;
}

// Plays tab (all charts)
function _atiPanelPlays(d) {
  const s = d.E.slice(0, 3);
  const max = s[0] ? s[0].count : 1;
  const podium = s.map(e => `<button type="button" class="ati-pod" ${_atiOpenAttrs(e.open[0], e.open[1])}>
      <span class="ati-pod-rk">${_atiN('#' + e.rank)}</span>
      ${_atiEntryArt(e, 'ati-art--sm')}
      <span class="ati-pod-tx"><span class="ati-song-t">${esc(e.ttl)}</span>${e.sub ? `<span class="ati-song-a">${esc(e.sub)}</span>` : ''}</span>
      <span class="ati-row-bar" aria-hidden="true"><span class="ati-bar-fill" style="--w:${Math.round(e.count / max * 100)}%"></span></span>
      <span class="ati-row-n">${_atiN(e.count)}</span>
    </button>`).join('');
  let gap = '';
  if (s[1]) {
    const diff = s[0].count - s[1].count;
    gap = diff > 0
      ? t('ati_gap_line', { title: _atiB(s[0].ttl), n: _atiCount('plays', diff), pct: _atiN(_atiPct(diff / s[1].count)) })
      : esc(t('ati_gap_tie'));
  }
  const timedList = list => _atiList(list.map(x => x.e), e => _atiDaysText(_atiDays(list.find(z => z.e === e).days * 864e5)));
  const totalKey = d.type === 'artists' ? 'ati_total_line_artists' : d.type === 'albums' ? 'ati_total_line_albums' : 'ati_total_line';

  return `<div class="ati-grid">
    <div class="ati-block">
      <h3 class="ati-h">${esc(t('ati_total_title'))}</h3>
      <p class="ati-big">${_atiN(d.playsOnce)} <span>${esc(tUnit('plays', d.playsOnce))}</span></p>
      <p class="ati-line">${t(totalKey, { pct: _atiN(_atiPct(d.playsOnce / d.allPlaysN)), spct: _atiN(_atiPct(d.E.length / d.uniqN)), songs: _atiN(d.uniqN) })}</p>
      <h3 class="ati-h">${esc(t('ati_gap_title'))}</h3>
      <div class="ati-rows">${podium}</div>
      <p class="ati-line">${gap}</p>
    </div>
    <div class="ati-block">
      ${d.fast.length ? `
        <h3 class="ati-h">${esc(t('ati_fast_title'))}</h3>
        <p class="ati-note">${t('ati_fast_sub', { n: _atiN(d.bar) })}</p>
        ${timedList(d.fast)}
        <h3 class="ati-h">${esc(t('ati_slow_title'))}</h3>
        <p class="ati-note">${t('ati_slow_sub', { n: _atiN(d.bar) })}</p>
        ${timedList(d.slow)}` : `<h3 class="ati-h">${esc(t('ati_fast_title'))}</h3><p class="ati-line">${esc(t('ati_fast_none'))}</p>`}
    </div>
  </div>`;
}

// Badges tab (songs and albums charts)
function _atiPanelBadges(d) {
  const isAlb = d.type === 'albums';
  /* The plays range under each tier only when the whole chart is on one
     ladder; an albums chart with marked singles/EPs mixes three ladders. */
  const one = d.ladders.length === 1 ? (CERT[d.ladders[0]] || CERT.album) : null;
  const tierDefs = [
    ['diamond', certBadge(CERT.song.diamond, 'song'), one ? t('ati_cert_from', { n: one.diamond.toLocaleString() }) : ''],
    ['plat',    certBadge(CERT.song.plat, 'song'),    one ? t('ati_cert_range', { a: one.plat.toLocaleString(), b: (one.diamond - 1).toLocaleString() }) : ''],
    ['gold',    certBadge(CERT.song.gold, 'song'),    one ? t('ati_cert_range', { a: one.gold.toLocaleString(), b: (one.plat - 1).toLocaleString() }) : ''],
    ['none',    `<span class="ati-tag">${esc(t('ati_cert_none_tier'))}</span>`, one ? t('ati_cert_under', { n: one.gold.toLocaleString() }) : ''],
  ];
  const tmax = Math.max(1, ...tierDefs.map(([k]) => d.tiers[k].length));
  const tierRows = tierDefs.filter(([k]) => d.tiers[k].length).map(([k, badge, range]) =>
    _atiRow(`<span class="ati-row-name">${badge}${range ? `<span class="ati-row-sub">${esc(range)}</span>` : ''}</span>`, d.tiers[k].length, tmax, d.tiers[k])).join('');

  const nextList = _atiList(d.next.map(x => x.e), e => {
    const x = d.next.find(z => z.e === e);
    return t('ati_next_line', { n: _atiN(x.need), tier: esc(x.label) });
  });

  const rt = _atiReleaseTypes(d);
  const rtDefs = [['album', isAlb ? 'ati_type_album_albums' : 'ati_type_album'], ['single', 'ati_type_single'], ['ep', 'ati_type_ep'],
                  ['live', 'ati_type_live'], ['soundtrack', 'ati_type_soundtrack'], ['none', 'ati_type_none']];
  const rmax = Math.max(1, ...rtDefs.map(([k]) => rt[k].length));
  const rtRows = rtDefs.filter(([k]) => rt[k].length).map(([k, lbl]) =>
    _atiRow(`<span class="ati-row-name">${esc(t(lbl))}</span>`, rt[k].length, rmax, rt[k])).join('');
  const marked = rt.single.length + rt.ep.length + rt.live.length + rt.soundtrack.length;

  return `<div class="ati-grid">
    <div class="ati-block">
      <h3 class="ati-h">${esc(t('ati_certs_title'))}</h3>
      <p class="ati-note">${esc(t(isAlb ? 'ati_certs_sub_album' : 'ati_certs_sub'))}</p>
      <div class="ati-rows">${tierRows}</div>
      <h3 class="ati-h">${esc(t('ati_next_title'))}</h3>
      ${nextList}
    </div>
    <div class="ati-block">
      <h3 class="ati-h">${esc(t('ati_types_title'))}</h3>
      <p class="ati-note">${esc(t(isAlb ? 'ati_types_sub_album' : 'ati_types_sub'))}</p>
      <div class="ati-rows">${rtRows}</div>
      ${marked ? '' : `<p class="ati-note">${esc(t(isAlb ? 'ati_types_hint_albums' : 'ati_types_hint'))}</p>`}
    </div>
  </div>`;
}

// New this year tab (all charts)
function _atiPanelNew(d) {
  const since = fmtDate(new Date(d.cut));
  const head = `<h3 class="ati-h">${esc(t('ati_new_title', { date: since }))}</h3>`;
  if (d.young) return `${head}<p class="ati-line">${esc(t('ati_new_young'))}</p>`;
  if (!d.fresh.length) return `${head}<p class="ati-line">${esc(t('ati_new_none'))}</p>`;
  const isFound = e => e.times.length && e.times[0] > d.cut;
  const rows = d.fresh.map(e => {
    // Where it was a year ago: below the chart, or not played yet at all
    const found = isFound(e);
    const status = found
      ? t('ati_new_found', { date: esc(fmtDate(new Date(e.times[0]))) })
      : t('ati_was_rank', { n: _atiN(e.prevRank) });
    return `<li><button type="button" class="ati-new" ${_atiOpenAttrs(e.open[0], e.open[1])}>
      <span class="ati-song-rk">${_atiN('#' + e.rank)}</span>
      ${_atiEntryArt(e, 'ati-art--sm')}
      <span class="ati-song-tx"><span class="ati-song-t">${esc(e.ttl)}</span>${e.sub ? `<span class="ati-song-a">${esc(e.sub)}</span>` : ''}</span>
      <span class="ati-new-st">${found ? `<span class="ati-new-tag">${esc(t('ati_new_tag'))}</span>` : ''}<span>${status}</span></span>
    </button></li>`;
  }).join('');
  const foundN = d.fresh.filter(isFound).length;
  return `${head}
    <p class="ati-line">${t('ati_new_line', { n: _atiCount(_atiUnit(d.type), d.fresh.length), N: _atiN(d.N) })}
      ${foundN ? t('ati_new_split', { a: _atiN(foundN), b: _atiN(d.fresh.length - foundN) }) : ''}</p>
    <ol class="ati-songs ati-songs--new">${rows}</ol>`;
}

const ATI_PANELS = {
  artists: _atiPanelArtists, songs: _atiPanelSongs, eras: _atiPanelEras, discovery: _atiPanelDiscovery,
  plays: _atiPanelPlays, badges: _atiPanelBadges, new: _atiPanelNew,
};

function _atiRenderPanel() {
  const el = document.getElementById('atInsights');
  const p = el && el.querySelector('.ati-panel');
  if (!p || !_ati.data) return;
  const tab = _atiTab(_ati.data.type);
  p.innerHTML = ATI_PANELS[tab](_ati.data);
  p.setAttribute('aria-label', t('ati_tab_' + tab));
  // On a phone the tabs scroll sideways: keep the picked one in sight
  const tabs = el.querySelector('.ati-tabs'), on = tabs && tabs.querySelector('.active');
  if (on && tabs.scrollWidth > tabs.clientWidth) tabs.scrollLeft = Math.max(0, on.offsetLeft - tabs.offsetLeft - 24);
  _atiFlushImages();
}

// ── Main render ──────────────────────────────────────────────────────────────

function atiRender() {
  const el = document.getElementById('atInsights');
  if (!el) return;
  _atiBind(el);
  const hide = () => { el.hidden = true; el.innerHTML = ''; };
  if (typeof currentPeriod === 'undefined' || currentPeriod !== 'alltime' || !allPlays || !allPlays.length) return hide();
  const type = ['songs', 'artists', 'albums'].includes(chartTypeView) ? chartTypeView : 'songs';
  const size = _atiSize(type);

  // All Entries: no cut-off, so offer one instead (until the tip is dismissed)
  if (!isFinite(size)) {
    if (_atiLsGet(ATI_LS_HINT) === '1') return hide();
    el.hidden = false;
    el.innerHTML = `<div class="ati-tip">
      <svg class="ati-tip-ic" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M3 13V8M6.5 13V4M10 13V6.5M13.5 13V2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      <p class="ati-tip-tx">${esc(t('ati_hint'))}</p>
      <button type="button" class="ati-btn ati-btn--primary" data-ati="size" data-type="${type}">${esc(t('ati_hint_btn'))}</button>
      <button type="button" class="ati-x" data-ati="hint-off" aria-label="${esc(t('ati_hint_close'))}" title="${esc(t('ati_hint_close'))}">×</button>
    </div>`;
    return;
  }

  const items = (fullData && fullData[type]) || [];
  if (items.length < 3) return hide();
  const prevType = _ati.data && _ati.data.type;
  const d = _atiCompute(type, items, size);
  // A different chart: start its facts and picks fresh
  if (prevType !== type) { _ati.fact = 0; _ati.eraSel = null; _ati.discSel = null; }
  _ati.imgSeq = 0; _ati.imgQ = [];

  el.hidden = false;
  el.innerHTML = `
    <div class="ati-head">
      <div class="ati-head-tx">
        <h2 class="ati-title" id="atiTitle">${esc(t('ati_title_' + type, { n: d.N.toLocaleString() }))}</h2>
        <p class="ati-sub-h">${esc(t('ati_sub'))}</p>
      </div>
      <button type="button" class="ati-btn ati-btn--secondary ati-toggle" data-ati="toggle" aria-expanded="${_ati.open}" aria-controls="atiBody">
        <span>${esc(t(_ati.open ? 'ati_less' : 'ati_more'))}</span>
        <svg class="ati-chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
    <div class="ati-hero-slot">${_atiHeroHtml(d)}</div>
    <div class="ati-body" id="atiBody"${_ati.open ? '' : ' hidden'}>
      ${_ati.open ? `${_atiTilesHtml(d)}${_atiTabsHtml(type)}<div class="ati-panel" role="tabpanel"></div>` : ''}
    </div>`;
  if (_ati.open) _atiRenderPanel(); else _atiFlushImages();
}

// Re-draw just the hero (Another fact), with its little entrance
function _atiNextFact() {
  const el = document.getElementById('atInsights');
  const slot = el && el.querySelector('.ati-hero-slot');
  if (!slot || !_ati.data) return;
  _ati.fact++;
  slot.innerHTML = _atiHeroHtml(_ati.data);
  slot.firstElementChild && slot.firstElementChild.classList.add('ati-hero--in');
  _atiFlushImages();
}

// One delegated click handler for the whole section, bound once
function _atiBind(el) {
  if (el._atiBound) return;
  el._atiBound = true;
  el.addEventListener('click', ev => {
    const b = ev.target.closest('[data-ati]');
    if (!b || !el.contains(b)) return;
    const act = b.dataset.ati;
    if (act === 'toggle') {
      _ati.open = !_ati.open;
      _atiLsSet(ATI_LS_OPEN, _ati.open ? '1' : '0');
      atiRender();
    } else if (act === 'fact') {
      _atiNextFact();
    } else if (act === 'tab') {
      if (!_ati.data || !_atiTabs(_ati.data.type).includes(b.dataset.tab)) return;
      _ati.tab = b.dataset.tab;
      _atiLsSet(ATI_LS_TAB, _ati.tab);
      el.querySelectorAll('.ati-tabs [data-tab]').forEach(x => {
        const on = x.dataset.tab === _ati.tab;
        x.classList.toggle('active', on);
        x.setAttribute('aria-selected', on);
      });
      _atiRenderPanel();
      // A tile sits above the tabs: bring the panel it opened into view
      if (b.classList.contains('ati-tile')) el.querySelector('.ati-tabs')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else if (act === 'row') {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', open);
      const sub = b.nextElementSibling;
      if (sub) sub.hidden = !open;
    } else if (act === 'col') {
      if (b.dataset.kind === 'era') _ati.eraSel = +b.dataset.id; else _ati.discSel = +b.dataset.id;
      _atiRenderPanel();
    } else if (act === 'chips') {
      const more = b.previousElementSibling && b.previousElementSibling.querySelector('.ati-chips-more');
      if (!more) return;
      more.hidden = !more.hidden;
      b.textContent = more.hidden ? b.dataset.more : b.dataset.less;
    } else if (act === 'open') {
      const k = b.dataset.key;
      if (b.dataset.kind === 'artist') openArtistModal(k);
      else if (b.dataset.kind === 'album') openAlbumModal(k);
      else openSongModal(k);
    } else if (act === 'size') {
      // Same path as picking Top 100 in that chart's ⋮ → Size, so it is saved and synced
      const bar = typeof _dcSizeBars !== 'undefined' && _dcSizeBars[_atiSizeBarId(b.dataset.type || 'songs')];
      if (bar) bar.apply('100');
    } else if (act === 'hint-off') {
      _atiLsSet(ATI_LS_HINT, '1');
      atiRender();
    }
  });
}
