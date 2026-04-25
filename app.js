// Suppress html2canvas "willReadFrequently" warning by patching getContext
(function () {
  const _orig = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, attrs) {
    if (type === '2d') attrs = Object.assign({ willReadFrequently: true }, attrs);
    return _orig.call(this, type, attrs);
  };
})();

let allPlays = [];
let currentPeriod = 'week';
let currentOffset = 0;
let weekStartDay = 0; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

// ─── TIMEZONE SUPPORT ──────────────────────────────────────────
const BROWSER_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
let userTimezone = (() => {
  try { return localStorage.getItem('dc_timezone') || BROWSER_TZ; } catch(e) { return BROWSER_TZ; }
})();
let _tzFmt = null;

// Converts a real Date to a "fake-local" Date whose getDay/getDate/etc. reflect userTimezone.
// When userTimezone === BROWSER_TZ, returns d unchanged (no-op path for performance).
function tzDate(d) {
  if (userTimezone === BROWSER_TZ) return d;
  try {
    if (!_tzFmt) _tzFmt = new Intl.DateTimeFormat('en', {
      timeZone: userTimezone,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    });
    const parts = _tzFmt.formatToParts(d);
    const get = type => parseInt(parts.find(p => p.type === type)?.value || '0');
    return new Date(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'));
  } catch (e) { return d; }
}

function tzNow() { return tzDate(new Date()); }
const savedOffsets = { week: 0, month: 0, year: 0, alltime: 0, records: 0 };
let chartSize = 10;
let chartSizeWeekly = 10;
let chartSizeMonthly = 50;
let firstSeenMaps = null; // cached first-ever play dates per song/artist/album
let cumulativeMaps = null;   // cumulative plays up to end of current period
let playsPeakMaps = null;    // historical max per-period plays for peak badge
let chartSizeYearly = Infinity; // 0 = All Entries
let chartSizeAllTime = Infinity; // 0 = All Entries
let recLimit = 25; // Records entries limit
const PAGE_SIZE = 100;
const pageState = { songs: 0, artists: 0, albums: 0 };
const fullData = { songs: [], artists: [], albums: [] };
let lastPeriodStats = null;
let lastPeaks = null;
const searchState = { songs: '', artists: '', albums: '' };

// ─── THEME SWITCHER ────────────────────────────────────────────
const themeLabel = document.getElementById('themeLabel');
const themeBtns = document.querySelectorAll('.theme-btn');

const THEME_CLASSES = ['navy-light', 'purple', 'purple-light', 'red', 'red-light', 'yellow', 'yellow-light', 'pink', 'pink-light'];

const THEME_DOT_COLORS = {
  'navy-dark': '#1a6eb5', 'navy-light': '#90c4f4',
  'purple': '#7c6af7', 'purple-light': '#c4b8ff',
  'red': '#cc2020', 'red-light': '#ff9999',
  'yellow': '#c8a800', 'yellow-light': '#ffe040',
  'pink': '#cc2090', 'pink-light': '#ffaadd'
};

function applyTheme(theme) {
  document.body.classList.remove(...THEME_CLASSES);
  if (theme !== 'navy-dark') document.body.classList.add(theme);
  const normalizedTheme = theme.includes('-') ? theme : theme + '-dark';
  const labelKey = 'tooltip_theme_' + normalizedTheme.replace('-', '_');
  themeLabel.textContent = t(labelKey) || t('tooltip_theme_navy_dark');
  themeBtns.forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
  const dotColor = THEME_DOT_COLORS[theme] || '#1a6eb5';
  document.querySelectorAll('.ctrl-theme-dot').forEach(d => { d.style.background = dotColor; });
  try { localStorage.setItem('dankcharts-theme', theme); } catch (e) { }
}

themeBtns.forEach(btn => btn.addEventListener('click', () => applyTheme(btn.dataset.theme)));

// Restore saved preference, defaulting to navy-dark
try {
  const saved = localStorage.getItem('dankcharts-theme') || 'navy-dark';
  applyTheme(saved);
} catch (e) { applyTheme('navy-dark'); }

// ─── DISPLAY TOGGLES ──────────────────────────────────────────
const DISPLAY_TOGGLE_CONFIG = {
  'cert':       { btnId: 'toggleCertBtn',      bodyClass: 'hide-cert' },
  'plays-peak': { btnId: 'togglePlaysPeakBtn', bodyClass: 'hide-plays-peak' },
  'peak-tags':  { btnId: 'togglePeakTagsBtn',  bodyClass: 'hide-peak-tags' }
};
const displayToggleState = (() => {
  try { return JSON.parse(localStorage.getItem('dc_displayToggles') || '{}'); } catch(e) { return {}; }
})();

function initDisplayToggles() {
  for (const [type, cfg] of Object.entries(DISPLAY_TOGGLE_CONFIG)) {
    const visible = displayToggleState[type] !== false;
    const btn = document.getElementById(cfg.btnId);
    if (btn) btn.classList.toggle('active', visible);
    document.body.classList.toggle(cfg.bodyClass, !visible);
  }
}

function toggleDisplay(type) {
  const cfg = DISPLAY_TOGGLE_CONFIG[type];
  if (!cfg) return;
  const nowVisible = displayToggleState[type] !== false;
  displayToggleState[type] = !nowVisible;
  const btn = document.getElementById(cfg.btnId);
  if (btn) btn.classList.toggle('active', !nowVisible);
  document.body.classList.toggle(cfg.bodyClass, nowVisible);
  try { localStorage.setItem('dc_displayToggles', JSON.stringify(displayToggleState)); } catch(e) {}
}

initDisplayToggles();

// ─── WEEK START DAY SELECTOR ───────────────────────────────────
const DAY_ABBREVS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function updateWeekStartDay(day) {
  weekStartDay = day;
  const dayGroupAbbrev = document.getElementById('dayGroupAbbrev');
  if (dayGroupAbbrev) dayGroupAbbrev.textContent = DAY_ABBREVS[day];
  document.querySelectorAll('.day-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.day) === day);
  });
  renderAll();
  try { localStorage.setItem('dankcharts-weekStartDay', day); } catch (e) { }
}

try {
  const saved = localStorage.getItem('dankcharts-weekStartDay');
  weekStartDay = saved !== null ? parseInt(saved) : 0;
} catch (e) { weekStartDay = 0; }

const daySwitcher = document.getElementById('daySwitcher');
if (daySwitcher) {
  DAY_ABBREVS.forEach((abbrev, index) => {
    const btn = document.createElement('button');
    btn.className = 'day-btn' + (index === weekStartDay ? ' active' : '');
    btn.dataset.day = index;
    btn.textContent = abbrev;
    btn.addEventListener('click', () => updateWeekStartDay(index));
    daySwitcher.appendChild(btn);
  });
}

const dayGroupAbbrev = document.getElementById('dayGroupAbbrev');
if (dayGroupAbbrev) dayGroupAbbrev.textContent = DAY_ABBREVS[weekStartDay];

// ─── CTRL GROUP TOGGLE (mobile) ────────────────────────────────
document.querySelectorAll('.ctrl-group-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const group = btn.closest('.ctrl-group');
    const wasOpen = group.classList.contains('open');
    document.querySelectorAll('.ctrl-group.open').forEach(g => g.classList.remove('open'));
    if (!wasOpen) group.classList.add('open');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.ctrl-group.open').forEach(g => g.classList.remove('open'));
});

// ─── SOURCE BUTTON TOGGLE ──────────────────────────────────────
(function initSrcToggle() {
  try {
    if (localStorage.getItem('dankcharts-hideSrcBtns') === '1') {
      document.body.classList.add('hide-src-btns');
      document.getElementById('srcToggleBtn')?.classList.remove('active');
    }
  } catch (e) { }
})();

function toggleSrcButtons() {
  const hidden = document.body.classList.toggle('hide-src-btns');
  document.getElementById('srcToggleBtn')?.classList.toggle('active', !hidden);
  try { localStorage.setItem('dankcharts-hideSrcBtns', hidden ? '1' : '0'); } catch (e) { }
}

// ─── ARTIST SPLITTING ──────────────────────────────────────────
// Artists whose names contain commas — add entries here to prevent incorrect splitting
const ARTIST_COMMA_EXCEPTIONS = [
  "Tyler, The Creator",
  "Earth, Wind & Fire",
];

// Pre-compiled once — avoids recreating RegExp on every splitArtists call
const _ARTIST_EXCEPTION_RES = ARTIST_COMMA_EXCEPTIONS.map((name, i) => ({
  re: new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
  token: `__ARTIST_${i}__`,
  name,
}));

// Splits multiple artists using comma as the separator.
// Names listed in ARTIST_COMMA_EXCEPTIONS are protected from splitting.
function splitArtists(artistStr) {
  if (!artistStr) return [];
  if (artistStr.indexOf(',') === -1) return [artistStr]; // fast path: no comma
  let str = artistStr;
  const activeTokens = {};
  for (const { re, token, name } of _ARTIST_EXCEPTION_RES) {
    if (str.toLowerCase().indexOf(name.toLowerCase().slice(0, 5)) !== -1) {
      str = str.replace(re, token);
      activeTokens[token] = name;
    }
  }
  return str
    .split(',')
    .map(a => {
      let part = a.trim();
      for (const [tok, orig] of Object.entries(activeTokens)) part = part.replace(tok, orig);
      return part;
    })
    .filter(a => a.length > 0);
}

// Primary artist for album grouping — always the first artist so that feat. tracks
// don't split into a separate album entry.
function albumArtist(p) {
  return (p.artists && p.artists[0]) || p.artist;
}

// Key songs by title + artist only (album excluded) so the same song played as a
// single or from an album is counted as one entry in the songs chart.
function songKey(p) {
  return p.title.toLowerCase().trim() + '|||' + p.artist.toLowerCase().trim();
}

// Returns the best album label for a song: prefers a non-self-titled album
// (i.e. album name !== song title) by play count, falling back to the most common.
function bestAlbum(title, albumCounts) {
  const entries = Object.entries(albumCounts).sort((a, b) => b[1] - a[1]);
  const nonSingle = entries.filter(([a]) => a.toLowerCase().trim() !== title.toLowerCase().trim());
  return nonSingle.length > 0 ? nonSingle[0][0] : entries[0][0];
}

// ─── LAST.FM IMAGE LAYER ───────────────────────────────────────
const LASTFM_KEY = '27fb711c6616676bf615a61844f9fe34';

// ─── YOUTUBE IMAGE SOURCE ──────────────────────────────────────
// Paste your YouTube Data API v3 key here once you have it.
// Get one free at: console.cloud.google.com → Enable "YouTube Data API v3" → Credentials → Create API Key
const YOUTUBE_KEY = 'AIzaSyDAyHsCQ8Eb5Avz32ayqBGMUyV-21xVMtc';

const imgCache = {}; // key → url string or null

const IMG_SOURCES = ['deezer', 'itunes', 'lastfm', 'youtube', 'off'];
const itemSourcePrefs = JSON.parse(localStorage.getItem('itemSourcePrefs') || '{}');
function srcLabel(s) {
  if (s === 'itunes') return 'iTunes';
  if (s === 'lastfm') return 'Last.fm';
  if (s === 'deezer') return 'Deezer';
  if (s === 'youtube') return YOUTUBE_KEY ? 'YouTube' : 'YT (no key)';
  return '—';
}

function lfmUrl(method, params) {
  const q = new URLSearchParams({ method, api_key: LASTFM_KEY, format: 'json', ...params });
  return `https://ws.audioscrobbler.com/2.0/?${q}`;
}

// ─── LAST.FM SCROBBLE / AUTH ──────────────────────────────────
const SCROBBLE_DEFAULT_KEY    = '16bf00f19c64398611d93beed16c3ab7';
const SCROBBLE_DEFAULT_SECRET = 'cfb0cff4971d817bb8461b7e7c44e67e';

function getScrobbleKey()     { return localStorage.getItem('dc_lfm_api_key')     || SCROBBLE_DEFAULT_KEY; }
function getScrobbleSecret()  { return localStorage.getItem('dc_lfm_api_secret')  || SCROBBLE_DEFAULT_SECRET; }
function getScrobbleSession() { return localStorage.getItem('dc_lfm_session_key') || ''; }
function getScrobbleUser()    { return localStorage.getItem('dc_lfm_session_user')|| ''; }

function lfmSig(params, secret) {
  return md5(Object.keys(params).sort().map(k => k + params[k]).join('') + secret);
}

async function lfmPost(params) {
  const key    = getScrobbleKey();
  const secret = getScrobbleSecret();
  if (!key || !secret) throw new Error('API credentials not configured');
  const p = { ...params, api_key: key };
  p.api_sig = lfmSig(p, secret);
  p.format  = 'json';
  const res  = await fetch('https://ws.audioscrobbler.com/2.0/', { method: 'POST', body: new URLSearchParams(p) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (data.error) throw new Error(data.message || 'Last.fm error ' + data.error);
  return data;
}

function updateLfmAuthStatus() {
  const user      = getScrobbleUser();
  const sess      = getScrobbleSession();
  const statusEl  = document.getElementById('lfmAuthStatus');
  const connectBtn= document.getElementById('lfmConnectBtn');
  const disconnBtn= document.getElementById('lfmDisconnectBtn');
  const scrobBtn  = document.getElementById('scrobbleBtn');
  if (sess && user) {
    if (statusEl)   statusEl.innerHTML = `<span class="lfm-auth-dot connected"></span> Connected as <strong>${user}</strong>`;
    if (connectBtn) connectBtn.style.display = 'none';
    if (disconnBtn) disconnBtn.style.display = '';
    if (scrobBtn)   scrobBtn.style.display   = '';
  } else {
    if (statusEl)   statusEl.innerHTML = '<span class="lfm-auth-dot"></span> Not connected';
    if (connectBtn) { connectBtn.style.display = ''; connectBtn.textContent = 'Connect to Last.fm'; connectBtn.disabled = false; }
    if (disconnBtn) disconnBtn.style.display = 'none';
    if (scrobBtn)   scrobBtn.style.display   = 'none';
  }
}

function lfmAuthBtnClick() {
  if (localStorage.getItem('dc_lfm_pending_token')) lfmAuthFinalize();
  else lfmAuthConnect();
}

async function lfmAuthConnect() {
  const keyEl    = document.getElementById('srcLfmApiKey');
  const secretEl = document.getElementById('srcLfmApiSecret');
  if (keyEl?.value.trim())    localStorage.setItem('dc_lfm_api_key',    keyEl.value.trim());
  if (secretEl?.value.trim()) localStorage.setItem('dc_lfm_api_secret', secretEl.value.trim());

  const key    = getScrobbleKey();
  const secret = getScrobbleSecret();
  const hint   = document.getElementById('lfmConnectHint');
  if (!key || !secret) {
    if (hint) { hint.textContent = 'Enter your API key and secret above first.'; hint.style.color = 'var(--rose)'; }
    return;
  }
  const btn = document.getElementById('lfmConnectBtn');
  btn.disabled = true;
  btn.textContent = 'Getting token…';
  try {
    const data = await lfmPost({ method: 'auth.getToken' });
    localStorage.setItem('dc_lfm_pending_token', data.token);
    window.open(`https://www.last.fm/api/auth/?api_key=${encodeURIComponent(key)}&token=${encodeURIComponent(data.token)}`, '_blank');
    btn.textContent = "I've authorized ✓";
    btn.disabled = false;
    if (hint) { hint.textContent = 'Authorize dankstation.fm on Last.fm, then click the button again.'; hint.style.color = ''; }
  } catch (e) {
    btn.textContent = 'Connect to Last.fm';
    btn.disabled = false;
    if (hint) { hint.textContent = 'Error: ' + e.message; hint.style.color = 'var(--rose)'; }
  }
}

async function lfmAuthFinalize() {
  const token = localStorage.getItem('dc_lfm_pending_token');
  if (!token) return;
  const btn  = document.getElementById('lfmConnectBtn');
  const hint = document.getElementById('lfmConnectHint');
  btn.disabled = true;
  btn.textContent = 'Connecting…';
  try {
    const data = await lfmPost({ method: 'auth.getSession', token });
    localStorage.setItem('dc_lfm_session_key',  data.session.key);
    localStorage.setItem('dc_lfm_session_user', data.session.name);
    localStorage.removeItem('dc_lfm_pending_token');
    if (hint) { hint.textContent = 'Connect to enable manual scrobbling from this app.'; hint.style.color = ''; }
    updateLfmAuthStatus();
  } catch (e) {
    btn.textContent = "I've authorized ✓";
    btn.disabled = false;
    if (hint) { hint.textContent = 'Error: ' + e.message + ' — make sure you authorized the app on Last.fm first.'; hint.style.color = 'var(--rose)'; }
  }
}

function lfmAuthDisconnect() {
  localStorage.removeItem('dc_lfm_session_key');
  localStorage.removeItem('dc_lfm_session_user');
  localStorage.removeItem('dc_lfm_pending_token');
  const hint = document.getElementById('lfmConnectHint');
  if (hint) { hint.textContent = 'Connect to enable manual scrobbling from this app.'; hint.style.color = ''; }
  updateLfmAuthStatus();
}

// ─── SCROBBLE MODAL ────────────────────────────────────────────
function scrobbleDatetimeLocal(d) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function openScrobbleModal() {
  document.getElementById('scrobbleModal').classList.add('open');
  document.getElementById('scrobbleArtist').value = '';
  document.getElementById('scrobbleTrack').value  = '';
  document.getElementById('scrobbleAlbum').value  = '';
  document.getElementById('scrobbleStatus').textContent = '';
  document.getElementById('scrobbleStatus').className   = 'scrobble-status';
  setScrobbleNow();
}

function closeScrobbleModal() {
  document.getElementById('scrobbleModal').classList.remove('open');
}

function setScrobbleNow() {
  const now = new Date();
  now.setSeconds(0, 0);
  document.getElementById('scrobbleTime').value = scrobbleDatetimeLocal(now);
}

async function submitScrobble() {
  const artist  = document.getElementById('scrobbleArtist').value.trim();
  const track   = document.getElementById('scrobbleTrack').value.trim();
  const album   = document.getElementById('scrobbleAlbum').value.trim();
  const timeVal = document.getElementById('scrobbleTime').value;
  const statusEl= document.getElementById('scrobbleStatus');

  if (!artist || !track) {
    statusEl.textContent = 'Artist and Track are required.';
    statusEl.className   = 'scrobble-status err';
    return;
  }
  const timestamp = Math.floor(new Date(timeVal).getTime() / 1000);
  if (isNaN(timestamp)) {
    statusEl.textContent = 'Invalid date/time.';
    statusEl.className   = 'scrobble-status err';
    return;
  }

  const btn = document.getElementById('scrobbleSubmitBtn');
  btn.disabled = true;
  statusEl.textContent = 'Scrobbling…';
  statusEl.className   = 'scrobble-status loading';

  try {
    const params = { method: 'track.scrobble', artist, track, timestamp: String(timestamp), sk: getScrobbleSession() };
    if (album) params.album = album;
    await lfmPost(params);
    statusEl.textContent = '✓ Scrobbled successfully!';
    statusEl.className   = 'scrobble-status ok';
    setTimeout(closeScrobbleModal, 1500);
  } catch (e) {
    statusEl.textContent = 'Error: ' + e.message;
    statusEl.className   = 'scrobble-status err';
  }
  btn.disabled = false;
}

function bestImage(images) {
  if (!images || !images.length) return null;
  const order = ['extralarge', 'large', 'medium', 'small'];
  for (const size of order) {
    const found = images.find(i => i.size === size && i['#text'] && i['#text'].trim());
    if (found) return found['#text'];
  }
  return null;
}

// Deezer placeholder URLs contain '//' after the image type (no real hash), e.g. /images/artist//500x500-...
function deezerValidUrl(url) {
  if (!url) return null;
  return /\/images\/[^/]+\/\//.test(url) ? null : url;
}

// Deezer requires a CORS proxy for browser requests
const DEEZER_PROXY = 'https://corsproxy.io/?url=';
function deezerFetch(endpoint) {
  return fetch(DEEZER_PROXY + encodeURIComponent('https://api.deezer.com/' + endpoint));
}

// Deezer placeholder URLs contain '//' after the image type (no real hash), e.g. /images/artist//500x500-...
function deezerValidUrl(url) {
  if (!url) return null;
  return /\/images\/[^/]+\/\//.test(url) ? null : url;
}

async function deezerArtistImage(artist) {
  const r = await deezerFetch(`search/artist?q=${encodeURIComponent(artist)}&limit=10`);
  if (!r.ok) return null;
  const d = await r.json();
  const items = d?.data || [];
  const match = items.find(x => x.name?.toLowerCase() === artist.toLowerCase()) || items[0];
  return deezerValidUrl(match?.picture_xl) || deezerValidUrl(match?.picture_big) || deezerValidUrl(match?.picture_medium) || null;
}

async function deezerAlbumImage(album, artist) {
  const r = await deezerFetch(`search/album?q=${encodeURIComponent(artist + ' ' + album)}&limit=10`);
  if (!r.ok) return null;
  const d = await r.json();
  const items = d?.data || [];
  const match = items.find(x =>
    x.title?.toLowerCase().includes(album.toLowerCase()) &&
    x.artist?.name?.toLowerCase().includes(artist.toLowerCase().split(/[\s,&]/)[0])
  ) || items[0];
  return deezerValidUrl(match?.cover_xl) || deezerValidUrl(match?.cover_big) || deezerValidUrl(match?.cover_medium) || null;
}

async function deezerTrackImage(track, artist) {
  const r = await deezerFetch(`search/track?q=${encodeURIComponent(artist + ' ' + track)}&limit=10`);
  if (!r.ok) return null;
  const d = await r.json();
  const items = d?.data || [];
  const match = items.find(x =>
    x.title?.toLowerCase().includes(track.toLowerCase()) &&
    x.artist?.name?.toLowerCase().includes(artist.toLowerCase().split(/[\s,&]/)[0])
  ) || items[0];
  const alb = match?.album;
  return deezerValidUrl(alb?.cover_xl) || deezerValidUrl(alb?.cover_big) || deezerValidUrl(alb?.cover_medium) || null;
}

async function ytSearch(query) {
  if (!YOUTUBE_KEY) return null;
  const q = encodeURIComponent(query);
  const r = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&maxResults=1&key=${YOUTUBE_KEY}`);
  const d = await r.json();
  const item = d?.items?.[0];
  if (!item) return null;
  const videoId = item.id?.videoId;
  // Try maxresdefault first, fall back to hqdefault (always exists)
  if (videoId) {
    const maxres = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const hq = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    // maxresdefault returns a grey placeholder for videos without it — use hqdefault as safe fallback
    return item.snippet?.thumbnails?.maxres?.url || item.snippet?.thumbnails?.high?.url || hq;
  }
  return item.snippet?.thumbnails?.high?.url || null;
}

async function getArtistImage(artist, source) {
  source = source || 'deezer';
  const k = 'artist:' + artist.toLowerCase() + ':' + source;
  if (k in imgCache) return imgCache[k];
  imgCache[k] = null;
  if (source === 'off') return null;
  try {
    if (source === 'itunes') {
      const q = encodeURIComponent(artist);
      const r = await fetch(`https://itunes.apple.com/search?term=${q}&entity=musicTrack&limit=5&attribute=artistTerm`);
      const d = await r.json();
      const results = (d?.results || []).filter(x => x.kind === 'song');
      const match = results.find(x => x.artistName?.toLowerCase() === artist.toLowerCase()) || results[0];
      if (match?.artworkUrl100) {
        imgCache[k] = match.artworkUrl100.replace('100x100bb', '300x300bb');
      }
    } else if (source === 'lastfm') {
      const r = await fetch(lfmUrl('artist.getinfo', { artist, autocorrect: 1 }));
      const d = await r.json();
      imgCache[k] = bestImage(d?.artist?.image) || null;
    } else if (source === 'deezer') {
      imgCache[k] = await deezerArtistImage(artist);
    } else if (source === 'youtube') {
      imgCache[k] = await ytSearch(artist + ' official');
    }
  } catch (e) { imgCache[k] = null; }
  return imgCache[k];
}

async function getAlbumImage(album, artist, source) {
  source = source || 'deezer';
  const k = 'album:' + artist.toLowerCase() + '|||' + album.toLowerCase() + ':' + source;
  if (k in imgCache) return imgCache[k];
  imgCache[k] = null;
  if (source === 'off') return null;
  try {
    if (source === 'itunes') {
      const q = encodeURIComponent(artist + ' ' + album);
      const r = await fetch(`https://itunes.apple.com/search?term=${q}&entity=album&limit=5`);
      const d = await r.json();
      const results = d?.results || [];
      const match = results.find(x =>
        x.collectionName?.toLowerCase().includes(album.toLowerCase()) &&
        x.artistName?.toLowerCase().includes(artist.toLowerCase().split(/[\s,&]/)[0])
      ) || results[0];
      if (match?.artworkUrl100) {
        imgCache[k] = match.artworkUrl100.replace('100x100bb', '600x600bb');
      }
    } else if (source === 'lastfm') {
      const r = await fetch(lfmUrl('album.getinfo', { album, artist, autocorrect: 1 }));
      const d = await r.json();
      imgCache[k] = bestImage(d?.album?.image) || null;
    } else if (source === 'deezer') {
      imgCache[k] = await deezerAlbumImage(album, artist);
    } else if (source === 'youtube') {
      imgCache[k] = await ytSearch(artist + ' ' + album + ' album');
    }
  } catch (e) { imgCache[k] = null; }
  return imgCache[k];
}

async function getTrackImage(track, artist, source) {
  source = source || 'deezer';
  const k = 'track:' + artist.toLowerCase() + '|||' + track.toLowerCase() + ':' + source;
  if (k in imgCache) return imgCache[k];
  imgCache[k] = null;
  if (source === 'off') return null;
  try {
    if (source === 'itunes') {
      const q = encodeURIComponent(artist + ' ' + track);
      const r = await fetch(`https://itunes.apple.com/search?term=${q}&entity=musicTrack&limit=5`);
      const d = await r.json();
      const results = (d?.results || []).filter(x => x.kind === 'song');
      const match = results.find(x =>
        x.trackName?.toLowerCase().includes(track.toLowerCase()) &&
        x.artistName?.toLowerCase().includes(artist.toLowerCase().split(/[\s,&]/)[0])
      ) || results[0];
      if (match?.artworkUrl100) {
        imgCache[k] = match.artworkUrl100.replace('100x100bb', '300x300bb');
      }
    } else if (source === 'lastfm') {
      const r = await fetch(lfmUrl('track.getInfo', { track, artist, autocorrect: 1 }));
      const d = await r.json();
      imgCache[k] = bestImage(d?.track?.album?.image) || null;
    } else if (source === 'deezer') {
      imgCache[k] = await deezerTrackImage(track, artist);
    } else if (source === 'youtube') {
      imgCache[k] = await ytSearch(artist + ' ' + track);
    }
  } catch (e) { imgCache[k] = null; }
  return imgCache[k];
}

function initials(str) {
  return str.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');
}

function thumbHtml(url, fallbackStr, isRank1) {
  if (url) return `<img class="thumb" src="${esc(url)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="thumb-initials" style="display:none">${esc(initials(fallbackStr))}</div>`;
  return `<div class="thumb-initials">${esc(initials(fallbackStr))}</div>`;
}

// After render, fetch images async and inject them into existing rows
async function loadImages(items, type) {
  for (const item of items) {
    const source = (item.prefKey && itemSourcePrefs[item.prefKey]) || 'deezer';
    let url = null;
    if (source !== 'off') {
      try {
        if (type === 'artist') url = await getArtistImage(item.name, source);
        else if (type === 'album') url = await getAlbumImage(item.album, item.artist, source);
        else if (type === 'song') url = await getTrackImage(item.title, item.artist, source);
      } catch (e) { }
      // Throttle Deezer requests to avoid hitting corsproxy.io rate limits
      if (source === 'deezer') await new Promise(r => setTimeout(r, 120));
    }
    const el = document.getElementById(item.imgId);
    if (!el) continue;
    const fallback = item.name || item.title || item.album;
    if (url) {
      el.innerHTML = `<img class="thumb" src="${esc(url)}" alt="" loading="lazy" onerror="this.outerHTML='<div class=thumb-initials>${esc(initials(fallback))}</div>'">`;
    } else {
      el.innerHTML = `<div class="thumb-initials">${esc(initials(fallback))}</div>`;
    }
    if (item.prefKey) {
      const btn = document.getElementById('srcbtn-' + item.imgId);
      if (btn) btn.textContent = srcLabel(source);
    }
  }
}

function cycleImgSrc(imgId, type, prefKey, name, artist, album) {
  const current = itemSourcePrefs[prefKey] || 'deezer';
  const next = IMG_SOURCES[(IMG_SOURCES.indexOf(current) + 1) % IMG_SOURCES.length];
  itemSourcePrefs[prefKey] = next;
  localStorage.setItem('itemSourcePrefs', JSON.stringify(itemSourcePrefs));
  const btn = document.getElementById('srcbtn-' + imgId);
  if (btn) btn.textContent = srcLabel(next);
  const el = document.getElementById(imgId);
  if (!el) return;
  const fallback = name || album || artist || '';
  if (next === 'off') {
    el.innerHTML = `<div class="thumb-initials">${esc(initials(fallback))}</div>`;
    return;
  }
  let fetchPromise;
  if (type === 'artist') fetchPromise = getArtistImage(name, next);
  else if (type === 'album') fetchPromise = getAlbumImage(album, artist, next);
  else fetchPromise = getTrackImage(name, artist, next);
  fetchPromise.then(url => {
    if (!document.getElementById(imgId)) return;
    if (url) {
      el.innerHTML = `<img class="thumb" src="${esc(url)}" alt="" loading="lazy" onerror="this.outerHTML='<div class=thumb-initials>${esc(initials(fallback))}</div>'">`;
    } else {
      el.innerHTML = `<div class="thumb-initials">${esc(initials(fallback))}</div>`;
    }
  });
}

// Handle source-cycle button clicks (capture phase so it beats artist-row handler)
document.addEventListener('click', e => {
  const btn = e.target.closest('.img-src-btn');
  if (!btn) return;
  e.stopPropagation();
  const { imgid, type, prefkey, name, artist, album } = btn.dataset;
  cycleImgSrc(imgid, type, prefkey, name, artist, album);
}, true);



// ─── GOOGLE SHEETS SYNC ────────────────────────────────────────
const DEFAULT_SHEET_ID  = '1ydtkm3-P_37mlOpim0IS5WfIs2LSlVRx_D8fOL4kFVM';
const DEFAULT_SHEET_TAB = 'Full Raw Listening History';
function getSheetUrl() {
  const id  = localStorage.getItem('dc_sheet_id')  || DEFAULT_SHEET_ID;
  const tab = localStorage.getItem('dc_sheet_tab') || DEFAULT_SHEET_TAB;
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv;charset:UTF-8&sheet=${encodeURIComponent(tab)}`;
}
function getDataSource()  { return localStorage.getItem('dc_source')      || 'sheets'; }
function getLastFmUser()  { return localStorage.getItem('dc_lastfm_user') || ''; }
const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // auto-refresh every 6 hours
const POLL_INTERVAL_MS = 30 * 60 * 1000;     // background poll every 30 minutes
let syncTimer = null;
let pollTimer = null;
let lastSyncTime = null;

// ─── INDEXEDDB CACHE (survives page refresh) ───────────────────
const IDB_NAME = 'dankcharts';
const IDB_STORE = 'cache';
const IDB_LASTFM_KEY = 'lastfm';
const IDB_SHEETS_KEY = 'sheets';

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore(IDB_STORE);
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
  });
}
async function loadFromIDB(key) {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(IDB_STORE, 'readonly').objectStore(IDB_STORE).get(key);
      req.onsuccess = e => resolve(e.target.result ?? null);
      req.onerror = e => reject(e.target.error);
    });
  } catch (e) { return null; }
}
async function saveToIDB(key, value) {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = resolve;
      tx.onerror = e => reject(e.target.error);
    });
  } catch (e) { /* ignore */ }
}
async function deleteFromIDB(key) {
  try {
    const db = await openIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(key);
      tx.oncomplete = resolve;
      tx.onerror = resolve;
    });
  } catch (e) { /* ignore */ }
}

function setSyncStatus(msg, cls) {
  const el = document.getElementById('syncStatus');
  el.textContent = msg;
  el.className = cls || '';
}

async function syncFromSheets() {
  const btn = document.getElementById('syncNowBtn');
  btn.disabled = true;
  setSyncStatus(t('sync_connecting'), 'loading');
  try {
    const res = await fetch(getSheetUrl() + '&t=' + Date.now()); // cache-bust
    if (!res.ok) throw new Error('HTTP ' + res.status);
    // Explicitly decode as UTF-8 to preserve special characters
    // (Spanish, Korean, accented names etc.) — never let the browser guess
    const buffer = await res.arrayBuffer();
    const text = new TextDecoder('utf-8').decode(buffer);
    parseCsv(text, true); // true = from sheets (skip hide upload zone)
    lastSyncTime = new Date();
    localStorage.setItem('dc_sync_ts', lastSyncTime.getTime().toString());
    await saveToIDB(IDB_SHEETS_KEY, { ts: lastSyncTime.getTime(), csv: text });
    setSyncStatus(t('sync_ok', { time: lastSyncTime.toLocaleTimeString(), n: allPlays.length.toLocaleString() }), 'ok');
  } catch (e) {
    setSyncStatus(t('sync_failed', { error: e.message }), 'err');
  }
  btn.disabled = false;
  // Schedule next auto-sync and background poll
  clearTimeout(syncTimer);
  syncTimer = setTimeout(syncFromSheets, SYNC_INTERVAL_MS);
  clearTimeout(pollTimer);
  pollTimer = setTimeout(pollSheets, POLL_INTERVAL_MS);
}

async function fetchLastFmPage(username, page) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks`
    + `&user=${encodeURIComponent(username)}&api_key=${LASTFM_KEY}`
    + `&format=json&limit=200&page=${page}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
    const res = await fetch(url);
    if (!res.ok) { if (attempt === 2) throw new Error('HTTP ' + res.status); continue; }
    const data = await res.json();
    if (data.error) throw new Error(data.message);
    return data;
  }
}

async function syncFromLastFm() {
  const username = getLastFmUser();
  if (!username) {
    setSyncStatus('No Last.fm username set — click ⚙ Configure to get started.', 'err');
    return;
  }
  const btn = document.getElementById('syncNowBtn');
  btn.disabled = true;

  // Serve from IndexedDB cache if still fresh (survives page refresh)
  const cached = await loadFromIDB(IDB_LASTFM_KEY);
  const age = cached ? Date.now() - cached.ts : Infinity;
  if (cached && age < SYNC_INTERVAL_MS) {
    try {
      allPlays = cached.data.map(([title, artist, album, uts]) => {
        const ar = artist || '';
        return { title, artist: ar, artists: splitArtists(ar), album: album || '—', date: new Date(uts * 1000) };
      });
      lastSyncTime = new Date(cached.ts);
      const minsAgo = Math.round(age / 60000);
      setSyncStatus(t('sync_ok_cached', { time: lastSyncTime.toLocaleTimeString(), n: allPlays.length.toLocaleString(), mins: minsAgo }), 'ok');
      finalizeLoad();
      btn.disabled = false;
      clearTimeout(syncTimer);
      syncTimer = setTimeout(syncFromLastFm, SYNC_INTERVAL_MS - age);
      clearTimeout(pollTimer);
      pollTimer = setTimeout(pollLastFm, POLL_INTERVAL_MS);
      return;
    } catch (e) { /* cache corrupt — fall through to fresh fetch */ }
  }

  let rawTracks = [];
  try {
    // Fetch page 1 to discover totalPages
    setSyncStatus('Loading Last.fm history… page 1', 'loading');
    const firstData = await fetchLastFmPage(username, 1);
    const totalPages = parseInt(firstData.recenttracks['@attr'].totalPages) || 1;
    let tracks = firstData.recenttracks.track;
    if (!Array.isArray(tracks)) tracks = tracks ? [tracks] : [];
    for (const tr of tracks) { if (tr.date && tr.date.uts) rawTracks.push(tr); }

    if (totalPages > 1) {
      // Rolling concurrency pool: always keep up to CONCURRENCY requests in-flight.
      // Unlike fixed batches, this never idles waiting for the slowest request in a group.
      // CONCURRENCY=10 keeps us within Last.fm's ~5 req/s limit for large accounts.
      const CONCURRENCY = 10;
      let nextPage = 2;
      let completedPages = 1;
      await new Promise((resolve) => {
        let inFlight = 0;
        function fill() {
          while (inFlight < CONCURRENCY && nextPage <= totalPages) {
            const p = nextPage++;
            inFlight++;
            fetchLastFmPage(username, p).then(data => {
              let t = data.recenttracks.track;
              if (!Array.isArray(t)) t = t ? [t] : [];
              for (const tr of t) { if (tr.date && tr.date.uts) rawTracks.push(tr); }
            }).catch(e => {
              console.warn(`Last.fm: page ${p} failed (${e.message}), skipping`);
            }).finally(() => {
              completedPages++;
              if (completedPages % 20 === 0 || completedPages === totalPages) {
                setSyncStatus(`Loading Last.fm history… ${completedPages} / ${totalPages} pages`, 'loading');
              }
              inFlight--;
              if (nextPage > totalPages && inFlight === 0) resolve();
              else fill();
            });
          }
          if (nextPage > totalPages && inFlight === 0) resolve();
        }
        fill();
      });
    }
  } catch (e) {
    setSyncStatus('Last.fm error: ' + e.message, 'err');
    btn.disabled = false;
    return;
  }

  allPlays = rawTracks.map(t => {
    const ar = (t.artist && t.artist['#text']) || '';
    return {
      title:   t.name || '',
      artist:  ar,
      artists: splitArtists(ar),
      album:   (t.album && t.album['#text']) || '—',
      date:    new Date(parseInt(t.date.uts) * 1000)
    };
  });

  const compact = rawTracks.map(t => [
    t.name || '',
    (t.artist && t.artist['#text']) || '',
    (t.album  && t.album['#text'])  || '',
    parseInt(t.date.uts)
  ]);
  await saveToIDB(IDB_LASTFM_KEY, { data: compact, ts: Date.now() });
  lastSyncTime = new Date();

  setSyncStatus(t('sync_ok', { time: lastSyncTime.toLocaleTimeString(), n: allPlays.length.toLocaleString() }), 'ok');
  finalizeLoad();
  btn.disabled = false;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(syncFromLastFm, SYNC_INTERVAL_MS);
  clearTimeout(pollTimer);
  pollTimer = setTimeout(pollLastFm, POLL_INTERVAL_MS);
}

function syncNow() {
  if (getDataSource() === 'lastfm') syncFromLastFm();
  else syncFromSheets();
}

// ─── BACKGROUND POLL (every 30 min) ───────────────────────────

// Pure CSV parser — returns sorted plays array or null, no UI side effects.
function parsePlaysCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return null;
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
  const colMap = {};
  const aliases = {
    title:    ['song title', 'title', 'track', 'track name', 'song name'],
    artist:   ['artist', 'artist name', 'performer'],
    album:    ['album', 'album name', 'release'],
    datetime: ['date and time', 'date', 'datetime', 'timestamp', 'time', 'played at', 'scrobble time']
  };
  for (const [key, names] of Object.entries(aliases)) {
    for (const n of names) {
      const idx = headers.indexOf(n);
      if (idx !== -1) { colMap[key] = idx; break; }
    }
  }
  if (colMap.title === undefined || colMap.artist === undefined || colMap.datetime === undefined) return null;
  let fastDateParse = null;
  for (let i = 1; i < lines.length && !fastDateParse; i++) {
    const r = splitCsvRow(lines[i]);
    if (r.length < 2) continue;
    const sample = r[colMap.datetime] !== undefined ? r[colMap.datetime].replace(/^"|"$/g, '').trim() : '';
    if (sample) fastDateParse = makeFastDateParser(sample) || parseDate;
  }
  if (!fastDateParse) fastDateParse = parseDate;
  const plays = [];
  for (let i = 1; i < lines.length; i++) {
    const row = splitCsvRow(lines[i]);
    if (row.length < 2) continue;
    const get = idx => (idx !== undefined && row[idx] !== undefined) ? row[idx].replace(/^"|"$/g, '').trim() : '';
    const rawDate = get(colMap.datetime);
    let dt = fastDateParse(rawDate);
    if (!dt && fastDateParse !== parseDate) dt = parseDate(rawDate);
    if (!dt) continue;
    const artistRaw = get(colMap.artist);
    plays.push({ title: get(colMap.title), artist: artistRaw, artists: splitArtists(artistRaw), album: get(colMap.album) || '—', date: dt });
  }
  if (!plays.length) return null;
  plays.sort((a, b) => b.date - a.date);
  return plays;
}

// Lightweight re-render after a background poll — does NOT restore settings or click period buttons.
function refreshAfterPoll() {
  if (!allPlays.length) return;
  firstSeenMaps = null;
  window.firstScrobbleDate = allPlays.reduce((min, p) => p.date < min ? p.date : min, allPlays[0].date);
  updateMastheadDynamic();
  populateYearPicker();
  if (currentPeriod === 'rawdata') applyRawFilters();
  else if (currentPeriod === 'graphs') renderGraphs();
  else if (currentPeriod === 'records') buildRecords();
  else renderAll();
}

async function pollLastFm() {
  const username = getLastFmUser();
  if (username && allPlays.length) {
    try {
      const data = await fetchLastFmPage(username, 1);
      let tracks = data.recenttracks.track;
      if (!Array.isArray(tracks)) tracks = tracks ? [tracks] : [];
      const newestKnown = allPlays[0].date;
      const newTracks = tracks.filter(tr => tr.date?.uts && new Date(parseInt(tr.date.uts) * 1000) > newestKnown);
      if (newTracks.length > 0) {
        const newPlays = newTracks.map(tr => {
          const ar = (tr.artist?.['#text']) || '';
          return { title: tr.name || '', artist: ar, artists: splitArtists(ar), album: tr.album?.['#text'] || '—', date: new Date(parseInt(tr.date.uts) * 1000) };
        });
        allPlays = [...newPlays, ...allPlays];
        // Update IDB cache data while preserving the original ts so the 6-hour full sync still fires on schedule
        const cached = await loadFromIDB(IDB_LASTFM_KEY);
        if (cached) {
          const newCompact = newTracks.map(tr => [tr.name || '', tr.artist?.['#text'] || '', tr.album?.['#text'] || '', parseInt(tr.date.uts)]);
          await saveToIDB(IDB_LASTFM_KEY, { data: [...newCompact, ...cached.data], ts: cached.ts });
        }
        lastSyncTime = new Date();
        setSyncStatus(t('sync_ok', { time: lastSyncTime.toLocaleTimeString(), n: allPlays.length.toLocaleString() }), 'ok');
        refreshAfterPoll();
      }
    } catch (e) { /* silent — full sync will catch up */ }
  }
  clearTimeout(pollTimer);
  pollTimer = setTimeout(pollLastFm, POLL_INTERVAL_MS);
}

async function pollSheets() {
  try {
    const res = await fetch(getSheetUrl() + '&t=' + Date.now());
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buffer = await res.arrayBuffer();
    const text = new TextDecoder('utf-8').decode(buffer);
    const newPlays = parsePlaysCsv(text);
    if (newPlays) {
      const changed = newPlays.length !== allPlays.length ||
        (newPlays.length > 0 && allPlays.length > 0 && newPlays[0].date.getTime() !== allPlays[0].date.getTime());
      if (changed) {
        allPlays = newPlays;
        // Preserve original ts so the 6-hour full sync still fires on schedule
        const cached = await loadFromIDB(IDB_SHEETS_KEY);
        await saveToIDB(IDB_SHEETS_KEY, { ts: cached ? cached.ts : Date.now(), csv: text });
        lastSyncTime = new Date();
        setSyncStatus(t('sync_ok', { time: lastSyncTime.toLocaleTimeString(), n: allPlays.length.toLocaleString() }), 'ok');
        refreshAfterPoll();
      }
    }
  } catch (e) { /* silent — full sync will catch up */ }
  clearTimeout(pollTimer);
  pollTimer = setTimeout(pollSheets, POLL_INTERVAL_MS);
}

// ─── DATA SOURCE MODAL ─────────────────────────────────────────
function populateTzSelect() {
  const sel = document.getElementById('srcTimezone');
  if (sel.dataset.populated) return;
  sel.dataset.populated = '1';
  let zones;
  try { zones = Intl.supportedValuesOf('timeZone'); }
  catch(e) {
    zones = ['UTC','America/Anchorage','America/Los_Angeles','America/Denver','America/Chicago',
             'America/New_York','America/Sao_Paulo','Atlantic/Azores','Europe/London','Europe/Paris',
             'Europe/Berlin','Europe/Helsinki','Asia/Dubai','Asia/Karachi','Asia/Kolkata',
             'Asia/Dhaka','Asia/Bangkok','Asia/Singapore','Asia/Manila','Asia/Tokyo',
             'Australia/Sydney','Pacific/Auckland','Pacific/Honolulu'];
  }
  const now = new Date();
  function getTzOffset(tz) {
    try {
      const parts = new Intl.DateTimeFormat('en', { timeZoneName: 'shortOffset', timeZone: tz }).formatToParts(now);
      return parts.find(p => p.type === 'timeZoneName')?.value || '';
    } catch(e) { return ''; }
  }
  const groups = {};
  for (const tz of zones) {
    const slash = tz.indexOf('/');
    const region = slash >= 0 ? tz.slice(0, slash) : 'Etc';
    (groups[region] || (groups[region] = [])).push(tz);
  }
  for (const [region, tzs] of Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))) {
    const grp = document.createElement('optgroup');
    grp.label = region;
    for (const tz of tzs) {
      const opt = document.createElement('option');
      opt.value = tz;
      const offset = getTzOffset(tz);
      opt.textContent = tz.replace(/_/g, ' ') + (offset ? ' (' + offset + ')' : '');
      grp.appendChild(opt);
    }
    sel.appendChild(grp);
  }
}

function openSourceModal() {
  document.getElementById('configureSourceBtn').classList.remove('configure-attention');
  const modal = document.getElementById('sourceModal');
  modal.classList.add('open');
  const src = getDataSource();
  document.getElementById('srcRadioSheets').checked = src === 'sheets';
  document.getElementById('srcRadioLastfm').checked = src === 'lastfm';
  document.getElementById('srcDisplayName').value  = localStorage.getItem('dc_display_name') || '';
  populateTzSelect();
  document.getElementById('srcTimezone').value = userTimezone;
  document.getElementById('srcSheetId').value      = localStorage.getItem('dc_sheet_id')  || DEFAULT_SHEET_ID;
  document.getElementById('srcSheetTab').value     = localStorage.getItem('dc_sheet_tab') || DEFAULT_SHEET_TAB;
  document.getElementById('srcLastfmUser').value   = getLastFmUser();
  document.getElementById('srcLfmApiKey').value    = getScrobbleKey();
  document.getElementById('srcLfmApiSecret').value = getScrobbleSecret();
  updateSourceModalFields();
}

function closeSourceModal() {
  document.getElementById('sourceModal').classList.remove('open');
}

function updateSourceModalFields() {
  const isSheets = document.getElementById('srcRadioSheets').checked;
  document.getElementById('srcSheetsFields').style.display = isSheets ? '' : 'none';
  document.getElementById('srcLastfmFields').style.display = isSheets ? 'none' : '';
  if (!isSheets) updateLfmAuthStatus();
}

function saveSourceConfig() {
  const displayName = document.getElementById('srcDisplayName').value.trim();
  if (displayName) localStorage.setItem('dc_display_name', displayName);
  else localStorage.removeItem('dc_display_name');
  const selTz = document.getElementById('srcTimezone').value;
  if (selTz) {
    userTimezone = selTz;
    _tzFmt = null;
    try { localStorage.setItem('dc_timezone', selTz); } catch(e) {}
  }
  updateMastheadDynamic();
  const src = document.getElementById('srcRadioSheets').checked ? 'sheets' : 'lastfm';
  localStorage.setItem('dc_source', src);
  if (src === 'sheets') {
    localStorage.setItem('dc_sheet_id',  document.getElementById('srcSheetId').value.trim());
    localStorage.setItem('dc_sheet_tab', document.getElementById('srcSheetTab').value.trim());
    deleteFromIDB(IDB_LASTFM_KEY);
    localStorage.removeItem('dc_lastfm_ts'); // clean up old key
  } else {
    localStorage.setItem('dc_lastfm_user', document.getElementById('srcLastfmUser').value.trim());
    deleteFromIDB(IDB_SHEETS_KEY);
    localStorage.removeItem('dc_sync_ts');
  }
  // Always persist LFM API credentials when filled in (used for scrobbling regardless of data source)
  const apiKey    = document.getElementById('srcLfmApiKey').value.trim();
  const apiSecret = document.getElementById('srcLfmApiSecret').value.trim();
  if (apiKey)    localStorage.setItem('dc_lfm_api_key',    apiKey);
  if (apiSecret) localStorage.setItem('dc_lfm_api_secret', apiSecret);
  closeSourceModal();
  syncNow();
}

document.getElementById('syncNowBtn').addEventListener('click', syncNow);

// Auto-sync on page load — use cached data if synced within the last hour
window.addEventListener('load', async () => {
  document.getElementById('mainApp').style.display = 'block';
  updateMastheadDynamic();
  updateLfmAuthStatus();
  localStorage.removeItem('dc_sync_csv'); // clean up old oversized key if present

  if (!localStorage.getItem('dc_display_name')) {
    const btn = document.getElementById('configureSourceBtn');
    btn.classList.add('configure-attention');
    btn.title = 'Start here — configure your data source';
  }

  if (getDataSource() === 'lastfm') {
    syncFromLastFm();
    return;
  }

  const cached = await loadFromIDB(IDB_SHEETS_KEY);
  const age = cached ? Date.now() - cached.ts : Infinity;
  if (cached && age < SYNC_INTERVAL_MS) {
    // Load from IndexedDB cache (survives tab close / browser restart)
    lastSyncTime = new Date(cached.ts);
    parseCsv(cached.csv, true);
    const minsAgo = Math.round(age / 60000);
    setSyncStatus(t('sync_ok_cached', { time: lastSyncTime.toLocaleTimeString(), n: allPlays.length.toLocaleString(), mins: minsAgo }), 'ok');
    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncFromSheets, SYNC_INTERVAL_MS - age);
    clearTimeout(pollTimer);
    pollTimer = setTimeout(pollSheets, POLL_INTERVAL_MS);
  } else {
    syncFromSheets();
  }
});

function parseCsv(text, fromSheets = false) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) {
    if (!fromSheets) return;
    setSyncStatus(t('sync_empty'), 'err'); return;
  }

  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());

  const colMap = {};
  const aliases = {
    title: ['song title', 'title', 'track', 'track name', 'song name'],
    artist: ['artist', 'artist name', 'performer'],
    album: ['album', 'album name', 'release'],
    datetime: ['date and time', 'date', 'datetime', 'timestamp', 'time', 'played at', 'scrobble time']
  };
  for (const [key, names] of Object.entries(aliases)) {
    for (const n of names) {
      const idx = headers.indexOf(n);
      if (idx !== -1) { colMap[key] = idx; break; }
    }
  }

  if (colMap.title === undefined || colMap.artist === undefined || colMap.datetime === undefined) {
    setSyncStatus(t('sync_missing_cols'), 'err'); return;
  }

  allPlays = [];
  let skippedBlank = 0;
  let skippedDate = 0;
  let skippedDateSamples = [];

  // Detect date format from first data row to avoid 5-regex fallback on every row
  let fastDateParse = null;
  for (let i = 1; i < lines.length && !fastDateParse; i++) {
    const r = splitCsvRow(lines[i]);
    if (r.length < 2) continue;
    const sample = (colMap.datetime !== undefined && r[colMap.datetime] !== undefined)
      ? r[colMap.datetime].replace(/^"|"$/g, '').trim() : '';
    if (sample) fastDateParse = makeFastDateParser(sample) || parseDate; // fallback to full parser
  }
  if (!fastDateParse) fastDateParse = parseDate;

  for (let i = 1; i < lines.length; i++) {
    const row = splitCsvRow(lines[i]);
    if (row.length < 2) { skippedBlank++; continue; }
    const get = idx => (idx !== undefined && row[idx] !== undefined) ? row[idx].replace(/^"|"$/g, '').trim() : '';
    const rawDate = get(colMap.datetime);
    let dt = fastDateParse(rawDate);
    if (!dt && fastDateParse !== parseDate) dt = parseDate(rawDate); // rare fallback for outlier rows
    if (!dt) {
      skippedDate++;
      if (skippedDateSamples.length < 20 && rawDate) skippedDateSamples.push(`row ${i + 1}: "${rawDate}"`);
      continue;
    }
    const artistRaw = get(colMap.artist);
    allPlays.push({
      title: get(colMap.title),
      artist: artistRaw,
      artists: splitArtists(artistRaw),
      album: get(colMap.album) || '—',
      date: dt
    });
  }

  const totalSkipped = skippedBlank + skippedDate;
  if (totalSkipped > 0) {
    console.warn(`dankcharts.fm: skipped ${totalSkipped} rows total — ${skippedDate} bad/missing date, ${skippedBlank} blank/short rows.`);
    if (skippedDateSamples.length) console.warn('Date parse failures (up to 20):', skippedDateSamples);
    setSyncStatus(t('sync_warning', { total: totalSkipped, date: skippedDate, blank: skippedBlank }), 'loading');
  }

  if (allPlays.length === 0) {
    setSyncStatus(t('sync_no_valid'), 'err'); return;
  }

  allPlays.sort((a, b) => b.date - a.date);
  finalizeLoad();
}

function finalizeLoad() {
  firstSeenMaps = null;
  if (allPlays.length) {
    window.firstScrobbleDate = allPlays.reduce((min, p) => p.date < min ? p.date : min, allPlays[0].date);
    updateMastheadDynamic();
  }
  populateYearPicker();

  // Restore saved granularity before rendering
  const savedGran = localStorage.getItem('dc_gran');
  if (savedGran && ['day', 'month', 'year'].includes(savedGran)) {
    graphGranularity = savedGran;
    document.querySelectorAll('#graphGranularity button').forEach(b => {
      b.classList.toggle('active', b.dataset.gran === graphGranularity);
    });
  }

  // Restore chart sizes
  const savedWeekly = localStorage.getItem('dc_chartSizeWeekly');
  if (savedWeekly) {
    chartSizeWeekly = parseInt(savedWeekly);
    document.querySelectorAll('#sizeBtnsWeekly button').forEach(b => b.classList.toggle('active', b.dataset.size === savedWeekly));
  }
  const savedMonthly = localStorage.getItem('dc_chartSizeMonthly');
  if (savedMonthly) {
    chartSizeMonthly = parseInt(savedMonthly);
    document.querySelectorAll('#sizeBtnsMonthly button').forEach(b => b.classList.toggle('active', b.dataset.size === savedMonthly));
  }
  const savedYearly = localStorage.getItem('dc_chartSizeYearly');
  if (savedYearly) {
    const pv = parseInt(savedYearly);
    chartSizeYearly = pv === 0 ? Infinity : pv;
    document.querySelectorAll('#sizeBtnsYearly button').forEach(b => b.classList.toggle('active', b.dataset.size === savedYearly));
  }
  const savedAllTime = localStorage.getItem('dc_chartSizeAllTime');
  if (savedAllTime) {
    const pv = parseInt(savedAllTime);
    chartSizeAllTime = pv === 0 ? Infinity : pv;
    document.querySelectorAll('#sizeBtnsAllTime button').forEach(b => b.classList.toggle('active', b.dataset.size === savedAllTime));
  }

  // Restore graph settings (cumulative, total volume, volume comparison)
  const savedCumArtists = localStorage.getItem('dc_gCumulativeArtists');
  if (savedCumArtists) try { gCumulativeArtists = JSON.parse(savedCumArtists); renderCumulativeChips(); } catch (e) { }
  if (localStorage.getItem('dc_gCumulativeLabels') === '1') {
    gCumulativeLabels = true;
    updateLabelButton('gCumulativeLabelsBtn', true);
  }
  const savedCumFrom = localStorage.getItem('dc_gCumulativeFrom');
  if (savedCumFrom) document.getElementById('gCumulativeFrom').value = savedCumFrom;
  const savedCumTo = localStorage.getItem('dc_gCumulativeTo');
  if (savedCumTo) document.getElementById('gCumulativeTo').value = savedCumTo;

  if (localStorage.getItem('dc_gTotalVolumeLabels') === '1') {
    gTotalVolumeLabels = true;
    updateLabelButton('gTotalVolumeLabelsBtn', true);
  }
  if (localStorage.getItem('dc_gDiscoveriesLabels') === '1') {
    gDiscoveriesLabels = true;
    updateLabelButton('gDiscoveriesLabelsBtn', true);
  }
  const savedTVFrom = localStorage.getItem('dc_gTotalVolumeFrom');
  if (savedTVFrom) document.getElementById('gTotalVolumeFrom').value = savedTVFrom;
  const savedTVTo = localStorage.getItem('dc_gTotalVolumeTo');
  if (savedTVTo) document.getElementById('gTotalVolumeTo').value = savedTVTo;

  const savedVolArtists = localStorage.getItem('dc_gVolumeArtists');
  if (savedVolArtists) try { gVolumeArtists = JSON.parse(savedVolArtists); renderVolumeChips(); } catch (e) { }
  if (localStorage.getItem('dc_gVolumeLabels') === '1') {
    gVolumeLabels = true;
    updateLabelButton('gVolumeLabelsBtn', true);
  }
  const savedVolFrom = localStorage.getItem('dc_gVolumeFrom');
  if (savedVolFrom) document.getElementById('gVolumeFrom').value = savedVolFrom;
  const savedVolTo = localStorage.getItem('dc_gVolumeTo');
  if (savedVolTo) document.getElementById('gVolumeTo').value = savedVolTo;

  // Restore race/graph settings
  const savedRaceSpeed = localStorage.getItem('dc_raceSpeed');
  if (savedRaceSpeed) {
    raceSpeed = parseFloat(savedRaceSpeed);
    document.querySelectorAll('#raceSpeedBtns button').forEach(b => b.classList.toggle('active', b.dataset.speed === savedRaceSpeed));
  }
  const savedRaceTopN = localStorage.getItem('dc_raceTopN');
  if (savedRaceTopN) {
    raceTopN = parseInt(savedRaceTopN);
    document.querySelectorAll('#raceTopNBtns button').forEach(b => b.classList.toggle('active', b.dataset.topn === savedRaceTopN));
  }
  const savedRaceType = localStorage.getItem('dc_raceType');
  if (savedRaceType) {
    raceType = savedRaceType;
    document.querySelectorAll('#raceTypeBtns button').forEach(b => b.classList.toggle('active', b.dataset.racetype === savedRaceType));
  }
  const savedRaceFrom = localStorage.getItem('dc_raceFrom');
  if (savedRaceFrom) document.getElementById('raceFrom').value = savedRaceFrom;
  const savedRaceTo = localStorage.getItem('dc_raceTo');
  if (savedRaceTo) document.getElementById('raceTo').value = savedRaceTo;

  renderAll();
  maybeLoadUpcoming();

  // Restore saved period (after renderAll so DOM is ready)
  const savedPeriod = localStorage.getItem('dc_period');
  if (savedPeriod && savedPeriod !== 'week') {
    const periodBtn = document.querySelector(`#periodNav button[data-period="${savedPeriod}"]`);
    if (periodBtn) periodBtn.click();
  }

  // Restore saved records limit
  const savedRecLimit = localStorage.getItem('dc_rec_limit');
  if (savedRecLimit) {
    recLimit = parseInt(savedRecLimit, 10);
    const btn = document.querySelector(`#recordsSizeBtns button[data-rec-size="${savedRecLimit}"]`);
    if (btn) {
      document.querySelectorAll('#recordsSizeBtns button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }
}

function splitCsvRow(row) {
  if (row.indexOf('"') === -1) return row.split(','); // fast path: no quoted fields
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const c = row[i];
    if (c === '"') { inQuotes = !inQuotes; }
    else if (c === ',' && !inQuotes) { result.push(cur); cur = ''; }
    else { cur += c; }
  }
  result.push(cur);
  return result;
}

// Returns a specialized fast parser if the date sample matches a common unambiguous
// format, falling back to the full parseDate otherwise. Called once per CSV load.
function makeFastDateParser(sample) {
  if (!sample) return null;
  // YYYY-MM-DD or YYYY/MM/DD with optional time — most Google Sheets exports
  if (/^\d{4}[\/\-]\d{2}[\/\-]\d{2}/.test(sample)) {
    return str => {
      const y = +str.slice(0, 4), mo = +str.slice(5, 7) - 1, d = +str.slice(8, 10);
      if (isNaN(y) || isNaN(mo) || isNaN(d)) return null;
      const h = str.length > 10 ? +(str.slice(11, 13)) || 0 : 0;
      const mi = str.length > 13 ? +(str.slice(14, 16)) || 0 : 0;
      const dt = new Date(y, mo, d, h, mi);
      return isNaN(dt) ? null : dt;
    };
  }
  // Unix timestamp (10 digits)
  if (/^\d{10}$/.test(sample)) {
    return str => { const n = +str; return n ? new Date(n * 1000) : null; };
  }
  // Google Sheets date serial (plain number)
  if (/^\d{4,6}(\.\d+)?$/.test(sample)) {
    const EPOCH = new Date(1899, 11, 30).getTime();
    return str => {
      const serial = parseFloat(str);
      return (serial > 1 && serial < 100000) ? new Date(EPOCH + serial * 86400000) : null;
    };
  }
  return null;
}

function parseDate(str) {
  if (!str || !str.trim()) return null;
  str = str.trim();

  // Spanish month abbreviations and full names
  const ES_MONTHS = {
    'ene': 1, 'feb': 2, 'mar': 3, 'abr': 4, 'may': 5, 'jun': 6,
    'jul': 7, 'ago': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dic': 12,
    'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
    'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
  };

  // D/MMM/YYYY H:MM:SS — e.g. "9/ene/2016 2:14:01"
  let m = str.match(/^(\d{1,2})\/([a-záéíóúüñA-Z]+)\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/i);
  if (m) {
    const mon = ES_MONTHS[m[2].toLowerCase()];
    if (mon) {
      const d = new Date(+m[3], mon - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
      if (!isNaN(d)) return d;
    }
  }

  // Already a valid date string (ISO, RFC, etc.)
  let d = new Date(str);
  if (!isNaN(d) && d.getFullYear() > 1990) return d;

  // MM/DD/YYYY HH:MM:SS or MM/DD/YYYY
  m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (m) {
    d = new Date(+m[3], +m[1] - 1, +m[2], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
    if (!isNaN(d)) return d;
  }

  // DD/MM/YYYY or DD-MM-YYYY
  m = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (m) {
    const asMMDD = new Date(+m[3], +m[1] - 1, +m[2], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
    const asDDMM = new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
    if (!isNaN(asMMDD) && +m[1] <= 12) return asMMDD;
    if (!isNaN(asDDMM)) return asDDMM;
  }

  // YYYY/MM/DD or YYYY-MM-DD with optional time
  m = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})(?:[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (m) {
    d = new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
    if (!isNaN(d)) return d;
  }

  // Google Sheets date serial
  if (/^\d+(\.\d+)?$/.test(str)) {
    const serial = parseFloat(str);
    if (serial > 1 && serial < 100000) {
      const epoch = new Date(1899, 11, 30);
      d = new Date(epoch.getTime() + serial * 86400000);
      if (!isNaN(d) && d.getFullYear() > 1990) return d;
    }
  }

  return null;
}

// ─── PERIOD NAV ────────────────────────────────────────────────
document.getElementById('sizeBtnsWeekly').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#sizeBtnsWeekly button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  chartSizeWeekly = parseInt(btn.dataset.size);
  chartSize = chartSizeWeekly;
  localStorage.setItem('dc_chartSizeWeekly', btn.dataset.size);
  renderAll();
});

document.getElementById('sizeBtnsMonthly').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#sizeBtnsMonthly button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  chartSizeMonthly = parseInt(btn.dataset.size);
  chartSize = chartSizeMonthly;
  localStorage.setItem('dc_chartSizeMonthly', btn.dataset.size);
  renderAll();
});

document.getElementById('sizeBtnsYearly').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#sizeBtnsYearly button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const v = parseInt(btn.dataset.size);
  chartSizeYearly = v === 0 ? Infinity : v;
  localStorage.setItem('dc_chartSizeYearly', btn.dataset.size);
  ['songs', 'artists', 'albums'].forEach(t => { searchState[t] = ''; const inp = document.getElementById(t + 'SearchInput'); if (inp) inp.value = ''; pageState[t] = 0; });
  renderAll();
});

document.getElementById('sizeBtnsAllTime').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#sizeBtnsAllTime button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const v = parseInt(btn.dataset.size);
  chartSizeAllTime = v === 0 ? Infinity : v;
  localStorage.setItem('dc_chartSizeAllTime', btn.dataset.size);
  ['songs', 'artists', 'albums'].forEach(t => { searchState[t] = ''; const inp = document.getElementById(t + 'SearchInput'); if (inp) inp.value = ''; pageState[t] = 0; });
  renderAll();
});

// ─── NAVIGATE TO RECORD PERIOD ────────────────────────────────
function navigateToRecPeriod(period, periodKey) {
  const now = tzNow();
  let offset = 0;
  if (period === 'week') {
    const nowDow = now.getDay();
    const nowOffset = (nowDow - weekStartDay + 7) % 7;
    const curStart = new Date(now); curStart.setDate(now.getDate() - nowOffset); curStart.setHours(0, 0, 0, 0);
    const targetStart = new Date(periodKey + 'T00:00:00');
    offset = Math.round((curStart - targetStart) / (7 * 86400000));
  } else if (period === 'month') {
    const [yr, mo] = periodKey.split('-').map(Number);
    offset = (now.getFullYear() - yr) * 12 + (now.getMonth() + 1 - mo);
  }
  if (offset >= 0) {
    savedOffsets[currentPeriod] = currentOffset;
    // If coming from records/graphs/rawdata, restore the chart UI
    if (currentPeriod === 'records' || currentPeriod === 'graphs' || currentPeriod === 'rawdata') {
      document.getElementById('recordsView').style.display = 'none';
      document.getElementById('graphsView').style.display = 'none';
      document.getElementById('rawDataView').style.display = 'none';
      document.getElementById('dateNav').style.display = '';
      document.getElementById('statsStrip').style.display = '';
      document.getElementById('songsSection').style.display = '';
      document.getElementById('artistsSection').style.display = '';
      document.getElementById('albumsSection').style.display = '';
      document.getElementById('upcomingSection').style.display = '';
      document.getElementById('recentSection').style.display = '';
      if (currentPeriod === 'graphs') destroyGraphCharts();
    }
    currentPeriod = period;
    localStorage.setItem('dc_period', currentPeriod);
    document.querySelectorAll('.period-nav button').forEach(b => b.classList.toggle('active', b.dataset.period === period));
    currentOffset = offset;
    savedOffsets[period] = offset;
    pageState.songs = 0; pageState.artists = 0; pageState.albums = 0;
    renderAll();
  }
}

// ─── RECORDS & HALL OF FAME ────────────────────────────────────
function buildRecords() {
  if (!allPlays.length) return;

  const wSize = chartSizeWeekly;
  const mSize = chartSizeMonthly;
  const ySize = isFinite(chartSizeYearly) ? chartSizeYearly : 999999;

  // Name lookup tables
  const songNames = {}, albumNames = {};
  for (const p of allPlays) {
    const sk = songKey(p);
    if (!songNames[sk]) songNames[sk] = { title: p.title, artist: p.artist, album: p.album };
    const ak = p.album + '|||' + albumArtist(p);
    if (!albumNames[ak]) albumNames[ak] = { album: p.album, artist: albumArtist(p) };
  }

  function fmtPeriodKey(pk, pt) {
    if (pt === 'week') { const d = new Date(pk + 'T00:00:00'); return t('period_week_of', { date: fmt(d) }); }
    if (pt === 'month') {
      const [yr, mo] = pk.split('-');
      const monthKey = ['month_jan', 'month_feb', 'month_mar', 'month_apr', 'month_may_short', 'month_jun', 'month_jul', 'month_aug', 'month_sep', 'month_oct', 'month_nov', 'month_dec'][+mo - 1];
      const monthName = t(monthKey);
      return `${monthName} ${yr}`;
    }
    return pk;
  }
  function periodAtOneHeader(pt) { return pt === 'week' ? t('rec_th_weeks_at_1') : pt === 'month' ? t('rec_th_months_at_1') : t('rec_th_years_at_1'); }

  // Group plays by period
  const chron = [...allPlays].sort((a, b) => a.date - b.date);
  const weekPlaysMap = {}, monthPlaysMap = {}, yearPlaysMap = {};
  for (const p of chron) {
    const wk = playWeekKey(p.date);
    const _td = tzDate(p.date);
    const mk = _td.getFullYear() + '-' + String(_td.getMonth() + 1).padStart(2, '0');
    const yk = String(_td.getFullYear());
    (weekPlaysMap[wk] || (weekPlaysMap[wk] = [])).push(p);
    (monthPlaysMap[mk] || (monthPlaysMap[mk] = [])).push(p);
    (yearPlaysMap[yk] || (yearPlaysMap[yk] = [])).push(p);
  }
  const weekKeys = Object.keys(weekPlaysMap).sort();
  const monthKeys = Object.keys(monthPlaysMap).sort();
  const yearKeys = Object.keys(yearPlaysMap).sort();

  // First/last play data for appearances charts
  const songFirstPlay = {}, songLastPlay = {};
  const artistFirstSongName = {}, artistLastSongName = {};
  const albumFirstPlayDate = {}, albumFirstSongName = {};
  const artistFirstAlbum = {};
  for (const p of chron) {
    const sk = songKey(p);
    if (!songFirstPlay[sk]) songFirstPlay[sk] = p.date;
    songLastPlay[sk] = p.date;
    for (const a of p.artists) {
      if (!artistFirstSongName[a]) artistFirstSongName[a] = p.title;
      artistLastSongName[a] = p.title;
      if (!artistFirstAlbum[a] && p.album && p.album !== '—') {
        artistFirstAlbum[a] = { album: p.album, albumKey: p.album + '|||' + albumArtist(p), artist: albumArtist(p) };
      }
    }
    if (p.album && p.album !== '—') {
      const ak = p.album + '|||' + albumArtist(p);
      if (!albumFirstPlayDate[ak]) { albumFirstPlayDate[ak] = p.date; albumFirstSongName[ak] = p.title; }
    }
  }

  // Records containers
  const song1s = { week: {}, month: {}, year: {} };
  const artist1s = { week: {}, month: {}, year: {} };
  const album1s = { week: {}, month: {}, year: {} };
  const songApps = { week: {}, month: {}, year: {} };
  const artistApps = { week: {}, month: {}, year: {} };
  const albumApps = { week: {}, month: {}, year: {} };
  const songDebuts = { week: {}, month: {}, year: {} };
  const artistDebuts = { week: {}, month: {}, year: {} };
  const albumDebuts = { week: {}, month: {}, year: {} };
  const songPP = { week: {}, month: {}, year: {} };
  const artistPP = { week: {}, month: {}, year: {} };
  const albumPP = { week: {}, month: {}, year: {} };
  const pakWeeks = [];

  function buildPeriodRecords(pt, playsMap, keys, size) {
    let prevSong = {}, prevArtist = {}, prevAlbum = {};
    const everSong = new Set(), everArtist = new Set(), everAlbum = new Set();
    for (const pk of keys) {
      const plays = playsMap[pk];
      const sc = {}, ac = {}, lc = {};
      for (const p of plays) {
        const sk = songKey(p);
        if (!sc[sk]) sc[sk] = { count: 0, title: p.title, artist: p.artist, artists_: p.artists, album: p.album, firstAchieved: p.date };
        sc[sk].count++;
        for (const a of p.artists) {
          if (!ac[a]) ac[a] = { count: 0, firstAchieved: p.date };
          ac[a].count++;
        }
        if (p.album && p.album !== '—') {
          const ak = p.album + '|||' + albumArtist(p);
          if (!lc[ak]) lc[ak] = { count: 0, album: p.album, artist: albumArtist(p), firstAchieved: p.date };
          lc[ak].count++;
        }
      }
      for (const [k, d] of Object.entries(sc)) d.chartStatus = prevSong[k] ? 0 : everSong.has(k) ? 1 : 2;
      for (const [k, d] of Object.entries(ac)) d.chartStatus = prevArtist[k] ? 0 : everArtist.has(k) ? 1 : 2;
      for (const [k, d] of Object.entries(lc)) d.chartStatus = prevAlbum[k] ? 0 : everAlbum.has(k) ? 1 : 2;
      const topSongs = Object.entries(sc).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, size);
      const topArtists = Object.entries(ac).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, size);
      const topAlbums = Object.entries(lc).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, size);
      const nPS = {}, nPA = {}, nPL = {};
      topSongs.forEach(([k, d], i) => {
        nPS[k] = i + 1;
        if (!everSong.has(k)) songDebuts[pt][k] = { rank: i + 1, period: pk, title: d.title, artist: d.artist, plays: d.count };
        everSong.add(k);
        if (i === 0) { if (!song1s[pt][k]) song1s[pt][k] = { title: d.title, artist: d.artist, album: d.album, count: 0, firstPeriod: pk, periods: [] }; song1s[pt][k].count++; song1s[pt][k].lastPeriod = pk; song1s[pt][k].periods.push(pk); }
        songApps[pt][k] = (songApps[pt][k] || 0) + 1;
        if (!songPP[pt][k] || d.count > songPP[pt][k].count) songPP[pt][k] = { count: d.count, period: pk, title: d.title, artist: d.artist };
      });
      topArtists.forEach(([a, d], i) => {
        nPA[a] = i + 1;
        if (!everArtist.has(a)) artistDebuts[pt][a] = { rank: i + 1, period: pk, plays: d.count };
        everArtist.add(a);
        if (i === 0) { if (!artist1s[pt][a]) artist1s[pt][a] = { count: 0, firstPeriod: pk, periods: [] }; artist1s[pt][a].count++; artist1s[pt][a].lastPeriod = pk; artist1s[pt][a].periods.push(pk); }
        artistApps[pt][a] = (artistApps[pt][a] || 0) + 1;
        if (!artistPP[pt][a] || d.count > artistPP[pt][a].count) artistPP[pt][a] = { count: d.count, period: pk };
      });
      topAlbums.forEach(([ak, d], i) => {
        nPL[ak] = i + 1;
        if (!everAlbum.has(ak)) albumDebuts[pt][ak] = { rank: i + 1, period: pk, album: d.album, artist: d.artist, plays: d.count };
        everAlbum.add(ak);
        if (i === 0) { if (!album1s[pt][ak]) album1s[pt][ak] = { album: d.album, artist: d.artist, count: 0, firstPeriod: pk, periods: [] }; album1s[pt][ak].count++; album1s[pt][ak].lastPeriod = pk; album1s[pt][ak].periods.push(pk); }
        albumApps[pt][ak] = (albumApps[pt][ak] || 0) + 1;
        if (!albumPP[pt][ak] || d.count > albumPP[pt][ak].count) albumPP[pt][ak] = { count: d.count, period: pk, album: d.album, artist: d.artist };
      });
      prevSong = nPS; prevArtist = nPA; prevAlbum = nPL;
      // Perfect All Kill (weekly only)
      if (pt === 'week' && topSongs[0] && topArtists[0] && topAlbums[0]) {
        const s1k = topSongs[0][0], a1 = topArtists[0][0], l1k = topAlbums[0][0];
        if ((sc[s1k]?.artists_ || []).includes(a1) && lc[l1k]?.artist === a1) {
          pakWeeks.push({ weekKey: pk, artist: a1, song: sc[s1k].title, album: lc[l1k].album });
        }
      }
    }
  }

  buildPeriodRecords('week', weekPlaysMap, weekKeys, wSize);
  buildPeriodRecords('month', monthPlaysMap, monthKeys, mSize);
  buildPeriodRecords('year', yearPlaysMap, yearKeys, ySize);

  // Play count milestones
  const MILESTONES = [100, 250, 500, 1000, 2000, 3000, 5000, 10000];
  const artistMS = {}, songMS = {}, artistFirst = {}, songFirst = {}, artistCP = {}, songCP = {};
  for (const p of chron) {
    for (const a of p.artists) {
      if (!artistFirst[a]) artistFirst[a] = p.date;
      artistCP[a] = (artistCP[a] || 0) + 1;
      if (!artistMS[a]) artistMS[a] = {};
      for (const m of MILESTONES) if (!artistMS[a][m] && artistCP[a] >= m) artistMS[a][m] = { date: p.date, days: Math.round((p.date - artistFirst[a]) / 86400000) };
    }
    const sk = songKey(p);
    if (!songFirst[sk]) songFirst[sk] = p.date;
    songCP[sk] = (songCP[sk] || 0) + 1;
    if (!songMS[sk]) songMS[sk] = {};
    for (const m of MILESTONES) if (!songMS[sk][m] && songCP[sk] >= m) songMS[sk][m] = { date: p.date, days: Math.round((p.date - songFirst[sk]) / 86400000) };
  }

  // Consecutive same-song scrobbles — collect all runs
  const allCSRuns = [];
  if (chron.length > 0) {
    let curCSKey = songKey(chron[0]), curCS = 1;
    for (let i = 1; i < chron.length; i++) {
      const csk = songKey(chron[i]);
      if (csk === curCSKey) { curCS++; }
      else { if (curCS > 1) allCSRuns.push({ key: curCSKey, count: curCS, date: chron[i - 1].date }); curCSKey = csk; curCS = 1; }
    }
    if (curCS > 1) allCSRuns.push({ key: curCSKey, count: curCS, date: chron[chron.length - 1].date });
  }
  allCSRuns.sort(function (a, b) { return b.count - a.count; });

  // Consecutive days played (streaks) per artist/song
  const artistDaySet = {}, songDaySet = {};
  for (const p of chron) {
    const ds = localDateStr(tzDate(p.date));
    for (const a of p.artists) { if (!artistDaySet[a]) artistDaySet[a] = []; artistDaySet[a].push(ds); }
    const sk = songKey(p);
    if (!songDaySet[sk]) songDaySet[sk] = [];
    songDaySet[sk].push(ds);
  }
  function longestStreak(days) {
    const u = [...new Set(days)].sort(); let mx = 1, cur = 1;
    for (let i = 1; i < u.length; i++) { const diff = Math.round((new Date(u[i]) - new Date(u[i - 1])) / 86400000); if (diff === 1) { cur++; if (cur > mx) mx = cur; } else cur = 1; }
    return mx;
  }
  const artistStreaks = {}, songStreaks = {};
  for (const [a, days] of Object.entries(artistDaySet)) if (days.length >= 15) artistStreaks[a] = longestStreak(days);
  for (const [sk, days] of Object.entries(songDaySet)) if (days.length >= 7) songStreaks[sk] = longestStreak(days);

  // Certifications per artist
  const artistCertCounts = {};
  for (const p of allPlays) {
    for (const a of p.artists) {
      if (!artistCertCounts[a]) artistCertCounts[a] = { sg: 0, sp: 0, sd: 0, ag: 0, ap: 0, ad: 0, _s: {}, _l: {} };
      const sk = songKey(p);
      artistCertCounts[a]._s[sk] = (artistCertCounts[a]._s[sk] || 0) + 1;
    }
    if (p.album && p.album !== '—') {
      const ak = p.album + '|||' + albumArtist(p), aa = albumArtist(p);
      if (!artistCertCounts[aa]) artistCertCounts[aa] = { sg: 0, sp: 0, sd: 0, ag: 0, ap: 0, ad: 0, _s: {}, _l: {} };
      artistCertCounts[aa]._l[ak] = (artistCertCounts[aa]._l[ak] || 0) + 1;
    }
  }
  for (const c of Object.values(artistCertCounts)) {
    for (const pl of Object.values(c._s)) { if (pl >= CERT.song.diamond) c.sd++; else if (pl >= CERT.song.plat) c.sp++; else if (pl >= CERT.song.gold) c.sg++; }
    for (const pl of Object.values(c._l)) { if (pl >= CERT.album.diamond) c.ad++; else if (pl >= CERT.album.plat) c.ap++; else if (pl >= CERT.album.gold) c.ag++; }
    delete c._s; delete c._l;
  }

  // ── RENDERING ────────────────────────────────────────────────
  const yTopLabel = isFinite(chartSizeYearly) ? t('rec_yearly_top', { n: chartSizeYearly }) : t('rec_yearly_all');
  document.getElementById('recIntro').innerHTML =
    t('rec_intro_prefix') + ' <strong>' + t('rec_weekly_top', { n: wSize }) + '</strong> &middot; <strong>' + t('rec_monthly_top', { n: mSize }) + '</strong> &middot; <strong>' + yTopLabel + '</strong> &nbsp;|&nbsp; ' +
    t('rec_data_summary', { weeks: weekKeys.length, months: monthKeys.length, years: yearKeys.length });

  function recTable(headers, rows, limit, detailRows, tableId) {
    limit = (limit === undefined || limit === null) ? 25 : limit;
    if (!rows.length) return '<div class="rec-empty">' + t('rec_no_data') + '</div>';
    const sliced = isFinite(limit) ? rows.slice(0, limit) : rows;
    const slicedDetails = detailRows ? (isFinite(limit) ? detailRows.slice(0, limit) : detailRows) : null;
    const colCount = headers.length;
    return '<table class="rec-table"' + (tableId ? ' id="' + tableId + '"' : '') + '><thead><tr>' + headers.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      sliced.map(function (r, i) {
        const rankCls = i === 0 ? 'rec-rank-1' : i === 1 ? 'rec-rank-2' : i === 2 ? 'rec-rank-3' : '';
        if (!slicedDetails || !slicedDetails[i]) return '<tr class="' + rankCls + '">' + r + '</tr>';
        return '<tr class="' + rankCls + '">' + r + '</tr>'
          + '<tr class="rec-run-detail" id="' + slicedDetails[i].id + '"><td colspan="' + colCount + '">' + slicedDetails[i].html + '</td></tr>';
      }).join('') +
      '</tbody></table>';
  }
  const lim = recLimit === 0 ? Infinity : recLimit;

  // ── All #1s ──────────────────────────────────────────────────
  const typeConfig = [
    { pt: 'week', label: t('rec_weekly_label'), size: wSize },
    { pt: 'month', label: t('rec_monthly_label'), size: mSize },
    { pt: 'year', label: t('rec_yearly_label'), size: isFinite(chartSizeYearly) ? chartSizeYearly : '∞' },
  ];
  const entityConfig = [
    {
      key: 'songs', icon: '★', label: t('rec_th_songs'), data: song1s, type: 'song',
      nameRow: function (k, d, i, imgId) { return '<td class="rec-rank">' + (i + 1) + '</td><td class="thumb-cell"><div class="thumb-wrap"><div id="' + imgId + '"><div class="thumb-initials">' + esc(initials(d.title)) + '</div></div><button id="srcbtn-' + imgId + '" class="img-src-btn" data-imgid="' + imgId + '" data-type="song" data-prefkey="' + esc('song:' + d.artist.toLowerCase() + '|||' + d.title.toLowerCase()) + '" data-name="' + esc(d.title) + '" data-artist="' + esc(d.artist) + '" data-album="' + esc(d.album) + '">Deezer</button></div></td><td><div class="rec-name">' + esc(d.title) + '</div><div class="rec-sub">' + esc(d.artist) + '</div></td>'; }
    },
    {
      key: 'artists', icon: '♦', label: t('rec_th_artists'), data: artist1s, type: 'artist',
      nameRow: function (k, d, i, imgId) { return '<td class="rec-rank">' + (i + 1) + '</td><td class="thumb-cell"><div class="thumb-wrap"><div id="' + imgId + '"><div class="thumb-initials">' + esc(initials(k)) + '</div></div><button id="srcbtn-' + imgId + '" class="img-src-btn" data-imgid="' + imgId + '" data-type="artist" data-prefkey="' + esc('artist:' + k.toLowerCase()) + '" data-name="' + esc(k) + '" data-artist="' + esc(k) + '" data-album="">Deezer</button></div></td><td><div class="rec-name">' + esc(k) + '</div></td>'; }
    },
    {
      key: 'albums', icon: '◈', label: t('rec_th_albums'), data: album1s, type: 'album',
      nameRow: function (k, d, i, imgId) { return '<td class="rec-rank">' + (i + 1) + '</td><td class="thumb-cell"><div class="thumb-wrap"><div id="' + imgId + '"><div class="thumb-initials">' + esc(initials(d.album)) + '</div></div><button id="srcbtn-' + imgId + '" class="img-src-btn" data-imgid="' + imgId + '" data-type="album" data-prefkey="' + esc('album:' + d.artist.toLowerCase() + '|||' + d.album.toLowerCase()) + '" data-name="' + esc(d.album) + '" data-artist="' + esc(d.artist) + '" data-album="' + esc(d.album) + '">Deezer</button></div></td><td><div class="rec-name">' + esc(d.album) + '</div><div class="rec-sub">' + esc(d.artist) + '</div></td>'; }
    },
  ];
  let h = '';
  for (const ent of entityConfig) {
    h += '<div class="rec-section"><div class="rec-section-title">' + ent.icon + ' ' + ent.label + ' &mdash; ' + t('rec_most_times_1') + '</div>';
    for (const cfg of typeConfig) {
      const entries = Object.entries(ent.data[cfg.pt]).sort(function (a, b) { return b[1].count - a[1].count; });
      const subsectionId = 'rec-subsection-' + ent.key + '-' + cfg.pt;
      h += '<div class="rec-section-sub-wrapper" id="' + subsectionId + '-wrapper">';
      h += '<div class="rec-section-sub-header">';
      h += '<button class="rec-subsection-collapse-btn" data-subsection-id="' + subsectionId + '" title="Collapse">−</button>';
      h += '<div class="rec-section-sub">' + cfg.label + ' &mdash; ' + t('rec_have_hit_1', { n: '<strong>' + entries.length + '</strong>', type: ent.label.toLowerCase() }) + '</div>';
      h += '</div>';
      h += '<div class="rec-subsection-content" id="' + subsectionId + '">';
      const tableId = 'rec-1s-tbl-' + ent.key + '-' + cfg.pt;
      const runBaseId = 'rec-1s-run-' + ent.key + '-' + cfg.pt;
      const headers = ['#', '', ent.label, periodAtOneHeader(cfg.pt), t('rec_th_first_at_1')];
      if (cfg.pt !== 'year') headers.push(t('rec_th_date_at_peak'));
      headers.push('<button class="rec-expand-all-btn" onclick="event.stopPropagation();toggleAllRecRuns(\'' + tableId + '\',this)" title="' + t('rec_expand_all') + '">▸▸</button>');
      h += recTable(headers,
        entries.map(function (e, i) {
          const imgId = 'rec-img-' + ent.key + '-' + cfg.pt + '-' + i;
          const runId = runBaseId + '-' + i;
          let row = ent.nameRow(e[0], e[1], i, imgId) + '<td class="rec-count">' + e[1].count + '</td><td class="rec-meta">' + fmtPeriodKey(e[1].firstPeriod, cfg.pt) + '</td>';
          if (cfg.pt !== 'year') {
            row += '<td class="rec-meta"><a href="javascript:void(0)" class="rec-date-link" onclick="navigateToRecPeriod(\'' + cfg.pt + '\',\'' + e[1].lastPeriod + '\')">' + fmtPeriodKey(e[1].lastPeriod, cfg.pt) + '</a></td>';
          }
          row += '<td class="rec-run-toggle-cell"><button class="rec-run-toggle-btn" onclick="event.stopPropagation();toggleRecRun(this,\'' + runId + '\')">▸</button></td>';
          return row;
        }),
        lim,
        entries.map(function (e, i) {
          return { id: runBaseId + '-' + i, html: rec1sBoxesHTML(e[1].periods, cfg.pt) };
        }),
        tableId
      );
      h += '</div>';
      // Collect image items for loading
      const imgItems = entries.map(function (e, i) {
        const imgId = 'rec-img-' + ent.key + '-' + cfg.pt + '-' + i;
        if (ent.type === 'song') {
          return { imgId, title: e[1].title, artist: e[1].artist, album: e[1].album, prefKey: 'song:' + e[1].artist.toLowerCase() + '|||' + e[1].title.toLowerCase(), name: e[1].title };
        } else if (ent.type === 'artist') {
          return { imgId, name: e[0], prefKey: 'artist:' + e[0].toLowerCase() };
        } else {
          return { imgId, album: e[1].album, artist: e[1].artist, name: e[1].album, prefKey: 'album:' + e[1].artist.toLowerCase() + '|||' + e[1].album.toLowerCase() };
        }
      });
      // Load images asynchronously after rendering
      (async function () {
        await loadImages(imgItems, ent.type);
      })();
      h += '</div>';
      h += '</div>';
    }
    h += '</div>';
  }
  document.getElementById('recAllOnesBody').innerHTML = h;

  // ── Perfect All Kill ─────────────────────────────────────────
  if (!pakWeeks.length) {
    document.getElementById('recPAKBody').innerHTML = '<div class="rec-empty">' + t('rec_no_pak', { n: wSize }) + '</div>';
  } else {
    const byArtist = {};
    for (const pw of pakWeeks) { (byArtist[pw.artist] || (byArtist[pw.artist] = [])).push(pw); }
    const sortedPAK = Object.entries(byArtist).sort(function (a, b) { return b[1].length - a[1].length; });
    let ph = '<div class="rec-section-sub">' + t('rec_pak_summary', { weeks: pakWeeks.length, weekword: tUnit('weeks', pakWeeks.length), weekwordfull: tUnit('weeks_full', pakWeeks.length), n: sortedPAK.length, artistword: tUnit('artists', sortedPAK.length) }) + '</div>';
    const limEntries = isFinite(lim) ? sortedPAK.slice(0, lim) : sortedPAK;
    ph += '<table class="rec-table pak-artist-table"><thead><tr>'
      + '<th></th><th>' + t('rec_th_artist') + '</th>'
      + '<th class="pak-weeks-th">' + t('rec_th_pak_weeks') + '</th>'
      + '<th>' + t('rec_th_first_song') + '</th>'
      + '<th>' + t('rec_th_first_album') + '</th>'
      + '<th>' + t('rec_th_most_recent') + '</th>'
      + '</tr></thead><tbody>';
    for (let i = 0; i < limEntries.length; i++) {
      const [artist, weeks] = limEntries[i];
      const firstWeek = weeks[0];
      const lastWeek = weeks[weeks.length - 1];
      const safeKey = artist.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-' + i;
      const artistImgId = 'pak-tbl-aimg-' + safeKey;
      const expandId = 'pak-expand-' + safeKey;
      const rankCls = i === 0 ? ' rec-rank-1' : i === 1 ? ' rec-rank-2' : i === 2 ? ' rec-rank-3' : '';
      ph += '<tr class="pak-artist-row' + rankCls + '" onclick="togglePakArtistExpand(\'' + expandId + '\',this)">'
        + '<td class="rec-rank">' + (i + 1) + '</td>'
        + '<td><div class="pak-artist-cell"><div class="pak-mini-thumb pak-mini-thumb-round" id="' + artistImgId + '"><div class="pak-mini-initials">' + esc(initials(artist)) + '</div></div><div class="rec-name">' + esc(artist) + '</div></div></td>'
        + '<td class="rec-count">' + weeks.length + '</td>'
        + '<td class="rec-meta pak-tbl-song"><span class="pak-col-icon">🎵</span>' + esc(firstWeek.song) + '</td>'
        + '<td class="rec-meta pak-tbl-album"><span class="pak-col-icon">💿</span>' + esc(firstWeek.album) + '</td>'
        + '<td class="rec-meta pak-tbl-last-cell"><a class="pak-date pak-date-link" href="javascript:void(0)" onclick="event.stopPropagation();showPakWeekPreview(\'' + lastWeek.weekKey + '\',this)">' + fmtPeriodKey(lastWeek.weekKey, 'week') + '</a><span class="pak-expand-icon">▼</span></td>'
        + '</tr>';
      ph += '<tr class="pak-expand-row" id="' + expandId + '" style="display:none"><td colspan="6"><div class="pak-expand-list">';
      for (let j = 0; j < weeks.length; j++) {
        const pw = weeks[j];
        const albumImgId = 'pak-exp-img-' + safeKey + '-' + j;
        ph += '<div class="pak-expand-item" data-pak-album-img="' + albumImgId + '" data-album="' + esc(pw.album) + '" data-artist="' + esc(artist) + '">'
          + '<div class="pak-mini-thumb" id="' + albumImgId + '"><div class="pak-mini-initials">' + esc(initials(pw.album)) + '</div></div>'
          + '<span class="pak-expand-album">💿 ' + esc(pw.album) + '</span>'
          + '<span class="pak-expand-song"><span class="pak-col-icon">🎵</span>' + esc(pw.song) + '</span>'
          + '<a class="pak-date pak-date-link" href="javascript:void(0)" onclick="showPakWeekPreview(\'' + pw.weekKey + '\',this)">' + fmtPeriodKey(pw.weekKey, 'week') + '</a>'
          + '<a class="pak-expand-link" href="javascript:void(0)" onclick="navigateToRecPeriod(\'week\',\'' + pw.weekKey + '\')">' + t('rec_pak_week_preview_link') + '</a>'
          + '</div>';
      }
      ph += '</div></td></tr>';
    }
    ph += '</tbody></table>';
    ph += '<br><div class="rec-section-title" style="margin-top:0.75rem;">' + t('rec_pak_all_title') + '</div><div class="pak-list">';
    const pakGlobalIdx = {};
    const pakArtistOcc = {};
    const _artOccTmp = {};
    for (let k = 0; k < pakWeeks.length; k++) {
      const wk = pakWeeks[k];
      pakGlobalIdx[wk.weekKey] = k + 1;
      _artOccTmp[wk.artist] = (_artOccTmp[wk.artist] || 0) + 1;
      pakArtistOcc[wk.weekKey] = _artOccTmp[wk.artist];
    }
    const pakSlice = isFinite(lim) ? [...pakWeeks].reverse().slice(0, lim) : [...pakWeeks].reverse();
    for (let idx = 0; idx < pakSlice.length; idx++) {
      const pw = pakSlice[idx];
      const pakImgId = 'pak-img-' + pw.weekKey.replace(/[^a-z0-9]/gi, '-') + '-' + idx;
      const pakArtistImgId = 'pak-aimg-' + pw.weekKey.replace(/[^a-z0-9]/gi, '-') + '-' + idx;
      ph += '<div class="pak-item">'
        + '<a class="pak-date pak-date-link" href="javascript:void(0)" onclick="showPakWeekPreview(\'' + pw.weekKey + '\',this)">' + fmtPeriodKey(pw.weekKey, 'week') + '</a>'
        + '<div class="pak-col pak-col-artist"><div class="pak-mini-thumb pak-mini-thumb-round" id="' + pakArtistImgId + '"><div class="pak-mini-initials">' + esc(initials(pw.artist)) + '</div></div><span class="pak-col-text">' + esc(pw.artist) + '</span></div>'
        + '<div class="pak-col pak-col-song"><span class="pak-col-icon">🎵</span>' + esc(pw.song) + '</div>'
        + '<div class="pak-col pak-col-album"><div class="pak-mini-thumb" id="' + pakImgId + '"><div class="pak-mini-initials">' + esc(initials(pw.album)) + '</div></div><span class="pak-col-text">' + esc(pw.album) + '</span></div>'
        + '<div class="pak-badge-stack">'
        + '<span class="rec-badge rec-badge-gold">#' + pakGlobalIdx[pw.weekKey] + ' / ' + pakWeeks.length + '</span>'
        + '<span class="rec-badge rec-badge-artist-pak">' + t('rec_pak_badge_artist') + ' #' + pakArtistOcc[pw.weekKey] + '</span>'
        + '</div>'
        + '</div>';
    }
    ph += '</div>';
    document.getElementById('recPAKBody').innerHTML = ph;
    // Load artist images for table rows and flat list asynchronously
    (async () => {
      for (let i = 0; i < limEntries.length; i++) {
        const [artist] = limEntries[i];
        const safeKey = artist.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-' + i;
        try {
          const artistEl = document.getElementById('pak-tbl-aimg-' + safeKey);
          if (artistEl) {
            const url = await getArtistImage(artist);
            if (url) {
              artistEl.innerHTML = `<img class="pak-mini-img" src="${esc(url)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="pak-mini-initials" style="display:none">${esc(initials(artist))}</div>`;
              await new Promise(r => setTimeout(r, 60));
            }
          }
        } catch (e) { }
      }
      for (let i = 0; i < pakSlice.length; i++) {
        const pw = pakSlice[i];
        const albumImgId = 'pak-img-' + pw.weekKey.replace(/[^a-z0-9]/gi, '-') + '-' + i;
        const artistImgId = 'pak-aimg-' + pw.weekKey.replace(/[^a-z0-9]/gi, '-') + '-' + i;
        try {
          const albumEl = document.getElementById(albumImgId);
          if (albumEl) {
            const url = await getAlbumImage(pw.album, pw.artist);
            if (url) {
              albumEl.innerHTML = `<img class="pak-mini-img" src="${esc(url)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="pak-mini-initials" style="display:none">${esc(initials(pw.album))}</div>`;
              await new Promise(r => setTimeout(r, 60));
            }
          }
          const artistEl = document.getElementById(artistImgId);
          if (artistEl) {
            const url = await getArtistImage(pw.artist);
            if (url) {
              artistEl.innerHTML = `<img class="pak-mini-img" src="${esc(url)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="pak-mini-initials" style="display:none">${esc(initials(pw.artist))}</div>`;
              await new Promise(r => setTimeout(r, 60));
            }
          }
        } catch (e) { }
      }
    })();
  }

  // ── Most Chart Appearances ────────────────────────────────────
  ensureAllChartRun();
  let ah = '';
  const appImgQueue = [];

  // ── Songs appearances ──
  {
    const tops = Object.entries(songApps.week).sort((a, b) => b[1] - a[1]);
    const sliced = isFinite(lim) ? tops.slice(0, lim) : tops;
    ah += '<div class="rec-section"><div class="rec-section-title">★ ' + t('rec_th_songs') + ' &mdash; ' + t('rec_most_appearances') + '</div>';
    ah += '<div class="app-table-wrap"><table class="rec-table app-appearances-table" id="app-tbl-songs"><thead><tr>';
    ah += '<th>#</th><th></th><th>' + t('rec_th_songs') + '</th><th class="app-art-th"></th><th>' + t('rec_th_artist') + '</th>';
    ah += '<th>' + t('rec_th_first_streamed') + '</th><th>' + t('rec_th_last_streamed') + '</th>';
    ah += '<th>' + t('rec_th_weeks_on_chart') + '</th><th class="rec-cr-th"><button class="rec-expand-all-btn" onclick="event.stopPropagation();toggleAllAppCr(\'app-tbl-songs\',this)" title="' + t('rec_expand_all') + '">▶▶</button></th>';
    ah += '</tr></thead><tbody>';
    for (let i = 0; i < sliced.length; i++) {
      const [k, count] = sliced[i];
      const n = songNames[k] || {};
      const title = n.title || k.split('|||')[0];
      const artist = n.artist || '';
      const album = n.album || '';
      const imgId = 'app-song-img-' + i;
      const artImgId = 'app-art-song-' + i;
      const crRowId = 'app-cr-row-song-' + i;
      const firstDate = songFirstPlay[k] ? fmt(songFirstPlay[k]) : '—';
      const lastDate = songLastPlay[k] ? fmt(songLastPlay[k]) : '—';
      const rankCls = i === 0 ? 'rec-rank-1' : i === 1 ? 'rec-rank-2' : i === 2 ? 'rec-rank-3' : '';
      const weekWord = count === 1 ? t('rec_app_week_one') : t('rec_app_week_other');
      ah += '<tr class="' + rankCls + '">';
      ah += '<td class="rec-rank">' + (i + 1) + '</td>';
      ah += '<td class="thumb-cell"><div class="thumb-wrap"><div id="' + imgId + '"><div class="thumb-initials">' + esc(initials(title)) + '</div></div>';
      ah += '<button id="srcbtn-' + imgId + '" class="img-src-btn" data-imgid="' + imgId + '" data-type="song" data-prefkey="' + esc('song:' + artist.toLowerCase() + '|||' + title.toLowerCase()) + '" data-name="' + esc(title) + '" data-artist="' + esc(artist) + '" data-album="' + esc(album) + '">Deezer</button></div></td>';
      ah += '<td><div class="rec-name">' + esc(title) + '</div></td>';
      ah += '<td class="thumb-cell"><div class="thumb-wrap"><div id="' + artImgId + '" class="app-art-circle"><div class="thumb-initials">' + esc(initials(artist)) + '</div></div>';
      ah += '<button id="srcbtn-' + artImgId + '" class="img-src-btn" data-imgid="' + artImgId + '" data-type="artist" data-prefkey="' + esc('artist:' + artist.toLowerCase()) + '" data-name="' + esc(artist) + '" data-artist="' + esc(artist) + '" data-album="">Deezer</button></div></td>';
      ah += '<td><div class="rec-name">' + esc(artist) + '</div></td>';
      ah += '<td class="rec-meta">' + esc(firstDate) + '</td>';
      ah += '<td class="rec-meta">' + esc(lastDate) + '</td>';
      ah += '<td class="rec-count">' + count + ' ' + weekWord + '</td>';
      ah += '<td class="rec-cr-btn-cell"><button class="rec-cr-toggle" onclick="toggleAppCr(\'' + crRowId + '\',this)" title="' + t('cr_chart_run') + '">▶</button></td>';
      ah += '</tr>';
      ah += '<tr class="app-cr-row" id="' + crRowId + '" style="display:none"><td colspan="9"><div class="app-cr-content">' + crBoxesHTML('songs', k, allChartRun.week) + '</div></td></tr>';
      appImgQueue.push({ imgId, imgType: 'song', name: title, prefKey: 'song:' + artist.toLowerCase() + '|||' + title.toLowerCase(), title, artist, album });
      appImgQueue.push({ imgId: artImgId, imgType: 'artist', name: artist, prefKey: 'artist:' + artist.toLowerCase() });
    }
    ah += '</tbody></table></div></div>';
  }

  // ── Artists appearances ──
  {
    const tops = Object.entries(artistApps.week).sort((a, b) => b[1] - a[1]);
    const sliced = isFinite(lim) ? tops.slice(0, lim) : tops;
    ah += '<div class="rec-section"><div class="rec-section-title">♦ ' + t('rec_th_artists') + ' &mdash; ' + t('rec_most_appearances') + '</div>';
    ah += '<div class="app-table-wrap"><table class="rec-table app-appearances-table" id="app-tbl-artists"><thead><tr>';
    ah += '<th>#</th><th></th><th>' + t('rec_th_artist') + '</th>';
    ah += '<th>' + t('rec_th_first_song') + '</th><th>' + t('rec_th_last_song') + '</th>';
    ah += '<th>' + t('rec_th_first_charted') + '</th>';
    ah += '<th>' + t('rec_th_weeks_on_chart') + '</th><th class="rec-cr-th"><button class="rec-expand-all-btn" onclick="event.stopPropagation();toggleAllAppCr(\'app-tbl-artists\',this)" title="' + t('rec_expand_all') + '">▶▶</button></th>';
    ah += '</tr></thead><tbody>';
    for (let i = 0; i < sliced.length; i++) {
      const [a, count] = sliced[i];
      const imgId = 'app-artist-img-' + i;
      const crRowId = 'app-cr-row-artist-' + i;
      const firstSong = artistFirstSongName[a] || '—';
      const lastSong = artistLastSongName[a] || '—';
      const firstCharted = artistDebuts.week[a] ? fmtPeriodKey(artistDebuts.week[a].period, 'week') : '—';
      const rankCls = i === 0 ? 'rec-rank-1' : i === 1 ? 'rec-rank-2' : i === 2 ? 'rec-rank-3' : '';
      const weekWord = count === 1 ? t('rec_app_week_one') : t('rec_app_week_other');
      ah += '<tr class="' + rankCls + '">';
      ah += '<td class="rec-rank">' + (i + 1) + '</td>';
      ah += '<td class="thumb-cell"><div class="thumb-wrap"><div id="' + imgId + '" class="app-art-circle"><div class="thumb-initials">' + esc(initials(a)) + '</div></div>';
      ah += '<button id="srcbtn-' + imgId + '" class="img-src-btn" data-imgid="' + imgId + '" data-type="artist" data-prefkey="' + esc('artist:' + a.toLowerCase()) + '" data-name="' + esc(a) + '" data-artist="' + esc(a) + '" data-album="">Deezer</button></div></td>';
      ah += '<td><div class="rec-name">' + esc(a) + '</div></td>';
      ah += '<td class="rec-meta app-song-cell"><span class="app-song-icon">🎵</span>' + esc(firstSong) + '</td>';
      ah += '<td class="rec-meta app-song-cell"><span class="app-song-icon">🎵</span>' + esc(lastSong) + '</td>';
      ah += '<td class="rec-meta">' + esc(firstCharted) + '</td>';
      ah += '<td class="rec-count">' + count + ' ' + weekWord + '</td>';
      ah += '<td class="rec-cr-btn-cell"><button class="rec-cr-toggle" onclick="toggleAppCr(\'' + crRowId + '\',this)" title="' + t('cr_chart_run') + '">▶</button></td>';
      ah += '</tr>';
      ah += '<tr class="app-cr-row" id="' + crRowId + '" style="display:none"><td colspan="8"><div class="app-cr-content">' + crBoxesHTML('artists', a, allChartRun.week) + '</div></td></tr>';
      appImgQueue.push({ imgId, imgType: 'artist', name: a, prefKey: 'artist:' + a.toLowerCase() });
    }
    ah += '</tbody></table></div></div>';
  }

  // ── Albums appearances ──
  {
    const tops = Object.entries(albumApps.week).sort((a, b) => b[1] - a[1]);
    const sliced = isFinite(lim) ? tops.slice(0, lim) : tops;
    ah += '<div class="rec-section"><div class="rec-section-title">◈ ' + t('rec_th_albums') + ' &mdash; ' + t('rec_most_appearances') + '</div>';
    ah += '<div class="app-table-wrap"><table class="rec-table app-appearances-table" id="app-tbl-albums"><thead><tr>';
    ah += '<th>#</th><th></th><th>' + t('rec_th_albums') + '</th><th class="app-art-th"></th><th>' + t('rec_th_artist') + '</th>';
    ah += '<th>' + t('rec_th_first_song') + '</th>';
    ah += '<th>' + t('rec_th_first_streamed') + '</th>';
    ah += '<th>' + t('rec_th_weeks_on_chart') + '</th><th class="rec-cr-th"><button class="rec-expand-all-btn" onclick="event.stopPropagation();toggleAllAppCr(\'app-tbl-albums\',this)" title="' + t('rec_expand_all') + '">▶▶</button></th>';
    ah += '</tr></thead><tbody>';
    for (let i = 0; i < sliced.length; i++) {
      const [k, count] = sliced[i];
      const n = albumNames[k] || {};
      const album = n.album || k.split('|||')[0];
      const artist = n.artist || '';
      const imgId = 'app-album-img-' + i;
      const artImgId = 'app-art-album-' + i;
      const crRowId = 'app-cr-row-album-' + i;
      const firstSong = albumFirstSongName[k] || '—';
      const firstDate = albumFirstPlayDate[k] ? fmt(albumFirstPlayDate[k]) : '—';
      const rankCls = i === 0 ? 'rec-rank-1' : i === 1 ? 'rec-rank-2' : i === 2 ? 'rec-rank-3' : '';
      const weekWord = count === 1 ? t('rec_app_week_one') : t('rec_app_week_other');
      ah += '<tr class="' + rankCls + '">';
      ah += '<td class="rec-rank">' + (i + 1) + '</td>';
      ah += '<td class="thumb-cell"><div class="thumb-wrap"><div id="' + imgId + '"><div class="thumb-initials">' + esc(initials(album)) + '</div></div>';
      ah += '<button id="srcbtn-' + imgId + '" class="img-src-btn" data-imgid="' + imgId + '" data-type="album" data-prefkey="' + esc('album:' + artist.toLowerCase() + '|||' + album.toLowerCase()) + '" data-name="' + esc(album) + '" data-artist="' + esc(artist) + '" data-album="' + esc(album) + '">Deezer</button></div></td>';
      ah += '<td><div class="rec-name">' + esc(album) + '</div></td>';
      ah += '<td class="thumb-cell"><div class="thumb-wrap"><div id="' + artImgId + '" class="app-art-circle"><div class="thumb-initials">' + esc(initials(artist)) + '</div></div>';
      ah += '<button id="srcbtn-' + artImgId + '" class="img-src-btn" data-imgid="' + artImgId + '" data-type="artist" data-prefkey="' + esc('artist:' + artist.toLowerCase()) + '" data-name="' + esc(artist) + '" data-artist="' + esc(artist) + '" data-album="">Deezer</button></div></td>';
      ah += '<td><div class="rec-name">' + esc(artist) + '</div></td>';
      ah += '<td class="rec-meta app-song-cell"><span class="app-song-icon">🎵</span>' + esc(firstSong) + '</td>';
      ah += '<td class="rec-meta">' + esc(firstDate) + '</td>';
      ah += '<td class="rec-count">' + count + ' ' + weekWord + '</td>';
      ah += '<td class="rec-cr-btn-cell"><button class="rec-cr-toggle" onclick="toggleAppCr(\'' + crRowId + '\',this)" title="' + t('cr_chart_run') + '">▶</button></td>';
      ah += '</tr>';
      ah += '<tr class="app-cr-row" id="' + crRowId + '" style="display:none"><td colspan="9"><div class="app-cr-content">' + crBoxesHTML('albums', k, allChartRun.week) + '</div></td></tr>';
      appImgQueue.push({ imgId, imgType: 'album', name: album, prefKey: 'album:' + artist.toLowerCase() + '|||' + album.toLowerCase(), album, artist });
      appImgQueue.push({ imgId: artImgId, imgType: 'artist', name: artist, prefKey: 'artist:' + artist.toLowerCase() });
    }
    ah += '</tbody></table></div></div>';
  }

  document.getElementById('recAppearancesBody').innerHTML = ah;
  (async () => {
    await loadImages(appImgQueue.filter(x => x.imgType === 'song'), 'song');
    await loadImages(appImgQueue.filter(x => x.imgType === 'artist'), 'artist');
    await loadImages(appImgQueue.filter(x => x.imgType === 'album'), 'album');
  })();

  // ── Biggest Debuts ───────────────────────────────────────────
  const debImgQueue = [];
  let dh = '';

  // ── Songs Debuts ──
  {
    const debs = Object.entries(songDebuts.week).sort(function (a, b) {
      return b[1].plays - a[1].plays || a[1].rank - b[1].rank || a[1].period.localeCompare(b[1].period);
    });
    const sliced = isFinite(lim) ? debs.slice(0, lim) : debs;
    dh += '<div class="rec-section"><div class="rec-section-title">★ ' + t('rec_th_songs') + ' &mdash; ' + t('rec_biggest_debuts_weekly') + '</div>';
    if (!sliced.length) {
      dh += '<div class="rec-empty">' + t('rec_no_data') + '</div>';
    } else {
      dh += '<div class="app-table-wrap"><table class="rec-table debut-rich-table"><thead><tr>';
      dh += '<th>#</th><th>' + t('rec_th_songs') + '</th><th class="debut-mini-art-th"></th><th>' + t('rec_th_artist') + '</th>';
      dh += '<th>' + t('rec_th_plays') + '</th><th>' + t('rec_th_debut_rank') + '</th><th>' + t('rec_th_week') + '</th>';
      dh += '</tr></thead><tbody>';
      sliced.forEach(function (e, i) {
        const k = e[0], d = e[1];
        const rankCls = i === 0 ? 'rec-rank-1' : i === 1 ? 'rec-rank-2' : i === 2 ? 'rec-rank-3' : '';
        const artImgId = 'deb-song-art-' + i;
        const artPrefKey = 'artist:' + d.artist.toLowerCase();
        dh += '<tr class="' + rankCls + '">';
        dh += '<td class="rec-rank">' + (i + 1) + '</td>';
        dh += '<td><span class="pak-col-icon">🎵</span><span class="rec-name">' + esc(d.title) + '</span></td>';
        dh += '<td><div class="pak-mini-thumb pak-mini-thumb-round" id="' + artImgId + '"><div class="pak-mini-initials">' + esc(initials(d.artist)) + '</div></div></td>';
        dh += '<td><div class="rec-name">' + esc(d.artist) + '</div></td>';
        dh += '<td class="rec-count">' + (d.plays || 0) + '</td>';
        dh += '<td class="rec-count">#' + d.rank + '</td>';
        dh += '<td class="rec-meta"><a class="debut-week-link" href="javascript:void(0)" onclick="showDebutWeekPreview(\'' + esc(d.period) + '\',this,event)">' + fmtPeriodKey(d.period, 'week') + '</a></td>';
        dh += '</tr>';
        debImgQueue.push({ imgId: artImgId, imgType: 'artist', name: d.artist, prefKey: artPrefKey });
      });
      dh += '</tbody></table></div>';
    }
    dh += '</div>';
  }

  // ── Artists Debuts ──
  {
    const debs = Object.entries(artistDebuts.week).sort(function (a, b) {
      return b[1].plays - a[1].plays || a[1].rank - b[1].rank || a[1].period.localeCompare(b[1].period);
    });
    const sliced = isFinite(lim) ? debs.slice(0, lim) : debs;
    dh += '<div class="rec-section"><div class="rec-section-title">♦ ' + t('rec_th_artists') + ' &mdash; ' + t('rec_biggest_debuts_weekly') + '</div>';
    if (!sliced.length) {
      dh += '<div class="rec-empty">' + t('rec_no_data') + '</div>';
    } else {
      dh += '<div class="app-table-wrap"><table class="rec-table debut-rich-table"><thead><tr>';
      dh += '<th>#</th><th class="debut-mini-art-th"></th><th>' + t('rec_th_artist') + '</th>';
      dh += '<th>' + t('rec_th_first_song') + '</th>';
      dh += '<th class="debut-mini-art-th"></th><th>' + t('rec_th_first_album') + '</th>';
      dh += '<th>' + t('rec_th_plays') + '</th><th>' + t('rec_th_debut_rank') + '</th><th>' + t('rec_th_week') + '</th>';
      dh += '</tr></thead><tbody>';
      sliced.forEach(function (e, i) {
        const a = e[0], d = e[1];
        const rankCls = i === 0 ? 'rec-rank-1' : i === 1 ? 'rec-rank-2' : i === 2 ? 'rec-rank-3' : '';
        const artImgId = 'deb-art-img-' + i;
        const artPrefKey = 'artist:' + a.toLowerCase();
        const fSong = artistFirstSongName[a] || '';
        const fAlbObj = artistFirstAlbum[a] || null;
        const fSongImgId = 'deb-art-fsong-' + i;
        const fAlbImgId = 'deb-art-falb-' + i;
        const fSongPrefKey = fSong ? 'song:' + a.toLowerCase() + '|||' + fSong.toLowerCase() : '';
        const fAlbPrefKey = fAlbObj ? 'album:' + fAlbObj.artist.toLowerCase() + '|||' + fAlbObj.album.toLowerCase() : '';
        dh += '<tr class="' + rankCls + '">';
        dh += '<td class="rec-rank">' + (i + 1) + '</td>';
        dh += '<td><div class="pak-mini-thumb pak-mini-thumb-round" id="' + artImgId + '"><div class="pak-mini-initials">' + esc(initials(a)) + '</div></div></td>';
        dh += '<td><div class="rec-name">' + esc(a) + '</div></td>';
        if (fSong) {
          dh += '<td><span class="pak-col-icon">🎵</span><span class="rec-name debut-first-label">' + esc(fSong) + '</span></td>';
        } else {
          dh += '<td class="rec-meta">—</td>';
        }
        if (fAlbObj) {
          dh += '<td><div class="pak-mini-thumb" id="' + fAlbImgId + '"><div class="pak-mini-initials">' + esc(initials(fAlbObj.album)) + '</div></div></td>';
          dh += '<td><div class="rec-name debut-first-label">' + esc(fAlbObj.album) + '</div></td>';
          debImgQueue.push({ imgId: fAlbImgId, imgType: 'album', name: fAlbObj.album, album: fAlbObj.album, artist: fAlbObj.artist, prefKey: fAlbPrefKey });
        } else {
          dh += '<td></td><td class="rec-meta">—</td>';
        }
        dh += '<td class="rec-count">' + (d.plays || 0) + '</td>';
        dh += '<td class="rec-count">#' + d.rank + '</td>';
        dh += '<td class="rec-meta"><a class="debut-week-link" href="javascript:void(0)" onclick="showDebutWeekPreview(\'' + esc(d.period) + '\',this,event)">' + fmtPeriodKey(d.period, 'week') + '</a></td>';
        dh += '</tr>';
        debImgQueue.push({ imgId: artImgId, imgType: 'artist', name: a, prefKey: artPrefKey });
      });
      dh += '</tbody></table></div>';
    }
    dh += '</div>';
  }

  // ── Albums Debuts ──
  {
    const debs = Object.entries(albumDebuts.week).sort(function (a, b) {
      return b[1].plays - a[1].plays || a[1].rank - b[1].rank || a[1].period.localeCompare(b[1].period);
    });
    const sliced = isFinite(lim) ? debs.slice(0, lim) : debs;
    dh += '<div class="rec-section"><div class="rec-section-title">◈ ' + t('rec_th_albums') + ' &mdash; ' + t('rec_biggest_debuts_weekly') + '</div>';
    if (!sliced.length) {
      dh += '<div class="rec-empty">' + t('rec_no_data') + '</div>';
    } else {
      dh += '<div class="app-table-wrap"><table class="rec-table debut-rich-table"><thead><tr>';
      dh += '<th>#</th><th class="debut-mini-art-th"></th><th>' + t('rec_th_albums') + '</th><th class="debut-mini-art-th"></th><th>' + t('rec_th_artist') + '</th>';
      dh += '<th>' + t('rec_th_plays') + '</th><th>' + t('rec_th_debut_rank') + '</th><th>' + t('rec_th_week') + '</th>';
      dh += '</tr></thead><tbody>';
      sliced.forEach(function (e, i) {
        const k = e[0], d = e[1];
        const rankCls = i === 0 ? 'rec-rank-1' : i === 1 ? 'rec-rank-2' : i === 2 ? 'rec-rank-3' : '';
        const albImgId = 'deb-alb-img-' + i;
        const artImgId = 'deb-alb-art-' + i;
        const albPrefKey = 'album:' + d.artist.toLowerCase() + '|||' + d.album.toLowerCase();
        const artPrefKey = 'artist:' + d.artist.toLowerCase();
        dh += '<tr class="' + rankCls + '">';
        dh += '<td class="rec-rank">' + (i + 1) + '</td>';
        dh += '<td><div class="pak-mini-thumb" id="' + albImgId + '"><div class="pak-mini-initials">' + esc(initials(d.album)) + '</div></div></td>';
        dh += '<td><div class="rec-name">' + esc(d.album) + '</div></td>';
        dh += '<td><div class="pak-mini-thumb pak-mini-thumb-round" id="' + artImgId + '"><div class="pak-mini-initials">' + esc(initials(d.artist)) + '</div></div></td>';
        dh += '<td><div class="rec-name">' + esc(d.artist) + '</div></td>';
        dh += '<td class="rec-count">' + (d.plays || 0) + '</td>';
        dh += '<td class="rec-count">#' + d.rank + '</td>';
        dh += '<td class="rec-meta"><a class="debut-week-link" href="javascript:void(0)" onclick="showDebutWeekPreview(\'' + esc(d.period) + '\',this,event)">' + fmtPeriodKey(d.period, 'week') + '</a></td>';
        dh += '</tr>';
        debImgQueue.push({ imgId: albImgId, imgType: 'album', name: d.album, album: d.album, artist: d.artist, prefKey: albPrefKey });
        debImgQueue.push({ imgId: artImgId, imgType: 'artist', name: d.artist, prefKey: artPrefKey });
      });
      dh += '</tbody></table></div>';
    }
    dh += '</div>';
  }

  document.getElementById('recDebutsBody').innerHTML = dh;
  (async () => {
    await loadImages(debImgQueue.filter(function (x) { return x.imgType === 'song'; }), 'song');
    await loadImages(debImgQueue.filter(function (x) { return x.imgType === 'artist'; }), 'artist');
    await loadImages(debImgQueue.filter(function (x) { return x.imgType === 'album'; }), 'album');
  })();

  // ── Most Plays in a Period ────────────────────────────────────
  const ptCfg = [
    { pt: 'week', unitLabel: t('rec_th_week'), sPP: songPP.week, aPP: artistPP.week, lPP: albumPP.week },
    { pt: 'month', unitLabel: t('rec_th_month'), sPP: songPP.month, aPP: artistPP.month, lPP: albumPP.month },
    { pt: 'year', unitLabel: t('rec_th_year'), sPP: songPP.year, aPP: artistPP.year, lPP: albumPP.year },
  ];
  let ppH = '';
  for (const cfg of ptCfg) {
    ppH += '<div class="rec-section"><div class="rec-section-title">' + t('rec_most_plays_single', { unit: cfg.unitLabel }) + '</div><div class="rec-grid-2">';
    const topS = Object.entries(cfg.sPP).sort(function (a, b) { return b[1].count - a[1].count; });
    ppH += '<div><div class="rec-section-sub">' + t('rec_top_songs') + '</div>' + recTable(['#', t('rec_th_songs') + ' &middot; ' + t('rec_th_artist'), t('rec_th_plays'), cfg.unitLabel],
      topS.map(function (e, i) { const d = e[1]; const n = songNames[e[0]] || {}; return '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(d.title || n.title || e[0].split('|||')[0]) + '</div><div class="rec-sub">' + esc(d.artist || n.artist || '') + '</div></td><td class="rec-count">' + d.count + '</td><td class="rec-meta">' + fmtPeriodKey(d.period, cfg.pt) + '</td>'; }),
      lim
    ) + '</div>';
    const topA = Object.entries(cfg.aPP).sort(function (a, b) { return b[1].count - a[1].count; });
    ppH += '<div><div class="rec-section-sub">' + t('rec_top_artists') + '</div>' + recTable(['#', t('rec_th_artist'), t('rec_th_plays'), cfg.unitLabel],
      topA.map(function (e, i) { return '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(e[0]) + '</div></td><td class="rec-count">' + e[1].count + '</td><td class="rec-meta">' + fmtPeriodKey(e[1].period, cfg.pt) + '</td>'; }),
      lim
    ) + '</div></div>';
    const topL = Object.entries(cfg.lPP).sort(function (a, b) { return b[1].count - a[1].count; });
    ppH += '<div class="rec-section-sub">' + t('rec_top_albums') + '</div>' + recTable(['#', t('rec_th_albums') + ' &middot; ' + t('rec_th_artist'), t('rec_th_plays'), cfg.unitLabel],
      topL.map(function (e, i) { const d = e[1]; const n = albumNames[e[0]] || {}; return '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(d.album || n.album || e[0].split('|||')[0]) + '</div><div class="rec-sub">' + esc(d.artist || n.artist || '') + '</div></td><td class="rec-count">' + d.count + '</td><td class="rec-meta">' + fmtPeriodKey(d.period, cfg.pt) + '</td>'; }),
      lim
    ) + '</div>';
  }
  document.getElementById('recPeakPlaysBody').innerHTML = ppH;

  // ── Play Count Milestones ─────────────────────────────────────
  let mh = '<div class="rec-section"><div class="rec-section-title">' + t('rec_artists_milestones') + '</div>';
  const aMilRows = MILESTONES.map(function (m) {
    const first = Object.entries(artistMS).filter(function (e) { return e[1][m]; }).sort(function (a, b) { return a[1][m].date - b[1][m].date; })[0];
    if (!first) return '';
    const ms = first[1][m];
    return '<tr><td><span class="milestone-number">' + m.toLocaleString() + '</span></td><td><div class="rec-name">' + esc(first[0]) + '</div></td><td class="rec-meta">' + fmtDate(ms.date) + '</td><td class="rec-meta">' + (ms.days === 0 ? t('rec_milestone_day1') : t('rec_milestone_days_after', { n: ms.days.toLocaleString() })) + '</td></tr>';
  }).filter(Boolean);
  mh += '<table class="milestone-table"><thead><tr><th>' + t('mil_th_plays') + '</th><th>' + t('mil_th_first_artist') + '</th><th>' + t('mil_th_date_reached') + '</th><th>' + t('mil_th_time_since') + '</th></tr></thead><tbody>' + (aMilRows.join('') || '<tr><td colspan="4" class="rec-empty">' + t('mil_no_data') + '</td></tr>') + '</tbody></table></div>';
  mh += '<div class="rec-section"><div class="rec-section-title">' + t('rec_songs_milestones') + '</div>';
  const sMilRows = [50, 100, 200, 500, 1000].map(function (m) {
    const first = Object.entries(songMS).filter(function (e) { return e[1][m]; }).sort(function (a, b) { return a[1][m].date - b[1][m].date; })[0];
    if (!first) return '';
    const n = songNames[first[0]] || {}, ms = first[1][m];
    return '<tr><td><span class="milestone-number">' + m.toLocaleString() + '</span></td><td><div class="rec-name">' + esc(n.title || first[0].split('|||')[0]) + '</div><div class="rec-sub">' + esc(n.artist || '') + '</div></td><td class="rec-meta">' + fmtDate(ms.date) + '</td><td class="rec-meta">' + (ms.days === 0 ? t('rec_milestone_day1') : t('rec_milestone_days_after', { n: ms.days.toLocaleString() })) + '</td></tr>';
  }).filter(Boolean);
  mh += '<table class="milestone-table"><thead><tr><th>' + t('mil_th_plays') + '</th><th>' + t('mil_th_first_song') + '</th><th>' + t('mil_th_date_reached') + '</th><th>' + t('mil_th_time_since') + '</th></tr></thead><tbody>' + (sMilRows.join('') || '<tr><td colspan="4" class="rec-empty">' + t('mil_no_data') + '</td></tr>') + '</tbody></table></div>';
  document.getElementById('recMilestonesBody').innerHTML = mh;

  // ── Fastest to Milestone ──────────────────────────────────────
  const TARGET = 1000;
  let fh = '';
  const withM = Object.entries(artistMS).filter(function (e) { return e[1][TARGET]; }).sort(function (a, b) { return a[1][TARGET].days - b[1][TARGET].days; });
  fh += '<div class="rec-section"><div class="rec-section-title">' + t('rec_fastest_to', { type: '♦ ' + t('rec_th_artists'), n: TARGET.toLocaleString() }) + '</div>';
  fh += '<div class="rec-section-sub">' + (withM.length !== 1 ? t('rec_have_reached', { n: withM.length, type: tUnit('artists', withM.length), plays: TARGET.toLocaleString() }) : t('rec_has_reached', { n: 1, type: tUnit('artists', 1), plays: TARGET.toLocaleString() })) + '</div>';
  fh += recTable(['#', t('rec_th_artist'), t('rec_th_days_to_1k'), t('rec_th_first_play'), t('rec_th_reached_1k')],
    withM.map(function (e, i) {
      const ms = e[1][TARGET], fp = artistFirst[e[0]];
      return '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(e[0]) + '</div></td><td class="rec-count">' + (ms.days === 0 ? t('rec_days_less_than_1') : ms.days.toLocaleString() + ' ' + tUnit('days', ms.days)) + '</td><td class="rec-meta">' + (fp ? fmtDate(fp) : '—') + '</td><td class="rec-meta">' + fmtDate(ms.date) + '</td>';
    }),
    lim
  );
  fh += '</div>';
  for (const m of [500, 2000, 5000]) {
    const entries = Object.entries(artistMS).filter(function (e) { return e[1][m]; }).sort(function (a, b) { return a[1][m].days - b[1][m].days; });
    if (!entries.length) continue;
    fh += '<div class="rec-section"><div class="rec-section-title">' + t('rec_fastest_to', { type: '♦ ' + t('rec_th_artists'), n: m.toLocaleString() }) + '</div>';
    fh += recTable(['#', t('rec_th_artist'), t('rec_th_days'), t('rec_th_date_reached')],
      entries.map(function (e, i) { const ms = e[1][m]; return '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(e[0]) + '</div></td><td class="rec-count">' + (ms.days === 0 ? '&lt; 1' : ms.days.toLocaleString()) + ' ' + tUnit('days', ms.days) + '</td><td class="rec-meta">' + fmtDate(ms.date) + '</td>'; }),
      lim
    );
    fh += '</div>';
  }
  const songWith500 = Object.entries(songMS).filter(function (e) { return e[1][500]; }).sort(function (a, b) { return a[1][500].days - b[1][500].days; });
  if (songWith500.length) {
    fh += '<div class="rec-section"><div class="rec-section-title">' + t('rec_songs_fastest_to', { n: '500' }) + '</div>';
    fh += recTable(['#', t('rec_th_songs') + ' &middot; ' + t('rec_th_artist'), t('rec_th_days'), t('rec_th_date_reached')],
      songWith500.map(function (e, i) { const n = songNames[e[0]] || {}, ms = e[1][500]; return '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(n.title || e[0].split('|||')[0]) + '</div><div class="rec-sub">' + esc(n.artist || '') + '</div></td><td class="rec-count">' + (ms.days === 0 ? '&lt; 1' : ms.days.toLocaleString()) + ' ' + tUnit('days', ms.days) + '</td><td class="rec-meta">' + fmtDate(ms.date) + '</td>'; }),
      lim
    );
    fh += '</div>';
  }
  document.getElementById('recFastestBody').innerHTML = fh;

  // ── Certifications Leaderboard ────────────────────────────────
  const certW = Object.entries(artistCertCounts).map(function (e) {
    const c = e[1];
    return { art: e[0], sg: c.sg, sp: c.sp, sd: c.sd, ag: c.ag, ap: c.ap, ad: c.ad, score: c.sd * 4 + c.sp * 2 + c.sg + c.ad * 4 + c.ap * 2 + c.ag };
  }).filter(function (e) { return e.score > 0; }).sort(function (a, b) { return b.score - a.score; });
  let ch = '<div class="rec-section"><div class="rec-section-title">' + t('rec_artists_with_certs') + '</div>';
  ch += '<div class="rec-section-sub">' + t('rec_certs_thresholds', { sg: CERT.song.gold, sp: CERT.song.plat, sd: CERT.song.diamond, ag: CERT.album.gold, ap: CERT.album.plat, ad: CERT.album.diamond }) + '</div>';
  if (!certW.length) {
    ch += '<div class="rec-empty">' + t('rec_no_certifications') + '</div>';
  } else {
    ch += recTable(['#', t('rec_th_artist'), t('rec_th_song_cert'), t('rec_th_album_cert')],
      certW.map(function (e, i) {
        const sc2 = [e.sd ? e.sd + '× 💎' : '', e.sp ? e.sp + '× 💿' : '', e.sg ? e.sg + '× ⭐' : ''].filter(Boolean).join(' ') || '—';
        const ac2 = [e.ad ? e.ad + '× 💎' : '', e.ap ? e.ap + '× 💿' : '', e.ag ? e.ag + '× ⭐' : ''].filter(Boolean).join(' ') || '—';
        return '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(e.art) + '</div></td><td class="rec-meta" style="white-space:nowrap">' + sc2 + '</td><td class="rec-meta" style="white-space:nowrap">' + ac2 + '</td>';
      }),
      lim
    );
  }
  ch += '</div>';
  document.getElementById('recCertsBody').innerHTML = ch;

  // ── Streak Records ────────────────────────────────────────────
  let sh = '';
  const topAS = Object.entries(artistStreaks).sort(function (a, b) { return b[1] - a[1]; });
  sh += '<div class="rec-section"><div class="rec-section-title">' + t('rec_artists_longest_streak') + '</div>';
  sh += recTable(['#', t('rec_th_artist'), t('rec_th_consec_days')],
    topAS.map(function (e, i) { return '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(e[0]) + '</div></td><td class="rec-count">' + e[1] + ' ' + tUnit('days', e[1]) + '</td>'; }),
    lim
  );
  sh += '</div>';
  const topSS = Object.entries(songStreaks).sort(function (a, b) { return b[1] - a[1]; });
  sh += '<div class="rec-section"><div class="rec-section-title">' + t('rec_songs_longest_streak') + '</div>';
  sh += recTable(['#', t('rec_th_songs') + ' &middot; ' + t('rec_th_artist'), t('rec_th_consec_days')],
    topSS.map(function (e, i) { const n = songNames[e[0]] || {}; return '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(n.title || e[0].split('|||')[0]) + '</div><div class="rec-sub">' + esc(n.artist || '') + '</div></td><td class="rec-count">' + e[1] + ' ' + tUnit('days', e[1]) + '</td>'; }),
    lim
  );
  sh += '</div>';
  sh += '<div class="rec-section"><div class="rec-section-title">' + t('rec_repeat_runs') + '</div><div class="rec-section-sub">' + t('rec_repeat_runs_sub') + '</div>';
  if (allCSRuns.length > 0) {
    sh += recTable(['#', t('rec_th_songs') + ' &middot; ' + t('rec_th_artist'), t('rec_th_consec_plays'), t('rec_th_date')],
      allCSRuns.map(function (e, i) {
        const n = songNames[e.key] || {};
        return '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(n.title || e.key.split('|||')[0]) + '</div><div class="rec-sub">' + esc(n.artist || '') + '</div></td><td class="rec-count">' + e.count + '&times;</td><td class="rec-meta">' + (e.date ? fmt(e.date) : '') + '</td>';
      }),
      lim
    );
  } else {
    sh += '<div class="rec-empty">' + t('rec_no_repeat_runs') + '</div>';
  }
  sh += '</div>';
  document.getElementById('recStreaksBody').innerHTML = sh;
  setupRecordSubsectionCollapse();
  restoreRecordSubsectionCollapseStates();
  initAllRecTableResizableCols();
}

function initAllRecTableResizableCols() {
  document.querySelectorAll('#recordsView .rec-table, #recordsView .milestone-table').forEach(initResizableColsForTable);
}

function initResizableColsForTable(table) {
  if (table.dataset.resizeReady === '1') return;
  table.dataset.resizeReady = '1';
  const ths = Array.from(table.querySelectorAll('thead th'));
  ths.forEach(function(th, i) {
    if (i === ths.length - 1) return; // skip last column
    const handle = document.createElement('span');
    handle.className = 'col-resize-handle';
    th.appendChild(handle);
    handle.addEventListener('mousedown', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.pageX;
      const startW = th.offsetWidth;
      if (table.style.tableLayout !== 'fixed') {
        ths.forEach(function(t) { t.style.width = t.offsetWidth + 'px'; });
        table.style.tableLayout = 'fixed';
      }
      handle.classList.add('resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      function onMouseMove(e) {
        th.style.width = Math.max(30, startW + e.pageX - startX) + 'px';
      }
      function onMouseUp() {
        handle.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  });
}

function restoreRecordSubsectionCollapseStates() {
  const wrappers = document.querySelectorAll('.rec-section-sub-wrapper');
  wrappers.forEach(wrapper => {
    const subsectionId = wrapper.id.replace('-wrapper', '');
    const isCollapsed = localStorage.getItem('dc_rec_subsection_collapsed_' + subsectionId) === '1';
    if (isCollapsed) {
      wrapper.classList.add('rec-subsection-collapsed');
      const btn = wrapper.querySelector('.rec-subsection-collapse-btn');
      if (btn) {
        btn.textContent = '+';
        btn.title = 'Expand';
        btn.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

function recSafeKey(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 80) || 'section';
}

function initRecordsViewUI() {
  const nav = document.getElementById('recordsNav');
  if (!nav || nav.dataset.ready === '1') return;
  nav.dataset.ready = '1';

  nav.addEventListener('click', e => {
    const btn = e.target.closest('.records-nav-btn');
    if (!btn) return;
    const view = btn.dataset.recView || 'all';
    localStorage.setItem('dc_records_active_view', view);
    applyRecordsViewFilter(view);
  });

  // Add event listeners for records size buttons
  const recordsSizeBar = document.getElementById('recordsSizeBar');
  if (recordsSizeBar) {
    recordsSizeBar.addEventListener('click', e => {
      const btn = e.target.closest('[data-rec-size]');
      if (!btn) return;
      recLimit = parseInt(btn.dataset.recSize, 10);
      localStorage.setItem('dc_rec_limit', recLimit);
      document.querySelectorAll('#recordsSizeBtns button').forEach(b => {
        b.classList.toggle('active', b === btn);
      });
      buildRecords();
    });
  }
}

function applyRecordsViewFilter(view) {
  const sectionIds = [
    'recAllOnesSection',
    'recPAKSection',
    'recAppearancesSection',
    'recDebutsSection',
    'recPeakPlaysSection',
    'recMilestonesSection',
    'recFastestSection',
    'recCertsSection',
    'recStreaksSection'
  ];
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = (view === 'all' || view === id) ? '' : 'none';
  });
  document.querySelectorAll('#recordsNav .records-nav-btn').forEach(b => {
    b.classList.toggle('active', (b.dataset.recView || 'all') === view);
  });
  if (typeof window._refreshBackToTop === 'function') window._refreshBackToTop();
}

function restoreRecordSectionCollapseState() {
  const ids = [
    'recAllOnesSection',
    'recPAKSection',
    'recAppearancesSection',
    'recDebutsSection',
    'recPeakPlaysSection',
    'recMilestonesSection',
    'recFastestSection',
    'recCertsSection',
    'recStreaksSection'
  ];
  ids.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;
    const collapsed = localStorage.getItem('dc_rec_section_collapsed_' + id) === '1';
    section.classList.toggle('collapsed', collapsed);
    const btn = section.querySelector('.section-collapse-btn');
    if (btn) {
      btn.textContent = collapsed ? '+' : '−';
      btn.title = collapsed ? 'Expand' : 'Collapse';
    }
  });
}

function setupRecordSubsectionCollapse() {
  const root = document.getElementById('recordsView');
  if (!root) return;
  root.querySelectorAll('.rec-section').forEach(section => {
    if (section.dataset.collapseReady === '1') return;
    const title = section.querySelector('.rec-section-title');
    if (!title) return;
    const header = document.createElement('div');
    header.className = 'rec-section-header';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rec-collapse-btn';
    btn.title = 'Collapse';
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = '−';
    const parent = section.closest('.section-body');
    const key = (parent ? parent.id : 'records') + '__' + recSafeKey(title.textContent);
    section.dataset.recCollapseKey = key;
    title.parentNode.insertBefore(header, title);
    header.appendChild(btn);
    header.appendChild(title);
    section.dataset.collapseReady = '1';

    const collapsed = localStorage.getItem('dc_rec_inner_collapsed_' + key) === '1';
    if (collapsed) {
      section.classList.add('rec-collapsed');
      btn.textContent = '+';
      btn.title = 'Expand';
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.rec-collapse-btn');
  if (!btn) return;
  const section = btn.closest('.rec-section');
  if (!section) return;
  const collapsed = section.classList.toggle('rec-collapsed');
  btn.textContent = collapsed ? '+' : '−';
  btn.title = collapsed ? 'Expand' : 'Collapse';
  btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  if (section.dataset.recCollapseKey) {
    localStorage.setItem('dc_rec_inner_collapsed_' + section.dataset.recCollapseKey, collapsed ? '1' : '0');
  }
});

document.addEventListener('click', e => {
  const btn = e.target.closest('.rec-subsection-collapse-btn');
  if (!btn) return;
  const subsectionId = btn.dataset.subsectionId;
  if (!subsectionId) return;
  const wrapper = document.getElementById(subsectionId + '-wrapper');
  if (!wrapper) return;
  const collapsed = wrapper.classList.toggle('rec-subsection-collapsed');
  btn.textContent = collapsed ? '+' : '−';
  btn.title = collapsed ? 'Expand' : 'Collapse';
  btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  localStorage.setItem('dc_rec_subsection_collapsed_' + subsectionId, collapsed ? '1' : '0');
});

// ─── SECTION COLLAPSE ──────────────────────────────────────────
const CHART_COLLAPSIBLE_SECTIONS = ['songsSection', 'artistsSection', 'albumsSection', 'dropoutsSection', 'newSongsSection', 'newArtistsSection', 'newAlbumsSection'];

function restoreChartSectionCollapseState(period) {
  CHART_COLLAPSIBLE_SECTIONS.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;
    const collapsed = localStorage.getItem('dc_chart_section_collapsed_' + id + '_' + period) === '1';
    section.classList.toggle('collapsed', collapsed);
    const btn = section.querySelector('.section-collapse-btn');
    if (btn) {
      btn.textContent = collapsed ? '+' : '−';
      btn.title = collapsed ? 'Expand' : 'Collapse';
    }
  });
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.section-collapse-btn');
  if (!btn) return;
  const section = document.getElementById(btn.dataset.target);
  if (!section) return;
  const collapsed = section.classList.toggle('collapsed');
  btn.textContent = collapsed ? '+' : '−';
  btn.title = collapsed ? 'Expand' : 'Collapse';
  if (section.id && section.id.startsWith('rec')) {
    localStorage.setItem('dc_rec_section_collapsed_' + section.id, collapsed ? '1' : '0');
  } else if (CHART_COLLAPSIBLE_SECTIONS.includes(section.id)) {
    localStorage.setItem('dc_chart_section_collapsed_' + section.id + '_' + currentPeriod, collapsed ? '1' : '0');
  }
});

document.getElementById('periodNav').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('.period-nav button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  if (btn.dataset.period === 'rawdata') {
    // Switch to raw data view
    savedOffsets[currentPeriod] = currentOffset;
    currentPeriod = 'rawdata';
    localStorage.setItem('dc_period', currentPeriod);
    document.getElementById('chartSizeBar').style.display = 'none';
    document.getElementById('paginatedSizeBar').style.display = 'none';
    document.getElementById('chartDisplayToggles').style.display = 'none';
    document.getElementById('exportPlaylistBtn').style.display = 'none';
    document.getElementById('dateNav').style.display = 'none';
    document.getElementById('statsStrip').style.display = 'none';
    document.getElementById('songsSection').style.display = 'none';
    document.getElementById('artistsSection').style.display = 'none';
    document.getElementById('albumsSection').style.display = 'none';
    document.getElementById('dropoutsSection').style.display = 'none';
    NEW_ENTRY_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    document.getElementById('upcomingSection').style.display = 'none';
    document.getElementById('recentSection').style.display = 'none';
    document.getElementById('recordsView').style.display = 'none';
    document.getElementById('rawDataView').style.display = 'block';
    const recentEl = document.getElementById('recentSection');
    recentEl.classList.add('collapsed');
    const recentBtn = recentEl.querySelector('.section-collapse-btn');
    if (recentBtn) recentBtn.textContent = '+';
    const upcomingEl = document.getElementById('upcomingSection');
    upcomingEl.classList.add('collapsed');
    const upcomingBtn = upcomingEl.querySelector('.section-collapse-btn');
    if (upcomingBtn) upcomingBtn.textContent = '+';
    applyRawFilters();
    return;
  }

  if (btn.dataset.period === 'graphs') {
    // Switch to graphs view
    savedOffsets[currentPeriod] = currentOffset;
    currentPeriod = 'graphs';
    localStorage.setItem('dc_period', currentPeriod);
    document.getElementById('chartSizeBar').style.display = 'none';
    document.getElementById('paginatedSizeBar').style.display = 'none';
    document.getElementById('chartDisplayToggles').style.display = 'none';
    document.getElementById('exportPlaylistBtn').style.display = 'none';
    document.getElementById('dateNav').style.display = 'none';
    document.getElementById('statsStrip').style.display = 'none';
    document.getElementById('songsSection').style.display = 'none';
    document.getElementById('artistsSection').style.display = 'none';
    document.getElementById('albumsSection').style.display = 'none';
    document.getElementById('dropoutsSection').style.display = 'none';
    NEW_ENTRY_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    document.getElementById('upcomingSection').style.display = 'none';
    document.getElementById('recentSection').style.display = 'none';
    document.getElementById('recordsView').style.display = 'none';
    document.getElementById('rawDataView').style.display = 'none';
    document.getElementById('graphsView').style.display = 'block';
    if (allPlays.length) renderGraphs();
    return;
  }

  if (btn.dataset.period === 'records') {
    // Switch to records view
    savedOffsets[currentPeriod] = currentOffset;
    currentPeriod = 'records';
    localStorage.setItem('dc_period', currentPeriod);
    document.getElementById('chartSizeBar').style.display = 'none';
    document.getElementById('paginatedSizeBar').style.display = 'none';
    document.getElementById('chartDisplayToggles').style.display = 'none';
    document.getElementById('exportPlaylistBtn').style.display = 'none';
    document.getElementById('dateNav').style.display = 'none';
    document.getElementById('statsStrip').style.display = 'none';
    document.getElementById('songsSection').style.display = 'none';
    document.getElementById('artistsSection').style.display = 'none';
    document.getElementById('albumsSection').style.display = 'none';
    document.getElementById('dropoutsSection').style.display = 'none';
    NEW_ENTRY_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    document.getElementById('upcomingSection').style.display = 'none';
    document.getElementById('recentSection').style.display = 'none';
    document.getElementById('rawDataView').style.display = 'none';
    document.getElementById('graphsView').style.display = 'none';
    document.getElementById('recordsView').style.display = 'block';
    initRecordsViewUI();
    restoreRecordSectionCollapseState();
    buildRecords();
    applyRecordsViewFilter(localStorage.getItem('dc_records_active_view') || 'recAllOnesSection');
    if (typeof window._refreshBackToTop === 'function') window._refreshBackToTop();
    return;
  }

  // Leaving raw data, graphs, or records view — restore chart UI
  if (currentPeriod === 'rawdata' || currentPeriod === 'graphs' || currentPeriod === 'records') {
    document.getElementById('dateNav').style.display = '';
    document.getElementById('statsStrip').style.display = '';
    document.getElementById('songsSection').style.display = '';
    document.getElementById('artistsSection').style.display = '';
    document.getElementById('albumsSection').style.display = '';
    document.getElementById('upcomingSection').style.display = '';
    document.getElementById('recentSection').style.display = '';
    document.getElementById('rawDataView').style.display = 'none';
    document.getElementById('graphsView').style.display = 'none';
    document.getElementById('recordsView').style.display = 'none';
    if (currentPeriod === 'graphs') destroyGraphCharts();
  }

  savedOffsets[(currentPeriod === 'rawdata' || currentPeriod === 'graphs' || currentPeriod === 'records') ? btn.dataset.period : currentPeriod] = currentOffset;
  currentPeriod = btn.dataset.period;
  localStorage.setItem('dc_period', currentPeriod);
  currentOffset = savedOffsets[currentPeriod];
  restoreChartSectionCollapseState(currentPeriod);
  pageState.songs = 0; pageState.artists = 0; pageState.albums = 0;
  renderAll();
});

document.getElementById('prevBtn').addEventListener('click', () => { currentOffset++; pageState.songs = 0; pageState.artists = 0; pageState.albums = 0; renderAll(); });
document.getElementById('nextBtn').addEventListener('click', () => { currentOffset = Math.max(0, currentOffset - 1); pageState.songs = 0; pageState.artists = 0; pageState.albums = 0; renderAll(); });

// ─── JUMP PICKER ───────────────────────────────────────────────
function syncPicker() {
  const now = tzNow();
  const wp = document.getElementById('weekPicker');
  const mp = document.getElementById('monthPicker');
  const yp = document.getElementById('yearPicker');
  const jp = document.getElementById('jumpPicker');
  const hasPicker = ['week', 'month', 'year'].includes(currentPeriod);
  jp.style.display = hasPicker ? '' : 'none';
  wp.style.display = currentPeriod === 'week' ? '' : 'none';
  mp.style.display = currentPeriod === 'month' ? '' : 'none';
  yp.style.display = currentPeriod === 'year' ? '' : 'none';
  if (currentPeriod === 'week') {
    const dow = now.getDay();
    const offset = (dow - weekStartDay + 7) % 7;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - offset - currentOffset * 7);
    weekStart.setHours(0, 0, 0, 0);
    wp.value = localDateStr(weekStart);
  } else if (currentPeriod === 'month') {
    const d = new Date(now.getFullYear(), now.getMonth() - currentOffset, 1);
    mp.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  } else if (currentPeriod === 'year') {
    yp.value = String(now.getFullYear() - currentOffset);
  }
}

function populateYearPicker() {
  const yp = document.getElementById('yearPicker');
  const years = [...new Set(allPlays.map(p => tzDate(p.date).getFullYear()))].sort((a, b) => b - a);
  yp.innerHTML = years.map(y => `<option value="${y}">${y}</option>`).join('');
}

document.getElementById('weekPicker').addEventListener('change', e => {
  if (!e.target.value) return;
  const picked = new Date(e.target.value + 'T00:00:00'); // fake-local midnight on picked date
  const now = tzNow();
  const nowDow = now.getDay();
  const pickedDow = picked.getDay();
  const nowOffset = (nowDow - weekStartDay + 7) % 7;
  const pickedOffset = (pickedDow - weekStartDay + 7) % 7;
  const curStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - nowOffset);
  const picStart = new Date(picked.getFullYear(), picked.getMonth(), picked.getDate() - pickedOffset);
  const offset = Math.round((curStart - picStart) / (7 * 86400000));
  if (offset >= 0) { currentOffset = offset; pageState.songs = 0; pageState.artists = 0; pageState.albums = 0; renderAll(); }
});

document.getElementById('monthPicker').addEventListener('change', e => {
  if (!e.target.value) return;
  const [yr, mo] = e.target.value.split('-').map(Number);
  const now = tzNow();
  const offset = (now.getFullYear() - yr) * 12 + (now.getMonth() + 1 - mo);
  if (offset >= 0) { currentOffset = offset; pageState.songs = 0; pageState.artists = 0; pageState.albums = 0; renderAll(); }
});

document.getElementById('yearPicker').addEventListener('change', e => {
  const offset = tzNow().getFullYear() - parseInt(e.target.value);
  if (offset >= 0) { currentOffset = offset; pageState.songs = 0; pageState.artists = 0; pageState.albums = 0; renderAll(); }
});

// ─── RAW DATA VIEW ─────────────────────────────────────────────
const RAW_PAGE_SIZE = 200;
let rawPage = 0;
let rawFiltered = [];
let rawSortCol = 'date';
let rawSortDir = -1; // -1 = desc, 1 = asc

function rawFmtDate(d) {
  const td = tzDate(d);
  const monthKey = ['month_jan', 'month_feb', 'month_mar', 'month_apr', 'month_may_short', 'month_jun', 'month_jul', 'month_aug', 'month_sep', 'month_oct', 'month_nov', 'month_dec'][td.getMonth()];
  const monthName = t(monthKey);
  const hours = String(td.getHours()).padStart(2, '0');
  const mins = String(td.getMinutes()).padStart(2, '0');
  return `${td.getDate()} ${monthName} ${td.getFullYear()} ${hours}:${mins}`;
}

function applyRawFilters() {
  const fSong = document.getElementById('rawFilterSong').value.trim().toLowerCase();
  const fArtist = document.getElementById('rawFilterArtist').value.trim().toLowerCase();
  const fAlbum = document.getElementById('rawFilterAlbum').value.trim().toLowerCase();
  const fDate = document.getElementById('rawFilterDate').value.trim().toLowerCase();

  rawFiltered = allPlays.filter(p => {
    if (fSong && !p.title.toLowerCase().includes(fSong)) return false;
    if (fArtist && !p.artist.toLowerCase().includes(fArtist)) return false;
    if (fAlbum && !p.album.toLowerCase().includes(fAlbum)) return false;
    if (fDate && !rawFmtDate(p.date).toLowerCase().includes(fDate)) return false;
    return true;
  });

  rawFiltered.sort((a, b) => {
    let va, vb;
    if (rawSortCol === 'date') { va = a.date; vb = b.date; }
    else if (rawSortCol === 'title') { va = a.title.toLowerCase(); vb = b.title.toLowerCase(); }
    else if (rawSortCol === 'artist') { va = a.artist.toLowerCase(); vb = b.artist.toLowerCase(); }
    else if (rawSortCol === 'album') { va = a.album.toLowerCase(); vb = b.album.toLowerCase(); }
    else return 0;
    return va < vb ? -rawSortDir : va > vb ? rawSortDir : 0;
  });

  rawPage = 0;
  renderRawPage();
}

function renderRawPage() {
  const total = rawFiltered.length;
  const totalPages = Math.max(1, Math.ceil(total / RAW_PAGE_SIZE));
  rawPage = Math.max(0, Math.min(rawPage, totalPages - 1));
  const start = rawPage * RAW_PAGE_SIZE;
  const slice = rawFiltered.slice(start, start + RAW_PAGE_SIZE);

  // Summary
  const hasFilter = ['rawFilterSong', 'rawFilterArtist', 'rawFilterAlbum', 'rawFilterDate'].some(id => document.getElementById(id).value.trim());
  const totalAll = allPlays.length;
  document.getElementById('rawSummary').innerHTML = hasFilter
    ? t('raw_showing', { n: `<strong>${total.toLocaleString()}</strong>`, total: totalAll.toLocaleString() })
    : t('raw_total', { n: `<strong>${totalAll.toLocaleString()}</strong>` });

  // Rows
  document.getElementById('rawBody').innerHTML = slice.map((p, i) => {
    const n = start + i + 1;
    return `<tr>
      <td class="raw-num">${n.toLocaleString()}</td>
      <td class="raw-date">${rawFmtDate(p.date)}</td>
      <td class="raw-title">${esc(p.title)}</td>
      <td>${esc(p.artist)}</td>
      <td class="raw-album">${esc(p.album)}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="5" style="padding:1rem;color:var(--text3);font-style:italic;font-family:'DM Mono',monospace;font-size:0.72rem;">${t('raw_no_match')}</td></tr>`;

  // Pagination
  document.getElementById('rawPrevBtn').disabled = rawPage === 0;
  document.getElementById('rawNextBtn').disabled = rawPage >= totalPages - 1;
  document.getElementById('rawPageLabel').textContent = total > 0 ? t('page_label', { page: rawPage + 1, total: totalPages }) : '';

  // Sort arrows
  document.querySelectorAll('.raw-th').forEach(th => {
    const col = th.dataset.col;
    const arrow = th.querySelector('.sort-arrow');
    th.classList.toggle('sort-active', col === rawSortCol);
    if (col === rawSortCol) arrow.textContent = rawSortDir === -1 ? '↓' : '↑';
    else arrow.textContent = '↕';
  });
}

// Filter inputs — debounced
let rawDebounce = null;
['rawFilterSong', 'rawFilterArtist', 'rawFilterAlbum', 'rawFilterDate'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    clearTimeout(rawDebounce);
    rawDebounce = setTimeout(applyRawFilters, 200);
  });
});

document.getElementById('rawClearBtn').addEventListener('click', () => {
  ['rawFilterSong', 'rawFilterArtist', 'rawFilterAlbum', 'rawFilterDate'].forEach(id => {
    document.getElementById(id).value = '';
  });
  applyRawFilters();
});

document.getElementById('rawPrevBtn').addEventListener('click', () => { rawPage--; renderRawPage(); });
document.getElementById('rawNextBtn').addEventListener('click', () => { rawPage++; renderRawPage(); });

document.querySelector('table.raw-table thead').addEventListener('click', e => {
  const th = e.target.closest('.raw-th');
  if (!th || th.dataset.col === 'num') return;
  const col = th.dataset.col;
  if (rawSortCol === col) rawSortDir *= -1;
  else { rawSortCol = col; rawSortDir = 1; }
  applyRawFilters();
});

// ─── WEEK KEY HELPERS ──────────────────────────────────────────
// Use LOCAL date components (not toISOString which is UTC) to build date strings.
// This prevents UTC-offset from shifting the date string by ±1 day.

function localDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Returns the canonical week key (start day's local date string) for a given play date.
function playWeekKey(playDate) {
  const td = tzDate(playDate);
  const dow = td.getDay();
  const offset = (dow - weekStartDay + 7) % 7;
  const startDate = new Date(td.getFullYear(), td.getMonth(), td.getDate() - offset);
  return localDateStr(startDate);
}

// Groups allPlays by period key (week/month/year), optionally capped at cutoffKey (inclusive)
function _buildPeriodPlaysMap(periodType, cutoffKey) {
  const playsMap = {};
  for (const p of allPlays) {
    let key;
    if (periodType === 'week') {
      key = playWeekKey(p.date);
    } else if (periodType === 'month') {
      const _td = tzDate(p.date);
      key = _td.getFullYear() + '-' + String(_td.getMonth() + 1).padStart(2, '0');
    } else {
      key = String(tzDate(p.date).getFullYear());
    }
    if (cutoffKey && key > cutoffKey) continue;
    (playsMap[key] || (playsMap[key] = [])).push(p);
  }
  return playsMap;
}

function _maxStatsFromMap(playsMap) {
  let maxPlays = 0, maxSongs = 0, maxArtists = 0, maxAlbums = 0;
  for (const pp of Object.values(playsMap)) {
    maxPlays   = Math.max(maxPlays,   pp.length);
    maxSongs   = Math.max(maxSongs,   new Set(pp.map(p => songKey(p))).size);
    maxArtists = Math.max(maxArtists, new Set(pp.flatMap(p => p.artists)).size);
    maxAlbums  = Math.max(maxAlbums,  new Set(pp.map(p => p.album).filter(a => a && a !== '—')).size);
  }
  return { maxPlays, maxSongs, maxArtists, maxAlbums };
}

// Returns the max stats across all periods of this type (all time)
function buildPeriodTypePeakStats(periodType) {
  return _maxStatsFromMap(_buildPeriodPlaysMap(periodType, null));
}

// Returns the max stats across all periods up to and including cutoffKey
function buildPeriodTypePeakStatsUpTo(periodType, cutoffKey) {
  return _maxStatsFromMap(_buildPeriodPlaysMap(periodType, cutoffKey));
}

// Returns the week key for the period currently being viewed (based on currentOffset).
function currentViewWeekKey() {
  const now = tzNow();
  const dow = now.getDay();
  const offset = (dow - weekStartDay + 7) % 7;
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset - currentOffset * 7);
  return localDateStr(startDate);
}

// ─── DATE RANGE ─────────────────────────────────────────────────
function getDateRange() {
  const now = tzNow();
  if (currentPeriod === 'alltime') return { start: new Date(0), end: new Date(9999, 0), label: t('period_alltime'), sub: t('period_alltime_sub') };

  let start, end, label, sub;
  if (currentPeriod === 'week') {
    const dow = now.getDay(); // 0=Sun … 6=Sat
    const offset = (dow - weekStartDay + 7) % 7;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - offset - (currentOffset * 7));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    start = weekStart;
    end = weekEnd;
    label = currentOffset === 0 ? t('period_this_week') : t('period_week_of', { date: fmt(weekStart) });
    sub = `${fmt(weekStart)} – ${fmt(weekEnd)}`;
  } else if (currentPeriod === 'month') {
    const d = new Date(now.getFullYear(), now.getMonth() - currentOffset, 1);
    start = new Date(d.getFullYear(), d.getMonth(), 1);
    end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    sub = `${fmt(start)} – ${fmt(end)}`;
  } else {
    const yr = now.getFullYear() - currentOffset;
    start = new Date(yr, 0, 1);
    end = new Date(yr, 11, 31, 23, 59, 59, 999);
    label = String(yr);
    sub = t('period_year_months', { year: yr });
  }
  return { start, end, label, sub };
}

function fmt(d) {
  const monthKey = ['month_jan', 'month_feb', 'month_mar', 'month_apr', 'month_may_short', 'month_jun', 'month_jul', 'month_aug', 'month_sep', 'month_oct', 'month_nov', 'month_dec'][d.getMonth()];
  const monthName = t(monthKey);
  return `${d.getDate()} ${monthName} ${d.getFullYear()}`;
}

// Helper: format date using translated month names
function fmtDate(d) {
  if (!d || isNaN(d.getTime())) return '—';
  const monthKey = ['month_jan', 'month_feb', 'month_mar', 'month_apr', 'month_may_short', 'month_jun', 'month_jul', 'month_aug', 'month_sep', 'month_oct', 'month_nov', 'month_dec'][d.getMonth()];
  const monthName = t(monthKey);
  return `${d.getDate()} ${monthName} ${d.getFullYear()}`;
}

// ─── NEW ENTRIES (first-ever plays for the period) ─────────────

function buildFirstSeenMaps() {
  const songFirst = {}, artistFirst = {}, albumFirst = {};
  for (const p of allPlays) {
    const tz = tzDate(p.date);
    const sk = songKey(p);
    if (!songFirst[sk] || tz < songFirst[sk]) songFirst[sk] = tz;
    for (const artist of p.artists) {
      if (!artistFirst[artist] || tz < artistFirst[artist]) artistFirst[artist] = tz;
    }
    if (p.album && p.album !== '—') {
      const ak = p.album + '|||' + albumArtist(p);
      if (!albumFirst[ak] || tz < albumFirst[ak]) albumFirst[ak] = tz;
    }
  }
  return { songFirst, artistFirst, albumFirst };
}

const NEW_ENTRY_SECTIONS = ['newSongsSection', 'newArtistsSection', 'newAlbumsSection'];

function renderNewEntries(plays, start, end) {
  const show = plays.length > 0 && ['week', 'month', 'year'].includes(currentPeriod);
  if (!show) {
    NEW_ENTRY_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    return;
  }

  const periodLabel = currentPeriod === 'week' ? 'Week' : currentPeriod === 'month' ? 'Month' : 'Year';

  let limit;
  if (currentPeriod === 'week') {
    limit = Math.max(20, chartSizeWeekly);
  } else if (currentPeriod === 'month') {
    limit = chartSizeMonthly;
  } else {
    limit = chartSizeYearly; // Infinity = All Entries
  }

  if (!firstSeenMaps) firstSeenMaps = buildFirstSeenMaps();
  const { songFirst, artistFirst, albumFirst } = firstSeenMaps;

  // New songs
  const songCounts = {};
  for (const p of plays) {
    const sk = songKey(p);
    const first = songFirst[sk];
    if (first && first >= start && first <= end) {
      if (!songCounts[sk]) songCounts[sk] = { title: p.title, artist: p.artist, count: 0, _albums: {} };
      songCounts[sk].count++;
      songCounts[sk]._albums[p.album] = (songCounts[sk]._albums[p.album] || 0) + 1;
    }
  }
  const allNewSongs = Object.values(songCounts).map(s => { s.album = bestAlbum(s.title, s._albums); delete s._albums; return s; })
    .sort((a, b) => b.count - a.count);
  const newSongs = isFinite(limit) ? allNewSongs.slice(0, limit) : allNewSongs;

  // New artists
  const artistCounts = {};
  for (const p of plays) {
    for (const artist of p.artists) {
      const first = artistFirst[artist];
      if (first && first >= start && first <= end) {
        if (!artistCounts[artist]) artistCounts[artist] = { name: artist, count: 0, songs: new Set() };
        artistCounts[artist].count++;
        artistCounts[artist].songs.add(p.title);
      }
    }
  }
  const allNewArtists = Object.values(artistCounts).sort((a, b) => b.count - a.count);
  const newArtists = isFinite(limit) ? allNewArtists.slice(0, limit) : allNewArtists;

  // New albums
  const albumCounts = {};
  for (const p of plays) {
    if (!p.album || p.album === '—') continue;
    const ak = p.album + '|||' + albumArtist(p);
    const first = albumFirst[ak];
    if (first && first >= start && first <= end) {
      if (!albumCounts[ak]) albumCounts[ak] = { album: p.album, artist: albumArtist(p), count: 0, tracks: new Set() };
      albumCounts[ak].count++;
      albumCounts[ak].tracks.add(p.title);
    }
  }
  const allNewAlbums = Object.values(albumCounts).sort((a, b) => b.count - a.count);
  const newAlbums = isFinite(limit) ? allNewAlbums.slice(0, limit) : allNewAlbums;

  // Update titles and visibility
  const maxS = newSongs[0]?.count || 1;
  const maxA = newArtists[0]?.count || 1;
  const maxL = newAlbums[0]?.count || 1;

  const songSec = document.getElementById('newSongsSection');
  const artistSec = document.getElementById('newArtistsSection');
  const albumSec = document.getElementById('newAlbumsSection');

  if (songSec) {
    songSec.style.display = newSongs.length > 0 ? '' : 'none';
    document.getElementById('newSongsTitle').textContent = `✦ ${newSongs.length} NEW SONG${newSongs.length !== 1 ? 'S' : ''} THIS ${periodLabel.toUpperCase()}`;
  }
  if (artistSec) {
    artistSec.style.display = newArtists.length > 0 ? '' : 'none';
    document.getElementById('newArtistsTitle').textContent = `✦ ${newArtists.length} NEW ARTIST${newArtists.length !== 1 ? 'S' : ''} THIS ${periodLabel.toUpperCase()}`;
  }
  if (albumSec) {
    albumSec.style.display = newAlbums.length > 0 ? '' : 'none';
    document.getElementById('newAlbumsTitle').textContent = `✦ ${newAlbums.length} NEW ALBUM${newAlbums.length !== 1 ? 'S' : ''} THIS ${periodLabel.toUpperCase()}`;
  }

  // Render new songs
  const newSongImgs = [];
  document.getElementById('newSongsBody').innerHTML = newSongs.map((s, i) => {
    const imgId = 'nsimg-' + i;
    const prefKey = 'song:' + s.artist.toLowerCase() + '|||' + s.title.toLowerCase();
    newSongImgs.push({ imgId, title: s.title, artist: s.artist, album: s.album, prefKey });
    return `<tr class="${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''}">
      <td class="rank-cell">${i + 1}</td>
      <td class="thumb-cell"><div class="thumb-wrap"><div id="${imgId}"><div class="thumb-initials">${esc(initials(s.title))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="song" data-prefkey="${esc(prefKey)}" data-name="${esc(s.title)}" data-artist="${esc(s.artist)}" data-album="${esc(s.album)}">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div></td>
      <td><div class="song-title">${esc(s.title)}</div><div class="song-artist">${esc(s.artist)}</div></td>
      <td><div class="play-count">${tCount('plays', s.count)}</div><div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(s.count / maxS * 100)}%"></div></div></td>
    </tr>`;
  }).join('');
  loadImages(newSongImgs.map(i => ({ ...i, name: i.title })), 'song');

  // Render new artists
  const newArtistImgs = [];
  document.getElementById('newArtistsBody').innerHTML = newArtists.map((a, i) => {
    const imgId = 'naimg-' + i;
    const prefKey = 'artist:' + a.name.toLowerCase();
    newArtistImgs.push({ imgId, name: a.name, prefKey });
    return `<tr class="${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''} artist-row" data-artist="${esc(a.name)}">
      <td class="rank-cell">${i + 1}</td>
      <td class="thumb-cell"><div class="thumb-wrap"><div id="${imgId}"><div class="thumb-initials">${esc(initials(a.name))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="artist" data-prefkey="${esc(prefKey)}" data-name="${esc(a.name)}" data-artist="${esc(a.name)}" data-album="">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div></td>
      <td><div class="song-title">${esc(a.name)}</div><div class="song-artist">${tCount('songs', a.songs.size)}</div></td>
      <td><div class="play-count">${tCount('plays', a.count)}</div><div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(a.count / maxA * 100)}%"></div></div></td>
    </tr>`;
  }).join('');
  loadImages(newArtistImgs, 'artist');

  // Render new albums
  const newAlbumImgs = [];
  document.getElementById('newAlbumsBody').innerHTML = newAlbums.map((a, i) => {
    const imgId = 'nlimg-' + i;
    const prefKey = 'album:' + a.artist.toLowerCase() + '|||' + a.album.toLowerCase();
    newAlbumImgs.push({ imgId, album: a.album, artist: a.artist, name: a.album, prefKey });
    return `<tr class="${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''} album-row" data-albumkey="${esc(a.album + '|||' + a.artist)}">
      <td class="rank-cell">${i + 1}</td>
      <td class="thumb-cell"><div class="thumb-wrap"><div id="${imgId}"><div class="thumb-initials">${esc(initials(a.album))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="album" data-prefkey="${esc(prefKey)}" data-name="${esc(a.album)}" data-artist="${esc(a.artist)}" data-album="${esc(a.album)}">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div></td>
      <td><div class="song-title">${esc(a.album)}</div><div class="song-artist">${esc(a.artist)}</div></td>
      <td><div class="play-count">${tCount('plays', a.count)}</div><div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(a.count / maxL * 100)}%"></div></div></td>
    </tr>`;
  }).join('');
  loadImages(newAlbumImgs, 'album');
}

// ─── RENDER ────────────────────────────────────────────────────
const isPaginated = () => currentPeriod === 'year' || currentPeriod === 'alltime';

function renderTableHeaders() {
  const isWeeklyView = currentPeriod === 'week';
  const isMonthlyView = currentPeriod === 'month';
  const hasPeriodStats = isWeeklyView || isMonthlyView;
  const periodLabel = isWeeklyView ? t('th_weeks') : t('th_months');
  if (hasPeriodStats) {
    document.getElementById('songsHeadRow').innerHTML = `<th>${t('th_rank')}</th><th style="width:52px;"></th><th>${t('th_title_artist')}</th><th>${t('th_album')}</th><th class="m-th">${t('th_prev')}</th><th class="m-th">${periodLabel}</th><th style="text-align:right;">${t('th_plays')}</th>`;
    document.getElementById('artistsHeadRow').innerHTML = `<th>${t('th_rank')}</th><th style="width:52px;"></th><th>${t('th_artist')}</th><th>${t('th_unique_songs')}</th><th class="m-th">${t('th_prev')}</th><th class="m-th">${periodLabel}</th><th style="text-align:right;">${t('th_total_plays')}</th>`;
    document.getElementById('albumsHeadRow').innerHTML = `<th>${t('th_rank')}</th><th style="width:52px;"></th><th>${t('th_album_artist')}</th><th>${t('th_tracks')}</th><th class="m-th">${t('th_prev')}</th><th class="m-th">${periodLabel}</th><th style="text-align:right;">${t('th_total_plays')}</th>`;
  } else {
    document.getElementById('songsHeadRow').innerHTML = `<th>${t('th_rank')}</th><th style="width:52px;"></th><th>${t('th_title_artist')}</th><th>${t('th_album')}</th><th style="text-align:right;">${t('th_plays')}</th>`;
    document.getElementById('artistsHeadRow').innerHTML = `<th>${t('th_rank')}</th><th style="width:52px;"></th><th>${t('th_artist')}</th><th>${t('th_unique_songs')}</th><th style="text-align:right;">${t('th_total_plays')}</th>`;
    document.getElementById('albumsHeadRow').innerHTML = `<th>${t('th_rank')}</th><th style="width:52px;"></th><th>${t('th_album_artist')}</th><th>${t('th_tracks')}</th><th style="text-align:right;">${t('th_total_plays')}</th>`;
  }
}

function renderAll() {
  if (currentPeriod === 'rawdata') { applyRawFilters(); return; }
  document.body.dataset.period = currentPeriod;
  // Exit early if no data has been loaded yet
  if (!allPlays || allPlays.length === 0) { return; }
  const { start, end, label, sub } = getDateRange();
  const plays = currentPeriod === 'alltime'
    ? allPlays
    : allPlays.filter(p => { const _tp = tzDate(p.date); return _tp >= start && _tp <= end; });

  // Show/hide chart size bar and switch between weekly/monthly size buttons
  const paginated = isPaginated();
  document.getElementById('chartSizeBar').style.display = paginated ? 'none' : 'flex';
  document.getElementById('paginatedSizeBar').style.display = paginated ? 'flex' : 'none';
  document.getElementById('chartDisplayToggles').style.display =
    ['week', 'month', 'year'].includes(currentPeriod) ? 'flex' : 'none';
  document.getElementById('togglePeakTagsBtn').style.display =
    currentPeriod === 'year' ? 'none' : '';
  if (paginated) {
    document.getElementById('sizeBtnsYearly').style.display = currentPeriod === 'year' ? 'flex' : 'none';
    document.getElementById('sizeBtnsAllTime').style.display = currentPeriod === 'alltime' ? 'flex' : 'none';
  }
  // Show/hide search bars; clear search state on period change
  ['songs', 'artists', 'albums'].forEach(t => {
    const el = document.getElementById(t + 'Search');
    if (el) el.style.display = paginated ? 'flex' : 'none';
    if (!paginated) { searchState[t] = ''; const inp = document.getElementById(t + 'SearchInput'); if (inp) inp.value = ''; }
  });
  if (!paginated) {
    const isMonthly = currentPeriod === 'month';
    document.getElementById('sizeBtnsWeekly').style.display = isMonthly ? 'none' : 'flex';
    document.getElementById('sizeBtnsMonthly').style.display = isMonthly ? 'flex' : 'none';
    chartSize = isMonthly ? chartSizeMonthly : chartSizeWeekly;
  }

  // Update date nav
  const pl = document.getElementById('periodLabel');
  pl.innerHTML = `<strong>${label}</strong><span style="font-size:0.68rem;font-family:'DM Mono',monospace;color:var(--text3)">${sub}</span>`;
  document.getElementById('prevBtn').disabled = (currentPeriod === 'alltime');
  document.getElementById('nextBtn').disabled = (currentOffset === 0 || currentPeriod === 'alltime');
  syncPicker();

  // Stats — use split artists for accurate unique artist count
  const artistSet = new Set(plays.flatMap(p => p.artists));
  const songSet = new Set(plays.map(p => songKey(p)));
  const albumSet = new Set(plays.map(p => p.album).filter(a => a && a !== '—'));

  // Compute previous period plays for delta comparison
  let prevPlays = null;
  if (currentPeriod !== 'alltime') {
    let prevStart, prevEnd;
    const _pnow = tzNow();
    if (currentPeriod === 'week') {
      const dow = _pnow.getDay();
      const off = (dow - weekStartDay + 7) % 7;
      const ps = new Date(_pnow.getFullYear(), _pnow.getMonth(), _pnow.getDate() - off - (currentOffset + 1) * 7);
      prevStart = ps;
      prevEnd = new Date(ps.getFullYear(), ps.getMonth(), ps.getDate() + 6, 23, 59, 59, 999);
    } else if (currentPeriod === 'month') {
      const d = new Date(_pnow.getFullYear(), _pnow.getMonth() - currentOffset - 1, 1);
      prevStart = new Date(d.getFullYear(), d.getMonth(), 1);
      prevEnd   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    } else {
      const yr = _pnow.getFullYear() - currentOffset - 1;
      prevStart = new Date(yr, 0, 1);
      prevEnd   = new Date(yr, 11, 31, 23, 59, 59, 999);
    }
    prevPlays = allPlays.filter(p => { const _tp = tzDate(p.date); return _tp >= prevStart && _tp <= prevEnd; });
  }

  // Compute all-time peak stats and peak-at-the-time stats per period type
  let peakStats = null, peakAtTimeStats = null;
  if (currentPeriod !== 'alltime') {
    let cutoffKey;
    if (currentPeriod === 'week') {
      cutoffKey = localDateStr(start); // start is already the week-start fake-local Date
    } else if (currentPeriod === 'month') {
      cutoffKey = start.getFullYear() + '-' + String(start.getMonth() + 1).padStart(2, '0');
    } else {
      cutoffKey = String(start.getFullYear());
    }
    peakStats       = buildPeriodTypePeakStats(currentPeriod);
    peakAtTimeStats = buildPeriodTypePeakStatsUpTo(currentPeriod, cutoffKey);
  }

  // Previous period stat sets
  const prevArtistSet = prevPlays ? new Set(prevPlays.flatMap(p => p.artists)) : null;
  const prevSongSet   = prevPlays ? new Set(prevPlays.map(p => songKey(p))) : null;
  const prevAlbumSet  = prevPlays ? new Set(prevPlays.map(p => p.album).filter(a => a && a !== '—')) : null;

  function statDelta(cur, prevVal) {
    if (prevVal === null) return '';
    const diff = cur - prevVal;
    if (diff > 0) return `<div class="stat-delta up">▲ ${diff.toLocaleString()}</div>`;
    if (diff < 0) return `<div class="stat-delta down">▼ ${Math.abs(diff).toLocaleString()}</div>`;
    return `<div class="stat-delta same">= same</div>`;
  }

  function statBox(val, i18nKey, prevVal, maxAllTime, maxAtTime) {
    const isAllTimePeak  = maxAllTime !== null && val > 0 && val >= maxAllTime;
    const isAtTimePeak   = maxAtTime  !== null && val > 0 && val >= maxAtTime;
    const allTimeBadge   = isAllTimePeak ? `<div class="stat-peak-badge stat-peak-badge-alltime">★ ALL-TIME PEAK</div>` : '';
    const atTimeBadge    = isAtTimePeak  ? `<div class="stat-peak-badge stat-peak-badge-attime">◆ PEAK AT THE TIME</div>` : '';
    const deltaHtml      = statDelta(val, prevVal);
    const boxClass       = isAllTimePeak ? ' stat-peak-alltime' : isAtTimePeak ? ' stat-peak-attime' : '';
    return `<div class="stat-box${boxClass}">
      <div class="stat-val">${val.toLocaleString()}</div>
      <div class="stat-label" data-i18n="${i18nKey}">${t(i18nKey)}</div>
      ${deltaHtml}${allTimeBadge}${atTimeBadge}
    </div>`;
  }

  document.getElementById('statsStrip').innerHTML =
    statBox(plays.length,   'stat_total_plays',  prevPlays     ? prevPlays.length     : null, peakStats ? peakStats.maxPlays   : null, peakAtTimeStats ? peakAtTimeStats.maxPlays   : null) +
    statBox(songSet.size,   'stat_unique_songs',  prevSongSet   ? prevSongSet.size     : null, peakStats ? peakStats.maxSongs   : null, peakAtTimeStats ? peakAtTimeStats.maxSongs   : null) +
    statBox(artistSet.size, 'stat_artists',       prevArtistSet ? prevArtistSet.size   : null, peakStats ? peakStats.maxArtists : null, peakAtTimeStats ? peakAtTimeStats.maxArtists : null) +
    statBox(albumSet.size,  'stat_albums',        prevAlbumSet  ? prevAlbumSet.size    : null, peakStats ? peakStats.maxAlbums  : null, peakAtTimeStats ? peakAtTimeStats.maxAlbums  : null);

  renderTableHeaders();
  const hasPeriodStats = currentPeriod === 'week' || currentPeriod === 'month';
  const colCount = hasPeriodStats ? 7 : 5;

  if (plays.length === 0) {
    ['songsBody', 'artistsBody', 'albumsBody'].forEach(id => {
      document.getElementById(id).innerHTML = `<tr><td colspan="${colCount}"><div class="empty-state"><p>${t('empty_no_plays')}</p></div></td></tr>`;
    });
    ['songsPagination', 'artistsPagination', 'albumsPagination'].forEach(id => {
      document.getElementById(id).style.display = 'none';
    });
    document.getElementById('dropoutsSection').style.display = 'none';
    NEW_ENTRY_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    return;
  }

  const peaks = buildPeaks();
  lastPeaks = peaks;
  cumulativeMaps = null;
  playsPeakMaps = null;
  if (currentPeriod !== 'alltime') {
    const { end } = getDateRange();
    cumulativeMaps = buildCumulativeMapsForPeriod(end);
    playsPeakMaps = buildPlaysPeakMaps(currentPeriod);
  }
  chartRunData = null;
  allChartRun = {};
  allChartRunIsFullHistory = false;
  if (currentPeriod === 'year') {
    buildAllChartRun(); // builds all 3 with offset=0 and sets allChartRunIsFullHistory
  } else if (currentPeriod === 'week' || currentPeriod === 'month') {
    // Build current-period chart run with actual offset for crPreview / album modal
    allChartRun[currentPeriod] = buildChartRun(currentPeriod);
    chartRunData = allChartRun[currentPeriod];
    // The remaining periods + full history are built lazily on first 📊 open
  }

  if (isPaginated()) {
    // Build full sorted datasets and apply chart view limit
    const lim = currentPeriod === 'year' ? chartSizeYearly : chartSizeAllTime;
    fullData.songs = buildSongsFull(plays).slice(0, lim);
    fullData.artists = buildArtistsFull(plays).slice(0, lim);
    fullData.albums = buildAlbumsFull(plays).slice(0, lim);
    // Reset to page 0 when period/year/view changes
    pageState.songs = 0; pageState.artists = 0; pageState.albums = 0;

    const isLimited = isFinite(lim);
    const sizeLabel = isLimited ? `Top ${lim}` : `All`;
    const totalEntries = Math.max(fullData.songs.length, fullData.artists.length, fullData.albums.length);
    const totalPages = Math.ceil(totalEntries / PAGE_SIZE);
    document.getElementById('songsSectionTitle').textContent = isLimited ? t('sec_songs_top', { n: lim }) : t('sec_songs_all', { n: fullData.songs.length.toLocaleString() });
    document.getElementById('artistsSectionTitle').textContent = isLimited ? t('sec_artists_top', { n: lim }) : t('sec_artists_all', { n: fullData.artists.length.toLocaleString() });
    document.getElementById('albumsSectionTitle').textContent = isLimited ? t('sec_albums_top', { n: lim }) : t('sec_albums_all', { n: fullData.albums.length.toLocaleString() });

    lastPeriodStats = null;
    renderPage('songs', peaks);
    renderPage('artists', peaks);
    renderPage('albums', peaks);
    document.getElementById('dropoutsSection').style.display = 'none';
  } else {
    // Top-N mode
    ['songsPagination', 'artistsPagination', 'albumsPagination'].forEach(id => {
      document.getElementById(id).style.display = 'none';
    });
    document.getElementById('songsSectionTitle').textContent = t('sec_songs_top', { n: chartSize });
    document.getElementById('artistsSectionTitle').textContent = t('sec_artists_top', { n: chartSize });
    document.getElementById('albumsSectionTitle').textContent = t('sec_albums_top', { n: chartSize });
    const periodStats = hasPeriodStats ? buildPeriodStats(currentPeriod) : null;
    lastPeriodStats = periodStats;
    renderSongs(plays, peaks, periodStats);
    renderArtists(plays, peaks, periodStats);
    renderAlbums(plays, peaks, periodStats);
    renderDropouts(plays, periodStats);
  }
  renderNewEntries(plays, start, end);
  updateExportBtn();
  updateShareBtns();
}

// ─── TIE-BREAKING SORT ─────────────────────────────────────────
// rankSort: count → timestamp (used for all-time / yearly where no period context exists)
function rankSort(a, b) {
  if (b.count !== a.count) return b.count - a.count;
  return a.firstAchieved - b.firstAchieved;
}

// rankSortWithStatus: count → chart status → timestamp (used for weekly / monthly renders)
// chartStatus: 0 = incumbent (was on chart last period)
//              1 = re-entry  (charted before, but not last period)
//              2 = debut     (never charted before)
function rankSortWithStatus(a, b) {
  if (b.count !== a.count) return b.count - a.count;
  if (a.chartStatus !== b.chartStatus) return a.chartStatus - b.chartStatus;
  return a.firstAchieved - b.firstAchieved;
}

// ─── FULL DATASET BUILDERS (for paginated yearly/alltime) ──────
function buildSongsFull(plays) {
  const counts = {};
  for (const p of plays) {
    const k = songKey(p);
    if (!counts[k]) counts[k] = { title: p.title, artist: p.artist, album: p.album, count: 0, _albums: {}, firstAchieved: p.date };
    counts[k].count++;
    counts[k]._albums[p.album] = (counts[k]._albums[p.album] || 0) + 1;
  }
  for (const entry of Object.values(counts)) {
    entry.album = bestAlbum(entry.title, entry._albums);
    delete entry._albums;
  }
  return Object.values(counts).sort(rankSort);
}

function buildArtistsFull(plays) {
  const counts = {};
  for (const p of plays) {
    for (const artist of p.artists) {
      if (!counts[artist]) counts[artist] = { name: artist, count: 0, songs: new Set(), firstAchieved: p.date };
      counts[artist].count++;
      counts[artist].songs.add(p.title);
    }
  }
  return Object.values(counts).sort(rankSort);
}

function buildAlbumsFull(plays) {
  const counts = {};
  for (const p of plays) {
    if (!p.album || p.album === '—') continue;
    const k = p.album + '|||' + albumArtist(p);
    if (!counts[k]) counts[k] = { album: p.album, artist: albumArtist(p), count: 0, tracks: new Set(), firstAchieved: p.date };
    counts[k].count++;
    counts[k].tracks.add(p.title);
  }
  return Object.values(counts).sort(rankSort);
}

// ─── PAGE RENDERING ────────────────────────────────────────────
function renderPage(type, peaks) {
  const allData = fullData[type];
  const data = filteredData(type);
  const isFiltered = searchState[type].length > 0;
  const page = pageState[type];
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const slice = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const max = allData[0]?.count || 1;

  // Update search count
  const countEl = document.getElementById(type + 'SearchCount');
  if (countEl) countEl.textContent = isFiltered ? t(data.length === 1 ? 'search_result' : 'search_results', { n: data.length }) : '';

  const paginationEl = document.getElementById(type + 'Pagination');
  const labelEl = document.getElementById(type + 'PageLabel');
  if (isFiltered) {
    labelEl.textContent = data.length === 0 ? t('empty_no_results') : t(data.length === 1 ? 'search_result' : 'search_results', { n: data.length });
    paginationEl.style.display = data.length > PAGE_SIZE ? 'flex' : 'none';
  } else {
    const globalOffset = page * PAGE_SIZE;
    const start = globalOffset + 1;
    const end = Math.min(globalOffset + PAGE_SIZE, allData.length);
    labelEl.textContent = `#${start}–#${end} of ${allData.length.toLocaleString()}`;
    paginationEl.style.display = 'flex';
  }
  if (paginationEl.style.display === 'flex') {
    paginationEl.querySelectorAll('button')[0].disabled = (page === 0);
    paginationEl.querySelectorAll('button')[1].disabled = (page >= totalPages - 1);
  }

  // rank = actual position in full (unfiltered) dataset, always
  const rankMap = new Map(allData.map((item, i) => [item, i + 1]));
  const rankOf = (item) => rankMap.get(item) || 0;

  const hasCR = (currentPeriod === 'year');
  if (type === 'songs') {
    const imgItems = [];
    document.getElementById('songsBody').innerHTML = slice.flatMap((s, i) => {
      const rank = rankOf(s);
      const imgId = 'simg-' + i;
      const prefKey = 'song:' + s.artist.toLowerCase() + '|||' + s.title.toLowerCase();
      const k = songKey(s);
      const rowId = 'crr-ysong-' + i;
      imgItems.push({ imgId, title: s.title, artist: s.artist, album: s.album, prefKey });
      const cumSongPlays = cumulativeMaps ? (cumulativeMaps.songs[k] || s.count) : s.count;
      const cumAlbumPlays = cumulativeMaps && s.album ? (cumulativeMaps.albumsByName[s.album] || 0) : 0;
      const histMaxSong = playsPeakMaps ? (playsPeakMaps.songs[k] || 0) : 0;
      const isPlaysPeak = histMaxSong > 0 && s.count >= histMaxSong;
      const mainRow = `<tr class="${rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : ''}">
        <td class="rank-cell">${hasCR ? `<button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_song')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button>` : ''} ${rank}</td>
        <td class="thumb-cell"><div class="thumb-wrap"><div id="${imgId}"><div class="thumb-initials">${esc(initials(s.title))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="song" data-prefkey="${esc(prefKey)}" data-name="${esc(s.title)}" data-artist="${esc(s.artist)}" data-album="${esc(s.album)}">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div></td>
        <td>
          <div class="song-title">${esc(s.title)}${certBadge(cumSongPlays, 'song')}</div>
          <div class="song-artist">${esc(s.artist)}</div>
        </td>
        <td><div class="song-album">${esc(s.album)}${cumAlbumPlays ? certBadge(cumAlbumPlays, 'album') : ''}</div></td>
        <td>
          <div class="play-count">${isPlaysPeak ? playsPeakBadge() : ''}${tCount('plays', s.count)}</div>
          <div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(s.count / max * 100)}%"></div></div>
        </td>
      </tr>`;
      if (!hasCR) return [mainRow];
      return [mainRow, `<tr class="cr-row" id="${rowId}"><td colspan="5"><div class="cr-panel" data-crtype="songs" data-crkey="${encodeURIComponent(k)}">${buildCrPanelHTML('songs', k)}</div></td></tr>`];
    }).join('');
    loadImages(imgItems.map(i => ({ ...i, name: i.title })), 'song');

  } else if (type === 'artists') {
    const imgItems = [];
    document.getElementById('artistsBody').innerHTML = slice.flatMap((a, i) => {
      const rank = rankOf(a);
      const imgId = 'aimg-' + i;
      const prefKey = 'artist:' + a.name.toLowerCase();
      const rowId = 'crr-yartist-' + i;
      imgItems.push({ imgId, name: a.name, prefKey });
      const histMaxArtist = playsPeakMaps ? (playsPeakMaps.artists[a.name] || 0) : 0;
      const isArtistPlaysPeak = histMaxArtist > 0 && a.count >= histMaxArtist;
      const mainRow = `<tr class="${rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : ''} artist-row" data-artist="${esc(a.name)}">
        <td class="rank-cell">${hasCR ? `<button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_artist')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button>` : ''} ${rank}</td>
        <td class="thumb-cell"><div class="thumb-wrap"><div id="${imgId}"><div class="thumb-initials">${esc(initials(a.name))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="artist" data-prefkey="${esc(prefKey)}" data-name="${esc(a.name)}" data-artist="${esc(a.name)}" data-album="">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div></td>
        <td><div class="song-title">${esc(a.name)}</div><div class="song-artist" style="font-size:0.7rem;letter-spacing:0.06em;font-style:normal;font-family:'DM Mono',monospace;color:var(--text3)">${t('click_view_profile')}</div></td>
        <td><div class="song-artist">${tCount('songs', a.songs.size)}</div></td>
        <td>
          <div class="play-count">${isArtistPlaysPeak ? playsPeakBadge() : ''}${tCount('plays', a.count)}</div>
          <div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(a.count / max * 100)}%"></div></div>
        </td>
      </tr>`;
      if (!hasCR) return [mainRow];
      return [mainRow, `<tr class="cr-row" id="${rowId}"><td colspan="5"><div class="cr-panel" data-crtype="artists" data-crkey="${encodeURIComponent(a.name)}">${buildCrPanelHTML('artists', a.name)}</div></td></tr>`];
    }).join('');
    loadImages(imgItems, 'artist');

  } else if (type === 'albums') {
    const imgItems = [];
    if (slice.length === 0) {
      document.getElementById('albumsBody').innerHTML = `<tr><td colspan="5"><div class="empty-state"><p>${t('empty_no_album_data')}</p></div></td></tr>`;
    } else {
      document.getElementById('albumsBody').innerHTML = slice.flatMap((a, i) => {
        const rank = rankOf(a);
        const imgId = 'limg-' + i;
        const ak = a.album + '|||' + a.artist;
        const prefKey = 'album:' + a.artist.toLowerCase() + '|||' + a.album.toLowerCase();
        const rowId = 'crr-yalbum-' + i;
        const hasCR = chartRunData && !!chartRunData.result.albums[ak];
        imgItems.push({ imgId, album: a.album, artist: a.artist, name: a.album, prefKey });
        const cumAlbumPlays = cumulativeMaps ? (cumulativeMaps.albums[ak] || a.count) : a.count;
        const histMaxAlbum = playsPeakMaps ? (playsPeakMaps.albums[ak] || 0) : 0;
        const isAlbumPlaysPeak = histMaxAlbum > 0 && a.count >= histMaxAlbum;
        const mainRow = `<tr class="${rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : ''} album-row" data-albumkey="${esc(ak)}">
        <td class="rank-cell">${hasCR ? `<button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_album')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button>` : ''} ${rank}</td>
        <td class="thumb-cell"><div class="thumb-wrap"><div id="${imgId}"><div class="thumb-initials">${esc(initials(a.album))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="album" data-prefkey="${esc(prefKey)}" data-name="${esc(a.album)}" data-artist="${esc(a.artist)}" data-album="${esc(a.album)}">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div></td>
        <td>
          <div class="song-title">${esc(a.album)}${certBadge(cumAlbumPlays, 'album')}</div>
          <div class="song-artist">${esc(a.artist)}</div>
          <div class="song-artist" style="font-size:0.65rem;letter-spacing:0.06em;font-style:normal;font-family:'DM Mono',monospace;color:var(--text3)">${t('click_view_album')}</div>
        </td>
        <td><div class="song-artist">${tCount('tracks', a.tracks.size)}</div></td>
        <td>
          <div class="play-count">${isAlbumPlaysPeak ? playsPeakBadge() : ''}${tCount('plays', a.count)}</div>
          <div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(a.count / max * 100)}%"></div></div>
        </td>
      </tr>`;
        if (!hasCR) return [mainRow];
        return [mainRow, `<tr class="cr-row" id="${rowId}"><td colspan="5"><div class="cr-panel" data-crtype="albums" data-crkey="${encodeURIComponent(ak)}">${buildCrPanelHTML('albums', ak)}</div></td></tr>`];
      }).join('');
    }
    loadImages(imgItems, 'album');
  }
}

function applySearch(type) {
  const q = document.getElementById(type + 'SearchInput').value.trim().toLowerCase();
  searchState[type] = q;
  pageState[type] = 0;
  const peaks = buildPeaks();
  renderPage(type, peaks);
}

function clearSearch(type) {
  document.getElementById(type + 'SearchInput').value = '';
  searchState[type] = '';
  pageState[type] = 0;
  const peaks = buildPeaks();
  renderPage(type, peaks);
}

function filteredData(type) {
  const q = searchState[type];
  if (!q) return fullData[type];
  if (type === 'songs') return fullData[type].filter(s =>
    s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) || (s.album || '').toLowerCase().includes(q));
  if (type === 'artists') return fullData[type].filter(a => a.name.toLowerCase().includes(q));
  if (type === 'albums') return fullData[type].filter(a =>
    a.album.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q));
  return fullData[type];
}

function changePage(type, dir) {
  const data = fullData[type];
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  pageState[type] = Math.max(0, Math.min(totalPages - 1, pageState[type] + dir));
  const peaks = buildPeaks();
  renderPage(type, peaks);
  // Scroll to the top of that section's table
  const titles = { songs: 'songsSectionTitle', artists: 'artistsSectionTitle', albums: 'albumsSectionTitle' };
  document.getElementById(titles[type]).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── CHART RUN ─────────────────────────────────────────────────
// Builds per-item chart run history for the current period type.
// Weekly → history of weekly ranks; Monthly → monthly; Yearly → yearly.
// Stored in chartRunData for use by toggle expand rows.
let chartRunData = null;
let allChartRun = {};
let allChartRunIsFullHistory = false; // true only when all 3 built with offset=0
const crRangeModes = {}; // per-entry: keyed by type+'|'+key
function getCrRangeMode(type, key) { return crRangeModes[type + '|' + key] || 'now'; }

function getViewedYear() {
  const now = tzNow();
  if (currentPeriod === 'year') return now.getFullYear() - currentOffset;
  if (currentPeriod === 'month') return new Date(now.getFullYear(), now.getMonth() - currentOffset, 1).getFullYear();
  if (currentPeriod === 'week') {
    const dow = now.getDay();
    const offset = (dow - weekStartDay + 7) % 7;
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset - currentOffset * 7);
    return weekStart.getFullYear();
  }
  return now.getFullYear();
}

function getViewedCutoffKeys() {
  const now = tzNow();
  let weekKey, monthKey, yearKey;
  if (currentPeriod === 'week') {
    const dow = now.getDay();
    const offset = (dow - weekStartDay + 7) % 7;
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset - currentOffset * 7);
    weekKey = localDateStr(weekStart);
    monthKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}`;
    yearKey = String(weekStart.getFullYear());
  } else if (currentPeriod === 'month') {
    const d = new Date(now.getFullYear(), now.getMonth() - currentOffset, 1);
    yearKey = String(d.getFullYear());
    monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    lastDay.setDate(lastDay.getDate() - lastDay.getDay());
    weekKey = localDateStr(lastDay);
  } else {
    const yr = now.getFullYear() - currentOffset;
    yearKey = String(yr);
    monthKey = `${yr}-12`;
    const lastDay = new Date(yr, 11, 31);
    lastDay.setDate(lastDay.getDate() - lastDay.getDay());
    weekKey = localDateStr(lastDay);
  }
  return { year: yearKey, month: monthKey, week: weekKey };
}

function filterCrD(d, period, mode, viewedYear, cutoffKeys) {
  if (!d || mode === 'now') return d;
  let entries;
  if (mode === 'year') {
    if (period === 'year') {
      entries = d.entries.filter(e => parseInt(e.periodKey) === viewedYear);
    } else if (period === 'month') {
      const startKey = `${viewedYear}-01`;
      const endKey = cutoffKeys?.month || `${viewedYear}-12`;
      entries = d.entries.filter(e => e.periodKey >= startKey && e.periodKey <= endKey);
    } else { // week — YTD: Jan 1 of viewedYear through the viewed week
      const startKey = `${viewedYear}-`;
      const endKey = cutoffKeys?.week || `${viewedYear}-12-31`;
      entries = d.entries.filter(e => e.periodKey >= startKey && e.periodKey <= endKey);
    }
  } else { // uptoYear
    if (period === 'year') {
      entries = d.entries.filter(e => parseInt(e.periodKey) <= viewedYear);
    } else if (period === 'month') {
      const endKey = cutoffKeys?.month || `${viewedYear}-12`;
      entries = d.entries.filter(e => e.periodKey <= endKey);
    } else { // week — all time up to the viewed week
      const endKey = cutoffKeys?.week || `${viewedYear}-12-31`;
      entries = d.entries.filter(e => e.periodKey <= endKey);
    }
  }
  if (!entries || !entries.length) return null;
  const peak = Math.min(...entries.map(e => e.rank));
  const peakPlays = Math.max(0, ...entries.map(e => e.plays || 0));
  const peakDays = Math.max(0, ...entries.map(e => e.days || 0));
  return { ...d, entries, peak, peakPlays, peakDays };
}

// Resolves the current chart rank for a key then opens the share modal
function openCrIgModalFromPanel(type, encodedKey) {
  const key = decodeURIComponent(encodedKey);
  let rank = 0;
  const fd = fullData[type === 'songs' ? 'songs' : type === 'artists' ? 'artists' : 'albums'];
  if (fd) {
    const idx = fd.findIndex(x =>
      type === 'songs' ? songKey(x) === key :
        type === 'artists' ? x.name === key :
          (x.album + '|||' + x.artist) === key
    );
    if (idx >= 0) rank = idx + 1;
  }
  openCrIgModal(type, encodedKey, rank);
}

function buildCrPanelHTML(type, key) {
  ensureAllChartRun(); // guarantees allChartRun has full history for "All-Time" mode
  const vy = getViewedYear();
  const cutoffKeys = getViewedCutoffKeys();
  let modeLabels;
  if (currentPeriod === 'week') {
    modeLabels = { year: t('cr_ytd', { year: vy }), uptoYear: t('cr_up_to_this_week'), now: t('cr_all_time') };
  } else if (currentPeriod === 'month') {
    modeLabels = { year: t('cr_ytd', { year: vy }), uptoYear: t('cr_up_to_this_month'), now: t('cr_all_time') };
  } else {
    modeLabels = { year: t('cr_year_only_label', { year: vy }), uptoYear: t('cr_up_to_year_label', { year: vy }), now: t('cr_all_time') };
  }
  const headerHtml = `<div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border);">
    <div style="font-family:'DM Mono',monospace;font-size:0.65rem;font-weight:700;letter-spacing:0.18em;color:var(--text);text-transform:uppercase;">${t('cr_chart_run')}</div>
    <div style="font-family:'DM Mono',monospace;font-size:0.54rem;letter-spacing:0.07em;color:var(--text3);margin-top:2px;">${t('cr_rank_history')}</div>
  </div>`;
  const toggleHtml = `<div class="cr-range-bar">
    <span class="cr-range-label">${t('cr_range')}</span>
    ${['year', 'uptoYear', 'now'].map(m =>
    `<button class="cr-range-btn${getCrRangeMode(type, key) === m ? ' active' : ''}" onclick="setCrRangeMode('${m}','${type}','${encodeURIComponent(key)}');event.stopPropagation()">${modeLabels[m]}</button>`
  ).join('')}
    <button class="cr-ig-share-btn" style="margin-left:auto;" onclick="openCrIgModalFromPanel('${type}','${encodeURIComponent(key)}');event.stopPropagation()">${t('cr_share_btn')}</button>
  </div>`;

  let sectionsHtml = '';
  if (currentPeriod === 'year') {
    sectionsHtml = [
      { id: 'year', label: t('cr_yearly_label') },
      { id: 'month', label: t('cr_monthly_label') },
      { id: 'week', label: t('cr_weekly_label') },
    ].map(({ id, label }) => {
      const crData = allChartRun[id];
      const rawD = crData?.result?.[type]?.[key];
      const d = filterCrD(rawD, id, getCrRangeMode(type, key), vy, cutoffKeys);
      return `<div class="cr-panel-section">
        <div class="cr-panel-section-title">${label}</div>
        ${d ? `<div class="cr-stats">${crStats(type, key, id, null, d)}</div>${crBoxesHTML(type, key, null, d, id)}` : `<div style="font-size:0.6rem;color:var(--text3);padding:2px 0">${t('cr_no_history')}</div>`}
      </div>`;
    }).join('');
  } else {
    const crData = allChartRun[currentPeriod] || chartRunData;
    const rawD = crData?.result?.[type]?.[key];
    const d = filterCrD(rawD, currentPeriod, getCrRangeMode(type, key), vy, cutoffKeys);
    sectionsHtml = d
      ? `<div class="cr-stats">${crStats(type, key, currentPeriod, null, d)}</div>${crBoxesHTML(type, key, null, d, currentPeriod)}`
      : `<div style="font-size:0.6rem;color:var(--text3);padding:4px 0">${t('cr_no_history')}</div>`;
  }
  return headerHtml + toggleHtml + sectionsHtml;
}

function setCrRangeMode(mode, type, encodedKey) {
  const key = decodeURIComponent(encodedKey);
  crRangeModes[type + '|' + key] = mode;
  const panel = document.querySelector(`.cr-row.open .cr-panel[data-crtype="${type}"][data-crkey="${encodedKey}"]`);
  if (panel) panel.innerHTML = buildCrPanelHTML(type, key);
}

function buildChartRun(period) {
  const now = tzNow();
  let curKey;
  if (period === 'week') curKey = currentViewWeekKey();
  else if (period === 'month') {
    const d = new Date(now.getFullYear(), now.getMonth() - currentOffset, 1);
    curKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  } else curKey = String(now.getFullYear() - currentOffset);

  const periodMap = {};
  for (const p of allPlays) {
    let key;
    const _ptd = tzDate(p.date);
    if (period === 'week') key = playWeekKey(p.date);
    else if (period === 'month') key = `${_ptd.getFullYear()}-${String(_ptd.getMonth() + 1).padStart(2, '0')}`;
    else key = String(_ptd.getFullYear());
    if (key > curKey) continue;
    if (!periodMap[key]) periodMap[key] = { songs: {}, artists: {}, albums: {}, daySongs: {}, dayArtists: {}, dayAlbums: {}, yrMonths: null };
    const pm = periodMap[key];
    const dayStr = localDateStr(_ptd);
    const sk = songKey(p);
    if (!pm.songs[sk]) { pm.songs[sk] = { count: 0, firstAchieved: p.date, _title: p.title, _artist: p.artist }; pm.daySongs[sk] = new Set(); }
    pm.songs[sk].count++; pm.daySongs[sk].add(dayStr);
    for (const a of p.artists) {
      if (!pm.artists[a]) { pm.artists[a] = { count: 0, firstAchieved: p.date }; pm.dayArtists[a] = new Set(); }
      pm.artists[a].count++; pm.dayArtists[a].add(dayStr);
    }
    const ak = p.album + '|||' + albumArtist(p);
    if (!pm.albums[ak]) { pm.albums[ak] = { count: 0, firstAchieved: p.date, _album: p.album, _artist: albumArtist(p) }; pm.dayAlbums[ak] = new Set(); }
    pm.albums[ak].count++; pm.dayAlbums[ak].add(dayStr);
    // For yearly: track unique months per item per year
    if (period === 'year') {
      if (!pm.yrMonths) pm.yrMonths = { songs: {}, artists: {}, albums: {} };
      const mo = _ptd.getMonth();
      if (!pm.yrMonths.songs[sk]) pm.yrMonths.songs[sk] = new Set();
      pm.yrMonths.songs[sk].add(mo);
      for (const a of p.artists) {
        if (!pm.yrMonths.artists[a]) pm.yrMonths.artists[a] = new Set();
        pm.yrMonths.artists[a].add(mo);
      }
      if (!pm.yrMonths.albums[ak]) pm.yrMonths.albums[ak] = new Set();
      pm.yrMonths.albums[ak].add(mo);
    }
  }

  const result = { songs: {}, artists: {}, albums: {} };
  const dayFields = { songs: 'daySongs', artists: 'dayArtists', albums: 'dayAlbums' };
  // Track prev-period chart and ever-charted sets so we can assign chartStatus
  // exactly as the render functions do, making box ranks match displayed ranks.
  const prevChartKeys = { songs: new Set(), artists: new Set(), albums: new Set() };
  const everChartedKeys = { songs: new Set(), artists: new Set(), albums: new Set() };
  for (const pk of Object.keys(periodMap).sort()) {
    const pm = periodMap[pk];
    const lbl = crPeriodLabel(period, pk);
    for (const type of ['songs', 'artists', 'albums']) {
      // Assign chartStatus to each item for this period
      for (const [k, data] of Object.entries(pm[type])) {
        data.chartStatus = prevChartKeys[type].has(k) ? 0 : everChartedKeys[type].has(k) ? 1 : 2;
      }
      const ranked = Object.entries(pm[type]).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, period === 'year' ? Infinity : chartSize);
      // Update prev/ever sets for next period
      const newPrevKeys = new Set();
      ranked.forEach(([k]) => { newPrevKeys.add(k); everChartedKeys[type].add(k); });
      prevChartKeys[type] = newPrevKeys;
      ranked.forEach(([k, data], i) => {
        const rank = i + 1;
        const days = pm[dayFields[type]][k]?.size || 0;
        if (!result[type][k]) result[type][k] = {
          entries: [], peak: rank, peakPlays: 0, peakDays: 0, peakMonths: 0,
          _title: data._title, _artist: data._artist, _album: data._album
        };
        result[type][k].entries.push({ periodKey: pk, label: lbl, rank, plays: data.count, days });
        if (rank < result[type][k].peak) result[type][k].peak = rank;
        if (data.count > result[type][k].peakPlays) result[type][k].peakPlays = data.count;
        if (days > result[type][k].peakDays) result[type][k].peakDays = days;
        if (period === 'year' && pm.yrMonths) {
          const mos = pm.yrMonths[type][k]?.size || 0;
          if (mos > result[type][k].peakMonths) result[type][k].peakMonths = mos;
        }
      });
    }
  }
  chartRunData = { period, curKey, periodMap, result };
  return chartRunData;
}

function buildAllChartRun() {
  const savedOffset = currentOffset;
  currentOffset = 0; // build all 3 through today regardless of current view
  allChartRun.year = buildChartRun('year');
  allChartRun.month = buildChartRun('month');
  allChartRun.week = buildChartRun('week');
  currentOffset = savedOffset;
  allChartRunIsFullHistory = true;
  chartRunData = allChartRun[currentPeriod] || allChartRun.year;
}

function ensureAllChartRun() {
  // Only skip rebuild if we already have full history (offset=0 for all 3)
  if (allChartRunIsFullHistory) return;
  buildAllChartRun();
}

const _CR_MON_SHORT = ['month_jan','month_feb','month_mar','month_apr','month_may_short','month_jun','month_jul','month_aug','month_sep','month_oct','month_nov','month_dec'];
const _CR_MON_LONG  = ['month_january','month_february','month_march','month_april','month_may','month_june','month_july','month_august','month_september','month_october','month_november','month_december'];

function crPeriodLabel(period, key) {
  if (period === 'week') {
    const d = new Date(key + 'T00:00:00');
    const mon = t(_CR_MON_SHORT[d.getMonth()]);
    return `${mon} ${d.getDate()}, ${String(d.getFullYear()).slice(-2)}`;
  } else if (period === 'month') {
    const [y, m] = key.split('-');
    const mon = t(_CR_MON_SHORT[+m - 1]);
    return `${mon} ${String(+y).slice(-2)}`;
  } else return key;
}

function crPeriodTitle(period, key) {
  if (period === 'week') {
    const d = new Date(key + 'T00:00:00');
    return t('period_week_of', { date: fmt(d) });
  } else if (period === 'month') {
    const [y, m] = key.split('-');
    return t(_CR_MON_LONG[+m - 1]) + ' ' + y;
  } else return key;
}

function crStats(type, key, period, crData, preD) {
  const data = crData || chartRunData;
  const d = preD !== undefined ? preD : (data?.result?.[type]?.[key]);
  if (!d) return '';
  const n = d.entries.length;
  const peak = d.peak;
  const top1 = d.entries.filter(e => e.rank === 1).length;
  const top5 = d.entries.filter(e => e.rank <= 5).length;
  const top10 = d.entries.filter(e => e.rank <= 10).length;
  const crPeriodUnit = (p, count) => p === 'week' ? tUnit('weeks', count) : p === 'month' ? tUnit('months', count) : tUnit('years', count);
  const peakLabel = t('peak_label');
  let html = `
    <div class="cr-stat"><strong>${n} ${crPeriodUnit(period, n)}</strong>${t('cr_on_chart')}</div>
    <div class="cr-stat"><strong>${peakLabel} #${peak}</strong></div>
    ${top1 ? `<div class="cr-stat"><strong>${top1} ${crPeriodUnit(period, top1)}</strong>${t('cr_at_1')}</div>` : ''}
    ${top5 ? `<div class="cr-stat"><strong>${top5} ${crPeriodUnit(period, top5)}</strong>${t('cr_in_top5')}</div>` : ''}
    ${top10 ? `<div class="cr-stat"><strong>${top10} ${crPeriodUnit(period, top10)}</strong>${t('cr_in_top10')}</div>` : ''}`;
  if (period === 'month') {
    html += `
    <div class="cr-stat"><strong>${d.peakPlays}</strong>${t('cr_peak_plays_month')}</div>
    <div class="cr-stat"><strong>${d.peakDays}</strong>${t('cr_peak_days_month')}</div>`;
  } else if (period === 'year') {
    html += `
    <div class="cr-stat"><strong>${d.peakMonths}</strong>${t('cr_months_peak_year')}</div>
    <div class="cr-stat"><strong>${d.peakDays}</strong>${t('cr_days_peak_year')}</div>`;
  }
  return html;
}

function crPeriodGap(period, keyA, keyB) {
  // Returns number of chart periods between keyA and keyB (exclusive), i.e. gap - 1
  if (period === 'week') {
    const a = new Date(keyA + 'T00:00:00'), b = new Date(keyB + 'T00:00:00');
    return Math.round((b - a) / (7 * 86400000)) - 1;
  } else if (period === 'month') {
    const [ay, am] = keyA.split('-').map(Number);
    const [by, bm] = keyB.split('-').map(Number);
    return (by - ay) * 12 + (bm - am) - 1;
  } else {
    return parseInt(keyB) - parseInt(keyA) - 1;
  }
}

function rec1sBoxesHTML(periods, pt) {
  if (!periods || !periods.length) return '';
  const unit = function(gap) { return pt === 'week' ? tUnit('weeks', gap) : pt === 'month' ? tUnit('months', gap) : tUnit('years', gap); };
  const boxes = periods.flatMap(function(pk, i) {
    const box = '<div class="cr-box cr-box-peak rec-1s-box" onclick="navigateToRecPeriod(\'' + pt + '\',\'' + pk + '\')">'
      + '<div class="cr-box-rank">#1</div>'
      + '<div class="cr-box-label">' + esc(crPeriodLabel(pt, pk)) + '</div>'
      + '</div>';
    if (i === 0) return [box];
    const gap = crPeriodGap(pt, periods[i - 1], pk);
    if (gap <= 0) return [box];
    const gapEl = '<div class="cr-box-gap"><div class="cr-box-gap-label">✕' + gap + '</div><div class="cr-box-gap-unit">' + unit(gap) + '</div></div>';
    return [gapEl, box];
  }).join('');
  return '<div class="cr-boxes-wrap"><div class="cr-boxes">' + boxes + '</div></div>';
}

function toggleRecRun(btn, runId) {
  const row = document.getElementById(runId);
  if (!row) return;
  const open = row.classList.toggle('open');
  btn.classList.toggle('active', open);
  btn.textContent = open ? '▾' : '▸';
}

function crBoxesHTML(type, key, crData, preD, periodOverride) {
  const data = crData || chartRunData;
  const d = preD !== undefined ? preD : (data?.result?.[type]?.[key]);
  if (!d) return '<div style="font-size:0.6rem;color:var(--text3);padding:4px 0">No chart history yet.</div>';
  const period = periodOverride || data?.period || currentPeriod;
  const safeKey = encodeURIComponent(key);
  const unit = (gap) => period === 'week' ? tUnit('weeks', gap) : period === 'month' ? tUnit('months', gap) : tUnit('years', gap);
  const boxes = d.entries.flatMap((e, i) => {
    const isPeak = (e.rank === d.peak);
    const cls = isPeak ? 'cr-box cr-box-peak' : 'cr-box';
    const box = `<div class="${cls}" onclick="showCrPreview('${esc(e.periodKey)}','${type}','${safeKey}',this,'${period}')">
      <div class="cr-box-rank">#${e.rank}</div>
      <div class="cr-box-label">${esc(crPeriodLabel(period, e.periodKey))}</div>
    </div>`;
    if (i === 0) return [box];
    const gap = crPeriodGap(period, d.entries[i - 1].periodKey, e.periodKey);
    if (gap <= 0) return [box];
    const gapEl = `<div class="cr-box-gap"><div class="cr-box-gap-label">✕${gap}</div><div class="cr-box-gap-unit">${unit(gap)}</div></div>`;
    return [gapEl, box];
  }).join('');
  return `<div class="cr-boxes-wrap"><div class="cr-boxes">${boxes}</div></div>`;
}

function toggleChartRun(btn, rowId) {
  event.stopPropagation();
  const row = document.getElementById(rowId);
  if (!row) return;
  const open = !row.classList.contains('open');
  row.classList.toggle('open', open);
  btn.classList.toggle('active', open);
}

function toggleAppCr(rowId, btn) {
  const row = document.getElementById(rowId);
  if (!row) return;
  const isOpen = row.style.display !== 'none';
  row.style.display = isOpen ? 'none' : '';
  btn.classList.toggle('active', !isOpen);
  btn.textContent = isOpen ? '▶' : '▼';
}

function toggleAllRecRuns(tableId, btn) {
  event.stopPropagation();
  const table = document.getElementById(tableId);
  if (!table) return;
  const detailRows = table.querySelectorAll('tr.rec-run-detail');
  const toggleBtns = table.querySelectorAll('button.rec-run-toggle-btn');
  const anyOpen = Array.from(detailRows).some(r => r.classList.contains('open'));
  detailRows.forEach(r => r.classList.toggle('open', !anyOpen));
  toggleBtns.forEach(b => { b.classList.toggle('active', !anyOpen); b.textContent = anyOpen ? '▸' : '▾'; });
  btn.classList.toggle('active', !anyOpen);
  btn.textContent = anyOpen ? '▸▸' : '▾▾';
}

function toggleAllAppCr(tableId, btn) {
  event.stopPropagation();
  const table = document.getElementById(tableId);
  if (!table) return;
  const crRows = table.querySelectorAll('tr.app-cr-row');
  const crBtns = table.querySelectorAll('button.rec-cr-toggle');
  const anyOpen = Array.from(crRows).some(r => r.style.display !== 'none');
  crRows.forEach(r => { r.style.display = anyOpen ? 'none' : ''; });
  crBtns.forEach(b => { b.classList.toggle('active', !anyOpen); b.textContent = anyOpen ? '▶' : '▼'; });
  btn.classList.toggle('active', !anyOpen);
  btn.textContent = anyOpen ? '▶▶' : '▼▼';
}

let _crPreviewCleanup = null;
function showCrPreview(periodKey, type, encodedKey, boxEl, periodName) {
  hideCrPreview();
  const crData = (periodName && allChartRun[periodName]) || chartRunData;
  if (!crData || !crData.periodMap[periodKey]) return;
  const key = decodeURIComponent(encodedKey);
  const pm = crData.periodMap[periodKey];
  const period = crData.period;
  const title = crPeriodTitle(period, periodKey);
  const typeLabels = { songs: t('rec_th_songs'), artists: t('rec_th_artists'), albums: t('rec_th_albums') };
  const ranked = Object.entries(pm[type]).sort(([, a], [, b]) => rankSort(a, b)).slice(0, Math.min(chartSize, 25));
  let items = ranked.map(([k, data], i) => {
    const rank = i + 1;
    const isActive = (k === key);
    let name;
    if (type === 'songs') name = data._title || k.split('|||')[0];
    else if (type === 'albums') name = data._album || k.split('|||')[0];
    else name = k;
    return `<div class="cr-preview-item${isActive ? ' highlighted' : ''}"><span class="cr-preview-rank">#${rank}</span><span>${esc(name)}</span></div>`;
  }).join('');
  const popup = document.createElement('div');
  popup.className = 'cr-preview';
  popup.id = 'crPreviewPopup';
  popup.style.position = 'fixed';
  popup.innerHTML = `<button class="cr-preview-close" onclick="hideCrPreview()">✕</button><div class="cr-preview-title"><a class="cr-preview-link" href="javascript:void(0)" onclick="navigateToCrChart('${period}','${periodKey}')">${esc(title)}</a> · ${typeLabels[type]}</div>${items}`;
  document.body.appendChild(popup);
  // Position near box
  const rect = boxEl.getBoundingClientRect();
  let top = rect.bottom + 6, left = rect.left;
  const pw = 250, ph = 300;
  if (left + pw > window.innerWidth) left = window.innerWidth - pw - 8;
  if (top + ph > window.innerHeight) top = rect.top - ph - 6;
  popup.style.top = Math.max(4, top) + 'px';
  popup.style.left = Math.max(4, left) + 'px';
  // Close on outside click
  const handler = e => { if (!popup.contains(e.target) && !e.target.closest('.cr-box')) hideCrPreview(); };
  setTimeout(() => document.addEventListener('click', handler, true), 0);
  _crPreviewCleanup = () => document.removeEventListener('click', handler, true);
}

function hideCrPreview() {
  const el = document.getElementById('crPreviewPopup');
  if (el) el.remove();
  if (_crPreviewCleanup) { _crPreviewCleanup(); _crPreviewCleanup = null; }
}

let _pakPreviewCleanup = null;
function togglePakArtistExpand(expandId, rowEl) {
  const expandRow = document.getElementById(expandId);
  if (!expandRow) return;
  const isOpen = expandRow.style.display !== 'none';
  expandRow.style.display = isOpen ? 'none' : '';
  if (rowEl) rowEl.classList.toggle('pak-artist-row-open', !isOpen);
  if (!isOpen && !expandRow.dataset.imgsLoaded) {
    expandRow.dataset.imgsLoaded = '1';
    (async () => {
      const items = expandRow.querySelectorAll('[data-pak-album-img]');
      for (const item of items) {
        const imgEl = document.getElementById(item.dataset.pakAlbumImg);
        if (!imgEl) continue;
        try {
          const url = await getAlbumImage(item.dataset.album, item.dataset.artist);
          if (url) {
            imgEl.innerHTML = `<img class="pak-mini-img" src="${esc(url)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="pak-mini-initials" style="display:none">${esc(initials(item.dataset.album))}</div>`;
            await new Promise(r => setTimeout(r, 60));
          }
        } catch (e) { }
      }
    })();
  }
}

function showPakWeekPreview(weekKey, triggerEl) {
  hidePakWeekPreview();
  ensureAllChartRun();
  const crData = allChartRun['week'];
  const popup = document.createElement('div');
  popup.className = 'cr-preview';
  popup.id = 'pakWeekPreviewPopup';
  popup.style.position = 'fixed';
  const title = crPeriodTitle('week', weekKey);
  const navigateLink = `<a class="cr-preview-link" href="javascript:void(0)" onclick="hidePakWeekPreview();navigateToRecPeriod('week','${weekKey}')">${t('rec_pak_week_preview_link')}</a>`;
  if (!crData || !crData.periodMap[weekKey]) {
    popup.innerHTML = `<button class="cr-preview-close" onclick="hidePakWeekPreview()">✕</button><div class="cr-preview-title">${esc(title)}</div><div style="padding:4px 0;font-size:0.62rem;color:var(--text3);">${navigateLink}</div>`;
  } else {
    const pm = crData.periodMap[weekKey];
    const types = [
      { key: 'songs', icon: '🎵', label: t('rec_th_songs'), nameOf: ([k, d]) => d._title || k.split('|||')[0] },
      { key: 'artists', icon: '♦', label: t('rec_th_artists'), nameOf: ([k]) => k },
      { key: 'albums', icon: '💿', label: t('rec_th_albums'), nameOf: ([k, d]) => d._album || k.split('|||')[0] },
    ];
    let items = '';
    for (const { key, icon, label, nameOf } of types) {
      const ranked = Object.entries(pm[key]).sort(([, a], [, b]) => rankSort(a, b)).slice(0, Math.min(chartSize, 5));
      if (!ranked.length) continue;
      items += `<div class="cr-preview-section-label">${icon} ${label}</div>`;
      items += ranked.map(([k, d], i) => `<div class="cr-preview-item${i === 0 ? ' highlighted' : ''}"><span class="cr-preview-rank">${i + 1}</span><span>${esc(nameOf([k, d]))}</span></div>`).join('');
    }
    popup.innerHTML = `<button class="cr-preview-close" onclick="hidePakWeekPreview()">✕</button><div class="cr-preview-title">${esc(title)}</div>${items}<div class="pak-preview-navlink">${navigateLink}</div>`;
  }
  document.body.appendChild(popup);
  const rect = triggerEl.getBoundingClientRect();
  const pw = 230, ph = 380;
  let top = rect.bottom + 6, left = rect.left;
  if (left + pw > window.innerWidth) left = window.innerWidth - pw - 8;
  if (top + ph > window.innerHeight) top = rect.top - ph - 6;
  popup.style.top = Math.max(4, top) + 'px';
  popup.style.left = Math.max(4, left) + 'px';
  const handler = e => { if (!popup.contains(e.target) && !e.target.closest('.pak-date-link')) hidePakWeekPreview(); };
  setTimeout(() => document.addEventListener('click', handler, true), 0);
  _pakPreviewCleanup = () => document.removeEventListener('click', handler, true);
}

function hidePakWeekPreview() {
  const el = document.getElementById('pakWeekPreviewPopup');
  if (el) el.remove();
  if (_pakPreviewCleanup) { _pakPreviewCleanup(); _pakPreviewCleanup = null; }
}

let _debutPreviewCleanup = null;
function showDebutWeekPreview(weekKey, triggerEl, event) {
  if (event) event.stopPropagation();
  hideDebutWeekPreview();
  ensureAllChartRun();
  const crData = allChartRun['week'];
  const popup = document.createElement('div');
  popup.className = 'cr-preview';
  popup.id = 'debutWeekPreviewPopup';
  popup.style.position = 'fixed';
  const title = crPeriodTitle('week', weekKey);
  const navigateLink = `<a class="cr-preview-link" href="javascript:void(0)" onclick="hideDebutWeekPreview();navigateToRecPeriod('week','${weekKey}')">${t('rec_pak_week_preview_link')}</a>`;
  if (!crData || !crData.periodMap || !crData.periodMap[weekKey]) {
    popup.innerHTML = `<button class="cr-preview-close" onclick="hideDebutWeekPreview()">✕</button><div class="cr-preview-title">${esc(title)}</div><div style="padding:4px 0;font-size:0.62rem;color:var(--text3);">${navigateLink}</div>`;
  } else {
    const pm = crData.periodMap[weekKey];
    const types = [
      { key: 'songs', icon: '🎵', label: t('rec_th_songs'), nameOf: function ([k, d]) { return d._title || k.split('|||')[0]; } },
      { key: 'artists', icon: '♦', label: t('rec_th_artists'), nameOf: function ([k]) { return k; } },
      { key: 'albums', icon: '💿', label: t('rec_th_albums'), nameOf: function ([k, d]) { return d._album || k.split('|||')[0]; } },
    ];
    let items = '';
    for (const { key, icon, label, nameOf } of types) {
      const ranked = Object.entries(pm[key]).sort(function ([, a], [, b]) { return rankSort(a, b); }).slice(0, Math.min(chartSize, 5));
      if (!ranked.length) continue;
      items += `<div class="cr-preview-section-label">${icon} ${label}</div>`;
      items += ranked.map(function ([k, d], i) { return `<div class="cr-preview-item${i === 0 ? ' highlighted' : ''}"><span class="cr-preview-rank">${i + 1}</span><span>${esc(nameOf([k, d]))}</span></div>`; }).join('');
    }
    popup.innerHTML = `<button class="cr-preview-close" onclick="hideDebutWeekPreview()">✕</button><div class="cr-preview-title">${esc(title)}</div>${items}<div class="pak-preview-navlink">${navigateLink}</div>`;
  }
  document.body.appendChild(popup);
  const rect = triggerEl.getBoundingClientRect();
  const pw = 230, ph = 380;
  let top = rect.bottom + 6, left = rect.left;
  if (left + pw > window.innerWidth) left = window.innerWidth - pw - 8;
  if (top + ph > window.innerHeight) top = rect.top - ph - 6;
  popup.style.top = Math.max(4, top) + 'px';
  popup.style.left = Math.max(4, left) + 'px';
  const handler = function (e) { if (!popup.contains(e.target) && !e.target.closest('.debut-week-link')) hideDebutWeekPreview(); };
  setTimeout(function () { document.addEventListener('click', handler, true); }, 0);
  _debutPreviewCleanup = function () { document.removeEventListener('click', handler, true); };
}

function hideDebutWeekPreview() {
  const el = document.getElementById('debutWeekPreviewPopup');
  if (el) el.remove();
  if (_debutPreviewCleanup) { _debutPreviewCleanup(); _debutPreviewCleanup = null; }
}

function navigateToCrChart(period, periodKey) {
  hideCrPreview();
  const now = tzNow();
  let offset = 0;
  if (period === 'week') {
    const nowDow = now.getDay();
    const nowOffset = (nowDow - weekStartDay + 7) % 7;
    const curStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - nowOffset);
    const targetStart = new Date(periodKey + 'T00:00:00');
    offset = Math.round((curStart - targetStart) / (7 * 86400000));
  } else if (period === 'month') {
    const [yr, mo] = periodKey.split('-').map(Number);
    offset = (now.getFullYear() - yr) * 12 + (now.getMonth() + 1 - mo);
  } else if (period === 'year') {
    offset = now.getFullYear() - parseInt(periodKey);
  }
  if (currentPeriod !== period) {
    savedOffsets[currentPeriod] = currentOffset;
    currentPeriod = period;
    document.querySelectorAll('.period-nav button').forEach(b => b.classList.toggle('active', b.dataset.period === period));
  }
  currentOffset = Math.max(0, offset);
  pageState.songs = 0; pageState.artists = 0; pageState.albums = 0;
  renderAll();
}

// ─── MONTHLY CHART STATS ───────────────────────────────────────
// Returns months-on-chart counts, previous month's chart, and
// a set of items that ever charted before the current month.
function buildPeriodStats(period) {
  const now = tzNow();
  let curKey, prevKey;

  if (period === 'week') {
    curKey = currentViewWeekKey();
    const curStartDate = new Date(curKey + 'T00:00:00');
    const prevStart = new Date(curStartDate);
    prevStart.setDate(curStartDate.getDate() - 7);
    prevKey = localDateStr(prevStart);
  } else {
    const d = new Date(now.getFullYear(), now.getMonth() - currentOffset, 1);
    curKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const prevD = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    prevKey = `${prevD.getFullYear()}-${String(prevD.getMonth() + 1).padStart(2, '0')}`;
  }

  // Group all plays by period key
  const periodMap = {};
  for (const p of allPlays) {
    let mk;
    const _bpstd = tzDate(p.date);
    if (period === 'week') {
      mk = playWeekKey(p.date);
    } else {
      mk = `${_bpstd.getFullYear()}-${String(_bpstd.getMonth() + 1).padStart(2, '0')}`;
    }
    if (mk > curKey) continue; // ignore future periods
    if (!periodMap[mk]) periodMap[mk] = { songs: {}, artists: {}, albums: {} };
    const mm = periodMap[mk];
    const sk = songKey(p);
    if (!mm.songs[sk]) mm.songs[sk] = { count: 0, firstAchieved: p.date };
    mm.songs[sk].count++;
    for (const a of p.artists) {
      if (!mm.artists[a]) mm.artists[a] = { count: 0, firstAchieved: p.date };
      mm.artists[a].count++;
    }
    const ak = p.album + '|||' + albumArtist(p);
    if (!mm.albums[ak]) mm.albums[ak] = { count: 0, firstAchieved: p.date };
    mm.albums[ak].count++;
  }

  const periodsOnChart = { songs: {}, artists: {}, albums: {} };
  const everChartedBefore = { songs: new Set(), artists: new Set(), albums: new Set() };
  const prevChart = { songs: {}, artists: {}, albums: {} };
  // Must track prev/ever sets in order to assign chartStatus for rankSortWithStatus,
  // so ties are broken by seniority — matching buildChartRun and the render functions exactly.
  const bpsEver = { songs: new Set(), artists: new Set(), albums: new Set() };
  const bpsPrev = { songs: new Set(), artists: new Set(), albums: new Set() };

  for (const [mk, mm] of Object.entries(periodMap).sort((a, b) => a[0].localeCompare(b[0]))) {
    for (const type of ['songs', 'artists', 'albums']) {
      for (const [k, data] of Object.entries(mm[type])) {
        data.chartStatus = bpsPrev[type].has(k) ? 0 : bpsEver[type].has(k) ? 1 : 2;
      }
      const newPrev = new Set();
      Object.entries(mm[type]).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, chartSize).forEach(([k, data], i) => {
        newPrev.add(k); bpsEver[type].add(k);
        periodsOnChart[type][k] = (periodsOnChart[type][k] || 0) + 1;
        if (mk < curKey) everChartedBefore[type].add(k);
        if (mk === prevKey) prevChart[type][k] = { rank: i + 1, count: data.count };
      });
      bpsPrev[type] = newPrev;
    }
  }

  return { periodsOnChart, prevChart, everChartedBefore };
}

function mPrevCell(curRank, key, type, ms) {
  const prev = ms.prevChart[type][key];
  if (!prev) {
    const isRe = ms.everChartedBefore[type].has(key);
    const badgeKey = isRe ? 'badge_re' : (type === 'songs' ? 'badge_new_songs' : 'badge_new');
    const label = t(badgeKey);
    return `<td class="m-col"><span class="m-${isRe ? 're' : 'new'}">${label}</span></td>`;
  }
  const diff = prev.rank - curRank; // positive = moved up
  if (diff === 0) return `<td class="m-col"><span class="m-same">=</span><div class="m-prev-rank">#${prev.rank}</div></td>`;
  const dir = diff > 0 ? 'up' : 'down';
  const arrow = diff > 0 ? '▲' : '▼';
  return `<td class="m-col"><span class="m-${dir}">${arrow}${Math.abs(diff)}</span><div class="m-prev-rank">#${prev.rank}</div></td>`;
}

// Inline delta badge — returns a <span> (no <td>) for embedding next to the play count
function deltaInline(curCount, key, type, ms) {
  const prev = ms.prevChart[type][key];
  if (!prev) {
    const isRe = ms.everChartedBefore[type].has(key);
    const badgeKey = isRe ? 'badge_re' : (type === 'songs' ? 'badge_new_songs' : 'badge_new');
    const label = t(badgeKey);
    return `<span class="m-${isRe ? 're' : 'new'}" style="font-size:0.6rem;margin-left:0.4rem">${label}</span>`;
  }
  const diff = curCount - prev.count;
  if (diff === 0) return `<span class="m-same" style="font-size:0.6rem;margin-left:0.4rem">=</span>`;
  const dir = diff > 0 ? 'up' : 'down';
  const sign = diff > 0 ? '+' : '';
  return `<span class="m-${dir}" style="font-size:0.6rem;margin-left:0.4rem">${sign}${diff}</span>`;
}

function mMthsCell(key, type, ms) {
  const n = ms.periodsOnChart[type][key] || 1;
  return `<td class="m-col"><span class="m-mths">${n}</span></td>`;
}

// ─── ALL-TIME PEAK MAPS ────────────────────────────────────────
// Peak positions are calculated within the top N (chartSize) only —
// so #1 all-time means #1 within whichever chart size is selected.
function buildAllTimePeaks() {
  // Songs — rank within top chartSize
  const sp = {};
  for (const p of allPlays) {
    const k = songKey(p);
    if (!sp[k]) sp[k] = { count: 0, firstAchieved: p.date };
    sp[k].count++;
  }
  const songsSorted = Object.entries(sp).sort(([, a], [, b]) => rankSort(a, b)).slice(0, chartSize);
  const songPeakMap = {};
  songsSorted.forEach(([k], i) => { songPeakMap[k] = i + 1; });

  // Artists (split) — rank within top chartSize
  const ap = {};
  for (const p of allPlays) {
    for (const a of p.artists) {
      if (!ap[a]) ap[a] = { count: 0, songs: new Set(), firstAchieved: p.date };
      ap[a].count++;
      ap[a].songs.add(p.title);
    }
  }
  const artistsSorted = Object.entries(ap).sort(([, a], [, b]) => rankSort(a, b)).slice(0, chartSize);
  const artistPeakMap = {};
  artistsSorted.forEach(([name], i) => { artistPeakMap[name] = i + 1; });

  // Albums — rank within top chartSize
  const lp = {};
  for (const p of allPlays) {
    const k = p.album + '|||' + albumArtist(p);
    if (!lp[k]) lp[k] = { count: 0, firstAchieved: p.date };
    lp[k].count++;
  }
  const albumsSorted = Object.entries(lp).sort(([, a], [, b]) => rankSort(a, b)).slice(0, chartSize);
  const albumPeakMap = {};
  albumsSorted.forEach(([k], i) => { albumPeakMap[k] = i + 1; });

  return { songPeakMap, artistPeakMap, albumPeakMap };
}

// ─── PERIOD-BASED PEAK MAPS ────────────────────────────────────
// For weekly charts: best rank ever achieved in any week up to and
// including the currently viewed week (no future weeks bleed in).
// Same logic applies to monthly and yearly.
function buildPeriodPeaks(period) {
  const now = tzNow();

  // Compute the key for the currently viewed period so we can ignore later ones
  let curKey;
  if (period === 'week') {
    curKey = currentViewWeekKey();
  } else if (period === 'month') {
    const d = new Date(now.getFullYear(), now.getMonth() - currentOffset, 1);
    curKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  } else {
    curKey = String(now.getFullYear() - currentOffset);
  }

  const periodMap = {};

  for (const p of allPlays) {
    let key;
    const _bpptd = tzDate(p.date);
    if (period === 'week') {
      key = playWeekKey(p.date);
    } else if (period === 'month') {
      key = `${_bpptd.getFullYear()}-${String(_bpptd.getMonth() + 1).padStart(2, '0')}`;
    } else {
      key = String(_bpptd.getFullYear());
    }

    if (key > curKey) continue; // ignore periods after the currently viewed one

    if (!periodMap[key]) periodMap[key] = { songs: {}, artists: {}, albums: {} };
    const pm = periodMap[key];

    const sk = songKey(p);
    if (!pm.songs[sk]) pm.songs[sk] = { count: 0, firstAchieved: p.date };
    pm.songs[sk].count++;

    for (const a of p.artists) {
      if (!pm.artists[a]) pm.artists[a] = { count: 0, firstAchieved: p.date };
      pm.artists[a].count++;
    }

    const ak = p.album + '|||' + albumArtist(p);
    if (!pm.albums[ak]) pm.albums[ak] = { count: 0, firstAchieved: p.date };
    pm.albums[ak].count++;
  }

  const songPeakMap = {};
  const artistPeakMap = {};
  const albumPeakMap = {};

  // Must use rankSortWithStatus with proper prev/ever tracking so tie-breaking matches
  // what the render functions display — otherwise a seniority-based #2 could be recorded as #1.
  const ppEver = { songs: new Set(), artists: new Set(), albums: new Set() };
  const ppPrev = { songs: new Set(), artists: new Set(), albums: new Set() };

  for (const [pKey, pm] of Object.entries(periodMap).sort((a, b) => a[0].localeCompare(b[0]))) {
    if (pKey === curKey) continue; // current period handled by render reconciliation
    for (const type of ['songs', 'artists', 'albums']) {
      for (const [k, data] of Object.entries(pm[type])) {
        data.chartStatus = ppPrev[type].has(k) ? 0 : ppEver[type].has(k) ? 1 : 2;
      }
      const newPrev = new Set();
      Object.entries(pm[type]).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, chartSize).forEach(([k], i) => {
        newPrev.add(k); ppEver[type].add(k);
        const rank = i + 1;
        if (type === 'songs') { if (!songPeakMap[k] || rank < songPeakMap[k]) songPeakMap[k] = rank; }
        if (type === 'artists') { if (!artistPeakMap[k] || rank < artistPeakMap[k]) artistPeakMap[k] = rank; }
        if (type === 'albums') { if (!albumPeakMap[k] || rank < albumPeakMap[k]) albumPeakMap[k] = rank; }
      });
      ppPrev[type] = newPrev;
    }
  }

  return { songPeakMap, artistPeakMap, albumPeakMap };
}

// Small badge shown on the play count when a period play count equals the all-time per-period peak.
function playsPeakBadge() {
  return `<span class="plays-peak-badge">▲ PLAYS PEAK</span>`;
}

// Cumulative plays per song/album up to endDate (for period cert badges).
function buildCumulativeMapsForPeriod(endDate) {
  const songs = {};
  const albums = {};
  const songAlbumCounts = {}; // songKey → { albumKey → count }
  for (const p of allPlays) {
    if (p.date > endDate) continue;
    const sk = songKey(p);
    songs[sk] = (songs[sk] || 0) + 1;
    const ak = p.album + '|||' + albumArtist(p);
    albums[ak] = (albums[ak] || 0) + 1;
    if (!songAlbumCounts[sk]) songAlbumCounts[sk] = {};
    songAlbumCounts[sk][ak] = (songAlbumCounts[sk][ak] || 0) + 1;
  }
  // Best album key per song: mirrors bestAlbum — prefer non-self-titled (i.e. album name ≠ song title),
  // then pick the most-played. This keeps the album cert badge consistent with the displayed album name.
  const songAlbumKey = {};
  for (const [sk, ac] of Object.entries(songAlbumCounts)) {
    const entries = Object.entries(ac).sort((a, b) => b[1] - a[1]);
    const songTitle = sk.split('|||')[0];
    const nonSingle = entries.filter(([ak]) => ak.split('|||')[0].toLowerCase().trim() !== songTitle);
    songAlbumKey[sk] = (nonSingle.length > 0 ? nonSingle[0][0] : entries[0][0]);
  }
  // Album plays keyed by album name only — used as fallback for songs with no prior history
  // (e.g. NEW entries that have no songAlbumKey yet).
  const albumsByName = {};
  for (const [ak, count] of Object.entries(albums)) {
    const name = ak.split('|||')[0];
    albumsByName[name] = (albumsByName[name] || 0) + count;
  }
  return { songs, albums, songAlbumKey, albumsByName };
}

// Historical max per-period play counts, excluding the currently viewed period.
// Used to decide whether the current period is a plays-peak for a song/artist/album.
function buildPlaysPeakMaps(period) {
  const now = tzNow();
  let curKey;
  if (period === 'week') {
    curKey = currentViewWeekKey();
  } else if (period === 'month') {
    const d = new Date(now.getFullYear(), now.getMonth() - currentOffset, 1);
    curKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  } else {
    curKey = String(now.getFullYear() - currentOffset);
  }

  const periodMap = {};
  for (const p of allPlays) {
    let key;
    const _bppmtd = tzDate(p.date);
    if (period === 'week') key = playWeekKey(p.date);
    else if (period === 'month') key = `${_bppmtd.getFullYear()}-${String(_bppmtd.getMonth() + 1).padStart(2, '0')}`;
    else key = String(_bppmtd.getFullYear());
    if (key > curKey) continue;
    if (!periodMap[key]) periodMap[key] = { songs: {}, artists: {}, albums: {} };
    const pm = periodMap[key];
    const sk = songKey(p);
    pm.songs[sk] = (pm.songs[sk] || 0) + 1;
    for (const a of p.artists) pm.artists[a] = (pm.artists[a] || 0) + 1;
    const ak = p.album + '|||' + albumArtist(p);
    pm.albums[ak] = (pm.albums[ak] || 0) + 1;
  }

  const songs = {}, artists = {}, albums = {};
  for (const [pKey, pm] of Object.entries(periodMap)) {
    if (pKey === curKey) continue; // current period handled at render time
    for (const [k, c] of Object.entries(pm.songs)) { if (c > (songs[k] || 0)) songs[k] = c; }
    for (const [k, c] of Object.entries(pm.artists)) { if (c > (artists[k] || 0)) artists[k] = c; }
    for (const [k, c] of Object.entries(pm.albums)) { if (c > (albums[k] || 0)) albums[k] = c; }
  }
  return { songs, artists, albums };
}

function buildPeaks() {
  if (currentPeriod === 'week' || currentPeriod === 'month' || currentPeriod === 'year') {
    return buildPeriodPeaks(currentPeriod);
  }
  return buildAllTimePeaks();
}

function peakBadge(peak) {
  if (!peak || peak === '—') return '';
  const peakLabel = t('peak_label');
  if (peak === 1 && currentPeriod === 'alltime') return `<span class="peak-badge-1">★ ALL-TIME #1</span>`;
  if (peak === 1) return `<span class="peak-badge-1">${peakLabel} #1</span>`;
  if (peak === 2) return `<span class="peak-badge-2">${peakLabel} #2</span>`;
  if (peak === 3) return `<span class="peak-badge-3">${peakLabel} #3</span>`;
  return `<span class="peak-badge">${peakLabel} #${peak}</span>`;
}

function renderSongs(plays, peaks, monthlyStats) {
  const counts = {};
  for (const p of plays) {
    const k = songKey(p);
    if (!counts[k]) counts[k] = { title: p.title, artist: p.artist, album: p.album, count: 0, _albums: {}, firstAchieved: p.date };
    counts[k].count++;
    counts[k]._albums[p.album] = (counts[k]._albums[p.album] || 0) + 1;
  }
  for (const entry of Object.values(counts)) {
    entry.album = bestAlbum(entry.title, entry._albums);
    delete entry._albums;
    if (monthlyStats) {
      const k = songKey(entry);
      entry.chartStatus = monthlyStats.prevChart.songs[k] ? 0
        : monthlyStats.everChartedBefore.songs.has(k) ? 1 : 2;
    }
  }
  const sorted = Object.values(counts).sort(monthlyStats ? rankSortWithStatus : rankSort).slice(0, chartSize);
  fullData.songs = sorted;
  // Reconcile peak map: current period was excluded from buildPeriodPeaks (which uses rankSort),
  // so apply the actual rendered rank here. Take the min vs any historical peak from past periods.
  if (currentPeriod !== 'alltime') {
    sorted.forEach((s, i) => { const k = songKey(s); const r = i + 1; peaks.songPeakMap[k] = peaks.songPeakMap[k] ? Math.min(peaks.songPeakMap[k], r) : r; });
  }
  const max = sorted[0]?.count || 1;
  const isAllTime = currentPeriod === 'alltime';
  const colCount = monthlyStats ? 7 : 5;
  const imgItems = [];
  document.getElementById('songsBody').innerHTML = sorted.flatMap((s, i) => {
    const k = songKey(s);
    const pk = !isAllTime ? peaks.songPeakMap[k] : null;
    const imgId = 'simg-' + i;
    const prefKey = 'song:' + s.artist.toLowerCase() + '|||' + s.title.toLowerCase();
    const rowId = 'crr-song-' + i;
    imgItems.push({ imgId, title: s.title, artist: s.artist, album: s.album, type: 'song', prefKey });
    const cumSongPlays = cumulativeMaps ? (cumulativeMaps.songs[k] || 0) : s.count;
    const cumAlbumPlays = cumulativeMaps && s.album ? (cumulativeMaps.albumsByName[s.album] || 0) : 0;
    const histMaxSong = playsPeakMaps ? (playsPeakMaps.songs[k] || 0) : 0;
    const isPlaysPeak = !isAllTime && histMaxSong > 0 && s.count >= histMaxSong;
    const mainRow = `<tr class="${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''}">
      <td class="rank-cell"><button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_song')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button>${i + 1}</td>
      <td class="thumb-cell"><div class="thumb-wrap"><div id="${imgId}"><div class="thumb-initials">${esc(initials(s.title))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="song" data-prefkey="${esc(prefKey)}" data-name="${esc(s.title)}" data-artist="${esc(s.artist)}" data-album="${esc(s.album)}">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div></td>
      <td>
        <div class="song-title">${esc(s.title)}${pk ? peakBadge(pk) : ''}${certBadge(cumSongPlays, 'song')}</div>
        <div class="song-artist">${esc(s.artist)}</div>
      </td>
      <td><div class="song-album">${esc(s.album)}${cumAlbumPlays ? certBadge(cumAlbumPlays, 'album') : ''}</div></td>
      ${monthlyStats ? mPrevCell(i + 1, k, 'songs', monthlyStats) : ''}
      ${monthlyStats ? mMthsCell(k, 'songs', monthlyStats) : ''}
      <td>
        <div class="play-count">${isPlaysPeak ? playsPeakBadge() : ''}${tCount('plays', s.count)}${monthlyStats ? deltaInline(s.count, k, 'songs', monthlyStats) : ''}</div>
        <div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(s.count / max * 100)}%"></div></div>
      </td>
    </tr>`;
    const expandRow = `<tr class="cr-row" id="${rowId}"><td colspan="${colCount}"><div class="cr-panel" data-crtype="songs" data-crkey="${encodeURIComponent(k)}">${buildCrPanelHTML('songs', k)}</div></td></tr>`;
    return [mainRow, expandRow];
  }).join('');
  loadImages(imgItems.map(i => ({ ...i, name: i.title })), 'song');
}

function renderArtists(plays, peaks, monthlyStats) {
  const counts = {};
  for (const p of plays) {
    for (const artist of p.artists) {
      if (!counts[artist]) counts[artist] = { count: 0, songs: new Set(), firstAchieved: p.date };
      counts[artist].count++;
      counts[artist].songs.add(p.title);
    }
  }
  if (monthlyStats) {
    for (const [artist, data] of Object.entries(counts)) {
      data.chartStatus = monthlyStats.prevChart.artists[artist] ? 0
        : monthlyStats.everChartedBefore.artists.has(artist) ? 1 : 2;
    }
  }
  const sorted = Object.entries(counts).sort(([, a], [, b]) => monthlyStats ? rankSortWithStatus(a, b) : rankSort(a, b)).slice(0, chartSize);
  fullData.artists = sorted.map(([name, data]) => ({ name, ...data }));
  // Reconcile peak map with actual chart ranks (current period excluded from buildPeriodPeaks)
  if (currentPeriod !== 'alltime') {
    sorted.forEach(([artist], i) => { const r = i + 1; peaks.artistPeakMap[artist] = peaks.artistPeakMap[artist] ? Math.min(peaks.artistPeakMap[artist], r) : r; });
  }
  const max = sorted[0]?.[1].count || 1;
  const isAllTime = currentPeriod === 'alltime';
  const colCount = monthlyStats ? 7 : 5;
  const imgItems = [];
  document.getElementById('artistsBody').innerHTML = sorted.flatMap(([artist, data], i) => {
    const pk = !isAllTime ? peaks.artistPeakMap[artist] : null;
    const imgId = 'aimg-' + i;
    const prefKey = 'artist:' + artist.toLowerCase();
    const rowId = 'crr-artist-' + i;
    imgItems.push({ imgId, name: artist, prefKey });
    const histMaxArtist = playsPeakMaps ? (playsPeakMaps.artists[artist] || 0) : 0;
    const isPlaysPeak = !isAllTime && histMaxArtist > 0 && data.count >= histMaxArtist;
    const mainRow = `<tr class="${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''} artist-row" data-artist="${esc(artist)}">
      <td class="rank-cell"><button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_artist')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button>${i + 1}</td>
      <td class="thumb-cell"><div class="thumb-wrap"><div id="${imgId}"><div class="thumb-initials">${esc(initials(artist))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="artist" data-prefkey="${esc(prefKey)}" data-name="${esc(artist)}" data-artist="${esc(artist)}" data-album="">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div></td>
      <td><div class="song-title">${esc(artist)}${pk ? peakBadge(pk) : ''}</div><div class="song-artist" style="font-size:0.7rem;letter-spacing:0.06em;font-style:normal;font-family:'DM Mono',monospace;color:var(--text3)">${t('click_view_profile')}</div></td>
      <td><div class="song-artist">${tCount('songs', data.songs.size)}</div></td>
      ${monthlyStats ? mPrevCell(i + 1, artist, 'artists', monthlyStats) : ''}
      ${monthlyStats ? mMthsCell(artist, 'artists', monthlyStats) : ''}
      <td>
        <div class="play-count">${isPlaysPeak ? playsPeakBadge() : ''}${tCount('plays', data.count)}${monthlyStats ? deltaInline(data.count, artist, 'artists', monthlyStats) : ''}</div>
        <div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(data.count / max * 100)}%"></div></div>
      </td>
    </tr>`;
    const expandRow = `<tr class="cr-row" id="${rowId}"><td colspan="${colCount}"><div class="cr-panel" data-crtype="artists" data-crkey="${encodeURIComponent(artist)}">${buildCrPanelHTML('artists', artist)}</div></td></tr>`;
    return [mainRow, expandRow];
  }).join('');
  loadImages(imgItems, 'artist');
}

function renderAlbums(plays, peaks, monthlyStats) {
  const counts = {};
  for (const p of plays) {
    const k = p.album + '|||' + albumArtist(p);
    if (!counts[k]) counts[k] = { album: p.album, artist: albumArtist(p), count: 0, tracks: new Set(), firstAchieved: p.date };
    counts[k].count++;
    counts[k].tracks.add(p.title);
  }
  if (monthlyStats) {
    for (const [k, entry] of Object.entries(counts)) {
      entry.chartStatus = monthlyStats.prevChart.albums[k] ? 0
        : monthlyStats.everChartedBefore.albums.has(k) ? 1 : 2;
    }
  }
  const sorted = Object.values(counts).filter(a => a.album && a.album !== '—').sort(monthlyStats ? rankSortWithStatus : rankSort).slice(0, chartSize);
  fullData.albums = sorted;
  // Reconcile peak map with actual chart ranks (current period excluded from buildPeriodPeaks)
  if (currentPeriod !== 'alltime') {
    sorted.forEach(({ album, artist }, i) => { const ak = album + '|||' + artist; const r = i + 1; peaks.albumPeakMap[ak] = peaks.albumPeakMap[ak] ? Math.min(peaks.albumPeakMap[ak], r) : r; });
  }
  const max = sorted[0]?.count || 1;
  const isAllTime = currentPeriod === 'alltime';
  const colCount = monthlyStats ? 7 : 5;
  const imgItems = [];
  if (sorted.length === 0) {
    document.getElementById('albumsBody').innerHTML = `<tr><td colspan="${colCount}"><div class="empty-state"><p>${t('empty_no_album_data_csv')}</p></div></td></tr>`;
  } else {
    document.getElementById('albumsBody').innerHTML = sorted.flatMap(({ album, artist, count, tracks }, i) => {
      const ak = album + '|||' + artist;
      const pk = !isAllTime ? peaks.albumPeakMap[ak] : null;
      const imgId = 'limg-' + i;
      const prefKey = 'album:' + artist.toLowerCase() + '|||' + album.toLowerCase();
      const rowId = 'crr-album-' + i;
      imgItems.push({ imgId, album, artist, name: album, prefKey });
      const cumAlbumPlays = cumulativeMaps ? (cumulativeMaps.albums[ak] || 0) : count;
      const histMaxAlbum = playsPeakMaps ? (playsPeakMaps.albums[ak] || 0) : 0;
      const isPlaysPeak = !isAllTime && histMaxAlbum > 0 && count >= histMaxAlbum;
      const mainRow = `<tr class="${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''} album-row" data-albumkey="${esc(ak)}">
      <td class="rank-cell"><button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_album')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button>${i + 1}</td>
      <td class="thumb-cell"><div class="thumb-wrap"><div id="${imgId}"><div class="thumb-initials">${esc(initials(album))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="album" data-prefkey="${esc(prefKey)}" data-name="${esc(album)}" data-artist="${esc(artist)}" data-album="${esc(album)}">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div></td>
      <td>
        <div class="song-title">${esc(album)}${pk ? peakBadge(pk) : ''}${certBadge(cumAlbumPlays, 'album')}</div>
        <div class="song-artist">${esc(artist)}</div>
        <div class="song-artist" style="font-size:0.65rem;letter-spacing:0.06em;font-style:normal;font-family:'DM Mono',monospace;color:var(--text3)">${t('click_view_album')}</div>
      </td>
      <td><div class="song-artist">${tCount('tracks', tracks.size)}</div></td>
      ${monthlyStats ? mPrevCell(i + 1, ak, 'albums', monthlyStats) : ''}
      ${monthlyStats ? mMthsCell(ak, 'albums', monthlyStats) : ''}
      <td>
        <div class="play-count">${isPlaysPeak ? playsPeakBadge() : ''}${tCount('plays', count)}${monthlyStats ? deltaInline(count, ak, 'albums', monthlyStats) : ''}</div>
        <div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(count / max * 100)}%"></div></div>
      </td>
    </tr>`;
      const expandRow = `<tr class="cr-row" id="${rowId}"><td colspan="${colCount}"><div class="cr-panel" data-crtype="albums" data-crkey="${encodeURIComponent(ak)}">${buildCrPanelHTML('albums', ak)}</div></td></tr>`;
      return [mainRow, expandRow];
    }).join('');
  }
  loadImages(imgItems, 'album');
}

// ─── WEEKLY DROPOUTS ───────────────────────────────────────────
function renderDropouts(plays, periodStats) {
  const section = document.getElementById('dropoutsSection');
  if (!periodStats || currentPeriod !== 'week') { section.style.display = 'none'; return; }

  const dropoutsSubtitle = document.getElementById('dropoutsSubtitle');
  dropoutsSubtitle.dataset.i18nN = chartSize;
  dropoutsSubtitle.textContent = t('sub_dropouts', { n: chartSize });

  // Current week's chart keys
  const curSongKeys = new Set();
  const sc = {};
  for (const p of plays) { const k = songKey(p); sc[k] = (sc[k] || 0) + 1; }
  Object.entries(sc).sort((a, b) => b[1] - a[1]).slice(0, chartSize).forEach(([k]) => curSongKeys.add(k));

  const curArtistKeys = new Set();
  const ac = {};
  for (const p of plays) { for (const a of p.artists) ac[a] = (ac[a] || 0) + 1; }
  Object.entries(ac).sort((a, b) => b[1] - a[1]).slice(0, chartSize).forEach(([k]) => curArtistKeys.add(k));

  const curAlbumKeys = new Set();
  const lc = {};
  for (const p of plays) {
    if (!p.album || p.album === '—') continue;
    const k = p.album + '|||' + albumArtist(p);
    lc[k] = (lc[k] || 0) + 1;
  }
  Object.entries(lc).sort((a, b) => b[1] - a[1]).slice(0, chartSize).forEach(([k]) => curAlbumKeys.add(k));

  // Dropouts: in previous week's chart but not in this week's
  const dropSongs = Object.entries(periodStats.prevChart.songs)
    .filter(([k]) => !curSongKeys.has(k)).sort((a, b) => a[1].rank - b[1].rank);
  const dropArtists = Object.entries(periodStats.prevChart.artists)
    .filter(([k]) => !curArtistKeys.has(k)).sort((a, b) => a[1].rank - b[1].rank);
  const dropAlbums = Object.entries(periodStats.prevChart.albums)
    .filter(([k]) => !curAlbumKeys.has(k)).sort((a, b) => a[1].rank - b[1].rank);

  if (!dropSongs.length && !dropArtists.length && !dropAlbums.length) {
    section.style.display = 'none';
    return;
  }

  // Name lookup for songs and albums (keys are lowercase, need original casing)
  const songNames = {}, albumNames = {};
  for (const p of allPlays) {
    const sk = songKey(p);
    if (!songNames[sk]) songNames[sk] = { title: p.title, artist: p.artist };
    const ak = p.album + '|||' + albumArtist(p);
    if (!albumNames[ak]) albumNames[ak] = { album: p.album, artist: albumArtist(p) };
  }

  function dropRows(entries, type) {
    if (!entries.length) return `<div class="dropout-empty">${t('drop_none_this_week')}</div>`;
    return entries.map(([k, { rank, count }]) => {
      const wks = periodStats.periodsOnChart[type][k] || 1;
      let name, sub;
      if (type === 'songs') { name = songNames[k]?.title || k.split('|||')[0]; sub = songNames[k]?.artist || ''; }
      else if (type === 'artists') { name = k; sub = ''; }
      else { name = albumNames[k]?.album || k.split('|||')[0]; sub = albumNames[k]?.artist || ''; }
      return `<div class="dropout-row">
        <span class="dropout-rank">#${rank}</span>
        <div class="dropout-info">
          <div class="dropout-name">${esc(name)}</div>
          ${sub ? `<div class="dropout-artist">${esc(sub)}</div>` : ''}
        </div>
        <div class="dropout-stats">
          <span class="dropout-plays">${tCount('plays', count)}</span>
          <span class="dropout-wks">${wks} ${tUnit('weeks', wks)}</span>
        </div>
      </div>`;
    }).join('');
  }

  section.style.display = 'block';
  document.getElementById('dropoutsContent').innerHTML = `
    <div class="dropouts-grid">
      <div class="dropout-col">
        <div class="dropout-col-title">${t('drop_col_songs')}</div>
        ${dropRows(dropSongs, 'songs')}
      </div>
      <div class="dropout-col">
        <div class="dropout-col-title">${t('drop_col_artists')}</div>
        ${dropRows(dropArtists, 'artists')}
      </div>
      <div class="dropout-col">
        <div class="dropout-col-title">${t('drop_col_albums')}</div>
        ${dropRows(dropAlbums, 'albums')}
      </div>
    </div>`;
}

// ─── CERTIFICATIONS ────────────────────────────────────────────
const CERT = {
  song: { gold: 50, plat: 100, diamond: 200 },
  album: { gold: 120, plat: 300, diamond: 600 }
};

function diamondMultiLabel(n) {
  if (n === 1) return { icon: '💎', label: 'Diamond' };
  if (n === 2) return { icon: '💎💎', label: 'Double Diamond' };
  if (n === 3) return { icon: '💎💎💎', label: 'Triple Diamond' };
  return { icon: '💎', label: `${n}× Diamond` };
}
function tDiamondLabel(mult) {
  if (mult === 1) return t('cert_diamond');
  if (mult === 2) return t('cert_dbl_diamond');
  if (mult === 3) return t('cert_tri_diamond');
  return t('cert_nx_diamond', { n: mult });
}

function certBadge(plays, type) {
  const certTiers = CERT[type];
  if (!certTiers) return '';
  if (plays >= certTiers.diamond) {
    const { icon, label } = diamondMultiLabel(Math.floor(plays / certTiers.diamond));
    return `<span class="cert cert-diamond"><span class="cert-icon">${icon}</span>${label.toUpperCase()}</span>`;
  }
  if (plays >= certTiers.plat) return `<span class="cert cert-plat"><span class="cert-icon">💿</span>PLATINUM</span>`;
  if (plays >= certTiers.gold) return `<span class="cert cert-gold"><span class="cert-icon">⭐</span>GOLD</span>`;
  return '';
}

// ─── EXPORT PLAYLIST ───────────────────────────────────────────
function getCurrentChartSongs() {
  // Returns [{title, artist}] for all songs currently visible in the chart
  if (isPaginated()) {
    // Yearly / All-Time: use fullData.songs (already limited by chart view setting)
    return fullData.songs.map(s => ({ title: s.title, artist: s.artist }));
  }
  // Weekly / Monthly: re-derive from the current plays (same as renderSongs does)
  const { start, end } = getDateRange();
  const plays = currentPeriod === 'alltime'
    ? allPlays
    : allPlays.filter(p => { const _tp = tzDate(p.date); return _tp >= start && _tp <= end; });
  const counts = {};
  for (const p of plays) {
    const k = songKey(p);
    if (!counts[k]) counts[k] = { title: p.title, artist: p.artist, count: 0, firstAchieved: p.date };
    counts[k].count++;
  }
  return Object.values(counts).sort(rankSort).slice(0, chartSize)
    .map(s => ({ title: s.title, artist: s.artist }));
}

let exportReversed = false;

function buildExportText(songs) {
  const list = exportReversed ? [...songs].reverse() : songs;
  return list.map(s => `${s.artist} - ${s.title}`).join('\n');
}

function toggleExportOrder() {
  exportReversed = !exportReversed;
  const btn = document.getElementById('exportOrderBtn');
  btn.textContent = exportReversed ? t('export_no1_last') : t('export_no1_first');
  // Re-render tracklist with current songs
  const songs = getCurrentChartSongs();
  document.getElementById('exportTracklist').textContent = buildExportText(songs);
}

function generatePlaylistNames(songs, periodName) {
  const names = new Set();
  const { label, sub } = getDateRange();
  const weekLabel = currentPeriod === 'week' ? sub : label; // sub has actual dates e.g. "Apr 5 – Apr 11, 2026"

  // ── Chart-based names ──
  if (currentPeriod === 'week') {
    names.add(t('export_pn_week_top', { n: songs.length, date: weekLabel }));
    names.add(t('export_pn_week_my', { date: weekLabel }));
    names.add(t('export_pn_week_picks', { date: weekLabel }));
    names.add(t('export_pn_week_hits', { date: weekLabel }));
  } else if (currentPeriod === 'month') {
    names.add(t('export_pn_month_top', { n: songs.length, label }));
    names.add(t('export_pn_month_favorites', { label }));
    names.add(t('export_pn_month_playlist', { label }));
    names.add(t('export_pn_best_of', { label }));
  } else if (currentPeriod === 'year') {
    names.add(t('export_pn_month_top', { n: songs.length, label }));
    names.add(t('export_pn_best_of', { label }));
    names.add(t('export_pn_year_highlights', { label }));
    names.add(t('export_pn_year_soundtrack', { label }));
    names.add(t('export_pn_year_chart', { label }));
  } else if (currentPeriod === 'alltime') {
    names.add(t('export_pn_alltime_top', { n: songs.length }));
    names.add(t('export_pn_alltime_favorites'));
    names.add(t('export_pn_alltime_greatest'));
    names.add(t('export_pn_alltime_definitive'));
  }

  // ── Artist-based names ──
  // Count plays per artist across the song list
  const artistCount = {};
  for (const s of songs) {
    const primary = s.artist.split(',')[0].trim();
    artistCount[primary] = (artistCount[primary] || 0) + 1;
  }
  const topArtists = Object.entries(artistCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([a]) => a);

  const [a1, a2, a3] = topArtists;
  const a1Share = a1 ? artistCount[a1] / songs.length : 0;

  if (a1 && a1Share >= 0.5) {
    names.add(t('export_pn_artist_best_of', { artist: a1 }));
    names.add(t('export_pn_artist_top_tracks', { artist: a1 }));
    names.add(t('export_pn_artist_essentials', { artist: a1 }));
  } else if (a1 && a2 && a1Share >= 0.25) {
    names.add(t('export_pn_artist_and_more', { artist: a1 }));
    names.add(t('export_pn_two_artist_mix', { a1, a2 }));
  } else if (a1 && a2 && a3) {
    names.add(t('export_pn_artists_and_more', { a1, a2 }));
    names.add(t('export_pn_feat_three', { a1, a2, a3 }));
  } else if (a1 && a2) {
    names.add(t('export_pn_two_and_mix', { a1, a2 }));
  }

  // ── Song count flavour ──
  const n = songs.length;
  if (n <= 10) names.add(t('export_pn_the_top', { n }));
  else if (n <= 50) names.add(t('export_pn_top_picks', { n }));
  else names.add(t('export_pn_top_tracks', { n }));

  return [...names];
}

function openExportModal() {
  const songs = getCurrentChartSongs();
  const { label } = getDateRange();
  const periodName = currentPeriod === 'alltime' ? t('period_alltime') :
    currentPeriod === 'week' ? t('period_week_of', { date: label }) :
      label;

  document.getElementById('exportModalSubtitle').textContent =
    t('export_subtitle', { count: tCount('songs', songs.length), period: periodName });

  // Playlist name suggestions
  const names = generatePlaylistNames(songs, periodName);
  document.getElementById('exportNameChips').innerHTML = names.map(name =>
    `<button class="export-name-chip" onclick="copyChipName(this,'${esc(name)}')">${esc(name)}</button>`
  ).join('');

  exportReversed = false;
  document.getElementById('exportOrderBtn').textContent = t('export_no1_first');
  document.getElementById('exportTracklist').textContent = buildExportText(songs);

  document.getElementById('exportNoteBody').innerHTML =
    `<strong style="color:var(--text2)">${t('export_how_to_title')}</strong><br>` +
    `1. ${t('export_how_to_step1')}<br>` +
    `2. ${t('export_how_to_step2')}<br>` +
    `&nbsp;&nbsp;&nbsp;${t('export_how_to_step2b')}<br>` +
    `3. ${t('export_how_to_step3')}<br>` +
    `4. ${t('export_how_to_step4')}<br><br>` +
    t('export_format_used');

  document.getElementById('exportModal').classList.add('open');
}

function copyChipName(btn, name) {
  navigator.clipboard.writeText(name).then(() => {
    btn.classList.add('copied');
    const orig = btn.textContent;
    btn.textContent = '✓ ' + orig;
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
  });
}

function closeExportModal() {
  document.getElementById('exportModal').classList.remove('open');
}

function exportCopy() {
  const text = document.getElementById('exportTracklist').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.export-btn-copy');
    const orig = btn.textContent;
    btn.textContent = t('export_copied');
    setTimeout(() => btn.textContent = orig, 2000);
  });
}

function exportDownload() {
  const text = document.getElementById('exportTracklist').textContent;
  const subtitle = document.getElementById('exportModalSubtitle').textContent;
  const name = 'playlist-' + subtitle.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.txt';
  const a = document.createElement('a');
  a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
  a.download = name;
  a.click();
}

// Show/hide export button — only when there are songs to export
function updateExportBtn() {
  const btn = document.getElementById('exportPlaylistBtn');
  if (!btn) return;
  const curPaginatedSize = currentPeriod === 'year' ? chartSizeYearly : chartSizeAllTime;
  const isAllEntries = isPaginated() && !isFinite(curPaginatedSize);
  const show = currentPeriod !== 'rawdata' && allPlays.length > 0 && !isAllEntries;
  btn.style.display = show ? 'flex' : 'none';
}

// ─── SHARE AS IMAGE ─────────────────────────────────────────────
function updateShareBtns() {
  const show = currentPeriod !== 'rawdata' && allPlays.length > 0;
  const curPaginatedSize2 = currentPeriod === 'year' ? chartSizeYearly : chartSizeAllTime;
  const isAllEntries = isPaginated() && !isFinite(curPaginatedSize2);
  const allowed = show && !isAllEntries;
  ['songs', 'artists', 'albums'].forEach(t => {
    const bar = document.getElementById(t + 'ShareBar');
    if (bar) bar.classList.toggle('visible', allowed);
  });
}

// Collect current top N card data for a given type
function getIgCardItems(type) {
  const items = fullData[type] || [];
  const size = isPaginated() ? Math.min(currentPeriod === 'year' ? chartSizeYearly : chartSizeAllTime, 20) : Math.min(chartSize, 20);
  return items.slice(0, size);
}

// Get movement label and direction for a card row
function igMovement(rank, key, type) {
  if (!lastPeriodStats) return { label: '', cls: '' };
  const ms = lastPeriodStats;
  const prev = ms.prevChart[type][key];
  if (!prev) {
    const isRe = ms.everChartedBefore[type].has(key);
    const badgeKey = isRe ? 'badge_re' : (type === 'songs' ? 'badge_new_songs' : 'badge_new');
    return { label: t(badgeKey), cls: isRe ? 're' : 'new' };
  }
  const diff = prev.rank - rank;
  if (diff === 0) return { label: '=', cls: 'same' };
  return { label: (diff > 0 ? '▲' : '▼') + Math.abs(diff), cls: diff > 0 ? 'up' : 'down' };
}

// Build peak badge HTML for a card row — matches chart style
function igPeak(key, type, peaks, fontSize) {
  if (!peaks) return '';
  const map = type === 'songs' ? peaks.songPeakMap : type === 'artists' ? peaks.artistPeakMap : peaks.albumPeakMap;
  const peak = map && map[key];
  if (!peak) return '';
  const fs = fontSize + 'px'; // caller already computes the desired badge font size
  const peakLabel = t('peak_label');
  if (peak === 1) return `<span style="font-family:'DM Mono',monospace;font-size:${fs};background:rgba(245,158,11,0.2);color:#f0aa30;padding:1px 5px;border-radius:3px;border:1px solid rgba(245,158,11,0.35);letter-spacing:0.05em;white-space:nowrap;">${peakLabel} #1</span>`;
  if (peak === 2) return `<span style="font-family:'DM Mono',monospace;font-size:${fs};background:rgba(148,163,184,0.2);color:#94a3b8;padding:1px 5px;border-radius:3px;border:1px solid rgba(148,163,184,0.35);letter-spacing:0.05em;white-space:nowrap;">${peakLabel} #2</span>`;
  if (peak === 3) return `<span style="font-family:'DM Mono',monospace;font-size:${fs};background:rgba(192,120,80,0.2);color:#c07850;padding:1px 5px;border-radius:3px;border:1px solid rgba(192,120,80,0.35);letter-spacing:0.05em;white-space:nowrap;">${peakLabel} #3</span>`;
  return `<span style="font-family:'DM Mono',monospace;font-size:${fs};background:rgba(255,255,255,0.08);color:#7aa0d0;padding:1px 5px;border-radius:3px;border:1px solid rgba(255,255,255,0.12);letter-spacing:0.05em;white-space:nowrap;">${peakLabel} #${peak}</span>`;
}

// Theme-aware color getter
function igColors() {
  const s = getComputedStyle(document.documentElement);
  const body = getComputedStyle(document.body);
  const get = v => {
    let val = body.getPropertyValue(v).trim() || s.getPropertyValue(v).trim();
    return val || null;
  };
  const isDark = !Array.from(document.body.classList).some(c => c.endsWith('-light'));
  return {
    isDark,
    bg: get('--bg') || '#08121e',
    bg2: get('--bg2') || '#0e1e34',
    bg3: get('--bg3') || '#122444',
    surface: get('--surface') || '#173060',
    border: get('--border') || '#1e3d72',
    text: get('--text') || '#eaf2ff',
    text2: get('--text2') || '#a8c8f0',
    text3: get('--text3') || '#7aa0d0',
    accent: get('--accent') || '#4aacff',
    accent2: get('--accent2') || '#80c8ff',
    green: get('--green') || '#34d399',
    amber: get('--amber') || '#fbbf24',
    rose: get('--rose') || '#fb7185',
    gold1: get('--gold1') || '#f0aa30',
  };
}

// ─── IG PREVIEW STATE ───────────────────────────────────────────
const igOptions = {
  format: 'post',
  showMovement: true,
  showPeak: true,
  showWeeks: true,
  showPlays: true,
  showSubtitle: true,
  showDate: true,
  showFooter: true,
};
let igPreviewType = null;

function buildIgCardHTML(type, opts) {
  const c = igColors();
  const isPost = opts.format === 'post';
  const cardW = 540;
  const cardH = isPost ? 540 : 960;
  const items = getIgCardItems(type);
  if (!items.length) return '';
  const n = items.length;
  const { label, sub } = getDateRange();

  // Period-aware titles (translated)
  const typeWord = { songs: t('ig_type_songs'), artists: t('ig_type_artists'), albums: t('ig_type_albums') };
  const typeIcon = { songs: '★', artists: '♦', albums: '◈' };
  let cardTitle, periodLine;
  if (currentPeriod === 'week') {
    cardTitle = `TOP ${n} ${typeIcon[type]} ${typeWord[type]} ${t('ig_period_of_week')}`;
    periodLine = sub || label;
  } else if (currentPeriod === 'month') {
    cardTitle = `TOP ${n} ${typeIcon[type]} ${typeWord[type]} ${t('ig_period_of_month')}`;
    periodLine = label;
  } else if (currentPeriod === 'year') {
    cardTitle = `TOP ${n} ${typeIcon[type]} ${typeWord[type]} ${t('ig_period_of_year', { year: label })}`;
    periodLine = label;
  } else if (currentPeriod === 'alltime') {
    cardTitle = `${t('ig_alltime_prefix')} TOP ${n} ${typeIcon[type]} ${typeWord[type]}`;
    periodLine = t('ig_alltime_period');
  } else {
    cardTitle = `TOP ${n} ${typeIcon[type]} ${typeWord[type].toUpperCase()}`;
    periodLine = sub || label;
  }

  const headerH = isPost ? 90 : 168;
  const footerH = opts.showFooter ? 36 : 0;
  const rowH = Math.floor((cardH - headerH - footerH) / n);

  // Per-element font size overrides (0 = Auto)
  const _v = id => parseInt(document.getElementById(id)?.value || 0);
  const autoBase = isPost ? Math.max(10, Math.min(14, rowH - 4)) : Math.max(12, Math.min(20, rowH - 6));
  const rankFontSize    = _v('igRankSize')      || (autoBase + 2);
  const titleFontSize   = _v('igTitleSize')     || autoBase;
  const artistFontSize  = _v('igArtistSize')    || Math.max(6, titleFontSize - 2);
  const songsCountFontSize = type === 'artists' ? (_v('igSongsCountSize') || Math.max(6, titleFontSize - 2)) : artistFontSize;
  const peakFontSize    = _v('igPeakSize')      || Math.max(6, autoBase - 4);
  const weeksFontSize   = _v('igWeeksSize')     || Math.max(6, autoBase - 3);
  const playsFontSize   = _v('igPlaysSize')     || (autoBase - 1);
  const topBrandSize    = _v('igTopBrandSize')  || (isPost ? 9 : 10);
  const cardTitleSize   = _v('igCardTitleSize') || (isPost ? 20 : 26);
  const dateFontSize    = _v('igDateSize')      || (isPost ? 10 : 11);
  const bottomBrandSize = _v('igBottomBrandSize') || Math.max(7, topBrandSize - 1);

  const moveCls = { up: c.green, down: c.rose, new: c.accent, re: c.amber, same: c.text3, '': c.text3 };
  const headerPadding = isPost ? '14px 16px' : '62px 20px 16px';
  const playsWord = t('ig_plays_word');
  const songsWord = t('ig_songs_word');
  const personalCharts = t('ig_personal_charts');

  const rows = items.map((item, i) => {
    const rank = i + 1;
    let key, name, sub2, songCount;
    if (type === 'songs') { key = songKey(item); name = item.title; sub2 = item.artist; songCount = null; }
    else if (type === 'artists') { key = item.name; name = item.name; sub2 = ''; songCount = item.songs ? item.songs.size : null; }
    else { key = item.album + '|||' + item.artist; name = item.album; sub2 = item.artist; songCount = null; }
    const { label: mvLabel, cls: mvCls } = igMovement(rank, key, type);
    const peak = igPeak(key, type, lastPeaks, peakFontSize);
    const weeks = lastPeriodStats ? (lastPeriodStats.periodsOnChart[type][key] || 1) : null;
    const weeksLabel = weeks ? (weeks === 1 ? t('ig_week_1') : t('ig_weeks_n', { n: weeks })) : null;
    const plays = item.count;
    const rowBg = i % 2 === 0 ? c.bg2 : c.bg;
    const rankColor = rank === 1 ? c.gold1 : rank === 2 ? c.text : rank === 3 ? c.amber : c.text3;
    const moveColor = moveCls[mvCls] || c.text3;
    return `<div style="display:flex;align-items:center;min-height:${rowH}px;padding:4px 10px;background:${rowBg};border-bottom:1px solid ${c.border};gap:6px;">
      <div style="font-family:'DM Mono',monospace;font-size:${rankFontSize}px;font-weight:700;color:${rankColor};min-width:28px;text-align:right;flex-shrink:0;">${rank}</div>
      ${opts.showMovement ? `<div style="font-family:'DM Mono',monospace;font-size:${Math.max(6,rankFontSize-3)}px;color:${moveColor};min-width:24px;text-align:center;line-height:1;flex-shrink:0;white-space:nowrap;">${mvLabel || '—'}</div>` : ''}
      <div style="flex:1;min-width:0;">
        <div style="font-family:'DM Sans',sans-serif;font-size:${titleFontSize}px;font-weight:600;color:${c.text};white-space:normal;word-break:break-word;line-height:1.25;">${esc(name)}</div>
        ${opts.showSubtitle && sub2 ? `<div style="font-family:'DM Sans',sans-serif;font-size:${songsCountFontSize}px;color:${c.text3};white-space:normal;word-break:break-word;line-height:1.25;">${esc(sub2)}</div>` : ''}
      </div>
      ${opts.showSubtitle && songCount !== null ? `<div style="font-family:'DM Mono',monospace;font-size:${songsCountFontSize}px;color:${c.text3};font-weight:600;white-space:nowrap;text-align:right;flex-shrink:0;">${songCount} <span style="font-size:${Math.max(5,songsCountFontSize-3)}px;font-weight:400;opacity:0.75;">${songsWord}</span></div>` : ''}
      ${opts.showPeak && peak ? `<div style="flex-shrink:0;">${peak}</div>` : ''}
      ${opts.showWeeks && weeksLabel ? `<div style="font-family:'DM Mono',monospace;font-size:${weeksFontSize}px;color:${c.text3};white-space:nowrap;flex-shrink:0;">${weeksLabel}</div>` : ''}
      ${opts.showPlays ? `<div style="font-family:'DM Mono',monospace;font-size:${playsFontSize}px;color:${c.accent};font-weight:700;white-space:nowrap;min-width:40px;text-align:right;flex-shrink:0;">${plays} <span style="font-size:${Math.max(5,playsFontSize-3)}px;font-weight:400;opacity:0.75;">${playsWord}</span></div>` : ''}
    </div>`;
  }).join('');

  return `<div style="width:${cardW}px;height:${cardH}px;background:${c.bg};overflow:hidden;display:flex;flex-direction:column;font-family:'DM Sans',sans-serif;">
    <div style="background:linear-gradient(135deg,${c.bg3},${c.surface});padding:${headerPadding};border-bottom:2px solid ${c.accent};">
      <div style="font-family:'DM Mono',monospace;font-size:${topBrandSize}px;letter-spacing:0.2em;color:${c.accent};text-transform:uppercase;margin-bottom:4px;">dankcharts.fm</div>
      <div style="font-family:'DM Sans',sans-serif;font-size:${cardTitleSize}px;font-weight:700;color:${c.text};letter-spacing:-0.02em;line-height:1.15;">${esc(cardTitle)}</div>
      ${opts.showDate ? `<div style="font-family:'DM Mono',monospace;font-size:${dateFontSize}px;color:${c.text2};margin-top:4px;letter-spacing:0.05em;">${esc(periodLine)}</div>` : ''}
    </div>
    <div style="flex:1;overflow:hidden;">${rows}</div>
    ${opts.showFooter ? `<div style="padding:8px 12px;background:${c.bg3};border-top:1px solid ${c.border};display:flex;justify-content:space-between;align-items:center;">
      <div style="font-family:'DM Mono',monospace;font-size:${bottomBrandSize}px;color:${c.text3};letter-spacing:0.12em;">dankcharts.fm · ${personalCharts}</div>
      <div style="font-family:'DM Mono',monospace;font-size:8px;color:${c.accent};letter-spacing:0.08em;text-transform:uppercase;">${playsWord}</div>
    </div>` : ''}
  </div>`;
}

function updateIgFontLabel() {
  updateIgFontLabels();
}

function updateIgFontLabels() {
  const pairs = [
    ['igTopBrandSize', 'igTopBrandSizeLabel'],
    ['igCardTitleSize', 'igCardTitleSizeLabel'],
    ['igDateSize', 'igDateSizeLabel'],
    ['igRankSize', 'igRankSizeLabel'],
    ['igTitleSize', 'igTitleSizeLabel'],
    ['igArtistSize', 'igArtistSizeLabel'],
    ['igSongsCountSize', 'igSongsCountSizeLabel'],
    ['igPeakSize', 'igPeakSizeLabel'],
    ['igWeeksSize', 'igWeeksSizeLabel'],
    ['igPlaysSize', 'igPlaysSizeLabel'],
    ['igBottomBrandSize', 'igBottomBrandSizeLabel'],
  ];
  pairs.forEach(([sliderId, labelId]) => {
    const val = parseInt(document.getElementById(sliderId)?.value || 0);
    const lbl = document.getElementById(labelId);
    if (lbl) lbl.textContent = val === 0 ? 'Auto' : val + 'px';
  });
}

function setAllIgFonts(mode) {
  const sliders = [
    { id: 'igTopBrandSize', max: 22 },
    { id: 'igCardTitleSize', max: 40 },
    { id: 'igDateSize', max: 20 },
    { id: 'igRankSize', max: 32 },
    { id: 'igTitleSize', max: 24 },
    { id: 'igArtistSize', max: 24 },
    { id: 'igSongsCountSize', max: 24 },
    { id: 'igPeakSize', max: 20 },
    { id: 'igWeeksSize', max: 20 },
    { id: 'igPlaysSize', max: 22 },
    { id: 'igBottomBrandSize', max: 22 },
  ];
  sliders.forEach(({ id, max }) => {
    const el = document.getElementById(id);
    if (el) el.value = mode === 'max' ? max : 0;
  });
  updateIgFontLabels();
  updateIgPreview();
}

function openIgPreviewModal(type) {
  igPreviewType = type;
  const titleMap = { songs: `★ ${t('ig_type_songs')}`, artists: `♦ ${t('ig_type_artists')}`, albums: `◈ ${t('ig_type_albums')}` };
  document.getElementById('igPreviewTitle').textContent = t('ig_share_title') + ' — ' + titleMap[type];
  // Reset all font sliders to Auto (0)
  ['igTopBrandSize','igCardTitleSize','igDateSize','igRankSize','igTitleSize','igArtistSize',
   'igSongsCountSize','igPeakSize','igWeeksSize','igPlaysSize','igBottomBrandSize'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 0;
  });
  // Update title label and artist row visibility based on chart type
  const titleNameLabelEl = document.getElementById('igTitleNameLabel');
  const artistRowEl = document.getElementById('igArtistSizeRow');
  const songsCountRowEl = document.getElementById('igSongsCountSizeRow');
  if (type === 'artists') {
    if (titleNameLabelEl) titleNameLabelEl.textContent = t('ig_artist_size');
    if (artistRowEl) artistRowEl.style.display = 'none';
    if (songsCountRowEl) songsCountRowEl.style.display = 'flex';
  } else {
    const titleKey = type === 'albums' ? 'ig_title_size_albums' : 'ig_title_size_songs';
    if (titleNameLabelEl) titleNameLabelEl.textContent = t(titleKey);
    if (artistRowEl) artistRowEl.style.display = 'flex';
    if (songsCountRowEl) songsCountRowEl.style.display = 'none';
  }
  updateIgFontLabels();
  // Sync checkboxes
  ['showMovement', 'showPeak', 'showWeeks', 'showPlays', 'showSubtitle', 'showDate', 'showFooter'].forEach(k => {
    const el = document.getElementById('igOpt_' + k);
    if (el) el.checked = igOptions[k];
  });
  setIgFormat(igOptions.format);
  updateIgPreview();
  document.getElementById('igPreviewModal').classList.add('open');
}

function closeIgPreviewModal() {
  document.getElementById('igPreviewModal').classList.remove('open');
  document.getElementById('igCardCanvas').innerHTML = '';
}

function setIgFormat(fmt) {
  igOptions.format = fmt;
  document.getElementById('igFmtPost').classList.toggle('active', fmt === 'post');
  document.getElementById('igFmtStory').classList.toggle('active', fmt === 'story');
  updateIgPreview();
}

function updateIgPreview() {
  if (!igPreviewType) return;
  // Read checkboxes
  ['showMovement', 'showPeak', 'showWeeks', 'showPlays', 'showSubtitle', 'showDate', 'showFooter'].forEach(k => {
    const el = document.getElementById('igOpt_' + k);
    if (el) igOptions[k] = el.checked;
  });
  const isPost = igOptions.format === 'post';
  const cardW = 540, cardH = isPost ? 540 : 960;
  const scale = isPost ? 0.5 : 0.4;
  const html = buildIgCardHTML(igPreviewType, igOptions);
  if (!html) return;

  // Update live preview (scaled)
  const frame = document.getElementById('igPreviewFrame');
  const inner = document.getElementById('igPreviewInner');
  frame.style.width = Math.round(cardW * scale) + 'px';
  frame.style.height = Math.round(cardH * scale) + 'px';
  inner.innerHTML = html;
  inner.style.width = cardW + 'px';
  inner.style.height = cardH + 'px';
  inner.style.transform = `scale(${scale})`;
  inner.style.transformOrigin = 'top left';

  // Update off-screen canvas for download
  const canvas = document.getElementById('igCardCanvas');
  canvas.innerHTML = html;
  canvas.style.width = cardW + 'px';
  canvas.style.height = cardH + 'px';
}

function downloadIgFromPreview() {
  const btn = document.getElementById('igDownloadBtn');
  const origText = btn.textContent;
  btn.textContent = '⏳ Generating…';
  btn.disabled = true;
  const isPost = igOptions.format === 'post';
  const cardW = 540, cardH = isPost ? 540 : 960;
  const canvas = document.getElementById('igCardCanvas');
  const { label, sub } = getDateRange();
  const typeLabel = { songs: 'Songs', artists: 'Artists', albums: 'Albums' }[igPreviewType];
  const periodSlug = (currentPeriod === 'alltime') ? 'AllTime' : (sub || label).replace(/[^a-z0-9]/gi, '').slice(0, 20);
  html2canvas(canvas, {
    scale: 2, useCORS: false, allowTaint: true, backgroundColor: null, logging: false, width: cardW, height: cardH,
  }).then(cvs => {
    const link = document.createElement('a');
    link.download = `dankcharts_${typeLabel}_${periodSlug}_${igOptions.format}.png`;
    link.href = cvs.toDataURL('image/png');
    link.click();
    btn.textContent = origText;
    btn.disabled = false;
  }).catch(() => {
    btn.textContent = origText;
    btn.disabled = false;
  });
}

document.getElementById('igPreviewModal').addEventListener('click', e => {
  if (e.target === document.getElementById('igPreviewModal')) closeIgPreviewModal();
});

// ─── CHART RUN SHARE IMAGE ──────────────────────────────────────
let crIgState = { type: null, key: null, rank: 0, format: 'post', rangeMode: 'now', imgUrl: null, imgSource: 'deezer', entPostImgUrl: null, entPostImgSource: 'deezer', mode: 'chartrun', viewedYear: null, cutoffKeys: null, entPostDescMode: 'auto', entPostDescCustom: '', entPostDescVariant: 0 };

function setCrIgMode(mode) {
  crIgState.mode = mode;
  document.getElementById('crIgModeChartRun').classList.toggle('active', mode === 'chartrun');
  document.getElementById('crIgModeEntry').classList.toggle('active', mode === 'entrypost');
  document.getElementById('crIgChartRunControls').style.display = mode === 'chartrun' ? '' : 'none';
  document.getElementById('crIgEntryControls').style.display = mode === 'entrypost' ? '' : 'none';
  // Keep format buttons in sync across both panels
  const fmt = crIgState.format;
  document.getElementById('entPostFmtPost').classList.toggle('active', fmt === 'post');
  document.getElementById('entPostFmtStory').classList.toggle('active', fmt === 'story');
  updateCrIgPreview();
}

function _syncEntPostSrcBtns() {
  ['deezer', 'itunes', 'lastfm', 'youtube'].forEach(s => {
    const el = document.getElementById('entPostSrc_' + s);
    if (el) el.classList.toggle('active', s === crIgState.entPostImgSource);
  });
}

function setEntPostImgSource(source) {
  crIgState.entPostImgSource = source;
  _syncEntPostSrcBtns();
  crIgState.entPostImgUrl = null;
  updateCrIgPreview();
  _fetchEntPostImage(crIgState.type, crIgState.key);
}

async function _fetchEntPostImage(type, key) {
  const source = crIgState.entPostImgSource;
  try {
    let url = null;
    const crAny = (allChartRun.year && allChartRun.year.result && allChartRun.year.result[type] && allChartRun.year.result[type][key])
      || (allChartRun.month && allChartRun.month.result && allChartRun.month.result[type] && allChartRun.month.result[type][key])
      || (allChartRun.week && allChartRun.week.result && allChartRun.week.result[type] && allChartRun.week.result[type][key]);
    if (source !== 'off') {
      if (type === 'artists') {
        url = await getArtistImage(key, source);
      } else if (type === 'songs') {
        const artist2 = (crAny && crAny._artist) || key.split('|||')[1] || '';
        const title2 = (crAny && crAny._title) || key.split('|||')[0] || key;
        url = await getTrackImage(title2, artist2, source);
      } else {
        const artist2 = (crAny && crAny._artist) || key.split('|||')[1] || '';
        const album2 = (crAny && crAny._album) || key.split('|||')[0] || key;
        url = await getAlbumImage(album2, artist2, source);
      }
    }
    crIgState.entPostImgUrl = url || null;
  } catch (e) { crIgState.entPostImgUrl = null; }
  if (document.getElementById('crIgModal').classList.contains('open') && crIgState.key === key && crIgState.mode === 'entrypost') {
    updateCrIgPreview();
  }
}

function updateEntPostSizeLabels() {
  [['entPostBrandSize', 'entPostBrandSizeLabel'], ['entPostChartNameSize', 'entPostChartNameSizeLabel'], ['entPostWeekDateSize', 'entPostWeekDateSizeLabel'], ['entPostImageSize', 'entPostImageSizeLabel'], ['entPostTitleSize', 'entPostTitleSizeLabel'],
  ['entPostSubtitleSize', 'entPostSubtitleSizeLabel'], ['entPostAlbumSize', 'entPostAlbumSizeLabel'],
  ['entPostDescSize', 'entPostDescSizeLabel'], ['entPostMvSize', 'entPostMvSizeLabel'], ['entPostRankSize', 'entPostRankSizeLabel'], ['entPostStatusY', 'entPostStatusYLabel']].forEach(([id, lbl]) => {
    const v = parseInt(document.getElementById(id)?.value || 0);
    const el = document.getElementById(lbl);
    if (el) el.textContent = v !== 0 ? v + 'px' : 'Auto';
  });
}

function syncEntPostTitleLabel(type) {
  const el = document.getElementById('entPostTitleSizeText');
  if (!el) return;
  el.textContent = type === 'songs' ? t('ep_title_song') : t('ep_title');
}

function setEntPostAllSliders(toMax) {
  // Respect current format limits (Story has higher caps for some sliders).
  applyEntPostFormatLimits(crIgState.format || 'post');
  const sliderIds = [
    'entPostBrandSize', 'entPostChartNameSize', 'entPostWeekDateSize', 'entPostImageSize', 'entPostTitleSize',
    'entPostSubtitleSize', 'entPostAlbumSize', 'entPostDescSize', 'entPostMvSize',
    'entPostRankSize', 'entPostStatusY'
  ];
  sliderIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const target = toMax ? parseInt(el.max || el.value || '0', 10) : parseInt(el.min || '0', 10);
    el.value = String(Number.isFinite(target) ? target : 0);
  });
  updateEntPostSizeLabels();
  updateCrIgPreview();
}

function setCrIgAllSliders(toMax) {
  const sliderIds = ['crIgImageScale', 'crIgBrandSize', 'crIgTitleSize', 'crIgWeekDateSize', 'crIgSectionSize', 'crIgBoxSize'];
  sliderIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const target = toMax ? parseInt(el.max || el.value || '0', 10) : parseInt(el.min || '0', 10);
    el.value = String(Number.isFinite(target) ? target : 0);
  });
  updateCrIgSizeLabels();
  updateCrIgPreview();
}

function _syncEntPostDescModeBtns() {
  const isAuto = crIgState.entPostDescMode !== 'custom';
  document.getElementById('entPostDescModeAuto')?.classList.toggle('active', isAuto);
  document.getElementById('entPostDescModeCustom')?.classList.toggle('active', !isAuto);
}

function setEntPostDescMode(mode) {
  crIgState.entPostDescMode = mode === 'custom' ? 'custom' : 'auto';
  _syncEntPostDescModeBtns();
  updateCrIgPreview();
}

function updateEntPostCustomDescription(val) {
  crIgState.entPostDescCustom = String(val || '');
  crIgState.entPostDescMode = crIgState.entPostDescCustom.trim() ? 'custom' : 'auto';
  _syncEntPostDescModeBtns();
  updateCrIgPreview();
}

function shuffleEntPostDescription() {
  crIgState.entPostDescMode = 'auto';
  crIgState.entPostDescVariant = (crIgState.entPostDescVariant || 0) + 1;
  _syncEntPostDescModeBtns();
  updateCrIgPreview();
}

function openCrIgModal(type, encodedKey, rank) {
  const key = decodeURIComponent(encodedKey);
  crIgState.type = type; crIgState.key = key; crIgState.rank = rank || 0;
  syncEntPostTitleLabel(type);

  // Store which period opened the modal so card rendering stays context-aware
  crIgState.period = currentPeriod;
  crIgState.viewedYear = getViewedYear();
  crIgState.cutoffKeys = getViewedCutoffKeys();

  // Rebuild chart run(s) with the correct chartSize for each period (offset=0 = full history)
  const _savedOffset = currentOffset;
  const _savedSize = chartSize;
  currentOffset = 0;
  if (currentPeriod === 'week') {
    chartSize = chartSizeWeekly;
    allChartRun.week = buildChartRun('week');
  } else if (currentPeriod === 'month') {
    chartSize = chartSizeMonthly;
    allChartRun.month = buildChartRun('month');
  } else {
    // Yearly: rebuild both month and week with their own correct sizes
    chartSize = chartSizeMonthly; allChartRun.month = buildChartRun('month');
    chartSize = chartSizeWeekly; allChartRun.week = buildChartRun('week');
  }
  currentOffset = _savedOffset;
  chartSize = _savedSize;
  allChartRunIsFullHistory = true;

  // Show/hide "Include Chart Runs" — only meaningful for yearly view
  document.getElementById('crIgIncludeGroup').style.display =
    (currentPeriod === 'week' || currentPeriod === 'month') ? 'none' : '';

  // Header title
  let name = key.split('|||')[0];
  const crAny = allChartRun.year?.result?.[type]?.[key] || allChartRun.month?.result?.[type]?.[key];
  if (crAny) {
    if (type === 'songs') name = crAny._title || name;
    if (type === 'albums') name = crAny._album || name;
  }
  const titleKey = { songs: 'cr_modal_title_songs', artists: 'cr_modal_title_artists', albums: 'cr_modal_title_albums' }[type];
  document.getElementById('crIgTitle').textContent = t(titleKey) + ' — ' + name.slice(0, 40);

  // Sync range mode with current chart run panel setting
  crIgState.rangeMode = getCrRangeMode(type, key);
  // Update IG range button labels to be context-aware
  const _vy = getViewedYear();
  let _igLabels, _igTitles;
  if (currentPeriod === 'week') {
    _igLabels = { year: t('cr_ytd', { year: _vy }), uptoYear: t('cr_up_to_this_week'), now: t('cr_all_time') };
    _igTitles = {
      year: t('tooltip_cr_ytd_week'),
      uptoYear: t('tooltip_cr_upto_week'),
      now: t('tooltip_cr_all_time_range')
    };
  } else if (currentPeriod === 'month') {
    _igLabels = { year: t('cr_ytd', { year: _vy }), uptoYear: t('cr_up_to_this_month'), now: t('cr_all_time') };
    _igTitles = {
      year: t('tooltip_cr_ytd_month'),
      uptoYear: t('tooltip_cr_upto_month'),
      now: t('tooltip_cr_all_time_range')
    };
  } else {
    _igLabels = { year: t('cr_year_only_label', { year: _vy }), uptoYear: t('cr_up_to_year_label', { year: _vy }), now: t('cr_all_time') };
    _igTitles = {
      year: t('tooltip_cr_year_only_range'),
      uptoYear: t('tooltip_cr_upto_year_range'),
      now: t('tooltip_cr_all_time_range')
    };
  }
  const _rYear = document.getElementById('crIgRangeYear');
  const _rUpto = document.getElementById('crIgRangeUptoYear');
  const _rNow = document.getElementById('crIgRangeNow');
  _rYear.textContent = _igLabels.year; _rYear.title = _igTitles.year;
  _rUpto.textContent = _igLabels.uptoYear; _rUpto.title = _igTitles.uptoYear;
  _rNow.textContent = _igLabels.now; _rNow.title = _igTitles.now;
  setCrIgRange(crIgState.rangeMode);
  setCrIgFormat(crIgState.format);
  // Reset all size sliders
  ['crIgTitleSize', 'crIgBrandSize', 'crIgSectionSize', 'crIgBoxSize'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = 0;
  });
  updateCrIgSizeLabels();
  const descInput = document.getElementById('entPostDescCustom');
  if (descInput) descInput.value = crIgState.entPostDescCustom || '';
  _syncEntPostDescModeBtns();
  // Reset image source to deezer and update source button states
  crIgState.imgSource = 'deezer';
  _syncCrIgSrcBtns();
  // Clear previous images, start fresh fetch
  crIgState.imgUrl = null;
  crIgState.entPostImgUrl = null;
  crIgState.entPostImgSource = 'deezer';
  _syncEntPostSrcBtns();
  // Close artist modal so it doesn't stack on top of the IG modal
  document.getElementById('artistModal')?.classList.remove('open');
  setCrIgMode('chartrun'); // always open on chart run tab; resets preview
  document.getElementById('crIgModal').classList.add('open');
  fetchCrIgImage(type, key);
  _fetchEntPostImage(type, key);
}

// Fetches cover art for the given type/key using crIgState.imgSource
async function fetchCrIgImage(type, key) {
  const source = crIgState.imgSource;
  try {
    let url = null;
    if (source === 'off') {
      crIgState.imgUrl = null;
    } else {
      const crAny2 = allChartRun.year?.result?.[type]?.[key] || allChartRun.month?.result?.[type]?.[key] || allChartRun.week?.result?.[type]?.[key];
      if (type === 'artists') {
        url = await getArtistImage(key, source);
      } else if (type === 'songs') {
        const artist2 = crAny2?._artist || key.split('|||')[1] || '';
        const title2 = crAny2?._title || key.split('|||')[0] || key;
        url = await getTrackImage(title2, artist2, source);
      } else if (type === 'albums') {
        const artist2 = crAny2?._artist || key.split('|||')[1] || '';
        const album2 = crAny2?._album || key.split('|||')[0] || key;
        url = await getAlbumImage(album2, artist2, source);
      }
      crIgState.imgUrl = url || null;
    }
  } catch (e) { crIgState.imgUrl = null; }
  if (document.getElementById('crIgModal').classList.contains('open') && crIgState.key === key) {
    updateCrIgPreview();
  }
}

// Sync source button active states to crIgState.imgSource
function _syncCrIgSrcBtns() {
  ['deezer', 'itunes', 'lastfm', 'youtube'].forEach(s => {
    document.getElementById('crIgSrc_' + s)?.classList.toggle('active', s === crIgState.imgSource);
  });
}

function setCrIgImgSource(source) {
  crIgState.imgSource = source;
  _syncCrIgSrcBtns();
  crIgState.imgUrl = null;       // clear cached URL so preview shows loading state
  updateCrIgPreview();           // render immediately without image
  fetchCrIgImage(crIgState.type, crIgState.key); // then fetch + refresh
}

function updateCrIgSizeLabels() {
  [
    ['crIgTitleSize', 'crIgTitleSizeLabel'],
    ['crIgBrandSize', 'crIgBrandSizeLabel'],
    ['crIgWeekDateSize', 'crIgWeekDateSizeLabel'],
    ['crIgSectionSize', 'crIgSectionSizeLabel'],
    ['crIgBoxSize', 'crIgBoxSizeLabel'],
  ].forEach(([sliderId, labelId]) => {
    const val = parseInt(document.getElementById(sliderId)?.value || 0);
    const lbl = document.getElementById(labelId);
    if (lbl) lbl.textContent = val === 0 ? 'Auto' : val + 'px';
  });
  // Update Image Scale label
  const scaleVal = parseInt(document.getElementById('crIgImageScale')?.value || 100);
  const scaleLbl = document.getElementById('crIgImageScaleLabel');
  if (scaleLbl) scaleLbl.textContent = scaleVal + '%';
}
// Keep backward-compat alias used by openCrIgModal
function updateCrIgTitleSizeLabel() { updateCrIgSizeLabels(); }

function closeCrIgModal() {
  document.getElementById('crIgModal').classList.remove('open');
  document.getElementById('crIgCanvas').innerHTML = '';
}

function applyCrIgFormatLimits(fmt) {
  const isStory = fmt === 'story';
  // Increase max values for Section px and Boxes px in Story format
  const sectionSlider = document.getElementById('crIgSectionSize');
  const boxSlider = document.getElementById('crIgBoxSize');
  if (sectionSlider) {
    sectionSlider.max = String(isStory ? 32 : 18);
    if (parseInt(sectionSlider.value || '0', 10) > parseInt(sectionSlider.max, 10)) sectionSlider.value = sectionSlider.max;
  }
  if (boxSlider) {
    boxSlider.max = String(isStory ? 40 : 22);
    if (parseInt(boxSlider.value || '0', 10) > parseInt(boxSlider.max, 10)) boxSlider.value = boxSlider.max;
  }
  updateCrIgSizeLabels();
}

function applyEntPostFormatLimits(fmt) {
  const isStory = fmt === 'story';
  const chartSlider = document.getElementById('entPostChartNameSize');
  const rankSlider = document.getElementById('entPostRankSize');
  if (chartSlider) {
    chartSlider.max = String(isStory ? 44 : 28);
    if (parseInt(chartSlider.value || '0', 10) > parseInt(chartSlider.max, 10)) chartSlider.value = chartSlider.max;
  }
  if (rankSlider) {
    rankSlider.max = String(isStory ? 180 : 120);
    if (parseInt(rankSlider.value || '0', 10) > parseInt(rankSlider.max, 10)) rankSlider.value = rankSlider.max;
  }
  updateEntPostSizeLabels();
}

function setCrIgFormat(fmt) {
  crIgState.format = fmt;
  document.getElementById('crIgFmtPost').classList.toggle('active', fmt === 'post');
  document.getElementById('crIgFmtStory').classList.toggle('active', fmt === 'story');
  document.getElementById('entPostFmtPost').classList.toggle('active', fmt === 'post');
  document.getElementById('entPostFmtStory').classList.toggle('active', fmt === 'story');
  applyCrIgFormatLimits(fmt);
  applyEntPostFormatLimits(fmt);
  updateCrIgPreview();
}

function setCrIgRange(mode) {
  crIgState.rangeMode = mode;
  ['year', 'uptoYear', 'now'].forEach(m => {
    const id = { year: 'crIgRangeYear', uptoYear: 'crIgRangeUptoYear', now: 'crIgRangeNow' }[m];
    document.getElementById(id)?.classList.toggle('active', m === mode);
  });
  updateCrIgPreview();
}

function buildCrIgCardHTML(type, key, opts) {
  const c = igColors();
  const isPost = opts.format === 'post';
  const cardW = 540, cardH = isPost ? 540 : 960;

  // Resolve display name
  let displayName = key.split('|||')[0], artistName = key.split('|||')[1] || '';
  const crAny = allChartRun.year?.result?.[type]?.[key] || allChartRun.month?.result?.[type]?.[key] || allChartRun.week?.result?.[type]?.[key];
  if (crAny) {
    if (type === 'songs') { displayName = crAny._title || displayName; artistName = crAny._artist || artistName; }
    if (type === 'albums') { displayName = crAny._album || displayName; artistName = crAny._artist || artistName; }
    if (type === 'artists') { displayName = key; artistName = ''; }
  }

  // Only show sections relevant to the period that opened the modal
  const _activePeriod = opts.period || currentPeriod;
  const periodConf = _activePeriod === 'week'
    ? [{ id: 'week', label: t('cr_weekly_label').toUpperCase(), check: true }]
    : _activePeriod === 'month'
      ? [{ id: 'month', label: t('cr_monthly_label').toUpperCase(), check: true }]
      : [
        { id: 'year', label: t('cr_yearly_label').toUpperCase(), check: opts.showYear },
        { id: 'month', label: t('cr_monthly_label').toUpperCase(), check: opts.showMonth },
        { id: 'week', label: t('cr_weekly_label').toUpperCase(), check: opts.showWeek },
      ];

  const rangeMode = opts.rangeMode || 'now';
  const vy = getViewedYear();
  const cutoffKeys = getViewedCutoffKeys();
  let rangeLabelMap;
  if (_activePeriod === 'week') {
    rangeLabelMap = { year: t('cr_ytd', { year: vy }), uptoYear: t('cr_up_to_this_week'), now: t('cr_all_time') };
  } else if (_activePeriod === 'month') {
    rangeLabelMap = { year: t('cr_ytd', { year: vy }), uptoYear: t('cr_up_to_this_month'), now: t('cr_all_time') };
  } else {
    rangeLabelMap = { year: t('cr_year_only_label', { year: vy }), uptoYear: t('cr_up_to_year_label', { year: vy }), now: t('cr_all_time') };
  }
  const sections = periodConf.filter(p => p.check).map(pc => {
    const crData = allChartRun[pc.id];
    if (!crData?.result?.[type]?.[key]) return '';
    const rawD = crData.result[type][key];
    const d = filterCrD(rawD, pc.id, rangeMode, vy, cutoffKeys);
    if (!d) return '';
    const period = pc.id;
    const n = d.entries.length;
    const peak = d.peak;
    const top1 = d.entries.filter(e => e.rank === 1).length;
    const top5 = d.entries.filter(e => e.rank <= 5).length;
    const top10 = d.entries.filter(e => e.rank <= 10).length;
    const pSize = (opts.chartSizes && opts.chartSizes[period]) ?? Infinity; // chartSize for this period
    // Box sizing — driven by opts.boxSize slider (auto = 11px for rank)
    const boxRankSize = opts.boxSize || 11;
    const boxLabelSize = Math.max(5, boxRankSize - 4.5);
    const baseW = period === 'week' ? 30 : 36;
    const boxW = opts.boxSize ? Math.round(opts.boxSize * (period === 'week' ? 2.8 : 3.3)) : baseW;
    const gap = Math.max(2, Math.round(boxW * 0.09));
    // 2D capacity: how many boxes fit across multiple wrapped rows
    const boxesPerRow = Math.max(1, Math.floor((cardW - 28) / (boxW + gap)));
    const pad = Math.max(2, Math.round(boxRankSize * 0.27));
    const boxH = Math.ceil(boxRankSize + Math.max(5, boxRankSize - 4.5) + pad * 2 + 4);
    const rowH = boxH + gap;
    const numSecs = Math.max(1, periodConf.filter(p => p.check).length);
    const bodyH = cardH - (isPost ? 90 : 120) - (opts.showFooter ? 24 : 0) - (isPost ? 20 : 28);
    const secAvailH = Math.floor(bodyH / numSecs) - ((opts.sectionSize || 8) * 2 + 22);
    const maxRows = Math.max(2, Math.floor(secAvailH / rowH));
    const maxBoxes = maxRows * boxesPerRow;
    const shown = d.entries.length <= maxBoxes ? d.entries : d.entries.slice(-maxBoxes);
    const truncated = d.entries.length > maxBoxes;

    const secSize = opts.sectionSize || 8;
    const lFont = `'${opts.labelFont || 'DM Mono'}',monospace`;

    // Inline peak badge matching chart style (gold/silver/bronze)
    const _peakBadge = (p) => {
      const fs = (secSize + 1) + 'px';
      const base = `font-family:${lFont};font-size:${fs};padding:1px 5px;border-radius:3px;letter-spacing:0.05em;white-space:nowrap;font-weight:700;`;
      const peakLabel = t('peak_label');
      if (p === 1) return `<span style="${base}background:rgba(245,158,11,0.2);color:#f0aa30;border:1px solid rgba(245,158,11,0.45);">${peakLabel} #1</span>`;
      if (p === 2) return `<span style="${base}background:rgba(148,163,184,0.2);color:#94a3b8;border:1px solid rgba(148,163,184,0.4);">${peakLabel} #2</span>`;
      if (p === 3) return `<span style="${base}background:rgba(192,120,80,0.2);color:#c07850;border:1px solid rgba(192,120,80,0.4);">${peakLabel} #3</span>`;
      return `<span style="${base}background:rgba(255,255,255,0.08);color:#7aa0d0;border:1px solid rgba(255,255,255,0.14);">${peakLabel} #${p}</span>`;
    };
    // Stat chip: bold value + dimmed label
    const _stat = (val, label) => `<span style="font-family:${lFont};font-size:${secSize}px;color:${c.text3};white-space:nowrap;"><strong style="color:${c.text};font-size:${secSize + 1}px;font-weight:700;">${val}</strong> ${label}</span>`;

    const boxesHtml = shown.map(e => {
      const isPeak = e.rank === d.peak;
      const bg = isPeak ? 'rgba(245,158,11,0.1)' : 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), ' + c.surface;
      const border = isPeak ? 'rgba(245,158,11,0.45)' : 'rgba(255,255,255,0.22)';
      const rc = isPeak ? c.gold1 : c.text;
      return `<div style="background:${bg};border:1px solid ${border};border-radius:4px;padding:${pad}px ${pad + 1}px;text-align:center;min-width:${boxW}px;flex-shrink:0;">
        <div style="font-family:'DM Serif Display',serif;font-size:${boxRankSize}px;font-weight:700;color:${rc};line-height:1.1">#${e.rank}</div>
        <div style="font-family:${lFont};font-size:${boxLabelSize}px;color:${c.text3};white-space:nowrap;margin-top:2px">${e.label}</div>
      </div>`;
    }).join('');

    return `<div style="margin-bottom:9px;">
      <div style="font-family:${lFont};font-size:${secSize}px;letter-spacing:0.14em;color:${c.accent};text-transform:uppercase;margin-bottom:4px;">${pc.label}</div>
      ${opts.showSectionSummary ? `<div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:5px;">
        ${_stat(n + ' ' + (period === 'week' ? tUnit('cr_week', n) : period === 'month' ? tUnit('months', n) : tUnit('years', n)), t('cr_on_chart'))}
        ${_peakBadge(peak)}
        ${top1 ? _stat(top1 + ' ' + (period === 'week' ? tUnit('cr_week', top1) : period === 'month' ? tUnit('months', top1) : tUnit('years', top1)), t('cr_at_1')) : ''}
        ${top5 && 5 < pSize ? _stat(top5 + ' ' + (period === 'week' ? tUnit('cr_week', top5) : period === 'month' ? tUnit('months', top5) : tUnit('years', top5)), t('cr_in_top5')) : ''}
        ${top10 && 10 < pSize ? _stat(top10 + ' ' + (period === 'week' ? tUnit('cr_week', top10) : period === 'month' ? tUnit('months', top10) : tUnit('years', top10)), t('cr_in_top10')) : ''}
        ${truncated ? `<span style="font-family:${lFont};font-size:${secSize}px;color:${c.text3};">· ${t('cr_last_shown', { n: maxBoxes })}</span>` : ''}
      </div>` : ''}
      <div style="display:flex;flex-wrap:wrap;gap:${gap}px;">${boxesHtml}</div>
    </div>`;
  }).filter(Boolean);

  if (!sections.length) return '';

  const tFont = `'${opts.titleFont || 'DM Sans'}',sans-serif`;
  const lFont2 = `'${opts.labelFont || 'DM Mono'}',monospace`;
  const autoTitleSize = isPost ? 17 : 22;
  const titleFontSize = opts.titleSize || autoTitleSize;
  const subtitleSize = Math.max(10, titleFontSize - 6);
  const brandFontSize = opts.brandSize || 8;
  const weekDateFontSize = opts.weekDateSize || (isPost ? 9 : 11);
  const dr2 = getDateRange();
  const periodLine2 = _activePeriod === 'week' ? (dr2.sub || dr2.label)
    : _activePeriod === 'month' ? dr2.label
      : _activePeriod === 'year' ? dr2.label
        : null;
  let imgSize = isPost ? 64 : 80;
  // Apply image scale to cover art size
  if (opts.imageScale) {
    imgSize = Math.round(imgSize * opts.imageScale);
  }
  const typeLabel = t('cr_type_' + (type === 'songs' ? 'song' : type === 'artists' ? 'artist' : 'album'));
  const showImg = opts.showImage && opts.imgUrl;
  const headerPad = isPost ? '12px 16px' : '62px 20px 16px';
  const headerInner = `
    <div style="font-family:${lFont2};font-size:${brandFontSize}px;letter-spacing:0.2em;color:${c.accent};text-transform:uppercase;margin-bottom:${showImg ? '4' : '3'}px;">dankcharts.fm · ${typeLabel} CHART RUN · ${rangeLabelMap[rangeMode]}</div>
    <div style="font-family:${tFont};font-size:${titleFontSize}px;font-weight:700;color:${c.text};line-height:1.15;letter-spacing:-0.02em;">${esc(displayName)}</div>
    ${opts.showSubtitle && artistName ? `<div style="font-family:${tFont};font-size:${subtitleSize}px;color:${c.text3};margin-top:2px;">${esc(artistName)}</div>` : ''}
    ${opts.showWeekDate && periodLine2 ? `<div style="font-family:${lFont2};font-size:${weekDateFontSize}px;color:${c.text3};letter-spacing:0.1em;margin-top:3px;text-transform:uppercase;">${esc(periodLine2)}</div>` : ''}
  `;
  const headerContent = showImg
    ? `<div style="display:flex;align-items:center;gap:12px;">
        <img src="${opts.imgUrl}" crossorigin="anonymous" style="width:${imgSize}px;height:${imgSize}px;object-fit:cover;border-radius:6px;flex-shrink:0;border:1px solid ${c.border};">
        <div style="flex:1;min-width:0;">${headerInner}</div>
       </div>`
    : headerInner;
  return `<div style="width:${cardW}px;height:${cardH}px;background:${c.bg};overflow:hidden;display:flex;flex-direction:column;font-family:${tFont};">
    <div style="background:linear-gradient(135deg,${c.bg3},${c.surface});padding:${headerPad};border-bottom:2px solid ${c.accent};flex-shrink:0;">${headerContent}</div>
    <div style="flex:1;overflow:hidden;padding:${isPost ? '10px 14px' : '14px 18px'};">${sections.join('<div style="height:1px;background:' + c.border + ';margin:6px 0;"></div>')}</div>
    ${opts.showFooter ? `<div style="padding:7px 12px;background:${c.bg3};border-top:1px solid ${c.border};flex-shrink:0;"><div style="font-family:${lFont2};font-size:${brandFontSize}px;color:${c.text3};letter-spacing:0.12em;">dankcharts.fm · PERSONAL MUSIC CHARTS</div></div>` : ''}
  </div>`;
}

function updateCrIgPreview() {
  if (!crIgState.type) return;
  const _sz = id => { const v = parseInt(document.getElementById(id)?.value || 0); return v > 0 ? v : null; };
  const isPost = crIgState.format === 'post';
  const cardW = 540, cardH = isPost ? 540 : 960;
  const scale = isPost ? 0.5 : 0.4;
  let html;
  if (crIgState.mode === 'entrypost') {
    const opts = {
      format: crIgState.format,
      period: crIgState.period || currentPeriod,
      viewedYear: crIgState.viewedYear,
      cutoffKeys: crIgState.cutoffKeys,
      descMode: crIgState.entPostDescMode,
      descCustom: crIgState.entPostDescCustom,
      descVariant: crIgState.entPostDescVariant || 0,
      showWeekDate: (document.getElementById('entPostOpt_showWeekDate') || { checked: true }).checked,
      showDescription: (document.getElementById('entPostOpt_showDescription') || { checked: true }).checked,
      showSubtitle: (document.getElementById('entPostOpt_showSubtitle') || { checked: true }).checked,
      showMovement: (document.getElementById('entPostOpt_showMovement') || { checked: true }).checked,
      showFooter: (document.getElementById('entPostOpt_showFooter') || { checked: true }).checked,
      showImage: (document.getElementById('entPostOpt_showImage') || { checked: true }).checked,
      imgUrl: crIgState.entPostImgUrl,
      chartNameSize: _sz('entPostChartNameSize'),
      entBrandSize: _sz('entPostBrandSize'),
      entWeekDateSize: _sz('entPostWeekDateSize'),
      entTitleSize: _sz('entPostTitleSize'),
      entSubtitleSize: _sz('entPostSubtitleSize'),
      entAlbumSize: _sz('entPostAlbumSize'),
      entDescSize: _sz('entPostDescSize'),
      entImageSize: _sz('entPostImageSize'),
      entRankSize: _sz('entPostRankSize'),
      entMvSize: _sz('entPostMvSize'),
      entStatusY: parseInt(document.getElementById('entPostStatusY')?.value || 0),
    };
    html = buildEntryIgCardHTML(crIgState.type, crIgState.key, crIgState.rank, opts);
  } else {
    const opts = {
      format: crIgState.format,
      rangeMode: crIgState.rangeMode,
      period: crIgState.period || currentPeriod,
      chartSizes: { year: Infinity, month: chartSizeMonthly, week: chartSizeWeekly },
      showYear: document.getElementById('crIgOpt_showYear')?.checked ?? true,
      showMonth: document.getElementById('crIgOpt_showMonth')?.checked ?? true,
      showWeek: document.getElementById('crIgOpt_showWeek')?.checked ?? true,
      showWeekDate: document.getElementById('crIgOpt_showWeekDate')?.checked ?? true,
      showSubtitle: document.getElementById('crIgOpt_showSubtitle')?.checked ?? true,
      showFooter: document.getElementById('crIgOpt_showFooter')?.checked ?? true,
      showImage: document.getElementById('crIgOpt_showImage')?.checked ?? true,
      showSectionSummary: document.getElementById('crIgOpt_showSectionSummary')?.checked ?? true,
      imgUrl: crIgState.imgUrl,
      titleFont: document.getElementById('crIgTitleFont')?.value || 'DM Sans',
      labelFont: document.getElementById('crIgLabelFont')?.value || 'DM Mono',
      titleSize: _sz('crIgTitleSize'),
      brandSize: _sz('crIgBrandSize'),
      weekDateSize: _sz('crIgWeekDateSize'),
      sectionSize: _sz('crIgSectionSize'),
      boxSize: _sz('crIgBoxSize'),
      imageScale: parseInt(document.getElementById('crIgImageScale')?.value || 100) / 100,
    };
    html = buildCrIgCardHTML(crIgState.type, crIgState.key, opts);
  }
  if (!html) return;
  const frame = document.getElementById('crIgPreviewFrame');
  const inner = document.getElementById('crIgPreviewInner');
  frame.style.width = Math.round(cardW * scale) + 'px';
  frame.style.height = Math.round(cardH * scale) + 'px';
  inner.innerHTML = html;
  inner.style.width = cardW + 'px';
  inner.style.height = cardH + 'px';
  inner.style.transform = `scale(${scale})`;
  inner.style.transformOrigin = 'top left';
  const cvs = document.getElementById('crIgCanvas');
  cvs.innerHTML = html;
  cvs.style.width = cardW + 'px'; cvs.style.height = cardH + 'px';
}

function downloadCrIg() {
  const btn = document.getElementById('crIgDownloadBtn');
  const orig = btn.textContent; btn.textContent = '⏳ Generating…'; btn.disabled = true;
  const isPost = crIgState.format === 'post';
  const cardW = 540, cardH = isPost ? 540 : 960;
  const cvs = document.getElementById('crIgCanvas');
  const slug = (crIgState.key.split('|||')[0] || 'entry').replace(/[^a-z0-9]/gi, '').slice(0, 20);
  const prefix = crIgState.mode === 'entrypost' ? 'dankcharts_entry_' : 'dankcharts_chartrun_';
  html2canvas(cvs, { scale: 2, useCORS: true, allowTaint: false, backgroundColor: null, logging: false, width: cardW, height: cardH })
    .then(c => {
      const a = document.createElement('a');
      a.download = prefix + slug + '_' + crIgState.format + '.png';
      a.href = c.toDataURL('image/png'); a.click();
      btn.textContent = orig; btn.disabled = false;
    }).catch(err => { console.error('Download failed:', err); btn.textContent = orig; btn.disabled = false; });
}

document.getElementById('crIgModal').addEventListener('click', e => {
  if (e.target === document.getElementById('crIgModal')) closeCrIgModal();
});

// ─── ENTRY SHARE IMAGE (builders only — UI lives in crIgModal) ──

function buildEntryIgCardHTML(type, key, rank, opts) {
  const c = igColors();
  const isPost = opts.format === 'post';
  const cardW = 540, cardH = isPost ? 540 : 960;
  const period = opts.period || currentPeriod;

  // Resolve display names from chart run data
  let displayName = key.split('|||')[0], artistName = key.split('|||')[1] || '', albumName = '';
  const crAny = (allChartRun[period] && allChartRun[period].result && allChartRun[period].result[type] && allChartRun[period].result[type][key])
    || (allChartRun.year && allChartRun.year.result && allChartRun.year.result[type] && allChartRun.year.result[type][key])
    || (allChartRun.month && allChartRun.month.result && allChartRun.month.result[type] && allChartRun.month.result[type][key])
    || (allChartRun.week && allChartRun.week.result && allChartRun.week.result[type] && allChartRun.week.result[type][key]);
  if (crAny) {
    if (type === 'songs') { displayName = crAny._title || displayName; artistName = crAny._artist || artistName; }
    if (type === 'albums') { displayName = crAny._album || displayName; artistName = crAny._artist || artistName; }
    if (type === 'artists') { displayName = key; artistName = ''; }
  }
  if (type === 'songs') {
    const s = fullData.songs && fullData.songs.find(function (s2) { return songKey(s2) === key; });
    if (s) albumName = s.album || '';
  }

  // Period header text (descriptive title with chart size + type + date range)
  const dr = getDateRange();
  const typeWord = t('ep_type_' + type) || 'Entries';
  const topN = period === 'week' ? chartSizeWeekly
    : period === 'month' ? chartSizeMonthly
      : period === 'year' ? chartSizeYearly
        : (isFinite(chartSizeAllTime) ? chartSizeAllTime : chartSize);
  const topLabel = (isFinite(topN) && topN > 0) ? `Top ${topN}` : 'Top';
  let chartName, periodLine;
  if (period === 'week') {
    chartName = `${topLabel} ${typeWord} ${t('ep_of_week')}`;
    periodLine = dr.sub || dr.label;
  } else if (period === 'month') {
    chartName = `${topLabel} ${typeWord} ${t('ep_of')} ${dr.label}`;
    periodLine = dr.label;
  } else if (period === 'year') {
    chartName = `${topLabel} ${typeWord} ${t('ep_of')} ${dr.label}`;
    periodLine = t('ep_yearly_chart_line', { type: typeWord });
  } else {
    chartName = `${t('cr_all_time')} ${topLabel} ${typeWord}`;
    periodLine = t('cr_all_time');
  }
  const typeLabel = t('cr_type_' + (type === 'songs' ? 'song' : type === 'artists' ? 'artist' : 'album'));

  // Movement label
  const mv = _entryMovement(rank, key, type, period);
  let mvText, mvColor;
  if (mv.cls === 'new') { mvText = t('ep_mv_new'); mvColor = c.green; }
  else if (mv.cls === 're') { mvText = t('ep_mv_return'); mvColor = c.amber; }
  else if (mv.cls === 'same') { mvText = t('ep_mv_same'); mvColor = c.text3; }
  else if (mv.cls === 'up') {
    const n = parseInt(mv.label.replace(/[^\d]/g, '')) || 0;
    mvText = t(n === 1 ? 'ep_mv_up_one' : 'ep_mv_up_other', { n }); mvColor = c.green;
  } else if (mv.cls === 'down') {
    const n = parseInt(mv.label.replace(/[^\d]/g, '')) || 0;
    mvText = t(n === 1 ? 'ep_mv_down_one' : 'ep_mv_down_other', { n }); mvColor = c.rose;
  } else { mvText = mv.label || '\u2014'; mvColor = c.text3; }

  // Rank colour: gold / silver / bronze / accent
  const rankColor = rank === 1 ? c.gold1 : rank === 2 ? '#94a3b8' : rank === 3 ? '#c07850' : c.accent;

  // Layout sizes — opts override auto values
  const _ov = (override, auto) => (override != null ? override : auto);
  const headerMinH = isPost ? 90 : 176;
  const storyBottomSafe = isPost ? 6 : 18;
  const rankFont = _ov(opts.entRankSize, isPost ? 72 : 96);
  const mvFont = _ov(opts.entMvSize, isPost ? 12 : 16);
  const titleFont = _ov(opts.entTitleSize, isPost ? 20 : 27);
  const subFont = _ov(opts.entSubtitleSize, isPost ? 13 : 17);
  const monoFont = _ov(opts.entAlbumSize, isPost ? 10 : 13);
  const descFont = _ov(opts.entDescSize, isPost ? 11 : 14);
  // chartNameSize controls the chart-name line in the header
  const chartNameFont = _ov(opts.chartNameSize, isPost ? 15 : 19);
  const weekDateFont = _ov(opts.entWeekDateSize, isPost ? 9 : 11);
  const brandFont = _ov(opts.entBrandSize, isPost ? 8.5 : 10);
  const dateFont = isPost ? 8.5 : 9.5;
  // As header text grows, shrink the image and add spacing to avoid visual collisions.
  const headerCrowd = Math.max(0, chartNameFont - (isPost ? 18 : 24))
    + Math.max(0, brandFont - (isPost ? 9 : 11))
    + Math.max(0, dateFont - (isPost ? 9 : 11));
  const bodyCrowd = Math.max(0, titleFont - (isPost ? 22 : 30))
    + Math.max(0, subFont - (isPost ? 15 : 20))
    + Math.max(0, monoFont - (isPost ? 11 : 15))
    + Math.max(0, descFont - (isPost ? 12 : 16));
  const imgBase = isPost ? 172 : 240;
  const imgMin = isPost ? 144 : 200;
  const imgShrink = Math.min(imgBase - imgMin, Math.round(headerCrowd * 1.6 + bodyCrowd * 0.7));
  const autoImgSize = imgBase - imgShrink;
  const imgSize = Math.max(isPost ? 96 : 128, Math.min(isPost ? 260 : 340, _ov(opts.entImageSize, autoImgSize)));
  const nameMT = Math.max(isPost ? 4 : 8, (isPost ? 10 : 14) + Math.min(8, Math.round(headerCrowd * 0.4)) - Math.min(5, Math.round(bodyCrowd * 0.5)));
  const bodyPadBottom = (isPost ? 8 : 16) + Math.min(isPost ? 24 : 34, Math.round(bodyCrowd * 2.1));
  const descMaxH = isPost ? Math.max(24, 60 - Math.round(bodyCrowd * 4.5)) : Math.max(34, 94 - Math.round(bodyCrowd * 5.2));

  const desc = opts.showDescription ? _entryDescriptionText(type, key, rank, period, {
    viewedYear: opts.viewedYear,
    cutoffKeys: opts.cutoffKeys,
    mode: opts.descMode,
    custom: opts.descCustom,
    variant: opts.descVariant,
    periodLine,
  }) : '';
  const descInMediaZone = !!desc && descFont >= (isPost ? 13 : 17);
  const descOverlayMaxW = Math.round(imgSize * (isPost ? 1.14 : 1.08));
  const descOverlayMaxH = Math.round(imgSize * (isPost ? 0.62 : 0.55));
  const descOverlayFont = Math.max(10, descFont - 1);
  const metaRankSize = Math.max(isPost ? 34 : 48, Math.round(rankFont * 0.58));
  const metaMvSize = Math.max(10, Math.round(mvFont * 0.95));
  const storyStatusY = isPost ? 0 : (parseInt(opts.entStatusY || 0, 10) || 0);

  const imgHTML = (opts.showImage && opts.imgUrl)
    ? '<img src="' + opts.imgUrl + '" crossorigin="anonymous" style="width:' + imgSize + 'px;height:' + imgSize + 'px;object-fit:cover;border-radius:' + (isPost ? 10 : 14) + 'px;box-shadow:0 8px 32px rgba(0,0,0,0.55);border:1px solid ' + c.border + ';display:block;">'
    : '<div style="width:' + imgSize + 'px;height:' + imgSize + 'px;background:' + c.surface + ';border-radius:' + (isPost ? 10 : 14) + 'px;border:1px solid ' + c.border + ';display:flex;align-items:center;justify-content:center;"><span style="font-family:\'DM Serif Display\',serif;font-size:' + Math.round(imgSize * 0.32) + 'px;color:' + c.accent2 + ';">' + esc(initials(displayName)) + '</span></div>';

  const header = '<div style="padding:' + (isPost ? '24px 22px 14px' : '86px 26px 18px') + ';background:linear-gradient(135deg,' + c.bg3 + ',' + c.surface + ');border-bottom:2px solid ' + c.accent + ';flex-shrink:0;min-height:' + headerMinH + 'px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:flex-start;">'
    + '<div style="font-family:\'DM Mono\',monospace;font-size:' + brandFont + 'px;letter-spacing:0.22em;color:' + c.accent + ';text-transform:uppercase;margin-bottom:3px;">dankcharts.fm \u00b7 ' + esc(typeLabel) + '</div>'
    + '<div style="font-family:\'DM Serif Display\',serif;font-size:' + chartNameFont + 'px;color:' + c.text + ';line-height:1.1;">' + esc(chartName) + '</div>'
    + (opts.showWeekDate && periodLine ? '<div style="font-family:\'DM Mono\',monospace;font-size:' + weekDateFont + 'px;color:' + c.text3 + ';letter-spacing:0.1em;margin-top:4px;text-transform:uppercase;">' + esc(periodLine) + '</div>' : '')
    + '</div>';

  const body = '<div style="flex:1;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:' + (isPost ? ('12px 22px ' + bodyPadBottom + 'px') : ('22px 28px ' + bodyPadBottom + 'px')) + ';position:relative;">'
    + '<div style="position:absolute;width:' + (imgSize + 80) + 'px;height:' + (imgSize + 80) + 'px;border-radius:50%;background:radial-gradient(circle,' + c.accent + '14 0%,transparent 68%);pointer-events:none;"></div>'
    + '<div style="position:relative;margin-bottom:' + nameMT + 'px;display:flex;flex-direction:column;align-items:center;">' + imgHTML
    + '</div>'
    + '<div style="text-align:center;width:100%;position:relative;">'
    + '<div style="font-family:\'DM Sans\',sans-serif;font-size:' + titleFont + 'px;font-weight:700;color:' + c.text + ';line-height:1.2;margin-bottom:2px;max-height:' + (isPost ? 54 : 78) + 'px;overflow:hidden;">' + esc(displayName) + '</div>'
    + (opts.showSubtitle && artistName ? '<div style="font-family:\'DM Sans\',sans-serif;font-size:' + subFont + 'px;color:' + c.text2 + ';line-height:1.25;margin-bottom:1px;max-height:' + (isPost ? 34 : 48) + 'px;overflow:hidden;">' + esc(artistName) + '</div>' : '')
    + (opts.showSubtitle && type === 'songs' && albumName ? '<div style="font-family:\'DM Mono\',monospace;font-size:' + monoFont + 'px;color:' + c.text3 + ';letter-spacing:0.06em;margin-bottom:2px;">' + esc(albumName) + '</div>' : '')
    + (descInMediaZone ? '<div style="margin-top:' + (isPost ? 6 : 8) + 'px;max-width:' + (isPost ? '92%' : '88%') + ';max-height:' + descOverlayMaxH + 'px;overflow:hidden;padding:' + (isPost ? '6px 8px' : '8px 10px') + ';font-family:\'DM Sans\',sans-serif;font-size:' + descOverlayFont + 'px;color:' + c.text + ';font-style:italic;line-height:1.35;background:' + (c.isDark ? 'linear-gradient(180deg, rgba(8,18,30,0.28), rgba(8,18,30,0.72))' : c.bg2 + 'cc') + ';border:1px solid ' + (c.isDark ? 'rgba(255,255,255,0.22)' : c.border) + ';border-radius:' + (isPost ? 8 : 10) + 'px;' + (c.isDark ? 'text-shadow:0 1px 2px rgba(0,0,0,0.7);' : '') + 'margin-left:auto;margin-right:auto;">' + esc(desc) + '</div>' : '')
    + (desc && !descInMediaZone ? '<div style="font-family:\'DM Sans\',sans-serif;font-size:' + descFont + 'px;color:' + c.text3 + ';margin-top:' + (isPost ? 6 : 8) + 'px;font-style:italic;line-height:1.45;padding:0 6px;max-height:' + descMaxH + 'px;overflow:hidden;">' + esc(desc) + '</div>' : '')
    + (isPost
      ? '<div style="display:flex;justify-content:center;margin-top:4px;"><div style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:0 4px;">'
      : '')
    + (!isPost
      ? '<div style="position:absolute;left:28px;right:28px;bottom:16px;transform:translateY(' + storyStatusY + 'px);display:flex;align-items:center;justify-content:space-between;">'
      : '')
    + (opts.showMovement
      ? '<div style="font-family:\'DM Mono\',monospace;font-size:' + metaMvSize + 'px;color:' + mvColor + ';font-weight:700;letter-spacing:0.07em;line-height:1;">' + esc(mvText) + '</div>'
      : '<div style="width:1px;height:1px;"></div>')
    + '<div style="font-family:\'DM Serif Display\',serif;font-size:' + metaRankSize + 'px;color:' + rankColor + ';line-height:1;letter-spacing:-0.02em;">#' + rank + '</div>'
    + '</div>'
    + (isPost ? '</div>' : '')
    + '</div>'
    + '</div>';

  const footer = opts.showFooter
    ? '<div style="padding:5px 14px;background:' + c.bg3 + ';border-top:1px solid ' + c.border + ';flex-shrink:0;"><div style="font-family:\'DM Mono\',monospace;font-size:7px;color:' + c.text3 + ';letter-spacing:0.12em;">dankcharts.fm \u00b7 PERSONAL MUSIC CHARTS</div></div>'
    : '';

  return '<div style="width:' + cardW + 'px;height:' + cardH + 'px;background:' + c.bg + ';overflow:hidden;display:flex;flex-direction:column;font-family:\'DM Sans\',sans-serif;">' + header + body + (storyBottomSafe ? '<div style="height:' + storyBottomSafe + 'px;flex-shrink:0;"></div>' : '') + footer + '</div>';
}

// Movement helper — week/month use lastPeriodStats; year uses chart run history
function _entryMovement(rank, key, type, period) {
  if (period !== 'year') return igMovement(rank, key, type);
  const crData = allChartRun.year || (chartRunData && chartRunData.period === 'year' ? chartRunData : null);
  const d = crData && crData.result && crData.result[type] && crData.result[type][key];
  const _newKey = type === 'songs' ? 'badge_new_songs' : 'badge_new';
  if (!d || !d.entries.length) return { label: t(_newKey), cls: 'new' };
  if (d.entries.length < 2) return { label: t(_newKey), cls: 'new' };
  const prev = d.entries[d.entries.length - 2];
  const last = d.entries[d.entries.length - 1];
  if (crPeriodGap('year', prev.periodKey, last.periodKey) > 0) return { label: t('badge_re'), cls: 're' };
  const diff = prev.rank - rank;
  if (diff === 0) return { label: '=', cls: 'same' };
  return { label: (diff > 0 ? '\u25b2' : '\u25bc') + Math.abs(diff), cls: diff > 0 ? 'up' : 'down' };
}

// Narrative description derived from chart run history
function _entryDescription(type, key, rank, period, ctx) {
  ctx = ctx || {};
  const crData = allChartRun[period] || (chartRunData && chartRunData.period === period ? chartRunData : null);
  if (!crData) return '';
  const rawD = crData.result && crData.result[type] && crData.result[type][key];
  const viewedYear = ctx.viewedYear != null ? ctx.viewedYear : getViewedYear();
  const cutoffKeys = ctx.cutoffKeys || getViewedCutoffKeys();
  const d = filterCrD(rawD, period, 'uptoYear', viewedYear, cutoffKeys);
  const _u1 = tUnit('desc_unit_' + period, 1);
  const _un = function(n) { return tUnit('desc_unit_' + period, n); };

  if (!d || !d.entries.length) {
    const isRe = lastPeriodStats && lastPeriodStats.everChartedBefore && lastPeriodStats.everChartedBefore[type] && lastPeriodStats.everChartedBefore[type].has(key);
    return isRe ? t('desc_returns_welcome', { rank }) : t('desc_debut_no_hist', { rank });
  }

  const entries = d.entries;
  const last = entries[entries.length - 1];
  const prev = entries.length >= 2 ? entries[entries.length - 2] : null;
  const n = entries.length;

  // Unbroken streak of appearances ending at current period
  let streak = 1;
  for (let i = entries.length - 2; i >= 0; i--) {
    if (crPeriodGap(period, entries[i].periodKey, entries[i + 1].periodKey) === 0) streak++;
    else break;
  }

  // Unbroken Top-10 run ending at current period
  let consTop10 = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (i < entries.length - 1 && crPeriodGap(period, entries[i].periodKey, entries[i + 1].periodKey) > 0) break;
    if (entries[i].rank <= 10) consTop10++;
    else break;
  }

  // Unbroken run at the current exact rank
  let consAtRank = 1;
  for (let i = entries.length - 2; i >= 0; i--) {
    if (crPeriodGap(period, entries[i].periodKey, entries[i + 1].periodKey) > 0) break;
    if (entries[i].rank === rank) consAtRank++;
    else break;
  }

  const top10Total = entries.filter(function (e) { return e.rank <= 10; }).length;

  // RETURN — gap before the most recent entry
  if (prev && crPeriodGap(period, prev.periodKey, last.periodKey) > 0) {
    const gap = crPeriodGap(period, prev.periodKey, last.periodKey);
    return t('desc_return_after_gap', { rank, n: gap, unit: _un(gap) });
  }

  // NEW — first-ever appearance
  if (!prev) {
    if (rank === 1) return t('desc_debut_1');
    if (rank <= 5) return t('desc_debut_top5', { rank });
    if (rank <= 10) return t('desc_debut_top10', { rank });
    return t('desc_debut', { rank });
  }

  const diff = prev.rank - rank; // positive = climbed

  if (diff === 0) {
    if (rank === 1) {
      if (consAtRank >= 3) return t('desc_hold_1_cons', { n: consAtRank, units: _un(consAtRank) });
      return t('desc_hold_1_run', { n: consAtRank, ord: _ord(consAtRank), unit: _u1 });
    }
    if (consAtRank >= 4) return t('desc_locked', { rank, n: consAtRank, units: _un(consAtRank) });
    if (consTop10 >= 5 && rank <= 10) return t('desc_hold_top10', { rank, n: consTop10, units: _un(consTop10) });
    if (streak >= 8) return t('desc_hold_long', { rank, n: streak, units: _un(streak) });
    if (consAtRank >= 2) return t('desc_hold_cons', { rank, n: consAtRank, units: _un(consAtRank) });
    return t('desc_hold', { rank });
  }

  if (diff > 0) {
    // Detect a new all-time peak (compare against all prior entries)
    const prevPeak = entries.slice(0, -1).reduce(function (m, e) { return Math.min(m, e.rank); }, Infinity);
    const isNewPeak = rank < prevPeak;
    if (isNewPeak) {
      if (rank === 1) return t(n > 1 ? 'desc_ascend_1_hist' : 'desc_ascend_1', { n: n - 1, units: _un(n - 1) });
      if (consTop10 >= 5) return t('desc_peak_top10', { rank, n: consTop10, units: _un(consTop10) });
      return t('desc_peak', { rank, diff, prev: prev.rank });
    }
    if (diff >= 15) return t(n > 2 ? 'desc_rockets_hist' : 'desc_rockets', { diff, rank, n, units: _un(n) });
    if (diff >= 7) return t(consTop10 >= 3 ? 'desc_surges_top10' : 'desc_surges', { diff, rank, n: consTop10, units: _un(consTop10) });
    if (rank <= 10 && prev.rank > 10) return t('desc_breaks_top10', { rank, diff, prev: prev.rank });
    if (rank <= 5 && prev.rank > 5) return t('desc_top5', { rank });
    return t(streak >= 5 ? 'desc_rises_streak' : 'desc_rises', { diff, posn: tUnit('desc_position', diff), rank, n: streak, units: _un(streak) });
  }

  // DROP
  const drop = -diff;
  if (rank > 10 && prev.rank <= 10) return t('desc_falls_top10', { rank, n: top10Total, unit: _un(top10Total) });
  if (rank > 5 && prev.rank <= 5) return t('desc_slips_top5', { rank });
  if (drop >= 15) return t(streak >= 3 ? 'desc_tumbles_streak' : 'desc_tumbles', { drop, rank, n: streak, units: _un(streak) });
  if (streak >= 10) return t('desc_falls_remarkable', { drop, spot: tUnit('desc_spot', drop), rank, n: streak, units: _un(streak) });
  if (streak >= 5) return t('desc_slips_streak', { drop, posn: tUnit('desc_position', drop), rank, n: streak, units: _un(streak) });
  return t('desc_falls', { drop, posn: tUnit('desc_position', drop), rank });
}

function _entryDescriptionText(type, key, rank, period, ctx) {
  const custom = String(ctx?.custom || '').trim();
  if (ctx?.mode === 'custom' && custom) return custom;
  const base = _entryDescription(type, key, rank, period, { viewedYear: ctx?.viewedYear, cutoffKeys: ctx?.cutoffKeys });
  if (!base) return custom || '';
  const periodLabel = ctx?.periodLine || t('desc_v_this_period');
  const variants = [
    base,
    t('desc_v_prefix_chart') + base,
    base.replace(/\.$/, '') + t('desc_v_suffix_as_of', { period: periodLabel }),
    t('desc_v_prefix_snapshot') + base,
  ];
  const idx = Math.abs(parseInt(ctx?.variant || 0, 10)) % variants.length;
  return variants[idx];
}

function _ord(n) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ─── ARTIST MODAL ──────────────────────────────────────────────
const modal = document.getElementById('artistModal');
document.getElementById('modalClose').addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

// Event delegation for artist rows
const artistsBody = document.getElementById('artistsBody');
if (artistsBody) {
  artistsBody.addEventListener('click', e => {
    let artistRow = e.target.closest('.artist-row');
    if (!artistRow || e.target.closest('button')) return;
    const artistName = artistRow.dataset.artist;
    if (artistName) {
      e.preventDefault();
      e.stopPropagation();
      openArtistModal(artistName);
    }
  }, false);
}

// Returns all weeks (ever) where artistName had the most plays that week
function findWeeklyNo1s(artistName) {
  const weekMap = {};
  for (const p of allPlays) {
    const key = playWeekKey(p.date);
    if (!weekMap[key]) {
      // Reconstruct the Sunday Date from the key string (local time)
      const sun = new Date(key + 'T00:00:00');
      weekMap[key] = { sunday: sun, artists: {} };
    }
    for (const a of p.artists) weekMap[key].artists[a] = (weekMap[key].artists[a] || 0) + 1;
  }
  const results = [];
  for (const [key, wk] of Object.entries(weekMap)) {
    const sorted = Object.entries(wk.artists).sort((a, b) => b[1] - a[1]);
    if (sorted[0]?.[0] === artistName) results.push({ key, sunday: wk.sunday, plays: sorted[0][1] });
  }
  return results.sort((a, b) => b.key.localeCompare(a.key));
}

// Returns how many weeks ago a given week start was from the current week start
function weekOffset(weekDate) {
  const now = tzNow();
  const nowDow = now.getDay();
  const nowOffset = (nowDow - weekStartDay + 7) % 7;
  const currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - nowOffset);
  return Math.round((currentStart.getTime() - weekDate.getTime()) / (7 * 86400000));
}

// Navigate to a specific weekly chart and close the modal
function goToWeek(offset) {
  document.getElementById('artistModal').classList.remove('open');
  document.querySelectorAll('.period-nav button').forEach(b => b.classList.toggle('active', b.dataset.period === 'week'));
  savedOffsets[currentPeriod] = currentOffset;
  currentPeriod = 'week';
  currentOffset = offset;
  savedOffsets['week'] = offset;
  pageState.songs = 0; pageState.artists = 0; pageState.albums = 0;
  document.getElementById('dateNav').style.display = '';
  document.getElementById('statsStrip').style.display = '';
  document.getElementById('songsSection').style.display = '';
  document.getElementById('artistsSection').style.display = '';
  document.getElementById('albumsSection').style.display = '';
  document.getElementById('rawDataView').style.display = 'none';
  renderAll();
}

function openArtistModal(artistName) {
  // Close any open IG modals so they don't stack behind the artist modal
  document.getElementById('crIgModal')?.classList.remove('open');
  document.getElementById('igPreviewModal')?.classList.remove('open');
  // Gather all-time data for this artist across ALL plays
  const artistPlays = allPlays.filter(p => p.artists.includes(artistName));
  const totalPlays = artistPlays.length;

  // Songs — keyed by title+album, attributed to this artist
  // allPlays is sorted newest→oldest, so first occurrence = lastPlayed, last occurrence = firstPlayed
  const songCounts = {};
  for (const p of artistPlays) {
    const k = songKey(p);
    if (!songCounts[k]) songCounts[k] = { title: p.title, artist: p.artist, album: p.album, count: 0, firstPlayed: p.date, lastPlayed: p.date };
    else songCounts[k].firstPlayed = p.date;
    songCounts[k].count++;
  }
  const allSongsSorted = Object.values(songCounts).sort((a, b) => b.count - a.count);

  // Albums
  const albumCounts = {};
  for (const p of artistPlays) {
    if (!p.album || p.album === '—') continue;
    const k = p.album;
    if (!albumCounts[k]) albumCounts[k] = { album: p.album, count: 0, tracks: new Set(), firstPlayed: p.date, lastPlayed: p.date };
    else albumCounts[k].firstPlayed = p.date;
    albumCounts[k].count++;
    albumCounts[k].tracks.add(p.title);
  }
  const allAlbumsSorted = Object.values(albumCounts).sort((a, b) => b.count - a.count);

  // Build peak maps using same period scope as the current chart
  const peaks = buildPeaks();

  // Songs that made it into the chart (have a peak position)
  const chartSongs = allSongsSorted.filter(s => peaks.songPeakMap[songKey(s)] !== undefined);
  const chartAlbums = allAlbumsSorted.filter(a => peaks.albumPeakMap[a.album + '|||' + artistName] !== undefined || peaks.albumPeakMap[a.album + '|||' + a.album] !== undefined);

  // Certifications count
  const goldSongs = allSongsSorted.filter(s => s.count >= CERT.song.gold).length;
  const platSongs = allSongsSorted.filter(s => s.count >= CERT.song.plat).length;
  const diamondSongs = allSongsSorted.filter(s => s.count >= CERT.song.diamond).length;
  const goldAlbums = allAlbumsSorted.filter(a => a.count >= CERT.album.gold).length;
  const platAlbums = allAlbumsSorted.filter(a => a.count >= CERT.album.plat).length;
  const diamondAlbums = allAlbumsSorted.filter(a => a.count >= CERT.album.diamond).length;

  // Best chart position
  const artistPeak = peaks.artistPeakMap[artistName];
  const bestSongPeak = chartSongs.length ? Math.min(...chartSongs.map(s => peaks.songPeakMap[songKey(s)])) : null;

  // Populate modal
  document.getElementById('modalArtistName').textContent = artistName;
  document.getElementById('modalArtistSub').textContent =
    `Top ${chartSize} ${t('modal_chart_profile')} · ${t('period_alltime')}`;

  // Artist image
  const imgEl = document.getElementById('modalArtistImg');
  const cached = imgCache['artist:' + artistName.toLowerCase()];
  if (cached) {
    imgEl.innerHTML = `<img class="modal-artist-img" src="${esc(cached)}" alt="" onerror="this.outerHTML='<div class=modal-artist-initials>${esc(initials(artistName))}</div>'">`;
  } else {
    imgEl.innerHTML = `<div class="modal-artist-initials">${esc(initials(artistName))}</div>`;
    getArtistImage(artistName).then(url => {
      if (url) imgEl.innerHTML = `<img class="modal-artist-img" src="${esc(url)}" alt="">`;
    });
  }

  // Stats strip
  document.getElementById('modalStats').innerHTML = `
    <div class="modal-stat"><div class="sv">${totalPlays.toLocaleString()}</div><div class="sl">${t('stat_total_plays')}</div></div>
    <div class="modal-stat"><div class="sv">${allSongsSorted.length}</div><div class="sl">${t('stat_unique_songs')}</div></div>
    <div class="modal-stat"><div class="sv">${allAlbumsSorted.length}</div><div class="sl">${t('stat_albums')}</div></div>
    <div class="modal-stat"><div class="sv">${artistPeak ? '#' + artistPeak : '—'}</div><div class="sl">${t('modal_artist_peak')}</div></div>
    <div class="modal-stat"><div class="sv">${chartSongs.length}</div><div class="sl">${t('modal_songs_charted')}</div></div>
    <div class="modal-stat"><div class="sv">${bestSongPeak ? '#' + bestSongPeak : '—'}</div><div class="sl">${t('modal_best_song_peak')}</div></div>
  `;

  // Accomplishments — with expandable detail panels
  // Helper: first-listened date for a song
  const firstPlay = (s) => {
    const plays = artistPlays.filter(p => songKey(p) === songKey(s));
    return plays.length ? fmtDate(new Date(Math.min(...plays.map(p => p.date)))) : '—';
  };
  const firstAlbumPlay = (album) => {
    const plays = artistPlays.filter(p => p.album === album);
    return plays.length ? fmtDate(new Date(Math.min(...plays.map(p => p.date)))) : '—';
  };

  // Helper: build a detail block for a list of songs, albums, or weeks
  let accDetailId = 0;
  const accRow = (icon, label, detailRows) => {
    const id = 'acc-detail-' + (accDetailId++);
    const detail = detailRows.length
      ? detailRows.map(r => {
        const navAttr = r.weekOffset !== undefined ? ` onclick="goToWeek(${r.weekOffset})" style="cursor:pointer;"` : '';
        const viewTag = r.weekOffset !== undefined ? `<span style="color:var(--accent);font-size:0.6rem;flex-shrink:0;margin-left:0.5rem;letter-spacing:0.06em;">→ VIEW</span>` : '';
        return `<div class="acc-detail-row"${navAttr}><span class="acc-detail-name">${esc(r.name)}</span><span class="acc-detail-plays">${r.plays} ${tUnit('plays', r.plays)}</span>${r.date ? `<span class="acc-detail-date">${r.date}</span>` : ''}${viewTag}</div>`;
      }).join('')
      : `<div class="acc-detail-row"><span class="acc-detail-name" style="font-style:italic">${t('modal_no_detail')}</span></div>`;
    return `<div class="acc-row">
      <div class="acc-header">
        <button class="acc-toggle" onclick="const d=document.getElementById('${id}');const open=d.classList.toggle('open');this.textContent=open?'−':'+';" title="Expand">+</button>
        <span>${icon} ${label}</span>
      </div>
      <div class="acc-detail" id="${id}">${detail}</div>
    </div>`;
  };

  const acc = [];

  // Weekly #1 — find every week this artist topped the chart
  const no1Weeks = findWeeklyNo1s(artistName);
  if (no1Weeks.length) {
    acc.push(accRow('🏆', t('acc_artist_no1', { n: no1Weeks.length, unit: tUnit('cr_week', no1Weeks.length) }),
      no1Weeks.map(w => ({
        name: t('period_week_of', { date: fmtDate(w.sunday) }),
        plays: w.plays,
        date: '',
        weekOffset: weekOffset(w.sunday)
      }))));
  } else if (artistPeak) {
    acc.push(accRow('📈', t('acc_artist_peak', { peak: artistPeak, size: chartSize }), []));
  }

  if (bestSongPeak === 1) {
    const no1songs = chartSongs.filter(s => peaks.songPeakMap[songKey(s)] === 1);
    acc.push(accRow('🎵', t('acc_no1_songs', { n: no1songs.length, unit: tUnit('songs', no1songs.length), size: chartSize }),
      no1songs.map(s => ({ name: s.title + (s.album !== '—' ? ' · ' + s.album : ''), plays: s.count, date: firstPlay(s) }))));
  }

  // Multi-level diamond songs (each song shows at its highest level only)
  const maxSongMult = allSongsSorted.reduce((m, s) => Math.max(m, Math.floor(s.count / CERT.song.diamond)), 0);
  for (let mult = maxSongMult; mult >= 1; mult--) {
    const items = allSongsSorted.filter(s => Math.floor(s.count / CERT.song.diamond) === mult);
    if (!items.length) continue;
    const { icon } = diamondMultiLabel(mult);
    const plays = mult * CERT.song.diamond;
    acc.push(accRow(icon, t('acc_cert', { n: items.length, cert: tDiamondLabel(mult), unit: tUnit('songs', items.length), plays, plays_unit: tUnit('plays', plays) }),
      items.map(s => ({ name: s.title + (s.album !== '—' ? ' · ' + s.album : ''), plays: s.count, date: firstPlay(s) }))));
  }
  if (platSongs) {
    const items = allSongsSorted.filter(s => s.count >= CERT.song.plat && s.count < CERT.song.diamond);
    acc.push(accRow('💿', t('acc_cert', { n: platSongs, cert: t('cert_plat'), unit: tUnit('songs', platSongs), plays: CERT.song.plat, plays_unit: tUnit('plays', CERT.song.plat) }),
      items.map(s => ({ name: s.title + (s.album !== '—' ? ' · ' + s.album : ''), plays: s.count, date: firstPlay(s) }))));
  }
  if (goldSongs) {
    const items = allSongsSorted.filter(s => s.count >= CERT.song.gold && s.count < CERT.song.plat);
    acc.push(accRow('⭐', t('acc_cert', { n: goldSongs, cert: t('cert_gold'), unit: tUnit('songs', goldSongs), plays: CERT.song.gold, plays_unit: tUnit('plays', CERT.song.gold) }),
      items.map(s => ({ name: s.title + (s.album !== '—' ? ' · ' + s.album : ''), plays: s.count, date: firstPlay(s) }))));
  }

  // Multi-level diamond albums
  const maxAlbumMult = allAlbumsSorted.reduce((m, a) => Math.max(m, Math.floor(a.count / CERT.album.diamond)), 0);
  for (let mult = maxAlbumMult; mult >= 1; mult--) {
    const items = allAlbumsSorted.filter(a => Math.floor(a.count / CERT.album.diamond) === mult);
    if (!items.length) continue;
    const { icon } = diamondMultiLabel(mult);
    const plays = mult * CERT.album.diamond;
    acc.push(accRow(icon, t('acc_cert', { n: items.length, cert: tDiamondLabel(mult), unit: tUnit('albums', items.length), plays, plays_unit: tUnit('plays', plays) }),
      items.map(a => ({ name: a.album, plays: a.count, date: firstAlbumPlay(a.album) }))));
  }
  if (platAlbums) {
    const items = allAlbumsSorted.filter(a => a.count >= CERT.album.plat && a.count < CERT.album.diamond);
    acc.push(accRow('💿', t('acc_cert', { n: platAlbums, cert: t('cert_plat'), unit: tUnit('albums', platAlbums), plays: CERT.album.plat, plays_unit: tUnit('plays', CERT.album.plat) }),
      items.map(a => ({ name: a.album, plays: a.count, date: firstAlbumPlay(a.album) }))));
  }
  if (goldAlbums) {
    const items = allAlbumsSorted.filter(a => a.count >= CERT.album.gold && a.count < CERT.album.plat);
    acc.push(accRow('⭐', t('acc_cert', { n: goldAlbums, cert: t('cert_gold'), unit: tUnit('albums', goldAlbums), plays: CERT.album.gold, plays_unit: tUnit('plays', CERT.album.gold) }),
      items.map(a => ({ name: a.album, plays: a.count, date: firstAlbumPlay(a.album) }))));
  }

  if (!acc.length) acc.push(`<div style="font-family:'DM Sans',sans-serif;font-style:italic;font-size:0.85rem;color:var(--text3);padding:0.5rem 0;">${t('acc_none', { n: chartSize })}</div>`);
  document.getElementById('modalAccomplishments').innerHTML = acc.join('');

  // Songs table — show all songs that charted, ranked by peak
  const songsToShow = chartSongs.length > 0 ? chartSongs : allSongsSorted.slice(0, chartSize);
  const songTableHeader = `<tr class="modal-table-header"><td></td><td></td><td>${t('th_song')}</td><td class="modal-date-col">${t('modal_first_played')}</td><td class="modal-date-col">${t('modal_last_played')}</td><td>${t('th_plays')}</td></tr>`;
  document.getElementById('modalSongs').innerHTML = songTableHeader + songsToShow.flatMap((s, i) => {
    const pk = peaks.songPeakMap[songKey(s)];
    const crKey = songKey(s);
    const hasCR = chartRunData && chartRunData.result.songs[crKey];
    const rowId = 'modal-cr-song-' + i;
    const mainRow = `<tr>
      <td>${hasCR ? `<button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_song')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button>` : ''}</td>
      <td class="modal-rank-col">${pk ? '#' + pk : i + 1}</td>
      <td>
        <div class="song-title">${esc(s.title)}${certBadge(s.count, 'song')}</div>
        <div class="song-album">${esc(s.album)}</div>
      </td>
      <td class="modal-date-col">${fmt(s.firstPlayed)}</td>
      <td class="modal-date-col">${fmt(s.lastPlayed)}</td>
      <td>${s.count} ${tUnit('plays', s.count)}</td>
    </tr>`;
    if (!hasCR) return [mainRow];
    return [mainRow, `<tr class="cr-row" id="${rowId}"><td colspan="6"><div class="cr-panel" data-crtype="songs" data-crkey="${encodeURIComponent(crKey)}"><div class="cr-stats">${crStats('songs', crKey, chartRunData.period)}</div>${crBoxesHTML('songs', crKey)}</div></td></tr>`];
  }).join('') || `<tr><td colspan="6" style="font-style:italic;color:var(--text3);padding:0.5rem">${t('modal_no_songs', { n: chartSize })}</td></tr>`;

  // Albums table
  const albumsToShow = allAlbumsSorted;
  const albumTableHeader = `<tr class="modal-table-header"><td></td><td></td><td>${t('th_album')}</td><td class="modal-date-col">${t('modal_first_played')}</td><td class="modal-date-col">${t('modal_last_played')}</td><td>${t('th_plays')}</td></tr>`;
  document.getElementById('modalAlbums').innerHTML = albumTableHeader + albumsToShow.flatMap((a, i) => {
    const pkKey = Object.keys(peaks.albumPeakMap).find(k => k.startsWith(a.album + '|||'));
    const pk = pkKey ? peaks.albumPeakMap[pkKey] : null;
    const crKey = chartRunData ? Object.keys(chartRunData.result.albums).find(k => k.startsWith(a.album + '|||')) : null;
    const hasCR = !!crKey;
    const rowId = 'modal-cr-album-' + i;
    const mainRow = `<tr>
      <td>${hasCR ? `<button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_album')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button>` : ''}</td>
      <td class="modal-rank-col">${pk ? '#' + pk : '—'}</td>
      <td>
        <div class="song-title">${esc(a.album)}${certBadge(a.count, 'album')}</div>
        <div class="song-album">${a.tracks.size} ${tUnit('tracks', a.tracks.size)}</div>
      </td>
      <td class="modal-date-col">${fmt(a.firstPlayed)}</td>
      <td class="modal-date-col">${fmt(a.lastPlayed)}</td>
      <td>${a.count} ${tUnit('plays', a.count)}</td>
    </tr>`;
    if (!hasCR) return [mainRow];
    return [mainRow, `<tr class="cr-row" id="${rowId}"><td colspan="6"><div class="cr-panel" data-crtype="albums" data-crkey="${encodeURIComponent(crKey)}"><div class="cr-stats">${crStats('albums', crKey, chartRunData.period)}</div>${crBoxesHTML('albums', crKey)}</div></td></tr>`];
  }).join('') || `<tr><td colspan="6" style="font-style:italic;color:var(--text3);padding:0.5rem">${t('empty_no_album_data')}</td></tr>`;

  modal.classList.add('open');
  modal.scrollTop = 0;
}

function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── ALBUM MODAL ───────────────────────────────────────────────
const albumModal = document.getElementById('albumModal');
document.getElementById('albumModalClose').addEventListener('click', () => {
  albumModal.classList.remove('open');
});
albumModal.addEventListener('click', e => { if (e.target === albumModal) albumModal.classList.remove('open'); });

// Event delegation for album rows
const albumsBody = document.getElementById('albumsBody');
if (albumsBody) {
  albumsBody.addEventListener('click', e => {
    let albumRow = e.target.closest('.album-row');
    if (!albumRow || e.target.closest('button')) return;
    const albumKey = albumRow.dataset.albumkey;
    if (albumKey) {
      e.preventDefault();
      e.stopPropagation();
      openAlbumModal(albumKey);
    }
  }, false);
}

function findAlbumNo1Weeks(albumKey) {
  const weekMap = {};
  for (const p of allPlays) {
    if (!p.album || p.album === '—') continue;
    const key = playWeekKey(p.date);
    const ak = p.album + '|||' + albumArtist(p);
    if (!weekMap[key]) weekMap[key] = { sunday: new Date(key + 'T00:00:00'), albums: {} };
    weekMap[key].albums[ak] = (weekMap[key].albums[ak] || 0) + 1;
  }
  const results = [];
  for (const [key, wk] of Object.entries(weekMap)) {
    const sorted = Object.entries(wk.albums).sort((a, b) => b[1] - a[1]);
    if (sorted[0]?.[0] === albumKey) results.push({ key, sunday: wk.sunday, plays: sorted[0][1] });
  }
  return results.sort((a, b) => b.key.localeCompare(a.key));
}

let _currentAlbumKey = null;
function openAlbumModal(albumKey) {
  _currentAlbumKey = albumKey;
  const [albumName, artistName] = albumKey.split('|||');
  const albumPlays = allPlays.filter(p => (p.album + '|||' + albumArtist(p)) === albumKey);
  const totalPlays = albumPlays.length;

  // Tracks — allPlays sorted newest→oldest, so first = lastPlayed, last = firstPlayed
  const trackCounts = {};
  for (const p of albumPlays) {
    const k = songKey(p);
    if (!trackCounts[k]) trackCounts[k] = { title: p.title, artist: p.artist, album: p.album, count: 0, firstPlayed: p.date, lastPlayed: p.date };
    else trackCounts[k].firstPlayed = p.date;
    trackCounts[k].count++;
  }
  const allTracksSorted = Object.values(trackCounts).sort((a, b) => b.count - a.count);
  const firstPlayed = albumPlays.length ? albumPlays[albumPlays.length - 1].date : null;
  const lastPlayed = albumPlays.length ? albumPlays[0].date : null;

  const peaks = buildPeaks();
  const albumPeak = peaks.albumPeakMap[albumKey];
  const chartTracks = allTracksSorted.filter(s => peaks.songPeakMap[songKey(s)] !== undefined);
  const bestTrackPeak = chartTracks.length ? Math.min(...chartTracks.map(s => peaks.songPeakMap[songKey(s)])) : null;

  // Header
  document.getElementById('albumModalName').textContent = albumName;
  document.getElementById('albumModalSub').textContent = `Album by ${artistName} · ${t('modal_chart_profile')}`;

  // Image
  const imgEl = document.getElementById('albumModalImg');
  const prefKey = 'album:' + artistName.toLowerCase() + '|||' + albumName.toLowerCase();
  const source = itemSourcePrefs[prefKey] || 'deezer';
  const cacheKey = 'album:' + albumName.toLowerCase() + ':' + source;
  const cached = imgCache[cacheKey] || imgCache['album:' + albumName.toLowerCase() + ':deezer'];
  if (cached) {
    imgEl.innerHTML = `<img class="modal-artist-img" src="${esc(cached)}" alt="" onerror="this.outerHTML='<div class=modal-artist-initials>${esc(initials(albumName))}</div>'">`;
  } else {
    imgEl.innerHTML = `<div class="modal-artist-initials">${esc(initials(albumName))}</div>`;
    getAlbumImage(albumName, artistName, source).then(url => {
      if (url) imgEl.innerHTML = `<img class="modal-artist-img" src="${esc(url)}" alt="">`;
    });
  }

  // Stats strip
  document.getElementById('albumModalStats').innerHTML = `
    <div class="modal-stat"><div class="sv">${totalPlays.toLocaleString()}</div><div class="sl">${t('stat_total_plays')}</div></div>
    <div class="modal-stat"><div class="sv">${allTracksSorted.length}</div><div class="sl">${t('modal_tracks')}</div></div>
    <div class="modal-stat"><div class="sv">${albumPeak ? '#' + albumPeak : '—'}</div><div class="sl">${t('modal_album_peak')}</div></div>
    <div class="modal-stat"><div class="sv">${chartTracks.length}</div><div class="sl">${t('modal_tracks_charted')}</div></div>
    <div class="modal-stat"><div class="sv">${bestTrackPeak ? '#' + bestTrackPeak : '—'}</div><div class="sl">${t('modal_best_track_peak')}</div></div>
    <div class="modal-stat"><div class="sv">${firstPlayed ? fmt(firstPlayed) : '—'}</div><div class="sl">${t('modal_first_played')}</div></div>
    <div class="modal-stat"><div class="sv">${lastPlayed ? fmt(lastPlayed) : '—'}</div><div class="sl">${t('modal_last_played')}</div></div>
  `;

  // Accomplishments
  let albAccId = 0;
  const albAccRow = (icon, label, detailRows) => {
    const id = 'alb-acc-' + (albAccId++);
    const detail = detailRows.length
      ? detailRows.map(r => {
        const navAttr = r.weekOffset !== undefined ? ` onclick="goToWeek(${r.weekOffset});albumModal.classList.remove('open')" style="cursor:pointer"` : '';
        const viewTag = r.weekOffset !== undefined ? `<span style="color:var(--accent);font-size:0.6rem;flex-shrink:0;margin-left:0.5rem;letter-spacing:0.06em;">→ VIEW</span>` : '';
        return `<div class="acc-detail-row"${navAttr}><span class="acc-detail-name">${esc(r.name)}</span><span class="acc-detail-plays">${r.plays} ${tUnit('plays', r.plays)}</span>${r.date ? `<span class="acc-detail-date">${r.date}</span>` : ''}${viewTag}</div>`;
      }).join('')
      : `<div class="acc-detail-row"><span class="acc-detail-name" style="font-style:italic">${t('modal_no_detail')}</span></div>`;
    return `<div class="acc-row">
      <div class="acc-header">
        <button class="acc-toggle" onclick="const d=document.getElementById('${id}');const open=d.classList.toggle('open');this.textContent=open?'−':'+';" title="Expand">+</button>
        <span>${icon} ${label}</span>
      </div>
      <div class="acc-detail" id="${id}">${detail}</div>
    </div>`;
  };

  const acc = [];
  if (albumPeak === 1) {
    const no1Weeks = findAlbumNo1Weeks(albumKey);
    acc.push(albAccRow('🏆', t('acc_album_no1', { n: no1Weeks.length, unit: tUnit('cr_week', no1Weeks.length) }),
      no1Weeks.map(w => ({ name: t('period_week_of', { date: fmtDate(w.sunday) }), plays: w.plays, weekOffset: weekOffset(w.sunday) }))));
  } else if (albumPeak) {
    acc.push(albAccRow('📈', t('acc_album_peak', { peak: albumPeak, size: chartSize }), []));
  }
  if (bestTrackPeak === 1) {
    const no1tracks = chartTracks.filter(s => peaks.songPeakMap[songKey(s)] === 1);
    acc.push(albAccRow('🎵', t('acc_no1_tracks', { n: no1tracks.length, unit: tUnit('tracks', no1tracks.length) }),
      no1tracks.map(s => ({ name: s.title, plays: s.count }))));
  }
  if (totalPlays >= CERT.album.diamond) {
    const mult = Math.floor(totalPlays / CERT.album.diamond);
    const { icon } = diamondMultiLabel(mult);
    const plays = mult * CERT.album.diamond;
    acc.push(albAccRow(icon, t('acc_cert_single_album', { cert: tDiamondLabel(mult), plays, plays_unit: tUnit('plays', plays) }), []));
  } else if (totalPlays >= CERT.album.plat) {
    acc.push(albAccRow('💿', t('acc_cert_single_album', { cert: t('cert_plat'), plays: CERT.album.plat, plays_unit: tUnit('plays', CERT.album.plat) }), []));
  } else if (totalPlays >= CERT.album.gold) {
    acc.push(albAccRow('⭐', t('acc_cert_single_album', { cert: t('cert_gold'), plays: CERT.album.gold, plays_unit: tUnit('plays', CERT.album.gold) }), []));
  }
  // Multi-level diamond tracks
  const maxTrackMult = allTracksSorted.reduce((m, s) => Math.max(m, Math.floor(s.count / CERT.song.diamond)), 0);
  for (let mult = maxTrackMult; mult >= 1; mult--) {
    const items = allTracksSorted.filter(s => Math.floor(s.count / CERT.song.diamond) === mult);
    if (!items.length) continue;
    const { icon } = diamondMultiLabel(mult);
    const plays = mult * CERT.song.diamond;
    acc.push(albAccRow(icon, t('acc_cert', { n: items.length, cert: tDiamondLabel(mult), unit: tUnit('tracks', items.length), plays, plays_unit: tUnit('plays', plays) }),
      items.map(s => ({ name: s.title, plays: s.count }))));
  }
  const platTracks = allTracksSorted.filter(s => s.count >= CERT.song.plat && s.count < CERT.song.diamond).length;
  if (platTracks) {
    const items = allTracksSorted.filter(s => s.count >= CERT.song.plat && s.count < CERT.song.diamond);
    acc.push(albAccRow('💿', t('acc_cert', { n: platTracks, cert: t('cert_plat'), unit: tUnit('tracks', platTracks), plays: CERT.song.plat, plays_unit: tUnit('plays', CERT.song.plat) }),
      items.map(s => ({ name: s.title, plays: s.count }))));
  }
  const goldTracks = allTracksSorted.filter(s => s.count >= CERT.song.gold && s.count < CERT.song.plat).length;
  if (goldTracks) {
    const items = allTracksSorted.filter(s => s.count >= CERT.song.gold && s.count < CERT.song.plat);
    acc.push(albAccRow('⭐', t('acc_cert', { n: goldTracks, cert: t('cert_gold'), unit: tUnit('tracks', goldTracks), plays: CERT.song.gold, plays_unit: tUnit('plays', CERT.song.gold) }),
      items.map(s => ({ name: s.title, plays: s.count }))));
  }
  if (!acc.length) acc.push(`<div style="font-family:'DM Sans',sans-serif;font-style:italic;font-size:0.85rem;color:var(--text3);padding:0.5rem 0">${t('acc_none', { n: chartSize })}</div>`);
  document.getElementById('albumModalAccomplishments').innerHTML = acc.join('');

  // Chart run section
  const crTitleEl = document.getElementById('albumModalChartRunTitle');
  const crEl = document.getElementById('albumModalChartRun');
  if (chartRunData && chartRunData.result.albums[albumKey]) {
    crTitleEl.style.display = '';
    const crPeriodName = chartRunData.period === 'week' ? 'Weekly' : chartRunData.period === 'month' ? 'Monthly' : 'Yearly';
    crEl.innerHTML = `<div style="padding:0.4rem 0 0.7rem"><div class="cr-stats" style="margin-bottom:0.5rem">${crStats('albums', albumKey, chartRunData.period)}</div>${crBoxesHTML('albums', albumKey)}</div>`;
  } else {
    crTitleEl.style.display = 'none';
    crEl.innerHTML = '';
  }

  // Tracks table
  const tracksToShow = allTracksSorted;
  const trackHeader = `<tr class="modal-table-header"><td></td><td></td><td>${t('th_track')}</td><td class="modal-date-col">${t('modal_first_played')}</td><td class="modal-date-col">${t('modal_last_played')}</td><td>${t('th_plays')}</td></tr>`;
  document.getElementById('albumModalTracks').innerHTML = trackHeader + (tracksToShow.length === 0
    ? `<tr><td colspan="6" style="font-style:italic;color:var(--text3);padding:0.5rem">${t('modal_no_tracks')}</td></tr>`
    : tracksToShow.flatMap((s, i) => {
      const pk = peaks.songPeakMap[songKey(s)];
      const crKey = songKey(s);
      const hasCR = chartRunData && chartRunData.result.songs[crKey];
      const rowId = 'alb-cr-track-' + i;
      const mainRow = `<tr>
          <td>${hasCR ? `<button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_song')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button>` : ''}</td>
          <td class="modal-rank-col">${pk ? '#' + pk : '—'}</td>
          <td>
            <div class="song-title">${esc(s.title)}${pk ? peakBadge(pk) : ''}${certBadge(s.count, 'song')}</div>
          </td>
          <td class="modal-date-col">${fmt(s.firstPlayed)}</td>
          <td class="modal-date-col">${fmt(s.lastPlayed)}</td>
          <td>${s.count} ${tUnit('plays', s.count)}</td>
        </tr>`;
      if (!hasCR) return [mainRow];
      return [mainRow, `<tr class="cr-row" id="${rowId}"><td colspan="6"><div class="cr-panel" data-crtype="songs" data-crkey="${encodeURIComponent(crKey)}"><div class="cr-stats">${crStats('songs', crKey, chartRunData.period)}</div>${crBoxesHTML('songs', crKey)}</div></td></tr>`];
    }).join(''));

  albumModal.classList.add('open');
  albumModal.scrollTop = 0;
}

// ─── UPCOMING RELEASES (MusicBrainz) ───────────────────────────
const MB_CACHE_KEY = 'mbUpcomingCache';
const MB_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// MusicBrainz supports CORS natively — no proxy needed.
// User-Agent is required by their rate-limiting policy.
const MB_USER_AGENT = 'dankcharts.fm/1.0 (personal music charts)';

// Rate-limited sequential fetch — 1.1s between requests (MusicBrainz limit)
async function mbFetch(endpoint) {
  await new Promise(r => setTimeout(r, 1100));
  const res = await fetch('https://musicbrainz.org/ws/2/' + endpoint, {
    headers: { 'User-Agent': MB_USER_AGENT }
  });
  if (!res.ok) throw new Error('MB ' + res.status);
  return res.json();
}

function getTop50Artists() {
  const counts = {};
  for (const p of allPlays) {
    for (const a of p.artists) counts[a] = (counts[a] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 50).map(([name]) => name);
}

const _mbidCache = {};
async function searchArtistMBID(name) {
  if (_mbidCache[name] !== undefined) return _mbidCache[name];
  try {
    const d = await mbFetch(`artist?query=${encodeURIComponent(name)}&fmt=json&limit=5`);
    const artists = d.artists || [];
    const match = artists.find(a => a.name.toLowerCase() === name.toLowerCase())
      || artists.find(a => a.score >= 90)
      || artists[0];
    _mbidCache[name] = match?.id || null;
    return _mbidCache[name];
  } catch (e) { _mbidCache[name] = null; return null; }
}

async function fetchReleasesForMBID(mbid) {
  try {
    const today = tzNow(); today.setHours(0, 0, 0, 0);
    const future = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 90);
    const todayStr = localDateStr(today);
    const futureStr = localDateStr(future);
    const d = await mbFetch(`release-group?artist=${mbid}&type=album|ep|single&fmt=json&limit=100`);
    return (d['release-groups'] || []).filter(g => {
      const date = g['first-release-date'];
      return date && date.length >= 10 && date >= todayStr && date <= futureStr;
    }).map(g => ({
      title: g.title,
      type: g['primary-type'] || 'Release',
      date: g['first-release-date']
    }));
  } catch (e) { return []; }
}

function upcomingDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const now = tzNow(); now.setHours(0, 0, 0, 0);
  const days = Math.round((d - now) / 86400000);
  const fmt = fmtDate(d);
  return { label: fmt, soon: days <= 14 };
}

function renderUpcomingCard(release, artistName) {
  const { label, soon } = upcomingDateLabel(release.date);
  const typeKey = 'mb_type_' + (release.type || 'Release').toLowerCase();
  const typeLabel = t(typeKey) || release.type || 'Release';
  return `<div class="upcoming-card">
    <div class="upcoming-card-date${soon ? ' soon' : ''}" data-date="${esc(release.date)}">${esc(label)}</div>
    <div class="upcoming-card-title">${esc(release.title)}</div>
    <div class="upcoming-card-artist">${esc(artistName)}</div>
    <div class="upcoming-card-type" data-mbtype="${esc(release.type || 'Release')}">${esc(typeLabel)}</div>
  </div>`;
}

function sortUpcomingReleases(releases) {
  return releases.filter(r => r.release?.date).sort((a, b) =>
    (a.release.date || '').localeCompare(b.release.date || ''));
}

async function loadUpcomingReleases(forceRefresh = false) {
  if (!allPlays.length) return;

  // Show the section
  document.getElementById('upcomingSection').style.display = '';

  // Check cache
  if (!forceRefresh) {
    try {
      const cached = JSON.parse(localStorage.getItem(MB_CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.ts < MB_CACHE_TTL) {
        renderUpcomingResults(cached.releases, cached.artists, true);
        return;
      }
    } catch (e) { }
  }

  const artists = getTop50Artists();
  const statusEl = document.getElementById('upcomingStatus');
  const gridEl = document.getElementById('upcomingGrid');
  document.getElementById('upcomingRefreshBtn').style.display = 'none';

  gridEl.innerHTML = '';
  statusEl.textContent = t('mb_searching', { n: artists.length });

  const allReleases = []; // { release, artistName }
  let found = 0;

  for (let i = 0; i < artists.length; i++) {
    const name = artists[i];
    statusEl.textContent = t('mb_fetching', { i: i + 1, n: artists.length, name });

    const mbid = await searchArtistMBID(name);
    if (!mbid) continue;

    const releases = await fetchReleasesForMBID(mbid);
    for (const r of releases) {
      allReleases.push({ release: r, artistName: name });
      found++;
    }

    // Progressive render — update grid as results come in
    if (releases.length > 0) {
      const sorted = sortUpcomingReleases([...allReleases]);
      gridEl.innerHTML = sorted.map(({ release, artistName }) =>
        renderUpcomingCard(release, artistName)).join('');
    }
  }

  // Cache results
  try {
    localStorage.setItem(MB_CACHE_KEY, JSON.stringify({
      ts: Date.now(),
      releases: allReleases,
      artists
    }));
  } catch (e) { }

  renderUpcomingResults(allReleases, artists, false);
}

function renderUpcomingResults(allReleases, artists, fromCache) {
  const statusEl = document.getElementById('upcomingStatus');
  const gridEl = document.getElementById('upcomingGrid');
  const refreshEl = document.getElementById('upcomingRefreshBtn');

  const sorted = sortUpcomingReleases([...allReleases]);
  if (sorted.length === 0) {
    gridEl.innerHTML = `<div class="upcoming-empty">${t('mb_upcoming_empty')}</div>`;
  } else {
    gridEl.innerHTML = sorted.map(({ release, artistName }) =>
      renderUpcomingCard(release, artistName)).join('');
  }

  const cacheNote = fromCache ? t('mb_cached') : '';
  const ts = fromCache
    ? (() => { try { return new Date(JSON.parse(localStorage.getItem(MB_CACHE_KEY)).ts).toLocaleString(); } catch (e) { return ''; } })()
    : new Date().toLocaleString();
  statusEl.dataset.count = sorted.length;
  statusEl.dataset.n = artists.length;
  statusEl.dataset.ts = ts;
  statusEl.dataset.fromCache = fromCache ? '1' : '';
  statusEl.textContent = t('mb_upcoming_status', { count: sorted.length, n: artists.length, ts, cache: cacheNote });
  refreshEl.style.display = 'block';
}

// Trigger after data is loaded — chain recent after upcoming so MBID lookups are shared
async function maybeLoadUpcoming() {
  if (!allPlays.length) return;
  await loadUpcomingReleases();
  await loadRecentReleases();
}

// ─── RECENT RELEASES ───────────────────────────────────────────
const MB_RECENT_CACHE_KEY = 'mbRecentCache';

async function fetchRecentReleasesForMBID(mbid) {
  try {
    const today = tzNow(); today.setHours(0, 0, 0, 0);
    const past = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 180);
    const todayStr = localDateStr(today);
    const pastStr = localDateStr(past);
    const d = await mbFetch(`release-group?artist=${mbid}&type=album|ep|single&fmt=json&limit=100`);
    return (d['release-groups'] || []).filter(g => {
      const date = g['first-release-date'];
      return date && date.length >= 10 && date >= pastStr && date < todayStr;
    }).map(g => ({
      title: g.title,
      type: g['primary-type'] || 'Release',
      date: g['first-release-date']
    }));
  } catch (e) { return []; }
}

function renderRecentCard(release, artistName) {
  const d = new Date(release.date + 'T00:00:00');
  const label = fmtDate(d);
  const typeKey = 'mb_type_' + (release.type || 'Release').toLowerCase();
  const typeLabel = t(typeKey) || release.type || 'Release';
  return `<div class="upcoming-card">
    <div class="upcoming-card-date recent" data-date="${esc(release.date)}">${esc(label)}</div>
    <div class="upcoming-card-title">${esc(release.title)}</div>
    <div class="upcoming-card-artist">${esc(artistName)}</div>
    <div class="upcoming-card-type" data-mbtype="${esc(release.type || 'Release')}">${esc(typeLabel)}</div>
  </div>`;
}

function sortRecentReleases(releases) {
  return releases.filter(r => r.release?.date).sort((a, b) =>
    (b.release.date || '').localeCompare(a.release.date || '')); // newest first
}

async function loadRecentReleases(forceRefresh = false) {
  if (!allPlays.length) return;

  document.getElementById('recentSection').style.display = '';

  if (!forceRefresh) {
    try {
      const cached = JSON.parse(localStorage.getItem(MB_RECENT_CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.ts < MB_CACHE_TTL) {
        renderRecentResults(cached.releases, cached.artists, true);
        return;
      }
    } catch (e) { }
  }

  const artists = getTop50Artists();
  const statusEl = document.getElementById('recentStatus');
  const gridEl = document.getElementById('recentGrid');
  document.getElementById('recentRefreshBtn').style.display = 'none';

  gridEl.innerHTML = '';
  statusEl.textContent = t('mb_searching', { n: artists.length });

  const allReleases = [];

  for (let i = 0; i < artists.length; i++) {
    const name = artists[i];
    statusEl.textContent = t('mb_fetching', { i: i + 1, n: artists.length, name });

    const mbid = await searchArtistMBID(name);
    if (!mbid) continue;

    const releases = await fetchRecentReleasesForMBID(mbid);
    for (const r of releases) allReleases.push({ release: r, artistName: name });

    if (releases.length > 0) {
      const sorted = sortRecentReleases([...allReleases]);
      gridEl.innerHTML = sorted.map(({ release, artistName }) =>
        renderRecentCard(release, artistName)).join('');
    }
  }

  try {
    localStorage.setItem(MB_RECENT_CACHE_KEY, JSON.stringify({ ts: Date.now(), releases: allReleases, artists }));
  } catch (e) { }

  renderRecentResults(allReleases, artists, false);
}

function renderRecentResults(allReleases, artists, fromCache) {
  const statusEl = document.getElementById('recentStatus');
  const gridEl = document.getElementById('recentGrid');
  const refreshEl = document.getElementById('recentRefreshBtn');

  const sorted = sortRecentReleases([...allReleases]);
  if (sorted.length === 0) {
    gridEl.innerHTML = `<div class="upcoming-empty">${t('mb_recent_empty')}</div>`;
  } else {
    gridEl.innerHTML = sorted.map(({ release, artistName }) =>
      renderRecentCard(release, artistName)).join('');
  }

  const cacheNote = fromCache ? t('mb_cached') : '';
  const ts = fromCache
    ? (() => { try { return new Date(JSON.parse(localStorage.getItem(MB_RECENT_CACHE_KEY)).ts).toLocaleString(); } catch (e) { return ''; } })()
    : new Date().toLocaleString();
  statusEl.dataset.count = sorted.length;
  statusEl.dataset.n = artists.length;
  statusEl.dataset.ts = ts;
  statusEl.dataset.fromCache = fromCache ? '1' : '';
  statusEl.textContent = t('mb_recent_status', { count: sorted.length, n: artists.length, ts, cache: cacheNote });
  refreshEl.style.display = 'block';
}

// ─── GRAPHS TAB ────────────────────────────────────────────────
let graphGranularity = 'month';
let graphCharts = {};

function destroyGraphCharts() {
  Object.values(graphCharts).forEach(c => { try { c.destroy(); } catch (e) { } });
  graphCharts = {};
}

function graphKey(date) {
  if (graphGranularity === 'day') return date.toISOString().slice(0, 10);
  if (graphGranularity === 'month') return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  return String(date.getFullYear());
}

function graphKeyLabel(key) {
  const locale = currentLang === 'en' ? 'en-US' : currentLang;
  if (graphGranularity === 'day') {
    const d = new Date(key + 'T00:00:00');
    return d.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: '2-digit' });
  }
  if (graphGranularity === 'month') {
    const [y, m] = key.split('-');
    const d = new Date(+y, +m - 1, 1);
    return d.toLocaleDateString(locale, { month: 'short', year: '2-digit' });
  }
  return key;
}

function getGraphColors() {
  const style = getComputedStyle(document.body);
  const doc = getComputedStyle(document.documentElement);
  const get = v => style.getPropertyValue(v).trim() || doc.getPropertyValue(v).trim();
  return {
    text: get('--text') || '#e8f0ff',
    text3: get('--text3') || '#7aa0d0',
    bg: get('--bg') || '#0a1628',
    card: get('--surface') || '#173060',
    accent: get('--accent') || '#4080d0',
    accent2: get('--accent2') || '#2860b0',
    grid: get('--rule') || '#1e3050',
  };
}

const GRAPH_PALETTE = [
  '#4e88e8', '#f0aa30', '#50d0a0', '#e05090', '#a070e0',
  '#60c8e8', '#e07040', '#90d050', '#d050b0', '#70a0e0',
  '#f0e050', '#50e0c0', '#e05050', '#8050d0', '#50b0f0'
];

function renderGraphs() {
  if (!allPlays.length) return;
  destroyGraphCharts();
  const gc = getGraphColors();

  // Build sorted list of all period keys
  const allKeys = new Set();
  for (const p of allPlays) allKeys.add(graphKey(p.date));
  const sortedKeys = [...allKeys].sort();
  const labels = sortedKeys.map(graphKeyLabel);
  const maxTicks = 24;

  const axisOpts = (reverse) => ({
    x: { ticks: { color: gc.text3, maxTicksLimit: maxTicks, maxRotation: 45 }, grid: { color: gc.grid } },
    y: reverse
      ? { reverse: true, min: 1, ticks: { color: gc.text3, stepSize: 1 }, grid: { color: gc.grid }, title: { display: true, text: 'Rank (1 = top)', color: gc.text3 } }
      : { ticks: { color: gc.text3 }, grid: { color: gc.grid } }
  });
  const legendOpts = { labels: { color: gc.text3 } };
  const ptRadius = labels.length > 100 ? 0 : 2;

  // ── Chart 1: Cumulative plays — artist comparison ─────────
  {
    const artistTotals = {};
    for (const p of allPlays) for (const a of p.artists) artistTotals[a] = (artistTotals[a] || 0) + 1;
    const sorted = Object.keys(artistTotals).sort((a, b) => artistTotals[b] - artistTotals[a]);
    const dl = document.getElementById('gCumulativeArtistList');
    dl.innerHTML = sorted.map(a => `<option value="${a.replace(/"/g, '&quot;')}">`).join('');
    // Seed with top artist if list is empty
    if (!gCumulativeArtists.length && sorted.length) {
      gCumulativeArtists.push(sorted[0]);
      renderCumulativeChips();
    }
    // Populate default date range from allPlays extents (only on first load)
    const fromEl = document.getElementById('gCumulativeFrom');
    const toEl = document.getElementById('gCumulativeTo');
    if (!fromEl.value && allPlays.length) {
      // allPlays is sorted descending — last entry is the oldest play
      fromEl.value = localDateStr(tzDate(allPlays[allPlays.length - 1].date));
      toEl.value = localDateStr(tzNow());
    }
  }
  renderCumulativeChart(sortedKeys, labels, ptRadius, gc, axisOpts, legendOpts);

  // ── Chart 2: Total play volume ─────────────────────────────
  {
    const el = document.getElementById('gTotalVolumeFrom');
    if (!el.value && allPlays.length) {
      el.value = localDateStr(tzDate(allPlays[allPlays.length - 1].date));
      document.getElementById('gTotalVolumeTo').value = localDateStr(tzNow());
    }
  }
  renderTotalVolumeChart(sortedKeys, gc, axisOpts, legendOpts);

  // ── Chart 3: Artist comparison volume ─────────────────────
  {
    const artistTotals = {};
    for (const p of allPlays) for (const a of p.artists) artistTotals[a] = (artistTotals[a] || 0) + 1;
    const sorted = Object.keys(artistTotals).sort((a, b) => artistTotals[b] - artistTotals[a]);
    document.getElementById('gVolumeArtistList').innerHTML =
      sorted.map(a => `<option value="${a.replace(/"/g, '&quot;')}">`).join('');
    if (!gVolumeArtists.length && sorted.length) {
      gVolumeArtists.push(sorted[0]);
      renderVolumeChips();
    }
    const vFrom = document.getElementById('gVolumeFrom');
    if (!vFrom.value && allPlays.length) {
      vFrom.value = localDateStr(tzDate(allPlays[allPlays.length - 1].date));
      document.getElementById('gVolumeTo').value = localDateStr(tzNow());
    }
  }
  renderVolumeChart(sortedKeys, gc, axisOpts, legendOpts);

  // ── Chart 4: New discoveries per period ───────────────────
  {
    const seenSong = {}, seenArtist = {}, seenAlbum = {};
    const nSong = {}, nArtist = {}, nAlbum = {};
    sortedKeys.forEach(k => { nSong[k] = 0; nArtist[k] = 0; nAlbum[k] = 0; });
    const chrono = [...allPlays].sort((a, b) => a.date - b.date);
    for (const p of chrono) {
      const k = graphKey(p.date);
      const sk = songKey(p);
      if (!seenSong[sk]) { seenSong[sk] = 1; if (nSong[k] !== undefined) nSong[k]++; }
      for (const a of p.artists) if (!seenArtist[a]) { seenArtist[a] = 1; if (nArtist[k] !== undefined) nArtist[k]++; }
      if (p.album && p.album !== '—') {
        const ak = p.album + '|||' + albumArtist(p);
        if (!seenAlbum[ak]) { seenAlbum[ak] = 1; if (nAlbum[k] !== undefined) nAlbum[k]++; }
      }
    }
    const discoveriesLabelsPlugin = {
      id: 'discoveriesLabels',
      afterDatasetsDraw(chart) {
        if (!gDiscoveriesLabels) return;
        const ctx = chart.ctx;
        const lastMeta = chart.getDatasetMeta(chart.data.datasets.length - 1);
        lastMeta.data.forEach((bar, i) => {
          const total = chart.data.datasets.reduce((sum, ds) => sum + (ds.data[i] || 0), 0);
          if (!total) return;
          ctx.save();
          ctx.font = '600 10px "DM Mono", monospace';
          ctx.fillStyle = gc.text;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(total.toLocaleString(), bar.x, bar.y - 2);
          ctx.restore();
        });
      }
    };
    graphCharts.discoveries = new Chart(document.getElementById('gDiscoveries'), {
      type: 'bar',
      data: {
        labels, datasets: [
          { label: 'New Songs', data: sortedKeys.map(k => nSong[k]), backgroundColor: GRAPH_PALETTE[0] + 'bb', borderColor: GRAPH_PALETTE[0], borderWidth: 1, stack: 'disc' },
          { label: 'New Artists', data: sortedKeys.map(k => nArtist[k]), backgroundColor: GRAPH_PALETTE[1] + 'bb', borderColor: GRAPH_PALETTE[1], borderWidth: 1, stack: 'disc' },
          { label: 'New Albums', data: sortedKeys.map(k => nAlbum[k]), backgroundColor: GRAPH_PALETTE[2] + 'bb', borderColor: GRAPH_PALETTE[2], borderWidth: 1, stack: 'disc' },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: legendOpts,
          zoom: { pan: { enabled: true, mode: 'x', onPanComplete: ({ chart }) => saveChartZoom(chart, 'discoveries') }, zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x', onZoomComplete: ({ chart }) => saveChartZoom(chart, 'discoveries') } }
        },
        scales: {
          x: { stacked: true, ticks: { color: gc.text3, maxTicksLimit: maxTicks, maxRotation: 45 }, grid: { color: gc.grid } },
          y: { stacked: true, ticks: { color: gc.text3 }, grid: { color: gc.grid } }
        }
      },
      plugins: [discoveriesLabelsPlugin]
    });
    restoreChartZoom(graphCharts.discoveries, 'discoveries');
  }

  // ── Bar Race: set default date range ──────────────────────
  {
    const rfEl = document.getElementById('raceFrom');
    if (!rfEl.value && allPlays.length) {
      rfEl.value = localDateStr(tzDate(allPlays[allPlays.length - 1].date));
      document.getElementById('raceTo').value = localDateStr(tzNow());
    }
  }
  initRace();
  {
    const savedFrameIdx = localStorage.getItem('dc_raceFrameIdx');
    if (savedFrameIdx !== null) {
      const idx = parseInt(savedFrameIdx);
      if (idx > 0 && idx < raceFrames.length) {
        raceFrameIdx = idx; raceProgress = 0;
        const slider = document.getElementById('raceSeekSlider');
        if (slider) slider.value = idx;
        drawRace(raceFrameIdx, 0);
      }
    }
  }
}

let gCumulativeArtists = [];
let gCumulativeLabels = false;
let gVolumeLabels = false;
let gVolumeArtists = [];
let gTotalVolumeLabels = false;
let gDiscoveriesLabels = false;

function saveChartZoom(chart, key) {
  const scale = chart.scales && chart.scales.x;
  if (!scale) return;
  const min = scale.options.min;
  const max = scale.options.max;
  if (min != null && max != null) {
    localStorage.setItem('dc_zoom_' + key, JSON.stringify({ min, max }));
  } else {
    localStorage.removeItem('dc_zoom_' + key);
  }
}
function restoreChartZoom(chart, key) {
  const saved = localStorage.getItem('dc_zoom_' + key);
  if (!saved) return;
  try {
    const { min, max } = JSON.parse(saved);
    chart.zoomScale('x', { min, max }, 'none');
  } catch (e) { }
}

function renderCumulativeChips() {
  const wrap = document.getElementById('gCumulativeChips');
  wrap.innerHTML = gCumulativeArtists.map((a, i) => {
    const col = GRAPH_PALETTE[i % GRAPH_PALETTE.length];
    return `<span style="display:inline-flex;align-items:center;gap:4px;background:${col}22;border:1px solid ${col};
              color:${col};font-family:'DM Mono',monospace;font-size:0.65rem;padding:2px 8px;border-radius:20px;
              letter-spacing:0.04em;">
              ${esc(a)}
              <button onclick="removeCumulativeArtist(${i})" style="background:none;border:none;color:${col};
                cursor:pointer;font-size:0.75rem;line-height:1;padding:0 0 1px 2px;">×</button>
            </span>`;
  }).join('');
}

function removeCumulativeArtist(idx) {
  gCumulativeArtists.splice(idx, 1);
  localStorage.setItem('dc_gCumulativeArtists', JSON.stringify(gCumulativeArtists));
  renderCumulativeChips();
  triggerCumulativeUpdate();
}

function renderCumulativeChart(sortedKeys, labels, ptRadius, gc, axisOpts, legendOpts) {
  if (graphCharts.cumulative) { try { graphCharts.cumulative.destroy(); } catch (e) { } delete graphCharts.cumulative; }

  // Date range filter
  const fromVal = document.getElementById('gCumulativeFrom').value;
  const toVal = document.getElementById('gCumulativeTo').value;
  const fromTs = fromVal ? new Date(fromVal + 'T00:00:00').getTime() : -Infinity;
  const toTs = toVal ? new Date(toVal + 'T23:59:59').getTime() : Infinity;

  // Filter sortedKeys to range
  const filteredKeys = sortedKeys.filter(k => {
    const d = graphGranularity === 'day' ? new Date(k + 'T00:00:00') :
      graphGranularity === 'month' ? new Date(k + '-01T00:00:00') :
        new Date(k + '-01-01T00:00:00');
    return d.getTime() >= fromTs && d.getTime() <= toTs;
  });
  const filteredLabels = filteredKeys.map(graphKeyLabel);
  const filtPtRadius = filteredLabels.length > 100 ? 0 : 2;

  const datasets = gCumulativeArtists.map((artistName, i) => {
    const col = GRAPH_PALETTE[i % GRAPH_PALETTE.length];
    const countByKey = {};
    for (const p of allPlays) {
      if (p.date.getTime() < fromTs || p.date.getTime() > toTs) continue;
      if (p.artists.some(a => a.toLowerCase() === artistName.toLowerCase())) {
        const k = graphKey(p.date); countByKey[k] = (countByKey[k] || 0) + 1;
      }
    }
    let running = 0;
    return {
      label: artistName, data: filteredKeys.map(k => { running += countByKey[k] || 0; return running; }),
      borderColor: col, backgroundColor: col + '18',
      fill: gCumulativeArtists.length === 1, tension: 0.3, pointRadius: filtPtRadius, borderWidth: 2
    };
  });
  const labelsPlugin = {
    id: 'cumulativeLabels',
    afterDatasetsDraw(chart) {
      if (!gCumulativeLabels) return;
      const ctx = chart.ctx;
      chart.data.datasets.forEach((ds, di) => {
        const meta = chart.getDatasetMeta(di);
        if (meta.hidden) return;
        meta.data.forEach((pt, i) => {
          const val = ds.data[i];
          if (val == null) return;
          ctx.save();
          ctx.font = '600 10px "DM Mono", monospace';
          ctx.fillStyle = ds.borderColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(val.toLocaleString(), pt.x, pt.y - 4);
          ctx.restore();
        });
      });
    }
  };

  graphCharts.cumulative = new Chart(document.getElementById('gCumulative'), {
    type: 'line',
    data: { labels: filteredLabels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: legendOpts,
        zoom: {
          pan: { enabled: true, mode: 'x', onPanComplete: ({ chart }) => saveChartZoom(chart, 'cumulative') },
          zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x', onZoomComplete: ({ chart }) => saveChartZoom(chart, 'cumulative') }
        }
      },
      scales: axisOpts(false)
    },
    plugins: [labelsPlugin]
  });
  restoreChartZoom(graphCharts.cumulative, 'cumulative');
}

function triggerCumulativeUpdate() {
  if (currentPeriod !== 'graphs' || !allPlays.length) return;
  const gc = getGraphColors();
  const allKeys = new Set();
  for (const p of allPlays) allKeys.add(graphKey(p.date));
  const sortedKeys = [...allKeys].sort();
  const labels = sortedKeys.map(graphKeyLabel);
  const ptRadius = labels.length > 100 ? 0 : 2;
  const maxTicks = 24;
  const axisOpts = () => ({
    x: { ticks: { color: gc.text3, maxTicksLimit: maxTicks, maxRotation: 45 }, grid: { color: gc.grid } },
    y: { ticks: { color: gc.text3 }, grid: { color: gc.grid } }
  });
  const legendOpts = { labels: { color: gc.text3 } };
  renderCumulativeChart(sortedKeys, labels, ptRadius, gc, axisOpts, legendOpts);
}

function addCumulativeArtist() {
  const input = document.getElementById('gCumulativeArtistInput');
  const name = input.value.trim();
  if (!name) return;
  // Case-insensitive dedup
  if (gCumulativeArtists.some(a => a.toLowerCase() === name.toLowerCase())) { input.value = ''; return; }
  gCumulativeArtists.push(name);
  localStorage.setItem('dc_gCumulativeArtists', JSON.stringify(gCumulativeArtists));
  input.value = '';
  renderCumulativeChips();
  triggerCumulativeUpdate();
}

document.getElementById('gCumulativeArtistBtn').addEventListener('click', addCumulativeArtist);
document.getElementById('gCumulativeArtistInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') addCumulativeArtist();
});
document.getElementById('gCumulativeFrom').addEventListener('change', () => {
  localStorage.setItem('dc_gCumulativeFrom', document.getElementById('gCumulativeFrom').value);
  triggerCumulativeUpdate();
});
document.getElementById('gCumulativeTo').addEventListener('change', () => {
  localStorage.setItem('dc_gCumulativeTo', document.getElementById('gCumulativeTo').value);
  triggerCumulativeUpdate();
});
document.getElementById('gCumulativeLabelsBtn').addEventListener('click', () => {
  gCumulativeLabels = !gCumulativeLabels;
  localStorage.setItem('dc_gCumulativeLabels', gCumulativeLabels ? '1' : '0');
  updateLabelButton('gCumulativeLabelsBtn', gCumulativeLabels);
  triggerCumulativeUpdate();
});

document.getElementById('gCumulativeResetZoom').addEventListener('click', () => {
  if (graphCharts.cumulative) graphCharts.cumulative.resetZoom();
  localStorage.removeItem('dc_zoom_cumulative');
});

document.getElementById('gCumulativeResetRange').addEventListener('click', () => {
  if (!allPlays.length) return;
  document.getElementById('gCumulativeFrom').value = localDateStr(tzDate(allPlays[allPlays.length - 1].date));
  document.getElementById('gCumulativeTo').value = localDateStr(tzNow());
  localStorage.removeItem('dc_gCumulativeFrom');
  localStorage.removeItem('dc_gCumulativeTo');
  triggerCumulativeUpdate();
});


// ── Total volume chart (no artist filter) ────────────────────
function renderTotalVolumeChart(sortedKeys, gc, axisOpts, legendOpts) {
  if (graphCharts.totalVolume) { try { graphCharts.totalVolume.destroy(); } catch (e) { } delete graphCharts.totalVolume; }

  const fromVal = document.getElementById('gTotalVolumeFrom').value;
  const toVal = document.getElementById('gTotalVolumeTo').value;
  const fromTs = fromVal ? new Date(fromVal + 'T00:00:00').getTime() : -Infinity;
  const toTs = toVal ? new Date(toVal + 'T23:59:59').getTime() : Infinity;

  const filteredKeys = sortedKeys.filter(k => {
    const d = graphGranularity === 'day' ? new Date(k + 'T00:00:00') :
      graphGranularity === 'month' ? new Date(k + '-01T00:00:00') :
        new Date(k + '-01-01T00:00:00');
    return d.getTime() >= fromTs && d.getTime() <= toTs;
  });
  const filteredLabels = filteredKeys.map(graphKeyLabel);

  const countByKey = {};
  for (const p of allPlays) {
    if (p.date.getTime() < fromTs || p.date.getTime() > toTs) continue;
    const k = graphKey(p.date); countByKey[k] = (countByKey[k] || 0) + 1;
  }
  const col = gc.accent;

  const totalVolumeLabelsPlugin = {
    id: 'totalVolumeLabels',
    afterDatasetsDraw(chart) {
      if (!gTotalVolumeLabels) return;
      const ctx = chart.ctx;
      chart.data.datasets.forEach((ds, di) => {
        const meta = chart.getDatasetMeta(di);
        if (meta.hidden) return;
        meta.data.forEach((bar, i) => {
          const val = ds.data[i];
          if (!val) return;
          ctx.save();
          ctx.font = '600 10px "DM Mono", monospace';
          ctx.fillStyle = ds.borderColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(val.toLocaleString(), bar.x, bar.y - 2);
          ctx.restore();
        });
      });
    }
  };

  graphCharts.totalVolume = new Chart(document.getElementById('gTotalVolume'), {
    type: 'bar',
    data: {
      labels: filteredLabels, datasets: [{
        label: 'Plays', data: filteredKeys.map(k => countByKey[k] || 0),
        backgroundColor: col + '99', borderColor: col, borderWidth: 1
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        zoom: { pan: { enabled: true, mode: 'x', onPanComplete: ({ chart }) => saveChartZoom(chart, 'totalVolume') }, zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x', onZoomComplete: ({ chart }) => saveChartZoom(chart, 'totalVolume') } }
      },
      scales: axisOpts(false)
    },
    plugins: [totalVolumeLabelsPlugin]
  });
  restoreChartZoom(graphCharts.totalVolume, 'totalVolume');
}

function triggerTotalVolumeUpdate() {
  if (currentPeriod !== 'graphs' || !allPlays.length) return;
  const gc = getGraphColors();
  const allKeys = new Set();
  for (const p of allPlays) allKeys.add(graphKey(p.date));
  const sortedKeys = [...allKeys].sort();
  const maxTicks = 24;
  const axisOpts = () => ({ x: { ticks: { color: gc.text3, maxTicksLimit: maxTicks, maxRotation: 45 }, grid: { color: gc.grid } }, y: { ticks: { color: gc.text3 }, grid: { color: gc.grid } } });
  const legendOpts = { labels: { color: gc.text3 } };
  renderTotalVolumeChart(sortedKeys, gc, axisOpts, legendOpts);
}

// ── Artist comparison volume chart ────────────────────────────
function renderVolumeChips() {
  const wrap = document.getElementById('gVolumeChips');
  wrap.innerHTML = gVolumeArtists.map((a, i) => {
    const col = GRAPH_PALETTE[i % GRAPH_PALETTE.length];
    return `<span style="display:inline-flex;align-items:center;gap:4px;background:${col}22;border:1px solid ${col};
              color:${col};font-family:'DM Mono',monospace;font-size:0.65rem;padding:2px 8px;border-radius:20px;
              letter-spacing:0.04em;">
              ${esc(a)}
              <button onclick="removeVolumeArtist(${i})" style="background:none;border:none;color:${col};
                cursor:pointer;font-size:0.75rem;line-height:1;padding:0 0 1px 2px;">×</button>
            </span>`;
  }).join('');
}

function removeVolumeArtist(idx) {
  gVolumeArtists.splice(idx, 1);
  localStorage.setItem('dc_gVolumeArtists', JSON.stringify(gVolumeArtists));
  renderVolumeChips();
  triggerVolumeUpdate();
}

function renderVolumeChart(sortedKeys, gc, axisOpts, legendOpts) {
  if (graphCharts.volume) { try { graphCharts.volume.destroy(); } catch (e) { } delete graphCharts.volume; }

  const fromVal = document.getElementById('gVolumeFrom').value;
  const toVal = document.getElementById('gVolumeTo').value;
  const fromTs = fromVal ? new Date(fromVal + 'T00:00:00').getTime() : -Infinity;
  const toTs = toVal ? new Date(toVal + 'T23:59:59').getTime() : Infinity;

  const filteredKeys = sortedKeys.filter(k => {
    const d = graphGranularity === 'day' ? new Date(k + 'T00:00:00') :
      graphGranularity === 'month' ? new Date(k + '-01T00:00:00') :
        new Date(k + '-01-01T00:00:00');
    return d.getTime() >= fromTs && d.getTime() <= toTs;
  });
  const filteredLabels = filteredKeys.map(graphKeyLabel);

  const datasets = gVolumeArtists.map((artistName, i) => {
    const col = GRAPH_PALETTE[i % GRAPH_PALETTE.length];
    const countByKey = {};
    for (const p of allPlays) {
      if (p.date.getTime() < fromTs || p.date.getTime() > toTs) continue;
      if (p.artists.some(a => a.toLowerCase() === artistName.toLowerCase())) {
        const k = graphKey(p.date); countByKey[k] = (countByKey[k] || 0) + 1;
      }
    }
    return {
      label: artistName, data: filteredKeys.map(k => countByKey[k] || 0),
      backgroundColor: col + '99', borderColor: col, borderWidth: 1
    };
  });

  const volumeLabelsPlugin = {
    id: 'volumeLabels',
    afterDatasetsDraw(chart) {
      if (!gVolumeLabels) return;
      const ctx = chart.ctx;
      chart.data.datasets.forEach((ds, di) => {
        const meta = chart.getDatasetMeta(di);
        if (meta.hidden) return;
        meta.data.forEach((bar, i) => {
          const val = ds.data[i];
          if (!val) return;
          ctx.save();
          ctx.font = '600 10px "DM Mono", monospace';
          ctx.fillStyle = ds.borderColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(val.toLocaleString(), bar.x, bar.y - 2);
          ctx.restore();
        });
      });
    }
  };

  graphCharts.volume = new Chart(document.getElementById('gVolume'), {
    type: 'bar',
    data: { labels: filteredLabels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: legendOpts,
        zoom: { pan: { enabled: true, mode: 'x', onPanComplete: ({ chart }) => saveChartZoom(chart, 'volume') }, zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x', onZoomComplete: ({ chart }) => saveChartZoom(chart, 'volume') } }
      },
      scales: axisOpts(false)
    },
    plugins: [volumeLabelsPlugin]
  });
  restoreChartZoom(graphCharts.volume, 'volume');
}

function triggerVolumeUpdate() {
  if (currentPeriod !== 'graphs' || !allPlays.length) return;
  const gc = getGraphColors();
  const allKeys = new Set();
  for (const p of allPlays) allKeys.add(graphKey(p.date));
  const sortedKeys = [...allKeys].sort();
  const maxTicks = 24;
  const axisOpts = () => ({
    x: { ticks: { color: gc.text3, maxTicksLimit: maxTicks, maxRotation: 45 }, grid: { color: gc.grid } },
    y: { ticks: { color: gc.text3 }, grid: { color: gc.grid } }
  });
  const legendOpts = { labels: { color: gc.text3 } };
  renderVolumeChart(sortedKeys, gc, axisOpts, legendOpts);
}

function addVolumeArtist() {
  const input = document.getElementById('gVolumeArtistInput');
  const name = input.value.trim();
  if (!name) return;
  if (gVolumeArtists.some(a => a.toLowerCase() === name.toLowerCase())) { input.value = ''; return; }
  gVolumeArtists.push(name);
  localStorage.setItem('dc_gVolumeArtists', JSON.stringify(gVolumeArtists));
  input.value = '';
  renderVolumeChips();
  triggerVolumeUpdate();
}
document.getElementById('gVolumeArtistBtn').addEventListener('click', addVolumeArtist);
document.getElementById('gVolumeArtistInput').addEventListener('keydown', e => { if (e.key === 'Enter') addVolumeArtist(); });

document.getElementById('gTotalVolumeFrom').addEventListener('change', () => {
  localStorage.setItem('dc_gTotalVolumeFrom', document.getElementById('gTotalVolumeFrom').value);
  triggerTotalVolumeUpdate();
});
document.getElementById('gTotalVolumeTo').addEventListener('change', () => {
  localStorage.setItem('dc_gTotalVolumeTo', document.getElementById('gTotalVolumeTo').value);
  triggerTotalVolumeUpdate();
});
document.getElementById('gTotalVolumeResetRange').addEventListener('click', () => {
  if (!allPlays.length) return;
  document.getElementById('gTotalVolumeFrom').value = localDateStr(tzDate(allPlays[allPlays.length - 1].date));
  document.getElementById('gTotalVolumeTo').value = localDateStr(tzNow());
  localStorage.removeItem('dc_gTotalVolumeFrom');
  localStorage.removeItem('dc_gTotalVolumeTo');
  triggerTotalVolumeUpdate();
});
document.getElementById('gTotalVolumeResetZoom').addEventListener('click', () => {
  if (graphCharts.totalVolume) graphCharts.totalVolume.resetZoom();
  localStorage.removeItem('dc_zoom_totalVolume');
});
document.getElementById('gTotalVolumeLabelsBtn').addEventListener('click', () => {
  gTotalVolumeLabels = !gTotalVolumeLabels;
  localStorage.setItem('dc_gTotalVolumeLabels', gTotalVolumeLabels ? '1' : '0');
  updateLabelButton('gTotalVolumeLabelsBtn', gTotalVolumeLabels);
  triggerTotalVolumeUpdate();
});

document.getElementById('gVolumeFrom').addEventListener('change', () => {
  localStorage.setItem('dc_gVolumeFrom', document.getElementById('gVolumeFrom').value);
  triggerVolumeUpdate();
});
document.getElementById('gVolumeTo').addEventListener('change', () => {
  localStorage.setItem('dc_gVolumeTo', document.getElementById('gVolumeTo').value);
  triggerVolumeUpdate();
});
document.getElementById('gVolumeResetRange').addEventListener('click', () => {
  if (!allPlays.length) return;
  document.getElementById('gVolumeFrom').value = localDateStr(tzDate(allPlays[allPlays.length - 1].date));
  document.getElementById('gVolumeTo').value = localDateStr(tzNow());
  localStorage.removeItem('dc_gVolumeFrom');
  localStorage.removeItem('dc_gVolumeTo');
  triggerVolumeUpdate();
});
document.getElementById('gVolumeResetZoom').addEventListener('click', () => {
  if (graphCharts.volume) graphCharts.volume.resetZoom();
  localStorage.removeItem('dc_zoom_volume');
});
document.getElementById('gVolumeLabelsBtn').addEventListener('click', () => {
  gVolumeLabels = !gVolumeLabels;
  localStorage.setItem('dc_gVolumeLabels', gVolumeLabels ? '1' : '0');
  updateLabelButton('gVolumeLabelsBtn', gVolumeLabels);
  triggerVolumeUpdate();
});

document.getElementById('gDiscoveriesResetZoom').addEventListener('click', () => {
  if (graphCharts.discoveries) graphCharts.discoveries.resetZoom();
  localStorage.removeItem('dc_zoom_discoveries');
});
document.getElementById('gDiscoveriesLabelsBtn').addEventListener('click', () => {
  gDiscoveriesLabels = !gDiscoveriesLabels;
  localStorage.setItem('dc_gDiscoveriesLabels', gDiscoveriesLabels ? '1' : '0');
  updateLabelButton('gDiscoveriesLabelsBtn', gDiscoveriesLabels);
  if (graphCharts.discoveries) graphCharts.discoveries.update();
});

// ─── BAR CHART RACE ────────────────────────────────────────────
let raceFrames = [];
let raceFrameIdx = 0;
let raceProgress = 0;
let racePlaying = false;
let raceAnimId = null;
let raceSpeed = 1;
let raceTopN = 10;
let raceType = 'artists'; // 'artists' | 'songs' | 'albums'
let raceLastTime = null;
let raceW = 0;
let raceH = 0;
const raceImageCache = {};
const raceAvatarCache = {};
const raceArtistColors = {};
const BASE_FRAME_MS = 600;

function getRaceColor(name) {
  if (!raceArtistColors[name]) {
    const n = Object.keys(raceArtistColors).length;
    raceArtistColors[name] = GRAPH_PALETTE[n % GRAPH_PALETTE.length];
  }
  return raceArtistColors[name];
}

function raceLabel(key) {
  const locale = currentLang === 'en' ? 'en-US' : currentLang;
  if (graphGranularity === 'day') {
    const d = new Date(key + 'T00:00:00');
    return d.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (graphGranularity === 'month') {
    const [y, m] = key.split('-');
    return new Date(+y, +m - 1, 1).toLocaleDateString(locale, { month: 'short', year: 'numeric' });
  }
  return key; // year already is 4 digits
}

function loadRaceImage(key, meta) {
  // key = unique string, meta = { type, name, artist, album }
  if (raceImageCache[key] !== undefined) return;
  raceImageCache[key] = null;
  let promise;
  if (meta.type === 'artists') promise = getArtistImage(meta.name, 'deezer');
  else if (meta.type === 'songs') promise = getTrackImage(meta.name, meta.artist, 'deezer');
  else promise = getAlbumImage(meta.name, meta.artist, 'deezer');
  promise.then(url => {
    if (!url) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      raceImageCache[key] = img;
      Object.keys(raceAvatarCache).filter(k => k.startsWith(key + ':')).forEach(k => delete raceAvatarCache[k]);
      if (!racePlaying && raceFrames.length) drawRace(raceFrameIdx, raceProgress);
    };
    img.onerror = () => { };
    img.src = url;
  }).catch(() => { });
}

function getRaceAvatar(imgKey, size) {
  const cacheKey = `${imgKey}:${size}`;
  if (raceAvatarCache[cacheKey]) return raceAvatarCache[cacheKey];
  const img = raceImageCache[imgKey];
  if (!img) return null;
  const oc = document.createElement('canvas');
  oc.width = oc.height = size;
  const oc_ctx = oc.getContext('2d');
  try {
    oc_ctx.beginPath();
    oc_ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
    oc_ctx.clip();
    oc_ctx.drawImage(img, 0, 0, size, size);
    raceAvatarCache[cacheKey] = oc;
    return oc;
  } catch (e) {
    // Image tainted (loaded without crossOrigin) — skip avatar, return null
    delete raceImageCache[imgKey];
    return null;
  }
}

function buildRaceFrames() {
  // Date filter
  const fromVal = document.getElementById('raceFrom')?.value;
  const toVal = document.getElementById('raceTo')?.value;
  const fromDate = fromVal ? new Date(fromVal + 'T00:00:00') : null;
  const toDate = toVal ? new Date(toVal + 'T23:59:59') : null;
  const filtered = allPlays.filter(p => {
    if (fromDate && p.date < fromDate) return false;
    if (toDate && p.date > toDate) return false;
    return true;
  });

  const allKeys = new Set();
  for (const p of filtered) allKeys.add(graphKey(p.date));
  const sortedKeys = [...allKeys].sort();

  const periodPlays = {};
  for (const p of filtered) {
    const k = graphKey(p.date);
    if (!periodPlays[k]) periodPlays[k] = [];
    periodPlays[k].push(p);
  }

  const totals = {}; // imgKey -> count
  const metaMap = {}; // imgKey -> { type, name, artist, display, sub }
  const frames = [];

  for (const key of sortedKeys) {
    for (const p of (periodPlays[key] || [])) {
      if (raceType === 'artists') {
        for (const a of p.artists) {
          totals[a] = (totals[a] || 0) + 1;
          if (!metaMap[a]) metaMap[a] = { type: 'artists', name: a, display: a, sub: '' };
        }
      } else if (raceType === 'songs') {
        const mainArtist = (p.artists && p.artists[0]) || p.artist;
        const imgKey = `${mainArtist}||${p.title}`;
        totals[imgKey] = (totals[imgKey] || 0) + 1;
        if (!metaMap[imgKey]) metaMap[imgKey] = { type: 'songs', name: p.title, artist: mainArtist, display: p.title, sub: mainArtist };
      } else { // albums
        const mainArtist = (p.artists && p.artists[0]) || p.artist;
        const imgKey = `${mainArtist}||${p.album}`;
        totals[imgKey] = (totals[imgKey] || 0) + 1;
        if (!metaMap[imgKey]) metaMap[imgKey] = { type: 'albums', name: p.album, artist: mainArtist, display: p.album, sub: mainArtist };
      }
    }
    const ranked = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    ranked.slice(0, raceTopN + 10).forEach(([k]) => getRaceColor(k));
    frames.push({
      key, label: raceLabel(key),
      artists: ranked.slice(0, raceTopN + 5).map(([imgKey, count]) => {
        const m = metaMap[imgKey] || { display: imgKey, sub: '' };
        return { imgKey, name: m.display, sub: m.sub, count };
      })
    });
  }

  // Prepend a zero frame so bars grow from nothing at the start
  if (frames.length) {
    const zeroArtists = frames[0].artists.map(a => ({ ...a, count: 0 }));
    frames.unshift({ key: '__zero__', label: frames[0].label, artists: zeroArtists });
  }

  // Load images for every entity that appears in the top-N across all frames
  // Clear stale image cache entries so they reload with crossOrigin=anonymous
  const topKeys = new Set();
  frames.forEach(f => f.artists.slice(0, raceTopN).forEach(a => topKeys.add(a.imgKey)));
  topKeys.forEach(k => {
    const m = metaMap[k];
    if (m) {
      delete raceImageCache[k];
      Object.keys(raceAvatarCache).filter(c => c.startsWith(k + ':')).forEach(c => delete raceAvatarCache[c]);
      loadRaceImage(k, m);
    }
  });
  return frames;
}

function easeRace(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

function rrect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  if (r <= 0 || w <= 0 || h <= 0) { if (w > 0 && h > 0) ctx.rect(x, y, w, h); return; }
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawRace(frameIdx, progress, targetCanvas) {
  const canvas = targetCanvas || document.getElementById('gBarRace');
  if (!canvas || !raceFrames.length) return;
  const ctx = canvas.getContext('2d');
  const W = targetCanvas ? canvas.width : raceW;
  const H = targetCanvas ? canvas.height : raceH;
  const frameA = raceFrames[frameIdx];
  const frameB = raceFrames[Math.min(frameIdx + 1, raceFrames.length - 1)];
  const gc = getGraphColors();
  const eased = easeRace(progress);

  const LABEL_W = 148;
  const PAD_TOP = 12;
  const BAR_H = raceTopN > 15 ? 26 : 32;
  const SLOT_H = raceTopN > 15 ? 36 : 42;
  const AV_R = raceTopN > 15 ? 12 : 15;
  const CNT_W = 74;
  const BAR_X = LABEL_W + 6;
  const BAR_MAX_W = W - BAR_X - AV_R * 2 - 8 - CNT_W;

  ctx.clearRect(0, 0, W, H);
  if (targetCanvas) {
    ctx.fillStyle = gc.bg || '#0a1628';
    ctx.fillRect(0, 0, W, H);
  }

  const mapA = new Map(frameA.artists.map((a, i) => [a.imgKey, { rank: i, count: a.count, name: a.name, sub: a.sub }]));
  const mapB = new Map(frameB.artists.map((a, i) => [a.imgKey, { rank: i, count: a.count, name: a.name, sub: a.sub }]));
  const maxCount = Math.max(1, frameB.artists[0]?.count || 0, frameA.artists[0]?.count || 0);

  const visSet = new Set([
    ...frameA.artists.slice(0, raceTopN).map(a => a.imgKey),
    ...frameB.artists.slice(0, raceTopN).map(a => a.imgKey)
  ]);
  const items = [];
  for (const imgKey of visSet) {
    const a = mapA.get(imgKey) || { rank: raceTopN + 2, count: 0 };
    const b = mapB.get(imgKey) || { rank: raceTopN + 2, count: a.count };
    const meta = mapA.get(imgKey) || mapB.get(imgKey) || {};
    items.push({
      imgKey, name: meta.name || imgKey, sub: meta.sub || '',
      rank: a.rank + (b.rank - a.rank) * eased, count: a.count + (b.count - a.count) * progress
    });
  }
  items.sort((a, b) => a.rank - b.rank);

  const dpr = window.devicePixelRatio || 1;
  const avSize = Math.round(AV_R * 2 * dpr);

  for (const { imgKey, name, sub, rank, count } of items) {
    const alpha = rank >= raceTopN ? Math.max(0, (raceTopN + 0.6 - rank) / 0.6) : 1;
    if (alpha <= 0) continue;
    ctx.globalAlpha = alpha;

    const y = PAD_TOP + rank * SLOT_H;
    const bW = Math.max(0, Math.min((count / maxCount) * BAR_MAX_W, BAR_MAX_W));
    const color = getRaceColor(imgKey);

    // Bar track
    ctx.beginPath(); rrect(ctx, BAR_X, y, BAR_MAX_W, BAR_H, 5);
    ctx.fillStyle = (gc.card || '#0e1e38');
    ctx.fill();

    // Bar fill with gradient
    if (bW > 1) {
      const grad = ctx.createLinearGradient(BAR_X, 0, BAR_X + bW, 0);
      grad.addColorStop(0, color + '55'); grad.addColorStop(1, color + 'dd');
      ctx.fillStyle = grad;
      ctx.beginPath(); rrect(ctx, BAR_X, y, bW, BAR_H, 5);
      ctx.fill();
    }

    // Rank badge — colored pill on the far left
    const rankN = Math.round(rank) + 1;
    const rankStr = String(rankN);
    ctx.font = `bold ${raceTopN > 15 ? 11 : 13}px "DM Mono", monospace`;
    const pillW = Math.max(24, ctx.measureText(rankStr).width + 12);
    const pillH = Math.min(BAR_H - 6, raceTopN > 15 ? 16 : 20);
    const pillX = 2;
    const pillY = y + (BAR_H - pillH) / 2;
    ctx.beginPath(); rrect(ctx, pillX, pillY, pillW, pillH, 4);
    ctx.fillStyle = color + '35'; ctx.fill();
    ctx.strokeStyle = color + '90'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = color;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(rankStr, pillX + pillW / 2, pillY + pillH / 2 + 0.5);

    // Name (and optional sub) — right-aligned in remaining label space
    const nameAreaX = pillX + pillW + 4;
    const nameMaxW = LABEL_W - 2 - nameAreaX;
    ctx.textAlign = 'right';
    if (sub) {
      ctx.fillStyle = gc.text || '#e8f0ff';
      ctx.font = '500 11px "DM Sans", sans-serif';
      ctx.textBaseline = 'middle';
      let dname = name;
      while (ctx.measureText(dname).width > nameMaxW && dname.length > 3) dname = dname.slice(0, -2) + '…';
      ctx.fillText(dname, LABEL_W - 2, y + BAR_H / 2 - 4);
      ctx.fillStyle = gc.text3 || '#7aa0d0';
      ctx.font = '400 9px "DM Sans", sans-serif';
      let dsub = sub;
      while (ctx.measureText(dsub).width > nameMaxW && dsub.length > 3) dsub = dsub.slice(0, -2) + '…';
      ctx.fillText(dsub, LABEL_W - 2, y + BAR_H / 2 + 7);
    } else {
      ctx.fillStyle = gc.text || '#e8f0ff';
      ctx.font = `500 ${raceTopN > 15 ? 11 : 12}px "DM Sans", sans-serif`;
      ctx.textBaseline = 'middle';
      let dname = name;
      while (ctx.measureText(dname).width > nameMaxW && dname.length > 3) dname = dname.slice(0, -2) + '…';
      ctx.fillText(dname, LABEL_W - 2, y + BAR_H / 2 + 1);
    }

    // Avatar at bar tip (clamped so it stays on screen)
    const avX = BAR_X + Math.max(AV_R + 2, Math.min(bW + AV_R + 1, BAR_MAX_W - AV_R - 2));
    const avY = y + BAR_H / 2;
    const avatarCanvas = getRaceAvatar(imgKey, avSize);
    if (avatarCanvas) {
      ctx.save();
      ctx.beginPath(); ctx.arc(avX, avY, AV_R, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(avatarCanvas, avX - AV_R, avY - AV_R, AV_R * 2, AV_R * 2);
      ctx.restore();
    } else {
      ctx.beginPath(); ctx.arc(avX, avY, AV_R, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `700 ${Math.max(7, Math.round(AV_R * 0.62))}px "DM Sans", sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(name.split(/[\s\-&]+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?', avX, avY + 0.5);
    }
    ctx.beginPath(); ctx.arc(avX, avY, AV_R, 0, Math.PI * 2);
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();

    // Play count
    ctx.fillStyle = gc.text || '#e8f0ff';
    ctx.font = '600 11px "DM Mono", monospace';
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(count).toLocaleString(), W - 4, y + BAR_H / 2 + 1);

    ctx.globalAlpha = 1;
  }

  // Date — bottom right, crossfade between frame labels
  ctx.globalAlpha = 1;
  ctx.font = 'bold 18px "DM Mono", monospace';
  ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
  ctx.fillStyle = gc.text3 || '#7aa0d0';
  if (progress > 0 && frameA.label !== frameB.label) {
    ctx.globalAlpha = 1 - progress; ctx.fillText(frameA.label, W - 12, H - 10);
    ctx.globalAlpha = progress; ctx.fillText(frameB.label, W - 12, H - 10);
    ctx.globalAlpha = 1;
  } else {
    ctx.fillText(frameA.label, W - 12, H - 10);
  }
}

function raceAnimate(ts) {
  if (!racePlaying) return;
  if (!raceLastTime) raceLastTime = ts;
  raceProgress += (ts - raceLastTime) / (BASE_FRAME_MS / raceSpeed);
  raceLastTime = ts;
  if (raceProgress >= 1) {
    raceProgress = 0; raceFrameIdx++;
    if (raceFrameIdx >= raceFrames.length - 1) {
      raceFrameIdx = raceFrames.length - 1; raceProgress = 0; racePlaying = false;
      const btn = document.getElementById('racePlayBtn');
      btn.textContent = '▶ Play'; btn.classList.add('active');
      drawRace(raceFrameIdx, 0); raceUpdateSlider(); return;
    }
  }
  drawRace(raceFrameIdx, raceProgress);
  raceUpdateSlider();
  raceAnimId = requestAnimationFrame(raceAnimate);
}

function raceUpdateSlider() {
  const s = document.getElementById('raceSeekSlider');
  if (s) s.value = raceFrameIdx + raceProgress;
}

function initRace() {
  if (!allPlays.length) return;
  racePlaying = false;
  if (raceAnimId) { cancelAnimationFrame(raceAnimId); raceAnimId = null; }
  raceLastTime = null;
  raceFrames = buildRaceFrames();
  raceFrameIdx = 0; raceProgress = 0;

  const canvas = document.getElementById('gBarRace');
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const SLOT_H = raceTopN > 15 ? 36 : 42; // compact rows for larger counts
  raceW = Math.max(300, (canvas.parentElement?.clientWidth || 600) - 34);
  raceH = raceTopN * SLOT_H + 62;
  canvas.width = Math.round(raceW * dpr);
  canvas.height = Math.round(raceH * dpr);
  canvas.style.height = raceH + 'px';
  canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);

  const slider = document.getElementById('raceSeekSlider');
  slider.max = Math.max(1, raceFrames.length - 1); slider.value = 0;
  document.getElementById('racePlayBtn').textContent = '▶ Play';
  document.getElementById('racePlayBtn').classList.add('active');
  drawRace(0, 0);
}

document.getElementById('racePlayBtn').addEventListener('click', () => {
  if (!raceFrames.length) return;
  if (raceFrameIdx >= raceFrames.length - 1 && !racePlaying) {
    raceFrameIdx = 0; raceProgress = 0; raceLastTime = null; raceUpdateSlider();
  }
  racePlaying = !racePlaying;
  const btn = document.getElementById('racePlayBtn');
  btn.textContent = racePlaying ? '⏸ Pause' : '▶ Play';
  btn.classList.toggle('active', racePlaying);
  if (racePlaying) { raceLastTime = null; raceAnimId = requestAnimationFrame(raceAnimate); }
  else {
    if (raceAnimId) { cancelAnimationFrame(raceAnimId); raceAnimId = null; }
    localStorage.setItem('dc_raceFrameIdx', raceFrameIdx);
  }
});

document.getElementById('raceRestartBtn').addEventListener('click', () => {
  racePlaying = false;
  if (raceAnimId) { cancelAnimationFrame(raceAnimId); raceAnimId = null; }
  raceFrameIdx = 0; raceProgress = 0; raceLastTime = null;
  localStorage.removeItem('dc_raceFrameIdx');
  document.getElementById('racePlayBtn').textContent = '▶ Play';
  document.getElementById('racePlayBtn').classList.add('active');
  raceUpdateSlider(); drawRace(0, 0);
});

document.getElementById('raceSpeedBtns').addEventListener('click', e => {
  const btn = e.target.closest('[data-speed]'); if (!btn) return;
  document.querySelectorAll('#raceSpeedBtns button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  raceSpeed = parseFloat(btn.dataset.speed);
  localStorage.setItem('dc_raceSpeed', btn.dataset.speed);
});

document.getElementById('raceTopNBtns').addEventListener('click', e => {
  const btn = e.target.closest('[data-topn]'); if (!btn) return;
  document.querySelectorAll('#raceTopNBtns button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  raceTopN = parseInt(btn.dataset.topn);
  localStorage.setItem('dc_raceTopN', btn.dataset.topn);
  if (currentPeriod === 'graphs') initRace();
});

document.getElementById('raceSeekSlider').addEventListener('input', e => {
  if (racePlaying) {
    racePlaying = false;
    if (raceAnimId) { cancelAnimationFrame(raceAnimId); raceAnimId = null; }
    const btn = document.getElementById('racePlayBtn');
    btn.textContent = '▶ Play'; btn.classList.add('active');
  }
  const v = parseFloat(e.target.value);
  raceFrameIdx = Math.min(Math.floor(v), raceFrames.length - 1);
  raceProgress = v - Math.floor(v);
  raceLastTime = null;
  localStorage.setItem('dc_raceFrameIdx', raceFrameIdx);
  drawRace(raceFrameIdx, raceProgress);
});

document.getElementById('raceTypeBtns').addEventListener('click', e => {
  const btn = e.target.closest('[data-racetype]'); if (!btn) return;
  document.querySelectorAll('#raceTypeBtns button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  raceType = btn.dataset.racetype;
  localStorage.setItem('dc_raceType', raceType);
  if (currentPeriod === 'graphs') initRace();
});

document.getElementById('raceFrom').addEventListener('change', () => {
  localStorage.setItem('dc_raceFrom', document.getElementById('raceFrom').value);
  if (currentPeriod === 'graphs') initRace();
});
document.getElementById('raceTo').addEventListener('change', () => {
  localStorage.setItem('dc_raceTo', document.getElementById('raceTo').value);
  if (currentPeriod === 'graphs') initRace();
});
document.getElementById('raceResetRange').addEventListener('click', () => {
  if (!allPlays.length) return;
  document.getElementById('raceFrom').value = localDateStr(tzDate(allPlays[allPlays.length - 1].date));
  document.getElementById('raceTo').value = localDateStr(tzNow());
  localStorage.removeItem('dc_raceFrom');
  localStorage.removeItem('dc_raceTo');
  if (currentPeriod === 'graphs') initRace();
});

document.getElementById('raceStepBackBtn').addEventListener('click', () => {
  if (!raceFrames.length) return;
  if (racePlaying) {
    racePlaying = false;
    if (raceAnimId) { cancelAnimationFrame(raceAnimId); raceAnimId = null; }
    const btn = document.getElementById('racePlayBtn');
    btn.textContent = '▶ Play'; btn.classList.add('active');
  }
  raceProgress = 0;
  raceFrameIdx = Math.max(0, raceFrameIdx - 1);
  raceLastTime = null;
  localStorage.setItem('dc_raceFrameIdx', raceFrameIdx);
  raceUpdateSlider(); drawRace(raceFrameIdx, 0);
});

document.getElementById('raceStepFwdBtn').addEventListener('click', () => {
  if (!raceFrames.length) return;
  if (racePlaying) {
    racePlaying = false;
    if (raceAnimId) { cancelAnimationFrame(raceAnimId); raceAnimId = null; }
    const btn = document.getElementById('racePlayBtn');
    btn.textContent = '▶ Play'; btn.classList.add('active');
  }
  raceProgress = 0;
  raceFrameIdx = Math.min(raceFrames.length - 1, raceFrameIdx + 1);
  raceLastTime = null;
  localStorage.setItem('dc_raceFrameIdx', raceFrameIdx);
  raceUpdateSlider(); drawRace(raceFrameIdx, 0);
});

document.getElementById('raceEndBtn').addEventListener('click', () => {
  if (!raceFrames.length) return;
  if (racePlaying) {
    racePlaying = false;
    if (raceAnimId) { cancelAnimationFrame(raceAnimId); raceAnimId = null; }
    const btn = document.getElementById('racePlayBtn');
    btn.textContent = '▶ Play'; btn.classList.add('active');
  }
  raceProgress = 0;
  raceFrameIdx = raceFrames.length - 1;
  raceLastTime = null;
  localStorage.setItem('dc_raceFrameIdx', raceFrameIdx);
  raceUpdateSlider(); drawRace(raceFrameIdx, 0);
});

// ─── GIF EXPORT ────────────────────────────────────────────────
async function loadGifJs() {
  if (window.GIF) return;
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js';
    s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function downloadRaceGif() {
  if (!raceFrames.length) return;
  const btn = document.getElementById('raceGifBtn');
  btn.disabled = true; btn.textContent = 'Loading…';
  try { await loadGifJs(); } catch (e) {
    btn.disabled = false; btn.textContent = '⬇ GIF';
    alert('Could not load GIF encoder. Check your connection.'); return;
  }
  let workerUrl;
  try {
    const workerText = await fetch('https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js').then(r => r.text());
    workerUrl = URL.createObjectURL(new Blob([workerText], { type: 'application/javascript' }));
  } catch (e) {
    btn.disabled = false; btn.textContent = '⬇ GIF';
    alert('Could not load GIF worker. Check your connection.'); return;
  }

  btn.textContent = 'Capturing…';
  const W = Math.round(raceW), H = Math.round(raceH);
  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = W; tmpCanvas.height = H;
  const frameDelay = Math.max(50, Math.round(BASE_FRAME_MS / raceSpeed));
  const gif = new GIF({ workers: 2, quality: 8, width: W, height: H, workerScript: workerUrl });

  const frameCount = raceFrames.length;
  for (let i = 0; i < frameCount; i++) {
    drawRace(i, 0, tmpCanvas);
    gif.addFrame(tmpCanvas, { copy: true, delay: i === frameCount - 1 ? frameDelay * 4 : frameDelay });
    if (i % 4 === 0) {
      btn.textContent = `Capturing… ${Math.round((i / frameCount) * 40)}%`;
      await new Promise(r => setTimeout(r, 0));
    }
  }
  // Restore main canvas view
  drawRace(raceFrameIdx, raceProgress);

  gif.on('progress', p => { btn.textContent = `Encoding… ${Math.round(40 + p * 60)}%`; });
  gif.on('finished', blob => {
    URL.revokeObjectURL(workerUrl);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `bar-race-${raceType}-${new Date().toISOString().slice(0, 10)}.gif`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    btn.disabled = false; btn.textContent = '⬇ GIF';
  });
  gif.on('abort', () => { URL.revokeObjectURL(workerUrl); btn.disabled = false; btn.textContent = '⬇ GIF'; });

  btn.textContent = 'Encoding… 40%';
  gif.render();
}

document.getElementById('raceGifBtn').addEventListener('click', downloadRaceGif);

document.getElementById('graphGranularity').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#graphGranularity button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  graphGranularity = btn.dataset.gran;
  localStorage.setItem('dc_gran', graphGranularity);
  if (currentPeriod === 'graphs') renderGraphs();
});

// ── BACK TO TOP BUTTON ──
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('visible', window.scrollY > window.innerHeight / 6);
}, { passive: true });
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

