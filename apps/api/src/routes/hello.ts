import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi"
import type { Env } from "../types"

const QuerySchema = z.object({
  name: z
    .string()
    .optional()
    .openapi({
      param: {
        name: "name",
        in: "query",
      },
      example: "World",
    }),
})

const ResponseSchema = z.object({
  message: z.string().openapi({
    example: "Hello, World!",
  }),
})

const getHelloRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Hello"],
  summary: "Return a simple greeting",
  request: {
    query: QuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Greeting returned successfully",
    },
  },
})

const route = new OpenAPIHono<Env>().openapi(getHelloRoute, (c) => {
  const { name } = c.req.valid("query")

  return c.json(
    {
      message: `Hello, ${name ?? "World"}!`,
    },
    200
  )
})

export default route
