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
