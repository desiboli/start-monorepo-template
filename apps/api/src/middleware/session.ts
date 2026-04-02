import { createMiddleware } from "hono/factory"

import { getAuth } from "../lib/auth"
import type { Env } from "../types"

export const sessionMiddleware = createMiddleware<Env>(async (c, next) => {
  if (c.req.path.startsWith("/api/auth")) {
    c.set("user", null)
    c.set("session", null)
    return next()
  }

  const auth = getAuth(c.env)
  const result = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!result) {
    c.set("user", null)
    c.set("session", null)
    return next()
  }

  c.set("user", result.user)
  c.set("session", result.session)
  await next()
})
