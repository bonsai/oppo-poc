import { Hono } from 'hono'
import { VoiceBoard } from './domain'
import { moderate, reply } from './zen'

type Env = { Bindings: { ZEN_API_KEY?: string; ZEN_MODEL?: string } }
const app = new Hono<Env>()
const board = new VoiceBoard()

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
const voiceList = () => board.listVoices().map((v) => `<article class="voice"><time>${escapeHtml(new Date(v.createdAt).toLocaleString('ja-JP'))}</time><p>${escapeHtml(v.transcript)}</p></article>`).join('') || '<p>まだ声はありません。</p>'

app.get('/healthz', (c) => c.json({ status: 'ok' }))
app.get('/api/voices', (c) => c.json(board.listVoices()))

app.post('/api/voices', async (c) => {
  const body = await c.req.parseBody()
  const deviceId = String(body.device_id ?? 'anonymous')
  const transcript = String(body.transcript ?? '')
  if (!transcript.trim()) return c.html('<p class="error">声を入力してください。</p>', 400)
  const safety = await moderate(transcript, c.env)
  if (safety === 'REJECT') return c.html('<p class="error">この声は公開できません。</p>', 422)
  if (safety === 'HOLD') return c.html('<p>確認中です。しばらくお待ちください。</p>', 202)
  board.addVoice(deviceId, transcript)
  return c.html(voiceList())
})

app.post('/api/replies', async (c) => {
  const body = await c.req.parseBody()
  const transcript = String(body.transcript ?? '')
  if (!transcript.trim()) return c.json({ error: 'transcript is required' }, 400)
  const safety = await moderate(transcript, c.env)
  if (safety !== 'ALLOW') return c.json({ status: safety }, 422)
  return c.json({ status: 'ok', reply: await reply(transcript, c.env) })
})

app.get('/', (c) => c.html(`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>myapp — 声の掲示板</title><script src="https://unpkg.com/htmx.org@2.0.7"></script><style>body{max-width:720px;margin:auto;padding:2rem 1rem;font-family:system-ui,sans-serif}textarea{width:100%;min-height:8rem;box-sizing:border-box}button{padding:.7rem 1rem;margin-top:.5rem}.voice{border-top:1px solid #8885;padding:1rem 0}.error{color:#c33}small{opacity:.6}</style></head><body><main><h1>声の掲示板</h1><p>今日の声をひとつ。名前やフォローはありません。</p><form hx-post="/api/voices" hx-target="#voices" hx-swap="innerHTML"><input type="hidden" name="device_id" value="anonymous"><textarea name="transcript" placeholder="いま思っていることを声にしてください"></textarea><br><button type="submit">声を置く</button></form><p><small>OpenCode Zen: APIキーが空ならローカルフォールバックで動作します。</small></p><section id="voices">${voiceList()}</section></main></body></html>`))

export default app
