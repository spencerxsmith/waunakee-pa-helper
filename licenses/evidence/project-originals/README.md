# Project-original evidence

The source-of-truth generator is [`work/generate_original_sounds.py`](../../../work/generate_original_sounds.py). It uses only mathematical oscillators, deterministic pseudorandom noise, and amplitude envelopes. The fixed random seed makes its results reproducible.

The generated source WAVs are preserved in `assets/audio/originals/`. SHA-256 hashes for both source and shipped files are recorded in `licenses/audio/project-originals.md` and `licenses/audio-ledger.csv`.
