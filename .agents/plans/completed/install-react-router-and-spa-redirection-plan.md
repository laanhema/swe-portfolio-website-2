# Plan: Install react-router and Configure GitHub Pages SPA Redirection

## Summary

Install `react-router` into project dependencies to support client-side routing, and configure GitHub Pages single-page application (SPA) redirection by creating `public/404.html` and updating `index.html` with a lightweight deep-route restoration script. This ensures direct URL deep linking and browser page refreshes on upcoming subpaths (such as `/blog` and `/blog/:slug`) seamlessly resolve without 404 errors on static GitHub Pages hosting.

## User Story

As a visitor accessing deep portfolio links or refreshing on a blog article route,
I want the static GitHub Pages server to redirect to the SPA root and restore the requested path,
So that I experience seamless client-side navigation without encountering a 404 Not Found error.

## Metadata

| Field | Value |
|---|---|
| Type | INFRASTRUCTURE |
| Complexity | LOW |
| Systems Affected | `package.json`, `package-lock.json`, `public/404.html`, `index.html` |
| GitHub Issue | #36 |

---

## Patterns to Follow

### Existing `index.html` Head Script
```html
// SOURCE: index.html:8-27
<script>
  (function () {
    try {
      var navEntries = performance.getEntriesByType('navigation');
      var isReload = navEntries.length > 0
        ? navEntries[0].type === 'reload'
        : (performance.navigation && performance.navigation.type === 1);
      if (isReload) {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual';
        }
        if (window.location.hash) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        window.scrollTo(0, 0);
      }
    } catch (e) {}
  })();
</script>
```

### GitHub Pages SPA Redirection Pattern
```html
// In public/404.html:
// Store location.href in sessionStorage and redirect to root '/'
sessionStorage.setItem('spa_redirect', window.location.href);
window.location.replace('/');
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `package.json` | UPDATE | Add `react-router` to `dependencies` |
| `public/404.html` | CREATE | Handle 404 requests on GitHub Pages, store target URL in `sessionStorage`, and redirect to `/` |
| `index.html` | UPDATE | Add deep-route restoration script to restore target path into browser history before React mounts |

---

## Tasks

### Task 1: Install `react-router` Dependency

- **File**: `package.json`
- **Action**: UPDATE
- **Implement**:
  Run `npm install react-router` to add `react-router` to `dependencies`.
- **Validate**: `npm run build`

### Task 2: Create `public/404.html` SPA Redirection Fallback

- **File**: `public/404.html`
- **Action**: CREATE
- **Implement**:
  Create `public/404.html` containing a clean HTML document with an inline script that saves `window.location.href` to `sessionStorage` under `'spa_redirect'` (safely wrapped in try/catch) and executes `window.location.replace('/')`.
- **Validate**: `test -f public/404.html`

### Task 3: Add Deep-Route Restoration Script to `index.html`

- **File**: `index.html`
- **Action**: UPDATE
- **Implement**:
  Add restoration logic inside `<head>` in `index.html` that checks `sessionStorage.getItem('spa_redirect')`, clears the item, and replaces browser history state (`window.history.replaceState(null, '', redirect)`) when the stored redirect differs from the current URL. Ensure existing reload scroll restoration logic remains intact.
- **Validate**: `npm run lint && npm run build`

---

## Validation

```bash
# Type check & Vite build
npm run build

# Lint
npm run lint

# Verify output contains dist/404.html
test -f dist/404.html
```

## End-to-End Verification

1. Verify `react-router` is listed under `dependencies` in `package.json` and node_modules resolves it.
2. Build production assets with `npm run build` and confirm `dist/404.html` is generated.
3. Inspect `dist/404.html` to confirm redirect logic stores `spa_redirect` and redirects to `/`.
4. Inspect `dist/index.html` to confirm restoration script checks `spa_redirect` and calls `replaceState`.
5. Run `npm run lint` and verify clean execution with 0 errors and 0 warnings.

---

## Risks

| Risk | Mitigation |
|---|---|
| sessionStorage disabled or restricted in private browsing / iframe | Wrap storage operations in try/catch to avoid unhandled script errors; fallback gracefully to root page |
| Collision with existing reload scroll restoration script in `index.html` | Place redirect restoration before reload check; only call `replaceState` when `spa_redirect` is present |

---

## Acceptance Criteria

- [ ] `react-router` is added to `dependencies` in `package.json` and cleanly installed.
- [ ] `public/404.html` is created with a redirection script that stores the requested path in `sessionStorage` and redirects to `/`.
- [ ] `index.html` includes a lightweight restoration script in `<head>` that parses the redirect and restores browser history to the requested deep route.
- [ ] `npm run build` builds the client application and includes `404.html` in the Vite production output.
- [ ] `npm run lint` passes with 0 errors and 0 warnings.
