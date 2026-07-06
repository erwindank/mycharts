---
name: dankcharts.fm
description: Personal music charts app — rankings, badges, and shareable stats built from Last.fm, Spotify, or Google Sheets listening data
colors:
  navy-void:        "#0d141f"
  navy-deep:        "#131c2c"
  navy-panel:       "#192437"
  navy-surface:     "#1f2e4a"
  navy-border:      "#2b3d5e"
  navy-border-hi:   "#3d5685"
  ink-bright:       "#edf2fa"
  ink-mid:          "#aac2e2"
  ink-dim:          "#84a4ce"
  accent-blue:      "#58aaf6"
  accent-blue-hi:   "#8ec7f8"
  teal:             "#38bdf8"
  green:            "#34d399"
  amber:            "#fbbf24"
  rose:             "#fb7185"
  gold-badge:       "#f0aa30"
  gold-badge-hi:    "#fcd34d"
  heatmap-cosmic-1: "#3a1858"
  heatmap-cosmic-2: "#ff7ee0"
  heatmap-fire-1:   "#5c1500"
  heatmap-fire-2:   "#ffd030"
  heatmap-ocean-1:  "#0d3060"
  heatmap-ocean-2:  "#7ee8ff"
  heatmap-forest-1: "#174d17"
  heatmap-forest-2: "#b0f0b0"
  heatmap-ember-1:  "#4a0a08"
  heatmap-ember-2:  "#f09000"
typography:
  display:
    fontFamily: "'Bricolage Grotesque', 'IBM Plex Sans', sans-serif"
    fontSize: "clamp(1.5rem, 5vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "normal"
  body:
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.4
  data:
    fontFamily: "'JetBrains Mono', ui-monospace, 'Cascadia Mono', monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "normal"
rounded:
  xs: "4px"
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "18px"
  pill: "20px"
  circle: "50%"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "40px"
  8: "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent-blue}"
    textColor: "{colors.navy-void}"
    typography: "{typography.data}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-mid}"
    typography: "{typography.data}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  badge-gold:
    backgroundColor: "transparent"
    textColor: "{colors.gold-badge}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  modal-panel:
    backgroundColor: "{colors.navy-panel}"
    textColor: "{colors.ink-bright}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: dankcharts.fm

## 1. Overview

**Creative North Star: "The Scoreboard"**

dankcharts.fm turns a listener's scrobble history into a leaderboard: ranked Songs, Artists, and Albums, backed by dense, precise numbers, and topped with collectible badges. The system is data-nerdy and playful at once — it never apologizes for showing exact play counts and rank deltas, but it also has fun with the presentation: a pulsing gold badge glow, nine swappable color themes (navy, purple, yellow, pink, red — each with a dark and light variant), and a dedicated share-as-image path so a chart looks intentional the moment it's screenshotted.

This explicitly rejects the generic SaaS analytics-dashboard look — flat gray cards, corporate blue, data buried under chrome. Numbers and rankings are the hero; UI chrome (nav, size controls, modals) stays quiet and monospace so it reads as "data instrument," not decoration.

**Key Characteristics:**
- Monospace numerals for anything that is a rank, count, or stat — JetBrains Mono is the "this is real data" signal.
- Soft, tactile surfaces: gentle shadows and 4–20px rounded corners, never sharp/flat, never glassmorphic.
- Color theme is the personality lever — nine total themes (5 hues × dark/light) let the same layout feel completely different without touching structure.
- Badges and share-as-image output are treated as first-class, polished surfaces, not afterthoughts.

## 2. Colors

The default theme (Navy Dark) is a deep navy void with an electric blue accent; eight sibling themes (Navy Light, Purple, Yellow, Pink, Red — each dark + light) swap the same token set for a different hue family. All accent pairs are contrast-checked per theme (see inline comments in `style.css`, e.g. accent recalibrated from 3.96:1 to 4.88:1).

### Primary
- **Electric Blue** (`#58aaf6` / `accent-blue`): the default theme's single accent — active states, links, primary buttons, current-rank highlight.
- **Blue Glow** (`#8ec7f8` / `accent-blue-hi`): hover/active brightening of the primary accent, never a separate meaning.

