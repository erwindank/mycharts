# Records tab — improvement backlog

Working notes for the Records tab overhaul started **29 July 2026**. Origin: the tab was
hard to scan and hard to navigate, so it was audited with the project's `impeccable` skill
(critique flow, single-context). That produced a design health score of **15/40** and a
list of 50 concrete improvements, tracked below.

Keep this file updated as items ship — it is the handoff document between sessions and
between machines.

---

## What the audit found

Records is 10 top-level sections → ~40 sub-sections → **~55 separate tables**. The original
default view rendered all of them at once, which meant well over a thousand rows and
several hundred image lookups in a single scroll.

The core problem was never data volume — it was that **nothing announced its own rank**.
Seven distinct label tiers all rendered between 9.3px and 11.5px, four of them uppercase
mono, and every one of them was *smaller than the data it labelled*. Scanning depends on
size ratio, so with the ratios gone you had to read each line to learn whether it was a
heading, an explanation, or a column header.

Secondary findings: no search, no sort, no sticky headers, no deep links, no share path,
and a section nav of 11 identical text pills at half the minimum touch-target height.

---

## Shipped

| # | Idea | Commit |
|---|------|--------|
| 2 | Removed the "All" nav option, with migration for stored `'all'` | `bc0ec53` |
| 32 | Sortable column headers on every records table | `bc0ec53` |
| 12 | Fixed the type hierarchy — four distinct tiers | `2410133` |
| 13 | Explanatory prose moved off `--text3` | `2410133` |
| 5 | Overview landing screen + Songs/Artists/Albums toggle | `c528086` |
| 31 | Global search across every section | `fd3d3ef` |
| 39 | Limit changes stopped rebuilding (and stopped wiping the sort) | `fd3d3ef` |
| 28 | One glyph family (`▶`/`▼`) for every expand control | `fd3d3ef` |
| 46 | Milestones rebuilt as a vertical timeline, with Songs/Artists/Albums pills | `cc13e6a` |
| — | Album play-count milestones — closes part of the "known data gaps" below | `cc13e6a` |
| — | Origin row ("1st play") at the foot of each timeline | `cc13e6a` |
| — | Cover art / artist avatars on every milestone entry | `cc13e6a` |
| — | Song milestones at 10, then every 25 plays (artists/albums keep the landmark ladder) | `cc13e6a` |
| — | Every artwork in Records is re-pickable (✎ badge), incl. PAK and the certifications wall | `cc13e6a` |
| 19 | Sticky column headers on every records table (≥768px) | `68abdbb` |
| 11 | `.rec-intro` rebuilt as a three-column plate | `ba32e43` |
| 45 | Most-decorated-artist hero: banner photo + infinite reel of every record they hold | *pending* |

### Implementation notes worth not re-deriving

- **`REC_SECTION_IDS` / `REC_DEFAULT_VIEW`** (`app.js`) are the single source of truth for
  the section list. `applyRecordsViewFilter()` coerces unknown or legacy stored views back
  to the default and rewrites `localStorage`, which is what migrates users off `'all'`.
- **Overview highlights** are captured in one consolidated block at the end of
  `buildRecords()`, where every source map is already built and in scope: 26 highlights,
  one O(n) scan per map, no re-derivation. `renderRecordsOverview()` caches them in
  `_recOvHighlights`, so the type pill re-renders from memory instead of calling
  `buildRecords()` again (which would rebuild all ~55 tables to change a pill).
- **Overview card titles are read from each section's own `<h2>`**, not duplicated in a
  second list, so they cannot drift and stay translated for free.
- **`.section-header-h2` is shared by 23 headings**, only 11 of which are in Records. The
  Records type ladder is therefore scoped by position —
  `#recordsView > .section-header ...` for the tab title,
  `#recordsView .chart-section ...` for section names — leaving the 12 headings in
  Graphs, Events, Awards and elsewhere untouched. Those selectors are deliberately
  (1,2,2) specificity so they outrank the per-theme `body.<theme> .section-header-h2`
  colour rules; that also means the white label chip has to be cleared explicitly.
- **Uppercase now belongs to column headers only.** Don't reintroduce an uppercase tier
  elsewhere in Records without removing one.
- **Sorting** reads `data-sort` when present, else auto-detects. Dates are the hard part:
  they render as `"Week of 11 Mar 2019"` / `"Mar 2024"` / `"2024"`, all localized, so the
  month map is rebuilt from `t()` per sort and each shape collapses to a `YYYYMMDD`
  integer. A per-column majority vote picks one comparator so a stray unparsable cell
  can't split the column. Detail rows (`.rec-run-detail`, `.app-cr-row`,
  `.pak-expand-row`) are grouped with their parent so they travel with it.
- **Rank cells are deliberately not renumbered on sort.** The `#` column is the table's
  canonical ranking; sorting by another column and seeing #14 on top is the information.
  Sorting by `#` restores the original order.
- **New copy lives only in the `en` block of `translations.js`.** `t()` falls back to
  English for the other three languages. All numbers go through the existing
  `tCount`/`tUnit` plural keys, so units are localized even when labels aren't.
