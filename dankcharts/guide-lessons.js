/* ═══════════════════════════════════════════════════════════════════
   CHARTS GUIDE LESSONS (GUIDE-PLAN.md)

   Loaded by guide.js only when the guide opens. Two parts:

   GL        the shape of every lesson: which pictures, which spots,
             which slides, options, challenges and quiz answers. Not
             translated.
   GL_TEXT   the words, by language. English is here; the other three
             languages are in guide-lessons.<lang>.js and only need to
             hold what they translate (anything missing falls back to
             English, key by key).

   Pictures are guide/<lang>/<shot>.webp, taken by tools/guide-shots.mjs,
   which also measures every spot named here (guide/<lang>/shots.json).
   A spot name used here must exist in that tool's shot, or its dot is
   simply left out.

   Keep the four languages in step: a sentence changed in English is
   changed in the other three in the same commit.
   ═══════════════════════════════════════════════════════════════════ */
window.GL = {
  // Areas group the lessons on the hub, in this order
  areas: ['start', 'charts', 'insights', 'more', 'setup'],

  lessons: [
    /* ── Lesson 0: Getting started (GUIDE-PLAN.md step 12) ─────────
       The old guide's Start Here: a live check of your setup (live:
       'setup', drawn by guide.js) above the lesson, and its seven first
       steps as the challenges. Pictures are the Weekly and Settings ones. */
    { id: 'start', area: 'start', nav: null, mins: 4, cover: 'week-top', live: 'setup',
      scenes: [
        { id: 'bar', shot: 'set-bar', phone: true, spots: ['search', 'settings', 'theme', 'lang', 'signin'] },
        { id: 'chart', shot: 'week-top', phone: true, spots: ['periods', 'prev', 'label', 'next', 'tiles'] },
        { id: 'row', shot: 'week-rows', phone: true, spots: ['rank', 'move', 'title', 'peak', 'weeks', 'plays', 'more'] }
      ],
      howto: [
        { id: 'first', challenge: 'start.chart', slides: [
          { shot: 'set-source', spot: 'cards' }, { shot: 'set-lastfm', spot: 'save' }, { shot: 'week-top', spot: 'periods' },
          { shot: 'week-rows', spot: 'rank' }, { shot: 'week-rows', spot: 'more' } ] },
        { id: 'around', challenge: 'start.explore', slides: [
          { shot: 'set-bar', spot: 'search' }, { shot: 'week-top', spot: 'periods' }, { shot: 'week-chart', spot: 'type' },
          { shot: 'set-bar', spot: 'settings' } ] }
      ],
      options: [
        { id: 'where', items: [
          { id: 'settings', shot: 'set-bar', spot: 'settings' }, { id: 'search', shot: 'set-bar', spot: 'search' },
          { id: 'periods', shot: 'week-top', spot: 'periods' } ] }
      ],
      challenges: ['start.data', 'start.chart', 'start.tour', 'start.explore', 'start.size', 'start.card', 'start.playlist'],
      quiz: [ { id: 'q1', answer: 1 }, { id: 'q2', answer: 0 }, { id: 'q3', answer: 2 } ],
      tips: [ ['set-bar', 'search', 'start.explore'], ['week-top', 'periods', 'start.chart'], ['week-rows', 'more', 'start.playlist'] ]
    },
    /* ── Lesson 1: the Weekly chart page ─────────────────────────── */
    { id: 'week', area: 'charts', nav: 'week', mins: 8, cover: 'week-chart',
      scenes: [
        { id: 'top', shot: 'week-top', phone: true,
          spots: ['periods', 'prev', 'label', 'next', 'streak', 'banner', 'tiles', 'delta', 'compare'] },
        { id: 'chart', shot: 'week-chart', phone: true,
          spots: ['spotlight', 'type', 'layouts', 'collapse', 'title', 'animate', 'menu', 'desc', 'heads', 'first'] },
        { id: 'row', shot: 'week-rows', phone: true,
          spots: ['rank', 'move', 'prev', 'up', 'down', 'newe', 're', 'art', 'title', 'peak', 'cert', 'album', 'weeks', 'plays', 'pdelta', 'best', 'spotify', 'more', 'run'] },
        // The panel that opens under a row (the chart-run button)
        { id: 'run', shot: 'week-run',
          spots: ['run', 'facts', 'acts', 'range', 'now', 'story', 'ribbon', 'boxes', 'goals', 'more'] },
        // Animate chart, paused part-way through
        { id: 'replay', shot: 'week-replay',
          spots: ['when', 'count', 'days', 'ends', 'scrub', 'play', 'step', 'speeds', 'log', 'keys', 'close'] }
      ],
      howto: [
        { id: 'nav', challenge: 'week.prev', slides: [
          { shot: 'week-top', spot: 'prev' }, { shot: 'week-top', spot: 'next' },
          { shot: 'week-top', spot: 'label' }, { shot: 'week-top', spot: 'periods' } ] },
        { id: 'size', challenge: 'week.size', slides: [
          { shot: 'week-chart', spot: 'menu' }, { shot: 'week-menu-size', spot: 'tab-size' },
          { shot: 'week-menu-size', spot: 'sizes' }, { shot: 'week-chart', spot: 'title' } ] },
        { id: 'layout', challenge: 'week.layout', slides: [
          { shot: 'week-chart', spot: 'layouts' }, { shot: 'week-layout-grid', spot: 'btn' },
          { shot: 'week-layout-mosaic', spot: 'btn' }, { shot: 'week-layout-filmstrip', spot: 'btn' },
          { shot: 'week-layout-compact', spot: 'btn' }, { shot: 'week-layout-stack', spot: 'two' } ] },
        { id: 'details', challenge: 'week.show', slides: [
          { shot: 'week-chart', spot: 'menu' }, { shot: 'week-menu-show', spot: 'tab-show' },
          { shot: 'week-menu-show', spot: 'ptags' }, { shot: 'week-rows', spot: 'peak' },
          { shot: 'week-menu-show', spot: 'sections' } ] },
        { id: 'type', challenge: 'week.type', slides: [
          { shot: 'week-chart', spot: 'type' }, { shot: 'week-artists', spot: 'artists' },
          { shot: 'week-albums', spot: 'albums' } ] },
        { id: 'run', challenge: 'week.run', slides: [
          { shot: 'week-rows', spot: 'run' }, { shot: 'week-run', spot: 'boxes' },
          { shot: 'week-run', spot: 'range' }, { shot: 'week-run', spot: 'acts' },
          { shot: 'week-rowmenu', spot: 'menu' } ] },
        { id: 'animate', challenge: 'week.animate', slides: [
          { shot: 'week-chart', spot: 'animate' }, { shot: 'week-replay', spot: 'days' },
          { shot: 'week-replay', spot: 'play' }, { shot: 'week-replay', spot: 'scrub' },
          { shot: 'week-replay', spot: 'log' }, { shot: 'week-replay', spot: 'close' } ] }
      ],
      options: [
        // big: picture on top; crop 'area': the top-left of the chart, readable
        { id: 'layouts', big: true, items: [
          { id: 'table', shot: 'week-rows', spot: 'body', crop: 'area', def: 'on' },
          { id: 'grid', shot: 'week-layout-grid', spot: 'view', crop: 'area' },
          { id: 'compact', shot: 'week-layout-compact', spot: 'view', crop: 'area' },
          { id: 'mosaic', shot: 'week-layout-mosaic', spot: 'view', crop: 'area' },
          { id: 'filmstrip', shot: 'week-layout-filmstrip', spot: 'view', crop: 'area' },
          { id: 'stack', shot: 'week-layout-stack', spot: 'view', crop: 'area' } ] },
        { id: 'show', items: [
          { id: 'cert', shot: 'week-rows', spot: 'cert', def: 'off' },
          { id: 'score', shot: 'week-menu-show', spot: 'score', def: 'off' },
          { id: 'ppeak', shot: 'week-rows', spot: 'best', def: 'off' },
          { id: 'ptags', shot: 'week-rows', spot: 'peak', def: 'off' },
          { id: 'bulegend', shot: 'week-menu-show', spot: 'bulegend', def: 'off' },
          { id: 'desc', shot: 'week-chart', spot: 'desc', def: 'off' } ] },
        { id: 'sections', items: [
          { id: 'normal', shot: 'week-menu-show', spot: 'sub-normal', def: 'on' },
          { id: 'bu', shot: 'week-menu-show', spot: 'sub-bu', def: 'on' },
          { id: 'off', shot: 'week-menu-show', spot: 'sub-off', def: 'on' },
          { id: 'new', shot: 'week-menu-show', spot: 'sub-new', def: 'on' } ] },
        { id: 'size', items: [
          { id: 'week', shot: 'week-menu-size', spot: 'sizes', def: 'Top 10' },
          { id: 'other', shot: 'week-menu-size', spot: 'tab-size' } ] },
        { id: 'actions', items: [
          { id: 'playall', shot: 'week-menu-actions', spot: 'playall' },
          { id: 'shuffle', shot: 'week-menu-actions', spot: 'shuffle' },
          { id: 'export', shot: 'week-menu-actions', spot: 'export' },
          { id: 'share', shot: 'week-menu-actions', spot: 'share' },
          { id: 'pdf', shot: 'week-menu-actions', spot: 'pdf' } ] },
        { id: 'badges', items: [
          { id: 'up', shot: 'week-rows', spot: 'up' },
          { id: 'down', shot: 'week-rows', spot: 'down' },
          { id: 'same', shot: 'week-rows', spot: 'move' },
          { id: 'newe', shot: 'week-rows', spot: 'newe' },
          { id: 're', shot: 'week-rows', spot: 're' },
          { id: 'peak', shot: 'week-rows', spot: 'peak' },
          { id: 'cert', shot: 'week-rows', spot: 'cert' },
          { id: 'best', shot: 'week-rows', spot: 'best' } ] }
      ],
      // Ids must match the detectors in guide.js (GD_CHALLENGES)
      challenges: ['week.prev', 'week.jump', 'week.type', 'week.layout', 'week.size', 'week.show', 'week.animate', 'week.run'],
      quiz: [ { id: 'q1', answer: 1 }, { id: 'q2', answer: 1 }, { id: 'q3', answer: 0 } ],
      // Today's tip pool: [shot, spot] per tip, text in GL_TEXT tips
      // [shot, spot, challenge for its Show me button (or none)]
      tips: [ ['week-top', 'prev', 'week.prev'], ['week-rows', 'more'], ['week-chart', 'layouts', 'week.layout'], ['week-chart', 'animate', 'week.animate'], ['week-top', 'tiles'] ]
    },

    /* ── Planned lessons (GUIDE-PLAN.md steps 2–12). Shown on the hub as
          "Coming soon" until their step is built. ───────────────────── */
    /* ── Lesson 2: the Daily chart ───────────────────────────────── */
    { id: 'daily', area: 'charts', nav: 'day', mins: 8, cover: 'day-tools',
      scenes: [
        { id: 'top', shot: 'day-top', phone: true,
          spots: ['daily', 'prev', 'label', 'next', 'banner', 'peak', 'tiles', 'hours', 'best', 'share'] },
        { id: 'tools', shot: 'day-tools', phone: true,
          spots: ['cmp', 'cmp1', 'cmp2', 'no1', 'recap', 'share', 'play', 'cal', 'save', 'export', 'title', 'heads'] },
        { id: 'panel', shot: 'day-panel', phone: true,
          spots: ['today', 'week', 'first', 'last', 'topart', 'repeat', 'moods', 'note', 'status'] },
        { id: 'time', shot: 'day-time',
          spots: ['busiest', 'sessions', 'longest', 'tl', 'hours', 'busy', 'hourcard', 'parts', 'replayed', 'b2b', 'full', 'variety', 'genres'] },
        { id: 'mem', shot: 'day-mem',
          spots: ['otd', 'forgot', 'back', 'firsth', 'list', 'awards', 'mshit', 'msrec', 'msstreak', 'msgoal', 'msnear'] },
        { id: 'recap', shot: 'day-recap', spots: ['bars', 'big', 'next', 'prev', 'x'] },
        { id: 'cal', shot: 'day-cal', spots: ['title', 'prev', 'next', 'grid', 'day', 'share', 'x'] }
      ],
      howto: [
        { id: 'pick', challenge: 'day.prev', slides: [
          { shot: 'day-top', spot: 'prev' }, { shot: 'day-top', spot: 'label' },
          { shot: 'day-tools', spot: 'cal' }, { shot: 'day-cal', spot: 'day' } ] },
        { id: 'compare', challenge: 'day.cmp', slides: [
          { shot: 'day-tools', spot: 'cmp1' }, { shot: 'day-tools', spot: 'cmp2' }, { shot: 'day-tools', spot: 'heads' } ] },
        { id: 'recap', challenge: 'day.recap', slides: [
          { shot: 'day-tools', spot: 'recap' }, { shot: 'day-recap', spot: 'big' },
          { shot: 'day-recap', spot: 'next' }, { shot: 'day-recap', spot: 'x' } ] },
        { id: 'diary', challenge: 'day.mood', slides: [
          { shot: 'day-panel', spot: 'moods' }, { shot: 'day-panel', spot: 'note' }, { shot: 'day-panel', spot: 'status' } ] },
        { id: 'hours', challenge: 'day.hour', slides: [
          { shot: 'day-time', spot: 'hours' }, { shot: 'day-time', spot: 'hourcard' }, { shot: 'day-time', spot: 'parts' } ] },
        { id: 'memories', challenge: 'day.tab', slides: [
          { shot: 'day-mem', spot: 'otd' }, { shot: 'day-mem', spot: 'forgot' },
          { shot: 'day-mem', spot: 'back' }, { shot: 'day-mem', spot: 'firsth' }, { shot: 'day-mem', spot: 'msgoal' } ] },
        { id: 'keep', challenge: 'day.save', slides: [
          { shot: 'day-tools', spot: 'save' }, { shot: 'day-tools', spot: 'export' }, { shot: 'day-tools', spot: 'share' } ] }
      ],
      options: [
        { id: 'actions', items: [
          { id: 'recap', shot: 'day-tools', spot: 'recap' }, { id: 'share', shot: 'day-tools', spot: 'share' },
          { id: 'play', shot: 'day-tools', spot: 'play' }, { id: 'cal', shot: 'day-tools', spot: 'cal' },
          { id: 'save', shot: 'day-tools', spot: 'save' }, { id: 'export', shot: 'day-tools', spot: 'export' } ] },
        { id: 'compare', items: [
          { id: 'yday', shot: 'day-tools', spot: 'cmp1', def: 'on' }, { id: 'wday', shot: 'day-tools', spot: 'cmp2' } ] },
        { id: 'sections', items: [
          { id: 'panel', shot: 'day-panel', spot: 'today' }, { id: 'diary', shot: 'day-panel', spot: 'moods' },
          { id: 'time', shot: 'day-time', spot: 'tl' }, { id: 'pats', shot: 'day-time', spot: 'replayed' },
          { id: 'mem', shot: 'day-mem', spot: 'list' }, { id: 'ms', shot: 'day-mem', spot: 'awards' } ] },
        { id: 'memtabs', items: [
          { id: 'otd', shot: 'day-mem', spot: 'otd' }, { id: 'forgot', shot: 'day-mem', spot: 'forgot' },
          { id: 'back', shot: 'day-mem', spot: 'back' }, { id: 'firsth', shot: 'day-mem', spot: 'firsth' },
          { id: 'throw', shot: 'day-mem', spot: 'list' } ] },
        { id: 'mstabs', items: [
          { id: 'hit', shot: 'day-mem', spot: 'mshit' }, { id: 'rec', shot: 'day-mem', spot: 'msrec' },
          { id: 'streak', shot: 'day-mem', spot: 'msstreak' }, { id: 'goal', shot: 'day-mem', spot: 'msgoal' },
          { id: 'near', shot: 'day-mem', spot: 'msnear' } ] },
        { id: 'size', items: [ { id: 'day', shot: 'day-tools', spot: 'title', def: 'Top 20' } ] }
      ],
      challenges: ['day.prev', 'day.cmp', 'day.recap', 'day.cal', 'day.mood', 'day.hour', 'day.tab', 'day.save'],
      quiz: [ { id: 'q1', answer: 1 }, { id: 'q2', answer: 0 }, { id: 'q3', answer: 0 } ],
      tips: [ ['day-tools', 'recap', 'day.recap'], ['day-mem', 'otd', 'day.tab'], ['day-tools', 'cal', 'day.cal'], ['day-panel', 'moods', 'day.mood'] ]
    },

    /* ── Lesson 3: Monthly and Yearly ──────────────────────────────── */
    { id: 'periods', area: 'charts', nav: 'month', mins: 6, cover: 'month-top',
      scenes: [
        { id: 'mtop', shot: 'month-top', phone: true,
          spots: ['monthly', 'yearly', 'label', 'banner', 'peak', 'tiles', 'days', 'day', 'best', 'share'] },
        { id: 'mchart', shot: 'month-chart', spots: ['title', 'heads', 'months', 'newe', 'up', 'plays'] },
        { id: 'mnew', shot: 'month-new',
          spots: ['bar', 'tabs', 'fold', 'chip1', 'chip2', 'chip3', 'row', 'debut', 'biggest', 'caps', 'ndays'] },
        { id: 'cert', shot: 'month-cert', spots: ['title', 'count', 'filter', 'plaque', 'hint', 'collapse'] },
        { id: 'ytop', shot: 'year-top', phone: true, spots: ['yearly', 'label', 'banner', 'peak', 'tiles', 'months', 'best'] },
        { id: 'ychart', shot: 'year-chart', spots: ['title', 'search', 'heads', 'years', 'up', 'newe', 'menu'] }
      ],
      howto: [
        { id: 'month', challenge: 'per.day', slides: [
          { shot: 'month-top', spot: 'monthly' }, { shot: 'month-top', spot: 'label' }, { shot: 'month-top', spot: 'day' } ] },
        { id: 'year', challenge: 'per.year', slides: [
          { shot: 'year-top', spot: 'yearly' }, { shot: 'year-top', spot: 'label' }, { shot: 'year-top', spot: 'months' } ] },
        { id: 'peaks', slides: [ { shot: 'month-top', spot: 'peak' }, { shot: 'year-top', spot: 'peak' } ] },
        { id: 'newones', challenge: 'per.new', slides: [
          { shot: 'month-new', spot: 'tabs' }, { shot: 'month-new', spot: 'chip2' },
          { shot: 'month-new', spot: 'debut' }, { shot: 'month-new', spot: 'caps' } ] },
        { id: 'cert', challenge: 'per.cert', slides: [
          { shot: 'month-cert', spot: 'filter' }, { shot: 'month-cert', spot: 'plaque' }, { shot: 'month-cert', spot: 'hint' } ] },
        { id: 'find', challenge: 'per.search', slides: [ { shot: 'year-chart', spot: 'search' }, { shot: 'year-chart', spot: 'up' } ] }
      ],
      options: [
        { id: 'size', items: [
          { id: 'month', shot: 'month-chart', spot: 'title', def: 'Top 50' },
          { id: 'year', shot: 'year-chart', spot: 'title', def: 'Top 100' } ] },
        { id: 'peaks', items: [
          { id: 'alltime', shot: 'month-top', spot: 'peak' }, { id: 'attime', shot: 'year-top', spot: 'peak' } ] },
        { id: 'newchips', items: [
          { id: 'all', shot: 'month-new', spot: 'chip1', def: 'on' }, { id: 'made', shot: 'month-new', spot: 'chip2' },
          { id: 'artists', shot: 'month-new', spot: 'chip3' } ] },
        { id: 'certf', items: [ { id: 'filter', shot: 'month-cert', spot: 'filter' } ] }
      ],
      challenges: ['per.month', 'per.year', 'per.day', 'per.new', 'per.cert', 'per.search'],
      quiz: [ { id: 'q1', answer: 0 }, { id: 'q2', answer: 0 }, { id: 'q3', answer: 0 } ],
      tips: [ ['month-top', 'day', 'per.day'], ['month-new', 'chip2', 'per.new'], ['year-chart', 'search', 'per.search'] ]
    },

    /* ── Lesson 4: All-Time ───────────────────────────────────────── */
    { id: 'alltime', area: 'charts', nav: 'alltime', mins: 6, cover: 'at-ati',
      scenes: [
        { id: 'top', shot: 'at-top', phone: true,
          spots: ['alltime', 'label', 'prev', 'banner', 'tiles', 'total', 'years', 'best', 'share'] },
        { id: 'chart', shot: 'at-chart', phone: true, spots: ['tip', 'size', 'hide', 'title', 'search', 'heads', 'menu'] },
        { id: 'ati', shot: 'at-ati', spots: ['head', 'toggle', 'hero', 'fact', 'tiles', 'tile', 'tabs', 'panel'] },
        { id: 'pages', shot: 'at-pages', spots: ['pages', 'label', 'input', 'next', 'last', 'export'] },
        { id: 'travel', shot: 'at-travel', spots: ['label', 'prev', 'next', 'banner', 'tiles'] }
      ],
      howto: [
        { id: 'size', challenge: 'at.size', slides: [
          { shot: 'at-chart', spot: 'tip' }, { shot: 'at-chart', spot: 'size' }, { shot: 'at-ati', spot: 'head' } ] },
        { id: 'facts', challenge: 'at.fact', slides: [
          { shot: 'at-ati', spot: 'fact' }, { shot: 'at-ati', spot: 'tiles' }, { shot: 'at-ati', spot: 'tabs' }, { shot: 'at-ati', spot: 'toggle' } ] },
        { id: 'travel', challenge: 'at.travel', slides: [
          { shot: 'at-top', spot: 'prev' }, { shot: 'at-travel', spot: 'label' },
          { shot: 'at-travel', spot: 'tiles' }, { shot: 'at-travel', spot: 'next' } ] },
        { id: 'find', challenge: 'at.search', slides: [ { shot: 'at-chart', spot: 'search' }, { shot: 'at-pages', spot: 'input' } ] },
        { id: 'export', challenge: 'at.export', slides: [ { shot: 'at-pages', spot: 'export' } ] }
      ],
      options: [
        { id: 'size', items: [ { id: 'sizes', shot: 'at-chart', spot: 'title', def: 'All' } ] },
        { id: 'atitabs', items: [
          { id: 'artists', shot: 'at-ati', spot: 'tabs' }, { id: 'eras', shot: 'at-ati', spot: 'tabs' },
          { id: 'plays', shot: 'at-ati', spot: 'tabs' }, { id: 'badges', shot: 'at-ati', spot: 'tabs' },
          { id: 'newyear', shot: 'at-ati', spot: 'tabs' } ] },
        { id: 'export', items: [ { id: 'txt', shot: 'at-pages', spot: 'export' }, { id: 'csv', shot: 'at-pages', spot: 'export' },
          { id: 'pdf', shot: 'at-pages', spot: 'export' } ] }
      ],
      challenges: ['at.size', 'at.fact', 'at.stats', 'at.travel', 'at.search', 'at.export'],
      quiz: [ { id: 'q1', answer: 0 }, { id: 'q2', answer: 0 }, { id: 'q3', answer: 0 } ],
      tips: [ ['at-top', 'prev', 'at.travel'], ['at-ati', 'fact', 'at.fact'], ['at-chart', 'search', 'at.search'] ]
    },
    /* ── Lesson 5: Around the chart, and taking it out of the app ───── */
    { id: 'around', area: 'charts', nav: 'week', mins: 7, cover: 'share',
      scenes: [
        { id: 'bu', shot: 'atc-bu',
          spots: ['bar', 'tbu', 'toff', 'tnew', 'fold', 'sub', 'meter', 'info', 'rank', 'badge', 'weeks', 'away', 'row'] },
        { id: 'legend', shot: 'atc-legend',
          spots: ['fresh', 'trending', 'persistent', 'fading', 'resurgence', 'resurgent', 'clinging', 'fallen', 'surging', 'freefall', 'yoyo', 'weeks', 'streak'] },
        { id: 'off', shot: 'atc-off', spots: ['toff', 'was', 'exit', 'peak', 'where', 'stats', 'streak', 'row'] },
        { id: 'new', shot: 'atc-new', spots: ['tnew', 'chips', 'debut', 'caps', 'row'] },
        { id: 'share', shot: 'share',
          spots: ['preview', 'tpl', 'swatch', 'format', 'src', 'pick', 'toggles', 'entries', 'text', 'quality', 'copy', 'download'] },
        { id: 'pdf', shot: 'pdf', spots: ['scope', 'all', 'cover', 'bu', 'create'] },
        { id: 'export', shot: 'export', spots: ['names', 'order', 'album', 'list', 'copy', 'txt', 'csv', 'services', 'open'] }
      ],
      howto: [
        { id: 'bu', challenge: 'around.legend', slides: [
          { shot: 'atc-bu', spot: 'tbu' }, { shot: 'atc-bu', spot: 'away' }, { shot: 'atc-bu', spot: 'info' }, { shot: 'atc-legend', spot: 'fresh' } ] },
        { id: 'off', challenge: 'around.tab', slides: [
          { shot: 'atc-off', spot: 'toff' }, { shot: 'atc-off', spot: 'exit' }, { shot: 'atc-off', spot: 'where' } ] },
        { id: 'hide', slides: [ { shot: 'week-menu-show', spot: 'sections' }, { shot: 'atc-bu', spot: 'fold' } ] },
        { id: 'share', challenge: 'around.design', slides: [
          { shot: 'week-menu-actions', spot: 'share' }, { shot: 'share', spot: 'tpl' }, { shot: 'share', spot: 'swatch' },
          { shot: 'share', spot: 'format' }, { shot: 'share-poster', spot: null }, { shot: 'share', spot: 'toggles' },
          { shot: 'share', spot: 'download' } ] },
        { id: 'pdf', challenge: 'around.pdf', slides: [
          { shot: 'week-menu-actions', spot: 'pdf' }, { shot: 'pdf', spot: 'scope' }, { shot: 'pdf', spot: 'create' } ] },
        { id: 'export', challenge: 'around.export', slides: [
          { shot: 'week-menu-actions', spot: 'export' }, { shot: 'export', spot: 'names' }, { shot: 'export', spot: 'copy' },
          { shot: 'export', spot: 'services' }, { shot: 'export', spot: 'open' } ] },
        { id: 'play', challenge: 'around.play', slides: [
          { shot: 'week-menu-actions', spot: 'playall' }, { shot: 'week-menu-actions', spot: 'shuffle' } ] }
      ],
      options: [
        { id: 'tabs', items: [
          { id: 'bu', shot: 'atc-bu', spot: 'tbu' }, { id: 'off', shot: 'atc-bu', spot: 'toff' }, { id: 'new', shot: 'atc-bu', spot: 'tnew' } ] },
        { id: 'tags', items: [
          { id: 'fresh', shot: 'atc-legend', spot: 'fresh' }, { id: 'trending', shot: 'atc-legend', spot: 'trending' },
          { id: 'persistent', shot: 'atc-legend', spot: 'persistent' }, { id: 'fading', shot: 'atc-legend', spot: 'fading' },
          { id: 'resurgence', shot: 'atc-legend', spot: 'resurgence' }, { id: 'resurgent', shot: 'atc-legend', spot: 'resurgent' },
          { id: 'clinging', shot: 'atc-legend', spot: 'clinging' }, { id: 'fallen', shot: 'atc-legend', spot: 'fallen' },
          { id: 'surging', shot: 'atc-legend', spot: 'surging' }, { id: 'freefall', shot: 'atc-legend', spot: 'freefall' },
          { id: 'yoyo', shot: 'atc-legend', spot: 'yoyo' }, { id: 'weeks', shot: 'atc-legend', spot: 'weeks' },
          { id: 'streak', shot: 'atc-legend', spot: 'streak' } ] },
        { id: 'design', items: [
          { id: 'tpl', shot: 'share', spot: 'tpl', def: 'Editorial' }, { id: 'pal', shot: 'share', spot: 'swatch' },
          { id: 'fmt', shot: 'share', spot: 'format', def: '1:1' }, { id: 'art', shot: 'share', spot: 'src', def: 'Deezer' },
          { id: 'pick', shot: 'share', spot: 'pick' }, { id: 'show', shot: 'share', spot: 'toggles', def: 'on' },
          { id: 'entries', shot: 'share', spot: 'entries' }, { id: 'text', shot: 'share', spot: 'text', def: '100%' },
          { id: 'quality', shot: 'share', spot: 'quality' } ] },
        { id: 'pdf', items: [
          { id: 'scope', shot: 'pdf', spot: 'scope' }, { id: 'cover', shot: 'pdf', spot: 'cover', def: 'on' }, { id: 'bu', shot: 'pdf', spot: 'bu', def: 'on' } ] },
        { id: 'export', items: [
          { id: 'names', shot: 'export', spot: 'names' }, { id: 'order', shot: 'export', spot: 'order' },
          { id: 'album', shot: 'export', spot: 'album', def: 'off' }, { id: 'copy', shot: 'export', spot: 'copy' },
          { id: 'files', shot: 'export', spot: 'txt' }, { id: 'soundiiz', shot: 'export', spot: 'open' } ] }
      ],
      challenges: ['around.tab', 'around.legend', 'around.share', 'around.design', 'around.pdf', 'around.export', 'around.copy', 'around.play'],
      quiz: [ { id: 'q1', answer: 0 }, { id: 'q2', answer: 0 }, { id: 'q3', answer: 0 } ],
      tips: [ ['atc-bu', 'info', 'around.legend'], ['share', 'tpl', 'around.design'], ['export', 'services', 'around.export'] ]
    },
    /* ── Lesson 6: song, artist and album windows, search, streaks ─── */
    { id: 'windows', area: 'charts', nav: 'week', mins: 8, cover: 'win-song',
      scenes: [
        { id: 'song', shot: 'win-song',
          spots: ['art', 'title', 'sub', 'sample', 'playlist', 'rate', 'more', 'links', 'share', 'tabs', 'close', 'hero', 'span', 'trio', 'favs', 'habits', 'rating', 'trophies'] },
        { id: 'songcharts', shot: 'win-song-charts', spots: ['rktop', 'rkhero', 'plot', 'detail', 'moments', 'fam', 'hof', 'run'] },
        { id: 'songlisten', shot: 'win-song-listening', spots: ['lshero', 'spark', 'found', 'along', 'clock', 'seasons', 'miles', 'next', 'heat', 'more'] },
        { id: 'artist', shot: 'win-artist', spots: ['tabs', 'hero', 'favs', 'habits', 'slam', 'trophies', 'rating'] },
        { id: 'music', shot: 'win-artist-music', spots: ['top', 'intro', 'charts', 'sum', 'tools', 'list'] },
        { id: 'awards', shot: 'win-artist-awards', spots: ['sw', 'real'] },
        { id: 'album', shot: 'win-album', spots: ['hero', 'favs', 'habits', 'rating', 'trophies', 'plaques'] },
        { id: 'menus', shot: 'week-rowmenu', spots: ['more', 'menu', 'change'] },
        // The cover picker (⋮ → Change image, the ✎ on a cover, or press-and-hold on a phone)
        { id: 'cover', shot: 'cover-picker',
          spots: ['now', 'title', 'deezer', 'current', 'itunes', 'tile', 'lastfm', 'youtube', 'url', 'set', 'none', 'auto', 'close'] },
        { id: 'search', shot: 'search', spots: ['field', 'esc', 'group', 'top', 'n', 'songs', 'foot'] },
        { id: 'hist', shot: 'search-hist', spots: ['chips', 'chip', 'item', 'rm', 'clear'] },
        { id: 'streak', shot: 'streak-records', spots: ['today', 'fire', 'recs', 'cal', 'fame', 'badges'] },
        { id: 'streakcal', shot: 'streak-cal', spots: ['cal', 'filters', 'wrap'] }
      ],
      howto: [
        { id: 'open', challenge: 'win.song', slides: [
          { shot: 'week-rows', spot: 'title' }, { shot: 'win-song', spot: 'tabs' }, { shot: 'win-song', spot: 'favs' }, { shot: 'win-song', spot: 'close' } ] },
        { id: 'find', challenge: 'win.search', slides: [
          { shot: 'search', spot: 'field' }, { shot: 'search', spot: 'top' }, { shot: 'search', spot: 'foot' }, { shot: 'search-hist', spot: 'item' } ] },
        { id: 'history', challenge: 'win.tab', slides: [
          { shot: 'win-song-charts', spot: 'plot' }, { shot: 'win-song-charts', spot: 'moments' },
          { shot: 'win-song-listening', spot: 'found' }, { shot: 'win-song-listening', spot: 'miles' } ] },
        { id: 'artist', challenge: 'win.artist', slides: [
          { shot: 'win-artist', spot: 'tabs' }, { shot: 'win-artist-music', spot: 'tools' }, { shot: 'win-artist-awards', spot: 'sw' } ] },
        { id: 'cover', challenge: 'win.cover', slides: [
          { shot: 'cover-hover', spot: 'pencil' }, { shot: 'week-rowmenu', spot: 'change' },
          { shot: 'cover-picker', spot: 'current' }, { shot: 'cover-picker', spot: 'tile' },
          { shot: 'cover-picker', spot: 'url' }, { shot: 'cover-picker', spot: 'auto' },
          { shot: 'week-rows', spot: 'art' } ] },
        { id: 'menu', challenge: 'win.menu', slides: [ { shot: 'week-rows', spot: 'more' }, { shot: 'week-rowmenu', spot: 'menu' }, { shot: 'win-song', spot: 'more' } ] },
        { id: 'streak', challenge: 'win.streak', slides: [
          { shot: 'week-top', spot: 'streak' }, { shot: 'streak-records', spot: 'fame' },
          { shot: 'streak-records', spot: 'badges' }, { shot: 'streak-cal', spot: 'wrap' } ] }
      ],
      options: [
        { id: 'tabs', items: [
          { id: 'song', shot: 'win-song', spot: 'tabs' }, { id: 'artist', shot: 'win-artist', spot: 'tabs' }, { id: 'album', shot: 'win-album', spot: 'tabs' } ] },
        { id: 'buttons', items: [
          { id: 'sample', shot: 'win-song', spot: 'sample' }, { id: 'playlist', shot: 'win-song', spot: 'playlist' },
          { id: 'rate', shot: 'win-song', spot: 'rate' }, { id: 'share', shot: 'win-song', spot: 'share' },
          { id: 'more', shot: 'win-song', spot: 'more' }, { id: 'links', shot: 'win-song', spot: 'links' } ] },
        { id: 'cover', items: [
          { id: 'open', shot: 'cover-hover', spot: 'pencil' }, { id: 'sources', shot: 'cover-picker', spot: 'itunes' },
          { id: 'link', shot: 'cover-picker', spot: 'url' }, { id: 'none', shot: 'cover-picker', spot: 'none' },
          { id: 'auto', shot: 'cover-picker', spot: 'auto', def: 'on' } ] },
        { id: 'music', items: [ { id: 'sorts', shot: 'win-artist-music', spot: 'tools' }, { id: 'charts', shot: 'win-artist-music', spot: 'charts' } ] },
        { id: 'streaktabs', items: [
          { id: 'today', shot: 'streak-records', spot: 'today' }, { id: 'fire', shot: 'streak-records', spot: 'fire' },
          { id: 'recs', shot: 'streak-records', spot: 'recs' }, { id: 'cal', shot: 'streak-records', spot: 'cal' } ] }
      ],
      challenges: ['win.song', 'win.artist', 'win.album', 'win.tab', 'win.search', 'win.menu', 'win.cover', 'win.streak'],
      quiz: [ { id: 'q1', answer: 0 }, { id: 'q2', answer: 0 }, { id: 'q3', answer: 0 } ],
      tips: [ ['search', 'field', 'win.search'], ['win-song-listening', 'found', 'win.tab'], ['streak-records', 'badges', 'win.streak'], ['cover-hover', 'pencil', 'win.cover'] ]
    },
    /* ── Lesson 7: Stats (Overview, Story, Games, Compare, Graphs) ── */
    { id: 'stats', area: 'insights', nav: 'graphs', mins: 9, cover: 'stats-top',
      scenes: [
        // The range bar, the five tabs and the Overview's sentence and tiles
        { id: 'top', shot: 'stats-top', phone: true,
          spots: ['presets', 'dates', 'tabs', 'line', 'share', 'tile', 'delta', 'trend', 'sub', 'go'] },
        { id: 'ov', shot: 'stats-ov',
          spots: ['top5', 't5seg', 't5lead', 't5rows', 'sotp', 'movers', 'mvseg', 'persona', 'facts', 'shuffle', 'cal', 'calmore', 'otd', 'split'] },
        { id: 'story', shot: 'stats-story',
          spots: ['obs', 'obsone', 'eras', 'drift', 'driftkeys', 'loyal', 'comfort', 'disc', 'fun', 'miles'] },
        { id: 'games', shot: 'stats-games', spots: ['head', 'tally', 'daily', 'dailygo', 'card', 'tag', 'go'] },
        // Higher or lower, open full screen
        { id: 'game', shot: 'stats-game', spots: ['title', 'score', 'close', 'q', 'known', 'guess', 'btns'] },
        { id: 'cmp', shot: 'stats-cmp', phone: true,
          spots: ['gran', 'top', 'saved', 'types', 'modes', 'chip', 'x', 'add', 'legend', 'chart', 'verdict'] },
        { id: 'cmpmore', shot: 'stats-cmp-more', spots: ['h2h', 'share', 'table', 'own', 'gaps', 'ts', 'hab'] },
        { id: 'run', shot: 'stats-run', spots: ['run', 'crun', 'chart'] },
        { id: 'race', shot: 'stats-race', spots: ['race', 'canvas', 'start', 'play', 'step', 'seek', 'speeds', 'gif', 'range'] },
        { id: 'vol', shot: 'stats-vol', phone: true, spots: ['gran', 'mode', 'labels', 'zoom', 'figs', 'busiest', 'canvas'] },
        // What opens under the volume chart when a bar (or the busiest period) is tapped
        { id: 'drill', shot: 'stats-drill', spots: ['when', 'step', 'figs', 'hero', 'spark', 'tabs', 'rows', 'open'] },
        { id: 'clock', shot: 'stats-clock', spots: ['clock', 'parts', 'cnote', 'wfigs', 'week', 'wnote'] },
        { id: 'heat', shot: 'stats-heat',
          spots: ['types', 'colors', 'year', 'best', 'figs', 'grid', 'strip', 'patterns', 'scope', 'rhythm', 'hours'] }
      ],
      howto: [
        { id: 'range', challenge: 'stats.range', slides: [
          { shot: 'stats-top', spot: 'presets' }, { shot: 'stats-top', spot: 'dates' },
          { shot: 'stats-top', spot: 'tabs' }, { shot: 'stats-cmp', spot: 'gran' } ] },
        { id: 'overview', challenge: 'stats.go', slides: [
          { shot: 'stats-top', spot: 'line' }, { shot: 'stats-top', spot: 'delta' }, { shot: 'stats-top', spot: 'go' },
          { shot: 'stats-ov', spot: 't5seg' }, { shot: 'stats-ov', spot: 'movers' }, { shot: 'stats-ov', spot: 'cal' } ] },
        { id: 'story', challenge: 'stats.story', slides: [
          { shot: 'stats-top', spot: 'tabs' }, { shot: 'stats-story', spot: 'obs' }, { shot: 'stats-story', spot: 'eras' },
          { shot: 'stats-story', spot: 'drift' }, { shot: 'stats-story', spot: 'disc' } ] },
        { id: 'game', challenge: 'stats.game', slides: [
          { shot: 'stats-games', spot: 'daily' }, { shot: 'stats-games', spot: 'go' }, { shot: 'stats-game', spot: 'btns' },
          { shot: 'stats-game', spot: 'score' }, { shot: 'stats-game', spot: 'close' }, { shot: 'stats-games', spot: 'tally' } ] },
        { id: 'compare', challenge: 'stats.add', slides: [
          { shot: 'stats-cmp', spot: 'types' }, { shot: 'stats-cmp', spot: 'add' }, { shot: 'stats-cmp', spot: 'chip' },
          { shot: 'stats-cmp', spot: 'modes' }, { shot: 'stats-cmp', spot: 'legend' }, { shot: 'stats-cmp-more', spot: 'h2h' },
          { shot: 'stats-cmp', spot: 'saved' } ] },
        { id: 'race', challenge: 'stats.race', slides: [
          { shot: 'stats-race', spot: 'race' }, { shot: 'stats-race', spot: 'play' }, { shot: 'stats-race', spot: 'seek' },
          { shot: 'stats-race', spot: 'speeds' }, { shot: 'stats-race', spot: 'gif' } ] },
        { id: 'drill', challenge: 'stats.drill', slides: [
          { shot: 'stats-vol', spot: 'canvas' }, { shot: 'stats-vol', spot: 'busiest' }, { shot: 'stats-drill', spot: 'when' },
          { shot: 'stats-drill', spot: 'tabs' }, { shot: 'stats-drill', spot: 'open' } ] },
        { id: 'heat', challenge: 'stats.heat', slides: [
          { shot: 'stats-heat', spot: 'grid' }, { shot: 'stats-heat', spot: 'year' }, { shot: 'stats-heat', spot: 'types' },
          { shot: 'stats-heat', spot: 'colors' }, { shot: 'stats-heat', spot: 'hours' } ] }
      ],
      options: [
        { id: 'range', items: [
          { id: 'presets', shot: 'stats-top', spot: 'presets', def: '{{t:range_12m}}' },
          { id: 'dates', shot: 'stats-top', spot: 'dates' },
          { id: 'gran', shot: 'stats-cmp', spot: 'gran', def: '{{t:gran_monthly}}' } ] },
        { id: 'tabs', items: [
          { id: 'overview', shot: 'stats-top', spot: 'tabs', def: 'on' }, { id: 'story', shot: 'stats-story', spot: 'obs' },
          { id: 'games', shot: 'stats-games', spot: 'card' }, { id: 'compare', shot: 'stats-cmp', spot: 'chart' },
          { id: 'charts', shot: 'stats-vol', spot: 'canvas' } ] },
        { id: 'overview', items: [
          { id: 'share', shot: 'stats-top', spot: 'share' }, { id: 't5seg', shot: 'stats-ov', spot: 't5seg', def: '{{t:sx_cmp_type_songs}}' },
          { id: 'mvseg', shot: 'stats-ov', spot: 'mvseg', def: '{{t:sx_cmp_type_songs}}' }, { id: 'shuffle', shot: 'stats-ov', spot: 'shuffle' } ] },
        { id: 'compare', items: [
          { id: 'types', shot: 'stats-cmp', spot: 'types', def: '{{t:sx_cmp_type_artists}}' },
          { id: 'modes', shot: 'stats-cmp', spot: 'modes', def: '{{t:sx_cmp_mode_cum}}' },
          { id: 'crun', shot: 'stats-run', spot: 'crun', def: '{{t:nav_weekly}}' },
          { id: 'top', shot: 'stats-cmp', spot: 'top' }, { id: 'saved', shot: 'stats-cmp', spot: 'saved' },
          { id: 'legend', shot: 'stats-cmp', spot: 'legend' }, { id: 'h2hshare', shot: 'stats-cmp-more', spot: 'share' } ] },
        { id: 'race', items: [
          { id: 'speeds', shot: 'stats-race', spot: 'speeds', def: '1×' }, { id: 'gif', shot: 'stats-race', spot: 'gif' },
          { id: 'range', shot: 'stats-race', spot: 'range' } ] },
        { id: 'graphs', items: [
          { id: 'mode', shot: 'stats-vol', spot: 'mode', def: '{{t:sx_vol_mode_plays}}' }, { id: 'labels', shot: 'stats-vol', spot: 'labels', def: 'off' },
          { id: 'zoom', shot: 'stats-vol', spot: 'zoom' }, { id: 'drtabs', shot: 'stats-drill', spot: 'tabs', def: '{{t:sx_dr_tab_top}}' },
          { id: 'hmtypes', shot: 'stats-heat', spot: 'types', def: '{{t:hm_type_all}}' }, { id: 'colors', shot: 'stats-heat', spot: 'colors' },
          { id: 'scope', shot: 'stats-heat', spot: 'scope' } ] }
      ],
      challenges: ['stats.range', 'stats.story', 'stats.go', 'stats.game', 'stats.add', 'stats.race', 'stats.drill', 'stats.heat'],
      quiz: [ { id: 'q1', answer: 0 }, { id: 'q2', answer: 1 }, { id: 'q3', answer: 2 } ],
      tips: [ ['stats-top', 'delta', 'stats.range'], ['stats-race', 'play', 'stats.race'], ['stats-games', 'daily', 'stats.game'],
        ['stats-drill', 'tabs', 'stats.drill'], ['stats-heat', 'colors', 'stats.heat'] ]
    },
    /* ── Lesson 8: Records (eleven sections, the plaque wall) ─────── */
    { id: 'records', area: 'insights', nav: 'records', mins: 8, cover: 'rec-top',
      scenes: [
        // The page: its menu (a Section picker on a phone), the search and the Overview's hero
        { id: 'top', shot: 'rec-top', phone: true,
          spots: ['intro', 'search', 'nav', 'grp', 'count', 'picker', 'hero', 'reel', 'card'] },
        { id: 'ov', shot: 'rec-ov', spots: ['intro', 'types', 'grp', 'cell', 'value', 'sw'] },
        // Every section after Overview looks like All #1s
        { id: 'ones', shot: 'rec-ones', phone: true,
          spots: ['story', 'ent', 'per', 'run', 'sort', 'champ', 'boxes', 'sample', 'details', 'runner'] },
        { id: 'list', shot: 'rec-list', spots: ['heads', 'all', 'name', 'tl', 'date', 'toggle', 'runrow'] },
        { id: 'sort', shot: 'rec-sort', spots: ['btn', 'rank', 'recent', 'oldest', 'name'] },
        { id: 'foot', shot: 'rec-foot', spots: ['note', 'show', 'sizes'] },
        { id: 'search', shot: 'rec-search', spots: ['field', 'clear', 'status', 'nav'] },
        { id: 'pak', shot: 'rec-pak', spots: ['story', 'about', 'info', 'infotext', 'per', 'champ', 'details'] },
        { id: 'nc', shot: 'rec-nc', spots: ['about', 'tabs', 'title', 'fold', 'champ'] },
        { id: 'mil', shot: 'rec-mil', spots: ['tabs', 'sub', 'tier', 'art', 'more'] },
        { id: 'fast', shot: 'rec-fast', spots: ['tabs', 'pick', 'sub', 'champ'] },
        { id: 'streaks', shot: 'rec-streaks', spots: ['ent', 'per', 'b2b', 'sub', 'champ'] },
        { id: 'certs', shot: 'rec-certs', spots: ['story', 'tiers', 'card', 'total', 'bar', 'tally', 'open'] },
        // What Show every certification opens under the wall
        { id: 'ledger', shot: 'rec-ledger', spots: ['tally', 'facts', 'types', 'tiers', 'sort', 'medal', 'row', 'journey'] }
      ],
      howto: [
        { id: 'find', challenge: 'rec.view', slides: [
          { shot: 'rec-top', spot: 'nav' }, { shot: 'rec-top-m', spot: 'picker' }, { shot: 'rec-top', spot: 'count' },
          { shot: 'rec-ones', spot: 'story' } ] },
        { id: 'overview', challenge: 'rec.per', slides: [
          { shot: 'rec-top', spot: 'hero' }, { shot: 'rec-top', spot: 'reel' }, { shot: 'rec-ov', spot: 'types' },
          { shot: 'rec-ov', spot: 'cell' }, { shot: 'rec-ov', spot: 'sw' } ] },
        { id: 'types', challenge: 'rec.ent', slides: [
          { shot: 'rec-ones', spot: 'ent' }, { shot: 'rec-ones', spot: 'per' }, { shot: 'rec-mil', spot: 'tabs' },
          { shot: 'rec-fast', spot: 'pick' } ] },
        { id: 'read', challenge: 'rec.run', slides: [
          { shot: 'rec-ones', spot: 'champ' }, { shot: 'rec-ones', spot: 'boxes' }, { shot: 'rec-ones', spot: 'runner' },
          { shot: 'rec-list', spot: 'tl' }, { shot: 'rec-list', spot: 'toggle' }, { shot: 'rec-list', spot: 'all' } ] },
        { id: 'count', challenge: 'rec.consec', slides: [
          { shot: 'rec-ones', spot: 'run' }, { shot: 'rec-ones', spot: 'story' }, { shot: 'rec-sort', spot: 'btn' },
          { shot: 'rec-list', spot: 'heads' } ] },
        { id: 'search', challenge: 'rec.search', slides: [
          { shot: 'rec-search', spot: 'field' }, { shot: 'rec-search', spot: 'status' }, { shot: 'rec-search', spot: 'nav' },
          { shot: 'rec-search', spot: 'clear' } ] },
        { id: 'certs', challenge: 'rec.ledger', slides: [
          { shot: 'rec-certs', spot: 'tiers' }, { shot: 'rec-certs', spot: 'card' }, { shot: 'rec-certs', spot: 'open' },
          { shot: 'rec-ledger', spot: 'facts' }, { shot: 'rec-ledger', spot: 'types' }, { shot: 'rec-ledger', spot: 'row' } ] },
        { id: 'more', challenge: 'rec.show', slides: [
          { shot: 'rec-foot', spot: 'note' }, { shot: 'rec-foot', spot: 'sizes' } ] }
      ],
      options: [
        { id: 'sections', items: [
          { id: 'ones', shot: 'rec-top', spot: 'n-AllOnes' }, { id: 'pak', shot: 'rec-top', spot: 'n-PAK' },
          { id: 'app', shot: 'rec-top', spot: 'n-Appearances' }, { id: 'debuts', shot: 'rec-top', spot: 'n-Debuts' },
          { id: 'nc', shot: 'rec-top', spot: 'n-NewCharts' }, { id: 'plays', shot: 'rec-top', spot: 'n-PeakPlays' },
          { id: 'mil', shot: 'rec-top', spot: 'n-Milestones' }, { id: 'fast', shot: 'rec-top', spot: 'n-Fastest' },
          { id: 'streaks', shot: 'rec-top', spot: 'n-Streaks' }, { id: 'certs', shot: 'rec-top', spot: 'n-Certs' } ] },
        { id: 'switches', items: [
          { id: 'ent', shot: 'rec-ones', spot: 'ent', def: '{{t:sx_cmp_type_songs}}' },
          { id: 'per', shot: 'rec-ones', spot: 'per', def: '{{t:nav_weekly}}' },
          { id: 'run', shot: 'rec-ones', spot: 'run', def: '{{t:rec_run_total}}' },
          { id: 'sort', shot: 'rec-sort', spot: 'btn', def: '{{t:rec1_sort_rank}}' },
          { id: 'show', shot: 'rec-foot', spot: 'sizes', def: '25' },
          { id: 'all', shot: 'rec-list', spot: 'all' } ] },
        { id: 'overview', items: [
          { id: 'types', shot: 'rec-ov', spot: 'types', def: '{{t:sx_cmp_type_songs}}' }, { id: 'sw', shot: 'rec-ov', spot: 'sw' } ] },
        { id: 'special', items: [
          { id: 'pakinfo', shot: 'rec-pak', spot: 'info' }, { id: 'b2b', shot: 'rec-streaks', spot: 'b2b' },
          { id: 'fastpick', shot: 'rec-fast', spot: 'pick' }, { id: 'milmore', shot: 'rec-mil', spot: 'more' },
          { id: 'ncfold', shot: 'rec-nc', spot: 'fold' } ] },
        { id: 'certs', items: [
          { id: 'open', shot: 'rec-certs', spot: 'open' }, { id: 'types', shot: 'rec-ledger', spot: 'types', def: '{{t:certd_all}}' },
          { id: 'tiers', shot: 'rec-ledger', spot: 'tiers', def: '{{t:certd_all}}' }, { id: 'sort', shot: 'rec-ledger', spot: 'sort' } ] }
      ],
      challenges: ['rec.view', 'rec.ent', 'rec.per', 'rec.consec', 'rec.run', 'rec.search', 'rec.ledger', 'rec.show'],
      quiz: [ { id: 'q1', answer: 1 }, { id: 'q2', answer: 0 }, { id: 'q3', answer: 2 } ],
      tips: [ ['rec-search', 'field', 'rec.search'], ['rec-ones', 'run', 'rec.consec'], ['rec-certs', 'open', 'rec.ledger'],
        ['rec-pak', 'info'], ['rec-ov', 'sw', 'rec.per'] ]
    },
    /* ── Lesson 9: Awards (My Grammys, the ceremony, Real-Life Awards) ── */
    { id: 'awards', area: 'insights', nav: 'awards', mins: 9, cover: 'aw-view-collage',
      scenes: [
        { id: 'top', shot: 'aw-top', phone: true, spots: ['sub', 'year', 'config', 'gen', 'cer', 'share', 'sum', 'tools', 'views'] },
        // A year nobody has set up yet
        { id: 'empty', shot: 'aw-empty', spots: ['year', 'gen', 'card', 'onoff', 'fav', 'pick'] },
        { id: 'cards', shot: 'aw-cards', phone: true,
          spots: ['left', 'hide', 'fold', 'views', 'hint', 'head', 'onoff', 'fav', 'fold1', 'winner', 'nom', 'change', 'playlist', 'reorder'] },
        { id: 'config', shot: 'aw-config',
          spots: ['elig', 'gemini', 'credit', 'hideplays', 'rating', 'samples', 'count', 'bulk', 'favs', 'search', 'type', 'status', 'groups', 'group', 'cat', 'catfav'] },
        { id: 'picker', shot: 'aw-picker',
          spots: ['title', 'fav', 'close', 'ballot', 'tally', 'quick', 'nom', 'clip', 'x', 'search', 'sort', 'group', 'row', 'save'] },
        { id: 'sum', shot: 'aw-sum', spots: ['head', 'toggle'] },
        { id: 'intro', shot: 'aw-cer-intro', spots: ['badge', 'dots', 'cats', 'sound', 'close', 'title', 'slide', 'progress', 'next'] },
        { id: 'cat', shot: 'aw-cer-cat', spots: ['title', 'noms', 'nom', 'env', 'meet', 'open', 'prev', 'progress', 'next'] },
        { id: 'win', shot: 'aw-cer-win', spots: ['label', 'name', 'art', 'play', 'next'] },
        { id: 'fin', shot: 'aw-cer-fin', spots: ['grid', 'card', 'stats'] },
        { id: 'side', shot: 'aw-cer-side', spots: ['cats', 'side'] },
        { id: 'share', shot: 'aw-share', spots: ['title', 'body', 'foot'] },
        { id: 'real', shot: 'aw-real', spots: ['sub', 'shows', 'year', 'head', 'sub2', 'tally', 'card', 'plays', 'won', 'nomd', 'work'] }
      ],
      howto: [
        { id: 'setup', challenge: 'aw.config', slides: [
          { shot: 'aw-top', spot: 'year' }, { shot: 'aw-top', spot: 'config' }, { shot: 'aw-config', spot: 'elig' },
          { shot: 'aw-config', spot: 'groups' }, { shot: 'aw-config', spot: 'cat' }, { shot: 'aw-config', spot: 'samples' } ] },
        { id: 'gen', challenge: 'aw.gen', slides: [
          { shot: 'aw-empty', spot: 'gen' }, { shot: 'aw-cards', spot: 'card' }, { shot: 'aw-cards', spot: 'nom' } ] },
        { id: 'pick', challenge: 'aw.pick', slides: [
          { shot: 'aw-cards', spot: 'change' }, { shot: 'aw-picker', spot: 'row' }, { shot: 'aw-picker', spot: 'search' },
          { shot: 'aw-picker', spot: 'quick' }, { shot: 'aw-picker', spot: 'nom' }, { shot: 'aw-picker', spot: 'save' } ] },
        { id: 'win', challenge: 'aw.win', slides: [
          { shot: 'aw-cards', spot: 'hint' }, { shot: 'aw-cards', spot: 'winner' }, { shot: 'aw-cards', spot: 'left' },
          { shot: 'aw-cards', spot: 'hide' } ] },
        { id: 'view', challenge: 'aw.view', slides: [
          { shot: 'aw-cards', spot: 'views' }, { shot: 'aw-view-spotlight', spot: 'btn' }, { shot: 'aw-view-tiles', spot: 'btn' },
          { shot: 'aw-view-collage', spot: 'btn' }, { shot: 'aw-view-reel', spot: 'btn' } ] },
        { id: 'cer', challenge: 'aw.cer', slides: [
          { shot: 'aw-top', spot: 'cer' }, { shot: 'aw-cer-intro', spot: 'slide' }, { shot: 'aw-cer-intro', spot: 'next' },
          { shot: 'aw-cer-cat', spot: 'meet' }, { shot: 'aw-cer-cat', spot: 'open' }, { shot: 'aw-cer-win', spot: 'name' },
          { shot: 'aw-cer-cat', spot: 'next' }, { shot: 'aw-cer-fin', spot: 'grid' } ] },
        { id: 'share', challenge: 'aw.reveal', slides: [
          { shot: 'aw-cer-side', spot: 'side' }, { shot: 'aw-cer-intro', spot: 'sound' }, { shot: 'aw-top', spot: 'share' },
          { shot: 'aw-share', spot: 'foot' } ] },
        { id: 'real', challenge: 'aw.real', slides: [
          { shot: 'aw-real', spot: 'sub' }, { shot: 'aw-real', spot: 'shows' }, { shot: 'aw-real', spot: 'year' },
          { shot: 'aw-real', spot: 'tally' }, { shot: 'aw-real', spot: 'card' } ] }
      ],
      options: [
        { id: 'bar', items: [
          { id: 'year', shot: 'aw-top', spot: 'year' }, { id: 'config', shot: 'aw-top', spot: 'config' },
          { id: 'gen', shot: 'aw-top', spot: 'gen' }, { id: 'cer', shot: 'aw-top', spot: 'cer' }, { id: 'share', shot: 'aw-top', spot: 'share' } ] },
        { id: 'views', big: true, items: [
          { id: 'ballot', shot: 'aw-cards', spot: 'card', crop: 'area', def: 'on' },
          { id: 'spotlight', shot: 'aw-view-spotlight', spot: 'list', crop: 'area' },
          { id: 'tiles', shot: 'aw-view-tiles', spot: 'list', crop: 'area' },
          { id: 'collage', shot: 'aw-view-collage', spot: 'list', crop: 'area' },
          { id: 'reel', shot: 'aw-view-reel', spot: 'list', crop: 'area' } ] },
        { id: 'tools', items: [
          { id: 'hide', shot: 'aw-cards', spot: 'hide', def: 'off' }, { id: 'fold', shot: 'aw-cards', spot: 'fold', def: '{{t:awards_fold_scope_all}}' },
          { id: 'onoff', shot: 'aw-cards', spot: 'onoff' }, { id: 'fav', shot: 'aw-cards', spot: 'fav' },
          { id: 'playlist', shot: 'aw-cards', spot: 'playlist' }, { id: 'reorder', shot: 'aw-cards', spot: 'reorder' } ] },
        { id: 'config', items: [
          { id: 'elig', shot: 'aw-config', spot: 'elig' }, { id: 'gemini', shot: 'aw-config', spot: 'gemini' },
          { id: 'credit', shot: 'aw-config', spot: 'credit' }, { id: 'hideplays', shot: 'aw-config', spot: 'hideplays', def: 'off' },
          { id: 'rating', shot: 'aw-config', spot: 'rating' }, { id: 'samples', shot: 'aw-config', spot: 'samples' },
          { id: 'bulk', shot: 'aw-config', spot: 'bulk' }, { id: 'favs', shot: 'aw-config', spot: 'favs' } ] },
        { id: 'picker', items: [
          { id: 'quick', shot: 'aw-picker', spot: 'quick' }, { id: 'sort', shot: 'aw-picker', spot: 'sort' },
          { id: 'clip', shot: 'aw-picker', spot: 'clip' } ] },
        { id: 'cer', items: [
          { id: 'cats', shot: 'aw-cer-intro', spot: 'cats' }, { id: 'sound', shot: 'aw-cer-intro', spot: 'sound' },
          { id: 'meet', shot: 'aw-cer-cat', spot: 'meet' }, { id: 'open', shot: 'aw-cer-cat', spot: 'open' } ] },
        { id: 'real', items: [ { id: 'shows', shot: 'aw-real', spot: 'shows' } ] }
      ],
      challenges: ['aw.config', 'aw.gen', 'aw.pick', 'aw.win', 'aw.view', 'aw.cer', 'aw.reveal', 'aw.real'],
      quiz: [ { id: 'q1', answer: 2 }, { id: 'q2', answer: 0 }, { id: 'q3', answer: 1 } ],
      tips: [ ['aw-view-collage', 'btn', 'aw.view'], ['aw-cer-cat', 'meet', 'aw.cer'], ['aw-real', 'shows', 'aw.real'],
        ['aw-picker', 'quick', 'aw.pick'], ['aw-config', 'favs', 'aw.config'] ]
    },
    /* ── Lesson 10: Your Soundtrack (twelve chapters, Play your year) ── */
    { id: 'soundtrack', area: 'insights', nav: 'soundtrack', mins: 8, cover: 'st-top',
      scenes: [
        { id: 'top', shot: 'st-top', phone: true,
          spots: ['period', 'nav', 'story', 'replay', 'share', 'hero', 'mosaic', 'stats', 'stat', 'reel', 'pl'] },
        { id: 'artist', shot: 'st-artist', spots: ['name', 'count', 'big', 'favs', 'stats'] },
        { id: 'tops', shot: 'st-tops', spots: ['head', 'songs', 'center', 'prev', 'next', 'count', 'artists', 'albums'] },
        { id: 'no1', shot: 'st-no1', spots: ['head', 'seg', 'sum', 'strip', 'row', 'more'] },
        { id: 'activity', shot: 'st-activity', spots: ['head', 'chart', 'bar'] },
        { id: 'loyalty', shot: 'st-loyalty', spots: ['head', 'ring', 'row', 'next'] },
        { id: 'new', shot: 'st-new', spots: ['head', 'bubbles', 'bubble'] },
        // What a bubble opens
        { id: 'pop', shot: 'st-pop', spots: ['nav', 'name', 'meta', 'play', 'links', 'share', 'stats', 'goal', 'close'] },
        { id: 'mil', shot: 'st-mil', spots: ['head', 'overall', 'artist', 'toggle'] },
        { id: 'streaks', shot: 'st-streaks', spots: ['head', 'cards', 'detail', 'cal', 'chips', 'entity'] },
        { id: 'grammys', shot: 'st-grammys', spots: ['head', 'grid', 'card'] },
        { id: 'end', shot: 'st-end', spots: ['replay', 'share'] },
        { id: 'replay', shot: 'st-replay', spots: ['canvas', 'speed', 'prev', 'pause', 'next', 'stop'] },
        { id: 'story', shot: 'st-story', spots: ['bars', 'close', 'prev', 'next'] },
        { id: 'card', shot: 'st-card', spots: ['preview', 'tpl', 'pal', 'fmt', 'art', 'src', 'topn', 'copy', 'dl'] }
      ],
      howto: [
        { id: 'period', challenge: 'st.period', slides: [
          { shot: 'st-top', spot: 'period' }, { shot: 'st-month', spot: 'month' }, { shot: 'st-alltime', spot: 'all' },
          { shot: 'st-top', spot: 'nav' } ] },
        { id: 'story', challenge: 'st.story', slides: [
          { shot: 'st-top', spot: 'story' }, { shot: 'st-story', spot: 'bars' }, { shot: 'st-story', spot: 'next' },
          { shot: 'st-story', spot: 'close' } ] },
        { id: 'read', challenge: 'st.stat', slides: [
          { shot: 'st-top', spot: 'hero' }, { shot: 'st-top', spot: 'stat' }, { shot: 'st-top', spot: 'reel' },
          { shot: 'st-top', spot: 'pl' }, { shot: 'st-artist', spot: 'favs' } ] },
        { id: 'tops', challenge: 'st.no1', slides: [
          { shot: 'st-tops', spot: 'center' }, { shot: 'st-tops', spot: 'next' }, { shot: 'st-no1', spot: 'seg' },
          { shot: 'st-no1', spot: 'row' }, { shot: 'st-activity', spot: 'bar' } ] },
        { id: 'discover', challenge: 'st.bubble', slides: [
          { shot: 'st-new', spot: 'bubbles' }, { shot: 'st-new', spot: 'bubble' }, { shot: 'st-pop', spot: 'name' },
          { shot: 'st-pop', spot: 'goal' }, { shot: 'st-pop', spot: 'nav' } ] },
        { id: 'replay', challenge: 'st.replay', slides: [
          { shot: 'st-top', spot: 'replay' }, { shot: 'st-end', spot: 'replay' }, { shot: 'st-replay', spot: 'canvas' },
          { shot: 'st-replay', spot: 'pause' }, { shot: 'st-replay', spot: 'speed' } ] },
        { id: 'share', challenge: 'st.card', slides: [
          { shot: 'st-top', spot: 'share' }, { shot: 'st-card', spot: 'tpl' }, { shot: 'st-card', spot: 'pal' },
          { shot: 'st-card', spot: 'fmt' }, { shot: 'st-card', spot: 'dl' } ] }
      ],
      options: [
        { id: 'period', items: [
          { id: 'year', shot: 'st-top', spot: 'period', def: '{{t:st_period_year}}' }, { id: 'nav', shot: 'st-top', spot: 'nav' } ] },
        { id: 'chapters', items: [
          { id: 'year', shot: 'st-top', spot: 'hero' }, { id: 'artist', shot: 'st-artist', spot: 'name' },
          { id: 'tops', shot: 'st-tops', spot: 'head' }, { id: 'no1', shot: 'st-no1', spot: 'head' },
          { id: 'activity', shot: 'st-activity', spot: 'head' }, { id: 'loyalty', shot: 'st-loyalty', spot: 'head' },
          { id: 'new', shot: 'st-new', spot: 'head' }, { id: 'mil', shot: 'st-mil', spot: 'head' },
          { id: 'streaks', shot: 'st-streaks', spot: 'head' }, { id: 'awards', shot: 'st-grammys', spot: 'head' },
          { id: 'replay', shot: 'st-end', spot: 'replay' }, { id: 'share', shot: 'st-end', spot: 'share' } ] },
        { id: 'tools', items: [
          { id: 'stat', shot: 'st-top', spot: 'stats', def: '{{t:st_stat_plays}}' }, { id: 'pl', shot: 'st-top', spot: 'pl' },
          { id: 'no1', shot: 'st-no1', spot: 'seg', def: '{{t:sx_cmp_type_songs}}' }, { id: 'more', shot: 'st-mil', spot: 'toggle' },
          { id: 'speed', shot: 'st-replay', spot: 'speed' } ] },
        { id: 'card', items: [
          { id: 'tpl', shot: 'st-card', spot: 'tpl' }, { id: 'pal', shot: 'st-card', spot: 'pal' }, { id: 'fmt', shot: 'st-card', spot: 'fmt' },
          { id: 'art', shot: 'st-card', spot: 'art', def: 'on' }, { id: 'topn', shot: 'st-card', spot: 'topn', def: '5' },
          { id: 'copy', shot: 'st-card', spot: 'copy' } ] }
      ],
      challenges: ['st.period', 'st.nav', 'st.story', 'st.stat', 'st.no1', 'st.bubble', 'st.replay', 'st.card'],
      quiz: [ { id: 'q1', answer: 1 }, { id: 'q2', answer: 2 }, { id: 'q3', answer: 0 } ],
      tips: [ ['st-top', 'story', 'st.story'], ['st-new', 'bubble', 'st.bubble'], ['st-top', 'stat', 'st.stat'],
        ['st-replay', 'canvas', 'st.replay'], ['st-card', 'tpl', 'st.card'] ]
    },
    /* ── Lesson 11: The Dank 100 (everyone's weekly charts in one) ── */
    { id: 'dank100', area: 'more', nav: 'dank100', mins: 6, cover: 'd1-top',
      scenes: [
        { id: 'top', shot: 'd1-top', phone: true,
          spots: ['title', 'signin', 'week', 'prev', 'next', 'from', 'seg', 'export', 'share', 'cols', 'row', 'pos', 'move', 'pts', 'l', 'lw', 'pk', 'wk', 'acts'] },
        { id: 'run', shot: 'd1-run', spots: ['row', 'plot', 'story', 'ribbon', 'chip', 'boxes', 'box'] },
        // What a week box opens
        { id: 'week', shot: 'd1-week', spots: ['head', 'item', 'link', 'close'] },
        { id: 'no1', shot: 'd1-no1', spots: ['head', 'sum', 'strip', 'row', 'back', 'more'] },
        { id: 'recs', shot: 'd1-recs', spots: ['grid', 'rec', 'k', 'v', 'who'] },
        // Pictured as a signed-in listener with their own library
        { id: 'entry', shot: 'd1-entry', spots: ['soon', 'entries', 'last', 'note', 'preview', 'send', 'year', 'yearbtn', 'auto', 'how'] }
      ],
      howto: [
        { id: 'read', challenge: 'd1.run', slides: [
          { shot: 'd1-top', spot: 'pos' }, { shot: 'd1-top', spot: 'move' }, { shot: 'd1-top', spot: 'pts' },
          { shot: 'd1-top', spot: 'l' }, { shot: 'd1-top', spot: 'pk' }, { shot: 'd1-top', spot: 'row' } ] },
        { id: 'run', challenge: 'd1.box', slides: [
          { shot: 'd1-run', spot: 'plot' }, { shot: 'd1-run', spot: 'chip' }, { shot: 'd1-run', spot: 'box' },
          { shot: 'd1-week', spot: 'item' }, { shot: 'd1-week', spot: 'link' } ] },
        { id: 'weeks', challenge: 'd1.week', slides: [
          { shot: 'd1-top', spot: 'week' }, { shot: 'd1-top', spot: 'prev' }, { shot: 'd1-no1', spot: 'row' },
          { shot: 'd1-top', spot: 'seg' }, { shot: 'd1-artists', spot: 'row' } ] },
        // Sending can't be watched here (the demo library can't send), so no challenge
        { id: 'join', slides: [
          { shot: 'd1-top', spot: 'signin' }, { shot: 'd1-entry', spot: 'last' }, { shot: 'd1-entry', spot: 'send' },
          { shot: 'd1-entry', spot: 'year' }, { shot: 'd1-entry', spot: 'auto' }, { shot: 'd1-entry', spot: 'soon' } ] },
        { id: 'share', challenge: 'd1.share', slides: [
          { shot: 'd1-top', spot: 'export' }, { shot: 'd1-top', spot: 'share' }, { shot: 'd1-artists', spot: 'seg' } ] }
      ],
      options: [
        { id: 'chart', items: [
          { id: 'type', shot: 'd1-top', spot: 'seg', def: '{{t:d100_type_songs}}' }, { id: 'week', shot: 'd1-top', spot: 'week' },
          { id: 'cols', shot: 'd1-top', spot: 'cols' }, { id: 'acts', shot: 'd1-top', spot: 'acts' } ] },
        { id: 'tools', items: [
          { id: 'run', shot: 'd1-run', spot: 'box' }, { id: 'more', shot: 'd1-no1', spot: 'more' },
          { id: 'export', shot: 'd1-top', spot: 'export' }, { id: 'share', shot: 'd1-top', spot: 'share' } ] },
        { id: 'entry', items: [
          { id: 'send', shot: 'd1-entry', spot: 'send' }, { id: 'back', shot: 'd1-entry', spot: 'send' },
          { id: 'year', shot: 'd1-entry', spot: 'yearbtn' }, { id: 'auto', shot: 'd1-entry', spot: 'auto', def: 'off' } ] }
      ],
      challenges: ['d1.week', 'd1.type', 'd1.run', 'd1.box', 'd1.no1', 'd1.export', 'd1.share'],
      quiz: [ { id: 'q1', answer: 1 }, { id: 'q2', answer: 1 }, { id: 'q3', answer: 2 } ],
      tips: [ ['d1-run', 'box', 'd1.box'], ['d1-no1', 'strip', 'd1.no1'], ['d1-top', 'export', 'd1.export'], ['d1-top', 'seg', 'd1.type'] ]
    },
    /* ── Lesson 12: Ratings (score like a critic) ── */
    { id: 'ratings', area: 'more', nav: 'ratings', mins: 7, cover: 'rt-page',
      scenes: [
        { id: 'page', shot: 'rt-page', phone: true,
          spots: ['intro', 'ring', 'verdict', 'meters', 'acts', 'next', 'cta', 'hi', 'dots', 'recs', 'rec', 'top', 'recent'] },
        { id: 'list', shot: 'rt-list', spots: ['tabs', 'spread', 'bar', 'search', 'sort', 'row', 'score', 'prog', 'band', 'go'] },
        { id: 'todo', shot: 'rt-todo', spots: ['tabs', 'row', 'cta'] },
        { id: 'album', shot: 'rt-album',
          spots: ['kind', 'title', 'ring', 'formula', 'tabs', 'row', 'slider', 'num', 'weight', 'note', 'clear', 'done', 'close'] },
        { id: 'tracks', shot: 'rt-tracks', spots: ['tab', 'formula', 'row', 'slider', 'num', 'rubric', 'full'] },
        { id: 'song', shot: 'rt-song', spots: ['back', 'ring', 'mode', 'row', 'na', 'note', 'clear'] },
        { id: 'quick', shot: 'rt-quick', spots: ['mode', 'quick', 'ring'] },
        { id: 'albwin', shot: 'rt-albwin', spots: ['rate', 'tab', 'ring'] },
        { id: 'artwin', shot: 'rt-artwin', spots: ['tab', 'ring'] }
      ],
      howto: [
        { id: 'rate', challenge: 'rt.rate', slides: [
          { shot: 'rt-page', spot: 'next' }, { shot: 'rt-album', spot: 'row' }, { shot: 'rt-tracks', spot: 'row' },
          { shot: 'rt-album', spot: 'weight' }, { shot: 'rt-album', spot: 'ring' }, { shot: 'rt-album', spot: 'done' } ] },
        { id: 'song', challenge: 'rt.mode', slides: [
          { shot: 'rt-tracks', spot: 'rubric' }, { shot: 'rt-song', spot: 'mode' }, { shot: 'rt-song', spot: 'row' },
          { shot: 'rt-song', spot: 'na' }, { shot: 'rt-quick', spot: 'quick' } ] },
        { id: 'browse', challenge: 'rt.band', slides: [
          { shot: 'rt-list', spot: 'tabs' }, { shot: 'rt-list', spot: 'bar' }, { shot: 'rt-list', spot: 'sort' },
          { shot: 'rt-list', spot: 'row' }, { shot: 'rt-todo', spot: 'tabs' } ] },
        { id: 'where', challenge: 'rt.artist', slides: [
          { shot: 'rt-albwin', spot: 'rate' }, { shot: 'rt-albwin', spot: 'tab' }, { shot: 'rt-page', spot: 'top' },
          { shot: 'rt-artwin', spot: 'tab' } ] }
      ],
      options: [
        { id: 'album', items: [
          { id: 'aspects', shot: 'rt-album', spot: 'row' }, { id: 'tracks', shot: 'rt-tracks', spot: 'row' },
          { id: 'weight', shot: 'rt-album', spot: 'weight', def: '75%' }, { id: 'note', shot: 'rt-album', spot: 'note' } ] },
        { id: 'song', items: [
          { id: 'mode', shot: 'rt-song', spot: 'mode', def: '{{t:rte_detailed}}' }, { id: 'na', shot: 'rt-song', spot: 'na' },
          { id: 'quick', shot: 'rt-quick', spot: 'quick' } ] },
        { id: 'page', items: [
          { id: 'lists', shot: 'rt-list', spot: 'tabs', def: '{{t:ig_type_albums}}' }, { id: 'sort', shot: 'rt-list', spot: 'sort', def: '{{t:ar_sort_high}}' },
          { id: 'band', shot: 'rt-list', spot: 'bar' }, { id: 'search', shot: 'rt-list', spot: 'search' } ] }
      ],
      challenges: ['rt.rate', 'rt.tracks', 'rt.mode', 'rt.view', 'rt.band', 'rt.sort', 'rt.artist'],
      quiz: [ { id: 'q1', answer: 1 }, { id: 'q2', answer: 1 }, { id: 'q3', answer: 0 } ],
      tips: [ ['rt-tracks', 'row', 'rt.tracks'], ['rt-song', 'na', 'rt.mode'], ['rt-page', 'rec', 'rt.rate'], ['rt-list', 'bar', 'rt.band'] ]
    },
    /* ── Lesson 13: Events (birthdays, releases, shows, Time Machine) ── */
    { id: 'events', area: 'more', nav: 'events', mins: 6, cover: 'ev-today',
      scenes: [
        { id: 'today', shot: 'ev-today', phone: true,
          spots: ['title', 'info', 'refresh', 'tabs', 'types', 'bday', 'shows', 'play', 'pl', 'day', 'card', 'anniv', 'tm', 'tmtypes', 'tmpl', 'tmcard'] },
        { id: 'menu', shot: 'ev-menu', spots: ['menu', 'card', 'tm'] },
        { id: 'coming', shot: 'ev-coming', spots: ['tab', 'views', 'week', 'soon', 'later', 'card', 'when', 'more', 'note'] },
        { id: 'table', shot: 'ev-table', spots: ['views', 'table', 'th'] },
        { id: 'recent', shot: 'ev-recent', spots: ['tab', 'past', 'weeks', 'earlier', 'more', 'nmf', 'fridays'] },
        { id: 'cal', shot: 'ev-cal', phone: true, spots: ['tab', 'prev', 'title', 'next', 'views', 'today', 'num', 'ev', 'more'] },
        { id: 'week', shot: 'ev-week', spots: ['views', 'title', 'today'] },
        { id: 'day', shot: 'ev-day', spots: ['views', 'title', 'card', 'anniv'] },
        { id: 'info', shot: 'ev-info', spots: ['info', 'status', 'refresh'] }
      ],
      howto: [
        { id: 'today', challenge: 'ev.card', slides: [
          { shot: 'ev-today', spot: 'day' }, { shot: 'ev-today', spot: 'card' }, { shot: 'ev-menu', spot: 'menu' },
          { shot: 'ev-today', spot: 'anniv' }, { shot: 'ev-today', spot: 'tm' } ] },
        { id: 'coming', challenge: 'ev.view', slides: [
          { shot: 'ev-today', spot: 'tabs' }, { shot: 'ev-coming', spot: 'week' }, { shot: 'ev-coming', spot: 'more' },
          { shot: 'ev-coming', spot: 'views' }, { shot: 'ev-table', spot: 'table' } ] },
        { id: 'cal', challenge: 'ev.day', slides: [
          { shot: 'ev-cal', spot: 'tab' }, { shot: 'ev-cal', spot: 'views' }, { shot: 'ev-cal', spot: 'num' },
          { shot: 'ev-day', spot: 'card' }, { shot: 'ev-week', spot: 'today' } ] },
        { id: 'filter', challenge: 'ev.type', slides: [
          { shot: 'ev-today', spot: 'types' }, { shot: 'ev-today', spot: 'shows' }, { shot: 'ev-today', spot: 'play' },
          { shot: 'ev-today', spot: 'pl' } ] },
        { id: 'recent', challenge: 'ev.tab', slides: [
          { shot: 'ev-recent', spot: 'tab' }, { shot: 'ev-recent', spot: 'past' }, { shot: 'ev-recent', spot: 'nmf' },
          { shot: 'ev-recent', spot: 'fridays' } ] }
      ],
      options: [
        { id: 'page', items: [
          { id: 'types', shot: 'ev-today', spot: 'types', def: 'on' }, { id: 'view', shot: 'ev-coming', spot: 'views', def: '{{t:ev_view_reel}}' },
          { id: 'play', shot: 'ev-today', spot: 'play' }, { id: 'pl', shot: 'ev-today', spot: 'pl' },
          { id: 'refresh', shot: 'ev-info', spot: 'refresh' }, { id: 'limit', shot: 'ev-today', spot: 'title', def: '50' } ] },
        { id: 'cal', items: [
          { id: 'views', shot: 'ev-cal', spot: 'views', def: '{{t:ev_cal_month}}' }, { id: 'nav', shot: 'ev-cal', spot: 'prev' } ] },
        { id: 'tm', items: [
          { id: 'types', shot: 'ev-today', spot: 'tmtypes', def: 'on' }, { id: 'pl', shot: 'ev-today', spot: 'tmpl' } ] }
      ],
      challenges: ['ev.tab', 'ev.type', 'ev.view', 'ev.cal', 'ev.day', 'ev.tm', 'ev.card', 'ev.info'],
      quiz: [ { id: 'q1', answer: 0 }, { id: 'q2', answer: 1 }, { id: 'q3', answer: 1 } ],
      tips: [ ['ev-today', 'tm', 'ev.tm'], ['ev-cal', 'num', 'ev.day'], ['ev-coming', 'views', 'ev.view'], ['ev-today', 'types', 'ev.type'] ]
    },
    /* ── Lesson 14: Playlists (yours, automatic ones, and releases) ── */
    { id: 'playlists', area: 'more', nav: 'playlists', mins: 5, cover: 'pl-top',
      scenes: [
        { id: 'top', shot: 'pl-top', phone: true,
          spots: ['title', 'total', 'search', 'sort', 'new', 'name', 'card', 'cover', 'meta', 'ap', 'tile', 'sw', 'size'] },
        { id: 'open', shot: 'pl-open', phone: true,
          spots: ['back', 'hero', 'cover', 'name', 'meta', 'play', 'shuffle', 'export', 'rename', 'del', 'track', 'drag', 'acts', 'remove'] },
        { id: 'export', shot: 'pl-export', spots: ['btn', 'menu', 'item'] },
        // What "Add to playlist" opens, from anywhere in the app
        { id: 'pick', shot: 'pl-pick', spots: ['sub', 'new', 'text', 'list', 'item'] },
        { id: 'rel', shot: 'pl-rel', spots: ['anniv', 'annpl', 'card', 'recent', 'recpl'] }
      ],
      howto: [
        { id: 'make', challenge: 'pl.add', slides: [
          { shot: 'pl-pick', spot: 'sub' }, { shot: 'pl-pick', spot: 'new' }, { shot: 'pl-pick', spot: 'item' },
          { shot: 'pl-top', spot: 'new' }, { shot: 'pl-rel', spot: 'annpl' } ] },
        { id: 'use', challenge: 'pl.open', slides: [
          { shot: 'pl-top', spot: 'card' }, { shot: 'pl-open', spot: 'play' }, { shot: 'pl-open', spot: 'drag' },
          { shot: 'pl-open', spot: 'remove' }, { shot: 'pl-open', spot: 'rename' } ] },
        { id: 'take', challenge: 'pl.export', slides: [
          { shot: 'pl-open', spot: 'export' }, { shot: 'pl-export', spot: 'item' }, { shot: 'pl-pick', spot: 'text' } ] },
        { id: 'auto', challenge: 'pl.auto', slides: [
          { shot: 'pl-top', spot: 'ap' }, { shot: 'pl-top', spot: 'sw' }, { shot: 'pl-top', spot: 'size' }, { shot: 'pl-top', spot: 'tile' } ] }
      ],
      options: [
        { id: 'list', items: [
          { id: 'sort', shot: 'pl-top', spot: 'sort', def: '{{t:pl_x_sort_recent}}' }, { id: 'search', shot: 'pl-top', spot: 'search' },
          { id: 'new', shot: 'pl-top', spot: 'new' } ] },
        { id: 'one', items: [
          { id: 'play', shot: 'pl-open', spot: 'play' }, { id: 'shuffle', shot: 'pl-open', spot: 'shuffle' },
          { id: 'export', shot: 'pl-open', spot: 'export' }, { id: 'rename', shot: 'pl-open', spot: 'rename' },
          { id: 'del', shot: 'pl-open', spot: 'del' }, { id: 'drag', shot: 'pl-open', spot: 'drag' } ] },
        { id: 'auto', items: [
          { id: 'types', shot: 'pl-top', spot: 'tile', def: 'off' }, { id: 'size', shot: 'pl-top', spot: 'size' } ] }
      ],
      challenges: ['pl.open', 'pl.sort', 'pl.search', 'pl.play', 'pl.add', 'pl.export', 'pl.auto'],
      quiz: [ { id: 'q1', answer: 2 }, { id: 'q2', answer: 0 }, { id: 'q3', answer: 1 } ],
      tips: [ ['pl-pick', 'item', 'pl.add'], ['pl-top', 'ap', 'pl.auto'], ['pl-export', 'item', 'pl.export'], ['pl-open', 'drag', 'pl.open'] ]
    },
    /* ── Lesson 15: Raw Data (every play, corrections, rules) ── */
    /* ── The music player (PLAYER-PLAN.md step 13) ─────────────────
       Not a tab: it opens from any Play. "Show me" opens it with this
       week's top song (app.js _ytGuideOpen). */
    { id: 'player', area: 'more', nav: null, mins: 6, cover: 'np-card',
      scenes: [
        // One picture, two scenes, so the dots don't crowd: the top half, then the controls
        { id: 'card', shot: 'np-card', phone: true,
          spots: ['drag', 'stage', 'bar', 'close', 'media', 'src', 'seg', 'title', 'add', 'love', 'story'] },
        { id: 'play', shot: 'np-card', phone: true,
          spots: ['seek', 'mark', 'note', 'shuffle', 'prev', 'play', 'next', 'repeat', 'tabs', 'queue', 'vol', 'speed', 'sleep', 'help'] },
        { id: 'tools', shot: 'np-tools',
          spots: ['search', 'similar', 'sleep', 'speed', 'xfade', 'scrobble', 'lists', 'share', 'pip', 'youtube', 'keys', 'tour'] },
        { id: 'lyrics', shot: 'np-lyrics', phone: true, spots: ['pill', 'nudge', 'now', 'line'] },
        { id: 'find', shot: 'np-find', spots: ['back', 'search', 'paste', 'use'] },
        { id: 'small', shot: 'np-bar', spots: ['who', 'love', 'play', 'open', 'close'] },
        { id: 'filled', shot: 'np-filled', spots: ['who', 'seek', 'next', 'queue', 'vol'] },
        { id: 'stage', shot: 'np-stage', spots: ['video', 'hint', 'full', 'back', 'tabs', 'lyrics', 'controls'] }
      ],
      howto: [
        { id: 'video', challenge: 'np.find', slides: [
          { shot: 'np-card', spot: 'src' }, { shot: 'np-find', spot: 'search' }, { shot: 'np-find', spot: 'paste' }, { shot: 'np-find', spot: 'use' } ] },
        { id: 'fav', challenge: 'np.love', slides: [
          { shot: 'np-card', spot: 'love' }, { shot: 'np-card', spot: 'add' } ] },
        { id: 'sleep', challenge: 'np.sleep', slides: [
          { shot: 'np-card', spot: 'sleep' }, { shot: 'np-tools', spot: 'sleep' } ] },
        { id: 'big', challenge: 'np.stage', slides: [
          { shot: 'np-card', spot: 'stage' }, { shot: 'np-stage', spot: 'video' }, { shot: 'np-stage', spot: 'back' } ] },
        { id: 'small', challenge: 'np.bar', slides: [
          { shot: 'np-card', spot: 'bar' }, { shot: 'np-bar', spot: 'who' }, { shot: 'np-setting', spot: 'switch' } ] }
      ],
      options: [
        { id: 'mini', items: [
          { id: 'capsule', shot: 'np-bar', spot: 'who', def: 'on' }, { id: 'filled', shot: 'np-filled', spot: 'seek' },
          { id: 'bar', shot: 'np-setting', spot: 'bar' } ] },
        { id: 'play', items: [
          { id: 'speed', shot: 'np-tools', spot: 'speed', def: '1×' }, { id: 'xfade', shot: 'np-tools', spot: 'xfade', def: 'off' },
          { id: 'scrobble', shot: 'np-tools', spot: 'scrobble', def: '30s' }, { id: 'sleep', shot: 'np-tools', spot: 'sleep', def: 'off' },
          { id: 'shuffle', shot: 'np-card', spot: 'shuffle', def: 'off' }, { id: 'repeat', shot: 'np-card', spot: 'repeat', def: 'off' } ] }
      ],
      challenges: ['np.open', 'np.tab', 'np.love', 'np.find', 'np.sleep', 'np.stage', 'np.bar', 'np.tour'],
      quiz: [ { id: 'q1', answer: 1 }, { id: 'q2', answer: 2 }, { id: 'q3', answer: 0 } ],
      tips: [ ['np-card', 'mark', 'np.open'], ['np-find', 'paste', 'np.find'], ['np-lyrics', 'now', 'np.tab'], ['np-stage', 'video', 'np.stage'] ]
    },
    { id: 'rawdata', area: 'more', nav: 'rawdata', mins: 5, cover: 'rd-top',
      scenes: [
        { id: 'top', shot: 'rd-top', phone: true,
          spots: ['title', 'song', 'artist', 'album', 'date', 'summary', 'corr', 'rules', 'pager', 'size', 'th', 'row', 'edit'] },
        { id: 'edit', shot: 'rd-edit', spots: ['artist', 'track', 'album', 'time', 'now', 'all', 'rule', 'save', 'cancel'] },
        { id: 'corr', shot: 'rd-corr', spots: ['corr', 'row', 'badge'] },
        { id: 'rules', shot: 'rd-rules', spots: ['count', 'search', 'list', 'rule', 'export', 'import'] }
      ],
      howto: [
        { id: 'find', challenge: 'rd.filter', slides: [
          { shot: 'rd-top', spot: 'song' }, { shot: 'rd-top', spot: 'date' }, { shot: 'rd-top', spot: 'summary' },
          { shot: 'rd-top', spot: 'th' }, { shot: 'rd-top', spot: 'pager' } ] },
        { id: 'fix', challenge: 'rd.edit', slides: [
          { shot: 'rd-top', spot: 'edit' }, { shot: 'rd-edit', spot: 'artist' }, { shot: 'rd-edit', spot: 'all' },
          { shot: 'rd-edit', spot: 'rule' }, { shot: 'rd-edit', spot: 'save' }, { shot: 'rd-corr', spot: 'badge' } ] },
        { id: 'rules', challenge: 'rd.rules', slides: [
          { shot: 'rd-top', spot: 'rules' }, { shot: 'rd-rules', spot: 'rule' }, { shot: 'rd-rules', spot: 'search' },
          { shot: 'rd-rules', spot: 'export' }, { shot: 'rd-rules', spot: 'import' } ] }
      ],
      options: [
        { id: 'table', items: [
          { id: 'filters', shot: 'rd-top', spot: 'song' }, { id: 'date', shot: 'rd-top', spot: 'date' },
          { id: 'corr', shot: 'rd-top', spot: 'corr', def: 'off' }, { id: 'size', shot: 'rd-top', spot: 'size', def: '200' },
          { id: 'sort', shot: 'rd-top', spot: 'th', def: '{{t:raw_th_date_time}}' } ] },
        { id: 'edit', items: [
          { id: 'all', shot: 'rd-edit', spot: 'all', def: 'off' }, { id: 'rule', shot: 'rd-edit', spot: 'rule', def: 'off' },
          { id: 'save', shot: 'rd-edit', spot: 'save' } ] },
        { id: 'rules', items: [
          { id: 'export', shot: 'rd-rules', spot: 'export' }, { id: 'import', shot: 'rd-rules', spot: 'import' } ] }
      ],
      challenges: ['rd.filter', 'rd.sort', 'rd.page', 'rd.size', 'rd.corr', 'rd.edit', 'rd.rules'],
      quiz: [ { id: 'q1', answer: 1 }, { id: 'q2', answer: 2 }, { id: 'q3', answer: 0 } ],
      tips: [ ['rd-top', 'date', 'rd.filter'], ['rd-edit', 'rule', 'rd.edit'], ['rd-rules', 'export', 'rd.rules'], ['rd-corr', 'badge', 'rd.corr'] ]
    },
    /* ── Lesson 16: Board (suggestions, bugs, questions, talk) ── */
    { id: 'board', area: 'more', nav: 'board', mins: 4, cover: 'bd-top',
      scenes: [
        { id: 'top', shot: 'bd-top', phone: true,
          spots: ['title', 'signin', 'chips', 'chip', 'search', 'status', 'sort', 'newbtn', 'pinned', 'post', 'vote', 'cat', 'st', 'meta'] },
        { id: 'post', shot: 'bd-post', spots: ['vote', 'title', 'body', 'actions', 'replies', 'reply', 'form'] },
        // Pictured as a signed-in listener
        { id: 'new', shot: 'bd-new', spots: ['cats', 'title', 'body', 'foot'] }
      ],
      howto: [
        { id: 'read', challenge: 'bd.open', slides: [
          { shot: 'bd-top', spot: 'chips' }, { shot: 'bd-top', spot: 'sort' }, { shot: 'bd-top', spot: 'post' },
          { shot: 'bd-post', spot: 'replies' } ] },
        { id: 'post', challenge: 'bd.new', slides: [
          { shot: 'bd-top', spot: 'signin' }, { shot: 'bd-top', spot: 'newbtn' }, { shot: 'bd-new', spot: 'cats' },
          { shot: 'bd-new', spot: 'title' }, { shot: 'bd-new', spot: 'foot' } ] },
        { id: 'follow', challenge: 'bd.status', slides: [
          { shot: 'bd-top', spot: 'vote' }, { shot: 'bd-top', spot: 'st' }, { shot: 'bd-top', spot: 'status' },
          { shot: 'bd-post', spot: 'form' } ] }
      ],
      options: [
        { id: 'list', items: [
          { id: 'cat', shot: 'bd-top', spot: 'chips', def: '{{t:board_cat_all}}' }, { id: 'status', shot: 'bd-top', spot: 'status', def: '{{t:board_status_all}}' },
          { id: 'sort', shot: 'bd-top', spot: 'sort', def: '{{t:board_sort_top}}' }, { id: 'search', shot: 'bd-top', spot: 'search' } ] },
        { id: 'post', items: [
          { id: 'vote', shot: 'bd-top', spot: 'vote' }, { id: 'link', shot: 'bd-post', spot: 'actions' },
          { id: 'reply', shot: 'bd-post', spot: 'form' } ] }
      ],
      challenges: ['bd.cat', 'bd.sort', 'bd.status', 'bd.search', 'bd.open', 'bd.new'],
      quiz: [ { id: 'q1', answer: 1 }, { id: 'q2', answer: 0 }, { id: 'q3', answer: 2 } ],
      tips: [ ['bd-top', 'status', 'bd.status'], ['bd-top', 'sort', 'bd.sort'], ['bd-new', 'cats', 'bd.new'] ]
    },
    /* ── Lesson 17: Settings & account (sources, options, look, sign-in) ── */
    { id: 'settings', area: 'setup', nav: null, mins: 7, cover: 'set-profile',
      scenes: [
        { id: 'bar', shot: 'set-bar', phone: true, spots: ['search', 'news', 'sync', 'settings', 'theme', 'lang', 'signin'] },
        { id: 'source', shot: 'set-source', phone: true,
          spots: ['search', 'tabs', 'cards', 'sheets', 'lastfm', 'file', 'url', 'tab', 'auto', 'account', 'connect', 'close'] },
        { id: 'lastfm', shot: 'set-lastfm', spots: ['card', 'user', 'dirty', 'save'] },
        { id: 'file', shot: 'set-file', spots: ['card', 'drop'] },
        { id: 'charts', shot: 'set-charts', spots: ['tab', 'week', 'svc', 'sections', 'stats', 'events', 'd100', 'anim', 'split', 'credit'] },
        { id: 'releases', shot: 'set-releases', spots: ['tab', 'detect', 'album', 'song', 'single', 'ep', 'reset', 'rollup'] },
        { id: 'profile', shot: 'set-profile', spots: ['tab', 'name', 'tz', 'themes', 'theme', 'lang', 'backups', 'dl', 'restore'] },
        { id: 'search', shot: 'set-search', spots: ['search', 'results', 'result'] },
        { id: 'theme', shot: 'set-theme', spots: ['btn', 'panel', 'on'] },
        { id: 'lang', shot: 'set-lang', spots: ['btn', 'panel', 'on'] },
        // Pictured signed in, as a made-up listener
        { id: 'acct', shot: 'set-acct', spots: ['btn', 'dot', 'name', 'nt', 'out'] },
        { id: 'nt', shot: 'set-nt', spots: ['tabs', 'group', 'row', 'tile', 'cat', 'dismiss', 'foot', 'close'] }
      ],
      howto: [
        { id: 'connect', challenge: 'set.open', slides: [
          { shot: 'set-bar', spot: 'settings' }, { shot: 'set-source', spot: 'cards' }, { shot: 'set-source', spot: 'url' },
          { shot: 'set-lastfm', spot: 'user' }, { shot: 'set-file', spot: 'drop' }, { shot: 'set-lastfm', spot: 'save' } ] },
        { id: 'tune', challenge: 'set.tab', slides: [
          { shot: 'set-charts', spot: 'week' }, { shot: 'set-profile', spot: 'tz' }, { shot: 'set-charts', spot: 'sections' },
          { shot: 'set-releases', spot: 'album' }, { shot: 'set-search', spot: 'result' } ] },
        { id: 'look', challenge: 'set.theme', slides: [
          { shot: 'set-bar', spot: 'theme' }, { shot: 'set-theme', spot: 'panel' }, { shot: 'set-bar', spot: 'lang' },
          { shot: 'set-lang', spot: 'panel' }, { shot: 'set-profile', spot: 'themes' } ] },
        { id: 'account', challenge: 'set.nt', slides: [
          { shot: 'set-bar', spot: 'signin' }, { shot: 'set-acct', spot: 'btn' }, { shot: 'set-acct', spot: 'nt' },
          { shot: 'set-nt', spot: 'row' }, { shot: 'set-profile', spot: 'backups' } ] }
      ],
      options: [
        { id: 'source', items: [
          { id: 'sheets', shot: 'set-source', spot: 'sheets' }, { id: 'lastfm', shot: 'set-source', spot: 'lastfm' },
          { id: 'file', shot: 'set-source', spot: 'file' }, { id: 'connect', shot: 'set-source', spot: 'connect' } ] },
        { id: 'charts', items: [
          { id: 'week', shot: 'set-charts', spot: 'week', def: '{{t:day_sunday}}' }, { id: 'svc', shot: 'set-charts', spot: 'svc', def: 'Spotify' },
          { id: 'sections', shot: 'set-charts', spot: 'sections', def: 'on' }, { id: 'events', shot: 'set-charts', spot: 'events', def: '50' },
          { id: 'd100', shot: 'set-charts', spot: 'd100', def: 'off' }, { id: 'anim', shot: 'set-charts', spot: 'anim', def: 'off' },
          { id: 'split', shot: 'set-charts', spot: 'split', def: 'off' }, { id: 'credit', shot: 'set-charts', spot: 'credit', def: 'off' } ] },
        { id: 'releases', items: [
          { id: 'detect', shot: 'set-releases', spot: 'detect', def: 'off' }, { id: 'apart', shot: 'set-releases', spot: 'tab', def: '{{t:rtype_sep_with}}' },
          { id: 'rollup', shot: 'set-releases', spot: 'rollup', def: '{{t:rollup_off}}' }, { id: 'cert', shot: 'set-releases', spot: 'album' } ] },
        { id: 'profile', items: [
          { id: 'name', shot: 'set-profile', spot: 'name' }, { id: 'tz', shot: 'set-profile', spot: 'tz' },
          { id: 'theme', shot: 'set-profile', spot: 'themes', def: '{{t:tooltip_theme_navy_dark}}' }, { id: 'lang', shot: 'set-profile', spot: 'lang' },
          { id: 'backups', shot: 'set-profile', spot: 'backups' } ] }
      ],
      challenges: ['set.open', 'set.tab', 'set.search', 'set.theme', 'set.lang', 'set.backup', 'set.nt'],
      quiz: [ { id: 'q1', answer: 2 }, { id: 'q2', answer: 0 }, { id: 'q3', answer: 1 } ],
      tips: [ ['set-search', 'result', 'set.search'], ['set-theme', 'panel', 'set.theme'], ['set-profile', 'backups', 'set.backup'],
        ['set-acct', 'nt', 'set.nt'] ]
    }
  ]
};

