#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BASE_URL="${BASE_URL:-http://127.0.0.1:8787}"
LOG_FILE="${TMPDIR:-/tmp}/myapp-local-test.log"

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "==> install check"
if [[ ! -d node_modules ]]; then
  npm install
fi

echo "==> typecheck"
npm run typecheck

echo "==> unit tests"
npm test

echo "==> start local Worker"
: > "$LOG_FILE"
npm run dev -- --host 127.0.0.1 --port 8787 >"$LOG_FILE" 2>&1 &
SERVER_PID=$!

for _ in {1..30}; do
  if curl -fsS "$BASE_URL/healthz" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! curl -fsS "$BASE_URL/healthz" >/tmp/myapp-health.json; then
  echo "ERROR: server did not start"
  cat "$LOG_FILE"
  exit 1
fi

echo "==> health check"
cat /tmp/myapp-health.json
echo

echo "==> API GET"
curl -fsS "$BASE_URL/api/voices"
echo

echo "==> API POST"
RESPONSE="$(curl -fsS -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'device_id=local-test&transcript=ローカルテストの声です' \
  "$BASE_URL/api/voices")"

echo "$RESPONSE"

if ! grep -q 'ローカルテストの声です' <<<"$RESPONSE"; then
  echo "ERROR: POST response did not contain test voice"
  exit 1
fi

echo "==> API GET after POST"
VOICES="$(curl -fsS "$BASE_URL/api/voices")"
echo "$VOICES"

if ! grep -q 'ローカルテストの声です' <<<"$VOICES"; then
  echo "ERROR: voice was not returned by GET /api/voices"
  exit 1
fi

echo
echo "PASS: local POC checks completed"
