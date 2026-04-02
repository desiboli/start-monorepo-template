import { createApp } from "./app"
export type { ApiRoutes } from "./routes"

const app = createApp()

export default app
export type AppType = typeof app
