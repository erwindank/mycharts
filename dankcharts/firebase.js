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
  'dc_events_artist_limit', 'dc_theme', 'dc_lang',
  'dc_autocorrect_rules', 'dc_compilation_albums', 'dc_release_types',
  'dc_release_separation', 'dc_release_autodetect', 'dc_single_rollup',
  'dc_no_artist_split', 'dc_tm_api_key',
  'dc_tm_toggles',
  'dc_events_type_filter', 'dc_cal_view', 'dc_events_view_modes',
  'dc_sectionDisplayToggles', 'dc_subChartToggles',
  'dc_chartSizeWeekly', 'dc_chartSizeMonthly', 'dc_chartSizeYearly', 'dc_chartSizeAllTime',
  'dc_chartSizeSongsW', 'dc_chartSizeSongsM', 'dc_chartSizeSongsY', 'dc_chartSizeSongsAT',
  'dc_chartSizeArtistsW', 'dc_chartSizeArtistsM', 'dc_chartSizeArtistsY', 'dc_chartSizeArtistsAT',
  'dc_chartSizeAlbumsW', 'dc_chartSizeAlbumsM', 'dc_chartSizeAlbumsY', 'dc_chartSizeAlbumsAT',
  'dc_chart_anim', 'dc_awards_credit_features'
];

let _auth = null;
let _db   = null;
let _currentUser = null;

/* Firestore, with on-disk offline persistence.
   Every write in this file is fire-and-forget from the UI's point of view, and
   Android Chrome freezes or outright discards a backgrounded tab whenever it
   feels like it. Without a durable queue, a write that had not yet reached the
   network when the user switched apps simply vanished — which is how nominees
   picked on a phone could come back missing. With persistence the write lands
   in IndexedDB the moment it is issued and replays on the next load.

   enablePersistence() has to run before any other call on the instance, so every
   path goes through here and awaits it. Its rejections are expected and
   non-fatal: 'failed-precondition' means another tab already holds the lease and
   'unimplemented' means no IndexedDB at all (private browsing). Either way
   Firestore carries on in memory, exactly as it behaved before.                */
let _dbReady = null;
function _ensureDb() {
  if (_db) return Promise.resolve(_db);
  if (!_dbReady) {
    _dbReady = (async () => {
      const db = firebase.firestore();
      try {
        await db.enablePersistence({ synchronizeTabs: true });
      } catch (err) {
        console.warn('[dankcharts] Offline persistence unavailable:', err && err.code);
      }
      _db = db;
      return db;
    })();
  }
  return _dbReady;
}

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
        // Don't let an empty Firestore list overwrite a locally-stored one.
        // The auth callback's dcSaveUserConfig will push the local value up.
        // Both of these are user-authored lists that are expensive to lose.
        if ((key === 'dc_autocorrect_rules' || key === 'dc_compilation_albums') && data[key] === '[]') {
          const local = localStorage.getItem(key);
          if (local && local !== '[]') { applied = true; continue; }
        }
        // Same guard for the release-type map, whose empty form is an object.
        // It is hand-built (and later machine-detected) over a whole library,
        // so an empty remote value must never flatten a populated local one.
        if (key === 'dc_release_types' && data[key] === '{}') {
          const local = localStorage.getItem(key);
          if (local && local !== '{}' && local !== '') { applied = true; continue; }
        }
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
  await _ensureDb();
  const cfg = {};
  for (const key of SYNC_KEYS) {
    const v = localStorage.getItem(key);
    // A cleared key must be explicitly deleted, not omitted — with merge:true, an
    // omitted key just leaves whatever value Firestore already has untouched, so a
    // setting the user reset locally would otherwise persist remotely forever.
    cfg[key] = v !== null ? v : firebase.firestore.FieldValue.delete();
  }
  try {
    await _configRef(_currentUser.uid).set(cfg, { merge: true });
  } catch (err) {
    console.warn('[dankcharts] Firebase save error:', err);
  }
}

async function dcSaveRulesToFirestore(rulesJson) {
  if (!_currentUser) return;
  try {
    await _configRef(_currentUser.uid).set({ dc_autocorrect_rules: rulesJson }, { merge: true });
  } catch (err) {
    console.warn('[dankcharts] Firebase rules save error:', err);
  }
}

