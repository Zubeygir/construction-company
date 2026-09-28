import { SanityImage } from "@/components/ui/SanityImage";
import { cn } from "@/lib/utils";
import type { SanityImage as SanityImageType } from "@/types";

interface WordmarkProps {
  siteName?: string;
  logo?: SanityImageType;
  className?: string;
}

// Until the SVG logo is uploaded to Site Settings, the site name is set as the nameplate: first word wide and heavy, the rest tracked beneath.
export function Wordmark({ siteName, logo, className }: WordmarkProps) {
  if (logo) {
    return (
      <SanityImage
        image={logo}
        alt={siteName}
        width={400}
        height={120}
        fit="max"
        priority
        className={cn("h-10 w-auto object-contain object-left", className)}
      />
    );
  }

  if (!siteName) return null;
  const [first, ...rest] = siteName.split(" ");

  return (
    <span className={cn("flex flex-col uppercase leading-none", className)}>
      <span className="text-[1.625rem] font-bold tracking-[-0.01em] [font-variation-settings:'wdth'_125]">{first}</span>
      {rest.length > 0 && <span className="mt-1 text-xs font-semibold tracking-[0.04em] [font-variation-settings:'wdth'_112]">{rest.join(" ")}</span>}
    </span>
  );
}
