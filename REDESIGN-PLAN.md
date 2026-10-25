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

**Updated 2026-10-18 (evening):** phase 7 steps 1–7 are on `main` and live.
Work since the last update (about 60 commits, up to `f6a5d8c`) is written up
under phase 7: part of step 10 is already done (Bubbling Under / Off the
Chart rows and the BU chart run panel), the columns can all be resized, and
the details panel got a compact toolbar. Work outside the phases (the Daily
tab, 164 streak badges, Soundtrack) and what it means for the plan is in
"Done outside the phases" at the end of section 5, with three small things
to fix. Next is still step 8.

**Updated 2026-10-19:** step 8 Stack is done, merged to `main` and pushed;
Card grid is done, merged to `main` and pushed; Filmstrip and Mosaic are
done on the branch (not merged yet), so **step 8 is finished**; next is
step 9.

**Updated 2026-10-20:** step 9 (slimmer rows from #11) skipped after you
saw a mockup; step 10 (the Around the chart box) done the same day; next is
step 11.

**Seen on screen:**
- Weekly: Albums and Songs, in all six chart layouts (Table, Card grid,
  Compact, Mosaic, Filmstrip, Stack)
- Monthly Artists, Yearly Songs, All-Time Songs
- Raw Data, Graphs
- Records: Overview, All #1s, Perfect All Kill, Appearances, Debuts, Most
  Plays, Milestones, Fastest
- Events (2026-10-23)

**Not seen yet (judged from the code only):** Records → Certifications,
Streaks, New Charts; Awards; Soundtrack; Playlists; Board; Charts
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
   - a **▶ sample button** visible on hover (on phones, always visible).
     **Decided 2026-10-14:** it plays a **30-second store sample** (iTunes,
     then Deezer, the same lookup as the awards ♪ button,
     `_ceremonyPreviewTakes`), **not** the YouTube player. Samples are free
     and don't use the site's shared YouTube search allowance (about 100 new
     songs a day for everyone, see the `ytCache` search memory). The sample is
     personal: an **artist** plays the song the user **last played** by them,
     and an **album** plays the user's **most played song from it in the
     chart's period** (that week, month or year; all-time history if the
     period somehow has none). The artist's last-played song comes from the
     whole history. Both work for Last.fm, Sheets and CSV alike. The lookup
     runs on the click, never on render (see the perf note on repeated scans):
     an artist stops at the first few songs in the newest-first history, an
     album makes one pass over the period's plays. If a
     store has no sample for that song, try the next most recent or next most
     played song (a few at most), then fall back to the store's top song or
     first track. Data without album names falls back the same way. A second
     click stops it. Starting a sample pauses the player, and only one sample
     plays at a time. If neither store has a sample, the button dims and
     points to ⋮. Full plays on YouTube (play now, next, queue, similar) stay
     in the ⋮ menu and right-click menu.
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

### 4.16 Events. Seen on screen (2026-10-23)

**Now:** a calendar (Month / Week / Day, opens on Day), then the Time
Machine, then 9 sections (Artist Birthdays, Anniversaries, Upcoming
Releases, Recent Releases, Recent Birthdays, Recent Anniversaries, New Music
Friday, Upcoming Shows), **each with its own Reel/Tiles/Table/List switch**.
What the screen shows:
- **The Day view is a wall:** about 60 rows (~2,800px) before anything
  else, nearly all anniversaries (top 200 artists × 30 days = 973). Nothing
  is ranked, so a remix single weighs the same as a 10th anniversary of an
  album you love.
- **Everything shows twice:** today's anniversaries, birthdays and upcoming
  releases are in the calendar and again in their own reels.
- **Dates are a day off after midnight (bug):** the 24-hour cache
  (`EVENTS_CACHE_TTL`) stores "in N days", not the date, so the next day
  every birthday and anniversary slides one day later (tobyMac's 22 Oct
  birthday showed under Friday 23 Oct as "Turning 62").
- **Every section repeats the same controls:** − / +, "＋ Playlist", the
  view switch, a divider. Three Refresh buttons, plus Play All / Create /
  Export in the calendar header.
- **Collapsed sections are still full cards** saying "collapsed — click +
  to expand". New Music Friday showed "0 releases" and has its own
  Calendar view inside the page's calendar.
- **Mixed languages:** MÁQUINA DEL TIEMPO, "+ Lista", Sencillo, Álbum next
  to Events Calendar, Artist Birthdays, TODAY, "in 2 days", Turning 62.
  Most of the page's text is hard-coded English.
- **Leftovers:** emoji in the type chips and titles (3.5), a coloured left
  bar and blue tint on every calendar row (phase 3 removed these
  elsewhere), mono uppercase "TODAY", the status line ("973 anniversaries
  · … (cached)") shown as content (3.6).
- **Reels start with the first card cut off:** the left fade is on before
  you scroll.

**Fix (decided 2026-10-23):**
- **Four tabs: Today · Coming up · Recent · Calendar.**
- **Today** replaces the Day wall: today's birthdays, releases and shows
  first, then anniversaries **ranked by your plays and capped at about 8**
  (round ones — 5th, 10th, 20th… — first), with "Show all". The **Time
  Machine sits under Today** as "On this day in past years" (try it there;
  it can become its own tab if it doesn't fit).
- **Coming up** and **Recent**: birthdays, anniversaries, releases, shows
  and New Music Friday in **one list grouped by date** (This week / Later
  this month / Next 3 months, and the same looking back), not five
  sections. Anniversaries ranked and capped as in Today.
- **Calendar**: Month by default, a day opens its list. No row tints or
  left bars.
- **One card style for every event type** (picture, title, artist, small
  type icon, date) and **one Reel / Tiles / Table / List switch for the
  whole page** (all four views stay), not one per section.
- One toolbar: the tabs, type chips with line icons, one ↻ in the corner.
  "Top 200 artists" moves to Settings or a ⋮; the status line goes into an
  ⓘ. One "＋ Playlist" for what's showing, replacing the per-section
  buttons and the calendar's three.

### 4.17 Awards. Seen on screen (2026-10-24)

My Grammys / Real-Life Awards sub-tabs, year arrows, a ceremony mode with
Previous/Next. This is the most "shareable moment" feature after the hero
card, so give it the most polish. Gold here is allowed: this is literally
"earned". The year switch already uses `‹ 2025 ›` (phase 8 step 2d).

**Now** (sample library, 1440 and 390 touch, navy dark; options page for
the choices: https://claude.ai/artifact/Cj637puWWKusfGrTxvbpGk):
- **The ceremony is a box** (~860px) with a category list on the left:
  covers ~100px, the category name in a plain heading, and after the
  envelope opens the winner shows twice (lit up in the grid and again
  large below it). On a phone the category strip runs under the 🔊 / ✕
  buttons and "Open Envelope" is below the fold. On the opening slide
  (Stats & records) the Previous / Start bar sits on top of the list, and
  the Song card's title runs past its right edge.
- **"View Ceremony" only appears at the very bottom**, under every card.
- **Stats & records is ~800px tall** above the ballot: three all-time
  cards (six once there are winners) and a 10-row list with "nominations"
  under every number.
- **Bug: Spotlight view, Best Collaboration:** rows show "173 plays · with
  a DJ/producer" in place of the song name; the note pushes the name out
  and runs past the card.
- **Page title** is a small white "Awards" tag, not the shared Records /
  Stats / Events title.
- **Two toolbar rows** (left-to-decide chip, Hide decided, All / No winner,
  Expand / Collapse, then View on its own row).
- **Ballot cards:** a lowercase "song" / "album" label over each title;
  empty categories are full cards with a dashed "No nominees yet." box;
  "Click a nominee to crown the winner" repeats on every card.
- **Configure Year panel:** each category's name is squeezed into a narrow
  column ("Song of the / Year") by the type badge, ☆ and switch; the
  category list sits in its own scroll box; two rows of filters.
- **Nominee picker:** genre tags stack into tall rows, a "-" chip stands
  in for a missing year, and the last buttons of a row get cut off.
- **Real-Life Awards:** an artist with one nomination gets a tall, mostly
  empty card (the photo sets the height); category names in Title Case
  ("Song Of The Year").
- **English in every language:** "Loading year data…", "Calculating …",
  "Saving…" (awardsGenerateCandidates).

**Fix (decided 2026-10-24):**
- **Ceremony full screen** (option A): the whole screen, a slim top bar
  (year, progress dots, ☰ Categories, 🔊, ✕), the category name big in
  Bricolage, big covers before the envelope, then one large winner with a
  gold glow and the other nominees as a dimmed strip. The category list
  opens from ☰ instead of taking a column. Confetti stays, off with
  reduced motion. Same stage for shared ceremony links (?ceremony=).
- **"View Ceremony" top and bottom** (option B): in the top toolbar next
  to the year with Share, and still under the cards.
- **Stats & records folded closed** (option B): one row with the
  headline numbers and the leader (48 nominations · 6 categories · 24
  artists · most: Tate McRae (7)) and an Open button; open, it is the
  full block as today. Open / closed is remembered on this device.

### 4.18 Your Soundtrack. Seen on screen (2026-10-25)

11 sections (reel, top artists, top songs, activity, loyalty, discoveries,
milestones, artist milestones, streaks, Grammys, underrated gem, replay,
share card). This reads like a "Wrapped" story, so design it as one: a
vertical scroll of full-width chapters, one big fact per chapter, large type,
cover art backgrounds. (The Time Machine moved to Events on 2026-10-14, so
it is no longer part of this.)

**Now** (sample library, 1440 and 390 touch, navy dark; options page:
https://claude.ai/artifact/UJKWiWZXPfF8NAGYMqnXej):
- About 6,100px tall on desktop, 8,200px on a phone, in 16 boxes that all
  look the same (small dot title, glow in the corner).
- Title is a small "🎬 Your Soundtrack" label; the year arrows ◄ ► show as
  small odd glyphs.
- Top: year card, five coloured tiles with emoji icons, the reel.
- #1 artist: photo, then 11 tiles of four sizes and three colours.
- Phone: Monthly Activity's play counts run into each other
  ("4,5114,040…"); Still in Rotation is ~1,500px (5 artists × 5 songs in one
  column); streaks ~1,400px (each record a full-width photo).
- Discoveries: a bubble shows as an empty circle until its picture loads.
- Dates written 11/2/2026 in milestones and streaks.
- Grammys, Chart History Replay and Share are three nearly empty boxes at
  the bottom. Emoji everywhere (🔥 on every streak, 🏆 💤 ➡️ chips).

**Fix (decided 2026-10-25):** choice 1 C, choice 2 A, choice 3 A.
- **Chapters + Play as a story** (1C), on every screen size: no boxes;
  each section is a chapter that opens with a headline band (label
  "Chapter N · name", one big sentence with its number, a dim cover
  behind), headline on the left and a short detail on the right on wide
  screens, stacked on a phone; everything the section shows today follows
  under the band. A "Play your 2026" button opens the chapters full screen,
  one headline per screen (tap / click halves, arrow keys, Esc), like the
  Awards ceremony.
- **Chapter 1 keeps the five tiles and the reel** (the tiles still switch
  the reel).
- **#1 artist** (2A): photo band with the name, one big fact (songs in a
  row), the other numbers as small stats under a divider, favourite album
  and song as cover rows.
- **Long parts** (3A): Still in Rotation and the streak records become
  rows you swipe sideways (‹ › on desktop), with small covers instead of
  full photos.

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
| **5** ✓ | **Done 2026-10-13** (branch `redesign/phase-5-shell`, merged into `main`). **Shell:** slim sticky top bar, new main tabs + More, period switch next to the date, toasts for status, merge ON AIR + streak, no masthead or Time Machine on non-chart tabs. | Fixes "can't find anything" and gives back ~1,000px on every tab. | Medium |
| **6** ✓ | **Done 2026-10-14** (branch `redesign/phase-6-weekly`; what changed from this plan is under "Phase 6" below). **Weekly page:** one filter toolbar, sections reordered (stats + "of the moment" → chart → bubbling/off/new → certified → time machine), releases moved to Events, light-touch stat tile changes only if you choose them (4.6). | This is the page everyone sees first. | Medium |
| **7** ✓ | **Done 2026-10-22** (branch `redesign/phase-7-layouts`, on `main`; see "Phase 7" below — step 9 skipped). **Chart table and layouts** (4.9b, 4.10, 4.11, 4.12): one item builder + one action menu + one details drawer so **every layout has every feature** (chart run, peak, plays change, player, playlist…), layouts on every period with paging, all six layouts restyled, buttons moved into the toolbar, short lists capped at 5. | The core of the product. Do the shared builder first, then restyle each layout on top of it. | Large |
| **8** ✓ | **Done 2026-10-22** (branch `redesign/phase-8-components`) (11 steps, see "Phase 8" below). **Shared components:** one button, tab, segmented control, chip, card, table, carousel, pop-up frame. Replace the per-feature button families. | Makes 9–10 fast and keeps it consistent. | Large |
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

**Phase 5 (shell). Built on branch `redesign/phase-5-shell`, one step per commit; merged into `main`.**
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
- **Step 5 ✓ (2026-10-13): ON AIR + streak = one "now strip".** Picked from
  six drawn layouts (artifact "ON AIR + Streak Options"): **desktop = option
  D**, one row read as a story: 🔥 count / type · subject / nested album,
  then the covers of the streak's plays (oldest → newest, left edge fades),
  then the lit live cover and the song with ON AIR, timer and chips. With
  nothing playing (also D) the row ends at the last play with "Last played
  2 hours ago". **Phones = option C**: one summary line (cover, eq, song —
  artist, 🔥 pill, ▾) that opens into the full card; open/closed is
  remembered (`dc_nowstrip_open`). Built as `#nowStrip` around the existing
  `#streakBanner` / `#nowPlayingBar` (display:contents on desktop);
  `dcSyncNowStrip()` shows/hides it. Height ~107px live / ~81px idle (was
  ~190px). Streak labels are now translated (`ns_*`, 4 langs). Deleted: all
  `.np-*` / `.streak-banner*` / `.streak-art*` / `.streak-mini*` CSS (96
  rules) and 11 keyframes nothing used any more.
- **Step 6 ✓ (2026-10-13): other tabs start at the top.** Outside the four
  chart periods, `#nowStrip`, `#timeMachineSection` and the empty sticky
  date bar are hidden (`body[data-view]`), and Soundtrack / Board / Guide
  (which sit after `#mainApp`) lose its empty padding: every tab's content
  now starts ~100px down (was 250–640px). Scroll-to-top on phones moved into
  the bottom tab bar: a screen down, the current tab's icon becomes ↑ and
  tapping it scrolls up; the floating `#backToTop` is hidden below 960px
  (it covered the plays column). Clicking the active tab scrolls to the top
  on desktop too; the floating button stays there.

**Phase 5 done (2026-10-13)** on `redesign/phase-5-shell`, and merged into
`main` (the branch has nothing `main` lacks). Checked on screen with phase 6
step 5 (2026-10-14), see below.

**Phase 6 (Weekly page). Built on branch `redesign/phase-6-weekly`, one step per commit.**
Decided with you (2026-10-14), replacing parts of the phase 6 row above:
the release reels are removed, not moved (Events already has them); the
Time Machine moves to the Soundtrack tab only; Certified and the Time
Machine keep auto-scrolling; the layout buttons stay in ⋮ until phase 7;
the Chart / Bubbling Under / Off the Chart / New Entries pills become four
switches in ⋮ → Show. Steps: 1 releases off the chart page, 2 Certified
below the chart sections, 3 Time Machine to Soundtrack, 4 one toolbar +
the pills into ⋮ → Show, 5 screen check (also covers phase 5).
- **Step 1 ✓ (2026-10-14): release reels off the chart page.** The
  Upcoming / Recent Releases sections at the bottom of Weekly and Monthly
  are gone, with their loaders (they searched the Top 200 on every visit),
  their two Settings → Chart page sections switches, their tour stop and
  14 translation keys. The Events tab's own sections are unchanged; their
  cards open the same menus in every view (checked: Recent = Spotify,
  playlist, last 10 songs, Google; Upcoming = Spotify, Google). Events
  searches the Top 50 by default (Settings), so it can list fewer than the
  chart page did. **The Playlists tab** used to show the chart-page Recent
  Releases reel; it now shows the Events tab's (and loads Events data
  itself, which also fills its Anniversaries reel without a visit to
  Events first). The old `mbUpcomingCache` / `mbRecentCache` storage is
  cleared on load.
- **Step 2 ✓ (2026-10-14): Certified below the charts.** `#certReelSection`
  moved from between the stat tiles and the chart to after the chart
  groups, so it follows Bubbling Under / Off the Chart / New Entries on
  Weekly and Monthly. Unchanged otherwise (still auto-scrolls, same
  Settings switch). The tour's Certified stop moved to the end of the
  Weekly walkthrough to match. Checked on desktop and at 390px.
- **Step 3 ✓ (2026-10-14): Time Machine on the Events tab only.** First
  tried at the bottom of Your Soundtrack; you felt it was out of place
  there (it is about today, while Soundtrack follows the period you pick),
  so it moved again, the same day, to Events, which is already about
  dates. `#timeMachineSection` is now the first section in `#eventsView`
  (under the calendar, above Artist Birthdays), so that tab's visibility
  decides whether it shows. The Events branch of the period switch renders
  it; `renderAll()` only does when a sync lands while Events is open. It
  remembers being collapsed like the other Events sections. Unchanged:
  auto-scroll, Songs / Artists / Albums, ＋ Playlist, the all-off empty
  state, and its Settings switch (note now says "On the Events tab", 4
  langs). The Playlists tab's Events mode does not show it. Removed: the
  per-tab show/hide lines (Awards, Soundtrack, Playlists, Board), the
  `tmHiddenView` guard in `renderTimeMachine()`, and `#timeMachineSection`
  in the phase 5 "other tabs start at the top" rule. The Charts Guide said
  it was on Playlists (not true since phase 5); it and the tour's Events
  step now say Events. The switch still sits under Settings → "Chart page
  sections", which no longer quite fits; phase 10 (Settings) can regroup
  it.
- **Step 4 ✓ (2026-10-14): one toolbar, sub-charts in ⋮ → Show.** The four
  rows above the chart are now one: `#chartTypeToggleBar` holds Songs ·
  Artists · Albums as a segmented control (same look as the period switch;
  three equal segments on a phone) and, on its right, the album bucket
  filter (`#albumsFilterBar`, moved out of the albums group, shown only on
  the albums chart and only once a type is set apart; restyled as a small
  segmented control, not the dropdown 4.9 suggested). The Chart / Bubbling
  Under / Off the Chart / New Entries pills became a "Sections" group at
  the end of each chart's ⋮ → Show (`#subChartRows-<type>`, after the eight
  row switches so the tour's `nth-child` stops still ring the same rows).
  Saved choices carry over (same `dc_subChartToggles`). Rows that do not
  exist in a period hide (Monthly/Yearly: no Bubbling Under / Off; All-Time
  keeps only Chart, so a chart switched off elsewhere can still come back).
  **Chart off keeps the header** (your call): `sub-chart-rows-off` hides
  everything but the title bar and ⋮, with "Chart hidden · switch it back on
  in ⋮ → Show" (4 langs; on a phone on its own line). The Show panel grew
  to fit the group (`min(480px, 70vh)` instead of a 280px scroll). Removed:
  Collapse All (markup, `toggleCollapseAllCharts`, `syncCollapseAllBtn` and
  its calls, `_isEverythingCollapsed`, its CSS and 4 keys × 4 langs), the
  three pill rows and their CSS, and every per-tab line that showed or hid
  them. Each section still collapses on its own. Tour: the chart-type stop
  rings only the three segments and says where the sections went; the ⋮
  walk adds a stop on the Sections group.
- **Step 5 ✓ (2026-10-14): checked on screen, phases 5 and 6 together.**
  Playwright on a real library (217k plays), week of 27 Sep 2026.
  Desktop in Navy dark, Navy light, Yellow dark (`applyTheme('yellow')`)
  and Red light: top bar with a toast, now strip, period bar, stat tiles,
  toolbar, ⋮ → Show with the Sections group, Chart off, Bubbling Under /
  Off / New, Certified, Events with the Time Machine, Records starting at
  the top. Phone (390px) in Navy dark and Red light. pt-BR and pt-PT on
  desktop and phone. Reduced motion. Results:
  - Nothing broken. No JavaScript errors in any run. The page never
    scrolls sideways at 390px (the 600–980px sideways scroll from phase 5
    step 2 is a different width and still open).
  - Contrast, measured (text on its real background, 4.5:1 needed): the
    toolbar and period segments, date label, Sections label and rows,
    "Chart hidden" note, top bar tabs and Time Machine title/sub all pass
    in all four themes. Lowest: the selected segment in Navy dark, 4.8.
  - Portuguese fits: "Músicas / Artistas / Álbuns", "Seções" / "Secções",
    and the pt-PT "Chart hidden" note wraps onto its own line on a phone.
  - Reduced motion: Certified and the Time Machine stay still (both still
    drag).
  - A first Yellow screenshot showed the #1 row in pieces with empty
    Previous / Weeks cells; it was the load animation mid-way, and a shot
    a moment later was whole.
  Found, older than phase 6, left for later:
  - Red light: the Bubbling Under section has a red bar down its left
    edge, the "down" colour (phase 3 removed these from rows, not from
    this section). **Fixed 2026-10-14 ahead of phase 7:** the light themes
    now draw one neutral `--border` all round instead of `--border2` on the
    left. Phase 7 (4.11) still restyles these sections.
  - Portuguese: the New Entries table's column headers stay English
    ("Title · Artist", "Plays"). **Wording settled 2026-10-14:** "repros"
    is gone. Portuguese now says "play / plays" everywhere, and Spanish
    short labels say "reprod / reprods" (sentences keep "reproducciones").
  - **On a phone the Songs table is wider than its card** (390px, every
    language, English included): the right edge clips the plays column
    ("18 reprod…", header "Re…"). The wording was not the cause. Fix it
    with the phase 7 table restyle.
  - The ⋮ menu's tabs (Show / Size / View / Actions) are English in every
    language; the "Chart hidden" note says "⋮ → Show" to match. Phase 8.
  - On a phone the open ⋮ menu runs under the bottom tab bar; the page
    scrolls to reach it. Phase 8 (one pop-up frame).

**Phase 6 done (2026-10-14)** on `redesign/phase-6-weekly`, and merged into `main` the same day.

**Phase 7 (chart table and layouts). Built on branch `redesign/phase-7-layouts`, one step per commit.**
Decided with you (2026-10-14): the drawer shows everything whatever the
Show switches say; the tour is updated in the same commit that moves the
layout buttons; the ▶ on hover plays a 30-second store sample, not YouTube
(4.9b point 2): artist → the song last played by them, album → its most
played song in the chart's period. Steps: 1 one action menu (▶ sample, ⋮,
right-click) in all six layouts, 2 one item builder, 3 details drawer,
4 Show switches done once, 5 layout buttons into the toolbar (+ tour),
6 every layout on every period with paging, 7 Table restyle (4.10), 8 the
other five layouts (one commit each), 9 shorter long charts (4.12),
10 Bubbling Under / Off the Chart / New Entries (4.11), 11 one rank-change
animation, 12 screen check.
- **Step 1 ✓ (2026-10-14): one action menu.** One module in app.js
  (`_eaAttrs`, `_eaSampleBtn`, `_eaMoreBtn`, `_eaOpenMenu`, `_eaPlaySample`)
  serves all six layouts and Songs / Artists / Albums: the entry element
  carries `data-ea-*` attributes and document-level listeners do the rest,
  so a layout only places the two buttons. ▶ plays a store sample through
  the ceremony's single audio slot and pauses the player. **▶ and ⋮ sit
  together (`_eaBtns`), never on the artwork** (you found ▶ on the cover
  got in the way of the ✎ picture button, and on phones covered the art):
  before the chart-run icon in the Table, at the row's end in Compact and
  Stack, next to the plays in Card grid and Filmstrip, on the hover card /
  back in Mosaic. **On touch screens there is no ▶: tapping the cover
  (`.ea-cover`) plays the sample**, holding it still opens the picture
  picker, and a small badge on the cover shows the sample playing. Mosaic
  keeps ▶ on the tile's back (a tap flips the tile). On phones ⋮ replaces
  the Table's chart-run icon (Chart run is in the menu), so the row is no
  wider than before. The ⋮ menu starts with the sample too ("Play a
  30-second sample", "Stop the sample" while it plays), and its first
  YouTube item says so: "Play the video (YouTube)". **Teaching it:** on
  touch screens a one-time bubble under the first cover that scrolls into
  view says "Tap a cover to hear a 30-second sample. Hold it to change the
  picture." (`_eaHintSoon`, gone for good on "Got it" or the first cover
  tap, `dc_ea_cover_hint_seen`; it waits out the welcome gate and the
  tour). The tour's Weekly walkthrough has a new phase after "The chart
  itself" that rings a row's cover and ▶ ⋮ pair and explains both, for
  mouse and touch.
