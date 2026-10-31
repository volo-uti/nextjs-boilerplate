#!/usr/bin/env node
// Every `messages/` folder (apps and packages) must have the same key set in all its locale files.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const roots = ["apps", "packages"].flatMap((dir) =>
  existsSync(dir) ? readdirSync(dir).map((name) => join(dir, name, "messages")) : [],
);

const flatten = (value, prefix = "") =>
  Object.entries(value).flatMap(([key, child]) =>
    child !== null && typeof child === "object"
      ? flatten(child, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );

let failed = false;
for (const dir of roots.filter(existsSync)) {
  const files = readdirSync(dir).filter((file) => file.endsWith(".json"));
  const keys = new Map(
    files.map((file) => [
      file,
      new Set(flatten(JSON.parse(readFileSync(join(dir, file), "utf8")))),
    ]),
  );
  const all = new Set([...keys.values()].flatMap((set) => [...set]));
  for (const [file, set] of keys) {
    const missing = [...all].filter((key) => !set.has(key));
    if (missing.length > 0) {
      failed = true;
      console.error(`${join(dir, file)} is missing: ${missing.join(", ")}`);
    }
  }
}

if (failed) process.exit(1);
console.log("locales: all message files have the same keys");
