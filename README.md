# nomu

日記アプリケーション

## 技術スタック

### 言語
**TypeScript**

### フロントエンド
- **TypeScript**
- **React**
- **Vite**
- **TanStack Router**
- **React Hook Form** - フォーム管理
- **Tailwind CSS** - スタイリング
- **Zod** - バリデーション
- **Axios** - HTTPクライアント
- **Lucide React** - アイコン
- **ホスティング：** Cloudflare Pages（予定）

### バックエンド
- **TypeScript**
- **Node.js**
- **Hono** - Webフレームワーク
- **Prisma** - ORM
- **Zod** - バリデーション
- **実行環境：** Fly.io（予定）

### データベース
- **初期：** SQLite
- **移行先：** PostgreSQL（予定）
- **ORM：** Prisma

### 共通基盤
- **パッケージマネージャー：** pnpm
- **モノレポ管理：** pnpm workspaces

### インフラ
- **コンテナ：** Docker
- **ローカル構成管理：** Docker Compose
- **本番実行基盤：**
  - Frontend：Cloudflare Pages（予定）
  - Backend：Fly.io（予定）

### CI/CD
- **GitHub Actions**
  - lint
  - typecheck
  - build
  - （必要に応じて）Fly.io / Cloudflare Pages へのデプロイ

### 環境構築
- **Dockerfile**（backend, web）
- **docker-compose.yml**（ローカル開発環境）
- **.env**（環境変数管理）

## セットアップ

このプロジェクトは pnpm workspaces を使用したモノレポです。

### 初期セットアップ

#### ローカル開発環境

```bash
# ルートディレクトリで依存関係をインストール
pnpm install

# Prismaのマイグレーション
pnpm prisma:migrate

# (オプション) サンプルデータをシード
pnpm prisma:seed
```

#### Docker環境

```bash
# Docker Composeで起動
docker-compose up -d

# ログ確認
docker-compose logs -f
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

### 環境変数

環境変数は `.env` ファイルで管理します。`.env.example` を参考に設定してください。

- **Backend:** `DATABASE_URL`, `PORT`, `NODE_ENV`
- **Web:** `VITE_API_URL`（本番ビルド時）

### CI/CD

GitHub Actionsで以下のジョブが実行されます：

- **lint:** コードのリントチェック
- **typecheck:** TypeScriptの型チェック
- **build:** ビルドの確認

