#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

TARGET="${1:-local}"

usage() {
  cat <<'EOF'
Usage: bash scripts/deploy.sh <target>

Targets:
  local   Run the Mastra server locally (default)
  pages   Trigger GitHub Pages deployment for main
  cf      Build and deploy the frontend to Cloudflare Pages
  all     Build locally, then trigger Pages and deploy Cloudflare Pages

Environment:
  CF_PROJECT_NAME   Cloudflare Pages project name (default: oppo-poc)
  CF_BRANCH         Cloudflare Pages branch (default: main)
EOF
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "error: required command not found: $1" >&2
    exit 1
  }
}

build() {
  npm install
  npm run typecheck
  npm run build
}

pages() {
  require_cmd gh
  echo "==> GitHub Pages: pages.yml / main"
  gh workflow run pages.yml --ref main
  echo "==> Pages workflow dispatched"
}

cloudflare() {
  require_cmd npx
  local project_name="${CF_PROJECT_NAME:-oppo-poc}"
  local branch="${CF_BRANCH:-main}"

  echo "==> Cloudflare Pages: ${project_name} / ${branch}"
  npx wrangler pages deploy dist \
    --project-name "$project_name" \
    --branch "$branch"
}

case "$TARGET" in
  local)
    require_cmd npm
    echo "==> Local Mastra server"
    npm run mastra:dev
    ;;
  pages)
    pages
    ;;
  cf)
    require_cmd npm
    build
    cloudflare
    ;;
  all)
    require_cmd npm
    build
    pages
    cloudflare
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    echo "error: unknown deploy target: $TARGET" >&2
    usage >&2
    exit 2
    ;;
esac
