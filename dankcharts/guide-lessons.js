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
    { id: 'periods', area: 'charts', nav: 'month', soon: true },
    { id: 'daily', area: 'charts', nav: 'day', soon: true },
    { id: 'alltime', area: 'charts', nav: 'alltime', soon: true },
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
    periods: { title: 'Monthly and Yearly charts', promise: 'Year-end charts for any year, and months that show what really stuck.' },
    daily: { title: 'Your Daily chart', promise: 'One day at a time: your top songs, habits and memories from the same day.' },
    alltime: { title: 'All-Time and time travel', promise: 'Your biggest songs ever, and what the chart looked like on any day.' },
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
