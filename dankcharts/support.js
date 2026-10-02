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

  var CSS = '' +
    '.dc-sup-overlay{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}' +
    '.dc-sup-overlay.open{display:flex}' +
    '.dc-sup-box{position:relative;width:100%;max-width:440px;max-height:calc(100vh - 32px);overflow:auto;box-sizing:border-box;padding:24px;border-radius:16px;' +
      'background:var(--bg2,#141c2b);color:var(--text,#fff);border:1px solid var(--border,rgba(255,255,255,.12));box-shadow:0 20px 60px rgba(0,0,0,.45);font-family:var(--font-sans,system-ui,sans-serif)}' +
    '.dc-sup-box h2{margin:0 0 6px;font-family:var(--font-display,inherit);font-size:1.3rem}' +
    '.dc-sup-intro{margin:0 0 16px;color:var(--text2,rgba(255,255,255,.7));font-size:.9rem;line-height:1.45}' +
    '.dc-sup-close{position:absolute;top:10px;right:12px;width:32px;height:32px;border:0;border-radius:8px;background:transparent;color:var(--text2,rgba(255,255,255,.7));font-size:1.2rem;cursor:pointer}' +
    '.dc-sup-close:hover{background:var(--bg3,rgba(255,255,255,.08))}' +
    '.dc-sup-box label{display:block;margin:0 0 4px;font-size:.8rem;font-weight:600;color:var(--text2,rgba(255,255,255,.7))}' +
    '.dc-sup-box input,.dc-sup-box textarea{display:block;width:100%;box-sizing:border-box;margin:0 0 14px;padding:10px 12px;border-radius:10px;font:inherit;font-size:.95rem;' +
      'background:var(--bg3,rgba(255,255,255,.06));color:var(--text,#fff);border:1px solid var(--border,rgba(255,255,255,.15))}' +
    '.dc-sup-box textarea{min-height:140px;resize:vertical}' +
    '.dc-sup-box input:focus,.dc-sup-box textarea:focus{outline:2px solid var(--accent,#58aaf6);outline-offset:1px}' +
    // Honeypot: real people never see or fill it, bots usually do.
    '.dc-sup-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}' +
    '.dc-sup-send{width:100%;padding:11px 16px;border:0;border-radius:10px;font:inherit;font-weight:700;cursor:pointer;' +
      'background:var(--accent,#58aaf6);color:var(--on-accent,var(--btn-ink,#fff))}' +
    '.dc-sup-send[disabled]{opacity:.6;cursor:default}' +
    '.dc-sup-status{margin:12px 0 0;font-size:.88rem;line-height:1.45;min-height:1em}' +
    '.dc-sup-status.err{color:var(--rose,#f87171)}' +
    '.dc-sup-done{text-align:center;padding:12px 0 4px}' +
    '.dc-sup-done p{color:var(--text2,rgba(255,255,255,.7));line-height:1.45}' +
    '.dc-sup-box a{color:var(--accent,#58aaf6)}';

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
      '<form class="dc-sup-box" novalidate>' +
        '<button type="button" class="dc-sup-close" aria-label="' + esc(tr('sup_close', 'Close')) + '">✕</button>' +
        '<h2 id="dcSupTitle">' + esc(tr('sup_title', 'Contact Support')) + '</h2>' +
        '<p class="dc-sup-intro">' + esc(tr('sup_intro', 'Found a bug, have a question or an idea? Send it here and we will reply by email.')) + '</p>' +
        '<label for="dcSupEmail">' + esc(tr('sup_email', 'Your email')) + '</label>' +
        '<input id="dcSupEmail" type="email" name="email" autocomplete="email" required value="' + esc(user && user.email ? user.email : '') + '">' +
        '<label for="dcSupMsg">' + esc(tr('sup_message', 'Message')) + '</label>' +
        '<textarea id="dcSupMsg" name="message" required maxlength="5000"></textarea>' +
        '<div class="dc-sup-hp" aria-hidden="true"><input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off"></div>' +
        '<button type="submit" class="dc-sup-send">' + esc(tr('sup_send', 'Send message')) + '</button>' +
        '<p class="dc-sup-status" role="status"></p>' +
      '</form>';

    var form = overlay.querySelector('form');
    form.querySelector('.dc-sup-close').addEventListener('click', closeSupport);
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
          '<button type="button" class="dc-sup-close" aria-label="' + esc(tr('sup_close', 'Close')) + '">✕</button>' +
          '<div class="dc-sup-done">' +
            '<h2 id="dcSupTitle">' + esc(tr('sup_sent_title', 'Message sent')) + '</h2>' +
            '<p>' + esc(tr('sup_sent_text', 'Thanks! We will reply to {{email}} as soon as we can.').replace('{{email}}', email)) + '</p>' +
            '<button type="button" class="dc-sup-send">' + esc(tr('sup_close', 'Close')) + '</button>' +
          '</div>';
        overlay.querySelectorAll('.dc-sup-close, .dc-sup-done .dc-sup-send').forEach(function (b) {
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
