# Tınaz Yapı: Residential Developer Demo

Marketing site for a fictional boutique residential developer in Urla, built as a resellable demo on the Next.js + Sanity boilerplate. Re-skin per client through design tokens and Sanity content.

**Start here:** `docs/PRODUCT.md` (strategy), `docs/DESIGN.md` (visual system), `docs/CONTENT-MODEL.md` (schema spec), `docs/ROADMAP.md` (decisions, open questions, next steps). Agent rules live in `CLAUDE.md` (mirrored in `.agents/rules/boilerplate-rules.md`).

## Stack

Next.js 16 (App Router) · React 19 · Sanity v5 (Studio at `/studio`) · Tailwind CSS v4 · shadcn/ui on `@base-ui/react` · framer-motion · nodemailer. Font: Archivo (variable, `wdth` axis) via `next/font`.

Routes: `/` · `/hakkimizda` · `/projeler` · `/projeler/[slug]` · `/iletisim` · `/studio`.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

- Site: `http://localhost:3000`
- Studio: `http://localhost:3000/studio`

`.env.local` is git-ignored; only `.env.example` (empty placeholders) is tracked.

### 1. Sanity project

Create a **separate** Sanity project (or at least a separate dataset) for this demo at [sanity.io/manage](https://sanity.io/manage). Do not reuse the boilerplate's project: demo content would mix with it. Put the ID and dataset in `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`.

### 2. Webhook (on-demand ISR)

Sanity Dashboard → API → Webhooks → Add:

- URL: `https://<domain>/api/revalidate`, method `POST`
- Trigger on: Create, Update, Delete. Drafts and versions: off.
- Secret: the value of `SANITY_WEBHOOK_SECRET` (in the dashboard's Secret field, not as a header).

**Filter** (every document type must be listed here, or its pages never revalidate):

```groq
_type in [
  "siteSettings",
  "navigation",
  "homePage",
  "aboutPage",
  "contactPage",
  "projectsPage",
  "project"
]
```

**Projection** (required payload contract):

```groq
{
  "_id": coalesce(after()._id, before()._id),
  "_type": coalesce(after()._type, before()._type),
  "operation": delta::operation(),
  "slug": after().slug.current,
  "previousSlug": before().slug.current,
  "slugChanged": select(
    delta::operation() == "update" => delta::changedAny(slug.current),
    false
  ),
  "noIndexChanged": select(
    delta::operation() == "update" => delta::changedAny(seo.noIndex),
    false
  ),
  "affectsList": select(
    delta::operation() != "update" => true,
    _type == "project" => delta::changedAny((title, slug.current, mainImage, status, location, summary, plannedDelivery, seo.noIndex)),
    false
  )
}
```

`affectsList` names every field the project list/cards read (see `docs/CONTENT-MODEL.md` §4). Update it when list queries change.

### 3. Contact form (SMTP)

Fill `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_FORM_TO` in `.env.local`. For Gmail, use an app password (Google Account → Security → 2-Step Verification → App passwords).

### 4. Deploy

Add every `.env.local` variable to the hosting provider, set `NEXT_PUBLIC_SITE_URL` to the production domain (used for canonicals, sitemap, and Open Graph URLs), then register the webhook above.

## Structure

```
src/
├── app/
│   ├── (site)/            # Public pages: home, hakkimizda, projeler, iletisim
│   ├── api/revalidate/    # Sanity webhook → cache tag revalidation
│   ├── api/contact/       # Contact form (nodemailer)
│   ├── studio/            # Embedded Sanity Studio
│   ├── sitemap.ts, robots.ts, not-found.tsx, error.tsx
├── components/            # home/, layout/, forms/, seo/, ui/
├── lib/                   # seo.ts (buildMetadata), utils.ts
├── sanity/                # lib/ (client, queries, image, slugify), schemaTypes/, structure.ts
├── styles/                # theme.css (tokens), base.css, utilities.css
└── types/index.ts
```

## SEO

- Metadata through `buildMetadata()` (`src/lib/seo.ts`) with canonical paths.
- JSON-LD: site-wide `Organization` and `WebSite`; `BreadcrumbList` via `<Breadcrumbs>`; `FAQPage` via `<FAQ>` (answers stay in the DOM); `CreativeWork` on project detail pages.
- Dynamic sitemap respects each page's `seo.noIndex`.
