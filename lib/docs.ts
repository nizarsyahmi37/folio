import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "content/docs");

export type DocFrontmatter = {
  title?: string;
  description?: string;
  /** BCP 47 language tag for this page (WCAG 3.1.1). */
  lang?: string;
  /** Set `ads: false` to hide doc ad placements on this page. */
  ads?: boolean;
};

export type DocPage = {
  slug: string[];
  href: string;
  filePath: string;
  frontmatter: DocFrontmatter;
  content: string;
};

export type NavItem =
  | {
      type: "page";
      name: string;
      title: string;
      href: string;
      slug: string[];
      order: number;
      hidden: boolean;
    }
  | {
      type: "folder";
      name: string;
      title: string;
      href?: string;
      slug?: string[];
      order: number;
      hidden: boolean;
      children: NavItem[];
    };

type MetaEntry =
  | string
  | {
      title?: string;
      order?: number;
      hidden?: boolean;
    };

type MetaJson = Record<string, MetaEntry>;

const DOC_EXTENSIONS = [".mdx", ".md"];

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function humanizeName(name: string): string {
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function readMeta(dir: string): MetaJson {
  const metaPath = path.join(dir, "meta.json");
  if (!fs.existsSync(metaPath)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf8")) as MetaJson;
  } catch {
    return {};
  }
}

function resolveMetaEntry(
  name: string,
  entry: MetaEntry | undefined,
  fallbackTitle: string
): { title: string; order: number; hidden: boolean } {
  if (entry === undefined) {
    return { title: fallbackTitle, order: 999, hidden: false };
  }
  if (typeof entry === "string") {
    return { title: entry, order: 999, hidden: false };
  }
  return {
    title: entry.title ?? fallbackTitle,
    order: entry.order ?? 999,
    hidden: entry.hidden ?? false,
  };
}

function filePathToSlug(relativePath: string): string[] {
  const withoutExt = relativePath.replace(/\.(mdx|md)$/i, "");
  const parts = withoutExt.split("/").filter(Boolean);
  if (parts.length > 0 && parts[parts.length - 1] === "index") {
    parts.pop();
  }
  return parts;
}

function slugToHref(slug: string[]): string {
  if (slug.length === 0) {
    return "/docs";
  }
  return `/docs/${slug.join("/")}`;
}

function walkDocFiles(dir: string, base = CONTENT_ROOT): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDocFiles(fullPath, base));
    } else if (
      entry.isFile() &&
      DOC_EXTENSIONS.some((ext) => entry.name.endsWith(ext))
    ) {
      files.push(path.relative(base, fullPath));
    }
  }

  return files;
}

