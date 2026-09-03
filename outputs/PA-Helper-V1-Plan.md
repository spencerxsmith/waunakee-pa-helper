# PA Helper — V1 Product and Implementation Plan

Status: planning only. No application code or audio assets have been created or downloaded.

## Executive recommendation

Build `spencerxsmith/waunakee-pa-helper` as a small, static, installable PWA using vanilla HTML, CSS, and JavaScript. Preserve the successful visual language of the existing Waunakee JV Soccer PWA: near-black background, purple Warriors accents, compact rounded cards, safe-area-aware spacing, high contrast, and large controls. Optimize everything around the announcer's actual job: look down, identify a sound, tap once, confirm that it is playing, and stop it instantly if needed.

V1 should contain 10–12 short, fully vetted audio files, work offline after an explicit first-run download/readiness check, and play only one sound at a time. Do not add accounts, cloud sync, user uploads, playlists, scheduling, text-to-speech, live streaming, remote control, or scorekeeping.

## 1. Core soundboard experience

The launch screen is the soundboard, not a dashboard. At the top it shows a compact `PA Helper` identity, audio/output status, and a small settings button. Immediately below is a persistent control row with the master volume and a red **Stop All** button. The rest of the screen is a fast, thumb-friendly sound grid.

First visit:

1. The app downloads and verifies the V1 sound pack and app shell.
2. It reports `Ready offline` only after every required sound is cached.
3. A prominent **Enable & test sound** control starts/resumes the browser audio context inside the user's tap and plays a quiet, generic test chime.
4. The app reminds the operator to check the physical mixer/input level and phone output route.

Match-day use:

1. Open the installed PWA and confirm the green `Audio ready · Offline ready` status.
2. Tap a sound once to play it immediately.
3. The active card changes color, shows `PLAYING`, and displays a progress bar/time remaining.
4. Starting a different sound fades/stops the current clip, then starts the new one.
5. Tapping the active card restarts that clip from the beginning; **Stop All** always stops immediately with a very short click-preventing fade.

The interface should never require long-press, double-tap, drag-and-drop, or a submenu to play or stop a sound.

## 2. Information architecture and controls

### Screens

**Soundboard (default and primary screen)**

- Sticky status/header: app name, audio readiness, offline readiness, settings icon.
- Sticky safety/control row: master volume, numeric percentage, and red **Stop All**.
- Category chips: `Favorites`, `Match`, `Crowd`, `Stingers`, `All`.
- Two-column sound grid on phones; three or four columns only when space genuinely permits.
- Now-playing strip above the bottom safe area, visible only while audio is active, showing clip name, progress, and stop.

**Sound setup**

- Output checklist: connect cable/Bluetooth, select the PA input, set phone volume, test at a low mixer level, then raise carefully.
- **Enable & test sound** and **Reload sound pack** actions.
- Read-only diagnostics: audio context state, pack version, cached/offline status, failed files.
- Warn that Bluetooth introduces device-dependent delay and wired output is preferred.

**Settings & credits**

- Default app volume (persist locally), reduced-motion toggle if needed, haptics toggle where supported, and `Stop before new sound` locked on by default.
- Install guidance for iOS Safari and supporting Chromium browsers.
- Audio credits and exact license links, plus app version.

No bottom navigation is necessary for three lightweight destinations. Keep the soundboard always one tap from Settings/Setup via a clear Back action.

### Button hierarchy

1. **Stop All** — most visually urgent control, sticky, red, at least 56px high, never disabled while a clip might be active.
2. **Favorite sounds** — first grid section, 72–88px high, user-selected stars persisted locally. Seed Goal Horn, Applause, and Win Stinger as initial favorites.
3. **Other sound pads** — at least 64px high, concise label plus category/icon; no tiny play icon is required because the whole card is the target.
4. **Setup/settings** — visually quieter and outside the performance path.

Use text labels in addition to icons. Provide visible keyboard focus, `aria-pressed`/state text, and a polite live-region announcement such as `Playing Goal Horn`; stopping should be announced too.

### Playback rules