### Secondary
- **Gold Badge** (`#f0aa30` → `#fcd34d` / `gold-badge` → `gold-badge-hi`): reserved for achievement badges (BU badges) and their pulse-glow animation. Gold is the one color that means "you earned this," never used for standard UI.

### Tertiary
- **Teal / Green / Amber / Rose** (`#38bdf8`, `#34d399`, `#fbbf24`, `#fb7185`): a small semantic set for chart deltas and status (up/down movement, streaks, warnings). Each theme redefines these to hold contrast against its own background rather than importing the navy values verbatim.

### Neutral
- **Void** (`#0d141f` / `navy-void`): page background.
- **Deep / Panel** (`#131c2c`, `#192437`): layered surfaces — nav bars, modal backgrounds.
- **Surface** (`#1f2e4a`): raised cards, controls, the chart-size bar.
- **Border / Border-hi** (`#2b3d5e`, `#3d5685`): default hairline vs. focus/hover border.
- **Ink Bright / Mid / Dim** (`#edf2fa`, `#aac2e2`, `#84a4ce`): primary text, secondary labels, tertiary/disabled text — in that order of emphasis.

### Heatmap Gradient Themes
The activity heatmap has its own color-scale picker, independent of the site's nine UI themes — five two-stop gradients (dark → bright) a listener can pick per-heatmap, similar to how GitHub's contribution graph decouples its color scale from site chrome:
- **Cosmic** (`#3a1858` → `#ff7ee0` / `heatmap-cosmic-1` → `heatmap-cosmic-2`): the default gradient — deep violet to hot pink.
- **Fire** (`#5c1500` → `#ffd030` / `heatmap-fire-1` → `heatmap-fire-2`): charcoal-red to gold.
- **Ocean** (`#0d3060` → `#7ee8ff` / `heatmap-ocean-1` → `heatmap-ocean-2`): deep navy to cyan.
- **Forest** (`#174d17` → `#b0f0b0` / `heatmap-forest-1` → `heatmap-forest-2`): dark green to mint.
- **Ember** (`#4a0a08` → `#f09000` / `heatmap-ember-1` → `heatmap-ember-2`): near-black red to amber.

### Named Rules
**The Heatmap Palette Is Separate Rule.** Heatmap gradient colors never bleed into UI chrome (buttons, nav, cards) and vice versa — the heatmap picker is a data-visualization surface with its own five-scale system, not a tenth site theme.

**The One Accent Per Theme Rule.** Each color theme carries exactly one primary accent hue (blue, purple, yellow, pink, red). Never mix two themes' accents on screen at once; switching themes is a full identity swap, not a palette blend.

**The Gold Means Earned Rule.** Gold (`gold-badge`) is reserved for badges/achievements. If a control isn't rewarding the user for something, it doesn't get gold.

## 3. Typography

**Display Font:** Bricolage Grotesque (with IBM Plex Sans, sans-serif fallback)
**Body Font:** IBM Plex Sans (with system-ui, sans-serif fallback)
**Data/Label Font:** JetBrains Mono (with ui-monospace, Cascadia Mono, monospace fallback)

**Character:** A bold, slightly quirky grotesque display face (Bricolage Grotesque) gives section headers and the "dankcharts" wordmark a distinctive, modern voice, while IBM Plex Sans (body/UI) and JetBrains Mono (data) are a classic, highly legible technical pairing — sans for prose and labels, mono for anything that's a number or a rank.

### Hierarchy
- **Display** (400 weight, `clamp(1.5rem, 5vw, 2.25rem)`, 1.1 line-height): section titles (artist/album/track modal headers), used sparingly.
- **Body** (400 weight, 1rem, 1.4 line-height): descriptive text, settings labels, modal copy.
- **Data** (500 weight, 0.875rem, 1.3 line-height): rank numbers, play counts, dates, size/period controls — always JetBrains Mono.
- **Label** (500 weight, 0.75–0.8125rem, tight tracking): buttons, nav pills, chips — JetBrains Mono, occasionally IBM Plex Sans for longer button text.

### Named Rules
**The Mono-Means-Data Rule.** If a piece of text is a number, a rank, a date, or a control label tied to data (size buttons, period nav), it renders in JetBrains Mono. IBM Plex Sans is reserved for prose and long-form copy. Never mix the two within the same numeric readout.

## 4. Elevation

