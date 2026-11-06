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
  areas: ['charts', 'insights', 'more', 'setup'],

  lessons: [
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
    { id: 'awards', area: 'insights', nav: 'awards', soon: true },
    { id: 'soundtrack', area: 'insights', nav: 'soundtrack', soon: true },
    { id: 'dank100', area: 'more', nav: 'dank100', soon: true },
    { id: 'ratings', area: 'more', nav: 'ratings', soon: true },
    { id: 'events', area: 'more', nav: 'events', soon: true },
    { id: 'playlists', area: 'more', nav: 'playlists', soon: true },
    { id: 'rawdata', area: 'more', nav: 'rawdata', soon: true },
    { id: 'board', area: 'more', nav: 'board', soon: true },
    { id: 'settings', area: 'setup', nav: null, soon: true }
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
    area: { charts: 'Your charts', insights: 'Stats, records and awards', more: 'More tabs', setup: 'Settings' },
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
    ref_note: 'Setup checks, your data, the FAQ, glossary and shortcuts. These get the new look in a later update.'
  },

  /* ── Lessons ─────────────────────────────────────────────────────── */
  lessons: {
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
          sizes: ['Sizes', '25, 50, 100 or All (up to 1,000).']
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
          show: ['{{t:rec_size_label}}', '25, 50, 100 or All.'],
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
    awards: { title: 'Awards', promise: 'Your own awards show, from nominees to the ceremony.' },
    soundtrack: { title: 'Your Soundtrack', promise: 'A month, a year or all time told in chapters.' },
    dank100: { title: 'The Dank 100', promise: 'Everyone’s weekly charts added up into one.' },
    ratings: { title: 'Ratings', promise: 'Score albums and songs, and see your critic side.' },
    events: { title: 'Events', promise: 'Birthdays, anniversaries, new releases and the Time Machine.' },
    playlists: { title: 'Playlists', promise: 'Save charts as playlists, and let them build themselves.' },
    rawdata: { title: 'Raw Data', promise: 'Every play: search it, fix it, export it.' },
    board: { title: 'The Board', promise: 'Suggest ideas, report bugs and vote.' },
    settings: { title: 'Settings and your account', promise: 'Data sources, chart settings, themes, sign-in and backups.' }
  }
};
