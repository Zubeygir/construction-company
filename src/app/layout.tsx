import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { buildMetadata, getLayoutData } from "@/lib/seo";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/components/seo/JsonLd";

// Variable width axis: wdth 125 is the display "nameplate" cut, wdth 100 the body (see docs/DESIGN.md)
// Named --font-archivo, not --font-sans: Tailwind's @theme emits --font-sans itself, and the same name made it self-referencing (invalid)
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
});

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata();
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getLayoutData();

  return (
    <html lang="tr" className={archivo.variable} suppressHydrationWarning>
      <head>
        {/* The hero intro plays once per browser session (docs/DESIGN.md → Hero); set before paint so it never flashes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("tinaz-intro"))document.documentElement.dataset.intro="seen";else sessionStorage.setItem("tinaz-intro","1")}catch(e){}`,
          }}
        />
      </head>
      <body className={archivo.className}>
        {settings?.gtmId && <GoogleTagManager gtmId={settings.gtmId} />}
        {settings?.gaId && <GoogleAnalytics gaId={settings.gaId} />}
        <JsonLd data={organizationJsonLd(settings)} />
        <JsonLd data={websiteJsonLd(settings)} />
        {children}
      </body>
    </html>
  );
}
