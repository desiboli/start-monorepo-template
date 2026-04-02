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

edit `package.json` file,
add an exports field so the web app can later import type { AppType } from "api"

```json
"exports": {
  ".": "./src/index.ts"
},
```

Make sure the following packages is installed:

- hono
- @hono/zod-openapi (new)
- @scalar/hono-api-reference (new)
- better-auth (new)
- @workspace/db

```bash
pnpm add zod @hono/zod-openapi @scalar/hono-api-reference better-auth
```

Update apps/api/wrangler.jsonc to enable Better Auth on Workers.

You need to enable the compatibility flag:

```jsonc
"compatibility_flags": ["nodejs_compat"]
```

Why this matters:

Better Auth uses AsyncLocalStorage
on Cloudflare Workers this requires nodejs_compat (or nodejs_als, but nodejs_compat is the safer default for now)

Create the `src/types.ts` file

```ts
import type { AuthSession, AuthUser } from "./lib/auth"

export type Bindings = {
  DATABASE_URL: string
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  ENABLE_BANKING_APP_ID: string
  ENABLE_BANKING_PRIVATE_KEY: string
}

export type Variables = {
  user: AuthUser | null
  session: AuthSession | null
}

export type Env = {
  Bindings: Bindings
  Variables: Variables
}
```

We don’t want to repeat env/context types across index.ts, middleware, and auth files
this becomes the single source of truth for the Hono app typing.

Create the `src/lib/auth.ts` file

```ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { createDb } from "@workspace/db"

import type { Bindings } from "@/types"

export function getAuth(env: Bindings) {
  const db = createDb(env.DATABASE_URL)

  return betterAuth({
    database: drizzleAdapter(db, { provider: "pg" }),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: ["http://localhost:3000"], // if frontend runs on another origin in dev, update trustedOrigins
    // If you add social providers/plugins, they get added here...
    emailAndPassword: {
      enabled: true,
    },
  })
}

export type AuthInstance = ReturnType<typeof getAuth>
export type AuthUser = AuthInstance["$Infer"]["Session"]["user"]
export type AuthSession = AuthInstance["$Infer"]["Session"]["session"]
```

@TODO

- src/middleware/session.ts
- src/middleware/error-handler.ts
- src/app.ts, src/index.ts

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

create the `src/schema/auth.ts` file and add the Better Auth Core schema

```ts
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
```

export the schema in `src/schema/index.ts`

```ts
export * from "./auth"
```

Fill in `packages/db/src/index.ts`

```ts
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import * as schema from "./schema"

export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl)
  return drizzle({ client: sql, schema })
}
```

then generate and migrate the first Drizzle migration from `packages/db`.
