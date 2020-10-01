const CACHE_STATIC_CACHE = 'static';
const CACHE_DYNAMIC_CACHE = 'dynamic';
const DATA_TO_CACHE = [
  '/index.html',
  '/pages/offline.html',
  '/pages/fallback.html',
  '/main.style.css',
  '/js/app.js',
  '/assets/main_offline.webp',
  '/assets/main_installability.webp',
  '/assets/main_geolocation.webp',
  '/assets/main_notification.webp',
  '/assets/fallback.webp',
  '/assets/anim_girl.gif',
  '/assets/anim_bug.gif',
  '/assets/return.svg',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600',
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
  if (event.request.method === 'POST') {
    return;
  } else {
    event.respondWith(
      caches.match(event.request).then((r) => {
        console.log('[Service Worker] Fetching resource: ' + event.request.url);
        return (
          r ||
          fetch(event.request).then((response) => {
            return caches
              .open(CACHE_DYNAMIC_CACHE)
              .then((cache) => {
                console.log(
                  '[Service Worker] Caching new resource: ' + event.request.url
                );

                cache.put(event.request, response.clone());
                return response;
              })
              
          })
        );
      }).catch(function () {
        console.log('No way to found this resource');
        return caches.match('/pages/fallback.html');
      })
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  // event.waitUntil(clients.openWindow(ROOT_URL));
});

self.addEventListener('push', function (event) {
  console.log(event.data);
  const ntfData = event.data.json().notification;
  const ntfPromise = self.registration.showNotification(ntfData.title, {
    body: 'Remote notification',
    icon: '/favicons/mstile-150x150.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  });
  event.waitUntil(ntfPromise);
});
