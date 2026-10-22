# WAI-ARIA — Folio conformance

**Specifications:** [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/), [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)

## No “AAA” level for ARIA

Unlike WCAG, **WAI-ARIA does not define A, AA, or AAA levels**. Folio targets:

- Valid **roles, states, and properties** (WAI-ARIA 1.2)
- **APG patterns** for navigation, disclosure (sidebar folders), menus (theme), and dialogs (mobile sheet)
- **WCAG 4.1.2 Name, Role, Value** and **4.1.3 Status Messages** at the AAA bar where applicable

**Verification:** `npm run verify:aria` (included in `npm run verify:compliance`).

## Implemented patterns

| UI | ARIA / APG |
| --- | --- |
| Doc article | `aria-labelledby="doc-title"` on `<article>`, `id="doc-title"` on H1 |
| Sidebar folders | `aria-expanded`, `aria-controls` on triggers |
| Theme menu | `aria-haspopup="menu"`, labelled icon button |
| Theme change | `role="status"` + `aria-live="polite"` |
| TOC | `aria-labelledby`, `aria-current="location"` on active section |
| Ads | `aside` + `aria-label="Advertisement"` |
| Landmarks | Named `<nav>`, skip link, `main#main-content` |

## Limits

Third-party embeds (e.g. Google AdSense iframes) are controlled by the vendor’s markup. Custom MDX HTML must follow the same rules; run `npm run verify:compliance` after changes.
