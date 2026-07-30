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

### Known data gaps

Albums have **no play-count milestones, no fastest-to-milestone, and no listening
streaks** — `artistMS`/`songMS` and `artistStreaks`/`songStreaks` exist, but there is no
album equivalent anywhere in `buildRecords()`. Three overview cards are therefore
permanently empty on the Albums pill (they render "Not tracked for this chart" rather than
disappearing, so the grid keeps a stable shape). Closing this requires new computation,
not new lookups.

---

## Pending — 42 items

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

- [ ] **11.** Rewrite `.rec-intro` as a real stat strip. It's the only page-level
      orientation and it's a mono run-on at 11.2px in `--text3`.
- [ ] **14.** Section header cards: name, one-line definition, headline stat.
- [ ] **15.** Sticky sub-section headers while scrolling within a section.
- [ ] **16.** *(partial)* Title tracking was cut, but nav pills are still 0.08em at 9.3px.
- [ ] **17.** Vertical rhythm between sections — `.rec-section` margin is still 1.5rem,
      the same gap used inside a section, so sections don't read as separate.
- [ ] **18.** Anchor links on sub-section titles so a specific record can be bookmarked.

### C. Table readability

- [ ] **19.** Sticky table headers. **Blocked**: `.rec-table` (`style.css`) sets
      `border-radius` + `overflow: hidden`, which kills `position: sticky`. Move the
      radius to a wrapper first.
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
- [ ] **40.** IntersectionObserver for images instead of sequential 60ms awaits.
- [ ] **41.** Warn before rendering "All" entries. Still the one limit change that has to
      rebuild, and now the only slow one.
- [ ] **42.** *(partial)* Overview cards teach; section tables still say a bare "No data".
      Copy the PAK empty state's pattern, which explains what the record requires.
- [ ] **43.** "Last computed" timestamp in the intro strip.

### F. Personality & sharing

- [ ] **44. Share-as-image per record.** Records is the most brag-worthy surface in the
      app and still the only one with no share path, despite `PRODUCT.md` making
      shareable moments a core principle.
- [ ] **45.** *(~70% done via the overview)* Missing a single oversized "your #1 record
      overall" hero above the grid.
- [ ] **46.** Milestones as a timeline, not a 4-column table — it's a story with dates.
- [ ] **47.** Certifications as actual gold-glow badges, reusing the badge component.
      This is the one section where DESIGN.md's "gold means earned" rule literally applies.

### G. Mobile & accessibility

- [ ] **48.** Mobile card layout for the 9-column tables. `overflow-x: auto` with no
      scroll affordance means mobile users never discover columns 5–9.
- [ ] **49.** Nav touch targets are ~22px tall, half the 44px minimum, in a wrapping row.
- [ ] **50.** *(partial)* Several tiers moved off `--text3`, but nav pills and
      `.rec-intro` are still 9–11px in dim colours; needs a contrast pass across all
      nine themes.

### Not one of the 50

- [ ] Album milestones, fastest-to-milestone, and streaks don't exist in the data — see
      **Known data gaps** above.

---

## Working notes

**There *is* a real browser available — the earlier "headless only" note was wrong.**
`C:\tmp` has a Playwright install (`node_modules/playwright`, Chromium already
downloaded) and the app runs against the sample dataset with no credentials: serve
`dankcharts/` statically and click `.landing-demo-btn`. `C:\tmp\serve_dc.mjs` is a
20-line static server on port 8899; `rec_verify.mjs`, `rec_edge.mjs` and `rec_glyph.mjs`
next to it are the checks written for search / limit / glyphs and are worth copying for
the next item. Two gotchas: the Records nav pill sits in the collapsed second nav row so
`page.click` gets intercepted — use `page.evaluate(() => el.click())`; and the demo needs
~2.5s after the tab opens before all ~55 tables exist.

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

**Suggested next three:** #19 (sticky table headers — move the radius to a wrapper first,
then it's unblocked), #11 (rewrite `.rec-intro` as a real stat strip, the last mono
run-on at the top of the tab), #1 + #4 + #49 together (the nav pills: group them, put the
section emoji on them, give them a 44px target — one pass over the same markup).
