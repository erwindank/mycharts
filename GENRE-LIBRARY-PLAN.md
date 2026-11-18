# Genre Library — Plan

Written 2026-11-18, **built the same day** (all 7 steps). Builds on the shared genre lookup from 2026-11-16
(`_awardsSongTags` / `_awardsAlbumTags` / `_awardsArtistTags` /
`genreLookupArtists` in `dankcharts/app.js`).

## What the user decided

1. **Changes are saved only to the person's account in the app.** Nothing is
   ever written back to their Google Sheet or CSV.
2. **Genres are picked from a fixed list, not typed freely.** The list has to
   be complete enough that searching it is easy.
3. **Missing genres are suggested on the Board** (the forum), and an admin
   adds the accepted ones.

## The genre list

- Source: MusicBrainz's official genre list
  (`https://musicbrainz.org/ws/2/genre/all?fmt=txt`). It had **2,227 genres**
  on 2026-11-18, including sertanejo, forró, funk carioca, pagode, reggaeton,
  corrido tumbado, bachata, kizomba, amapiano, afrobeats, phonk, hyperpop and
  k-pop.
- Because it's the same list MusicBrainz uses, the genres it finds already
  match the picker exactly, so nothing has to be converted.
- It's saved as a static file, `dankcharts/genres.js`, and loaded only when
  the library or the picker opens (like `changelog.js`). It isn't fetched
  live, because MusicBrainz is slow and rate-limited.
- Each genre has a display name with proper capitals ("Hip Hop", "R&B",
  "K-pop", "Drum and Bass") and search aliases (hiphop, rnb, dnb, edm, kpop,
  "funk brasileiro", "baile funk"…).
- Genres added by admins live in Firestore `genreExtras` and are merged into
  the list at load time. This way an accepted suggestion shows up right away
  without a code update.

## Steps

### Step 1 — Genre list file
- Script (kept in the scratchpad, not shipped) that downloads the MusicBrainz
  list and writes `dankcharts/genres.js`: `{ id, name, aliases[] }` plus a
  small "popular" set (about 60 genres) that is shown first in the picker.
- `loadGenreList()` loads it lazily and merges in `genreExtras`.
- Search: ignores accents and capitals, matches any word, accepts aliases,
  and tolerates a small typo. Popular genres rank above obscure ones.

### Step 2 — Saved edits + reading order
- Firestore: `users/{uid}/genreEdits/{kind}:{key}` → `{ genres: [ids], at }`
  where kind = `artist` | `album` | `song`. Uses the same key normalisation as
  `_awardsSheetGenres` so it works with Last.fm, Google Sheets and uploaded
  plays alike.
- In-memory cache + localStorage mirror (`dc_genre_edits`) for speed, with
  Firestore as the master copy. When signed out, the library can be viewed
  but saving asks the person to sign in.
- Reading order becomes: **your edits → sheet/CSV → MusicBrainz well-voted →
  Gemini → Last.fm → MusicBrainz weak.** This is wired into
  `_awardsSongTags` / `_awardsAlbumTags` / `_awardsArtistTags`, so Awards,
  Smart Playlists, Daily and the nominee picker follow automatically.
- An edit can also be "no genre / hide": an empty list that blocks the
  automatic sources.
- Included in Settings → Profile account backups.

### Step 3 — Genre picker component
- A shared window: a search box, the current genres as removable chips,
  results below, and up to 5 genres (the first one = main genre).
- When nothing matches: "Can't find it? **Suggest a genre**". This opens a
  new Board post with category `suggestion`, the title prefilled as
  "Genre suggestion: <typed text>", and the item it was for in the body.

### Step 4 — Genre Library page
- A new page under More (like Games): Artists / Albums / Songs tabs.
- Each row shows its artwork, name, current genres, and a small source badge
  (Yours · Sheet · MusicBrainz · Gemini · Last.fm).
- Search, plus filters: "No genre", "Edited by me", by genre, by source.
  Sorted by plays by default.
- Tapping a row opens the picker. "Reset" goes back to the automatic genres.
- Works with long libraries (virtual list / paging, see the perf notes).

### Step 5 — Edit from where you are
- A "Genres" entry in the artist window, the album window and the song ⋮
  menu, opening the same picker.
- The genre chips already shown in Awards/Daily open the picker for that item.

### Step 6 — Admin: accept suggestions
- In the Board admin view, posts titled "Genre suggestion:" get an **Add to
  genre list** button that writes to `genreExtras` (name + aliases) and marks
  the post Done.
- The Super Admin page gets a small list to edit or remove extras.
- Firestore rules: `genreExtras` can be read by everyone and written by
  admins only; `genreEdits` can be read and written only by its owner.

### Step 7 — Finish
- Translations (EN/ES/PT-BR/PT-PT) for all UI text. Genre names stay as in
  the list.
- Guide lesson, changelog entry, What's New card (short wording).
- Bump `?v=` on every edited file.
- Click-test in the browser with sample data.

## How it was built (2026-11-18)

- **List:** `dankcharts/genres.js`, made by `tools/make-genres.mjs` — 2,227
  MusicBrainz genres plus 18 extras MusicBrainz lacks (Soundtrack, Christian,
  Worship, Video Game Music, Alternative, Indie, Afropop, Urbano Latino…), in
  20 families, about 75 popular ones, nicknames for search. ~85 KB, loaded
  only when the page or picker opens (`dc-genres-src` meta in index.html).
- **Saving:** `_genreEdits` in app.js (next to the genre lookup), localStorage
  `dc_genre_edits` + Firestore `users/{uid}/data/genreEdits`, merged per
  entry on sign-in; in account backups. Saving works signed out too (this
  device), with a note to sign in.
- **Order:** song pick → sheet song → album pick → sheet album → artist pick
  → sheet artist → MusicBrainz → Gemini/Last.fm. `genreInfo()` walks the same
  order and says where the answer came from.
- **Page / picker / panel strip / admin:** `dankcharts/genrelib.js`
  (`window.dcGenreLib`), styles under "GENRE LIBRARY" at the end of style.css.
- **Board:** `dcBoard.composeGenre` opens a filled-in 🏷️ suggestion post;
  moderators see "Add to genre list" on 🏷️ posts → Firestore `genreExtras`.
  **The new `genreExtras` rule in firestore.rules must be pasted into the
  Firebase Console** before moderators can add genres.
- **Also fixed:** "-" and other blank-cell placeholders in a sheet's genre
  columns are no longer read as genres.
- Not done: the Super Admin page doesn't exist yet, so the moderators' list of
  added genres lives at the foot of the Genre Library page instead.