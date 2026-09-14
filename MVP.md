# MVP

## 声の掲示板 / Voice Space

「やってみたい」「やってみた」「今日あったこと」を、文字や画面操作ではなく**声**で残し、声で聴き、声で呼び出す最小プロダクト。

このプロダクトは、日記帳・交換日記・グループ日記・掲示板のどれにもなれる。
参加者数は **1人から無限**。形式を先に固定せず、声を誰と共有するかで関係が変わる。

```text
1人       → 声の日記
2人       → 声の交換日記
少人数    → グループ日記
多数/無限 → 声の掲示板
```

## 中心原則

**すべて声で操作する。GUIはない。**

画面は操作対象ではなく、音声を扱うための実行環境にすぎない。

- ボタンを押して操作しない
- メニューを選択しない
- フォームに入力しない
- タグを手で付けない
- 声で命令する
- 声で結果を受け取る

MVPの基本ループ:

```text
🎙️ 声を入力
   ↓
音声認識 / Intent解析
   ↓
TypeScript Command
   ↓
Domain
   ↓
結果
   ↓
🔊 音声で返す
```

## 目的

匿名で気軽に声を残し、後から大量の声の中から必要な声を**会話で再発見できる場**を作る。

重要なのは単なる音声保存ではない。

**声を残す → 声を聴く → 意味を掴む → 必要な声を呼び出す → 返事する / やってみる**

を成立させる。

## 技術方針

- TypeScriptを中心に実装
- HonoをAPI / Application境界として利用
- ブラウザの音声入力・録音・再生をTypeScriptから扱う
- STT / Intent解析 / TTSはPortを介して疎結合にする
- MastraはAI / Agent層として利用可能にする
- FEからMastraへ直接依存しない
- AIはDomainを直接変更しない
- 既存のRails / Elixir実装は移植しない

```text
Browser
  │
  ├── 🎙️ Audio Input
  ├── STT
  └── 🔊 Audio Output
          │
          ▼
     TypeScript Runtime
          │
          ▼
     Intent / Command
          │
          ▼
        Hono
          │
          ▼
      Application
          │
          ▼
        Domain
     ┌────┼────┐
   Voice Space Wish Proof
          │
          ▼
   Intelligence Adapter
          │
        Mastra
```

## MVPユーザー体験

### 1. 開く

ログインなしで声空間を開く。

画面を操作する必要はない。

### 2. 声を残す

ユーザーが話す。

例:

> 今日、浅草に行ってきた。

音声を保存し、STTによる文字起こしを検索用インデックスとして保持する。

### 3. 声を呼び出す

大量の声を画面から探さない。

例:

> 昨日の声を聞かせて

> 海の話、どれだっけ？

> 先週の浅草の話を聞きたい

> この人との交換日記、続きから

```text
音声命令
   ↓
Intent
   ↓
検索条件
   ↓
Voice Repository
   ↓
対象Voice
   ↓
音声再生
```

### 4. 曖昧な検索

自然な会話だけでは対象を一意に決められない場合、アプリが声で確認する。

```text
ユーザー
「昨日のやつ聞かせて」

アプリ
「日記と交換日記、どちらですか？」

ユーザー
「交換日記」
```

### 5. 返事する

現在聴いている声に対して、声で返事する。

> これに返事したい

```text
現在のVoice
   ↓
Reply Command
   ↓
音声録音
   ↓
Reply Voice
```

### 6. wish

声に「やってみたいこと」を含める。

例:

> 海辺で朝ごはん食べたい

AIは内容を解析し、検索・整理用の構造化情報を作る。

```json
{
  "intent": "wish",
  "tags": ["海", "朝食", "旅行"],
  "room": "travel"
}
```

AIが勝手に公開投稿を確定することはMVPでは行わない。

### 7. proof

誰かのwishを実際にやってみたら、声でproofを返す。

> やってみた。浅草で朝ごはん食べてきたよ。

```text
Wish
  │
  └── Proof Voice
```

## Voice Space

日記・交換日記・掲示板を別のプロダクトとして実装しない。

**Spaceに参加する人数と関係性によって見え方が変わる。**

```text
Space
 ├── Participant 1人
 │     └── Diary
 ├── Participant 2人
 │     └── Exchange Diary
 ├── Participant 3..n人
 │     └── Group
 └── Participant n人
       └── Public Board
```

参加人数そのものをモードとして固定せず、`Space` と `Participant` の関係として表現する。

## MVPデータ

### Device

匿名利用のため、ログインユーザーではなく `device_id` を基本識別子とする。

### Voice

- id
- device_id
- space_id
- audio_asset_id
- transcript
- created_at
- parent_voice_id?
- wish_id?
- intent
- tags

### Space

- id
- visibility
- created_at

### Participant

- id
- space_id
- device_id
- joined_at

### Wish

- id
- voice_id
- device_id
- space_id
- intent
- tags
- created_at

### Proof

- id
- wish_id
- voice_id
- device_id
- created_at

## Voice検索

MVPでは「大量の声を聞き直す問題」を最重要課題のひとつとして扱う。

検索はGUIの一覧操作ではなく、音声命令から行う。

検索可能な軸:

- 時間
- Space
- 相手 / Participant
- transcript
- topic / tags
- intent
- Wish / Proof
- 前後関係

将来的にはembeddingによる意味検索へ拡張するが、MVPでは文字起こし + 構造化メタデータを基本とする。

## MVP音声コマンド

最低限、以下を成立させる。

```text
「声を残す」
「昨日の声を聞かせて」
「海の話を聞かせて」
「この声に返事したい」
「やってみたいことを残す」
「これ、やってみた」
「この人との交換日記を続けたい」
```

自然言語の揺れはIntent解析で吸収する。

## MVP API

```text
GET  /healthz
POST /api/voices
GET  /api/voices/:id
POST /api/voices/search
POST /api/wishes
POST /api/wishes/:id/proofs
POST /api/spaces
POST /api/spaces/:id/participants
POST /api/ai/classify
```

APIの具体的な入出力は実装時に確定する。

## Mastra MVP

Mastraは「何でも自律的に行うAgent」にはしない。

MVPでは、音声からDomainで扱える構造化情報を作る補助層とする。

```text
Voice / Transcript
       ↓
     Mastra
       ↓
intent / tags / topic / target candidate
       ↓
TypeScript Command
       ↓
Domain
```

AIは検索対象の選択候補を作れるが、Domain操作を勝手に確定・実行しない。

## GUIを作らない

従来想定していた以下のUIはMVP要件から外す。

- voice bubbles
- 録音ボタン
- 投稿フォーム
- room切替UI
- tags一覧UI
- `/post` の画面操作

画面上に情報を表示すること自体を禁止するわけではないが、**操作はすべて音声で完結すること**をMVPの完成条件とする。

## 今回やらないこと

- ユーザー登録 / ログイン
- フォロー / DM
- 長時間音声配信
- 高度な音声編集
- 複雑な推薦アルゴリズム
- 完全自律型AI Agent
- 本番DBの早期固定
- 高度なリアルタイム機能
- GUI中心のUX
- embedding検索の必須化

## 完成判定

以下の一連の体験が、画面を操作せずブラウザ上の音声だけで成立すること。

```text
匿名で開く
   ↓
声を残す
   ↓
AIが意味を解析
   ↓
「昨日の声を聞かせて」
   ↓
該当する声を検索
   ↓
声を聴く
   ↓
「これに返事したい」
   ↓
返事を録音
   ↓
「やってみた」
   ↓
WishにProof Voiceを返す
```

さらに、HonoのテストとE2EがCIで通ることを完成条件とする。
