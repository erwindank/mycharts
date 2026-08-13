# Dead Code Cleanup — Phased Deletion Prompts

Analysis date: **2026-08-13** (commit `945075d`).

Each phase below is a self-contained prompt. Paste **one phase at a time** into a fresh
Claude Code session. Every phase repeats the shared rules, because a new session has none
of the original analysis context.

Phases are ordered by confidence, highest first. Do them in order and commit after each,
so `git bisect` stays useful if something breaks.

> **Line numbers in this file are from 2026-08-13 and drift as soon as you delete anything.**
> Every prompt tells Claude to locate code by identifier, not by line number.

---

## Confidence summary

| Phase | What | Confidence | Failure mode if wrong |
|---|---|---|---|
| 1 | 7 unused variables (+1 cascade) | ~98% | None |
| 2 | 4 unused functions | ~95% | Hard crash (ReferenceError) |
| 3 | Root duplicate app files | High, but needs a manual pre-check | Live site down |
| 4 | 20 unused CSS classes | ~85% | Cosmetic — unstyled element |
| 5 | 48 unused i18n keys | ~75% | Raw key / blank text in one language |

---

## ⛔ Do NOT delete these — verified live despite looking dead

Three rounds of analysis produced three false positives. They are recorded here so nobody
rediscovers them as "dead":

| Looks dead | Actually reached via |
|---|---|
| `.m-up` `.m-down` `.m-new` `.m-re` | `` `m-${dir}` `` and `` `m-${isRe ? 're' : 'new'}` `` in `mPrevCell()` |
| `*_one` `*_other` `*_one_mobile` `*_other_mobile` (all of them) | `tUnit(key,n)` → `key + '_one'` / `key + '_other'` in `translations.js` |
| `rec_ov_*_month` / `rec_ov_*_year` | `ovL(base,pd)` → `base + '_' + pd` |
| `onYouTubeIframeAPIReady` | Called by the YouTube IFrame API by name |
| `tooltip_theme_*` | `'tooltip_theme_' + normalizedTheme.replace('-','_')` |
| `labels_on` / `labels_off` | `updateLabelButton()` in `translations.js` |
| `backend/`, `render.yaml` | Live — `BACKEND_API = 'https://dankcharts-api.onrender.com'` |
| `functions/deezer-proxy.js` | Live — fetched as `/deezer-proxy` |
| `#zohodeskasap` | Zoho support widget bootstrap script |

**Key lesson for whoever runs these:** this codebase builds class names and translation keys
by string concatenation, and some helpers live *inside* `translations.js`. A plain grep for
an identifier is not sufficient proof that it is unused.

---

## Shared rules (already embedded in each prompt below)

- Repo: `c:\Users\erwin\Desktop\mycharts`
- **Only `dankcharts/` is deployed.** Never edit root `app.js` / `style.css` / `index.html` / `translations.js`.
- Keep code comments — do not strip them while editing.
- If you edit `dankcharts/style.css`, bump `style.css?v=N` in `dankcharts/index.html`.
- If you edit `dankcharts/app.js`, bump `app.js?v=N` in `dankcharts/index.html`.
- `translations.js` and `firebase.js` have **no** cache-bust query — nothing to bump.
- `translations.js` has **4 language blocks** (`en`, `es`, and two Portuguese variants). A key must be removed from all 4.
- One commit per phase.

---

# PHASE 0 — Pre-flight (do this yourself, not via Claude)

Before Phase 3 only. Open the Cloudflare Pages dashboard for **dankcharts.fm** and confirm:

- **Build output / root directory = `dankcharts`**

There is no deploy config tracked in the repo (no `wrangler.toml`, no `netlify.toml`,
no `.github/`), so this cannot be verified from the files. If the root directory is `/`
instead, **skip Phase 3 entirely** — the root files are the live site.

---

# PHASE 1 — Unused variables

```
In c:\Users\erwin\Desktop\mycharts, only the dankcharts/ folder is deployed — never edit the
root app.js/style.css/index.html/translations.js. Keep existing code comments intact.

In dankcharts/app.js, delete these variable declarations. Each is assigned exactly once and
never read anywhere in the codebase. Locate each by name (line numbers below are stale
references from 2026-08-13, verify before editing):

  IMG_SOURCES          (~line 688)
  sparkData            (~line 10794)
  histPeak             (~line 14942)
  descOverlayMaxW      (~line 17897)
  diamondSongs         (~line 18789)
  diamondAlbums        (~line 18796)
  _stMilestonesCount   (~line 31010)

Notes:
- sparkData, diamondSongs and diamondAlbums each perform real work whose result is discarded
  (a full pass over allPlays, and two .filter().length scans). Removing them is a small perf win.
- CASCADE: buildSparklineValues() (~line 10226) has exactly one caller — the sparkData line.
  Once sparkData is gone, buildSparklineValues becomes dead too. Confirm it has no other
  callers, then delete it as well.
- Do NOT delete sparklineSvg() — it is still used at ~line 10828 with a different variable.
- _buildPeriodPlaysMap() is pure and has other callers; leave it.

Before deleting each one, re-grep the whole dankcharts/ folder for the identifier to confirm
it still has no readers. Then bump app.js?v=N in dankcharts/index.html and commit as
"chore: remove unused variables".
```

