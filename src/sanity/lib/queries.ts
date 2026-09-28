import { groq } from "next-sanity";

// ─── Shared Fragments ──────────────────────────────────────────────────────────

/**
 * Shared GROQ projection for SanityImage fields.
 * Includes LQIP blur preview, dimensions, alt text, hotspot, and crop.
 */
export const imageFields = /* groq */ `{
  asset->{ _id, url, metadata { lqip, dimensions } },
  alt,
  hotspot,
  crop
}`;

// ─── Layout ────────────────────────────────────────────────────────────────────
// Her sayfada bir kez çekilir — header, footer, global ayarlar
export const layoutQuery = groq`{
  "settings": *[_type == "siteSettings"][0] {
    siteName, siteTagline, copyrightNotice,
    logo ${imageFields},
    logoHeight,
    favicon { asset->{ _id, url } },
    contactInfo { phone, email, address, whatsappNumber, mapIframe },
    salesOffice {
      contactName, contactRole,
      photo ${imageFields},
      phone, whatsappNumber, workingHours, headline, ctaLabel, whatsappLabel, priceNote,
      bandImage ${imageFields}
    },
    socialLinks[] { platform, url },
    gaId, gtmId, googleSearchConsoleId,
    defaultSeo { metaTitle, metaDescription },
    defaultOgImage ${imageFields}
  },
  "navigation": *[_type == "navigation"][0] {
    headerLinks[] { label, href, openInNewTab, subLinks[] { label, href, openInNewTab } },
    footerLinks[] { label, href, openInNewTab, subLinks[] { label, href, openInNewTab } }
  }
}`;

// ─── Sayfalar ──────────────────────────────────────────────────────────────────

export const homePageQuery = groq`*[_type == "homePage"][0] {
  heroTitle, heroSubtitle, heroCtaLabel,
  heroCtaLink {
    linkType,
    manual,
    internal->{ _type, "slug": slug.current }
  },
  heroImage ${imageFields},
  "heroCaption": heroImage.caption,
  aboutTitle, aboutSubtitle, aboutText,
  aboutImage ${imageFields},
  aboutCtaLabel, aboutCtaLink,
  projectsTitle, projectsSubtitle, projectsCtaLabel,
  featuredProjects[]-> {
    title, slug, status, location, summary, plannedDelivery, floorCount, unitCount,
    "unitTypeNames": unitTypes[].name,
    mainImage ${imageFields}
  },
  storyTitle, storySubtitle, storyCtaLabel,
  featuredStoryProject-> {
    title, slug, location,
    mainImage ${imageFields},
    groundClass, landArea,
    foundationType, concreteClass,
    floorCount, inspectionFirm, architect,
    plannedDelivery, actualDelivery, occupancyPermitDate, unitCount
  },
  stageGround { title, text },
  stageFoundation { title, text },
  stageFrame { title, text },
  stageHandover { title, text },
  recordTitle, recordSubtitle,
  "deliveredProjects": *[_type == "project" && status == "tamamlandi"] | order(coalesce(actualDelivery, plannedDelivery) desc) {
    title, slug, location, unitCount, plannedDelivery, actualDelivery, occupancyPermitDate
  },
  seo
}`;

export const aboutPageQuery = groq`*[_type == "aboutPage"][0] {
  heroTitle, heroSubtitle,
  heroImage ${imageFields},
  pageTitle, pageSubtitle, body,
  mainImage ${imageFields},
  seo
}`;

export const contactPageQuery = groq`*[_type == "contactPage"][0] {
  heroTitle, heroSubtitle,
  heroImage ${imageFields},
  pageTitle, pageSubtitle, showForm, formTitle, successMessage,
  "contactInfo": *[_type == "siteSettings"][0].contactInfo,
  seo
}`;

export const projectsPageQuery = groq`*[_type == "projectsPage"][0] {
  heroTitle, heroSubtitle,
  heroImage ${imageFields},
  pageTitle, pageSubtitle,
  specsTitle, unitsTitle, amenitiesTitle, galleryTitle, documentsTitle,
  seo
}`;

// ─── Projeler ──────────────────────────────────────────────────────────────────

// Active projects first (on sale → under construction → coming soon → completed), newest delivery first within each.
const projectOrder = /* groq */ `order(select(status == "satista" => 0, status == "insaatta" => 1, status == "yakinda" => 2, 3) asc, plannedDelivery desc)`;

// Lists stay light: never fetch unitTypes, gallery, or documents here.
export const projectListQuery = groq`*[_type == "project"] | ${projectOrder} {
  title, slug, status, location, summary, plannedDelivery,
  mainImage ${imageFields}
}`;

// Home fallback when no projects are hand-picked: completed ones live in the delivery record instead.
export const projectFallbackQuery = groq`*[_type == "project" && status != "tamamlandi"] | ${projectOrder}[0...4] {
  title, slug, status, location, summary, plannedDelivery, floorCount, unitCount,
  "unitTypeNames": unitTypes[].name,
  mainImage ${imageFields}
}`;

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  title, slug, status, location, mapUrl, summary,
  mainImage ${imageFields},
  body[] {
    ...,
    _type == "image" => { asset->{ _id, url, metadata { lqip, dimensions } }, alt, alignment, size, hotspot, crop }
  },
  startDate, plannedDelivery, actualDelivery, occupancyPermitDate,
  groundClass, foundationType, concreteClass, inspectionFirm, architect,
  landArea, floorCount, unitCount,
  extraSpecs[] { _key, label, value },
  documents[] { _key, title, "url": file.asset->url },
  unitTypes[] {
    _key, name, grossArea, netArea, totalCount, availableCount,
    floorPlan ${imageFields}
  },
  amenities,
  gallery[] { _key, caption, ...@${imageFields} },
  seo
}`;

// ─── Sitemap ───────────────────────────────────────────────────────────────────

export const allSlugsForSitemapQuery = groq`{
  "pages": {
    "home": *[_type == "homePage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "about": *[_type == "aboutPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "contact": *[_type == "contactPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "projects": *[_type == "projectsPage"][0] { _updatedAt, "noIndex": seo.noIndex }
  },
  "projects": *[_type == "project" && defined(slug.current) && !(seo.noIndex == true)] { "slug": slug.current, _updatedAt }
}`;

// ─── Varsayılan SEO ────────────────────────────────────────────────────────────

export const defaultSeoQuery = groq`*[_type == "siteSettings"][0] {
  "title": defaultSeo.metaTitle,
  "description": defaultSeo.metaDescription,
  "ogImage": defaultOgImage,
  siteName,
  siteTagline,
  favicon { asset->{ _id, url } },
  googleSearchConsoleId
}`;

export const projectSlugsQuery = groq`*[_type == "project" && defined(slug.current)] { "slug": slug.current }`;
