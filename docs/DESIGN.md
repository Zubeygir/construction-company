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
  section: "clamp(4rem, 3rem + 5vw, 8rem)"
---

<!-- SEED: re-run $impeccable document once there's code to capture the actual components and generate the .impeccable/design.json sidecar. Colors and typography below are decided and contrast-verified; components are not yet built. -->

# Design System: Tınaz Yapı

## 1. Overview

**Creative North Star: "The Lit Window"**

The whole system is built around one moment: a finished building at dusk, its windows lighting up one by one. That is what this firm sells, and what the buyer is imagining on the sofa at night: not a construction site, but a home with someone in it. Deep cypress green is the rooted, local ground (the tree that stands in every Aegean and Mediterranean town); tungsten lamp amber is the single sign of life. Everything else is white space and real photography.

The voice is a mid-century Turkish apartment nameplate: wide, sturdy, proud letters cast in brass above a terrazzo entrance ("Yıldız Apartmanı, 1968"). A family that builds here puts its name on the door. The type carries that pride; the color carries warmth; neither shouts.

The site's single choreographed moment is the **construction story** section mid-page: a three.js architectural model (white card, raw timber, warm spot light) that assembles as the visitor scrolls: ground survey, foundation, frame, handover. Each stage surfaces real, checkable data. The section ends in dusk: the surface turns cypress, the windows light up in lamp amber. The rest of the site is calm (Responsive motion: feedback and transitions only), so this moment reads as the one show. The hero is never pinned or scroll-driven.

This system explicitly rejects: the classic Turkish contractor site (slider, icon cards, counters, orange-and-navy); luxury real-estate gloss (black and gold, script fonts, drone hero); the cold corporate holding (gray-blue, handshake stock); SaaS landing pages (gradients, glass, rounded cards); and the AI "boutique family firm" reflex (cream background, italic serif, "est. 19xx" eyebrows).

**Key Characteristics:**
- Pure white reading surface; photography and renders are the content.
- One committed brand color (cypress) on large, deliberate surfaces; one rare accent (lamp).
- A single variable family (Archivo) whose width axis does the work a second typeface would.
- Near-square corners, architectural precision, flat surfaces.
- One choreographed section; everywhere else, quiet.

## 2. Colors

A cool, rooted green and a warm lamp amber on pure white: the cypress is the firm, the lamp is the home.

Theme scene: a couple in their forties on the living-room sofa after dinner, lamp on, looking at the same project on a phone for the third time and deciding whether to call the sales office tomorrow. Light theme for reading; the construction story section transitions to dusk.

### Primary
- **Cypress** (oklch(0.33 0.065 148)): The firm's color. Large committed surfaces: the construction story at dusk, the contact band, the footer, the primary text-link color on white (11.9:1). Never a thin decorative accent.
- **Deep Cypress** (oklch(0.255 0.05 148)): Hover/pressed state for cypress surfaces and the text color on lamp fills (8.07:1).

### Secondary
- **Lamp** (oklch(0.8 0.14 64)): 2700K tungsten, not metallic gold. The primary CTA fill ("Satış ofisini ara"), "Satışta" status, and the lit windows in the construction model. Dark text only (Deep Cypress or Ink). Used on ≤10% of any screen.
- **Lamp Bright** (oklch(0.87 0.09 70)): Hover state of lamp fills. The light brightens on hover; it never darkens.

### Neutral
- **White** (oklch(1 0 0)): Body background. Pure, untinted.
- **Surface** (oklch(0.967 0.006 150)): Alternate sections and data panels (project spec sheets). Tinted toward the cypress hue, never toward warm.
- **Ink** (oklch(0.225 0.018 150)): Body and heading text (17:1 on white).
- **Muted** (oklch(0.47 0.02 150)): Secondary text, captions, metadata (6.76:1 on white, 6.15:1 on surface).
- **Border** (oklch(0.905 0.01 150)): Decorative hairlines and dividers only.
- **Control Border** (oklch(0.62 0.02 150)): Input and control outlines (3.61:1 on white, WCAG 1.4.11).
- **On Cypress** (oklch(0.975 0.008 148)) / **On Cypress Muted** (oklch(0.8 0.03 148)): Primary and secondary text on cypress surfaces (11.1:1 / 6.44:1).
- **Danger** (oklch(0.54 0.19 28)): Form errors only (5.57:1 on white).

