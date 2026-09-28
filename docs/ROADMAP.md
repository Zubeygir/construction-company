# Roadmap

Where the project stands, what was decided, what is still open, and what to do next. Read after `docs/PRODUCT.md` and `docs/DESIGN.md`.

## Status (2026-09-28)

- Discovery and direction done. `PRODUCT.md`, `DESIGN.md` (seed; tokens decided and contrast-verified), and `CONTENT-MODEL.md` written.
- **Cleanup done** (build passes, `tsc` clean):
  - Repo hygiene: `docs/` no longer git-ignored; `origin` remote removed (it pointed at the boilerplate repo); `.env.local` untracked, `.env.example` (empty placeholders) tracked instead; package renamed `tinaz-yapi`.
  - Removed: blog and services end to end (routes, schemas, singletons, queries, types, Studio structure, revalidate mapping, sitemap, JSON-LD helpers, home sections), `ColorInput`, unused `ui/` stock (`Spinner`, `skeleton`, `navigation-menu`), Next.js default SVGs in `public/`, the client-onboarding workflow.
  - Design layer neutralized: DESIGN.md tokens in `src/styles/theme.css` (shadcn role names kept, radius capped at 4px), Archivo with `wdth` axis replaces Inter, body 18px / 1.6, balanced headings. The uniform `FadeIn` / `AnimateGroup` reveal was removed everywhere (it also hid content at `opacity: 0` until JS ran).
  - README rewritten for this project (webhook filter/projection updated); CLAUDE.md and `.agents/rules/boilerplate-rules.md` synced.
- **Content model done** (`tsc` clean, build passes): `project` fields and Studio groups, `siteSettings.salesOffice`, identity initialValues, queries (status-priority order, light lists, full detail), types. Home construction story fields (`CONTENT-MODEL.md` §3) intentionally deferred to the home shape brief.
- **Home crafted** (2026-09-28; `tsc` + `eslint` clean, build passes): Header, Footer, hero, active projects, Construction Story (HTML stages, no 3D yet), delivery record, about teaser, `SalesOfficeBand`. Shared pieces: `SectionHeading` (left by default, `tone`), `SpecList`, `StatusTag`, `Wordmark`, button variants `lamp` / `outline` / `onCypress`, type-role utilities (`type-display` … `type-label`, `page-shell`) in `src/styles/utilities.css`. The Header lint error is fixed (menu closes in the link click handler). Visual check pending: needs the new Sanity dataset with sample content.
- **Every surface rebuilt** (2026-09-28, second pass after the user flagged boilerplate remnants; `tsc` + `eslint` clean, build passes):
  - `PageHero` deleted → `PageIntro` (white, nameplate H1, photo below with no overlay).
  - `/projeler`: grouped by status (Satışta → İnşaat Halinde → Yakında → Tamamlandı) with the shared `ProjectRow`; the old "Bir Projeniz mi Var?" CTA box and `projectsPage.ctaLabel/ctaLink` removed.
  - `/projeler/[slug]`: intro with price note + sales CTA in place of a price, main image, body, Künye (building + timeline spec lists, PDF documents) on surface, unit types (floor plans in a white-sheet Lightbox), amenities, gallery, sales band. Section headings come from `projectsPage` (`specsTitle` … `documentsTitle`).
  - `/hakkimizda`, `/iletisim` (named sales contact first, contact rows as spec lines, form on surface, flat map), `error.tsx`, `not-found.tsx`.
  - Shared: `SalesContact` (used by the band and the contact page), inputs/textarea/label, `ContactForm` (icon + words errors, `aria-describedby`), `RichText` (brand prose colors, no shadows), `Breadcrumbs`, `FAQ`, `Lightbox` (react-icons, accessible dialog, `variant="plan"`).
  - Hardcoded page fallbacks (`|| "Projelerimiz"` etc.) removed; defaults now live in schema `initialValue`s.
