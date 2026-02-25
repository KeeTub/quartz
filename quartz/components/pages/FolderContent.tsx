import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { QuartzPluginData } from "../../plugins/vfile"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"
import { trieFromAllFiles } from "../../util/ctx"

interface FolderContentOptions {
  showFolderCount: boolean
  showSubfolders: boolean
  sort?: SortFn
}

const defaultOptions: FolderContentOptions = {
  showFolderCount: true,
  showSubfolders: true,
  sort: (a, b) => {
    const slugA = a.slug ?? ""
    const slugB = b.slug ?? ""
    return slugA.localeCompare(slugB, undefined, { numeric: true, sensitivity: "base" })
  },
}

export default ((opts?: Partial<FolderContentOptions>) => {
  const options: FolderContentOptions = { ...defaultOptions, ...opts }

  const FolderContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles } = props

    const trie = (props.ctx.trie ??= trieFromAllFiles(allFiles))
    const folder = trie.findNode(fileData.slug!.split("/"))
    if (!folder) return null

    const allPagesInFolder: QuartzPluginData[] =
      folder.children
        .map((node) => {
          if (node.data) return node.data
          if (node.isFolder && options.showSubfolders) {
            return {
              slug: node.slug,
              dates: { created: new Date(), modified: new Date(), published: new Date() },
              frontmatter: { title: node.displayName, tags: [] },
            }
          }
        })
        .filter((page) => page !== undefined) ?? []

    const sorted = [...allPagesInFolder].sort(
      options.sort ?? ((a, b) =>
        (a.slug ?? "").localeCompare(b.slug ?? "", undefined, { numeric: true, sensitivity: "base" })
      )
    )

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren

    const currentSlug = fileData.slug ?? ""
    const slugClean = currentSlug.replace(/\/index$/, "")
    const depth = slugClean.split("/").filter(Boolean).length
    const isBookList = depth <= 1
    
    const pageTitle = fileData.frontmatter?.title ?? ""

    // 상위 폴더 slug (장 목록에서 책 목록으로)
    const parentSlug = currentSlug.split("/").slice(0, -1).join("/")

    if (isBookList) {
      // ── 책 목록 페이지 ─────────────────────────
      return (
        <div class="bible-collection">
          <div class="collection-header">
            <h1 class="collection-title">{pageTitle}</h1>
            <span class="collection-count">{sorted.length}권</span>
          </div>
          {content && (tree as Root).children.length > 0 && (
            <article>{content}</article>
          )}
          <div class="book-grid">
            {sorted.map((page) => {
              const slug = page.slug ?? ""
              const rawName = slug.split("/").pop() ?? ""
              // 폴더명에서 숫자_ 제거
              const bookName = rawName.replace(/^\d+_/, "")
              // index.md의 title 우선 사용
              const bookTitle = (page.frontmatter?.title && page.frontmatter.title !== rawName)
                ? page.frontmatter.title
                : bookName
              const chapterCount = allFiles.filter((f) => {
                const fslug = f.slug ?? ""
                return fslug.startsWith(slug + "/") && !fslug.endsWith("index")
              }).length

              return (
                <a href={`/${slug}`} class="book-card">
                  <span class="book-name">{bookTitle}</span>
                  {chapterCount > 0 && (
                    <span class="book-chapters">{chapterCount}장</span>
                  )}
                </a>
              )
            })}
          </div>
        </div>
      )
    } else {
      // ── 장 목록 페이지 ─────────────────────────
      const bookName = pageTitle.replace(/^\d+_/, "")
      return (
        <div class="chapter-collection">
          <div class="book-header">
            <div class="book-header-left">
              <h1 class="book-title">{bookName}</h1>
              <span class="book-count">{sorted.length}장</span>
            </div>
            {/* 전체 목록으로 버튼 */}
            {parentSlug && (
              <a href={`/${parentSlug}`} class="back-to-list">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                목록
              </a>
            )}
          </div>
          {content && (tree as Root).children.length > 0 && (
            <article>{content}</article>
          )}
          <div class="chapter-grid">
            {sorted.map((page) => {
              const title = page.frontmatter?.title ?? ""
              const chapterNum = title.replace(/[^0-9]/g, "")
              return (
                <a href={`/${page.slug}`} class="chapter-card">
                  <span class="chapter-num">{chapterNum}</span>
                  <span class="chapter-label">장</span>
                </a>
              )
            })}
          </div>
        </div>
      )
    }
  }

  FolderContent.css = concatenateResources(style, PageList.css, `

/* ── 책 목록 ─────────────────────────── */
.collection-header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--lightgray);
}

.collection-title {
  font-size: 1.8rem !important;
  font-weight: 800 !important;
  color: var(--dark) !important;
  margin: 0 !important;
}

.collection-count {
  font-size: 0.85rem;
  color: var(--gray);
  background: var(--lightgray);
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.book-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 1rem 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--lightgray);
  background: var(--light);
  text-decoration: none !important;
  transition: all 0.15s ease;
  min-height: 70px;
  cursor: pointer;
}

.book-card:hover {
  border-color: var(--secondary);
  background: var(--highlight);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.book-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--secondary);
  text-align: center;
  line-height: 1.3;
}

.book-chapters {
  font-size: 0.7rem;
  color: var(--gray);
}

/* ── 장 목록 ─────────────────────────── */
.book-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--lightgray);
}

.book-header-left {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.book-title {
  font-size: 1.8rem !important;
  font-weight: 800 !important;
  color: var(--dark) !important;
  margin: 0 !important;
}

.book-count {
  font-size: 0.85rem;
  color: var(--gray);
  background: var(--lightgray);
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
}

/* 목록으로 버튼 */
.back-to-list {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  border: 1px solid var(--lightgray);
  background: transparent;
  color: var(--secondary);
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.back-to-list:hover {
  border-color: var(--secondary);
  background: var(--highlight);
}

/* 장 카드 그리드 */
.chapter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
  gap: 0.7rem;
}

.chapter-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.9rem 0.5rem;
  border-radius: 10px;
  border: 1px solid var(--lightgray);
  background: var(--light);
  text-decoration: none !important;
  transition: all 0.15s ease;
  aspect-ratio: 1;
  cursor: pointer;
}

.chapter-card:hover {
  border-color: var(--secondary);
  background: var(--highlight);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.chapter-num {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--secondary);
  line-height: 1;
}

.chapter-label {
  font-size: 0.62rem;
  color: var(--gray);
  margin-top: 0.2rem;
}

@media (max-width: 800px) {
  .book-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
  .chapter-grid {
    grid-template-columns: repeat(auto-fill, minmax(58px, 1fr));
  }
}
  `)

  return FolderContent
}) satisfies QuartzComponentConstructor
