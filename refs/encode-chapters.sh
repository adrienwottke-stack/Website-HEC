#!/usr/bin/env bash
# Cut the seam-locked HEC film chain into the chapter segments the scrub engine
# expects (one clip per scene), encode desktop (1080p cap) + mobile (720p cap)
# variants, and extract the exact first-frame posters from the ENCODED clips.
#
# Sources (refs/film/): source.mp4 = act 1 (ring), leg2.mp4 = meteor flight,
# leg3.mp4 = atmosphere entry + impact. Each leg starts on the previous leg's
# actual last frame, so the chapter cuts are cuts of one continuous take.
#
# Usage: bash refs/encode-chapters.sh
# Output: app/public/assets/world/<chapter>{,-mobile}.mp4 + *-poster.jpg

set -euo pipefail

OUT="app/public/assets/world"
mkdir -p "$OUT"
command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg missing" >&2; exit 127; }

# chapter    source                 start  end    crf-desktop crf-mobile
SEGMENTS=(
  "ignition   refs/film/source.mp4   0.00   6.75  21 23"
  "was-hec    refs/film/source.mp4   6.75  15.00  21 23"
  "stationen  refs/film/leg2.mp4     0.00  15.00  22 25"
  "eintritt   refs/film/leg3.mp4     0.00   7.50  22 25"
  "einschlag  refs/film/leg3.mp4     7.50  15.00  22 25"
)

for line in "${SEGMENTS[@]}"; do
  read -r name src start end crfd crfm <<<"$line"
  [ -f "$src" ] || { echo "skip $name: $src missing"; continue; }
  echo "== $name <- $src ($start .. $end) =="
  ffmpeg -v error -y -ss "$start" -to "$end" -i "$src" -an \
    -vf "scale=-2:'min(1080,ih)',unsharp=5:5:0.8:5:5:0.0" \
    -c:v libx264 -preset slow -crf "$crfd" -pix_fmt yuv420p \
    -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "$OUT/$name.mp4"
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
