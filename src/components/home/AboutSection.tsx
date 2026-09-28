import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SanityImage } from "@/components/ui/SanityImage";
import { RichText } from "@/components/ui/RichText";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SanityImage as SanityImageType } from "@/types";
import type { PortableTextBlock } from "@portabletext/react";

interface AboutSectionProps {
  title?: string;
  subtitle?: string;
  text?: PortableTextBlock[];
  image?: SanityImageType;
  ctaLabel?: string;
  ctaLink?: string;
}

export function AboutSection({ title, subtitle, text, image, ctaLabel, ctaLink }: AboutSectionProps) {
  if (!title && !text?.length) return null;

  // Text on the shell's left edge, the photograph bleeding off the right edge: the mirror of the sales band below it
  return (
    <section aria-labelledby={title ? "about-title" : undefined} className="grid lg:grid-cols-12 lg:items-stretch">
      <div
        className={cn(
          "page-shell flex flex-col justify-center py-section lg:mx-0 lg:max-w-none lg:pr-16 lg:pl-[max(var(--gutter),calc((100vw_-_var(--shell))/2_+_var(--gutter)))]",
          image ? "lg:col-span-6" : "lg:col-span-8"
        )}
      >
        {title && <SectionHeading id="about-title" title={title} subtitle={subtitle} />}
        {text && text.length > 0 && <RichText value={text} className="mt-8 max-w-[62ch]" />}
        {ctaLabel && ctaLink && (
          <Button variant="outline" size="lg" className="mt-10 self-start" render={<Link href={ctaLink} prefetch={false} />}>
            {ctaLabel}
          </Button>
        )}
      </div>

      {image && (
        <div className="relative aspect-[4/5] overflow-hidden bg-surface sm:aspect-[3/2] lg:col-span-6 lg:aspect-auto lg:min-h-[44rem]">
          <SanityImage image={image} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      )}
    </section>
  );
}
