import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"

const PrevNextBottom: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
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
    <nav class="prevnext-bottom">
      <div class="prevnext-bottom-inner">
        {prevPage ? (
          <a href={resolveRelative(currentSlug, prevSlug)} class="nav-btn-b prev-btn-b">
            <div class="btn-arrow-b">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </div>
            <div class="btn-text-b">
              <span class="btn-label-b">이전 장</span>
              <span class="btn-title-b">{prevTitle}</span>
            </div>
          </a>
        ) : (
          <div class="nav-btn-empty-b" />
        )}

        <div class="page-indicator-b">
          <span class="page-current-b">{current}</span>
          <span class="page-divider-b"> / </span>
          <span class="page-total-b">{total}</span>
        </div>

        {nextPage ? (
          <a href={resolveRelative(currentSlug, nextSlug)} class="nav-btn-b next-btn-b">
            <div class="btn-text-b">
              <span class="btn-label-b">다음 장</span>
              <span class="btn-title-b">{nextTitle}</span>
            </div>
            <div class="btn-arrow-b">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </a>
        ) : (
          <div class="nav-btn-empty-b" />
        )}
      </div>
    </nav>
  )
}

PrevNextBottom.css = `
.prevnext-bottom {
  margin-top: 2.5rem;
  border-top: 2px solid var(--lightgray);
  background: var(--light);
}

.prevnext-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  gap: 0.5rem;
}

.nav-btn-b {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: 1px solid var(--lightgray);
  background: transparent;
  text-decoration: none !important;
  transition: all 0.15s ease;
  max-width: 42%;
  min-width: 0;
  cursor: pointer;
}

.nav-btn-b:hover {
  border-color: var(--secondary);
  background: var(--highlight);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.btn-arrow-b {
  display: flex;
  align-items: center;
  color: var(--secondary);
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.prev-btn-b:hover .btn-arrow-b { transform: translateX(-3px); }
.next-btn-b:hover .btn-arrow-b { transform: translateX(3px); }

.btn-text-b {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 0.15rem;
}

.next-btn-b .btn-text-b { text-align: right; }

.btn-label-b {
  font-size: 0.65rem;
  color: var(--gray);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-height: 1;
}

.btn-title-b {
  font-size: 0.88rem;
  color: var(--secondary);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
  line-height: 1.3;
}

.page-indicator-b {
  display: flex;
  align-items: baseline;
  gap: 0.15rem;
  padding: 0.3rem 1rem;
  background: var(--lightgray);
  border-radius: 20px;
  user-select: none;
  flex-shrink: 0;
}

.page-current-b {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--secondary);
}

.page-divider-b {
  font-size: 0.75rem;
  color: var(--gray);
}

.page-total-b {
  font-size: 0.8rem;
  color: var(--gray);
  font-weight: 500;
}

.nav-btn-empty-b {
  max-width: 42%;
  min-width: 100px;
  visibility: hidden;
}

@media (max-width: 800px) {
  .btn-title-b { display: none; }
  .nav-btn-b { padding: 0.5rem 0.8rem; }
  .prevnext-bottom-inner { padding: 0.6rem 0; }
}
`

export default (() => PrevNextBottom) satisfies QuartzComponentConstructor
