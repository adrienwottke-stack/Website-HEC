/** The HEC ring quoted as a small mark: a broken plasma ring with one spark. */
export function RingMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle
        cx="16"
        cy="16"
        r="11"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="52 17"
        transform="rotate(-40 16 16)"
      />
      <circle cx="26.5" cy="8.5" r="2.2" fill="currentColor" />
    </svg>
  );
}
