import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SanityImage } from "@/components/ui/SanityImage";
import { StatusTag } from "@/components/ui/StatusTag";
import { SpecList } from "@/components/ui/SpecList";
import { ProjectRow, stretchedLink } from "@/components/projects/ProjectRow";
import { SPEC_LABELS, formatCount, formatMonthYear } from "@/lib/project";
import { Project } from "@/types";

interface ProjectsSectionProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  projects?: Project[];
}

export function ProjectsSection({ title, subtitle, ctaLabel, projects = [] }: ProjectsSectionProps) {
  if (projects.length === 0) return null;
  const [lead, ...rest] = projects;

  return (
    <section aria-labelledby="projects-title" className="py-section">
      <div className="page-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {title && <SectionHeading id="projects-title" title={title} subtitle={subtitle} />}
          {ctaLabel && (
            <Link
              href="/projeler"
              prefetch={false}
              className="group/cta flex shrink-0 items-center gap-2 font-semibold text-cypress underline-offset-4 hover:underline"
            >
              {ctaLabel}
              <RiArrowRightLine aria-hidden className="size-5 transition-transform duration-200 ease-out-quart motion-safe:group-hover/cta:translate-x-1" />
            </Link>
          )}
        </div>

        {/* The lead project reads like its site board: name first, then the checkable facts */}
        <article className="group relative mt-12 grid gap-8 md:mt-16 lg:grid-cols-12 lg:gap-12">
          {lead.mainImage && (
            <div className="relative aspect-[4/3] overflow-hidden bg-surface lg:col-span-7 lg:aspect-auto lg:min-h-[36rem]">
              <SanityImage
                image={lead.mainImage}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition-transform duration-500 ease-out-quart motion-safe:group-hover:scale-[1.02]"
              />
            </div>
          )}
          <div className="flex flex-col lg:col-span-5">
            <StatusTag status={lead.status} className="self-start" />
            <h3 className="type-headline mt-5 text-foreground lg:text-[3.25rem]">
              <Link href={`/projeler/${lead.slug.current}`} prefetch={false} className={`${stretchedLink} underline-offset-[6px] decoration-2 group-hover:underline`}>
                {lead.title}
              </Link>
            </h3>
            {lead.location && <p className="mt-3 text-muted-foreground">{lead.location}</p>}
            {lead.summary && <p className="mt-6 max-w-[48ch] text-foreground">{lead.summary}</p>}
            <SpecList
              className="mt-8 lg:mt-auto lg:pt-8"
              items={[
                { label: SPEC_LABELS.floorCount, value: formatCount(lead.floorCount) },
                { label: SPEC_LABELS.unitCount, value: formatCount(lead.unitCount) },
                { label: SPEC_LABELS.unitTypes, value: lead.unitTypeNames?.join(" · ") },
                { label: SPEC_LABELS.plannedDelivery, value: formatMonthYear(lead.plannedDelivery) },
              ]}
            />
          </div>
        </article>

        {rest.length > 0 && (
          <ul className="mt-16 border-t border-border">
            {rest.map((project) => (
              <ProjectRow key={project.slug.current} project={project} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
