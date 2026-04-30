# React Router v7 Starter

A modern starter template built with React Router v7, Vite, TypeScript, and Cloudflare D1 database.

## Quick Start

```bash
npm install
npm run dev          # Vite dev server
npx wrangler dev     # Worker API (另开终端)
```

## D1 Database Setup

### 1. Create Database

```bash
npx wrangler d1 create app-db
```

把输出的 `database_id` 填入 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "app-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

### 2. Initialize Local Database（本地开发）

```bash
npx wrangler d1 execute app-db --local --file migrations/001_create_items.sql
```

这会创建 `items` 表，用于 key-value 存储。

### 3. Initialize Remote Database（生产环境）

```bash
npx wrangler d1 execute app-db --remote --file migrations/001_create_items.sql
```

### 4. View Database

```bash
# 本地
npx wrangler d1 execute app-db --local --command "SELECT * FROM items;"

# 远程
npx wrangler d1 execute app-db --remote --command "SELECT * FROM items;"
```

### 5. Add New Migrations

在 `migrations/` 目录下新建 SQL 文件，例如 `002_add_users.sql`，然后执行：

```bash
npx wrangler d1 execute app-db --remote --file migrations/002_add_users.sql
```

## Deploy

```bash
npm run deploy
```

会自动执行 `npm run build` 然后通过 `wrangler deploy` 部署到 Cloudflare Workers。

## Project Structure

```
react-router-starter/
├── server/                 # Worker entry point
│   └── index.ts            # API routes + SPA fallback
├── migrations/             # D1 database migrations
│   └── 001_create_items.sql
├── public/                 # Static assets
├── src/
│   ├── main.tsx            # Application entry point
│   ├── styles.css          # Global styles
│   ├── routes.tsx          # Route definitions
│   └── routes/
│       ├── layout.tsx      # Root layout with navigation
│       ├── home.tsx        # Home page
│       ├── about.tsx       # About page
│       ├── doc.tsx         # Embedded document viewer
│       └── store.tsx       # Data store (CRUD UI)
├── wrangler.toml           # Cloudflare configuration
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## API Endpoints

| Method | Path        | Description          |
|--------|-------------|----------------------|
| GET    | `/api/items`| List all items       |
| POST   | `/api/items`| Create/update item   |
| DELETE | `/api/items?id=xxx` | Delete item |

## Tech Stack

- **React Router v7** - Client-side routing with `createBrowserRouter`
- **Vite** - Fast dev server and optimized builds
- **TypeScript** - Full type safety
- **Cloudflare Workers** - Serverless hosting with D1 database
- **Cloudflare D1** - SQLite database at the edge

## Available Scripts

| Command        | Description                 |
|----------------|-----------------------------|
| `npm run dev`  | Start Vite development server |
| `npm run build`| Build for production        |
| `npm run deploy` | Build and deploy to Cloudflare |
