const synth = window.speechSynthesis
let speaking = false
let currentUtterance: SpeechSynthesisUtterance | null = null

function stopTTS() {
  synth.cancel()
  speaking = false
  currentUtterance = null
  const playIcon = document.getElementById("tts-play-icon")
  const stopIcon = document.getElementById("tts-stop-icon")
  const label = document.getElementById("tts-label")
  const btn = document.getElementById("tts-toggle-top")
  if (playIcon) playIcon.style.display = "block"
  if (stopIcon) stopIcon.style.display = "none"
  if (label) label.textContent = "읽기"
  if (btn) btn.classList.remove("tts-active")
}

function startTTS() {
  const article = document.querySelector("article")
  if (!article) return
  const text = (article as HTMLElement).innerText || ""
  if (!text.trim()) return

  currentUtterance = new SpeechSynthesisUtterance(text)
  currentUtterance.lang = "ko-KR"
  currentUtterance.rate = 0.9
  currentUtterance.pitch = 1.0

  currentUtterance.onend = () => stopTTS()
  currentUtterance.onerror = () => stopTTS()

  synth.speak(currentUtterance)
  speaking = true

  const playIcon = document.getElementById("tts-play-icon")
  const stopIcon = document.getElementById("tts-stop-icon")
  const label = document.getElementById("tts-label")
  const btn = document.getElementById("tts-toggle-top")
  if (playIcon) playIcon.style.display = "none"
  if (stopIcon) stopIcon.style.display = "block"
  if (label) label.textContent = "정지"
  if (btn) btn.classList.add("tts-active")
}

function setupTTS() {
  const btn = document.getElementById("tts-toggle-top")
  if (!btn) return

  // 기존 리스너 제거 후 재등록
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

// 페이지 이동시마다 재등록
document.addEventListener("nav", () => {
  stopTTS()
  setupTTS()
})

setupTTS()

// 페이지 이탈시 중지
window.addEventListener("beforeunload", stopTTS)
