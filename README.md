# 勉強用に作ったLINE bot(AIとのおしゃべり+チャットからのCRUD操作)

## 友達リンク https://lin.ee/Fs7G56M

## データベースがシンガポールにあるせいか無料プランだからかレスポンスが重たすぎて、ちょくちょくキューが溜まったりトークンが切れることが今後の課題

### /liffのエンドポイントで、リッチメニューのリンクと同じ場所(メモ管理フォーム)に飛びます

### /api/mainをwebhookURLに登録しています

### /api/remindにGitHubActionsで定期的にリクエストを送信しています(.github/workflows/main.yml)

### (デプロイ時のActionだけしか上手くいかない　<- これも今後の課題)

## ---

#### 開発環境と使用言語

- MacOS
- Next.js(TypeScript)

#### デプロイ先とデータベース

- Vercel
- VercelPostgres

##### テーブル

- userinfo
  <img width="280" alt="スクリーンショット 2024-08-22 14 38 50" src="https://github.com/user-attachments/assets/22967460-2cac-461a-b2e4-188b40d570e0">

- memoInfo
  <img width="373" alt="スクリーンショット 2024-08-22 14 46 08" src="https://github.com/user-attachments/assets/1c8ec918-e190-49dc-873e-41c72a28e933">
