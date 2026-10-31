/* ===========================================================================
   CHANGELOG - THE RECORD OF EVERY CHANGE
   ===========================================================================
   Every user-facing change to dankcharts.fm since the first commit on
   2026-04-02, rewritten from the git history into plain language.

   This lives in its own file rather than in app.js for two reasons: app.js is
   already ~39k lines and this list only grows, and the changelog is data, not
   behaviour - it is read once when the overlay opens and never touched again.

   -- Entry shape ------------------------------------------------------------
     d      ISO date (YYYY-MM-DD), the day the change landed
     t      type   - see DC_CL_TYPES below
     a      area   - see DC_CL_AREAS below
     h      short commit hash, so any entry can be traced back to the code
     title  what changed, in the user's language, not the developer's
     detail longer explanation: what it does, and where it matters, why

   -- Keeping it current -----------------------------------------------------
   New entries go at the TOP of DC_CHANGELOG (newest first). When adding one,
   bump the ?v= on the changelog.js tag in index.html or the browser will serve
   the old list from cache.

   -- Other languages ---------------------------------------------------------
   This file stays English. Each entry's translation lives in its own file per
   language - changelog.es.js, changelog.pt-BR.js, changelog.pt-PT.js - keyed
   by the English title, and is fetched only when the overlay is opened in
   that language, so English readers never download three more copies of it.

   Adding an entry means adding it to all three files too. One that is missing
   is not an error: that entry alone shows in English. The same goes for an
   English title that gets edited - its translation stops matching and the
   entry falls back to English, which is right, because the old translation
   no longer says what the entry says. Bump DC_CL_I18N_V below after editing
   any of the three, for the same cache reason as the ?v= above.

   Type and area labels and the rest of the overlay's chrome are ordinary keys
   in translations.js (cl_type_*, cl_area_*, cl_stat_*); the labels below are
   only the English fallback.
   =========================================================================== */

const DC_CL_I18N_V = 383;

/* Type badges. Order here is the order the filter pills appear in. */
const DC_CL_TYPES = {
  feature: { label: 'New',         cls: 'feature' },
  fix:     { label: 'Fix',         cls: 'fix'     },
  change:  { label: 'Changed',     cls: 'change'  },
  design:  { label: 'Design',      cls: 'design'  },
  perf:    { label: 'Performance', cls: 'perf'    },
  i18n:    { label: 'Languages',   cls: 'i18n'    },
  data:    { label: 'Data',        cls: 'data'    },
};

/* Areas of the app an entry can belong to, for the second filter row. */
const DC_CL_AREAS = {
  charts:     'Charts',
  records:    'Records',
  awards:     'Awards',
  events:     'Events',
  soundtrack: 'Your Soundtrack',
  playlists:  'Playlists',
  player:     'Player',
  graphs:     'Graphs',
  rawdata:    'Raw Data',
  ratings:    'Ratings',
  guide:      'Guide & Tour',
  settings:   'Settings',
  themes:     'Themes',
  share:      'Sharing',
  data:       'Data & Sync',
  mobile:     'Mobile',
  ui:         'Interface',
};

/* -- The record -------------------------------------------------------------
   Newest first. Backfilled from the full git history, 679 entries.
   ------------------------------------------------------------------------- */
const DC_CHANGELOG = [

  /* ========== OCTOBER 2026 ========== */
  { d: '2026-10-31', t: 'fix', a: 'records', h: 'a7369e2',
    title: "The Appearances table header no longer covers the #1 row",
    detail: "In Records → Appearances, the column titles of the table slid down over the #1 entry and left an empty strip above them. They now stay just under the top bar as you scroll the list, like the other Records tables. On narrower screens, where the table scrolls sideways, they stay at the top of the table." },
  { d: '2026-10-31', t: 'design', a: 'ui', h: 'a48d1c3',
    title: "Line icons instead of emoji, everywhere",
    detail: "Titles, buttons and tabs across the site now use the same line icons as the menus, instead of emoji that looked different on every phone and computer. Menu rows simply lose theirs, so the words line up. The Daily mood faces, the 🔥 streak flame, the stat tile icons and the 💎 💿 📀 certification marks stay as they are." },
  { d: '2026-10-31', t: 'perf', a: 'records', h: '50a597e',
    title: "Records opens at once",
    detail: "Opening Records on a big library used to freeze the page for a few seconds while every record was worked out. Now the tab opens straight away with a short Building your records… line, and the records fill in a moment later. Once built, it opens with no wait until your plays change." },
  { d: '2026-10-31', t: 'design', a: 'ui', h: 'bc7e7d3',
    title: "Tidier layouts on tablets, and a lighter site",
    detail: "The site now switches layout at two widths, phone and tablet, instead of about thirty, so tablets and narrow windows get one clear layout: Stats, the Charts Guide and the Records tables use their wider form sooner, with nothing running off the side. Behind the scenes about 1,500 lines of unused styles, old functions and around 100 unused texts were removed, and two messages that were only in English (in the chart run and the Stats heatmap) now come in every language." },
  { d: '2026-10-30', t: 'feature', a: 'ui', h: '4ca4d2a',
    title: "Games in Stats: how well do you know your own music?",
    detail: "Stats has a Games tab with four quizzes made from your own library, played full screen. Higher or lower: does this song have more or fewer plays than that one? Keep the streak going. Guess the year: when did you first play this song? Ten songs, up to 100 points each. Which came first: two songs, which one did you find first? Guess the #1: a week from your past, pick its #1 song from four that charted that week. Your best score for each stays on this device, and at the end you can share your score as a picture. The games use your whole history, so the date range steps aside on that tab. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-30', t: 'feature', a: 'ui', h: '574cc54',
    title: "A Story tab in Stats: what your listening was about",
    detail: "Stats has a Story tab that tells what the date range was about, card by card. Your obsession shows the artist you played most each month (each week for a short range), with their picture; tap one to open that chart. Your eras finds the stretches where one artist was #1 on your weekly chart three weeks or more in a row. Taste drift draws how your yearly top 10 artists moved over the last eight years; tap a line or a name to follow one artist. Then: how loyal or adventurous you were (the share that went to your top 10), comfort songs against new finds, your biggest new artists and whether they are still going, cooling off or faded, your plays put another way (a day, your top song, and as steps), and the round numbers you passed, like your 200,000th play or an artist reaching 2,500 plays. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-30', t: 'feature', a: 'ui', h: '08e4613',
    title: "The Play Count Race races whatever you pick",
    detail: "The Play Count Race is now the Race view of the Compare studio in Stats. Instead of a fixed top 5 to top 100, it races the artists, songs or albums you picked there, so you can watch any two favourites fight it out from your first play. Fill with my top 10 brings back the classic race of your 10 most played in one tap. Speed, its own date range, play, step, the seek bar and the GIF download work as before. On phones the race also has room for its bars now: the names and counts take less space. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-30', t: 'feature', a: 'ui', h: 'c3d1b0c',
    title: "Compare anything side by side in Stats",
    detail: "The Compare tab in Stats has a new studio that puts up to 10 artists, songs, albums or years side by side. Pick a type, add what you want by typing or from the list, and it opens on your top 3 for the date range. Running total adds up their plays over the range, Per period shows them day by day, month by month or year by year, and Chart run shows where each one ranked on the daily, weekly, monthly or yearly chart. Years are compared month by month on one axis, so you can see how this year is shaping up against the last ones. Under the chart, four tiles say who won what: most plays, most weeks at #1, hottest in the last four weeks and who has been with you longest (for years: most plays, most artists, most new songs and the busiest month). It replaces the two artist comparison charts. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-30', t: 'feature', a: 'ui', h: 'f7b2082',
    title: "Stats Charts: volume and discoveries in one, a listening clock and your week",
    detail: "The Charts tab in Stats has been redone. Play volume and New Discoveries are now one chart with a Plays / New finds switch: Plays splits each period's bars into songs you already knew and songs you heard for the first time, and New finds shows how many songs, artists and albums were new each period. Tap a bar to look inside: the period's plays, its top 5 songs, its top 5 new finds and a button to open that period's chart. Two new cards sit side by side under it. The listening clock shows when in the day you play music, with your busiest hour in gold, and Your week shows the average plays on each day. Tap an hour or a day to see its plays and your most played artist. Both follow the date range at the top. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-30', t: 'feature', a: 'ui', h: '96aaad3',
    title: "Stats in tabs, starting with an Overview of your listening",
    detail: "The Stats page now has tabs under the date range: Overview, Compare and Charts, with more to come. Overview opens first. It sums up the range you picked in one sentence (how much you played, against the same stretch before, your top artist and how many songs were new to you), with four tiles for Plays, Songs, Artists and Albums. Each tile shows the change against the stretch before, a small line of how it went over the range, and plays a day, your best day, or how many were new. Compare holds the artist charts and the Play Count Race, and Charts holds play volume, new discoveries and the heatmap. The range bar also has a new 4 wk button for the last four weeks. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-29', t: 'feature', a: 'ui', h: '7324b11',
    title: "A Ratings page with everything you have scored",
    detail: "Your ratings have a page of their own, under More → Ratings, instead of opening the Stats tab. At the top is your average album as a ring with its verdict, how much of what you play you have rated, and when you rate: the days, your longest run and the last time. Under it are the most played album you haven't rated yet (one tap to rate it), cards for your highest and lowest album, single or EP and song that slide through every one at that score (a dozen albums at 10.0 all get their turn; tap the one showing to open it), and your critical records: most overplayed, most underplayed, most consistent album and best rated artist. These used to sit under the Records Overview, only in English, and they now count albums you rated through their tracks too. Then the artists you rate best (each opens their Rating tab), what you rated lately, and the full list with Albums, Singles / EPs, Songs and To rate (albums you've played 10 or more times), with the score spread, search and sort. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-29', t: 'feature', a: 'ui', h: '3c2f47a',
    title: "Daily chart records in Records",
    detail: "Records now counts the daily charts too. All #1s (in total and in a row), Perfect All Kill, Appearances (in total and in a row), Debuts and Most Plays each get a Daily choice first in their period switch, so you can see which song spent the most days at #1, the longest daily run on the chart, the biggest daily debut and the most plays in one day. A switch you haven't touched still opens on Weekly. The Overview cards get a Daily choice as well, now laid out two by two, and the line under the title shows the daily chart's size and how many days it covers. Daily records also count toward the Hall of Fame reels in artist, song and album details. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-29', t: 'feature', a: 'ui', h: '2c24473',
    title: "Daily charts in every artist, song, album, single and EP",
    detail: "Song, album, artist, single and EP details now count the daily charts too. In the Charts tab, Daily sits first in the chart switch: the peak, the run in one sentence, days on the chart, at #1 and in the Top 10, the chart moments and the zoomable graph, which opens on the last three months (with new 1 month and 3 months ranges). A single's switch to its song chart has it as well. The Overview badges add days at #1 and in the Top 10 on the daily chart, an artist's days at #1 on the daily artist chart, and the songs or tracks that topped the daily song chart. The Music and Tracks lists get Daily in their chart picker, with each entry's best day and days on the chart, an album's chart run list gets a Daily section, and \"Open that chart\" now opens that exact day. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-29', t: 'design', a: 'ui', h: '202212b',
    title: "Album details redone, with a track list like the artist's and front-to-back listens",
    detail: "An album's details now work like an artist's. Overview opens with a headline card: total plays, its all-time rank as a medal, its share of the artist's plays, first and last played, tracks, plays per track and how far it is from the next certification. Under it are the top track and the one you've played most lately (or the first track you heard), your listening habits with it, including front-to-back listens (times you played most of its tracks in one sitting), a rating card that opens the Rating tab, the achievements as badges you can tap, and the plaques. The Tracks tab is now the artist's Music list: every track you've played as a card with artwork, its rank, its certification and Sample, Spotify and YouTube buttons, a bar showing how your plays split across the tracks, a chart picker, search and sort. Tap a card for its stats and chart runs. The Charts tab has the zoomable graph on the album charts (with the album that was #1 each week), the chart moments, its tracks on each song chart, every record it holds and the chart run you already knew. The Listening tab shows whether it is on rotation, plays by month, the eras of its tracks, the front-to-back listens, when you listen, milestones and the calendar. On a phone, diamond certifications in these lists show as 💎. Singles and EPs are called singles and EPs, their rank is named for the chart they're ranked on, and a one-song single shows the song instead of a track list. A single's Charts tab lets you switch between its run on the singles (or albums) chart and its song's run on the song charts. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-29', t: 'design', a: 'ui', h: '78c26d0',
    title: "Song details redone, with a zoomable chart graph and the day you found it",
    detail: "A song's details now work like an artist's. Overview opens with a headline card: total plays, its all-time rank as a medal, its share of the artist's plays, first and last played, days played, plays per day and how far it is from the next certification. Its album and artist sit under it as cards that say where the song ranks among their songs, then your listening habits with it (streak, best day, plays in a row, longest break, comebacks). Your rating stays where it was, and the achievements are now badges you can tap to see the weeks that earned them. The Charts tab has the artist's graph: pick Weekly, Monthly or Yearly, see the peak as a medal and the run in one sentence, read any week on the zoomable graph (with the song that was #1 then), and jump to the chart moments. It also shows how the song's run compares with the rest of its album and its artist, every record it holds, and the chart run you already knew, under all of it. The Listening tab shows whether it is on rotation, this year against last, plays by month, the day you found it with what played around it, the songs you play alongside it, when you listen, seasons, milestones with the day and time, year by year and the calendar. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-29', t: 'feature', a: 'ui', h: '7e986cc',
    title: "A new Awards tab in artist details, with their real-life awards",
    detail: "The Awards tab of an artist's details was two numbers and a folded list. Now a switch at the top flips between My Grammies and Real life. My Grammies shows the artist's win rate as a ring, a verdict, where they rank among every artist on your ballots, and their nominations, wins, ceremonies and best year. The big categories (Artist, Album, Song and Record of the Year, Best New Artist) light up when won. A chart goes ceremony by ceremony: tap a year to see only its ballot and open that ceremony. Every win sits on a trophy shelf with its artwork, their most nominated songs and albums show one dot per race, Head to head gives their record against the artists they met most, and the full list says what they won, what they lost and to whom. Nominations now count each nominated song or album, the same as the Stats & records summary. Real life shows the artist's actual awards and nominations from Wikipedia: wins, nominations and Grammys, You vs. the industry (what you both crowned, what only you did and what only the industry did), the award shows they were up at, which narrow everything below, year by year, their most awarded work (opening what's in your library) and the full list. It is saved on your device for a week, with a Refresh button. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-29', t: 'design', a: 'ui', h: '22d785d',
    title: "A livelier Charts tab in artist details, with a graph you can zoom",
    detail: "The Charts tab of an artist's details was rows of look-alike tiles and a table. Now pick the Weekly, Monthly or Yearly chart and see the artist's peak as a gold, silver or bronze medal with the week it was reached, the run told in one sentence, and four numbers: time on the chart, at #1, in the Top 10 and the longest streak, each saying whether those weeks came in a row. A graph shows the rank over time: move over it or tap it to read any week (its rank, its move, its plays and who was #1 then), and open that chart from there. Long histories can be zoomed: pick 6 months, 1 year or 3 years, use − and +, pinch or Ctrl + scroll, drag to move along, or drag the window on the small overview strip under the graph. Chart moments list the debut, the first Top 10, the first #1, the biggest climb, the longest run at #1 and the comebacks, and each one jumps the graph to its week. Their songs and albums on each chart are now tiles that open the Music tab on that list. In the Music tab, tapping a card now unfolds its chart run, the name opens the song or album, and each card has Sample, Spotify and YouTube buttons. The ✕ on a song or album opened from another panel now goes back to it instead of closing everything." },
  { d: '2026-10-28', t: 'design', a: 'charts', h: 'e6cd230',
    title: "A clearer \"Single, then album\" window",
    detail: "The explanation at the top of the Single, then album window is easier to follow. It now says why the split is needed, then has one line for each choice in the song switches - Single only, Both and Album only - with the same names as the buttons, saying where the song is and what its plays count for." },
  { d: '2026-10-28', t: 'feature', a: 'charts', h: '0c1e41b',
    title: "Singles that share their album's name",
    detail: "A lead single often has the same name as its album, and a play only records the album name, so marking it a single turned the whole album into one, and marking it an album started the album's chart run on the day you first played the single. Now there is a new release type, Single, then album. It lists every song you played under that name and you sort each one: Single only (B-sides, remixes, edits), Both (the title song) or Album only. Songs only on the single always count for the single; songs on both count for the single until the album starts and for the album after; the rest count for the album. The album starts on the first day you played an album-only song, or on a date you set. The site makes the first guess from the tracklists on Deezer. The single then shows as its own release (\"Lover - Single\") on the charts, so with singles set Apart each one charts on its own. Pick it from Release type on an album page, or tap \"Shares its name with an album?\" on a single with four or more songs. Works for Last.fm, Google Sheets and CSV, and your sheet and files keep the real album name." },
  { d: '2026-10-28', t: 'design', a: 'ratings', h: '49f1dc8',
    title: "A clearer Rating tab in artist details",
    detail: "The Rating tab of an artist's details was one long column. Now it opens with your verdict: a large score ring, what it averages, and bars for how many of their albums, singles and songs you have rated, with the Share card button. Next up shows their most played album without a score, one tap to rate it. Highest and lowest rated album and song sit side by side and open their rating. A spread shows how your scores fall across the seven verdicts; tap one to list only those. Below, switch between Albums, Singles, Songs and To rate, with search, sorting and Show all. Tap a row to edit its rating, or the arrow to open its page." },
  { d: '2026-10-28', t: 'change', a: 'ratings', h: 'c3c563d',
    title: "Singles and EPs rated apart from albums",
    detail: "Ratings now follow what a release is, like certifications do: a single or EP no longer counts as an album, whether or not singles are set Apart in the charts. So an artist's verdict, their highest rated album and the rating records are about albums, and a 10.0 single no longer tops them. Singles get their own Highest rated single / EP record, and the artist share card still shows them behind its own switch. A release that looks like a single (a \" - Single\" title, Deezer's type, or a tracklist of three songs or fewer) is treated as one in ratings until you say otherwise." },
  { d: '2026-10-28', t: 'feature', a: 'ui', h: '50b0229',
    title: "Change cover art from an artist's Music tab",
    detail: "Each cover in the Music tab of an artist's details now has the ✎ button, so you can pick different artwork right from the list, as you can on the charts and in Records." },
  { d: '2026-10-28', t: 'feature', a: 'charts', h: 'b627c31',
    title: "See an album's songs from the album charts",
    detail: "Tap the Tracks count on the album charts to see the album's songs you played in that period, most played first. Each one has a ▶ sample and Spotify, Google and YouTube searches." },
  { d: '2026-10-28', t: 'feature', a: 'charts', h: '1ce994a',
    title: "Names on the charts open their details",
    detail: "On the song and album charts, tap a song or album name to open its details, and an artist name to open the artist." },
  { d: '2026-10-28', t: 'design', a: 'ui', h: 'b780184',
    title: "A clearer Music tab in artist details",
    detail: "The Music tab of an artist's details was eight closed drop-downs of tables. Now it shows one list at a time: pick Songs or Albums, then the All-time, Yearly, Monthly or Weekly chart, each with how many made it. A line says what the list is, and a summary shows how many there are, how many reached #1 and the Top 10, and their plays or time on the chart. Search the list or sort it by chart rank, most played, recently played or A–Z. Each row has artwork, its best rank as a gold, silver or bronze badge, its certification and a plays bar, with the chart facts as small labels under the name; Best week takes you to that chart. Tap a row to open the song or album, or the arrow for its chart run or play history." },
  { d: '2026-10-27', t: 'design', a: 'ui', h: '9963187',
    title: "A livelier artist Overview with badges you can open",
    detail: "The Overview of an artist's details was fourteen tiles that all looked the same. Now it starts with one headline card: total plays and what share of all your plays they are, the artist's all-time rank as a gold, silver or bronze medal, a bar from the first play to the last showing how many of those days you played them, and songs, albums and average plays per song. Under it, their most played song and album as cards with artwork that open their own details, then your listening habits with dates (longest streak, best day). Chart Accomplishments are now badges (#1s, Diamond, Platinum, Gold) that you can filter and tap: each opens a list of what earned it, and every song, album or week in it opens too. The long ratings lists have moved to a new Rating tab; the Overview keeps a short ratings card that takes you there." },
  { d: '2026-10-26', t: 'feature', a: 'charts', h: '48ad3be',
    title: "Bubbling Under summary and all-time goals within reach",
    detail: "The Bubbling Under run now has the same summary as the chart run: one sentence that tells it (where it first bubbled under, its best spot and what that equals overall, and its record on the chart), a row of counts you can tap to highlight weeks at BU1, BU1–3 or BU1–5, and the next milestones under the boxes. When an entry is bubbling under this week, the first goal says how many plays it needs to make the Top 10. In both runs, the all-time goal is now the next step up from where an entry sits (Top 5000, 1000, 500, 100, 50, 10 and so on) instead of always the Top 10, and #1 all-time only appears once an entry is in the Top 10." },
  { d: '2026-10-26', t: 'design', a: 'charts', h: 'd0316ed',
    title: "A shorter chart run summary with milestones to chase",
    detail: "The ten stat tiles above a chart run are gone. In their place: one sentence that tells the run (\"Debuted at #1, spent 5 weeks at the top and has 27 weeks on the chart\"), and one row of counts that is also the colour key for the boxes. Tap \"5 wks at #1\" or \"13 in Top 3\" and every other week dims. Under the boxes, Next milestone shows the closest goal and the three after it: weeks on the chart, weeks at #1, the next certification and the next all-time spot, with how far each one is. On long runs the counts row stays at the top while you scroll the weeks. Last week, plays, certification and score now fit on one line." },
  { d: '2026-10-26', t: 'feature', a: 'ui', h: '5d0667d',
    title: "Search buttons and Share card in the details window",
    detail: "The song, album and artist windows now have Spotify, YouTube and Last.fm buttons, like the new-artist window in Your Soundtrack. Spotify and YouTube search for what you are looking at; Last.fm opens its track, album or artist page. The Share button is now Share card and sits next to Playlist and Rate." },
  { d: '2026-10-26', t: 'design', a: 'ui', h: '8f97f0f',
    title: "Song, album and artist details in the middle of the screen",
    detail: "The details of a song, album or artist now open in a large window in the middle of the screen instead of a panel at the side. On a computer the cover, title and buttons stay on the left while you move through the tabs on the right. The window takes its colour from the cover: the Sample button, the tab line, the icons, the numbers and the plays-by-month bars all match the artwork. The big numbers are bolder and count up as the window opens. On a phone the details still fill the screen." },
  { d: '2026-10-26', t: 'perf', a: 'ui', h: '8af4d11',
    title: "Artist details open straight away",
    detail: "The first time you opened an artist, the panel could take a few seconds to appear while their Hall of Fame records were being worked out. Those records are now only worked out when you open the artist's Charts tab, where they are shown, so the panel slides in at once. The plays-by-month chart also fits the panel now, even for a long listening history." },
  { d: '2026-10-26', t: 'i18n', a: 'ui', h: 'cb14b40',
    title: "Artist details fully in your language",
    detail: "The last English bits in the artist details are now in Spanish and Portuguese too: the achievements for #1 songs and #1 debuts, the chart breakdown table, the Grammy categories button and the list of albums still to rate. The note under Animate charts in Settings now names the replay button the way it is called in your language." },
  { d: '2026-10-26', t: 'design', a: 'settings', h: '1f6c712',
    title: "Settings: better organised, with search",
    detail: "Settings now has four tabs. Charts keeps the chart week, the chart page sections, the events calendar and how things behave; a new Releases tab gathers everything about kinds of records — release types, certification thresholds and compilation albums; and Profile gains an Appearance section where you can pick any of the ten themes and the language. A search box at the top finds any setting by name and takes you straight to it. The bottom bar is just a Close button until you change something that needs saving, and then shows \"Unsaved changes\" with Cancel and Save & Load. Nothing was removed." },
  { d: '2026-10-26', t: 'design', a: 'share', h: '97a3fc3',
    title: "Share as image: one tidy window everywhere",
    detail: "Every share-as-image window — charts, chart runs, stats, streaks, ratings, an album's tracks, an artist's songs and the Daily calendar — now looks and works the same. The preview sits on a soft stage and stays in view while you scroll the options, each group of options (design, colours, format, what to show…) is a card you can fold away by clicking its title, and Copy, Share and Download have clear icons. On a phone the less-used groups start folded so the preview and the main choices fit on screen. Copy, Share and Copied! are now in Spanish and Portuguese too, and a song's chart-run window shows its title as written." },
  { d: '2026-10-26', t: 'design', a: 'ratings', h: 'c0b7348',
    title: "Rating window: smoother, clearer and in your language",
    detail: "Rating a song or an album is easier to follow: what you're rating and its score stay at the top and the Done button at the bottom while you scroll the criteria. Each criterion is its own card with a simple icon that lights up once you've scored it, the sliders fill up as you drag and line up down the list, and the score ring now glides to the new number instead of jumping. The whole rating window — the criteria and their descriptions, the verdicts from Masterpiece to Poor, every button and hint — is now in Spanish and Portuguese too, and so are the verdicts shown in the details panels and on the share cards." },
  { d: '2026-10-26', t: 'design', a: 'ui', h: 'd1eed71',
    title: "Details panel: clean icons, tidy numbers, in your language",
    detail: "Inside the song, album and artist panels the emoji are now simple line icons, and the numbers sit on separate cards with the four most important ones larger; the rest fold away behind an \"All numbers\" button. Achievements are a tidy list you can open by clicking anywhere on a row. A song's Charts tab now shows its chart run for the period on screen, the Awards tab only appears when there is something to show, and the line under an artist's name says how many plays and since when. Every label in the artist panel — the chart sections, table headings and counts — is now in Spanish and Portuguese too. The artist pop-up on the Stats and Soundtrack tabs slides in from the side the same way. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-26', t: 'design', a: 'ui', h: 'be3049e',
    title: "Song, album and artist details open as a side panel",
    detail: "Clicking a song, album or artist now opens its details in a panel that slides in from the right, so the chart stays in view beside it (on a phone it fills the screen). The top shows the cover large over a soft blur of its own colours, with buttons right under the name: play a 30-second sample, add to a playlist, rate, share, and ⋯ for everything else (play the video, change the picture, search on YouTube or Spotify). The details are split into tabs — Overview, Charts, Listening and Awards, plus Tracks and Rating for an album and Music for an artist — instead of one very long page. Going from a song to its album or artist keeps your place: the ← button steps back. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-26', t: 'design', a: 'ui', h: '93e1743',
    title: "Small windows: one clean look",
    detail: "The smaller windows now share one design: a title with a simple line icon and a short line about what the window is for, the content in the middle, and the buttons at the bottom (Cancel on the left, the main action on the right). This covers adding or editing a play, auto-correct rules, compilation albums, release types, the add-to-playlist and new-playlist windows, the printable PDF, sharing a ceremony, choosing a picture and Contact Support. Lists show how many entries they hold and a friendly line when they are empty, the add-a-play window has a close button, and the rules list, ceremony sharing and their messages are now in Spanish and Portuguese too. Stopping a shared ceremony link now asks in the site's own warning window. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-26', t: 'design', a: 'ui', h: '336b151',
    title: "Pop-up windows: one smooth way to open and close",
    detail: "Every pop-up window on the site now behaves the same way. It fades in over a softly blurred page and fades out when it closes; the page behind stays put while it is open; Esc closes only the window on top (so closing a list opened from Settings leaves Settings open); and with a keyboard, Tab stays inside the window and focus goes back to the button you pressed. On a phone, windows slide up from the bottom of the screen as a sheet with a small handle: drag it down to close." },
  { d: '2026-10-26', t: 'i18n', a: 'guide', h: '57386e4',
    title: "Charts Guide: up to date, in your language, shorter on phones",
    detail: "The Charts Guide is now in Spanish and Portuguese as well as English, and it describes the site as it is today: the tabs grouped the way the top bar groups them (with Daily and Stats), where week start and the chart menu's Show and Actions live, how to fix a misspelled name from Raw Data, and the current keyboard shortcuts. Tab names match the menu in every language. On a phone each chapter folds to its heading, so the guide is a short list you open one chapter of at a time. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-26', t: 'design', a: 'guide', h: '53616c1',
    title: "Charts Guide: new top and icons",
    detail: "The Charts Guide no longer opens with a bright blue banner: it has the same page title as the other tabs, a short line about what's inside, your first-steps progress and the Take the tour, Search your library and Replay the welcome buttons in one row. The emoji throughout the guide are now line icons, and each tab in The Tabs shows the same icon it has in the menu." },
  { d: '2026-10-26', t: 'design', a: 'ui', h: '8252e73',
    title: "Community Board: looks like the rest of the site",
    detail: "The Community Board now has the same page title as the other tabs and no longer sits inside a box. Posts are rows on the page with a line between them, and the open one is marked with a coloured edge. The emoji on the buttons and tags (pin, replies, edit, copy link, delete) are now simple line icons, the sort switch matches the rest of the site, and the Cancel button in the new-post form is a proper button again." },
  { d: '2026-10-26', t: 'i18n', a: 'playlists', h: '2f927e8',
    title: "Playlists in your language, and a warning before deleting one",
    detail: "Everything on the Playlists page is now in Spanish and Portuguese too: the save box, Resume, the song counts, the empty page and every button's label. Deleting a whole playlist now asks first in the site's own warning window (before, one click deleted it), and renaming a playlist to a name you already use asks in the same window instead of the browser's pop-up. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-26', t: 'design', a: 'playlists', h: '9f18c7b',
    title: "Playlists: covers on every playlist and song",
    detail: "Each playlist now shows a small collage of its first four songs' covers next to its name, with the song count under it. Open a playlist and every song has its cover, with the title above the artist. On phones the play and remove buttons on each song now always show (before, they only appeared when hovering with a mouse, so they couldn't be reached on a touch screen). Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-26', t: 'design', a: 'playlists', h: '5778bb1',
    title: "Playlists: your playlists first",
    detail: "The Playlists tab now opens with your playlists, under the same page title as the other tabs, with the save-queue box right below it. Anniversaries and Recent Releases moved under your playlists as plain titled rows instead of boxes, and while they are being looked up a loading line says so instead of showing two empty boxes. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-26', t: 'design', a: 'soundtrack', h: '5ba09ed',
    title: "Your Soundtrack: your best month's banner is a collage of its top songs",
    detail: "The Monthly Activity chapter's banner now shows a faded collage of the covers of the songs you played most in your loudest month, instead of one photo of that month's top artist. If that month has only a few songs, the artist photo stays. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-26', t: 'fix', a: 'soundtrack', h: 'e2701f2',
    title: "Your Soundtrack: chapter pictures no longer fade out on light themes",
    detail: "On light themes, the pictures behind each chapter's banner looked washed out, almost invisible. They now show at full strength on the right, while the left side stays pale so the chapter's title is still easy to read. Dark themes are unchanged. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'fix', a: 'soundtrack', h: '8ac4222',
    title: "Your Soundtrack: My Grammys tag no longer covers the wins ribbon",
    detail: "In the awards chapter, the star tag for your My Grammys picks now sits just above the artist's name instead of at the top of the photo, so it can't run into the gold wins ribbon in the corner, even in languages where the label is longer. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'design', a: 'soundtrack', h: 'b1859a9',
    title: "Your Soundtrack: uppercase labels on the streak cards",
    detail: "The top cards in the Streaks chapter now show their labels in small capitals, like the site's other stat tiles. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'design', a: 'soundtrack', h: 'dbb4193',
    title: "Your Soundtrack: your My Grammys picks look different from real wins",
    detail: "In the awards chapter, the gold ribbon on each artist now counts only real award show wins. Your own My Grammys picks get their own star tag in your theme's colour, and in the list under the photo they're tinted that colour with a star, so you can always tell your picks from the real thing. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'fix', a: 'soundtrack', h: '8c03a62',
    title: "Your Soundtrack: tidier Days with music card",
    detail: "The Days with music card in the Streaks chapter no longer says \"days\" twice: it now reads \"297 of 298 · Days with music\". Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'feature', a: 'soundtrack', h: '07af0fe',
    title: "Your Soundtrack: real award show wins in the awards chapter",
    detail: "The awards chapter is now \"Award Winners in Your Charts\". Next to your My Grammys picks, it shows the real awards your top 20 artists won at shows held that year: the Grammys, VMAs, AMAs, iHeartRadio, World Music, Billboard, ARIA, Juno and BRIT Awards. A show counts in the year it was held, even though it honours the music of the year before, so each year's Soundtrack has its awards by the end of that year. Wins only. Tap a card to see each award, the show and the winning song or album. All-Time adds every Grammy and the other shows you've already looked at. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'fix', a: 'soundtrack', h: 'b7e94dc',
    title: "Your Soundtrack: streak cards centred",
    detail: "In the Streaks chapter, each card's content now sits in the middle of the card, even when another card is taller because of its badge. The line under the calendar shows a single date for a one-day break. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'fix', a: 'soundtrack', h: '632251e',
    title: "Your Soundtrack: Grammys chapter shows that year's awards, no Awards visit needed",
    detail: "The Grammy winners chapter now only counts your My Grammys picks for the year you're looking at (a month uses its year; All-Time still counts every year). It also loads your saved ballots by itself, so the winners show up right away instead of only after you'd opened the Awards tab in that visit. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'i18n', a: 'soundtrack', h: '632251e',
    title: "Your Soundtrack: natural Spanish in Listening Streaks",
    detail: "The Spanish text in the Streaks chapter was rewritten to sound natural instead of translated word for word (\"Tu racha récord\", \"Lo que más sonó\", \"por estas fechas en 2025\", and no English-style capitals). Also, in every language a single day no longer shows as \"1 days\", and a one-day break shows just its date. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'change', a: 'soundtrack', h: 'af9cba1',
    title: "Your Soundtrack: “All-time best streak” card label",
    detail: "In the Streaks chapter, the record card now reads \"All-time best streak\": shorter, and it pairs with \"Best streak of 2019\" next to it. Tapping it still shows the full name in the details panel. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'design', a: 'soundtrack', h: 'ec6b1d1',
    title: "Your Soundtrack: simpler streak cards, details on tap",
    detail: "The Streaks chapter's cards now show just the number and a short label (\"Days with music\", \"Best streak of 2019\", \"Longest break\"). Tap a card to see its details (dates, rank, the record it beat, the song you played most, how it compares with the year before) in a panel under the cards, with its days lit up on the calendar. When the year's best streak is also your all-time record, the two cards are now one, marked \"Best of 2017 too\". Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'feature', a: 'soundtrack', h: 'b95d180',
    title: "Your Soundtrack: total days without music on the break card",
    detail: "The Longest Break Without Music card now also shows how many days you went without music across the whole year or month (for example, \"Total in 2017: 124 days without music\"). Also fixed: in the current year the Days You Listened card counted one day too many, and it could round up to 100% even with a day missed. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'feature', a: 'soundtrack', h: '0eaeca3',
    title: "Your Soundtrack: a calendar and more facts in Listening Streaks",
    detail: "The Streaks chapter now has a calendar of every day of the year (or month), brighter the more you played, with your three longest streaks in their own colours and your longest break marked. A new card shows your Longest Break Without Music. The cards now say where the streak ranks among all of yours, which old record it beat, the song you played most during it, and how many more or fewer days you listened than the year or month before. Chips show whether you had music every week, month or year. The artist, album and song cards open their page when clicked. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'change', a: 'soundtrack', h: 'bc1de22',
    title: "Your Soundtrack: clearer wording on the Listening Streaks cards",
    detail: "The Streaks chapter's cards now read at a glance: \"Days You Listened in 2017\", \"Longest Daily Listening Streak Ever\" (on past years and months it adds \"as it stood at the end of\" that period), \"Longest Daily Listening Streak in 2017\", and \"days in a row\" instead of \"days of streak\". The artist, album and song row is now headed \"Most days in a row with one artist, album or song\". Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'fix', a: 'soundtrack', h: '696ab4b',
    title: "Your Soundtrack: longest streak ever as of the year you're viewing",
    detail: "In the Streaks chapter of Your Soundtrack, the Longest Streak Ever card now only counts days up to the end of the year or month you're viewing, so 2019 shows the record as it stood at the end of 2019. A streak still going only counts when the period reaches today. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'design', a: 'soundtrack', h: 'ce5be05',
    title: "Your Soundtrack: more album covers on the year banner",
    detail: "The Chapter 1 banner in Your Soundtrack now shows many more album covers: the tiles are smaller, the grid reaches further left with fewer gaps, and up to 96 different albums fit before any repeats. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'feature', a: 'soundtrack', h: 'a6e9995',
    title: "Your Soundtrack: a richer pop-up for new discoveries",
    detail: "Clicking a New Discoveries bubble in Your Soundtrack now opens a new-look pop-up. You can play a sample, search the artist, each song and each album on Spotify or YouTube, and save a share card. It also shows your next goal (plays to reach the next top spot), a chart of your plays since you found them, album covers, how you found them (your first play and what you played just before), and similar artists, split into ones you already love and ones that are new to you. The arrows at the top, or the ← → keys, go to the next or previous discovery. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'feature', a: 'soundtrack', h: '0af6697',
    title: "Your Soundtrack: pick a year or month straight away",
    detail: "In Your Soundtrack you can now click the year between the arrows to open a list of every year you have plays in and jump straight to one, like on Awards. In Month view it shows the 12 months, with arrows at the top to change the year. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'feature', a: 'soundtrack', h: '81c6004',
    title: "Your Soundtrack: Top Albums, and Top Singles and EPs",
    detail: "Your Soundtrack's top-songs chapter now has a Top Albums carousel too, after Top Songs and Top Artists, with up to 50 albums for the year, month or All-Time. It counts albums the same way your albums chart does. If you show singles or EPs on their own in Settings → Charts, they get their own Top Singles and Top EPs carousels and stay out of Top Albums. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'design', a: 'soundtrack', h: '8e2ccb3',
    title: "Your Soundtrack: the big #1 artist photo is back",
    detail: "The #1 artist chapter in Your Soundtrack opens with a big, full-strength photo of the artist again, with their name at the bottom of it, instead of a dimmed strip. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'design', a: 'soundtrack', h: '17356fe',
    title: "Your Soundtrack: your year's albums behind the year",
    detail: "The first chapter of Your Soundtrack now shows the albums you played most that year (or month) behind the big year: a tight grid of covers on the right that comes apart toward the left, the covers drifting, turning and fading away around the year. The covers dissolve in when the page opens, unless your device is set to reduce motion. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'i18n', a: 'soundtrack', h: '56a30c4',
    title: "Your Soundtrack: the new chapters in your language",
    detail: "Changing the language while Your Soundtrack is open now redraws the whole page at once, chapter headlines included, and an open Play your year story stays on the screen you were on. A few bits that stayed in English are translated too: the plays-per-day note under Plays (“~180/day”), and the peak listening hour, which reads 17:00 in Spanish and Portuguese instead of 5 PM. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'feature', a: 'soundtrack', h: '1beb813',
    title: "Your Soundtrack: play your year as a story",
    detail: "A new Play your 2026 button at the top of Your Soundtrack opens your year full screen, one chapter at a time, like a story: the year and its five big numbers, your #1 artist, your song of the year, your loudest month, your discoveries, milestones and streaks, each with its picture. Tap or click to go on, tap the left side to go back, or use the arrow keys; bars at the top show how far along you are, and ✕ or Esc takes you back to the page. It works for a month and for All-Time too. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'design', a: 'soundtrack', h: '70a7c94',
    title: "Your Soundtrack: line icons and a tidier ending",
    detail: "Your Soundtrack swaps its emoji for simple line icons that match the rest of the site: in the Monthly Activity notes, the milestones, the streak records, the New Record badge and the award ribbons, and the little flame after every streak is gone. The end of the page is tidier too. Chart History Replay and Share now have their button right in their chapter's headline instead of alone underneath. If none of your top artists has won one of your own awards yet, that part is a single line with an Open Awards button instead of a big empty chapter. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'design', a: 'soundtrack', h: 'f2026c4',
    title: "Your Soundtrack: swipe through rotation and streak records",
    detail: "Two of the longest parts of Your Soundtrack are now rows you swipe sideways, so the page is much shorter on a phone. Still in Rotation shows each returning artist with their top five songs as a card in one row, and the artist, album and song streak records are compact cards with a small cover next to the numbers, instead of a full-size photo each. On a computer, arrows at the ends of a row move it along. On a phone, the three streak cards above the records sit two across with the third underneath, so their dates fit. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'design', a: 'soundtrack', h: 'a7759c5',
    title: "Your Soundtrack: a clearer #1 artist",
    detail: "The #1 artist chapter in Your Soundtrack is easier to read. Under the artist's photo and name, the standout number comes first and big: how many of their songs you played in a row. Next to it, your favourite album and song now show with their covers. Everything else (most played day, day streak, days played, songs, albums, plays per day, peak hour) sits underneath in one tidy row of small numbers, instead of eleven boxes of different sizes. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'design', a: 'soundtrack', h: 'bebce11',
    title: "Your Soundtrack reads like a story now",
    detail: "Your Soundtrack is no longer a stack of look-alike boxes. Each part is now a numbered chapter that opens with one big line about your listening, with a picture from that chapter behind it: “April was your loudest month”, “808 artists you had never played”, “You passed 200,000 plays”, “210 days in a row”. Everything the page showed before is still there, right under each headline: the five tiles and the reel, the Top Songs and Top Artists carousels, the month bars, the loyalty ring, the discovery bubbles, every milestone and streak. The tiles have simple line icons instead of emoji, and on a phone the play count gets the full width so it's never cut off. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'design', a: 'soundtrack', h: '876eec4',
    title: "Your Soundtrack: a proper title and one toolbar",
    detail: "Your Soundtrack now opens with the same page title as Records, Stats, Events and Awards, with its music note, instead of a small label. Under it sits one toolbar: Year / Month / All-Time, the year or month between two clear arrows, and on the right Chart History Replay and Share, so you no longer have to scroll to the bottom for them. Chart History Replay takes you to the replay and starts it; it shows in the Year view, where the replay is. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'fix', a: 'soundtrack', h: 'c37dc68',
    title: "Your Soundtrack: month numbers, bubbles and dates",
    detail: "Three small fixes on Your Soundtrack. On a phone, Monthly Activity's play counts no longer run into each other (“4,5114,040…”): each month keeps room for its number and the chart slides sideways. New Discoveries bubbles show the artist's initials until their picture arrives, so none is an empty circle. Milestone and streak dates are written in words, like 11 Feb 2026, the same as Records and Events. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-25', t: 'i18n', a: 'awards', h: '82e246b',
    title: "Awards: the whole page in your language",
    detail: "The Awards page now speaks Spanish and Portuguese all the way through. Before, changing the language left the category cards, the Configure Year list and an open ceremony in the old language, and a lot stayed in English anyway: Stats & records, play counts like “94 summer plays”, the nominee picker, the ceremony’s buttons and the Real-Life Awards cards (“Held 2026 · honouring 2025 releases”, “Won”, “Nominated”). All of it now follows your language and switches the moment you change it. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-24', t: 'design', a: 'awards', h: '27bd706',
    title: "Real-Life Awards: shorter cards for one or two nominations",
    detail: "In Real-Life Awards, an artist with just one or two nominations now gets a small square photo, so their card is only as tall as its rows instead of a big, mostly empty box. Category names also read naturally now, “Song of the Year” instead of “Song Of The Year”. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-24', t: 'design', a: 'awards', h: '23ba275',
    title: "Awards: a bigger moment for the winner",
    detail: "When you open the envelope in the awards ceremony, the winner now takes the stage: a big cover with a gold ring and glow, the name in large letters, and the other nominees shrinking to a small dimmed row underneath. Before, the winner showed twice, once in the grid and again below it. If your device is set to reduce motion, the winner simply appears, with no confetti or animation. Works with Last.fm, Google Sheets and CSV uploads, and in shared ceremony links." },
  { d: '2026-10-24', t: 'design', a: 'awards', h: '721d082',
    title: "Awards: the ceremony fills the screen",
    detail: "The awards ceremony is no longer a box in the middle of the page. It now fills the whole screen like a real show: the category name in big letters, bigger covers for the nominees, and a slim bar at the top with progress dots, sound and close. The list of categories opens from a Categories button instead of taking up a column, and Previous / Next sit in their own bar at the bottom so they never cover anything. On a phone, everything up to Open Envelope fits on the screen without scrolling. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-24', t: 'design', a: 'awards', h: '8333397',
    title: "Awards: a neater nominee picker",
    detail: "Rows in the Awards nominee picker are now one tidy line each: the song name with the artist and year underneath, then the genres, fit, plays and play buttons. Genres show two at a time with “+1” or “+2” for the rest (hover to see them) instead of stacking into tall rows. A stray “-” chip is gone: it was an empty genre cell from Google Sheets showing as a genre. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-24', t: 'fix', a: 'awards', h: '5a1964b',
    title: "Awards: an easier category list in Configure Year",
    detail: "In Configure Year, each category’s name now gets the full width of its card, with the type label and star on a small row underneath, so names like “Song of the Year” no longer break over three lines. The list is part of the page instead of a small box with its own scroll bar, and the search and filters fit on one row. Also fixed: clicking a category card (rather than its switch) did nothing; now a click anywhere on the card turns it on or off. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-24', t: 'design', a: 'awards', h: '3e2c312',
    title: "Awards: a tidier ballot",
    detail: "The bar above your Awards ballot now fits on one row: Expand all and Collapse all became small icons (hover for their names). “Click a nominee to crown the winner” is said once under that bar instead of on every card. Each card’s type (Song, Album, Artist) now shows in your language as a small capital label, and categories with no nominees yet are short cards with one quiet line instead of a big dashed box. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-24', t: 'design', a: 'awards', h: 'f5b271d',
    title: "Awards: Stats & records folds out of the way",
    detail: "Stats & records above your ballot used to take most of a screen before you reached your categories. It now folds into one row with the year’s numbers and who has the most nominations, plus an Open button. Open it for the full block, exactly as before; the page remembers whether you left it open. The ceremony’s opening and closing screens still show everything. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-24', t: 'design', a: 'awards', h: '066202c',
    title: "Awards: a proper title, and View Ceremony at the top",
    detail: "The Awards page now has the same title as Records, Stats and Events, with a line trophy in place of the small white “Awards” tag. Once any category has a winner, View Ceremony and Share appear right next to the year at the top, so you no longer have to scroll past every card to find them; they also stay at the bottom. Both buttons got line icons in place of the 🎬 and 🔗 emoji. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-24', t: 'fix', a: 'awards', h: 'c0da69b',
    title: "Awards: names no longer disappear in Spotlight",
    detail: "In the Awards Spotlight view, Best Collaboration rows showed “173 plays · with a DJ/producer” where the song name should be: the long note pushed the name out of the row. The note now sits on its own line under the artist, and the play count stays next to the name. In the nominee picker, a long artist line now shortens with “…” instead of pushing the play buttons out of the row. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'i18n', a: 'events', h: '964d211',
    title: "Events: the whole page in your language",
    detail: "The Events page now speaks Spanish and Portuguese all the way through. Before, a lot of it stayed in English: “in 3 days”, “Turning 41”, “5th Anniversary”, the table and list headings, the calendar’s month and day names, and the loading and status lines. All of it now follows your language and switches the moment you change it. The Time Machine’s heading also lost its emoji and capitals to match the rest of the page. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'design', a: 'events', h: '886a8ad',
    title: "Events: a calmer calendar, and a click on a day opens its list",
    detail: "The Calendar tab on the Events page now opens on the month. Each day shows its first three events with a small line icon for the type (birthday, album, single, EP, show) instead of coloured rows and emoji, and the rest sit behind “+N more”. Click a day, its number or “+N more” to open that day's list, laid out like Today: birthdays, releases and shows first, then the day's anniversaries ranked by how much you've played them, eight at first with a button to see the rest. On a phone the month shows just the icons and short day names, so all seven columns fit. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'design', a: 'events', h: 'c1821e5',
    title: "Events: Recent is one list, by how long ago",
    detail: "Recent on the Events page is now one list instead of three sections, built like Coming up: your top artists' birthdays, anniversaries and new releases from the past weeks together, in three groups — Past week, Past few weeks and Earlier — newest first. Each group shows its eight most-played anniversaries first, with a button to see the rest. New releases now have their own + to add them to a playlist, and + Playlist and Play all take everything the tab shows. New Music Friday is still underneath. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'design', a: 'events', h: 'f26d2b0',
    title: "Events: Coming up is one list, by how soon",
    detail: "Coming up on the Events page is now one list instead of five sections: your top artists' birthdays, anniversaries, releases and shows together, in three groups — This week, Next few weeks and Later — and in date order inside each. Each group shows its eight most-played anniversaries first, with a button to see the rest. New Music Friday moved to Recent, since its releases are already out. In the List view on a phone, the title and artist no longer disappear when the type line is long. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'feature', a: 'events', h: '02223cb',
    title: "Events: Today shows what's happening today, and Play all is back",
    detail: "The Today tab now opens with today's date and what's happening: your top artists' birthdays, releases and shows first, then the day's anniversaries. Anniversaries are ranked so the ones that matter come first: the releases you've played most lead, a round one (5th, 10th, 20th…) moves ahead of others you've played about as much, and each card says how many times you've played it. Eight show at first, and Show all opens the rest, so a day with fifty anniversaries no longer fills the page. The Time Machine is still underneath. Play all is back next to + Playlist: it plays what the open tab shows in the music player, the first song now and the rest in the queue. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'design', a: 'events', h: '635da41',
    title: "Events: one card style, one view switch, one playlist button",
    detail: "Every event on the Events page — birthdays, anniversaries, releases, New Music Friday and shows — now uses the same card: the picture, the date, the title, the artist and the type with a small icon. Reel, Tiles, Table and List are one switch for the whole page instead of one per section, and the view you picked before carries over. New Music Friday's calendar of past weeks opens from its Past Fridays button. Sections no longer fold away, so nothing is hidden behind a +. One + Playlist button saves what the open tab shows: on Today and Calendar, the events on the calendar. It replaces each section's own button and the calendar's Play All, Create Playlist and Export Playlist; the playlist it makes plays from Playlists. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'design', a: 'events', h: '675c2d2',
    title: "Events has four tabs: Today, Coming up, Recent and Calendar",
    detail: "The Events page now opens on Today: what's happening today, with the Time Machine under it. Coming up has birthdays, anniversaries, upcoming releases, New Music Friday and shows; Recent has the ones that just happened; Calendar has the month, week and day calendar. The page remembers the tab you last used. The title is now plain \"Events\", the type buttons have small icons instead of emoji, and one refresh button in the corner updates everything on the page. The list summary is behind the ⓘ button, and how many top artists to include is chosen in Settings. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'fix', a: 'events', h: '3bd73c1',
    title: "Events: birthdays and anniversaries on the right day",
    detail: "Events keeps its list for up to a day, and a list fetched yesterday put every birthday and anniversary one day late (a birthday from yesterday showed as today). The days are now worked out again each time the page opens, so yesterday's birthday shows as 1 day ago and moves to the recent list. A release whose date has passed moves from upcoming to recent. An anniversary in early January counts the right number of years. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'fix', a: 'events', h: '3bd73c1',
    title: "New Music Friday shows new releases again",
    detail: "New Music Friday showed 0 releases because Deezer stopped filling the list it came from. It now also reads Deezer's editorial picks from the last 30 days and looks up each album's release date, so the section has new releases again. There are fewer than before while Deezer's own list stays empty. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'fix', a: 'ui', h: '5c2a5d8',
    title: "Song and album windows in your language",
    detail: "The windows that open when you click a song or an album now follow the language you picked. Before, most of them stayed in English: the stats (total plays, first and last played, streaks, records), Chart Peaks, Chart Records, the Chart Accomplishments list, Listening Pattern, the album's track sorting and track stats, the certification plaques and the rating box. Also fixed: Raw Data is no longer in capitals in the Spanish More menu, the top bar fits the smallest phones, and on those phones the Raw Data search boxes show short hints that are not cut off. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'fix', a: 'rawdata', h: 'd4381cb',
    title: "Raw Data: one play is counted as one play",
    detail: "When a song, album or search has exactly one play, Raw Data and the play history in song and album windows now say 1 play in total instead of 1 total plays, in every language. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'fix', a: 'rawdata', h: '72edf0f',
    title: "Play history fits on phones in every language",
    detail: "On a phone, the play history table in song and album windows, and the Raw Data page on the smallest phones, could be wider than the screen, so you had to slide sideways to see the artist. This happened mostly in Spanish and Portuguese, where the column names are longer. Column names now wrap onto two lines when there is no room, and the whole table fits the screen. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'design', a: 'rawdata', h: 'f7f27f5',
    title: "Song, album and artist panels: the Raw data tab matches the Raw Data page",
    detail: "The Raw data tab you can open under a song, album or artist on the charts now looks like the Raw Data page: shaded every other row, quiet dates, and column names that stay at the top while you scroll through the list. Its column names, search box, play count and messages now follow your language instead of always showing English. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'feature', a: 'rawdata', h: 'aa08d4f',
    title: "Raw Data: page buttons at the top, jump to a page, rows per page",
    detail: "Raw Data now has page buttons above the table as well as below it, so you no longer have to scroll to the bottom to turn the page. Next to Previous and Next there are buttons for the first and last page, and a box where you can type a page number and press Enter to jump straight to it. Rows per page lets you show 50, 100, 200 or 500 plays at a time, and it is remembered next time. Using the buttons at the bottom takes you back to the top of the new page. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'design', a: 'rawdata', h: '0494690',
    title: "Raw Data: calmer rows, edit button on hover",
    detail: "The play list on Raw Data is easier on the eyes. Rows are a little taller and every other row is shaded instead of having a line under each one. Song titles stand out, artists are a step quieter, and dates and albums are quieter still, in plain text colours instead of blue that looked like links. The edit button is now a small pencil that shows when you point at a row (on a phone it is always there). Plays changed by your auto-correct rules keep their mark, now on phones too. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'design', a: 'rawdata', h: '1e5e385',
    title: "Raw Data: the search boxes and column names stay in view",
    detail: "On Raw Data the search boxes and the column names (Date & Time, Song Title, Artist, Album) now stay at the top of the screen while you scroll through your plays, so you always know which column is which and can change a search without scrolling back up. On a phone only the column names stay, so the plays keep most of the screen. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'design', a: 'rawdata', h: '58a4260',
    title: 'Raw Data: a tidier top of the page',
    detail: "The top of Raw Data is calmer. The title now reads Raw Data, like the tab. The four search boxes sit on one row (two by two on a phone) without the labels that repeated what the boxes already say, so the plays start much higher on the page, especially on a phone. Under the boxes one line shows how many plays you have or how many match, then Corrected only, Clear (only while a search is on) and Auto-correct rules. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'fix', a: 'graphs', h: '903542a',
    title: "Stats in your language, and a heatmap made for light themes",
    detail: "Everything on Stats now follows the language you picked: the heatmap and its pop-up, month and day names, the race's Play and Pause button, the New Discoveries legend and the whole My Ratings card. Month and day names on the heatmaps in song, album and artist windows and on Streaks follow it too. On light themes the heatmap now runs from light to dark, so days with no plays match the page instead of showing as dark squares, and the busiest days stand out. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'design', a: 'graphs', h: 'b771080',
    title: "Stats: the heatmap shows one year at a time",
    detail: "The listening heatmap on Stats now shows one year across the whole card instead of stacking every year down the page. It opens on this year; use ‹ and › (or the arrow keys) to step through the years, or click one of the small year thumbnails underneath, which show the shape of every year at a glance. The year's plays, best day, top artist and new artists sit next to the year. Listening Patterns now follow the year you are looking at, with an All time switch if you want your whole history. On a phone the year scrolls sideways and opens at the latest month. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'design', a: 'graphs', h: '0815495',
    title: "Stats: ratings chart shaded by score",
    detail: "The score chart under My Ratings uses one colour, your theme's, and shades it by score: low scores are faint and the top scores are the full colour, so you can see at a glance where most of your ratings sit. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-23', t: 'design', a: 'graphs', h: '8e9636e',
    title: "Stats: calmer charts with steady colours",
    detail: "The Stats charts are quieter: no vertical gridlines, faint horizontal ones and softer axis text that stays readable on every theme. Comparisons use a fixed set of eight colours, picked so neighbouring artists stay easy to tell apart, also for colour-blind readers, with a version tuned for light themes. A chart with one artist uses your theme's colour. In the Play Count Race the rank boxes are plain, so only the bars carry colour. Changing the theme now recolours the charts straight away. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'graphs', h: 'bf40312',
    title: "Stats: chart buttons tucked into the corner",
    detail: "The Labels and Reset zoom buttons on the Stats charts are now two small icons in each chart's top-right corner, so the charts start right under their titles. Point at an icon to see what it does; the labels icon stays lit while labels are on. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'graphs', h: 'ffeab6d',
    title: "Stats: one date range for the whole page",
    detail: "The Stats tab now has one bar at the top with Daily / Monthly / Yearly and the date range: quick buttons for the last 12 months, 3 years or everything, plus two date boxes for any other stretch. Every chart follows it, so the separate date boxes and Reset buttons on each chart are gone. It starts on the last 12 months, so a long history no longer draws a flat line with a spike at the end. The Play Count Race keeps its own range, starting at your first play. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'records', h: '9271948',
    title: "Perfect All Kill explained, and a shorter plaque wall",
    detail: "Perfect All Kill now has a \"What's a Perfect All Kill?\" button that explains the name. Its list shows which Perfect All Kill each one was, and the artist's own count, as plain text instead of coloured labels. The certifications wall shows its first 24 plaques with a Show more button under them, instead of every plaque at once. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'records', h: '0e7cd9b',
    title: "Fastest to Milestone has a picker",
    detail: "Fastest to Milestone showed the first play total open and every higher one as a folded bar. Now you pick the total from one menu, as in \"Fastest to 100 plays\", and only that table shows. Records remembers your pick for songs, artists and albums. A search still looks through every total. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'records', h: '47149ac',
    title: "All #1s and Appearances: one table at a time",
    detail: "All #1s and Most Chart Appearances showed two tables for every period, one counting the total and one counting the longest run in a row. Now there is one table with a Total / In a row switch above it, and Records remembers which one you picked. A search still looks through both. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'records', h: 'f357296',
    title: "Calmer Records tables",
    detail: "Dates in Records tables are now plain text. They still open that week's chart, and underline when you point at them. The music-note and disc icons in front of song and album titles are gone, since the column already says what it is. The 25 / 50 / 100 / All control now sits on the heading line of the section it changes. Also fixed: in Perfect All Kill, the Most recent column sat out of line with the rest of its row. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'records', h: 'b5ccf38',
    title: "Records Overview: one card per record",
    detail: "Records Overview used to show up to 26 cards, because most records had a separate card for weekly, monthly and yearly. Now each record has one card, with its own Weekly / Monthly / Yearly switch underneath, and each card remembers the period you picked. The cards are in the same two groups as the side menu. The row of cards under the most decorated artist fades out more softly at the edges. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'records', h: 'd2973b9',
    title: "Records has a side menu",
    detail: "The two rows of Records sub-tabs are now a menu down the left side of the page that stays in view while you scroll. It is split into Chart records and Play records, and each item shows how many record lists it holds. On wide screens the Records page gets a little wider, so the tables keep their full width. On phones and tablets the sub-tabs are one Section dropdown that shows where you are. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'records', h: 'f0240e9',
    title: "A calmer top of the Records page",
    detail: "The big Weekly / Monthly / Yearly box at the top of Records is now one small line under the title, so the sub-tabs and your records come up sooner. Rating Records no longer repeats at the bottom (and on some sub-tabs the top) of every Records page: it now lives on Overview, under the record cards, with simple icons in place of the emoji. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'fix', a: 'records', h: '0147742',
    title: "Weekly, Monthly and Yearly tabs in Records look right again",
    detail: "In Perfect All Kill and a few other Records sections, the Weekly / Monthly / Yearly tabs showed up as plain grey browser buttons after the tab restyle. They now use the same tabs as the rest of Records. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'fix', a: 'ui', h: '2fcb820',
    title: "Every button uses the site's font",
    detail: "A few buttons, like the Charts Guide's Take the tour and Search buttons, the design picker in Share as image, N/A in the rating window and the picture source badges, were drawn in your device's system font instead of the site's. They now match the text around them. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'feature', a: 'charts', h: '5176b01',
    title: "Two more places to find missing pictures",
    detail: "When Deezer, iTunes and Last.fm all have no picture for a song or album, the site now also looks in the Cover Art Archive, which is strong on small and older releases. For an artist with no photo, it looks on the artist's Wikipedia page. These lookups only happen for the rare item the first three don't have, so everything else loads as fast as before. Anything still missing shows its initials, and you can always set a picture yourself with \u270e. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'ui', h: 'e518b2f',
    title: "Every pop-up window has the same frame and close button",
    detail: "All pop-up windows (song, album and artist windows, ratings, streaks, Share as image, Settings, playlists, What's New and the rest) now share one frame, and each closes with the same \u2715 button in the corner instead of a mix of \"\u2715 CLOSE\" labels and round buttons. In confirm windows, Cancel is a normal button and the action that deletes something is in red. On phones, each chart's \u22ee menu now opens just above the bottom tab bar instead of underneath it. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'feature', a: 'records', h: '511a642',
    title: "The Records reel can be dragged like every other reel",
    detail: "The moving reel of record cards on the Records overview, and the same reel in an artist's window, now works like the Time Machine, Soundtrack and Events reels: grab it and drag, use the trackpad or the keyboard, and it stays still if your device asks for reduced motion. The Awards poster reel's arrows are now the site's small square buttons. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'records', h: 'f530656',
    title: "Tables in Records, Raw Data and Events match",
    detail: "The tables in Records, Raw Data, the Events table view and the song, album and artist windows now share one header style, the same cell spacing and the same row lines and hover highlight. Records keeps its framed tables with headers that stay in view as you scroll. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'ui', h: 'd82b8f9',
    title: "Cards and panels share one look",
    detail: "Panels across the site, like the Stats graphs, the Charts Guide, the Records overview and your playlists, now share one card style, and cards that sit inside another panel (event cards, Time Machine, Awards categories, the welcome window's tiles) are one shade darker so they read as nested. The \"Of the moment\" cards keep their look. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'ui', h: '4c904e5',
    title: "Filter chips and small tags match across the site",
    detail: "The filter chips on Events (Birthdays, Albums, Singles\u2026), the Awards category groups and the community board now look the same, with the ones that are on tinted in the theme colour. Small labels like streak counts, genre tags and the Awards \"Auto\" tag share one quiet style too. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'ui', h: '3aedb54',
    title: "Tabs look the same everywhere, and the \u22ee menu speaks your language",
    detail: "Tabs now share one style, a line under the open tab: in Records (Weekly, Monthly, Yearly), Awards, the streaks window, the album rating window and the chart run share window. Records' small Songs / Artists / Albums switches use the same switch as the rest of the site. The Show, Size and Actions tabs in each chart's \u22ee menu were always in English; they're now translated. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'ui', h: '2902bd8',
    title: "Every \"pick one\" switch looks the same",
    detail: "Switches where you pick one option, like Reel / Tiles / Table / List on Events, Month / Week / Day, the Stats graph periods, the chart race speed and Top N, the ratings sort, the Streaks types and the options in every Share as image window, now all use the same tray as the Songs / Artists / Albums switch, with the chosen option lit in the theme colour. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'fix', a: 'rawdata', h: '8d05fda',
    title: "Raw Data no longer opens with another page underneath",
    detail: "Opening Raw Data after Stats, Events or Awards left that page on screen under your play history, and Stats and Records could still show Awards below them. Each tab now shows only its own page. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'ui', h: '8d05fda',
    title: "Every button outside the charts now looks the same",
    detail: "The last buttons moved to the site's shared button: Settings (Last.fm Connect, and Disconnect in red), Raw Data, the welcome window, the tour, the Charts Guide, the picture picker, the community board and Contact Support. The fold buttons on Records and Events sections are now small square buttons that are easier to tap. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'player', h: 'e379e84',
    title: "Player queue buttons match the rest of the site",
    detail: "The buttons in the music player's queue (Now, Next, + Queue, Queue all, Move to top, Undo and Save) and the YouTube buttons in the streaks window now share the site's button look and size. Delete in the queue is red so it's harder to hit by mistake. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'awards', h: 'd7d4612',
    title: "Awards buttons match the rest of the site",
    detail: "On the Awards page, the year arrows, Configure Year, Generate Nominees, Enable All and Disable All, each category's Pick nominees, Change and Playlist buttons, the ceremony's Share button and the nominee picker's buttons now share one look and size, with Generate Nominees as the bold main button. The gold View Ceremony button keeps its look. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'graphs', h: '8f575ea',
    title: "Stats, ratings and streaks buttons match the rest of the site",
    detail: "On the Stats page, each graph's Reset, Labels and Reset Zoom buttons and the chart race controls now share one look and size, with + Add and Play as the bold main button. In the rating window, Done is the main button and Clear rating is red. The ratings scan, your rated library and the streaks window use the same buttons too. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'fix', a: 'charts', h: '5c50621',
    title: "The Around the chart box only shows on chart pages",
    detail: "The Around the chart box (Bubbling Under, Off the Chart and New Entries) stayed at the top of the page when you switched to Stats, Records, Events, Awards, Your Soundtrack, Playlists and other tabs. It now only appears with the charts. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'events', h: '7194477',
    title: "Events and Playlists buttons match the rest of the site",
    detail: "The buttons on the Events page (Refresh, the calendar arrows, Play All, Create Playlist, Export Playlist and the add-to-playlist buttons on each section) and on the Playlists page now share one look and size. On Playlists, Resume is the one bold button, and Delete and Remove are in red so they're harder to hit by mistake. The Create Playlist and Printable PDF windows and the awards ceremony's share-link panel each have one clear main button. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'share', h: '62d1dbc',
    title: "Share as image windows have clearer buttons",
    detail: "In every Share as image window (charts, chart runs, stats cards, ratings, records, streaks and the Daily calendar), Download Image is now the one bold button and Copy and Share sit next to it in a quieter style, all the same height. On phones, Download Image gets its own full-width row with Cancel, Copy and Share below it, instead of four squeezed buttons with wrapped text. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'ui', h: '2dd424e',
    title: "Corners and shadows match across the site",
    detail: "Buttons, cards, tags and pop-up windows outside the charts now use the same five corner sizes instead of nineteen slightly different ones, and their shadows come in three standard depths. On light themes those shadows are softer, so cards no longer look smudged. Pill-shaped buttons stay fully round, and the charts keep exactly the look they had. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'fix', a: 'charts', h: 'f6bc35c',
    title: "Charts fit the screen on tablets and small phones",
    detail: "On screens between about 600 and 980 pixels wide, like a tablet or a small laptop window, the whole page could slide sideways because the Filmstrip and the certification reel stretched it. Those strips now scroll inside their own box and the page stays put. On the smallest phones (about 330 pixels) the top bar's buttons are a little slimmer so Sign in fits, the page buttons under Yearly and All-Time charts put the page number on its own line instead of spilling off the edge, and on Daily the Compare with buttons and the part-of-day cards no longer run off the screen in Spanish and Portuguese. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'design', a: 'guide', h: 'b249867',
    title: "The welcome window shows how charts work and lets you jump straight in",
    detail: "The window you see on your first visit now opens with a small example chart that moves every few seconds, so you can see songs climb, fall and debut before you start. Under it, six shortcuts open Weekly, Records, Awards, Your Soundtrack, Graphs or All-Time straight away, and the tour is one click away. If you're trying the live demo, the window says so, explains that nothing is saved, and has a button to switch to your own listening. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'fix', a: 'share', h: 'd93bf92',
    title: "Up, down and new tags are easy to read on the Grid picture",
    detail: "On a shared Grid picture the movement tags sat on a faint see-through pill, so they disappeared on busy cover art. They now sit on a solid pill, a little bigger, and stay readable on any cover. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'feature', a: 'charts', h: 'd526475',
    title: "Animate Chart replays your plays one by one, in every layout",
    detail: "Animate Chart now starts on the previous chart and goes through your plays one at a time, dropping the oldest one or adding the next, until it reaches the chart you're looking at. Play counts, ranks, the up and down arrows and the gold, silver and bronze top 3 all change as it goes, and an entry slides past the one it overtakes. Covers load before anything moves. You can pause, change the speed (½× to 20×), step one play or one day back or forward (one hour on Daily), drag the slider, click a day on the strip, or use the keyboard, and a small control stays at the bottom of the screen when you scroll down a long chart. It works the same in all six layouts, on Daily, Weekly and Monthly, for Songs, Artists and Albums. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'feature', a: 'player', h: '39dccca',
    title: "Videos in the player and awards no longer depend on YouTube search alone",
    detail: "YouTube only allows the whole site about 100 song searches a day. Before using one, the player now looks the song up in Wikidata and MusicBrainz, two free music databases that store the official YouTube video for many songs, and plays that. It works for the ▶ player, the awards video previews and the player's search box, where these matches are listed first with a \"Not here? Search YouTube\" link under them. Because it doesn't use the daily limit, it works when you're signed out too. Works with Last.fm, Google Sheets and CSV uploads." },
  { d: '2026-10-22', t: 'fix', a: 'charts', h: '071cc3b',
    title: "Listening streak shows again",
    detail: "Folding the All-Time stats card into the banner also switched off the Listening streak at the end of the now strip, along with the row under it (top streaks, longest going). Both show again on every chart tab." },


  { d: '2026-10-21', t: 'feature', a: 'charts', h: '0c25610',
    title: "Travel back in time on the All-Time chart",
    detail: "All-Time can now show how your charts looked on any earlier day. Use the arrows next to the date to step back or forward a month at a time, or tap the date to pick any day from your first play to today. The charts, the stats banner, the plays-by-year strip and the Top N insights then count only the plays up to that day. Step forward to today (or pick today) to see everything again. Works with Last.fm, Google Sheets and CSV uploads." },

  { d: '2026-10-21', t: 'design', a: 'charts',
    title: "The All-Time collage follows the chart you're looking at",
    detail: "On All-Time, the picture collage behind the stats banner now matches the chart under it: Songs shows your top songs' covers, Artists your top artists' photos, and Albums your top albums. If you keep singles or EPs apart from albums, the Albums / Singles / EPs / All buttons change the collage too. The other periods keep showing album covers. Works with Last.fm, Google Sheets and CSV uploads." },

  { d: '2026-10-21', t: 'design', a: 'charts',
    title: "All-Time's stats card is now part of the stats banner",
    detail: "On All-Time, the separate card above the stats banner (total plays, days listened, plays per day and top artist) is gone, and nothing went with it: total plays and your top artist were already in the banner, and days listened and plays per day are now the small stats under Total Plays, where the other periods show their best day. Tap days listened to jump to your listening heatmap, as before. Works with Last.fm, Google Sheets and CSV uploads." },

  { d: '2026-10-21', t: 'fix', a: 'share',
    title: "Shared images no longer squash non-square pictures",
    detail: "When a picture wasn't square, such as a YouTube thumbnail or some iTunes and Last.fm covers, the saved or shared image squeezed it into its box like an accordion, even though the preview looked right. Now each picture is cropped the same way the preview shows it, at full sharpness. Fixed on every Share button: charts, records, streaks, stats, ratings, awards and the Daily calendar card. Works with Last.fm, Google Sheets and CSV uploads." },

  { d: '2026-10-21', t: 'fix', a: 'charts',
    title: "The stats bars: your usual as the line, the record at the time",
    detail: "On Daily, Weekly, Monthly and Yearly, the line across the small bars on all four stats tiles now marks your usual day, week, month or year again (the middle of your recent ones: the last 90 days, 26 weeks, 12 months or 3 years you listened in, so it follows how you listen now, not years ago; the headline's \"more than usual\" uses the same number), so it moves instead of always sitting at the end. Under the bars you see both: your usual and the record as it stood for that period, the best one up to and including it. Looking back at an older week shows the record it was up against back then, not today's. The bars start folded away to keep the tiles compact: tap the small arrow at the bottom of any tile to open them on all four, and tap it again to fold them. Each bar now has its number at the end, so you can read this period and the last one without hovering (which phones can't do). The new songs, new artists and new albums counts at the bottom of the tiles get the same bars, usual and record too. Daily now works out the usual for songs, artists and albums too, not just plays. Works with Last.fm, Google Sheets and CSV uploads." },

  { d: '2026-10-21', t: 'feature', a: 'records',
    title: "Badges flip over, and a badge timeline",
    detail: "Tap an earned badge on the Streaks window's Records tab and it flips over to show when you earned it: the date, the time of the play that did it, and the artist, album or song (or several) behind it. A new Badge timeline under the badges lists every badge you've earned, newest first, by year, with the date and time and the music that earned each one. Tap \"Timeline\" on the back of a badge to jump to its entry. Works with Last.fm, Google Sheets and CSV uploads; for a sheet or file with dates but no times, only the date shows." },

  { d: '2026-10-20', t: 'feature', a: 'charts',
    title: "The stats banner on Daily too",
    detail: "The Daily tab now has the same banner around its stats: the day's #1 artist photo and a headline once the day is over, today's top album covers while it runs, bars against the comparison day, gold and silver record rings on every tile, pictures, plays by hour and Share. On every tab the line on the small bars now marks your current record instead of your usual, and the cover mosaic uses your top 18 albums." },

  { d: '2026-10-20', t: 'feature', a: 'charts',
    title: "A banner around the stats tiles",
    detail: "The four stats tiles on Weekly, Monthly, Yearly and All-Time now sit inside a big banner, like the one on Records. A finished week, month or year shows its #1 artist's photo and a line about how it went (\"your busiest week since March\"); the one still running shows a mosaic of its top album covers. The numbers count up slowly, each tile has two small bars (this time and last time) with a mark for your usual, and pictures of its new songs, top artists and top albums. Record tiles get a gold ring for an all-time peak or a silver one for a peak at the time. Under the tiles, plays by day: tap a day to open it on Daily. Share saves the whole banner as a picture. The plays per day figure is also fixed: a 7-day week was counted as 8 days." },

  { d: '2026-10-20', t: 'design', a: 'charts',
    title: "Tidier controls above the Daily chart",
    detail: "Compare with and the #1 chip now share one row, and the six actions sit in one full-width bar. On phones every row runs edge to edge, and the actions show as a 3 × 2 grid, so you no longer have to scroll sideways to find Calendar or the playlist buttons. The album filter and layout buttons line up full width on phones on every tab." },

  { d: '2026-10-20', t: 'design', a: 'charts',
    title: "New Artists icon",
    detail: "The Artists button above the chart and the Artists chart heading now show a person with a music note instead of a microphone, and so do the Songs / Artists / Albums pills in Records." },

  { d: '2026-10-20', t: 'design', a: 'charts',
    title: "Platinum badges spelled out again",
    detail: "The Platinum badge on chart entries says 💿 PLATINUM again instead of the short PLAT." },

  { d: '2026-10-20', t: 'design', a: 'charts',
    title: "Smaller tags in the Compact chart on phones",
    detail: "On phones the peak, certification and score tags in the Compact layout are now the same smaller size as in the Table, the ▲ BEST tag now sits under the play count (as in the Table) instead of with the tags, and every tag in a row is the same height (the 💎 diamond tag was shorter, with a tiny gem)." },

  { d: '2026-10-20', t: 'design', a: 'charts',
    title: "Rank and move together on phones",
    detail: "In the Table layout on phones the move (▲, ▼, NEW, RE) now sits under a slightly bigger rank number instead of in its own column, which leaves more room for the title and artist. The peak, certification and score tags are also a little smaller on phones." },

  { d: '2026-10-20', t: 'design', a: 'charts',
    title: "Table tags on their own line",
    detail: "In the Table layout the peak, certification and score tags now sit on their own line under the artist name, on desktop and phones, so the title line shows just the title." },

  { d: '2026-10-20', t: 'design', a: 'charts',
    title: "A tidier Compact chart on phones",
    detail: "In the Compact layout the song and artist now sit together on one line (Title · Artist), with the tags straight after them, on desktop and phones. On phones the move (▲, ▼, NEW, RE) sits under the rank number instead of in its own column, long names wrap onto the next line instead of being cut off, peak tags are a medal and the number (🏅 #3), and the Spotify icon is gone from each row (Search on Spotify is still in the ⋮ menu)." },

  { d: '2026-10-20', t: 'design', a: 'charts',
    title: "Platinum badges say PLAT",
    detail: "The Platinum badge on chart entries is shortened to 💿 PLAT, so it takes less room next to the names. Point at it (or hold it) to see \"Platinum\"." },

  { d: '2026-10-20', t: 'design', a: 'charts',
    title: "The plays peak tag says BEST",
    detail: "The tag for a song's, artist's or album's best week (or month, year) of plays now says ▲ BEST in every layout, on desktop and phones, instead of ▲ PLAYS PEAK or the hard-to-read ▲ PB. Point at it (or hold it) to see \"Plays peak\". On phones it is a slimmer tag so the word doesn't take room from the song names." },

  { d: '2026-10-20', t: 'design', a: 'charts',
    title: "A smaller plays peak tag in the Table",
    detail: "In the Table layout the ▲ PLAYS PEAK tag under the play count is now the same size as the Peak tags beside the title, instead of a big pill. When the Plays column is made too narrow for the words, it shows the short ▲ BEST instead of being cut off." },

  { d: '2026-10-20', t: 'fix', a: 'charts',
    title: "Rank and Move headers stay over their columns",
    detail: "In the Table layout, the Rank and Move columns could be dragged narrower than their own header, so the header spilled out to the right and no longer sat over the numbers (most visible in Spanish and Portuguese, where the words are longer). A column now stops at the width of its header in your language, and widths saved narrower than that are widened to fit." },

  { d: '2026-10-20', t: 'design', a: 'charts',
    title: "Table covers fill the row",
    detail: "In the Table layout of the songs, artists and albums charts, the cover now fills its row from top to bottom as a square without rounded corners, like in Off the Chart, and is a little bigger (64px, 52px on phones). A row made taller by a long title that wraps keeps the same square cover, centred in the row." },

  { d: '2026-10-20', t: 'design', a: 'charts',
    title: "Bubbling Under and New Entries covers fill the row",
    detail: "Covers in Bubbling Under and New Entries now fill their row from top to bottom and stay square, the same as in Off the Chart, and the three tabs have rows of the same height. On phones the cover fills the top of each card, and the tag line (Bubbling Under) or the row of day squares (New Entries) sits in a strip under it." },

  { d: '2026-10-20', t: 'fix', a: 'charts',
    title: "Around the chart: shorter wording on phones, a working tag guide",
    detail: "On phones Bubbling Under now says how far a song is from the chart in a few words (\"2 away\", \"faltan 2\" in Spanish), so long wording no longer squeezes the song, album and artist names. The \"ⓘ What the tags mean\" capsule opens and closes the list of tags with what each one means, which it didn't do before. It follows the BU legend switch in ⋮ → Show (switch off and the capsule is gone), and the Descriptions switch now hides the description lines in Bubbling Under, Off the Chart and New Entries too." },

  { d: '2026-10-20', t: 'design', a: 'charts',
    title: "Bubbling Under rows look like the chart",
    detail: "Bubbling Under rows are calmer: rank, cover, title and artist, then every tag on one plain line of words instead of coloured pills (Trending · 3 weeks · 3-week streak). The bar is gone; plays sit on the right with how many plays away from the chart it is under them, in gold when it is only 1 or 2 away. Spotify, ⋮ and the Bubbling Under history sit side by side, and every row is the same height. On phones Spotify and the history move into the ⋮ menu, and the tag line runs across the full width of the row." },

  { d: '2026-10-20', t: 'design', a: 'charts', h: 'f3b0e4c',
    title: "Bubbling Under, Off the Chart and New Entries share one box",
    detail: "Under each chart, Bubbling Under, Off the Chart and New Entries are now three tabs of one Around the chart box, which remembers the tab you last opened. Bubbling Under rows have covers (the 30-second sample on the corner, ✎ to change the picture) and a bar showing how close each one is to the chart; every tag is still there, under the bar, and the ⓘ explains them. Off the Chart rows have a cover that fills the row, last week's plays next to this week's, a label for how it left (Fell from the top 3, Long run ended, One-week visit…), when it was last played, and a link that jumps to its row in Bubbling Under; on phones each one is a small card. New Entries rows say where a new song reached on the chart, mark artists that are new to you too, show a small square for each day (week, month) you played it, point out your biggest debuts, and can be filtered to Made the chart or New artists." },

  { d: '2026-10-19', t: 'design', a: 'charts', h: '8c05a9e',
    title: "New icons in the ⋮ menu",
    detail: "The menu that opens from ⋮ (or a right-click) on any chart entry has a new set of matching line icons in place of the old symbols, and the real YouTube and Spotify logos on the two search items. The icon lights up with its label when you point at it." },

  { d: '2026-10-19', t: 'fix', a: 'charts', h: '51ea3ed',
    title: "The sample button is back beside Spotify and ⋮ on phones",
    detail: "On phones, Card grid, Filmstrip and the Bubbling Under, Off the Chart and New Entries lists hid the 30-second sample button and expected you to tap the cover. The button now shows next to Search on Spotify and ⋮ there too, as on a computer. Mosaic has it on the back of a tile; the table, Stack and Compact keep it on the corner of the cover." },

  { d: '2026-10-19', t: 'feature', a: 'charts', h: '7899764',
    title: "Choose pictures from every layout and in Share as Image",
    detail: "Every chart layout now lets you change an entry's picture: the ✎ on the cover (on Mosaic, on the back of a tile), press and hold on a phone, or ⋮ → Change image. The new picture shows straight away, everywhere the entry appears. The ⋮ menu also has Search on Spotify in every layout. In Share as Image, a new row under the artwork source shows a small tile for each entry on the card: click one to pick its picture and the card updates at once. Share images now use the pictures you picked instead of fetching their own." },

  { d: '2026-10-19', t: 'design', a: 'charts', h: 'd9c3659',
    title: "Spotify on every chart, and the sample button on the cover",
    detail: "Every chart layout now has a Search on Spotify button on each entry: the table, Compact, Mosaic (on the hover card and the back of a tile), and the Bubbling Under, Off the Chart and New Entries lists, as Stack, Card grid and Filmstrip already had. In the table, Stack and Compact, the button that plays a 30-second sample now sits on the corner of the cover. It shows when you point at the row, and on a phone it is always there. The table's plays column has no bar any more: just the plays, with the change since last time under them." },

  { d: '2026-10-19', t: 'design', a: 'charts', h: 'ae16a1a',
    title: "Mosaic reads in chart order",
    detail: "Mosaic used to size each tile by its plays, so the chart came out jumbled (#4 next to #1, #5 off in a corner) and covers were stretched. Now every tile is a square cover and the size tells the rank: #1 takes half the width, #2 to #5 sit beside it two by two, and the rest follow five to a row. On a phone #1 goes across the top, then two and three to a row. A soft dark fade keeps the big rank number and the title readable on any cover, the top 3 have gold, silver and bronze rings, and the gaps are even. Hovering still shows the details and clicking a tile still flips it, now with everything fitting on the back. A new Save image button saves the whole mosaic as a picture." },

  { d: '2026-10-19', t: 'design', a: 'charts', h: '27abfda',
    title: "Filmstrip becomes a podium for your top 3",
    detail: "Filmstrip no longer starts as a row of small cards cut off at the edge. Your #1, #2 and #3 now sit side by side in one even row across the top, glowing gold, silver and bronze, each with its cover and a large rank number beside the title. The rest of the chart follows in a strip of cards under them, with arrows and faded edges showing there is more. On a phone #1 goes across the top with #2 and #3 below it. The buttons are in your language, and Save image works again: it saves the podium and every card of the strip as one picture. Scrolling the page with the mouse no longer gets stuck on the strip, and dragging the strip no longer opens a card's details." },

  { d: '2026-10-19', t: 'fix', a: 'charts', h: '03d2ba7',
    title: "In Stack, the plays-peak tag sits with the plays",
    detail: "The Stack layout's plays-peak tag (PLAYS PEAK) moved from beside the title to right after this period's plays, so it reads as a record for the plays and not for the chart position. When it doesn't fit beside the count it wraps underneath, whole, instead of being cut off." },

  { d: '2026-10-19', t: 'design', a: 'charts', h: '7d7714d',
    title: "A cleaner Card grid, with the top 3 glowing again",
    detail: "Card grid covers are square now instead of cropped. The rank sits in the top-left corner (gold, silver and bronze for the top 3) with the peak beside it, the movement in the top-right, and the certification in the bottom corner. Under the cover come the title, the artist, then this period's plays (with the plays-peak tag right after them) and time on the chart, and a row with Search on Spotify, the sample button and ⋮. The top 3 glow again: a bug had stopped it from ever showing. Five covers across on a computer, three on a tablet, two on a phone, and the size button is in your language (Bigger covers). The play bars and the green and red borders are gone." },

  { d: '2026-10-19', t: 'design', a: 'charts', h: '1ef43b9',
    title: "A clearer Stack chart layout",
    detail: "Stack cards now have three lines: the title, then the artist and album, then this period's plays and time on the chart, set apart (all-time plays are in the details panel). The big rank number has its movement under it, and the top 3 still glow gold, silver and bronze, now in light themes too. Each card ends with Search on Spotify, the sample button and ⋮. With two columns on, the chart reads down the first column and then the second (1–5, 6–10) instead of zig-zagging 1, 2 / 3, 4. Badges keep their bold type. The play bars are gone, and on a phone badges wrap under the title instead of being cut off at the end of the card." },

  { d: '2026-10-19', t: 'fix', a: 'playlists', h: '59723c6',
    title: "Better playlist names, and calendar exports that work while loading",
    detail: "Exporting the Daily chart now suggests names that fit the day, like Today's Top 27, Monday Top 27, Daily Chart · 19 Oct 2026 and My Monday Mix. The Events calendar's Export Playlist (Day view, Singles only) suggests On This Day, Throwback Singles and the day's artists. That button, along with Play All and Create Playlist, also did nothing while the calendar was still fetching your artists; they now work straight away with what has loaded so far." },

  { d: '2026-10-19', t: 'design', a: 'playlists', h: '9bc70e4',
    title: "A cleaner Export Playlist window",
    detail: "The Export Playlist window is now three simple steps: pick a name, copy your songs, import them on Soundiiz. The songs show as a numbered list with title and artist instead of a block of text, the order is a #1 first / #1 last switch and the album is an on/off toggle. Copy list is the big button and turns green with a check when it worked, with .txt and .csv downloads beside it. The last step shows which services Soundiiz can send the playlist to and has one Open Soundiiz button." },

  { d: '2026-10-19', t: 'feature', a: 'share', h: '0b7dc37',
    title: "Share your Daily calendar as an image",
    detail: "The calendar on the Daily tab has a new share button next to the month. It makes a picture of the month: each day's #1 cover with its number and mood, plus how many days had a #1, how many different songs got there and which one held it longest. Pick Post, Portrait or Story and a palette, then copy, download or share it from your phone." },

  { d: '2026-10-19', t: 'fix', a: 'mobile', h: 'b68c17d',
    title: "Compact chart tags no longer overlap on phones",
    detail: "In the Compact layout on a phone, a song with several tags (its peak, a certification and a rating) had them run across the Move and Plays columns. The tags now wrap onto a second line under the title instead." },

  { d: '2026-10-19', t: 'fix', a: 'rawdata', h: 'e368e16',
    title: "Deleted auto-correct rules stay deleted",
    detail: "Deleting an auto-correct rule could seem to work and then the rule came back, because another device or your Google Sheet still had a copy and shared it again. Deleted rules are now remembered on every device, the sheet and your account, so they stay gone; making the same rule again, or importing it, still brings it back. Rules that change nothing (the same artist, song and album before and after) are removed too: they were behind an \"Auto-corrected entries in sheet\" message that appeared on every load without anything being corrected." },

  { d: '2026-10-18', t: 'design', a: 'charts', h: '4b1c0c3',
    title: "A tidier Compact chart layout",
    detail: "The Compact layout's columns now line up under their headers, which are in your language and match the Table's (Move, Weeks, Plays). Title and artist sit together on the left instead of at opposite ends of the row, and the weeks column shows just the number. On a phone the artist goes under the title and the weeks move into the details panel, so titles are readable instead of cut to a letter or two; badges drop under the title, with diamonds as 💎." },

  { d: '2026-10-18', t: 'fix', a: 'charts', h: 'efb8e8c',
    title: "Easier-to-read labels in the Daily day summary",
    detail: "The small labels on the First, Last, Top artist and On repeat tiles under the Daily chart are a little bigger, and on a phone the time moves under the label when the tile is too narrow, instead of running past its edge." },

  { d: '2026-10-18', t: 'design', a: 'charts', h: 'ebbd1a3',
    title: "A livelier Daily chart: day summary, Your day and toolbar",
    detail: "The Today and Last 7 days panel and the Your day card now come after the chart. The panel has a bigger ring and bars, a badge for how your day compares with your usual one, a dashed line for the week's average, and tiles with covers for the day's first and last song (with their times), its top artist and the songs on repeat, which now take turns when there is more than one; click the tile to skip, hover to pause. Your day shows the mood you picked under its title and has mood buttons with their names. The compare switch and the Day recap, Share image, Play, Calendar and playlist buttons now match the Songs / Artists / Albums switch, with line icons, and Animate Chart matches the ⋮ button on every chart." },

  { d: '2026-10-18', t: 'feature', a: 'records', h: '3b3c2ca',
    title: "Calendar badges",
    detail: "The Calendar group in Daily Streaks → Records goes from one badge to 18: streaks on holidays (New Year, Valentine's Day, February 29, Halloween, the holidays), in the seasons (a song of the summer, a winter streak, all four seasons in one year), covering whole calendar months or a whole year, and anniversaries, like the same artist on a streak on the same date in different years." },

  { d: '2026-10-18', t: 'feature', a: 'records', h: '25b0b6a',
    title: "Album badges for several albums",
    detail: "Side A, Album devotee, Side B and Front to back in Daily Streaks → Records now each have three more badges for doing it with 3, 5 and 10 different albums, from Triple A-side and Greatest hits to Cover to cover." },

  { d: '2026-10-18', t: 'feature', a: 'records', h: '7dd01ed',
    title: "Fan club badges",
    detail: "Deep fan in Daily Streaks → Records now has fan club ranks. Pick an artist you've had a 30-day streak with: the more of their songs reach a 7-day streak, the higher you climb, from Fan club through Secretary, Treasurer, Vice president and President to Founder. Another set counts how many artists' fan clubs you're in, and Box set and Side B fill gaps in the album badges." },

  { d: '2026-10-18', t: 'change', a: 'records', h: 'a16e85f',
    title: "Fold away badge groups",
    detail: "Each badge group in Daily Streaks → Records (One long streak, Side by side and the rest) can now be folded away by clicking its heading, so you can keep open only the ones you care about. The window remembers which groups you folded." },

  { d: '2026-10-18', t: 'feature', a: 'records', h: 'a04ef08',
    title: "All three kinds badges",
    detail: "All-rounder in Daily Streaks → Records now has a group of its own, All three kinds, with 13 badges like it: an artist, an album and a song each reaching 7, 14, 50, 100, 200 or 365 days; 3, 5, 10 or 25 of each kind on a 30-day streak; and an artist, an album and a song all on a long streak on the same day." },

  { d: '2026-10-18', t: 'change', a: 'records', h: '6e76bba',
    title: "Streak badges climb step by step",
    detail: "The badges in Daily Streaks → Records now go up in smaller steps, so there's always a next one in reach: 110 badges in all, with new ones like a three-week streak, five streaks alive on one day, or 10 songs with a two-week streak. Names now grow with the goal too: the grandest names (Pantheon, Museum, Immortals, Phoenix, Lazarus, Serial returner) are now at the top of their ladders instead of partway up. Some cards were renamed, and two (Homecoming, Reborn legend) were folded into the new ladders." },

  { d: '2026-10-18', t: 'feature', a: 'records', h: 'db3096c',
    title: "Ten more Comebacks badges",
    detail: "The Comebacks badges in Daily Streaks → Records go from 7 to 17, with harder goals once the first ones are done: the same thing coming back on a week-long streak 10 or 30 times, two or three separate month-long streaks for one thing, 500 different things coming back, beating your own record of 30 or 100 days, 100 things returning after more than a year away, a return that reaches 30 days, and a streak that comes back after more than five years." },

  { d: '2026-10-18', t: 'feature', a: 'records', h: 'd3825f1',
    title: "Easier Staying power badges",
    detail: "The Staying power badges in Daily Streaks → Records were all hard to get, so there are six easier ones to work up to: keep something on a 7-day streak for a month, a 30-day streak going for 30 days, a 14-day streak going for 60 days, start a week-long streak in every quarter or every month of a year, and reach a 30-day streak in two different years. The section's descriptions are also clearer, saying exactly what to do." },

  { d: '2026-10-18', t: 'feature', a: 'records', h: '4670b1f',
    title: "22 more streak badges",
    detail: "Daily Streaks → Records now has 52 badges. New ones include 200-day, two-year and 1,000-day streaks, 25 long streaks on the same day, 100 different songs or 25 different albums with a two-week streak, a streak kept going for two years, streaks that come back a third time or after three years away, an artist with three albums on long streaks, and a new Calendar group starting with a streak still going on New Year's Eve. Within each group the badges now go from easiest to hardest." },

  { d: '2026-10-18', t: 'feature', a: 'records', h: 'a918c94',
    title: "18 new streak badges",
    detail: "The Badges in Daily Streaks → Records go from 12 to 30, and most of the new ones take more than one artist going long: several 30-day streaks on the same day, many different artists, albums and songs with long streaks, keeping a 30-day streak going for 100 days or a whole year, streaks that come back, and an artist or album going strong together with its songs. The badges are now sorted into six groups, each showing how many you have." },

  { d: '2026-10-18', t: 'change', a: 'charts', h: '0a9f363',
    title: "Plays column centred and resizable",
    detail: "In the Songs, Artists and Albums charts the Plays column is now centred, like Weeks next to it. You can drag the line between Weeks and Plays again to make either one wider or narrower. Plays never gets too narrow for its number, and the ▶, ⋮ and chart run buttons keep their full space." },

  { d: '2026-10-18', t: 'fix', a: 'charts', h: 'e47d15c',
    title: "Row buttons always fit in the chart",
    detail: "The Plays column now has a fixed width, and the ▶, ⋮ and chart run buttons at the end of each row always get their full space. If you had resized columns before, the ⋮ menu could end up cut off at the edge of the chart; it now always fits." },

  { d: '2026-10-18', t: 'change', a: 'charts', h: '3e1e84d',
    title: "Resizable Rank and Move columns",
    detail: "On the Daily, Weekly, Monthly and Yearly charts you can now drag the edge of the Rank and Move columns too, not just the text columns. Making them narrower gives the space to the title, so the buttons at the end of each row stay in view. Double-click a line, or use ⋮ → Size → Reset column widths, to go back." },

  { d: '2026-10-18', t: 'change', a: 'charts', h: '5a9e83c',
    title: "Tidier details panel",
    detail: "The buttons at the top of an entry's details (sample, video, playlist, YouTube, details) are now one small toolbar with short labels, next to the album and artist instead of two rows of big buttons; hover a button for its full name. On phones they sit in one even row. The chart run's stat tiles are wider and easier to read, and Spanish spells out \"Reproducciones\"." },

  { d: '2026-10-18', t: 'change', a: 'charts', h: 'a49c61b',
    title: "Bubbling Under run panel redesigned",
    detail: "The history panel under each Bubbling Under entry now looks like the main chart run: clear tiles with the label on top, the peak shown as BU1 with its overall rank underneath, and a simple switch between the Bubbling Under weeks and a view mixed with the chart. Everything in it, the dates on the boxes included, is now translated into Spanish and Portuguese." },

  { d: '2026-10-18', t: 'feature', a: 'soundtrack', h: '9c3ed0b',
    title: "Chart History replay: step week by week",
    detail: "The Chart History replay on Your Soundtrack has ‹ and › buttons beside play/pause, to move back or forward one week at a time. Stepping pauses the replay so it stays on the week you picked." },

  { d: '2026-10-18', t: 'change', a: 'soundtrack', h: 'b35dbff',
    title: "Your Soundtrack banner: Your year in music",
    detail: "The line under the year on the Your Soundtrack banner now reads Your year in music (Your month in music for a single month) instead of Your year in sound, in every language." },

  { d: '2026-10-18', t: 'i18n', a: 'soundtrack', h: 'abdb83d',
    title: "Spanish: Soundtrack is now Banda Sonora",
    detail: "In Spanish the Soundtrack tab and page kept the English word. They now read Banda Sonora (Tu Banda Sonora), like the rest of the Spanish site already did for soundtrack releases." },

  { d: '2026-10-18', t: 'i18n', a: 'charts', h: 'ebcae25',
    title: "Spanish and Portuguese: Bubbling Under is now Aspirantes",
    detail: "In Spanish the Bubbling Under section was called Casi en el Top, and in Portuguese Quase no Top. Both now read Aspirantes (Aspirantes al Top 100 / Aspirantes ao Top 100): the songs, artists and albums trying to get into the chart." },

  { d: '2026-10-18', t: 'fix', a: 'charts', h: 'fe83b8f',
    title: "Bubbling Under: buttons at the end, easier to read on phones",
    detail: "In Bubbling Under, the ▶ sample and ⋮ menu buttons now sit at the end of each row, like on the main charts, instead of under the title. On phones the plays count moves under the artist, so titles and tags get the full width." },

  { d: '2026-10-18', t: 'fix', a: 'charts', h: 'd4220bd',
    title: "Off the Chart is easier to read on phones",
    detail: "On phones, Off the Chart rows squeezed song titles down to a few letters. Each row now reads top to bottom: the full title, the artist, then plays and weeks on one line, then the streak and status notes, with the ⋮ menu on the right." },

  { d: '2026-10-18', t: 'fix', a: 'charts', h: '418f548',
    title: "Off the Chart: play and menu buttons in their own column",
    detail: "In the Off the Chart lists, the ▶ sample and ⋮ menu buttons used to sit under each title. They now have their own column at the right end of every row, so the rows are shorter and the buttons always line up." },

  { d: '2026-10-18', t: 'i18n', a: 'charts', h: 'fc66c0a',
    title: "Spanish: plays now read “veces”",
    detail: "In Spanish, the charts' Plays column now says 54 veces (1 vez) under the header Escuchas, instead of reprods. Together with the shorter plays peak tag (▲ MÁX), this leaves much more room for the titles." },

  { d: '2026-10-18', t: 'i18n', a: 'charts', h: 'aba198b',
    title: "Certifications in your language",
    detail: "Certification badges used to say Gold, Platinum and Diamond in English whatever language you picked. They now follow your language everywhere they appear: on the charts, in album pop-ups, on the certifications wall and on award plaques." },

  { d: '2026-10-18', t: 'change', a: 'charts', h: '6ce8ef5',
    title: "Add to a playlist from each entry's ⋮ menu",
    detail: "The Playlist switch is gone from the charts' ⋮ → Show menu, and chart entries no longer carry a + playlist button in any layout. To add a song, artist or album to a playlist, open its own ⋮ menu (or right-click it) and pick Add to a playlist." },

  { d: '2026-10-18', t: 'design', a: 'charts', h: '6ce8ef5',
    title: "Shorter badges in the chart table on phones",
    detail: "On phones, the plays peak tag in the chart table now reads ▲ PB instead of ▲ PLAYS PEAK, so it no longer outgrows the play count above it. Diamond certifications show as diamonds: 💎 for Diamond, 💎💎 for Double Diamond, then 3×💎, 4×💎 and so on. Gold and Platinum keep their names. In Spanish, the peak tag shows a medal and the number (🏅 #1). Hold a badge to see its full name." },

  { d: '2026-10-17', t: 'feature', a: 'charts', h: '0681898',
    title: "Resize the chart table's columns",
    detail: "On a computer you can now drag the line between two column headers in the Songs, Artists and Albums tables to make a column wider or narrower, on every period. The column next to it gives up the space, so the table always fits. Your widths are saved (and follow your account to other devices). Double-click the line, or open the chart's ⋮ menu → Size → Reset column widths, to go back to the automatic widths." },

  { d: '2026-10-17', t: 'feature', a: 'charts', h: '98e03fc',
    title: "Bigger covers in the chart table, and more room for titles on phones",
    detail: "Covers in the Table layout are bigger on every row, and long album names wrap neatly in their own column without squeezing the titles. The play bars are thinner but keep their colours. The Previous column is now called Move, and still shows last period's rank under the arrow. On phones the table no longer runs off the right edge in any language, and Title · Artist gets much more room: the plays column shows just the number (with the change under it, no bar), and the rank column is labelled #." },

  { d: '2026-10-17', t: 'fix', a: 'charts', h: 'dfeb253',
    title: "Daily: Days on chart counts every day again",
    detail: "On the Daily chart, the Days on chart column only counted days in the current month, so a song back after a while could say 1 day while its chart run showed 48. It now counts every day the entry has spent on the daily chart, the same number the chart run shows." },

  { d: '2026-10-17', t: 'feature', a: 'charts', h: '9239863',
    title: "Every chart layout now works on every period",
    detail: "Card grid, Compact, Mosaic, Filmstrip and Stack used to work only on the Weekly chart. Now they work on Daily, Monthly, Yearly and All-Time too: pick one with the layout buttons above the chart. On Yearly and All-Time they follow the same pages and search box as the Table, so page 2 starts at #101. In Card grid, a Show more button under the grid adds the next 100 instead. Time on the chart now says days, weeks, months or years to match the period." },

  { d: '2026-10-17', t: 'feature', a: 'charts', h: 'd7069fd',
    title: "Chart layouts are now buttons above the chart",
    detail: "The six ways to look at a chart (Table, Card grid, Compact, Mosaic, Filmstrip and Stack) used to hide in the chart's ⋮ menu, under View. Now they are a row of small icons on the right of the bar above the chart, next to Songs, Artists and Albums: hover one to see its name. Each chart type still remembers its own layout. When Stack is on, one more icon splits it into two columns. The ⋮ menu now has Show, Size and Actions. The guided tour shows the new buttons." },

  { d: '2026-10-17', t: 'feature', a: 'charts', h: 'a405103',
    title: "Show switches work in every chart layout, and every row has ▶ and ⋮",
    detail: "The switches in a chart's ⋮ menu, under Show (peak tags, certifications, your scores, plays peak, playlist +), now work the same in all six layouts, for songs, artists and albums. Before, Card grid, Compact, Stack and Filmstrip only showed some of them. The YouTube switch is gone: to watch a song, open ⋮ or right-click the row and pick Play the video. In return, the Yearly and All-Time charts and the Bubbling Under, Off the Chart and New Entries lists now have the ▶ sample button and the ⋮ menu too, and clicking a Yearly or All-Time row opens its details. Play all and Shuffle work as before." },

  { d: '2026-10-17', t: 'feature', a: 'charts', h: '18e1539',
    title: "Livelier Daily cards: tap the hours, see covers, browse one list at a time",
    detail: "The four cards under the Daily chart are easier to read and more fun to use. Each opens with a short summary (like \"An afternoon kind of day\"). In Time of day, tap or hover an hour to see its plays, top song and cover, and tap Night, Morning, Afternoon or Evening to light those hours. Patterns shows one big number per card and a genre donut you can explore. Memories and Milestones show one list at a time behind tabs, with covers, streak and milestone badges, and progress bars toward your goals. Awards of the day are trophy cards that slide sideways on phones." },

  { d: '2026-10-17', t: 'feature', a: 'charts', h: '36005bc',
    title: "Cleaner play and expand buttons in Daily Streaks and album windows",
    detail: "The play button on Daily Streaks rows is now a soft rounded square in the streak colour that lights up on hover, instead of an outlined circle. In an album window, the button that opens a track's stats no longer looks like a play button: it is now an arrow that flips when the stats are open." },

  { d: '2026-10-17', t: 'fix', a: 'charts', h: 'fa3b6da',
    title: "Long song and album names stay inside the On Air card",
    detail: "A long song or album name (like a \"From the … Anniversary Special\" title) no longer runs past the edge of the On Air card on phones or makes the page scroll sideways. It now wraps onto more lines inside the card." },

  { d: '2026-10-17', t: 'feature', a: 'charts', h: 'fa69426',
    title: "Streak rows on phones: an icon before the name instead of a tag",
    detail: "On small screens the SONG, ALBUM and ARTIST tags on Daily Streaks rows are replaced by just their icon, placed in front of the name, so long names have more room." },

  { d: '2026-10-17', t: 'feature', a: 'charts', h: '2b5ae0e',
    title: "Song, album and artist icons on streak tags",
    detail: "The SONG, ALBUM and ARTIST tags on Daily Streaks rows now carry the same small icons as the save plan's key, so every list in the window reads the same way." },

  { d: '2026-10-17', t: 'fix', a: 'charts', h: '36699a7',
    title: "Spotify search is back on streaks that need a play",
    detail: "Every song in the Daily Streaks save plan, every at-risk streak and the Streak of the Day card have a green Spotify button again. It opens a Spotify search for that song in a new tab, so you can keep the streak alive by playing it there." },

  { d: '2026-10-17', t: 'feature', a: 'charts', h: '401b187',
    title: "A cleaner, bolder Today tab in Daily Streaks",
    detail: "The Today tab in Daily Streaks got a visual refresh. The header shows how many streaks you kept today as one big scoreboard number, with what still needs a play beside it. Streak of the Day is now a featured card: the cover in the background, the name and day count in large type, and a Play button; when the streak is at risk it turns into a red warning. The save plan has one big Play all button with small icon buttons for queue, save playlist and copy tracklist, every song shows its cover (Play appears on hover), and the coloured tag boxes are now plain names with small song, album and artist icons and a key above the list. A single and its album with the same name now show once." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: '3ac63ef',
    title: "Streak of the day, rivalries, milestone sparks and a streaks share image",
    detail: "The Daily Streaks window got more fun. The Today tab opens with a Streak of the day: a record you beat today, a milestone you reached, the longest streak still at risk, or the one in the lead. Milestones reached today (7, 14, 30, 50, 100, 200 or 365 days) are listed, and the first time you open the window that day a burst of sparks goes off. The On fire tab shows a rivalry: two unrelated streaks tied on the same number of days, and which one still needs a play to stay level. The flame in the header grows with your longest running streak. A new Share button makes a \"My streaks\" image in two designs (Board and Flame), with the usual palettes and formats, ready to download, copy or share." },

  { d: '2026-10-16', t: 'fix', a: 'charts', h: '6fdc9f2',
    title: "Windows opened from a streak row show on top",
    detail: "Choosing Details, Album or Artist from a streak row's ⋮ menu opened that window behind the Daily Streaks window, so nothing seemed to happen. It now opens on top." },

  { d: '2026-10-16', t: 'design', a: 'charts', h: '761e668',
    title: "One streak calendar with a type switch and a day panel",
    detail: "The Calendar tab of the Daily Streaks window (it was called Heatmap) now shows one heatmap instead of four stacked ones, with an All / Artists / Songs / Albums switch that recolours the grid and the stats. The long row of year buttons is a dropdown. Peak day, days with streaks, the daily average and the busiest week sit in four tiles. Click any day (or tap it on a phone) to list every streak running that day in a panel under the grid, grouped by artists, albums and songs. The colour themes and Copy image are still there." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: 'd98ed4a',
    title: "Streak records: top 5 per type, headstones and badges",
    detail: "The Records tab of the Daily Streaks window now shows a Hall of Fame with your top 5 artist, album and song streaks, with gold, silver and bronze for the first three. Its tag no longer says \"Active\" for a record that ended months ago: it says \"running now\" only when the record is the streak still going, and \"now on a new 26d run\" when a newer streak is going. The Graveyard is a wall of headstones with the full start and end dates and a note like \"1 short of 50d\" when a streak ended just before a milestone. A song and its same-name single are shown once, tagged song and album, here and on the On fire tab. New: 12 streak badges, from First week to Year round, with your best so far on the ones still locked." },

  { d: '2026-10-16', t: 'design', a: 'charts', h: 'a381c67',
    title: "Streak rows show covers, levels and the last 14 days",
    detail: "The On fire tab in the Daily Streaks window is one list with an All / Artists / Albums / Songs switch instead of three long sections, topped by a podium for your three longest running streaks. Every row now has its cover or artist photo, a streak level (Spark, Flame, Blaze, Inferno, Eternal) that colours the day count, the last 14 days drawn right under the name (no more hovering the ◈), a bar toward the next milestone, and how close you are to your record. Rows carry the same ▶ sample and ⋮ menu as the charts. The at-risk and lost rows on the Today tab use the same design. Filter and sort still work; filtering or sorting A–Z shows every match as a plain list." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: 'f2e654a',
    title: "The streak window opens on a Today tab that shows what to save",
    detail: "The Daily Streaks window now opens on Today: the streaks that still need a play before midnight, with a live countdown and a bar showing how many you have already kept today. One song can keep several streaks going (the song, its album and every artist on it), so the window lists the fewest songs that save them all and says how many each one saves. Play All, Queue, Save Playlist and Copy Tracklist use that short list, and every at-risk row has its own play button. Streaks you keep move to \"Saved today\" while the window is open, and \"Lost yesterday\" sits on the same tab. The tabs are now Today, On fire, Records and Calendar." },

  { d: '2026-10-16', t: 'change', a: 'charts', h: '24445de',
    title: "Streak details stay with a song on air, and can be hidden",
    detail: "The listening streak row under the top strip now shows while a song is on air too. A small handle on the strip's bottom edge folds that row away on its own, without hiding the song or the streaks, and the site remembers your choice." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: '3e1f5dc',
    title: "More about your listening streak when nothing is playing",
    detail: "With no song on air, the top strip opens a second row about your listening streak: a bar toward your best (and once you pass it, toward the next round number like 100 or 365), how many days to beat your best or \"New record every day\", where this streak ranks (\"Your 2nd longest ever\"), since when and the first song of it, your top 3 streaks with their dates (this one highlighted if it is among them), and the artist, song and album you have played the most days in a row right now. A song on air takes the room back." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: '37d05bb',
    title: "Daily chart runs show the daily chart only",
    detail: "Opening an entry on the Daily chart now shows its run on the daily chart alone: one box per day it charted, gaps counted in days, and Days on chart, Days at #1, Days in Top 5 and Days in Top 10. The range buttons read 2026 YTD, Up to this day and All-Time, a box opens that day's chart, and the Share card draws the daily run with its dates. Weekly, monthly and yearly runs no longer appear there." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: '5d54fe0',
    title: "The Daily chart has the same settings as the other charts",
    detail: "The Daily chart is now the same chart as Weekly and Monthly, so everything in its ⋮ menu works there too: Show (cert badges, your scores, plays peaks, peak tags, YouTube and playlist buttons, descriptions, and the Chart and New Entries sections), Size (Top 10 to 50 or your own number, set per chart and kept with your account) and Actions (share, PDF, export). Click a row for its chart run, with its weekly, monthly and yearly history, and use Animate Chart to watch it move from the day you compare against. The compare switch, the actions and the day's cards stay above and below the chart." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: '8f8f71e',
    title: "Share images count the right unit on the chart",
    detail: "Share images said \"3 weeks\" for how long an entry had been on the chart whatever the period. Monthly images now say months, yearly images years and daily images days, and the option in the designer is named to match (Days / Weeks / Months / Years on Chart)." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: '61ac42f',
    title: "Your day, a calendar and live updates on the Daily chart",
    detail: "The Daily chart gets a Your day card: pick a mood and write a line about the day. It is saved as you type, on this device and, when you are signed in, to your account so every device has it; account backups include it too. A new Calendar button opens a month of daily #1 covers, with each day's mood and a dot where you wrote a note; click a day to open it. And while you look at today with Last.fm as your source, a Live badge shows and new scrobbles are added every 2 minutes, without losing a note you are typing." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: 'b714c9c',
    title: "Export a day's songs as a playlist",
    detail: "The Daily chart has an Export playlist button too, the same as Weekly and Monthly: copy or download the day's songs and import them in Soundiiz into Spotify, Apple Music, YouTube Music, Deezer and more. It always exports the day's songs, even while the artists or albums chart is on screen, and names the list after the date." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: '478326d',
    title: "Share, play and relive a day on the Daily chart",
    detail: "Four buttons under the Daily chart's controls. Day recap opens a full-screen story of the day, one slide at a time: your plays against your usual day, your #1 song, your top artist, when you listened, the highlights, and an end slide to share or play it; it moves on by itself, and you can tap either side or use the arrow keys. Share image opens the same designer as the other charts (every design, palette and format), now headed \"of the Day\" with days on the daily chart. Play top N puts the day's songs into the player queue, and Save as playlist keeps them under Playlists." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: '83ca66a',
    title: "Milestones and goals on the Daily chart",
    detail: "A Milestones & goals card at the bottom of the Daily chart. It hands out the day's awards (song, artist and album of the day, the discovery of the day and the comeback of the day), lists songs, artists and albums that reached a round number of plays, records broken that day (your most plays of a song or an artist in one day, with a link to Records), streaks still going and the ones that ended, and goals: how far the day was from your best same weekday and your biggest day, what you played lately that is a few plays from its next milestone, and, on today, the streaks that end unless you play them today. Certifications earned on the day now show in the same Certified reel as on Weekly and Monthly." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: '9991d33',
    title: "Memories on the Daily chart",
    detail: "A Memories card under the Daily chart, looking back from the day you are viewing: your top song and artist on the same date one, two and three years before (click one to open that day), forgotten favourites from your top 100 that had gone three months or more without a play, throwback artists from your top 20 you had not played for a month or more, comebacks (songs back after six months or more) and what you heard for the first time that day. Songs and artists there have the same ▶ sample and ⋮ menu as the other charts, and the daily chart's rows now have them too." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: '689e744',
    title: "Listening patterns on the Daily chart",
    detail: "A Patterns card under the Daily chart: the song you replayed most, the longest run of one song and of one artist back to back, albums you played in full (checked against the real tracklist from Deezer, or every track of it in your library until that arrives), how varied the day was on a scale from loyal to explorer with your usual marked, and a genre mix of the day's plays. Genres come from your sheet's Genre columns when it has them, otherwise from Last.fm artist tags." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: '4f74d71',
    title: "Time of day on the Daily chart",
    detail: "Under the Daily chart, a card shows when in the day you listened: your busiest hour, how many listening sessions you had (a gap of more than 30 minutes starts a new one) and how long the longest lasted, a bar for every hour, a strip of covers with the album you played most in each hour, and the day in four parts (night, morning, afternoon, evening) with the top song of each. It only appears when your plays have times; a sheet with dates only leaves it out rather than putting the whole day at midnight." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: '208a86f',
    title: "The day at a glance on the Daily chart",
    detail: "A card above the Daily chart sums up the day you are looking at. A ring fills as its plays approach your usual day (the average of the days you listened in the month before), next to the first and last song of the day and its top artist. Beside it, the 7 days ending on that day as bars, the day itself lit, with the total, the change on the 7 days before and the song on repeat. Click a bar to go to that day." },

  { d: '2026-10-16', t: 'feature', a: 'charts', h: 'eba0669',
    title: "A Daily chart",
    detail: "A new Daily tab sits before Weekly. Step back one day at a time with the arrows, or click the date to pick any day. It ranks the day's songs, artists and albums (Top 10, 20 or 50) and shows how each moved against yesterday, or against the same weekday last week if you prefer. Each entry shows how many days it has been on the daily chart this month and its peak, with the date it got there, and a line over the chart says how long the #1 has been on top. The four stat tiles compare with that day too, count your first-ever plays, show the day's share of its week, and rank the day against every other day you listened (with a badge for your biggest day of the month or ever). Press D to jump to it." },

  { d: '2026-10-16', t: 'feature', a: 'charts',
    title: "Stats about your all-time charts",
    detail: "Set the All-Time songs chart to a size (Top 50, 100, 200 or your own number) and a new section, Inside your Top 100, opens above it. It starts with one big fact and an Another fact button: who has the most songs in it, which album puts the most songs in, who rules the top 10, how far #1 is ahead, and more. See all stats opens four headline numbers and five tabs. Artists: the 10 artists and 5 albums with the most songs (pick one to see them), who owns the top 10, your top 3 artists' share, and the artists who made it with one song. Eras: release decades, the oldest and newest song, how old the chart is on average, and the year you found each song. Plays: how much of all your listening the chart holds, #1 against #2, and the songs that got in fastest and slowest. Badges: how many songs are Gold, Platinum and Diamond, which are closest to their next plaque, and singles against album tracks. New this year: every song that was not in the chart a year ago, and whether it climbed in or you had not played it yet. It works on the Artists and Albums charts too, with stats that fit each one: on Artists, which artists you have played the most different songs by, whose plays lean on a single song, and who you have known the longest; on Albums, who has the most albums in it and which albums you have played the most tracks from. With All Entries, a small tip offers to switch to Top 100. Works with Last.fm, Google Sheets and CSV." },

  { d: '2026-10-16', t: 'fix', a: 'ui', h: '5c765b8',
    title: 'The top bar fits in every language',
    detail: "In Spanish and Portuguese the top bar's tabs could run into each other on a laptop screen, and \"Iniciar sesión\" was cut off on small phones. The bar now checks whether everything fits and, only when it does not, tightens itself: What's New shows just its count, the tabs move closer, and on the smallest phones Sign in gets a shorter label. Switching language also now updates the in-a-row run and the last played line at the top of the charts, which stayed in the old language until you reloaded." },

  { d: '2026-10-16', t: 'design', a: 'ui', h: '5cdb2df',
    title: 'Your listening streak is on every chart tab',
    detail: "Your listening streak (how many days in a row you have played music) used to be the last number in the All-Time summary, so you only saw it on that one tab. It now sits at the end of the strip at the top of the charts, on every chart tab, labelled Listening streak so it is not mixed up with the in-a-row run next to it. It shows the days and your best (\"Your best: 370 days\", or \"Your best ever\" in gold while you are on it), with a new flame that warms from a grey ember to gold as the streak grows. On phones the folded strip now has two lines: the song, then both streaks in words. Click it to open the streak details." },

  { d: '2026-10-14', t: 'feature', a: 'charts', h: '6cfb4c9',
    title: 'Details drawer on every chart entry',
    detail: "Click any song, artist or album on the chart, in any of the six layouts, and a panel opens right there with everything about it: its last position, plays and how they changed, certification, personal best, your score, the album and artists, the full chart run with its peak and weeks, and buttons to hear a sample, play the video, add it to a playlist or open its full page. It always shows everything, even what the Show switches hide on the chart. Clicking the name still opens the full page. The chart run's figures are clearer everywhere too: each one now says what it counts on top (Weeks on chart, Total plays, Peak, Weeks in Top 10) with the number below." },

  { d: '2026-10-14', t: 'fix', a: 'share', h: 'e2789fd',
    title: 'Shared singles and EPs charts say Singles and EPs',
    detail: "With singles or EPs on their own chart, sharing that chart as an image still titled it \"Top 10 Albums\". The image, the share window, the printable PDF and the file name now say Singles or EPs, the same as the chart's own heading." },

  { d: '2026-10-14', t: 'fix', a: 'charts', h: 'a844fb1',
    title: 'Mosaic and Filmstrip certify singles and EPs correctly',
    detail: "In the Mosaic and Filmstrip layouts, every album was measured against the album certification ladder, even singles and EPs. They now use the release type, the same as the table. Behind it, all six layouts now get their facts about each entry from one place, so they can't disagree again." },

  { d: '2026-10-14', t: 'feature', a: 'charts', h: 'eec9d14',
    title: 'Samples and one menu on every chart entry',
    detail: "Every song, artist and album on the chart, in all six layouts, now has a ▶ that plays a 30-second sample (on a phone, tap the cover), and a ⋮ button (or right-click) with everything else: play the full song now, next or later, play similar, add to a playlist, details, album, artist, chart run, change the image and search YouTube. An artist's sample is the song you last played by them; an album's is the song you played most from it in the period on screen. Samples don't use the site's YouTube allowance, so clicking a Card grid card now opens its details instead of playing it. On a phone, a short hint the first time explains the cover: tap it for the sample, hold it to change the picture." },

  { d: '2026-10-14', t: 'feature', a: 'player', h: '556b781',
    title: 'Songs found once play for everyone',
    detail: "YouTube only allows the site a small number of new song searches a day, shared by everyone. Now, once anyone plays a song, the site remembers which video it is, and every later play of that song, by anyone, starts straight away without using up that allowance. The same goes for the player's search box and the Video of the Year previews in Awards. If a remembered video stops working, it is forgotten and found again. Without an account you can play any song someone has already played; for a brand-new one the player asks you to sign in." },

  { d: '2026-10-14', t: 'i18n', a: 'charts', h: '8d135f3',
    title: 'Plays in Portuguese, reprods in Spanish',
    detail: "In Portuguese, play counts now say plays, the word most music apps and listeners already use, instead of reproduções and its short form \"repros\". In Spanish, short labels such as column headers and the word after a number say reprods (reprod for one), and full sentences still say reproducciones." },

  { d: '2026-10-14', t: 'fix', a: 'charts', h: '77a5387',
    title: 'Bubbling Under loses its red edge in Red light',
    detail: "In the Red light theme, the Bubbling Under section had a red line down its left edge, the same red that means a song went down, so the whole section looked like it was falling. The other light themes had a line in their own colour. Every light theme now draws a plain, neutral border around the section." },

  { d: '2026-10-14', t: 'design', a: 'charts', h: 'dd2f221',
    title: 'One toolbar above the chart',
    detail: "The four rows of buttons above the chart are now one: Songs, Artists and Albums sit in a single switch, and the Albums, Singles and EPs filter sits beside it when you have set a release type apart. Chart, Bubbling Under, Off the Chart and New Entries moved into the chart's ⋮ menu, under Show, in a new Sections group, and your choices there carried over. If you switch the chart itself off, its title and ⋮ menu stay so you can switch it back on. The Collapse All button is gone; each section still collapses on its own." },

  { d: '2026-10-14', t: 'design', a: 'charts', h: '18c8ee8',
    title: 'The Time Machine moves to the Events tab',
    detail: "The Time Machine, the reel of what you were playing on this day in past years, now opens the Events tab, right above artist birthdays and anniversaries, instead of sitting at the top of every chart, so the charts start with your stats. It works as before: it scrolls by itself, Songs, Artists and Albums still switch, and its switch in Settings still hides it." },

  { d: '2026-10-14', t: 'design', a: 'charts', h: 'b19c87b',
    title: 'Certified this period comes after the charts',
    detail: "On the Weekly and Monthly charts, the Certified this period reel now sits under the charts and their Bubbling Under, Off the Chart and New Entries sections, so the chart itself is the first thing after your stats. The reel works as before and still scrolls by itself." },

  { d: '2026-10-14', t: 'design', a: 'charts', h: '9bd9454',
    title: 'Release reels live on the Events tab only',
    detail: "The Upcoming and Recent Releases reels no longer sit at the bottom of the Weekly and Monthly charts, so the chart page ends with your charts. Both are still on the Events tab, where clicking a release opens the same menu as before. The Playlists tab now shows the Events tab’s Recent Releases next to Anniversaries, and both fill in without a trip to Events first. Their two switches under Settings → Chart page sections are gone with them." },

  { d: '2026-10-14', t: 'fix', a: 'data', h: '9b75d37',
    title: 'Autocorrect rules always reach your account on page load',
    detail: "If you were signed in, the autocorrect rules read from your Google Sheet when the page opened sometimes failed to save to your account, because the save ran before the account connection was ready. The same could happen to your compilation albums and single/EP choices. These saves now wait for the connection, so nothing is dropped." },

  { d: '2026-10-13', t: 'design', a: 'ui', h: '3cceaae',
    title: 'Every tab starts right at the top',
    detail: "Stats, Records, Awards and the other tabs no longer start halfway down the page under the streak strip and the Time Machine; those stay on the Charts page, and every other tab begins right under the top bar. On a phone, the round scroll-to-top button no longer covers the chart: once you scroll down, the tab you are on turns into an up arrow, and tapping it takes you back to the top. Clicking the tab you are on does the same on a computer." },

  { d: '2026-10-13', t: 'design', a: 'charts', h: 'f4b89be',
    title: 'ON AIR and your streak share one strip',
    detail: "The ON AIR bar and the streak banner are now one strip, about half as tall. On a computer it reads left to right: your streak count, the covers of the plays that built it, then the song on air now, lit up, with its timer and play counts. When nothing is playing it ends at your last play instead. On a phone it is one slim line with the song and your streak count; tap it to open the full version, and it stays the way you left it. Streak labels are now translated too." },

  { d: '2026-10-13', t: 'design', a: 'data', h: 'de962d1',
    title: 'Sync messages pop up instead of sitting in a strip',
    detail: "The strip of sync text at the top of the page is gone. Messages like \"Synced\" or an auto-correct result now pop up in a corner and fade after a few seconds; errors stay until you close them. The automatic refresh every few hours no longer shows anything, but the latest status is in the Sync button's tooltip. Also fixed: pressing Sync when your plays come from an uploaded file said \"No Google Sheet configured\"; it now tells you how many plays are loaded and how to update them." },

  { d: '2026-10-13', t: 'design', a: 'charts', h: '0ff2ecd',
    title: 'Week, month, year and all-time on the date line',
    detail: "The Week, Month, Year and All-time buttons now sit on the same line as the date, so choosing a period and stepping through it happens in one slim bar that stays at the top as you scroll. The date reads on one line, and clicking it still opens the date picker. The keyboard hint under the date is gone; the arrow keys and swiping still work." },

  { d: '2026-10-13', t: 'design', a: 'ui', h: 'dd52101',
    title: 'Five main tabs instead of thirteen',
    detail: "The two rows of thirteen tabs are now five tabs in the top bar: Charts, Stats (what Graphs used to be called), Records, Awards and Soundtrack, plus More for Events, Playlists, Raw Data, the Board and the Charts Guide. Charts takes you back to the chart period you used last, and Week, Month, Year and All-time are picked on the Charts page itself. On a phone the tabs sit in a bar at the bottom of the screen. Number-key shortcuts still work, and each tab's tooltip shows its key." },

  { d: '2026-10-13', t: 'design', a: 'ui', h: '39a55c6',
    title: 'The top bar tucks away when you stop scrolling',
    detail: "The top bar now shows while you scroll and slides out of view after about three seconds of stillness, so it only takes space while you are moving around. Scroll again, or move the mouse to the top edge of the window, and it comes back. It stays put at the top of the page, while one of its menus is open, and while your mouse is over it. The date bar moves up into the free space." },

  { d: '2026-10-13', t: 'design', a: 'ui', h: 'db62c44',
    title: 'A slim top bar instead of the big header',
    detail: "The big header at the top of every page is gone. In its place is a slim bar that stays at the top as you scroll, with Sync, Settings, Theme, Language and your account always one click away. Signed in, your profile picture opens a small menu with Sign out. Click the dankcharts.fm logo to go back to the weekly chart. The all-time numbers that used to sit in the header (total plays, days listened, top artist, streak) now show on the All-Time tab, since they are about all time, not this week." },

  { d: '2026-10-13', t: 'design', a: 'ui', h: '5f09c94',
    title: 'Rounder artist cards, bigger streak covers',
    detail: "Artist of the moment now shows a round picture, like Rising artist next to it, while song and album pictures stay square. The small covers in the streak banner are bigger, so you can tell which songs they are." },

  { d: '2026-10-13', t: 'perf', a: 'charts', h: '0bab8c2',
    title: 'Pictures load faster and find more covers',
    detail: "Cover art fills in about seven times faster: a 100-song chart now loads its pictures in around 3 seconds, and downloads about 50 times less, because each picture is fetched at the size it is shown. What is on screen loads first. When Deezer has no picture, iTunes and Last.fm are now tried everywhere on the site, not only in the charts, and songs with titles like \"Song - Acoustic Version\" or several artists find their cover more often. A busy moment at Deezer no longer swaps covers for lower-quality ones for good, and artists with no photo show their initials instead of Last.fm's grey star." },

  { d: '2026-10-12', t: 'feature', a: 'charts', h: 'd02cebd',
    title: 'Pick any chart size',
    detail: "Each chart's Size menu now has a Custom box under the Top 10 to Top 100 choices. Type any number from 5 to 500 and press Set or Enter, and the chart shows that many entries. It is saved per chart and per period, like the presets. A note under the box reminds you that past peaks, chart runs, debuts and records follow the size you pick." },

  { d: '2026-10-12', t: 'fix', a: 'ui', h: '9b71150',
    title: 'Artist and album tiles open their chart',
    detail: "Clicking the Artists or Albums tile, \"Artist of the moment\", \"Rising artist\" or \"Album of the moment\" now switches to the Artists or Albums chart and scrolls to it. Before, it only worked when that chart was already the one showing." },

  { d: '2026-10-12', t: 'design', a: 'ui', h: '71b1554',
    title: 'Four stat tiles instead of eight',
    detail: "The stat tiles at the top of a chart are now four: Total Plays, Songs, Artists and Albums. Under each big number there is a second row of small stats: how many new songs, artists or albums you found (click to jump to that list, hover for the change since last time), what share of your songs were new, and your best day on Total Plays. Songs is now violet and Artists silver, so their numbers no longer look like the green and red used for going up or down." },

  { d: '2026-10-12', t: 'design', a: 'ui', h: 'c67e639',
    title: 'Calmer colours across the site',
    detail: "Colour now only shows up where it means something: green for going up, red for going down, gold for certifications. Light themes have a much paler page, so covers stand out. The coloured bars on the left of new and returning songs are gone, Bubbling Under tags share one quiet style (only the rising and falling ones keep green or red), and the YouTube button is no longer bright red. In the Red and Pink themes, NEW no longer looks like a drop. \"Artist of the moment\" is easier to read on light themes." },

  { d: '2026-10-12', t: 'fix', a: 'ui', h: '41ebc46',
    title: 'More small text made easier to read',
    detail: "A second check of the text change found spots it had missed: the song, album and artist pop-ups, chart-run panels, raw data, filter chips, settings lists and Records cards on phones, some still under 10px. They now use the same sizes as the rest of the site, 12px or larger. The gold ribbons on the welcome cards and award posters lost their typewriter capitals too." },

  { d: '2026-10-11', t: 'design', a: 'ui', h: 'd7249e6',
    title: 'Easier-to-read text across the site',
    detail: "Small labels, buttons, tabs and headings were set in tiny typewriter capitals, some under 10px. They now use the site's normal font at 12px or larger, without the capitals and wide letter spacing. Numbers like ranks, plays and dates keep the typewriter font, so they still line up in columns. Column headers in tables stay in small capitals." },

  { d: '2026-10-11', t: 'fix', a: 'charts', h: 'cab252c',
    title: 'Chart rows line up on phones',
    detail: 'With the YouTube and playlist buttons switched on, the playlist button dropped below YouTube on a phone, making every row much taller. On phones YouTube now shows just its icon, so the two sit side by side. Peak, certification and score badges that wrap onto their own line now line up with the song title instead of starting a little to the right.' },

  { d: '2026-10-11', t: 'change', a: 'charts', h: '415d92d',
    title: 'Calmer charts by default',
    detail: "A chart row now shows just the rank, movement, cover, title, artist, weeks and plays. Cert badges, your scores, plays peak, peak tags, the YouTube button, the Bubbling Under legend and descriptions all start switched off; turn any of them on in the chart's ⋮ menu, under Show. The playlist + button has its own Playlist switch there now, separate from YouTube. If you had already picked your own settings, they stay as they were. The feature tour switches everything on while it runs so you can see it all, then puts your settings back." },

  { d: '2026-10-06', t: 'fix', a: 'ui', h: 'fe9e692',
    title: "The Board lines up with the rest of the site",
    detail: "The Board tab stretched across the whole window on wide screens. It now has the same width as the charts and the menu above it." },

  { d: '2026-10-06', t: 'feature', a: 'ui', h: '97db66b',
    title: "A community board for suggestions and bug reports",
    detail: "There's a new Board tab next to Playlists. Suggest a feature, report a bug, ask a question or just talk music with other listeners. Vote up the ideas you want most, reply to posts, and see each one's status, from Planned to In progress to Done. Anyone can read the board; you sign in with Google to post, reply and vote. Your name and Google picture show with your posts, never your email. Every post has a Copy link button so you can share it." },

  { d: '2026-10-06', t: 'fix', a: 'ui', h: '97db66b',
    title: "Links to a tab open that tab again",
    detail: "A link straight to a tab, like one ending in #t=awards, opened the Weekly chart instead because of an error while the page loaded. These links now open the tab they point to." },

  { d: '2026-10-06', t: 'feature', a: 'charts', h: 'd554ed9',
    title: 'Open the album from the ON AIR bar',
    detail: "The ON AIR bar now has an Open album button, and clicking the cover does the same. It opens the album page for the song you're playing right now. It only shows up once that album is in your history, so it never opens an empty page." },

  { d: '2026-10-06', t: 'feature', a: 'charts', h: '1053917',
    title: "Share an artist's most played songs",
    detail: "Artist pages now have a Share songs button above their songs. It makes the same kind of image as an album's Share tracks, for the artist's most played songs (up to 50). In the Mosaic design every tile shows the cover of the album or single that song is from; Cover Puzzle, Ranking, Podium and Tracklist use the artist's photo. You can pick where the photo comes from or upload your own, and every other option works the same as on albums." },

  { d: '2026-10-05', t: 'fix', a: 'charts', h: '83840b7',
    title: "Filmstrip scores and details are easier to read",
    detail: "In the Filmstrip chart view, the score chip and the details that open under each card (weeks on chart, all-time plays) were tiny. They are now noticeably bigger." },

  { d: '2026-10-05', t: 'feature', a: 'charts', h: 'de567a5',
    title: "Pick the picture for track play images, now in full colour",
    detail: "The Mosaic and Cover Puzzle designs now use the picture in its own colours instead of black and white (black and white is still an option). A new Picture setting lets you choose the album cover from Deezer, iTunes or Last.fm, the artist's photo, or upload your own image." },

  { d: '2026-10-05', t: 'fix', a: 'ratings', h: '9124a29',
    title: "Scores on card-grid covers are easier to read",
    detail: "In the Card Grid view of songs and albums, your score on each cover used to be a faint see-through chip that disappeared on bright or busy artwork. It now sits on a dark backing with a solid coloured edge and slightly bigger numbers, so it stands out on any cover." },

  { d: '2026-10-05', t: 'feature', a: 'charts', h: '15957b9',
    title: "Share how much you've played every track of an album",
    detail: "Albums now have a Share tracks button above their track list. It makes an image of every song with its play count, in five designs: Mosaic (the cover on every tile with the song and its count, like the 'my plays on every song' posts), Cover Puzzle (one cover cut into a tile per song), Ranking, Podium (top three on pedestals) and Tracklist (in album order). You can show the counts as plays, streams or scrobbles, make the tiles black and white, add each song's share of the album, and pick the size and colours." },

  { d: '2026-10-05', t: 'design', a: 'ratings', h: '5d29f3a',
    title: "Top scores are now green instead of gold",
    detail: 'The best scores (9.0 and up) used to be gold, which looked a lot like the yellow used for middling scores, so a 10.0 could read as an average one. Score colours now run from worst to best as red, orange, yellow, teal, blue and green, with the top scores in full green and 8s in a softer green. The share images follow the same colours.' },

  { d: '2026-10-04', t: 'feature', a: 'ratings', h: '90bf474',
    title: "Share an artist's whole discography of scores as an image",
    detail: 'Artists with rated albums now have a "Share scores" button in their ratings section. It makes a picture of every album you rated: one column per album with its cover and year, one coloured tile per track, and each album\'s score along the bottom, like a ratings chart for a TV series. Choose how many albums go on each page, the order (release year, first played or score), and whether the bottom row shows the album score, the track average or both. Singles and partly rated editions are left off unless you tick them in the album list. Pick from two designs, any palette and post, portrait or story size, then download one page or all of them.' },

  { d: '2026-10-04', t: 'feature', a: 'charts', h: 'd809690',
    title: "Artist charts: clickable names and a song ranking per artist",
    detail: 'In the artist charts, the artist name is now a link to their page (clicking anywhere else on the row still works too). The song count next to each artist is clickable as well: it opens a small ranking of that artist\'s songs you played in that week, month or year, most played first. Click a song in the list to open its page.' },

  { d: '2026-10-04', t: 'feature', a: 'charts', h: 'db9f019',
    title: "Album names in song charts open the album page",
    detail: 'In the song charts, the album name next to each song is now a link. Click it to open that album\'s page, the same way song and artist names already work.' },

  { d: '2026-10-04', t: 'feature', a: 'ratings', h: 'e0be351',
    title: "You can rate an artist's albums straight from their page",
    detail: 'In an artist\'s ratings section, clicking a rated album now opens its rating editor, and a new "Not rated yet" list shows the albums you have not scored, most played first, each ready to rate in one click. The small arrow on each row still opens the album page.' },

  { d: '2026-10-04', t: 'fix', a: 'ratings', h: 'e0be351',
    title: "Song names in your ratings keep their real capitalisation",
    detail: 'Rated songs showed up all in lowercase in a few places, like the top rated songs on an artist\'s page, the song rating editor and the ratings library in the Graphs tab. They now appear exactly as they are spelled in your library.' },

  { d: '2026-10-04', t: 'feature', a: 'ratings', h: '71ed437',
    title: "Long song titles on the Grid score image can shrink to initials",
    detail: 'The Grid design of the album score image has a new option, "Shorten long titles to initials". Any song title too long for its row becomes the first letter of each word, so "Nice To Meet You (feat. Lainey Wilson)" shows as NTMY. Titles that already fit are left as they are.' },

  { d: '2026-10-04', t: 'feature', a: 'ratings', h: 'e8ac289',
    title: "A Grid design for sharing an album's score",
    detail: 'The album score image has a fourth design, Grid. Every track is a coloured tile with its score, in the order it appears on the album, with a colour key on top and grey tiles for songs you have not rated yet. Song titles can sit beside the tiles or be left off. At the top you choose to show the album score, the plain average of your track scores, or both. Long albums shrink to fit, and the window suggests the story size when the tiles would get small.' },

  { d: '2026-10-04', t: 'feature', a: 'ratings', h: 'c2b1f9c',
    title: "You can share an album's score as an image",
    detail: 'Rated albums now have a "Share score" button next to "Edit rating". It makes a picture of your verdict: the score and what it means, your review note, the peak and weakest tracks, the album aspects and every track score. Pick from three designs, all the colour palettes and post, portrait or story size, then copy, share or download it.' },

  { d: '2026-10-04', t: 'fix', a: 'player', h: '196d4ad',
    title: 'YouTube plays no longer claim to be scrobbled when they were not saved',
    detail: 'If you play a song in the YouTube player without Last.fm scrobbling or a Google Sheet connected, the player used to say "Scrobbled" even though the play was never added to your charts. It now tells you the play was not saved, with a link to connect Last.fm, and the countdown ring only appears when the play can actually be saved.' },

  { d: '2026-10-04', t: 'feature', a: 'settings', h: 'e0efde1',
    title: 'Your week start day follows you to every device',
    detail: 'When you are signed in, the day your weekly charts start on is saved to your account like your other settings, so every device cuts the weeks the same way. A day or timezone changed on another device now applies as soon as you sign in, without reloading the page.' },

  { d: '2026-10-04', t: 'fix', a: 'charts', h: '9728d27',
    title: 'Changing your timezone now updates everything at once',
    detail: 'After changing your timezone, the New Songs, New Artists and New Albums lists could keep using the old one until you reloaded the page, and with a CSV upload the charts did not redraw at all. Everything now updates as soon as you save. Time Machine also follows your chosen timezone instead of your device clock.' },

  { d: '2026-10-04', t: 'change', a: 'settings', h: '09a158c',
    title: 'Week start day moved to Settings',
    detail: 'The Start Day button is gone from the top of the page. Pick the day your weekly charts begin under Settings → Charts → Chart Week instead. It still applies straight away, and your current choice is kept.' },

  { d: '2026-10-03', t: 'perf', a: 'ratings', h: '70f548e',
    title: 'The rating editor closes instantly',
    detail: 'Closing or saving a rating used to freeze the window for a second or more while the whole chart redrew behind it. It now closes right away, the album or song window shows the new score at once, and the chart updates once you are back on it. Moving sliders while rating an album is quicker too.' },

  { d: '2026-10-03', t: 'fix', a: 'share', h: '9b1ce11',
    title: 'Month names on chart share images follow your language',
    detail: 'Share images of a monthly chart showed the month in your browser’s language instead of the one picked in dankcharts. They now use the site language.' },

  { d: '2026-10-03', t: 'feature', a: 'awards', h: 'a2f0f9c',
    title: 'New award: Best Song Heard in Concert',
    detail: 'An opt-in My Grammys category for the song that hit hardest live, at a concert you went to that year. Find it in Configure Year under Your listening.' },

  { d: '2026-10-03', t: 'feature', a: 'awards', h: 'bacb5f5',
    title: 'Clear the nominee picker search in one click',
    detail: 'The search box in the nominee picker has an × that empties it and brings back the full list.' },

  { d: '2026-10-03', t: 'i18n', a: 'settings', h: '8df4e57',
    title: 'Settings in your language',
    detail: 'The whole Settings window is now translated into Spanish and both Portuguese variants: all three tabs, the Google Sheets setup steps, the Last.fm connection messages, upload status and backups. Switching language updates it straight away, even while it is open.' },

  { d: '2026-10-03', t: 'feature', a: 'settings', h: 'f64e490',
    title: 'Choose which sections the charts page shows',
    detail: 'Settings → Charts has a new Chart page sections group with a switch for each of Time Machine, the period stats cards, Certified this period, Upcoming releases and Recent releases. Turn any of them off to hide it from the charts page. The Events tab keeps its own Upcoming and Recent releases either way. Changes apply straight away and are remembered on all your devices.' },

  { d: '2026-10-03', t: 'feature', a: 'charts', h: '750643b',
    title: 'Hide chart descriptions',
    detail: 'The Show tab of each chart’s ⋮ menu has a new Descriptions switch. Turn it off to hide the short explanations under that chart’s headings, like “By total play count across all tracks”. Songs, artists and albums are set separately, and the choice is remembered on all your devices.' },

  { d: '2026-10-03', t: 'feature', a: 'charts', h: 'b4ac5c4',
    title: 'Printable PDF of any chart',
    detail: 'Every chart now has a Printable PDF button next to Share as image. Choose just that chart or all three (songs, artists and albums, each on its own page), and whether to include cover art and the Bubbling Under list. Your print window then opens; pick Save as PDF to download it. The PDF lists every entry with its movement, plays, weeks and peak, in clean black-on-white that prints well, and names in any language show correctly.' },

  { d: '2026-10-03', t: 'fix', a: 'share', h: 'b12169d',
    title: 'Share button works on phones',
    detail: 'On phones, the Share button on share images showed an hourglass and never opened anything. The image is now prepared in the background while you look at the preview, so tapping Share opens your phone’s share sheet right away — pick Instagram for Stories or WhatsApp for Status. If you tap before it’s ready, the button changes to Tap to share once it is.' },

  { d: '2026-10-03', t: 'perf', a: 'share', h: 'e8eb486',
    title: 'Share images download much faster',
    detail: 'Downloading, copying or sharing a share image used to take several seconds, and longer the bigger your library, because the whole page was copied behind the scenes before the image was drawn. Now only the card itself is copied, so images are ready in about half a second. The images look exactly the same as before.' },

  { d: '2026-10-03', t: 'feature', a: 'awards', h: 'b052e5a',
    title: 'Favorite award categories',
    detail: 'Any My Grammys category can be starred as a favorite: from its card in Configure Year, from the header of its nominee card, or from the top of the nominee picker. Favorites stay the same from year to year and sync across your devices. In Configure Year, the new Favorites filter shows just your starred categories, and the Favorites only button turns those on and every other category off, so setting up a new year with your usual awards takes one click. Nominees you already picked are kept.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: 'a24da91',
    title: '14 new awards: Gospel & Christian and Instrumental groups',
    detail: 'My Grammys has two more groups in Configure Year. Gospel & Christian adds Best Gospel Song and Album, Best Contemporary Christian Song and Album, Best Worship Song, Christian/Gospel Artist of the Year, Best Christian Hip-Hop Song and Best Gospel/Christian Collaboration. Instrumental adds Best Instrumental Song, Best Instrumental Version (instrumental and karaoke versions, found by the song title), Best Lo-Fi/Chill Beats, Best Piano Piece, Best Video Game Music and Best Instrumental Composition, and now holds the Jazz and Classical/Instrumental album awards too.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: 'a24da91',
    title: '30 new awards: a Pop group and a Videos group',
    detail: 'My Grammys has two new groups in Configure Year. Pop gathers the existing pop awards and adds Pop Artist of the Year, Best New Pop Artist, Best Pop Debut Album, Best Pop EP, Best Pop Remix, Best Pop Ballad, Best Pop Vocal Performance, Best Pop Hook/Chorus and style awards for synth-pop, Latin pop, alt-pop, hyperpop and art pop. Videos adds VMA-style awards: Best Pop, Hip-Hop, R&B, Rock, Alternative, Latin and K-Pop Video, Best Collaboration Video, Best New Artist Video, Best Direction, Choreography, Cinematography, Art Direction, Visual Effects and Editing, Best Live Performance and Best Music Film. There is no video data, so the field is your songs and the pick is yours. Artist genre awards now also read the genres typed into your sheet.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: 'a24da91',
    title: 'Two holiday awards: Best Holiday Season Song and Album',
    detail: 'My Grammys has two new opt-in categories. A song or album is in the running when its title mentions Christmas, New Year’s and the like, or when you played it in the holiday season, from December 11 to January 14. Holiday titles count every play of the year; anything else counts only its plays in the season. A Christmas album counts as holiday even when the song titles don’t say so.' },

  { d: '2026-10-02', t: 'fix', a: 'awards', h: '68900db',
    title: 'Audio samples no longer pick live recordings with plain titles',
    detail: 'In My Grammys, the play button could still play a live version when a store listed it under the plain song name and only the album said live. I Write Sins Not Tragedies by Panic! at the Disco was one: the sample came from a live session single. Samples now also check which album a recording comes from, and pass over live, acoustic, remix and demo albums unless the nominee is from one of them. The album lookup now searches Apple Music as well as Deezer.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: 'cff6fbd',
    title: 'Album records show what their songs earned',
    detail: 'In the awards summary, the album record cards now add a small line such as “+3 from its songs” when songs from that album were nominated or won too. Only the album’s own nominations and wins count toward the record, the same way the real Grammys count, so a big album with a few hit singles does not take the album records on its songs alone.' },

  { d: '2026-10-02', t: 'design', a: 'ui', h: 'eb4de18',
    title: 'The arrow-keys hint now sits inside the date bar',
    detail: 'The "arrow keys to navigate periods" reminder (or "swipe to navigate" on a phone) now sits inside the date bar, right under the date range, instead of floating on its own between the date bar and the stat cards.' },

  { d: '2026-10-02', t: 'design', a: 'charts', h: '51f2e6e',
    title: 'The stats at the top of each chart have a cleaner, more modern look',
    detail: 'The stat cards under the date bar lost their glowing outlined labels. Each one now has a small tinted icon and a bigger, easier-to-read title, and the change from last period sits in a small coloured pill. The two rows of cards no longer touch, and every row of cards is evenly spaced. The New Albums card is now called New Albums & Singles, to match the Albums & Singles card above it.' },

  { d: '2026-10-02', t: 'design', a: 'ui', h: '51f2e6e',
    title: 'Tidier view tabs and date bar',
    detail: 'The second row of view tabs is a step smaller again, as it was meant to be, so Your Soundtrack fits on one line on wide screens, and a stray line at the end of the More/Less bar is gone. The dots that mark tabs with new content sit in the corner of each tab instead of pushing its name off-centre. The date bar is now its own rounded card with square arrow buttons, instead of a strip hanging off the bottom of the tabs.' },

  { d: '2026-10-02', t: 'design', a: 'charts', h: 'c9025cb',
    title: 'The Chart Run panel has a cleaner, more modern look',
    detail: 'The Chart Run that opens under an entry is now its own rounded card. The range buttons are one switch with the chosen option highlighted, and the streak tabs work the same way. The weeks on chart, total plays, peak and other figures sit in small tiles with the number on top. Each week is a soft rounded chip: the peak is gold and other top-3 weeks are tinted, so the best stretch stands out. Time off the chart shows as a faint dotted break. Streak Records, Listening Heatmap and Full Streaming History are rounded cards with an arrow that turns when opened.' },

  { d: '2026-10-02', t: 'design', a: 'charts', h: 'c9025cb',
    title: 'The chart tables have a cleaner, more modern look',
    detail: 'The Table view no longer looks like a spreadsheet. Each entry is a rounded strip with a little space between rows, and the column lines and filled header are gone. The top three rows are tinted gold, silver and bronze in colours that also work on light themes, and the number 1 has a gold foil look. Movement in the Previous column, including no change, shows as small coloured pills, and Peak tags are rounded. On the weekly Artists and Albums charts, the Plays Peak tag now sits under the play bar, the same as on Songs.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: 'b5b282f',
    title: 'Real-Life Awards now cover the BRIT Awards',
    detail: 'Real-Life Awards has a ninth tab, BRIT, for the BRIT Awards: the first show in 1977, then every year from 1982 to now. The year arrows skip 1978 to 1981, when there was no show. It shows which of your artists were nominated and what they won, then every category of the night with the winners in bold and your artists marked. Each year is matched against your plays from the twelve months before the show. Category names no longer list who presented them, on any tab. If Wikipedia is briefly busy, the tab now waits a moment and tries again before showing an error.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: '7244db5',
    title: 'Real-Life Awards now cover the Juno Awards',
    detail: 'Real-Life Awards has an eighth tab, Juno, for Canada\'s Juno Awards, covering every year from 1971 to now. There was no show in 1988, and the tab says so. It shows which of your artists were nominated and what they won, then every category of the night with the winners in bold and your artists marked. Ties show every winner, like 1981\'s Single of the Year, which went to both Anne Murray and Martha and the Muffins. Each year is matched against your plays from the twelve months before the show. Winners and nominees come from Wikipedia.' },

  { d: '2026-10-02', t: 'fix', a: 'awards', h: '2f3eea1',
    title: 'Real-Life Awards only credit the artist who was actually nominated',
    detail: 'On the VMAs, AMAs, iHeartRadio, World Music, Billboard and ARIA tabs, an artist with a one-word name could be credited with someone else\'s nomination when their name was part of a longer one. For example, an artist called Selena picked up Selena Gomez\'s nominations, and Max picked up Max Martin\'s. Each nomination is now split into the artists it names, and only a full name match counts. Shared credits still count for everyone named, so Rosé and Bruno Mars both get Apt., and names like Earth, Wind & Fire and Lil Nas X stay in one piece.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: '2f3eea1',
    title: 'Real-Life Awards now cover the ARIA Music Awards',
    detail: 'Real-Life Awards has a seventh tab, ARIA, for Australia\'s ARIA Music Awards, covering every year from 1987 to now. It shows which of your artists were nominated and what they won, then every category of the night with the winners in bold and your artists marked. Hall of Fame inductees count as winners. Each year is matched against your plays from that calendar year. This year\'s nominees are already listed, and the winners will appear once the show has happened. Winners and nominees come from Wikipedia.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: '3545048',
    title: 'Real-Life Awards now cover the Billboard Music Awards',
    detail: 'Real-Life Awards has a sixth tab, Billboard, for the Billboard Music Awards. Wikipedia lists the winners and nominees for 1990, 1991, 1999, 2001 to 2006, and every year from 2011 to 2024, and the year arrows skip the years in between. Later years are offered too, so a new show appears once Wikipedia has a page for it. Each year is matched against your plays from the twelve months before the show. When Wikipedia does not say who won a category, the nominees are shown with no winner instead of a guess.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: '8efc477',
    title: 'Real-Life Awards now cover the World Music Awards',
    detail: 'Real-Life Awards has a fifth tab, World Music, for the World Music Awards. The show ran on and off until 2014, and Wikipedia only lists winners for ten of those years: 1999, 2001, 2003 to 2008, 2010 and 2014. The year arrows and the year picker jump straight between those years. Most years list only the winners, but some also list nominees or runners-up. Each year is matched against your plays from that calendar year, or from the twelve months before the show when the page gives its date. On a phone, the five show tabs now wrap onto a second row so none get cut off.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: '692bc04',
    title: 'Real-Life Awards now cover the iHeartRadio Music Awards',
    detail: 'Real-Life Awards has a fourth tab, iHeartRadio, next to Grammys, VMAs and AMAs. Pick a year from 2014 on to see which of your artists were nominated and what they won, then every category of the night with the winners in bold and your artists marked. Each year is matched against your plays from the twelve months before that show. Remixes and covers keep their note, like Savage (Remix), so a cover is credited to the artist who sang it and not the original artist. Winners and nominees come from Wikipedia.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: '79cf383',
    title: 'Real-Life Awards now cover the American Music Awards',
    detail: 'Real-Life Awards has a third tab, AMAs, next to Grammys and VMAs. Pick a year from 1974 on to see which of your artists were nominated and what they won, then every category of the night with the winners in bold and your artists marked. The AMAs have moved around the calendar over the years, so each year is matched against your plays from the twelve months before that show. 2003 had two shows, and both are listed. There was no show in 2023 or 2024, and the tab says so. Winners and nominees come from Wikipedia.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: '6fc55fc',
    title: 'Real-Life Awards now cover the MTV VMAs',
    detail: 'Real-Life Awards has two tabs now: Grammys and VMAs. Pick a year from 1984 on and the VMAs tab shows every artist you played that season who was nominated, with what they won, then every category of the night with the winners in bold and your artists marked. The season runs July to June, like the awards themselves. Winners and nominees come from Wikipedia, and a year only loads once.' },

  { d: '2026-10-02', t: 'fix', a: 'awards', h: '21c0f33',
    title: 'Real life Grammys show up again',
    detail: 'In Awards, Real Life Awards had stopped showing any Grammy wins or nominations, because grammy.com changed how its search hands back artist pages. The lookup now handles the new format, so every artist’s Grammy history loads again.' },

  { d: '2026-10-02', t: 'fix', a: 'awards', h: '8a7e42e',
    title: 'Audio samples find the right recording more often',
    detail: 'In My Grammys, the play button on a nominee now also looks up the album itself and plays from its tracklist, title track first. Before, an album whose songs are also on a compilation, like To the Summit by Jon Schmidt, could come up with no sample at all. A song whose search only turned up live or acoustic versions now also checks its own album for the studio version, so I Write Sins Not Tragedies by Panic! at the Disco plays the real song instead of a live take. A remastered version now counts as the original.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: '9eebb3c',
    title: 'Nominee picker shows the year and genres for every candidate',
    detail: 'In My Grammys, every song and album in the nominee picker now shows its release year next to the artist, and every candidate shows up to three genres, not just the suggested ones at the top. Genre categories still show up to five. Genres from your Google Sheet show right away. The rest are looked up online as you scroll, so a row can fill in a second or two after it appears. Answers are saved in your browser, so the next time you open the picker they show instantly.' },

  { d: '2026-10-02', t: 'change', a: 'awards', h: '95e153d',
    title: 'Clearing the nominee picker now asks first',
    detail: 'In My Grammys, the Clear button in the nominee picker now opens a small warning window over the picker, Remove all nominees?, with Cancel and Remove all buttons, before it removes every nominee from the category. Cancel is picked by default, and Escape or a click outside the window also cancels. One stray click, or a double-click, no longer wipes a ballot you built by hand. If there are no nominees yet, it does nothing.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: '2e140e6',
    title: 'Nominee picker shows how well each candidate fits the category',
    detail: 'In My Grammys, the nominee picker now puts a small fit tag next to each candidate in genre categories and in Song of the Summer and the night and morning songs, for example 92% fit. For a genre award it says how strongly the song, album or artist is tagged with that genre: a genre listed first counts more than one listed fifth, and a close relative like metal for Best Rock Song counts a little less than rock itself. For Song of the Summer it is the share of the song’s plays that landed in June to August, and the night and morning songs work the same way. Strong fits show in gold. Hover a tag to see what it measures. Categories that are a plain yes or no, like Best Collaboration or Best Cover, do not get one.' },

  { d: '2026-10-02', t: 'feature', a: 'awards', h: '8683e78',
    title: 'Each category card now says what it is about',
    detail: 'In My Grammys, every category card shows a short line under its name on what belongs in it, so you know what to look for when picking nominees. Genre awards describe how the genre sounds, for example Grunge says sludgy, distorted 90s guitars full of angst. Categories that pull from the same songs now read differently too: Song of the Year is about the writing, Record of the Year about the performance and production, and Rock Ballad and Guitar Riff/Solo each say what to listen for. The same lines show in the category list.' },

  { d: '2026-10-01', t: 'feature', a: 'awards', h: '4d3eb10',
    title: 'Expand all and Collapse all can skip categories that already have a winner',
    detail: 'In My Grammys, the Expand All and Collapse All buttons now have an All / No Winner switch in front of them. On All they work on every category, as before. On No Winner they only open or fold the categories still waiting on a winner, and leave the decided ones as they are. The switch is remembered on this device.' },

  { d: '2026-10-01', t: 'feature', a: 'awards', h: '765bb09',
    title: 'See how many categories still need a winner, and fold or open them all at once',
    detail: 'The bar above your My Grammys categories now shows how many are still waiting on a winner, for example 3/12 left to decide. It counts down as you crown winners and turns gold once every category is decided. Next to it are Expand All and Collapse All buttons, which open or fold every category card on screen in one click.' },

  { d: '2026-10-01', t: 'feature', a: 'awards', h: '931e8cc',
    title: 'Hide categories that already have a winner, or fold any card away',
    detail: 'My Grammys has a new Hide Decided switch next to the view picker. Turn it on and every category that already has a winner disappears, so only the ones you still need to vote on are left. The switch shows how many it is hiding. Each category card also has a small arrow in its corner that folds the card down to just its name, and a second click opens it again. Folded cards stay folded on this device until you open them.' },

  { d: '2026-10-01', t: 'fix', a: 'ui', h: '65e14ea',
    title: 'Contact Support now opens a message form',
    detail: 'The support chat stopped working, so Contact Support now opens a short form instead: enter your email and your message, press Send, and it reaches us by email. We reply straight to the address you entered. If you are signed in, your email is filled in for you. It works on the main site and in the setup guide.' },

  { d: '2026-10-01', t: 'fix', a: 'charts', h: '9c160f4',
    title: 'Missing covers no longer use up the YouTube search limit',
    detail: 'When a cover could not be found on Deezer, iTunes or Last.fm, the site searched YouTube for it as a last try. Everyone on the site shares one small daily YouTube limit, so a single big chart with many rare songs could use it all up in minutes, and YouTube image searches then stopped working for the rest of the day. Covers now only search Deezer, iTunes and Last.fm on their own. You can still pick a YouTube picture by hand in the image picker, and anything you already set to YouTube keeps it.' },

  { d: '2026-10-01', t: 'fix', a: 'awards', h: '0e5c7f4',
    title: 'My Grammys works again after the Artist stats update',
    detail: 'After the Artist of the Year stats update, parts of My Grammys stopped working: the category summaries and the winners list could fail to load, and the console filled with errors. Two pieces of code had ended up with the same name, so one replaced the other. They now have separate names and everything loads again.' },

  { d: '2026-10-01', t: 'change', a: 'awards', h: 'e59f179',
    title: 'Nominee suggestions show all five genres',
    detail: 'In genre categories of My Grammys, each suggested nominee used to show only its first three genres. It now shows up to five, so every genre from your Google Sheet (Genre 1 to Genre 5) is there, along with tags from Last.fm or a CSV file. When a row has a lot of genres, they wrap onto a second line instead of squeezing the song title, artist or play count.' },

  { d: '2026-10-01', t: 'fix', a: 'awards', h: 'a028294',
    title: 'Nominee suggestions are readable on phones',
    detail: 'On a phone, the list of suggested nominees in My Grammys tried to fit the song title, artist, genre tags, plays and buttons on one line, which squeezed the title so narrow that it was written one letter per line. Now the title gets its own line next to the cover, and the artist, tags, plays and buttons sit on the lines below it.' },

  { d: '2026-10-01', t: 'feature', a: 'awards', h: 'd8d9c4b',
    title: 'Artist of the Year stats show highlights, growth, plaques and records',
    detail: 'When you open the Stats card for an artist in the Artist of the Year picker, it now tells their whole story. Highlights come first as badges, such as a breakout year, their biggest year ever, #1 hits and albums, top 10 hits, new plaques, long streaks and their biggest song. Year by year shows one bar for every year since you first played them, with their artist rank under each bar and how much they grew or dropped compared with the year before. Certifications lists every plaque their songs and albums earned that year, along with their all-time total. Records they hold lists every record they have on your Records tab, with medals for first, second and third place.' },

  { d: '2026-10-01', t: 'design', a: 'awards', h: 'ea22ea8',
    title: 'Award nominee stats are easier to read',
    detail: 'When you pick nominees in My Grammys, the line under each suggestion used to be a run of abbreviations like "8 days · 5 wk · 4 mo · peak #1 · 1 wk at #1". It is now a few short labels in plain words, such as "#1 for 1 week", "4 days in a row" and "Played on 8 days", with the biggest one first. The Stats card that opens under a row is easier to follow too: it starts with where the song ranked in the year and how many plays it had, then shows plays per month with the count on each bar, then your listening habits, then how it did on your weekly and monthly charts.' },

  { d: '2026-10-01', t: 'fix', a: 'awards', h: '74299e2',
    title: 'Genre awards follow the genres in your Google Sheet',
    detail: 'If your Google Sheet has Genre 1 to Genre 5 columns, the genre awards in My Grammys now use them, so a genre you change in the sheet changes which songs and albums qualify. Before, the sheet’s genres were ignored and every song took its artist’s tags from Last.fm, so editing them had no effect. A song uses the genres on its most recent row that has any, and an album fits a genre when at least half of its tagged songs do. Songs with no genres in the sheet still fall back to the artist’s tags. Spelling no longer matters either: Dance-Pop, dance pop and dancepop all count as the same genre. Nominees you already picked stay as they are, so clear and re-pick a category to refresh it.' },

  /* ========== SEPTEMBER 2026 ========== */

  { d: '2026-09-30', t: 'change', a: 'awards', h: '87a0fa9',
    title: 'Genre awards say what the genre sounds like',
    detail: 'In Configure Year, every genre award used to carry the same line, "By the artist’s genre tags". Each one now describes its genre instead, so Best Shoegaze/Dream Pop Song reads "Hazy walls of guitar and soft, floating vocals" and Best Post-Punk/New Wave Song reads "Dark, angular guitars, driving bass and cold 80s synths". Nominees are still picked the same way.' },

  { d: '2026-09-30', t: 'fix', a: 'settings', h: 'fbdf73b',
    title: 'Backups work again with big awards collections',
    detail: 'Once your awards grew past a certain size, backups in Settings → Profile quietly stopped being saved, because the whole backup no longer fit in one piece. Big backups are now split into several pieces and put back together when you restore, so they save again however many categories you have. Older backups still restore as before.' },

  { d: '2026-09-30', t: 'feature', a: 'awards', h: '58bdbb8',
    title: 'Play samples from My Grammys nominee cards',
    detail: 'Configure Year has a new switch, Play samples from nominee cards. With it on, every nominee gets a ♪ button that plays a 30-second preview, so you can hear the field before you pick a winner. Click it again to stop. It works in all five views, and clicking the ♪ never crowns the nominee. It is off to start with, applies to every year and syncs across your devices.' },

  { d: '2026-09-30', t: 'feature', a: 'awards', h: '58bdbb8',
    title: 'Show your scores on My Grammys nominee cards',
    detail: 'Configure Year has a new switch, Show my scores on nominee cards. With it on, every nominee you have rated shows your score out of 10 next to it, in all five views. Songs and albums you have not rated show nothing, and artists use the average of their rated albums. It is off to start with, applies to every year and syncs across your devices.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: 'f972b11',
    title: 'Hide plays on My Grammys nominee cards',
    detail: 'Configure Year has a new switch, Hide plays on nominee cards. With it on, the nominee cards stop showing play counts, so the ballot is about your picks rather than the numbers. The nominee picker still shows plays, and suggestions work the same. The setting applies to every year and syncs across your devices.' },

  { d: '2026-09-29', t: 'change', a: 'awards', h: 'f972b11',
    title: 'Most Viral Song is now Favorite Viral Song',
    detail: 'The Most Viral Song award in My Grammys is now called Favorite Viral Song. Nominees and winners you already picked are kept.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: '1e99a27',
    title: 'Best Collaboration suggests real team-ups, not duets',
    detail: 'Generate Nominees used to suggest any song with two or more artists for Best Collaboration, so duets turned up there as well as in Best Duo. It now suggests team-ups where only one artist really sings because the other is a DJ or producer (David Guetta, Tiësto, benny blanco), and songs where one of the artists is a group or band. Each artist is checked on MusicBrainz, and each nominee says why it qualified ("with a DJ/producer" or "with a group"). The first time can take up to a minute, since MusicBrainz allows one lookup a second; the answers are remembered in this browser, so after that it takes seconds. You can still add any song by hand. Also fixed: a band name with "&" in it, like Simon & Garfunkel, is no longer split into two artists.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: 'd899a03',
    title: 'Goth Rock song and album awards',
    detail: 'My Grammys has two new rock categories, Best Goth Rock Song and Best Goth Rock Album, off by default and listed in the Rock group under Configure Year. They count artists tagged gothic rock, deathrock, darkwave or gothic metal. Early goth bands tagged post-punk can still be nominated for Post-Punk/New Wave as well.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: '3fd0ea7',
    title: '16 rock award categories and a Rock group in Configure Year',
    detail: 'My Grammys has 16 new rock categories, all off by default. Songs: Pop/Rock, Pop-Punk, Indie Rock, Classic Rock, Hard Rock, Post-Punk/New Wave, Grunge/90s Alternative and Shoegaze/Dream Pop. Albums: Indie Rock, Metal, Punk/Emo and Prog/Psychedelic Rock. Ceremony picks: Best Rock Performance, Best Rock Ballad and Best Guitar Riff/Solo, chosen by you from the year\'s rock songs, and Best Rock Duo/Group Song, rock songs by bands and duos (MusicBrainz tells bands from solo artists). Best Metal/Hard Rock Song is now Best Metal Song, since hard rock has its own award. All rock awards, old and new, now sit together in a Rock group in the Configure Year list.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: 'c5dbc1a',
    title: 'Configure Year: search, filter and browse the award categories',
    detail: 'The category list under Configure Year is now easier to get around. Type in the search box to find a category by name or by what it is about ("rock", "album", "cover"). Narrow the list to song, album or artist categories, or to the ones that are on or off, and use the chips to show one group at a time. Categories are grouped into Main awards, Genres, Albums & formats, Song types, Your listening, Just for fun and Stat awards, each with its own All on / All off. Every category is now a card with a line on what it is built from and a switch. Enable All and Disable All work on whatever is showing, so searching "rock" and pressing Enable shown turns on every rock award at once.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: '27a776b',
    title: '22 new award categories, and Most Growth shows the change on the year before',
    detail: 'My Grammys has 22 new categories, all off by default: turn them on under Configure Year. New genres: Indie Pop, Metal/Hard Rock, Punk/Emo, Afrobeats and J-Pop/Anime songs, and Jazz and Classical/Instrumental albums. Album formats: Best EP, Best Live Album, Best Debut Album (an artist\'s first album in your library, released this year or last), Best Reissue/Remaster and Best Compilation/Greatest Hits. Song types: Best Cover Song and Best Acoustic/Stripped Version (told apart by the title), Best Throwback (albums released 10+ years earlier), Best Deep Cut (album tracks you never played as a single) and Best Breakup Song. From your listening: Best Night Song (10pm to 4am), Best Morning Song (5am to 11am) and Most Loyal Artist (played every month). Just for fun: Guilty Pleasure of the Year, and Most Underrated Song, which uses Deezer\'s popularity to find songs you loved that few others play. Most Growth now shows each nominee\'s change on the year before, as a percentage and in plays, on the cards and in the Pick nominees window. It also no longer misses plays from the last day of the year before.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: '27a776b',
    title: 'Folk/Acoustic, Singer-Songwriter and Deluxe Album awards',
    detail: 'My Grammys has five new categories, all off by default: turn them on under Configure Year. Best Folk/Acoustic Song and Best Folk/Acoustic Album cover folk-pop and acoustic artists, and Best Singer-Songwriter Song is a wider net for acoustic and piano songwriters who are not tagged folk. Best Deluxe Album and Best Deluxe Album Cover are for deluxe, expanded, anniversary and other special editions, spotted by the album title ("Deluxe", or a bracketed "… Edition"). A deluxe edition that does not say so in its title can still be picked by hand.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: 'c1d3cc8',
    title: 'Most Viral Song award, and Album You Discovered Late is now Best Album Discovered Late',
    detail: 'My Grammys has a new Most Viral Song category, off by default: turn it on under Configure Year and pick your nominees from the songs you played most that year. The Album You Discovered Late category is now called Best Album Discovered Late, with the same rules as before.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: '524c95e',
    title: 'Reorder the nominees right on the category cards',
    detail: 'The order of the nominees on a My Grammys category card, which is also the order the ceremony follows, can now be changed on the card itself instead of in the Pick nominees window. With a mouse, drag a nominee onto another one\'s place, in any view. On a phone or with the keyboard, press Reorder at the bottom of the card to get arrow buttons on each nominee, then Done when you\'re finished. While Reorder is on, clicking a nominee doesn\'t crown it.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: '5e9317c',
    title: 'Year stats for every candidate when picking Song, Album and Artist of the Year',
    detail: 'When you pick nominees for Song of the Year, Album of the Year or Artist of the Year, every row now shows how it did over the year: its longest streak of days in a row, how many days, weeks and months you played it, its best weekly chart position and weeks at #1, and its biggest day. The Stats button opens everything else: its play rank for the year and share of your plays, longest weekly streak, biggest day, week and month, first and last play, how many songs and albums of an artist you played or how many tracks of an album, its weekly and monthly chart records, and a bar for each month. You can also sort the list by longest streak, most days played, biggest day, most weeks at #1 or best chart peak. Everything counts only the plays inside the eligibility window set for that year.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: 'af64473',
    title: 'Change the picture of any nominee in My Grammys',
    detail: 'Every picture in the Spotlight, Tiles, Collage and Reel views, and every thumbnail in the Pick nominees window, now has the same picture picker as the charts: hover over it and click the pencil, or press and hold it on a phone. Clicking the pencil never crowns or adds the nominee. The picture you choose is used for that song, album or artist everywhere in the app and is saved to your account.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: '67cfdb1',
    title: 'New ways to view the nominees in My Grammys',
    detail: 'The category cards in My Grammys can now be shown five ways, picked from the View switch above them: Ballot, the text list as before; Spotlight, with the winner shown large over a blur of its artwork and the other nominees as rows with pictures and play counts; Tiles, a grid of covers and artist photos; Collage, a mosaic of the whole field with the winner at double size; and Reel, one full-width row per category with the nominees as posters you scroll sideways. Clicking a nominee still crowns it in every view, and the Change and Playlist buttons are all still there. Pictures you picked for a song, artist or album show here too, and the view you choose is remembered on that device.' },

  { d: '2026-09-29', t: 'feature', a: 'ui', h: '36b0621',
    title: 'Pick the picture in song, artist and album profiles, saved to your account',
    detail: 'The picture at the top of a song, artist or album profile now has the same picker as the charts: hover over it and click the pencil, or press and hold it on a phone. A picture you pick there also shows next to that song, artist or album in the charts, and the other way round. Picked pictures are now saved to your account too, so they follow you to your other devices, and putting one back to automatic carries over as well. A picture you uploaded from your device stays on that device only.' },

  { d: '2026-09-29', t: 'fix', a: 'themes', h: '0911260',
    title: 'Easier-to-read score chips in the light themes',
    detail: 'In the light themes, some score chips next to songs and albums were still hard to read, above all the gold Masterpiece scores and the green Essential ones on the coloured rows at the top of a chart. Every score colour is now a little deeper in the light themes, so each one is easy to read on any row, and the score rings and bars match. The colours keep their order from best to worst, and the dark themes look the same as before.' },

  { d: '2026-09-29', t: 'fix', a: 'themes', h: 'e32bac6',
    title: 'Readable rating and medal colours in the light themes',
    detail: 'In the light themes, the rating colours were the ones made for the dark themes, so Masterpiece, the score ring and the score chips showed bright yellow on white, and the other score colours were pale too. They now use each light theme’s own darker colours. The gold, silver and bronze peak numbers in song, artist and album profiles, and the Most Played Song of All Time and Most Played Song of the Year numbers, got darker, easy-to-read versions as well. The dark themes look the same as before.' },

  { d: '2026-09-29', t: 'fix', a: 'charts', h: '64b940a',
    title: 'Song and artist profiles say which chart each stat is from',
    detail: 'The Chart Debut card on a song’s profile now says which chart it means, for example Weekly Chart Debut · Week of Sep 20, 26 or Monthly Chart Debut · Sep 2026. It shows the debut on the chart you opened the song from, or the weekly one when you open it from the all-time chart. Before, it mixed the weekly, monthly and yearly charts and could show a monthly debut as if it were a date. Weeks, months and years on the chart, re-entries and time at #1 now name their chart as well, on both song and artist profiles.' },

  { d: '2026-09-29', t: 'feature', a: 'charts', h: 'c8422a3',
    title: 'Click a name in the Songs and Albums charts to open it',
    detail: 'In the Songs and Albums charts, the song title, album title and artist name are now links. Click a song or album to open its profile, or click the artist to open theirs. When a song credits more than one artist, each name is its own link. Various Artists on compilation albums stays plain text, since it has no profile of its own. The names look the same as before until you point at them.' },

  { d: '2026-09-29', t: 'design', a: 'awards', h: '7dadc69',
    title: 'A roomier nominee picker',
    detail: 'The window where you pick an award’s nominees has more room. Your chosen nominees now sit in their own Nominees panel at the top, as even cards in two columns, each with a bigger picture and the name and artist on separate lines, so long titles no longer get cut off after a few letters. A full ballot of 8 fits without scrolling. Fill top 8, Top 5 and Clear moved into that panel, next to a count of how many you have picked. Drag the cards to reorder them, as before. On a phone the cards stack in one column.' },

  { d: '2026-09-29', t: 'fix', a: 'awards', h: '3a4d124',
    title: 'Easier-to-read gold in the light themes',
    detail: 'In the light themes, the bright gold used in the nominee picker was nearly invisible on the white background: the year and category line at the top, the rank numbers on your nominees and the ticks on picked rows. They now use a deeper gold that is easy to read, and the red on the remove buttons is darker too. The Won badges on real-life awards and the Share button on the ceremony screen got the same fix. The dark themes look the same as before.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: 'ec1a92a',
    title: 'Break ties in the automatic awards yourself',
    detail: 'When an automatic award like Most Played Song or Longest Daily Streak ends in a tie, the award card now lists everything tied for first under the winner. Click one to make it the winner instead, and change your mind as often as you like. Your choice is kept when you generate the awards again, as long as that item is still tied for first. Before, the award quietly went to whichever tied item happened to be listed first. Years you generated before this change need Generate again for their ties to show.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: 'c92abfd',
    title: 'See and hear every nominee while you pick them',
    detail: 'When you pick nominees for any award, every row and every chosen nominee now shows the song’s art, the album cover or the artist’s picture, so the list reads at a glance. Pictures load as they scroll into view. Every category except Video of the Year also gets a ♪ button that plays a 30-second sample, and a YouTube button that opens a search for it in a new tab. For an artist, the sample is one of their best-known songs. Clicking either button does not nominate anything; clicking the row still does. Video of the Year keeps its own video button.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: '6e3321f',
    title: 'Compare album covers at a glance when picking Best Album Cover',
    detail: 'The Best Album Cover picker now shows a small cover next to every album, so you can compare them without opening each one. The ⤢ button on a row shows that cover as large as the picker allows. Clicking ⤢ does not nominate the album; clicking the row still does. Best Album Concept keeps its i button with the write-up and tracklist.' },

  { d: '2026-09-29', t: 'feature', a: 'awards', h: 'd3308ed',
    title: 'See what an album is about when picking Best Album Concept',
    detail: 'When you pick nominees for Best Album Concept, every album has an i button. It shows the cover large, Last.fm’s short write-up of the album, which usually explains its story or theme, and the tracklist with how many times you played each song that year. Songs you played that aren’t on the standard tracklist, like bonus tracks, are listed at the end. Clicking i does not nominate the album; clicking the row still does.' },

  { d: '2026-09-28', t: 'feature', a: 'awards', h: '61ac565',
    title: 'Watch a bit of each video when picking Video of the Year',
    detail: 'When you pick nominees for Video of the Year, every song has a ▶ button. It finds the music video on YouTube and plays it in a small window at the top of the picker, so you can remind yourself what the video looks like before nominating it. Clicking ▶ does not nominate the song; clicking the row still does. Press ■ or ✕ to close the video, and if YouTube found the wrong one, a link opens the search on YouTube.' },

  { d: '2026-09-28', t: 'i18n', a: 'guide', h: 'd02d9f6',
    title: 'The setup guide is now fully in Spanish and Portuguese',
    detail: 'Only the language menu on the setup guide used to change; every step, tip and troubleshooting answer stayed in English. Now the whole guide follows the language you pick, in Spanish, Brazilian Portuguese and European Portuguese, including the step-by-step buttons and progress. Google’s own menus and buttons are named the way Google shows them in your language. Buttons from the dankcharts Settings window keep their English names, because that window is still in English.' },

  { d: '2026-09-24', t: 'fix', a: 'charts', h: 'f581407',
    title: 'Albums, Singles, EPs and All now keep their side charts in step',
    detail: 'With singles or EPs on their own charts, Off the Chart could list a release that was still on the chart, because it counted the week without the plays a single lends its album. Off the Chart, Bubbling Under, New Entries, PEAK badges, the chart animation and the chart-run boxes now all count the same way as the chart above them. On the All view they follow the combined chart, and on Albums, Singles or EPs each follows its own. Tracks with no album also no longer take hidden spots in last week’s albums chart.' },

  { d: '2026-09-24', t: 'fix', a: 'awards', h: 'a7cf9a2',
    title: 'Switching phones no longer wipes your nominations',
    detail: 'A phone left open on an older copy of your awards used to save that old copy over nominees you had picked since on another phone. Now each save checks for newer changes first, keeps them, and adds yours on top. The awards page also catches up with your other devices when you come back to the app.' },

  { d: '2026-09-24', t: 'feature', a: 'data', h: 'a7cf9a2',
    title: 'Backups you can restore from Settings',
    detail: 'Your settings, awards and ratings are backed up to your account once a day, and awards are also backed up whenever another device changes them. Settings → Profile lists the last 30 backups, and any of them can be restored on every device in one click. You can also back up by hand, or download a backup file to keep yourself, for example on Google Drive.' },

  { d: '2026-09-23', t: 'design', a: 'awards', h: '63aad44',
    title: 'Clearer record cards in the awards summary',
    detail: 'The all-time most nominations and most wins cards now read as a race: the record holder up top with a bigger count, then the runners-up on their own numbered rows with a bar showing how close they came, in larger, brighter text. Songs and albums also name the artist next to each runner-up. The little arrow under the year picker now only shows on hover.' },

  { d: '2026-09-23', t: 'feature', a: 'awards', h: '5109aa4',
    title: 'Jump straight to any year on the awards page',
    detail: 'Click the year to open a grid of years and pick one, instead of stepping through them with the arrows. My Grammys goes back as far as the year of your first play, and the arrows grey out at either end. Real-Life Awards gets the same picker, back to the first ceremony in 1959. The nominations list in the awards summary also spells out “nominations” instead of “noms”.' },

  { d: '2026-09-23', t: 'design', a: 'awards', h: '749c533',
    title: 'Fresher year picker and buttons on the awards page',
    detail: 'The year and its arrows now sit together in one rounded control with clean chevrons, on both My Grammys and Real-Life Awards. Configure Year is a light outlined button with a settings icon, and Generate Nominees is a solid button in your theme’s color with a sparkle icon and a soft glow.' },

  { d: '2026-09-23', t: 'design', a: 'awards', h: 'a02dc42',
    title: 'Easier-to-read nominations list in the awards summary',
    detail: 'In the "Most nominations" list the bar now sits right under each artist’s name, so the numbers are no longer stranded on the far side of an empty gap. The nomination count is bigger and bolder, and wins show as a gold trophy pill.' },

  { d: '2026-09-23', t: 'fix', a: 'records', h: 'd1cb7e3',
    title: 'Records tab works again for libraries with compilations',
    detail: 'For some libraries the Records tab stayed empty and just said to load your data. It happened when a single you played counts toward a Various Artists compilation: the build tripped over that album and stopped before any record was shown. Compilations are now set up properly either way, so every record section fills in again.' },

  { d: '2026-09-23', t: 'feature', a: 'playlists', h: 'efdae6c',
    title: 'Send any playlist to Soundiiz as text',
    detail: 'The Add to Playlist window now has a Copy as text for Soundiiz option under New playlist. It opens the same Export Playlist window the charts use, filled with those songs: one Artist - Title per line to copy (optionally with the album), a .txt or .csv to download, suggested playlist names to copy, and the steps to import it in Soundiiz, which then builds the playlist on Spotify, Apple Music, YouTube Music, Deezer and more. It works from every ♫ Playlist button in the app, including the new one on My Grammys categories, so a category’s nominees can go straight to your streaming service. Copying a suggested name with an apostrophe in it also works properly now.' },

  { d: '2026-09-23', t: 'feature', a: 'awards', h: 'c14b612',
    title: 'Make a playlist of a category’s nominees',
    detail: 'Every My Grammys category with nominees now has a ♫ Playlist button next to Change. It puts the whole field into a playlist, new or existing, so you can listen to them all before crowning a winner. A song nominee adds itself. An album adds every song from it you played in that year’s eligibility window, most played first. An artist adds their five most played songs from the window. Auto-awarded categories don’t get the button, since there is nothing to decide. Works the same for Last.fm, Google Sheets and CSV libraries.' },

  { d: '2026-09-23', t: 'change', a: 'awards', h: '878c964',
    title: 'Award credit for collaborating artists, now in Settings too',
    detail: 'The switch that lets My Grammys nominations and wins count for everyone on a record is now also in Settings, under Charts → Behavior, as Awards count for featured & collaborating artists. It was only under Configure Year before, which was easy to miss. Both switches stay in step and take effect right away. With it on, collaborations written with &, x, and or vs (such as Lady Gaga & Bruno Mars) now credit each artist too. That only happens when every name in the credit is also an artist in your library on its own, so duos like Simon & Garfunkel still count as one act.' },

  { d: '2026-09-23', t: 'change', a: 'awards', h: '0517647',
    title: 'The ceremony’s final stats show who won the most',
    detail: 'The results are out by the end of the ceremony, so the final stats now end with Most wins in the year instead of a nominations ranking. Each artist who won gets their own block with their photo, their win and nomination counts, and every award they took home: a trophy, the song or album cover (or the artist photo for artist awards), the song or album name and the award name. When featured artists are counted, a featured win also names the lead artist. Shared ceremony links show it after Update link. The nominations ranking on the My Grammys page also lines up properly now: the bars started at a different point on rows with and without a trophy count.' },

  { d: '2026-09-23', t: 'feature', a: 'awards', h: '558999f',
    title: 'Final stats at the end of the ceremony, and credit for featured artists',
    detail: 'The ceremony’s closing roll call now ends with Final stats & records: the all-time leaders in nominations and wins with this year’s results counted in, and the year’s final nomination ranking with each artist’s wins. Any record whose holder changed during the ceremony is marked New. Shared ceremony links include it too, after you press Update link. A new Count featured artists switch under Configure Year lets a nomination or win count for everyone featured on it, not just the lead artist. It reads features from the artist name (feat., ft., featuring, with, or a comma list) and from the song title, as in (feat. A & B). Duos written with & stay one act. It applies to every year’s stats and records and to the Grammy count on artist pages, and it syncs across your devices. Works the same for Last.fm, Google Sheets and CSV libraries.' },

  { d: '2026-09-23', t: 'feature', a: 'awards', h: '91bd87d',
    title: 'Stats & records at the top of every My Grammys year',
    detail: 'Each year of My Grammys now opens with a summary above the nominees. It shows the all-time leaders in nominations and in wins for artists, albums and songs, counted up to that year, so going back to an earlier year shows the records as they stood then, with the next two in line under each leader. Below that is the year’s ranking of the artists with the most nominations, with their wins. Every record holder and ranked artist has their picture or cover art. The ceremony opens with the same summary as its first slide, before the first category. There it leaves out this year’s wins and auto-awarded categories, so nothing is given away before an envelope is opened. Shared ceremony links carry the summary too. An artist is credited for their songs and albums as well as artist categories. Works the same for Last.fm, Google Sheets and CSV libraries.' },

  { d: '2026-09-23', t: 'feature', a: 'awards', h: '1840849',
    title: 'Share your awards ceremony with a link',
    detail: 'A new Share button sits next to View Ceremony. It makes a link anyone can open to watch your ceremony — the nominees with their artwork, the sealed envelopes, the winner reveals with song previews and the roll call at the end — without an account, and without any music data of their own. Your name goes on it if you have set a display name. Only the ceremony is shared: the nominees, the winners and their pictures, nothing else from your library. The link is a snapshot, so after you change nominees or winners press Update link, and the link you already sent shows the new version. Stop sharing takes it down for everyone. Creating a link needs a Google sign-in, so that only you can update or remove it. Works the same for Last.fm, Google Sheets and CSV libraries.' },

  { d: '2026-09-23', t: 'design', a: 'soundtrack', h: 'a3c44ba',
    title: 'Share Your Soundtrack rebuilt on the same five-design system',
    detail: 'The Soundtrack share card was the last one still on the old recipe: one fixed 360-pixel layout, everything set in the small monospace face, a hard-coded indigo that ignored whichever theme you were using, no artwork anywhere, and — in the tall version — a third of the picture left empty under the last song. It now works exactly like the chart, chart-run and entry images. Pick a design: Recap (a masthead over the stat tiles with both top-fives beneath, side by side on a square), Wrapped (your #1 artist as a large round portrait with their play count, then the songs), Collage (nothing but faces and covers, ranked), Minimal (no artwork, the numbers carry it) or Poster (your #1 artist blurred behind the whole card). Pick a palette: App theme follows the theme you are on, Onyx, Aurora, Ember, Bloom, Moss and Paper stay put, and Cover reads the colours out of the artwork and builds the card from them. Pick a shape: Post 1:1, Portrait 4:5 or Story 9:16. Artists and songs now carry their pictures, pulled from Deezer, iTunes, Last.fm or YouTube, and the lists stretch to fill the card instead of stopping halfway down it. New discoveries and your peak day join plays, active days and artists in the stat row, you can show or hide any of it, choose between three and ten entries, and nudge one text-size slider. It all lives in a proper preview window now, with Copy and Share buttons next to Download.' },

  { d: '2026-09-23', t: 'change', a: 'soundtrack', h: 'a3c44ba',
    title: 'The Soundtrack image is four times the resolution',
    detail: 'It used to be drawn at 360 pixels and doubled on the way out, which is why the type looked soft the moment it was opened on a phone. It is now laid out at the full 1080 and exported at 2160 by default, with a Standard option if you would rather have the smaller file. Artwork is requested at the largest size each store serves, and the fonts are given time to load before the picture is taken.' },

  { d: '2026-09-22', t: 'design', a: 'share', h: '6ed89d7',
    title: 'Share images rebuilt: twelve designs, eight palettes, three shapes',
    detail: 'The shareable images had grown into one stiff layout per card with a wall of sliders bolted to the side — eleven of them for a chart, eleven more for an entry — and every picture came out looking the same: a gradient header bar, striped rows, tiny type and a lot of boxes. All three kinds of card have been redesigned from scratch and now start from a design you pick rather than a size you nudge. A chart can be Editorial (a magazine masthead over airy rows with hairline rules), Minimal (type only, no artwork, maximum air), Spotlight (the #1 blown up with its cover, the rest underneath), Grid (nothing but covers, ranked, sized to fill the card) or Poster (the #1 artwork blurred behind the whole thing). A chart run can be a Timeline — the run drawn as a real rank-over-time line with the peak marked in gold and gaps left as gaps, so a re-entry does not read as a continuous run — or Chips (the old tiles, retuned) or a Stat sheet. A single entry can be Cover (full-bleed artwork with the position set large across the bottom), Split, Frame or Ticket. Alongside the design sits a palette: App theme follows whatever theme you are on, then Onyx, Aurora, Ember, Bloom, Moss and Paper stay put whatever the app is wearing, and Cover reads the colours out of the artwork itself and builds the card around them. There is a new Portrait 4:5 size next to Post and Story, since 4:5 is the tallest shape a feed post keeps. Everything else you could set is still there — what to show and hide, which store the artwork comes from, how many entries, and one Text size slider in place of the old sliders — and the Chart Run panel gained Copy and Share buttons to match the chart one.' },

  { d: '2026-09-22', t: 'change', a: 'share', h: '6ed89d7',
    title: 'Shared images are four times the resolution',
    detail: 'Cards used to be laid out at 540 pixels wide and doubled on the way out, which put a 1080px image on Instagram and left the type soft the moment anything zoomed in. They are now laid out at the full 1080 and exported at 2160 by default, with a Standard option if you want the smaller file. Cover art is requested at the largest size each store will serve rather than the 300px thumbnail the search happens to return, so the artwork holds up at the bigger size, and the fonts are given time to load before the picture is taken so nothing renders in a fallback typeface.' },

  { d: '2026-09-22', t: 'feature', a: 'awards', h: '43825c7',
    title: 'New My Grammys category: Best Album Concept',
    detail: 'Best Album Cover already let you honour the sleeve; there was nothing for the record behind it — the album built as one idea rather than a set of songs. Best Album Concept is a new album category in the My Grammys ballot, off by default like the other opt‑in ones, so turn it on in the category list for a year and it appears with a full field of nominees to pick from and its own slide in the ceremony. Any album you played in that year’s eligibility window can be nominated.' },

  { d: '2026-09-22', t: 'fix', a: 'awards', h: '4b15c3d',
    title: 'Remixes and stylised artist names find their preview again',
    detail: 'Checking that a preview really was the right recording stopped the ceremony playing the wrong song, but it also went quiet on tracks it should have found. Kesha’s JOYRIDE. - Revved Up Remix showed “no preview found” even though the remix is there to stream: the store files it under “Ke$ha”, and stripping the dollar sign left a name that matched nothing. Stylised spellings now read as the letters they stand for, so Ke$ha, P!nk, A$AP and MØ match the names you have. The search also gives up less easily. Both stores narrow on every word they are given, so a remix name they have never heard of returns nothing at all rather than the song it belongs to — the search now drops the version, then the featured credits, until something comes back, which finds the original recording when a particular remix is genuinely missing. The name of the recording is shown whenever it is not exactly the nominee’s own title, so a stand-in is never slipped in quietly, and credits are compared as a set of names now, meaning the pressing that lists the whole line-up wins over the one that names only the lead. Every remix in a Best Remix category tried — Kesha, The Weeknd, Tate McRae, Taylor Swift, Alex Warren, Selena Gomez — now finds its own remix rather than the original or nothing.' },

  { d: '2026-09-22', t: 'fix', a: 'awards', h: '97e3365',
    title: 'The ceremony plays the right song now, not a remix or a karaoke cover',
    detail: 'The 30-second preview took whatever the music stores returned first, without ever checking it was the right recording — and the first result is very often wrong. Searching for Taylor Swift’s The Fate of Ophelia returned the Chainsmokers remix first and a spoken “Track by Track” commentary second, with the actual song third, so the ceremony would announce the winner and then play a remix, or somebody talking. Covers by tribute bands and string quartets, karaoke versions and live takes all rank high the same way, and a nominee that is itself a remix would get the original instead. Every result is now checked against the nominee before anything plays: the artist has to match, the title has to match, and a remix, live or acoustic version only plays if that is what the nominee actually is. When nothing matches with confidence the player stays quiet and says so, because silence is better than the wrong song at the moment the envelope opens. The player also names the recording it found, so a bad match is obvious rather than just confusing, and when more than one plausible version exists a small button beside it plays the next-best match. Deezer is a real fallback now too — it was being asked the question but its answer was never read, so anything the first store did not have simply played nothing.' },

  { d: '2026-09-22', t: 'fix', a: 'awards', h: 'f7698e5',
    title: 'The ceremony no longer gives away the winner of the automatic awards',
    detail: 'The automatic categories — Most Played Song, Longest Daily Streak for an Album, Artist with Most Days Played and the rest — are not voted on: they have no field of nominees, just the one name your plays already decided. The ceremony did not know that and printed that single name as a nominee card above the envelope, so every one of those categories showed its answer before you had opened anything, which took all the suspense out of the last stretch of the show. Those slides now show a blank sealed card and a line explaining there are no nominees, and the name appears only when the envelope opens, with the artwork, the trophy and the confetti like every other category. Categories you picked yourself are unchanged: they still show the full field beforehand, because seeing who is up for it is the point.' },

  { d: '2026-09-21', t: 'design', a: 'awards', h: '942b2b0',
    title: 'The My Grammys nominee cards look like ballots now',
    detail: 'The category cards were plain boxes: a grey header strip, a column of circles, and a winner marked only by a faint gold tint on one line — twelve of them side by side read as a spreadsheet rather than an awards ballot. Each card now carries a thin coloured rail along its top edge in its own type colour, so song, album and artist categories are told apart at a glance, and the same colour runs through the icon tile, the hover glow and the button at the foot. Nominees are numbered 01, 02, 03 down the left in the mono typeface, like a printed voting slip, and the winner is lifted out of the list into a full-width gold band with a gold rail and a single foil sweep across it when the grid draws. Long remix titles no longer wrap over three lines and throw the grid out of step — they are shortened with the full text on hover — and the cards fade in as a wave rather than all at once. A category that has been decided turns gold all over, so a finished ballot is obvious from across the page. The year picker above got the same treatment: round steppers either side of a much larger year, and the two panel tabs became a single switch.' },

  { d: '2026-09-21', t: 'perf', a: 'data', h: '1a19cd6',
    title: 'Big Last.fm libraries no longer crash the browser on a phone',
    detail: 'Loading your history downloaded every scrobble from Last.fm and held all of it in memory until the very last page arrived — and not just the four things this site uses, but everything Last.fm sends with each scrobble: internal identifiers, a link, and four cover-art addresses. That is about ten times more than needed, and on an account with 750,000 scrobbles it added up to roughly 1.6 GB, far more than a phone allows a single browser tab. Somewhere around page 3,500 of 3,900 the phone would kill the tab and you were dropped on the browser’s own crash screen, while the same account loaded fine on a computer with memory to spare. Only the four fields are kept now — around 160 MB for that same library instead of 1.6 GB — so the download fits on a phone.' },

  { d: '2026-09-21', t: 'fix', a: 'data', h: '1a19cd6',
    title: 'An interrupted history download carries on instead of starting over',
    detail: 'Your history was only saved to the device once the entire download had finished. For most libraries that is fine, but a very large one takes thousands of pages, and anything that stopped it halfway — locking your phone, the browser discarding the tab in the background, the tab running out of memory — threw the whole thing away. Coming back started again at page one, which for the biggest accounts meant it could never finish at all. Progress is now saved every 250 pages, and the next visit shows the charts built from what was already downloaded and then asks Last.fm only for the part that is still missing, picking up exactly where it stopped. It works across several visits too: each one gets further back through your history than the last.' },

  { d: '2026-09-21', t: 'feature', a: 'ui', h: 'fff1b2a',
    title: 'What’s New tells you when there is something new',
    detail: 'The changelog had one way in: a small link at the very bottom of the page, which never said whether anything had actually changed — so there was no reason to ever click it. Now a WHAT’S NEW button appears at the top right of the masthead, beside Theme and Language, whenever entries have landed since you last opened the list, and disappears again the moment you read them. When there is nothing new it is not on screen at all. Opening it also shows how many entries are new, marks each of them with a green rail, and draws a line across the list where the ones you have already seen begin, so you can stop reading at the right place instead of scrolling through seven hundred rows. The footer link stays where it was for anyone who wants the full history. What you have read is remembered per browser, so reading it on a laptop does not clear the badge on a phone.' },

  { d: '2026-09-21', t: 'fix', a: 'events', h: 'e1b171a',
    title: 'Upcoming and Recent Releases open in Reel view again',
    detail: 'Both sections search your Top 200 artists one at a time, and while that ran they redrew themselves as Tiles after every artist, whatever the Reel / Tiles / Table / List buttons said — so they opened in the wrong view and the buttons did nothing until all 200 artists had been looked up, which can take a couple of minutes. They now redraw in whichever view is selected, Reel by default, and switching views works straight away instead of waiting for the search to finish. The redraws are also spaced out, so the reel no longer restarts from the beginning every time an artist comes back.' },

  { d: '2026-09-21', t: 'change', a: 'ui', h: '2942861',
    title: 'The browser tab, the footer and Google all use your name now',
    detail: 'The masthead already read "★ Your Personal Music Charts ★" until you filled in a display name in Settings, at which point it became yours. The footer line and the browser-tab title did not — they carried the site owner’s name for everyone, which is also what Google printed as the headline for dankcharts.fm in search results. Both now follow the masthead: "Your Personal Music Charts" until you set a display name, and your own name once you do, in all four languages, with the footer taking its “Est.” year from your first scrobble instead of a fixed 2016. Google picks the new title up the next time it crawls the site, so the old one can linger in search for a while.' },

  { d: '2026-09-21', t: 'fix', a: 'data', h: '50605e8',
    title: 'Last.fm syncs no longer stop short of your full history',
    detail: 'If Last.fm rate-limited the sync — which it does when a big library is downloaded fast, and which phones on slower connections hit more often — the pages it refused were quietly skipped, and the sync saved whatever had made it through as if it were your whole history. Every sync after that only asked for scrobbles newer than that, so an account could sit at a fraction of its real play count indefinitely, with nothing on screen to say so. Refused pages are now waited out and retried, and anything still missing at the end is re-downloaded on the next sync instead of being locked in; a short sync says so in the status line rather than claiming success. Syncs still start out just as fast and only slow down if Last.fm actually pushes back. Separately, if the phone refuses to store the offline copy — the usual cause is a full or locked-down iPhone — the status line now tells you instead of failing in silence.' },

  { d: '2026-09-20', t: 'feature', a: 'awards', h: 'd0157c2',
    title: 'My Grammys has a Best Album Cover category',
    detail: 'A new opt-in category in My Grammys, for the year’s best-looking record rather than the best-sounding one. Turn it on under Configure Year and it works like the other album categories — pick nominees from anything you played in the eligibility window, crown a winner, and the ceremony gives it the same envelope as the rest, with the covers themselves filling the cards.' },

  { d: '2026-09-20', t: 'change', a: 'awards', h: 'd0157c2',
    title: 'New Artist of the Year is now Best New Artist',
    detail: 'Renamed to match what the award is actually called everywhere else, including the Real-Life Awards tab alongside it. Nothing about how it works has changed, and any nominees or winners you already picked for it stay exactly where they were — only the name on the card is different. Translated in Spanish and Portuguese too.' },

  { d: '2026-09-21', t: 'design', a: 'awards', h: 'a6501f3',
    title: 'Real-Life Awards has pictures now',
    detail: 'Each artist in the Real-Life Awards tab now carries their picture down the side of their card, and every nomination shows the cover of the song or album it was for — the album cover for the album categories, the single’s artwork for everything else. A category with no work behind it, like Best New Artist or Producer Of The Year, shows nothing rather than repeating the artist photo. The pictures come from the same place the charts get theirs, so anything you have pinned turns up here too, under your own spelling of the artist rather than the one grammy.com files them under. On a phone the picture sits square at the top of the card and each nomination puts its title under the category instead of squeezing both onto one line.' },

  { d: '2026-09-20', t: 'change', a: 'events', h: 'afd4f53',
    title: 'The events calendar opens the menu instead of jumping to a Google search',
    detail: 'Clicking anything in the Events tab calendar sent you straight to a Google search — in the Month and Week grids, and in the Day panel underneath. Every one of them now opens the same little menu the cards elsewhere on the tab have, picked to suit what the event is: a birthday offers the artist’s Spotify, a playlist, the last 10 songs and the birthday search; an anniversary and a release that is already out offer the same for the record; and a release that is not out yet offers only Spotify and Google, since there is nothing to play. Hovering still brings up the little preview card with the artwork — it just steps out of the way once you click, rather than sitting on top of the menu.' },

  { d: '2026-09-20', t: 'change', a: 'events', h: 'afd4f53',
    title: 'Concerts open the menu too, with Ticketmaster at the top of it',
    detail: 'A concert used to be a one-way trip to Ticketmaster, both on the cards in the Concerts section and on the teal pills in the calendar. Now they open the menu, and Tickets on Ticketmaster is its first option — so the show page is still one click away, with the artist’s Spotify, a playlist and their last 10 songs alongside it. This came in with the calendar change: the calendar shows concerts next to birthdays and releases, and having only some of them open a menu would have been worse than none.' },

  { d: '2026-09-20', t: 'feature', a: 'awards', h: '1c78a5b',
    title: 'Real-Life Awards now shows actual Grammy nominations',
    detail: 'The Real-Life Awards tab was empty for almost every year. It was asking MusicBrainz for award relationships, and MusicBrainz barely records them — a handful of artists have them, nobody else does, so the tab shrugged and said nothing. It now reads grammy.com itself. Pick a year and you get that ceremony by name — the 68th Annual Grammy Awards, held 2026 for 2025 releases — and then, for each of your top fifty artists from the year being honoured, every category they were nominated in, which ones they won, and the song or album it was for, alongside their all-time record. The list is in your own listening order, so your number one artist of the year leads it. Going back through the years works the same way, all the way to the 1st Annual Grammy Awards in 1959. Fifty artists are checked eight at a time instead of one every second, and each artist is looked up only once no matter how many years you flip through — going fifty deep is where the surprises are, the artist you played twice who turns out to have been nominated.' },

  { d: '2026-09-20', t: 'perf', a: 'awards', h: '08b5000',
    title: 'Picking nominees no longer crawls on a phone',
    detail: 'Adding or removing a nominee in an Awards category could take a second or more on a phone, and worse the bigger your library. Every tap was throwing the whole list away and building it again from scratch — re-sorting the year’s songs, albums or artists and regenerating sixty rows of the browse list — all to move one tick mark. The rating score shown on each row was the expensive part: working out an album’s score means finding its tracklist, and finding a tracklist meant reading through every play in your history. Sixty rows meant sixty passes over the lot, and an artist category, which averages all of that artist’s albums, meant hundreds. A tap now just flips the one row it touched, and album and artist scores are worked out once and remembered until something actually changes. On a 60,000-play library the work behind a tap went from about 276 milliseconds to under a fifth of one.' },

  { d: '2026-09-20', t: 'fix', a: 'awards', h: '08b5000',
    title: 'Nominees no longer go missing when you switch apps',
    detail: 'Your ballot was the one thing you write in the app that was only ever kept in the cloud, never on the device. So if the save had not finished travelling when you left Chrome for another app — and phones freeze or throw away a tab in the background whenever they feel like it — the nominees were simply gone, with nothing on screen to say so. Three things now stop that. Every save writes to the device first and the cloud second, so the ballot is safe the instant you tap Save. The cloud connection keeps its own queue on disk, so a save made with no signal is still sent later instead of being forgotten. And if a save really is refused while you are signed in, it now says so on screen rather than failing silently. When the app next opens it takes whichever copy was written last, so a save that never reached the cloud is picked up from the device and sent on.' },

  { d: '2026-09-20', t: 'change', a: 'awards', h: '67adb23',
    title: 'The rated best-of list is gone from the Awards tab',
    detail: 'The Awards tab opened with a ★ Best Of, By My Ratings panel — two ranked columns, best albums and best songs of the year, ordered by the scores you gave them rather than by how much you played them. It has been taken out, so the tab now starts with the awards themselves. Your ratings are untouched: every score you have given is still there, and the Ratings tab still shows the same year-end lists.' },

  { d: '2026-09-20', t: 'fix', a: 'events', h: '9e45e81',
    title: 'Clicking a Recent Release shows its options again',
    detail: 'On the Weekly, Monthly and Yearly charts, clicking a card under Recent Releases did nothing — the little menu with Spotify, a playlist, the player and Google flashed up and vanished before you could read it. The menu watches for scrolling so it can get out of the way when the card it is pinned to moves, but it was listening to everything on the page that scrolls rather than only the card’s own surroundings. The reels of release cards slide along by themselves, so the Upcoming Releases reel drifting away just above was enough to close the menu about a fiftieth of a second after it opened. It now only closes when the page itself scrolls, or when something the card actually sits inside does. The same flicker was closing menus all over the Events tab, where reels sit stacked one under another, so those are fixed by the same change.' },

  { d: '2026-09-20', t: 'change', a: 'events', h: '9e45e81',
    title: 'Every card on the Events tab opens its menu instead of jumping to Google',
    detail: 'Birthdays, Anniversaries, Recent Birthdays and Recent Anniversaries used to be plain links: one click and you were in a Google search, with no way to do anything else. They now open the same little menu the release cards have — search on Spotify, add to a playlist, the artist’s or the release’s last 10 songs, and search on Google. The Google option on a birthday card still searches for the artist’s birthday, the way the card used to, since that is the one search the music services would make nothing of. This works in all four ways of showing a section: Tiles, Reel, List and Table. The ＋ in the corner of a card is unchanged, still the one-click way to save straight to a playlist.' },

  { d: '2026-09-20', t: 'change', a: 'events', h: '9e45e81',
    title: 'New Music Friday cards open the menu, with Deezer at the top of it',
    detail: 'A New Music Friday card used to take you straight to the album on Deezer. Now it opens the menu, and Open on Deezer is its first option — so that page is still one click away, and searching Spotify, saving to a playlist or searching Google are the others. Nothing about where the releases come from has changed: the cover, the title, the release date and whether it is an album, a single or an EP are all still read from Deezer every Friday.' },

  { d: '2026-09-20', t: 'fix', a: 'charts', h: 'e29a616',
    title: 'The Albums/Singles/EPs chips stay on the chart tabs where they belong',
    detail: 'Once you set a release type to sit apart from the albums, a row of chips appeared for switching between Albums, Singles, EPs and All. It was meant for the Weekly, Monthly, Yearly and All-Time charts, but it followed you everywhere: Raw Data, Graphs, Records, Events, Awards, Your Soundtrack, Playlists and the Charts Guide all showed the chips above the page, where they changed nothing at all. They now show only on the four chart tabs, and only while the Albums chart is the one on screen.' },

  { d: '2026-09-20', t: 'feature', a: 'awards', h: 'a63dc8d',
    title: 'Twenty new award categories, and the Streak Award has gone',
    detail: 'My Grammys gained twenty categories you can switch on from Configure Year. Fourteen are picked the usual way, from a nominee list: Video of the Year, Record of the Year, Best Country Song, Best Country Album, Best Pop Vocal Album, Best Pop Solo Song, Best Pop Duo/Group Song, Best Dance/Electronic Recording, Best Dance Pop Recording, Best Dance/Electronic Album, Best Remixed Recording, Best Reggae Album, Best Soundtrack Album and Best Soundtrack Song. The pop pair splits on how a song is credited — solo on one side, duos and groups on the other — and the two soundtrack awards read the release types you have marked, so a release tagged as a soundtrack is what makes a song eligible. Country, reggae and dance pop are new genres the classifier now recognises. The other six award themselves, with no nominees to pick: Longest Daily Streak for a Song, an Album and an Artist, each the longest unbroken run of days in the year, and Song, Album and Artist with Most Days Played, each counting how many days of the year it was played at all. The old Streak Award has been removed — the three streak awards that replace it say plainly what they measure, and they cover albums and artists too. Every new category is off by default and all of them are translated into Spanish and both Portuguese variants.' },

  { d: '2026-09-18', t: 'fix', a: 'charts', h: '7d6d0ba',
    title: 'Automatic release-type detection now actually runs on its own',
    detail: 'The switch called "Detect release types automatically" was not detecting anything automatically. Turning it on revealed the options underneath it and did nothing else — every sweep still had to be started by hand from the review panel, so a library could sit for months with the setting on and not one single or EP marked. Switch it on now and it sweeps your library by itself, marking singles, EPs, live albums and soundtracks as it goes, and Settings shows you how far it has got. A second thing was quietly undoing the work: a sweep checks a thousand releases at a time, but it forgot everything it had learned the moment you closed the tab, so every visit started over on your most-played albums and never reached the part of your library where the singles actually are. It now remembers what it has already looked up and carries on from there, session after session, until the whole library has been through. Anything you marked by hand is still never touched, detection can never un-mark a release, and everything it does mark is listed under Manage types, where you can change it or remove it.' },

  { d: '2026-09-15', t: 'fix', a: 'charts', h: 'a922768',
    title: 'Release-type detection now finds live albums, soundtracks, and the rest of your library',
    detail: 'Two things were keeping the scan quiet. It asked Deezer about your most-played releases first, which is exactly where singles are not — and its budget was being spent re-reading answers it already had, so scanning a second time walked the same few hundred albums and never went any deeper. It now settles what it already knows for free, spends the lookups on releases nobody has checked, tells you how many it did not reach, and carries on from there the next time you scan. Live albums and soundtracks were never detectable at all, because Deezer only knows album, single and EP: they are now read from the way the titles are labelled, so a "(Live at ...)" or an "(Original Motion Picture Soundtrack)" is recognised on sight.' },

  { d: '2026-09-15', t: 'fix', a: 'charts', h: '4825445',
    title: 'Deep in a chart, an edit no longer sends you back to #1',
    detail: 'Marking an album as a single or an EP from its window rebuilds the charts behind it, and every rebuild used to send the all-time and yearly lists back to their first page — so closing the window after a one-second edit cost you the place you had paged down to. The page now survives anything that leaves the list it belongs to intact. Changing period, stepping to another year or switching between the album and singles charts still starts you at the top, because those really are a different list.' },

  { d: '2026-09-15', t: 'fix', a: 'charts', h: 'fd69202',
    title: 'PEAK tags on the singles and EP charts count the right chart',
    detail: 'A single that had led the singles chart for weeks still wore PEAK #2, because the tag was measuring it against every album as well — a chart it is no longer shown on — while the chart run in the same row said #1. The albums chart had the mirror of it, an album peaking lower than it ever really did because separated singles had been counted above it. Every peak now belongs to the chart it was set on, all-time ranks in the album and artist windows included.' },

  { d: '2026-09-15', t: 'fix', a: 'charts', h: '9d91497',
    title: 'A single\'s chart run opens the singles chart, not the albums one',
    detail: 'Clicking a box in the chart run of a separated single or EP listed that week\'s albums chart underneath a rank that had never come from it — the box said #1 and the list showed the album sitting at #1 instead. Once a type is pulled out, the album side of a week is several charts rather than one, and the box preview now shows the chart the box was ranked on, titled with its name.' },

  { d: '2026-09-14', t: 'fix', a: 'charts', h: '1ea4cf5',
    title: 'Singles certify on their own ladder immediately',
    detail: 'The certification ladder was keyed off whether a type had been separated into its own chart, which conflated two different questions. Separation is about where a release sits in the charts; the ladder is about what the record is. A hundred plays of a two-track single is a different achievement from a hundred plays of a fourteen-track album, and that stays true wherever it charts. Live albums and soundtracks stay on the album ladder, because they are full-length records.' },

  { d: '2026-09-14', t: 'feature', a: 'charts', h: '8798c3c',
    title: 'Count a single\'s plays toward its album',
    detail: 'Three levels, off by default: nothing, the album\'s own page counting its singles, or the album\'s chart row, records and certification counting them too while the single keeps its own row and its own figure.' },

  { d: '2026-09-14', t: 'feature', a: 'records', h: '4634696',
    title: 'Separated types get their own Records',
    detail: 'Every Records section listing albums now offers a pill per album-side entity — Albums alone if you have separated nothing, plus Singles and EPs when those are apart. It also brought a new record that exists only because release types do: Released as a Single First, songs first heard on a single that turned up on an album later, longest wait first.' },

  { d: '2026-09-14', t: 'fix', a: 'charts', h: '56da37b',
    title: 'The auto-detect switch could not be clicked',
    detail: 'The checkbox inside the switch is invisible and zero-sized, so the slider is only reachable through its label — and every other switch in Settings wraps its row in one while this one did not. The handler was correct; the control was decorative. The tests missed it because they called the function directly rather than clicking the thing.' },

  { d: '2026-09-14', t: 'feature', a: 'charts', h: 'b835fe6',
    title: 'Automatic detection of singles and EPs',
    detail: 'Marking a few hundred singles by hand is the chore that would have killed the feature, so detection does the sweep and you correct it. It is off until switched on, and even then it only ever proposes — nothing is written until you apply it. Titles are matched only against the delimited store convention, so The Singles Collection and Single Ladies are left alone.' },

  { d: '2026-09-14', t: 'feature', a: 'charts', h: '99821ac',
    title: 'Singles and EPs in their own charts',
    detail: 'A marked release still changes nothing until its type is set to Apart in Settings, and With albums is the default for both, so an existing library is untouched until you ask otherwise. Apart gives the albums chart a segmented filter across Albums, Singles and EPs.' },

  { d: '2026-09-14', t: 'feature', a: 'charts', h: '62933e4',
    title: 'Mark a release as a single, EP, live album or soundtrack',
    detail: 'The mark and nothing else: recording what kind of record something is changes no chart, no certification and no record. Separating a type out of the albums chart is a later, opt-in setting.' },

  { d: '2026-09-14', t: 'feature', a: 'charts', h: '0b30fa9',
    title: 'Peak tags on yearly rows',
    detail: 'The yearly chart already received the peak data and simply never used it, so rows rendered without the peak badge that weekly and monthly rows carry.' },

  { d: '2026-09-13', t: 'feature', a: 'charts', h: '0744247',
    title: 'Movement and previous rank on yearly charts',
    detail: 'Yearly charts showed only rank, title, album and plays — the movement and weeks-on-chart columns were weekly and monthly only, excluded by three separate gates, one of which had month hard-coded into the branch that was supposed to handle every other period.' },

  { d: '2026-09-07', t: 'feature', a: 'ratings', h: 'ce8e0c5',
    title: 'Rate your own library',
    detail: 'Score any song from 0.0 to 10.0 on a six-part rubric — composition, lyrics, vocals, production, melody and rhythm — or give it a single gut score. Lyrics and vocals can be marked not applicable so instrumentals are not dragged down by zeros; they drop out of the average entirely. An album\'s total is built from its tracks alongside album-only qualities.' },


  /* ========== AUGUST 2026 ========== */

  { d: '2026-08-21', t: 'feature', a: 'charts', h: '9e742e0',
    title: 'Filter the certified shelf by songs or albums',
    detail: 'The Certified This Period shelf mixed both kinds with no way to see one. Three chips carrying the counts appear when both kinds are present, and a period holding only one kind keeps the plain line, because there is nothing to narrow to.' },

  { d: '2026-08-19', t: 'fix', a: 'guide', h: '0fe2aac',
    title: 'Menu tab names quoted in the tour',
    detail: 'Show, Size, View and Actions read as ordinary words mid-sentence, so it was not obvious they name the menu\'s own tabs.' },

  { d: '2026-08-18', t: 'feature', a: 'guide', h: '680f1ca',
    title: 'The tour opens the real options menu',
    detail: 'The menu was described twice, once inside one step and again as its own. They were merged into one step that drives the actual menu — opening it and ringing each tab, each row, the sizes, the layouts and the actions.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: 'c3074f7',
    title: 'Clearer wording on the release reels',
    detail: 'The step now names the options menu and the view toggle those sections actually have.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: 'f18fdfa',
    title: 'Weeks on chart stated directly',
    detail: 'The wording contrasted the figure against what it is not instead of simply saying what it is.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: 'd646ddf',
    title: 'Two guide descriptions corrected',
    detail: 'New Entries lists first-ever discoveries, not songs debuting on the chart, and the More toggle is a full-width strip under the tabs rather than on the right.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: '1ac1430',
    title: 'Section titles hidden behind the sticky bar',
    detail: 'The tour\'s scroll reserved room for its own banner at the bottom but nothing for the date bar pinned at the top, so the headings of tall sections landed behind it.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: '49b71ed',
    title: 'Plainer navigation copy in the tour',
    detail: 'The step read like a manual paragraph; it became short labelled lines for the top row, the bottom row, and how to unhide the second one.' },

  { d: '2026-08-18', t: 'design', a: 'guide', h: '914f489',
    title: 'The guide opens with a real greeting',
    detail: 'The heading read like a name tacked onto a title and the line beneath it was a fragment.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: 'aecabc4',
    title: 'Weeks on chart described backwards',
    detail: 'The guide said in four places that the Weeks column counts a consecutive run. It is a cumulative total that accumulates across separate stints and is never reset — the internal counter that does reset is a different one, used only to describe a run that has just ended.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: 'fe684cf',
    title: 'Plainer wording on the play button step',
    detail: 'It described how the lookup works, which is not what anyone wants to know, and ended on another sentence about what the app does not require of you.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: 'f6541b0',
    title: 'The tour scroll re-asserted after the page settles',
    detail: 'The target is correct when it is worked out, but the page keeps moving underneath the animation — entering a step collapses the previous section, removing thousands of pixels from above the target while the scroll is still running.' },

  { d: '2026-08-18', t: 'feature', a: 'guide', h: '00c8ce7',
    title: 'The tour covers the two buttons on a row',
    detail: 'It walked the data in a row but skipped the two things you can actually do from one, so a step was added for each, placed so the walk still reads left to right.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: 'f7211a6',
    title: 'Three tour highlights were invisible',
    detail: 'Rank, Previous and Weeks marked their cell correctly but nothing appeared, because the table\'s collapsed borders let a neighbouring cell\'s background paint straight over its sibling\'s ring. All three sit between filled cells.' },

  { d: '2026-08-18', t: 'change', a: 'guide', h: '5df0b38',
    title: 'The tour slowed down',
    detail: 'The timings were set for reading the banner, not for reading it and then actually looking at the thing being pointed at — and since sections now expand on arrival there is more to take in. Each step runs about ten seconds.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: '45914c1',
    title: 'Tour scrolled tall sections to their middle',
    detail: 'Reported as the tour no longer highlighting Bubbling Under, Off the Chart and New Entries, while Releases still worked — and Releases working was the clue, because it was the short one. Centring a section taller than the screen puts its header off the top.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: '6e4fea2',
    title: 'Two sections would not open for the tour',
    detail: 'Revealing a section stripped its styling classes, which covers most sections — but Bubbling Under and Off the Chart track their open state separately and set their height directly, so neither responded.' },

  { d: '2026-08-18', t: 'feature', a: 'guide', h: '262eb33',
    title: 'The tour walks a chart row piece by piece',
    detail: 'One paragraph listed what a row contains and pointed at nothing. It became seven steps over the current number one: the row, the rank, last period\'s rank and movement, the badges, weeks on chart, plays, and the chart run.' },

  { d: '2026-08-18', t: 'feature', a: 'guide', h: 'c29473a',
    title: 'The tour can reveal a hidden section',
    detail: 'A step explaining Bubbling Under while Bubbling Under is switched off had nothing to point at and glowed nothing. Steps can now open a hidden or collapsed section, then hand it straight back the way they found it.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: '9373034',
    title: 'Plainer wording on the certifications step',
    detail: 'The first sentence buried what the section is under how it works, at a point where it is being read at tour speed.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: 'af30410',
    title: 'The tour visited sections out of order',
    detail: 'The page renders them as Chart, Bubbling Under, Off the Chart, New Entries, and the toggle bar lists them the same way, but the tour visited New Entries third — scrolling down past Off the Chart and then jumping back up to it.' },

  { d: '2026-08-18', t: 'feature', a: 'guide', h: '1cf3166',
    title: 'The tour plays through the whole weekly page',
    detail: 'One card described the Weekly tab and left the rest undocumented — the stats strips, the of-the-moment cards, the certification reel, the seven toggles, the section menu, the three sub-charts and the release reels were never mentioned. It became a self-playing walkthrough.' },

  { d: '2026-08-18', t: 'change', a: 'charts', h: '651431b',
    title: 'Chart animation is now opt-in',
    detail: 'The setting was read in a way that treated never having opened it as on, so the replay ran for every new user on every chart render, before they had any idea what was being animated.' },

  { d: '2026-08-18', t: 'feature', a: 'guide', h: '860d287',
    title: 'Tour steps spotlight what they describe',
    detail: 'A step titled "The nav bar" that neither scrolls to the nav bar nor marks it leaves you reading a description of something you have to find yourself. Steps now scroll their target into view and ring it.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: 'e7e5988',
    title: 'The tour\'s opening claim was untrue',
    detail: 'It claimed the app runs on the same machinery as a national music chart. It does not — those weight streaming, sales and radio against each other, while this counts plays. It then spent two more sentences on what the app does not do.' },

  { d: '2026-08-18', t: 'feature', a: 'guide', h: '1ac6ade',
    title: 'A tour step for every tab',
    detail: 'Folding Events into Awards and Soundtrack into Playlists made four tabs read like two footnotes, when Awards alone generates 33 categories and Records holds eleven sections. The tour went from eleven steps to eighteen.' },

  { d: '2026-08-18', t: 'fix', a: 'guide', h: '0428715',
    title: 'Welcome gate skipped after Google sign-in',
    detail: 'The gate was hooked into three of the four ways the app can start. The fourth restores a saved configuration and reveals the app itself, so a Google user signing in never saw it.' },

  { d: '2026-08-18', t: 'feature', a: 'guide', h: 'bc6fc56',
    title: 'A welcome gate, and the guide rebuilt as six chapters',
    detail: 'Nothing on a freshly loaded chart announced that a guide existed, so it was only ever found by accident — and once found it was twelve flat sections mixing documentation with your own statistics. A blocking first-visit overlay now offers the tour or the guide, and the guide became six ordered chapters.' },

  { d: '2026-08-17', t: 'feature', a: 'awards', h: 'db57156',
    title: 'The ceremony staged properly',
    detail: 'It showed a plain list with the winner already highlighted, and the envelope only ever appeared for categories that had no winner yet — so there was nothing to reveal. Each category now gets nominee artwork, a showcase lap and an envelope reveal.' },

  { d: '2026-08-17', t: 'feature', a: 'awards', h: 'e12c038',
    title: 'Nominee lists ranked by the category\'s own rule',
    detail: 'Best Collaboration means songs credited to more than one artist — but also songs where the credit shows one name and you know better. The credit cannot tell those apart, so the rule became a ranking signal rather than a filter: matches sort to the top and nothing is ever hidden.' },

  { d: '2026-08-17', t: 'fix', a: 'awards', h: '9778f21',
    title: 'Generate Nominees button broke itself',
    detail: 'The button restored its label as plain text, but the label contains markup for its icon, so it printed its own markup and stayed broken. A category that failed also left the button stuck on Generating.' },

  { d: '2026-08-15', t: 'perf', a: 'records', h: 'f4cf758',
    title: 'Records not rebuilt when nothing changed',
    detail: 'It ran on every visit to the tab and cached nothing, so opening Records, glancing at a chart and coming back paid around 1.6 seconds of counting again for an answer that had not changed.' },

  { d: '2026-08-15', t: 'perf', a: 'records', h: '0c385b5',
    title: 'Cheaper ordering in the Records build',
    detail: 'Records was the slowest thing left, around 1.8 seconds at 150,000 plays, and untouched by the previous four passes because it runs its own chronological walk rather than reading the shared indexes.' },

  { d: '2026-08-15', t: 'perf', a: 'data', h: 'a6a133b',
    title: 'Faster loading by measuring rather than guessing',
    detail: 'The load path was measured stage by stage, and reading the file turned out not to be the problem at all — splitting 150,000 lines takes five milliseconds. The cost was a sort comparator converting two dates on every one of 2.6 million comparisons.' },

  { d: '2026-08-15', t: 'perf', a: 'charts', h: '91f15d6',
    title: 'One shared index instead of regrouping per builder',
    detail: 'The third pass at the same root cause: separate builders each walking the whole history to produce counts the others had already worked out. The totals are now computed once per period and shared.' },

  { d: '2026-08-15', t: 'perf', a: 'charts', h: 'a4e1438',
    title: 'Chart runs cached between renders',
    detail: 'Building the chart run was the most expensive thing in a render — 909 milliseconds of a four-second profile — and its result was thrown away at the top of every render. Stepping back one week therefore re-derived every chart position since your first ever play, despite nothing having changed.' },

  { d: '2026-08-15', t: 'perf', a: 'charts', h: 'd985660',
    title: 'Each play\'s derived values computed once',
    detail: 'Profiling a 100,000-play library showed a single render making 2.5 million date conversions and over a million key lookups — roughly twelve full walks of the history per render, because about seventeen chart builders each open with their own loop over everything. Those values are now computed once per play.' },

  { d: '2026-08-11', t: 'feature', a: 'playlists', h: '945075d',
    title: 'Add a song to a playlist instead of playing it',
    detail: 'Every surface showing songs offered the player queue and nothing else, so a song you wanted to keep had to be played to be saved. The Time Machine, the play buttons on all charts, birthdays, anniversaries and recent releases can now stage tracks into a playlist directly.' },

  { d: '2026-08-11', t: 'fix', a: 'player', h: '958e13e',
    title: 'An artist\'s play button searched their name as a song',
    detail: 'Every alternate view special-cased albums for the track picker and let artists fall through to a direct search, so the button looked up the artist\'s name as if it were a track title. Three views had no artist button at all.' },

  { d: '2026-08-11', t: 'fix', a: 'playlists', h: '47351a6',
    title: 'Export Playlist opened behind the Streaks window',
    detail: 'Copy Tracklist appeared to do nothing: the export window is declared earlier in the page, so at the shared stacking level the streaks window painted straight over it. A window opened from inside another now lands on top.' },

  { d: '2026-08-11', t: 'fix', a: 'records', h: '5f39eeb',
    title: 'The Records reel ran twice as fast as it looked',
    detail: 'Its speed was set to match the Time Machine per card, but a record card is nearly twice as wide, so matching seconds per card meant covering twice the ground in the same time.' },

  { d: '2026-08-11', t: 'feature', a: 'ui', h: '42e7ec7',
    title: 'Every reel can be dragged',
    detail: 'The Time Machine, the Soundtrack reel and every Events reel were animations, and an animation cannot be dragged — the pointer and the animation would both be writing the same thing. They were rebuilt as real scrollers, the way the certified shelf already worked.' },

  { d: '2026-08-11', t: 'fix', a: 'charts', h: '30d155e',
    title: 'The certified shelf stayed hanging on other tabs',
    detail: 'It refuses to build outside week and month, but it lives in the chart column and the non-chart tabs hide that column one piece at a time — and none of the eight named it. Whatever plaques the last week had earned stayed up in Records, Events and Awards.' },

  { d: '2026-08-10', t: 'fix', a: 'playlists', h: '5f47ca6',
    title: 'Time Machine could be switched off permanently',
    detail: 'Turning all three types off left the ticker with nothing to show, so it hid itself, taking the three buttons with it because they live in its header. Since that state is saved and synced, neither a reload nor another device brought them back.' },

  { d: '2026-08-10', t: 'fix', a: 'playlists', h: '2521d04',
    title: 'Time Machine vanished after visiting Awards',
    detail: 'Those tabs hide the ticker outright and the code that restores the chart interface never put it back. The only other thing that could rebuilds it only when the data has changed — which on the same day with the same plays it never has — so one visit removed it for the rest of the session.' },

  { d: '2026-08-10', t: 'feature', a: 'charts', h: 'e2c303f',
    title: 'Awards a period earned',
    detail: 'A certification is a moment — the single play that carried a record over a threshold — so it falls inside exactly one week and one month. Weekly and monthly charts now open onto the plaques whose crossing play landed in that period.' },

  { d: '2026-08-09', t: 'fix', a: 'charts', h: '53e01a6',
    title: 'Compilations count as one album',
    detail: 'An album whose tracks each name a different singer was being shattered into one album per singer, so every album chart, record and certification counted the same record a dozen times over at a fraction of its plays. Marking it as a compilation merges it back into one, credited to Various Artists.' },

  { d: '2026-08-09', t: 'design', a: 'records', h: '09fb542',
    title: 'Plaques become awards',
    detail: 'The plaque pressed the cover into a vinyl label, which left two problems it could not solve from inside that shape: the artwork was the record, so there was no artwork, and a multiple was a word in a badge, so a wall of Diamonds looked uniform until every badge had been read.' },

  { d: '2026-08-09', t: 'fix', a: 'records', h: 'c2175d2',
    title: 'Certifications kept every award, not just the highest',
    detail: 'A plaque showed only where a record stands now, so passing a threshold quietly destroyed the award below it: an album at three times Diamond had one Diamond plaque, and the Gold and Platinum it earned on the way had stopped existing.' },

  { d: '2026-08-09', t: 'fix', a: 'records', h: '3747349',
    title: 'Yearly streaks ranked on their leanest year',
    detail: 'A yearly streak can only run as long as the library itself, so anyone kept in rotation lands on the same maximum and the ladder fills with one number, ranked underneath by lifetime plays — which made the record Most Plays wearing a streak label.' },

  { d: '2026-08-09', t: 'feature', a: 'records', h: '570b33d',
    title: 'Records overview splits by period',
    detail: 'A second row of pills narrows the board to the sections holding a record for that period, with All showing the union of everything — 26 cards rather than 10 — each chip naming which record it is.' },

  { d: '2026-08-09', t: 'design', a: 'records', h: 'b40962e',
    title: 'Records pills sized as primary navigation',
    detail: 'They sat at around nine pixels under a page of large headings — fine print for the tab\'s main navigation.' },

  { d: '2026-08-09', t: 'design', a: 'records', h: '027583a',
    title: 'Drawn icons on the type pills',
    detail: 'A star, a diamond and a four-pointed diamond said nothing about songs, artists or albums — three abstract marks whose only job was to differ from each other, which is why two sections had already drifted to emoji instead.' },

  { d: '2026-08-08', t: 'fix', a: 'records', h: '06e34a5',
    title: 'Pill icons keep moving while selected',
    detail: 'Nine of the eleven played an entrance and then stopped dead, so the selected pill was motionless for all but the first half-second. The motion was an arrival flourish where it needed to be a state.' },

  { d: '2026-08-08', t: 'design', a: 'records', h: '8811845',
    title: 'Icons and colour families on the Records pills',
    detail: 'Eleven pills carrying nothing but tiny labels gave the eye no way to tell the sections apart. Each now carries a drawn glyph taken from record-shop objects rather than generic interface marks, coloured in five families.' },

  { d: '2026-08-08', t: 'feature', a: 'records', h: '9f31455',
    title: 'Reigns separated from longevity',
    detail: 'Twelve weeks at number one in a row is not the same record as twelve weeks at number one spread over four years: one is a reign, the other is longevity. Both sections now say which they measure, and measure both.' },

  { d: '2026-08-08', t: 'feature', a: 'records', h: 'd4b7233',
    title: 'Five more sections rank all three charts',
    detail: 'Everything in Records that only ever ranked the weekly chart now ranks weekly, monthly and yearly, including the Perfect All Kill test. Streaks was rebuilt in the process.' },

  { d: '2026-08-08', t: 'feature', a: 'records', h: '0582377',
    title: 'All #1s split per chart, and its covers load',
    detail: 'One umbrella heading sat over three sub-tables that were the actual records, naming nothing you could point at. Each now stands as its own record, and the artwork bug that had dogged the section since it was written was fixed.' },

  { d: '2026-08-08', t: 'design', a: 'records', h: 'c65f214',
    title: 'Overview cards become artwork tiles',
    detail: 'The grid was ten flat text panels. Every other surface in the app that presents a record shows the record\'s face; this one, the first thing the tab opens on, showed none.' },

  { d: '2026-08-08', t: 'fix', a: 'records', h: '24073ed',
    title: 'All #1s pills failed to hide their tables',
    detail: 'Each period block opened two elements but closed three, and the browser spent the surplus closing whatever was open next — so every table past that point was parsed as a sibling of the panel meant to contain it, and the pills could not hide them.' },

  { d: '2026-08-07', t: 'fix', a: 'mobile', h: '5fd5010',
    title: 'Records tables become cards on phones',
    detail: 'A records table can carry nine columns, which below 768 pixels meant a horizontal scroller with nothing to indicate it was there, so columns five onward were simply never found. Each row is now a card instead.' },

  { d: '2026-08-07', t: 'feature', a: 'records', h: '791fa39',
    title: 'A certification ledger behind every artist row',
    detail: 'Each row expands to every certification that artist holds, one line per award with the arithmetic behind it: first play, the day it landed, how long the climb took, the pace, plays since, and the gauge to the next rung.' },

  { d: '2026-08-07', t: 'feature', a: 'records', h: 'ca7264b',
    title: 'Five more sections get type pills',
    detail: 'All #1s, Appearances, Debuts and Most Plays now show one type at a time like the sections that already did, sharing one generic control rather than a fourth, fifth and sixth copy of it.' },

  { d: '2026-08-07', t: 'fix', a: 'records', h: '798d5b5',
    title: 'Fastest ranked on rounded days',
    detail: 'The ladder sorted on elapsed time rounded to whole days, which at the lower tiers is barely an ordering at all — at 50 plays, 23 of the 25 visible rows shared a day count, so what they were really ranked by was the order they happened to be built in. Every play carries a real time, and that is now used.' },

  { d: '2026-08-07', t: 'feature', a: 'records', h: '9a6f1ab',
    title: 'Fastest to Milestone for all three types',
    detail: 'Songs, artists and albums each get their own ladder rather than songs alone, in the same shape the Milestones section above it uses.' },

  { d: '2026-08-07', t: 'feature', a: 'charts', h: '76d11b7',
    title: 'Every record an artist holds, in their modal',
    detail: 'The Hall of Fame reel from the Records banner now appears in the artist modal, scoped to that artist. The two share one card builder so they cannot drift apart.' },

  { d: '2026-08-07', t: 'design', a: 'records', h: '3efb3eb',
    title: 'The tier medal sized to its word',
    detail: 'The medal was set well below the tier word beside it, so it read as an afterthought rather than the thing being awarded.' },

  { d: '2026-08-07', t: 'design', a: 'records', h: 'effa654',
    title: 'The song certification becomes a struck medal',
    detail: 'The bare note became a medal with the note on its face, tonal rather than dark-centred, because a knocked-out centre would have shown the artist photograph through the medal.' },

  { d: '2026-08-07', t: 'design', a: 'records', h: '195a91b',
    title: 'A gold note that catches the light',
    detail: 'The emoji became a drawn note. An emoji renders in whatever colour the platform ships and cannot glow; a drawn one takes the theme\'s gold and a layered shadow, which is what makes it read as metal rather than a sticker.' },

  { d: '2026-08-07', t: 'design', a: 'records', h: 'da7450e',
    title: 'Song certifications marked by a rosette',
    detail: 'The musical note named the genre rather than the achievement, underselling the one record here that is actually awarded. Albums keep the disc so the two stay tellable apart.' },

  { d: '2026-08-07', t: 'design', a: 'records', h: 'c93acbb',
    title: 'Certification cards name their own type',
    detail: 'The wall holds both songs and albums under one heading that cannot say which a given card is, so each card now names its own.' },

  { d: '2026-08-07', t: 'fix', a: 'records', h: 'f3ad57a',
    title: 'Certified centres under the tier word',
    detail: 'The badge reads as a glyph plus a word, so centring underneath the whole string put the label under both and left of where it belonged.' },

  { d: '2026-08-07', t: 'design', a: 'records', h: 'de45057',
    title: 'A certification tier reads like a plaque',
    detail: 'Gold, Platinum and Diamond are the record on a certification card, not a count, so the tier runs at plaque scale with certified set underneath rather than inline. Every other card keeps its inline figure, where the value really is a number.' },

  { d: '2026-08-07', t: 'design', a: 'records', h: 'd831bd5',
    title: 'Certification cards say certified',
    detail: 'The tier is the headline on a certification card, so it now carries the word, and the date below dropped to a plain label so the same word does not appear twice. The supporting details were set too small and truncated to one line.' },

  { d: '2026-08-07', t: 'fix', a: 'records', h: '5c2d050',
    title: 'Long titles wrap too',
    detail: 'Card titles truncated the same way, so a long parenthesised title was cut off. Titles now wrap to three lines and descriptions to two, which covers every record in the tab.' },

  { d: '2026-08-07', t: 'fix', a: 'records', h: 'a08ca1e',
    title: 'Long record descriptions wrap',
    detail: 'Reel cards truncated their section line mid-word. It now wraps to a second line, and the card reserves both whether or not they are used so heights stay even as they scroll.' },

  { d: '2026-08-06', t: 'design', a: 'ui', h: 'f67d0df',
    title: 'The masthead flame keeps its gold',
    detail: 'The chart run lists keep the new blue top tier while the masthead returns to gold — the two ramps diverge at the top on purpose.' },

  { d: '2026-08-06', t: 'design', a: 'ui', h: '9222b23',
    title: 'The longest streaks burn blue',
    detail: 'The first five tiers escalate from amber to deep red, but the sixth flipped back to a light gold that read weaker than the red below it. The top tier now burns blue, which is hotter than red.' },

  { d: '2026-08-06', t: 'feature', a: 'records', h: 'b1600c6',
    title: 'Records opens on the artist who holds the most',
    detail: 'The overview now leads with the artist appearing in more record rows than anyone else, their photo behind a marquee of every record they hold, each card carrying that record\'s own figures.' },

  { d: '2026-08-05', t: 'fix', a: 'mobile', h: 'c0fedf1',
    title: 'Artist total stays visible on mobile',
    detail: 'The play total was being dropped from the ON AIR bar on narrow screens.' },

  { d: '2026-08-05', t: 'fix', a: 'ui', h: '4fc654c',
    title: 'ON AIR counts credited collaborations properly',
    detail: 'The artist figure matched the raw credit string while every artist chart splits that into individual names, so it under-reported every collaboration and disagreed with the Artists chart sitting right beside it.' },

  { d: '2026-08-05', t: 'feature', a: 'ui', h: '8b18767',
    title: 'An ON AIR bar for what you are playing now',
    detail: 'Last.fm was already flagging the in-progress track in every sync and the parser was discarding it, because it is not a scrobble yet. A bar now polls for it and shows artwork, title, artist, a running clock and how many times you have played it before.' },

  { d: '2026-08-05', t: 'design', a: 'records', h: 'ba32e43',
    title: 'Records intro pairs chart size with history',
    detail: 'The strip carried two facts joined by a pipe — the chart sizes, then how much history feeds them — which were the same three columns all along. Paired per period, each column reads as a sentence: weekly records come off a top 10, and there are 517 of those weeks.' },

  { d: '2026-08-04', t: 'feature', a: 'charts', h: '65768b4',
    title: 'Total plays for the selected chart run range',
    detail: 'The chart run statistics gained a total that follows the range toggle, so switching between year to date, up to this period and all time answers how much you actually listened alongside how it ranked.' },

  { d: '2026-08-04', t: 'design', a: 'graphs', h: 'b484194',
    title: 'Heatmap days rain into place',
    detail: 'Each day square now falls into the calendar on its own clock rather than the whole grid appearing at once, with the randomness set wide enough that neighbouring squares overtake each other instead of sweeping in a clean line.' },

  { d: '2026-08-04', t: 'feature', a: 'charts', h: '6e1b17c',
    title: 'Streak records on every chart entry',
    detail: 'Chart run panels gained a fourth section holding streak records for songs, artists and albums, across four tabs — consecutive plays, days, months and years — each with a ranked list, a stat strip and a detail view with a block per unit. Only runs of two or more count.' },


  /* ========== JULY 2026 ========== */

  { d: '2026-07-31', t: 'fix', a: 'records', h: '037f512',
    title: 'Certification artwork sitting outside its frame',
    detail: 'The wrapper added around each cover so the picker badge has something to anchor to collapsed to nothing on the Certifications Wall, leaving the record slot centred on the card\'s corner instead of the artwork.' },

  { d: '2026-07-31', t: 'feature', a: 'records', h: '68abdbb',
    title: 'Records column headers stay as you scroll',
    detail: 'Records tables run well past a screenful, and thirty rows in, a grid of names and numbers had nothing left to say which column was which. The headers now pin to the top while the rows move underneath.' },

  { d: '2026-07-30', t: 'fix', a: 'mobile', h: '330c5bf',
    title: 'The artwork picker badge no longer covers the art',
    detail: 'On touch devices the badge sat permanently over small artwork, hiding the very cover it belonged to. It is hidden there entirely, and a half-second press on any artwork opens the picker instead.' },

  { d: '2026-07-30', t: 'feature', a: 'records', h: 'cc13e6a',
    title: 'Milestones as a timeline',
    detail: 'Milestones is a ladder of firsts, one row per tier each with a date, so it became a vertical timeline with a spine, a node per tier and artwork per entry, split into three panels behind a toggle.' },

  { d: '2026-07-30', t: 'feature', a: 'records', h: '1082f25',
    title: 'Biggest debuts on a podium, with total plays',
    detail: 'The record now shows an all-time play count beside the debut figure, so a song that opened big and stalled is visibly different from one that kept growing, and the top three lift out of the table onto podium cards.' },

  { d: '2026-07-30', t: 'feature', a: 'records', h: '434275d',
    title: 'New Charts records browsable by type and period',
    detail: 'Ten records rendered as twenty tables in one scroll became two rows of pills showing one set at a time, by type and by period, with both choices remembered so the section reopens where you left it.' },

  { d: '2026-07-30', t: 'feature', a: 'records', h: 'fd3d3ef',
    title: 'Search across every Records table',
    detail: 'One box above the section navigation filters all 55 tables at once, marking matching rows, hiding the rest and showing only the sections that still hold a match — deliberately overriding the per-table limits and collapse states while it is active.' },

  { d: '2026-07-29', t: 'feature', a: 'records', h: 'c528086',
    title: 'Records opens on an overview',
    detail: 'It used to drop you into one table with no indication of why that one, what the other nine hold, or whether any of them have anything in them yet. It now opens on a card per section carrying that section\'s single best record, with a Songs, Artists and Albums toggle.' },

  { d: '2026-07-29', t: 'design', a: 'records', h: '2410133',
    title: 'Records typography given real hierarchy',
    detail: 'Seven label tiers were spread across a 2.2 pixel range, four of them uppercase, and every one was smaller than the data it labelled. Scanning works on ratio, so they were rebuilt at four distinct sizes.' },

  { d: '2026-07-29', t: 'perf', a: 'records', h: 'bc0ec53',
    title: 'Records sections opened one at a time',
    detail: 'The tab opened on a view that rendered all ten sections at once — roughly 55 tables and several hundred image lookups in a single scroll. That option was removed, and tables can now be sorted by any column.' },

  { d: '2026-07-29', t: 'fix', a: 'charts', h: '40c910b',
    title: 'Song of the Moment no longer forced to lowercase',
    detail: 'The card displayed the internal grouping key, which is lowercased so a song counts as one entry regardless of how it is typed. The original casing of the first play in the window is now kept and shown.' },

  { d: '2026-07-29', t: 'feature', a: 'charts', h: 'f69b7a1',
    title: 'Pick artwork from a grid of every source',
    detail: 'Clicking the source label used to step blindly through four sources one at a time. A badge on any artwork now opens a picker showing candidates from all four at once, and your choice is pinned to that item for every future render in every view.' },

  { d: '2026-07-27', t: 'fix', a: 'themes', h: 'ce6f2f6',
    title: 'Unreadable selected buttons on Dark Yellow',
    detail: 'Nine of the ten themes have a mid-to-dark accent, so white text on an accent fill looked fine and was copied into around 45 rules. Yellow dark\'s accent is light, so every filled pill on that theme rendered at 1.5 to 1 — chart toggles, chart run buttons and release controls all effectively blank.' },

  { d: '2026-07-27', t: 'fix', a: 'ui', h: '07d7dfa',
    title: 'Your Soundtrack stayed on screen under the next tab',
    detail: 'It was the one view missing from the list of things to tear down when switching.' },

  { d: '2026-07-27', t: 'design', a: 'ui', h: '7467bf5',
    title: 'The Events icon became a calendar with a ticket',
    detail: 'A map pin says location, but the tab holds birthdays, release dates and shows — all dated, none placed. It is now a calendar with the day crossed off and a ticket at its corner, which also separates it from the two other calendars in the navigation.' },

  { d: '2026-07-27', t: 'feature', a: 'ui', h: '39dd2bb',
    title: 'The Last.fm card explains the full setup',
    detail: 'The username field is the read-only shortcut, so the card now says what the full setup adds — your own key, and fixing and pushing scrobbles — and links to the right part of the guide.' },

  { d: '2026-07-27', t: 'fix', a: 'ui', h: '846444d',
    title: 'Navigation tab colours pulled apart',
    detail: 'The first row ran through four cool hues inside about 70 degrees, with two of them only 20 apart and both reading as lavender. Light themes made it worse by pulling every hue toward the accent. The hues were separated.' },

  { d: '2026-07-27', t: 'design', a: 'ui', h: 'c55b163',
    title: 'Drawn icons on every navigation tab',
    detail: 'All twelve tabs moved from emoji to drawn icons. Emoji render in each operating system\'s own fixed palette and ignore the tab\'s state; these take their colour from the tab, so they follow hover and active.' },

  { d: '2026-07-27', t: 'design', a: 'ui', h: '18c6a75',
    title: 'Drawn icons on Sync Now and Settings',
    detail: 'The bare arrow and gear characters became small built objects in the same language, with the reload arrow turning the way a reload turns.' },

  { d: '2026-07-27', t: 'design', a: 'ui', h: '28f178e',
    title: 'Drawn icons on the masthead stats',
    detail: 'The five figures used emoji, which can only ever scale as one lump and ignore the state around them. Each is now a small constructed object that acts out what its stat measures when you hover it.' },

  { d: '2026-07-26', t: 'fix', a: 'data', h: 'a59c41a',
    title: 'Two copies of the sync script had drifted apart',
    detail: 'The guide\'s copy was 89 lines ahead of the one in the settings window, missing an entire genre fetching section and two menu items that drive it. Anyone who copied from the wrong one got a script that could not do what the other promised.' },

  { d: '2026-07-26', t: 'feature', a: 'data', h: '9d69c43',
    title: 'The sync script builds the missing tab itself',
    detail: 'Rather than failing with an accurate but invisible error and leaving you to guess the tab name and which cell holds what, the script now creates the Settings tab when it is not there, correctly labelled and sized.' },

  { d: '2026-07-26', t: 'fix', a: 'data', h: 'f6cac11',
    title: 'Own-sheet users told to use a tab they do not have',
    detail: 'A step referred to a Settings tab that only exists because the template ships with it. Bring your own sheet and there is no such tab, and the failure is invisible from the site\'s side — the script throws and no plays ever arrive.' },

  { d: '2026-07-26', t: 'fix', a: 'data', h: '2b0acda',
    title: 'Copying the deployment address was skipped over',
    detail: 'A step ended on "then paste the URL it gives you below", quietly folding three separate actions into one clause: pressing Deploy, sitting through the authorisation screens a second time, and finding the address in the dialog that follows. Nothing said a URL was about to appear.' },

  { d: '2026-07-26', t: 'fix', a: 'data', h: '45eab77',
    title: 'Steps told people to paste a script already there',
    detail: 'Two steps instructed everyone to open the script editor and paste the script in, when the template already ships with it — which the guide says outright a few lines later. The sequence is three steps now.' },

  { d: '2026-07-26', t: 'fix', a: 'data', h: '9b4de7f',
    title: 'The auto-sync block asked for the answer before the question',
    detail: 'It opened by demanding an address, then explained where that address comes from, then dumped 400 lines of script into the middle of the window. The order was reversed so the thing you need is in front of you when you need it.' },

  { d: '2026-07-25', t: 'design', a: 'settings', h: '249e57e',
    title: 'Settings speaks the landing page\'s language',
    detail: 'The source picker was three flat boxes with placeholder glyphs while the landing screen sells the same three choices with drawn icons and stickers — the same decision presented with two personalities. The cards now reuse the landing\'s own icons.' },

  { d: '2026-07-25', t: 'feature', a: 'settings', h: '2f43b79',
    title: 'Configure became Settings, in three tabs',
    detail: 'The old window was one long scroll of display name, time zone, source options, sheet fields, script, certifications, events and two toggles, each with a paragraph beneath it. It is now three tabs — Data source, Charts and Profile — with the source options rebuilt as cards.' },

  { d: '2026-07-25', t: 'fix', a: 'data', h: '71c03ca',
    title: 'The web app step undersold itself',
    detail: 'It claimed to be needed only for the Add Play button. That address actually gates three things: manual additions, pushing edits back to your sheet, and autocorrect rules saving and re-applying. The step now leads with what it really unlocks.' },

  { d: '2026-07-25', t: 'fix', a: 'data', h: '3b83a2a',
    title: 'The connect step put in the right order',
    detail: 'It told you to paste the sheet\'s address before telling you to share it, which is backwards from the order you have to do it in. It now walks the three real tasks in sequence, including what each sharing setting means and a silent failure that had no warning at all.' },

  { d: '2026-07-25', t: 'fix', a: 'data', h: 'b5c2a99',
    title: 'The auto-sync step explains itself',
    detail: 'One step compressed three separate things into four lines, and the scariest part — Google\'s unverified app warning — was a footnote rather than the thing you are about to hit. It is now three named sections.' },

  { d: '2026-07-25', t: 'feature', a: 'data', h: 'b5f6dc8',
    title: 'The setup guide became a step-by-step wizard',
    detail: 'One step at a time with a clickable dot rail, back, skip and next controls, and your position remembered per path. The full text remains available for printing and for anyone without scripting.' },

  { d: '2026-07-25', t: 'feature', a: 'data', h: '57ac990',
    title: 'A File Upload guide, and a guide you tick through',
    detail: 'The third setup path was written against the actual parsers rather than from memory, covering six sources and where to request an export from each, and all three paths were reworked into something you move through instead of a wall of text.' },

  { d: '2026-07-25', t: 'design', a: 'ui', h: '42a6509',
    title: 'The setup guide speaks the landing page\'s language',
    detail: 'The page wash, the cursor-following glows, the equaliser floor, the glass cards and the section labels were all carried across, so arriving from a source card feels like walking to the next room rather than a different building.' },

  { d: '2026-07-25', t: 'design', a: 'ui', h: '0e7ad31',
    title: 'Benefit stickers and a recommended ribbon',
    detail: 'Each import card carries a short sticker naming the one reason to pick it — full control, zero upkeep, fastest start — and Google Sheets is dressed as the chart\'s gold entry with a recommended ribbon.' },

  { d: '2026-07-25', t: 'fix', a: 'ui', h: '95e0d1c',
    title: 'Notes fly over the neighbouring cards',
    detail: 'The burst layer sat under every card, so notes leaving their own card slid behind the next one. The clicked card now lifts while its notes are in flight, so they emerge from behind it and sail across the others.' },

  { d: '2026-07-25', t: 'design', a: 'ui', h: 'da2f3af',
    title: 'A burst of notes when you pick a source',
    detail: 'Clicking an import card sends nine notes out from behind it, each taking its colour from that card\'s own identity, born hidden behind the card and appearing only once they clear its edge.' },

  { d: '2026-07-25', t: 'design', a: 'ui', h: '45794a5',
    title: 'Hand-drawn animated icons on the landing page',
    detail: 'The skip link became a turntable whose platter spins up and whose tonearm drops on hover, so the action of resuming performs the gesture of restarting a record, and the vinyl gained a specular sheen.' },

  { d: '2026-07-25', t: 'design', a: 'ui', h: '9394a64',
    title: 'Stronger cursor response',
    detail: 'Against circles several hundred pixels across, the original movement barely registered. It is roughly three times stronger and quicker to follow, while still damped rather than snapping to the cursor.' },

  { d: '2026-07-25', t: 'design', a: 'ui', h: '6192e2a',
    title: 'Landing glows follow the cursor',
    detail: 'The two background glows now lean toward the pointer rather than only looping on a fixed drift.' },

  { d: '2026-07-25', t: 'i18n', a: 'charts', h: 'c0c378d',
    title: 'Bubbling Under translated',
    detail: 'The entire section rendered from fixed English: its title, caption, all thirteen badges with their tooltips, the legend and the track list. The chart toggles and Collapse All had the same problem.' },

  { d: '2026-07-24', t: 'fix', a: 'data', h: '3b85350',
    title: 'Last.fm syncs claimed to be connecting to Google Sheets',
    detail: 'The status text named Sheets whatever your actual source was, and switching language reset a live status back to that text — together making a Last.fm sync look stuck on a connection that was never happening.' },

  { d: '2026-07-24', t: 'fix', a: 'charts', h: 'a4ec37f',
    title: 'Hero stats frozen after a big first sync',
    detail: 'The quiet background refresh never rebuilt the hero statistics, so total plays, days, top artist and streak stayed stuck at the early figures even after the full history had finished loading.' },

  { d: '2026-07-24', t: 'fix', a: 'ui', h: '12e496b',
    title: 'Landing page top unreachable with a card open',
    detail: 'The screen centred its contents in a fixed scrolling container, and once an expanded card pushed past the screen height, that centring made the overflow scrollable in one direction only — leaving the logo at the top permanently out of reach.' },

  { d: '2026-07-24', t: 'fix', a: 'ui', h: 'a0c9a8b',
    title: 'Landing glow clear of the skyline',
    detail: 'The right-hand glow sat on top of the equaliser bars and muddied them.' },

  { d: '2026-07-24', t: 'i18n', a: 'ui', h: '901e3ea',
    title: 'Sheets card text translated',
    detail: 'The template button, the setup sticker and the divider had been wired for translation but their actual translations were never added.' },

  { d: '2026-07-24', t: 'feature', a: 'ui', h: '9ddfb92',
    title: 'Google Sheets card redesigned',
    detail: 'The Sheets card gained a template button, a 30-second setup sticker and an already-have-a-sheet divider. These had been committed alongside an unrelated fix without review, and were documented separately once noticed.' },

  { d: '2026-07-24', t: 'fix', a: 'ui', h: '2b4c766',
    title: 'Landing glow circles were invisible',
    detail: 'A heavy blur spread an already faint colour across a large circle, then the element\'s own transparency diluted it again, leaving roughly 2 to 10 percent of the intended intensity — present in the code, absent on screen.' },

  { d: '2026-07-24', t: 'fix', a: 'themes', h: '2148313',
    title: 'Landing buttons unreadable on three light themes',
    detail: 'A rule setting near-white text was written for those themes\' dark masthead inside the app, but the landing screen reuses the same class directly on a pale page, leaving the theme and language buttons almost invisible.' },

  { d: '2026-07-24', t: 'design', a: 'ui', h: '9a706ba',
    title: 'Every landing control excites the room',
    detail: 'The same reaction was extended to the sign-in button and all three source cards, so engaging with any of them stirs the skyline rather than only the main call to action.' },

  { d: '2026-07-24', t: 'design', a: 'ui', h: 'b301bf5',
    title: 'The skyline reacts to the demo button',
    detail: 'Hovering the demo button swells the spectrum and speeds every bar up, so the floor feels the drop coming. Browsers that cannot do this simply keep the idle animation.' },

  { d: '2026-07-24', t: 'design', a: 'ui', h: 'bea5a53',
    title: 'The landing page as a chart show going on air',
    detail: 'Twenty-four accent-tinted frequency bars breathe along the bottom edge, each with its own height, phase and tempo so it reads as a real analyser rather than a repeating pattern.' },

  { d: '2026-07-24', t: 'design', a: 'ui', h: '2a4d824',
    title: 'The demo button as a now playing chip',
    detail: 'The plain pill became a player treatment with three dancing equaliser bars, which freeze at staggered heights for anyone who has asked for reduced motion, and a gradient sweep on hover.' },

  { d: '2026-07-24', t: 'perf', a: 'data', h: 'aca2118',
    title: 'Charts appear before a long history finishes downloading',
    detail: 'On a first connect with a large history you used to watch a skeleton and a page counter until every page had arrived. The charts are now painted once the newest 20 pages are in, roughly 4,000 plays, while the rest keeps downloading behind them.' },

  { d: '2026-07-24', t: 'perf', a: 'ui', h: '32a40f1',
    title: 'About 1.8 MB of code no longer blocks first paint',
    detail: 'Three large libraries used only for image export and for Spotify and Deezer imports were removed from the page entirely and are now fetched the first time they are actually needed.' },

  { d: '2026-07-24', t: 'perf', a: 'data', h: '35a2609',
    title: 'Last.fm sync fetches only what is new',
    detail: 'A sync used to re-download every page of your history. It now asks only for listens newer than what is already stored, which is usually a single page. The full download happens on first connect, after clearing the cache, or once a week.' },

  { d: '2026-07-24', t: 'perf', a: 'data', h: '8af7e77',
    title: 'Instant load from the last copy',
    detail: 'Whatever was last stored now renders immediately, however old it is, and refreshes quietly in the background — no skeleton, no reset. Waiting for the network before showing anything was the single slowest thing about opening the app.' },

  { d: '2026-07-23', t: 'i18n', a: 'charts', h: '13b3c26',
    title: 'Album modal sections translated',
    detail: 'Chart Run History, Listening Heatmap, Streaming History and their expanders were fixed English strings that never translated, in the album modal, the song modal and the chart row expanders alike.' },

  { d: '2026-07-23', t: 'feature', a: 'charts', h: '4fe4173',
    title: 'Album chart section enlarged and made explorable',
    detail: 'The monthly trend and the breakdown table were set in type too small to read comfortably. The whole block was scaled up and given more height, and the bars now respond: hovering shows an anchored count and a glow.' },

  { d: '2026-07-23', t: 'i18n', a: 'charts', h: '8ffeca8',
    title: 'Spanish album modal wording corrected',
    detail: 'The rank is now written as an ordinal so it reads as a position rather than a claim about being a top album, certification names use their translated forms instead of English, and several abbreviated Spanish labels were spelled out.' },

  { d: '2026-07-22', t: 'i18n', a: 'soundtrack', h: 'f6f77c3',
    title: 'Featured artist labels translated',
    detail: 'The banner label and every tile label and note had been written as fixed English strings that bypassed the translation system entirely.' },

  { d: '2026-07-22', t: 'feature', a: 'soundtrack', h: '772bd15',
    title: 'Featured artist album and song cards expanded',
    detail: 'Favourite album and song now pick the most played and show their own play and day streaks, calculated the same collaboration-aware way. Several awkward tile labels were rewritten.' },

  { d: '2026-07-22', t: 'fix', a: 'soundtrack', h: '7be6f81',
    title: 'Featured artist streaks made consistent',
    detail: 'Play streak and favourite album streak used different definitions and neither counted collaboration tracks as continuing an artist\'s run, which let the album streak exceed the play streak it sits inside. Both now walk the same timeline with the same matching.' },

  { d: '2026-07-21', t: 'fix', a: 'soundtrack', h: '409a70f',
    title: 'Artist Milestone artwork falls back too',
    detail: 'Rows were left blank whenever the single source tried had no match for the milestone track.' },

  { d: '2026-07-21', t: 'design', a: 'soundtrack', h: 'ddd8cef',
    title: 'Listening Streaks recap reworked',
    detail: 'A live current-streak counter and a link to the streak window sit oddly in a retrospective view, so they were replaced with an active days coverage figure, and the record cards were made to state clearly what they are.' },

  { d: '2026-07-20', t: 'fix', a: 'soundtrack', h: 'c9f3998',
    title: 'Wrong artist photos corrected',
    detail: 'Searching an artist name often returns several unrelated profiles sharing it, including empty stub entries, and the first was being taken whatever it was. Matches with the same name are now ranked by following and known blank images filtered out.' },

  { d: '2026-07-20', t: 'fix', a: 'soundtrack', h: '7a9a81f',
    title: 'Soundtrack artwork falls back properly',
    detail: 'The coverflow cards only ever tried one source and gave up, unlike the chart tables which fall through several. The centred card\'s artwork is also clickable to cycle sources by hand, and the choice is remembered.' },

  { d: '2026-07-20', t: 'fix', a: 'soundtrack', h: 'e31c291',
    title: 'January compared against the previous December',
    detail: 'January had nothing to compare to inside a year-filtered period, so it fell back to the previous December, showing a flat zero when there is genuinely no earlier data so the layout stays consistent.' },

  { d: '2026-07-20', t: 'feature', a: 'soundtrack', h: 'c6398af',
    title: 'Chart History Replay redesigned',
    detail: 'Artist photos, movement badges, a scrubber and play, pause and speed controls. Rows now persist between weeks and glide into their new positions, matching the main chart\'s bar race, rather than flashing to fresh content each step.' },

  { d: '2026-07-20', t: 'fix', a: 'soundtrack', h: 'f540836',
    title: 'Awards never appeared on the Soundtrack tab',
    detail: 'The lookup tried to iterate a plain object as if it were a list, which throws, silently abandoning the whole section every time. It was also rebuilt as trophy-shelf cards with artwork and a win count.' },

  { d: '2026-07-20', t: 'fix', a: 'soundtrack', h: 'd0d99f9',
    title: 'Milestone lists paginated',
    detail: 'The artist list was never actually height-limited, because the rule doing the clipping named only the other list, so a long history dumped almost everything at once. Both now sit in a fixed-height box revealing 25 at a time.' },

  { d: '2026-07-20', t: 'fix', a: 'soundtrack', h: 'e03e3cf',
    title: 'A time zone bug in the streak count',
    detail: 'The walk through your current streak mixed dates parsed as universal time with dates read as local, which could undercount and produce a current streak longer than the all-time best it was being compared against. A record-breaking live streak now folds into the all-time card with a New Record badge instead of two cards contradicting each other.' },

  { d: '2026-07-20', t: 'feature', a: 'soundtrack', h: '5845431',
    title: 'More milestone checkpoints',
    detail: 'Overall totals now mark every 25,000 past 10,000, closing a bare jump from 100,000 straight to 250,000 that skipped round numbers like 200,000. Artist checkpoints step every 500 rather than stopping at 10,000, and split comma-separated credits like the rest of the tab.' },

  { d: '2026-07-20', t: 'fix', a: 'soundtrack', h: 'b860702',
    title: 'Milestones split into yours and artists\'',
    detail: 'The section read as one timeline, which made an artist crossing a play count look like one of your own listening totals. They are now two clearly labelled sections.' },

  { d: '2026-07-20', t: 'feature', a: 'soundtrack', h: 'ecaaf6f',
    title: 'Monthly Activity became inspectable',
    detail: 'The bars were small, low contrast and static. Each month is now a tap target opening its count, share of the total, change on the month before and top artist, with a gold badge on the peak, striping on quiet months, and a momentum pill comparing the back half of the period with the front.' },

  { d: '2026-07-19', t: 'fix', a: 'soundtrack', h: 'a6fab22',
    title: 'Generic silhouette avatars filtered out',
    detail: 'Deezer returns a fixed no-photo graphic rather than an empty result, so the filter meant to catch missing artwork let it through as if it were a real picture.' },

  { d: '2026-07-19', t: 'design', a: 'soundtrack', h: '8da93f4',
    title: 'Coverflow polish and split artist credits',
    detail: 'Bigger headers, tighter spacing, and the medal emoji replaced with plain numerals on a gradient because emoji render inconsistently and were hard to read at that size. Comma-separated credits now count toward each artist.' },

  { d: '2026-07-19', t: 'fix', a: 'soundtrack', h: '22258b7',
    title: 'Coverflow scrolling overshot',
    detail: 'Each notch of the wheel moved about 1.7 cards, skipping straight past the neighbouring entry. Each event is now capped to one card. Artwork and text were enlarged throughout.' },

  { d: '2026-07-19', t: 'feature', a: 'soundtrack', h: '8cad3b8',
    title: 'Top Artists and Songs as coverflow',
    detail: 'The two top-five lists became full-width carousels of the top fifty, driven by drag, wheel, keyboard and touch.' },

  { d: '2026-07-19', t: 'feature', a: 'playlists', h: 'f0aeef8',
    title: 'At-risk saving covers artist and album streaks',
    detail: 'Save Playlist and Copy Tracklist only included song streaks, so the artist and album streaks at risk that day were quietly left out. They now pull in the most recently played track for any not already represented, checking albums before artists so nothing is duplicated.' },

  { d: '2026-07-19', t: 'design', a: 'soundtrack', h: '9b84986',
    title: 'Loyalty Score as a chart stamp',
    detail: 'The flat ring and generic cards became a tilted postmark, a highlighter swipe verdict, a returning-artist tally and ticket-stub artist cards with perforated edges.' },

  { d: '2026-07-19', t: 'design', a: 'soundtrack', h: '8564557',
    title: 'Larger, clearer stat tiles',
    detail: 'The icons moved inline with their labels and every size was increased for legibility.' },

  { d: '2026-07-19', t: 'design', a: 'soundtrack', h: 'b896ae1',
    title: 'The number one artist as a banner',
    detail: 'A larger featured card with a photo banner faded behind the text, and a collage of statistics scoped to that artist alone: days played, their biggest day, day and play streaks, albums and songs played, favourite album streak and most played song.' },

  { d: '2026-07-19', t: 'feature', a: 'soundtrack', h: '1154d6d',
    title: 'The Reel',
    detail: 'Clicking any of the headline statistics swaps a ticker below the strip showing what is behind that number, reusing the Time Machine\'s cards and its action menu.' },

  { d: '2026-07-19', t: 'design', a: 'soundtrack', h: 'e61139c',
    title: 'Your Soundtrack rebuilt as a story',
    detail: 'A full redesign: a colour-blocked hero, stat tiles, a milestone timeline, flame streak cards and a circular loyalty ring. New Discoveries became a floating tank of artist portraits that rise and drift and recycle endlessly, weighted so your most played reappear more often, pausing when you hover.' },

  { d: '2026-07-19', t: 'fix', a: 'settings', h: '3e62482',
    title: 'Section display toggles were not syncing',
    detail: 'The list of settings to sync named an old key that nothing used any more instead of the current one, so the kebab menu\'s toggles saved locally but never reached your account, and reset on a fresh browser.' },

  { d: '2026-07-19', t: 'feature', a: 'events', h: 'ce3461a',
    title: 'The same menu on Recent Releases',
    detail: 'These are already out, so the menu offers the player as well — but only when the album actually has play history behind it, otherwise it falls back to the search options.' },

  { d: '2026-07-19', t: 'fix', a: 'charts', h: 'cba6e9c',
    title: 'Sub-chart toggles showing on the wrong tabs',
    detail: 'The Chart, Bubbling Under, Off the Chart and New Entries buttons stayed visible on Events, Records, Awards and Raw Data, because only the sections themselves were being hidden and not the bar of toggles beside them.' },

  { d: '2026-07-19', t: 'feature', a: 'events', h: 'ba44578',
    title: 'The same menu on Upcoming Releases',
    detail: 'Extended to the upcoming releases sections in all four view modes. There is no player option here, because these records are not out yet.' },

  { d: '2026-07-19', t: 'feature', a: 'playlists', h: '1575388',
    title: 'Time Machine cards offer a choice',
    detail: 'Clicking a card opened one fixed action. It now opens a small menu: search Spotify, search Google, or work with the in-app player. Artists and albums also offer their last ten songs, to queue one at a time or all at once.' },

  { d: '2026-07-17', t: 'design', a: 'ui', h: 'ea35e79',
    title: 'Larger navigation text',
    detail: 'The tab labels were too small to read comfortably.' },

  { d: '2026-07-12', t: 'feature', a: 'ui', h: 'cbc0cf2',
    title: 'Album streaks nest inside artist runs',
    detail: 'Playing a discography album by album produced an album streak that reset with each record, hiding the longer artist run underneath. The artist run is now treated as the real streak and drives the banner, with the current album shown as an inset chip rather than competing with it.' },

  { d: '2026-07-12', t: 'fix', a: 'mobile', h: 'd03c70f',
    title: 'Chart titles cut off on dark themes',
    detail: 'A leftover pill background and padding that every light theme had already removed was still present on dark themes, and the extra padding was just enough to push the title past the point where it gets truncated on a phone.' },

  { d: '2026-07-12', t: 'design', a: 'charts', h: '87a280d',
    title: 'New Entries headers made scannable',
    detail: 'The header was one long sentence standing in for a title, so telling the three sections apart meant reading the whole thing. Each now has a short name with the detail beneath it as a subtitle.' },

  { d: '2026-07-12', t: 'fix', a: 'charts', h: '72c5935',
    title: 'Lifetime weeks and final streak separated',
    detail: 'The weeks figure on a dropout is a lifetime total that may span several separate stints, and it was replaced with just the run that ended, losing that context. It is back, and a distinct label now reports the final consecutive streak separately when there was one.' },

  { d: '2026-07-12', t: 'feature', a: 'charts', h: '8811f32',
    title: 'Peak rank on dropouts',
    detail: 'A dropout that once did better than the position it just fell from carries its peak, shown only when the peak actually beats that last rank so it never restates the obvious.' },

  { d: '2026-07-12', t: 'feature', a: 'charts', h: '5591c83',
    title: 'Dropouts linked to where they landed',
    detail: 'Each dropout is cross-referenced against this week\'s Bubbling Under zone and shows its new position there using the same badges that section uses, so a song leaving the chart and appearing just below it reads as one event instead of two unconnected ones.' },

  { d: '2026-07-12', t: 'feature', a: 'charts', h: '6283757',
    title: 'Off the Chart improved',
    detail: 'A celebratory message when nothing dropped out, rather than the section silently disappearing; the weeks figure clarified so it is not confused with Bubbling Under\'s streak; and dropouts that fell from a high rank marked as the more serious losses they are.' },

  { d: '2026-07-12', t: 'fix', a: 'mobile', h: '95ace2d',
    title: 'Streak banner edges misaligned on mobile',
    detail: 'The banner sat inset while the bars above and below it ran edge to edge, so its borders did not line up. Hiding a spacer on mobile had also bunched the label and count to one side instead of spanning the bar.' },

  { d: '2026-07-12', t: 'design', a: 'ui', h: '87b4c48',
    title: 'Navigation hint quietened',
    detail: 'The floating pill with its background and border became plain muted caption text, pulled in close to the bar above rather than floating in a gap.' },

  { d: '2026-07-11', t: 'design', a: 'charts', h: '44c9042',
    title: 'This Week\'s stats given a hierarchy',
    detail: 'Twelve identical bordered tiles became three tiers: core totals, highlights, and image-forward spotlight cards for the of the moment figures, each category keeping its own accent.' },

  { d: '2026-07-09', t: 'feature', a: 'guide', h: '4974a5e',
    title: 'Navigation inside the Charts Guide',
    detail: 'Twenty sections stacked with no way to reach any of them directly. A sticky row of jump links was added, links can now target an individual section, and the reference-only sections were collapsed by default so the page stays scannable.' },

  { d: '2026-07-09', t: 'fix', a: 'themes', h: '58dfc2f',
    title: 'Stack ranks invisible on light themes',
    detail: 'Rank numbers were fixed to a translucent white that was only ever overridden for the top three, so everything from fourth place down disappeared on a light background.' },

  { d: '2026-07-09', t: 'design', a: 'charts', h: '5fc26c4',
    title: 'Proper icons on the chart toggles',
    detail: 'The type toggles and section headers moved from unicode glyphs and emoji to drawn icons.' },

  { d: '2026-07-09', t: 'design', a: 'charts', h: '16c7026',
    title: 'Album certifications as vinyl cards',
    detail: 'The album modal\'s flat badge grid was replaced with the same tiered frame and spinning record design used on the Certifications Wall, with real artwork loaded in.' },

  { d: '2026-07-09', t: 'feature', a: 'charts', h: 'b04afa3',
    title: 'Open a detail page from any view',
    detail: 'Only the table view let you click through to an artist, album or song. Every layout now does, and the per-row hint moved into the section subtitle where it is said once rather than on every line. Stack view also gained song titles, which it had skipped.' },

  { d: '2026-07-08', t: 'feature', a: 'charts', h: 'a3b4b9b',
    title: 'Show one chart type at a time',
    detail: 'A toggle above the chart sections renders only Songs, Artists or Albums, along with that type\'s Bubbling Under, Off the Chart and New Entries. The choice is remembered and survives moving between periods.' },

  { d: '2026-07-08', t: 'fix', a: 'mobile', h: '6575664',
    title: 'Mobile navigation rebuilt as an icon grid',
    detail: 'The desktop layout squeezed translated labels into uneven wrapped rows on phones, and the horizontal scroll meant as a fallback was silently clipping Playlists and Charts Guide entirely, because the second row\'s overflow handling — needed for its collapse animation — was swallowing the scroll. Tabs were also reordered for phones.' },

  { d: '2026-07-07', t: 'feature', a: 'player', h: '3adc82f',
    title: 'Play buttons on Off the Chart entries',
    detail: 'Songs play directly and artists and albums open the track picker, matching the other sections, and the per-section show and hide toggle now covers them.' },

  { d: '2026-07-07', t: 'feature', a: 'charts', h: '9163fa9',
    title: 'Off the Chart split by type',
    detail: 'The single combined panel with three columns became three independent sections, each sitting directly below its own type\'s Bubbling Under block, so songs, artists and albums each read as one continuous story.' },

  { d: '2026-07-07', t: 'fix', a: 'themes', h: '5b1cd5f',
    title: 'Three more surface colours frozen on the dark theme',
    detail: 'The same fault as the earlier text colour: three surface values were defined once inside the default dark theme rather than per theme, so every light theme silently fell back to a dark navy fill wherever they were used, including the Awards category cards. Several hard-coded Awards colours were corrected too.' },

  { d: '2026-07-06', t: 'design', a: 'charts', h: '52ea47a',
    title: 'Best Day tile recoloured',
    detail: 'It now uses the same accent as Total Plays rather than amber, pairing the two figures it sits beside.' },

  { d: '2026-07-06', t: 'i18n', a: 'charts', h: 'e53899b',
    title: 'Spanish previous-rank header shortened',
    detail: 'It was overflowing and wrapping where the other column headers did not.' },

  { d: '2026-07-06', t: 'fix', a: 'themes', h: 'c5e5566',
    title: 'A text colour frozen on the default theme',
    detail: 'One text colour was defined only inside the default dark theme, so its value froze at that theme\'s near-white and every other theme inherited it rather than its own. On light themes that made things like playlist names almost invisible.' },

  { d: '2026-07-06', t: 'design', a: 'charts', h: '1464b39',
    title: 'Gold certification icon changed to a coin',
    detail: 'The star clashed with the stars already used for chart peaks and yearly rankings, so gold badges kept reading as another peak marker. Changed everywhere a gold badge appears.' },

  { d: '2026-07-06', t: 'fix', a: 'charts', h: '800fcbe',
    title: 'Options menu wrapping off the header',
    detail: 'When a chart title was long the menu button wrapped to the next line and dragged its dropdown to the wrong edge. The title truncates instead.' },

  { d: '2026-07-06', t: 'design', a: 'charts', h: '7530a36',
    title: 'Chart run button given its own column',
    detail: 'It had been sharing the rank cell, so the rank column sometimes showed an icon instead of a number. It now has a column of its own across every chart table and history modal, and uses a line icon rather than a coloured emoji.' },

  { d: '2026-07-06', t: 'design', a: 'charts', h: 'de7f7f8',
    title: 'Previous rank moved next to Rank',
    detail: 'The previous position now sits directly after the rank rather than further along the row, where the comparison is actually useful, with a stacked subheading to label it.' },

  { d: '2026-07-06', t: 'fix', a: 'data', h: '31df041',
    title: 'Backend security updates',
    detail: 'Ten reported vulnerabilities in backend dependencies were closed, covering request smuggling, a cross-origin bypass, a symlink overwrite and a credential leak.' },

  { d: '2026-07-06', t: 'design', a: 'ui', h: '52ba943',
    title: 'Tactile date navigation',
    detail: 'The previous and next buttons press inward when clicked and render as proper chevrons rather than text arrows, with their labels kept in every language.' },

  { d: '2026-07-06', t: 'fix', a: 'ui', h: '30a0d5d',
    title: 'Stylesheet cache bumped again',
    detail: 'The navigation demotion was not appearing because the browser was serving the cached stylesheet under an unchanged address.' },

  { d: '2026-07-06', t: 'design', a: 'ui', h: 'bf9114b',
    title: 'Second navigation row reads as secondary',
    detail: 'Smaller text, tighter spacing and a resting dip in opacity, returning to full on hover, so Records, Events and Awards sit visibly below the primary period tabs.' },

  { d: '2026-07-06', t: 'design', a: 'ui', h: 'fbb1c5d',
    title: 'A sliding indicator on the tabs',
    detail: 'One bar per row glides to the active tab with a springy easing, replacing an underline that switched instantly between buttons.' },

  { d: '2026-07-06', t: 'design', a: 'ui', h: '3e12236',
    title: 'The play count rolls like an odometer',
    detail: 'Each changed digit rolls from its previous value on sync instead of the whole number snapping.' },

  { d: '2026-07-06', t: 'design', a: 'mobile', h: 'ec50f4e',
    title: 'Stat cards paired with their counterparts on mobile',
    detail: 'The three strips now collapse into one grid on phones so each core figure sits beside its related card — Total Plays next to Best Day — without changing the desktop layout at all.' },

  { d: '2026-07-06', t: 'fix', a: 'mobile', h: '93aaeeb',
    title: 'Streak close button overlapping the filter bar',
    detail: 'Both were pinned to the same point at the top of the scrolling area on mobile and rendered on top of each other.' },

  { d: '2026-07-06', t: 'fix', a: 'events', h: '4532c19',
    title: 'Oversized placeholders on releases without artwork',
    detail: 'The initials placeholder always used the large tile size, so a release with no cover art rendered an enormous box in table view instead of a normal thumbnail.' },

  { d: '2026-07-06', t: 'design', a: 'mobile', h: '9479800',
    title: 'Masthead controls get out of the way on mobile',
    detail: 'The theme, day and language buttons fade out after a few seconds without scrolling and return when you scroll or open a panel, so they are not sitting over content while idle. They were also lifted above the sticky date bar, which they had been colliding with.' },

  { d: '2026-07-05', t: 'design', a: 'charts', h: '1aab1b1',
    title: 'Size tab back to a list',
    detail: 'The two-column grid of filled pills did not work visually; it returned to the same row list the View tab uses.' },

  { d: '2026-07-05', t: 'fix', a: 'ui', h: 'aad55a1',
    title: 'Stale stylesheet served through the menu rewrite',
    detail: 'The stylesheet version had not been bumped, so browsers could keep serving an old cached copy — including a layout bug already fixed — even after everything else updated.' },

  { d: '2026-07-05', t: 'feature', a: 'charts', h: '4a22bcd',
    title: 'Chart controls gathered into one menu',
    detail: 'The scattered rows of buttons for display, size, view, export, share and playback were consolidated into a single options menu in each section header, tabbed into Show, Size, View and Actions, which remembers the tab you last used.' },

  { d: '2026-07-05', t: 'feature', a: 'ui', h: 'fde4fca',
    title: 'Page through the streak graveyard',
    detail: 'Ended streaks were capped at the top 25 with no way to see past them. Pagination makes every ended streak reachable.' },

  { d: '2026-07-05', t: 'fix', a: 'player', h: 'de6a039',
    title: 'Hiding play buttons missed two sections',
    detail: 'The per-section toggle only covered the three main chart sections, so Bubbling Under and New Entries kept showing their play buttons after you turned them off.' },

  { d: '2026-07-04', t: 'design', a: 'events', h: '68ee0b2',
    title: 'Calendar numbers matched',
    detail: 'The year beside the month name and the day numbers in both the events and New Music Friday calendars.' },

  { d: '2026-07-04', t: 'design', a: 'awards', h: '1e511a2',
    title: 'Awards numbers matched',
    detail: 'The year selector, the year badges and the ceremony step counter.' },

  { d: '2026-07-04', t: 'design', a: 'soundtrack', h: 'd7f4fab',
    title: 'Soundtrack milestones and streaks matched',
    detail: 'The remaining number-bearing headlines and streak counts.' },

  { d: '2026-07-04', t: 'design', a: 'soundtrack', h: '61d7ec2',
    title: 'Your Soundtrack numbers matched',
    detail: 'The big year, the statistics, the top artist and song counts, the monthly activity figures and the loyalty percentage all moved onto the shared face.' },

  { d: '2026-07-04', t: 'design', a: 'guide', h: '0bf6fb9',
    title: 'Guide year numbers matched',
    detail: 'The years in the guide\'s on this day section.' },

  { d: '2026-07-04', t: 'design', a: 'guide', h: '0c75843',
    title: 'Guide statistics matched to the rest',
    detail: 'The at-a-glance numbers in the Charts Guide were still on the old face.' },

  { d: '2026-07-04', t: 'design', a: 'ui', h: '4beafb4',
    title: 'Wordmark and stat numbers settle on one face',
    detail: 'After trying both experiments, the wordmark and the large numbers were consolidated onto the existing interface sans, and the tracking restored now that the glyphs are proportional again.' },

  { d: '2026-07-04', t: 'design', a: 'ui', h: '2af7160',
    title: 'Wordmark in Martian Mono',
    detail: 'A different monospace face for the wordmark only, with its maximum size reduced because its wider glyphs need more room.' },

  { d: '2026-07-04', t: 'design', a: 'ui', h: '70e233a',
    title: 'Wordmark on the mono face',
    detail: 'The wordmark moved to the monospace face so the whole masthead lockup reads as one typeface, with tracking eased to suit.' },

  { d: '2026-07-04', t: 'design', a: 'ui', h: 'e3660e7',
    title: 'Stat numbers in a scoreboard face',
    detail: 'Neither the display nor the mono face suited the big numbers, so six real candidates were rendered for comparison and a bold condensed face was chosen, closer to a chart countdown.' },

  { d: '2026-07-04', t: 'design', a: 'ui', h: '218132e',
    title: 'Stat numbers in the data font',
    detail: 'The large figures moved onto the same face already used for play counts in the tables.' },

  { d: '2026-07-04', t: 'fix', a: 'ui', h: '61588d3',
    title: 'Redesign review fixes',
    detail: 'Three stacking values were referenced but never actually defined, because the script that should have added them stopped before writing, leaving ten overlay and tooltip rules with no stacking order at all. They were defined and corrected to their original values.' },

  { d: '2026-07-04', t: 'design', a: 'ui', h: '896bd68',
    title: 'Redesign: the standalone pages caught up',
    detail: 'The setup guide, privacy and terms pages were brought onto the new fonts and softened palettes, and pre-existing overflow in the setup guide\'s step grid and the privacy data table was fixed.' },

  { d: '2026-07-04', t: 'fix', a: 'mobile', h: 'bcf6f28',
    title: 'Redesign: mobile overflow eliminated',
    detail: 'Section size bars were overflowing narrow screens and the masthead was two pixels too wide. At 375 pixels the page now has no horizontal overflow at all on any view, against a baseline that had been 379 to 468 pixels.' },

  { d: '2026-07-04', t: 'design', a: 'ui', h: '09bc2ba',
    title: 'Redesign: modals, controls and focus',
    detail: 'Modals gained a glass blur, a larger radius and deeper shadows. Every ad-hoc stacking value was migrated onto one documented scale with the order preserved exactly, and a visible focus ring was added for keyboard users.' },

  { d: '2026-07-04', t: 'design', a: 'charts', h: '04dfd18',
    title: 'Redesign: tables and dense data',
    detail: 'A shared hover wash across chart, raw data and events tables, medal colours moved onto tokens that pass contrast on light themes, and the legacy side stripes on the top three removed since the row tint already says it.' },

  { d: '2026-07-04', t: 'design', a: 'charts', h: '83c6657',
    title: 'Redesign: sections, depth and card grids',
    detail: 'Chart cards gained translucent borders and layered shadows, New Entries and Bubbling Under swapped their side stripes for tinted inset panels, and the stats strip became separated cards that lift on hover instead of a one-pixel spreadsheet grid.' },

  { d: '2026-07-04', t: 'design', a: 'ui', h: '245fdef',
    title: 'Redesign: masthead and navigation',
    detail: 'The masthead now derives its gradient and glow from the theme rather than carrying a hand-written version per theme, so every dark theme tints itself correctly and four redundant overrides were deleted. Light mastheads were softened and the navigation modernised.' },

  { d: '2026-07-04', t: 'design', a: 'themes', h: 'a6572d3',
    title: 'The 2026 redesign: tokens, colour and type',
    detail: 'The foundation of a full visual overhaul. All ten theme palettes were softened and checked for contrast, a single set of design values now drives spacing, radius, motion and depth, and the app moved to a new typeface pairing. A missing gridline colour that made graph lines render dark on light themes was added to every theme.' },

  { d: '2026-07-03', t: 'fix', a: 'mobile', h: '08c72d6',
    title: 'Chart tables fit a phone without sideways scrolling',
    detail: 'Padding and column widths were sized for a desktop, pushing the Plays column off the edge. Spacing was tightened and short column labels added, so the whole table fits between 320 and 414 pixels wide.' },

  { d: '2026-07-03', t: 'fix', a: 'mobile', h: 'dbdbd01',
    title: 'Modals that trapped you on a phone',
    detail: 'The data source, detail and streak windows could render taller than a phone screen, scrolling their close button out of reach with no other way out. Close controls are now pinned in place on mobile. A horizontal overflow was fixed at the same time.' },

  { d: '2026-07-03', t: 'fix', a: 'charts', h: 'bb9aea7',
    title: 'Ten correctness bugs from a review pass',
    detail: 'Among them: the song modal\'s heatmap and history always came back empty because the key they looked up was encoded one way and stored another; and any name containing an apostrophe broke the controls attached to it, because the encoding used left apostrophes intact. Anything by a name like "Guns N\' Roses" simply did not respond.' },


  /* ========== JUNE 2026 ========== */

  { d: '2026-06-24', t: 'fix', a: 'charts', h: 'd28ca98',
    title: 'Bubbling Under badges refined again',
    detail: 'Resurgent was firing for songs that fell from the chart into the zone and stayed there, which is not a resurgence — they never left to come back. Those now get a new Clinging badge, Yo-Yo was renamed Revolving, and the icons were updated.' },

  { d: '2026-06-24', t: 'feature', a: 'charts', h: 'a3b2c3d',
    title: 'A different chart size per section',
    detail: 'Each section carries its own size selector instead of one global bar, remembered separately for every period, so Songs can be a top 10 while Artists is a top 50 and Albums a top 25. Existing global settings are carried across on first load.' },

  { d: '2026-06-24', t: 'design', a: 'share', h: '7a0d16e',
    title: 'Share button moved right',
    detail: 'On the artists and albums sections, to match the others.' },

  { d: '2026-06-23', t: 'fix', a: 'player', h: '59476f3',
    title: 'Album play buttons offered a track list everywhere',
    detail: 'Outside the table view, pressing play on an album searched for the album title as if it were a song. Every view now shows the same track list the table did.' },

  { d: '2026-06-23', t: 'design', a: 'charts', h: 'c158933',
    title: 'Better default layouts',
    detail: 'Artists open in Mosaic and Albums in Card Grid, which suit them better than a table.' },

  { d: '2026-06-23', t: 'design', a: 'charts', h: '7a43548',
    title: 'Uniform action buttons',
    detail: 'One consistent style across the action buttons, moved below the subtitle.' },

  { d: '2026-06-23', t: 'design', a: 'charts', h: '143b85b',
    title: 'Section controls reorganised',
    detail: 'Action buttons to the left, display toggles to the right.' },

  { d: '2026-06-23', t: 'feature', a: 'charts', h: 'cfb5efa',
    title: 'A different view mode per section',
    detail: 'Songs, Artists and Albums each remember their own layout, rather than all three switching together.' },

  { d: '2026-06-23', t: 'feature', a: 'charts', h: '0e89d7b',
    title: 'Display controls per section',
    detail: 'The display menu and export button moved into each section\'s own header, and Songs, Artists and Albums each got a full independent set of toggles — hiding certification badges on songs no longer hides them on albums.' },

  { d: '2026-06-23', t: 'design', a: 'charts', h: '20a123d',
    title: 'More room to breathe',
    detail: 'More padding inside cards, more space between them, and taller headers.' },

  { d: '2026-06-23', t: 'design', a: 'charts', h: '877e15a',
    title: 'Chart sections became cards',
    detail: 'Rounded corners, a border, a background and padding give each section its own surface instead of running together.' },

  { d: '2026-06-22', t: 'design', a: 'playlists', h: '69a7eb9',
    title: 'Copy Tracklist copies immediately',
    detail: 'The button was renamed and now copies the list the moment it is pressed, still opening the window to show what was copied and confirm it.' },

  { d: '2026-06-22', t: 'feature', a: 'playlists', h: '3e5c942',
    title: 'Export your at-risk streaks as a tracklist',
    detail: 'A fourth button on At Risk Today opens the export window preloaded with those songs in a format transfer services accept, with playlist name suggestions specific to the occasion.' },

  { d: '2026-06-22', t: 'design', a: 'charts', h: 'bb14a83',
    title: 'Peak boxes made to stand out',
    detail: 'The box marking a peak week gained a stronger fill and an amber glow, with distinct gold and purple treatments for peaks in the combined chart and Bubbling Under timeline.' },

  { d: '2026-06-22', t: 'fix', a: 'themes', h: 'fdbb55c',
    title: 'Chart run boxes unreadable on light themes',
    detail: 'The boxes had a white border that vanished, tints too faint to see, and neon rank text. Borders, background strength and text colours were all corrected for light themes.' },

  { d: '2026-06-22', t: 'fix', a: 'themes', h: 'c491bd3',
    title: 'Bubbling Under badges invisible on light themes',
    detail: 'All thirteen badge types used a neon palette that all but disappeared on a light background. Each now has a light-theme version with deep text in the matching hue on a subtle tint.' },

  { d: '2026-06-22', t: 'design', a: 'ui', h: '1957d53',
    title: 'Navigation polish',
    detail: 'The More button moved below both rows, rounded corners and borders, spacing around the streak banner, and refreshed icons.' },

  { d: '2026-06-22', t: 'feature', a: 'ui', h: 'b4e76d1',
    title: 'Eleven improvements to the navigation',
    detail: 'Icons on every tab, an underline marking the active one, a tint distinguishing the second row, previews on hover, number keys 1 to 9 as shortcuts, badges marking new content, shareable links to each tab, a loading shimmer, a collapsible second row, and a bar that shrinks as you scroll.' },

  { d: '2026-06-22', t: 'feature', a: 'guide', h: 'a3240bc',
    title: 'The Charts Guide filled out',
    detail: 'Twenty sections covering every feature: a guided tour, search, your statistics, a setup checklist, on this day, suggestions, hidden gems, keyboard shortcuts, a breakdown of every tab, a glossary, frequently asked questions, a timeline, a changelog, export walkthroughs and a feedback form. The navigation was split into two rows to make room.' },

  { d: '2026-06-22', t: 'feature', a: 'guide', h: 'a0ca130',
    title: 'The Charts Guide',
    detail: 'A tab explaining the app from inside it, reachable from the navigation bar, alongside fixes to nine places where light themes had unreadable contrast.' },

  { d: '2026-06-21', t: 'design', a: 'charts', h: 'aa930ec',
    title: 'Collapse All reads as a global control',
    detail: 'It was styled like part of the display menu below it. Its toolbar background was removed and it was set apart, so it reads as something that acts on all the sections rather than one more display option.' },

  { d: '2026-06-21', t: 'design', a: 'themes', h: 'f7025b1',
    title: 'Light themes redesigned around white cards',
    detail: 'All five light themes now put pure white behind chart tables, cards and modals so content lifts off the page, with the page itself a more saturated tint of the theme colour to frame it. The navy and purple mastheads were deepened to stay distinct from their stronger page tints.' },

  { d: '2026-06-21', t: 'feature', a: 'charts', h: '2bde819',
    title: 'Collapse All',
    detail: 'A bar above the chart sections folds or unfolds Songs, Artists, Albums, Off The Chart, Bubbling Under and New Entries in one click, staying in sync when sections are toggled individually.' },

  { d: '2026-06-21', t: 'feature', a: 'player', h: '29c72bd',
    title: 'Twelve improvements to the queue',
    detail: 'Played tracks no longer vanish — they stay dimmed above the current one, with what is coming below. Each item gained a move-to-top button, removals can be undone for four seconds, duplicates can be stripped in one press, and the queue can be saved as a playlist.' },

  { d: '2026-06-21', t: 'design', a: 'player', h: '2faf372',
    title: 'The player redesigned as a vertical card',
    detail: 'The cramped horizontal strip with fourteen buttons wrapping over several rows was replaced with a proper card: a header with the drag handle and window controls, a large square of album art, a full-width seek bar, a prominent play button flanked by repeat, skip and volume, and the remaining eleven controls on one slim row beneath.' },

  { d: '2026-06-21', t: 'feature', a: 'player', h: 'e4efc9a',
    title: 'Clear the queue, and resume from Playlists',
    detail: 'A button to empty the queue, and a Resume button in the Playlists view.' },

  { d: '2026-06-21', t: 'feature', a: 'charts', h: '1708b56',
    title: 'Bubbling Under weeks in the normal chart run',
    detail: 'The ordinary weekly chart run gained a toggle revealing the weeks an entry was close but missed, alongside the weeks it charted.' },

  { d: '2026-06-20', t: 'fix', a: 'player', h: '518a484',
    title: 'Background playback guard stopped giving up',
    detail: 'Repeated automatic pauses defeated the single retry, and the handler was clearing its own state while the tab was still hidden, so it stopped trying after one resume.' },

  { d: '2026-06-20', t: 'perf', a: 'player', h: '6b1ec7e',
    title: 'Backend woken before you need it',
    detail: 'The server sleeps when idle and takes about 30 seconds to wake, which was being paid for at the moment you pressed play. It is now pinged on page load and on chart render, and the retry loop waits long enough to cover a cold start.' },

  { d: '2026-06-19', t: 'fix', a: 'player', h: 'fe9d4c6',
    title: 'Playback stopped pausing itself in the background',
    detail: 'Switching away from the tab caused the video to be forcibly paused. Those pauses are now caught and immediately resumed. Previous and next buttons were added to the Android notification.' },

  { d: '2026-06-19', t: 'feature', a: 'charts', h: 'a90bf66',
    title: 'Chart and Bubbling Under on one timeline',
    detail: 'A toggle merges the weeks an entry spent on the chart with the weeks it spent just below into a single chronological run, so a career that crossed the line repeatedly reads as one story.' },

  { d: '2026-06-19', t: 'feature', a: 'charts', h: 'f68515d',
    title: 'Preview a Bubbling Under week',
    detail: 'Clicking a week box shows the whole zone ranking for that week with the entry highlighted, and a link through to the chart.' },

  { d: '2026-06-19', t: 'feature', a: 'charts', h: '147221f',
    title: 'Bubbling Under chart runs',
    detail: 'Each entry can expand a run showing only its time in the zone: total weeks, best position, longest streak, separate stints, peak plays, and a box per week.' },

  { d: '2026-06-18', t: 'feature', a: 'player', h: 'cb758a9',
    title: 'Lock screen playback on Android',
    detail: 'The current track is registered with the operating system, so playback continues when the screen locks or you switch apps, and the lock screen controls work.' },

  { d: '2026-06-17', t: 'fix', a: 'player', h: '4cdc18b',
    title: 'Search said no results when the server was waking',
    detail: 'The multi-result search had no handling for a sleeping backend, so it reported finding nothing rather than waiting.' },

  { d: '2026-06-17', t: 'feature', a: 'player', h: '76c581d',
    title: 'Play or save your at-risk streaks',
    detail: 'The At Risk Today section gained Play All, Queue All and Save Playlist, which is the section where acting immediately is the entire point.' },

  { d: '2026-06-17', t: 'feature', a: 'player', h: '439f2d5',
    title: 'Track lists on artist and album play buttons',
    detail: 'Playing an artist or album is ambiguous, so the button now opens a list of the last ten tracks you played by them, each with play and queue buttons, plus Play All and Queue All. Song rows still play directly.' },

  { d: '2026-06-17', t: 'design', a: 'charts', h: '9fd4aae',
    title: 'Bubbling Under names its chart size',
    detail: 'The heading says which chart the entries are bubbling under.' },

  { d: '2026-06-17', t: 'feature', a: 'events', h: '56e53bf',
    title: 'Play or save a day\'s singles from the calendar',
    detail: 'Viewing a single day of singles in the calendar now offers Play All, Create Playlist and Export.' },

  { d: '2026-06-17', t: 'feature', a: 'playlists', h: '0a0f238',
    title: 'The Playlists tab',
    detail: 'A full playlist manager: expand a playlist, play from any track, rename in place, drag to reorder, remove tracks and delete playlists. Playlists sync to your account and merge when you sign in elsewhere, so they survive moving between browsers and devices.' },

  { d: '2026-06-17', t: 'fix', a: 'charts', h: '2d6ca9f',
    title: 'Bubbling Under weeks counted one too many',
    detail: 'The current week was being counted twice, so every entry looked a week older than it was and a debut showed as two weeks.' },

  { d: '2026-06-17', t: 'fix', a: 'player', h: 'e381996',
    title: 'Collaborations scrobbled with the right album',
    detail: 'Featured and comma-separated credits were being sent whole, so lookups failed. The primary artist is now used, and the app checks its own play history for the album before asking Last.fm at all, which is both more reliable and one fewer request.' },

  { d: '2026-06-17', t: 'feature', a: 'player', h: 'de7434d',
    title: 'Play buttons on single releases',
    detail: 'Single cards in Recent Releases gained a play button.' },

  { d: '2026-06-17', t: 'feature', a: 'player', h: '1490fb2',
    title: 'Play buttons in Bubbling Under',
    detail: 'Entries in the zone can be played like any other row.' },

  { d: '2026-06-17', t: 'fix', a: 'player', h: '01dfc85',
    title: 'Missing albums looked up before scrobbling',
    detail: 'When a song has no album in your history, the player now asks Last.fm as soon as playback starts, so the answer has arrived before the 30-second scrobble fires.' },

  { d: '2026-06-16', t: 'fix', a: 'player', h: 'bb77a6e',
    title: 'Player was scrobbling a dash as the album name',
    detail: 'Songs with no known album store a dash as a placeholder, and the check for whether an album existed treated that as a real value, so Last.fm received a literal dash.' },

  { d: '2026-06-15', t: 'feature', a: 'charts', h: 'b4ad3cb',
    title: 'Freefall and Yo-Yo badges',
    detail: 'Freefall marks the biggest drop in plays for the week, and Yo-Yo marks entries that have bounced in and out of the zone three or more separate times.' },

  { d: '2026-06-15', t: 'design', a: 'charts', h: 'c2938f7',
    title: 'Weeks spelled out in Off the Chart',
    detail: 'Matching the change made to Bubbling Under.' },

  { d: '2026-06-15', t: 'feature', a: 'rawdata', h: '30ce882',
    title: 'Suggestions while editing a play',
    detail: 'The artist, track and album fields now suggest values from your own history as you type, which is the difference between correcting a name and re-typing it exactly.' },

  { d: '2026-06-15', t: 'feature', a: 'charts', h: 'e84cb1a',
    title: 'Consecutive streaks in Bubbling Under',
    detail: 'Alongside the all-time total, each entry shows its current unbroken run in the zone, appearing from two weeks upward and resetting when it leaves.' },

  { d: '2026-06-15', t: 'fix', a: 'charts', h: 'eb19b3e',
    title: 'Fallen badge narrowed',
    detail: 'It now only marks entries that dropped into the zone directly from the top three.' },

  { d: '2026-06-15', t: 'fix', a: 'charts', h: '382ad76',
    title: 'Bubbling Under badges made history-aware',
    detail: 'Fading was appearing for anything that had ever charted rather than only entries that fell off last week. The breakthrough badge was replaced with ones that read the full history: Fresh for a first ever appearance, Trending for consecutive weeks without ever charting, and Persistent once that passes five weeks.' },

  { d: '2026-06-15', t: 'design', a: 'charts', h: 'bd1ab2f',
    title: 'Weeks spelled out in Bubbling Under',
    detail: 'The abbreviated week badge was written in full.' },

  { d: '2026-06-15', t: 'fix', a: 'charts', h: '9d3ff24',
    title: 'Bubbling Under on yearly and all-time charts',
    detail: 'Those views draw through a different path that never hid the section.' },

  { d: '2026-06-15', t: 'fix', a: 'charts', h: 'e15a769',
    title: 'Bubbling Under leaking into other tabs',
    detail: 'Six tabs return before the code that would have hidden the section ever runs, so it stayed on screen where it made no sense.' },

  { d: '2026-06-15', t: 'feature', a: 'charts', h: '17acfa3',
    title: 'Bubbling Under',
    detail: 'A section showing the songs, artists and albums sitting just outside the chart — the next ten, or fifty on a top 100 — so near-misses are visible rather than invisible. Each entry carries how many plays it is short, and badges for fading, potential breakthroughs and weeks spent in the zone.' },

  { d: '2026-06-14', t: 'design', a: 'charts', h: '23a94f5',
    title: 'Compact view columns rethought',
    detail: 'Medal emoji were replaced with rank numbers keeping their podium colours, and the combined movement column was split into weeks on chart and previous position, matching the table view.' },

  { d: '2026-06-14', t: 'fix', a: 'charts', h: '0d67089',
    title: 'Compact play button and arrow alignment',
    detail: 'The play button was recoloured and the movement arrows centred.' },

  { d: '2026-06-14', t: 'fix', a: 'charts', h: 'e31747d',
    title: 'Clearer click targets in Stack view',
    detail: 'Songs expand in place, while clicking an artist or album title opens its page.' },

  { d: '2026-06-14', t: 'fix', a: 'charts', h: 'b2b3192',
    title: 'New and returning edges visible on podium cards',
    detail: 'The gold, silver and bronze glow was covering the teal and purple edge that marks a new or returning entry. The glow is now clipped to three sides so both can be seen.' },

  { d: '2026-06-14', t: 'design', a: 'charts', h: '0f287b8',
    title: 'Movement colours across every view',
    detail: 'Bar colours and entry borders driven by movement were extended to Table, Card Grid, Compact and Filmstrip.' },

  { d: '2026-06-14', t: 'fix', a: 'charts', h: '871875c',
    title: 'Stack rank numbers cut off',
    detail: 'The large rank numbers were being clipped.' },

  { d: '2026-06-14', t: 'feature', a: 'charts', h: 'acab8f6',
    title: 'Fifteen additions to Stack view',
    detail: 'Pulsing glows on the top three, a large watermark rank, a progress bar coloured by movement, coloured edges for debuts and returns, the album name beside the title, all-time plays in the meta row and weeks on chart.' },

  { d: '2026-06-14', t: 'feature', a: 'graphs', h: '73793ab',
    title: 'Per-category heatmaps made full size',
    detail: 'The artist, song and album heatmaps now match the main one in size and labelling, with hover detail and click-through on every active day.' },

  { d: '2026-06-14', t: 'feature', a: 'graphs', h: '5fa2f91',
    title: 'Nineteen additions to the streak heatmap',
    detail: 'A range selector for the past year, any single year or all time; five colour schemes; continuous shading instead of five fixed levels; month and weekday labels; and rings marking today and your peak day.' },

  { d: '2026-06-14', t: 'design', a: 'records', h: 'c50af7e',
    title: 'The Hall of Fame as plaques',
    detail: 'Each entry now shows its rank, kind, the record length counting up, the exact dates it was set between, and whether it is still running — so it is clear why each one is there rather than just that it is.' },

  { d: '2026-06-14', t: 'fix', a: 'charts', h: '2179e9a',
    title: 'Artist and album art swapped in Card Grid',
    detail: 'Both kinds were being given the same identifier because it was built from the first letter of the word, and artists and albums share one. Artwork was landing on the wrong cards.' },

  { d: '2026-06-14', t: 'fix', a: 'settings', h: '44506cf',
    title: 'Sign-in popup blocked',
    detail: 'A security header on the host was preventing the Google sign-in window from communicating back.' },

  { d: '2026-06-14', t: 'fix', a: 'charts', h: '981e832',
    title: 'Filmstrip Save button produced nothing',
    detail: 'Artwork loaded from other sites blocks a page from turning itself into an image, so saving failed silently, and only the visible part of the strip was being captured anyway. The strip is now copied off-screen at full width with every image converted first.' },

  { d: '2026-06-13', t: 'feature', a: 'player', h: '78bcf6b',
    title: 'Play an at-risk streak straight from the list',
    detail: 'Streak items play in the app instead of opening YouTube in a new tab, queueing silently if something is already playing, and artist and album entries show the last five songs you played by them.' },

  { d: '2026-06-13', t: 'feature', a: 'ui', h: 'f3d1cda',
    title: 'The streak window rebuilt',
    detail: 'Tabs for Streaks, Heatmap and Graveyard, a summary of active, at-risk and lost counts, collapsible sections that remember their state, live search, sorting by length or name, the start date on every streak, and a trophy when a current streak matches your best ever.' },

  { d: '2026-06-13', t: 'design', a: 'charts', h: '114429f',
    title: 'Filmstrip scrolls continuously',
    detail: 'The automatic scroll was rebuilt as a seamless loop that pauses on hover, matching the Time Machine ticker, instead of stepping and stopping at the end.' },

  { d: '2026-06-13', t: 'design', a: 'charts', h: 'fc7dc5e',
    title: 'Filmstrip detail panel tidied',
    detail: 'Badges moved off the card and onto one row in the expanded panel, week and play labels spelled out in full rather than abbreviated, and both wired into the translation system.' },

  { d: '2026-06-13', t: 'fix', a: 'ui', h: '8e33a30',
    title: 'Mouse drags stopped changing the period',
    detail: 'Selecting text with the mouse on a desktop was being read as a swipe and navigating away. Swipes are now recognised from touch only.' },

  { d: '2026-06-13', t: 'design', a: 'charts', h: '3998678',
    title: 'Wider filmstrip cards and restyled jump controls',
    detail: 'Cards widened again, and the jump-to-position buttons restyled to match the view tabs with shorter labels.' },

  { d: '2026-06-13', t: 'feature', a: 'charts', h: '0aa116f',
    title: 'Filmstrip made interactive',
    detail: 'Wider cards with larger artwork for the top three, titles that wrap instead of being cut off, rank and movement separated, certification and peak badges on the artwork, and a play button on hover.' },

  { d: '2026-06-12', t: 'design', a: 'charts', h: '812f0ad',
    title: 'Top-three glow in Card Grid',
    detail: 'Matching the mosaic treatment.' },

  { d: '2026-06-12', t: 'design', a: 'charts', h: '51a171a',
    title: 'Podium tints on the chart rows',
    detail: 'Gold, silver and bronze row backgrounds in the main table and the compact view.' },

  { d: '2026-06-12', t: 'design', a: 'charts', h: '8a1dd25',
    title: 'Mosaic scales to the chart size',
    detail: 'A top 50 or top 100 in a fixed height left the lower entries as unreadable slivers, so the grid now grows with the chart. The expanded card\'s contents scale to the tile they sit in.' },

  { d: '2026-06-12', t: 'design', a: 'charts', h: '9b01748',
    title: 'Stronger top-three glows',
    detail: 'With every other tile now glowing its own colour, the podium needed a wider, brighter treatment to stay distinct.' },

  { d: '2026-06-12', t: 'design', a: 'charts', h: 'f5bebcc',
    title: 'Mosaic tiles glow their own colour',
    detail: 'Each tile from fourth place down takes the most vivid colour out of its own artwork and uses it for its border and glow. The top three keep gold, silver and bronze.' },

  { d: '2026-06-12', t: 'fix', a: 'charts', h: 'ef30a0e',
    title: 'Missing artwork on the expanded mosaic card',
    detail: 'Both faces of a tile shared one identifier, so only the front ever received the image.' },

  { d: '2026-06-12', t: 'fix', a: 'player', h: 'a0b71f2',
    title: 'Search retries when the server is waking',
    detail: 'The backend sleeps when idle and returns an error while starting, which was being treated as a failed search. Those responses are now retried.' },

  { d: '2026-06-12', t: 'design', a: 'charts', h: '2de54d3',
    title: 'Artwork on the expanded mosaic card',
    detail: 'A thumbnail alongside the rank, title and artist.' },

  { d: '2026-06-12', t: 'feature', a: 'charts', h: '90f25d7',
    title: 'Click a mosaic tile to expand it',
    detail: 'A tile turns over to a face with full statistics, scaling itself up if it is too small to read, while the others dim.' },

  { d: '2026-06-12', t: 'fix', a: 'charts', h: '6b487d1',
    title: 'Mosaic frame was killing the glows',
    detail: 'The panel added around the grid was clipping the tile glows and hover effects it was meant to frame.' },

  { d: '2026-06-12', t: 'feature', a: 'charts', h: 'fa0acc1',
    title: 'Hover a mosaic tile for its chart run',
    detail: 'A frosted card slides up showing the full title, peak, weeks on chart, all-time plays with certification, this week\'s play bar, and a button to queue the track.' },

  { d: '2026-06-12', t: 'design', a: 'charts', h: '8adcb67',
    title: 'Mosaic polish and movement badges',
    detail: 'Rounder corners, a panel behind the grid, and coloured movement badges on each tile.' },

  { d: '2026-06-12', t: 'design', a: 'charts', h: '7b4b850',
    title: 'Mosaic labels always visible',
    detail: 'Title, artist and play count are permanently shown rather than appearing on hover, with a large watermark rank on each tile.' },

  { d: '2026-06-12', t: 'design', a: 'charts', h: '636e891',
    title: 'Mosaic rebuilt as a treemap',
    detail: 'Tiles now fill the space edge to edge with each area proportional to its plays, so the shape of the chart is visible in the layout itself. Gradient washes keep the text readable without hovering, and the top three carry gold, silver and bronze glows.' },

  { d: '2026-06-11', t: 'feature', a: 'charts', h: '2e0ea6d',
    title: 'Compact view improved',
    detail: 'Medals, badges, an accordion for detail, a play button, artwork on hover and a header that stays put while you scroll.' },

  { d: '2026-06-11', t: 'feature', a: 'charts', h: 'bb22b60',
    title: 'Card Grid view made interactive',
    detail: 'Clicking a card plays it, hovering reveals a play button, and right-clicking offers Play Now, Play Next, Add to Queue, Play Similar and a search. Peak and certification badges surfaced onto the cards, and movement is shown as a coloured edge.' },

  { d: '2026-06-11', t: 'fix', a: 'player', h: '62cadd1',
    title: 'Lyrics panel would not scroll',
    detail: 'The volume wheel handler was intercepting scrolls inside the lyrics.' },

  { d: '2026-06-11', t: 'feature', a: 'player', h: '7c8ddac',
    title: 'Sleep timer, lyrics, crossfade and more',
    detail: 'A sleep timer, crossfade between tracks, a lyrics panel, an adjustable scrobble threshold, album art, named playlists, Play Similar, picture-in-picture, playback speed, and a shareable card.' },

  { d: '2026-06-11', t: 'feature', a: 'player', h: '69226ab',
    title: 'Seeking, repeat, shuffle and Play Next',
    detail: 'A progress bar you can drag or nudge with the arrow keys, a repeat button cycling through off, one and all, shuffle for the existing queue, volume on the up and down keys, a Play Next option that jumps the queue, and the ability to queue a whole history at once.' },

  { d: '2026-06-11', t: 'design', a: 'player', h: '7ad2231',
    title: 'Artist names in the queue',
    detail: 'The queue listed titles only, which is not enough to tell two versions apart.' },

  { d: '2026-06-11', t: 'fix', a: 'player', h: 'd643514',
    title: 'Scrolling the queue changed the volume',
    detail: 'The wheel handler for volume was catching scrolls meant for the queue list.' },

  { d: '2026-06-11', t: 'feature', a: 'player', h: 'cb5ca43',
    title: 'The player remembers what you were playing',
    detail: 'Reopening the tab shows the mini player with the last track ready to resume instead of an empty player.' },

  { d: '2026-06-11', t: 'fix', a: 'player', h: '3c0fc1b',
    title: 'Play All and Shuffle missing',
    detail: 'Both buttons had disappeared from the weekly and monthly song charts.' },

  { d: '2026-06-10', t: 'fix', a: 'player', h: '0ab60c6',
    title: 'Player controls spilling outside the frame',
    detail: 'The mini player\'s controls were overflowing its own card.' },

  { d: '2026-06-10', t: 'feature', a: 'player', h: 'aefc65a',
    title: 'Ten more things in the music player',
    detail: 'A skip button, smarter recovery when a video will not play, a custom search with a picker of results, free dragging anywhere on screen, four sizes up to 640 by 360, and a queue you can drag to reorder that survives a reload.' },

  { d: '2026-06-10', t: 'fix', a: 'themes', h: '093ebf9',
    title: 'Time Machine cards washed out on hover',
    detail: 'On light themes the hover colour resolved to something lighter than the card itself, so hovering made a card fade rather than lift. Light themes now darken on hover, matching the dark ones.' },

  { d: '2026-06-10', t: 'fix', a: 'themes', h: '4191168',
    title: 'Unreadable tab labels on light themes',
    detail: 'Hovering a tab on any of the five light themes turned its text white on a light background. The rule had been meant for dark themes only and was inherited everywhere.' },

  { d: '2026-06-10', t: 'fix', a: 'events', h: 'dba7bc1',
    title: 'Anniversaries stopped loading entirely',
    detail: 'The request asking for full release details was being rejected outright by the music database, so anniversaries came back empty. The request was corrected and the empty results already cached were cleared.' },

  { d: '2026-06-05', t: 'fix', a: 'charts', h: 'c779187',
    title: 'Pagination appearing on weekly charts',
    detail: 'Switching back to table view cleared the rule hiding the pagination controls, letting them appear on weekly charts where they have no meaning — they belong to the yearly and all-time views.' },

  { d: '2026-06-04', t: 'i18n', a: 'charts', h: '22d2bc5',
    title: 'Spanish label for singles corrected',
    detail: 'The English word had been left in the Spanish translation.' },

  { d: '2026-06-04', t: 'design', a: 'charts', h: '65d806a',
    title: 'Albums stat renamed to Albums & Singles',
    detail: 'The figure had always counted both, in every language.' },

  { d: '2026-06-04', t: 'design', a: 'rawdata', h: 'e037cbd',
    title: 'Close button on the edit window',
    detail: 'The Edit Scrobble window had no visible way to close it.' },

  { d: '2026-06-02', t: 'fix', a: 'charts', h: '8a29811',
    title: 'Open a chart link in a new tab',
    detail: 'Period links were not real links, so right-clicking or middle-clicking them did nothing. All twelve now carry proper addresses, and opening one directly takes you to the right period once the data has loaded.' },

  { d: '2026-06-01', t: 'fix', a: 'ui', h: 'b550357',
    title: 'Demo button did nothing',
    detail: 'The functions behind it had been added to a copy of the code the live site does not load.' },

  { d: '2026-06-01', t: 'feature', a: 'ui', h: '412d5d6',
    title: 'A demo button',
    detail: 'A large button above the import cards that loads the sample data and starts charting immediately, with no setup at all.' },

  { d: '2026-06-01', t: 'feature', a: 'ui', h: 'd2ada45',
    title: 'Sample data for new visitors',
    detail: 'A public sample sheet is offered on the landing page, so the app can be explored before committing to setting up a data source of your own.' },

  { d: '2026-06-01', t: 'fix', a: 'events', h: '0b50321',
    title: 'Release anniversaries on the right day',
    detail: 'An album\'s release date was taken as the earliest edition on record, which is often an early digital or streaming outlier rather than the release anyone remembers. The date is now the one shared by the most editions, falling back to the earliest only when nothing better is available.' },

  { d: '2026-06-01', t: 'feature', a: 'charts', h: '6de1eb1',
    title: 'Song profiles',
    detail: 'Clicking a song on the All-Time or Yearly charts opens a full profile: rank cards, statistics, awards, certification plaques, chart peaks, records, every chart run, streak and appearance with links through to the weeks they happened, a graph of how its position moved, a listening pattern, a heatmap and its full play history.' },

  { d: '2026-06-01', t: 'design', a: 'ui', h: '88e0dac',
    title: 'Bigger icons on the sync bar',
    detail: 'The sync, configure and scrobble buttons had icons too small to read. Each icon is now sized properly in every language, which meant reworking how those buttons hold translated text.' },

  { d: '2026-06-01', t: 'i18n', a: 'playlists', h: 'ab8d73c',
    title: 'Time Machine hint translated',
    detail: 'The explanatory text above the Time Machine in Spanish and both Portuguese variants.' },


  /* ========== MAY 2026 ========== */

  { d: '2026-05-31', t: 'feature', a: 'charts', h: '025aacb',
    title: 'Five ways to look at a weekly chart',
    detail: 'Card Grid, Compact, Mosaic, Filmstrip and Stack layouts alongside the standard table, chosen from a toggle inside each section, with all three sections switching together.' },

  { d: '2026-05-31', t: 'design', a: 'soundtrack', h: 'bd5b21d',
    title: 'A hero card and a number one spotlight',
    detail: 'A gradient hero card at the top, a featured spotlight for the year\'s leading artist, and tinted cards on the top charts.' },

  { d: '2026-05-31', t: 'design', a: 'soundtrack', h: '8a267cc',
    title: 'Your Soundtrack made bolder',
    detail: 'Bigger figures, sections that reveal as you scroll, gradient bars and highlighted top positions.' },

  { d: '2026-05-31', t: 'feature', a: 'events', h: '970db06',
    title: 'View modes on weekly and monthly releases',
    detail: 'The reel, tiles, table and list toggles were extended to the upcoming and recent releases sections on weekly and monthly charts.' },

  { d: '2026-05-31', t: 'design', a: 'charts', h: '11dc9c0',
    title: 'Chart animation smoothed, with a speed control',
    detail: 'Rows that had not yet earned any plays were being shown with a blank rank, which broke the chart visually; those are gone, and entries now appear the moment they first reach the cut-off, fading in as they climb. Departing rows are removed before positions are measured so they leave no gaps, and a slider sets the speed.' },

  { d: '2026-05-31', t: 'design', a: 'ui', h: '1efc694',
    title: 'Animated fire on the streak count',
    detail: 'The streak banner\'s count gained an animated flame.' },

  { d: '2026-05-31', t: 'fix', a: 'ui', h: 'dd6c760',
    title: 'Streak thumbnails show their own artwork',
    detail: 'Every small tile was showing the same cover as the main streak image. Each now fetches the art for its own play, respects your per-item artwork source, and the cap of nine tiles was removed.' },

  { d: '2026-05-31', t: 'fix', a: 'ui', h: '5141775',
    title: 'Collaborations no longer break an artist streak',
    detail: 'A streak on an artist was broken by a play credited to them alongside someone else, because the two names were compared as one string. Both sides are now split into individual artists. A toggle for turning chart animation off was added at the same time.' },

  { d: '2026-05-31', t: 'feature', a: 'rawdata', h: '46ef465',
    title: 'See which plays were autocorrected',
    detail: 'Corrected rows carry a badge listing their original values and a coloured edge, and a filter shows only the entries a rule has changed — so a correction is visible rather than something that quietly happened to your data.' },

  { d: '2026-05-31', t: 'feature', a: 'ui', h: 'd0a824a',
    title: 'The streak banner',
    detail: 'Your active listening streak sits permanently between the sync bar and the tabs, with fire effects, cover art, and a strip of your last few plays as small tiles.' },

  { d: '2026-05-28', t: 'fix', a: 'player', h: '0b30cfc',
    title: 'Time Machine tiles start the player',
    detail: 'Clicking a song tile when the player was not running showed a queue message for a player that did not exist. It now opens the player straight away.' },

  { d: '2026-05-28', t: 'feature', a: 'soundtrack', h: 'd76b266',
    title: 'Your Soundtrack',
    detail: 'A year-in-review tab: an animated summary of plays, active days, artists, discoveries and streak; your top five artists and songs with proportional bars; a monthly activity chart marking your highest and lowest months; a loyalty score against the previous year; the artists you discovered; and the milestones you crossed. Time Machine tiles became clickable at the same time.' },

  { d: '2026-05-28', t: 'fix', a: 'charts', h: 'a10e175',
    title: 'Artist awards showed zero until you visited Awards',
    detail: 'Award data was only loaded when the Awards tab was opened, so an artist\'s nominations and wins always read zero on a first look. Every year is now loaded when the modal opens and the strip redrawn once it arrives.' },

  { d: '2026-05-28', t: 'feature', a: 'charts', h: '55e65eb',
    title: 'Expandable award categories per artist',
    detail: 'The awards strip in the artist modal opens to list the individual categories.' },

  { d: '2026-05-28', t: 'feature', a: 'charts', h: '8f23d61',
    title: 'Records and awards inside the artist modal',
    detail: 'An artist\'s chart records and their nominations and wins now appear on their own page.' },

  { d: '2026-05-27', t: 'feature', a: 'charts', h: 'cc3b26d',
    title: 'Peak day and peak streak in the artist modal',
    detail: 'Two more tiles: the most plays in a single day, and the longest streak.' },

  { d: '2026-05-27', t: 'fix', a: 'charts', h: '92b3cc5',
    title: 'Chart size follows you between devices',
    detail: 'Your chosen chart size is now stored against your account.' },

  { d: '2026-05-27', t: 'design', a: 'charts', h: '11e52a0',
    title: 'Artist stats deduplicated and reordered',
    detail: 'Duplicate peak figures were removed, a Most Played Album tile added, and the order rearranged.' },

  { d: '2026-05-27', t: 'feature', a: 'charts', h: '3ebc503',
    title: 'The artist modal caught up with the album one',
    detail: 'Ten more figures — first and last played, calendar days, average plays per song, weekly, monthly and yearly peaks, top song, listening streak and songs in the weekly chart — plus a plays-by-month chart whose bars open to show that month\'s top five songs.' },

  { d: '2026-05-27', t: 'i18n', a: 'data', h: '7ac5247',
    title: 'Upload hint translated',
    detail: 'The note listing supported file formats in the upload window.' },

  { d: '2026-05-27', t: 'design', a: 'ui', h: 'b4e0ea3',
    title: 'Artist streak tag recoloured',
    detail: 'The artist tag was too close to the album tag to tell apart.' },

  { d: '2026-05-27', t: 'design', a: 'ui', h: '5d810f8',
    title: 'Colour-coded streak tags',
    detail: 'Artist, song and album tags in the streak window are coloured so the kind is clear at a glance.' },

  { d: '2026-05-27', t: 'fix', a: 'charts', h: '0239170',
    title: 'Display toggles remembered',
    detail: 'The chart display bar\'s toggles now persist between sessions and devices.' },

  { d: '2026-05-27', t: 'i18n', a: 'rawdata', h: 'e579f9b',
    title: 'Editing and rules windows translated',
    detail: 'Twenty-one pieces of text across the edit, manual scrobble, autocorrect rules and conflict windows, plus the Raw Data toolbar.' },

  { d: '2026-05-27', t: 'design', a: 'charts', h: 'c000d86',
    title: 'Export bar at both ends',
    detail: 'In the all-entries view the export controls appear above and below each section, so a long list does not have to be scrolled back through.' },

  { d: '2026-05-27', t: 'feature', a: 'charts', h: 'e30fa59',
    title: 'Export a whole chart as text or CSV',
    detail: 'Yearly and All-Time charts can export every entry for songs, artists and albums, not just what fits on screen.' },

  { d: '2026-05-26', t: 'fix', a: 'ui', h: 'a8e91db',
    title: 'Copy button on the setup guide did nothing',
    detail: 'The fallback copy ran after the browser had stopped considering it a response to your click, so it was refused and the failure was swallowed. The button now always responds.' },

  { d: '2026-05-26', t: 'fix', a: 'ui', h: '2f67932',
    title: 'Streaks counted today, and an at-risk warning',
    detail: 'Active streaks were measured to yesterday, so plays already made today did not count. They now end today, and a new section warns about streaks from yesterday you have not yet continued — the ones you can still save.' },

  { d: '2026-05-26', t: 'i18n', a: 'ui', h: '0a5a732',
    title: 'The landing screen translated',
    detail: 'The first screen a new visitor sees had been English only. Twenty-nine pieces of text were translated into all four languages, including rich paragraphs that needed new handling to translate at all.' },

  { d: '2026-05-26', t: 'fix', a: 'charts', h: 'bf38bd0',
    title: 'Animations still appearing on long charts',
    detail: 'An animation watcher left over from a weekly view could fire after switching and overwrite paginated content on Yearly and All-Time.' },

  { d: '2026-05-26', t: 'i18n', a: 'ui', h: 'd17f02d',
    title: 'Streaks modal translated',
    detail: 'The daily streaks window in every supported language.' },

  { d: '2026-05-26', t: 'fix', a: 'data', h: 'f926217',
    title: 'Sync error change reverted',
    detail: 'The previous change was rolled back.' },

  { d: '2026-05-26', t: 'fix', a: 'data', h: 'a27257b',
    title: 'Sync errors stopped being hidden',
    detail: 'When a Google Sheet came back with no usable plays, the reader set a precise reason — missing columns, empty sheet, nothing valid — and the calling code overwrote it with a cheerful "Synced, 0 plays loaded". The real reason was surfaced instead.' },

  { d: '2026-05-26', t: 'feature', a: 'ui', h: 'b6c37ba',
    title: 'Streak details',
    detail: 'The streak figure became clickable, opening a breakdown of every artist, album and song streak you currently have running, plus a section for streaks that recently ended.' },

  { d: '2026-05-26', t: 'design', a: 'charts', h: '55640fc',
    title: 'No animation on Yearly and All-Time',
    detail: 'A sliding window across a year or a whole history is meaningless, so those periods no longer animate.' },

  { d: '2026-05-26', t: 'fix', a: 'awards', h: '086393d',
    title: 'See-through nominee picker fixed',
    detail: 'The picker window was rendering transparent because several colour values it relied on had never been defined. Genre search was also tightened to exclude items whose genre is not yet known rather than letting them through unchecked.' },

  { d: '2026-05-25', t: 'fix', a: 'awards', h: 'c246833',
    title: 'Genre filtering while searching, and album merging',
    detail: 'Searching inside a genre category now filters by genre rather than returning everything, each row shows its genre tags, and albums credited to collaborations merge under one entry instead of splitting.' },

  { d: '2026-05-25', t: 'fix', a: 'awards', h: '0676701',
    title: 'Genre detection stopped guessing wrong',
    detail: 'Genres were matched loosely enough that pop artists were landing in rock categories. Matching is now exact, collaborations look up their primary artist, and failed lookups are remembered so a blocked service is not retried thousands of times.' },

  { d: '2026-05-25', t: 'fix', a: 'awards', h: 'f34b428',
    title: 'Nominees with apostrophes were silently dropped',
    detail: 'Titles containing an apostrophe cut short the data they were stored in, so saving them failed without any error. Anything like "Short n\' Sweet" simply vanished from your picks.' },

  { d: '2026-05-25', t: 'fix', a: 'awards', h: '2e4eafd',
    title: 'Unknown-year albums judged more carefully',
    detail: 'If no release year could be found and the album had never been played before the awards year, it is almost certainly a new release, so it is excluded. Albums with any earlier play are kept, because that play is itself proof the album already existed.' },

  { d: '2026-05-25', t: 'fix', a: 'awards', h: 'e1feefa',
    title: 'Collaboration names handled properly',
    detail: 'The lookup was redone more narrowly: only the search term uses the primary artist, and the matching logic behind it was left untouched.' },

  { d: '2026-05-25', t: 'fix', a: 'awards', h: 'd86eac2',
    title: 'Collaboration fix reverted',
    detail: 'The previous change was rolled back after causing problems.' },

  { d: '2026-05-25', t: 'fix', a: 'awards', h: '10ba320',
    title: 'Collaboration names broke release lookups',
    detail: 'An artist field holding several comma-separated names was sent whole as a search query, which matched nothing and returned an unknown year. Only the primary artist is now used.' },

  { d: '2026-05-25', t: 'feature', a: 'awards', h: '5204888',
    title: 'Release years shown when picking nominees',
    detail: 'Each Late Discovery candidate shows the year it was released, and anything whose year could not be established says so plainly, so you can check it yourself rather than trusting a silent guess.' },

  { d: '2026-05-25', t: 'fix', a: 'awards', h: '3a74d2a',
    title: 'Awards default to last year',
    detail: 'Opening the tab showed the current year, where the previous year\'s albums correctly appear as late discoveries — technically right but confusing, since year-end awards are almost always for the year just finished. It now opens on last year, and you can still move forward.' },

  { d: '2026-05-25', t: 'fix', a: 'awards', h: '141d933',
    title: 'Wrong-year lookups stopped slipping through',
    detail: 'When no matching album was found, the lookup fell back to the first search result whatever it was, which could be an unrelated older record and would hand back a date old enough to sneak a current-year release past the filter. Those fallbacks were removed.' },

  { d: '2026-05-25', t: 'fix', a: 'awards', h: '0103f8d',
    title: 'Release year checked for every candidate',
    detail: 'The lookup now runs for all Late Discovery candidates rather than being skipped for some.' },

  { d: '2026-05-25', t: 'feature', a: 'awards', h: 'b6a4489',
    title: 'Late Discovery includes slow burns',
    detail: 'Albums you had played up to twenty times before the awards year now qualify too, not only ones you had never played. A handful of early plays followed by a year of obsession is exactly the shape this category is for.' },

  { d: '2026-05-25', t: 'fix', a: 'awards', h: 'd3c6ef6',
    title: 'Late Discovery excludes that year\'s releases',
    detail: 'Discovering an album released the same year is not a late discovery. Release dates are looked up across three sources in turn, and albums where no date can be found are kept rather than wrongly excluded.' },

  { d: '2026-05-25', t: 'fix', a: 'awards', h: '6141d35',
    title: 'One-Hit Wonder made meaningful',
    detail: 'It now matches artists with exactly one song above ten plays, and shows you which song that is.' },

  { d: '2026-05-25', t: 'fix', a: 'awards', h: '340d204',
    title: 'The Streak award measured the wrong thing',
    detail: 'It was counting how many separate days an item was played rather than the longest unbroken run, and a date formatting fault was breaking the comparison anyway. It now finds real consecutive-day streaks and labels them as such.' },

  { d: '2026-05-25', t: 'design', a: 'awards', h: 'aea1553',
    title: 'Icons on award categories',
    detail: 'Each category gained a descriptive emoji.' },

  { d: '2026-05-25', t: 'perf', a: 'charts', h: '6bbca45',
    title: 'Animations wait until you scroll to them',
    detail: 'Each chart section holds its previous-period view as a placeholder and only starts animating when it comes into view. Scroll past nothing and nothing runs, which saves work and battery.' },

  { d: '2026-05-25', t: 'design', a: 'charts', h: '2342758',
    title: 'The chart animation became a true play-by-play',
    detail: 'Rather than stepping between seven fixed snapshots, the animation now keeps a running count and drops and adds individual plays frame by frame. New entries climb visibly from below the cut-off into their final place, including the positions they briefly touch on the way.' },

  { d: '2026-05-25', t: 'fix', a: 'events', h: 'ae17724',
    title: 'Event view choices follow your account',
    detail: 'Which event types you filter to, and which view mode each section uses, now sync to your Google account instead of being forgotten on another device.' },

  { d: '2026-05-25', t: 'feature', a: 'awards', h: '6ea7066',
    title: 'The Awards tab',
    detail: 'A ceremony built from your own listening: pick a year, set the eligibility window to any date range you like, and turn on any of 33 categories. Nominees are generated from your history and your picks are kept against your account. A second panel holds real-life awards.' },

  { d: '2026-05-23', t: 'fix', a: 'mobile', h: 'c57fed4',
    title: 'More mobile layout corrections',
    detail: 'The events view toggles wrap at every screen size, and the album modal hides its date columns on small phones where they do not fit.' },

  { d: '2026-05-23', t: 'fix', a: 'mobile', h: '5838898',
    title: 'Events view buttons unusable on iPhone',
    detail: 'iOS Safari was drawing them as plain white system buttons, and the row they sat in overflowed the screen so they could not be pressed at all. On mobile they now wrap onto their own row.' },

  { d: '2026-05-22', t: 'feature', a: 'events', h: 'd8c3946',
    title: 'New Music Friday',
    detail: 'A section collecting each Friday\'s new releases — editorial albums and newly released singles and EPs from the last fortnight — in any of the five view modes. Up to sixteen weeks of Fridays are kept, so you can click back through previous weeks rather than only seeing the current one.' },

  { d: '2026-05-22', t: 'fix', a: 'events', h: 'b7b11b8',
    title: 'Reel became the default, and its images loaded',
    detail: 'Artist pictures never loaded in reel mode because the image fallback was looking for a card shape that reel cards do not have, so the fetch was never triggered.' },

  { d: '2026-05-22', t: 'feature', a: 'events', h: '8ce8349',
    title: 'Four ways to view every Events section',
    detail: 'All seven sections can be shown as tiles, a sortable table, an infinitely scrolling reel that pauses on hover, or a plain list, and each section remembers which you chose.' },

  { d: '2026-05-22', t: 'feature', a: 'playlists', h: 'd1a53c0',
    title: 'The Time Machine',
    detail: 'A scrolling ticker of the songs, artists and albums you played on this day in previous years, with toggles for which of the three to show.' },

  { d: '2026-05-21', t: 'feature', a: 'share', h: '2ab03cf',
    title: 'Album art, Top N and sharing on chart images',
    detail: 'Shared chart images can now include album artwork on every row, drawn from several sources with fallbacks and cached between uses; a slider overrides how many positions appear; and the image can be copied to the clipboard or handed to your device\'s share sheet. Your choices are remembered. The calendar day view gained an export playlist button.' },

  { d: '2026-05-21', t: 'i18n', a: 'charts', h: '98403b6',
    title: 'Plays Peak badge translated',
    detail: 'The badge had been left in English in Spanish and Portuguese.' },

  { d: '2026-05-21', t: 'i18n', a: 'charts', h: 'a6e4c4a',
    title: 'Gender agreement in Spanish and Portuguese',
    detail: 'The word for discovered has to agree with what it describes, and songs take a different form from artists and albums. Both languages were corrected.' },

  { d: '2026-05-21', t: 'i18n', a: 'charts', h: 'c586adf',
    title: 'New-music section titles translated',
    detail: 'The headings on the new songs, artists and albums charts.' },

  { d: '2026-05-21', t: 'i18n', a: 'charts', h: 'e2af2c7',
    title: 'Spanish Rising Artist reworded',
    detail: 'The Spanish label for Rising Artist was replaced with a more natural phrase.' },

  { d: '2026-05-21', t: 'i18n', a: 'charts', h: 'fa4d2e4',
    title: 'Every stat strip label translated',
    detail: 'Best Day, the new songs, artists and albums counts, all three of the moment tiles, Rising Artist, both peak badges, and the small text for plays, per day and percentage new. Month abbreviations in the Best Day label now use the translated forms.' },

  { d: '2026-05-21', t: 'i18n', a: 'ui', h: 'eb19d2d',
    title: 'Spanish display toggle corrected',
    detail: 'A follow-on from the earlier wording change that had been missed.' },

  { d: '2026-05-21', t: 'i18n', a: 'events', h: 'f6fea75',
    title: 'Events tab and Configure button translated',
    detail: 'Both were still in English in every language.' },

  { d: '2026-05-21', t: 'i18n', a: 'ui', h: '5b22a27',
    title: 'Spanish navigation hint reworded',
    detail: 'The Spanish phrasing of the arrow-keys hint was corrected.' },

  { d: '2026-05-21', t: 'i18n', a: 'ui', h: '31f9012',
    title: 'Navigation hint translated',
    detail: 'The keyboard and swipe hint was translated into all four languages.' },

  { d: '2026-05-21', t: 'i18n', a: 'ui', h: '72002a8',
    title: 'Spanish streak label and display buttons',
    detail: 'The streak label had its words in the wrong order in Spanish, and the display toggle buttons had never been translated at all.' },

  { d: '2026-05-21', t: 'i18n', a: 'ui', h: 'cb85867',
    title: 'Spanish wording corrected throughout',
    detail: 'Two words had been chosen badly across the whole Spanish translation and were replaced everywhere they appeared.' },

  { d: '2026-05-21', t: 'design', a: 'charts', h: '6a00d57',
    title: 'Clearer album peak labels',
    detail: 'The album modal\'s peak statistics were renamed to say which chart each refers to.' },

  { d: '2026-05-21', t: 'design', a: 'charts', h: 'b0ee750',
    title: 'Track details button restyled',
    detail: 'The album modal\'s track details control became a circular glowing button with a rotating icon.' },

  { d: '2026-05-21', t: 'feature', a: 'charts', h: 'fcde21d',
    title: 'The album modal rebuilt',
    detail: 'Albums got the treatment artists had: an all-time rank, days on calendar, average plays per track, the next certification and first and last play; weekly, monthly and yearly peaks with a banner if it topped all three; a monthly trend line and a breakdown of how many tracks charted in each period; accomplishments and certifications; and chart runs, heatmap, streaming history and per-track panels.' },

  { d: '2026-05-20', t: 'fix', a: 'events', h: '58d81bc',
    title: 'Event sections visible again, and release lookups fixed',
    detail: 'Anniversaries, Upcoming and Recent Releases were collapsed by default; they now open, remember their state per section, and restore it when you return. A malformed release query that was being rejected outright was also corrected.' },

  { d: '2026-05-20', t: 'fix', a: 'records', h: '876d149',
    title: 'New Charts Records previews showed the wrong chart',
    detail: 'Hovering a date in that section previewed the ordinary weekly chart instead of the new-music chart for that period.' },

  { d: '2026-05-20', t: 'fix', a: 'records', h: '3a4c3e8',
    title: 'New Charts Records read the right charts',
    detail: 'All ten records were being built from first appearances on the main charts, which only see the top N, rather than from the new-music charts they claim to describe. They now use the first play of each item, matching what those charts actually show.' },

  { d: '2026-05-20', t: 'fix', a: 'events', h: '155c4bf',
    title: 'Concerts work without your own API key',
    detail: 'The shows section had required each user to supply a key of their own.' },

  { d: '2026-05-20', t: 'fix', a: 'charts', h: '7c8f05c',
    title: 'Artist modal showed the wrong songs',
    detail: 'When the all-time chart size was unreadable the list of charting songs came back empty, and a fallback silently showed the artist\'s own top songs instead — which looks identical but means something completely different. Chart membership is now always derived from the real all-time data, and the misleading fallback was removed.' },

  { d: '2026-05-20', t: 'feature', a: 'charts', h: 'f41475d',
    title: 'A per-chart breakdown in the artist modal',
    detail: 'Instead of a single songs-charted figure, a grid showing how many songs and albums charted and the best rank reached on each of Weekly, Monthly, Yearly and All-Time, plus a row of peaks and a clearer all-time standing.' },

  { d: '2026-05-19', t: 'design', a: 'charts', h: 'fe7976d',
    title: 'Clearer column name in the artist modal',
    detail: 'The abbreviated consecutive-plays column was spelled out.' },

  { d: '2026-05-19', t: 'fix', a: 'charts', h: '7873cdc',
    title: 'All-Time stopped showing stale weekly data',
    detail: 'Switching to All-Time while a chart animation was still running let that animation finish 380 milliseconds later and overwrite the new tab with the old week\'s chart. Pending animations are now cancelled on switch, and the modal was corrected to use all-time figures throughout rather than weekly ones.' },

  { d: '2026-05-19', t: 'feature', a: 'charts', h: 'd1fda93',
    title: 'The artist modal rebuilt',
    detail: 'Artist Peak now means the best weekly chart position rather than an all-time rank. The all-time number one accomplishment was replaced with weekly and monthly number ones and songs that debuted at the top. Songs and albums are each split into four collapsible sections by period, each with its own heatmap and history.' },

  { d: '2026-05-19', t: 'design', a: 'events', h: '53de80e',
    title: 'Event sections hidden on long periods',
    detail: 'Upcoming and recent events do not belong on the Yearly and All-Time tabs.' },

  { d: '2026-05-19', t: 'feature', a: 'events', h: '0174e30',
    title: 'Upcoming concerts',
    detail: 'A shows section listing concerts by artists you listen to, marked on the calendar. Events data is also cached against your account so it survives moving between devices, checking local storage first and only fetching when there is nothing to reuse.' },

  { d: '2026-05-19', t: 'feature', a: 'records', h: '8b8fedc',
    title: 'Records for the new-music charts',
    detail: 'Ten records drawn from the New Songs, Artists and Albums charts: biggest debuts, your busiest periods of discovery, most songs on one new chart, all-time debut counts by artist, longest runs of consecutive debuts, the fastest a new song reached number one, and the album that arrived with the most tracks at once.' },

  { d: '2026-05-18', t: 'design', a: 'charts', h: '0330c82',
    title: 'Chart animation smoothed out',
    detail: 'The final chart fades in from partial opacity rather than from nothing, rows stay fully visible throughout the sliding window instead of dimming mid-animation, replay now replays the whole sequence rather than just the fade, and badges arrive after the movement settles.' },

  { d: '2026-05-18', t: 'design', a: 'charts', h: '3c5106d',
    title: 'Moment tiles limited to weekly',
    detail: 'Artist and Album of the Moment measure a three-week window, which says nothing inside a monthly or yearly view, so they are hidden there.' },

  { d: '2026-05-18', t: 'feature', a: 'charts', h: '7c4ed7b',
    title: 'Artist and Album of the Moment',
    detail: 'A third strip holding Song, Artist and Album of the Moment plus Rising Artist, where artist and album are drawn from the last 21 days, each with its own artwork and colour.' },

  { d: '2026-05-18', t: 'design', a: 'charts', h: 'b5cdc84',
    title: 'Icons and colours on the stat tiles',
    detail: 'Each tile gained a category icon and colour, and the Best Day figure was clarified.' },

  { d: '2026-05-18', t: 'fix', a: 'events', h: '049e467',
    title: 'Release sections stopped always appearing collapsed',
    detail: 'The sections were marked collapsed in the page and the code that showed them never cleared that mark, so they were folded every time regardless of what you had chosen. Your preference is now saved and restored.' },

  { d: '2026-05-18', t: 'design', a: 'charts', h: 'a57490c',
    title: 'Charts evolve day by day instead of jumping',
    detail: 'The entrance animation was replaced with a sliding window: the previous period plays forward through seven steps over about six seconds, dropping its oldest plays and adding the current period\'s, so you watch the ranks actually shift rather than seeing two states. Rows glide to their new positions and can be cancelled at any point.' },

  { d: '2026-05-18', t: 'design', a: 'ui', h: 'e197213',
    title: 'Only the date row stays stuck',
    detail: 'Tabs and chart-size controls now scroll away with the page, leaving just the date navigation pinned.' },

  { d: '2026-05-18', t: 'design', a: 'charts', h: '3d83261',
    title: 'Charts animate in from last period',
    detail: 'A chart first draws the previous period, then replaces each row with the current one, sliding entries in from wherever they used to rank — risers from below, fallers from above, new arrivals from off the chart. Each section gained a replay button.' },

  { d: '2026-05-17', t: 'fix', a: 'ui', h: 'dcc6341',
    title: 'Graphs and Records showing Events content',
    detail: 'Two tabs were rendering the Events view\'s content instead of their own.' },

  { d: '2026-05-17', t: 'feature', a: 'charts', h: 'c7180e2',
    title: 'Rising Artist, and a redesigned Song of the Moment',
    detail: 'A Rising Artist card on weekly charts finds the most recently discovered artist in the 45 days ending with the week, with a real photo. Song of the Moment was redesigned around its album art. The trend lines were removed again, and the second strip was hidden on tabs where it means nothing.' },

  { d: '2026-05-17', t: 'feature', a: 'charts', h: '96a0892',
    title: 'Stat cards became interactive',
    detail: 'Clicking a stat card scrolls to the chart section it summarises, expanding it if collapsed. Total Plays shows an average per day, Unique Songs shows what proportion were new, each of the four top cards carries an eight-period trend line, a Best Day tile was added, and the numbers count up on load.' },

  { d: '2026-05-17', t: 'feature', a: 'charts', h: '1567d1a',
    title: 'Movement and peaks on the new-music stats',
    detail: 'The new songs, artists and albums figures now show whether they rose or fell against the period before, and carry all-time peak and peak-at-the-time badges like the main stats.' },

  { d: '2026-05-17', t: 'feature', a: 'charts', h: '93518e6',
    title: 'A second row of stats',
    detail: 'Below the main four figures, a second strip on weekly, monthly and yearly charts: Song of the Moment, the most played song in the fifteen days ending with the period, and counts of songs, artists and albums appearing for the first time.' },

  { d: '2026-05-17', t: 'feature', a: 'events', h: 'db476a3',
    title: 'Filter events by kind',
    detail: 'Birthdays, albums, singles, EPs and everything else can each be shown or hidden.' },

  { d: '2026-05-17', t: 'feature', a: 'events', h: '213a93b',
    title: 'An events calendar, and events that already happened',
    detail: 'Events gained a calendar view, and sections for birthdays, anniversaries and releases that have just passed rather than only those still coming. Content from other sections that had been leaking into the tab was stopped.' },

  { d: '2026-05-16', t: 'design', a: 'charts', h: 'ef9965e',
    title: 'Chart run sections collapse',
    detail: 'The chart run subsections on yearly, monthly and weekly charts can be folded away, though they start open.' },

  { d: '2026-05-16', t: 'feature', a: 'charts', h: '69da4a8',
    title: 'Search and sort your full listening history',
    detail: 'The Full Streaming History panel gained live search across title, artist and album, and sortable columns. The chart run panel was split into collapsible sections that load only when opened, and All-Time gained display toggles and chart run buttons.' },

  { d: '2026-05-16', t: 'design', a: 'ui', h: '645b38a',
    title: 'Navigation hint hidden where it does not apply',
    detail: 'Raw Data, Graphs, Records and Events do not move between periods, so the hint no longer appears on them.' },

  { d: '2026-05-16', t: 'fix', a: 'mobile', h: 'fde9d9e',
    title: 'Swipe hint hidden on desktop',
    detail: 'A cached stylesheet was still showing the swipe hint on desktop.' },

  { d: '2026-05-16', t: 'design', a: 'mobile', h: 'a084763',
    title: 'Swipe arrows dim when there is nowhere to go',
    detail: 'The arrow for a direction you cannot travel, such as forward from the current week, is dimmed.' },

  { d: '2026-05-16', t: 'design', a: 'mobile', h: '5737ea8',
    title: 'The swipe hint animates until used',
    detail: 'It glows and moves until you swipe for the first time, then stops.' },

  { d: '2026-05-16', t: 'design', a: 'mobile', h: '72b3bbc',
    title: 'A swipe hint on small screens',
    detail: 'The keyboard hint is meaningless on a phone, so it is replaced there with a swipe indicator.' },

  { d: '2026-05-15', t: 'fix', a: 'graphs', h: '6cc5cbc',
    title: 'More milestones, and song milestones that actually tracked',
    detail: 'Many more play-count thresholds were added between 10 and 50,000, with finer steps in the hundreds and low thousands. The songs section had been using a fixed list containing values that were never tracked at all.' },

  { d: '2026-05-15', t: 'design', a: 'ui', h: '2d85cb9',
    title: 'Clearer label on the average stat',
    detail: 'The average-per-day figure is now labelled Plays / Day.' },

  { d: '2026-05-15', t: 'fix', a: 'themes', h: 'fe64eb0',
    title: 'Hero stats readable on the coloured mastheads',
    detail: 'Red, yellow and pink light themes have a dark masthead but light-tuned text colours, so the stats above the charts were nearly invisible. Those values are now overridden inside the stats area to match the rest of the masthead text.' },

  { d: '2026-05-15', t: 'design', a: 'ui', h: 'f7edeaa',
    title: 'A permanent arrow-key hint',
    detail: 'A small constant reminder of the left and right arrow shortcuts on desktop, hidden on mobile where they do not apply.' },

  { d: '2026-05-15', t: 'feature', a: 'ui', h: 'c96cbb5',
    title: 'A one-time hint about keyboard and swipe navigation',
    detail: 'A pill below the navigation explains that arrow keys and swipes move between periods, shown once and then remembered. Days Listened became clickable through to the heatmap, Top Artist now switches tab before scrolling, and the streak count-up finishes with a burst.' },

  { d: '2026-05-15', t: 'feature', a: 'rawdata', h: 'f860364',
    title: 'Delete a conflicting rule from the warning',
    detail: 'Each rule listed in the conflict warning gained a delete button that removes it everywhere it is stored, without closing the window you are working in.' },

  { d: '2026-05-15', t: 'fix', a: 'rawdata', h: 'da35428',
    title: 'Conflict warning widened',
    detail: 'The warning only fired when the existing rule had a different album. It now fires for any rule on the same artist and track, including ones differing only by capitalisation.' },

  { d: '2026-05-15', t: 'feature', a: 'rawdata', h: '5b84b3d',
    title: 'A warning before you create a conflicting rule',
    detail: 'Saving a rule for an artist and track that already has one now warns first, lists the rules that clash with a checkbox each, and lets you run or override them individually without leaving the window.' },

  { d: '2026-05-15', t: 'feature', a: 'rawdata', h: 'bcf7afe',
    title: 'Search your autocorrect rules',
    detail: 'A search box in the rules window, which starts to matter once the list is long.' },

  { d: '2026-05-15', t: 'design', a: 'rawdata', h: '1e97ee3',
    title: 'Dismiss the autocorrect notice',
    detail: 'The message saying how many entries were corrected can now be dismissed, restoring the usual sync status underneath.' },

  { d: '2026-05-15', t: 'feature', a: 'settings', h: '254f1d2',
    title: 'Keep comma-separated artist names together',
    detail: 'A toggle for whether a name containing a comma is one artist or several, because both are true depending on the artist.' },

  { d: '2026-05-15', t: 'fix', a: 'rawdata', h: 'af44cac',
    title: 'Corrections reached newly added entries',
    detail: 'After a batch edit the app\'s cached copy already held corrected values, and a filter used that to decide which rules still needed sending — so rules were skipped and newly arrived entries were left uncorrected in the sheet. All rules are now always sent, and the sheet writes three targeted columns instead of rewriting itself.' },

  { d: '2026-05-15', t: 'feature', a: 'ui', h: '722ab8a',
    title: 'Privacy Policy split into its own page',
    detail: 'The privacy sections were moved out of the Terms into a standalone policy, leaving the Terms about terms. Text contrast on both pages was corrected.' },

  { d: '2026-05-14', t: 'feature', a: 'charts', h: '5bd45c9',
    title: 'Top 25 and Top 30',
    detail: 'Two more chart sizes for weekly and monthly charts.' },

  { d: '2026-05-14', t: 'fix', a: 'ui', h: '9d2a8fc',
    title: 'Days Listened explained accurately',
    detail: 'The tooltip said the figure counted days you opened Last.fm; it counts days you listened to music.' },

  { d: '2026-05-14', t: 'fix', a: 'ui', h: '242a85f',
    title: 'Support panel stopped collapsing on itself',
    detail: 'The routine that keeps the launcher hidden was still running once the panel opened, and kept closing it a second later. It now pauses while the panel is open.' },

  { d: '2026-05-13', t: 'fix', a: 'ui', h: '60a9510',
    title: 'Support panel opens properly',
    detail: 'The detection of when the panel had finished opening was unreliable and was replaced.' },

  { d: '2026-05-13', t: 'fix', a: 'ui', h: 'c352943',
    title: 'Support launcher hiding made reliable',
    detail: 'The widget could reappear before the hiding code had run; it is now watched for and hidden as soon as it is inserted, with a styling fallback.' },

  { d: '2026-05-13', t: 'fix', a: 'ui', h: '5f1326b',
    title: 'Support widget only opens when asked',
    detail: 'The chat widget is hidden on load and revealed only when Contact Support is clicked, rather than being suppressed after the fact.' },

  { d: '2026-05-13', t: 'design', a: 'rawdata', h: '437e74f',
    title: 'Sync moved first, Add Play scoped, Now button added',
    detail: 'Sync was moved to the front of the header, Add Play was confined to the Raw Data tab where it belongs, and the edit window gained a Now button for stamping the current time.' },

  { d: '2026-05-13', t: 'design', a: 'ui', h: 'b3eb29e',
    title: 'A plain-English summary at the top of the Terms',
    detail: 'Nobody reads terms, so a short summary box was put at the top of them, along with a governing law section.' },

  { d: '2026-05-13', t: 'fix', a: 'ui', h: '6b59525',
    title: 'Terms corrections',
    detail: 'The operator named properly, contact addresses fixed, and a notice about premium features added.' },

  { d: '2026-05-13', t: 'feature', a: 'settings', h: '6b919c8',
    title: 'A welcome email on first sign-in',
    detail: 'Signing in for the first time now sends a welcome email.' },

  { d: '2026-05-13', t: 'feature', a: 'ui', h: '595fb0f',
    title: 'Terms of Service and Privacy Policy',
    detail: 'A published policy page covering what is collected, who processes it, and your rights to have it deleted, linked from the landing screen and the footer.' },

  { d: '2026-05-13', t: 'perf', a: 'data', h: '6301f91',
    title: 'Sheet corrections made dramatically cheaper',
    detail: 'The handler for batch corrections was missing, so those requests had been falling through to the add-a-row branch. Fixing it came with four optimisations: rules are looked up directly instead of every row being compared against every rule, only changed rows are written back rather than the whole sheet, and adjacent changed rows are grouped into single writes.' },

  { d: '2026-05-13', t: 'feature', a: 'data', h: '0319ba3',
    title: 'Batch corrections in the sheet script',
    detail: 'The Google Sheets script gained the action that applies all correction rules in one pass.' },

  { d: '2026-05-13', t: 'fix', a: 'ui', h: '14b2f95',
    title: 'Support launcher hidden on every page',
    detail: 'The same fix extended to the pages it had been missed on.' },

  { d: '2026-05-13', t: 'fix', a: 'ui', h: 'a2f7003',
    title: 'Support widget stopped floating over the page',
    detail: 'The support chat button was permanently on screen. It now appears only when you choose Contact Support.' },

  { d: '2026-05-13', t: 'design', a: 'ui', h: 'ec4c085',
    title: 'Streaks climb through their tiers on load',
    detail: 'The count-up now travels through every intensity level on its way to your real number, so you see the streak earn its colour.' },

  { d: '2026-05-13', t: 'design', a: 'ui', h: '18ac662',
    title: 'Streaks in six intensities',
    detail: 'The streak display now has six levels of colour and animation, so a three-day run and a hundred-day run no longer look the same.' },

  { d: '2026-05-13', t: 'feature', a: 'ui', h: '1da8ae5',
    title: 'The hero stats came alive',
    detail: 'A fifth figure for average plays per day, numbers that count up when the page loads, your personal best streak shown under the current one, a fire glow on streaks of seven days or more, an icon per stat, a clickable Top Artist, and a two-by-two grid on phones.' },

  { d: '2026-05-13', t: 'feature', a: 'player', h: '79c1282',
    title: 'Play buttons on more rows, and three player sizes',
    detail: 'Play buttons were added inline on song rows and inside the new artist chart, the mini player cycles through three sizes instead of two, and hovering an artist\'s song count lists their tracks with a play button on each.' },

  { d: '2026-05-12', t: 'feature', a: 'player', h: '09409ec',
    title: 'The player became a floating, queueable mini player',
    detail: 'The player now floats where you put it and snaps to a corner, resizes, pauses with the spacebar, and holds a queue you can add to and see. The backend also checks several search results and picks one that will actually play, rather than taking the first and failing.' },

  { d: '2026-05-12', t: 'design', a: 'ui', h: '6430021',
    title: 'A real logo',
    detail: 'The placeholder was replaced with the concentric arc mark, and an icon for adding the site to an iOS home screen.' },

  { d: '2026-05-12', t: 'feature', a: 'ui', h: '930fbe1',
    title: 'Eight things that make the app quicker to use',
    detail: 'The navigation sticks to the top as you scroll; shimmer placeholders appear while charts load; clicking the period label opens the date picker directly; arrow keys move between periods and W, M, Y and A jump between tabs; hovering a theme dot previews that theme; and swipe gestures move between periods on touch. A favicon and link previews were added at the same time.' },

  { d: '2026-05-12', t: 'feature', a: 'graphs', h: 'ec3687c',
    title: 'The heatmap grew a year in review',
    detail: 'Five colour schemes with a swatch picker, a bar showing your current and best-ever listening streaks, drought detection that highlights the gaps and marks your return, a summary card for each year with its total, best day, top artist and new artists, and a Listening Patterns section showing your rhythm by weekday and hour of day.' },

  { d: '2026-05-12', t: 'feature', a: 'graphs', h: '3d2e59e',
    title: 'Heatmap rendering and filters completed',
    detail: 'The drawing, filtering and tooltip behaviour behind the heatmap were finished.' },

  { d: '2026-05-11', t: 'perf', a: 'rawdata', h: '99633a3',
    title: 'Single edits find their row immediately',
    detail: 'Editing one play meant the sheet script scanning every row to find it. The app now remembers which row each play came from and sends that with the edit, so the script reads one row directly, falling back to a scan if the hint is stale.' },

  { d: '2026-05-11', t: 'fix', a: 'data', h: 'ffb77e8',
    title: 'Autocorrect sync rebuilt around rules, not timestamps',
    detail: 'Sheet syncing of corrections was still matching on timestamps and still failing whenever browser and spreadsheet time zones differed. All active rules are now sent in one request that reads the sheet once and writes once, however many rules there are.' },

  { d: '2026-05-11', t: 'feature', a: 'graphs', h: 'ea2f4dd',
    title: 'The listening heatmap',
    detail: 'A calendar grid in Graphs where every day is a square shaded by how much you listened, so years of history read at a glance. Hovering a day gives the date, the count and any milestone, and it can be filtered to a single artist, song or album.' },

  { d: '2026-05-11', t: 'fix', a: 'data', h: '1c0ed2e',
    title: 'Ghost rows cleaned before syncing',
    detail: 'Incomplete Last.fm scrobbles leave behind rows with no song and a 1970 date, and those rows then corrupt the timestamp the next sync starts from, so one bad row could keep breaking future syncs. They are now removed before each Last.fm sync.' },

  { d: '2026-05-11', t: 'fix', a: 'charts', h: '51b7a69',
    title: 'Tie-breaking on new entries',
    detail: 'The final place ties were broken wrongly: the new songs, artists and albums charts, which were comparing raw counts. They now track when something was first achieved and sort the same way as everything else.' },

  { d: '2026-05-11', t: 'fix', a: 'charts', h: '2144c50',
    title: 'Tie-breaking in chart runs and modals',
    detail: 'Chart runs rebuild every past period from scratch, and were doing so without carrying each period\'s positions forward, so historical ties broke arbitrarily. This corrected chart run history, the artist and album modals, and the floating chart summaries.' },

  { d: '2026-05-11', t: 'fix', a: 'charts', h: '1c4c6c1',
    title: 'Tie-breaking reached the charts themselves',
    detail: 'The previous fix only corrected the Records section. The charts you actually look at are built on a different path that was still ignoring last week\'s position entirely, so songs, artists and albums all needed it applying again.' },

  { d: '2026-05-11', t: 'fix', a: 'charts', h: '3db97a6',
    title: 'Ties now break by last week\'s position',
    detail: 'When two songs had the same number of plays, the one played first won, which is arbitrary. The song that was higher on the previous chart now holds the better place, the way a real chart treats an incumbent.' },

  { d: '2026-05-09', t: 'fix', a: 'data', h: '338b6ff',
    title: 'Bulk edits stopped failing across time zones',
    detail: 'Sheet rows were matched by their moment in time, which breaks when your browser and your spreadsheet are set to different zones: the same written date becomes two different instants and nothing matches. Matching is now done on artist, title and album text instead, which means nothing about where you are.' },

  { d: '2026-05-09', t: 'fix', a: 'data', h: '2aca04b',
    title: 'An out-of-date sheet script now says so',
    detail: 'If your Google Sheet was running an older copy of the script, it did not recognise the bulk-edit request, fell through to its add-a-row branch, reported success and appended an empty row dated 1970. It is now detected and reported as a clear error telling you to redeploy, instead of a silent failure dressed as a success.' },

  { d: '2026-05-09', t: 'fix', a: 'data', h: 'cfcbd5d',
    title: 'Seconds were being thrown away from every timestamp',
    detail: 'The date reader understood hours and minutes but quietly discarded seconds, rounding every play to the start of its minute. The sheet matched rows by exact timestamp, so nothing ever matched and every bulk edit reported updating zero entries.' },

  { d: '2026-05-08', t: 'fix', a: 'data', h: '2ae8520',
    title: 'Epoch dates blocked at every entry point',
    detail: 'A second, wider pass on the 1970 date problem: any play dated before the year 2000 is now skipped when reading a CSV, when autocorrecting, and when writing updates, so a bad timestamp cannot reach your charts from any direction.' },

  { d: '2026-05-08', t: 'fix', a: 'data', h: '2631686',
    title: 'Artwork works when running locally',
    detail: 'The new relay only exists on the live site, so artwork broke for local development. It now detects that case and uses the production relay instead.' },

  { d: '2026-05-08', t: 'perf', a: 'data', h: '140b39c',
    title: 'Artwork served through our own domain',
    detail: 'Deezer requests were going through a third-party relay that was getting blocked. They now route through dankcharts.fm itself, with an hour of caching at the edge so repeated lookups do not re-fetch.' },

  { d: '2026-05-08', t: 'fix', a: 'data', h: '54ad03b',
    title: 'Epoch dates stopped appearing in sheets',
    detail: 'Plays with a missing timestamp were being written with a date of 1 January 1970, which puts a play half a century before your history starts. Those rows are now rejected at every point they could be created.' },

  { d: '2026-05-08', t: 'perf', a: 'rawdata', h: 'e0faf13',
    title: 'Bulk edits show real progress instead of hanging',
    detail: 'A batch edit rewrote the entire sheet in one request, which took between 100 and 179 seconds and looked like a freeze. It now goes up in chunks of 100 with live progress: how many are done, the percentage, and elapsed time. If it is interrupted, the error says how many entries were actually written.' },

  { d: '2026-05-07', t: 'fix', a: 'data', h: '2816bca',
    title: 'Deezer artwork stopped failing in bursts',
    detail: 'Artwork requests go through a relay, and when that relay failed everything failed together. A second relay was added as a fallback, and after three consecutive failures Deezer is skipped for five minutes rather than retrying into a wall and filling the console with errors.' },

  { d: '2026-05-07', t: 'perf', a: 'data', h: '28d507c',
    title: 'Faster corrections in Sheets',
    detail: 'An attempt at speeding up how quickly the sheet script applies corrections.' },

  { d: '2026-05-07', t: 'fix', a: 'data', h: '700a0a1',
    title: 'Sheet script stopped pushing constantly',
    detail: 'The Apps Script behind Google Sheets was sending autocorrection rules far more often than it needed to.' },

  { d: '2026-05-06', t: 'feature', a: 'rawdata', h: '5654796',
    title: 'Edit a Last.fm play from Raw Data',
    detail: 'A Last.fm scrobble can be edited directly from Raw Data. Last.fm\'s API has no edit operation, so this adds a corrected scrobble rather than changing the original, and the old one still has to be deleted by hand.' },

  { d: '2026-05-06', t: 'fix', a: 'rawdata', h: 'a4daade',
    title: 'Autocorrect rules confirmed working',
    detail: 'The final fix in the sequence, verified rather than assumed.' },

  { d: '2026-05-06', t: 'fix', a: 'rawdata', h: '04c8ed6',
    title: 'Autocorrect rules sync across devices',
    detail: 'Two faults were combining to lose rules. A fresh browser wrote an empty list to local storage on startup, which then overwrote the real rules held in the cloud; and rules were only pushed upward on a first migration, so later changes never left the device. A rule saved on a laptop now reaches the phone.' },

  { d: '2026-05-06', t: 'fix', a: 'rawdata', h: 'eebc862',
    title: 'Autocorrect rules saving to your account',
    detail: 'Rules were not being stored against the signed-in Google account.' },

  { d: '2026-05-06', t: 'fix', a: 'data', h: 'df5fd79',
    title: 'Backend pointed at the new host',
    detail: 'The backend link was repointed and the old host disconnected entirely.' },

  { d: '2026-05-06', t: 'data', a: 'data', h: '22aa304',
    title: 'Moved to Cloudflare Pages',
    detail: 'Hosting moved off Netlify.' },

  { d: '2026-05-05', t: 'feature', a: 'playlists', h: 'e3f9ba6',
    title: 'Playlist export as CSV',
    detail: 'A playlist can be downloaded as a CSV file as well as handed to a transfer service.' },

  { d: '2026-05-05', t: 'feature', a: 'playlists', h: '11b8a65',
    title: 'Albums in playlist export',
    detail: 'Playlist export lists gained an album toggle.' },

  { d: '2026-05-05', t: 'feature', a: 'player', h: 'e0453b5',
    title: 'In-site play and scrobble',
    detail: 'Follow-up work completing play-and-scrobble inside the site.' },

  { d: '2026-05-05', t: 'feature', a: 'player', h: '0b8ed02',
    title: 'Play music in the app, and scrobble it',
    detail: 'A player bar at the bottom of the page plays a song through YouTube without leaving the charts, and scrobbles it after 30 seconds to Last.fm or your sheet. Every song row gained a play button, and the buttons can be hidden if you would rather not see them.' },

  { d: '2026-05-05', t: 'fix', a: 'settings', h: 'e611f25',
    title: 'Existing settings survived signing in',
    detail: 'Users who had already configured the app were losing those settings when they first signed in.' },

  { d: '2026-05-05', t: 'feature', a: 'settings', h: '166a081',
    title: 'Sign in with Google',
    detail: 'Signing in with a Google account works, which is what lets your settings follow you between devices instead of living in one browser.' },

  { d: '2026-05-05', t: 'feature', a: 'settings', h: '2a8ccb7',
    title: 'Groundwork for Google sign-in',
    detail: 'The configuration needed to sign in with a Google account and keep settings against it.' },

  { d: '2026-05-05', t: 'feature', a: 'rawdata', h: '114e217',
    title: 'Autocorrect rules stored and portable',
    detail: 'Rules are kept in your Google Sheet, and can be exported and imported as a file, so a set of corrections built up over months is not trapped in one browser.' },

  { d: '2026-05-05', t: 'fix', a: 'rawdata', h: '3dcb514',
    title: 'Autocorrect and mass update bugs',
    detail: 'Several problems in the new rules and bulk editing were fixed while still in testing.' },

  { d: '2026-05-04', t: 'feature', a: 'rawdata', h: '242a16b',
    title: 'Autocorrect rules and mass update',
    detail: 'A rule can now say that one artist or title should always be read as another, and a single correction can be applied to every matching entry at once. Fixing a name spelled three ways across ten years stopped being a manual job.' },

  { d: '2026-05-04', t: 'perf', a: 'rawdata', h: 'fac1b5e',
    title: 'Raw Data editing made faster',
    detail: 'Editing was taking long enough to feel broken; it was brought down to roughly 30 to 45 seconds.' },

  { d: '2026-05-04', t: 'feature', a: 'rawdata', h: 'c0e91f0',
    title: 'Edit your raw listening data',
    detail: 'Individual plays became editable, whether they came from Last.fm, Google Sheets or a local file. A wrong artist name or a mistyped title could be corrected at the source instead of quietly distorting every chart built on it. The settings modal not expanding properly was fixed alongside.' },

  { d: '2026-05-03', t: 'fix', a: 'playlists', h: 'f7ce884',
    title: 'Playlist export respects chart order',
    detail: 'Exported playlists were ignoring the priority rules that decide the order positions should come out in.' },

  { d: '2026-05-03', t: 'fix', a: 'mobile', h: 'de77707',
    title: 'Release images on mobile',
    detail: 'Some artwork in Recent and Upcoming Releases was not loading on phones.' },

  { d: '2026-05-02', t: 'design', a: 'ui', h: '25ed040',
    title: 'A temporary logo',
    detail: 'A placeholder logo while a real one was being worked out.' },

  { d: '2026-05-02', t: 'design', a: 'ui', h: '832eb22',
    title: 'Themes and languages on the landing and setup pages',
    detail: 'The Sheets card and setup page were made easier to follow, and the colour themes and language picker were extended to the landing and setup pages so the app does not change appearance the moment you sign in.' },

  { d: '2026-05-02', t: 'feature', a: 'data', h: 'ff1aa6e',
    title: 'A Google Sheets template you can generate',
    detail: 'Rather than describing the sheet format and hoping people build it correctly, the app now generates a ready-made template and walks you through the setup. Support contact was added at the same time.' },

  { d: '2026-05-02', t: 'design', a: 'events', h: '65b1d96',
    title: 'Release cards always have an image',
    detail: 'Upcoming and Recent Releases fall back through a chain of image sources, so a card is never left with an empty space where the artwork should be.' },


  /* ========== APRIL 2026 ========== */

  { d: '2026-04-30', t: 'feature', a: 'ui', h: '076fe53',
    title: 'Clearer Last.fm setup, image fallbacks and pagination',
    detail: 'Instructions explaining what Last.fm is and how to use it, a fallback when artwork fails to load, pagination on the yearly and all-time charts, and manual scrobbling.' },

  { d: '2026-04-30', t: 'feature', a: 'ui', h: 'dfc3e1c',
    title: 'A landing page, and no more borrowed spreadsheet',
    detail: 'A proper landing page, and an end to new users being pointed at someone else\'s Google Sheet: everyone now chooses their own import method.' },

  { d: '2026-04-30', t: 'feature', a: 'data', h: 'fee7106',
    title: 'Moved to dankcharts.fm',
    detail: 'The full migration from the old page to the official site, carrying the new import system with it.' },

  { d: '2026-04-29', t: 'fix', a: 'data', h: '1b73294',
    title: 'Google Sheets imports everything now',
    detail: 'Confirmed fix for Sheets imports arriving incomplete. The whole sheet comes through, which matters because a silently truncated history produces charts that look plausible and are wrong.' },

  { d: '2026-04-29', t: 'fix', a: 'data', h: 'b059a71',
    title: 'Sheets upload, another attempt',
    detail: 'A further attempt at the Google Sheets upload problem.' },

  { d: '2026-04-28', t: 'fix', a: 'data', h: 'bd26163',
    title: 'Import workflow reworked and Sheets limits fixed',
    detail: 'The import sequence was restructured and the ceiling on how much a Google Sheet could contribute was lifted.' },

  { d: '2026-04-28', t: 'fix', a: 'data', h: '8eca46e',
    title: 'Row limits, duplicates, and Last.fm-only charts',
    detail: 'Import was hitting row limits, letting duplicate plays through where two entries shared a timestamp, and requiring Last.fm to build charts at all. All three were fixed.' },

  { d: '2026-04-28', t: 'perf', a: 'data', h: '59c757c',
    title: 'Imports moved into your browser',
    detail: 'Sheets, CSV, spreadsheet and Spotify ZIP files are now read entirely inside your own browser and kept in local storage, with no server involved. Last.fm still goes through the backend, but only because its API requires it. This removed the database dependency altogether and means your listening history does not leave your machine to become a chart.' },

  { d: '2026-04-28', t: 'fix', a: 'data', h: '6524560',
    title: 'Further import fixes on the live site',
    detail: 'Another pass at import errors that only appeared on the deployed site.' },

  { d: '2026-04-28', t: 'fix', a: 'data', h: '44c53b9',
    title: 'Google Sheets import on the live site',
    detail: 'Sheets import worked locally but not once deployed.' },

  { d: '2026-04-28', t: 'feature', a: 'data', h: 'f78e1d9',
    title: 'Import without an account',
    detail: 'The import window was locked inside the signed-in app, so a visitor had to have a Last.fm account before they could try anything. It was moved out to the landing page with its own button and a name field, so a history can be imported with no account at all.' },

  { d: '2026-04-28', t: 'fix', a: 'data', h: 'b6ec1c3',
    title: 'Cross-origin requests unblocked',
    detail: 'Browser security rules were rejecting the app\'s own API calls.' },

  { d: '2026-04-28', t: 'fix', a: 'data', h: '14f40a1',
    title: 'Corrected API address',
    detail: 'The app was calling the wrong address for its backend.' },

  { d: '2026-04-28', t: 'feature', a: 'data', h: '6d2ebcc',
    title: 'Import from Spotify, Deezer, CSV or Sheets',
    detail: 'A single import path accepting Last.fm, a CSV file, a Spotify data ZIP, a Deezer spreadsheet, or a Google Sheet. Your history could now come from whichever service you already had it in.' },

  { d: '2026-04-28', t: 'feature', a: 'charts', h: '4c95735',
    title: 'Week navigation, a stats strip, and Top 100',
    detail: 'Moving between weeks, a strip of summary figures above the chart, a yellow theme, and a Top 100 option.' },

  { d: '2026-04-28', t: 'data', a: 'data', h: 'ff2a60e',
    title: 'Users saved on login',
    detail: 'The database client was upgraded and accounts began being recorded at sign-in.' },

  { d: '2026-04-28', t: 'feature', a: 'charts', h: '4b68289',
    title: 'Weekly chart routes',
    detail: 'Server routes for fetching weekly chart data.' },

  { d: '2026-04-28', t: 'fix', a: 'ui', h: 'b466251',
    title: 'Hosting publish directory corrected',
    detail: 'The deployment was publishing from the wrong folder.' },

  { d: '2026-04-28', t: 'feature', a: 'ui', h: '516f64d',
    title: 'The dankcharts front end',
    detail: 'The rebuilt front end and its hosting configuration were added.' },

  { d: '2026-04-28', t: 'feature', a: 'data', h: '9650682',
    title: 'A backend for the Last.fm API',
    detail: 'A small server was added to talk to the Last.fm API on the app\'s behalf.' },

  { d: '2026-04-27', t: 'fix', a: 'mobile', h: '048d3d6',
    title: 'Plays tag sized for Spanish and Portuguese on mobile',
    detail: 'The word for plays is longer in Spanish and Portuguese, and at phone width it no longer fitted. The tag\'s size and position were corrected for those languages.' },

  { d: '2026-04-27', t: 'fix', a: 'mobile', h: '0519a2c',
    title: 'Charts finally fit a phone screen',
    detail: 'Every chart now fits the width of a phone held upright. The Plays Peak tag was moved to a position that works in that space.' },

  { d: '2026-04-27', t: 'fix', a: 'mobile', h: 'b966c6f',
    title: 'More of the layout made to fit',
    detail: 'Masthead, tab menu, calendar picker, chart stats and display options were each adjusted to fit a phone screen.' },

  { d: '2026-04-27', t: 'fix', a: 'mobile', h: 'cf4b359',
    title: 'Play counts visible on mobile new-music charts',
    detail: 'The new Songs, Artists and Albums charts were hiding their play counts on phones.' },

  { d: '2026-04-27', t: 'fix', a: 'mobile', h: '0ede17e',
    title: 'Mobile shrinkage, first attempt',
    detail: 'An attempt at the layout collapsing to the wrong width on phones.' },

  { d: '2026-04-27', t: 'feature', a: 'events', h: '1cd911c',
    title: 'The Events tab',
    detail: 'A tab for the dates around your music rather than the music itself: artist birthdays, and anniversaries of album and single releases, each as a tile you can click through to read more.' },

  { d: '2026-04-27', t: 'feature', a: 'events', h: 'e390811',
    title: 'Search a release from the release itself',
    detail: 'Entries in Upcoming and Recent Releases became clickable, opening a search for that release.' },

  { d: '2026-04-26', t: 'fix', a: 'mobile', h: 'fbfb6ed',
    title: 'New-music charts on phones, first attempt',
    detail: 'The new Songs, Artists and Albums charts were not displaying correctly on mobile.' },

  { d: '2026-04-26', t: 'feature', a: 'events', h: 'aa4e6a3',
    title: 'Release updates widened to 200 artists',
    detail: 'Upcoming and Recent Releases looked at your top 50 artists; that was raised to 200, so the section covers much more than the very top of your history.' },

  { d: '2026-04-25', t: 'feature', a: 'records', h: '1f580b4',
    title: 'The Certification Wall',
    detail: 'A wall in the Records tab showing every certification you have earned, with basic filters for finding your way around it.' },

  { d: '2026-04-25', t: 'feature', a: 'settings', h: '36db414',
    title: 'Set your own certification thresholds',
    detail: 'Gold, platinum and diamond are defined by play counts, and the right numbers depend on how much you listen. Those thresholds became yours to set instead of being fixed.' },

  { d: '2026-04-25', t: 'feature', a: 'charts', h: 'cfbed3d',
    title: 'New Songs, Artists and Albums charts',
    detail: 'Weekly, Monthly and Yearly charts gained companion charts of what was newly played in that period — music arriving in your history for the first time, separated from what you already knew.' },

  { d: '2026-04-25', t: 'fix', a: 'mobile', h: '8c692ff',
    title: 'Mobile phase 2: fitting the screen upright',
    detail: 'A further attempt at making the site fit the width of a phone held vertically.' },

  { d: '2026-04-25', t: 'fix', a: 'mobile', h: 'd671270',
    title: 'Mobile phase 2: masthead and options width',
    detail: 'Width corrections for the masthead and the chart options row.' },

  { d: '2026-04-25', t: 'fix', a: 'mobile', h: '6492148',
    title: 'Mobile phase 2: sizing when zoomed out',
    detail: 'Interface elements were sized wrongly when the page was zoomed out on a phone.' },

  { d: '2026-04-25', t: 'fix', a: 'mobile', h: '2658976',
    title: 'Mobile phase 1: a critical bug',
    detail: 'The first pass at making the site usable in mobile browsers, fixing a critical bug and adding adaptations mainly for Safari.' },

  { d: '2026-04-25', t: 'design', a: 'settings', h: 'e15d843',
    title: 'A nudge towards setup for new users',
    detail: 'Someone arriving for the first time had no way of knowing where to configure anything. The configure button now glows until a name has been set, which is enough of a hint without being a dialog in the way.' },

  { d: '2026-04-25', t: 'fix', a: 'settings', h: '902dd2b',
    title: 'UTC offsets shown when picking a zone',
    detail: 'The time zone picker now shows each zone\'s offset from UTC. Wording in the theme, language and day menus was improved.' },

  { d: '2026-04-25', t: 'feature', a: 'settings', h: '8e73103',
    title: 'Time zones, including daylight saving',
    detail: 'A play\'s date decides which week it lands in, so the time zone it is read in changes the charts themselves. Your zone is now a setting, and daylight saving is handled for the places that observe it.' },

  { d: '2026-04-25', t: 'fix', a: 'data', h: '2444659',
    title: 'Automatic updates every 30 minutes',
    detail: 'Auto-refresh was corrected so both Last.fm and Google Sheets are re-read on a reliable half-hourly cycle.' },

  { d: '2026-04-25', t: 'perf', a: 'data', h: '33c9083',
    title: 'Six-hour cache and steadier loading',
    detail: 'Data is cached for six hours, and the routines that fetch from both Last.fm and Google Sheets were made more robust.' },

  { d: '2026-04-24', t: 'design', a: 'ui', h: 'ccc7b89',
    title: 'Theme, day and language buttons reflow better',
    detail: 'The three settings button groups now adapt to narrower screens instead of overflowing.' },

  { d: '2026-04-24', t: 'feature', a: 'settings', h: '203871b',
    title: 'Your own name and start date in the masthead',
    detail: 'The header can carry your name and the date your listening history begins, rather than fixed text.' },

  { d: '2026-04-24', t: 'fix', a: 'data', h: 'a1ded33',
    title: 'Last.fm retries instead of giving up',
    detail: 'Loading a large Last.fm history meant many pages of requests, and a single failed page would leave the history incomplete. Failed pages are now retried, which mostly affects accounts with a lot of data. The Spanish wording in the artist modal was also corrected.' },

  { d: '2026-04-23', t: 'fix', a: 'themes', h: 'b523ebd',
    title: 'Yellow Dark button text made readable',
    detail: 'Button text on the Yellow Dark theme did not have enough contrast against its background.' },

  { d: '2026-04-23', t: 'fix', a: 'charts', h: '97868c8',
    title: 'Certification bug on multi-album songs, and tag toggles',
    detail: 'Certifications were wrong for songs appearing under more than one album name. The Plays Peak tag moved left, and Peak, Certification and Plays Peak tags each got their own on/off toggle.' },

  { d: '2026-04-23', t: 'feature', a: 'charts', h: '3f46986',
    title: 'Certification badges on every chart',
    detail: 'Gold, platinum and diamond badges now appear on Weekly, Monthly and Yearly charts, not only in the detail views.' },

  { d: '2026-04-23', t: 'feature', a: 'data', h: '4a8791e',
    title: 'Scrobble to Last.fm from inside the app',
    detail: 'Manual scrobbling is available in the site itself, so a play can be recorded without leaving for Last.fm.' },

  { d: '2026-04-23', t: 'feature', a: 'data', h: '473bde0',
    title: 'Last.fm as a data source',
    detail: 'Until now the app read from a Google Sheet. Connecting a Last.fm account directly became an option, which is the moment the app stopped being usable only by people willing to maintain a spreadsheet.' },

  { d: '2026-04-22', t: 'feature', a: 'charts', h: '2789435',
    title: 'Period stats gained peaks and comparisons',
    detail: 'The summary figures above a weekly, monthly or yearly chart now carry peak tags and show how the period compares with the one before it, so a number has something to be measured against.' },

  { d: '2026-04-21', t: 'feature', a: 'records', h: '80d6a2d',
    title: 'All-Kill tags that say how many times',
    detail: 'The All-Kill total domination tags were replaced with ones that count how often it has actually happened, including a per-artist count, rather than simply marking that it did. Font sizes on the leading song and album were corrected.' },

  { d: '2026-04-21', t: 'feature', a: 'records', h: 'c2eb941',
    title: 'Adjustable columns across Records',
    detail: 'Every Records chart lets you change how many columns it uses, so a record can be scanned wide or read narrow. The All #1s chart was improved and Records wording corrected.' },

  { d: '2026-04-21', t: 'design', a: 'records', h: '950cd55',
    title: 'Debuts made less cluttered',
    detail: 'The remodelled Debuts record had too much artwork on songs; images were thinned out and artist and album tiles made smaller.' },

  { d: '2026-04-21', t: 'feature', a: 'records', h: 'ca96202',
    title: 'Debuts ranked by plays, not position',
    detail: 'The Debuts record was reworked to rank by how many plays a song arrived with rather than the chart position it landed at, which is a truer measure of an arrival. It also gained artwork and links through to the charts.' },

  { d: '2026-04-21', t: 'feature', a: 'charts', h: 'a8eacbe',
    title: 'Hide the image source picker',
    detail: 'The control for choosing where artwork comes from was cluttering every chart. It can now be hidden, leaving a cleaner list.' },

  { d: '2026-04-21', t: 'i18n', a: 'records', h: '3edb49a',
    title: 'Translation phase 15: Records names and titles',
    detail: 'Record chart names and table titles now translate instantly. The Appearances chart was improved at the same time.' },

  { d: '2026-04-21', t: 'i18n', a: 'graphs', h: 'cc79923',
    title: 'Translation phase 14: the Graphs tab',
    detail: 'Graphs were translated, and language switching got faster again.' },

  { d: '2026-04-21', t: 'i18n', a: 'charts', h: 'cc95df4',
    title: 'Translation phase 13: instant switching on the four chart tabs',
    detail: 'Changing language on Weekly, Monthly, Yearly and All-Time now takes effect immediately instead of needing a reload. Chart runs were also adjusted.' },

  { d: '2026-04-20', t: 'i18n', a: 'records', h: '5184dbb',
    title: 'Translation phase 12: Records and All-Kill',
    detail: 'The Records tab and its All-Kill section were translated, and the All-Kill chart itself was substantially improved in the process.' },

  { d: '2026-04-19', t: 'i18n', a: 'charts', h: '5ad5fc9',
    title: 'Translation phase 11: modals and chart run buttons',
    detail: 'Artist and album modals plus the chart run buttons were translated, along with fixes to theme colours — mainly buttons on the dark yellow theme.' },

  { d: '2026-04-19', t: 'i18n', a: 'ui', h: '5cc136d',
    title: 'Translation phase 10: the word "chart" itself',
    detail: 'Spanish and Portuguese have no single word that matches the English "chart" in this sense, and the app had been using it inconsistently. Every occurrence was settled on one adaptation. Playlist export wording was corrected at the same time.' },

  { d: '2026-04-18', t: 'i18n', a: 'share', h: '2559625',
    title: 'Translation phase 9: the share modal rebuilt',
    detail: 'The Share As Image modal was substantially rebuilt so that image customisation adapts properly to languages other than English, rather than assuming English-length labels.' },

  { d: '2026-04-17', t: 'i18n', a: 'share', h: 'd965769',
    title: 'Translation phase 8: the share button and its menu',
    detail: 'Significant language problems in the Share As Image button and its customisation menu were fixed.' },

  { d: '2026-04-16', t: 'i18n', a: 'charts', h: 'ec4a40b',
    title: 'Translation phase 7: dates everywhere, and share text',
    detail: 'Dates were corrected across all charts, and the share modals along with the images they generate were translated. Records and the detail modals were still outstanding.' },

  { d: '2026-04-16', t: 'i18n', a: 'ui', h: '84bcb63',
    title: 'Translation phase 6: button hover text',
    detail: 'The descriptions that appear when hovering a primary button were translated. Many secondary buttons were still pending.' },

  { d: '2026-04-16', t: 'i18n', a: 'charts', h: '9958a4f',
    title: 'Translation phase 5: artist and album modals',
    detail: 'Most of the text inside the artist and album detail modals was translated.' },

  { d: '2026-04-16', t: 'i18n', a: 'charts', h: '3e607cc',
    title: 'Translation phase 4: peak tags',
    detail: 'The tags marking a song\'s peak position were translated rather than left in English.' },

  { d: '2026-04-15', t: 'i18n', a: 'ui', h: '10d4953',
    title: 'Translation corrections',
    detail: 'Minor wording fixes across the translated strings.' },

  { d: '2026-04-14', t: 'i18n', a: 'ui', h: '399e2ed',
    title: 'Translation phase 3: faster language switching',
    detail: 'A major expansion of what was translated, and switching between languages became quicker and less wasteful.' },

  { d: '2026-04-14', t: 'i18n', a: 'charts', h: '15fdd62',
    title: 'Translation phase 2: chart headers and dates',
    detail: 'Chart headings were corrected and the first dates were translated.' },

  { d: '2026-04-14', t: 'i18n', a: 'ui', h: '26271d0',
    title: 'Spanish and Portuguese arrive',
    detail: 'The first phase of translation: Spanish, Brazilian Portuguese and European Portuguese became selectable languages. A great deal was still untranslated at this point, and the twelve phases that follow are the work of finishing it.' },

  { d: '2026-04-14', t: 'fix', a: 'ui', h: 'e3c1b1b',
    title: 'Collapsed sections stopped leaking between tabs',
    detail: 'Collapsing a section on one tab was collapsing the matching section on the others. Each tab now remembers its own state. The calendar icon on the Navy Light theme was also made black so it could be seen.' },

  { d: '2026-04-14', t: 'fix', a: 'share', h: 'b79105f',
    title: 'Unreadable description on entry images',
    detail: 'The description on a shared entry image was being drawn on a heavy grey background that made the text hard to read.' },

  { d: '2026-04-14', t: 'feature', a: 'records', h: '5e19819',
    title: 'Jump from a record straight to the week it happened',
    detail: 'The date on an All #1s record is now a link. Clicking it opens the weekly chart from that exact week, so you can see the record in the context it was set rather than as an isolated number.' },

  { d: '2026-04-13', t: 'feature', a: 'records', h: 'ce5c80b',
    title: 'Small Records update',
    detail: 'Further minor adjustments to the Records tab.' },

  { d: '2026-04-13', t: 'feature', a: 'records', h: '7a820d1',
    title: 'Better All #1s and Repeat Scrobble Runs',
    detail: 'Two Records charts were improved: the list of every song that reached number one, and the record for playing the same song over and over in a row.' },

  { d: '2026-04-13', t: 'fix', a: 'ui', h: 'ff53cf3',
    title: 'Back to Top works again',
    detail: 'The button removed the previous day was fixed and reinstated.' },

  { d: '2026-04-13', t: 'perf', a: 'ui', h: '40661c5',
    title: 'Styles and code split out of the page',
    detail: 'The CSS and JavaScript had all been living inside the HTML file. Splitting them into their own files means the browser can cache them between visits rather than re-downloading everything each time.' },

  { d: '2026-04-13', t: 'feature', a: 'settings', h: '4a5f927',
    title: 'Choose which day your week starts on',
    detail: 'Weekly charts no longer assume a fixed start day. You pick the day your week begins, and every weekly chart, streak and run is cut on that boundary instead.' },

  { d: '2026-04-13', t: 'feature', a: 'share', h: '04aa2ba',
    title: 'Chart run image modal improved',
    detail: 'Several improvements and corrections to the modal that builds a shareable picture of a chart run.' },

  { d: '2026-04-13', t: 'fix', a: 'ui', h: 'e41a5c8',
    title: 'Debug output removed',
    detail: 'Diagnostic logging left over from fixing the modals was taken back out.' },

  { d: '2026-04-13', t: 'fix', a: 'charts', h: '613cf4c',
    title: 'Artist and album modals working again',
    detail: 'Both detail modals were fixed properly after the first attempt fell short.' },

  { d: '2026-04-13', t: 'fix', a: 'charts', h: 'd05fa7b',
    title: 'First attempt at the broken artist modal',
    detail: 'The artist detail modal had broken; this was the first attempt at repairing it.' },

  { d: '2026-04-12', t: 'fix', a: 'share', h: '559e5cf',
    title: 'Image modal tidied, broken Back to Top removed',
    detail: 'Small errors in the share modal were corrected, and the Back to Top button was taken out because it did not work.' },

  { d: '2026-04-12', t: 'fix', a: 'share', h: '95027a4',
    title: 'Image customisation buttons repaired',
    detail: 'The controls for customising a shared image had stopped working correctly.' },

  { d: '2026-04-12', t: 'feature', a: 'records', h: 'ddacf56',
    title: 'Records views improved',
    detail: 'A first round of refinements to the new Records tab.' },

  { d: '2026-04-12', t: 'feature', a: 'records', h: 'c22e10d',
    title: 'The Records tab',
    detail: 'A whole tab for chart accomplishments, where each kind of achievement gets its own ranked chart rather than being a footnote on an artist page. This is the ancestor of every record in the app today.' },

  { d: '2026-04-12', t: 'feature', a: 'share', h: 'f9af1d2',
    title: 'Entry images finished',
    detail: 'The new-entry image generator was completed and refined.' },

  { d: '2026-04-11', t: 'feature', a: 'share', h: 'badf2ec',
    title: 'Share a new chart entry as an image',
    detail: 'A second image generator, this one for announcing a single entry arriving on a chart rather than the chart as a whole.' },

  { d: '2026-04-11', t: 'design', a: 'ui', h: '0692c6c',
    title: 'Smoother navigation, and a better dark mode on reload',
    detail: 'A set of small improvements to moving around the app, and to what you see in dark mode in the moment just after refreshing the page.' },

  { d: '2026-04-10', t: 'feature', a: 'graphs', h: '9f8697b',
    title: 'Bar race, and downloadable race GIFs',
    detail: 'New graphs including an animated bar race showing your top artists overtaking each other over time, which can be downloaded as a GIF.' },

  { d: '2026-04-10', t: 'perf', a: 'data', h: 'd6f1a88',
    title: 'Sheet sync moved to hourly',
    detail: 'Google Sheets is now re-read once an hour rather than on a shorter cycle.' },

  { d: '2026-04-10', t: 'fix', a: 'charts', h: '468dd45',
    title: 'Chart runs across different periods',
    detail: 'Chart runs were not working correctly when opened from a monthly or yearly chart rather than a weekly one.' },

  { d: '2026-04-10', t: 'fix', a: 'charts', h: 'd90fe76',
    title: 'Chart run period labels',
    detail: 'Weekly and monthly chart runs were labelling their boxes with the wrong stretches of time.' },

  { d: '2026-04-10', t: 'feature', a: 'share', h: '42e2df2',
    title: 'Chart run images improved',
    detail: 'A round of improvements to the image generator for chart runs.' },

  { d: '2026-04-10', t: 'design', a: 'ui', h: 'd6c3b09',
    title: 'Hover hints on buttons',
    detail: 'Buttons across the app gained descriptions on hover, so what each one does is discoverable without pressing it first.' },

  { d: '2026-04-09', t: 'feature', a: 'share', h: '6ae3f94',
    title: 'Chart images you can download and post',
    detail: 'The image export was finished: any chart can be rendered as a picture sized for a feed post or a story, and downloaded.' },

  { d: '2026-04-09', t: 'feature', a: 'graphs', h: '3192223',
    title: 'The Graphs tab',
    detail: 'A new tab for visual views of your history, opening with two: cumulative plays over time, and play volume — both able to compare several artists against each other on the same axes.' },

  { d: '2026-04-09', t: 'feature', a: 'events', h: '9eeee61',
    title: 'Recent Releases, and the dankcharts.fm name',
    detail: 'The app took its current name, and gained a Recent Releases section surfacing new music from artists you already listen to.' },

  { d: '2026-04-09', t: 'feature', a: 'data', h: 'b3bd13a',
    title: 'Visitor country counter',
    detail: 'Added a counter recording which countries the site is being visited from.' },

  { d: '2026-04-08', t: 'feature', a: 'data', h: 'c893bfc',
    title: 'Real artist photos, via Deezer',
    detail: 'Deezer became the primary source for artwork, which meant artists finally had actual photographs rather than a placeholder or an album cover standing in for them.' },

  { d: '2026-04-08', t: 'fix', a: 'charts', h: '66dd76f',
    title: 'All-Time and Yearly fixes, including search',
    detail: 'A batch of corrections to the All-Time and Yearly charts, including the behaviour of their search bars.' },

  { d: '2026-04-08', t: 'feature', a: 'charts', h: '7115ff0',
    title: 'Top 50, 100 and 200 on the long charts',
    detail: 'Yearly and All-Time charts can now be opened out to 50, 100 or 200 positions instead of stopping at the top of the list.' },

  { d: '2026-04-08', t: 'fix', a: 'charts', h: 'b55fb12',
    title: 'Peak tags on weekly artist charts',
    detail: 'Weekly artist charts were showing the wrong peak tag.' },

  { d: '2026-04-08', t: 'feature', a: 'playlists', h: '1c47b15',
    title: 'Export playlists through Soundiiz',
    detail: 'Playlists built from your chart data can be handed to Soundiiz, which transfers them into Spotify, Apple Music and other services.' },

  { d: '2026-04-08', t: 'design', a: 'themes', h: 'e10e456',
    title: 'More themes, and a contrast pass',
    detail: 'New colour themes, plus a sweep through the existing ones fixing text and background combinations that sat too close together to read.' },

  { d: '2026-04-08', t: 'feature', a: 'share', h: '2f9e212',
    title: 'Shareable chart images begun',
    detail: 'First work on turning a chart into an image you can post. Incomplete at this point.' },

  { d: '2026-04-07', t: 'feature', a: 'charts', h: 'c46624d',
    title: 'Chart runs',
    detail: 'Every song, artist and album now has a chart run — the full week-by-week history of where it ranked, from debut to exit, rather than only its current position.' },

  { d: '2026-04-07', t: 'fix', a: 'charts', h: '833f5a4',
    title: 'Chart run layout, and first and last play dates',
    detail: 'Fixed the chart run icon and the gaps between run boxes, and let long runs wrap instead of overflowing. Artist Accomplishments now shows the first and last time you played each song and album.' },

  { d: '2026-04-07', t: 'design', a: 'charts', h: 'd0fbcb5',
    title: 'Album modals, double diamond, and tighter chart rows',
    detail: 'Albums got their own detail modal. Added the double diamond certification above diamond. Week labels were abbreviated and rank numbers resized so rows fit more comfortably.' },

  { d: '2026-04-06', t: 'fix', a: 'charts', h: 'c7ab62a',
    title: 'Calendar filter fixed',
    detail: 'The calendar view used to filter charts by date was not returning the right range.' },

  { d: '2026-04-06', t: 'fix', a: 'charts', h: '01f5ab6',
    title: 'Peak and first-week figures corrected',
    detail: 'Peak position and first-week play counts were both being computed incorrectly on some entries.' },

  { d: '2026-04-05', t: 'feature', a: 'data', h: '944a0a2',
    title: 'YouTube as an artwork source',
    detail: 'Added YouTube as an option for pictures when other sources have nothing, and corrected how singles were being counted.' },

  { d: '2026-04-03', t: 'feature', a: 'charts', h: '5a8e637',
    title: 'Collaborations count for every artist involved',
    detail: 'Songs credited to more than one artist now feed each artist’s totals rather than only the first name listed. Added diagnostics that report when plays are lost during import.' },

  { d: '2026-04-03', t: 'feature', a: 'rawdata', h: 'bc063ba',
    title: 'Raw Data and Artist Accomplishments',
    detail: 'Two new views: Raw Data, which lists every individual play behind the charts, and Artist Accomplishments, which collects what a single artist has achieved across your history.' },

  { d: '2026-04-03', t: 'fix', a: 'charts', h: '3419949',
    title: 'Collaboration counts and artwork corrected',
    detail: 'Follow-up to the collaboration work — artwork resolution and the per-artist play totals for shared credits were both off.' },

  { d: '2026-04-02', t: 'feature', a: 'charts', h: '10adb00',
    title: 'The first all-time chart',
    detail: 'The earliest working version of the app: a single all-time chart of your most played music, with artwork for artists, albums and songs, certifications on songs and albums, per-artist performance summaries, and Top 10 / 20 / 50 / 100 views.' },

  { d: '2026-04-02', t: 'design', a: 'themes', h: 'fa4d914',
    title: 'First four themes, and a name',
    detail: 'The app got a wordmark and a theme system with four looks — Navy Dark, Navy Light, Purple Dark and Purple Light. Light themes gained softly tinted page backgrounds and darker mastheads so the header reads as separate from the page, and contrast was raised across all four.' },

  { d: '2026-04-02', t: 'fix', a: 'data', h: '8a59ce7',
    title: 'Accented and non-Latin names stopped breaking',
    detail: 'Google Sheets data was being decoded with whatever encoding the browser guessed, which mangled names like Los Ángeles Azules, Ricardo Arjona and 강남스타일. The sheet is now read as UTF-8 explicitly, so accented, Korean and other non-Latin titles come through intact.' },

  { d: '2026-04-02', t: 'fix', a: 'data', h: '9afcc3a',
    title: 'Spanish-language sheets were silently losing most plays',
    detail: 'Google Sheets writes dates using your account’s language, and no standard date parser understands Spanish month names like ene or febrero. The result was that the majority of a Spanish-locale history was being dropped without a word. Spanish months are now understood, and any date format the app still cannot read is counted and reported rather than discarded quietly.' },

  { d: '2026-04-02', t: 'feature', a: 'charts', h: '8c175e1',
    title: 'Dropout charts, and more on every row',
    detail: 'Added charts for songs that fell off, and gave every chart row its previous position, play count, and weeks or months on chart. Peak tags were corrected at the same time.' },

];
