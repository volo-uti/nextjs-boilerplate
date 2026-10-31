import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

// Raw elements that have a replacement. A new atom adds one line here.
const rawElementReplacements = {
  button: "Use Button from @repo/ui/atoms/button (see the index in AGENTS.md).",
};
// Modules that have a replacement.
const restrictedImports = [
  { name: "next/link", message: "Use Link from @repo/shared/i18n/navigation." },
  {
    name: "next/navigation",
    importNames: ["redirect", "usePathname", "useRouter"],
    message: "Use the locale-aware version from @repo/shared/i18n/navigation.",
  },
];

const element = (type, pattern, capture) => ({ type, pattern, capture, partialMatch: false });

// Elements are matched generically (`apps/*`, `features/*`), so new apps and features
// need no change here.
const elements = [
  element("domain", "apps/*/src/features/*/domain", ["app", "feature"]),
  element("application", "apps/*/src/features/*/application", ["app", "feature"]),
  element("data", "apps/*/src/features/*/data", ["app", "feature"]),
  element("presentation", "apps/*/src/features/*/presentation", ["app", "feature"]),
  element("routes", "apps/*/src/app", ["app"]),
  element("app-shared", "apps/*/src/shared", ["app"]),
  element("pkg-ui", "packages/ui"),
  element("pkg-shared", "packages/shared"),
  element("pkg-config", "packages/config"),
];

const sameFeature = (type) => ({
  element: {
    type,
    captured: {
      app: "{{ from.element.captured.app }}",
      feature: "{{ from.element.captured.feature }}",
    },
  },
});
const sameApp = (type) => ({
  element: { type, captured: { app: "{{ from.element.captured.app }}" } },
});
const anyExternal = { module: { origin: ["external", "core"] } };

const policies = [
  // A file may always import its own element.
  { allow: { dependency: { relationship: { to: "internal" } } } },
  // External packages and Node built-ins are open everywhere except `domain` (below).
  { allow: { to: anyExternal } },
  // domain: only zod; tests may use their runner.
  {
    from: { element: { type: "domain" } },
    disallow: { to: { module: { origin: ["external", "core"], source: "!zod" } } },
  },
  {
    from: { element: { type: "domain" }, file: { categories: "test" } },
    allow: { to: anyExternal },
  },
  // presentation → application → domain ← data (within one feature).
  { from: { element: { type: "application" } }, allow: { to: sameFeature("domain") } },
  { from: { element: { type: "data" } }, allow: { to: sameFeature("domain") } },
  {
    from: { element: { type: "presentation" } },
    allow: { to: [sameFeature("application"), sameFeature("domain")] },
  },
  // Shared code available to features.
  {
    from: { element: { type: ["domain", "application", "data"] } },
    allow: { to: { element: { type: "pkg-shared" } } },
  },
  {
    from: { element: { type: "presentation" } },
    allow: { to: { element: { type: ["pkg-shared", "pkg-ui"] } } },
  },
  // Routes compose features of their own app (composition root) and use shared code.
  {
    from: { element: { type: "routes" } },
    allow: {
      to: [
        sameApp("domain"),
        sameApp("application"),
        sameApp("data"),
        sameApp("presentation"),
        sameApp("app-shared"),
        { element: { type: ["pkg-shared", "pkg-ui"] } },
      ],
    },
  },
  {
    from: { element: { type: "app-shared" } },
    allow: { to: { element: { type: ["pkg-shared", "pkg-ui"] } } },
  },
  // Tool config files (vitest.config.ts, ...) may use the shared presets.
  { from: { file: { categories: "config" } }, allow: { to: { element: { type: "pkg-config" } } } },
  // Packages: ui → shared; shared → nothing local; no package imports an app.
  { from: { element: { type: "pkg-ui" } }, allow: { to: { element: { type: "pkg-shared" } } } },
];

export default defineConfig([
  globalIgnores([
    "**/node_modules/**",
    "**/.next/**",
    "**/next-env.d.ts",
    "**/coverage/**",
    "**/playwright-report/**",
    "**/test-results/**",
  ]),
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  {
    settings: {
      next: { rootDir: ["apps/*/"] },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          noWarnOnMultipleProjects: true,
          project: ["apps/*/tsconfig.json", "packages/*/tsconfig.json"],
        },
      },
      "boundaries/elements": elements,
      "boundaries/files": [
        { category: "test", pattern: "**/*.test.{ts,tsx}" },
        { category: "config", pattern: "**/*.config.{ts,mjs}" },
      ],
    },
    plugins: { boundaries },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          checkAllOrigins: true,
          message:
            "Import not allowed by the layer rules: {{ from.element.types }} -> {{ to.element.types }}{{ to.module.source }}",
          policies,
        },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["packages/ui/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...Object.entries(rawElementReplacements).map(([tag, message]) => ({
          selector: `JSXOpeningElement[name.name='${tag}']`,
          message,
        })),
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["packages/shared/src/i18n/**"],
    rules: { "no-restricted-imports": ["error", { paths: restrictedImports }] },
  },
  {
    files: ["apps/*/src/**/*.{ts,tsx}", "packages/*/src/**/*.{ts,tsx}"],
    ignores: ["packages/shared/src/data/env.ts"],
    rules: {
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message: "Read environment values through env from @repo/shared/data/env.",
        },
      ],
    },
  },
  {
    files: ["**/*.mjs", "**/*.js", "scripts/**"],
    languageOptions: { globals: { process: "readonly", console: "readonly" } },
  },
]);
