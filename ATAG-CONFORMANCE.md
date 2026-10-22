# ATAG 2.0 Level AAA — Folio conformance

**Product:** Folio (MDX knowledge base + reading UI)  
**Authoring:** MDX in `content/docs/`

## Verification

```bash
npm run verify:compliance   # runs before `npm run build`
npm run verify:content      # Part B MDX only
```

See [WCAG-CONFORMANCE.md](WCAG-CONFORMANCE.md), [WAI-ARIA-CONFORMANCE.md](WAI-ARIA-CONFORMANCE.md), and [UAAG-CONFORMANCE.md](UAAG-CONFORMANCE.md).

## Part A — Authoring tool UI

| Criterion | Implementation |
| --- | --- |
| **A.1.1.3** | Reader UI targets **WCAG 2.1 AAA** in light and dark |
| **A.3.1.4** | Keyboard operable navigation, theme menu, sidebar |
| **A.3.1.6** | [Keyboard shortcuts](/docs/for-authors/keyboard-shortcuts) |
| **A.3.6.1** | Theme preference persisted via `next-themes` |
| **A.3.6.4** | [Accessible writing](/docs/for-authors/accessibility) |

## Part B — Author support

| Criterion | Implementation |
| --- | --- |
| **B.2.2.5–B.2.2.8** | `verify-content.mjs` with repair messages |
| **B.2.2.6** | Non-zero exit and issue list on failure |
| **B.2.3.3** | Repair lines in terminal output |
| **B.2.4.1** | Sample MDX, `FolioImage`, `Callout`, `<Ad />` patterns |
| **B.2.5.x** | Starter content checked by the same scripts |

Manual review: [docs/atag-manual-checklist.md](docs/atag-manual-checklist.md).
