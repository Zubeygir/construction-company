import type { PortableTextBlock } from "@portabletext/react";
import type { ProjectStatus } from "@/lib/project";

/**
 * Global TypeScript interfaces for Sanity documents and models.
 * Ensures strict typing, autocomplete, and zero warnings in IDE.
 */

export interface SanityImage {
  asset: {
    _ref?: string;
    _id?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
  alt?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface SanitySlug {
  current: string;
  _type?: "slug";
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  whatsappNumber?: string;
  mapIframe?: string;
}

export interface SalesOffice {
  contactName?: string;
  contactRole?: string;
  photo?: SanityImage;
  phone?: string;
  whatsappNumber?: string;
  workingHours?: string;
  headline?: string;
  ctaLabel?: string;
  whatsappLabel?: string;
  priceNote?: string;
  bandImage?: SanityImage;
}

export interface SiteSettings {
  siteName: string;
  siteTagline?: string;
  copyrightNotice?: string;
  logo?: SanityImage;
  logoHeight?: number;
  favicon?: { asset: { url: string } };
  contactInfo?: ContactInfo;
  salesOffice?: SalesOffice;
  socialLinks?: SocialLink[];
  gaId?: string;
  gtmId?: string;
  googleSearchConsoleId?: string;
  defaultSeo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  defaultOgImage?: SanityImage;
}

export interface NavItem {
  label: string;
  href: string;
  openInNewTab?: boolean;
  subLinks?: NavItem[];
}

export interface Navigation {
  headerLinks?: NavItem[];
  footerLinks?: NavItem[];
}

export type { ProjectStatus };

export interface SpecRow {
  _key: string;
  label: string;
  value: string;
}

export interface ProjectDocument {
  _key: string;
  title: string;
  url?: string;
}

export interface UnitType {
  _key: string;
  name: string;
  grossArea?: number;
  netArea?: number;
  totalCount?: number;
  availableCount?: number;
  floorPlan?: SanityImage;
}

export interface GalleryImage extends SanityImage {
  _key: string;
  caption?: string;
}

export interface Project {
  _id?: string;
  _createdAt?: string;
  _updatedAt?: string;
  title: string;
  slug: SanitySlug;
  status: ProjectStatus;
  location?: string;
  mapUrl?: string;
  summary?: string;
  mainImage?: SanityImage;
  body?: PortableTextBlock[];
  startDate?: string;
  plannedDelivery?: string;
  actualDelivery?: string;
  occupancyPermitDate?: string;
  groundClass?: string;
  foundationType?: string;
  concreteClass?: string;
  inspectionFirm?: string;
  architect?: string;
  landArea?: number;
  floorCount?: number;
  unitCount?: number;
  extraSpecs?: SpecRow[];
  documents?: ProjectDocument[];
  unitTypes?: UnitType[];
  amenities?: string[];
  gallery?: GalleryImage[];
  seo?: SeoSettings;
  // Home list projection only: unit type names without the full objects
  unitTypeNames?: string[];
}

export interface CtaLink {
  linkType: "internal" | "manual";
  manual?: string;
  internal?: {
    _type: string;
    slug?: string;
  };
}

export interface SeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface BasePage {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: SanityImage;
  seo?: SeoSettings;
}

export interface AboutPage extends BasePage {
  pageTitle: string;
  pageSubtitle?: string;
  body?: PortableTextBlock[];
  mainImage?: SanityImage;
}

export interface ContactPage extends BasePage {
  pageTitle: string;
  pageSubtitle?: string;
  showForm?: boolean;
  formTitle?: string;
  successMessage?: string;
  contactInfo?: SiteSettings["contactInfo"];
}

export interface ProjectsPage extends BasePage {
  pageTitle: string;
  pageSubtitle?: string;
  specsTitle?: string;
  unitsTitle?: string;
  amenitiesTitle?: string;
  galleryTitle?: string;
  documentsTitle?: string;
}

export interface StoryStage {
  title?: string;
  text?: string;
}

export type StoryProject = Pick<
  Project,
  | "title"
  | "slug"
  | "location"
  | "mainImage"
  | "groundClass"
  | "landArea"
  | "foundationType"
  | "concreteClass"
  | "floorCount"
  | "inspectionFirm"
  | "architect"
  | "plannedDelivery"
  | "actualDelivery"
  | "occupancyPermitDate"
  | "unitCount"
>;

export type DeliveredProject = Pick<
  Project,
  "title" | "slug" | "location" | "unitCount" | "plannedDelivery" | "actualDelivery" | "occupancyPermitDate"
>;

export interface HomePage {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: SanityImage;
  heroCaption?: string;
  heroCtaLabel?: string;
  heroCtaLink?: CtaLink;
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutText?: PortableTextBlock[];
  aboutImage?: SanityImage;
  aboutCtaLabel?: string;
  aboutCtaLink?: string;
  projectsTitle?: string;
  projectsSubtitle?: string;
  projectsCtaLabel?: string;
  featuredProjects?: Project[];
  storyTitle?: string;
  storySubtitle?: string;
  storyCtaLabel?: string;
  featuredStoryProject?: StoryProject;
  stageGround?: StoryStage;
  stageFoundation?: StoryStage;
  stageFrame?: StoryStage;
  stageHandover?: StoryStage;
  recordTitle?: string;
  recordSubtitle?: string;
  deliveredProjects?: DeliveredProject[];
  seo?: SeoSettings;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}
