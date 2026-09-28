import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { homePageQuery, projectFallbackQuery } from "@/sanity/lib/queries";
import { buildMetadata, getLayoutData } from "@/lib/seo";
import { HeroSection } from "@/components/home/HeroSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { ConstructionStory } from "@/components/home/ConstructionStory";
import { DeliveryRecord } from "@/components/home/DeliveryRecord";
import { AboutSection } from "@/components/home/AboutSection";
import { SalesOfficeBand } from "@/components/sales/SalesOfficeBand";
import { HomePage as HomePageType, Project } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const data = await cachedFetch<HomePageType>(homePageQuery, {}, { next: { tags: ["home", "home:featured"] } });
  return buildMetadata({
    canonicalPath: "/",
    pageSeo: data?.seo,
  });
}

// Order: product (projects) → proof (story, delivery record) → people → contact.
export default async function HomePage() {
  const [data, layout] = await Promise.all([
    cachedFetch<HomePageType>(homePageQuery, {}, { next: { tags: ["home", "home:featured"] } }),
    getLayoutData(),
  ]);
  const salesOffice = layout?.settings?.salesOffice;

  // Fall back to active projects only when none are hand-picked in Sanity
  const projectsToDisplay = data?.featuredProjects?.length
    ? data.featuredProjects
    : await cachedFetch<Project[]>(projectFallbackQuery, {}, { next: { tags: ["project:list"] } });

  return (
    <>
      <HeroSection data={data} salesOffice={salesOffice} />

      <ProjectsSection
        title={data?.projectsTitle}
        subtitle={data?.projectsSubtitle}
        ctaLabel={data?.projectsCtaLabel}
        projects={projectsToDisplay}
      />

      <ConstructionStory
        title={data?.storyTitle}
        subtitle={data?.storySubtitle}
        ctaLabel={data?.storyCtaLabel}
        project={data?.featuredStoryProject}
        stages={{
          ground: data?.stageGround,
          foundation: data?.stageFoundation,
          frame: data?.stageFrame,
          handover: data?.stageHandover,
        }}
      />

      <DeliveryRecord title={data?.recordTitle} subtitle={data?.recordSubtitle} projects={data?.deliveredProjects} />

      <AboutSection
        title={data?.aboutTitle}
        subtitle={data?.aboutSubtitle}
        text={data?.aboutText}
        image={data?.aboutImage}
        ctaLabel={data?.aboutCtaLabel}
        ctaLink={data?.aboutCtaLink}
      />

      <SalesOfficeBand salesOffice={salesOffice} />
    </>
  );
}
