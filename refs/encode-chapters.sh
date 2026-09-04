#!/usr/bin/env bash
# Cut the seam-locked HEC film chain into the chapter segments the scrub engine
# expects (one clip per scene), encode desktop + mobile variants, and extract
# the exact first-frame posters from the ENCODED clips.
#
# Sources (refs/film/): leg2.mp4 = meteor flight, leg3.mp4 = atmosphere entry +
# impact. Each leg starts on the previous leg's actual last frame, so the chapter
# cuts are cuts of one continuous take. Act 1 (refs/film/source.mp4, the ring)
# is deliberately NOT cut any more: the journey opens on a static hero (logo +
# copy over the ember field) and the film ignites straight into the meteor, so
# the ring only ever exists as the logo and the load-time ignition canvas.
# Every seek decodes from the previous keyframe, so both variants keep the GOP
# at 4 frames (desktop was 8: seeks took up to 73 ms and varied wildly).
# The meteor legs are far busier (sparks, explosions), so they get a 900p cap
# and a higher CRF to stay inside the byte budget (desktop <= 32 MiB, mobile
# <= 16 MiB for the whole chain).
#
# Usage: bash refs/encode-chapters.sh [chapter ...]   (no args = all)
# Output: app/public/assets/world/<chapter>{,-mobile}.mp4 + *-poster.jpg

set -euo pipefail

OUT="app/public/assets/world"
mkdir -p "$OUT"
command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg missing" >&2; exit 127; }

# chapter    source                 start  end    height crf-desktop crf-mobile
SEGMENTS=(
  "was-hec    refs/film/leg2.mp4     0.00   7.50   900 25 28"
  "stationen  refs/film/leg2.mp4     7.50  15.00   900 25 28"
  "eintritt   refs/film/leg3.mp4     0.00   7.50   900 25 28"
  "einschlag  refs/film/leg3.mp4     7.50  15.00   900 25 28"
)

wanted=("$@")
for line in "${SEGMENTS[@]}"; do
  read -r name src start end height crfd crfm <<<"$line"
  if [ ${#wanted[@]} -gt 0 ]; then
    keep=0; for w in "${wanted[@]}"; do [ "$w" = "$name" ] && keep=1; done; [ $keep -eq 1 ] || continue
  fi
  [ -f "$src" ] || { echo "skip $name: $src missing"; continue; }
  echo "== $name <- $src ($start .. $end, ${height}p) =="
  ffmpeg -v error -y -ss "$start" -to "$end" -i "$src" -an \
    -vf "scale=-2:'min($height,ih)',unsharp=5:5:0.8:5:5:0.0" \
    -c:v libx264 -preset slow -crf "$crfd" -pix_fmt yuv420p \
    -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -v error -y -ss "$start" -to "$end" -i "$src" -an \
    -vf "scale=-2:'min(720,ih)',unsharp=5:5:0.6:5:5:0.0" \
    -c:v libx264 -preset slow -crf "$crfm" -pix_fmt yuv420p \
    -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$OUT/$name-mobile.mp4"
  ffmpeg -v error -y -ss 0 -i "$OUT/$name.mp4" -frames:v 1 -q:v 3 "$OUT/$name-poster.jpg"
  ffmpeg -v error -y -ss 0 -i "$OUT/$name-mobile.mp4" -frames:v 1 -q:v 3 "$OUT/$name-mobile-poster.jpg"
done

echo "== sizes =="
du -k "$OUT"/*.mp4 | sort -k2
echo "desktop total KiB: $(du -ck $(ls "$OUT"/*.mp4 | grep -v mobile) | tail -1 | cut -f1)"
echo "mobile total KiB:  $(du -ck "$OUT"/*-mobile.mp4 | tail -1 | cut -f1)"
