const API = 'https://dankcharts-api.onrender.com';

let currentUser = null;
let currentPeriod = 'weekly';
let currentLimit = 25;
let weeksList = [];
let currentWeekIndex = -1;
let localScrobbles = null; // cached for local IDB-based users
let localWeekOffset = 0;   // weeks back from current week for local nav

// ── TRANSLATIONS ──────────────────────────────────────────────────
const LANGS = {
  en: {
    tagline: 'Your listening history. Your charts. Your legacy.',
    landing_title: 'See your music charts',
    landing_desc: 'Enter your Last.fm username to view your top artists, tracks, and albums.',
    landing_btn: 'View Charts →',
    change_user: 'Change user',
    period_7day: '7 Days', period_1month: '1 Month', period_3month: '3 Months',
    period_6month: '6 Months', period_12month: '12 Months', period_overall: 'All Time',
    limit_label: 'Show:', limit_10: 'Top 10', limit_25: 'Top 25', limit_50: 'Top 50',
    section_artists: '★ Top Artists', section_tracks: '★ Top Tracks', section_albums: '★ Top Albums',
    col_artist: 'Artist', col_track: 'Track · Artist', col_album: 'Album · Artist', col_plays: 'Plays',
    loading: 'Loading...', footer_powered: 'Powered by Last.fm',
    plays_fmt: n => `${Number(n).toLocaleString()} plays`,
    scrobbles_fmt: n => `${Number(n).toLocaleString()} scrobbles`,
    err_not_found: 'User not found on Last.fm.',
    err_network: 'Could not reach the server. Try again.',
  },
  es: {
    tagline: 'Tu historial de escucha. Tus charts. Tu legado.',
    landing_title: 'Ve tus charts musicales',
    landing_desc: 'Ingresa tu usuario de Last.fm para ver tus artistas, canciones y álbumes favoritos.',
    landing_btn: 'Ver Charts →',
    change_user: 'Cambiar usuario',
    period_7day: '7 Días', period_1month: '1 Mes', period_3month: '3 Meses',
    period_6month: '6 Meses', period_12month: '12 Meses', period_overall: 'Todo',
    limit_label: 'Mostrar:', limit_10: 'Top 10', limit_25: 'Top 25', limit_50: 'Top 50',
    section_artists: '★ Top Artistas', section_tracks: '★ Top Canciones', section_albums: '★ Top Álbumes',
    col_artist: 'Artista', col_track: 'Canción · Artista', col_album: 'Álbum · Artista', col_plays: 'Plays',
    loading: 'Cargando...', footer_powered: 'Impulsado por Last.fm',
    plays_fmt: n => `${Number(n).toLocaleString()} plays`,
    scrobbles_fmt: n => `${Number(n).toLocaleString()} scrobbles`,
    err_not_found: 'Usuario no encontrado en Last.fm.',
    err_network: 'No se pudo conectar al servidor. Intenta de nuevo.',
  },
  'pt-BR': {
    tagline: 'Seu histórico de escuta. Seus charts. Seu legado.',
    landing_title: 'Veja seus charts musicais',
    landing_desc: 'Digite seu usuário do Last.fm para ver seus artistas, faixas e álbuns favoritos.',
    landing_btn: 'Ver Charts →',
    change_user: 'Trocar usuário',
    period_7day: '7 Dias', period_1month: '1 Mês', period_3month: '3 Meses',
    period_6month: '6 Meses', period_12month: '12 Meses', period_overall: 'Tudo',
    limit_label: 'Mostrar:', limit_10: 'Top 10', limit_25: 'Top 25', limit_50: 'Top 50',
    section_artists: '★ Top Artistas', section_tracks: '★ Top Faixas', section_albums: '★ Top Álbuns',
    col_artist: 'Artista', col_track: 'Faixa · Artista', col_album: 'Álbum · Artista', col_plays: 'Plays',
    loading: 'Carregando...', footer_powered: 'Desenvolvido pelo Last.fm',
    plays_fmt: n => `${Number(n).toLocaleString()} plays`,
    scrobbles_fmt: n => `${Number(n).toLocaleString()} scrobbles`,
    err_not_found: 'Usuário não encontrado no Last.fm.',
    err_network: 'Não foi possível conectar ao servidor. Tente novamente.',
  },
};

let lang = localStorage.getItem('dc_lang') || 'en';
const t = key => (LANGS[lang] || LANGS.en)[key] || key;

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (typeof val === 'string') el.textContent = val;
  });
}

function setLanguage(l) {
  lang = l;
  localStorage.setItem('dc_lang', l);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  applyTranslations();
  if (currentUser) updateSectionTitles();
}

