import { Metadata } from "next";
import { notFound } from "next/navigation";
import { RiMapPinLine, RiArrowRightUpLine, RiFilePdf2Line, RiPhoneLine } from "react-icons/ri";
import { cachedFetch } from "@/sanity/lib/client";
import { projectBySlugQuery, projectSlugsQuery, projectsPageQuery } from "@/sanity/lib/queries";
import { buildMetadata, getLayoutData, portableTextToPlainText } from "@/lib/seo";
import { RichText } from "@/components/ui/RichText";
import { cn } from "@/lib/utils";
import { SanityImage } from "@/components/ui/SanityImage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpecList, type SpecItem } from "@/components/ui/SpecList";
import { StatusTag } from "@/components/ui/StatusTag";
import { LightboxGallery } from "@/components/ui/Lightbox";
import { Button } from "@/components/ui/button";
import { UnitTypes } from "@/components/projects/UnitTypes";
import { SalesOfficeBand } from "@/components/sales/SalesOfficeBand";
import { SPEC_LABELS, formatArea, formatCount, formatMonthYear, telHref } from "@/lib/project";

import { Project, ProjectsPage } from "@/types";
import { JsonLd, projectJsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await cachedFetch<Array<{ slug: string }>>(projectSlugsQuery, {}, { next: { tags: ["project:list"] } });
  return (projects || []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await cachedFetch<Project | null>(projectBySlugQuery, { slug }, { next: { tags: [`project:detail:${slug}`] } });
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: project.summary || portableTextToPlainText(project.body),
    ogImage: project.mainImage,
    canonicalPath: `/projeler/${slug}`,
    pageSeo: project.seo,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, pageData, layout] = await Promise.all([
    cachedFetch<Project | null>(projectBySlugQuery, { slug }, { next: { tags: [`project:detail:${slug}`] } }),
    cachedFetch<ProjectsPage>(projectsPageQuery, {}, { next: { tags: ["projectsPage"] } }),
    getLayoutData(),
  ]);

  if (!project) notFound();
  const salesOffice = layout?.settings?.salesOffice;

  const buildingSpecs: SpecItem[] = [
    { label: SPEC_LABELS.architect, value: project.architect },
    { label: SPEC_LABELS.inspectionFirm, value: project.inspectionFirm },
    { label: SPEC_LABELS.groundClass, value: project.groundClass },
    { label: SPEC_LABELS.foundationType, value: project.foundationType },
    { label: SPEC_LABELS.concreteClass, value: project.concreteClass },
    { label: SPEC_LABELS.landArea, value: formatArea(project.landArea) },
    { label: SPEC_LABELS.floorCount, value: formatCount(project.floorCount) },
    { label: SPEC_LABELS.unitCount, value: formatCount(project.unitCount) },
    ...(project.extraSpecs || []).map((row) => ({ label: row.label, value: row.value })),
  ];
  const timelineSpecs: SpecItem[] = [
    { label: SPEC_LABELS.startDate, value: formatMonthYear(project.startDate) },
    { label: SPEC_LABELS.plannedDelivery, value: formatMonthYear(project.plannedDelivery) },
    { label: SPEC_LABELS.actualDelivery, value: formatMonthYear(project.actualDelivery) },
    { label: SPEC_LABELS.occupancyPermitDate, value: formatMonthYear(project.occupancyPermitDate) },
  ];
  const hasSpecs = [...buildingSpecs, ...timelineSpecs].some((item) => item.value);
  const documents = (project.documents || []).filter((doc) => doc.url);
  const units = project.unitTypes || [];
  const amenities = project.amenities || [];
  const gallery = project.gallery || [];

  return (
    <>
      <JsonLd data={projectJsonLd(project)} />
      <article className="pb-section">
        <div className="page-shell py-6 md:py-8">
          <Breadcrumbs
            items={
              pageData?.pageTitle
                ? [
                    { label: pageData.pageTitle, href: "/projeler" },
                    { label: project.title, href: `/projeler/${slug}`, active: true },
                  ]
                : undefined
            }
          />
        </div>

        {/* The building's own photograph, its name on the cypress nameplate at the base (same system as the home hero) */}
        <header className={cn("relative flex flex-col", project.mainImage && "lg:min-h-[min(calc(100svh-10rem),56rem)] lg:justify-end")}>
          {project.mainImage && (
            <div className="relative aspect-[4/3] overflow-hidden bg-surface sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
              <SanityImage image={project.mainImage} fill priority quality={85} sizes="100vw" className="hero-settle object-cover" />
            </div>
          )}

          <div className="relative w-full lg:page-shell">
            <div className="bg-cypress px-gutter py-10 text-on-cypress sm:py-12 lg:max-w-[46rem] lg:px-14 lg:pt-14 lg:pb-12">
              <StatusTag status={project.status} />
              <h1 className="type-display mt-5 break-words">{project.title}</h1>
              {project.location &&
                (project.mapUrl ? (
                  <a
                    href={project.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-on-cypress-muted underline-offset-4 hover:text-on-cypress hover:underline focus-visible:outline-on-cypress"
                  >
                    <RiMapPinLine aria-hidden className="size-5 text-on-cypress" />
                    {project.location}
                    <RiArrowRightUpLine aria-hidden className="size-4" />
                  </a>
                ) : (
                  <p className="mt-5 flex items-center gap-2 text-on-cypress-muted">
                    <RiMapPinLine aria-hidden className="size-5 text-on-cypress" />
                    {project.location}
                  </p>
                ))}
              {project.summary && <p className="mt-6 max-w-[48ch] md:text-xl md:leading-relaxed">{project.summary}</p>}

              {/* No prices, by policy: the price note and a direct line to the sales office stand in their place.
                  A delivered building has nothing on sale, so it carries no call (The One Lamp Rule). */}
              {salesOffice?.phone && project.status !== "tamamlandi" && (
                <aside aria-label={salesOffice.contactRole} className="mt-8 flex flex-col gap-4 border-t border-on-cypress/20 pt-6">
                  {salesOffice.priceNote && <p className="type-title">{salesOffice.priceNote}</p>}
                  <div className="flex flex-col gap-x-6 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center">
                    {salesOffice.ctaLabel && (
                      <Button
                        variant="lamp"
                        size="lg"
                        className="self-start focus-visible:outline-on-cypress"
                        render={<a href={telHref(salesOffice.phone)} />}
                      >
                        <RiPhoneLine aria-hidden />
                        {salesOffice.ctaLabel}
                      </Button>
                    )}
                    <p className="text-on-cypress-muted">
                      <a
                        href={telHref(salesOffice.phone)}
                        className="font-semibold tabular-nums text-on-cypress underline-offset-4 hover:underline focus-visible:outline-on-cypress"
                      >
                        {salesOffice.phone}
                      </a>
                      {salesOffice.contactName && <> · {salesOffice.contactName}</>}
                    </p>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </header>

        {project.body && project.body.length > 0 && (
          <div className="page-shell mt-section grid lg:grid-cols-12">
            <RichText value={project.body} className="max-w-[68ch] lg:col-span-8 lg:col-start-4" />
          </div>
        )}

        {(hasSpecs || documents.length > 0) && (
          <section aria-labelledby={pageData?.specsTitle ? "specs-title" : undefined} className="mt-section bg-surface py-section">
            <div className="page-shell grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-3">
                {pageData?.specsTitle && <SectionHeading id="specs-title" title={pageData.specsTitle} />}
              </div>
              <div className="flex flex-col gap-12 lg:col-span-9">
                <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
                  <SpecList items={buildingSpecs} />
                  <SpecList items={timelineSpecs} />
                </div>
                {documents.length > 0 && (
                  <div>
                    {pageData?.documentsTitle && <h3 className="type-title text-foreground">{pageData.documentsTitle}</h3>}
                    <ul className="mt-4 border-t border-border">
                      {documents.map((doc) => (
                        <li key={doc._key} className="border-b border-border">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-h-14 items-center gap-3 py-3 font-medium text-foreground underline-offset-4 hover:text-cypress hover:underline"
                          >
                            <RiFilePdf2Line aria-hidden className="size-6 shrink-0 text-cypress" />
                            {doc.title}
                            <span className="sr-only"> (PDF, yeni sekmede açılır)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {units.length > 0 && (
          <section aria-labelledby={pageData?.unitsTitle ? "units-title" : undefined} className="page-shell mt-section grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-3">
              {pageData?.unitsTitle && <SectionHeading id="units-title" title={pageData.unitsTitle} />}
            </div>
            <div className="lg:col-span-9">
              <UnitTypes units={units} />
              {salesOffice?.priceNote && (
                <p className="mt-6 text-muted-foreground">
                  {salesOffice.priceNote}
                  {salesOffice.phone && (
                    <>
                      {" "}
                      <a href={telHref(salesOffice.phone)} className="font-semibold tabular-nums text-foreground underline-offset-4 hover:underline">
                        {salesOffice.phone}
                      </a>
                    </>
                  )}
                </p>
              )}
            </div>
          </section>
        )}

        {amenities.length > 0 && (
          <section aria-labelledby={pageData?.amenitiesTitle ? "amenities-title" : undefined} className="page-shell mt-section grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-3">
              {pageData?.amenitiesTitle && <SectionHeading id="amenities-title" title={pageData.amenitiesTitle} />}
            </div>
            <ul className="grid border-t border-border sm:grid-cols-2 sm:gap-x-12 lg:col-span-9">
              {amenities.map((amenity) => (
                <li key={amenity} className="border-b border-border py-3 text-foreground">
                  {amenity}
                </li>
              ))}
            </ul>
          </section>
        )}

        {gallery.length > 0 && (
          <section aria-labelledby={pageData?.galleryTitle ? "gallery-title" : undefined} className="page-shell mt-section">
            {pageData?.galleryTitle && <SectionHeading id="gallery-title" title={pageData.galleryTitle} className="mb-10" />}
            <LightboxGallery images={gallery} label={pageData?.galleryTitle || project.title} />
          </section>
        )}
      </article>

      <SalesOfficeBand salesOffice={salesOffice} />
    </>
  );
}
