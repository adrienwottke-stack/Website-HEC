interface ImpactCtaProps {
  href: string;
  children: string;
}

/**
 * CTA garment 3: the impact plate. A block carrying the crater ring as its
 * plate; the whole block shears and the plate re-grades on hover. Lives in the
 * final chapter, where the meteor hits.
 */
export function ImpactCta({ href, children }: ImpactCtaProps) {
  return (
    <a className="hec-impact" href={href} target="_blank" rel="noopener noreferrer">
      <span
        className="hec-impact__plate"
        style={{ backgroundImage: "url(/assets/plates/ring.webp)" }}
        aria-hidden="true"
      />
      <span className="hec-impact__label">{children}</span>
      <svg className="hec-impact__arrow" viewBox="0 0 28 14" aria-hidden="true" focusable="false">
        <path d="M0 7h26M20 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </a>
  );
}
