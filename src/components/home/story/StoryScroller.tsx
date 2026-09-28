"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const STAGE_COUNT = 4;
const DUSK_STAGE = STAGE_COUNT - 1;
// Share of the viewport height the last stage scrolls through to complete (all windows lit)
const HANDOVER_SCROLL = 0.3;

export interface StoryState {
  // Continuous 0..1 across all stages (desktop scrubbing)
  progress: number;
  // Index of the stage block under the reading line
  stage: number;
}

type Listener = (state: StoryState) => void;

// A tiny external store: the 3D model reads scroll state on every frame without re-rendering React.
function createStoryStore() {
  let state: StoryState = { progress: 0, stage: 0 };
  const listeners = new Set<Listener>();
  return {
    get: () => state,
    set(next: StoryState) {
      if (next.progress === state.progress && next.stage === state.stage) return;
      state = next;
      listeners.forEach((listener) => listener(state));
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export type StoryStore = ReturnType<typeof createStoryStore>;

const StoryContext = createContext<StoryStore | null>(null);

export function useStoryStore(): StoryStore {
  const store = useContext(StoryContext);
  if (!store) throw new Error("useStoryStore must be used inside <StoryScroller>");
  return store;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// Native scroll only: reads positions, never intercepts wheel or touch (docs/DESIGN.md → Construction Story).
export function StoryScroller({ children, className }: { children: ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [store] = useState(createStoryStore);
  const [dusk, setDusk] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const stages = [...container.querySelectorAll<HTMLElement>("[data-story-stage]")];
    if (stages.length === 0) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      // The reading line sits a little above the viewport middle, where the eye rests while scrolling
      const line = window.innerHeight * 0.55;
      const tops = stages.map((element) => element.getBoundingClientRect().top);

      let stage = 0;
      tops.forEach((top, index) => {
        if (top <= line) stage = index;
      });

      // Each stage owns an equal share of progress, measured from its top to the next stage's top at the reading line,
      // so the model and the dusk surface change together whatever the block heights. The handover completes within a
      // short scroll, while the model is still pinned.
      const end = stage < tops.length - 1 ? tops[stage + 1] : tops[stage] - window.innerHeight * HANDOVER_SCROLL;
      const local = clamp01((line - tops[stage]) / Math.max(1, end - tops[stage]));
      const progress = (stage + local) / tops.length;

      store.set({ progress, stage });
      setDusk(stage === DUSK_STAGE && tops[0] <= line);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [store]);

  return (
    <StoryContext.Provider value={store}>
      <div ref={containerRef} data-dusk={dusk} className={cn("story-surface", className)}>
        {children}
      </div>
    </StoryContext.Provider>
  );
}
