# Roadmap

Where the project stands, what was decided, what is still open, and what to do next. Read after `docs/PRODUCT.md` and `docs/DESIGN.md`.

## Status (2026-09-28)

- Discovery and direction done. `PRODUCT.md`, `DESIGN.md` (seed; tokens decided and contrast-verified), and `CONTENT-MODEL.md` written.
- **Cleanup done** (build passes, `tsc` clean):
  - Repo hygiene: `docs/` no longer git-ignored; `origin` remote removed (it pointed at the boilerplate repo); `.env.local` untracked, `.env.example` (empty placeholders) tracked instead; package renamed `tinaz-yapi`.
  - Removed: blog and services end to end (routes, schemas, singletons, queries, types, Studio structure, revalidate mapping, sitemap, JSON-LD helpers, home sections), `ColorInput`, unused `ui/` stock (`Spinner`, `skeleton`, `navigation-menu`), Next.js default SVGs in `public/`, the client-onboarding workflow.
  - Design layer neutralized: DESIGN.md tokens in `src/styles/theme.css` (shadcn role names kept, radius capped at 4px), Archivo with `wdth` axis replaces Inter, body 18px / 1.6, balanced headings. The uniform `FadeIn` / `AnimateGroup` reveal was removed everywhere (it also hid content at `opacity: 0` until JS ran).
  - README rewritten for this project (webhook filter/projection updated); CLAUDE.md and `.agents/rules/boilerplate-rules.md` synced.
- **Still the old components.** Header, Footer, PageHero, home sections and page layouts keep their boilerplate markup (now in brand tokens) until each is rebuilt in its `craft` step. The `project` schema is still the 5-field version.
- **Known pre-existing lint error:** `src/components/layout/Header.tsx` calls `setMenuOpen(false)` inside a `useEffect` on pathname change (`react-hooks/set-state-in-effect`). Fix when the Header is rebuilt (e.g. close the menu in the link's click handler).

## User actions required

1. **New GitHub repository** for this project, then `git remote add origin <url>`. Until then there is no remote; never re-add the boilerplate repo.
2. **New Sanity project or dataset** for the demo. `.env.local` still holds the boilerplate's project ID; replace it before creating any demo content.

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
| Demo firm identity | Tınaz Yapı, Urla; founded 1981 by stonemason Hasan Tınaz, run by his daughter Elif Tınaz (civil engineer); tagline "Adımızı kapıya yazıyoruz."; sales contact Deniz Aksoy | Surname fits "puts its name on the door"; short; Turkish ı; no known firm with this exact name. Full sheet in PRODUCT.md |
| Logo | Archivo wordmark "TINAZ" / "YAPI", favicon "T" on Cypress; no founding-year line | See DESIGN.md → Components → Logo |
| Building scale | Low-rise (2–4 storeys, 6–24 homes, villa groups) | Urla zoning; the 3D model follows it |
| Services (`/hizmetler`) | Removed entirely | A developer selling its own buildings has no "services"; that is contractor thinking |
| Blog | Removed entirely | Boutique firms rarely publish; a stale blog erodes trust. Restore from the boilerplate if a client wants it |
| Existing design layer | Neutralized now, each component rebuilt in its own `craft` | Bulk deletion would break the site and throw away data wiring; the old look is gone via tokens/font/motion |
| `.env.local` | Untracked; `.env.example` tracked | Real SMTP credentials must never be committed |

## Pending approvals (ask the user before doing)

1. **Dependencies for the Construction Story.** Recommended: `three` only (plus `@types/three` as dev), used directly in one client component loaded via dynamic import. `@react-three/fiber` / `drei` would add two more packages for DX the single scene doesn't need; propose only if the plain approach proves painful.

## Open questions

1. **Imagery source (biggest risk).** A boutique developer site stands on photography and renders. Options: verified Unsplash architecture photos for the demo, or renders the user produces externally. Also needed: a still render of the finished model for the Construction Story's WebGL/reduced-motion fallback. Decide before building the hero and project pages.
2. **Home construction story fields** in `CONTENT-MODEL.md` §3 are a proposal; confirm in the home shape brief.

## Next steps (in order)

1. **Content model.** Implement `docs/CONTENT-MODEL.md` (schema, types, queries). No UI yet; existing pages keep working.
2. ~~**Foundation tokens.**~~ Done in the cleanup (tokens, Archivo, `lang="tr"`, 18px body).
3. **Shape, then craft, page by page** with impeccable. Suggested order, highest value first:
   - `$impeccable shape home` (includes hero + Construction Story placement, site map, open question 2)
   - `$impeccable shape project detail` (spec sheet, unit types, floor plans, gallery, sales contact)
   - `$impeccable shape projects list`
   - `$impeccable shape about` and `$impeccable shape contact`
   - `$impeccable craft …` for each confirmed brief.
4. **Construction Story** as its own `$impeccable shape construction story` → `craft`, after the dependency approval.
5. **After code exists:** `$impeccable document` (scan mode) to fill DESIGN.md Components with real values and write `.impeccable/design.json`; then `$impeccable critique`, `audit`, `polish`.
6. **Sample content.** Seed 4–5 fictional projects across all four statuses so every state (including half-empty "Yakında" spec sheets) is exercised. Decided set, all in Urla:

   | Project | Status | Scale | Purpose |
   |---|---|---|---|
   | Zeytinalanı Taş Evler | Tamamlandı | 8 villas | full spec sheet incl. actual delivery + occupancy permit |
   | İskele Konakları | Tamamlandı | 3 storeys, 12 homes | candidate `featuredStoryProject` for the Construction Story |
   | Kuşçular Bahçe | İnşaat Halinde | 4 storeys, 18 homes | planned delivery only |
   | Balıklıova 7 | Satışta | 7 villas | unit types with availability |
   | Barbaros Yamaç | Yakında | not fixed | half-empty spec sheet; tests the "empty fields are invisible" rule |

   All copy in Turkish, in the firm's voice (PRODUCT.md). Dates realistic and internally consistent (start < planned delivery ≤ actual delivery < occupancy permit).
