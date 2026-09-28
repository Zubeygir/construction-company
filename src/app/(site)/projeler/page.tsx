import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { projectsPageQuery, projectListQuery } from "@/sanity/lib/queries";
import { buildMetadata, getLayoutData } from "@/lib/seo";
import { PageIntro } from "@/components/layout/PageIntro";
import { ProjectRow } from "@/components/projects/ProjectRow";
import { SalesOfficeBand } from "@/components/sales/SalesOfficeBand";
import { statusLabel, type ProjectStatus } from "@/lib/project";
import { ProjectsPage as ProjectsPageType, Project } from "@/types";

// Active work first, the delivered record last.
const STATUS_ORDER: ProjectStatus[] = ["satista", "insaatta", "yakinda", "tamamlandi"];

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await cachedFetch<ProjectsPageType>(projectsPageQuery, {}, { next: { tags: ["projectsPage"] } });
  return buildMetadata({
    title: pageData?.heroTitle || pageData?.pageTitle,
    canonicalPath: "/projeler",
    pageSeo: pageData?.seo,
  });
}

export default async function ProjectsHubPage() {
  const [projects, pageData, layout] = await Promise.all([
    cachedFetch<Project[]>(projectListQuery, {}, { next: { tags: ["project:list"] } }),
    cachedFetch<ProjectsPageType>(projectsPageQuery, {}, { next: { tags: ["projectsPage"] } }),
    getLayoutData(),
  ]);

  const groups = STATUS_ORDER.map((status) => ({
    status,
    projects: (projects || []).filter((project) => project.status === status),
  })).filter((group) => group.projects.length > 0);

  const title = pageData?.heroTitle || pageData?.pageTitle;

  return (
    <>
      {title && <PageIntro title={title} subtitle={pageData?.heroSubtitle || pageData?.pageSubtitle} image={pageData?.heroImage} />}

      {groups.length > 0 && (
        <div className="page-shell flex flex-col gap-16 py-section md:gap-24">
          {groups.map((group) => (
            <section key={group.status} aria-labelledby={`status-${group.status}`} className="grid gap-6 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-3">
                <h2 id={`status-${group.status}`} className="type-headline text-foreground lg:sticky lg:top-28">
                  {statusLabel(group.status)}
                  <span className="ml-3 align-middle type-label tabular-nums text-muted-foreground">{group.projects.length}</span>
                </h2>
              </div>
              <ul className="border-t border-border lg:col-span-9">
                {group.projects.map((project) => (
                  <ProjectRow key={project.slug.current} project={project} showStatus={false} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <SalesOfficeBand salesOffice={layout?.settings?.salesOffice} />
    </>
  );
}
