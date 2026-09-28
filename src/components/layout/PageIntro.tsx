import { SanityImage } from "@/components/ui/SanityImage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SanityImage as SanityImageType, BreadcrumbItem } from "@/types";

interface PageIntroProps {
  title: string;
  subtitle?: string;
  image?: SanityImageType;
  breadcrumbs?: BreadcrumbItem[];
}

// Inner-page opening: the nameplate H1 on white, the photograph below it untouched (no overlay, no gradient).
export function PageIntro({ title, subtitle, image, breadcrumbs }: PageIntroProps) {
  return (
    <section aria-labelledby="page-title" className={image ? undefined : "border-b border-border"}>
      <div className="page-shell pt-8 pb-12 md:pt-10 md:pb-16">
        <Breadcrumbs items={breadcrumbs} />
        <h1 id="page-title" className="type-display mt-10 max-w-[18ch] break-words text-foreground md:mt-14">
          {title}
        </h1>
        {subtitle && <p className="mt-6 max-w-[52ch] text-muted-foreground md:text-xl md:leading-relaxed">{subtitle}</p>}
      </div>
      {image && (
        <div className="page-shell">
          <div className="relative aspect-[4/3] overflow-hidden bg-surface sm:aspect-[21/9]">
            <SanityImage image={image} fill priority quality={85} sizes="(min-width: 1440px) 90rem, 100vw" className="object-cover" />
          </div>
        </div>
      )}
    </section>
  );
}
