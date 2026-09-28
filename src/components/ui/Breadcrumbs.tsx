"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { JsonLd, breadcrumbListJsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbItem } from "@/types";

const ROUTE_LABELS: Record<string, string> = {
  hakkimizda: "Hakkımızda",
  projeler: "Projeler",
  iletisim: "İletişim",
};

function formatSlugToLabel(slug: string): string {
  try {
    const decoded = decodeURIComponent(slug).trim().toLowerCase();
    if (ROUTE_LABELS[decoded]) {
      return ROUTE_LABELS[decoded];
    }
    return decoded
      .replace(/[-_]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1))
      .join(" ");
  } catch {
    return slug;
  }
}

export function Breadcrumbs({ items, className = "" }: { items?: BreadcrumbItem[]; className?: string }) {
  const pathname = usePathname();

  // Eğer dışarıdan liste gelmezse current path'ten üret
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      const label = formatSlugToLabel(path);
      return { label, href, active: index === paths.length - 1 };
    });
  };

  const breadcrumbs = items || generateBreadcrumbs();

  if (pathname === "/") return null;

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd(breadcrumbs)} />
      <nav aria-label="Breadcrumb" className={`text-sm text-muted-foreground ${className}`}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" prefetch={false} className="underline-offset-4 hover:text-foreground hover:underline">
              Ana sayfa
            </Link>
          </li>
          {breadcrumbs.map((crumb, i) => (
            <li key={i} className="flex items-center gap-2">
              <span aria-hidden className="text-border">/</span>
              {crumb.active ? (
                <span aria-current="page" className="max-w-[24ch] truncate text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} prefetch={false} className="underline-offset-4 hover:text-foreground hover:underline">
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
