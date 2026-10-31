/* ===========================================================================
   CONTACT SUPPORT - OUR OWN FORM, DELIVERED BY WEB3FORMS
   ===========================================================================
   Replaces the Zoho Desk chat widget, which stopped working on the free plan.

   Every "Contact Support" button calls openSupport(). That opens a small form
   (email + message) built by this file, and on send the message is POSTed to
   Web3Forms, which emails it to the inbox the access key belongs to. The
   sender's address goes in the `email` field, which Web3Forms uses as the
   Reply-To, so answering is just hitting Reply in Gmail.

   This file is loaded by both index.html and setup-guide.html. The setup guide
   does not load style.css, so the form's CSS is injected from here and only
   uses theme tokens both pages declare, each with a fallback.

   The access key is meant to be public - it can only send mail to its own
   inbox, never read it - so it is fine in client code.
   =========================================================================== */

(function () {
  // Web3Forms access key (web3forms.com dashboard → your form → Access Key).
  var WEB3FORMS_KEY = '8a89aa81-9535-4934-92e0-e60c31a6fafe';
  var ENDPOINT = 'https://api.web3forms.com/submit';
  // Shown in the form and used as the fallback when sending fails.
  var SUPPORT_EMAIL = 'support@dankcharts.fm';

  // translations.js's t() is on both pages; fall back to English if it is not.
  function tr(key, fallback) {
    try {
      if (typeof t === 'function') { var s = t(key); if (s && s !== key) return s; }
    } catch (e) {}
    return fallback;
  }

  // firebase.js keeps the signed-in user in a top-level `let`, which other
  // scripts can read but is not on window. Only index.html loads it.
  function signedInUser() {
    try { if (typeof _currentUser !== 'undefined' && _currentUser) return _currentUser; } catch (e) {}
    return null;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Same layout as the site's shared window frame (phase 10 step 2): icon
  // tile, title and ✕ on top, the fields in the middle, Cancel left and Send
  // right at the bottom. Written out here because the setup guide loads this
  // file without style.css. On a phone (style.css's pop-up engine) the box
  // becomes a bottom sheet.
  var MAIL = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';
  var XICO = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var CSS = '' +
    '.dc-sup-overlay{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:16px;background:var(--scrim,rgba(0,0,0,.55));backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}' +
    '.dc-sup-overlay.open{display:flex}' +
    '.dc-sup-box{position:relative;display:flex;flex-direction:column;width:100%;max-width:460px;max-height:calc(100vh - 32px);overflow:hidden;box-sizing:border-box;padding:0;border-radius:16px;' +
      'background:var(--bg2,#141c2b);color:var(--text,#fff);border:1px solid var(--border2,rgba(255,255,255,.14));box-shadow:0 24px 64px rgba(0,0,0,.45);font-family:var(--font-sans,system-ui,sans-serif)}' +
    '.dc-sup-head{display:flex;gap:12px;align-items:flex-start;padding:20px 20px 14px}' +
    // the "Message sent" screen: no gap under the head, a plain full-width Close
    '.dc-sup-head--done{padding-bottom:0}.dc-sup-spacer{flex:1}' +
    '.dc-sup-foot--plain{border-top:0;background:none}.dc-sup-done-btn{flex:1}' +
    '.dc-sup-ico{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;color:var(--accent,#58aaf6);background:color-mix(in srgb,var(--accent,#58aaf6) 14%,transparent)}' +
    '.dc-sup-titles{flex:1;min-width:0}' +
    '.dc-sup-box h2{margin:1px 0 0;font-size:1.1rem;font-weight:700;line-height:1.25}' +
    '.dc-sup-intro{margin:3px 0 0;color:var(--text3,rgba(255,255,255,.6));font-size:.875rem;line-height:1.45}' +
    '.dc-sup-close{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;margin:-4px -6px 0 0;border:0;border-radius:6px;background:transparent;color:var(--text2,rgba(255,255,255,.7));cursor:pointer}' +
    '.dc-sup-close:hover{background:var(--bg3,rgba(255,255,255,.08));color:var(--text,#fff)}' +
    '.dc-sup-body{flex:1;min-height:0;overflow-y:auto;padding:0 20px 18px}' +
    '.dc-sup-box label{display:block;margin:0 0 6px;font-size:.75rem;font-weight:600;color:var(--text2,rgba(255,255,255,.7))}' +
    '.dc-sup-box input,.dc-sup-box textarea{display:block;width:100%;box-sizing:border-box;margin:0 0 16px;padding:9px 12px;border-radius:6px;font:inherit;font-size:.9rem;' +
      'background:var(--bg3,rgba(255,255,255,.06));color:var(--text,#fff);border:1px solid var(--border,rgba(255,255,255,.15));transition:border-color .15s,box-shadow .15s}' +
    '.dc-sup-box textarea{min-height:150px;resize:vertical;line-height:1.5;margin-bottom:0}' +
    '.dc-sup-box input:focus,.dc-sup-box textarea:focus{outline:none;border-color:var(--accent,#58aaf6);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent,#58aaf6) 22%,transparent)}' +
    '.dc-sup-count{margin:6px 0 0;text-align:right;font-size:.72rem;color:var(--text3,rgba(255,255,255,.5))}' +
    // Honeypot: real people never see or fill it, bots usually do.
    '.dc-sup-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}' +
    '.dc-sup-foot{display:flex;gap:8px;align-items:center;justify-content:flex-end;padding:12px 20px;border-top:1px solid var(--border,rgba(255,255,255,.12));background:color-mix(in srgb,var(--bg3,#1b2435) 55%,transparent)}' +
    '.dc-sup-foot .dc-sup-cancel{margin-right:auto}' +
    '.dc-sup-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:36px;padding:0 16px;border:1px solid transparent;border-radius:6px;font:inherit;font-size:.875rem;font-weight:500;cursor:pointer;background:transparent;color:var(--text2,rgba(255,255,255,.75))}' +
    '.dc-sup-btn:hover{background:var(--bg3,rgba(255,255,255,.08));color:var(--text,#fff)}' +
    '.dc-sup-send{font-weight:700;background:var(--accent,#58aaf6);color:var(--on-accent,var(--btn-ink,#fff))}' +
    '.dc-sup-send:hover{background:var(--accent,#58aaf6);color:var(--on-accent,#fff);filter:brightness(1.12)}' +
    '.dc-sup-send[disabled]{opacity:.6;cursor:default;filter:none}' +
    '.dc-sup-status{margin:12px 0 0;font-size:.85rem;line-height:1.45}' +
    '.dc-sup-status:empty{display:none}' +
    '.dc-sup-status.err{color:var(--rose,#f87171)}' +
    '.dc-sup-done{display:flex;flex-direction:column;align-items:center;text-align:center;padding:12px 24px 8px}' +
    '.dc-sup-done-ico{display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;margin-bottom:12px;color:var(--green,#34d399);background:color-mix(in srgb,var(--green,#34d399) 14%,transparent)}' +
    '.dc-sup-done p{margin:6px 0 0;color:var(--text2,rgba(255,255,255,.7));line-height:1.5;font-size:.9rem}' +
    '.dc-sup-box a{color:var(--accent,#58aaf6)}' +
    '@media (max-width:640px){.dc-sup-foot .dc-sup-btn{height:40px}.dc-sup-foot .dc-sup-send{flex:1}}';

  var overlay = null;

  function build() {
    var style = document.createElement('style');
    style.id = 'dcSupportStyles';
    style.textContent = CSS;
    document.head.appendChild(style);

    overlay = document.createElement('div');
    overlay.className = 'dc-sup-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'dcSupTitle');
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSupport(); });
    document.body.appendChild(overlay);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeSupport();
    });
  }

  // Rendered fresh on every open so the text follows the current language and
  // a previous "sent" screen does not stick around.
  function renderForm() {
    var user = signedInUser();
    overlay.innerHTML =
      '<form class="dc-sup-box dc-modal" novalidate>' +
        '<div class="dc-sup-head">' +
          '<span class="dc-sup-ico">' + MAIL + '</span>' +
          '<div class="dc-sup-titles">' +
            '<h2 id="dcSupTitle">' + esc(tr('sup_title', 'Contact Support')) + '</h2>' +
            '<p class="dc-sup-intro">' + esc(tr('sup_intro', 'Found a bug, have a question or an idea? Send it here and we will reply by email.')) + '</p>' +
          '</div>' +
          '<button type="button" class="dc-sup-close" aria-label="' + esc(tr('sup_close', 'Close')) + '">' + XICO + '</button>' +
        '</div>' +
        '<div class="dc-sup-body">' +
          '<label for="dcSupEmail">' + esc(tr('sup_email', 'Your email')) + '</label>' +
          '<input id="dcSupEmail" type="email" name="email" autocomplete="email" required value="' + esc(user && user.email ? user.email : '') + '">' +
          '<label for="dcSupMsg">' + esc(tr('sup_message', 'Message')) + '</label>' +
          '<textarea id="dcSupMsg" name="message" required maxlength="5000"></textarea>' +
          // how much room is left, so a long report never hits the limit unseen
          '<p class="dc-sup-count" aria-hidden="true">0 / ' + (5000).toLocaleString() + '</p>' +
          '<div class="dc-sup-hp" aria-hidden="true"><input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off"></div>' +
          '<p class="dc-sup-status" role="status"></p>' +
        '</div>' +
        '<div class="dc-sup-foot">' +
          '<button type="button" class="dc-sup-btn dc-sup-cancel">' + esc(tr('btn_cancel', 'Cancel')) + '</button>' +
          '<button type="submit" class="dc-sup-btn dc-sup-send">' + esc(tr('sup_send', 'Send message')) + '</button>' +
        '</div>' +
      '</form>';

    var form = overlay.querySelector('form');
    form.querySelector('.dc-sup-close').addEventListener('click', closeSupport);
    form.querySelector('.dc-sup-cancel').addEventListener('click', closeSupport);
    var msg = form.querySelector('#dcSupMsg'), count = form.querySelector('.dc-sup-count');
    msg.addEventListener('input', function () { count.textContent = msg.value.length.toLocaleString() + ' / ' + (5000).toLocaleString(); });
    form.addEventListener('submit', function (e) { e.preventDefault(); send(form); });
  }

  function setStatus(form, msg, isErr) {
    var el = form.querySelector('.dc-sup-status');
    el.className = 'dc-sup-status' + (isErr ? ' err' : '');
    el.innerHTML = msg;
  }

  function send(form) {
    var email = form.email.value.trim();
    var message = form.message.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus(form, esc(tr('sup_err_email', 'Please enter a valid email so we can reply.')), true);
      form.email.focus();
      return;
    }
    if (!message) {
      setStatus(form, esc(tr('sup_err_message', 'Please write a message.')), true);
      form.message.focus();
      return;
    }

    // Extra context so a bug report is useful without a back-and-forth.
    var user = signedInUser();
    var lang = (typeof currentLang !== 'undefined') ? currentLang : (document.documentElement.lang || '');
    var payload = {
      access_key: WEB3FORMS_KEY,
      subject: 'dankcharts.fm support: ' + message.replace(/\s+/g, ' ').slice(0, 60),
      from_name: 'dankcharts.fm',
      email: email,
      message: message,
      page: location.href,
      language: lang,
      account: user ? ((user.displayName || '') + ' <' + (user.email || '') + '> uid ' + user.uid) : 'not signed in',
      browser: navigator.userAgent,
      botcheck: form.botcheck.checked
    };

    var btn = form.querySelector('.dc-sup-send');
    btn.disabled = true;
    btn.textContent = tr('sup_sending', 'Sending…');
    setStatus(form, '', false);

    // Sent as FormData, not JSON: a JSON body with custom headers makes the
    // browser send a CORS preflight first, and Web3Forms' API rejected that.
    // FormData is a "simple" request with no preflight.
    var body = new FormData();
    Object.keys(payload).forEach(function (k) {
      // botcheck must be absent unless ticked - any value counts as a bot.
      if (k === 'botcheck' && !payload[k]) return;
      body.append(k, payload[k]);
    });

    fetch(ENDPOINT, { method: 'POST', body: body })
      .then(function (r) { return r.json().catch(function () { return { success: false }; }); })
      .then(function (res) {
        if (!res || !res.success) throw new Error(res && res.message || 'send failed');
        overlay.querySelector('.dc-sup-box').innerHTML =
          '<div class="dc-sup-head dc-sup-head--done"><span class="dc-sup-spacer"></span>' +
            '<button type="button" class="dc-sup-close" aria-label="' + esc(tr('sup_close', 'Close')) + '">' + XICO + '</button></div>' +
          '<div class="dc-sup-done">' +
            '<span class="dc-sup-done-ico">' + CHECK + '</span>' +
            '<h2 id="dcSupTitle">' + esc(tr('sup_sent_title', 'Message sent')) + '</h2>' +
            '<p>' + esc(tr('sup_sent_text', 'Thanks! We will reply to {{email}} as soon as we can.').replace('{{email}}', email)) + '</p>' +
          '</div>' +
          '<div class="dc-sup-foot dc-sup-foot--plain">' +
            '<button type="button" class="dc-sup-btn dc-sup-send dc-sup-done-btn">' + esc(tr('sup_close', 'Close')) + '</button>' +
          '</div>';
        overlay.querySelectorAll('.dc-sup-close, .dc-sup-done-btn').forEach(function (b) {
          b.addEventListener('click', closeSupport);
        });
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = tr('sup_send', 'Send message');
        // The typed message stays in the box, so nothing is lost.
        setStatus(form,
          esc(tr('sup_err_send', 'Sending failed. Please try again, or email us at')) +
          ' <a href="mailto:' + SUPPORT_EMAIL + '">' + SUPPORT_EMAIL + '</a>.', true);
      });
  }

  function openSupport() {
    if (!overlay) build();
    renderForm();
    overlay.classList.add('open');
    var first = overlay.querySelector(signedInUser() ? '#dcSupMsg' : '#dcSupEmail');
    if (first) setTimeout(function () { first.focus(); }, 30);
  }

  function closeSupport() {
    if (overlay) overlay.classList.remove('open');
  }

  window.openSupport = openSupport;
  window.closeSupport = closeSupport;
})();
