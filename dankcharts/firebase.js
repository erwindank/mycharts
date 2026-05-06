// ── FIREBASE CONFIGURATION ─────────────────────────────────────────────────
// After creating your Firebase project, paste your config here.
// Firebase Console → Project Settings → Your apps → Web app → SDK setup & config
const firebaseConfig = {
  apiKey: "AIzaSyAftPCYx8Ja3z8n-gYAM5iDhJI_NfHwgTY",
  authDomain: "dankcharts.firebaseapp.com",
  projectId: "dankcharts",
  storageBucket: "dankcharts.firebasestorage.app",
  messagingSenderId: "1011392630181",
  appId: "1:1011392630181:web:160d3c8d4125eeec71ac4c",
  measurementId: "G-G5LQYKKD5G"
};

// localStorage keys that sync across devices (settings only — not cached data or timestamps)
const SYNC_KEYS = [
  'dc_source', 'dc_sheet_id', 'dc_sheet_gid', 'dc_sheet_tab',
  'dc_sheet_write_url', 'dc_lastfm_user', 'dc_lfm_api_key',
  'dc_lfm_api_secret', 'dc_lfm_session_key', 'dc_lfm_session_user',
  'dc_display_name', 'dc_timezone', 'dc_cert_config',
  'dc_events_artist_limit', 'dc_theme', 'dc_lang'
];

let _auth = null;
let _db   = null;
let _currentUser = null;

function _configRef(uid) {
  return _db.collection('users').doc(uid).collection('data').doc('config');
}

async function _loadAndApplyConfig(uid) {
  try {
    const snap = await _configRef(uid).get();
    if (!snap.exists) return false;
    const data = snap.data();
    let applied = false;
    for (const key of SYNC_KEYS) {
      if (data[key] != null) {
        localStorage.setItem(key, String(data[key]));
        applied = true;
      }
    }
    return applied;
  } catch (err) {
    console.warn('[dankcharts] Firebase load error:', err);
    return false;
  }
}

async function dcSaveUserConfig() {
  if (!_currentUser) return;
  const cfg = {};
  for (const key of SYNC_KEYS) {
    const v = localStorage.getItem(key);
    if (v !== null) cfg[key] = v;
  }
  try {
    await _configRef(_currentUser.uid).set(cfg, { merge: true });
  } catch (err) {
    console.warn('[dankcharts] Firebase save error:', err);
  }
}

async function dcSignIn() {
  if (!_auth) return;
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await _auth.signInWithPopup(provider);
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      console.error('[dankcharts] Sign-in error:', err);
    }
  }
}

async function dcSignOut() {
  if (!_auth) return;
  await _auth.signOut();
}

function _refreshAuthUI(user) {
  document.querySelectorAll('.dc-signin-btn').forEach(el => {
    el.style.display = user ? 'none' : '';
  });
  document.querySelectorAll('.dc-user-badge').forEach(el => {
    el.style.display = user ? '' : 'none';
  });
  if (user) {
    document.querySelectorAll('.dc-user-avatar').forEach(el => {
      el.src = user.photoURL || '';
      el.style.display = user.photoURL ? '' : 'none';
    });
    document.querySelectorAll('.dc-user-name').forEach(el => {
      el.textContent = user.displayName || user.email || '';
    });
  }
}

// Expose globally for HTML onclick handlers and app.js
window.dcSignIn         = dcSignIn;
window.dcSignOut        = dcSignOut;
window.dcSaveUserConfig = dcSaveUserConfig;

// ── INIT ────────────────────────────────────────────────────────────────────
firebase.initializeApp(firebaseConfig);
_auth = firebase.auth();
_db   = firebase.firestore();

_auth.onAuthStateChanged(async (user) => {
  _currentUser = user;
  _refreshAuthUI(user);

  if (!user) return;

  const applied = await _loadAndApplyConfig(user.uid);
  if (!applied) {
    // No Firestore data — if localStorage already has config (set up before Firebase
    // was added), migrate it up to Firestore so it syncs going forward.
    const hasLocalConfig = SYNC_KEYS.some(k => localStorage.getItem(k) !== null);
    if (!hasLocalConfig) return; // truly fresh user, nothing to do
    await dcSaveUserConfig();
  }

  // Refresh any UI that depends on the just-loaded settings
  if (typeof updateMastheadDynamic === 'function') updateMastheadDynamic();
  if (typeof updateLfmAuthStatus   === 'function') updateLfmAuthStatus();
  if (typeof updateScrobbleBtn     === 'function') updateScrobbleBtn();

  // If the landing screen is visible and config is now complete, go to main app.
  // Otherwise, re-sync in place so any "no config" banner from page-load clears.
  const landing = document.getElementById('landingScreen');
  const mainApp = document.getElementById('mainApp');
  if (landing && landing.style.display !== 'none') {
    if (typeof needsOnboarding === 'function' && !needsOnboarding()) {
      landing.style.display = 'none';
      if (mainApp) mainApp.style.display = 'block';
      if (typeof syncNow === 'function') syncNow();
    }
  } else {
    if (typeof syncNow === 'function') syncNow();
  }
});
