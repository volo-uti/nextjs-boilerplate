---
name: add-route
description: Add a page, layout, loading state or route handler under an app's locale-aware App Router. Use when a new URL is needed.
---

# Add a route

Routes live in `apps/<app>/src/app/[locale]/` and stay thin: they compose features, they hold no business logic.

1. Create `apps/<app>/src/app/[locale]/<segment>/page.tsx`. Accept `params: Promise<{ locale: string }>`, `await` it and call `setRequestLocale(locale)` so the page can be static.
2. Render a component from `features/<f>/presentation/`. If it needs data, build the adapter and use case here (see `add-feature`, step 7).
3. Internal links use `Link` from `@repo/shared/i18n/navigation`, never `next/link`, so the locale prefix is kept.
4. Page title: export `generateMetadata` and read strings with `getTranslations`.
5. Add the strings to both `messages/en.json` and `messages/ko.json`.
6. Add `error.tsx` or `loading.tsx` next to the page only if that segment needs its own.
7. Route handlers go in `src/app/api/<name>/route.ts`; the proxy matcher in `src/proxy.ts` already skips `/api`.
8. Run `pnpm check`; add an e2e case in `apps/<app>/e2e/` for user-visible flows.
