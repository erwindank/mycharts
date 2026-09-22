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
   =========================================================================== */

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

  /* ========== SEPTEMBER 2026 ========== */

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