- **Search filters the DOM, it doesn't re-query the data.** Every table is already
  built and only hidden by `display`, so one query can reach all ~55 of them:
  `runRecordsSearch()` marks matching rows `.rec-search-hit`, hides the rest, then rolls
  the hits up — sub-section, section group, section — and displays only the sections that
  still hold one. Row text is cached on the element (`row._recSearchText`), which can't go
  stale because a rebuild creates new elements. Thumbnail and toggle cells are excluded
  from that text, or every row would match "Deezer".
- **Search owns the view while it is active.** `applyRecordsViewFilter()` defers to it and
  returns early; anything that means to *leave* a search calls `recSearchReset()` first
  (the nav pills do). Without that, clicking a section pill during a search would filter
  straight back to the search.
- **Search deliberately ignores the entries-per-table limit and the collapse states.** A
  row that was built is findable, and a match inside a collapsed section is still a match
  — both are CSS overrides scoped to `#recordsView.rec-searching`, so the stored collapse
  state survives untouched and comes back when the query is cleared.
- **Shrinking the entries limit no longer rebuilds anything.** Each row carries its
  canonical (pre-sort) rank index from `tagRecRowIndices()`, so `.rec-row-over-limit`
  still means "past the top N" no matter which column the table is sorted by. Only asking
  for *more* rows than `recBuiltLimit` rebuilds, and that path captures the active sorts
  first and re-applies them after (`captureRecSortState()` / `restoreRecSortState()`).
  Sort state is keyed by table *position*, not id — most tables have no id, but the same
  code builds them in the same order.
- **`applyRecSort()` is the one place a column becomes sorted.** The header click handler
  and the rebuild-restore path both go through it, so the indicator, `aria-sort` and the
  row order can't drift apart.
- **Per-type record definitions that aren't simple lookups:**
  - A Perfect All Kill is an artist event, but each PAK week also crowns a song and an
    album, so those types show whichever appeared in the most PAK weeks.
  - Certifications can't rank songs or albums by tier — plenty reach Diamond eventually,
    so picking the most-played is arbitrary. The record is **first to get there**: highest
    tier reached, then earliest certification date at that tier. A higher tier always
    beats an earlier date, so the headline can't drift down to an early Gold. Artists
    still rank by how many certifications they hold, which has no tie problem.

- **New Charts records are capped to the New chart size, not to all-time discovery.**
  `ncLimits` in `buildRecords()` mirrors `renderNewEntries()`'s per-section limits exactly
  (weekly is `Math.max(20, size)`, monthly/yearly are the raw size) and the per-period
  ranked lists are sliced before any record is recorded. Without that slice the records
  ranked entries that never appeared on a chart — a "#247 debut" on a top-20 chart, and an
  album credited with 36 debuting tracks when only 20 could fit. The sliced song list
  (`sTop`) is deliberately kept in scope, because `ncAlbumNewTrackCount` has to count
  charting tracks only too. **Busiest Discovery Period is the one deliberate exception**:
  it answers "how much did I find", not "who charted", and capping it would flatten nearly
  every period to the chart size, so it stays on `rawNewCountPerPeriod` and says so in its
  own subtitle.
- **The New Charts type/period pills are DOM-only.** All six panels are built every time
  and switched by `display`, so search still reaches them. `applyNewChartsRecTabs()` is the
  single place the stored `dc_nc_rec_type` / `dc_nc_rec_period` become visible state;
  `runRecordsSearch()` overrides it (hiding both pill rows and showing whichever panels
  hold a hit), and clearing the search hands control back. Each panel carries
  `data-rec-scope`, which `setupRecordSubsectionCollapse()` prefers over the section-body
  id — otherwise the weekly and monthly copies of a record share a title, and so would
  share one collapse key.

- **The Milestones timeline is still a `<table>`.** Every records mechanism walks
  `tbody` rows — search (`runRecordsSearch`), the entries limit (`tagRecRowIndices` /
  `applyRecRowLimit`), collapse — so turning the section into divs would have dropped it
  out of all three. The timeline is built entirely in CSS (`.mil-timeline`) over ordinary
  rows. Two things this depends on:
  - Both row-hiding rules (`.rec-search-hidden`, `.rec-row-over-limit`) use `!important`,
    so `display: grid` on a row cannot defeat them. Keep it that way.
  - The boxed-table reset is `.mil-timeline td { padding: 0; border-bottom: none }`, so
    **every per-cell rule has to carry the `.mil-timeline` prefix** or the reset outranks
    it. A bare `.mil-tier { padding: … }` silently loses, including inside the mobile
    media query.
- **The tier ladder renders descending**, biggest first (`MIL_DESC`). Ascending would hand
  the entries-per-table limit the *highest* milestones to hide, which is backwards.
- **`<thead>` is `display: none` in the timeline.** A timeline has no columns to sort, and
  `display: none` also takes the sortable headers out of the tab order rather than leaving
  them focusable but invisible. The `<th>` text stays in the DOM, so `mil_th_first_to_reach`
  is screen-reader-only copy and has to read correctly for all three entity types.
- **The type pills reuse the New Charts pill CSS** by selector-sharing
  (`.nc-rec-tabs, .mil-tabs { … }`), not by copying it — same job, two sections apart, and
  they must not drift. `applyMilestoneRecTabs()` mirrors `applyNewChartsRecTabs()` exactly,
  including the search-escape path in the click handler. Inherited from that pattern: the
  pills are ~22px tall, so item **#49 now covers three pill rows, not two.**
