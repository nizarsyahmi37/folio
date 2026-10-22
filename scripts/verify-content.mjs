import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const contentRoot = join(root, "content/docs");

function walkMdx(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkMdx(p, files);
    else if (/\.mdx?$/i.test(name)) files.push(p);
  }
  return files;
}

function lineOf(content, index) {
  return content.slice(0, index).split("\n").length;
}

const issues = [];

function report(file, rule, message, repair, line) {
  issues.push({ file: relative(root, file), line, rule, message, repair });
}

for (const file of walkMdx(contentRoot)) {
  const raw = readFileSync(file, "utf8");
  const { data, content: rawContent } = matter(raw);
  const content = rawContent
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "");

  if (!data.title || String(data.title).trim() === "") {
    report(
      file,
      "ATAG-B2-metadata",
      "Missing or empty frontmatter `title`.",
      "Add `title: Your page title` in YAML frontmatter.",
      1
    );
  }

  if (!data.description || String(data.description).trim() === "") {
    report(
      file,
      "ATAG-B2-metadata",
      "Missing or empty frontmatter `description`.",
      "Add `description:` summarizing the page for search and assistive tech context.",
      1
    );
  }

  if (data.lang && !/^[a-z]{2}(-[A-Za-z0-9]+)?$/.test(String(data.lang))) {
    report(
      file,
      "WCAG-3.1.1",
      `Invalid BCP 47 language tag: ${data.lang}`,
      "Use a valid code such as `en`, `en-US`, or `ms`.",
      1
    );
  }

  const mdImages = [...content.matchAll(/!\[([^\]]*)\]\([^)]+\)/g)];
  for (const m of mdImages) {
    if (m[1].trim() === "") {
      report(
        file,
        "WCAG-1.1.1",
        "Image with empty alt text.",
        "Describe the image in brackets or use `<FolioImage alt=\"...\" />`.",
        lineOf(content, m.index ?? 0)
      );
    }
  }

  const htmlImg = [...content.matchAll(/<img\b[^>]*>/gi)];
  for (const m of htmlImg) {
    if (!/\balt\s*=/.test(m[0])) {
      report(
        file,
        "WCAG-1.1.1",
        "`<img>` without `alt` attribute.",
        "Add `alt` or use `<FolioImage src=\"...\" alt=\"...\" />`.",
        lineOf(content, m.index ?? 0)
      );
    }
  }

  const weakLinkText =
    /^(click here|here|read more|learn more|more|this|link)$/i;
  const mdLinks = [...content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
  for (const m of mdLinks) {
    const text = m[1].replace(/\s+/g, " ").trim();
    const href = m[2].trim();
    const line = lineOf(content, m.index ?? 0);
    if (text === "") {
      report(
        file,
        "WCAG-2.4.4",
        "Link with no link text.",
        "Use descriptive link text.",
        line
      );
    }
    if (weakLinkText.test(text)) {
      report(
        file,
        "WCAG-2.4.9",
        `Link text "${text}" does not describe the destination.`,
        "Rewrite the link with the destination name.",
        line
      );
    }
    if (/^https?:\/\//i.test(text) || text === href) {
      report(
        file,
        "WCAG-2.4.9",
        "Link text is a raw URL.",
        "Use words that describe the page or file.",
        line
      );
    }
  }

  const headings = [...content.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((m) => ({
    level: m[1].length,
    line: lineOf(content, m.index ?? 0),
    text: m[2],
  }));

  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length > 1) {
    report(
      file,
      "WCAG-2.4.6",
      `Multiple H1 headings (${h1s.length}).`,
      "Use a single `#` title per page.",
      h1s[1]?.line
    );
  }

  let lastLevel = 0;
  for (const h of headings) {
    if (lastLevel > 0 && h.level > lastLevel + 1) {
      report(
        file,
        "WCAG-2.4.6",
        `Heading level skips from H${lastLevel} to H${h.level}.`,
        `Insert an intermediate heading (H${lastLevel + 1}).`,
        h.line
      );
    }
    lastLevel = h.level;
  }
}

console.log("ATAG 2.0 Part B — MDX content checks\n");

if (issues.length === 0) {
  console.log("✓ All MDX files passed automated author accessibility checks.");
  console.log("\nComplete docs/atag-manual-checklist.md before publishing.");
  process.exit(0);
}

for (const i of issues) {
  const loc = i.line ? `${i.file}:${i.line}` : i.file;
  console.log(`✗ [${i.rule}] ${loc}`);
  console.log(`  Problem: ${i.message}`);
  console.log(`  Repair:  ${i.repair}\n`);
}

console.error(`${issues.length} content issue(s) found.`);
process.exit(1);
