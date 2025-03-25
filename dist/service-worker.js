const CACHE_NAME = "tezgah-hesaplama-v1";
const urlsToCache = [
  "/",
  "/static/js/main.chunk.js",
  "/static/js/vendors~main.chunk.js",
  "/static/js/bundle.js",
  "/index.html",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});