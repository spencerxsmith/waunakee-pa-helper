# PA Helper V1 — Build Report

Built 2026-09-03 on local branch `main`.

## Delivered

- Mobile-first Waunakee soundboard with dark/purple visual system
- Twelve short, normalized, mono sound effects
- Favorites, categories, master volume, persistent Stop All, and clear playing/progress state
- Strict one-at-a-time playback with serialized click-prevention fades
- First-tap audio unlock and quiet test chime
- Setup/readiness diagnostics, wired-first guidance, and whistle/buzzer warnings
- Installable manifest and versioned offline app/audio caches
- Local-only preferences; no accounts, analytics, microphone, or backend
- Complete audio source/license ledger, preserved evidence, source/final hashes, and public notices
- Static Vercel configuration and a local `main` Git repository

## Verification completed

- `npm run check`: passed
- 12/12 audio files decoded in the browser
- Every shipped audio file appears in the service-worker pack and license ledger
- Every final audio SHA-256 matches the ledger
- Every clip is shorter than ten seconds; total shipped audio is approximately 536 KB
- JavaScript syntax checks passed
- Mobile layouts inspected at 320, 390, and 430 CSS pixels
- No horizontal overflow at 320px
- All visible buttons meet a 44px minimum touch target after refinement
- Audio unlock/test, category switching, favorites UI, Stop All, progress UI, and rapid cue switching exercised
- Rapid Goal Horn → Goal Burst switching left exactly one active playback state
- Browser console contained no warnings or errors in the final smoke test
- True offline reopen succeeded with the local server stopped, including test-chime playback

## Audio provenance

- `Applause`: Amada44, CC0 1.0, sourced from Wikimedia Commons and edited
- `Big Cheer`: starlite, public-domain release, sourced from Wikimedia Commons and edited
- Ten remaining effects: procedurally generated specifically for PA Helper and dedicated to CC0 to the extent rights exist
- The Coin Chime is independently synthesized and contains no Nintendo/Mario recording or sample

## Physical checks still required

Software validation cannot replace a short venue rehearsal. Before match use:

1. Test the actual announcer phone, adapter/interface, mixer input, and PA at a low initial gain.
2. Compare all twelve effects by ear through the venue system and adjust any perceived-level differences.
3. Confirm whether venue/athletic staff authorizes the Whistle and Final Buzzer controls. Remove them if not approved.
4. Test interruption recovery after locking the phone, taking a call, invoking Siri/Assistant, and reconnecting the chosen output route.
5. Prefer wired output; use Bluetooth only after confirming its latency is acceptable for the intended cues.

## Release handoff

- Repository name: `spencerxsmith/waunakee-pa-helper`
- Framework preset: Other/static
- Build command: none
- Output directory: repository root
- Environment variables: none
- Vercel configuration: included in `vercel.json`
- Local verification command: `npm run check`
- Local preview command: `npm start`
