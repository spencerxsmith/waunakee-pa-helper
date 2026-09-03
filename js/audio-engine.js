export class AudioEngine extends EventTarget {
  constructor() {
    super();
    this.context = null;
    this.master = null;
    this.compressor = null;
    this.buffers = new Map();
    this.failures = new Map();
    this.current = null;
    this.volume = 0.7;
    this.generation = 0;
    this.fadePromise = Promise.resolve();
  }

  ensureContext() {
    if (this.context && this.context.state !== "closed") return this.context;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error("Web Audio is not supported on this device.");
    this.context = new AudioContextClass({ latencyHint: "interactive" });
    this.master = this.context.createGain();
    this.compressor = this.context.createDynamicsCompressor();
    this.compressor.threshold.value = -8;
    this.compressor.knee.value = 8;
    this.compressor.ratio.value = 10;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.2;
    this.master.gain.value = this.volume;
    this.master.connect(this.compressor).connect(this.context.destination);
    this.context.addEventListener("statechange", () => this.emit("contextstate", { state: this.context.state }));
    return this.context;
  }

  async load(sounds, { cacheBust = false } = {}) {
    const context = this.ensureContext();
    this.failures.clear();
    const results = await Promise.allSettled(sounds.map(async sound => {
      const suffix = cacheBust ? `${sound.file.includes("?") ? "&" : "?"}reload=${Date.now()}` : "";
      const response = await fetch(sound.file + suffix, { cache: cacheBust ? "reload" : "default" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = await context.decodeAudioData(await response.arrayBuffer());
      this.buffers.set(sound.id, buffer);
      return sound.id;
    }));
    results.forEach((result, index) => {
      if (result.status === "rejected") this.failures.set(sounds[index].id, result.reason?.message || "Could not load");
    });
    this.emit("loadstate", { loaded: this.buffers.size, failed: this.failures.size });
    return { loaded: this.buffers.size, failed: this.failures.size };
  }

  async unlock() {
    const context = this.ensureContext();
    if (context.state === "suspended") {
      const silent = context.createBufferSource();
      silent.buffer = context.createBuffer(1, 1, 22050);
      silent.connect(this.master);
      silent.start(0);
      await context.resume();
    }
    if (context.state !== "running") throw new Error("Sound could not start on this tap.");
    return true;
  }

  prime() {
    return this.unlock();
  }

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.master && this.context) {
      this.master.gain.cancelScheduledValues(this.context.currentTime);
      this.master.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.012);
    }
  }

  async play(sound) {
    await this.unlock();
    const buffer = this.buffers.get(sound.id);
    if (!buffer) throw new Error(this.failures.get(sound.id) || "This sound is not ready.");
    const token = ++this.generation;
    await this.stop({ fadeMs: 38, preserveGeneration: true });
    if (token !== this.generation) return;

    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    source.buffer = buffer;
    gain.gain.setValueAtTime(1, this.context.currentTime);
    source.connect(gain).connect(this.master);
    const startedAt = this.context.currentTime;
    const current = { id: sound.id, sound, source, gain, startedAt, duration: buffer.duration, token };
    this.current = current;
    source.addEventListener("ended", () => {
      if (this.current?.token !== token) return;
      this.current = null;
      this.emit("ended", { id: sound.id });
    }, { once: true });
    source.start();
    this.emit("playing", { id: sound.id, name: sound.name, duration: buffer.duration, startedAt });
  }

  stop({ fadeMs = 45, preserveGeneration = false } = {}) {
    if (!preserveGeneration) this.generation += 1;
    const active = this.current;
    if (!active || !this.context) return this.fadePromise;
    this.current = null;
    const now = this.context.currentTime;
    const stopAt = now + fadeMs / 1000;
    active.gain.gain.cancelScheduledValues(now);
    active.gain.gain.setValueAtTime(active.gain.gain.value, now);
    active.gain.gain.linearRampToValueAtTime(0.0001, stopAt);
    try { active.source.stop(stopAt + .005); } catch {}
    this.emit("stopped", { id: active.id });
    this.fadePromise = new Promise(resolve => setTimeout(resolve, fadeMs + 7));
    return this.fadePromise;
  }

  getCurrentProgress() {
    if (!this.current || !this.context) return null;
    const elapsed = Math.max(0, this.context.currentTime - this.current.startedAt);
    return { elapsed, duration: this.current.duration, remaining: Math.max(0, this.current.duration - elapsed) };
  }

  emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail }));
  }
}
