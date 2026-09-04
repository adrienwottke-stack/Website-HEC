import { useCallback, useRef } from "react";
import type { CSSProperties } from "react";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

import { HeroStage } from "./hero-stage";

/** Index of the chapter where the meteor hits (scroll-scrub-scenes.tsx). */
const IMPACT_CHAPTER = 4;

type WrapStyle = CSSProperties & Record<`--hec-${string}`, string | number>;

const firstScene = scrollScrubScenes[0];

/** The hero chapter's share of the whole journey (its scroll weight over the
 * sum of all weights). hec.css turns the engine's global --ss-progress into
 * hero-local progress with it, so the logo burn-out is timed to the chapter
 * no matter how the other chapters are weighted. */
const totalWeight = scrollScrubScenes.reduce((sum, scene) => sum + (scene.scroll ?? 1.4), 0);
const heroShare = (firstScene.scroll ?? 1.4) / totalWeight;

const initialStyle: WrapStyle = {
  "--hec-scrim": firstScene.scrim,
  "--hec-hero-share": heroShare.toFixed(4),
};

/**
 * The journey plus the two DOM-level cues the film cannot carry alone, both
 * keyed on the engine's active-section callback and written to this wrapper
 * (never to <html>, so nothing outside the journey is re-matched):
 *
 * - data-copy-side + --hec-scrim: which side of the frame the active
 *   chapter's copy sits on and how hard the stage scrim darkens it.
 * - data-impact: when the impact chapter becomes active for the first time,
 *   the stage flashes and the film shakes once (CSS keyframes in hec.css).
 *
 * The scrub engine still owns media time.
 */
export function Journey() {
  const wrap = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  const onActive = useCallback((index: number) => {
    const el = wrap.current;
    const scene = scrollScrubScenes[index];
    if (!el || !scene) return;
    el.dataset.copySide = scene.align ?? "left";
    el.style.setProperty("--hec-scrim", String(scene.scrim));

    if (index !== IMPACT_CHAPTER || fired.current) return;
    fired.current = true;
    el.dataset.impact = "1";
    window.setTimeout(() => {
      delete el.dataset.impact;
    }, 1500);
  }, []);

  return (
    <div
      ref={wrap}
      className="hec-journey-wrap"
      data-copy-side={firstScene.align ?? "left"}
      style={initialStyle}
    >
      <ScrollScrub
        className="hec-journey"
        scenes={scrollScrubScenes}
        theme={scrollScrubTheme}
        stageChildren={<HeroStage />}
        onActiveSectionChange={onActive}
      />
    </div>
  );
}
