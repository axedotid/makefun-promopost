// main.ts — make.fun entry for the post-x-promote bounty.
// Node 22. Offline, no network. Copies POST.json into the output directory,
// creating that directory if it does not exist.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "POST.json");
const targetPath = join(outputDir, "POST.json");

// Parse and validate the shape before copying so a malformed entry fails loudly
// instead of silently propagating a bad artifact into the output directory.
const raw = readFileSync(sourcePath, "utf8");
let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch (err) {
  throw new Error(`POST.json is not valid JSON: ${(err as Error).message}`);
}
if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  throw new Error("POST.json must contain a JSON object");
}
const url = (parsed as Record<string, unknown>).url;
if (typeof url !== "string" || url.length === 0) {
  throw new Error('POST.json must have a non-empty string "url" field');
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(sourcePath, targetPath);

console.log(`copied ${sourcePath} -> ${targetPath} (url=${url})`);