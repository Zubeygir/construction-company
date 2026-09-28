import { seoType } from "./objects/seo";
import { socialLinkType } from "./objects/socialLink";
import { customHtmlType } from "./objects/customHtml";
import { siteSettingsType } from "./singletons/siteSettings";
import { navigationType } from "./singletons/navigation";
import { homePageType } from "./singletons/homePage";
import { aboutPageType } from "./singletons/aboutPage";
import { contactPageType } from "./singletons/contactPage";
import { projectsPageType } from "./singletons/projectsPage";
import { projectType } from "./documents/project";

export const schemaTypes = [
  // Objects
  seoType,
  socialLinkType,
  customHtmlType,
  // Singletons
  siteSettingsType,
  navigationType,
  homePageType,
  aboutPageType,
  contactPageType,
  projectsPageType,
  // Collections
  projectType,
];

