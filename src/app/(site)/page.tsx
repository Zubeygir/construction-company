import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { homePageQuery, projectFallbackQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { HomePage as HomePageType, Project } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const data = await cachedFetch<HomePageType>(homePageQuery, {}, { next: { tags: ["home", "home:featured"] } });
  return buildMetadata({
    canonicalPath: "/",
    pageSeo: data?.seo,
  });
}

export default async function HomePage() {
  const data = await cachedFetch<HomePageType>(homePageQuery, {}, { next: { tags: ["home", "home:featured"] } });

  // Fall back to the latest projects only when none are hand-picked in Sanity
  const projectsToDisplay = data?.featuredProjects?.length
    ? data.featuredProjects
    : await cachedFetch<Project[]>(projectFallbackQuery, {}, { next: { tags: ["project:list"] } });

  return (
    <div className="flex flex-col w-full">
      <HeroSection data={data} />

      <AboutSection
        title={data?.aboutTitle}
        subtitle={data?.aboutSubtitle}
        text={data?.aboutText}
        image={data?.aboutImage}
        ctaLabel={data?.aboutCtaLabel}
        ctaLink={data?.aboutCtaLink}
      />

      <ProjectsSection
        title={data?.projectsTitle}
        subtitle={data?.projectsSubtitle}
        projects={projectsToDisplay}
      />
    </div>
  );
}
