#!/usr/bin/env bash
# Cut the single-shot HEC film into the four chapter segments the scrub engine
# expects (one clip per scene), encode desktop + mobile variants, and extract
# the exact first-frame posters from the ENCODED clips.
#
# Usage: bash refs/encode-chapters.sh refs/film/source.mp4
# Output: app/public/assets/world/<chapter>{,-mobile}.mp4 + *-poster.png

set -euo pipefail

SRC=${1:?source mp4}
OUT="app/public/assets/world"
mkdir -p "$OUT"
command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg missing" >&2; exit 127; }

# chapter  start  end   (seconds, matches design-brief.md journey)
CHAPTERS=(
  "ignition   0.00  2.25"
  "was-hec    2.25  6.75"
  "wochenplan 6.75 11.25"
  "gruppe    11.25 15.00"
)

for line in "${CHAPTERS[@]}"; do
  read -r name start end <<<"$line"
  echo "== $name ($start .. $end) =="
  # Desktop: native resolution, frame-accurate cut (decode + re-encode), short GOP for scrubbing.
  ffmpeg -v error -y -ss "$start" -to "$end" -i "$SRC" -an \
    -vf "unsharp=5:5:0.8:5:5:0.0" \
    -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
    -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "$OUT/$name.mp4"
  # Mobile: 720p cap, tighter GOP.
  ffmpeg -v error -y -ss "$start" -to "$end" -i "$SRC" -an \
    -vf "scale=-2:'min(720,ih)',unsharp=5:5:0.6:5:5:0.0" \
    -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
    -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$OUT/$name-mobile.mp4"
  # Posters from the encoded clips (never from the source).
  ffmpeg -v error -y -ss 0 -i "$OUT/$name.mp4" -frames:v 1 -q:v 2 "$OUT/$name-poster.png"
  ffmpeg -v error -y -ss 0 -i "$OUT/$name-mobile.mp4" -frames:v 1 -q:v 2 "$OUT/$name-mobile-poster.png"
done

echo "== sizes =="
du -k "$OUT"/*.mp4 | sort -k2
echo "desktop total KiB: $(du -ck "$OUT"/ignition.mp4 "$OUT"/was-hec.mp4 "$OUT"/wochenplan.mp4 "$OUT"/gruppe.mp4 | tail -1 | cut -f1)"
echo "mobile total KiB:  $(du -ck "$OUT"/*-mobile.mp4 | tail -1 | cut -f1)"
