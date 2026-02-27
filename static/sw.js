// 서비스 워커 설치
self.addEventListener('install', (event) => {
  console.log('pxkorBible Service Worker 설치됨');
  self.skipWaiting();
});

// 서비스 워커 활성화
self.addEventListener('activate', (event) => {
  console.log('pxkorBible Service Worker 활성화됨');
});

// 설치 아이콘이 뜨기 위한 필수 조건 (Fetch 이벤트 처리)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
