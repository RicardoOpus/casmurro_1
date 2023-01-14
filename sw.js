// self.addEventListener('install', (e) => {
//   e.waitUntil(
//     caches.open('casmurro-store').then((cache) => cache.addAll([
//       './',
//       './index.html',
//       './index.js',
//       './assets/css/images/ui-icons_222222_256x240.png',
//       './assets/css/images/ui-icons_a83300_256x240.png',
//       './assets/css/images/ui-icons_cccccc_256x240.png',
//       './assets/css/images/ui-icons_ffffff_256x240.png',
//       './assets/css/jquery-ui.css',
//       './assets/css/jquery-ui.js',
//       './assets/fonts/Courier_Prime.ttf',
//       './assets/fonts/texgyretermes-regular.otf',
//       './assets/icons/assis.png',
//       './assets/images/arabesque4.png',
//       './assets/images/cards3.png',
//       './assets/images/manuscript.jpeg',
//       './assets/js/dixie.js',
//       './assets/js/jquery.min.js',
//       './components/detailCharacter/page.html',
//       './components/editCharacter/script.js',
//       './components/newCharacter/page.html',
//       './components/projects/editProject.html',
//       './global/css/global.css',
//       './global/js/dataManager.js',
//       './pages/dashboard/page.html',
//       './pages/mundo/page.html',
//       './pages/notas/page.html',
//       './pages/personagens/page.html',
//       './pages/timeline/page.html',
//       './pages/trama/page.html',
//       './pages/welcome/page.html',
//     ])),
//   );
// });

// self.addEventListener('fetch', (e) => {
//   console.log(e.request.url);
//   e.respondWith(
//     caches.match(e.request).then((response) => response || fetch(e.request)),
//   );
// });


// Choose a cache name
const cacheName = 'cache-v1';
// List the files to precache
const precacheResources = [
  './',
  './index.html',
  './index.js',
  './assets/css/images/ui-icons_222222_256x240.png',
  './assets/css/images/ui-icons_a83300_256x240.png',
  './assets/css/images/ui-icons_cccccc_256x240.png',
  './assets/css/images/ui-icons_ffffff_256x240.png',
  './assets/css/jquery-ui.css',
  './assets/css/jquery-ui.js',
  './assets/fonts/Courier_Prime.ttf',
  './assets/fonts/texgyretermes-regular.otf',
  './assets/icons/assis.png',
  './assets/images/arabesque4.png',
  './assets/images/cards3.png',
  './assets/images/manuscript.jpeg',
  './assets/js/dixie.js',
  './assets/js/jquery.min.js',
  './components/detailCharacter/page.html',
  './components/editCharacter/script.js',
  './components/newCharacter/page.html',
  './components/projects/editProject.html',
  './global/css/global.css',
  './global/js/dataManager.js',
  './global/js/script.js',
  './pages/dashboard/page.html',
  './pages/mundo/page.html',
  './pages/notas/page.html',
  './pages/personagens/page.html',
  './pages/timeline/page.html',
  './pages/trama/page.html',
  './pages/welcome/page.html',
  './sw.js',
  './manifest.webmanifest',
];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(precacheResources);
  })());
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
});
