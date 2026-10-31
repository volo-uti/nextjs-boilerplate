import { z } from "zod";

/**
 * Every value has a default: the app runs with no environment variables.
 * Next.js only inlines `NEXT_PUBLIC_*` values that are read as literal `process.env.NAME`.
 */
const schema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.url().default("http://localhost:4000"),
  /** `mock` serves in-memory adapters; `http` talks to NEXT_PUBLIC_API_URL. */
  NEXT_PUBLIC_ADAPTER: z.enum(["mock", "http"]).default("mock"),
});

/** Parsed environment values. */
export type Env = z.infer<typeof schema>;

/** Validates a raw env record against the schema and applies defaults. */
export function parseEnv(source: Record<string, string | undefined>): Env {
  return schema.parse({
    NEXT_PUBLIC_APP_URL: source.NEXT_PUBLIC_APP_URL || undefined,
    NEXT_PUBLIC_API_URL: source.NEXT_PUBLIC_API_URL || undefined,
    NEXT_PUBLIC_ADAPTER: source.NEXT_PUBLIC_ADAPTER || undefined,
  });
}

/** The app's environment, read from `process.env`; import this instead of reading `process.env`. */
export const env: Env = parseEnv({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_ADAPTER: process.env.NEXT_PUBLIC_ADAPTER,
});