### Named Rules
**The One Lamp Rule.** Lamp is light, not decoration. It appears only where something is alive or actionable: the primary CTA, an available unit, a lit window. If two lamp elements compete on one screen, remove one.

**The No-Gold Rule.** Lamp is never rendered metallic: no gradients, no sheen, no pairing with serif or script type, no black backgrounds. Cypress plus metallic gold is a private bank; cypress plus lamp light is a home.

**The Lamp-Is-Never-Text Rule.** Lamp on white is 1.92:1. It is a fill or a light source, never a text or icon color on light surfaces. On cypress it may be text (6.18:1).

## 3. Typography

**Display Font:** Archivo (variable, wdth 62–125, wght 100–900; with system-ui fallback)
**Body Font:** Archivo (same family)

**Character:** One family, two voices. Expanded and heavy, it is the brass nameplate over the entrance; at normal width, it is a plain, honest spec sheet. The width axis replaces a second typeface.

### Hierarchy
- **Display** (700, wdth 125, clamp(2.25rem → 4.5rem), line-height 1.02, -0.02em): Page H1 and the construction story's stage titles only.
- **Headline** (650, wdth 115, clamp(1.75rem → 2.75rem), line-height 1.1): Section H2 via `SectionHeading`.
- **Title** (600, wdth 100, 1.375rem, line-height 1.25): Project names in lists, card and panel titles.
- **Body** (400, wdth 100, 1.125rem, line-height 1.6): All prose. 18px base for an older audience. Max 68ch.
- **Label** (600, wdth 112, 0.875rem, 0.04em tracking): Spec-sheet keys (Teslim, Beton sınıfı, Yapı denetim), status tags, form labels. Uppercase allowed here only.

### Named Rules
**The Nameplate Rule.** Width 125 is reserved for display. If body copy or buttons start going wide, the nameplate stops meaning anything.

**The Turkish Overflow Rule.** Expanded type plus long Turkish words ("Projelerimiz", "Sürdürülebilirlik") overflows narrow screens. Every display heading is tested at 360px; below 480px, display steps down to wdth 112. Pages set `lang="tr"` so `text-transform: uppercase` produces İ, not I.

**The No Eyebrow Rule.** No small uppercase kicker above section headings. Labels label data, not sections.

## 4. Elevation

Flat by default. Depth comes from tonal layering (white → surface → cypress) and from photography, never from drop shadows on cards or buttons. The sticky header separates with a 1px Border hairline, not a shadow. The only real shadows in the system live inside the three.js model, where they are physical light, not UI chrome.

**The Flat Paper Rule.** If a card needs a shadow to be seen, the layout is wrong. Fix the spacing or the surface tone instead.

## 5. Components

Planned, not yet built. Decisions below are fixed; exact values get captured by a scan-mode `$impeccable document` run once code exists.

### Logo
- **Wordmark only:** "TINAZ" in Archivo 700 at wdth 125, with "YAPI" set smaller beneath it (Label weight, wdth 112, tracked +0.04em), left-aligned to the same edge. Ink on light surfaces, On Cypress on cypress surfaces. Never Lamp.
- **Favicon / small mark:** "T" alone in the same cut, on a Cypress square (0 radius).
- **Production:** SVG converted from the font's outlines (no live text), so it renders identically everywhere and uploads to Sanity's `siteSettings.logo`.
- **Never:** a founding-year line ("1981 · Urla"), a crane/roof/house pictogram, hand-drawn or sketchy marks, gradients, or a framed "plaque" border that turns the nameplate idea into a costume.

### Buttons
- **Shape:** Near-square (2px).
- **Primary:** Lamp fill, Deep Cypress text, Label typography. One per screen (The One Lamp Rule). Default label comes from Sanity (sales office CTA).
- **Hover / Focus:** Fill brightens to Lamp Bright; never darkens. Focus ring 2px Cypress with 2px offset (on cypress surfaces: 2px On Cypress).
- **Secondary:** Transparent with 1px Cypress border and Cypress text on white; inverted (On Cypress border and text) on cypress surfaces.

