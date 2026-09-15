# PRD — oppo Presence MVP

## 1. Product

**oppo** is an audio-first, presence-based voice experience.

The user should not feel that they are operating a GUI. The default experience is a dark screen with a small light point. The agent is allowed to speak first, like an answering machine: the user enters the space, the agent notices the presence and begins with a short utterance.

## 2. Problem

Conventional chat interfaces require the user to look at the screen, find an input field, and initiate the conversation. This adds an unnecessary UI layer for a simple voice interaction.

oppo tests whether a conversation can begin from **presence → agent voice → user voice → agent voice**, with the GUI becoming secondary.

## 3. Goal

Validate a minimal agent-first audio interaction that works on a static GitHub Pages site.

### Success criteria

1. Opening the page presents darkness and a small light point.
2. The agent attempts a short first utterance without requiring a GUI action.
3. The point communicates waiting / speaking / listening states.
4. The user can answer by voice.
5. The agent gives a local response by voice.
6. Text input remains available only as a fallback/accessibility path.
7. No backend or external AI API is required for the MVP.

## 4. UX concept

```text
open
  ↓
暗闇 + 光点
  ↓
agent: 「……いるよ。」
  ↓
待つ
  ↓
user voice
  ↓
agent: local response
  ↓
待つ
```

The interaction should feel closer to a **留守番電話 / Q2-like voice presence** than to a chat application.

## 5. Functional requirements

### FR-01 Agent-first greeting

On first contact, attempt to speak a short Japanese greeting. Browser autoplay restrictions must not break the experience; a first user interaction can be used as fallback.

### FR-02 Voice input

Use browser Speech Recognition when available. The central point is the primary interaction target.

### FR-03 Voice response

Use browser Speech Synthesis for the agent response. The MVP response may be deterministic/local; an AI backend is explicitly out of scope.

### FR-04 Presence state

The point must visually communicate at least idle / agent speaking / user listening.

### FR-05 Local persistence

Keep submitted voice transcripts in browser localStorage for the existing fallback/history implementation.

### FR-06 Fallback

If speech recognition or synthesis is unavailable, the user can still use text input and the page must remain usable.

## 6. Non-functional requirements

- Static deployment on GitHub Pages.
- TypeScript + Vite.
- No server required.
- No mandatory API key.
- Mobile and desktop browser compatible where Web Speech APIs are supported.
- The default visual surface must remain nearly invisible.
- Accessibility labels must remain available even when visual controls are hidden.

## 7. Non-goals

- Full chat UI.
- Avatar or character animation.
- Dashboard / analytics UI.
- Authentication.
- Multi-user synchronization.
- LLM API integration.
- Conversation history as the primary screen.
- Screen-operation-dependent conversation.

## 8. Technical design

```text
GitHub Pages
    │
    └── Vite static app
          ├── TypeScript
          ├── SpeechRecognition
          ├── SpeechSynthesis
          └── localStorage
```

The current application is frontend-only. The local response function is intentionally replaceable by a future agent runtime.

## 9. Browser constraint

Browsers may block speech synthesis started without a user gesture. The implementation therefore uses **best effort agent-first speech** and a graceful first-touch fallback. This is a platform constraint, not a reason to restore a conventional GUI.

## 10. Definition of Done

- [ ] Agent-first greeting is implemented.
- [ ] Voice reply automatically produces an agent response.
- [ ] Presence point communicates state.
- [ ] GUI remains hidden/minimal by default.
- [ ] Text fallback works.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] GitHub Pages deployment succeeds.
- [ ] Issue #24 is satisfied.