- **There are now two ladders, and neither side may assume the other's.** Songs run
  **every 25 plays with no ceiling** (`SONG_MILESTONE_STEP`, expressed as a modulo — there
  is no array, because there is no sensible cap). Artists and albums keep the landmark
  `MILESTONES` array. Each panel states its own ladder in a `.rec-section-sub`, because
  "first to 500" means different things across the pills. **10 plays is kept as an
  explicit extra step for songs** (`SONG_MILESTONE_EXTRA`) — the modulo alone jumped
  straight from the origin row to 25, and 10 is where a song stops being something you
  tried once. Three consequences:
  - **Nothing may iterate `MILESTONES` to read a song's tiers.** The overview's `firstTo()`
    used to walk that array downwards and would have reported 500 for a song that reached
    525. It now reads the map's own tiers — highest reached, then earliest to reach it.
  - **The per-play test had to become O(1)** before this was viable. Every count rises by
    exactly one per play, so a tier is crossed on the single play where the running count
    equals it: `MILESTONE_SET.has(n)` for artists/albums, `n % 25 === 0` for songs. The old
    `for (const m of MILESTONES) … >= m` rescanned the whole ladder on every play, which an
    unbounded song ladder would have turned into a visible hang.
  - **`milTimeline()` derives its tiers from the data**, via one inverted pass that records
    the earliest entry per tier. The old shape (for each tier, scan every entry) was
    O(tiers × entries) and would have gone quadratic here.

  Net effect measured against HEAD on the demo dataset, `buildRecords()` median of three
  warm runs: **6453ms → 5616ms**. The finer ladder is *cheaper* than the old one, because
  both hot paths got better. `C:\tmp\mil_perf.mjs <port> <label>` is the harness; serve a
  `git archive HEAD` copy on a second port to get a baseline without touching the tree.
  Re-measure it if either loop is touched again.
- **The Fastest section still keys off `songMS[500]`** — 500 is a multiple of 25, so it
  survived the ladder change. Any future step size that does not divide 500 breaks it.
- **The origin row is not a milestone tier.** "The first one you ever played" is computed
  from the `songFirst` / `artistFirst` / `albumFirst` maps, *not* by adding `1` to
  `MILESTONES` — that array is shared with fastest-to-milestone and the overview record,
  and a `1` tier would have leaked into both. Two consequences to preserve:
  - `tagRecRowIndices()` pins `.mil-row-origin` to `data-rec-idx="0"`, so the entries
    limit can never cut the foot off the timeline. It is deliberately **not** in
    `REC_DETAIL_ROW_SEL`: detail rows inherit their parent's search result, and the first
    thing you ever played has to be findable on its own.
  - It counts as content for the empty state. A library too small to reach the 10-play
    tier still has a first play, and that is the whole story it has to tell.
- **Milestone artwork rides the app's normal image path.** `milQueueArt()` builds the
  per-type `prefKey` (`song:artist|||title`, `artist:name`, `album:artist|||album`) and
  `loadImages()` is handed one filtered queue per type, exactly like the appearances and
  debuts sections. Notes:
  - **Item #40's premise is wrong and should be rewritten**: `loadImages()` already uses
    an `IntersectionObserver` (`rootMargin: 300px`). What is actually slow is the single
    global `imgQueue` promise chain plus a 120ms sleep per Deezer call in
    `fetchAndInjectImage()`. Milestone art therefore queues behind every other section's,
    and takes tens of seconds to fully settle on a cold load — correct, just late. Any
    screenshot check has to poll until the boxes stop filling, not wait a fixed 2s.
  - `.mil-art` carries `.thumb-cell` so the records search skips it — without that every
    row would match on its own placeholder initials.
  - The art box is sized in CSS, not by the loader, so the initials placeholder and the
    cover that replaces it occupy the same space and the timeline never reflows.
  - Artists get `.mil-art-circle`; songs and albums get the rounded square. That is how
    the rest of the app separates an avatar from a cover.
- **Search under collapse used to miss milestone tables.** The `rec-searching` override
  listed `.rec-empty` and `div:not(…)`, but a milestone table sits directly under
  `.rec-section` as a `<table>` — so a hit inside a collapsed milestone sub-section stayed
  invisible. `.milestone-table` is now in that selector list.

### The intro plate — the run-on was two facts wearing one line

`.rec-intro` carried both the chart sizes and the data coverage, joined by a `|`.
Those are **the same three columns** — weekly, monthly, yearly — so pairing them per
column turns each into a sentence: *"weekly records come off a Top 10, and there are
517 of those weeks."* That pairing is the whole justification for stating the sizes
here at all, and one flat line hid it. No content was cut.

- **The cutoff rule is the one non-obvious piece.** A chart size *is* the line the
  chart stops at, so it's drawn under the number as a hairline that spans the number
  and nothing else. It's an `::after`, not a `border-bottom`, only so it can wipe in
  from the left; the column stagger and the wipe both key off `--i`, set inline by
  `buildRecords()` and inherited by the pseudo-element.
- **`.rec-intro-all`'s `line-height` is pinned to the numeral's `clamp()`, not to
  its own font-size.** The uncapped-yearly phrase sets at 0.85rem against a ~1.75rem
  numeral, and the cutoff rule is anchored to the bottom of that box — so without
  the pin, the yearly rule rode **12px above** the other two (measured; 7px at
  320px) and the plate read as three cards. Matching the line box also centres the
  phrase in it for free. Below 480px the phrase drops to 0.72rem with `nowrap`,
  because wrapping to two lines defeats the pin the same way.
