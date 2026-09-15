# TASKS — oppo Presence MVP

Issue: #24 Agent-first Presence UI / 留守番電話・Q2型インターフェース

## P0 — Agent-first loop

- [ ] Page open → agent attempts first utterance
- [ ] First utterance is short and quiet
- [ ] Browser autoplay restriction has first-touch fallback
- [ ] User voice → transcript
- [ ] Transcript → local agent response
- [ ] Local agent response → speech synthesis
- [ ] After response, return to waiting state

## P0 — Presence point

- [ ] Idle: faint point
- [ ] Agent speaking: point brightens / breathes
- [ ] User listening: point changes state
- [ ] Response complete: return to faint idle
- [ ] Keep the point as the primary interaction target

## P1 — Fallback / accessibility

- [ ] Text input remains usable as fallback
- [ ] Speech Recognition unavailable → clear status
- [ ] Speech Synthesis unavailable → text fallback
- [ ] Preserve accessible labels for the invisible control

## P1 — Existing behavior

- [ ] Keep localStorage transcript persistence
- [ ] Keep existing listen/reply fallback behavior
- [ ] Keep static GitHub Pages deployment

## P1 — Verification

- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] GitHub Actions Pages succeeds
- [ ] Desktop browser smoke test
- [ ] Mobile browser smoke test
- [ ] Verify first speech fallback after a user gesture

## P2 — Future agent boundary

- [ ] Extract `Agent` response interface
- [ ] Replace deterministic `localReply` with an agent adapter later
- [ ] Keep browser UI independent from agent implementation

## Explicitly not doing now

- [ ] Backend
- [ ] LLM API
- [ ] Authentication
- [ ] Chat dashboard
- [ ] Avatar
- [ ] Complex animation
