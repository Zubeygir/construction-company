import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SPEC_LABELS, formatCount, formatMonthYear } from "@/lib/project";
import type { DeliveredProject } from "@/types";

interface DeliveryRecordProps {
  title?: string;
  subtitle?: string;
  projects?: DeliveredProject[];
}

// A ledger, not a table: a table would expose missing actual-delivery dates as an empty column (docs/PRODUCT.md → Content policy).
// Each building leads with its year, set like a nameplate; the column of years down to the first building proves the firm's age
// without an "est." badge or a counter.
export function DeliveryRecord({ title, subtitle, projects = [] }: DeliveryRecordProps) {
  if (projects.length === 0) return null;

  return (
    <section aria-labelledby="record-title" className="bg-surface py-section">
      <div className="page-shell">
        {title && <SectionHeading id="record-title" title={title} subtitle={subtitle} />}

        <ol className="mt-12 border-t border-border md:mt-16">
          {projects.map((project) => {
            const year = (project.actualDelivery ?? project.plannedDelivery)?.slice(0, 4);
            const facts = [
              { label: SPEC_LABELS.unitCount, value: formatCount(project.unitCount) },
              { label: SPEC_LABELS.plannedDelivery, value: formatMonthYear(project.plannedDelivery) },
              { label: SPEC_LABELS.actualDelivery, value: formatMonthYear(project.actualDelivery) },
              { label: SPEC_LABELS.occupancyPermitDate, value: formatMonthYear(project.occupancyPermitDate) },
            ].filter((fact) => fact.value);

            return (
              <li
                key={project.slug.current}
                className="group relative grid gap-x-8 gap-y-4 border-b border-border py-6 md:py-8 lg:grid-cols-12 lg:items-baseline"
              >
                {year && <p className="type-display tabular-nums text-cypress lg:col-span-3">{year}</p>}
                <div className="lg:col-span-3">
                  <h3 className="type-title text-foreground">
                    <Link
                      href={`/projeler/${project.slug.current}`}
                      prefetch={false}
                      className="underline-offset-4 after:absolute after:inset-0 after:content-[''] group-hover:underline"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  {project.location && <p className="mt-1 text-muted-foreground">{project.location}</p>}
                </div>
                {facts.length > 0 && (
                  <dl className="flex flex-wrap gap-x-8 gap-y-3 lg:col-span-6">
                    {facts.map((fact) => (
                      <div key={fact.label}>
                        <dt className="type-label uppercase text-muted-foreground">{fact.label}</dt>
                        <dd className="mt-1 font-medium tabular-nums text-foreground">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
