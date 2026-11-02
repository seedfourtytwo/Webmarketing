#!/usr/bin/env bash
# Email images: old site | design A | design B, plain white sheet, one label per column, no device frames or effects.
# mockup-<slug>.jpg: phone first screens on top, desktop below (attachment). email-<slug>.jpg: phones only (inline).
# Usage: scripts/mockup.sh <slug> [shotsDir=shots]   (needs shots from scripts/shoot.mjs)
set -euo pipefail
slug=$1
dir=${2:-shots}
font=Inter-Medium
col=600      # column width
gap=40

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

column() { # <prefix> <label> <out>
  convert "$dir/$1-phone.png" -resize 340x "$tmp/p.png"
  convert "$dir/$1-desktop.png" -resize ${col}x "$tmp/d.png"
  convert -size ${col}x70 xc:white -font "$font" -pointsize 34 -fill '#1f2a2e' -gravity southwest -annotate +0+18 "$2" "$tmp/l.png"
  convert "$tmp/l.png" \
    \( -size ${col}x20 xc:white \) \
    \( "$tmp/p.png" -background white -gravity west -extent ${col}x \) \
    \( -size ${col}x${gap} xc:white \) \
    "$tmp/d.png" -append "$3"
}

column "before-$slug" "Site actuel" "$tmp/c0.png"
column "after-$slug-a" "Proposition A" "$tmp/c1.png"
column "after-$slug-b" "Proposition B" "$tmp/c2.png"
convert "$tmp/c0.png" \( -size ${gap}x1 xc:white \) "$tmp/c1.png" \( -size ${gap}x1 xc:white \) "$tmp/c2.png" \
  -background white -gravity north +append -bordercolor white -border 48 -quality 88 "$dir/mockup-$slug.jpg"
echo "saved $dir/mockup-$slug.jpg"

# Inline email image: phone screens only, 1240 px wide so it stays sharp when a mail client shows it at ~600 px.
phone() { # <prefix> <label> <out>
  convert -size 380x56 xc:white -font "$font" -pointsize 30 -fill '#1f2a2e' -gravity southwest -annotate +0+12 "$2" \
    \( "$dir/$1-phone.png" -resize 380x \) -append "$3"
}
phone "before-$slug" "Site actuel" "$tmp/e0.png"
phone "after-$slug-a" "Proposition A" "$tmp/e1.png"
phone "after-$slug-b" "Proposition B" "$tmp/e2.png"
convert "$tmp/e0.png" \( -size 30x1 xc:white \) "$tmp/e1.png" \( -size 30x1 xc:white \) "$tmp/e2.png" \
  -background white -gravity north +append -bordercolor white -border 20 -strip -quality 82 "$dir/email-$slug.jpg"
echo "saved $dir/email-$slug.jpg"