// ── THEMES ────────────────────────────────────────────────────────
const THEME_CLASSES = ['navy-light', 'purple', 'purple-light', 'red', 'red-light', 'yellow', 'yellow-light', 'pink', 'pink-light'];
const THEME_COLORS = {
  'navy-dark': '#1a6eb5', 'navy-light': '#90c4f4',
  'purple': '#7c6af7', 'purple-light': '#c4b8ff',
  'red': '#cc2020', 'red-light': '#ff9999',
  'yellow': '#e0b800', 'yellow-light': '#c8a000',
  'pink': '#cc2090', 'pink-light': '#ffaadd',
};
const THEME_NAMES = {
  'navy-dark': 'Navy', 'navy-light': 'Navy ☀', 'purple': 'Purple', 'purple-light': 'Purple ☀',
  'red': 'Red', 'red-light': 'Red ☀', 'yellow': 'Yellow', 'yellow-light': 'Yellow ☀',
  'pink': 'Pink', 'pink-light': 'Pink ☀',
};

function applyTheme(theme) {
  document.body.classList.remove(...THEME_CLASSES);
  if (theme !== 'navy-dark') document.body.classList.add(theme);
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === theme);
    b.style.color = THEME_COLORS[b.dataset.theme] || '#888';
  });
  const dot = document.querySelector('.ctrl-theme-dot');
  if (dot) dot.style.background = THEME_COLORS[theme] || 'var(--accent)';
  const label = document.getElementById('themeLabel');
  if (label) label.textContent = THEME_NAMES[theme] || 'Navy';
  localStorage.setItem('dc_theme', theme);
}

// ── CTRL PANELS (open/close) ──────────────────────────────────────
function initCtrlGroups() {
  document.querySelectorAll('.ctrl-group').forEach(group => {
    const btn = group.querySelector('.ctrl-group-btn');
    const panel = group.querySelector('.ctrl-group-panel');
    if (!btn || !panel) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = panel.classList.contains('open');
      document.querySelectorAll('.ctrl-group-panel.open').forEach(p => p.classList.remove('open'));
      if (!isOpen) panel.classList.add('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.ctrl-group-panel.open').forEach(p => p.classList.remove('open'));
  });
}

// ── LANDING ───────────────────────────────────────────────────────
function showLanding() {
  document.getElementById('landing').style.display = '';
  document.getElementById('chartsApp').style.display = 'none';
}

function showCharts() {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('chartsApp').style.display = '';
}

function changeUser() {
  localStorage.removeItem('dc_lfm_username');
  currentUser = null;
  weeksList = [];
  currentWeekIndex = -1;
  localScrobbles = null;
  localWeekOffset = 0;
  showLanding();
  document.getElementById('usernameInput').value = '';
  document.getElementById('landingError').textContent = '';
}

async function startCharts() {
  const input = document.getElementById('usernameInput');
  const username = input.value.trim();
  if (!username) return;

  const btn = document.getElementById('goBtn');
  const errEl = document.getElementById('landingError');
  btn.disabled = true;
  btn.textContent = '...';
  errEl.textContent = '';

  try {
    // Check local IDB data first — no Last.fm account needed
    const localCount = await countIDB(username);
    if (localCount > 0) {
      localScrobbles = null;
      localWeekOffset = 0;
      currentUser = { name: username, isLocal: true, playcount: localCount, image: [] };
      localStorage.setItem('dc_lfm_username', username);
      renderUserBarLocal(username, localCount);
      showCharts();
      loadCharts();
      return;
    }

    // Fall back to Last.fm API
    const res = await fetch(`${API}/api/lastfm/user/${encodeURIComponent(username)}`);
    const data = await res.json();

    if (data.error) {
      errEl.textContent = t('err_not_found');
      return;
    }

    currentUser = data.user;
    localStorage.setItem('dc_lfm_username', username);
    renderUserBar(currentUser);
    showCharts();
    loadCharts();
  } catch {
    errEl.textContent = t('err_network');
  } finally {
    btn.disabled = false;
    btn.textContent = t('landing_btn');
  }
}

function renderUserBar(user) {
  const img = document.getElementById('userAvatar');
  const name = document.getElementById('userName');
  const plays = document.getElementById('userPlaycount');

  const avatar = user.image?.find(i => i.size === 'medium')?.['#text'] || '';
  img.src = avatar || 'https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png';
  img.alt = user.name;
  name.textContent = user.name;
  plays.textContent = t('scrobbles_fmt')(user.playcount);
}

function renderUserBarLocal(username, scrobbleCount) {
  const img = document.getElementById('userAvatar');
  const name = document.getElementById('userName');
  const plays = document.getElementById('userPlaycount');
  img.src = 'https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png';
  img.alt = username;
  name.textContent = username;
  plays.textContent = t('scrobbles_fmt')(scrobbleCount);
}

// ── LOCAL CHART COMPUTATION ───────────────────────────────────────
async function getIDBAllScrobbles(username) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const range = IDBKeyRange.bound([username, ''], [username, '￿']);
    const req = tx.objectStore(IDB_STORE).getAll(range);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function periodToDateRange(period) {
  const now = new Date();
  const daysMap = { '1month': 30, '3month': 90, '6month': 180, '12month': 365 };
  if (daysMap[period]) {
    const from = new Date(now.getTime() - daysMap[period] * 86400000);
    return { from: from.toISOString(), to: now.toISOString() };
  }
  return { from: null, to: now.toISOString() }; // 'overall' = all time
}

