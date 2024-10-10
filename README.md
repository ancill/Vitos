# My Project Template

This is a monorepo template using pnpm workspaces, containing:

- API (Backend):

  - Hono
  - Drizzle ORM
  - Cloudflare Workers
  - SQLite (Cloudflare D1)

- Web (Frontend):
  - Vite
  - React
  - shadcn/ui

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