// Targeted save, for the same reason dcSaveRulesToFirestore is one: writing the
// in-memory list directly can't be raced by the auth callback into pushing a
// stale localStorage value back up.
async function dcSaveCompilationsToFirestore(listJson) {
  if (!_currentUser) return;
  try {
    await _configRef(_currentUser.uid).set({ dc_compilation_albums: listJson }, { merge: true });
  } catch (err) {
    console.warn('[dankcharts] Firebase compilations save error:', err);
  }
}

// Targeted for the same reason as the two above: the release-type map is
// written on a single click and must not be round-tripped through localStorage
// by a racing dcSaveUserConfig().
async function dcSaveReleaseTypesToFirestore(mapJson) {
  if (!_currentUser) return;
  try {
    await _configRef(_currentUser.uid).set({ dc_release_types: mapJson }, { merge: true });
  } catch (err) {
    console.warn('[dankcharts] Firebase release types save error:', err);
  }
}

// Targeted save of one synced setting, for one-click switches (the My Grammys
// "Count featured artists" switch) — same reasoning as the targeted saves above.
async function dcSaveConfigKey(key, value) {
  if (!_currentUser || !SYNC_KEYS.includes(key)) return;
  await _ensureDb();
  try {
    await _configRef(_currentUser.uid).set({ [key]: value }, { merge: true });
  } catch (err) {
    console.warn('[dankcharts] Firebase setting save error:', err);
  }
}

function _eventsCacheRef(uid) {
  return _db.collection('users').doc(uid).collection('data').doc('eventsCache');
}

function _awardsRef(uid, year) {
  return _db.collection('users').doc(uid).collection('data').doc(`awards_${year}`);
}

function _ratingsRef(uid) {
  return _db.collection('users').doc(uid).collection('data').doc('ratings');
}

// Ratings are user-authored critical evaluations (per-song criterion scores,
// per-album criterion scores, and the rubric config). They live in their own
// document rather than in the config blob for the same reason awards and
// playlists do: the config doc is written wholesale by dcSaveUserConfig(), so a
// stale localStorage value could race the in-memory list back over the top of a
// fresh edit. Writing the payload directly can't be raced that way.
async function dcSaveRatings(payload) {
  if (!_currentUser) return;
  await _ensureDb();
  try {
    await _ratingsRef(_currentUser.uid).set(payload);
  } catch (err) {
    console.warn('[dankcharts] Ratings save error:', err);
  }
}

async function dcLoadRatings() {
  if (!_currentUser) return null;
  await _ensureDb();
  try {
    const snap = await _ratingsRef(_currentUser.uid).get();
    return snap.exists ? snap.data() : null;
  } catch (err) {
    console.warn('[dankcharts] Ratings load error:', err);
    return null;
  }
}

function _playlistsRef(uid) {
  return _db.collection('users').doc(uid).collection('data').doc('playlists');
}

async function dcSavePlaylistsToFirestore(playlistsJson, modifiedJson, deletedJson) {
  if (!_currentUser) return;
  await _ensureDb();
  try {
    await _playlistsRef(_currentUser.uid).set({ data: playlistsJson, modified: modifiedJson || '{}', deleted: deletedJson || '{}' });
  } catch (err) {
    console.warn('[dankcharts] Playlists save error:', err);
  }
}

async function dcLoadPlaylistsFromFirestore() {
  if (!_currentUser) return null;
  await _ensureDb();
  try {
    const snap = await _playlistsRef(_currentUser.uid).get();
    if (!snap.exists) return null;
    const d = snap.data();
    return { data: d.data, modified: d.modified, deleted: d.deleted };
  } catch (err) {
    console.warn('[dankcharts] Playlists load error:', err);
    return null;
  }
}

// Whether there is a signed-in account at all. Callers use it to tell a failed
// write apart from the ordinary signed-out case, where local-only is the point.
function dcIsSignedIn() { return !!_currentUser; }

// Returns whether the write was accepted, so the Awards tab can tell the user
// when their ballot only exists on this device. With persistence on, an offline
// write resolves straight away and replays later — this only reports a real
// rejection (no auth, rules, quota), not a missing network.
async function dcSaveAwards(year, data) {
  if (!_currentUser) return false;
  await _ensureDb();
  try {
    await _awardsRef(_currentUser.uid, year).set(data);
    return true;
  } catch (err) {
    console.warn('[dankcharts] Awards save error:', err);
    return false;
  }
}

async function dcLoadAwards(year) {
  if (!_currentUser) return null;
  await _ensureDb();
  try {
    const snap = await _awardsRef(_currentUser.uid, year).get();
    return snap.exists ? snap.data() : null;
  } catch (err) {
    console.warn('[dankcharts] Awards load error:', err);
    return null;
  }
}

