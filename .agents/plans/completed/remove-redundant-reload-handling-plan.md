# Plan: Remove Redundant Reload Handling in App.tsx

## Summary

This plan addresses finding T3 from the React/TypeScript code review (GitHub issue #98). `index.html` already contains an inline script in `<head>` that executes synchronously upon page reload, setting `history.scrollRestoration = 'manual'`, stripping the URL hash (via `history.replaceState`), and scrolling immediately to `(0, 0)`. `src/App.tsx` currently duplicates this behavior through a module-level `isPageReload` flag and a dedicated branch in `HomePage`'s `useLayoutEffect`. Because `index.html` strips the hash prior to React bundle execution and DOM mounting, `location.hash` is already empty when `HomePage` mounts on reload, causing `HomePage`'s existing fallback `else` branch (`window.scrollTo({ top: 0, left: 0, behavior: 'instant' })`) to execute naturally. This plan removes the redundant `isPageReload` module variable and its branch in `HomePage`, verifies that reloads on `/` and `/#work` across desktop and mobile viewports continue to start at `(0, 0)` with the hash stripped, confirms cross-page hash landings continue to scroll properly to target sections, and validates repository health via `npm run check`.

## User Story

As a visitor reloading the portfolio website,
I want the page to reload cleanly at the top of the page without duplicate scroll-reset logic,
So that the codebase remains maintainable, free of redundant performance timing checks, and consistent with the early inline reset in `index.html`.

## Metadata

| Field | Value |
|-------|-------|
| Type | REFACTOR |
| Complexity | LOW |
| Systems Affected | `src/App.tsx` |
| GitHub Issue | #98 |
| PRD Phase | N/A |
| Prototype Patch | N/A |

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/App.tsx` | UPDATE | Remove redundant module-level `isPageReload` detection block and its branch in `HomePage` `useLayoutEffect`. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Remove Redundant Reload Handling in App.tsx

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**: Remove the module-level reload detection variable `isPageReload` and its initialization block (`src/App.tsx:56-65`). In `HomePage`'s `useLayoutEffect`, remove the `if (isPageReload)` block (`src/App.tsx:119-129`). Rely on `index.html`'s inline script (`index.html:28-40`) to set manual scroll restoration, strip `window.location.hash`, and scroll to top on reload, allowing `HomePage`'s `else` branch (`src/App.tsx:137-139`) to handle top-of-page positioning on empty hash.
- **Mirror**: `src/App.tsx:131-139`
- **Validate**: `npm run check`

---

## Validation

```bash
# Type check, lint, design-system checks, and build
npm run check
```

## End-to-End Verification

1. **Build & Preview Server**:
   - Run `npm run build` and launch a local preview or test environment.
2. **Reload on `/` (Desktop & Mobile Viewport)**:
   - Load the homepage at `/`, scroll down to About or Work section.
   - Reload the page.
   - Verify `window.scrollY === 0` and the page starts at the top without visual jump.
3. **Reload on `/#work` (Desktop & Mobile Viewport)**:
   - Navigate to `/#work` (Work section scrolled into view).
   - Reload the page.
   - Verify that the inline script in `index.html` strips the hash (`window.location.hash === ''` or URL is `/`), `window.scrollY === 0`, and the page lands at the top.
4. **Cross-Page Hash Landing**:
   - Navigate to `/blog`.
   - Click a section navigation link to `/#about` or `/#work`.
   - Verify the browser transitions to `/` and scrolls into view at the target section (`scrollY > 0`), holding anchor as expected.

## Acceptance Criteria

- [ ] Redundant `isPageReload` variable and its `useLayoutEffect` branch removed from `src/App.tsx`
- [ ] No TypeScript, ESLint, or build regressions
- [ ] Behavior on reload of `/` and `/#work` on desktop and mobile viewports starts at top with hash removed
- [ ] Cross-page hash navigation (`/blog` to `/#about` / `/#work`) still lands accurately on target sections
- [ ] `npm run check` passes with 0 errors
