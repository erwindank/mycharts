# dankcharts.fm — Redesign Plan

Written 2026-10-10, updated the same day with a second set of screenshots.
Based on full-page screenshots plus a read-through of `dankcharts/index.html`
and `dankcharts/style.css`.

**Updated 2026-10-11:** Phase 1 is done, and two of its three items turned out
not to be bugs (see 1, problems 6 and 7). Section 5 now says what was built,
what it changes for the later phases, and how to take screenshots that don't
mislead. Phase 0 is done too (same day): `DESIGN.md` now holds section 3.

**Updated 2026-10-13:** Problem 2 (initials instead of pictures) was mostly a
screenshot artifact. Artwork loads lazily as each part of the page scrolls
into view, and the screenshots were taken without scrolling there, so those
slots had never asked for their picture. Phase 4 has been redone as a review
of the picture system instead — see section 3.7 and the phase 4 row.

**Seen on screen:**
- Weekly: Albums and Songs, in all six chart layouts (Table, Card grid,
  Compact, Mosaic, Filmstrip, Stack)
- Monthly Artists, Yearly Songs, All-Time Songs
- Raw Data, Graphs
- Records: Overview, All #1s, Perfect All Kill, Appearances, Debuts, Most
  Plays, Milestones, Fastest

**Not seen yet (judged from the code only):** Records → Certifications,
Streaks, New Charts; Events; Awards; Soundtrack; Playlists; Board; Charts
Guide; the pop-up windows; Settings; the landing page; phones. Those findings
are about structure (how many controls, how things are laid out). Look at each
one on screen before changing it. Section 6 lists them.

---

## 1. The short version

The site has a lot of features and real personality. The design falls short in
three ways:

1. **Everything looks equally important.** Every element sits in a box with the
   same border, background and tiny uppercase label, so nothing stands out.
2. **There are no shared rules.** Over time each feature got its own sizes,
   colours and button styles. The stylesheet shows it (numbers below).
3. **Everything is visible all at once.** Every option, filter, hint and badge
   is on screen by default, so the content you care about competes with the
   controls for changing it.

None of this needs a rewrite. The fix is to set a small set of rules, apply
them everywhere, and make the default view calmer while keeping every
detailed option one click away.

### What the stylesheet says

| Measure | Count | A healthy site |
|---|---|---|
| Lines of CSS | 35,478 (1.1 MB) | a few thousand |
| Different text sizes | 131 | 6–8 |
| Text sizes below 11px | 703 places | almost none |
| Most common text size | 0.6rem = **9.6px** | 14–16px |
| Typewriter font (mono) vs normal font | 560 vs 66 uses | the reverse |
| Different hex colours | 411 (+514 rgba) | ~30 tokens per theme |
| Different shadows | 222 | 3–4 |
| Different corner roundings | 55 | 4–5 |
| Different letter-spacings | 38 | 2–3 |
| Uppercase text rules | 211 | a handful |
| Inline `style="..."` in the HTML | 352 | close to 0 |
| Screen-width breakpoints | 12 different widths | 2–3 |
| Pop-up windows | 27 | — |
| Buttons in the HTML | 680 | — |

The single biggest reason the site looks dated is the small typewriter text.
**9.6px uppercase monospace with wide letter-spacing** is used for almost every
label, which is what gives it the "hacker terminal from 2018" look.

### Problems that show up on every page (from the screenshots)

1. **About 1,100px of the same thing on top of every view.** Masthead, sync
   bar, streak, Time Machine and the two-row menu come before any content,
   on every tab. On Records, the first record is about a quarter of the way
   down the page. You scroll past the same Time Machine on every page.
2. **Grey letter circles instead of pictures.** "JH", "TF", "GL", "WW"… Almost
   every artist on Monthly Artists, most rows on Records, and all 26 cards on
   the Records Overview show initials. This makes the site look unfinished
   more than anything else apart from the type. Where there *is* art (Card
   grid, Mosaic, the Records hero), the site immediately looks good.
   *(2026-10-13: mostly not real. These slots had not been scrolled into view,
   so their pictures had never been asked for. On a real library about 99% of
   items find a picture. See 3.7.)*
3. **A red YouTube button on every song row.** On Yearly and All-Time that's
   100 bright red buttons in a column, the loudest thing on the page. It's
   also the same red as "dropped". (It can already be switched off in ⋮ →
   Show. It should be off by default.)
4. **Coloured tag soup.** Bubbling Under has a legend of about 16 tag types
   (Fresh, Climbing, Fading, Sleeper, Steady, Surging…), each in its own
   colour, and each row carries 3–5 of them. Nobody can learn 16 colours.
5. **Pages go on forever.** Yearly Songs is over 16,000px tall: top 100, then
   20 new songs, then two release reels. Every row looks the same, so the
   eye has nowhere to rest.
6. ~~**A large empty gap** between the menu and the stat tiles.~~ **Not a
   bug in the site (checked 2026-10-11).** Measured in a browser, the date bar
   ends and the stat tiles start 28px later, on Songs and on Albums. The gap
   came from how the screenshots were taken (see 7).
7. ~~**The period picker moves.**~~ **Also not a bug.** The date bar sticks
   to the top of the screen as you scroll (`#stickyNavBar`,
   `position: sticky`). A screenshot tool that builds a full page by
   scrolling and stitching catches the bar pinned to the top of a later
   frame, so it shows up again over the Certified reel. Tools that hide
   pinned elements after the first frame leave its usual spot empty instead,
   which is the "gap" in 6. In the DOM the bar is always in one place: under
   the menu, above the stat tiles. The real issue is different: once pinned,
   the bar takes about 100px off the top of the screen. That belongs to
   phase 5 (4.4: a slimmer bar inside the top bar).
8. **Blocks repeat across pages.** "Rating Records" sits at the bottom of every
   Records sub-tab. Upcoming / Recent Releases (Events content) sit at the
   bottom of the Weekly chart.

---

## 2. What to keep

These are strengths. The redesign must not lose them.

- **Album art.** It's the most attractive thing on the page. Give it more room.
- **Three things already look modern, and they're the model for the rest:**
  - **The Records Overview hero.** The big Taylor Swift photo, "Most decorated
    artist · 344 records" in large type, and record cards underneath. Big
    image, big words, one fact. The whole site should feel like this.
  - **The Card grid and Mosaic chart layouts.** Art-led, bold, shareable.
  - **The Records → Most Plays table.** Plain rows, title over artist, number,
    date, no badges. It's the cleanest table on the site, and every other
    table should copy it.
- **The depth of data.** Peaks, weeks on chart, certifications, scores. This is
  the product (PRODUCT.md: "Respect the data nerd"). The plan below hides
  nothing permanently: it changes what is shown *by default*.
- **The 10 themes.** A good identity lever. They will look better once the
  structure underneath is calm.
- **Keyboard navigation, swipe, reduced-motion support** (47 reduced-motion
  rules: good work).
- **Four languages.** Every layout change must still fit Portuguese and
  Spanish, which run about 20–30% longer than English.
- **The "Show" toggles in each chart's ⋮ menu** (certifications, score, peak
  tags…). They already exist. They become the way the data nerd turns detail
  back on.

---

## 3. New design rules

These replace or amend parts of `DESIGN.md`. Update that file first so every
later change has something to follow.

### 3.1 Type: one scale, readable sizes

