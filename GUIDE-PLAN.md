# The new Charts Guide — plan

The Charts Guide today is six chapters of text. People don't read it. The new
guide teaches every tab, every feature and every option with real screenshots
you can explore, step-by-step walkthroughs, and small challenges you complete
inside the real app. It should be a place people want to come back to.

Decisions (2026-11-05):
- Each tab gets a **lesson**. A lesson has both styles: a **hotspot screenshot**
  as the overview (tap a numbered dot to see what that part does) and **step
  slideshows** for the deeper "how do I…" tasks.
- Screenshots in **all 4 languages** (en, es, pt-BR, pt-PT).
- Built **step by step**; the user reviews each step before the next one.
- Nothing from the old guide is dropped. Its content (setup checks, FAQ,
  glossary, shortcuts, your data, milestones) stays under **Reference** until
  step 12 gives it a new home.
- Work on main, commit each step, no push without asking.

---

## What makes people come back

- **Mastery.** Every lesson has a progress ring. A lesson is mastered when its
  challenges and its quick quiz are done. The hub shows overall progress
  ("4 of 16 lessons mastered") and a badge per mastered lesson.
- **Challenges in the real app.** "Switch to the Mosaic layout", "Go back one
  week", "Turn on Peak tags". Each has a **Show me** button that opens the real
  tab and rings the control. The guide notices when you do it, wherever you are
  in the app, and a small toast says "Challenge done ✓".
- **Today's tip.** The hub opens with one feature tip a day (picture + Try it),
  so there is always something new.
- **New lessons are flagged.** When a big feature ships, its lesson (or its new
  part) gets a "New" tag, tied to the What's New highlights.
- **Continue where you left off** card on the hub.

## How a lesson looks

1. **Header** — tab name, one-line promise, time to read, mastery ring,
   Desktop / Phone switch for the pictures.
2. **Know your screen** — a big real screenshot with numbered dots. Pick a dot
   (or use ← →) and the picture dims everything except that part, with a callout
   saying what it is and what it does. The list of spots sits beside it.
3. **How to…** — walkthrough cards. Each opens a slideshow: one screenshot per
   step, a ring on the control to press, a short caption, Back / Next, dots,
   swipe on a phone.
4. **Every option** — the full reference: every switch, size, button and badge,
   each with a small picture cut from the screenshot, what it does and its
   default.
5. **Try it yourself** — the challenges (with Show me).
6. **Quick check** — 3 questions. Wrong answers explain the right one.
7. **Next lesson** card.

## How it's built

- `dankcharts/guide.js` — the engine: hub, lesson page, hotspot explorer,
  slideshow player, challenges (watches the app's own functions), quiz,
  progress (localStorage `dc_guide_progress`; synced for signed-in users in
  step 11). Loaded on every page (small) so challenges can be noticed anywhere.
- `dankcharts/guide-lessons.js` — the lessons and their English text. Loaded
  only when the guide opens. `guide-lessons.<lang>.js` hold the translations.
- `dankcharts/guide.css` — the guide's own styles.
- `dankcharts/guide/<lang>/<shot>.webp` — the screenshots;
  `dankcharts/guide/shots.json` — for every shot, where each control sits in
  the picture (measured when the picture is taken), so the dots and rings land
  exactly on the control in every language.
- `tools/guide-shots.mjs` — takes every screenshot with Playwright and the
  sample library, in all 4 languages, desktop and phone. Re-run it when a tab
  changes and the guide's pictures update themselves.
- The old guide keeps working as the **Reference** tab of the hub.

## Steps

Done: steps 1–8 (2026-11-06).

1. **Engine + hub + lesson 1 (Weekly chart).** The new frame, the screenshot
   pipeline, and one full lesson: the date bar, the Songs / Artists / Albums
   switch, the six layouts, how to read a row (moves, NEW, RE, peak, weeks,
   badges), the ⋮ menu (Show, Size, Actions), Animate chart. All 4 languages.
2. **Lessons: Daily, Monthly & Yearly, All-Time** (time travel, "Inside your
   Top N").
3. **Lessons: Around the chart and taking it out** — Bubbling Under, Off the
   Chart, New Entries, share as image, printable PDF, export playlist, Play all.
4. **Lessons: the windows** — song / artist / album windows, chart run, the
   top-bar search, the row ⋮ menu, the listening streak strip.
5. **Lesson: Stats** — Overview, Story, Graphs, Compare, Games.
6. **Lesson: Records** — all eleven sections, the plaque wall.
7. **Lesson: Awards** — set up, nominees, winners, the ceremony, share links,
   Real-Life awards.
8. **Lesson: Your Soundtrack** — chapters, Play your year.
9. **Lessons: Dank 100, Ratings, Events.**
10. **Lessons: Playlists (and automatic playlists), Raw Data (editing,
    autocorrect, export), Board.**
11. **Lesson: Settings & account** — data sources, chart settings, themes,
    language, sign-in and sync, notifications, backups. Guide progress syncs
    to your account.
12. **Getting started + Reference** — the Start Here checklist rebuilt as the
    first lesson, Today's tip pool complete, guide-wide search, the FAQ /
    glossary / shortcuts / your data redone in the new look, the welcome
    window and tour point into the lessons.
13. **Final check** — phone, every theme, retake every screenshot in 4
    languages, What's New card, then ask before pushing.

Each step: its lessons in all 4 languages, its screenshots in all 4 languages,
challenges that really get detected (checked with real clicks), commit.
