import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"

const PrevNext: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const currentSlug = fileData.slug ?? ""
  const currentFolder = currentSlug.split("/").slice(0, -1).join("/")

  const allSorted = allFiles
    .filter((f: QuartzPluginData) => {
      const slug = f.slug ?? ""
      const folder = slug.split("/").slice(0, -1).join("/")
      return folder === currentFolder && slug !== ""
    })
    .sort((a: QuartzPluginData, b: QuartzPluginData) => {
      const slugA = a.slug ?? ""
      const slugB = b.slug ?? ""
      return slugA.localeCompare(slugB, undefined, { numeric: true, sensitivity: "base" })
    })

  const currentIndex = allSorted.findIndex((f: QuartzPluginData) => f.slug === currentSlug)
  const prevPage = currentIndex > 0 ? allSorted[currentIndex - 1] : null
  const nextPage = currentIndex < allSorted.length - 1 ? allSorted[currentIndex + 1] : null

  if (!prevPage && !nextPage) return null

  const prevSlug = prevPage ? (prevPage.slug ?? "") : ""
  const nextSlug = nextPage ? (nextPage.slug ?? "") : ""
  const prevTitle = prevPage ? (prevPage.frontmatter?.title ?? "") : ""
  const nextTitle = nextPage ? (nextPage.frontmatter?.title ?? "") : ""
  const total = allSorted.length
  const current = currentIndex + 1

  return (
    <div class="prevnext-wrapper">
      {/* 상단 네비게이션 바 */}
      <nav class="prev-next-nav top-nav">
        <div class="prev-next-inner">
          {prevPage ? (
            <a href={resolveRelative(currentSlug, prevSlug)} class="nav-btn prev-btn">
              <div class="btn-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </div>
              <div class="btn-text">
                <span class="btn-label">이전 장</span>
                <span class="btn-title">{prevTitle}</span>
              </div>
            </a>
          ) : (
            <div class="nav-btn-empty" />
          )}

          <div class="center-controls">
            <div class="page-indicator">
              <span class="page-current">{current}</span>
              <span class="page-divider"> / </span>
              <span class="page-total">{total}</span>
            </div>
            {/* TTS 버튼 */}
            <button
              class="tts-btn"
              id="tts-toggle"
              title="읽어주기"
              onClick="window.toggleTTS && window.toggleTTS()"
            >
              <svg id="tts-play-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <svg id="tts-stop-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              <span class="tts-label" id="tts-label">읽기</span>
            </button>
          </div>

          {nextPage ? (
            <a href={resolveRelative(currentSlug, nextSlug)} class="nav-btn next-btn">
              <div class="btn-text">
                <span class="btn-label">다음 장</span>
                <span class="btn-title">{nextTitle}</span>
              </div>
              <div class="btn-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </a>
          ) : (
            <div class="nav-btn-empty" />
          )}
        </div>
      </nav>

      {/* 하단 네비게이션 바 */}
      <nav class="prev-next-nav bottom-nav">
        <div class="prev-next-inner">
          {prevPage ? (
            <a href={resolveRelative(currentSlug, prevSlug)} class="nav-btn prev-btn">
              <div class="btn-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </div>
              <div class="btn-text">
                <span class="btn-label">이전 장</span>
                <span class="btn-title">{prevTitle}</span>
              </div>
            </a>
          ) : (
            <div class="nav-btn-empty" />
          )}

          <div class="page-indicator">
            <span class="page-current">{current}</span>
            <span class="page-divider"> / </span>
            <span class="page-total">{total}</span>
          </div>

          {nextPage ? (
            <a href={resolveRelative(currentSlug, nextSlug)} class="nav-btn next-btn">
              <div class="btn-text">
                <span class="btn-label">다음 장</span>
                <span class="btn-title">{nextTitle}</span>
              </div>
              <div class="btn-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </a>
          ) : (
            <div class="nav-btn-empty" />
          )}
        </div>
      </nav>

      {/* TTS 스크립트 */}
      <script dangerouslySetInnerHTML={{__html: `
        (function() {
          var synth = window.speechSynthesis;
          var speaking = false;
          var utterance = null;

          window.toggleTTS = function() {
            var btn = document.getElementById('tts-toggle');
            var playIcon = document.getElementById('tts-play-icon');
            var stopIcon = document.getElementById('tts-stop-icon');
            var label = document.getElementById('tts-label');

            if (speaking) {
              synth.cancel();
              speaking = false;
              playIcon.style.display = 'block';
              stopIcon.style.display = 'none';
              label.textContent = '읽기';
              btn.classList.remove('tts-active');
            } else {
              var article = document.querySelector('article');
              if (!article) return;
              var text = article.innerText || article.textContent || '';
              utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = 'ko-KR';
              utterance.rate = 0.9;
              utterance.pitch = 1.0;
              utterance.onend = function() {
                speaking = false;
                playIcon.style.display = 'block';
                stopIcon.style.display = 'none';
                label.textContent = '읽기';
                btn.classList.remove('tts-active');
              };
              synth.speak(utterance);
              speaking = true;
              playIcon.style.display = 'none';
              stopIcon.style.display = 'block';
              label.textContent = '정지';
              btn.classList.add('tts-active');
            }
          };

          window.addEventListener('beforeunload', function() {
            if (synth) synth.cancel();
          });
        })();
      `}} />
    </div>
  )
}

