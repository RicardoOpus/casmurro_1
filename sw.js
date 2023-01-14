self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('casmurro-store').then((cache) => cache.addAll([
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
      './components/detailCharacter/script.js',
      './components/editCharacter/script.js',
      './components/newCharacter/page.html',
      './components/newCharacter/script.js',
      './components/projects/editProject.html',
      './components/projects/script.js',
      './global/css/global.css',
      './global/js/dataManager.js',
      './global/js/script.js',
      './pages/dashboard/page.html',
      './pages/dashboard/script.js',
      './pages/mundo/page.html',
      './pages/mundo/script.js',
      './pages/notas/page.html',
      './pages/notas/script.js',
      './pages/personagens/page.html',
      './pages/personagens/script.js',
      './pages/timeline/page.html',
      './pages/timeline/script.js',
      './pages/trama/page.html',
      './pages/trama/script.js',
      './pages/welcome/page.html',
      './pages/welcome/script.js',
    ])),
  );
});

self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
