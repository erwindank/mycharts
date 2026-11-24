# Album roll-up switches — pre-evaluation and plan

Written 2026-11-23. Nothing here is built yet.

The idea: plays of a song from its single, EP or deluxe edition can also count
for the main album, and the user decides how through switches. This file checks,
switch by switch, that every screen would change the right way before any code
is written.

---

## How the app counts this today (why most screens follow on their own)

There is one shared step that answers "does this play also count for an album,
and which one?" (`rollupParentOf` in app.js, built from `rollupMap`). Almost
every screen that ranks or certifies albums asks that step:

| Area | Asks the shared step? |
|---|---|
| Albums chart (week / month / year / day) | yes |
| All-Time albums chart | yes (counts early single plays) |
| Chart runs, peaks, Bubbling Under, Off the Chart, New Entries | yes |
| Records rankings (#1s, weeks on chart, debuts…) | yes |
| Records certifications table | yes |
| Cert badges on chart rows (period charts) | yes (fixed today, b21bcda) |
| Certification wall reel, "Certified this period", notifications | yes (fixed today, b21bcda) |
| Album window (total, plaques, Tracks, Song Chart tab) | yes |
| Artist window album rows, favourite album, album cert count | yes (fixed today) |
| Stats → Top Charts | yes |
| Listening Scores, All-Time insights, Daily, Replay | yes |
| Smart playlists / chart playlists | yes — they read the charts |

**So any switch built inside that shared step reaches all of the above with no
extra work.** That is the main safety net.

### Places that counted albums on their own (gaps) — FIXED 2026-11-23

Gaps 1–4 and 6 below were fixed in one commit (single plays now count toward
the album in Awards nominees + picker, Album of the moment, Records album
milestones, Stats top albums; the album and artist window plaques certify on
the same figure as Records at both levels). Gap 5 left as is on purpose.
Checked in a browser with a made-up single-then-album library.


These ignore "singles count toward their album" even now. Each needs a
decision, separate from the new switches:

1. **Awards nominee list (album categories)** — nominee play counts are the
   album's own plays only. Suggest: follow the switch, counting single plays
   from the album's release date on (awards cover one year, like a period chart).
2. **"Album of the moment" spotlight** (last 21 days) — own plays only.
   Suggest: follow the switch, from release date on.
3. **Records album milestones** ("fastest to 100 plays") — own plays only.
   Suggest: follow the switch, counting every play (it is a running total).
4. **Stats tab top albums** (stats.js) — own plays only. Suggest: follow the switch.
5. **Records album streaks and back-to-back runs** — own plays only. Suggest:
   leave as is. A streak is "days you played this release", and a single isn't it.
6. **Album plaque in the album window at the "Album page only" level** — counts
   the single's plays, while Records doesn't. Switch 8 settles this.

Playlists only use album names to pick a cover, so they are unaffected.

---

## The 8 switches, one by one

Each entry: what it does → how it gets everywhere → what could go wrong → how
it gets checked.

### 1. EPs count toward their album
*Off / Album page only / Charts too* — same choices as singles.

- **How:** the shared step today only looks at releases marked "single". It
  would also look at "EP". Every screen in the table follows.
- **Rule:** an EP's songs can only count for a real album, never for another
  EP or a single. Matches what we agreed (the two "A Minute…" EPs don't share).
- **Risk:** if EPs sit *with* albums on the same chart, the EP and the album
  would both rank with the same plays. **Guard:** like singles today, "Charts
  too" only works while EPs are Apart or Left out; otherwise it acts as
  "Album page only".
- **Check:** an EP-then-album artist (e.g. Myles Smith) on: album chart rows,
  All-Time, album window total, Records certifications, cert wall, a past
  week's chart before the album came out (must be unchanged).

### 2. Each song finds its own album
*On / Off (off = today: the whole single goes to one album)*

- **How:** the shared step today stores one album per single. It would store
  one album per song on the single. Screens ask per play, so none of them
  notice the difference.
- **Risk:** low. The album window line "counted from these singles" must list
  a single under every album it feeds.
- **Check:** a two-song single whose songs landed on two albums — each album
  gains only its own song's plays; the totals of the two together equal the
  single's plays of those songs.

### 3. Which album gets the plays
*First album the song was on / Most-played album (today)*

- **How:** chooses the winner inside the shared step. "First" uses the
  album's start date (typed date → date found online → first play).
- **Decided (user, 2026-11-23):** the album's start date is already editable
  on the album page, so a wrong pick is fixed by hand there. Decide by that
  date (typed → online → first play).
- **Check:** a song on a studio album and a later greatest-hits — the studio
  album wins, even if the greatest-hits has more plays.

### 4. Plays from before the album came out
*Count them on All-Time and certifications (today) / Only from release day on*

- **How:** one flag inside the shared step. Period charts already only count
  from release day; this switch extends that to All-Time, certifications and
  the album window.
- **Risk:** low. With it off, an album's total in its window will be lower
  than "single + album" added by hand — the window should say so in a line.
- **Check:** album window total, All-Time chart and Records certifications all
  show the same number.

### 5. Deluxe editions join the main album
*On / Off*

- **Different from 1–4.** A deluxe sits on the same Albums chart as the main
  album, so "also counts" would show the album twice. Instead the deluxe's
  plays are **filed under the main album's name** while the library loads —
  the same trick already used for "Lover" the single vs "Lover" the album.
  Every screen then sees one album, no double rows.
- **Which album is "main":** the app already recognises deluxe titles
  ("Deluxe", "Expanded", "Anniversary Edition", "Platinum Edition"…, not
  "Taylor's Version"). The main album is the same artist's album with the
  title minus that part. If there is no such album, nothing happens.
- **Your data is untouched:** the sheet, Last.fm and Raw Data still show the
  real deluxe name; editing a play edits the real name.
- **Risk:** a ratings, release-date or award pick saved on the deluxe album
  would be "hidden" while merged. **Guard:** when merging, the main album shows
  the deluxe's rating if it has none of its own; past award winners are
  untouched (they are saved by name).
- **Check:** the deluxe disappears from charts, Records and the cert wall; the
  main album's total = both added; Raw Data still shows "(Deluxe)".

### 6. What joins from a deluxe
*The whole deluxe / Only the songs both versions share*

- **How:** with "only shared songs", plays of bonus songs keep the deluxe name
  and the deluxe keeps a chart row with just those plays.
- **Risk:** that deluxe row will be small and rarely certify — expected, but
  worth a line in the switch's description.
- **Check:** bonus song plays stay on the deluxe row; shared song plays move.

### 7. Greatest hits and compilations get single plays
*On / Off (suggested default: off)*

- **How:** inside the shared step, a compilation can't be picked as the album.
- **Decided (user, 2026-11-23):** an artist's own best-of gets its own mark,
  "Best-of / Greatest hits", separate from "Treat as compilation" (which moves
  the album to Various Artists — a best-of stays the artist's). Set by hand on
  the album page; title words ("Greatest Hits", "Best of"…) may only suggest it.
- **Check:** a song on a studio album and a best-of — only the studio album
  gains; with no studio album, the plays stay on the single.

### 8. Certifications use combined plays
*Follow the charts setting (today) / Always / Never*

- **How:** today certifications follow "Charts too". This gives them their own
  setting. Places that read it: Records certifications, cert wall and reel,
  notifications, chart-row cert badges, album window plaques, artist window
  album plaques, Listening Scores weights.
- **Risk:** the album window plaque and the Records table must read the same
  setting, or they disagree (gap 6 above).
- **Check:** pick an album right at a plaque threshold; flip the setting; every
  place listed above shows the same plaque.

---

## Warnings on the switches (user, 2026-11-23)

Instead of the app deciding for everyone, each switch shows a plain warning
under it about what it will do, so the user decides if that works for them.
Shown only for the choices that trigger it; the in-site warning window
(never browser confirm()) when turning on the ones that rewrite history.

- **Deluxe join (5):** "Past charts change: where the deluxe charted on its
  own, that week now shows the main album with both counts. #1s, weeks on
  chart and certification dates can move. Ratings, dates, covers or awards
  saved on the deluxe are hidden while this is on and come back when off."
- **Deluxe "only shared songs" (6):** "The deluxe keeps a small row with only
  its bonus songs; it will rarely chart or certify."
- **EPs / singles at "Charts too" while set With albums (1):** "EPs are on the
  Albums chart, so this works like Album page only — set EPs Apart or Leave
  out for the charts to count them." (same note for singles)
- **Each song its own album (2) / which album (3):** "If the wrong album gets
  the plays, change the album's start date on its page."
- **Plays before release (4), off:** "The album page total will be lower than
  the single + album added up."
- **Compilations get single plays (7), on:** "A best-of and the original album
  can both gain the same single's plays."
- **Certifications setting (8):** "Turning this on can award several plaques at
  once" (and no notification burst, see below).
- Any switch that can move charts: a one-line preview of what changes
  ("12 albums go up, 3 new plaques, 2 chart #1s change") inside the warning.

## Safety rules for every step

- **Off = no change.** Before and after each step, compare with real plays:
  albums chart for 3 past weeks, All-Time, Records #1s and certifications
  table, cert wall count, one album window, one artist window. With every new
  switch off, all must match exactly.
- **Nothing is ever written back.** Plays, sheet and Last.fm stay as they are.
- **Preview before turning on.** Each switch shows what it would change
  ("12 albums go up, 3 new plaques, 2 chart #1s change") before it is applied.
- **No notification burst.** Turning a switch on marks the certifications and
  records it creates as already told.
- **Awards picks already made stay.** Only nominee play counts can change.
- **All three data sources** (Last.fm, Google Sheet, uploaded file) — nothing
  here depends on the source; it only needs album and artist names.

## Steps

1. Close gaps 1–4 above (Awards nominees, Album of the moment, milestones,
   Stats top albums) so everything follows today's switch.
2. Settings: new "Album roll-up" group with the switches, all set to today's
   behaviour, plus the preview.
3. Switch 2 (each song its own album) and 3 (which album).
4. Switch 7 (compilations).
5. Switch 1 (EPs).
6. Switch 4 (plays before release).
7. Switch 8 (certifications setting).
8. Switches 5 and 6 (deluxe editions).
9. No-burst notifications, album window "where these plays come from" line,
   translations (ES / PT), What's New card, changelog.

Each step is committed on its own and checked with the safety rules above.
