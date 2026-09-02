#!/usr/bin/env bash
# Phase 1: ring-only still (from the logo), storyboard, six design boards.
# All async (no --wait); job ids are appended to refs/jobs.txt.
# Usage: bash refs/generate-phase1.sh            (needs refs/logo-src.png + credits)
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f refs/logo-src.png ] || { echo "refs/logo-src.png missing" >&2; exit 2; }
JOBS=refs/jobs.txt
touch "$JOBS"

WORLD="pure studio-black void; a ring of red-orange plasma fire made of crawling lightning-like filaments and drifting sparks; red #FF2E14, orange #FF7A1A, hot highlights #FFD36B; the center of the ring stays empty and dark; photoreal VFX; no text, no letters, no logos, no watermark"

submit() { # label, then the higgsfield args
  local label=$1; shift
  local out
  out=$(higgsfield generate create "$@" --json)
  local id
  id=$(printf '%s' "$out" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);console.log(j.id||j.job_id||(j.jobs&&j.jobs[0]&&j.jobs[0].id)||"")}catch(e){console.log("")}})')
  echo "$label $id" | tee -a "$JOBS"
}

echo "== ring-only still (2 credits) =="
submit ring nano_banana_pro --aspect_ratio 1:1 --resolution 2k --image refs/logo-src.png \
  --prompt "Recreate the reference image's ring of red-orange plasma fire exactly: the same crawling lightning-like filaments, sparks, glow and colors on a pure black background, but with a completely EMPTY dark center. No letters, no text, no logo, no symbols inside the ring. Square, centered, the ring fills 70% of the frame. No text, no watermark."

echo "== boards (6 x 2 credits) =="
BASE="website design mockup, desktop landing page section, deep dark pure black void lit only by red-orange plasma light, palette #070606 #F5EFE8 #FF2E14, heavy italic compressed grotesk uppercase typography, ignition motif (spark, ember field, ring of fire), professional layout, clear hierarchy and spacing, award-winning web design, no watermark, no browser chrome"
submit board-hero nano_banana_pro --aspect_ratio 16:9 --resolution 2k --image refs/logo-src.png \
  --prompt "$BASE, HERO: image-as-canvas with the reference ring logo centered, headline anchored bottom-left reading 'DER KREIS FÜR LEUTE, DIE WAS VORHABEN.', one short subline, one CTA framed by four red viewfinder corner brackets reading 'ZUR WHATSAPP-GRUPPE', faint drifting embers"
submit board-statement nano_banana_pro --aspect_ratio 16:9 --resolution 2k \
  --prompt "$BASE, STATEMENT section: stacked centered composition, giant two-line headline 'KEINE VORTRÄGE. KEIN GELABER.', one paragraph beneath, two small mono tags 'DRESDEN' 'STUDENTEN', a plasma ring emerging small in the far background"
submit board-ledger nano_banana_pro --aspect_ratio 16:9 --resolution 2k \
  --prompt "$BASE, WEEKLY SCHEDULE section: top-left lead, small red mono eyebrow 'JEDE WOCHE', headline 'VIER TERMINE. JEDE WOCHE.', a four-row ledger with thin hairline rules, each row a mono day and time on the left ('DI 19:00') and a bold italic name with one line on the right, one oversized outlined numeral 4 behind the rows, camera passing through the fire ring in the background"
submit board-readouts nano_banana_pro --aspect_ratio 16:9 --resolution 2k \
  --prompt "$BASE, CHANNELS section: off-grid offset list, headline 'WAS IN DER GRUPPE LÄUFT.', five mono readout lines like a launch console ('GM  JEDEN MORGEN', 'WINS  DEINE ERFOLGE'), alternating rows shifted right, one text link with a small ring glyph and an orbiting spark, inside the fire ring with orbiting embers"
submit board-reels nano_banana_pro --aspect_ratio 16:9 --resolution 2k \
  --prompt "$BASE, VIDEO section: image-as-canvas strip, small red mono eyebrow 'AUS DEN TREFFEN', headline 'SO SIEHT DAS AUS.', three vertical 9:16 video tiles with dark night footage of young people and cars, each with a thin glowing red circular play ring, subtle ember plate behind"
submit board-band nano_banana_pro --aspect_ratio 16:9 --resolution 2k --image refs/logo-src.png \
  --prompt "$BASE, FINAL CALL TO ACTION band: inverted classic composition, the whole band is one link, giant headline 'REIN ODER RAUS.', one line beneath, a red mono link 'ZUR WHATSAPP-GRUPPE' with a long arrow, the reference plasma ring as a full-bleed plate behind, then a thin mono footer line 'HEC · HIGH ENERGY CIRCLE · DRESDEN  INSTAGRAM  IMPRESSUM  DATENSCHUTZ'"

echo "Storyboard needs the ring job as reference: run refs/generate-storyboard.sh <ring_job_id> once the ring is done."
echo "Poll: higgsfield generate wait <job_id>"