function computeTopN(scrobbles, field, limit) {
  const counts = {};
  for (const s of scrobbles) {
    let key;
    if (field === 'track') {
      if (!s.track) continue;
      key = `${s.track}\x00${s.artist || ''}`;
    } else if (field === 'album') {
      if (!s.album || s.album === '—') continue;
      key = `${s.album}\x00${s.artist || ''}`;
    } else {
      key = s[field] || '';
      if (!key) continue;
    }
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

function localToArtists(top) {
  return top.map(({ key, count }) => ({ name: key, playcount: count, url: '#', image: [] }));
}

function localToTracks(top) {
  return top.map(({ key, count }) => {
    const [name, artist] = key.split('\x00');
    return { name, playcount: count, url: '#', image: [], artist: { name: artist || '' } };
  });
}

function localToAlbums(top) {
  return top.map(({ key, count }) => {
    const [name, artist] = key.split('\x00');
    return { name, playcount: count, url: '#', image: [], artist: { name: artist || '' } };
  });
}

function getWeekBoundaries(weeksBack) {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const daysToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToMon - weeksBack * 7);
  const sunday = new Date(monday.getTime() + 7 * 86400000);
  return { from: monday.toISOString(), to: sunday.toISOString() };
}

function formatWeekLabel(fromISO, toISO) {
  const from = new Date(fromISO);
  const to = new Date(new Date(toISO).getTime() - 1); // inclusive end
  const fmt = (d, showYear) => d.toLocaleDateString('en', { month: 'short', day: 'numeric', ...(showYear ? { year: 'numeric' } : {}) });
  return `${fmt(from, false)} – ${fmt(to, true)}`;
}

async function loadLocalCharts() {
  if (!localScrobbles) {
    localScrobbles = await getIDBAllScrobbles(currentUser.name);
  }

  if (currentPeriod === 'weekly') {
    loadLocalWeeklyCharts();
    return;
  }

  showDateNav(false);
  const statsStrip = document.getElementById('statsStrip');
  if (statsStrip) statsStrip.style.display = 'none';

  updateSectionTitles();
  setLoading('artists');
  setLoading('tracks');
  setLoading('albums');

  const { from } = periodToDateRange(currentPeriod);
  const filtered = from ? localScrobbles.filter(s => s.scrobbled_at >= from) : localScrobbles;

  renderArtists(localToArtists(computeTopN(filtered, 'artist', currentLimit)));
  renderTracks(localToTracks(computeTopN(filtered, 'track', currentLimit)));
  renderAlbums(localToAlbums(computeTopN(filtered, 'album', currentLimit)));

  setLoaded('artists');
  setLoaded('tracks');
  setLoaded('albums');
}

async function loadLocalWeeklyCharts() {
  if (!localScrobbles) {
    localScrobbles = await getIDBAllScrobbles(currentUser.name);
  }

  showDateNav(true);
  const { from, to } = getWeekBoundaries(localWeekOffset);
  document.getElementById('periodLabel').textContent = formatWeekLabel(from, to);
  document.getElementById('prevWeekBtn').disabled = false;
  document.getElementById('nextWeekBtn').disabled = localWeekOffset === 0;

  updateSectionTitles();
  setLoading('artists');
  setLoading('tracks');
  setLoading('albums');

  const filtered = localScrobbles.filter(s => s.scrobbled_at >= from && s.scrobbled_at < to);

  const statsStrip = document.getElementById('statsStrip');
  if (statsStrip) {
    const totalPlays = filtered.length;
    const uniqueArtists = new Set(filtered.map(s => s.artist)).size;
    const uniqueTracks = new Set(filtered.map(s => `${s.track}\x00${s.artist}`)).size;
    const uniqueAlbums = new Set(filtered.filter(s => s.album).map(s => `${s.album}\x00${s.artist}`)).size;
    updateStatsStrip(totalPlays, uniqueArtists, uniqueTracks, uniqueAlbums);
  }

  renderArtists(localToArtists(computeTopN(filtered, 'artist', currentLimit)));
  renderTracks(localToTracks(computeTopN(filtered, 'track', currentLimit)));
  renderAlbums(localToAlbums(computeTopN(filtered, 'album', currentLimit)));

  setLoaded('artists');
  setLoaded('tracks');
  setLoaded('albums');
}

// ── CHARTS ────────────────────────────────────────────────────────
function updateSectionTitles() {
  document.getElementById('artistsTitle').textContent = t('section_artists');
  document.getElementById('tracksTitle').textContent = t('section_tracks');
  document.getElementById('albumsTitle').textContent = t('section_albums');
}

function setLoading(section) {
  document.getElementById(`${section}Loading`).style.display = '';
  document.getElementById(`${section}Table`).style.display = 'none';
  document.getElementById(`${section}Body`).innerHTML = '';
}

function setLoaded(section) {
  document.getElementById(`${section}Loading`).style.display = 'none';
  document.getElementById(`${section}Table`).style.display = '';
}

async function loadCharts() {
  if (!currentUser) return;
  if (currentUser.isLocal) {
    await loadLocalCharts();
    return;
  }
  if (currentPeriod === 'weekly') {
    await switchToWeekly();
    return;
  }

  showDateNav(false);
  const statsStrip = document.getElementById('statsStrip');
  if (statsStrip) statsStrip.style.display = 'none';

  const username = encodeURIComponent(currentUser.name);
  const params = `period=${currentPeriod}&limit=${currentLimit}`;

  updateSectionTitles();
  setLoading('artists');
  setLoading('tracks');
  setLoading('albums');

  const [artistsRes, tracksRes, albumsRes] = await Promise.allSettled([
    fetch(`${API}/api/lastfm/top/artists/${username}?${params}`).then(r => r.json()),
    fetch(`${API}/api/lastfm/top/tracks/${username}?${params}`).then(r => r.json()),
    fetch(`${API}/api/lastfm/top/albums/${username}?${params}`).then(r => r.json()),
  ]);

  if (artistsRes.status === 'fulfilled') renderArtists(artistsRes.value.topartists?.artist || []);
  if (tracksRes.status === 'fulfilled') renderTracks(tracksRes.value.toptracks?.track || []);
  if (albumsRes.status === 'fulfilled') renderAlbums(albumsRes.value.topalbums?.album || []);

  setLoaded('artists');
  setLoaded('tracks');
  setLoaded('albums');
}

function imgCell(images, size = 'small') {
  const url = images?.find(i => i.size === size)?.['#text']
    || 'https://lastfm.freetls.fastly.net/i/u/34s/2a96cbd8b46e442fc41c2b86b821562f.png';
  return `<td class="img-cell"><img src="${url}" loading="lazy" alt=""></td>`;
}

function rankCell(rank) {
  const cls = rank <= 3 ? ' gold' : '';
  return `<td class="rank-cell${cls}">${rank}</td>`;
}

function renderArtists(artists) {
  const tbody = document.getElementById('artistsBody');
  if (!artists.length) { tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text3);padding:20px">No data</td></tr>'; return; }
  tbody.innerHTML = artists.map((a, i) => `
    <tr>
      ${rankCell(i + 1)}
      ${imgCell(a.image)}
      <td class="name-cell"><a href="${a.url}" target="_blank" style="color:inherit;text-decoration:none">${a.name}</a></td>
      <td class="plays-cell">${Number(a.playcount).toLocaleString()}</td>
    </tr>`).join('');
}

function renderTracks(tracks) {
  const tbody = document.getElementById('tracksBody');
  if (!tracks.length) { tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text3);padding:20px">No data</td></tr>'; return; }
  tbody.innerHTML = tracks.map((t, i) => `
    <tr>
      ${rankCell(i + 1)}
      ${imgCell(t.image)}
      <td class="name-cell">
        <a href="${t.url}" target="_blank" style="color:inherit;text-decoration:none">${t.name}</a>
        <div class="sub">${t.artist?.name || ''}</div>
      </td>
      <td class="plays-cell">${Number(t.playcount).toLocaleString()}</td>
    </tr>`).join('');
}

function renderAlbums(albums) {
  const tbody = document.getElementById('albumsBody');
  if (!albums.length) { tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text3);padding:20px">No data</td></tr>'; return; }
  tbody.innerHTML = albums.map((a, i) => `
    <tr>
      ${rankCell(i + 1)}
      ${imgCell(a.image)}
      <td class="name-cell">
        <a href="${a.url}" target="_blank" style="color:inherit;text-decoration:none">${a.name}</a>
        <div class="sub">${a.artist?.name || ''}</div>
      </td>
      <td class="plays-cell">${Number(a.playcount).toLocaleString()}</td>
    </tr>`).join('');
}

// ── IMPORT MODAL ──────────────────────────────────────────────────
function getImportUsername() {
  if (currentUser) return currentUser.name;
  return (document.getElementById('modalUsernameInput')?.value || '').trim();
}

function openImportModal() {
  const userRow = document.getElementById('modalUserRow');
  if (currentUser) {
    userRow.style.display = 'none';
  } else {
    userRow.style.display = '';
  }
  document.getElementById('importModal').style.display = 'flex';
  loadSyncStatus();
}

function closeImportModal(e) {
  if (!e || e.target === document.getElementById('importModal')) {
    document.getElementById('importModal').style.display = 'none';
  }
}

function switchImportTab(tab) {
  document.querySelectorAll('.modal-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
  document.getElementById(`tab-${tab}`).style.display = 'flex';
}

function setResult(elId, msg, type) {
  const el = document.getElementById(elId);
  el.textContent = msg;
  el.className = `import-result ${type}`;
}

// ── IndexedDB helpers ─────────────────────────────────────────────
const IDB_NAME  = 'dankcharts-public';
const IDB_VER   = 1;
const IDB_STORE = 'scrobbles';

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VER);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        const s = db.createObjectStore(IDB_STORE, { keyPath: ['username', 'scrobbled_at'] });
        s.createIndex('by_user', 'username');
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveToIDB(username, scrobbles) {
  const db = await openIDB();
  let count = 0;
  const BATCH = 500;

  // Make timestamps unique so same-second scrobbles don't overwrite each other.
  // The keyPath is ['username', 'scrobbled_at'], so duplicate timestamps lose data.
  const tsCounts = {};
  const uniqueScrobbles = scrobbles.map(s => {
    if (!s.scrobbled_at) return s;
    // Normalize to base (strip existing ms) then re-add unique ms offset
    const base = s.scrobbled_at.replace(/\.\d{3}Z$/, '').replace(/Z$/, '');
    const n = tsCounts[base] ?? 0;
    tsCounts[base] = n + 1;
    return { ...s, scrobbled_at: `${base}.${String(n).padStart(3, '0')}Z` };
  });

  for (let i = 0; i < uniqueScrobbles.length; i += BATCH) {
    const batch = uniqueScrobbles.slice(i, i + BATCH);
    await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      for (const s of batch) {
        if (s.scrobbled_at) {
          store.put({ username, artist: s.artist || '', album: s.album || '', track: s.track || '', scrobbled_at: s.scrobbled_at });
          count++;
        }
      }
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }
  return count;
}

async function countIDB(username) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).index('by_user').count(IDBKeyRange.only(username));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getIDBDateRange(username) {
  const db = await openIDB();
  const range = IDBKeyRange.bound([username, ''], [username, '￿']);
  const getEdge = dir => new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).openCursor(range, dir);
    req.onsuccess = e => resolve(e.target.result?.value || null);
    req.onerror = () => reject(req.error);
  });
  const [first, last] = await Promise.all([getEdge('next'), getEdge('prev')]);
  return { earliest: first?.scrobbled_at || null, latest: last?.scrobbled_at || null };
}

