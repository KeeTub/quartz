import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
// @ts-ignore
import ttsScript from "./scripts/tts.inline"

const PrevNextTop: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const currentSlug = fileData.slug ?? ""
  const parts = currentSlug.split("/")
  const currentFolder = parts.slice(0, -1).join("/")
  const rootFolder = parts[0]

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

  const chapterListSlug = currentFolder
  const bookListSlug = rootFolder

  return (
    <nav class="prevnext-top">
      <div class="prevnext-top-inner">

        {/* 이전 버튼 */}
        {prevPage ? (
          <a href={resolveRelative(currentSlug, prevSlug)} class="nav-btn prev-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span class="btn-title">{prevTitle}</span>
          </a>
        ) : (
          <div class="nav-btn-empty" />
        )}

        {/* 중앙 컨트롤 */}
        <div class="center-controls">
          <div class="page-indicator">
            <span class="page-current">{current}</span>
            <span class="page-divider"> / </span>
            <span class="page-total">{total}</span>
          </div>
          <div class="ctrl-row">
            {/* 다크모드 토글 */}
            <button class="ctrl-btn dark-btn" id="darkmode-toggle" title="다크모드">
              <svg id="dark-moon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <svg id="dark-sun" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </button>
            <button class="ctrl-btn tts-btn" id="tts-toggle-top" title="읽어주기">
              <svg id="tts-play-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <svg id="tts-stop-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              <span id="tts-label">읽기</span>
            </button>
            <a href={`/${chapterListSlug}`} class="ctrl-btn chapter-btn">장목록</a>
            <a href={`/${bookListSlug}`} class="ctrl-btn book-btn">책목록</a>
          </div>
        </div>

        {/* 다음 버튼 */}
        {nextPage ? (
          <a href={resolveRelative(currentSlug, nextSlug)} class="nav-btn next-btn">
            <span class="btn-title">{nextTitle}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        ) : (
          <div class="nav-btn-empty" />
        )}

      </div>
    </nav>
  )
}

PrevNextTop.afterDOMLoaded = ttsScript

PrevNextTop.css = `
.prevnext-top {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--light);
  border-bottom: 1px solid var(--lightgray);
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  margin-bottom: 1.5rem;
}

.prevnext-top-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 1rem;
  gap: 0.5rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.38rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--lightgray);
  background: transparent;
  text-decoration: none !important;
  transition: all 0.15s ease;
  flex-shrink: 0;
  max-width: 32%;
  min-width: 0;
  color: var(--secondary);
}

.nav-btn:hover {
  border-color: var(--secondary);
  background: var(--highlight);
  transform: translateY(-1px);
}

.btn-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 110px;
}

.center-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  flex: 1;
  min-width: 0;
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
.page-current { font-size: 0.85rem; font-weight: 800; color: var(--secondary); }
.page-divider { font-size: 0.7rem; color: var(--gray); }
.page-total { font-size: 0.75rem; color: var(--gray); }

/* 버튼 행 - 항상 가로 배치 */
.ctrl-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;       /* ← 충분한 간격 */
  flex-wrap: nowrap;
}

.ctrl-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  border: 1px solid var(--lightgray);
  background: transparent;
  color: var(--gray);
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.ctrl-btn:hover {
  border-color: var(--secondary);
  color: var(--secondary);
  background: var(--highlight);
}

.tts-btn.tts-active {
  background: var(--secondary);
  border-color: var(--secondary);
  color: var(--light);
}

.chapter-btn {
  border-color: var(--secondary);
  color: var(--secondary);
}
.chapter-btn:hover {
  background: var(--secondary);
  color: var(--light);
}

/* 다크모드 버튼 */
.dark-btn {
  border-color: var(--lightgray);
  color: var(--gray);
}
.dark-btn:hover {
  border-color: var(--secondary);
  color: var(--secondary);
}

.nav-btn-empty {
  flex-shrink: 0;
  max-width: 32%;
  min-width: 60px;
  visibility: hidden;
}

/* 데스크탑: 장목록/책목록 숨김 */
@media (min-width: 1200px) {
  .btn-title { max-width: 130px; }
}

/* 태블릿 */
@media (min-width: 800px) and (max-width: 1199px) {
  .btn-title { max-width: 100px; }
}

/* 모바일 */
@media (max-width: 799px) {
  .btn-title { display: none; }
  .nav-btn { padding: 0.3rem 0.5rem; max-width: 28%; }
  .prevnext-top-inner { padding: 0.35rem 0.6rem; }
  .ctrl-btn { font-size: 0.68rem; padding: 0.18rem 0.5rem; }
  .ctrl-row { gap: 0.45rem; }
}
`

export default (() => PrevNextTop) satisfies QuartzComponentConstructor
