# The new Now Playing player — plan

The in-site music and video player (`#ytMiniPlayer`) works, but it is hard to
read: 13 unnamed icons in one row, a list that crowds everything else, no way
to tell what a button does. The goal is the player people love most on the
site: easy to learn without a manual, nice to look at, fun to use, and still
able to do everything it does today.

Preview of the look (working page, sample data):
https://claude.ai/artifact/K8NFvbwNvyCrmKX31n9tSi

Decisions (2026-11-08):
- **Nothing is removed.** Every feature of today's player keeps working: queue
  drag, multi-select, undo, right-click menu, play next, history, lyrics, sleep
  timer, speed, crossfade, scrobble-at, saved playlists, share card, pop-out
  (PiP), open on YouTube, search another version, more by this artist, all
  keyboard keys.
- **Chart rows don't change.** Play next and Add to queue already exist there.
  On the site ▶ means "sample", so the player gets no new ▶ on rows.
- Works for **all three sources** (Last.fm, Google Sheets, CSV). Anything that
  needs Last.fm says so plainly when it isn't connected.
- Every theme (all 12, dark and light) and English, Spanish, Brazilian and
  European Portuguese.
- Work on main, commit each step, no push without asking. The user reviews each
  step before the next one, unless they say to build them all.

---

## What changes for the user

