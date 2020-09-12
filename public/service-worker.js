/*jshint esversion: 6 */
const cacheName = 'cache-v1';
const precacheResources = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/images/icons/add_alert.svg',
  '/assets/images/icons/location_city-24px.svg',
  '/assets/images/icons/cloud_download-24px.svg',
  '/assets/images/logos/smash_it.png'
];

self.addEventListener('install', event => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName)
    .then(cache => {
      return cache.addAll(precacheResources);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event!');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});