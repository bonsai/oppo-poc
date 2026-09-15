import { Hono } from 'hono'
import { VoiceBoard } from './domain'

const app = new Hono()
const board = new VoiceBoard()

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]!)

const voiceList = () => board.listVoices().map((voice) => `
  <article class="voice">
    <time>${escapeHtml(new Date(voice.createdAt).toLocaleString('ja-JP'))}</time>
    <p>${escapeHtml(voice.transcript)}</p>
  </article>
`).join('') || '<p class="empty">まだ声はありません。</p>'

app.get('/healthz', (c) => c.json({ status: 'ok' }))

app.get('/api/voices', (c) => c.json(board.listVoices()))

app.post('/api/voices', async (c) => {
  const body = await c.req.parseBody()
  const deviceId = String(body.device_id ?? 'anonymous')
  const transcript = String(body.transcript ?? '')

  try {
    board.addVoice(deviceId, transcript)
  } catch {
    return c.html('<p class="error">声を入力してください。</p>', 400)
  }

  return c.html(voiceList())
})

app.get('/', (c) => c.html(`<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>myapp — 声の掲示板</title>
  <script src="https://unpkg.com/htmx.org@2.0.7"></script>
  <style>
    :root { font-family: system-ui, sans-serif; color-scheme: light dark; }
    body { max-width: 720px; margin: 0 auto; padding: 2rem 1rem; }
    textarea { width: 100%; min-height: 8rem; box-sizing: border-box; }
    button { padding: .7rem 1rem; margin-top: .5rem; }
    .voice { border-top: 1px solid #8885; padding: 1rem 0; }
    time { font-size: .8rem; opacity: .65; }
    .error { color: #c33; }
  </style>
</head>
<body>
  <main>
    <h1>声の掲示板</h1>
    <p>今日の声をひとつ。名前やフォローはありません。</p>
    <form hx-post="/api/voices" hx-target="#voices" hx-swap="innerHTML">
      <input type="hidden" name="device_id" value="anonymous">
      <textarea name="transcript" placeholder="いま思っていることを声にしてください"></textarea>
      <br>
      <button type="submit">声を置く</button>
    </form>
    <section id="voices" aria-live="polite">${voiceList()}</section>
  </main>
</body>
</html>`))

export default app
