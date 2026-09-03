import { AudioEngine } from "./audio-engine.js";

const APP_VERSION = "1.1.0";
const FAVORITES_KEY = "pa-helper-favorites-v1";
const VOLUME_KEY = "pa-helper-volume-v1";
const HAPTICS_KEY = "pa-helper-haptics-v1";
const CATEGORIES = [
  ["favorites", "★ Favorites"],
  ["match", "Match"],
  ["crowd", "Crowd"],
  ["stingers", "Stingers"],
  ["all", "All sounds"]
];
const ICONS = { horn: "◖", burst: "✦", buzzer: "■", whistle: "⌁", cheer: "🙌", applause: "👏", rise: "↗", close: "○", trophy: "♛", hype: "⚡", drum: "◉", coin: "◆" };
const $ = id => document.getElementById(id);

let manifest;
let sounds = [];
let category = "favorites";
let favorites = new Set();
let deferredInstallPrompt = null;
let progressFrame = null;
let toastTimer = null;
const engine = new AudioEngine();

function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function saveLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function setStatus(mode, title, detail, action = false) {
  $("statusDot").className = `status-dot ${mode === "ready" ? "ready" : mode === "error" ? "error" : ""}`;
  $("statusTitle").textContent = title;
  $("statusDetail").textContent = detail;
  $("enableAudio").hidden = !action;
}

function announce(message) {
  $("toast").textContent = message;
  $("toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $("toast").hidden = true; }, 2400);
}

function initCategories() {
  $("categoryTabs").innerHTML = CATEGORIES.map(([id, label]) =>
    `<button class="category-tab" type="button" data-category="${id}" aria-selected="${id === category}">${label}</button>`
  ).join("");
  $("categoryTabs").addEventListener("click", event => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    category = button.dataset.category;
    document.querySelectorAll(".category-tab").forEach(tab => tab.setAttribute("aria-selected", String(tab === button)));
    renderSounds();
  });
}

function displayedSounds() {
  if (category === "favorites") return sounds.filter(sound => favorites.has(sound.id));
  if (category === "all") return sounds;
  return sounds.filter(sound => sound.category === category);
}

function renderSounds() {
  const selected = displayedSounds();
  const categoryLabel = CATEGORIES.find(([id]) => id === category)?.[1].replace("★ ", "") || "Sounds";
  $("sectionKicker").textContent = category === "favorites" ? "QUICK ACCESS" : category === "match" ? "MATCH-DAY CUES" : "SOUND PACK";
  $("sectionTitle").textContent = categoryLabel;
  $("soundCount").textContent = `${selected.length} sound${selected.length === 1 ? "" : "s"}`;
  $("emptyState").hidden = selected.length !== 0;
  $("soundGrid").hidden = selected.length === 0;
  $("soundGrid").innerHTML = selected.map(sound => {
    const isFavorite = favorites.has(sound.id);
    const failed = engine.failures.has(sound.id);
    return `<article class="sound-card${engine.current?.id === sound.id ? " playing" : ""}" data-sound-id="${sound.id}">
      <button class="sound-play" type="button" data-play="${sound.id}" aria-label="${failed ? `${sound.name}, unavailable` : `Play ${sound.name}`}" ${failed ? "disabled" : ""}>
        <span class="sound-icon" aria-hidden="true">${ICONS[sound.icon] || "▶"}</span>
        <strong class="sound-name">${sound.name}</strong>
        <span class="sound-subtitle">${engine.current?.id === sound.id ? "PLAYING" : failed ? "UNAVAILABLE" : sound.subtitle}</span>
      </button>
      <button class="favorite-button${isFavorite ? " active" : ""}" type="button" data-favorite="${sound.id}" aria-label="${isFavorite ? "Remove" : "Add"} ${sound.name} ${isFavorite ? "from" : "to"} favorites" aria-pressed="${isFavorite}">${isFavorite ? "★" : "☆"}</button>
      ${sound.caution ? '<span class="caution-flag" aria-label="Authorized use only">!</span>' : ""}
    </article>`;
  }).join("");
}

