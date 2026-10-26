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
    if (box) addGrip(box);

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
    var all = document.querySelectorAll(OVERLAYS);
    for (var j = 0; j < all.length; j++) {
      var o = all[j];
      if (o.classList.contains('dc-pop-ghost')) continue;
      if (isOpen(o)) onOpen(o);
    }
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
