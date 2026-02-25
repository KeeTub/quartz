// 태블릿 햄버거 메뉴
function setupTabletMenu() {
  // 이미 있으면 스킵
  if (document.getElementById("tablet-menu-btn")) return

  // 햄버거 버튼 생성
  const btn = document.createElement("button")
  btn.id = "tablet-menu-btn"
  btn.className = "tablet-menu-btn"
  btn.setAttribute("aria-label", "메뉴")
  btn.innerHTML = `<span></span><span></span><span></span>`
  document.body.appendChild(btn)

  // 오버레이 생성
  const overlay = document.createElement("div")
  overlay.className = "sidebar-overlay"
  overlay.id = "sidebar-overlay"
  document.body.appendChild(overlay)

  const sidebar = document.querySelector(".sidebar.left") as HTMLElement | null

  btn.addEventListener("click", () => {
    sidebar?.classList.toggle("open")
    overlay.classList.toggle("open")
  })

  overlay.addEventListener("click", () => {
    sidebar?.classList.remove("open")
    overlay.classList.remove("open")
  })
}

document.addEventListener("nav", setupTabletMenu)
setupTabletMenu()
