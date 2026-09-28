import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SpecItem {
  label: string;
  value?: ReactNode;
}

type Tone = "default" | "onCypress" | "story";

interface SpecListProps {
  items: SpecItem[];
  tone?: Tone;
  className?: string;
}

// "story" follows the Construction Story's dusk variables (src/styles/utilities.css → .story-surface)
const toneClasses: Record<Tone, { line: string; key: string; value: string }> = {
  default: { line: "border-border", key: "text-muted-foreground", value: "text-foreground" },
  onCypress: { line: "border-on-cypress/25", key: "text-on-cypress-muted", value: "text-on-cypress" },
  story: { line: "border-(--story-line)", key: "text-(--story-muted)", value: "text-(--story-fg)" },
};

// Spec-sheet rows in the manner of a site information board. Empty values are dropped, never rendered as "—".
export function SpecList({ items, tone = "default", className }: SpecListProps) {
  const rows = items.filter((item) => Boolean(item.value));
  if (rows.length === 0) return null;
  const classes = toneClasses[tone];

  return (
    <dl className={cn("border-t", classes.line, className)}>
      {rows.map((row) => (
        <div key={row.label} className={cn("grid grid-cols-[minmax(8rem,2fr)_3fr] gap-4 border-b py-3", classes.line)}>
          <dt className={cn("type-label self-center uppercase", classes.key)}>{row.label}</dt>
          <dd className={cn("font-medium", classes.value)}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
