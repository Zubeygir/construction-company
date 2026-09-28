"use client";

import { useEffect, useRef, useState } from "react";
import { SanityImage } from "@/components/ui/SanityImage";
import { cn } from "@/lib/utils";
import type { SanityImage as SanityImageType } from "@/types";
import { STAGE_COUNT, useStoryStore, type StoryState } from "./StoryScroller";
import type { StoryScene } from "./scene";

interface StoryModelProps {
  fallbackImage?: SanityImageType;
  label: string;
}

// Mobile eases to each stage's end state as its block arrives; desktop scrubs continuously (docs/DESIGN.md).
function targetFor(state: StoryState, mobile: boolean) {
  if (!mobile) return state.progress;
  return state.progress === 0 ? 0 : (state.stage + 1) / STAGE_COUNT;
}

export function StoryModel({ fallbackImage, label }: StoryModelProps) {
  const store = useStoryStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let scene: StoryScene | undefined;
    let cancelled = false;
    const cleanups: (() => void)[] = [];
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    async function load() {
      try {
        // three.js is fetched only when the section approaches the viewport
        const { createStoryScene } = await import("./scene");
        if (cancelled || !canvas || !container) return;
        scene = createStoryScene(canvas, { mobile, reducedMotion });
      } catch (error) {
        // No WebGL: the still photograph stays; stage data is plain HTML either way
        if (process.env.NODE_ENV !== "production") console.error("Construction Story model failed to start", error);
        return;
      }

      const current = scene;
      const resize = () => current.resize(container.clientWidth, container.clientHeight);
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      resize();

      const inView = new IntersectionObserver(([entry]) => current.setActive(entry.isIntersecting));
      inView.observe(container);

      current.setTarget(targetFor(store.get(), mobile));
      const unsubscribe = store.subscribe((state) => current.setTarget(targetFor(state, mobile)));

      cleanups.push(() => resizeObserver.disconnect(), () => inView.disconnect(), unsubscribe);
      setReady(true);
    }

    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        approach.disconnect();
        load();
      },
      { rootMargin: "100% 0px" }
    );
    approach.observe(container);

    return () => {
      cancelled = true;
      approach.disconnect();
      cleanups.forEach((cleanup) => cleanup());
      scene?.dispose();
    };
  }, [store]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {fallbackImage && (
        <div className={cn("absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none", ready && "opacity-0")}>
          <SanityImage image={fallbackImage} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        className={cn(
          "absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 motion-reduce:transition-none",
          ready && "opacity-100"
        )}
      />
    </div>
  );
}
