# Automatic chart playlists + notifications — plan

Users turn on automatic playlists for a chart type and pick a size. Every time
one of that chart's periods finishes, the site turns the finished chart into a
playlist in **Playlists** and says so in a new **Notifications** panel under
the profile picture. Each notification links to the place it's about.

Built step by step. Each step is reviewed before the next one starts.

Decisions (2026-11-04):
- **No date or time to pick.** The user picks a chart type and a size. The
  playlist covers the whole period, from its very first second to its very last
  second, using the user's own settings (week start day, time zone). It is
  made once that period is over.
  - Weekly Top 40 → when the week ends, that week's Top 40.
  - Monthly Top 50 → when the month ends, that month's Top 50.
- **Chart types:** Daily, Weekly, Monthly, Yearly. All-Time has no end, so it
  isn't offered.
- **Songs only** for now.
- **Signed-in users only.** Signed-out users see the option with a "Sign in to
  use automatic playlists" prompt. Schedules and notifications are saved to the
  account and synced across devices.
- **"Catch up when you open the site", not a server job.** The site only runs
  while it's open, and Sheets/CSV data only lives in the browser. So the
  playlist is made the next time the user opens the site after the period
  ends. Because it always covers the full finished period, a late playlist is
  exactly the same as an on-time one. This works the same for Last.fm, Google
  Sheets and CSV.
- **In-site playlists only.** No Spotify/YouTube push. The normal Export button
  still works on the playlist afterwards.

---

## What the user sets

Per chart type (Daily / Weekly / Monthly / Yearly):

| Setting | Choices |
|---|---|
| On / off | switch |
| Size | Top 10 / 20 / 40 / 50 / 100 (default: the user's chart size) |

The playlist name is automatic, e.g. "Weekly Top 40 · Nov 1–7",
"Monthly Top 50 · October 2026", "Yearly Top 100 · 2026".

**Starting point:** when a chart type is turned on, the first playlist is the
next period to finish. Nothing is back-filled. (A "make it for the last
finished period now" button could be added if wanted.)

## How it works

```
open the site ──▶ data loaded ──▶ for each chart type that's on:
                                     has a period finished since lastDone?
                                     │ yes
                                     ▼
                     build that period's songs chart (first second → last second)
                                     ▼
                     save as a playlist (same store as hand-made playlists)
                                     ▼
                     add a notification ──▶ red dot on the profile picture
```

- **Missed periods:** if several periods finished while the user was away
  (e.g. 3 weeks), each one is made, up to 10 per chart type. Older ones are
  skipped and one notification says how many were skipped.
- **No doubles across devices:** each chart type stores the last period it
  made (`lastDone`). The runner claims a period with a Firestore transaction
  before building it, so a phone and a laptop opening at once don't both make
  it.
- **Name clashes:** if the name exists, add " (2)", " (3)" … Never overwrite.
- **Empty period** (no plays): no playlist and no notification. Just move on.
- **Week start setting changed:** periods follow the setting at the time the
  playlist is made. `lastDone` stores the end time, so nothing is made twice.

## Notifications panel

- Profile picture menu gets a **Notifications** row with an unread count. The
  picture itself gets a small dot when something is unread.
- The panel lists newest first: icon, one line of text, time ago. Clicking one
  goes to the place it's about and marks it read.
  - "Your Weekly Top 40 · Nov 1–7 playlist is ready" → Playlists tab with that
    playlist opened.
  - If the playlist was deleted since: the link opens Playlists and a toast
    says it's gone.
- **Mark all read** and **Clear all** (Clear all uses the in-site confirm
  window, not the browser one).
- Keeps the last 100, drops anything older than 90 days.
- Built generic, so other features can post notifications later (Dank 100
  chart is live, awards season, streak at risk). Only automatic playlists use
  it in this plan.

## Storage

- `users/{uid}/data/autoPlaylists` — `{ day|week|month|year: { on, size,
  lastDone } }`
- `users/{uid}/data/notifications` — `{ items: [{ id, kind, text params,
  link, at, read }] }`
- Both under `users/{uid}/data/*`, which the current rules should already
  cover. Check before step 2. If not, the rules text goes to the user to paste
  in Firebase Console.
- Direct targeted saves (like the autocorrect fix), not `dcSaveUserConfig()`.

---

## Steps

1. **Chart for any finished period.** A helper that builds the top N songs for
   a given period type and period (first second → last second). It uses the
   same ranking as the Charts tab (ties, autocorrect, all three sources),
   without touching the current page state. No UI. Check it against the Charts
   tab for a few periods of each type.
2. **Settings + the runner.** Save/load/sync the per-chart-type settings. On
   load, once data is ready: find finished periods since `lastDone`, claim
   them, build them, save the playlists, advance `lastDone`. Missed-period cap,
   name clashes, empty periods.
3. **Setup UI.** An "Automatic playlists" section in the Playlists tab: one row
   per chart type with an on/off switch, a size picker, and "next one: after
   Nov 14". The sign-in prompt for signed-out users.
4. **Notifications store + panel.** Save/load/sync, the Notifications row and
   dot under the profile picture, the panel (phones: bottom sheet), mark read,
   mark all read, clear all.
5. **Links.** `#t=playlists/<name>` opens Playlists with that playlist
   expanded. Wire notifications to it; handle a deleted playlist.
6. **Finish.** Spanish/Portuguese text (translations.\*.js, bump DC_I18N_V),
   Charts Guide entry, changelog Highlights card (bump ?v=), screen check on
   phone + all themes, click tests with real clicks.
