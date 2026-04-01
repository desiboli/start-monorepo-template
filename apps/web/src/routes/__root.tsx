import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"

import appCss from "@workspace/ui/globals.css?url"
import { getThemeServerFn } from "@/lib/theme"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  beforeLoad: async () => ({ theme: await getThemeServerFn() }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { theme } = Route.useRouteContext()

  return (
    <html className={theme} lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
