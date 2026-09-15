# Static MVP

## 方針

- TypeScript + Vite
- HTMXを読み込み、UIイベントの補助に使用
- Backendなし
- Hono / Worker / Wranglerなし
- GitHub Pagesへ静的配信
- 投稿データはブラウザの `localStorage` に保存

## MVP

1. テキストで声を置く
2. 同じブラウザ内の掲示板に表示
3. 返事ボタンでローカル返信を表示
4. リロードしても投稿を保持

## 制約

Backendがないため、投稿は端末・ブラウザ単位です。共有掲示板にはなりません。

共有、音声録音、STT、AI返信、認証、D1/R2は次段階です。

## Deploy

`.github/workflows/pages.yml` が `main` へのpushでVite buildを実行し、GitHub Pagesへデプロイします。
