const CACHE_NAME = "casino-pro-licencia-cas-v1";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  // licencias.json siempre se consulta a internet para que bloqueo/vencimiento tome efecto.
  if (event.request.url.includes("licencias.json")) {
    event.respondWith(fetch(event.request, { cache: "no-store" }));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
