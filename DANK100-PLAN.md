# The Dank 100 — plan

A shared weekly chart for everyone on dankcharts.fm. Each listener sends in their
own weekly chart, and all the entries are added up into one combined chart:
**The Dank 100** (songs), plus **Dank 100 Artists** and **Dank 100 Albums**.
Built step by step, and each step is reviewed before the next one starts.

Decisions (2026-11-01):
- Name: **The Dank 100**. Not "Hot 100", which is Billboard's.
- Works for all three data sources (Last.fm, Google Sheets, CSV). The entry is
  built from the plays the site already has, not from any one source's API.
- Score by **chart position, not play count**, so one heavy listener can't take
  over the chart.
- One entry per account per week.
- Privacy: only the combined chart is public. Nobody can see who sent what.
- Its own top-level tab, **Dank 100**. Anyone can look at it. You only need to
  sign in to send an entry.

---

## How it fits together

```
user's plays ──▶ build my entry (browser) ──▶ dank100Entries/{week}_{uid}   (Firestore)
                                                        │  (only the server reads these)
first visit after the week closes ──▶ functions/dank100/[[path]].js (Cloudflare)
                                                        │  adds up all entries
                                                        ▼
                                          dank100Charts/{week}  (public, read-only)
```

- **One shared week for everyone.** People set their own week start day and time
  zone, but a combined chart needs one week. The Dank 100 uses a fixed
  **Friday–Thursday tracking week in UTC**, like the official charts. Each
  user's entry is built from their raw plays for that window, whatever their own
  week setting is.
- **Timeline:**
  - Fri 00:00 UTC to Thu 23:59 UTC: tracking week.
  - Up to Sun 23:59 UTC: you can still send in or update that week's entry.
  - Mon 00:00 UTC: the chart is built and goes live.
- **Why a server piece:** if a browser added up the chart and saved it, anyone
  could save a fake chart. A Cloudflare Function does the counting instead, with
  the service-account key. That's the same setup as `grammy-proxy` and the admin
  plan. The token-signing helper from ADMIN-PLAN step 1 is shared, not written
  twice.
- **No cron needed:** the first person to open the Dank 100 tab after Monday
  00:00 UTC asks the function for the chart. If it isn't built yet, the function
  builds it, saves it, and sends it back. Everyone after that just reads the
  saved chart. If two people ask at once, a lock field in the chart doc stops it
  being built twice.

### Scoring
- Songs: your #1 = 100 points, #2 = 99 … #100 = 1. Artists and albums work the
  same way over your top 100.
- The chart is sorted by total points. Ties go to the one more listeners
  charted, then to total plays.
- Each row also stores **listeners** (how many people had it in their chart).
  That figure is shown, because it's the honest one.
- Minimum to publish: **1 entry** (changed from 3 on 2026-11-01, so it works from day one) for the week. Fewer than that shows "Not
  enough listeners this week" with the count, not a thin chart.

### Matching names
- Your own autocorrect rules are applied before the entry is built.
- Each item gets a match key: lower case, accents removed, punctuation and
  "feat./ft./with …" stripped, and "&" treated the same as "and".
  So "Beyoncé" and "Beyonce" count as one.
- The chart shows the spelling most entries used.

### New Firestore collections

| Collection | Who can read | Who can write | Holds |
|---|---|---|---|
| `dank100Entries/{week}_{uid}` | that user (own doc only) | that user, while the week is open (strict keys/sizes) | top 100 songs/artists/albums: key, display name, artist, rank, plays |
| `dank100Charts/{week}` | everyone | function only | the finished chart: rows, last week, peak, weeks on, listeners, entry count |
| `dank100Excluded/{uid}` | nobody | nobody (Console / admin page) | accounts kept out of the count (abuse) |

Rules changes must be **pasted into the Firebase Console**, as before.

---

## Steps

### 1. My entry (data only) — done 2026-11-01
- `dank100.js` (new file, loaded like `board.js`). It holds the week helper
  (`weekIdOf(date)` → the week's Friday, e.g. `2026-10-30`, and Fri–Thu UTC
  bounds) and `buildEntry(week)`, which turns plays into a ranked top 100 for songs,
  artists and albums, with autocorrect and match keys applied.
- It uses the same play list as the rest of the site, so all three sources work.
- Firestore: `dank100Entries` doc shape + rules (own uid only, size limits,
  `week` must be the open week).
- Test: the same plays as a CSV and as Sheets give the same entry.

### 2. Send-in card — done 2026-11-01 (in More, first item)
- New **Dank 100** tab. At the top: "Your entry for week 44". It shows a short
  preview (your top 10 songs), a **Send my week** button, then "Sent ✓ · Update"
  once it's in.
- Signed out: "Sign in to add your week" (the chart stays visible).
- **Auto-send** switch in Settings → Charts. When it's on, opening the site
  while a week is still open sends or refreshes that week's entry by itself.
  CSV users only send when they open the site, which is fine.
- Note: "Only the combined chart is public."

### 3. Building the chart (server) — done 2026-11-01 (also `GET /dank100/count`)
- `functions/dank100/[[path]].js`: `GET /dank100/chart?week=` returns the saved
  chart. If the week is closed and there's no chart yet, it builds one first.
- Building means: read all entries for the week (skipping excluded accounts),
  score them, merge by match key, then work out last week, peak, weeks on chart,
  and new / re-entry from the previous chart.
- A lock field stops it being built twice. Charts are never rebuilt after
  publishing, unless an admin forces it.

### 4. The chart page — done 2026-11-01 (first 50 rows, then Show all)
- Songs / Artists / Albums switch. Rows show position, a move arrow (or NEW / RE),
  artwork, title, artist, points, listeners, last week, peak and weeks on.
- Reuses the existing chart row styles and artwork lookup, so it matches the rest
  of the site and all themes.
- Header: "The Dank 100 · week of Oct 24–30 · built from 14 listeners".
- **Your part**: a small marker on the rows you helped chart.

### 5. Weeks and history — done 2026-11-01 (run opens under the row; `GET /dank100/archive`)
- Week picker for older charts (same date bar style as the main chart).
- Click a song for its Dank 100 run: a mini chart of its positions over the weeks,
  its peak, and its weeks at #1.
- **Number ones**: a list of every #1 by week.

### 6. Records, sharing, finishing — done 2026-11-01 (share card drawn on canvas; tour step added)
- Dank 100 records: most weeks at #1, longest run, biggest jump, most listeners.
- Share card for the week's top 10 (uses the share-image system).
- Translations (en, es, pt-BR, pt-PT), a Charts Guide section, and a paragraph in
  privacy.html about what an entry holds.
- Changelog entry + bump `?v=`.

---

## Fake accounts (2026-11-01)
- **Spot copies (done):** when a week is built, every pair of entries is
  compared on its songs. Pairs sharing 80%+ of their songs (lists of 10+
  songs) are written to `dank100Flags/{week}` (private), exact copies marked
  `same`. Nothing is blocked automatically; add a uid to `dank100Excluded` to
  keep it out. Shown on the admin page later.
- Ideas not built yet: a wait before a new account's entries count; a "looks
  like real listening" check; more trust for Last.fm-sourced entries.

## Open questions (answer at the step they belong to)
- Friday–Thursday UTC week, or Monday–Sunday? (step 1)
- Artists and albums: also top 100, or top 50 while there are few users? (step 4)
- Should a brand-new account be able to count straight away, or only after a
  week or two (against fake accounts)? (step 3)
