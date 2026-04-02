import { OpenAPIHono } from "@hono/zod-openapi"
import { Scalar } from "@scalar/hono-api-reference"
import { cors } from "hono/cors"

import { onError, onNotFound } from "./middleware/error-handler"
// import { sessionMiddleware } from "./middleware/session"
import routes from "./routes"
import type { Env } from "./types"

export function createApp() {
  const app = new OpenAPIHono<Env>()

  app.use(
    "/*",
    cors({
      origin: ["http://localhost:3000"],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
      credentials: true,
    })
  )

  // Enable when Better Auth session lookups are configured
  // app.use("/*", sessionMiddleware)

  app.route("/api", routes)

  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Floos API",
    },
  })

  app.get("/scalar", Scalar({ url: "/doc", theme: "purple" }))

  app.onError(onError)
  app.notFound(onNotFound)

  return app
}
