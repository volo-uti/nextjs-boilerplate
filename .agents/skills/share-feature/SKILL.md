---
name: share-feature
description: Move a feature from one app into a shared package so several apps can use it. Use when a second app needs a feature that exists in only one app.
---

# Share a feature

A feature cannot be imported across apps, so it moves to `packages/<f>` with the same four layers.

1. `git mv apps/<app>/src/features/<f> packages/<f>/src` and keep the layer folders (`domain`, `application`, `data`, `presentation`).
2. Create `packages/<f>/package.json`: name `@repo/<f>`, `"private": true`, `"type": "module"`, `exports` pointing at the TypeScript source (for example `"./presentation/*": "./src/presentation/*.tsx"`), dependencies `"catalog:"` and `"workspace:*"`. Add `typecheck` and `test` scripts and a `tsconfig.json` extending `@repo/config/tsconfig/base`.
3. Packages may import only `@repo/shared` (and `@repo/ui` for `presentation`). If the feature used app-only code, pass it in through props or ports instead.
4. Add `@repo/<f>` to each consuming app's `package.json` (`"workspace:*"`) and to `transpilePackages` in its `next.config.ts`.
5. Replace the old imports in the apps with `@repo/<f>/...`.
6. Messages used by the feature stay in each app's `messages/` files; keep key sets equal.
7. Extend the layer rules in `packages/config/eslint/index.mjs` so `packages/*/src/{domain,application,data,presentation}` follow the same direction, then run `pnpm install && pnpm check`.
