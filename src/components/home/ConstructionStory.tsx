import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpecList, type SpecItem } from "@/components/ui/SpecList";
import { SPEC_LABELS, formatArea, formatCount, formatMonthYear } from "@/lib/project";
import { StoryScroller } from "@/components/home/story/StoryScroller";
import { StoryModel } from "@/components/home/story/StoryModel";
import type { StoryProject, StoryStage } from "@/types";

interface ConstructionStoryProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  project?: StoryProject;
  stages: {
    ground?: StoryStage;
    foundation?: StoryStage;
    frame?: StoryStage;
    handover?: StoryStage;
  };
}

// The site's one choreographed moment and its one numbered sequence (docs/DESIGN.md → Construction Story).
// Stage data is plain HTML in every mode; the three.js model only illustrates it.
export function ConstructionStory({ title, subtitle, ctaLabel, project, stages }: ConstructionStoryProps) {
  if (!project) return null;

  const steps: { stage?: StoryStage; specs: SpecItem[] }[] = [
    {
      stage: stages.ground,
      specs: [
        { label: SPEC_LABELS.groundClass, value: project.groundClass },
        { label: SPEC_LABELS.landArea, value: formatArea(project.landArea) },
      ],
    },
    {
      stage: stages.foundation,
      specs: [
        { label: SPEC_LABELS.foundationType, value: project.foundationType },
        { label: SPEC_LABELS.concreteClass, value: project.concreteClass },
      ],
    },
    {
      stage: stages.frame,
      specs: [
        { label: SPEC_LABELS.floorCount, value: formatCount(project.floorCount) },
        { label: SPEC_LABELS.inspectionFirm, value: project.inspectionFirm },
        { label: SPEC_LABELS.architect, value: project.architect },
      ],
    },
    {
      stage: stages.handover,
      specs: [
        { label: SPEC_LABELS.plannedDelivery, value: formatMonthYear(project.plannedDelivery) },
        { label: SPEC_LABELS.actualDelivery, value: formatMonthYear(project.actualDelivery) },
        { label: SPEC_LABELS.occupancyPermitDate, value: formatMonthYear(project.occupancyPermitDate) },
        { label: SPEC_LABELS.unitCount, value: formatCount(project.unitCount) },
      ],
    },
  ];

  const projectHref = `/projeler/${project.slug.current}`;

  return (
    <section aria-labelledby="story-title">
      <div className="page-shell pt-section">
        {title && <SectionHeading id="story-title" title={title} subtitle={subtitle} />}
      </div>

      <StoryScroller className="mt-12 pb-section md:mt-16">
        {/* Flex column on mobile so the model can stay sticky above the stages; a grid on desktop */}
        <div className="page-shell flex flex-col lg:grid lg:grid-cols-12 lg:gap-12">
          <figure className="sticky top-16 z-10 -mx-gutter h-[42svh] bg-(--story-bg) lg:static lg:col-span-6 lg:mx-0 lg:h-auto lg:bg-transparent">
            <div className="relative h-full lg:sticky lg:top-24 lg:h-[calc(100svh-8rem)]">
              <StoryModel fallbackImage={project.mainImage} label={project.title} />
              {/* Desktop only: on mobile it would sit on the model's base; the last stage links the project anyway */}
              <figcaption className="absolute bottom-0 left-0 hidden text-sm text-(--story-muted) lg:block">
                <Link href={projectHref} prefetch={false} className="font-semibold text-(--story-fg) underline-offset-4 hover:underline">
                  {project.title}
                </Link>
                {project.location && <> · {project.location}</>}
              </figcaption>
            </div>
          </figure>

          <ol className="lg:col-span-6 lg:col-start-7">
            {steps.map((step, index) => (
              <li
                key={index}
                data-story-stage={index}
                // The taller last stage keeps the sticky model pinned until every window is lit (StoryScroller → HANDOVER_SCROLL)
                className={`flex flex-col justify-center py-12 lg:py-16 ${index === steps.length - 1 ? "lg:min-h-[75svh]" : "lg:min-h-[50svh]"}`}
              >
                <p aria-hidden className="type-label tabular-nums text-(--story-muted)">
                  {index + 1} / {steps.length}
                </p>
                {step.stage?.title && (
                  <h3 className="type-display mt-3 break-words">
                    <span className="sr-only">{index + 1}. </span>
                    {step.stage.title}
                  </h3>
                )}
                {step.stage?.text && <p className="mt-5 max-w-[46ch]">{step.stage.text}</p>}
                <SpecList items={step.specs} tone="story" className="mt-8 max-w-[34rem]" />
                {index === steps.length - 1 && ctaLabel && (
                  <Link
                    href={projectHref}
                    prefetch={false}
                    className="type-label mt-10 inline-flex h-12 items-center self-start rounded-sm border border-(--story-fg) px-5 text-(--story-fg) transition-colors duration-200 hover:bg-(--story-fg) hover:text-(--story-bg) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--story-fg)"
                  >
                    {ctaLabel}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </StoryScroller>
    </section>
  );
}
