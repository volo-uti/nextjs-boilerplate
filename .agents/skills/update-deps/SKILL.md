---
name: update-deps
description: Monthly dependency routine - report what is outdated, update per catalog entry, verify with the gate, and report updated, blocked and REVISIT packages.
---

# Update dependencies

1. Run `pnpm update-check`. It lists outdated dependencies (catalog-aware), the latest Node LTS and pnpm against `.nvmrc` and `packageManager`, and marks `REVISIT` for any direct dependency whose latest release is over 12 months old.
2. Update with `pnpm update -r --latest`. Versions live in `pnpm-workspace.yaml` `catalog:`; check the diff there. Do not write versions into workspace `package.json` files. Exact pins (for example TypeScript, `@hey-api/openapi-ts`) stay exact.
3. If Node or pnpm moved, edit `.nvmrc` or `packageManager` in the root `package.json`.
4. Run `pnpm install` then `pnpm check`. If a package breaks the gate, revert only that catalog entry and record it as blocked with the error.
5. Run `pnpm exec playwright install chromium && pnpm e2e` when Next, React or Tailwind changed.
6. Report three lists: **updated** (name, old to new), **blocked** (name, why), **REVISIT** (name, last release date, suggested action: keep, replace or drop).
