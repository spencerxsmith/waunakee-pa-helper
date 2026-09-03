import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const failures = [];
const pass = message => console.log(`✓ ${message}`);
const fail = message => failures.push(message);
const read = path => readFileSync(resolve(root, path), "utf8");

const required = [
  "index.html", "css/app.css", "js/app.js", "js/audio-engine.js", "data/sounds.json",
  "manifest.webmanifest", "sw.js", "vercel.json", "icons/icon-192.png", "icons/icon-512.png",
  "icons/apple-touch-icon.png", "THIRD_PARTY_NOTICES.md", "licenses/audio-ledger.csv"
];
for (const path of required) existsSync(resolve(root, path)) ? pass(path) : fail(`Missing ${path}`);

const manifest = JSON.parse(read("data/sounds.json"));
if (manifest.sounds.length === 12) pass("sound manifest has 12 clips"); else fail(`Expected 12 sounds, found ${manifest.sounds.length}`);
if (new Set(manifest.sounds.map(sound => sound.id)).size === manifest.sounds.length) pass("sound IDs are unique"); else fail("Duplicate sound IDs");

const sw = read("sw.js");
const ledger = read("licenses/audio-ledger.csv");
for (const asset of ["css/app.css", "js/app.js", "js/audio-engine.js", "data/sounds.json"]) {
  if (!sw.includes(`./${asset}?v=${manifest.version}`)) fail(`Service worker does not version ${asset}`);
}
const ledgerEntries = new Map();
for (const line of ledger.trim().split("\n").slice(1)) {
  const match = line.match(/,(public\/audio\/[^,]+),([0-9a-f]{64}),\d{4}-\d{2}-\d{2}$/);
  if (match) ledgerEntries.set(match[1], match[2]);
}

for (const sound of manifest.sounds) {
  const fullPath = resolve(root, sound.file);
  if (!existsSync(fullPath)) { fail(`Missing audio: ${sound.file}`); continue; }
  if (!sw.includes(`./${sound.file}?v=${manifest.version}`)) fail(`Service worker does not version and precache ${sound.file}`);
  const expectedHash = ledgerEntries.get(sound.file);
  const actualHash = createHash("sha256").update(readFileSync(fullPath)).digest("hex");
  if (!expectedHash) fail(`No ledger record for ${sound.file}`);
  else if (expectedHash !== actualHash) fail(`Hash mismatch for ${sound.file}`);
  const probe = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", fullPath], { encoding: "utf8" });
  const duration = Number(probe.stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0 || duration > 10) fail(`Invalid duration for ${sound.file}: ${duration}`);
}
if (!failures.some(item => item.includes("audio") || item.includes("ledger") || item.includes("Hash") || item.includes("duration"))) pass("all audio files are cached, licensed, hashed, and under 10 seconds");

const html = read("index.html");
for (const id of ["stopAll", "masterVolume", "soundGrid", "nowPlaying", "settingsView"]) {
  if (!html.includes(`id="${id}"`)) fail(`Missing required UI control #${id}`);
}
if (html.includes("Mario") || html.includes("Nintendo")) fail("Product UI must not use third-party game trademarks");
else pass("product UI contains no Nintendo/Mario references");

for (const script of ["js/app.js", "js/audio-engine.js"]) {
  const checked = spawnSync(process.execPath, ["--check", resolve(root, script)], { encoding: "utf8" });
  if (checked.status !== 0) fail(`${script} syntax error: ${checked.stderr.trim()}`);
  else pass(`${script} parses`);
}

const evidenceSlugs = [
  "industrial-air-horn", "airhorn-short", "solenoid-bell", "metal-whistle",
  "crowd-cheer-5", "distant-cheer", "group-gasp", "clean-trumpet-fanfare",
  "acoustic-kick", "zildjian-cymbal", "snare-roll-crash",
  "glockenspiel-f-sharp", "glockenspiel-g-sharp"
];
for (const evidence of [
  "licenses/evidence/applause-concert/asset-page.html",
  "licenses/evidence/applause-concert/cc0-1.0-legalcode.html",
  ...evidenceSlugs.flatMap(slug => [
    `licenses/evidence/${slug}/asset-page.html`,
    `licenses/evidence/${slug}/cc0-1.0-legalcode.html`
  ])
]) existsSync(resolve(root, evidence)) ? pass(evidence) : fail(`Missing license evidence: ${evidence}`);

if (failures.length) {
  console.error("\nStatic checks failed:");
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}
console.log("\nAll static checks passed.");