async function loadSyncStatus() {
  const username = getImportUsername();
  if (!username) return;
  try {
    const count = await countIDB(username);
    const stats = document.getElementById('syncStats');
    const fmt = ts => ts ? new Date(ts).toLocaleDateString() : '?';
    if (count > 0) {
      const { earliest, latest } = await getIDBDateRange(username);
      stats.textContent = `${count.toLocaleString()} scrobbles stored · ${fmt(earliest)} – ${fmt(latest)}`;
      document.getElementById('lfmSyncInfo').textContent =
        `Last stored: ${fmt(latest)} · ${count.toLocaleString()} scrobbles`;
    } else {
      stats.textContent = 'No scrobbles stored yet';
      document.getElementById('lfmSyncInfo').textContent = 'No data synced yet.';
    }
  } catch {}
}

// ── Last.fm sync (client-side via backend proxy, stores in IDB) ───
async function syncLastfm() {
  const username = getImportUsername();
  if (!username) { setResult('lfmResult', 'Enter a display name above first.', 'err'); return; }
  const btn = document.getElementById('lfmSyncBtn');
  const prog = document.getElementById('lfmProgress');
  const fill = document.getElementById('lfmFill');
  const label = document.getElementById('lfmLabel');

  btn.disabled = true;
  prog.style.display = '';
  setResult('lfmResult', '', '');

  let fromTs = null;
  try {
    const { latest } = await getIDBDateRange(username);
    if (latest) fromTs = Math.floor(new Date(latest).getTime() / 1000) + 1;
  } catch {}

  let page = 1, totalPages = null, totalSynced = 0;

  try {
    while (true) {
      label.textContent = totalPages
        ? `Syncing page ${page} of ${totalPages}…`
        : `Syncing… (page ${page})`;
      if (totalPages) fill.style.width = `${Math.round((page / totalPages) * 100)}%`;

      let url = `${API}/api/lastfm/recenttracks/${encodeURIComponent(username)}?page=${page}&limit=200`;
      if (fromTs) url += `&from=${fromTs}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server error (${res.status})`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const attrs = data?.recenttracks?.['@attr'] || {};
      totalPages = parseInt(attrs.totalPages || '1');

      const tracks = (data?.recenttracks?.track || []).filter(t =>
        t && typeof t === 'object' && !t['@attr']?.nowplaying && t.date?.uts
      );
      const scrobbles = tracks.map(t => ({
        artist: (typeof t.artist === 'object' ? t.artist['#text'] : t.artist) || '',
        album:  (typeof t.album  === 'object' ? t.album['#text']  : t.album)  || '',
        track: t.name || '',
        scrobbled_at: new Date(parseInt(t.date.uts) * 1000).toISOString(),
      })).filter(s => s.artist && s.track);

      if (scrobbles.length) {
        await saveToIDB(username, scrobbles);
        totalSynced += scrobbles.length;
      }

      if (page >= totalPages) break;
      page++;
    }

    fill.style.width = '100%';
    label.textContent = 'Done!';
    setResult('lfmResult', totalSynced > 0
      ? `✓ ${totalSynced.toLocaleString()} scrobbles synced`
      : '✓ Already up to date', 'ok');
  } catch (e) {
    setResult('lfmResult', e.message || 'Connection error. Try again.', 'err');
  }

  btn.disabled = false;
  setTimeout(() => { prog.style.display = 'none'; }, 2000);
  localScrobbles = null; // force reload on next chart render
  loadSyncStatus();
}