- **Step 2 ✓ (2026-10-14): one item builder.** `_chartItem(type, item, i,
  ctx)` works out everything about an entry once: key, movement (`move`,
  `moveDiff`, `prevRank`, the chip `mvHtml`, `barCls`), peak, weeks,
  all-time plays and certification (`certHtml`, by release type for
  albums), rating, plays peak, change in plays (`deltaHtml`), a song's
  album key and album certification, song / track counts, artwork key and
  the action attributes (`ea`). The three Table renderers call it directly;
  the other five layouts go through `_wvItem`, now a thin wrapper that also
  queues the artwork. `_wvMv` is gone. Which facts each layout shows hasn't
  changed (that's step 4). Checked by dumping every layout's HTML (six
  layouts × three types on Weekly, the Table on Monthly / Yearly /
  All-Time) before and after: identical, apart from an artwork-sampled
  glow colour that varies run to run. One real fix: Mosaic and Filmstrip
  certified every album on the album ladder; they now use its release type
  (single / EP / album), like the Table.
- **Step 3 ✓ (2026-10-14): the details drawer.** `_drawerHTML` / `_drToggle`
  in app.js. Numbers for this period only (previous rank + movement, plays +
  change, certification, personal best, score): peak, weeks on chart and
  total plays are left to the chart run's own tiles right below, not
  repeated (you spotted the duplicates). Links (a song's
  album + certification and artists; an album's artists and tracks played;
  an artist's songs played), five buttons (sample, play the video, add to a
  playlist, More details = the pop-up, search YouTube) and the chart run.
  It shows everything whatever ⋮ → Show hides (CSS beats those switches'
  !important rules under the section id). Facts come from `_chartFacts`,
  filled by `_chartItem` as the chart is drawn. **Where:** Table → the
  entry's chart-run row (a row click or the chart-run icon; several rows can
  be open, as chart runs could); Compact / Stack → inside the entry; Card
  grid → across the grid after the entry's visual row; Filmstrip → under the
  strip; Mosaic → under the tiles, from a new "All details" button on the
  tile's back (a tile click still flips it). One drawer per chart otherwise.
  **Replaced:** Compact's accordion shelf, Filmstrip's card expand and
  Stack's chart-run shelf (their CSS is gone); a Table artist / album row
  click and a Yearly / All-Time song row click used to open the pop-up, now
  the title does that and the row opens the drawer. Card grid and Compact
  entries are now focusable; Enter opens the drawer in Stack. Checked with
  real clicks in all six layouts, Songs / Artists / Albums tables, phone.
  **Then merged into the chart run (your call: one improved section, not a
  second one).** The details panel *is* the chart-run panel now:
  `buildCrPanelHTML(type, key, f)` with the entry's facts puts its links and
  actions on top (`_crEntryHTML`, with the ✕) and this period's figures
  first in the run's own row of tiles (`_crNowTiles`, tinted). The Table's
  run row is built that way at render, so opening it is just showing the
  row; the other layouts' drawer is a bare wrapper around the same panel.
  Every chart-run tile now says what it counts on top with the figure below
  (`crTile`): Last week, Plays this week, Certified, Personal best, Your
  score, Weeks on chart, Total plays, Peak, Weeks at #1 / in Top 5 / in Top
  10 (Months / Years on Monthly / Yearly). That also changes the tiles on the
  song / album pages. Fixed on the way: the Range buttons only redrew runs
  in Table rows, so they did nothing in the drawer. The menu replaces `_wvGridCtx`. Play now /
  next / queue on an artist or album plays the song the sample picks, and
  "Pick a song…" opens the old last-10 picker. Chart run toggles the
  Table's run row; elsewhere it opens the details pop-up (the drawer
  replaces that in step 3). **Also changed to cut YouTube use:** a Card grid
  click opens the details instead of playing, and Stack's P key and
  swipe-right play the sample. The old per-layout YouTube ▶ buttons and
  their CSS are gone; the Table's YouTube button (Show switch, off by
  default) stays until step 4. Bubbling Under / Off the Chart / New Entries
  rows don't have the menu yet (step 10). Checked with real clicks: every
  layout's ⋮ and right-click, the Table's chart run, song / artist / album
  samples (artist = last played, album = most played this week), no
  YouTube searches sent, phone menu and width (the phone table is still
  8px wider than its card, as before; step 7).
- **Step 4 ✓ (2026-10-17): Show switches done once.** The hiding side was
  already one rule per feature per section (a body class + one CSS rule on
  the badge's own class), so it reached every layout. The gap was what each
  layout *drew*: Card grid, Compact and Stack drew the peak tag only on Songs
  and no album certifications, Filmstrip drew no badges at all, and the
  personal-best badge was Table-only. Now every layout draws every
  switchable badge (peak, certification, score, personal best, ＋) for Songs,
  Artists and Albums, with the same class, so the switches alone decide.
  Placement: Card grid puts personal best on the cover's top-right corner;
  Filmstrip has one centred badge line under the artist (its unused cover
  overlays are gone); Compact, Stack and Mosaic add it beside the others.
  Outside the Table the badge is inline and peak-tag sized
  (`.weekly-alt-view .plays-peak-badge`). **The YouTube switch is removed
  (your call):** rows play YouTube from ⋮ / right-click. Its three menu rows,
  `yt-btns` config, CSS, the phone YouTube/＋ pair rule, the label key and
  the BU tooltip keys are gone (4 langs). To leave no row without a play
  control, Yearly / All-Time rows (`renderPage`) now go through
  `_chartItem` and get ▶ ⋮, right-click and the details panel like Weekly,
  and Bubbling Under / Off the Chart / New Entries rows got ▶ ⋮ where their
  YouTube button was (step 10 still restyles those). Play all / Shuffle /
  Play similar read the rows' entry data (`_ytChartRows`) instead of the
  hidden buttons. Tour: the Show walk has seven row stops, and "Reading a
  chart row" explains ▶ / ⋮ instead of the red button. Checked with
  Playwright: every layout × type with the switches off (nothing visible)
  and on (every badge visible), fake scores for the score switch, phone
  width, Yearly / BU menus with real clicks, no JS errors. **Found, older
  than this step, for step 8:** on a phone, Compact squeezes the title to
  one letter and Stack cuts badges off at the end of the title line (main
  looks the same).
- **Step 5 ✓ (2026-10-17): layout buttons in the toolbar.** The six layouts
  left each chart's ⋮ → View (the tab is gone; ⋮ is now Show / Size /
  Actions) for one row of icon buttons on the right of the chart toolbar
  (`#chartLayoutBar`, after the album filter), same chrome as the Songs ·
  Artists · Albums switch, each named by its tooltip and aria-label (4
  langs, `layout_*`). The row acts on the chart on screen: switching Songs /
  Artists / Albums lights that chart's own saved layout (still kept per
  type, same `dc_weekly_chart_view_<type>` keys). `syncChartLayoutBar()`
  keeps it in step, called from `applyChartTypeView` and
  `applyWeeklyChartView`; `setWeeklyChartView(mode)` defaults to
  `chartTypeView`. Stack's two-column button is the row's last icon, after
  a thin divider, only while Stack is on. Weekly only, as before (step 6).
  On a phone the row sits right-aligned under the three type segments.
  Tour: a new phase after the chart-type stop rings the six icons in turn;
  the ⋮ walk lost its View stops and the "View" paragraph. The old
  `.weekly-view-*` CSS (standalone bar and in-menu rows) is gone. Checked
  with real clicks on desktop and phone: each layout, type switching, Stack
  two columns, Monthly hides the row, ⋮ has three tabs, pt-BR tooltips,
  Navy light and Yellow dark, no JS errors.
