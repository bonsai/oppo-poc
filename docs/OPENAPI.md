# OpenAPI

`openapi/oppo.yaml` defines the HTTP boundary between the invisible Audio UI and the Mastra `oppo` agent.

## Endpoint

```text
POST /api/agents/oppoAgent/generate
```

The browser sends conversation messages. The API returns text that the browser passes to SpeechSynthesis.

```text
Audio UI
  ↓
POST /api/agents/oppoAgent/generate
  ↓
Mastra oppoAgent
  ↓
text
  ↓
SpeechSynthesis
```

The browser must never contain model/API credentials.

## Local development

Run the Mastra server:

```bash
npm run mastra:dev
```

The OpenAPI document assumes the local server is available at `http://localhost:4111`.

## Design principle

OpenAPI describes the **boundary**, not the implementation. Mastra remains the agent runtime; the browser remains responsible for microphone input and speech output.
