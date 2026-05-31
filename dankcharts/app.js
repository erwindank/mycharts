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
let eventsArtistLimit = parseInt(localStorage.getItem('dc_events_artist_limit') || '50') || 50;
let eventsCalendarYear = tzNow().getFullYear();
let eventsCalendarMonth = tzNow().getMonth();
let eventsCalendarDay = tzNow().getDate();
let eventsCalendarView = localStorage.getItem('dc_cal_view') || 'month'; // 'month' | 'week' | 'day'
let _eventsCalendarData = null;
let _eventsRawData = null;
let _eventsArtists = [];
let eventsTypeFilter = new Set(JSON.parse(localStorage.getItem('dc_events_type_filter') || '["birthday","album","single","ep","other","show"]'));
const tmApiKey = 'jviFLz26pGGfyAAtaVop4U5V0IdqUcKf';
let _concertsData = null;
let _nmfData = null;
let _nmfCalYear = tzNow().getFullYear();
let _nmfCalMonth = tzNow().getMonth();
let _nmfCalSelectedFriday = null;
const PAGE_SIZE = 100;
const pageState = { songs: 0, artists: 0, albums: 0, newSongs: 0, newArtists: 0, newAlbums: 0 };
const fullData = { songs: [], artists: [], albums: [] };
const fullNewData = { newSongs: [], newArtists: [], newAlbums: [] };
let lastPeriodStats = null;
let lastPeaks = null;
let _animPrevPlays = null; // previous-period plays used for chart entrance animation
let _animCurrentPlays = null;
const _replayFns = {}; // per-type full animation replay functions
let _animSpeedFactor = 0.25; // default slow; >1 = faster, <1 = slower; controlled by speed slider
const searchState = { songs: '', artists: '', albums: '' };
let imgObservers = [];
let imgQueue = Promise.resolve();

let certWallData   = [];
let certWallFilter = 'all';
let certWallSearch = '';
let certWallSort   = 'tier';
const CWALL_TIER_ORD = { diamond: 0, platinum: 1, gold: 2 };

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

function applyTheme(theme, preview = false) {
  document.body.classList.remove(...THEME_CLASSES);
  if (theme !== 'navy-dark') document.body.classList.add(theme);
  const normalizedTheme = theme.includes('-') ? theme : theme + '-dark';
  const labelKey = 'tooltip_theme_' + normalizedTheme.replace('-', '_');
  themeLabel.textContent = t(labelKey) || t('tooltip_theme_navy_dark');
  themeBtns.forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
  const dotColor = THEME_DOT_COLORS[theme] || '#1a6eb5';
  document.querySelectorAll('.ctrl-theme-dot').forEach(d => { d.style.background = dotColor; });
  if (!preview) {
    try { localStorage.setItem('dankcharts-theme', theme); } catch (e) { }
  }
}

themeBtns.forEach(btn => {
  btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
  btn.addEventListener('mouseenter', () => applyTheme(btn.dataset.theme, true));
  btn.addEventListener('mouseleave', () => {
    const saved = localStorage.getItem('dankcharts-theme') || 'navy-dark';
    applyTheme(saved, true);
  });
});

// Restore saved preference, defaulting to navy-dark
try {
  const saved = localStorage.getItem('dankcharts-theme') || 'navy-dark';
  applyTheme(saved);
} catch (e) { applyTheme('navy-dark'); }

// ─── DISPLAY TOGGLES ──────────────────────────────────────────
const DISPLAY_TOGGLE_CONFIG = {
  'cert':       { btnId: 'toggleCertBtn',      bodyClass: 'hide-cert' },
  'plays-peak': { btnId: 'togglePlaysPeakBtn', bodyClass: 'hide-plays-peak' },
  'peak-tags':  { btnId: 'togglePeakTagsBtn',  bodyClass: 'hide-peak-tags' },
  'yt-btns':    { btnId: 'toggleYtBtnsBtn',    bodyClass: 'hide-yt-btns' }
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
  if (typeof dcSaveUserConfig === 'function') dcSaveUserConfig();
}

initDisplayToggles();

function dcApplyDisplayToggles() {
  try {
    const saved = JSON.parse(localStorage.getItem('dc_displayToggles') || '{}');
    Object.assign(displayToggleState, saved);
  } catch(e) {}
  initDisplayToggles();
}
window.dcApplyDisplayToggles = dcApplyDisplayToggles;

function replayChartAnimation(type) {
  if (_replayFns[type]) { _replayFns[type](); return; }
}

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
    // Default to hidden; only show if user explicitly enabled it
    if (localStorage.getItem('dankcharts-hideSrcBtns') !== '0') {
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

// ─── CHART ANIMATION ───────────────────────────────────────────
let chartAnimEnabled = localStorage.getItem('dc_chart_anim') !== '0';

// ─── ARTIST SPLITTING ──────────────────────────────────────────
let noArtistSplit = localStorage.getItem('dc_no_artist_split') === '1';

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
  if (noArtistSplit || artistStr.indexOf(',') === -1) return [artistStr];
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
function getSheetWriteUrl()   { return localStorage.getItem('dc_sheet_write_url') || ''; }

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

function updateScrobbleBtn() {
  const scrobBtn = document.getElementById('scrobbleBtn');
  if (!scrobBtn) return;
  const hasLfm   = !!(getScrobbleSession() && getScrobbleUser());
  const hasSheet = !!(getSheetWriteUrl() && getDataSource() === 'sheets');
  scrobBtn.style.display = (currentPeriod === 'rawdata' && (hasLfm || hasSheet)) ? '' : 'none';
}

function updateLfmAuthStatus() {
  const user      = getScrobbleUser();
  const sess      = getScrobbleSession();
  const statusEl  = document.getElementById('lfmAuthStatus');
  const connectBtn= document.getElementById('lfmConnectBtn');
  const disconnBtn= document.getElementById('lfmDisconnectBtn');
  if (sess && user) {
    if (statusEl)   statusEl.innerHTML = `<span class="lfm-auth-dot connected"></span> Connected as <strong>${user}</strong>`;
    if (connectBtn) connectBtn.style.display = 'none';
    if (disconnBtn) disconnBtn.style.display = '';
  } else {
    if (statusEl)   statusEl.innerHTML = '<span class="lfm-auth-dot"></span> Not connected';
    if (connectBtn) { connectBtn.style.display = ''; connectBtn.textContent = 'Connect to Last.fm'; connectBtn.disabled = false; }
    if (disconnBtn) disconnBtn.style.display = 'none';
  }
  updateScrobbleBtn();
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
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
}

function openScrobbleModal() {
  document.getElementById('scrobbleModal').classList.add('open');
  document.getElementById('scrobbleArtist').value = '';
  document.getElementById('scrobbleTrack').value  = '';
  document.getElementById('scrobbleAlbum').value  = '';
  document.getElementById('scrobbleStatus').textContent = '';
  document.getElementById('scrobbleStatus').className   = 'scrobble-status';
  setScrobbleNow();

  const hasLfm   = !!(getScrobbleSession() && getScrobbleUser());
  const hasSheet = !!(getSheetWriteUrl() && getDataSource() === 'sheets');
  document.getElementById('scrobbleSubmitBtn').style.display = hasLfm   ? '' : 'none';
  document.getElementById('scrobbleSheetBtn').style.display  = hasSheet ? '' : 'none';
  document.getElementById('scrobbleNoTarget').style.display  = (!hasLfm && !hasSheet) ? '' : 'none';
}

function closeScrobbleModal() {
  document.getElementById('scrobbleModal').classList.remove('open');
}

function setScrobbleNow() {
  const now = new Date();
  now.setMilliseconds(0);
  document.getElementById('scrobbleTime').value = scrobbleDatetimeLocal(now);
}

function setEditScrobbleNow() {
  const now = new Date();
  now.setMilliseconds(0);
  document.getElementById('editScrobbleTime').value = scrobbleDatetimeLocal(now);
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

async function submitToSheet() {
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

  const writeUrl = getSheetWriteUrl();
  if (!writeUrl) {
    statusEl.textContent = 'No Apps Script URL configured.';
    statusEl.className   = 'scrobble-status err';
    return;
  }

  const btn = document.getElementById('scrobbleSheetBtn');
  btn.disabled = true;
  statusEl.textContent = 'Adding to sheet…';
  statusEl.className   = 'scrobble-status loading';

  try {
    const res  = await fetch(writeUrl, {
      method: 'POST',
      body: JSON.stringify({ artist, track, album, timestamp }),
    });
    const data = await res.json();
    if (data.status === 'error') throw new Error(data.message || 'Script error');
    statusEl.textContent = '✓ Added to sheet!';
    statusEl.className   = 'scrobble-status ok';
    setTimeout(closeScrobbleModal, 1500);
  } catch (e) {
    const msg = e.message === 'Failed to fetch'
      ? 'Could not reach the Apps Script. Check that it is deployed as a Web App with access set to "Anyone".'
      : e.message;
    statusEl.textContent = 'Error: ' + msg;
    statusEl.className   = 'scrobble-status err';
  }
  btn.disabled = false;
}

function copyAppsScript() {
  const code = document.getElementById('appsScriptCode').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('copyAppsScriptBtn');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
  });
}

// ─── AUTO-CORRECT RULES ───────────────────────────────────────

const RULES_KEY = 'dc_autocorrect_rules';

let _rulesCache = null;
window.dcResetRulesCache = () => { _rulesCache = null; };

async function initRulesCache() {
  const idbData = await loadFromIDB(IDB_RULES_KEY).catch(() => null);
  const idbRules = (idbData && Array.isArray(idbData.rules)) ? idbData.rules : null;
  const localRules = (() => { try { return JSON.parse(localStorage.getItem(RULES_KEY) || '[]'); } catch { return []; } })();
  if (idbRules) {
    _rulesCache = [...idbRules];
    for (const r of localRules) {
      const key = r.match.artist + '|' + r.match.title + '|' + r.match.album;
      if (!_rulesCache.some(s => s.match.artist + '|' + s.match.title + '|' + s.match.album === key)) {
        _rulesCache.push(r);
      }
    }
  } else {
    _rulesCache = localRules;
  }
  if (_rulesCache.length > 0) {
    localStorage.setItem(RULES_KEY, JSON.stringify(_rulesCache));
    saveToIDB(IDB_RULES_KEY, { rules: _rulesCache }).catch(() => {});
  }
}

function getAutocorrectRules() {
  if (_rulesCache !== null) return _rulesCache;
  try { return JSON.parse(localStorage.getItem(RULES_KEY) || '[]'); } catch { return []; }
}

function saveAutocorrectRule(origArtist, origTitle, origAlbum, newArtist, newTitle, newAlbum, { skipSheetSync = false } = {}) {
  const rules = getAutocorrectRules().filter(r =>
    !(r.match.artist === origArtist && r.match.title === origTitle && r.match.album === origAlbum)
  );
  rules.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    match:   { artist: origArtist, title: origTitle, album: origAlbum },
    replace: { artist: newArtist,  title: newTitle,  album: newAlbum  },
    createdAt: Date.now()
  });
  _rulesCache = rules;
  const rulesJson = JSON.stringify(rules);
  localStorage.setItem(RULES_KEY, rulesJson);
  saveToIDB(IDB_RULES_KEY, { rules }).catch(() => {});
  if (!skipSheetSync) syncRulesToSheet();
  if (typeof dcSaveRulesToFirestore === 'function') dcSaveRulesToFirestore(rulesJson);
}

function deleteAutocorrectRule(id) {
  const rules = getAutocorrectRules().filter(r => r.id !== id);
  _rulesCache = rules;
  const rulesJson = JSON.stringify(rules);
  localStorage.setItem(RULES_KEY, rulesJson);
  saveToIDB(IDB_RULES_KEY, { rules }).catch(() => {});
  syncRulesToSheet();
  renderRulesList();
  if (typeof dcSaveRulesToFirestore === 'function') dcSaveRulesToFirestore(rulesJson);
}

function findSimilarRules(origArtist, origTitle, origAlbum) {
  const aLow = origArtist.toLowerCase();
  const tLow = origTitle.toLowerCase();
  return getAutocorrectRules().filter(r =>
    r.match.artist.toLowerCase() === aLow &&
    r.match.title.toLowerCase()  === tLow
  );
}

function overrideSimilarRules(similar) {
  if (!similar.length) return;
  const ids  = new Set(similar.map(r => r.id));
  const rules = getAutocorrectRules().filter(r => !ids.has(r.id));
  _rulesCache  = rules;
  const json   = JSON.stringify(rules);
  localStorage.setItem(RULES_KEY, json);
  saveToIDB(IDB_RULES_KEY, { rules }).catch(() => {});
  if (typeof dcSaveRulesToFirestore === 'function') dcSaveRulesToFirestore(json);
}

function closeSimilarRuleModal() {
  document.getElementById('similarRuleModal').classList.remove('open');
}

async function applyRuleToSheet(matchArtist, matchTitle, matchAlbum, newArtist, newTitle, newAlbum) {
  const writeUrl = getSheetWriteUrl();
  if (!writeUrl) return { updated: 0, error: 'No sheet URL' };
  try {
    const res = await fetch(writeUrl, {
      method: 'POST',
      body: JSON.stringify({
        action: 'batchUpdate',
        matchArtist,
        matchTitle,
        matchAlbum: matchAlbum === '—' ? '' : matchAlbum,
        artist: newArtist,
        track:  newTitle,
        album:  newAlbum === '—' ? '' : newAlbum,
      }),
    });
    const data = await res.json();
    return { updated: data.updated || 0, error: data.status === 'error' ? (data.message || 'Script error') : null };
  } catch (e) {
    return { updated: 0, error: e.message };
  }
}

function checkSimilarRules(origArtist, origTitle, origAlbum, newArtist, newTitle, newAlbum) {
  const similar = findSimilarRules(origArtist, origTitle, origAlbum);
  if (!similar.length) return Promise.resolve({ choice: 'add', idsToRemove: [] });
  return new Promise(resolve => {
    const details = document.getElementById('similarRuleDetails');
    const hasSheet = !!getSheetWriteUrl();
    details.innerHTML =
      `<div style="font-size:0.72rem;color:var(--text3);margin-bottom:0.5rem">Check the rules below to remove them when saving. Uncheck any you want to keep.</div>` +
      similar.map((r, i) => `
        <div data-rule-row="${i}" style="padding-bottom:0.5rem;margin-bottom:0.5rem;border-bottom:1px solid var(--border)">
          <div style="display:flex;align-items:flex-start;gap:0.5rem">
            <label style="display:flex;align-items:flex-start;gap:0.55rem;cursor:pointer;flex:1">
              <input type="checkbox" class="similar-rule-cb" data-idx="${i}" checked style="margin-top:0.25rem;flex-shrink:0;cursor:pointer">
              <div style="line-height:1.6">
                <div>Match: <span style="color:var(--text2)">${esc(r.match.artist)} &mdash; ${esc(r.match.title)} &mdash; ${esc(r.match.album)}</span></div>
                <div>&rarr; Replace: <span style="color:var(--accent)">${esc(r.replace.artist)} &mdash; ${esc(r.replace.title)} &mdash; ${esc(r.replace.album)}</span></div>
              </div>
            </label>
            ${hasSheet ? `<button class="similar-rule-run-btn" data-idx="${i}" style="flex-shrink:0;font-size:0.7rem;padding:0.2rem 0.5rem;border:1px solid var(--border);border-radius:3px;background:var(--bg2);color:var(--text2);cursor:pointer;align-self:center">Run</button>` : ''}
            <button class="similar-rule-del-btn" data-idx="${i}" title="Delete this rule" style="flex-shrink:0;padding:0.15rem 0.4rem;border:1px solid var(--border);border-radius:3px;background:var(--bg2);color:#ef4444;cursor:pointer;align-self:center;font-size:0.9rem;line-height:1">🗑</button>
          </div>
          <div class="similar-rule-run-status" data-idx="${i}" style="font-size:0.7rem;margin-top:0.25rem;display:none"></div>
        </div>
      `).join('') +
      `<div style="margin-top:0.3rem;line-height:1.6">
        <div style="color:var(--text3);font-size:0.72rem;margin-bottom:0.1rem">New rule being saved:</div>
        <div>Match: <span style="color:var(--text2)">${esc(origArtist)} &mdash; ${esc(origTitle)} &mdash; ${esc(origAlbum || '&mdash;')}</span></div>
        <div>&rarr; Replace: <span style="color:var(--accent)">${esc(newArtist)} &mdash; ${esc(newTitle)} &mdash; ${esc(newAlbum || '&mdash;')}</span></div>
      </div>`;

    details.querySelectorAll('.similar-rule-run-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const r = similar[parseInt(btn.dataset.idx)];
        const statusEl = details.querySelector(`.similar-rule-run-status[data-idx="${btn.dataset.idx}"]`);
        btn.disabled = true;
        btn.textContent = '…';
        if (statusEl) { statusEl.style.display = ''; statusEl.textContent = 'Running…'; statusEl.style.color = 'var(--text3)'; }
        const result = await applyRuleToSheet(r.match.artist, r.match.title, r.match.album, r.replace.artist, r.replace.title, r.replace.album);
        btn.disabled = false;
        btn.textContent = 'Run';
        if (statusEl) {
          if (result.error) {
            statusEl.textContent = 'Failed: ' + result.error;
            statusEl.style.color = 'var(--err, #ef4444)';
          } else {
            statusEl.textContent = `✓ ${result.updated} entr${result.updated === 1 ? 'y' : 'ies'} updated in sheet`;
            statusEl.style.color = 'var(--accent)';
          }
        }
      });
    });

    details.querySelectorAll('.similar-rule-del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = similar[parseInt(btn.dataset.idx)];
        deleteAutocorrectRule(r.id);
        details.querySelector(`[data-rule-row="${btn.dataset.idx}"]`).remove();
      });
    });

    function getSelectedToRemove() {
      return [...document.querySelectorAll('.similar-rule-cb:checked')]
        .map(el => similar[parseInt(el.dataset.idx)]);
    }

    const runBtn = document.getElementById('similarRuleRunBtn');
    runBtn.style.display = hasSheet ? '' : 'none';
    document.getElementById('similarRuleCancelBtn').onclick   = () => { closeSimilarRuleModal(); resolve({ choice: 'cancel',   idsToRemove: [] }); };
    document.getElementById('similarRuleAddBtn').onclick      = () => { closeSimilarRuleModal(); resolve({ choice: 'add',      idsToRemove: [] }); };
    document.getElementById('similarRuleOverrideBtn').onclick = () => { closeSimilarRuleModal(); resolve({ choice: 'override', idsToRemove: getSelectedToRemove() }); };
    runBtn.onclick                                            = () => { closeSimilarRuleModal(); resolve({ choice: 'run',      idsToRemove: getSelectedToRemove() }); };
    document.getElementById('similarRuleModal').classList.add('open');
  });
}

function applyAutocorrectRules(plays) {
  const rules = getAutocorrectRules();
  if (!rules.length) return plays;
  return plays.map(p => {
    const rule = rules.find(r =>
      r.match.artist === p.artist && r.match.title === p.title && r.match.album === p.album
    );
    if (!rule) return p;
    const artist = rule.replace.artist;
    const title  = rule.replace.title;
    const album  = rule.replace.album;
    return { ...p, artist, title, album, artists: splitArtists(artist),
      _corrected: true, _orig: { artist: p.artist, title: p.title, album: p.album } };
  });
}

async function autoCorrectEntries(plays, writeUrl) {
  const rules = getAutocorrectRules();
  if (!rules.length) return;
  // Build the full rule map without filtering by local plays. The local plays may already
  // have corrected values (e.g. after a batchUpdate saves corrected CSV to IDB), which would
  // cause the filter to skip rules that still have uncorrected entries in the actual sheet.
  const activeRulesMap = {};
  for (const rule of rules) {
    const matchAlbum = rule.match.album === '—' ? '' : rule.match.album;
    const key = rule.match.artist + '|' + rule.match.title + '|' + matchAlbum;
    activeRulesMap[key] = {
      artist: rule.replace.artist,
      track:  rule.replace.title,
      album:  rule.replace.album === '—' ? '' : rule.replace.album,
    };
  }
  if (!Object.keys(activeRulesMap).length) return;
  try {
    const res = await fetch(writeUrl, {
      method: 'POST',
      body: JSON.stringify({ action: 'applyRules', rules: activeRulesMap })
    });
    const data = await res.json();
    if (data.status !== 'error' && data.updated > 0) {
      const statusEl = document.getElementById('syncStatus');
      const prevMsg = statusEl.textContent;
      const prevCls = statusEl.className;
      setSyncStatus(`✓ Auto-corrected ${data.updated} entr${data.updated === 1 ? 'y' : 'ies'} in sheet.`, 'ok');
      const dismissBtn = document.getElementById('syncDismissBtn');
      dismissBtn.style.display = '';
      dismissBtn.onclick = () => {
        setSyncStatus(prevMsg, prevCls);
        dismissBtn.style.display = 'none';
      };
    } else if (data.status === 'error')
      console.warn('Auto-correct: sheet update failed:', data.message);
  } catch (e) {
    console.warn('Auto-correct: sheet update failed:', e.message);
  }
}

async function syncRulesToSheet() {
  const writeUrl = getSheetWriteUrl();
  if (!writeUrl) return;
  try {
    await fetch(writeUrl, {
      method: 'POST',
      body: JSON.stringify({ action: 'saveRules', rules: JSON.stringify(getAutocorrectRules()) }),
    });
  } catch { /* silently skip if sheet unreachable */ }
}

async function loadRulesFromSheet() {
  const writeUrl = getSheetWriteUrl();
  if (!writeUrl) return;
  try {
    const res = await fetch(writeUrl, { method: 'POST', body: JSON.stringify({ action: 'loadRules' }) });
    if (!res.ok) return;
    const data = await res.json();
    if (data.status !== 'ok' || !data.rules) return;
    const sheetRules = JSON.parse(data.rules);
    if (!Array.isArray(sheetRules)) return;
    const local = getAutocorrectRules();
    const merged = [...sheetRules];
    let addedFromLocal = 0;
    for (const r of local) {
      const key = r.match.artist + '|' + r.match.title + '|' + r.match.album;
      if (!merged.some(s => s.match.artist + '|' + s.match.title + '|' + s.match.album === key)) {
        merged.push(r);
        addedFromLocal++;
      }
    }
    _rulesCache = merged;
    localStorage.setItem(RULES_KEY, JSON.stringify(merged));
    saveToIDB(IDB_RULES_KEY, { rules: merged }).catch(() => {});
    if (addedFromLocal > 0) syncRulesToSheet();
  } catch { /* silently skip if sheet unreachable */ }
}

function exportRules() {
  const rules = getAutocorrectRules();
  if (!rules.length) { alert('No rules to export.'); return; }
  const blob = new Blob([JSON.stringify(rules, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'autocorrect-rules.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importRules() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      if (!Array.isArray(imported)) throw new Error('invalid format');
      const existing = getAutocorrectRules();
      let added = 0;
      for (const r of imported) {
        const key = r.match?.artist + '|' + r.match?.title + '|' + r.match?.album;
        if (!existing.some(x => x.match.artist + '|' + x.match.title + '|' + x.match.album === key)) {
          existing.push(r);
          added++;
        }
      }
      _rulesCache = existing;
      const rulesJson = JSON.stringify(existing);
      localStorage.setItem(RULES_KEY, rulesJson);
      saveToIDB(IDB_RULES_KEY, { rules: existing }).catch(() => {});
      renderRulesList();
      syncRulesToSheet();
      if (typeof dcSaveRulesToFirestore === 'function') dcSaveRulesToFirestore(rulesJson);
      const skipped = imported.length - added;
      alert(`Imported ${added} new rule${added !== 1 ? 's' : ''}${skipped ? ` (${skipped} duplicate${skipped !== 1 ? 's' : ''} skipped)` : ''}.`);
    } catch { alert('Could not import: invalid JSON file.'); }
  };
  input.click();
}

function openRulesModal() {
  const search = document.getElementById('rulesSearch');
  if (search) search.value = '';
  renderRulesList();
  document.getElementById('rulesModal').classList.add('open');
}

function closeRulesModal() {
  document.getElementById('rulesModal').classList.remove('open');
}

function renderRulesList() {
  const allRules = getAutocorrectRules();
  const el = document.getElementById('rulesList');
  const q = (document.getElementById('rulesSearch')?.value || '').trim().toLowerCase();
  const rules = q
    ? allRules.filter(r => [r.match.artist, r.match.title, r.match.album, r.replace.artist, r.replace.title, r.replace.album].some(s => s.toLowerCase().includes(q)))
    : allRules;
  if (!allRules.length) {
    el.innerHTML = '<p style="font-size:0.8rem;color:var(--text3);text-align:center;padding:1rem 0">No rules saved yet.</p>';
    return;
  }
  if (!rules.length) {
    el.innerHTML = '<p style="font-size:0.8rem;color:var(--text3);text-align:center;padding:1rem 0">No rules match your search.</p>';
    return;
  }
  el.innerHTML = rules.map(r => `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:0.5rem 0;border-bottom:1px solid var(--border);gap:0.7rem">
      <div style="font-size:0.75rem;flex:1;min-width:0;line-height:1.5">
        <div style="color:var(--text3)">Match: <span style="color:var(--text2)">${esc(r.match.artist)} &mdash; ${esc(r.match.title)} &mdash; ${esc(r.match.album)}</span></div>
        <div style="color:var(--text3)">&rarr; Replace: <span style="color:var(--accent)">${esc(r.replace.artist)} &mdash; ${esc(r.replace.title)} &mdash; ${esc(r.replace.album)}</span></div>
      </div>
      <button onclick="deleteAutocorrectRule('${esc(r.id)}')" style="flex-shrink:0;font-size:0.72rem;padding:0.2rem 0.5rem;border:1px solid var(--border);border-radius:3px;background:var(--bg2);color:var(--text2);cursor:pointer">Delete</button>
    </div>
  `).join('');
}

// ─── EDIT SCROBBLE ────────────────────────────────────────────

let _editPlay    = null;
let _editOrigTs  = 0;
let _editOrigMatch = null;

function openEditScrobbleModal(rawIdx) {
  const p = rawFiltered[rawIdx];
  if (!p) return;
  _editPlay      = p;
  _editOrigTs    = p.date.getTime();
  _editOrigMatch = { artist: p.artist, title: p.title, album: p.album };
  document.getElementById('editScrobbleArtist').value = p.artist;
  document.getElementById('editScrobbleTrack').value  = p.title;
  document.getElementById('editScrobbleAlbum').value  = p.album === '—' ? '' : p.album;
  document.getElementById('editScrobbleTime').value   = scrobbleDatetimeLocal(p.date);
  document.getElementById('editScrobbleStatus').textContent = '';
  document.getElementById('editScrobbleStatus').className   = 'scrobble-status';
  document.getElementById('editApplyAll').checked  = false;
  document.getElementById('editSaveRule').checked  = false;
  const hasLfm   = !!(getScrobbleSession() && getScrobbleUser());
  const hasSheet = !!(getSheetWriteUrl() && getDataSource() === 'sheets');
  document.getElementById('editPushLfmBtn').style.display   = hasLfm   ? '' : 'none';
  document.getElementById('editPushSheetBtn').style.display = hasSheet ? '' : 'none';
  document.getElementById('editScrobbleHint').style.display = hasLfm   ? '' : 'none';
  document.getElementById('editScrobbleModal').classList.add('open');
}

function closeEditScrobbleModal() {
  document.getElementById('editScrobbleModal').classList.remove('open');
  _editPlay      = null;
  _editOrigMatch = null;
}

function _readEditFields() {
  const artist   = document.getElementById('editScrobbleArtist').value.trim();
  const title    = document.getElementById('editScrobbleTrack').value.trim();
  const album    = document.getElementById('editScrobbleAlbum').value.trim();
  const timeVal  = document.getElementById('editScrobbleTime').value;
  const statusEl = document.getElementById('editScrobbleStatus');
  if (!artist || !title) {
    statusEl.textContent = 'Artist and Track are required.';
    statusEl.className   = 'scrobble-status err';
    return null;
  }
  const ts = Math.floor(new Date(timeVal).getTime() / 1000);
  if (isNaN(ts)) {
    statusEl.textContent = 'Invalid date/time.';
    statusEl.className   = 'scrobble-status err';
    return null;
  }
  return { artist, title, album, ts, date: new Date(ts * 1000), statusEl };
}

async function saveEditLocally() {
  const f = _readEditFields();
  if (!f || !_editPlay) return;
  const applyAll = document.getElementById('editApplyAll').checked;
  const saveRule = document.getElementById('editSaveRule').checked;
  const orig     = _editOrigMatch;
  const newAlbum = f.album || '—';
  if (saveRule && orig) {
    const { choice, idsToRemove } = await checkSimilarRules(orig.artist, orig.title, orig.album, f.artist, f.title, newAlbum);
    if (choice === 'cancel') return;
    if ((choice === 'override' || choice === 'run') && idsToRemove.length) overrideSimilarRules(idsToRemove);
    saveAutocorrectRule(orig.artist, orig.title, orig.album, f.artist, f.title, newAlbum);
    if (choice === 'run') {
      applyRuleToSheet(orig.artist, orig.title, orig.album, f.artist, f.title, newAlbum).then(r => {
        const syncStatusEl = document.getElementById('syncStatus');
        const prevMsg = syncStatusEl ? syncStatusEl.textContent : '';
        const prevCls = syncStatusEl ? syncStatusEl.className : '';
        if (!r.error) {
          setSyncStatus(`✓ Applied rule: corrected ${r.updated} entr${r.updated === 1 ? 'y' : 'ies'} in sheet.`, 'ok');
          const dismissBtn = document.getElementById('syncDismissBtn');
          if (dismissBtn) {
            dismissBtn.style.display = '';
            dismissBtn.onclick = () => { setSyncStatus(prevMsg, prevCls); dismissBtn.style.display = 'none'; };
          }
        } else {
          setSyncStatus('Rule saved, but sheet apply failed: ' + r.error, 'err');
        }
      });
    }
  }
  if (applyAll && orig) {
    allPlays.forEach(p => {
      if (p.artist === orig.artist && p.title === orig.title && p.album === orig.album) {
        p.title   = f.title;
        p.artist  = f.artist;
        p.artists = splitArtists(f.artist);
        p.album   = newAlbum;
      }
    });
    _editPlay.date = f.date;
  } else {
    _editPlay.title   = f.title;
    _editPlay.artist  = f.artist;
    _editPlay.artists = splitArtists(f.artist);
    _editPlay.album   = newAlbum;
    _editPlay.date    = f.date;
  }
  firstSeenMaps = null;
  if (allPlays.length) {
    window.firstScrobbleDate = allPlays.reduce((min, p) => p.date < min ? p.date : min, allPlays[0].date);
  }
  renderAll();
  closeEditScrobbleModal();
}

async function pushEditToLastfm() {
  const f = _readEditFields();
  if (!f) return;
  const btn      = document.getElementById('editPushLfmBtn');
  const statusEl = f.statusEl;
  btn.disabled = true;
  statusEl.textContent = 'Pushing to Last.fm…';
  statusEl.className   = 'scrobble-status loading';
  try {
    const params = { method: 'track.scrobble', artist: f.artist, track: f.title, timestamp: String(f.ts), sk: getScrobbleSession() };
    if (f.album) params.album = f.album;
    await lfmPost(params);
    statusEl.textContent = '✓ Pushed to Last.fm! Remove the original scrobble manually on the Last.fm website.';
    statusEl.className   = 'scrobble-status ok';
  } catch (e) {
    statusEl.textContent = 'Error: ' + e.message;
    statusEl.className   = 'scrobble-status err';
  }
  btn.disabled = false;
}

function _serializePlaysCsv() {
  const pad = n => String(n).padStart(2, '0');
  const esc = v => (v.includes(',') || v.includes('"') || v.includes('\n'))
    ? '"' + v.replace(/"/g, '""') + '"' : v;
  const fmtDate = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  const rows = ['Song Title,Artist,Album,Date and Time'];
  for (const p of allPlays) {
    rows.push([esc(p.title), esc(p.artist), esc(p.album === '—' ? '' : p.album), fmtDate(p.date)].join(','));
  }
  return rows.join('\n');
}

async function pushEditToSheet() {
  const f = _readEditFields();
  if (!f) return;
  const writeUrl = getSheetWriteUrl();
  if (!writeUrl) {
    f.statusEl.textContent = 'No Apps Script URL configured.';
    f.statusEl.className   = 'scrobble-status err';
    return;
  }
  const applyAll = document.getElementById('editApplyAll').checked;
  const saveRule = document.getElementById('editSaveRule').checked;
  const orig     = _editOrigMatch;
  const newAlbum = f.album || '—';
  let _runRuleOnSheet = false;
  if (saveRule && orig) {
    const { choice, idsToRemove } = await checkSimilarRules(orig.artist, orig.title, orig.album, f.artist, f.title, newAlbum);
    if (choice === 'cancel') return;
    if ((choice === 'override' || choice === 'run') && idsToRemove.length) overrideSimilarRules(idsToRemove);
    // skipSheetSync=true so we don't fire a concurrent saveRules request alongside batchUpdate.
    // Apps Script serializes write requests; firing both at once just makes batchUpdate wait in queue.
    // We sync rules after the batchUpdate completes instead.
    saveAutocorrectRule(orig.artist, orig.title, orig.album, f.artist, f.title, newAlbum, { skipSheetSync: true });
    if (choice === 'run') _runRuleOnSheet = true;
  }
  const btn      = document.getElementById('editPushSheetBtn');
  const statusEl = f.statusEl;
  btn.disabled = true;
  let isBatchUpdate = false;
  let _batchDone = 0;
  let _batchTotal = 0;
  try {
    if (applyAll && orig) {
      isBatchUpdate = true;
      const matching = allPlays.filter(p =>
        p.artist === orig.artist && p.title === orig.title && p.album === orig.album
      );
      _batchTotal = matching.length;
      const t0 = Date.now();
      statusEl.textContent = `Updating ${_batchTotal} entr${_batchTotal === 1 ? 'y' : 'ies'} in sheet…`;
      statusEl.className   = 'scrobble-status loading';
      // allPlays has autocorrected values; the sheet has the originals.
      // Reverse-look up the autocorrect rule to find the original artist/title/album
      // that is actually stored in the sheet, so batchUpdate can match on it.
      const acRules = getAutocorrectRules();
      const revRule = acRules.find(r =>
        r.replace.artist === orig.artist &&
        r.replace.title  === orig.title  &&
        r.replace.album  === orig.album
      );
      const matchArtist = revRule ? revRule.match.artist : orig.artist;
      const matchTitle  = revRule ? revRule.match.title  : orig.title;
      const matchAlbum  = (revRule ? revRule.match.album : orig.album).replace(/^—$/, '');
      const batchRes  = await fetch(writeUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: 'batchUpdate',
          matchArtist, matchTitle, matchAlbum,
          artist: f.artist,
          track:  f.title,
          album:  f.album,
        }),
      });
      const batchData = await batchRes.json();
      if (batchData.status === 'error') throw new Error(batchData.message || 'Script error');
      _batchDone = batchData.updated || 0;
      allPlays.forEach(p => {
        if (p.artist === orig.artist && p.title === orig.title && p.album === orig.album) {
          p.title   = f.title;
          p.artist  = f.artist;
          p.artists = splitArtists(f.artist);
          p.album   = newAlbum;
        }
      });
      firstSeenMaps = null;
      if (allPlays.length) {
        window.firstScrobbleDate = allPlays.reduce((min, p) => p.date < min ? p.date : min, allPlays[0].date);
      }
      renderAll();
      saveToIDB(IDB_SHEETS_KEY, { ts: Date.now(), csv: _serializePlaysCsv() }).catch(() => {});
      if (saveRule) syncRulesToSheet();
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      statusEl.textContent = `✓ Updated ${_batchDone} entr${_batchDone === 1 ? 'y' : 'ies'} in sheet! (${elapsed}s)`;
      statusEl.className   = 'scrobble-status ok';
    } else {
      statusEl.textContent = 'Updating sheet…';
      statusEl.className   = 'scrobble-status loading';
      const res  = await fetch(writeUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: 'update',
          originalTimestamp: Math.floor(_editOrigTs / 1000),
          rowNumber: _editPlay._sheetRow,
          artist: f.artist,
          track:  f.title,
          album:  f.album,
          timestamp: f.ts,
        }),
      });
      const data = await res.json();
      if (data.status === 'error') throw new Error(data.message || 'Script error');
      if (!data.updated) throw new Error('Apps Script is outdated — please redeploy the latest version from the setup guide to enable editing.');
      _editPlay.title   = f.title;
      _editPlay.artist  = f.artist;
      _editPlay.artists = splitArtists(f.artist);
      _editPlay.album   = newAlbum;
      _editPlay.date    = f.date;
      firstSeenMaps = null;
      if (allPlays.length) {
        window.firstScrobbleDate = allPlays.reduce((min, p) => p.date < min ? p.date : min, allPlays[0].date);
      }
      renderAll();
      saveToIDB(IDB_SHEETS_KEY, { ts: Date.now(), csv: _serializePlaysCsv() }).catch(() => {});
      if (saveRule) syncRulesToSheet(); // fire-and-forget after update, not before
      if (_runRuleOnSheet) {
        statusEl.textContent = 'Applying rule to all matching entries…';
        statusEl.className   = 'scrobble-status loading';
        const r = await applyRuleToSheet(orig.artist, orig.title, orig.album, f.artist, f.title, newAlbum);
        statusEl.textContent = r.error
          ? `✓ Sheet updated! (Rule apply failed: ${r.error})`
          : `✓ Sheet updated! Rule applied to ${r.updated} entr${r.updated === 1 ? 'y' : 'ies'}.`;
        statusEl.className = 'scrobble-status ok';
      } else {
        statusEl.textContent = '✓ Sheet updated!';
        statusEl.className   = 'scrobble-status ok';
      }
    }
  } catch (e) {
    const isFetchError = e.message === 'Failed to fetch' || e.name === 'TypeError';
    if (isBatchUpdate && isFetchError) {
      allPlays.forEach(p => {
        if (p.artist === orig.artist && p.title === orig.title && p.album === orig.album) {
          p.title   = f.title;
          p.artist  = f.artist;
          p.artists = splitArtists(f.artist);
          p.album   = newAlbum;
        }
      });
      firstSeenMaps = null;
      if (allPlays.length) {
        window.firstScrobbleDate = allPlays.reduce((min, p) => p.date < min ? p.date : min, allPlays[0].date);
      }
      renderAll();
      saveToIDB(IDB_SHEETS_KEY, { ts: Date.now(), csv: _serializePlaysCsv() }).catch(() => {});
      const partial = _batchDone > 0 ? ` (${_batchDone}/${_batchTotal} written)` : '';
      statusEl.textContent = `⚠ Sheet update interrupted${partial}. Local view updated. Reload from sheet to confirm.`;
      statusEl.className   = 'scrobble-status ok';
    } else {
      const msg = isFetchError
        ? 'Could not reach the Apps Script. Check that it is deployed as a Web App with access set to "Anyone".'
        : e.message;
      statusEl.textContent = 'Error: ' + msg;
      statusEl.className   = 'scrobble-status err';
    }
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

function deezerFetch(endpoint) {
  const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const base = isLocal ? 'https://dankcharts.fm/deezer-proxy' : '/deezer-proxy';
  return fetch(base + '?url=' + encodeURIComponent(endpoint));
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
  if (!r.ok) return null;
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

// Called when a browser fails to render an image URL — cycles through remaining sources automatically.
// Tracks tried sources via data-tried-src to prevent repeating and stops once all are exhausted.
async function _imgFallback(img) {
  const FALLBACK_SOURCES = ['deezer', 'itunes', 'lastfm', 'youtube'];
  const tried = new Set(img.dataset.triedSrc ? img.dataset.triedSrc.split(',') : []);
  const type = img.dataset.type || '';
  const prefKey = img.dataset.prefkey || '';
  const name = img.dataset.name || '';
  const artist = img.dataset.artist || '';
  const album = img.dataset.album || '';
  const imgId = img.dataset.imgid || '';
  const fallback = name || album || artist || '';
  img.onerror = null; // prevent re-entry while async fetch is in flight
  for (const source of FALLBACK_SOURCES) {
    if (tried.has(source)) continue;
    tried.add(source);
    img.dataset.triedSrc = [...tried].join(',');
    let url = null;
    try {
      if (type === 'artist') url = await getArtistImage(name, source);
      else if (type === 'album') url = await getAlbumImage(album, artist, source);
      else url = await getTrackImage(name, artist, source);
    } catch (e) {}
    if (!img.isConnected) return;
    if (url) {
      img.onerror = function() { _imgFallback(this); };
      img.src = url;
      if (imgId) {
        const btn = document.getElementById('srcbtn-' + imgId);
        if (btn) btn.textContent = srcLabel(source);
      }
      if (prefKey) {
        itemSourcePrefs[prefKey] = source;
        localStorage.setItem('itemSourcePrefs', JSON.stringify(itemSourcePrefs));
      }
      return;
    }
  }
  // All sources exhausted — stay on initials, leave source button as-is (Deezer)
  if (img.isConnected) img.outerHTML = `<div class="thumb-initials">${esc(initials(fallback))}</div>`;
}

// Fetch and inject a single image into its container element
async function fetchAndInjectImage(el, item, type) {
  const FALLBACK_SOURCES = ['deezer', 'itunes', 'lastfm', 'youtube'];
  const preferredSource = (item.prefKey && itemSourcePrefs[item.prefKey]) || 'deezer';
  let url = null;
  let usedSource = preferredSource;

  if (preferredSource !== 'off') {
    const startIdx = Math.max(0, FALLBACK_SOURCES.indexOf(preferredSource));
    for (let i = 0; i < FALLBACK_SOURCES.length; i++) {
      const source = FALLBACK_SOURCES[(startIdx + i) % FALLBACK_SOURCES.length];
      if (i > 0 && source === 'deezer') break;
      try {
        if (type === 'artist') url = await getArtistImage(item.name, source);
        else if (type === 'album') url = await getAlbumImage(item.album, item.artist, source);
        else url = await getTrackImage(item.title, item.artist, source);
      } catch (e) { url = null; }
      if (source === 'deezer') await new Promise(r => setTimeout(r, 120));
      if (url) { usedSource = source; break; }
    }
    if (!url) usedSource = 'deezer';
  }

  if (!document.getElementById(item.imgId)) return;
  const fallback = item.name || item.title || item.album || '';
  if (url) {
    el.innerHTML = `<img class="thumb" alt="" loading="lazy" data-imgid="${esc(item.imgId || '')}" data-type="${esc(type)}" data-prefkey="${esc(item.prefKey || '')}" data-name="${esc(item.name || item.title || '')}" data-artist="${esc(item.artist || '')}" data-album="${esc(item.album || '')}" data-tried-src="${esc(usedSource)}">`;
    const newImg = el.querySelector('img');
    newImg.onerror = function() { _imgFallback(this); };
    newImg.src = url;
  } else {
    el.innerHTML = `<div class="thumb-initials">${esc(initials(fallback))}</div>`;
  }
  if (item.prefKey) {
    if (usedSource !== preferredSource) {
      itemSourcePrefs[item.prefKey] = usedSource;
      localStorage.setItem('itemSourcePrefs', JSON.stringify(itemSourcePrefs));
    }
    const btn = document.getElementById('srcbtn-' + item.imgId);
    if (btn) btn.textContent = srcLabel(usedSource);
  }
}

function clearImageObservers() {
  imgObservers.forEach(o => o.disconnect());
  imgObservers = [];
  imgQueue = Promise.resolve();
}

// Set up IntersectionObserver so images only load when scrolled into view
function loadImages(items, type) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const item = entry.target._imgItem;
      if (item) imgQueue = imgQueue.then(() => fetchAndInjectImage(entry.target, item, type));
    }
  }, { rootMargin: '300px' });
  imgObservers.push(observer);

  for (const item of items) {
    const el = document.getElementById(item.imgId);
    if (!el) continue;
    el._imgItem = item;
    observer.observe(el);
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
const DEFAULT_SHEET_TAB = 'Full Raw Listening History';
function getSheetUrl() {
  const rawId = localStorage.getItem('dc_sheet_id') || '';
  const tab   = localStorage.getItem('dc_sheet_tab') || DEFAULT_SHEET_TAB;
  // Support stored full URLs (e.g. from the deployed modal's URL input field)
  const urlMatch = rawId.match(/spreadsheets\/d\/([^\/\?#]+)/);
  const id = urlMatch ? urlMatch[1] : rawId;
  const gidFromStored = rawId.match(/[#&?]gid=(\d+)/);
  const gid = (gidFromStored && gidFromStored[1]) || localStorage.getItem('dc_sheet_gid') || '';
  // export?format=csv has no response size limit (unlike gviz/tq which truncates large sheets)
  if (gid) {
    return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
  }
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&sheet=${encodeURIComponent(tab)}`;
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
const IDB_FILE_KEY   = 'file_upload';
const IDB_RULES_KEY  = 'autocorrect_rules';
const BACKEND_API    = 'https://dankcharts-api.onrender.com';

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

function getSheetUrlFallback() {
  const rawId = localStorage.getItem('dc_sheet_id') || DEFAULT_SHEET_ID;
  const tab   = localStorage.getItem('dc_sheet_tab') || DEFAULT_SHEET_TAB;
  const urlMatch = rawId.match(/spreadsheets\/d\/([^\/\?#]+)/);
  const id = urlMatch ? urlMatch[1] : rawId;
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv;charset:UTF-8&sheet=${encodeURIComponent(tab)}`;
}

async function syncFromSheets() {
  if (!localStorage.getItem('dc_sheet_id')) {
    setSyncStatus('No Google Sheet configured — click ⚙ Configure to set one up.', 'err');
    document.getElementById('syncNowBtn').disabled = false;
    return;
  }
  const btn = document.getElementById('syncNowBtn');
  btn.disabled = true;
  setSyncStatus(t('sync_connecting'), 'loading');
  try {
    const bust = '&t=' + Date.now();
    let res = await fetch(getSheetUrl() + bust); // export?format=csv — no row/size limit
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
    // Fallback 1: backend proxy (handles CORS, serves full file regardless of size)
    try {
      const rawId = localStorage.getItem('dc_sheet_id') || DEFAULT_SHEET_ID;
      const urlMatch = rawId.match(/spreadsheets\/d\/([^\/\?#]+)/);
      const sheetId = urlMatch ? urlMatch[1] : rawId;
      const gid = localStorage.getItem('dc_sheet_gid');
      let proxyUrl = `${BACKEND_API}/api/sync/sheets-proxy?sheetId=${encodeURIComponent(sheetId)}`;
      if (gid) proxyUrl += `&gid=${encodeURIComponent(gid)}`;
      const res2 = await fetch(proxyUrl);
      if (!res2.ok) throw new Error('HTTP ' + res2.status);
      const buffer2 = await res2.arrayBuffer();
      const text2 = new TextDecoder('utf-8').decode(buffer2);
      parseCsv(text2, true);
      lastSyncTime = new Date();
      localStorage.setItem('dc_sync_ts', lastSyncTime.getTime().toString());
      await saveToIDB(IDB_SHEETS_KEY, { ts: lastSyncTime.getTime(), csv: text2 });
      setSyncStatus(t('sync_ok', { time: lastSyncTime.toLocaleTimeString(), n: allPlays.length.toLocaleString() }), 'ok');
    } catch (e2) {
      // Fallback 2: gviz/tq (may truncate very large sheets)
      try {
        const res3 = await fetch(getSheetUrlFallback() + '&t=' + Date.now());
        if (!res3.ok) throw new Error('HTTP ' + res3.status);
        const buffer3 = await res3.arrayBuffer();
        const text3 = new TextDecoder('utf-8').decode(buffer3);
        parseCsv(text3, true);
        lastSyncTime = new Date();
        localStorage.setItem('dc_sync_ts', lastSyncTime.getTime().toString());
        await saveToIDB(IDB_SHEETS_KEY, { ts: lastSyncTime.getTime(), csv: text3 });
        setSyncStatus(t('sync_ok', { time: lastSyncTime.toLocaleTimeString(), n: allPlays.length.toLocaleString() }), 'ok');
      } catch (e3) {
        setSyncStatus(t('sync_failed', { error: e3.message }), 'err');
      }
    }
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
      allPlays = applyAutocorrectRules(cached.data.map(([title, artist, album, uts]) => {
        const ar = artist || '';
        return { title, artist: ar, artists: splitArtists(ar), album: album || '—', date: new Date(uts * 1000) };
      }));
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

  allPlays = applyAutocorrectRules(rawTracks.map(t => {
    const ar = (t.artist && t.artist['#text']) || '';
    return {
      title:   t.name || '',
      artist:  ar,
      artists: splitArtists(ar),
      album:   (t.album && t.album['#text']) || '—',
      date:    new Date(parseInt(t.date.uts) * 1000)
    };
  }));

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
    if (!dt || dt.getFullYear() < 2000) continue;
    const artistRaw = get(colMap.artist);
    plays.push({ title: get(colMap.title), artist: artistRaw, artists: splitArtists(artistRaw), album: get(colMap.album) || '—', date: dt });
  }
  if (!plays.length) return null;
  plays.sort((a, b) => b.date - a.date);
  return applyAutocorrectRules(plays);
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
  renderStreakBanner();
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
        const newPlays = applyAutocorrectRules(newTracks.map(tr => {
          const ar = (tr.artist?.['#text']) || '';
          return { title: tr.name || '', artist: ar, artists: splitArtists(ar), album: tr.album?.['#text'] || '—', date: new Date(parseInt(tr.date.uts) * 1000) };
        }));
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
  const fileRadio = document.getElementById('srcRadioFile');
  if (fileRadio) fileRadio.checked = src === 'file';
  document.getElementById('srcDisplayName').value  = localStorage.getItem('dc_display_name') || '';
  populateTzSelect();
  document.getElementById('srcTimezone').value = userTimezone;
  document.getElementById('srcSheetId').value       = localStorage.getItem('dc_sheet_id')        || DEFAULT_SHEET_ID;
  document.getElementById('srcSheetTab').value      = localStorage.getItem('dc_sheet_tab')       || DEFAULT_SHEET_TAB;
  document.getElementById('srcSheetWriteUrl').value = localStorage.getItem('dc_sheet_write_url') || '';
  document.getElementById('srcLastfmUser').value   = getLastFmUser();
  document.getElementById('srcLfmApiKey').value    = getScrobbleKey();
  document.getElementById('srcLfmApiSecret').value = getScrobbleSecret();
  document.getElementById('certAlbumGold').value    = CERT.album.gold;
  document.getElementById('certAlbumPlat').value    = CERT.album.plat;
  document.getElementById('certAlbumDiamond').value = CERT.album.diamond;
  document.getElementById('certSongGold').value    = CERT.song.gold;
  document.getElementById('certSongPlat').value    = CERT.song.plat;
  document.getElementById('certSongDiamond').value = CERT.song.diamond;
  document.getElementById('eventsArtistLimitSelect').value = eventsArtistLimit;
  document.getElementById('srcNoArtistSplit').checked = noArtistSplit;
  document.getElementById('srcChartAnim').checked = chartAnimEnabled;
  updateSourceModalFields();
  initSrcFileUpload();
}

function closeSourceModal() {
  document.getElementById('sourceModal').classList.remove('open');
}

function resetCertDefaults() {
  document.getElementById('certAlbumGold').value    = CERT_DEFAULTS.album.gold;
  document.getElementById('certAlbumPlat').value    = CERT_DEFAULTS.album.plat;
  document.getElementById('certAlbumDiamond').value = CERT_DEFAULTS.album.diamond;
  document.getElementById('certSongGold').value    = CERT_DEFAULTS.song.gold;
  document.getElementById('certSongPlat').value    = CERT_DEFAULTS.song.plat;
  document.getElementById('certSongDiamond').value = CERT_DEFAULTS.song.diamond;
}

function updateSourceModalFields() {
  const isSheets = document.getElementById('srcRadioSheets').checked;
  const isFile   = document.getElementById('srcRadioFile')?.checked;
  document.getElementById('srcSheetsFields').style.display  = isSheets ? '' : 'none';
  document.getElementById('srcLastfmFields').style.display  = (!isSheets && !isFile) ? '' : 'none';
  const fileEl = document.getElementById('srcFileFields');
  if (fileEl) fileEl.style.display = isFile ? '' : 'none';
  if (!isSheets && !isFile) updateLfmAuthStatus();
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
  const isFile   = document.getElementById('srcRadioFile')?.checked;
  const src = document.getElementById('srcRadioSheets').checked ? 'sheets' : (isFile ? 'file' : 'lastfm');
  localStorage.setItem('dc_source', src);
  if (src === 'file') {
    deleteFromIDB(IDB_LASTFM_KEY);
    deleteFromIDB(IDB_SHEETS_KEY);
    localStorage.removeItem('dc_sync_ts');
    localStorage.removeItem('dc_lastfm_ts');
    closeSourceModal();
    document.getElementById('srcFileInput')?.click();
    return;
  }
  if (src === 'sheets') {
    const rawInput = document.getElementById('srcSheetId').value.trim();
    const urlMatch = rawInput.match(/spreadsheets\/d\/([^\/\?#]+)/);
    const sheetId  = urlMatch ? urlMatch[1] : rawInput;
    const gidMatch = rawInput.match(/[#&?]gid=(\d+)/);
    localStorage.setItem('dc_sheet_id', sheetId);
    if (gidMatch) localStorage.setItem('dc_sheet_gid', gidMatch[1]);
    else localStorage.removeItem('dc_sheet_gid');
    localStorage.setItem('dc_sheet_tab', document.getElementById('srcSheetTab').value.trim());
    const writeUrl = document.getElementById('srcSheetWriteUrl').value.trim();
    if (writeUrl) localStorage.setItem('dc_sheet_write_url', writeUrl);
    else localStorage.removeItem('dc_sheet_write_url');
    updateScrobbleBtn();
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
  const ag = parseInt(document.getElementById('certAlbumGold').value)    || CERT_DEFAULTS.album.gold;
  const ap = parseInt(document.getElementById('certAlbumPlat').value)    || CERT_DEFAULTS.album.plat;
  const ad = parseInt(document.getElementById('certAlbumDiamond').value) || CERT_DEFAULTS.album.diamond;
  const sg = parseInt(document.getElementById('certSongGold').value)    || CERT_DEFAULTS.song.gold;
  const sp = parseInt(document.getElementById('certSongPlat').value)    || CERT_DEFAULTS.song.plat;
  const sd = parseInt(document.getElementById('certSongDiamond').value) || CERT_DEFAULTS.song.diamond;
  CERT.album.gold = ag; CERT.album.plat = ap; CERT.album.diamond = ad;
  CERT.song.gold  = sg; CERT.song.plat  = sp; CERT.song.diamond  = sd;
  localStorage.setItem('dc_cert_config', JSON.stringify({ ag, ap, ad, sg, sp, sd }));
  const newEventsLimit = parseInt(document.getElementById('eventsArtistLimitSelect').value) || 50;
  if (newEventsLimit !== eventsArtistLimit) {
    eventsArtistLimit = newEventsLimit;
    localStorage.setItem('dc_events_artist_limit', newEventsLimit);
    localStorage.removeItem(EVENTS_CACHE_KEY);
    const sel = document.getElementById('eventsLimitSelect');
    if (sel) sel.value = eventsArtistLimit;
  }
  noArtistSplit = document.getElementById('srcNoArtistSplit').checked;
  localStorage.setItem('dc_no_artist_split', noArtistSplit ? '1' : '0');
  chartAnimEnabled = document.getElementById('srcChartAnim').checked;
  localStorage.setItem('dc_chart_anim', chartAnimEnabled ? '1' : '0');
  closeSourceModal();
  if (typeof dcSaveUserConfig === 'function') dcSaveUserConfig();
  syncNow();
}

document.getElementById('syncNowBtn').addEventListener('click', syncNow);

// ─── LANDING / ONBOARDING ──────────────────────────────────────
function needsOnboarding() {
  if (!localStorage.getItem('dc_source')) return true;
  const src = getDataSource();
  if (src === 'sheets' && !localStorage.getItem('dc_sheet_id')) return true;
  if (src === 'lastfm' && !getLastFmUser()) return true;
  return false;
}

let _landingSrc = null;

function selectLandingSource(src) {
  _landingSrc = src;
  document.querySelectorAll('.landing-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.landing-card-config').forEach(c => { c.style.display = 'none'; });
  const card = document.getElementById('landingCard' + src.charAt(0).toUpperCase() + src.slice(1));
  if (card) card.classList.add('active');
  const cfg = document.getElementById('landingConfig' + src.charAt(0).toUpperCase() + src.slice(1));
  if (cfg) cfg.style.display = 'flex';
  document.getElementById('landingCta').style.display = 'flex';
}

function startFromLanding() {
  const src = _landingSrc;
  if (!src) return;
  if (src === 'sheets') {
    const rawId = document.getElementById('landingSheetId').value.trim();
    if (!rawId) {
      document.getElementById('landingSheetId').focus();
      document.getElementById('landingSheetId').classList.add('landing-input-error');
      return;
    }
    document.getElementById('landingSheetId').classList.remove('landing-input-error');
    const tab = document.getElementById('landingSheetTab').value.trim() || DEFAULT_SHEET_TAB;
    localStorage.setItem('dc_source', 'sheets');
    localStorage.setItem('dc_sheet_id', rawId);
    localStorage.setItem('dc_sheet_tab', tab);
  } else if (src === 'lastfm') {
    const user = document.getElementById('landingLastfmUser').value.trim();
    if (!user) {
      document.getElementById('landingLastfmUser').focus();
      document.getElementById('landingLastfmUser').classList.add('landing-input-error');
      return;
    }
    document.getElementById('landingLastfmUser').classList.remove('landing-input-error');
    localStorage.setItem('dc_source', 'lastfm');
    localStorage.setItem('dc_lastfm_user', user);
  } else if (src === 'file') {
    localStorage.setItem('dc_source', 'file');
  }
  document.getElementById('landingScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
  showSkeleton();
  updateMastheadDynamic();
  if (typeof dcSaveUserConfig === 'function') dcSaveUserConfig();
  if (src === 'sheets') syncFromSheets();
  else if (src === 'lastfm') syncFromLastFm();
  else {
    document.getElementById('uploadZone').style.display = 'block';
  }
}

function skipLanding() {
  document.getElementById('landingScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
  showSkeleton();
  syncNow();
}

// Auto-sync on page load — use cached data if synced within the last hour
window.addEventListener('load', async () => {
  updateMastheadDynamic();
  updateLfmAuthStatus();
  localStorage.removeItem('dc_sync_csv'); // clean up old oversized key if present

  if (needsOnboarding()) {
    document.getElementById('landingScreen').style.display = 'flex';
    return;
  }

  document.getElementById('mainApp').style.display = 'block';
  showSkeleton();
  await initRulesCache();
  await loadRulesFromSheet();

  if (!localStorage.getItem('dc_display_name')) {
    const btn = document.getElementById('configureSourceBtn');
    btn.classList.add('configure-attention');
    btn.title = 'Start here — configure your data source';
  }

  const src = getDataSource();
  if (src === 'lastfm') {
    syncFromLastFm();
    return;
  }
  if (src === 'file') {
    const cached = await loadFromIDB(IDB_FILE_KEY);
    if (cached && cached.data) {
      allPlays = applyAutocorrectRules(cached.data.map(([title, artist, album, uts]) => {
        const ar = artist || '';
        return { title, artist: ar, artists: splitArtists(ar), album: album || '—', date: new Date(uts * 1000) };
      }));
      allPlays.sort((a, b) => b.date - a.date);
      setSyncStatus(`✓ ${allPlays.length.toLocaleString()} plays loaded from file`, 'ok');
      finalizeLoad();
    } else {
      setSyncStatus('No file loaded — click ⚙ Configure to upload a file.', 'err');
    }
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
    if (!dt || dt.getFullYear() < 2000) {
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
      date: dt,
      _sheetRow: i + 1,
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

  if (fromSheets) {
    const writeUrl = getSheetWriteUrl();
    if (writeUrl) autoCorrectEntries(allPlays, writeUrl);
  }

  allPlays = applyAutocorrectRules(allPlays);
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

  renderHeroStats();
  renderStreakBanner();
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
      const h  = str.length > 10 ? +(str.slice(11, 13)) || 0 : 0;
      const mi = str.length > 13 ? +(str.slice(14, 16)) || 0 : 0;
      const s  = str.length > 16 ? +(str.slice(17, 19)) || 0 : 0;
      const dt = new Date(y, mo, d, h, mi, s);
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
  if (typeof dcSaveUserConfig === 'function') dcSaveUserConfig();
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
  if (typeof dcSaveUserConfig === 'function') dcSaveUserConfig();
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
  if (typeof dcSaveUserConfig === 'function') dcSaveUserConfig();
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
  if (typeof dcSaveUserConfig === 'function') dcSaveUserConfig();
  ['songs', 'artists', 'albums'].forEach(t => { searchState[t] = ''; const inp = document.getElementById(t + 'SearchInput'); if (inp) inp.value = ''; pageState[t] = 0; });
  renderAll();
});

// ─── NAVIGATE TO RECORD PERIOD ────────────────────────────────
function navigateToRecPeriod(period, periodKey) {
  document.getElementById('artistModal')?.classList.remove('open');
  document.getElementById('albumModal')?.classList.remove('open');
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
  } else if (period === 'year') {
    offset = now.getFullYear() - parseInt(periodKey, 10);
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
      (['upcomingSection', 'recentSection']).forEach(id => {
        const el = document.getElementById(id);
        el.style.display = '';
        const savedCollapsed = localStorage.getItem('dc_section_collapsed_' + id) === '1';
        el.classList.toggle('collapsed', savedCollapsed);
        const colBtn = el.querySelector('.section-collapse-btn');
        if (colBtn) colBtn.textContent = savedCollapsed ? '+' : '−';
      });
      if (currentPeriod === 'graphs') destroyGraphCharts();
    }
    currentPeriod = period;
    updateScrobbleBtn();
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
  const newCountPerPeriod = {
    week: { songs: {}, artists: {}, albums: {} },
    month: { songs: {}, artists: {}, albums: {} },
    year: { songs: {}, artists: {}, albums: {} }
  };
  const newSongDebutsByArtist = { week: {}, month: {}, year: {} };
  const newSongsByArtistPerPeriod = { week: {}, month: {}, year: {} };
  const artistNewDebutPeriods = { week: {}, month: {}, year: {} };
  const song1stNo1Period = { week: {}, month: {}, year: {} };
  const albumNewTrackCount = { week: {}, month: {}, year: {} };
  const rawNewCountPerPeriod = {
    week: { songs: {}, artists: {}, albums: {} },
    month: { songs: {}, artists: {}, albums: {} },
    year: { songs: {}, artists: {}, albums: {} }
  };

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
      for (const [k, d] of Object.entries(sc)) { d.chartStatus = prevSong[k] ? 0 : everSong.has(k) ? 1 : 2; d.prevRank = prevSong[k] || Infinity; }
      for (const [k, d] of Object.entries(ac)) { d.chartStatus = prevArtist[k] ? 0 : everArtist.has(k) ? 1 : 2; d.prevRank = prevArtist[k] || Infinity; }
      for (const [k, d] of Object.entries(lc)) { d.chartStatus = prevAlbum[k] ? 0 : everAlbum.has(k) ? 1 : 2; d.prevRank = prevAlbum[k] || Infinity; }
      const topSongs = Object.entries(sc).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, size);
      const topArtists = Object.entries(ac).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, size);
      const topAlbums = Object.entries(lc).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, size);
      const nPS = {}, nPA = {}, nPL = {};
      const newSongKeysThisPeriod = new Set();
      topSongs.forEach(([k, d], i) => {
        nPS[k] = i + 1;
        if (!everSong.has(k)) {
          songDebuts[pt][k] = { rank: i + 1, period: pk, title: d.title, artist: d.artist, plays: d.count };
          newSongKeysThisPeriod.add(k);
          newCountPerPeriod[pt].songs[pk] = (newCountPerPeriod[pt].songs[pk] || 0) + 1;
          newSongDebutsByArtist[pt][d.artist] = (newSongDebutsByArtist[pt][d.artist] || 0) + 1;
          if (!newSongsByArtistPerPeriod[pt][pk]) newSongsByArtistPerPeriod[pt][pk] = {};
          newSongsByArtistPerPeriod[pt][pk][d.artist] = (newSongsByArtistPerPeriod[pt][pk][d.artist] || 0) + 1;
          if (!artistNewDebutPeriods[pt][d.artist]) artistNewDebutPeriods[pt][d.artist] = [];
          artistNewDebutPeriods[pt][d.artist].push(pk);
        }
        everSong.add(k);
        if (i === 0) { if (!song1s[pt][k]) song1s[pt][k] = { title: d.title, artist: d.artist, album: d.album, count: 0, firstPeriod: pk, periods: [] }; song1s[pt][k].count++; song1s[pt][k].lastPeriod = pk; song1s[pt][k].periods.push(pk); if (!song1stNo1Period[pt][k]) song1stNo1Period[pt][k] = pk; }
        songApps[pt][k] = (songApps[pt][k] || 0) + 1;
        if (!songPP[pt][k] || d.count > songPP[pt][k].count) songPP[pt][k] = { count: d.count, period: pk, title: d.title, artist: d.artist };
      });
      topArtists.forEach(([a, d], i) => {
        nPA[a] = i + 1;
        if (!everArtist.has(a)) {
          artistDebuts[pt][a] = { rank: i + 1, period: pk, plays: d.count };
          newCountPerPeriod[pt].artists[pk] = (newCountPerPeriod[pt].artists[pk] || 0) + 1;
        }
        everArtist.add(a);
        if (i === 0) { if (!artist1s[pt][a]) artist1s[pt][a] = { count: 0, firstPeriod: pk, periods: [] }; artist1s[pt][a].count++; artist1s[pt][a].lastPeriod = pk; artist1s[pt][a].periods.push(pk); }
        artistApps[pt][a] = (artistApps[pt][a] || 0) + 1;
        if (!artistPP[pt][a] || d.count > artistPP[pt][a].count) artistPP[pt][a] = { count: d.count, period: pk };
      });
      topAlbums.forEach(([ak, d], i) => {
        nPL[ak] = i + 1;
        if (!everAlbum.has(ak)) {
          albumDebuts[pt][ak] = { rank: i + 1, period: pk, album: d.album, artist: d.artist, plays: d.count };
          newCountPerPeriod[pt].albums[pk] = (newCountPerPeriod[pt].albums[pk] || 0) + 1;
          let newTrackCt = 0;
          for (const sk of newSongKeysThisPeriod) { const sd = sc[sk]; if (sd && sd.album === d.album && albumArtist(sd) === d.artist) newTrackCt++; }
          albumNewTrackCount[pt][ak] = newTrackCt;
        }
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

  // ── New Charts Records: compute from actual New Songs/Artists/Albums charts ──
  // Uses first-ever play per item, matching the renderNewEntries logic.
  const ncSongDebuts = { week: {}, month: {}, year: {} };
  const ncArtistDebuts = { week: {}, month: {}, year: {} };
  const ncAlbumDebuts = { week: {}, month: {}, year: {} };
  const ncNewSongDebutsByArtist = { week: {}, month: {}, year: {} };
  const ncNewSongsByArtistPerPeriod = { week: {}, month: {}, year: {} };
  const ncArtistNewDebutPeriods = { week: {}, month: {}, year: {} };
  const ncAlbumNewTrackCount = { week: {}, month: {}, year: {} };
  {
    const sfp = { week: {}, month: {}, year: {} };
    const afp = { week: {}, month: {}, year: {} };
    const lfp = { week: {}, month: {}, year: {} };
    for (const p of chron) {
      const wk = playWeekKey(p.date);
      const _td = tzDate(p.date);
      const mk = _td.getFullYear() + '-' + String(_td.getMonth() + 1).padStart(2, '0');
      const yk = String(_td.getFullYear());
      const sk = songKey(p);
      if (!sfp.week[sk]) sfp.week[sk] = { period: wk, title: p.title, artist: p.artist, album: p.album, artists_: p.artists };
      if (!sfp.month[sk]) sfp.month[sk] = { period: mk, title: p.title, artist: p.artist, album: p.album, artists_: p.artists };
      if (!sfp.year[sk]) sfp.year[sk] = { period: yk, title: p.title, artist: p.artist, album: p.album, artists_: p.artists };
      for (const artist of p.artists) {
        if (!afp.week[artist]) afp.week[artist] = wk;
        if (!afp.month[artist]) afp.month[artist] = mk;
        if (!afp.year[artist]) afp.year[artist] = yk;
      }
      if (p.album && p.album !== '—') {
        const ak = p.album + '|||' + albumArtist(p);
        if (!lfp.week[ak]) lfp.week[ak] = { period: wk, album: p.album, artist: albumArtist(p) };
        if (!lfp.month[ak]) lfp.month[ak] = { period: mk, album: p.album, artist: albumArtist(p) };
        if (!lfp.year[ak]) lfp.year[ak] = { period: yk, album: p.album, artist: albumArtist(p) };
      }
    }
    for (const [pt, playsMap, keys] of [['week', weekPlaysMap, weekKeys], ['month', monthPlaysMap, monthKeys], ['year', yearPlaysMap, yearKeys]]) {
      const sbyp = {};
      for (const [sk, info] of Object.entries(sfp[pt])) {
        const pk = info.period;
        if (!sbyp[pk]) sbyp[pk] = {};
        sbyp[pk][sk] = { title: info.title, artist: info.artist, album: info.album, artists_: info.artists_, plays: 0 };
      }
      for (const pk of keys) {
        const ns = sbyp[pk]; if (!ns) continue;
        for (const p of playsMap[pk]) { const sk = songKey(p); if (ns[sk]) ns[sk].plays++; }
      }
      for (const pk of keys) {
        const ns = sbyp[pk]; if (!ns) continue;
        Object.entries(ns).sort((a, b) => b[1].plays - a[1].plays).forEach(([sk, d], i) => {
          ncSongDebuts[pt][sk] = { rank: i + 1, period: pk, title: d.title, artist: d.artist, plays: d.plays };
          ncNewSongDebutsByArtist[pt][d.artist] = (ncNewSongDebutsByArtist[pt][d.artist] || 0) + 1;
          if (!ncNewSongsByArtistPerPeriod[pt][pk]) ncNewSongsByArtistPerPeriod[pt][pk] = {};
          ncNewSongsByArtistPerPeriod[pt][pk][d.artist] = (ncNewSongsByArtistPerPeriod[pt][pk][d.artist] || 0) + 1;
          if (!ncArtistNewDebutPeriods[pt][d.artist]) ncArtistNewDebutPeriods[pt][d.artist] = [];
          ncArtistNewDebutPeriods[pt][d.artist].push(pk);
        });
      }
      const abyp = {};
      for (const [artist, pk] of Object.entries(afp[pt])) {
        if (!abyp[pk]) abyp[pk] = {};
        abyp[pk][artist] = 0;
      }
      for (const pk of keys) {
        const na = abyp[pk]; if (!na) continue;
        for (const p of playsMap[pk]) { for (const a of p.artists) { if (na[a] !== undefined) na[a]++; } }
      }
      for (const pk of keys) {
        const na = abyp[pk]; if (!na) continue;
        Object.entries(na).sort((a, b) => b[1] - a[1]).forEach(([artist, plays], i) => {
          ncArtistDebuts[pt][artist] = { rank: i + 1, period: pk, plays };
        });
      }
      const lbyp = {};
      for (const [ak, info] of Object.entries(lfp[pt])) {
        const pk = info.period;
        if (!lbyp[pk]) lbyp[pk] = {};
        lbyp[pk][ak] = { album: info.album, artist: info.artist, plays: 0 };
      }
      for (const pk of keys) {
        const nl = lbyp[pk]; if (!nl) continue;
        for (const p of playsMap[pk]) {
          if (!p.album || p.album === '—') continue;
          const ak = p.album + '|||' + albumArtist(p);
          if (nl[ak]) nl[ak].plays++;
        }
      }
      for (const pk of keys) {
        const nl = lbyp[pk]; if (!nl) continue;
        const ns = sbyp[pk] || {};
        Object.entries(nl).sort((a, b) => b[1].plays - a[1].plays).forEach(([ak, d], i) => {
          ncAlbumDebuts[pt][ak] = { rank: i + 1, period: pk, album: d.album, artist: d.artist, plays: d.plays };
          let nTracks = 0;
          for (const [, sd] of Object.entries(ns)) { if (sd.album === d.album && (sd.artists_[0] || sd.artist) === d.artist) nTracks++; }
          ncAlbumNewTrackCount[pt][ak] = nTracks;
        });
      }
    }
  }

  // ── Build ncPeriodMap for tooltip use (inverted by period) ───
  ncPeriodMap = { week: {}, month: {}, year: {} };
  for (const pt of ['week', 'month', 'year']) {
    for (const [sk, d] of Object.entries(ncSongDebuts[pt])) {
      if (!ncPeriodMap[pt][d.period]) ncPeriodMap[pt][d.period] = { songs: [], artists: [], albums: [] };
      ncPeriodMap[pt][d.period].songs.push({ rank: d.rank, title: d.title, artist: d.artist });
    }
    for (const [artist, d] of Object.entries(ncArtistDebuts[pt])) {
      if (!ncPeriodMap[pt][d.period]) ncPeriodMap[pt][d.period] = { songs: [], artists: [], albums: [] };
      ncPeriodMap[pt][d.period].artists.push({ rank: d.rank, name: artist });
    }
    for (const [ak, d] of Object.entries(ncAlbumDebuts[pt])) {
      if (!ncPeriodMap[pt][d.period]) ncPeriodMap[pt][d.period] = { songs: [], artists: [], albums: [] };
      ncPeriodMap[pt][d.period].albums.push({ rank: d.rank, album: d.album, artist: d.artist });
    }
    for (const pm of Object.values(ncPeriodMap[pt])) {
      pm.songs.sort((a, b) => a.rank - b.rank);
      pm.artists.sort((a, b) => a.rank - b.rank);
      pm.albums.sort((a, b) => a.rank - b.rank);
    }
  }

  // ── New Charts Records: post-processing ──────────────────────
  // Record 8: Longest consecutive periods where artist had a new debut
  const artistConsecNewDebuts = { week: {}, month: {} };
  for (const [pt, ptKeys] of [['week', weekKeys], ['month', monthKeys]]) {
    const pidx = {};
    ptKeys.forEach((k, i) => { pidx[k] = i; });
    for (const [artist, periods] of Object.entries(ncArtistNewDebutPeriods[pt])) {
      const uniq = [...new Set(periods)].sort();
      let max = 1, cur = 1;
      for (let i = 1; i < uniq.length; i++) {
        const pi = pidx[uniq[i - 1]], ci = pidx[uniq[i]];
        if (pi !== undefined && ci !== undefined && ci === pi + 1) { if (++cur > max) max = cur; } else cur = 1;
      }
      artistConsecNewDebuts[pt][artist] = max;
    }
  }
  // Record 9: New Song → #1 fastest (fewest periods from debut on New Songs chart to first main-chart #1)
  const songNewTo1 = { week: {}, month: {} };
  for (const [pt, ptKeys] of [['week', weekKeys], ['month', monthKeys]]) {
    const pidx = {};
    ptKeys.forEach((k, i) => { pidx[k] = i; });
    for (const [sk, deb] of Object.entries(ncSongDebuts[pt])) {
      if (!song1stNo1Period[pt][sk]) continue;
      const di = pidx[deb.period], n1i = pidx[song1stNo1Period[pt][sk]];
      if (di === undefined || n1i === undefined) continue;
      songNewTo1[pt][sk] = { periods: n1i - di, debutPeriod: deb.period, no1Period: song1stNo1Period[pt][sk], debutPlays: deb.plays, title: deb.title, artist: deb.artist };
    }
  }

  // Records 4 & 5: Raw new discovery counts — all unique first appearances,
  // not limited by chart size
  for (const [pt, playsMap, keys] of [['week', weekPlaysMap, weekKeys], ['month', monthPlaysMap, monthKeys], ['year', yearPlaysMap, yearKeys]]) {
    const everS = new Set(), everA = new Set(), everL = new Set();
    for (const pk of keys) {
      for (const p of playsMap[pk]) {
        const sk = songKey(p);
        if (!everS.has(sk)) { everS.add(sk); rawNewCountPerPeriod[pt].songs[pk] = (rawNewCountPerPeriod[pt].songs[pk] || 0) + 1; }
        for (const a of p.artists) {
          if (!everA.has(a)) { everA.add(a); rawNewCountPerPeriod[pt].artists[pk] = (rawNewCountPerPeriod[pt].artists[pk] || 0) + 1; }
        }
        if (p.album && p.album !== '—') {
          const ak = p.album + '|||' + albumArtist(p);
          if (!everL.has(ak)) { everL.add(ak); rawNewCountPerPeriod[pt].albums[pk] = (rawNewCountPerPeriod[pt].albums[pk] || 0) + 1; }
        }
      }
    }
  }

  // Play count milestones
  const MILESTONES = [10, 25, 50, 100, 150, 200, 250, 300, 400, 500, 600, 750, 1000, 1250, 1500, 1750, 2000, 2500, 3000, 3500, 4000, 5000, 7500, 10000, 15000, 20000, 25000, 50000];
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
  const sMilRows = MILESTONES.map(function (m) {
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

  // ── Certifications Wall ───────────────────────────────────────
  const _wSongP = {}, _wAlbP = {}, _wSongCert = {}, _wAlbCert = {};
  for (const p of chron) {
    const sk = songKey(p);
    _wSongP[sk] = (_wSongP[sk] || 0) + 1;
    if (!_wSongCert[sk]) _wSongCert[sk] = {};
    for (const thresh of [CERT.song.gold, CERT.song.plat, CERT.song.diamond]) {
      if (!_wSongCert[sk][thresh] && _wSongP[sk] >= thresh) _wSongCert[sk][thresh] = p.date;
    }
    if (p.album && p.album !== '—') {
      const ak = p.album + '|||' + albumArtist(p);
      _wAlbP[ak] = (_wAlbP[ak] || 0) + 1;
      if (!_wAlbCert[ak]) _wAlbCert[ak] = {};
      for (const thresh of [CERT.album.gold, CERT.album.plat, CERT.album.diamond]) {
        if (!_wAlbCert[ak][thresh] && _wAlbP[ak] >= thresh) _wAlbCert[ak][thresh] = p.date;
      }
    }
  }
  const wallItems = [];
  for (const [sk, plays] of Object.entries(_wSongP)) {
    if (plays < CERT.song.gold) continue;
    const nm = songNames[sk] || {};
    let tier, certDate;
    if (plays >= CERT.song.diamond)     { tier = 'diamond';  certDate = _wSongCert[sk][CERT.song.diamond]; }
    else if (plays >= CERT.song.plat)   { tier = 'platinum'; certDate = _wSongCert[sk][CERT.song.plat]; }
    else                                { tier = 'gold';     certDate = _wSongCert[sk][CERT.song.gold]; }
    wallItems.push({
      title: nm.title || sk.split('|||')[0], artist: nm.artist || '',
      image: null, type: 'song', tier,
      date: certDate ? certDate.toISOString().split('T')[0] : '',
      _plays: plays, _album: nm.album || ''
    });
  }
  for (const [ak, plays] of Object.entries(_wAlbP)) {
    if (plays < CERT.album.gold) continue;
    const nm = albumNames[ak] || {};
    const album = nm.album || ak.split('|||')[0];
    const artist = nm.artist || ak.split('|||')[1] || '';
    let tier, certDate;
    if (plays >= CERT.album.diamond)    { tier = 'diamond';  certDate = _wAlbCert[ak][CERT.album.diamond]; }
    else if (plays >= CERT.album.plat)  { tier = 'platinum'; certDate = _wAlbCert[ak][CERT.album.plat]; }
    else                                { tier = 'gold';     certDate = _wAlbCert[ak][CERT.album.gold]; }
    wallItems.push({
      title: album, artist, image: null, type: 'album', tier,
      date: certDate ? certDate.toISOString().split('T')[0] : '',
      _plays: plays, _album: album
    });
  }
  const _wTierOrd = { diamond: 0, platinum: 1, gold: 2 };
  wallItems.sort((a, b) => (_wTierOrd[a.tier] - _wTierOrd[b.tier]) || (b._plays - a._plays));
  renderCertifications(wallItems);
  loadCertWallImages(wallItems);

  // ── New Charts Records ────────────────────────────────────────
  let nch = '';

  // ── 1. Biggest New Song Debut ─────────────────────────────────
  nch += '<div class="rec-section"><div class="rec-section-title">🎵 ' + t('rec_th_songs') + ' &mdash; Biggest New Chart Debut</div>';
  for (const [pt, map] of [['week', ncSongDebuts.week], ['month', ncSongDebuts.month]]) {
    const sorted = Object.entries(map).sort((a, b) => b[1].plays - a[1].plays || a[1].rank - b[1].rank || a[1].period.localeCompare(b[1].period));
    nch += '<div class="rec-section-sub">' + (pt === 'week' ? 'Weekly' : 'Monthly') + '</div>';
    nch += recTable(['#', t('rec_th_songs'), t('rec_th_artist'), t('rec_th_plays'), 'Debut Rank', pt === 'week' ? t('rec_th_week') : t('rec_th_month')],
      sorted.map((e, i) => { const d = e[1]; return '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(d.title) + '</div></td><td><div class="rec-sub">' + esc(d.artist) + '</div></td><td class="rec-count">' + (d.plays || 0) + '</td><td class="rec-count">#' + d.rank + '</td><td class="rec-meta"><a href="javascript:void(0)" class="rec-date-link" onclick="showNewChartRecPreview(\'' + pt + '\',\'' + d.period + '\',this,event)">' + fmtPeriodKey(d.period, pt) + '</a></td>'; }), lim);
  }
  nch += '</div>';

  // ── 2. Biggest New Artist Debut ────────────────────────────────
  nch += '<div class="rec-section"><div class="rec-section-title">♦ ' + t('rec_th_artists') + ' &mdash; Biggest New Chart Debut</div>';
  for (const [pt, map] of [['week', ncArtistDebuts.week], ['month', ncArtistDebuts.month]]) {
    const sorted = Object.entries(map).sort((a, b) => b[1].plays - a[1].plays || a[1].rank - b[1].rank || a[1].period.localeCompare(b[1].period));
    nch += '<div class="rec-section-sub">' + (pt === 'week' ? 'Weekly' : 'Monthly') + '</div>';
    nch += recTable(['#', t('rec_th_artist'), t('rec_th_plays'), 'Debut Rank', pt === 'week' ? t('rec_th_week') : t('rec_th_month')],
      sorted.map((e, i) => { const d = e[1]; return '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(e[0]) + '</div></td><td class="rec-count">' + (d.plays || 0) + '</td><td class="rec-count">#' + d.rank + '</td><td class="rec-meta"><a href="javascript:void(0)" class="rec-date-link" onclick="showNewChartRecPreview(\'' + pt + '\',\'' + d.period + '\',this,event)">' + fmtPeriodKey(d.period, pt) + '</a></td>'; }), lim);
  }
  nch += '</div>';

  // ── 3. Biggest New Album Debut ─────────────────────────────────
  nch += '<div class="rec-section"><div class="rec-section-title">💿 ' + t('rec_th_albums') + ' &mdash; Biggest New Chart Debut</div>';
  for (const [pt, map] of [['week', ncAlbumDebuts.week], ['month', ncAlbumDebuts.month]]) {
    const sorted = Object.entries(map).sort((a, b) => b[1].plays - a[1].plays || a[1].rank - b[1].rank || a[1].period.localeCompare(b[1].period));
    nch += '<div class="rec-section-sub">' + (pt === 'week' ? 'Weekly' : 'Monthly') + '</div>';
    nch += recTable(['#', t('rec_th_albums'), t('rec_th_artist'), t('rec_th_plays'), 'Debut Rank', pt === 'week' ? t('rec_th_week') : t('rec_th_month')],
      sorted.map((e, i) => { const d = e[1]; return '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(d.album) + '</div></td><td><div class="rec-sub">' + esc(d.artist) + '</div></td><td class="rec-count">' + (d.plays || 0) + '</td><td class="rec-count">#' + d.rank + '</td><td class="rec-meta"><a href="javascript:void(0)" class="rec-date-link" onclick="showNewChartRecPreview(\'' + pt + '\',\'' + d.period + '\',this,event)">' + fmtPeriodKey(d.period, pt) + '</a></td>'; }), lim);
  }
  nch += '</div>';

  // ── 4. Busiest New Song Discovery Period ───────────────────────
  nch += '<div class="rec-section"><div class="rec-section-title">🔢 ' + t('rec_th_songs') + ' &mdash; Busiest Discovery Period</div>';
  for (const [pt, map] of [['week', rawNewCountPerPeriod.week.songs], ['month', rawNewCountPerPeriod.month.songs]]) {
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    nch += '<div class="rec-section-sub">' + (pt === 'week' ? 'Weekly' : 'Monthly') + '</div>';
    nch += recTable(['#', pt === 'week' ? t('rec_th_week') : t('rec_th_month'), 'New Songs'],
      sorted.map((e, i) => '<td class="rec-rank">' + (i + 1) + '</td><td class="rec-meta"><a href="javascript:void(0)" class="rec-date-link" onclick="showNewChartRecPreview(\'' + pt + '\',\'' + e[0] + '\',this,event)">' + fmtPeriodKey(e[0], pt) + '</a></td><td class="rec-count">' + e[1] + '</td>'), lim);
  }
  nch += '</div>';

  // ── 5. Busiest New Artist Discovery Period ─────────────────────
  nch += '<div class="rec-section"><div class="rec-section-title">🔢 ' + t('rec_th_artists') + ' &mdash; Busiest Discovery Period</div>';
  for (const [pt, map] of [['week', rawNewCountPerPeriod.week.artists], ['month', rawNewCountPerPeriod.month.artists]]) {
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    nch += '<div class="rec-section-sub">' + (pt === 'week' ? 'Weekly' : 'Monthly') + '</div>';
    nch += recTable(['#', pt === 'week' ? t('rec_th_week') : t('rec_th_month'), 'New Artists'],
      sorted.map((e, i) => '<td class="rec-rank">' + (i + 1) + '</td><td class="rec-meta"><a href="javascript:void(0)" class="rec-date-link" onclick="showNewChartRecPreview(\'' + pt + '\',\'' + e[0] + '\',this,event)">' + fmtPeriodKey(e[0], pt) + '</a></td><td class="rec-count">' + e[1] + '</td>'), lim);
  }
  nch += '</div>';

  // ── 6. Artist with Most Songs on One New Chart ─────────────────
  nch += '<div class="rec-section"><div class="rec-section-title">🎵 Most Songs on a Single New Chart (by Artist)</div>';
  for (const [pt, map] of [['week', ncNewSongsByArtistPerPeriod.week], ['month', ncNewSongsByArtistPerPeriod.month]]) {
    const best = {};
    for (const [pk, artists] of Object.entries(map)) {
      for (const [artist, count] of Object.entries(artists)) {
        if (!best[artist] || count > best[artist].count || (count === best[artist].count && pk < best[artist].period)) best[artist] = { count, period: pk };
      }
    }
    const sorted = Object.entries(best).sort((a, b) => b[1].count - a[1].count || a[1].period.localeCompare(b[1].period));
    nch += '<div class="rec-section-sub">' + (pt === 'week' ? 'Weekly' : 'Monthly') + '</div>';
    nch += recTable(['#', t('rec_th_artist'), 'New Songs', pt === 'week' ? t('rec_th_week') : t('rec_th_month')],
      sorted.map((e, i) => '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(e[0]) + '</div></td><td class="rec-count">' + e[1].count + '</td><td class="rec-meta"><a href="javascript:void(0)" class="rec-date-link" onclick="showNewChartRecPreview(\'' + pt + '\',\'' + e[1].period + '\',this,event)">' + fmtPeriodKey(e[1].period, pt) + '</a></td>'), lim);
  }
  nch += '</div>';

  // ── 7. Most New Song Debuts All-Time by Artist ─────────────────
  nch += '<div class="rec-section"><div class="rec-section-title">📈 Most New Song Debuts (All-Time, by Artist)</div>';
  for (const [pt, map] of [['week', ncNewSongDebutsByArtist.week], ['month', ncNewSongDebutsByArtist.month]]) {
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    nch += '<div class="rec-section-sub">' + (pt === 'week' ? 'Weekly' : 'Monthly') + '</div>';
    nch += recTable(['#', t('rec_th_artist'), 'Total Debut Appearances'],
      sorted.map((e, i) => '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(e[0]) + '</div></td><td class="rec-count">' + e[1] + '</td>'), lim);
  }
  nch += '</div>';

  // ── 8. Longest Consecutive Debut Streak by Artist ─────────────
  nch += '<div class="rec-section"><div class="rec-section-title">🔁 Longest Consecutive Debut Streak (by Artist)</div>';
  for (const [pt, map] of [['week', artistConsecNewDebuts.week], ['month', artistConsecNewDebuts.month]]) {
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    nch += '<div class="rec-section-sub">' + (pt === 'week' ? 'Weekly' : 'Monthly') + '</div>';
    nch += recTable(['#', t('rec_th_artist'), 'Consecutive ' + (pt === 'week' ? 'Weeks' : 'Months')],
      sorted.map((e, i) => '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(e[0]) + '</div></td><td class="rec-count">' + e[1] + ' ' + tUnit(pt === 'week' ? 'weeks_full' : 'months', e[1]) + '</td>'), lim);
  }
  nch += '</div>';

  // ── 9. New Song → #1 Fastest ──────────────────────────────────
  nch += '<div class="rec-section"><div class="rec-section-title">⚡ New Song &rarr; #1 Fastest</div>';
  for (const [pt, map] of [['week', songNewTo1.week], ['month', songNewTo1.month]]) {
    const sorted = Object.entries(map).sort((a, b) => a[1].periods - b[1].periods || a[1].debutPeriod.localeCompare(b[1].debutPeriod) || b[1].debutPlays - a[1].debutPlays);
    nch += '<div class="rec-section-sub">' + (pt === 'week' ? 'Weekly' : 'Monthly') + '</div>';
    const colP = pt === 'week' ? 'Weeks to #1' : 'Months to #1';
    nch += recTable(['#', t('rec_th_songs'), t('rec_th_artist'), colP, 'Debut', '#1 Achieved'],
      sorted.map((e, i) => { const d = e[1]; const pStr = d.periods === 0 ? 'Debuted at #1' : d.periods + ' ' + tUnit(pt === 'week' ? 'weeks_full' : 'months', d.periods); return '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(d.title) + '</div></td><td><div class="rec-sub">' + esc(d.artist) + '</div></td><td class="rec-count">' + pStr + '</td><td class="rec-meta"><a href="javascript:void(0)" class="rec-date-link" onclick="showNewChartRecPreview(\'' + pt + '\',\'' + d.debutPeriod + '\',this,event)">' + fmtPeriodKey(d.debutPeriod, pt) + '</a></td><td class="rec-meta"><a href="javascript:void(0)" class="rec-date-link" onclick="showNewChartRecPreview(\'' + pt + '\',\'' + d.no1Period + '\',this,event)">' + fmtPeriodKey(d.no1Period, pt) + '</a></td>'; }), lim);
  }
  nch += '</div>';

  // ── 10. New Album with Most Tracks Also Debuting ───────────────
  nch += '<div class="rec-section"><div class="rec-section-title">💿 New Album with Most Tracks Also Debuting</div>';
  for (const [pt, tMap, debMap] of [['week', ncAlbumNewTrackCount.week, ncAlbumDebuts.week], ['month', ncAlbumNewTrackCount.month, ncAlbumDebuts.month]]) {
    const combined = Object.entries(tMap).filter(e => e[1] > 0).map(([ak, cnt]) => {
      const deb = debMap[ak] || {};
      return { ak, cnt, album: deb.album || ak.split('|||')[0], artist: deb.artist || '', plays: deb.plays || 0, period: deb.period || '', rank: deb.rank || 0 };
    });
    combined.sort((a, b) => b.cnt - a.cnt || b.plays - a.plays || a.period.localeCompare(b.period));
    nch += '<div class="rec-section-sub">' + (pt === 'week' ? 'Weekly' : 'Monthly') + '</div>';
    if (!combined.length) { nch += '<div class="rec-empty">' + t('rec_no_data') + '</div>'; continue; }
    nch += recTable(['#', t('rec_th_albums'), t('rec_th_artist'), 'Tracks Debuting', t('rec_th_plays'), pt === 'week' ? t('rec_th_week') : t('rec_th_month')],
      combined.map((e, i) => '<td class="rec-rank">' + (i + 1) + '</td><td><div class="rec-name">' + esc(e.album) + '</div></td><td><div class="rec-sub">' + esc(e.artist) + '</div></td><td class="rec-count">' + e.cnt + '</td><td class="rec-count">' + e.plays + '</td><td class="rec-meta"><a href="javascript:void(0)" class="rec-date-link" onclick="showNewChartRecPreview(\'' + pt + '\',\'' + e.period + '\',this,event)">' + fmtPeriodKey(e.period, pt) + '</a></td>'), lim);
  }
  nch += '</div>';

  document.getElementById('recNewChartsBody').innerHTML = nch;

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
    'recStreaksSection',
    'recNewChartsSection'
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
    'recStreaksSection',
    'recNewChartsSection'
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
  } else if (section.id === 'upcomingSection' || section.id === 'recentSection') {
    localStorage.setItem('dc_section_collapsed_' + section.id, collapsed ? '1' : '0');
  } else if (['birthdaysSection', 'anniversariesSection', 'eventsUpcomingSection', 'eventsRecentSection', 'eventsRecentBirthdaysSection', 'eventsRecentAnniversariesSection', 'nmfSection'].includes(section.id)) {
    localStorage.setItem('dc_events_section_collapsed_' + section.id, collapsed ? '1' : '0');
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
    document.getElementById('navHint').style.display = 'none';
    document.getElementById('statsStrip').style.display = 'none';
    document.getElementById('statsStrip2').style.display = 'none';
    const _s3 = document.getElementById('statsStrip3'); if (_s3) _s3.style.display = 'none';
    document.getElementById('songsSection').style.display = 'none';
    document.getElementById('artistsSection').style.display = 'none';
    document.getElementById('albumsSection').style.display = 'none';
    document.getElementById('dropoutsSection').style.display = 'none';
    NEW_ENTRY_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    document.getElementById('upcomingSection').style.display = 'none';
    document.getElementById('recentSection').style.display = 'none';
    document.getElementById('recordsView').style.display = 'none';
    document.getElementById('soundtrackView').style.display = 'none';
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
    updateScrobbleBtn();
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
    document.getElementById('navHint').style.display = 'none';
    document.getElementById('statsStrip').style.display = 'none';
    document.getElementById('statsStrip2').style.display = 'none';
    const _s3 = document.getElementById('statsStrip3'); if (_s3) _s3.style.display = 'none';
    document.getElementById('songsSection').style.display = 'none';
    document.getElementById('artistsSection').style.display = 'none';
    document.getElementById('albumsSection').style.display = 'none';
    document.getElementById('dropoutsSection').style.display = 'none';
    NEW_ENTRY_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    document.getElementById('upcomingSection').style.display = 'none';
    document.getElementById('recentSection').style.display = 'none';
    document.getElementById('recordsView').style.display = 'none';
    document.getElementById('rawDataView').style.display = 'none';
    document.getElementById('eventsView').style.display = 'none';
    document.getElementById('soundtrackView').style.display = 'none';
    document.getElementById('graphsView').style.display = 'block';
    if (allPlays.length) renderGraphs();
    updateScrobbleBtn();
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
    document.getElementById('navHint').style.display = 'none';
    document.getElementById('statsStrip').style.display = 'none';
    document.getElementById('statsStrip2').style.display = 'none';
    const _s3 = document.getElementById('statsStrip3'); if (_s3) _s3.style.display = 'none';
    document.getElementById('songsSection').style.display = 'none';
    document.getElementById('artistsSection').style.display = 'none';
    document.getElementById('albumsSection').style.display = 'none';
    document.getElementById('dropoutsSection').style.display = 'none';
    NEW_ENTRY_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    document.getElementById('upcomingSection').style.display = 'none';
    document.getElementById('recentSection').style.display = 'none';
    document.getElementById('rawDataView').style.display = 'none';
    document.getElementById('graphsView').style.display = 'none';
    document.getElementById('eventsView').style.display = 'none';
    document.getElementById('soundtrackView').style.display = 'none';
    document.getElementById('recordsView').style.display = 'block';
    initRecordsViewUI();
    restoreRecordSectionCollapseState();
    buildRecords();
    applyRecordsViewFilter(localStorage.getItem('dc_records_active_view') || 'recAllOnesSection');
    if (typeof window._refreshBackToTop === 'function') window._refreshBackToTop();
    updateScrobbleBtn();
    return;
  }

  if (btn.dataset.period === 'events') {
    savedOffsets[currentPeriod] = currentOffset;
    currentPeriod = 'events';
    localStorage.setItem('dc_period', currentPeriod);
    document.getElementById('chartSizeBar').style.display = 'none';
    document.getElementById('paginatedSizeBar').style.display = 'none';
    document.getElementById('chartDisplayToggles').style.display = 'none';
    document.getElementById('exportPlaylistBtn').style.display = 'none';
    document.getElementById('dateNav').style.display = 'none';
    document.getElementById('navHint').style.display = 'none';
    document.getElementById('statsStrip').style.display = 'none';
    document.getElementById('statsStrip2').style.display = 'none';
    const _s3 = document.getElementById('statsStrip3'); if (_s3) _s3.style.display = 'none';
    document.getElementById('songsSection').style.display = 'none';
    document.getElementById('artistsSection').style.display = 'none';
    document.getElementById('albumsSection').style.display = 'none';
    document.getElementById('dropoutsSection').style.display = 'none';
    NEW_ENTRY_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    document.getElementById('upcomingSection').style.display = 'none';
    document.getElementById('recentSection').style.display = 'none';
    document.getElementById('rawDataView').style.display = 'none';
    document.getElementById('graphsView').style.display = 'none';
    document.getElementById('recordsView').style.display = 'none';
    document.getElementById('awardsView').style.display = 'none';
    document.getElementById('soundtrackView').style.display = 'none';
    document.getElementById('eventsView').style.display = 'block';
    const sel = document.getElementById('eventsLimitSelect');
    if (sel) sel.value = eventsArtistLimit;
    _syncEventsTypeFilter();
    ['birthdaysSection', 'anniversariesSection', 'eventsUpcomingSection', 'eventsRecentSection', 'eventsRecentBirthdaysSection', 'eventsRecentAnniversariesSection', 'nmfSection'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const key = 'dc_events_section_collapsed_' + id;
      const saved = localStorage.getItem(key);
      const defaultCollapsed = ['eventsRecentBirthdaysSection', 'eventsRecentAnniversariesSection', 'nmfSection'].includes(id);
      const collapsed = saved !== null ? saved === '1' : defaultCollapsed;
      el.classList.toggle('collapsed', collapsed);
      const btn = el.querySelector('.section-collapse-btn');
      if (btn) { btn.textContent = collapsed ? '+' : '−'; btn.title = collapsed ? 'Expand' : 'Collapse'; }
    });
    if (allPlays.length) { loadEvents(); loadConcerts(); loadNMF(); }
    if (typeof window._refreshBackToTop === 'function') window._refreshBackToTop();
    updateScrobbleBtn();
    return;
  }

  if (btn.dataset.period === 'awards') {
    savedOffsets[currentPeriod] = currentOffset;
    currentPeriod = 'awards';
    localStorage.setItem('dc_period', currentPeriod);
    document.getElementById('chartSizeBar').style.display = 'none';
    document.getElementById('paginatedSizeBar').style.display = 'none';
    document.getElementById('chartDisplayToggles').style.display = 'none';
    document.getElementById('exportPlaylistBtn').style.display = 'none';
    document.getElementById('dateNav').style.display = 'none';
    document.getElementById('navHint').style.display = 'none';
    document.getElementById('statsStrip').style.display = 'none';
    document.getElementById('statsStrip2').style.display = 'none';
    const _s3aw = document.getElementById('statsStrip3'); if (_s3aw) _s3aw.style.display = 'none';
    document.getElementById('songsSection').style.display = 'none';
    document.getElementById('artistsSection').style.display = 'none';
    document.getElementById('albumsSection').style.display = 'none';
    document.getElementById('dropoutsSection').style.display = 'none';
    NEW_ENTRY_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    document.getElementById('upcomingSection').style.display = 'none';
    document.getElementById('recentSection').style.display = 'none';
    document.getElementById('rawDataView').style.display = 'none';
    document.getElementById('graphsView').style.display = 'none';
    document.getElementById('recordsView').style.display = 'none';
    document.getElementById('eventsView').style.display = 'none';
    const _tmAw = document.getElementById('timeMachineSection'); if (_tmAw) _tmAw.style.display = 'none';
    document.getElementById('awardsView').style.display = 'block';
    awardsInit();
    if (typeof window._refreshBackToTop === 'function') window._refreshBackToTop();
    updateScrobbleBtn();
    return;
  }

  if (btn.dataset.period === 'soundtrack') {
    savedOffsets[currentPeriod] = currentOffset;
    currentPeriod = 'soundtrack';
    localStorage.setItem('dc_period', currentPeriod);
    document.getElementById('chartSizeBar').style.display = 'none';
    document.getElementById('paginatedSizeBar').style.display = 'none';
    document.getElementById('chartDisplayToggles').style.display = 'none';
    document.getElementById('exportPlaylistBtn').style.display = 'none';
    document.getElementById('dateNav').style.display = 'none';
    document.getElementById('navHint').style.display = 'none';
    document.getElementById('statsStrip').style.display = 'none';
    document.getElementById('statsStrip2').style.display = 'none';
    const _s3st = document.getElementById('statsStrip3'); if (_s3st) _s3st.style.display = 'none';
    document.getElementById('songsSection').style.display = 'none';
    document.getElementById('artistsSection').style.display = 'none';
    document.getElementById('albumsSection').style.display = 'none';
    document.getElementById('dropoutsSection').style.display = 'none';
    NEW_ENTRY_SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    document.getElementById('upcomingSection').style.display = 'none';
    document.getElementById('recentSection').style.display = 'none';
    document.getElementById('rawDataView').style.display = 'none';
    document.getElementById('graphsView').style.display = 'none';
    document.getElementById('recordsView').style.display = 'none';
    document.getElementById('eventsView').style.display = 'none';
    document.getElementById('awardsView').style.display = 'none';
    const _tmSt = document.getElementById('timeMachineSection'); if (_tmSt) _tmSt.style.display = 'none';
    document.getElementById('soundtrackView').style.display = 'block';
    renderSoundtrack();
    if (typeof window._refreshBackToTop === 'function') window._refreshBackToTop();
    updateScrobbleBtn();
    return;
  }

  // Leaving raw data, graphs, records, events, awards, or soundtrack view — restore chart UI
  if (currentPeriod === 'rawdata' || currentPeriod === 'graphs' || currentPeriod === 'records' || currentPeriod === 'events' || currentPeriod === 'awards' || currentPeriod === 'soundtrack') {
    document.getElementById('dateNav').style.display = '';
    document.getElementById('navHint').style.display = '';
    document.getElementById('statsStrip').style.display = '';
    document.getElementById('songsSection').style.display = '';
    document.getElementById('artistsSection').style.display = '';
    document.getElementById('albumsSection').style.display = '';
    (['upcomingSection', 'recentSection']).forEach(id => {
      const el = document.getElementById(id);
      el.style.display = '';
      const savedCollapsed = localStorage.getItem('dc_section_collapsed_' + id) === '1';
      el.classList.toggle('collapsed', savedCollapsed);
      const colBtn = el.querySelector('.section-collapse-btn');
      if (colBtn) colBtn.textContent = savedCollapsed ? '+' : '−';
    });
    document.getElementById('rawDataView').style.display = 'none';
    document.getElementById('graphsView').style.display = 'none';
    document.getElementById('recordsView').style.display = 'none';
    document.getElementById('eventsView').style.display = 'none';
    document.getElementById('awardsView').style.display = 'none';
    document.getElementById('soundtrackView').style.display = 'none';
    if (currentPeriod === 'graphs') destroyGraphCharts();
  }

  // Hide upcoming/recent on all-time and yearly; restore them when leaving those tabs
  if (['alltime', 'year'].includes(btn.dataset.period)) {
    ['upcomingSection', 'recentSection'].forEach(id => {
      document.getElementById(id).style.display = 'none';
    });
  } else if (['alltime', 'year'].includes(currentPeriod)) {
    ['upcomingSection', 'recentSection'].forEach(id => {
      const el = document.getElementById(id);
      el.style.display = '';
      const savedCollapsed = localStorage.getItem('dc_section_collapsed_' + id) === '1';
      el.classList.toggle('collapsed', savedCollapsed);
      const colBtn = el.querySelector('.section-collapse-btn');
      if (colBtn) colBtn.textContent = savedCollapsed ? '+' : '−';
    });
  }

  savedOffsets[(currentPeriod === 'rawdata' || currentPeriod === 'graphs' || currentPeriod === 'records' || currentPeriod === 'events' || currentPeriod === 'awards') ? btn.dataset.period : currentPeriod] = currentOffset;
  currentPeriod = btn.dataset.period;
  localStorage.setItem('dc_period', currentPeriod);
  currentOffset = savedOffsets[currentPeriod];
  restoreChartSectionCollapseState(currentPeriod);
  pageState.songs = 0; pageState.artists = 0; pageState.albums = 0;
  updateScrobbleBtn();
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
  const fCorrected = document.getElementById('rawFilterCorrected').checked;

  rawFiltered = allPlays.filter(p => {
    if (fSong && !p.title.toLowerCase().includes(fSong)) return false;
    if (fArtist && !p.artist.toLowerCase().includes(fArtist)) return false;
    if (fAlbum && !p.album.toLowerCase().includes(fAlbum)) return false;
    if (fDate && !rawFmtDate(p.date).toLowerCase().includes(fDate)) return false;
    if (fCorrected && !p._corrected) return false;
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
  const hasFilter = ['rawFilterSong', 'rawFilterArtist', 'rawFilterAlbum', 'rawFilterDate'].some(id => document.getElementById(id).value.trim())
    || document.getElementById('rawFilterCorrected').checked;
  const totalAll = allPlays.length;
  document.getElementById('rawSummary').innerHTML = hasFilter
    ? t('raw_showing', { n: `<strong>${total.toLocaleString()}</strong>`, total: totalAll.toLocaleString() })
    : t('raw_total', { n: `<strong>${totalAll.toLocaleString()}</strong>` });

  // Rows
  document.getElementById('rawBody').innerHTML = slice.map((p, i) => {
    const n = start + i + 1;
    let correctedBadge = '';
    if (p._corrected) {
      const orig = p._orig;
      const parts = [];
      if (orig.artist !== p.artist) parts.push(`Artist: ${orig.artist}`);
      if (orig.title  !== p.title)  parts.push(`Title: ${orig.title}`);
      if (orig.album  !== p.album)  parts.push(`Album: ${orig.album}`);
      correctedBadge = `<span class="raw-corrected-badge" title="Autocorrected from:\n${parts.join('\n')}">~</span>`;
    }
    return `<tr${p._corrected ? ' class="raw-corrected"' : ''}>
      <td class="raw-num">${n.toLocaleString()}${correctedBadge}</td>
      <td class="raw-date">${rawFmtDate(p.date)}</td>
      <td class="raw-title">${esc(p.title)}</td>
      <td>${esc(p.artist)}</td>
      <td class="raw-album">${esc(p.album)}</td>
      <td class="raw-edit-cell"><button class="raw-edit-btn" title="Edit" onclick="openEditScrobbleModal(${start + i})">✎</button></td>
    </tr>`;
  }).join('') || `<tr><td colspan="6" style="padding:1rem;color:var(--text3);font-style:italic;font-family:'DM Mono',monospace;font-size:0.72rem;">${t('raw_no_match')}</td></tr>`;

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
  document.getElementById('rawFilterCorrected').checked = false;
  applyRawFilters();
});

document.getElementById('rawFilterCorrected').addEventListener('change', applyRawFilters);

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

// Returns the peak new-song/artist/album counts across all periods of this type, optionally capped at cutoffKey
function buildNewEntryPeakStats(periodType, cutoffKey) {
  if (!firstSeenMaps) firstSeenMaps = buildFirstSeenMaps();
  const { songFirst, artistFirst, albumFirst } = firstSeenMaps;
  const playsMap = _buildPeriodPlaysMap(periodType, cutoffKey);
  let maxNewSongs = 0, maxNewArtists = 0, maxNewAlbums = 0;
  for (const [key, pp] of Object.entries(playsMap)) {
    let ps;
    if (periodType === 'week') { const [y, m, d] = key.split('-').map(Number); ps = new Date(y, m - 1, d); }
    else if (periodType === 'month') { const [y, m] = key.split('-').map(Number); ps = new Date(y, m - 1, 1); }
    else { ps = new Date(Number(key), 0, 1); }
    const ns = new Set(), na = new Set(), nb = new Set();
    for (const p of pp) {
      const sk = songKey(p);
      if (songFirst[sk] && songFirst[sk] >= ps) ns.add(sk);
      for (const a of p.artists) { if (artistFirst[a] && artistFirst[a] >= ps) na.add(a); }
      if (p.album && p.album !== '—') { const ak = p.album + '|||' + albumArtist(p); if (albumFirst[ak] && albumFirst[ak] >= ps) nb.add(ak); }
    }
    maxNewSongs   = Math.max(maxNewSongs,   ns.size);
    maxNewArtists = Math.max(maxNewArtists, na.size);
    maxNewAlbums  = Math.max(maxNewAlbums,  nb.size);
  }
  return { maxNewSongs, maxNewArtists, maxNewAlbums };
}

// ─── STAT STRIP HELPERS ────────────────────────────────────────

function buildSparklineValues(periodType, cutoffKey, n) {
  const playsMap = _buildPeriodPlaysMap(periodType, cutoffKey);
  const keys = Object.keys(playsMap).sort().slice(-n);
  return {
    plays:   keys.map(k => playsMap[k].length),
    songs:   keys.map(k => new Set(playsMap[k].map(p => songKey(p))).size),
    artists: keys.map(k => new Set(playsMap[k].flatMap(p => p.artists)).size),
    albums:  keys.map(k => new Set(playsMap[k].map(p => p.album).filter(a => a && a !== '—')).size),
  };
}

function sparklineSvg(vals) {
  if (!vals || vals.length < 2) return '';
  const w = 56, h = 20;
  const max = Math.max(...vals), min = Math.min(...vals);
  const rng = max - min || 1;
  const n = vals.length;
  const pts = vals.map((v, i) =>
    `${((i / (n - 1)) * w).toFixed(1)},${(h - 2 - ((v - min) / rng) * (h - 4)).toFixed(1)}`
  ).join(' ');
  const lx = w, ly = +(h - 2 - ((vals[n - 1] - min) / rng) * (h - 4)).toFixed(1);
  return `<svg class="stat-sparkline" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline points="${pts}"/><circle cx="${lx}" cy="${ly}" r="2.5"/></svg>`;
}

function animateStatStrip(containerEl) {
  const targets = [...containerEl.querySelectorAll('.stat-val[data-val]')];
  if (!targets.length) return;
  const finals = targets.map(el => parseInt(el.dataset.val, 10));
  const dur = 550;
  const t0 = performance.now();
  function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    targets.forEach((el, i) => { if (!isNaN(finals[i])) el.textContent = Math.round(ease * finals[i]).toLocaleString(); });
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function animateModalCountup(containerEl) {
  containerEl.querySelectorAll('[data-countup]').forEach(el => {
    const target = parseInt(el.dataset.countup, 10);
    if (!target) return;
    const dur = 7500;
    const t0 = performance.now();
    el.textContent = '0';
    function frame(now) {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target).toLocaleString();
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

function dcScrollTo(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el || el.style.display === 'none') return;
  if (el.classList.contains('collapsed')) {
    const btn = el.querySelector('.section-collapse-btn');
    if (btn) btn.click();
  }
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
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
    pageState.newSongs = 0; pageState.newArtists = 0; pageState.newAlbums = 0;
    return;
  }

  const periodLabel = currentPeriod === 'week' ? t('period_this_week') : currentPeriod === 'month' ? t('period_this_month') : t('period_this_year');

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
      if (!songCounts[sk]) songCounts[sk] = { title: p.title, artist: p.artist, count: 0, _albums: {}, firstAchieved: p.date };
      songCounts[sk].count++;
      songCounts[sk]._albums[p.album] = (songCounts[sk]._albums[p.album] || 0) + 1;
    }
  }
  const allNewSongs = Object.values(songCounts).map(s => { s.album = bestAlbum(s.title, s._albums); delete s._albums; return s; })
    .sort(rankSort);
  fullNewData.newSongs = isFinite(limit) ? allNewSongs.slice(0, limit) : allNewSongs;

  // New artists
  const artistCounts = {};
  for (const p of plays) {
    for (const artist of p.artists) {
      const first = artistFirst[artist];
      if (first && first >= start && first <= end) {
        if (!artistCounts[artist]) artistCounts[artist] = { name: artist, count: 0, songs: new Set(), firstAchieved: p.date };
        artistCounts[artist].count++;
        artistCounts[artist].songs.add(p.title);
      }
    }
  }
  const allNewArtists = Object.values(artistCounts).sort(rankSort);
  fullNewData.newArtists = isFinite(limit) ? allNewArtists.slice(0, limit) : allNewArtists;

  // New albums
  const albumCounts = {};
  for (const p of plays) {
    if (!p.album || p.album === '—') continue;
    const ak = p.album + '|||' + albumArtist(p);
    const first = albumFirst[ak];
    if (first && first >= start && first <= end) {
      if (!albumCounts[ak]) albumCounts[ak] = { album: p.album, artist: albumArtist(p), count: 0, tracks: new Set(), firstAchieved: p.date };
      albumCounts[ak].count++;
      albumCounts[ak].tracks.add(p.title);
    }
  }
  const allNewAlbums = Object.values(albumCounts).sort(rankSort);
  fullNewData.newAlbums = isFinite(limit) ? allNewAlbums.slice(0, limit) : allNewAlbums;

  // Reset pages on each full data rebuild
  pageState.newSongs = 0; pageState.newArtists = 0; pageState.newAlbums = 0;

  // Update section visibility and titles
  const songSec = document.getElementById('newSongsSection');
  const artistSec = document.getElementById('newArtistsSection');
  const albumSec = document.getElementById('newAlbumsSection');

  if (songSec) {
    const songShown = fullNewData.newSongs.length;
    const songTotal = allNewSongs.length;
    songSec.style.display = songShown > 0 ? '' : 'none';
    const songPrefix = songTotal > songShown ? `TOP ${songShown}` : `${songShown}`;
    const songSuffix = songTotal > songShown ? t('new_chart_suffix_f', { n: songTotal }) : '';
    document.getElementById('newSongsTitle').textContent = `✦ ${songPrefix} ${songShown !== 1 ? t('new_chart_songs') : t('new_chart_song')} ${periodLabel.toUpperCase()}${songSuffix}`;
  }
  if (artistSec) {
    const artistShown = fullNewData.newArtists.length;
    const artistTotal = allNewArtists.length;
    artistSec.style.display = artistShown > 0 ? '' : 'none';
    const artistPrefix = artistTotal > artistShown ? `TOP ${artistShown}` : `${artistShown}`;
    const artistSuffix = artistTotal > artistShown ? t('new_chart_suffix', { n: artistTotal }) : '';
    document.getElementById('newArtistsTitle').textContent = `✦ ${artistPrefix} ${artistShown !== 1 ? t('new_chart_artists') : t('new_chart_artist')} ${periodLabel.toUpperCase()}${artistSuffix}`;
  }
  if (albumSec) {
    const albumShown = fullNewData.newAlbums.length;
    const albumTotal = allNewAlbums.length;
    albumSec.style.display = albumShown > 0 ? '' : 'none';
    const albumPrefix = albumTotal > albumShown ? `TOP ${albumShown}` : `${albumShown}`;
    const albumSuffix = albumTotal > albumShown ? t('new_chart_suffix', { n: albumTotal }) : '';
    document.getElementById('newAlbumsTitle').textContent = `✦ ${albumPrefix} ${albumShown !== 1 ? t('new_chart_albums') : t('new_chart_album')} ${periodLabel.toUpperCase()}${albumSuffix}`;
  }

  renderNewPage('newSongs');
  renderNewPage('newArtists');
  renderNewPage('newAlbums');
}

function renderNewPage(type) {
  const data = fullNewData[type];
  const page = pageState[type];
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const slice = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const max = data[0]?.count || 1;

  const paginationEl = document.getElementById(type + 'Pagination');
  const labelEl = document.getElementById(type + 'PageLabel');
  if (paginationEl && labelEl) {
    if (data.length > PAGE_SIZE) {
      const start = page * PAGE_SIZE + 1;
      const end = Math.min((page + 1) * PAGE_SIZE, data.length);
      labelEl.textContent = `#${start}–#${end} of ${data.length.toLocaleString()}`;
      paginationEl.style.display = 'flex';
      const atFirst = page === 0;
      const atLast = page >= totalPages - 1;
      paginationEl.querySelector('.page-nav-first').disabled = atFirst;
      paginationEl.querySelector('.page-nav-prev').disabled = atFirst;
      paginationEl.querySelector('.page-nav-next').disabled = atLast;
      paginationEl.querySelector('.page-nav-last').disabled = atLast;
      const pageInput = document.getElementById(type + 'PageInput');
      if (pageInput) pageInput.value = page + 1;
    } else {
      paginationEl.style.display = 'none';
    }
  }

  const imgs = [];
  if (type === 'newSongs') {
    document.getElementById('newSongsBody').innerHTML = slice.map((s, i) => {
      const rank = page * PAGE_SIZE + i + 1;
      const imgId = 'nsimg-' + i;
      const prefKey = 'song:' + s.artist.toLowerCase() + '|||' + s.title.toLowerCase();
      imgs.push({ imgId, title: s.title, artist: s.artist, album: s.album, prefKey });
      return `<tr class="${rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : ''}">
      <td class="rank-cell">${rank}</td>
      <td class="thumb-cell"><div class="thumb-wrap"><div id="${imgId}"><div class="thumb-initials">${esc(initials(s.title))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="song" data-prefkey="${esc(prefKey)}" data-name="${esc(s.title)}" data-artist="${esc(s.artist)}" data-album="${esc(s.album)}">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div></td>
      <td><div class="song-title">${esc(s.title)}</div><div class="song-artist">${esc(s.artist)}</div><button class="yt-play-btn" data-title="${esc(s.title)}" data-artist="${esc(s.artist)}" data-album="${esc(s.album)}" onclick="event.stopPropagation();ytPlayFromBtn(this)" title="Play on YouTube"><span class="yt-btn-content"><svg class="yt-btn-icon" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>YouTube</span></button></td>
      <td><div class="play-count">${tCountHtml('plays', s.count)}</div><div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(s.count / max * 100)}%"></div></div></td>
    </tr>`;
    }).join('');
    loadImages(imgs.map(i => ({ ...i, name: i.title })), 'song');
  } else if (type === 'newArtists') {
    document.getElementById('newArtistsBody').innerHTML = slice.map((a, i) => {
      const rank = page * PAGE_SIZE + i + 1;
      const imgId = 'naimg-' + i;
      const prefKey = 'artist:' + a.name.toLowerCase();
      imgs.push({ imgId, name: a.name, prefKey });
      const songsJson = esc(JSON.stringify([...a.songs]));
      return `<tr class="${rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : ''} artist-row" data-artist="${esc(a.name)}">
      <td class="rank-cell">${rank}</td>
      <td class="thumb-cell"><div class="thumb-wrap"><div id="${imgId}"><div class="thumb-initials">${esc(initials(a.name))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="artist" data-prefkey="${esc(prefKey)}" data-name="${esc(a.name)}" data-artist="${esc(a.name)}" data-album="">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div></td>
      <td><div class="song-title">${esc(a.name)}</div><div class="song-artist"><span class="na-songs-trigger" data-artist="${esc(a.name)}" data-songs="${songsJson}">${tCount('songs', a.songs.size)}</span></div></td>
      <td><div class="play-count">${tCountHtml('plays', a.count)}</div><div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(a.count / max * 100)}%"></div></div></td>
    </tr>`;
    }).join('');
    loadImages(imgs, 'artist');
  } else if (type === 'newAlbums') {
    document.getElementById('newAlbumsBody').innerHTML = slice.map((a, i) => {
      const rank = page * PAGE_SIZE + i + 1;
      const imgId = 'nlimg-' + i;
      const prefKey = 'album:' + a.artist.toLowerCase() + '|||' + a.album.toLowerCase();
      imgs.push({ imgId, album: a.album, artist: a.artist, name: a.album, prefKey });
      return `<tr class="${rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : ''} album-row" data-albumkey="${esc(a.album + '|||' + a.artist)}">
      <td class="rank-cell">${rank}</td>
      <td class="thumb-cell"><div class="thumb-wrap"><div id="${imgId}"><div class="thumb-initials">${esc(initials(a.album))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="album" data-prefkey="${esc(prefKey)}" data-name="${esc(a.album)}" data-artist="${esc(a.artist)}" data-album="${esc(a.album)}">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div></td>
      <td><div class="song-title">${esc(a.album)}</div><div class="song-artist">${esc(a.artist)}</div></td>
      <td><div class="play-count">${tCountHtml('plays', a.count)}</div><div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(a.count / max * 100)}%"></div></div></td>
    </tr>`;
    }).join('');
    loadImages(imgs, 'album');
  }
}

function changeNewPage(type, dir) {
  const data = fullNewData[type];
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  pageState[type] = Math.max(0, Math.min(totalPages - 1, pageState[type] + dir));
  renderNewPage(type);
  const titleIds = { newSongs: 'newSongsTitle', newArtists: 'newArtistsTitle', newAlbums: 'newAlbumsTitle' };
  document.getElementById(titleIds[type]).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goToNewPage(type, pageNum) {
  const data = fullNewData[type];
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  pageState[type] = pageNum === Infinity ? totalPages - 1 : Math.max(0, Math.min(totalPages - 1, pageNum));
  renderNewPage(type);
  const titleIds = { newSongs: 'newSongsTitle', newArtists: 'newArtistsTitle', newAlbums: 'newAlbumsTitle' };
  document.getElementById(titleIds[type]).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goToNewPageInput(type, val) {
  const n = parseInt(val, 10);
  if (!isNaN(n) && n >= 1) goToNewPage(type, n - 1);
}

// ─── RENDER ────────────────────────────────────────────────────
const isPaginated = () => currentPeriod === 'year' || currentPeriod === 'alltime';

function renderTableHeaders() {
  const isWeeklyView = currentPeriod === 'week';
  const isMonthlyView = currentPeriod === 'month';
  const hasPeriodStats = isWeeklyView || isMonthlyView;
  const periodLabel = isWeeklyView ? t('th_weeks') : t('th_months');
  if (hasPeriodStats) {
    document.getElementById('songsHeadRow').innerHTML = `<th>${t('th_rank')}</th><th style="width:52px;"></th><th>${t('th_title_artist')}</th><th>${t('th_album')}</th><th class="m-th">${t('th_prev')}</th><th class="m-th">${periodLabel}</th><th style="text-align:right;"><span class="th-plays-full">${t('th_plays')}</span><span class="th-plays-short">${t('th_plays_mobile')}</span></th>`;
    document.getElementById('artistsHeadRow').innerHTML = `<th>${t('th_rank')}</th><th style="width:52px;"></th><th>${t('th_artist')}</th><th>${t('th_unique_songs')}</th><th class="m-th">${t('th_prev')}</th><th class="m-th">${periodLabel}</th><th style="text-align:right;"><span class="th-plays-full">${t('th_total_plays')}</span><span class="th-plays-short">${t('th_total_plays_mobile')}</span></th>`;
    document.getElementById('albumsHeadRow').innerHTML = `<th>${t('th_rank')}</th><th style="width:52px;"></th><th>${t('th_album_artist')}</th><th>${t('th_tracks')}</th><th class="m-th">${t('th_prev')}</th><th class="m-th">${periodLabel}</th><th style="text-align:right;"><span class="th-plays-full">${t('th_total_plays')}</span><span class="th-plays-short">${t('th_total_plays_mobile')}</span></th>`;
  } else {
    document.getElementById('songsHeadRow').innerHTML = `<th>${t('th_rank')}</th><th style="width:52px;"></th><th>${t('th_title_artist')}</th><th>${t('th_album')}</th><th style="text-align:right;"><span class="th-plays-full">${t('th_plays')}</span><span class="th-plays-short">${t('th_plays_mobile')}</span></th>`;
    document.getElementById('artistsHeadRow').innerHTML = `<th>${t('th_rank')}</th><th style="width:52px;"></th><th>${t('th_artist')}</th><th>${t('th_unique_songs')}</th><th style="text-align:right;"><span class="th-plays-full">${t('th_total_plays')}</span><span class="th-plays-short">${t('th_total_plays_mobile')}</span></th>`;
    document.getElementById('albumsHeadRow').innerHTML = `<th>${t('th_rank')}</th><th style="width:52px;"></th><th>${t('th_album_artist')}</th><th>${t('th_tracks')}</th><th style="text-align:right;"><span class="th-plays-full">${t('th_total_plays')}</span><span class="th-plays-short">${t('th_total_plays_mobile')}</span></th>`;
  }
}

function renderAll() {
  if (currentPeriod === 'rawdata') { applyRawFilters(); return; }
  clearImageObservers();
  ['songsBody', 'artistsBody', 'albumsBody'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el._swToken) el._swToken.cancelled = true;
    if (el && el._visObs) { el._visObs.disconnect(); delete el._visObs; }
  });
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
    ['week', 'month', 'year', 'alltime'].includes(currentPeriod) ? 'flex' : 'none';
  document.getElementById('togglePeakTagsBtn').style.display =
    (currentPeriod === 'year' || currentPeriod === 'alltime') ? 'none' : '';
  document.getElementById('togglePlaysPeakBtn').style.display =
    currentPeriod === 'alltime' ? 'none' : '';
  const _showReplay = (currentPeriod === 'week' || currentPeriod === 'month') ? '' : 'none';
  ['songsReplayBtn', 'artistsReplayBtn', 'albumsReplayBtn'].forEach(id => {
    document.getElementById(id).style.display = _showReplay;
  });
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
  pl.innerHTML = `<strong>${label}</strong><span class="period-sub">${sub}</span>`;
  const _prevDis = (currentPeriod === 'alltime');
  const _nextDis = (currentOffset === 0 || currentPeriod === 'alltime');
  document.getElementById('prevBtn').disabled = _prevDis;
  document.getElementById('nextBtn').disabled = _nextDis;
  document.querySelector('.swipe-arrow-left')?.classList.toggle('swipe-arrow-off', _nextDis);
  document.querySelector('.swipe-arrow-right')?.classList.toggle('swipe-arrow-off', _prevDis);
  syncPicker();

  // Stats — use split artists for accurate unique artist count
  const artistSet = new Set(plays.flatMap(p => p.artists));
  const songSet = new Set(plays.map(p => songKey(p)));
  const albumSet = new Set(plays.map(p => p.album).filter(a => a && a !== '—'));

  // Compute previous period plays for delta comparison
  let prevPlays = null, prevStart = null, prevEnd = null;
  if (currentPeriod !== 'alltime') {
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
  let peakStats = null, peakAtTimeStats = null, cutoffKey = null;
  if (currentPeriod !== 'alltime') {
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

  // Pre-compute extras for stat boxes
  const _showStrip2 = ['week', 'month', 'year'].includes(currentPeriod) && plays.length > 0;
  const _numDays = currentPeriod !== 'alltime' ? Math.max(1, Math.round((end - start) / 86400000) + 1) : null;
  const playsPerDay = (_numDays && _numDays > 1 && plays.length > 0) ? (plays.length / _numDays).toFixed(1) : null;
  const sparkData = cutoffKey ? buildSparklineValues(currentPeriod, cutoffKey, 8) : null;
  let discoveryRate = null;
  if (_showStrip2 && songSet.size > 0) {
    if (!firstSeenMaps) firstSeenMaps = buildFirstSeenMaps();
    const _nsr = [...songSet].filter(s => firstSeenMaps.songFirst[s] && firstSeenMaps.songFirst[s] >= start).length;
    discoveryRate = Math.round(_nsr / songSet.size * 100);
  }

  function statDelta(cur, prevVal) {
    if (prevVal === null) return '';
    const diff = cur - prevVal;
    if (diff > 0) return `<div class="stat-delta up">▲ ${diff.toLocaleString()}</div>`;
    if (diff < 0) return `<div class="stat-delta down">▼ ${Math.abs(diff).toLocaleString()}</div>`;
    return `<div class="stat-delta same">${t('stat_same')}</div>`;
  }

  function statBox(val, i18nKey, prevVal, maxAllTime, maxAtTime, opts) {
    const { scrollTo, sparkVals, extraLabel, emoji, cat } = opts || {};
    const isAllTimePeak  = maxAllTime !== null && val > 0 && val >= maxAllTime;
    const isAtTimePeak   = maxAtTime  !== null && val > 0 && val >= maxAtTime;
    const allTimeBadge   = isAllTimePeak ? `<div class="stat-peak-badge stat-peak-badge-alltime">${t('stat_alltime_peak')}</div>` : '';
    const atTimeBadge    = isAtTimePeak  ? `<div class="stat-peak-badge stat-peak-badge-attime">${t('stat_peak_at_time')}</div>` : '';
    const deltaHtml      = statDelta(val, prevVal);
    const boxClass       = isAllTimePeak ? ' stat-peak-alltime' : isAtTimePeak ? ' stat-peak-attime' : '';
    const clickAttr      = scrollTo ? ` onclick="dcScrollTo('${scrollTo}')" title="Jump to section"` : '';
    const catAttr        = cat ? ` data-cat="${cat}"` : '';
    const iconHtml       = emoji ? `<div class="stat-cat-icon">${emoji}</div>` : '';
    return `<div class="stat-box${boxClass}${scrollTo ? ' stat-clickable' : ''}"${clickAttr}${catAttr}>
      ${iconHtml}<div class="stat-val" data-val="${val}">${val.toLocaleString()}</div>
      <div class="stat-label" data-i18n="${i18nKey}">${t(i18nKey)}</div>
      ${deltaHtml}${allTimeBadge}${atTimeBadge}${extraLabel ? `<div class="stat-rate">${extraLabel}</div>` : ''}${sparklineSvg(sparkVals)}
    </div>`;
  }

  document.getElementById('statsStrip').innerHTML =
    statBox(plays.length,   'stat_total_plays',  prevPlays     ? prevPlays.length     : null, peakStats ? peakStats.maxPlays   : null, peakAtTimeStats ? peakAtTimeStats.maxPlays   : null, { scrollTo: 'songsSection',   emoji: '🎵', cat: 'plays',   extraLabel: playsPerDay ? playsPerDay + t('stat_per_day') : null }) +
    statBox(songSet.size,   'stat_unique_songs',  prevSongSet   ? prevSongSet.size     : null, peakStats ? peakStats.maxSongs   : null, peakAtTimeStats ? peakAtTimeStats.maxSongs   : null, { scrollTo: 'songsSection',   emoji: '🎶', cat: 'songs',   extraLabel: discoveryRate !== null ? discoveryRate + t('stat_pct_new') : null }) +
    statBox(artistSet.size, 'stat_artists',       prevArtistSet ? prevArtistSet.size   : null, peakStats ? peakStats.maxArtists : null, peakAtTimeStats ? peakAtTimeStats.maxArtists : null, { scrollTo: 'artistsSection', emoji: '🎤', cat: 'artists' }) +
    statBox(albumSet.size,  'stat_albums',        prevAlbumSet  ? prevAlbumSet.size    : null, peakStats ? peakStats.maxAlbums  : null, peakAtTimeStats ? peakAtTimeStats.maxAlbums  : null, { scrollTo: 'albumsSection',  emoji: '💿', cat: 'albums' });
  animateStatStrip(document.getElementById('statsStrip'));

  // Second stats strip: song of the moment + new songs/artists/albums
  const strip1El = document.getElementById('statsStrip');
  const strip2El = document.getElementById('statsStrip2');
  const showStrip2 = _showStrip2;
  if (showStrip2 && strip2El) {
    if (!firstSeenMaps) firstSeenMaps = buildFirstSeenMaps();
    const { songFirst, artistFirst, albumFirst } = firstSeenMaps;

    // New songs/artists/albums in current period (first-ever appearance)
    const newSongsCount   = [...songSet].filter(s => songFirst[s] && songFirst[s] >= start).length;
    const newArtistsCount = [...artistSet].filter(a => artistFirst[a] && artistFirst[a] >= start).length;
    const newAlbumsCount  = new Set(plays
      .filter(p => p.album && p.album !== '—')
      .map(p => p.album + '|||' + albumArtist(p))
      .filter(ak => albumFirst[ak] && albumFirst[ak] >= start)).size;

    // Previous period new counts
    let prevNewSongs = null, prevNewArtists = null, prevNewAlbums = null;
    if (prevPlays && prevStart) {
      const pSongSet     = new Set(prevPlays.map(p => songKey(p)));
      const pArtistSet   = new Set(prevPlays.flatMap(p => p.artists));
      const pAlbumKeySet = new Set(prevPlays.filter(p => p.album && p.album !== '—').map(p => p.album + '|||' + albumArtist(p)));
      prevNewSongs   = [...pSongSet].filter(s => songFirst[s] && songFirst[s] >= prevStart).length;
      prevNewArtists = [...pArtistSet].filter(a => artistFirst[a] && artistFirst[a] >= prevStart).length;
      prevNewAlbums  = [...pAlbumKeySet].filter(ak => albumFirst[ak] && albumFirst[ak] >= prevStart).length;
    }

    // All-time peak and peak-at-time for new entry counts
    const newPeakStats       = buildNewEntryPeakStats(currentPeriod, null);
    const newPeakAtTimeStats = buildNewEntryPeakStats(currentPeriod, cutoffKey);

    // Song of the moment: most played song in the 15 days ending at period end
    const sotmEnd   = end;
    const sotmStart = new Date(sotmEnd.getTime() - 15 * 24 * 60 * 60 * 1000);
    const songCounts15 = {};
    for (const p of allPlays) {
      const d = tzDate(p.date);
      if (d >= sotmStart && d <= sotmEnd) songCounts15[songKey(p)] = (songCounts15[songKey(p)] || 0) + 1;
    }
    let sotmKey = null, sotmCount = 0;
    for (const [k, c] of Object.entries(songCounts15)) {
      if (c > sotmCount) { sotmKey = k; sotmCount = c; }
    }
    const sotmTitle  = sotmKey ? sotmKey.split('|||')[0] : null;
    const sotmArtist = sotmKey ? sotmKey.split('|||')[1] : null;

    function statBox2(val, label, prevVal, maxAllTime, maxAtTime, scrollTo, meta) {
      const { emoji, cat } = meta || {};
      const isAllTimePeak = maxAllTime !== null && val > 0 && val >= maxAllTime;
      const isAtTimePeak  = maxAtTime  !== null && val > 0 && val >= maxAtTime;
      const allTimeBadge  = isAllTimePeak ? `<div class="stat-peak-badge stat-peak-badge-alltime">${t('stat_alltime_peak')}</div>` : '';
      const atTimeBadge   = isAtTimePeak  ? `<div class="stat-peak-badge stat-peak-badge-attime">${t('stat_peak_at_time')}</div>` : '';
      const boxClass      = isAllTimePeak ? ' stat-peak-alltime' : isAtTimePeak ? ' stat-peak-attime' : '';
      const clickAttr     = scrollTo ? ` onclick="dcScrollTo('${scrollTo}')" title="Jump to section"` : '';
      const catAttr       = cat ? ` data-cat="${cat}"` : '';
      const iconHtml      = emoji ? `<div class="stat-cat-icon">${emoji}</div>` : '';
      return `<div class="stat-box stat-box-sub${boxClass}${scrollTo ? ' stat-clickable' : ''}"${clickAttr}${catAttr}>
        ${iconHtml}<div class="stat-val" data-val="${val}">${val.toLocaleString()}</div>
        <div class="stat-label">${label}</div>
        ${statDelta(val, prevVal)}${allTimeBadge}${atTimeBadge}
      </div>`;
    }

    // Best day in the period being viewed
    const _dayCounts = {};
    for (const p of allPlays) {
      const pd = tzDate(p.date);
      if (pd < start || pd > end) continue;
      const dk = localDateStr(pd);
      _dayCounts[dk] = (_dayCounts[dk] || 0) + 1;
    }
    let bestDay = null, bestDayCount = 0;
    for (const [dk, cnt] of Object.entries(_dayCounts)) {
      if (cnt > bestDayCount) { bestDay = dk; bestDayCount = cnt; }
    }
    const _mos = ['month_jan','month_feb','month_mar','month_apr','month_may_short','month_jun','month_jul','month_aug','month_sep','month_oct','month_nov','month_dec'].map(k => t(k).toUpperCase());
    const _mosLong = ['month_january','month_february','month_march','month_april','month_may','month_june','month_july','month_august','month_september','month_october','month_november','month_december'].map(k => t(k).toUpperCase());
    const _dows = ['day_sunday','day_monday','day_tuesday','day_wednesday','day_thursday','day_friday','day_saturday'].map(k => t(k).toUpperCase());
    const bestDayLabel = bestDay ? (() => { const [y, m, d] = bestDay.split('-').map(Number); const dow = new Date(y, m - 1, d).getDay(); const monSpan = `<span class="bd-month-short">${_mos[m-1]}</span><span class="bd-month-long">${_mosLong[m-1]}</span>`; const datePart = currentLang === 'en' ? monSpan + ' ' + d : d + ' ' + monSpan; return _dows[dow] + ' ' + datePart; })() : null;
    const bestDayBox = bestDay
      ? `<div class="stat-box stat-box-sub stat-clickable" onclick="dcScrollTo('songsSection')" title="Jump to section" data-cat="bestday">
          <div class="stat-cat-icon">📅</div>
          <div class="stat-val" data-val="${bestDayCount}">${bestDayCount}</div>
          <div class="stat-plays-sub">${t('stat_plays_sub')}</div>
          <div class="stat-sotm-title">${bestDayLabel}</div>
          <div class="stat-label">${t('stat_best_day')}</div>
        </div>`
      : '';

    const sotmBox = sotmTitle
      ? `<div class="stat-box stat-box-sub stat-clickable" onclick="dcScrollTo('songsSection')" title="Jump to section" data-cat="sotm">
          <div id="sotm-img" class="stat-rising-thumb"><div class="thumb-initials">${esc(initials(sotmTitle))}</div></div>
          <div class="stat-sotm-title">${esc(sotmTitle)}</div>
          <div class="stat-sotm-artist">${esc(sotmArtist)}</div>
          <div class="stat-val" data-val="${sotmCount}">${sotmCount}</div>
          <div class="stat-plays-sub">${t('stat_plays_sub')}</div>
          <div class="stat-label stat-label-sotm">${t('stat_sotm')}</div>
        </div>`
      : `<div class="stat-box stat-box-sub" data-cat="sotm">
          <div class="stat-val">—</div>
          <div class="stat-label stat-label-sotm">${t('stat_sotm')}</div>
        </div>`;

    // Rising artist: most-played artist first discovered in the last 45 days from the last day of the viewed week
    let risingArtistBox = '';
    let risingArtistName = null;
    if (currentPeriod === 'week') {
      const fortyFiveDaysAgo = new Date(end.getTime() - 45 * 24 * 60 * 60 * 1000);
      // Artists first seen in the 45-day window ending on the last day of the viewed week
      const newArtists45 = new Set(
        Object.entries(artistFirst)
          .filter(([, fd]) => fd >= fortyFiveDaysAgo && fd <= end)
          .map(([a]) => a)
      );
      // Count plays in the 45-day window for each new artist, pick the most played
      const risingCounts = {};
      for (const p of allPlays) {
        const d = tzDate(p.date);
        if (d < fortyFiveDaysAgo || d > end) continue;
        for (const a of p.artists) {
          if (newArtists45.has(a)) risingCounts[a] = (risingCounts[a] || 0) + 1;
        }
      }
      let risingCount = 0;
      for (const [a, c] of Object.entries(risingCounts)) {
        if (c > risingCount) { risingArtistName = a; risingCount = c; }
      }
      if (risingArtistName) {
        risingArtistBox = `<div class="stat-box stat-box-sub stat-clickable" onclick="dcScrollTo('artistsSection')" title="Jump to section" data-cat="rising">
          <div id="rising-artist-img" class="stat-rising-thumb"><div class="thumb-initials">${esc(initials(risingArtistName))}</div></div>
          <div class="stat-sotm-title">${esc(risingArtistName)}</div>
          <div class="stat-val" data-val="${risingCount}">${risingCount}</div>
          <div class="stat-plays-sub">${t('stat_plays_sub')}</div>
          <div class="stat-label stat-label-rising">${t('stat_rising_artist')}</div>
        </div>`;
      }
    }

    // Artist of the moment: most-played artist in the last 21 days ending at period end
    const aotmStart = new Date(end.getTime() - 21 * 24 * 60 * 60 * 1000);
    const artistCounts21 = {};
    for (const p of allPlays) {
      const d = tzDate(p.date);
      if (d >= aotmStart && d <= end) {
        for (const a of p.artists) artistCounts21[a] = (artistCounts21[a] || 0) + 1;
      }
    }
    let aotmArtistName = null, aotmArtistCount = 0;
    for (const [a, c] of Object.entries(artistCounts21)) {
      if (c > aotmArtistCount) { aotmArtistName = a; aotmArtistCount = c; }
    }
    const aotmBox = aotmArtistName
      ? `<div class="stat-box stat-box-sub stat-clickable" onclick="dcScrollTo('artistsSection')" title="Jump to section" data-cat="aotm">
          <div id="aotm-img" class="stat-rising-thumb"><div class="thumb-initials">${esc(initials(aotmArtistName))}</div></div>
          <div class="stat-sotm-title">${esc(aotmArtistName)}</div>
          <div class="stat-val" data-val="${aotmArtistCount}">${aotmArtistCount}</div>
          <div class="stat-plays-sub">${t('stat_plays_sub')}</div>
          <div class="stat-label stat-label-aotm">${t('stat_aotm')}</div>
        </div>`
      : '';

    // Album of the moment: most-played album in the last 21 days ending at period end
    const albumotmStart = new Date(end.getTime() - 21 * 24 * 60 * 60 * 1000);
    const albumCounts21 = {};
    for (const p of allPlays) {
      const d = tzDate(p.date);
      if (d >= albumotmStart && d <= end && p.album && p.album !== '—') {
        const ak = p.album + '|||' + albumArtist(p);
        albumCounts21[ak] = (albumCounts21[ak] || 0) + 1;
      }
    }
    let albumotmKey = null, albumotmCount = 0;
    for (const [ak, c] of Object.entries(albumCounts21)) {
      if (c > albumotmCount) { albumotmKey = ak; albumotmCount = c; }
    }
    const albumotmTitle      = albumotmKey ? albumotmKey.split('|||')[0] : null;
    const albumotmArtistName = albumotmKey ? albumotmKey.split('|||')[1] : null;
    const albumotmBox = albumotmTitle
      ? `<div class="stat-box stat-box-sub stat-clickable" onclick="dcScrollTo('albumsSection')" title="Jump to section" data-cat="albumotm">
          <div id="albumotm-img" class="stat-rising-thumb"><div class="thumb-initials">${esc(initials(albumotmTitle))}</div></div>
          <div class="stat-sotm-title">${esc(albumotmTitle)}</div>
          <div class="stat-sotm-artist">${esc(albumotmArtistName)}</div>
          <div class="stat-val" data-val="${albumotmCount}">${albumotmCount}</div>
          <div class="stat-plays-sub">${t('stat_plays_sub')}</div>
          <div class="stat-label stat-label-albumotm">${t('stat_albumotm')}</div>
        </div>`
      : '';

    strip2El.innerHTML = bestDayBox +
      statBox2(newSongsCount,   t('stat_new_songs'),   prevNewSongs,   newPeakStats.maxNewSongs,   newPeakAtTimeStats.maxNewSongs,   'newSongsSection',   { emoji: '✨', cat: 'new-songs' }) +
      statBox2(newArtistsCount, t('stat_new_artists'), prevNewArtists, newPeakStats.maxNewArtists, newPeakAtTimeStats.maxNewArtists, 'newArtistsSection', { emoji: '⭐', cat: 'new-artists' }) +
      statBox2(newAlbumsCount,  t('stat_new_albums'),  prevNewAlbums,  newPeakStats.maxNewAlbums,  newPeakAtTimeStats.maxNewAlbums,  'newAlbumsSection',  { emoji: '🆕', cat: 'new-albums' });
    animateStatStrip(strip2El);

    const strip3El = document.getElementById('statsStrip3');
    if (strip3El) {
      const strip3Content = currentPeriod === 'week' ? sotmBox + risingArtistBox + aotmBox + albumotmBox : '';
      strip3El.innerHTML = strip3Content;
      if (strip3Content) {
        animateStatStrip(strip3El);
        strip3El.style.display = '';
      } else {
        strip3El.style.display = 'none';
      }
    }

    const sotmImgEl = document.getElementById('sotm-img');
    if (sotmImgEl && sotmTitle) {
      fetchAndInjectImage(sotmImgEl, {
        title: sotmTitle,
        name: sotmTitle,
        artist: sotmArtist || '',
        imgId: 'sotm-img',
        prefKey: 'track:' + sotmTitle.toLowerCase() + ':deezer'
      }, 'track');
    }

    const risingImgEl = document.getElementById('rising-artist-img');
    if (risingImgEl && risingArtistName) {
      fetchAndInjectImage(risingImgEl, {
        name: risingArtistName,
        imgId: 'rising-artist-img',
        prefKey: 'artist:' + risingArtistName.toLowerCase() + ':deezer'
      }, 'artist');
    }

    const aotmImgEl = document.getElementById('aotm-img');
    if (aotmImgEl && aotmArtistName) {
      fetchAndInjectImage(aotmImgEl, {
        name: aotmArtistName,
        imgId: 'aotm-img',
        prefKey: 'artist:' + aotmArtistName.toLowerCase() + ':deezer'
      }, 'artist');
    }

    const albumotmImgEl = document.getElementById('albumotm-img');
    if (albumotmImgEl && albumotmTitle) {
      fetchAndInjectImage(albumotmImgEl, {
        album: albumotmTitle,
        name: albumotmTitle,
        artist: albumotmArtistName || '',
        imgId: 'albumotm-img',
        prefKey: 'album:' + albumotmTitle.toLowerCase() + ':deezer'
      }, 'album');
    }

    strip2El.style.display = '';
    if (strip1El) strip1El.style.marginBottom = '0';
  } else if (strip2El) {
    strip2El.style.display = 'none';
    const strip3ElFallback = document.getElementById('statsStrip3');
    if (strip3ElFallback) strip3ElFallback.style.display = 'none';
    if (strip1El) strip1El.style.marginBottom = '';
  }

  renderTableHeaders();
  renderTimeMachine();

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
    _animPrevPlays = (chartAnimEnabled && prevPlays && prevPlays.length > 0 && (currentPeriod === 'week' || currentPeriod === 'month')) ? prevPlays : null;
    _animCurrentPlays = _animPrevPlays ? plays : null;
    renderSongs(plays, peaks, periodStats);
    renderArtists(plays, peaks, periodStats);
    renderAlbums(plays, peaks, periodStats);
    _animPrevPlays = null;
    _animCurrentPlays = null;
    renderDropouts(plays, periodStats);
  }
  renderNewEntries(plays, start, end);
  updateExportBtn();
  updateShareBtns();
  updateChartExportBtns();
}

// ─── TIE-BREAKING SORT ─────────────────────────────────────────
// rankSort: count → timestamp (used for all-time / yearly where no period context exists)
function rankSort(a, b) {
  if (b.count !== a.count) return b.count - a.count;
  return a.firstAchieved - b.firstAchieved;
}

// rankSortWithStatus: count → chart status → prev rank → timestamp (used for weekly / monthly renders)
// chartStatus: 0 = incumbent (was on chart last period)
//              1 = re-entry  (charted before, but not last period)
//              2 = debut     (never charted before)
function rankSortWithStatus(a, b) {
  if (b.count !== a.count) return b.count - a.count;
  if (a.chartStatus !== b.chartStatus) return a.chartStatus - b.chartStatus;
  if (a.prevRank !== b.prevRank) return a.prevRank - b.prevRank;
  return a.firstAchieved - b.firstAchieved;
}

// ─── PREV-PERIOD RANK MAP (for chart entrance animation) ───────
// Returns a map of key → 0-based rank index for the previous period's chart.
function buildPrevRankMap(prevPlays, type) {
  if (!prevPlays || prevPlays.length === 0) return {};
  const counts = {};
  if (type === 'songs') {
    for (const p of prevPlays) {
      const k = songKey(p);
      if (!counts[k]) counts[k] = { count: 0, firstAchieved: p.date };
      counts[k].count++;
    }
  } else if (type === 'artists') {
    for (const p of prevPlays) {
      for (const artist of p.artists) {
        if (!counts[artist]) counts[artist] = { count: 0, firstAchieved: p.date };
        counts[artist].count++;
      }
    }
  } else if (type === 'albums') {
    for (const p of prevPlays) {
      const k = p.album + '|||' + albumArtist(p);
      if (!counts[k]) counts[k] = { count: 0, firstAchieved: p.date };
      counts[k].count++;
    }
  }
  const map = {};
  Object.entries(counts).sort(([, a], [, b]) => rankSort(a, b)).forEach(([k], i) => { map[k] = i; });
  return map;
}

// Returns sorted array of simplified entries for the previous period (used to build the "preview" chart).
function buildPrevSortedEntries(prevPlays, type) {
  if (!prevPlays || prevPlays.length === 0) return [];
  const counts = {};
  if (type === 'songs') {
    for (const p of prevPlays) {
      const k = songKey(p);
      if (!counts[k]) counts[k] = { title: p.title, artist: p.artist, album: p.album, count: 0, firstAchieved: p.date };
      counts[k].count++;
    }
  } else if (type === 'artists') {
    for (const p of prevPlays) {
      for (const artist of p.artists) {
        if (!counts[artist]) counts[artist] = { name: artist, count: 0, firstAchieved: p.date };
        counts[artist].count++;
      }
    }
  } else if (type === 'albums') {
    for (const p of prevPlays) {
      const k = p.album + '|||' + albumArtist(p);
      if (!counts[k]) counts[k] = { album: p.album, artist: albumArtist(p), count: 0, firstAchieved: p.date };
      counts[k].count++;
    }
    return Object.values(counts).filter(a => a.album && a.album !== '—').sort(rankSort);
  }
  return Object.values(counts).sort(rankSort);
}

// Builds the simplified "previous period" tbody HTML shown before the sliding-window animation.
// Each row gets data-chartkey (for FLIP keying), sw-count, and sw-bar for live updates.
function buildPrevChartHtml(prevSorted, size, colCount, type) {
  const extraCols = colCount > 5 ? '<td></td><td></td>' : '';
  const maxPrev = prevSorted[0]?.count || 1;
  return Array.from({ length: size }, (_, i) => {
    const e = prevSorted[i];
    if (!e) return `<tr class="chart-row-prev"><td class="rank-cell">${i + 1}</td>${'<td></td>'.repeat(colCount - 1)}</tr>`;
    const barPct = Math.round(e.count / maxPrev * 100);
    const countCell = `<td><div class="play-count sw-count">${e.count}</div><div class="play-bar"><div class="play-bar-fill sw-bar" style="width:${barPct}%"></div></div></td>`;
    if (type === 'songs') {
      const key = songKey(e);
      return `<tr class="chart-row-prev" data-chartkey="${esc(key)}">
      <td class="rank-cell">${i + 1}</td>
      <td class="thumb-cell"><div class="thumb-wrap"><div id="pwsimg-${i}"><div class="thumb-initials">${esc(initials(e.title))}</div></div></div></td>
      <td><div class="song-title">${esc(e.title)}</div><div class="song-artist">${esc(e.artist)}</div></td>
      <td><div class="song-album">${esc(e.album || '—')}</div></td>
      ${extraCols}${countCell}</tr>`;
    }
    if (type === 'artists') {
      return `<tr class="chart-row-prev" data-chartkey="${esc(e.name)}">
      <td class="rank-cell">${i + 1}</td>
      <td class="thumb-cell"><div class="thumb-wrap"><div id="pwaimg-${i}"><div class="thumb-initials">${esc(initials(e.name))}</div></div></div></td>
      <td><div class="song-title">${esc(e.name)}</div></td>
      <td></td>${extraCols}${countCell}</tr>`;
    }
    if (type === 'albums') {
      const key = e.album + '|||' + e.artist;
      return `<tr class="chart-row-prev" data-chartkey="${esc(key)}">
      <td class="rank-cell">${i + 1}</td>
      <td class="thumb-cell"><div class="thumb-wrap"><div id="pwlimg-${i}"><div class="thumb-initials">${esc(initials(e.album))}</div></div></div></td>
      <td><div class="song-title">${esc(e.album)}</div><div class="song-artist">${esc(e.artist)}</div></td>
      <td></td>${extraCols}${countCell}</tr>`;
    }
    return '';
  }).join('');
}

// ─── SLIDING-WINDOW CHART MORPH ────────────────────────────────
// Computes chart counts for a sliding window that transitions from prevPlays to currPlays.
// step 0 = full prevPlays, step totalSteps = full currPlays.
// forceKeys: Set of keys to always append after the top chartSize (new entrants below the fold).
function computeWindowCountsForType(pSorted, cSorted, step, totalSteps, type, forceKeys) {
  const prevDrop = Math.round(step / totalSteps * pSorted.length);
  const currAdd  = Math.round(step / totalSteps * cSorted.length);
  const pool = pSorted.slice(prevDrop).concat(cSorted.slice(0, currAdd));
  const counts = {};
  if (type === 'songs') {
    for (const p of pool) {
      const k = songKey(p);
      if (!counts[k]) counts[k] = { key: k, count: 0 };
      counts[k].count++;
    }
  } else if (type === 'artists') {
    for (const p of pool) {
      for (const artist of p.artists) {
        if (!counts[artist]) counts[artist] = { key: artist, count: 0 };
        counts[artist].count++;
      }
    }
  } else if (type === 'albums') {
    for (const p of pool) {
      if (!p.album || p.album === '—') continue;
      const k = p.album + '|||' + albumArtist(p);
      if (!counts[k]) counts[k] = { key: k, count: 0 };
      counts[k].count++;
    }
  }
  const sorted = Object.values(counts).sort((a, b) => b.count - a.count);
  const topN = sorted.slice(0, chartSize);
  if (!forceKeys || !forceKeys.size) return topN;
  // Append forced new entrants not already in top N so they're always visible below the fold
  const topNSet = new Set(topN.map(c => c.key));
  const forced = [...forceKeys]
    .filter(k => !topNSet.has(k))
    .map(k => counts[k] || { key: k, count: 0 });
  return [...topN, ...forced];
}

// Animates tbody rows through the sliding window from prev→curr period using FLIP.
// Each frame drops the oldest prev plays and adds the oldest curr plays so counts
// change continuously and entries visibly climb/fall through positions.
// Uses a cancellation token so re-renders abort any in-progress animation on the same tbody.
function runSlideWindowAnim(tbody, type, prevPlays, currPlays, onComplete) {
  if (!prevPlays || !currPlays) { onComplete(); return; }

  const token = { cancelled: false };
  if (tbody._swToken) tbody._swToken.cancelled = true;
  tbody._swToken = token;

  // Oldest-first so oldest prev plays drop first and oldest curr plays enter first
  const pSorted = [...prevPlays].sort((a, b) => a.date - b.date);
  const cSorted = [...currPlays].sort((a, b) => a.date - b.date);

  // key → display metadata; used to build rows for new entrants
  const keyToMeta = {};
  for (const p of [...prevPlays, ...currPlays]) {
    if (type === 'songs') {
      const k = songKey(p);
      if (!keyToMeta[k]) keyToMeta[k] = { title: p.title, artist: p.artist, album: p.album };
    } else if (type === 'artists') {
      for (const a of p.artists) {
        if (!keyToMeta[a]) keyToMeta[a] = { name: a };
      }
    } else if (type === 'albums') {
      if (p.album && p.album !== '—') {
        const k = p.album + '|||' + albumArtist(p);
        if (!keyToMeta[k]) keyToMeta[k] = { album: p.album, artist: albumArtist(p) };
      }
    }
  }

  function getRowMap() {
    const m = new Map();
    for (const tr of tbody.querySelectorAll('tr[data-chartkey]')) m.set(tr.dataset.chartkey, tr);
    return m;
  }

  function getColCount() {
    const r = tbody.querySelector('tr');
    return r ? r.querySelectorAll('td').length : 5;
  }

  function buildNewRow(key, meta, colCount) {
    const extraCols = colCount > 5 ? '<td></td><td></td>' : '';
    const countCell = `<td><div class="play-count sw-count">0</div><div class="play-bar"><div class="play-bar-fill sw-bar" style="width:0%"></div></div></td>`;
    const tr = document.createElement('tr');
    tr.className = 'chart-row-prev';
    tr.dataset.chartkey = key;
    tr.style.opacity = '0';
    if (type === 'songs') {
      tr.innerHTML = `<td class="rank-cell">—</td>
        <td class="thumb-cell"><div class="thumb-wrap"><div><div class="thumb-initials">${esc(initials(meta.title))}</div></div></div></td>
        <td><div class="song-title">${esc(meta.title)}</div><div class="song-artist">${esc(meta.artist)}</div></td>
        <td><div class="song-album">${esc(meta.album || '—')}</div></td>
        ${extraCols}${countCell}`;
    } else if (type === 'artists') {
      tr.innerHTML = `<td class="rank-cell">—</td>
        <td class="thumb-cell"><div class="thumb-wrap"><div><div class="thumb-initials">${esc(initials(meta.name))}</div></div></div></td>
        <td><div class="song-title">${esc(meta.name)}</div></td>
        <td></td>${extraCols}${countCell}`;
    } else if (type === 'albums') {
      tr.innerHTML = `<td class="rank-cell">—</td>
        <td class="thumb-cell"><div class="thumb-wrap"><div><div class="thumb-initials">${esc(initials(meta.album))}</div></div></div></td>
        <td><div class="song-title">${esc(meta.album)}</div><div class="song-artist">${esc(meta.artist)}</div></td>
        <td></td>${extraCols}${countCell}`;
    }
    return tr;
  }

  if (getRowMap().size === 0) { onComplete(); return; }

  // rc is the live count map; seeded with all prev plays, mutated frame-by-frame
  const rc = {};
  function rcMutate(p, delta) {
    if (type === 'songs') {
      const k = songKey(p);
      if (!rc[k]) rc[k] = { key: k, count: 0 };
      rc[k].count += delta;
      if (rc[k].count <= 0) delete rc[k];
    } else if (type === 'artists') {
      for (const a of p.artists) {
        if (!rc[a]) rc[a] = { key: a, count: 0 };
        rc[a].count += delta;
        if (rc[a].count <= 0) delete rc[a];
      }
    } else if (type === 'albums') {
      if (!p.album || p.album === '—') return;
      const k = p.album + '|||' + albumArtist(p);
      if (!rc[k]) rc[k] = { key: k, count: 0 };
      rc[k].count += delta;
      if (rc[k].count <= 0) delete rc[k];
    }
  }
  for (const p of pSorted) rcMutate(p, 1);

  // Only show the current top-N; new entrants appear naturally when they earn a slot
  function getCurrentCounts() {
    return Object.values(rc).sort((a, b) => b.count - a.count).slice(0, chartSize);
  }

  // FRAMES scaled so the top entry changes count ~once per frame (gradual readable steps)
  const topCount = Object.values(rc).sort((a, b) => b.count - a.count)[0]?.count || 40;
  const FRAMES = Math.max(40, Math.min(150, topCount));
  const prevPerFrame = pSorted.length / FRAMES;
  const currPerFrame = cSorted.length / FRAMES;
  let prevIdx = 0;
  let currIdx = 0;

  // Speed slider — injected above the chart table, removed when animation ends
  const tableEl = tbody.closest('table');
  const sliderWrapId = 'sw-speed-' + type;
  let sliderWrap = document.getElementById(sliderWrapId);
  if (!sliderWrap && tableEl?.parentElement) {
    sliderWrap = document.createElement('div');
    sliderWrap.id = sliderWrapId;
    sliderWrap.className = 'anim-speed-bar';
    sliderWrap.innerHTML =
      `<span class="anim-speed-label">Speed</span>` +
      `<span class="anim-speed-emoji">🐢</span>` +
      `<input type="range" min="0.25" max="4" step="0.25" value="${_animSpeedFactor}" class="anim-speed-slider">` +
      `<span class="anim-speed-emoji">🐇</span>` +
      `<span class="anim-speed-val">${_animSpeedFactor}&times;</span>`;
    tableEl.parentElement.insertBefore(sliderWrap, tableEl);
    sliderWrap.querySelector('.anim-speed-slider').addEventListener('input', e => {
      _animSpeedFactor = parseFloat(e.target.value);
      const valEl = document.getElementById(sliderWrapId)?.querySelector('.anim-speed-val');
      if (valEl) valEl.textContent = _animSpeedFactor + '×';
    });
  }

  function cleanupSlider() {
    const el = document.getElementById(sliderWrapId);
    if (el) el.remove();
  }

  function doStep(frame) {
    if (token.cancelled || !tbody.isConnected) { cleanupSlider(); return; }
    if (frame > FRAMES) { cleanupSlider(); onComplete(); return; }

    // Slide the window: drop oldest prev plays, add oldest curr plays
    const nextPrevIdx = Math.round(frame * prevPerFrame);
    const nextCurrIdx = Math.round(frame * currPerFrame);
    while (prevIdx < nextPrevIdx) rcMutate(pSorted[prevIdx++], -1);
    while (currIdx < nextCurrIdx) rcMutate(cSorted[currIdx++],  1);

    const counts   = getCurrentCounts();
    const newTopSet = new Set(counts.map(c => c.key));
    const maxCount = counts[0]?.count || 1;
    const colCount = getColCount();

    // Dynamically create rows for new entrants the moment they earn a chart slot
    let rowMap = getRowMap();
    for (const c of counts) {
      if (!rowMap.has(c.key)) {
        const meta = keyToMeta[c.key];
        if (meta) tbody.appendChild(buildNewRow(c.key, meta, colCount));
      }
    }
    rowMap = getRowMap();
    if (rowMap.size === 0) { cleanupSlider(); onComplete(); return; }

    const activeRows  = counts.map(c => rowMap.get(c.key)).filter(Boolean);
    const droppedRows = [...rowMap.values()].filter(tr => !newTopSet.has(tr.dataset.chartkey));

    // Remove dropped rows from the DOM before measuring so they don't distort FLIP positions
    const droppedFrag = document.createDocumentFragment();
    for (const tr of droppedRows) droppedFrag.appendChild(tr);

    // FLIP read-1: freeze transitions, measure current positions of active rows
    const firstTops = new Map();
    for (const tr of activeRows) {
      tr.style.transition = 'none';
      tr.style.transform  = '';
      firstTops.set(tr, tr.getBoundingClientRect().top);
    }

    // DOM reorder: active rows in rank order
    for (const tr of activeRows) tbody.appendChild(tr);

    // Content update: rank number, count, bar width
    counts.forEach((c, i) => {
      const tr = rowMap.get(c.key);
      if (!tr) return;
      const rankCell = tr.querySelector('.rank-cell');
      const countEl  = tr.querySelector('.sw-count');
      const barEl    = tr.querySelector('.sw-bar');
      if (rankCell) rankCell.textContent = i + 1;
      if (countEl)  countEl.textContent  = c.count;
      if (barEl)    barEl.style.width    = Math.round(c.count / maxCount * 100) + '%';
    });

    // FLIP read-2: measure after reorder, apply inverse transforms so rows appear unmoved
    const lastTops = new Map();
    for (const [tr] of firstTops) lastTops.set(tr, tr.getBoundingClientRect().top);
    for (const [tr, first] of firstTops) {
      const dy = first - (lastTops.get(tr) ?? first);
      if (Math.abs(dy) > 0.5) tr.style.transform = `translateY(${dy}px)`;
    }

    const frameMs = Math.round(150 / _animSpeedFactor);
    const transMs = Math.round(frameMs * 0.75);

    // FLIP play: animate rows to their final positions and fade new entrants in
    requestAnimationFrame(() => {
      if (token.cancelled) return;
      requestAnimationFrame(() => {
        if (token.cancelled) return;
        for (const tr of activeRows) {
          tr.style.transition = `transform ${transMs}ms cubic-bezier(0.4,0,0.2,1), opacity ${transMs}ms ease`;
          tr.style.transform  = '';
          tr.style.opacity    = '1';
        }
        setTimeout(() => doStep(frame + 1), frameMs);
      });
    });
  }

  setTimeout(() => doStep(1), 900);
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
    const atFirst = page === 0;
    const atLast = page >= totalPages - 1;
    paginationEl.querySelector('.page-nav-first').disabled = atFirst;
    paginationEl.querySelector('.page-nav-prev').disabled = atFirst;
    paginationEl.querySelector('.page-nav-next').disabled = atLast;
    paginationEl.querySelector('.page-nav-last').disabled = atLast;
    const pageInput = document.getElementById(type + 'PageInput');
    if (pageInput) pageInput.value = page + 1;
  }

  // rank = actual position in full (unfiltered) dataset, always
  const rankMap = new Map(allData.map((item, i) => [item, i + 1]));
  const rankOf = (item) => rankMap.get(item) || 0;

  const hasCR = (currentPeriod === 'year' || currentPeriod === 'alltime');
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
          <button class="yt-play-btn" data-title="${esc(s.title)}" data-artist="${esc(s.artist)}" data-album="${esc(s.album)}" onclick="event.stopPropagation();ytPlayFromBtn(this)" title="Play on YouTube"><span class="yt-btn-content"><svg class="yt-btn-icon" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>YouTube</span></button>
        </td>
        <td><div class="song-album">${esc(s.album)}${cumAlbumPlays ? certBadge(cumAlbumPlays, 'album') : ''}</div></td>
        <td>
          <div class="play-count">${tCountHtml('plays', s.count)}</div>
          <div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(s.count / max * 100)}%"></div></div>
          ${isPlaysPeak ? playsPeakBadge() : ''}
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
          <div class="play-count">${tCountHtml('plays', a.count)}</div>
          <div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(a.count / max * 100)}%"></div></div>
          ${isArtistPlaysPeak ? playsPeakBadge() : ''}
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
        const hasCR = currentPeriod === 'alltime' || (chartRunData && !!chartRunData.result.albums[ak]);
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
          <div class="play-count">${tCountHtml('plays', a.count)}</div>
          <div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(a.count / max * 100)}%"></div></div>
          ${isAlbumPlaysPeak ? playsPeakBadge() : ''}
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
  const totalPages = Math.ceil(filteredData(type).length / PAGE_SIZE);
  pageState[type] = Math.max(0, Math.min(totalPages - 1, pageState[type] + dir));
  renderPage(type, buildPeaks());
  const titles = { songs: 'songsSectionTitle', artists: 'artistsSectionTitle', albums: 'albumsSectionTitle' };
  document.getElementById(titles[type]).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goToPage(type, pageNum) {
  const totalPages = Math.ceil(filteredData(type).length / PAGE_SIZE);
  pageState[type] = pageNum === Infinity ? totalPages - 1 : Math.max(0, Math.min(totalPages - 1, pageNum));
  renderPage(type, buildPeaks());
  const titles = { songs: 'songsSectionTitle', artists: 'artistsSectionTitle', albums: 'albumsSectionTitle' };
  document.getElementById(titles[type]).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goToPageInput(type, val) {
  const n = parseInt(val, 10);
  if (!isNaN(n) && n >= 1) goToPage(type, n - 1);
}

// ─── CHART RUN ─────────────────────────────────────────────────
// Builds per-item chart run history for the current period type.
// Weekly → history of weekly ranks; Monthly → monthly; Yearly → yearly.
// Stored in chartRunData for use by toggle expand rows.
let chartRunData = null;
let allChartRun = {};
let allChartRunIsFullHistory = false; // true only when all 3 built with offset=0
let ncPeriodMap = {}; // new-chart periodMap: { week: { periodKey: { songs, artists, albums } } }
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
  if (currentPeriod === 'year' || currentPeriod === 'alltime') {
    sectionsHtml = [
      { id: 'year', label: t('cr_yearly_label') },
      { id: 'month', label: t('cr_monthly_label') },
      { id: 'week', label: t('cr_weekly_label') },
    ].map(({ id, label }) => {
      const crData = allChartRun[id];
      const rawD = crData?.result?.[type]?.[key];
      const d = filterCrD(rawD, id, getCrRangeMode(type, key), vy, cutoffKeys);
      const bodyHtml = d ? `<div class="cr-stats">${crStats(type, key, id, null, d)}</div>${crBoxesHTML(type, key, null, d, id)}` : `<div style="font-size:0.6rem;color:var(--text3);padding:2px 0">${t('cr_no_history')}</div>`;
      return `<div class="cr-panel-section">
        <div class="cr-panel-section-header" onclick="toggleCrPanelSection(this)">
          <span class="cr-subsection-toggle">▼</span>
          <span class="cr-panel-section-title">${label}</span>
        </div>
        <div class="cr-panel-section-body">${bodyHtml}</div>
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

  const encodedType = esc(type);
  const encodedKey = esc(key);
  const heatmapHtml = `<div class="cr-subsection">
    <div class="cr-subsection-header" onclick="toggleCrSubsection(this)">
      <span class="cr-subsection-toggle">▶</span>
      <span class="cr-subsection-label">LISTENING HEATMAP</span>
    </div>
    <div class="cr-subsection-body" style="display:none;" data-crtype="${encodedType}" data-crkey="${encodedKey}" data-crkind="heatmap"></div>
  </div>`;

  const rawDataHtml = `<div class="cr-subsection">
    <div class="cr-subsection-header" onclick="toggleCrSubsection(this)">
      <span class="cr-subsection-toggle">▶</span>
      <span class="cr-subsection-label">FULL STREAMING HISTORY</span>
    </div>
    <div class="cr-subsection-body" style="display:none;" data-crtype="${encodedType}" data-crkey="${encodedKey}" data-crkind="rawdata"></div>
  </div>`;

  return headerHtml + toggleHtml + sectionsHtml + heatmapHtml + rawDataHtml;
}

function toggleCrPanelSection(headerEl) {
  const body = headerEl.nextElementSibling;
  const toggle = headerEl.querySelector('.cr-subsection-toggle');
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : '';
  toggle.textContent = isOpen ? '▶' : '▼';
}

function toggleCrSubsection(headerEl) {
  const body = headerEl.nextElementSibling;
  const toggle = headerEl.querySelector('.cr-subsection-toggle');
  const isOpen = body.style.display !== 'none';
  if (!isOpen && !body.dataset.loaded) {
    const type = body.dataset.crtype;
    const key = body.dataset.crkey;
    const kind = body.dataset.crkind;
    if (kind === 'heatmap') body.innerHTML = buildItemHeatmapHTML(type, key);
    else if (kind === 'rawdata') body.innerHTML = buildItemRawDataHTML(type, key);
    body.dataset.loaded = '1';
  }
  body.style.display = isOpen ? 'none' : '';
  toggle.textContent = isOpen ? '▶' : '▼';
}

const _crHeatmapData = new Map();

// Delegated tooltip handler for item heatmaps embedded in cr-panels
(function () {
  document.addEventListener('mouseover', e => {
    const cell = e.target.closest('.heatmap-cell.has-data');
    if (!cell) return;
    const container = cell.closest('.cr-item-heatmap');
    if (!container) return;
    const tip = document.getElementById('heatmapTooltip');
    if (!tip) return;
    const stored = _crHeatmapData.get(container.id);
    if (!stored) return;

    const dk = cell.dataset.dk;
    const dayData = stored.dayMap[dk];
    if (!dayData) return;

    const msEntry = stored.msMap[dk];
    const d = new Date(dk + 'T00:00:00');
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = d.toLocaleDateString('en-US', { month: 'long' });
    const word = dayData.count === 1 ? 'play' : 'plays';
    const bestHtml = dk === stored.bestDk ? '<div class="hm-tt-best">⭐ Best listening day for this item</div>' : '';

    let msHtml = '';
    if (msEntry && msEntry.allTime.length) {
      msHtml = '<hr class="hm-tt-rule">';
      for (const m of msEntry.allTime) {
        const icon = m.isYearFirst ? '🎆' : '🏆';
        msHtml += `<div class="hm-tt-ms-wrap">
          <div class="hm-tt-ms-label hm-tt-ms-alltime">${icon} ${esc(m.label)}</div>
          <div class="hm-tt-ms-track">${esc(m.play.title)}</div>
          <div class="hm-tt-ms-artist">${esc(m.play.artist)}</div>
        </div>`;
      }
    }

    tip.innerHTML = `<div class="hm-tt-date">${dayName} ${d.getDate()} ${esc(monthName)} ${d.getFullYear()}</div>
      <div class="hm-tt-count">${dayData.count.toLocaleString()} ${word}</div>
      ${bestHtml}${msHtml}`;
    tip.style.display = 'block';

    const rect = cell.getBoundingClientRect();
    const margin = 12;
    const tw = tip.offsetWidth || 220;
    const th = tip.offsetHeight || 120;
    let x = rect.right + margin;
    let y = rect.top - 4;
    if (x + tw > window.innerWidth - 8) x = rect.left - tw - margin;
    if (y + th > window.innerHeight - 8) y = Math.max(8, window.innerHeight - th - 8);
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  });

  document.addEventListener('mouseout', e => {
    const cell = e.target.closest('.heatmap-cell.has-data');
    if (!cell || !cell.closest('.cr-item-heatmap')) return;
    if (e.relatedTarget && e.relatedTarget.closest('.cr-item-heatmap')) return;
    const tip = document.getElementById('heatmapTooltip');
    if (tip) tip.style.display = 'none';
  });

  document.addEventListener('click', e => {
    if (e.target.closest('.heatmap-cell.has-data') || e.target.closest('.hm-pat-cell.has-data')) return;
    const tip = document.getElementById('heatmapTooltip');
    if (tip) tip.style.display = 'none';
  });
}());

function buildItemHeatmapHTML(type, key) {
  const MILESTONES = new Set([1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]);

  const itemPlays = allPlays.filter(p => {
    if (type === 'songs') return songKey(p) === key;
    if (type === 'artists') return p.artists.includes(key);
    if (type === 'albums') { const parts = key.split('|||'); return p.album === parts[0] && albumArtist(p) === parts[1]; }
    return false;
  });
  if (!itemPlays.length) return '<div style="font-size:0.6rem;color:var(--text3);padding:4px 0">No play history found.</div>';

  const chrono = [...itemPlays].sort((a, b) => a.date - b.date);

  // Build dayMap with play lists
  const dayMap = {};
  for (const p of chrono) {
    const dk = localDateStr(tzDate(p.date));
    if (!dayMap[dk]) dayMap[dk] = { count: 0, plays: [] };
    dayMap[dk].count++;
    dayMap[dk].plays.push(p);
  }

  // Build milestones — cumulative listens + first listen of each year
  const msMap = {};
  let cumCount = 0;
  const firstPlayOfYear = {};
  for (const p of chrono) {
    cumCount++;
    const dk = localDateStr(tzDate(p.date));
    const yr = tzDate(p.date).getFullYear();
    if (!firstPlayOfYear[yr]) {
      firstPlayOfYear[yr] = p;
      if (!msMap[dk]) msMap[dk] = { allTime: [] };
      msMap[dk].allTime.push({ label: `First listen of ${yr}`, play: p, isYearFirst: true });
    }
    if (MILESTONES.has(cumCount) || (type === 'songs' && cumCount % 50 === 0)) {
      if (!msMap[dk]) msMap[dk] = { allTime: [] };
      msMap[dk].allTime.push({ label: `${hmOrdinal(cumCount)} listen`, play: p });
    }
  }

  const allDayKeys = Object.keys(dayMap).sort();
  const today = localDateStr(tzNow());
  const firstDate = new Date(allDayKeys[0] + 'T00:00:00');
  const lastDate = new Date(today + 'T00:00:00');

  let maxCount = 1, bestDk = '';
  for (const [dk, d] of Object.entries(dayMap)) {
    if (d.count > maxCount) { maxCount = d.count; bestDk = dk; }
  }

  const containerId = 'crhm-' + Math.random().toString(36).slice(2, 10);
  _crHeatmapData.set(containerId, { dayMap, msMap, bestDk });

  const startDow = firstDate.getDay();
  const padStart = startDow === 0 ? 6 : startDow - 1;
  const gridStart = new Date(firstDate);
  gridStart.setDate(gridStart.getDate() - padStart);

  const yearGroups = {};
  const cur = new Date(gridStart);
  while (cur <= lastDate) {
    const thu = new Date(cur); thu.setDate(thu.getDate() + 3);
    const yr = thu.getFullYear();
    if (!yearGroups[yr]) yearGroups[yr] = [];
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dk = localDateStr(cur);
      week.push({ dk, count: dayMap[dk]?.count || 0, inRange: cur >= firstDate && cur <= lastDate });
      cur.setDate(cur.getDate() + 1);
    }
    yearGroups[yr].push(week);
  }

  let html = '';
  for (const yr of Object.keys(yearGroups).sort((a, b) => +a - +b)) {
    const weeks = yearGroups[yr];
    let monthHtml = '', lastMonth = -1;
    for (const week of weeks) {
      const month = new Date(week[0].dk + 'T00:00:00').getMonth();
      if (week[0].inRange && month !== lastMonth) {
        monthHtml += `<div class="heatmap-week-col heatmap-month-header-row" style="position:relative;"><span class="heatmap-month-label">${HM_MONTHS[month]}</span></div>`;
        lastMonth = month;
      } else monthHtml += '<div class="heatmap-week-col heatmap-month-header-row"></div>';
    }
    let cellsHtml = '';
    for (const week of weeks) {
      cellsHtml += '<div class="heatmap-week-col">';
      for (const cell of week) {
        if (!cell.inRange) { cellsHtml += '<div class="heatmap-cell" style="background:transparent;cursor:default;"></div>'; continue; }
        const bg = cell.count === 0 ? 'transparent' : hmCellColor(cell.count, maxCount);
        const cls = cell.count > 0 ? 'heatmap-cell has-data' : 'heatmap-cell';
        const dkAttr = cell.count > 0 ? ` data-dk="${cell.dk}"` : '';
        cellsHtml += `<div class="${cls}" style="background:${bg};"${dkAttr}></div>`;
      }
      cellsHtml += '</div>';
    }
    html += `<div class="heatmap-year-block">
      <div class="heatmap-year-header">${yr}</div>
      <div class="heatmap-outer">
        <div class="heatmap-dow-labels">${HM_DOW_LABELS.map(l => `<div class="heatmap-dow-label">${l}</div>`).join('')}</div>
        <div class="heatmap-inner"><div class="heatmap-grid-wrap">
          <div class="heatmap-weeks-row" style="height:16px;margin-bottom:3px;">${monthHtml}</div>
          <div class="heatmap-weeks-row">${cellsHtml}</div>
        </div></div>
      </div>
    </div>`;
  }
  const legendCells = [0, 0.2, 0.45, 0.7, 1].map(r => {
    const cnt = r === 0 ? 0 : Math.round(Math.exp(r * Math.log1p(maxCount)) - 1);
    return `<div class="heatmap-cell" style="background:${hmCellColor(cnt, maxCount)};cursor:default;"></div>`;
  }).join('');
  html += `<div class="heatmap-legend" style="margin-top:0.5rem;"><span class="heatmap-legend-label">Less</span>${legendCells}<span class="heatmap-legend-label">More</span></div>`;
  return `<div class="cr-item-heatmap" id="${containerId}">${html}</div>`;
}

let _rawDataCtr = 0;
const _rawDataPlaysCache = new Map();

function buildItemRawDataHTML(type, key) {
  const itemPlays = allPlays.filter(p => {
    if (type === 'songs') return songKey(p) === key;
    if (type === 'artists') return p.artists.includes(key);
    if (type === 'albums') { const parts = key.split('|||'); return p.album === parts[0] && albumArtist(p) === parts[1]; }
    return false;
  });
  if (!itemPlays.length) return '<div style="font-size:0.6rem;color:var(--text3);padding:4px 0">No play history found.</div>';
  const cid = 'rawdata-' + (++_rawDataCtr);
  _rawDataPlaysCache.set(cid, itemPlays);
  const initialRows = _rawDataRows(itemPlays, 'date', 'desc', '');
  return `<div id="${cid}" class="cr-rawdata-wrap" data-sort="date" data-dir="desc">
    <div class="cr-rawdata-controls">
      <input class="cr-rawdata-search" type="text" placeholder="Search…" oninput="rawDataFilter('${cid}')">
      <span class="cr-rawdata-count" id="${cid}-count">${itemPlays.length.toLocaleString()} plays</span>
    </div>
    <div style="overflow-x:auto;max-height:400px;overflow-y:auto;">
      <table class="raw-table" style="font-size:0.62rem;">
        <thead><tr>
          <th class="raw-num">#</th>
          <th data-col="date" class="sort-active" onclick="rawDataSort('${cid}','date')">Date <span class="sort-arrow">↓</span></th>
          <th data-col="title" onclick="rawDataSort('${cid}','title')">Title <span class="sort-arrow">↕</span></th>
          <th data-col="artist" onclick="rawDataSort('${cid}','artist')">Artist <span class="sort-arrow">↕</span></th>
          <th data-col="album" class="raw-album" onclick="rawDataSort('${cid}','album')">Album <span class="sort-arrow">↕</span></th>
        </tr></thead>
        <tbody id="${cid}-body">${initialRows}</tbody>
      </table>
    </div>
  </div>`;
}

function _rawDataRows(plays, sort, dir, query) {
  let list = query ? plays.filter(p => {
    const q = query.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.artist.toLowerCase().includes(q) || p.album.toLowerCase().includes(q);
  }) : plays;
  list = [...list].sort((a, b) => {
    let cmp = 0;
    if (sort === 'date') cmp = a.date - b.date;
    else if (sort === 'title') cmp = a.title.localeCompare(b.title);
    else if (sort === 'artist') cmp = a.artist.localeCompare(b.artist);
    else if (sort === 'album') cmp = a.album.localeCompare(b.album);
    return dir === 'asc' ? cmp : -cmp;
  });
  if (!list.length) return `<tr><td colspan="5" style="text-align:center;color:var(--text3);padding:8px 0;font-size:0.62rem;">No results</td></tr>`;
  return list.map((p, i) => `<tr>
    <td class="raw-num">${(i + 1).toLocaleString()}</td>
    <td class="raw-date">${rawFmtDate(p.date)}</td>
    <td class="raw-title">${esc(p.title)}</td>
    <td>${esc(p.artist)}</td>
    <td class="raw-album">${esc(p.album)}</td>
  </tr>`).join('');
}

function rawDataFilter(cid) {
  const wrap = document.getElementById(cid);
  if (!wrap) return;
  _rawDataRender(cid, wrap.dataset.sort, wrap.dataset.dir, wrap.querySelector('.cr-rawdata-search').value);
}

function rawDataSort(cid, col) {
  const wrap = document.getElementById(cid);
  if (!wrap) return;
  const newDir = wrap.dataset.sort === col ? (wrap.dataset.dir === 'asc' ? 'desc' : 'asc') : (col === 'date' ? 'desc' : 'asc');
  wrap.dataset.sort = col;
  wrap.dataset.dir = newDir;
  _rawDataRender(cid, col, newDir, wrap.querySelector('.cr-rawdata-search').value);
}

function _rawDataRender(cid, sort, dir, query) {
  const wrap = document.getElementById(cid);
  const tbody = document.getElementById(cid + '-body');
  const countEl = document.getElementById(cid + '-count');
  if (!wrap || !tbody) return;
  const plays = _rawDataPlaysCache.get(cid) || [];
  tbody.innerHTML = _rawDataRows(plays, sort, dir, query);
  const visibleCount = query
    ? plays.filter(p => { const q = query.toLowerCase(); return p.title.toLowerCase().includes(q) || p.artist.toLowerCase().includes(q) || p.album.toLowerCase().includes(q); }).length
    : plays.length;
  if (countEl) countEl.textContent = query
    ? `${visibleCount.toLocaleString()} of ${plays.length.toLocaleString()} plays`
    : `${plays.length.toLocaleString()} plays`;
  wrap.querySelectorAll('thead th[data-col]').forEach(th => {
    const active = th.dataset.col === sort;
    th.classList.toggle('sort-active', active);
    const arrow = th.querySelector('.sort-arrow');
    if (arrow) arrow.textContent = active ? (dir === 'asc' ? '↑' : '↓') : '↕';
  });
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
  const prevChartKeys = { songs: new Map(), artists: new Map(), albums: new Map() };
  const everChartedKeys = { songs: new Set(), artists: new Set(), albums: new Set() };
  for (const pk of Object.keys(periodMap).sort()) {
    const pm = periodMap[pk];
    const lbl = crPeriodLabel(period, pk);
    for (const type of ['songs', 'artists', 'albums']) {
      // Assign chartStatus to each item for this period
      for (const [k, data] of Object.entries(pm[type])) {
        const prevRk = prevChartKeys[type].get(k);
        data.chartStatus = prevRk !== undefined ? 0 : everChartedKeys[type].has(k) ? 1 : 2;
        data.prevRank = prevRk !== undefined ? prevRk : Infinity;
      }
      const sizeForPeriod = period === 'year' ? chartSizeYearly : period === 'month' ? chartSizeMonthly : chartSizeWeekly;
      const ranked = Object.entries(pm[type]).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, sizeForPeriod);
      // Update prev/ever sets for next period
      const newPrevKeys = new Map();
      ranked.forEach(([k], i) => { newPrevKeys.set(k, i + 1); everChartedKeys[type].add(k); });
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
  const d = (preD !== undefined && preD !== null) ? preD : (data?.result?.[type]?.[key]);
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
  const ranked = Object.entries(pm[type]).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, Math.min(chartSize, 30));
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

let _newChartRecPreviewCleanup = null;
function showNewChartRecPreview(pt, periodKey, triggerEl, event) {
  if (event) event.stopPropagation();
  hideNewChartRecPreview();
  const pm = ncPeriodMap[pt] && ncPeriodMap[pt][periodKey];
  const popup = document.createElement('div');
  popup.className = 'cr-preview';
  popup.id = 'newChartRecPreviewPopup';
  popup.style.position = 'fixed';
  const title = crPeriodTitle(pt, periodKey);
  const navigateLink = `<a class="cr-preview-link" href="javascript:void(0)" onclick="hideNewChartRecPreview();navigateToRecPeriod('${pt}','${periodKey}')">${t('rec_pak_week_preview_link')}</a>`;
  if (!pm) {
    popup.innerHTML = `<button class="cr-preview-close" onclick="hideNewChartRecPreview()">✕</button><div class="cr-preview-title">${esc(title)}</div><div style="padding:4px 0;font-size:0.62rem;color:var(--text3);">${navigateLink}</div>`;
  } else {
    const types = [
      { key: 'songs', icon: '🎵', label: t('rec_th_songs'), nameOf: (d) => d.title },
      { key: 'artists', icon: '♦', label: t('rec_th_artists'), nameOf: (d) => d.name },
      { key: 'albums', icon: '💿', label: t('rec_th_albums'), nameOf: (d) => d.album },
    ];
    let items = '';
    for (const { key, icon, label, nameOf } of types) {
      const ranked = (pm[key] || []).slice(0, 5);
      if (!ranked.length) continue;
      items += `<div class="cr-preview-section-label">${icon} ${label}</div>`;
      items += ranked.map((d, i) => `<div class="cr-preview-item${i === 0 ? ' highlighted' : ''}"><span class="cr-preview-rank">${i + 1}</span><span>${esc(nameOf(d))}</span></div>`).join('');
    }
    popup.innerHTML = `<button class="cr-preview-close" onclick="hideNewChartRecPreview()">✕</button><div class="cr-preview-title">${esc(title)}</div>${items}<div class="pak-preview-navlink">${navigateLink}</div>`;
  }
  document.body.appendChild(popup);
  const rect = triggerEl.getBoundingClientRect();
  const pw = 230, ph = 380;
  let top = rect.bottom + 6, left = rect.left;
  if (left + pw > window.innerWidth) left = window.innerWidth - pw - 8;
  if (top + ph > window.innerHeight) top = rect.top - ph - 6;
  popup.style.top = Math.max(4, top) + 'px';
  popup.style.left = Math.max(4, left) + 'px';
  const handler = function (e) { if (!popup.contains(e.target) && !e.target.closest('.rec-date-link')) hideNewChartRecPreview(); };
  setTimeout(function () { document.addEventListener('click', handler, true); }, 0);
  _newChartRecPreviewCleanup = function () { document.removeEventListener('click', handler, true); };
}

function hideNewChartRecPreview() {
  const el = document.getElementById('newChartRecPreviewPopup');
  if (el) el.remove();
  if (_newChartRecPreviewCleanup) { _newChartRecPreviewCleanup(); _newChartRecPreviewCleanup = null; }
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
  const bpsPrev = { songs: new Map(), artists: new Map(), albums: new Map() };

  for (const [mk, mm] of Object.entries(periodMap).sort((a, b) => a[0].localeCompare(b[0]))) {
    for (const type of ['songs', 'artists', 'albums']) {
      for (const [k, data] of Object.entries(mm[type])) {
        const prevRk = bpsPrev[type].get(k);
        data.chartStatus = prevRk !== undefined ? 0 : bpsEver[type].has(k) ? 1 : 2;
        data.prevRank = prevRk !== undefined ? prevRk : Infinity;
      }
      const newPrev = new Map();
      Object.entries(mm[type]).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, chartSize).forEach(([k, data], i) => {
        newPrev.set(k, i + 1); bpsEver[type].add(k);
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
  const songsSorted = Object.entries(sp).sort(([, a], [, b]) => rankSort(a, b)).slice(0, chartSizeAllTime);
  const songPeakMap = {};
  songsSorted.forEach(([k], i) => { songPeakMap[k] = i + 1; });

  // Artists (split) — rank within top chartSizeAllTime
  const ap = {};
  for (const p of allPlays) {
    for (const a of p.artists) {
      if (!ap[a]) ap[a] = { count: 0, songs: new Set(), firstAchieved: p.date };
      ap[a].count++;
      ap[a].songs.add(p.title);
    }
  }
  const artistsSorted = Object.entries(ap).sort(([, a], [, b]) => rankSort(a, b)).slice(0, chartSizeAllTime);
  const artistPeakMap = {};
  artistsSorted.forEach(([name], i) => { artistPeakMap[name] = i + 1; });

  // Albums — rank within top chartSizeAllTime
  const lp = {};
  for (const p of allPlays) {
    const k = p.album + '|||' + albumArtist(p);
    if (!lp[k]) lp[k] = { count: 0, firstAchieved: p.date };
    lp[k].count++;
  }
  const albumsSorted = Object.entries(lp).sort(([, a], [, b]) => rankSort(a, b)).slice(0, chartSizeAllTime);
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
  const ppPrev = { songs: new Map(), artists: new Map(), albums: new Map() };

  for (const [pKey, pm] of Object.entries(periodMap).sort((a, b) => a[0].localeCompare(b[0]))) {
    if (pKey === curKey) continue; // current period handled by render reconciliation
    for (const type of ['songs', 'artists', 'albums']) {
      for (const [k, data] of Object.entries(pm[type])) {
        const prevRk = ppPrev[type].get(k);
        data.chartStatus = prevRk !== undefined ? 0 : ppEver[type].has(k) ? 1 : 2;
        data.prevRank = prevRk !== undefined ? prevRk : Infinity;
      }
      const newPrev = new Map();
      Object.entries(pm[type]).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, chartSize).forEach(([k], i) => {
        newPrev.set(k, i + 1); ppEver[type].add(k);
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
  return `<span class="plays-peak-badge">▲ ${t('badge_plays_peak')}</span>`;
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
      const prev = monthlyStats.prevChart.songs[k];
      entry.chartStatus = prev ? 0 : monthlyStats.everChartedBefore.songs.has(k) ? 1 : 2;
      entry.prevRank = prev ? prev.rank : Infinity;
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
  const _prevMapSongs = buildPrevRankMap(_animPrevPlays, 'songs');
  const _animSongs = _animPrevPlays !== null;
  const currPairsS = sorted.map((s, i) => {
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
    const _prevIdxS = _animSongs ? (_prevMapSongs[k] ?? chartSize * 2) : 0;
    const _crsiOffsetS = _animSongs ? Math.max(-200, Math.min(200, (_prevIdxS - i) * 38)) : 0;
    const _animAttrsS = _animSongs ? ` style="--crsi-offset:${_crsiOffsetS}px;--crsi-delay:${i * 50}ms"` : '';
    const _animClassS = _animSongs ? ' chart-row-anim' : '';
    const mainRow = `<tr${_animAttrsS} class="${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''}${_animClassS}">
      <td class="rank-cell"><button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_song')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button>${i + 1}</td>
      <td class="thumb-cell"><div class="thumb-wrap"><div id="${imgId}"><div class="thumb-initials">${esc(initials(s.title))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="song" data-prefkey="${esc(prefKey)}" data-name="${esc(s.title)}" data-artist="${esc(s.artist)}" data-album="${esc(s.album)}">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div></td>
      <td>
        <div class="song-title">${esc(s.title)}${pk ? peakBadge(pk) : ''}${certBadge(cumSongPlays, 'song')}</div>
        <div class="song-artist">${esc(s.artist)}</div>
        <button class="yt-play-btn" data-title="${esc(s.title)}" data-artist="${esc(s.artist)}" data-album="${esc(s.album)}" onclick="event.stopPropagation();ytPlayFromBtn(this)" title="Play on YouTube"><span class="yt-btn-content"><svg class="yt-btn-icon" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>YouTube</span></button>
      </td>
      <td><div class="song-album">${esc(s.album)}${cumAlbumPlays ? certBadge(cumAlbumPlays, 'album') : ''}</div></td>
      ${monthlyStats ? mPrevCell(i + 1, k, 'songs', monthlyStats) : ''}
      ${monthlyStats ? mMthsCell(k, 'songs', monthlyStats) : ''}
      <td>
        <div class="play-count">${tCountHtml('plays', s.count)}${monthlyStats ? deltaInline(s.count, k, 'songs', monthlyStats) : ''}</div>
        <div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(s.count / max * 100)}%"></div></div>
        ${isPlaysPeak ? playsPeakBadge() : ''}
      </td>
    </tr>`;
    const expandRow = `<tr class="cr-row" id="${rowId}"><td colspan="${colCount}"><div class="cr-panel" data-crtype="songs" data-crkey="${encodeURIComponent(k)}">${buildCrPanelHTML('songs', k)}</div></td></tr>`;
    return [mainRow, expandRow];
  });
  const sbodyS = document.getElementById('songsBody');
  if (_animSongs) {
    const _capPrevS = _animPrevPlays, _capCurrS = _animCurrentPlays;
    const _prevEntriesS = buildPrevSortedEntries(_capPrevS, 'songs');
    sbodyS.innerHTML = buildPrevChartHtml(_prevEntriesS, sorted.length, colCount, 'songs');
    const _startAnimS = () => {
      if (sbodyS._swToken) sbodyS._swToken.cancelled = true;
      sbodyS.innerHTML = buildPrevChartHtml(_prevEntriesS, sorted.length, colCount, 'songs');
      loadImages(_prevEntriesS.map((e, i) => ({ imgId: `pwsimg-${i}`, title: e.title, artist: e.artist, album: e.album, type: 'song', prefKey: 'song:' + e.artist.toLowerCase() + '|||' + e.title.toLowerCase(), name: e.title })), 'song');
      runSlideWindowAnim(sbodyS, 'songs', _capPrevS, _capCurrS, () => {
        for (const tr of sbodyS.querySelectorAll('tr[data-chartkey]')) {
          tr.style.transition = 'opacity 0.35s ease';
          tr.style.opacity = '0.75';
        }
        setTimeout(() => {
          sbodyS.innerHTML = currPairsS.flatMap(p => p).join('');
          loadImages(imgItems.map(i => ({ ...i, name: i.title })), 'song');
        }, 380);
      });
    };
    _replayFns['songs'] = _startAnimS;
    if (sbodyS._visObs) sbodyS._visObs.disconnect();
    const _obsS = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      _obsS.disconnect();
      delete sbodyS._visObs;
      _startAnimS();
    }, { threshold: 0 });
    sbodyS._visObs = _obsS;
    _obsS.observe(sbodyS);
  } else {
    delete _replayFns['songs'];
    sbodyS.innerHTML = currPairsS.flatMap(p => p).join('');
    loadImages(imgItems.map(i => ({ ...i, name: i.title })), 'song');
  }
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
      const prev = monthlyStats.prevChart.artists[artist];
      data.chartStatus = prev ? 0 : monthlyStats.everChartedBefore.artists.has(artist) ? 1 : 2;
      data.prevRank = prev ? prev.rank : Infinity;
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
  const _prevMapArtists = buildPrevRankMap(_animPrevPlays, 'artists');
  const _animArtists = _animPrevPlays !== null;
  const currPairsA = sorted.map(([artist, data], i) => {
    const pk = !isAllTime ? peaks.artistPeakMap[artist] : null;
    const imgId = 'aimg-' + i;
    const prefKey = 'artist:' + artist.toLowerCase();
    const rowId = 'crr-artist-' + i;
    imgItems.push({ imgId, name: artist, prefKey });
    const histMaxArtist = playsPeakMaps ? (playsPeakMaps.artists[artist] || 0) : 0;
    const isPlaysPeak = !isAllTime && histMaxArtist > 0 && data.count >= histMaxArtist;
    const _prevIdxA = _animArtists ? (_prevMapArtists[artist] ?? chartSize * 2) : 0;
    const _crsiOffsetA = _animArtists ? Math.max(-200, Math.min(200, (_prevIdxA - i) * 38)) : 0;
    const _animAttrsA = _animArtists ? ` style="--crsi-offset:${_crsiOffsetA}px;--crsi-delay:${i * 50}ms"` : '';
    const _animClassA = _animArtists ? ' chart-row-anim' : '';
    const mainRow = `<tr${_animAttrsA} class="${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''}${_animClassA} artist-row" data-artist="${esc(artist)}">
      <td class="rank-cell"><button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_artist')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button>${i + 1}</td>
      <td class="thumb-cell"><div class="thumb-wrap"><div id="${imgId}"><div class="thumb-initials">${esc(initials(artist))}</div></div><button id="srcbtn-${imgId}" class="img-src-btn" data-imgid="${imgId}" data-type="artist" data-prefkey="${esc(prefKey)}" data-name="${esc(artist)}" data-artist="${esc(artist)}" data-album="">${srcLabel(itemSourcePrefs[prefKey] || 'deezer')}</button></div></td>
      <td><div class="song-title">${esc(artist)}${pk ? peakBadge(pk) : ''}</div><div class="song-artist" style="font-size:0.7rem;letter-spacing:0.06em;font-style:normal;font-family:'DM Mono',monospace;color:var(--text3)">${t('click_view_profile')}</div></td>
      <td><div class="song-artist">${tCount('songs', data.songs.size)}</div></td>
      ${monthlyStats ? mPrevCell(i + 1, artist, 'artists', monthlyStats) : ''}
      ${monthlyStats ? mMthsCell(artist, 'artists', monthlyStats) : ''}
      <td>
        <div class="play-count">${isPlaysPeak ? playsPeakBadge() : ''}${tCountHtml('plays', data.count)}${monthlyStats ? deltaInline(data.count, artist, 'artists', monthlyStats) : ''}</div>
        <div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(data.count / max * 100)}%"></div></div>
      </td>
    </tr>`;
    const expandRow = `<tr class="cr-row" id="${rowId}"><td colspan="${colCount}"><div class="cr-panel" data-crtype="artists" data-crkey="${encodeURIComponent(artist)}">${buildCrPanelHTML('artists', artist)}</div></td></tr>`;
    return [mainRow, expandRow];
  });
  const sbodyA = document.getElementById('artistsBody');
  if (_animArtists) {
    const _capPrevA = _animPrevPlays, _capCurrA = _animCurrentPlays;
    const _prevEntriesA = buildPrevSortedEntries(_capPrevA, 'artists');
    sbodyA.innerHTML = buildPrevChartHtml(_prevEntriesA, sorted.length, colCount, 'artists');
    const _startAnimA = () => {
      if (sbodyA._swToken) sbodyA._swToken.cancelled = true;
      sbodyA.innerHTML = buildPrevChartHtml(_prevEntriesA, sorted.length, colCount, 'artists');
      loadImages(_prevEntriesA.map((e, i) => ({ imgId: `pwaimg-${i}`, name: e.name, prefKey: 'artist:' + e.name.toLowerCase() })), 'artist');
      runSlideWindowAnim(sbodyA, 'artists', _capPrevA, _capCurrA, () => {
        for (const tr of sbodyA.querySelectorAll('tr[data-chartkey]')) {
          tr.style.transition = 'opacity 0.35s ease';
          tr.style.opacity = '0.75';
        }
        setTimeout(() => {
          sbodyA.innerHTML = currPairsA.flatMap(p => p).join('');
          loadImages(imgItems, 'artist');
        }, 380);
      });
    };
    _replayFns['artists'] = _startAnimA;
    if (sbodyA._visObs) sbodyA._visObs.disconnect();
    const _obsA = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      _obsA.disconnect();
      delete sbodyA._visObs;
      _startAnimA();
    }, { threshold: 0 });
    sbodyA._visObs = _obsA;
    _obsA.observe(sbodyA);
  } else {
    delete _replayFns['artists'];
    sbodyA.innerHTML = currPairsA.flatMap(p => p).join('');
    loadImages(imgItems, 'artist');
  }
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
      const prev = monthlyStats.prevChart.albums[k];
      entry.chartStatus = prev ? 0 : monthlyStats.everChartedBefore.albums.has(k) ? 1 : 2;
      entry.prevRank = prev ? prev.rank : Infinity;
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
  const _prevMapAlbums = buildPrevRankMap(_animPrevPlays, 'albums');
  const _animAlbums = _animPrevPlays !== null;
  if (sorted.length === 0) {
    document.getElementById('albumsBody').innerHTML = `<tr><td colspan="${colCount}"><div class="empty-state"><p>${t('empty_no_album_data_csv')}</p></div></td></tr>`;
  } else {
    const currPairsL = sorted.map(({ album, artist, count, tracks }, i) => {
      const ak = album + '|||' + artist;
      const pk = !isAllTime ? peaks.albumPeakMap[ak] : null;
      const imgId = 'limg-' + i;
      const prefKey = 'album:' + artist.toLowerCase() + '|||' + album.toLowerCase();
      const rowId = 'crr-album-' + i;
      imgItems.push({ imgId, album, artist, name: album, prefKey });
      const cumAlbumPlays = cumulativeMaps ? (cumulativeMaps.albums[ak] || 0) : count;
      const histMaxAlbum = playsPeakMaps ? (playsPeakMaps.albums[ak] || 0) : 0;
      const isPlaysPeak = !isAllTime && histMaxAlbum > 0 && count >= histMaxAlbum;
      const _prevIdxL = _animAlbums ? (_prevMapAlbums[ak] ?? chartSize * 2) : 0;
      const _crsiOffsetL = _animAlbums ? Math.max(-200, Math.min(200, (_prevIdxL - i) * 38)) : 0;
      const _animAttrsL = _animAlbums ? ` style="--crsi-offset:${_crsiOffsetL}px;--crsi-delay:${i * 50}ms"` : '';
      const _animClassL = _animAlbums ? ' chart-row-anim' : '';
      const mainRow = `<tr${_animAttrsL} class="${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''}${_animClassL} album-row" data-albumkey="${esc(ak)}">
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
        <div class="play-count">${isPlaysPeak ? playsPeakBadge() : ''}${tCountHtml('plays', count)}${monthlyStats ? deltaInline(count, ak, 'albums', monthlyStats) : ''}</div>
        <div class="play-bar"><div class="play-bar-fill" style="width:${Math.round(count / max * 100)}%"></div></div>
      </td>
    </tr>`;
      const expandRow = `<tr class="cr-row" id="${rowId}"><td colspan="${colCount}"><div class="cr-panel" data-crtype="albums" data-crkey="${encodeURIComponent(ak)}">${buildCrPanelHTML('albums', ak)}</div></td></tr>`;
      return [mainRow, expandRow];
    });
    const sbodyL = document.getElementById('albumsBody');
    if (_animAlbums) {
      const _capPrevL = _animPrevPlays, _capCurrL = _animCurrentPlays;
      const _prevEntriesL = buildPrevSortedEntries(_capPrevL, 'albums');
      sbodyL.innerHTML = buildPrevChartHtml(_prevEntriesL, sorted.length, colCount, 'albums');
      const _startAnimL = () => {
        if (sbodyL._swToken) sbodyL._swToken.cancelled = true;
        sbodyL.innerHTML = buildPrevChartHtml(_prevEntriesL, sorted.length, colCount, 'albums');
        loadImages(_prevEntriesL.map((e, i) => ({ imgId: `pwlimg-${i}`, album: e.album, artist: e.artist, name: e.album, prefKey: 'album:' + (e.album + '|||' + e.artist).toLowerCase() })), 'album');
        runSlideWindowAnim(sbodyL, 'albums', _capPrevL, _capCurrL, () => {
          for (const tr of sbodyL.querySelectorAll('tr[data-chartkey]')) {
            tr.style.transition = 'opacity 0.35s ease';
            tr.style.opacity = '0.75';
          }
          setTimeout(() => {
            sbodyL.innerHTML = currPairsL.flatMap(p => p).join('');
            loadImages(imgItems, 'album');
          }, 380);
        });
      };
      _replayFns['albums'] = _startAnimL;
      if (sbodyL._visObs) sbodyL._visObs.disconnect();
      const _obsL = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        _obsL.disconnect();
        delete sbodyL._visObs;
        _startAnimL();
      }, { threshold: 0 });
      sbodyL._visObs = _obsL;
      _obsL.observe(sbodyL);
    } else {
      delete _replayFns['albums'];
      sbodyL.innerHTML = currPairsL.flatMap(p => p).join('');
      loadImages(imgItems, 'album');
    }
  }
}

// ─── WEEKLY DROPOUTS ───────────────────────────────────────────
function renderDropouts(plays, periodStats) {
  const section = document.getElementById('dropoutsSection');
  if (!periodStats || currentPeriod !== 'week') { section.style.display = 'none'; return; }

  const dropoutsSubtitle = document.getElementById('dropoutsSubtitle');
  dropoutsSubtitle.dataset.i18nN = chartSize;
  dropoutsSubtitle.textContent = t('sub_dropouts', { n: chartSize });

  // Current week's chart keys — must use rankSortWithStatus to match main chart tiebreakers
  const sc = {}, ac = {}, lc = {};
  for (const p of plays) {
    const sk = songKey(p);
    if (!sc[sk]) sc[sk] = { count: 0, firstAchieved: p.date };
    sc[sk].count++;
    for (const a of p.artists) {
      if (!ac[a]) ac[a] = { count: 0, firstAchieved: p.date };
      ac[a].count++;
    }
    if (p.album && p.album !== '—') {
      const ak = p.album + '|||' + albumArtist(p);
      if (!lc[ak]) lc[ak] = { count: 0, firstAchieved: p.date };
      lc[ak].count++;
    }
  }
  for (const [k, d] of Object.entries(sc)) {
    const prev = periodStats.prevChart.songs[k];
    d.chartStatus = prev !== undefined ? 0 : periodStats.everChartedBefore.songs.has(k) ? 1 : 2;
    d.prevRank = prev !== undefined ? prev.rank : Infinity;
  }
  for (const [k, d] of Object.entries(ac)) {
    const prev = periodStats.prevChart.artists[k];
    d.chartStatus = prev !== undefined ? 0 : periodStats.everChartedBefore.artists.has(k) ? 1 : 2;
    d.prevRank = prev !== undefined ? prev.rank : Infinity;
  }
  for (const [k, d] of Object.entries(lc)) {
    const prev = periodStats.prevChart.albums[k];
    d.chartStatus = prev !== undefined ? 0 : periodStats.everChartedBefore.albums.has(k) ? 1 : 2;
    d.prevRank = prev !== undefined ? prev.rank : Infinity;
  }
  const curSongKeys = new Set(Object.entries(sc).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, chartSize).map(([k]) => k));
  const curArtistKeys = new Set(Object.entries(ac).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, chartSize).map(([k]) => k));
  const curAlbumKeys = new Set(Object.entries(lc).sort(([, a], [, b]) => rankSortWithStatus(a, b)).slice(0, chartSize).map(([k]) => k));

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
          <span class="dropout-plays">${tCountHtml('plays', count)}</span>
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
const CERT_DEFAULTS = {
  song:  { gold: 50,  plat: 100, diamond: 200 },
  album: { gold: 120, plat: 300, diamond: 600 }
};
const CERT = {
  song:  { gold: 50,  plat: 100, diamond: 200 },
  album: { gold: 120, plat: 300, diamond: 600 }
};
(function () {
  try {
    const saved = JSON.parse(localStorage.getItem('dc_cert_config') || 'null');
    if (!saved) return;
    if (saved.ag > 0) CERT.album.gold    = saved.ag;
    if (saved.ap > 0) CERT.album.plat    = saved.ap;
    if (saved.ad > 0) CERT.album.diamond = saved.ad;
    if (saved.sg > 0) CERT.song.gold    = saved.sg;
    if (saved.sp > 0) CERT.song.plat    = saved.sp;
    if (saved.sd > 0) CERT.song.diamond = saved.sd;
  } catch (e) {}
})();

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
let _exportSongsOverride = null;

function getCurrentChartSongs() {
  if (_exportSongsOverride) return _exportSongsOverride;
  // fullData.songs is always set by renderSongs/buildSongsFull with the correct sort
  // (rankSortWithStatus for weekly/monthly, rankSort for yearly/alltime) and the
  // correct size limit, so use it directly for all periods.
  return fullData.songs.map(s => ({ title: s.title, artist: s.artist, album: s.album || '' }));
}

let exportReversed = false;
let exportWithAlbum = false;

function buildExportText(songs) {
  const list = exportReversed ? [...songs].reverse() : songs;
  return list.map(s => {
    const base = `${s.artist} - ${s.title}`;
    return (exportWithAlbum && s.album && s.album !== '—') ? `${base} - ${s.album}` : base;
  }).join('\n');
}

function toggleExportOrder() {
  exportReversed = !exportReversed;
  const btn = document.getElementById('exportOrderBtn');
  btn.textContent = exportReversed ? t('export_no1_last') : t('export_no1_first');
  const songs = getCurrentChartSongs();
  document.getElementById('exportTracklist').textContent = buildExportText(songs);
}

function toggleExportAlbum() {
  exportWithAlbum = !exportWithAlbum;
  const btn = document.getElementById('exportAlbumBtn');
  btn.textContent = exportWithAlbum ? '✓ + Album' : '+ Album';
  btn.classList.toggle('active', exportWithAlbum);
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
  exportWithAlbum = false;
  document.getElementById('exportOrderBtn').textContent = t('export_no1_first');
  const albumBtn = document.getElementById('exportAlbumBtn');
  if (albumBtn) { albumBtn.textContent = '+ Album'; albumBtn.classList.remove('active'); }
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
  _exportSongsOverride = null;
  document.getElementById('exportModal').classList.remove('open');
}

function openCalendarExportModal() {
  if (!_eventsCalendarData) return;
  const dateObj = new Date(eventsCalendarYear, eventsCalendarMonth, eventsCalendarDay);
  const ds = localDateStr(dateObj);
  const dayMap = buildCalendarDayMap(
    { ..._eventsCalendarData, concerts: [] },
    new Set([ds])
  );
  const events = (dayMap[ds] || []).filter(ev => ev.ttType === 'anniversary' || ev.ttType === 'release');
  if (!events.length) { alert('No singles found on this day.'); return; }

  _exportSongsOverride = events.map(ev => ({ title: ev.ttTitle, artist: ev.ttArtist, album: '' }));
  const dateLabel = fmtDate(dateObj);

  document.getElementById('exportModalSubtitle').textContent =
    `${tCount('songs', _exportSongsOverride.length)} · ${dateLabel}`;

  const names = [
    `Singles · ${dateLabel}`,
    `New Releases · ${dateLabel}`,
    `🎵 ${dateLabel}`,
  ];
  document.getElementById('exportNameChips').innerHTML = names.map(name =>
    `<button class="export-name-chip" onclick="copyChipName(this,'${esc(name)}')">${esc(name)}</button>`
  ).join('');

  exportReversed = false;
  exportWithAlbum = false;
  document.getElementById('exportOrderBtn').textContent = t('export_no1_first');
  const albumBtn = document.getElementById('exportAlbumBtn');
  if (albumBtn) { albumBtn.textContent = '+ Album'; albumBtn.classList.remove('active'); }
  document.getElementById('exportTracklist').textContent = buildExportText(_exportSongsOverride);

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

function buildExportCSV(songs) {
  const list = exportReversed ? [...songs].reverse() : songs;
  const escCSV = v => {
    if (!v) return '';
    v = String(v);
    return (v.includes(',') || v.includes('"') || v.includes('\n'))
      ? '"' + v.replace(/"/g, '""') + '"'
      : v;
  };
  const rows = ['title,artist,album,isrc,'];
  for (const s of list) {
    const album = (s.album && s.album !== '—') ? s.album : '';
    rows.push([escCSV(s.title), escCSV(s.artist), escCSV(album), '', ''].join(','));
  }
  return rows.join('\n');
}

function exportDownloadCSV() {
  const songs = getCurrentChartSongs();
  const csv = buildExportCSV(songs);
  const subtitle = document.getElementById('exportModalSubtitle').textContent;
  const name = 'playlist-' + subtitle.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.csv';
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
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

// Show/hide per-section export bars — only in All Entries mode for year/alltime
function updateChartExportBtns() {
  const curSize = currentPeriod === 'year' ? chartSizeYearly : chartSizeAllTime;
  const show = isPaginated() && !isFinite(curSize) && allPlays.length > 0;
  document.querySelectorAll('.chart-export-bar').forEach(bar => bar.classList.toggle('visible', show));
}

function exportChartData(type, format) {
  const data = fullData[type] || [];
  if (!data.length) return;
  const { label } = getDateRange();
  const periodSlug = label.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const filename = `${type}-${periodSlug}-all-entries.${format}`;
  const escVal = v => {
    if (!v && v !== 0) return '';
    v = String(v);
    return (v.includes(',') || v.includes('"') || v.includes('\n')) ? '"' + v.replace(/"/g, '""') + '"' : v;
  };

  let content;
  if (format === 'txt') {
    const title = type.charAt(0).toUpperCase() + type.slice(1);
    const lines = [`${title} — ${label} (All Entries)`, ''];
    data.forEach((entry, i) => {
      const rank = `#${i + 1}`;
      if (type === 'songs') {
        const album = entry.album && entry.album !== '—' ? ` [${entry.album}]` : '';
        lines.push(`${rank}: ${entry.title} — ${entry.artist}${album} (${entry.count} plays)`);
      } else if (type === 'artists') {
        lines.push(`${rank}: ${entry.name} (${entry.count} plays)`);
      } else {
        lines.push(`${rank}: ${entry.album} — ${entry.artist} (${entry.count} plays)`);
      }
    });
    content = lines.join('\n');
  } else {
    const rows = [];
    if (type === 'songs') {
      rows.push('rank,title,artist,album,plays');
      data.forEach((entry, i) => {
        const album = (entry.album && entry.album !== '—') ? entry.album : '';
        rows.push([i + 1, escVal(entry.title), escVal(entry.artist), escVal(album), entry.count].join(','));
      });
    } else if (type === 'artists') {
      rows.push('rank,artist,plays');
      data.forEach((entry, i) => rows.push([i + 1, escVal(entry.name), entry.count].join(',')));
    } else {
      rows.push('rank,album,artist,plays');
      data.forEach((entry, i) => rows.push([i + 1, escVal(entry.album), escVal(entry.artist), entry.count].join(',')));
    }
    content = rows.join('\n');
  }

  const bom = format === 'csv' ? '﻿' : '';
  const mime = format === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
  const blob = new Blob([bom + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
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
  const maxSize = isPaginated() ? Math.min(currentPeriod === 'year' ? chartSizeYearly : chartSizeAllTime, 20) : Math.min(chartSize, 20);
  const size = (igOptions.topN > 0) ? Math.min(igOptions.topN, maxSize) : maxSize;
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
  showArt: false,
  artSource: 'deezer',
  topN: 0,
};
let igPreviewType = null;
const igArtCache = {}; // `${key}:ig:${source}` → data URL or null

function saveIgSettings() {
  try {
    localStorage.setItem('dc_igSettings', JSON.stringify({
      format: igOptions.format, showMovement: igOptions.showMovement, showPeak: igOptions.showPeak,
      showWeeks: igOptions.showWeeks, showPlays: igOptions.showPlays, showSubtitle: igOptions.showSubtitle,
      showDate: igOptions.showDate, showFooter: igOptions.showFooter,
      showArt: igOptions.showArt, artSource: igOptions.artSource, topN: igOptions.topN,
    }));
  } catch {}
}

function loadIgSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem('dc_igSettings') || 'null');
    if (saved && typeof saved === 'object') Object.assign(igOptions, saved);
  } catch {}
}

async function _igToDataUrl(url) {
  try {
    const r = await fetch(url);
    const blob = await r.blob();
    return await new Promise((res) => {
      const rd = new FileReader();
      rd.onload = () => res(rd.result);
      rd.onerror = () => res(null);
      rd.readAsDataURL(blob);
    });
  } catch { return null; }
}

const _IG_SOURCES = ['deezer', 'itunes', 'lastfm', 'youtube'];

// Tries preferred source first, then rotates through remaining sources until one has art.
async function _igFetchArtWithFallback(type, item, preferredSource) {
  const startIdx = Math.max(0, _IG_SOURCES.indexOf(preferredSource));
  for (let i = 0; i < _IG_SOURCES.length; i++) {
    const src = _IG_SOURCES[(startIdx + i) % _IG_SOURCES.length];
    let url = null;
    try {
      if (type === 'songs') url = await getTrackImage(item.title, item.artist, src);
      else if (type === 'artists') url = await getArtistImage(item.name, src);
      else url = await getAlbumImage(item.album, item.artist, src);
    } catch (e) {}
    if (url) return url;
  }
  return null;
}

async function prefetchIgArt(type) {
  const source = igOptions.artSource;
  const items = (fullData[type] || []).slice(0, 20);
  await Promise.all(items.map(async item => {
    const itemKey = type === 'songs' ? songKey(item)
                  : type === 'artists' ? item.name
                  : item.album + '|||' + item.artist;
    const ck = itemKey + ':ig:' + source;
    if (ck in igArtCache) return;
    const url = await _igFetchArtWithFallback(type, item, source);
    igArtCache[ck] = url ? await _igToDataUrl(url) : null;
  }));
  if (document.getElementById('igPreviewModal').classList.contains('open') && igPreviewType === type) {
    _renderIgPreview();
  }
}

function setIgArtSource(src) {
  igOptions.artSource = src;
  document.querySelectorAll('.ig-art-src-btn').forEach(b => b.classList.toggle('active', b.dataset.src === src));
  saveIgSettings();
  if (igOptions.showArt && igPreviewType) prefetchIgArt(igPreviewType);
}

function _renderIgPreview() {
  if (!igPreviewType) return;
  const isPost = igOptions.format === 'post';
  const cardW = 540, cardH = isPost ? 540 : 960;
  const scale = isPost ? 0.5 : 0.4;
  const html = buildIgCardHTML(igPreviewType, igOptions);
  if (!html) return;
  const frame = document.getElementById('igPreviewFrame');
  const inner = document.getElementById('igPreviewInner');
  frame.style.width = Math.round(cardW * scale) + 'px';
  frame.style.height = Math.round(cardH * scale) + 'px';
  inner.innerHTML = html;
  inner.style.width = cardW + 'px';
  inner.style.height = cardH + 'px';
  inner.style.transform = `scale(${scale})`;
  inner.style.transformOrigin = 'top left';
  const canvas = document.getElementById('igCardCanvas');
  canvas.innerHTML = html;
  canvas.style.width = cardW + 'px';
  canvas.style.height = cardH + 'px';
}

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

  const thumbSz = opts.showArt ? Math.min(rowH - 6, 52) : 0;

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
    const artDataUrl = opts.showArt ? (igArtCache[key + ':ig:' + (opts.artSource || 'deezer')] ?? null) : null;
    const thumbHtml = opts.showArt
      ? `<div style="width:${thumbSz}px;height:${thumbSz}px;border-radius:3px;overflow:hidden;flex-shrink:0;background:${c.bg3};display:flex;align-items:center;justify-content:center;">${
          artDataUrl
            ? `<img src="${artDataUrl}" width="${thumbSz}" height="${thumbSz}" style="object-fit:cover;display:block;">`
            : `<div style="font-size:${Math.max(9, Math.floor(thumbSz / 2.5))}px;color:${c.text3};font-weight:700;">${esc((name[0] || '?').toUpperCase())}</div>`
        }</div>`
      : '';
    return `<div style="display:flex;align-items:center;min-height:${rowH}px;padding:4px 10px;background:${rowBg};border-bottom:1px solid ${c.border};gap:6px;">
      <div style="font-family:'DM Mono',monospace;font-size:${rankFontSize}px;font-weight:700;color:${rankColor};min-width:28px;text-align:right;flex-shrink:0;">${rank}</div>
      ${opts.showMovement ? `<div style="font-family:'DM Mono',monospace;font-size:${Math.max(6,rankFontSize-3)}px;color:${moveColor};min-width:24px;text-align:center;line-height:1;flex-shrink:0;white-space:nowrap;">${mvLabel || '—'}</div>` : ''}
      ${thumbHtml}
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
  loadIgSettings();
  igPreviewType = type;
  const titleMap = { songs: `★ ${t('ig_type_songs')}`, artists: `♦ ${t('ig_type_artists')}`, albums: `◈ ${t('ig_type_albums')}` };
  document.getElementById('igPreviewTitle').textContent = t('ig_share_title') + ' — ' + titleMap[type];
  // Reset font sliders to Auto (0) — not persisted
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
  // Sync checkboxes (includes showArt)
  ['showMovement', 'showPeak', 'showWeeks', 'showPlays', 'showSubtitle', 'showDate', 'showFooter', 'showArt'].forEach(k => {
    const el = document.getElementById('igOpt_' + k);
    if (el) el.checked = igOptions[k];
  });
  // Sync art source buttons
  document.querySelectorAll('.ig-art-src-btn').forEach(b => b.classList.toggle('active', b.dataset.src === igOptions.artSource));
  // Sync topN slider
  const topNEl = document.getElementById('igTopN');
  if (topNEl) {
    topNEl.value = igOptions.topN;
    const topNLabel = document.getElementById('igTopNLabel');
    if (topNLabel) topNLabel.textContent = igOptions.topN > 0 ? igOptions.topN : 'Auto';
  }
  setIgFormat(igOptions.format);
  if (igOptions.showArt) prefetchIgArt(type);
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
  ['showMovement', 'showPeak', 'showWeeks', 'showPlays', 'showSubtitle', 'showDate', 'showFooter', 'showArt'].forEach(k => {
    const el = document.getElementById('igOpt_' + k);
    if (el) igOptions[k] = el.checked;
  });
  // Read topN slider
  const topNEl = document.getElementById('igTopN');
  if (topNEl) {
    igOptions.topN = parseInt(topNEl.value) || 0;
    const topNLabel = document.getElementById('igTopNLabel');
    if (topNLabel) topNLabel.textContent = igOptions.topN > 0 ? igOptions.topN : 'Auto';
  }
  saveIgSettings();
  // Kick off art prefetch when enabled (renders again when done)
  if (igOptions.showArt) prefetchIgArt(igPreviewType);
  _renderIgPreview();
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

async function copyIgFromPreview() {
  if (!navigator.clipboard?.write) { downloadIgFromPreview(); return; }
  const btn = document.getElementById('igCopyBtn');
  const orig = btn.textContent;
  btn.textContent = '⏳…';
  btn.disabled = true;
  try {
    const isPost = igOptions.format === 'post';
    const cardW = 540, cardH = isPost ? 540 : 960;
    const canvas = document.getElementById('igCardCanvas');
    const cvs = await html2canvas(canvas, { scale: 2, useCORS: false, allowTaint: true, backgroundColor: null, logging: false, width: cardW, height: cardH });
    const blob = await new Promise(res => cvs.toBlob(res, 'image/png'));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2000);
  } catch {
    btn.textContent = orig;
    btn.disabled = false;
    downloadIgFromPreview();
  }
}

async function shareIgNative() {
  const btn = document.getElementById('igShareNativeBtn');
  const orig = btn.textContent;
  btn.textContent = '⏳…';
  btn.disabled = true;
  try {
    const isPost = igOptions.format === 'post';
    const cardW = 540, cardH = isPost ? 540 : 960;
    const canvas = document.getElementById('igCardCanvas');
    const cvs = await html2canvas(canvas, { scale: 2, useCORS: false, allowTaint: true, backgroundColor: null, logging: false, width: cardW, height: cardH });
    const blob = await new Promise(res => cvs.toBlob(res, 'image/png'));
    const typeLabel = { songs: 'Songs', artists: 'Artists', albums: 'Albums' }[igPreviewType] || 'Chart';
    const file = new File([blob], `dankcharts_${typeLabel}.png`, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: 'dankcharts.fm' });
    } else {
      const link = document.createElement('a');
      link.download = file.name;
      link.href = URL.createObjectURL(blob);
      link.click();
    }
  } catch {}
  btn.textContent = orig;
  btn.disabled = false;
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

// Resolves a URL for the given type/key/source, returns null on any failure.
async function _lookupImgUrl(type, key, source) {
  try {
    const crAny = allChartRun.year?.result?.[type]?.[key]
      || allChartRun.month?.result?.[type]?.[key]
      || allChartRun.week?.result?.[type]?.[key];
    if (type === 'artists') return await getArtistImage(key, source);
    if (type === 'songs') {
      return await getTrackImage(
        crAny?._title || key.split('|||')[0] || key,
        crAny?._artist || key.split('|||')[1] || '',
        source
      );
    }
    return await getAlbumImage(
      crAny?._album || key.split('|||')[0] || key,
      crAny?._artist || key.split('|||')[1] || '',
      source
    );
  } catch (e) { return null; }
}

const _CRIG_SOURCES = ['deezer', 'itunes', 'lastfm', 'youtube'];

// Cycles through _CRIG_SOURCES starting from startSource, stops before looping back to 'deezer'.
// Returns { url, source } for the first hit, or { url: null, source: 'deezer' } when all fail.
async function _fetchWithSourceFallback(type, key, startSource) {
  const startIdx = Math.max(0, _CRIG_SOURCES.indexOf(startSource));
  for (let i = 0; i < _CRIG_SOURCES.length; i++) {
    const source = _CRIG_SOURCES[(startIdx + i) % _CRIG_SOURCES.length];
    if (i > 0 && source === 'deezer') break; // cycled back to sentinel — stop
    const url = await _lookupImgUrl(type, key, source);
    if (url) return { url, source };
  }
  return { url: null, source: 'deezer' };
}

async function _fetchEntPostImage(type, key) {
  if (crIgState.entPostImgSource === 'off') {
    crIgState.entPostImgUrl = null;
    if (document.getElementById('crIgModal').classList.contains('open') && crIgState.key === key && crIgState.mode === 'entrypost') updateCrIgPreview();
    return;
  }
  const { url, source } = await _fetchWithSourceFallback(type, key, crIgState.entPostImgSource || 'deezer');
  if (source !== crIgState.entPostImgSource) {
    crIgState.entPostImgSource = source;
    _syncEntPostSrcBtns();
  }
  crIgState.entPostImgUrl = url || null;
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

// Fetches cover art for the given type/key using crIgState.imgSource, with automatic source fallback.
async function fetchCrIgImage(type, key) {
  if (crIgState.imgSource === 'off') {
    crIgState.imgUrl = null;
    if (document.getElementById('crIgModal').classList.contains('open') && crIgState.key === key) updateCrIgPreview();
    return;
  }
  const { url, source } = await _fetchWithSourceFallback(type, key, crIgState.imgSource || 'deezer');
  if (source !== crIgState.imgSource) {
    crIgState.imgSource = source;
    _syncCrIgSrcBtns();
  }
  crIgState.imgUrl = url || null;
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
    if (window.getSelection && window.getSelection().toString().length > 0) return;
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

function longestConsecutiveDays(daySet) {
  const days = [...daySet].sort();
  if (days.length < 2) return days.length;
  let maxStreak = 1, streak = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = Math.round((new Date(days[i] + 'T00:00:00') - new Date(days[i - 1] + 'T00:00:00')) / 86400000);
    if (diff === 1) { if (++streak > maxStreak) maxStreak = streak; } else streak = 1;
  }
  return maxStreak;
}

function maxConsecutivePlaysWeek(sk, weekKey) {
  const weekPlays = allPlays.filter(p => playWeekKey(p.date) === weekKey).sort((a, b) => a.date - b.date);
  let max = 0, streak = 0;
  for (const p of weekPlays) {
    if (songKey(p) === sk) { if (++streak > max) max = streak; } else streak = 0;
  }
  return max;
}

function maxConsecutivePlaysWeekAlbum(albumCrKey, weekKey) {
  const sepIdx = albumCrKey.indexOf('|||');
  const albumName = albumCrKey.slice(0, sepIdx);
  const albumArt = albumCrKey.slice(sepIdx + 3);
  const weekPlays = allPlays.filter(p => playWeekKey(p.date) === weekKey).sort((a, b) => a.date - b.date);
  let max = 0, streak = 0;
  for (const p of weekPlays) {
    if (p.album === albumName && albumArtist(p) === albumArt) { if (++streak > max) max = streak; } else streak = 0;
  }
  return max;
}

function goToPeriodFromArtistModal(period, periodKey) {
  document.getElementById('artistModal').classList.remove('open');
  navigateToRecPeriod(period, periodKey);
}

function goToPeriodFromAlbumModal(period, periodKey) {
  document.getElementById('albumModal').classList.remove('open');
  navigateToRecPeriod(period, periodKey);
}

function longestConsecutiveMonths(monthSet) {
  if (!monthSet || !monthSet.size) return 0;
  const months = [...monthSet].sort();
  if (months.length < 2) return months.length;
  let maxStreak = 1, streak = 1;
  for (let i = 1; i < months.length; i++) {
    const [ay, am] = months[i - 1].split('-').map(Number);
    const [by, bm] = months[i].split('-').map(Number);
    if ((by - ay) * 12 + (bm - am) === 1) { if (++streak > maxStreak) maxStreak = streak; } else streak = 1;
  }
  return maxStreak;
}

function longestConsecutivePlaysAllTime(sk) {
  let max = 0, streak = 0;
  for (let i = allPlays.length - 1; i >= 0; i--) {
    if (songKey(allPlays[i]) === sk) { if (++streak > max) max = streak; } else streak = 0;
  }
  return max;
}

let _albSparklinePlays = null;
let _albTooltipInited = false;

function _initAlbTooltip() {
  if (_albTooltipInited) return;
  _albTooltipInited = true;
  let tip = document.getElementById('alb-float-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'alb-float-tip';
    tip.className = 'alb-float-tip';
    document.body.appendChild(tip);
  }
  document.addEventListener('mousemove', e => {
    const bar = e.target.closest ? e.target.closest('.alb-spark-bar[data-tip]') : null;
    if (bar) {
      tip.innerHTML = bar.dataset.tip.split('||').join('<br>');
      tip.style.display = 'block';
      tip.style.left = (e.clientX + 14) + 'px';
      tip.style.top = Math.max(8, e.clientY - 54) + 'px';
    } else {
      tip.style.display = 'none';
    }
  });
}

function _albBarColor(ratio) {
  const h = Math.round(210 - ratio * 15);
  const s = Math.round(45 + ratio * 45);
  const l = Math.round(28 + ratio * 33);
  return `hsl(${h},${s}%,${l}%)`;
}

function _albFindLongestStreak(months) {
  if (!months.length) return { start: 0, len: 0 };
  let bestStart = 0, bestLen = 1, curStart = 0, curLen = 1;
  for (let i = 1; i < months.length; i++) {
    const [py, pm] = months[i - 1].split('-').map(Number);
    const [cy, cm] = months[i].split('-').map(Number);
    if (cy * 12 + cm - (py * 12 + pm) === 1) {
      curLen++;
      if (curLen > bestLen) { bestLen = curLen; bestStart = curStart; }
    } else {
      curStart = i;
      curLen = 1;
    }
  }
  return { start: bestStart, len: bestLen };
}

function albMonthClick(month) {
  const panel = document.getElementById('alb-month-detail');
  if (!panel || !_albSparklinePlays) return;
  if (panel.dataset.month === month) {
    panel.dataset.month = '';
    panel.innerHTML = '';
    panel.style.display = 'none';
    document.querySelectorAll('.alb-spark-bar--active').forEach(b => b.classList.remove('alb-spark-bar--active'));
    return;
  }
  document.querySelectorAll('.alb-spark-bar--active').forEach(b => b.classList.remove('alb-spark-bar--active'));
  const activeBar = document.querySelector(`.alb-spark-bar[data-month="${month}"]`);
  if (activeBar) activeBar.classList.add('alb-spark-bar--active');
  const locale = { en: 'en-US', es: 'es', 'pt-BR': 'pt-BR', 'pt-PT': 'pt-PT' }[currentLang] || 'en-US';
  const MO = Array.from({length: 12}, (_, i) => new Date(2000, i, 1).toLocaleString(locale, {month: 'short'}));
  const [yr, mo] = month.split('-');
  const label = `${MO[parseInt(mo) - 1]} ${yr}`;
  const monthPlays = _albSparklinePlays.filter(p => {
    const d = tzDate(p.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === month;
  });
  const trackCounts = {};
  for (const p of monthPlays) {
    const sk = `${p.artist}|||${p.title}`;
    if (!trackCounts[sk]) trackCounts[sk] = { count: 0, title: p.title };
    trackCounts[sk].count++;
  }
  const topTracks = Object.values(trackCounts).sort((a, b) => b.count - a.count).slice(0, 5);
  panel.dataset.month = month;
  panel.style.display = 'block';
  panel.innerHTML = `
    <div class="alb-month-detail-header">📅 ${label} — ${tCount('plays', monthPlays.length)}</div>
    <div class="alb-month-detail-tracks">
      ${topTracks.map((t, i) => `<div class="alb-month-track">
        <span class="alb-month-rank">#${i + 1}</span>
        <span class="alb-month-title">${t.title}</span>
        <span class="alb-month-count">${t.count}×</span>
      </div>`).join('')}
    </div>`;
}

function albChartPlay() {
  const wrap = document.getElementById('albSparklineWrap');
  if (!wrap) return;
  const bars = wrap.querySelectorAll('.alb-spark-bar');
  const btn = wrap.querySelector('.alb-play-btn');
  if (btn) btn.disabled = true;
  bars.forEach(b => { b.style.animation = 'none'; void b.offsetHeight; });
  bars.forEach((b, i) => {
    b.style.animation = '';
    b.style.animationDelay = `${i * 22}ms`;
  });
  setTimeout(() => { if (btn) btn.disabled = false; }, bars.length * 22 + 450);
}

function buildAlbumSparklineHTML(albumPlays) {
  _albSparklinePlays = albumPlays;
  _initAlbTooltip();
  if (albumPlays.length < 2) return '';
  const monthCounts = {};
  for (const p of albumPlays) {
    const d = tzDate(p.date);
    const mk = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthCounts[mk] = (monthCounts[mk] || 0) + 1;
  }
  const months = Object.keys(monthCounts).sort();
  if (months.length < 2) return '';
  const maxVal = Math.max(...Object.values(monthCounts));
  const midVal = Math.round(maxVal / 2);
  const avgVal = Math.round(Object.values(monthCounts).reduce((s, v) => s + v, 0) / months.length);
  const avgPct = Math.round(avgVal / maxVal * 100);
  const locale = { en: 'en-US', es: 'es', 'pt-BR': 'pt-BR', 'pt-PT': 'pt-PT' }[currentLang] || 'en-US';
  const MO = Array.from({length: 12}, (_, i) => new Date(2000, i, 1).toLocaleString(locale, {month: 'short'}));
  const total = months.length;
  const labelEvery = total <= 6 ? 1 : total <= 12 ? 2 : total <= 24 ? 3 : total <= 48 ? 6 : 12;
  const peakIdx = months.reduce((best, m, i) => monthCounts[m] > monthCounts[months[best]] ? i : best, 0);
  const streak = _albFindLongestStreak(months);
  const sortedVals = [...Object.values(monthCounts)].sort((a, b) => b - a);

  let barsHTML = '', xlabelsHTML = '';
  months.forEach((m, i) => {
    const [yr, mo] = m.split('-');
    const count = monthCounts[m];
    const ratio = count / maxVal;
    const pct = Math.max(2, Math.round(ratio * 100));
    const color = _albBarColor(ratio);
    const isPeak = i === peakIdx;
    const inStreak = streak.len >= 3 && i >= streak.start && i < streak.start + streak.len;
    const rank = sortedVals.indexOf(count) + 1;
    const rankSuffix = rank === 1 ? t('alb_best_month_1') : rank === 2 ? t('alb_best_month_2') : rank === 3 ? t('alb_best_month_3') : '';
    const tip = `${MO[parseInt(mo) - 1]} ${yr}||${tCount('plays', count)}${rankSuffix ? '||' + rankSuffix : ''}`;
    const cls = ['alb-spark-bar', isPeak ? 'alb-spark-bar--peak' : '', inStreak ? 'alb-spark-bar--streak' : ''].filter(Boolean).join(' ');
    const show = i === 0 || i === total - 1 || i % labelEvery === 0;

    if (i > 0 && yr !== months[i - 1].split('-')[0]) {
      barsHTML += `<div class="alb-year-sep"><span class="alb-year-sep-label">${yr}</span></div>`;
      xlabelsHTML += `<span class="alb-year-sep-xl"></span>`;
    }
    barsHTML += `<div class="${cls}" style="height:${pct}%;background:${color};animation-delay:${i * 22}ms" data-month="${m}" data-tip="${tip}" onclick="albMonthClick('${m}')"></div>`;
    xlabelsHTML += `<span class="alb-spark-xlabel${isPeak ? ' alb-spark-xlabel--peak' : ''}">${show ? `${MO[parseInt(mo) - 1]} '${yr.slice(2)}` : ''}</span>`;
  });

  const streakLabel = streak.len >= 3 ? `<div class="alb-streak-label">🔥 ${t('alb_streak_label', {n: streak.len})}</div>` : '';

  return `<div class="alb-sparkline-wrap" id="albSparklineWrap">
    <div class="alb-sparkline-header">
      <div class="alb-sparkline-label">${t('alb_plays_by_month')}</div>
      <button class="alb-play-btn" onclick="albChartPlay()" title="${t('alb_replay_title')}">${t('alb_replay_btn')}</button>
    </div>
    <div class="alb-chart-area">
      <div class="alb-y-axis">
        <span>${maxVal}</span>
        <span>${midVal}</span>
        <span>0</span>
      </div>
      <div class="alb-chart-body">
        <div class="alb-bars-area">
          <div class="alb-grid-line" style="top:0"></div>
          <div class="alb-grid-line" style="top:50%"></div>
          <div class="alb-grid-line" style="bottom:0"></div>
          <div class="alb-avg-line" style="bottom:${avgPct}%">
            <span class="alb-avg-label">${t('alb_avg_label', {n: avgVal})}</span>
          </div>
          ${barsHTML}
        </div>
        <div class="alb-x-labels">${xlabelsHTML}</div>
        ${streakLabel}
      </div>
    </div>
    <div id="alb-month-detail" class="alb-month-detail" style="display:none"></div>
  </div>`;
}

// ─── ARTIST SPARKLINE ──────────────────────────────────────────────────────────

let _artSparklinePlays = null;

function artMonthClick(month) {
  const panel = document.getElementById('art-month-detail');
  if (!panel || !_artSparklinePlays) return;
  if (panel.dataset.month === month) {
    panel.dataset.month = '';
    panel.innerHTML = '';
    panel.style.display = 'none';
    document.querySelectorAll('#artSparklineWrap .alb-spark-bar--active').forEach(b => b.classList.remove('alb-spark-bar--active'));
    return;
  }
  document.querySelectorAll('#artSparklineWrap .alb-spark-bar--active').forEach(b => b.classList.remove('alb-spark-bar--active'));
  const activeBar = document.querySelector(`#artSparklineWrap .alb-spark-bar[data-month="${month}"]`);
  if (activeBar) activeBar.classList.add('alb-spark-bar--active');
  const locale = { en: 'en-US', es: 'es', 'pt-BR': 'pt-BR', 'pt-PT': 'pt-PT' }[currentLang] || 'en-US';
  const MO = Array.from({length: 12}, (_, i) => new Date(2000, i, 1).toLocaleString(locale, {month: 'short'}));
  const [yr, mo] = month.split('-');
  const label = `${MO[parseInt(mo) - 1]} ${yr}`;
  const monthPlays = _artSparklinePlays.filter(p => {
    const d = tzDate(p.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === month;
  });
  const songCounts = {};
  for (const p of monthPlays) {
    const sk = songKey(p);
    if (!songCounts[sk]) songCounts[sk] = { count: 0, title: p.title };
    songCounts[sk].count++;
  }
  const topSongs = Object.values(songCounts).sort((a, b) => b.count - a.count).slice(0, 5);
  panel.dataset.month = month;
  panel.style.display = 'block';
  panel.innerHTML = `
    <div class="alb-month-detail-header">📅 ${label} — ${tCount('plays', monthPlays.length)}</div>
    <div class="alb-month-detail-tracks">
      ${topSongs.map((s, i) => `<div class="alb-month-track">
        <span class="alb-month-rank">#${i + 1}</span>
        <span class="alb-month-title">${esc(s.title)}</span>
        <span class="alb-month-count">${s.count}×</span>
      </div>`).join('')}
    </div>`;
}

function artChartPlay() {
  const wrap = document.getElementById('artSparklineWrap');
  if (!wrap) return;
  const bars = wrap.querySelectorAll('.alb-spark-bar');
  const btn = wrap.querySelector('.alb-play-btn');
  if (btn) btn.disabled = true;
  bars.forEach(b => { b.style.animation = 'none'; void b.offsetHeight; });
  bars.forEach((b, i) => {
    b.style.animation = '';
    b.style.animationDelay = `${i * 22}ms`;
  });
  setTimeout(() => { if (btn) btn.disabled = false; }, bars.length * 22 + 450);
}

function buildArtistSparklineHTML(artistPlays) {
  _artSparklinePlays = artistPlays;
  _initAlbTooltip();
  if (artistPlays.length < 2) return '';
  const monthCounts = {};
  for (const p of artistPlays) {
    const d = tzDate(p.date);
    const mk = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthCounts[mk] = (monthCounts[mk] || 0) + 1;
  }
  const months = Object.keys(monthCounts).sort();
  if (months.length < 2) return '';
  const maxVal = Math.max(...Object.values(monthCounts));
  const midVal = Math.round(maxVal / 2);
  const avgVal = Math.round(Object.values(monthCounts).reduce((s, v) => s + v, 0) / months.length);
  const avgPct = Math.round(avgVal / maxVal * 100);
  const locale = { en: 'en-US', es: 'es', 'pt-BR': 'pt-BR', 'pt-PT': 'pt-PT' }[currentLang] || 'en-US';
  const MO = Array.from({length: 12}, (_, i) => new Date(2000, i, 1).toLocaleString(locale, {month: 'short'}));
  const total = months.length;
  const labelEvery = total <= 6 ? 1 : total <= 12 ? 2 : total <= 24 ? 3 : total <= 48 ? 6 : 12;
  const peakIdx = months.reduce((best, m, i) => monthCounts[m] > monthCounts[months[best]] ? i : best, 0);
  const streak = _albFindLongestStreak(months);
  const sortedVals = [...Object.values(monthCounts)].sort((a, b) => b - a);

  let barsHTML = '', xlabelsHTML = '';
  months.forEach((m, i) => {
    const [yr, mo] = m.split('-');
    const count = monthCounts[m];
    const ratio = count / maxVal;
    const pct = Math.max(2, Math.round(ratio * 100));
    const color = _albBarColor(ratio);
    const isPeak = i === peakIdx;
    const inStreak = streak.len >= 3 && i >= streak.start && i < streak.start + streak.len;
    const rank = sortedVals.indexOf(count) + 1;
    const rankSuffix = rank === 1 ? t('alb_best_month_1') : rank === 2 ? t('alb_best_month_2') : rank === 3 ? t('alb_best_month_3') : '';
    const tip = `${MO[parseInt(mo) - 1]} ${yr}||${tCount('plays', count)}${rankSuffix ? '||' + rankSuffix : ''}`;
    const cls = ['alb-spark-bar', isPeak ? 'alb-spark-bar--peak' : '', inStreak ? 'alb-spark-bar--streak' : ''].filter(Boolean).join(' ');
    const show = i === 0 || i === total - 1 || i % labelEvery === 0;
    if (i > 0 && yr !== months[i - 1].split('-')[0]) {
      barsHTML += `<div class="alb-year-sep"><span class="alb-year-sep-label">${yr}</span></div>`;
      xlabelsHTML += `<span class="alb-year-sep-xl"></span>`;
    }
    barsHTML += `<div class="${cls}" style="height:${pct}%;background:${color};animation-delay:${i * 22}ms" data-month="${m}" data-tip="${tip}" onclick="artMonthClick('${m}')"></div>`;
    xlabelsHTML += `<span class="alb-spark-xlabel${isPeak ? ' alb-spark-xlabel--peak' : ''}">${show ? `${MO[parseInt(mo) - 1]} '${yr.slice(2)}` : ''}</span>`;
  });

  const streakLabel = streak.len >= 3 ? `<div class="alb-streak-label">🔥 ${t('alb_streak_label', {n: streak.len})}</div>` : '';

  return `<div class="alb-sparkline-wrap" id="artSparklineWrap">
    <div class="alb-sparkline-header">
      <div class="alb-sparkline-label">${t('alb_plays_by_month')}</div>
      <button class="alb-play-btn" onclick="artChartPlay()" title="${t('alb_replay_title')}">${t('alb_replay_btn')}</button>
    </div>
    <div class="alb-chart-area">
      <div class="alb-y-axis">
        <span>${maxVal}</span>
        <span>${midVal}</span>
        <span>0</span>
      </div>
      <div class="alb-chart-body">
        <div class="alb-bars-area">
          <div class="alb-grid-line" style="top:0"></div>
          <div class="alb-grid-line" style="top:50%"></div>
          <div class="alb-grid-line" style="bottom:0"></div>
          <div class="alb-avg-line" style="bottom:${avgPct}%">
            <span class="alb-avg-label">${t('alb_avg_label', {n: avgVal})}</span>
          </div>
          ${barsHTML}
        </div>
        <div class="alb-x-labels">${xlabelsHTML}</div>
        ${streakLabel}
      </div>
    </div>
    <div id="art-month-detail" class="alb-month-detail" style="display:none"></div>
  </div>`;
}

function computeTrackPeaks(sk) {
  const songPlays = allPlays.filter(p => songKey(p) === sk);
  const dayBuckets = {}, weekBuckets = {}, monthBuckets = {}, yearBuckets = {};
  for (const p of songPlays) {
    const d = tzDate(p.date);
    const dk = localDateStr(d);
    const wk = playWeekKey(p.date);
    const mk = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const yk = String(d.getFullYear());
    dayBuckets[dk] = (dayBuckets[dk] || 0) + 1;
    weekBuckets[wk] = (weekBuckets[wk] || 0) + 1;
    monthBuckets[mk] = (monthBuckets[mk] || 0) + 1;
    yearBuckets[yk] = (yearBuckets[yk] || 0) + 1;
  }
  const top = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1] || b[0].localeCompare(a[0]))[0] || null;
  return { peakDay: top(dayBuckets), peakWeek: top(weekBuckets), peakMonth: top(monthBuckets), peakYear: top(yearBuckets) };
}

let _albCurrentTrackSort = 'plays';
let _albCurrentAlbumCtx = null;

function sortAlbumTracksBy(criterion) {
  _albCurrentTrackSort = criterion;
  if (!_albCurrentAlbumCtx) return;
  const { tracks, totalPlays, crY, crM, crW, allTimeSPM, ek } = _albCurrentAlbumCtx;
  const sorted = _sortAlbTracks([...tracks], criterion, crY, crM, crW, allTimeSPM);
  const sortBar = (c) => ['plays','rank','firstPlayed','lastPlayed'].map(s =>
    `<button class="alb-sort-btn${c === s ? ' active' : ''}" data-sort="${s}" onclick="sortAlbumTracksBy('${s}')">${
      s === 'plays' ? 'Most Played' : s === 'rank' ? 'Chart Rank' : s === 'firstPlayed' ? 'Discovered First' : 'Recently Played'
    }</button>`).join('');
  document.getElementById('albumModalTracks').innerHTML =
    `<div class="alb-sort-bar"><span class="alb-sort-label">Sort:</span>${sortBar(criterion)}</div>` +
    _buildAlbTracksHTML(sorted, totalPlays, crY, crM, crW, allTimeSPM, ek);
}

function _sortAlbTracks(tracks, criterion, crY, crM, crW, allTimeSPM) {
  if (criterion === 'rank') {
    return tracks.sort((a, b) => {
      const ra = allTimeSPM[songKey(a)] || 99999, rb = allTimeSPM[songKey(b)] || 99999;
      return ra - rb || b.count - a.count;
    });
  } else if (criterion === 'firstPlayed') {
    return tracks.sort((a, b) => a.firstPlayed - b.firstPlayed);
  } else if (criterion === 'lastPlayed') {
    return tracks.sort((a, b) => b.lastPlayed - a.lastPlayed);
  }
  return tracks.sort((a, b) => b.count - a.count);
}

function _buildAlbTrackPanelHTML(s, totalPlays, crY, crM, crW, allTimeSPM) {
  const sk = songKey(s);
  const allTimeRank = allTimeSPM[sk];

  // Calendar days + streaks
  const songPlays = allPlays.filter(p => songKey(p) === sk);
  const daySet = new Set(), monthSet = new Set();
  for (const p of songPlays) {
    const d = tzDate(p.date);
    daySet.add(localDateStr(d));
    monthSet.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  const calDays = daySet.size;
  const consecDays = longestConsecutiveDays(daySet);
  const consecMonths = longestConsecutiveMonths(monthSet);
  const consecPlays = longestConsecutivePlaysAllTime(sk);
  const peaks = computeTrackPeaks(sk);

  const MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtWeekKey = wk => { const d = new Date(wk + 'T00:00:00'); return `Wk of ${d.getDate()} ${MO[d.getMonth()]} ${d.getFullYear()}`; };
  const fmtMonthKey = mk => { const [y, m] = mk.split('-'); return `${MO[parseInt(m) - 1]} ${y}`; };

  const statItem = (val, label, sub = '') => `<div class="alb-stat-item">
    <strong>${val}</strong>
    <span>${label}</span>
    ${sub ? `<div class="alb-stat-date">${sub}</div>` : ''}
  </div>`;

  let statsHTML = `<div class="alb-track-stats-grid">`;
  if (allTimeRank) statsHTML += statItem(`#${allTimeRank}`, 'Most Heard Song of All Time');
  statsHTML += statItem(calDays, 'Calendar Days Played');
  if (consecDays > 1) statsHTML += statItem(`${consecDays}d`, 'Longest Day Streak');
  if (consecMonths > 1) statsHTML += statItem(`${consecMonths}mo`, 'Longest Month Streak');
  if (consecPlays > 1) statsHTML += statItem(`${consecPlays}×`, 'Longest Play Streak');
  if (peaks.peakDay) statsHTML += statItem(peaks.peakDay[1], 'Peak Plays in a Day', peaks.peakDay[0]);
  if (peaks.peakWeek) statsHTML += statItem(peaks.peakWeek[1], 'Peak Plays in a Week', fmtWeekKey(peaks.peakWeek[0]));
  if (peaks.peakMonth) statsHTML += statItem(peaks.peakMonth[1], 'Peak Plays in a Month', fmtMonthKey(peaks.peakMonth[0]));
  if (peaks.peakYear) statsHTML += statItem(peaks.peakYear[1], 'Peak Plays in a Year', peaks.peakYear[0]);
  const crYD = crY?.result?.songs?.[sk];
  if (crYD) {
    statsHTML += statItem(crYD.peakDays, 'Peak Days in a Year');
    statsHTML += statItem(crYD.peakMonths, 'Peak Months in a Year');
  }
  statsHTML += `</div>`;

  // Chart run subsections (pre-rendered)
  const preSection = (label, period, crData) => {
    const d = crData?.result?.songs?.[sk];
    if (!d) return '';
    return `<div class="cr-subsection">
      <div class="cr-subsection-header" onclick="toggleCrSubsection(this)">
        <span class="cr-subsection-toggle">▶</span>
        <span class="cr-subsection-label">${label}</span>
      </div>
      <div class="cr-subsection-body" style="display:none;" data-loaded="1">
        <div class="cr-stats">${crStats('songs', sk, period, crData)}</div>
        ${crBoxesHTML('songs', sk, crData, null, period)}
      </div>
    </div>`;
  };

  return `<div class="alb-track-panel">
    ${statsHTML}
    ${preSection('YEARLY CHART RUN', 'year', crY)}
    ${preSection('MONTHLY CHART RUN', 'month', crM)}
    ${preSection('WEEKLY CHART RUN', 'week', crW)}
    <div class="cr-subsection"><div class="cr-subsection-header" onclick="toggleCrSubsection(this)"><span class="cr-subsection-toggle">▶</span><span class="cr-subsection-label">LISTENING HEATMAP</span></div><div class="cr-subsection-body" style="display:none;" data-crtype="songs" data-crkey="${esc(sk)}" data-crkind="heatmap"></div></div>
    <div class="cr-subsection"><div class="cr-subsection-header" onclick="toggleCrSubsection(this)"><span class="cr-subsection-toggle">▶</span><span class="cr-subsection-label">STREAMING HISTORY</span></div><div class="cr-subsection-body" style="display:none;" data-crtype="songs" data-crkey="${esc(sk)}" data-crkind="rawdata"></div></div>
  </div>`;
}

function _buildAlbTracksHTML(tracks, totalPlays, crY, crM, crW, allTimeSPM, albumEk) {
  if (!tracks.length) return `<div style="font-style:italic;color:var(--text3);padding:0.5rem 0;font-size:0.85rem">No tracks found.</div>`;
  let rows = '';
  tracks.forEach((s, i) => {
    const sk = songKey(s);
    const atRank = allTimeSPM[sk];
    const pct = totalPlays ? (s.count / totalPlays * 100).toFixed(1) : 0;
    const rowId = 'albt-row-' + albumEk + '-' + i;
    const panelHTML = _buildAlbTrackPanelHTML(s, totalPlays, crY, crM, crW, allTimeSPM);
    rows += `<tr>
      <td style="width:28px">
        <button class="cr-toggle-btn alb-track-toggle" title="Track Details" onclick="event.stopPropagation();(function(btn,id){const r=document.getElementById(id);const open=r.classList.toggle('open');btn.classList.toggle('active',open);})(this,'${rowId}')"><svg class="alb-track-icon" viewBox="0 0 8 10" width="8" height="10"><path d="M0 0 L8 5 L0 10 Z" fill="currentColor"/></svg></button>
      </td>
      <td class="modal-rank-col">${atRank ? '#' + atRank : '—'}</td>
      <td>
        <div class="song-title">${esc(s.title)}${certBadge(s.count, 'song')}</div>
        <div class="alb-share-wrap" style="margin-top:0.2rem">
          <div class="alb-share-bar"><div class="alb-share-fill" style="width:${pct}%"></div></div>
          <span class="alb-share-pct">${pct}%</span>
        </div>
      </td>
      <td class="modal-date-col">${fmt(s.firstPlayed)}</td>
      <td class="modal-date-col">${fmt(s.lastPlayed)}</td>
      <td>${s.count} ${tUnit('plays', s.count)}</td>
    </tr>
    <tr class="cr-row" id="${rowId}"><td colspan="6">${panelHTML}</td></tr>`;
  });
  return `<table class="modal-table"><thead><tr class="modal-table-header">
    <td></td><td>RANK</td><td>${t('th_track')}</td>
    <td class="modal-date-col">${t('modal_first_played')}</td>
    <td class="modal-date-col">${t('modal_last_played')}</td>
    <td>${t('th_plays')}</td>
  </tr></thead><tbody>${rows}</tbody></table>`;
}

function openArtistModal(artistName) {
  // Close any open IG modals so they don't stack behind the artist modal
  document.getElementById('crIgModal')?.classList.remove('open');
  document.getElementById('igPreviewModal')?.classList.remove('open');
  // Ensure all period chart runs are built (needed for weekly peak + new sections)
  ensureAllChartRun();
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

  // Always use all-time peaks for the artist modal (modal always shows all-time profile)
  const peaks = buildAllTimePeaks();
  const crY = allChartRun.year, crM = allChartRun.month, crW = allChartRun.week;

  // Build the all-time song rank map inline so chart membership is always accurate.
  // Using peaks.songPeakMap alone was unreliable: if chartSizeAllTime is unexpected or
  // the external build has stale state, chartSongs would be empty and the fallback
  // (allSongsSorted.slice(0, chartSizeAllTime)) would silently show the artist's own top-N
  // songs instead of actual global chart songs.
  const allTimeSongPeakMap = (() => {
    const sp = {};
    for (const p of allPlays) {
      const k = songKey(p);
      if (!sp[k]) sp[k] = { count: 0, firstAchieved: p.date };
      sp[k].count++;
    }
    const lim = isFinite(chartSizeAllTime) ? chartSizeAllTime : undefined;
    const m = {};
    Object.entries(sp).sort(([, a], [, b]) => rankSort(a, b)).slice(0, lim)
      .forEach(([k], i) => { m[k] = i + 1; });
    return m;
  })();

  // Songs that made it into the chart (have a peak position)
  const chartSongs = allSongsSorted.filter(s => allTimeSongPeakMap[songKey(s)] !== undefined);
  const chartAlbums = allAlbumsSorted.filter(a => peaks.albumPeakMap[a.album + '|||' + artistName] !== undefined || peaks.albumPeakMap[a.album + '|||' + a.album] !== undefined);

  // Certifications count
  const goldSongs = allSongsSorted.filter(s => s.count >= CERT.song.gold).length;
  const platSongs = allSongsSorted.filter(s => s.count >= CERT.song.plat).length;
  const diamondSongs = allSongsSorted.filter(s => s.count >= CERT.song.diamond).length;
  const goldAlbums = allAlbumsSorted.filter(a => a.count >= CERT.album.gold).length;
  const platAlbums = allAlbumsSorted.filter(a => a.count >= CERT.album.plat).length;
  const diamondAlbums = allAlbumsSorted.filter(a => a.count >= CERT.album.diamond).length;

  // All-time / per-period chart peaks
  const artistPeak = peaks.artistPeakMap[artistName];
  const allTimeArtistRank = artistPeak ?? null;
  const bestSongPeak = chartSongs.length ? Math.min(...chartSongs.map(s => allTimeSongPeakMap[songKey(s)])) : null;
  const allTimeBestAlbumPeak = chartAlbums.length ? Math.min(...chartAlbums.map(a => {
    const k = Object.keys(peaks.albumPeakMap).find(pk => pk.startsWith(a.album + '|||'));
    return k ? peaks.albumPeakMap[k] : 999;
  })) : null;

  const weeklyArtistPeak = crW?.result?.artists[artistName]?.peak ?? null;
  const monthlyArtistPeak = crM?.result?.artists[artistName]?.peak ?? null;
  const yearlyArtistPeak = crY?.result?.artists[artistName]?.peak ?? null;

  // Per-chart-type song counts + best peaks
  const weeklySongsCharted = crW ? allSongsSorted.filter(s => crW.result.songs[songKey(s)]) : [];
  const weeklyBestSongPeak = weeklySongsCharted.length ? Math.min(...weeklySongsCharted.map(s => crW.result.songs[songKey(s)].peak)) : null;
  const monthlySongsCharted = crM ? allSongsSorted.filter(s => crM.result.songs[songKey(s)]) : [];
  const monthlyBestSongPeak = monthlySongsCharted.length ? Math.min(...monthlySongsCharted.map(s => crM.result.songs[songKey(s)].peak)) : null;
  const yearlySongsCharted = crY ? allSongsSorted.filter(s => crY.result.songs[songKey(s)]) : [];
  const yearlyBestSongPeak = yearlySongsCharted.length ? Math.min(...yearlySongsCharted.map(s => crY.result.songs[songKey(s)].peak)) : null;

  // Per-chart-type album counts + best peaks
  const _albumCrKey = (a, cr) => cr ? Object.keys(cr.result.albums).find(k => k.startsWith(a.album + '|||')) : null;
  const weeklyAlbumsCharted = crW ? allAlbumsSorted.filter(a => _albumCrKey(a, crW)) : [];
  const weeklyBestAlbumPeak = weeklyAlbumsCharted.length ? Math.min(...weeklyAlbumsCharted.map(a => { const k = _albumCrKey(a, crW); return k ? crW.result.albums[k].peak : 999; })) : null;
  const monthlyAlbumsCharted = crM ? allAlbumsSorted.filter(a => _albumCrKey(a, crM)) : [];
  const monthlyBestAlbumPeak = monthlyAlbumsCharted.length ? Math.min(...monthlyAlbumsCharted.map(a => { const k = _albumCrKey(a, crM); return k ? crM.result.albums[k].peak : 999; })) : null;
  const yearlyAlbumsCharted = crY ? allAlbumsSorted.filter(a => _albumCrKey(a, crY)) : [];
  const yearlyBestAlbumPeak = yearlyAlbumsCharted.length ? Math.min(...yearlyAlbumsCharted.map(a => { const k = _albumCrKey(a, crY); return k ? crY.result.albums[k].peak : 999; })) : null;

  // Populate modal
  document.getElementById('modalArtistName').textContent = artistName;
  document.getElementById('modalArtistSub').textContent =
    `Top ${isFinite(chartSizeAllTime) ? chartSizeAllTime : '∞'} ${t('modal_chart_profile')} · ${t('period_alltime')}`;

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

  // Additional stats for the expanded stats strip
  const firstPlayed = artistPlays.length ? artistPlays[artistPlays.length - 1].date : null;
  const lastPlayed = artistPlays.length ? artistPlays[0].date : null;
  const artistDaySet = new Set();
  const dayPlayCounts = {};
  for (const p of artistPlays) { const d = localDateStr(tzDate(p.date)); artistDaySet.add(d); dayPlayCounts[d] = (dayPlayCounts[d] || 0) + 1; }
  const calendarDays = artistDaySet.size;
  const peakPlaysInDay = calendarDays ? Math.max(...Object.values(dayPlayCounts)) : 0;
  const _sortedArtistDays = [...artistDaySet].sort();
  let longestStreak = _sortedArtistDays.length ? 1 : 0, _curArtistStreak = 1;
  for (let i = 1; i < _sortedArtistDays.length; i++) {
    const diff = Math.round((new Date(_sortedArtistDays[i]) - new Date(_sortedArtistDays[i - 1])) / 86400000);
    _curArtistStreak = diff === 1 ? _curArtistStreak + 1 : 1;
    if (_curArtistStreak > longestStreak) longestStreak = _curArtistStreak;
  }
  let peakConsecutivePlays = 0, _curConsec = 0;
  for (const p of allPlays) {
    if (p.artists.includes(artistName)) { _curConsec++; if (_curConsec > peakConsecutivePlays) peakConsecutivePlays = _curConsec; }
    else _curConsec = 0;
  }
  const avgPlaysPerSong = allSongsSorted.length ? Math.round(totalPlays / allSongsSorted.length) : 0;
  const topSong = allSongsSorted[0] || null;
  const topAlbum = allAlbumsSorted[0] || null;

  // Stats strip — row 1: totals + all-time rank + peaks + extra stats
  const peakCls = r => !r ? '' : r === 1 ? 'sv--gold' : r <= 3 ? 'sv--silver' : r <= 10 ? 'sv--bronze' : '';
  const modalStatsEl = document.getElementById('modalStats');
  modalStatsEl.innerHTML = `
    <div class="modal-stat"><div class="se">🎧</div><div class="sv" data-countup="${totalPlays}">${totalPlays.toLocaleString()}</div><div class="sl">${t('stat_total_plays')}</div></div>
    <div class="modal-stat"><div class="sv" style="font-size:0.9rem">${firstPlayed ? fmt(firstPlayed) : '—'}</div><div class="sl">${t('modal_first_played')}</div></div>
    <div class="modal-stat"><div class="sv" style="font-size:0.9rem">${lastPlayed ? fmt(lastPlayed) : '—'}</div><div class="sl">${t('modal_last_played')}</div></div>
    <div class="modal-stat"><div class="se">🎵</div><div class="sv" data-countup="${allSongsSorted.length}">${allSongsSorted.length}</div><div class="sl">${t('stat_unique_songs')}</div></div>
    <div class="modal-stat"><div class="se">💿</div><div class="sv" data-countup="${allAlbumsSorted.length}">${allAlbumsSorted.length}</div><div class="sl">Albums &amp; Singles</div></div>
    <div class="modal-stat"><div class="se">📅</div><div class="sv" data-countup="${calendarDays}">${calendarDays}</div><div class="sl">${t('modal_calendar_days_played')}</div></div>
    <div class="modal-stat modal-stat--gold"><div class="se">🏆</div><div class="sv">${allTimeArtistRank ? '#' + allTimeArtistRank : '—'}</div><div class="sl">Most Heard Artist<br>of All Time</div></div>
    <div class="modal-stat"><div class="se">📊</div><div class="sv" data-countup="${avgPlaysPerSong}">${avgPlaysPerSong.toLocaleString()}</div><div class="sl">${t('modal_avg_plays_per_song')}</div></div>
    <div class="modal-stat"><div class="se">🎤</div><div class="sv" style="font-size:0.72rem;line-height:1.3;word-break:break-word;overflow-wrap:break-word;">${topSong ? esc(topSong.title) : '—'}</div><div class="sl">${t('modal_most_played_song')}</div></div>
    <div class="modal-stat"><div class="se">💿</div><div class="sv" style="font-size:0.72rem;line-height:1.3;word-break:break-word;overflow-wrap:break-word;">${topAlbum ? esc(topAlbum.album) : '—'}</div><div class="sl">${t('modal_most_played_album')}</div></div>
    <div class="modal-stat"><div class="se">🔥</div><div class="sv" data-countup="${longestStreak}">${longestStreak}</div><div class="sl">${t('modal_listening_days_streak')}</div></div>
    <div class="modal-stat"><div class="se">📋</div><div class="sv">${weeklySongsCharted.length || '—'}</div><div class="sl">${t('modal_songs_in_weekly')}</div></div>
    <div class="modal-stat"><div class="se">⚡</div><div class="sv" data-countup="${peakPlaysInDay}">${peakPlaysInDay}</div><div class="sl">Peak Plays<br>in a Day</div></div>
    <div class="modal-stat"><div class="se">🎯</div><div class="sv" data-countup="${peakConsecutivePlays}">${peakConsecutivePlays}</div><div class="sl">Peak Plays<br>Streak</div></div>
  `;
  animateModalCountup(modalStatsEl);

  // Stats strip — row 2: artist chart peaks (larger display)
  const grandSlam = weeklyArtistPeak === 1 && monthlyArtistPeak === 1 && yearlyArtistPeak === 1;
  document.getElementById('modalGrandSlam').innerHTML = grandSlam
    ? '<div class="modal-grand-slam">✨ Grand Slam — #1 on Weekly, Monthly &amp; Yearly Charts ✨</div>'
    : '';
  document.getElementById('modalArtistPeaks').innerHTML = `
    <div class="modal-stat"><div class="se">📊</div><div class="sv ${peakCls(weeklyArtistPeak)}">${weeklyArtistPeak ? '#' + weeklyArtistPeak : '—'}</div><div class="sl">Weekly Artist Peak</div></div>
    <div class="modal-stat"><div class="se">🌙</div><div class="sv ${peakCls(monthlyArtistPeak)}">${monthlyArtistPeak ? '#' + monthlyArtistPeak : '—'}</div><div class="sl">Monthly Artist Peak</div></div>
    <div class="modal-stat"><div class="se">⭐</div><div class="sv ${peakCls(yearlyArtistPeak)}">${yearlyArtistPeak ? '#' + yearlyArtistPeak : '—'}</div><div class="sl">Yearly Artist Peak</div></div>
  `;

  // Records strip — chart appearance counts and #1 milestones from allChartRun
  const artistCrW = crW?.result.artists[artistName];
  const artistCrM = crM?.result.artists[artistName];
  const artistCrY = crY?.result.artists[artistName];
  const weeksAtNo1 = artistCrW?.entries.filter(e => e.rank === 1).length || 0;
  const monthsAtNo1 = artistCrM?.entries.filter(e => e.rank === 1).length || 0;
  const yearsAtNo1 = artistCrY?.entries.filter(e => e.rank === 1).length || 0;
  const weeklyApps = artistCrW?.entries.length || 0;
  const monthlyApps = artistCrM?.entries.length || 0;
  const _firstWkEntry = artistCrW?.entries.slice().sort((a, b) => a.periodKey < b.periodKey ? -1 : 1)[0] ?? null;
  const weeklyDebutRank = _firstWkEntry ? _firstWkEntry.rank : null;
  const recordsEl = document.getElementById('modalRecordsStrip');
  recordsEl.innerHTML = `
    <div class="modal-stat ${weeksAtNo1 > 0 ? 'modal-stat--gold' : ''}"><div class="se">🥇</div><div class="sv ${weeksAtNo1 > 0 ? 'sv--gold' : ''}" data-countup="${weeksAtNo1}">${weeksAtNo1}</div><div class="sl">Weeks at #1</div></div>
    <div class="modal-stat"><div class="se">🌙</div><div class="sv ${monthsAtNo1 > 0 ? 'sv--gold' : ''}" data-countup="${monthsAtNo1}">${monthsAtNo1}</div><div class="sl">Months at #1</div></div>
    <div class="modal-stat"><div class="se">⭐</div><div class="sv ${yearsAtNo1 > 0 ? 'sv--gold' : ''}" data-countup="${yearsAtNo1}">${yearsAtNo1}</div><div class="sl">Years at #1</div></div>
    <div class="modal-stat"><div class="se">📅</div><div class="sv" data-countup="${weeklyApps}">${weeklyApps}</div><div class="sl">Weekly Chart<br>Appearances</div></div>
    <div class="modal-stat"><div class="se">🗓️</div><div class="sv" data-countup="${monthlyApps}">${monthlyApps}</div><div class="sl">Monthly Chart<br>Appearances</div></div>
    ${weeklyDebutRank ? `<div class="modal-stat"><div class="se">🚀</div><div class="sv ${peakCls(weeklyDebutRank)}">#${weeklyDebutRank}</div><div class="sl">Weekly<br>Debut Rank</div></div>` : ''}
  `;
  animateModalCountup(recordsEl);

  // Grammy strip — render current cache; async-loads any missing years after modal opens
  _renderModalGrammyStrip(artistName);

  // Plays by month chart
  document.getElementById('modalArtistChart').innerHTML = buildArtistSparklineHTML(artistPlays);

  // Chart breakdown grid: songs + albums across all chart types
  const cbCell = (count, peak) => `<td class="modal-cb-cell"><div class="cv">${count > 0 ? count : '—'}</div>${count > 0 ? `<div class="cp">${peak ? 'Peak Rank #' + peak : '—'}</div>` : '<div class="cp"></div>'}</td>`;
  document.getElementById('modalChartBreakdown').innerHTML = `
    <table class="modal-cb-table">
      <thead><tr>
        <td class="modal-cb-empty"></td>
        <th class="modal-cb-th modal-cb-th--weekly">📊 Weekly</th>
        <th class="modal-cb-th modal-cb-th--monthly">🌙 Monthly</th>
        <th class="modal-cb-th modal-cb-th--yearly">⭐ Yearly</th>
        <th class="modal-cb-th modal-cb-th--alltime">🏆 All-Time</th>
      </tr></thead>
      <tbody>
        <tr>
          <td class="modal-cb-label modal-cb-label--songs">🎵 Songs</td>
          ${cbCell(weeklySongsCharted.length, weeklyBestSongPeak)}
          ${cbCell(monthlySongsCharted.length, monthlyBestSongPeak)}
          ${cbCell(yearlySongsCharted.length, yearlyBestSongPeak)}
          ${cbCell(chartSongs.length, bestSongPeak)}
        </tr>
        <tr>
          <td class="modal-cb-label modal-cb-label--albums">💿 Albums &amp; Singles</td>
          ${cbCell(weeklyAlbumsCharted.length, weeklyBestAlbumPeak)}
          ${cbCell(monthlyAlbumsCharted.length, monthlyBestAlbumPeak)}
          ${cbCell(yearlyAlbumsCharted.length, yearlyBestAlbumPeak)}
          ${cbCell(chartAlbums.length, allTimeBestAlbumPeak)}
        </tr>
      </tbody>
    </table>
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

  // Weekly #1 songs
  const weeklyNo1Songs = allSongsSorted.filter(s => allChartRun.week?.result.songs[songKey(s)]?.peak === 1);
  if (weeklyNo1Songs.length) {
    acc.push(accRow('🎵', `Has <strong style="color:var(--text)">${weeklyNo1Songs.length}</strong> #1 ${tUnit('songs', weeklyNo1Songs.length)} on the Weekly Songs chart`,
      weeklyNo1Songs.map(s => {
        const d = allChartRun.week.result.songs[songKey(s)];
        const peakEntry = d.entries.find(e => e.rank === 1);
        return { name: s.title + (s.album !== '—' ? ' · ' + s.album : ''), plays: peakEntry?.plays || s.count, date: peakEntry ? crPeriodLabel('week', peakEntry.periodKey) : '' };
      })));
  }
  // Monthly #1 songs
  const monthlyNo1Songs = allSongsSorted.filter(s => allChartRun.month?.result.songs[songKey(s)]?.peak === 1);
  if (monthlyNo1Songs.length) {
    acc.push(accRow('🎵', `Has <strong style="color:var(--text)">${monthlyNo1Songs.length}</strong> #1 ${tUnit('songs', monthlyNo1Songs.length)} on the Monthly Songs chart`,
      monthlyNo1Songs.map(s => {
        const d = allChartRun.month.result.songs[songKey(s)];
        const peakEntry = d.entries.find(e => e.rank === 1);
        return { name: s.title + (s.album !== '—' ? ' · ' + s.album : ''), plays: peakEntry?.plays || s.count, date: peakEntry ? crPeriodLabel('month', peakEntry.periodKey) : '' };
      })));
  }
  // New songs chart #1 — songs that debuted at #1 on the weekly chart
  const debutNo1Songs = allSongsSorted.filter(s => {
    const d = allChartRun.week?.result.songs[songKey(s)];
    return d && d.entries[0]?.rank === 1;
  });
  if (debutNo1Songs.length) {
    acc.push(accRow('🌟', `<strong style="color:var(--text)">${debutNo1Songs.length}</strong> ${tUnit('songs', debutNo1Songs.length)} debuted at #1 on the Weekly New Songs chart`,
      debutNo1Songs.map(s => {
        const d = allChartRun.week.result.songs[songKey(s)];
        return { name: s.title + (s.album !== '—' ? ' · ' + s.album : ''), plays: d.entries[0].plays, date: crPeriodLabel('week', d.entries[0].periodKey) };
      })));
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

  // ─── SONGS ON CHART: 4 collapsible sections ──────────────────────────────

  // Helper: collapsible section wrapper (starts collapsed)
  let _mcsId = 0;
  const mcsSection = (icon, title, count, noun, bodyHtml) => {
    const id = 'mcs-' + artistName.replace(/\W/g, '') + '-' + (++_mcsId);
    const countLabel = count + ' ' + (count === 1 ? noun.replace(/s$/, '') : noun);
    return `<div class="modal-chart-section">
      <div class="modal-chart-section-header" onclick="(function(){const b=document.getElementById('${id}-body');const t=document.getElementById('${id}-tog');const open=b.style.display!=='none';b.style.display=open?'none':'';t.textContent=open?'▶':'▼';})()" >
        <span class="mcs-tog" id="${id}-tog">▶</span>
        <span class="mcs-title">${icon} ${title}</span>
        <span class="mcs-count">${countLabel}</span>
      </div>
      <div class="modal-chart-section-body" id="${id}-body" style="display:none;">${bodyHtml}</div>
    </div>`;
  };

  // Helper: streaming history expand panel (heatmap + rawdata, lazy loaded)
  // crKey = URL-encoded key (for row id), rawKey = plain song key for data-crkey lookup
  const streamHistoryPanel = (crKey, rawKey, colspan) =>
    `<tr class="cr-row" id="${crKey}-sh"><td colspan="${colspan}"><div style="padding:0.5rem 0.5rem 0">
      <div class="cr-subsection"><div class="cr-subsection-header" onclick="toggleCrSubsection(this)"><span class="cr-subsection-toggle">▶</span><span class="cr-subsection-label">LISTENING HEATMAP</span></div><div class="cr-subsection-body" style="display:none;" data-crtype="songs" data-crkey="${esc(rawKey)}" data-crkind="heatmap"></div></div>
      <div class="cr-subsection"><div class="cr-subsection-header" onclick="toggleCrSubsection(this)"><span class="cr-subsection-toggle">▶</span><span class="cr-subsection-label">FULL STREAMING HISTORY</span></div><div class="cr-subsection-body" style="display:none;" data-crtype="songs" data-crkey="${esc(rawKey)}" data-crkind="rawdata"></div></div>
    </div></td></tr>`;

  // ── 1. All-time chart songs ───────────────────────────────────────────────
  const allTimeSongs = chartSongs;
  const allTimeSongsHTML = (() => {
    if (!allTimeSongs.length) return `<div class="mcs-empty">${t('modal_no_songs', { n: chartSizeAllTime })}</div>`;
    let rows = `<tr class="modal-table-header"><td></td><td>RANK</td><td>${t('th_song')}</td><td>FIRST STREAM</td><td>LAST STREAM</td><td>${t('th_plays')}</td></tr>`;
    allTimeSongs.forEach((s, i) => {
      const pk = allTimeSongPeakMap[songKey(s)];
      const sk = songKey(s);
      const ek = encodeURIComponent(sk);
      const rowId = ek + '-sh';
      rows += `<tr>
        <td><button class="cr-toggle-btn" title="Streaming History" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">🎵</button></td>
        <td class="modal-rank-col">${pk ? '#' + pk : '#' + (i + 1)}</td>
        <td><div class="song-title">${esc(s.title)}${certBadge(s.count, 'song')}</div><div class="song-album">${esc(s.album)}</div></td>
        <td class="modal-date-col">${rawFmtDate(s.firstPlayed)}</td>
        <td class="modal-date-col">${rawFmtDate(s.lastPlayed)}</td>
        <td class="modal-plays-col">${s.count} ${tUnit('plays', s.count)}</td>
      </tr>${streamHistoryPanel(ek, sk, 6)}`;
    });
    return `<table class="modal-table"><tbody>${rows}</tbody></table>`;
  })();

  // ── 2. Yearly chart songs ─────────────────────────────────────────────────
  const yearlySongsData = crY ? allSongsSorted
    .map(s => ({ ...s, key: songKey(s), cr: crY.result.songs[songKey(s)] }))
    .filter(s => s.cr).sort((a, b) => a.cr.peak - b.cr.peak) : [];
  const yearlySongsHTML = (() => {
    if (!yearlySongsData.length) return '<div class="mcs-empty">No songs on yearly charts.</div>';
    let rows = `<tr class="modal-table-header"><td></td><td>RANK</td><td>${t('th_song')}</td><td>BEST YEAR</td><td>DAYS</td><td>STREAK</td><td>PLAYS</td></tr>`;
    yearlySongsData.forEach((s, i) => {
      const { cr } = s;
      const peakEntry = cr.entries.find(e => e.rank === cr.peak) || cr.entries[0];
      const bestYear = peakEntry.periodKey;
      const daySet = crY.periodMap[bestYear]?.daySongs?.[s.key];
      const streak = daySet ? longestConsecutiveDays(daySet) : 0;
      const ek = encodeURIComponent(s.key);
      const rowId = 'modal-yr-song-' + i;
      rows += `<tr>
        <td><button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_song')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button></td>
        <td class="modal-rank-col">#${cr.peak}</td>
        <td><div class="song-title">${esc(s.title)}${certBadge(s.count, 'song')}</div><div class="song-album">${esc(s.album)}</div></td>
        <td><a class="modal-period-link" href="javascript:void(0)" onclick="event.stopPropagation();goToPeriodFromArtistModal('year','${bestYear}')">${bestYear}</a></td>
        <td class="modal-date-col">${peakEntry.days}d</td>
        <td class="modal-date-col">${streak}d</td>
        <td class="modal-plays-col">${peakEntry.plays}</td>
      </tr>
      <tr class="cr-row" id="${rowId}"><td colspan="7"><div class="cr-panel" data-crtype="songs" data-crkey="${ek}"><div class="cr-stats">${crStats('songs', s.key, 'year', crY)}</div>${crBoxesHTML('songs', s.key, crY, null, 'year')}</div></td></tr>`;
    });
    return `<table class="modal-table"><tbody>${rows}</tbody></table>`;
  })();

  // ── 3. Monthly chart songs ────────────────────────────────────────────────
  const monthlySongsData = crM ? allSongsSorted
    .map(s => ({ ...s, key: songKey(s), cr: crM.result.songs[songKey(s)] }))
    .filter(s => s.cr).sort((a, b) => a.cr.peak - b.cr.peak) : [];
  const monthlySongsHTML = (() => {
    if (!monthlySongsData.length) return '<div class="mcs-empty">No songs on monthly charts.</div>';
    let rows = `<tr class="modal-table-header"><td></td><td>RANK</td><td>${t('th_song')}</td><td>BEST MONTH</td><td>DAYS</td><td>STREAK</td><td>PLAYS</td></tr>`;
    monthlySongsData.forEach((s, i) => {
      const { cr } = s;
      const peakEntry = cr.entries.find(e => e.rank === cr.peak) || cr.entries[0];
      const bestMonth = peakEntry.periodKey;
      const daySet = crM.periodMap[bestMonth]?.daySongs?.[s.key];
      const streak = daySet ? longestConsecutiveDays(daySet) : 0;
      const ek = encodeURIComponent(s.key);
      const rowId = 'modal-mo-song-' + i;
      rows += `<tr>
        <td><button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_song')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button></td>
        <td class="modal-rank-col">#${cr.peak}</td>
        <td><div class="song-title">${esc(s.title)}${certBadge(s.count, 'song')}</div><div class="song-album">${esc(s.album)}</div></td>
        <td><a class="modal-period-link" href="javascript:void(0)" onclick="event.stopPropagation();goToPeriodFromArtistModal('month','${bestMonth}')">${crPeriodLabel('month', bestMonth)}</a></td>
        <td class="modal-date-col">${peakEntry.days}d</td>
        <td class="modal-date-col">${streak}d</td>
        <td class="modal-plays-col">${peakEntry.plays}</td>
      </tr>
      <tr class="cr-row" id="${rowId}"><td colspan="7"><div class="cr-panel" data-crtype="songs" data-crkey="${ek}"><div class="cr-stats">${crStats('songs', s.key, 'month', crM)}</div>${crBoxesHTML('songs', s.key, crM, null, 'month')}</div></td></tr>`;
    });
    return `<table class="modal-table"><tbody>${rows}</tbody></table>`;
  })();

  // ── 4. Weekly chart songs ─────────────────────────────────────────────────
  const weeklySongsData = crW ? allSongsSorted
    .map(s => ({ ...s, key: songKey(s), cr: crW.result.songs[songKey(s)] }))
    .filter(s => s.cr).sort((a, b) => a.cr.peak - b.cr.peak) : [];
  const weeklySongsHTML = (() => {
    if (!weeklySongsData.length) return '<div class="mcs-empty">No songs on weekly charts.</div>';
    let rows = `<tr class="modal-table-header"><td></td><td>RANK</td><td>${t('th_song')}</td><td>BEST WEEK</td><td>DAYS</td><td>CONSECUTIVE PLAYS</td><td>PLAYS</td></tr>`;
    weeklySongsData.forEach((s, i) => {
      const { cr } = s;
      const peakEntry = cr.entries.find(e => e.rank === cr.peak) || cr.entries[0];
      const bestWeek = peakEntry.periodKey;
      const consec = maxConsecutivePlaysWeek(s.key, bestWeek);
      const ek = encodeURIComponent(s.key);
      const rowId = 'modal-wk-song-' + i;
      rows += `<tr>
        <td><button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_song')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button></td>
        <td class="modal-rank-col">#${cr.peak}</td>
        <td><div class="song-title">${esc(s.title)}${certBadge(s.count, 'song')}</div><div class="song-album">${esc(s.album)}</div></td>
        <td><a class="modal-period-link" href="javascript:void(0)" onclick="event.stopPropagation();goToPeriodFromArtistModal('week','${bestWeek}')">${crPeriodLabel('week', bestWeek)}</a></td>
        <td class="modal-date-col">${peakEntry.days}d</td>
        <td class="modal-date-col">${consec > 1 ? consec + '×' : '—'}</td>
        <td class="modal-plays-col">${peakEntry.plays}</td>
      </tr>
      <tr class="cr-row" id="${rowId}"><td colspan="7"><div class="cr-panel" data-crtype="songs" data-crkey="${ek}"><div class="cr-stats">${crStats('songs', s.key, 'week', crW)}</div>${crBoxesHTML('songs', s.key, crW, null, 'week')}</div></td></tr>`;
    });
    return `<table class="modal-table"><tbody>${rows}</tbody></table>`;
  })();

  document.getElementById('modalSongs').innerHTML =
    mcsSection('♦', 'All-Time Chart', allTimeSongs.length, 'songs', allTimeSongsHTML) +
    mcsSection('📅', 'Yearly Charts', yearlySongsData.length, 'songs', yearlySongsHTML) +
    mcsSection('📆', 'Monthly Charts', monthlySongsData.length, 'songs', monthlySongsHTML) +
    mcsSection('📇', 'Weekly Charts', weeklySongsData.length, 'songs', weeklySongsHTML);

  // ─── ALBUMS ON CHART: 4 collapsible sections ──────────────────────────────

  // Helper: streaming history for albums
  const albumStreamPanel = (ek, colspan) =>
    `<tr class="cr-row" id="${ek}-ash"><td colspan="${colspan}"><div style="padding:0.5rem 0.5rem 0">
      <div class="cr-subsection"><div class="cr-subsection-header" onclick="toggleCrSubsection(this)"><span class="cr-subsection-toggle">▶</span><span class="cr-subsection-label">LISTENING HEATMAP</span></div><div class="cr-subsection-body" style="display:none;" data-crtype="albums" data-crkey="${ek}" data-crkind="heatmap"></div></div>
      <div class="cr-subsection"><div class="cr-subsection-header" onclick="toggleCrSubsection(this)"><span class="cr-subsection-toggle">▶</span><span class="cr-subsection-label">FULL STREAMING HISTORY</span></div><div class="cr-subsection-body" style="display:none;" data-crtype="albums" data-crkey="${ek}" data-crkind="rawdata"></div></div>
    </div></td></tr>`;

  // Helper: find album chart run key
  const findAlbumCrKey = (a, crData) => crData ? Object.keys(crData.result.albums).find(k => k.startsWith(a.album + '|||')) : null;

  // ── 1. All-time chart albums ──────────────────────────────────────────────
  const allTimeAlbums = chartAlbums;
  const allTimeAlbumsHTML = (() => {
    if (!allTimeAlbums.length) return '<div class="mcs-empty">No albums on all-time chart.</div>';
    let rows = `<tr class="modal-table-header"><td></td><td>RANK</td><td>${t('th_album')}</td><td>${t('th_plays')}</td></tr>`;
    allTimeAlbums.forEach((a, i) => {
      const pkKey = Object.keys(peaks.albumPeakMap).find(k => k.startsWith(a.album + '|||'));
      const pk = pkKey ? peaks.albumPeakMap[pkKey] : null;
      const crKeyRaw = findAlbumCrKey(a, crY || crM || crW);
      const ek = crKeyRaw ? encodeURIComponent(crKeyRaw) : encodeURIComponent(a.album + '|||' + artistName);
      const rowId = ek + '-ash';
      rows += `<tr>
        <td><button class="cr-toggle-btn" title="Streaming History" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">🎵</button></td>
        <td class="modal-rank-col">${pk ? '#' + pk : '—'}</td>
        <td><div class="song-title">${esc(a.album)}${certBadge(a.count, 'album')}</div><div class="song-album">${a.tracks.size} ${tUnit('tracks', a.tracks.size)}</div></td>
        <td class="modal-plays-col">${a.count} ${tUnit('plays', a.count)}</td>
      </tr>${albumStreamPanel(ek, 4)}`;
    });
    return `<table class="modal-table"><tbody>${rows}</tbody></table>`;
  })();

  // ── 2. Yearly chart albums ────────────────────────────────────────────────
  const yearlyAlbumsData = crY ? allAlbumsSorted.map(a => {
    const crKeyRaw = findAlbumCrKey(a, crY);
    return { ...a, crKeyRaw, cr: crKeyRaw ? crY.result.albums[crKeyRaw] : null };
  }).filter(a => a.cr).sort((a, b) => a.cr.peak - b.cr.peak) : [];
  const yearlyAlbumsHTML = (() => {
    if (!yearlyAlbumsData.length) return '<div class="mcs-empty">No albums on yearly charts.</div>';
    let rows = `<tr class="modal-table-header"><td></td><td>RANK</td><td>${t('th_album')}</td><td>BEST YEAR</td><td>DAYS</td><td>STREAK</td><td>PLAYS</td></tr>`;
    yearlyAlbumsData.forEach((a, i) => {
      const { cr, crKeyRaw } = a;
      const peakEntry = cr.entries.find(e => e.rank === cr.peak) || cr.entries[0];
      const bestYear = peakEntry.periodKey;
      const daySet = crY.periodMap[bestYear]?.dayAlbums?.[crKeyRaw];
      const streak = daySet ? longestConsecutiveDays(daySet) : 0;
      const ek = encodeURIComponent(crKeyRaw);
      const rowId = 'modal-yr-album-' + i;
      rows += `<tr>
        <td><button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_album')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button></td>
        <td class="modal-rank-col">#${cr.peak}</td>
        <td><div class="song-title">${esc(a.album)}${certBadge(a.count, 'album')}</div><div class="song-album">${a.tracks.size} ${tUnit('tracks', a.tracks.size)}</div></td>
        <td><a class="modal-period-link" href="javascript:void(0)" onclick="event.stopPropagation();goToPeriodFromArtistModal('year','${bestYear}')">${bestYear}</a></td>
        <td class="modal-date-col">${peakEntry.days}d</td>
        <td class="modal-date-col">${streak}d</td>
        <td class="modal-plays-col">${peakEntry.plays}</td>
      </tr>
      <tr class="cr-row" id="${rowId}"><td colspan="7"><div class="cr-panel" data-crtype="albums" data-crkey="${ek}"><div class="cr-stats">${crStats('albums', crKeyRaw, 'year', crY)}</div>${crBoxesHTML('albums', crKeyRaw, crY, null, 'year')}</div></td></tr>`;
    });
    return `<table class="modal-table"><tbody>${rows}</tbody></table>`;
  })();

  // ── 3. Monthly chart albums ───────────────────────────────────────────────
  const monthlyAlbumsData = crM ? allAlbumsSorted.map(a => {
    const crKeyRaw = findAlbumCrKey(a, crM);
    return { ...a, crKeyRaw, cr: crKeyRaw ? crM.result.albums[crKeyRaw] : null };
  }).filter(a => a.cr).sort((a, b) => a.cr.peak - b.cr.peak) : [];
  const monthlyAlbumsHTML = (() => {
    if (!monthlyAlbumsData.length) return '<div class="mcs-empty">No albums on monthly charts.</div>';
    let rows = `<tr class="modal-table-header"><td></td><td>RANK</td><td>${t('th_album')}</td><td>BEST MONTH</td><td>DAYS</td><td>STREAK</td><td>PLAYS</td></tr>`;
    monthlyAlbumsData.forEach((a, i) => {
      const { cr, crKeyRaw } = a;
      const peakEntry = cr.entries.find(e => e.rank === cr.peak) || cr.entries[0];
      const bestMonth = peakEntry.periodKey;
      const daySet = crM.periodMap[bestMonth]?.dayAlbums?.[crKeyRaw];
      const streak = daySet ? longestConsecutiveDays(daySet) : 0;
      const ek = encodeURIComponent(crKeyRaw);
      const rowId = 'modal-mo-album-' + i;
      rows += `<tr>
        <td><button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_album')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button></td>
        <td class="modal-rank-col">#${cr.peak}</td>
        <td><div class="song-title">${esc(a.album)}${certBadge(a.count, 'album')}</div><div class="song-album">${a.tracks.size} ${tUnit('tracks', a.tracks.size)}</div></td>
        <td><a class="modal-period-link" href="javascript:void(0)" onclick="event.stopPropagation();goToPeriodFromArtistModal('month','${bestMonth}')">${crPeriodLabel('month', bestMonth)}</a></td>
        <td class="modal-date-col">${peakEntry.days}d</td>
        <td class="modal-date-col">${streak}d</td>
        <td class="modal-plays-col">${peakEntry.plays}</td>
      </tr>
      <tr class="cr-row" id="${rowId}"><td colspan="7"><div class="cr-panel" data-crtype="albums" data-crkey="${ek}"><div class="cr-stats">${crStats('albums', crKeyRaw, 'month', crM)}</div>${crBoxesHTML('albums', crKeyRaw, crM, null, 'month')}</div></td></tr>`;
    });
    return `<table class="modal-table"><tbody>${rows}</tbody></table>`;
  })();

  // ── 4. Weekly chart albums ────────────────────────────────────────────────
  const weeklyAlbumsData = crW ? allAlbumsSorted.map(a => {
    const crKeyRaw = findAlbumCrKey(a, crW);
    return { ...a, crKeyRaw, cr: crKeyRaw ? crW.result.albums[crKeyRaw] : null };
  }).filter(a => a.cr).sort((a, b) => a.cr.peak - b.cr.peak) : [];
  const weeklyAlbumsHTML = (() => {
    if (!weeklyAlbumsData.length) return '<div class="mcs-empty">No albums on weekly charts.</div>';
    let rows = `<tr class="modal-table-header"><td></td><td>RANK</td><td>${t('th_album')}</td><td>BEST WEEK</td><td>DAYS</td><td>CONSECUTIVE PLAYS</td><td>PLAYS</td></tr>`;
    weeklyAlbumsData.forEach((a, i) => {
      const { cr, crKeyRaw } = a;
      const peakEntry = cr.entries.find(e => e.rank === cr.peak) || cr.entries[0];
      const bestWeek = peakEntry.periodKey;
      const consec = maxConsecutivePlaysWeekAlbum(crKeyRaw, bestWeek);
      const ek = encodeURIComponent(crKeyRaw);
      const rowId = 'modal-wk-album-' + i;
      rows += `<tr>
        <td><button class="cr-toggle-btn" title="${t('tooltip_cr_toggle_btn_album')}" onclick="event.stopPropagation();toggleChartRun(this,'${rowId}')">📊</button></td>
        <td class="modal-rank-col">#${cr.peak}</td>
        <td><div class="song-title">${esc(a.album)}${certBadge(a.count, 'album')}</div><div class="song-album">${a.tracks.size} ${tUnit('tracks', a.tracks.size)}</div></td>
        <td><a class="modal-period-link" href="javascript:void(0)" onclick="event.stopPropagation();goToPeriodFromArtistModal('week','${bestWeek}')">${crPeriodLabel('week', bestWeek)}</a></td>
        <td class="modal-date-col">${peakEntry.days}d</td>
        <td class="modal-date-col">${consec > 1 ? consec + '×' : '—'}</td>
        <td class="modal-plays-col">${peakEntry.plays}</td>
      </tr>
      <tr class="cr-row" id="${rowId}"><td colspan="7"><div class="cr-panel" data-crtype="albums" data-crkey="${ek}"><div class="cr-stats">${crStats('albums', crKeyRaw, 'week', crW)}</div>${crBoxesHTML('albums', crKeyRaw, crW, null, 'week')}</div></td></tr>`;
    });
    return `<table class="modal-table"><tbody>${rows}</tbody></table>`;
  })();

  document.getElementById('modalAlbums').innerHTML =
    mcsSection('◈', 'All-Time Chart', allTimeAlbums.length, 'albums', allTimeAlbumsHTML) +
    mcsSection('📅', 'Yearly Charts', yearlyAlbumsData.length, 'albums', yearlyAlbumsHTML) +
    mcsSection('📆', 'Monthly Charts', monthlyAlbumsData.length, 'albums', monthlyAlbumsHTML) +
    mcsSection('📇', 'Weekly Charts', weeklyAlbumsData.length, 'albums', weeklyAlbumsHTML);

  modal.classList.add('open');
  modal.scrollTop = 0;

  // Load any awards years not yet in cache, then refresh Grammy strip
  _awardsEnsureAllYearsLoaded().then(() => {
    if (modal.classList.contains('open') && document.getElementById('modalArtistName').textContent === artistName)
      _renderModalGrammyStrip(artistName);
  });
}

function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function toggleModalGrammyDetail(btn) {
  const list = btn.nextElementSibling;
  const open = list.style.display !== 'none';
  list.style.display = open ? 'none' : '';
  const n = btn.dataset.count;
  btn.textContent = open ? `▾ Show all ${n} categor${n == 1 ? 'y' : 'ies'}` : '▴ Hide categories';
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
    if (window.getSelection && window.getSelection().toString().length > 0) return;
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
  _albCurrentTrackSort = 'plays';
  ensureAllChartRun();

  const [albumName, artistName] = albumKey.split('|||');
  const albumPlays = allPlays.filter(p => (p.album + '|||' + albumArtist(p)) === albumKey);
  const totalPlays = albumPlays.length;
  const ek = encodeURIComponent(albumKey);

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

  // All-time peaks
  const allTimePeaks = buildAllTimePeaks();
  const allTimeAlbumRank = allTimePeaks.albumPeakMap[albumKey];
  const allTimeSPM = allTimePeaks.songPeakMap;

  // Per-period chart run data (always use full-history runs)
  const crY = allChartRun.year, crM = allChartRun.month, crW = allChartRun.week;
  const albumCrY = crY?.result?.albums?.[albumKey];
  const albumCrM = crM?.result?.albums?.[albumKey];
  const albumCrW = crW?.result?.albums?.[albumKey];

  const weeklyAlbumPeak = albumCrW?.peak ?? null;
  const monthlyAlbumPeak = albumCrM?.peak ?? null;
  const yearlyAlbumPeak = albumCrY?.peak ?? null;

  // Calendar days played + longest consecutive day streak
  const daySet = new Set();
  for (const p of albumPlays) { const d = tzDate(p.date); daySet.add(localDateStr(d)); }
  const calendarDays = daySet.size;
  const _sortedDays = [...daySet].sort();
  let longestStreak = _sortedDays.length ? 1 : 0, _curStreak = 1;
  for (let i = 1; i < _sortedDays.length; i++) {
    const diff = Math.round((new Date(_sortedDays[i]) - new Date(_sortedDays[i - 1])) / 86400000);
    _curStreak = diff === 1 ? _curStreak + 1 : 1;
    if (_curStreak > longestStreak) longestStreak = _curStreak;
  }

  // Tracks charted per period
  const chartTracksAllTime = allTracksSorted.filter(s => allTimeSPM[songKey(s)] !== undefined);
  const chartTracksWeekly  = crW ? allTracksSorted.filter(s => crW.result.songs[songKey(s)]) : [];
  const chartTracksMonthly = crM ? allTracksSorted.filter(s => crM.result.songs[songKey(s)]) : [];
  const chartTracksYearly  = crY ? allTracksSorted.filter(s => crY.result.songs[songKey(s)]) : [];

  // Best track peaks per period
  const bestTrackPeakAllTime  = chartTracksAllTime.length  ? Math.min(...chartTracksAllTime.map(s => allTimeSPM[songKey(s)])) : null;
  const bestTrackPeakWeekly   = chartTracksWeekly.length   ? Math.min(...chartTracksWeekly.map(s => crW.result.songs[songKey(s)].peak)) : null;
  const bestTrackPeakMonthly  = chartTracksMonthly.length  ? Math.min(...chartTracksMonthly.map(s => crM.result.songs[songKey(s)].peak)) : null;
  const bestTrackPeakYearly   = chartTracksYearly.length   ? Math.min(...chartTracksYearly.map(s => crY.result.songs[songKey(s)].peak)) : null;

  // Avg plays per track + next cert milestone
  const avgPlaysPerTrack = allTracksSorted.length ? Math.round(totalPlays / allTracksSorted.length) : 0;
  let nextCert;
  if (totalPlays >= CERT.album.diamond) {
    const nextMult = Math.floor(totalPlays / CERT.album.diamond) + 1;
    nextCert = [nextMult * CERT.album.diamond, diamondMultiLabel(nextMult).label];
  } else {
    nextCert = [[CERT.album.gold, 'Gold'], [CERT.album.plat, 'Platinum'], [CERT.album.diamond, 'Diamond']].find(([thr]) => totalPlays < thr);
  }

  const peakCls = r => !r ? '' : r === 1 ? 'sv--gold' : r <= 3 ? 'sv--silver' : r <= 10 ? 'sv--bronze' : '';

  // ── HEADER ────────────────────────────────────────────────────────────────
  document.getElementById('albumModalName').textContent = albumName;
  document.getElementById('albumModalSub').innerHTML =
    `Album by <a class="modal-artist-link" href="javascript:void(0)" onclick="albumModal.classList.remove('open');setTimeout(()=>openArtistModal(${esc(JSON.stringify(artistName))}),50)">${esc(artistName)}</a> · ${t('modal_chart_profile')}`;

  // ── IMAGE ─────────────────────────────────────────────────────────────────
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

  // ── STATS STRIP ROW 1: core totals + all-time hero ───────────────────────
  document.getElementById('albumModalStats').innerHTML = `
    <div class="modal-stat"><div class="se">🎧</div><div class="sv">${totalPlays.toLocaleString()}</div><div class="sl">${t('stat_total_plays')}</div></div>
    <div class="modal-stat"><div class="sv" style="font-size:0.9rem">${firstPlayed ? fmt(firstPlayed) : '—'}</div><div class="sl">${t('modal_first_played')}</div></div>
    <div class="modal-stat"><div class="sv" style="font-size:0.9rem">${lastPlayed ? fmt(lastPlayed) : '—'}</div><div class="sl">${t('modal_last_played')}</div></div>
    <div class="modal-stat"><div class="se">🎵</div><div class="sv">${allTracksSorted.length}</div><div class="sl">${t('modal_tracks')}</div></div>
    <div class="modal-stat"><div class="se">📅</div><div class="sv">${calendarDays}</div><div class="sl">${t('modal_calendar_days_played')}</div></div>
    <div class="modal-stat"><div class="se">📊</div><div class="sv">${avgPlaysPerTrack.toLocaleString()}</div><div class="sl">${t('modal_avg_plays_per_track')}</div></div>
    <div class="modal-stat modal-stat--gold"><div class="se">🏆</div><div class="sv">${allTimeAlbumRank ? '#' + allTimeAlbumRank : '—'}</div><div class="sl">${t('modal_most_heard_album')}</div></div>
    <div class="modal-stat"><div class="se">📊</div><div class="sv ${peakCls(weeklyAlbumPeak)}">${weeklyAlbumPeak ? '#' + weeklyAlbumPeak : '—'}</div><div class="sl">${t('modal_weekly_peak_tile')}</div></div>
    <div class="modal-stat"><div class="se">🌙</div><div class="sv ${peakCls(monthlyAlbumPeak)}">${monthlyAlbumPeak ? '#' + monthlyAlbumPeak : '—'}</div><div class="sl">${t('modal_monthly_peak_tile')}</div></div>
    <div class="modal-stat"><div class="se">⭐</div><div class="sv ${peakCls(yearlyAlbumPeak)}">${yearlyAlbumPeak ? '#' + yearlyAlbumPeak : '—'}</div><div class="sl">${t('modal_yearly_peak_tile')}</div></div>
    <div class="modal-stat"><div class="se">🎤</div><div class="sv" style="font-size:0.72rem;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%">${allTracksSorted.length ? esc(allTracksSorted[0].title) : '—'}</div><div class="sl">${t('modal_top_track')}</div></div>
    <div class="modal-stat"><div class="se">🔥</div><div class="sv">${longestStreak}</div><div class="sl">${t('modal_day_streak')}</div></div>
    <div class="modal-stat"><div class="se">📋</div><div class="sv">${chartTracksWeekly.length || '—'}</div><div class="sl">${t('modal_tracks_in_weekly')}</div></div>
    ${nextCert ? `<div class="modal-stat"><div class="se">🎯</div><div class="sv">${(nextCert[0] - totalPlays).toLocaleString()}</div><div class="sl">${t('modal_plays_to_cert', { cert: nextCert[1] })}</div></div>` : ''}
  `;

  // ── GRAND SLAM BANNER ─────────────────────────────────────────────────────
  const grandSlam = weeklyAlbumPeak === 1 && monthlyAlbumPeak === 1 && yearlyAlbumPeak === 1;
  document.getElementById('albumModalGrandSlam').innerHTML = grandSlam
    ? `<div class="modal-grand-slam">✨ ${t('modal_grand_slam')} ✨</div>` : '';

  // ── STATS STRIP ROW 2: period peaks ──────────────────────────────────────
  document.getElementById('albumModalPeaks').innerHTML = `
    <div class="modal-stat"><div class="se">📊</div><div class="sv ${peakCls(weeklyAlbumPeak)}">${weeklyAlbumPeak ? '#' + weeklyAlbumPeak : '—'}</div><div class="sl">${t('modal_weekly_chart_peak')}</div></div>
    <div class="modal-stat"><div class="se">🌙</div><div class="sv ${peakCls(monthlyAlbumPeak)}">${monthlyAlbumPeak ? '#' + monthlyAlbumPeak : '—'}</div><div class="sl">${t('modal_monthly_chart_peak')}</div></div>
    <div class="modal-stat"><div class="se">⭐</div><div class="sv ${peakCls(yearlyAlbumPeak)}">${yearlyAlbumPeak ? '#' + yearlyAlbumPeak : '—'}</div><div class="sl">${t('modal_yearly_chart_peak')}</div></div>
  `;

  // ── SPARKLINE + CHART BREAKDOWN GRID ─────────────────────────────────────
  const cbCell = (count, peak) => `<td class="modal-cb-cell"><div class="cv">${count > 0 ? count : '—'}</div>${count > 0 ? `<div class="cp">${peak ? t('modal_best_peak', { n: peak }) : '—'}</div>` : '<div class="cp"></div>'}</td>`;
  document.getElementById('albumModalBreakdown').innerHTML =
    buildAlbumSparklineHTML(albumPlays) +
    `<div class="modal-chart-breakdown"><table class="modal-cb-table">
      <thead><tr>
        <td class="modal-cb-empty"></td>
        <th class="modal-cb-th modal-cb-th--weekly">${t('modal_cb_weekly')}</th>
        <th class="modal-cb-th modal-cb-th--monthly">${t('modal_cb_monthly')}</th>
        <th class="modal-cb-th modal-cb-th--yearly">${t('modal_cb_yearly')}</th>
        <th class="modal-cb-th modal-cb-th--alltime">${t('modal_cb_alltime')}</th>
      </tr></thead>
      <tbody><tr>
        <td class="modal-cb-label modal-cb-label--tracks">${t('modal_tracks_charted_row')}</td>
        ${cbCell(chartTracksWeekly.length, bestTrackPeakWeekly)}
        ${cbCell(chartTracksMonthly.length, bestTrackPeakMonthly)}
        ${cbCell(chartTracksYearly.length, bestTrackPeakYearly)}
        ${cbCell(chartTracksAllTime.length, bestTrackPeakAllTime)}
      </tr></tbody>
    </table></div>`;

  // ── ACCOMPLISHMENTS ───────────────────────────────────────────────────────
  let albAccId = 0;
  const albAccRow = (icon, label, detailRows) => {
    const id = 'alb-acc-' + (albAccId++);
    const detail = detailRows.length
      ? detailRows.map(r => {
          const navAttr = r.weekOffset !== undefined
            ? ` onclick="goToWeek(${r.weekOffset});albumModal.classList.remove('open')" style="cursor:pointer"`
            : r.period ? ` onclick="goToPeriodFromAlbumModal('${r.period}','${r.periodKey}')" style="cursor:pointer"` : '';
          const viewTag = (r.weekOffset !== undefined || r.period)
            ? `<span style="color:var(--accent);font-size:0.6rem;flex-shrink:0;margin-left:0.5rem;letter-spacing:0.06em;">→ VIEW</span>` : '';
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

  // All-time rank
  if (allTimeAlbumRank) acc.push(albAccRow('🏆', t('alb_acc_most_heard', { rank: ordinalSuffix(allTimeAlbumRank), n: allTimeAlbumRank }), []));

  // Weekly #1 / top 5 / top 10
  if (albumCrW) {
    const wNo1 = albumCrW.entries.filter(e => e.rank === 1);
    if (wNo1.length) acc.push(albAccRow('🥇', t('alb_acc_no1_weekly', { n: wNo1.length, unit: tUnit('cr_week', wNo1.length) }),
      wNo1.map(e => ({ name: crPeriodLabel('week', e.periodKey), plays: e.plays, weekOffset: weekOffset(new Date(e.periodKey + 'T00:00:00')) }))));
    const wTop5 = albumCrW.entries.filter(e => e.rank > 1 && e.rank <= 5);
    if (wTop5.length) acc.push(albAccRow('🔝', t('alb_acc_top5_weekly', { n: wTop5.length, unit: tUnit('cr_week', wTop5.length) }),
      wTop5.map(e => ({ name: `#${e.rank} · ${crPeriodLabel('week', e.periodKey)}`, plays: e.plays, weekOffset: weekOffset(new Date(e.periodKey + 'T00:00:00')) }))));
    const wTop10 = albumCrW.entries.filter(e => e.rank > 5 && e.rank <= 10);
    if (wTop10.length) acc.push(albAccRow('📊', t('alb_acc_top10_weekly', { n: wTop10.length, unit: tUnit('cr_week', wTop10.length) }),
      wTop10.map(e => ({ name: `#${e.rank} · ${crPeriodLabel('week', e.periodKey)}`, plays: e.plays, weekOffset: weekOffset(new Date(e.periodKey + 'T00:00:00')) }))));
  }

  // Monthly #1 / top 5 / top 10
  if (albumCrM) {
    const mNo1 = albumCrM.entries.filter(e => e.rank === 1);
    if (mNo1.length) acc.push(albAccRow('🥇', t('alb_acc_no1_monthly', { n: mNo1.length, unit: tUnit('months', mNo1.length) }),
      mNo1.map(e => ({ name: crPeriodLabel('month', e.periodKey), plays: e.plays, period: 'month', periodKey: e.periodKey }))));
    const mTop5 = albumCrM.entries.filter(e => e.rank > 1 && e.rank <= 5);
    if (mTop5.length) acc.push(albAccRow('🔝', t('alb_acc_top5_monthly', { n: mTop5.length, unit: tUnit('months', mTop5.length) }),
      mTop5.map(e => ({ name: `#${e.rank} · ${crPeriodLabel('month', e.periodKey)}`, plays: e.plays, period: 'month', periodKey: e.periodKey }))));
    const mTop10 = albumCrM.entries.filter(e => e.rank > 5 && e.rank <= 10);
    if (mTop10.length) acc.push(albAccRow('📆', t('alb_acc_top10_monthly', { n: mTop10.length, unit: tUnit('months', mTop10.length) }),
      mTop10.map(e => ({ name: `#${e.rank} · ${crPeriodLabel('month', e.periodKey)}`, plays: e.plays, period: 'month', periodKey: e.periodKey }))));
  }

  // Yearly #1 / top 5 / top 10
  if (albumCrY) {
    const yNo1 = albumCrY.entries.filter(e => e.rank === 1);
    if (yNo1.length) acc.push(albAccRow('🥇', t('alb_acc_no1_yearly', { n: yNo1.length, unit: tUnit('years', yNo1.length) }),
      yNo1.map(e => ({ name: e.periodKey, plays: e.plays, period: 'year', periodKey: e.periodKey }))));
    const yTop5 = albumCrY.entries.filter(e => e.rank > 1 && e.rank <= 5);
    if (yTop5.length) acc.push(albAccRow('🔝', t('alb_acc_top5_yearly', { n: yTop5.length, unit: tUnit('years', yTop5.length) }),
      yTop5.map(e => ({ name: `#${e.rank} · ${e.periodKey}`, plays: e.plays, period: 'year', periodKey: e.periodKey }))));
    const yTop10 = albumCrY.entries.filter(e => e.rank > 5 && e.rank <= 10);
    if (yTop10.length) acc.push(albAccRow('⭐', t('alb_acc_top10_yearly', { n: yTop10.length, unit: tUnit('years', yTop10.length) }),
      yTop10.map(e => ({ name: `#${e.rank} · ${e.periodKey}`, plays: e.plays, period: 'year', periodKey: e.periodKey }))));
  }

  // Best track peak (all-time #1 tracks)
  if (bestTrackPeakAllTime === 1) {
    const no1tracks = chartTracksAllTime.filter(s => allTimeSPM[songKey(s)] === 1);
    acc.push(albAccRow('🎵', t('acc_no1_tracks', { n: no1tracks.length, unit: tUnit('tracks', no1tracks.length) }),
      no1tracks.map(s => ({ name: s.title, plays: s.count }))));
  }

  // Album certification
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

  // Track certifications (multi-level diamond)
  const maxTrackMult = allTracksSorted.reduce((m, s) => Math.max(m, Math.floor(s.count / CERT.song.diamond)), 0);
  for (let mult = maxTrackMult; mult >= 1; mult--) {
    const items = allTracksSorted.filter(s => Math.floor(s.count / CERT.song.diamond) === mult);
    if (!items.length) continue;
    const { icon } = diamondMultiLabel(mult);
    const plays = mult * CERT.song.diamond;
    acc.push(albAccRow(icon, t('acc_cert', { n: items.length, cert: tDiamondLabel(mult), unit: tUnit('tracks', items.length), plays, plays_unit: tUnit('plays', plays) }),
      items.map(s => ({ name: s.title, plays: s.count }))));
  }
  const platTracks = allTracksSorted.filter(s => s.count >= CERT.song.plat && s.count < CERT.song.diamond);
  if (platTracks.length) acc.push(albAccRow('💿', t('acc_cert', { n: platTracks.length, cert: t('cert_plat'), unit: tUnit('tracks', platTracks.length), plays: CERT.song.plat, plays_unit: tUnit('plays', CERT.song.plat) }),
    platTracks.map(s => ({ name: s.title, plays: s.count }))));
  const goldTracks = allTracksSorted.filter(s => s.count >= CERT.song.gold && s.count < CERT.song.plat);
  if (goldTracks.length) acc.push(albAccRow('⭐', t('acc_cert', { n: goldTracks.length, cert: t('cert_gold'), unit: tUnit('tracks', goldTracks.length), plays: CERT.song.gold, plays_unit: tUnit('plays', CERT.song.gold) }),
    goldTracks.map(s => ({ name: s.title, plays: s.count }))));

  if (!acc.length) acc.push(`<div style="font-family:'DM Sans',sans-serif;font-style:italic;font-size:0.85rem;color:var(--text3);padding:0.5rem 0">${t('acc_none', { n: chartSize })}</div>`);
  document.getElementById('albumModalAccomplishments').innerHTML = acc.join('');

  // ── CHART RUN HISTORY: 3 collapsible sections ─────────────────────────────
  const crTitleEl = document.getElementById('albumModalChartRunTitle');
  const crEl = document.getElementById('albumModalChartRun');
  const hasCr = albumCrY || albumCrM || albumCrW;
  if (hasCr) {
    crTitleEl.style.display = '';
    const crSection = (label, period, crData) => {
      if (!crData?.result?.albums?.[albumKey]) return '';
      const sid = 'alb-crh-' + period;
      return `<div class="acc-row">
        <div class="acc-header">
          <button class="acc-toggle" onclick="const b=document.getElementById('${sid}');const open=b.classList.toggle('open');this.textContent=open?'−':'+';" title="Expand">+</button>
          <span>${label}</span>
        </div>
        <div class="acc-detail" id="${sid}" style="padding:0.5rem 0">
          <div class="cr-stats" style="margin-bottom:0.5rem">${crStats('albums', albumKey, period, crData)}</div>
          ${crBoxesHTML('albums', albumKey, crData, null, period)}
        </div>
      </div>`;
    };
    crEl.innerHTML =
      crSection('⭐ Yearly Chart Run', 'year', crY) +
      crSection('🌙 Monthly Chart Run', 'month', crM) +
      crSection('📊 Weekly Chart Run', 'week', crW);
  } else {
    crTitleEl.style.display = 'none';
    crEl.innerHTML = '';
  }

  // ── HEATMAP SECTION ───────────────────────────────────────────────────────
  document.getElementById('albumModalHeatmapSection').innerHTML = `
    <div class="modal-section-title">🗓 Listening Heatmap</div>
    <div class="cr-subsection">
      <div class="cr-subsection-header" onclick="toggleCrSubsection(this)">
        <span class="cr-subsection-toggle">▶</span><span class="cr-subsection-label">SHOW HEATMAP</span>
      </div>
      <div class="cr-subsection-body" style="display:none;" data-crtype="albums" data-crkey="${esc(albumKey)}" data-crkind="heatmap"></div>
    </div>`;

  // ── STREAMING HISTORY SECTION ─────────────────────────────────────────────
  document.getElementById('albumModalStreamSection').innerHTML = `
    <div class="modal-section-title">📋 Streaming History</div>
    <div class="cr-subsection">
      <div class="cr-subsection-header" onclick="toggleCrSubsection(this)">
        <span class="cr-subsection-toggle">▶</span><span class="cr-subsection-label">SHOW FULL HISTORY</span>
      </div>
      <div class="cr-subsection-body" style="display:none;" data-crtype="albums" data-crkey="${esc(albumKey)}" data-crkind="rawdata"></div>
    </div>`;

  // ── TRACKS SECTION ────────────────────────────────────────────────────────
  _albCurrentAlbumCtx = { tracks: allTracksSorted, totalPlays, crY, crM, crW, allTimeSPM, ek };
  const sortedTracks = _sortAlbTracks([...allTracksSorted], _albCurrentTrackSort, crY, crM, crW, allTimeSPM);
  document.getElementById('albumModalTracks').innerHTML =
    `<div class="alb-sort-bar">
      <span class="alb-sort-label">Sort:</span>
      <button class="alb-sort-btn active" data-sort="plays" onclick="sortAlbumTracksBy('plays')">Most Played</button>
      <button class="alb-sort-btn" data-sort="rank" onclick="sortAlbumTracksBy('rank')">Chart Rank</button>
      <button class="alb-sort-btn" data-sort="firstPlayed" onclick="sortAlbumTracksBy('firstPlayed')">Discovered First</button>
      <button class="alb-sort-btn" data-sort="lastPlayed" onclick="sortAlbumTracksBy('lastPlayed')">Recently Played</button>
    </div>` +
    _buildAlbTracksHTML(sortedTracks, totalPlays, crY, crM, crW, allTimeSPM, ek);

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

function getTop200Artists() {
  const counts = {};
  for (const p of allPlays) {
    for (const a of p.artists) counts[a] = (counts[a] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 200).map(([name]) => name);
}

const _mbidCache = {};
const _mbBirthdayCache = {}; // artist name → "YYYY-MM-DD" captured from MB search results
async function searchArtistMBID(name) {
  if (_mbidCache[name] !== undefined) return _mbidCache[name];
  try {
    const d = await mbFetch(`artist?query=${encodeURIComponent(name)}&fmt=json&limit=5`);
    const artists = d.artists || [];
    const match = artists.find(a => a.name.toLowerCase() === name.toLowerCase())
      || artists.find(a => a.score >= 90)
      || artists[0];
    _mbidCache[name] = match?.id || null;
    const born = match?.['life-span']?.begin;
    if (born && born.length >= 10) _mbBirthdayCache[name] = born.slice(0, 10);
    return _mbidCache[name];
  } catch (e) { _mbidCache[name] = null; return null; }
}

// Shared cache for release-groups — avoids duplicate MB API calls across upcoming, recent, and events
const _mbReleasesCache = {};
async function fetchAllReleasesRaw(mbid) {
  if (_mbReleasesCache[mbid] !== undefined) return _mbReleasesCache[mbid];
  try {
    const d = await mbFetch(`release-group?artist=${mbid}&type=album%7Cep%7Csingle&fmt=json&limit=100`);
    _mbReleasesCache[mbid] = d['release-groups'] || [];
  } catch (e) { _mbReleasesCache[mbid] = []; return []; }
  return _mbReleasesCache[mbid];
}

async function fetchReleasesForMBID(mbid) {
  try {
    const today = tzNow(); today.setHours(0, 0, 0, 0);
    const future = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 90);
    const todayStr = localDateStr(today);
    const futureStr = localDateStr(future);
    const groups = await fetchAllReleasesRaw(mbid);
    return groups.filter(g => {
      const date = g['first-release-date'];
      return date && date.length >= 10 && date >= todayStr && date <= futureStr;
    }).map(g => ({
      title: g.title,
      type: g['primary-type'] || 'Release',
      date: g['first-release-date'],
      mbid: g.id
    }));
  } catch (e) { return []; }
}

function _releasePlaceholderDiv(artist) {
  const words = (artist || '').replace(/^The\s+/i, '').split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
  const colors = ['#0d2137', '#1a1040', '#0d2e1f', '#2b1a0d', '#0d1e2b', '#1f0d0d'];
  const hash = (artist || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const div = document.createElement('div');
  div.className = 'upcoming-card-placeholder';
  div.style.background = colors[hash % colors.length];
  div.textContent = initials;
  return div;
}

// Show placeholder immediately (synchronous) then try to swap in a real image asynchronously.
// This prevents a blank gap on slow mobile connections where the async fetches take several seconds.
function releaseImgFallback(img) {
  if (!img.isConnected) return;
  const artist = img.dataset.artist || '';
  const title = img.dataset.title || '';
  const sources = (img.dataset.sources || '').split(',').filter(Boolean);
  const card = img.closest('.upcoming-card, .ev-carousel-card');
  const imgClass = img.className || 'upcoming-card-img';
  img.onerror = null;
  showReleasePlaceholder(img); // immediate visual — replaces img with initials div
  if (sources.length && card) _tryReleaseImgAsync(card, artist, title, sources, imgClass);
}

async function _tryReleaseImgAsync(card, artist, title, sources, imgClass = 'upcoming-card-img') {
  for (const source of sources) {
    if (!card.isConnected) return;
    let url = null;
    try {
      if (source === 'itunes') {
        const q = encodeURIComponent(artist + ' ' + title);
        const res = await fetch(`https://itunes.apple.com/search?term=${q}&media=music&entity=album&limit=5`);
        const data = await res.json();
        const match = (data.results || []).find(r => r.artistName?.toLowerCase() === artist.toLowerCase()) || data.results?.[0];
        if (match?.artworkUrl100) url = match.artworkUrl100.replace('100x100bb', '600x600bb');
      } else if (source === 'lastfm') {
        const res = await fetch(lfmUrl('album.getinfo', { artist, album: title }));
        const data = await res.json();
        const images = data.album?.image || [];
        const best = [...images].reverse().find(i => i['#text'] && !i['#text'].includes('2a96cbd8b46e442fc41c2b86b821562f'));
        if (best?.['#text']) url = best['#text'];
      } else if (source === 'deezer') {
        url = await deezerAlbumImage(title, artist);
      } else if (source === 'deezer-artist') {
        url = await deezerArtistImage(artist);
      }
    } catch (e) {}
    if (!card.isConnected) return;
    if (url) {
      const ph = card.querySelector('.upcoming-card-placeholder');
      if (!ph) return;
      const newImg = document.createElement('img');
      newImg.className = imgClass;
      newImg.alt = '';
      newImg.dataset.artist = artist;
      newImg.dataset.title = title;
      newImg.dataset.sources = '';
      newImg.onerror = () => {
        if (newImg.isConnected) newImg.parentNode.replaceChild(_releasePlaceholderDiv(artist), newImg);
      };
      newImg.src = url;
      ph.parentNode.replaceChild(newImg, ph);
      return;
    }
  }
}

function showReleasePlaceholder(img) {
  if (!img.isConnected) return;
  img.parentNode.replaceChild(_releasePlaceholderDiv(img.dataset.artist || ''), img);
}

function triggerPendingImgs(gridEl) {
  gridEl.querySelectorAll('.upcoming-card-img-pending').forEach(img => {
    img.classList.remove('upcoming-card-img-pending');
    releaseImgFallback(img);
  });
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
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(release.title + ' ' + artistName)}`;
  const imgSrc = release.mbid ? `https://coverartarchive.org/release-group/${release.mbid}/front-250` : null;
  const imgHtml = `<img class="upcoming-card-img${imgSrc ? '' : ' upcoming-card-img-pending'}" ${imgSrc ? `src="${imgSrc}" onerror="releaseImgFallback(this)"` : ''} alt="" loading="lazy" data-artist="${esc(artistName)}" data-title="${esc(release.title)}" data-sources="itunes,lastfm">`;
  return `<a class="upcoming-card" href="${searchUrl}" target="_blank" rel="noopener noreferrer">
    ${imgHtml}
    <div class="upcoming-card-date${soon ? ' soon' : ''}" data-date="${esc(release.date)}">${esc(label)}</div>
    <div class="upcoming-card-title">${esc(release.title)}</div>
    <div class="upcoming-card-artist">${esc(artistName)}</div>
    <div class="upcoming-card-type" data-mbtype="${esc(release.type || 'Release')}">${esc(typeLabel)}</div>
  </a>`;
}

function sortUpcomingReleases(releases) {
  return releases.filter(r => r.release?.date).sort((a, b) =>
    (a.release.date || '').localeCompare(b.release.date || ''));
}

async function loadUpcomingReleases(forceRefresh = false) {
  if (!allPlays.length) return;

  // Show the section only on chart tabs (not events/graphs/rawdata/records/awards/alltime/year)
  if (!['events', 'graphs', 'rawdata', 'records', 'awards', 'alltime', 'year'].includes(currentPeriod)) {
    const el = document.getElementById('upcomingSection');
    el.style.display = '';
    const savedCollapsed = localStorage.getItem('dc_section_collapsed_upcomingSection') === '1';
    el.classList.toggle('collapsed', savedCollapsed);
    const btn = el.querySelector('.section-collapse-btn');
    if (btn) btn.textContent = savedCollapsed ? '+' : '−';
  }

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

  const artists = getTop200Artists();
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

    // Progressive render — update grid as results come in (no triggerPendingImgs here;
    // those img elements get replaced on the next batch, orphaning any in-flight fetches)
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
    triggerPendingImgs(gridEl);
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
    const groups = await fetchAllReleasesRaw(mbid);
    return groups.filter(g => {
      const date = g['first-release-date'];
      return date && date.length >= 10 && date >= pastStr && date < todayStr;
    }).map(g => ({
      title: g.title,
      type: g['primary-type'] || 'Release',
      date: g['first-release-date'],
      mbid: g.id
    }));
  } catch (e) { return []; }
}

function renderRecentCard(release, artistName) {
  const d = new Date(release.date + 'T00:00:00');
  const label = fmtDate(d);
  const typeKey = 'mb_type_' + (release.type || 'Release').toLowerCase();
  const typeLabel = t(typeKey) || release.type || 'Release';
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(release.title + ' ' + artistName)}`;
  const imgSrc = release.mbid ? `https://coverartarchive.org/release-group/${release.mbid}/front-250` : null;
  const imgHtml = `<img class="upcoming-card-img${imgSrc ? '' : ' upcoming-card-img-pending'}" ${imgSrc ? `src="${imgSrc}" onerror="releaseImgFallback(this)"` : ''} alt="" loading="lazy" data-artist="${esc(artistName)}" data-title="${esc(release.title)}" data-sources="itunes,lastfm">`;
  return `<a class="upcoming-card" href="${searchUrl}" target="_blank" rel="noopener noreferrer">
    ${imgHtml}
    <div class="upcoming-card-date recent" data-date="${esc(release.date)}">${esc(label)}</div>
    <div class="upcoming-card-title">${esc(release.title)}</div>
    <div class="upcoming-card-artist">${esc(artistName)}</div>
    <div class="upcoming-card-type" data-mbtype="${esc(release.type || 'Release')}">${esc(typeLabel)}</div>
  </a>`;
}

function sortRecentReleases(releases) {
  return releases.filter(r => r.release?.date).sort((a, b) =>
    (b.release.date || '').localeCompare(a.release.date || '')); // newest first
}

async function loadRecentReleases(forceRefresh = false) {
  if (!allPlays.length) return;

  // Show the section only on chart tabs (not events/graphs/rawdata/records/awards/alltime/year)
  if (!['events', 'graphs', 'rawdata', 'records', 'awards', 'alltime', 'year'].includes(currentPeriod)) {
    const el = document.getElementById('recentSection');
    el.style.display = '';
    const savedCollapsed = localStorage.getItem('dc_section_collapsed_recentSection') === '1';
    el.classList.toggle('collapsed', savedCollapsed);
    const btn = el.querySelector('.section-collapse-btn');
    if (btn) btn.textContent = savedCollapsed ? '+' : '−';
  }

  if (!forceRefresh) {
    try {
      const cached = JSON.parse(localStorage.getItem(MB_RECENT_CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.ts < MB_CACHE_TTL) {
        renderRecentResults(cached.releases, cached.artists, true);
        return;
      }
    } catch (e) { }
  }

  const artists = getTop200Artists();
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
    triggerPendingImgs(gridEl);
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
  renderHeatmap();
}

let gCumulativeArtists = [];
let gCumulativeLabels = false;
let gVolumeLabels = false;
let gVolumeArtists = [];
let gTotalVolumeLabels = false;
let gDiscoveriesLabels = false;

let heatmapType = 'all';
let heatmapFilters = [];
let hmTheme = 'default';
let _hmDayMap = {};
let _hmMsMap = {};
let _hmBestDayDk = '';
let _hmReturnMap = {};
let _hmPercentileFn = null;

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

// ─── CERTIFICATIONS WALL ────────────────────────────────────────
const CWALL_TIER_CLASS = { gold: 'gold', platinum: 'plat', diamond: 'diamond' };
const CWALL_TIER_LABEL = { gold: '⭐ Gold', platinum: '💿 Platinum', diamond: '💎 Diamond' };
const CWALL_TYPE_LABEL = { song: 'Song', album: 'Album' };

function wallInitials(str) {
  return (str || '').split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';
}

function fmtCertDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) { return String(dateStr); }
}

function renderCertifications(data) {
  certWallData = data || [];
  const wall = document.getElementById('certifications-wall');
  if (!wall) return;

  if (!certWallData.length) {
    wall.innerHTML = '<div class="cwall-empty">No certifications to display.</div>';
    return;
  }

  wall.innerHTML = `
    <div class="cwall-controls">
      <div class="cwall-search-wrap">
        <input class="cwall-search" id="cwall-search-input" type="search"
          placeholder="Search by artist, song, or album…" value="${esc(certWallSearch)}">
      </div>
      <div class="cwall-filter-row">
        <div class="cwall-filter-btns">
          <button class="cwall-btn${certWallFilter==='all'?' active':''}" data-cwall-filter="all">All</button>
          <button class="cwall-btn${certWallFilter==='song'?' active':''}" data-cwall-filter="song">Songs</button>
          <button class="cwall-btn${certWallFilter==='album'?' active':''}" data-cwall-filter="album">Albums</button>
        </div>
        <div class="cwall-sort-btns">
          <span class="cwall-sort-label">Sort:</span>
          <button class="cwall-btn${certWallSort==='tier'?' active':''}" data-cwall-sort="tier">Tier</button>
          <button class="cwall-btn${certWallSort==='artist'?' active':''}" data-cwall-sort="artist">Artist</button>
          <button class="cwall-btn${certWallSort==='title'?' active':''}" data-cwall-sort="title">Title</button>
          <button class="cwall-btn${certWallSort==='date'?' active':''}" data-cwall-sort="date">Date</button>
        </div>
      </div>
    </div>
    <div class="cwall-grid" id="cwall-grid"></div>`;

  document.getElementById('cwall-search-input').addEventListener('input', e => {
    certWallSearch = e.target.value;
    renderCertWallCards();
  });

  wall.querySelector('.cwall-filter-btns').addEventListener('click', e => {
    const btn = e.target.closest('[data-cwall-filter]');
    if (!btn) return;
    certWallFilter = btn.dataset.cwallFilter;
    wall.querySelectorAll('[data-cwall-filter]').forEach(b =>
      b.classList.toggle('active', b.dataset.cwallFilter === certWallFilter));
    renderCertWallCards();
  });

  wall.querySelector('.cwall-sort-btns').addEventListener('click', e => {
    const btn = e.target.closest('[data-cwall-sort]');
    if (!btn) return;
    certWallSort = btn.dataset.cwallSort;
    wall.querySelectorAll('[data-cwall-sort]').forEach(b =>
      b.classList.toggle('active', b.dataset.cwallSort === certWallSort));
    renderCertWallCards();
  });

  renderCertWallCards();
}

function renderCertWallCards() {
  const grid = document.getElementById('cwall-grid');
  if (!grid) return;

  let items = certWallData.slice();

  if (certWallFilter !== 'all') {
    items = items.filter(item => item.type === certWallFilter);
  }

  if (certWallSearch.trim()) {
    const q = certWallSearch.trim().toLowerCase();
    items = items.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.artist.toLowerCase().includes(q));
  }

  if (certWallSort === 'tier') {
    items.sort((a, b) =>
      (CWALL_TIER_ORD[a.tier] - CWALL_TIER_ORD[b.tier]) || (b._plays - a._plays));
  } else if (certWallSort === 'artist') {
    items.sort((a, b) =>
      (a.artist || '').localeCompare(b.artist || '') ||
      (a.title || '').localeCompare(b.title || ''));
  } else if (certWallSort === 'title') {
    items.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  } else if (certWallSort === 'date') {
    items.sort((a, b) =>
      (a.date || '').localeCompare(b.date || '') ||
      (a.title || '').localeCompare(b.title || ''));
  }

  if (!items.length) {
    grid.innerHTML = '<div class="cwall-empty">No certifications match your search.</div>';
    return;
  }

  grid.innerHTML = items.map(item => {
    const origIdx = certWallData.indexOf(item);
    const tierClass = CWALL_TIER_CLASS[item.tier] || 'gold';
    const ini = esc(wallInitials(item.title));
    const dateStr = fmtCertDate(item.date);

    const recordHtml = item.image
      ? `<img class="cert-record" src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
        + `<div class="cert-record-initials" style="display:none">${ini}</div>`
      : `<div class="cert-record-initials">${ini}</div>`;

    return `<div class="cert-card cert-card--${tierClass}">
  <div class="cert-frame">
    <div class="cert-record-wrap" id="cwrec-${origIdx}">
      <div class="cert-sleeve"></div>
      ${recordHtml}
      <div class="cert-vinyl-center"></div>
    </div>
    <div class="cert-info">
      <span class="cert-type-badge">${esc(CWALL_TYPE_LABEL[item.type] || item.type || '')}</span>
      <div class="cert-title">${esc(item.title)}</div>
      <div class="cert-artist">${esc(item.artist)}</div>
      <div class="cert-tier-badge">${CWALL_TIER_LABEL[item.tier] || esc(item.tier)}</div>
      ${dateStr ? `<div class="cert-date">Certified ${dateStr}</div>` : ''}
    </div>
  </div>
</div>`;
  }).join('');
}

async function loadCertWallImages(items) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let url = null;
    try {
      if (item.type === 'album') {
        url = await getAlbumImage(item.title, item.artist);
      } else {
        if (item._album) url = await getAlbumImage(item._album, item.artist);
        if (!url) url = await getTrackImage(item.title, item.artist);
      }
    } catch (e) {}
    if (!url) continue;
    item.image = url;
    const wrap = document.getElementById('cwrec-' + i);
    if (!wrap) continue;
    const existingIni = wrap.querySelector('.cert-record-initials');
    if (existingIni) {
      existingIni.style.display = 'none';
      existingIni.insertAdjacentHTML('beforebegin',
        `<img class="cert-record" src="${url}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      );
    }
  }
}

// ─── EVENTS CALENDAR (Birthdays & Anniversaries) ─────────────
function releaseIcon(type) {
  const t = (type || '').toLowerCase();
  if (t === 'single') return '🎵';
  if (t === 'album')  return '💿';
  if (t === 'ep')     return '📀';
  return '🎶';
}

function _releaseTypeKey(type) {
  const t = (type || '').toLowerCase();
  if (t === 'album') return 'album';
  if (t === 'single') return 'single';
  if (t === 'ep') return 'ep';
  return 'other';
}

function applyEventsTypeFilter(data) {
  const { birthdays, anniversaries, recentBirthdays, recentAnniversaries, eventsUpcoming, eventsRecent } = data;
  const showBirthday = eventsTypeFilter.has('birthday');
  const rtMatch = (type) => eventsTypeFilter.has(_releaseTypeKey(type));
  return {
    birthdays: showBirthday ? birthdays : [],
    recentBirthdays: showBirthday ? recentBirthdays : [],
    anniversaries: anniversaries.filter(a => rtMatch(a.type)),
    recentAnniversaries: recentAnniversaries.filter(a => rtMatch(a.type)),
    eventsUpcoming: eventsUpcoming.filter(({ release }) => rtMatch(release.type)),
    eventsRecent: eventsRecent.filter(({ release }) => rtMatch(release.type)),
  };
}

function toggleEventsType(type) {
  if (eventsTypeFilter.has(type)) {
    eventsTypeFilter.delete(type);
  } else {
    eventsTypeFilter.add(type);
  }
  try { localStorage.setItem('dc_events_type_filter', JSON.stringify([...eventsTypeFilter])); } catch (e) {}
  if (typeof dcSaveUserConfig === 'function') dcSaveUserConfig();
  _syncEventsTypeFilter();
  _syncCalExportBtn();
  if (type === 'show') {
    _syncConcertsSectionVisibility();
    if (_eventsCalendarData) renderEventsCalendar(_eventsCalendarData, eventsCalendarYear, eventsCalendarMonth);
  } else {
    if (_eventsRawData) _renderEventsFromRaw(_eventsRawData, _eventsArtists, true);
  }
}

function _syncConcertsSectionVisibility() {
  const section = document.getElementById('concertsSection');
  const filterBtn = document.getElementById('showsFilterBtn');
  const hasConcerts = true;
  if (filterBtn) filterBtn.style.display = hasConcerts ? '' : 'none';
  if (!section) return;
  const visible = hasConcerts && eventsTypeFilter.has('show');
  section.style.display = visible ? '' : 'none';
}

function _syncEventsTypeFilter() {
  document.querySelectorAll('.events-type-btn').forEach(btn => {
    btn.classList.toggle('active', eventsTypeFilter.has(btn.dataset.etype));
  });
  _syncConcertsSectionVisibility();
}

const EVENTS_CACHE_KEY = 'dc_eventsCache';
const EVENTS_CACHE_TTL = 24 * 60 * 60 * 1000;
const EVENTS_WINDOW_DAYS = 30;
const CONCERTS_CACHE_KEY = 'dc_concertsCache';
const CONCERTS_CACHE_TTL = 6 * 60 * 60 * 1000;
const NMF_CACHE_KEY = 'dc_nmfCache';
const NMF_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
const NMF_HISTORY_KEY = 'dc_nmfHistory';
const NMF_HISTORY_MAX_WEEKS = 16;
const CONCERTS_ARTIST_LIMIT = 10;

function getTopNArtists(n) {
  const counts = {};
  for (const p of allPlays) {
    for (const a of p.artists) counts[a] = (counts[a] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n).map(([name]) => name);
}

// TheAudioDB fallback — returns "YYYY-MM-DD" or null
const _tadbCache = {};
async function fetchBirthdayTADB(name) {
  if (_tadbCache[name] !== undefined) return _tadbCache[name];
  await new Promise(r => setTimeout(r, 500));
  try {
    const res = await fetch(`https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(name)}`);
    if (!res.ok) { _tadbCache[name] = null; return null; }
    const d = await res.json();
    const born = d?.artists?.[0]?.strBornDT || null;
    _tadbCache[name] = (born && born.length >= 10) ? born.slice(0, 10) : null;
    return _tadbCache[name];
  } catch (e) { _tadbCache[name] = null; return null; }
}

// Wikidata SPARQL fallback — returns "YYYY-MM-DD" or null
const _wikidataCache = {};
async function fetchBirthdayWikidata(name) {
  if (_wikidataCache[name] !== undefined) return _wikidataCache[name];
  await new Promise(r => setTimeout(r, 300));
  try {
    const safeName = name.replace(/["\\]/g, ' ');
    const sparql = `SELECT ?dob WHERE { ?person rdfs:label "${safeName}"@en; wdt:P569 ?dob. FILTER(!ISBLANK(?dob)) } LIMIT 1`;
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
    const res = await fetch(url, { headers: { 'Accept': 'application/sparql-results+json' } });
    if (!res.ok) { _wikidataCache[name] = null; return null; }
    const d = await res.json();
    const val = d?.results?.bindings?.[0]?.dob?.value;
    if (!val) { _wikidataCache[name] = null; return null; }
    const m = val.match(/(\d{4}-\d{2}-\d{2})/);
    _wikidataCache[name] = m ? m[1] : null;
    return _wikidataCache[name];
  } catch (e) { _wikidataCache[name] = null; return null; }
}

// Returns days until next occurrence of MM-DD within windowDays, or null if too far away
function daysUntilNextOccurrence(mmdd, windowDays) {
  if (!mmdd || mmdd.includes('00')) return null;
  const today = tzNow(); today.setHours(0, 0, 0, 0);
  const [mm, dd] = mmdd.split('-').map(Number);
  let candidate = new Date(today.getFullYear(), mm - 1, dd);
  candidate.setHours(0, 0, 0, 0);
  if (candidate < today) candidate = new Date(today.getFullYear() + 1, mm - 1, dd);
  const days = Math.round((candidate - today) / 86400000);
  return days <= windowDays ? days : null;
}

// Returns days since last occurrence of MM-DD within windowDays, or null if too far back (or today)
function daysSinceLastOccurrence(mmdd, windowDays) {
  if (!mmdd || mmdd.includes('00')) return null;
  const today = tzNow(); today.setHours(0, 0, 0, 0);
  const [mm, dd] = mmdd.split('-').map(Number);
  let candidate = new Date(today.getFullYear(), mm - 1, dd);
  candidate.setHours(0, 0, 0, 0);
  if (candidate >= today) candidate = new Date(today.getFullYear() - 1, mm - 1, dd);
  const days = Math.round((today - candidate) / 86400000);
  return days > 0 && days <= windowDays ? days : null;
}

function ordinalSuffix(n) {
  if (n === 11 || n === 12 || n === 13) return n + 'th';
  const s = ['th', 'st', 'nd', 'rd'];
  return n + (s[n % 10] || 'th');
}

function renderBirthdayCard(entry) {
  const { artistName, dateStr, daysUntil } = entry;
  const isToday = daysUntil === 0;
  const birthYear = parseInt(dateStr.slice(0, 4));
  const currentYear = tzNow().getFullYear();
  const age = isToday ? currentYear - birthYear : (currentYear + (daysUntil > 0 ? 0 : 1)) - birthYear;
  const [, mm, dd] = dateStr.split('-');
  const displayDate = fmtDate(new Date(currentYear + (daysUntil < 0 ? 1 : 0), parseInt(mm) - 1, parseInt(dd)));
  const countdownLabel = isToday ? 'TODAY' : `in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(artistName + ' birthday')}`;
  const imgHtml = `<img class="upcoming-card-img upcoming-card-img-pending" alt="" loading="lazy" data-artist="${esc(artistName)}" data-title="" data-sources="deezer-artist">`;
  return `<a class="upcoming-card${isToday ? ' event-today' : ''}" href="${searchUrl}" target="_blank" rel="noopener noreferrer">
    ${imgHtml}
    <div class="upcoming-card-date${isToday ? ' soon' : ''}">${countdownLabel}</div>
    <div class="upcoming-card-title">${esc(artistName)}</div>
    <div class="upcoming-card-artist">${esc(displayDate)} · Turning ${age}</div>
    <div class="upcoming-card-type">🎂 Birthday</div>
  </a>`;
}

function renderRecentBirthdayCard(entry) {
  const { artistName, dateStr, daysAgo } = entry;
  const birthYear = parseInt(dateStr.slice(0, 4));
  const currentYear = tzNow().getFullYear();
  const age = currentYear - birthYear;
  const [, mm, dd] = dateStr.split('-');
  const displayDate = fmtDate(new Date(currentYear, parseInt(mm) - 1, parseInt(dd)));
  const daysAgoLabel = `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(artistName + ' birthday')}`;
  const imgHtml = `<img class="upcoming-card-img upcoming-card-img-pending" alt="" loading="lazy" data-artist="${esc(artistName)}" data-title="" data-sources="deezer-artist">`;
  return `<a class="upcoming-card" href="${searchUrl}" target="_blank" rel="noopener noreferrer">
    ${imgHtml}
    <div class="upcoming-card-date recent">${daysAgoLabel}</div>
    <div class="upcoming-card-title">${esc(artistName)}</div>
    <div class="upcoming-card-artist">${esc(displayDate)} · Turned ${age}</div>
    <div class="upcoming-card-type">🎂 Birthday</div>
  </a>`;
}

function renderAnniversaryCard(entry) {
  const { artistName, title, type, releaseDate, years, daysUntil, mbid } = entry;
  const isToday = daysUntil === 0;
  const typeKey = 'mb_type_' + (type || 'Release').toLowerCase();
  const typeLabel = t(typeKey) || type || 'Release';
  const countdownLabel = isToday ? 'TODAY' : `in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + artistName)}`;
  const imgSrc = mbid ? `https://coverartarchive.org/release-group/${mbid}/front-250` : null;
  const imgHtml = `<img class="upcoming-card-img${imgSrc ? '' : ' upcoming-card-img-pending'}" ${imgSrc ? `src="${imgSrc}" onerror="releaseImgFallback(this)"` : ''} alt="" loading="lazy" data-artist="${esc(artistName)}" data-title="${esc(title)}" data-sources="deezer,itunes,lastfm">`;
  return `<a class="upcoming-card${isToday ? ' event-today' : ''}" href="${searchUrl}" target="_blank" rel="noopener noreferrer">
    ${imgHtml}
    <div class="upcoming-card-date${isToday ? ' soon' : ''}">${countdownLabel}</div>
    <div class="upcoming-card-title">${esc(title)}</div>
    <div class="upcoming-card-artist">${esc(artistName)}</div>
    <div class="upcoming-card-type">${releaseIcon(type)} ${ordinalSuffix(years)} Anniversary · ${esc(typeLabel)} · ${releaseDate.slice(0, 4)}</div>
  </a>`;
}

function renderRecentAnniversaryCard(entry) {
  const { artistName, title, type, releaseDate, years, daysAgo, mbid } = entry;
  const typeKey = 'mb_type_' + (type || 'Release').toLowerCase();
  const typeLabel = t(typeKey) || type || 'Release';
  const daysAgoLabel = `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + artistName)}`;
  const imgSrc = mbid ? `https://coverartarchive.org/release-group/${mbid}/front-250` : null;
  const imgHtml = `<img class="upcoming-card-img${imgSrc ? '' : ' upcoming-card-img-pending'}" ${imgSrc ? `src="${imgSrc}" onerror="releaseImgFallback(this)"` : ''} alt="" loading="lazy" data-artist="${esc(artistName)}" data-title="${esc(title)}" data-sources="deezer,itunes,lastfm">`;
  return `<a class="upcoming-card" href="${searchUrl}" target="_blank" rel="noopener noreferrer">
    ${imgHtml}
    <div class="upcoming-card-date recent">${daysAgoLabel}</div>
    <div class="upcoming-card-title">${esc(title)}</div>
    <div class="upcoming-card-artist">${esc(artistName)}</div>
    <div class="upcoming-card-type">${releaseIcon(type)} ${ordinalSuffix(years)} Anniversary · ${esc(typeLabel)} · ${releaseDate.slice(0, 4)}</div>
  </a>`;
}

// ─── EVENTS CALENDAR VIEW ──────────────────────────────────────

const _CAL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const _CAL_DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function buildCalendarDayMap(data, dateSet) {
  const { birthdays, anniversaries, recentBirthdays, recentAnniversaries, eventsUpcoming, eventsRecent, concerts = [] } = data;
  const map = {};
  const add = (ds, ev) => { if (!map[ds]) map[ds] = []; map[ds].push(ev); };
  const today = tzNow(); today.setHours(0, 0, 0, 0);
  const dateFromDelta = (delta) => {
    const d = new Date(today); d.setDate(d.getDate() + delta); return localDateStr(d);
  };
  const currentYear = tzNow().getFullYear();
  for (const b of birthdays) {
    const ds = dateFromDelta(b.daysUntil);
    if (!dateSet.has(ds)) continue;
    const isToday = b.daysUntil === 0;
    const birthYear = parseInt(b.dateStr.slice(0, 4));
    const age = currentYear - birthYear;
    const [, mm, dd] = b.dateStr.split('-');
    const dispDate = fmtDate(new Date(currentYear, parseInt(mm) - 1, parseInt(dd)));
    add(ds, { icon: '🎂', label: b.artistName, past: false, url: `https://www.google.com/search?q=${encodeURIComponent(b.artistName + ' birthday')}`, cls: 'cal-ev-birthday',
      ttType: 'birthday', ttArtist: b.artistName, ttTitle: b.artistName, ttMbid: '',
      ttDetail: `🎂 Birthday · ${dispDate} · Turning ${age}`,
      ttDateTxt: isToday ? 'TODAY' : `in ${b.daysUntil} day${b.daysUntil === 1 ? '' : 's'}`, ttDateCls: isToday ? 'soon' : '' });
  }
  for (const b of recentBirthdays) {
    const ds = dateFromDelta(-b.daysAgo);
    if (!dateSet.has(ds)) continue;
    const birthYear = parseInt(b.dateStr.slice(0, 4));
    const age = currentYear - birthYear;
    const [, mm, dd] = b.dateStr.split('-');
    const dispDate = fmtDate(new Date(currentYear, parseInt(mm) - 1, parseInt(dd)));
    add(ds, { icon: '🎂', label: b.artistName, past: true, url: `https://www.google.com/search?q=${encodeURIComponent(b.artistName + ' birthday')}`, cls: 'cal-ev-birthday',
      ttType: 'birthday', ttArtist: b.artistName, ttTitle: b.artistName, ttMbid: '',
      ttDetail: `🎂 Birthday · ${dispDate} · Turned ${age}`,
      ttDateTxt: `${b.daysAgo} day${b.daysAgo === 1 ? '' : 's'} ago`, ttDateCls: 'recent' });
  }
  for (const a of anniversaries) {
    const ds = dateFromDelta(a.daysUntil);
    if (!dateSet.has(ds)) continue;
    const isToday = a.daysUntil === 0;
    const typeKey = 'mb_type_' + (a.type || 'Release').toLowerCase();
    const typeLabel = t(typeKey) || a.type || 'Release';
    add(ds, { icon: releaseIcon(a.type), label: a.title, sub: a.artistName, past: false, url: `https://www.google.com/search?q=${encodeURIComponent(a.title + ' ' + a.artistName)}`, cls: 'cal-ev-anniversary',
      ttType: 'anniversary', ttArtist: a.artistName, ttTitle: a.title, ttMbid: a.mbid || '',
      ttDetail: `${releaseIcon(a.type)} ${ordinalSuffix(a.years)} Anniversary · ${typeLabel} · ${(a.releaseDate || '').slice(0, 4)}`,
      ttDateTxt: isToday ? 'TODAY' : `in ${a.daysUntil} day${a.daysUntil === 1 ? '' : 's'}`, ttDateCls: isToday ? 'soon' : '' });
  }
  for (const a of recentAnniversaries) {
    const ds = dateFromDelta(-a.daysAgo);
    if (!dateSet.has(ds)) continue;
    const typeKey = 'mb_type_' + (a.type || 'Release').toLowerCase();
    const typeLabel = t(typeKey) || a.type || 'Release';
    add(ds, { icon: releaseIcon(a.type), label: a.title, sub: a.artistName, past: true, url: `https://www.google.com/search?q=${encodeURIComponent(a.title + ' ' + a.artistName)}`, cls: 'cal-ev-anniversary',
      ttType: 'anniversary', ttArtist: a.artistName, ttTitle: a.title, ttMbid: a.mbid || '',
      ttDetail: `${releaseIcon(a.type)} ${ordinalSuffix(a.years)} Anniversary · ${typeLabel} · ${(a.releaseDate || '').slice(0, 4)}`,
      ttDateTxt: `${a.daysAgo} day${a.daysAgo === 1 ? '' : 's'} ago`, ttDateCls: 'recent' });
  }
  for (const { release: r, artistName } of eventsUpcoming) {
    if (!r.date || !dateSet.has(r.date)) continue;
    const { label: dateLabel, soon } = upcomingDateLabel(r.date);
    const typeKey = 'mb_type_' + (r.type || 'Release').toLowerCase();
    const typeLabel = t(typeKey) || r.type || 'Release';
    add(r.date, { icon: releaseIcon(r.type), label: r.title, sub: artistName, past: false, url: `https://www.google.com/search?q=${encodeURIComponent(r.title + ' ' + artistName)}`, cls: 'cal-ev-release',
      ttType: 'release', ttArtist: artistName, ttTitle: r.title, ttMbid: r.mbid || '',
      ttDetail: `${releaseIcon(r.type)} ${typeLabel}`,
      ttDateTxt: dateLabel, ttDateCls: soon ? 'soon' : '' });
  }
  for (const { release: r, artistName } of eventsRecent) {
    if (!r.date || !dateSet.has(r.date)) continue;
    const typeKey = 'mb_type_' + (r.type || 'Release').toLowerCase();
    const typeLabel = t(typeKey) || r.type || 'Release';
    add(r.date, { icon: releaseIcon(r.type), label: r.title, sub: artistName, past: true, url: `https://www.google.com/search?q=${encodeURIComponent(r.title + ' ' + artistName)}`, cls: 'cal-ev-release',
      ttType: 'release', ttArtist: artistName, ttTitle: r.title, ttMbid: r.mbid || '',
      ttDetail: `${releaseIcon(r.type)} ${typeLabel}`,
      ttDateTxt: fmtDate(new Date(r.date + 'T00:00:00')), ttDateCls: 'recent' });
  }
  const todayCal = tzNow(); todayCal.setHours(0, 0, 0, 0);
  for (const { event: ev, artistName } of concerts) {
    const date = ev.dates?.start?.localDate;
    if (!date || !dateSet.has(date)) continue;
    const time = ev.dates?.start?.localTime || '';
    const venue = ev._embedded?.venues?.[0];
    const venueName = venue?.name || '';
    const city = venue?.city?.name || '';
    const stateCode = venue?.state?.stateCode || venue?.country?.countryCode || '';
    const loc = [city, stateCode].filter(Boolean).join(', ');
    const showDate = new Date(date + 'T00:00:00');
    const isPast = showDate < todayCal;
    const daysUntil = Math.round((showDate - todayCal) / 86400000);
    const isToday = daysUntil === 0;
    add(date, { icon: '🎤', label: artistName, sub: venueName + (loc ? ' · ' + loc : ''), past: isPast,
      url: ev.url || `https://www.ticketmaster.com/search?q=${encodeURIComponent(artistName)}`, cls: 'cal-ev-concert',
      ttType: 'concert', ttArtist: artistName, ttTitle: ev.name || artistName, ttMbid: '',
      ttDetail: `🎤 Live Show · ${venueName}${loc ? ' · ' + loc : ''}${time ? ' · ' + time.slice(0, 5) : ''}`,
      ttDateTxt: isToday ? 'TODAY' : isPast ? fmtDate(showDate) : `in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`,
      ttDateCls: isToday ? 'soon' : isPast ? 'recent' : '' });
  }
  return map;
}

// ── Calendar helpers ───────────────────────────────────────────

function _calDateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function _calMonthDateSet(year, month) {
  const days = new Date(year, month + 1, 0).getDate();
  const p = `${year}-${String(month + 1).padStart(2, '0')}`;
  return new Set(Array.from({ length: days }, (_, i) => `${p}-${String(i + 1).padStart(2, '0')}`));
}

function getWeekDates(year, month, day) {
  const anchor = new Date(year, month, day);
  const offset = (anchor.getDay() - weekStartDay + 7) % 7;
  const start = new Date(anchor);
  start.setDate(start.getDate() - offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start); d.setDate(d.getDate() + i); return d;
  });
}

function _calAdjustDate(year, month, day, delta) {
  const d = new Date(year, month, day + delta);
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
}

function renderCalEventsHtml(events) {
  return `<div class="cal-cell-events">` + events.map(ev =>
    `<a class="cal-ev ${ev.cls}${ev.past ? ' cal-ev-past' : ''}" href="${ev.url}" target="_blank" rel="noopener noreferrer" data-ctt="${esc(ev.ttType||'')}" data-cta="${esc(ev.ttArtist||'')}" data-ctl="${esc(ev.ttTitle||'')}" data-ctm="${esc(ev.ttMbid||'')}" data-ctd="${esc(ev.ttDetail||'')}" data-ctx="${esc(ev.ttDateTxt||'')}" data-ctf="${esc(ev.ttDateCls||'')}">
      <span class="cal-ev-icon">${ev.icon}</span><span class="cal-ev-text"><span class="cal-ev-label">${esc(ev.label)}</span>${ev.sub ? `<span class="cal-ev-sub">${esc(ev.sub)}</span>` : ''}</span>
    </a>`
  ).join('') + `</div>`;
}

// ── Month view ─────────────────────────────────────────────────

function renderCalMonth(calEl, titleEl, data, year, month) {
  const dateSet = _calMonthDateSet(year, month);
  const dayMap = buildCalendarDayMap(data, dateSet);
  const today = tzNow(); today.setHours(0, 0, 0, 0);
  const todayStr = localDateStr(today);
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  titleEl.innerHTML = `<span class="cal-title-month">${_CAL_MONTHS[month]}</span><span class="cal-title-year">${year}</span>`;

  let html = _CAL_DAYS.map(d => `<div class="cal-dow">${d}</div>`).join('');
  for (let i = 0; i < firstDow; i++) html += `<div class="cal-cell cal-cell-empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = _calDateStr(year, month, d);
    const events = dayMap[ds] || [];
    const isToday = ds === todayStr;
    const isPast  = ds < todayStr;
    html += `<div class="cal-cell${isToday ? ' cal-today' : ''}${isPast && !isToday ? ' cal-past' : ''}">
      <div class="cal-cell-num">${d}</div>`;
    if (events.length) html += renderCalEventsHtml(events);
    html += `</div>`;
  }
  calEl.className = 'events-cal-grid';
  calEl.innerHTML = html;
}

// ── Week view ──────────────────────────────────────────────────

function renderCalWeek(calEl, titleEl, data, year, month, day) {
  const weekDates = getWeekDates(year, month, day);
  const dateSet = new Set(weekDates.map(d => localDateStr(d)));
  const dayMap = buildCalendarDayMap(data, dateSet);
  const today = tzNow(); today.setHours(0, 0, 0, 0);
  const todayStr = localDateStr(today);

  const first = weekDates[0], last = weekDates[6];
  const fm = _CAL_MONTHS[first.getMonth()], lm = _CAL_MONTHS[last.getMonth()];
  titleEl.textContent = first.getMonth() === last.getMonth()
    ? `${fm} ${first.getDate()}–${last.getDate()}, ${last.getFullYear()}`
    : `${fm} ${first.getDate()} – ${lm} ${last.getDate()}, ${last.getFullYear()}`;

  let html = weekDates.map(d => {
    const ds = localDateStr(d);
    const isToday = ds === todayStr;
    const isPast  = ds < todayStr;
    return `<div class="cal-dow cal-week-dow${isToday ? ' cal-week-dow-today' : ''}${isPast && !isToday ? ' cal-week-dow-past' : ''}">
      <div class="cal-week-dow-name">${_CAL_DAYS[d.getDay()]}</div>
      <div class="cal-week-dow-num">${d.getDate()}</div>
    </div>`;
  }).join('');

  html += weekDates.map(d => {
    const ds = localDateStr(d);
    const events = dayMap[ds] || [];
    const isToday = ds === todayStr;
    const isPast  = ds < todayStr;
    return `<div class="cal-cell cal-week-cell${isToday ? ' cal-today' : ''}${isPast && !isToday ? ' cal-past' : ''}">
      ${events.length ? renderCalEventsHtml(events) : ''}
    </div>`;
  }).join('');

  calEl.className = 'events-cal-grid cal-week-grid';
  calEl.innerHTML = html;
}

// ── Day view ───────────────────────────────────────────────────

const _CAL_DOW_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function renderCalDay(calEl, titleEl, data, year, month, day) {
  const dateObj = new Date(year, month, day);
  const ds = localDateStr(dateObj);
  const dateSet = new Set([ds]);
  const dayMap = buildCalendarDayMap(data, dateSet);
  const events = dayMap[ds] || [];

  titleEl.textContent = `${_CAL_DOW_FULL[dateObj.getDay()]}, ${fmtDate(dateObj)}`;

  if (!events.length) {
    calEl.className = 'events-cal-day';
    calEl.innerHTML = `<div class="cal-day-empty">No events on this day</div>`;
    return;
  }

  const html = events.map(ev => {
    const mainTitle = ev.ttType === 'birthday' ? ev.ttArtist : ev.ttTitle;
    const artistLine = ev.ttType !== 'birthday' ? `<div class="cal-day-item-artist">${esc(ev.ttArtist)}</div>` : '';
    return `<a class="cal-day-item ${ev.cls}${ev.past ? ' cal-ev-past' : ''}" href="${ev.url}" target="_blank" rel="noopener noreferrer" data-ctt="${esc(ev.ttType||'')}" data-cta="${esc(ev.ttArtist||'')}" data-ctl="${esc(ev.ttTitle||'')}" data-ctm="${esc(ev.ttMbid||'')}" data-ctd="${esc(ev.ttDetail||'')}" data-ctx="${esc(ev.ttDateTxt||'')}" data-ctf="${esc(ev.ttDateCls||'')}">
      <div class="cal-day-item-img-wrap" data-mbid="${esc(ev.ttMbid||'')}" data-artist="${esc(ev.ttArtist||'')}" data-evtype="${esc(ev.ttType||'')}"></div>
      <div class="cal-day-item-body">
        <div class="cal-day-item-title">${esc(mainTitle)}</div>
        ${artistLine}
        <div class="cal-day-item-detail">${ev.ttDetail}</div>
      </div>
    </a>`;
  }).join('');

  calEl.className = 'events-cal-day';
  calEl.innerHTML = html;
  _triggerCalDayImgs(calEl);
}

function _triggerCalDayImgs(calEl) {
  calEl.querySelectorAll('.cal-day-item-img-wrap').forEach(wrap => {
    const { mbid, artist, evtype } = wrap.dataset;
    if (mbid) {
      const img = document.createElement('img');
      img.className = 'cal-day-item-img';
      img.alt = '';
      img.onerror = () => { if (wrap.isConnected) wrap.innerHTML = _calTtPlaceholderHtml(artist); };
      img.src = `https://coverartarchive.org/release-group/${mbid}/front-250`;
      wrap.appendChild(img);
    } else {
      wrap.innerHTML = _calTtPlaceholderHtml(artist);
      if (evtype === 'birthday' && artist) _loadCalTtArtistImg(wrap, artist);
    }
  });
}

// ── Dispatcher ─────────────────────────────────────────────────

function renderEventsCalendar(data, year, month) {
  const calEl = document.getElementById('eventsCalendarGrid');
  const titleEl = document.getElementById('eventsCalendarTitle');
  if (!calEl || !titleEl) return;
  const merged = { ...data, concerts: eventsTypeFilter.has('show') ? (_concertsData || []) : [] };
  if (eventsCalendarView === 'week') {
    renderCalWeek(calEl, titleEl, merged, year, month, eventsCalendarDay);
  } else if (eventsCalendarView === 'day') {
    renderCalDay(calEl, titleEl, merged, year, month, eventsCalendarDay);
  } else {
    renderCalMonth(calEl, titleEl, merged, year, month);
  }
  _syncCalViewBtns();
}

function _syncCalViewBtns() {
  document.querySelectorAll('.cal-view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === eventsCalendarView);
  });
  _syncCalExportBtn();
}

function _syncCalExportBtn() {
  const btn = document.getElementById('calExportPlaylistBtn');
  if (!btn) return;
  const isDay = eventsCalendarView === 'day';
  const singlesOnly = eventsTypeFilter.size === 1 && eventsTypeFilter.has('single');
  btn.style.display = (isDay && singlesOnly) ? '' : 'none';
}

function setCalView(view) {
  eventsCalendarView = view;
  try { localStorage.setItem('dc_cal_view', view); } catch (e) {}
  if (typeof dcSaveUserConfig === 'function') dcSaveUserConfig();
  if (view !== 'month') {
    const tod = tzNow();
    if (tod.getFullYear() === eventsCalendarYear && tod.getMonth() === eventsCalendarMonth) {
      eventsCalendarDay = tod.getDate();
    } else {
      eventsCalendarDay = 1;
    }
  }
  if (_eventsCalendarData) renderEventsCalendar(_eventsCalendarData, eventsCalendarYear, eventsCalendarMonth);
}

function eventsCalendarPrev() {
  if (eventsCalendarView === 'week') {
    const r = _calAdjustDate(eventsCalendarYear, eventsCalendarMonth, eventsCalendarDay, -7);
    eventsCalendarYear = r.year; eventsCalendarMonth = r.month; eventsCalendarDay = r.day;
  } else if (eventsCalendarView === 'day') {
    const r = _calAdjustDate(eventsCalendarYear, eventsCalendarMonth, eventsCalendarDay, -1);
    eventsCalendarYear = r.year; eventsCalendarMonth = r.month; eventsCalendarDay = r.day;
  } else {
    eventsCalendarMonth--;
    if (eventsCalendarMonth < 0) { eventsCalendarMonth = 11; eventsCalendarYear--; }
  }
  if (_eventsCalendarData) renderEventsCalendar(_eventsCalendarData, eventsCalendarYear, eventsCalendarMonth);
}

function eventsCalendarNext() {
  if (eventsCalendarView === 'week') {
    const r = _calAdjustDate(eventsCalendarYear, eventsCalendarMonth, eventsCalendarDay, 7);
    eventsCalendarYear = r.year; eventsCalendarMonth = r.month; eventsCalendarDay = r.day;
  } else if (eventsCalendarView === 'day') {
    const r = _calAdjustDate(eventsCalendarYear, eventsCalendarMonth, eventsCalendarDay, 1);
    eventsCalendarYear = r.year; eventsCalendarMonth = r.month; eventsCalendarDay = r.day;
  } else {
    eventsCalendarMonth++;
    if (eventsCalendarMonth > 11) { eventsCalendarMonth = 0; eventsCalendarYear++; }
  }
  if (_eventsCalendarData) renderEventsCalendar(_eventsCalendarData, eventsCalendarYear, eventsCalendarMonth);
}

// ====== Events Section View Modes ======
const _eventsViewDefaults = {
  birthdays: 'carousel', anniversaries: 'carousel', eventsUpcoming: 'carousel',
  eventsRecent: 'carousel', recentBirthdays: 'carousel', recentAnniversaries: 'carousel', concerts: 'carousel',
  nmf: 'carousel'
};
const eventsViewModes = Object.assign({}, _eventsViewDefaults,
  (() => { try { return JSON.parse(localStorage.getItem('dc_events_view_modes') || '{}'); } catch (e) { return {}; } })()
);
let _eventsLastData = null;
const EV_GRID_IDS = {
  birthdays: 'birthdaysGrid', anniversaries: 'anniversariesGrid',
  eventsUpcoming: 'eventsUpcomingGrid', eventsRecent: 'eventsRecentGrid',
  recentBirthdays: 'eventsRecentBirthdaysGrid', recentAnniversaries: 'eventsRecentAnniversariesGrid',
  concerts: 'concertsGrid', nmf: 'nmfGrid'
};

function setEventsView(sectionKey, mode) {
  eventsViewModes[sectionKey] = mode;
  try { localStorage.setItem('dc_events_view_modes', JSON.stringify(eventsViewModes)); } catch (e) {}
  if (typeof dcSaveUserConfig === 'function') dcSaveUserConfig();
  document.querySelectorAll('#' + sectionKey + 'ViewBtns .ev-view-btn')
    .forEach(b => b.classList.toggle('active', b.dataset.view === mode));
  _evReRenderSection(sectionKey);
}

function _evReRenderSection(sectionKey) {
  if (sectionKey === 'concerts') {
    if (_concertsData && _concertsData.length) _evRenderSectionByKey('concerts', _concertsData);
    return;
  }
  if (sectionKey === 'nmf') {
    if (_nmfData && _nmfData.length) _evRenderSectionByKey('nmf', _nmfData);
    return;
  }
  if (!_eventsLastData) return;
  const f = applyEventsTypeFilter(_eventsLastData);
  const sortFn = (a, b) => a.daysUntil - b.daysUntil;
  const sortFnAgo = (a, b) => a.daysAgo - b.daysAgo;
  const itemsMap = {
    birthdays: () => [...f.birthdays].sort(sortFn),
    anniversaries: () => [...f.anniversaries].sort(sortFn),
    eventsUpcoming: () => sortUpcomingReleases([...f.eventsUpcoming]),
    eventsRecent: () => sortRecentReleases([...f.eventsRecent]),
    recentBirthdays: () => [...f.recentBirthdays].sort(sortFnAgo),
    recentAnniversaries: () => [...f.recentAnniversaries].sort(sortFnAgo)
  };
  if (itemsMap[sectionKey]) _evRenderSectionByKey(sectionKey, itemsMap[sectionKey]());
}

function _evNormalize(sectionKey, items) {
  const out = [];
  const mkLabel = (n, unit) => `${n} ${unit}${n === 1 ? '' : 's'}`;
  if (sectionKey === 'birthdays') {
    for (const { artistName, dateStr, daysUntil } of items) {
      const isToday = daysUntil === 0;
      const curYr = tzNow().getFullYear();
      const age = parseInt(dateStr.slice(0, 4));
      const [, mm, dd] = dateStr.split('-');
      const d = new Date(curYr + (daysUntil < 0 ? 1 : 0), parseInt(mm) - 1, parseInt(dd));
      out.push({ title: artistName, artist: `${fmtDate(d)} · Turning ${curYr - age + (daysUntil < 0 ? 1 : 0)}`,
        dateLabel: isToday ? 'TODAY' : `in ${mkLabel(daysUntil, 'day')}`, dateSort: daysUntil,
        artistSort: artistName, typeLabel: '🎂 Birthday',
        href: `https://www.google.com/search?q=${encodeURIComponent(artistName + ' birthday')}`,
        imgSrc: null, imgAttr: { artist: artistName, title: '', sources: 'deezer-artist' }, isToday });
    }
  } else if (sectionKey === 'anniversaries') {
    for (const { artistName, title, type, releaseDate, years, daysUntil, mbid } of items) {
      const isToday = daysUntil === 0;
      const tl = t('mb_type_' + (type || 'Release').toLowerCase()) || type || 'Release';
      out.push({ title, artist: artistName,
        dateLabel: isToday ? 'TODAY' : `in ${mkLabel(daysUntil, 'day')}`, dateSort: daysUntil,
        artistSort: artistName, typeLabel: `🎵 ${ordinalSuffix(years)} Anniversary · ${tl} · ${releaseDate.slice(0, 4)}`,
        href: `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + artistName)}`,
        imgSrc: mbid ? `https://coverartarchive.org/release-group/${mbid}/front-250` : null,
        imgAttr: { artist: artistName, title, sources: 'deezer,itunes,lastfm' }, isToday });
    }
  } else if (sectionKey === 'eventsUpcoming') {
    for (const { release, artistName } of items) {
      const { label } = upcomingDateLabel(release.date);
      const tl = t('mb_type_' + (release.type || 'Release').toLowerCase()) || release.type || 'Release';
      out.push({ title: release.title, artist: artistName, dateLabel: label, dateSort: release.date,
        artistSort: artistName, typeLabel: tl,
        href: `https://www.google.com/search?q=${encodeURIComponent(release.title + ' ' + artistName)}`,
        imgSrc: release.mbid ? `https://coverartarchive.org/release-group/${release.mbid}/front-250` : null,
        imgAttr: { artist: artistName, title: release.title, sources: 'itunes,lastfm' }, isToday: false });
    }
  } else if (sectionKey === 'eventsRecent') {
    for (const { release, artistName } of items) {
      const tl = t('mb_type_' + (release.type || 'Release').toLowerCase()) || release.type || 'Release';
      out.push({ title: release.title, artist: artistName,
        dateLabel: fmtDate(new Date(release.date + 'T00:00:00')), dateSort: release.date,
        artistSort: artistName, typeLabel: tl,
        href: `https://www.google.com/search?q=${encodeURIComponent(release.title + ' ' + artistName)}`,
        imgSrc: release.mbid ? `https://coverartarchive.org/release-group/${release.mbid}/front-250` : null,
        imgAttr: { artist: artistName, title: release.title, sources: 'itunes,lastfm' }, isToday: false });
    }
  } else if (sectionKey === 'recentBirthdays') {
    for (const { artistName, dateStr, daysAgo } of items) {
      const curYr = tzNow().getFullYear();
      const birthYr = parseInt(dateStr.slice(0, 4));
      const [, mm, dd] = dateStr.split('-');
      out.push({ title: artistName,
        artist: `${fmtDate(new Date(curYr, parseInt(mm) - 1, parseInt(dd)))} · Turned ${curYr - birthYr}`,
        dateLabel: mkLabel(daysAgo, 'day') + ' ago', dateSort: -daysAgo,
        artistSort: artistName, typeLabel: '🎂 Birthday',
        href: `https://www.google.com/search?q=${encodeURIComponent(artistName + ' birthday')}`,
        imgSrc: null, imgAttr: { artist: artistName, title: '', sources: 'deezer-artist' }, isToday: false });
    }
  } else if (sectionKey === 'recentAnniversaries') {
    for (const { artistName, title, type, releaseDate, years, daysAgo, mbid } of items) {
      const tl = t('mb_type_' + (type || 'Release').toLowerCase()) || type || 'Release';
      out.push({ title, artist: artistName,
        dateLabel: mkLabel(daysAgo, 'day') + ' ago', dateSort: -daysAgo,
        artistSort: artistName, typeLabel: `🎵 ${ordinalSuffix(years)} Anniversary · ${tl} · ${releaseDate.slice(0, 4)}`,
        href: `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + artistName)}`,
        imgSrc: mbid ? `https://coverartarchive.org/release-group/${mbid}/front-250` : null,
        imgAttr: { artist: artistName, title, sources: 'deezer,itunes,lastfm' }, isToday: false });
    }
  } else if (sectionKey === 'nmf') {
    const typeMap = { album: '💿 Album', single: '🎵 Single', ep: '📀 EP' };
    for (const album of items) {
      const typeLabel = typeMap[album.record_type] || '🎶 Release';
      const href = album.link || `https://www.deezer.com/album/${album.id}`;
      const dateStr = album.release_date || '';
      out.push({
        title: album.title || '',
        artist: album.artist?.name || '',
        dateLabel: dateStr ? fmtDate(new Date(dateStr + 'T00:00:00')) : '',
        dateSort: dateStr,
        artistSort: album.artist?.name || '',
        typeLabel,
        href,
        imgSrc: album.cover_xl || album.cover_big || album.cover_medium || null,
        imgAttr: { artist: album.artist?.name || '', title: album.title || '', sources: 'deezer' },
        isToday: false
      });
    }
  } else if (sectionKey === 'concerts') {
    for (const { event, artistName } of items) {
      const date = event.dates?.start?.localDate || '';
      const time = event.dates?.start?.localTime || '';
      const venue = event._embedded?.venues?.[0];
      const venueName = venue?.name || '';
      const city = venue?.city?.name || '';
      const sc = venue?.state?.stateCode || venue?.country?.countryCode || '';
      const loc = [city, sc].filter(Boolean).join(', ');
      const url = event.url || `https://www.ticketmaster.com/search?q=${encodeURIComponent(artistName)}`;
      const sd = date ? new Date(date + 'T12:00:00') : null;
      const du = sd ? Math.round((sd - tzNow()) / 86400000) : null;
      const isToday = du === 0;
      out.push({ title: artistName, artist: `${venueName}${loc ? ' · ' + loc : ''}`,
        dateLabel: du === null ? '' : isToday ? 'TODAY' : `in ${mkLabel(du, 'day')}`,
        dateSort: du !== null ? du : 9999, artistSort: artistName,
        typeLabel: `🎤 Live Show · ${date ? fmtDate(sd) : ''}${time ? ' · ' + time.slice(0, 5) : ''}`,
        href: url, imgSrc: null,
        imgAttr: { artist: artistName, title: '', sources: 'deezer-artist' }, isToday: !!isToday });
    }
  }
  return out;
}

function _evImgTag(item, cls) {
  const attrs = `data-artist="${esc(item.imgAttr.artist)}" data-title="${esc(item.imgAttr.title)}" data-sources="${esc(item.imgAttr.sources)}"`;
  if (item.imgSrc)
    return `<img class="${cls}" src="${esc(item.imgSrc)}" onerror="releaseImgFallback(this)" alt="" loading="lazy" ${attrs}>`;
  return `<img class="${cls} upcoming-card-img-pending" alt="" loading="lazy" ${attrs}>`;
}

function _evRenderSectionByKey(sectionKey, items) {
  const gridEl = document.getElementById(EV_GRID_IDS[sectionKey]);
  if (!gridEl) return;
  const mode = eventsViewModes[sectionKey] || 'tiles';

  const nmfCalOuter = document.getElementById('nmfCalOuter');

  if (sectionKey === 'nmf' && mode === 'calendar') {
    if (nmfCalOuter) nmfCalOuter.style.display = '';
    const history = _getNMFHistory();
    const fridays = Object.keys(history).sort().reverse();
    if (!_nmfCalSelectedFriday || !history[_nmfCalSelectedFriday]) {
      _nmfCalSelectedFriday = fridays[0] || null;
    }
    renderNMFCalendar();
    const selAlbums = (_nmfCalSelectedFriday && history[_nmfCalSelectedFriday]) || items || [];
    gridEl.className = 'upcoming-grid';
    gridEl.innerHTML = selAlbums.map(renderNMFCard).join('');
    triggerPendingImgs(gridEl);
    return;
  }

  if (sectionKey === 'nmf' && nmfCalOuter) nmfCalOuter.style.display = 'none';

  if (mode === 'tiles') {
    gridEl.className = 'upcoming-grid';
    if (!items.length) { gridEl.innerHTML = ''; return; }
    if (sectionKey === 'birthdays') gridEl.innerHTML = items.map(renderBirthdayCard).join('');
    else if (sectionKey === 'anniversaries') gridEl.innerHTML = items.map(renderAnniversaryCard).join('');
    else if (sectionKey === 'eventsUpcoming') gridEl.innerHTML = items.map(({ release, artistName }) => renderUpcomingCard(release, artistName)).join('');
    else if (sectionKey === 'eventsRecent') gridEl.innerHTML = items.map(({ release, artistName }) => renderRecentCard(release, artistName)).join('');
    else if (sectionKey === 'recentBirthdays') gridEl.innerHTML = items.map(renderRecentBirthdayCard).join('');
    else if (sectionKey === 'recentAnniversaries') gridEl.innerHTML = items.map(renderRecentAnniversaryCard).join('');
    else if (sectionKey === 'concerts') gridEl.innerHTML = items.map(({ event, artistName }) => renderConcertCard(event, artistName)).join('');
    else if (sectionKey === 'nmf') gridEl.innerHTML = items.map(renderNMFCard).join('');
    triggerPendingImgs(gridEl);
    return;
  }
  const normalized = _evNormalize(sectionKey, items);
  if (!normalized || !normalized.length) { gridEl.innerHTML = ''; gridEl.className = ''; return; }
  if (mode === 'table') _evTable(gridEl, normalized);
  else if (mode === 'carousel') _evCarousel(gridEl, normalized);
  else if (mode === 'list') _evList(gridEl, sectionKey, normalized);
}

function _evTable(gridEl, items) {
  gridEl.className = 'ev-table-wrap';
  const rows = items.map(item =>
    `<tr><td class="ev-tbl-img">${_evImgTag(item, 'ev-tbl-thumb')}</td>` +
    `<td class="ev-tbl-ev"><a class="ev-tbl-link" href="${esc(item.href)}" target="_blank" rel="noopener noreferrer">${esc(item.title)}</a></td>` +
    `<td class="ev-tbl-artist">${esc(item.artist)}</td>` +
    `<td class="ev-tbl-date">${esc(item.dateLabel)}</td>` +
    `<td class="ev-tbl-type">${esc(item.typeLabel)}</td></tr>`
  ).join('');
  gridEl.innerHTML = `<table class="ev-table"><thead><tr><th></th><th>Event</th><th>Artist</th><th>Date</th><th>Type</th></tr></thead><tbody>${rows}</tbody></table>`;
  triggerPendingImgs(gridEl);
}

function _evCarousel(gridEl, items) {
  gridEl.className = 'ev-carousel-outer';
  const dur = Math.max(20, items.length * 3);
  const card = item =>
    `<a class="ev-carousel-card${item.isToday ? ' event-today' : ''}" href="${esc(item.href)}" target="_blank" rel="noopener noreferrer">` +
    `${_evImgTag(item, 'ev-carousel-img')}` +
    `<div class="ev-carousel-date">${esc(item.dateLabel)}</div>` +
    `<div class="ev-carousel-title">${esc(item.title)}</div>` +
    `<div class="ev-carousel-artist">${esc(item.artist)}</div>` +
    `<div class="ev-carousel-type">${esc(item.typeLabel)}</div></a>`;
  const cards = items.map(card).join('');
  gridEl.innerHTML = `<div class="ev-carousel-track" style="animation-duration:${dur}s">${cards}${cards}</div>`;
  triggerPendingImgs(gridEl);
}

function _evList(gridEl, sectionKey, items) {
  gridEl.className = 'ev-list-wrap';
  const sort = gridEl.dataset.evListSort || 'date';
  const sorted = [...items].sort((a, b) =>
    sort === 'artist' ? a.artistSort.localeCompare(b.artistSort)
    : typeof a.dateSort === 'string' ? a.dateSort.localeCompare(b.dateSort) : a.dateSort - b.dateSort
  );
  const rows = sorted.map(item =>
    `<a class="ev-list-row${item.isToday ? ' event-today' : ''}" href="${esc(item.href)}" target="_blank" rel="noopener noreferrer">` +
    `<span class="ev-list-date">${esc(item.dateLabel)}</span>` +
    `<span class="ev-list-title">${esc(item.title)}</span>` +
    `<span class="ev-list-artist">${esc(item.artist)}</span>` +
    `<span class="ev-list-type">${esc(item.typeLabel)}</span></a>`
  ).join('');
  gridEl.innerHTML =
    `<div class="ev-list-sort"><span class="ev-list-sort-lbl">Sort:</span>` +
    `<button class="ev-list-sort-btn${sort === 'date' ? ' active' : ''}" onclick="sortEvListView('${esc(sectionKey)}','date')">Date</button>` +
    `<button class="ev-list-sort-btn${sort === 'artist' ? ' active' : ''}" onclick="sortEvListView('${esc(sectionKey)}','artist')">Artist</button></div>` +
    `<div class="ev-list-items">${rows}</div>`;
}

function sortEvListView(sectionKey, sortBy) {
  const gridEl = document.getElementById(EV_GRID_IDS[sectionKey]);
  if (!gridEl) return;
  gridEl.dataset.evListSort = sortBy;
  _evReRenderSection(sectionKey);
}

function renderEventsPartial(birthdays, anniversaries, recentBirthdays, recentAnniversaries, eventsUpcoming, eventsRecent) {
  _eventsLastData = { birthdays, anniversaries, recentBirthdays, recentAnniversaries, eventsUpcoming, eventsRecent };
  const f = applyEventsTypeFilter(_eventsLastData);
  const sortFn = (a, b) => a.daysUntil - b.daysUntil;
  const sortFnAgo = (a, b) => a.daysAgo - b.daysAgo;
  if (f.birthdays.length) _evRenderSectionByKey('birthdays', [...f.birthdays].sort(sortFn));
  if (f.anniversaries.length) _evRenderSectionByKey('anniversaries', [...f.anniversaries].sort(sortFn));
  if (f.recentBirthdays.length) _evRenderSectionByKey('recentBirthdays', [...f.recentBirthdays].sort(sortFnAgo));
  if (f.recentAnniversaries.length) _evRenderSectionByKey('recentAnniversaries', [...f.recentAnniversaries].sort(sortFnAgo));
  if (f.eventsUpcoming.length) _evRenderSectionByKey('eventsUpcoming', sortUpcomingReleases([...f.eventsUpcoming]));
  if (f.eventsRecent.length) _evRenderSectionByKey('eventsRecent', sortRecentReleases([...f.eventsRecent]));
  renderEventsCalendar(f, eventsCalendarYear, eventsCalendarMonth);
}

async function fetchConcertsForArtist(artistName, apiKey) {
  const today = tzNow().toISOString().slice(0, 10) + 'T00:00:00Z';
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(artistName)}&classificationName=music&apikey=${encodeURIComponent(apiKey)}&size=5&sort=date,asc&startDateTime=${today}`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) return [];
    const data = await resp.json();
    return data._embedded?.events || [];
  } catch (e) { return []; }
}

function renderConcertCard(event, artistName) {
  const date = event.dates?.start?.localDate || '';
  const time = event.dates?.start?.localTime || '';
  const venue = event._embedded?.venues?.[0];
  const venueName = venue?.name || '';
  const city = venue?.city?.name || '';
  const stateCode = venue?.state?.stateCode || venue?.country?.countryCode || '';
  const location = [city, stateCode].filter(Boolean).join(', ');
  const url = event.url || `https://www.ticketmaster.com/search?q=${encodeURIComponent(artistName)}`;

  const today = tzNow();
  const showDate = date ? new Date(date + 'T12:00:00') : null;
  const daysUntil = showDate ? Math.round((showDate - today) / 86400000) : null;
  const isToday = daysUntil === 0;
  const countdownLabel = daysUntil === null ? '' : isToday ? 'TODAY' : `in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`;
  const isSoon = daysUntil !== null && daysUntil <= 7;
  const displayDate = date ? fmtDate(showDate) : '';
  const timeLabel = time ? ' · ' + time.slice(0, 5) : '';

  const imgHtml = `<img class="upcoming-card-img upcoming-card-img-pending" alt="" loading="lazy" data-artist="${esc(artistName)}" data-title="" data-sources="deezer-artist">`;
  return `<a class="upcoming-card${isToday ? ' event-today' : ''}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">
    ${imgHtml}
    <div class="upcoming-card-date${isToday || isSoon ? ' soon' : ''}">${esc(countdownLabel)}</div>
    <div class="upcoming-card-title">${esc(artistName)}</div>
    <div class="upcoming-card-artist">${esc(venueName)}${location ? ' · ' + esc(location) : ''}</div>
    <div class="upcoming-card-type">🎤 Live Show · ${esc(displayDate)}${esc(timeLabel)}</div>
  </a>`;
}

// ─── NMF History helpers ───────────────────────────────────────
function _mostRecentFriday(refDate) {
  const d = refDate || tzNow();
  const offset = (d.getDay() - 5 + 7) % 7;
  const friday = new Date(d);
  friday.setDate(d.getDate() - offset);
  return localDateStr(friday);
}

function _getNMFHistory() {
  try { return JSON.parse(localStorage.getItem(NMF_HISTORY_KEY) || '{}'); } catch (e) { return {}; }
}

// Returns true if a new week was added. Idempotent — won't overwrite an existing Friday entry.
function _saveNMFSnapshot(albums, ts) {
  const refDate = ts ? new Date(ts) : tzNow();
  const friday = _mostRecentFriday(refDate);
  const history = _getNMFHistory();
  if (history[friday]) return false;
  history[friday] = albums.map(a => ({
    id: a.id, title: a.title || '',
    artist: { name: a.artist?.name || '' },
    cover_medium: a.cover_medium || '',
    cover_big: a.cover_big || '',
    cover_xl: a.cover_xl || '',
    link: a.link || '',
    record_type: a.record_type || 'album',
    release_date: a.release_date || ''
  }));
  const keys = Object.keys(history).sort().reverse();
  keys.slice(NMF_HISTORY_MAX_WEEKS).forEach(k => delete history[k]);
  try { localStorage.setItem(NMF_HISTORY_KEY, JSON.stringify(history)); } catch (e) {}
  return true;
}

// ─── NMF Calendar ─────────────────────────────────────────────
function renderNMFCalendar() {
  const calGrid = document.getElementById('nmfCalGrid');
  const titleEl = document.getElementById('nmfCalTitle');
  if (!calGrid || !titleEl) return;

  const history = _getNMFHistory();
  const year = _nmfCalYear;
  const month = _nmfCalMonth;
  const todayStr = localDateStr(tzNow());
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  titleEl.innerHTML = `<span class="cal-title-month">${_CAL_MONTHS[month]}</span><span class="cal-title-year">${year}</span>`;

  let html = _CAL_DAYS.map(d => `<div class="cal-dow">${d}</div>`).join('');
  for (let i = 0; i < firstDow; i++) html += '<div class="cal-cell cal-cell-empty"></div>';

  for (let d = 1; d <= daysInMonth; d++) {
    const ds = _calDateStr(year, month, d);
    const isFriday = new Date(year, month, d).getDay() === 5;
    const hasData = isFriday && !!history[ds];
    const isSelected = ds === _nmfCalSelectedFriday;
    const isToday = ds === todayStr;
    const isPast = ds < todayStr;
    const count = hasData ? history[ds].length : 0;

    let cls = 'cal-cell';
    if (isToday) cls += ' cal-today';
    else if (isPast) cls += ' cal-past';
    if (isFriday) cls += ' nmf-cal-friday';
    if (hasData) cls += ' nmf-cal-has-data';
    if (isSelected) cls += ' nmf-cal-selected';

    const onclick = hasData ? ` onclick="selectNMFFriday('${ds}')"` : '';
    html += `<div class="${cls}"${onclick}>` +
      `<div class="cal-cell-num">${d}</div>` +
      (hasData ? `<div class="nmf-cal-pill">${count} release${count !== 1 ? 's' : ''}</div>` : '') +
      `</div>`;
  }

  calGrid.className = 'events-cal-grid';
  calGrid.innerHTML = html;
}

function selectNMFFriday(dateStr) {
  _nmfCalSelectedFriday = dateStr;
  const history = _getNMFHistory();
  const albums = history[dateStr] || [];
  const gridEl = document.getElementById('nmfGrid');
  if (gridEl) {
    gridEl.className = 'upcoming-grid';
    gridEl.innerHTML = albums.map(renderNMFCard).join('');
    triggerPendingImgs(gridEl);
  }
  renderNMFCalendar();
}

function nmfCalPrev() {
  _nmfCalMonth--;
  if (_nmfCalMonth < 0) { _nmfCalMonth = 11; _nmfCalYear--; }
  renderNMFCalendar();
}

function nmfCalNext() {
  _nmfCalMonth++;
  if (_nmfCalMonth > 11) { _nmfCalMonth = 0; _nmfCalYear++; }
  renderNMFCalendar();
}

function renderNMFCard(album) {
  const cover = album.cover_xl || album.cover_big || album.cover_medium || '';
  const typeMap = { album: '💿 Album', single: '🎵 Single', ep: '📀 EP' };
  const typeLabel = typeMap[album.record_type] || '🎶 Release';
  const href = album.link || `https://www.deezer.com/album/${album.id}`;
  const dateStr = album.release_date ? fmtDate(new Date(album.release_date + 'T00:00:00')) : '';
  const imgHtml = cover
    ? `<img class="upcoming-card-img" src="${esc(cover)}" onerror="releaseImgFallback(this)" alt="" loading="lazy" data-artist="${esc(album.artist?.name||'')}" data-title="${esc(album.title||'')}" data-sources="deezer">`
    : `<img class="upcoming-card-img upcoming-card-img-pending" alt="" loading="lazy" data-artist="${esc(album.artist?.name||'')}" data-title="${esc(album.title||'')}" data-sources="deezer">`;
  return `<a class="upcoming-card" href="${esc(href)}" target="_blank" rel="noopener noreferrer">
    ${imgHtml}
    <div class="upcoming-card-date">${esc(dateStr)}</div>
    <div class="upcoming-card-title">${esc(album.title || '')}</div>
    <div class="upcoming-card-artist">${esc(album.artist?.name || '')}</div>
    <div class="upcoming-card-type">${esc(typeLabel)}</div>
  </a>`;
}

function _renderNMF(albums, fromCache) {
  _nmfData = albums;
  if (albums.length) {
    let snapshotTs = Date.now();
    if (fromCache) {
      try { snapshotTs = JSON.parse(localStorage.getItem(NMF_CACHE_KEY)).ts; } catch (e) {}
    }
    const addedNew = _saveNMFSnapshot(albums, snapshotTs);
    if (addedNew && eventsViewModes['nmf'] === 'calendar') renderNMFCalendar();
  }
  const gridEl = document.getElementById('nmfGrid');
  const status = document.getElementById('nmfStatus');
  const refreshBtn = document.getElementById('nmfRefreshBtn');
  if (gridEl) {
    if (albums.length) {
      _evRenderSectionByKey('nmf', albums);
    } else {
      gridEl.className = 'upcoming-grid';
      gridEl.innerHTML = '<div class="upcoming-empty">No new releases found.</div>';
    }
  }
  if (refreshBtn) refreshBtn.style.display = 'block';
  if (status) {
    const ts = fromCache
      ? (() => { try { return new Date(JSON.parse(localStorage.getItem(NMF_CACHE_KEY)).ts).toLocaleString(); } catch (e) { return ''; } })()
      : new Date().toLocaleString();
    status.textContent = `${albums.length} release${albums.length !== 1 ? 's' : ''} · Deezer Editorial · ${ts}${fromCache ? ' (cached)' : ''}`;
  }
}

async function loadNMF(forceRefresh = false) {
  const status = document.getElementById('nmfStatus');
  const refreshBtn = document.getElementById('nmfRefreshBtn');

  if (!forceRefresh) {
    try {
      const cached = JSON.parse(localStorage.getItem(NMF_CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.ts < NMF_CACHE_TTL && cached.albums && cached.albums.length) {
        _renderNMF(cached.albums, true);
        return;
      }
    } catch (e) {}
  }

  if (status) status.textContent = 'Fetching new releases from Deezer…';
  if (refreshBtn) refreshBtn.style.display = 'none';

  try {
    const [relR, tracksR] = await Promise.all([
      deezerFetch('editorial/0/releases?limit=100'),
      deezerFetch('chart/0/tracks?limit=100')
    ]);

    const albums = relR.ok ? ((await relR.json())?.data || []) : [];
    const tracks = tracksR.ok ? ((await tracksR.json())?.data || []) : [];

    // Add chart tracks released in the last 14 days that aren't already in the editorial list
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14);
    const cutoffStr = localDateStr(cutoff);
    const seenIds = new Set(albums.map(a => a.id));

    for (const track of tracks) {
      const alb = track.album;
      if (!alb || !alb.release_date || alb.release_date < cutoffStr) continue;
      if (seenIds.has(alb.id)) continue;
      seenIds.add(alb.id);
      albums.push({
        id: alb.id,
        title: alb.title || track.title,
        link: alb.link || `https://www.deezer.com/album/${alb.id}`,
        cover: alb.cover || '',
        cover_medium: alb.cover_medium || '',
        cover_big: alb.cover_big || '',
        cover_xl: alb.cover_xl || '',
        release_date: alb.release_date,
        record_type: 'single',
        artist: track.artist || {},
        type: 'album'
      });
    }

    albums.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));

    try { localStorage.setItem(NMF_CACHE_KEY, JSON.stringify({ ts: Date.now(), albums })); } catch (e) {}
    _renderNMF(albums, false);
  } catch (e) {
    if (status) status.textContent = 'Could not load new releases — try again later.';
    if (refreshBtn) refreshBtn.style.display = 'block';
  }
}

async function loadConcerts(forceRefresh = false) {
  _syncConcertsSectionVisibility();
  if (!allPlays.length) return;

  if (!forceRefresh) {
    try {
      const cached = JSON.parse(localStorage.getItem(CONCERTS_CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.ts < CONCERTS_CACHE_TTL) {
        _renderConcerts(cached.shows, true);
        return;
      }
    } catch (e) {}
  }

  const artists = getTopNArtists(CONCERTS_ARTIST_LIMIT);
  const statusEl = document.getElementById('concertsStatus');
  const gridEl = document.getElementById('concertsGrid');
  const refreshEl = document.getElementById('concertsRefreshBtn');
  if (statusEl) statusEl.textContent = `Fetching shows for top ${artists.length} artists…`;
  if (gridEl) gridEl.innerHTML = '';
  if (refreshEl) refreshEl.style.display = 'none';

  const allShows = [];
  for (let i = 0; i < artists.length; i++) {
    const name = artists[i];
    if (statusEl) statusEl.textContent = `Fetching shows (${i + 1}/${artists.length}): ${name}`;
    const events = await fetchConcertsForArtist(name, tmApiKey);
    for (const ev of events) allShows.push({ event: ev, artistName: name });
  }

  allShows.sort((a, b) =>
    (a.event.dates?.start?.localDate || '').localeCompare(b.event.dates?.start?.localDate || ''));

  try {
    localStorage.setItem(CONCERTS_CACHE_KEY, JSON.stringify({ ts: Date.now(), shows: allShows }));
  } catch (e) {}

  _renderConcerts(allShows, false);
}

function _renderConcerts(shows, fromCache) {
  _concertsData = shows;
  _syncConcertsSectionVisibility();
  const grid = document.getElementById('concertsGrid');
  const status = document.getElementById('concertsStatus');
  const refreshBtn = document.getElementById('concertsRefreshBtn');

  if (grid) {
    if (shows.length) {
      _evRenderSectionByKey('concerts', shows);
    } else {
      grid.className = 'upcoming-grid';
      grid.innerHTML = `<div class="upcoming-empty">No upcoming shows found for your top ${CONCERTS_ARTIST_LIMIT} artists.</div>`;
    }
  }
  if (refreshBtn) refreshBtn.style.display = 'block';
  if (status) {
    const cacheNote = fromCache ? ' (cached)' : '';
    const ts = fromCache
      ? (() => { try { return new Date(JSON.parse(localStorage.getItem(CONCERTS_CACHE_KEY)).ts).toLocaleString(); } catch (e) { return ''; } })()
      : new Date().toLocaleString();
    status.textContent = `${shows.length} show${shows.length !== 1 ? 's' : ''} · top ${CONCERTS_ARTIST_LIMIT} artists · ${ts}${cacheNote}`;
  }
  if (_eventsCalendarData) renderEventsCalendar(_eventsCalendarData, eventsCalendarYear, eventsCalendarMonth);
}

function _eventsFromCache(cached) {
  renderEventsResults(
    cached.birthdays, cached.anniversaries,
    cached.recentBirthdays || [], cached.recentAnniversaries || [],
    cached.eventsUpcoming || [], cached.eventsRecent || [],
    cached.artists, true
  );
}

function _isCacheValid(cached) {
  return cached && Date.now() - cached.ts < EVENTS_CACHE_TTL && cached.limit === eventsArtistLimit && cached.eventsUpcoming;
}

async function loadEvents(forceRefresh = false) {
  if (!allPlays.length) return;

  if (!forceRefresh) {
    // 1. Check localStorage (instant, same device)
    try {
      const cached = JSON.parse(localStorage.getItem(EVENTS_CACHE_KEY) || 'null');
      if (_isCacheValid(cached)) { _eventsFromCache(cached); return; }
    } catch (e) {}

    // 2. Check Firestore (cross-device, cross-login)
    if (typeof dcLoadEventsCache === 'function') {
      const statusEl2 = document.getElementById('eventsStatus');
      if (statusEl2) statusEl2.textContent = 'Loading events…';
      try {
        const fsCached = await dcLoadEventsCache();
        if (_isCacheValid(fsCached)) {
          try { localStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify(fsCached)); } catch (e) {}
          _eventsFromCache(fsCached);
          return;
        }
      } catch (e) {}
    }
  }

  const artists = getTopNArtists(eventsArtistLimit);
  const statusEl = document.getElementById('eventsStatus');
  const refreshEl = document.getElementById('eventsRefreshBtn');
  if (!statusEl) return;

  ['birthdaysGrid', 'anniversariesGrid', 'eventsRecentBirthdaysGrid', 'eventsRecentAnniversariesGrid', 'eventsUpcomingGrid', 'eventsRecentGrid'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });
  if (refreshEl) refreshEl.style.display = 'none';
  statusEl.textContent = `Fetching events for top ${artists.length} artists…`;

  const birthdays = [];
  const anniversaries = [];
  const recentBirthdays = [];
  const recentAnniversaries = [];
  const eventsUpcoming = [];
  const eventsRecent = [];

  for (let i = 0; i < artists.length; i++) {
    const name = artists[i];
    statusEl.textContent = `Fetching (${i + 1}/${artists.length}): ${name}`;

    const mbid = await searchArtistMBID(name);

    // Birthday: MusicBrainz (from search result cache) → TheAudioDB → Wikidata
    let birthday = _mbBirthdayCache[name] || null;
    if (!birthday) birthday = await fetchBirthdayTADB(name);
    if (!birthday) birthday = await fetchBirthdayWikidata(name);

    if (birthday && birthday.length >= 10) {
      const mmdd = birthday.slice(5, 10);
      const days = daysUntilNextOccurrence(mmdd, EVENTS_WINDOW_DAYS);
      if (days !== null) birthdays.push({ artistName: name, dateStr: birthday, mmdd, daysUntil: days });
      const daysAgo = daysSinceLastOccurrence(mmdd, EVENTS_WINDOW_DAYS);
      if (daysAgo !== null) recentBirthdays.push({ artistName: name, dateStr: birthday, mmdd, daysAgo });
    }

    // Album anniversaries + upcoming/recent releases from shared MB releases cache
    if (mbid) {
      const groups = await fetchAllReleasesRaw(mbid);
      const currentYear = tzNow().getFullYear();
      for (const g of groups) {
        const type = g['primary-type'] || 'Release';
        const validReleases = (g.releases || []).filter(r => r.date && r.date.length >= 10 && !r.date.slice(5, 10).includes('00'));
        const entries = validReleases.length > 0
          ? validReleases.map(r => ({ date: r.date, title: r.title || g.title }))
          : (g['first-release-date'] && g['first-release-date'].length >= 10 ? [{ date: g['first-release-date'], title: g.title }] : []);
        for (const { date, title } of entries) {
          const mmdd = date.slice(5, 10);
          if (mmdd.includes('00')) continue;
          const releaseYear = parseInt(date.slice(0, 4));
          if (releaseYear >= currentYear) continue;
          const years = currentYear - releaseYear;
          const days = daysUntilNextOccurrence(mmdd, EVENTS_WINDOW_DAYS);
          if (days !== null) {
            anniversaries.push({ artistName: name, title, type, releaseDate: date, years, mmdd, daysUntil: days, mbid: g.id });
          }
          const daysAgo = daysSinceLastOccurrence(mmdd, EVENTS_WINDOW_DAYS);
          if (daysAgo !== null) {
            recentAnniversaries.push({ artistName: name, title, type, releaseDate: date, years, mmdd, daysAgo, mbid: g.id });
          }
        }
      }

      const upcomingRels = await fetchReleasesForMBID(mbid);
      for (const r of upcomingRels) eventsUpcoming.push({ release: r, artistName: name });
      const recentRels = await fetchRecentReleasesForMBID(mbid);
      for (const r of recentRels) eventsRecent.push({ release: r, artistName: name });
    }

    if (i % 5 === 4 || i === artists.length - 1) renderEventsPartial(birthdays, anniversaries, recentBirthdays, recentAnniversaries, eventsUpcoming, eventsRecent);
  }

  const cacheData = { ts: Date.now(), limit: eventsArtistLimit, birthdays, anniversaries, recentBirthdays, recentAnniversaries, eventsUpcoming, eventsRecent, artists };
  try { localStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify(cacheData)); } catch (e) {}
  if (typeof dcSaveEventsCache === 'function') dcSaveEventsCache(cacheData);

  renderEventsResults(birthdays, anniversaries, recentBirthdays, recentAnniversaries, eventsUpcoming, eventsRecent, artists, false);
}

function renderEventsResults(birthdays, anniversaries, recentBirthdays, recentAnniversaries, eventsUpcoming, eventsRecent, artists, fromCache) {
  _eventsRawData = { birthdays, anniversaries, recentBirthdays, recentAnniversaries, eventsUpcoming, eventsRecent };
  _eventsArtists = artists;
  _renderEventsFromRaw(_eventsRawData, artists, fromCache);
}

function _renderEventsFromRaw(raw, artists, fromCache) {
  _eventsLastData = raw;
  const f = applyEventsTypeFilter(raw);
  const statusEl = document.getElementById('eventsStatus');
  const refreshEl = document.getElementById('eventsRefreshBtn');
  const sortFn = (a, b) => a.daysUntil - b.daysUntil;
  const sortFnAgo = (a, b) => a.daysAgo - b.daysAgo;
  const emptyGrid = (key, msg) => {
    const el = document.getElementById(EV_GRID_IDS[key]);
    if (el) { el.className = 'upcoming-grid'; el.innerHTML = `<div class="upcoming-empty">${msg}</div>`; }
  };
  const renderSec = (key, items, emptyMsg) => items.length
    ? _evRenderSectionByKey(key, items)
    : emptyGrid(key, emptyMsg);

  renderSec('birthdays', [...f.birthdays].sort(sortFn),
    `No birthdays found in the next ${EVENTS_WINDOW_DAYS} days for your top ${artists.length} artists.`);
  renderSec('anniversaries', [...f.anniversaries].sort(sortFn),
    `No anniversaries found in the next ${EVENTS_WINDOW_DAYS} days for your top ${artists.length} artists.`);
  renderSec('recentBirthdays', [...f.recentBirthdays].sort(sortFnAgo),
    `No birthdays found in the past ${EVENTS_WINDOW_DAYS} days for your top ${artists.length} artists.`);
  renderSec('recentAnniversaries', [...f.recentAnniversaries].sort(sortFnAgo),
    `No anniversaries found in the past ${EVENTS_WINDOW_DAYS} days for your top ${artists.length} artists.`);
  renderSec('eventsUpcoming', sortUpcomingReleases([...f.eventsUpcoming]),
    `No upcoming releases in the next 90 days for your top ${artists.length} artists.`);
  renderSec('eventsRecent', sortRecentReleases([...f.eventsRecent]),
    `No recent releases in the past 6 months for your top ${artists.length} artists.`);

  _eventsCalendarData = f;
  renderEventsCalendar(_eventsCalendarData, eventsCalendarYear, eventsCalendarMonth);

  const cacheNote = fromCache ? ' (cached)' : '';
  const ts = fromCache
    ? (() => { try { return new Date(JSON.parse(localStorage.getItem(EVENTS_CACHE_KEY)).ts).toLocaleString(); } catch (e) { return ''; } })()
    : new Date().toLocaleString();
  if (statusEl) statusEl.textContent = `${raw.birthdays.length} birthdays · ${raw.anniversaries.length} anniversaries · ${raw.eventsUpcoming.length} upcoming · ${raw.eventsRecent.length} recent · top ${artists.length} artists · ${ts}${cacheNote}`;
  if (refreshEl) refreshEl.style.display = 'block';

  const sel = document.getElementById('eventsLimitSelect');
  if (sel) sel.value = eventsArtistLimit;

  _syncEventsTypeFilter();
}

function eventsLimitChanged(val) {
  const newLimit = parseInt(val) || 50;
  if (newLimit === eventsArtistLimit) return;
  eventsArtistLimit = newLimit;
  localStorage.setItem('dc_events_artist_limit', newLimit);
  localStorage.removeItem(EVENTS_CACHE_KEY);
  loadEvents(true);
}

// ── FILE IMPORT (Spotify ZIP, Deezer XLSX, CSV) ────────────────────

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

// Flexible datetime parser for imported data
const _IMPORT_ES_MONTHS = {ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,oct:9,nov:10,dic:11};
function parseDtStrImport(s) {
  if (!s) return null;
  s = s.trim();
  if (/^\d{10,}$/.test(s)) return new Date(parseInt(s) * 1000);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(s.includes('T') ? s : s.replace(' ', 'T') + (s.length <= 10 ? 'T00:00:00Z' : 'Z'));
    if (!isNaN(d)) return d;
  }
  const mES = s.match(/^(\d{1,2})\/([a-zA-Z]{3})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (mES) {
    const mon = _IMPORT_ES_MONTHS[mES[2].toLowerCase()];
    if (mon !== undefined) {
      const d = new Date(Date.UTC(+mES[3], mon, +mES[1], +mES[4], +mES[5], +(mES[6]||0)));
      if (!isNaN(d)) return d;
    }
  }
  const d = new Date(s);
  return isNaN(d) ? null : d;
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
      const dt = parseDtStrImport(item.ts || item.endTime || '');
      if (!dt) continue;
      const track  = item.master_metadata_track_name || item.trackName || '';
      const artist = item.master_metadata_album_artist_name || item.artistName || '';
      if (!track || !artist) continue;
      scrobbles.push({ artist, album: item.master_metadata_album_album_name || '—', track, date: dt });
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
    if (['song','title','track','titre','piste'].some(x => h.includes(x))) { if (col.track == null) col.track = i; }
    else if (['artist','artiste'].some(x => h.includes(x)))                { if (col.artist == null) col.artist = i; }
    else if (h.includes('album'))                                           { if (col.album == null) col.album = i; }
    else if (['date','time','listened','ecoute'].some(x => h.includes(x))) { if (col.ts == null) col.ts = i; }
  });
  const scrobbles = [];
  for (const row of rows.slice(1)) {
    const get = k => col[k] != null ? String(row[col[k]] || '') : '';
    const dt = parseDtStrImport(get('ts'));
    if (!dt) continue;
    const artist = get('artist'), track = get('track');
    if (!artist || !track) continue;
    scrobbles.push({ artist, album: get('album') || '—', track, date: dt });
  }
  return scrobbles;
}

async function importFileData(file) {
  if (!file) return;
  const statusEl = document.getElementById('srcFileStatus');
  if (statusEl) statusEl.textContent = `Parsing ${file.name}…`;
  try {
    const fname = file.name.toLowerCase();
    if (fname.endsWith('.csv')) {
      // CSV: delegate to existing parseCsv which sets allPlays and calls finalizeLoad
      const text = await readFileAsText(file);
      parseCsv(text, false);
      if (!allPlays.length) { if (statusEl) statusEl.textContent = 'No valid records found.'; return; }
      const compact = allPlays.map(p => [p.title, p.artist, p.album, Math.floor(p.date.getTime()/1000)]);
      await saveToIDB(IDB_FILE_KEY, { ts: Date.now(), data: compact });
      localStorage.setItem('dc_source', 'file');
      if (statusEl) statusEl.textContent = `✓ ${allPlays.length.toLocaleString()} plays loaded`;
      closeSourceModal();
      return;
    }
    let plays = [];
    if (fname.endsWith('.zip')) {
      const scrobbles = await parseSpotifyZip(file);
      plays = scrobbles.map(s => {
        const ar = s.artist || '';
        return { title: s.track || '', artist: ar, artists: splitArtists(ar), album: s.album || '—', date: s.date };
      });
    } else if (fname.endsWith('.xlsx') || fname.endsWith('.xls')) {
      const scrobbles = await parseDeezerXlsx(file);
      plays = scrobbles.map(s => {
        const ar = s.artist || '';
        return { title: s.track || '', artist: ar, artists: splitArtists(ar), album: s.album || '—', date: s.date };
      });
    } else {
      if (statusEl) statusEl.textContent = 'Unsupported file type.';
      return;
    }
    plays = plays.filter(p => p.title && p.artist && p.date && !isNaN(p.date));
    if (!plays.length) { if (statusEl) statusEl.textContent = 'No valid records found.'; return; }
    plays.sort((a, b) => b.date - a.date);
    allPlays = plays;
    const compact = allPlays.map(p => [p.title, p.artist, p.album, Math.floor(p.date.getTime()/1000)]);
    await saveToIDB(IDB_FILE_KEY, { ts: Date.now(), data: compact });
    localStorage.setItem('dc_source', 'file');
    if (statusEl) statusEl.textContent = `✓ ${allPlays.length.toLocaleString()} plays loaded`;
    closeSourceModal();
    setSyncStatus(`✓ ${allPlays.length.toLocaleString()} plays loaded from ${file.name}`, 'ok');
    finalizeLoad();
  } catch (e) {
    if (statusEl) statusEl.textContent = `Error: ${e.message}`;
  }
}

function initSrcFileUpload() {
  const zone = document.getElementById('srcFileDrop');
  const input = document.getElementById('srcFileInput');
  if (!zone || !input) return;
  input.addEventListener('change', () => { if (input.files[0]) importFileData(input.files[0]); input.value = ''; });
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) importFileData(e.dataTransfer.files[0]);
  });
}

// ─── YOUTUBE PLAYER ───────────────────────────────────────────────────────────

let _ytPlayer          = null;
let _ytApiReady        = false;
let _ytPendingVideo    = null;
let _ytScrobbleTimer   = null;
let _ytCurrentTrack    = null;
let _ytScrobbled       = false;
let _ytActiveBtn       = null;
let _ytCurrentVideoId  = null;
let _ytQueue           = [];
let _ytQueueToastTimer = null;
let _ytDragInitialized = false;
let _ytExpandSize      = 0; // 0=small, 1=medium, 2=large
let _ytEmbedRetry      = 0;

// Called automatically by the YouTube IFrame API script once it loads.
function onYouTubeIframeAPIReady() {
  _ytApiReady = true;
  if (_ytPendingVideo) {
    _ytLoadVideo(_ytPendingVideo);
    _ytPendingVideo = null;
  }
}

function _ytInjectApi() {
  if (document.getElementById('yt-iframe-api')) return;
  const s = document.createElement('script');
  s.id  = 'yt-iframe-api';
  s.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);
}

function ytPlayFromBtn(btn) {
  const playerEl = document.getElementById('ytMiniPlayer');
  if (_ytCurrentTrack && playerEl && playerEl.style.display !== 'none') {
    _ytShowQueueToast(btn.dataset.title, btn.dataset.artist, btn.dataset.album, btn);
  } else {
    openYtPlayer(btn.dataset.title, btn.dataset.artist, btn.dataset.album, btn);
  }
}

function _ytPlayOrQueue(title, artist, album) {
  const playerEl = document.getElementById('ytMiniPlayer');
  if (_ytCurrentTrack && playerEl && playerEl.style.display !== 'none') {
    _ytShowQueueToast(title, artist, album, null);
  } else {
    openYtPlayer(title, artist, album, null);
  }
}

function openYtPlayer(title, artist, album, btn) {
  if (_ytActiveBtn) _ytActiveBtn.classList.remove('yt-btn-loading', 'yt-btn-playing');
  _ytCurrentTrack   = { title, artist, album };
  _ytCurrentVideoId = null;
  _ytScrobbled      = false;
  _ytEmbedRetry     = 0;
  clearTimeout(_ytScrobbleTimer);
  _ytActiveBtn = btn || null;
  if (_ytActiveBtn) _ytActiveBtn.classList.add('yt-btn-loading');
  const player = document.getElementById('ytMiniPlayer');
  player.style.display = '';
  document.getElementById('ytMiniTitle').textContent  = title;
  document.getElementById('ytMiniArtist').textContent = artist;
  const statusEl = document.getElementById('ytMiniStatus');
  statusEl.textContent = 'Searching…';
  statusEl.className   = 'yt-mini-status';
  const pauseBtn = document.getElementById('ytMiniPauseBtn');
  if (pauseBtn) { pauseBtn.textContent = '⏸'; pauseBtn.title = 'Pause'; }
  if (!_ytDragInitialized) { _ytDragInitialized = true; _ytInitDrag(); }
  _ytInjectApi();
  _ytSearch(artist, title);
}

async function _ytSearch(artist, title, overrideQuery) {
  const query = overrideQuery || (artist + ' ' + title + ' official audio');
  try {
    const res  = await fetch(`${BACKEND_API}/api/youtube/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    const videoId = data.videoId;
    if (!videoId) throw new Error('No results found');
    _ytCurrentVideoId = videoId;
    if ((data.videoTitle || data.title) && _ytActiveBtn) {
      _ytActiveBtn.title = '▶ ' + (data.videoTitle || data.title);
    }
    const statusEl = document.getElementById('ytMiniStatus');
    if (statusEl) { statusEl.textContent = ''; }
    if (_ytApiReady) {
      _ytLoadVideo(videoId);
    } else {
      _ytPendingVideo = videoId;
    }
  } catch (e) {
    if (_ytActiveBtn) _ytActiveBtn.classList.remove('yt-btn-loading', 'yt-btn-playing');
    const t = _ytCurrentTrack;
    if (t) window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(t.artist + ' ' + t.title), '_blank');
    closeYtPlayer();
  }
}

function _ytLoadVideo(videoId) {
  if (_ytPlayer) {
    _ytPlayer.loadVideoById(videoId);
  } else {
    _ytPlayer = new YT.Player('yt-player-frame', {
      height: '90',
      width: '160',
      videoId,
      playerVars: { autoplay: 1, playsinline: 1, rel: 0 },
      events: { onStateChange: _ytOnState, onError: _ytOnError }
    });
  }
}

function _ytOnState(event) {
  const pauseBtn = document.getElementById('ytMiniPauseBtn');
  if (event.data === YT.PlayerState.PLAYING) {
    clearTimeout(_ytScrobbleTimer);
    if (!_ytScrobbled) _ytScrobbleTimer = setTimeout(_ytScrobble, 30000);
    if (pauseBtn) { pauseBtn.textContent = '⏸'; pauseBtn.title = 'Pause'; }
    if (_ytActiveBtn) { _ytActiveBtn.classList.remove('yt-btn-loading'); _ytActiveBtn.classList.add('yt-btn-playing'); }
  } else if (event.data === YT.PlayerState.PAUSED) {
    clearTimeout(_ytScrobbleTimer);
    if (pauseBtn) { pauseBtn.textContent = '▶'; pauseBtn.title = 'Resume'; }
  } else if (event.data === YT.PlayerState.ENDED) {
    clearTimeout(_ytScrobbleTimer);
    if (_ytActiveBtn) _ytActiveBtn.classList.remove('yt-btn-loading', 'yt-btn-playing');
    if (_ytQueue.length > 0) {
      const next = _ytQueue.shift();
      _ytUpdateQueueDisplay();
      openYtPlayer(next.title, next.artist, next.album, next.btn || null);
    }
  } else {
    clearTimeout(_ytScrobbleTimer);
  }
}

function _ytOnError(event) {
  const statusEl = document.getElementById('ytMiniStatus');
  const code = event && event.data;
  if ((code === 101 || code === 150) && _ytCurrentTrack && _ytEmbedRetry < 2) {
    _ytEmbedRetry++;
    const { title, artist } = _ytCurrentTrack;
    const fallbacks = [`${artist} ${title} lyric video`, `${artist} ${title} audio`];
    if (statusEl) { statusEl.textContent = 'Trying alternate…'; statusEl.className = 'yt-mini-status'; }
    _ytSearch(null, null, fallbacks[_ytEmbedRetry - 1]);
    return;
  }
  if (statusEl) {
    const msg = (code === 101 || code === 150) ? 'Embedding disabled' : 'Playback unavailable';
    statusEl.innerHTML = `${msg} — <button class="yt-err-open-btn" onclick="_ytOpenInYT()">open in YouTube ↗</button>`;
    statusEl.className = 'yt-mini-status err';
  }
  if (_ytActiveBtn) _ytActiveBtn.classList.remove('yt-btn-loading', 'yt-btn-playing');
}

async function _ytScrobble() {
  if (!_ytCurrentTrack || _ytScrobbled) return;
  _ytScrobbled = true;
  const { title, artist, album } = _ytCurrentTrack;
  const timestamp = Math.floor(Date.now() / 1000);
  const statusEl  = document.getElementById('ytMiniStatus');
  const hasLfm    = !!(getScrobbleSession() && getScrobbleUser());
  const hasSheet  = !!(getSheetWriteUrl() && getDataSource() === 'sheets');
  const username  = getLastFmUser();
  try {
    if (hasLfm) {
      const params = { method: 'track.scrobble', artist, track: title, timestamp: String(timestamp), sk: getScrobbleSession() };
      if (album) params.album = album;
      await lfmPost(params);
    } else if (hasSheet) {
      const res  = await fetch(getSheetWriteUrl(), { method: 'POST', body: JSON.stringify({ artist, track: title, album, timestamp }) });
      const data = await res.json();
      if (data.status === 'error') throw new Error(data.message || 'Script error');
    } else if (username) {
      const r = await fetch(`${BACKEND_API}/api/sync/rows/${encodeURIComponent(username)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: [{ artist, track: title, album: album || '', scrobbled_at: new Date(timestamp * 1000).toISOString() }] })
      });
      if (!r.ok) throw new Error('Backend error');
    } else {
      throw new Error('No scrobble destination');
    }
    if (statusEl) { statusEl.textContent = '✓ Scrobbled'; statusEl.className = 'yt-mini-status ok'; }
  } catch (e) {
    _ytScrobbled = false;
    if (statusEl) { statusEl.textContent = 'Scrobble failed'; statusEl.className = 'yt-mini-status err'; }
  }
}

function closeYtPlayer() {
  clearTimeout(_ytScrobbleTimer);
  clearTimeout(_ytQueueToastTimer);
  if (_ytPlayer) {
    try { _ytPlayer.stopVideo(); } catch(e) {}
    try { _ytPlayer.destroy(); } catch(e) {}
    _ytPlayer = null;
  }
  if (_ytActiveBtn) { _ytActiveBtn.classList.remove('yt-btn-loading', 'yt-btn-playing'); _ytActiveBtn = null; }
  const player = document.getElementById('ytMiniPlayer');
  if (player) player.style.display = 'none';
  const toast = document.getElementById('ytQueueToast');
  if (toast) toast.style.display = 'none';
  _ytCurrentTrack   = null;
  _ytCurrentVideoId = null;
  _ytScrobbled      = false;
  _ytExpandSize     = 0;
  _ytQueue          = [];
  _ytUpdateQueueDisplay();
  if (player) player.classList.remove('yt-expanded', 'yt-expanded-lg');
  const expandBtn = document.getElementById('ytMiniExpandBtn');
  if (expandBtn) { expandBtn.textContent = '⤢'; expandBtn.title = 'Expand player'; }
}

function _ytPauseToggle() {
  if (!_ytPlayer) return;
  const state = _ytPlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING) { _ytPlayer.pauseVideo(); }
  else { _ytPlayer.playVideo(); }
}

const _YT_SIZES = [
  { w: 160, h: 90,  cls: '',              icon: '⤢', title: 'Expand player' },
  { w: 320, h: 180, cls: 'yt-expanded',   icon: '⊞', title: 'Expand larger' },
  { w: 480, h: 270, cls: 'yt-expanded-lg',icon: '⤡', title: 'Shrink player'  },
];
function _ytExpand() {
  _ytExpandSize = (_ytExpandSize + 1) % _YT_SIZES.length;
  const { w, h, cls, icon, title } = _YT_SIZES[_ytExpandSize];
  const player = document.getElementById('ytMiniPlayer');
  player.classList.remove('yt-expanded', 'yt-expanded-lg');
  if (cls) player.classList.add(cls);
  const btn = document.getElementById('ytMiniExpandBtn');
  if (btn) { btn.textContent = icon; btn.title = title; }
  if (_ytPlayer) { try { _ytPlayer.setSize(w, h); } catch(e) {} }
}

function _ytOpenInYT() {
  if (_ytCurrentVideoId) {
    window.open('https://www.youtube.com/watch?v=' + _ytCurrentVideoId, '_blank');
  } else if (_ytCurrentTrack) {
    window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(_ytCurrentTrack.artist + ' ' + _ytCurrentTrack.title), '_blank');
  }
}

function _ytShowQueueToast(title, artist, album, btn) {
  const toast = document.getElementById('ytQueueToast');
  if (!toast) { openYtPlayer(title, artist, album, btn); return; }
  toast.querySelector('.yt-queue-toast-label').textContent = '"' + title + '"';
  const playerEl = document.getElementById('ytMiniPlayer');
  if (playerEl) {
    const r = playerEl.getBoundingClientRect();
    toast.style.right = (window.innerWidth - r.right) + 'px';
    toast.style.left  = 'auto';
    if (r.top < 80) {
      toast.style.top    = (r.bottom + 8) + 'px';
      toast.style.bottom = 'auto';
    } else {
      toast.style.bottom = (window.innerHeight - r.top + 8) + 'px';
      toast.style.top    = 'auto';
    }
  }
  toast.style.display = 'flex';
  toast.querySelector('.yt-queue-now-btn').onclick = () => {
    toast.style.display = 'none';
    openYtPlayer(title, artist, album, btn);
  };
  toast.querySelector('.yt-queue-add-btn').onclick = () => {
    toast.style.display = 'none';
    _ytQueue.push({ title, artist, album, btn });
    _ytUpdateQueueDisplay();
  };
}

function _ytUpdateQueueDisplay() {
  const el = document.getElementById('ytMiniQueue');
  if (!el) return;
  if (_ytQueue.length === 0) { el.style.display = 'none'; el.innerHTML = ''; return; }
  el.style.display = 'block';
  el.innerHTML = _ytQueue.map((t, i) =>
    `<div class="yt-mini-queue-item"><span class="yt-mini-queue-num">${i === 0 ? 'Next' : 'Then'}</span><span class="yt-mini-queue-title">${t.title}</span><button class="yt-mini-queue-rm" onclick="_ytRemoveFromQueue(${i})" title="Remove">✕</button></div>`
  ).join('');
}

function _ytRemoveFromQueue(i) {
  _ytQueue.splice(i, 1);
  _ytUpdateQueueDisplay();
}

function _ytInitDrag() {
  const player = document.getElementById('ytMiniPlayer');
  if (!player) return;
  try {
    const saved = localStorage.getItem('yt-player-pos');
    if (saved) {
      const { left, top } = JSON.parse(saved);
      const maxL = window.innerWidth  - player.offsetWidth  - 12;
      const maxT = window.innerHeight - player.offsetHeight - 12;
      player.style.left   = Math.max(12, Math.min(left, maxL)) + 'px';
      player.style.top    = Math.max(12, Math.min(top,  maxT)) + 'px';
      player.style.bottom = 'auto';
      player.style.right  = 'auto';
    }
  } catch(e) {}
  const handle = player.querySelector('.yt-mini-drag-handle');
  if (!handle) return;
  let dragging = false, sx, sy, sl, st;
  function _snapSave() {
    const r  = player.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const nl = r.left + r.width  / 2 < vw / 2 ? 12 : vw - r.width  - 12;
    const nt = r.top  + r.height / 2 < vh / 2 ? 12 : vh - r.height - 12;
    player.style.left = nl + 'px';
    player.style.top  = nt + 'px';
    try { localStorage.setItem('yt-player-pos', JSON.stringify({ left: nl, top: nt })); } catch(e) {}
  }
  handle.addEventListener('mousedown', e => {
    dragging = true;
    const r = player.getBoundingClientRect();
    sx = e.clientX; sy = e.clientY; sl = r.left; st = r.top;
    player.style.right = 'auto'; player.style.bottom = 'auto';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    player.style.left = (sl + e.clientX - sx) + 'px';
    player.style.top  = (st + e.clientY - sy) + 'px';
  });
  document.addEventListener('mouseup', () => { if (!dragging) return; dragging = false; _snapSave(); });
  handle.addEventListener('touchstart', e => {
    const t = e.touches[0]; dragging = true;
    const r = player.getBoundingClientRect();
    sx = t.clientX; sy = t.clientY; sl = r.left; st = r.top;
    player.style.right = 'auto'; player.style.bottom = 'auto';
  }, { passive: false });
  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const t = e.touches[0];
    player.style.left = (sl + t.clientX - sx) + 'px';
    player.style.top  = (st + t.clientY - sy) + 'px';
    e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchend', () => { if (!dragging) return; dragging = false; _snapSave(); });
}

// Space bar toggles pause/resume when mini player is visible and no input is focused
document.addEventListener('keydown', e => {
  if (e.code !== 'Space') return;
  const playerEl = document.getElementById('ytMiniPlayer');
  if (!playerEl || playerEl.style.display === 'none') return;
  const tag = document.activeElement && document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (document.activeElement && document.activeElement.isContentEditable)) return;
  e.preventDefault();
  _ytPauseToggle();
});

// ── Listening Activity Heatmap ─────────────────────────────────────────────

const HM_THEMES = {
  default: ['#1c2b3f', '#3a1858', '#6a28a0', '#c048cc', '#ff7ee0'],
  fire:    ['#1a0900', '#5c1500', '#c03800', '#e87000', '#ffd030'],
  ocean:   ['#030e1a', '#0d3060', '#0b6fa4', '#12b5d4', '#7ee8ff'],
  forest:  ['#0a1a0a', '#174d17', '#2a8c2a', '#5cc45c', '#b0f0b0'],
  ember:   ['#140303', '#4a0a08', '#991818', '#d44000', '#f09000'],
};
const HM_TYPE_THEME = { all: 'default', artist: 'fire', song: 'ocean', album: 'forest' };
const HM_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const HM_DOW_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];

function hmLerpColor(h1, h2, t) {
  const p = s => parseInt(s, 16);
  const r = v => Math.round(v).toString(16).padStart(2, '0');
  const [r1, g1, b1] = [p(h1.slice(1, 3)), p(h1.slice(3, 5)), p(h1.slice(5, 7))];
  const [r2, g2, b2] = [p(h2.slice(1, 3)), p(h2.slice(3, 5)), p(h2.slice(5, 7))];
  return '#' + r(r1 + (r2 - r1) * t) + r(g1 + (g2 - g1) * t) + r(b1 + (b2 - b1) * t);
}

function hmCellColor(count, max) {
  const stops = HM_THEMES[hmTheme] || HM_THEMES.default;
  if (!count || !max) return stops[0];
  const ratio = Math.min(Math.log1p(count) / Math.log1p(max), 1);
  const idx = ratio * (stops.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, stops.length - 1);
  return lo === hi ? stops[lo] : hmLerpColor(stops[lo], stops[hi], idx - lo);
}

function hmOrdinal(n) {
  const s = n % 100;
  if (s >= 11 && s <= 13) return n + 'th';
  switch (n % 10) {
    case 1: return n + 'st';
    case 2: return n + 'nd';
    case 3: return n + 'rd';
    default: return n + 'th';
  }
}

function hmMatchesFilter(p) {
  if (heatmapType === 'artist') return p.artists.some(a => heatmapFilters.includes(a));
  if (heatmapType === 'song') return heatmapFilters.includes(`${p.title} • ${p.artist}`);
  if (heatmapType === 'album') return heatmapFilters.includes(`${p.album} • ${albumArtist(p)}`);
  return true;
}

function buildHeatmapData() {
  const dayMap = {};
  const msMap = {};
  const chrono = [...allPlays].sort((a, b) => a.date - b.date);
  const isFiltered = heatmapType !== 'all' && heatmapFilters.length > 0;

  if (!isFiltered) {
    for (const p of chrono) {
      const dk = localDateStr(tzDate(p.date));
      if (!dayMap[dk]) dayMap[dk] = { count: 0, plays: [] };
      dayMap[dk].count++;
      dayMap[dk].plays.push(p);
    }
    // First scrobble of each year milestone
    const firstPlayOfYear = {};
    for (const p of chrono) {
      const yr = tzDate(p.date).getFullYear();
      if (!firstPlayOfYear[yr]) firstPlayOfYear[yr] = p;
    }
    for (const [yr, p] of Object.entries(firstPlayOfYear)) {
      const dk = localDateStr(tzDate(p.date));
      if (!msMap[dk]) msMap[dk] = { daily: [], allTime: [] };
      msMap[dk].allTime.push({ label: `First scrobble of ${yr}`, play: p, isYearFirst: true });
    }
    // Daily milestones: how many plays you hit within a single day
    for (const [dk, data] of Object.entries(dayMap)) {
      const daily = [];
      for (const n of [1, 50, 100, 200, 500, 1000]) {
        if (data.plays.length >= n) daily.push({ label: hmOrdinal(n) + ' of the day', play: data.plays[n - 1] });
      }
      if (daily.length) {
        if (!msMap[dk]) msMap[dk] = { daily: [], allTime: [] };
        msMap[dk].daily = daily;
      }
    }
    // All-time milestones: cumulative scrobble count across your entire history
    const allTimeMilestones = new Set([100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000]);
    let cumCount = 0;
    for (const p of chrono) {
      cumCount++;
      if (allTimeMilestones.has(cumCount)) {
        const dk = localDateStr(tzDate(p.date));
        if (!msMap[dk]) msMap[dk] = { daily: [], allTime: [] };
        msMap[dk].allTime.push({ label: hmOrdinal(cumCount) + ' scrobble ever', play: p });
      }
    }
  } else {
    const milestoneSet = new Set([1, 10, 25, 50, 100, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 5000, 10000]);
    let cumCount = 0;
    for (const p of chrono) {
      if (!hmMatchesFilter(p)) continue;
      cumCount++;
      const dk = localDateStr(tzDate(p.date));
      if (!dayMap[dk]) dayMap[dk] = { count: 0, plays: [], chipIndices: new Set() };
      dayMap[dk].count++;
      dayMap[dk].plays.push(p);
      // Track which filter chips contributed to each day (for split-color cells)
      heatmapFilters.forEach((f, i) => {
        let matched = false;
        if (heatmapType === 'artist') matched = p.artists.some(a => a === f);
        else if (heatmapType === 'song') matched = `${p.title} • ${p.artist}` === f;
        else if (heatmapType === 'album') matched = `${p.album} • ${albumArtist(p)}` === f;
        if (matched) dayMap[dk].chipIndices.add(i);
      });
      if (milestoneSet.has(cumCount)) {
        if (!msMap[dk]) msMap[dk] = { daily: [], allTime: [] };
        msMap[dk].allTime.push({ label: hmOrdinal(cumCount) + ' scrobble', play: p });
      }
    }
  }
  return { dayMap, msMap };
}

function updateHeatmapFilterList() {
  const dl = document.getElementById('heatmapFilterList');
  if (!dl) return;
  if (heatmapType === 'artist') {
    const totals = {};
    for (const p of allPlays) for (const a of p.artists) totals[a] = (totals[a] || 0) + 1;
    const sorted = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
    dl.innerHTML = sorted.map(a => `<option value="${esc(a)}">`).join('');
  } else if (heatmapType === 'song') {
    const totals = {};
    for (const p of allPlays) {
      const k = `${p.title} • ${p.artist}`;
      totals[k] = (totals[k] || 0) + 1;
    }
    const sorted = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
    dl.innerHTML = sorted.map(s => `<option value="${esc(s)}">`).join('');
  } else if (heatmapType === 'album') {
    const totals = {};
    for (const p of allPlays) {
      if (!p.album || p.album === '—') continue;
      const k = `${p.album} • ${albumArtist(p)}`;
      totals[k] = (totals[k] || 0) + 1;
    }
    const sorted = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
    dl.innerHTML = sorted.map(s => `<option value="${esc(s)}">`).join('');
  }
}

function renderHeatmapChips() {
  const wrap = document.getElementById('heatmapChips');
  if (!wrap) return;
  wrap.innerHTML = heatmapFilters.map((f, i) => {
    const col = GRAPH_PALETTE[i % GRAPH_PALETTE.length];
    return `<span style="display:inline-flex;align-items:center;gap:4px;background:${col}22;border:1px solid ${col};
              color:${col};font-family:'DM Mono',monospace;font-size:0.65rem;padding:2px 8px;border-radius:20px;
              letter-spacing:0.04em;">${esc(f)}
              <button onclick="removeHeatmapFilter(${i})" style="background:none;border:none;color:${col};
                cursor:pointer;font-size:0.75rem;line-height:1;padding:0 0 1px 2px;">×</button>
            </span>`;
  }).join('');
}

function removeHeatmapFilter(idx) {
  heatmapFilters.splice(idx, 1);
  renderHeatmapChips();
  renderHeatmap();
}

function hmComputeStreaks(dayMap) {
  const days = Object.keys(dayMap).filter(k => dayMap[k].count > 0).sort();
  if (!days.length) return { best: 0, current: 0 };
  let best = 1, streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1] + 'T00:00:00');
    const curr = new Date(days[i] + 'T00:00:00');
    if ((curr - prev) / 86400000 === 1) { streak++; if (streak > best) best = streak; }
    else streak = 1;
  }
  const today = localDateStr(tzNow());
  const daysSet = new Set(days);
  let cur = 0;
  const check = new Date(today + 'T00:00:00');
  while (daysSet.has(localDateStr(check))) { cur++; check.setDate(check.getDate() - 1); }
  return { best, current: cur };
}

function hmComputeDroughts(dayMap) {
  const days = Object.keys(dayMap).filter(k => dayMap[k].count > 0).sort();
  const droughtCells = new Set();
  const returnMap = {};
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1] + 'T00:00:00');
    const curr = new Date(days[i] + 'T00:00:00');
    const gap = Math.round((curr - prev) / 86400000) - 1;
    if (gap > 6) {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      while (d < curr) { droughtCells.add(localDateStr(d)); d.setDate(d.getDate() + 1); }
      returnMap[days[i]] = gap;
    }
  }
  return { droughtCells, returnMap };
}

function hmComputePercentile(dayMap) {
  const counts = Object.values(dayMap).map(d => d.count).sort((a, b) => a - b);
  return count => {
    const below = counts.filter(c => c < count).length;
    return Math.round((below / counts.length) * 100);
  };
}

function hmYearStats(dayMap) {
  const yearStats = {};
  const seenArtists = new Set();
  const sortedKeys = Object.keys(dayMap).sort();
  for (const dk of sortedKeys) {
    const yr = new Date(dk + 'T00:00:00').getFullYear();
    const data = dayMap[dk];
    if (!yearStats[yr]) yearStats[yr] = { total: 0, artists: {}, newArtists: 0, bestDay: 0, bestDk: '' };
    yearStats[yr].total += data.count;
    if (data.count > yearStats[yr].bestDay) { yearStats[yr].bestDay = data.count; yearStats[yr].bestDk = dk; }
    for (const p of data.plays) {
      const artists = p.artists && p.artists.length ? p.artists : [p.artist];
      for (const a of artists) {
        yearStats[yr].artists[a] = (yearStats[yr].artists[a] || 0) + 1;
        if (!seenArtists.has(a)) { seenArtists.add(a); yearStats[yr].newArtists++; }
      }
    }
  }
  for (const yr of Object.keys(yearStats)) {
    const artists = yearStats[yr].artists;
    yearStats[yr].topArtist = Object.keys(artists).sort((a, b) => artists[b] - artists[a])[0] || '';
  }
  return yearStats;
}

function hmRenderPatterns(dayMap) {
  const dowLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dowTotals = Array(7).fill(0);
  const dowDayCount = Array(7).fill(0);
  for (const [dk, data] of Object.entries(dayMap)) {
    const dow = (new Date(dk + 'T00:00:00').getDay() + 6) % 7;
    dowTotals[dow] += data.count;
    dowDayCount[dow]++;
  }
  const dowAvg = dowTotals.map((t, i) => dowDayCount[i] > 0 ? t / dowDayCount[i] : 0);
  const maxAvg = Math.max(...dowAvg, 1);

  const grid = Array.from({ length: 7 }, () => Array(24).fill(0));
  const plays = heatmapType !== 'all' && heatmapFilters.length > 0
    ? allPlays.filter(p => hmMatchesFilter(p))
    : allPlays;
  for (const p of plays) {
    const d = tzDate(p.date);
    grid[(d.getDay() + 6) % 7][d.getHours()]++;
  }
  const maxHour = Math.max(...grid.flat(), 1);

  const stops = HM_THEMES[hmTheme] || HM_THEMES.default;
  const accent = stops[stops.length - 1];

  const barsHtml = dowLabels.map((label, i) => {
    const avg = dowAvg[i];
    const w = Math.round((avg / maxAvg) * 100);
    const alpha = 0.45 + 0.55 * (avg / maxAvg);
    return `<div class="hm-pat-bar-row">
      <span class="hm-pat-dow-label">${label}</span>
      <div class="hm-pat-bar-track"><div class="hm-pat-bar-fill" style="width:${w}%;background:${accent};opacity:${alpha.toFixed(2)};"></div></div>
      <span class="hm-pat-bar-val">${Number.isInteger(avg) ? avg : avg.toFixed(1)}/day</span>
    </div>`;
  }).join('');

  const hourHeaderCells = Array(24).fill(0).map((_, h) => {
    const label = h === 0 ? '12a' : h === 6 ? '6a' : h === 12 ? '12p' : h === 18 ? '6p' : '';
    return `<div class="hm-pat-hour-label">${label}</div>`;
  }).join('');

  let gridRows = '';
  for (let dow = 0; dow < 7; dow++) {
    gridRows += '<div class="hm-pat-grid-row">';
    for (let hr = 0; hr < 24; hr++) {
      const cnt = grid[dow][hr];
      const bg = hmCellColor(cnt, maxHour);
      gridRows += cnt > 0
        ? `<div class="hm-pat-cell has-data" style="background:${bg};" data-hm-pattern="${dow},${hr}" data-hm-pat-count="${cnt}"></div>`
        : `<div class="hm-pat-cell" style="background:${stops[0]};"></div>`;
    }
    gridRows += '</div>';
  }

  return `<div class="hm-patterns-section">
    <div class="hm-patterns-header">Listening Patterns</div>
    <div class="hm-patterns-body">
      <div class="hm-pat-weekday">
        <div class="hm-pat-sublabel">Weekday rhythm</div>
        <div class="hm-pat-bars">${barsHtml}</div>
      </div>
      <div class="hm-pat-hourblock">
        <div class="hm-pat-sublabel">Hour of day</div>
        <div class="hm-pat-hour-grid">
          <div class="hm-pat-dow-col">${dowLabels.map(l => `<div class="hm-pat-dow-side-label">${l}</div>`).join('')}</div>
          <div><div class="hm-pat-hour-row">${hourHeaderCells}</div>${gridRows}</div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderHeatmap() {
  const container = document.getElementById('gHeatmap');
  const tooltip = document.getElementById('heatmapTooltip');
  if (!container || !allPlays.length) return;
  if (tooltip) tooltip.style.display = 'none';

  const { dayMap, msMap } = buildHeatmapData();
  _hmDayMap = dayMap;
  _hmMsMap = msMap;
  updateHeatmapFilterList();

  const today = localDateStr(tzNow());
  const allDayKeys = Object.keys(dayMap).sort();

  if (!allDayKeys.length) {
    container.innerHTML = '<div style="font-family:\'DM Mono\',monospace;font-size:0.7rem;color:var(--text3);padding:1rem 0;">No scrobbles found for the selected filters.</div>';
    return;
  }

  const firstDate = new Date(allDayKeys[0] + 'T00:00:00');
  const lastDate = new Date(today + 'T00:00:00');

  // Find max count and best day
  let maxCount = 1;
  _hmBestDayDk = '';
  for (const [dk, d] of Object.entries(dayMap)) {
    if (d.count > maxCount) { maxCount = d.count; _hmBestDayDk = dk; }
  }

  // Streaks, droughts, percentile
  const { best: bestStreak, current: curStreak } = hmComputeStreaks(dayMap);
  const { droughtCells, returnMap } = hmComputeDroughts(dayMap);
  _hmReturnMap = returnMap;
  _hmPercentileFn = hmComputePercentile(dayMap);

  // Year-in-review stats (ALL view only)
  const isAll = heatmapType === 'all';
  const yearStats = isAll ? hmYearStats(dayMap) : null;

  const stops = HM_THEMES[hmTheme] || HM_THEMES.default;

  // Streak bar
  let streakHtml = '';
  if (bestStreak > 1 || curStreak > 0) {
    const chips = [];
    if (curStreak > 0) chips.push(`<span class="hm-streak-chip">🔥 ${curStreak}-day streak</span>`);
    if (bestStreak > 1) chips.push(`<span class="hm-streak-chip">Best: ${bestStreak} days</span>`);
    streakHtml = `<div class="hm-streak-bar">${chips.join('')}</div>`;
  }

  const startDow = firstDate.getDay();
  const padStart = startDow === 0 ? 6 : startDow - 1;
  const gridStart = new Date(firstDate);
  gridStart.setDate(gridStart.getDate() - padStart);

  const yearGroups = {};
  const cur = new Date(gridStart);
  while (cur <= lastDate) {
    const thu = new Date(cur);
    thu.setDate(thu.getDate() + 3);
    const yr = thu.getFullYear();
    if (!yearGroups[yr]) yearGroups[yr] = [];
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dk = localDateStr(cur);
      const data = dayMap[dk] || null;
      const inRange = cur >= firstDate && cur <= lastDate;
      week.push({ dk, count: data ? data.count : 0, inRange, chipIndices: data ? data.chipIndices : null });
      cur.setDate(cur.getDate() + 1);
    }
    yearGroups[yr].push(week);
  }

  let html = '';
  for (const yr of Object.keys(yearGroups).sort((a, b) => +a - +b)) {
    const weeks = yearGroups[yr];

    let monthHtml = '';
    let lastMonth = -1;
    for (const week of weeks) {
      const monDate = new Date(week[0].dk + 'T00:00:00');
      const month = monDate.getMonth();
      if (week[0].inRange && month !== lastMonth) {
        monthHtml += `<div class="heatmap-week-col heatmap-month-header-row" style="position:relative;"><span class="heatmap-month-label">${HM_MONTHS[month]}</span></div>`;
        lastMonth = month;
      } else {
        monthHtml += '<div class="heatmap-week-col heatmap-month-header-row"></div>';
      }
    }

    let cellsHtml = '';
    for (const week of weeks) {
      cellsHtml += '<div class="heatmap-week-col">';
      for (const cell of week) {
        let bg, cls = 'heatmap-cell', attr = '';
        if (!cell.inRange) {
          bg = 'transparent';
        } else if (cell.count === 0) {
          if (droughtCells.has(cell.dk)) { bg = 'rgba(180,80,20,0.13)'; cls += ' hm-drought'; }
          else bg = 'transparent';
        } else {
          cls += ' has-data';
          attr = ` data-dk="${cell.dk}"`;
          if (cell.dk === _hmBestDayDk) cls += ' hm-best-day';
          // Split-color for multi-chip overlap
          if (cell.chipIndices && cell.chipIndices.size > 1) {
            const idxs = [...cell.chipIndices].slice(0, 2);
            const c1 = GRAPH_PALETTE[idxs[0] % GRAPH_PALETTE.length];
            const c2 = GRAPH_PALETTE[idxs[1] % GRAPH_PALETTE.length];
            bg = `linear-gradient(135deg,${c1} 50%,${c2} 50%)`;
          } else {
            bg = hmCellColor(cell.count, maxCount);
          }
        }
        cellsHtml += `<div class="${cls}" style="background:${bg};"${attr}></div>`;
      }
      cellsHtml += '</div>';
    }

    // Year-in-review card
    let reviewHtml = '';
    if (yearStats && yearStats[yr]) {
      const ys = yearStats[yr];
      const bd = ys.bestDk ? new Date(ys.bestDk + 'T00:00:00') : null;
      const bestDayStr = bd ? `${HM_MONTHS[bd.getMonth()]} ${bd.getDate()}` : '—';
      reviewHtml = `<div class="hm-year-review">
        <span class="hm-yr-stat"><span class="hm-yr-num">${ys.total.toLocaleString()}</span> plays</span>
        <span class="hm-yr-dot">·</span>
        <span class="hm-yr-stat">Best day <span class="hm-yr-num">${bestDayStr}</span> <span class="hm-yr-muted">(${ys.bestDay.toLocaleString()})</span></span>
        <span class="hm-yr-dot">·</span>
        <span class="hm-yr-stat">Top: <span class="hm-yr-name">${esc(ys.topArtist)}</span></span>
        ${ys.newArtists > 0 ? `<span class="hm-yr-dot">·</span><span class="hm-yr-stat"><span class="hm-yr-num">${ys.newArtists.toLocaleString()}</span> new artists</span>` : ''}
      </div>`;
    }

    html += `<div class="heatmap-year-block">
      <div class="heatmap-year-header">${yr}</div>
      <div class="heatmap-outer">
        <div class="heatmap-dow-labels">${HM_DOW_LABELS.map(l => `<div class="heatmap-dow-label">${l}</div>`).join('')}</div>
        <div class="heatmap-inner">
          <div class="heatmap-grid-wrap">
            <div class="heatmap-weeks-row" style="height:16px;margin-bottom:3px;">${monthHtml}</div>
            <div class="heatmap-weeks-row">${cellsHtml}</div>
          </div>
        </div>
      </div>
      ${reviewHtml}
    </div>`;
  }

  const legendCells = [0, 0.2, 0.45, 0.7, 1].map(r => {
    const cnt = r === 0 ? 0 : Math.round(Math.exp(r * Math.log1p(maxCount)) - 1);
    return `<div class="heatmap-cell" style="background:${hmCellColor(cnt, maxCount)};cursor:default;"></div>`;
  }).join('');
  html += `<div class="heatmap-legend"><span class="heatmap-legend-label">Less</span>${legendCells}<span class="heatmap-legend-label">More</span></div>`;

  html += hmRenderPatterns(dayMap);

  container.innerHTML = streakHtml + html;
}

// Heatmap tooltip — attached once to the static container
(function () {
  const cont = document.getElementById('gHeatmap');
  const tip = document.getElementById('heatmapTooltip');
  if (!cont || !tip) return;

  function positionTip(refEl) {
    const rect = refEl.getBoundingClientRect();
    const margin = 12;
    const tw = tip.offsetWidth || 220;
    const th = tip.offsetHeight || 120;
    let x = rect.right + margin;
    let y = rect.top - 4;
    if (x + tw > window.innerWidth - 8) x = rect.left - tw - margin;
    if (y + th > window.innerHeight - 8) y = Math.max(8, window.innerHeight - th - 8);
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }

  cont.addEventListener('mouseover', e => {
    // Pattern cell (time-of-day grid)
    const patCell = e.target.closest('.hm-pat-cell.has-data');
    if (patCell && patCell.dataset.hmPattern) {
      const [dow, hr] = patCell.dataset.hmPattern.split(',').map(Number);
      const cnt = parseInt(patCell.dataset.hmPatCount) || 0;
      const dowName = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][dow];
      const hrLabel = hr === 0 ? 'midnight' : hr < 12 ? `${hr}am` : hr === 12 ? 'noon' : `${hr - 12}pm`;
      tip.innerHTML = `<div class="hm-tt-date">${dowName} · ${hrLabel}</div>
        <div class="hm-tt-count">${cnt.toLocaleString()} scrobble${cnt !== 1 ? 's' : ''}</div>`;
      tip.style.display = 'block';
      positionTip(patCell);
      return;
    }

    // Regular calendar cell
    const cell = e.target.closest('.heatmap-cell.has-data');
    if (!cell) { tip.style.display = 'none'; return; }

    const dk = cell.dataset.dk;
    const data = _hmDayMap[dk];
    const msEntry = _hmMsMap[dk];
    const ms = msEntry || { daily: [], allTime: [] };
    const dailyMs = ms.daily || [];
    const allTimeMs = ms.allTime || [];
    if (!data) return;

    const d = new Date(dk + 'T00:00:00');
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const day = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'long' });
    const yr = d.getFullYear();
    const word = data.count === 1 ? 'scrobble' : 'scrobbles';

    // Best day badge
    const bestHtml = dk === _hmBestDayDk
      ? '<div class="hm-tt-best">⭐ Your best day ever</div>' : '';

    // Percentile
    const pct = _hmPercentileFn ? _hmPercentileFn(data.count) : null;
    const topPct = pct !== null ? 100 - pct : null;
    const pctHtml = (topPct !== null && topPct <= 20 && dk !== _hmBestDayDk)
      ? `<div class="hm-tt-pct">Top ${topPct < 1 ? '<1' : topPct}% day</div>` : '';

    // Drought return
    const gapDays = _hmReturnMap && _hmReturnMap[dk];
    const gapHtml = gapDays
      ? `<div class="hm-tt-gap">🌧 Back after ${gapDays}-day break</div>` : '';

    let msHtml = '';
    const hasBoth = dailyMs.length > 0 && allTimeMs.length > 0;
    if (dailyMs.length || allTimeMs.length) {
      msHtml = '<hr class="hm-tt-rule">';
      if (dailyMs.length) {
        if (hasBoth) msHtml += '<div class="hm-tt-section-label">📅 Today</div>';
        for (const m of dailyMs) {
          msHtml += `<div class="hm-tt-ms-wrap">
            <div class="hm-tt-ms-label">🚩 ${esc(m.label)}</div>
            <div class="hm-tt-ms-track">${esc(m.play.title)}</div>
            <div class="hm-tt-ms-artist">${esc(m.play.artist)}</div>
          </div>`;
        }
      }
      if (allTimeMs.length) {
        if (hasBoth) msHtml += '<div class="hm-tt-rule-minor"></div><div class="hm-tt-section-label">🏆 All-time</div>';
        for (const m of allTimeMs) {
          const icon = m.isYearFirst ? '🎆' : '🏆';
          msHtml += `<div class="hm-tt-ms-wrap">
            <div class="hm-tt-ms-label hm-tt-ms-alltime">${icon} ${esc(m.label)}</div>
            <div class="hm-tt-ms-track">${esc(m.play.title)}</div>
            <div class="hm-tt-ms-artist">${esc(m.play.artist)}</div>
          </div>`;
        }
      }
    }

    tip.innerHTML = `<div class="hm-tt-date">${dayName} ${day} ${esc(monthName)} ${yr}</div>
      <div class="hm-tt-count">${data.count.toLocaleString()} ${word}</div>
      ${bestHtml}${pctHtml}${gapHtml}${msHtml}`;
    tip.style.display = 'block';
    positionTip(cell);
  });

  cont.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
}());

// Heatmap type buttons
document.getElementById('heatmapTypeBtns').addEventListener('click', e => {
  const btn = e.target.closest('button[data-hmtype]');
  if (!btn) return;
  document.querySelectorAll('#heatmapTypeBtns button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  heatmapType = btn.dataset.hmtype;
  heatmapFilters = [];
  // Auto-apply the default color theme for this view type
  hmTheme = HM_TYPE_THEME[heatmapType] || 'default';
  document.querySelectorAll('#heatmapThemeBtns button').forEach(b => {
    b.classList.toggle('active', b.dataset.hmtheme === hmTheme);
  });
  renderHeatmapChips();
  const filterRow = document.getElementById('heatmapFilterRow');
  filterRow.style.display = heatmapType === 'all' ? 'none' : 'flex';
  const placeholders = { artist: 'Add an artist…', song: 'Add a song…', album: 'Add an album…' };
  const inp = document.getElementById('heatmapFilterInput');
  if (inp) inp.placeholder = placeholders[heatmapType] || 'Add filter…';
  if (currentPeriod === 'graphs') renderHeatmap();
});

// Heatmap theme swatches
document.getElementById('heatmapThemeBtns').addEventListener('click', e => {
  const btn = e.target.closest('button[data-hmtheme]');
  if (!btn) return;
  document.querySelectorAll('#heatmapThemeBtns button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  hmTheme = btn.dataset.hmtheme;
  if (currentPeriod === 'graphs') renderHeatmap();
});

function hmAddFilter() {
  const inp = document.getElementById('heatmapFilterInput');
  const val = inp.value.trim();
  if (!val || heatmapFilters.includes(val)) { inp.value = ''; return; }
  heatmapFilters.push(val);
  inp.value = '';
  renderHeatmapChips();
  if (currentPeriod === 'graphs') renderHeatmap();
}

document.getElementById('heatmapFilterBtn').addEventListener('click', hmAddFilter);
document.getElementById('heatmapFilterInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') hmAddFilter();
});

// ─── STICKY NAV SENTINEL ───────────────────────────────────────
(function () {
  const sentinel = document.getElementById('stickyNavSentinel');
  const bar = document.getElementById('stickyNavBar');
  if (!sentinel || !bar) return;
  const obs = new IntersectionObserver(
    ([entry]) => bar.classList.toggle('is-stuck', !entry.isIntersecting),
    { threshold: 0, rootMargin: '0px' }
  );
  obs.observe(sentinel);
})();

// ─── LOADING SKELETON ──────────────────────────────────────────
function showSkeleton() {
  const skRow = () => `
    <tr class="skeleton-row">
      <td><div class="skeleton-cell" style="width:28px"></div></td>
      <td><div class="skeleton-cell skeleton-thumb"></div></td>
      <td>
        <div class="skeleton-cell" style="width:55%;margin-bottom:6px"></div>
        <div class="skeleton-cell" style="width:35%"></div>
      </td>
      <td><div class="skeleton-cell" style="width:50%"></div></td>
      <td><div class="skeleton-cell" style="width:32px;margin-left:auto"></div></td>
    </tr>`;
  ['songsBody', 'artistsBody', 'albumsBody'].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.querySelector('tr:not(.skeleton-row)')) {
      el.innerHTML = Array.from({ length: 6 }, skRow).join('');
    }
  });
}

// ─── HERO STATS ────────────────────────────────────────────────
function renderHeroStats() {
  const el = document.getElementById('heroStats');
  if (!el || !allPlays.length) return;

  const total = allPlays.length;

  const days = new Set(allPlays.map(p => {
    const d = tzDate(p.date);
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }));

  const artistCounts = {};
  for (const p of allPlays) {
    for (const a of p.artists) {
      artistCounts[a] = (artistCounts[a] || 0) + 1;
    }
  }
  const topArtist = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])[0];

  // Consecutive day streak ending today (or yesterday if today has no plays yet)
  const daySet = days;
  const now = tzNow();
  function toNum(d) { return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
  function prevDay(n) {
    const d = new Date(Math.floor(n / 10000), Math.floor(n / 100) % 100 - 1, n % 100);
    d.setDate(d.getDate() - 1);
    return toNum(d);
  }
  let streak = 0;
  let cur = toNum(now);
  if (!daySet.has(cur)) cur = prevDay(cur);
  while (daySet.has(cur)) { streak++; cur = prevDay(cur); }

  // Personal best streak (longest consecutive run across all time)
  const sortedDays = [...daySet].sort((a, b) => a - b);
  let pb = streak || 1, pbCur = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = sortedDays[i - 1];
    const prevD = new Date(Math.floor(prev / 10000), Math.floor(prev / 100) % 100 - 1, prev % 100);
    prevD.setDate(prevD.getDate() + 1);
    if (toNum(prevD) === sortedDays[i]) { pbCur++; if (pbCur > pb) pb = pbCur; }
    else pbCur = 1;
  }

  const avgPerDay = Math.round(total / days.size);
  const streakTier = streak >= 100 ? 6 : streak >= 60 ? 5 : streak >= 30 ? 4 : streak >= 14 ? 3 : streak >= 7 ? 2 : streak >= 1 ? 1 : 0;
  const streakIcon = streakTier >= 6 ? '🌟' : streakTier >= 2 ? '🔥' : '📆';

  el.innerHTML = `
    <div class="hero-stat" data-tip="${total.toLocaleString()} plays across ${days.size.toLocaleString()} unique days">
      <span class="hero-icon">🎵</span>
      <span class="hero-val" data-countup="${total}">${total.toLocaleString()}</span>
      <span class="hero-label">${t('hero_total_plays')}</span>
    </div>
    <div class="hero-stat-sep">·</div>
    <div class="hero-stat hero-stat-days" data-tip="Click to view your listening heatmap">
      <span class="hero-icon">📅</span>
      <span class="hero-val" data-countup="${days.size}">${days.size.toLocaleString()}</span>
      <span class="hero-label">${t('hero_days_listened')}</span>
    </div>
    <div class="hero-stat-sep">·</div>
    <div class="hero-stat" data-tip="~${avgPerDay.toLocaleString()} plays on average per day listened">
      <span class="hero-icon">📊</span>
      <span class="hero-val" data-countup="${avgPerDay}">${avgPerDay.toLocaleString()}</span>
      <span class="hero-label">${t('hero_plays_per_day')}</span>
    </div>
    <div class="hero-stat-sep">·</div>
    <div class="hero-stat hero-stat-artist" data-tip="Click to jump to Top Artists">
      <span class="hero-icon">🎤</span>
      <span class="hero-val hero-val-artist">${topArtist ? topArtist[0] : '—'}</span>
      <span class="hero-label">${t('hero_top_artist')}</span>
    </div>
    <div class="hero-stat-sep">·</div>
    <div class="hero-stat" id="hero-streak-stat" data-tip="Click for streak details · Personal best: ${pb} day${pb === 1 ? '' : 's'}">
      <span class="hero-icon">📆</span>
      <span class="hero-val">0</span>
      <span class="hero-label">${t('hero_day_streak')}</span>
      <span class="hero-stat-pb">PB: ${pb}</span>
    </div>`;

  el.style.display = 'flex';

  // Switch to All-Time tab and scroll to artists section when Top Artist is clicked
  el.querySelector('.hero-stat-artist').addEventListener('click', () => {
    const alltimeBtn = document.querySelector('#periodNav button[data-period="alltime"]');
    const needsSwitch = alltimeBtn && currentPeriod !== 'alltime';
    if (needsSwitch) alltimeBtn.click();
    const sec = document.getElementById('artistsSection');
    if (sec) {
      if (needsSwitch) {
        setTimeout(() => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
      } else {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  // Switch to Graphs tab and scroll to heatmap when Days Listened is clicked
  el.querySelector('.hero-stat-days').addEventListener('click', () => {
    const graphsBtn = document.querySelector('#periodNav button[data-period="graphs"]');
    const needsSwitch = graphsBtn && currentPeriod !== 'graphs';
    if (needsSwitch) graphsBtn.click();
    const card = document.getElementById('heatmapCard');
    if (card) {
      setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), needsSwitch ? 300 : 0);
    }
  });

  // Open streak details modal when streak stat is clicked
  const streakStatEl = el.querySelector('#hero-streak-stat');
  if (streakStatEl) streakStatEl.addEventListener('click', openStreakModal);

  // Count-up animation for numeric values
  el.querySelectorAll('[data-countup]').forEach(span => {
    const target = parseInt(span.dataset.countup, 10);
    if (!target) return;
    const duration = 2200;
    const startTime = performance.now();
    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      span.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });

  // Streak count-up: slow linear animation that transitions through each tier
  const streakEl = el.querySelector('#hero-streak-stat');
  if (streakEl && streak > 0) {
    const valSpan = streakEl.querySelector('.hero-val');
    const iconSpan = streakEl.querySelector('.hero-icon');
    const duration = 5000;
    const startTime = performance.now();
    function streakFrame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const cur = Math.round(progress * streak);
      valSpan.textContent = cur;
      const t = cur >= 100 ? 6 : cur >= 60 ? 5 : cur >= 30 ? 4 : cur >= 14 ? 3 : cur >= 7 ? 2 : cur >= 1 ? 1 : 0;
      streakEl.className = `hero-stat${t > 0 ? ` hero-stat--streak-${t}` : ''}`;
      iconSpan.textContent = t >= 6 ? '🌟' : t >= 2 ? '🔥' : '📆';
      if (progress < 1) {
        requestAnimationFrame(streakFrame);
      } else {
        valSpan.style.animation = 'streak-finish-burst 1.4s ease-out forwards';
        iconSpan.style.animation = 'streak-icon-burst 1.4s ease-out forwards';
        setTimeout(() => {
          valSpan.style.animation = '';
          iconSpan.style.animation = '';
        }, 1400);
      }
    }
    requestAnimationFrame(streakFrame);
  }
}

// ─── STREAK DETAILS MODAL ─────────────────────────────────────
function openStreakModal() {
  if (!allPlays.length) return;

  function prevDs(ds) {
    const d = new Date(ds + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  const todayStr = localDateStr(tzNow());
  const yest = prevDs(todayStr);
  const dayBefore = prevDs(yest);

  const songDays = {}, songInfo = {};
  const artistDays = {};
  const albumDays = {}, albumInfo = {};

  for (const p of allPlays) {
    const ds = localDateStr(tzDate(p.date));
    const sk = songKey(p);
    if (!songDays[sk]) { songDays[sk] = new Set(); songInfo[sk] = { title: p.title, artist: p.artist }; }
    songDays[sk].add(ds);
    for (const a of p.artists) {
      if (!artistDays[a]) artistDays[a] = new Set();
      artistDays[a].add(ds);
    }
    if (p.album && p.album !== '—') {
      const ak = p.album + '|||' + albumArtist(p);
      if (!albumDays[ak]) { albumDays[ak] = new Set(); albumInfo[ak] = { album: p.album, artist: albumArtist(p) }; }
      albumDays[ak].add(ds);
    }
  }

  function streakEndingAt(daySet, end) {
    if (!daySet.has(end)) return 0;
    let n = 1, cur = end;
    while (true) {
      const prev = prevDs(cur);
      if (!daySet.has(prev)) break;
      n++; cur = prev;
    }
    return n;
  }

  const activeSongs = [], activeArtists = [], activeAlbums = [];
  for (const [sk, d] of Object.entries(songDays)) {
    const len = streakEndingAt(d, todayStr);
    if (len >= 2) activeSongs.push({ name: songInfo[sk].title, sub: songInfo[sk].artist, type: 'song', len });
  }
  for (const [a, d] of Object.entries(artistDays)) {
    const len = streakEndingAt(d, todayStr);
    if (len >= 2) activeArtists.push({ name: a, sub: '', type: 'artist', len });
  }
  for (const [ak, d] of Object.entries(albumDays)) {
    const len = streakEndingAt(d, todayStr);
    if (len >= 2) activeAlbums.push({ name: albumInfo[ak].album, sub: albumInfo[ak].artist, type: 'album', len });
  }
  activeSongs.sort((a, b) => b.len - a.len);
  activeArtists.sort((a, b) => b.len - a.len);
  activeAlbums.sort((a, b) => b.len - a.len);

  const atRisk = [];
  for (const [sk, d] of Object.entries(songDays)) {
    if (d.has(yest) && !d.has(todayStr)) {
      const len = streakEndingAt(d, yest);
      if (len >= 2) atRisk.push({ name: songInfo[sk].title, sub: songInfo[sk].artist, type: 'song', len });
    }
  }
  for (const [a, d] of Object.entries(artistDays)) {
    if (d.has(yest) && !d.has(todayStr)) {
      const len = streakEndingAt(d, yest);
      if (len >= 2) atRisk.push({ name: a, sub: '', type: 'artist', len });
    }
  }
  for (const [ak, d] of Object.entries(albumDays)) {
    if (d.has(yest) && !d.has(todayStr)) {
      const len = streakEndingAt(d, yest);
      if (len >= 2) atRisk.push({ name: albumInfo[ak].album, sub: albumInfo[ak].artist, type: 'album', len });
    }
  }
  atRisk.sort((a, b) => b.len - a.len);

  const lost = [];
  for (const [sk, d] of Object.entries(songDays)) {
    if (!d.has(yest) && d.has(dayBefore)) {
      const len = streakEndingAt(d, dayBefore);
      if (len >= 2) lost.push({ name: songInfo[sk].title, sub: songInfo[sk].artist, type: 'song', len });
    }
  }
  for (const [a, d] of Object.entries(artistDays)) {
    if (!d.has(yest) && d.has(dayBefore)) {
      const len = streakEndingAt(d, dayBefore);
      if (len >= 2) lost.push({ name: a, sub: '', type: 'artist', len });
    }
  }
  for (const [ak, d] of Object.entries(albumDays)) {
    if (!d.has(yest) && d.has(dayBefore)) {
      const len = streakEndingAt(d, dayBefore);
      if (len >= 2) lost.push({ name: albumInfo[ak].album, sub: albumInfo[ak].artist, type: 'album', len });
    }
  }
  lost.sort((a, b) => b.len - a.len);

  function itemHtml(it, mode) {
    const sub = it.sub ? `<span class="streak-sub"> — ${it.sub}</span>` : '';
    const tag = mode !== 'active' ? `<span class="streak-type-tag streak-type-tag--${it.type}">${it.type}</span>` : '';
    const icon = mode === 'lost' ? '💔' : mode === 'risk' ? '⚠️' : '🔥';
    const cls = mode === 'lost' ? ' streak-item--lost' : mode === 'risk' ? ' streak-item--risk' : '';
    return `<div class="streak-item${cls}">` +
      `<span class="streak-fire">${icon}</span>` +
      `<span class="streak-days">${it.len}d</span>` +
      `<span class="streak-label">${it.name}${sub}</span>${tag}</div>`;
  }

  function section(titleKey, items, mode) {
    const inner = items.length
      ? items.map(it => itemHtml(it, mode)).join('')
      : `<div class="streak-empty">${t('streak_none')}</div>`;
    const cls = mode === 'lost' ? ' streak-section--lost' : mode === 'risk' ? ' streak-section--risk' : '';
    return `<div class="streak-section${cls}">` +
      `<div class="streak-section-title">${t(titleKey)}</div>${inner}</div>`;
  }

  document.getElementById('streakModalBody').innerHTML =
    section('streak_section_artists', activeArtists, 'active') +
    section('streak_section_albums', activeAlbums, 'active') +
    section('streak_section_songs', activeSongs, 'active') +
    section('streak_section_at_risk', atRisk, 'risk') +
    section('streak_section_lost', lost, 'lost');

  document.getElementById('streakModal').classList.add('open');
}

function closeStreakModal() {
  document.getElementById('streakModal').classList.remove('open');
}

// ─── PERIOD LABEL CLICK → OPEN PICKER ─────────────────────────
document.getElementById('periodLabel').addEventListener('click', () => {
  if (!['week', 'month', 'year'].includes(currentPeriod)) return;
  const wp = document.getElementById('weekPicker');
  const mp = document.getElementById('monthPicker');
  const yp = document.getElementById('yearPicker');
  if (currentPeriod === 'week') {
    try { wp.showPicker(); } catch (e) { wp.focus(); }
  } else if (currentPeriod === 'month') {
    try { mp.showPicker(); } catch (e) { mp.focus(); }
  } else {
    yp.focus();
  }
});

// ─── KEYBOARD NAVIGATION ──────────────────────────────────────
document.addEventListener('keydown', e => {
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  if (document.activeElement?.isContentEditable) return;
  if (document.querySelector('.modal.open, .source-modal.open, [class*="modal"].open')) return;
  const mainApp = document.getElementById('mainApp');
  if (!mainApp || mainApp.style.display === 'none') return;

  const flash = btn => { if (btn) { btn.classList.remove('kb-flash'); void btn.offsetWidth; btn.classList.add('kb-flash'); } };

  switch (e.key) {
    case 'ArrowLeft': {
      e.preventDefault();
      const btn = document.getElementById('prevBtn');
      if (btn && !btn.disabled) { btn.click(); flash(btn); }
      break;
    }
    case 'ArrowRight': {
      e.preventDefault();
      const btn = document.getElementById('nextBtn');
      if (btn && !btn.disabled) { btn.click(); flash(btn); }
      break;
    }
    case 'w': case 'W': document.querySelector('#periodNav button[data-period="week"]')?.click(); break;
    case 'm': case 'M': document.querySelector('#periodNav button[data-period="month"]')?.click(); break;
    case 'y': case 'Y': document.querySelector('#periodNav button[data-period="year"]')?.click(); break;
    case 'a': case 'A': document.querySelector('#periodNav button[data-period="alltime"]')?.click(); break;
  }
});

// ─── SWIPE GESTURES (HammerJS) ────────────────────────────────
(function initSwipe() {
  if (typeof Hammer === 'undefined') return;
  const el = document.getElementById('mainApp');
  if (!el) return;
  const mc = new Hammer.Manager(el);
  mc.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 25, velocity: 0.25 }));
  mc.on('swipeleft swiperight', e => {
    if (!['week', 'month', 'year'].includes(currentPeriod)) return;
    if (e.srcEvent?.target?.tagName === 'CANVAS') return;
    document.getElementById('navHint')?.classList.add('swipe-done');
    if (e.direction === Hammer.DIRECTION_LEFT) {
      // Swipe left → go forward (earlier offset - 1)
      const btn = document.getElementById('nextBtn');
      if (btn && !btn.disabled) btn.click();
    } else {
      // Swipe right → go back (later offset + 1)
      const btn = document.getElementById('prevBtn');
      if (btn && !btn.disabled) btn.click();
    }
  });
})();

// ─── NEW ARTIST SONGS TOOLTIP ──────────────────────────────────
const _naTooltip = (() => {
  const el = document.createElement('div');
  el.id = 'naSongsTooltip';
  el.className = 'na-songs-tooltip';
  el.style.display = 'none';
  document.body.appendChild(el);
  return el;
})();

let _naHideTimer = null;

function _naShowTooltip(trigger) {
  clearTimeout(_naHideTimer);
  const artist = trigger.dataset.artist;
  let songs;
  try { songs = JSON.parse(trigger.dataset.songs); } catch { return; }
  const ytSvg = `<svg class="yt-btn-icon" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>`;
  _naTooltip.innerHTML = songs.map(title =>
    `<div class="na-tt-item">
      <span class="na-tt-name">${esc(title)}</span>
      <button class="yt-play-btn na-tt-yt-btn" data-title="${esc(title)}" data-artist="${esc(artist)}" data-album="" onclick="event.stopPropagation();ytPlayFromBtn(this)" title="Play on YouTube"><span class="yt-btn-content">${ytSvg}YouTube</span></button>
    </div>`
  ).join('');
  _naTooltip.style.display = 'block';
  const rect = trigger.getBoundingClientRect();
  const ttW = 280;
  let left = rect.left;
  let top = rect.bottom + 5;
  if (left + ttW > window.innerWidth - 8) left = window.innerWidth - ttW - 8;
  if (left < 8) left = 8;
  if (top + _naTooltip.offsetHeight > window.innerHeight - 8) top = rect.top - _naTooltip.offsetHeight - 5;
  _naTooltip.style.left = left + 'px';
  _naTooltip.style.top = top + 'px';
}

function _naHideTooltip() {
  _naHideTimer = setTimeout(() => { _naTooltip.style.display = 'none'; }, 130);
}


document.addEventListener('mouseover', e => {
  const trigger = e.target.closest('.na-songs-trigger');
  if (trigger) { _naShowTooltip(trigger); return; }
  if (e.target.closest('#naSongsTooltip')) { clearTimeout(_naHideTimer); }
});

document.addEventListener('mouseout', e => {
  if (!e.target.closest('.na-songs-trigger') && !e.target.closest('#naSongsTooltip')) return;
  const to = e.relatedTarget;
  if (to && (to.closest('.na-songs-trigger') || to.closest('#naSongsTooltip'))) return;
  _naHideTooltip();
});

// ─── EVENTS CALENDAR MINI-CARD TOOLTIP ─────────────────────────
const _calEvTooltip = (() => {
  const el = document.createElement('div');
  el.id = 'calEvTooltip';
  el.className = 'cal-ev-tooltip';
  el.style.display = 'none';
  document.body.appendChild(el);
  return el;
})();

let _calEvHideTimer = null;

function _calTtPlaceholderHtml(artist) {
  const words = (artist || '').replace(/^The\s+/i, '').split(/\s+/).filter(Boolean);
  const inits = words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
  const colors = ['#0d2137', '#1a1040', '#0d2e1f', '#2b1a0d', '#0d1e2b', '#1f0d0d'];
  const hash = (artist || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return `<div class="ctt-placeholder" style="background:${colors[hash % colors.length]}">${inits}</div>`;
}

async function _loadCalTtArtistImg(imgWrap, artist) {
  try {
    const url = await deezerArtistImage(artist);
    if (!imgWrap.isConnected || !url) return;
    const ph = imgWrap.querySelector('.ctt-placeholder');
    if (!ph) return;
    const img = document.createElement('img');
    img.className = 'ctt-img';
    img.alt = '';
    img.onerror = () => {};
    img.src = url;
    imgWrap.replaceChild(img, ph);
  } catch (e) {}
}

function _showCalEvTooltip(target) {
  clearTimeout(_calEvHideTimer);
  const { ctt: evType = '', cta: artist = '', ctl: title = '', ctm: mbid = '', ctd: detail = '', ctx: dtxt = '', ctf: dtf = '' } = target.dataset;

  const mainTitle = evType === 'birthday' ? artist : title;
  const artistLine = evType !== 'birthday' ? `<div class="ctt-artist">${esc(artist)}</div>` : '';
  const dateLine = dtxt ? `<div class="ctt-date${dtf ? ' ' + dtf : ''}">${esc(dtxt)}</div>` : '';

  _calEvTooltip.innerHTML = `
    <div class="ctt-img-wrap"></div>
    <div class="ctt-body">
      ${dateLine}
      <div class="ctt-title">${esc(mainTitle)}</div>
      ${artistLine}
      <div class="ctt-type">${detail}</div>
    </div>`;

  const imgWrap = _calEvTooltip.querySelector('.ctt-img-wrap');
  if (mbid) {
    const img = document.createElement('img');
    img.className = 'ctt-img';
    img.alt = '';
    img.onerror = () => { if (imgWrap.isConnected) imgWrap.innerHTML = _calTtPlaceholderHtml(artist); };
    img.src = `https://coverartarchive.org/release-group/${mbid}/front-250`;
    imgWrap.appendChild(img);
  } else {
    imgWrap.innerHTML = _calTtPlaceholderHtml(artist);
    if (evType === 'birthday' && artist) _loadCalTtArtistImg(imgWrap, artist);
  }

  _calEvTooltip.style.display = 'flex';
  const rect = target.getBoundingClientRect();
  const ttW = _calEvTooltip.offsetWidth || 220;
  const ttH = _calEvTooltip.offsetHeight || 90;
  let left = rect.right + 8;
  let top = rect.top - 4;
  if (left + ttW > window.innerWidth - 8) left = rect.left - ttW - 8;
  if (top + ttH > window.innerHeight - 8) top = window.innerHeight - ttH - 8;
  _calEvTooltip.style.left = `${Math.max(8, left)}px`;
  _calEvTooltip.style.top = `${Math.max(8, top)}px`;
}

function _hideCalEvTooltip() {
  _calEvHideTimer = setTimeout(() => { _calEvTooltip.style.display = 'none'; }, 130);
}

document.addEventListener('mouseover', e => {
  const ev = e.target.closest('.cal-ev[data-ctt]');
  if (ev) { _showCalEvTooltip(ev); return; }
  if (e.target.closest('#calEvTooltip')) clearTimeout(_calEvHideTimer);
});

document.addEventListener('mouseout', e => {
  if (!e.target.closest('.cal-ev[data-ctt]') && !e.target.closest('#calEvTooltip')) return;
  const to = e.relatedTarget;
  if (to && (to.closest('.cal-ev[data-ctt]') || to.closest('#calEvTooltip'))) return;
  _hideCalEvTooltip();
});

// ─── TIME MACHINE ──────────────────────────────────────────────
const tmToggles = (() => {
  const saved = localStorage.getItem('dc_tm_toggles');
  if (saved) { try { return JSON.parse(saved); } catch (e) {} }
  return { songs: true, artists: true, albums: true };
})();
let tmData = null;
let tmImgQueue = Promise.resolve();
let tmLoaderId = 0;

function buildTimeMachineData() {
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  const todayYear = today.getFullYear();

  const pastPlays = allPlays.filter(p =>
    p.date instanceof Date &&
    p.date.getMonth() === todayMonth &&
    p.date.getDate() === todayDay &&
    p.date.getFullYear() < todayYear
  );

  const songsSeen = new Set();
  const songs = [];
  for (const p of pastPlays) {
    const year = p.date.getFullYear();
    const k = p.title + '\0' + p.artist + '\0' + year;
    if (!songsSeen.has(k)) {
      songsSeen.add(k);
      songs.push({ type: 'song', title: p.title, artist: p.artist, album: p.album || '—', year });
    }
  }

  const artistsSeen = new Set();
  const artists = [];
  for (const p of pastPlays) {
    const year = p.date.getFullYear();
    const list = (p.artists && p.artists.length) ? p.artists : [p.artist];
    for (const ar of list) {
      const k = ar + '\0' + year;
      if (!artistsSeen.has(k)) {
        artistsSeen.add(k);
        artists.push({ type: 'artist', artist: ar, year });
      }
    }
  }

  const albumsSeen = new Set();
  const albums = [];
  for (const p of pastPlays) {
    if (!p.album || p.album === '—') continue;
    const year = p.date.getFullYear();
    const aa = albumArtist(p);
    const k = p.album + '\0' + aa + '\0' + year;
    if (!albumsSeen.has(k)) {
      albumsSeen.add(k);
      albums.push({ type: 'album', album: p.album, artist: aa, year });
    }
  }

  return { songs, artists, albums };
}

function tmShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderTimeMachine(forceRebuild) {
  const section = document.getElementById('timeMachineSection');
  const track = document.getElementById('tmTickerTrack');
  if (!section || !track || !allPlays.length) return;

  for (const type of ['songs', 'artists', 'albums']) {
    const btn = document.getElementById('tmToggle' + type.charAt(0).toUpperCase() + type.slice(1));
    if (btn) btn.classList.toggle('active', !!tmToggles[type]);
  }

  const newData = buildTimeMachineData();
  const newHash = newData.songs.length + '|' + newData.artists.length + '|' + newData.albums.length;

  if (!forceRebuild && tmData && tmData._hash === newHash && track.firstChild) return;

  newData._hash = newHash;
  tmData = newData;

  let entries = [];
  if (tmToggles.songs) entries = entries.concat(tmData.songs);
  if (tmToggles.artists) entries = entries.concat(tmData.artists);
  if (tmToggles.albums) entries = entries.concat(tmData.albums);
  entries = tmShuffle(entries);

  const tickerOuter = document.getElementById('tmTickerOuter');
  if (entries.length === 0) {
    if (tickerOuter) tickerOuter.style.display = 'none';
    track.innerHTML = '';
    return;
  }
  section.style.display = '';
  if (tickerOuter) tickerOuter.style.display = '';

  tmImgQueue = Promise.resolve();
  const myLoaderId = ++tmLoaderId;

  const aSongItems = [], aArtistItems = [], aAlbumItems = [];
  const bSongItems = [], bArtistItems = [], bAlbumItems = [];

  function buildCard(entry, i, suffix, songArr, artistArr, albumArr) {
    const imgId = 'tmimg-' + suffix + '-' + i;
    if (entry.type === 'song') {
      const sub = entry.artist + (entry.album && entry.album !== '—' ? ' · ' + entry.album : '');
      const prefKey = 'song:' + entry.artist.toLowerCase() + '|||' + entry.title.toLowerCase();
      songArr.push({ imgId, title: entry.title, artist: entry.artist, album: entry.album, name: entry.title, prefKey });
      return '<div class="tm-card tm-card-song" data-type="song" onclick="_ytPlayOrQueue(' + esc(JSON.stringify(entry.title)) + ',' + esc(JSON.stringify(entry.artist)) + ',' + esc(JSON.stringify(entry.album)) + ')">' +
        '<div class="tm-card-img" id="' + esc(imgId) + '"><div class="thumb-initials">' + esc(initials(entry.title)) + '</div></div>' +
        '<div class="tm-card-info">' +
        '<div class="tm-card-title">' + esc(entry.title) + '</div>' +
        '<div class="tm-card-sub">' + esc(sub) + '</div>' +
        '<div class="tm-card-year">' + entry.year + '</div>' +
        '</div></div>';
    } else if (entry.type === 'artist') {
      const prefKey = 'artist:' + entry.artist.toLowerCase();
      artistArr.push({ imgId, name: entry.artist, artist: entry.artist, album: '', title: '', prefKey });
      return '<div class="tm-card tm-card-search" data-type="artist" onclick="window.open(\'https://www.google.com/search?q=\'+encodeURIComponent(' + esc(JSON.stringify(entry.artist)) + '),\'_blank\')">' +
        '<div class="tm-card-img" id="' + esc(imgId) + '"><div class="thumb-initials">' + esc(initials(entry.artist)) + '</div></div>' +
        '<div class="tm-card-info">' +
        '<div class="tm-card-title">' + esc(entry.artist) + '</div>' +
        '<div class="tm-card-year">' + entry.year + '</div>' +
        '</div></div>';
    } else {
      const prefKey = 'album:' + entry.artist.toLowerCase() + '|||' + entry.album.toLowerCase();
      albumArr.push({ imgId, album: entry.album, artist: entry.artist, name: entry.album, title: '', prefKey });
      return '<div class="tm-card tm-card-search" data-type="album" onclick="window.open(\'https://www.google.com/search?q=\'+encodeURIComponent(' + esc(JSON.stringify(entry.album + ' ' + entry.artist)) + '),\'_blank\')">' +
        '<div class="tm-card-img" id="' + esc(imgId) + '"><div class="thumb-initials">' + esc(initials(entry.album)) + '</div></div>' +
        '<div class="tm-card-info">' +
        '<div class="tm-card-title">' + esc(entry.album) + '</div>' +
        '<div class="tm-card-sub">' + esc(entry.artist) + '</div>' +
        '<div class="tm-card-year">' + entry.year + '</div>' +
        '</div></div>';
    }
  }

  const firstCopy = entries.map((e, i) => buildCard(e, i, 'a', aSongItems, aArtistItems, aAlbumItems)).join('');
  const secondCopy = entries.map((e, i) => buildCard(e, i, 'b', bSongItems, bArtistItems, bAlbumItems)).join('');

  track.innerHTML = firstCopy + secondCopy;
  track.style.animationDuration = Math.max(20, entries.length * 4) + 's';

  // Load images for a-copy in parallel batches; mirror results to b-copy (halves API calls)
  async function loadTmBatch(aPairs, type, loaderId) {
    const BATCH = 4;
    for (let i = 0; i < aPairs.length; i += BATCH) {
      if (tmLoaderId !== loaderId) return;
      await Promise.all(aPairs.slice(i, i + BATCH).map(async ([aItem, bItem]) => {
        if (tmLoaderId !== loaderId) return;
        const aEl = document.getElementById(aItem.imgId);
        if (!aEl) return;
        await fetchAndInjectImage(aEl, aItem, type);
        const bEl = document.getElementById(bItem.imgId);
        if (bEl) bEl.innerHTML = aEl.innerHTML;
      }));
    }
  }

  const ldr = myLoaderId;
  const songPairs  = aSongItems.map((a, i) => [a, bSongItems[i]]);
  const artistPairs = aArtistItems.map((a, i) => [a, bArtistItems[i]]);
  const albumPairs  = aAlbumItems.map((a, i) => [a, bAlbumItems[i]]);

  tmImgQueue = tmImgQueue
    .then(() => loadTmBatch(songPairs,   'song',   ldr))
    .then(() => loadTmBatch(artistPairs, 'artist', ldr))
    .then(() => loadTmBatch(albumPairs,  'album',  ldr));
}

function tmToggleType(type) {
  tmToggles[type] = !tmToggles[type];
  const id = 'tmToggle' + type.charAt(0).toUpperCase() + type.slice(1);
  const btn = document.getElementById(id);
  if (btn) btn.classList.toggle('active', tmToggles[type]);
  localStorage.setItem('dc_tm_toggles', JSON.stringify(tmToggles));
  if (typeof dcSaveUserConfig === 'function') dcSaveUserConfig();
  renderTimeMachine(true);
}

// ─── AWARDS ──────────────────────────────────────────────────────────────────

const AWARD_CATEGORIES = [
  // Core — always have data
  { id: 'song_of_year',      label: 'Song of the Year',           type: 'song',   filter: 'all',         defaultOn: true,  emoji: '🎵' },
  { id: 'album_of_year',     label: 'Album of the Year',          type: 'album',  filter: 'all',         defaultOn: true,  emoji: '💿' },
  { id: 'artist_of_year',    label: 'Artist of the Year',         type: 'artist', filter: 'all',         defaultOn: true,  emoji: '🎤' },
  { id: 'new_artist',        label: 'New Artist of the Year',     type: 'artist', filter: 'new',         defaultOn: true,  emoji: '🌱' },
  { id: 'best_collab',       label: 'Best Collaboration',         type: 'song',   filter: 'collab',      defaultOn: true,  emoji: '🤝' },
  { id: 'best_duo',          label: 'Best Duo',                   type: 'song',   filter: 'duo',         defaultOn: false, emoji: '👥' },
  { id: 'song_summer',       label: 'Song of the Summer',         type: 'song',   filter: 'summer',      defaultOn: true,  emoji: '🏖️' },
  { id: 'best_comeback',     label: 'Best Comeback',              type: 'artist', filter: 'comeback',    defaultOn: true,  emoji: '💪' },
  { id: 'best_discovery',    label: 'Best Discovery',             type: 'artist', filter: 'discovery',   defaultOn: true,  emoji: '🔭' },
  { id: 'most_growth',       label: 'Most Growth',                type: 'artist', filter: 'growth',      defaultOn: false, emoji: '📈' },
  { id: 'obsessive_play',    label: 'Most Obsessive Play',        type: 'song',   filter: 'spike',       defaultOn: true,  emoji: '🔁' },
  { id: 'streak_song',       label: 'Streak Award',               type: 'song',   filter: 'streak',      defaultOn: false, emoji: '🔥' },
  { id: 'one_hit_wonder',    label: 'One-Hit Wonder of the Year', type: 'artist', filter: 'one_hit',     defaultOn: false, emoji: '⚡' },
  { id: 'best_remix',        label: 'Best Remix',                 type: 'song',   filter: 'remix',       defaultOn: false, emoji: '🎚️' },
  { id: 'late_discovery',    label: 'Album You Discovered Late',  type: 'album',  filter: 'late_disc',   defaultOn: false, emoji: '🕰️' },
  // Genre-based songs (opt-in)
  { id: 'best_pop_song',     label: 'Best Pop Song',              type: 'song',   filter: 'genre:pop',         defaultOn: false, emoji: '🎀' },
  { id: 'best_rock_song',    label: 'Best Rock Song',             type: 'song',   filter: 'genre:rock',        defaultOn: false, emoji: '🎸' },
  { id: 'best_alt_song',     label: 'Best Alternative Song',      type: 'song',   filter: 'genre:alternative', defaultOn: false, emoji: '🤘' },
  { id: 'best_hiphop_song',  label: 'Best Hip-Hop/Rap Song',      type: 'song',   filter: 'genre:hip-hop',     defaultOn: false, emoji: '🎧' },
  { id: 'best_rnb_song',     label: 'Best R&B/Soul Song',         type: 'song',   filter: 'genre:rnb',         defaultOn: false, emoji: '🎷' },
  { id: 'best_latin_song',   label: 'Best Latin Song',            type: 'song',   filter: 'genre:latin',       defaultOn: false, emoji: '💃' },
  { id: 'best_electronic',   label: 'Best Electronic/Dance Song', type: 'song',   filter: 'genre:electronic',  defaultOn: false, emoji: '🪩' },
  { id: 'best_kpop_song',    label: 'Best K-Pop Song',            type: 'song',   filter: 'genre:k-pop',       defaultOn: false, emoji: '💜' },
  { id: 'best_nonenglish',   label: 'Best Non-English Song',      type: 'song',   filter: 'nonenglish',        defaultOn: false, emoji: '🌍' },
  // Genre-based albums (opt-in)
  { id: 'best_pop_album',    label: 'Best Pop Album',             type: 'album',  filter: 'genre:pop',         defaultOn: false, emoji: '🎀' },
  { id: 'best_rock_album',   label: 'Best Rock Album',            type: 'album',  filter: 'genre:rock',        defaultOn: false, emoji: '🎸' },
  { id: 'best_alt_album',    label: 'Best Alternative Album',     type: 'album',  filter: 'genre:alternative', defaultOn: false, emoji: '🤘' },
  { id: 'best_hiphop_album', label: 'Best Hip-Hop Album',         type: 'album',  filter: 'genre:hip-hop',     defaultOn: false, emoji: '🎧' },
  { id: 'best_latin_album',  label: 'Best Latin Album',           type: 'album',  filter: 'genre:latin',       defaultOn: false, emoji: '💃' },
  { id: 'best_kpop_album',   label: 'Best K-Pop Album',           type: 'album',  filter: 'genre:k-pop',       defaultOn: false, emoji: '💜' },
  // Stat awards (auto-awarded)
  { id: 'stat_top_song',     label: 'Most Played Song',           type: 'song',   filter: 'stat',        defaultOn: true,  auto: true, emoji: '🎶' },
  { id: 'stat_top_album',    label: 'Most Played Album',          type: 'album',  filter: 'stat',        defaultOn: true,  auto: true, emoji: '📀' },
  { id: 'stat_top_artist',   label: 'Most Played Artist',         type: 'artist', filter: 'stat',        defaultOn: true,  auto: true, emoji: '⭐' },
];

const COLLAB_EXCEPTIONS = [
  'Tyler, The Creator', 'Earth, Wind & Fire', 'Simon & Garfunkel',
  'Of Monsters and Men', 'Panic! at the Disco', 'Portugal. The Man',
];

let _awardsYear     = tzNow().getFullYear() - 1;
let _awardsYearData = {};
let _awardsSubTab   = 'mygrammys';
let _awardsGenreCache = {};
let _awardsGenreQueue = {};
const _awardsAlbumYearCache = {};
let _awardsPickerSelMap   = {};   // key → item, while picker modal is open
let _awardsPickerCatType  = '';
let _awardsPickerCatFilter = '';
let _awardsPickerEligWin  = { start: '', end: '' };
let _awardsPickerAutoCands = [];
let _realLifeYear   = tzNow().getFullYear();

function _awardsDefaultData(year) {
  const cats = {};
  for (const cat of AWARD_CATEGORIES) {
    cats[cat.id] = { enabled: cat.defaultOn, nominees: [], winner: null };
  }
  return { year, eligStart: `${year}-01-01`, eligEnd: `${year}-12-31`, categories: cats };
}

async function _awardsLoad(year) {
  if (_awardsYearData[year]) return _awardsYearData[year];
  const remote = (typeof dcLoadAwards === 'function') ? await dcLoadAwards(year) : null;
  if (remote) {
    // Ensure any newly-added categories exist in the loaded data
    for (const cat of AWARD_CATEGORIES) {
      if (!remote.categories[cat.id]) remote.categories[cat.id] = { enabled: cat.defaultOn, nominees: [], winner: null };
    }
    _awardsYearData[year] = remote;
  } else {
    _awardsYearData[year] = _awardsDefaultData(year);
  }
  return _awardsYearData[year];
}

async function _awardsEnsureAllYearsLoaded() {
  if (!allPlays.length) return;
  const minYear = tzDate(allPlays[allPlays.length - 1].date).getFullYear();
  const maxYear = tzNow().getFullYear();
  const toLoad = [];
  for (let y = minYear; y <= maxYear; y++) {
    if (!_awardsYearData[y]) toLoad.push(_awardsLoad(y));
  }
  if (toLoad.length) await Promise.all(toLoad);
}

function _renderModalGrammyStrip(artistName) {
  const catMap = Object.fromEntries(AWARD_CATEGORIES.map(c => [c.id, c]));
  const entries = [];
  for (const [year, yearData] of Object.entries(_awardsYearData)) {
    if (!yearData?.categories) continue;
    for (const [catId, cat] of Object.entries(yearData.categories)) {
      if (!cat.enabled) continue;
      const catInfo = catMap[catId];
      if (!catInfo) continue;
      const inNominees = (cat.nominees || []).some(n => n.artist === artistName);
      const isWinner = cat.winner?.artist === artistName;
      if (inNominees || isWinner) entries.push({ year: parseInt(year), label: catInfo.label, isWin: isWinner });
    }
  }
  entries.sort((a, b) => (b.isWin - a.isWin) || (b.year - a.year));
  const noms = entries.length;
  const wins = entries.filter(e => e.isWin).length;
  const grammyEl = document.getElementById('modalGrammyStrip');
  grammyEl.innerHTML = `
    <div class="modal-stat"><div class="se">🏅</div><div class="sv" data-countup="${noms}">${noms}</div><div class="sl">Nominations</div></div>
    <div class="modal-stat ${wins > 0 ? 'modal-stat--gold' : ''}"><div class="se">🏆</div><div class="sv ${wins > 0 ? 'sv--gold' : ''}" data-countup="${wins}">${wins}</div><div class="sl">Wins</div></div>
  `;
  animateModalCountup(grammyEl);
  const detailEl = document.getElementById('modalGrammyDetail');
  if (entries.length > 0) {
    const n = entries.length;
    const listHTML = entries.map(e =>
      `<div class="modal-grammy-entry${e.isWin ? ' modal-grammy-entry--win' : ''}"><span class="mge-icon">${e.isWin ? '🏆' : '🏅'}</span><span class="mge-year">${e.year}</span><span class="mge-cat">${esc(e.label)}</span></div>`
    ).join('');
    detailEl.innerHTML = `<button class="modal-grammy-toggle" onclick="toggleModalGrammyDetail(this)" data-count="${n}">▾ Show all ${n} categor${n === 1 ? 'y' : 'ies'}</button><div class="modal-grammy-list" style="display:none">${listHTML}</div>`;
  } else {
    detailEl.innerHTML = '';
  }
}

async function _awardsSave(year) {
  const data = _awardsYearData[year];
  if (!data) return;
  if (typeof dcSaveAwards === 'function') await dcSaveAwards(year, data);
}

function _isCollab(play) {
  if (Array.isArray(play.artists) && play.artists.length > 1) return true;
  const artist = play.artist || '';
  const cleaned = COLLAB_EXCEPTIONS.reduce((s, ex) => s.replace(ex, ex.replace(/,/g, '​')), artist);
  const parts = cleaned.split(/,|(?:\s+(?:&|feat\.?|ft\.?|x)\s+)/i).map(s => s.trim()).filter(Boolean);
  return parts.length > 1;
}

function _isDuo(play) {
  if (Array.isArray(play.artists)) return play.artists.length === 2;
  const artist = play.artist || '';
  const cleaned = COLLAB_EXCEPTIONS.reduce((s, ex) => s.replace(ex, ex.replace(/,/g, '​')), artist);
  const parts = cleaned.split(/,|(?:\s+(?:&|feat\.?|ft\.?|x)\s+)/i).map(s => s.trim()).filter(Boolean);
  return parts.length === 2;
}

function _isRemix(play) {
  return /\b(remix|remaster|edit|version|cover)\b/i.test(play.title || '');
}

function _hasNonLatinScript(str) {
  return /[Ѐ-ӿ؀-ۿऀ-ॿ぀-ヿ㐀-䶿一-鿿가-힯฀-๿ᄀ-ᇿ]/.test(str || '');
}

function _sk(p) { return `${(p.title||'').toLowerCase()}|||${(p.artist||'').toLowerCase()}`; }
function _ak(p) { return `${(p.album||'').toLowerCase()}|||${(p.artist||'').toLowerCase()}`; }
function _rk(p) { return (p.artist||'').toLowerCase(); }
function _pa(p)  { return (Array.isArray(p.artists) && p.artists.length) ? p.artists[0] : (p.artist || ''); }
function _pk(p)  { return _pa(p).toLowerCase(); }

function _awardsCountMaps(plays) {
  const songs = {}, albums = {}, artists = {};
  for (const p of plays) {
    const sk = _sk(p), pk = _pk(p);
    const albumKey = `${(p.album||'').toLowerCase()}|||${pk}`;
    if (!songs[sk])   songs[sk]   = { title: p.title,  artist: p.artist, album: p.album, plays: 0 };
    if (!albums[albumKey] && p.album) albums[albumKey] = { album: p.album, artist: _pa(p), plays: 0 };
    if (!artists[pk]) artists[pk] = { artist: _pa(p), plays: 0 };
    songs[sk].plays++;
    if (p.album) albums[albumKey].plays++;
    artists[pk].plays++;
  }
  return { songs, albums, artists };
}

function _awardsTopN(map, n, cap) {
  cap = cap || 3;
  const sorted = Object.values(map).sort((a, b) => b.plays - a.plays);
  const result = [], ac = {};
  for (const item of sorted) {
    const key = (item.artist || '').toLowerCase();
    ac[key] = (ac[key] || 0);
    if (ac[key] >= cap) continue;
    ac[key]++;
    result.push(item);
    if (result.length >= n) break;
  }
  return result;
}

async function _awardsGetArtistGenre(artist) {
  const key = (artist || '').toLowerCase();
  if (_awardsGenreCache[key] !== undefined) return _awardsGenreCache[key];
  if (_awardsGenreQueue[key]) return _awardsGenreQueue[key];
  const apiKey = localStorage.getItem('dc_lfm_api_key') || 'a8a5bfd6f2e57c45c4bdf6b5c58e1cd5';
  _awardsGenreQueue[key] = fetch(
    `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${encodeURIComponent(artist)}&api_key=${encodeURIComponent(apiKey)}&format=json`
  ).then(r => r.json()).then(d => {
    const tags = (d?.toptags?.tag || []).map(t => t.name.toLowerCase()).slice(0, 10);
    _awardsGenreCache[key] = tags;
    delete _awardsGenreQueue[key];
    return tags;
  }).catch(() => { _awardsGenreCache[key] = []; delete _awardsGenreQueue[key]; return []; });
  return _awardsGenreQueue[key];
}

async function _awardsGetAlbumYear(album, artist) {
  const key = album.toLowerCase() + '|||' + artist.toLowerCase();
  if (key in _awardsAlbumYearCache) return _awardsAlbumYearCache[key];
  const albumL      = album.toLowerCase();
  const artistW     = artist.toLowerCase().split(/[\s,&]/)[0];
  const searchArtist = artist.split(',')[0].trim(); // drop collab artists for API queries

  // 1. iTunes
  try {
    const q = encodeURIComponent(searchArtist + ' ' + album);
    const r = await fetch(`https://itunes.apple.com/search?term=${q}&entity=album&limit=10`);
    const d = await r.json();
    const results = d?.results || [];
    const match = results.find(x =>
      x.collectionName?.toLowerCase().includes(albumL) &&
      x.artistName?.toLowerCase().includes(artistW)
    );
    if (match?.releaseDate) {
      const year = new Date(match.releaseDate).getFullYear();
      _awardsAlbumYearCache[key] = year;
      return year;
    }
  } catch (e) {}

  // 2. Deezer
  try {
    const r = await deezerFetch(`search/album?q=${encodeURIComponent(searchArtist + ' ' + album)}&limit=10`);
    if (r.ok) {
      const d = await r.json();
      const items = d?.data || [];
      const match = items.find(x =>
        x.title?.toLowerCase().includes(albumL) &&
        x.artist?.name?.toLowerCase().includes(artistW)
      );
      const year = match?.release_date ? parseInt(match.release_date.slice(0, 4), 10) : null;
      if (year) {
        _awardsAlbumYearCache[key] = year;
        return year;
      }
    }
  } catch (e) {}

  // 3. MusicBrainz
  try {
    const mbid = await searchArtistMBID(searchArtist);
    if (mbid) {
      const groups = await fetchAllReleasesRaw(mbid);
      const match = groups.find(g => g.title?.toLowerCase() === albumL)
        || groups.find(g => g.title?.toLowerCase().includes(albumL));
      const year = match?.['first-release-date'] ? parseInt(match['first-release-date'].slice(0, 4), 10) : null;
      if (year) {
        _awardsAlbumYearCache[key] = year;
        return year;
      }
    }
  } catch (e) {}

  _awardsAlbumYearCache[key] = null;
  return null;
}

function _genreMatch(tags, filterStr) {
  const g = filterStr.replace('genre:', '');
  const aliases = {
    'pop':         ['pop','dance pop','electropop','synth-pop','teen pop','pop rock','indie pop'],
    'rock':        ['rock','classic rock','hard rock','indie rock','punk rock','alternative rock','metal','emo','post-rock'],
    'alternative': ['alternative','indie','indie rock','alternative rock','post-punk','dream pop','shoegaze'],
    'hip-hop':     ['hip-hop','hip hop','rap','trap','conscious hip hop'],
    'rnb':         ['r&b','soul','neo soul','contemporary r&b','rnb','rhythm and blues'],
    'latin':       ['latin','reggaeton','latin pop','salsa','cumbia','bachata','latin rap','regional mexicano'],
    'electronic':  ['electronic','edm','house','techno','dance','electro','synth-pop','trance','ambient'],
    'k-pop':       ['k-pop','kpop','korean pop','k pop','korean'],
  };
  const list = aliases[g] || [g];
  return tags.some(t => list.some(m => t === m));
}

async function _awardsGeminiClassifyArtists(artists) {
  const apiKey = localStorage.getItem('dc_gemini_api_key');
  if (!apiKey) return;
  const needed = artists.filter(a => _awardsGenreCache[a.toLowerCase()] === undefined);
  if (!needed.length) return;
  const tags = 'rock, classic rock, hard rock, indie rock, punk rock, alternative rock, metal, emo, post-rock, alternative, indie, indie rock, post-punk, dream pop, shoegaze, hip-hop, hip hop, rap, trap, conscious hip hop, r&b, soul, neo soul, contemporary r&b, rnb, rhythm and blues, pop, dance pop, indie pop, pop rock, teen pop, synth-pop, electropop, latin, reggaeton, latin pop, salsa, cumbia, bachata, latin rap, regional mexicano, electronic, edm, house, techno, dance, electro, trance, ambient, k-pop, kpop, korean pop, k pop, korean';
  const prompt = `Classify each music artist using ONLY these genre tags (use multiple per artist if applicable):\n${tags}\n\nReturn a JSON object: { "Artist Name": ["tag1", "tag2"] }. Include every artist listed, even if unsure — guess based on your knowledge.\n\nArtists to classify:\n${needed.join('\n')}`;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0 }
      })
    });
    if (!res.ok) throw new Error('Gemini ' + res.status);
    const d = await res.json();
    const text = d?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('empty response');
    const map = JSON.parse(text);
    for (const [artist, artistTags] of Object.entries(map)) {
      const key = artist.toLowerCase();
      if (needed.some(a => a.toLowerCase() === key)) {
        _awardsGenreCache[key] = Array.isArray(artistTags) ? artistTags.map(t => String(t).toLowerCase()) : [];
      }
    }
  } catch (e) { /* fall through to Last.fm */ }
}

async function _awardsGetCandidates(catDef, eligStart, eligEnd, log) {
  const start = new Date(eligStart + 'T00:00:00');
  const end   = new Date(eligEnd   + 'T23:59:59');
  const inWin = allPlays.filter(p => p.date >= start && p.date <= end);
  if (!inWin.length) return [];
  const { songs, albums, artists } = _awardsCountMaps(inWin);
  const f = catDef.filter;

  if (f === 'stat') {
    if (catDef.type === 'song')   return _awardsTopN(songs,   1, 99);
    if (catDef.type === 'album')  return _awardsTopN(albums,  1, 99);
    if (catDef.type === 'artist') return _awardsTopN(artists, 1, 99);
    return [];
  }
  if (f === 'all') {
    if (catDef.type === 'song')   return _awardsTopN(songs,   20, 3);
    if (catDef.type === 'album')  return _awardsTopN(albums,  20, 3);
    if (catDef.type === 'artist') return _awardsTopN(artists, 20, 1);
    return [];
  }
  if (f === 'collab') {
    const m = {};
    for (const p of inWin) { if (!_isCollab(p)) continue; const k = _sk(p); m[k] = m[k] || { title: p.title, artist: p.artist, album: p.album, plays: 0 }; m[k].plays++; }
    return _awardsTopN(m, 20, 4);
  }
  if (f === 'duo') {
    const m = {};
    for (const p of inWin) { if (!_isDuo(p)) continue; const k = _sk(p); m[k] = m[k] || { title: p.title, artist: p.artist, album: p.album, plays: 0 }; m[k].plays++; }
    return _awardsTopN(m, 20, 4);
  }
  if (f === 'remix') {
    const m = {};
    for (const p of inWin) { if (!_isRemix(p)) continue; const k = _sk(p); m[k] = m[k] || { title: p.title, artist: p.artist, album: p.album, plays: 0 }; m[k].plays++; }
    return _awardsTopN(m, 20, 3);
  }
  if (f === 'summer') {
    const sp = inWin.filter(p => { const m = tzDate(p.date).getMonth(); return m >= 5 && m <= 7; });
    const { songs: ss } = _awardsCountMaps(sp);
    return _awardsTopN(ss, 20, 3);
  }
  if (f === 'new' || f === 'discovery') {
    if (!firstSeenMaps) firstSeenMaps = buildFirstSeenMaps();
    const m = {};
    for (const p of inWin) {
      const pa = _pa(p);
      const k  = pa.toLowerCase();
      const first = firstSeenMaps.artistFirst[pa];
      if (!first || first < start) continue;
      m[k] = m[k] || { artist: pa, plays: 0 };
      m[k].plays++;
    }
    return _awardsTopN(m, 20, 1);
  }
  if (f === 'comeback') {
    // Gap: 2 years before the selected year's start
    const gapS = new Date(start); gapS.setFullYear(gapS.getFullYear() - 2);
    const gapE = new Date(start); gapE.setDate(gapE.getDate() - 1);
    // Before-gap: anything played before the 2-year gap
    const beforeGapE = new Date(gapS); beforeGapE.setDate(beforeGapE.getDate() - 1);
    const gapSet    = new Set(allPlays.filter(p => p.date >= gapS && p.date <= gapE).map(p => _pk(p)));
    const historySet = new Set(allPlays.filter(p => p.date <= beforeGapE).map(p => _pk(p)));
    const m = {};
    for (const p of inWin) {
      const k = _pk(p);
      if (gapSet.has(k)) continue;     // played within the 2-year gap → not a comeback
      if (!historySet.has(k)) continue; // never played before the gap → new artist, not a comeback
      m[k] = m[k] || { artist: _pa(p), plays: 0 };
      m[k].plays++;
    }
    return _awardsTopN(m, 20, 1);
  }
  if (f === 'growth') {
    const prevS = new Date(start); prevS.setFullYear(prevS.getFullYear() - 1);
    const prevE = new Date(start); prevE.setDate(prevE.getDate() - 1);
    const { artists: prev } = _awardsCountMaps(allPlays.filter(p => p.date >= prevS && p.date <= prevE));
    const m = {};
    for (const [k, d] of Object.entries(artists)) {
      const delta = d.plays - (prev[k]?.plays || 0);
      if (delta > 0) m[k] = { artist: d.artist, plays: delta };
    }
    return _awardsTopN(m, 20, 1);
  }
  if (f === 'spike') {
    const weekPeak = {};
    for (const p of inWin) {
      const d = tzDate(p.date);
      const wk = `${d.getFullYear()}-${Math.floor((d.getDate() - 1) / 7)}`;
      const k = _sk(p) + '|||' + wk;
      weekPeak[k] = weekPeak[k] || { title: p.title, artist: p.artist, album: p.album, plays: 0, sk: _sk(p) };
      weekPeak[k].plays++;
    }
    const best = {};
    for (const v of Object.values(weekPeak)) { if (!best[v.sk] || v.plays > best[v.sk].plays) best[v.sk] = v; }
    return _awardsTopN(best, 20, 3);
  }
  if (f === 'streak') {
    const dayMap = {};
    for (const p of inWin) {
      const d = tzDate(p.date);
      const day = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const k = _sk(p);
      if (!dayMap[k]) dayMap[k] = { title: p.title, artist: p.artist, album: p.album, days: new Set() };
      dayMap[k].days.add(day);
    }
    const m = {};
    for (const [k, v] of Object.entries(dayMap)) {
      const streak = longestConsecutiveDays(v.days);
      if (streak >= 2) m[k] = { title: v.title, artist: v.artist, album: v.album, plays: streak, playLabel: `${streak}-day streak` };
    }
    return _awardsTopN(m, 20, 3);
  }
  if (f === 'one_hit') {
    const as = {};
    for (const p of inWin) { const k = _pk(p); const sk = _sk(p); if (!as[k]) as[k] = { artist: _pa(p), songPlays: {}, songTitles: {} }; as[k].songPlays[sk] = (as[k].songPlays[sk] || 0) + 1; as[k].songTitles[sk] = p.title; }
    const m = {};
    for (const [k, v] of Object.entries(as)) { const hits = Object.entries(v.songPlays).filter(([, c]) => c >= 10); if (hits.length === 1) { const [sk, plays] = hits[0]; m[k] = { artist: v.artist, song: v.songTitles[sk], plays }; } }
    return _awardsTopN(m, 20, 1);
  }
  if (f === 'late_disc') {
    // Count plays per album strictly before the awards year window.
    const priorPlays = {};
    for (const p of allPlays) {
      if (p.date >= start || !p.album) continue;
      const k = _ak(p);
      priorPlays[k] = (priorPlays[k] || 0) + 1;
    }
    const m = {};
    for (const p of inWin) {
      if (!p.album) continue;
      const k = _ak(p);
      // Allow albums the user barely knew before (≤20 prior plays) — covers both
      // true first-time discoveries and slow burns that finally clicked this year.
      if ((priorPlays[k] || 0) > 20) continue;
      m[k] = m[k] || { album: p.album, artist: p.artist, plays: 0 };
      m[k].plays++;
    }
    // Exclude albums released during the awards year — those aren't late discoveries.
    // (Only needed for the zero-prior-plays case; any prior play proves an earlier release.)
    const awardsYear = start.getFullYear();
    const candidates = Object.entries(m).map(([k, v]) => ({ k, ...v }));
    if (log) log(`Fetching release years for ${candidates.length} album${candidates.length !== 1 ? 's' : ''}…`);
    await Promise.all(candidates.map(c => _awardsGetAlbumYear(c.album, c.artist)));
    for (const { k, album, artist } of candidates) {
      const releaseYear = _awardsAlbumYearCache[album.toLowerCase() + '|||' + artist.toLowerCase()];
      const prior = priorPlays[k] || 0;
      // Exclude if release year is known and falls within the awards year.
      // Also exclude if year is unknown AND prior plays = 0: any prior play proves an older
      // release, but zero prior plays with no API result almost certainly means a new release.
      if ((releaseYear !== null && releaseYear >= awardsYear) || (releaseYear === null && prior === 0)) {
        delete m[k];
      } else if (m[k]) {
        m[k].releaseYear = releaseYear;
      }
    }
    return _awardsTopN(m, 20, 2);
  }
  if (f === 'nonenglish') {
    const m = {};
    for (const p of inWin) {
      if (!_hasNonLatinScript(p.title) && !_hasNonLatinScript(p.artist)) continue;
      const k = _sk(p); m[k] = m[k] || { title: p.title, artist: p.artist, album: p.album, plays: 0 }; m[k].plays++;
    }
    return _awardsTopN(m, 20, 3);
  }
  if (f.startsWith('genre:')) {
    const uniq = [...new Set(inWin.map(p => _pa(p)))];
    await _awardsGeminiClassifyArtists(uniq.slice(0, 150));
    await Promise.all(uniq.filter(a => _awardsGenreCache[a.toLowerCase()] === undefined).slice(0, 60).map(a => _awardsGetArtistGenre(a)));
    const gs = {}, ga = {}, gr = {};
    for (const p of inWin) {
      const tags = _awardsGenreCache[_pa(p).toLowerCase()] || [];
      if (!_genreMatch(tags, f)) continue;
      const sk = _sk(p), ak = _ak(p), rk = _rk(p);
      if (!gs[sk]) gs[sk] = { title: p.title, artist: p.artist, album: p.album, plays: 0 };
      if (!ga[ak] && p.album) ga[ak] = { album: p.album, artist: p.artist, plays: 0 };
      if (!gr[rk]) gr[rk] = { artist: p.artist, plays: 0 };
      gs[sk].plays++; if (p.album) ga[ak].plays++; gr[rk].plays++;
    }
    if (catDef.type === 'song')   return _awardsTopN(gs, 20, 3);
    if (catDef.type === 'album')  return _awardsTopN(ga, 20, 2);
    if (catDef.type === 'artist') return _awardsTopN(gr, 20, 1);
  }
  return [];
}

// ── UI Rendering ──────────────────────────────────────────────────────────────

async function awardsInit() {
  document.getElementById('awardsYearLabel').textContent   = _awardsYear;
  document.getElementById('realLifeYearLabel').textContent = _realLifeYear;
  awardsSubTab(_awardsSubTab);
}

function awardsSubTab(tab) {
  _awardsSubTab = tab;
  document.querySelectorAll('.awards-subnav-btn').forEach(b => b.classList.toggle('active', b.dataset.awardsTab === tab));
  document.getElementById('awardsMyGrammys').style.display = tab === 'mygrammys' ? '' : 'none';
  document.getElementById('awardsRealLife').style.display  = tab === 'reallife'  ? '' : 'none';
  if (tab === 'mygrammys') awardsRenderYear(_awardsYear);
  if (tab === 'reallife')  loadRealLifeAwards(_realLifeYear);
}

function awardsChangeYear(delta) {
  _awardsYear = Math.max(2000, Math.min(tzNow().getFullYear(), _awardsYear + delta));
  document.getElementById('awardsYearLabel').textContent = _awardsYear;
  awardsRenderYear(_awardsYear);
}

function realLifeAwardsChangeYear(delta) {
  _realLifeYear = Math.max(2000, Math.min(tzNow().getFullYear(), _realLifeYear + delta));
  document.getElementById('realLifeYearLabel').textContent = _realLifeYear;
  loadRealLifeAwards(_realLifeYear);
}

async function awardsRenderYear(year) {
  const statusEl = document.getElementById('awardsStatus');
  statusEl.textContent = '';
  if (!allPlays.length) {
    statusEl.textContent = 'Load your music data to use My Grammys.';
    document.getElementById('awardsCatList').innerHTML = '';
    document.getElementById('awardsCeremonyBar').style.display = 'none';
    return;
  }
  statusEl.textContent = 'Loading…';
  const data = await _awardsLoad(year);
  statusEl.textContent = '';
  _awardsRenderCatToggles(data);
  document.getElementById('awardsEligStart').value = data.eligStart;
  document.getElementById('awardsEligEnd').value   = data.eligEnd;
  _awardsRenderCatList(data);
}

function _awardsRenderCatToggles(data) {
  const el = document.getElementById('awardsCatToggles');
  if (!el) return;
  el.innerHTML = AWARD_CATEGORIES.map(cat => {
    const enabled = data.categories[cat.id]?.enabled ?? cat.defaultOn;
    return `<label class="awards-cat-toggle-row">
      <input type="checkbox" ${enabled ? 'checked' : ''} onchange="awardsToggleCat('${cat.id}',this.checked)">
      <span class="awards-type-badge awards-type-${cat.type}">${cat.type}</span>
      ${esc(t('awards_cat_' + cat.id))}${cat.auto ? ' <span class="awards-auto-badge">auto</span>' : ''}
    </label>`;
  }).join('');
}

function _awardsRenderCatList(data) {
  const el = document.getElementById('awardsCatList');
  if (!el) return;
  const activeCats = AWARD_CATEGORIES.filter(c => data.categories[c.id]?.enabled ?? c.defaultOn);
  if (!activeCats.length) {
    el.innerHTML = `<div class="awards-empty">${t('awards_no_categories')}</div>`;
    document.getElementById('awardsCeremonyBar').style.display = 'none';
    return;
  }
  el.innerHTML = activeCats.map(cat => _awardsRenderCatCard(cat, data.categories[cat.id] || { enabled: true, nominees: [], winner: null }, data.year)).join('');
  const hasWinner = activeCats.some(c => data.categories[c.id]?.winner);
  document.getElementById('awardsCeremonyBar').style.display = hasWinner ? '' : 'none';
}

function _awardItemKey(item) {
  return JSON.stringify({ t: item.title || '', al: item.album || '', ar: item.artist || '' });
}

function _awardsRenderCatCard(cat, catData, year) {
  const nominees  = catData.nominees || [];
  const winner    = catData.winner   || null;
  const winnerKey = winner ? _awardItemKey(winner) : null;
  const emoji     = cat.emoji || { song: '🎵', album: '💿', artist: '🎤' }[cat.type] || '🏆';

  let bodyHtml = '';
  if (cat.auto && nominees.length) {
    const w = nominees[0];
    bodyHtml = `<div class="awards-auto-winner">
      <span class="awards-winner-trophy">🏆</span>
      <span class="awards-winner-text">${esc(w.title || w.album || w.artist || '')}</span>
      ${(w.title || w.album) && w.artist ? `<span class="awards-winner-sub">${esc(w.artist)}</span>` : ''}
    </div>`;
  } else if (nominees.length) {
    bodyHtml = nominees.map(item => {
      const ik  = _awardItemKey(item);
      const lbl = item.title || item.album || item.artist || '';
      const sub = item.title ? item.artist : (item.album ? item.artist : (item.song || ''));
      return `<div class="awards-nominee-row${ik === winnerKey ? ' is-winner' : ''}" onclick="awardsPickWinner(${year},'${esc(cat.id)}',${esc(JSON.stringify(item))})">
        <span class="awards-nominee-icon">${ik === winnerKey ? '🏆' : '○'}</span>
        <span class="awards-nominee-label">${esc(lbl)}</span>
        ${sub ? `<span class="awards-nominee-sub">${esc(sub)}</span>` : ''}
        <button class="awards-nominee-remove" onclick="awardsRemoveNominee(event,${year},'${esc(cat.id)}',${esc(JSON.stringify(item))})" title="Remove">✕</button>
      </div>`;
    }).join('') + (!winner ? `<div class="awards-pick-hint">${t('awards_pick_hint')}</div>` : '');
  } else {
    bodyHtml = `<div class="awards-no-nominees">${t('awards_no_nominees')}</div>`;
  }

  const genBtn = cat.auto ? '' : `<button class="awards-cat-action-btn" onclick="awardsGenerateCatCandidates(${year},'${esc(cat.id)}')" data-catid="${esc(cat.id)}">${nominees.length ? t('awards_change_btn') : t('awards_pick_nominees_btn')}</button>`;

  return `<div class="awards-cat-card${winner ? ' has-winner' : ''}" id="awardsCat_${cat.id}">
    <div class="awards-cat-header">
      <span class="awards-cat-emoji">${emoji}</span>
      <span class="awards-cat-name">${esc(t('awards_cat_' + cat.id))}</span>
      ${cat.auto ? '<span class="awards-auto-tag">auto</span>' : ''}
    </div>
    <div class="awards-cat-body">${bodyHtml}</div>
    <div class="awards-cat-footer">${genBtn}</div>
  </div>`;
}

function awardsToggleConfig() {
  const panel = document.getElementById('awardsConfigPanel');
  const open = panel.style.display !== 'none';
  panel.style.display = open ? 'none' : '';
  document.getElementById('awardsConfigToggleBtn').classList.toggle('active', !open);
  if (!open) {
    const keyEl = document.getElementById('awardsGeminiKey');
    if (keyEl) keyEl.value = localStorage.getItem('dc_gemini_api_key') || '';
  }
}

function awardsUpdateElig() {
  const data = _awardsYearData[_awardsYear];
  if (!data) return;
  data.eligStart = document.getElementById('awardsEligStart').value;
  data.eligEnd   = document.getElementById('awardsEligEnd').value;
  _awardsSave(_awardsYear);
}

function awardsToggleCat(catId, enabled) {
  const data = _awardsYearData[_awardsYear];
  if (!data) return;
  if (!data.categories[catId]) data.categories[catId] = { enabled, nominees: [], winner: null };
  data.categories[catId].enabled = enabled;
  _awardsSave(_awardsYear);
  _awardsRenderCatList(data);
}

function awardsToggleAllCats(enabled) {
  const data = _awardsYearData[_awardsYear];
  if (!data) return;
  for (const cat of AWARD_CATEGORIES) {
    if (!data.categories[cat.id]) data.categories[cat.id] = { enabled, nominees: [], winner: null };
    data.categories[cat.id].enabled = enabled;
  }
  _awardsRenderCatToggles(data);
  _awardsSave(_awardsYear);
  _awardsRenderCatList(data);
}

async function awardsGenerateCandidates() {
  if (!allPlays.length) return;
  const btn = document.getElementById('awardsGenerateBtn');
  const statusEl = document.getElementById('awardsStatus');
  const log = msg => { if (statusEl) statusEl.textContent = msg; };

  if (btn) { btn.disabled = true; btn.textContent = t('awards_generating'); }
  log('Loading year data…');
  const data = await _awardsLoad(_awardsYear);
  const active = AWARD_CATEGORIES.filter(c => data.categories[c.id]?.enabled ?? c.defaultOn);

  for (const cat of active) {
    log(`Calculating ${cat.label}…`);
    const cands = await _awardsGetCandidates(cat, data.eligStart, data.eligEnd, log);
    const cd = data.categories[cat.id];
    if (cat.auto) {
      cd.nominees = cands.slice(0, 1);
      cd.winner   = cands[0] || null;
    } else if (!cd.nominees.length && cands.length) {
      cd.nominees = cands.slice(0, 8);
    }
  }
  log('Saving…');
  await _awardsSave(_awardsYear);
  if (btn) { btn.disabled = false; btn.textContent = t('awards_generate'); }
  if (statusEl) statusEl.textContent = '';
  _awardsRenderCatList(data);
}

async function awardsGenerateCatCandidates(year, catId) {
  const data = _awardsYearData[year] || await _awardsLoad(year);
  if (!data) return;
  const catDef = AWARD_CATEGORIES.find(c => c.id === catId);
  if (!catDef) return;
  const btn = document.querySelector(`[data-catid="${catId}"]`);
  if (btn) btn.textContent = t('awards_loading');
  const cands = await _awardsGetCandidates(catDef, data.eligStart, data.eligEnd);
  if (btn) btn.textContent = t('awards_change_btn');
  _awardsShowPicker(year, catId, cands);
}

function _awardsPickerResultRow(item) {
  const lbl = item.title || item.album || item.artist || '';
  const sub = item.title ? item.artist : (item.album ? item.artist : '');
  const rel = item.releaseYear ? ' · ' + item.releaseYear : (item.releaseYear === null ? ' · year unknown' : '');
  let genreHtml = '';
  if (_awardsPickerCatFilter.startsWith('genre:')) {
    const tags = _awardsGenreCache[_pa(item).toLowerCase()];
    if (tags && tags.length) {
      genreHtml = `<span class="awards-picker-genre-tags">${tags.slice(0, 3).map(t => `<span class="awards-picker-genre-tag">${esc(t)}</span>`).join('')}</span>`;
    } else {
      genreHtml = `<span class="awards-picker-genre-tags"><span class="awards-picker-genre-tag awards-picker-genre-unk">${tags === undefined ? '?' : 'no genre'}</span></span>`;
    }
  }
  return `<div class="awards-picker-result-row" data-item="${esc(JSON.stringify(item))}" onclick="awardsPickerAddItem(this)">
    <span class="awards-picker-add-icon">+</span>
    <span class="awards-picker-lbl">${esc(lbl)}</span>
    ${sub ? `<span class="awards-picker-sub">${esc(sub)}${rel}</span>` : ''}
    ${genreHtml}
    <span class="awards-picker-plays">${item.playLabel || item.plays + ' plays'}</span>
  </div>`;
}

function _awardsPickerSelHtml() {
  const items = Object.values(_awardsPickerSelMap);
  if (!items.length) return '<div class="awards-picker-nom-empty">No nominees selected — add from suggestions below</div>';
  return items.map(item => {
    const ik  = _awardItemKey(item);
    const lbl = item.title || item.album || item.artist || '';
    const sub = item.title ? item.artist : (item.album ? item.artist : '');
    return `<div class="awards-picker-nom-row">
      <span class="awards-picker-nom-lbl">${esc(lbl)}</span>
      ${sub ? `<span class="awards-picker-nom-sub">${esc(sub)}</span>` : ''}
      <span class="awards-picker-nom-plays">${item.playLabel || item.plays + ' plays'}</span>
      <button class="awards-picker-nom-x" data-key="${esc(ik)}" onclick="awardsPickerRemoveNom(this)" title="Remove">✕</button>
    </div>`;
  }).join('');
}

function _awardsPickerBodyHtml() {
  const avail = _awardsPickerAutoCands.filter(c => !_awardsPickerSelMap[_awardItemKey(c)]);
  return avail.length
    ? avail.map(_awardsPickerResultRow).join('')
    : `<div class="awards-empty">${t('awards_no_candidates')}</div>`;
}

function _awardsPickerRefresh() {
  const selEl  = document.getElementById('awardsPickerSelected');
  const countEl = document.getElementById('awardsPickerCount');
  if (selEl)   selEl.innerHTML = _awardsPickerSelHtml();
  if (countEl) countEl.textContent = t('awards_picker_selected', {count: Object.keys(_awardsPickerSelMap).length});
  const q = (document.getElementById('awardsPickerSearch')?.value || '').trim();
  const bodyEl = document.getElementById('awardsPickerBody');
  if (!bodyEl) return;
  if (q) awardsPickerDoSearch(); else bodyEl.innerHTML = _awardsPickerBodyHtml();
}

function _awardsShowPicker(year, catId, candidates) {
  const data = _awardsYearData[year];
  if (!data) return;
  const catDef = AWARD_CATEGORIES.find(c => c.id === catId);
  if (!catDef) return;

  const existingNominees = data.categories[catId]?.nominees || [];
  _awardsPickerSelMap    = {};
  existingNominees.forEach(n => { _awardsPickerSelMap[_awardItemKey(n)] = n; });
  _awardsPickerCatType   = catDef.type;
  _awardsPickerCatFilter = catDef.filter || '';
  _awardsPickerEligWin   = { start: data.eligStart, end: data.eligEnd };
  _awardsPickerAutoCands = candidates;

  const typeLabel = catDef.type === 'song' ? 'songs' : catDef.type === 'album' ? 'albums' : 'artists';
  const html = `<div class="awards-picker-overlay" id="awardsPickerOverlay" onclick="awardsPickerBgClick(event)">
    <div class="awards-picker-modal">
      <div class="awards-picker-head">
        <span class="awards-picker-title">${esc(t('awards_cat_' + catDef.id))}</span>
        <button class="awards-picker-close" onclick="awardsPickerClose()">✕</button>
      </div>
      <div class="awards-picker-selected" id="awardsPickerSelected">${_awardsPickerSelHtml()}</div>
      <div class="awards-picker-search">
        <input type="text" id="awardsPickerSearch" placeholder="Search ${typeLabel} from ${year}…" oninput="awardsPickerDoSearch()" autocomplete="off" spellcheck="false">
      </div>
      <div class="awards-picker-body" id="awardsPickerBody">${_awardsPickerBodyHtml()}</div>
      <div class="awards-picker-foot">
        <span class="awards-picker-count" id="awardsPickerCount">${t('awards_picker_selected', {count: existingNominees.length})}</span>
        <button class="awards-picker-save" onclick="awardsPickerSave(${year},'${catId}')">${t('awards_save_nominees')}</button>
      </div>
    </div>
  </div>`;

  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap.firstElementChild);
  requestAnimationFrame(() => document.getElementById('awardsPickerSearch')?.focus());
}

function awardsPickerAddItem(el) {
  const item = JSON.parse(el.dataset.item);
  _awardsPickerSelMap[_awardItemKey(item)] = item;
  _awardsPickerRefresh();
}

function awardsPickerRemoveNom(btn) {
  delete _awardsPickerSelMap[btn.dataset.key];
  _awardsPickerRefresh();
}

function awardsPickerDoSearch() {
  const q      = (document.getElementById('awardsPickerSearch')?.value || '').toLowerCase().trim();
  const bodyEl = document.getElementById('awardsPickerBody');
  if (!bodyEl) return;
  if (!q) { bodyEl.innerHTML = _awardsPickerBodyHtml(); return; }

  const start = new Date(_awardsPickerEligWin.start + 'T00:00:00');
  const end   = new Date(_awardsPickerEligWin.end   + 'T23:59:59');
  const inWin = allPlays.filter(p => p.date >= start && p.date <= end);
  const map   = {};

  for (const p of inWin) {
    if (_awardsPickerCatType === 'song') {
      const k = _sk(p);
      if (!map[k]) map[k] = { title: p.title, artist: p.artist, album: p.album, plays: 0 };
      map[k].plays++;
    } else if (_awardsPickerCatType === 'album') {
      if (!p.album) continue;
      const k = `${p.album.toLowerCase()}|||${_pk(p)}`;
      if (!map[k]) map[k] = { album: p.album, artist: _pa(p), plays: 0 };
      map[k].plays++;
    } else {
      const k = _rk(p);
      if (!map[k]) map[k] = { artist: p.artist, plays: 0 };
      map[k].plays++;
    }
  }

  const isGenreCat = _awardsPickerCatFilter.startsWith('genre:');
  const hits = Object.values(map)
    .filter(item => {
      if (_awardsPickerSelMap[_awardItemKey(item)]) return false;
      if (!([item.title, item.album, item.artist].filter(Boolean).join(' ').toLowerCase().includes(q))) return false;
      if (isGenreCat) {
        const artistKey = _pa(item).toLowerCase();
        const tags = _awardsGenreCache[artistKey];
        if (tags === undefined) return false;
        return _genreMatch(tags, _awardsPickerCatFilter);
      }
      return true;
    })
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 50);

  bodyEl.innerHTML = hits.length
    ? hits.map(_awardsPickerResultRow).join('')
    : `<div class="awards-empty">No results for "${esc(q)}"</div>`;
}

function awardsPickerBgClick(e) { if (e.target.id === 'awardsPickerOverlay') awardsPickerClose(); }
function awardsPickerClose() {
  const el = document.getElementById('awardsPickerOverlay');
  if (el) el.remove();
  _awardsPickerSelMap = {};
}

async function awardsPickerSave(year, catId) {
  const nominees = Object.values(_awardsPickerSelMap);
  awardsPickerClose();
  const data = _awardsYearData[year];
  if (!data) return;
  if (!data.categories[catId]) data.categories[catId] = { enabled: true, nominees: [], winner: null };
  data.categories[catId].nominees = nominees;
  const wk = data.categories[catId].winner ? _awardItemKey(data.categories[catId].winner) : null;
  if (wk && !nominees.some(n => _awardItemKey(n) === wk)) data.categories[catId].winner = null;
  await _awardsSave(year);
  _awardsRenderCatList(data);
}

async function awardsPickWinner(year, catId, item) {
  const data = _awardsYearData[year];
  if (!data?.categories?.[catId]) return;
  const curWk = data.categories[catId].winner ? _awardItemKey(data.categories[catId].winner) : null;
  data.categories[catId].winner = (_awardItemKey(item) === curWk) ? null : item;
  await _awardsSave(year);
  _awardsRenderCatList(data);
}

async function awardsRemoveNominee(e, year, catId, item) {
  e.stopPropagation();
  const data = _awardsYearData[year];
  if (!data?.categories?.[catId]) return;
  const ik = _awardItemKey(item);
  data.categories[catId].nominees = data.categories[catId].nominees.filter(n => _awardItemKey(n) !== ik);
  if (data.categories[catId].winner && _awardItemKey(data.categories[catId].winner) === ik) data.categories[catId].winner = null;
  await _awardsSave(year);
  _awardsRenderCatList(data);
}

// ── Real-Life Awards ──────────────────────────────────────────────────────────

async function loadRealLifeAwards(year) {
  const contentEl = document.getElementById('realLifeContent');
  const statusEl  = document.getElementById('realLifeStatus');
  contentEl.innerHTML = '';
  statusEl.textContent = `Looking up Grammy nominations for your top artists in ${year}…`;

  const start = new Date(`${year}-01-01`);
  const end   = new Date(`${year}-12-31T23:59:59`);
  const inYear = allPlays.filter(p => p.date >= start && p.date <= end);
  if (!inYear.length && !allPlays.length) {
    statusEl.textContent = 'Load your music data first.';
    return;
  }
  const pool = inYear.length ? inYear : allPlays;
  const { artists } = _awardsCountMaps(pool);
  const topArtists  = _awardsTopN(artists, 20, 1);

  const results = [];
  for (const a of topArtists) {
    const awards = await _mbFetchAwards(a.artist, year);
    if (awards.length) results.push({ artist: a.artist, awards });
    await new Promise(r => setTimeout(r, 1100));
  }

  statusEl.textContent = '';
  if (!results.length) {
    contentEl.innerHTML = `<div class="awards-empty">No Grammy data found for your top ${topArtists.length} artists in ${year}. MusicBrainz coverage may be incomplete for this period.</div>`;
    return;
  }

  contentEl.innerHTML = results.map(r =>
    `<div class="awards-reallife-card">
      <div class="awards-reallife-artist">${esc(r.artist)}</div>
      ${r.awards.map(a => `<div class="awards-reallife-row">
        <span class="awards-reallife-badge ${a.won ? 'won' : 'nom'}">${a.won ? '🏆 Won' : '🎗 Nominated'}</span>
        <span class="awards-reallife-cat">${esc(a.category)}</span>
        ${a.year ? `<span class="awards-reallife-year">${a.year}</span>` : ''}
      </div>`).join('')}
    </div>`
  ).join('');
}

async function _mbFetchAwards(artist, year) {
  try {
    const r1 = await fetch(`https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(`"${artist}"`)}&fmt=json&limit=1`);
    const d1 = await r1.json();
    const mbid = d1?.artists?.[0]?.id;
    if (!mbid) return [];
    await new Promise(r => setTimeout(r, 1100));
    const r2 = await fetch(`https://musicbrainz.org/ws/2/artist/${mbid}?inc=artist-rels&fmt=json`);
    const d2 = await r2.json();
    const out = [];
    for (const rel of (d2.relations || [])) {
      if (!rel.series) continue;
      const name = rel.series?.name || '';
      if (!/grammy/i.test(name)) continue;
      const relYear = (rel.begin || rel.end || '').split('-')[0];
      if (relYear && Math.abs(parseInt(relYear) - year) > 1) continue;
      out.push({ category: name, year: relYear, won: (rel.attributes || []).includes('Winner') });
    }
    return out;
  } catch(_) { return []; }
}

// ── Ceremony ──────────────────────────────────────────────────────────────────

let _ceremonyYear = null;
let _ceremonyCats = [];
let _ceremonyIdx  = 0;
let _ceremonyRevealed = false;

function startAwardsCeremony() {
  const data = _awardsYearData[_awardsYear];
  if (!data) return;
  _ceremonyYear = _awardsYear;
  _ceremonyCats = AWARD_CATEGORIES.filter(c => {
    const cd = data.categories[c.id];
    return cd?.enabled && (cd.nominees?.length > 0 || cd.winner);
  });
  if (!_ceremonyCats.length) return;
  _ceremonyIdx = 0;
  document.getElementById('awardsCeremonyOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  _ceremonyDrawSidebar(data);
  _ceremonyDrawStage(data, 0);
}

function closeCeremony() {
  document.getElementById('awardsCeremonyOverlay').style.display = 'none';
  document.body.style.overflow = '';
}

function ceremonyOverlayClick(e) {
  if (e.target.id === 'awardsCeremonyOverlay') closeCeremony();
}

function _ceremonyDrawSidebar(data) {
  document.getElementById('ceremonySidebar').innerHTML =
    `<div class="ceremony-sidebar-title">${_ceremonyYear} My Grammys</div>` +
    _ceremonyCats.map((cat, i) => {
      const done = !!data.categories[cat.id]?.winner;
      return `<div class="ceremony-sidebar-row${i === _ceremonyIdx ? ' active' : ''}${done ? ' done' : ''}" onclick="ceremonyGoTo(${i})">
        <span>${done ? '🏆' : '○'}</span> ${esc(t('awards_cat_' + cat.id))}
      </div>`;
    }).join('');
}

function _ceremonyDrawStage(data, idx) {
  _ceremonyIdx = idx;
  const cat     = _ceremonyCats[idx];
  const catData = data.categories[cat.id] || { nominees: [], winner: null };
  const nominees = catData.nominees || [];
  const winner   = catData.winner   || null;

  document.getElementById('ceremonyYearBadge').textContent = `${_ceremonyYear} My Grammys`;
  document.getElementById('ceremonyCatName').textContent   = t('awards_cat_' + cat.id);
  document.getElementById('ceremonyProgress').textContent  = `${idx + 1} / ${_ceremonyCats.length}`;

  const wk = winner ? _awardItemKey(winner) : null;
  document.getElementById('ceremonyNominees').innerHTML = nominees.map(n => {
    const nik = _awardItemKey(n);
    const lbl = n.title || n.album || n.artist || '';
    const sub = n.title ? n.artist : (n.album ? n.artist : (n.song || ''));
    return `<div class="ceremony-nominee-row${nik === wk ? ' is-winner' : ''}">
      <span class="ceremony-nom-dot">${nik === wk ? '🏆' : '○'}</span>
      <span class="ceremony-nom-lbl">${esc(lbl)}</span>
      ${sub ? `<span class="ceremony-nom-sub">${esc(sub)}</span>` : ''}
    </div>`;
  }).join('') || `<div class="ceremony-no-nom">${t('awards_ceremony_no_nom')}</div>`;

  const revBtn  = document.getElementById('ceremonyRevealBtn');
  const winWrap = document.getElementById('ceremonyWinnerWrap');

  if (winner) {
    _ceremonyRevealed = true;
    revBtn.style.display  = 'none';
    winWrap.style.display = '';
    const lbl = winner.title || winner.album || winner.artist || '';
    const sub = winner.title ? winner.artist : (winner.album ? winner.artist : '');
    document.getElementById('ceremonyWinnerName').textContent = lbl;
    document.getElementById('ceremonyWinnerSub').textContent  = sub || '';
    _triggerConfetti();
  } else {
    _ceremonyRevealed = false;
    revBtn.style.display  = '';
    winWrap.style.display = 'none';
  }
  document.querySelectorAll('.ceremony-sidebar-row').forEach((el, i) => el.classList.toggle('active', i === idx));
}

function ceremonyReveal() {
  if (_ceremonyRevealed) return;
  const data   = _awardsYearData[_ceremonyYear];
  if (!data) return;
  const winner = data.categories[_ceremonyCats[_ceremonyIdx].id]?.winner;
  document.getElementById('ceremonyRevealBtn').style.display = 'none';
  const winWrap = document.getElementById('ceremonyWinnerWrap');
  winWrap.style.display = '';
  const lbl = winner ? (winner.title || winner.album || winner.artist || 'Unknown') : '—';
  const sub = winner?.title ? winner.artist : (winner?.album ? winner.artist : '');
  document.getElementById('ceremonyWinnerName').textContent = lbl;
  document.getElementById('ceremonyWinnerSub').textContent  = sub || '';
  if (winner) {
    document.querySelectorAll('.ceremony-nominee-row').forEach(row => {
      if (row.querySelector('.ceremony-nom-lbl')?.textContent === lbl) row.classList.add('is-winner', 'winner-flash');
    });
    _triggerConfetti();
  }
  _ceremonyRevealed = true;
}

function ceremonyNav(delta) {
  const data = _awardsYearData[_ceremonyYear];
  if (!data) return;
  const newIdx = Math.max(0, Math.min(_ceremonyCats.length - 1, _ceremonyIdx + delta));
  _ceremonyRevealed = false;
  _ceremonyDrawStage(data, newIdx);
  _ceremonyDrawSidebar(data);
}

function ceremonyGoTo(idx) {
  const data = _awardsYearData[_ceremonyYear];
  if (!data) return;
  _ceremonyRevealed = false;
  _ceremonyDrawStage(data, idx);
  _ceremonyDrawSidebar(data);
}

function _triggerConfetti() {
  const el = document.getElementById('ceremonyConfetti');
  if (!el) return;
  el.innerHTML = '';
  const colors = ['#FFD700','#FF69B4','#00CED1','#FF6347','#7B68EE','#32CD32','#FF8C00'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `left:${Math.random()*100}%;background:${colors[i%colors.length]};animation-delay:${(Math.random()*0.8).toFixed(2)}s;animation-duration:${(1+Math.random()).toFixed(2)}s;width:${6+Math.random()*6|0}px;height:${6+Math.random()*6|0}px;border-radius:${Math.random()>.5?'50%':'3px'};`;
    el.appendChild(p);
  }
  setTimeout(() => { if (el) el.innerHTML = ''; }, 2500);
}

// ═══════════════════════════════════════════════════════════════
// ─── YOUR SOUNDTRACK ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

let stPeriodType = 'year';
let stYear = tzNow().getFullYear();
let stMonth = tzNow().getMonth() + 1;
let _stCurrentPlays = [];
let _stReplayTimer = null;
let _stCardMode = null;

function stGetPeriodPlays() {
  if (stPeriodType === 'alltime') return allPlays.slice();
  return allPlays.filter(p => {
    const d = tzDate(p.date);
    if (stPeriodType === 'year') return d.getFullYear() === stYear;
    return d.getFullYear() === stYear && (d.getMonth() + 1) === stMonth;
  });
}

const ST_MONTH_KEYS = ['month_jan','month_feb','month_mar','month_apr','month_may_short','month_jun','month_jul','month_aug','month_sep','month_oct','month_nov','month_dec'];

function stGetPeriodLabel() {
  if (stPeriodType === 'alltime') return t('st_period_alltime');
  if (stPeriodType === 'year') return String(stYear);
  return t(ST_MONTH_KEYS[stMonth - 1]) + ' ' + stYear;
}

function stSetPeriod(type) {
  stPeriodType = type;
  document.querySelectorAll('.st-period-btn').forEach(b => b.classList.toggle('active', b.dataset.stPeriod === type));
  const navBar = document.getElementById('stNavBar');
  if (navBar) navBar.style.display = type === 'alltime' ? 'none' : '';
  if (type === 'year') { stYear = tzNow().getFullYear(); }
  if (type === 'month') { stYear = tzNow().getFullYear(); stMonth = tzNow().getMonth() + 1; }
  renderSoundtrack();
}

function stNavigate(dir) {
  if (stPeriodType === 'year') {
    const newYear = stYear + dir;
    if (newYear > tzNow().getFullYear()) return;
    stYear = newYear;
  } else if (stPeriodType === 'month') {
    let m = stMonth + dir, y = stYear;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    const now = tzNow();
    if (y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth() + 1)) return;
    stYear = y; stMonth = m;
  }
  renderSoundtrack();
}

function renderSoundtrack() {
  if (!allPlays.length) {
    document.getElementById('stStatsStrip').innerHTML = `<div class="st-empty">${t('st_no_data')}</div>`;
    return;
  }
  const plays = stGetPeriodPlays();
  _stCurrentPlays = plays;

  const navLabel = document.getElementById('stNavLabel');
  if (navLabel) navLabel.textContent = stGetPeriodLabel();

  stRenderStats(plays);
  stRenderTopCharts(plays);
  stRenderActivity(plays);
  stRenderLoyalty(plays);
  stRenderDiscoveries(plays);
  stRenderMilestones(plays);
  stRenderStreaks(plays);
  stRenderGrammys(plays);
  stRenderGem(plays);

  // Reset replay
  const replayCanvas = document.getElementById('stReplayCanvas');
  const replayBtn = document.getElementById('stReplayBtn');
  const replayStop = document.getElementById('stReplayStopBtn');
  if (replayCanvas) replayCanvas.style.display = 'none';
  if (replayBtn) replayBtn.style.display = '';
  if (replayStop) replayStop.style.display = 'none';
  if (_stReplayTimer) { clearInterval(_stReplayTimer); _stReplayTimer = null; }

  // Close card preview
  const cardPreview = document.getElementById('stCardPreview');
  if (cardPreview) cardPreview.style.display = 'none';

  // Section visibility
  const isYear = stPeriodType === 'year';
  const isAlltime = stPeriodType === 'alltime';
  const loyaltySection = document.getElementById('stLoyaltySection');
  const activitySection = document.getElementById('stActivitySection');
  const replaySection = document.getElementById('stReplaySection');
  if (loyaltySection) loyaltySection.style.display = isYear ? '' : 'none';
  if (activitySection) activitySection.style.display = (isYear || isAlltime) ? '' : 'none';
  if (replaySection) replaySection.style.display = isYear ? '' : 'none';
}

// ── Animated count-up ─────────────────────────────────────────
function stCountUp(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  if (target === 0) { el.textContent = '0'; return; }
  const dur = 900;
  const start = Date.now();
  const tick = () => {
    const p = Math.min((Date.now() - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ── Stats strip ───────────────────────────────────────────────
function stRenderStats(plays) {
  const ids = ['stStatPlaysVal','stStatDaysVal','stStatArtistsVal','stStatNewVal','stStatStreakVal'];
  if (!plays.length) { ids.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '0'; }); return; }

  const daySet = new Set(plays.map(p => { const d = tzDate(p.date); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }));
  const artistSet = new Set(plays.map(p => p.artist.toLowerCase()));

  // New discoveries: artists whose first-ever play falls in this period
  const fsMap = stGetFirstSeenArtists();
  let newCount = 0;
  for (const ak of artistSet) {
    const fd = fsMap[ak];
    if (!fd) continue;
    const ftz = tzDate(fd);
    const inPeriod = stPeriodType === 'alltime' ? true :
      stPeriodType === 'year' ? ftz.getFullYear() === stYear :
      ftz.getFullYear() === stYear && (ftz.getMonth() + 1) === stMonth;
    if (inPeriod) newCount++;
  }

  // Best streak within period
  const sortedDays = [...daySet].sort();
  let best = sortedDays.length ? 1 : 0, cur = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const [ay, am, ad] = sortedDays[i-1].split('-').map(Number);
    const [by, bm, bd] = sortedDays[i].split('-').map(Number);
    const diff = Math.round((new Date(by, bm, bd) - new Date(ay, am, ad)) / 86400000);
    cur = diff === 1 ? cur + 1 : 1;
    if (cur > best) best = cur;
  }

  stCountUp('stStatPlaysVal', plays.length);
  stCountUp('stStatDaysVal', daySet.size);
  stCountUp('stStatArtistsVal', artistSet.size);
  stCountUp('stStatNewVal', newCount);
  stCountUp('stStatStreakVal', best);
}

function stGetFirstSeenArtists() {
  if (firstSeenMaps && firstSeenMaps.artist) return firstSeenMaps.artist;
  const map = {};
  const sorted = [...allPlays].sort((a, b) => a.date - b.date);
  for (const p of sorted) {
    const ak = p.artist.toLowerCase();
    if (!map[ak]) map[ak] = p.date;
  }
  if (!firstSeenMaps) firstSeenMaps = { artist: map, song: {} };
  return map;
}

// ── Top 5 Artists + Songs ─────────────────────────────────────
function stRenderTopCharts(plays) {
  const artistCounts = {};
  for (const p of plays) artistCounts[p.artist] = (artistCounts[p.artist] || 0) + 1;
  const topArtists = Object.entries(artistCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxA = topArtists[0]?.[1] || 1;

  const songCounts = {};
  for (const p of plays) {
    const sk = songKey(p);
    if (!songCounts[sk]) songCounts[sk] = { title: p.title, artist: p.artist, count: 0 };
    songCounts[sk].count++;
  }
  const topSongs = Object.values(songCounts).sort((a, b) => b.count - a.count).slice(0, 5);
  const maxS = topSongs[0]?.count || 1;

  const rankIcon = i => ['🥇','🥈','🥉','4','5'][i];

  const artistHTML = topArtists.length ? topArtists.map(([name, count], i) => `
    <div class="st-top-item">
      <span class="st-top-rank">${rankIcon(i)}</span>
      <div class="st-top-info">
        <div class="st-top-name">${esc(name)}</div>
        <div class="st-top-bar-wrap"><div class="st-top-bar" style="width:${Math.round(count/maxA*100)}%"></div></div>
      </div>
      <span class="st-top-count">${count.toLocaleString()}</span>
    </div>`).join('') : `<div class="st-empty">${t('st_no_data')}</div>`;

  const songHTML = topSongs.length ? topSongs.map((s, i) => `
    <div class="st-top-item">
      <span class="st-top-rank">${rankIcon(i)}</span>
      <div class="st-top-info">
        <div class="st-top-name">${esc(s.title)}</div>
        <div class="st-top-sub">${esc(s.artist)}</div>
        <div class="st-top-bar-wrap"><div class="st-top-bar" style="width:${Math.round(s.count/maxS*100)}%"></div></div>
      </div>
      <span class="st-top-count">${s.count.toLocaleString()}</span>
    </div>`).join('') : `<div class="st-empty">${t('st_no_data')}</div>`;

  const taEl = document.getElementById('stTopArtists');
  const tsEl = document.getElementById('stTopSongs');
  if (taEl) taEl.innerHTML = artistHTML;
  if (tsEl) tsEl.innerHTML = songHTML;
}

// ── Monthly Activity ──────────────────────────────────────────
function stRenderActivity(plays) {
  const el = document.getElementById('stActivityBars');
  if (!el) return;
  if (!plays.length) { el.innerHTML = ''; return; }

  const byMonth = {};
  for (const p of plays) {
    const d = tzDate(p.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    byMonth[key] = (byMonth[key] || 0) + 1;
  }
  const months = Object.keys(byMonth).sort();
  if (!months.length) { el.innerHTML = ''; return; }

  const max = Math.max(...Object.values(byMonth));
  const peakKey = months.reduce((a, b) => byMonth[a] >= byMonth[b] ? a : b);
  const lowKey = months.length > 1 ? months.reduce((a, b) => byMonth[a] <= byMonth[b] ? a : b) : null;

  const barsHTML = months.map(mk => {
    const [y, m] = mk.split('-');
    const label = t(ST_MONTH_KEYS[parseInt(m) - 1]).substring(0, 3);
    const count = byMonth[mk];
    const pct = Math.round(count / max * 100);
    const cls = mk === peakKey ? ' st-peak' : mk === lowKey ? ' st-low' : '';
    return `<div class="st-activity-col${cls}">
      <div class="st-activity-bar-wrap"><div class="st-activity-bar" style="height:${Math.max(pct,2)}%"></div></div>
      <div class="st-activity-label">${label}${months.length > 12 ? '<br><span class="st-activity-year">' + y + '</span>' : ''}</div>
      <div class="st-activity-count">${count.toLocaleString()}</div>
    </div>`;
  }).join('');

  let caption = '';
  if (months.length > 1) {
    const [py, pm] = peakKey.split('-');
    const peakName = t(ST_MONTH_KEYS[parseInt(pm) - 1]);
    const [ly, lm] = lowKey.split('-');
    const lowName = t(ST_MONTH_KEYS[parseInt(lm) - 1]);
    const peakSuffix = py !== String(stYear) ? ' ' + py : '';
    const lowSuffix = ly !== String(stYear) ? ' ' + ly : '';
    caption = `<div class="st-activity-caption">
      <span class="st-peak-label">📈 ${t('st_activity_peak')}: <strong>${peakName}${peakSuffix}</strong> (${byMonth[peakKey].toLocaleString()} ${tUnit('plays', byMonth[peakKey])})</span>
      <span class="st-low-label">📉 ${t('st_activity_low')}: <strong>${lowName}${lowSuffix}</strong> (${byMonth[lowKey].toLocaleString()} ${tUnit('plays', byMonth[lowKey])})</span>
    </div>`;
  }

  el.innerHTML = `<div class="st-activity-chart">${barsHTML}</div>${caption}`;
}

// ── Loyalty Score ─────────────────────────────────────────────
function stRenderLoyalty(plays) {
  const el = document.getElementById('stLoyaltyBody');
  if (!el) return;
  const prevYear = stYear - 1;
  const prevPlays = allPlays.filter(p => tzDate(p.date).getFullYear() === prevYear);

  if (!prevPlays.length || !plays.length) {
    el.innerHTML = `<div class="st-empty">${t('st_loyalty_no_prev', { year: prevYear })}</div>`;
    return;
  }

  const topN = ps => {
    const counts = {};
    for (const p of ps) counts[p.artist.toLowerCase()] = (counts[p.artist.toLowerCase()] || 0) + 1;
    return new Set(Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([a]) => a));
  };

  const prevTop = topN(prevPlays);
  const curTop = topN(plays);
  let returning = 0;
  for (const a of curTop) if (prevTop.has(a)) returning++;

  const total = Math.min(curTop.size, 10);
  const score = total ? Math.round(returning / total * 100) : 0;
  const label = score >= 80 ? t('st_loyalty_die_hard') : score >= 60 ? t('st_loyalty_loyal') : score >= 40 ? t('st_loyalty_mixed') : t('st_loyalty_explorer');

  el.innerHTML = `
    <div class="st-loyalty-score">
      <div class="st-loyalty-pct">${score}%</div>
      <div class="st-loyalty-verdict">${label}</div>
      <div class="st-loyalty-sub">${t('st_loyalty_sub', { n: returning, year: prevYear })}</div>
    </div>
    <div class="st-loyalty-bar-wrap"><div class="st-loyalty-bar" style="width:${score}%"></div></div>`;
}

// ── New Discoveries ───────────────────────────────────────────
function stRenderDiscoveries(plays) {
  const el = document.getElementById('stDiscoveriesBody');
  if (!el) return;
  const fsMap = stGetFirstSeenArtists();
  const discovered = [];
  const seen = new Set();

  for (const p of plays) {
    const ak = p.artist.toLowerCase();
    if (seen.has(ak)) continue;
    seen.add(ak);
    const fd = fsMap[ak];
    if (!fd) continue;
    const ftz = tzDate(fd);
    const inPeriod = stPeriodType === 'alltime' ? true :
      stPeriodType === 'year' ? ftz.getFullYear() === stYear :
      ftz.getFullYear() === stYear && (ftz.getMonth() + 1) === stMonth;
    if (inPeriod) discovered.push({ artist: p.artist, date: fd });
  }

  discovered.sort((a, b) => a.date - b.date);

  if (!discovered.length) {
    el.innerHTML = `<div class="st-empty">${t('st_discoveries_none')}</div>`;
    return;
  }

  const top = discovered.slice(0, 12);
  el.innerHTML = `
    <div class="st-discoveries-count">${t('st_discoveries_count', { n: discovered.length })}</div>
    <div class="st-discoveries-list">
      ${top.map(d => `<div class="st-discovery-item">✨ ${esc(d.artist)}</div>`).join('')}
      ${discovered.length > 12 ? `<div class="st-discovery-more">+${discovered.length - 12} ${t('st_discoveries_more')}</div>` : ''}
    </div>`;
}

// ── Milestones ────────────────────────────────────────────────
function stRenderMilestones(plays) {
  const el = document.getElementById('stMilestonesBody');
  if (!el) return;
  if (!plays.length) { el.innerHTML = `<div class="st-empty">${t('st_milestones_none')}</div>`; return; }

  const OVERALL_MS = [100,500,1000,2500,5000,10000,25000,50000,100000,250000,500000,1000000];
  const ARTIST_MS  = [100,500,1000,2500,5000,10000];

  const chron = [...allPlays].sort((a, b) => a.date - b.date);
  const milestones = [];
  let total = 0, nextIdx = 0;
  const artistCounts = {};

  for (const p of chron) {
    total++;
    const d = tzDate(p.date);
    const inPeriod = stPeriodType === 'alltime' ? true :
      stPeriodType === 'year' ? d.getFullYear() === stYear :
      d.getFullYear() === stYear && (d.getMonth() + 1) === stMonth;

    // Overall milestones
    while (nextIdx < OVERALL_MS.length && total >= OVERALL_MS[nextIdx]) {
      if (inPeriod) milestones.push({ icon:'🎵', text: t('st_milestone_overall', { n: OVERALL_MS[nextIdx].toLocaleString() }), sub: `"${esc(p.title)}" — ${esc(p.artist)}`, date: p.date });
      nextIdx++;
    }

    // Per-artist milestones
    const ak = p.artist.toLowerCase();
    artistCounts[ak] = (artistCounts[ak] || 0) + 1;
    if (inPeriod && ARTIST_MS.includes(artistCounts[ak])) {
      milestones.push({ icon:'🎤', text: t('st_milestone_artist', { artist: esc(p.artist), n: artistCounts[ak].toLocaleString() }), sub: `"${esc(p.title)}"`, date: p.date });
    }
  }

  milestones.sort((a, b) => a.date - b.date);

  if (!milestones.length) { el.innerHTML = `<div class="st-empty">${t('st_milestones_none')}</div>`; return; }

  el.innerHTML = milestones.map(m => {
    const d = tzDate(m.date);
    const ds = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
    return `<div class="st-milestone">
      <span class="st-milestone-icon">${m.icon}</span>
      <div class="st-milestone-info">
        <div class="st-milestone-text">${m.text}</div>
        <div class="st-milestone-sub">${m.sub}</div>
      </div>
      <div class="st-milestone-date">${ds}</div>
    </div>`;
  }).join('');
}

// ── Streaks ───────────────────────────────────────────────────
function stRenderStreaks(plays) {
  const el = document.getElementById('stStreaksBody');
  if (!el) return;
  if (!plays.length) { el.innerHTML = `<div class="st-empty">${t('st_no_data')}</div>`; return; }

  const pad2 = n => String(n).padStart(2, '0');
  const dayKey = d => { const tz = tzDate(d); return `${tz.getFullYear()}-${pad2(tz.getMonth()+1)}-${pad2(tz.getDate())}`; };

  const allDaySet = new Set(allPlays.map(p => dayKey(p.date)));
  const allDays = [...allDaySet].sort();

  // Longest all-time streak
  let longestAll = allDays.length ? 1 : 0, curAll = 1, longestStart = allDays[0] || '', longestEnd = allDays[0] || '', curStart = allDays[0] || '';
  for (let i = 1; i < allDays.length; i++) {
    const diff = Math.round((new Date(allDays[i]) - new Date(allDays[i-1])) / 86400000);
    if (diff === 1) {
      curAll++;
    } else {
      if (curAll > longestAll) { longestAll = curAll; longestStart = curStart; longestEnd = allDays[i-1]; }
      curAll = 1; curStart = allDays[i];
    }
  }
  if (curAll > longestAll) { longestAll = curAll; longestStart = curStart; longestEnd = allDays[allDays.length-1]; }

  // Current streak (today or yesterday)
  const now = tzNow();
  const todayKey = `${now.getFullYear()}-${pad2(now.getMonth()+1)}-${pad2(now.getDate())}`;
  const yd = new Date(now); yd.setDate(yd.getDate() - 1);
  const yestKey = `${yd.getFullYear()}-${pad2(yd.getMonth()+1)}-${pad2(yd.getDate())}`;
  let currentStreak = 0;
  const anchorDay = allDaySet.has(todayKey) ? todayKey : (allDaySet.has(yestKey) ? yestKey : null);
  if (anchorDay) {
    let day = anchorDay;
    while (allDaySet.has(day)) {
      currentStreak++;
      const d = new Date(day); d.setDate(d.getDate() - 1);
      day = `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
    }
  }

  // Longest streak in period
  const periodDays = [...new Set(plays.map(p => dayKey(p.date)))].sort();
  let longestPeriod = periodDays.length ? 1 : 0, curPeriod = 1;
  for (let i = 1; i < periodDays.length; i++) {
    const diff = Math.round((new Date(periodDays[i]) - new Date(periodDays[i-1])) / 86400000);
    curPeriod = diff === 1 ? curPeriod + 1 : 1;
    if (curPeriod > longestPeriod) longestPeriod = curPeriod;
  }

  const fmtDay = ds => { const d = new Date(ds); return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`; };

  el.innerHTML = `
    <div class="st-streaks-grid">
      <div class="st-streak-card">
        <div class="st-streak-num">${currentStreak}🔥</div>
        <div class="st-streak-lbl">${t('st_streak_current')}</div>
      </div>
      <div class="st-streak-card">
        <div class="st-streak-num">${longestAll}</div>
        <div class="st-streak-lbl">${t('st_streak_longest')}</div>
        ${longestStart ? `<div class="st-streak-dates">${fmtDay(longestStart)} – ${fmtDay(longestEnd)}</div>` : ''}
      </div>
      ${stPeriodType !== 'alltime' ? `<div class="st-streak-card">
        <div class="st-streak-num">${longestPeriod}</div>
        <div class="st-streak-lbl">${t('st_streak_in_period', { period: stGetPeriodLabel() })}</div>
      </div>` : ''}
    </div>
    <div class="st-streak-link"><a href="#" onclick="openStreakModal();return false;">${t('st_streak_details')}</a></div>`;
}

// ── Grammy Overlay ────────────────────────────────────────────
function stRenderGrammys(plays) {
  const el = document.getElementById('stGrammysBody');
  if (!el) return;
  if (!plays.length) { el.innerHTML = ''; return; }

  const artistCounts = {};
  for (const p of plays) artistCounts[p.artist.toLowerCase()] = (artistCounts[p.artist.toLowerCase()] || 0) + 1;
  const topArtistKeys = Object.entries(artistCounts).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([a]) => a);

  // Build Grammy map from _awardsYearData (user's own awards across all loaded years)
  const grammyMap = {};
  if (typeof _awardsYearData !== 'undefined') {
    for (const [yr, data] of Object.entries(_awardsYearData)) {
      if (!data) continue;
      // My Grammys: data is {categories: [{id, winner: {artist, title}}]}
      const cats = data.categories || data.cats || [];
      for (const cat of cats) {
        if (!cat.winner || !cat.winner.artist) continue;
        const ak = cat.winner.artist.toLowerCase();
        if (!grammyMap[ak]) grammyMap[ak] = [];
        grammyMap[ak].push({ year: yr, category: cat.label || cat.id || '', isWin: true });
      }
    }
  }

  const withAwards = topArtistKeys
    .filter(ak => grammyMap[ak] && grammyMap[ak].length > 0)
    .map(ak => ({
      artist: plays.find(p => p.artist.toLowerCase() === ak)?.artist || ak,
      plays: artistCounts[ak],
      entries: grammyMap[ak]
    }));

  if (!withAwards.length) {
    el.innerHTML = `<div class="st-empty">${t('st_grammys_none')}</div>`;
    return;
  }

  el.innerHTML = withAwards.slice(0, 8).map(item => {
    const wins = item.entries.filter(e => e.isWin).length;
    return `<div class="st-grammy-item">
      <div class="st-grammy-artist">${esc(item.artist)}</div>
      <div class="st-grammy-badges">
        <span class="st-grammy-win">🏆 ${wins} ${wins === 1 ? t('st_grammy_win') : t('st_grammy_wins')}</span>
      </div>
      <div class="st-grammy-plays">${item.plays.toLocaleString()} ${tUnit('plays', item.plays)}</div>
    </div>`;
  }).join('');
}

// ── Underrated Gem (Last.fm only) ─────────────────────────────
function stRenderGem(plays) {
  const gemSection = document.getElementById('stGemSection');
  if (!gemSection) return;
  const source = localStorage.getItem('dc_source') || '';
  if (source !== 'lastfm') { gemSection.style.display = 'none'; return; }
  gemSection.style.display = '';
  const el = document.getElementById('stGemBody');
  if (!plays.length) { el.innerHTML = ''; return; }

  const apiKey = localStorage.getItem('dc_lfm_api_key') || '';
  if (!apiKey) { gemSection.style.display = 'none'; return; }

  const songCounts = {};
  for (const p of plays) {
    const sk = songKey(p);
    if (!songCounts[sk]) songCounts[sk] = { title: p.title, artist: p.artist, count: 0 };
    songCounts[sk].count++;
  }
  const topSongs = Object.values(songCounts).sort((a, b) => b.count - a.count).slice(0, 8);

  el.innerHTML = `<div class="st-gem-loading">${t('st_gem_loading')}</div>`;

  const fetches = topSongs.slice(0, 5).map(s =>
    fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${encodeURIComponent(apiKey)}&artist=${encodeURIComponent(s.artist)}&track=${encodeURIComponent(s.title)}&format=json`)
      .then(r => r.json())
      .then(d => ({ ...s, listeners: parseInt(d?.track?.listeners || '0') || 0 }))
      .catch(() => ({ ...s, listeners: 0 }))
  );

  Promise.all(fetches).then(results => {
    const valid = results.filter(s => s.listeners > 100);
    if (!valid.length) { gemSection.style.display = 'none'; return; }
    valid.sort((a, b) => (b.count / Math.log(b.listeners + 1)) - (a.count / Math.log(a.listeners + 1)));
    const gem = valid[0];
    el.innerHTML = `
      <div class="st-gem-card">
        <div class="st-gem-icon">💎</div>
        <div class="st-gem-info">
          <div class="st-gem-title">${esc(gem.title)}</div>
          <div class="st-gem-artist">${esc(gem.artist)}</div>
          <div class="st-gem-stats">
            <span>${t('st_gem_your_plays', { n: gem.count.toLocaleString() })}</span>
            <span class="st-gem-sep">·</span>
            <span>${t('st_gem_listeners', { n: gem.listeners.toLocaleString() })}</span>
          </div>
          <div class="st-gem-sub">${t('st_gem_sub')}</div>
        </div>
      </div>`;
  });
}

// ── Chart History Replay ──────────────────────────────────────
function stStartReplay() {
  if (stPeriodType !== 'year' || !allPlays.length) return;
  const replayBtn = document.getElementById('stReplayBtn');
  const replayStop = document.getElementById('stReplayStopBtn');
  const canvas = document.getElementById('stReplayCanvas');
  if (!canvas) return;

  replayBtn.style.display = 'none';
  replayStop.style.display = '';
  canvas.style.display = '';
  canvas.innerHTML = `<div class="st-replay-loading">${t('st_replay_loading')}</div>`;

  // Build weekly snapshots for the selected year
  const yearPlays = allPlays.filter(p => tzDate(p.date).getFullYear() === stYear);
  if (!yearPlays.length) { canvas.innerHTML = `<div class="st-empty">${t('st_no_data')}</div>`; return; }

  // Group by week
  const weekMap = {};
  for (const p of yearPlays) {
    const wk = playWeekKey(p.date);
    (weekMap[wk] || (weekMap[wk] = [])).push(p);
  }
  const weeks = Object.keys(weekMap).sort();

  // Build cumulative top artist per week snapshot
  const snapshots = [];
  const runningCounts = {};
  for (const wk of weeks) {
    for (const p of weekMap[wk]) {
      runningCounts[p.artist] = (runningCounts[p.artist] || 0) + 1;
    }
    const top5 = Object.entries(runningCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const [wy, wm, wd] = wk.split('-').map(Number);
    snapshots.push({ week: wk, label: `${wd}/${wm}`, top5 });
  }

  if (_stReplayTimer) { clearInterval(_stReplayTimer); _stReplayTimer = null; }

  let idx = 0;
  const maxCount = Math.max(...snapshots.map(s => s.top5[0]?.[1] || 0));

  const render = () => {
    if (idx >= snapshots.length) { stStopReplay(); return; }
    const snap = snapshots[idx];
    const max = snap.top5[0]?.[1] || 1;
    const rows = snap.top5.map(([name, count], i) => `
      <div class="st-replay-row">
        <span class="st-replay-rank">${i + 1}</span>
        <div class="st-replay-bar-wrap">
          <div class="st-replay-bar" style="width:${Math.round(count/maxCount*100)}%"></div>
          <span class="st-replay-name">${esc(name)}</span>
        </div>
        <span class="st-replay-count">${count.toLocaleString()}</span>
      </div>`).join('');
    canvas.innerHTML = `
      <div class="st-replay-week-label">${t('st_replay_week_of', { date: snap.label, year: stYear })}</div>
      <div class="st-replay-progress">${t('st_replay_progress', { n: idx + 1, total: snapshots.length })}</div>
      <div class="st-replay-rows">${rows}</div>`;
    idx++;
  };

  render();
  _stReplayTimer = setInterval(render, 600);
}

function stStopReplay() {
  if (_stReplayTimer) { clearInterval(_stReplayTimer); _stReplayTimer = null; }
  const replayBtn = document.getElementById('stReplayBtn');
  const replayStop = document.getElementById('stReplayStopBtn');
  if (replayBtn) replayBtn.style.display = '';
  if (replayStop) replayStop.style.display = 'none';
}

// ── Shareable Card ────────────────────────────────────────────
function stOpenCard(mode) {
  _stCardMode = mode;
  const preview = document.getElementById('stCardPreview');
  const canvas = document.getElementById('stCardCanvas');
  if (!preview || !canvas) return;

  const isStory = mode === 'story';
  const w = isStory ? 360 : 360;
  const h = isStory ? 640 : 360;

  canvas.innerHTML = stBuildCardHTML(mode);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  preview.style.display = '';
  preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function stCloseCard() {
  const preview = document.getElementById('stCardPreview');
  if (preview) preview.style.display = 'none';
  _stCardMode = null;
}

function stBuildCardHTML(mode) {
  const plays = _stCurrentPlays;
  const isStory = mode === 'story';
  const label = stGetPeriodLabel();

  const artistCounts = {};
  for (const p of plays) artistCounts[p.artist] = (artistCounts[p.artist] || 0) + 1;
  const topArtists = Object.entries(artistCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const songCounts = {};
  for (const p of plays) {
    const sk = songKey(p);
    if (!songCounts[sk]) songCounts[sk] = { title: p.title, artist: p.artist, count: 0 };
    songCounts[sk].count++;
  }
  const topSongs = Object.values(songCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  const artistsHTML = topArtists.map(([name, count], i) =>
    `<div class="stc-row"><span class="stc-rank">${i+1}</span><span class="stc-name">${esc(name)}</span><span class="stc-ct">${count.toLocaleString()}</span></div>`
  ).join('');
  const songsHTML = topSongs.map((s, i) =>
    `<div class="stc-row"><span class="stc-rank">${i+1}</span><div class="stc-name-wrap"><span class="stc-name">${esc(s.title)}</span><span class="stc-sub">${esc(s.artist)}</span></div><span class="stc-ct">${s.count.toLocaleString()}</span></div>`
  ).join('');

  const totalPlays = plays.length;
  const daySet = new Set(plays.map(p => { const d = tzDate(p.date); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }));
  const artistSet = new Set(plays.map(p => p.artist.toLowerCase()));

  const layout = isStory ? 'flex-direction:column;' : 'flex-direction:column;';
  const cardH = isStory ? '640px' : '360px';
  const cardW = '360px';
  const topColDir = isStory ? 'column' : 'row';

  return `<div class="stc-root" style="width:${cardW};height:${cardH};background:linear-gradient(135deg,#0d1117 0%,#1a1f2e 50%,#0d1117 100%);padding:20px;box-sizing:border-box;display:flex;flex-direction:column;font-family:'DM Mono',monospace;color:#e2e8f0;position:relative;overflow:hidden;">
    <div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%);pointer-events:none;"></div>
    <div class="stc-header" style="margin-bottom:${isStory?'16px':'10px'};">
      <div style="font-size:0.6rem;letter-spacing:0.15em;color:#6366f1;text-transform:uppercase;margin-bottom:2px;">dankcharts.fm</div>
      <div style="font-size:${isStory?'1.4rem':'1.1rem'};font-weight:700;color:#f8fafc;line-height:1.1;">${t('nav_soundtrack')}</div>
      <div style="font-size:0.75rem;color:#94a3b8;">${label}</div>
    </div>
    <div class="stc-stats" style="display:flex;gap:12px;margin-bottom:${isStory?'14px':'10px'};">
      <div style="text-align:center;flex:1;background:rgba(99,102,241,0.12);border-radius:8px;padding:8px 4px;">
        <div style="font-size:1.1rem;font-weight:700;color:#818cf8;">${totalPlays.toLocaleString()}</div>
        <div style="font-size:0.5rem;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">${tUnit('plays', totalPlays)}</div>
      </div>
      <div style="text-align:center;flex:1;background:rgba(99,102,241,0.12);border-radius:8px;padding:8px 4px;">
        <div style="font-size:1.1rem;font-weight:700;color:#818cf8;">${daySet.size.toLocaleString()}</div>
        <div style="font-size:0.5rem;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">${t('st_stat_days')}</div>
      </div>
      <div style="text-align:center;flex:1;background:rgba(99,102,241,0.12);border-radius:8px;padding:8px 4px;">
        <div style="font-size:1.1rem;font-weight:700;color:#818cf8;">${artistSet.size.toLocaleString()}</div>
        <div style="font-size:0.5rem;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">${t('st_stat_artists')}</div>
      </div>
    </div>
    <div style="display:flex;gap:10px;flex:1;flex-direction:${topColDir};">
      <div style="flex:1;">
        <div style="font-size:0.55rem;letter-spacing:0.12em;color:#6366f1;text-transform:uppercase;margin-bottom:6px;">${t('st_top_artists')}</div>
        ${artistsHTML}
      </div>
      <div style="flex:1;${isStory?'margin-top:10px;':''}">
        <div style="font-size:0.55rem;letter-spacing:0.12em;color:#6366f1;text-transform:uppercase;margin-bottom:6px;">${t('st_top_songs')}</div>
        ${songsHTML}
      </div>
    </div>
    <div style="margin-top:auto;padding-top:8px;text-align:center;font-size:0.5rem;color:#475569;letter-spacing:0.1em;">dankcharts.fm · ${t('nav_soundtrack')}</div>
  </div>
  <style>
    .stc-row{display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:0.65rem;}
    .stc-rank{color:#6366f1;font-weight:700;min-width:12px;}
    .stc-name{color:#e2e8f0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .stc-sub{display:block;font-size:0.5rem;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .stc-name-wrap{flex:1;min-width:0;}
    .stc-ct{color:#818cf8;font-size:0.6rem;white-space:nowrap;}
  </style>`;
}

async function stDownloadCard() {
  const canvas = document.getElementById('stCardCanvas');
  if (!canvas || !_stCardMode) return;
  const isStory = _stCardMode === 'story';
  const w = isStory ? 720 : 720;
  const h = isStory ? 1280 : 720;
  try {
    const cvs = await html2canvas(canvas, { scale: 2, useCORS: false, allowTaint: true, backgroundColor: null, logging: false, width: 360, height: isStory ? 640 : 360 });
    const link = document.createElement('a');
    link.download = `your-soundtrack-${stGetPeriodLabel().replace(/\s+/g,'-').toLowerCase()}-${_stCardMode}.png`;
    link.href = cvs.toDataURL('image/png');
    link.click();
  } catch (e) { console.error('Card download failed', e); }
}

// ─── CURRENT STREAK BANNER ──────────────────────────────────
function computeCurrentStreak(plays) {
  if (!plays || plays.length < 3) return null;
  const p0 = plays[0];
  const sk0 = songKey(p0);

  // 1. Song Streak — same song 3+ consecutive (highest precedence)
  let songCount = 0;
  for (const p of plays) {
    if (songKey(p) === sk0) songCount++;
    else break;
  }
  if (songCount >= 3) return { type: 'song', count: songCount, title: p0.title, artist: p0.artist, album: p0.album };

  // 2. Album Streak — same album+artist 3+ consecutive
  if (p0.album && p0.album !== '—') {
    const aa0 = p0.album.toLowerCase().trim() + '\x00' + albumArtist(p0).toLowerCase().trim();
    let albumCount = 0;
    for (const p of plays) {
      if (p.album && p.album !== '—' &&
          p.album.toLowerCase().trim() + '\x00' + albumArtist(p).toLowerCase().trim() === aa0)
        albumCount++;
      else break;
    }
    if (albumCount >= 3) return { type: 'album', count: albumCount, album: p0.album, artist: albumArtist(p0) };
  }

  // 3. Artist Streak — same artist (respecting comma-split rule) 3+ consecutive plays
  const artists0 = splitArtists(p0.artist);
  let bestStreakArtist = null, bestStreakCount = 0;
  for (const a0 of artists0) {
    const a0lc = a0.toLowerCase().trim();
    let cnt = 0;
    for (const p of plays) {
      const pArtists = (p.artists || splitArtists(p.artist)).map(a => a.toLowerCase().trim());
      if (pArtists.includes(a0lc)) cnt++;
      else break;
    }
    if (cnt > bestStreakCount) { bestStreakCount = cnt; bestStreakArtist = a0; }
  }
  if (bestStreakCount >= 3) return { type: 'artist', count: bestStreakCount, artist: bestStreakArtist };

  // 4. Shuffle Streak — 5+ plays with no artist appearing 3+ times in a row
  let shuffleCount = 1;
  let runArtist = plays[0].artist.toLowerCase().trim();
  let runLen = 1;
  for (let i = 1; i < plays.length; i++) {
    const a = plays[i].artist.toLowerCase().trim();
    if (a === runArtist) {
      runLen++;
      if (runLen > 2) break;
    } else {
      runArtist = a;
      runLen = 1;
    }
    shuffleCount++;
  }
  if (shuffleCount >= 5) return { type: 'shuffle', count: shuffleCount };

  return null;
}

function renderStreakBanner() {
  const el = document.getElementById('streakBanner');
  if (!el) return;
  if (!allPlays.length) { el.style.display = 'none'; return; }

  const streak = computeCurrentStreak(allPlays);
  if (!streak) { el.style.display = 'none'; return; }

  const icons  = { song: '🔂', album: '💿', artist: '🎤', shuffle: '🔀' };
  const labels = { song: 'SONG STREAK', album: 'ALBUM STREAK', artist: 'ARTIST STREAK', shuffle: 'SHUFFLE STREAK' };

  let subject = '';
  if (streak.type === 'song')   subject = `<em>"${esc(streak.title)}"</em> · ${esc(streak.artist)}`;
  else if (streak.type === 'album')  subject = `<em>${esc(streak.album)}</em> · ${esc(streak.artist)}`;
  else if (streak.type === 'artist') subject = esc(streak.artist);

  const thumbCount = streak.count;

  let artFallback = '';
  if (streak.type === 'artist') artFallback = initials(streak.artist);
  else if (streak.type === 'album') artFallback = initials(streak.album);
  else if (streak.type === 'song') artFallback = initials(streak.album && streak.album !== '—' ? streak.album : streak.title);
  else artFallback = initials(allPlays[0].artist);

  const thumbs = Array.from({ length: thumbCount }, (_, i) => {
    const p = allPlays[i];
    return `<div class="streak-mini-thumb" style="--i:${i}" title="${esc(p.title)} · ${esc(p.artist)}"><div class="streak-mini-init">${esc(artFallback)}</div></div>`;
  }).join('');

  el.className = `streak-banner streak-banner-${streak.type}`;
  el.innerHTML = `
    <div class="streak-art-wrap">
      <img id="streakArtImg" class="streak-art" src="" alt="" style="display:none;"
           onerror="this.style.display='none';document.getElementById('streakArtInit').style.display='flex'">
      <div id="streakArtInit" class="streak-art-init">${esc(artFallback)}</div>
    </div>
    <div class="streak-banner-left">
      <span class="streak-banner-icon">${icons[streak.type]}</span>
      <div class="streak-banner-meta">
        <span class="streak-banner-type">${labels[streak.type]}</span>
        ${subject ? `<span class="streak-banner-subject">${subject}</span>` : ''}
      </div>
    </div>
    <div class="streak-banner-mid">${thumbs}</div>
    <div class="streak-banner-right">
      <span class="streak-fire-icon">🔥</span>
      <div class="streak-banner-count-col">
        <span class="streak-banner-num">${streak.count}</span>
        <span class="streak-banner-unit">in a row</span>
      </div>
    </div>
  `;
  el.style.display = '';

  _fetchStreakArt(streak).then(url => {
    const img = document.getElementById('streakArtImg');
    const init = document.getElementById('streakArtInit');
    if (img && init && url) {
      img.src = url;
      img.style.display = '';
      init.style.display = 'none';
    }
    // Fetch per-play art for each mini thumb individually
    el.querySelectorAll('.streak-mini-thumb').forEach((thumb, i) => {
      const p = allPlays[i];
      if (!p) return;
      _fetchPlayArt(p).then(thumbUrl => {
        const src = thumbUrl || url;
        if (!src) return;
        const tImg = document.createElement('img');
        tImg.className = 'streak-mini-img';
        tImg.src = src;
        tImg.alt = '';
        tImg.onerror = () => tImg.remove();
        thumb.innerHTML = '';
        thumb.appendChild(tImg);
      });
    });
  });
}

async function _fetchPlayArt(p) {
  try {
    const primaryArtist = albumArtist(p);
    if (p.album && p.album !== '—') {
      const prefKey = 'album:' + primaryArtist.toLowerCase() + '|||' + p.album.toLowerCase();
      const source = itemSourcePrefs[prefKey] || 'deezer';
      return await getAlbumImage(p.album, primaryArtist, source);
    }
    const prefKey = 'song:' + p.artist.toLowerCase() + '|||' + p.title.toLowerCase();
    const source = itemSourcePrefs[prefKey] || 'deezer';
    return await getTrackImage(p.title, primaryArtist, source);
  } catch (e) { return null; }
}

async function _fetchStreakArt(streak) {
  try {
    if (streak.type === 'song') {
      return (streak.album && streak.album !== '—')
        ? await getAlbumImage(streak.album, streak.artist)
        : await getTrackImage(streak.title, streak.artist);
    }
    if (streak.type === 'album')  return await getAlbumImage(streak.album, streak.artist);
    if (streak.type === 'artist') return await getArtistImage(streak.artist);
    // Shuffle: most recent play's album art
    const p = allPlays[0];
    return (p.album && p.album !== '—')
      ? await getAlbumImage(p.album, p.artist)
      : await getArtistImage(p.artist);
  } catch (e) { return null; }
}

