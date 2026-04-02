import { OpenAPIHono } from "@hono/zod-openapi"

import { getAuth } from "../lib/auth"
import type { Env } from "../types"

const authRoute = new OpenAPIHono<Env>()

authRoute.on(["GET", "POST"], "/api/auth/**", (c) => {
  return getAuth(c.env).handler(c.req.raw)
})

// For session introspection/debugging only
authRoute.get("/session", (c) => {
  const session = c.get("session")
  const user = c.get("user")

  if (!user) {
    return c.body(null, 401)
  }

  return c.json({
    session,
    user,
  })
})

export default authRoute
