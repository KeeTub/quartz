// static/sw.js
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

// 이 fetch 이벤트가 있어야 브라우저가 '설치 가능'으로 인식합니다.
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
