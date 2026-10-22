# Folio

Documentation starter: Next.js, MDX, Tailwind, and shadcn/ui. Write in `content/docs/`, ship a reading experience with sidebar, table of contents, and light/dark themes.

## Quick start

```bash
npm install
npm run dev
```

| Route | URL |
| --- | --- |
| Home | http://localhost:3000 |
| Docs | http://localhost:3000/docs |
| Workspace (placeholder) | http://localhost:3000/dashboard |

## Customize

1. **Branding** — [`lib/site-config.ts`](lib/site-config.ts) (name, tagline, description).
2. **Logo** — [`components/folio-logo.tsx`](components/folio-logo.tsx).
3. **Production URL** — copy [`.env.example`](.env.example) to `.env.local` and set `NEXT_PUBLIC_SITE_URL`.

## Write docs

Add MDX under [`content/docs/`](content/docs/). File paths become URLs:

| File | URL |
| --- | --- |
| `content/docs/index.mdx` | `/docs` |
| `content/docs/guide/setup.mdx` | `/docs/guide/setup` |

**Frontmatter** (recommended):

```yaml
---
title: Page title
description: Short summary for SEO and previews
---
```

**Sidebar** — add `meta.json` in each folder:

```json
{
  "index": { "title": "Introduction", "order": 1 },
  "setup": { "title": "Setup", "order": 2 }
}
```

**MDX components** — `Callout`, `FolioImage`, `FolioVideo`, `<Ad />` (see [`components/docs/mdx-components.tsx`](components/docs/mdx-components.tsx)).

## Project layout

```
content/docs/     # Your MDX (edit here)
lib/docs.ts       # Loads content from disk (swap for CMS/API later)
lib/site-config.ts
components/docs/  # Sidebar, TOC, pager, MDX
app/              # Routes: home, docs, dashboard
```

## Deploy

```bash
npm run build
npm start
```

Works on Vercel and any Node host. Set `NEXT_PUBLIC_SITE_URL` to your public URL.

## Google AdSense (optional)

Ads are **off** until you set env vars (see [`.env.example`](.env.example)).

```mdx
<Ad />
```

Disable automatic doc placements on a page with frontmatter `ads: false`.

## Accessibility (optional)

High-contrast theme tokens and focus styles in light and dark mode. After changing colors:

```bash
npm run verify:a11y
```