- **Period words are `nav_weekly`/`nav_monthly`/`nav_yearly`**, not the
  `rec_*_label` set used lower down — those read "Weekly Chart", and "Chart" three
  times under a heading that already says Records is noise at 9.6px. Both sets are
  translated in all four languages, so this cost no coverage. Only `rec_intro_top`
  and `rec_intro_all` are new, and both were given es/pt/pt-br values rather than
  left to the English fallback.
- **`rec_intro_all` is deliberately not `rec_yearly_all`**, which begins with
  "Yearly" — the column heading has already said that.
- **The uppercase tier is unchanged.** `.rec-intro-label` is uppercase because these
  *are* column headers; they head the plate's three columns. This is the existing
  tier, not a fourth one.
- **The base `.rec-intro` rules are still load-bearing** — they style the pre-load
  fallback string in `index.html` ("Load your data to see records."), which is prose
  and stays as it was. `buildRecords()` replaces it with `.rec-intro-grid`.
- The six old keys (`rec_intro_prefix`, `rec_weekly_top`, `rec_monthly_top`,
  `rec_yearly_top`, `rec_yearly_all`, `rec_data_summary`) are now unused but left in
  place across all four language blocks. They are translated assets and a future
  revision of this strip may want them; nothing else reads them.
- Verified in-browser on the demo dataset at 1280/390/320px and in navy dark, yellow
  light, purple and pink: no intro or page overflow at any width, all three cutoff
  rules share a y, and both branches (numeral, uncapped phrase) render — the demo's
  yearly chart is uncapped, so it exercises the phrase path by default.

### Sticky headers — two overflow ancestors, not a wrapper problem

`position: sticky` resolves against the **nearest scrolling ancestor**, and *any*
ancestor with a non-`visible` overflow on *either* axis becomes one — on both axes.
Two such ancestors sat above every records `<th>`, and both had to go. Neither was
fixable by wrapping the table, which is what the old #19 note assumed.

