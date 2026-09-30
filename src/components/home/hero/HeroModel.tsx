"use client";

import { useEffect, useRef, useState } from "react";
import { SanityImage } from "@/components/ui/SanityImage";
import { cn } from "@/lib/utils";
import type { SanityImage as SanityImageType } from "@/types";
import type { HeroScene } from "./heroScene";

interface HeroModelProps {
  label?: string;
  fallbackImage?: SanityImageType;
}

// The finished model at night (docs/DESIGN.md → Hero). Time-based, never scroll-driven; renders only while in view.
export function HeroModel({ label, fallbackImage }: HeroModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let scene: HeroScene | undefined;
    let cancelled = false;
    const cleanups: (() => void)[] = [];

    async function load() {
      try {
        const { createHeroScene } = await import("./heroScene");
        if (cancelled || !canvas || !container) return;
        const created = await createHeroScene(canvas, {
          mobile: window.matchMedia("(max-width: 1023px)").matches,
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          introSeen: document.documentElement.dataset.intro === "seen",
        });
        if (cancelled) return created.dispose();
        scene = created;
      } catch (error) {
        if (process.env.NODE_ENV !== "production") console.error("Hero model failed to start", error);
        setState("failed");
        return;
      }

      const current = scene;
      const resize = () => current.resize(container.clientWidth, container.clientHeight);
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      resize();

      const inView = new IntersectionObserver(([entry]) => current.setActive(entry.isIntersecting));
      inView.observe(container);
      cleanups.push(() => resizeObserver.disconnect(), () => inView.disconnect());

      if (window.matchMedia("(pointer: fine)").matches) {
        const onPointer = (event: PointerEvent) =>
          current.setPointer((event.clientX / window.innerWidth) * 2 - 1, 1 - (event.clientY / window.innerHeight) * 2);
        window.addEventListener("pointermove", onPointer, { passive: true });
        cleanups.push(() => window.removeEventListener("pointermove", onPointer));
      }
      setState("ready");
    }

    // Wait until the page is idle, so building the model never competes with the first paint and early input
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => load(), { timeout: 1500 })
      : window.setTimeout(() => load(), 300);
    cleanups.push(() => (window.cancelIdleCallback ? window.cancelIdleCallback(idle) : window.clearTimeout(idle)));

    return () => {
      cancelled = true;
      cleanups.forEach((cleanup) => cleanup());
      scene?.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* No WebGL: the hero photograph takes the model's place */}
      {state === "failed" && fallbackImage && (
        <SanityImage image={fallbackImage} fill priority sizes="100vw" className="object-cover" />
      )}
      <canvas
        ref={canvasRef}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={cn(
          "absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 ease-out-quart motion-reduce:transition-none",
          state === "ready" && "opacity-100"
        )}
      />
    </div>
  );
}
