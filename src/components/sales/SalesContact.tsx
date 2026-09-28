import { RiPhoneLine } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import { SanityImage } from "@/components/ui/SanityImage";
import { Button } from "@/components/ui/button";
import { telHref, whatsappHref } from "@/lib/project";
import { cn } from "@/lib/utils";
import type { SalesOffice } from "@/types";

interface SalesContactProps {
  salesOffice: SalesOffice;
  tone?: "default" | "onCypress";
  className?: string;
}

// The named person behind the sales office: photo, name, a large dialable number, and the one lamp CTA.
export function SalesContact({ salesOffice, tone = "default", className }: SalesContactProps) {
  const { contactName, contactRole, photo, phone, whatsappNumber, workingHours, ctaLabel, whatsappLabel } = salesOffice;
  const onCypress = tone === "onCypress";

  return (
    <div className={cn("flex flex-col gap-8 sm:flex-row sm:items-start", className)}>
      {photo && (
        <div className={cn("relative aspect-[4/5] w-32 shrink-0 overflow-hidden sm:w-40", onCypress ? "bg-cypress-deep" : "bg-surface")}>
          <SanityImage image={photo} alt={contactName} fill sizes="10rem" className="object-cover" />
        </div>
      )}

      <div className="flex flex-col">
        {contactName && <p className="type-title">{contactName}</p>}
        {contactRole && <p className={onCypress ? "text-on-cypress-muted" : "text-muted-foreground"}>{contactRole}</p>}
        {phone && (
          <a
            href={telHref(phone)}
            className={cn(
              "type-headline mt-5 tabular-nums underline-offset-[6px] decoration-2 hover:underline",
              onCypress && "focus-visible:outline-on-cypress"
            )}
          >
            {phone}
          </a>
        )}
        {workingHours && <p className={cn("mt-2", onCypress ? "text-on-cypress-muted" : "text-muted-foreground")}>{workingHours}</p>}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {phone && ctaLabel && (
            <Button
              variant="lamp"
              size="lg"
              className={onCypress ? "focus-visible:outline-on-cypress" : undefined}
              render={<a href={telHref(phone)} />}
            >
              <RiPhoneLine aria-hidden />
              {ctaLabel}
            </Button>
          )}
          {whatsappNumber && whatsappLabel && (
            <Button
              variant={onCypress ? "onCypress" : "outline"}
              size="lg"
              render={<a href={whatsappHref(whatsappNumber)} target="_blank" rel="noopener noreferrer" />}
            >
              <FaWhatsapp aria-hidden />
              {whatsappLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
