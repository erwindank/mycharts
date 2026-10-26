/* ═══════════════════════════════════════════════════════════════════════
   POP-UP ENGINE — redesign phase 10 step 1
   The site has about 40 pop-up windows, opened four different ways: an
   overlay that gets the class "open" (.modal-overlay, .ig-modal-overlay,
   Contact Support), or an overlay built in JS and removed on close (image
   picker, awards picker, the warning windows). Rather than rewrite every
   open/close function, this file watches the page: whenever any pop-up
   opens or closes it adds the shared behaviour —
     • one backdrop and a centred box (CSS: .dc-pop),
     • a short fade-and-rise in and a quicker fade out (none with reduced
       motion), also when the closing code removes the window outright,
     • the page behind stops scrolling,
     • focus moves into the window, Tab stays inside, and focus goes back
       to the button that opened it,
     • Esc closes only the window on top,
     • a window opened from another always sits above it,
     • on a phone (≤640px) the box is a bottom sheet with a grab handle:
       drag it down to close.
   Each window still closes through its own code: Esc and the drag press
   its ✕ (or click its backdrop), so whatever that code saves still runs.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Every kind of pop-up backdrop. The awards ceremony is left out on
  // purpose: it is a full-screen stage with its own keys and motion.
  var OVERLAYS = '.modal-overlay, .ig-modal-overlay, .imgpk-overlay, .dc-sup-overlay, ' +
    '.awards-picker-overlay, .awards-picker-confirm';
  // These are open while they have the class "open"; the rest while they
  // are on the page at all
  var CLASS_OPEN = '.modal-overlay, .ig-modal-overlay, .dc-sup-overlay';
  // What counts as the window's own close button (pressed by Esc / drag)
  var CLOSE_BTN = '.dc-modal-close, .dc-sup-close, .imgpk-close, .awards-picker-confirm-cancel, ' +
    '.awards-picker-close, [data-pop-close]';
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /* ── Line icons for the windows (phase 10 step 2) ────────────────────────
     One set, drawn on a 24px grid with a 1.8 stroke, so every window's icons
     match. dcIco('name') returns the <svg>; in HTML, an empty
     <span data-ico="name"></span> is filled in when its window opens. */
  var ICONS = {
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    wand: '<path d="m4 20 11-11"/><path d="m13 7 2 2"/><path d="M17 3v3M15.5 4.5h3M20 9v2M19 10h2M9 4v2M8 5h2"/>',
    stack: '<path d="M12 3 3 8l9 5 9-5z"/><path d="m3 13 9 5 9-5"/>',
    tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M8 12h8"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    listmusic: '<path d="M3 6h12M3 12h12M3 18h7"/><path d="M17 18V8l4-1"/><circle cx="15" cy="18" r="2"/>',
    file: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    printer: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    share: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    upload: '<path d="M12 21V9M7 14l5-5 5 5M5 3h14"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    external: '<path d="M14 4h6v6M20 4 10 14"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3l-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/>',
    play: '<path d="M7 4.5v15L19.5 12z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M8 5v14M16 5v14" stroke-width="3"/>',
    back: '<path d="M15 18 9 12l6-6"/>',
    next: '<path d="m9 18 6-6-6-6"/>',
    more: '<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    note: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8"/>',
    disc: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/>',
    bars: '<path d="M5 20V11M12 20V4M19 20v-6"/>',
    trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flame: '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 2-5 5-5 8a7 7 0 0 0 7 7z"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3a3 3 0 0 1-3 4M7 5H4a3 3 0 0 0 3 4"/>',
    medal: '<circle cx="12" cy="15" r="6"/><path d="M8.5 10 6 3h4l2 4 2-4h4l-2.5 7"/>',
    headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    sparkle: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    refresh: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    video: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    palette: '<path d="M12 3a9 9 0 0 0 0 18c1 0 1.5-.8 1.5-1.5 0-1.2-1-1.5-1-2.5s.8-1.5 2-1.5H17a4 4 0 0 0 4-4c0-4.7-4-8.5-9-8.5z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="10" cy="7" r="1.2" fill="currentColor"/><circle cx="15" cy="7.5" r="1.2" fill="currentColor"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6z"/>',
    cloud: '<path d="M7 18a5 5 0 0 1-.7-9.9A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
  };
  function dcIco(name, cls) {
    return '<svg class="' + (cls || 'dc-ico') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>';
  }
  window.dcIco = dcIco;
  function fillIcons(root) {
    var spots = (root || document).querySelectorAll('[data-ico]');
    for (var i = 0; i < spots.length; i++) {
      if (!spots[i].firstElementChild) spots[i].innerHTML = dcIco(spots[i].getAttribute('data-ico'));
    }
  }
  window.dcFillIcons = fillIcons;

  var stack = [];          // open overlays, oldest first
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)');
  var phone = window.matchMedia && matchMedia('(max-width: 640px)');

  function noMotion() { return !!(reduced && reduced.matches); }

  function isOpen(o) {
    if (!o.isConnected) return false;
    if (o.matches(CLASS_OPEN)) return o.classList.contains('open');
    return getComputedStyle(o).display !== 'none';
  }

  // The window itself inside an overlay
  function boxOf(o) {
    for (var i = 0; i < o.children.length; i++) {
      var c = o.children[i];
      if (c.classList.contains('dc-modal') || c.classList.contains('dc-sup-box')) return c;
    }
    return o.querySelector('.dc-modal, .dc-sup-box') || o.firstElementChild;
  }

  // An overlay nested inside another (the "remove all?" warning sits inside
  // the awards picker's layer) shares its parent's stacking, so it is not
  // given its own z-index
  function isNested(o) {
    var p = o.parentElement;
    return !!(p && p.closest(OVERLAYS));
  }

  /* ── Opening ─────────────────────────────────────────────────────────── */
  function onOpen(o) {
    if (stack.indexOf(o) !== -1) return;
    o.classList.remove('dc-pop-out');
    o.classList.add('dc-pop');
    var box = boxOf(o);
    if (box) box.classList.add('dc-pop-box');

    // Above whatever is already open, whatever the source order says
    if (!isNested(o)) {
      var below = 0;
      stack.forEach(function (s) { if (!isNested(s)) below = Math.max(below, parseInt(getComputedStyle(s).zIndex, 10) || 0); });
      var own = parseInt(getComputedStyle(o).zIndex, 10) || 0;
      if (below && own <= below) o.style.zIndex = String(below + 2);
    }

    // Remember who opened it, unless focus is already inside (a warning
    // window that focused its own Cancel did this itself)
    if (!o.contains(document.activeElement)) o._dcReturn = document.activeElement;
    stack.push(o);
    lockScroll();
    if (box) {
      addGrip(box);
      fillIcons(box);
      // Every ✕ drawn as the same line icon (they were a mix of ✕ and ×)
      var xs = box.querySelectorAll(CLOSE_BTN);
      for (var x = 0; x < xs.length; x++) {
        var tx = xs[x].textContent.trim();
        if (tx === '✕' || tx === '×' || tx === '✖') xs[x].innerHTML = dcIco('x');
      }
    }

    if (!noMotion()) {
      o.classList.add('dc-pop-in');
      setTimeout(function () { o.classList.remove('dc-pop-in'); }, 400);
    }

    // Move focus in after the window has drawn (its open code may still be
    // filling it, and may focus a field itself)
    requestAnimationFrame(function () {
      if (!isOpen(o) || o.contains(document.activeElement)) return;
      var target = box || o;
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      try { target.focus({ preventScroll: true }); } catch (e) {}
    });
  }

  /* ── Closing ─────────────────────────────────────────────────────────── */
  function onClose(o) {
    var i = stack.indexOf(o);
    if (i === -1) return;
    stack.splice(i, 1);
    o.classList.remove('dc-pop-in');
    o.style.zIndex = '';
    var box = boxOf(o);
    if (box) box.style.transform = '';

    // Hand focus back to the button that opened it, if nothing else took it
    var back = o._dcReturn;
    o._dcReturn = null;
    if (back && back.isConnected && (!document.activeElement || document.activeElement === document.body || o.contains(document.activeElement) || !document.activeElement.isConnected)) {
      try { back.focus({ preventScroll: true }); } catch (e) {}
    }
    if (!stack.length) unlockScroll();

    // Fade out. An overlay that lost "open" is kept visible by .dc-pop-out
    // for the length of the animation; one that was removed is put back,
    // frozen, just long enough to fade.
    // .dc-pop itself comes off afterwards: it forces the overlay visible.
    if (noMotion() || o._dcDragged) { o._dcDragged = false; o.classList.remove('dc-pop'); return; }
    if (o.isConnected) {
      o.classList.add('dc-pop-out');
      setTimeout(function () {
        o.classList.remove('dc-pop-out');
        if (stack.indexOf(o) === -1) o.classList.remove('dc-pop');   // not reopened meanwhile
      }, 170);
    } else {
      var root = o;
      while (root.parentNode && root.parentNode.nodeType === 1) root = root.parentNode;
      if (root.parentNode) return;            // still attached somewhere odd: skip
      root.setAttribute('inert', '');
      root.setAttribute('aria-hidden', 'true');
      root.style.pointerEvents = 'none';
      o.classList.add('dc-pop-out', 'dc-pop-ghost');
      document.body.appendChild(root);
      setTimeout(function () { root.remove(); }, 170);
    }
  }

  /* ── Scroll lock ─────────────────────────────────────────────────────── */
  function lockScroll() {
    var html = document.documentElement;
    if (html.classList.contains('dc-pop-lock')) return;
    // Keep the page from jumping sideways when its scrollbar goes away
    var gap = window.innerWidth - html.clientWidth;
    if (gap > 0) document.body.style.paddingRight = gap + 'px';
    html.classList.add('dc-pop-lock');
  }
  function unlockScroll() {
    document.documentElement.classList.remove('dc-pop-lock');
    document.body.style.paddingRight = '';
  }

  /* ── Closing through the window's own code ───────────────────────────── */
  function closeTop() {
    var o = stack[stack.length - 1];
    if (!o) return;
    requestClose(o);
  }
  function requestClose(o) {
    var box = boxOf(o) || o;
    // Its own ✕ / Cancel, but not one belonging to a window nested inside it
    var btns = box.querySelectorAll(CLOSE_BTN), btn = null;
    for (var i = 0; i < btns.length; i++) {
      var owner = btns[i].closest(OVERLAYS);
      if (owner === o && btns[i].offsetParent !== null) { btn = btns[i]; break; }
    }
    if (btn) { btn.click(); }
    else {
      // A click on the backdrop itself: what most windows close on
      o.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
    // Last resort for a window with neither
    if (isOpen(o) && o.matches(CLASS_OPEN)) o.classList.remove('open');
  }
  window.dcPopClose = requestClose;

  /* ── Keyboard: Esc and Tab ───────────────────────────────────────────── */
  window.addEventListener('keydown', function (e) {
    var o = stack[stack.length - 1];
    if (!o) return;
    if (e.key === 'Escape') {
      // A menu or picker open inside the window closes first, by its own code
      if (o.querySelector('[aria-expanded="true"]') || document.getElementById('awardsYearPicker')) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      closeTop();
      return;
    }
    if (e.key === 'Tab') {
      var box = boxOf(o) || o;
      var items = Array.prototype.filter.call(box.querySelectorAll(FOCUSABLE), function (el) {
        return el.offsetParent !== null && !el.closest('[inert]');
      });
      if (!items.length) { e.preventDefault(); return; }
      var first = items[0], last = items[items.length - 1];
      var inside = box.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !inside)) { e.preventDefault(); first.focus(); }
    }
  }, true);

  /* ── Bottom sheet: grab handle and drag down to close ────────────────── */
  function addGrip(box) {
    if (box.querySelector(':scope > .dc-sheet-grip')) return;
    var g = document.createElement('div');
    g.className = 'dc-sheet-grip';
    g.setAttribute('aria-hidden', 'true');
    box.insertBefore(g, box.firstChild);
  }

  var drag = null;
  document.addEventListener('pointerdown', function (e) {
    if (!phone || !phone.matches || e.button > 0) return;
    var o = stack[stack.length - 1];
    if (!o) return;
    var box = boxOf(o);
    if (!box || !box.contains(e.target)) return;
    // Only from the handle or the top strip of the sheet, never from a
    // control, and only when the sheet is scrolled to its top
    var fromGrip = e.target.classList.contains('dc-sheet-grip');
    var top = box.getBoundingClientRect().top;
    if (!fromGrip) {
      if (e.clientY - top > 64) return;
      if (e.target.closest('button, a, input, select, textarea, label, [role="tab"], [contenteditable]')) return;
      if (box.scrollTop > 0) return;
    }
    drag = { o: o, box: box, y0: e.clientY, t0: performance.now(), dy: 0, id: e.pointerId };
    box.style.transition = 'none';
  }, true);

  document.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dy = Math.max(0, e.clientY - drag.y0);
    // A little resistance so it feels attached to the finger
    drag.box.style.transform = drag.dy ? 'translateY(' + drag.dy + 'px)' : '';
    if (drag.dy > 4) e.preventDefault();
  }, { capture: true, passive: false });

  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    var d = drag; drag = null;
    var h = d.box.offsetHeight || 1;
    var speed = d.dy / Math.max(1, performance.now() - d.t0);   // px per ms
    d.box.style.transition = '';
    if (d.dy > Math.min(140, h * 0.3) || (d.dy > 30 && speed > 0.6)) {
      // Finish the slide down, then close through the window's own code
      d.box.style.transition = 'transform 0.18s ease-in';
      d.box.style.transform = 'translateY(' + h + 'px)';
      setTimeout(function () {
        d.o._dcDragged = true;
        requestClose(d.o);
        d.box.style.transition = '';
        d.box.style.transform = '';
      }, 170);
    } else {
      d.box.style.transition = 'transform 0.2s var(--ease)';
      d.box.style.transform = '';
      setTimeout(function () { d.box.style.transition = ''; }, 220);
    }
  }
  document.addEventListener('pointerup', endDrag, true);
  document.addEventListener('pointercancel', endDrag, true);

  /* ── Watching the page ───────────────────────────────────────────────── */
  function sweep() {
    // closed ones first, newest first, so focus goes back in order
    for (var i = stack.length - 1; i >= 0; i--) if (!isOpen(stack[i])) onClose(stack[i]);
    var all = document.querySelectorAll(OVERLAYS), fresh = [];
    for (var j = 0; j < all.length; j++) {
      var o = all[j];
      if (o.classList.contains('dc-pop-ghost') || stack.indexOf(o) !== -1) continue;
      if (isOpen(o)) fresh.push(o);
    }
    // Several opened at once (Settings and a list it opens, in one click):
    // the ones marked to sit on top of their caller go last, so they stack
    // above it whatever the page order
    var onTop = function (o) { return o.classList.contains('modal-overlay--stacked') || o.classList.contains('modal-on-top') ? 1 : 0; };
    fresh.sort(function (a, b) { return onTop(a) - onTop(b); });
    fresh.forEach(onOpen);
  }

  var queued = false;
  var mo = new MutationObserver(function (records) {
    // Cheap filter: only class changes on an overlay, or nodes added /
    // removed that are (or hold) an overlay, are worth a sweep
    var hit = false;
    for (var i = 0; i < records.length && !hit; i++) {
      var r = records[i];
      if (r.type === 'attributes') { if (r.target.matches && r.target.matches(OVERLAYS)) hit = true; continue; }
      var lists = [r.addedNodes, r.removedNodes];
      for (var k = 0; k < 2 && !hit; k++) {
        for (var n = 0; n < lists[k].length; n++) {
          var node = lists[k][n];
          if (node.nodeType !== 1 || node.classList.contains('dc-pop-ghost')) continue;
          if (node.matches(OVERLAYS) || node.querySelector(OVERLAYS)) { hit = true; break; }
        }
      }
    }
    if (!hit) return;
    // Sweep right away (before paint) so the fade-out copy appears in the
    // same frame the window vanished
    if (!queued) { queued = true; Promise.resolve().then(function () { queued = false; sweep(); }); }
  });

  function start() {
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    sweep();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
