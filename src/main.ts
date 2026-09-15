interface SpeechRecognitionResultEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  onstart: (() => void) | null
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition
    webkitSpeechRecognition?: new () => SpeechRecognition
  }
}

type Voice = {
  id: string
  transcript: string
  createdAt: string
}

const STORAGE_KEY = 'oppo:voices'
const form = document.querySelector<HTMLFormElement>('#voice-form')!
const input = document.querySelector<HTMLTextAreaElement>('#transcript')!
const list = document.querySelector<HTMLDivElement>('#voices')!
const statusEl = document.querySelector<HTMLParagraphElement>('#status')!
const submit = document.querySelector<HTMLButtonElement>('#submit')!
const record = document.querySelector<HTMLButtonElement>('#record')!
const speak = document.querySelector<HTMLButtonElement>('#speak')!
const recordingTime = document.querySelector<HTMLSpanElement>('#recording-time')!

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!)

const load = (): Voice[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Voice[]
  } catch {
    return []
  }
}

const save = (voices: Voice[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(voices))

const render = () => {
  const voices = load()
  list.innerHTML = voices.length
    ? voices.map((voice) => `<article class="voice"><time>${escapeHtml(new Date(voice.createdAt).toLocaleString('ja-JP'))}</time><p>${escapeHtml(voice.transcript)}</p><div class="voice-actions"><button class="reply" data-text="${escapeHtml(voice.transcript)}">返事をもらう</button><button class="play" data-text="${escapeHtml(voice.transcript)}">🔊 聴く</button></div><p class="reply-text" hidden></p></article>`).join('')
    : '<p class="empty">まだ声はありません。</p>'
}

const speakText = (text: string) => {
  if (!('speechSynthesis' in window)) {
    statusEl.textContent = 'このブラウザでは読み上げに対応していません。'
    return
  }
  speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  speechSynthesis.speak(utterance)
}

const localReply = (text: string) => `「${text}」を受け取りました。`

let recognition: SpeechRecognition | null = null
let startedAt = 0
let timer: number | undefined

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
if (SpeechRecognitionAPI) {
  recognition = new SpeechRecognitionAPI()
  recognition.lang = 'ja-JP'
  recognition.continuous = true
  recognition.interimResults = true

  recognition.onstart = () => {
    record.classList.add('recording')
    record.textContent = '■ 録音を止める'
    record.setAttribute('aria-pressed', 'true')
    statusEl.textContent = '聴いています…'
    startedAt = Date.now()
    timer = window.setInterval(() => {
      recordingTime.textContent = `${Math.floor((Date.now() - startedAt) / 1000)}秒`
    }, 250)
  }

  recognition.onresult = (event) => {
    let transcript = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript
    }
    input.value = transcript.trim()
  }

  recognition.onerror = () => {
    statusEl.textContent = '音声入力を開始できませんでした。文字でも入力できます。'
  }

  recognition.onend = () => {
    record.classList.remove('recording')
    record.textContent = '● 録音する'
    record.setAttribute('aria-pressed', 'false')
    if (timer) window.clearInterval(timer)
    timer = undefined
    recordingTime.textContent = ''
  }
} else {
  record.disabled = true
  record.title = 'このブラウザでは音声入力に対応していません'
}

record.addEventListener('click', () => {
  if (!recognition) return
  if (record.getAttribute('aria-pressed') === 'true') recognition.stop()
  else recognition.start()
})

speak.addEventListener('click', () => {
  const text = input.value.trim()
  if (!text) return
  speakText(text)
  statusEl.textContent = '読み上げています。'
})

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const transcript = input.value.trim()
  if (!transcript) return

  submit.disabled = true
  const voice: Voice = { id: crypto.randomUUID(), transcript, createdAt: new Date().toISOString() }
  save([voice, ...load()])
  input.value = ''
  statusEl.textContent = '声を置きました。'
  render()
  submit.disabled = false
})

list.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  const replyButton = target.closest<HTMLButtonElement>('.reply')
  const playButton = target.closest<HTMLButtonElement>('.play')

  if (playButton) speakText(playButton.dataset.text ?? '')
  if (!replyButton) return

  const container = replyButton.closest<HTMLElement>('.voice')!
  const reply = container.querySelector<HTMLElement>('.reply-text')!
  reply.textContent = localReply(replyButton.dataset.text ?? '')
  reply.hidden = false
})

render()
