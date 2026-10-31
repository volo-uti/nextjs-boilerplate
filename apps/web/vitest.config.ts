import { vitestConfig } from "@repo/config/vitest";

export default vitestConfig({
  test: { setupFiles: ["./vitest.setup.ts"], exclude: ["e2e/**", "node_modules/**"] },
});
