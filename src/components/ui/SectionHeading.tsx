import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "center" | "left";
  tone?: "default" | "onCypress";
  id?: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = "left",
  tone = "default",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl text-left",
        className
      )}
    >
      {eyebrow && (
        <span className={cn("type-label mb-3 inline-block", tone === "onCypress" ? "text-on-cypress-muted" : "text-muted-foreground")}>
          {eyebrow}
        </span>
      )}
      <h2 id={id} className={cn("type-headline", tone === "onCypress" ? "text-on-cypress" : "text-foreground")}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-4 max-w-[60ch]", tone === "onCypress" ? "text-on-cypress-muted" : "text-muted-foreground")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
