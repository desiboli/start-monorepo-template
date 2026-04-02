import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { createDb } from "@workspace/db"

import type { Bindings } from "../types"

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
