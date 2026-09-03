const APP_CACHE = "pa-helper-app-v1.2.1";
const AUDIO_CACHE = "pa-helper-audio-v1.2.1";
const APP_SHELL = [
  "./", "./index.html", "./css/app.css?v=1.2.1", "./js/app.js?v=1.2.1", "./js/audio-engine.js?v=1.2.1",
  "./data/sounds.json?v=1.2.1", "./manifest.webmanifest?v=1.2.1", "./icons/icon.svg?v=1.2.1",
  "./icons/icon-192.png?v=1.2.1", "./icons/icon-512.png?v=1.2.1", "./icons/apple-touch-icon.png?v=1.2.1",
  "./THIRD_PARTY_NOTICES.md?v=1.2.1"
];
const AUDIO_PACK = [
  "./public/audio/goal-horn.mp3?v=1.2.1", "./public/audio/goal-burst.mp3?v=1.2.1",
  "./public/audio/final-buzzer.mp3?v=1.2.1", "./public/audio/whistle.mp3?v=1.2.1",
  "./public/audio/big-cheer.mp3?v=1.2.1", "./public/audio/applause.mp3?v=1.2.1",
  "./public/audio/crowd-rise.mp3?v=1.2.1", "./public/audio/aw-so-close.mp3?v=1.2.1",
  "./public/audio/warriors-win.mp3?v=1.2.1", "./public/audio/hype-hit.mp3?v=1.2.1",
  "./public/audio/drum-charge.mp3?v=1.2.1", "./public/audio/coin-chime.mp3?v=1.2.1"
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
