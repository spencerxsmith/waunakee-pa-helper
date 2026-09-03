#!/usr/bin/env python3
"""Generate PA Helper's original, trademark-neutral V1 sound effects."""

import math
import random
import struct
import wave
from pathlib import Path

RATE = 44100
OUT = Path(__file__).resolve().parents[1] / "assets" / "audio" / "originals"
random.seed(20260903)


def env(t, duration, attack=0.01, release=0.08):
    return min(1.0, t / attack if attack else 1.0, (duration - t) / release if release else 1.0)


def write(name, duration, sample):
    frames = bytearray()
    peak = 0.0
    for i in range(int(duration * RATE)):
        t = i / RATE
        value = max(-0.95, min(0.95, sample(t, duration)))
        peak = max(peak, abs(value))
        frames.extend(struct.pack("<h", int(value * 32767)))
    path = OUT / f"{name}.wav"
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(RATE)
        wav.writeframes(frames)
    print(f"{path.name}: {duration:.2f}s peak={peak:.3f}")


def tone(freq, t, harmonics=(1.0,)):
    total = 0.0
    scale = sum(abs(h) for h in harmonics)
    for index, amp in enumerate(harmonics, 1):
        total += amp * math.sin(2 * math.pi * freq * index * t)
    return total / scale


write("goal-horn", 4.2, lambda t, d:
      0.76 * env(t, d, .08, .35) *
      (0.65 * tone(185 + 4 * math.sin(2 * math.pi * 5.2 * t), t, (1, .45, .2)) +
       0.35 * tone(277.5 + 3 * math.sin(2 * math.pi * 4.7 * t), t, (1, .35))))

write("goal-burst", 1.65, lambda t, d:
      0.82 * env(t, d, .025, .22) *
      tone(220 + 85 * min(t / .18, 1), t, (1, .5, .28, .14)))

write("final-buzzer", 1.25, lambda t, d:
      0.65 * env(t, d, .015, .1) *
      (0.72 * tone(112, t, (1, .8, .5, .3)) + 0.28 * tone(119, t, (1, .5))))

write("whistle", .72, lambda t, d:
      0.55 * env(t, d, .018, .08) *
      tone(2150 + 70 * math.sin(2 * math.pi * 7.5 * t), t, (1, .16, .05)))

write("crowd-rise", 3.2, lambda t, d:
      env(t, d, .08, .18) * (t / d) ** .7 *
      (0.26 * (random.random() * 2 - 1) +
       0.16 * tone(220 + 480 * (t / d), t, (1, .25)) +
       0.11 * tone(330 + 620 * (t / d), t, (1, .18))))

write("aw-so-close", 1.55, lambda t, d:
      0.5 * env(t, d, .04, .2) *
      (0.55 * tone(320 - 120 * (t / d), t, (1, .3, .13)) +
       0.25 * tone(250 - 90 * (t / d), t, (1, .22)) +
       0.08 * (random.random() * 2 - 1)))


def win_stinger(t, d):
    notes = [(0.00, .52, 261.63), (.52, .52, 329.63), (1.04, .52, 392.00),
             (1.56, .58, 523.25), (2.14, 1.75, 659.25)]
    value = 0.0
    for start, length, freq in notes:
        local = t - start
        if 0 <= local < length:
            value += .64 * env(local, length, .018, .18) * tone(freq, local, (1, .34, .14))
            value += .22 * env(local, length, .018, .18) * tone(freq / 2, local, (1, .25))
    return value


write("warriors-win", 4.1, win_stinger)


def hype_hit(t, d):
    boom = math.sin(2 * math.pi * (85 - 48 * min(t / .7, 1)) * t) * math.exp(-4.8 * t)
    noise = (random.random() * 2 - 1) * math.exp(-10 * t)
    tail = tone(164.81, t, (1, .45, .2)) * math.exp(-2.8 * t)
    return .72 * boom + .28 * noise + .34 * tail


write("hype-hit", 1.8, hype_hit)


def drum_charge(t, d):
    hits = [0, .32, .64, .88, 1.10, 1.28, 1.44, 1.58, 1.70, 1.80, 1.89]
    value = 0.0
    for start in hits:
        local = t - start
        if 0 <= local < .22:
            value += .42 * (random.random() * 2 - 1) * math.exp(-18 * local)
            value += .38 * math.sin(2 * math.pi * (170 - 70 * local) * local) * math.exp(-14 * local)
    if t > 1.89:
        local = t - 1.89
        value += .55 * math.sin(2 * math.pi * (105 - 55 * local) * local) * math.exp(-4.5 * local)
    return value


write("drum-charge", 2.5, drum_charge)


def coin_chime(t, d):
    if t < .16:
        return .58 * env(t, .16, .004, .04) * tone(1318.51, t, (1, .22))
    local = t - .16
    return .62 * env(local, d - .16, .004, .18) * tone(1975.53, local, (1, .18))


write("coin-chime", .62, coin_chime)
