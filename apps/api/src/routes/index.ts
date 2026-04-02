import { OpenAPIHono } from "@hono/zod-openapi"
import type { Env } from "../types"

import helloRoute from "./hello"
import authRoute from "./auth"

const routes = new OpenAPIHono<Env>()
  .route("/", authRoute)
  .route("/hello", helloRoute)

export default routes
export type ApiRoutes = typeof routes
