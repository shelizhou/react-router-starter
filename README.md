# React Router v7 Starter

A modern starter template built with React Router v7, Vite, TypeScript, and Cloudflare D1 database.

## Getting Started

```bash
npm install
npm run dev
```

## Cloudflare Setup

### 1. Create D1 Database

```bash
npx wrangler d1 create app-db
```

Copy the database ID from the output and paste it into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "app-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

### 2. Run Database Migration

Local:
```bash
wrangler d1 execute app-db --local --file migrations/001_create_items.sql
```

Production:
```bash
wrangler d1 execute app-db --remote --file migrations/001_create_items.sql
```

### 3. Local Development (with API)

To test Pages Functions locally with D1:

```bash
npx wrangler pages dev dist --local
```

### 4. Deploy

```bash
npm run deploy
```

## Project Structure

```
react-router-starter/
├── functions/              # Cloudflare Pages Functions (server API)
│   └── api/
│       └── items.ts        # Key-value CRUD API
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
- **Cloudflare Pages** - Hosting and serverless functions
- **Cloudflare D1** - SQLite database at the edge

## Available Scripts

| Command        | Description                 |
|----------------|-----------------------------|
| `npm run dev`  | Start development server    |
| `npm run build`| Build for production        |
| `npm run deploy` | Build and deploy to Cloudflare |
