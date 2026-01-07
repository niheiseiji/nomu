# nomu

日記アプリケーション

## 技術スタック

### Backend
- **Express** - Webフレームワーク
- **Prisma** - ORM
- **SQLite** - データベース
- **TypeScript** - 型安全性
- **Zod** - バリデーション

### Web
- **React** - UIライブラリ
- **Vite** - ビルドツール
- **TanStack Router** - ルーティング
- **React Hook Form** - フォーム管理
- **Tailwind CSS** - スタイリング
- **TypeScript** - 型安全性
- **Zod** - バリデーション
- **Axios** - HTTPクライアント
- **Lucide React** - アイコン

## セットアップ

このプロジェクトは pnpm workspaces を使用したモノレポです。

### 初期セットアップ
```bash
# ルートディレクトリで依存関係をインストール
pnpm install

# Prismaのマイグレーション
pnpm prisma:migrate

# (オプション) サンプルデータをシード
pnpm prisma:seed
```

### 開発サーバーの起動

```bash
# Backend と Web を同時に起動
pnpm dev

# Backend のみ起動
pnpm dev:backend

# Web のみ起動
pnpm dev:web
```

### ビルド

```bash
# 全てのワークスペースをビルド
pnpm build

# Backend のみビルド
pnpm build:backend

# Web のみビルド
pnpm build:web
```

