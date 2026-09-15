type Voice = {
  id: string
  transcript: string
  createdAt: string
}

const STORAGE_KEY = 'oppo:voices'
const form = document.querySelector<HTMLFormElement>('#voice-form')!
const input = document.querySelector<HTMLTextAreaElement>('#transcript')!
const list = document.querySelector<HTMLDivElement>('#voices')!
const status = document.querySelector<HTMLParagraphElement>('#status')!
const submit = document.querySelector<HTMLButtonElement>('#submit')!

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
    ? voices.map((voice) => `<article class="voice"><time>${escapeHtml(new Date(voice.createdAt).toLocaleString('ja-JP'))}</time><p>${escapeHtml(voice.transcript)}</p><button class="reply" data-text="${escapeHtml(voice.transcript)}">返事をもらう</button><p class="reply-text" hidden></p></article>`).join('')
    : '<p class="empty">まだ声はありません。</p>'
}

const localReply = (text: string) => `「${text}」を受け取りました。`

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const transcript = input.value.trim()
  if (!transcript) return

  submit.disabled = true
  const voice: Voice = { id: crypto.randomUUID(), transcript, createdAt: new Date().toISOString() }
  save([voice, ...load()])
  input.value = ''
  status.textContent = '声を置きました。'
  render()
  submit.disabled = false
})

list.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.reply')
  if (!button) return
  const container = button.closest<HTMLElement>('.voice')!
  const reply = container.querySelector<HTMLElement>('.reply-text')!
  reply.textContent = localReply(button.dataset.text ?? '')
  reply.hidden = false
})

render()
