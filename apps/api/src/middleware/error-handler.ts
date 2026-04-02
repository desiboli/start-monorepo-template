import type { ErrorHandler, NotFoundHandler } from "hono"
import type { Env } from "../types"

export const onError: ErrorHandler<Env> = (err, c) => {
  console.error(err)
  return c.json({ error: "Internal Server Error" }, 500)
}

export const onNotFound: NotFoundHandler<Env> = (c) => {
  return c.json({ error: "Not Found" }, 404)
}
