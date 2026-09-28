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
    siteName, siteTagline,
    logo ${imageFields},
    logoHeight,
    favicon { asset->{ _id, url } },
    contactInfo { phone, email, address, whatsappNumber, mapIframe },
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
  aboutTitle, aboutSubtitle, aboutText,
  aboutImage ${imageFields},
  aboutCtaLabel, aboutCtaLink,
  projectsTitle, projectsSubtitle,
  featuredProjects[]-> {
    title, slug,
    mainImage ${imageFields}
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
  pageTitle, pageSubtitle, ctaLabel, ctaLink, seo
}`;

// ─── Projeler ──────────────────────────────────────────────────────────────────

export const projectListQuery = groq`*[_type == "project"] | order(_createdAt asc) {
  title, slug,
  mainImage ${imageFields}
}`;

export const projectFallbackQuery = groq`*[_type == "project"] | order(_createdAt asc)[0...3] {
  title, slug,
  mainImage ${imageFields}
}`;

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  title, slug,
  mainImage ${imageFields},
  body[] {
    ...,
    _type == "image" => { asset->{ _id, url, metadata { lqip, dimensions } }, alt, alignment, size, hotspot, crop }
  },
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