function findPageFile(dir: string, baseName: string): string | null {
  for (const ext of DOC_EXTENSIONS) {
    const filePath = path.join(dir, `${baseName}${ext}`);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

function buildNavTree(dir: string, slugPrefix: string[]): NavItem[] {
  const meta = readMeta(dir);
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const items: NavItem[] = [];

  const seen = new Set<string>();

  for (const entry of entries) {
    if (entry.name === "meta.json") continue;

    if (entry.isDirectory()) {
      seen.add(entry.name);
      const childDir = path.join(dir, entry.name);
      const childSlug = [...slugPrefix, entry.name];
      const metaEntry = resolveMetaEntry(
        entry.name,
        meta[entry.name],
        humanizeName(entry.name)
      );
      const indexFile = findPageFile(childDir, "index");
      const children = buildNavTree(childDir, childSlug);

      const folderItem: NavItem = {
        type: "folder",
        name: entry.name,
        title: metaEntry.title,
        order: metaEntry.order,
        hidden: metaEntry.hidden,
        children,
      };

      if (indexFile) {
        folderItem.href = slugToHref(childSlug);
        folderItem.slug = childSlug;
      }

      if (!metaEntry.hidden || children.some((c) => !c.hidden)) {
        items.push(folderItem);
      }
      continue;
    }

    if (!entry.isFile()) continue;

    const ext = DOC_EXTENSIONS.find((e) => entry.name.endsWith(e));
    if (!ext) continue;

    const baseName = entry.name.slice(0, -ext.length);
    if (baseName === "index") continue;

    seen.add(baseName);
    const metaEntry = resolveMetaEntry(
      baseName,
      meta[baseName],
      humanizeName(baseName)
    );
    const slug = [...slugPrefix, baseName];

    items.push({
      type: "page",
      name: baseName,
      title: metaEntry.title,
      href: slugToHref(slug),
      slug,
      order: metaEntry.order,
      hidden: metaEntry.hidden,
    });
  }

  for (const [name, entry] of Object.entries(meta)) {
    if (seen.has(name)) continue;
    const metaEntry = resolveMetaEntry(name, entry, humanizeName(name));
    if (metaEntry.hidden) continue;

    const childDir = path.join(dir, name);
    if (fs.existsSync(childDir) && fs.statSync(childDir).isDirectory()) {
      const childSlug = [...slugPrefix, name];
      items.push({
        type: "folder",
        name,
        title: metaEntry.title,
        order: metaEntry.order,
        hidden: false,
        children: buildNavTree(childDir, childSlug),
        href: findPageFile(childDir, "index")
          ? slugToHref(childSlug)
          : undefined,
        slug: findPageFile(childDir, "index") ? childSlug : undefined,
      });
    }
  }

  return items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getDocsNavTree(): NavItem[] {
  if (!fs.existsSync(CONTENT_ROOT)) {
    return [];
  }
  return buildNavTree(CONTENT_ROOT, []);
}

function flattenNav(items: NavItem[]): NavItem[] {
  const result: NavItem[] = [];

  for (const item of items) {
    if (item.hidden) {
      if (item.type === "folder" && item.children.length > 0) {
        result.push(...flattenNav(item.children));
      }
      continue;
    }

    if (item.type === "page") {
      result.push(item);
    } else {
      if (item.href && item.slug) {
        result.push({
          type: "page",
          name: item.name,
          title: item.title,
          href: item.href,
          slug: item.slug,
          order: item.order,
          hidden: false,
        });
      }
      result.push(...flattenNav(item.children));
    }
  }

  return result;
}

export function getFlattenedNav(): Extract<NavItem, { type: "page" }>[] {
  return flattenNav(getDocsNavTree()).filter(
    (item): item is Extract<NavItem, { type: "page" }> => item.type === "page"
  );
}

export function getAllDocSlugs(): { slug: string[] }[] {
  const files = walkDocFiles(CONTENT_ROOT);
  const slugs = files.map((file) => ({
    slug: filePathToSlug(file.replace(/\\/g, "/")),
  }));

  const unique = new Map<string, { slug: string[] }>();
  for (const item of slugs) {
    unique.set(item.slug.join("/") || "__index__", item);
  }
  return Array.from(unique.values());
}

export function getDocBySlug(slug: string[]): DocPage | null {
  const normalized = slug ?? [];
  const rel =
    normalized.length === 0
      ? "index.mdx"
      : `${normalized.join("/")}.mdx`;
  const relMd = rel.replace(".mdx", ".md");

  let filePath = path.join(CONTENT_ROOT, rel);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(CONTENT_ROOT, relMd);
  }
  if (!fs.existsSync(filePath)) {
    const indexMdx = path.join(
      CONTENT_ROOT,
      normalized.length === 0 ? "index.mdx" : `${normalized.join("/")}/index.mdx`
    );
    const indexMd = indexMdx.replace(".mdx", ".md");
    if (fs.existsSync(indexMdx)) {
      filePath = indexMdx;
    } else if (fs.existsSync(indexMd)) {
      filePath = indexMd;
    } else {
      return null;
    }
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fileSlug = filePathToSlug(
    path.relative(CONTENT_ROOT, filePath).replace(/\\/g, "/")
  );

  const frontmatter = data as DocFrontmatter;
  const title =
    frontmatter.title ??
    (fileSlug.length > 0
      ? humanizeName(fileSlug[fileSlug.length - 1])
      : "Documentation");

  return {
    slug: fileSlug,
    href: slugToHref(fileSlug),
    filePath,
    frontmatter: { ...frontmatter, title },
    content,
  };
}

export type DocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function extractHeadings(content: string): DocHeading[] {
  const headings: DocHeading[] = [];
  const slugger = new Map<string, number>();

  const lines = content.split("\n");
  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/#+$/, "").trim();
    let id = slugifyHeading(text);
    const count = slugger.get(id) ?? 0;
    if (count > 0) {
      id = `${id}-${count}`;
    }
    slugger.set(slugifyHeading(text), count + 1);

    headings.push({ id, text, level });
  }

  return headings;
}

export function getAdjacentDocs(slug: string[]): {
  prev: Extract<NavItem, { type: "page" }> | null;
  next: Extract<NavItem, { type: "page" }> | null;
} {
  const flat = getFlattenedNav();
  const key = slug.join("/");
  const index = flat.findIndex((p) => p.slug.join("/") === key);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? flat[index - 1] : null,
    next: index < flat.length - 1 ? flat[index + 1] : null,
  };
}
