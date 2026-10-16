// Filbey PWA Service Worker - High-Performance Offline & Caching Layer
const CACHE_NAME = 'filbey-pwa-v1';
const OFFLINE_URL = '/order';

const STATIC_PRECACHE = [
  '/',
  '/order',
  '/menu',
  '/about',
  '/manifest.webmanifest',
  '/filbeylogo.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/apple-touch-icon.png',
];

// Install Event: Pre-cache essential app shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE).catch((err) => {
        console.warn('[Filbey SW] Pre-cache non-fatal error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: Clear outdated caches and take immediate control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-first for pages and API calls, Cache-first for static media
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests, Google Sheets API, non-GET requests
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  // Skip API routes from cache
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Static Assets (Images, Icons, Fonts, Next static chunks): Cache-first
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|woff2|woff|ttf|css|js)$/);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch updated version in background to refresh cache (stale-while-revalidate)
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // HTML / Navigation requests: Network-first, fallback to cache, then offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          const fallback = await caches.match(OFFLINE_URL);
          if (fallback) return fallback;

          return new Response(
            '<html><body style="font-family:sans-serif;text-align:center;padding:40px;"><h2>You are offline</h2><p>Please check your internet connection to continue browsing Filbey.</p><a href="/order" style="display:inline-block;padding:12px 24px;background:#5d000c;color:white;text-decoration:none;border-radius:12px;font-weight:bold;">Retry</a></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
  }
});
