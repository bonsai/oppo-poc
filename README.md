# 声の掲示板

> **SNS疲れを救う。**
>
> 悩みを一本の声にして放出し、誰かの声に答えることで、自分も少し軽くなる。
>
> **発信競争ではなく、助け合い。**

## MVP

「今日の声を残す → 少数の声を聴く → 声で答える → 次の日へ」というCore Loopを最小実装する。

### MVP stack

- Hono
- TypeScript
- HTMX + Vanilla JS
- MediaRecorder
- STT
- Mastra
- R2 / D1

FEはMVPでは **HTMX + Vanilla JS** を第一候補とし、Reactは導入しない。

```text
Browser
  ↓
HTMX + Vanilla JS / MediaRecorder
  ↓
Hono
  ↓
Application
  ↓
Domain
  ↓
Mastra Adapter
```

## Documentation

設計・仕様・実装計画はすべて `docs/` に集約する。

- [PRD](docs/PRD.md)
- [MVP](docs/MVP.md)
- [DDD](docs/DDD.md)
- [TODOS](docs/TODOS.md)

## Principle

> **「今日一本吹き込み、少数の声を受け取り、どれかに答える」というCore Loopに必要か？**

必要でなければMVPには入れない。
