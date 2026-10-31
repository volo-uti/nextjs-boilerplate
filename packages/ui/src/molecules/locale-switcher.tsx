"use client";

import { useLocale } from "next-intl";
import { locales, type Locale } from "@repo/shared/i18n/locales";
import { usePathname, useRouter } from "@repo/shared/i18n/navigation";
import { cn } from "../lib/cn";

/** Language select that swaps the current route's locale; takes an accessible `label`. */
export function LocaleSwitcher({ label, className }: { label: string; className?: string }) {
  const current = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <select
      aria-label={label}
      value={current}
      onChange={(event) => router.replace(pathname, { locale: event.target.value as Locale })}
      className={cn("h-9 px-2 text-sm rounded-md border bg-background", className)}
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {new Intl.DisplayNames(locale, { type: "language" }).of(locale)}
        </option>
      ))}
    </select>
  );
}