/* Conflict-checked awards save.
   dcSaveAwards() overwrites the whole year blindly, which is how a phone left
   open with an older ballot wiped nominees picked since on another phone: its
   next click wrote the stale copy over the top. This version reads the cloud
   copy inside a transaction and only writes if nobody has saved since the
   version this device started from (baseSavedAt). Otherwise it hands the newer
   cloud copy back so app.js can merge the two instead of clobbering.

   Returns { status }:
     'ok'         written; `replaced` is the cloud copy it replaced (or null)
     'conflict'   not written; `remote` is the newer cloud copy
     'queued'     offline — written through the persistent queue, unchecked
     'signed-out' nothing to do
     'error'      rejected (rules, quota…)                                   */
async function dcSaveAwardsChecked(year, data, baseSavedAt) {
  if (!_currentUser) return { status: 'signed-out' };
  await _ensureDb();
  const ref = _awardsRef(_currentUser.uid, year);
  try {
    return await _db.runTransaction(async tx => {
      const snap = await tx.get(ref);
      const remote = snap.exists ? snap.data() : null;
      if (remote && (remote.savedAt || 0) > (baseSavedAt || 0)) return { status: 'conflict', remote };
      tx.set(ref, data);
      return { status: 'ok', replaced: remote };
    });
  } catch (err) {
    // Transactions need the network. Offline, fall back to a plain write through
    // the persistent queue so the change still goes up when the phone reconnects.
    // Not awaited: an offline set() only resolves once the server acknowledges it.
    if (err && ['unavailable', 'deadline-exceeded', 'failed-precondition', 'aborted'].includes(err.code)) {
      ref.set(data).catch(e => console.warn('[dankcharts] Awards queued save error:', e));
      return { status: 'queued' };
    }
    console.warn('[dankcharts] Awards checked save error:', err);
    return { status: 'error' };
  }
}

// Every awards year in the cloud, as { year: data }. Used by backups, which need
// all years, not just the ones this session happened to open.
async function dcLoadAllAwards() {
  if (!_currentUser) return {};
  await _ensureDb();
  const out = {};
  try {
    const docId = firebase.firestore.FieldPath.documentId();
    const snap = await _db.collection('users').doc(_currentUser.uid).collection('data')
      .where(docId, '>=', 'awards_').where(docId, '<', 'awards_').get();
    snap.forEach(d => { out[d.id.slice(7)] = d.data(); });
  } catch (err) {
    console.warn('[dankcharts] Awards list error:', err);
  }
  return out;
}

/* ── Backups ────────────────────────────────────────────────────────────────
   Snapshots of the user's own work (settings, awards, ratings) kept in the
   account so a bad overwrite can be undone from Settings → Profile. They live
   under users/{uid}/data/ like everything else, so the existing rule already
   covers them — no Firebase Console change needed.

   Two kinds of document:
     data/backups        the index: a small list of { id, createdAt, reason,
                         kind, device, summary } read to draw the list
     data/backup_<id>    one snapshot; `payload` is a JSON string so odd keys
                         (dots, slashes in song names) can't trip Firestore
   The index keeps the list cheap to open — no need to download every snapshot
   just to show their dates.                                                  */
const BACKUP_KEEP_PER_KIND = 30;   // 30 full backups + 30 single-year awards snapshots

function _backupIndexRef(uid) {
  return _db.collection('users').doc(uid).collection('data').doc('backups');
}
function _backupRef(uid, id) {
  return _db.collection('users').doc(uid).collection('data').doc('backup_' + id);
}

