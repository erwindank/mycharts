# Rating fun — build plan (2026-11-19)

The user picked 14 of the 20 ideas on the "Rating Fun Ideas" artifact
(https://claude.ai/artifact/58rKmHgQDgBNWhanAo1VQp): **1, 2, 3, 4, 6, 7, 8, 9,
14, 16, 17, 18, 19, 20**. Not picked (for now): 5 keyboard rating, 10 guess your
listening, 11 this or that, 12 blind rating, 13 tier lists, 15 taste match.

New code lives in `dankcharts/ratefun.js` (prefix `rf`, CSS `.rf-*` at the end
of style.css), with small hooks in app.js / notifications.js. Every feature reads
the normalised `allPlays` + `_ratings`, so it works for Last.fm, Google Sheets
and uploaded files alike.

## Data added to `_ratings` (synced with the ratings doc as before)

- `hist` — `{ 's:<songKey>' | 'a:<albumKey>': [{t, s}] }` score history
  (Firestore can't hold nested arrays, hence objects). A change within 10 min
  of the last point replaces it, max 24 points per item. Merged per key on `t`.
- `fun` — `{ goal, days: {YYYY-MM-DD: n}, dayKeys, badges: {id: ts}, settled:
  {key: d}, ok: {key: ts}, told: {...}, funTs }`. `days` merges by max per day,
  `badges` by earliest, the rest last-write-wins on `funTs`.
- Song / album entries get `line` (one-line review, max 140) and `emo` (emoji).

## Steps (commit each)

1. **Foundation + score history (19a)** — ratefun.js, `rfScored(kind, key)` hook
   from every place a score is written, history recording, merge, history line
   on song + album Rating tabs.
2. **One-line reviews (16)** — line + emoji in the editor; shown on song/album
   Rating tabs and in Recently rated.
3. **Agree with your listening (2)** — − / ✓ Agree / + under a Listening Score
   on song and album pages (album: gives each unrated played track its song
   Listening Score), and an "Agree" queue card on the Ratings page.
4. **Rate what's playing (3)** — score row in the Now Playing player, 1–10
   taps, glow when rated, "Change" opens the editor.
5. **Rate Rush (1)** — full-screen stack of most played unrated songs, preview
   auto-plays, tap a number, next card; 10 a round. From Ratings and Games.
6. **Album speed-run (4)** — whole tracklist on one screen, 1–10 taps + preview
   per track, album score fills live, "Fully yours" moment at the end.
7. **Daily goal + streak (6)** — goal 5/10/25, ring, 🔥 day streak on the
   Ratings page; evening notification when a streak is at risk.
8. **Personal scale (18)** — harsh ↔ generous meter, "You give 9+ to N%", tip
   when scores bunch up.
9. **Critic levels + badges (7)** — Listener → Reviewer → Critic → Tastemaker
   → Legend by how much you scored; badge shelf.
10. **Discography plaques (8)** — "7 of 9 albums rated" on the artist Rating
    tab; plaque wall of finished discographies on the Ratings page.
11. **Settle the gap (17)** — queue from "You vs. your listening": Keep / Move
    it / ▶ Listen.
12. **Re-rates (19b)** — "Still a 9.5?" for things rated a year+ ago that you
    still play: Yes / Re-rate.
13. **Well-timed nudges (20)** — notification when an unrated song is #1 on
    your weekly chart or an album was played through 3× this week; max 1/day.
14. **Weekly critic's report (9)** — Monday notification + report window
    (count, highest, harshest, biggest surprise vs listening), share picture.
15. **Critic profile card (14)** — share picture: average, scale, top 3,
    hottest take, level.
16. **Languages + changelog + What's New** — ES / pt-BR / pt-PT strings,
    changelog entries, one What's New card.

## Decisions made without asking (easy to change)

- Levels count your own scores (songs + albums): Reviewer 25, Critic 100,
  Tastemaker 500, Legend 2000.
- A discography = the artist's own albums (album artist) with 3+ plays; at
  least 2 needed for a plaque.
- Nudges and the streak reminder are signed-in only (that's where the
  Notifications panel lives), like the other notifications.
