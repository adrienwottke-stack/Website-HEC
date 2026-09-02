import { EmberField } from "./ignition/ember-field";

/**
 * Layers rendered inside the scrub's sticky stage: the ember field above the
 * film and the logo above that. The logo scales out and fades as the journey
 * starts (driven by the engine's --ss-progress custom property in CSS), so
 * the film's ring takes over exactly where the logo's ring was.
 */
export function HeroStage() {
  return (
    <>
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
    </>
  );
}
