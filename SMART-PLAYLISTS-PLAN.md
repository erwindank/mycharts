# Smart playlists — plan

Smart playlists are playlists that build themselves from rules, like Rocket
Player's, but using everything dankcharts knows about a song: plays, chart
peaks, weeks at #1, certifications, ratings, genres, listening habits.

Built step by step. Each step is reviewed before the next one starts.

**The one idea everything rests on:** a smart playlist is a *saved set of
rules*. Ready-made lists, the builder, presets, sharing, Mix it,
notifications: they all run the same rules engine. Nothing is a one-off.

Started 2026-11-08 from a talk about Rocket Player's smart playlists.

Decisions (2026-11-08):
- **Chart rules let you pick the chart:** every chart rule (peak, weeks on
  chart, weeks at #1, debut, climbs, chart runs…) has its own chart choice:
  Daily, Weekly, Monthly or Yearly. Weekly is the default.
- **Ready-made lists sit among the other playlists** in the library grid, not
  in a row of their own. They carry the same "Smart playlist" label as the
  user's own smart lists.

---

## Ground rules

- **All three data sources.** Every rule is worked out from the play history
  (`allPlays`) and the things built from it (chart runs, certs, ratings,
  genres), so it works the same for Last.fm, Google Sheets and CSV. A rule that
  needs data the user doesn't have (e.g. genres with no Artist Genres tab, or
  ratings when nobody has rated anything) still shows up in the builder, but
  greyed out with a short "needs genres" / "needs ratings" note. It never
  breaks the list.
- **Songs only** to start (like automatic chart playlists). Albums/artists
  could be added later as a rule "type".
- **Lives in the Playlists tab**, next to normal and automatic playlists. Same
  library grid (`.plx-card`), same open-playlist page (`_dcPlDetailHtml`),
  same Play / Shuffle / Export buttons.
- **Stored with the account.** Rules sync across devices for signed-in users
  (Firestore doc `users/{uid}/data/smartPlaylists`). Signed-out users keep them
  in localStorage, the same as playlists today.
- **4 languages** (English, Spanish, Portuguese BR, Portuguese PT) for every
  label, rule and plain-words sentence.
- **Confirmations** use `dcConfirmBox`, never `confirm()`.
- **Comments in the code.** Bump `?v=` on style.css and any lazily loaded file.
- New code goes in its own file, **smartplaylists.js** (prefix `sp`), loaded
  the way autoplaylists.js is. Only small hooks go into app.js.

---

## How it fits together

```
          rules (saved)                       one engine
  ┌──────────────────────────┐       ┌─────────────────────────────┐
  │ ready-made lists (ours)  │──┐    │ spSongFacts()  per-song     │
  │ your own lists (builder) │──┼──▶ │   facts, built once, cached │
  │ shared rules (Board)     │──┘    │ spRun(rules) → songs        │
  └──────────────────────────┘       └──────────────┬──────────────┘
                                                    │
           ┌──────────────┬───────────────┬─────────┴─────┬──────────────┐
           ▼              ▼               ▼               ▼              ▼
     live playlist   frozen snapshot   live count     Mix it      changes +
     (re-runs)       (normal playlist) in builder   (blends lists) notifications
```

---

## The rules engine

### Song facts (built once per data load)

`spSongFacts()` makes one record per song (key = artist|||title, the same key
as `_dcPickKey`), cached and rebuilt when the data changes (same generation
check as `_crFull`). Each record holds:

| Group | Facts |
|---|---|
| Basics | title, artist, album, genre(s), release type (single/EP/album track), release year if known |
| Plays | total plays, plays in a date range, first played, last played, most plays in one day |
| Habits | share of plays at night (22:00–05:00), on weekends, by hour/weekday |
| Charts (per chart type the rule picks: daily, weekly, monthly, yearly; weekly by default) | peak, weeks on chart, weeks at #1, debut position, biggest climb in one week, number of chart runs (dropped off and came back), longest run, weeks it took to reach the peak |
| Certs | certification level (from `buildCertTimeline`) |
| Ratings | song score, and whether it's above the user's average |
| Relative | rank by plays (whole library), top-X% flag, "artist's most-played song", "only song the artist is really played for" |

Heavy facts (chart behaviour, habits) are filled in only when a rule asks for
them, so a simple "most played" list stays fast on big libraries.

### Rules

A rule = field + condition + value. Examples:

