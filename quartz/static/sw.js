const CACHE_NAME = 'pxkor-bible-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // 추가적으로 오프라인에서 꼭 보여야 할 CSS나 JS 파일 경로를 넣으세요.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
