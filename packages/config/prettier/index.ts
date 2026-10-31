import type { Config } from "prettier";

// Everything not listed here is the Prettier default (semicolons, double quotes, trailing commas).
const config: Config = {
  printWidth: 100,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./packages/ui/src/styles/theme.css",
  tailwindFunctions: ["cn", "cva"],
};

export default config;
