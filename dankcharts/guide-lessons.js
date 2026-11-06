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
    { id: 'around', area: 'charts', nav: 'week', soon: true },
    { id: 'windows', area: 'charts', nav: 'week', soon: true },
    { id: 'stats', area: 'insights', nav: 'graphs', soon: true },
    { id: 'records', area: 'insights', nav: 'records', soon: true },
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
    around: { title: 'Around the chart and sharing it', promise: 'Bubbling Under, Off the Chart, New Entries, share images, PDFs and playlists.' },
    windows: { title: 'Song, artist and album windows', promise: 'Everything about one song, artist or album, and how to find it fast.' },
    stats: { title: 'Stats', promise: 'Overview, Story, Graphs, Compare and Games for any date range.' },
    records: { title: 'Records', promise: 'Your record book: number ones, debuts, certifications, streaks and more.' },
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
