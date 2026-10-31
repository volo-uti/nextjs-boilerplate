import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { ThemeProvider } from "@repo/ui/lib/theme";
import { QueryProvider } from "./query-provider";

/** Wraps the app in the intl, theme and query providers; used once by the root layout. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider>
      <ThemeProvider>
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
