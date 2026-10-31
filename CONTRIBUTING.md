# Contributing

Thanks for helping to improve this template. This page covers how to set up, what to run before you open a pull request, and how changes are reviewed. By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Set up

1. Fork and clone the repository.
2. Run `nvm install` (or any tool that reads `.nvmrc`). The Node version lives in `.nvmrc`; pnpm is pinned by the `packageManager` field in `package.json` and switches automatically. This needs a global pnpm 12 or newer.
3. Run `pnpm install`.
4. Run `pnpm dev` and open <http://localhost:3000>. The app runs with no environment variables.

Playwright end-to-end tests need a browser once: `pnpm exec playwright install chromium`, then `pnpm e2e`.

## The gate

```bash
pnpm check
```

`pnpm check` is the only gate. It runs the format check, lint (including layer boundaries), typecheck, locale parity, the shared-code index freshness check, unit tests and a build of every app. The `pre-push` hook runs it (on `main` and `develop`, `pnpm verify` runs it in a clean Docker container instead), so a branch that passes locally is clean. Remote CI does not run tests; it only builds and deploys. Run `pnpm fmt` to fix formatting and `pnpm index` to regenerate the index in `AGENTS.md`.

## Project structure

```
apps/web/          Next.js app: src/app (routes), src/features, src/shared, messages, e2e
packages/ui/       Design system and theme
packages/shared/   Result, errors, http client, env, i18n config
packages/config/   tsconfig, eslint, prettier, vitest presets
scripts/           init, add-app, update-check, check-locales, agent-index
```

Inside a feature the dependency direction is `presentation -> application -> domain <- data`, and features never import each other. Lint enforces this; if it fails, move the code instead of disabling the rule.

## Conventions

- Versions live in one place: the `catalog:` in `pnpm-workspace.yaml`, plus `.nvmrc` and `packageManager`. Do not write a version in a workspace `package.json` or repeat one in documentation.
- Every user-visible string goes through next-intl, and `messages/en.json` and `messages/ko.json` keep identical keys.
- Expected failures are returned as a `Result`; throw only for programmer errors.
- File names are kebab-case and carry no role suffix: `domain/user.ts`.
- Docs, code, comments and commits are in English.
- Keep the skeleton minimal. Anything a new project would have to delete does not belong here.

[AGENTS.md](AGENTS.md) describes the rules agents and humans follow, and [PRINCIPLES.md](PRINCIPLES.md) explains why they exist.

## Pull requests

1. Fork the repository and create a branch from the default branch.
2. Make one focused change. Add or update tests, and update docs when behavior changes.
3. Run `pnpm check` and make sure it passes.
4. Write commits as [Conventional Commits](https://www.conventionalcommits.org/) in English, for example `fix(ui): keep focus ring on the theme toggle`.
5. Open the pull request and fill in the template. Describe what changed and why.

## Reporting bugs and security issues

Open a bug report or feature request through the issue forms. For a vulnerability, do not open a public issue; follow [SECURITY.md](SECURITY.md) instead.
