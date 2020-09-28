const STATIC_CACHE = 'static';
const DATA_TO_CACHE = ['/index.html', '/main.style.css'];

self.addEventListener('install', (event) => {
  console.log('Installing Service worker');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log(`Adding to cache`);
      cache.addAll(DATA_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Activating Service Worker');
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  console.log(`Fetching: ${event.request.url}`);
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
