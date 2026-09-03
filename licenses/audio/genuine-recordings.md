# Genuine recording sources

Retrieved and reviewed: 2026-09-03

All Freesound sources below are marked **Creative Commons CC0 1.0** on their individual asset pages. Attribution is not required. Credit is provided voluntarily. The downloaded masters are Freesound's public high-quality MP3 preview encodes of the licensed sounds. Each evidence directory contains the saved asset page and CC0 legal code.

| Source slug | Sound(s) served | Creator | Asset page | Downloaded source SHA-256 | Evidence directory |
|---|---|---|---|---|---|
| industrial-air-horn | Goal Horn | mcpable | https://freesound.org/people/mcpable/sounds/131930/ | `a73670ddeee9bed590c19a928715a4ed866893992c849261d7acbc37e8966a9a` | `licenses/evidence/industrial-air-horn/` |
| airhorn-short | Goal Burst | guitarguy1985 | https://freesound.org/people/guitarguy1985/sounds/68999/ | `923e16986a490bc397bce1f996133110fff5be993a8807f1569d101637e7a0a2` | `licenses/evidence/airhorn-short/` |
| solenoid-bell | Final Buzzer | Dave Welsh | https://freesound.org/people/Dave%20Welsh/sounds/523317/ | `f9954e2b745033e95e1f2d2aad006ec94ae490c2b536a19fe3d77f3f171b72bf` | `licenses/evidence/solenoid-bell/` |
| metal-whistle | Whistle | strongbot | https://freesound.org/people/strongbot/sounds/568995/ | `f2a730ed5678fa0958a291fe934b5c1dda0324a9324a92da845932a3bba67812` | `licenses/evidence/metal-whistle/` |
| crowd-cheer-5 | Big Cheer | Krizin | https://freesound.org/people/Krizin/sounds/651646/ | `417e0bcc7d22a6e3c2906ad53df5b373fcd950920834950c1cfa586b16249e8d` | `licenses/evidence/crowd-cheer-5/` |
| distant-cheer | Crowd Rise | moxobna | https://freesound.org/people/moxobna/sounds/102108/ | `48967145b8776163ad84287432f456b7950d7a679a9948339831db63678c4df1` | `licenses/evidence/distant-cheer/` |
| group-gasp | Aw, So Close | RadioCounseling | https://freesound.org/people/RadioCounseling/sounds/635110/ | `2394d843ba128b60d1404eb9e934fa502a6a7bc77857ef865bc5a58fddde4f2c` | `licenses/evidence/group-gasp/` |
| clean-trumpet-fanfare | Warriors Win | joepayne | https://freesound.org/people/joepayne/sounds/413201/ | `2dd2a48d189bb3057ab859461574dcbd73dab1445b5da7b934174f440083192b` | `licenses/evidence/clean-trumpet-fanfare/` |
| acoustic-kick | Hype Hit | karolist | https://freesound.org/people/karolist/sounds/371192/ | `f5fb5a132c74157cca20e64024282d61044235a31bf39642b7f42ebbb6801129` | `licenses/evidence/acoustic-kick/` |
| zildjian-cymbal | Warriors Win; Hype Hit | ceich93 | https://freesound.org/people/ceich93/sounds/315628/ | `058ab48a503eec3f48685fa957b9aa845d76bd4de29e13b62c317390b59f572a` | `licenses/evidence/zildjian-cymbal/` |
| snare-roll-crash | Drum Charge | zemidlo | https://freesound.org/people/zemidlo/sounds/165523/ | `a9d1ba1377f2bb9ce18d97dfd328884ba2812e9d220e30eb394954d906c2a7ae` | `licenses/evidence/snare-roll-crash/` |
| glockenspiel-f-sharp | Coin Chime | angstrom | https://freesound.org/people/angstrom/sounds/11085/ | `6be5a5df418a1cd7b755489336ec9e772b9692e036296d22211f5c98de121f8f` | `licenses/evidence/glockenspiel-f-sharp/` |
| glockenspiel-g-sharp | Coin Chime | angstrom | https://freesound.org/people/angstrom/sounds/11087/ | `90cb103a82ce9afeb07ef9089ce2fe9379186fcb689520123fb881727f3b5397` | `licenses/evidence/glockenspiel-g-sharp/` |

## Processing

`work/process_genuine_sounds.sh` is the reproducible edit recipe. Work is limited to selection/trimming, short fades, conservative loudness normalization, MP3 encoding, and—in three cases—layering two real recordings. No synthesized tone generator is used.

- Goal Horn: complete 2.571-second horn; target -13 LUFS / -1 dBTP.
- Goal Burst: 1.67 seconds of the short air horn; target -13 LUFS / -1 dBTP.
- Final Buzzer: 2.72 seconds from the solenoid-striker bell; target -14 LUFS / -1 dBTP.
- Whistle: one 0.72-second physical whistle blast; target -17 LUFS / -2 dBTP to reduce PA harshness.
- Big Cheer: 5.2 seconds; natural stereo retained; target -15 LUFS / -1 dBTP.
- Crowd Rise: natural four-second swell; target -15 LUFS / -1 dBTP.
- Aw, So Close: complete 1.602-second human reaction; target -16 LUFS / -1 dBTP.
- Warriors Win: real trumpet with a delayed real cymbal ending; target -14 LUFS / -1 dBTP.
- Hype Hit: real acoustic kick and real cymbal; target -14 LUFS / -1 dBTP.
- Drum Charge: four seconds spanning the real snare crescendo and crash; target -14 LUFS / -1 dBTP.
- Coin Chime: two real glockenspiel notes 340 ms apart; target -18 LUFS / -2 dBTP.

Applause remains documented separately in `licenses/audio/applause.md`.