- V1 is monophonic: one active clip maximum.
- New clip: apply a 30–60ms fade to the current clip, stop it, then start the new clip.
- Stop All: 30–60ms master fade, cancel all scheduled sources, clear playing state, then restore gain for the next play.
- Active pad tap: restart from zero. Do not implement pause/resume; it creates ambiguity for short effects.
- Debounce accidental repeat taps for roughly 150ms while still making deliberate restarts feel instant.
- Long clips should not exist in V1; target 0.25–8 seconds, with a hard review threshold at 10 seconds.
- No simultaneous layering and no per-sound loop controls.

## 3. Proposed starter sound pack

Target 12 clips. Final filenames, sources, and licenses are intentionally undecided until the asset-verification phase.

| Category | Proposed label | Intended use | Target character/length | Default favorite |
|---|---|---|---|---|
| Match | Goal Horn | Waunakee goal | Stadium horn/siren, energetic, 3–6s | Yes |
| Match | Goal Burst | Faster goal option | Short horn hit, 1–2s | No |
| Match | Final Buzzer | End-of-period/event cue only when authorized | Clean arena-style buzzer, 1–2s | No |
| Match | Whistle | Setup/practice or explicitly authorized use | Neutral whistle, under 1s | No |
| Crowd | Big Cheer | Goal or major moment | General crowd celebration, 3–5s | No |
| Crowd | Applause | Introductions/recognition | Natural applause, 3–5s | Yes |
| Crowd | Crowd Rise | Build anticipation | Short swell, 2–4s | No |
| Crowd | Aw, So Close | Light reaction | Non-mocking crowd disappointment, 1–2s | No |
| Stingers | Warriors Win | Post-match win | Generic triumphant brass/percussion, 4–7s | Yes |
| Stingers | Hype Hit | Introductions/restarts | Punchy generic sports hit, 1–3s | No |
| Stingers | Drum Charge | Crowd prompt | Generic short drum cadence, 2–4s | No |
| Stingers | Coin Chime | Small positive moment/test | Original or permissively licensed 8-bit coin-like ascending chime, under 1s | No |

The whistle and buzzer must live behind the `Match` category and carry a small `Use only when authorized` note in Setup because PA playback could be confused with officiating or venue signals. If the athletic department does not explicitly want them, remove them before launch and replace them with a second applause and a neutral transition sting.

Do not use, imitate too closely, name, tag, or market the Nintendo/Mario coin recording. The target is a generic synthesized two- or three-note 8-bit reward chime with independent provenance.

## 4. Later audio research and licensing workflow

No asset enters the repo merely because a page says “royalty-free,” “free,” or “open-source.” Those descriptions do not establish the file-level permission.

### Source priority

1. Original sounds created specifically for this project and documented by the creator.
2. CC0 1.0 or clearly documented public-domain assets from the rights holder.
3. CC BY 4.0 or another permissive license that allows copying, adaptation, redistribution, public performance, and the intended public/noncommercial-or-commercial deployment, with attribution requirements satisfied.
4. Avoid NC, ND, SA, editorial-only, personal-use-only, platform-only, ambiguous custom licenses, and assets whose uploader may not plausibly own the recording. Escalate any exception rather than interpreting it optimistically.

### Per-file gate

For every candidate, save all of the following before downloading the audio into the production folder:

- Exact asset page URL and direct-download URL.
- Asset title, creator/uploader, source platform, and retrieval date.
- Exact license name and version; link to both the asset's license statement and canonical license text.
- Whether attribution is required and the exact credit line.
- Whether editing, redistribution, public performance, and commercial use are allowed.
- Any platform terms that add restrictions beyond the named license.
- A snapshot/PDF/text capture or screenshot of the asset page and license evidence, stored locally.
- Original filename and SHA-256 hash.
- Editing history, derived filename, final format, duration, loudness/peak measurements, and final SHA-256 hash.
- Reviewer and approval date.

Proposed evidence layout:

```text
assets/audio/originals/          # approved source files; not served directly
public/audio/                    # processed, shipped files
licenses/audio/ASSET-SLUG.md     # human-readable record per file
licenses/evidence/ASSET-SLUG/    # page/license snapshots
licenses/audio-ledger.csv        # machine-checkable inventory
THIRD_PARTY_NOTICES.md           # public attribution/notice rollup
```

### Research sequence

1. Search authoritative asset pages, not reposts or aggregator summaries.
2. Verify the license on the individual asset page and capture evidence before the page changes.
3. Check creator identity/provenance, license compatibility, trademarks, recognizable music/melodies, voices, and crowd privacy/publicity concerns.
4. Present a shortlist with preview links and license facts to the user; download only approved candidates.
5. Hash and preserve originals, trim silence, fade edges, convert, normalize, and document modifications.
6. Run a ledger completeness check that fails the build if any served audio lacks its record and notice.
7. Recheck the deployed Credits screen and repository notices against the ledger.

Creative Commons explains that its legal code is the legally operative layer, and CC BY requires credit, a license link, and disclosure of modifications. CC0 is preferred, but its no-warranty limitations still mean provenance must be checked.

## 5. Technical design for reliable phone audio

### Audio engine

- Use one lazily created `AudioContext` with `latencyHint: "interactive"` and Web Audio API buffers for all short clips.
- Fetch and decode all required audio into memory during preparation; do not wait for a match-time tap to fetch or decode a clip.
- Resume/create the context within the user's **Enable & test sound** tap. On any later pad tap, re-check `audioContext.state` and attempt `resume()` before playback.
- Route every source through a per-clip gain node into a master gain node, then a conservative safety compressor/limiter, then the destination.
- Track source nodes explicitly because an `AudioBufferSourceNode` is one-shot and must be recreated for every play.
- Use monotonic Web Audio time for progress and cleanup; UI timers are informational only.

Current browser guidance requires creating or resuming Web Audio from a user gesture, so readiness must never imply that the browser is already authorized to make sound. The first explicit test tap is part of the operating workflow, not an optional tutorial.

### Preloading and offline behavior

- Version the app shell and the complete audio pack separately.
- Precache the app shell; populate a versioned audio cache and verify every required response before showing `Offline ready`.
- Serve versioned audio cache-first. Never substitute one sound for another after a cache miss.
- Keep the previous complete pack until the new pack has fully downloaded; do not leave a partially updated match-day cache.
- Provide visible states: `Preparing sounds`, `Audio locked`, `Ready`, `Offline ready`, and `Needs attention`.
- Detect storage/cache failures and offer retry instructions. The soundboard may open if the UI is cached, but unavailable pads must be visibly disabled with a reason.

Service workers require HTTPS (localhost is allowed for development) and can provide an offline-first response from the Cache API. The readiness test must be application-level because browser storage can be cleared or evicted.

### File preparation

- Ship one broadly supported lossy format as the primary source (AAC/M4A or MP3) and add an Ogg/Opus alternative only if compatibility testing shows material value. Confirm actual target-device decoding before freezing the format.
- Prefer mono for PA effects unless stereo is materially audible through the venue system; mono reduces download/decode cost and avoids phase surprises.
- Remove excess leading silence; add 5–20ms edge fades to avoid clicks.
- Normalize offline to a consistent perceived level, initially targeting roughly -16 LUFS integrated and no peak above -1 dBTP, then verify by ear through the actual PA. Very short transient effects need human comparison because integrated loudness alone is misleading.
- Do not perform expensive runtime loudness analysis.

### Device and route behavior

- Support current iOS Safari/Home Screen PWA and Android Chrome as primary targets; feature-detect instead of user-agent-gating audio behavior.
- Treat interruption, screen lock, backgrounding, calls, Siri, route changes, and Bluetooth disconnects as possible suspension events. On return, show `Tap to re-enable audio` until a user gesture successfully resumes the context.
- Never promise background or locked-screen playback.
- The browser generally cannot choose the physical output. Provide procedural guidance and a test action; the operator selects/controls wired, Bluetooth, phone, or mixer routing at the OS/hardware level.
- Recommend a wired USB-C/Lightning audio interface or appropriate headphone adapter into the mixer. Bluetooth is a convenience fallback with unpredictable device/codec latency; test it at the venue and avoid timing-critical cues.
- Listen for page visibility/focus and audio-context state changes, stop stale sources on interruption, and make the UI reflect actual—not assumed—state.