- `plays` `at least` `50`
- `last played` `more than` `180 days ago`
- `genre` `is` `Pop`
- `weekly peak` `top` `10`
- `chart runs` `at least` `2` (came back after dropping off)
- `plays at night` `more than` `50%`
- `in playlist` `is not` `Gym`

A **group** = rules + "match all" or "match any". Groups can sit inside
groups, but the builder shows only one level of nesting to keep it simple.

### List settings

- **Limit:** number of songs (or none)
- **Sort:** plays, last played, first played, peak, rating, random, title, artist
- **Artist limit:** at most N songs per artist (optional)
- **Mode:** Live (re-runs every time) or Frozen (saved once as a normal playlist)

### Combining playlists

Rules can point at other playlists (normal, automatic or smart):
- "in playlist X" / "not in playlist X"
- "in both of these smart lists"
A smart list can't point at itself, and loops (A uses B, B uses A) are
blocked with a short message.

### Plain-words sentence

Every rule set is turned into one sentence that goes under the title, e.g.
"Pop songs that hit the top 10, not played in 3 months, up to 50 songs".
The same text is used in the builder preview, on Board posts and in
notifications.

---

## Ready-made smart playlists

Written with the same rules as the builder, so each one can be opened in the
builder as a preset ("Edit a copy").

| List | Rule in plain words |
|---|---|
| Heavy rotation | most played in the last 30 days |
| Forgotten favourites | lots of plays overall, none in the last 6 months |
| New to you | first played in the last 30 days |
| Never charted | played often, never on the weekly chart |
| Your #1s | every song that reached #1, in the order it happened |
| Top rated | highest-rated songs |
| On this day | played this week in earlier years |
| One-hit wonders | the one song you really play by artists you otherwise don't |
| Slow burners | took 8+ weeks to reach the peak |
| Your year in 50 | the top 50 of a year you pick |
| Almost #1 | peaked at #2 |
| Deep cuts | album tracks from albums you love that you rarely play |

Ready-made lists the user's data can't support (no ratings, no chart history
yet) are hidden, not shown empty.

---

## Using them

- **Badge on the card:** a small "Smart" mark plus "3 added · 1 dropped since
  last time".
- **Live count** while building: "128 songs match", updated as rules change.
- **Freeze:** "Save as playlist" on any smart list makes a normal, editable
  copy of today's songs.
- **Mix it:** pick 2–4 smart lists and a size; it takes songs from each in
  turn (no repeats, artist limit respected) and plays them or saves them.
- **Notifications:** an opt-in "tell me when this list changes a lot" switch
  per list, using `dcNotify` and a new `sp_changed` kind in `NT_KINDS`.
- **Share on the Board:** post a list's *rules* (not songs). Others see the
  plain-words sentence and an "Add to my playlists" button that runs the
  rules on *their* library.

---

## Steps

Each step ends with a review. Commit per step.

