import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./locales";

/** next-intl routing config built from the supported locales; locale prefix is omitted for the default. */
export const routing = defineRouting({ locales, defaultLocale, localePrefix: "as-needed" });
