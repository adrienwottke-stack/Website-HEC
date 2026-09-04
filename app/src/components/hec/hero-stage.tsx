import { EmberField } from "./ignition/ember-field";

/**
 * Layers rendered inside the scrub's sticky stage, bottom to top: the stage
 * scrim (darkens the copy side of the film, driven by journey.tsx), the ember
 * field, the logo, and the impact flash. The logo scales out and fades as the
 * journey starts (driven by the engine's --ss-progress custom property in
 * CSS), so the film's ring takes over exactly where the logo's ring was. The
 * flash sits under the chapter copy on purpose: the story layer is above the
 * whole stage, so "Rein oder raus." stays readable through the hit.
 */
export function HeroStage() {
  return (
    <>
      <div className="hec-scrim" aria-hidden="true">
        <div className="hec-scrim__side hec-scrim__side--left" />
        <div className="hec-scrim__side hec-scrim__side--right" />
        <div className="hec-scrim__bottom" />
      </div>
      <EmberField />
      <div className="hec-hero-logo">
        <picture>
          <source srcSet="/assets/logo/hec-logo.webp" type="image/webp" />
          <img
            src="/assets/logo/hec-logo.png"
            alt="HEC, High Energy Circle: roter Plasma-Ring um die Buchstaben HEC"
            width={1024}
            height={1024}
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      </div>
      <div className="hec-impact-flash" aria-hidden="true" />
    </>
  );
}
