/*
 * HEC ignition sequence: comet -> fireball -> impact -> burst.
 * Pure Canvas 2D, additive blending, sprite-based particles. No React, and no
 * browser globals at module scope: everything happens inside run functions
 * that are only ever called from effects.
 */

export interface IgnitionCallbacks {
  onImpact?: () => void;
  onDone?: () => void;
}

export interface IgnitionHandle {
  skip: () => void;
  destroy: () => void;
  /** True once the first animation frame has run. */
  started: () => boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  ttl: number;
  size: number;
  sprite: number;
  drag: number;
}

const GROUND = "#070606";
const TAU = Math.PI * 2;

// [inner, outer] gradient stops per sprite: 0 core, 1 hot, 2 orange, 3 red.
const SPRITE_STOPS: Array<[string, string]> = [
  ["rgba(255,244,224,1)", "rgba(255,211,107,0.55)"],
  ["rgba(255,211,107,1)", "rgba(255,122,26,0.5)"],
  ["rgba(255,122,26,1)", "rgba(255,46,20,0.45)"],
  ["rgba(255,46,20,1)", "rgba(110,8,0,0.35)"],
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInCubic = (x: number) => x * x * x;
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInQuad = (x: number) => x * x;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function makeSprite(inner: string, outer: string, size = 96): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  if (g) {
    const r = size / 2;
    const grad = g.createRadialGradient(r, r, 0, r, r, r);
    grad.addColorStop(0, inner);
    grad.addColorStop(0.28, outer);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  return c;
}

function pickBurstSprite(): number {
  const r = Math.random();
  if (r < 0.1) return 0;
  if (r < 0.4) return 1;
  if (r < 0.8) return 2;
  return 3;
}

export function runIgnition(
  canvas: HTMLCanvasElement,
  mobile: boolean,
  cb: IgnitionCallbacks,
): IgnitionHandle {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    cb.onImpact?.();
    cb.onDone?.();
    return { skip() {}, destroy() {}, started: () => true };
  }

  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
  let W = 1;
  let H = 1;
  const resize = () => {
    W = Math.max(1, window.innerWidth);
    H = Math.max(1, window.innerHeight);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  };
  resize();
  window.addEventListener("resize", resize);

  const speed = mobile ? 0.8 : 1;
  const T = {
    enterEnd: 900 * speed,
    impact: 1600 * speed,
    settleEnd: 2350 * speed,
    fadeEnd: 2650 * speed,
  };
  const sprites = SPRITE_STOPS.map(([a, b]) => makeSprite(a, b));
  const particles: Particle[] = [];
  const maxParticles = mobile ? 420 : 900;

  let start = 0;
  let last = 0;
  let offset = 0;
  let impacted = false;
  let done = false;
  let raf = 0;
  let guard = 0;

  // Hard wall-clock cap: whatever happens to animation frames (throttled or
  // paused tabs, embedded previews), the intro never outlives its timeline by
  // more than a few seconds. While the tab is hidden the cap is re-armed so the
  // sequence can still play once the visitor comes back.
  const finish = () => {
    if (done) return;
    if (!impacted) {
      impacted = true;
      cb.onImpact?.();
    }
    done = true;
    window.cancelAnimationFrame(raf);
    cb.onDone?.();
  };
  const armGuard = () => {
    guard = window.setTimeout(() => {
      if (done) return;
      if (document.visibilityState !== "visible") {
        armGuard();
        return;
      }
      finish();
    }, T.fadeEnd + 3000);
  };
  armGuard();

  const unit = () => Math.min(W, H) / 900;
  const bez = (p: number) => {
    // Quadratic curve from off-screen top-left through an arc to dead center.
    const p0x = -0.12 * W;
    const p0y = -0.18 * H;
    const cx = 0.3 * W;
    const cy = 0.02 * H;
    const p1x = 0.5 * W;
    const p1y = 0.5 * H;
    const q = 1 - p;
    return {
      x: q * q * p0x + 2 * q * p * cx + p * p * p1x,
      y: q * q * p0y + 2 * q * p * cy + p * p * p1y,
    };
  };

  const spawn = (
    n: number,
    x: number,
    y: number,
    speedMin: number,
    speedMax: number,
    ttlMin: number,
    ttlMax: number,
    sizeMin: number,
    sizeMax: number,
    sprite: number | null,
    drag: number,
    dirX = 0,
    dirY = 0,
    spread = TAU,
  ) => {
    for (let i = 0; i < n; i += 1) {
      if (particles.length >= maxParticles) return;
      const base = spread >= TAU ? 0 : Math.atan2(dirY, dirX);
      const angle = spread >= TAU ? rand(0, TAU) : base + rand(-spread / 2, spread / 2);
      const s = rand(speedMin, speedMax);
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * s,
        vy: Math.sin(angle) * s,
        age: 0,
        ttl: rand(ttlMin, ttlMax),
        size: rand(sizeMin, sizeMax),
        sprite: sprite ?? pickBurstSprite(),
        drag,
      });
    }
  };

  const drawSprite = (index: number, x: number, y: number, size: number, alpha: number) => {
    const sprite = sprites[index];
    if (!sprite || size <= 0 || alpha <= 0) return;
    ctx.globalAlpha = Math.min(1, alpha);
    ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
  };

  const burst = () => {
    const u = unit();
    spawn(mobile ? 180 : 400, W / 2, H / 2, 180 * u, 980 * u, 450, 1000, 6 * u, 30 * u, null, 0.93);
    spawn(mobile ? 30 : 70, W / 2, H / 2, 1100 * u, 1900 * u, 300, 540, 3 * u, 7 * u, 0, 0.97);
  };

  const drawFireball = (t: number) => {
    const u = unit();
    const p = t / T.impact;
    const enterFrac = T.enterEnd / T.impact;
    const travel =
      p < enterFrac
        ? easeInCubic(p / enterFrac) * 0.72
        : 0.72 + 0.28 * easeOutCubic((p - enterFrac) / (1 - enterFrac));
    const pos = bez(travel);
    const prev = bez(Math.max(0, travel - 0.015));
    const dx = pos.x - prev.x;
    const dy = pos.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;

    let R: number;
    if (t < T.enterEnd) {
      R = (4 + 10 * (t / T.enterEnd)) * u;
    } else {
      const g = (t - T.enterEnd) / (T.impact - T.enterEnd);
      const target = 0.19 * Math.min(W, H);
      R = 14 * u + (target - 14 * u) * easeInQuad(g);
    }

    // Trail: embers thrown backwards along the path.
    const emit = t < T.enterEnd ? 3 : 7;
    spawn(
      emit,
      pos.x,
      pos.y,
      40 * u,
      260 * u,
      260,
      700,
      Math.max(3 * u, R * 0.35),
      Math.max(6 * u, R * 0.9),
      t < T.enterEnd ? 1 : 2,
      0.96,
      -dx / len,
      -dy / len,
      0.9,
    );

    // Body: wide halo, three roiling lobes, hot core, corona blobs.
    drawSprite(3, pos.x, pos.y, R * 5.2, 0.55);
    for (let i = 0; i < 3; i += 1) {
      const wx = Math.sin(t * 0.011 + i * 2.1) * R * 0.2;
      const wy = Math.cos(t * 0.013 + i * 1.7) * R * 0.2;
      drawSprite(2, pos.x + wx, pos.y + wy, R * 3.1, 0.5);
    }
    drawSprite(1, pos.x, pos.y, R * 2.05, 0.9);
    drawSprite(0, pos.x - (dx / len) * R * 0.15, pos.y - (dy / len) * R * 0.15, R * 1.15, 1);
    if (t > T.enterEnd) {
      for (let k = 0; k < 8; k += 1) {
        const a = t * 0.004 + (k * TAU) / 8;
        const r = R * (0.75 + 0.22 * Math.sin(t * 0.02 + k));
        drawSprite(2, pos.x + Math.cos(a) * r, pos.y + Math.sin(a) * r, R * 1.25, 0.35);
      }
    }
  };

  const drawImpact = (t: number) => {
    const s = t - T.impact;
    const u = unit();
    const cx = W / 2;
    const cy = H / 2;

    // Flash: white for the first frames, then red, then gone.
    const fk = clamp01(s / (170 * speed));
    if (fk < 1) {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = (1 - fk) * (1 - fk);
      ctx.fillStyle = fk < 0.3 ? "#fff4e0" : "#ff2e14";
      ctx.fillRect(-30, -30, W + 60, H + 60);
      ctx.globalCompositeOperation = "lighter";
    }

    // Shockwave: a wide soft ring plus a thin hot edge, both expanding.
    const wk = clamp01(s / (700 * speed));
    if (wk < 1) {
      const r = easeOutCubic(wk) * Math.hypot(W, H) * 0.72;
      ctx.globalAlpha = (1 - wk) * 0.85;
      ctx.lineWidth = (46 * (1 - wk) + 2) * u;
      ctx.strokeStyle = "#ff7a1a";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = (1 - wk) * 0.95;
      ctx.lineWidth = 3 * u;
      ctx.strokeStyle = "#ffd36b";
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.96, 0, TAU);
      ctx.stroke();
    }

    // Afterglow at the impact point, cooling down.
    const ak = clamp01(s / (950 * speed));
    if (ak < 1) {
      const base = Math.min(W, H);
      drawSprite(2, cx, cy, base * (0.95 - 0.5 * ak), (1 - ak) * 0.8);
      drawSprite(0, cx, cy, base * 0.38 * (1 - ak), 1 - ak);
    }
  };

  const stepParticles = (dt: number) => {
    const k = dt / 16.67;
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i];
      if (!p) continue;
      p.age += dt;
      if (p.age >= p.ttl) {
        particles[i] = particles[particles.length - 1] as Particle;
        particles.pop();
        continue;
      }
      const dragK = Math.pow(p.drag, k);
      p.vx *= dragK;
      p.vy *= dragK;
      p.x += (p.vx * dt) / 1000;
      p.y += (p.vy * dt) / 1000;
      const life = 1 - p.age / p.ttl;
      drawSprite(p.sprite, p.x, p.y, p.size * (0.55 + 0.45 * life), life);
    }
  };

  const frame = (now: number) => {
    if (done) return;
    if (!start) {
      start = now;
      last = now;
    }
    const dt = Math.min(48, now - last);
    last = now;
    const t = now - start + offset;

    if (!impacted && t >= T.impact) {
      impacted = true;
      burst();
      cb.onImpact?.();
    }

    // Camera shake right after impact, decaying quadratically.
    let sx = 0;
    let sy = 0;
    if (impacted) {
      const k = Math.max(0, 1 - (t - T.impact) / (420 * speed));
      const amp = 11 * unit() * k * k;
      sx = rand(-amp, amp);
      sy = rand(-amp, amp);
    }
    ctx.setTransform(dpr, 0, 0, dpr, sx * dpr, sy * dpr);

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.fillStyle = GROUND;
    ctx.fillRect(-30, -30, W + 60, H + 60);
    ctx.globalCompositeOperation = "lighter";

    if (t < T.impact) {
      drawFireball(t);
    } else {
      drawImpact(t);
    }
    stepParticles(dt);

    if (t >= T.settleEnd) {
      const fade = clamp01((t - T.settleEnd) / (T.fadeEnd - T.settleEnd));
      canvas.style.opacity = String(1 - fade);
    }

    if (t >= T.fadeEnd) {
      window.clearTimeout(guard);
      finish();
      return;
    }
    raf = window.requestAnimationFrame(frame);
  };

  raf = window.requestAnimationFrame(frame);

  return {
    skip() {
      if (done) return;
      const now = performance.now();
      const t = start ? now - start + offset : 0;
      if (!impacted) {
        offset += T.impact - t;
      } else if (t < T.settleEnd) {
        offset += T.settleEnd - t;
      }
    },
    destroy() {
      done = true;
      window.clearTimeout(guard);
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      particles.length = 0;
    },
    started: () => start > 0,
  };
}

