# Deploy

## Stack

- Hono
- HTMX
- Vite
- Cloudflare Workers
- Wrangler

The MVP is a full-stack Worker, so deploy it to **Cloudflare Workers**, not a static-only Pages build.

## Local

```bash
npm install
npm run dev
```

Vite runs the Worker locally.

## Build

```bash
npm run build
```

## Deploy

Authenticate Wrangler once:

```bash
npx wrangler login
```

Then:

```bash
npm run deploy
```

The Worker name is `bonsai-myapp`.

## Production MVP boundary

The current POC keeps voices in memory. A production deployment therefore needs persistent storage before it is treated as a real MVP.

Next storage step: Cloudflare D1 (metadata/transcripts) and R2 (audio), while keeping the same domain/application-service boundary.
