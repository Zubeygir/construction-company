"use client";

import { useState } from "react";
import { RiLayoutMasonryLine } from "react-icons/ri";
import { Lightbox, prefetchLightboxImage, type LightboxImage } from "@/components/ui/Lightbox";
import { UNIT_LABELS, formatArea, formatCount } from "@/lib/project";
import type { UnitType } from "@/types";

function availability(unit: UnitType): string | undefined {
  if (unit.availableCount == null) return undefined;
  if (unit.availableCount === 0) return UNIT_LABELS.soldOut;
  const total = unit.totalCount == null ? "" : ` / ${formatCount(unit.totalCount)}`;
  return `${formatCount(unit.availableCount)}${total} ${UNIT_LABELS.available}`;
}

export function UnitTypes({ units }: { units: UnitType[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  const plans: LightboxImage[] = units.flatMap((unit) =>
    unit.floorPlan ? [{ ...unit.floorPlan, _key: unit._key, caption: `${unit.name} ${UNIT_LABELS.floorPlan.toLocaleLowerCase("tr-TR")}` }] : []
  );

  return (
    <>
      <ul className="border-t border-border">
        {units.map((unit) => {
          const areas = [
            unit.grossArea != null && `${UNIT_LABELS.grossArea} ${formatArea(unit.grossArea)}`,
            unit.netArea != null && `${UNIT_LABELS.netArea} ${formatArea(unit.netArea)}`,
          ].filter(Boolean);
          const available = availability(unit);
          const planIndex = plans.findIndex((plan) => plan._key === unit._key);

          return (
            <li
              key={unit._key}
              className="grid grid-cols-[minmax(5rem,auto)_1fr] items-center gap-x-6 gap-y-3 border-b border-border py-5 md:grid-cols-[8rem_1fr_auto_auto] md:gap-x-10"
            >
              <p className="type-headline tabular-nums text-foreground">{unit.name}</p>
              <p className="tabular-nums text-foreground">{areas.join(" · ")}</p>
              {available ? (
                <p className={`col-start-2 md:col-start-auto ${unit.availableCount === 0 ? "text-muted-foreground" : "font-semibold text-foreground"}`}>
                  {available}
                </p>
              ) : (
                <span aria-hidden className="hidden md:block" />
              )}
              {planIndex >= 0 && unit.floorPlan ? (
                <button
                  type="button"
                  onClick={() => setSelected(planIndex)}
                  onMouseEnter={() => unit.floorPlan && prefetchLightboxImage(unit.floorPlan)}
                  className="col-start-2 inline-flex min-h-11 items-center gap-2 justify-self-start font-semibold text-cypress underline-offset-4 hover:underline md:col-start-auto md:justify-self-end"
                >
                  <RiLayoutMasonryLine aria-hidden className="size-5" />
                  {UNIT_LABELS.floorPlan}
                  <span className="sr-only">: {unit.name}</span>
                </button>
              ) : (
                <span aria-hidden className="hidden md:block" />
              )}
            </li>
          );
        })}
      </ul>
      {plans.length > 0 && <Lightbox images={plans} index={selected} onIndexChange={setSelected} label={UNIT_LABELS.floorPlan} variant="plan" />}
    </>
  );
}
