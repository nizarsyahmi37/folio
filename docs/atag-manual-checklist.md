# ATAG 2.0 AAA — manual author checklist

Automated checks (`npm run verify:content`) cover machine-detectable MDX issues. Complete this checklist for judgments automation cannot make (ATAG B.2.2.8 / B.2.3.3).

## Before publish

```bash
npm run verify:compliance
```

## Per page

- [ ] **Purpose clear** — Title and opening state the page goal (WCAG 2.4.6).
- [ ] **Link purpose** — Every link’s purpose is clear from its text alone (WCAG 2.4.9).
- [ ] **Headings** — Outline order is logical; no skipped levels.
- [ ] **Language** — Set `lang` in frontmatter when not the site default (WCAG 3.1.1).
- [ ] **Reading level** — Plain language where the subject allows (WCAG 3.1.5).

## Images and media

- [ ] **Alt text** — Alt conveys the same information, or `alt=""` if decorative (WCAG 1.1.1).
- [ ] **Complex images** — Charts include a long description or data table.
- [ ] **Video** — Use `<FolioVideo>` with `captionsSrc` and/or `transcript` when publishing video.

## Tables and motion

- [ ] **Tables** — Introduce complex tables; use `scope="row"` for row headers in HTML.
- [ ] **Motion** — No flashing content; no essential information only in animation.
