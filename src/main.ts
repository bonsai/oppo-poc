import './style.css'

export {}

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
const MASTRA_API_URL = import.meta.env.VITE_MASTRA_API_URL?.replace(/\/$/, '')
const form = document.querySelector<HTMLFormElement>('#voice-form')!
const input = document.querySelector<HTMLTextAreaElement>('#transcript')!
const list = document.querySelector<HTMLDivElement>('#voices')!
const statusEl = document.querySelector<HTMLParagraphElement>('#status')!
const submit = document.querySelector<HTMLButtonElement>('#submit')!
const record = document.querySelector<HTMLButtonElement>('#record')!
const speak = document.querySelector<HTMLButtonElement>('#speak')!
const recordingTime = document.querySelector<HTMLSpanElement>('#recording-time')!
const point = document.querySelector<HTMLButtonElement>('#record')!

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
    ? voices.map((voice) => `<article class="voice"><time>${escapeHtml(new Date(voice.createdAt).toLocaleString('ja-JP'))}</time><p>${escapeHtml(voice.transcript)}</p><div class="voice-actions"><button class="reply" data-text="${escapeHtml(voice.transcript)}">返事をもらう</button><button class="play" data-text="${escapeHtml(voice.transcript)}">聴く</button></div><p class="reply-text" hidden></p></article>`).join('')
    : '<p class="empty">まだ声はありません。</p>'
}

const setPresence = (state: 'idle' | 'speaking' | 'listening') => {
  point.dataset.state = state
  point.setAttribute('aria-label', state === 'listening' ? '話すのを止める' : '話しかける')
}

const speakText = (text: string, onDone?: () => void) => {
  if (!text || !('speechSynthesis' in window)) {
    onDone?.()
    return false
  }

  speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  utterance.volume = 0.55
  utterance.rate = 0.9
  utterance.onstart = () => setPresence('speaking')
  utterance.onend = () => {
    setPresence('idle')
    onDone?.()
  }
  utterance.onerror = () => {
    setPresence('idle')
    onDone?.()
  }
  speechSynthesis.speak(utterance)
  return true
}

const localReply = (text: string) => `「${text}」を受け取りました。`

const askMastra = async (text: string): Promise<string | null> => {
  if (!MASTRA_API_URL) return null

  try {
    const response = await fetch(`${MASTRA_API_URL}/api/agents/oppoAgent/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: text }],
      }),
    })

    if (!response.ok) return null
    const data = await response.json() as { text?: unknown }
    return typeof data.text === 'string' && data.text.trim() ? data.text.trim() : null
  } catch {
    return null
  }
}

const respond = async (text: string) => {
  const reply = await askMastra(text) ?? localReply(text)
  speakText(reply)
  return reply
}

let recognition: SpeechRecognition | null = null
let startedAt = 0
let timer: number | undefined
let greeted = false
let awaitingReply = false

const finishVoice = async () => {
  const transcript = input.value.trim()
  if (!transcript) return

  const voice: Voice = { id: crypto.randomUUID(), transcript, createdAt: new Date().toISOString() }
  save([voice, ...load()])
  input.value = ''
  statusEl.textContent = MASTRA_API_URL ? '考えています…' : ''
  awaitingReply = true
  await respond(transcript)
  awaitingReply = false
  statusEl.textContent = ''
  render()
}

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
if (SpeechRecognitionAPI) {
  const recognizer = new SpeechRecognitionAPI()
  recognition = recognizer
  recognizer.lang = 'ja-JP'
  recognizer.continuous = true
  recognizer.interimResults = true

  recognizer.onstart = () => {
    setPresence('listening')
    statusEl.textContent = '聴いています…'
    startedAt = Date.now()
    timer = window.setInterval(() => {
      recordingTime.textContent = `${Math.floor((Date.now() - startedAt) / 1000)}秒`
    }, 250)
  }

  recognizer.onresult = (event) => {
    let transcript = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript
    }
    input.value = transcript.trim()
  }

  recognizer.onerror = () => {
    setPresence('idle')
    statusEl.textContent = 'もう一度、点に触れてください。'
  }

  recognizer.onend = () => {
    record.classList.remove('recording')
    record.setAttribute('aria-pressed', 'false')
    if (timer) window.clearInterval(timer)
    timer = undefined
    recordingTime.textContent = ''
    setPresence('idle')
    void finishVoice()
  }
} else {
  record.title = 'このブラウザでは音声入力に対応していません'
}

const greet = () => {
  if (greeted || awaitingReply) return
  greeted = true
  statusEl.textContent = ''
  speakText('……いるよ。')
}

record.addEventListener('click', () => {
  if (!recognition) {
    speakText('声を聞くことができません。')
    return
  }

  if (record.getAttribute('aria-pressed') === 'true') {
    recognition.stop()
    return
  }

  greet()
  try {
    recognition.start()
  } catch {
    statusEl.textContent = '少し待ってから、もう一度。'
  }
})

speak.addEventListener('click', () => speakText(input.value.trim()))

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const transcript = input.value.trim()
  if (!transcript) return

  submit.disabled = true
  const voice: Voice = { id: crypto.randomUUID(), transcript, createdAt: new Date().toISOString() }
  save([voice, ...load()])
  input.value = ''
  statusEl.textContent = MASTRA_API_URL ? '考えています…' : ''
  void respond(transcript).finally(() => {
    statusEl.textContent = ''
    submit.disabled = false
    render()
  })
})

list.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  const replyButton = target.closest<HTMLButtonElement>('.reply')
  const playButton = target.closest<HTMLButtonElement>('.play')

  if (playButton) void respond(playButton.dataset.text ?? '')
  if (!replyButton) return

  const container = replyButton.closest<HTMLElement>('.voice')!
  const reply = container.querySelector<HTMLElement>('.reply-text')!
  reply.textContent = localReply(replyButton.dataset.text ?? '')
  reply.hidden = false
})

render()

// Best-effort first contact. Browsers may require a user gesture; the point's
// first tap then retries the same greeting before opening the microphone.
window.setTimeout(greet, 500)
