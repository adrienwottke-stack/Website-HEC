#!/usr/bin/env bash
# Storyboard: one 16:9 six-panel grid of ONE continuous camera move, using the
# ring-only still as the look reference. Usage: bash refs/generate-storyboard.sh <ring_job_id>
set -euo pipefail
cd "$(dirname "$0")/.."
RING=${1:?ring job id}
higgsfield generate create nano_banana_pro --aspect_ratio 16:9 --resolution 2k --image "$RING" \
  --prompt "A 6-panel storyboard grid (3x2), 16:9, six keyframes of ONE continuous camera move, NOT six different scenes: panel 1 almost black with a faint ember glow at center; panel 2 a small ring of red-orange plasma fire emerging at center; panel 3 the ring larger with crawling lightning filaments and sparks; panel 4 the ring filling two thirds of the frame, center empty and dark; panel 5 the camera passing through the ring, filaments sliding past the frame edges; panel 6 inside the circle, a calm glowing ring hugging the frame edges, dark center. Match the reference image's fire ring look exactly. Pure black background in every panel, palette red #FF2E14, orange #FF7A1A, highlights #FFD36B. No text, no letters, no numbers, no logos, no watermark anywhere." \
  --json | tee -a refs/jobs.txt
