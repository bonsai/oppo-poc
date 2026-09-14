# MVP

## 声の掲示板

「やってみたい」を、文字ではなく**声**で投稿し、他の人の声を聴き、「やってみた」につなげる最小プロダクト。

## 目的

匿名で気軽に声を投稿できる場を作る。

最初からSNSや高度なAIサービスを作るのではなく、

**声を投稿する → 聴く → やってみる → proofを返す**

という体験を成立させる。

## 技術方針

- Hono + TypeScript を中心にゼロから実装
- FE方式は Hono JSX / HTMX / React を比較して決定
- Mastra はAI / Agent層として利用
- FEからMastraへ直接依存しない
- Hono APIをアプリケーションとAIの境界にする
- 既存の Rails / Elixir 実装は移植しない

```text
Browser
   │
   ▼
FE
   │
   ▼
Hono
   ├── Voice API
   ├── Wish API
   ├── Proof API
   └── Room / Tag API
          │
          ▼
       Mastra
       AI / Agent
```

## MVPユーザー体験

### 1. 開く

ログインなしで声の掲示板を開く。

### 2. 聴く

投稿された声がバブルとして並んでいる。

バブルを押すと音声を再生する。

### 3. 投稿する

「長押しして話す」ことで短い音声を録音する。

```text
press
  ↓
recording
  ↓
release
  ↓
preview
  ↓
post
```

### 4. wish

声に「やってみたいこと」を含める。

例:

> 海辺で朝ごはん食べたい

### 5. AI補助

Mastraが投稿内容を解析し、タグやroomの候補を返す。

```json
{
  "text": "海辺で朝ごはん食べたい",
  "tags": ["海", "朝食", "旅行"],
  "room": "mcd"
}
```

最終的な投稿内容はユーザーまたはアプリ側で確定する。AIが勝手に公開投稿を確定することはMVPでは行わない。

### 6. proof

他の人のwishを見て、実際にやってみたらproofを投稿できる。

```text
wish
  │
  └── proof
```

## MVPデータ

### Device

匿名利用のため、ログインユーザーではなく `device_id` を基本識別子とする。

### Voice

- device_id
- room
- 音声データ
- 投稿日時
- 関連wish

### Wish

- device_id
- 本文または音声
- tags
- room
- 投稿日時

### Proof

- device_id
- wish_id
- 本文または音声
- 投稿日時

## MVP画面

### `/`

メインの声空間。

- voice bubbles
- 録音ボタン
- room
- tags
- wish / proofへの導線

### `/post`

投稿画面。

- 長押し録音
- 録音状態
- プレビュー
- 投稿
- AIタグ候補

### `/tags/:tag`

タグによる投稿検索。

### `/rooms/:room`

roomごとの投稿一覧。

## MVP API

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
POST /api/ai/classify
```

APIの具体的な入出力は実装時に確定する。

## Mastra MVP

Mastraは「何でも自律的に行うAgent」にはしない。

最初は以下の1本を成立させる。

```text
投稿
 ↓
Mastra
 ↓
構造化
 ↓
tags / room / intent
```

将来的には、投稿間の関係、proofの発見、roomの生成、推薦などへ拡張できる。

## FE MVP

FE方式はIssue #3で比較する。

比較対象:

1. Hono JSX
2. HTMX
3. React

共通PoCでは、少なくとも以下を比較する。

- wish投稿
- 長押し録音
- 音声再生
- バブルUI
- room切替
- Mastraタグ候補

**MVP実装開始時点ではFE方式を固定しない。** PoCの結果で決定する。

## 今回やらないこと

- ユーザー登録 / ログイン
- フォロー / DM
- 長時間音声配信
- 高度な音声編集
- 複雑な推薦アルゴリズム
- 完全自律型AI Agent
- 本番DBの早期固定
- 高度なリアルタイム機能
- 細かなデザインの作り込み

## 完成判定

以下の一連の体験がブラウザで成立すること。

```text
匿名で開く
   ↓
声を聴く
   ↓
長押しして声を録音
   ↓
投稿
   ↓
Mastraがタグ / room候補を生成
   ↓
声がバブルとして表示される
   ↓
他の人が聴く
   ↓
やってみる
   ↓
proofを投稿
```

さらに、HonoのテストとE2EがCIで通ることを完成条件とする。
