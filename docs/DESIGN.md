---
name: Tınaz Yapı (boutique residential developer demo)
description: A family developer that puts its name on the door. Proof over claims, lamp light over gloss.
colors:
  bg: "oklch(1 0 0)"
  surface: "oklch(0.967 0.006 150)"
  border: "oklch(0.905 0.01 150)"
  control-border: "oklch(0.62 0.02 150)"
  ink: "oklch(0.225 0.018 150)"
  muted: "oklch(0.47 0.02 150)"
  cypress: "oklch(0.33 0.065 148)"
  cypress-deep: "oklch(0.255 0.05 148)"
  on-cypress: "oklch(0.975 0.008 148)"
  on-cypress-muted: "oklch(0.8 0.03 148)"
  lamp: "oklch(0.8 0.14 64)"
  lamp-bright: "oklch(0.87 0.09 70)"
  danger: "oklch(0.54 0.19 28)"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.4rem + 4vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.3rem + 2vw, 2.75rem)"
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 115"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.25
    fontVariation: "'wdth' 100"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
    fontVariation: "'wdth' 100"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.04em"
    fontVariation: "'wdth' 112"
rounded:
  none: "0"
  sm: "2px"
  md: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
  gutter: "clamp(1rem, 0.5rem + 2.5vw, 3rem)"
  section: "clamp(4rem, 3rem + 5vw, 8rem)"
components:
  button-lamp:
    backgroundColor: "{colors.lamp}"
    textColor: "{colors.cypress-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "48px"
  button-lamp-hover:
    backgroundColor: "{colors.lamp-bright}"
  button-outline:
    textColor: "{colors.cypress}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "48px"
  button-outline-hover:
    backgroundColor: "{colors.surface}"
  button-on-cypress:
    textColor: "{colors.on-cypress}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "48px"
  button-on-cypress-hover:
    backgroundColor: "{colors.cypress-deep}"
  button-solid:
    backgroundColor: "{colors.cypress}"
    textColor: "{colors.on-cypress}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "48px"
  button-solid-hover:
    backgroundColor: "{colors.cypress-deep}"
  input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "48px"
  status-tag-selling:
    backgroundColor: "{colors.lamp}"
    textColor: "{colors.cypress-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  status-tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  header:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    height: "80px"
  sales-office-band:
    backgroundColor: "{colors.cypress}"
    textColor: "{colors.on-cypress}"
    padding: "{spacing.section} {spacing.gutter}"
  footer:
    backgroundColor: "{colors.cypress-deep}"
    textColor: "{colors.on-cypress}"
    padding: "80px {spacing.gutter}"
  lightbox:
    backgroundColor: "{colors.cypress-deep}"
    textColor: "{colors.on-cypress}"
---

# Design System: Tınaz Yapı

## 1. Overview

**Creative North Star: "The Lit Window"**

