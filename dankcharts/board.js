/* ===========================================================================
   COMMUNITY BOARD - SUGGESTIONS, BUG REPORTS AND DISCUSSION
   ===========================================================================
   The "Board" tab in the second nav row. Everyone can read it, with or without
   an account; posting, replying and voting need Google sign-in.

   Storage is Firestore (the same project firebase.js talks to):
     boardPosts/{postId}                 one post: title, body, category,
                                         status, pinned, votes (uids), counts
     boardPosts/{postId}/replies/{id}    replies to that post, oldest first
     boardImages/{imageId}               one picture (a small WebP/JPEG data
                                         URL) added to a post or reply; the
                                         post/reply keeps [{id, w, h}] in its
                                         `images` field. Kept apart so the
                                         post list never downloads pictures.
     boardAdmins/{uid}                   an empty doc per moderator; only its
                                         own uid can read it, nobody can write
                                         it from the site (add it in the
                                         Firebase Console)
   The rules in firestore.rules are what actually enforce who may do what -
   the buttons here only hide what the rules would refuse anyway. Those rules
   are not deployed by git: paste firestore.rules into Firebase Console →
   Firestore → Rules after changing it.

   Votes are an array of uids on the post plus a voteCount mirror (Firestore
   can't sort by an array's length). Toggling uses arrayUnion/arrayRemove with
   increment(±1) in one update, and the rules check the two stay in step.

   firebase.js keeps _currentUser and _ensureDb() as top-level script globals,
   which this file reads directly (same trick support.js uses).
   =========================================================================== */