---

# PHASE 2 — Unused functions

```
In c:\Users\erwin\Desktop\mycharts, only the dankcharts/ folder is deployed — never edit the
root app.js/style.css/index.html/translations.js. Keep existing code comments intact.

In dankcharts/app.js, delete these functions. Each is defined once and called from nowhere in
app.js, index.html, firebase.js, translations.js, setup-guide.html, privacy.html or terms.html.
Locate each by name (line numbers are stale references from 2026-08-13):

  computeWindowCountsForType   (~lines 11332-11367, 36 lines, "sliding-window chart morph")
  findAlbumNo1Weeks            (~lines 19408-19423, 16 lines)
  updateIgFontLabel            (~lines 16971-16973, wrapper that only calls updateIgFontLabels())
  updateCrIgTitleSizeLabel     (~line 17484, one-line alias for updateCrIgSizeLabels())

For updateCrIgTitleSizeLabel: its comment claims "backward-compat alias used by openCrIgModal".
That comment is stale — openCrIgModal does not call it. Remove the comment along with it.

Do NOT delete updateIgFontLabels() or updateCrIgSizeLabels() — those are the live targets.

Do NOT delete onYouTubeIframeAPIReady() — it looks uncalled but the YouTube IFrame API invokes
it by name from outside the codebase.

Optional, your call: window.dcResetCertTimeline (~line 22595) is never invoked anywhere. It
reads as a deliberate escape hatch for resetting the cert timeline cache. Ask me before removing it.

Verification before deleting: this codebase has no eval(), no new Function(), and no
window[...]() dynamic dispatch — I verified that — so a name grep is sufficient proof here.
Re-confirm that's still true, then delete.

Then bump app.js?v=N in dankcharts/index.html and commit as "chore: remove unused functions".
```

---

# PHASE 3 — Root duplicate app files

**Run PHASE 0 first.** Skip this phase if the Pages root directory is not `dankcharts`.

```
In c:\Users\erwin\Desktop\mycharts, only the dankcharts/ folder is deployed to Cloudflare Pages.
I have confirmed in the Cloudflare dashboard that the Pages root directory is "dankcharts".

Delete these four stale root-level duplicates (~965 KB total):

  app.js           (512 KB, last touched 2026-06-01)
  style.css        (176 KB, last touched 2026-05-17)
  index.html       (130 KB, last touched 2026-05-17)
  translations.js  (147 KB, last touched 2026-04-27)

The live equivalents in dankcharts/ were all last touched 2026-08-11.

Before deleting, verify: dankcharts/index.html must reference only same-folder assets
(style.css?v=N, app.js?v=N, firebase.js, translations.js) with no "../" paths anywhere in
dankcharts/. If you find any parent-directory reference, stop and tell me.

Do NOT delete: backend/, render.yaml, DESIGN.md, PRODUCT.md, README.md, dankcharts/ anything.
The backend is live and used via BACKEND_API in dankcharts/app.js.

Use git rm so the deletion is tracked and revertible. Commit as
"chore: remove stale root-level duplicates of the dankcharts app".
```

---

# PHASE 4 — Unused CSS classes

```
In c:\Users\erwin\Desktop\mycharts, only the dankcharts/ folder is deployed — never edit the
root app.js/style.css/index.html/translations.js. Keep existing code comments intact.

In dankcharts/style.css, delete the rules for these 20 class selectors. None appear in any
HTML or JS, either as a literal or via dynamic string construction:

  ctrl-sep                 src-toggle-btn           display-toggle-btn
  chart-display-toggles    toggle-btns              controls-spacer
  controls-actions         controls-toggles         badge-new
  badge-re                 ig-share-bar             view-profile-link
  rec-subsection-content   rec-section-sub-header   rec-grid-2
  yt-playall-row           chart-row-fade-out       peak-badge-other
  awards-picker-hint       weekly-view-label

Largest clusters: .display-toggle-btn (8 rules), .chart-display-toggles (7 rules),
.toggle-btns and several others (2-3 rules each). Roughly 50 rules total.

CRITICAL — do NOT delete .m-up, .m-down, .m-new or .m-re. They look dead to a plain grep but
are generated dynamically in mPrevCell() as `m-${dir}` and `m-${isRe ? 're' : 'new'}`.
Deleting them breaks every movement arrow on every chart row.

This codebase builds class names by concatenation a lot. Before deleting each selector, check
the whole dankcharts/ folder for partial-string construction: for a class "foo-bar-baz", search
for every prefix ("foo", "foo-", "foo-bar"...) followed by ${ or ' +, and every suffix likewise.
A short prefix like "m-" is enough to make a class live.

Then bump style.css?v=N in dankcharts/index.html and commit as
"chore: remove unused CSS rules".

Afterwards, load the app in a browser with startWithSampleData() and visually check the weekly
charts, the Records section, the IG/share export modals and the awards view.
```