- **Not rendered anywhere, kept:** `ui/sheet` (stock). `WhatsAppButton` deleted and `nextjs-toploader` uninstalled (user-approved 2026-09-28).
- **DESIGN.md compliance pass + Construction Story 3D** (2026-09-28; `tsc` + `eslint` clean, build passes):
  - Fixed: `--font-sans` was self-referencing (next/font variable renamed to `--font-archivo`); favicon added (`public/icon.svg`, "T" on Cypress); Studio title "Tınaz Yapı".
  - `three` + `@types/three` installed (user-approved). `src/components/home/story/`: `StoryScroller` (native-scroll progress store, dusk state), `StoryModel` (lazy import when the section is within one viewport, IntersectionObserver pause, ResizeObserver, WebGL failure keeps the project photo), `scene.ts` (the working model: board, street corner, plane trees, survey pegs + strings + boreholes, raft, six framed floors, crane, card facades with cumbas, timber balconies, parapet, nameplate; windows light one by one at dusk).
  - Behaviour: desktop scrubs continuously; mobile eases to each stage's end state under a sticky 42svh model; reduced motion shows the final lit model as a still. Dusk is a registered-`@property` color transition on `.story-surface` (`src/styles/utilities.css`). Renders only while easing and in view; DPR ≤1.5 mobile / 2 desktop. The three.js chunk (~136 KB gzip) is not in the initial HTML.
  - Tuned in the browser (2026-09-28): neutral fill + near-white spot (the first pass read as sand/beige, against DESIGN); roof plate in white card; camera closer (radius 2.5 → 3.65); dusk fill kept at 0.85 so card walls stay card; ~80% of windows light at the end so the building reads lived-in, not a lit grid; shadow `normalBias` removes striping on the board edges; the figure caption is desktop-only (on mobile it sat on the model's base). Page-level visual review was not possible: the app's browser pane stopped drawing while the window was in the background.
  - Still open: the hero's first-visit light-up intro (needs a render with known window positions) and the SVG logo from font outlines (text wordmark renders in the loaded Archivo meanwhile).
- **Repo, Sanity, and demo content live** (verified 2026-09-28): `origin` is `github.com/Zubeygir/construction-company`; `.env.local` points at the new Sanity project; the `production` dataset holds the seed (five projects, Site Settings "Tınaz Yapı").
- **`$impeccable document` (scan) done** (2026-09-28): `docs/DESIGN.md` is no longer a seed. Components section rewritten from the code (buttons, status tag, spec list, rows, ledger, sales contact, inputs, navigation, page intro, hero, lightbox, FAQ, Construction Story); layout and motion rules folded into the Overview; `components` tokens added to the frontmatter. Sidecar `.impeccable/design.json` written (tonal ramps, motion, breakpoints, 8 component snippets, narrative).
- **Scan findings fixed** (2026-09-28; `tsc` + `eslint` clean, build passes):
  1. Construction Story: `StoryModel` now treats everything below 1024px as "stacked" (per-stage easing, DPR ≤1.5, 1024px shadow map), matching the layout's `lg` switch. Tablets used to get the stacked layout with the desktop scrub.
  2. Footer copyright text comes from the new `siteSettings.copyrightNotice` ("Telif Metni", initialValue "Tüm hakları saklıdır."); seed regenerated. **The live dataset predates the field**: until it is filled in Studio (or the seed is re-imported), the footer shows only "© year Tınaz Yapı."
  3. Global default focus ring is full Cypress (`outline-ring`); the 50% version was 2.81:1 on white, below the 3:1 non-text minimum.
- **Construction Story pacing fix** (2026-09-28, from the user's visual review: on desktop every window lit only after scrolling far past the handover text, with the model already sliding out). Progress was one span from the first stage's top to the last stage's bottom, split into equal quarters regardless of block heights. Now `StoryScroller` measures progress per stage (stage top → next stage top at the reading line); the handover completes within `HANDOVER_SCROLL` (0.3 viewport); the last stage is `lg:min-h-[75svh]` so the sticky model stays pinned while it lights. Dusk surface and model dusk now switch together.

- **Bolder pass, "wow" brief** (2026-09-28; user gave full design authority for this pass and allowed browser checks; `tsc` + `eslint` clean). Verified with headless-Chrome screenshots at 1440px and 360/390px:
  - New photography (verified Unsplash, visually reviewed): hero and Cevizlik = apartment block at blue hour with lamp-lit windows; Kartaltepe = golden-hour balconies (the old pink tower broke "no towers" and appeared three times); sales band = two lit windows on a dark green facade.
  - Hero rebuilt as "The Nameplate at the Base" with the time-based intro (see DESIGN.md → Hero). The long-pending first-visit intro is done without needing a render.
  - Lead project shows its Spec List (floors, homes, unit types, delivery). The delivery record leads each row with the year in Display; four completed buildings were added to the seed (1981 Tınaz Apartmanı, 1990 Şenlikköy, 2004 Ilgın, 2015 Çınar) so the years run back to the founding.
  - Sales band takes `siteSettings.salesOffice.bandImage` (new field). The home about teaser mirrors it (photo bleeds right). Project detail opens with the same nameplate composition; completed projects no longer show the price note or the lamp call.
  - Bug fixed: GROQ returns null for missing numbers and the formatters only skipped undefined, so an empty land area rendered "0 m²". `formatArea` / `formatCount` / `UnitTypes` now treat null as empty.
  - Seed re-imported into `production` with `seed/import.mjs` (`sanity exec --with-user-token`, no token needed). The pre-change export was saved to the session scratchpad only.
  - Not done (stopped by the user): About page (planned: the 1981 building as the intro photo, the delivery ledger under the story), `/projeler` list and `/iletisim` still on the earlier design.

## Home brief (confirmed 2026-09-28)

- **Order:** Hero → active projects → Construction Story → delivery record → Hasan-to-Elif teaser → cypress sales office band → Cypress Deep footer.
- **Header:** sticky white, 1px hairline, wordmark, Sanity nav, sales phone as a text link (mobile: always-visible phone icon + menu). The floating WhatsApp bubble is removed from the layout (component file kept); the header does its job.
- **Hero:** asymmetric split (H1 on white left, photo bleeding to the right edge; mobile: text, buttons, photo). Lamp CTA calls the sales office; secondary outline button from `heroCtaLabel/Link`. The first-visit light-up intro is deferred until a render or the 3D model exists (a stock photo has no windows to light).
- **Active projects:** lead project large (7-col photo), the rest as quiet rows; no identical card grid.
- **Construction Story (HTML first):** desktop sticky left column holds the story project's photo (the future 3D canvas slot); stages 1–3 on white with spec rows; stage 4 (Teslim) on a full-width cypress band (dusk) with a link to the project. three.js arrives in its own shape/craft.
- **Delivery record:** a ledger of completed projects, not a table, so a missing actual-delivery date never shows as an empty column.
- **Motion:** feedback only (button brighten, underline, 1.02 image scale at 500ms ease-out-quart), all `motion-safe`.

## User actions required

1. ~~**New GitHub repository.**~~ Done (`Zubeygir/construction-company`). Never re-add the boilerplate repo.
2. ~~**New Sanity project or dataset.**~~ Done; seed imported. Delete the import token in sanity.io/manage if it still exists.
3. **Visual review with real content** (the user does all visual checks): `/`, `/projeler`, `/projeler/kartaltepe-evleri` (unit types), `/projeler/sakizagaci-apartmani` (half-empty spec sheet), `/hakkimizda`, `/iletisim`, a 404, at 360px, 768px, and desktop. Findings feed `critique`.

## Decision log

| Decision | Choice | Why |
|---|---|---|
| Firm type | Boutique, upper-segment residential developer (3–8 projects, one city, family-run) | Largest Turkish market; strongest demo to resell |
| Sales strategy | One strong demo identity, re-skinned per client via tokens + Sanity content | A site made to fit every firm fits none |
| Primary action | Contact the sales office; trust (proof) is the supporting layer | Buyers must trust the developer before calling |
| Personality | Rooted local family firm; proof over claims | See PRODUCT.md |
| Register / platform | brand / web | Marketing site |
| Construction animation | **Not in the hero.** Mid-page "Construction Story" section, scroll-driven on desktop, unpinned on mobile | Pinned scroll-scrub in the hero fails on mobile (flick scrolling skips it, iOS viewport jumps, delays the info buyers came for, taxes repeat visitors) |
| Animation art direction | Architectural working model (white card, timber, tungsten spot light) | Fits "boutique family firm"; avoids the literal contractor crane cliché; credible in real-time 3D |
| Animation tech | three.js | User choice; dependency still needs explicit install approval |
| Hero | Normal scrollable hero; optional 2–3s first-visit light-up intro, time-based | Keeps the "wow" without blocking content |
| Site-wide motion | Responsive (feedback + transitions only) | The Construction Story stays the one show |
| Color | Committed: Cypress green + tungsten Lamp accent on pure white | See DESIGN.md; lamp moved off metallic gold to avoid green+gold "private bank" read |
| Type | Archivo only, width axis as the second voice ("apartment nameplate") | Avoids the saturated serif-editorial lane |
| Prices | Never shown | See PRODUCT.md content policy |
| Sales contact | One sales office in Site Settings, presented as a named person | Simpler than per-project reps; keeps the "named person" principle |
| Spec sheet | Hybrid: fixed fields the design depends on + free label/value rows | Consistency for the design, flexibility per client |
| Site diary (şantiye günlüğü) | Not now | Scope; stale diaries hurt trust |
| Demo firm identity | Tınaz Yapı, Bakırköy (İstanbul; changed from Urla 2026-09-28); founded 1981 by kalfa Hasan Tınaz, run by his daughter Elif Tınaz (civil engineer); tagline "Adımızı kapıya yazıyoruz."; sales contact Deniz Aksoy | Surname fits "puts its name on the door"; short; Turkish ı; no known firm with this exact name. Full sheet in PRODUCT.md |
| Logo | Archivo wordmark "TINAZ" / "YAPI", favicon "T" on Cypress; no founding-year line | See DESIGN.md → Components → Logo |
| Building scale | Urban-renewal apartments (4–8 storeys, 8–30 homes); no towers | Bakırköy parcels; the 3D model is a 6-storey corner apartment with cumba |
| City | Bakırköy, İstanbul (not Urla) | User decision 2026-09-28; urban renewal + soft coastal ground make the proof layer (ground class, foundation, inspection) the strongest selling point |
| Green narrative | Token stays `cypress` in code; the tree is never named in copy | In İstanbul cypress reads as a cemetery; the green is Bakırköy's plane trees and Yeşilköy's gardens |
| Services (`/hizmetler`) | Removed entirely | A developer selling its own buildings has no "services"; that is contractor thinking |
| Blog | Removed entirely | Boutique firms rarely publish; a stale blog erodes trust. Restore from the boilerplate if a client wants it |
| Existing design layer | Neutralized now, each component rebuilt in its own `craft` | Bulk deletion would break the site and throw away data wiring; the old look is gone via tokens/font/motion |
| `.env.local` | Untracked; `.env.example` tracked | Real SMTP credentials must never be committed |

## Pending approvals (ask the user before doing)

1. ~~**Dependencies for the Construction Story.**~~ Approved and installed 2026-09-28: `three` + `@types/three`, plain three.js (no react-three-fiber).
2. ~~Delete `WhatsAppButton.tsx`; uninstall `nextjs-toploader`.~~ Done 2026-09-28.

## Open questions

1. ~~**Imagery source.**~~ Decided 2026-09-28: verified Unsplash photos for the demo, swapped for renders in Sanity later (no code change). Still needed: a still render of the finished model for the Construction Story's WebGL/reduced-motion fallback.
2. ~~**Home construction story fields.**~~ Confirmed and implemented (`CONTENT-MODEL.md` §3).

## Next steps (in order)

1. ~~**Content model.**~~ Done (§1, §2, §4, §5). §3 lands with the home shape.
2. ~~**Foundation tokens.**~~ Done in the cleanup (tokens, Archivo, `lang="tr"`, 18px body).
3. ~~**Shape, then craft, page by page.**~~ Home shaped and crafted; project detail, projects list, about, contact, error, and 404 rebuilt in the "Every surface rebuilt" pass (no separate shape briefs; `critique` is where they get challenged).
4. ~~**Construction Story.**~~ Built (see Status). Open: still-render fallback.
5. ~~`$impeccable document` (scan mode).~~ Done 2026-09-28. Next: `$impeccable critique` (after the user's visual review), then `audit`, then `polish`.
6. **Sample content.** Seed file built (2026-09-28): `seed/build-seed.mjs` → `seed/tinaz-demo.ndjson`, import command in README. Images chosen from Unsplash by description (URLs verified to resolve, not visually reviewed); the sales contact has no photo on purpose (no stock face presented as a named person); no floor plans or PDFs (no credible stock source). Original brief: seed 4–5 fictional projects across all four statuses so every state (including half-empty "Yakında" spec sheets) is exercised. Decided set, all in Bakırköy (urban-renewal parcels):

   | Project | Status | Scale | Purpose |
   |---|---|---|---|
   | Yeşilköy Bahçe Evleri | Tamamlandı | 4 storeys, 8 homes | full spec sheet incl. actual delivery + occupancy permit |
   | Cevizlik Apartmanı | Tamamlandı | 6 storeys, 18 homes, corner parcel | candidate `featuredStoryProject` for the Construction Story (matches the 3D model) |
   | Zeytinlik 22 | İnşaat Halinde | 7 storeys, 24 homes | planned delivery only |
   | Kartaltepe Evleri | Satışta | 5 storeys, 12 homes | unit types with availability |
   | Sakızağacı Apartmanı | Yakında | not fixed | half-empty spec sheet; tests the "empty fields are invisible" rule |

   Ground classes stay honest to the district: ZC/ZD near the coast, ZB inland.

   All copy in Turkish, in the firm's voice (PRODUCT.md). Dates realistic and internally consistent (start < planned delivery ≤ actual delivery < occupancy permit).