// ── File helpers ──────────────────────────────────────────────────
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = () => reject(new Error('Could not read file'));
    r.readAsText(file, 'utf-8');
  });
}

function readFileAsBuffer(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = () => reject(new Error('Could not read file'));
    r.readAsArrayBuffer(file);
  });
}

async function parseSpotifyZip(file) {
  if (!window.JSZip) throw new Error('JSZip library not loaded');
  const buf = await readFileAsBuffer(file);
  const zip = await window.JSZip.loadAsync(buf);
  const scrobbles = [];
  for (const [name, entry] of Object.entries(zip.files)) {
    const lower = name.toLowerCase();
    if (!lower.endsWith('.json')) continue;
    if (!['streaming', 'endsong', 'audio'].some(k => lower.includes(k))) continue;
    let data;
    try { data = JSON.parse(await entry.async('string')); } catch { continue; }
    if (!Array.isArray(data)) continue;
    for (const item of data) {
      if (!item || typeof item !== 'object') continue;
      if (parseInt(item.ms_played || 0) < 30000) continue;
      const ts = parseDtStr(item.ts || item.endTime || '');
      if (!ts) continue;
      const track  = item.master_metadata_track_name || item.trackName || '';
      const artist = item.master_metadata_album_artist_name || item.artistName || '';
      if (!track || !artist) continue;
      scrobbles.push({
        artist,
        album: item.master_metadata_album_album_name || '',
        track,
        scrobbled_at: ts,
      });
    }
  }
  return scrobbles;
}

