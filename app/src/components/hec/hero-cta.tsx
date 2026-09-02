import { useEffect, useRef } from "react";

interface HeroCtaProps {
  href: string;
  children: string;
}

/**
 * CTA garment 1: viewfinder brackets that close around the label on hover,
 * with a magnetic pull toward the pointer (pointer devices only, no springs
 * library needed: one RAF-driven lerp on the transform).
 */
export function HeroCta({ href, children }: HeroCtaProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) {
      return;
    }
    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      el.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        raf = window.requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      const radius = 150;
      if (dist < radius) {
        const k = (1 - dist / radius) * 0.35;
        targetX = dx * k;
        targetY = dy * k;
      } else {
        targetX = 0;
        targetY = 0;
      }
      if (!raf) raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, []);

  return (
    <a ref={ref} className="hec-viewfinder" href={href} target="_blank" rel="noopener noreferrer">
      <span className="hec-viewfinder__corner hec-viewfinder__corner--tl" aria-hidden="true" />
      <span className="hec-viewfinder__corner hec-viewfinder__corner--tr" aria-hidden="true" />
      <span className="hec-viewfinder__corner hec-viewfinder__corner--bl" aria-hidden="true" />
      <span className="hec-viewfinder__corner hec-viewfinder__corner--br" aria-hidden="true" />
      <span className="hec-viewfinder__dot" aria-hidden="true" />
      <span className="hec-viewfinder__label">{children}</span>
    </a>
  );
}
