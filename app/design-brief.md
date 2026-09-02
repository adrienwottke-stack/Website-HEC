# HEC (High Energy Circle) — design brief

Live: https://high-energy-circle.higgsfield.app · type: website · template: scroll-scrub · built 2026-09-02

## Design read

Students in Dresden, 18 to 27, arriving on a phone from a WhatsApp or Instagram link. Emotional register: raw, loud, direct. The page has one job: get them into the WhatsApp group. No motivational-poster tone, no filler.

## Concept spine: "Zündung" (ignition)

The site is an ignition sequence. A spark enters, becomes a fireball, hits, explodes, and the circle stands (the logo). From there the visitor's scroll carries them INTO the circle: the film pushes the camera through the plasma ring, and by the last chapter they are inside it, where the join CTA lives. Every element quotes a stage of ignition: hairlines glow like heated wire, readouts tick like a launch console, the final band is the inside of the ring.

## Delivery tier

cinema. Tier-1 = A4 seam-locked scroll scrub (the animated website). Surrounding motion: Lenis weighted scroll, transform-only entrance moves, magnetic hero CTA. Additional load-time layer (not part of the scrub, touches no video): the canvas ignition intro described below.

## Locked palette

Explicit brand colors taken from the user's logo (black void, red-orange plasma ring, chrome-red letters). This overrides the default ban on the near-black + ember family: the brand IS red plasma on black.

- `--hec-ground #070606` warm off-black page ground. The logo PNG has a pure black background and is composited with `mix-blend-mode: screen`, so its black disappears into the ground.
- `--hec-ink #F5EFE8` warm white text.
- `--hec-muted #9A8F88` secondary text.
- `--hec-accent #FF2E14` plasma red, the single UI accent (CTA brackets, ring strokes, readout labels, progress bar).
- `--hec-line #2A1F1C` hairlines; they "heat" to the accent on hover.
- Heat hexes used ONLY inside generated media and the canvas fire, never as UI accents: `#FF7A1A`, `#FFD36B`, core `#FFF4E0`.

Defense: one accent, one ground, one theme. Everything red on the page is either the logo's own light or the one CTA intent.

## Locked type

- Display: Satoshi Variable, weight 900, italic, uppercase, `letter-spacing -0.03em`, line-height 0.92. The italic echoes the slanted chrome letters of the logo. Self-hosted (`/fonts/Satoshi-Variable*.woff2`, Fontshare Free Font License).
- Body: Satoshi 500 / 400.
- Readouts (days, times, channel labels, nav, tags): JetBrains Mono 400 / 500, uppercase, `letter-spacing 0.16em`. Self-hosted (OFL).
- No serif anywhere. No Inter.

## Animation mode

Animation mode: animated-website

Intake answer "Beides": code intro at load PLUS the scroll film. Journey block:

- **Journey shape:** `single-shot`. ONE continuous 15 s film (MiniMax H3, 16:9, 2K, silent; Seedance 2.0 and Kling 3.0 are gated behind the Pro plan on this account), generated in one call from the 6-panel storyboard and the ring-only still as generic references. Because the shipped engine assigns one clip per scene, the single take is cut frame-exact into 4 chapter segments after encoding (same source, no seams) and each chapter gets its own clip + exact-frame poster.
- **Journey (4 chapters, film time 0–15 s):**
  0. `ignition` "Hero" (0.00–2.25 s): almost black, a faint distant ember glow at the exact center. The logo (HTML layer, screen blend) sits over it; as scrolling starts the logo scales out and the film's ring emerges. Copy bottom-left. Focal point: center.
  1. `was-hec` "Was HEC ist" (2.25–6.75 s): the plasma ring surfaces from the dark and grows while the camera pushes in. Copy left. Focal point: the ring, center.
  2. `wochenplan` "Wochenplan" (6.75–11.25 s): the ring fills two thirds of the frame, the camera passes through it, filaments slide past the frame edges. Copy right (ledger). Focal point: center, empty dark core.
  3. `gruppe` "Was in der Gruppe läuft" (11.25–15.00 s): inside the circle, orbiting embers calm into a stable ring hugging the frame edges, dark center. Copy left. Focal point: center.
- **Camera architecture:** A, one continuous forward push-in. No seams exist; the chapter cuts are cuts of one take.
- **Seam direction:** forward into the ring. Reverse scroll pulls back out of the same take.
- **Mobile framing:** the ring is always centered, so `object-fit: cover` on portrait keeps the focal point. No separate portrait source.
- **Delivery budget:** desktop segments ≤ 14 MiB total, mobile segments ≤ 7 MiB total. Fire compresses badly: if over budget, CRF 22 (desktop) / 25 (mobile), then height 900 px.
- **World grammar (byte-identical across every media prompt):** "pure studio-black void; a ring of red-orange plasma fire made of crawling lightning-like filaments and drifting sparks; red #FF2E14, orange #FF7A1A, hot highlights #FFD36B; the center of the ring stays empty and dark; photoreal VFX; no text, no letters, no logos, no watermark".

### Ignition intro (load-time canvas layer, 0 credits)

Fixed full-viewport 2D canvas above the hero, additive blending, DPR capped at 2 (1.5 on mobile). Timeline (desktop, mobile × 0.8): 0–0.9 s comet enters from off-screen top-left on an arc with a spark trail; 0.9–1.6 s it balloons into a roiling fireball heading to center; at 1.6 s impact: white-to-red flash, expanding shockwave ring, camera shake, burst of 400 embers (180 on mobile) and 70 sparks; 1.6–2.35 s the burst dies down while the DOM logo slams in (scale 1.7 to 1 with glow) and the headline, sub and CTA follow; 2.35–2.65 s the canvas fades and unmounts. Skip on any tap, scroll, key or wheel. Plays once per session (`sessionStorage`). `prefers-reduced-motion`: never mounts. The hero (logo, H1, CTA) is server-rendered and complete underneath; an inline head script arms a ground-colored veil before first paint so the intro does not flash the end state, with a CSS safety fade at 2.6 s in case scripts never run.

