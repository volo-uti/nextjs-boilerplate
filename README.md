# Next.js Boilerplate

A pnpm monorepo template for Next.js apps. The architecture is enforced by lint, so it stays tidy as the project grows.

- Next.js App Router, React with the React Compiler, TypeScript strict
- next-intl with `[locale]` routing (English and Korean)
- Tailwind CSS 4 with one theme file, shadcn/ui on Base UI, a hand-rolled light/dark toggle
- TanStack Query, Zustand, zod, a `Result` type and a thin `fetch` wrapper
- ESLint with `eslint-plugin-boundaries` (layers and package rules), Prettier
- Vitest and Testing Library, Playwright with axe, lefthook, GitHub Actions
- Agent-ready: `AGENTS.md` and skills under `.agents/skills`

## Use it

```bash
git clone https://github.com/volo-uti/nextjs-boilerplate my-project
cd my-project
scripts/init --name my-project   # --app <app> renames apps/web; --nested if it will live in a subfolder of a larger repo
pnpm install
pnpm dev                         # http://localhost:3000
```

Run `nvm install` (or any tool that reads `.nvmrc`) before `pnpm install`. pnpm itself is pinned by the `packageManager` field and switches automatically — this needs a global pnpm 12 or newer, because pnpm 10 cannot switch to pnpm 12's native binary (it fails with `ENOEXEC`).

## Commands

| Command                     | What it does                                                        |
| --------------------------- | ------------------------------------------------------------------- |
| `pnpm dev` / `pnpm dev:web` | Run all apps / the web app (`dev:<app>` after `init --app <app>`)   |
| `pnpm check`                | The gate: format, lint, typecheck, locales, unit tests, build       |
| `pnpm verify`               | `pnpm check` in a clean Docker container (needs Docker)             |
| `pnpm e2e`                  | Playwright tests (run `pnpm exec playwright install chromium` once) |
| `pnpm update-check`         | Outdated dependencies, Node LTS, pnpm                               |
| `scripts/add-app <name>`    | Add another app                                                     |

## Platforms and deployment

Windows developers work inside WSL2 (the scripts are bash and Docker runs through it). Tests run locally: `pnpm verify` runs the gate in a clean container, and the `pre-push` hook uses it on `main` and `develop`. GitHub Actions only builds and deploys (`.github/workflows/build-deploy.yml`; pushes to `develop` deploy only when the commit message contains `[deploy]`). Deploy start and finish are posted to Slack when the `SLACK_BOT_TOKEN` secret and the `SLACK_CICD_CHANNEL` variable are set; without them the notification is skipped.

## Structure

```
apps/web/          Next.js app: src/app (routes), src/features, src/shared, messages, e2e
packages/ui/       Design system and theme
packages/shared/   Result, errors, http client, env, i18n config
packages/config/   tsconfig, eslint, prettier, vitest presets
scripts/           init, add-app, update-check, verify, check-locales
```

Inside a feature the dependency direction is `presentation -> application -> domain <- data`; features never import each other. See `AGENTS.md`.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first; everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Report vulnerabilities privately, as described in [SECURITY.md](SECURITY.md).

## Principles

The reasons behind the structure and the stack are in [PRINCIPLES.md](PRINCIPLES.md).

## License

MIT, see [LICENSE](LICENSE).
