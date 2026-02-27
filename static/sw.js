self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // PWA 설치 요건을 충족하기 위한 필수 fetch 이벤트
  event.respondWith(fetch(event.request));
});
