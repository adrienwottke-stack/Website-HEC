interface OrbitLinkProps {
  href: string;
  children: string;
}

/**
 * CTA garment 2: a mono text link whose spark travels one full orbit around a
 * ring glyph while the ring traces itself in the accent color.
 */
export function OrbitLink({ href, children }: OrbitLinkProps) {
  return (
    <a className="hec-orbit" href={href} target="_blank" rel="noopener noreferrer">
      <span className="hec-orbit__glyph" aria-hidden="true">
        <svg className="hec-orbit__ring" viewBox="0 0 46 46" focusable="false">
          <circle cx="23" cy="23" r="20" />
        </svg>
        <svg className="hec-orbit__trace" viewBox="0 0 46 46" focusable="false">
          <circle cx="23" cy="23" r="20" />
        </svg>
        <span className="hec-orbit__dot" />
      </span>
      <span className="hec-orbit__label">{children}</span>
    </a>
  );
}
