import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { aboutPageQuery } from "@/sanity/lib/queries";
import { buildMetadata, getLayoutData } from "@/lib/seo";
import { SanityImage } from "@/components/ui/SanityImage";
import { RichText } from "@/components/ui/RichText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageIntro } from "@/components/layout/PageIntro";
import { SalesOfficeBand } from "@/components/sales/SalesOfficeBand";
import { AboutPage as AboutPageType } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const data = await cachedFetch<AboutPageType>(aboutPageQuery, {}, { next: { tags: ["about"] } });
  return buildMetadata({
    title: data?.heroTitle || data?.pageTitle,
    canonicalPath: "/hakkimizda",
    pageSeo: data?.seo,
  });
}

export default async function AboutPage() {
  const [data, layout] = await Promise.all([
    cachedFetch<AboutPageType>(aboutPageQuery, {}, { next: { tags: ["about"] } }),
    getLayoutData(),
  ]);

  const title = data?.heroTitle || data?.pageTitle;
  // When the H1 already is the page title, the content heading would only repeat it
  const showContentHeading = Boolean(data?.heroTitle && data?.pageTitle);

  return (
    <>
      {title && <PageIntro title={title} subtitle={data?.heroSubtitle} image={data?.heroImage} />}

      <section className="page-shell grid gap-12 py-section lg:grid-cols-12 lg:gap-12">
        <div className={data?.mainImage ? "lg:col-span-6" : "lg:col-span-8 lg:col-start-3"}>
          {showContentHeading && data?.pageTitle && <SectionHeading title={data.pageTitle} subtitle={data.pageSubtitle} />}
          <RichText value={data?.body} className={showContentHeading ? "mt-8 max-w-[62ch]" : "max-w-[62ch]"} />
        </div>

        {data?.mainImage && (
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface lg:sticky lg:top-28">
              <SanityImage image={data.mainImage} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
        )}
      </section>

      <SalesOfficeBand salesOffice={layout?.settings?.salesOffice} />
    </>
  );
}