/* ------------------------------------------------------------------------ */
/* Ambient ember field for the hero stage (after the intro). Cheap: ~30      */
/* sprites drifting upward, pulled toward the pointer, pushed by scrolling.  */
/* ------------------------------------------------------------------------ */

export interface EmberHandle {
  destroy: () => void;
}

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  sprite: number;
  phase: number;
  alpha: number;
}

export function runEmberField(canvas: HTMLCanvasElement, mobile: boolean): EmberHandle {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {} };

  const sprites = SPRITE_STOPS.map(([a, b]) => makeSprite(a, b, 64));
  const count = mobile ? 18 : 34;
  const embers: Ember[] = [];
  let W = 1;
  let H = 1;
  let raf = 0;
  let last = 0;
  let running = true;
  let visible = true;
  let pointerX = -1;
  let pointerY = -1;
  let lastScroll = 0;
  let scrollPush = 0;

  const resize = () => {
    const rect = canvas.parentElement?.getBoundingClientRect();
    W = Math.max(1, Math.round(rect?.width ?? window.innerWidth));
    H = Math.max(1, Math.round(rect?.height ?? window.innerHeight));
    canvas.width = W;
    canvas.height = H;
  };

  const seed = (e: Ember, fromBottom: boolean) => {
    e.x = rand(0, W);
    e.y = fromBottom ? H + rand(0, 40) : rand(0, H);
    e.vx = rand(-6, 6);
    e.vy = -rand(10, 34);
    e.size = rand(3, 9);
    e.sprite = Math.random() < 0.65 ? 2 : 3;
    e.phase = rand(0, TAU);
    e.alpha = rand(0.3, 0.8);
  };

  resize();
  for (let i = 0; i < count; i += 1) {
    const e: Ember = { x: 0, y: 0, vx: 0, vy: 0, size: 0, sprite: 2, phase: 0, alpha: 0 };
    seed(e, false);
    embers.push(e);
  }
  lastScroll = window.scrollY;

  const onPointer = (ev: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointerX = ev.clientX - rect.left;
    pointerY = ev.clientY - rect.top;
  };
  const onLeave = () => {
    pointerX = -1;
    pointerY = -1;
  };
  const onVisibility = () => {
    running = !document.hidden;
    if (running && !raf) {
      last = 0;
      raf = window.requestAnimationFrame(frame);
    }
  };

  const observer =
    typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver((entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
          if (visible && !raf && running) {
            last = 0;
            raf = window.requestAnimationFrame(frame);
          }
        })
      : null;
  observer?.observe(canvas);

  const frame = (now: number) => {
    raf = 0;
    if (!running || !visible) return;
    if (!last) last = now;
    const dt = Math.min(48, now - last);
    last = now;

    const sy = window.scrollY;
    scrollPush = scrollPush * 0.9 + Math.min(60, Math.abs(sy - lastScroll)) * 0.6;
    lastScroll = sy;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    const hasPointer = pointerX >= 0 && pointerY >= 0;
    for (const e of embers) {
      if (hasPointer) {
        const dx = pointerX - e.x;
        const dy = pointerY - e.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 260 * 260) {
          const pull = (1 - Math.sqrt(d2) / 260) * 40;
          e.vx += (dx / Math.max(1, Math.sqrt(d2))) * pull * (dt / 1000);
          e.vy += (dy / Math.max(1, Math.sqrt(d2))) * pull * (dt / 1000);
        }
      }
      e.vx *= 0.995;
      e.vy = e.vy * 0.995 - scrollPush * 0.02;
      e.x += (e.vx + Math.sin(now * 0.001 + e.phase) * 6) * (dt / 1000);
      e.y += (e.vy - scrollPush * 3) * (dt / 1000);
      if (e.y < -20 || e.x < -20 || e.x > W + 20) seed(e, true);
      const flicker = 0.75 + 0.25 * Math.sin(now * 0.006 + e.phase);
      ctx.globalAlpha = e.alpha * flicker;
      const sprite = sprites[e.sprite];
      if (sprite) ctx.drawImage(sprite, e.x - e.size, e.y - e.size, e.size * 2, e.size * 2);
    }

    raf = window.requestAnimationFrame(frame);
  };

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerleave", onLeave);
  document.addEventListener("visibilitychange", onVisibility);
  raf = window.requestAnimationFrame(frame);

  return {
    destroy() {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
