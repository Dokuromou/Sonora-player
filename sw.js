/* Auto-generated flat PWA Service Worker (0e53036a4694) */
const CACHE_NAME = 'sonora-flat-0e53036a4694';
const PRECACHE_URLS = [
  "./",
  "./app.css",
  "./polish.css",
  "./app.js",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./icon.svg",
  "./index.html",
  "./manifest.webmanifest"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const res = await fetch(new Request(url, { cache: 'reload' }));
            if (res.ok) await cache.put(url, res);
          } catch {}
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith('sonora-') && k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.endsWith('/sw.js')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = (await cache.match('./index.html')) || (await cache.match('./'));
        const netFetch = fetch(request).then((res) => {
          if (res && res.ok) cache.put('./index.html', res.clone());
          return res;
        }).catch(() => null);
        if (cached) {
          event.waitUntil(netFetch);
          return cached;
        }
        return (await netFetch) || new Response('Offline - Sonora Player', { status: 503 });
      })
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;
      try {
        const res = await fetch(request);
        if (res && res.ok && res.type === 'basic') cache.put(request, res.clone());
        return res;
      } catch {
        return new Response('', { status: 504 });
      }
    })
  );
});
