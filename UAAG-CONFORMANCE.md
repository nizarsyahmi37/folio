# UAAG 2.0 — Folio alignment statement

**Note:** [UAAG 2.0](https://www.w3.org/TR/UAAG20/) defines requirements for **user agents** (browsers, media players). Folio is **web content** served to those user agents, not a browser itself.

Folio **aligns with UAAG goals** so people can use mainstream browsers and assistive technologies effectively. Automated checks: `npm run verify:uaag`.

## What we verify in code

| UAAG theme | Folio practice |
| --- | --- |
| **1.1 Access to all content (AT)** | Semantic landmarks, labels, alt text on components |
| **1.8 User control over rendering** | No viewport zoom lock; `prefers-reduced-motion` in CSS |
| **2.1.1 Keyboard focus** | No positive `tabIndex`; logical tab order in UI |
| **3.2.1 Language** | Document `lang`; optional per-page `lang` in MDX |

## Relationship to WCAG and ATAG

- **WCAG 2.1 AAA** — what readers experience (contrast, structure, focus).
- **ATAG 2.0 AAA** — tool UI (Part A) and MDX authoring checks (Part B).
- **UAAG alignment** — Folio does not block browser zoom, motion preferences, or assistive tech APIs.

Full UAAG AAA for a user agent is **not claimed** for Folio; browsers remain responsible for their own conformance.
