# Sideways player + TV — plan

The Now Playing player (`#ytMiniPlayer`) works well upright on phones and as a
card or Stage on big screens. Two things are missing: a good **sideways**
layout, and a way to enjoy it **on a TV**.

**Status: in progress** — step 1 done 2026-11-18. This round = steps 1–8
and step 10. Step 9 (Play queue on YouTube) is saved for later.

Decisions so far (2026-11-18):
- **Nothing is removed.** Card, Stage, phone full-screen, the shrunk player
  styles, tabs, Tools, keys — all stay as they are.
- **No Chromecast app.** A real Cast receiver needs a Google developer
  registration and a separate page. Too much for what it adds; tab casting +
  TV mode covers it.
- The YouTube video can't be cast on its own from inside our page (YouTube
  hides its Cast button in embeds). So TV support = our own TV layout that
  looks great when the tab is cast, or when the site is opened on the TV.
- Works for **all three sources** (Last.fm, Google Sheets, CSV). Anything that
  needs Last.fm says so plainly.
- Every theme (all 12, dark and light) and English, Spanish, Brazilian and
  European Portuguese.
- Work on main, commit each step, no push without asking. The user reviews
  each step before the next one, unless they say to build them all.

---

## What changes for the user

| Today | New |
|---|---|
| Turning the phone sideways drops out of the full-screen player (a sideways phone is wider than 760px, so it gets the floating card) | A proper **sideways layout**: video or cover on the left, controls and tabs on the right |
| No full-screen button | **Full screen** button; on Android it also turns the screen sideways |
| Casting the tab shows the normal page | **TV mode**: big cover or video, big lyrics, chart story, Up Next strip, made for a wide screen far away |
| TV browsers are hard to use with a remote | TV mode works with arrow keys / remote buttons |
| No way to control the TV from the couch | **Phone as remote**: pair with a short code, skip / pause / pick songs from the phone |
| — | **Play queue on YouTube**: hand the queue to the YouTube app, which casts natively |

---

## Part A — Sideways

### Step 1. Sideways phone layout — DONE 2026-11-18
- Treat a sideways phone as a phone: `_ytIsPhone()` also true for
  `(max-height: 500px) and (orientation: landscape)`; same rule in the CSS.
- New sideways look: left half = cover / video, right half = song, chart story,
  controls, and the tabs as a side panel (no slide-up sheet sideways).
- Turning the phone back and forth keeps playing and keeps the open tab.
- Check: phone viewport upright → sideways → upright, real clicks on every
  control in both. (C:/tmp/tv1.mjs)
- Built as: left half (cover / video, switch, section buttons) pinned with
  position: fixed; right half scrolls on its own; sections slide in from the
  right. Also fixed an old upright bug: in video mode an open section covered
  the video (the sheet measured the hidden cover).

### Step 2. Full screen button
- Button on the phone player and in Stage: Full screen (key **F**, name in
  the hover label like the other buttons).
- Android Chrome: full screen + `screen.orientation.lock('landscape')`;
  unlocks on exit.
- iPhone (no full screen for pages): button hidden, a one-time hint
  "Turn your phone sideways for the big view".
- Esc / back button leaves full screen cleanly.

## Part B — TV mode

### Step 3. TV mode layout
- New full-window mode on the same player card (like Stage):
  `.ytp-tv`, `_ytToggleTv()`.
- Big cover (or video when in video mode), song and artist in large type,
  chart story tiles, synced lyrics as big karaoke lines, Up Next strip at the
  bottom.
- Background tinted from the cover's colours; controls fade out after a few
  seconds and come back on any key or mouse move.
- Ways in: Tools card "TV mode", button in Stage, and the link
  `dankcharts.fm/?tv=1` (opens straight into it).
- Keep screen on is switched on while in TV mode.

### Step 4. Remote-friendly controls
- Arrow keys move between controls with a big visible focus ring; Enter
  presses; Back / Esc leaves.
- Media keys (play/pause, next, previous) work through the Media Session API,
  which also fills the TV / phone lock screen with song + cover.
- Slow drift of the layout so a TV left playing doesn't burn in.
- Check with keyboard only, no mouse.

### Step 5. "Show on TV" card
- Tools card that explains, per device, in plain steps:
  - Chrome (computer or Android): ⋮ → Cast… → pick the TV → then TV mode.
  - Smart TV browser: open `dankcharts.fm/?tv=1`.
  - iPhone / Mac: Screen Mirroring to Apple TV.
- One button to start TV mode right away.

## Part C — Phone as remote

### Step 6. Pairing
- TV mode shows a short code (and a QR code) when nobody is paired.
- On the phone: Tools → "Control a TV" → type the code (or scan).
- Firestore doc `playerRemotes/{code}` holds the TV's now playing state and the
  phone's commands. Codes expire after a few hours. Rules: only signed-in
  users, only the two paired devices write.
- **Needs a firestore.rules change + deploy** (will ask before deploying).

### Step 7. Remote screen on the phone
- Phone shows a remote view: song, cover, progress, Previous / Play / Next,
  volume, Up Next (drag to reorder, remove).
- "Play on TV" / "Add to TV queue" appear in the row menus while paired.
- Song lookup (YouTube search) happens on the TV, so the phone only sends
  artist + title — works for all three sources.

### Step 8. One scrobble only
- While paired, only the TV scrobbles and sends Live on Last.fm; the phone
  never does. No double scrobbles.
- Unpair button on both sides; closing TV mode ends the pairing.

### Step 9. Play queue on YouTube — LATER (not in this round, user 2026-11-18)
- Up Next menu + Tools: "Play queue on YouTube" opens the YouTube app / site
  with the queue as a playlist (up to 50 songs, from the video IDs the player
  already found), so it can be cast with YouTube's own Cast button.
- Plain note: songs played there don't scrobble or show in the player.

## Finish

### Step 10. Guide, languages, What's New
- Charts Guide player lesson: new stops for sideways, TV mode and the remote;
  new shots in all four languages.
- All new text through `t()` (`yt_np_*` keys) in 4 languages.
- What's New card + changelog entries (short, general wording).
- 12-theme check of sideways, TV mode and remote view.

---

## Settled
- Video mode on TV (user 2026-11-18): lyrics **show over the video, styled
  like subtitles** — one or two lines low on the screen, centred, with a soft
  dark backing so they read on any video. Cover mode keeps the big karaoke
  lyrics. Part of step 3.
