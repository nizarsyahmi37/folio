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

function walk(dir, acc = [], extRe = /\.tsx$/) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc, extRe);
    else if (extRe.test(name)) acc.push(p);
  }
  return acc;
}

console.log("WAI-ARIA 1.2 — authoring and APG alignment checks\n");
console.log(
  "(WAI-ARIA has no WCAG-style AAA level; Folio enforces correct roles, names, states, and properties.)\n"
);

const mdxComponents = readFileSync(
  join(root, "components/docs/mdx-components.tsx"),
  "utf8"
);
const docPage = readFileSync(
  join(root, "app/docs/[[...slug]]/page.tsx"),
  "utf8"
);

if (!/id="doc-title"/.test(mdxComponents)) {
  fail('mdx-components: h1 must include id="doc-title" for aria-labelledby');
} else if (!/aria-labelledby="doc-title"/.test(docPage)) {
  fail("doc page: <article> must use aria-labelledby=\"doc-title\"");
} else {
  ok("Article labelled by page title (WAI-ARIA 1.2 name from author)");
}

const themeToggle = readFileSync(
  join(root, "components/docs/theme-toggle.tsx"),
  "utf8"
);
if (!/aria-haspopup=["']menu["']/.test(themeToggle)) {
  fail("theme-toggle: menu trigger needs aria-haspopup=\"menu\"");
} else {
  ok("Theme menu exposes haspopup for assistive tech");
}

const themeProvider = readFileSync(
  join(root, "components/theme-provider.tsx"),
  "utf8"
);
if (!/aria-live=["']polite["']/.test(themeProvider)) {
  fail("theme-provider: add aria-live status for theme changes (WCAG 4.1.3)");
} else {
  ok("Theme changes announced via polite live region");
}

const sidebar = readFileSync(
  join(root, "components/docs/docs-sidebar.tsx"),
  "utf8"
);
if (!/aria-expanded=\{open\}/.test(sidebar)) {
  fail("docs-sidebar: collapsible triggers must expose aria-expanded");
} else if (!/aria-controls=/.test(sidebar)) {
  fail("docs-sidebar: collapsible triggers should use aria-controls");
} else {
  ok("Sidebar collapsible sections expose expanded state and controls");
}

const toc = readFileSync(join(root, "components/docs/docs-toc.tsx"), "utf8");
if (!/aria-labelledby=/.test(toc)) {
  fail("docs-toc: navigation needs aria-labelledby for visible heading");
} else if (!/aria-current[\s\S]*location/.test(toc)) {
  fail("docs-toc: active entry should use aria-current=\"location\"");
} else {
  ok("Table of contents navigation uses labelledby and aria-current");
}

const requiredNavLabels = [
  "components/docs/docs-sidebar.tsx",
  "components/docs/docs-toc.tsx",
  "components/docs/docs-pager.tsx",
  "components/ui/breadcrumb.tsx",
];

for (const rel of requiredNavLabels) {
  const text = readFileSync(join(root, rel), "utf8");
  if (!/<nav\b/.test(text)) continue;
  if (/<nav[^>]*aria-label=/.test(text) || /aria-labelledby=/.test(text)) {
    continue;
  }
  if (/aria-label="breadcrumb"/.test(text)) continue;
  fail(`${rel}: <nav> landmark needs aria-label or aria-labelledby`);
}
ok("Navigation landmarks include accessible names");

for (const file of walk(join(root, "components"))) {
  const rel = relative(root, file);
  const text = readFileSync(file, "utf8");

  const iconButtons = [
    ...text.matchAll(/<Button[\s\S]*?size=["']icon[^"']*["'][\s\S]*?>/g),
  ];
  for (const m of iconButtons) {
    const chunk = m[0];
    if (!/aria-label=/.test(chunk) && !/<span className="sr-only">/.test(text.slice(m.index, m.index + 400))) {
      fail(`${rel}: icon-only Button needs aria-label or sr-only text`);
    }
  }

  if (/aria-hidden=["']true["'][\s\S]{0,120}(<button|<a |<input)/i.test(text)) {
    fail(`${rel}: do not hide focusable elements with aria-hidden`);
  }

  if (/\brole=["']button["']/.test(text) && !/<button/.test(text)) {
    fail(`${rel}: prefer native <button> over role=\"button\" on non-button elements`);
  }
}

for (const rel of ["components/ads/ad-slot.tsx", "components/ads/mdx-ad.tsx"]) {
  const text = readFileSync(join(root, rel), "utf8");
  if (!/aria-label=["']Advertisement["']/.test(text)) {
    fail(`${rel}: ad regions must be labelled as Advertisement`);
  }
}
ok("Advertisement asides use aria-label");

const adsScript = readFileSync(
  join(root, "components/ads/adsense-script.tsx"),
  "utf8"
);
if (/aria-hidden/.test(adsScript)) {
  fail("adsense-script: do not aria-hide third-party ad frames from AT");
}

if (failed) {
  console.error("\nWAI-ARIA verification failed.");
  process.exit(1);
}

console.log("\n✓ WAI-ARIA 1.2 / APG alignment checks passed.");
