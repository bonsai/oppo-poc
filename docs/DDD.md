# DDD — 声の掲示板

## 目的

声の掲示板を **Hono + TypeScript + Mastra** でゼロから実装するためのドメイン設計。

DDDを重く適用することではなく、MVPで重要な「声・やってみたい・やってみた・部屋・関係」をコード上の言葉として揃えることを目的とする。

## Domain

```text
Voice Board
│
├── Wish        やってみたいこと
├── Voice       声による表現
├── Proof       やってみた結果
├── Room        投稿が集まる場
├── Tag         投稿を見つけるための意味
├── Device      匿名利用者を識別する端末
└── AI Insight  Mastraが生成する構造化された理解
```

## Bounded Context

### 1. Board Context

投稿と関係を管理する中心ドメイン。

```text
Device → Wish → Proof
          │
          └→ Voice
          │
          ├→ Room
          └→ Tag
```

### 2. Voice Context

音声の録音・保存・再生を扱う。

```text
Recording
   ↓
Voice
   ↓
Audio Asset
   ↓
Playback
```

録音方式や保存形式はドメインから分離する。

### 3. Intelligence Context

MastraによるAI処理。

```text
Voice / Wish
     ↓
Mastra
     ↓
Insight
     ├─ tags
     ├─ room candidate
     ├─ intent
     └─ relations
```

AIの推論結果を直接ドメインモデルにしない。`Insight` として境界を持たせ、必要なものだけBoard Contextへ反映する。

## Core Domain

**Voice → Wish → Proof の循環**を中心にする。

```text
        Wish
       /    \
    Voice   Proof
       \    /
        Experience
```

- **Wish** = 誰かが「やってみたい」と表明する
- **Voice** = その経験・感情・提案を声で表現する
- **Proof** = 実際に「やってみた」ことを返す

単なる音声SNSではなく、**声から行動へ、行動から次の声へつながる場**をドメインの中心とする。

## Entity

### Device

匿名利用の単位。

```text
Device
- id
- voice_post_count
```

ユーザーアカウントはMVPでは存在しない。

### Wish

```text
Wish
- id
- device_id
- room_id
- content
- tags[]
- created_at
```

### Voice

```text
Voice
- id
- device_id
- wish_id?
- room_id
- audio_asset_id
- duration
- created_at
```

### Proof

```text
Proof
- id
- device_id
- wish_id
- content?
- voice_id?
- created_at
```

### Room

```text
Room
- id
- name
```

MVPでは `shiritori`, `savon`, `mcd` などを想定する。

### Tag

```text
Tag
- name
```

投稿から参照される意味単位。正規化の方法は実装時に決定する。

## Value Object

候補:

- `DeviceId`
- `WishId`
- `VoiceId`
- `ProofId`
- `RoomId`
- `TagName`
- `AudioAssetId`
- `VoiceDuration`

IDや値の検証をアプリケーション層に散らさず、必要なものからValue Object化する。

## Aggregate

### Wish Aggregate

```text
Wish
├── Tags
└── Proof references
```

Wishを「やってみたいこと」の境界とする。

### Voice Aggregate

```text
Voice
└── AudioAsset
```

音声ファイルそのものと、掲示板上のVoiceを分離する。

### Room Aggregate

```text
Room
└── room identity
```

MVPではシンプルな参照先として扱う。

## Domain Events

将来のAI・通知・分析を疎結合にするため、以下のイベントを候補とする。

```text
WishCreated
VoiceRecorded
VoicePosted
ProofCreated
TagAdded
RoomSelected
InsightGenerated
```

MVPではイベント基盤を作り込まず、まずドメイン上の言葉として定義する。

## Application Use Cases

```text
CreateWish
RecordVoice
PostVoice
PlayVoice
CreateProof
SearchByTag
ListRoomPosts
AnalyzePost
```

### AnalyzePost

Mastraを利用するユースケース。

```text
Post
 ↓
AnalyzePost
 ↓
Mastra Agent / Workflow
 ↓
Insight
```

例:

```json
{
  "intent": "wish",
  "tags": ["海", "朝食", "旅行"],
  "room_candidate": "mcd"
}
```

AI結果はあくまで候補であり、ドメイン上の確定値とは区別する。

## Architecture

```text
┌──────────────────────────────┐
│             FE               │
│ Hono JSX / HTMX / React      │
└──────────────┬───────────────┘
               │ HTTP
┌──────────────▼───────────────┐
│            Hono              │
│       API / Application      │
├──────────────┬───────────────┤
│ Board        │ Voice         │
│ Use Cases    │ Use Cases     │
└──────┬───────┴──────┬────────┘
       │              │
┌──────▼──────────────▼───────┐
│          Domain              │
│ Wish / Voice / Proof / Room  │
└──────────────┬───────────────┘
               │
       ┌───────▼────────┐
       │ Infrastructure │
       │ DB / Storage   │
       └────────────────┘

               ┌──────────────┐
               │    Mastra    │
               │ Intelligence │
               └──────┬───────┘
                      │
                   Insight
                      │
                      ▼
                    Hono
```

## FEとの境界

FE方式は別Issueで比較する。

```text
Hono JSX
HTMX
React
```

どれを採用しても、FEからDomainを直接操作しない。

```text
FE → Hono API → Application → Domain
```

## Mastraとの境界

MastraはDomainそのものではなく、**Intelligence Adapter** として扱う。

```text
Domain
  │
  ▼
Application: AnalyzePost
  │
  ▼
Mastra Adapter
  │
  ▼
Mastra Agent / Workflow
  │
  ▼
Insight
```

これにより、LLMやMastraを交換してもDomainモデルを変更せずに済む。

## MVPでDDDをやりすぎない

以下は後回しにする。

- 複雑なRepositoryパターン
- Event Sourcing
- CQRS
- 複数DBへの分散
- 大規模なAggregate設計
- 完全なDomain Event基盤
- AI Agentによる自律的なドメイン変更

まずは **Domain Language → Use Case → API → UI** の順に実装する。

## 完成判定

- [ ] Entity / Value Object / Aggregate がコード上で識別できる
- [ ] Wish → Voice → Proof の関係が実装に反映される
- [ ] Hono APIがApplication Use Caseを呼ぶ構造になる
- [ ] FEがDomain実装に直接依存しない
- [ ] MastraがIntelligence Contextとして分離される
- [ ] AIの推論結果と確定データを区別できる
- [ ] MVPの実装量を増やさない範囲でDDDの境界が保たれる
