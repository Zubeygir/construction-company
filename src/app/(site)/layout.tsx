import { getLayoutData } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await getLayoutData();
  const salesOffice = data?.settings?.salesOffice;

  // No floating WhatsApp bubble: the sticky header keeps the sales office one tap away (docs/ROADMAP.md, home brief).
  return (
    <>
      <Header
        siteName={data?.settings?.siteName}
        logo={data?.settings?.logo}
        links={data?.navigation?.headerLinks}
        phone={salesOffice?.phone}
        whatsappNumber={salesOffice?.whatsappNumber}
        whatsappLabel={salesOffice?.whatsappLabel}
        socialLinks={data?.settings?.socialLinks}
      />
      <main>{children}</main>
      <Footer settings={data?.settings} navigation={data?.navigation} />
    </>
  );
}