### Inputs / Fields
- **Style:** White fill, 1px Control Border, 2px radius, Body typography at 1.125rem (no iOS zoom).
- **Focus:** Border becomes Cypress plus a 2px Cypress outline.
- **Error:** Danger border and message below the field, text not color-only (icon + words).

### Hero (home)
- A normal, scrollable hero. Never pinned, never scroll-driven. Real project photography or render, H1 in Display, sales office phone visible in the first viewport.
- Optional one-time intro: a 2–3s, time-based (not scroll-based) moment where the windows of the finished building light up in Lamp. Plays on first visit only (remembered per browser, wrapped in try/catch), skipped entirely under `prefers-reduced-motion`. Content is visible from the first frame; the intro only enhances it.

### Construction Story (signature component, home mid-page)
- **Art direction:** An architect's working model on a table: white card walls, raw-timber floor slabs, a small crane, a warm tungsten spot light, soft real shadows. Not photoreal, not a sketch, not a game.
- **Scale:** An Urla-scale building: 3–4 storeys, pitched or flat roof, stone-textured ground floor, olive/cypress trees as simple model pieces. Never a tower; a 12-storey block contradicts the firm and the town.
- **Tech:** three.js (dependency pending approval; see `docs/ROADMAP.md`). Loaded only when the section approaches the viewport (dynamic import). Device pixel ratio capped (≤1.5 on mobile). Renders on demand: only when in view and when scroll progress changes, never a constant loop.
- **Desktop:** A sticky section ~1.5–2 viewports tall; scroll progress drives the build. Uses the browser's native scroll only (no wheel/touch hijacking). Stages: ground survey → foundation → frame → handover, each revealing its data from the featured project (see `docs/CONTENT-MODEL.md`). Final stage: the surface transitions from white to Cypress (dusk) and windows light up in Lamp one by one.
- **Mobile (<768px):** Not pinned. Stages flow in normal scroll as text blocks; the model snaps/eases to each stage as its block enters view. A fast flick never skips content.
- **Reduced motion:** Show the final lit model as a still with all stage data listed.
- **Fallback:** If WebGL is unavailable, show a still render of the final state. The stage data is plain HTML in every mode (indexable, readable).
- **The stages are the one numbered sequence on the site.**

## 6. Do's and Don'ts

### Do:
- **Do** let photography carry warmth. White (oklch(1 0 0)) behind every project image.
- **Do** use the Lamp fill with Deep Cypress text for the single primary CTA; brighten to Lamp Bright on hover.
- **Do** keep corners near-square: 0 for images and sections, 2px for buttons and inputs, 4px maximum anywhere.
- **Do** back every trust claim with checkable data in Label + Body spec rows (dates, concrete class, inspection firm, occupancy permit).
- **Do** give every motion a `prefers-reduced-motion` alternative; the construction story shows its final lit frame.
- **Do** keep the construction story unpinned on mobile: stages flow in normal scroll, the model updates per stage.

### Don't:
- **Don't** build the classic Turkish contractor site: full-screen slider, three icon service cards, "25+ Yıl / 5000+ Konut" counters, orange-and-navy.
- **Don't** drift into luxury real-estate gloss: black and gold, script fonts, "prestij" and "ayrıcalık" copy, drone-video hero.
- **Don't** look like a cold corporate holding: gray-blue palette, stock handshake photos, investor-relations tone.
- **Don't** use SaaS landing tropes: gradients, glassmorphism, rounded cards over 4px, "Get started" energy.
- **Don't** fall into the AI boutique-family reflex: cream or sand background, italic display serif, "est. 19xx" eyebrows, editorial-magazine layout.
- **Don't** pin or scroll-drive the hero. The page scrolls from the first pixel.
- **Don't** use Lamp as text or icon color on white, or as a metallic/gradient gold.
- **Don't** pair a 1px border with a soft wide shadow on any element.
- **Don't** use side-stripe borders, gradient text, or numbered "01 / 02 / 03" section markers. The construction story's stages are the one real sequence and the only numbered one.