Progress: step 1 done 2026-11-08 (7debb69). Step 2 done 2026-11-08. Chart
facts read the site's own chart runs, so first use of a chart rule on a very
big library (250k plays) takes about 1 second to build that chart's history,
the same time the Charts tab needs for it. Rules run in a few ms after that.
Step 3 done 2026-11-08. A smart playlist is a normal playlist (so player,
export, Play/Shuffle all work) plus rules in its own store/Firestore doc
(smartPlaylists). Songs are re-run on data load, sign-in and when opened, and
only written when they change. Smart lists keep at most 500 songs (they sync
inside the one playlists doc, 1 MB max). Songs can't be added/removed/dragged
by hand; the add-to-playlist picker leaves smart lists out.
Step 4 done 2026-11-08. The ready-made lists are added once per account
(flag `seeded`, synced), only the ones the library can fill; names in the
language in use then. Deleting one hides it; a "Ready-made smart playlists"
row under the grid adds it back (this answers open question 3). Your year in
50 has a year picker, On this day a This day / This week switch. Deep cuts =
songs past the 3rd most played on one of your top 25 albums. Two devices
never keep two copies of one ready-made list (merge keeps the account's).
Step 5 done 2026-11-08. Builder window #spBuilderModal: "New smart playlist"
card in the grid, "Edit rules" on an open smart list. Name, start from (blank
or a ready-made list, new lists only), all/any, rule rows, one level of
groups, sort + order, size, songs per artist, Keeps updating / Save once
(Save once = a normal playlist with today's songs; on an existing smart list
it turns it into a normal one). Live count, sentence and first 8 songs.
Fields the library can't use are greyed with "(needs …)". Editing a
ready-made list keeps its id but drops its picker (readyEdited).
Step 6 done 2026-11-09. Rule "Playlist has the song / doesn't have the song"
(field inList) points at any playlist: normal, automatic or smart (a smart
one is read as its current songs). Refreshing a list refreshes the smart
lists it reads first; loops (itself, or round a chain) are refused on Save;
renaming a playlist renames it in every rule; a deleted one reads as empty.
Step 7 done 2026-11-09. "Save a copy" (copy icon on an open smart list) makes
a normal playlist "<name> · <date>". What changed is "since you last looked",
kept per device (localStorage dc-smart-seen, not synced: old songs of every
list would eat into the 1 MB playlists doc): card line "+3 new · 1 gone",
a "Since you last looked" box (came in / dropped out) and NEW on new rows.
Opening a list moves "last looked" on; only which songs, not their order.
Step 8 done 2026-11-09. Mix it: button on the Smart playlist card (shown when
there are 2+ playlists), window #spMixModal. Pick 2–4 playlists (smart first,
normal ones too), size 25/50/100, most per artist, name. spBlend takes one
song from each list in turn from the top, no repeats, artist cap. Play puts
it in the player; Save makes a normal playlist and opens it. Last picks are
remembered per device (dc_sp_mix).
Step 9 done 2026-11-09. Bell switch on an open smart list (def.notify,
synced). Notification kind sp_changed (cat playlist) when at least 3 new
songs and at least 20% of the list came in since the user was last told.
Baseline = short song hashes in notifyState.sp (transaction, no double
notifications across devices). Runs after the lists refresh and in ntWatch.
Signed-in only, not on the demo library.

1. **Engine: song facts + rules.** smartplaylists.js with `spSongFacts()`
   (basics, plays, first/last played, ratings, genres, certs) and
   `spRun(rules)` (conditions, all/any, limit, sort, artist limit). No UI yet.
   Tested with a script against sample data and against all three sources.

2. **Chart and habit facts.** Add peak, weeks on chart, weeks at #1, debut,
   biggest climb, chart runs, weeks to peak, night/weekend share, most plays
   in a day, relative facts (top %, artist's best, one-hit). Filled in only
   when a rule needs them. Speed check on the biggest library.

3. **Smart lists in the Playlists tab.** Storage (localStorage + Firestore
   doc, cross-device merge like normal playlists), smart lists mixed into the
   library grid with a "Smart playlist" label, open-list page that runs the rules live, Play /
   Shuffle / Export work. Plain-words sentence under the title.

4. **Ready-made lists.** All 12 lists from the table, written as rule sets.
   Hidden when the data can't support them. "On this day" and "Your year in
   50" get their small extra pickers.

5. **The builder.** New/edit window: field → condition → value rows, all/any,
   add group, limit, sort, artist limit, Live/Frozen. Live count as you type.
   Greyed rules that need missing data. Presets = ready-made lists
   ("Edit a copy"). Phone layout as a bottom sheet like other windows.

6. **Combining playlists.** "in / not in playlist" rules, using normal,
   automatic and other smart lists; loop check.

7. **Freeze + what changed.** "Save as playlist" snapshot. Remember the last
   result per list and show "3 added · 1 dropped" on the card and on the list
   page (with the songs listed).

8. **Mix it.** Pick lists + size, blend in turn, play or save.

9. **Notifications.** Per-list opt-in, `sp_changed` kind, link opens the list.
   Runs with the other watchers (`ntWatch`).

10. **Share on the Board.** Post a list's rules; "Add to my playlists" on the
    post. Board rules may need a small update (pasted in Firebase Console).

11. **Words, guide, What's New.** All four languages checked against the app's
    real labels, a Charts Guide lesson, a What's New card with screenshots,
    changelog entry. Screen check in every theme on phone and desktop.

---

## Open questions (to decide before or during the steps)

1. ~~Weekly chart only?~~ Decided: each chart rule picks its chart.
2. ~~Where do ready-made lists sit?~~ Decided: among the other playlists,
   with the "Smart playlist" label.
3. **Can ready-made lists be hidden** by the user if they don't want them?
4. **Signed-out users:** full feature on this device only, or a sign-in prompt
   like automatic playlists?
5. **Night hours:** fixed 22:00–05:00, or set by the user?
