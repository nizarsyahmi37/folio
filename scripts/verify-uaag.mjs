import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");

let failed = false;

function fail(msg) {
  console.log(`✗ ${msg}`);
  failed = true;
}

function ok(msg) {
  console.log(`✓ ${msg}`);
}

function walk(dir, acc = [], extRe) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc, extRe);
    else if (extRe.test(name)) acc.push(p);
  }
  return acc;
}

const layout = readFileSync(join(root, "app/layout.tsx"), "utf8");
const globals = readFileSync(join(root, "app/globals.css"), "utf8");

console.log("UAAG 2.0 — web content alignment checks\n");
console.log("(Folio is not a browser; these verify UAAG-aligned support for assistive technologies.)\n");

if (!/lang=["']en["']/.test(layout)) {
  fail("app/layout.tsx: <html> must include lang for UAAG 3.2.1 / WCAG 3.1.1");
} else {
  ok("Document language declared on <html>");
}

if (
  /userScalable:\s*false/i.test(layout) ||
  /maximumScale:\s*1/i.test(layout) ||
  /user-scalable=no/i.test(layout)
) {
  fail("Viewport must not block zoom (UAAG 1.8.4 / WCAG 1.4.4)");
} else if (!/export const viewport/.test(layout)) {
  fail("app/layout.tsx: export viewport with width device-width (UAAG 1.8.4)");
} else {
  ok("Viewport allows user agent zoom and reflow");
}

if (!/prefers-reduced-motion:\s*reduce/.test(globals)) {
  fail("globals.css: add prefers-reduced-motion handling (UAAG 1.8.2)");
} else {
  ok("Respects prefers-reduced-motion");
}

const skip = readFileSync(join(root, "components/skip-link.tsx"), "utf8");
if (!/#main-content/.test(skip)) {
  fail("Skip link must target #main-content (UAAG 1.8.1 / WCAG 2.4.1)");
} else {
  ok("Skip to main content link present");
}

const routesNeedingMain = [
  "app/page.tsx",
  "app/not-found.tsx",
  "app/dashboard/page.tsx",
  "components/docs/docs-shell.tsx",
];

for (const rel of routesNeedingMain) {
  const text = readFileSync(join(root, rel), "utf8");
  if (!/id=["']main-content["']/.test(text)) {
    fail(`${rel}: missing id="main-content" landmark`);
  }
}
ok("Primary routes expose main landmark");

for (const file of walk(join(root, "components"), [], /\.tsx$/)) {
  const rel = relative(root, file);
  const text = readFileSync(file, "utf8");
  if (/\btabIndex=\{?[1-9]/.test(text)) {
    fail(`${rel}: positive tabindex disrupts UAAG 2.1.1 focus order`);
  }
}

for (const file of walk(join(root, "app"), [], /\.tsx$/)) {
  const rel = relative(root, file);
  const text = readFileSync(file, "utf8");
  if (/\btabIndex=\{?[1-9]/.test(text)) {
    fail(`${rel}: positive tabindex disrupts UAAG 2.1.1 focus order`);
  }
}

ok("No positive tabindex in app/components");

for (const file of walk(join(root, "components"), [], /\.tsx$/)) {
  const rel = relative(root, file);
  const text = readFileSync(file, "utf8");
  const imgs = [...text.matchAll(/<img\b[^>]*>/gi)];
  for (const m of imgs) {
    if (!/\balt=/.test(m[0])) {
      fail(`${rel}: <img> without alt (UAAG 1.1 / WCAG 1.1.1)`);
    }
  }
}

ok("Images in components include alt text");

if (failed) {
  console.error("\nUAAG alignment verification failed.");
  process.exit(1);
}

console.log("\n✓ UAAG 2.0 alignment checks passed for Folio web UI.");
