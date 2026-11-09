# World Charts — plan

A new tab that shows the real charts everyone else is listening to: the
**Billboard** charts, plus **Spotify**, **YouTube** and **iTunes** charts from
kworb.net. Every song row also says how it fits *your* listening: how often
you've played it, or that it isn't in your library.
Built step by step, and each step is reviewed before the next one starts.

Decisions (2026-11-09):
- Data comes through **our own proxy** (a Cloudflare Function, like
  `grammy-proxy`), not a third-party feed. One proxy serves both Billboard and kworb.
- Its own top-level tab, **World Charts**, placed next to **The Dank 100**
  (both are "everyone" charts, not "your" charts). There's a row of chart buttons at the top,
  like Awards' *My Grammys / Real-Life Awards*.
- Launch charts: **Billboard Hot 100**, **Billboard 200**, **Spotify Global**
  (daily + weekly), **YouTube** (most viewed). More can be added later.
- The "your plays" matching works for all three data sources (Last.fm, Google
  Sheets, CSV), because it uses the plays the site already has.
- Anyone can see the tab. No sign-in needed.
- Credit every chart with a link back to its source. Kworb is run by one
  person, so fetch rarely and ideally email to ask first.

---

## How it fits together

```
browser ──▶ /world-charts?chart=hot-100   (Cloudflare Function, dankcharts/functions/)
                 │  cache hit? → send saved JSON
                 │  cache miss → fetch billboard.com or kworb.net page,
                 │               parse rows, save in edge cache, send JSON
                 ▼
         { chart, title, date, source, sourceUrl, rows: [
             { rank, title, artist, image?, lastWeek?, peak?, weeks?, plays?/streams?/views? } ] }
```

- **Why a proxy:** neither billboard.com nor kworb.net lets other sites read
  their pages from the browser (no CORS). Parsing on the server also means the
  browser gets a few KB of JSON instead of a big HTML page.
- **No cron needed:** like grammy-proxy, the first visitor after the cache runs
  out triggers a fresh fetch, and everyone after that gets the saved copy.
  - Billboard: charts change once a week (Tuesday). Cache 6 hours.
  - Kworb Spotify daily / YouTube: cache 3 hours.
- **When a source breaks** (page layout changes, blocked): the function returns
  the last good copy if it has one, plus `stale: true`. The tab shows "This chart
  couldn't be refreshed. Showing the last saved copy." It never shows a blank page.
- **Chart list lives in one place** in the function (`CHARTS = { 'hot-100': {...},
  'spotify-global-daily': {...} }`), so adding a chart later means adding one
  entry and its parser.

### Matching your plays
- Reuse the Dank 100's name matching (lower-case, strip "feat.", brackets,
  punctuation) so "Song (feat. X)" on Billboard matches "Song" in your library.
- Song charts: match on artist + title. Album chart (Billboard 200): match on
  artist + album. Artist charts: match on artist.
- Count against **all-time plays** by default, with a toggle for "this week".
- YouTube rows are video titles. The proxy's artist/title split is a best guess
  (about a third have no artist, mostly Indian film and devotional songs). So for `kind: 'videos'`, also
  count a match when your song's title *and* artist both appear somewhere in
  the row's `raw` title.

---

## Steps

### 1. Proxy: Billboard — done 2026-11-09 (`&date=` for past weeks built here already; `?chart=list` gives the chart menu)
- New `dankcharts/functions/world-charts.js`.
- `GET /world-charts?chart=hot-100` and `?chart=billboard-200`.
- Parse rank, title, artist, cover image, last week, peak, weeks on chart.
- Edge cache + last-good-copy fallback.
- Test by hitting it on a Pages preview / localhost and checking all 100 / 200 rows.

### 2. Proxy: kworb — done 2026-11-09 (rows renamed to `last` / `onChart` / `atPeak` so daily and weekly charts share them; YouTube capped at 200)
- Same function, new chart ids: `spotify-global-daily`, `spotify-global-weekly`,
  `youtube-top` (most viewed music videos).
- Parse rank, title, artist, change, streams / views.
- Same caching. Send a polite User-Agent naming dankcharts.fm.

### 3. The tab shell — done 2026-11-09 (worldcharts.js; named "World Charts" / Listas mundiales / Paradas mundiais / Tops mundiais for now; plain list until step 4)
- Nav item (side nav, top-bar More, phone menu) with a glowing icon (Glow Kit).
- Chart buttons across the top, the last one used is remembered.
- Loading, error and "stale copy" states.
- Translations: EN in translations.js, ES/PT in translations.<lang>.js (bump DC_I18N_V).

### 4. The chart list — done 2026-11-09 (reuses the Dank 100 row classes; ▶/Spotify/YouTube buttons left for step 7)
- Rows in the site's chart look: rank, movement arrow (up / down / NEW / RE),
  cover, title, artist, and the source's numbers (weeks, peak, streams, views).
- First 50 rows, then *Show all* (same as the Dank 100).
- "Source: Billboard / kworb.net · updated <date>" with a link, on every chart.

### 5. Your plays on every row — done 2026-11-09 ("New to you" tag; ranges All time / Last 7 days; index under every credited artist)
- Badge on each row: "▶ 42 plays" / "Not in your library".
- Filter: *All · Ones I know · Ones I don't*.
- Small summary at the top: "You know 37 of the Hot 100".
- Clicking a matched song or artist opens its window as from All-Time.

### 6. Past weeks (Billboard) — done 2026-11-09 (‹ date box › + "Latest week"; "Your chart that week" opens your Weekly chart for the days Billboard counted, Fri–Thu ending 9 days before the chart date; on a past week "Last 7 days" becomes "That week"; old Billboard 200 weeks have 150 rows, so past weeks accept fewer)
- Week picker. Billboard keeps old weeks (`/charts/hot-100/YYYY-MM-DD`), so the
  proxy takes `&date=`. Old weeks never change, so they're cached for a long time.
- "Your chart that week" side link: jump to your own Weekly chart for the same week.
- Kworb has no history pages, so its charts show the current one only.

### 7. Finishing
- ▶ sample button on rows (samples only, never YouTube).
- Share card for a chart (top 10 + "you know X of them").
- Charts Guide tour step, What's New card, bump the changelog ?v=.
- Phone screen check.

---

## Open questions (answer at the step they belong to)
- Tab name: *World Charts*, *Real Charts* or *Global Charts*? (step 3)
- Spotify country charts (kworb has every country): add a country picker now,
  or later? (step 2)
- More launch charts: Billboard Global 200, Hot Country / R&B / Rap, iTunes
  Worldwide, US Radio? (step 2)
- Email kworb's owner before going live? (before step 2 is pushed)