| Today | New |
|---|---|
| 13 small icons with no names | 5 big controls + 4 named tabs. Hovering any button shows its name and key |
| Repeat, Play, Skip | Shuffle, **Previous**, Play, Next, Repeat |
| Song name and artist | Plus your **chart story**: rank this week, peak, your plays, weeks on chart |
| "✓ Scrobbled" after the fact | A **green mark** on the progress bar shows when it will count, then "Scrobbled to Last.fm" |
| Panels open on top of each other | Tabs: **Up Next**, **Lyrics**, **History**, **Tools** |
| Extra buttons you have to guess | **Tools tab**: a card per extra, with its name, one line of help and its current value |
| Plain lyrics | **Synced lyrics** that light up line by line where available; click a line to jump there |
| Size S → M → L + collapse | **Bar** (bottom of the page), **Card** (today's floating player), **Stage** (big video + lyrics) |
| — | **Heart** (love the song) and **Add to playlist** next to the song name |
| — | **Artwork / Video** switch, a record that spins while it plays, colours taken from the artwork |
| — | **Phone**: full screen, big buttons, swipe down to shrink to the bar |
| — | **Tour** (the ? button) and a one-time hint for first-time users |
| No guide lesson | A **Music player** lesson in the Charts Guide |

---

## Steps

Each step ends with a screen check (desktop + phone, a dark and a light
theme), a commit, and a stop for review.

### 1. New frame, old insides
Rebuild the player's HTML in the new order: header, media, song name, chart
story, progress, controls, tabs, panel, bottom row. Every existing id and
`_yt*` function stays wired, so nothing stops working while the rest is
built. New CSS uses the theme tokens (`--accent`, `--on-accent`, surfaces) so
all 12 themes look right. Bump `style.css?v=`.

### 2. The five controls and named buttons
- **Previous**: restarts the song if past 3 seconds, otherwise plays the last
  song from History.
- **Shuffle**: on/off, remembered; Next picks a random song from Up Next.
- Repeat keeps its three states (off / all / this song) with a clear "1" badge.
- One tooltip style for every button: name + key. New keys: B (previous),
  X (shuffle), K (love), P (add to playlist), G (Stage), M (shrink to bar).
  Added to the key list and to `_ytToggleShortcuts`.

### 3. Artwork, video and colour
- Artwork / Video switch at the top of the media area (today the video only
  shows in bigger sizes).
- The record slides out and spins while playing; stops on pause. Off with
  reduced motion.
- Colour taken from the artwork for the soft glow. Some artwork can't be read
  by the browser (blocked by the image host); then the theme accent is used.
- "Official video found" / "Best match" note, linking to Find another version.

**Wrong or missing video: paste a link (added 2026-11-08)**

How a video is found today, and stays so: shared memory (videos anyone found
before) → Wikidata → MusicBrainz → YouTube search (uses the daily quota,
signed-in only). Find another version also asks Wikidata before YouTube.

- **Paste a YouTube link** box in Find another version: always there, and
  shown as the clear next step when nothing is found ("Can't find it? Open
  YouTube, copy the video's link and paste it here"). Accepts youtube.com,
  youtu.be, music.youtube.com and shorts links (`_ytIdFromUrl`).
- **Check that it's the right song** before sharing it: read the video's
  title and channel from YouTube's free oEmbed (no quota) and compare with the
  song and artist, ignoring case, accents, "feat.", "(Official Video)",
  "- Remastered" and the like.
  - Clear match (title has song + artist, or song in title and the artist is
    the channel, incl. "Artist - Topic"): plays and is saved for everyone.
  - Partial match (only song or only artist): plays, then asks "Is this the
    right song? Save it for everyone / Just for me".
  - No match: plays for that person only, never shared, with a plain note why.
  - Broken, removed or not allowed on other sites: not saved, "try another link".
- Saved for everyone only **after it really plays**, and only for signed-in
  users (the shared memory's existing rule); signed-out users can still play it.
- **Hand-picked search results** get the same check and are saved for everyone
  too (today a hand pick only plays for that person).
- Limit, said plainly in the guide: the check reads the title, not the sound.
  Anyone can fix a wrong video with Find another version; a video that won't
  play is already forgotten automatically.

### 4. Chart story
Four tiles under the song name: rank this week, peak, your plays, weeks on
chart, built from the data already loaded, for every source. A tile with no
data hides. Clicking a tile opens the song's window, as from All-Time.
Songs not in your charts show "New to you" instead.

### 5. Scrobble mark
A green mark on the progress bar at the point set in Scrobble at (30 s, 50%,
70%, end). Before it: "Counts at 1:26". After: "Scrobbled to Last.fm". Without
Last.fm connected: "Not scrobbling: connect Last.fm in Settings", with a link.

### 6. Tabs: Up Next, History, Tools
- **Up Next** is today's queue with all its features, plus a "Playing from …"
  line, Save as playlist and Clear (Clear uses the in-site confirm window).
- **History** is today's history list with "3 min ago" times.
- **Tools**: one card per extra (Find another version, More by this artist,
  Sleep timer, Speed, Crossfade, Scrobble at, Saved playlists, Share card,
  Pop-out window, Open on YouTube, Keyboard keys, Take the tour). Each card
  shows its current value and does the same thing as today's button.
- The player remembers the last open tab.

### 7. Synced lyrics
Ask LRCLIB (free, no key) first for timed lyrics; the line being sung is big
and bright, the next one dimmer; click a line to jump. If there are no timed
lyrics, fall back to today's source (lyrics.ovh) as plain text. Clear
"No lyrics found" message.

### 8. Heart (Favorites playlist) and Add to playlist
- **Heart** adds the song to a playlist called **Favorites**; pressing it again
  takes the song out. The first heart creates the playlist.
- Favorites is a normal saved playlist: it shows in the Playlists tab and the
  player's Saved playlists, can be played, reordered and shared, and syncs
  across devices like the others. Works for Last.fm, Sheets and CSV.
- The heart is filled whenever the song playing is in Favorites (also on the
  bar, Stage and phone).
- With Last.fm connected it also loves the track on Last.fm (and unloves it
  when removed), using a signed call like scrobbling.
- **Add to playlist** opens the existing playlist picker.

### 9. Bottom row and the three sizes
- Bottom row: volume, Speed chip (shows 1×), Sleep chip (shows time left), ?.
- Sizes become **Bar**, **Card** and **Stage**, replacing S/M/L + collapse.
  The **Bar** sits at the bottom of the page: artwork, song, rank, Previous /
  Play / Next, what's next, Up Next count, open button, thin progress line on
  top. Dragging the card, PiP and the remembered position keep working.

### 10. Stage mode
Big video on the left, Lyrics / Up Next / About on the right, controls along
the bottom. G or Esc to leave. Falls back to artwork when there is no video.

### 11. Phone
Full screen when open, 44 px+ buttons, Up Next / Lyrics / History / Tools as
named buttons along the bottom that open as sheets, swipe down to shrink to
the bar. Check on a real narrow screen.

### 12. Tour and first-visit hint
- **?** starts a six-stop tour: controls, chart story, scrobble mark,
  artwork/video, tabs, bottom row. Next / Skip; Esc closes.
- The first time the player opens, one hint: "Your music player … Show me
  around / Got it". Shown once (remembered per user).

### 13. Charts Guide lesson
A **Music player** lesson in the new guide: hotspot screenshot of the player,
how-to slideshows (queue songs, find a better video, set a sleep timer, use
Stage mode, read the scrobble mark), challenges ("Turn on shuffle", "Open the
Lyrics tab") and a 3-question check. Screenshots in all 4 languages, using the
app's exact labels.

### 14. Languages, final check, What's New
- All player text through `t()`; Spanish and Portuguese in
  `translations.<lang>.js` (bump `DC_I18N_V` in index.html and setup-guide.html).
- Screen check: every theme, every size, phone, all three sources, no source
  (sample data).
- What's New card with screenshots ("The music player has a new look"), plain
  short wording; bump the changelog `?v=`.

---

## Settled (2026-11-08)

1. **Previous**: restarts the song if past 3 seconds, otherwise plays the last
   song.
2. **Heart**: adds to / removes from the **Favorites** playlist (step 8).
3. **Start size**: the player opens as the floating **Card**, like today.
