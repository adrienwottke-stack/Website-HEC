import { useEffect, useRef } from "react";

import { runEmberField } from "./ignition-engine";

/**
 * Ambient ember field for the hero stage. Renders a plain canvas on the server
 * and only starts drawing inside an effect; reduced-motion users get nothing.
 */
export function EmberField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mobile = window.matchMedia("(max-width: 860px), (pointer: coarse)").matches;
    const handle = runEmberField(canvas, mobile);
    return () => handle.destroy();
  }, []);

  return <canvas ref={canvasRef} className="hec-embers" aria-hidden="true" />;
}