// meta: { createdAt, reason, kind: 'full' | 'awards', device, summary }
// Returns the new id, or null (signed out, offline, or too big for one doc).
async function dcBackupWrite(meta, payloadJson) {
  if (!_currentUser) return null;
  await _ensureDb();
  // Firestore's per-document ceiling is 1 MiB; leave room for the meta fields.
  if (new Blob([payloadJson]).size > 1000000) {
    console.warn('[dankcharts] Backup too large for one document — skipped');
    return null;
  }
  const uid = _currentUser.uid;
  const id  = meta.createdAt + '_' + Math.random().toString(36).slice(2, 6);
  try {
    await _backupRef(uid, id).set({ ...meta, payload: payloadJson });
    // Add to the index and prune in one transaction, so two devices backing
    // up at the same moment can't each drop the other's entry.
    let dropped = [];
    await _db.runTransaction(async tx => {
      const snap = await tx.get(_backupIndexRef(uid));
      const list = (snap.exists && Array.isArray(snap.data().list)) ? snap.data().list : [];
      list.push({ id, ...meta });
      list.sort((a, b) => b.createdAt - a.createdAt);
      const kept = [], seen = {};
      dropped = [];
      for (const e of list) {
        const k = e.kind || 'full';
        seen[k] = (seen[k] || 0) + 1;
        (seen[k] <= BACKUP_KEEP_PER_KIND ? kept : dropped).push(e);
      }
      tx.set(_backupIndexRef(uid), { list: kept });
    });
    for (const d of dropped) _backupRef(uid, d.id).delete().catch(() => {});
    return id;
  } catch (err) {
    console.warn('[dankcharts] Backup write error:', err);
    return null;
  }
}

async function dcBackupList() {
  if (!_currentUser) return [];
  await _ensureDb();
  try {
    const snap = await _backupIndexRef(_currentUser.uid).get();
    return (snap.exists && Array.isArray(snap.data().list)) ? snap.data().list : [];
  } catch (err) {
    console.warn('[dankcharts] Backup list error:', err);
    return [];
  }
}

// The snapshot's parsed payload, or null.
async function dcBackupRead(id) {
  if (!_currentUser) return null;
  await _ensureDb();
  try {
    const snap = await _backupRef(_currentUser.uid, id).get();
    return snap.exists ? JSON.parse(snap.data().payload) : null;
  } catch (err) {
    console.warn('[dankcharts] Backup read error:', err);
    return null;
  }
}

/* ── Shared ceremonies ──────────────────────────────────────────────────────
   A shared ceremony is a frozen copy of one year's awards, written to a public
   collection so a friend can watch it from a link without an account or any
   music data of their own. It lives outside users/{uid} on purpose: that path
   is private by rule, and loosening it would expose the rest of the account.
   See firestore.rules for who may read and write these.                      */
function _sharedCeremonyRef(id) {
  return _db.collection('sharedCeremonies').doc(id);
}

// Short, unguessable link ids. Firestore's own auto-ids are 20 characters; ten
// from a 62-letter alphabet is still far beyond guessing and reads better in a URL.
function _newShareId() {
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, b => abc[b % abc.length]).join('');
}

// Writes the snapshot and returns its id. Passing an existing id refreshes that
// same link, so a link already sent to friends keeps working after an update.
async function dcShareCeremony(id, payload) {
  if (!_currentUser) return null;
  await _ensureDb();
  const shareId = id || _newShareId();
  try {
    await _sharedCeremonyRef(shareId).set({ ...payload, owner: _currentUser.uid, updatedAt: Date.now() });
    return shareId;
  } catch (err) {
    console.warn('[dankcharts] Ceremony share error:', err);
    return null;
  }
}

// Public read — works signed out. Returns null for a link that never existed
// or was taken down.
async function dcLoadSharedCeremony(id) {
  await _ensureDb();
  try {
    const snap = await _sharedCeremonyRef(id).get();
    return snap.exists ? snap.data() : null;
  } catch (err) {
    console.warn('[dankcharts] Shared ceremony load error:', err);
    return null;
  }
}

async function dcUnshareCeremony(id) {
  if (!_currentUser || !id) return false;
  await _ensureDb();
  try {
    await _sharedCeremonyRef(id).delete();
    return true;
  } catch (err) {
    console.warn('[dankcharts] Ceremony unshare error:', err);
    return false;
  }
}

async function dcSaveEventsCache(data) {
  if (!_currentUser) return;
  await _ensureDb();
  try {
    await _eventsCacheRef(_currentUser.uid).set(data);
  } catch (err) {
    console.warn('[dankcharts] Events cache save error:', err);
  }
}

async function dcLoadEventsCache() {
  if (!_currentUser) return null;
  await _ensureDb();
  try {
    const snap = await _eventsCacheRef(_currentUser.uid).get();
    return snap.exists ? snap.data() : null;
  } catch (err) {
    console.warn('[dankcharts] Events cache load error:', err);
    return null;
  }
}

async function dcSignIn() {
  if (!_auth) return;
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await _auth.signInWithPopup(provider);
    if (result.additionalUserInfo && result.additionalUserInfo.isNewUser) {
      _sendWelcomeEmail(result.user);
    }
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      console.error('[dankcharts] Sign-in error:', err);
    }
  }
}