function toggleFavorite(id) {
  if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
  saveLocal(FAVORITES_KEY, [...favorites]);
  renderSounds();
}

async function playSound(id) {
  const sound = sounds.find(item => item.id === id);
  if (!sound || engine.failures.has(id)) return announce("That sound is not available. Reload the sound pack in Setup.");
  try {
    await engine.play(sound);
    if ($("hapticsToggle").checked && navigator.vibrate) navigator.vibrate(18);
    updateDiagnostics();
  } catch (error) {
    setStatus("error", "Tap to re-enable audio", error.message, true);
    announce(error.message);
  }
}

function wireSoundGrid() {
  $("soundGrid").addEventListener("click", event => {
    const favorite = event.target.closest("button[data-favorite]");
    if (favorite) { event.stopPropagation(); toggleFavorite(favorite.dataset.favorite); return; }
    const play = event.target.closest("button[data-play]");
    if (play) playSound(play.dataset.play);
  });
}

function updatePlayingUI(id, name, duration) {
  renderSounds();
  $("nowPlaying").hidden = false;
  $("nowPlayingName").textContent = name;
  $("timeRemaining").textContent = formatTime(duration);
  cancelAnimationFrame(progressFrame);
  const frame = () => {
    const progress = engine.getCurrentProgress();
    if (!progress) return;
    const percent = Math.min(100, progress.elapsed / progress.duration * 100);
    $("progressBar").style.width = `${percent}%`;
    $("timeRemaining").textContent = formatTime(progress.remaining);
    document.querySelector(`[data-sound-id="${id}"]`)?.style.setProperty("--play-progress", `${percent}%`);
    progressFrame = requestAnimationFrame(frame);
  };
  progressFrame = requestAnimationFrame(frame);
}

function clearPlayingUI() {
  cancelAnimationFrame(progressFrame);
  $("nowPlaying").hidden = true;
  $("progressBar").style.width = "0";
  renderSounds();
}

function formatTime(seconds) {
  return `0:${Math.max(0, Math.ceil(seconds)).toString().padStart(2, "0")}`;
}

async function enableAndTest() {
  const testSound = sounds.find(sound => sound.id === "coin-chime");
  try {
    if (!testSound || !engine.buffers.has(testSound.id)) throw new Error("The test sound is not ready yet.");
    await engine.play(testSound);
    setStatus("ready", "Audio ready", navigator.onLine ? "Sound pack prepared for offline use" : "Offline sound pack ready");
    updateDiagnostics();
  } catch (error) {
    setStatus("error", "Audio needs attention", error.message, true);
    announce(error.message);
  }
}

function updateDiagnostics() {
  const complete = sounds.length > 0 && engine.buffers.size === sounds.length && engine.failures.size === 0;
  $("packDiagnostic").textContent = complete ? `${sounds.length}/${sounds.length} ready` : `${engine.buffers.size}/${sounds.length} ready`;
  $("audioDiagnostic").textContent = engine.context?.state === "running" ? "Enabled" : "Tap to enable";
  $("networkDiagnostic").textContent = navigator.onLine ? "Online" : "Offline";
  $("versionDiagnostic").textContent = `${APP_VERSION} · Pack ${manifest?.version || "—"}`;
  $("readinessPill").textContent = complete ? "Pack ready" : "Needs attention";
  $("readinessPill").classList.toggle("ready", complete);
}

function showSettings(show) {
  $("soundboardView").hidden = show;
  $("settingsView").hidden = !show;
  $("openSettings").hidden = show;
  if (show) { updateDiagnostics(); $("closeSettings").focus(); }
  else $("openSettings").focus();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function setupInstall() {
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  if (standalone) { $("installCard").hidden = true; return; }
  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isiOS) {
    $("installCopy").textContent = "In Safari, tap Share, then Add to Home Screen. Open the new icon once online to prepare sounds.";
    $("installButton").hidden = true;
  }
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault(); deferredInstallPrompt = event; $("installButton").hidden = false;
  });
  $("installButton").addEventListener("click", async () => {
    if (!deferredInstallPrompt) return announce("Use your browser menu and choose Install app or Add to Home Screen.");
    deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt = null;
  });
  window.addEventListener("appinstalled", () => { $("installCard").hidden = true; announce("PA Helper installed."); });
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try { await navigator.serviceWorker.register("./sw.js"); } catch (error) { console.warn("Offline service worker unavailable", error); }
}

