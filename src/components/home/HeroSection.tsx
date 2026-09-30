import Link from "next/link";
import { RiPhoneLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { HeroModel } from "@/components/home/hero/HeroModel";
import { telHref } from "@/lib/project";
import { SanityImage as SanityImageType, CtaLink, SalesOffice, StoryProject } from "@/types";

interface HeroSectionProps {
  data: {
    heroImage?: SanityImageType;
    heroTitle?: string;
    heroSubtitle?: string;
    heroCtaLabel?: string;
    heroCtaLink?: CtaLink;
    featuredStoryProject?: StoryProject;
  };
  salesOffice?: SalesOffice;
}

export function resolveLink(linkData?: CtaLink) {
  if (!linkData) return "/";
  if (linkData.linkType === "manual") return linkData.manual || "/";

  const ref = linkData.internal;
  if (!ref || !ref._type) return "/";

  switch (ref._type) {
    case "project": return `/projeler/${ref.slug}`;
    case "aboutPage": return `/hakkimizda`;
    case "contactPage": return `/iletisim`;
    default: return "/";
  }
}

// A normal, scrollable hero: never pinned, never scroll-driven (docs/DESIGN.md → Hero).
// "The Lit Window": the finished working model at night on Deep Cypress, its windows lighting one by one.
// The words sit on the solid night background beside the building, never on top of it.
export function HeroSection({ data, salesOffice }: HeroSectionProps) {
  const phone = salesOffice?.phone;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex flex-col bg-cypress-deep text-on-cypress lg:min-h-[max(40rem,min(calc(100svh_-_5rem),60rem))]"
    >
      <div className="relative h-[min(56svh,32rem)] lg:absolute lg:inset-0 lg:h-auto">
        <HeroModel label={data?.featuredStoryProject?.title} fallbackImage={data?.heroImage} />
        {/* Mobile: the model's ground dissolves into the night the words sit on, so the two never meet at a seam */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-b from-transparent to-cypress-deep lg:hidden" />
      </div>

      {/* The text column lets pointer events through to the page only where it has content */}
      <div className="page-shell relative flex flex-1 flex-col justify-end pt-4 pb-12 lg:pointer-events-none lg:py-20">
        <div className="lg:pointer-events-auto lg:max-w-[40rem]">
          {data?.heroTitle && (
            <h1 id="hero-title" className="type-display-xl break-words text-on-cypress">
              {data.heroTitle}
            </h1>
          )}
          {data?.heroSubtitle && (
            <p className="mt-6 max-w-[44ch] text-on-cypress-muted md:text-xl md:leading-relaxed">{data.heroSubtitle}</p>
          )}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {phone && salesOffice?.ctaLabel && (
              <Button variant="lamp" size="lg" className="hero-lamp focus-visible:outline-on-cypress" render={<a href={telHref(phone)} />}>
                <RiPhoneLine aria-hidden />
                {salesOffice.ctaLabel}
              </Button>
            )}
            {data?.heroCtaLabel && data?.heroCtaLink && (
              <Button variant="onCypress" size="lg" className="hover:bg-cypress" render={<Link href={resolveLink(data.heroCtaLink)} prefetch={false} />}>
                {data.heroCtaLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
