import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { contactPageQuery } from "@/sanity/lib/queries";
import { buildMetadata, getLayoutData } from "@/lib/seo";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageIntro } from "@/components/layout/PageIntro";
import { SalesContact } from "@/components/sales/SalesContact";
import { SpecList } from "@/components/ui/SpecList";
import { CONTACT_LABELS, telHref, whatsappHref } from "@/lib/project";
import { ContactPage as ContactPageType } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const data = await cachedFetch<ContactPageType>(contactPageQuery, {}, { next: { tags: ["contact"] } });
  return buildMetadata({
    title: data?.heroTitle || data?.pageTitle,
    canonicalPath: "/iletisim",
    pageSeo: data?.seo,
  });
}

const valueLink = "underline-offset-4 hover:text-cypress hover:underline";

export default async function ContactPage() {
  const [data, layout] = await Promise.all([
    cachedFetch<ContactPageType>(contactPageQuery, {}, { next: { tags: ["contact"] } }),
    getLayoutData(),
  ]);
  const contact = data?.contactInfo;
  const salesOffice = layout?.settings?.salesOffice;
  const title = data?.heroTitle || data?.pageTitle;

  return (
    <>
      {title && <PageIntro title={title} subtitle={data?.heroSubtitle} image={data?.heroImage} />}

      <div className="page-shell grid gap-16 py-section lg:grid-cols-12 lg:gap-12">
        {/* The named person comes first; the form is the fallback, never the front door */}
        {salesOffice && (salesOffice.phone || salesOffice.whatsappNumber) && (
          <SalesContact salesOffice={salesOffice} className="lg:col-span-6" />
        )}

        <div className="flex flex-col gap-10 lg:col-span-5 lg:col-start-8">
          {data?.pageSubtitle && <p className="max-w-[48ch] text-foreground md:text-xl md:leading-relaxed">{data.pageSubtitle}</p>}
          <address className="not-italic">
            <SpecList
              items={[
                {
                  label: CONTACT_LABELS.phone,
                  value: contact?.phone && (
                    <a href={telHref(contact.phone)} className={`tabular-nums ${valueLink}`}>
                      {contact.phone}
                    </a>
                  ),
                },
                {
                  label: CONTACT_LABELS.whatsapp,
                  value: contact?.whatsappNumber && (
                    <a href={whatsappHref(contact.whatsappNumber)} target="_blank" rel="noopener noreferrer" className={`tabular-nums ${valueLink}`}>
                      {contact.whatsappNumber}
                    </a>
                  ),
                },
                {
                  label: CONTACT_LABELS.email,
                  value: contact?.email && (
                    <a href={`mailto:${contact.email}`} className={`break-all ${valueLink}`}>
                      {contact.email}
                    </a>
                  ),
                },
                { label: CONTACT_LABELS.address, value: contact?.address && <span className="whitespace-pre-line">{contact.address}</span> },
                { label: CONTACT_LABELS.hours, value: salesOffice?.workingHours },
              ]}
            />
          </address>
        </div>
      </div>

      {data?.showForm && (
        <section className="bg-surface py-section">
          <div className="page-shell grid lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ContactForm formTitle={data.formTitle} successMessage={data.successMessage} />
            </div>
          </div>
        </section>
      )}

      {contact?.mapIframe && (
        <div
          className="w-full [&_iframe]:block [&_iframe]:h-[min(60svh,32rem)] [&_iframe]:w-full [&_iframe]:border-0"
          dangerouslySetInnerHTML={{ __html: contact.mapIframe }}
        />
      )}
    </>
  );
}