async function prepare({ reload = false } = {}) {
  setStatus("loading", "Preparing sounds", reload ? "Refreshing the complete sound pack…" : "Checking the match-day pack…");
  try {
    const response = await fetch("data/sounds.json", { cache: reload ? "reload" : "default" });
    if (!response.ok) throw new Error("Could not read the sound pack manifest.");
    manifest = await response.json();
    sounds = manifest.sounds;
    const savedFavorites = readLocal(FAVORITES_KEY, null);
    if (!savedFavorites) favorites = new Set(sounds.filter(sound => sound.defaultFavorite).map(sound => sound.id));
    else favorites = new Set(savedFavorites.filter(id => sounds.some(sound => sound.id === id)));
    renderSounds();
    const result = await engine.load(sounds, { cacheBust: reload });
    if (result.failed) setStatus("error", `${result.failed} sound${result.failed === 1 ? "" : "s"} unavailable`, "Open Setup to retry the sound pack");
    else setStatus("loading", "Sound pack ready", "Tap Enable & test before kickoff", true);
    renderSounds(); updateDiagnostics();
  } catch (error) {
    setStatus("error", "Sound pack unavailable", error.message);
    announce(error.message);
  }
}

function init() {
  const storedVolume = Number(readLocal(VOLUME_KEY, 70));
  const volume = Number.isFinite(storedVolume) ? Math.max(0, Math.min(100, storedVolume)) : 70;
  $("masterVolume").value = volume;
  $("volumeValue").textContent = `${volume}%`;
  $("masterVolume").style.background = `linear-gradient(90deg,var(--purple) 0 ${volume}%,#393d49 ${volume}%) center / 100% 5px no-repeat`;
  engine.setVolume(volume / 100);
  $("hapticsToggle").checked = readLocal(HAPTICS_KEY, true);
  initCategories(); wireSoundGrid(); setupInstall();
  $("masterVolume").addEventListener("input", event => {
    const value = Number(event.target.value);
    engine.setVolume(value / 100); $("volumeValue").textContent = `${value}%`;
    event.target.style.background = `linear-gradient(90deg,var(--purple) 0 ${value}%,#393d49 ${value}%) center / 100% 5px no-repeat`;
    saveLocal(VOLUME_KEY, value);
  });
  $("hapticsToggle").addEventListener("change", event => saveLocal(HAPTICS_KEY, event.target.checked));
  $("stopAll").addEventListener("click", () => engine.stop());
  $("nowPlayingStop").addEventListener("click", () => engine.stop());
  $("enableAudio").addEventListener("click", enableAndTest);
  $("settingsTest").addEventListener("click", enableAndTest);
  $("reloadPack").addEventListener("click", () => prepare({ reload: true }));
  $("openSettings").addEventListener("click", () => showSettings(true));
  $("closeSettings").addEventListener("click", () => showSettings(false));
  engine.addEventListener("playing", event => updatePlayingUI(event.detail.id, event.detail.name, event.detail.duration));
  engine.addEventListener("ended", clearPlayingUI);
  engine.addEventListener("stopped", clearPlayingUI);
  engine.addEventListener("contextstate", event => {
    updateDiagnostics();
    if (event.detail.state === "suspended" && document.visibilityState === "visible") setStatus("error", "Tap to re-enable audio", "The browser suspended the audio engine", true);
  });
  window.addEventListener("online", updateDiagnostics);
  window.addEventListener("offline", updateDiagnostics);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) engine.stop();
    else {
      updateDiagnostics();
      if (engine.context?.state === "suspended") setStatus("error", "Tap to re-enable audio", "Audio paused while the app was away", true);
    }
  });
  registerServiceWorker(); prepare();
}

init();
