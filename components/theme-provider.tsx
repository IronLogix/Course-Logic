"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import type { FC, ReactNode } from "react"

/*
|--------------------------------------------------------------------------
| ThemeProvider
|--------------------------------------------------------------------------
| A very thin wrapper around `next-themes` that
|   • switches to the `data-theme` attribute
|   • ships our 8 palettes
|   • sets “dark-contrast” (Dark Contrast – Default) as the default
|
| We deliberately export BOTH a named and a default value so callers can
| choose either import style without breaking the module graph.
*/
const ThemeProvider: FC<ThemeProviderProps & { children: ReactNode }> = ({ children, ...props }) => (
  <NextThemesProvider attribute="data-theme" defaultTheme="dark-contrast" enableSystem={false} {...props}>
    {children}
  </NextThemesProvider>
)

export { ThemeProvider }
export default ThemeProvider
