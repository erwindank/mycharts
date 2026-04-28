const API = 'https://api.dankcharts.fm';

let currentUser = null;
let currentPeriod = 'weekly';
let currentLimit = 25;
let weeksList = [];
let currentWeekIndex = -1;

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
function openImportModal() {
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

async function loadSyncStatus() {
  if (!currentUser) return;
  try {
    const res = await fetch(`${API}/api/sync/status/${encodeURIComponent(currentUser.name)}`);
    const data = await res.json();
    const stats = document.getElementById('syncStats');
    if (data.scrobbles > 0) {
      const earliest = data.earliest ? new Date(data.earliest).toLocaleDateString() : '?';
      const latest   = data.latest   ? new Date(data.latest).toLocaleDateString()   : '?';
      stats.textContent = `${Number(data.scrobbles).toLocaleString()} scrobbles stored · ${earliest} – ${latest}`;
      document.getElementById('lfmSyncInfo').textContent =
        `Last stored: ${latest} · ${Number(data.scrobbles).toLocaleString()} scrobbles`;
    } else {
      stats.textContent = 'No scrobbles stored yet';
      document.getElementById('lfmSyncInfo').textContent = 'No data synced yet — first sync may take a few minutes.';
    }
  } catch {}
}

// ── Last.fm sync (loops through pages) ────────────────────────────
async function syncLastfm() {
  if (!currentUser) return;
  const btn = document.getElementById('lfmSyncBtn');
  const prog = document.getElementById('lfmProgress');
  const fill = document.getElementById('lfmFill');
  const label = document.getElementById('lfmLabel');

  btn.disabled = true;
  prog.style.display = '';
  setResult('lfmResult', '', '');

  let page = 1;
  let totalSynced = 0;
  let totalPages = null;
  let hasMore = true;

  while (hasMore) {
    label.textContent = totalPages
      ? `Syncing page ${page} of ${totalPages}…`
      : `Syncing… (page ${page})`;
    if (totalPages) fill.style.width = `${Math.round((page / totalPages) * 100)}%`;

    try {
      const res = await fetch(
        `${API}/api/sync/lastfm/${encodeURIComponent(currentUser.name)}`,
        { method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ page }) }
      );
      const data = await res.json();
      if (data.error) { setResult('lfmResult', data.error, 'err'); break; }

      totalSynced += data.synced || 0;
      totalPages = data.total_pages;
      hasMore = data.has_more;
      page = data.next_page || (page + 25);
    } catch (e) {
      setResult('lfmResult', 'Connection error. Try again.', 'err');
      break;
    }
  }

  fill.style.width = '100%';
  label.textContent = 'Done!';
  setResult('lfmResult', `✓ ${totalSynced.toLocaleString()} scrobbles synced`, 'ok');
  btn.disabled = false;
  setTimeout(() => { prog.style.display = 'none'; }, 2000);
  loadSyncStatus();
}

// ── File upload ────────────────────────────────────────────────────
function handleFileUpload(file) {
  if (!file || !currentUser) return;
  const result = document.getElementById('uploadResult');
  result.textContent = `Uploading ${file.name}…`;
  result.className = 'import-result';

  const zone = document.getElementById('dropZone');
  zone.querySelector('.drop-label').textContent = file.name;

  const formData = new FormData();
  formData.append('file', file);

  fetch(`${API}/api/sync/upload/${encodeURIComponent(currentUser.name)}`, {
    method: 'POST', body: formData,
  })
    .then(r => r.json())
    .then(data => {
      if (data.error) { setResult('uploadResult', data.error, 'err'); return; }
      setResult('uploadResult',
        `✓ ${data.synced.toLocaleString()} of ${data.total.toLocaleString()} records imported`, 'ok');
      loadSyncStatus();
    })
    .catch(() => setResult('uploadResult', 'Upload failed. Try again.', 'err'));

  document.getElementById('fileInput').value = '';
}

// ── Drag-and-drop wiring (set up after DOM ready) ──────────────────
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

// ── Google Sheets sync ─────────────────────────────────────────────
async function syncSheets() {
  if (!currentUser) return;
  const url = document.getElementById('sheetsUrl').value.trim();
  if (!url) { setResult('sheetsResult', 'Paste a Google Sheets URL first.', 'err'); return; }

  setResult('sheetsResult', 'Fetching sheet…', '');
  try {
    const res = await fetch(
      `${API}/api/sync/sheets/${encodeURIComponent(currentUser.name)}`,
      { method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ url }) }
    );
    const data = await res.json();
    if (data.error) { setResult('sheetsResult', data.error, 'err'); return; }
    setResult('sheetsResult',
      `✓ ${data.synced.toLocaleString()} of ${data.total.toLocaleString()} records imported`, 'ok');
    loadSyncStatus();
  } catch {
    setResult('sheetsResult', 'Connection error. Try again.', 'err');
  }
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
