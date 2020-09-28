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
  return event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then(function (res) {
          return caches.open(CACHE_DYNAMIC_CACHE).then(function (cache) {
            cache.put(event.request.url, res.clone());
            return res;
          });
        });
      }
    })
  );
});
