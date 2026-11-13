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
    { k: 'violet',  c: '#8252a4', r: 112.5, a: [171, 285] },   // runs on towards the blue bar (was 268: a hole there bothered the user, 2026-11-12)
    { k: 'purple',  c: '#623a93', r: 112.5, a: [153, 99] },   // starts closer to the violet piece (was 146.5: gap too wide, 2026-11-12)
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

  // Small-size drawing (top bar, spinners, share pictures, favicon).
  // 2026-11-12: it used to merge the pieces into a few long ones and drop
  // the short magenta bar, which made the top bar logo look like pieces were
  // missing. The user prefers the original brand drawing, so the small one
  // now has the same pieces as FULL (same splits, the magenta bar back),
  // only drawn with a thicker line (SMALL_SW) so it reads at 16–40px.
  var SMALL = FULL;

  var SMALL_SW = 30;   // line width of the small drawing (FULL uses 24)

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

  // Light backgrounds: the pale pieces get deeper versions of their colour
  // (same values as the light-theme rules in style.css, "LOGO MARK")
  var LIGHT = { yellow: '#e39a0e', olive: '#93802a', blue: '#2f86d1', orange: '#e07a10' };
  function segColor(s, o) {
    if (o.mono) return o.mono;
    return (o.light && LIGHT[s.k]) || s.c;
  }

  function dcLogoSvg(o) {
    o = o || {};
    var segs = o.small ? SMALL : FULL;
    var sw = o.small ? SMALL_SW : 24;
    var e = (sw - 24) / 2;                      // frame grows with the line, so nothing clips
    var vb = (76 - e) + ' ' + (10 - e) + ' ' + (336 + 2 * e) + ' ' + (500 + 2 * e);
    var size = o.size ? ' width="' + Math.round(o.size * (336 + 2 * e) / (500 + 2 * e)) + '" height="' + o.size + '"' : '';
    var paths = segs.map(function (s, i) {
      var col = segColor(s, o);
      var style = '--i:' + i + ';--c:' + col + (s.bar != null ? ';--b:' + s.bar : '');
      return '<path class="k-' + s.k + (s.bar != null ? ' lg-bar' : '') + '" style="' + style + '" stroke="' + col +
        '" d="' + pathD(s) + '" pathLength="1"/>';
    }).join('');
    // xmlns is needed when the svg is used as an image (data URL), e.g. in share pictures
    return '<svg' + (o.mono || o.xmlns ? ' xmlns="http://www.w3.org/2000/svg"' : '') + ' class="' + (o.cls || 'dc-logo') + '" viewBox="' + vb + '"' + size +
      ' aria-hidden="true" focusable="false" fill="none" stroke-width="' + sw +
      '" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  }

  function dcLogoSpinner(px) {
    return dcLogoSvg({ small: true, cls: 'dc-logo dc-logo-load', size: px || 22 });
  }

  // ── The full name on canvas-drawn share pictures (2026-11-11) ──────────
  // Same lockup as the site's wordmark: the colourful logo stands in for
  // the "d", then "ank" bold, "charts" light and the ".fm" badge in the
  // accent colour. Drawn straight onto the canvas (Path2D understands the
  // svg path text), so nothing has to load first.
  //   g      canvas 2d context
  //   x, y   anchor point; y = the text baseline
  //   o.size    name size in px (default 40)
  //   o.align   'left' | 'center' | 'right' (where x sits)
  //   o.color   name colour (default white); "charts" is a little fainter
  //   o.accent  .fm badge colour (default the site blue)
  //   o.light   true on a light background (deeper logo colours)
  //   o.sans / o.mono  font stacks
  // Returns the drawn width.
  function hexRgba(hex, a) {
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (!/^[0-9a-f]{6}$/i.test(h)) return hex;   // not hex: use as given
    return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')';
  }
  function dcDrawBrand(g, x, y, o) {
    o = o || {};
    var size = o.size || 40;
    var sans = o.sans || "'IBM Plex Sans', system-ui, sans-serif";
    var mono = o.mono || "'JetBrains Mono', ui-monospace, monospace";
    var color = o.color || '#ffffff';
    var accent = o.accent || '#72bbff';
    // Logo: small drawing, 1.1em tall like on the site. Its frame grows
    // with the line width (same sum as dcLogoSvg's viewBox).
    var fe = (SMALL_SW - 24) / 2, fw = 336 + 2 * fe, fh = 500 + 2 * fe;
    var lh = size * 1.1, ls = lh / fh, lw = fw * ls, gap = size * 0.04;
    g.save();
    g.textAlign = 'left';
    g.textBaseline = 'alphabetic';
    g.font = '700 ' + size + 'px ' + sans;
    var wAnk = g.measureText('ank').width;
    g.font = '300 ' + size + 'px ' + sans;
    var wCharts = g.measureText('charts').width;
    var fs = Math.round(size * 0.42), padX = fs * 0.4, fmGap = size * 0.12;
    g.font = '500 ' + fs + 'px ' + mono;
    var wFm = g.measureText('.fm').width + padX * 2;
    var total = lw + gap + wAnk + wCharts + fmGap + wFm;
    var left = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x;

    // the logo, its foot a little under the baseline like a round letter
    var top = y + size * 0.08 - lh;
    g.save();
    g.translate(left, top);
    g.scale(ls, ls);
    g.translate(-(76 - fe), -(10 - fe));
    g.lineWidth = SMALL_SW; g.lineCap = 'round'; g.lineJoin = 'round';
    SMALL.forEach(function (s) {
      g.strokeStyle = segColor(s, o);
      g.stroke(new Path2D(pathD(s)));
    });
    g.restore();

    // "ank" + "charts"
    var cx = left + lw + gap;
    g.fillStyle = color;
    g.font = '700 ' + size + 'px ' + sans;
    g.fillText('ank', cx, y);
    cx += wAnk;
    g.fillStyle = hexRgba(color, 0.82);
    g.font = '300 ' + size + 'px ' + sans;
    g.fillText('charts', cx, y);
    cx += wCharts + fmGap;

    // ".fm" badge, centred on the lower-case letters
    var bh = fs * 1.45, by = y - size * 0.36 - bh / 2, r = Math.max(3, fs * 0.22);
    g.beginPath();
    if (g.roundRect) g.roundRect(cx, by, wFm, bh, r); else g.rect(cx, by, wFm, bh);
    g.fillStyle = hexRgba(accent, 0.16); g.fill();
    g.lineWidth = Math.max(1, size / 40); g.strokeStyle = hexRgba(accent, 0.4); g.stroke();
    g.fillStyle = accent;
    g.font = '500 ' + fs + 'px ' + mono;
    g.textBaseline = 'middle';
    g.fillText('.fm', cx + padX, by + bh / 2 + fs * 0.04);
    g.restore();
    return total;
  }

  window.dcLogoSvg = dcLogoSvg;
  window.dcLogoSpinner = dcLogoSpinner;
  window.dcDrawBrand = dcDrawBrand;

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
