import { useEffect, useRef } from "react";

interface HeroCtaProps {
  href: string;
  children: string;
}

/**
 * CTA garment 1: viewfinder brackets that close around the label on hover,
 * with a magnetic pull toward the pointer (pointer devices only, no springs
 * library needed: one RAF-driven lerp on the transform).
 *
 * The pointer handler never touches layout: the anchor's rect is measured at
 * most once per animation frame (after scroll/resize) and the whole magnet
 * sleeps while the hero is off screen.
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
    let measureRaf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let inView = true;
    let rect: DOMRect | null = null;

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

    const measure = () => {
      measureRaf = 0;
      rect = inView ? el.getBoundingClientRect() : null;
    };
    const scheduleMeasure = () => {
      if (!measureRaf) measureRaf = window.requestAnimationFrame(measure);
    };

    const release = () => {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = window.requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (!inView || !rect) return;
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

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((entries) => {
            inView = entries.some((entry) => entry.isIntersecting);
            if (inView) {
              scheduleMeasure();
            } else {
              rect = null;
              release();
            }
          })
        : null;
    observer?.observe(el);

    scheduleMeasure();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      if (raf) window.cancelAnimationFrame(raf);
      if (measureRaf) window.cancelAnimationFrame(measureRaf);
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