async function parseDeezerXlsx(file) {
  if (!window.XLSX) throw new Error('SheetJS library not loaded');
  const buf = await readFileAsBuffer(file);
  const wb = window.XLSX.read(buf, { type: 'array', cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = window.XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'yyyy-mm-dd HH:mm:ss' });
  if (rows.length < 2) return [];

  const header = rows[0].map(h => String(h || '').toLowerCase().trim());
  const col = {};
  header.forEach((h, i) => {
    if (['song', 'title', 'track', 'titre', 'piste'].some(x => h.includes(x))) { if (col.track == null) col.track = i; }
    else if (['artist', 'artiste'].some(x => h.includes(x)))                   { if (col.artist == null) col.artist = i; }
    else if (h.includes('album'))                                                { if (col.album == null) col.album = i; }
    else if (['date', 'time', 'listened', 'ecoute'].some(x => h.includes(x))) { if (col.ts == null) col.ts = i; }
  });

  const scrobbles = [];
  for (const row of rows.slice(1)) {
    const get = k => col[k] != null ? String(row[col[k]] || '') : '';
    const ts = parseDtStr(get('ts'));
    if (!ts) continue;
    const artist = get('artist'), track = get('track');
    if (!artist || !track) continue;
    scrobbles.push({ artist, album: get('album'), track, scrobbled_at: ts });
  }
  return scrobbles;
}

// ── File upload (fully client-side) ──────────────────────────────
async function handleFileUpload(file) {
  if (!file) return;
  const username = getImportUsername();
  if (!username) { setResult('uploadResult', 'Enter a display name above first.', 'err'); return; }

  document.getElementById('dropZone').querySelector('.drop-label').textContent = file.name;
  setResult('uploadResult', `Parsing ${file.name}…`, '');

  try {
    const fname = file.name.toLowerCase();
    let scrobbles;

    if (fname.endsWith('.zip')) {
      scrobbles = await parseSpotifyZip(file);
    } else if (fname.endsWith('.xlsx') || fname.endsWith('.xls')) {
      scrobbles = await parseDeezerXlsx(file);
    } else {
      const text = await readFileAsText(file);
      scrobbles = parseSheetCsv(text);
    }

    if (!scrobbles.length) {
      setResult('uploadResult', 'No valid records found. Check your file format.', 'err');
      return;
    }

    setResult('uploadResult', `Saving ${scrobbles.length.toLocaleString()} records…`, '');
    const count = await saveToIDB(username, scrobbles);
    setResult('uploadResult', `✓ ${count.toLocaleString()} of ${scrobbles.length.toLocaleString()} records imported`, 'ok');
    localScrobbles = null; // force reload on next chart render
    loadSyncStatus();
  } catch (e) {
    setResult('uploadResult', `Error: ${e.message || 'Could not parse file'}`, 'err');
  }

  document.getElementById('fileInput').value = '';
}

// ── Drag-and-drop wiring ──────────────────────────────────────────
function initDropZone() {
  const zone = document.getElementById('dropZone');
  if (!zone) return;
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  });
}

