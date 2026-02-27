// static/sw.js
self.addEventListener('install', (d) => {
  console.log('Service Worker 설치 완료');
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // 설치 조건을 충족하기 위한 필수 fetch 이벤트 처리
  event.respondWith(fetch(event.request));
});
