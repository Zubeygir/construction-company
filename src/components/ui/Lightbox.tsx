"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { RiCloseLine, RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import { SanityImage } from "@/components/ui/SanityImage";
import { urlForImage } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { SanityImage as SanityImageType } from "@/types";

export type LightboxImage = SanityImageType & { _key?: string; caption?: string };

const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

/**
 * Thumbnail'e hover edildiğinde tam boyutlu lightbox görselini önceden yükler.
 * Tarayıcı cache'e aldığı için tıklandığında anında açılır.
 */
export function prefetchLightboxImage(image: SanityImageType) {
  if (typeof window === "undefined" || !image?.asset) return;
  try {
    const url = urlForImage(image)?.auto("format").width(1920).fit("max").quality(90).url();
    if (!url || document.querySelector(`link[href="${url}"]`)) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  } catch {
    // prefetch başarısız olursa sessizce geç
  }
}

interface LightboxProps {
  images: LightboxImage[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
  label: string;
  // Floor plans are usually transparent line drawings; they need a white sheet behind them.
  variant?: "photo" | "plan";
}

// Controlled viewer so galleries and floor-plan lists can share it.
export function Lightbox({ images, index, onIndexChange, label, variant = "photo" }: LightboxProps) {
  const [direction, setDirection] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = index !== null;

  const paginate = useCallback(
    (step: number) => {
      if (index === null) return;
      setDirection(step);
      onIndexChange((index + step + images.length) % images.length);
    },
    [index, images.length, onIndexChange]
  );

  // Focus and scroll lock follow open/close only, so paging does not steal focus back and forth.
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previousFocus?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onIndexChange(null);
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onIndexChange, paginate]);

  const current = index === null ? undefined : images[index];

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence initial={false} custom={direction}>
        {current && index !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
            className="fixed inset-0 z-50 flex flex-col bg-cypress-deep text-on-cypress"
            onClick={() => onIndexChange(null)}
          >
            <div className="page-shell flex h-16 shrink-0 items-center justify-between md:h-20" onClick={(e) => e.stopPropagation()}>
              <p className="type-label tabular-nums text-on-cypress-muted" aria-live="polite">
                {index + 1} / {images.length}
              </p>
              <button
                ref={closeRef}
                type="button"
                aria-label="Kapat"
                onClick={() => onIndexChange(null)}
                className="-mr-2 flex size-11 items-center justify-center focus-visible:outline-on-cypress"
              >
                <RiCloseLine aria-hidden className="size-7" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
                drag={images.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, { offset, velocity }) => {
                  if (offset.x > 80 || velocity.x > 500) paginate(-1);
                  else if (offset.x < -80 || velocity.x < -500) paginate(1);
                }}
                className={cn(
                  "absolute inset-0 mx-4 cursor-grab active:cursor-grabbing md:mx-24",
                  variant === "plan" && "bg-background"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <SanityImage
                  image={current}
                  fill
                  fit="max"
                  quality={90}
                  sizes="100vw"
                  objectFit="contain"
                  className="pointer-events-none select-none"
                />
              </motion.div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Önceki görsel"
                    onClick={(e) => {
                      e.stopPropagation();
                      paginate(-1);
                    }}
                    className="absolute top-1/2 left-4 hidden size-12 -translate-y-1/2 items-center justify-center border border-on-cypress/40 transition-colors hover:bg-cypress focus-visible:outline-on-cypress md:flex"
                  >
                    <RiArrowLeftLine aria-hidden className="size-6" />
                  </button>
                  <button
                    type="button"
                    aria-label="Sonraki görsel"
                    onClick={(e) => {
                      e.stopPropagation();
                      paginate(1);
                    }}
                    className="absolute top-1/2 right-4 hidden size-12 -translate-y-1/2 items-center justify-center border border-on-cypress/40 transition-colors hover:bg-cypress focus-visible:outline-on-cypress md:flex"
                  >
                    <RiArrowRightLine aria-hidden className="size-6" />
                  </button>
                </>
              )}
            </div>

            <div className="page-shell flex min-h-16 shrink-0 items-center py-4 md:min-h-20" onClick={(e) => e.stopPropagation()}>
              {(current.caption || current.alt) && <p className="max-w-[68ch] text-on-cypress-muted">{current.caption || current.alt}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

interface LightboxGalleryProps {
  images: LightboxImage[];
  label: string;
}

// First image leads at double size so the grid never reads as identical tiles.
export function LightboxGallery({ images, label }: LightboxGalleryProps) {
  const [selected, setSelected] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {images.map((image, i) => (
          <li key={image._key ?? i} className={cn(i === 0 && "col-span-2 row-span-2")}>
            <button
              type="button"
              onClick={() => setSelected(i)}
              onMouseEnter={() => prefetchLightboxImage(image)}
              onFocus={() => prefetchLightboxImage(image)}
              aria-label={image.caption || image.alt || `${label} ${i + 1}`}
              className="group relative block aspect-[4/3] h-full w-full overflow-hidden bg-surface"
            >
              <SanityImage
                image={image}
                fill
                sizes={i === 0 ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 30vw, 50vw"}
                className="object-cover transition-transform duration-500 ease-out-quart motion-safe:group-hover:scale-[1.02]"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={selected} onIndexChange={setSelected} label={label} />
    </>
  );
}