- **`.rec-table` itself had `overflow: hidden`.** The rounded corners were never
  drawn by `border-radius`: `border-collapse: collapse` makes browsers ignore the
  radius entirely, so the corners were drawn *by the clip*. Removing the clip
  therefore meant re-rounding the table another way — `border-collapse: separate`
  + `border-spacing: 0`, with the four corner cells rounding themselves at **7px**
  (8px minus the table's own 1px border). Two knock-ons:
  - **Borders set on `<tr>` are not painted in the separated model.** The row
    separator moved from `.rec-table tbody tr` onto `.rec-table tbody td` — which
    is what `.milestone-table` already did, so the two now match.
  - `.rec-run-detail td` lost its `border-top`. Collapsed, it merged with the
    parent row's `border-bottom`; separated, the two stack into a visible 2px rule.
- **`.section-body` had `overflow-x: auto`** — the real reason sticky still did
  nothing after the table was fixed. It exists for the *chart* tables, which grow
  columns as display toggles are switched on. The box is exactly as tall as its
  content, so it never actually scrolls; it just silently anchored the header.
  Records opts out above 768px only. **Measured, don't guess:** at 390px, New
  Charts overflows its container by 212px, PAK by 206px, Certifications by 148px
  and All #1s by 126px, and with the scroller gone those push the whole page
  sideways. They fit by 768px.
- **The background must sit on the `th`, not the `thead`.** A sticky `th` moves and
  its `thead` does not, so a thead-only background gets left behind and the rows
  show through the labels. `z-index: 3` clears the ✎ picker badges, which are
  absolute at `z-index: 2` and otherwise paint over the stuck header.
- `position: relative` on the `th` became `sticky`, which is still a containing
  block, so `.col-resize-handle` is unaffected. The handle is skipped for the last
  column anyway, so its `right: -2px` never needed the old clip.
- **`.nc-sd-table` needed an opt-out.** Its rows become `display: grid` cards under
  the mobile media query, so a per-*cell* separator draws a line under every field
  in the card instead of one line between rows. Its card border still paints
  despite `border-collapse: separate`, because `display: grid` takes the row out of
  the table model altogether.
- **Not fixed, pre-existing:** every Records section overflows the page by 212px at
  a 768px viewport. Confirmed identical on a pristine `HEAD` build, so it is not
  from this work — but it is real and unlogged, and it is not one of the 50.

### Artwork in Records is now re-pickable everywhere

An audit of the tab found **771 artwork elements across five sections with no ✎ picker at
all** — PAK (214), Debuts (125), Milestones (69), New Charts (56) and the certifications
wall. Only All #1s and Appearances had written the button into their markup by hand.

- **The badge is attached in `loadImages()`, not in each section's markup**
  (`attachRecImgPicker`, gated on `el.closest('#recordsView')`). Records draws artwork from
  eight builders; this is the one place all of them already pass through, so a new section
  cannot gain artwork without gaining the control. The button is inserted as a **sibling**
  of the artwork inside a `.thumb-wrap` — never a child, because
  `fetchAndInjectImage()` replaces the target's `innerHTML` when the cover lands.
- **PAK and the certifications wall were fetching their own images** with bare
  `getArtistImage`/`getAlbumImage` loops. That bypassed pinned picker choices, the source
  cascade and per-item source prefs — a cover corrected anywhere else in the app was still
  wrong in those two sections. Both now go through `loadImages()`, which also made them
  lazy: PAK's expand rows no longer fetch covers for artists nobody expanded.
  `togglePakArtistExpand()`'s own image loop was removed; it would have raced the
  observer and overwritten the picker-aware markup.
- **The certifications wall re-renders on every filter, sort and search.** Three things
  follow, all of which took a fix:
  - Its observers are retired and spliced out of `imgObservers` before each render, or
    both arrays grow by two per click — and the wall runs to **1,406 cards** on a large
    library.
  - `loadCertWallImages()` is called from `renderCertWallCards()`, not once at build time.
  - Resolved covers are carried across renders in `_certWallResolved`, keyed by picker key
    (a re-sort renumbers every card). **This is not just an optimisation:** `imgCache`
    stores a `null` placeholder for the duration of an in-flight fetch, so re-resolving an
    item mid-sort caches a permanent miss and that cover never comes back.
    `harvestCertWallImages()` distinguishes `.thumb-initials` (the loader answered "no
    image", including a "No image" pin — record it) from `.cert-record-initials` (our own
    pre-load placeholder — do not record it).
  - The artwork got its own `.cert-record-slot`: the loader replaces its target's
    innerHTML, and the record wrap also holds the sleeve and the vinyl centre.
- **`.rec-thumb-wrap` is `display: block`, deliberately.** As a flex container it shrank
  any child that did not set `flex-shrink: 0` — `.pak-mini-thumb` does, `.mil-art-box` did
  not. It also must not carry `width: fit-content`, which resolved to 25.6px against a
  41.6px cover and parked the `right:`-anchored badge in the middle of the artwork.
- The 28px thumbs (PAK, New Charts) take a 12px badge via `.pak-mini-thumb +
  .img-src-btn` — 16px is over half their width and reads as a blot rather than a control.

**Known issue, pre-existing and app-wide:** `getArtistImage`/`getAlbumImage` set
`imgCache[k] = null` *before* awaiting, so a second lookup of the same key while the first
is in flight gets a cached miss rather than the eventual URL. Records works around it in
the certifications wall only. Fixing it properly means caching the in-flight promise.

### The hero — "most records" is a count, which is why it could be built at all

#45 was stuck because records are not comparable: 40 weeks at #1, a 12-day streak
and a Diamond certification share no unit, so "your #1 record overall" needed an
arbitrary rule to pick a winner. Reframing the question as **which artist holds the
most records** dissolves that — counting *is* the common unit. The hero is the
artist with the most rows across the whole tab, and each of those rows becomes a
card in a marquee beneath the photo.

- **A record is one row, at any rank.** Three Taylor Swift songs inside one Top 25
  are three records, not one. This is deliberately not "who holds the #1 spot" —
  the number answers "how decorated is this artist", so an artist with 200 rows
  wins over one with a single more impressive record.
- **The tally is a DOM walk, not a data pass** (`recTallyArtistRecords`), for the
  same reason the global search is one: the built tables are the only place all
  ~55 record lists exist in one shape. A future section is counted for free as
  long as its rows expose an artist. Two ways they can — an
  `.img-src-btn[data-artist]` from the shared `nameRow` helpers, or explicit
  `data-rec-*` on the row.
- **`data-rec-*` had to be added because `attachRecImgPicker` is async.** It writes
  `data-artist` onto artwork during `loadImages()`, so any row depending on it is
  invisible at build time and countable seconds later — the count came out
  different on every load. This was found by diffing the reel's deck against a
  fresh tally in the same page (133 vs 136, the three being Debuts→Albums). Every
  section that draws its own thumbnail now carries build-time attributes:
  `recRowAttrs()` for anything going through `recTable` (via the new `opts.rowAttrs`),
  and inline attributes for PAK, Milestones, Debuts and the certifications wall.
  **Don't let a new section rely on the picker badge for attribution.**
- **The entries limit is respected in both directions.** `recTable()` slices to it
  at build time, and `recTallyArtistRecords()` also skips `.rec-row-over-limit`,
  so shrinking the limit re-tallies to a smaller number without a rebuild
  (`applyRecordsLimitChange` calls the hero again on that path). Measured on the
  demo set: 25 → 188 records, 50 → 236, 100 → 321, and back to 25 → 188.
- **Collaborations count for each artist named**, via `splitArtists()` — the same
  function the charts use, so a feature is credited exactly the way the charts
  credit it, and the "don't split artists" setting is honoured for free. 155 rows
  on the demo set name more than one artist.
- **Card details are read from the row's own cells paired against its table's own
  `<th>`** (`recRowDetails`). That is what lets a certification card say tier/type/date
  while a debut card says plays/position/week, without a line of per-section code —
  and a table that gains a column gains it on the card. Four gotchas, all found in
  the browser: the `<th>` also holds `.rec-sort-ind` (▲) and `.col-resize-handle`;
  cells stack parts that `textContent` runs together ("550Plays", "Perfect All
  KillWeeks"), so child nodes are joined with `·` between `<div>`s and a space
  otherwise; parts with no letter or digit are decoration (the 🎵/💿 column icons,
  PAK's ▼ caret) and are dropped; and the cell holding `.rec-name` is skipped
  because it is already the card's title.
- **The certifications wall is the one exception** to all of that — it is divs, not
  a table, so it has no `<th>` to pair against and its three fields are picked by
  class instead. `.cert-date` reads "Certified Oct 12, 2025", so the label prefix
  is stripped from the value.
- **The card leads with one figure, it does not lay out a grid.** The first pass put
  the details in a two-column key/value grid, which orphaned the odd one out and
  left half a card empty whenever a record had a single supporting fact. Every
  record has one figure that *is* the record — 5 weeks at #1, 396 plays, Diamond —
  so `pickHeadlineDetail()` promotes it to a DM Serif Display numeral and the rest
  collapse to one meta line. Serif numerals against DM Mono micro-labels is the
  contrast the font stack exists for, and it reads as a chart annual rather than a
  dashboard tile. Three de-stuttering rules were needed once value and label sat
  next to each other, all found on screen and not in the data:
  - the headline drops its trailing unit when the label already carries it
    ("22 weeks" under "Weeks on Chart" becomes "22"), which is also what lets the
    numeral hold the display size;
  - any value opening with its own column name drops the prefix ("Week" +
    "Week of 14 Apr 2024");
  - `pickHeadlineDetail()` scores against bare dates and long tally strings,
    because Appearances leads with a date and the certifications leaderboard leads
    with "14× 💎 21× 💿 45× 🪙" — neither is a headline.
  Known cosmetic artifact: the label is a *column header*, not a unit, so a value
  of 1 can read "1 YEARS AT #1". Fixing it properly needs per-language plural
  rules; it sets as a caps micro-label, which reads as a category tag.
- **The rank is a vinyl label centre, not inline text.** A disc in the top-right
  corner, so records with no ranking (the wall, the timeline) simply have no disc
  instead of an empty slot in the sub line. `.rec-hero-card-head` carries
  `padding-right: 26px` to clear it. Cards are `min-height: 132px` so a record with
  one supporting fact and one with three are the same height in the reel.
- **The reel is the Time Machine ticker's mechanism** (`.tm-ticker-*`), not a copy
  of its CSS: deck rendered twice, track animated to `-50%` so the wrap lands on
  the start of copy B, edge fade as a `mask-image` rather than overlay elements,
  pause on hover. Only copy A's artwork is fetched and mirrored into copy B, which
  halves the API calls. Images are fetched directly in batches rather than through
  `loadImages()`, because the reel is in constant motion and an
  `IntersectionObserver` fires unpredictably against a moving target.
- **Uncapped by decision.** 188 records is a ~12-minute loop at the ticker's 4s per
  card. The deck is shuffled instead (`tmShuffle`), so a long deck opens somewhere
  different each visit rather than always on the same table's rows.
- **The two "Busiest Discovery Period" tables are correctly uncounted** — they rank
  *periods*, not artists, so no row in them has an artist to credit. Every other
  table in the tab now contributes.
- **`prefers-reduced-motion` stops the marquee** and turns the reel into an ordinary
  horizontal scroller. Note the existing `.tm-ticker-track` has **no** such opt-out
  — a pre-existing gap on the Time Machine that this deliberately did not inherit.
- **Placement settles the "two headlines" question** left open below: the hero lives
  at the top of `recOverviewSection`, above the 9-card grid, not above the search
  bar. A 340–420px banner in the tab chrome would push search and all 11 nav pills
  below the fold on mobile, and would sit directly under the intro plate. The plate
  stays orientation; the hero is the headline, inside a section you can navigate away
  from.

### Known data gaps

Albums have **play-count milestones** as of the timeline work above (`albumMS` /
`albumFirst` / `albumCP`, built in the same `chron` pass as the artist and song ladders,
keyed `album|||albumArtist` like every other album map). Plays with no album tag are
excluded — common in CSV uploads — which `mil_no_data_albums` says out loud.

Albums still have **no fastest-to-milestone and no listening streaks**. Fastest is now
nearly free: `recFastestBody` only needs an `albumMS`/`albumFirst` pass in the same shape
as the artist one. Streaks still need new computation (there is no `albumDaySet`). One
overview card therefore remains empty on the Albums pill instead of three.

---

## Pending — 40 items

### A. Information architecture & navigation

- [ ] **1. Group the nav pills into 3–4 labeled families.** Still 11 pills: removing "All"
      and adding "Overview" was a net wash, so this is exactly as unaddressed as at audit
      time. Suggested grouping: *Dominance* (All #1s, PAK, Appearances) · *Firsts* (Debuts,
      New Charts, Milestones, Fastest) · *Volume* (Most Plays, Certifications, Streaks).
- [ ] **3.** Persistent left rail on desktop (≥900px) instead of a wrapping pill row.
- [ ] **4.** Put each section's emoji on its nav pill. The overview cards do this; the nav
      doesn't, so nav→section matching is still text-only.
- [ ] **6.** Deep-link sections (`#records/streaks`). State is localStorage-only, so a
      record can't be linked or shared. Should carry the search query too, now that there
      is one.
- [ ] **7.** Count badge per nav pill (`Streaks · 12`).
- [ ] **8.** Disable or grey pills for sections with no records.
- [ ] **9.** *(partial)* Split "New Charts" out of Records. Not split, but no longer a
      wall: two exclusive pill rows inside the section (Songs/Artists/Albums, then
      Weekly/Monthly) show 2–5 tables at a time instead of all 20. Moving it to its own
      top-level tab is still open.
- [ ] **10.** Make the nav a real `role="tablist"` with `aria-selected` and arrow keys.

### B. Page-level orientation & hierarchy

- [x] **11.** ~~Rewrite `.rec-intro` as a real stat strip.~~ Shipped as a three-column
      plate — see **The intro plate** in the implementation notes. All the original
      content was kept; the audit's "mono run-on" problem was structural, not
      editorial.
- [ ] **14.** Section header cards: name, one-line definition, headline stat.
- [ ] **15.** Sticky sub-section headers while scrolling within a section.
- [ ] **16.** *(partial)* Title tracking was cut, but nav pills are still 0.08em at 9.3px.
- [ ] **17.** Vertical rhythm between sections — `.rec-section` margin is still 1.5rem,
      the same gap used inside a section, so sections don't read as separate.
- [ ] **18.** Anchor links on sub-section titles so a specific record can be bookmarked.

### C. Table readability

- [x] **19.** ~~Sticky table headers.~~ Shipped at ≥768px — see **Sticky headers** in
      the implementation notes. The old note here ("move the radius to a wrapper
      first") was wrong: a wrapper would still have been an overflow-hidden
      ancestor. Below 768px the tables still need their horizontal scroller, so
      headers only stick on desktop — **#20 and #48 are what would lift that.**
- [ ] **20.** Cut the Appearances tables from 9 columns to 5; move first/last-streamed
      into the expand row.
- [ ] **21.** Collapse the double thumbnail (song cover *and* artist avatar per row).
- [ ] **22.** Cap font sizes per table at three, not five.
- [ ] **23.** Right-align count columns with `font-variant-numeric: tabular-nums`.
- [ ] **24.** Zebra striping or a row-group rule every 5 rows.
- [ ] **25.** Give ranks 1–3 more than a text colour — a medal chip or tinted row.
- [ ] **26.** Inline proportional bar behind the count column.
- [ ] **27.** *(partial)* Every row-level and expand-all control in Records is now the
      same `▶`/`▼` pair, so the glyph *set* is unified. What's left is the mechanism: PAK
      rotates one static chevron in CSS, everything else swaps `textContent`. Pick the
      rotation and drop the swaps. Section/sub-section `−`/`+` are a different affordance
      and shared with the rest of the app — changing those is not a Records-only edit.
- [ ] **29.** Make the whole row clickable to expand. PAK already does; the others don't.
- [ ] **30.** *(partial)* Sortable headers got `aria-sort`/`role`/`tabindex`, but collapse
      toggles still lack `aria-expanded` and tables lack `<caption>`/`scope="col"`.

### D. Finding things

- [ ] **33.** Per-section entry limit instead of one global control for all ~55 tables.
      Cheaper than it was: `applyRecRowLimit()` already applies a limit per table without
      rebuilding, so this is now mostly UI plus per-section state.
- [ ] **34.** "Show 25 more" at the foot of each table instead of limit buttons. Same
      note as #33 — the row-level plumbing exists.
- [ ] **35.** Artist filter chip — click any artist to scope the whole tab to them. Search
      does this by typing; the chip is the one-click version of the same filter.
- [ ] **36.** Date-range scope. Every record is all-time only, so they go static after
      the first visit.

### E. States, performance, feedback

- [ ] **37.** Skeleton state — `buildRecords()` blocks synchronously with no feedback.
- [ ] **38.** Lazy section build. All ten sections are fully built on every visit;
      `applyRecordsViewFilter()` only toggles `display`. **Careful**: global search now
      depends on every section being in the DOM. Lazy building has to either build on
      first query or search the data instead of the DOM.
- [ ] **40.** *(premise wrong)* `loadImages()` already observes intersection. The real
      cost is the single global `imgQueue` chain + a 120ms sleep per Deezer call in
      `fetchAndInjectImage()`. Rewrite this item as "parallelise the image queue".
- [ ] **41.** Warn before rendering "All" entries. Still the one limit change that has to
      rebuild, and now the only slow one.
- [ ] **42.** *(partial)* Overview cards teach; section tables still say a bare "No data".
      Copy the PAK empty state's pattern, which explains what the record requires.
- [ ] **43.** "Last computed" timestamp in the intro strip.

### F. Personality & sharing

- [ ] **44. Share-as-image per record.** Records is the most brag-worthy surface in the
      app and still the only one with no share path, despite `PRODUCT.md` making
      shareable moments a core principle. **The hero (#45) is now the obvious place
      to start** — it is the one element on the tab designed to be looked at.
- [x] **45.** ~~A single oversized hero above the grid.~~ Shipped, but as *most
      decorated artist* rather than "your #1 record overall" — see **The hero** in
      the implementation notes for why that reframing is what made it buildable.
      Banner photo, name, total, and an infinite shuffled reel of every record the
      artist holds, each card carrying that record's own figures.
- [x] **46.** ~~Milestones as a timeline, not a 4-column table.~~ Shipped: vertical spine,
      one node per tier (round tiers carry an accent fill), descending, cover art or
      artist avatar per entry, an "1st play" origin node where the spine terminates, and a
      Songs/Artists/Albums pill row. Songs run a finer every-25-plays ladder than artists
      and albums. Albums are new data — see **Known data gaps**.
- [ ] **47.** Certifications as actual gold-glow badges, reusing the badge component.
      This is the one section where DESIGN.md's "gold means earned" rule literally applies.

### G. Mobile & accessibility

- [ ] **48.** Mobile card layout for the 9-column tables. `overflow-x: auto` with no
      scroll affordance means mobile users never discover columns 5–9.
- [ ] **49.** Nav touch targets are ~22px tall, half the 44px minimum, in a wrapping row.
- [ ] **50.** *(partial)* Several tiers moved off `--text3`, and `.rec-intro` is now
      `--text`/`--text2` for everything except its column labels and the word "Top".
      The nav pills are still 9px in `--text3`; needs a contrast pass across all nine
      themes.

### Not one of the 50

- [ ] Album fastest-to-milestone and streaks don't exist in the data — see **Known data
      gaps** above. Album milestones now do.

---

## Working notes

**There *is* a real browser available — the earlier "headless only" note was wrong.**
The app runs against the sample dataset with no credentials: serve `dankcharts/`
statically and click `.landing-demo-btn`.

**The `C:\tmp` Playwright install from the earlier session is gone** (no
`node_modules`, no scripts). Don't count on it. Rebuilding it takes about ten
seconds and no browser download, because Chrome and Edge are both installed:

```
npm install playwright        # with PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
chromium.launch({ channel: 'chrome' })   # drives the system Chrome
```

`serve_dc.mjs` (a 20-line static server taking root + port), `sticky_verify.mjs`
(sticky/border/collapse/search assertions) and `mobile_check.mjs` (per-section
horizontal overflow at 320/390/768px) were written for item #19 and are worth
copying for the next one. **Always diff against a baseline**: `git archive HEAD
--format=zip`, expand it, and serve that on a second port — that is the only way
the 212px pre-existing overflow was told apart from a regression. (`git archive |
tar -x` fails on Windows: tar reads `\\.\tape0` without `-f -`. Use the zip form.)
Gotchas:

- The Records nav pill sits in the collapsed second nav row so `page.click` gets
  intercepted — use `page.evaluate(() => el.click())`.
- The demo needs ~2.5s after the tab opens before all ~55 tables exist. Better than a
  fixed wait: `waitForSelector(sel, { state: 'attached' })` — **`attached`, not the
  default `visible`**, because every section except the active one is `display: none`.
- Ports 8899 and 8901 were both held by stale, unresponsive `python` processes left over
  from an earlier session. Check with `Get-NetTCPConnection -LocalPort N -State Listen`
  and copy `serve_dc.mjs` to a free port rather than assuming 8899 is yours.
- Theme classes are on `<body>` and are named `yellow`, `yellow-light`, `purple-light`,
  … — there is no plain `light` class, and setting one silently leaves the page dark.

Search, the entries limit and the expand glyphs were verified this way. Still worth
eyeballing on the deployed site: the Albums pill (three empty cards), Yellow Dark and
Yellow Light (tightest accent contrast), and the Certifications card on Songs (the only
card whose sub-line is a date).

**The jsdom approach** (`npm i jsdom` in a scratch directory, then slice the real
functions out of `app.js` with `indexOf` and `eval` them, with real markup sliced from
`index.html` and real translations from `translations.js` — no invented fixtures) still
works and is faster for pure logic. Gotchas:

- `const` bindings do not escape `eval`; append
  `;Object.assign(globalThis, { ... })` inside the evaluated string to export them.
- jsdom returns *computed* values (px, rgb), and does not resolve `var()` inside
  `font-family`. Write CSS assertions in those terms.
- jsdom emits `csstree-match BREAK after 15000 iterations` on a stylesheet this large, so
  its selector matching isn't guaranteed exhaustive — cross-check against hand-computed
  specificity.
- Source files are **CRLF**. Scripted find/replace must convert LF patterns to CRLF.

**The `impeccable` design hook** fires on every edit here and reports ~35 findings in
`style.css`, ~9 in `app.js`, ~3 in `index.html`. All are pre-existing and were reviewed as
**false positives**: the `broken-image` hits are the app's deferred image-loader pattern
(`<img>` with `data-imgid`/`data-sources`, `src` assigned later) plus runtime-populated
placeholders inside hidden containers (`.dc-user-avatar` filled by `firebase.js`,
`#ytMiniThumb` by `_ytUpdateThumb`). Don't "fix" them and don't add ignore rules for them
without a decision from the project owner.

**Suggested next three:** #1 + #4 + #49 together (the nav pills: group them, put the
section emoji on them, give them a 44px target — one pass over the same markup, and now
the only 9px `--text3` tier left in the tab), then #20 (cut Appearances from 9 columns
to 5) — which now also buys the mobile half of #19, since the wide tables are the only
reason headers stop sticking below 768px — then #43, which has an obvious home in the
intro plate now that there is one.

**Cheap now that the hero exists:** #44 (share-as-image) has a natural subject, and
#7 (count badge per nav pill) can reuse `recRowRecord()` — the per-section row counts
already fall out of the same walk.

**Resolved:** the plate-vs-#45 "two headlines" question is settled. The plate stays
orientation in the tab chrome; the hero is the headline and lives inside the Overview
section. See the last bullet of **The hero** for why it is not above the search bar.
