# PA Helper — Genuine Audio Shortlist

Date: September 3, 2026
Status: approved and implemented as PA Helper audio pack 1.1.0

## Recommendation

Replace the generated pack with recordings of real horns, whistles, crowds, and instruments. Keep editing deliberately modest: select the best moment, trim silence, remove obvious handling noise, add short fades, and level-match for the PA. Avoid synthesizers, recognizable songs or team/broadcast material, and sources whose asset-level license is unclear.

The supplied `freesound_community-goalhornsforalert-26878 (1).mp3` is a useful sonic reference—dense harmonics, room character, and three convincing blasts—but should not ship. Its current Pixabay page uses the Pixabay Content License, whose standalone-content restriction is a poor fit for a PWA that serves each audio file directly. Its description also associates it with recognizable NHL teams.

## Recommended V1 mapping

Every web candidate below is explicitly marked CC0 on its original asset page. Attribution is therefore not legally required, but PA Helper should still credit creators and preserve a local copy of the asset page, license text, download date, source hash, edit recipe, and final-file hash.

| PA Helper button | Recommended source | Creator | Exact license | Proposed treatment |
|---|---|---|---|---|
| Goal Horn | [Industrial Air Horn](https://freesound.org/people/mcpable/sounds/131930/) | mcpable | CC0 1.0 | Use the real 2.57s Alberta oil-rig air horn as the core; trim tightly and retain its natural tail. |
| Goal Burst | [airhorn-short.wav](https://freesound.org/people/guitarguy1985/sounds/68999/) | guitarguy1985 | CC0 1.0 | Select the cleanest short horn event; target roughly 1.2–1.8s. |
| Final Buzzer | [School Bell - Fire Bell.wav](https://freesound.org/people/Dave%20Welsh/sounds/523317/) | Dave Welsh | CC0 1.0 | Use a short section of the real solenoid-striker bell; replace later with the actual Waunakee signal if an authorized recording becomes available. |
| Whistle | [metal whistle.wav](https://freesound.org/people/strongbot/sounds/568995/) | strongbot | CC0 1.0 | Select one high-power, tongued blast from an unprocessed Zoom H5 recording; keep under 1s. |
| Big Cheer | [Crowd Cheer 5](https://freesound.org/people/Krizin/sounds/651646/) | Krizin | CC0 1.0 | Use a 3–5s section of a real Friday-night football crowd. Reject if audition reveals music or distinct speech. |
| Applause | Keep [Applause after a concert](https://commons.wikimedia.org/wiki/File:Sound_Effects_-_Applause_after_a_concert.ogg) | Amada44 | CC0 1.0 | Already a genuine recording in the app; re-check the selected edit against the new pack. |
| Crowd Rise | [072510_distant_cheer.wav](https://freesound.org/people/moxobna/sounds/102108/) | moxobna | CC0 1.0 | Select a natural 2–4s swell from the binaural field recording; do not manufacture a rise with an obvious volume ramp. |
| Aw, So Close | [Crowd gasp.wav](https://freesound.org/people/RadioCounseling/sounds/635110/) | RadioCounseling | CC0 1.0 | Use the performed 14-voice human reaction; replace later with Waunakee volunteers if desired. |
| Warriors Win | [Clean Trumpet Fanfare](https://freesound.org/people/joepayne/sounds/413201/) | joepayne | CC0 1.0 | Real trumpet recorded with a Rode NT2. Use largely intact; optionally end with one real cymbal crash. |
| Hype Hit | [Acoustic kick](https://freesound.org/people/karolist/sounds/371192/) + [CymbalHit4](https://freesound.org/people/ceich93/sounds/315628/) | karolist + ceich93 | CC0 1.0 | Layer one real studio bass-drum hit with one real Zildjian crash. No synthetic sub-drop. |
| Drum Charge | [snare roll hit crash](https://freesound.org/people/zemidlo/sounds/165523/) | zemidlo | CC0 1.0 | Cut a punchy 2–4s passage from the real Ludwig snare/Zildjian recording. |
| Coin Chime | [f#1 glockenspiel note](https://freesound.org/people/angstrom/sounds/11085/) plus a second physical note from the same CC0 pack | angstrom | CC0 1.0 | Build a generic two-note ascending cue from two real glockenspiel strikes. Do not copy Mario timing, pitches, melody, name, or recording. |

## Strong alternates

- Goal Horn: [airhorn-short.wav](https://freesound.org/people/guitarguy1985/sounds/68999/) by guitarguy1985, CC0.
- Whistle: [Referee whistle blow, gymnasium.wav](https://freesound.org/people/SpliceSound/sounds/218318/) by SpliceSound, CC0. It is genuine, but its indoor reflections may feel wrong on a soccer field.
- Big Cheer: [Crowd Cheer](https://freesound.org/people/FoolBoyMedia/sounds/397434/) by FoolBoyMedia, CC0, recorded at a football/sports match with a Tascam DR-05.
- More intimate cheer: [small crowd cheering](https://freesound.org/people/HowardV/sounds/264377/) by HowardV, CC0, a real group of about 20 people recorded for an amateur football production.
- Drum Charge: [drumroll.aif](https://freesound.org/people/Heigh-hoo/sounds/19433/) by Heigh-hoo, CC0, recorded from a Sonor snare with an SM57 and FR-2.
- Coin Chime: [Triangle](https://freesound.org/people/brunoboselli/sounds/468752/) by brunoboselli, CC0, a physical triangle and finger-cymbal recording. It is genuine but less “coin-like” than glockenspiel.

## Deliberate exclusions

- The supplied Pixabay goal-horn MP3: reference only; license/distribution fit and recognizable-team provenance are not clean enough.
- Any stadium recording containing audible songs, PA announcements, broadcasts, or identifiable chants—even if the uploader marked the recording CC0.
- Freesound assets described as generated in Audacity, BeepBox, LMMS, FL Studio, or software instruments.
- “Royalty-free,” “open-source,” or library-wide claims without an exact license on the individual asset page.
- Nintendo/Mario coin audio and close sound-alikes.

## What makes the replacement pack sound genuine

1. Start with physical events. The source should document a real horn, whistle, crowd, drum, cymbal, trumpet, bell, or glockenspiel and preferably identify the recorder or microphone.
2. Preserve imperfections that communicate scale: breath onset, valve noise, stick attack, room/field reflections, crowd timing variation, and natural decay.
3. Avoid heavy cleanup. High-pass only true rumble, remove isolated handling noise, and avoid aggressive denoising that creates watery artifacts.
4. Use short, event-appropriate edits. Horn 2–4s, whistle under 1s, crowd 3–5s, stingers 1–5s. Use a 5–15ms head fade only when needed and an 80–250ms tail fade that does not amputate the room decay.
5. Level-match by ear through the actual PA after conservative normalization. Start around −14 LUFS integrated and no higher than −1 dB true peak, then lower whistle/high-frequency clips if they feel sharper than the horn. Do not chase identical LUFS numbers across radically different transients.
6. Keep mono compatibility. Check every stereo source summed to mono because many booth/mixer/PA paths are effectively mono.
7. Test in context. Audition from the announcer’s phone through the intended cable/interface and mixer, both in an empty venue and during crowd noise.

## Implemented selection

The implemented set uses Industrial Air Horn, airhorn-short, a recorded solenoid-striker bell, metal whistle, Crowd Cheer 5, distant cheer, a performed 14-voice group gasp, Clean Trumpet Fanfare, acoustic kick + CymbalHit4, snare roll hit crash, and angstrom's physical glockenspiel recordings. The existing genuine applause remains.

Source encodes and license evidence are saved locally. The normalized derivatives, ledger, public notices, and offline cache version were updated together.