// ── Google Sheets sync (fully client-side) ────────────────────────
async function syncSheets() {
  const username = getImportUsername();
  if (!username) { setResult('sheetsResult', 'Enter a display name above first.', 'err'); return; }
  const url = document.getElementById('sheetsUrl').value.trim();
  if (!url) { setResult('sheetsResult', 'Paste a Google Sheets URL first.', 'err'); return; }

  const sheetMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (!sheetMatch) { setResult('sheetsResult', 'Invalid Google Sheets URL.', 'err'); return; }
  const sheetId = sheetMatch[1];
  const gidMatch = url.match(/[?&]gid=(\d+)/);
  const gid = gidMatch ? gidMatch[1] : '0';

  setResult('sheetsResult', 'Fetching sheet…', '');
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    const csvRes = await fetch(csvUrl);
    if (!csvRes.ok) throw new Error(`Could not fetch sheet (${csvRes.status})`);
    const ct = csvRes.headers.get('content-type') || '';
    if (ct.includes('html')) {
      setResult('sheetsResult', 'Sheet is not public — set sharing to "Anyone with the link can view".', 'err');
      return;
    }
    const csvText = await csvRes.text();

    setResult('sheetsResult', 'Parsing…', '');
    const rows = parseSheetCsv(csvText);
    if (!rows.length) {
      setResult('sheetsResult', 'No valid records found. Check your column headers.', 'err');
      return;
    }

    setResult('sheetsResult', `Saving ${rows.length.toLocaleString()} records…`, '');
    const count = await saveToIDB(username, rows);
    setResult('sheetsResult', `✓ ${count.toLocaleString()} of ${rows.length.toLocaleString()} records imported`, 'ok');
    localScrobbles = null; // force reload on next chart render
    loadSyncStatus();
  } catch (e) {
    setResult('sheetsResult', e.message || 'Connection error. Try again.', 'err');
  }
}

function parseSheetCsv(text) {
  text = text.replace(/^﻿/, '');
  const lines = parseCsvLines(text);
  if (lines.length < 2) return [];

  const header = lines[0].map(h => h.toLowerCase().trim());
  const isLastfm  = header.includes('uts');
  const hasTitle  = header.some(f => f.includes('song') || f.includes('title'));
  const isMycharts = hasTitle && header.some(f => f.includes('date'));

  const scrobbles = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    const r = {};
    header.forEach((h, idx) => { r[h] = (row[idx] || '').trim(); });

    let artist, album, track, ts;

    if (isLastfm) {
      const uts = r['uts'];
      if (!uts || !/^\d+$/.test(uts)) continue;
      ts     = new Date(parseInt(uts) * 1000).toISOString();
      artist = r['artist'] || '';
      album  = r['album']  || '';
      track  = r['track']  || '';
    } else if (isMycharts) {
      const dtStr = r['date and time'] || r['datetime'] || r['date'] || r['time'] || '';
      ts = parseDtStr(dtStr);
      if (!ts) continue;
      artist = r['artist'] || '';
      album  = r['album']  || '';
      track  = r['song title'] || r['track'] || r['title'] || r['song'] || '';
    } else {
      ts = null;
      for (const k of ['date and time', 'datetime', 'timestamp', 'utc_time', 'date', 'time']) {
        if (r[k]) { ts = parseDtStr(r[k]); if (ts) break; }
      }
      if (!ts) continue;
      artist = r['artist'] || r['artist name'] || '';
      album  = r['album']  || r['album name']  || '';
      track  = r['song title'] || r['track name'] || r['track'] || r['title'] || r['song'] || '';
    }

    if (artist && track) scrobbles.push({ artist, album, track, scrobbled_at: ts });
  }
  return scrobbles;
}

function parseCsvLines(text) {
  const lines = [];
  let cur = [], field = '', inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuote) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') inQuote = false;
      else field += ch;
    } else if (ch === '"') {
      inQuote = true;
    } else if (ch === ',') {
      cur.push(field); field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      cur.push(field); field = '';
      if (cur.some(f => f)) lines.push(cur);
      cur = [];
    } else {
      field += ch;
    }
  }
  if (field || cur.length) { cur.push(field); if (cur.some(f => f)) lines.push(cur); }
  return lines;
}

function parseDtStr(s) {
  if (!s) return null;
  s = s.trim();
  if (/^\d{10,}$/.test(s)) return new Date(parseInt(s) * 1000).toISOString();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(s.includes('T') ? s : s.replace(' ', 'T') + (s.length <= 10 ? 'T00:00:00Z' : 'Z'));
    if (!isNaN(d)) return d.toISOString();
  }
  const m1 = s.match(/^(\d{1,2})\s+(\w{3,})\s+(\d{4})[,\s]+(\d{2}):(\d{2})/);
  if (m1) {
    const d = new Date(`${m1[2]} ${m1[1]}, ${m1[3]} ${m1[4]}:${m1[5]}:00 UTC`);
    if (!isNaN(d)) return d.toISOString();
  }
  const m2 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{2}):(\d{2})/);
  if (m2) {
    const d = new Date(Date.UTC(+m2[3], +m2[2] - 1, +m2[1], +m2[4], +m2[5]));
    if (!isNaN(d)) return d.toISOString();
  }
  const d = new Date(s);
  return isNaN(d) ? null : d.toISOString();
}

// ── WEEKLY NAVIGATION ─────────────────────────────────────────────
function showDateNav(visible) {
  const nav = document.getElementById('dateNav');
  if (nav) nav.style.display = visible ? '' : 'none';
}

async function fetchWeeksList() {
  const username = encodeURIComponent(currentUser.name);
  const res = await fetch(`${API}/api/lastfm/weekly/charts/${username}`);
  const data = await res.json();
  weeksList = (data.weeklychartlist?.chart || [])
    .sort((a, b) => parseInt(a.from) - parseInt(b.from));
  currentWeekIndex = weeksList.length - 1;
}

