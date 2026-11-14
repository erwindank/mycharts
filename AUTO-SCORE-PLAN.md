# Listening scores — plan

An automatic 0–10 score for every album, EP and single, worked out from how
you listen to it and what it did on your charts. It is **off by default**.

Started 2026-11-14. **All 6 steps built 2026-11-14** in `dankcharts/autoscore.js`
(see "What was built" at the end).

**The one idea everything rests on:** the listening score is a *placeholder*,
not a second rating. Your own score (the critic rubric) judges the work. The
listening score only fills the gaps until you give one.

**Gaps are filled one song at a time (decided 2026-11-14).** An album's track
half is the average of every track: tracks you rated use your score, tracks
you haven't rated use their song listening score. So rating 2 of 12 tracks
gives a *mixed* album score (2 of yours + 10 listening). Each track you rate
replaces one placeholder, and once every track is rated the album score is
fully yours. The listening score then stays only in the "why" breakdown
("Your listening said 8.4"). The aspects half works as it does today
(your aspects, or left out); the system never fills aspects.

Three states, each with its own look:
- **Yours:** every track rated by you. Filled chip, as today.
- **Mixed:** some tracks yours, the rest listening. Half-filled chip +
  "7 of 12 tracks yours".
- **Listening:** nothing rated. Outlined chip.

---

## Ground rules

- **Off by default.** Switch in Settings, under the ratings options:
  "Listening scores: give unrated albums, EPs and singles a score from how
  you listen". Stored in the ratings config (`_ratings.cfg.auto`), so it syncs
  with the ratings doc like the track weight already does.
- **Never stored as a rating.** It is worked out from plays, never written
  into `dc_ratings`. Nothing in the hand-rating flow changes.
- **Always looks different.** Its own chip style (outlined, not filled, with a
  small "≈" or wave mark), its own name ("Listening score"), so nobody
  mistakes it for a score they gave.
- **All three data sources.** Built only from `allPlays` and what is built
  from it (chart runs, certs, records), so Last.fm, Sheets and CSV/Apple Music
  uploads all work.
- **Follows the single/EP marks.** Uses `ratingReleaseKind()`: albums are
  compared with albums, singles and EPs with singles and EPs.
- **4 languages**, comments in the code, bump `?v=` on every edited file.
- New code goes in its own file, **autoscore.js** (prefix `as`). Only small
  hooks go into app.js.

---

## How the score is worked out

**Song listening score** (needed for mixed albums). Each song gets: plays
(25), staying power (30), weekly chart peak (20), chart life (10), honours
= cert + records (15). Ranked against all your songs, same "not enough /
early" rules as below. Unplayed tracks from the tracklist have no song score
and are left out of the album's track average.

**Release listening score** (nothing rated at all). Each release gets up to
six signals. Each signal is turned into a **rank
within your own library** (0 = lowest, 1 = highest), compared only with
releases of the same kind. So a light listener's favourites still get 9s and
a heavy listener's skip-overs still get 3s.

| Signal | What it measures | Weight |
|---|---|---|
| Depth | plays per track (album plays ÷ tracklist length), so short releases aren't punished | 20 |
| Coverage | share of the tracklist you played at least twice. Not used for singles | 15 |
| Staying power | whether you still play it 3, 6 and 12 months after first hearing it, and in how many different months | 25 |
| Chart peak | best weekly position, in its own chart (singles chart if Apart) | 15 |
| Chart life | weeks on the weekly chart + weeks at #1 | 10 |
| Honours | certification level + number of records it holds | 15 |

- A signal that doesn't apply (coverage on a single, no tracklist found)
  drops out and the others share its weight. This is the same "don't punish
  what can't be measured" idea as the N/A criteria.
- Final score = weighted average × 10, shown to one decimal like your own
  scores, using the same colour bands (`ratingBand`).
