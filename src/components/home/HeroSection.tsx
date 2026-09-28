import { Fragment, type CSSProperties } from "react";
import Link from "next/link";
import { RiPhoneLine } from "react-icons/ri";
import { SanityImage } from "@/components/ui/SanityImage";
import { Button } from "@/components/ui/button";
import { telHref } from "@/lib/project";
import { cn } from "@/lib/utils";
import { SanityImage as SanityImageType, CtaLink, SalesOffice } from "@/types";

interface HeroSectionProps {
  data: {
    heroImage?: SanityImageType;
    heroCaption?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroCtaLabel?: string;
    heroCtaLink?: CtaLink;
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
// The photograph fills the first viewport; the words sit on a solid cypress nameplate at its base, never on a scrim.
export function HeroSection({ data, salesOffice }: HeroSectionProps) {
  const phone = salesOffice?.phone;
  const hasImage = Boolean(data?.heroImage);

  return (
    <section
      aria-labelledby="hero-title"
      className={cn("relative flex flex-col", hasImage && "lg:min-h-[min(calc(100svh-5rem),60rem)] lg:justify-end")}
    >
      {data?.heroImage && (
        <figure className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
          <SanityImage
            image={data.heroImage}
            fill
            priority
            quality={85}
            sizes="100vw"
            className="hero-settle object-cover"
          />
          {data.heroCaption && (
            <figcaption
              className="hero-rise absolute bottom-0 left-0 bg-background px-4 py-3 text-sm text-foreground lg:right-0 lg:left-auto"
              style={{ "--d": "1600ms" } as CSSProperties}
            >
              {data.heroCaption}
            </figcaption>
          )}
        </figure>
      )}

      <div className="relative w-full lg:page-shell">
        <div className="bg-cypress px-gutter py-10 text-on-cypress sm:py-14 lg:max-w-[50rem] lg:px-16 lg:pt-16 lg:pb-14">
          {data?.heroTitle && (
            <h1 id="hero-title" className="type-display-xl text-on-cypress">
              {data.heroTitle.split(" ").map((word, i) => (
                <Fragment key={i}>
                  {i > 0 && " "}
                  <span className="hero-word-mask">
                    <span className="hero-word" style={{ "--i": i } as CSSProperties}>
                      {word}
                    </span>
                  </span>
                </Fragment>
              ))}
            </h1>
          )}
          {data?.heroSubtitle && (
            <p
              className="hero-rise mt-6 max-w-[44ch] text-on-cypress-muted md:text-xl md:leading-relaxed"
              style={{ "--d": "700ms" } as CSSProperties}
            >
              {data.heroSubtitle}
            </p>
          )}

          <div className="hero-rise mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ "--d": "900ms" } as CSSProperties}>
            {phone && salesOffice?.ctaLabel && (
              <Button variant="lamp" size="lg" className="hero-lamp focus-visible:outline-on-cypress" render={<a href={telHref(phone)} />}>
                <RiPhoneLine aria-hidden />
                {salesOffice.ctaLabel}
              </Button>
            )}
            {data?.heroCtaLabel && data?.heroCtaLink && (
              <Button variant="onCypress" size="lg" render={<Link href={resolveLink(data.heroCtaLink)} prefetch={false} />}>
                {data.heroCtaLabel}
              </Button>
            )}
          </div>

          {phone && (
            <p
              className="hero-rise mt-8 border-t border-on-cypress/20 pt-5 text-base text-on-cypress-muted"
              style={{ "--d": "1100ms" } as CSSProperties}
            >
              <a
                href={telHref(phone)}
                className="font-semibold tabular-nums text-on-cypress underline-offset-4 hover:underline focus-visible:outline-on-cypress"
              >
                {phone}
              </a>
              {salesOffice?.contactName && <> · {salesOffice.contactName}</>}
              {salesOffice?.workingHours && <span className="mt-1 block">{salesOffice.workingHours}</span>}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
