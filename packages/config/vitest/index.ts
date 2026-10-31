import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vitest/config";

/**
 * Shared Vitest preset. Packages call `vitestConfig({ ... })` from their own `vitest.config.ts`.
 * Tests use jsdom and Testing Library; `setupFiles` is optional.
 */
export function vitestConfig(overrides: Parameters<typeof mergeConfig>[1] = {}) {
  return mergeConfig(
    defineConfig({
      plugins: [react()],
      test: {
        environment: "jsdom",
        include: ["src/**/*.test.{ts,tsx}"],
        passWithNoTests: true,
      },
    }),
    overrides,
  );
}