- **Not enough to go on:** fewer than 5 plays → no score ("Not enough
  listening yet").
- **Early:** first played less than 90 days ago → score shown with an "Early"
  tag, because staying power can't be judged yet. The 90 days count from the
  release date for new releases (`albumChartStart`).
- Weights can be changed in Settings (step 5). The defaults above are a
  starting point and get tuned on real libraries in step 1.

The tracklist comes from the Deezer lookups the score cards already use
(`rtPrefetchTracklist`, cached in `dc_rtTracklists`). With no tracklist,
Depth uses the tracks you've played and Coverage drops out.

---

## Where it shows

| Place | With the switch on |
|---|---|
| Album page rating box | Listening score ring + "Why this score" breakdown (each signal, its value, its rank) + "Rate it" button |
| Artist page Rating tab | Unrated albums / singles / EPs show their listening score |
| Chart rows | Score chips fall back to the listening score (outlined look) |
| Song page rating box | Listening score ring + "Why this score" + "Rate it" when you haven't rated the song |
| Song chart rows | Score chips fall back to the song listening score (outlined look) |

**Records, Awards, Stats, smart playlists and the artist verdict never count
listening scores by default (decided 2026-11-14).** One Settings switch,
"Count Listening Scores where I haven't rated", off. A mixed album counts
there exactly as it does today: from your own scores only.

---

## Steps

Each step ends with a review. Commit per step.

1. **Engine + switch.** autoscore.js: `asFacts()` builds the signals for every
   release once per data load (same generation check as `_crFull`, chart
   facts only built when needed), `asSongScore(songKey)` and
   `asScore(albumKey)` return `{score, early, parts}` or null, and
   `asAlbumBlend(albumKey)` returns `{score, state: 'yours'|'mixed'|'listening',
   yourTracks, totalTracks}` using `ratingAlbumTrackKeys` and the 75/25 rule. Settings switch (off). No other UI yet.
   Check speed on the 250k-play sample and look at the spread of scores
   (does a library's middle land around 5–6?), tune weights.
2. **Album and song pages.** Listening score ring in `#albumModalRating` and
   `#songModalRating` when the score isn't fully yours (mixed or listening), plus the "Why this score" breakdown and a "Rate it"
   button into the existing editor. When you have rated it, a small line
   "Your listening said 8.4" stays.
3. **Artist page.** Rating tab and artist summary show listening scores for
   unrated releases, outlined. The artist's overall verdict still uses your
   own scores only (see open question 2).
4. **Chart rows and lists.** `ratingSongBadge`, `ratingAlbumBadge` and
   `ratingRowBadge` fall back to the listening score (outlined) or the mixed
   score (half-filled). One helper decides
   "yours, or listening, or nothing" so every place gets it the same way.
5. **Settings: tune it.** Weight sliders for the six signals, "Back to
   defaults", and a live preview of 5 releases from the library whose score
   changes as you move them.
6. **Finish.** The "Count Listening Scores where I haven't rated" switch
   (off) and its hooks in Records / Awards / Stats / smart playlists / artist
   verdict, Charts Guide mention, What's New card,
   changelog, all 4 languages checked.

---

## Open questions (answer before the step that needs it)

1. ~~What counts as "rated by you" for an album?~~ **Decided 2026-11-14:**
   combine them. Unrated tracks keep their listening score until every track
   is rated (see the top of this plan).
2. ~~Do they count in Records / Awards / Stats?~~ **Decided:** no by
   default, one switch to turn it on.
3. ~~Name?~~ **Decided:** "Listening Score".
4. ~~Song scores?~~ **Decided:** yes, songs get Listening Scores, shown on
   song pages and song chart rows.

All questions answered 2026-11-14.

---

## What was built (2026-11-14)

All steps done in one go (the user said "do it all, then commit and push").

**Changed 2026-11-14 (user):** Listening Scores are now ON by default.
Only someone who switches them off has `on: false` stored.

- **Engine** `autoscore.js`: `asSong`, `asRelease`, `asSongView`,
  `asAlbumView` (yours / mixed / listening), `ratingSongScoreCounted` /
  `ratingAlbumScoreCounted` for the places behind the "count" switch.
  Builds in a few ms on a 4k-play library; reuses the weekly chart run.
- **Spread:** a library rank maps to a score through fixed points
  (`AS_CURVE`): top 10% 9+, next 15% 8+, 20% 7+, 20% 6+, 20% 5+, bottom
  15% 3.0–5.0. The first try (3 + 7·q^1.5) put 43% of songs in "Weak".
- **Honours = certifications only.** Records held were left out: working
  them out means building the whole Records tab for every score.
- **Song signals** use the same six weights; Tracks played doesn't apply to
  songs or singles, so its weight is shared out among the rest.
- **Part-yours albums** lead with the combined score everywhere (chips,
  album page ring, Overview card); "Your scores alone" sits under it, and
  the share picture still uses your own scores. The state is called
  "Part yours", because "Mixed" is already a verdict band.
- **Looks:** dashed outline chip = Listening Score, half-filled dashed chip
  = part yours, dashed ring on the album/song pages.
- **Settings → Releases → Listening Scores:** on/off, count switch, six
  sliders (0–40), Reset, preview of five of your most played albums.
- **Coverage** asks Deezer for an album's tracklist when its Rating tab is
  opened with the feature on (`rtPrefetchTracklist`), then rescores.
- Changelog entry in 4 languages. No What's New picture card (needs a
  screenshot) and no Charts Guide lesson yet.
