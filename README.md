# React Router v7 Starter

A modern starter template built with React Router v7, Vite, and TypeScript.

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
react-router-starter/
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── src/
    ├── main.tsx            # Application entry point
    ├── styles.css          # Global styles
    ├── routes.ts           # Route definitions
    └── routes/
        ├── layout.tsx      # Root layout with navigation
        ├── home.tsx        # Home page
        └── about.tsx       # About page
```

## Tech Stack

- **React Router v7** - Client-side routing with `createBrowserRouter`
- **Vite** - Fast dev server and optimized builds
- **TypeScript** - Full type safety
- **React 19** - Latest React with modern features

## Features

- Nested layouts via `<Outlet />`
- File-based route organization
- Component-driven route definitions
- Responsive dark theme design
- TypeScript strict mode enabled

## Available Scripts

| Command        | Description            |
|----------------|------------------------|
| `npm run dev`  | Start development server |
| `npm run build`| Build for production   |
| `npm run preview` | Preview production build |
