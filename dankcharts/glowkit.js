/* ═══════════════════════════════════════════════════════════════════════════
   GLOW KIT (2026-11-07)
   The landing page's icon language — small drawn pictures that glow in their
   own colour and make one move — carried to the rest of the site: tab titles,
   Records section headings, the Charts Guide cards and the stat tiles.

   Every icon lives here once, as plain SVG markup on a 24-unit grid, and is
   pasted INTO each <svg> rather than linked with <use>. That matters: shapes
   behind a <use> link sit in a hidden copy that the stylesheet's selectors
   cannot reach, so the two-tone fills (.gk-f / .gk-o …) would all fall back to
   plain black. (That exact bug showed up in the proposal page.)

   Part classes, styled in style.css under "GLOW KIT":
     gk-f    soft fill in the icon colour + coloured outline
     gk-s    outline only
     gk-o    solid fill in the icon colour
     gk-gold solid gold (the Dank 100 star)
     gk-surf page-surface fill + coloured outline (sits in front of a gk-f)
     gk-disc near-black vinyl, the same in every theme (real vinyl is black)
     gk-grv  vinyl groove line
   Motion hooks (gk-grow, gk-pop, gk-spin …) are named for what they do; the
   keyframes and the hover / tab-open triggers are all in style.css.

   Use:
     dcGlowIco('stats')                    → '<svg class="dc-gico dc-gico--stats">…</svg>'
     dcGlowIco('artist', 'sx-tile-gico')   → extra class(es) appended
     <svg data-gico="records"></svg>       → filled in by dcGlowHydrate()
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var GICO = {
    /* ── Tab titles ─────────────────────────────────────────────────────── */

    // Charts (Daily … All-Time): a little chart list, the #1 row climbs in
    charts:
      '<rect class="gk-o gk-climb" x="3" y="3.5" width="18" height="4.6" rx="1.6"/>' +
      '<rect class="gk-f" x="3" y="10.2" width="13" height="4.2" rx="1.5"/>' +
      '<rect class="gk-f" x="3" y="16.5" width="8.5" height="4.2" rx="1.5"/>' +
      '<path class="gk-s" d="M19.5 20.6v-5.2M17.4 17.5l2.1-2.1 2.1 2.1"/>',

    /* The five chart periods, each the glow version of its own nav icon
       (Charts Guide cards ask for these by nav period). */

    // Daily: the sun — its rays burst out, then turn slowly while hovered
    day:
      '<g class="gk-spin gk-slow"><g class="gk-ray">' +
        '<path class="gk-s" d="M12 2.4v2.1M12 19.5v2.1M2.4 12h2.1M19.5 12h2.1M5.25 5.25l1.5 1.5M17.25 17.25l1.5 1.5M5.25 18.75l1.5-1.5M17.25 6.75l1.5-1.5"/>' +
      '</g></g>' +
      '<circle class="gk-f" cx="12" cy="12" r="4.5"/>' +
      '<circle class="gk-o gk-pop" cx="12" cy="12" r="2.3"/>',

    // Weekly: a strip of seven days, today's column slides into place
    week:
      '<rect class="gk-o gk-slide" x="10.5" y="8.4" width="3" height="10.5"/>' +
      '<rect class="gk-f" x="1.65" y="5.1" width="20.7" height="13.8" rx="2.1"/>' +
      '<path class="gk-s" d="M1.65 8.4h20.7M4.6 8.4v10.5M7.56 8.4v10.5M10.5 8.4v10.5M13.5 8.4v10.5M16.44 8.4v10.5M19.4 8.4v10.5"/>',

    // Monthly: a calendar page whose days fill in row by row
    month:
      '<rect class="gk-f" x="2.85" y="4.8" width="18.3" height="16.5" rx="2.4"/>' +
      '<path class="gk-s" d="M2.85 9h18.3M7.8 2.55v2.85M16.2 2.55v2.85"/>' +
      '<g class="gk-row"><circle class="gk-o" cx="12" cy="11.1" r="0.95"/><circle class="gk-o" cx="15.15" cy="11.1" r="0.95"/><circle class="gk-o" cx="18.3" cy="11.1" r="0.95"/></g>' +
      '<g class="gk-row gk-d1"><circle class="gk-o" cx="5.7" cy="13.8" r="0.95"/><circle class="gk-o" cx="8.85" cy="13.8" r="0.95"/><circle class="gk-o" cx="12" cy="13.8" r="0.95"/><circle class="gk-o" cx="15.15" cy="13.8" r="0.95"/><circle class="gk-o" cx="18.3" cy="13.8" r="0.95"/></g>' +
      '<g class="gk-row gk-d2"><circle class="gk-o" cx="5.7" cy="16.5" r="0.95"/><circle class="gk-o" cx="8.85" cy="16.5" r="0.95"/><circle class="gk-o" cx="12" cy="16.5" r="0.95"/><circle class="gk-o" cx="15.15" cy="16.5" r="0.95"/><circle class="gk-o" cx="18.3" cy="16.5" r="0.95"/></g>' +
      '<g class="gk-row gk-late"><circle class="gk-o" cx="5.7" cy="19.2" r="0.95"/><circle class="gk-o" cx="8.85" cy="19.2" r="0.95"/><circle class="gk-o" cx="12" cy="19.2" r="0.95"/></g>',

    // Yearly: a desk calendar on four rings, squares filling in, the corner
    // of the page curling up
    year:
      '<rect class="gk-f" x="3.15" y="5.25" width="17.7" height="16.05" rx="2.25"/>' +
      '<path class="gk-s" d="M3.15 7.95h17.7M6.45 2.7v4.5M10.2 2.7v4.5M13.95 2.7v4.5M17.7 2.7v4.5"/>' +
      '<g class="gk-row"><rect class="gk-o" x="8.1" y="9.3" width="2.1" height="2.1" rx="0.5"/><rect class="gk-o" x="11.78" y="9.3" width="2.1" height="2.1" rx="0.5"/><rect class="gk-o" x="15.45" y="9.3" width="2.1" height="2.1" rx="0.5"/></g>' +
      '<g class="gk-row gk-d1"><rect class="gk-o" x="4.43" y="12.22" width="2.1" height="2.1" rx="0.5"/><rect class="gk-o" x="8.1" y="12.22" width="2.1" height="2.1" rx="0.5"/><rect class="gk-o" x="11.78" y="12.22" width="2.1" height="2.1" rx="0.5"/><rect class="gk-o" x="15.45" y="12.22" width="2.1" height="2.1" rx="0.5"/></g>' +
      '<g class="gk-row gk-d2"><rect class="gk-o" x="4.43" y="15.15" width="2.1" height="2.1" rx="0.5"/><rect class="gk-o" x="8.1" y="15.15" width="2.1" height="2.1" rx="0.5"/><rect class="gk-o" x="11.78" y="15.15" width="2.1" height="2.1" rx="0.5"/></g>' +
      '<path class="gk-f gk-pop gk-late" d="M15 21.3 20.85 15.45V21.3Z"/>',

    // All-Time: the infinity loop with a light running round it
    alltime:
      '<path class="gk-f" d="M8.1 8.4c2.1 0 3 1.5 3.9 3.6s1.8 3.6 3.9 3.6a3.6 3.6 0 0 0 0-7.2c-2.1 0-3 1.5-3.9 3.6s-1.8 3.6-3.9 3.6a3.6 3.6 0 0 1 0-7.2Z"/>' +
      '<path class="gk-s gk-chase" pathLength="1" d="M8.1 8.4c2.1 0 3 1.5 3.9 3.6s1.8 3.6 3.9 3.6a3.6 3.6 0 0 0 0-7.2c-2.1 0-3 1.5-3.9 3.6s-1.8 3.6-3.9 3.6a3.6 3.6 0 0 1 0-7.2Z"/>',

    // Charts Guide (tab title): an open book, its right page turning over
    guide:
      '<path class="gk-f" d="M12 6.45C9.9 4.65 7.2 4.05 3.75 4.05a1.35 1.35 0 0 0-1.35 1.35v11.1c0 .75.6 1.35 1.35 1.35 3.45 0 6.15.6 8.25 2.25Z"/>' +
      '<path class="gk-f" d="M12 6.45c2.1-1.8 4.8-2.4 8.25-2.4.75 0 1.35.6 1.35 1.35v11.1c0 .75-.6 1.35-1.35 1.35-3.45 0-6.15.6-8.25 2.25Z"/>' +
      '<path class="gk-surf gk-flip" d="M12 6.45c2.1-1.8 4.8-2.4 8.25-2.4.75 0 1.35.6 1.35 1.35v11.1c0 .75-.6 1.35-1.35 1.35-3.45 0-6.15.6-8.25 2.25Z"/>' +
      '<path class="gk-s" d="M12 6.45V20.1M15 9.2h3.6M15 12.2h3.6"/>',

    /* Top bar buttons */

    // Sync: a circular arrow that turns while hovered and while a sync runs
    sync:
      '<circle class="gk-f" cx="12" cy="12" r="7" stroke-opacity="0"/>' +
      '<g class="gk-turn"><path class="gk-s gk-thick" d="M12 5a7 7 0 1 0 6.06 3.5"/>' +
      '<path class="gk-o" d="M10.4 2.1 14.6 5 10.4 7.9Z"/></g>',

    // Language: a globe whose meridian swings round as if it were turning
    globe:
      '<circle class="gk-f" cx="12" cy="12" r="8.6"/>' +
      '<path class="gk-s" d="M3.4 12h17.2M5 7.6h14M5 16.4h14"/>' +
      '<ellipse class="gk-s gk-meridian" cx="12" cy="12" rx="3.7" ry="8.6"/>',

    /* Charts Guide lessons with no tab behind them */

    // Getting started ("First steps"): a trail of footprints, left, right,
    // left, each print appearing after the one before it. The prints sit
    // in an outer <g> carrying their place and angle, so the CSS move on the
    // inner <g> never overwrites that transform.
    start:
        '<g transform="translate(7.2 14.6) rotate(-12)"><g class="gk-step gk-s1">' +
          '<ellipse class="gk-o" cx="0" cy="0" rx="2" ry="2.8"/><ellipse class="gk-o" cx="0" cy="4.3" rx="1.45" ry="1.5"/>' +
        '</g></g>' +
        '<g transform="translate(15.6 10.2) rotate(12)"><g class="gk-step gk-s2">' +
          '<ellipse class="gk-o" cx="0" cy="0" rx="2" ry="2.8"/><ellipse class="gk-o" cx="0" cy="4.3" rx="1.45" ry="1.5"/>' +
        '</g></g>' +
        '<g transform="translate(8.6 3.9) rotate(-12)"><g class="gk-step gk-s3">' +
          '<ellipse class="gk-o" cx="0" cy="0" rx="2" ry="2.8"/><ellipse class="gk-o" cx="0" cy="4.3" rx="1.45" ry="1.5"/>' +
        '</g></g>' +
        '',

    // Around the chart, and sharing it: a chart card with a share arrow
    // flying out of its corner
    around:
      '<rect class="gk-f" x="2.5" y="6.5" width="13.5" height="15" rx="2.2"/>' +
      '<path class="gk-s" d="M5.5 11h4.5M5.5 14.5h7.5M5.5 18h5.5"/>' +
      '<g class="gk-shoot"><path class="gk-s" d="M12.5 11.5 20.5 3.5"/><path class="gk-o" d="M15.6 3h5.9v5.9Z"/></g>',

    // Song, artist and album windows: a window sliding up from a stack,
    // with a cover and its lines
    windows:
      '<rect class="gk-f gk-faint" x="6.5" y="2.5" width="15" height="12.5" rx="2"/>' +
      '<g class="gk-lift">' +
        '<rect class="gk-surf" x="2.5" y="7.5" width="15.5" height="14" rx="2.2"/>' +
        '<path class="gk-s" d="M2.5 10.8h15.5"/>' +
        '<rect class="gk-o" x="5" y="13.2" width="5.2" height="5.2" rx="0.9"/>' +
        '<path class="gk-s" d="M12.2 14.2h3.5M12.2 17.4h2.4"/>' +
      '</g>',

    // Settings: a gear that turns (its teeth are a dashed thick ring, so the
    // turn is visible and the path stays tiny)
    settings:
      '<g class="gk-spin">' +
        '<circle class="gk-teeth" cx="12" cy="12" r="8.6" pathLength="16"/>' +
        '<circle class="gk-f" cx="12" cy="12" r="6.9"/>' +
        '<circle class="gk-surf" cx="12" cy="12" r="2.6"/>' +
      '</g>',

    // Stats: a framed bar chart whose bars grow — the Sheets card's bars
    stats:
      '<rect class="gk-f" x="2.5" y="2.5" width="19" height="19" rx="4"/>' +
      '<rect class="gk-o gk-grow" x="6" y="12" width="3" height="6" rx="1"/>' +
      '<rect class="gk-o gk-grow gk-d1" x="10.5" y="6.5" width="3" height="11.5" rx="1"/>' +
      '<rect class="gk-o gk-grow gk-d2" x="15" y="9.5" width="3" height="8.5" rx="1"/>',

    // Raw Data: a database drum whose rows light up one after another
    raw:
      '<path class="gk-f" d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13"/>' +
      '<ellipse class="gk-f" cx="12" cy="5.5" rx="8" ry="3"/>' +
      '<path class="gk-s gk-row" d="M4 10c0 1.7 3.6 3 8 3s8-1.3 8-3"/>' +
      '<path class="gk-s gk-row gk-d1" d="M4 14.3c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',

    // Records: an achievement medal on its ribbon (records you set). The
    // medal swings from the ribbon and its star pops.
    records:
      '<path class="gk-f" d="M6.5 1.8h4l2.6 6.4h-4Z"/>' +
      '<path class="gk-f" d="M17.5 1.8h-4l-2.6 6.4h4Z"/>' +
      '<g class="gk-swing">' +
        '<circle class="gk-surf" cx="12" cy="15" r="7"/>' +
        '<circle class="gk-s gk-faint" cx="12" cy="15" r="4.9"/>' +
        '<path class="gk-o gk-pop" d="M12 11.3l1.15 2.35 2.6.38-1.88 1.83.44 2.58L12 17.22l-2.31 1.22.44-2.58-1.88-1.83 2.6-.38z"/>' +
      '</g>',

    // Events: a calendar where today pings
    events:
      '<rect class="gk-f" x="2.5" y="4.5" width="19" height="17" rx="3"/>' +
      '<path class="gk-s" d="M2.5 9.5h19M8 2.5v4M16 2.5v4"/>' +
      '<circle class="gk-ping" cx="12" cy="15.3" r="2.3"/>' +
      '<circle class="gk-o gk-pop" cx="12" cy="15.3" r="2.3"/>',

    // Awards: a trophy with a sparkle that pops over it
    awards:
      '<path class="gk-s" d="M7 5H4.3a2.6 2.6 0 0 0 3 3.6M17 5h2.7a2.6 2.6 0 0 1-3 3.6"/>' +
      '<path class="gk-f" d="M7 3.5h10V8a5 5 0 0 1-10 0Z"/>' +
      '<path class="gk-s" d="M12 13v3.5"/>' +
      '<path class="gk-f" d="M8.3 21h7.4l-.9-4H9.2Z"/>' +
      '<path class="gk-o gk-pop" d="M20 .8l.7 1.7 1.7.7-1.7.7-.7 1.7-.7-1.7-1.7-.7 1.7-.7z"/>',

    // Your Soundtrack: a cassette whose reels turn
    sound:
      '<rect class="gk-f" x="1.8" y="4.5" width="20.4" height="15" rx="2.6"/>' +
      '<rect class="gk-s" x="5" y="7.2" width="14" height="6.6" rx="1.4"/>' +
      '<circle class="gk-s gk-reel" cx="8.8" cy="10.5" r="1.8" stroke-dasharray="1.4 1.4"/>' +
      '<circle class="gk-s gk-reel" cx="15.2" cy="10.5" r="1.8" stroke-dasharray="1.4 1.4"/>' +
      '<path class="gk-s" d="M7 19.5l1.3-3h7.4l1.3 3"/>',

    // Playlists: rows that move like level meters, plus a play button
    lists:
      '<rect class="gk-o gk-lvl" x="2.5" y="4.5" width="13" height="2.6" rx="1.3"/>' +
      '<rect class="gk-o gk-lvl gk-d1 gk-a70" x="2.5" y="10" width="13" height="2.6" rx="1.3"/>' +
      '<rect class="gk-o gk-lvl gk-d2 gk-a45" x="2.5" y="15.5" width="8" height="2.6" rx="1.3"/>' +
      '<path class="gk-f" d="M14.5 13.5v8l6.5-4z"/>',

    // Ratings: a star filled to a score, filling all the way on hover
    ratings:
      '<path class="gk-f" d="M12 2.6l2.9 5.8 6.4.9-4.6 4.5 1.1 6.4L12 17.2l-5.8 3 1.1-6.4-4.6-4.5 6.4-.9z"/>' +
      '<path class="gk-o gk-fill" d="M12 2.6l2.9 5.8 6.4.9-4.6 4.5 1.1 6.4L12 17.2l-5.8 3 1.1-6.4-4.6-4.5 6.4-.9z"/>',

    // Community Board: two speech bubbles, someone typing in the front one
    board:
      '<path class="gk-f" d="M9 2.8h10.2a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-2.5 2.5H18.5v2.8l-3.2-2.8"/>' +
      '<path class="gk-surf" d="M2.5 9.6A2.6 2.6 0 0 1 5.1 7h9.3A2.6 2.6 0 0 1 17 9.6v5.6a2.6 2.6 0 0 1-2.6 2.6H9.2l-3.8 3.4v-3.4h-.3a2.6 2.6 0 0 1-2.6-2.6Z"/>' +
      '<circle class="gk-o gk-dot" cx="6.6" cy="12.4" r="1.15"/>' +
      '<circle class="gk-o gk-dot gk-d1" cx="9.75" cy="12.4" r="1.15"/>' +
      '<circle class="gk-o gk-dot gk-d2" cx="12.9" cy="12.4" r="1.15"/>',

    // The Dank 100: a podium that rises, a gold star that lands on #1
    d100:
      '<rect class="gk-f gk-grow gk-d1" x="2.5" y="12" width="6.3" height="9.5" rx="1.2"/>' +
      '<rect class="gk-o gk-grow gk-d2" x="8.85" y="8" width="6.3" height="13.5" rx="1.2"/>' +
      '<rect class="gk-f gk-grow" x="15.2" y="14.5" width="6.3" height="7" rx="1.2"/>' +
      '<path class="gk-gold gk-pop gk-late" d="M12 1.2l1.2 2.4 2.6.4-1.9 1.8.5 2.6L12 7.2 9.6 8.4l.5-2.6L8.2 4l2.6-.4z"/>',

    /* ── Records section headings ───────────────────────────────────────
       The same pictures as the Records sprite (ri-*) in index.html, redrawn
       two-tone on the 24 grid. Their colour is the section's own --ico, so a
       heading still matches the Records pill that jumps to it. */

    // Overview (Records menu): four tiles, the first lit, popping in one by one
    'rec-overview':
      '<rect class="gk-o gk-pop" x="3" y="3" width="7.6" height="7.6" rx="1.8"/>' +
      '<rect class="gk-f gk-pop gk-d1" x="13.4" y="3" width="7.6" height="7.6" rx="1.8"/>' +
      '<rect class="gk-f gk-pop gk-d1" x="3" y="13.4" width="7.6" height="7.6" rx="1.8"/>' +
      '<rect class="gk-f gk-pop gk-d2" x="13.4" y="13.4" width="7.6" height="7.6" rx="1.8"/>',

    // All #1s: a crown that drops into place, jewel last
    'rec-ones':
      '<g class="gk-drop">' +
        '<path class="gk-f" d="M4.6 18.5 3.2 7.5l5.2 4.3L12 5.2l3.6 6.6 5.2-4.3-1.4 11Z"/>' +
        '<circle class="gk-o gk-pop gk-late" cx="12" cy="14.4" r="1.5"/>' +
      '</g>' +
      '<path class="gk-s" d="M5 21.4h14"/>',

    // Perfect All Kill: a crosshair that zooms onto its target
    'rec-pak':
      '<circle class="gk-f" cx="12" cy="12" r="7.8"/>' +
      '<g class="gk-zoom"><circle class="gk-s" cx="12" cy="12" r="4.2"/>' +
      '<path class="gk-s" d="M12 1.5v3.4M12 19.1v3.4M1.5 12h3.4M19.1 12h3.4"/></g>' +
      '<circle class="gk-o gk-pop gk-late" cx="12" cy="12" r="1.8"/>',

    // Most Chart Appearances: layers that stack down one by one
    'rec-appearances':
      '<path class="gk-f gk-lay" d="M12 2.8 21.5 7.8 12 12.8 2.5 7.8Z"/>' +
      '<path class="gk-s gk-lay gk-d1" d="M2.5 12.3 12 17.3l9.5-5"/>' +
      '<path class="gk-s gk-lay gk-d2" d="M2.5 16.8 12 21.8l9.5-5"/>',

    // Biggest Debuts: a shooting star — the star pops, its trail draws in
    'rec-debuts':
      '<path class="gk-s gk-trail" pathLength="1" d="M3 20.7 9.3 14.4M3.6 14.7l2.7-2.7M9.6 20.4l2.7-2.7"/>' +
      '<path class="gk-f gk-pop" d="M16.2 3.3 18 7.5l4.2 1.8L18 11.1l-1.8 4.2-1.8-4.2-4.2-1.8 4.2-1.8Z"/>',

    // Most Plays in a Period: a waveform whose bars bounce
    'rec-plays':
      '<rect class="gk-o gk-wave" x="2" y="9.5" width="2.4" height="5" rx="1.2"/>' +
      '<rect class="gk-o gk-wave gk-d1" x="6.4" y="5.5" width="2.4" height="13" rx="1.2"/>' +
      '<rect class="gk-o gk-wave gk-d2" x="10.8" y="8" width="2.4" height="8" rx="1.2"/>' +
      '<rect class="gk-o gk-wave gk-d1" x="15.2" y="3.5" width="2.4" height="17" rx="1.2"/>' +
      '<rect class="gk-o gk-wave" x="19.6" y="9" width="2.4" height="6" rx="1.2"/>',

    // Play Count Milestones: a summit flag that waves
    'rec-milestones':
      '<path class="gk-s" d="M5.4 22.2V3M2.5 22.2h6"/>' +
      '<path class="gk-f gk-flag" d="M5.4 4.2h12.9l-2.7 4.4 2.7 4.4H5.4"/>',

    // Fastest to Milestone: a lightning bolt that strikes
    'rec-fastest':
      '<path class="gk-s gk-faint" d="M2.5 7h3.2M1.5 11h2.8M2.5 15h2"/>' +
      '<path class="gk-f gk-zap" d="M14.6 2.1 5.8 14h6.2l-1.3 7.9L19.5 10h-6.2z"/>',

    // Certifications: a gold-label record that spins (the off-centre groove
    // arc is what makes the turn visible — circles alone look still)
    'rec-certs':
      '<g class="gk-spin">' +
        '<circle class="gk-disc" cx="12" cy="12" r="9.6"/>' +
        '<circle class="gk-grv" cx="12" cy="12" r="7.4"/>' +
        '<path class="gk-s gk-faint" d="M12 5.2a6.8 6.8 0 0 1 5.8 3.2"/>' +
        '<circle class="gk-o" cx="12" cy="12" r="3.2"/>' +
        '<circle class="gk-disc" cx="12" cy="12" r="0.8"/>' +
      '</g>',

    // Streak Records: a flame that flickers
    'rec-streaks':
      '<path class="gk-f gk-flick" d="M12 2.1c4.5 3.9 6.9 7.35 6.9 11.1A6.9 6.9 0 0 1 12 21.9 6.9 6.9 0 0 1 5.1 13.2c0-3.75 2.4-7.2 6.9-11.1Z"/>' +
      '<path class="gk-o gk-flick gk-d1" d="M12 21.9a3.3 3.3 0 0 0 3.3-3.3c0-1.8-1.2-3-3.3-5.4-2.1 2.4-3.3 3.6-3.3 5.4A3.3 3.3 0 0 0 12 21.9Z"/>',

    // New Charts Records: a firework burst
    'rec-newcharts':
      '<path class="gk-s gk-ray" d="M12 12V3.2M12 12v8.8M12 12H3.2M12 12h8.8"/>' +
      '<path class="gk-s gk-ray gk-d1 gk-a70" d="m12 12-5.6-5.6M12 12l5.6 5.6M12 12l5.6-5.6M12 12l-5.6 5.6"/>' +
      '<circle class="gk-o gk-pop" cx="12" cy="12" r="2.4"/>',

    /* ── Stat tile glyphs (inside a glow tile; colour = the tile's) ─────── */

    play:
      '<path class="gk-f gk-beat" d="M8 4.8v14.4L19.5 12z"/>',
    note:
      '<g class="gk-bob"><path class="gk-s" d="M9 17.5V5.5l10-2.2v12"/>' +
      '<circle class="gk-o" cx="6.6" cy="17.6" r="2.6"/><circle class="gk-o" cx="16.6" cy="15.4" r="2.6"/></g>',
    // Artists: a person with a music note — the Records Artists pill's
    // picture (not a microphone)
    artist:
      '<circle class="gk-f" cx="9" cy="7.2" r="4.1"/>' +
      '<path class="gk-s" d="M2.2 21.2v-1.7a4.7 4.7 0 0 1 4.7-4.7h4.6"/>' +
      '<g class="gk-bob"><path class="gk-s" d="M19.2 19V11l2.8 1.4"/><circle class="gk-o" cx="17" cy="19" r="2.3"/></g>',
    disc:
      '<g class="gk-spin"><circle class="gk-f" cx="12" cy="12" r="9.2"/>' +
      '<path class="gk-s gk-faint" d="M12 5.6a6.4 6.4 0 0 1 6.4 6.4"/><circle class="gk-o" cx="12" cy="12" r="2.6"/></g>',
    cal:
      '<rect class="gk-f" x="3" y="4.6" width="18" height="16.4" rx="3"/>' +
      '<path class="gk-s" d="M3 9.6h18M8 2.6v4M16 2.6v4"/><circle class="gk-o gk-beat" cx="12" cy="15.2" r="2.1"/>',
    spark:
      '<path class="gk-f" d="M11 3.5l1.8 5.4 5.4 1.8-5.4 1.8L11 17.9l-1.8-5.4-5.4-1.8 5.4-1.8z"/>' +
      '<path class="gk-o gk-pop" d="M18.6 14.6l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    peak:
      '<circle class="gk-o gk-rise" cx="17.2" cy="6.2" r="2.4"/>' +
      '<path class="gk-f" d="M2.2 20l6.6-10.4 4 5.6 2.6-3.4 6.4 8.2z"/>'
  };

  // Which icon a period-nav tab gets (the Charts Guide asks by nav period).
  var NAV_TO_GICO = {
    // each chart period has its own picture (its nav icon), not the shared chart list
    day: 'day', week: 'week', month: 'month', year: 'year', alltime: 'alltime',
    rawdata: 'raw', graphs: 'stats', records: 'records', events: 'events',
    awards: 'awards', soundtrack: 'sound', playlists: 'lists', ratings: 'ratings',
    board: 'board', dank100: 'd100'
  };

  function dcGlowIco(name, cls) {
    var body = GICO[name];
    if (!body) return '';
    return '<svg class="dc-gico dc-gico--' + name + (cls ? ' ' + cls : '') +
      '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + body + '</svg>';
  }

  // Static markup carries an empty <svg data-gico="name">; fill it in place
  // (keeps the element and its classes, so nothing jumps once filled).
  function dcGlowHydrate(root) {
    (root || document).querySelectorAll('svg[data-gico]').forEach(function (svg) {
      var name = svg.getAttribute('data-gico');
      if (!GICO[name] || svg.getAttribute('data-gico-done')) return;
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.classList.add('dc-gico', 'dc-gico--' + name);
      svg.innerHTML = GICO[name];
      svg.setAttribute('data-gico-done', '1');
    });
  }

  // Stat tiles (Charts period tiles, Daily tiles): the small tinted square
  // beside the label becomes a glow tile with the drawn glyph. Unknown
  // categories keep their emoji, so nothing ever goes blank.
  var CAT_TO_GICO = { plays: 'play', songs: 'note', artists: 'artist', albums: 'disc' };
  function dcStatCatIco(cat, emoji) {
    var g = CAT_TO_GICO[cat];
    if (!g) return '<span class="stat-cat-icon">' + (emoji || '') + '</span>';
    return '<span class="stat-cat-icon dc-gtile">' + dcGlowIco(g) + '</span>';
  }
  window.dcStatCatIco = dcStatCatIco;

  window.DC_GLOW_ICONS = GICO;
  window.DC_GLOW_NAV = NAV_TO_GICO;
  window.dcGlowIco = dcGlowIco;
  window.dcGlowHydrate = dcGlowHydrate;

  // Hover replays an icon's move. The moves are CSS animations that already
  // played once when the heading appeared; rewinding them through the Web
  // Animations API replays them without a second copy of every keyframe.
  // Loops (reels, dots …) are left alone: CSS keeps them going on :hover.
  var hoverHost = null;
  document.addEventListener('mouseover', function (e) {
    var host = e.target && e.target.closest ? e.target.closest('.section-header-h2, .gd-card, .stat-box, .st-stat, .tb-tab, .bt-tab, .tb-more-item, .records-nav-btn, .rec-picker, .tb-btn, .ctrl-group-btn, .dc-gk-host') : null;
    if (host === hoverHost) return;
    hoverHost = host;
    if (!host || !host.getAnimations) return;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    host.querySelectorAll('.dc-gico').forEach(function (svg) {
      svg.getAnimations({ subtree: true }).forEach(function (a) {
        var it = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming().iterations : 1;
        if (it === Infinity) return;
        a.currentTime = 0;
        a.play();
      });
    });
  });

  // Deferred scripts run after parsing, so the static headings already exist.
  dcGlowHydrate();
})();
