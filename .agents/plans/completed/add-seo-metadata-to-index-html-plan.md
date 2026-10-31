# Plan: Add SEO Metadata to index.html

## Summary

`index.html` currently contains only the title, viewport meta tag, and favicon link, lacking search engine and social media metadata. We will generate a high-contrast Neo-Brutalist 1200x630 share card image (`public/og-image.png`) adhering to `.agents/design-system/laanhema-design-system/DESIGN.md`, add meta description, OpenGraph (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`), and Twitter Card (`twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image`) tags pointing to `https://laanhema.dev/` and `https://laanhema.dev/og-image.png`, and update Phase 3 deliverables in `.agents/PRDs/PRD.md`.

## User Story

As a visitor sharing or discovering laanhema.dev across social media, messaging platforms, and search engines
I want rich preview cards with an informative description and a branded Neo-Brutalist preview image
So that links shared to laanhema.dev display polished, recognizable previews.

## Metadata

| Field | Value |
|-------|-------|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | HTML entry point (`index.html`), static assets (`public/og-image.png`), PRD specification (`.agents/PRDs/PRD.md`) |
| GitHub Issue | #109 |
| PRD Phase | `.agents/PRDs/PRD.md` — Phase 3: Performance, SEO & Accessibility Audit |
| Prototype Patch | N/A |

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `public/og-image.png` | CREATE | Branded 1200x630 PNG share card in Neo-Brutalist design language |
| `index.html` | UPDATE | Add meta description, OpenGraph tags, and Twitter card tags |
| `.agents/PRDs/PRD.md` | UPDATE | Mark Phase 3 SEO metadata deliverable as completed |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Generate Neo-Brutalist OpenGraph Share Image

- **File**: `public/og-image.png`
- **Action**: CREATE
- **Implement**:
  - Generate a 1200x630 PNG image adhering to the Neo-Brutalist design system:
    - Canvas background `#f8f9fa`
    - Solid card box with `#ffffff` ground, 6px ink border (`#121212`), 16px hard offset drop shadow (`#121212`)
    - Brand wordmark: `laanhema.dev` with `#ff3e00` accent dot
    - Category badge: "SOFTWARE ENGINEER" in `#ff3e00` fill with 4px border
    - Display headline: "BUILDING ROBUST SYSTEMS." with Noto Sans bold typography and `#ff3e00` highlight on "ROBUST"
    - Subhead: "Full-stack software engineer building fast, reliable web applications. Coding since 2019 with a focus on clean architecture and responsive interfaces."
    - Four tech badges with accent fills (`#ff3e00`, `#00e5ff`, `#facc15`, `#a855f7`) and stats label "Since 2019 • 2000+ GitHub Contributions"
  - Save directly to `public/og-image.png`.
- **Mirror**: `.agents/design-system/laanhema-design-system/DESIGN.md:1-30`
- **Validate**: `file public/og-image.png | grep "1200 x 630"`

### Task 2: Add Meta Description, OpenGraph, and Twitter Card Tags to index.html

- **File**: `index.html`
- **Action**: UPDATE
- **Implement**:
  - Add primary meta description:
    `<meta name="description" content="Portfolio of Lauri Makkonen (laanhema), a full-stack software engineer building fast, reliable web applications. Coding since 2019 with a focus on clean architecture and responsive interfaces." />`
  - Add OpenGraph tags:
    `<meta property="og:title" content="laanhema.dev — Software Engineer Portfolio" />`
    `<meta property="og:description" content="Portfolio of Lauri Makkonen (laanhema), a full-stack software engineer building fast, reliable web applications. Coding since 2019 with a focus on clean architecture and responsive interfaces." />`
    `<meta property="og:type" content="website" />`
    `<meta property="og:url" content="https://laanhema.dev/" />`
    `<meta property="og:image" content="https://laanhema.dev/og-image.png" />`
  - Add Twitter Card tags:
    `<meta name="twitter:card" content="summary_large_image" />`
    `<meta name="twitter:title" content="laanhema.dev — Software Engineer Portfolio" />`
    `<meta name="twitter:description" content="Portfolio of Lauri Makkonen (laanhema), a full-stack software engineer building fast, reliable web applications. Coding since 2019 with a focus on clean architecture and responsive interfaces." />`
    `<meta name="twitter:image" content="https://laanhema.dev/og-image.png" />`
  - Preserve the `<title>laanhema.dev</title>` tag exactly (required by `verify-server.sh:43`).
  - Preserve the inline SPA redirect restore and reload handling script exactly.
- **Mirror**: `index.html:1-49`
- **Validate**: `npm run check`

### Task 3: Update PRD Phase 3 Deliverables

- **File**: `.agents/PRDs/PRD.md`
- **Action**: UPDATE
- **Implement**:
  - Update Phase 3 Deliverable item:
    Change `- [ ] Add rich SEO metadata in index.html (description, OpenGraph image, Twitter card). Not implemented: index.html holds the title "laanhema.dev", the favicon link and the viewport tag only.`
    To:
    `- [x] Add rich SEO metadata in index.html (description, OpenGraph image, Twitter card) (#109).`
  - Update status summary at top of `.agents/PRDs/PRD.md` line 6:
    Update the `Not in the code:` clause to omit Phase 3 SEO metadata (#109).
  - Update section 13.1 ("Specified, Not Built"):
    Remove item 1 (`1. **SEO Metadata**: The description, OpenGraph image and Twitter card of Phase 3 (#109).`) and renumber the remaining items.
- **Mirror**: `.agents/PRDs/PRD.md:441-449`
- **Validate**: `npm run check`

### Task 4: Validate Production Build and Preview Serving

- **File**: `index.html`
- **Action**: CHECK
- **Implement**:
  - Run full validation suite `npm run check` (runs ESLint, design system token checks, AGENTS.md checks, and production Vite build).
  - Launch `.claude/skills/verify/scripts/verify-server.sh start preview` on port 5199.
  - Verify `http://127.0.0.1:5199/` serves the updated HTML with all meta tags intact.
  - Verify `http://127.0.0.1:5199/og-image.png` serves the 1200x630 share card with HTTP 200.
  - Shut down preview server with `.claude/skills/verify/scripts/verify-server.sh stop`.
- **Mirror**: `.claude/skills/verify/scripts/verify-server.sh:1-50`
- **Validate**: `npm run check`

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint

# Design & documentation checks
npm run check:design
npm run check:agents

# All-in-one check
npm run check
```

## End-to-End Verification

1. Start preview server: `.claude/skills/verify/scripts/verify-server.sh start preview`.
2. Inspect rendered `head` via curl:
   - `curl -sf http://127.0.0.1:5199/ | grep -q '<meta name="description"'`
   - `curl -sf http://127.0.0.1:5199/ | grep -q '<meta property="og:title"'`
   - `curl -sf http://127.0.0.1:5199/ | grep -q '<meta property="og:image" content="https://laanhema.dev/og-image.png"'`
   - `curl -sf http://127.0.0.1:5199/ | grep -q '<meta name="twitter:card" content="summary_large_image"'`
3. Verify image asset serving:
   - `curl -sf -o /dev/null -w "%{http_code} %{content_type}\n" http://127.0.0.1:5199/og-image.png` -> returns `200 image/png`.
4. Stop preview server: `.claude/skills/verify/scripts/verify-server.sh stop`.

## Risks

| Risk | Mitigation |
|------|------------|
| Social network crawlers reject relative image URLs | Use absolute URL `https://laanhema.dev/og-image.png` matching the custom domain in `public/CNAME`. |
| `verify-server.sh` healthcheck breaks if title is changed | Retain `<title>laanhema.dev</title>` exactly as required by `verify-server.sh:43`. |
| Uncommitted changes in `.agents/issues/todo-issues.md` disturbed | Strictly avoid modifying, staging, or reverting `.agents/issues/todo-issues.md`. |

## Acceptance Criteria

- [ ] All tasks completed
- [ ] `index.html` has a `<meta name="description">` that describes the site
- [ ] `index.html` has OpenGraph tags `og:title`, `og:description`, `og:type`, `og:url` (`https://laanhema.dev/`), and `og:image` with absolute URL
- [ ] `index.html` has `twitter:card` of `summary_large_image` with title, description, and image
- [ ] `public/og-image.png` exists, is 1200x630, and is served in the production build
- [ ] `.agents/PRDs/PRD.md` Phase 3 SEO metadata deliverable is marked complete
- [ ] `npm run check` passes cleanly
