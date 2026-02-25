const synth = window.speechSynthesis
let speaking = false
let currentUtterance: SpeechSynthesisUtterance | null = null

// ── 언어 자동 감지 ──────────────────────────────
// URL 경로로 판단: /NTpbsEn/ → 영어, 나머지 → 한국어
function detectLang(): { lang: string; labelPlay: string; labelStop: string } {
  const path = window.location.pathname
  if (path.includes("NTpbsEn")) {
    return { lang: "en-US", labelPlay: "Read", labelStop: "Stop" }
  }
  return { lang: "ko-KR", labelPlay: "읽기", labelStop: "정지" }
}

function stopTTS() {
  synth.cancel()
  speaking = false
  currentUtterance = null
  const playIcon = document.getElementById("tts-play-icon")
  const stopIcon  = document.getElementById("tts-stop-icon")
  const label     = document.getElementById("tts-label")
  const btn       = document.getElementById("tts-toggle-top")
  if (playIcon) playIcon.style.display = "block"
  if (stopIcon) stopIcon.style.display  = "none"
  if (label)   label.textContent = detectLang().labelPlay
  if (btn)     btn.classList.remove("tts-active")
}

function startTTS() {
  const article = document.querySelector("article")
  if (!article) return
  const text = (article as HTMLElement).innerText || ""
  if (!text.trim()) return

  const { lang, labelStop } = detectLang()

  currentUtterance       = new SpeechSynthesisUtterance(text)
  currentUtterance.lang  = lang
  currentUtterance.rate  = lang === "en-US" ? 0.95 : 0.9
  currentUtterance.pitch = 1.0

  currentUtterance.onend  = () => stopTTS()
  currentUtterance.onerror = () => stopTTS()

  synth.speak(currentUtterance)
  speaking = true

  const playIcon = document.getElementById("tts-play-icon")
  const stopIcon  = document.getElementById("tts-stop-icon")
  const label     = document.getElementById("tts-label")
  const btn       = document.getElementById("tts-toggle-top")
  if (playIcon) playIcon.style.display = "none"
  if (stopIcon) stopIcon.style.display  = "block"
  if (label)   label.textContent = labelStop
  if (btn)     btn.classList.add("tts-active")
}

function setupTTS() {
  const btn = document.getElementById("tts-toggle-top")
  if (!btn) return

  // 버튼 라벨을 현재 언어에 맞게 초기화
  const label = btn.querySelector("#tts-label")
  if (label) (label as HTMLElement).textContent = detectLang().labelPlay

  const newBtn = btn.cloneNode(true) as HTMLElement
  btn.parentNode?.replaceChild(newBtn, btn)

  newBtn.addEventListener("click", () => {
    if (speaking) {
      stopTTS()
    } else {
      startTTS()
    }
  })
}

function setupDarkmode() {
  const btn = document.getElementById("darkmode-toggle")
  if (!btn) return

  const isDark = document.documentElement.getAttribute("saved-theme") === "dark"
  const moon = btn.querySelector("#dark-moon") as HTMLElement | null
  const sun  = btn.querySelector("#dark-sun")  as HTMLElement | null
  if (moon) moon.style.display = isDark ? "none"  : "block"
  if (sun)  sun.style.display  = isDark ? "block" : "none"

  const newBtn = btn.cloneNode(true) as HTMLElement
  btn.parentNode?.replaceChild(newBtn, btn)

  newBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("saved-theme")
    const next    = current === "dark" ? "light" : "dark"

    document.documentElement.setAttribute("saved-theme", next)
    localStorage.setItem("saved-theme", next)

    const m = newBtn.querySelector("#dark-moon") as HTMLElement | null
    const s = newBtn.querySelector("#dark-sun")  as HTMLElement | null
    if (m) m.style.display = next === "dark" ? "none"  : "block"
    if (s) s.style.display = next === "dark" ? "block" : "none"

    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }))
    window.dispatchEvent(new StorageEvent("storage", { key: "saved-theme", newValue: next }))
  })
}

document.addEventListener("nav", () => {
  stopTTS()
  setupTTS()
  setupDarkmode()
})

setupTTS()
setupDarkmode()

window.addEventListener("beforeunload", stopTTS)