---
name: add-feature
description: Add a feature (domain, application, data, presentation) to an app, or add an on-demand capability such as forms, API mocking, an OpenAPI client, error monitoring or auth. Use when building new functionality.
---

# Add a feature

Replace `<app>` and `<f>`. Lint enforces the layer rules; `pnpm lint` tells you when an import is wrong.

1. Look up the index in `AGENTS.md` for UI, shared code and use cases you can reuse. If nothing fits, say what you looked for before building it.
2. Create `apps/<app>/src/features/<f>/` with only the layers you need.
3. `domain/` - pure types, zod schemas and the repository **port** (an interface). Example `domain/user.ts`, `domain/user-repository.ts`. No React, Next or fetch.
4. `application/` - use cases that take a port and return `Result` (`@repo/shared/domain/result`), e.g. `application/get-user.ts`.
5. `data/` - adapters implementing the port:
   - `data/mock-user-repository.ts` - in-memory, the default.
   - `data/http-user-repository.ts` - uses `createHttpClient` from `@repo/shared/data/http-client` with `env.NEXT_PUBLIC_API_URL`.
6. `presentation/` - React components and hooks. Server data uses TanStack Query with keys `[domain, entity, params]`. Text goes through next-intl.
7. Wire it in the route (composition root), `apps/<app>/src/app/[locale]/<route>/page.tsx`: pick `mock-` or `http-` by `env.NEXT_PUBLIC_ADAPTER`, build the use case, pass it to the presentation component as a prop.
8. Add strings to `messages/en.json` and `messages/ko.json` (same keys).
9. Tests next to the code: domain and application as plain Vitest tests with the mock adapter; components with Testing Library.
10. Run `pnpm index`, then `pnpm check`.

## On-demand capabilities

Add each one the first time a feature needs it: install into the app, put the version in the catalog, then use it.

| Need             | Install in `apps/<app>`                  | Notes                                                                                                          |
| ---------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Forms            | `react-hook-form`, `@hookform/resolvers` | Reuse the feature's zod schema from `domain/` with `zodResolver`                                               |
| API mocking      | `msw` (dev)                              | Handlers in `src/shared/mocks/`; start only when `NEXT_PUBLIC_ADAPTER=mock` needs network-level mocks          |
| OpenAPI client   | `@hey-api/openapi-ts`                    | Pin the **exact** version (no `^`); generate into the feature's `data/`; wrap the client in an `http-` adapter |
| Error monitoring | `@sentry/nextjs`                         | Follow its Next.js setup; add its DSN to `packages/shared/src/data/env.ts` with an empty default               |
| Auth             | `better-auth`                            | Server config in `src/shared/`; session access behind a port in the feature's `domain/`                        |

For each: add the package to `catalog:` in `pnpm-workspace.yaml`, reference it as `"catalog:"` in the app's `package.json`, run `pnpm install`, then `pnpm check`.
