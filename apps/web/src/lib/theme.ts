import { createServerFn } from "@tanstack/react-start"
import { getCookie, setCookie } from "@tanstack/react-start/server"
import * as z from "zod"

const storageKey = "app-theme"

export const getThemeServerFn = createServerFn().handler(
  () => getCookie(storageKey) ?? "auto"
)

const setThemeValidator = z.enum(["auto", "light", "dark"])

export const setThemeServerFn = createServerFn()
  .inputValidator(setThemeValidator)
  .handler(({ data }) => setCookie(storageKey, data))
