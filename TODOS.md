# TODOS

## Phase 0 — Foundation

| # | TODO | Done |
|---|---|---|
| 1 | Hono + TypeScriptの最小アプリを作る | [ ] |
| 2 | `/healthz` を実装する | [ ] |
| 3 | test / lint / typecheck をCIで動かす | [ ] |
| 4 | Domain / Application / Infrastructure の境界を作る | [ ] |

## Phase 1 — Domain

| # | TODO | Done |
|---|---|---|
| 5 | DeviceId / Wish / Voice / Proof / Room / Tagを定義する | [ ] |
| 6 | Wish作成Use Caseを実装する | [ ] |
| 7 | Voice投稿Use Caseを実装する | [ ] |
| 8 | Proof作成Use Caseを実装する | [ ] |
| 9 | Room / Tag検索Use Caseを実装する | [ ] |

## Phase 2 — Voice

| # | TODO | Done |
|---|---|---|
| 10 | Browser MediaRecorderで録音する | [ ] |
| 11 | 録音プレビューと再生を実装する | [ ] |
| 12 | Voice APIを実装する | [ ] |
| 13 | VoiceをバブルUIで表示する | [ ] |
| 14 | 音声保存方式を決める | [ ] |

## Phase 3 — FE PoC

| # | TODO | Done |
|---|---|---|
| 15 | Hono JSX PoC | [ ] |
| 16 | HTMX PoC | [ ] |
| 17 | React PoC | [ ] |
| 18 | 3方式を録音 / 再生 / バブルUIで比較する | [ ] |
| 19 | FE方式を1つに決定する | [ ] |

## Phase 4 — Mastra

| # | TODO | Done |
|---|---|---|
| 20 | Mastra Adapterの境界を作る | [ ] |
| 21 | `AnalyzePost` Use Caseを作る | [ ] |
| 22 | intent / tags / room candidateを生成する | [ ] |
| 23 | AI結果をInsightとして扱う | [ ] |
| 24 | AI候補をユーザー確定値と分離する | [ ] |

## Phase 5 — MVP

| # | TODO | Done |
|---|---|---|
| 25 | Wish投稿 | [ ] |
| 26 | Voice投稿 | [ ] |
| 27 | Proof投稿 | [ ] |
| 28 | Room | [ ] |
| 29 | Tag検索 | [ ] |
| 30 | device単位の制限 | [ ] |
| 31 | E2EでCore Loopを固定する | [ ] |
| 32 | README / PRD / MVP / DDDと実装を一致させる | [ ] |

## Core Loop

```text
open
 ↓
listen
 ↓
wish / voice
 ↓
Mastra insight
 ↓
post
 ↓
try
 ↓
proof
 ↓
listen
```

## 原則

- Railsを移植しない
- Elixir voice engineを移植しない
- まずHonoの最小実装から始める
- FEはPoC後に決める
- MastraはAI境界に閉じ込める
- DDDを実装量の増加理由にしない
- E2Eでユーザー体験を先に固定する
