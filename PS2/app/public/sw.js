// Flex service worker.
//
// Scope, deliberately small:
//  1. Cache the app shell (this page + icon + manifest) so the app still
//     opens offline. It does NOT cache /api/plan responses — POST requests
//     aren't cacheable via the Cache API, and more importantly, caching a
//     plan response here would risk silently serving a stale journey as if
//     it were fresh. The last successful plan is instead cached explicitly,
//     client-side, in localStorage (see src/lib/offline/cache.ts) with its
//     own visible "as of" timestamp and staleness warning — the shell cache
//     below is unrelated to that and only covers the empty app frame.
//  2. Receive Web Push events and show a notification. This is the "bounded
//     attempt" at real closed-app delivery described in the brief — it only
//     fires for a real push event from the server (see
//     src/app/api/push/test/route.ts), never a fake drawn notification.

const SHELL_CACHE = "flex-shell-v1";
const SHELL_URLS = ["/", "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // never touch API POSTs
  if (new URL(request.url).pathname.startsWith("/api/")) return; // API GETs stay live, not shell-cached

  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy));
        return res;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
  );
});

self.addEventListener("push", (event) => {
  let payload = { title: "Flex", body: "Your trip conditions changed.", synthetic: false };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch {
    /* keep default payload */
  }
  const title = payload.synthetic ? `[DEMO] ${payload.title}` : payload.title;
  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body,
      icon: "/icon.svg",
      badge: "/icon.svg",
      tag: "flex-trip-update",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow("/"));
});
