import { useEffect, useRef } from "react";

import { runIgnition } from "./ignition-engine";

interface IgnitionIntroProps {
  onImpact: () => void;
  onDone: () => void;
}

/**
 * The load-time ignition overlay. Client-only by construction: it is loaded
 * through React.lazy from the gate and only ever mounts after hydration.
 */
export default function IgnitionIntro({ onImpact, onDone }: IgnitionIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const callbacks = useRef({ onImpact, onDone });
  callbacks.current = { onImpact, onDone };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mobile = window.matchMedia("(max-width: 860px), (pointer: coarse)").matches;
    const handle = runIgnition(canvas, mobile, {
      onImpact: () => callbacks.current.onImpact(),
      onDone: () => callbacks.current.onDone(),
    });
    const skip = () => handle.skip();
    window.addEventListener("pointerdown", skip, { passive: true });
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      handle.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} className="hec-ignition" aria-hidden="true" />;
}
