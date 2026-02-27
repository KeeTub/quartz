self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed');
});

self.addEventListener('fetch', (e) => {
  // PWA 설치 조건을 충족하기 위한 빈 fetch 이벤트
  e.respondWith(fetch(e.request));
});
