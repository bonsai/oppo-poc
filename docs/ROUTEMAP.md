# Route Map

oppo-poc の **MVP → Issue → Document → Implementation** を一本の流れとして管理する。

## 1. Product Route

```text
SNS疲れ
  ↓
心理的バリアを下げる
  ↓
「今日一本吹き込む」
  ↓
「少数の声を受け取る」
  ↓
「どれかに答える / 流す」
  ↓
「また明日」
```

## 2. MVP Core Loop

```text
[1] 声を置く
    ↓
[2] 声を受け取る
    ↓
[3] 聴く
    ↓
[4] 返す / 流す
    ↓
[5] 次の日へ
```

MVPの判定基準は、機能数ではなくこのループが成立すること。

## 3. User Route

```text
Open
 ↓
Anonymous
 ↓
Record / input one voice
 ↓
Receive a small number of voices
 ↓
Listen
 ├─ Reply
 └─ Pass
 ↓
Done
 ↓
Return tomorrow
```

### MVPで優先する心理

- 投稿しなければならない、をなくす
- フォローされなければならない、をなくす
- 反応を稼がなければならない、をなくす
- 全部読まなければならない、をなくす
- 返事を強制しない

## 4. Product Boundary

### In MVP

- 匿名利用
- 声を1本置く
- 少数の声を受け取る
- 聴く
- 返す
- 流す
- Core Loopの成立を確認する

### Out of MVP

- フォロー
- DM
- 公開プロフィール
- 複雑な推薦
- 高度な検索
- Wish / Proof の本格実装
- 完全自律Agent
- 大規模コミュニティ機能
- GUI中心のSNS機能

## 5. Technical Route

現在のPoCは **GitHub Pagesで動くFE-only** を基準とする。

```text
Browser
  ↓
TypeScript + Vite
  ↓
HTMX / DOM
  ↓
localStorage
  ↓
GitHub Pages
```

BackendはMVPの思想を固めた後に必要性を判断する。

```text
FE-only PoC
    ↓
Core Loop検証
    ↓
不足する機能を特定
    ↓
Backend導入を判断
    ↓
Hono / DB / STT / AI
```

## 6. Document Route

```text
Issue
 ↓
ROUTEMAP.md
 ↓
MVP.md
 ↓
PRD.md
 ↓
DDD.md
 ↓
TODOS.md
 ↓
Implementation
```

### Document responsibilities

| Document | Responsibility |
|---|---|
| `ROUTEMAP.md` | 全体の進行経路・境界 |
| `MVP.md` | MVPとして何を成立させるか |
| `PRD.md` | なぜ作るか・誰の問題か |
| `DDD.md` | ドメイン概念・関係 |
| `TODOS.md` | 次に実行する作業 |
| `tsumete.md` | 未確定事項を1問ずつ詰める |

## 7. Decision Route

未確定事項は実装で勝手に決めない。

```text
Unknown
 ↓
tsumete
 ↓
Question
 ↓
Decision
 ↓
Document
 ↓
Issue
 ↓
Implementation
```

## 8. Issue Route

Issueは「機能一覧」ではなく、MVPを成立させるための判断・作業単位とする。

```text
Research / Idea
      ↓
Product Question
      ↓
MVP Decision
      ↓
Implementation Issue
      ↓
Verification
      ↓
Recap
      ↓
Document Update
```

## 9. Completion Route

```text
Core Loop implemented
        ↓
Browser verification
        ↓
Mobile / desktop basic check
        ↓
CI / build
        ↓
MVP.md update
        ↓
Issue close
        ↓
Recap
```

## 10. Guiding Rule

> **「今日一本吹き込み、少数の声を受け取り、どれかに答える」というCore Loopに必要か？**
>
> 必要でなければMVPには入れない。
