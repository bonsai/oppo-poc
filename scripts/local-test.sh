#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BASE_URL="${BASE_URL:-http://127.0.0.1:5173}"
LOG_FILE="${TMPDIR:-/tmp}/myapp-local-test.log"

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

if [[ ! -d node_modules ]]; then npm install; fi
npm run typecheck
npm test

: > "$LOG_FILE"
npm run dev -- --host 127.0.0.1 --port 5173 >"$LOG_FILE" 2>&1 &
SERVER_PID=$!

for _ in {1..30}; do
  curl -fsS "$BASE_URL/healthz" >/dev/null 2>&1 && break
  sleep 1
done

curl -fsS "$BASE_URL/healthz"
echo
curl -fsS "$BASE_URL/api/voices"
echo

RESPONSE="$(curl -fsS -X POST -H 'Content-Type: application/x-www-form-urlencoded' --data 'device_id=local-test&transcript=ローカルテストの声です' "$BASE_URL/api/voices")"
echo "$RESPONSE"
grep -q 'ローカルテストの声です' <<<"$RESPONSE"

VOICES="$(curl -fsS "$BASE_URL/api/voices")"
echo "$VOICES"
grep -q 'ローカルテストの声です' <<<"$VOICES"

echo 'PASS: local MVP checks completed'