window.GL_TEXT = window.GL_TEXT || {};
window.GL_TEXT.en = {
  /* ── Words the engine uses everywhere ───────────────────────────── */
  ui: {
    eyebrow: 'Charts Guide',
    hero_title: 'Learn your charts inside out.',
    hero_sub: 'Every tab, every button, every option, shown on the real app. Explore the pictures, follow the steps, then try it yourself.',
    hero_stats: '{{lessons}} lessons · {{ch}} challenges',
    ring_label: 'mastered',
    ring_of: '{{done}} of {{total}}',
    tab_lessons: 'Lessons',
    tab_ref: 'Reference',
    continue: 'Continue',
    start: 'Start here',
    continue_note: 'Next up: {{what}}',
    tip_title: 'Today’s tip',
    tip_new: 'A new one every day',
    tip_try: 'Show me',
    tip_open: 'Open the lesson',
    area: { start: 'Start here', charts: 'Your charts', insights: 'Stats, records and awards', more: 'More tabs', setup: 'Settings' },
    soon: 'Coming soon',
    mastered: 'Mastered',
    in_progress: '{{pct}}% done',
    not_started: 'Not started',
    mins: '{{n}} min',
    back_hub: 'All lessons',
    sec_screen: 'Know your screen',
    sec_screen_sub: 'Pick a number to see what that part does. Use ← → to step through.',
    sec_howto: 'How to…',
    sec_howto_sub: 'Short step-by-step walkthroughs. Each one ends with you trying it.',
    sec_options: 'Every option',
    sec_options_sub: 'The full list. Tap a picture to see it bigger.',
    sec_try: 'Try it yourself',
    sec_try_sub: 'Do these in the real app. The guide notices, wherever you are.',
    sec_quiz: 'Quick check',
    sec_quiz_sub: 'Three questions. Get them all right to master the lesson.',
    device_desktop: 'Computer',
    device_phone: 'Phone',
    whole: 'Whole screen',
    prev: 'Previous',
    next: 'Next',
    step_of: 'Step {{n}} of {{total}}',
    steps: '{{n}} steps',
    start_walk: 'Start',
    done: 'Done',
    try_now: 'Try it now',
    close: 'Close',
    show_me: 'Show me',
    done_chip: 'Done',
    default: 'Default',
    def_on: 'On',
    def_off: 'Off',
    correct: 'Right!',
    wrong: 'Not quite.',
    retry: 'Try again',
    quiz_done: 'All three right.',
    next_lesson: 'Next lesson',
    toast_title: 'Challenge complete',
    toast_progress: '{{done}} of {{total}} in “{{lesson}}”',
    toast_back: 'Back to the lesson',
    coach_back: 'Back to the guide',
    coach_hint: 'Your turn',
    mastered_title: 'Lesson mastered',
    mastered_text: 'You know “{{lesson}}” inside out.',
    loading: 'Loading the guide…',
    search_ph: 'Search the guide: a button, a word, a question…',
    search_none: 'Nothing found. Try another word.',
    sr_lesson: 'Lesson', sr_spot: 'On screen', sr_howto: 'How to', sr_option: 'Option', sr_challenge: 'Challenge',
    sr_faq: 'FAQ', sr_gloss: 'Glossary', sr_key: 'Shortcut', sr_ref: 'How charts work',
    ref_lesson: 'The lesson',
    tour_lesson: 'Lesson: {{lesson}}'
  },

  /* ── Lessons ─────────────────────────────────────────────────────── */
  lessons: {
    start: {
      title: 'Getting started',
      promise: 'Check your setup, find your way around, and do the first things worth doing. Everything else builds on this.',
      scenes: {
        bar: { title: 'The top bar', spots: {
          search: ['{{t:tb_search}}', 'Any song, artist or album in your library.'],
          settings: ['{{t:set_title}}', 'Where your plays come from, and how your charts work.'],
          theme: ['{{t:set_theme}}', 'Twelve colour themes.'],
          lang: ['{{t:set_language}}', 'Four languages.'],
          signin: ['{{t:tb_sign_in}}', 'Optional: keeps everything in step on every device.']
        } },
        chart: { title: 'Your chart', spots: {
          periods: ['Periods', 'Daily, weekly, monthly, yearly and all-time charts.'],
          prev: ['Back', 'The period before.'],
          label: ['Which one', 'Click it to jump to any date.'],
          next: ['On', 'The period after.'],
          tiles: ['At a glance', 'The numbers of the period.']
        } },
        row: { title: 'A chart row', spots: {
          rank: ['Place', 'Its position.'],
          move: ['Move', 'Up, down, new or back since last time.'],
          title: ['The song', 'Click it for everything about it.'],
          peak: ['Peak', 'Its best place.'],
          weeks: ['Weeks', 'How long it has charted.'],
          plays: ['Plays', 'In this period.'],
          more: ['⋮', 'Listen, add to a playlist, share and more.']
        } }
      },
      howto: {
        first: { title: 'Your first five minutes', slides: [
          'Connect your listening: Google Sheets, Last.fm, or a file.',
          'Save, and your plays load.',
          'Your weekly chart is ready. Try the other periods.',
          'Read a row: its place, its move, its peak.',
          'The ⋮ menu: listen, a playlist, share.'
        ] },
        around: { title: 'Find your way around', slides: [
          'Search finds anything in your library.',
          'Switch periods along the top.',
          'Songs, artists or albums.',
          '{{t:set_title}} holds the rest.'
        ] }
      },
      options: {
        where: { title: 'Where things are', items: {
          settings: ['{{t:set_title}}', 'Your source, chart week, time zone, look and backups.'],
          search: ['{{t:tb_search}}', 'Press / anywhere.'],
          periods: ['Periods', 'Each chart has its own lesson in this guide.']
        } }
      },
      challenges: {
        'start.data': ['Load your plays', 'Connect a source in {{t:set_title}}. Ticks itself once plays are in.'],
        'start.chart': ['Open your weekly chart', '{{t:tab_charts}} in the top bar.'],
        'start.tour': ['Take the tour', 'Four minutes around every tab.'],
        'start.explore': ['Open another tab', 'Stats, Records, Awards… anything.'],
        'start.size': ['Change a chart’s size', 'The ⋮ above the chart → Size.'],
        'start.card': ['Make a share image', 'The ⋮ above the chart → Share.'],
        'start.playlist': ['Add something to a playlist', 'A row’s ⋮ → {{t:ea_add_playlist}}.']
      },
      quiz: {
        q1: ['Where do you connect Last.fm, a Google Sheet or a file?',
          ['On the Weekly chart', 'In {{t:set_title}}', 'In the Charts Guide'],
          '{{t:set_title}} (the gear in the top bar) opens on {{t:set_tab_source}}.'],
        q2: ['What does a chart row’s ⋮ menu give you?',
          ['Listen, add to a playlist, share and more', 'Only delete', 'The settings'],
          'Every row has one, and so do the windows.'],
        q3: ['You played a song a lot last March. How do you find that week?',
          ['Scroll down a lot', 'It’s gone', 'Click the date and pick the week'],
          'The date opens a picker; the arrows step one period at a time.']
      },
      tips: [
        'Press / anywhere to search your whole library.',
        'Click the date above any chart to jump straight to a week, month or year.',
        'Every chart row has a ⋮ menu: listen, add to a playlist, share.'
      ]
    },
    week: {
      title: 'Your Weekly chart',
      promise: 'Read every number on a chart, move between weeks and make it look the way you like.',
      scenes: {
        top: { title: 'Top of the page', spots: {
          periods: ['Chart windows', 'Daily, Weekly, Monthly, Yearly and All-Time: the same charts over a different stretch of time. The D, W, M, Y and A keys jump straight there.'],
          prev: ['Previous week', 'Goes back one week. The ← key does the same, and on a phone you can swipe the chart.'],
          label: ['Which week you’re on', 'The week’s name and its dates. Click it to open a calendar and jump to any week.'],
          next: ['Next week', 'Goes forward one week. It’s greyed out when you’re on the current week.'],
          streak: ['Listening streak', 'How many days in a row you’ve played something, and your best run ever. Click it for your streaks.'],
          banner: ['The week in one line', 'Who owned the week and the one fact worth knowing about it. While a week is still running, it says who’s leading so far.'],
          tiles: ['Four numbers', 'Total plays, different songs, artists and albums for the week. Click a tile to jump to its chart. Under the line: your best day and how much was new to you.'],
          delta: ['Change since last week', 'Green ▲ means more than the week before, red ▼ means fewer.'],
          compare: ['Compare', 'Opens small bars that put this week next to last week, your usual week and your record.']
        } },
        chart: { title: 'The chart', spots: {
          spotlight: ['Of the moment', 'Your most played song, artist and album over the 15 days up to the end of this week, and your rising artist: the one you found in the last 45 days and play most.'],
          type: ['Songs, Artists, Albums', 'Three charts for the same week. Pick one; the page remembers your choice.'],
          layouts: ['Six layouts', 'Table, Card grid, Compact, Mosaic, Filmstrip and Stack. Same chart, a different look. Songs, artists and albums each keep their own.'],
          collapse: ['Fold the chart', 'Hides the chart but keeps its title, so the page gets shorter. Press + to open it again.'],
          title: ['Chart size', '“Top 10 Songs”: how many entries this chart holds. Change it in ⋮ → Size.'],
          animate: ['Animate chart', 'Replays the plays one by one, from last week’s chart to this one, so you can watch songs climb past each other.'],
          desc: ['What the chart counts', 'A short line under the title. Switch it on or off in ⋮ → Show → Descriptions.'],
          menu: ['Chart options (⋮)', 'Three tabs: Show (extra details on every row), Size (how many entries) and Actions (play, share, export).'],
          heads: ['Columns', 'Rank, movement, title and artist, album, weeks on the chart, and plays.'],
          first: ['A chart row', 'Click a row to open its window with everything about it. The next picture takes one row apart.']
        } },
        row: { title: 'A chart row, piece by piece', spots: {
          rank: ['Position', 'Where it sits this week. The #1 row is the gold one.'],
          move: ['No change (=)', 'Same position as last week.'],
          prev: ['Last week’s position', 'The small number under the movement: where it was the week before.'],
          up: ['Climber (▲)', 'Up that many places since last week.'],
          down: ['Faller (▼)', 'Down that many places since last week.'],
          newe: ['NEW', 'Its first week ever on this chart.'],
          re: ['RE (re-entry)', 'Back on the chart after dropping off. It keeps its old peak and its weeks.'],
          art: ['Cover', 'Press ▶ on the cover to hear a 30-second sample.'],
          title: ['Title and artist', 'Click the title for the song’s window, or the artist’s name for theirs.'],
          peak: ['Peak tag', 'The highest it has ever reached on this chart. Switch it on in ⋮ → Show → Peak tags.'],
          cert: ['Certification', 'Gold, Platinum or Diamond once it passes a play-count mark. Switch it on in ⋮ → Show → Cert badges.'],
          album: ['Album', 'Click it for the album’s window.'],
          weeks: ['Weeks on chart', 'How many weeks it has spent on the chart in total, over every run. It never resets.'],
          plays: ['Plays', 'Plays this week. This is the only thing the chart ranks by.'],
          pdelta: ['Plays change', 'How many more or fewer plays than last week.'],
          best: ['Plays peak (▲ BEST)', 'Its most plays in a single week so far. Switch it on in ⋮ → Show → Plays peak.'],
          spotify: ['Spotify', 'Finds it on Spotify.'],
          more: ['Row menu (⋮)', 'Play it, add it to a playlist, open its window and more. Right-click a row for the same menu.'],
          run: ['Chart run', 'Opens its run under the row: every week it charted, and where.']
        } },
        run: { title: 'A row opened', spots: {
          run: ['The chart-run button', 'Lit up while the panel is open. Press it again to close the panel.'],
          facts: ['Album and artists', 'Click either to open its window.'],
          acts: ['Quick actions', 'Sample (30 seconds), the video, add to a playlist, YouTube, and Details for its full window.'],
          range: ['Range', 'Count its run over this year so far, up to the week you’re on, or all time.'],
          now: ['This week', 'Last week’s position, plays this week with the change, and its certification.'],
          story: ['Its story in one line', 'How it debuted, how long it spent at its peak and how long on the chart.'],
          ribbon: ['Run totals', 'Peak, weeks at that peak, weeks on the chart and plays. Click the weeks-at-peak chip to see which weeks.'],
          boxes: ['Week by week', 'One box per week it charted: its position and the week. Gold boxes are weeks at its peak.'],
          goals: ['Next milestone', 'The next thing it can reach and how many plays it needs, then the ones after that.'],
          more: ['More', 'Streak records, a listening heatmap and its full play history, each folded until you open it.']
        } },
        replay: { title: 'Animate chart', spots: {
          when: ['The moment shown', 'The chart is counted over 7 days that slide forward, play by play, from last week to this week. These are the 7 days counted right now.'],
          count: ['How far along', 'Which play the replay has reached, out of all of them.'],
          days: ['The sliding week', 'Last week’s days and this week’s. The outlined block is the 7 days being counted. Click a day to jump there.'],
          ends: ['Start and finish', 'It starts on the previous chart and ends on this one.'],
          scrub: ['Scrubber', 'Drag to any moment in between.'],
          play: ['Play / pause', 'The Space key does the same.'],
          step: ['Step through it', '−1d and +1d jump a whole day, ◀ and ▶ one play, ⏮ and ⏭ to either end.'],
          speeds: ['Speed', 'From half speed up to 20 times as fast.'],
          log: ['What just changed', 'The latest plays to come into (+) and drop out of (−) the 7 days, with their time.'],
          keys: ['Keys', 'Space, ← →, Shift + ← → and Home / End all work while it runs.'],
          close: ['Close', 'Back to the normal chart. Esc does the same.']
        } }
      },
      howto: {
        nav: { title: 'Go to another week', slides: [
          'Press ‹ to go back one week. The ← key on your keyboard works too.',
          'Press › to come forward again. On a phone, swipe the chart left or right.',
          'To jump further, click the week’s name. A calendar opens: pick any day and the chart goes to that day’s week.',
          'Want a month or a year instead? Pick Monthly or Yearly up here.'
        ] },
        size: { title: 'Make the chart longer', slides: [
          'Open ⋮ next to the chart.',
          'Choose the Size tab.',
          'Pick from Top 10 up to Top 100.',
          'The title changes with it. Daily, Weekly, Monthly and Yearly each remember their own size.'
        ] },
        layout: { title: 'Change how the chart looks', slides: [
          'These six buttons switch the layout. Table is the one you start with.',
          'Card grid: big covers, made for scrolling.',
          'Mosaic: your top entries as big tiles, the rest smaller.',
          'Filmstrip: a podium for the top three, everything else on a strip.',
          'Compact: one slim line per entry, so the most fits on screen.',
          'Stack: cards on top of each other. Only Stack has this extra button, which splits it into two columns.'
        ] },
        details: { title: 'Show more on every row', slides: [
          'Open ⋮ next to the chart.',
          'The Show tab. Everything in it starts switched off, so the chart stays calm.',
          'Tick what you want, for example Peak tags.',
          'It appears on every row straight away.',
          'Under Sections you choose which lists show below the chart: Bubbling Under, Off the Chart and New Entries.'
        ] },
        type: { title: 'See your artists or albums', slides: [
          'Songs, Artists and Albums are three charts of the same week.',
          'Artists: every play of any of their songs counts.',
          'Albums: plays of the songs on each album, added up.'
        ] },
        run: { title: 'Follow a song’s chart run', slides: [
          'Press the little bars at the end of a row.',
          'Its run opens under the row: one box for every week it spent on the chart, with its position.',
          'Change the range to count its run over this year, up to this week, or all time.',
          'Play a sample or the video, or add it to a playlist, straight from here.',
          'The ⋮ on the row has everything else, including its album and artist. Right-clicking the row opens the same menu.'
        ] },
        animate: { title: 'Watch last week turn into this week', slides: [
          'Press Animate chart above the chart.',
          'It starts on last week’s chart. Then 7 days slide forward, play by play, and the songs move as plays come in and drop out.',
          'Pause it any time, or step one play or a whole day at a time.',
          'Or drag the scrubber to any moment.',
          'This list shows what just came in and what dropped out.',
          'Close it to get the normal chart back.'
        ] }
      },
      options: {
        layouts: { title: 'Layouts', items: {
          table: ['Table', 'Rows with every column. The one you start with.'],
          grid: ['Card grid', 'Big covers in a grid.'],
          compact: ['Compact', 'One slim line per entry. Fits the most on screen.'],
          mosaic: ['Mosaic', 'The top entries as big tiles, the rest smaller.'],
          filmstrip: ['Filmstrip', 'A podium for the top three, the rest on a strip you can scroll or set to Auto-scroll.'],
          stack: ['Stack', 'Cards on top of each other, with a two-column switch.']
        } },
        show: { title: '⋮ → Show', items: {
          cert: ['Cert badges', 'Gold, Platinum and Diamond on songs and albums that passed a play-count mark.'],
          score: ['My scores', 'Your rating, on anything you’ve rated.'],
          ppeak: ['Plays peak', 'A ▲ BEST tag when an entry has its most plays in a week so far.'],
          ptags: ['Peak tags', 'The highest position each entry has ever reached.'],
          bulegend: ['BU legend', 'The key to the tags in Bubbling Under.'],
          desc: ['Descriptions', 'A short line under each chart title saying what it counts.']
        } },
        sections: { title: '⋮ → Show → Sections', items: {
          normal: ['Chart', 'The chart itself. Switch it off to see only the lists below it.'],
          bu: ['Bubbling Under', 'The entries just below the cut.'],
          off: ['Off the Chart', 'What dropped out this week.'],
          new: ['New Entries', 'Everything that’s new this week, in one list.']
        } },
        size: { title: '⋮ → Size', items: {
          week: ['Weekly sizes', 'Top 10, 20, 25, 30, 50 or 100.'],
          other: ['Other charts', 'Daily: Top 10 to 50 (starts at 20). Monthly: 25 to 100 (starts at 50). Yearly: 50, 100, 200 or everything (starts at 100). All-Time: 50, 100, 200 or everything (starts at everything).']
        } },
        actions: { title: '⋮ → Actions', items: {
          playall: ['Play all', 'Plays the chart’s songs in order in the player.'],
          shuffle: ['Shuffle', 'The same, in random order.'],
          export: ['Export playlist', 'The chart as a playlist: copy it, save it as a text file, or take it to Spotify and others.'],
          share: ['Share as image', 'A picture of the chart for social media, in several sizes and styles.'],
          pdf: ['Printable PDF', 'The chart laid out for printing or saving as a PDF.']
        } },
        badges: { title: 'Badges on a row', items: {
          up: ['▲ Climber', 'Up that many places.'],
          down: ['▼ Faller', 'Down that many places.'],
          same: ['= No change', 'Same place as last week.'],
          newe: ['NEW', 'First week ever on the chart.'],
          re: ['RE', 'Back after dropping off.'],
          peak: ['PEAK #', 'Highest position ever.'],
          cert: ['Gold / Platinum / Diamond', 'Passed a play-count mark.'],
          best: ['▲ BEST', 'Most plays in a week so far.']
        } }
      },
      challenges: {
        'week.prev': ['Go back one week', 'Press ‹ or the ← key.'],
        'week.jump': ['Open the calendar', 'Click the week’s name.'],
        'week.type': ['Look at your Artists or Albums chart', 'Use the switch above the chart.'],
        'week.layout': ['Try a layout other than Table', 'Any of the six layout buttons.'],
        'week.size': ['Change the chart’s size', '⋮ → Size.'],
        'week.show': ['Switch on something in ⋮ → Show', 'Peak tags is a good one to start with.'],
        'week.animate': ['Animate the chart', 'Press Animate chart.'],
        'week.run': ['Open a song’s chart run', 'The little bars at the end of a row.']
      },
      quiz: {
        q1: ['A row shows RE. What does it mean?',
          ['It’s new this week', 'It came back after dropping off', 'It repeated last week’s position'],
          'RE means re-entry: it was on the chart before, dropped off, and is back. It keeps its old peak and weeks.'],
        q2: ['A song shows ▲7 with a small #9 under it. Where was it last week?',
          ['#7', '#9', '#16'],
          'The small number is last week’s position. It climbed 7 places, from #9 to #2.'],
        q3: ['What decides where a song sits on the Weekly chart?',
          ['Its plays that week', 'Its plays ever', 'Its highest position so far'],
          'Only plays inside that week count. Nothing carries over from earlier weeks.']
      },
      tips: [
        'Press ← and → to flip through weeks without touching the mouse.',
        'Right-click any chart row (or press its ⋮) for play, playlist and more.',
        'Songs, Artists and Albums each remember their own layout, so albums can be a Mosaic while songs stay a Table.',
        'Animate chart replays the move from last week’s chart to this one, play by play. Try it on a week with a close race for #1.',
        'Click any of the four number tiles to jump straight to that chart.'
      ]
    },

    // Planned lessons: a title and one line for their "Coming soon" card
    daily: {
      title: 'Your Daily chart',
      promise: 'One day at a time: its chart, when you listened, how it felt, and what it reminds you of.',
      scenes: {
        top: { title: 'Top of the page', spots: {
          daily: ['Daily', 'Today’s chart, and any day before it. The D key jumps here.'],
          prev: ['Day before', 'Goes back one day. The ← key does the same.'],
          label: ['Which day', 'Click it to open a calendar and jump to any day.'],
          next: ['Day after', 'Goes forward one day.'],
          banner: ['The day in one line', 'Who owned the day and what made it stand out. For today it says who is leading so far.'],
          peak: ['Record tag', 'Shows when a number is a record, like your biggest day this month or ever.'],
          tiles: ['Four numbers', 'Plays, different songs, artists and albums that day, with the change against the day you compare with.'],
          hours: ['Plays by hour', 'Every hour of the day and how many plays it had.'],
          best: ['Busiest hour', 'The gold cell is the hour you played most.'],
          share: ['Share', 'Saves these numbers as a picture.']
        } },
        tools: { title: 'Tools above the chart', spots: {
          cmp: ['{{t:dy_compare_label}}', 'Which day the movement arrows and changes are measured against.'],
          cmp1: ['{{t:dy_vs_yesterday}}', 'Against the day before. The one you start with.'],
          cmp2: ['The same weekday', 'Against the same weekday a week earlier, so a Tuesday is measured against last Tuesday.'],
          no1: ['{{t:dy_no1_today}}', 'Your #1 song of the day, and how many days in a row it has been #1.'],
          recap: ['{{t:dy_recap}}', 'The day as a short story, one card at a time.'],
          share: ['{{t:dy_share_img}}', 'A picture of the day’s chart to share.'],
          play: ['Play the top songs', 'Plays the day’s chart in order.'],
          cal: ['{{t:dy_cal_title}}', 'A month of days, each with its #1 song’s cover. Click one to open it.'],
          save: ['{{t:dy_save_pl}}', 'Keeps the day’s chart as one of your playlists.'],
          export: ['{{t:dy_export}}', 'The chart as a list to copy, save as text or take to Spotify and others.'],
          title: ['Chart size', 'How many songs the Daily chart holds. Change it in ⋮ → Size.'],
          heads: ['Columns', 'Rank, movement, title and artist, album, days on the chart and plays.']
        } },
        panel: { title: 'Your day', spots: {
          today: ['The day', 'Plays that day against your usual day.'],
          week: ['Last 7 days', 'A bar for each of the last 7 days, and the total against the 7 days before.'],
          first: ['First play', 'The first song you played that day, and when.'],
          last: ['Last play', 'The last song of the day, and when.'],
          topart: ['{{t:dy_top_artist}}', 'Who you played most that day.'],
          repeat: ['{{t:ns_x_on_repeat}}', 'Songs you have played on most of the last 7 days. It turns through them on its own.'],
          moods: ['Mood', 'Pick how the day felt.'],
          note: ['A line about your day', 'Where you were, what happened. Up to 500 characters.'],
          status: ['Where it is kept', 'Saved in this browser. Sign in and it follows you to every device.']
        } },
        time: { title: 'Time of day and patterns', spots: {
          busiest: ['{{t:dy_busiest}}', 'The hour with the most plays.'],
          sessions: ['Listening sessions', 'How many separate stretches of listening the day had.'],
          longest: ['{{t:dy_longest_lbl}}', 'Your longest stretch without a long break, and when it ran.'],
          tl: ['Covers by hour', 'The most played song of each hour.'],
          hours: ['Hour bars', 'How many plays each hour had. Click a bar to see that hour.'],
          busy: ['The busiest bar', 'Lit up so it’s easy to find.'],
          hourcard: ['The hour you picked', 'Its plays and its most played song.'],
          parts: ['Parts of the day', '{{t:dy_part_night}}, {{t:dy_part_morning}}, {{t:dy_part_afternoon}} and {{t:dy_part_evening}}: their plays, their share of the day and their top song. The busiest one is marked {{t:dy_part_peak}}.'],
          replayed: ['{{t:dy_pat_most}}', 'The song you played most that day.'],
          b2b: ['{{t:dy_pat_b2b}}', 'The most times a song, and an artist, played in a row.'],
          full: ['{{t:dy_pat_full}}', 'Albums you played every track of that day.'],
          variety: ['{{t:dy_pat_variety}}', 'From loyal (the same few songs) to explorer (always something different).'],
          genres: ['{{t:dy_genre_title}}', 'The genres you played that day, as a share of your plays.']
        } },
        mem: { title: 'Memories and milestones', spots: {
          otd: ['{{t:dy_otd}}', 'What you were playing on this date in earlier years.'],
          forgot: ['{{t:dy_forgot}}', 'Songs you once played a lot and haven’t played for a long time.'],
          back: ['{{t:dy_comeback}}', 'Songs you played that day for the first time in a long while.'],
          firsth: ['{{t:dy_first}}', 'Songs and artists you heard for the very first time that day.'],
          list: ['The list', 'Click any row to open its window.'],
          awards: ['{{t:dy_aw_title}}', 'The day’s song, artist, album, discovery and comeback.'],
          mshit: ['{{t:dy_ms_hit}}', 'Play counts reached that day, like a song’s 500th play.'],
          msrec: ['{{t:dy_rec_title}}', 'Records set that day.'],
          msstreak: ['{{t:dy_streaks}}', 'Days in a row you kept playing a song or artist, and runs that ended.'],
          msgoal: ['{{t:dy_goals}}', 'How far the day is from your best days.'],
          msnear: ['{{t:dy_close_title}}', 'Milestones only a few plays away.']
        } },
        recap: { title: '{{t:dy_recap}}', spots: {
          bars: ['Progress', 'One bar for each card in the story.'],
          big: ['A card', 'One thing about the day per card: the plays, the #1 song, the top artist, when you listened, your variety and the highlights. The last card can share the day or play its top songs.'],
          next: ['Next card', 'Tap the right side or press →.'],
          prev: ['Previous card', 'Tap the left side or press ←.'],
          x: ['Close', 'Esc does the same.']
        } },
        cal: { title: '{{t:dy_cal_title}}', spots: {
          title: ['The month', 'Which month you’re looking at.'],
          prev: ['Month before', 'Goes back one month. The ← key does the same.'],
          next: ['Month after', 'Goes forward one month. The → key does the same.'],
          grid: ['Every day', 'Each day shows its #1 song’s cover.'],
          day: ['A day', 'Click it to open that day’s chart.'],
          share: ['Share', 'Turns the month into a picture to share.'],
          x: ['Close', 'Esc does the same.']
        } }
      },
      howto: {
        pick: { title: 'Go to another day', slides: [
          'Press ‹ for the day before. The ← key works too.',
          'Or click the date to pick any day from a calendar.',
          '{{t:dy_cal_title}} shows a whole month at once.',
          'Each day has its #1 song’s cover. Click one to open that day.'
        ] },
        compare: { title: 'Choose what the day is compared with', slides: [
          'Movement starts out measured against yesterday.',
          'Pick the same weekday instead to compare, say, this Tuesday with last Tuesday.',
          'The arrows, NEW and RE tags and the changes follow your choice.'
        ] },
        recap: { title: 'Watch your day as a story', slides: [
          'Press {{t:dy_recap}}.',
          'The day comes as cards, one thing at a time.',
          'Tap the right side for the next card.',
          'Close it whenever you like.'
        ] },
        diary: { title: 'Keep a diary of your days', slides: [
          'Pick how the day felt.',
          'Add a line about it: where you were, what happened.',
          'It’s saved straight away. Sign in and it follows you to every device.'
        ] },
        hours: { title: 'See when you listened', slides: [
          'Each bar is one hour. Click one.',
          'That hour’s plays and its most played song show here.',
          'The four parts of the day add it up, with the top song of each.'
        ] },
        memories: { title: 'Look back from any day', slides: [
          '{{t:dy_otd}}: what you played on this date in earlier years.',
          '{{t:dy_forgot}}: old favourites you haven’t played for a long time.',
          '{{t:dy_comeback}}: songs that came back that day.',
          '{{t:dy_first}}: everything you heard for the first time.',
          'Further down, Milestones & goals counts what the day reached and how close you are to your best.'
        ] },
        keep: { title: 'Keep a day', slides: [
          '{{t:dy_save_pl}} keeps the chart as one of your playlists.',
          '{{t:dy_export}} gives you the list for Spotify and others.',
          '{{t:dy_share_img}} makes a picture of it.'
        ] }
      },
      options: {
        actions: { title: 'Buttons above the chart', items: {
          recap: ['{{t:dy_recap}}', 'The day as a story of cards.'],
          share: ['{{t:dy_share_img}}', 'A picture of the day’s chart.'],
          play: ['Play the top songs', 'Plays the day’s chart in order.'],
          cal: ['{{t:dy_cal_title}}', 'A month of days with their #1 covers.'],
          save: ['{{t:dy_save_pl}}', 'The chart as one of your playlists.'],
          export: ['{{t:dy_export}}', 'The chart as a list for other apps.']
        } },
        compare: { title: '{{t:dy_compare_label}}', items: {
          yday: ['{{t:dy_vs_yesterday}}', 'Against the day before.'],
          wday: ['The same weekday', 'Against the same weekday a week earlier.']
        } },
        sections: { title: 'Below the chart', items: {
          panel: ['The day', 'Plays against your usual day, the last 7 days, first and last play, top artist, on repeat.'],
          diary: ['{{t:dy_diary_title}}', 'A mood and a line about the day.'],
          time: ['{{t:dy_tod_title}}', 'Plays by hour, sessions and the four parts of the day.'],
          pats: ['{{t:dy_pat_title}}', 'Most replayed, back to back, albums in full, variety and genres.'],
          mem: ['{{t:dy_mem_title}}', 'This date in earlier years, old favourites, comebacks and first plays.'],
          ms: ['{{t:dy_ms_title}}', 'The day’s awards, milestones, records, streaks and goals.']
        } },
        memtabs: { title: '{{t:dy_mem_title}}', items: {
          otd: ['{{t:dy_otd}}', 'This date in earlier years.'],
          forgot: ['{{t:dy_forgot}}', 'Old favourites gone quiet.'],
          back: ['{{t:dy_comeback}}', 'Back after a long break.'],
          firsth: ['{{t:dy_first}}', 'Heard for the first time.'],
          throw: ['{{t:dy_throw}}', 'All-time favourites you haven’t played for a while. Each tab only shows on days it has something.']
        } },
        mstabs: { title: '{{t:dy_ms_title}}', items: {
          hit: ['{{t:dy_ms_hit}}', 'Play counts reached.'],
          rec: ['{{t:dy_rec_title}}', 'Records set that day.'],
          streak: ['{{t:dy_streaks}}', 'Runs of days kept or ended.'],
          goal: ['{{t:dy_goals}}', 'How far from your best days.'],
          near: ['{{t:dy_close_title}}', 'Milestones a few plays away.']
        } },
        size: { title: '⋮ → Size', items: {
          day: ['Daily sizes', 'Top 10, 20, 25, 30 or 50.']
        } }
      },
      challenges: {
        'day.prev': ['Go back one day', 'Press ‹ or the ← key.'],
        'day.cmp': ['Compare with the same weekday', 'The switch next to {{t:dy_compare_label}}.'],
        'day.recap': ['Open {{t:dy_recap}}', 'The first button above the chart.'],
        'day.cal': ['Open the {{t:dy_cal_title}}', 'A button above the chart.'],
        'day.mood': ['Pick a mood for a day', 'In {{t:dy_diary_title}}.'],
        'day.hour': ['Pick an hour', 'A bar in {{t:dy_tod_title}}.'],
        'day.tab': ['Open another Memories or Milestones tab', 'For example {{t:dy_forgot}}.'],
        'day.save': ['Save a day as a playlist', '{{t:dy_save_pl}} above the chart.']
      },
      quiz: {
        q1: ['You compare with the same weekday. What is today measured against?',
          ['Yesterday', 'The same weekday a week earlier', 'Your best day ever'],
          'It compares, say, this Tuesday with last Tuesday, which is fairer when your weekdays differ.'],
        q2: ['Where do you write a line about how the day went?',
          ['{{t:dy_diary_title}}', '{{t:dy_mem_title}}', '{{t:dy_recap}}'],
          '{{t:dy_diary_title}} keeps a mood and a line for each day.'],
        q3: ['What does {{t:dy_otd}} show?',
          ['What you played on this date in earlier years', 'Today’s most played song', 'Songs you have never heard'],
          'It looks back at the same date in every earlier year you have plays for.']
      },
      tips: [
        '{{t:dy_recap}} turns any day into a story of cards. Try it on your busiest day.',
        '{{t:dy_mem_title}} → {{t:dy_otd}} shows what you were playing on this date in earlier years.',
        'The {{t:dy_cal_title}} shows each day’s #1 cover, a whole month at a glance.',
        'Pick a mood and add a line in {{t:dy_diary_title}}, and the Daily tab becomes a music diary.'
      ]
    },

    periods: {
      title: 'Monthly and Yearly charts',
      promise: 'Months that show what really stuck, year-end charts for any year, and what each record tag means.',
      scenes: {
        mtop: { title: 'A month', spots: {
          monthly: ['Monthly', 'One calendar month at a time. The M key jumps here.'],
          yearly: ['Yearly', 'One calendar year at a time. The Y key jumps here.'],
          label: ['Which month', 'Click it to jump to any month. ‹ and › step a month at a time.'],
          banner: ['The month in one line', 'Who owned it, and how it compares with your other months.'],
          peak: ['Record tag', 'ALL-TIME PEAK means no month has ever beaten this number.'],
          tiles: ['Four numbers', 'Plays, different songs, artists and albums, with the change from the month before.'],
          days: ['Plays by day', 'Every day of the month and its plays.'],
          day: ['A day', 'Click any day to open it on the Daily chart.'],
          best: ['Best day', 'The gold cell is the month’s busiest day.'],
          share: ['Share', 'Saves these numbers as a picture.']
        } },
        mchart: { title: 'The monthly chart', spots: {
          title: ['Chart size', 'Monthly starts at Top 50. Change it in ⋮ → Size.'],
          heads: ['Columns', 'The same as Weekly, but the count is months on the chart.'],
          months: ['Months on chart', 'How many months it has spent on the chart in total.'],
          newe: ['NEW', 'Its first month ever on the chart.'],
          up: ['Climber', 'Up that many places from last month.'],
          plays: ['Plays', 'Plays in the whole month. A song needs steady plays, not one big week.']
        } },
        mnew: { title: 'New this month', spots: {
          bar: ['{{t:atc_title}}', 'The lists around the chart. On Monthly and Yearly that’s the new entries.'],
          tabs: ['{{t:atc_tab_new}}', 'Everything that’s new this month, with a count.'],
          fold: ['Fold', 'Hides the box, keeps its title.'],
          chip1: ['All', 'Every new song this month.'],
          chip2: ['Made the chart', 'Only the new songs that got onto the chart.'],
          chip3: ['New artists', 'Only songs by artists you had never played before.'],
          row: ['A new song', 'Click it to open its window.'],
          debut: ['Debut', 'The position it entered the chart at.'],
          biggest: ['Record debut', 'Shows when a debut is your biggest ever, or biggest in a while.'],
          caps: ['Week by week', 'One mark per week of the month. Lit marks are weeks you played it; brighter means more plays.'],
          ndays: ['Weeks played', 'How many of the month’s weeks it was played in.']
        } },
        cert: { title: 'Certified this month', spots: {
          title: ['Certified this period', 'Songs and albums that went Gold, Platinum or Diamond during this month.'],
          count: ['How many', 'The number certified this month.'],
          filter: ['Filter', 'All, only songs or only albums.'],
          plaque: ['A plaque', 'The award, what it is for and the day it was reached.'],
          hint: ['Browse', 'The plaques slide by on their own. Hover to pause, drag to browse.'],
          collapse: ['Fold', 'Hides the plaques, keeps the title.']
        } },
        ytop: { title: 'A year', spots: {
          yearly: ['Yearly', 'One calendar year at a time.'],
          label: ['Which year', 'Click it to pick another year. ‹ and › step a year at a time.'],
          banner: ['The year in one line', 'Who owned your year and how big it was.'],
          peak: ['Record tag', 'PEAK AT THE TIME means it was a record when it happened, and has been beaten since.'],
          tiles: ['Four numbers', 'The year’s plays, songs, artists and albums, with the change from the year before.'],
          months: ['Plays by month', 'Every month of the year. Click one to open that month.'],
          best: ['Best month', 'The gold cell is the year’s busiest month.']
        } },
        ychart: { title: 'The yearly chart', spots: {
          title: ['Chart size', 'Yearly starts at Top 100, and goes to 200 or every song you played.'],
          search: ['Search the chart', 'Type part of a title or an artist to find it in the chart.'],
          heads: ['Columns', 'The count is years on the chart.'],
          years: ['Years on chart', 'How many year-end charts it has made.'],
          up: ['Climber', 'Up from its place on last year’s chart.'],
          newe: ['NEW', 'Its first year-end chart.'],
          menu: ['Chart options (⋮)', 'Show, Size and Actions, as on Weekly.']
        } }
      },
      howto: {
        month: { title: 'Look at a month', slides: [
          'Pick Monthly.',
          '‹ and › step one month. Click the name to jump further.',
          'Click any day in the strip to open it on the Daily chart.'
        ] },
        year: { title: 'Look at a year', slides: [
          'Pick Yearly.',
          'Step a year with ‹ and ›, or click the year to pick one.',
          'Click a month in the strip to open it.'
        ] },
        peaks: { title: 'Read the record tags', slides: [
          'ALL-TIME PEAK: no month (or year) has ever beaten this number.',
          'PEAK AT THE TIME: it was a record when it happened, and has been beaten since.'
        ] },
        newones: { title: 'Find what’s new', slides: [
          'Under the chart, {{t:atc_tab_new}} lists every new song of the month.',
          'Made the chart keeps only those that got onto the chart.',
          'Each shows where it debuted.',
          'And which weeks of the month you played it.'
        ] },
        cert: { title: 'See what went Gold', slides: [
          'Filter the plaques: all, songs or albums.',
          'Each plaque says what it is for and the day it was reached.',
          'Hover to pause the strip, or drag it to browse.'
        ] },
        find: { title: 'Find a song in a long chart', slides: [
          'Type in the search box above the chart.',
          'Only the matching rows stay, with their real positions.'
        ] }
      },
      options: {
        size: { title: '⋮ → Size', items: {
          month: ['Monthly sizes', 'Top 25, 30, 50 or 100.'],
          year: ['Yearly sizes', 'Top 50, 100, 200 or every song.']
        } },
        peaks: { title: 'Record tags on the tiles', items: {
          alltime: ['ALL-TIME PEAK', 'The biggest ever, still unbeaten.'],
          attime: ['PEAK AT THE TIME', 'A record when it happened, beaten since.']
        } },
        newchips: { title: '{{t:atc_tab_new}}', items: {
          all: ['All', 'Every new song.'],
          made: ['Made the chart', 'New songs that got onto the chart.'],
          artists: ['New artists', 'Songs by artists new to you.']
        } },
        certf: { title: 'Certified this period', items: {
          filter: ['{{t:certd_all}} / {{t:chart_type_songs}} / {{t:chart_type_albums}}', 'Which plaques to show.']
        } }
      },
      challenges: {
        'per.month': ['Open the Monthly chart', 'Monthly, next to Weekly.'],
        'per.year': ['Open the Yearly chart', 'Yearly, next to Monthly.'],
        'per.day': ['Open a day from a month', 'Click a day in the plays-by-day strip.'],
        'per.new': ['Filter the new songs', 'Made the chart, under the chart.'],
        'per.cert': ['Filter the certified plaques', 'Songs or Albums.'],
        'per.search': ['Search a Yearly chart', 'The box above the chart.']
      },
      quiz: {
        q1: ['A tile says ALL-TIME PEAK. What does that mean?',
          ['No month has ever beaten it', 'It’s the best so far this year', 'It’s above your usual month'],
          'ALL-TIME PEAK is the biggest ever. PEAK AT THE TIME was a record once and has been beaten since.'],
        q2: ['A song was #1 on a Weekly chart but isn’t #1 for the month. Why?',
          ['The month counts every week, so steady plays beat one big week', 'Monthly leaves out new songs', 'Monthly only counts weekends'],
          'Each chart counts its own stretch of time. One heavy week can lose to a song you played all month.'],
        q3: ['A new song shows “3 of 5 weeks”. What does it mean?',
          ['It was played in 3 of the month’s 5 weeks', 'It charted 3 times', 'It peaked at #3'],
          'The marks show which weeks of the month you played it.']
      },
      tips: [
        'Click any day in a month’s plays-by-day strip to open that day.',
        'Under a monthly chart, Made the chart shows only the new songs that got on.',
        'Yearly charts have a search box: type a name to find it in your Top 100.'
      ]
    },

    alltime: {
      title: 'All-Time and time travel',
      promise: 'Your biggest songs ever, what your chart is made of, and how it looked on any day in the past.',
      scenes: {
        top: { title: 'Top of the page', spots: {
          alltime: ['All-Time', 'Every play you have, counted once. The A key jumps here.'],
          label: ['Up to when', 'Click it to pick a date and see the chart as it stood that day.'],
          prev: ['A month back', 'Shows the chart as it was one month earlier. Press again to keep going back.'],
          banner: ['Your all-time #1', 'The artist you have played most, ever.'],
          tiles: ['Four numbers', 'All your plays, songs, artists and albums.'],
          total: ['Days and plays a day', 'How many days you have listened, and your plays per day on average.'],
          years: ['Plays by year', 'Every year and its plays. Click one to open that year.'],
          best: ['Best year', 'The gold cell is your biggest year.'],
          share: ['Share', 'Saves these numbers as a picture.']
        } },
        chart: { title: 'The all-time chart', spots: {
          tip: ['A tip', 'Give the chart a size and see what it is made of.'],
          size: ['{{t:ati_hint_btn}}', 'Sets the chart to Top 100 and opens its stats.'],
          hide: ['Hide the tip', 'It won’t come back.'],
          title: ['The whole chart', 'All-Time starts with every song you have played. ⋮ → Size cuts it to 50, 100 or 200.'],
          search: ['Search', 'Find any song or artist in the chart.'],
          heads: ['Columns', 'No movement here: All-Time is one chart, so there is nothing to compare with.'],
          menu: ['Chart options (⋮)', 'Show, Size and Actions.']
        } },
        ati: { title: 'Inside your Top 100', spots: {
          head: ['Inside your Top N', 'What your chart is made of. It follows the size you pick.'],
          toggle: ['{{t:ati_more}} / {{t:ati_less}}', 'Opens or folds the full stats.'],
          hero: ['A fact', 'One thing worth knowing about your chart.'],
          fact: ['{{t:ati_another}}', 'Shows the next fact.'],
          tiles: ['Four numbers', 'How many artists, how much your top 3 hold, its share of all your plays and how many are new since last year.'],
          tile: ['A number', 'Click it to see what’s behind it.'],
          tabs: ['Five views', '{{t:ati_tab_artists}}, {{t:ati_tab_eras}}, {{t:ati_tab_plays}}, {{t:ati_tab_badges}} and {{t:ati_tab_new}}.'],
          panel: ['The view', 'Here: who has the most songs in the chart and the albums with the most songs. Pick a name to see its songs.']
        } },
        pages: { title: 'The bottom of a long chart', spots: {
          pages: ['Pages', 'A long chart comes 100 at a time.'],
          label: ['Where you are', 'Which entries are showing, out of how many.'],
          input: ['Go to a page', 'Type a page number and press Enter.'],
          next: ['Next page', 'The next 100.'],
          last: ['Last page', 'Straight to the end.'],
          export: ['Export', 'The chart as a TXT, a CSV or a printable PDF.']
        } },
        travel: { title: 'Time travel', spots: {
          label: ['Up to that day', 'The chart now counts every play up to this date, and nothing after.'],
          prev: ['Further back', 'Another month back.'],
          next: ['Forward again', 'A month forward, until you’re back to today.'],
          banner: ['Your #1 back then', 'Who led your all-time chart on that day.'],
          tiles: ['The numbers then', 'Your totals as they were on that day.']
        } }
      },
      howto: {
        size: { title: 'See what your chart is made of', slides: [
          'On All-Time, a tip offers to look inside your chart.',
          'Press {{t:ati_hint_btn}}.',
          'The stats sit above the chart and follow the size you pick.'
        ] },
        facts: { title: 'Dig into the stats', slides: [
          '{{t:ati_another}} shows the next fact about your chart.',
          'Click a number to see what’s behind it.',
          'Five views: {{t:ati_tab_artists}}, {{t:ati_tab_eras}}, {{t:ati_tab_plays}}, {{t:ati_tab_badges}} and {{t:ati_tab_new}}.',
          '{{t:ati_less}} folds it away.'
        ] },
        travel: { title: 'Travel back in time', slides: [
          'On All-Time, press ‹.',
          'The chart now counts every play up to a month ago.',
          'Every number goes back too.',
          'Press › to come forward again, or click the date to pick any day.'
        ] },
        find: { title: 'Find a song', slides: [
          'Type in the search box above the chart.',
          'Or jump to a page at the bottom.'
        ] },
        export: { title: 'Take your chart with you', slides: [
          'At the bottom: TXT, CSV or a printable PDF of the whole chart.'
        ] }
      },
      options: {
        size: { title: '⋮ → Size', items: {
          sizes: ['All-Time sizes', 'Top 50, 100, 200 or every song (the one you start with).']
        } },
        atitabs: { title: 'Inside your Top N', items: {
          artists: ['{{t:ati_tab_artists}}', 'Who has the most songs, the albums with the most songs, who rules the top 10.'],
          eras: ['{{t:ati_tab_eras}}', 'Which years and decades the songs come from.'],
          plays: ['{{t:ati_tab_plays}}', 'How the plays spread over the chart, and how fast songs got in.'],
          badges: ['{{t:ati_tab_badges}}', 'Certifications in the chart and the next plaques up.'],
          newyear: ['{{t:ati_tab_new}}', 'What got into the chart in the last year.']
        } },
        export: { title: 'Export', items: {
          txt: ['TXT', 'A plain list.'],
          csv: ['CSV', 'For a spreadsheet.'],
          pdf: ['PDF', 'Laid out for printing.']
        } }
      },
      challenges: {
        'at.size': ['Look inside your Top 100', '{{t:ati_hint_btn}}, or ⋮ → Size.'],
        'at.fact': ['See another fact', '{{t:ati_another}}.'],
        'at.stats': ['Open all the stats', '{{t:ati_more}}.'],
        'at.travel': ['Travel back a month', 'Press ‹ on All-Time.'],
        'at.search': ['Search your all-time chart', 'The box above the chart.'],
        'at.export': ['Export the chart', 'TXT, CSV or PDF at the bottom.']
      },
      quiz: {
        q1: ['What does ‹ do on All-Time?',
          ['Shows the chart as it stood a month earlier', 'Goes to last year’s chart', 'Nothing'],
          'All-Time counts every play up to the date shown. ‹ moves that date back a month.'],
        q2: ['Why are there no movement arrows on All-Time?',
          ['It’s one chart of every play, so there is no earlier chart to compare with', 'They are switched off', 'They only show on phones'],
          'Movement compares one period with the one before. All-Time has no “before”.'],
        q3: ['Where can you see who has the most songs in your Top 100?',
          ['Inside your Top 100 → {{t:ati_tab_artists}}', 'Settings', 'The Board'],
          'Set All-Time to Top 100 and the stats above the chart show it.']
      },
      tips: [
        'On All-Time, ‹ shows your chart as it stood a month ago. Keep going back to see it grow.',
        'Inside your Top 100 has twelve facts. Press {{t:ati_another}} to go through them.',
        'All-Time has a search box: find any song you’ve ever played and its all-time rank.'
      ]
    },
    around: {
      title: 'Around the chart, and sharing it',
      promise: 'What just missed the chart, what fell off, what’s new, and every way to take a chart out of the app.',
      scenes: {
        bu: { title: '{{t:atc_tab_bu}}', spots: {
          bar: ['{{t:atc_title}}', 'One box under the chart with three tabs. It shows on Daily and Weekly (Monthly and Yearly show only the new entries).'],
          tbu: ['{{t:atc_tab_bu}}', 'The songs just below the cut: the next places after your chart size.'],
          toff: ['{{t:sec_off_chart}}', 'What was on last time and isn’t now.'],
          tnew: ['{{t:atc_tab_new}}', 'Everything new this time, in one list.'],
          fold: ['Fold', 'Hides the box but keeps its title.'],
          sub: ['What it ranks', 'Ranked by plays, like the chart itself. This line and the next show with ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_desc}}.'],
          meter: ['Away', 'How many plays the last place on the chart has, so “away” means how many more each one needed.'],
          info: ['{{t:bu_legend_btn}}', 'Opens the key to every tag. It shows when ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_bu_legend}} is on.'],
          rank: ['Its place', 'Where it would sit if the chart were longer.'],
          badge: ['Tags', 'A word or two about its story, like {{t:bu_badge_resurgence}} or {{t:bu_badge_debut}}.'],
          weeks: ['Weeks here', 'How many weeks it has spent in Bubbling Under in total.'],
          away: ['Plays and how far off', 'Its plays, and how many more it needed to make the chart.'],
          row: ['A row', 'Click it to open its run and buttons, as on the chart.']
        } },
        legend: { title: '{{t:bu_legend_btn}}', spots: {
          fresh: ['{{t:bu_badge_debut}}', '{{t:bu_badge_debut_title}}'],
          trending: ['{{t:bu_badge_trending}}', '{{t:bu_badge_trending_title}}'],
          persistent: ['{{t:bu_badge_persistent}}', '{{t:bu_badge_persistent_desc}}'],
          fading: ['{{t:bu_badge_fading}}', '{{t:bu_badge_fading_title}}'],
          resurgence: ['{{t:bu_badge_resurgence}}', '{{t:bu_badge_resurgence_desc}}'],
          resurgent: ['{{t:bu_badge_resurgent}}', '{{t:bu_badge_resurgent_desc}}'],
          clinging: ['{{t:bu_badge_clinging}}', '{{t:bu_badge_clinging_title}}'],
          fallen: ['{{t:bu_badge_fallen}}', '{{t:bu_badge_fallen_desc}}'],
          surging: ['{{t:bu_badge_surging}}', '{{t:bu_badge_surging_desc}}'],
          freefall: ['{{t:bu_badge_freefall}}', '{{t:bu_badge_freefall_desc}}'],
          yoyo: ['{{t:bu_badge_yoyo}}', '{{t:bu_badge_yoyo_desc}}'],
          weeks: ['N weeks', '{{t:bu_badge_weeks_desc}}'],
          streak: ['N-week streak', '{{t:bu_badge_streak_desc}}']
        } },
        off: { title: '{{t:sec_off_chart}}', spots: {
          toff: ['{{t:sec_off_chart}}', 'Every entry that was on the chart last time and dropped out.'],
          was: ['Was', 'Where it was on last time’s chart.'],
          exit: ['How it left', 'Fell from the top 3, slipped just under, a long run ended, or simply dropped out.'],
          peak: ['Its peak', 'The highest it ever reached.'],
          where: ['Where it is now', 'Whether it’s in Bubbling Under now (and how far from coming back), or when you last played it.'],
          stats: ['Before and after', 'Its plays last time and this time, and its weeks on the chart.'],
          streak: ['Its run', 'How many weeks in a row it was on before it dropped.'],
          row: ['A row', 'Click it to open its run.']
        } },
        new: { title: '{{t:atc_tab_new}}', spots: {
          tnew: ['{{t:atc_tab_new}}', 'Every new song this time, made the chart or not.'],
          chips: ['Filters', '{{t:ne_filter_all}}, {{t:ne_filter_chart}} or {{t:ne_filter_new_artists}}.'],
          debut: ['Debut', 'The place it entered the chart at.'],
          caps: ['When you played it', 'One mark per day of the week (per week on Monthly). Brighter means more plays.'],
          row: ['A row', 'Click it to open its window.']
        } },
        share: { title: '{{t:ig_share_title}}', spots: {
          preview: ['Preview', 'Exactly the picture you will get. It changes as you pick.'],
          tpl: ['{{t:sh_design}}', 'Five looks: Editorial, Minimal, Spotlight, Grid and Poster.'],
          swatch: ['{{t:sh_palette}}', 'Colours: your app theme, a fixed palette, or Cover, which takes its colours from your #1’s cover.'],
          format: ['{{t:ig_format}}', '{{t:sh_fmt_post}} for a feed, {{t:sh_fmt_portrait}}, or {{t:sh_fmt_story}} for stories.'],
          src: ['Where the covers come from', 'Deezer, iTunes, Last.fm or YouTube.'],
          pick: ['Pick a picture', 'Click an entry to choose another picture for it.'],
          toggles: ['{{t:ig_show_hide}}', 'Movement, peak badge, weeks on chart, play count, artist, the date and the footer. Untick what you don’t want.'],
          entries: ['{{t:sh_entries}}', 'How many entries the picture holds. {{t:sh_entries_hint}}.'],
          text: ['{{t:sh_text_size}}', 'Bigger or smaller text.'],
          quality: ['{{t:sh_quality}}', '{{t:sh_quality_std}} or {{t:sh_quality_high}}, with the size in pixels.'],
          copy: ['{{t:sh_copy}}', 'Copies the picture, ready to paste into a message or post.'],
          download: ['{{t:btn_download_image}}', 'Saves it as a PNG.']
        } },
        pdf: { title: 'Printable PDF', spots: {
          scope: ['This chart', 'Just the chart you’re on.'],
          all: ['{{t:pdf_all_charts}}', 'Songs, artists and albums in one PDF.'],
          cover: ['{{t:pdf_opt_art}}', 'Covers next to each entry, or a plain list.'],
          bu: ['{{t:pdf_opt_bu}}', 'Adds Bubbling Under at the end.'],
          create: ['{{t:pdf_create}}', 'Opens your print window. Choose “Save as PDF” as the printer to get the file.']
        } },
        export: { title: 'Export playlist', spots: {
          names: ['{{t:export_step_name}}', 'Ready-made names for the playlist. Click one to copy it.'],
          order: ['{{t:export_order_first}} / {{t:export_order_last}}', 'Which way round the list goes.'],
          album: ['{{t:export_include_album}}', 'Adds each song’s album to the list.'],
          list: ['The songs', 'What will be copied, in order.'],
          copy: ['{{t:export_copy_list}}', 'Copies the list as “Artist - Title”, one song per line.'],
          txt: ['.txt', 'Downloads it as a text file.'],
          csv: ['.csv', 'Downloads it for a spreadsheet.'],
          services: ['{{t:export_step_import}}', 'Soundiiz turns the list into a real playlist on Spotify, Apple Music, YouTube Music, Deezer or Tidal.'],
          open: ['{{t:export_open_soundiiz}}', 'Opens Soundiiz in a new tab. The steps above say where to paste.']
        } }
      },
      howto: {
        bu: { title: 'See what just missed the chart', slides: [
          'Under the chart, open {{t:atc_tab_bu}}.',
          'Each song shows how many more plays it needed.',
          'Switch on ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_bu_legend}}, then press {{t:bu_legend_btn}} for the key.',
          'Each tag explains a song’s story, like {{t:bu_badge_debut}}: its first time here.'
        ] },
        off: { title: 'See what fell off', slides: [
          'Open {{t:sec_off_chart}}.',
          'Each one says how it left.',
          'And whether it’s close to coming back.'
        ] },
        hide: { title: 'Choose which lists show', slides: [
          'In ⋮ → Show → Sections, switch Bubbling Under, Off the Chart and New Entries on or off.',
          'Or fold the box with the arrow, so only its title stays.'
        ] },
        share: { title: 'Share your chart as a picture', slides: [
          'In ⋮ → Actions, pick Share as image.',
          'Choose a design.',
          'Pick the colours.',
          'Pick the shape: a post, a portrait or a story.',
          'For example Poster, as a story.',
          'Untick anything you don’t want on it.',
          'Then copy it or download it.'
        ] },
        pdf: { title: 'Print the chart', slides: [
          'In ⋮ → Actions, pick Printable PDF.',
          'Just this chart, or all three.',
          'Press {{t:pdf_create}} and choose “Save as PDF” as the printer.'
        ] },
        export: { title: 'Make a playlist on Spotify (or anywhere)', slides: [
          'In ⋮ → Actions, pick Export playlist.',
          'Click a name to copy it.',
          'Copy the list of songs.',
          'Soundiiz turns it into a playlist on the service you use.',
          'Open Soundiiz and paste it where the steps say.'
        ] },
        play: { title: 'Play the whole chart', slides: [
          'In ⋮ → Actions, Play all plays the chart in order.',
          'Shuffle plays it in random order.'
        ] }
      },
      options: {
        tabs: { title: '{{t:atc_title}}', items: {
          bu: ['{{t:atc_tab_bu}}', 'Just below the cut. Daily and Weekly.'],
          off: ['{{t:sec_off_chart}}', 'Dropped out since last time. Daily and Weekly.'],
          new: ['{{t:atc_tab_new}}', 'Everything new. Every window except All-Time.']
        } },
        tags: { title: '{{t:bu_legend_btn}}', items: {
          fresh: ['{{t:bu_badge_debut}}', '{{t:bu_badge_debut_title}}'],
          trending: ['{{t:bu_badge_trending}}', '{{t:bu_badge_trending_title}}'],
          persistent: ['{{t:bu_badge_persistent}}', '{{t:bu_badge_persistent_desc}}'],
          fading: ['{{t:bu_badge_fading}}', '{{t:bu_badge_fading_title}}'],
          resurgence: ['{{t:bu_badge_resurgence}}', '{{t:bu_badge_resurgence_desc}}'],
          resurgent: ['{{t:bu_badge_resurgent}}', '{{t:bu_badge_resurgent_desc}}'],
          clinging: ['{{t:bu_badge_clinging}}', '{{t:bu_badge_clinging_title}}'],
          fallen: ['{{t:bu_badge_fallen}}', '{{t:bu_badge_fallen_desc}}'],
          surging: ['{{t:bu_badge_surging}}', '{{t:bu_badge_surging_desc}}'],
          freefall: ['{{t:bu_badge_freefall}}', '{{t:bu_badge_freefall_desc}}'],
          yoyo: ['{{t:bu_badge_yoyo}}', '{{t:bu_badge_yoyo_desc}}'],
          weeks: ['N weeks', '{{t:bu_badge_weeks_desc}}'],
          streak: ['N-week streak', '{{t:bu_badge_streak_desc}}']
        } },
        design: { title: '{{t:ig_share_title}}', items: {
          tpl: ['{{t:sh_design}}', 'Editorial, Minimal, Spotlight, Grid or Poster.'],
          pal: ['{{t:sh_palette}}', 'App theme, six fixed palettes, or Cover.'],
          fmt: ['{{t:ig_format}}', '{{t:sh_fmt_post}}, {{t:sh_fmt_portrait}} or {{t:sh_fmt_story}}.'],
          art: ['{{t:ig_album_art}}', 'On or off, and where the covers come from.'],
          pick: ['Pictures', 'Choose another picture for any entry.'],
          show: ['{{t:ig_show_hide}}', 'Movement, peak, weeks, plays, artist, date, footer.'],
          entries: ['{{t:sh_entries}}', '{{t:sh_entries_hint}}.'],
          text: ['{{t:sh_text_size}}', 'From 80% to 130%.'],
          quality: ['{{t:sh_quality}}', '{{t:sh_quality_std}} or {{t:sh_quality_high}}.']
        } },
        pdf: { title: 'Printable PDF', items: {
          scope: ['This chart / {{t:pdf_all_charts}}', 'One chart or all three.'],
          cover: ['{{t:pdf_opt_art}}', 'Covers next to each entry.'],
          bu: ['{{t:pdf_opt_bu}}', 'Adds Bubbling Under at the end.']
        } },
        export: { title: 'Export playlist', items: {
          names: ['{{t:export_step_name}}', 'Ready-made playlist names.'],
          order: ['{{t:export_order_first}} / {{t:export_order_last}}', 'Which way round.'],
          album: ['{{t:export_include_album}}', 'Adds the album to each line.'],
          copy: ['{{t:export_copy_list}}', 'Artist - Title, one per line.'],
          files: ['.txt / .csv', 'Download the list as a file.'],
          soundiiz: ['{{t:export_open_soundiiz}}', 'Build the playlist on another service.']
        } }
      },
      challenges: {
        'around.tab': ['Open another tab under the chart', '{{t:sec_off_chart}} or {{t:atc_tab_new}}.'],
        'around.legend': ['Open {{t:bu_legend_btn}}', 'Switch on ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_bu_legend}} first.'],
        'around.share': ['Open Share as image', '⋮ → Actions.'],
        'around.design': ['Try another design for the picture', 'In the share window.'],
        'around.pdf': ['Open Printable PDF', '⋮ → Actions.'],
        'around.export': ['Open Export playlist', '⋮ → Actions.'],
        'around.copy': ['Copy a playlist name or the list', 'In the export window.'],
        'around.play': ['Play all of a chart', '⋮ → Actions → Play all.']
      },
      quiz: {
        q1: ['A song in Bubbling Under says 1 PLAY AWAY. What does it mean?',
          ['One more play and it would have made the chart', 'You played it once', 'It is #1 in Bubbling Under'],
          '“Away” is how many more plays it needed to reach the last place on the chart.'],
        q2: ['Where do you find songs that were on last week’s chart but not this week’s?',
          ['{{t:sec_off_chart}}', '{{t:atc_tab_new}}', 'All-Time'],
          '{{t:sec_off_chart}} lists every dropout, how it left and whether it’s close to coming back.'],
        q3: ['You want your chart picture to fill a phone screen for a story. What do you change?',
          ['{{t:ig_format}} → {{t:sh_fmt_story}}', '{{t:sh_palette}}', '{{t:sh_text_size}}'],
          'The format sets the shape: 1:1 for a post, 4:5 portrait, 9:16 for stories.']
      },
      tips: [
        'In Bubbling Under, {{t:bu_legend_btn}} explains every tag, from {{t:bu_badge_debut}} to {{t:bu_badge_fallen}}.',
        'The share window has five designs. Poster as a 9:16 story looks great on a phone.',
        'Export playlist plus Soundiiz turns any chart into a real playlist on Spotify, Apple Music and more.'
      ]
    },
    windows: {
      title: 'Song, artist and album windows',
      promise: 'Everything about one song, artist or album, how to find any of them in a second, and your listening streaks.',
      scenes: {
        song: { title: 'A song’s window', spots: {
          art: ['Cover', 'Its cover. Point at it for the ✎ to pick another picture (press and hold on a phone).'],
          title: ['The song', 'Its name.'],
          sub: ['Artist and album', 'Click either to open its window.'],
          sample: ['{{t:ea_s_sample}}', 'Plays 30 seconds of it.'],
          playlist: ['{{t:dp_playlist}}', 'Adds it to one of your playlists.'],
          rate: ['{{t:dp_rate}}', 'Give it a score out of 10.'],
          more: ['{{t:ea_more}}', 'Everything else: the video, the album, the artist, its chart run, change the picture, search on YouTube or Spotify.'],
          links: ['Spotify, YouTube, Last.fm', 'Finds it on each of them.'],
          share: ['{{t:st_am_share}}', 'A picture card of this song to share.'],
          tabs: ['Tabs', '{{t:dp_tab_overview}}, {{t:dp_tab_charts}} and {{t:dp_tab_listening}}.'],
          close: ['Close', 'Esc does the same.'],
          hero: ['Total plays', 'All its plays, its share of the artist’s plays, its certification and its all-time rank.'],
          span: ['First and last play', 'When you first and last played it, and on how many days in between.'],
          trio: ['Three numbers', 'Days played, plays per day on those days, and plays to the next certification.'],
          favs: ['Where it lives', 'Its album and its artist, and where it ranks in each. Click to open them.'],
          habits: ['{{t:ao_habits}}', 'Its longest run of days, its biggest day, its longest run of plays in a row, its longest break and its comebacks.'],
          rating: ['My Rating', 'Your score, and a link to rate the whole album.'],
          trophies: ['Chart Accomplishments', 'Every badge it earned: weeks at #1, top 10 runs, its debut, its certification. Tap one to see what earned it.']
        } },
        songcharts: { title: '{{t:dp_tab_charts}}', spots: {
          rktop: ['Peaks', 'Its best place on the Daily, Weekly, Monthly and Yearly charts.'],
          rkhero: ['Its peak', 'Its best place on the weekly chart and when it got there.'],
          plot: ['Rank over time', 'Its position week by week. Move over the line (or tap it) to see each week.'],
          detail: ['The week you point at', 'Its place, its move and its plays that week.'],
          moments: ['Chart moments', 'Its debut, its longest run at #1 and other moments.'],
          fam: ['Against its album and artist', 'How it did next to the other songs of its album and its artist.'],
          hof: ['Hall of Fame records', 'Every record it holds in Records.'],
          run: ['Its chart run', 'The same run as under a chart row.']
        } },
        songlisten: { title: '{{t:dp_tab_listening}}', spots: {
          lshero: ['On rotation', 'Whether you still play it, how long you’ve been listening, and its biggest month.'],
          spark: ['Plays by month', 'Every month you played it. The crown marks its best month.'],
          found: ['The day you found it', 'What you were playing around the first time you heard it.'],
          along: ['Heard alongside', 'Songs you played within 30 minutes of it, most often.'],
          clock: ['When you listen', 'The time of day you play it most.'],
          seasons: ['Seasons', 'Which seasons you play it in.'],
          miles: ['Milestones', 'When it reached its first play, play 100, 200 and so on.'],
          next: ['Next up', 'Its next milestone, how far away, and roughly when you’ll get there.'],
          heat: ['Every day you played it', 'A calendar of every day it was played.'],
          more: ['More', 'Streak records and its full play history.']
        } },
        artist: { title: 'An artist’s window', spots: {
          tabs: ['Six tabs', '{{t:dp_tab_overview}}, {{t:dp_tab_music}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}, {{t:dp_tab_rating}} and {{t:dp_tab_awards}}.'],
          hero: ['Total plays', 'All their plays, their share of all yours, and where they rank among your artists.'],
          favs: ['Favourites', 'Their song, album and more that you play most.'],
          habits: ['{{t:ao_habits}}', 'Days played, longest run of days, biggest day and more.'],
          slam: ['Grand Slam', 'Shows when they have been #1 on the Weekly, Monthly and Yearly charts.'],
          trophies: ['Chart Accomplishments', 'Every badge they earned.'],
          rating: ['My Ratings', 'Your average score for what you rated of theirs.']
        } },
        music: { title: '{{t:dp_tab_music}}', spots: {
          top: ['Songs and albums', 'Switch between their songs and their albums.'],
          intro: ['What’s listed', 'Everything of theirs that made your charts.'],
          charts: ['Which chart', 'All-time, or only those that made the Yearly, Monthly, Weekly or Daily chart.'],
          sum: ['Totals', 'How many, how many reached #1 and the top 10, and their plays.'],
          tools: ['Sort', '{{t:am_sort_rank}}, {{t:am_sort_plays}}, {{t:am_sort_recent}}, {{t:am_sort_az}}.'],
          list: ['The list', 'Each with its rank, certification, first and last play. Open one for its details.']
        } },
        awards: { title: '{{t:dp_tab_awards}}', spots: {
          sw: ['Two sides', 'Your own awards (My Grammies) or real-life award shows.'],
          real: ['Real life', 'Their nominations and wins at real award shows, and how your ballots compare.']
        } },
        album: { title: 'An album’s window', spots: {
          hero: ['Total plays', 'All its plays, its share of the artist’s, its certification and its rank.'],
          favs: ['Its songs', 'Its most played songs.'],
          habits: ['{{t:ao_habits}}', 'The same habits as a song’s, for the whole album.'],
          rating: ['My Evaluation', 'Score each track and get the album’s overall score.'],
          trophies: ['Chart Accomplishments', 'Every badge the album earned.'],
          plaques: ['Certification Plaques', 'Its Gold, Platinum or Diamond plaques.']
        } },
        menus: { title: 'The ⋮ menu', spots: {
          more: ['⋮ on a row', 'Every chart row has one. Right-click a row for the same menu.'],
          menu: ['The menu', 'A sample, the video, add to a playlist, details, its album and artist, its chart run, change its picture, search on YouTube or Spotify.'],
          change: ['{{t:img_picker_change}}', 'Opens the cover picker for this entry.']
        } },
        cover: { title: '{{t:img_picker_change}}', spots: {
          now: ['The picture now', 'The cover it has at the moment.'],
          title: ['What you’re changing', 'The song, album or artist this picture is for.'],
          deezer: ['Deezer', 'Pictures found on Deezer.'],
          current: ['The one in use', 'The ringed picture is the one showing now.'],
          itunes: ['iTunes', 'Pictures found on iTunes, often several versions and covers of singles.'],
          tile: ['Pick one', 'Click any picture to use it. The picker closes and the new cover shows straight away.'],
          lastfm: ['Last.fm', 'The picture Last.fm has.'],
          youtube: ['YouTube', 'A still from its video.'],
          url: ['{{t:imgpk_url_label}}', 'Paste a link to any picture on the web…'],
          set: ['{{t:imgpk_apply}}', '…and press this to use it.'],
          none: ['{{t:imgpk_none}}', 'Shows no picture for it, just a plain tile.'],
          auto: ['{{t:imgpk_auto}}', 'Back to the picture the app picks by itself.'],
          close: ['Close', 'Leaves the cover as it was.']
        } },
        search: { title: 'Search', spots: {
          field: ['Type a name', 'Any part of an artist, song or album name. Press / or Ctrl+K anywhere to open it.'],
          esc: ['Close', 'Esc closes it.'],
          group: ['Grouped', 'Artists first, then songs, then albums.'],
          top: ['A result', 'Pick one to open its window. ↑ ↓ and Enter work too.'],
          n: ['Plays', 'How many times you have played it.'],
          songs: ['Songs', 'Songs matching what you typed, with their artists.'],
          foot: ['Keys', '↑ ↓ to move, Enter to open, Esc to close.']
        } },
        hist: { title: 'Search history', spots: {
          chips: ['Recent searches', 'What you typed lately. Click one to search it again.'],
          chip: ['A search', 'Runs it again.'],
          item: ['Recently opened', 'What you opened from the search.'],
          rm: ['Remove', 'Takes one off the list.'],
          clear: ['Clear history', 'Empties both lists.']
        } },
        streak: { title: '{{t:streak_modal_title}}', spots: {
          today: ['{{t:sk_tab_today}}', 'Streaks you keep alive by playing today, and what you lost yesterday.'],
          fire: ['{{t:sk_tab_fire}}', 'Every streak running now: artists, albums and songs you have played days in a row.'],
          recs: ['{{t:sk_tab_records}}', 'Your longest streaks ever, your badges and the streaks that ended.'],
          cal: ['{{t:sk_tab_calendar}}', 'A calendar of your streaks.'],
          fame: ['Hall of Fame', 'Your top 5 longest streaks for artists, albums and songs.'],
          badges: ['Badges', 'Earned by streaks: one long streak, many at once, many different ones. Tap an earned badge to flip it: the date and the music that earned it.']
        } },
        streakcal: { title: '{{t:sk_tab_calendar}}', spots: {
          cal: ['{{t:sk_tab_calendar}}', 'Your streaks, day by day.'],
          filters: ['Filters', 'All, artists, songs or albums, and which year.'],
          wrap: ['The calendar', 'Each day coloured by how much was on a streak. Pick a day to see which.']
        } }
      },
      howto: {
        open: { title: 'Open everything about a song', slides: [
          'Click a song’s title anywhere: a chart, a record, a search.',
          'Its window has three tabs.',
          'Jump to its album or artist from here.',
          'Close it, or press Esc.'
        ] },
        find: { title: 'Find anything in a second', slides: [
          'Press / or Ctrl+K from any page and type.',
          'Pick a result to open its window.',
          'Or use ↑ ↓ and Enter.',
          'Next time, what you opened is waiting here.'
        ] },
        history: { title: 'See a song’s whole story', slides: [
          'On {{t:dp_tab_charts}}: its position week by week.',
          'Its big moments, like its debut and its run at #1.',
          'On {{t:dp_tab_listening}}: the day you found it.',
          'And when it reached each milestone.'
        ] },
        artist: { title: 'Explore an artist', slides: [
          'An artist has six tabs.',
          '{{t:dp_tab_music}} lists their songs and albums, sorted how you like.',
          '{{t:dp_tab_awards}} shows your awards and real-life ones.'
        ] },
        cover: { title: 'Change a cover', slides: [
          'Point at a cover: a ✎ appears in its corner. Click it. On a phone, press and hold the cover instead.',
          'Or open ⋮ on the row and choose {{t:img_picker_change}}. Windows have the same ✎ on their big cover.',
          'The picker shows pictures from Deezer, iTunes, Last.fm and YouTube. The ringed one is in use now.',
          'Click the one you want.',
          'Or paste a link to any picture and press {{t:imgpk_apply}}.',
          '{{t:imgpk_auto}} goes back to the app’s own choice; {{t:imgpk_none}} shows no picture.',
          'The new cover shows everywhere at once: every chart, its window, share images and awards. Signed in, it follows you to every device.'
        ] },
        menu: { title: 'Use the ⋮ menu', slides: [
          'Every row has a ⋮ (or right-click the row).',
          'It has a sample, the video, playlists, details and more.',
          'Windows have the same menu.'
        ] },
        streak: { title: 'Keep your streaks going', slides: [
          'Your listening streak sits at the top of the Charts page. Click it.',
          '{{t:sk_tab_records}}: your longest streaks ever.',
          'And badges to collect.',
          '{{t:sk_tab_calendar}} shows them day by day.'
        ] }
      },
      options: {
        tabs: { title: 'Window tabs', items: {
          song: ['A song', '{{t:dp_tab_overview}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}.'],
          artist: ['An artist', '{{t:dp_tab_overview}}, {{t:dp_tab_music}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}, {{t:dp_tab_rating}}, {{t:dp_tab_awards}}.'],
          album: ['An album', '{{t:dp_tab_overview}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}, {{t:dp_tab_rating}}.']
        } },
        buttons: { title: 'Window buttons', items: {
          sample: ['{{t:ea_s_sample}}', '30 seconds.'],
          playlist: ['{{t:dp_playlist}}', 'Add to a playlist.'],
          rate: ['{{t:dp_rate}}', 'Songs and albums.'],
          share: ['{{t:st_am_share}}', 'A picture card.'],
          more: ['{{t:ea_more}}', 'The ⋮ menu.'],
          links: ['Spotify / YouTube / Last.fm', 'Find it elsewhere.']
        } },
        cover: { title: '{{t:img_picker_change}}', items: {
          open: ['Open the picker', 'The ✎ on a cover, press-and-hold on a phone, or ⋮ → {{t:img_picker_change}}.'],
          sources: ['Deezer, iTunes, Last.fm, YouTube', 'Pictures found for it on each.'],
          link: ['{{t:imgpk_url_label}}', 'Any picture on the web, by its link.'],
          none: ['{{t:imgpk_none}}', 'A plain tile, no picture.'],
          auto: ['{{t:imgpk_auto}}', 'The app picks the picture itself.']
        } },
        music: { title: '{{t:dp_tab_music}}', items: {
          sorts: ['Sort', '{{t:am_sort_rank}} (the one you start with), {{t:am_sort_plays}}, {{t:am_sort_recent}}, {{t:am_sort_az}}.'],
          charts: ['Which chart', 'All-time, Yearly, Monthly, Weekly or Daily.']
        } },
        streaktabs: { title: '{{t:streak_modal_title}}', items: {
          today: ['{{t:sk_tab_today}}', 'Keep them alive today.'],
          fire: ['{{t:sk_tab_fire}}', 'Running now.'],
          recs: ['{{t:sk_tab_records}}', 'Longest ever, badges, ended.'],
          cal: ['{{t:sk_tab_calendar}}', 'Day by day.']
        } }
      },
      challenges: {
        'win.song': ['Open a song’s window', 'Click a song title.'],
        'win.artist': ['Open an artist’s window', 'Click an artist’s name.'],
        'win.album': ['Open an album’s window', 'Click an album name.'],
        'win.tab': ['Switch to another tab in a window', '{{t:dp_tab_charts}} or {{t:dp_tab_listening}}.'],
        'win.search': ['Search your library', 'Press / or the search in the top bar.'],
        'win.menu': ['Open a ⋮ menu', 'On a row, or right-click it.'],
        'win.cover': ['Change a cover', 'The ✎ on a cover, or ⋮ → {{t:img_picker_change}}.'],
        'win.streak': ['Open your streaks', 'The listening streak at the top of the Charts page.']
      },
      quiz: {
        q1: ['How do you open the search from the keyboard?',
          ['Press / or Ctrl+K', 'Press S', 'Press Enter'],
          '/ or Ctrl+K opens it from any page.'],
        q2: ['Where do you see a song’s position week by week?',
          ['The {{t:dp_tab_charts}} tab of its window', 'The {{t:dp_tab_listening}} tab', 'Settings'],
          '{{t:dp_tab_charts}} has its rank over time; move over the line to see each week.'],
        q3: ['What does a streak count?',
          ['Days in a row you played it', 'Its total plays', 'Its weeks on the chart'],
          'A streak is days in a row with at least one play.']
      },
      tips: [
        'Press / on any page to search your whole library.',
        'A song’s {{t:dp_tab_listening}} tab shows the day you found it: what you were playing right before.',
        'In your streaks, tap an earned badge to flip it and see when you earned it.',
        'Don’t like a cover? Point at it and press the ✎ to pick another, or paste a link to any picture.'
      ]
    },
    stats: {
      title: '{{t:tab_stats}}',
      promise: 'Your listening for any stretch of time: a summary, its story, games, side-by-side comparisons and graphs.',
      scenes: {
        top: { title: 'The range and the {{t:sx_tab_overview}}', spots: {
          presets: ['Quick ranges', '{{t:range_4w}}, {{t:range_12m}}, {{t:range_3y}} or {{t:range_all}}. Every tab uses the range you pick here.'],
          dates: ['Your own dates', 'Pick any start and end date for a stretch of your own.'],
          tabs: ['Five tabs', '{{t:sx_tab_overview}}, {{t:sx_tab_story}}, {{t:sx_tab_games}}, {{t:sx_tab_compare}} and {{t:sx_tab_charts}}. The one you leave open is the one you come back to.'],
          line: ['In one sentence', 'Your range in a sentence: how much you played, against the stretch before, and who led. Click the artist to open their window.'],
          share: ['{{t:sx_share}}', 'Makes a picture of this summary to save or send.'],
          tile: ['Four tiles', 'Plays, songs, artists and albums in the range.'],
          delta: ['Against before', 'Up or down against the same length of time just before it, with that number next to it.'],
          trend: ['How it went', 'A small line of how it went over the range.'],
          sub: ['Small numbers', 'Plays a day, your best day, how many were new to you.'],
          go: ['Go deeper', 'Each tile has a link to the graph or comparison that tells more.']
        } },
        ov: { title: 'The rest of the {{t:sx_tab_overview}}', spots: {
          top5: ['{{t:sx_top5_title}}', 'The five you played most in the range. Click one for its window.'],
          t5seg: ['Songs, artists or albums', 'Switch what the top 5 shows.'],
          t5lead: ['Your #1', 'The leader, its plays, its share of all your plays and its lead over #2. Play a sample right here.'],
          t5rows: ['#2 to #5', 'The bars show how close each is to the #1.'],
          sotp: ['{{t:sx_sotp_title}}', 'Your most played song of the range and how its plays went, day by day or week by week.'],
          movers: ['{{t:sx_mov_title}}', 'What you played much more, and much less, than the stretch before.'],
          mvseg: ['Songs, artists or albums', 'Switch what the movers show.'],
          persona: ['{{t:sx_pers_title}}', 'A name for how you listened in this range, like {{t:sx_pers_explorer}} or {{t:sx_pers_marathon}}, and why.'],
          facts: ['{{t:sx_fact_title}}', 'Little things from the range: your longest repeat, your busiest hour and day.'],
          shuffle: ['{{t:sx_fact_shuffle}}', 'Shows other fun facts.'],
          cal: ['{{t:sx_cal_title}}', 'A small calendar of the range, darker the more you played. Click a day to open its Daily chart.'],
          calmore: ['Every year', 'Jumps to the full heatmap in {{t:sx_tab_charts}}.'],
          otd: ['{{t:sx_otd_title}}', 'Today’s date in years past, and the song you played most that day.'],
          split: ['{{t:sx_split_title}}', 'New finds against old favourites, and how much went to your top 5 artists.']
        } },
        story: { title: '{{t:sx_tab_story}}', spots: {
          obs: ['{{t:sx_obs_title_m}}', 'The artist you played most each month (or each week on a short range).'],
          obsone: ['One month', 'Click it to open that month’s chart.'],
          eras: ['{{t:sx_eras_title}}', 'Stretches where one artist was #1 on your weekly chart three weeks or more in a row.'],
          drift: ['{{t:sx_drift_title}}', 'Your yearly top 10 artists, year by year. Click a line or a name to follow one artist.'],
          driftkeys: ['Follow one artist', 'Click a name to light up their line.'],
          loyal: ['{{t:sx_loyal_title}}', 'How much went to your top 10 artists, on a scale from adventurous to loyal.'],
          comfort: ['{{t:sx_comfort_title}}', 'Songs you already knew against songs you found in this range.'],
          disc: ['{{t:sx_disc_title}}', 'Your biggest new artists of the range, and whether you still play them.'],
          fun: ['{{t:sx_fun_title}}', 'The range in other words: plays a day, your top song, how far your plays would walk.'],
          miles: ['{{t:sx_miles_title}}', 'Round numbers you passed: play counts, different songs and artists, and when.']
        } },
        games: { title: '{{t:sx_tab_games}}', spots: {
          head: ['{{t:sx_games_title}}', 'Quizzes made from your own library.'],
          tally: ['Your tally', 'How many of the games you have played, and your day streak for the game of the day.'],
          daily: ['{{t:sx_daily_k}}', 'One puzzle a day, the same all day. Only your first try counts; play every day to keep the streak.'],
          dailygo: ['{{t:sx_daily_play}}', 'Starts today’s puzzle.'],
          card: ['A game', 'Twelve games: {{t:sx_game_hl}}, {{t:sx_game_tune}}, {{t:sx_game_year}}, {{t:sx_game_one}} and more.'],
          tag: ['{{t:sx_games_new}}', 'Games you haven’t played yet are tagged.'],
          go: ['{{t:sx_game_play}}', 'Opens the game full screen.']
        } },
        game: { title: 'Playing a game', spots: {
          title: ['The game', 'Its name.'],
          score: ['Your score', 'Your streak or score now, and your best ever.'],
          close: ['Close', 'Back to the games. Esc does the same.'],
          q: ['The question', 'What you have to guess.'],
          known: ['What you know', 'One side shows its answer.'],
          guess: ['What you guess', 'The other is hidden.'],
          btns: ['Your answer', 'Pick one. Right answers keep the game going; at the end you can share your result.']
        } },
        cmp: { title: '{{t:sx_tab_compare}}', spots: {
          gran: ['{{t:gran_daily}} / {{t:gran_monthly}} / {{t:gran_yearly}}', 'How the lines are split: by day, by month or by year. Shows on {{t:sx_tab_compare}} and {{t:sx_tab_charts}}.'],
          top: ['Your top', 'Fills the line-up with your top picks for the range.'],
          saved: ['{{t:sx_saved_title}}', 'Save a line-up to bring it back later.'],
          types: ['What to compare', '{{t:sx_cmp_type_artists}}, {{t:sx_cmp_type_songs}}, {{t:sx_cmp_type_albums}} or {{t:sx_cmp_type_years}}.'],
          modes: ['How to show it', '{{t:sx_cmp_mode_cum}}, {{t:sx_cmp_mode_per}}, {{t:sx_cmp_mode_run}} or {{t:sx_cmp_mode_race}}.'],
          chip: ['A pick', 'Its rank, plays and share. The bar under it is its colour on the graph.'],
          x: ['Remove', 'Takes it off.'],
          add: ['Add', 'Type a name, pick it from the list. Up to 10.'],
          legend: ['The legend', '{{t:sx_cmp_legend_tip}}.'],
          chart: ['The graph', 'Point at it (or tap) to read each period.'],
          verdict: ['Who wins', 'Most plays, most weeks at #1, hottest right now, with you longest.']
        } },
        cmpmore: { title: 'More under {{t:sx_tab_compare}}', spots: {
          h2h: ['{{t:sx_h2h_title}}', 'Who leads and by how much, and each one’s share.'],
          share: ['{{t:sx_share}}', 'A picture of the comparison.'],
          table: ['The table', 'Plays, share, first play, weeks at #1, best month, longest streak. Click a column to sort; the best in each is in its colour.'],
          own: ['{{t:sx_own_title}}', 'One block per month in the colour of whoever played most, and when the lead changed.'],
          gaps: ['{{t:sx_gap_title}}', 'The closest race, the biggest lead, the fastest rise and the longest in front.'],
          ts: ['{{t:sx_ts_title}}', 'Each one’s three most played songs.'],
          hab: ['{{t:sx_hab_title}}', 'When each one gets played: by hour and by day of the week.']
        } },
        run: { title: '{{t:sx_cmp_mode_run}}', spots: {
          run: ['{{t:sx_cmp_mode_run}}', 'Their places on your chart, week by week.'],
          crun: ['Which chart', '{{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} or {{t:nav_yearly}}.'],
          chart: ['Rank over time', 'Higher is better. Gaps are weeks off the chart.']
        } },
        race: { title: '{{t:sx_cmp_mode_race}}', spots: {
          race: ['{{t:sx_cmp_mode_race}}', 'Your picks as bars racing to the top, period by period.'],
          canvas: ['The race', 'It opens on the result. Press play to watch it from the start.'],
          start: ['To the start', 'Back to the first period.'],
          play: ['Play', 'Plays or pauses the race.'],
          step: ['One step', 'One period forward (the button left of play goes back).'],
          seek: ['Any date', 'Drag to any point in time.'],
          speeds: ['Speed', '0.5× to 4×.'],
          gif: ['{{t:btn_download_gif}}', 'Saves the race as a moving picture.'],
          range: ['The race’s dates', 'The race keeps its own range, from your first play. Change it here; {{t:btn_reset}} puts it back.']
        } },
        vol: { title: '{{t:sx_vol_title}}', spots: {
          gran: ['By day, month or year', 'How the bars are split.'],
          mode: ['{{t:sx_vol_mode_plays}} / {{t:sx_vol_mode_new}}', 'All your plays with the new part on top, or only what was new to you.'],
          labels: ['Numbers on bars', 'Shows each bar’s number.'],
          zoom: ['Reset zoom', 'Drag across the graph to zoom in; this button zooms back out.'],
          figs: ['The figures', 'Totals for the range. They are also the key: blue is {{t:sx_vol_known}}, green is {{t:sx_vol_new}}.'],
          busiest: ['{{t:sx_v_month}}', 'Click it to look inside that month.'],
          canvas: ['The bars', 'Click any bar to look inside that period.']
        } },
        drill: { title: 'Inside one period', spots: {
          when: ['The period', 'Which one, and how it did against the one before.'],
          step: ['Before / after', 'Moves to the period before or after.'],
          figs: ['Its numbers', 'Plays, how much was new, songs and artists.'],
          hero: ['Most played', 'Its top song, with a sample.'],
          spark: ['{{t:sx_cal_title}}', 'Every day of the period, with the busiest one lit.'],
          tabs: ['Three lists', '{{t:sx_dr_tab_top}}, {{t:sx_dr_tab_new}} and {{t:sx_dr_tab_art}}.'],
          rows: ['The list', 'Click one to open its window.'],
          open: ['{{t:sx_drill_open}}', 'Opens the chart of that period.']
        } },
        clock: { title: '{{t:sx_clock_title}} and {{t:sx_week_title}}', spots: {
          clock: ['{{t:sx_clock_title}}', 'Each slice is an hour; longer means more plays. Point at one (or tap) to see what you played then.'],
          parts: ['Parts of the day', 'Morning, afternoon, evening and night, and the share of each.'],
          cnote: ['In a sentence', 'Your busiest and quietest hours.'],
          wfigs: ['Weekdays against the weekend', 'Plays a day on each, and your busiest day.'],
          week: ['{{t:sx_week_title}}', 'Average plays on each day. Click a day for more.'],
          wnote: ['In a sentence', 'Your busiest and quietest days.']
        } },
        heat: { title: '{{t:hm_title}}', spots: {
          types: ['{{t:hm_type_all}} / {{t:hm_type_artist}} / {{t:hm_type_song}} / {{t:hm_type_album}}', 'All your plays, or only one artist, song or album: add it by name.'],
          colors: ['Colours', 'Pick a colour scheme for the heatmap.'],
          year: ['The year', 'Step to the year before or after.'],
          best: ['Best streak', 'Your longest run of days with music.'],
          figs: ['The year in figures', 'Plays, best day, top artist and new artists.'],
          grid: ['Every day', 'One square per day, stronger the more you played. Point at one (or tap) to see what you listened to.'],
          strip: ['{{t:hm_every_year}}', 'Every year as a small picture. Click one to open it.'],
          patterns: ['{{t:hm_patterns}}', 'When in the week you play.'],
          scope: ['{{t:hm_pat_year}} / {{t:hm_pat_all}}', 'Patterns for the open year or for all time.'],
          rhythm: ['Weekday rhythm', 'Plays a day for each weekday.'],
          hours: ['Hour of day', 'Every hour of every weekday. The busiest one is ringed.']
        } }
      },
      howto: {
        range: { title: 'Pick a range', slides: [
          'Pick a quick range: the last 4 weeks, 12 months, 3 years, or all of it.',
          'Or set your own start and end date.',
          'Every tab uses the same range. Switch tabs as you like.',
          'On {{t:sx_tab_compare}} and {{t:sx_tab_charts}}, also pick by day, month or year.'
        ] },
        overview: { title: 'Read your {{t:sx_tab_overview}}', slides: [
          'Start with the sentence: your range in a line.',
          'The arrows compare with the same stretch just before.',
          'Each tile links to the graph that tells more.',
          'Your top 5: switch between songs, artists and albums.',
          'See what you played more, and less, than before.',
          'Click any day of the calendar to open that day’s chart.'
        ] },
        story: { title: 'See your story', slides: [
          'Open {{t:sx_tab_story}}.',
          'Your top artist of every month. Click one to open that month’s chart.',
          'Your eras: when one artist ruled your weekly chart.',
          'Taste drift: how your top 10 changed year by year.',
          'And the new artists you found, and if you still play them.'
        ] },
        game: { title: 'Play a game', slides: [
          'Start with the {{t:sx_daily_k}}: one puzzle, the same all day.',
          'Or pick any of the twelve games.',
          'Make your guess.',
          'Your score and your best, at the top.',
          'Close it whenever you like.',
          'Your tally counts the games you’ve played and your day streak.'
        ] },
        compare: { title: 'Compare artists, songs or years', slides: [
          'Pick what to compare.',
          'Type a name and add it. Up to 10.',
          'Each pick gets a card and a colour. The ✕ removes it.',
          'Choose how to see them: running total, per period, chart run or race.',
          'Click a name in the legend to hide or show its line.',
          'Scroll down: head to head, who was on top, the gaps, their top songs and habits.',
          'Save the line-up to come back to it.'
        ] },
        race: { title: 'Watch a race', slides: [
          'On {{t:sx_tab_compare}}, choose {{t:sx_cmp_mode_race}}.',
          'Press play.',
          'Drag to any point in time.',
          'Go slower or faster.',
          'Save it as a moving picture to share.'
        ] },
        drill: { title: 'Look inside a month', slides: [
          'On {{t:sx_tab_charts}}, click any bar.',
          'Or click the busiest period.',
          'It opens under the graph. The arrows move to the period before or after.',
          'Switch between top songs, new finds and top artists.',
          'Open the chart of that period.'
        ] },
        heat: { title: 'Explore the heatmap', slides: [
          'Every day of the year, stronger the more you played. Point at a day.',
          'Step through the years.',
          'Show only one artist, song or album.',
          'Pick a colour scheme.',
          'And see the hours of the week you play most.'
        ] }
      },
      options: {
        range: { title: 'Range', items: {
          presets: ['{{t:range_4w}} / {{t:range_12m}} / {{t:range_3y}} / {{t:range_all}}', 'A quick range up to today.'],
          dates: ['Dates', 'Any start and end date.'],
          gran: ['{{t:gran_daily}} / {{t:gran_monthly}} / {{t:gran_yearly}}', 'How graphs are split. {{t:sx_tab_compare}} and {{t:sx_tab_charts}} only.']
        } },
        tabs: { title: 'Tabs', items: {
          overview: ['{{t:sx_tab_overview}}', 'The range in a sentence, four tiles and eight cards.'],
          story: ['{{t:sx_tab_story}}', 'What the range was about.'],
          games: ['{{t:sx_tab_games}}', 'Twelve quizzes and a game of the day.'],
          compare: ['{{t:sx_tab_compare}}', 'Up to 10 side by side, or as a race.'],
          charts: ['{{t:sx_tab_charts}}', 'Volume, the clock, your week and the heatmap.']
        } },
        overview: { title: '{{t:sx_tab_overview}}', items: {
          share: ['{{t:sx_share}}', 'A picture of the summary.'],
          t5seg: ['{{t:sx_top5_title}}', 'Songs, artists or albums.'],
          mvseg: ['{{t:sx_mov_title}}', 'Songs, artists or albums.'],
          shuffle: ['{{t:sx_fact_shuffle}}', 'Other fun facts.']
        } },
        compare: { title: '{{t:sx_tab_compare}}', items: {
          types: ['What', '{{t:sx_cmp_type_artists}}, {{t:sx_cmp_type_songs}}, {{t:sx_cmp_type_albums}}, {{t:sx_cmp_type_years}}.'],
          modes: ['How', '{{t:sx_cmp_mode_cum}}, {{t:sx_cmp_mode_per}}, {{t:sx_cmp_mode_run}}, {{t:sx_cmp_mode_race}}.'],
          crun: ['{{t:sx_cmp_mode_run}}', 'Which chart: {{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}}, {{t:nav_yearly}}.'],
          top: ['Top 3 / {{t:sx_cmp_fill10}}', 'Fills the line-up with your top picks.'],
          saved: ['{{t:sx_saved_title}}', 'Saved line-ups.'],
          legend: ['Legend', 'Hide or show a line.'],
          h2hshare: ['{{t:sx_share}}', 'A picture of the comparison.']
        } },
        race: { title: '{{t:sx_cmp_mode_race}}', items: {
          speeds: ['Speed', '0.5×, 1×, 2×, 4×.'],
          gif: ['{{t:btn_download_gif}}', 'Save the race.'],
          range: ['Range', 'The race’s own dates.']
        } },
        graphs: { title: '{{t:sx_tab_charts}}', items: {
          mode: ['{{t:sx_vol_mode_plays}} / {{t:sx_vol_mode_new}}', 'All plays, or only new finds.'],
          labels: ['Numbers on bars', 'On or off.'],
          zoom: ['Reset zoom', 'Back to the whole range.'],
          drtabs: ['Inside a period', '{{t:sx_dr_tab_top}}, {{t:sx_dr_tab_new}}, {{t:sx_dr_tab_art}}.'],
          hmtypes: ['Heatmap', '{{t:hm_type_all}}, {{t:hm_type_artist}}, {{t:hm_type_song}}, {{t:hm_type_album}}.'],
          colors: ['Heatmap colours', 'Six colour schemes.'],
          scope: ['{{t:hm_patterns}}', '{{t:hm_pat_year}} or {{t:hm_pat_all}}.']
        } }
      },
      challenges: {
        'stats.range': ['Change the range', 'A quick range or your own dates.'],
        'stats.story': ['Open {{t:sx_tab_story}}', 'The second tab.'],
        'stats.go': ['Follow a tile’s link', 'Under any of the four tiles on {{t:sx_tab_overview}}.'],
        'stats.game': ['Play a game', 'Any game on {{t:sx_tab_games}}, or the {{t:sx_daily_k}}.'],
        'stats.add': ['Add something to {{t:sx_tab_compare}}', 'Type a name in the Add box.'],
        'stats.race': ['Watch a race', '{{t:sx_tab_compare}} → {{t:sx_cmp_mode_race}}.'],
        'stats.drill': ['Look inside a period', 'Click a bar on {{t:sx_tab_charts}}.'],
        'stats.heat': ['Change the heatmap', 'Another year, colour or view.']
      },
      quiz: {
        q1: ['A tile says ▲ 20%. Compared with what?',
          ['The same length of time just before', 'Last year', 'Your all-time average'],
          'Each tile compares the range with the same stretch just before it.'],
        q2: ['Where can you watch your top artists race each other?',
          ['{{t:sx_tab_story}}', '{{t:sx_tab_compare}} → {{t:sx_cmp_mode_race}}', '{{t:sx_tab_games}}'],
          '{{t:sx_cmp_mode_race}} is one of the four ways {{t:sx_tab_compare}} shows your picks.'],
        q3: ['What is special about the {{t:sx_daily_k}}?',
          ['It is a new kind of game', 'It gives double points', 'Everyone gets the same puzzle all day, and only your first try counts'],
          'One puzzle a day, the same all day. Play every day to keep your day streak.']
      },
      tips: [
        'Stats tiles compare your range with the same stretch just before it. Try {{t:range_4w}} to see this month’s trend.',
        'On {{t:sx_tab_compare}}, {{t:sx_cmp_mode_race}} turns your top artists into a race you can save as a GIF.',
        'A new {{t:sx_daily_k}} waits on {{t:sx_tab_games}} every day. Keep your day streak going.',
        'Click any bar on {{t:sx_tab_charts}} to see the top songs and new finds of that month.',
        'The heatmap has six colour schemes, and can show one artist, song or album on its own.'
      ]
    },
    records: {
      title: '{{t:nav_records}}',
      promise: 'Your record book: number ones, debuts, most plays, streaks, certifications and more, for songs, artists and albums.',
      scenes: {
        top: { title: '{{t:sec_records_title}}', spots: {
          intro: ['What counts', 'The size of each chart the records come from, and how many days, weeks, months and years you have.'],
          search: ['Search every record', 'Type an artist, song or album to see every record it holds, in every section.'],
          nav: ['Sections', '{{t:rec_nav_overview}}, then {{t:rec_grp_chart}} and {{t:rec_grp_plays}}. One section shows at a time.'],
          grp: ['Two groups', '{{t:rec_grp_chart}} come from your charts; {{t:rec_grp_plays}} come from your plays.'],
          count: ['How many', 'How many record lists the section holds.'],
          picker: ['{{t:rec_picker_label}}', 'On a phone the sections are in this menu.'],
          hero: ['{{t:rec_hero_label}}', 'The artist who holds the most records, with their count.'],
          reel: ['Their records', 'A reel of their records. It slides on its own; drag it to look through.'],
          card: ['One record', 'What it is, the number, and when. The badge is its place in that list.']
        } },
        ov: { title: '{{t:rec_nav_overview}}', spots: {
          intro: ['Your best in each', 'The record holder of every section on one page.'],
          types: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Switch all the cards at once.'],
          grp: ['Two groups', '{{t:rec_grp_chart}} and {{t:rec_grp_plays}}, as in the menu.'],
          cell: ['A card', 'The holder and their number. Click it to open that section.'],
          value: ['The record', 'The number to beat.'],
          sw: ['Which chart', 'Switch one card between {{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} and {{t:nav_yearly}}.']
        } },
        ones: { title: '{{t:rec_nav_all_ones}}: how every section looks', spots: {
          story: ['In one sentence', 'The record and who holds it. It changes with the switches below.'],
          ent: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Whose records to show.'],
          per: ['Which chart', '{{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} or {{t:nav_yearly}}.'],
          run: ['{{t:rec_run_total}} / {{t:rec_run_consec}}', 'All the weeks at #1 added up, or the longest unbroken run.'],
          sort: ['{{t:rec1_sort}}', '{{t:rec1_sort_rank}}, {{t:rec1_sort_recent}}, {{t:rec1_sort_oldest}} or {{t:rec1_sort_name}}.'],
          champ: ['The holder', 'The #1 of the list, big: its number and when.'],
          boxes: ['Its run', 'Every time it was #1. The dotted gaps are the time in between.'],
          sample: ['Play a sample', 'Hear 30 seconds of it.'],
          details: ['Details', 'Opens its window.'],
          runner: ['#2 and #3', 'The two behind it. Click the ▸ for their window.']
        } },
        list: { title: 'The list', spots: {
          heads: ['Columns', 'Click a heading to sort by it.'],
          all: ['{{t:rec_expand_all}}', 'Opens or closes every run at once.'],
          name: ['The entry', 'Click its name to open its window.'],
          tl: ['When', 'A timeline of your history: each mark is a time it was #1.'],
          date: ['Dates', 'Click a date to open that chart.'],
          toggle: ['Its run', 'Opens or closes its run under the row.'],
          runrow: ['The run', 'Every week it was #1, with the gaps. Click a box to see that chart.']
        } },
        sort: { title: '{{t:rec1_sort}}', spots: {
          btn: ['{{t:rec1_sort}}', 'Opens the menu.'],
          rank: ['{{t:rec1_sort_rank}}', 'The biggest record first.'],
          recent: ['{{t:rec1_sort_recent}}', 'What happened last first.'],
          oldest: ['{{t:rec1_sort_oldest}}', 'From the start of your history.'],
          name: ['{{t:rec1_sort_name}}', 'Alphabetical.']
        } },
        foot: { title: '{{t:rec_size_label}}', spots: {
          note: ['How many show', 'How many of the list you see.'],
          show: ['{{t:rec_size_label}}', 'How long each list is.'],
          sizes: ['Sizes', '10, 25, 50 or 100.']
        } },
        search: { title: 'Search', spots: {
          field: ['Search', 'An artist, song or album.'],
          clear: ['Clear', 'Back to the normal page.'],
          status: ['Matches', 'How many records match, in how many sections.'],
          nav: ['Every section at once', 'While you search, every section shows, only with the matching rows.']
        } },
        pak: { title: '{{t:rec_nav_pak}}', spots: {
          story: ['The holder', 'Who has the most, and how many there are in all.'],
          about: ['What it is', 'One artist at #1 on the artist, song and album charts at the same time.'],
          info: ['{{t:rec_pak_info_btn}}', 'Opens the full explanation.'],
          infotext: ['The explanation', 'What it takes, in a few lines.'],
          per: ['Which chart', '{{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} or {{t:nav_yearly}}.'],
          champ: ['The holder', 'With their first song and album to do it.'],
          details: ['Details', 'Opens their window.']
        } },
        nc: { title: '{{t:rec_nav_new_charts}}', spots: {
          about: ['What it is', 'Records from {{t:rec_nav_new_charts}}: only songs, artists and albums you found recently.'],
          tabs: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Whose records to show.'],
          title: ['One list', 'Each list has its own title.'],
          fold: ['Fold', 'Folds a list away; press again to open it.'],
          champ: ['The holder', 'The #1 of that list.']
        } },
        mil: { title: '{{t:rec_nav_milestones}}', spots: {
          tabs: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Whose milestones to show.'],
          sub: ['How it works', 'Who got to each round number first.'],
          tier: ['A milestone', 'The number of plays.'],
          art: ['Who got there first', 'And when.'],
          more: ['More', 'Opens the milestones folded in between.']
        } },
        fast: { title: '{{t:rec_nav_fastest}}', spots: {
          tabs: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Whose records to show.'],
          pick: ['{{t:fast_pick_pre}} … {{t:fast_pick_post}}', 'Pick the number of plays to race to.'],
          sub: ['How many made it', 'How many reached that number.'],
          champ: ['The fastest', 'How long it took from its first play.']
        } },
        streaks: { title: '{{t:rec_nav_streaks}}', spots: {
          ent: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Whose streaks to show.'],
          per: ['Days, weeks, months, years', 'Listened to every day in a row, every week in a row, and so on.'],
          b2b: ['{{t:rec_per_runs}}', 'The most times one was played back to back, with nothing in between.'],
          sub: ['How it counts', 'What the list measures.'],
          champ: ['The longest', 'From when to when.']
        } },
        certs: { title: '{{t:rec_nav_certs}}', spots: {
          story: ['The leader', 'The artist with the most certifications.'],
          tiers: ['What it takes', 'The plays needed for Gold, Platinum and Diamond, for songs and for albums.'],
          card: ['A plaque', 'The top three artists, each on a plaque.'],
          total: ['Certifications', 'How many they have in all.'],
          bar: ['The mix', 'Diamond, Platinum and Gold, as one bar.'],
          tally: ['Songs and albums', 'Their certifications by tier.'],
          open: ['{{t:certd_open_ledger}}', 'Opens their full ledger under the wall.']
        } },
        ledger: { title: '{{t:certd_title}}', spots: {
          tally: ['In all', 'Every certification they have.'],
          facts: ['Key facts', 'Songs and albums, the first and latest, the fastest earned and the best pace.'],
          types: ['{{t:certd_all}} / {{t:certd_songs}} / {{t:certd_albums}}', 'Filter by songs or albums.'],
          tiers: ['Tiers', 'Filter by Diamond, Platinum or Gold.'],
          sort: ['{{t:certd_sort}}', 'Change the order.'],
          medal: ['The tier', 'Which certification, and at how many plays.'],
          row: ['One certification', 'The song or album, its plays a day and its plays now.'],
          journey: ['How it got there', 'From its first play to the certification: how long it took, and the next tier to go.']
        } }
      },
      howto: {
        find: { title: 'Find a section', slides: [
          'The sections are in the menu on the left.',
          'On a phone, open the {{t:rec_picker_label}} menu.',
          'The number says how many lists it holds.',
          'Each section starts with its record in one sentence.'
        ] },
        overview: { title: 'Read the {{t:rec_nav_overview}}', slides: [
          'Up top: the artist with the most records.',
          'A reel of their records. Drag it.',
          'Below, the best of each section. Switch them all to artists or albums.',
          'Click a card to open its section.',
          'Or switch one card to another chart.'
        ] },
        types: { title: 'Songs, artists or albums', slides: [
          'Most sections switch between songs, artists and albums.',
          'And between your Daily, Weekly, Monthly and Yearly charts.',
          '{{t:rec_nav_milestones}} and {{t:rec_nav_fastest}} have their own switch.',
          '{{t:rec_nav_fastest}} also lets you pick the number of plays.'
        ] },
        read: { title: 'Read a record', slides: [
          'The holder, big, with its number.',
          'Every time it was #1, with the gaps.',
          '#2 and #3 beside it.',
          'The rest of the list: a timeline for each.',
          'Open a row’s run.',
          'Or open them all.'
        ] },
        count: { title: 'Total or in a row', slides: [
          '{{t:rec_run_total}} adds up every week at #1; {{t:rec_run_consec}} counts only the longest unbroken run.',
          'The sentence changes with it.',
          'Sort by rank, most recent, oldest or name.',
          'Or click a column heading.'
        ] },
        search: { title: 'Search your records', slides: [
          'Type an artist, song or album.',
          'How many records match.',
          'Every section shows, with only the matching rows.',
          'Clear it to go back.'
        ] },
        certs: { title: 'Open a certification ledger', slides: [
          'The plays a song or album needs for each tier.',
          'The top three artists on plaques.',
          'Open one artist’s every certification.',
          'Their key facts.',
          'Filter by songs, albums or tier.',
          'Each certification, with how long it took.'
        ] },
        more: { title: 'See more of a list', slides: [
          'How many of the list you see.',
          'Show 25, 50, 100 or all.'
        ] }
      },
      options: {
        sections: { title: 'Sections', items: {
          ones: ['{{t:rec_nav_all_ones}}', 'Everything that reached #1, and for how long.'],
          pak: ['{{t:rec_nav_pak}}', '#1 on the artist, song and album charts at once.'],
          app: ['{{t:rec_nav_appearances}}', 'The most weeks (days, months, years) on a chart.'],
          debuts: ['{{t:rec_nav_debuts}}', 'The biggest debuts.'],
          nc: ['{{t:rec_nav_new_charts}}', 'Records from {{t:rec_nav_new_charts}}.'],
          plays: ['{{t:rec_nav_peak_plays}}', 'The most plays in one day, week, month or year.'],
          mil: ['{{t:rec_nav_milestones}}', 'First to each round number of plays.'],
          fast: ['{{t:rec_nav_fastest}}', 'Quickest to a number of plays.'],
          streaks: ['{{t:rec_nav_streaks}}', 'Longest runs of days, weeks, months, years, and back to back.'],
          certs: ['{{t:rec_nav_certs}}', 'Gold, Platinum and Diamond, artist by artist.']
        } },
        switches: { title: 'In every section', items: {
          ent: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Whose records.'],
          per: ['{{t:nav_daily}} / {{t:nav_weekly}} / {{t:nav_monthly}} / {{t:nav_yearly}}', 'Which chart.'],
          run: ['{{t:rec_run_total}} / {{t:rec_run_consec}}', 'Added up, or unbroken. {{t:rec_nav_all_ones}} and {{t:rec_nav_appearances}}.'],
          sort: ['{{t:rec1_sort}}', '{{t:rec1_sort_rank}}, {{t:rec1_sort_recent}}, {{t:rec1_sort_oldest}}, {{t:rec1_sort_name}}.'],
          show: ['{{t:rec_size_label}}', '10, 25, 50 or 100.'],
          all: ['{{t:rec_expand_all}}', 'Every run at once.']
        } },
        overview: { title: '{{t:rec_nav_overview}}', items: {
          types: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Every card at once.'],
          sw: ['Card chart', 'One card at a time.']
        } },
        special: { title: 'Only in some sections', items: {
          pakinfo: ['{{t:rec_pak_info_btn}}', '{{t:rec_nav_pak}} explained.'],
          b2b: ['{{t:rec_per_runs}}', '{{t:rec_nav_streaks}}: plays back to back.'],
          fastpick: ['{{t:fast_pick_pre}} … {{t:fast_pick_post}}', '{{t:rec_nav_fastest}}: the number of plays.'],
          milmore: ['More milestones', '{{t:rec_nav_milestones}}: the ones folded in between.'],
          ncfold: ['Fold', '{{t:rec_nav_new_charts}}: fold a list away.']
        } },
        certs: { title: '{{t:rec_nav_certs}}', items: {
          open: ['{{t:certd_open_ledger}}', 'The full ledger.'],
          types: ['{{t:certd_all}} / {{t:certd_songs}} / {{t:certd_albums}}', 'Filter the ledger.'],
          tiers: ['Tiers', 'Diamond, Platinum, Gold.'],
          sort: ['{{t:certd_sort}}', 'The ledger’s order.']
        } }
      },
      challenges: {
        'rec.view': ['Open another section', 'In the menu (on a phone, the {{t:rec_picker_label}} menu).'],
        'rec.ent': ['Switch to artists or albums', 'The switch over any list.'],
        'rec.per': ['Switch to another chart', '{{t:nav_daily}}, {{t:nav_monthly}} or {{t:nav_yearly}}, in a section or on an {{t:rec_nav_overview}} card.'],
        'rec.consec': ['Count {{t:rec_run_consec}}', 'In {{t:rec_nav_all_ones}}.'],
        'rec.run': ['Open a record’s run', 'The arrow at the end of a row.'],
        'rec.search': ['Search your records', 'The box at the top.'],
        'rec.ledger': ['Open a certification ledger', '{{t:rec_nav_certs}} → {{t:certd_open_ledger}}.'],
        'rec.show': ['Show a longer list', '{{t:rec_size_label}}, under the list.']
      },
      quiz: {
        q1: ['What does {{t:rec_run_consec}} count?',
          ['Every week at #1 added up', 'Only the longest unbroken run', 'Weeks in the top 10'],
          '{{t:rec_run_total}} adds up every week; {{t:rec_run_consec}} only counts the longest stretch without a break.'],
        q2: ['You search for an artist. What happens?',
          ['Every section shows, with only their records', 'Only {{t:rec_nav_overview}} changes', 'Their window opens'],
          'Search filters every section at once, and says how many records matched.'],
        q3: ['What is a {{t:rec_nav_pak}}?',
          ['The most plays in one day', 'A debut at #1', 'One artist at #1 on the artist, song and album charts at once'],
          'All three charts topped by the same artist in the same period.']
      },
      tips: [
        'Search in {{t:nav_records}} shows every record an artist, song or album holds, across all sections.',
        'In {{t:rec_nav_all_ones}}, switch to {{t:rec_run_consec}} to see the longest unbroken runs at #1.',
        'In {{t:rec_nav_certs}}, open an artist’s ledger to see how fast each Gold, Platinum and Diamond came.',
        'A {{t:rec_nav_pak}} is one artist at #1 on all three charts at once. How many do you have?',
        'Every {{t:rec_nav_overview}} card can switch between the Daily, Weekly, Monthly and Yearly charts on its own.'
      ]
    },
    awards: {
      title: '{{t:nav_awards}}',
      promise: 'Your own awards show for any year: pick the categories, choose the nominees, crown the winners and watch the ceremony. Plus how your artists did at the real ones.',
      scenes: {
        top: { title: '{{t:awards_tab_mygrammys}}', spots: {
          sub: ['{{t:awards_tab_mygrammys}} / {{t:awards_tab_reallife}}', 'Your own awards, or real-life award shows.'],
          year: ['The year', 'Each year has its own ballot. Click the year to jump to another.'],
          config: ['{{t:awards_configure}}', 'Which categories are on this year, the dates that count, and a few settings.'],
          gen: ['{{t:awards_generate}}', 'Fills every category with nominees from your plays in one go.'],
          cer: ['{{t:awards_ceremony_btn}}', 'Plays the awards show, full screen. It is at the bottom of the page too.'],
          share: ['{{t:awards_share_btn}}', 'A link anyone can open to watch your ceremony.'],
          sum: ['{{t:awx_title}}', 'The year at a glance: most nominations, most wins and more. Open it to see everything.'],
          tools: ['Ballot tools', 'How many are left to decide, hide the decided ones, open or fold the cards.'],
          views: ['{{t:awards_view_label}}', '{{t:awards_view_ballot}}, {{t:awards_view_spotlight}}, {{t:awards_view_tiles}}, {{t:awards_view_collage}} or {{t:awards_view_reel}}.']
        } },
        empty: { title: 'A new year', spots: {
          year: ['The year', 'A year you haven’t set up yet.'],
          gen: ['{{t:awards_generate}}', 'The quickest start: nominees for every category at once.'],
          card: ['A category', 'Its type (song, album or artist), its name and what it rewards.'],
          onoff: ['On / off', 'Takes the category out of this year’s show, or puts it back.'],
          fav: ['Favourite', 'Star the categories you always want.'],
          pick: ['{{t:awards_pick_nominees_btn}}', 'Choose the nominees for one category yourself.']
        } },
        cards: { title: 'The ballot', spots: {
          left: ['{{t:awards_pending}}', 'How many categories still need a winner.'],
          hide: ['{{t:awards_hide_decided}}', 'Hides the categories that already have a winner.'],
          fold: ['Open / fold', '{{t:awards_expand_all}} or {{t:awards_collapse_all}}: for every card, or only the ones with {{t:awards_fold_scope_pending}}.'],
          views: ['{{t:awards_view_label}}', 'Five ways to look at the ballot.'],
          hint: ['{{t:awards_pick_hint}}', 'Click a nominee to make it the winner. Click it again to undo.'],
          head: ['A category', 'Its type, its number of nominees, its name and what it rewards.'],
          onoff: ['On / off', 'Takes the category out of the show.'],
          fav: ['Favourite', 'Stars the category.'],
          fold1: ['Fold', 'Folds this card.'],
          winner: ['The winner', 'Gold, with a trophy.'],
          nom: ['A nominee', 'Click to crown it.'],
          change: ['{{t:awards_change_btn}}', 'Opens the nominee picker for this category.'],
          playlist: ['{{t:awx_playlist}}', 'Saves the nominees as a playlist.'],
          reorder: ['{{t:awards_reorder}}', 'Move the nominees up and down.']
        } },
        config: { title: '{{t:awards_configure}}', spots: {
          elig: ['{{t:awards_elig_window}}', 'The dates that count for this year’s awards.'],
          gemini: ['Gemini key', 'Optional: a free key {{t:awx_cfg_gemini_hint}}.'],
          credit: ['{{t:awx_cfg_credit}}', 'A nomination also counts for everyone featured, not just the lead artist.'],
          hideplays: ['{{t:awx_cfg_hide_plays}}', 'The ballot is about your picks, not the numbers.'],
          rating: ['{{t:awx_cfg_scores}}', 'Your 0–10 score next to each nominee you rated.'],
          samples: ['{{t:awx_cfg_samples}}', 'A ♪ button that plays 30 seconds of each nominee.'],
          count: ['How many are on', 'Categories on this year, out of all of them.'],
          bulk: ['{{t:awards_enable_all}} / {{t:awards_disable_all}}', 'Every category at once, or only your favourites.'],
          favs: ['Favourites only', 'Turns on just the categories you starred.'],
          search: ['Search', 'Find a category by name: rock, album, cover…'],
          type: ['Song, album, artist', 'Show only one kind.'],
          status: ['On or off', 'Show only the categories that are on, or off.'],
          groups: ['Groups', 'Jump to a group: main awards, rock, pop, videos and more.'],
          group: ['A group', 'Turn its whole group on or off.'],
          cat: ['A category', 'Click to turn it on or off.'],
          catfav: ['Star', 'Make it a favourite.']
        } },
        picker: { title: 'Picking nominees', spots: {
          title: ['The category', 'Which year and category you are picking for.'],
          fav: ['Favourite', 'Stars the category.'],
          close: ['Close', 'Asks first if you have changes.'],
          ballot: ['{{t:awx_pk_nominees}}', 'Your picks so far. {{t:awx_pk_drag}}.'],
          tally: ['How many', 'Up to 8.'],
          quick: ['Quick picks', 'Fill the top 8, the top 5, or {{t:awx_pk_clear}}.'],
          nom: ['A pick', 'Its place, a sample, its video and ✕ to take it off.'],
          clip: ['Sample', 'Hear 30 seconds.'],
          x: ['Remove', 'Takes it off the list.'],
          search: ['Search', 'Any song from that year.'],
          sort: ['Sort', 'How the list below is ordered.'],
          group: ['{{t:awx_pk_suggested}}', 'The best fits come first.'],
          row: ['A suggestion', 'Its genres, how well it fits the category and its plays. Click to add or remove it.'],
          save: ['{{t:awards_save_nominees}}', 'Puts them on the ballot.']
        } },
        sum: { title: '{{t:awx_title}}', spots: {
          head: ['The year at a glance', 'How many nominations, categories and artists, and who leads.'],
          toggle: ['Open / close', 'All-time most nominations and wins, and this year’s leaders.']
        } },
        intro: { title: 'The ceremony', spots: {
          badge: ['The show', 'Which year’s awards.'],
          dots: ['Progress', 'One dot per category.'],
          cats: ['{{t:awards_ceremony_cats}}', 'A list of every category: jump to any.'],
          sound: ['Sound', 'Music and sound effects on or off.'],
          close: ['Close', 'Leave the show. Esc does the same.'],
          title: ['{{t:awx_title}}', 'The show opens with the year’s nomination leaders.'],
          slide: ['{{t:awx_cer_before}}', 'Most nominations ever and this year.'],
          progress: ['Where you are', 'Before the show, then 1 of 6 and so on.'],
          next: ['{{t:awx_cer_start}}', 'On to the first award.']
        } },
        cat: { title: 'An award', spots: {
          title: ['The category', 'Its name, big.'],
          noms: ['The nominees', 'Every nominee, with its cover.'],
          nom: ['A nominee', 'Its title and artist.'],
          env: ['The envelope', 'The winner is inside.'],
          meet: ['{{t:awx_cer_meet}}', 'Plays a few seconds of each nominee first.'],
          open: ['{{t:awards_open_envelope}}', 'Reveals the winner.'],
          prev: ['Previous', 'The award before. ← does the same.'],
          progress: ['Count', 'Which award of how many.'],
          next: ['Next', 'The next award. → does the same.']
        } },
        win: { title: 'The winner', spots: {
          label: ['Winner', 'The envelope is open.'],
          name: ['The winner', 'And its artist.'],
          art: ['Its cover', 'With the trophy.'],
          play: ['Its song', 'A sample plays; pause or replay it here.'],
          next: ['Next', 'On to the next award.']
        } },
        fin: { title: '{{t:awx_cer_winners}}', spots: {
          grid: ['{{t:awx_cer_winners}}', 'Every winner of the night.'],
          card: ['A winner', 'Its category, title and artist.'],
          stats: ['After the show', 'The final stats and records, with this year’s wins added.']
        } },
        side: { title: '{{t:awards_ceremony_cats}}', spots: {
          cats: ['{{t:awards_ceremony_cats}}', 'Opens and closes the list.'],
          side: ['Every category', 'Click one to jump to it.']
        } },
        share: { title: '{{t:cer_share_title}}', spots: {
          title: ['{{t:cer_share_title}}', 'Share your ceremony with a link.'],
          body: ['How it works', 'Anyone with the link can watch it, without an account.'],
          foot: ['{{t:cer_share_signin}}', 'A link needs you to be signed in. Once you are, copy it from here.']
        } },
        real: { title: '{{t:awards_tab_reallife}}', spots: {
          sub: ['{{t:awards_tab_reallife}}', 'Real award shows, matched against what you play.'],
          shows: ['The shows', 'Grammys, VMAs, AMAs, iHeartRadio, World Music, Billboard, ARIA, Juno and BRIT.'],
          year: ['The year', 'Step through the years of the show.'],
          head: ['The show', 'Its name and how many categories.'],
          sub2: ['Which plays count', 'Your plays in that show’s season.'],
          tally: ['Your artists', 'How many nominations and wins your artists got.'],
          card: ['An artist', 'Every nomination and win of theirs.'],
          plays: ['Plays that season', 'How much you played them then.'],
          won: ['{{t:awx_rl_won}}', 'A win.'],
          nomd: ['{{t:awx_rl_nominated}}', 'A nomination.'],
          work: ['For what', 'The song, album or video it was for.']
        } }
      },
      howto: {
        setup: { title: 'Set up a year', slides: [
          'Pick the year.',
          'Open {{t:awards_configure}}.',
          'The dates that count.',
          'Jump to a group of categories.',
          'Click a category to turn it on or off.',
          'And a few settings, like samples on each nominee.'
        ] },
        gen: { title: 'Get nominees in one click', slides: [
          'Press {{t:awards_generate}}.',
          'Every category gets up to 8 nominees from your plays.',
          'Then change any of them as you like.'
        ] },
        pick: { title: 'Choose the nominees yourself', slides: [
          'Press {{t:awards_change_btn}} (or {{t:awards_pick_nominees_btn}}) on a category.',
          'Suggestions come first, best fit at the top. Click to add one.',
          'Or search any song of that year.',
          'Fill the top 8 in one go.',
          'Drag your picks into order.',
          'Save.'
        ] },
        win: { title: 'Crown the winners', slides: [
          'Click a nominee.',
          'It turns gold: that’s your winner.',
          'Keep track of what’s left.',
          'Hide the ones you’ve decided.'
        ] },
        view: { title: 'Look at your ballot five ways', slides: [
          'Switch the view here.',
          '{{t:awards_view_spotlight}}: the winner big, with plays.',
          '{{t:awards_view_tiles}}: covers in a grid.',
          '{{t:awards_view_collage}}: one big cover and the rest around it.',
          '{{t:awards_view_reel}}: a strip you scroll sideways.'
        ] },
        cer: { title: 'Watch the ceremony', slides: [
          'Press {{t:awards_ceremony_btn}}.',
          'It opens with the year’s leaders.',
          '{{t:awx_cer_start}}.',
          'Hear the nominees.',
          'Open the envelope.',
          'And the winner is…',
          'On to the next award.',
          'It ends with every winner of the night.'
        ] },
        share: { title: 'Share your ceremony', slides: [
          'Jump to any category from the list.',
          'Turn the sound on or off.',
          'Press {{t:awards_share_btn}} on the Awards page.',
          'Sign in, and copy the link to send.'
        ] },
        real: { title: 'See the real awards', slides: [
          'Open {{t:awards_tab_reallife}}.',
          'Pick a show.',
          'And a year.',
          'How your artists did.',
          'Every nomination and win, artist by artist.'
        ] }
      },
      options: {
        bar: { title: 'At the top', items: {
          year: ['The year', 'Each year has its own ballot.'],
          config: ['{{t:awards_configure}}', 'Categories, dates and settings.'],
          gen: ['{{t:awards_generate}}', 'Nominees for every category.'],
          cer: ['{{t:awards_ceremony_btn}}', 'The full-screen show.'],
          share: ['{{t:awards_share_btn}}', 'A link to your ceremony.']
        } },
        views: { title: '{{t:awards_view_label}}', items: {
          ballot: ['{{t:awards_view_ballot}}', 'A list per category.'],
          spotlight: ['{{t:awards_view_spotlight}}', 'The winner big, with plays.'],
          tiles: ['{{t:awards_view_tiles}}', 'Covers in a grid.'],
          collage: ['{{t:awards_view_collage}}', 'One big cover and the rest around it.'],
          reel: ['{{t:awards_view_reel}}', 'A sideways strip.']
        } },
        tools: { title: 'The ballot', items: {
          hide: ['{{t:awards_hide_decided}}', 'Only what is left to decide.'],
          fold: ['{{t:awards_fold_scope_all}} / {{t:awards_fold_scope_pending}}', 'Which cards open or fold together.'],
          onoff: ['On / off', 'Per category.'],
          fav: ['Favourite', 'Star a category.'],
          playlist: ['{{t:awx_playlist}}', 'The nominees as a playlist.'],
          reorder: ['{{t:awards_reorder}}', 'Change the nominees’ order.']
        } },
        config: { title: '{{t:awards_configure}}', items: {
          elig: ['{{t:awards_elig_window}}', 'The dates that count.'],
          gemini: ['Gemini key', 'Optional, {{t:awx_cfg_gemini_hint}}.'],
          credit: ['{{t:awx_cfg_credit}}', 'Featured artists share the credit.'],
          hideplays: ['{{t:awx_cfg_hide_plays}}', 'No play counts on the ballot.'],
          rating: ['{{t:awx_cfg_scores}}', 'Your scores next to nominees.'],
          samples: ['{{t:awx_cfg_samples}}', 'A ♪ on each nominee.'],
          bulk: ['{{t:awards_enable_all}} / {{t:awards_disable_all}}', 'Every category at once.'],
          favs: ['Favourites only', 'Just your starred categories.']
        } },
        picker: { title: 'Nominee picker', items: {
          quick: ['Fill top 8 / Top 5 / {{t:awx_pk_clear}}', 'Fill or empty the list.'],
          sort: ['Sort', 'How suggestions are ordered.'],
          clip: ['♪', 'A sample of each.']
        } },
        cer: { title: 'Ceremony', items: {
          cats: ['{{t:awards_ceremony_cats}}', 'Jump to any award.'],
          sound: ['Sound', 'On or off.'],
          meet: ['{{t:awx_cer_meet}}', 'Hear each nominee.'],
          open: ['{{t:awards_open_envelope}}', 'Reveal the winner.']
        } },
        real: { title: '{{t:awards_tab_reallife}}', items: {
          shows: ['Shows', 'Grammys, VMAs, AMAs, iHeartRadio, World Music, Billboard, ARIA, Juno, BRIT.']
        } }
      },
      challenges: {
        'aw.config': ['Open {{t:awards_configure}}', 'At the top of {{t:awards_tab_mygrammys}}.'],
        'aw.gen': ['Generate nominees', '{{t:awards_generate}}.'],
        'aw.pick': ['Open the nominee picker', '{{t:awards_change_btn}} on any category.'],
        'aw.win': ['Crown a winner', 'Click a nominee.'],
        'aw.view': ['Try another view', '{{t:awards_view_spotlight}}, {{t:awards_view_tiles}}, {{t:awards_view_collage}} or {{t:awards_view_reel}}.'],
        'aw.cer': ['Start the ceremony', '{{t:awards_ceremony_btn}}.'],
        'aw.reveal': ['Open an envelope', 'In the ceremony.'],
        'aw.real': ['Open {{t:awards_tab_reallife}}', 'The second tab.']
      },
      quiz: {
        q1: ['How do you pick a winner?',
          ['Press {{t:awards_ceremony_btn}}', 'Drag it to the top', 'Click the nominee on the ballot'],
          'A click on a nominee crowns it; click again to undo.'],
        q2: ['What does {{t:awards_generate}} do?',
          ['Fills every category with nominees from your plays', 'Picks the winners for you', 'Starts the ceremony'],
          'It picks nominees; the winners are always yours to choose.'],
        q3: ['Who can watch a ceremony you share?',
          ['Only you', 'Anyone with the link, no account needed', 'Only signed-in users'],
          'You sign in to make the link; whoever opens it can watch.']
      },
      tips: [
        'Try the {{t:awards_view_collage}} view on {{t:awards_tab_mygrammys}}: every category as a wall of covers.',
        'In the ceremony, {{t:awx_cer_meet}} plays a few seconds of each nominee before you open the envelope.',
        '{{t:awards_tab_reallife}} shows how your artists did at the Grammys, VMAs, BRITs and more.',
        'In the nominee picker, Fill top 8 picks the best fits in one click.',
        'Star your favourite categories, then turn on just those for a quick year.'
      ]
    },
    soundtrack: {
      title: '{{t:nav_soundtrack}}',
      promise: 'A year, a month or all of your listening told as a story in twelve chapters, to scroll, to play like a show and to share.',
      scenes: {
        top: { title: 'Chapter 1: the period', spots: {
          period: ['{{t:st_period_year}} / {{t:st_period_month}} / {{t:st_period_alltime}}', 'Which story to tell.'],
          nav: ['Which one', 'Step to the year or month before or after, or click the name to pick one.'],
          story: ['{{t:st_story_play_all}}', 'Every chapter full screen, one after another, like a show.'],
          replay: ['{{t:st_replay_title}}', 'Jumps to the replay of your top artists, week by week.'],
          share: ['{{t:st_share_btn}}', 'Makes a picture of your soundtrack.'],
          hero: ['The period', 'Its name, over a wall of the covers you played.'],
          mosaic: ['The covers', 'The albums of the period.'],
          stats: ['Five numbers', '{{t:st_stat_plays}}, {{t:st_stat_days}}, {{t:st_stat_artists}}, {{t:st_stat_new_discoveries}} and {{t:st_stat_peak_day}}.'],
          stat: ['Pick a number', 'The reel below changes to match it: every play, every day, every artist, your discoveries or your peak day.'],
          reel: ['The reel', 'Drag to browse. Click a card for Spotify, a playlist, the player or a search.'],
          pl: ['{{t:pl_section_btn}}', 'Saves what the reel shows as a playlist.']
        } },
        artist: { title: '{{t:st_featured_label}}', spots: {
          name: ['Your #1 artist', 'The artist you played most.'],
          count: ['How much', 'Their plays and their share of everything.'],
          big: ['A big number', 'Your longest run of their songs back to back.'],
          favs: ['Favourites', 'Their album and song you played most, with your streaks.'],
          stats: ['More numbers', 'Most played day, day streak, days played, songs and albums, peak hour.']
        } },
        tops: { title: '{{t:st_ch_top_name}}', spots: {
          head: ['Your song', 'The song of the period, and your artist.'],
          songs: ['{{t:st_top_songs}}', 'A row of covers you can flip through.'],
          center: ['The one in front', 'Its place and plays. Click it to open its window.'],
          prev: ['Back', 'The one before.'],
          next: ['Next', 'The one after. Drag or swipe works too.'],
          count: ['Place and plays', 'Of the one in front.'],
          artists: ['{{t:st_top_artists}}', 'The same, for artists.'],
          albums: ['{{t:st_top_albums}}', 'And for albums.']
        } },
        no1: { title: '{{t:d100_no1_title}}', spots: {
          head: ['How many', 'Different #1s on your weekly chart, and the longest at the top.'],
          seg: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Which chart’s #1s.'],
          sum: ['In all', 'How many times #1 changed hands.'],
          strip: ['The timeline', 'Every reign as a block, the longest ones widest.'],
          row: ['A #1', 'When it got there and how long it stayed.'],
          more: ['Show all', 'The full list.']
        } },
        activity: { title: '{{t:st_activity_title}}', spots: {
          head: ['Your loudest month', 'The month with the most plays.'],
          chart: ['Month by month', 'Each month’s plays and its change from the month before.'],
          bar: ['A month', 'Click it for that month’s plays and top artist.']
        } },
        loyalty: { title: '{{t:st_loyalty_title}}', spots: {
          head: ['Who came back', 'How many of last year’s top 10 artists are still in your top.'],
          ring: ['The score', 'With a name: from {{t:st_loyalty_explorer}} to {{t:st_loyalty_die_hard}}.'],
          row: ['{{t:st_loyalty_artists_title}}', 'The artists who stayed, with their top songs.'],
          next: ['More', 'Slide the row.']
        } },
        new: { title: '{{t:st_discoveries_title}}', spots: {
          head: ['How many', 'Artists you played for the first time, and the one you played most.'],
          bubbles: ['The bubbles', 'Your new artists float by. Bigger ones you played more.'],
          bubble: ['One artist', 'Click it to open their story.']
        } },
        pop: { title: 'A new discovery', spots: {
          nav: ['Previous / next', 'Walk through all your discoveries.'],
          name: ['The artist', 'And when you found them.'],
          meta: ['Found', 'The day you found them and their place this period.'],
          play: ['{{t:st_am_play}}', 'Hear them.'],
          links: ['Spotify, YouTube, Last.fm', 'Find them elsewhere.'],
          share: ['{{t:st_am_share}}', 'A picture of this discovery.'],
          stats: ['Numbers', 'Plays, days, streak and albums.'],
          goal: ['{{t:st_am_goal_title}}', 'How far they are from your next top spot.'],
          close: ['Close', 'Esc does the same.']
        } },
        mil: { title: '{{t:st_ch_ms_name}}', spots: {
          head: ['The big one', 'The biggest total you passed, and with which song.'],
          overall: ['{{t:st_milestones_title}}', 'Every round number of plays, and the song that did it.'],
          artist: ['{{t:st_artist_milestones_title}}', 'Round numbers for each artist.'],
          toggle: ['More', 'Shows the next 25.']
        } },
        streaks: { title: '{{t:st_streaks_title}}', spots: {
          head: ['Your longest', 'Your longest run of days with music.'],
          cards: ['Three cards', 'Days with music, your best streak and your longest break. Tap one for details.'],
          detail: ['Details', 'About the card you tapped.'],
          cal: ['Every day', 'A calendar of the period, coloured by streak.'],
          chips: ['In short', 'How many weeks had music.'],
          entity: ['One artist, album, song', 'Most days in a row with the same one.']
        } },
        grammys: { title: '{{t:st_aw_title}}', spots: {
          head: ['Award winners', 'Your top artists who won your own awards or real ones.'],
          grid: ['The winners', 'One card per artist.'],
          card: ['An artist', 'Their wins. Click to see them.']
        } },
        end: { title: 'The last two chapters', spots: {
          replay: ['{{t:st_replay_btn}}', 'Your top 5 artists racing, week by week.'],
          share: ['{{t:st_card_open}}', 'Makes a picture of your soundtrack.']
        } },
        replay: { title: '{{t:st_replay_title}}', spots: {
          canvas: ['The race', 'The week’s top 5 artists and their plays.'],
          speed: ['Speed', 'Slower or faster.'],
          prev: ['Week before', 'One step back.'],
          pause: ['Play / pause', 'Stops or carries on.'],
          next: ['Week after', 'One step on.'],
          stop: ['{{t:st_replay_stop}}', 'Ends the replay.']
        } },
        story: { title: '{{t:st_story_play_all}}', spots: {
          bars: ['Progress', 'One line per chapter.'],
          close: ['Close', 'Back to the page. Esc too.'],
          prev: ['Previous', '← does the same.'],
          next: ['Next', '→ or a tap on the right does the same.']
        } },
        card: { title: '{{t:st_card_title}}', spots: {
          preview: ['Preview', 'The picture as it will look.'],
          tpl: ['Design', 'Recap, Wrapped, Collage, Minimal or Poster.'],
          pal: ['Palette', 'The app’s colours, six fixed palettes, or Cover.'],
          fmt: ['{{t:ig_format}}', '{{t:sh_fmt_post}}, {{t:sh_fmt_portrait}} or {{t:sh_fmt_story}}.'],
          art: ['Show / hide', 'Album art, numbers, peak day, top artists, top songs, footer.'],
          src: ['Picture source', 'Where the covers come from.'],
          topn: ['Entries shown', 'How many top artists and songs.'],
          copy: ['Copy', 'Copies the picture to paste anywhere.'],
          dl: ['Download', 'Saves the picture.']
        } }
      },
      howto: {
        period: { title: 'Pick a year, a month or all time', slides: [
          'Pick {{t:st_period_year}}, {{t:st_period_month}} or {{t:st_period_alltime}}.',
          '{{t:st_period_month}}: one month’s story.',
          '{{t:st_period_alltime}}: your whole history.',
          'Step to another year or month.'
        ] },
        story: { title: '{{t:st_story_play_all}}', slides: [
          'Press the play button at the top.',
          'Every chapter, one at a time.',
          'Next, or tap the right side of the screen.',
          'Close it whenever you like.'
        ] },
        read: { title: 'Read the first chapter', slides: [
          'The period, over its covers.',
          'Pick one of the five numbers.',
          'The reel shows what that number counts.',
          'Save the reel as a playlist.',
          'Then your #1 artist.'
        ] },
        tops: { title: 'Your tops and number ones', slides: [
          'Your top songs, front and centre.',
          'Flip through them.',
          'Number ones: songs, artists or albums.',
          'Each #1 and how long it stayed.',
          'Month by month: click a month.'
        ] },
        discover: { title: 'Meet your new artists', slides: [
          'Your new artists float by.',
          'Click one.',
          'Their story: when you found them and how much you play them.',
          'How close they are to your top.',
          'Walk through the rest.'
        ] },
        replay: { title: 'Replay your year', slides: [
          'Press {{t:st_replay_title}} at the top…',
          '…or {{t:st_replay_btn}} near the end.',
          'Your top 5, week by week.',
          'Pause, or step a week at a time.',
          'Change the speed.'
        ] },
        share: { title: 'Share your soundtrack', slides: [
          'Press {{t:st_share_btn}} (or {{t:st_card_open}} at the end).',
          'Pick a design.',
          'And a palette.',
          'And a format.',
          'Download it, or copy it.'
        ] }
      },
      options: {
        period: { title: 'Period', items: {
          year: ['{{t:st_period_year}} / {{t:st_period_month}} / {{t:st_period_alltime}}', 'Which story.'],
          nav: ['Previous / next', 'Another year or month.']
        } },
        chapters: { title: 'The chapters', items: {
          year: ['1. {{t:nav_soundtrack}}', 'The period, five numbers and the reel.'],
          artist: ['2. {{t:st_featured_label}}', 'Your #1 artist.'],
          tops: ['3. {{t:st_ch_top_name}}', 'Your top songs, artists and albums.'],
          no1: ['4. {{t:d100_no1_title}}', 'Every #1 (year and month only).'],
          activity: ['5. {{t:st_activity_title}}', 'Month by month (or day by day).'],
          loyalty: ['6. {{t:st_loyalty_title}}', 'Who came back.'],
          new: ['7. {{t:st_discoveries_title}}', 'New artists.'],
          mil: ['8. {{t:st_ch_ms_name}}', 'Round numbers passed.'],
          streaks: ['9. {{t:st_streaks_title}}', 'Days in a row.'],
          awards: ['10. {{t:st_aw_title}}', 'Your award winners.'],
          replay: ['11. {{t:st_replay_title}}', 'The year as a race (year only).'],
          share: ['12. {{t:st_card_title}}', 'A picture to share.']
        } },
        tools: { title: 'Along the way', items: {
          stat: ['The five numbers', 'Each one changes the reel.'],
          pl: ['{{t:pl_section_btn}}', 'The reel as a playlist.'],
          no1: ['{{t:d100_no1_title}}', 'Songs, artists or albums.'],
          more: ['Show more', 'Longer milestone lists.'],
          speed: ['Replay speed', 'Slower or faster.']
        } },
        card: { title: '{{t:st_card_title}}', items: {
          tpl: ['Design', 'Five designs.'],
          pal: ['Palette', 'Eight colour sets.'],
          fmt: ['Format', '1:1, 4:5 or 9:16.'],
          art: ['Album art', 'On or off, and its source.'],
          topn: ['Entries shown', 'How many on the list.'],
          copy: ['Copy / Download', 'Take the picture.']
        } }
      },
      challenges: {
        'st.period': ['Switch to {{t:st_period_month}} or {{t:st_period_alltime}}', 'At the top left.'],
        'st.nav': ['Go to another year or month', 'The arrows next to its name.'],
        'st.story': ['{{t:st_story_play_all}}', 'The play button at the top.'],
        'st.stat': ['Pick another of the five numbers', 'In chapter 1.'],
        'st.no1': ['See artist or album #1s', 'In {{t:d100_no1_title}}.'],
        'st.bubble': ['Open a new discovery', 'Click a bubble in {{t:st_discoveries_title}}.'],
        'st.replay': ['Play the chart history', '{{t:st_replay_title}}.'],
        'st.card': ['Open the share window', '{{t:st_share_btn}}.']
      },
      quiz: {
        q1: ['What changes when you click one of the five numbers?',
          ['The period', 'The reel under them', 'Your theme'],
          'Each number fills the reel with what it counts: every play, every day, every artist and so on.'],
        q2: ['How do you watch every chapter like a show?',
          ['Scroll fast', 'Open {{t:st_card_title}}', 'Press the play button at the top'],
          '{{t:st_story_play_all}} shows the chapters full screen, one after another.'],
        q3: ['Where do you find what an artist you just found is like?',
          ['Click their bubble in {{t:st_discoveries_title}}', 'In {{t:st_streaks_title}}', 'In the reel'],
          'Each bubble opens that artist’s story: how you found them, their plays and your next goal.']
      },
      tips: [
        '{{t:st_story_play_all}} turns your year into a full-screen show, chapter by chapter.',
        'In {{t:st_discoveries_title}}, click a bubble to see how you found that artist: the song, the day, what you played right before.',
        'Click {{t:st_stat_peak_day}} in chapter 1 and the reel shows every song from your busiest day.',
        '{{t:st_replay_title}} races your top 5 artists through the year, week by week.',
        'The share image has five designs. Try Wrapped as a 9:16 story.'
      ]
    },
    dank100: {
      title: '{{t:d100_title}}',
      promise: 'One shared weekly chart made from everyone’s charts: read it, follow a song’s run, and send in your own week.',
      scenes: {
        top: { title: 'The chart', spots: {
          title: ['{{t:d100_title}}', 'Everyone’s weekly charts added up into one chart of 100.'],
          signin: ['Sign in', 'Only needed to send your own week. Anyone can look at the chart.'],
          week: ['Which week', 'Pick any chart so far from the list.'],
          prev: ['{{t:d100_prev_week}}', 'One chart back.'],
          next: ['{{t:d100_next_week}}', 'One chart on.'],
          from: ['Listeners', 'How many people’s weeks made this chart.'],
          seg: ['{{t:d100_type_songs}} / {{t:d100_type_artists}} / {{t:d100_type_albums}}', 'Three charts every week.'],
          export: ['{{t:d100_export}}', 'The chart as a playlist to copy into your music app.'],
          share: ['{{t:d100_share}}', 'Saves a picture of the top 10 (on a phone, shares it).'],
          cols: ['The columns', '{{t:d100_col_pts}}, {{t:d100_col_l}}, {{t:d100_col_lw}}, {{t:d100_col_pk}} and {{t:d100_col_wk}}.'],
          row: ['A row', 'Click it to open its run on the chart.'],
          pos: ['Place', 'Its position this week.'],
          move: ['Move', 'Up or down since last week, or a tag for a new entry or a return.'],
          pts: ['{{t:d100_col_pts}}', 'Everyone’s points added up: 100 for a listener’s #1, down to 1 for their #100.'],
          l: ['{{t:d100_col_l}}', 'How many people had it on their chart.'],
          lw: ['{{t:d100_col_lw}}', 'Its place last week (– if it wasn’t there).'],
          pk: ['{{t:d100_col_pk}}', 'Its best place ever.'],
          wk: ['{{t:d100_col_wk}}', 'Weeks on the chart in all.'],
          acts: ['Listen', 'A sample, Spotify or YouTube.']
        } },
        run: { title: 'A run on the chart', spots: {
          row: ['The open row', 'Click it again to close it.'],
          plot: ['The line', 'Its place week by week, #1 at the top. A gap is a week off the chart.'],
          story: ['In one line', 'Where it started, its best and how long it has stayed.'],
          ribbon: ['Totals', 'Its peak, weeks at #1, and weeks in the top 3, 5, 10 or 40.'],
          chip: ['One total', 'Tap it to light up only those weeks below.'],
          boxes: ['Every week', 'One box per week on the chart, with its place.'],
          box: ['One week', 'Click it to see that week’s chart.']
        } },
        week: { title: 'One week’s chart', spots: {
          head: ['The week', 'Which week, and which chart.'],
          item: ['Its top 30', 'The one you came from is lit up.'],
          link: ['The whole week', 'Opens that week’s full chart on the page.'],
          close: ['Close', 'Back to the run.']
        } },
        no1: { title: '{{t:d100_no1_title}}', spots: {
          head: ['{{t:d100_no1_title}}', 'Every #1 of the chart you picked above.'],
          sum: ['In all', 'How many reigns, and how many different #1s.'],
          strip: ['The timeline', 'Each reign is a block: the longer it stayed, the wider.'],
          row: ['A #1', 'The week it got there and how long it stayed. Click it for that week.'],
          back: ['{{t:d100_no1_back}}', 'It had been #1 before.'],
          more: ['Show all', 'The full list.']
        } },
        recs: { title: '{{t:d100_rec_title}}', spots: {
          grid: ['The records', 'Fifteen records across every chart so far.'],
          rec: ['A record', '{{t:d100_rec_at1}}, {{t:d100_rec_debut}}, {{t:d100_rec_jump}} and more.'],
          k: ['Which record', 'What it counts.'],
          v: ['The number', 'The one to beat.'],
          who: ['Who holds it', 'The song, artist or album.']
        } },
        entry: { title: '{{t:d100_entry_title}}', spots: {
          soon: ['{{t:d100_soon_title}}', 'Which week is counted next, and the day it comes out.'],
          entries: ['Your weeks', 'Last week (while it can still be sent) and this week.'],
          last: ['{{t:d100_week_last}}', 'The week about to be counted.'],
          note: ['Last chance', 'The day it closes.'],
          preview: ['{{t:d100_preview}}', 'What you would send: your own chart for that week.'],
          send: ['{{t:d100_send}}', 'Adds your week. Press it again to update it, or take it back.'],
          year: ['{{t:d100_year_title}}', 'Your charts for every week since January 2, all at once (until November 30).'],
          yearbtn: ['{{t:d100_year_btn}}', 'Sends them.'],
          auto: ['Automatic', 'Turn it on in {{t:set_title}} and your week goes in by itself every Sunday.'],
          how: ['{{t:d100_how_title}}', 'Points, weeks and privacy in four lines.']
        } }
      },
      howto: {
        read: { title: 'Read the chart', slides: [
          'Its place this week.',
          'Up or down since last week.',
          '{{t:d100_col_pts}}: 100 for a listener’s #1, 1 for their #100, all added up.',
          'How many listeners had it.',
          'Its best place, then its weeks on the chart.',
          'Click a row to open its run.'
        ] },
        run: { title: 'Follow a run', slides: [
          'Its place week by week.',
          'Tap a total to light up those weeks.',
          'Click a week…',
          '…to see that week’s chart.',
          'Or open the whole week.'
        ] },
        weeks: { title: 'Go back in time', slides: [
          'Pick a week from the list…',
          '…or step one week at a time.',
          'Or click a #1 to jump to its week.',
          'Switch to {{t:d100_type_artists}} or {{t:d100_type_albums}}…',
          '…for the other two charts.'
        ] },
        join: { title: 'Send in your week', slides: [
          'Sign in with Google, with your own library connected (the demo can’t send).',
          'Last week shows your chart for it.',
          'Press {{t:d100_send}}.',
          'New here? Send your whole year at once.',
          'Or let it send itself every Sunday.',
          'The chart comes out on Monday.'
        ] },
        share: { title: 'Take it with you', slides: [
          '{{t:d100_export}}: the chart as a playlist.',
          '{{t:d100_share}}: a picture of the top 10.',
          'Both work for the other two charts too.'
        ] }
      },
      options: {
        chart: { title: 'The chart', items: {
          type: ['{{t:d100_type_songs}} / {{t:d100_type_artists}} / {{t:d100_type_albums}}', 'Which chart.'],
          week: ['Week', 'The newest chart, or any before it.'],
          cols: ['Columns', '{{t:d100_col_pts}}, {{t:d100_col_l}}, {{t:d100_col_lw}}, {{t:d100_col_pk}}, {{t:d100_col_wk}}.'],
          acts: ['Listen', 'Sample, Spotify, YouTube.']
        } },
        tools: { title: 'Along the way', items: {
          run: ['A run', 'Click a row; then a week box for that week.'],
          more: ['Show all', 'Every #1, and all 100 places.'],
          export: ['{{t:d100_export}}', 'Songs as they are; two songs each for artists and albums.'],
          share: ['{{t:d100_share}}', 'A picture of the top 10.']
        } },
        entry: { title: 'Your entry', items: {
          send: ['{{t:d100_send}}', 'Until the Sunday after the week (UTC).'],
          back: ['{{t:d100_take_back}}', 'Removes your entry while the week is open.'],
          year: ['{{t:d100_year_btn}}', 'Every week since January 2, until November 30.'],
          auto: ['{{t:d100_auto}}', 'In {{t:set_title}}.']
        } }
      },
      challenges: {
        'd1.week': ['Look at another week', 'The arrows or the list above the chart.'],
        'd1.type': ['Switch to {{t:d100_type_artists}} or {{t:d100_type_albums}}', 'Next to the week.'],
        'd1.run': ['Open a run', 'Click any row.'],
        'd1.box': ['Open one week from a run', 'Click a week box under an open row.'],
        'd1.no1': ['Open a #1', 'In {{t:d100_no1_title}}, under the chart.'],
        'd1.export': ['{{t:d100_export}}', 'Above the chart.'],
        'd1.share': ['{{t:d100_share}}', 'Above the chart.']
      },
      quiz: {
        q1: ['How does a song get its points?',
          ['One point per play', 'From its place on each listener’s chart', 'From how many listeners it has'],
          'A listener’s #1 gives it 100 points, their #2 gives 99… so every listener counts the same, however much they play.'],
        q2: ['When does a week’s chart come out?',
          ['On Friday', 'On Monday, after entries close on Sunday', 'At the end of the month'],
          'Weeks run Friday to Thursday (UTC), entries stay open until Sunday, and the chart comes out on Monday.'],
        q3: ['What can other people see of what you sent?',
          ['Your whole chart', 'Your top 10', 'Nothing: only the combined chart is public'],
          'Only the combined chart is public. Nobody can see what you sent.']
      },
      tips: [
        'Click any week box in a song’s run to see that whole week’s chart.',
        'In {{t:d100_no1_title}} every reign is a block: the widest ones stayed longest.',
        '{{t:d100_export}} turns the chart into a playlist, with two songs each on the artist and album charts.',
        '{{t:d100_title}} has three charts every week: songs, artists and albums.'
      ]
    },
    ratings: {
      title: '{{t:nav_ratings}}',
      promise: 'Score albums and songs like a critic, then see your verdicts, your highs and lows, and what still needs a score.',
      scenes: {
        page: { title: 'Your critic page', spots: {
          intro: ['{{t:nav_ratings}}', 'Everything you have scored, in one place.'],
          ring: ['Your average', 'Your average album (or song, until you score an album).'],
          verdict: ['The verdict', 'A word for the score, from {{t:rtb_poor}} to {{t:rtb_masterpiece}}.'],
          meters: ['How much', 'Albums, singles & EPs and songs scored, out of everything you played.'],
          acts: ['Your habit', 'Days you rated on, your longest run of days, and the last time.'],
          next: ['{{t:ar_next}}', 'Your most played album without a score.'],
          cta: ['{{t:rtg_rate_cta}}', 'Opens the scoring window.'],
          hi: ['Highs and lows', 'Your best and lowest album, single and song. Ties slide by in turn.'],
          dots: ['More at that score', 'Tap a dot to see the others.'],
          recs: ['{{t:rp_recs}}', 'What your scores say about your listening.'],
          rec: ['A record', '{{t:rp_rec_overplayed}}, {{t:rp_rec_underplayed}}, {{t:rp_rec_consistent}}, {{t:rp_rec_best_artist}}.'],
          top: ['{{t:rp_top_artists}}', 'By their average album. Click one for all their scores.'],
          recent: ['{{t:rp_recent}}', 'The last things you scored. Click one to change it.']
        } },
        list: { title: 'Everything you scored', spots: {
          tabs: ['The lists', '{{t:ig_type_albums}}, {{t:ar_singles}}, {{t:ig_type_songs}} or {{t:ar_todo}}.'],
          spread: ['{{t:ar_spread}}', 'How many sit at each verdict.'],
          bar: ['A verdict', '{{t:ar_spread_hint}}.'],
          search: ['{{t:ar_search}}', 'Find one by name.'],
          sort: ['Order', '{{t:ar_sort_high}}, {{t:ar_sort_low}}, {{t:ar_sort_tracks}} or {{t:am_sort_az}}.'],
          row: ['A score', 'Click it to change the score.'],
          score: ['The score', 'Out of 10.'],
          prog: ['Tracks scored', 'How many of its tracks have a score.'],
          band: ['The verdict', 'The word for the score.'],
          go: ['Open', 'Opens the album’s window.']
        } },
        todo: { title: '{{t:ar_todo}}', spots: {
          tabs: ['{{t:ar_todo}}', 'What you play and have never scored.'],
          row: ['Most played first', 'The ones you know best.'],
          cta: ['{{t:rtg_rate_cta}}', 'Score it now.']
        } },
        album: { title: 'Scoring an album', spots: {
          kind: ['{{t:rte_kind_album}}', 'What you are scoring.'],
          title: ['The album', 'And its artist.'],
          ring: ['The score', 'Changes as you move any slider.'],
          formula: ['How it adds up', 'Track average × 75% plus album aspects × 25%.'],
          tabs: ['{{t:rte_aspects}} / {{t:rte_tracks}}', 'The two halves of the score.'],
          row: ['An aspect', '{{t:rtc_coh}}, {{t:rtc_con}}, {{t:rtc_art}}, {{t:rtc_inn}}, {{t:rtc_imp}} and {{t:rtc_lon}}.'],
          slider: ['Slider', 'Drag from 0 to 10, in steps of 0.1.'],
          num: ['Or type it', 'Type the number instead.'],
          weight: ['Tracks vs aspects', 'How much the tracks count. Applies to every album.'],
          note: ['{{t:rte_note}}', 'A few words, if you like.'],
          clear: ['{{t:rte_clear_album}}', 'Removes the aspect scores (the track scores stay).'],
          done: ['{{t:rte_done}}', 'Changes save as you go.'],
          close: ['Close', 'The same as {{t:rte_done}}.']
        } },
        tracks: { title: '{{t:rte_tracks}}', spots: {
          tab: ['{{t:rte_tracks}}', 'Every track of the album you played, with its plays.'],
          formula: ['The score', 'Moves with every track.'],
          row: ['A track', 'Score it right here: one number.'],
          slider: ['Slider', 'From 0 to 10.'],
          num: ['Or type it', 'A number.'],
          rubric: ['Full rubric', 'Opens the song’s own scoring window.'],
          full: ['On the full rubric', 'A track scored in detail. Open it to change it.']
        } },
        song: { title: 'Scoring a song', spots: {
          back: ['{{t:rte_back_album}}', 'When you came from an album.'],
          ring: ['The score', 'The average of the criteria.'],
          mode: ['{{t:rte_detailed}} / {{t:rte_quick}}', 'Six criteria, or one gut score.'],
          row: ['A criterion', '{{t:rtc_comp}}, {{t:rtc_lyr}}, {{t:rtc_voc}}, {{t:rtc_prod}}, {{t:rtc_mel}} and {{t:rtc_rhy}}.'],
          na: ['{{t:rte_na}}', '{{t:rtc_lyr}} and {{t:rtc_voc}} can be left out, for an instrumental.'],
          note: ['{{t:rte_note}}', 'Optional.'],
          clear: ['{{t:rte_clear_song}}', 'Removes the song’s score.']
        } },
        quick: { title: '{{t:rte_quick}}', spots: {
          mode: ['{{t:rte_quick}}', '{{t:rte_hint_quick}}'],
          quick: ['One score', 'Drag or type it.'],
          ring: ['The score', 'The same wherever the song shows up.']
        } },
        albwin: { title: 'In the album window', spots: {
          rate: ['{{t:dp_rate}}', 'Opens the scoring window. Song windows have one too.'],
          tab: ['{{t:dp_tab_rating}}', 'The album’s evaluation: the score, its parts, its best and weakest tracks.'],
          ring: ['The score', 'With its verdict.']
        } },
        artwin: { title: 'In the artist window', spots: {
          tab: ['{{t:dp_tab_rating}}', 'Every score you gave this artist, laid out like the {{t:nav_ratings}} page.'],
          ring: ['Their average', 'Across their scored albums.']
        } }
      },
      howto: {
        rate: { title: 'Score an album', slides: [
          'Start with {{t:ar_next}}, or any album.',
          'Score its aspects.',
          'Then its tracks: one number each.',
          'Choose how much the tracks count.',
          'The score adds up as you go.',
          'Done. Everything is already saved.'
        ] },
        song: { title: 'Score a song in detail', slides: [
          'Open a track’s full rubric…',
          '…and pick {{t:rte_detailed}} or {{t:rte_quick}}.',
          'Score each criterion.',
          'Leave out {{t:rtc_lyr}} or {{t:rtc_voc}} when they don’t apply.',
          '{{t:rte_quick}}: one number and you’re done.'
        ] },
        browse: { title: 'Browse your scores', slides: [
          'Pick a list.',
          'Tap a verdict to see only those.',
          'Change the order.',
          'Click a row to change its score.',
          '{{t:ar_todo}}: what still needs a score.'
        ] },
        where: { title: 'Scores around the app', slides: [
          'Every album and song window has a {{t:dp_rate}} button.',
          'Its {{t:dp_tab_rating}} tab shows the evaluation.',
          'Click an artist here…',
          '…for all their scores, on their {{t:dp_tab_rating}} tab.'
        ] }
      },
      options: {
        album: { title: 'Album score', items: {
          aspects: ['{{t:rte_aspects}}', 'Six album-wide scores.'],
          tracks: ['{{t:rte_tracks}}', 'One score per track.'],
          weight: ['Tracks vs aspects', 'How much the tracks count, for every album.'],
          note: ['{{t:rte_note}}', 'Your words.']
        } },
        song: { title: 'Song score', items: {
          mode: ['{{t:rte_detailed}} / {{t:rte_quick}}', 'Six criteria or one number.'],
          na: ['{{t:rte_na}}', 'Leaves {{t:rtc_lyr}} or {{t:rtc_voc}} out of the average.'],
          quick: ['{{t:rte_quick}}', 'One gut score.']
        } },
        page: { title: 'The page', items: {
          lists: ['Lists', '{{t:ig_type_albums}}, {{t:ar_singles}}, {{t:ig_type_songs}}, {{t:ar_todo}}.'],
          sort: ['Order', '{{t:ar_sort_high}}, {{t:ar_sort_low}}, {{t:ar_sort_tracks}}, {{t:am_sort_az}}.'],
          band: ['{{t:ar_spread}}', 'Tap a verdict to filter.'],
          search: ['{{t:ar_search}}', 'By name.']
        } }
      },
      challenges: {
        'rt.rate': ['Open the scoring window', '{{t:rtg_rate_cta}} on any album.'],
        'rt.tracks': ['Open the {{t:rte_tracks}} tab', 'In an album’s scoring window.'],
        'rt.mode': ['Switch a song between {{t:rte_detailed}} and {{t:rte_quick}}', 'In a song’s scoring window.'],
        'rt.view': ['Open another list', '{{t:ar_singles}}, {{t:ig_type_songs}} or {{t:ar_todo}}.'],
        'rt.band': ['Show only one verdict', 'Tap a bar in {{t:ar_spread}}.'],
        'rt.sort': ['Change the order', 'Next to {{t:ar_search}}.'],
        'rt.artist': ['Open a top rated artist', 'In {{t:rp_top_artists}}.']
      },
      quiz: {
        q1: ['How is an album’s score made?',
          ['Only from its tracks', 'From its tracks and its album aspects together (75% and 25% unless you change it)', 'From how often you play it'],
          'The track average and the album aspects are blended. If only one half is scored, that half is the score.'],
        q2: ['A song has no lyrics. What do you do?',
          ['Give {{t:rtc_lyr}} a 0', 'Mark {{t:rtc_lyr}} {{t:rte_na}}', 'Skip the song'],
          '{{t:rte_na}} leaves it out of the average, so an instrumental isn’t pulled down.'],
        q3: ['Where do you find what you play a lot but never scored?',
          ['{{t:ar_todo}}', '{{t:rp_recent}}', '{{t:rp_top_artists}}'],
          '{{t:ar_todo}} lists what you play most without a score, most played first.']
      },
      tips: [
        'Score a whole album in one go on its {{t:rte_tracks}} tab: one number per track.',
        'An instrumental? Mark {{t:rtc_lyr}} and {{t:rtc_voc}} {{t:rte_na}} so they don’t count.',
        '{{t:rp_rec_underplayed}}: the album you score high but hardly ever play.',
        'Tap a verdict in {{t:ar_spread}} to see only those albums.'
      ]
    },
    events: {
      title: '{{t:sec_events_title}}',
      promise: 'Birthdays, album anniversaries, new releases and live shows of the artists you play, and what you played on this day years ago.',
      scenes: {
        today: { title: '{{t:ev_tab_today}}', spots: {
          title: ['{{t:sec_events_title}}', 'For your top 50 artists (change how many in {{t:set_title}}).'],
          info: ['{{t:ev_info_title}}', 'How much was found, and when.'],
          refresh: ['{{t:ev_refresh_title}}', 'Fetches everything again.'],
          tabs: ['Four tabs', '{{t:ev_tab_today}}, {{t:ev_tab_coming}}, {{t:ev_tab_recent}} and {{t:ev_tab_calendar}}.'],
          types: ['Types', 'Tap one to hide it or show it again.'],
          bday: ['{{t:ev_type_birthdays}}', 'Artists’ birthdays.'],
          shows: ['{{t:ev_type_shows}}', 'Live shows (from Ticketmaster).'],
          play: ['{{t:ev_play_all}}', 'Plays what the tab shows in the music player.'],
          pl: ['{{t:pl_section_btn}}', 'Saves what the tab shows to a playlist.'],
          day: ['Today', 'Today’s birthdays, releases and shows.'],
          card: ['An event', 'Click it for Spotify, a playlist, the player or a search.'],
          anniv: ['{{t:ev_today_anniversaries}}', 'Releases with a birthday today, the ones you played most first.'],
          tm: ['{{t:time_machine_title}}', 'What you played on this day in past years.'],
          tmtypes: ['{{t:time_machine_songs}} / {{t:time_machine_artists}} / {{t:time_machine_albums}}', 'Turn each one on or off.'],
          tmpl: ['{{t:pl_section_btn}}', 'Saves the Time Machine as a playlist.'],
          tmcard: ['A memory', 'With the year you played it. Drag the row to browse.']
        } },
        menu: { title: 'What a card opens', spots: {
          menu: ['Options', 'Search on Spotify, add to a playlist or to the player, or search Google.'],
          card: ['The card', 'Every card on this tab works the same way.'],
          tm: ['Types', 'What the Time Machine shows.']
        } },
        coming: { title: '{{t:ev_tab_coming}}', spots: {
          tab: ['{{t:ev_tab_coming}}', 'What’s ahead.'],
          views: ['{{t:ev_view_reel}} / {{t:ev_view_tiles}} / {{t:ev_view_table}} / {{t:ev_view_list}}', 'Four ways to lay it out.'],
          week: ['{{t:ev_group_week}}', 'The next seven days.'],
          soon: ['{{t:ev_group_soon}}', 'Up to a month away.'],
          later: ['{{t:ev_group_later}}', 'Further out: announced releases and tour dates.'],
          card: ['An event', 'Its date, its artist and what it is.'],
          when: ['When', 'How many days to go.'],
          more: ['Show all', 'Anniversaries are cut to the ones you played most. This shows them all.'],
          note: ['Shows', 'How many shows were found, and where the tickets are.']
        } },
        table: { title: '{{t:ev_view_table}}', spots: {
          views: ['{{t:ev_view_table}}', 'The same events as a table.'],
          table: ['The table', 'One row per event.'],
          th: ['Columns', '{{t:ev_th_event}}, {{t:ev_th_artist}}, {{t:ev_th_date}} and {{t:ev_th_type}}.']
        } },
        recent: { title: '{{t:ev_tab_recent}}', spots: {
          tab: ['{{t:ev_tab_recent}}', 'What just happened.'],
          past: ['{{t:ev_group_past_week}}', 'The last seven days.'],
          weeks: ['{{t:ev_group_past_weeks}}', 'Up to a month back.'],
          earlier: ['{{t:ev_group_earlier}}', 'Releases from the past six months.'],
          more: ['Show all', 'Every anniversary.'],
          nmf: ['New Music Friday', 'This week’s new releases from Deezer, for everyone, not only your artists.'],
          fridays: ['{{t:ev_nmf_past}}', 'Earlier Fridays this browser has kept.']
        } },
        cal: { title: '{{t:ev_tab_calendar}}', spots: {
          tab: ['{{t:ev_tab_calendar}}', 'Every event on a calendar.'],
          prev: ['{{t:ev_cal_prev}}', 'The month before.'],
          title: ['The month', 'The one you are looking at.'],
          next: ['{{t:ev_cal_next}}', 'The month after.'],
          views: ['{{t:ev_cal_month}} / {{t:ev_cal_week}} / {{t:ev_cal_day}}', 'How much to see at once.'],
          today: ['Today', 'Framed.'],
          num: ['A day', 'Click the number to open that day.'],
          ev: ['An event', 'Click it for options.'],
          more: ['More', 'The rest of that day’s events.']
        } },
        week: { title: '{{t:ev_cal_week}}', spots: {
          views: ['{{t:ev_cal_week}}', 'Seven days side by side.'],
          title: ['The week', 'Step week by week with the arrows.'],
          today: ['Today', 'Every event of the day, listed.']
        } },
        day: { title: '{{t:ev_cal_day}}', spots: {
          views: ['{{t:ev_cal_day}}', 'One day.'],
          title: ['The day', 'Step day by day with the arrows.'],
          card: ['An event', 'As cards, like {{t:ev_tab_today}}.'],
          anniv: ['{{t:ev_cal_anniversaries}}', 'That day’s anniversaries.']
        } },
        info: { title: '{{t:ev_info_title}}', spots: {
          info: ['ⓘ', 'Opens or closes this line.'],
          status: ['In short', 'Birthdays, anniversaries, upcoming and recent events found, for how many artists, and when.'],
          refresh: ['{{t:ev_refresh_title}}', 'Fetch it all again now (it refreshes by itself once a day).']
        } }
      },
      howto: {
        today: { title: 'What’s on today', slides: [
          'Today’s birthdays, releases and shows.',
          'Click a card…',
          '…for Spotify, a playlist, the player or a search.',
          'Releases with a birthday today.',
          'And what you played on this day years ago.'
        ] },
        coming: { title: 'See what’s coming', slides: [
          'Open {{t:ev_tab_coming}}.',
          'This week first.',
          'Show every anniversary.',
          'Change the layout…',
          '…to a {{t:ev_view_table}}, for example.'
        ] },
        cal: { title: 'Use the calendar', slides: [
          'Open {{t:ev_tab_calendar}}.',
          '{{t:ev_cal_month}}, {{t:ev_cal_week}} or {{t:ev_cal_day}}.',
          'Click a day’s number to open it.',
          'The whole day, as cards.',
          '{{t:ev_cal_week}}: seven days side by side.'
        ] },
        filter: { title: 'Only what you want', slides: [
          'Tap a type to hide it.',
          '{{t:ev_type_shows}} for live dates.',
          'Play what’s left…',
          '…or save it as a playlist.'
        ] },
        recent: { title: 'Catch up', slides: [
          'Open {{t:ev_tab_recent}}.',
          'The past week first.',
          'New Music Friday: this week’s new releases.',
          'Earlier Fridays too.'
        ] }
      },
      options: {
        page: { title: 'The whole tab', items: {
          types: ['Types', '{{t:ev_type_birthdays}}, {{t:ev_type_albums}}, {{t:ev_type_singles}}, {{t:ev_type_eps}}, {{t:ev_type_other}}, {{t:ev_type_shows}}.'],
          view: ['Layout', '{{t:ev_view_reel}}, {{t:ev_view_tiles}}, {{t:ev_view_table}} or {{t:ev_view_list}} ({{t:ev_tab_coming}} and {{t:ev_tab_recent}}).'],
          play: ['{{t:ev_play_all}}', 'The tab in the player.'],
          pl: ['{{t:pl_section_btn}}', 'The tab as a playlist.'],
          refresh: ['{{t:ev_refresh_title}}', 'Fetch again.'],
          limit: ['Top artists', 'How many of your top artists to follow. In {{t:set_title}}.']
        } },
        cal: { title: '{{t:ev_tab_calendar}}', items: {
          views: ['{{t:ev_cal_month}} / {{t:ev_cal_week}} / {{t:ev_cal_day}}', 'How much at once.'],
          nav: ['‹ ›', 'Before and after.']
        } },
        tm: { title: '{{t:time_machine_title}}', items: {
          types: ['{{t:time_machine_songs}} / {{t:time_machine_artists}} / {{t:time_machine_albums}}', 'What it shows.'],
          pl: ['{{t:pl_section_btn}}', 'As a playlist.']
        } }
      },
      challenges: {
        'ev.tab': ['Open another tab', '{{t:ev_tab_coming}}, {{t:ev_tab_recent}} or {{t:ev_tab_calendar}}.'],
        'ev.type': ['Hide or show a type', 'The buttons under the tabs.'],
        'ev.view': ['Change the layout', 'On {{t:ev_tab_coming}} or {{t:ev_tab_recent}}.'],
        'ev.cal': ['Switch the calendar to {{t:ev_cal_week}} or {{t:ev_cal_day}}', 'On {{t:ev_tab_calendar}}.'],
        'ev.day': ['Open one day', 'Click a day’s number on the calendar.'],
        'ev.tm': ['Change what the Time Machine shows', 'On {{t:ev_tab_today}}.'],
        'ev.card': ['Click a card', 'Any event or Time Machine card.'],
        'ev.info': ['Open ⓘ', 'Next to the title.']
      },
      quiz: {
        q1: ['What is the {{t:time_machine_title}}?',
          ['What you played on this day in past years', 'Releases coming out next week', 'A way to rewind the chart'],
          'It shows the songs, artists and albums you were playing on this very day years ago.'],
        q2: ['How do you open one day on the calendar?',
          ['Double-click the month', 'Click the day’s number', 'Open {{t:ev_tab_today}}'],
          'The number opens that day, with all its events as cards.'],
        q3: ['Whose releases are in New Music Friday?',
          ['Only your top artists', 'Everyone’s: this week’s new releases from Deezer', 'Only albums you scored'],
          'New Music Friday isn’t filtered to your artists, so it’s a way to find new ones.']
      },
      tips: [
        'The {{t:time_machine_title}} shows what you were playing on this very day years ago.',
        'Click a day’s number on the calendar to see everything on that day.',
        'Prefer a list? {{t:ev_tab_coming}} and {{t:ev_tab_recent}} come in four layouts.',
        'Not into birthdays? Tap {{t:ev_type_birthdays}} to hide them everywhere.'
      ]
    },
    playlists: {
      title: '{{t:nav_playlists}}',
      promise: 'Make playlists from anything you see, let your charts make some by themselves, and take them to your music app.',
      scenes: {
        top: { title: 'Your playlists', spots: {
          title: ['{{t:nav_playlists}}', 'Every playlist you made, kept in this browser (and in your account when signed in).'],
          total: ['In all', 'How many playlists and songs.'],
          search: ['{{t:pl_x_search_ph}}', 'By the playlist’s name or an artist in it.'],
          sort: ['{{t:pl_x_sort_recent}} / {{t:pl_x_sort_name}} / {{t:pl_x_sort_size}}', 'The order of the cards.'],
          new: ['{{t:pl_x_new_title}}', 'What’s in the music player right now, saved as a playlist.'],
          name: ['Name', 'Type a name, then save.'],
          card: ['A playlist', 'Click it to open it.'],
          cover: ['Cover', 'Four of its covers. The play button on it starts it.'],
          meta: ['About it', 'Its songs, when it changed, and its artists.'],
          ap: ['{{t:ap_setup_title}}', 'Playlists your charts make by themselves (signed in).'],
          tile: ['A chart', '{{t:ap_row_day}}, {{t:ap_row_week}}, {{t:ap_row_month}} or {{t:ap_row_year}}.'],
          sw: ['On / off', 'Every time one of its periods ends, its top songs become a playlist.'],
          size: ['{{t:ap_size}}', 'How many songs: 10, 20, 40, 50 or 100.']
        } },
        open: { title: 'One playlist', spots: {
          back: ['{{t:pl_x_back}}', 'Back to the cards.'],
          hero: ['The playlist', 'Its name, artists and songs.'],
          cover: ['Cover', 'Made from its songs’ covers.'],
          name: ['Name', 'What you called it.'],
          meta: ['About it', 'Songs, artists and when it last changed.'],
          play: ['{{t:pl_x_play}}', 'Plays it from the top in the music player.'],
          shuffle: ['{{t:pl_x_shuffle}}', 'Plays it in a random order.'],
          export: ['{{t:pl_view_export}}', 'Saves it as a file for your music app.'],
          rename: ['{{t:pl_view_rename}}', 'Give it a new name.'],
          del: ['{{t:pl_view_delete}}', 'Asks first.'],
          track: ['A song', 'Click it to play from here.'],
          drag: ['{{t:pl_view_drag}}', 'Grab a song by its number to move it.'],
          acts: ['Listen', 'Play, Spotify, YouTube, or add it to the queue.'],
          remove: ['{{t:pl_view_remove}}', 'Takes it out of this playlist.']
        } },
        export: { title: '{{t:pl_export_playlist}}', spots: {
          btn: ['{{t:pl_view_export}}', 'Opens the choices.'],
          menu: ['Choices', 'A file for your music app, two ways.'],
          item: ['{{t:pl_export_csv}}', 'For an import tool such as Soundiiz. Or a plain text file.']
        } },
        pick: { title: '{{t:pl_pick_title}}', spots: {
          sub: ['What you’re adding', 'A song, an album, an artist’s songs, a whole chart…'],
          new: ['{{t:pl_pick_new}}', 'Starts a new playlist with them.'],
          text: ['{{t:pl_pick_text}}', '{{t:pl_pick_text_hint}}.'],
          list: ['Your playlists', 'Pick one to add to.'],
          item: ['A playlist', 'The number is how many songs are new to it; ones already there are skipped.']
        } },
        rel: { title: 'Releases', spots: {
          anniv: ['{{t:ev_cal_anniversaries}}', 'Albums from your top artists with a birthday in the next 30 days.'],
          annpl: ['{{t:pl_section_btn}}', 'All of them as a playlist.'],
          card: ['A release', 'Click it for options.'],
          recent: ['{{t:ev_sec_recent_releases}}', 'Releases from your top artists in the past six months.'],
          recpl: ['{{t:pl_section_btn}}', 'All of them as a playlist.']
        } }
      },
      howto: {
        make: { title: 'Make a playlist', slides: [
          'Press {{t:pl_section_btn}} or {{t:ea_add_playlist}} on anything: a song, an album, a whole chart.',
          '{{t:pl_pick_new}}…',
          '…or add to one you have.',
          'Or save what’s playing.',
          'Whole lists have a {{t:pl_section_btn}} button too.'
        ] },
        use: { title: 'Play and tidy it', slides: [
          'Open a playlist.',
          '{{t:pl_x_play}} or {{t:pl_x_shuffle}}.',
          'Drag songs into a new order.',
          'Take one out.',
          'Rename it.'
        ] },
        take: { title: 'Take it to your music app', slides: [
          'Press {{t:pl_view_export}}.',
          'Download a file for an import tool.',
          'Or copy the list as text.'
        ] },
        auto: { title: 'Automatic playlists', slides: [
          'Sign in, then look under your playlists.',
          'Turn on a chart.',
          'Choose how many songs.',
          'When its period ends, the playlist appears, and a notification tells you.'
        ] }
      },
      options: {
        list: { title: 'Your playlists', items: {
          sort: ['Order', '{{t:pl_x_sort_recent}}, {{t:pl_x_sort_name}} or {{t:pl_x_sort_size}}.'],
          search: ['Search', 'By name or artist.'],
          new: ['{{t:pl_x_new_title}}', 'The player’s queue as a playlist.']
        } },
        one: { title: 'One playlist', items: {
          play: ['{{t:pl_x_play}}', 'From the top.'],
          shuffle: ['{{t:pl_x_shuffle}}', 'In a random order.'],
          export: ['{{t:pl_view_export}}', 'A CSV or a text file.'],
          rename: ['{{t:pl_view_rename}}', 'A new name.'],
          del: ['{{t:pl_view_delete}}', 'Gone for good, after you confirm.'],
          drag: ['{{t:pl_view_drag}}', 'Change the order.']
        } },
        auto: { title: '{{t:ap_setup_title}}', items: {
          types: ['Charts', 'Daily, weekly, monthly, yearly. Each one on or off.'],
          size: ['{{t:ap_size}}', '10 to 100.']
        } }
      },
      challenges: {
        'pl.open': ['Open a playlist', 'Click a card.'],
        'pl.sort': ['Change the order of your playlists', 'Next to the search box.'],
        'pl.search': ['Search your playlists', '{{t:pl_x_search_ph}}.'],
        'pl.play': ['Play a playlist', '{{t:pl_x_play}} or {{t:pl_x_shuffle}}.'],
        'pl.add': ['Add something to a playlist', 'From a song’s ⋮ menu, or any {{t:pl_section_btn}} button.'],
        'pl.export': ['Open {{t:pl_view_export}}', 'In an open playlist.'],
        'pl.auto': ['Turn on an automatic playlist', 'Under your playlists (signed in).']
      },
      quiz: {
        q1: ['Where can you add songs to a playlist from?',
          ['Only from this tab', 'Only from the player', 'Almost anywhere: a song, an album, a chart, a list'],
          'Look for {{t:ea_add_playlist}} or {{t:pl_section_btn}}: on rows, windows, charts and lists.'],
        q2: ['What does an automatic weekly playlist hold?',
          ['The week’s top songs, made when the week ends', 'Songs you added this week', 'New releases this week'],
          'Every finished week, its top songs (as many as you chose) become a playlist.'],
        q3: ['How do you get a playlist into Spotify or Apple Music?',
          ['It syncs by itself', 'Export it and load the file with an import tool', 'Email it'],
          'Export a CSV (or copy it as text), then load it with an import tool such as Soundiiz.']
      },
      tips: [
        'The playlist window shows how many songs are new to each playlist. Ones already in it are skipped.',
        'Turn on {{t:ap_row_week}} under {{t:ap_setup_title}} and every week’s top songs become a playlist.',
        'Export a playlist as a CSV and an import tool can put it in Spotify or Apple Music.',
        'Drag a song by its number to move it up or down a playlist.'
      ]
    },
    player: {
      title: 'Music player',
      promise: 'Play any song from your charts, follow the lyrics, find the right video and keep the songs you love.',
      scenes: {
        card: { title: 'The player', spots: {
          drag: ['Move it', 'Drag the dots to put the player anywhere.'],
          stage: ['Stage mode', 'The big screen: the video large, the lyrics beside it. G does the same.'],
          bar: ['Shrink it', 'Makes it a small player in the corner (or along the bottom), so you can keep browsing. M does the same.'],
          close: ['Close', 'Stops the music. Esc does the same.'],
          media: ['Artwork or video', 'The cover, with a record that spins while it plays, or the music video.'],
          src: ['Where the video came from', 'Official video, Best match, Saved video or Your pick. “Wrong video?” lets you choose another.'],
          seg: ['Artwork / Video', 'Switch between the cover and the music video. V does the same.'],
          title: ['The song', 'Its name and artist. The soft colour behind it comes from the cover.'],
          add: ['Add to a playlist', 'Puts the song in any of your playlists. P does the same.'],
          love: ['♥ Favorites', 'Adds the song to your Favorites playlist, or takes it out. K does the same.'],
          story: ['Your chart story', 'This song in your own charts: this week’s rank, its peak, your plays and weeks on the chart. Click one to open the song.'],
        } },
        play: { title: 'Playing', spots: {
          seek: ['Progress', 'Drag to jump anywhere in the song.'],
          mark: ['The green mark', 'Where the play gets scrobbled (Scrobble at in Tools).'],
          note: ['When it counts', '“Counts at 1:25”, then “Scrobbled to Last.fm” — or “Not scrobbling · Connect” when nothing saves your plays.'],
          shuffle: ['Shuffle', 'Next picks a random song from Up Next. X does the same.'],
          prev: ['Previous', 'Back to the start of the song, or, in the first 3 seconds, the song before it. B does the same.'],
          play: ['Play / Pause', 'Space does the same.'],
          next: ['Next', 'The next song in Up Next. N does the same.'],
          repeat: ['Repeat', 'Off, all, or this song (the 1). R does the same.'],
          tabs: ['Four sections', 'Up Next, Lyrics, History and Tools.'],
          queue: ['Up Next', 'The songs waiting to play. Drag to reorder; right-click a song for more.'],
          vol: ['Volume', 'The arrow keys up and down do the same; 0 mutes.'],
          speed: ['Speed', 'Shows the speed. Click to change it.'],
          sleep: ['Sleep timer', 'Stops the music after a while. Shows the time left.'],
          help: ['?', 'A one-minute tour of the player. The ? key does the same.']
        } },
        tools: { title: 'Tools', spots: {
          search: ['Find another version', 'Search for a better video, or paste a YouTube link.'],
          similar: ['More by this artist', 'Adds more of this artist’s songs to Up Next.'],
          sleep: ['Sleep timer', '15, 30, 45 or 60 minutes.'],
          speed: ['Speed', 'From 0.75× to 2×.'],
          xfade: ['Crossfade', 'Blends the end of one song into the next.'],
          scrobble: ['Scrobble at', '30 seconds, half, 70 % or the end.'],
          lists: ['Saved playlists', 'Play one, or save Up Next as a playlist.'],
          share: ['Share', 'Copies the song and its YouTube link.'],
          pip: ['Pop-out window', 'A small player that stays on top of other apps.'],
          youtube: ['Open on YouTube', 'The video on youtube.com.'],
          keys: ['Keys & settings', 'Every key the player knows.'],
          tour: ['Take the tour', 'The one-minute walk through the player.']
        } },
        lyrics: { title: 'Lyrics', spots: {
          pill: ['Synced', 'These lyrics follow the song. “Not timed” ones are plain text.'],
          nudge: ['Timing', 'Lyrics early or late (a video with an intro)? Move them half a second at a time.'],
          now: ['The line being sung', 'Big and bright. The list follows the song by itself.'],
          line: ['Any line', 'Click it to jump to that part of the song.']
        } },
        find: { title: 'Wrong video?', spots: {
          back: ['All tools', 'Back to the tool cards.'],
          search: ['Search', 'Look for another version by name.'],
          paste: ['Paste a link', 'Copy the video’s address on YouTube and paste it here.'],
          use: ['Use link', 'The player checks the video against the song and plays it.']
        } },
        small: { title: 'The small player', spots: {
          who: ['The song', 'Click it to open the full player again. Drag the capsule anywhere.'],
          love: ['♥', 'Favorites, from here too.'],
          play: ['Play / Pause', 'With Previous and Next beside it.'],
          open: ['Open', 'Back to the full player.'],
          close: ['Close', 'Stops the music.']
        } },
        filled: { title: 'Full-width player', spots: {
          who: ['The song', 'Click it to open the full player.'],
          seek: ['Progress', 'With the times. Drag to jump.'],
          next: ['Next up', 'The next song in Up Next.'],
          queue: ['Up Next', 'Opens the full player on Up Next.'],
          vol: ['Volume', 'Mute and volume.']
        } },
        stage: { title: 'Stage mode', spots: {
          video: ['The video', 'As big as the window. Full screen is one more click.'],
          hint: ['Going back', 'G or Esc returns to the card just as it was.'],
          full: ['Full screen', 'The whole screen, no browser around it.'],
          back: ['Small player', 'Back to the card.'],
          tabs: ['The sections', 'Stage opens on Lyrics; Up Next, History and Tools are here too.'],
          lyrics: ['Big lyrics', 'Easy to follow from across the room.'],
          controls: ['Controls', 'Along the bottom.']
        } }
      },
      howto: {
        video: { title: 'Fix a wrong or missing video', slides: [
          'Under the picture, press “Wrong video?”.',
          'Search for another version…',
          '…or copy the video’s address on YouTube and paste it here.',
          'Press Use link. If it matches the song, the player remembers it.'
        ] },
        fav: { title: 'Keep the songs you love', slides: [
          'Press ♥: the song goes into your Favorites playlist. Press it again to take it out.',
          'Press + to add it to any other playlist.'
        ] },
        sleep: { title: 'Fall asleep to music', slides: [
          'Press the moon in the bottom row.',
          'Pick 15, 30, 45 or 60 minutes. The button counts down.'
        ] },
        big: { title: 'Watch it big', slides: [
          'Press the screen button at the top (or G).',
          'The video fills the window, with the lyrics beside it.',
          'Press it again, or G or Esc, to go back.'
        ] },
        small: { title: 'Keep browsing while it plays', slides: [
          'Press ⌄ at the top (or M).',
          'The player becomes a small capsule in the corner. Click the song to open it again.',
          'Prefer it along the bottom? Settings → Profile → Music player.'
        ] }
      },
      options: {
        mini: { title: '{{t:set_pm_label}}', items: {
          capsule: ['{{t:set_pm_capsule}}', 'A small player in the corner. Drag it anywhere.'],
          filled: ['{{t:set_pm_filled}}', 'Along the bottom, with progress, times and volume.'],
          bar: ['{{t:set_pm_bar}}', 'Along the bottom, just the song and the controls.']
        } },
        play: { title: 'Playing', items: {
          speed: ['Speed', 'Slower or faster.'],
          xfade: ['Crossfade', '3 or 6 seconds of blend between songs.'],
          scrobble: ['Scrobble at', 'When a play counts.'],
          sleep: ['Sleep timer', 'Stops the music after a while.'],
          shuffle: ['Shuffle', 'Random order from Up Next.'],
          repeat: ['Repeat', 'All, or one song.']
        } }
      },
      challenges: {
        'np.open': ['Play a song', 'Any Play button, or a song in a playlist.'],
        'np.tab': ['Open Lyrics, History or Tools', 'The tabs under the controls.'],
        'np.love': ['Add a song to Favorites', 'The ♥ next to the song’s name.'],
        'np.find': ['Open Find another version', '“Wrong video?”, or the first card in Tools.'],
        'np.sleep': ['Set a sleep timer', 'The moon in the bottom row.'],
        'np.stage': ['Open Stage mode', 'The screen button at the top, or G.'],
        'np.bar': ['Shrink the player', 'The ⌄ at the top, or M.'],
        'np.tour': ['Take the player tour', 'The ? in the bottom row.']
      },
      quiz: {
        q1: ['What does the green mark on the progress bar show?',
          ['The middle of the song', 'Where the play gets scrobbled', 'Where the chorus starts'],
          'Play past it and the play counts. Scrobble at in Tools moves it.'],
        q2: ['The video is wrong. What can you do?',
          ['Nothing, it’s automatic', 'Close the player and start again', 'Press “Wrong video?” and pick another or paste a YouTube link'],
          '“Wrong video?” opens Find another version: search, or paste the right link.'],
        q3: ['Where do the songs you ♥ go?',
          ['Into a playlist called Favorites', 'Nowhere, it’s just a like', 'Into Up Next'],
          'Favorites is a normal playlist in the Playlists tab. It can’t be deleted.']
      },
      tips: [
        'The green mark on the progress bar is where the play gets scrobbled.',
        'Wrong video? Paste the right YouTube link and the player remembers it.',
        'Click any line of the lyrics to jump to that part of the song.',
        'Press G for Stage mode: the video big, the lyrics beside it.'
      ]
    },
    rawdata: {
      title: '{{t:nav_rawdata}}',
      promise: 'Every play in your library, one row each: find any of them, fix a wrong name, and make the fix stick with rules.',
      scenes: {
        top: { title: 'Every play', spots: {
          title: ['{{t:sec_raw_data_title}}', 'Your whole library, newest first.'],
          song: ['Song', 'Type part of a title.'],
          artist: ['Artist', 'Type part of a name.'],
          album: ['Album', 'Type part of an album.'],
          date: ['Date', 'Any part of the date as the table shows it: “Mar 2024”, “2023”.'],
          summary: ['How many', 'All plays, or how many match.'],
          corr: ['{{t:raw_corrected_only}}', 'Only plays a rule or an edit changed.'],
          rules: ['{{t:modal_rules_open_btn}}', 'Every rule you have saved.'],
          pager: ['Pages', 'First, back, a page number, next, last.'],
          size: ['{{t:raw_rows_per_page}}', '50, 100, 200 or 500.'],
          th: ['Sort', 'Click any heading to sort by it; again to turn it round.'],
          row: ['A play', 'When, what, who and from which album.'],
          edit: ['Edit', 'Fix this play.']
        } },
        edit: { title: '{{t:modal_edit_title}}', spots: {
          artist: ['{{t:modal_label_artist}}', 'With suggestions from your library as you type.'],
          track: ['{{t:modal_label_track}}', 'The song’s title.'],
          album: ['{{t:modal_label_album}}', 'Can be left empty.'],
          time: ['{{t:modal_label_datetime}}', 'When it was played.'],
          now: ['{{t:modal_now_btn}}', 'Sets it to this minute.'],
          all: ['Every match', '{{t:modal_edit_apply_all}}.'],
          rule: ['Remember it', '{{t:modal_edit_save_rule}}.'],
          save: ['{{t:modal_save_locally}}', 'Changes it here. With Last.fm or a Google Sheet, another button sends it there too.'],
          cancel: ['Cancel', 'Nothing changes.']
        } },
        corr: { title: '{{t:raw_corrected_only}}', spots: {
          corr: ['{{t:raw_corrected_only}}', 'Turned on.'],
          row: ['A corrected play', 'A thin line on the left.'],
          badge: ['~', 'Hover it to see what it was before.']
        } },
        rules: { title: '{{t:modal_rules_title}}', spots: {
          count: ['How many', 'Your saved rules.'],
          search: ['Search', 'Find a rule by any name in it.'],
          list: ['The rules', 'Each one: what it finds, and what it turns it into.'],
          rule: ['A rule', 'Applied every time your plays load, from any source. Delete it here.'],
          export: ['{{t:modal_rules_export}}', 'Saves them to a file.'],
          import: ['{{t:modal_rules_import}}', 'Loads a file of rules.']
        } }
      },
      howto: {
        find: { title: 'Find any play', slides: [
          'Type part of a song, artist or album.',
          'Or a date: a day, a month, a year.',
          'How many match.',
          'Sort by any column.',
          'Go through the pages.'
        ] },
        fix: { title: 'Fix a wrong name', slides: [
          'Press Edit on the play.',
          'Correct the name.',
          'Fix every play like it at once…',
          '…and save it as a rule, so future imports get it right too.',
          '{{t:modal_save_locally}}.',
          'The play now has a ~.'
        ] },
        rules: { title: 'Look after your rules', slides: [
          'Open {{t:modal_rules_open_btn}}.',
          'Each rule and what it does.',
          'Find one.',
          'Save them all to a file…',
          '…and load them on another device.'
        ] }
      },
      options: {
        table: { title: 'The table', items: {
          filters: ['Song / artist / album', 'Type to filter.'],
          date: ['Date', 'A day, a month or a year.'],
          corr: ['{{t:raw_corrected_only}}', 'Just the changed plays.'],
          size: ['{{t:raw_rows_per_page}}', '50, 100, 200, 500.'],
          sort: ['Sort', 'Any column, either way.']
        } },
        edit: { title: '{{t:modal_edit_title}}', items: {
          all: ['Every match', 'Same song, artist and album.'],
          rule: ['Save as a rule', 'For future imports.'],
          save: ['{{t:modal_save_locally}}', 'Or {{t:modal_push_lfm}} / {{t:modal_push_sheet}} when connected.']
        } },
        rules: { title: '{{t:modal_rules_title}}', items: {
          export: ['{{t:modal_rules_export}}', 'A backup of your rules.'],
          import: ['{{t:modal_rules_import}}', 'Bring them back.']
        } }
      },
      challenges: {
        'rd.filter': ['Search the table', 'Song, artist, album or date.'],
        'rd.sort': ['Sort by a column', 'Click a heading.'],
        'rd.page': ['Go to another page', 'Above or below the table.'],
        'rd.size': ['Change {{t:raw_rows_per_page}}', 'Above the table.'],
        'rd.corr': ['Show only corrected plays', '{{t:raw_corrected_only}}.'],
        'rd.edit': ['Open a play to edit it', 'The pencil at the end of a row.'],
        'rd.rules': ['Open {{t:modal_rules_title}}', 'Above the table.']
      },
      quiz: {
        q1: ['A song is spelled two ways in your library. What fixes it for good?',
          ['Editing one play', 'Editing it with “every match” and “save as a rule” ticked', 'Deleting the song'],
          'Every match fixes the plays you have; the rule fixes new ones as they come in.'],
        q2: ['How do you find everything you played in March 2024?',
          ['Sort by artist', 'Type “2024” in the song box', 'Type “Mar 2024” in the date box'],
          'The date box takes a day, a month or a year.'],
        q3: ['What does the ~ next to a row mean?',
          ['A rule or an edit changed that play', 'It was played twice', 'It’s a live version'],
          'Hover it to see the name it had before.']
      },
      tips: [
        'Type a month, like “Mar 2024”, in Raw Data’s date box to see every play from then.',
        'Tick “save as a rule” when you fix a name, and future imports come in right.',
        'Back up your correction rules with {{t:modal_rules_export}}.',
        'Turn on {{t:raw_corrected_only}} to see everything a rule has changed.'
      ]
    },
    board: {
      title: '{{t:nav_board}}',
      promise: 'Suggest features, report bugs, ask questions and talk music with other listeners, and see what’s planned.',
      scenes: {
        top: { title: 'The board', spots: {
          title: ['{{t:board_title}}', 'One board for everyone who uses dankcharts.'],
          signin: ['Sign in', 'Anyone can read; signing in lets you post, reply and vote.'],
          chips: ['Categories', '{{t:board_cat_suggestion}}, {{t:board_cat_bug}}, {{t:board_cat_question}} and {{t:board_cat_discussion}}, with how many posts each.'],
          chip: ['One category', 'Tap it to see only those.'],
          search: ['Search', '{{t:board_search}}'],
          status: ['{{t:board_status_label}}', '{{t:board_status_open}}, {{t:board_status_planned}}, {{t:board_status_progress}}, {{t:board_status_done}} or {{t:board_status_declined}}.'],
          sort: ['{{t:board_sort_top}} / {{t:board_sort_new}} / {{t:board_sort_active}}', 'Most votes, newest, or latest reply.'],
          newbtn: ['{{t:board_new}}', 'Write a post.'],
          pinned: ['{{t:board_pinned}}', 'Always at the top.'],
          post: ['A post', 'Click it to read it all and its replies.'],
          vote: ['{{t:board_vote}}', 'One vote each. Tap again to take it back.'],
          cat: ['Category', 'What kind of post.'],
          st: ['{{t:board_status_label}}', 'Where it stands. Set by the team.'],
          meta: ['Who and when', 'The author, when, and how many replies.']
        } },
        post: { title: 'A post', spots: {
          vote: ['{{t:board_vote}}', 'Votes help decide what comes next.'],
          title: ['The post', 'Its title and category.'],
          body: ['In full', 'Everything the author wrote.'],
          actions: ['{{t:board_copy_link}}', 'A link straight to this post. Yours also have Edit and Delete.'],
          replies: ['Replies', 'Oldest first.'],
          reply: ['A reply', 'Its author and when.'],
          form: ['Reply', 'Write one (signed in).']
        } },
        new: { title: '{{t:board_new}}', spots: {
          cats: ['Category', 'Pick one.'],
          title: ['Title', '{{t:board_title_ph}}.'],
          body: ['Details', 'Optional.'],
          foot: ['{{t:board_post}}', '{{t:board_public_note}}']
        } }
      },
      howto: {
        read: { title: 'Find what’s being talked about', slides: [
          'Pick a category.',
          'Sort by votes, newest or latest reply.',
          'Open a post.',
          'Read the replies.'
        ] },
        post: { title: 'Post something', slides: [
          'Sign in with Google.',
          'Press {{t:board_new}}.',
          'Pick a category.',
          'Write a title (and details if you like).',
          'Press {{t:board_post}}.'
        ] },
        follow: { title: 'Vote and follow along', slides: [
          'Vote for what you want most.',
          'The status shows where it stands.',
          'See only {{t:board_status_planned}} or {{t:board_status_done}}.',
          'Join in with a reply.'
        ] }
      },
      options: {
        list: { title: 'The list', items: {
          cat: ['Category', 'All, or one kind.'],
          status: ['{{t:board_status_label}}', 'Any, or one.'],
          sort: ['{{t:board_sort}}', '{{t:board_sort_top}}, {{t:board_sort_new}} or {{t:board_sort_active}}.'],
          search: ['Search', 'Titles, text and names.']
        } },
        post: { title: 'On a post', items: {
          vote: ['{{t:board_vote}}', 'One per person.'],
          link: ['{{t:board_copy_link}}', 'Share the post.'],
          reply: ['{{t:board_reply_btn}}', 'Signed in.']
        } }
      },
      challenges: {
        'bd.cat': ['Pick a category', 'The buttons above the list.'],
        'bd.sort': ['Sort the board another way', '{{t:board_sort_new}} or {{t:board_sort_active}}.'],
        'bd.status': ['Filter by status', '{{t:board_status_all}}.'],
        'bd.search': ['Search the board', '{{t:board_search}}'],
        'bd.open': ['Open a post', 'Click one.'],
        'bd.new': ['Press {{t:board_new}}', 'Top right.']
      },
      quiz: {
        q1: ['What do you need to post or vote?',
          ['Nothing', 'To sign in with Google', 'A Last.fm account'],
          'Anyone can read the board; posting, replying and voting need you signed in.'],
        q2: ['What does the status on a post tell you?',
          ['Where the idea or bug stands: planned, in progress, done…', 'How many people read it', 'When it was posted'],
          'The team sets it, so you can see what’s coming.'],
        q3: ['What is shown with your post?',
          ['Your email', 'Your listening history', 'Your name and Google profile picture'],
          'Your name and picture are shown. Your email never is.']
      },
      tips: [
        'Filter the Board by {{t:board_status_planned}} to see what’s coming next.',
        'Sort the Board by {{t:board_sort_active}} to find where people are talking right now.',
        'Got an idea? Post it on the Board under {{t:board_cat_suggestion}}.'
      ]
    },
    settings: {
      title: '{{t:set_title}}',
      promise: 'Connect your listening, set how your charts work, pick a look and a language, and sign in so everything follows you to every device.',
      scenes: {
        bar: { title: 'The top bar', spots: {
          search: ['{{t:tb_search}}', 'Find any song, artist or album in your library. The / key opens it too.'],
          news: ['{{t:footer_changelog}}', 'What changed on the site since your last visit.'],
          sync: ['{{t:tooltip_sync_now}}', 'Fetches your newest plays from your source.'],
          settings: ['{{t:set_title}}', 'Everything on this page.'],
          theme: ['{{t:set_theme}}', 'Twelve colour themes.'],
          lang: ['{{t:set_language}}', 'English, Español, Português (BR) or Português (PT).'],
          signin: ['{{t:tb_sign_in}}', 'With Google: your settings, playlists, ratings, awards and guide progress follow you to every device.']
        } },
        source: { title: '{{t:set_tab_source}}', spots: {
          search: ['{{t:set_search_ph}}', 'Type a word to jump straight to any setting.'],
          tabs: ['Four tabs', '{{t:set_tab_source}}, {{t:set_tab_charts}}, {{t:set_tab_releases}} and {{t:set_tab_profile}}.'],
          cards: ['Where your plays come from', 'Pick one of three.'],
          sheets: ['Google Sheets', '{{t:set_card_sheets_note}}: your own sheet, filled from Last.fm every 90 minutes.'],
          lastfm: ['Last.fm', '{{t:set_card_lastfm_note}}: just your username.'],
          file: ['{{t:set_card_file_name}}', '{{t:set_card_file_note}}: a file of your plays, no account needed.'],
          url: ['{{t:set_sheet_url}}', 'Paste your sheet’s link. The template button makes a copy for you.'],
          tab: ['{{t:set_sheet_tab}}', 'The tab that holds your plays.'],
          auto: ['{{t:set_adv_summary}}', 'Step by step, with pictures, for a sheet that fills itself.'],
          account: ['{{t:set_lfm_account}}', '{{t:set_lfm_hint_idle}}'],
          connect: ['Connect', 'Opens Last.fm to approve. It only says connected once Last.fm has agreed.'],
          close: ['Close', 'When something needs saving, {{t:set_save_load}} shows here instead.']
        } },
        lastfm: { title: 'Last.fm', spots: {
          card: ['Last.fm', 'The fastest start.'],
          user: ['{{t:set_lfm_user}}', '{{t:set_lfm_hint}}'],
          dirty: ['{{t:set_unsaved}}', 'Shows while a change isn’t saved yet.'],
          save: ['{{t:set_save_load}}', 'Saves it and loads your plays.']
        } },
        file: { title: '{{t:set_card_file_name}}', spots: {
          card: ['{{t:set_card_file_name}}', 'For a one-off look, no account.'],
          drop: ['{{t:set_drop}}', 'A Last.fm export or a CSV of your plays.']
        } },
        charts: { title: '{{t:set_tab_charts}}', spots: {
          tab: ['{{t:set_tab_charts}}', 'How your charts work.'],
          week: ['{{t:set_week_label}}', '{{t:set_week_hint}}'],
          svc: ['{{t:set_ms_label}}', '{{t:set_ms_hint}}.'],
          sections: ['{{t:set_cp_title}}', 'Turn the {{t:set_cp_tm}}, {{t:set_cp_stats}} and {{t:set_cp_cert}} on or off.'],
          stats: ['{{t:set_cp_stats}}', '{{t:set_cp_stats_note}}'],
          events: ['{{t:set_events_title}}', 'How many of your top artists Events follows.'],
          d100: ['{{t:d100_auto}}', 'Your week goes to {{t:nav_dank100}} by itself (signed in).'],
          anim: ['{{t:set_anim}}', 'Charts replay their moves every time they open.'],
          split: ['{{t:set_nosplit}}', '{{t:set_nosplit_note}}'],
          credit: ['{{t:set_credit}}', 'A feature counts in your awards too.']
        } },
        releases: { title: '{{t:set_tab_releases}}', spots: {
          tab: ['{{t:set_tab_releases}}', 'Singles, EPs and certifications.'],
          detect: ['{{t:rtd_setting}}', 'Marks singles, EPs, live albums and soundtracks by their titles and Deezer.'],
          album: ['{{t:set_cert_title}}', 'Plays an album needs for {{t:set_cert_gold}}, {{t:set_cert_plat}} and {{t:set_cert_diamond}}.'],
          song: ['{{t:ig_type_songs}}', 'And a song.'],
          single: ['{{t:rtype_single_plural}}', 'Singles have their own.'],
          ep: ['{{t:rtype_ep_plural}}', 'And EPs.'],
          reset: ['{{t:set_cert_reset}}', 'Back to the standard numbers.'],
          rollup: ['{{t:rollup_label}}', 'A single’s plays also count for its album.']
        } },
        profile: { title: '{{t:set_tab_profile}}', spots: {
          tab: ['{{t:set_tab_profile}}', 'You, the look, and your backups.'],
          name: ['{{t:set_display_name}}', 'Shown on the page and the browser tab.'],
          tz: ['{{t:set_timezone}}', '{{t:set_timezone_hint}}'],
          themes: ['{{t:set_theme}}', 'Twelve themes, dark and light.'],
          theme: ['Your theme', 'The one you use now.'],
          lang: ['{{t:set_language}}', 'The whole site, this guide too.'],
          backups: ['{{t:set_backups}}', 'Signed in, a copy is kept in your account every day. Restore any of them.'],
          dl: ['{{t:set_backup_download}}', 'A file you keep. It holds your API keys, so keep it private.'],
          restore: ['{{t:set_backup_restore_file}}', 'Puts a backup file back.']
        } },
        search: { title: 'Find a setting', spots: {
          search: ['{{t:set_search_ph}}', 'Type what you’re looking for.'],
          results: ['Matches', 'Every setting with that word, and its tab.'],
          result: ['A match', 'Click it to go straight there.']
        } },
        theme: { title: '{{t:set_theme}}', spots: {
          btn: ['{{t:set_theme}}', 'The dot shows your colour.'],
          panel: ['Twelve themes', 'Navy, Purple, Red, Yellow, Pink and Green, each dark and light.'],
          on: ['Yours', 'The one you use now.']
        } },
        lang: { title: '{{t:set_language}}', spots: {
          btn: ['{{t:set_language}}', 'Shows your language’s code.'],
          panel: ['Four languages', 'The whole site changes at once.'],
          on: ['Yours', 'The one you use now.']
        } },
        acct: { title: 'Your account', spots: {
          btn: ['Your picture', 'Opens your account menu.'],
          dot: ['New', 'Something new in {{t:nt_title}}.'],
          name: ['You', 'The Google account you signed in with.'],
          nt: ['{{t:nt_title}}', 'With how many are new.'],
          out: ['{{t:tb_sign_out}}', 'This device stops syncing. Your data stays in your account.']
        } },
        nt: { title: '{{t:nt_title}}', spots: {
          tabs: ['All / Unread', 'Everything, or just the new ones.'],
          group: ['By day', 'Today, yesterday, earlier.'],
          row: ['A notification', 'Click it to go there: a new playlist, a certification, a reply, your month’s Soundtrack, a record.'],
          tile: ['What kind', 'Its colour and icon.'],
          cat: ['Kind and time', 'Playlist, certification, Board, Soundtrack, record.'],
          dismiss: ['✕', 'Removes just this one.'],
          foot: ['{{t:nt_clear}} / {{t:nt_read_all}}', 'Clear all asks first.'],
          close: ['Close', 'Esc does the same.']
        } }
      },
      howto: {
        connect: { title: 'Connect your listening', slides: [
          'Open {{t:set_title}}.',
          'Pick where your plays come from.',
          'Google Sheets: paste your sheet’s link.',
          'Last.fm: type your username.',
          'Or drop a file.',
          'Press {{t:set_save_load}}.'
        ] },
        tune: { title: 'Make the charts yours', slides: [
          'The day your weeks start.',
          'Your time zone: when days begin.',
          'Which sections the chart pages show.',
          'How many plays a certification takes.',
          'Can’t find something? Search for it.'
        ] },
        look: { title: 'Pick a look and a language', slides: [
          'The coloured dot in the top bar.',
          'Twelve themes, dark and light.',
          'The globe: your language.',
          'Four languages.',
          'Both are in {{t:set_tab_profile}} too.'
        ] },
        account: { title: 'Sign in and keep it safe', slides: [
          'Sign in with Google.',
          'Your picture opens your menu.',
          '{{t:nt_title}}: what happened while you were away.',
          'Click one to go there.',
          'Backups: a copy every day, and a file you can keep.'
        ] }
      },
      options: {
        source: { title: '{{t:set_tab_source}}', items: {
          sheets: ['Google Sheets', 'Your own sheet that keeps itself up to date.'],
          lastfm: ['Last.fm', 'Your username.'],
          file: ['{{t:set_card_file_name}}', 'A one-off file.'],
          connect: ['{{t:set_lfm_account}}', 'Add and edit plays here.']
        } },
        charts: { title: '{{t:set_tab_charts}}', items: {
          week: ['{{t:set_week_label}}', 'Any day.'],
          svc: ['{{t:set_ms_label}}', 'Spotify, Apple Music or Deezer.'],
          sections: ['{{t:set_cp_title}}', 'Each on or off.'],
          events: ['{{t:set_events_title}}', 'Your top 10 to 200 artists.'],
          d100: ['{{t:d100_auto}}', 'Signed in.'],
          anim: ['{{t:set_anim}}', 'Every time.'],
          split: ['{{t:set_nosplit}}', 'For “A, B” names.'],
          credit: ['{{t:set_credit}}', 'Features count in awards.']
        } },
        releases: { title: '{{t:set_tab_releases}}', items: {
          detect: ['{{t:rtd_setting}}', 'Titles and Deezer.'],
          apart: ['{{t:rtype_sep_singles}}', '{{t:rtype_sep_with}} or {{t:rtype_sep_apart}}; EPs the same.'],
          rollup: ['{{t:rollup_label}}', '{{t:rollup_off}}, {{t:rollup_modal}} or {{t:rollup_charts}}.'],
          cert: ['{{t:set_cert_title}}', 'For albums, songs, singles and EPs.']
        } },
        profile: { title: '{{t:set_tab_profile}}', items: {
          name: ['{{t:set_display_name}}', 'Your name on the page.'],
          tz: ['{{t:set_timezone}}', 'This computer’s, until you change it.'],
          theme: ['{{t:set_theme}}', 'Twelve.'],
          lang: ['{{t:set_language}}', 'Four.'],
          backups: ['{{t:set_backups}}', 'Daily in your account; a file any time.']
        } }
      },
      challenges: {
        'set.open': ['Open {{t:set_title}}', 'The gear in the top bar.'],
        'set.tab': ['Open another {{t:set_title}} tab', '{{t:set_tab_charts}}, {{t:set_tab_releases}} or {{t:set_tab_profile}}.'],
        'set.search': ['Search the settings', '{{t:set_search_ph}}'],
        'set.theme': ['Try a theme', 'The coloured dot in the top bar.'],
        'set.lang': ['Switch the language', 'The globe in the top bar. (Switch back the same way.)'],
        'set.backup': ['{{t:set_backup_download}}', '{{t:set_title}} → {{t:set_tab_profile}}.'],
        'set.nt': ['Open {{t:nt_title}}', 'Your picture in the top bar (signed in).']
      },
      quiz: {
        q1: ['Which data source needs no account at all?',
          ['Google Sheets', 'Last.fm', '{{t:set_card_file_name}}'],
          'Upload a file of your plays and your charts are built from it, no sign-up anywhere.'],
        q2: ['What does signing in with Google do?',
          ['Your settings, playlists, ratings, awards and guide progress follow you to every device', 'It makes your charts public', 'It’s needed to see any chart'],
          'Your charts work without it; signing in keeps everything in step across devices, with daily backups.'],
        q3: ['Your weeks should start on Monday. Where do you change that?',
          ['{{t:set_tab_profile}}', '{{t:set_tab_charts}} → {{t:set_week_label}}', 'The date bar'],
          'It’s the first setting on the {{t:set_tab_charts}} tab, and it rebuilds every week at once.']
      },
      tips: [
        'Can’t find a setting? Type a word in {{t:set_search_ph}} and jump straight to it.',
        'Twelve themes: try a light one in daylight.',
        'Download a backup file now and then from {{t:set_title}} → {{t:set_tab_profile}}.',
        'Signed in, your picture shows a dot when something new is in {{t:nt_title}}.'
      ]
    }
  }
};
