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
# AFTER RE-ENCODING: bump WORLD_VERSION in app/src/scroll-scrub-scenes.tsx.
# These files keep their names, so without that bump browsers and the CDN go on
# serving the previous cut to anyone who has loaded the page before.
#
# Usage: bash refs/encode-chapters.sh [chapter ...]   (no args = all)
# Output: app/public/assets/world/<chapter>{,-mobile}.mp4 + *-poster.jpg

set -euo pipefail

OUT="app/public/assets/world"
mkdir -p "$OUT"
command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg missing" >&2; exit 127; }

# einschlag takes crf 30 on mobile, not 28: the impact ramp below makes it the
# longest chapter by half, and at 28 its full-frame fire came to 2.9 MiB --
# the heaviest clip in the chain, on the one a phone has to have in hand
# before the reader gets there. At 30 it is 2.3 MiB, no heavier than the cut
# it replaces, and the two are indistinguishable at 390 px wide.
#
# chapter    source                 start  end    height crf-desktop crf-mobile
SEGMENTS=(
  "was-hec    refs/film/leg2.mp4     1.00   8.00   900 25 28"
  "stationen  refs/film/leg2.mp4     8.00  15.00   900 25 28"
  "eintritt   refs/film/leg3.mp4     0.00   7.50   900 25 28"
  "einschlag  refs/film/leg3.mp4     7.50  15.00   900 25 30"
)

# ---------------------------------------------------------------- impact ramp
#
# The last chapter is the only one that does not run at speed. Straight out of
# the render the meteor hits 0.5 s in and the fireball is spent by 2.9 s, so
# 61 % of the chapter is the burnt-out crater ring standing still. The scrub
# engine maps scroll linearly onto media time, so the hit got ~10 % of the
# chapter's scroll: one flick of the wheel and it was over.
#
# So the impact beat (the first 2.90 s: fall, flash, fireball, collapse) is
# time-warped by a piecewise-linear ramp, and the static ring bed after it is
# compressed. Slopes are output seconds per source second:
#
#   0.00-0.40  fall      2.0x   the last beat before the hit
#   0.40-0.70  flash     4.5x   the white bloom, held
#   0.70-1.80  fireball  4.0x   the shot the whole film is for
#   1.80-2.90  collapse  2.0x   fire falling back into the crater
#   2.90-7.50  ring bed  0.60x  near-static, only the CTA rests here
#
# 7.50 s in, 11.54 s out: the impact goes from 39 % to 76 % of the chapter,
# and every source frame in it is worth ~2.5x more scroll than before.
# minterpolate (motion-compensated, both directions) synthesises the in-between
# frames at 4x density first, so the slow motion is real frames and not the
# same frame held across 100 px of scroll. It only runs on the impact beat --
# on the ring bed it would cost two minutes to interpolate a still.
IMPACT_RAMP="if(lt(T\,0.40)\,2.0*T\,if(lt(T\,0.70)\,0.80+4.5*(T-0.40)\,if(lt(T\,1.80)\,2.15+4.0*(T-0.70)\,6.55+2.0*(T-1.80))))"
INTERP="minterpolate=fps=96:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"

# Video filter graph for one variant. Everything ends on [v] so both the plain
# chapters and the ramped one use the same ffmpeg invocation below.
graph() { # $1 = chapter  $2 = height  $3 = unsharp luma amount
  local scale="scale=-2:'min($2,ih)'" sharp="unsharp=5:5:$3:5:5:0.0"
  if [ "$1" = "einschlag" ]; then
    printf '%s' "\
[0:v]$scale,split=2[imp][bed];\
[imp]trim=end=2.90,setpts=PTS-STARTPTS,$INTERP,setpts='($IMPACT_RAMP)/TB',fps=24[a];\
[bed]trim=start=2.90,setpts=(PTS-STARTPTS)*0.60,fps=24[b];\
[a][b]concat=n=2:v=1:a=0,$sharp[v]"
  else
    printf '%s' "[0:v]$scale,$sharp[v]"
  fi
}

wanted=("$@")
for line in "${SEGMENTS[@]}"; do
  read -r name src start end height crfd crfm <<<"$line"
  if [ ${#wanted[@]} -gt 0 ]; then
    keep=0; for w in "${wanted[@]}"; do [ "$w" = "$name" ] && keep=1; done; [ $keep -eq 1 ] || continue
  fi
  [ -f "$src" ] || { echo "skip $name: $src missing"; continue; }
  echo "== $name <- $src ($start .. $end, ${height}p) =="
  ffmpeg -v error -y -ss "$start" -to "$end" -i "$src" -an \
    -filter_complex "$(graph "$name" "$height" 0.8)" -map "[v]" \
    -c:v libx264 -preset slow -crf "$crfd" -pix_fmt yuv420p \
    -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -v error -y -ss "$start" -to "$end" -i "$src" -an \
    -filter_complex "$(graph "$name" 720 0.6)" -map "[v]" \
    -c:v libx264 -preset slow -crf "$crfm" -pix_fmt yuv420p \
    -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$OUT/$name-mobile.mp4"
  ffmpeg -v error -y -ss 0 -i "$OUT/$name.mp4" -frames:v 1 -q:v 3 "$OUT/$name-poster.jpg"
  ffmpeg -v error -y -ss 0 -i "$OUT/$name-mobile.mp4" -frames:v 1 -q:v 3 "$OUT/$name-mobile-poster.jpg"
done

# Real bytes, not du: du reported this directory almost 2x over right after a
# write, which is how the mobile impact clip looked like a 5 MiB problem it
# never was. These numbers get compared against the byte budget at the top, so
# they have to be the ones a browser would actually download.
kib() { cat "$@" | wc -c | awk '{printf "%d", $1 / 1024}'; }

echo "== sizes =="
for f in "$OUT"/*.mp4; do
  printf '%6s KiB  %s\n' "$(kib "$f")" "$(basename "$f")"
done | sort -k3
echo "desktop total KiB: $(kib $(ls "$OUT"/*.mp4 | grep -v mobile))"
echo "mobile total KiB:  $(kib "$OUT"/*-mobile.mp4)"
