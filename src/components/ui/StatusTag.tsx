import { statusLabel, type ProjectStatus } from "@/lib/project";
import { cn } from "@/lib/utils";

// Only "Satışta" carries the lamp: an available home is something alive (The One Lamp Rule). The word, not the color, carries the meaning.
export function StatusTag({ status, className }: { status: ProjectStatus; className?: string }) {
  return (
    <span
      className={cn(
        "type-label inline-flex items-center rounded-sm px-2 py-1 uppercase",
        status === "satista" ? "bg-lamp text-cypress-deep" : "bg-surface text-foreground",
        className
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
