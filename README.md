# 声の掲示板

声で「やってみたい」を置き、誰かの行動につながり、その結果がまた声になる。

## Rebuild

このリポジトリは既存の習慣トラッカー実装を引き継がず、**Hono + TypeScript + Mastra** でゼロから再構築する。

```text
Browser
  ↓
FE
  ↓
Hono API
  ↓
Application
  ↓
Domain
  ├─ Wish
  ├─ Voice
  ├─ Proof
  ├─ Room
  └─ Tag

Application
  ↓
Mastra Adapter
  ↓
Insight
```

## 設計原則

- HonoをWeb/APIの入口にする
- TypeScriptで統一する
- FEはHono APIだけを境界として利用する
- MastraはAI層でありDomainそのものにしない
- AIの結果は候補・Insightとして扱う
- 認証はMVPでは持たない
- DB・音声ストレージは実装に合わせて後から確定する
- 小さく作り、E2Eで体験を固定する

## Core Loop

```text
listen → wish → voice → try → proof → listen
```

## MVP

- 匿名で掲示板を開く
- 声を聴く
- 長押しで短い声を録音する
- 声を投稿する
- wishを投稿する
- Mastraでタグ / room候補を生成する
- room / tagで探す
- wishにproofを返す

## FE

Hono JSX / HTMX / React を比較し、共通PoCの結果で決定する。

## Documents

- [PRD](PRD.md)
- [MVP](MVP.md)
- [DDD](DDD.md)
- [TODOS](TODOS.md)