async function _sendWelcomeEmail(user) {
  try {
    await fetch('https://dankcharts-api.onrender.com/send-welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, displayName: user.displayName }),
    });
  } catch (_) {}
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
window.dcSignIn                    = dcSignIn;
window.dcSignOut                   = dcSignOut;
window.dcSaveUserConfig            = dcSaveUserConfig;
window.dcSaveRulesToFirestore      = dcSaveRulesToFirestore;
window.dcSaveCompilationsToFirestore = dcSaveCompilationsToFirestore;
window.dcSaveReleaseTypesToFirestore = dcSaveReleaseTypesToFirestore;
window.dcSaveEventsCache           = dcSaveEventsCache;
window.dcLoadEventsCache           = dcLoadEventsCache;
window.dcIsSignedIn                = dcIsSignedIn;
window.dcSaveAwards                = dcSaveAwards;
window.dcLoadAwards                = dcLoadAwards;
window.dcSaveAwardsChecked         = dcSaveAwardsChecked;
window.dcLoadAllAwards             = dcLoadAllAwards;
window.dcBackupWrite               = dcBackupWrite;
window.dcBackupList                = dcBackupList;
window.dcBackupRead                = dcBackupRead;
window.dcShareCeremony             = dcShareCeremony;
window.dcLoadSharedCeremony        = dcLoadSharedCeremony;
window.dcUnshareCeremony           = dcUnshareCeremony;
window.dcSaveRatings               = dcSaveRatings;
window.dcLoadRatings               = dcLoadRatings;
window.dcSavePlaylistsToFirestore  = dcSavePlaylistsToFirestore;
window.dcLoadPlaylistsFromFirestore = dcLoadPlaylistsFromFirestore;

// ── INIT ────────────────────────────────────────────────────────────────────
firebase.initializeApp(firebaseConfig);
_auth = firebase.auth();

_auth.onAuthStateChanged(async (user) => {
  _currentUser = user;
  _refreshAuthUI(user);

  if (!user) return;

  await _ensureDb();

  const applied = await _loadAndApplyConfig(user.uid);
  if (applied && typeof dcResetRulesCache === 'function') dcResetRulesCache();
  if (applied && typeof dcResetCompilationsCache === 'function') dcResetCompilationsCache();
  if (applied && typeof dcResetReleaseTypesCache === 'function') dcResetReleaseTypesCache();
  if (applied && typeof dcApplyDisplayToggles === 'function') dcApplyDisplayToggles();
  if (applied && typeof dcApplyAllSettings    === 'function') dcApplyAllSettings();

  // Sync playlists from Firestore and merge with any locally-saved playlists
  const remotePlaylistData = await dcLoadPlaylistsFromFirestore();
  if (remotePlaylistData && typeof _ytMergePlaylists === 'function') _ytMergePlaylists(remotePlaylistData);

  // Merge cloud ratings with anything rated locally while signed out. dcMergeRatings
  // resolves per-entry by last-edited timestamp, so neither side clobbers the other.
  const remoteRatings = await dcLoadRatings();
  if (typeof dcMergeRatings === 'function') dcMergeRatings(remoteRatings);

  const hasLocalConfig = SYNC_KEYS.some(k => localStorage.getItem(k) !== null);
  if (!hasLocalConfig && !applied) return; // truly fresh user with no data anywhere

  // Always push local config to Firestore — handles both first-time migration
  // and new SYNC_KEYS (like dc_autocorrect_rules) not yet in the Firestore document.
  await dcSaveUserConfig();

  // Awards opened before sign-in finished were loaded from this device's copy
  // only — catch them up with the cloud now, then take the daily backup if due.
  // Not awaited: neither should hold up the first chart render.
  if (!window.dcCeremonyViewer && typeof dcAfterSignInSync === 'function') dcAfterSignInSync();

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
      // Signing in can complete setup directly from the landing screen, which
      // skips both startFromLanding() and skipLanding(). Without this call a
      // Google user restoring their config on a new device would go straight
      // to a Weekly chart and never be shown the Charts Guide.
      if (typeof dcMaybeShowWelcomeGate === 'function') dcMaybeShowWelcomeGate();
      if (typeof syncNow === 'function') syncNow();
    }
  } else if (!window.dcCeremonyViewer) {
    // A shared-ceremony link never boots the viewer's own charts behind the
    // overlay — they only asked to watch someone else's ceremony.
    if (typeof syncNow === 'function') syncNow();
  }
});