async function switchToWeekly() {
  showDateNav(true);
  if (weeksList.length === 0) {
    document.getElementById('periodLabel').textContent = 'Loading weeks...';
    document.getElementById('prevWeekBtn').disabled = true;
    document.getElementById('nextWeekBtn').disabled = true;
    setLoading('artists');
    setLoading('tracks');
    setLoading('albums');
    try {
      await fetchWeeksList();
    } catch {
      document.getElementById('periodLabel').textContent = 'Could not load weeks';
      return;
    }
  }
  updateDateNav();
  await loadWeeklyCharts();
}

async function loadWeeklyCharts() {
  if (!weeksList.length || currentWeekIndex < 0) return;
  const week = weeksList[currentWeekIndex];
  const username = encodeURIComponent(currentUser.name);
  const params = `from=${week.from}&to=${week.to}`;

  updateSectionTitles();
  setLoading('artists');
  setLoading('tracks');
  setLoading('albums');

  const [ar, tr, al] = await Promise.allSettled([
    fetch(`${API}/api/lastfm/weekly/artists/${username}?${params}`).then(r => r.json()),
    fetch(`${API}/api/lastfm/weekly/tracks/${username}?${params}`).then(r => r.json()),
    fetch(`${API}/api/lastfm/weekly/albums/${username}?${params}`).then(r => r.json()),
  ]);

  const artists = ar.status === 'fulfilled' ? (ar.value.weeklyartistchart?.artist || []) : [];
  const tracks  = tr.status === 'fulfilled' ? (tr.value.weeklytrackchart?.track   || []) : [];
  const albums  = al.status === 'fulfilled' ? (al.value.weeklyalbumchart?.album   || []) : [];

  renderArtists(artists.slice(0, currentLimit));
  renderTracks(tracks.slice(0, currentLimit));
  renderAlbums(albums.slice(0, currentLimit));

  setLoaded('artists');
  setLoaded('tracks');
  setLoaded('albums');

  const totalPlays = tracks.reduce((s, t) => s + parseInt(t.playcount || 0), 0);
  updateStatsStrip(totalPlays, artists.length, tracks.length, albums.length);
}

function navigateWeek(delta) {
  if (currentUser?.isLocal) {
    const newOffset = localWeekOffset - delta; // prev = further back = higher offset
    if (newOffset < 0) return;
    localWeekOffset = newOffset;
    loadLocalWeeklyCharts();
    return;
  }
  const newIndex = currentWeekIndex + delta;
  if (newIndex < 0 || newIndex >= weeksList.length) return;
  currentWeekIndex = newIndex;
  updateDateNav();
  loadWeeklyCharts();
}

function updateDateNav() {
  if (!weeksList.length || currentWeekIndex < 0) return;
  const week = weeksList[currentWeekIndex];
  const from = new Date(parseInt(week.from) * 1000);
  const to   = new Date(parseInt(week.to)   * 1000);
  const fromStr = from.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  const toStr   = to.toLocaleDateString('en',   { month: 'short', day: 'numeric', year: 'numeric' });
  document.getElementById('periodLabel').textContent = `${fromStr} – ${toStr}`;
  document.getElementById('prevWeekBtn').disabled = currentWeekIndex <= 0;
  document.getElementById('nextWeekBtn').disabled = currentWeekIndex >= weeksList.length - 1;
}

function updateStatsStrip(plays, artists, tracks, albums) {
  const strip = document.getElementById('statsStrip');
  if (!strip) return;
  strip.style.display = '';
  strip.innerHTML = `
    <span><span class="stat-val">${plays.toLocaleString()}</span> plays</span>
    <span class="stat-dot">·</span>
    <span><span class="stat-val">${artists.toLocaleString()}</span> artists</span>
    <span class="stat-dot">·</span>
    <span><span class="stat-val">${tracks.toLocaleString()}</span> tracks</span>
    <span class="stat-dot">·</span>
    <span><span class="stat-val">${albums.toLocaleString()}</span> albums</span>
  `;
}

// ── INIT ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  const savedTheme = localStorage.getItem('dc_theme') || 'navy-dark';
  applyTheme(savedTheme);
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
  });

  // Language
  lang = localStorage.getItem('dc_lang') || 'en';
  applyTranslations();
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  // Ctrl panels
  initCtrlGroups();

  // Drop zone for file import
  initDropZone();

  // Period buttons
  document.querySelectorAll('.period-nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-nav button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = btn.dataset.period;
      if (currentUser) loadCharts();
    });
  });

  // Limit buttons
  document.querySelectorAll('.limit-btns button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.limit-btns button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLimit = parseInt(btn.dataset.limit);
      if (currentUser) loadCharts();
    });
  });

  // Enter key on username input
  document.getElementById('usernameInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') startCharts();
  });

  // Auto-load if username is saved
  const saved = localStorage.getItem('dc_lfm_username');
  if (saved) {
    document.getElementById('usernameInput').value = saved;
    startCharts();
  } else {
    showLanding();
  }
});