### Error states

- Decode/fetch failure: disable that pad, name the affected file, offer `Retry sound pack`, keep working pads available.
- Context suspended: show a full-width `Tap to re-enable audio` control; never report a tap as played if it was blocked.
- Offline pack incomplete: persistent amber warning before match use.
- Output seems silent: checklist for phone mute/focus modes where relevant, hardware volume, PA input/mute, cable/Bluetooth route, and browser audio permission; then offer the quiet test chime.
- Unexpected exception: stop/clear all sources, return the master gain to a safe baseline, and keep **Stop All** functional.

## 6. Repository and staged build plan

Proposed repository: `spencerxsmith/waunakee-pa-helper`

```text
waunakee-pa-helper/
├── index.html
├── css/app.css
├── js/app.js
├── js/audio-engine.js
├── data/sounds.json
├── public/audio/
├── assets/audio/originals/
├── licenses/audio/
├── licenses/evidence/
├── licenses/audio-ledger.csv
├── THIRD_PARTY_NOTICES.md
├── manifest.webmanifest
├── sw.js
├── icons/
├── tests/
├── vercel.json
└── README.md
```

Keep runtime dependency-free. Development-only tooling is acceptable for tests and asset validation, but the deployed app should be static files with no backend, accounts, analytics, or environment variables.

### Stage 0 — decisions and venue check

- Confirm device models/browsers, PA connection method, acceptable clip list, logo/brand permission, and whether whistle/buzzer are authorized.
- Record the actual mixer/input/cable workflow and test venue constraints.

Acceptance: the open decisions at the end of this plan have owners and answers.

### Stage 1 — interaction shell with generated silent/test fixtures

- Build the visual shell, categories, favorites, sticky volume/Stop All, playing states, setup, credits, and install guidance.
- Use self-generated placeholder tones only; do not use unlicensed candidates.

Acceptance: at 320, 375, 390, and 430px widths, primary pads and Stop All remain fully usable with one hand; targets are at least 44×44px and primary controls larger; screen-reader labels and keyboard focus work; no horizontal scrolling.

### Stage 2 — audio engine and offline pack

- Add unlock/resume, decode/preload, monophonic playback, fades, progress, master gain, cache versioning, completeness verification, and errors.

Acceptance: first test tap works after a fresh load; subsequent warm taps begin without network access and feel immediate; rapid multi-pad tapping never produces overlap; Stop All silences audio promptly; incomplete caching is never labeled ready.

Performance target: on supported, representative phones with the sound pack prepared and audio unlocked, median app-side tap-to-start scheduling should be under 100ms. Measure separately from unavoidable Bluetooth/hardware latency.

### Stage 3 — licensed sound acquisition and processing

- Research, shortlist, obtain approval, download, document, process, and integrate each sound using the per-file gate.

Acceptance: every served audio file has a complete ledger row, evidence folder, source and final hash, modification record, and correct public attribution; no Mario/Nintendo recording or confusingly similar branded asset is present.

### Stage 4 — mobile and venue validation

- Test current iPhone Safari and installed PWA plus Android Chrome and installed PWA; test cold start, airplane mode, update, interruption/recovery, wired route, and at least one Bluetooth route.
- Verify through the actual Waunakee PA at a safe initial level.

Acceptance: all clips play and stop reliably; volume is consistent; no clipping or dangerous surprise level; route/interruption states are understandable; offline cold reopen works after preparation; operator completes a short rehearsal without developer help.

### Stage 5 — GitHub/Vercel release

- Finish icons/social metadata, README, notices, cache headers, deploy preview, production deployment, and rollback instructions.

Acceptance: HTTPS production URL is installable where supported; release commit/tag identifies sound-pack version; a fresh device can prepare offline, enter airplane mode, reopen, and play every V1 sound; deployment does not cache stale HTML/service-worker versions indefinitely.

