#!/usr/bin/env bash
# Phase 2: the film (135 credits), the cover scene (2 candidates), two plates,
# the icon sheet. Usage: bash refs/generate-phase2.sh <storyboard_job_id> <ring_job_id>
set -euo pipefail
cd "$(dirname "$0")/.."
STORY=${1:?storyboard job id}
RING=${2:?ring job id}
JOBS=refs/jobs.txt

submit() {
  local label=$1; shift
  local out id
  out=$(higgsfield generate create "$@" --json)
  id=$(printf '%s' "$out" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);console.log(j.id||j.job_id||(j.jobs&&j.jobs[0]&&j.jobs[0].id)||"")}catch(e){console.log("")}})')
  echo "$label $id" | tee -a "$JOBS"
}

echo "== film: seedance_2_0, 15 s, 1080p, silent (135 credits) =="
submit film seedance_2_0 --duration 15 --resolution 1080p --mode std --generate_audio false --aspect_ratio 16:9 \
  --image-references "$STORY" --image-references "$RING" \
  --prompt "One continuous unbroken shot, 15 seconds, no cuts. Pure studio-black void, nothing else in frame. Frame 1 is almost black: only a faint distant ember glow at the exact center. A ring of red-orange plasma fire slowly emerges from the darkness at the center, small at first, while the camera pushes in at a slow constant speed. The ring is made of crawling lightning-like filaments and drifting sparks, red #FF2E14 and orange #FF7A1A with hot yellow-white highlights #FFD36B, like a burning circular portal, matching the reference images. The center of the ring stays empty and dark the whole time. The ring grows steadily until it fills two thirds of the frame, then the camera passes through the ring: the filaments slide past the frame edges and we are inside, surrounded by slowly orbiting embers and a calm glowing ring that now frames the edges of the picture. The final frame is a stable, calm ring of fire hugging the frame edges with a dark empty center. Slow steady motion only, constant speed, no camera shake, no cuts, no flicker, locked exposure, minimal motion blur, photoreal VFX, 4K clarity, no on-screen text, no letters, no logos, no watermark."

echo "== cover scene, 2 candidates (4 credits) =="
submit cover nano_banana_pro --aspect_ratio 3:2 --resolution 2k --count 2 \
  --image https://static.higgsfield.ai/website-builder/app-cover-generator/refs/scene-stadium-action.jpg \
  --prompt "Five students in dark hoodies and jackets standing in a loose circle on an empty night-time riverside parking lot in Dresden, a ring of red-orange plasma fire floating at chest height in the middle of their circle throwing sparks, two cars with headlights on behind them, city lights and a baroque church dome silhouette far across the river, wet asphalt reflections, the group fills two thirds of the frame right of center, soft open negative space upper-left in the dark sky, saturated red, orange and black palette, bright warm key light from the ring with punchy shadows, low wide angle, commercial editorial grade, no readable screens, no text, no letters, no logos, no captions, no UI"

echo "== plates (2 x 2 credits) =="
submit plate-embers nano_banana_pro --aspect_ratio 16:9 --resolution 2k \
  --prompt "Abstract dark background plate: a sparse field of drifting orange embers and faint smoke over pure black, soft bokeh, low detail, very dark overall so white text stays readable, red #FF2E14 and orange #FF7A1A accents only, no text, no logos, no watermark"
submit plate-ring nano_banana_pro --aspect_ratio 16:9 --resolution 2k --image "$RING" \
  --prompt "Wide 16:9 background plate: the reference ring of red-orange plasma fire seen from inside, the ring hugging the frame edges, calm, dark empty center, drifting embers, pure black background, no text, no logos, no watermark"

echo "== icon sheet (2 credits) =="
submit icons nano_banana_pro --aspect_ratio 3:2 --resolution 2k \
  --prompt "Icon set sheet on a pure black background: six glowing line icons arranged in a 3x2 grid with generous spacing, consistent 2px stroke, red #FF2E14 lines with a soft orange glow, same visual weight and corner style: a lightning bolt, a ring of fire, a dumbbell, a sports car seen from the front, a rising sun over a horizon line, a speech bubble. Flat, no text, no labels, no numbers, no watermark."

echo "Poll: higgsfield generate wait <job_id>; download results into refs/raw/ and app/public/assets/"
