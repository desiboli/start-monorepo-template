import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { rootRouteId, useRouteContext, useRouter } from "@tanstack/react-router"
import { setThemeServerFn } from "@/lib/theme"

export const DARK_MODE_FORWARD_TYPE = "dark-mode-forward"

export function ModeSwitcher({
  variant = "ghost",
  className,
}: {
  variant?: React.ComponentProps<typeof Button>["variant"]
  className?: React.ComponentProps<typeof Button>["className"]
}) {
  const { theme } = useRouteContext({ from: rootRouteId })
  const router = useRouter()

  const toggleTheme = () => {
    const themes = ["light", "dark", "auto"] as const
    const next = themes[(themes.indexOf(theme as (typeof themes)[number]) + 1) % themes.length]
    setThemeServerFn({ data: next }).then(() => {
      router.invalidate()
    })
  }

  return (
    <Button
      variant={variant}
      size="icon"
      className={cn("group/toggle extend-touch-target size-8", className)}
      onClick={toggleTheme}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4.5"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 3l0 18" />
        <path d="M12 9l4.65 -4.65" />
        <path d="M12 14.3l7.37 -7.37" />
        <path d="M12 19.6l8.85 -8.85" />
      </svg>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}