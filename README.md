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

**MDX components** — `Callout`, `FolioImage`, `FolioVideo` (see [`components/docs/mdx-components.tsx`](components/docs/mdx-components.tsx)).

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

Ads are **off** until you set env vars. No code changes required.

1. Apply for [Google AdSense](https://www.google.com/adsense/) and add your site.
2. Create **Display** ad units for the placements you want.
3. Copy [`.env.example`](.env.example) to `.env.local` and set:

| Variable | Placement |
| --- | --- |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Required (`ca-pub-…`) |
| `NEXT_PUBLIC_ADSENSE_SLOT_DOCS_SIDEBAR` | Below the table of contents (wide screens) |
| `NEXT_PUBLIC_ADSENSE_SLOT_DOCS_ARTICLE` | End of each doc page, above prev/next |
| `NEXT_PUBLIC_ADSENSE_SLOT_HOME` | Marketing home page |

Restart `npm run dev` after changing env vars.

**In MDX**, insert an ad between sections:

```mdx
<Ad />
```

Use a specific ad unit: `<Ad slot="1234567890" />`. Disable ads on one page with frontmatter `ads: false`.

You are responsible for AdSense policies, consent (e.g. GDPR), and `ads.txt` on your domain.

## Accessibility (optional)

The UI uses high-contrast tokens and focus styles in light and dark mode. To check theme contrast locally:

```bash
npm run verify:a11y
```

This does not run on `build`; use it when you change colors or typography.