Surfaces are soft and tactile, not flat and not glassy. Depth comes from a combination of gentle box-shadows (`0 4px 20px rgba(0,0,0,0.35)` on raised panels, lighter `0 2px 10px rgba(0,0,0,0.12)` on light-theme cards) and generous, consistent corner rounding (4px on small controls up to 20px on pills). Badges add a second kind of depth: an animated glow (`box-shadow` pulse between transparent and a gold ring) that signals "special," standing in for elevation where a shadow would be too heavy.

### Shadow Vocabulary
- **panel-raised** (`box-shadow: 0 4px 20px rgba(0,0,0,0.35)`): modals, dropdowns, the theme switcher panel.
- **panel-raised-strong** (`box-shadow: 0 6px 24px rgba(0,0,0,0.45)`): top-level modals (config/source modal).
- **card-light** (`box-shadow: 0 2px 10px rgba(0,0,0,0.12)`): cards on light theme variants, kept subtle since light backgrounds need less contrast to read as "raised."
- **badge-glow-pulse** (`box-shadow: 0 0 0 0 transparent → 0 0 10px 3px var(--gold1)`, animated): the achievement-badge signal; the only shadow that's animated rather than static.

### Named Rules
**The Glow-Not-Shadow Rule for Badges.** Achievement badges signal importance with an animated gold glow, not a drop shadow. Shadows communicate physical elevation; glow communicates "earned" — don't conflate the two.

## 5. Components

### Buttons
- **Shape:** 4px radius on standard controls (size buttons, nav buttons), up to 8px on larger action buttons.
- **Primary:** accent-colored background or border, JetBrains Mono label, compact padding (~8px 14px).
- **Ghost / Icon:** transparent background, border appears on hover/focus; circular (50% radius) for icon-only buttons like the theme dots and close buttons.
- **Hover / Focus:** border brightens from `border` to `border2`/`accent2`; no scale or shadow pop — the feedback is color-only, matching the "quiet chrome" principle.

### Chips / Pills
- **Style:** 20px radius, JetBrains Mono label, used for period-nav segments and badge pills.
- **State:** active segment gets the theme's accent background; inactive segments stay on `surface`/`border`.

### Cards / Modals
- **Corner Style:** 8–12px radius for modals and panels.
- **Background:** `bg2`/`bg3` (navy-deep/navy-panel) layered over the page `bg`.
- **Shadow Strategy:** see Elevation — `panel-raised` or `panel-raised-strong` depending on modal importance.
- **Border:** 1px `border` hairline, brightening to `border2` on focused inputs within.
- **Internal Padding:** ~24px for modal bodies, tighter (12–16px) for compact panels like the chart-size bar.

### Theme Switcher
- **Style:** small (12px) circular swatches stacked top-right, one per theme; the active theme's dot gets a border ring.

### Badges (BU Badges)
- Pill-shaped, gold-accented, with the animated glow-pulse described in Elevation. The signature "you earned this" component — distinct from every other pill/chip in the system.

### Navigation
- **Period-nav / date-nav:** horizontal button rows, JetBrains Mono labels, shrink variant (`.nav-shrunk`) for narrow viewports rather than wrapping.

## 6. Do's and Don'ts

### Do:
- **Do** use JetBrains Mono for every number, rank, date, and data-tied control label.
- **Do** keep corner radii in the 4–20px range depending on component scale (controls small, pills largest).
- **Do** use color-only feedback (border/background brightening) for hover/focus on buttons — no shadow pop, no scale transforms.
- **Do** treat badges and share-as-image output as polished, screenshot-ready surfaces — they're the app's shareable moment.
- **Do** build every visual feature so it works identically across all nine color themes, not just Navy Dark.
- **Do** support Last.fm, Google Sheets, and CSV-upload data sources equally in any new UI — never design a control that only makes sense for one source.

### Don't:
- **Don't** use flat gray cards or corporate-blue "SaaS dashboard" styling — that's the explicit anti-reference.
- **Don't** put a drop shadow on a badge; badges get the animated gold glow instead.
- **Don't** mix IBM Plex Sans and JetBrains Mono within the same numeric readout.
- **Don't** hide or truncate precise stats to "simplify" the UI — density is intentional, not a bug to fix.
- **Don't** introduce a second accent hue within one theme; theme-switching is the only way the accent changes.
