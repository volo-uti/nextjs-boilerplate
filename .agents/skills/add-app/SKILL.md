---
name: add-app
description: Add another Next.js app to the monorepo from the first app's skeleton. Use when a separate deployable (console, admin, docs) is needed.
---

# Add an app

1. Run `scripts/add-app <name>` (lowercase, digits, hyphens). It copies the first app in `apps/` without its features, names the package `@repo/<name>`, picks the next free port (3100, 3200, ...) and adds `dev:<name>` to the root `package.json`.
2. Run `pnpm install` so the workspace links the new package.
3. Run `pnpm check`. It passes with no other edit; boundaries rules are generic and need no change.
4. Start it with `pnpm dev:<name>`.
5. Build features inside the new app (`add-feature`). An app never imports another app; code needed by both goes through `share-feature`.