PrevNext.css = `
.prevnext-wrapper {
  width: 100%;
}

/* 상단 네비게이션 - sticky */
.top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--light);
  border-bottom: 1px solid var(--lightgray);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-bottom: 1.5rem;
}

/* 하단 네비게이션 */
.bottom-nav {
  margin-top: 2.5rem;
  border-top: 1px solid var(--lightgray);
  background: var(--light);
}

.prev-next-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 1rem;
  gap: 0.5rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  border: 1px solid var(--lightgray);
  background: transparent;
  text-decoration: none !important;
  transition: all 0.15s ease;
  max-width: 38%;
  min-width: 0;
  cursor: pointer;
}

.nav-btn:hover {
  border-color: var(--secondary);
  background: var(--highlight);
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0,0,0,0.08);
}

.btn-arrow {
  display: flex;
  align-items: center;
  color: var(--secondary);
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.prev-btn:hover .btn-arrow { transform: translateX(-3px); }
.next-btn:hover .btn-arrow { transform: translateX(3px); }

.btn-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 0.1rem;
}

.next-btn .btn-text { text-align: right; }

.btn-label {
  font-size: 0.65rem;
  color: var(--gray);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-height: 1;
}

.btn-title {
  font-size: 0.82rem;
  color: var(--secondary);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  line-height: 1.3;
}

/* 중앙 컨트롤 영역 */
.center-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.page-indicator {
  display: flex;
  align-items: baseline;
  gap: 0.15rem;
  padding: 0.2rem 0.8rem;
  background: var(--lightgray);
  border-radius: 20px;
  user-select: none;
}

.page-current {
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--secondary);
}

.page-divider {
  font-size: 0.72rem;
  color: var(--gray);
}

.page-total {
  font-size: 0.78rem;
  color: var(--gray);
  font-weight: 500;
}

/* TTS 버튼 */
.tts-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.75rem;
  border-radius: 20px;
  border: 1px solid var(--lightgray);
  background: transparent;
  color: var(--gray);
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 600;
  transition: all 0.15s ease;
  letter-spacing: 0.03em;
}

.tts-btn:hover {
  border-color: var(--secondary);
  color: var(--secondary);
  background: var(--highlight);
}

.tts-btn.tts-active {
  background: var(--secondary);
  border-color: var(--secondary);
  color: var(--light);
}

.tts-label {
  line-height: 1;
}

.nav-btn-empty {
  max-width: 38%;
  min-width: 80px;
  visibility: hidden;
}

@media (max-width: 800px) {
  .btn-title { display: none; }
  .btn-label { font-size: 0.7rem; }
  .prev-next-inner { padding: 0.45rem 0.6rem; }
  .nav-btn { padding: 0.35rem 0.6rem; }
}
`

export default (() => PrevNext) satisfies QuartzComponentConstructor
