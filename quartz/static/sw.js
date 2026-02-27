// 서비스 워커 버전 관리
const CACHE_NAME = 'pxkor-bible-v1';

// 설치 시 즉시 활성화
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting();
});

// 활성화 및 이전 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(clients.claim());
});

// 설치 메뉴 활성화를 위한 필수 Fetch 이벤트
// 네트워크 우선 전략으로 항상 최신 정보를 보여줍니다.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // 오프라인일 때만 캐시에서 찾음
      return caches.match(event.request);
    })
  );
});
