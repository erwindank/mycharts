# Genre Library — the fun redo

Written 2026-11-18. The user saw the "Genre Library Ideas" artifact
(https://claude.ai/artifact/NfgCaQff8mJk9DeGZHDzcs) and said "I loved them all,
apply them all". Builds on GENRE-LIBRARY-PLAN.md (the first version, same day).

## What changes for the user

The page used to open on three number tiles and a long list to fix. Now it
opens on **your sound** (what your genres say about you), makes fixing a quick
card game, and gives every genre its own page. **Nothing is removed:** the
list (tabs, search, filters, sort, top-genre chips, moderators' section) stays,
lower down.

New page order, top to bottom:

1. Your Sound — headline, family colour bar, bubble map, three facts
2. Quick Fix — one card at a time, progress ring, badges
3. Tidy up — bulk fixes
4. Your genre timeline
5. Your genre shelf (collectible cards)
6. Next door — genres you'd probably like
7. The full list (today's page), with the smaller touches

## Rules everything follows

- **Counts use each song's main genre** (the first one that is in the genre
  list), so shares add up to 100% and no play is counted twice. Read through
  `genreInfo('song', p)` (app.js), which already walks your picks → sheet →
  MusicBrainz → Gemini/Last.fm.
- Works for all three data sources (Last.fm, Google Sheets, CSV / uploads).
  Last.fm libraries ask the shared lookup (`genreLookupArtists`) for their top
  artists when the page opens, and the page redraws as answers land.
- All words in the four site languages (TXT in genrelib.js).
- Family hues stay the ones in `FAM_HUE`; genre colour is a dot / tint /
  fill, text stays theme colours.
- Every confirmation is the in-site warning window (`dcConfirmBox`).
- Respect `prefers-reduced-motion` for the bursts and the map.

## Steps

### Step 1 — Genre stats + Quick Fix
- One cached pass over allPlays: main genre per song → per genre plays,
  artists, songs, albums, first play, plays in the last 30 / 365 days,
  per-month family plays (for the timeline). Rebuilt when plays or genres
  change.
- Coverage = share of **plays** whose song has a real genre (play-weighted).
- Quick Fix deck: artists with no real genre, most played first (fixing an
  artist fixes its albums and songs), then albums / songs that still miss one.
  Each card: artwork, name, plays, best guesses (its own tags mapped to the
  list, genres of artists it is credited with, your top genres), tap to pick,
  Save / Skip / Search all genres / Not music. Keys 1–6, Enter, →.
- Progress ring + badges at 50 / 75 / 90 / 100% (highest reached remembered
  in `dc_genrelib_badges`), streak counter, a colour burst on save.
- Replaces the three tiles (their numbers live on in the ring and the list).

### Step 2 — Genre pages
- Tap a genre (map, shelf, top chips' "open", the side panel strip) → its own
  page inside the library: rank, plays, share, first heard, artists / songs
  counts, top artists, songs, albums, "Next to it" (same family, played and
  not played), actions: Play a mix (player queue), Make Smart Playlist (builder
  opened with a genre rule), Share card (step 4), Fix genres here (list
  filtered to it).

### Step 3 — Your Sound
- Headline ("You're 36% Hip Hop & Rap, with a big Brazilian streak"), family
  colour bar + legend, span switch (All time · Last 12 months · Last 30 days),
  bubble map (families → genres; tap a family to open it, tap a genre for its
  page), facts: genres heard, fastest riser, rarest one.

### Step 4 — Genre shelf + share card
- A card per genre you play, numbered by rank, with rarity: **Common** (in the
  popular set), **Rare**, **Deep cut** (shares no word with a popular genre).
  Greyed cards for genres next door you haven't played. "Show all".
- Share card: drawn straight on a canvas (no html2canvas), 1080×1350, Save /
  Share.

### Step 5 — Tidy up
- Songs / albums whose only tags aren't genres → give them the artist's
  genres (one tap, confirm window).
- Top artists whose genres were only guessed online → Review in the Quick Fix
  deck (guess preselected; Save makes it yours).
- An artist whose songs disagree (3+ different main genres from the sheet) →
  choose for the artist.

### Step 6 — Timeline
- Stream chart of family plays per month, last 12 months, with a caption
  ("June was your Brazilian month. Hip Hop has been on top since August.")
  and hover / tap read-out.

### Step 7 — Next door
- For your top 3 families: genres in the same family you've never played,
  each with a ♪ sample (Deezer search through deezer-proxy, preview clip) and a
  YouTube search link.

### Step 8 — Smaller touches for the list
- Select many rows, set one genre for all.
- "Group by family" in the sort menu.
- Genre of the day card.
- Friendlier source labels ("From your sheet", "Voted on MusicBrainz",
  "Guessed online").
- Empty state push ("14 of your top 50 artists have no genre — fix them in
  Quick Fix").

### Step 9 — Finish
- Charts Guide lesson update, changelog (4 languages), What's New card (short
  wording), `?v=` bumps on every edited file, click tests with sample data
  (desktop + phone, light + dark).
