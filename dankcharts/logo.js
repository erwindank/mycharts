/* ─── dankcharts LOGO MARK (2026-11-07) ──────────────────────────────────
   The logo drawn in code, traced from the brand image: three rings around
   one centre (244,341) that run up into bars on the right — the bowl of a
   "d" plus rising chart bars. Everything that shows the logo builds it here:

     dcLogoSvg(opts)      → <svg> markup string
       opts.small   true = the small-size drawing (fewer, longer pieces, a
                    thicker line, same outline) for anything under ~40px
       opts.mono    a colour = one-colour version (share images, print)
       opts.cls     extra classes on the <svg>
       opts.size    sets width/height attributes (needed inside images)
     dcLogoSpinner(px)    → small logo whose pieces light up in a loop,
                    used instead of a plain spinner while something loads

   The landing page, top bar and sync toast in index.html carry a copy of
   this markup written out by hand-run node (so it shows before scripts
   load). If you change the drawing here, regenerate those copies:
     node -e "global.window={};require('./logo.js');console.log(window.dcLogoSvg({cls:'dc-logo landing-logo'}))"
   Colours: each piece has a k-<name> class so light themes can deepen the
   pale ones (style.css, "LOGO MARK"). --i = order pieces redraw in on
   hover, --b = which bar (equalizer bounce), --c = colour (glow). */
(function () {
  var CX = 244, CY = 341;

  // Full drawing. Order = redraw order: inner ring → middle → outer → bars.
  var FULL = [
    { k: 'purple',  c: '#643992', r: 72,    a: [150, 295] },
    { k: 'red',     c: '#d8323f', r: 72,    a: [116, 14] },
    { k: 'violet',  c: '#8252a4', r: 112.5, a: [171, 268] },
    { k: 'purple',  c: '#623a93', r: 112.5, a: [146.5, 99] },
    { k: 'red',     c: '#e9444b', r: 112.5, a: [77.5, 0], tail: 215 },
    { k: 'dkblue',  c: '#326a9f', r: 154,   a: [168.5, 144] },
    { k: 'blue',    c: '#4da5eb', r: 154,   a: [218, 184.5] },
    { k: 'blue',    c: '#4ba4ea', r: 154,   a: [234.5, 281.5] },
    { k: 'yellow',  c: '#fbb738', r: 154,   a: [127, 75.5] },
    { k: 'yellow',  c: '#fcb638', r: 154,   a: [59.5, 1.5] },
    { k: 'magenta', c: '#ae3473', x: 316,   y: [321, 281] },
    { k: 'blue',    c: '#4ca4eb', x: 316,   y: [237, 85],  bar: 0 },
    { k: 'purple',  c: '#623995', x: 356.5, y: [171, 53],  bar: 1 },
    { k: 'orange',  c: '#f6962c', x: 398,   y: [304, 176], bar: 2 },
    { k: 'olive',   c: '#b9a247', x: 398,   y: [132, 24],  bar: 3 }
  ];

  // Small-size drawing: same outline (nothing cut from the edge), short
  // pieces joined into longer ones, wider gaps — readable at 16–40px.
  var SMALL = [
    { k: 'purple',  c: '#643992', r: 72,    a: [152, 296] },
    { k: 'red',     c: '#d8323f', r: 72,    a: [112, 14] },
    { k: 'violet',  c: '#7a4aa0', r: 112.5, a: [103, 262] },
    { k: 'red',     c: '#e9444b', r: 112.5, a: [77.5, 0], tail: 215 },
    { k: 'blue',    c: '#4da5eb', r: 154,   a: [150, 283] },
    { k: 'yellow',  c: '#fbb738', r: 154,   a: [131, 6] },
    { k: 'blue',    c: '#4ca4eb', x: 316,   y: [237, 85],  bar: 0 },
    { k: 'purple',  c: '#623995', x: 356.5, y: [167, 53],  bar: 1 },
    { k: 'orange',  c: '#f6962c', x: 398,   y: [300, 176], bar: 2 },
    { k: 'olive',   c: '#b9a247', x: 398,   y: [132, 24],  bar: 3 }
  ];

  function pt(r, a) {
    var t = a * Math.PI / 180;
    return (CX + r * Math.cos(t)).toFixed(1) + ' ' + (CY + r * Math.sin(t)).toFixed(1);
  }
  function pathD(s) {
    if (s.r) {
      return 'M' + pt(s.r, s.a[0]) + 'A' + s.r + ' ' + s.r + ' 0 0 ' + (s.a[1] > s.a[0] ? 1 : 0) + ' ' + pt(s.r, s.a[1]) +
        (s.tail != null ? 'V' + s.tail : '');
    }
    return 'M' + s.x + ' ' + s.y[0] + 'V' + s.y[1];
  }

  function dcLogoSvg(o) {
    o = o || {};
    var segs = o.small ? SMALL : FULL;
    var sw = o.small ? 32 : 24;
    var e = (sw - 24) / 2;                      // frame grows with the line, so nothing clips
    var vb = (76 - e) + ' ' + (10 - e) + ' ' + (336 + 2 * e) + ' ' + (500 + 2 * e);
    var size = o.size ? ' width="' + Math.round(o.size * (336 + 2 * e) / (500 + 2 * e)) + '" height="' + o.size + '"' : '';
    var paths = segs.map(function (s, i) {
      var col = o.mono || s.c;
      var style = '--i:' + i + ';--c:' + col + (s.bar != null ? ';--b:' + s.bar : '');
      return '<path class="k-' + s.k + (s.bar != null ? ' lg-bar' : '') + '" style="' + style + '" stroke="' + col +
        '" d="' + pathD(s) + '" pathLength="1"/>';
    }).join('');
    return '<svg' + (o.mono ? ' xmlns="http://www.w3.org/2000/svg"' : '') + ' class="' + (o.cls || 'dc-logo') + '" viewBox="' + vb + '"' + size +
      ' aria-hidden="true" focusable="false" fill="none" stroke-width="' + sw +
      '" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  }

  function dcLogoSpinner(px) {
    return dcLogoSvg({ small: true, cls: 'dc-logo dc-logo-load', size: px || 22 });
  }

  window.dcLogoSvg = dcLogoSvg;
  window.dcLogoSpinner = dcLogoSpinner;

  // The landing logo draws itself once when the page opens (.dc-logo-intro
  // in style.css). Drop the class once that is over, or leaving a hover
  // would switch the intro animation back on and play it again.
  if (typeof document !== 'undefined') {
    setTimeout(function () {
      var els = document.querySelectorAll('.dc-logo-intro');
      for (var i = 0; i < els.length; i++) els[i].classList.remove('dc-logo-intro');
    }, 2600);
  }
})();
