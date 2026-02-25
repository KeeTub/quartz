import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "BibleKim.com": "https://biblekim.com",
      GitHub: "https://github.com/jackyzha0/quartz",
    },
  }),
}

// [개별 성경 장] 페이지 레이아웃
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.PrevNextTop(),
    Component.ArticleTitle(),
  ],
  left: [],
  right: [],
  afterBody: [
    Component.PrevNextBottom(),
  ],
}

// [성경 목록/폴더] 페이지 레이아웃
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
  ],
  left: [],
  right: [],
}
