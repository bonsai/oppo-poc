# PRD — 声の掲示板

## 1. Product

**声の掲示板**は、「やってみたい」を短い声として置き、誰かが聴き、実際にやってみた結果をproofとして返す場。

```text
声を聴く
  ↓
やってみたい
  ↓
声を置く
  ↓
誰かがやってみる
  ↓
proof
  ↓
また声を聴く
```

## 2. User

ログインせず、スマートフォンまたはPCのブラウザから使う。
投稿者の本人性ではなく、**その場に置かれた声と経験**を中心にする。

## 3. MVP experience

### Listen
投稿されたVoiceをバブルとして見る。押して再生する。

### Wish
「やってみたいこと」を短く投稿する。

### Record
長押しして録音し、離すとプレビュー、確認後に投稿する。

### Organize
RoomとTagで投稿をまとめる。

### Try / Proof
Wishを見て実行した人がProofを返す。

### AI assist
MastraがWish / Voiceを解析し、`intent`、`tags`、`room candidate`などの候補を返す。
AIは公開内容を勝手に確定しない。

## 4. MVP scope

- anonymous `device_id`
- Voice投稿 / 再生
- Wish投稿
- Proof投稿
- Room
- Tag
- 長押し録音
- バブルUI
- Mastraによる投稿構造化
- Hono API
- E2E / CI

## 5. Non-goals

- login / account
- follow / DM
- 長時間配信
- 高度な音声編集
- 完全自律Agent
- 複雑な推薦
- Event Sourcing / CQRS
- 本番DBの早期固定
- 高度なrealtime

## 6. Architecture

```text
FE
 │
 ▼
Hono
 │
 ├── Application
 │      │
 │      └── Domain
 │           ├── Wish
 │           ├── Voice
 │           ├── Proof
 │           ├── Room
 │           └── Tag
 │
 └── Intelligence Adapter
          │
          ▼
        Mastra
          │
          ▼
        Insight
```

Rails / Elixirの既存実装は移植しない。

## 7. FE decision

Hono JSX / HTMX / React を比較する。

共通PoC:

- Voice list
- long-press recording
- playback
- bubble UI
- Wish
- Room
- Mastra suggestion

PoC後に1方式を決定する。

## 8. API first draft

```text
GET  /healthz
GET  /api/voices
POST /api/voices
GET  /api/voices/:id
POST /api/wishes
GET  /api/wishes
POST /api/wishes/:id/proofs
GET  /api/tags/:tag
GET  /api/rooms/:room
POST /api/ai/analyze
```

APIはApplication Use Caseを公開する薄い境界とする。

## 9. Data

### Device

`device_id`

### Wish

`id / device_id / room_id / content / tags / created_at`

### Voice

`id / device_id / wish_id? / room_id / audio_asset_id / duration / created_at`

### Proof

`id / device_id / wish_id / content? / voice_id? / created_at`

### Room

`id / name`

### Tag

`name`

## 10. Definition of Done

```text
anonymous open
 → listen
 → record
 → post
 → AI suggestion
 → bubble
 → try
 → proof
```

この一連の体験がブラウザで動き、HonoのテストとE2EがCIで通ること。