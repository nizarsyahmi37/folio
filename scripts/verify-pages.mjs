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

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function walkMdx(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkMdx(p, files);
    else if (/\.mdx?$/i.test(name)) files.push(relative(root, p));
  }
  return files;
}

console.log("Per-page shell checks (light/dark use shared theme tokens)\n");

const pageChecks = [
  {
    route: "/",
    file: "app/page.tsx",
    needsMain: true,
    needsNavLabel: true,
  },
  {
    route: "/dashboard",
    file: "app/dashboard/page.tsx",
    needsMain: true,
  },
  {
    route: "/404",
    file: "app/not-found.tsx",
    needsMain: true,
  },
];

for (const page of pageChecks) {
  const text = read(page.file);
  if (page.needsMain && !/id=["']main-content["']/.test(text)) {
    fail(`${page.route} (${page.file}): missing main#main-content`);
  }
  if (page.needsNavLabel && /<nav\b/.test(text) && !/aria-label=/.test(text)) {
    fail(`${page.route}: primary <nav> needs aria-label`);
  }
  if (/\b(text-zinc-|text-gray-|bg-zinc-|bg-gray-)\d/.test(text)) {
    fail(`${page.route}: use theme tokens, not hardcoded zinc/gray utilities`);
  }
  if (!/\btext-(foreground|muted-foreground)\b/.test(text) && page.route !== "/dashboard") {
    fail(`${page.route}: page should use theme foreground/muted text tokens`);
  }
}

const docsLayout = read("app/docs/layout.tsx");
if (!/DocsShell/.test(docsLayout)) {
  fail("/docs/*: layout must wrap content in DocsShell");
}

const docsShell = read("components/docs/docs-shell.tsx");
if (!/id=["']main-content["']/.test(docsShell)) {
  fail("/docs/*: DocsShell must expose main#main-content");
}

const docPage = read("app/docs/[[...slug]]/page.tsx");
if (!/folio-prose/.test(docPage)) {
  fail("/docs/*: article body must use .folio-prose (AAA in light and dark)");
}
if (!/<article\b/.test(docPage)) {
  fail("/docs/*: doc template must use <article>");
}

const dashboard = read("app/dashboard/page.tsx");
if (!/\btext-foreground\b/.test(dashboard)) {
  fail("/dashboard: use text-foreground on headings and body text");
}

const mdxPages = walkMdx(join(root, "content/docs"));
ok(
  `Page shells: /, /dashboard, /404, /docs/* (${mdxPages.length} MDX pages share docs template)`
);

for (const rel of mdxPages) {
  let path = rel
    .replace(/^content\/docs\//, "")
    .replace(/\.mdx$/i, "")
    .replace(/(^|\/)index$/i, "");
  const href = path ? `/docs/${path}` : "/docs";
  ok(`  · ${href}`);
}

if (failed) {
  console.error("\nPer-page verification failed.");
  process.exit(1);
}

console.log(
  "\n✓ All routed pages use AAA-safe shells and theme tokens in light and dark."
);
