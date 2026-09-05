import { EmberField } from "./ignition/ember-field";

/**
 * Layers rendered inside the scrub's sticky stage, bottom to top: the stage
 * scrim (darkens the copy side of the frame, driven by journey.tsx), the ember
 * field, and the impact flash. The hero's own image is a scene poster like
 * every other chapter's, so the engine crossfades it; the brand ring is no
 * longer staged here at all — it sits small in the nav, the favicon and the
 * join CTA. The flash sits under the chapter copy on purpose: the story layer
 * is above the whole stage, so "Rein oder raus." stays readable through the
 * hit.
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
      <div className="hec-impact-flash" aria-hidden="true" />
    </>
  );
}
