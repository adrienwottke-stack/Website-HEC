import { CTA_LABEL } from "@/hec-content";

interface FinalBandProps {
  href: string;
  plate?: string;
}

/** CTA garment 3: the whole band is the link. It shears and the ring plate
 * re-grades on hover. */
export function FinalBand({ href, plate }: FinalBandProps) {
  return (
    <a className="hec-band" href={href} target="_blank" rel="noopener noreferrer" id="rein">
      {plate ? (
        <span
          className="hec-band__plate"
          style={{ backgroundImage: `url(${plate})` }}
          aria-hidden="true"
        />
      ) : null}
      <h2 className="hec-band__title">Rein oder raus.</h2>
      <p className="hec-band__text">
        Ein Klick, dann bist du in der Gruppe. Der nächste Termin steht drin.
      </p>
      <span className="hec-band__cta">
        {CTA_LABEL}
        <svg viewBox="0 0 28 14" aria-hidden="true" focusable="false">
          <path d="M0 7h26M20 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
    </a>
  );
}
