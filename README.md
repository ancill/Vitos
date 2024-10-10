# VITOS Project Template

VITOS: **V**ite, **I**nnovative **T**anStack, **O**RM-powered, **S**hadcn-enhanced

This is a monorepo template using pnpm workspaces, featuring a powerful combination of modern technologies:

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

## Getting Started

1. Install dependencies:

   ```
   pnpm install
   ```

2. Set up your Cloudflare Worker and D1 database.

3. Update the database credentials in `api/src/index.ts` and `api/drizzle.config.ts`.

4. Run the development servers:

   ```
   pnpm dev
   ```

5. Build the project:

   ```
   pnpm build
   ```

6. Deploy to Cloudflare Workers:
   ```
   pnpm deploy
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
