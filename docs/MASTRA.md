# Mastra

oppo uses Mastra as the conversational brain. The GitHub Pages site remains a static Audio UI; Mastra runs separately as the agent API.

## Architecture

```text
Browser / GitHub Pages
  ├─ SpeechRecognition
  ├─ SpeechSynthesis
  └─ invisible presence UI
          │
          │ POST /api/agents/oppoAgent/generate
          ▼
     Mastra Server
          │
          ▼
      oppo Agent
          │
          ▼
       LLM provider
```

Mastra is a TypeScript agent framework with agents, workflows, memory and server/runtime support. urlMastra official docshttps://mastra.ai/ai-agent-framework

## Local development

Install dependencies:

```bash
npm install
```

Set the provider key required by the selected model, for example:

```bash
export OPENAI_API_KEY=...
export MASTRA_MODEL=openai/gpt-5.5
```

Run Mastra:

```bash
npm run mastra:dev
```

Mastra Studio/API runs on port `4111` by default.

## GitHub Pages frontend

Set the Vite build variable:

```bash
VITE_MASTRA_API_URL=https://your-mastra-host.example.com
```

The browser never receives the model provider API key. It only calls the Mastra API.

If `VITE_MASTRA_API_URL` is absent or unreachable, oppo falls back to the small local response so the Pages demo remains usable without a backend.

## Deployment

GitHub Pages cannot run the Mastra server. Deploy the Mastra runtime separately to a Node-compatible or serverless environment, then point `VITE_MASTRA_API_URL` at it. Mastra supports standalone servers and deployers for platforms including Cloudflare, Vercel and Netlify. urlMastra deployment overviewhttps://mastra.ai/

## Design rule

Mastra is the **brain**, not the interface.

The interface remains:

```text
暗闇
 ↓
光点
 ↓
声
 ↓
Mastra
 ↓
声
```

The GUI should stay optional and nearly invisible.
