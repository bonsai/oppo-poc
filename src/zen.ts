const ZEN_URL = 'https://opencode.ai/zen/v1/chat/completions'
const DEFAULT_MODEL = 'glm-5.3-flash'

export type SafetyResult = 'ALLOW' | 'HOLD' | 'REJECT'

type Env = { ZEN_API_KEY?: string; ZEN_MODEL?: string }

export async function moderate(text: string, env: Env): Promise<SafetyResult> {
  if (!env.ZEN_API_KEY) return 'ALLOW'
  const response = await fetch(ZEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${env.ZEN_API_KEY}` },
    body: JSON.stringify({
      model: env.ZEN_MODEL || DEFAULT_MODEL,
      messages: [
        { role: 'system', content: 'Classify the text as exactly ALLOW, HOLD, or REJECT. Return only one word.' },
        { role: 'user', content: text },
      ],
      temperature: 0,
      max_tokens: 8,
    }),
  })
  if (!response.ok) return 'HOLD'
  const data = await response.json() as any
  const result = String(data?.choices?.[0]?.message?.content ?? '').trim().toUpperCase()
  return result === 'REJECT' || result === 'HOLD' ? result : 'ALLOW'
}

export async function reply(text: string, env: Env): Promise<string> {
  if (!env.ZEN_API_KEY) return `「${text}」を受け取りました。`
  const response = await fetch(ZEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${env.ZEN_API_KEY}` },
    body: JSON.stringify({
      model: env.ZEN_MODEL || DEFAULT_MODEL,
      messages: [
        { role: 'system', content: 'Reply briefly and kindly in Japanese. One or two sentences.' },
        { role: 'user', content: text },
      ],
      temperature: 0.7,
      max_tokens: 100,
    }),
  })
  if (!response.ok) return '声を受け取りました。'
  const data = await response.json() as any
  return String(data?.choices?.[0]?.message?.content ?? '声を受け取りました。').trim()
}