| Token | Size | Use |
|---|---|---|
| `--fs-xs` | 12px | captions, table column headers, badges |
| `--fs-sm` | 13px | secondary text (artist under title), chips |
| `--fs-base` | 15px | body, table rows, buttons |
| `--fs-md` | 18px | card titles, section headings |
| `--fs-lg` | 24px | page / period title, big stat numbers |
| `--fs-xl` | 36px | the hero (#1 of the week) |
| `--fs-display` | 48–64px | wordmark only |

- **Nothing below 12px.** That rule alone removes 703 problems.
- **Amend "Mono-Means-Data".** Keep JetBrains Mono for *numbers* (ranks,
  plays, deltas, dates) using `font-variant-numeric: tabular-nums`. Drop it
  for *labels, buttons, tabs and headings*: those move to IBM Plex Sans. That
  reverses the 560-to-66 imbalance and is the biggest single visual change.
- **Uppercase only for tiny column headers**, at 12px with 0.04em tracking.
  Not for section titles, buttons or tabs.
- **Section headings in Bricolage Grotesque**, sentence case ("Top 10 albums",
  not "TOP 10 ALBUMS" in a tagged box).

### 3.2 Colour: colour must mean something

**There are 10 themes: Navy, Purple, Red, Yellow and Pink, each in dark and
light.** Every colour rule here is written as a *role*, never as a fixed
colour, and every role has a value in all 10 themes. "White text" is wrong
for half the site, so the plan never says "white". It says "primary text".

**The roles.** Each theme defines exactly these, and nothing in the CSS uses a
raw colour outside them:

| Role | What it's for | Dark themes | Light themes |
|---|---|---|---|
| `--bg` | page | darkest | very light, *barely* tinted |
| `--surface` | cards, table, pop-ups | a step lighter than the page | white (or near-white) |
| `--raised` | hover, selected, dropdowns | another step lighter | a light tint of the hue |
| `--text` / `--text2` / `--text3` | primary / secondary / muted text | light | dark |
| `--border` | hairlines (rarely needed) | subtle light line | subtle dark line |
| `--accent` | active tab, primary button, links, focus, #1 highlight | the theme hue, bright | the theme hue, deep enough to read as text |
| `--on-accent` | text on an accent-filled button | whichever reads on that accent (yellow-dark's accent is light, so its text is dark) | usually white |
| `--up` / `--down` / `--new` | chart movement only | bright | deeper, to hold contrast on light |
| `--gold` (+ platinum, diamond) | certifications only | bright metal | deeper metal |

Most of these exist already (`--bg --surface --text2 --accent --green --rose
--gold1 --on-accent`…), and app.js reads several of them for the canvas
charts, so they must stay plain hex values per theme. The work is making the
rest of the CSS use them instead of the 411 raw hex values.

**How dark and light themes differ, beyond swapping values:**
- **Depth.** On dark themes a card stands out by being *lighter* than the
  page. On light themes it stands out with a *soft shadow* on a white card.
  So the shadow tokens need a light-theme value (soft and visible) and a
  dark-theme value (barely there).
- **Hover.** Dark: lighten. Light: darken or tint. Use `--raised` and never a
  hard-coded `rgba(255,255,255,…)`, which disappears on a light background.
- **Light backgrounds should be barely tinted.** Today they are strongly
  tinted (`#ccdcf0` navy, `#efcfe6` pink, `#eee5b0` yellow). That makes the
  whole page look coloured-in and makes covers look dull. Put the tint in the
  accent and in `--raised`, not in the page.
- **Gold on light themes** needs the deeper metal (`--gold2` already
  exists), or a gold disc vanishes on a pale yellow page.

**When the theme's own colour collides with a meaning colour:**
- **Red theme:** the accent is red, and so is "down". **Pink theme:** the accent
  is close to the rose used for "down". **Yellow theme:** the accent is close
  to certification gold. So movement and certifications must **never rely on
  colour alone**. Movement always carries its arrow (`▲2`, `▼1`, `NEW`,
  `RE`), and certifications always carry their disc icon and word. In the Red
  theme, "new" should use a neutral or the green rather than the accent, so
  that "new" and "down" don't look alike.

**Concretely, that means:**
- The stat tiles: one colour for all the big numbers (`--text`, or `--accent`),
  with the per-tile colour kept only in the icon tile and corner wash (see
  4.6, which is your call).
- The left-edge coloured bars on table rows go, unless they mean something
  explained on screen.
- Tags (3.8) use `--raised` + `--text2`, so they work in every theme without
  their own palette.
- The artwork placeholder gradients (3.7) come in two sets, one for dark
  themes and one for light, so they don't glow on light pages or turn muddy
  on dark ones.
- **The masthead in Red, Yellow and Pink light** is dark while the rest of
  those themes is light (a known collision). With the slim top bar (4.1) the
  masthead goes away in the app view, which removes the problem. On the
  landing page, it must use its own masthead tokens, never the page ones.

**Checking it.** Every phase is checked in at least **Navy dark, Navy light,
Yellow dark** (the light-accent theme, where white-on-accent breaks) and **Red
light** (where the accent and "down" collide). Contrast for text: 4.5:1
against its background in every theme. The existing comments in `style.css`
already record recalibrated pairs, and that habit should continue.

### 3.3 Space instead of boxes

- **Stop boxing everything.** A section is a heading plus content, separated
  from the next by space (48px), not by a border. Use a card background only
  where things need grouping: stat tiles, album cards, pop-ups.
- **Never a box inside a box inside a box.** Today a chart table sits in a
  bordered section inside a bordered wrapper. Use one level.
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64. DESIGN.md already lists
  most of this, but the CSS doesn't follow it.
- **Corners:** 6px (small controls), 10px (cards), 16px (pop-ups), full
  (pills/avatars). That's 4 values instead of 55.
- **Shadows:** one for dropdowns and pop-ups, one for hover lift, and the gold
  badge glow. That's 3 instead of 222.

### 3.4 One of each component

One button style (primary, secondary, ghost), one tab style, one segmented
control, one chip, one dropdown, one card, one table, one carousel. Today
there are separate button families for nearly every feature: `graphs-btn`,
`ev-view-btn`, `creel-btn`, `tm-type-btn`, `st-period-btn`, `sh-seg-btn`,
`awards-subnav-btn`, `records-nav-btn`, `weekly-view-btn`, `kebab-tab`… Each
looks slightly different. Build the shared set once, then point each feature
at it.

### 3.5 Icons, not emoji, in the interface

Section titles currently start with emoji (⏳ 🏆 📈 🎂 🎤 🔜 🆕 🎧 📅 🗓 ⊞), and
the menus use 🌐, 📂 and 📄. Emoji render differently on every device and
clash with the line icons used elsewhere. Use one SVG icon set everywhere
(the period-nav icons already show the right style). Flags in the language
picker are fine.

### 3.6 Hints and system messages

- **One-time hints** ("arrow keys to navigate periods", "Hover to pause · drag
  to browse", "Click any card for options…", "collapsed — click + to
  expand"): show them once, then never again. Or replace them with a tooltip
  on a small ⓘ.
- **System messages** ("Auto-corrected 6 entries in sheet", "Loading…",
  sync results): show them as a toast in a corner that disappears after a few
  seconds, not as a line in the page.

### 3.7 Every song, album and artist has a picture

**Status 2026-10-13.** The site already does most of this: Deezer first, then
iTunes, then Last.fm (YouTube only when picked by hand), with a picker to
choose any picture. On the sample library 774 of 784 items found one. What the
review found and fixed (phase 4):
- Last.fm sends the same grey star for every artist; it counted as a picture.
- A busy answer from Deezer counted as "no picture", was remembered, and moved
  the item to lower-res iTunes/Last.fm art for good.
- Two lookups for the same item at once: the second one read "no picture".
- Every picture loaded at 1000×1000 (~300 KB) even in a 36px row; a 100-row
  chart pulled about 16 MB. Now sized to the slot: about 0.3 MB.
- Lookups ran one at a time, and the Time Machine, Soundtrack and Records reels
  (hundreds of cards each) competed with what was on screen. Now three at a
  time, reels last: a 100-row chart fills in about 3 s instead of 21.
- About ten places (Soundtrack avatars, bubbles and banner, streak cards, Now
  Playing, the bar race, album plaques) asked Deezer only.
- Spotify-style titles ("Song - Acoustic Version", "Album - EP", "A, B" as the
  artist) found nothing on Deezer; they now get a second search.

Still open, for later phases: the gradient-and-icon stand-in below (a small
job now that misses are rare), and artist pictures being round in some places
and square in others (for example the two artist cards in "of the moment").

The original plan:

- **Fetch artist and album images** wherever they're missing. Last.fm no longer
  serves artist photos, but Deezer's public API does (no key needed), and so
  does Spotify's with a key. Cache the result in the browser so each one is
  fetched once.
- **When there really is no image:** a soft gradient picked from the name
  (one of 8 theme-friendly gradients, chosen by a hash of the name) with a
  small vinyl or microphone icon. **No initials.**
- The Records Overview cards should show the holder's cover, not giant
  letters.

### 3.8 Tags: few, quiet, and explained once

- **At most 2 tags per row**, and only the ones that matter most (e.g. "Climbing"
  or "Fading", not both plus "Steady" plus a count).
- **Tags are neutral** (muted background, normal text). Only the movement
  word gets green/red. Gold stays for certifications.
- **The legend is a ⓘ tooltip** next to the section title, not a block of 16
  coloured chips above the list.

### 3.9 Calm defaults, nerd switches

The ⋮ → Show menu on each chart already switches certifications, score,
peaks, peak tags, descriptions, YouTube buttons and the Bubbling Under
legend on and off. **Change the defaults, not the features:**

**Done in phase 1 (2026-10-11), and further than first planned: every switch
is off by default**, Score and Certification included. You decided that the
clean chart is the default and every detail is something you switch on.

| Switch (⋮ → Show) | Was | Now |
|---|---|---|
| Cert Badges | on | **off** |
| My Scores | on | **off** |
| Plays Peak (personal-best badge) | on | **off** |
| Peak Tags ("PEAK #1") | on | **off** (Peak gets its own column in 4.10) |
| YouTube button per row | on | **off** (play from the song pop-up for now; the row ⋮ comes in phase 7) |
| Playlist ＋ button per row | rode on YouTube | **its own switch, off** |
| BU Legend | on | **off** (ⓘ tooltip later, 3.8) |
| Descriptions | on | **off** |

- Each person's choices are kept. The first click on any switch saves all of
  them, so people who had touched one keep exactly what they had.
- The ＋ playlist button had always been hidden with YouTube. It now has its
  own switch. Saved settings from before the split copy the YouTube value, so
  nobody lost a button they could see.
- The Charts Guide tour turns every switch on while it runs (display only,
  nothing saved), names the switch for each thing it shows, and puts the
  saved settings back when it ends.
- Where Score and Certification are switched on, 4.10 still applies: score
  as a small muted number, certification as a small disc.

---

## 4. View by view

### 4.1 Masthead (top of every page). Seen on screen

**Now:** "★ Your Personal Music Charts · Est. 2016 ★" + a huge wordmark +
tagline + "Streaming since January 9, 2016" + a boxed strip of five all-time
stats. Theme and Language are tiny buttons floating in the top-right corner.
The sync bar sits underneath as a separate strip. That's about 400px of
screen before any chart.

**Problems:** It says the same thing three times (est. 2016, streaming since
2016, tagline). It's the biggest thing on the page and the least useful. The
controls are split between two places.

**Fix:**
- A **slim top bar, around 56px, that stays at the top as you scroll**: wordmark
  (small) on the left, then the main tabs, then on the right: Sync (icon
  button with a spinning state), Settings (gear), Theme, Language, and the
  profile picture with a menu (sign out lives there).
- Delete the "est." line, the tagline and the "Streaming since" rule from the
  app view. Keep the big wordmark and tagline for the landing page only.
- Move the five all-time stats into a small "All-time" row on the All-Time
  tab (or a hover card on the profile picture). They don't describe this week.
- **On every tab other than Charts, the top of the page is just the top bar
  and the tab's own title.** No masthead, streak or Time Machine. Records,
  Graphs and Raw Data should start within the first 150px.

### 4.1b Streak strip. Seen on screen

On the Records screenshots, the streak banner also shows a row of tiny album
covers floating in the middle of the box, with no label. Either label it
("last 14 days") or drop it. The small streak pill (4.2) is enough.

### 4.2 Sync bar, ON AIR bar, streak banner. Seen on screen

**Now:** a strip with a green status message on the left, then the buttons;
below it the artist streak, a full-width box that's mostly empty.

**Fix:**
- Status message → toast (3.6). Buttons → top bar (4.1).
- **ON AIR + streak → one slim "now" strip** under the top bar: cover, "Now
  playing: Song — Artist" with the live dot, and on the right "🔥 14-day Miley
  Cyrus streak" as a small pill. When nothing is playing, show only the streak
  pill, or nothing at all.

### 4.3 Main navigation. Seen on screen

**Now:** a "CHART VIEWS" label, then two rows of tabs (Weekly, Monthly,
Yearly, All-Time, Raw Data, Graphs / Records, Events, Awards, Your Soundtrack,
Playlists, Board, Charts Guide), each with a tiny dot in the corner, plus a
"Less/More" button and a hover preview card. It sits *below* the Time Machine.

**Problems:** 13 destinations shown at once, and half the page down. The time
periods (Weekly/Monthly/Yearly/All-time) are mixed in with whole features
(Graphs, Board). Those are two different kinds of choice.

**Fix:** split it into two controls.
- **Main tabs** in the top bar: **Charts · Stats · Records · Awards ·
  Soundtrack · More ▾** (More holds Events, Playlists, Raw Data, Board,
  Charts Guide). Graphs is renamed Stats. On mobile, use a bottom tab bar with
  the first four plus More.
- **Period switch** only inside Charts: a segmented control **Week · Month ·
  Year · All-time**, right next to the date (4.4).
- Remove the corner dots (what do they mean?) and the "CHART VIEWS" label.
  Keep the keyboard shortcuts, and show them in tooltips.

**Note:** the fact that the site needs a "Charts Guide" tab to explain its 20+
features is a sign the navigation isn't doing that job. After this change the
guide can be a help link, not a main tab.

### 4.4 Period picker. Seen on screen

**Now:** "This Week" with the dates in a small pill underneath, arrows on far
left and right, and a keyboard hint below.

**Fix:** one line: **`‹  This week · Oct 4 – 10, 2026  ›`** next to the
Week/Month/Year/All-time switch, at `--fs-lg`. Click the date to open the
picker (as now). Drop the hint (3.6). Make it part of the sticky top bar on
scroll, as `stickyNavBar` already tries to do.

**Checked 2026-10-11:** the picker already stays in one place and already
pins to the top as you scroll (the "it moves" report was the screenshot
tool, see 1.7). Pinned, it is a ~100px card with the hint line, which is the
part to fix: down to the one line above, ~48px, inside the top bar.
Also for phase 5: on a phone the round scroll-to-top button sits over the
chart's plays column while you scroll. Move it clear of the content.

### 4.5 Time Machine. Seen on screen

**Now:** the first section after the header, with a tagged title, a "+
Playlist" button, Songs/Artists/Albums toggles, a subtitle, a hint line, and
an auto-scrolling carousel that is cut off at the right edge.

**Problems:** it's a nice feature, but it's nostalgia, not this week. It
pushes the actual charts down. The cut-off edge looks broken.

**Fix:**
- Move it **below the charts** (or onto the Soundtrack tab, which is
  also about memories).
- Make it a **horizontal row with a soft fade at the right edge and ‹ ›
  buttons**, not auto-scrolling. Auto-moving content is hard to read and
  needs the "hover to pause" hint to exist at all.
- Group the cards by year with a small year label above each group, instead
  of a year printed on every card.
- Songs/Artists/Albums as one small segmented control. "+ Playlist" goes in a
  ⋮ menu.

### 4.6 Stat tiles. Seen on screen

**Now:** 8 tiles in a 4×2 grid: total plays, unique songs, artists, albums,
best day, new songs, new artists, new albums. Each has a different number
colour and a coloured pill delta.

**Already decided (2026-10-02):** these tiles were restyled then (tinted icon
tile, delta pills, corner colour wash), and the content **stays centred**.
You rejected a left-aligned version. So this is a light touch, and each point
below is your call:

- **Number colour:** consider making all the big numbers the same colour (white
  or the theme accent) and keeping the per-tile colour only in the icon tile
  and corner wash. Today four different number colours compete with each
  other.
- **Optional, fewer tiles:** fold "New songs / New artists / New albums" into
  the matching tile as a small "+75 new" line under the number, giving 4 tiles
  instead of 8. "Best day" could become a caption on the Plays tile.
- **The text-size and font rules (3.1) still apply:** labels at 12px+ in sans,
  not 9.6px mono.

### 4.7 "Of the moment" cards. Seen on screen

**Keep as they are.** You approved these cards earlier and asked for them to
be treated separately from the other stat tiles. They only get the site-wide
type changes (3.1) if you want them, and nothing structural. Don't touch their
layout without asking.

(A separate idea for later, not part of this plan: a "this period's #1" hero
with large cover art and a share button. It would sit *above* these cards,
not replace them, and only if you want it.)

### 4.8 Certified this period. Seen on screen

**Now:** a tagged title, a counter, filter buttons, and an auto-scrolling
carousel of large gold cards, cut off at the edge, with a "Hover to pause"
hint.

**Fix:** same carousel rules as the Time Machine (fade edge, arrows, no
auto-scroll). Make the cards smaller: the cover with a small
gold/platinum/diamond disc in the corner, title, and "Gold album" in gold
text. Keep gold only here and in badges. Place it *after* the main chart.

### 4.9 Chart filters. Seen on screen

**Now:** four rows of pill buttons in three different styles: "Collapse
all"; Songs/Artists/Albums; Chart/Bubbling under/Off the chart/New entries;
Albums/Singles/EPs/All.

**Fix:** a single toolbar row directly above the table:
- Left: **Songs · Artists · Albums** segmented control (the main choice,
  biggest).
- Right: a **"Type: All ▾"** dropdown (Albums/Singles/EPs, only when Albums is
  chosen), and the view-mode icon buttons (table, grid, compact…), which
  currently live inside the ⋮ menu.
- Bubbling Under / Off the Chart / New Entries are not filters, they are
  sections. They become sections under the main chart, each with its own
  heading (4.11). "Collapse all" goes away; each section can still collapse.

### 4.9b Chart layouts (Table, Card grid, Compact, Mosaic, Filmstrip, Stack). Seen on screen

**Now:** six layouts, hidden in the ⋮ menu under "View".

**All six stay.** Having several ways to look at the same chart is part of
the personality, and each one suits a different moment (reading, browsing,
screenshotting). The job is to make each one as good as the best ones.

#### Every layout gets every feature

**The problem today:** switching layout loses features, because each layout
was built on its own and only the Table has everything. From the code
(`renderSongs()` for the Table, `_wvGrid / _wvCompact / _wvMosaic /
_wvFilmstrip / _wvStack` in app.js for the others), Songs looks like this
today. It's a code reading, so check each "—" on screen before fixing it.

| Feature | Table | Card grid | Compact | Mosaic | Filmstrip | Stack |
|---|---|---|---|---|---|---|
| Rank, movement (▲ / ▼ / NEW / RE) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Previous rank | ✓ | — | ✓ | — | — | — |
| Cover | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Change the cover picture | ✓ | — | — | — | — | — |
| Details pop-up | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Each artist clickable | ✓ | — | — | — | — | — |
| Album shown | ✓ | — | ✓ | — | — | ✓ |
| Album clickable + album certification | ✓ | — | — | — | — | — |
| Peak, certification, rating | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Weeks on chart | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| Plays | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Change in plays vs last period | ✓ | — | — | — | — | — |
| Play bar | ✓ | ✓ | — | — | ✓ | ✓ |
| Personal-best ("plays peak") badge | ✓ | — | — | — | — | — |
| **Chart run** | ✓ | — | — | — | — | — |
| Play on the player | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Add to playlist | ✓ | ✓ | ✓ | — | — | ✓ |
| Right-click menu (play next, queue, similar) | — | ✓ | — | — | — | — |

Two more gaps, outside the table:
- **The other five layouts only exist on Weekly.** `applyWeeklyChartView()`
  returns early for any other period, so Monthly, Yearly and All-Time are
  always a Table.
- **Switching to another layout hides the page buttons**, so a chart bigger
  than one page can't be paged through.
- The ⋮ → Show switches reach the other layouts unevenly. For example, the YouTube and
  peak-tag switches have rules for Filmstrip, Card grid, Compact and Stack,
  but not all switches have rules for all layouts.

**The fix: one set of features, six ways to draw them.**

1. **One item builder.** Write a single function that works out
   *everything* about an entry once: rank, movement, previous rank, peak,
   weeks, plays, change in plays, personal best, certifications (song and
   album), rating, album, artist links, and the chart-run key. Every layout
   draws from that same object, so a feature added once shows up everywhere.
   (`_wvItem()` already does part of this, so extend it, and have `renderSongs()`
   use it too.)
2. **One action set.** Play now, play next, add to queue, play similar, add
   to playlist, open details, open album, open artist, change cover picture,
   search on YouTube, show chart run. The same list everywhere, reached
   in three consistent ways:
   - a **▶ play button** visible on hover (on phones, always visible),
   - a **⋮ button** on each entry that opens the full action menu,
   - **right-click** opens the same menu (today only Card grid has one).
3. **One details drawer for everything that doesn't fit.** Click any entry in
   any layout and a **panel opens under it (rows) or beside it (cards)** with:
   the chart run, peak, weeks, previous rank, change in plays, personal best,
   album and its certification, every artist as a link, and the action
   buttons. That's how the visual layouts (Mosaic, Filmstrip, Card grid) keep
   their clean look and still have every feature. Today the chart run
   exists only as the Table's expand row, so this drawer reuses that same
   `buildCrPanelHTML()` content.
4. **Each layout chooses what's on its face, not what exists.** Same data,
   different emphasis:

   | Layout | On the face | In the drawer |
   |---|---|---|
   | Table | everything, in columns | chart run |
   | Compact | rank, move, title · artist, weeks, plays | everything else |
   | Stack | rank, move, cover, title, artist, album, plays | everything else |
   | Card grid | cover, rank, move, title, artist, plays; peak/weeks on hover | everything else |
   | Filmstrip | big: cover, rank, title, artist, plays, peak, weeks | everything else |
   | Mosaic | cover, rank, title (on the fade) | everything |

5. **The Show switches apply to every layout.** A switch hides its feature
   wherever it's drawn, on the face or in the drawer. Write the rule once per
   feature (one class on the item), not once per layout. Since phase 1 all
   eight switches default off, so **the face of every layout is the clean
   version by default**, and the drawer is where most people will meet the
   detail. The Playlist switch (phase 1) already follows this rule: one body
   class, hiding the ＋ in every layout and in the cover overlays.
6. **Every layout on every period.** Monthly, Yearly and All-Time get the
   layout buttons too, and paging works in every layout (on Card grid and
   Mosaic, as "Show more" at the bottom).
7. **Every layout on Artists and Albums too,** with the same features
   adjusted (an artist's "album" line becomes their song count, as
   `_wvDisp()` already does).
8. **Animations:** the Table's rank-change replay should play in every
   layout. Card grid already has its own "biggest movers first" animation, so
   make that the shared approach.

**Rules every layout follows:**
- The same type scale, colours, artwork fallback (3.7) and badge rules (one
  certification disc, muted score) as everything else.
- Every layout respects the ⋮ → Show switches. If certifications are off,
  they're off in every layout.
- Every layout looks right at phone width and in a light theme, not just
  Navy Dark on desktop.
- Every layout can be shared as an image as it is, with no separate share
  design needed.
- **The six layout buttons move into the chart toolbar** (4.9) as a row of
  small icons with tooltips, instead of hiding in ⋮ → View. People don't find
  them there today, which is why most never see the best ones.
- The chosen layout is remembered per section (Songs / Artists / Albums), as
  now.

**Each layout, as seen on screen, and how to improve it:**

**Table** (the default, and the weakest-looking today). All the fixes in
4.10. It's the "full detail" layout, so it keeps every column.

**Card grid** (5×2 covers). Already one of the two best-looking layouts.
- Put the title and artist **under** the cover, not on top of it, so the
  art stays clean and the text is always readable.
- The rank as a clear number in the top-left corner on a small dark chip,
  and the movement (▲2 / NEW) in the top-right.
- The certification as a small disc in the bottom corner of the cover, not a
  badge row.
- On hover: plays, peak and weeks slide up over the bottom of the cover.
- 5 across on desktop, 3 on tablet, 2 on phone.

**Compact** (one line per entry). Good for long lists, but today the title
sits far left and the artist far right with a big empty gap between them.
- Title and artist together: **Title** · Artist, in one line, left side.
- Numbers right-aligned in fixed columns (move, weeks, plays) so they line up
  down the page.
- 36–40px rows with a small 28px cover. No badges except the certification
  disc.

**Mosaic** (big collage). The other best-looking layout, and the most
poster-like.
- Make the size order obvious: **#1 biggest, #2–3 medium, #4–10 small**, on a
  regular grid, so it reads as a ranking and not as a random collage.
- A soft dark fade at the bottom of each tile so the title and rank are
  readable on any cover, light or dark.
- Even gaps between tiles. Today they vary.
- This is the natural "share" layout. Add a one-click "Share this" on it.

**Filmstrip** (today only the top 3, with a lot of empty space). It reads like
the chart failed to load.
- Keep the big top-3 cards, but **make them fill the width** and add the
  rest of the chart under them: **#4–10 as a horizontal strip** of smaller
  cards (scrollable, with arrows and a faded edge).
- That turns it into the "podium" layout: a big moment for the top 3 with
  the rest still visible. It's the layout most likely to make a chart feel
  like an event.

**Stack** (two columns of rows). Today it reads 1, 2 / 3, 4 / 5, 6 across,
which breaks the ranking.
- Fill **down first**: 1–5 in the left column, 6–10 in the right.
- Give #1 a double-width row across both columns at the top.
- Same row style as Compact, but with a larger cover (48px) and the artist
  on its own line.
- One column on phones.

**Long charts (11–100) in any layout:** use a slimmer version of the chosen
layout from #11 down. Table → shorter rows, Card grid → smaller tiles,
Mosaic → all tiles the small size. The top 10 keeps its full size. That keeps
a top 100 from becoming a 16,000px page without overriding the layout the
person picked.

### 4.10 The chart table. Seen on screen (the most important fix)

**Now:** columns are rank, previous, cover, title + artist + up to four
badges (PEAK #1, PLATINUM, 9.4, 4× DIAMOND), tracks, weeks, total plays with a
bar and a coloured delta. Some rows have a coloured left bar. Missing covers
show grey initials ("WW", "MM").

**Fix:**
- **Columns:** `Rank | Move | Cover | Title / Artist | Wks | Peak | Plays`.
  - **Move** is a single symbol: `▲2` green, `▼1` red, `—` grey, `NEW` accent,
    `RE` for re-entry. Drop the separate "previous" column; its number goes
    into a tooltip on the movement.
  - **Peak** gets its own narrow column (a number) instead of a "PEAK #1"
    badge on every row.
  - **Tracks** column: hide by default (it's in the ⋮ "Show" menu).
- **No badges next to the title by default** (phase 1 switched them all off).
  When switched on: at most the highest certification, as a small disc icon
  in gold/platinum/diamond, and the score (9.4) as a small muted number.
- **Rows:** 64px tall, 48px cover, title at `--fs-base` semibold, artist at
  `--fs-sm` secondary colour. Thin divider between rows, no box per row.
  Hover lightens the row.
- **#1 row:** a soft accent-tinted background and a slightly bigger cover. No
  border box.
- **The play bar:** keep it (it's a nice touch), but thinner (3px) and in the
  muted text colour. The number is what matters.
- **Missing covers:** use a generated placeholder: a soft gradient from the
  artist name (one of 8 theme-friendly gradients picked by a hash) with a
  small vinyl icon, not initials. Better still, fetch the art.
- **Remove** the left-edge coloured bars.
- Rank numbers in Bricolage Grotesque at `--fs-lg`. Big, confident ranks are
  what makes a chart feel like a chart (think Billboard).
- **YouTube button off by default** (3.9, done). Playing moves to the row's hover
  ⋮ menu and the song pop-up, next to Spotify and "add to queue". **Until
  phase 7 builds that menu, a table row has no play control by default**:
  you play from the pop-up (click the title) or switch YouTube back on. See
  "What phase 1 changed" in section 5. If that hurts in daily use, bring the
  ▶-on-hover part of phase 7 forward on its own.
- When both are on, the YouTube and ＋ buttons are one tidy pair (phase 1):
  same 22px height and corner, 8px apart, and the gap goes with YouTube when
  only the ＋ is shown.
- **Album column** (Songs table): it wraps onto two lines on the Weekly
  table at desktop width. Show the album as a third line in muted text under
  the artist on narrow screens, or truncate it with "…" and show the full name
  on hover. Never let it wrap the row to double height.
- **Copy the Records → Most Plays table.** It already does most of this.

### 4.11 Bubbling under / Off the chart / New entries. Seen on screen

**Now:** two collapsed bars, then a long "New Albums" list. 17 rows on the
screenshot, 14 of them "1 play".

On the Songs screenshots, **Bubbling Under** is 10 tall rows, each with a
YouTube button and 3–5 coloured tags, under a 16-chip legend. **Off the
Chart** has 4 rows with long pink/red explanation lines ("5 week streak before
dropping out · Now #21 in Bubbling Under"). **New Songs** is 20 rows.

**Fix:**
- Three short sections under the main chart, each **showing 5 rows** with
  a "Show all 17" link. Same row style as the main table but compact (44px).
- Lay out Bubbling Under and Off the Chart side by side on desktop (two
  columns), since both are short.
- Tags per 3.8: two at most, neutral colours, legend in a ⓘ.
- Off the Chart: one short muted line per row ("Out after 5 weeks · now #21
  in Bubbling Under"), not coloured text.

### 4.11b Upcoming / Recent Releases on the chart page. Seen on screen

The Weekly page ends with two release reels, each with its own
Reel/Tiles/Table/List switch, "+ Playlist" and Refresh buttons. That's Events
content. Move it to Events, and leave at most a single "3 new releases from
your artists this week →" link on the chart page.

### 4.12 Monthly, Yearly, All-Time. Seen on screen

Same template as Weekly, which is good: fix the Weekly page and these follow.
What the screenshots add:
- **The length.** Top 100 rows of identical height. Yearly Songs is over
  16,000px. **Fix:** the top 10 keeps the full size of whichever layout is
  chosen, and 11–100 use a slimmer version of the same layout (see the end
  of 4.9b). Show 50, then "Show all 100".
- **Monthly Artists is nearly all letter circles.** This is where artist
  images (3.7) matter most.
- **All-Time already has search and page numbers**, which is good. Make the
  page numbers the shared button style and put a "Rows: 25 / 50 / 100" choice
  next to them, not at the top.
- **All-Time** has no previous period, so hide the Move column instead of
  showing dashes.
- **All-Time stat tiles** (4 tiles in blue/green/pink/yellow): the same colour
  fix as 4.6.

### 4.13 Raw Data. Seen on screen

**Now:** a very long table (one row per play, 100+ rows on a page) in small
type, with filter boxes for title, artist, album and date at the top, and
page buttons at the bottom.

This one is mostly fine. A raw data table *should* be dense. **Fix:**
- **Header row and filter row stay at the top while you scroll** (sticky).
  On a long page you lose track of which column is which.
- Text at `--fs-sm` (13px), not ~10px. Rows 36px. Zebra striping (every other
  row very slightly lighter) instead of borders.
- Date/time in tabular mono. Title, artist and album in sans.
- Page buttons repeated at the top, plus "Rows per page".
- The edit pencil appears on row hover only.

### 4.14 Graphs → "Stats". Seen on screen

**Now:** My Ratings (stat tiles, a rainbow bar chart, lists), Cumulative Plays,
Total Volume, Play Volume per Artist, New Discoveries, a Play Count Race, and
a listening heatmap for every year since 2016 stacked on top of each other.
Each card has its own row of date inputs, Reset, "Labels: Off" and "Reset
Zoom" buttons. 72 inline styles in this section alone.

**What the screenshots show:**
- **The line and bar charts are mostly empty.** The time axis starts in 2016,
  but on the screenshot most of the activity is in the last couple of years.
  You get a flat line across 80% of the card and a spike at the right edge.
- Heavy gridlines and default Chart.js styling.
- **The rating bar chart is rainbow-coloured** (each bar a different colour),
  which suggests the colours mean something. They don't.
- **The heatmap section is about 11 years tall**, one block per year, which is
  half the page on its own.

**Fix:**
- **One date range for the whole page** at the top, next to Daily / Monthly /
  Yearly, defaulting to **the last 12 months**, with quick buttons "12 mo ·
  3 yr · All". A card overrides it only when it needs to.
- Labels / Reset zoom → small icon buttons in each card's top-right corner.
- Chart styling: no vertical gridlines, faint horizontal ones, axis labels at
  12px in muted text, the theme accent for single series, and a fixed set of
  6–8 colours for multi-artist comparisons, checked in every theme.
- Rating bars: one colour (accent), lightness by score if you want a
  gradient.
- **Heatmap: one year at a time** with `‹ 2026 ›` arrows (same pattern as the
  period picker), and a small row of 11 mini-thumbnails to jump between
  years.
- Lay the cards out on a 2-column grid on desktop (small charts side by
  side, wide ones full width).
- Move all 72 inline styles into classes.

### 4.15 Records. Seen on screen (8 of 11 sub-tabs)

**Now:**
- The page starts with a strip "Weekly Top 10 · 526 weeks / Monthly Top 100 ·
  126 months / Yearly Top 100 · 11 years", then a search box, an "Entries
  display: 25 / 50 / 100 / All" control, and 11 sub-tabs in two rows
  (Overview, All #1s, Perfect All Kill, Appearances, Debuts, Most Plays,
  Milestones, Fastest, Certifications, Streaks, New Charts).
- **Overview:** a great hero (Taylor Swift photo, "Most decorated artist ·
  344 records"), a record-card carousel cut off at both edges, then **26
  record cards with giant letter initials** (JH, Y, YA, S, TF, GL…), each with
  a tiny "WEEKLY / MONTHLY / YEARLY" tag.
- **All #1s, Appearances:** two long tables per page (non-consecutive and
  consecutive), with dates as underlined blue links in mono ("Week of 2 Dec
  2018").
- **Perfect All Kill:** song and album titles in mono with a ♫ icon, and tiny
  pill badges in the last column.
- **Debuts, Most Plays:** clean tables. Most Plays is the best table on the site.
- **Milestones:** a timeline of "625 PLAYS / 600 PLAYS / 575 PLAYS…" pills,
  where the same song repeats five or more times in a row.
- **Fastest:** one open table, then nine collapsed bars ("Songs Fastest to
  100 Plays", "…to 150", "…to 200"… "…to 500").
- **Rating Records** (6 cards with emoji icons and big green/orange numbers)
  repeats at the bottom of every sub-tab.

**Fix:**
- **Overview cards: one per record *type*, not per type × period.** Today
  "All #1s" is three separate cards (weekly, monthly, yearly), and so are most
  others. Make each one card showing the weekly holder, with a small
  Week / Month / Year switch on the card. **26 cards become about 9**, each
  with the holder's cover art (3.7), not initials.
- The Overview carousel: same rules as other carousels (4.5), or a grid.
- **Sub-tabs:** a left sidebar on desktop, a dropdown on mobile. Keep the
  hero only on Overview.
- **Move "Entries display" next to the table** it controls, and drop the
  "526 weeks / 126 months / 11 years" strip to a small caption under the
  page title.
- **Dates:** plain text in the muted colour. Only the hover state shows that
  it's a link (underline on hover). A column of underlined blue mono links is
  very loud.
- **Titles always in sans**, with no ♫ icon in front (the column header
  already says "Songs").
- **Consecutive vs non-consecutive:** one table with a switch above it
  ("Total / In a row") instead of two tables stacked on one page.
- **Milestones: group by song.** One row per song: "The Fate of Ophelia ·
  525 → 625 plays · 5 milestones", which expands to show each one. Highlight
  only the big round numbers (100, 500, 1,000).
- **Fastest:** replace the nine collapsed bars with one selector above the
  table: "Fastest to **[50 ▾]** plays".
- **Rating Records:** show it once, on Overview (or in Graphs → My Ratings,
  where the rest of the ratings live). Not on every sub-tab. Replace the emoji
  with icons, and use white numbers (3.2).
- **Perfect All Kill:** spell the name out on first use with a ⓘ explaining
  it ("#1 song, album and artist in the same week"). Same for any other
  insider term.

### 4.16 Events. From the code

**Now:** 10 sections (Artist birthdays, Anniversaries, Upcoming shows, New
Music Friday, Upcoming releases, Recent releases, Recent birthdays…), **each
with its own Reel/Tiles/Table/List switch**, plus a calendar with
Month/Week/Day.

**Fix:**
- **One view switch for the whole page**, not ten.
- Group into three: **Coming up** (releases, shows, birthdays,
  anniversaries this week), **Just happened** (the recent ones), and
  **Calendar**. Each group can be a tab.
- Use one card style for every event type, with a small type icon
  (cake, ticket, disc) instead of a different layout per type.

### 4.17 Awards. From the code

My Grammys / Real-Life Awards sub-tabs, year arrows, a ceremony mode with
Previous/Next. This is the most "shareable moment" feature after the hero
card, so give it the most polish:
- Ceremony screen: full-width, big cover art, the category name in
  Bricolage, the winner revealed with one animation (respecting reduced
  motion).
- Year switch: use the same `‹ 2025 ›` pattern as the period picker (4.4).
- Gold here is allowed: this is literally "earned".

### 4.18 Your Soundtrack. From the code

11 sections (reel, top artists, top songs, activity, loyalty, discoveries,
milestones, artist milestones, streaks, Grammys, underrated gem, replay,
share card). This reads like a "Wrapped" story, so design it as one: a
vertical scroll of full-width chapters, one big fact per chapter, large type,
cover art backgrounds. The Time Machine (4.5) fits naturally as a chapter
here.

### 4.19 Playlists, Board, Charts Guide. From the code

These are drawn by JavaScript, so check them on screen. Apply the shared
components. The Charts Guide becomes a help link in the More menu (4.3).
The Board should look like the rest of the site, not like an embedded forum.

### 4.20 Pop-up windows (27 of them). From the code

Song, artist, album, rating, export, share-as-image (×5 variants), changelog,
settings, scrobble, rules… 27 in total.

- **One pop-up frame:** same header (title + ✕), same padding (24px), same
  corner (16px), same footer button layout (Cancel left/ghost, main action
  right/primary).
- **Song / artist / album details** should be a **side panel** that slides in
  from the right on desktop (full screen on mobile), so the chart stays
  visible behind it. Cover art big at the top.
- **The five share-as-image previews** (`igPreviewModal`, `crIgModal`,
  `stCardModal`, `rtCardModal`, `raCardModal`, `tpCardModal`): one shared
  "Share" window with the preview on the left and options on the right.
  Only the card design changes per feature.

### 4.21 Settings. From the code

Three tabs (Data source, Charts, Profile), about 1,000 lines of HTML. Use
plain grouped rows: a label on the left, a short description under it in
`--fs-sm`, and the control on the right. Each group gets a heading. Add a
search box at the top if it stays this long.

### 4.22 Landing page. From the code

Choose Last.fm / Google Sheets / File. Keep the big wordmark and tagline
here (they belong here, not in the app). Make the three source cards equal
in size and weight (PRODUCT.md: all three are first-class). Replace the 📄 📂
emoji with icons.

### 4.23 Footer. Seen on screen

Fine. Make it a single quiet line at `--fs-xs`, and merge "Questions or
issues? Contact Support · support@…" into it.

### 4.24 Mobile. From the code, check on a phone

There are 12 different breakpoint widths (480, 560, 600, 620, 640, 700, 720,
768…). Reduce to **two: 640px and 1024px**. On a phone:
- bottom tab bar (4.3)
- stat tiles 2×2
- chart rows: rank, cover, title/artist, plays; Move as a small arrow under
  the rank; Peak and Weeks in the row's tap-to-expand
- carousels swipeable with snap

### 4.25 Themes

The theme rules are in 3.2. Here, the practical side:

- After the colour clean-up, take a screenshot of the Weekly page in **all 10
  themes** and lay them side by side. Any element that looks wrong in one
  theme is using a raw colour instead of a role. Fix the element, not the
  theme.
- Screens that need a special look in light themes: the Records hero photo
  (its dark fade must stay dark in every theme, since it sits on a photo),
  Mosaic and Card-grid overlays (same reason), the share-as-image cards,
  and the canvas charts in Graphs (gridlines read `--rule`).
- Every *new* role added during the redesign goes into **all 10 theme
  blocks**, plus the duplicated tokens in `setup-guide.html`, `privacy.html`
  and `terms.html`, which have their own copy.

---

## 5. Order of work

Each phase is something you can ship on its own and see the difference.
Don't start the next one until the current one looks right in the four check
themes (Navy dark, Navy light, Yellow dark, Red light; see 3.2) and on a phone.

| Phase | What | Why this order | Size |
|---|---|---|---|
| **0** ✓ | **Done 2026-10-11.** Update `DESIGN.md` with section 3. The July 2026 redesign already added spacing (`--sp-1…8`), radius (`--r-*`) and shadow (`--shadow-1/2/3`) tokens, but the CSS barely uses them (`--sp-*`: 0 uses, `--shadow-*`: 17 uses vs 222 raw shadows). Add the missing font-size tokens (`--fs-*`), then point the CSS at the tokens. | The tokens exist; the rest of the CSS just never adopted them. | Small |
| **1** ✓ | **Quick wins — done 2026-10-11.** Every ⋮ → Show switch off by default, a separate Playlist switch, the YouTube/＋ pair tidied, the tour shows every switch while it runs. The gap and the moving picker were screenshot artifacts, not bugs (1.6, 1.7). | A visibly calmer site in an afternoon, with no redesign needed. | Small |
| **2** ✓ | **Type pass — done 2026-10-11** (CSS side; see "Phase 2" below for what was left out). Map all 131 font sizes onto the 7 tokens (anything under 12px → 12px), switch labels/buttons/headings from mono to sans, remove most uppercase and letter-spacing. | Biggest visual improvement for the effort. Mostly find-and-replace in CSS. | Medium |
| **3** ✓ | **Colour pass — done 2026-10-12** (on branch `redesign/phase-3-colour`, see "Phase 3" below). Remove per-tile and per-label colours, the left row bars, the rainbow chart bars and extra rgba tints. Neutral tags (3.8). Movement = green/red only. | Calms the whole site at once. | Small–medium |
| **4** ✓ | **Artwork — redone 2026-10-13** as a review of the picture system (3.7): the missing pictures were mostly a screenshot artifact. Fixed the Deezer→iTunes→Last.fm fallback, sized pictures to their slots, loaded three at a time with what's on screen first. Left for later: the gradient stand-in for the rare real miss. | Turned out smaller than planned. | Small |
| **5** | **Shell:** slim sticky top bar, new main tabs + More, period switch next to the date, toasts for status, merge ON AIR + streak, no masthead or Time Machine on non-chart tabs. | Fixes "can't find anything" and gives back ~1,000px on every tab. | Medium |
| **6** | **Weekly page:** one filter toolbar, sections reordered (stats + "of the moment" → chart → bubbling/off/new → certified → time machine), releases moved to Events, light-touch stat tile changes only if you choose them (4.6). | This is the page everyone sees first. | Medium |
| **7** | **Chart table and layouts** (4.9b, 4.10, 4.11, 4.12): one item builder + one action menu + one details drawer so **every layout has every feature** (chart run, peak, plays change, player, playlist…), layouts on every period with paging, all six layouts restyled, buttons moved into the toolbar, slimmer rows from #11 down, short lists capped at 5. | The core of the product. Do the shared builder first, then restyle each layout on top of it. | Large |
| **8** | **Shared components:** one button, tab, segmented control, chip, card, table, carousel, pop-up frame. Replace the per-feature button families. | Makes 9–10 fast and keeps it consistent. | Large |
| **9** | **Other views** in this order: Records (4.15), Stats (4.14), Raw Data (4.13), then Events, Awards, Soundtrack and the rest once seen on screen. | Records and Stats have the most concrete fixes already written down. | Large |
| **10** | **Pop-ups and Settings** (4.20–4.21), including the side panel for song/artist/album. | | Medium |
| **11** | **Final sweep:** move the 352 inline styles into classes, delete whatever old CSS and JS the earlier phases missed, reduce breakpoints to two, replace emoji in titles with icons. | Shrinks the 1.1 MB stylesheet and stops it drifting again. | Medium |

### What phase 1 changed for the later phases

Phase 1 went further than planned (everything off, not just four things),
and some later phases now rest on different ground. Read this before
starting any of them.

**Phase 0 (DESIGN.md). Done 2026-10-11, after phase 1.** What it did:
- `DESIGN.md` rewritten from section 3 of this plan, including the new
  default as its own rule (DESIGN.md §6, "The Default Chart Row Rule"):
  *a chart row shows rank, movement, cover, title, artist, weeks and plays;
  everything else is opt-in through ⋮ → Show.*
- `--fs-xs` … `--fs-display` added to `:root`. Not used yet: phase 2
  maps the font sizes onto them.
- `--sp-9` (64px) added, and the spacing tokens are now in rem, like most
  of the values they replaced, so they still follow the browser's text size.
- Every padding, margin and gap that already sat exactly on the spacing
  scale (873 values) and every corner that matched a radius token (287)
  now uses the token. **Nothing looks different:** a script expanded the
  tokens back to px and compared the whole stylesheet with the old one,
  with zero differences. One small exception: someone who set a bigger
  default text size in their browser now gets proportionally bigger
  spacing on the ~290 values that used to be fixed px.
- Anything still raw in `style.css` is **off** the scale (e.g. 14px,
  0.6rem). That is how later phases find what to move.

Not done in phase 0, on purpose:
- **Shadows.** None of the 222 raw shadows equals a token, so swapping
  them changes the look. They move in phase 8 (shared components), when
  each one gets looked at anyway.
- **Corners.** The target is 6 / 10 / 16 / full, but `--r-lg` is 14px and
  `--r-xl` 18px, with no 16px token yet. Changing them now would change
  every card and pop-up that uses them; phase 8 settles them.
- **Font sizes.** That is phase 2.

**Phase 2 (type). Done 2026-10-11 (CSS side).** Done with a script over
`style.css` and the inline styles in `index.html`, then checked on screen
in the four check themes, on a phone and in Portuguese, with the Show
switches on and off. What it did:
- ~1,390 font sizes now use `--fs-xs` … `--fs-xl`, so nothing below 12px
  is left outside the exceptions below. Sizes of 40px and up (heroes, big
  rank numbers) and `em` / `clamp()` sizes were left as they are.
- Labels, buttons, tabs and headings moved from JetBrains Mono to IBM Plex
  Sans (445 rules). Mono stays on 130 number rules (ranks, plays, dates,
  movement, counts), which now also get `tabular-nums`.
- `text-transform: uppercase` removed from 202 rules. Column headers keep
  it, at 0.04em tracking. Positive letter-spacing removed everywhere else;
  the negative tracking on display headings stays.
- Two fixes the change needed: phones show the chart's column headers in
  normal case (12px capitals pushed Plays off the right edge), and the
  active tab's equalizer bars got a 7px gap (the old tracking had hidden
  an overlap with the last letter).

Left out on purpose:
- **The "of the moment" spotlight cards** (approved as they are, see 4.7)
  and **the masthead and wordmark** (phase 5 replaces them).
- **Text inside small fixed-size graphics** keeps its old size: heatmap
  axis labels, calendar cells, the back of small Mosaic tiles, the count
  badges on the player buttons, chart-run boxes, initials inside covers,
  and icons sized with `font-size`. 12px doesn't fit in them; they get
  looked at with their components (phase 8/9).
- **Share-card images** (inline styles in app.js). They are fixed-pixel
  designs, not page text. The printable chart PDF and the picture-in-picture
  mini player are left the same way.

**Phase 2 recheck (2026-10-12).** A second pass found what the first missed:
- ~63 inline styles in app.js that build on-page text (song/album/artist
  pop-ups, chart-run panels, raw data, filter chips, settings lists, empty
  messages) still had raw sizes down to 9.6px, a few in mono capitals. They
  now use the same nearest-token rule (date tiles in the pop-ups use
  `--fs-sm` so "30 Sep 2026" stays on one line). Icon-only sizes (🗑, ×) kept.
- `style.css`: the Records phone-card labels were 7px, now 12px; the four
  gold ribbons/stickers (landing cards, award poster, Grammy card) moved to
  sans at 12px without capitals or tracking; settings step numbers 12px.
- Checked on screen: landing ribbons, song pop-up, every Records section on
  a 390px phone (no overflow, no page scroll), no JS errors.
- **Words written in capitals in the text itself.** About 80 translation
  keys (×4 languages) and a few strings in app.js are typed in capitals
  ("BEST DAY", "SYNC NOW", "PEAK #", "GOLD", "PLAYS PEAK", "RANK"), so
  removing the CSS uppercase doesn't change them. Changing them to normal
  case is a text change in all four languages. **Still to do**, as its own
  step, and the place to also switch titles to sentence case.

Still on phones: the chart table sticks out 21px past the screen (was 7px
before phase 2, and the table scrolls inside its own box). Portuguese
"reproduções" was already cut off before. Both belong to phase 7's table
restyle.

**Phase 2 (type) and phase 3 (colour).** Smaller than they look on the
chart. The badges, peak tags, tag colours and the red YouTube button are now
hidden for most people, so they no longer set the look of the page. Do them
anyway, because anyone who switches them on still sees them, but check them
with the switches on: a type or colour pass judged on default screenshots
will miss them entirely. Two things phase 3 still owns: the YouTube red is a
raw `#FF0000` (the same red as "dropped"), and the ＋ button's colours.
Also for phase 3: in Red light the "Artist of the moment" label on the
spotlight card is pale pink with a glow on a white card and hard to read.
Check Navy light too, it looked similar. Fix the colour only, the cards
themselves stay as they are.

**Phase 3 (colour). Done 2026-10-12**, on its own branch
(`redesign/phase-3-colour`) so it could be looked at before going live.
Checked on screen in all 10 themes, on a phone, with the Show switches on.
What it did:
- `--raised` added to all 10 themes (plain hex). Light-theme page
  backgrounds are now barely tinted (`#ccdcf0` → `#eef3fa` navy, and the
  same for the other four), also in `privacy.html`, `terms.html` and
  `setup-guide.html`.
- Movement: NEW and RE share one colour (`--chart-re` = `--chart-new`, no
  more violet). In Red and Pink, where the accent is the "down" colour, they
  are neutral (`--text2`).
- The coloured left-edge bars on NEW/RE rows and stack cards are gone, and
  so is the red bar on the now-playing row (it keeps an accent tint).
- Bubbling Under tags: one neutral style (`--raised`, `--text2`, faint
  outline). Only movement words keep colour: Trending/Surging green,
  Fading/Fallen/Freefall red. The 14 per-tag colours and their 14 light-theme
  overrides were deleted.
- The row YouTube button and the stack ▶ are neutral (`--raised`), with no
  scale pop on hover. "Playing" uses the accent. The ＋ uses the same fill, so
  the pair matches. Play-all buttons in the BU track list and calendar
  use the accent instead of YouTube red.
- "Artist of the moment" on light themes: deeper rose middle stop, no glow.
- Ratings score distribution: every bar in the accent (was one colour per
  score band).
- Six white hover washes (`rgba(255,255,255,…)`) that vanished on light
  themes now use `--hover` / `--raised`.

- **Stat tiles (4.6), your choice:** 8 tiles → 4 (2×2 on phones). The old
  second row became small stats under a divider in each tile: "+118 / new
  songs" and "27% / of the total" on Songs, "+12 / new artists", "+43 / new
  albums", and "261 / best day" + "Sep 11 / Thursday" on Total Plays.
  One-colour big numbers were tried and rejected as too plain, so the
  numbers keep their tile colours. Songs and Artists moved off green/red
  (they read as up/down) to violet and silver, your pick from rendered
  options (magenta was tried first and looked too close to violet); Total Plays stays blue on Purple too, as on Red and Pink. The "new" line still jumps to its
  section; its change vs. last period and record badge are in its tooltip.
  `#statsStrip2` stays in the page but is always hidden; its old
  `.stat-chip` / `bestday` / `new-*` CSS is left for phase 11.

Left out on purpose:
- **The YouTube player and queue** keep YouTube red. It's the player's own
  branding, not chart content.
- **The ON AIR / streak banner's left bars** go with phase 5, which merges
  those two banners.
- **The remaining ~150 `rgba(255,255,255,…)`** are mostly on photos, dark
  overlays or the masthead, where white is right. Phase 8 looks at them
  with each component.
- **The #1–#3 row tints** (gold/silver/bronze) are phase 7's #1 row.

**The screenshot script's "Yellow dark" was really navy** in phases 1–2: it
passed `yellow-dark`, but the theme is called `yellow` (`applyTheme('yellow')`;
only navy uses the `-dark` suffix). Phase 3 was checked in the real Yellow.

**Phase 5 (shell). In progress on branch `redesign/phase-5-shell`, one step per commit.**
- **Step 1 ✓ (2026-10-13): slim top bar.** The masthead (est. line, big
  wordmark, tagline, "Streaming since") is gone from the app; a 56px sticky
  bar holds the small wordmark (click = Weekly), What's New, Sync, Add Play,
  Settings, Theme, Language and the account (Sign in, or the profile picture
  with a Sign out menu). Buttons kept their ids and handlers. The five
  all-time stats moved to the All-Time tab only (`body[data-view]`, set from
  the active tab). The date bar, Records table headers and the Guide's
  contents row now stick under the bar (`--topbar-h`). Deleted with it: ~100
  masthead / `.theme-toggle` / per-theme masthead and hero-strip rules, the
  sync bar's button rules, and the phone auto-hide JS for the old fixed
  control stack. Left for phase 11: the `masthead_est` /
  `masthead_streaming` translation keys (their code is guarded and now finds
  no element). The sync bar still shows the status line until step 4.
  **Auto-hide (your request, 2026-10-13):** the bar slides up after 3s of
  no scrolling and comes back on scroll or with the mouse at the top edge.
  It stays at the top of the page, with a menu open, under the pointer or
  with keyboard focus. Sticky rows follow it through `--topbar-offset`
  (0 while `body.topbar-idle`).
- **Step 2 ✓ (2026-10-13): main tabs.** Charts · Stats · Records · Awards ·
  Soundtrack · More (Events, Playlists, Raw Data, Board, Charts Guide) in the
  top bar; below 960px a bottom tab bar (Charts, Stats, Records, Awards,
  More, with Soundtrack inside More) that slides away with the top bar.
  961–1100px is a compact bar (What's New shows its count, no language code).
  The new tabs only click the old `#periodNav` buttons (`data-go`,
  `dcGoTab()`), so view switching, `#t=` links, number-key shortcuts and the
  tour all still go through one path; "Charts" reopens the last chart period
  (`dc_last_chart_period`). `#periodNav` now shows only Week / Month / Year /
  All-time and only on chart views. Shortcuts moved into tab tooltips.
  Deleted: the "Chart Views" eyebrow, More/Less toggle, hover preview card,
  new-content corner dots, shortcut number chips, the phone reflow and
  shrink-on-scroll JS and their CSS. Back-to-top, toasts, the mini player and
  the tour panel sit above the phone tab bar (`--bottomnav-space`).
  **Found, not caused by this:** between ~600 and 980px wide the page is
  980px wide and scrolls sideways (`html { min-width: min-content }` plus a
  980px-wide child), on main too. Worth its own fix.
- **Step 3 ✓ (2026-10-13): period switch on the date line.** `#periodNav`
  moved inside `#dateNav` and is a segmented control (Weekly · Monthly ·
  Yearly · All-Time, no icons); the date is one line ("This Week · 11 Oct
  2026 – 17 Oct 2026 ▾") at `--fs-lg`, still opening the picker. Desktop bar
  52px, phone two lines (~100px). The keyboard/swipe hint is hidden
  (`#navHint` stays in the DOM because ~10 view branches set its display;
  phase 11 can remove it with them). All-Time hides the arrows and ▾.
- **Step 4 ✓ (2026-10-13): toasts.** The sync strip (`#syncBar`) is gone;
  `#syncStatus` now lives in `#syncToast`, top right under the top bar
  (bottom centre above the tab bar on phones). `setSyncStatus(msg, cls,
  {toast})` pops it for errors (stay until closed), the first status of a
  visit, a press of Sync, flagged one-offs (auto-correct results, file
  loaded) and while already on screen; background auto-syncs only update the
  Sync button tooltip. Successes fade after 4.5s, hover holds. Deleted: the
  strip's CSS, the auto-correct "dismiss restores previous status" code,
  `_lastSyncStatusCls`. Also fixed: Sync with a CSV file as the source used
  to report "No Google Sheet configured"; it now says what is loaded and how
  to update it (`sync_file_nothing`, 4 langs).
- Steps left: 5 ON AIR + streak strip, 6 other tabs start at the top and the
  phone scroll-to-top button.

The period picker does not need moving into one place:
it already is (see 4.4). What is left is making it slim enough to live in
the top bar.

**Phase 6 (Weekly page).** The Bubbling Under legend is off by default,
so the "legend in a ⓘ" part of 3.8 is less urgent, though the coloured tags
on the rows themselves are still there and still need 3.8.

**Phase 7 (layouts and the action menu): now more urgent.** With YouTube
off, a table row has no play button by default, so the "one action set"
(▶ on hover, ⋮ per row, right-click) is now how most people will play
anything from a chart. Do the action set first within phase 7. Also:
- **The table on a phone is broken up:** the "Prev" header has its own
  underline that doesn't match the rest, and each row's background is split
  into pieces instead of one strip. Fix it with the table restyle.
- **The drawer becomes the main way to see detail**, because the face of
  every layout is now the clean version. Design it for people who never open
  ⋮ → Show.
- **Show switches have to reach the drawer too** (4.9b rule 5): a switch that
  is off should hide its feature on the face, but think about whether the
  drawer shows everything regardless. That is the likely right answer now
  (the drawer is where you go *for* detail), and it should be decided before
  building it.
- **Moving the layout buttons into the toolbar (4.9) changes the ⋮ menu.**
  The tour walks that menu by position (`button:nth-child(1…8)` in the Show
  tab, and the View tab's `.weekly-view-btns`). Update `_cgTourSteps` in the
  same commit, or the tour rings the wrong rows or nothing.

**Phase 8 (shared components).** The Show menu's rows now include
"Playlist", and the YouTube/＋ pair has its own sizing rule
(`.yt-play-btn:has(+ .dc-pl-add-btn…)` in `style.css`, plus an icon-only
version of it for phones). When the shared button replaces `yt-play-btn`,
delete those rules with it.

**Phase 9 (Records, Stats, etc.).** Not affected: the Show switches only
cover the three Weekly-style charts (Songs, Artists, Albums) and their
Bubbling Under / Off the Chart / New Entries sections. Records and the rest
draw their own badges and ignore them. Decide per view whether they should
follow the same "clean by default" rule.

**The Charts Guide tour (new dependency).** Since phase 1, the tour depends
on the Show switches: it turns them all on while it runs and names each one
in its text ("switch on YouTube in the chart's ⋮ menu, under Show"). Any
phase that renames, adds, removes or moves a switch, or moves the ⋮ menu,
must update the tour text and selectors in the same commit. **The tour is
English only** (its text is not in `translations.js`). That breaks the
four-languages rule in section 2 and predates this redesign. Worth its own
small task.

**Checked on screen (2026-10-11).** Phase 1 was looked at in all four
check themes and on a phone, with the switches off and with them all on.
Nothing it changed was broken. Two problems showed up with the switches on,
both fixed right away:
- On a phone the ＋ dropped below the YouTube button, because the title
  column is only ~85px wide. YouTube now shows just its icon on phones, so
  the pair stays on one line.
- A badge that wrapped onto its own line (long title, or a phone) started a
  few pixels in from the title. The title and its badges are now one
  wrapping row with a gap, so a wrapped badge lines up with the title.

Three older problems were found and handed to later phases (each is also
noted under its phase): the hard-to-read "Artist of the moment" label in
Red light (phase 3), the broken-up table rows on a phone (phase 7) and the
scroll-to-top button over the plays column (phase 5).

**Still to check:** Portuguese and reduced motion.

### Taking screenshots that don't mislead

Learned in phase 1: the date bar is `position: sticky`, so **scroll-and-stitch
screenshot tools** (most "full page" browser extensions) draw it twice or
leave a gap where it belongs. Use one of these instead:
- Chrome DevTools → ⋮ → Run command → "Capture full size screenshot", which
  renders the page in one go without scrolling.
- Playwright `page.screenshot(full_page=True)` (how the gap and the picker
  were checked), loading a sample CSV through the data-source window's file
  upload (`openSourceModal()`, then `#srcFileInput`; the landing page's own
  file box does not keep the data). Then "Continue to charts" and skip the
  welcome window.
  Step back one week from "This week" first: a sample file rarely has plays
  in the current week, and an empty chart hides most of the page.
- Or normal screen-sized screenshots, scrolled by hand.

### Delete as you go

When a phase moves the **last** user of an old class, function or element
onto its replacement, delete the old one **in that same commit**. Examples:
when phase 8 points the last `graphs-btn` at the shared button, the
`graphs-btn` rules go; when phase 7's single item builder draws all six
layouts, the old per-layout code it replaced goes; when phase 5's top bar
replaces the masthead and sync strip in the app view, their markup and rules
go (the landing page keeps only what it still uses).

- **Only delete what is provably unused.** Search the HTML, CSS and JS
  (including class names built up in JavaScript strings) before removing
  anything. If unsure, leave it for phase 11.
- **The deletion belongs to the phase that made it unused**, so undoing that
  one commit brings the old code back with the old behaviour.
- Note in the commit message what was removed, so phase 11 knows what is
  already done.

Without this, phases 1–10 only add code, the 35,000-line stylesheet grows
before it shrinks, and by phase 11 nobody can tell which old rules are still
quietly winning somewhere. Phase 11 is then a sweep for leftovers, not the
whole clean-up.

### How to check each phase

There is no automated check for looks. For each phase:
1. Take before/after screenshots (made as described just above, not
   scroll-stitched) of the Weekly page in the four check themes
   (Navy dark, Navy light, Yellow dark, Red light) and at phone width
   (375px). Once per phase, check all 10 themes side by side.
   For the layouts phase: switch through all six layouts and confirm that
   every feature in the 4.9b table is reachable in each one.
2. Switch the language to Portuguese and check nothing wraps badly or is cut off.
3. Turn on "reduce motion" in the OS and check nothing still auto-scrolls.

### Risks

- **The stylesheet is 35,000 lines with 141 `!important`s.** Changing a token
  can have side effects in places you didn't look. Do one phase per commit so
  any one can be undone.
- **10 themes × 4 languages × desktop/phone** is a lot of combinations.
  Check the three above every time and the rest once per phase.
- **Don't start with the clean-up (phase 11).** Deleting CSS before the new
  design exists makes it impossible to tell what broke. Delete old code only
  once its replacement is in and working (see "Delete as you go"), and leave
  the sweep for last.

---

## 6. Still to look at

Send screenshots of these and they'll be added the same way:

- Records → Certifications, Streaks, New Charts
- Events (and its calendar)
- Awards (My Grammys, Real-Life Awards, the ceremony screen)
- Your Soundtrack
- Playlists, Board, Charts Guide
- A song, an artist and an album pop-up
- One share-as-image window
- Settings (all three tabs)
- The landing page (signed out)
- **Any page on a phone.** The most useful one still missing.
