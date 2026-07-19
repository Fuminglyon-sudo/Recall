const CACHE = "sorosoke-v5";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) =>
      c.addAll([
        "/manifest.webmanifest",
        "/favicon.svg",
        "/favicon.ico",
        "/brand/app-icon-192.png",
        "/brand/app-icon-512.png",
        "/brand/apple-touch-icon-180.png",
      ])
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Only these navigations are safe to persist offline — everything past
// login renders user-specific data server-side into the HTML, so caching
// it would let it survive logout on a shared device.
const PUBLIC_PAGES = /^\/($|landing|about|features|pricing|faq|privacy|terms|contact|blog|login|guide)/;

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // Navigation requests (HTML pages): network-first, cache on success
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok && PUBLIC_PAGES.test(url.pathname)) {
            caches.open(CACHE).then((c) => c.put(request, res.clone()));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(
            "You appear to be offline. Reload when you have a connection.",
            { status: 503, headers: { "Content-Type": "text/plain" } }
          );
        })
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        if (res.ok) {
          caches.open(CACHE).then((c) => c.put(request, res.clone()));
        }
        return res;
      });
    })
  );
});

// ── Push notifications ────────────────────────────────────────────────────

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data = { title: "Sọrọ Sọkẹ AI", body: "Time to review.", url: "/today" };
  try {
    data = { ...data, ...event.data.json() };
  } catch {
    data.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/brand/app-icon-192.png",
      badge: "/brand/app-icon-192.png",
      data: { url: data.url },
      tag: "recall-daily",
      renotify: false,
    })
  );
});

// Triggered from the client on logout so a shared device doesn't keep
// serving cached authenticated pages (/today, /decks/*, debate history, etc.)
// from the offline cache after the session ends.
self.addEventListener("message", (event) => {
  if (event.data === "purge-caches") {
    event.waitUntil(caches.delete(CACHE));
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/today";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
