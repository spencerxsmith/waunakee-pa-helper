const APP_CACHE = "pa-helper-app-v1.1.0";
const AUDIO_CACHE = "pa-helper-audio-v1.1.0";
const APP_SHELL = [
  "./", "./index.html", "./css/app.css", "./js/app.js", "./js/audio-engine.js",
  "./data/sounds.json", "./manifest.webmanifest", "./icons/icon.svg",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png",
  "./THIRD_PARTY_NOTICES.md"
];
const AUDIO_PACK = [
  "./public/audio/goal-horn.mp3?v=1.1.0", "./public/audio/goal-burst.mp3?v=1.1.0",
  "./public/audio/final-buzzer.mp3?v=1.1.0", "./public/audio/whistle.mp3?v=1.1.0",
  "./public/audio/big-cheer.mp3?v=1.1.0", "./public/audio/applause.mp3?v=1.1.0",
  "./public/audio/crowd-rise.mp3?v=1.1.0", "./public/audio/aw-so-close.mp3?v=1.1.0",
  "./public/audio/warriors-win.mp3?v=1.1.0", "./public/audio/hype-hit.mp3?v=1.1.0",
  "./public/audio/drum-charge.mp3?v=1.1.0", "./public/audio/coin-chime.mp3?v=1.1.0"
];

self.addEventListener("install", event => {
  event.waitUntil(Promise.all([
    caches.open(APP_CACHE).then(cache => cache.addAll(APP_SHELL)),
    caches.open(AUDIO_CACHE).then(cache => cache.addAll(AUDIO_PACK))
  ]).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  const current = new Set([APP_CACHE, AUDIO_CACHE]);
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => !current.has(key)).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes("/public/audio/")) {
    event.respondWith(caches.match(event.request, { ignoreSearch: true }).then(cached => cached || fetch(event.request)));
    return;
  }
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone();
      event.waitUntil(caches.open(APP_CACHE).then(cache => cache.put("./index.html", copy)));
      return response;
    }).catch(() => caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(event.request, { ignoreSearch: true }).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    event.waitUntil(caches.open(APP_CACHE).then(cache => cache.put(event.request, copy)));
    return response;
  })));
});