## 7. Privacy, copyright, trademark, and operational risks

### Privacy

V1 needs no login, telemetry, microphone, contacts, location, roster, or personal data. Favorites, volume, dismissal state, and preferences remain on-device. Do not add analytics by default. If error reporting is later requested, make it opt-in and exclude audio/output/device identifiers beyond what is necessary.

### Copyright and license

- A sound recording and its underlying composition can have separate rights. Avoid recognizable songs, chants, broadcast packages, game audio, film/TV clips, and melody-based “sound-alikes.”
- Preserve proof for the exact file, not just the host website's general terms.
- Treat public performance and redistribution in the hosted PWA as required uses when vetting permissions.
- Do not assume school/event/noncommercial use is fair use.

### Trademark and identity

- Do not use Nintendo, Mario, or other game names/art/audio.
- Confirm authorization for official Waunakee Warriors marks, logos, and exact brand assets. Until confirmed, use text `Waunakee PA Helper`, the established purple palette, and a generic non-infringing icon.
- Do not imply official district endorsement without approval.

### Operational safety

- Audio can be startling or damaging through high-powered equipment. Start the app at 70% internal gain, test at low mixer gain, normalize assets conservatively, prevent overlap, and keep Stop All persistent.
- Whistles/buzzers can interfere with officiating. Include only with explicit venue/athletic approval and never label them as official match signals.

### Deliberately out of V1

- User audio uploads/recording and an in-app asset marketplace.
- Playlists, queues, auto-fire rules, looping, crossfades, simultaneous layers, and keyboard/MIDI/remote triggers.
- Scoreboard, timer, roster/announcements, text-to-speech, live microphone, streaming music, and copyrighted songs.
- Accounts, sharing/sync, admin CMS, cloud backend, analytics, ads, and push notifications.
- Native-app-only audio routing, background playback guarantees, and automatic Bluetooth selection.

## 8. Decisions required before implementation

Recommended defaults are shown first.

1. **Sound list:** approve the 12-sound starter pack, but remove Whistle and Final Buzzer unless the athletic department explicitly authorizes PA use.
2. **Connection:** design for wired PA output as the primary match-day route; treat Bluetooth as tested-but-non-timing-critical fallback.
3. **Branding:** use purple/text branding and a generic icon until explicit permission for an official Warriors logo is confirmed.
4. **Playback:** approve strict one-at-a-time playback, active-pad-to-restart, and no pause/loops.
5. **Default volume:** start at 70% internal volume, persist local changes, and retain hardware/mixer volume as the final control.
6. **Favorites:** seed Goal Horn, Applause, and Warriors Win; allow local starring without accounts.
7. **Target devices:** identify the actual announcer phone(s), browser/PWA mode, adapter/interface, mixer input, and any Bluetooth receiver for acceptance testing.
8. **Licenses:** approve CC0/public domain first, CC BY 4.0 as an acceptable fallback with visible credits, and reject ambiguous/custom/NC/ND/SA assets unless separately reviewed.
9. **Repository/deployment:** confirm public GitHub repository `spencerxsmith/waunakee-pa-helper` and Vercel hosting. A public repo makes complete third-party notices and redistributable asset rights mandatory.

Once these decisions are approved, implementation should begin with the UI/audio skeleton, while authoritative asset-page research proceeds through the licensing gate. No candidate audio should be committed or deployed before user approval and evidence capture.

## Planning references

- Existing local `waunakee-soccer` PWA, inspected read-only: its static deployment model, visual tokens, safe-area layout, install guidance, manifest, and service-worker structure are the design baseline.
- MDN, Web Audio API best practices: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
- MDN, `AudioContext.resume()`: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/resume
- MDN, Using Service Workers: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
- MDN, Making PWAs installable: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- Creative Commons, CC0 1.0 legal code: https://creativecommons.org/publicdomain/zero/1.0/legalcode.en
- Creative Commons, CC BY 4.0 deed/legal terms: https://creativecommons.org/licenses/by/4.0/
