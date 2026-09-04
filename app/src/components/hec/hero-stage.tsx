import { EmberField } from "./ignition/ember-field";

/**
 * Layers rendered inside the scrub's sticky stage, bottom to top: the stage
 * scrim (darkens the copy side of the film, driven by journey.tsx), the ember
 * field, the logo, and the impact flash. The hero chapter carries no film, so
 * the logo holds on the black stage and only burns out towards the end of the
 * chapter (driven by the engine's --ss-progress custom property in CSS),
 * right before the meteor film fades in underneath it. The flash sits under
 * the chapter copy on purpose: the story layer is above the whole stage, so
 * "Rein oder raus." stays readable through the hit.
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
          <source srcSet="/assets/logo/hec-logo-cut.webp" type="image/webp" />
          <img
            src="/assets/logo/hec-logo-cut.png"
            alt="HEC, High Energy Circle: roter Plasma-Ring um die Buchstaben HEC"
            width={896}
            height={896}
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      </div>
      <div className="hec-impact-flash" aria-hidden="true" />
    </>
  );
}