The whole system is built around one moment: a finished building at dusk, its windows lighting up one by one. That is what this firm sells, and what the buyer is imagining on the sofa at night: not a construction site, but a home with someone in it. Deep green is the rooted, local ground (a Bakırköy street under old plane trees, Yeşilköy's gardens); tungsten lamp amber is the single sign of life. The token keeps the name `cypress` in code for continuity; in copy and narrative the tree is never named, because in İstanbul cypress reads as a cemetery. Everything else is white space and real photography.

The voice is a mid-century Turkish apartment nameplate: wide, sturdy, proud letters cast in brass above a terrazzo entrance ("Yıldız Apartmanı, 1968"). A family that builds here puts its name on the door. The type carries that pride; the color carries warmth; neither shouts.

The home has two three.js moments with distinct jobs: the hero shows the promise (the finished building at night, lights coming on; see Components → Hero), and the **Construction Story** mid-page shows the proof: a three.js architectural model (white card, raw timber, warm spot light) that assembles as the visitor scrolls: ground survey, foundation, frame, handover. Each stage surfaces real, checkable data. The section ends in dusk: the surface turns cypress, the windows light up in lamp amber. The rest of the site is calm (Responsive motion: feedback and transitions only), so this moment reads as the one show. The hero is never pinned or scroll-driven.

**Layout.** One page shell: content max 90rem (1440px), side gutter fluid from 16px to 48px, vertical section rhythm fluid from 64px to 128px. Compositions sit on a 12-column grid from `lg` (1024px) and are deliberately asymmetric: 7/5 for a lead project, the hero text bottom-left with the model to its right, 4/8 for a heading beside a ledger. Lists are hairline-ruled rows, never card grids. Surfaces step white → Surface → Cypress → Deep Cypress down the page; that stepping is the depth system.

**Motion.** One curve everywhere: ease-out-quart (`cubic-bezier(0.25, 1, 0.5, 1)`). Color and state changes 200ms; image hover scale 1.02 at 500ms; mobile menu and dropdowns 200–250ms fade plus a 6–8px slide; FAQ answers animate height (300ms) and never leave the DOM; the Construction Story dusk transition is 900ms. Every transform is `motion-safe`; framer-motion runs under `reducedMotion="user"`. No entrance reveals on sections: content is visible from the first paint.

This system explicitly rejects: the classic Turkish contractor site (slider, icon cards, counters, orange-and-navy); luxury real-estate gloss (black and gold, script fonts, drone hero); the cold corporate holding (gray-blue, handshake stock); SaaS landing pages (gradients, glass, rounded cards); and the AI "boutique family firm" reflex (cream background, italic serif, "est. 19xx" eyebrows).

**Key Characteristics:**
- Pure white reading surface; photography and renders are the content.
- One committed brand color (cypress) on large, deliberate surfaces; one rare accent (lamp).
- A single variable family (Archivo) whose width axis does the work a second typeface would.
- Near-square corners, architectural precision, flat surfaces, hairline-ruled rows instead of cards.
- One choreographed section; everywhere else, quiet.

## 2. Colors

A cool, rooted green and a warm lamp amber on pure white: the cypress is the firm, the lamp is the home.

Theme scene: a couple in their forties on the living-room sofa after dinner, lamp on, looking at the same project on a phone for the third time and deciding whether to call the sales office tomorrow. Light theme for reading; the Construction Story section transitions to dusk.

### Primary
- **Cypress** (oklch(0.33 0.065 148)): The firm's color. Large committed surfaces: the Construction Story at dusk, the sales office band, the solid form-submit button; also the text-link, active-nav and icon color on white (11.9:1). Never a thin decorative accent.
- **Deep Cypress** (oklch(0.255 0.05 148)): The footer and the lightbox backdrop (one tonal step below the band, so band and footer read as two surfaces); hover state for cypress fills; the text color on lamp fills (8.07:1).

### Secondary
- **Lamp** (oklch(0.8 0.14 64)): 2700K tungsten, not metallic gold. The primary CTA fill (the sales office call), the "Satışta" status tag, and the lit windows in the construction model. Dark text only (Deep Cypress or Ink). Used on ≤10% of any screen.
- **Lamp Bright** (oklch(0.87 0.09 70)): Hover state of lamp fills. The light brightens on hover; it never darkens.

### Neutral
- **White** (oklch(1 0 0)): Body background, header, mobile menu, floor-plan sheets in the lightbox. Pure, untinted.
- **Surface** (oklch(0.967 0.006 150)): Alternate sections (delivery record, spec sheets, the contact form panel), non-selling status tags, image placeholders while photos load, outline-button hover. Tinted toward the cypress hue, never toward warm.
- **Ink** (oklch(0.225 0.018 150)): Body and heading text (17:1 on white).
- **Muted** (oklch(0.47 0.02 150)): Secondary text, captions, metadata, spec-sheet keys (6.76:1 on white, 6.15:1 on surface).
- **Border** (oklch(0.905 0.01 150)): Decorative hairlines and row rules only.
- **Control Border** (oklch(0.62 0.02 150)): Input and control outlines (3.61:1 on white, WCAG 1.4.11).
- **On Cypress** (oklch(0.975 0.008 148)) / **On Cypress Muted** (oklch(0.8 0.03 148)): Primary and secondary text on cypress surfaces (11.1:1 / 6.44:1). Hairlines on cypress are On Cypress at 20–25% opacity.
- **Danger** (oklch(0.54 0.19 28)): Form errors only (5.57:1 on white).

### Named Rules
**The One Lamp Rule.** Lamp is light, not decoration. It appears only where something is alive or actionable: the primary CTA, an available unit, a lit window. If two lamp elements compete on one screen, remove one.

**The No-Gold Rule.** Lamp is never rendered metallic: no gradients, no sheen, no pairing with serif or script type, no black backgrounds. Cypress plus metallic gold is a private bank; cypress plus lamp light is a home.

**The Lamp-Is-Never-Text Rule.** Lamp on white is 1.92:1. It is a fill or a light source, never a text or icon color on light surfaces. On cypress it may be text (6.18:1).

## 3. Typography

**Display Font:** Archivo (variable, wdth 62–125, wght 100–900; with system-ui fallback), loaded through `next/font` as `--font-archivo`
**Body Font:** Archivo (same family)

**Character:** One family, two voices. Expanded and heavy, it is the brass nameplate over the entrance; at normal width, it is a plain, honest spec sheet. The width axis replaces a second typeface.

### Hierarchy
The five roles exist as utilities (`type-display` … `type-label` in `src/styles/utilities.css`); components use them instead of ad-hoc sizes.

- **Display XL** (700, wdth 125, clamp(2.5rem → 5.75rem), line-height 0.98, -0.025em): the home hero H1 only (`type-display-xl`).
- **Display** (700, wdth 125, clamp(2.25rem → 4.5rem), line-height 1.02, -0.02em): Page H1 (`PageIntro`, project nameplates), the sales band headline beside its photo, the delivery-record years, and the Construction Story's stage titles. Wraps at ~18ch on inner pages.
- **Headline** (650, wdth 115, clamp(1.75rem → 2.75rem), line-height 1.1): Section H2 via `SectionHeading`, the lead project's name, the sales phone number, unit-type names ("3+1").
- **Title** (600, wdth 100, 1.375rem, line-height 1.25): Project names in rows and the ledger, the contact person's name, FAQ questions, mobile-menu links.
- **Body** (400, wdth 100, 1.125rem, line-height 1.6): All prose. 18px base for an older audience. Max 68ch; intros and summaries narrower (42–60ch). Hero and page-intro subtitles step up to 1.25rem from `md`. Numbers (phones, dates, areas) use tabular figures.
- **Label** (600, wdth 112, 0.875rem, 0.04em tracking): Spec-sheet keys (Teslim, Beton sınıfı, Yapı denetim), status tags, form labels, button text, the stage counter. Uppercase allowed here only.

Small text (0.875rem, regular): breadcrumbs, photo captions, the footer copyright line. Never below 0.875rem.

### Named Rules
**The Nameplate Rule.** Width 125 is reserved for display and the wordmark. If body copy or buttons start going wide, the nameplate stops meaning anything.

**The Turkish Overflow Rule.** Expanded type plus long Turkish words ("Projelerimiz", "Sürdürülebilirlik") overflows narrow screens. Every display heading is tested at 360px; below 480px, display steps down to wdth 112 (the `--display-wdth` token), and display headings carry `break-words`. Pages set `lang="tr"` so `text-transform: uppercase` produces İ, not I.

**The No Eyebrow Rule.** No small uppercase kicker above section headings. Labels label data, not sections. (`SectionHeading` still accepts `eyebrow` for future clients; it stays unused here.)

## 4. Elevation

Flat by default. Depth comes from tonal layering (white → Surface → Cypress → Deep Cypress) and from photography, never from drop shadows on cards or buttons. The sticky header separates with a 1px Border hairline, not a shadow. Dropdowns and the mobile menu are white panels with a 1px Border, no shadow. The only real shadows in the system live inside the three.js model, where they are physical light, not UI chrome.

**The Flat Paper Rule.** If a card needs a shadow to be seen, the layout is wrong. Fix the spacing or the surface tone instead.

## 5. Components

Captured from the code on 2026-09-28. Every component reads its copy from Sanity; field labels shared by Studio and site live in `src/lib/project.ts`.

### Logo
- **Wordmark:** "TINAZ" in Archivo 700 at wdth 125, "YAPI" set smaller beneath it (600, wdth 112, tracked +0.04em), left-aligned to the same edge. Ink on light surfaces, On Cypress on cypress surfaces. Never Lamp.
- **Current state:** until the SVG is uploaded, `Wordmark` sets the site name as live text: first word 1.625rem / 700 / -0.01em / wdth 125, the rest 0.75rem / 600 / +0.04em / wdth 112, 4px apart. An uploaded `siteSettings.logo` replaces it in the header (max 40px tall); the footer always uses the set wordmark, because the uploaded logo is ink-colored.
- **Favicon:** "T" alone in the same cut, on a Cypress square (0 radius): `public/icon.svg`.
- **Production (pending):** SVG converted from the font's outlines (no live text), so it renders identically everywhere and uploads to Sanity's `siteSettings.logo`.
- **Never:** a founding-year line ("1981 · Bakırköy"), a crane/roof/house pictogram, hand-drawn or sketchy marks, gradients, or a framed "plaque" border that turns the nameplate idea into a costume.

### Buttons
Sturdy and plain: a nameplate-width label on a near-square slab.

- **Shape:** Near-square (2px). Every button on the site is the 48px size (height 48px, 20px side padding, 8px icon gap, 20px icons); icons sit before the label.
- **Lamp (primary):** Lamp fill, Deep Cypress text, Label typography. The sales office call ("Satış ofisini arayın") in the hero and the sales contact. One per screen (The One Lamp Rule).
- **Outline (secondary):** Transparent, 1px Cypress border, Cypress text; hover fills Surface. The hero's "Projeler" link, WhatsApp on white.
- **On Cypress:** Transparent, 1px On Cypress border and text; hover fills Deep Cypress. WhatsApp inside the sales office band.
- **Solid:** Cypress fill, On Cypress text; hover Deep Cypress. The contact form's submit only (a form is not a call, so it does not take the lamp).
- **States:** color transitions 200ms; pressed nudges down 1px; disabled at 50% opacity. Focus ring 2px Cypress with 2px offset (on cypress surfaces: 2px On Cypress).
- **Text links as actions:** Cypress, semibold, underline on hover (4–6px offset), with a trailing arrow that slides 4px on hover ("Tüm projeler").

### Status Tag
- **Style:** Label typography, uppercase, 4px × 8px padding, 2px radius.
- **Satışta:** Lamp fill, Deep Cypress text: the only status that carries light.
- **Others (Yakında, İnşaat Halinde, Tamamlandı):** Surface fill, Ink text. The word carries the meaning, never the color alone.

### Spec List (Künye rows)
The signature data pattern, in the manner of a site information board.

- **Structure:** a definition list ruled by 1px hairlines top and bottom of every row; 12px vertical padding; two columns (key min 8rem : value, 2 : 3).
- **Key:** Label typography, uppercase, Muted. **Value:** Body, medium weight, Ink.
- **Tones:** default (Border / Muted / Ink), on cypress (On Cypress 25% / On Cypress Muted / On Cypress), story (follows the dusk variables).
- **Empty values are dropped;** an empty list renders nothing. Never "—".

### Project Row and Lead Project
- **Lead project (home):** 7/5 split; photo on the left (at least 36rem tall), then status tag, name in Headline at 3.25rem, location in Muted, summary (48ch), and a Spec List pushed to the bottom of the column: floors, homes, unit types, planned delivery. The lead reads like its site board.
- **Rows:** hairline-ruled list items, 24px vertical padding. Columns: 16rem photo (4:3) · name (Title) + location + summary · status tag and delivery line right-aligned (from `lg`; stacked below on smaller screens).
- **Interaction:** the whole row is one link (the title's stretched `::after`); hover underlines the title and scales the photo 1.02 over 500ms. No card chrome, no shadow, no radius on photos.

### Delivery Record (ledger)
- On Surface, heading on top, the ledger full width. Each entry leads with its delivery year (actual, else planned) in Display, Cypress, tabular (3 cols), then the name in Title and location (3 cols), then the facts (Label key over a tabular value, 6 cols): homes, planned delivery, actual delivery, occupancy permit. A missing fact simply isn't there, so there is never an empty column.
- **The column of years is the proof of age.** Running down to the first building (1981), it shows what an "est. 1981" badge or a "40+ years" counter would only claim.

### Sales Contact and Sales Office Band
- **Sales contact:** the named person: optional 4:5 portrait (8–10rem wide, no radius), name in Title, role in Muted, the phone number in Headline as a dialable link, working hours, then the Lamp call button and a WhatsApp button.
- **Band:** full-width Cypress section; shared by the home, about, and project pages; the site's closing sales moment before the Deep Cypress footer. With `salesOffice.bandImage` (lit windows at dusk work best) the photo bleeds off the left edge (6 cols, at least 40rem tall) and the headline in Display (max 14ch) plus the contact sit beside it. Without it: headline left (5 cols), contact right (7 cols).

### Inputs / Fields
- **Style:** White fill, 1px Control Border, 2px radius, 48px tall, 12px side padding, Body typography at 1.125rem (no iOS zoom). Textareas start at 128px and grow with content. Placeholders in Muted. Labels above in Label typography, 8px gap.
- **Focus:** Border becomes Cypress plus a 2px Cypress outline.
- **Error:** Danger border and a Danger message below the field with a warning icon and words (never color only), tied through `aria-describedby`.
- **Success:** the form is replaced by a Cypress hairline and a check icon beside the message in Title.

### Navigation
- **Header:** sticky, white, 1px Border hairline, 64px tall (80px from `md`). Wordmark left; desktop nav links (Body, 28px apart) and the sales phone as a text link with a Cypress phone icon on the right.
- **States:** hover and active links turn Cypress; active adds a 2px underline at 6px offset. Sub-menus open on hover/focus as a white panel with a 1px Border.
- **Mobile:** an always-visible phone icon and a menu button (both 44px targets). The menu is a full-height white panel under the header: links in Title on hairline rows, then the phone (Title), WhatsApp, and social icons (44px squares with a 1px Border). Body scroll locks; Escape closes it.
- **Breadcrumbs:** 0.875rem Muted, "/" separators in Border, current page in Ink, truncated at 24ch.
- **Footer:** Deep Cypress. Wordmark and tagline (5 cols), address with phone and email (4 cols), footer links (3 cols); a bottom rule at On Cypress 20% with the copyright line (`siteSettings.copyrightNotice`) and social icons in On Cypress Muted.

### Project Nameplate (project detail opening)
- The building's own photo full-bleed (up to one viewport under the breadcrumbs), its name on a Cypress plate at the base (46rem): status tag, Display name, location (map link), summary, then the price note with the Lamp call and the phone. Completed projects carry no price note and no call: nothing is on sale (The One Lamp Rule). On mobile the photo comes first and the plate follows at full width.

### Page Intro (inner pages)
- White, never a photo with an overlay. Breadcrumbs, then the H1 in Display (max 18ch), then a subtitle in Muted (52ch). If there is a photo it sits below the text inside the page shell at 21:9 (4:3 on mobile), untouched: no overlay, no gradient, no radius.

### Hero (home)
- A normal, scrollable hero. Never pinned, never scroll-driven. **The Lit Window** (2026-09-30; replaced "The Nameplate at the Base" and a short-lived "Floor by Floor" photo plinth, both rejected by the user as template-looking): the finished building as an architect's **presentation model at night**, rendered live in three.js (`src/components/home/hero/`), on a full Deep Cypress hero (`lg`: one viewport under the header, 40–60rem). The words sit on the solid night beside the building, never on top of it: from `lg` the text column (max 40rem) is bottom-left and the camera frame is shifted right (`setViewOffset`, 23% of the width). Mobile: the model first (56svh, max 32rem), its ground fading into Deep Cypress over the bottom quarter, then the text.
- Content: H1 in Display XL (On Cypress, static; it is the LCP text), subtitle in On Cypress Muted (44ch), the Lamp call plus the On Cypress secondary (hover fills Cypress, since Deep Cypress is the ground). No caption, no phone line (the header always shows the number and the Lamp button dials it).
- **Luxury through craft, not gloss** (The No-Gold Rule holds): a museum maquette, not a photoreal render or black-and-gold. White card and basswood; projecting floor bands on every level; windows recessed behind real piers, sills and lintels with a single slender mullion; two bays (cumba) on the front; basswood balconies with laser-thin rails; parapet, plant room, and a basswood roof pergola; an entrance canopy with the cypress nameplate; a warm, glazed lobby. Context: plain massing blocks and white-card trees, as on a site model, dissolving into fog. Two small street lamps along the side street.
- **Light and lens:** night is Deep Cypress (`0x102914`), used for the fog and a fogged sky dome so the canvas meets the page with no edge. Cool sky fill and a cool moon casting soft shadows keep the card white (never sand); the warmth comes from the lit windows (tungsten `0xffc98a` at 1.35×, the only surfaces above the bloom threshold). The lobby and the two street-lamp bulbs stay under the bloom threshold, and no lamp stands in front of the entrance: the centre of the frame never glares. A baked soft contact shadow sits under the model. Post: a screen-space tilt-shift (sharp horizontal band, 5-tap separable blur above and below), bloom (strength 0.25, radius 0.3, threshold 0.75; windows at 1.35× the interior colour, dimmed on 2026-09-30 at the user's request), 2× MSAA. No tone mapping: every tone mapper shifts Deep Cypress off the page background.
- **Performance budget** (measured 2026-09-30, headless Chrome on the GPU, 1440×900): ~30 draw calls per frame (all static geometry merged into one mesh per material, windows as two instanced meshes), 60fps while animating, zero frames when idle. The shadow map is drawn once. Frames are drawn only during the intro, while the pointer moves, and when a window switches. Pixel ratio ≤1.25 and 2× MSAA; if most animated frames are slow on a device, the render resolution steps down (floor 0.7). The model loads when the page goes idle (`requestIdleCallback`, 1.5s timeout) and compiles its shaders (`compileAsync`) before the first frame; the intro clock starts on that first visible frame. The pointer parallax settles in about 0.7s so moving the mouse costs only a short burst of frames. Never add a pass that re-renders the scene (GTAO, Bokeh, SSR): those took the first build to ~2,260 draw calls and 30fps.
- Fallback: if WebGL fails, `heroImage` (a building at dusk with lamp-lit windows) fills the model's slot. The canvas is labelled with the Construction Story project's title.
- **Intro ("the lights come on"), about 5.5s, time-based:** the canvas fades in over 1s; the camera opens slightly closer and higher and pulls back (5.5s, ease-out-quart) while ~78% of the windows light one by one in a fixed pseudo-random order (0.9s → 4.5s). The Lamp button flickers on like a tungsten bulb at about 2.8s (CSS, `hero-lamp`). After that the building lives: every 2.4s one window switches on or off (70–85% stay lit), and the camera follows the pointer a little (desktop, `pointer: fine`). There is no idle camera drift (it kept the GPU busy for a barely visible effect). Mobile draws the intro at 30fps. Returning in the same session (`data-intro="seen"`) opens on the lit building; `prefers-reduced-motion` renders one lit still. The project nameplate keeps its photo dusk intro (`hero-settle`).

### Lightbox
- A full-screen Deep Cypress dialog: counter in Label (On Cypress Muted) and a close button at the top, the image in the middle, the caption below. Previous/next are 48px squares with an On Cypress 40% border, desktop only; keyboard arrows and Escape work everywhere.
- **Plan variant:** floor plans sit on a white sheet so line drawings stay legible.
- **Gallery grid:** 2 columns (3 from `md`), 12–16px gaps, 4:3 tiles on Surface, the first tile spanning 2 × 2; hover scales 1.02.

### FAQ
- Hairline-ruled rows; question in Title with a Cypress plus/minus icon on the right; the answer animates height and stays in the DOM when closed (indexable). The first item starts open.

### Construction Story (signature component, home mid-page)
- **Art direction:** An architect's working model on a table: white card walls, raw-timber floor slabs, a small crane, a warm tungsten spot light, soft real shadows. Not photoreal, not a sketch, not a game.
- **Scale:** A Bakırköy urban-renewal apartment building: 6 storeys on a corner parcel, bay windows (cumba) and timber balconies, a ground-floor entrance with the nameplate, plane trees as simple model pieces on the pavement, survey pegs and strings for the ground stage. Never a tower.
- **Layout:** section heading on white, then a 6/6 split: the model sticky on the left (desktop, one viewport tall minus the header), four stages on the right, each at least half a viewport tall (the last three quarters, so the model stays pinned until every window is lit). Each stage: counter "1 / 4" in Label, title in Display, text (46ch), a Spec List with the stage's data from the featured project. The last stage ends with an outline link to the project.
- **Dusk:** when the last stage is reached, the section's background, text, muted, and hairline colors transition together over 900ms from white/Ink to Cypress/On Cypress (registered `@property` colors on `.story-surface`), and the model's windows light one by one in Lamp (~80% lit at the end).
- **Tech:** three.js, imported only when the section is within one viewport. Device pixel ratio capped (1.5 mobile, 2 desktop). Renders only while easing and in view; never a constant loop. Native scroll only (no wheel/touch hijacking).
- **Below 1024px:** the layout stacks and nothing is pinned. The model sits sticky under the header at 42% of the viewport height while the stages scroll beneath it. It eases to each stage's end state as that stage's text enters view, so a fast flick never skips content. Desktop (≥1024px) scrubs continuously: each stage owns an equal quarter of progress, measured from its top to the next stage's top crossing the reading line (55% of the viewport), so the model and the dusk surface change together. The handover completes within 30% of a viewport of scroll after its top crosses the line.
- **Reduced motion:** the final lit model as a still; all stage data listed.
- **Fallback:** if WebGL fails, the featured project's photo stays in the slot (a still render of the finished model is the pending replacement). The stage data is plain HTML in every mode.
- **The stages are the one numbered sequence on the site.**

## 6. Do's and Don'ts

### Do:
- **Do** let photography carry warmth. White (oklch(1 0 0)) behind every project image.
- **Do** use the Lamp fill with Deep Cypress text for the single primary CTA; brighten to Lamp Bright on hover.
- **Do** keep corners near-square: 0 for images and sections, 2px for buttons, inputs, and tags, 4px maximum anywhere.
- **Do** back every trust claim with checkable data in Label + Body spec rows (dates, concrete class, inspection firm, occupancy permit).
- **Do** build lists as hairline-ruled rows with one stretched link per item.
- **Do** keep every button at 48px and every icon-only control at 44px or more; the audience includes older buyers.
- **Do** give every motion a `prefers-reduced-motion` alternative; the Construction Story shows its final lit frame.
- **Do** keep the Construction Story unpinned on mobile: stages flow in normal scroll, the model updates per stage.

### Don't:
- **Don't** build the classic Turkish contractor site: full-screen slider, three icon service cards, "25+ Yıl / 5000+ Konut" counters, orange-and-navy.
- **Don't** drift into luxury real-estate gloss: black and gold, script fonts, "prestij" and "ayrıcalık" copy, drone-video hero.
- **Don't** look like a cold corporate holding: gray-blue palette, stock handshake photos, investor-relations tone.
- **Don't** use SaaS landing tropes: gradients, glassmorphism, rounded cards over 4px, "Get started" energy.
- **Don't** fall into the AI boutique-family reflex: cream or sand background, italic display serif, "est. 19xx" eyebrows, editorial-magazine layout.
- **Don't** pin or scroll-drive the hero. The page scrolls from the first pixel.
- **Don't** put a dark overlay or gradient over a photo to carry text; text sits on white or on cypress.
- **Don't** use Lamp as text or icon color on white, or as a metallic/gradient gold.
- **Don't** use the stock shadcn button sizes (`default`, `sm`, `xs`, 24–32px); they exist only for future clients.
- **Don't** render a missing value as "—", "N/A", or an empty column; drop the row.
- **Don't** pair a 1px border with a soft wide shadow on any element.
- **Don't** use side-stripe borders, gradient text, or numbered "01 / 02 / 03" section markers. The Construction Story's stages are the one real sequence and the only numbered one.
