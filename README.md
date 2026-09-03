# Waunakee PA Helper

A fast, mobile-first, offline-ready soccer soundboard for the Waunakee public-address booth.

## V1 behavior

- Twelve short match, crowd, and stinger effects
- Strict one-sound-at-a-time playback
- Persistent Stop All and master volume controls
- Local favorites
- No separate unlock step: the first sound-pad tap activates audio and plays that cue
- Full sound-pack preloading and offline service-worker cache
- Install guidance for iOS and Chromium browsers
- No accounts, analytics, microphone, uploads, or backend

Whistle and Final Buzzer are marked for authorized use only because they can be confused with official signals. Wired PA output is recommended; Bluetooth adds hardware-dependent delay outside the app's control.

## Run locally

```sh
npm start
```

Then open `http://localhost:4173`. Service workers work on localhost. Use a real phone on an HTTPS preview/production URL for final PWA and output-route validation.

## Verify

```sh
npm run check
```

The check validates required files, sound-manifest/cache alignment, audio durations, and license-ledger hashes.

## Deploy to Vercel

Import `spencerxsmith/waunakee-pa-helper`, choose the **Other** framework preset, and leave build/output commands blank. The repository is a static site and needs no environment variables.

## Audio licensing

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and `licenses/audio-ledger.csv`. Every shipped clip has a source, exact license, creator, modification record, evidence, and SHA-256 checksum. Downloaded source encodes are preserved under `assets/audio/sources/`; the applause source remains under `assets/audio/originals/`.

All twelve shipped cues are based on genuine recordings. The generic Coin Chime uses two physical glockenspiel strikes; no Nintendo or Mario recording, composition, name, or asset is used.