- **Step 6 ✓ (2026-10-17): every layout on every period, with paging.**
  Daily too (your call; the plan only named Monthly, Yearly and All-Time).
  One data slot per chart, `_wvData[type]` (replacing the Weekly-only
  `_weeklyView*` globals): renderSongs / renderArtists / renderAlbums fill it
  on Daily, Weekly and Monthly (the whole Top N), and `renderPage` fills it
  on Yearly and All-Time with the page on screen, so the five other layouts
  follow the same page bar and the same search box as the Table. Ranks come
  from the full chart (`rankOf` → `_wvIdx`), so page 2 starts at #101 and a
  search result keeps its real rank; each renderer now keeps `i` = rank and
  `j` = place in the list (Mosaic's tile slots, Filmstrip's jump buttons
  and card index, Card grid's animation order use `j`). **Card grid pages
  with "Show more"** (`wvShowMore`, 4 langs): the next 100 cards load under
  the grid with "Showing 200 of 18,012", only the new cards animate, and its
  page bar hides. **Mosaic keeps the page bar** rather than "Show more" as
  4.9b suggested: a treemap re-lays out every tile when tiles are added, so
  the cards you were looking at would jump. Switching layout on Yearly /
  All-Time goes back to page 1. Time on chart in Compact, Stack and Mosaic
  now uses the period's unit (days / weeks / months / years, `_wvRunText`)
  instead of always "weeks"; Compact's and Stack's were English-only and now
  use the translations. An empty period or a search with no hits says so
  instead of leaving the last entries up. Checked in the browser: six
  layouts × Songs / Artists / Albums × all five periods, page 2 ranks in
  Compact and Stack, Show more (100 → 200, #101 after #100), search in
  Filmstrip (ranks kept, "No results"), the details panel from a Yearly
  Compact row, no JS errors.
- **Step 7 ✓ (2026-10-17): Table restyle (4.10).** Your calls first: **last
  period's rank stays visible** under the movement chip (not moved into a
  tooltip); the column is now called **Move** (`th_move`, 4 langs; the
  stacked "PREVIOUS / RANK" header, a flex box with its own out-of-line
  underline, is gone along with the `th_prev*` keys). **Peak stays a tag by
  the title** under its Show switch (no Peak column). **Play bar 3px, still
  coloured by movement.** Done as planned: one thin divider between rows
  instead of a rounded strip per row; rows 64px with 48px covers (8px above
  and below); artist line at `--fs-sm`; hover lightens the row; **#1 only**
  gets a soft gold wash with rounded ends and a 56px cover, no ring (the
  #2 / #3 tints are gone; their numbers keep silver and bronze); the album
  column stays on one line with "…" and the full name on hover (`title`),
  its certification disc kept visible. **Phone: the table now fits its card
  in every period, type and language** (it ran up to 60px past the edge in
  Spanish and on Yearly): the Plays cells show just the number (the header
  names the column; `tCountHtml` now wraps the unit in `.cnt-unit`), the
  change in plays goes under it, the rank column is 32px, covers 36px (40px
  on #1), and long words may break in titles and headers. The Bubbling
  Under / Off the Chart / New Entries tables share the new rows (step 10
  goes further). **Not done here:** the gradient stand-in for missing
  covers (phase 4 left it for later; the initials show in 56 places, so it
  belongs with phase 8's shared components); the Tracks / Unique songs
  column stays as it is (no new switch). Checked: desktop Weekly songs /
  albums, Navy dark, Navy light and Yellow, Yearly, an open chart run, New
  Songs; phone (touch) table width measured for 4 languages × 5 periods ×
  3 types, all inside the card; no JS errors.
  **Fixed the same day (you spotted it):** the one-line album cell reserved
  its whole text width, so with the badges on, Title · Artist shrank to
  ~135px and every title wrapped. The album cell now has a fixed 20% share
  (`max-width: 0`), and the title column gets ~225px at 1240px wide.
  **Then, your call: album names wrap** inside that 20% instead of being
  cut off with "…", the certification disc following the name.
  **Then, your request: adjustable columns** (`_colw*` in app.js). On the
  Songs / Artists / Albums tables, every period, desktop only: drag the line
  between two headers (Title · Album · Weeks · Plays) to move width from one
  column to its neighbour, so the table never outgrows its card; rank,
  movement, cover and buttons keep their sizes. Double-click the line, or ⋮
  → Size → Reset column widths (shown only while a table has custom widths),
  to go back to automatic. Saved per table and per column set (with or
  without Move / Weeks), text columns as a share of the table and laid out
  in whole pixels for the current width (percentages left a seam in the #1
  row's tint); `dc_col_widths` syncs with the account. Phones ignore it.
  Checked with real mouse drags: widths, save, re-render, All-Time kept
  apart, a table drawn while hidden, window resize, double-click and menu
  reset, phone switch-off, phone fit unchanged. Noted again: between 600
  and 980px wide the whole page still scrolls sideways (older, phase 5).
  **Then, your call: the row look is reverted.** The rounded strip per
  row, the gold / silver / bronze tints on #1–#3 and the gold ring on #1 are
  back (the thin-divider rows and #1-only wash are gone). Kept from step 7:
  Move header, 3px coloured play bar, wrapping album column, adjustable
  columns. **Covers 48px on every row** (was 44px; #1 no bigger than the
  rest), 40px on phones. **Phones:** no play bar in the table, rank header
  is "#", NEW / RE no longer repeats under the plays (the Move chip says
  it), the ⋮ column is 24px, and headers no longer break mid-word. Title ·
  Artist on a 390px phone: 112px in English (83px before step 7), 100px in
  Portuguese, 77px in Spanish; every table still fits its card.
  **2026-10-18, your calls on phone badges:** in the phone chart table the
  plays-peak tag reads "▲ PB" (MÁX / PICO); diamond certifications show as
  emoji in every language (💎, 💎💎, then 3×💎, 4×💎…, `.cert-short`), Gold
  and Platinum keep their words; in Spanish only, the peak tag is 🏅 #n.
  **The Playlist switch is gone** from every chart's ⋮ → Show (three rows,
  config, `_withPlBtns`, `btn_display_pl_btns` × 4 langs): the ＋ never shows
  on chart entries in any layout (one CSS rule per section; the grid and
  filmstrip hover overlays that only held it go too), and "Add to a
  playlist" stays in each entry's ⋮ / right-click menu. Tour: the Show walk
  has six row stops and the ＋ phase is gone. Left: with every badge on, the
  pt-BR Yearly songs table on a phone is 5px too wide.
  **Spanish plays wording, your call (2026-10-18):** the Spanish chart
  tables use their short forms at every width (the Plays column was far too
  wide), and the short forms changed from "reprod / reprods" (settled
  2026-10-14) to **"1 vez" / "54 veces"**, with the column header
  **Escuchas** (Songs and the Artists / Albums totals). Full sentences
  elsewhere still say "reproducciones". Plays peak tag in Spanish tables: "▲ MÁX".
  **More columns can be resized (2026-10-18).** Rank and Move now drag too
  (in px, 40px floor; Rank trades width with Move, Move with Title). Plays
  is centred like Weeks (header, number, change and bar) and drags on the
  Weeks | Plays line: 150px to start, 96px floor, where the change moves
  under the number. Cover and the ▶ · ⋮ · chart-run column keep fixed
  widths and are never saved, so the ⋮ always fits (old saved widths had a
  38px button column that cut it off).
  **Details panel toolbar (2026-10-18):** the five actions are short labels
  (full wording in the tooltip) in one soft track, on the same line as the
  album / artist links on desktop; on phones, five even icon-over-word
  columns. **Chart run tiles** are wide rectangles with larger type, on
  every chart run panel (also the song / album pop-ups).
  **Merged to `main` and pushed 2026-10-18**, at your request, together
  with the streak badges (see "Done outside the phases").
- **Step 8, Compact ✓ (2026-10-18, 4b1c0c3).** Header and rows share one
  CSS grid (`--cx-cols`), so Move, time on chart and Plays line up; the old
  flex header drifted and its labels overlapped. Headers are translated, with
  the Table's words (`th_move`, `th_weeks` / `dy_th_days` / …, `th_plays`);
  time on chart is the number only; **Title · Artist** sit together on the
  left, the artist giving way first; Plays is centred like the Table's.
  All-Time has no Move / time columns (`.wv-cx-nostats`). Cover stays 32px
  in a 40px row (4.9b said 28px; 32px is the existing small thumb). The ＋
  and the English "weeks" text are gone from the markup. **Phones:** the
  artist goes under the title, time on chart moves to the details panel,
  title 20px → ~118px on a 390px phone; badges drop under the title with the
  phone Table's short forms (💎, ▲ PB, Spanish 🏅 #n); the Plays header
  starts at its column and runs over the ⋮ column (ESCUCHAS no longer meets
  CAMB.). Hover cover preview is off on touch. Checked: header/row column
  edges equal in all 5 periods × 3 types at 1280 and 390, no row overflow
  with every badge on, en / es / pt-BR, Navy light drawer, ⋮ / right-click /
  title pop-up with real clicks, no JS errors.
- **Step 8, Stack ✓ (2026-10-19, 083ca8a, 2c577bc, then 1ef43b9).** First built
  as flat Compact-style rows; **you asked for the cards back** the same day,
  so the face is now: **rounded cards** (`--r-md`), **the top 3 glowing**
  gold / silver / bronze (kept on purpose, against the "calm" default: the
  glow is a fixed shadow on a `::before` whose opacity breathes, coloured
  from `--medal-*` so light themes get their own, still under reduced
  motion), the **big rank number** (`--fs-xl`, 900) with the movement chip
  under it, a 64px cover, and three lines: **Title** (+ badges, wrapping
  under it when they don't fit, which fixes the phone cut-off), **Artist ·
  Album** (the album gives way first), and **the numbers**: plays this
  period · time on chart. **All-time plays stay in the chart run / details
  panel only** (you asked; a "26 total" on the card was tried and taken
  out). **Badges at the title's 600 weight** (they have none of their own
  and used to inherit it from the old title line). A wrapped numbers line
  never starts with a "·" (each stat carries its dot; the row is pulled
  left into a clipped edge). **No play bars** (you liked them gone). The
  card ends with **Search on Spotify** (`_eaSpotifyBtn`, new and shared,
  reuses `tm_action_spotify`), ▶ sample and ⋮; on touch ▶ hides as
  everywhere. **Two columns fill down first** (1–5 | 6–10, page-local);
  **#1 is a card like the rest** (a full-width #1 was tried and taken out);
  phones get one column. All-time totals
  now include artists (`cumulativeMaps.artists`), so Mosaic and Filmstrip
  show them for artists too. Checked: 1280 and 390, one / two columns,
  badges off and on, all 5 periods × 3 types (no element past its card, no
  sideways scroll), es, Navy light, drawer by real click, no JS errors.
  **Worth reusing for Card grid and Filmstrip:** the numbers line and the
  Spotify button. **Merged to `main` and pushed 2026-10-19.**
- **Step 8, Card grid ✓ (2026-10-19, 7d7714d, then 03d2ba7).** **Square covers** (were a
  fixed 140px tall, cropped) with the rank chip top-left (gold / silver /
  bronze for #1–#3), the movement chip top-right on dark glass with bright
  colours in every theme, and certification / score in the cover's
  bottom-left corner (4.9b asked for "a small disc"; kept the readable
  chip, with the phone short forms). Under the cover: **Title** with peak
  and personal-best badges (600 weight; personal best moved off the cover
  to make room for the movement chip), **Artist**, then the numbers line
  and Spotify · ▶ · ⋮ on the card's bottom edge. **The top 3 never glowed:**
  the entry animation's `style=` was spliced into the class string and
  closed `class=""` early, so `wv-r1/2/3` (and the movement classes) never
  reached the card. Fixed; the glow is Stack's, and the card no longer
  clips it (`overflow: visible`, the cover rounds its own corners).
  **5 / 3 / 2 across** (desktop / ≤980 / ≤600), "Bigger covers" 3 / 2 / 1;
  the toggle is translated (`wv_grid_bigger` / `wv_grid_smaller`). Gone:
  play bars, the green / red movement borders (`wv-gc-entry/up/down`), the
  English "plays" and "View details", the empty ＋ hover overlay and its
  rules, `.wv-gc-pb`. The numbers line and action set are shared now
  (`_wvStatsLine`, `_wvActs`, `.wv-stats`, `.wv-acts`), so Filmstrip can
  take them too. **Not done from 4.9b:** plays / peak / weeks sliding up
  over the cover on hover. The numbers line under the cover shows them
  all the time, so it seemed redundant. Checked: 1280 / 900 / 390, badges
  off and on, all 5 periods × 3 types (no element past its card), es, Navy
  light, the details panel by a real click, no JS errors. The 900px
  sideways scroll on Weekly is the phase-5 top bar (980px wide on the Table
  too), still for step 12.
  **Then, from your Spanish light-theme screenshot (03d2ba7):**
  - **The personal-best tag sat by the title and read as if the *rank*
    was the best yet.** It is now inside the plays item of the numbers line
    (`_wvStatsLine`), in Stack and Card grid: "15 reproducciones ▲ MÁX",
    wrapping under the count, whole, when it doesn't fit. Card grid uses
    the short form (▲ PB / ▲ MÁX / ▲ PICO; full wording in the tooltip).
    The numbers line keeps each dot in its own left padding (out of the
    text flow), so a stat that wraps inside itself starts its second line
    at the visible edge.
  - **"reproducciones" was cut off** by Spotify · ▶ · ⋮ sharing its row.
    The numbers now get the card's full width; the buttons sit on a row
    under them, right-aligned.
  - **Peak tag on the cover,** beside the rank chip (`.wv-gc-tl`), on dark
    glass with the bright tier colours; the title row has no badges now.
    (#1–#3 peak tags are `.peak-badge-1/2/3` *instead of* `.peak-badge`,
    so cover rules must name all four.)
  - **#2 / #3 peak tags went see-through on pale covers** in light themes
    (9f61252): the light themes' near-clear `.peak-badge-2/3` backgrounds
    (`body.navy-light .peak-badge-2`…) outranked the cover's dark backing.
    The cover rule now carries the section ids. Checked in all ten themes:
    every chip on a cover (peak, certification, movement) has the backing.
  **Merged to `main` and pushed 2026-10-19.**
  Next: Filmstrip, then Mosaic.
- **Step 8, Filmstrip ✓ (2026-10-19, 27abfda), on the branch, not merged.**
  The **podium** from 4.9b: **#1–#3 as big cards filling the width** (three
  columns, #1 at 1.3×, bottoms aligned so #1's bigger cover rises above),
  the rank as a **big number beside the title** (medal colours) instead of
  a chip on the cover; then **the rest as a strip of Card grid cards**
  (176px, 148px on phones) with **‹ › arrows and faded edges** only on a
  side with more, the thin scroll track kept. Podium and strip cards come
  from one new builder, **`_wvCoverCard`**, which Card grid now uses too
  (its markup is unchanged), so every feature, chip and the glow are
  shared. The podium shows only when the list starts at #1; a search result
  is all strip with its real ranks. On phones #1 goes across the top with
  its cover on the left, #2 / #3 side by side under it; short forms (💎,
  ▲ PB, Spanish 🏅 #n) as in the other layouts. Jump buttons only for a
  strip of more than 10 (#4, #11, #21…). The details panel opens under the
  podium or under the strip. **Controls translated** (`wv_film_*`: Auto-
  scroll / Stop, Save image, Previous / Next). **Save image was broken**:
  html2canvas 1.4 throws on `color-mix()` colours, which the cards use; the
  new `_h2cPlainColors` copies every colour on the capture copy as plain
  rgba (inline, and through a temporary sheet for `::before` / `::after`),
  and the capture is limited to the copy (`ignoreElements`). It saves the
  podium and every strip card wrapped into rows. Also fixed: the wheel
  trapped page scrolling over the strip (now it passes on at either end),
  a drag opened the details panel of the card it ended on, and
  `.section-body`'s `overflow: auto` cut the glow off in a hard box (off
  for Filmstrip only, via `:has(.wv-film-podium)`). Gone: play bars, the
  English "plays", the ＋ hover overlay (hidden everywhere already), the
  badge line under the artist. Checked: 1280 and 390, all 5 periods × 3
  types with every badge on (nothing past its card, no sideways scroll),
  search, real clicks on podium / strip / arrows / jump / drag / wheel /
  Auto-scroll / Save (download checked), es phone, Navy light, no JS errors.
  **Then, the same day, you found the big podium too much on a computer**
  ("excessive and disorganized"; fine on phones). On computers and tablets
  the top 3 are now **one even row of three wide cards**: cover on the left
  (at most 168px), big rank + title, artist and numbers on the right, about
  as tall as a strip card. The glow and the medal-coloured number set them
  apart. **Phones unchanged** (#1 across the top, #2 / #3 under it).
  **Then you found those covers smaller than the strip's.** Now: **three
  cards of one size, cover on top, 240px wide (strip: 176px), centred**,
  about 360px tall. Tablets share the width three across. Phones still
  unchanged.
- **Step 8, Mosaic ✓ (2026-10-19, ae16a1a), on the branch, not merged.**
  **The treemap is gone**: it sized tiles by plays, so the chart read in
  a jumble (#4 beside #1, #5 in the far corner) and covers were stretched.
  Now a **20-column grid of square tiles**: **#1 half the width and two
  rows, #2–#5 two by two beside it, #6 on five to a row** (`.wv-mos-xl /
  -md / -sm`; rows take their height from the square tiles, so #1 is square
  too). Phones: #1 full width, #2–#5 two across, the rest three (artist
  and plays hidden on those, a tap away). Only when the list starts at #1;
  a search is all small tiles. **One full-tile fade layer** (top and bottom
  gradients together) behind the big rank and the title, both sized to
  the tile with `cqw`; **even gaps**; the Card grid's movement chip; gold /
  silver / bronze rings from `--medal-*`. The artwork-sampled ring on the
  other tiles (`_mosDominantGlow`) is now 1px and faint, so it no longer
  competes with the medals. **Kept:** the hover card and the tap-to-flip
  back with ▶ ⋮ and All details (drawer under the mosaic). The back now
  fits the new small tiles (a 150–219px container query; a flipped tile
  grows to ~230px) and its movement chip sits in its rank row (it covered
  the ×). **New: Save image** (4.9b's "Share this"), through a shared
  `_wvSaveImage` that Filmstrip uses too; html2canvas needed the rings as
  a real border and no layer ending mid-tile (it drew a hairline at the
  edge). **Gone:** the play bars, the ＋, the English "View details", the
  treemap helpers. **Not done:** slimmer tiles from #11 down (step 9).
  **Then, from your light-theme screenshot:** peak tags from #4 down were
  unreadable on the flipped tile's back and the hover card (pale tag on a
  pale chip, contrast ~1.2 in all five light themes). Those dark surfaces
  now give every peak tag its own dark backing, as Card grid covers do.
  Measured in all ten themes: peak, personal best, certifications and
  scores all 7.8:1 or better.
- **Across the layouts (2026-10-19, d9c3659), at your request:**
  - **Search on Spotify on every view.** Mosaic's hover card and tile back
    (`_eaSpotifyBtn`), and a new `_eaSpAuto` (`_eaBtns(true)`) for rows
    that only carry `data-ea-*`: a real link (open in new tab works) whose
    address is filled from the row just before use. Table (all periods),
    Compact, Bubbling Under, Off the Chart, New Entries. On phones the
    Table's Spotify sits above ⋮, so the column stays one button wide.
  - **▶ on the cover's bottom-right corner in Table, Stack and Compact**
    (`_eaCoverPlay`, `_eaBtns(sp, noSample)`). **This reverses the
    2026-10-14 call** "▶ never on the artwork": you now want it there. The
    ✎ picture button keeps the top-right corner, so they don't meet. Shown
    on hover with a mouse, always on touch (16px on the phone Table's 36px
    covers), accent while playing; the cover's own ❚❚ / ♪ badge is off
    there. Tapping the cover still plays the sample on touch. Card grid,
    Filmstrip, Mosaic and the BU / Off / New rows keep ▶ beside ⋮.
  - **Table plays: no bar.** The number, with the change in plays under it
    at every width (it was the phone layout); NEW / RE stay in the Move
    column. The tour's Plays step no longer mentions a bar.
  - **Mosaic tile backs fit on phones**: the smallest tiles show rank,
    title, plays and the four buttons (peak and weeks are in All details);
    the container-query rules now beat `.wv-mos-back-acts`' own spacing.
  Checked: 1280 and 390, all 5 periods × Table / Compact (every row has
  Spotify, none overflows, no sideways scroll), BU / Off rows, a real
  Spotify click (right address, no details panel), real ▶-on-cover clicks
  in all three layouts, Mosaic backs on every tile size.
  **Then, from your light-theme screenshot:** the chart-run icon was cut
  off at the row's edge on computers. Spotify (28px by default) took ▶'s
  22px place in the Table's fixed 72px button cell. It is 22px there now,
  like the others. Measured this time for every button in the cell (the
  first check skipped the chart-run icon): all periods × 3 types and
  Bubbling Under at 1280 / 1100 / 820 / 390, nothing past its cell.
- **Pictures and Spotify everywhere (2026-10-19, 9fcb6fe, 7899764), at your
  request:**
  - **⋮ → Search on Spotify** in every view (the shared menu, `_eaRunAction
    'spotify'`).
  - **Change the picture from every layout.** `loadImages` now attaches the
    ✎ (`attachRecImgPicker`, as for Records) to covers in all five
    non-Table layouts: hover ✎, press-and-hold on touch, and ⋮ → Change
    picture now redraws those covers at once (`refreshImgInstances` only
    found covers with a ✎, so picking a picture there used to wait for the
    next redraw). ✎ sits bottom-right on Card grid / Filmstrip covers (the
    movement chip is top-right), smaller on Compact, on the tile's back in
    Mosaic. The phone-only Mosaic back rule now stops at 164px, so the
    computer's small tiles keep their thumbnail and ✎.
  - **Share as Image: a Pictures row** (`_igRenderArtPicks`): one tile per
    entry on the card, a click opens the picker, the card redraws with the
    choice, which is saved for the entry everywhere. **Share cards used to
    ignore picked pictures** (they fetched from the source):
    `_igFetchArtWithFallback`, which every share card uses, and
    `_lookupImgUrl` (chart run / entry card) now return the picked picture
    first; "No picture" gives the placeholder. `applyImgChoice` clears that
    entry's cached share art and redraws an open share window.
  Checked: a real ✎ → picker → picture in all six layouts (cover updated at
  once), ⋮ has Spotify and Change picture in all six, the share window at
  1280 and 390 (10 tiles, picker opens on top, tile + card + chart cover
  updated, kept after reopening), no JS errors.
- **▶ beside Spotify and ⋮ on phones too (2026-10-19), from your phone
  screenshot.** Card grid, Filmstrip and the BU / Off / New rows still
  hid ▶ on touch (the 2026-10-14 "the cover is the button" rule), which
  you found not user-friendly. That rule is gone: on touch ▶ shows in the
  group wherever it is there. Table, Stack and Compact keep ▶ on the cover;
  Mosaic has it on the tile's back. Checked with real touch emulation
  (hover: none; earlier phone checks were desktop browsers at 390px):
  every view's buttons inside their row, no sideways scroll.
- **⋮ menu icons (2026-10-19, 8c05a9e), at your request:** the text
  symbols (♪ ▶ ⏭ ＋ ☰ ≡ ⓘ ◉ ♫ ▦ ✎ ↗) are one SVG line-icon set
  (`_EA_MI`, keyed by action: 17px, round 1.8px strokes, muted text colour,
  accent on hover / focus), with the real YouTube and Spotify marks on the
  two searches. Checked in Navy dark and light, with the player-only items
  showing.
- **New Entries plays centred (2026-10-19), at your request:** header and
  numbers centred, like the chart tables (the header had an inline
  right-align). New Entries still has its play bar on computers; the main
  Table's was taken out.
- **No Spotify button in the phone Table (2026-10-19), at your request:**
  on phones the three chart tables end each row with ⋮ alone (Search on
  Spotify is in that menu). Bubbling Under, Off the Chart and the other
  layouts keep their button; computers keep it everywhere. Checked with
  touch emulation.
- **Lines between the #1 row's columns (2026-10-19), from your screenshot:**
  each cell paints its own share of the row strip, and with Windows display
  scaling neighbouring cells overlap by a pixel; #1's see-through 11% gold
  doubled there into a darker line at every column edge (measured on your
  screenshot: 232,223,205 against 242,237,227). The medal tints (#1–#3 and
  their hover shades, and #1's rank cell) are now solid colours mixed with
  `--bg2`, so an overlap is invisible. Same colours within 1–2 levels in
  all ten themes. (Headless Chromium snaps pixels differently and never
  showed the lines, so this was checked by measurement, not by eye.)
  **That was not it: the lines stayed, and it hid the #1 numeral.** The
  real cause: #1's gold ring was an inset box-shadow on every cell, and at
  fractional cell widths an inset shadow leaves a faint sliver of ring
  colour down each cell's sides (only #1 has the ring, so only #1 showed
  it). The ring is real borders now (top / bottom on every cell, the outer
  side on the end cells, rounded by their radius). And the solid tint, laid
  over the numeral as an inset shadow, had covered the foil "1": the rank
  cell now has two background layers, the foil gradient clipped to the
  digits over the row tint (`background-clip: text, border-box`). Checked:
  no cell shadows left, the numeral at full contrast, phone and computer,
  light and dark. The solid medal tints stay.
  Checked: 1280 and 390, all 5 periods × 3 types (every tile square,
  nothing past its tile, no sideways scroll), search, real hover / flip /
  All details / × / ⋮ / Save (download checked), es phone, Navy light, no
  JS errors.
- **Step 10, started early (2026-10-18).** Done so far:
  - **Off the Chart rows:** ▶ and ⋮ in their own end column. On phones the
    row restacks: the title wraps instead of being cut, plays and weeks go
    under the artist on one line, rank and buttons frame the text.
  - **Bubbling Under rows:** the same end column and phone restack.
  - **The Bubbling Under chart run panel** looks like the main one:
    labelled wide tiles (three per row), a BU / With chart segmented switch
    instead of "+ Chart", a peak tile with the overall rank as a note, a dot
    legend, and every string translated. Ranks use a translated prefix
    (`bucr_prefix`: BU in English, A for "Aspirantes" in es / pt). Open BU
    panels now stay open across a language switch (`data-bucr*`).
  - **Names:** Bubbling Under is "Aspirantes" in Spanish and Portuguese.
  Still to do for step 10 (4.11): show 5 rows with "Show all N", Bubbling
  Under and Off the Chart side by side on desktop, at most two neutral tags
  per row with the legend in a ⓘ (3.8), and Off the Chart's reason as one
  short muted line. New Entries has had none of the row work yet.
- **Step 10 ✓ (2026-10-20, f3b0e4c).** Designed with you over five mockup
  rounds (artifact "Below the Chart Ideas"), which replaced the list above:
  - **One "Around the chart" box** per chart type with three tabs (Bubbling
    Under / Off the Chart / New), only the ones with something to show. It
    remembers the last tab and a folded box (this device). Stat-tile jumps
    and the tour open the right tab. You chose this over side by side.
  - **Bubbling Under:** covers (▶ on the corner, ✎), a bar for the distance
    to the chart (gold line = the last chart entry's plays), and **every tag
    kept** (you asked not to lose any), moved under the bar. The legend is
    behind a ⓘ. "N plays away" lives under the bar now.
  - **Off the Chart:** three lines per side, lined up, so the cover can
    fill the row and stay square: title ↔ last week → this week plays,
    artist + exit label ↔ weeks on chart, Bubbling Under link or last
    played ↔ streak. Exit labels are on trial ("we can look into"). The
    Bubbling Under link jumps to the row and flashes it. On phones each row
    is a card with a three-number strip. Only the "plays away" tag is left
    on the Bubbling Under line (Fallen became an exit label).
  - **New Entries:** the chart row with covers, Debuted at #N / #N in
    Bubbling Under, ✦ New artist, a strip of small squares (days of a week,
    weeks of a month, months of a year; none on Daily) with "N of 7 days",
    the 🏆 big-debut note, All / Made the chart / New artists chips, and the
    counts added to the subtitle.
  - **Not done, on purpose:** 5 rows + "Show all" (too close to step 9,
    which you turned down).

**What's left in phase 7, in order:**
- **Step 8: the other five layouts**, one commit each (4.9b). Compact,
  Stack, Card grid, Filmstrip and Mosaic done (above, with both step-4
  phone bugs): **step 8 finished**. Use the new table's choices as the model: covers 48px,
  the gold / silver / bronze tints for #1–#3 (you kept them), and on phones
  Title · Artist gets the room first.
- **Step 9: shorter long charts** (4.12, slimmer rows from #11).
  **Skipped (2026-10-20).** You saw a mockup (full-size #1–#10, slim rows
  from #11, "Show all 100" after 50) and decided against it. Long charts
  keep every row at full size.
- **Step 10: finish it** (list above). **Done 2026-10-20.**
- **Step 11: one rank-change animation** for every layout. **Built
  2026-10-22 (d526475), on the branch for review.** After three mockups
  (https://claude.ai/artifact/Sq2T66EEY2FgJzMbatyKHW) you chose a replay
  that goes through the play records one at a time: each step drops one of
  last period's plays or adds one of this period's, in the order they
  happened, until it lands on the chart on screen. It replaces the
  Table-only animation, which moved rows before their covers loaded and
  whose counts jumped in big frames. New file `replay.js`:
  - Covers for every entry that will show load before anything moves.
  - Counts, ranks, arrows and the #1–#3 tints change together; a row
    glides past the row it overtakes; leavers fade out, new ones rise in.
  - Controls: play / pause, speeds ½×–20×, ±1 play, ±1 day (±1 hour on
    Daily), start / end, a slider over every play, a strip of days to
    click, a log of the last three plays in or out, and the keyboard.
  - A small floating back / play / forward control once the bar scrolls
    away. (A sticky bar can't work there: the chart section clips its
    contents, which pushed the bar down over the rows.)
  - All six layouts, Daily / Weekly / Monthly, Songs / Artists / Albums.
    "Animate charts on load" opens it by itself and hands the chart back
    at the end unless you touched it.
  - A period still running is replayed up to now, so the slide still
    ends on its last play.
- **Step 12: screen check — done 2026-10-22 (f6bc35c).** A script went
  through every width (330, 360, 390, 430, 600, 700, 768, 900, 980, 1024,
  1280) × Daily / Weekly / Monthly / Yearly / All-Time × Songs / Artists /
  Albums × all six layouts, with every badge on, in English, and at phone
  widths in es / pt-BR / pt-PT too. It flags any sideways scroll and anything
  past the screen edge. It ended with 0 problems and no JS errors. Fixed:
  - **The 600–980px sideways scroll** (open since phase 5). The cause wasn't
    the top bar: `html { min-width: min-content }`, there from the very
    first version, let a sideways-scrolling strip (Filmstrip, the
    certification reel) stretch the whole page to the container's 980px cap.
    Phones already had it off. It's gone, and the strips scroll inside their
    own box.
  - **330px page 345px wide:** the top bar's icon buttons are 30px (not 34)
    at ≤350px, so Sign in fits.
  - **Daily, es / pt at 360–390px:** "Compare with" wraps, so the long
    "vs mesmo dia da semana passada" goes on its own line.
  - **Daily part-of-day cards on small phones:** "7 reproducciones" and
    "MADRUGADA" + "PICO" ran out of the half-width cards. The count is now
    number + word (`.dy-part-cnt`, `.dy-part-w`), so phones shrink the word.
    The head and count lines wrap inside the card. Desktop looks the same.
  - **Yearly / All-Time page bar at 330px:** "|◄" and "◄ PREV" split in
    two and ►| hung off the edge. At ≤420px the label + jump box take their
    own line above the four buttons.
  - The pt-BR Yearly table leftover (5px too wide) didn't show up any more.
Phase 7 is finished.

**Phase 8 (shared components). Planned 2026-10-22, one step per commit, on
its own branch.** Before/after mockup:
https://claude.ai/artifact/Tf4Sbvjr3qLBfNrfoRuU1f. Same way of working as
phase 7: a mockup first when a step changes the look, you check each step
before the next, and the old classes go in the same commit that moves their
last user (see "Delete as you go").

1. **Corners and shadows. Done 2026-10-22 (2dd424e).** Mockup:
   https://claude.ai/artifact/Ui89Ze7cAGcEExj2YiNvKU. Five corner sizes:
   `--r-xs` 4, `--r-sm` 6, `--r-md` 10, `--r-lg` 16 (was 14), `--r-full`;
   `--r-xl` removed. About 200 raw corners moved (3–5px → xs, 6–8 → sm,
   9–12 → md, 14–24 → lg, or full on pills/buttons; 1–2px bars, circles and
   0 stay). About 40 plain grey drop shadows moved onto `--shadow-1/2/3` by
   blur, so light themes get the softer values. Coloured glows, rings,
   inset bars and halos stay (they do a different job).
   **Charts left out on your call:** chart table, six layouts, Around the
   chart, replay, ⋮ menu, chart-run panel, peak and cert badges, plus the
   dark ceremony / Soundtrack stages keep their values; their `--r-lg` /
   `--r-xl` uses are pinned to 14px / 18px with a comment. A later step (or
   phase 11) moves them. Checked by dumping computed corners and shadows of
   every chart element old vs new: identical except the certification reel
   (5px → 4px). Script: scratchpad `conv.py`.
2. **Buttons.** One button in three kinds: main, normal, plain. Move every
   page's buttons onto it (`graphs-btn`, `ev-view-btn`, `creel-btn`…). This
   also removes the old YouTube/＋ pair rules still used by `sk-et-yt` and
   `na-tt-yt-btn`. Mockup: https://claude.ai/artifact/AyQVUs5ymZA77mLqCaGswt.
   About 125 button classes outside the charts. **Your calls:** slightly
   rounded corners only (`--r-sm`, no pills, no round icon buttons); Delete
   and Disconnect are plain red text (`.dc-btn-danger`). Kept as they are:
   the landing demo button, the ceremony's gold buttons, the ✎ / ▶ cover
   badges, the video player controls, everything in the charts (incl. the
   chart toolbar's Export / Share / PDF buttons), and switches and tabs
   (steps 3–4). Done in six parts, one commit each:
   - **2a. Shared button + Share as image windows. Done 2026-10-22
     (62d1dbc).** `.dc-btn` + `-main / -normal / -plain / -sm / -icon /
     -danger` near the top of `style.css`. All eight share-image footers:
     Download = main, Copy / Share = normal, Cancel = plain; on phones
     Download takes its own full-width row. `.ig-copy-btn` /
     `.ig-download-btn` deleted.
   - **2b. Events and Playlists. Done 2026-10-22 (7194477).** Refresh,
     calendar arrows, Play All / Create / Export Playlist, section ＋
     playlist buttons; create-playlist and printable-PDF footers; the
     ceremony share-link panel (one main per state, Stop sharing red).
     Playlists: Resume = main, Save Queue = normal, icon buttons plain with
     delete / remove red. The Events view switches (Reel / Tiles / Table /
     List, Month / Week / Day) wait for step 3. Found, not from this step:
     the Around the chart box showed on every non-chart tab; fixed
     (5c50621). (Playlists showing Recent Releases and Anniversaries is
     on purpose.)
   - **2c. Records and Stats. Done 2026-10-22 (8f575ea).** Stats graph
     actions (Reset / Labels / Reset Zoom, race transport, GIF; + Add and
     race Play = main), ratings (rating window, rate / edit / share buttons,
     scan dialog, library Remove in red), Streaks sort / heatmap Copy / "+N
     more". Kept: the Streaks fire-coloured play buttons (their own look),
     text links (Show all, more…), pick-one groups (step 3). Still round
     and not moved: the fold buttons (`.section-collapse-btn` /
     `.rec-collapse-btn`), shared with the charts, so they go in 2f with a
     decision on the chart ones.
   - **2d. Awards. Done 2026-10-22 (d7d4612).** Year arrows, Configure
     Year, Generate Nominees (main), Enable / Disable All, category
     action buttons, ceremony Share, picker stats / Show more / Save. Kept:
     gold View Ceremony + ceremony stage, the picker's tiny media buttons,
     ★ favourite; the picker confirm window waits for step 9.
   - **2e. Player queue. Done 2026-10-22 (e379e84).** Queue pop-up
     (Now = main), history Queue all, multi-select Top / Del (red), Undo,
     player Save. The Streaks / new-artist YouTube ▶ moved off the old pill,
     so the YouTube/＋ pair rules are gone. Kept: mini-player icon controls,
     inline status links, the chart toolbar's Play all / Shuffle.
   - **2f. Everything left. Done 2026-10-22 (8d05fda).** Settings
     (Last.fm Connect main, Disconnect red), Raw Data, scrobble Now,
     welcome window, tour, Charts Guide, image picker, Replay chart,
     Contact Support, the board's .bd-btn family. Fold (−) buttons outside
     the chart sections are square small icon buttons; the three chart
     ones stay round (`.section-collapse-btn:not(.dc-btn)`). Kept: landing
     page buttons, the guide hero's white-on-colour buttons, top bar icons,
     underlined text links. Same commit fixed tab pages leaking under Raw
     Data / Stats / Records: the tab handler now hides every tab page once
     (all 90 tab-to-tab switches checked).
   **Step 2 finished.**
3. **The "pick one" switch.** One segmented control for Stats period,
   Graphs, Events view, Time Machine type, the certification reel and the
   rest (`st-period-btn`, `sh-seg-btn`, `tm-type-btn`…). The Daily tab's
   switches already count as done.
   **Done 2026-10-22 (2902bd8).** `.dc-seg` on the group (tray look of
   the chart type switch / Daily); lit = `.active` or `aria-pressed`, so
   no JS changed; `.dc-seg-fill` for the share windows. Moved: Events
   views / calendar / list sort, Stats granularity / race / heatmap,
   ratings library + rating mode, Settings release-type separation, Time
   Machine, cert reel + wall, album track sort, Soundtrack period, Streaks,
   export order, every share window's option and picture-source rows.
   Multi-select filters (Events types…) wait for step 5 (chips). The
   chart toolbar switches (layouts, chart type, album filter) were already
   this look.
4. **Tabs.** Records, Awards and the ⋮ menu share one tab style. The ⋮ tabs
   (Show / Size / View / Actions) get translated here.
   **Done 2026-10-22 (3aedb54).** `.dc-tabs` (underline, the Around
   the chart / ⋮ look; open = `.active` or `aria-selected`): chart-run
   share mode bar, Awards sub-nav, streaks window, album rating window,
   Records period tabs. Records' small type switches went onto `.dc-seg`
   (animated icons kept). ⋮ tabs translated (`kebab_tab_*`), hint follows.
   Kept: the Records dial (animated icon pills), top bar tabs, the ⋮
   menu's own look and its Size buttons (shared with Records' Entries
   Display) — charts.
5. **Tags and chips.** One small label style ("New", "Gold", "#1"…).
   **Done 2026-10-22 (4c904e5).** `.dc-chip` label (tiny corner,
   raised fill) and, on a `<button>`, a filter chip (bordered, accent tint
   when on); `.dc-chip-warn` amber. Moved: Events types, Awards groups,
   board categories + post tags, streaks / heatmap chips, picker stat and
   genre tags, Awards Auto. Kept: rating score chips (colour = score),
   Daily's chips, chart tags, Settings step tags, cert ledger strip.
6. **Cards.** One box style for panels and cards. The "Of the moment" cards
   stay as they are (approved).
   **Done 2026-10-22 (d82b8f9).** `.dc-card` (page panel) and
   `.dc-card-inset` (card inside a panel, one step darker); border, medium
   corner, no shadow. 18 card classes moved (Stats graph cards, guide
   panels, Records overview, playlists, event / Time Machine / Awards /
   ratings cards, welcome tiles…). Kept: Of the moment, Daily, ceremony,
   landing, chart cards; pop-up boxes are step 9.
7. **Tables.** Records, Streaks and Raw Data tables share one look. The
   chart table stays as phase 7 left it.
   **Done 2026-10-22 (f530656).** `.dc-table` (header type, cell
   padding, row lines, hover) on every Records table, Milestones, Raw
   Data, the Events table view and the pop-up tables; each keeps only its
   own extras (Records' frame + sticky header + column lines, Raw Data's
   sortable headers). The streaks list is rows, not a table — unchanged.
8. **Sliders.** Side-scrolling rows (certification reel and the like) work
   the same everywhere.
   **Done 2026-10-22 (511a642).** The moving reels already shared one
   engine (`dcMountReel`) except the Records reel (overview + artist
   window), the last CSS marquee — now on the engine too (drag, pacing,
   reduced motion, static centred copy). Awards poster reel: square icon
   arrows, hidden scrollbar. Kept: the cert shelf's own engine (chart
   area), Daily's awards row.
9. **Pop-up frame.** One frame for every pop-up window; on phones the ⋮
   menu opens above the bottom tab bar. What is inside the pop-ups is
   phase 10.
   **Done 2026-10-22 (e518b2f).** `.dc-modal` on every pop-up box
   (11 box classes, ~33 boxes); one close button `.dc-modal-close` (plain
   ✕ icon, aria "Close" via `set_close`) replacing "✕ CLOSE" labels and
   round ×s; confirm windows Cancel = normal, destructive = plain red.
   Phone ⋮ menu: fixed panel just above the bottom tab bar
   (`.kebab-menu.kebab-menu` in a ≤600px query). Kept: ceremony stage.
10. **More picture sources.** Not the old "missing pictures" problem (phase 4
    showed that was loading, and fixed it). This is for the rare song or
    album no source has: after Deezer → iTunes → Last.fm, try **Cover Art
    Archive** (through MusicBrainz, about one lookup a second, so only on a
    real miss) for songs and albums, and **Wikipedia / Wikidata** for artist
    photos. Both are free, need no key and are already used elsewhere in the
    site. What still has no picture keeps the initials (✎ still works).
    Replaces the gradient stand-in idea.
    **Done 2026-10-22 (5176b01).** `AUTO_IMG_SOURCES` = deezer, itunes,
    lastfm, `caa`, `wiki` (every chain walker gets them; each getter answers
    null at once for the other type). MusicBrainz lookups queue 1.1 s apart,
    max 6 waiting, busy / blocked = failure (not cached). Labels "Cover Art",
    "Wikipedia". Live check: Wikipedia found Radiohead / Muse / Phoebe
    Bridgers, skipped "Paris"; CAA found Gemini Rights. MusicBrainz 503s a
    lot from one IP under testing — expected, retried later.
11. **Screen check.** Every page at phone, tablet and desktop widths in the
    four check themes, like phase 7 step 12.
    **Done 2026-10-22 (2fcb820).** Every tab + share / rating / streaks /
    Settings windows at 330 / 390 / 768 / 1280 in Navy dark, Navy light,
    Yellow dark, Red light: no sideways scroll, nothing past the edge (only
    the off-screen share canvas, on purpose), no JS errors. Found buttons
    in the system font (never set one); fixed with one inherit rule for
    form controls. Script: scratchpad `final_sweep.py`.
**Phase 8 is finished** (2026-10-22, branch `redesign/phase-8-components`).
Left for later, on purpose: the charts' own controls (left out on your
call, incl. the three chart fold buttons and the ⋮ Size buttons), the
Records dial, the landing page, the ceremony stage, Daily's own pieces.

**Phase 9 part 1: Records. Planned 2026-10-22, one step per commit, on
`main`; you review each step before the next.** Every sub-tab was looked
at on screen first (desktop and phone, navy dark). What changed since 4.15
was written:
- **Rating Records shows on every sub-tab**, because it is not in the
  sub-tab list, so switching never hides it. On Streaks and New Charts it
  even sits *above* the section you picked.
- **Certifications draws every plaque at once:** with a few years of
  plays that is hundreds of plaques and a page about 40,000px tall.
- **Milestones is already a timeline** ("first to 10, 25, 50… plays",
  one row per total), not the repeating pills 4.15 describes. The "group
  by song" fix is out of date and is dropped. Only "highlight the big
  round numbers" is left, and it is folded into step 6.
- **Fastest** now shows 50 plays open and the higher totals folded.
- Initials instead of covers only happen in test runs that block picture
  downloads. Covers come from the normal picture system (phase 4/8).
- The Overview cards already have an "All / Weekly / Monthly / Yearly"
  row above them; the 26 cards are "All".

Steps:
1. **Top of the page.** The Weekly / Monthly / Yearly box becomes one
   small caption line under the title. Rating Records shows only on
   Overview, at the bottom; its ★ becomes a line icon like the other
   section titles, and its numbers turn white (3.2).
2. **Sub-tab menu.** Mockup first. A left side menu on desktop, a
   dropdown on phones, in place of the two-row dial. Search stays on top.
   **Done 2026-10-22** (option A, you picked it): from 1024px a sticky
   menu on the left in two groups (Chart records / Play records) with a
   count of record lists per item; from 1260px the Records page grows
   120px each side so the tables keep their width. Under 1024px one
   "Section" dropdown. The icon motion on the active item is kept.
3. **Overview cards.** Mockup first. One card per record type with a
   small Week / Month / Year switch on the card (26 → about 9). The hero
   reel stops being cut off at both edges.
   **Done 2026-10-22** (you asked for the rest without stops; the
   mockup's recommended options were taken): 10 cards in the menu's two
   groups, a Weekly / Monthly / Yearly strip under each (Streaks: Daily,
   Weekly, Monthly, Yearly, Back-to-Back; lifetime ones say All-Time), each
   card remembers its period. The All / Weekly / Monthly / Yearly row is
   gone. The reel keeps sliding, with 12% fades instead of 4%.
4. **Tables.** "Entries display" moves next to the table it controls.
   Dates in plain muted text, underline only on hover. Titles in the
   normal font with no ♫ in front (Perfect All Kill, Certifications).
   **Done 2026-10-22:** "Show 25 50 100 All" now sits at the right end
   of the heading line of the section on screen (its own line on phones).
   Dates are muted text, accent + underline on hover. The 🎵/💿 in front of
   titles are gone from Perfect All Kill, Appearances and Debuts. Also
   fixed: Perfect All Kill's "Most recent" cell sat out of line with its
   row (display:flex on a td).
5. **Total / In a row.** All #1s and Appearances get one table with a
   "Total / In a row" switch above it instead of two stacked tables.
   **Done 2026-10-22:** a Total / In a row switch (shared .dc-seg) under
   each section's description, remembered per section; during a search
   both tables show and the switch hides.
6. **Fastest and Milestones.** Fastest gets one picker, "Fastest to
   [50 ▾] plays", instead of the folded bars. Milestones highlights only
   the big round totals (100, 500, 1,000…).
   **Done 2026-10-22:** Fastest has a "Fastest to [50 ▾] plays" picker per
   type (remembered; a search shows every tier). Milestones needed nothing:
   MIL_MAJOR already highlights only 100, 500, 1,000, 5,000…
7. **Perfect All Kill and Certifications.** Perfect All Kill gets a ⓘ
   that explains the name; the "#67 / 67 · ARTIST #7" tags get calmer.
   The plaque wall shows the first rows and a "Show more" button.
   **Done 2026-10-22:** "ⓘ What's a Perfect All Kill?" (the Bubbling Under
   capsule) opens a short note; the PAK list shows "#67 / 67" and
   "Artist #7" as two quiet text lines (old .rec-badge CSS deleted). The
   wall shows 24 plaques, then "Show more (N left)" adds 48; the rest stay
   in the page, hidden, so the hero tally (REC_TALLY_SEL) is unchanged.
8. **Screen check.** Every sub-tab, all 10 themes spot-checked, phone
   with touch, four languages, search across sections.
   **Done 2026-10-22:** every sub-tab at 1440 / 1100 / 390 (touch) in
   English, Spanish and both Portuguese: no browser-default buttons, no raw
   translation keys, no sideways scroll, no script errors; search finds
   across 8 sections in every language; Overview and Perfect All Kill
   looked at in all 10 themes.

**Phase 9 part 1 (Records) is finished** (2026-10-22, on `main`). Next is
phase 9 part 2: Stats (4.14).

**Phase 9 part 2: Stats. Planned 2026-10-22, one step per commit, on
`main`; you review each step before the next.** Looked at on screen first
(desktop and phone, navy dark, a 3-year test library). What 4.14 still gets
right, and what is new:
- The page title is "📈 Historical Graphs" in a pill, under a tab called
  Stats. Daily / Monthly / Yearly sits alone in a box at the top.
- **Four cards each carry their own Range row** (two date boxes and Reset):
  Cumulative Plays, Total Play Volume, Play Volume per Artist and the Play
  Count Race. New Discoveries has none. Every range starts at the very
  first play, which is why long libraries get a flat line and a spike.
- Default Chart.js look: vertical and horizontal gridlines, bright axis
  text. "Labels: Off" and "Reset Zoom" are text buttons on every card.
- The Play Count Race colours each rank box and avatar a different hue.
- The heatmap stacks one block per year (11 on your library), then
  Listening Patterns under it.
- 72 inline styles in the Stats markup (same count as 4.14 said).

Steps:
1. **Page top and one date range.** Mockup first (it also shows where the
   later steps lead). Title "Stats" with a line icon like Records. One bar
   at the top: Daily / Monthly / Yearly, then "12 mo · 3 yr · All" and the
   two date boxes, defaulting to the last 12 months. The four per-card
   Range rows go; a card that needs its own range keeps an override.
   **Done 2026-10-22:** title "Stats" (Records' title style); one bar with
   Daily / Monthly / Yearly, "12 mo · 3 yr · All" and two date boxes
   (dc_gRange; editing a box makes it custom), sticky from 601px up, on
   phones it scrolls away. Cumulative, Total volume, Artist volume and New
   Discoveries follow it (Discoveries still counts "new" over all history).
   The race keeps its own range from the first play (your call).
2. **Card corner buttons.** "Labels" and "Reset zoom" become small icon
   buttons in each card's top-right corner, with tooltips.
   **Done 2026-10-22:** .graph-card-head with .graph-card-tools on the four
   charts; Labels shows its state in the tooltip and aria-pressed (lit
   when on), updateLabelButton() keeps the icon; tooltips refresh on every
   language change.
3. **Chart style.** No vertical gridlines, faint horizontal ones, 12px
   muted axis text, the theme accent for single series, a fixed set of
   6–8 colours for comparisons (artists, the race), checked in all themes.
   **Done 2026-10-23:** graphAxes()/graphLegend() in app.js give every
   Stats chart the same axes (no vertical lines, --rule horizontals, 12px
   axis text = --text mixed 65% into the card, ≥5:1 on all 10 themes;
   --text3 was near-white on yellow/red/pink dark). Eight fixed hues,
   a dark set and a light set (graphPalette()/graphColor()), passed the
   dataviz validator on navy, yellow and pink cards. One artist = accent.
   Chips: text in ink, colour on the border. Race: rank boxes neutral, bar
   and avatar ring keep the artist colour (stored as a slot, so a theme
   change repaints). Charts redraw on a theme change.
4. **Ratings chart.** One colour (accent), lighter or darker by score,
   instead of a rainbow.
   **Done 2026-10-23:** the bars were already one accent colour (phase 3
   colour pass); now shaded by score: app.js sets --rt-mix per bucket
   (40% for 0 up to 100% for 9–10) and .rt-dist-bar mixes the accent into
   --bg2, so low scores recede on dark and light themes alike.
5. **Heatmap.** Mockup first. One year at a time with `‹ 2026 ›`, and a
   row of small thumbnails to jump between years. Listening Patterns stay.
   **Done 2026-10-23** (mockup https://claude.ai/artifact/PpjdoqYAXvf5NGY6XmY4qd):
   opens on the current year (hmYear, not saved; the page range does not
   apply), ‹ › and arrow keys step, a strip of year thumbnails (weekly bars on
   one shared scale) jumps. Year numbers sit next to the year. Squares fill
   the card width (scoped to #gHeatmap, other heatmaps keep 11px); phones
   scroll the year sideways with the day names pinned. Month labels go on
   the week whose Thursday is in the month (no more "DecJan"). Listening
   Patterns follow the open year with a "2026 | All time" switch
   (dc_hmPatScope). Seen but left for step 7: the heatmap colour schemes are
   dark-only, so on light themes the Less key and empty pattern cells are
   near-black.
6. **Inline styles** in the Stats markup move into classes.
   **Done 2026-10-23:** 39 → 3 (steps 1–5 had already removed the rest).
   New classes: .graph-add-row / .graph-input / .graph-chips for the
   "Add an artist" rows, .graph-ctrl-row / .graph-ctrl-label for the race
   and heatmap control rows, .race-*, .hm-theme-btns / .hm-ctrl-sep, and
   the swatch gradients by data-hmtheme. The 3 left are `display:none`
   that app.js toggles (#graphsView, #heatmapFilterRow, #heatmapTooltip).
   Checked before/after on 132 elements at 1280 and 390: identical except
   the race control rows, whose four spacings are now one (moves ≤2px).
   Text inputs now show a focus ring (the old inline outline:none hid it).
7. **Screen check.** All charts, 10 themes, phone with touch, four
   languages, a long (10-year) library.
   **Done 2026-10-23:** every chart draws in all 9 Daily / Monthly /
   Yearly × 12 mo / 3 yr / All combinations on a 2016–2026 library; race
   plays; all 10 themes; phone (390, touch) has no sideways scroll, a tap
   opens the heatmap tooltip and the year thumbnails; no script errors.
   Fixed along the way:
   - **Heatmap on light themes:** hmStops() runs each scheme the other way
     (empty = the theme's --bg3, more plays = darker), so the Less key and
     empty pattern cells are no longer near-black. Description reworded
     ("the stronger the color"). Tooltip gold/amber lines get darker
     shades on light themes (≥5:1). The divider after View is hidden on
     phones, where the swatches wrap.
   - **Four languages:** much of Stats was English-only. Now translated:
     the heatmap card, its tooltip, milestones, streak chips, Less/More,
     Listening Patterns, the filter placeholder, the race Play/Pause
     button (JS overwrote the translated label), the Discoveries legend
     and the volume chart's series name, and the whole My Ratings card.
     Month and weekday names come from the browser in the page language
     (hmMonth / hmDow), which also fixes the album/song and Streaks
     heatmaps. Left: the rating band names (Essential, Weak…) stay English;
     they are the ratings feature's vocabulary everywhere (share images,
     rating windows), so translating them is its own decision.

**Phase 9 part 2 (Stats) is finished** (2026-10-23). Next is phase 9
part 3: Raw Data (4.13).

**Phase 9 part 3: Raw Data. Planned 2026-10-23, one step per commit, on
`main`; you review each step before the next.** Looked at on screen first
(1440, 1100 and 390 with touch, navy dark, a 217,000-play library). What
4.13 still gets right, and what is new:
- Text is already 13px (title, artist) and 12px (date, album), rows 32px.
  Still true: the header row scrolls away, page buttons only at the
  bottom, a ✎ on every row, lines between rows instead of zebra.
- **The filter bar is broken:** a 5-column grid holding 7 things, so
  "~ corrected only" and "Auto-correct Rules" wrap onto a second line
  out of line with each other. Every box has a label *and* a placeholder
  that say the same thing.
- The title is still the old "⊞ Raw Scrobble Data" pill (Records and
  Stats now have a plain title with a line icon). The total is in the
  accent colour, album names and dates are tinted (3.2).
- 200 rows a page, fixed; "◄ Prev / Next ►" are browser-looking buttons
  and are not translated. The ✎ tooltip and the "Autocorrected from"
  tooltip are English only.
- On a phone the filters take about 450px before the first row.
- The "Raw data" tab inside song / album / artist windows is a second,
  smaller copy (inline 12px, English headers and "Search…").

Steps:
1. **Top of the page.** Title "Raw Data" with the nav's line icon, in
   Records' / Stats' title style. The four search boxes on one row with no
   labels above them (the placeholder says it; the label stays for screen
   readers). Under them one line: the total on the left (white, 3.2), then
   "Corrected only", Clear (only while a filter is on) and Auto-correct
   rules on the right. On phones the boxes go two by two and the line
   wraps under them.
   **Done 2026-10-23:** title "Raw Data" (es "Base de datos", pt "Dados
   brutos") with the database icon, sharing Records' / Stats' title rule
   and .graphs-h2-ico. .raw-search (4 boxes, 2×2 under 601px) and
   .raw-bar (total · Corrected only · Clear · Auto-correct rules); Clear
   hides while nothing is filtered. The boxes lost their visible labels
   (now aria-labels), so the date box says "Date, e.g. Mar 2024", short
   enough for a phone. The total is ink, not accent, and sits next to its
   words (the old flex gap pushed them apart). "~ corrected only" lost its
   "~"; its tooltip is translated. Phone filters: ~450px → ~270px.
2. **Sticky.** The search bar and the table's header row stay under the
   top bar while you scroll (from 601px up, like Stats' bar); on phones
   only the header row sticks.
   **Done 2026-10-23:** .raw-filters sticks at --topbar-offset from 601px
   (page background, below the top bar's menus); the header cells stick
   under it at --topbar-offset + --raw-filters-h, which a ResizeObserver
   in app.js keeps at the bar's height (it grows when the bar wraps, e.g.
   Spanish at 601px). Phones: only the header row, under the top bar. Both
   follow the top bar when it tucks away. The header line is an inset
   shadow, since a collapsed border stays behind a stuck cell. Checked at
   1440 (10 themes), 1100, 601, 390 touch, en / es / pt-PT, while filtered.
3. **Rows.** Zebra striping instead of lines, 36px rows. Title, artist and
   album 13px sans in ink colours (album muted, not tinted); # and date in
   tabular mono, muted. Corrected rows keep their mark. The ✎ becomes a
   line icon that shows on row hover or focus (always on touch screens);
   its tooltip and "Autocorrected from" get translated.
   **Done 2026-10-23:** zebra = --text at 4% on even rows, no row lines,
   rows 36px min. Colours are mixed from --text, not --text2 / --text3:
   --text2 is blue on navy (artists read as links) and equals --text on
   red / yellow / pink dark, so .raw-table sets --raw-ink2 (82%, artist)
   and --raw-muted (62%; #, date, album). Contrast on --bg across the 10
   themes: muted 4.9–7.7:1, artist 9.6–13.1:1. Album is 13px now (was
   12px); phones keep their 12px table. Corrected rows: a 2px inset
   accent edge on # (on the date on phones, where # is hidden) plus the
   ~, whose tooltip is translated (raw_corrected_from + the field names).
   ✎ glyph → line pencil (RAW_EDIT_ICO), "Edit this play" tooltip and
   aria-label, opacity 0 until row hover or keyboard focus, always on with
   (hover: none). The "no match" row's inline style → td.raw-empty.
4. **Page controls.** One bar above and below the table: ‹ Previous ·
   "Page 3 of 1,087" · Next ›, plus first / last and "Rows per page 50 /
   100 / 200 / 500" (remembered). All translated, shared button styles.
   **Done 2026-10-23 (aa08d4f):** rawPagerHTML() draws both bars
   (#rawPagerTop, #rawPagerBottom): « ‹ Previous · Page [box] of N ·
   Next › », dc-btn buttons with translated labels; the box jumps on
   Enter / blur (clamped to 1…N). Rows per page (dc-seg, dc_rawPageSize,
   default 200) is on the top bar only, and switching it keeps the same
   first play on screen. The bottom bar shows only with more than one page
   and, when used, scrolls the top bar back under the sticky search bar
   (scroll-margin). Phones: arrows only. The old .raw-pagination markup,
   CSS and rawPrev/NextBtn listeners are gone.
5. **The Raw data tab in item windows.** The same row look as the page
   (zebra, mono dates, no inline styles) and translated headers and search.
   **Done 2026-10-23:** the panel's table (.cr-rawdata-table) now reads
   its headers from raw_th_*, the count from raw_total / raw_showing (same
   words as the page, _rawDataCount), "no match" from raw_no_match, plus
   new raw_item_search ("Search title, artist, album…") and raw_item_none
   (also used by the panel's heatmap tab). Inline styles → .cr-rawdata-
   scroll / .cr-rawdata-none / td.raw-empty. Found on screen: the chart
   table it sits inside reaches in with .chart-table td / thead th rules
   (rounded tinted pill rows, 15px text, relative header cells, no
   uppercase on phones), so .cr-rawdata-table puts the page's look back;
   its header now sticks to the top of the 400px box with the panel's
   background. The search box grows (flex 14rem, max 18rem) and the count
   drops under it on phones.
   **Fix after review (2026-10-23):** in Spanish on a phone the table slid
   sideways. The column names were nowrap: in the song / album pop-ups
   (the same buildItemRawDataHTML) the table was 338px in a 290px box
   (es), 320px (pt), and English overflowed at 320–360px too. Worse, the
   Raw Data page itself was 400px wide on a 320px phone in Spanish. Now
   header cells wrap (.cr-rawdata-table always, .raw-table on phones),
   long words in cells break (overflow-wrap: anywhere), and the pop-up
   header drops its letter-spacing on phones. Checked 320 / 360 / 375 /
   390 / 414 in en / es / pt-BR: no sideways scroll in the pop-up, the
   panel or the page. Left: at 320px every page is 2–4px too wide
   because of the top bar's Sign in button (not Raw Data).
6. **Screen check.** 1440 / 1100 / 390 touch, all 10 themes, four
   languages, sorting and every filter on the big library, no sideways
   scroll, no script errors.
   **Done 2026-10-23** (217,311 plays): all four columns sort both ways
   with the right arrow (# does not sort); song / artist / album / date
   ("2024", "mar 2024") filters and a combination return only matching
   rows; a full refilter takes ~57ms; Corrected only, Clear, the edit
   pencil (right play on page 3 at 100 rows) work; all 10 themes looked
   at; every label, tooltip and placeholder translated in en / es / pt-BR
   / pt-PT; 1100, 390 and 320 touch with no sideways scroll, sticky
   header under the top bar, bottom pager tap. Song and album pop-ups fit
   at 320 and 390. Fixed: "1 reproducciones en total" → raw_total_one
   (page and pop-ups). Left, not Raw Data's: numbers use the browser's
   1,234 grouping in every language (toLocaleString() with no locale,
   app-wide); at 320px the top bar's Sign in is 2–4px too wide on every
   page; at 320px in Spanish the search placeholders are cut off; the
   song / album pop-ups still have English section names ("Chart
   Accomplishments", "Year-by-Year Breakdown"…).

**Follow-ups, same day:** the More menu said "BASE DE DATOS" in capitals (now "Base de
datos" / "Dados brutos"); the 320px top bar fits (icon buttons 28px, Sign in
6px padding under 351px); Raw Data's search boxes use short hints at 360px
and below (raw_search_*_short, swapped by matchMedia in rawSetSearchHints);
the song and album pop-ups are translated (120 keys: sm_*, am_*, rtp_* and
three section-title keys), including the shared rating box and the
certification plaques. The rating band names stay English (Stats step 7).
Still English: the artist pop-up's table headers (RANK, FIRST STREAM…).

**Phase 9 part 3 (Raw Data) is finished** (2026-10-23). Next is phase 9
part 4: Events (4.16).

**Phase 9 part 4: Events. Planned 2026-10-23, one step per commit, on
`main`; you review each step before the next.** Looked at on screen first
(1440, light theme, top 200 artists); what was found is under 4.16. Decided
with you: tabs, keep all four views (Reel / Tiles / Table / List) as one
page-wide switch, Time Machine under Today.

Steps:
1. **Fix first.** Cache real dates and work out "in N days" / "N days ago"
   when the page loads, so a cache from yesterday puts nothing on the
   wrong day. Reels start with no left fade. Find out why New Music Friday
   returns 0 releases.
   **Done 2026-10-23:** _eventsRedate() works the counts out again from
   each entry's MM-DD on every render (cached or fresh) and moves entries
   between upcoming and recent (yesterday's "today" is now "1 day ago");
   an anniversary's number is the year it falls in minus the release year,
   so ones across New Year are right too; a release whose date has passed
   moves to Recent. **New Music Friday:** Deezer's editorial/0/releases
   (and every genre's) is empty at Deezer itself, and the chart fallback
   never added anything because chart albums carry no release date. Now
   it also reads editorial/0/selection (Deezer's picks, last 30 days
   only, since they include older albums) and looks up release dates per
   album (_nmfAlbumDetails, four at a time, top 40 chart albums). On
   2026-10-23 that gives 3 releases instead of 0, which is thin; step 5
   (Coming up) should decide whether NMF stays as its own type. **Reel
   fade: not a bug.** The Events reels and the Time Machine scroll on
   their own in a loop, so both edges fade by design; the screenshot
   caught them mid-scroll.
2. **Top of the page.** Title "Events" in Records' / Stats' title style
   with the nav's line icon. One toolbar: the four tabs (Today · Coming up
   · Recent · Calendar), the type chips with line icons instead of emoji,
   one ↻ in the corner. "Top N artists" moves to Settings or a ⋮; the
   status line goes into an ⓘ.
   **Done 2026-10-23:** title "Events" (es / pt "Eventos") with a line
   calendar, in the shared Records / Stats / Raw Data title rule. ⓘ and ↻
   sit at the end of the title row (plain icon buttons); ↻ refetches the
   events, shows and New Music Friday together, so the three Refresh
   buttons are gone. The status line shows by itself only while fetching
   (.is-loading); once loaded it opens from ⓘ. "Top N artists" was
   already in Settings (Events Calendar group), so the page's own select
   and eventsLimitChanged() went. Tabs are .dc-tabs; the open one is
   data-ev-tab on #eventsView (saved as dc_events_tab, default Today) and
   every block names its tabs in data-ev-group, one CSS rule hides the
   rest (not in Playlists' .dc-pl-mode). Until steps 4–7: Today = the
   calendar's Day view pinned to today (arrows and Month / Week / Day
   hidden; _evCalView() leaves the Calendar tab's saved view alone) +
   Time Machine; Coming up = Birthdays, Anniversaries, Upcoming
   Releases, New Music Friday, Shows; Recent = the three recent
   sections; Calendar = the calendar. Type chips have line icons (cake,
   disc, note, sleeve, wave, mic), no "Type:" label. 14 keys in four
   languages. Checked at 1440 and 390 (touch) in en / es / pt-PT, every
   tab, no sideways scroll, no errors. Still English, for step 8: the
   calendar's day and month names, the section titles under the tabs
   and the status text.
3. **One card, one switch.** One card for every event type (picture,
   title, artist, type icon, date) in all four views. One Reel / Tiles /
   Table / List switch for the page. The per-section switches, − / +
   buttons and "collapsed" hints go. One "＋ Playlist" for what's showing
   replaces the per-section ones and the calendar's Play All / Create /
   Export.
   **Done 2026-10-23:** _evCardHtml() is the one card (picture, date,
   title, artist, type icon + words); Reel shows it moving, Tiles in a
   grid (.ev-tiles), and Table / List rows carry the same icon. The eight
   per-type tile builders (renderBirthdayCard … renderNMFCard) and the
   .upcoming-card CSS went. _evNormalize gives each item a `kind`
   (birthday / album / single / ep / other / show, EV_TYPE_ICONS) and
   drops the emoji from the type words; "TODAY" is "Today". One Reel /
   Tiles / Table / List switch in the toolbar (shown on Coming up and
   Recent), still saved under the synced dc_events_view_modes key, now as
   { page, nmfPast }; an old per-section setting takes the Birthdays mode
   (checked). New Music Friday's fifth view, its calendar of past weeks,
   is a "Past Fridays" toggle in its header, and the picked week shows in
   the page's view. The − / + buttons, "collapsed" hints, emoji in the
   section titles and the dc_events_section_collapsed_* memory are gone;
   every section starts open. One "＋ Playlist" in the toolbar
   (evAddTabToPlaylist): Coming up = birthdays + anniversaries, Recent =
   the three recent sections, Today / Calendar = what the calendar shows
   (today, or the day / week / month on screen); the calendar's Play All,
   Create Playlist and Export Playlist went with calPlayAll /
   openCalCreatePlModal / openCalendarExportModal and the four
   export_pn_cal_* keys (the Create Playlist window stays, another
   feature uses it). Play All has no replacement: a playlist made here
   plays from Playlists. The Time Machine keeps its own ＋ Playlist.
   Playlists' two borrowed sections keep their own buttons (.ev-sec-pl)
   and always show as reels (_evMode). Language switch redraws the event
   sections instead of relabelling the old cards. Checked at 1440 and 390
   (touch): every view on both tabs, each tab's ＋ Playlist, Past
   Fridays, Playlists and back, no sideways scroll, no errors.
4. **Today.** Today's birthdays, releases and shows, then anniversaries
   ranked by your plays (round numbers first), about 8 plus "Show all".
   The Time Machine under them as "On this day in past years".
   **Done 2026-10-23:** Today is its own section (#eventsTodaySection,
   _renderEventsToday): the weekday and date as its title, then today's
   birthdays, releases and shows as cards, then "Anniversaries today"
   ranked by _evRankAnniversaries (round years first, then your plays of
   the release via _evReleasePlays — album plays for an album, the
   song's for a single, counted once per library — then the artist's
   place in your top artists), 8 with "Show all N" / "Show fewer". On
   those cards the date line gives your plays ("682 plays"), since every
   one is today. The calendar is Calendar's alone again (_evCalView and
   the hidden-arrows rule went). The Time Machine stays under Today as it
   is. **Play All is back** (asked for after step 3): "▶ Play all" sits
   next to ＋ Playlist and plays what the open tab shows, the first song
   now and the rest queued (evPlayTab; the same songs as ＋ Playlist,
   _evTabTracks). Checked at 1440 and 390 (touch), en and es, with 14
   anniversaries today from the test library: 8 shown, Show all 14,
   Play all on all four tabs, no errors. **Ranking changed the same day**
   (you agreed): round-first put a 10th anniversary with 1 play above a
   12th with 682, so plays lead now and a round year only counts its
   plays a fifth higher (EV_ROUND_BOOST 1.2): it passes releases played
   about as much, and goes first when nothing has plays.
5. **Coming up.** Birthdays, anniversaries, releases, shows and New Music
   Friday in one list grouped by date (This week / Later this month / Next
   3 months), anniversaries ranked and capped.
   **Done 2026-10-23:** #eventsComingSection with three groups by days
   away, named for what they hold: This week (0–6), Next few weeks
   (7–30), Later (31–90). _renderEventsComing() merges birthdays,
   releases, shows and anniversaries per group, sorted by day (on one day
   anniversaries keep Today's rank order), drawn in the page's view; each
   group shows its top 8 anniversaries with "Show all N anniversaries".
   Birthdays, Upcoming Releases and Upcoming Shows lost their sections
   (and EV_GRID_IDS entries); Anniversaries keeps its section for
   Playlists only (data-ev-group=""). Shows: the Ticketmaster credit and
   status line sit under the groups; the Shows chip now redraws Today and
   Coming up (it only redrew the calendar). **New Music Friday moved to
   Recent** instead of joining the list: it is out already and not your
   artists, so it isn't "coming up"; it keeps its section and Past
   Fridays. ＋ Playlist / ▶ Play all on Coming up: the birthdays and
   shown anniversaries (unreleased releases and shows stay out, as
   before). **List view fixed on phones** (it squeezed the title and
   artist to nothing when the type line was long): every column may
   shrink, phones stack title / artist / type beside the date, and a
   list that mixes rows with and without ＋ keeps the column so they line
   up. Checked at 1440 and 390 (touch) with 20 anniversaries over 90
   days and two shows: all four views, Show all, list sort, Shows on /
   off, Recent, Playlists, no sideways scroll, no errors.
6. **Recent.** The same, looking back.
   **Done 2026-10-23:** #eventsRecentListSection with three groups by days
   ago: Past week (1–6), Past few weeks (7–30), Earlier (31–180; recent
   birthdays and anniversaries only go back 30 days, so it is releases
   only). Coming up's code is now shared: _renderEventsList(tab) with
   _evListSources(tab) saying where each tab's birthdays, releases, shows
   and anniversaries come from; _renderEventsLists() draws both (it
   replaces _renderEventsComing everywhere, translations.js too), and
   toggleEventsGroupAll / _evGroupShowAll / _evGroupShown replace the
   Coming-only versions. Nearest first, on one day anniversaries in rank
   order, top 8 anniversaries per group with "Show all N anniversaries".
   Recent Birthdays and Recent Anniversaries lost their sections (and
   EV_GRID_IDS / EV_PL_SECTIONS entries, EV_PL_TABS went); Recent
   Releases keeps its section for Playlists only (data-ev-group="").
   New Music Friday stays after the list. ＋ Playlist / ▶ Play all on
   Recent: birthdays, releases and the shown anniversaries
   (_evListTracks). A recent release now has its own ＋ (it's out). 4 keys
   in four languages. Checked at 1440 and 390 (touch) with 24 recent
   anniversaries, 4 birthdays and 4 releases: all four views, Show all,
   es, Coming up still right, no sideways scroll, no errors.
7. **Calendar.** Month by default; a day opens that day's list. No row
   tints or left bars; the event labels in the cells use the type icons.
   **Done 2026-10-23:** only Month or Week is saved in dc_cal_view (an old
   saved "day" opens as Month); Day is reached by clicking a day: its
   number (a button), the cell around its events, a Week column's head,
   or "+N more" (calOpenDay; _calCellClick ignores clicks on an event,
   which keeps its menu). Cells show 3 events (Week 8) with "+N more";
   buildCalendarDayMap now gives each event `kind`, `src` and `item` and
   puts a day's anniversaries last in _evRankAnniversaries order. The
   events carry the type line icons (_evTypeIco); the per-type tints,
   emoji (releaseIcon went) and the Day view's coloured left bars are
   gone. The Day view is Today's layout for any day (_evDayBodyHtml,
   shared with Today): cards, then "Anniversaries" ranked with plays, 8
   until Show all (toggleCalDayAll); the old .cal-day-item rows and
   _triggerCalDayImgs went. Hover card: icon + escaped type text (it
   was inserted as raw HTML). Phones: icons only in Month and Week cells,
   3-letter day names (_calDowHtml), "+13" instead of "+13 more", equal
   columns (minmax(0, 1fr)). Language switch redraws the calendar. 3 keys
   in four languages. Checked at 1440 and 390 (touch) with real clicks:
   Month, +N more → day, Show all, an empty day, Week, a Week head, an
   event's menu, es, no sideways scroll, no errors. Still English, for
   step 8: month and day names, the week title.
8. **Screen check.** 1440 / 1100 / 390 (touch), the four check themes, all
   four languages (every hard-coded English string on the page moves into
   `translations.js`).
   **Done 2026-10-23:** 49 keys in four languages. Cards and the hover
   card: "in N days" / "N days ago" / "Today" (_evInDays, _evDaysAgo,
   _evPl for _one / _other pairs), Turning / Turned, Birthday, Live show,
   "5th Anniversary" (_evAnnivLabel: English keeps ordinalSuffix, the
   others "5.º"); New Music Friday's types use the mb_type_ keys. Table
   heads, list Sort, Month / Week / Day and their titles, ‹ › labels,
   the Playlists-only Anniversaries / Recent Releases titles and subs
   (and the playlist names they give), NMF's sub, legend, "N releases"
   pill, empty / fetching / error lines. Month and day names come from
   toLocaleDateString(currentLang) (_calMonthName, _calDayName; _CAL_MONTHS
   / _CAL_DAYS went, NMF's calendar too); the week title is "18–24 Oct
   2026" in fmtDate's order. Status lines (events, shows, NMF) are built
   from keys and kept as painters (_evSetStatus) that setLanguage repaints
   (_evRepaintStatuses); dates in them use currentLang. The Time Machine
   title lost its ⏳ and capitals ("Time Machine", section-header-h2 like
   the rest). Checked with a script: 1440 / 1100 / 390 (touch) × en / es /
   pt-BR / pt-PT × every tab, Coming up in all four views, Month / Week /
   a day, the hover card and the status lines, scanning for English words
   and sideways scroll: none left (pt's "Playlist" and "plays" are their
   translations), no errors. Screenshots in Navy dark, Navy light, Yellow
   dark and Red light looked right. Not Events: the footer's "Questions or
   issues?" is still English everywhere.

After Events: Awards (4.17), Soundtrack (4.18), then the rest, each looked
at on screen first.

**Phase 9 part 5: Awards. Planned 2026-10-24, one step per commit, on
`main`; you review each step before the next.** Looked at on screen first
(1440 and 390 touch, navy dark, sample library); what was found is under
4.17. Decided with you: ceremony full screen, "View Ceremony" at the top
and the bottom, Stats & records folded closed.

Steps:
1. **Fix first.** Spotlight rows keep the song name and put the
   collaboration note ("with a DJ/producer") on the second line, inside
   the card. Picker rows stop cutting off their last buttons.
   **Done 2026-10-24:** _awardsScoreParts() splits a score at " · " into
   the count (the part that says plays) and the note; Spotlight rows keep
   the count at the right (max 40%, …) and put the note on a third line
   under the artist (.aw-spot-rnote). The hero card still shows the whole
   score. Picker rows: the artist · year line shrinks with … and the count,
   chips, ♪ and YouTube buttons never shrink, so nothing leaves the row
   (checked: 0 of the rows overflow). The "-" year chip and the stacked
   tags are step 6.
2. **Top of the page.** Title "Awards" in the shared Records / Stats /
   Events title style with the nav's line trophy. My Grammys / Real-Life
   as .dc-tabs. One toolbar: ‹ year ›, Configure Year, Generate Nominees,
   and once there is a winner, View Ceremony (gold) + Share. The bottom
   View Ceremony + Share stay.
   **Done 2026-10-24:** title "Awards" (es "Premios", pt "Prémios" /
   "Prêmios") with a line trophy (the bottom bar's, redrawn on 16px) in
   the shared title rule (#awardsView added to it). My Grammys /
   Real-Life were already .dc-tabs. The year bar gets View Ceremony + Share
   (.awards-top-ceremony) after Generate; _awardsShowCeremonyBtns() shows
   it and the bottom bar together once any category has a winner. Both
   copies: squared gold button (#fcd34d → #f0aa30, dark ink, the same in
   every theme) with a line trophy instead of 🎬, Share with a line link
   icon instead of 🔗 and its own key (awards_share_btn); the 🎬 left
   awards_ceremony_btn in all four languages. At 390 the year bar wraps to
   three rows (year + Configure, Generate, Ceremony + Share).
3. **Stats & records folded closed.** One row: "2025 at a glance",
   the title, the headline numbers and the leader, and Open ▾. Open, it
   is the full block as today; open / closed remembered on this device.
   The ceremony's opening and closing slides keep the full block.
   **Done 2026-10-24:** _awardsSummaryHtml takes opts.foldable (only the
   tab's copy passes it): the header becomes a row (text + Open / Close
   button, aria-expanded), the numbers line gains "· most: <artist> (N)",
   and the groups move into .aw-sum-body, hidden by .is-folded. Folded is
   the default; awardsToggleSummary() flips it in place (no rebuild, the
   pictures stay) and saves dc_awards_sum_open. The ceremony slides don't
   pass foldable, so they show the whole block with no button (checked
   with a script, 1440 and 390: a real click opens it, a re-render keeps
   it open, the opening slide is full).
4. **Ballot.** One toolbar row (left-to-decide, Hide decided, All / No
   winner, Expand / Collapse, View). Type label as the compact uppercase
   label used elsewhere. Empty categories as a short card (title + "Pick
   nominees"), no dashed box. "Click a nominee to crown the winner" said
   once in the toolbar, not on every card.
   **Done 2026-10-24:** Expand all / Collapse all are icons at every width
   (names in title + aria-label), so the tools and the View switch share
   one row at 1440 and 1100 (checked: same top). "Click a nominee to crown
   the winner" is .awards-bar-hint, a full-width line under that row,
   shown while anything is left to decide; it left the ballot cards, the
   art views and the Spotlight hero (the reorder hint stays per card).
   The kicker is t('awards_cat_type_*') (it was the raw English type) as
   the compact uppercase label (0.68rem, 600, 0.07em). Empty categories:
   one quiet "No nominees yet." line, no dashed box, so the card is about
   half as tall.
5. **Configure Year panel.** Category cards give the name the full width
   (badge, ☆ and switch on their own row or smaller); the list is part of
   the page, not its own scroll box; the two filter rows become one.
   **Done 2026-10-24:** .awc-card is a grid: icon | name + hint (the whole
   middle column) | switch, with the type / auto badges and ☆ on a second
   row (badges under the text, ☆ under the switch). .awc-list lost its
   max-height and scroll; group heads stick under the top bar
   (var(--topbar-h)). Enable All / Disable All / Favorites only moved up
   to the "Categories for this year" row, so search + Type + Status share
   one row at 1440 (checked: same top). **Bug found and fixed:** a click
   on a category card did nothing. The card is a <label> and its first
   labelable child was the ☆ <button>, so the label pointed at the star,
   not the switch; it now has for="awcIn_<id>" (checked with real clicks:
   the card name turns it on, the switch turns it off).
6. **Nominee picker.** Genre tags on one line (more hidden behind "+N"),
   no "-" chip for a missing year, row buttons always inside the row.
   **Done 2026-10-24:** each row's title and "artist · year" are one
   column (.awards-picker-main, title over artist, both with …), like the
   nominee cards, which frees the width the chips need. Genres: two (three
   in genre categories) then a "+N" chip with the rest in its tooltip, on
   one line; on a row still too full the box shrinks and the last chip
   fades out (.is-clipped, set by _awardsPickerMarkClipped after each
   render and lookup). **The "-" chip was not a year:** it was a genre tag
   whose sheet value is "-" (a blank genre cell); those are dropped. A
   score that isn't a number (NaN from an artist with no rated albums)
   now shows no chip instead of "—", in the picker and on the cards.
   Checked at 1440 and 390: 0 rows overflow, every row at 1440 is 52px.
7. **Ceremony, part 1: the stage.** Full screen, slim top bar (year,
   progress dots, ☰ Categories, 🔊, ✕), category name big in Bricolage,
   nominees as big covers, Previous / Next at the bottom; ☰ opens the
   category list as a drawer. Phone: everything incl. Open envelope fits
   without scrolling, nothing under the top buttons.
   **Done 2026-10-24:** the overlay fills the screen (no box, no
   backdrop): a grid of top bar / stage / nav. Top bar: title, progress
   dots (_ceremonyPaintDots: one per category, current long and gold,
   opened ones gold-tinted), ☰ Categories (label hidden on phones), 🔊, ✕
   (line icon). The sidebar is now a drawer under ☰
   (ceremonyToggleDrawer, .is-drawer-open); picking a row closes it, a
   click on the stage closes it, Esc closes it before it closes the
   ceremony. Category name: Bricolage 750, clamp(30px, 5.2vw, 72px).
   Covers clamp(110px, 10.5vw, 150px), eight in a row from 1100px; on a
   phone four a row with the artist line hidden. Previous / Next is its
   own bar under the stage (it used to float over the opening slide's
   list). The stage keeps the page theme's surfaces with a soft gold glow.
   Checked at 1440 and 390 (touch) with real clicks: Open envelope is on
   screen with no scrolling (390: button bottom 612 of 785), the drawer
   picks a category and closes, Esc leaves, no sideways scroll.
8. **Ceremony, part 2: the reveal.** The winner shows once, large, with a
   gold glow; the others become a dimmed strip. Confetti off with reduced
   motion. The opening (Stats & records) and closing (The Winners) slides
   fit the full-screen stage; the shared-link viewer uses the same stage.
   **Done 2026-10-24:** on .is-revealed the winner panel comes first
   (CSS order) and the field becomes a strip of small dimmed covers under
   it (names hidden, the winner's cover ringed), so the winner shows once.
   Winner cover clamp(200px, 24vw, 340px) with a #f0aa30 ring and glow,
   name in Bricolage clamp(26px, 3.4vw, 46px), WINNER as the uppercase
   label. The reveal scrolls the stage to the top now (it rode to the
   bottom when the winner was last). Reduced motion: no confetti
   (_cerReducedMotion), no envelope float, flap swing, card ride or
   winner pop, and the scroll jumps. The opening and closing slides' record
   cards keep the art beside the text now that the stage is wide (stacked,
   the Song card's title ran past its edge: checked 0 names past a card).
   Shared links use the same overlay, so they get all of this. Checked at
   1440 (90 confetti pieces) and 390 with reduced motion (0 pieces).
9. **Real-Life Awards.** Cards size to their rows (a one-nomination
   artist gets a short card with a smaller photo); category names in
   normal case ("Song of the Year").
   **Done 2026-10-24:** both Real-Life card builders (Grammys and the
   Wikipedia shows) add .is-short when a card has one or two rows
   (_rlCardCls): the portrait is a 72px square (60px on a phone) instead
   of 132px tall, so those cards are as short as their rows. Categories go
   through _rlCatCase(): small words after the first (of, the, for, and…)
   back to lower case when grammy.com wrote them capitalised ("Album Of
   The Year" → "Album of the Year"; "Best R&B Song" is left alone).
   Checked on the 2026 Grammys: 12 cards, 9 short, no Title Case left.
10. **Screen check + four languages.** 1440 / 1100 / 390 (touch) × en /
    es / pt-BR / pt-PT × every view and the ceremony, scanning for English
    and sideways scroll; the generate status lines ("Loading year data…",
    "Calculating …", "Saving…") through keys. Navy dark / light, Yellow
    dark, Red light screenshots, with gold checked on the light themes.
    **Done 2026-10-25:** **the cards never changed language:** a switch
    left My Grammys, the category list, Real-Life Awards and an open
    ceremony or picker in the old language, though most of their words had
    keys. awardsOnLanguageChange() (called from setLanguage) redraws them
    from what is loaded. 153 new awx_* keys in four languages: the Stats &
    records block (_awPl for _one / _other), the Spotlight hero, card
    tooltips, the year steppers, the generate status lines, the four
    Configure Year switches, the picker's head, sort, groups, fit chip and
    tips, "Show N more", the ceremony (title, Before the show / Start the
    show, The Winners, Roll call, All winners, Meet the nominees, preview
    lines, sound button, showcase buttons, the guest's "Make your own"
    link) and Real-Life Awards (ceremony name "68.ª edición…", Held ·
    honouring, the tally, wins · all-time, Won / Nominated, that season,
    Every category, the checking line). **Scores are saved in English on
    the ballot** ("173 plays · with a DJ/producer", "94 summer plays",
    "12-day streak"…), so _awScoreText() translates them when shown, one
    " · " part at a time by pattern, and leaves unknown parts alone.
    Checked with a script: 1440 / 1100 / 390 (touch) × en / es / pt-BR /
    pt-PT × the tab, Spotlight, Reel, Configure Year, picker, ceremony
    (opening, a category, the reveal, the drawer, the roll call) and
    Real-Life Awards: no English left in visible text (Gemini API Key is a
    name; pt's "plays" is its translation), no sideways scroll, no errors.
    The ☆ on a category card stars it and leaves the switch alone. Navy
    dark, Navy light, Yellow dark and Red light screenshots looked right;
    the gold button and ring read on the light themes. **Still English:**
    the picker's stat sort options and stat lines (Song / Album / Artist of
    the Year), the picker's preview panel, the Share dialog, the
    showcase's step lines, and play counts written 1,895 in every language
    (tCount uses the browser's number format, as elsewhere on the site).

**Phase 9 part 5 (Awards) is finished** (2026-10-25). Next is phase 9
part 6: Your Soundtrack (4.18), looked at on screen first.

**Phase 9 part 6: Your Soundtrack. Planned 2026-10-25, one step per
commit, on `main`.** Looked at on screen first (what was found is under
4.18). Decided with you from the options page: 1C, 2A, 3A. You said to
build it all without a stop per step.

Steps:
1. **Fix first.** Phone Monthly Activity: the bars scroll sideways with
   room for every number. Discovery bubbles show initials until the
   picture arrives. Dates in words (11 Feb 2026) in milestones and streaks.
   **Done 2026-10-25:** months keep 46px on a phone (room for "4,511"),
   so the chart scrolls sideways instead of overlapping (checked: 0
   overlaps at 390). Bubbles start with initials (0 empty circles).
   Milestone and streak dates go through fmtDate() ("11 Feb 2026"); the
   streak day keys are read at noon so they can't slip a day.
   The coverflows already start with #1 in the middle: the space on its
   left is where #0 would be, so that stays as it is.
2. **Top of the page.** The shared page title (as Records / Stats /
   Events / Awards) with the nav's note icon, Year / Month / All-Time and
   the shared ‹ 2026 › stepper. Chart History Replay and Share also in
   this toolbar.
   **Done 2026-10-25:** title "Your Soundtrack" in the shared page title
   (#soundtrackView added to the rule) with the nav's note, heads filled.
   Year / Month / All-Time, then the Awards stepper pill with line
   chevrons (aria names st_nav_prev / st_nav_next) around the period, then
   Chart History Replay (Year only; stJumpToReplay() scrolls to the replay
   and starts it) and Share (opens the share window) on the right. On a
   phone the buttons wrap to a second row. The old ◄ ► buttons and the
   🎬 label are gone with their CSS.
3. **Chapters.** Boxes go; each section becomes a chapter with its
   headline band and the full detail under it. Chapter 1 = year, the five
   tiles (line icons for the emoji) and the reel.
4. **#1 artist** (2A).
5. **Long parts** (3A): Still in Rotation and streak records as swipe
   rows.
6. **The rest of the emoji and the bottom boxes:** line icons in chips,
   milestones and streaks; Grammys as a chapter only when there is
   something to show (a line with a link to Awards otherwise); Replay and
   Share as the closing chapter.
7. **Play your year:** the full-screen story.
8. **Four languages and screen check:** 1440 / 1100 / 390 × en / es /
   pt-BR / pt-PT × a few themes.

The period picker does not need moving into one place:
it already is (see 4.4). What is left is making it slim enough to live in
the top bar.

**Phase 6 (Weekly page).** The Bubbling Under legend is off by default,
so the "legend in a ⓘ" part of 3.8 is less urgent, though the coloured tags
on the rows themselves are still there and still need 3.8.

**Phase 7 (layouts and the action menu): now more urgent.** With YouTube
off, a table row has no play button by default, so the "one action set"
(▶ on hover, ⋮ per row, right-click) is now how most people will play
anything from a chart. Do the action set first within phase 7. The ▶ on
hover plays a 30-second store sample, not YouTube (decided 2026-10-14, see
4.9b point 2), so browsing a chart doesn't use up the YouTube allowance. Also:
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

**Phase 8 (shared components).** The Playlist and YouTube switches are
gone from the charts (phase 7 step 4 / 7), but the YouTube/＋ pair rule
(`.yt-play-btn:has(+ .dc-pl-add-btn…)` in `style.css`, plus an icon-only
version for phones) is still used by the Streaks table (`sk-et-yt`) and the
new-artist tooltip (`na-tt-yt-btn`). When the shared button replaces
`yt-play-btn` there, delete those rules with it.

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

**Portuguese and reduced motion:** checked 2026-10-14 with phase 6 step 5.

### Done outside the phases (to 2026-10-18)

Work that isn't a plan step but changes what the later phases start from.

- **Daily tab** (its own plan, see the Daily memory; `daily.js`). On
  2026-10-18 the day panel and Your day moved from above the chart to
  right after it (`#dailyDay`), so the chart comes first, as phase 6 did for
  Weekly. The compare switch and actions now use the chart type switch's
  tray style with line icons instead of emoji (3.4 and 3.5), the #1 line is
  a gold chip, Animate Chart matches the ⋮ button. Phase 8 can treat these
  as already on the shared segmented control.
- **Records → Streaks badges:** 12 → 164 badges in groups (One long streak,
  Side by side, Comebacks, Deep fans, All three kinds, Calendar…), each
  group folds away and remembers it, ladders with names that climb, four
  languages. Phase 9 (Records) should look at this screen as it is now,
  not as section 6 last listed it.
- **Your Soundtrack:** the chart history replay steps a week at a time
  (‹ ▶ ›); "Banda Sonora" in Spanish and the banner translated. Phase 9.
- **Portuguese/Spanish wording:** Bubbling Under = "Aspirantes"; Spanish
  chart tables say "vez / veces", header "Escuchas".

**Found while reviewing these, small, worth fixing soon:**
1. ~~**A 10px label** in the new day panel tiles (`.dy-ptile-lbl`), below
   the 12px floor (3.1).~~ **Fixed 2026-10-18:** `--fs-xs`, 0.04em
   tracking. At 12px "PRIMEIRA 15:13" ran past a phone tile (the label and
   time had no break between them), so the label is now a wrapping row and
   the time drops underneath when it doesn't fit.
2. **On repeat still rotates with reduced motion on.** `dyRepStart()` swaps
   the timer bar for a `setInterval` under `prefers-reduced-motion`, so the
   tile still changes on its own. The rule (section 5, "How to check")
   is that nothing moves by itself: under reduced motion, show the first
   song and let a click step through.
3. **Portuguese "plays" isn't settled after all.** Phase 6 recorded that
   Portuguese says "play / plays" everywhere, but newer strings (Daily's
   `dy_week_avg`, the chart insights `ati_*`, the streaks `sk_*`) say
   "reproduções". Pick one and make the pt-BR / pt-PT strings match; this
   is a wording call, so it's yours.

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
- ~~Events (and its calendar)~~ seen 2026-10-23, see 4.16
- Awards (My Grammys, Real-Life Awards, the ceremony screen)
- Your Soundtrack
- Playlists, Board, Charts Guide
- A song, an artist and an album pop-up
- One share-as-image window
- Settings (all three tabs)
- The landing page (signed out)
- **Any page on a phone.** The most useful one still missing.
