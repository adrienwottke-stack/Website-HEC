import { Suspense, lazy, useCallback, useEffect, useState } from "react";

const IgnitionIntro = lazy(() => import("./ignition-intro"));

const SESSION_KEY = "hec-ignited";

function setIgnitionState(state: "impact" | "done") {
  document.documentElement.dataset.ignition = state;
}

/**
 * Decides whether the ignition intro plays. The inline head script has already
 * armed the veil (html[data-ignition="armed"]) when motion is allowed and the
 * session has not seen the intro; this gate only reads that decision after
 * mount, so SSR renders nothing extra and the finished hero stays complete.
 */
export function IgnitionGate() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.ignition !== "armed") return;
    if (document.hidden) {
      // Opened in a background tab: animation frames are paused there, so
      // show the finished hero instead of leaving the veil standing.
      setIgnitionState("done");
      return;
    }
    setPlay(true);
  }, []);

  const handleImpact = useCallback(() => {
    setIgnitionState("impact");
  }, []);

  const handleDone = useCallback(() => {
    setIgnitionState("done");
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage may be unavailable (private mode); the intro simply replays.
    }
    setPlay(false);
  }, []);

  if (!play) return null;

  return (
    <Suspense fallback={null}>
      <IgnitionIntro onImpact={handleImpact} onDone={handleDone} />
    </Suspense>
  );
}
