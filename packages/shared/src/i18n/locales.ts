/** Supported locale codes. */
export const locales = ["en", "ko"] as const;
/** Union of the supported locale codes. */
export type Locale = (typeof locales)[number];
/** Locale used when none is requested. */
export const defaultLocale: Locale = "en";

/** Type guard that narrows a string to a supported `Locale`. */
export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
