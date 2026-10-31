# Principles

The decisions behind this template, with the reason for each and the tool that keeps it true. Rules that no tool checks are kept few on purpose.

## Latest stable only

Dependencies and tools track the latest stable release; no canary, beta or release candidates. Old pins hide upgrade cost until it is large, so the cost is paid monthly in small pieces. A dependency with no stable release for 12 months is a reason to revisit the choice, not to freeze it.

Enforced by: `pnpm update-check` (outdated packages, Node LTS, pnpm) and `minimumReleaseAge` in `pnpm-workspace.yaml`.

## One place for versions

Version numbers live in manifests only: the `catalog:` in `pnpm-workspace.yaml`, `.nvmrc` and the `packageManager` field. Documentation never repeats a number, so nothing can drift.

Enforced by: the `catalog:` protocol in workspace packages; the Dockerfile and the deploy workflow read `.nvmrc` and `packageManager` instead of hard-coding versions.

## Clean architecture, feature first

Code is grouped by feature, and inside a feature dependencies point inward: `presentation -> application -> domain <- data`. The domain imports no framework, so business rules survive a framework change and can be tested without one. A feature never imports another feature; routes in `app/` wire them together.

Enforced by: `eslint-plugin-boundaries` in `pnpm lint`.

## Ports and swappable adapters

Each port has a real `http-*` adapter and an in-memory `mock-*` adapter, and configuration picks one. The app therefore runs, and is tested, without a backend.

Enforced by: convention in the `add-feature` skill; the default adapter is the mock, so a fresh clone runs offline.

## Failures are values

Expected failures are returned as a `Result` instead of thrown. Callers must handle them at the type level, and exceptions are left for programmer errors.

Enforced by: the typed `Result` and the `fetch` wrapper that never throws, covered by unit tests.

## Stands on its own

A fresh clone runs without environment variables, code generation or sibling repositories. Every environment value has a default and is read through one validated module. `scripts/init` turns the clone into a project: it renames it, replaces the README and starts a fresh git history.

Enforced by: the zod-validated env module and `pnpm verify` running `pnpm check` from a clean checkout in a Docker container.

## Rules are enforced by tools

Layer direction, isolation between features and apps, and locale key parity are checked by lint and scripts, not described in prose. A rule that cannot be checked must say what breaks when it is ignored; if that cannot be written down, the rule is not kept.

Enforced by: `pnpm lint` and `pnpm check:locales`.

## One gate

`pnpm check` runs format, lint, typecheck, locale parity, index freshness, unit tests and build. People and agents run the same command, locally or in a clean container, so "done" means the gate passed and its output is the evidence.

Enforced by: the `pre-push` hook (lefthook), which runs `pnpm check`, or `pnpm verify` (the same check in a clean Docker container) on `main` and `develop`. Remote CI runs no tests.

## Discoverable by default

Existing components, helpers and use cases are listed in a generated index in `AGENTS.md`, built from the first sentence of each export's doc comment. Reuse beats rewriting only when the existing code can be found. Raw elements that have a replacement component are blocked, and the lint message names the component to use.

Enforced by: `pnpm check:index` (fails when the index is stale or a doc comment is missing) and ESLint `no-restricted-syntax` / `no-restricted-imports`.

## Agent neutral

`AGENTS.md` and `.agents/skills/` are the source of truth for coding agents. Tool-specific files exist only where a tool cannot read that source: a skills link and a one-line `CLAUDE.md` that imports `AGENTS.md`. Instructions are written once.

Enforced by: review; nothing else in the repository carries instructions.

## Only the final state

Documents and code describe how things are now. There are no change logs, migration notes or "formerly" sections; history belongs to `git log`.

Enforced by: review.

## Minimal skeleton

A new project should not have to delete anything. Capabilities that many projects need later (auth, forms, API mocking, a generated API client, monitoring) are not preinstalled; the `add-feature` skill adds them with a default choice when they are first needed.

Enforced by: review.

## Accessible by default

The end-to-end test scans the page with axe in both themes, and `eslint-config-next` brings the `jsx-a11y` rules. Accessibility is part of the skeleton, not a later pass.

Enforced by: `pnpm e2e` (Playwright with axe) and `pnpm lint`.

## Choices

Why the stack looks the way it does. Order of preference: official or first-party, then a stable release within six months, then compatible with the latest Next.js, then ecosystem adoption.

| Concern            | Choice                                                            | Reason                                                                                                          |
| ------------------ | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Runtime            | Node from `.nvmrc`, pnpm from `packageManager`                    | nvm and CI read the same files; pnpm switches itself, so corepack is not needed                                 |
| Repository shape   | pnpm workspace with catalog, no Turborepo                         | built in; apps grow into several (customer, admin) without a second tool; internal `@repo/*` names never change |
| Language           | TypeScript strict                                                 | the next major is adopted once typescript-eslint supports it                                                    |
| Routing            | App Router, `app/` holds routes only                              | the framework default; keeps routes as the composition root                                                     |
| i18n               | `next-intl` with `[locale]` routing                               | the best documented option for the App Router and supports `proxy.ts`                                           |
| Server state       | TanStack Query                                                    | the de facto standard                                                                                           |
| Client state       | Zustand                                                           | small, no boilerplate                                                                                           |
| Validation         | zod                                                               | used by the Next.js documentation itself                                                                        |
| HTTP               | thin `fetch` wrapper returning `Result`                           | keeps Next.js cache options available                                                                           |
| Styling and tokens | Tailwind CSS `@theme` in one theme file; hand-rolled theme toggle | one source for tokens; the usual theme library is unmaintained                                                  |
| UI components      | shadcn/ui on Base UI in `packages/ui` atoms                       | Base UI is shadcn's new default                                                                                 |
| Layer checks       | `eslint-plugin-boundaries`                                        | the only tool that expresses layers, features and apps together                                                 |
| Lint and format    | ESLint, typescript-eslint, `eslint-config-next`, Prettier         | the boundary rules exist only for ESLint                                                                        |
| Unit tests         | Vitest, Testing Library, jsdom                                    | the combination in the Next.js testing guide                                                                    |
| End-to-end         | Playwright with `@axe-core/playwright`                            | first-party and covers accessibility in the same run                                                            |
| Git hooks          | lefthook                                                          | one binary, and it runs from a subfolder of a larger repository                                                 |
| Deploy             | GitHub Actions build and deploy only, Docker for verification     | tests run locally in a clean container; versions are read from `.nvmrc` and `packageManager`                    |
| React Compiler     | on (`reactCompiler: true`)                                        | stable in current Next.js                                                                                       |
