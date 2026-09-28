import Link from "next/link";
import { SanityImage } from "@/components/ui/SanityImage";
import { StatusTag } from "@/components/ui/StatusTag";
import { SPEC_LABELS, formatMonthYear } from "@/lib/project";
import type { Project } from "@/types";

export function DeliveryLine({ date }: { date?: string }) {
  const formatted = formatMonthYear(date);
  if (!formatted) return null;
  return (
    <p className="text-muted-foreground">
      {SPEC_LABELS.plannedDelivery}: <span className="font-medium text-foreground">{formatted}</span>
    </p>
  );
}

// The whole row is clickable through the title link's ::after, so there is one accessible link per project.
export const stretchedLink = "after:absolute after:inset-0 after:content-['']";

type RowProject = Pick<Project, "title" | "slug" | "status" | "location" | "summary" | "plannedDelivery" | "mainImage">;

export function ProjectRow({ project, showStatus = true }: { project: RowProject; showStatus?: boolean }) {
  return (
    <li className="group relative grid gap-5 border-b border-border py-6 sm:grid-cols-[13rem_1fr] sm:gap-8 lg:grid-cols-[16rem_1fr_auto] lg:items-center">
      {project.mainImage ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          <SanityImage
            image={project.mainImage}
            fill
            sizes="(min-width: 1024px) 16rem, (min-width: 640px) 13rem, 100vw"
            className="object-cover transition-transform duration-500 ease-out-quart motion-safe:group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div aria-hidden className="hidden sm:block" />
      )}
      <div className="flex flex-col gap-2">
        <h3 className="type-title text-foreground">
          <Link href={`/projeler/${project.slug.current}`} prefetch={false} className={`${stretchedLink} underline-offset-4 group-hover:underline`}>
            {project.title}
          </Link>
        </h3>
        {project.location && <p className="text-muted-foreground">{project.location}</p>}
        {project.summary && <p className="max-w-[60ch] text-foreground">{project.summary}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:col-start-2 lg:col-start-auto lg:flex-col lg:items-end">
        {showStatus && <StatusTag status={project.status} />}
        <DeliveryLine date={project.plannedDelivery} />
      </div>
    </li>
  );
}
