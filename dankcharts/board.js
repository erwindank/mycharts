/* ===========================================================================
   COMMUNITY BOARD - SUGGESTIONS, BUG REPORTS AND DISCUSSION
   ===========================================================================
   The "Board" tab in the second nav row. Everyone can read it, with or without
   an account; posting, replying and voting need Google sign-in.

   Storage is Firestore (the same project firebase.js talks to):
     boardPosts/{postId}                 one post: title, body, category,
                                         status, pinned, votes (uids), counts
     boardPosts/{postId}/replies/{id}    replies to that post, oldest first
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
  var _active = false;  // board tab on screen

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
    if (_unsubPosts) return;
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

  function createPost(cat, title, body) {
    var u = user(); if (!u) return;
    return guard('create', function () {
      return db().then(function (d) {
        var now = FV().serverTimestamp();
        return d.collection('boardPosts').add({
          title: title, body: body, category: cat,
          authorUid: u.uid, authorName: authorName(), authorPhoto: (u.photoURL || '').slice(0, 500),
          createdAt: now, lastActivity: now,
          status: 'open', pinned: false,
          votes: [], voteCount: 0, replyCount: 0
        });
      }).then(function (ref) {
        clearForm('bdNew');   // only on success - a failed post keeps its text
        S.composing = false;
        S.cat = 'all'; S.status = 'all'; S.sort = 'new'; S.query = ''; savePrefs();
        openPost(ref.id);
      });
    });
  }

  function savePostEdit(id, cat, title, body) {
    return guard('edit:' + id, function () {
      return db().then(function (d) {
        return postRef(d, id).update({ title: title, body: body, category: cat, editedAt: FV().serverTimestamp() });
      }).then(function () { clearForm('bdEdit'); S.editingId = null; });
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
        b.set(rref, { body: body, authorUid: u.uid, authorName: authorName(), authorPhoto: (u.photoURL || '').slice(0, 500), createdAt: now });
        b.update(pref, { replyCount: FV().increment(1), lastActivity: now, lastReplyId: rref.id });
        return b.commit();
      }).then(function () {
        var ta = document.getElementById('bdReplyInput');
        if (ta) ta.value = '';
        _drafts['bdReplyInput'] = '';
      });
    });
  }

  function deleteReply(postId, replyId) {
    return guard('delreply:' + replyId, function () {
      return db().then(function (d) {
        var pref = postRef(d, postId);
        var b = d.batch();
        b.delete(pref.collection('replies').doc(replyId));
        b.update(pref, { replyCount: FV().increment(-1), lastReplyId: replyId });
        return b.commit();
      });
    });
  }

  // Deletes the post and every reply under it, in batches of 400.
  function deletePost(id) {
    return guard('delpost:' + id, function () {
      return db().then(function (d) {
        var pref = postRef(d, id);
        return pref.collection('replies').get().then(function (snap) {
          var docs = snap.docs, chain = Promise.resolve();
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
  }

  function viewHTML() {
    var u = user();
    var h = '';
    h += '<div class="chart-section bd-section">';
    h += '<div class="section-header"><h2 class="section-title">' + esc(tr('board_title')) + '</h2><div class="section-rule"></div></div>';
    h += '<div class="section-sub">' + esc(tr('board_sub')) + '</div>';
    h += '<div class="section-body">';

    // Account strip
    if (!u) {
      h += '<div class="bd-signin"><span>' + esc(tr('board_signin_note')) + '</span>' +
        '<button type="button" class="bd-btn bd-btn-primary" onclick="dcSignIn()">' + esc(tr('board_signin_btn')) + '</button></div>';
    }

    // Toolbar: category chips, then search / status / sort / new post
    h += '<div class="bd-toolbar">';
    h += '<div class="bd-chips" role="group" aria-label="' + esc(tr('board_filter_cat')) + '">';
    ['all'].concat(CATEGORIES).forEach(function (c) {
      var n = c === 'all' ? S.posts.length : S.posts.filter(function (p) { return p.category === c; }).length;
      h += '<button type="button" class="bd-chip' + (S.cat === c ? ' active' : '') + '" data-cat="' + c + '" aria-pressed="' + (S.cat === c) + '" onclick="dcBoard.setCat(\'' + c + '\')">' +
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
    h += '<div class="bd-seg" role="group" aria-label="' + esc(tr('board_sort')) + '">' +
      ['top', 'new', 'active'].map(function (s) {
        return '<button type="button" class="' + (S.sort === s ? 'active' : '') + '" aria-pressed="' + (S.sort === s) + '" onclick="dcBoard.setSort(\'' + s + '\')">' + esc(tr('board_sort_' + s)) + '</button>';
      }).join('') + '</div>';
    h += '<button type="button" class="bd-btn bd-btn-primary bd-new-btn" onclick="dcBoard.compose()">＋ ' + esc(tr('board_new')) + '</button>';
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
    h += '<textarea id="' + pre + 'Body" data-draft class="bd-input bd-textarea" maxlength="' + MAX_BODY + '" rows="5" placeholder="' + esc(tr('board_body_ph')) + '" aria-label="' + esc(tr('board_body_ph')) + '" oninput="dcBoard.count(this)">' + (post ? esc(post.body) : '') + '</textarea>';
    h += '<div class="bd-composer-foot"><span class="bd-note">' + (post ? '' : esc(tr('board_public_note'))) + '</span>' +
      '<span class="bd-count" data-for="' + pre + 'Body"></span>' +
      '<button type="button" class="bd-btn" onclick="dcBoard.cancelCompose(' + (post ? 'true' : 'false') + ')">' + esc(tr('board_cancel')) + '</button>' +
      '<button type="submit" class="bd-btn bd-btn-primary"' + (S.busy[post ? 'edit:' + post.id : 'create'] ? ' disabled' : '') + '>' + esc(post ? tr('board_save') : tr('board_post')) + '</button></div>';
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
      (p.pinned ? '<span class="bd-tag bd-tag-pin">📌 ' + esc(tr('board_pinned')) + '</span>' : '') +
      '<span class="bd-tag bd-tag-cat"><span class="bd-dot bd-cat-' + esc(p.category) + '"></span>' + esc(catLabel(p.category)) + '</span>' +
      (status !== 'open' ? '<span class="bd-tag bd-status bd-status-' + esc(status) + '">' + esc(statusLabel(status)) + '</span>' : '') +
      '</div>';
    if (S.editingId === p.id) {
      h += composerHTML(p);
    } else {
      h += '<button type="button" class="bd-post-title" aria-expanded="' + open + '" onclick="dcBoard.toggle(\'' + esc(p.id) + '\')">' + esc(p.title) + '</button>';
      if (open) h += '<div class="bd-post-body">' + richText(p.body || '') + '</div>';
      else if (p.body) h += '<div class="bd-post-snippet">' + esc(p.body.slice(0, 220)) + '</div>';
    }
    h += '<div class="bd-meta">' + avatar(p.authorPhoto, p.authorName) +
      '<span class="bd-author">' + esc(p.authorName || tr('board_anon')) + '</span>' +
      '<span class="bd-sep">·</span><span title="' + esc(new Date(toMs(p.createdAt)).toLocaleString()) + '">' + esc(ago(toMs(p.createdAt))) + '</span>' +
      (p.editedAt ? '<span class="bd-sep">·</span><span>' + esc(tr('board_edited')) + '</span>' : '') +
      '<span class="bd-sep">·</span><button type="button" class="bd-link" onclick="dcBoard.toggle(\'' + esc(p.id) + '\')">💬 ' +
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
      if (mine) h += '<button type="button" class="bd-btn bd-btn-sm" onclick="dcBoard.edit(\'' + esc(p.id) + '\')">✎ ' + esc(tr('board_edit')) + '</button>';
      h += '<button type="button" class="bd-btn bd-btn-sm" onclick="dcBoard.share(\'' + esc(p.id) + '\')">🔗 ' + esc(tr('board_copy_link')) + '</button>';
      if (S.isAdmin) {
        h += '<button type="button" class="bd-btn bd-btn-sm" onclick="dcBoard.pin(\'' + esc(p.id) + '\')">📌 ' + esc(tr(p.pinned ? 'board_unpin' : 'board_pin')) + '</button>';
        h += '<label class="bd-status-pick"><span>' + esc(tr('board_status_label')) + '</span><select class="bd-input bd-select" onchange="dcBoard.setPostStatus(\'' + esc(p.id) + '\', this.value)">' +
          STATUSES.map(function (s) { return '<option value="' + s + '"' + ((p.status || 'open') === s ? ' selected' : '') + '>' + esc(statusLabel(s)) + '</option>'; }).join('') +
          '</select></label>';
      }
      h += '<button type="button" class="bd-btn bd-btn-sm bd-btn-danger" onclick="dcBoard.askDeletePost(\'' + esc(p.id) + '\')">🗑 ' + esc(tr('board_delete')) + '</button>';
      h += '</div>';
    } else if (S.editingId !== p.id) {
      h += '<div class="bd-actions"><button type="button" class="bd-btn bd-btn-sm" onclick="dcBoard.share(\'' + esc(p.id) + '\')">🔗 ' + esc(tr('board_copy_link')) + '</button></div>';
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
          '</div><div class="bd-reply-body">' + richText(r.body || '') + '</div></li>';
      }).join('') + '</ul>';
    }
    if (u) {
      h += '<form class="bd-reply-form" onsubmit="dcBoard.reply(event,\'' + esc(p.id) + '\')">' +
        '<textarea id="bdReplyInput" data-draft class="bd-input bd-textarea" rows="3" maxlength="' + MAX_REPLY + '" placeholder="' + esc(tr('board_reply_ph')) + '" aria-label="' + esc(tr('board_reply_ph')) + '" oninput="dcBoard.count(this)" required></textarea>' +
        '<div class="bd-composer-foot"><span class="bd-note"></span><span class="bd-count" data-for="bdReplyInput"></span>' +
        '<button type="submit" class="bd-btn bd-btn-primary"' + (S.busy['reply:' + p.id] ? ' disabled' : '') + '>' + esc(tr('board_reply_btn')) + '</button></div></form>';
    } else {
      h += '<div class="bd-signin bd-signin-sm"><span>' + esc(tr('board_signin_reply')) + '</span>' +
        '<button type="button" class="bd-btn bd-btn-primary bd-btn-sm" onclick="dcSignIn()">' + esc(tr('board_signin_btn')) + '</button></div>';
    }
    h += '</div>';
    return h;
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
      '<div class="awards-picker-confirm-box" role="alertdialog" aria-modal="true" aria-labelledby="bdConfirmTitle" aria-describedby="bdConfirmText">' +
      '<div class="awards-picker-confirm-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg></div>' +
      '<div class="awards-picker-confirm-title" id="bdConfirmTitle">' + esc(title) + '</div>' +
      '<div class="awards-picker-confirm-text" id="bdConfirmText">' + esc(text) + '</div>' +
      '<div class="awards-picker-confirm-actions">' +
      '<button type="button" class="awards-picker-confirm-cancel">' + esc(tr('board_cancel')) + '</button>' +
      '<button type="button" class="awards-picker-confirm-ok">' + esc(okLabel) + '</button>' +
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

  // ── Open / close a post (and its #t=board/<id> link) ───────────────────────
  function setHash(id) {
    try { history.replaceState(null, '', '#t=board' + (id ? '/' + id : '')); } catch (e) {}
  }
  function openPost(id) {
    S.openId = id;
    if (S.editingId && S.editingId !== id) S.editingId = null;
    _drafts['bdReplyInput'] = '';
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
    // Redraw with the current data, e.g. after the language changes so the
    // labels and "3 days ago" dates switch over.
    rerender: function () { render(); },

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
      if (isEdit) { clearForm('bdEdit'); S.editingId = null; }
      else { clearForm('bdNew'); S.composing = false; }
      render();
    },
    submit: function (e, editId) {
      e.preventDefault();
      var pre = editId ? 'bdEdit' : 'bdNew';
      var f = readForm(pre);
      if (f.title.length < MIN_TITLE) { toast(tr('board_err_title')); return; }
      if (f.body.length > MAX_BODY) return;
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
      if (!body) return;
      addReply(id, body);
    },
    edit: function (id) { S.editingId = id; clearForm('bdEdit'); render(); },
    pin: function (id) { var p = findPost(id); if (p) adminSet(id, { pinned: !p.pinned }); },
    setPostStatus: function (id, s) { if (STATUSES.indexOf(s) >= 0) adminSet(id, { status: s }); },
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
