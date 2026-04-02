# shadcn/ui monorepo template

This is a TanStack Start monorepo template with shadcn/ui.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```

# apps/api

### Initial Setup

```bash
pnpm create hono@latest api
```

```bash
? Which template do you want to use?
    aws-lambda
    bun
    cloudflare-pages
❯   cloudflare-workers
    deno
    fastly
    nextjs
    nodejs
    vercel
```

update `package.json` file

```json
"name": "@workspace/api",
```

add @workspace/db as a dependency:

```json
"@workspace/db": "workspace:*"
```

add the `.dev.vars` file with the following content:

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:8787
```

# package/db

### Initial Setup

```
pnpm init
```

edit `package.json` with the following content:

```json
{
  "name": "@workspace/db",
  "version": "0.0.1",
  "description": "",
  "type": "module",
  "private": true,
  "exports": {
    ".": "./src/index.ts",
    "./schema": "./src/schema/index.ts"
  },
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "@better-auth/drizzle-adapter": "^1.5.6",
    "@neondatabase/serverless": "^1.0.2",
    "dotenv": "^17.3.1",
    "drizzle-orm": "^0.45.2"
  },
  "devDependencies": {
    "@workspace/typescript-config": "workspace:*",
    "drizzle-kit": "^0.31.10",
    "drizzle-seed": "^0.3.1",
    "typescript": "^6.0.2"
  }
}
```

create the `src` folder

create the `src/index.ts` file

create the `src/schema` folder

create the `src/schema/index.ts` file

create the `packages/db/.env` file and add the following:

```
DATABASE_URL=postgresql://...
```

create the `src/tsconfig.json` file with the following:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "drizzle"]
}
```

create the `src/drizzle.config.ts` file with the following:

```ts
import "dotenv/config"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```
