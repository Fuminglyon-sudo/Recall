const CACHE = "recall-v1";

// Pages to pre-cache so the shell loads offline
const PRECACHE = ["/", "/today", "/countries", "/free-recall"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests from this origin
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // API calls — always go to network, never cache
  if (url.pathname.startsWith("/api/")) return;

  // Everything else: network first, fall back to cache
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});
