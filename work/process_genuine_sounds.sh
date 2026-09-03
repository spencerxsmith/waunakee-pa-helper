#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/assets/audio/sources"
OUT="$ROOT/public/audio"
ENC=(-ar 48000 -codec:a libmp3lame -b:a 192k -map_metadata -1)

ffmpeg -v error -y -i "$SRC/industrial-air-horn-hq-preview.mp3" \
  -af "atrim=0:2.571,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.01,afade=t=out:st=2.321:d=0.25,loudnorm=I=-13:LRA=7:TP=-1" \
  "${ENC[@]}" "$OUT/goal-horn.mp3"

ffmpeg -v error -y -i "$SRC/hand-cranked-siren-hq-preview.mp3" \
  -af "atrim=start=3:end=7,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.01,afade=t=out:st=3.65:d=0.35,loudnorm=I=-13:LRA=7:TP=-1" \
  "${ENC[@]}" "$OUT/goal-burst.mp3"

ffmpeg -v error -y -ss 1.78 -t 2.72 -i "$SRC/solenoid-bell-hq-preview.mp3" \
  -af "afade=t=in:st=0:d=0.01,afade=t=out:st=2.47:d=0.25,loudnorm=I=-14:LRA=7:TP=-1" \
  "${ENC[@]}" "$OUT/final-buzzer.mp3"

ffmpeg -v error -y -ss 0.74 -t 0.72 -i "$SRC/metal-whistle-hq-preview.mp3" \
  -af "afade=t=in:st=0:d=0.005,afade=t=out:st=0.57:d=0.15,loudnorm=I=-17:LRA=7:TP=-2" \
  "${ENC[@]}" "$OUT/whistle.mp3"

ffmpeg -v error -y -t 5.2 -i "$SRC/crowd-cheer-5-hq-preview.mp3" \
  -af "afade=t=in:st=0:d=0.03,afade=t=out:st=4.7:d=0.5,loudnorm=I=-15:LRA=9:TP=-1" \
  "${ENC[@]}" "$OUT/big-cheer.mp3"

ffmpeg -v error -y -ss 5.8 -t 4.0 -i "$SRC/distant-cheer-hq-preview.mp3" \
  -af "afade=t=in:st=0:d=0.08,afade=t=out:st=3.5:d=0.5,loudnorm=I=-15:LRA=9:TP=-1" \
  "${ENC[@]}" "$OUT/crowd-rise.mp3"

ffmpeg -v error -y -i "$SRC/group-gasp-hq-preview.mp3" \
  -af "atrim=0:1.602,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.01,afade=t=out:st=1.352:d=0.25,loudnorm=I=-16:LRA=7:TP=-1" \
  "${ENC[@]}" "$OUT/aw-so-close.mp3"

ffmpeg -v error -y \
  -i "$SRC/clean-trumpet-fanfare-hq-preview.mp3" \
  -i "$SRC/zildjian-cymbal-hq-preview.mp3" \
  -filter_complex "[0:a]atrim=0:4.559,asetpts=PTS-STARTPTS,volume=1.0[t];[1:a]atrim=0:2.2,asetpts=PTS-STARTPTS,adelay=3300|3300,volume=0.58[c];[t][c]amix=inputs=2:duration=longest:normalize=0,afade=t=out:st=5.05:d=0.45,loudnorm=I=-14:LRA=8:TP=-1[out]" \
  -map "[out]" "${ENC[@]}" "$OUT/warriors-win.mp3"

ffmpeg -v error -y \
  -i "$SRC/acoustic-kick-hq-preview.mp3" \
  -i "$SRC/zildjian-cymbal-hq-preview.mp3" \
  -filter_complex "[0:a]volume=1.25[k];[1:a]atrim=0:2.0,asetpts=PTS-STARTPTS,volume=0.72[c];[k][c]amix=inputs=2:duration=longest:normalize=0,afade=t=out:st=1.65:d=0.35,loudnorm=I=-14:LRA=7:TP=-1[out]" \
  -map "[out]" "${ENC[@]}" "$OUT/hype-hit.mp3"

ffmpeg -v error -y -ss 6.5 -t 4.0 -i "$SRC/snare-roll-crash-hq-preview.mp3" \
  -af "afade=t=in:st=0:d=0.03,afade=t=out:st=3.55:d=0.45,loudnorm=I=-14:LRA=8:TP=-1" \
  "${ENC[@]}" "$OUT/drum-charge.mp3"

ffmpeg -v error -y \
  -i "$SRC/glockenspiel-f-sharp-hq-preview.mp3" \
  -i "$SRC/glockenspiel-g-sharp-hq-preview.mp3" \
  -filter_complex "[0:a]atrim=0:1.25,asetpts=PTS-STARTPTS,volume=0.9[a];[1:a]atrim=0:1.25,asetpts=PTS-STARTPTS,adelay=340|340,volume=0.9[b];[a][b]amix=inputs=2:duration=longest:normalize=0,afade=t=out:st=1.25:d=0.34,loudnorm=I=-18:LRA=7:TP=-2[out]" \
  -map "[out]" "${ENC[@]}" "$OUT/coin-chime.mp3"

echo "Genuine audio derivatives written to $OUT"
