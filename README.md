# VITOS Project Template

VITOS: **V**ite, **I**nnovative **T**anStack, **O**RM-powered, **S**hadcn-enhanced

This is a monorepo template using pnpm workspaces, featuring a powerful combination of modern technologies:

## Getting Started localy

1. Install dependencies:

   ```
   pnpm install
   ```

2. Run the migrations and (optionally) seed the database:

   ```sh
   cd api
   pnpm run db:touch
   pnpm run db:generate
   pnpm run db:migrate
   pnpm dev
   pnpm run db:seed
   ```

3. Stop api server and run the development servers from root:

   ```
   cd ..
   pnpm dev
   ```

## Devtools

1. [Fiberplane](https://fiberplane.com/) - postman based on hono rpc output types

2. [Drizzle studio](https://orm.drizzle.team/drizzle-studio/overview) - is way for you to explore SQL database on Drizzle projects.

Run both from root of the project.

```
pnpm studio
```

## Project Structure

- `api/`: Backend code (Hono, Drizzle ORM, Cloudflare Workers)
- `web/`: Frontend code (Vite, React, shadcn/ui)

## Why VITOS?

VITOS combines the power of HONC's backend philosophy with a modern frontend stack:

- **V**ite: Lightning-fast build tool
- **I**nnovative Tech stack: Combining cutting-edge technologies
- **T**ypescript ORM (Drizzle) & TanStack Router: Type-safe database operations and routing
- **O**ptimized for edge computing with Cloudflare Workers
- **S**hadcn/ui: Beautiful, customizable UI components

## Backend (API)

- [Hono](https://hono.dev/) - Lightweight, ultrafast web framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for SQL databases
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless execution environment
- [SQLite (Cloudflare D1)](https://developers.cloudflare.com/d1/) - Serverless SQL database

_Backend generated using the awesome [HONC project](https://honc.dev/)_

## Frontend (Web)

- [Vite](https://vitejs.dev/) - Next-generation frontend tooling
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
- [TanStack Router](https://tanstack.com/router/v1) - Type-safe routing for React applications
- Hono RPC client for type-safe API calls
