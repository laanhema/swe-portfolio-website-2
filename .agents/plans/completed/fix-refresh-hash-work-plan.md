# Plan: Fix Website Defaulting to #work Hash on Page Refresh

## Summary

When visitors navigate the site, clicking in-page anchor links (such as "View Work" or "Work") appends `#work` to the browser address bar. Upon refreshing the page, standard browser behavior retains `#work` and automatically scrolls down to the `#work` section instead of loading the site from the top hero section. To resolve this, we will add an early-executing reload guard in `index.html` and a React lifecycle handler in `src/App.tsx` that detects page reload (`PerformanceNavigationTiming.type === 'reload'`), disables automatic scroll restoration, clears any leftover URL hash via `history.replaceState`, and ensures page reloads start cleanly at `(0, 0)` at the top of the site. Direct fresh navigations with explicit hashes will continue to preserve their target hash and scroll to the requested section, and native smooth scrolling will be enabled across the application in `src/styles/global.css`.

## User Story

As a visitor browsing the portfolio website,
I want the page to load at the top hero section whenever I refresh the page,
So that I don't unexpectedly jump straight down to the `#work` section simply because I previously clicked a navigation link.

## Metadata

| Field | Value |
|---|---|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `index.html`, `src/App.tsx`, `src/styles/global.css` |
| GitHub Issue | #31 |

---

## Patterns to Follow

### Early Head Script Pattern in `index.html`
```html
// SOURCE: index.html
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

### React Lifecycle Scroll / Hash Handling in `src/App.tsx`
```tsx
// SOURCE: src/App.tsx
useEffect(() => {
  const navEntries = performance.getEntriesByType('navigation');
  const isReload = navEntries.length > 0
    ? (navEntries[0] as PerformanceNavigationTiming).type === 'reload'
    : (performance.navigation && performance.navigation.type === 1);

  if (isReload) {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }
}, []);
```

### Global Smooth Scrolling in `src/styles/global.css`
```css
// SOURCE: src/styles/global.css
@layer base {
  html {
    scroll-behavior: smooth;
  }
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
  body {
    ...
  }
}
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `index.html` | UPDATE | Add pre-render reload script to disable `scrollRestoration`, strip hash via `history.replaceState` on reload, and position viewport at top. |
| `src/App.tsx` | UPDATE | Add React `useEffect` hook to ensure post-mount reload handling clears hash and resets viewport scroll to `(0, 0)`. |
| `src/styles/global.css` | UPDATE | Add `scroll-behavior: smooth` with `prefers-reduced-motion` check to ensure smooth in-page transitions for `#work`, `#about`, `#contact`. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Add Pre-render Reload Guard in `index.html`

- **File**: `index.html`
- **Action**: UPDATE
- **Implement**:
  - Insert an inline `<script>` tag inside `<head>` before body rendering.
  - Check `performance.getEntriesByType('navigation')[0].type === 'reload'` (with fallback to `performance.navigation.type === 1`).
  - If reloaded:
    - Set `history.scrollRestoration = 'manual'`.
    - If `window.location.hash` is present, call `history.replaceState(null, '', window.location.pathname + window.location.search)`.
    - Call `window.scrollTo(0, 0)`.
- **Validate**: `npm run build`

### Task 2: Add Post-Mount Scroll & Hash Reset Effect in `src/App.tsx`

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Import `useEffect` from `react`.
  - Add an effect on mount (`[]`) that checks if the navigation type was `'reload'`.
  - If reloaded, set `history.scrollRestoration = 'manual'`, replace state if hash exists, and scroll to top `(0, 0)`.
- **Validate**: `npm run lint && npm run build`

### Task 3: Enable Smooth In-Page Scrolling in `src/styles/global.css`

- **File**: `src/styles/global.css`
- **Action**: UPDATE
- **Implement**:
  - Under `@layer base`, set `html { scroll-behavior: smooth; }`.
  - Add `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`.
- **Validate**: `npm run build`

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint
```

## End-to-End Verification

1. Start preview or dev server: `npm run build && npm run preview`
2. Test anchor navigation:
   - Click "View Work" or "Work" -> browser smoothly scrolls down to `#work`, and `#work` appears in URL.
   - Click "About" -> browser smoothly scrolls to `#about`.
   - Click "Contact" -> browser smoothly scrolls to `#contact`.
3. Test page refresh behavior:
   - With `#work` (or `#about` / `#contact`) active, reload the page (`Ctrl+R` / `F5`).
   - Expected: Page reloads and displays the top hero section cleanly, and hash is stripped from URL.
4. Test direct navigation with hash:
   - Open or navigate directly with `type: 'navigate'` to URL with `#work`.
   - Expected: Hash is retained and view scrolls to the `#work` section.

---

## Risks

| Risk | Mitigation |
|---|---|
| Direct deep-linking with hash might accidentally be cleared | Guard is restricted strictly to `type === 'reload'`, preserving initial deep-links for `navigate` types |
| Users with motion sensitivity dislike smooth scrolling | Added `@media (prefers-reduced-motion: reduce)` to disable smooth scrolling when requested by system settings |

---

## Acceptance Criteria

- [ ] Root cause identified and documented.
- [ ] Refreshing the page loads at top of the website (hero section).
- [ ] In-page smooth scrolling to `#work`, `#about`, and `#contact` functions properly.
- [ ] Browser history and back/forward navigation remain clean and predictable.
- [ ] `npm run lint` and `npm run build` pass with zero errors.
