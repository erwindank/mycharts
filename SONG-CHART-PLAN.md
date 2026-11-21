# Song Chart tab — plan (2026-11-21)

A new **Song Chart** tab in the artist window and the album / single / EP window.
It ranks only that artist's (or that release's) songs against each other,
day by day, week by week, month by month or year by year.

Idea board (the 20 ideas, user said "I want them all"):
https://claude.ai/artifact/2sUjpiuFDRpkXHaphRyC4w

Code lives in its own file, `dankcharts/songchart.js` (prefix `sch`), loaded
between app.js and panel.js so its wrap of openArtistModal / openAlbumModal
runs before panel.js builds the tabs. CSS `.sch-*` in style.css, words
`sch_*` in all four translation files. Works from allPlays, so Last.fm,
Google Sheets and uploaded plays all get it.

## Two ways of looking
- **Standing** — every song stays on, ranked by all its plays up to the end
  of the picked period. Rows show the move since the last period and the
  plays added. Ties: who reached that count first ranks higher.
- **This period** — only songs played in that period, ranked by plays in it
  (ties: first to get there). NEW = first play ever, RE = played before.
  Songs with no plays drop off. Empty periods are skipped with a note.

## Steps (commit each, no push without asking)
1. Engine + tab shell: period buckets (same keys as the main charts), both
   modes, Day/Week/Month/Year, arrows, skip empty + note (ideas 1–4).
2. Activity ribbon (click / drag to jump), quiet rows fade, "Only moved"
   chip (5–6).
3. Fell-off tray, album Track order (Deezer tracklist the score card uses),
   artist Songs / Releases switch (7–9).
4. Rank sparkline per row, peak / times at #1 / periods played chips,
   milestone badges (10–12).
5. Summary line with the artist's / album's rank on the main chart that
   period, Number ones hand-offs, Rank race bump chart (13–15).
6. Jump shortcuts + date box, ▶ play through with sliding rows (16–17).
7. Compare two periods, open at the main chart's date, share image +
   make playlist (18–20).
8. ES / PT-BR / PT-PT words, changelog entry, What's New card, checks in a
   real browser (clicks, phone width, light + dark).