(function () {
  // ── Constants ──────────────────────────────────────────────────────────────
  // Order here is the order the filter chips and the composer's picker use.
  var CATEGORIES = ['suggestion', 'bug', 'question', 'discussion'];
  var STATUSES   = ['open', 'planned', 'progress', 'done', 'declined'];
  // Kept in step with the size checks in firestore.rules.
  var MAX_TITLE = 120, MIN_TITLE = 3, MAX_BODY = 5000, MAX_REPLY = 3000;
  // The whole board is read in one go and filtered/sorted in the browser, so
  // there is no index to set up in the console. Plenty for a fan board.
  var POST_LIMIT = 300;
  // Pictures: up to 4 per post or reply, shrunk in the browser to fit one
  // Firestore document each (the rules cap data at 750,000 characters).
  var MAX_IMAGES = 4, IMG_MAX_SIDE = 1600, IMG_MAX_CHARS = 700000;
  // The emoji picker's grid. Typed emoji always worked (they're just text);
  // the picker makes them easy on a computer keyboard.
  var EMOJI = ('😀 😂 🤣 😊 😍 🥰 😎 🤩 🥳 😅 😉 🙂 🤔 🙃 😴 😮 😢 😭 😡 🤯 ' +
    '👍 👎 👏 🙌 🙏 💪 👀 🤝 ✌️ 🤘 👋 🫶 ❤️ 🧡 💛 💚 💙 💜 🖤 💔 ' +
    '🔥 ✨ ⭐ 🌟 💯 🎉 🏆 🥇 👑 💎 ✅ ❌ ⚠️ ❓ 💡 🐛 🚀 📈 📉 🕒 ' +
    '🎵 🎶 🎤 🎧 🎸 🎹 🥁 🎺 💿 📻 🎼 🪩').split(' ');
  var PREFS_KEY = 'dc_board_prefs';

  // ── State ──────────────────────────────────────────────────────────────────
  var S = {
    posts: [],          // newest first, straight from the snapshot
    loaded: false,
    error: null,
    cat: 'all',         // category filter
    status: 'all',      // status filter
    sort: 'top',        // 'top' | 'new' | 'active'
    query: '',          // search box
    openId: null,       // the expanded post, if any
    replies: {},        // postId -> [reply]
    composing: false,   // new-post form open
    editingId: null,    // post being edited in place
    isAdmin: false,
    busy: {}            // in-flight keys so a double click can't double-write
  };
  var _unsubPosts = null, _unsubReplies = null, _repliesFor = null;
  // True once the Charts Guide's picture tool has put made-up posts in
  // (dcBoard._sample): the live lists then stay unsubscribed until a reload.
  var _sampleOn = false;
  var _active = false;  // board tab on screen
  // Pictures waiting in a form, per form: 'bdNew', 'bdEdit', 'bdReply'.
  // Each is {id, w, h} (already saved, when editing) or {data, w, h} (new).
  var _pending = { bdNew: [], bdEdit: [], bdReply: [] };
  // imageId -> data URL, so a redraw never fetches a picture twice.
  var _imgCache = {};

  try {
    var p = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
    if (CATEGORIES.indexOf(p.cat) >= 0) S.cat = p.cat;
    if (STATUSES.indexOf(p.status) >= 0) S.status = p.status;
    if (['top', 'new', 'active'].indexOf(p.sort) >= 0) S.sort = p.sort;
  } catch (e) {}
  function savePrefs() {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify({ cat: S.cat, status: S.status, sort: S.sort })); } catch (e) {}
  }

  // ── Small helpers ──────────────────────────────────────────────────────────
  function tr(key, vars) {
    try { if (typeof t === 'function') return t(key, vars); } catch (e) {}
    return key;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function user() {
    try { if (typeof _currentUser !== 'undefined' && _currentUser) return _currentUser; } catch (e) {}
    return null;
  }
  function db() { return _ensureDb(); }
  function FV() { return firebase.firestore.FieldValue; }
  function postRef(d, id) { return d.collection('boardPosts').doc(id); }

  // The name shown on a post: the display name from Settings if one is set,
  // else the Google account name. Never the email address.
  function authorName() {
    var n = '';
    try { n = (localStorage.getItem('dc_display_name') || '').trim(); } catch (e) {}
    var u = user();
    if (!n && u) n = (u.displayName || '').trim();
    return (n || tr('board_anon')).slice(0, 60);
  }

  function toMs(ts) {
    if (!ts) return Date.now();               // pending server timestamp
    if (typeof ts.toMillis === 'function') return ts.toMillis();
    if (typeof ts === 'number') return ts;
    return Date.now();
  }

  // "3 days ago" in the site's language.
  function ago(ms) {
    var diff = (ms - Date.now()) / 1000;
    var lang = (typeof currentLang !== 'undefined' && currentLang) || 'en';
    var rtf;
    try { rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }); } catch (e) { return new Date(ms).toLocaleDateString(); }
    var steps = [[60, 'second'], [3600, 'minute', 60], [86400, 'hour', 3600], [604800, 'day', 86400],
                 [2629800, 'week', 604800], [31557600, 'month', 2629800], [Infinity, 'year', 31557600]];
    var a = Math.abs(diff);
    if (a < 45) return tr('board_just_now');
    for (var i = 1; i < steps.length; i++) {
      if (a < steps[i][0]) return rtf.format(Math.round(diff / steps[i][2]), steps[i][1]);
    }
    return '';
  }

  // Body text: escaped, line breaks kept, bare http(s) links made clickable.
  // ugc + nofollow because these are links strangers typed.
  function richText(s) {
    return esc(s)
      .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"])/g, '<a href="$1" target="_blank" rel="nofollow noopener ugc">$1</a>')
      .replace(/\n/g, '<br>');
  }

  function avatar(photo, name) {
    var initial = esc((name || '?').trim().charAt(0).toUpperCase() || '?');
    // Photo sits over the initial; if it fails to load it hides itself.
    return '<span class="bd-avatar" aria-hidden="true">' + initial +
      (photo ? '<img src="' + esc(photo) + '" alt="" referrerpolicy="no-referrer" loading="lazy" onerror="this.remove()">' : '') +
      '</span>';
  }

  function catLabel(c) { return tr('board_cat_' + c); }
  function statusLabel(s) { return tr('board_status_' + s); }

  // ── Live data ──────────────────────────────────────────────────────────────
  function subscribePosts() {
    if (_unsubPosts || _sampleOn) return;
    db().then(function (d) {
      if (!_active || _unsubPosts) return;
      _unsubPosts = d.collection('boardPosts').orderBy('createdAt', 'desc').limit(POST_LIMIT)
        .onSnapshot(function (snap) {
          S.posts = snap.docs.map(function (doc) {
            var x = doc.data({ serverTimestamps: 'estimate' });
            x.id = doc.id;
            x.votes = Array.isArray(x.votes) ? x.votes : [];
            return x;
          });
          S.loaded = true; S.error = null;
          // A post that vanished (deleted by its author or a moderator) closes.
          if (S.openId && !S.posts.some(function (q) { return q.id === S.openId; })) closePost();
          render();
        }, function (err) {
          console.warn('[dankcharts] Board load error:', err);
          S.loaded = true; S.error = err && err.code;
          render();
        });
    });
  }

  function subscribeReplies(id) {
    if (_sampleOn) return;
    if (_repliesFor === id && _unsubReplies) return;
    unsubscribeReplies();
    _repliesFor = id;
    db().then(function (d) {
      if (_repliesFor !== id) return;
      _unsubReplies = postRef(d, id).collection('replies').orderBy('createdAt', 'asc')
        .onSnapshot(function (snap) {
          S.replies[id] = snap.docs.map(function (doc) {
            var x = doc.data({ serverTimestamps: 'estimate' });
            x.id = doc.id;
            return x;
          });
          render();
        }, function (err) { console.warn('[dankcharts] Board replies error:', err); });
    });
  }
  function unsubscribeReplies() {
    if (_unsubReplies) { _unsubReplies(); _unsubReplies = null; }
    _repliesFor = null;
  }

  // Moderator check. The rules let a user read only their own boardAdmins doc.
  function refreshAdmin() {
    var u = user();
    if (!u) { S.isAdmin = false; return Promise.resolve(); }
    return db().then(function (d) {
      return d.collection('boardAdmins').doc(u.uid).get();
    }).then(function (snap) {
      S.isAdmin = !!(snap && snap.exists);
    }).catch(function () { S.isAdmin = false; });
  }

  // ── Writes ─────────────────────────────────────────────────────────────────
  function guard(key, fn) {
    if (S.busy[key]) return;
    S.busy[key] = true;
    return Promise.resolve().then(fn).catch(function (err) {
      console.warn('[dankcharts] Board write error:', err);
      toast(tr('board_err_save'));
    }).then(function () { delete S.busy[key]; render(); });
  }

  // Adds a set() to batch `b` for each new picture in `list` and returns the
  // [{id, w, h}] list the post or reply stores (kept pictures pass through).
  function imageWrites(d, b, list, uid) {
    return (list || []).map(function (im) {
      if (im.id) return { id: im.id, w: im.w, h: im.h };
      var ref = d.collection('boardImages').doc();
      b.set(ref, { data: im.data, w: im.w, h: im.h, authorUid: uid, createdAt: FV().serverTimestamp() });
      _imgCache[ref.id] = im.data;
      return { id: ref.id, w: im.w, h: im.h };
    });
  }
  // Removes pictures that are no longer used. Best effort: the rules only let
  // the picture's owner or a moderator remove it, and a leftover picture
  // nobody points at does no harm.
  function dropImages(d, list) {
    (list || []).forEach(function (im) {
      if (im && im.id) d.collection('boardImages').doc(im.id).delete().catch(function () {});
    });
  }

  function createPost(cat, title, body) {
    var u = user(); if (!u) return;
    return guard('create', function () {
      return db().then(function (d) {
        var now = FV().serverTimestamp();
        // Pictures and the post go in one batch: all saved, or none.
        var b = d.batch();
        var ref = d.collection('boardPosts').doc();
        var doc = {
          title: title, body: body, category: cat,
          authorUid: u.uid, authorName: authorName(), authorPhoto: (u.photoURL || '').slice(0, 500),
          createdAt: now, lastActivity: now,
          status: 'open', pinned: false,
          votes: [], voteCount: 0, replyCount: 0
        };
        var imgs = imageWrites(d, b, _pending.bdNew, u.uid);
        if (imgs.length) doc.images = imgs;
        b.set(ref, doc);
        return b.commit().then(function () { return ref; });
      }).then(function (ref) {
        clearForm('bdNew');   // only on success - a failed post keeps its text
        _pending.bdNew = [];
        S.composing = false;
        S.cat = 'all'; S.status = 'all'; S.sort = 'new'; S.query = ''; savePrefs();
        openPost(ref.id);
      });
    });
  }

  function savePostEdit(id, cat, title, body) {
    var u = user(); if (!u) return;
    var before = (findPost(id) || {}).images || [];
    return guard('edit:' + id, function () {
      return db().then(function (d) {
        var b = d.batch();
        var imgs = imageWrites(d, b, _pending.bdEdit, u.uid);
        b.update(postRef(d, id), { title: title, body: body, category: cat, images: imgs, editedAt: FV().serverTimestamp() });
        return b.commit().then(function () {
          // Pictures taken out while editing are removed once the edit saved.
          var kept = imgs.map(function (im) { return im.id; });
          dropImages(d, before.filter(function (im) { return kept.indexOf(im.id) < 0; }));
        });
      }).then(function () { clearForm('bdEdit'); _pending.bdEdit = []; S.editingId = null; });
    });
  }

  function toggleVote(id) {
    var u = user();
    if (!u) { promptSignIn(); return; }
    var post = findPost(id); if (!post) return;
    var has = post.votes.indexOf(u.uid) >= 0;
    return guard('vote:' + id, function () {
      return db().then(function (d) {
        return postRef(d, id).update({
          votes: has ? FV().arrayRemove(u.uid) : FV().arrayUnion(u.uid),
          voteCount: FV().increment(has ? -1 : 1)
        });
      });
    });
  }

  // Reply + counter bump in one batch; the rules require them together.
  function addReply(id, body) {
    var u = user(); if (!u) return;
    return guard('reply:' + id, function () {
      return db().then(function (d) {
        var pref = postRef(d, id);
        var rref = pref.collection('replies').doc();
        var now = FV().serverTimestamp();
        var b = d.batch();
        var doc = { body: body, authorUid: u.uid, authorName: authorName(), authorPhoto: (u.photoURL || '').slice(0, 500), createdAt: now };
        var imgs = imageWrites(d, b, _pending.bdReply, u.uid);
        if (imgs.length) doc.images = imgs;
        b.set(rref, doc);
        b.update(pref, { replyCount: FV().increment(1), lastActivity: now, lastReplyId: rref.id });
        return b.commit();
      }).then(function () {
        var ta = document.getElementById('bdReplyInput');
        if (ta) ta.value = '';
        _drafts['bdReplyInput'] = '';
        _pending.bdReply = [];
      });
    });
  }

  function deleteReply(postId, replyId) {
    var r = (S.replies[postId] || []).filter(function (x) { return x.id === replyId; })[0];
    return guard('delreply:' + replyId, function () {
      return db().then(function (d) {
        var pref = postRef(d, postId);
        var b = d.batch();
        b.delete(pref.collection('replies').doc(replyId));
        b.update(pref, { replyCount: FV().increment(-1), lastReplyId: replyId });
        return b.commit().then(function () { if (r) dropImages(d, r.images); });
      });
    });
  }

  // Deletes the post and every reply under it, in batches of 400.
  function deletePost(id) {
    return guard('delpost:' + id, function () {
      return db().then(function (d) {
        var pref = postRef(d, id);
        var postImgs = (findPost(id) || {}).images || [];
        return pref.collection('replies').get().then(function (snap) {
          var docs = snap.docs, chain = Promise.resolve();
          // Their pictures go too (best effort, see dropImages).
          docs.forEach(function (r) { dropImages(d, (r.data() || {}).images); });
          dropImages(d, postImgs);
          for (var i = 0; i < docs.length; i += 400) {
            (function (slice) {
              chain = chain.then(function () {
                var b = d.batch();
                slice.forEach(function (r) { b.delete(r.ref); });
                return b.commit();
              });
            })(docs.slice(i, i + 400));
          }
          return chain.then(function () { return pref.delete(); });
        });
      }).then(function () { closePost(); });
    });
  }

  function adminSet(id, fields) {
    return guard('admin:' + id, function () {
      return db().then(function (d) { return postRef(d, id).update(fields); });
    });
  }

  // ── Derived list ───────────────────────────────────────────────────────────
  function findPost(id) {
    for (var i = 0; i < S.posts.length; i++) if (S.posts[i].id === id) return S.posts[i];
    return null;
  }

  function visiblePosts() {
    var q = S.query.trim().toLowerCase();
    var list = S.posts.filter(function (p) {
      if (S.cat !== 'all' && p.category !== S.cat) return false;
      if (S.status !== 'all' && (p.status || 'open') !== S.status) return false;
      if (q && ((p.title || '') + ' ' + (p.body || '') + ' ' + (p.authorName || '')).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    list.sort(function (a, b) {
      // Pinned posts always lead, whatever the sort.
      if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
      if (S.sort === 'top' && (b.voteCount || 0) !== (a.voteCount || 0)) return (b.voteCount || 0) - (a.voteCount || 0);
      if (S.sort === 'active') return toMs(b.lastActivity) - toMs(a.lastActivity);
      return toMs(b.createdAt) - toMs(a.createdAt);
    });
    return list;
  }

  // ── Rendering ──────────────────────────────────────────────────────────────
  // Snapshots arrive while people type, and render() rebuilds the markup, so
  // text in any [data-draft] field (and the caret) is carried across.
  var _drafts = {};
  function captureDrafts(root) {
    root.querySelectorAll('[data-draft]').forEach(function (el) { _drafts[el.id] = el.value; });
    var a = document.activeElement;
    if (a && root.contains(a) && a.id) {
      return { id: a.id, s: a.selectionStart, e: a.selectionEnd };
    }
    return null;
  }
  function restoreDrafts(root, focus) {
    root.querySelectorAll('[data-draft]').forEach(function (el) {
      if (_drafts[el.id] != null) el.value = _drafts[el.id];
    });
    updateCounters(root);
    if (focus) {
      var el = document.getElementById(focus.id);
      if (el) {
        el.focus({ preventScroll: true });
        try { if (focus.s != null) el.setSelectionRange(focus.s, focus.e); } catch (e) {}
      }
    }
  }

  function render() {
    var root = document.getElementById('boardView');
    if (!root || !_active) return;
    var focus = captureDrafts(root);
    root.innerHTML = viewHTML();
    restoreDrafts(root, focus);
    loadImages(root);
  }

  // Line icons for the buttons and tags (redesign phase 9 part 7; they were
  // emoji). Drawn on a 16px grid, stroked in the text colour.
  var ICONS = {
    pin: '<path d="M6 2.5h4M7 2.5v4L4.5 9h7L9 6.5v-4M8 9v4.5"/>',
    reply: '<path d="M2.5 4.2c0-.8.6-1.4 1.4-1.4h8.2c.8 0 1.4.6 1.4 1.4v5.2c0 .8-.6 1.4-1.4 1.4H7l-3 2.4v-2.4h-.1c-.8 0-1.4-.6-1.4-1.4Z"/>',
    edit: '<path d="M10.6 2.8l2.6 2.6L6 12.6l-3.2.6.6-3.2z"/>',
    link: '<path d="M6.8 9.2l2.4-2.4"/><path d="M7.6 4.6l1-1a2.6 2.6 0 0 1 3.7 3.7l-1 1"/><path d="M8.4 11.4l-1 1a2.6 2.6 0 0 1-3.7-3.7l1-1"/>',
    trash: '<path d="M2.8 4.4h10.4M6.2 4.4V3h3.6v1.4M4.2 4.4l.6 8.6h6.4l.6-8.6"/>',
    plus: '<path d="M8 3v10M3 8h10"/>',
    image: '<rect x="2.5" y="3" width="11" height="10" rx="1.6"/><circle cx="6" cy="6.5" r="1.1"/><path d="M2.8 11.4l3.4-3 2.4 2.1 1.9-1.6 2.8 2.4"/>',
    smile: '<circle cx="8" cy="8" r="5.6"/><path d="M5.8 9.6c.6.8 1.3 1.1 2.2 1.1s1.6-.3 2.2-1.1"/><path d="M6.2 6.4v.4M9.8 6.4v.4"/>'
  };
  function ico(name) {
    return '<svg class="bd-ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' + ICONS[name] + '</svg>';
  }

  function viewHTML() {
    var u = user();
    var h = '';
    // The shared page title (as Records / Stats / Events / Awards / Soundtrack /
    // Playlists) with the nav's two speech bubbles, then the line under it.
    // No box around the board: the posts are rows on the page.
    h += '<div class="bd-section">';
    h += '<div class="section-header bd-page-header"><h2 class="section-header-h2">' +
      // the glow kit's two bubbles (glowkit.js)
      (typeof window.dcGlowIco === 'function' ? window.dcGlowIco('board') : '') +
      '<span>' + esc(tr('board_title')) + '</span></h2>' +
      // glow kit header sticker
      '<span class="dc-hstk dc-hstk--board">' + esc(tr('gk_stk_board')) + '</span>' +
      '<div class="section-rule"></div></div>';
    h += '<p class="bd-page-sub">' + esc(tr('board_sub')) + '</p>';
    h += '<div class="bd-body">';

    // Account strip
    if (!u) {
      h += '<div class="bd-signin"><span>' + esc(tr('board_signin_note')) + '</span>' +
        '<button type="button" class="dc-btn dc-btn-main" onclick="dcSignIn()">' + esc(tr('board_signin_btn')) + '</button></div>';
    }

    // Toolbar: category chips, then search / status / sort / new post
    h += '<div class="bd-toolbar">';
    h += '<div class="bd-chips" role="group" aria-label="' + esc(tr('board_filter_cat')) + '">';
    ['all'].concat(CATEGORIES).forEach(function (c) {
      var n = c === 'all' ? S.posts.length : S.posts.filter(function (p) { return p.category === c; }).length;
      h += '<button type="button" class="dc-chip bd-chip' + (S.cat === c ? ' active' : '') + '" data-cat="' + c + '" aria-pressed="' + (S.cat === c) + '" onclick="dcBoard.setCat(\'' + c + '\')">' +
        (c === 'all' ? esc(tr('board_cat_all')) : '<span class="bd-dot bd-cat-' + c + '"></span>' + esc(catLabel(c))) +
        '<span class="bd-chip-n">' + n + '</span></button>';
    });
    h += '</div>';
    h += '<div class="bd-tools">';
    h += '<input type="search" id="bdSearch" data-draft class="bd-input bd-search" placeholder="' + esc(tr('board_search')) + '" aria-label="' + esc(tr('board_search')) + '" value="' + esc(S.query) + '" oninput="dcBoard.setQuery(this.value)">';
    h += '<select class="bd-input bd-select" aria-label="' + esc(tr('board_filter_status')) + '" onchange="dcBoard.setStatus(this.value)">' +
      '<option value="all"' + (S.status === 'all' ? ' selected' : '') + '>' + esc(tr('board_status_all')) + '</option>' +
      STATUSES.map(function (s) { return '<option value="' + s + '"' + (S.status === s ? ' selected' : '') + '>' + esc(statusLabel(s)) + '</option>'; }).join('') +
      '</select>';
    h += '<div class="dc-seg bd-seg" role="group" aria-label="' + esc(tr('board_sort')) + '">' +
      ['top', 'new', 'active'].map(function (s) {
        return '<button type="button" class="' + (S.sort === s ? 'active' : '') + '" aria-pressed="' + (S.sort === s) + '" onclick="dcBoard.setSort(\'' + s + '\')">' + esc(tr('board_sort_' + s)) + '</button>';
      }).join('') + '</div>';
    h += '<button type="button" class="dc-btn dc-btn-main bd-new-btn" onclick="dcBoard.compose()">' + ico('plus') + esc(tr('board_new')) + '</button>';
    h += '</div></div>';

    if (S.composing && u) h += composerHTML(null);

    // List
    if (!S.loaded) {
      h += '<div class="bd-empty">' + esc(tr('board_loading')) + '</div>';
    } else if (S.error) {
      h += '<div class="bd-empty bd-empty-err">' + esc(tr('board_err_load')) + '</div>';
    } else {
      var list = visiblePosts();
      if (!list.length) {
        h += '<div class="bd-empty">' + esc(S.posts.length ? tr('board_empty_filtered') : tr('board_empty')) + '</div>';
      } else {
        h += '<ul class="bd-list">' + list.map(postHTML).join('') + '</ul>';
      }
    }
    h += '</div></div>';
    return h;
  }

  // The new-post form, or the edit form when `post` is given.
  function composerHTML(post) {
    var pre = post ? 'bdEdit' : 'bdNew';
    var cat = post ? post.category : (S.cat !== 'all' ? S.cat : 'suggestion');
    var h = '<form class="bd-composer' + (post ? ' bd-composer-edit' : '') + '" onsubmit="dcBoard.submit(event,' + (post ? '\'' + esc(post.id) + '\'' : 'null') + ')">';
    if (!post) h += '<div class="bd-composer-title">' + esc(tr('board_new')) + '</div>';
    h += '<div class="bd-cat-pick" role="radiogroup" aria-label="' + esc(tr('board_filter_cat')) + '">';
    CATEGORIES.forEach(function (c) {
      h += '<label class="bd-cat-opt"><input type="radio" name="' + pre + 'Cat" value="' + c + '"' + (c === cat ? ' checked' : '') + '>' +
        '<span><span class="bd-dot bd-cat-' + c + '"></span>' + esc(catLabel(c)) + '</span></label>';
    });
    h += '</div>';
    h += '<input type="text" id="' + pre + 'Title" data-draft class="bd-input" maxlength="' + MAX_TITLE + '" placeholder="' + esc(tr('board_title_ph')) + '" aria-label="' + esc(tr('board_title_ph')) + '"' + (post ? ' value="' + esc(post.title) + '"' : '') + ' required>';
    h += '<textarea id="' + pre + 'Body" data-draft class="bd-input bd-textarea" maxlength="' + MAX_BODY + '" rows="5" placeholder="' + esc(tr('board_body_ph')) + '" aria-label="' + esc(tr('board_body_ph')) + '" oninput="dcBoard.count(this)" onpaste="dcBoard.pasteImg(event,\'' + pre + '\')">' + (post ? esc(post.body) : '') + '</textarea>';
    h += attachHTML(pre, pre + 'Body');
    h += '<div class="bd-composer-foot"><span class="bd-note">' + (post ? '' : esc(tr('board_public_note'))) + '</span>' +
      '<span class="bd-count" data-for="' + pre + 'Body"></span>' +
      '<button type="button" class="dc-btn dc-btn-normal" onclick="dcBoard.cancelCompose(' + (post ? 'true' : 'false') + ')">' + esc(tr('board_cancel')) + '</button>' +
      '<button type="submit" class="dc-btn dc-btn-main"' + (S.busy[post ? 'edit:' + post.id : 'create'] ? ' disabled' : '') + '>' + esc(post ? tr('board_save') : tr('board_post')) + '</button></div>';
    h += '</form>';
    return h;
  }

  function postHTML(p) {
    var u = user();
    var voted = !!(u && p.votes.indexOf(u.uid) >= 0);
    var open = S.openId === p.id;
    var status = p.status || 'open';
    var h = '<li class="bd-post' + (open ? ' open' : '') + (p.pinned ? ' pinned' : '') + '" id="bdPost-' + esc(p.id) + '">';
    // Vote column
    h += '<button type="button" class="bd-vote' + (voted ? ' voted' : '') + '" aria-pressed="' + voted + '" ' +
      'aria-label="' + esc(tr(voted ? 'board_unvote' : 'board_vote')) + '" title="' + esc(tr(u ? (voted ? 'board_unvote' : 'board_vote') : 'board_vote_signin')) + '" ' +
      'onclick="dcBoard.vote(\'' + esc(p.id) + '\')"' + (S.busy['vote:' + p.id] ? ' disabled' : '') + '>' +
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.2 13.2 10H2.8Z" fill="currentColor"/></svg>' +
      '<span class="bd-vote-n">' + (p.voteCount || 0) + '</span></button>';
    // Main column
    h += '<div class="bd-post-main">';
    h += '<div class="bd-tags">' +
      (p.pinned ? '<span class="dc-chip bd-tag bd-tag-pin">' + ico('pin') + esc(tr('board_pinned')) + '</span>' : '') +
      '<span class="dc-chip bd-tag bd-tag-cat"><span class="bd-dot bd-cat-' + esc(p.category) + '"></span>' + esc(catLabel(p.category)) + '</span>' +
      (status !== 'open' ? '<span class="dc-chip bd-tag bd-status bd-status-' + esc(status) + '">' + esc(statusLabel(status)) + '</span>' : '') +
      '</div>';
    if (S.editingId === p.id) {
      h += composerHTML(p);
    } else {
      h += '<button type="button" class="bd-post-title" aria-expanded="' + open + '" onclick="dcBoard.toggle(\'' + esc(p.id) + '\')">' + esc(p.title) + '</button>';
      if (open) h += '<div class="bd-post-body">' + richText(p.body || '') + '</div>' + imagesHTML(p.images);
      else if (p.body) h += '<div class="bd-post-snippet">' + esc(p.body.slice(0, 220)) + '</div>';
    }
    h += '<div class="bd-meta">' + avatar(p.authorPhoto, p.authorName) +
      '<span class="bd-author">' + esc(p.authorName || tr('board_anon')) + '</span>' +
      '<span class="bd-sep">·</span><span title="' + esc(new Date(toMs(p.createdAt)).toLocaleString()) + '">' + esc(ago(toMs(p.createdAt))) + '</span>' +
      (p.editedAt ? '<span class="bd-sep">·</span><span>' + esc(tr('board_edited')) + '</span>' : '') +
      // closed posts say how many pictures they hold; open ones show them
      (!open && p.images && p.images.length ? '<span class="bd-sep">·</span><span class="bd-img-n" title="' + esc(tr('board_img_count', { n: p.images.length })) + '">' + ico('image') + p.images.length + '</span>' : '') +
      '<span class="bd-sep">·</span><button type="button" class="bd-link bd-replies-link" onclick="dcBoard.toggle(\'' + esc(p.id) + '\')">' + ico('reply') +
      esc(tr((p.replyCount || 0) === 1 ? 'board_replies_one' : 'board_replies_other', { n: p.replyCount || 0 })) + '</button>' +
      '</div>';
    if (open) h += detailHTML(p);
    h += '</div></li>';
    return h;
  }

  // Owner / moderator actions, then the replies and the reply box.
  function detailHTML(p) {
    var u = user();
    var mine = !!(u && p.authorUid === u.uid);
    var h = '';
    if ((mine || S.isAdmin) && S.editingId !== p.id) {
      h += '<div class="bd-actions">';
      if (mine) h += '<button type="button" class="dc-btn dc-btn-normal dc-btn-sm" onclick="dcBoard.edit(\'' + esc(p.id) + '\')">' + ico('edit') + esc(tr('board_edit')) + '</button>';
      h += '<button type="button" class="dc-btn dc-btn-normal dc-btn-sm" onclick="dcBoard.share(\'' + esc(p.id) + '\')">' + ico('link') + esc(tr('board_copy_link')) + '</button>';
      if (S.isAdmin) {
        h += '<button type="button" class="dc-btn dc-btn-normal dc-btn-sm" onclick="dcBoard.pin(\'' + esc(p.id) + '\')">' + ico('pin') + esc(tr(p.pinned ? 'board_unpin' : 'board_pin')) + '</button>';
        h += '<label class="bd-status-pick"><span>' + esc(tr('board_status_label')) + '</span><select class="bd-input bd-select" onchange="dcBoard.setPostStatus(\'' + esc(p.id) + '\', this.value)">' +
          STATUSES.map(function (s) { return '<option value="' + s + '"' + ((p.status || 'open') === s ? ' selected' : '') + '>' + esc(statusLabel(s)) + '</option>'; }).join('') +
          '</select></label>';
        // Moderators can move a post to the right category (a "suggestion"
        // that is really a question). Authors change theirs through Edit.
        h += '<label class="bd-status-pick"><span>' + esc(tr('board_category_label')) + '</span><select class="bd-input bd-select" onchange="dcBoard.setPostCategory(\'' + esc(p.id) + '\', this.value)">' +
          CATEGORIES.map(function (c) { return '<option value="' + c + '"' + (p.category === c ? ' selected' : '') + '>' + esc(catLabel(c)) + '</option>'; }).join('') +
          '</select></label>';
      }
      h += '<button type="button" class="dc-btn dc-btn-plain dc-btn-sm dc-btn-danger" onclick="dcBoard.askDeletePost(\'' + esc(p.id) + '\')">' + ico('trash') + esc(tr('board_delete')) + '</button>';
      h += '</div>';
    } else if (S.editingId !== p.id) {
      h += '<div class="bd-actions"><button type="button" class="dc-btn dc-btn-normal dc-btn-sm" onclick="dcBoard.share(\'' + esc(p.id) + '\')">' + ico('link') + esc(tr('board_copy_link')) + '</button></div>';
    }

    var replies = S.replies[p.id];
    h += '<div class="bd-replies">';
    if (!replies) {
      h += '<div class="bd-note">' + esc(tr('board_loading')) + '</div>';
    } else if (!replies.length) {
      h += '<div class="bd-note">' + esc(tr('board_no_replies')) + '</div>';
    } else {
      h += '<ul class="bd-reply-list">' + replies.map(function (r) {
        var canDel = !!(u && (r.authorUid === u.uid || p.authorUid === u.uid || S.isAdmin));
        var isOp = r.authorUid === p.authorUid;
        return '<li class="bd-reply">' +
          '<div class="bd-meta">' + avatar(r.authorPhoto, r.authorName) +
          '<span class="bd-author">' + esc(r.authorName || tr('board_anon')) + '</span>' +
          (isOp ? '<span class="bd-op">' + esc(tr('board_op')) + '</span>' : '') +
          '<span class="bd-sep">·</span><span title="' + esc(new Date(toMs(r.createdAt)).toLocaleString()) + '">' + esc(ago(toMs(r.createdAt))) + '</span>' +
          (canDel ? '<button type="button" class="bd-link bd-reply-del" onclick="dcBoard.askDeleteReply(\'' + esc(p.id) + '\',\'' + esc(r.id) + '\')" aria-label="' + esc(tr('board_delete_reply')) + '">' + esc(tr('board_delete')) + '</button>' : '') +
          '</div><div class="bd-reply-body">' + richText(r.body || '') + '</div>' + imagesHTML(r.images) + '</li>';
      }).join('') + '</ul>';
    }
    if (u) {
      h += '<form class="bd-reply-form" onsubmit="dcBoard.reply(event,\'' + esc(p.id) + '\')">' +
        '<textarea id="bdReplyInput" data-draft class="bd-input bd-textarea" rows="3" maxlength="' + MAX_REPLY + '" placeholder="' + esc(tr('board_reply_ph')) + '" aria-label="' + esc(tr('board_reply_ph')) + '" oninput="dcBoard.count(this)" onpaste="dcBoard.pasteImg(event,\'bdReply\')"></textarea>' +
        attachHTML('bdReply', 'bdReplyInput') +
        '<div class="bd-composer-foot"><span class="bd-note"></span><span class="bd-count" data-for="bdReplyInput"></span>' +
        '<button type="submit" class="dc-btn dc-btn-main"' + (S.busy['reply:' + p.id] ? ' disabled' : '') + '>' + esc(tr('board_reply_btn')) + '</button></div></form>';
    } else {
      h += '<div class="bd-signin bd-signin-sm"><span>' + esc(tr('board_signin_reply')) + '</span>' +
        '<button type="button" class="dc-btn dc-btn-main dc-btn-sm" onclick="dcSignIn()">' + esc(tr('board_signin_btn')) + '</button></div>';
    }
    h += '</div>';
    return h;
  }

  // ── Pictures and emoji in the forms ────────────────────────────────────────
  // The row under a textarea: emoji button, add-picture button (a hidden file
  // input inside a <label>, so a real click opens the file chooser), then the
  // pictures waiting to be posted, each with a remove button.
  function attachHTML(key, taId) {
    var list = _pending[key] || [];
    var full = list.length >= MAX_IMAGES;
    var h = '<div class="bd-attach">';
    h += '<button type="button" class="dc-btn dc-btn-normal dc-btn-sm bd-emoji-btn" aria-haspopup="true" onclick="dcBoard.emoji(this,\'' + taId + '\')" title="' + esc(tr('board_emoji')) + '">' + ico('smile') + '<span>' + esc(tr('board_emoji')) + '</span></button>';
    h += '<label class="dc-btn dc-btn-normal dc-btn-sm bd-img-btn' + (full ? ' disabled' : '') + '" title="' + esc(tr(full ? 'board_img_full' : 'board_add_image')) + '">' + ico('image') + '<span>' + esc(tr('board_add_image')) + '</span>' +
      '<input type="file" accept="image/*" multiple' + (full ? ' disabled' : '') + ' onchange="dcBoard.addImg(this,\'' + key + '\')"></label>';
    if (S.busy['img:' + key]) h += '<span class="bd-note">' + esc(tr('board_img_working')) + '</span>';
    h += '</div>';
    if (list.length) {
      h += '<div class="bd-thumbs">' + list.map(function (im, i) {
        var src = im.data || _imgCache[im.id] || '';
        return '<span class="bd-thumb"><img ' + (src ? 'src="' + esc(src) + '"' : 'data-bdimg="' + esc(im.id) + '"') + ' alt="">' +
          '<button type="button" class="bd-thumb-x" aria-label="' + esc(tr('board_img_remove')) + '" title="' + esc(tr('board_img_remove')) + '" onclick="dcBoard.removeImg(\'' + key + '\',' + i + ')">×</button></span>';
      }).join('') + '</div>';
    }
    return h;
  }

  // Pictures shown under a post or reply. The size is known up front, so the
  // space is held while the picture loads and nothing jumps.
  function imagesHTML(list) {
    if (!list || !list.length) return '';
    return '<div class="bd-imgs bd-imgs-' + Math.min(list.length, 4) + '">' + list.map(function (im) {
      if (!im || !im.id) return '';
      var src = _imgCache[im.id];
      var ratio = im.w && im.h ? ' style="aspect-ratio:' + (+im.w) + '/' + (+im.h) + '"' : '';
      // One picture: the box is the picture's own shape, at most 560 wide and
      // 360 tall, so a tall picture doesn't sit in a wide empty frame.
      var box = '';
      if (list.length === 1 && im.w && im.h) box = ' style="width:' + Math.round(Math.min(560, +im.w, +im.w * 360 / +im.h)) + 'px"';
      return '<button type="button" class="bd-img"' + box + ' onclick="dcBoard.viewImg(\'' + esc(im.id) + '\')" aria-label="' + esc(tr('board_img_open')) + '">' +
        '<img ' + (src ? 'src="' + esc(src) + '"' : 'data-bdimg="' + esc(im.id) + '"') + ratio + ' alt="' + esc(tr('board_img_alt')) + '"></button>';
    }).join('') + '</div>';
  }

  // Fills in every picture on screen that isn't downloaded yet.
  var _imgLoading = {};
  function loadImages(root) {
    root.querySelectorAll('img[data-bdimg]').forEach(function (img) {
      var id = img.getAttribute('data-bdimg');
      if (_imgCache[id]) { img.src = _imgCache[id]; return; }
      if (_imgLoading[id] || _sampleOn) return;
      _imgLoading[id] = true;
      db().then(function (d) { return d.collection('boardImages').doc(id).get(); }).then(function (snap) {
        var data = snap.exists ? (snap.data() || {}).data : '';
        // Only pictures: anything else stored there is never put on the page.
        if (typeof data === 'string' && /^data:image\/(webp|jpeg|png);base64,/.test(data)) {
          _imgCache[id] = data;
          document.querySelectorAll('img[data-bdimg="' + id + '"]').forEach(function (el) { el.src = data; });
        }
      }).catch(function (err) {
        console.warn('[dankcharts] Board picture error:', err);
      }).then(function () { delete _imgLoading[id]; });
    });
  }

  // Shrinks a picture file so it fits one Firestore document: longest side
  // at most IMG_MAX_SIDE, WebP (JPEG where the browser can't make WebP),
  // lowering the quality and then the size until it fits IMG_MAX_CHARS.
  // Animated GIFs keep only their first frame.
  function shrinkImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        var side = IMG_MAX_SIDE, q = 0.85;
        var webp = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
        for (var tries = 0; tries < 12; tries++) {
          var k = Math.min(1, side / Math.max(img.naturalWidth, img.naturalHeight));
          var w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k));
          var c = document.createElement('canvas');
          c.width = w; c.height = h;
          var x = c.getContext('2d');
          // JPEG has no see-through parts; give it a dark backdrop.
          if (!webp) { x.fillStyle = '#111'; x.fillRect(0, 0, w, h); }
          x.drawImage(img, 0, 0, w, h);
          var data = c.toDataURL(webp ? 'image/webp' : 'image/jpeg', q);
          if (data.length <= IMG_MAX_CHARS) { resolve({ data: data, w: w, h: h }); return; }
          if (q > 0.6) q -= 0.1; else side = Math.round(side * 0.8);
        }
        reject(new Error('too big'));
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('not an image')); };
      img.src = url;
    });
  }

  function addFiles(key, files) {
    files = Array.prototype.filter.call(files || [], function (f) { return /^image\//.test(f.type); });
    if (!files.length) return;
    var room = MAX_IMAGES - _pending[key].length;
    if (room <= 0) { toast(tr('board_img_full')); return; }
    if (files.length > room) toast(tr('board_img_full'));
    files = files.slice(0, room);
    S.busy['img:' + key] = true;
    render();
    var chain = Promise.resolve();
    files.forEach(function (f) {
      chain = chain.then(function () {
        return shrinkImage(f).then(function (im) {
          if (_pending[key].length < MAX_IMAGES) _pending[key].push(im);
        }, function () { toast(tr('board_img_bad')); });
      });
    });
    chain.then(function () { delete S.busy['img:' + key]; render(); });
  }

  // The emoji grid floats on <body>, so a redraw of the board (a new post
  // arriving while it's open) doesn't close it. It types into the textarea
  // whose id it was opened for, at the caret.
  var _emojiPop = null;
  function closeEmoji() {
    if (!_emojiPop) return;
    _emojiPop.remove(); _emojiPop = null;
    document.removeEventListener('mousedown', onEmojiOutside, true);
    document.removeEventListener('keydown', onEmojiKey, true);
  }
  function onEmojiOutside(e) {
    if (_emojiPop && !_emojiPop.contains(e.target) && !(e.target.closest && e.target.closest('.bd-emoji-btn'))) closeEmoji();
  }
  function onEmojiKey(e) { if (e.key === 'Escape') { e.stopPropagation(); closeEmoji(); } }
  function openEmoji(btn, taId) {
    if (_emojiPop) { var same = _emojiPop.dataset.for === taId; closeEmoji(); if (same) return; }
    var pop = document.createElement('div');
    pop.className = 'bd-emoji-pop';
    pop.dataset.for = taId;
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-label', tr('board_emoji'));
    pop.innerHTML = EMOJI.map(function (e) { return '<button type="button" class="bd-emoji">' + e + '</button>'; }).join('');
    pop.addEventListener('click', function (e) {
      var b = e.target.closest('.bd-emoji'); if (!b) return;
      var ta = document.getElementById(taId); if (!ta) { closeEmoji(); return; }
      var s = ta.selectionStart != null ? ta.selectionStart : ta.value.length;
      var en = ta.selectionEnd != null ? ta.selectionEnd : s;
      var v = ta.value.slice(0, s) + b.textContent + ta.value.slice(en);
      if (v.length > +ta.getAttribute('maxlength')) return;
      ta.value = v;
      _drafts[taId] = v;
      ta.focus({ preventScroll: true });
      try { ta.setSelectionRange(s + b.textContent.length, s + b.textContent.length); } catch (er) {}
      updateCounters(ta.closest('form') || document);
      // stays open, so several can go in; Escape or a click elsewhere closes it
    });
    document.body.appendChild(pop);
    // Under the button, kept on screen; above it when there's no room below.
    var r = btn.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    var left = Math.max(8, Math.min(r.left, window.innerWidth - pw - 8));
    var top = r.bottom + 6 + ph > window.innerHeight ? r.top - ph - 6 : r.bottom + 6;
    pop.style.left = left + 'px';
    pop.style.top = Math.max(8, top) + 'px';
    _emojiPop = pop;
    document.addEventListener('mousedown', onEmojiOutside, true);
    document.addEventListener('keydown', onEmojiKey, true);
  }

  // A picture full size, over the page. Escape, a click or the button closes it.
  function viewImage(id) {
    var src = _imgCache[id]; if (!src) return;
    var layer = document.createElement('div');
    layer.className = 'bd-lightbox';
    layer.setAttribute('role', 'dialog');
    layer.setAttribute('aria-modal', 'true');
    layer.setAttribute('aria-label', tr('board_img_alt'));
    layer.innerHTML = '<img src="' + esc(src) + '" alt="' + esc(tr('board_img_alt')) + '">' +
      '<button type="button" class="bd-lightbox-x" aria-label="' + esc(tr('board_img_close')) + '">×</button>';
    var prev = document.activeElement;
    function close() {
      document.removeEventListener('keydown', onKey, true);
      layer.remove();
      if (prev && prev.focus) try { prev.focus({ preventScroll: true }); } catch (e) {}
    }
    // Escape closes; Tab stays on the close button; the page's own keys stay quiet.
    function onKey(e) {
      if (e.key === 'Escape' || e.key === 'Tab') e.preventDefault();
      if (e.key === 'Escape') close();
      e.stopPropagation();
    }
    layer.addEventListener('click', close);
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(layer);
    layer.querySelector('.bd-lightbox-x').focus();
  }

  // "1200 / 5000" under textareas, shown once the text gets long.
  function updateCounters(root) {
    root.querySelectorAll('.bd-count[data-for]').forEach(function (c) {
      var ta = document.getElementById(c.dataset.for);
      if (!ta) return;
      var max = +ta.getAttribute('maxlength');
      var n = ta.value.length;
      c.textContent = n > max * 0.8 ? n + ' / ' + max : '';
    });
  }

  // ── Little in-site windows ─────────────────────────────────────────────────
  function toast(msg) {
    var el = document.createElement('div');
    el.className = 'bd-toast';
    el.setAttribute('role', 'status');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { el.classList.add('out'); }, 2600);
    setTimeout(function () { el.remove(); }, 3000);
  }

  function promptSignIn() { toast(tr('board_vote_signin')); }

  // Same look and behaviour as the awards picker's warning window (reuses its
  // classes): Cancel focused first, Escape/backdrop cancel, Tab kept inside.
  function confirmBox(title, text, okLabel, onOk) {
    var layer = document.createElement('div');
    layer.className = 'bd-confirm-layer';
    layer.innerHTML = '<div class="awards-picker-confirm">' +
      '<div class="dc-modal awards-picker-confirm-box" role="alertdialog" aria-modal="true" aria-labelledby="bdConfirmTitle" aria-describedby="bdConfirmText">' +
      '<div class="awards-picker-confirm-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg></div>' +
      '<div class="awards-picker-confirm-title" id="bdConfirmTitle">' + esc(title) + '</div>' +
      '<div class="awards-picker-confirm-text" id="bdConfirmText">' + esc(text) + '</div>' +
      '<div class="awards-picker-confirm-actions">' +
      '<button type="button" class="dc-btn dc-btn-normal awards-picker-confirm-cancel">' + esc(tr('board_cancel')) + '</button>' +
      '<button type="button" class="dc-btn dc-btn-plain dc-btn-danger awards-picker-confirm-ok">' + esc(okLabel) + '</button>' +
      '</div></div></div>';
    var prevFocus = document.activeElement;
    function close() {
      document.removeEventListener('keydown', onKey, true);
      layer.remove();
      if (prevFocus && prevFocus.focus) try { prevFocus.focus({ preventScroll: true }); } catch (e) {}
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
      if (e.key === 'Tab') {
        var btns = layer.querySelectorAll('button');
        var first = btns[0], last = btns[btns.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      // Keep the page's own shortcuts (1-9 tab keys, arrows) quiet while open.
      e.stopPropagation();
    }
    layer.querySelector('.awards-picker-confirm').addEventListener('click', function (e) { if (e.target === this) close(); });
    layer.querySelector('.awards-picker-confirm-cancel').addEventListener('click', close);
    layer.querySelector('.awards-picker-confirm-ok').addEventListener('click', function () { close(); onOk(); });
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(layer);
    layer.querySelector('.awards-picker-confirm-cancel').focus();
  }

  // Playlists (app.js) asks with the same window instead of the browser's
  // confirm(), so the site has one kind of warning
  window.dcConfirmBox = confirmBox;

  // ── Open / close a post (and its #t=board/<id> link) ───────────────────────
  function setHash(id) {
    try { history.replaceState(null, '', '#t=board' + (id ? '/' + id : '')); } catch (e) {}
  }
  function openPost(id) {
    S.openId = id;
    if (S.editingId && S.editingId !== id) S.editingId = null;
    _drafts['bdReplyInput'] = '';
    _pending.bdReply = [];
    subscribeReplies(id);
    setHash(id);
    render();
    var el = document.getElementById('bdPost-' + id);
    if (el && el.getBoundingClientRect().top < 80) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  function closePost() {
    S.openId = null; S.editingId = null;
    unsubscribeReplies();
    setHash(null);
  }

  // ── Form reading ───────────────────────────────────────────────────────────
  function readForm(pre) {
    var catEl = document.querySelector('input[name="' + pre + 'Cat"]:checked');
    var title = (document.getElementById(pre + 'Title') || {}).value || '';
    var body = (document.getElementById(pre + 'Body') || {}).value || '';
    return { cat: catEl ? catEl.value : 'suggestion', title: title.trim(), body: body.trim() };
  }
  function clearForm(pre) { delete _drafts[pre + 'Title']; delete _drafts[pre + 'Body']; }

  // ── Public API (onclick handlers + app.js hooks) ───────────────────────────
  window.dcBoard = {
    // Called by the nav handler in app.js when the Board tab is shown/left.
    show: function (postId) {
      _active = true;
      // The nav handler has just reset the hash to #t=board; put the post back
      // so the link stays shareable and a second tab click keeps it open.
      if (postId) { S.openId = postId; subscribeReplies(postId); setHash(postId); }
      subscribePosts();
      refreshAdmin().then(render);
      render();
    },
    hide: function () {
      if (!_active) return;
      _active = false;
      if (_unsubPosts) { _unsubPosts(); _unsubPosts = null; }
      unsubscribeReplies();
      S.openId = null; S.editingId = null; S.composing = false;
    },
    // Opens one post from anywhere on the site (a notification about a reply
    // or a status change, notifications.js): goes to the Board tab first if
    // it isn't showing, the same way a #t=board/<id> link does.
    openFromLink: function (id) {
      if (_active) { if (S.openId !== id) openPost(id); return; }
      setHash(id);
      if (typeof dcGoTab === 'function') dcGoTab('board');
    },
    // Redraw with the current data, e.g. after the language changes so the
    // labels and "3 days ago" dates switch over.
    rerender: function () { render(); },
    // For tools/guide-shots.mjs only: the guide's pictures show made-up posts
    // and replies, never real people's. Swaps the live list for these until
    // the page reloads. posts: the same fields as a boardPosts doc (times in
    // ms); replies: postId -> [reply].
    _sample: function (posts, replies) {
      _sampleOn = true;
      if (_unsubPosts) { _unsubPosts(); _unsubPosts = null; }
      unsubscribeReplies();
      S.posts = posts || []; S.replies = replies || {};
      S.loaded = true; S.error = null;
      render();
    },

    setCat: function (c) { S.cat = c; savePrefs(); render(); },
    setStatus: function (s) { S.status = s; savePrefs(); render(); },
    setSort: function (s) { S.sort = s; savePrefs(); render(); },
    setQuery: function (q) {
      S.query = q;
      render();   // render() keeps focus and caret, so typing isn't interrupted
    },
    compose: function () {
      if (!user()) { toast(tr('board_signin_note')); return; }
      S.composing = !S.composing;
      render();
      if (S.composing) { var el = document.getElementById('bdNewTitle'); if (el) el.focus(); }
    },
    cancelCompose: function (isEdit) {
      if (isEdit) { clearForm('bdEdit'); _pending.bdEdit = []; S.editingId = null; }
      else { clearForm('bdNew'); _pending.bdNew = []; S.composing = false; }
      closeEmoji();
      render();
    },
    submit: function (e, editId) {
      e.preventDefault();
      var pre = editId ? 'bdEdit' : 'bdNew';
      var f = readForm(pre);
      if (f.title.length < MIN_TITLE) { toast(tr('board_err_title')); return; }
      if (f.body.length > MAX_BODY) return;
      if (S.busy['img:' + pre]) return;   // a picture is still being shrunk
      closeEmoji();
      if (editId) savePostEdit(editId, f.cat, f.title, f.body);
      else createPost(f.cat, f.title, f.body);
    },
    toggle: function (id) {
      if (S.openId === id) { closePost(); render(); }
      else openPost(id);
    },
    vote: function (id) { toggleVote(id); },
    reply: function (e, id) {
      e.preventDefault();
      var ta = document.getElementById('bdReplyInput');
      var body = ta ? ta.value.trim() : '';
      // a reply can be just a picture
      if (!body && !_pending.bdReply.length) return;
      if (S.busy['img:bdReply']) return;
      closeEmoji();
      addReply(id, body);
    },
    edit: function (id) {
      var p = findPost(id);
      S.editingId = id; clearForm('bdEdit');
      // the post's pictures start in the form; taking one out removes it on Save
      _pending.bdEdit = ((p && p.images) || []).map(function (im) { return { id: im.id, w: im.w, h: im.h }; });
      render();
    },
    // Picture + emoji controls (attachHTML)
    addImg: function (input, key) { var f = Array.prototype.slice.call(input.files || []); input.value = ''; addFiles(key, f); },
    pasteImg: function (e, key) {
      var items = (e.clipboardData && e.clipboardData.files) || [];
      if (!items.length) return;   // plain text pastes as usual
      e.preventDefault();
      addFiles(key, items);
    },
    removeImg: function (key, i) { _pending[key].splice(i, 1); render(); },
    emoji: function (btn, taId) { openEmoji(btn, taId); },
    viewImg: function (id) { viewImage(id); },
    pin: function (id) { var p = findPost(id); if (p) adminSet(id, { pinned: !p.pinned }); },
    setPostStatus: function (id, s) { if (STATUSES.indexOf(s) >= 0) adminSet(id, { status: s }); },
    setPostCategory: function (id, c) { if (CATEGORIES.indexOf(c) >= 0) adminSet(id, { category: c }); },
    share: function (id) {
      var url = location.origin + location.pathname + '#t=board/' + id;
      var done = function () { toast(tr('board_link_copied')); };
      // No clipboard access (old browser, insecure origin): show the link instead.
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { toast(url); });
      else toast(url);
    },
    askDeletePost: function (id) {
      var p = findPost(id); if (!p) return;
      confirmBox(tr('board_del_post_title'), tr('board_del_post_text', { title: p.title }), tr('board_delete'), function () { deletePost(id); });
    },
    askDeleteReply: function (postId, replyId) {
      confirmBox(tr('board_del_reply_title'), tr('board_del_reply_text'), tr('board_delete'), function () { deleteReply(postId, replyId); });
    },
    count: function (el) { _drafts[el.id] = el.value; updateCounters(el.closest('form') || document); }
  };

  // Sign in / out changes what every post shows (vote state, reply box,
  // moderator tools), so redraw - and re-check moderator rights - each time.
  function hookAuth() {
    try {
      firebase.auth().onAuthStateChanged(function () {
        if (!_active) return;
        refreshAdmin().then(render);
        render();
      });
    } catch (e) {}
  }
  if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) hookAuth();
  else document.addEventListener('DOMContentLoaded', hookAuth);
})();
