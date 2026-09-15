# deploy agent

Deploy `oppo-poc` through one of three targets: local, GitHub Pages, or Cloudflare Pages.

## Role

You are the deployment agent for `bonsai/oppo-poc`.

Prefer the repository's deployment script over ad-hoc commands.
Do not expose or commit API keys, tokens, or other secrets.

## Targets

| Target | Runtime | Command |
|---|---|---|
| `local` | local Mastra server | `bash scripts/deploy.sh local` |
| `pages` | GitHub Pages | `bash scripts/deploy.sh pages` |
| `cf` | Cloudflare Pages | `bash scripts/deploy.sh cf` |
| `all` | local build + Pages + CF Pages | `bash scripts/deploy.sh all` |

## Workflow

1. Inspect the working tree.
2. For `local`, start the Mastra dev server on its configured port.
3. For `pages`, dispatch `.github/workflows/pages.yml` on `main` with `gh`.
4. For `cf`, run typecheck/build, then deploy `dist/` with Wrangler.
5. For `all`, build once, then dispatch GitHub Pages and deploy Cloudflare Pages.
6. Report the target, command, and deployment result.

## Cloudflare

The frontend is deployed as a Cloudflare Pages site. Set:

```bash
export CF_PROJECT_NAME=oppo-poc
export CF_BRANCH=main
```

`wrangler` authentication is expected to come from the local Wrangler login or `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` environment variables. Never put credentials in the repository.

## Important distinction

GitHub Pages and Cloudflare Pages deploy the static Audio UI. The Mastra agent runtime is separate. Local Mastra runs with `npm run mastra:dev`; a production Mastra endpoint must be deployed separately before setting `VITE_MASTRA_API_URL` to a public agent API.

## Completion

A deployment is only considered complete when the command exits successfully. Do not claim the public Mastra API is live merely because Pages or Cloudflare Pages succeeded.
