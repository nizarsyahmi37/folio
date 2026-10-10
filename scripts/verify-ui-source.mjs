import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");

let failed = false;

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(tsx|css)$/.test(name)) acc.push(p);
  }
  return acc;
}

for (const file of walk(root)) {
  const rel = relative(root, file);
  const text = readFileSync(file, "utf8");

  if (/text-muted-foreground\/\d+/.test(text)) {
    console.log(`✗ ${rel}: opacity on muted text breaks WCAG AAA`);
    failed = true;
  }

  if (/text-foreground\/\d+/.test(text)) {
    console.log(`✗ ${rel}: opacity on foreground text breaks WCAG AAA`);
    failed = true;
  }

  if (file.endsWith(".tsx")) {
    if (/\bprose-invert\b/.test(text) || /\bprose-zinc\b/.test(text)) {
      console.log(
        `✗ ${rel}: use .folio-prose with theme tokens, not prose-invert/prose-zinc`
      );
      failed = true;
    }
  }

  if (file.endsWith(".css") && /@apply[^;]*\bprose-invert\b/.test(text)) {
    console.log(`✗ ${rel}: @apply prose-invert is banned`);
    failed = true;
  }
}

if (failed) {
  console.error("\nUI source guard failed.");
  process.exit(1);
}

console.log("✓ UI source guard: typography uses AAA-safe patterns on all pages.");