## Section plan (6 sections + nav, one layout family each, eyebrow budget 2)

1. **Hero / chapter 0 `ignition`:** image-as-canvas (film frame 0 near black + centered screen-blended logo), copy anchored bottom-left, primary CTA. Layout family: image-as-canvas.
2. **Chapter 1 `was-hec`:** centered statement, three lines, two tags. Family: centered statement.
3. **Chapter 2 `wochenplan`:** the ledger, four rows (day + time in mono, name + one line), hairline-ruled, whole-row shear on hover. Eyebrow "Jede Woche". Second-read moment: one oversized outlined "4" behind the ledger. Family: ledger rows.
4. **Chapter 3 `gruppe`:** off-grid readout list of the five channels + the orbit-link CTA in `actions`. Family: off-grid list.
5. **Reels (normal flow below the journey):** eyebrow "Aus den Treffen", three 9:16 tiles, horizontal snap-scroll on mobile, click facade with a burning play ring, iframe loads only on click. Family: media strip.
6. **Final band:** the whole band is the link, plate = ring-only still, band shears and re-grades on hover. Family: banner CTA.

Nav: wordmark (ring mark + HEC), "Wochenplan" anchor, "Zur WhatsApp-Gruppe". Footer: HEC · High Energy Circle · Dresden · Instagram · Impressum · Datenschutz. Legal routes `/impressum`, `/datenschutz`.

## Asset plan

- User asset (wins, never regenerated): the HEC logo → `app/public/assets/logo/hec-logo.png` + `.webp`, plus the head kit derived from it (favicon.svg = red ring on ground; PNG 16/32/180/192/512 + maskable 512; `site.webmanifest`; theme-color `#070606`).
- Ring-only still (nano_banana_pro, logo as reference, empty center): film reference, storyboard reference, final-band plate.
- Storyboard: one 16:9 6-panel grid of the single continuous move.
- Film: one 15 s MiniMax H3 take (2K) → 4 chapter segments, desktop + mobile encodes, exact-frame posters, all under `app/public/assets/world/`.
- Section plates (2): dark ember field (reels section), calm ring interior (fallback plate).
- Icon set: one sheet, 6 glow-line glyphs on pure black (bolt, ring, dumbbell, car, sunrise, speech bubble), sliced with Pillow, composited with `mix-blend-mode: screen` (no background removal needed on a black page).
- Cover + OG: nano_banana_pro 3:2 scene (students on a Dresden riverside lot at night around a floating plasma ring), cutout via image_background_remover, composed with compose_cover.py, title "HEC", frame signal-red.
- No cover video (not ordered).

## CTA inventory (one label per intent: "Zur WhatsApp-Gruppe"; three garments; none of the rationed trio)

1. Hero primary: viewfinder brackets that close around the label on hover, magnetic pull toward the pointer. Component `hero-cta.tsx`.
2. Chapter 3: mono text link with a dot that travels a drawn orbit around a ring glyph on hover. Component `orbit-link.tsx`.
3. Final band: the entire band is the link; it shears 2° and the plate re-grades on hover. Component `final-band.tsx`.
- Nav links: hairline underline that heats to the accent on hover (the single drawing-underline garment on the page; the footer uses plain color change only).

## Anti-convergence ledger (first build in this chat; all axes derived from the material world: plasma, sparks, wet asphalt at night, headlights, cold Elbe air)

1. Palette family: black void + plasma red (brand).
2. Type pairing: Satoshi Black Italic + JetBrains Mono.
3. Hero architecture: image-as-canvas with centered logo and bottom-left copy.
4. Tier-1 technique: A4 scroll scrub (default), plus the load-time ignition canvas.
5. CTA garments: viewfinder brackets, orbit dot, band shear.
6. Corner language: all sharp (0 radius). Circles appear only as quotes of the ring (logo, play ring, orbit glyph).

## Copy (German, direct, no dashes)

- H1: Der Kreis für Leute, die was vorhaben.
- Sub: HEC ist eine Community von Studenten in Dresden. Vier feste Termine pro Woche: Ziele, Sport, Autos, Nächte. Rein oder raus.
- CTA everywhere: Zur WhatsApp-Gruppe
- Chapter 1: Keine Vorträge. Kein Gelaber. / Wir reden über das, was du erreichen willst, und dann machen wir es. Jede Woche. Mit Leuten, die genauso ticken. Tags: Dresden, Studenten.
- Chapter 2 (eyebrow Jede Woche): Vier Termine. Jede Woche. / DI Power Meeting · MI Sport + Vision Talk · FR Freizeit · SO Vision Walk.
- Chapter 3: Was in der Gruppe läuft. / GM jeden Morgen · Wins, deine Erfolge · Learning der Woche · Deine Vision, dein Ziel · Termine und Orte der Woche / Kein Spam, keine Memes. Jeden Morgen ein GM, jede Woche ein Learning, jeder Erfolg wird gefeiert.
- Reels (eyebrow Aus den Treffen): So sieht das aus.
- Final: Rein oder raus. / Ein Klick, dann bist du in der Gruppe. Der nächste Termin steht drin.
- Meta: title "HEC. High Energy Circle Dresden"; og_title "HEC"; description "High Energy Circle: Studenten-Community in Dresden mit vier festen Terminen pro Woche. Ziele, Sport, Autos, Nächte. Rein über WhatsApp."