**Also available but not included above** — 15 CSS custom properties defined and never read:
`--r-xl`, `--t-slow`, `--z-overlay`, `--sp-1`…`--sp-8`, `--surface-glass`, `--glow-accent`,
`--live`, `--active`. The `--sp-*` set looks like an intentionally-reserved design-token scale,
so decide deliberately rather than bulk-deleting.

---

# PHASE 5 — Unused i18n keys

Do this last, and **in batches**, not all at once.

```
In c:\Users\erwin\Desktop\mycharts, only the dankcharts/ folder is deployed — never edit the
root app.js/style.css/index.html/translations.js. Keep existing code comments intact.

dankcharts/translations.js has 4 language blocks (en, es, and two Portuguese variants). Each
key below must be removed from all 4. translations.js has no cache-bust query string, so
nothing to bump in index.html.

Delete these 48 keys. Work in batches of ~12, and after each batch re-grep the dankcharts/
folder to confirm nothing references them:

  chartsize_label        chartview_label        modal_artist_peak
  modal_songs_charted    modal_best_song_peak   modal_album_peak
  modal_best_track_peak  modal_top_song         period_loading
  sub_dropouts           btn_share              btn_refresh
  btn_prev_page          btn_next_page          empty_no_data
  empty_none_this_week   race_pause             rec_nav_all
  rec_intro_prefix       rec_weekly_top         rec_monthly_top
  rec_yearly_top         rec_data_summary       rec_th_days_to_1k
  rec_th_reached_1k      rec_th_time_since      rec_chart_label
  rec_top_songs          rec_top_artists        rec_top_albums
  rec_pak_badge          mil_th_first_artist    mil_th_first_song
  drop_none_this_week    modal_no_tracks        acc_album_no1
  acc_album_peak         acc_no1_songs          ig_rows
  ig_branding            cr_year_only           cr_up_to_year
  tooltip_week_start_day time_machine_no_data   st_discoveries_more
  st_milestones_show_all st_grammy_nom          st_grammy_noms

CRITICAL — translation keys in this app are frequently BUILT, not written literally, and some
of the builders live inside translations.js itself. Before deleting any key, check it against
all of these mechanisms:

  1. tUnit(key, n)      -> key + '_one' / key + '_other'
  2. tCount(key, n)     -> wraps tUnit
  3. tCountHtml(key, n) -> also key + '_one_mobile' / key + '_other_mobile'
  4. ovL(base, pd)      -> base + '_' + pd   (yields _month / _year variants)
  5. 'tooltip_theme_' + normalizedTheme.replace('-','_')
  6. t(variable) call sites where the key comes from a config object field
     (cfg.unitKey, cfg.emptyKey, cfg.all, ty.label, p.label, c.tag, badgeKey, i18nKey, monthKey)

Do NOT delete any *_one / *_other / *_one_mobile / *_other_mobile key, any rec_ov_*_month or
rec_ov_*_year key, any tooltip_theme_* key, or labels_on / labels_off / masthead_est_default.
All of those are reached through the builders above.

Commit as "chore: remove unused translation keys".

Afterwards, load the app in a browser with startWithSampleData() and switch through all 4
languages, checking the Records section, the modals, the awards view and the stats view for
any raw key names or blank labels leaking into the UI.
```

---

# BONUS — Not dead code, but a real bug found during the audit

The legacy upload zone at `dankcharts/index.html` (~lines 311-317) is **reachable but inert**:

- Landing card 03 "Upload File" → `selectLandingSource('file')` → `startFromLanding()` →
  `app.js` sets `#uploadZone` to `display:block`
- That zone contains `<input type="file" id="csvFile">` which has **no change listener, no drop
  handler, and no delegated listener anywhere in the codebase**
- The working CSV path is a different element: `#srcFileInput` in the Settings modal, wired to
  `importFileData()` in `app.js` (~lines 24786-24798)

The landing hint even promises "You'll choose your file on the next screen." A user who picks
CSV from the landing page lands on a dead drop zone. CSV is one of the three supported data
sources, so this wants fixing rather than deleting — either wire `#csvFile` to
`importFileData()`, or route the `file` branch to the Settings-modal picker.

---

# Verification recipe (after any phase)

Open the app with no data source configured and call `startWithSampleData()` in the console.
Records builds lazily, so open the Records section explicitly rather than assuming it rendered.

Surfaces worth a look after Phases 4 and 5:
weekly charts (movement arrows especially) · Bubbling Under / Off Chart / New Entries ·
Records · Awards · Stats · the IG / share export modals · Settings · all 4 languages.
