const CACHE_STATIC_CACHE = 'static';
const CACHE_DYNAMIC_CACHE = 'dynamic';
const DATA_TO_CACHE = [
  '/',
  '/index.html',
  '/main.style.css',
  '/js/app.js',
  '/assets/main_offline.png',
  '/assets/main_installability.png',
  '/assets/main_geolocation.png',
  '/assets/main_notification.png',
  'https://fonts.gstatic.com/s/poppins/v13/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2',
  'https://fonts.gstatic.com/s/poppins/v13/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2',
];

self.addEventListener('install', (event) => {
  console.log('Installing Service worker');
  event.waitUntil(
    caches.open(CACHE_STATIC_CACHE).then((cache) => {
      console.log(`Adding to cache`);
      return cache.addAll(DATA_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Activating Service Worker');
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((r) => {
      console.log('[Service Worker] Fetching resource: ' + event.request.url);
      return (
        r ||
        fetch(event.request).then((response) => {
          return caches.open(CACHE_DYNAMIC_CACHE).then((cache) => {
            console.log(
              '[Service Worker] Caching new resource: ' + event.request.url
            );
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});
