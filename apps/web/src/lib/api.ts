import { hc } from "hono/client"
import type { ApiRoutes } from "@workspace/api"

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8787"

export const api = hc<ApiRoutes>(`${apiBaseUrl}/api`, {
  // credentials: "include" is required so Better Auth cookies are sent with protected API requests
  init: {
    credentials: "include",
  },
})
