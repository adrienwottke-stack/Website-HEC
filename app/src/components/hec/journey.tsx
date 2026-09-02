import { useCallback, useRef } from "react";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

import { HeroStage } from "./hero-stage";

/** Index of the chapter where the meteor hits (scroll-scrub-scenes.tsx). */
const IMPACT_CHAPTER = 4;

/**
 * The journey plus the one DOM-level cue the film cannot carry alone: when the
 * impact chapter becomes active for the first time, the page flashes and the
 * stage shakes (CSS keyframes keyed on html[data-impact]). The scrub engine
 * still owns media time; this only reacts to its active-section callback.
 */
export function Journey() {
  const fired = useRef(false);

  const onActive = useCallback((index: number) => {
    if (index !== IMPACT_CHAPTER || fired.current) return;
    fired.current = true;
    const root = document.documentElement;
    root.dataset.impact = "1";
    window.setTimeout(() => {
      delete root.dataset.impact;
    }, 1500);
  }, []);

  return (
    <>
      <div className="hec-impact-flash" aria-hidden="true" />
      <ScrollScrub
        className="hec-journey"
        scenes={scrollScrubScenes}
        theme={scrollScrubTheme}
        stageChildren={<HeroStage />}
        onActiveSectionChange={onActive}
      />
    </>
  );
}
