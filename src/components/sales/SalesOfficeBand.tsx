import { SalesContact } from "@/components/sales/SalesContact";
import { SanityImage } from "@/components/ui/SanityImage";
import type { SalesOffice } from "@/types";

// The sales office as a named person, one tap away. Shared by home, about and project pages.
// With a band image (lit windows at dusk), the photograph bleeds to the left edge and the contact sits beside it.
export function SalesOfficeBand({ salesOffice }: { salesOffice?: SalesOffice }) {
  if (!salesOffice?.phone && !salesOffice?.whatsappNumber) return null;
  const { bandImage, headline } = salesOffice;

  if (!bandImage) {
    return (
      <section aria-labelledby={headline ? "sales-office-title" : undefined} className="bg-cypress text-on-cypress">
        <div className="page-shell grid gap-10 py-section md:grid-cols-12 md:items-center md:gap-12">
          {headline && (
            <h2 id="sales-office-title" className="type-headline md:col-span-12 lg:col-span-5">
              {headline}
            </h2>
          )}
          <SalesContact
            salesOffice={salesOffice}
            tone="onCypress"
            className="md:col-span-12 lg:col-span-7 lg:col-start-6 lg:justify-end"
          />
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby={headline ? "sales-office-title" : undefined} className="bg-cypress text-on-cypress">
      <div className="grid lg:grid-cols-12">
        <div className="relative aspect-[16/10] overflow-hidden bg-cypress-deep sm:aspect-[21/9] lg:col-span-6 lg:aspect-auto lg:min-h-[40rem]">
          <SanityImage image={bandImage} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="page-shell py-section lg:col-span-6 lg:mx-0 lg:max-w-none lg:pl-16 lg:pr-[max(var(--gutter),calc((100vw_-_var(--shell))/2_+_var(--gutter)))] lg:flex lg:flex-col lg:justify-center">
          {headline && (
            <h2 id="sales-office-title" className="type-display max-w-[14ch]">
              {headline}
            </h2>
          )}
          <SalesContact salesOffice={salesOffice} tone="onCypress" className="mt-12" />
        </div>
      </div>
    </section>
  );
}
