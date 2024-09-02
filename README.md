## このLINE BOTはチャットでメモ操作&AIとのお喋り&メモのリマインドが出来ます。リンク(https://lin.ee/Fs7G56M)から、もしくは「@835eadwi」で検索してお試しください!(ちなみにLIFFではGUIでのメモ操作、入力中の文字数の表示、Markdown形式の入力などができます。こちらはブラウザのローカルストレージを用いています)

### デプロイしたURLはこちら
#### https://aichida-training.vercel.app/liff
#### /liffのエンドポイントで、リッチメニューのリンクと同じ場所(メモ管理フォーム)に飛びます！
#### /api/mainをwebhookURLに登録しています
#### /api/remindにGitHubActionsで定期的にリクエストを送信しています(.github/workflows/main.yml)

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

# -----

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.