import { HERO_PUNCH } from "@/hec-content";

/**
 * The punch cards of the load-time ignition: two short lines that cut in over
 * the flying meteor and are gone the moment it hits, so the impact plants the
 * headline as the answer to the question.
 *
 * Pure CSS on purpose. The whole layer hangs off html[data-ignition="armed"],
 * which the inline head script sets before first paint and the gate replaces
 * with "impact"/"done" — so the cards need no timer of their own, disappear
 * on the frame of the impact, never play for reduced-motion users or repeat
 * visitors (the attribute is never armed for them), and vanish instantly when
 * someone skips the intro by scrolling or tapping.
 *
 * aria-hidden: this is atmosphere. The real message is the server-rendered H1
 * and body copy underneath, which assistive tech reads without the delay.
 */
export function HeroPunch() {
  return (
    <div className="hec-punch" aria-hidden="true">
      <div className="hec-punch__scrim" />
      <div className="hec-punch__stack">
        {HERO_PUNCH.map((line) => (
          <p className="hec-punch__line" key={line}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
