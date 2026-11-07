# Setup Guide redesign — plan (2026-11-07)

The user asked for setup-guide.html to be fully redesigned: higher quality, friendlier,
step by step **with pictures** for every setup type and step, more engaging, and much
easier to find. Picks (2026-11-07):

- Screens on other sites (Google Sheets, Google's approval screens, Apps Script, Last.fm's
  API form, Spotify / Deezer / Apple / Takeout / ghan.nl) are **drawn replicas** in HTML:
  numbered dots land on the thing to click, in all four languages and every theme.
- dankcharts.fm's own screens are **real screenshots**, taken by a tool in four languages
  (same pipeline idea as tools/guide-shots.mjs).
- Build every step without stopping for review, commit each step, **no push without asking**.
- Keep the animated source icons (sheet bars, vinyl, file stack) and bring in the Glow Kit
  icons — "the glowing icons are amazing".
- Improve, never remove: every existing step, note, FAQ and the Apps Script copy stay.

## Steps

1. **Page shell + chooser.** New hero ("Get your music in"), three big path cards with
   badge, time, step count and what you get; "Not sure? Answer two questions" chooser that
   recommends a path; Glow Kit icons on the page; deep links `?tab=…&step=N`.
2. **Picture engine.** `.shot` component: browser / app frame with address bar, scene that
   scales to fit, numbered dots placed on `[data-dot]` elements (so they follow the text in
   every language), the step's "Do this" list numbered to match, hover a line ⇄ light its
   dot, click to zoom (lightbox). Real screenshots use measured spots (fractions).
   Step cards re-laid out as picture + actions.
3. **Google Sheets path, steps 1–4 pictures**: template "Make a copy", Last.fm API form +
   the key page, the Settings tab (B1/B2), Extensions → Apps Script.
4. **Google Sheets path, steps 5–7 pictures**: the Last.fm menu, the four approval screens
   (mini slideshow), Share dialog + Copy link, Apps Script deploy dialog (gear → Web app)
   and the Web app URL.
5. **Last.fm path**: new step 1 "Quick start — just your username" (the fastest start the
   landing card promises but the guide never covered), then pictures for API app, the
   key page, Connect / approve on Last.fm, and the ✎ edit + Push.
6. **Upload path pictures**: Spotify / Deezer / Last.fm (ghan.nl) / YouTube (Takeout) /
   Apple request screens, the header-row rename (before → after), Download as CSV.
7. **Real dankcharts.fm screenshots**: tools/setup-shots.mjs → dankcharts/setup/<lang>/
   (Settings → Google Sheets fields, Web App URL, Last.fm username, Last.fm account
   connect + custom credentials, upload drop zone, Raw Data edit with Push, Add Play).
8. **Easier to find**: landing cards get a clear "Step-by-step guide with pictures" button
   and a banner under the cards; Settings chips stand out; load errors (sheet not shared,
   #gid, no columns) link to the exact fix; Charts Guide "Getting started" + footer +
   account menu link; FAQ entries get anchors.
9. **Translations**: every new string and every replica label in ES, PT-BR, PT-PT
   (Google's own words per language: "Hacer una copia", "Compartilhar", "Partilhar"…).
10. **Final check**: all 12 themes, phone widths, print / Save as PDF, no-JS fallback,
    changelog + What's New card, memory.

## Files

- dankcharts/setup-guide.html — page (markup, CSS, script)
- dankcharts/setup-scenes.js — the drawn replica scenes (new)
- dankcharts/setup-guide-i18n.js — ES / PT strings
- dankcharts/setup/<lang>/*.webp + shots.json — real screenshots (new)
- tools/setup-shots.mjs — screenshot tool (new)
- dankcharts/index.html, app.js, guide.js — entry points (step 8)
