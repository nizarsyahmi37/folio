# WCAG 2.1 Level AAA — Folio conformance

**Scope:** Every routed page — `/`, `/dashboard`, `/404`, and all `/docs/*` MDX pages — in **light and dark** themes.  
**Verification:** `npm run verify:compliance` (contrast, per-page shells, UI source) or `npm run verify:wcag` + `npm run verify:pages`.

## Implemented criteria (representative)

| Area | Approach |
| --- | --- |
| **1.4.6 Contrast (Enhanced)** | Design tokens in `app/globals.css`; normal text ≥7:1, UI components ≥3:1 |
| **1.4.8 Visual presentation** | Article width ≤70ch, line height ≥1.7, spacing via `.folio-prose` |
| **1.4.4 Resize text** | Relative units; viewport does not block zoom (`app/layout.tsx`) |
| **2.4.1 Bypass blocks** | Skip link to `#main-content` |
| **2.4.7 Focus visible** | 3px focus rings on links and controls |
| **2.5.5 Target size** | 44×44px minimum targets (`lib/a11y.ts`) |
| **3.1.1 Language** | `lang="en"` on `<html>`; per-page `lang` in MDX frontmatter |

## Typography in dark mode

Article body uses `.folio-prose` mapped to `--foreground` and `--muted-foreground`, not Tailwind `prose-invert` zinc grays.

## WAI-ARIA and UAAG

Semantic structure and ARIA patterns are checked by `verify:aria` and `verify:uaag` (see [WAI-ARIA-CONFORMANCE.md](WAI-ARIA-CONFORMANCE.md), [UAAG-CONFORMANCE.md](UAAG-CONFORMANCE.md)).

## Limits

Sign language, extended audio description, and live captions apply only when you publish that media. Custom MDX or colors require re-running `npm run verify:compliance`.
