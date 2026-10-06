# Plan: Fix Mobile Menu Overshooting Section Targets on Home Page

## Summary

On `/` at a mobile viewport (e.g., 375px wide), tapping a section link (`Work`, `About`, or `Contact`) in the open mobile menu drawer causes the viewport to scroll approximately 282px past the target section header. In `src/features/navigation/Nav.tsx`, `handleSectionClick` calls `closeMenu()` (which calls `setIsOpen(false)`) and immediately executes `element.scrollIntoView({ behavior: 'smooth' })` in the same event loop tick. Because React state updates are batched asynchronously, the mobile menu drawer (`#mobile-menu`) remains rendered in the DOM inside the sticky `<nav>` container when `scrollIntoView` computes the target scroll position. When React subsequently re-renders and unmounts `#mobile-menu` in the next frame, the height of `<nav>` decreases from ~366px back to 84px, removing 282px of height above the target section and resulting in a ~282px scroll overshoot. The planned fix imports `flushSync` from `react-dom` and uses `flushSync(() => setIsOpen(false))` in `handleSectionClick` (and `handleLogoClick` / `closeMenu` when open) to synchronously flush the drawer unmount to the DOM prior to executing `element.scrollIntoView({ behavior: 'smooth' })`.

## User Story

As a mobile site visitor,
I want to tap a section link in the mobile navigation drawer,
So that the mobile menu closes and the page scrolls smoothly to the target section with its top edge landing exactly at the bottom of the sticky navbar.

## Metadata

| Field | Value |
|-------|-------|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/features/navigation/Nav.tsx` |
| GitHub Issue | #64 |
| PRD Phase | N/A |

---

## Environment Findings

| Probe | Result |
|-------|--------|
| Baseline `npm run lint` | Passes cleanly (0 errors) |
| Baseline `npm run build` | Passes cleanly (`tsc -b && vite build`) |
| Sticky nav height on mobile (`<375px–767px`) | **84px** (`calc(4.5rem + 12px)` set via `scroll-padding-top` in `src/styles/global.css:19`) |
| Sticky nav height on desktop (`≥768px`) | **72px** (`calc(4.25rem + 4px)` set via `scroll-padding-top` in `src/styles/global.css:24`) |
| Mobile drawer container height | ~282px when `#mobile-menu` is mounted inside sticky `<nav>` |
| Test runner | None configured in `package.json` (`dev`, `build`, `lint`, `preview`). Verification is browser-driven via `.claude/skills/verify`. |

---

## Patterns to Follow

### React State Flushing for Synchronous DOM Measurement / Unmount
```tsx
// Pattern: Using flushSync to force synchronous DOM state update before layout positioning
import { flushSync } from 'react-dom';

if (isOpen) {
  flushSync(() => {
    setIsOpen(false);
  });
}
```

### Navigation Section Scroll Handler
```tsx
// SOURCE: src/features/navigation/Nav.tsx:18-30
const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
  closeMenu();
  if (isHome) {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (window.location.hash !== `#${targetId}`) {
        history.pushState(null, '', `#${targetId}`);
      }
    }
  }
};
```

### Logo Click Top Scroll Handler
```tsx
// SOURCE: src/features/navigation/Nav.tsx:13-16
const handleLogoClick = () => {
  closeMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/features/navigation/Nav.tsx` | UPDATE | Import `flushSync` from `react-dom` and use it to synchronously unmount the mobile drawer before calculating scroll offsets in `handleSectionClick` and `handleLogoClick`. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Synchronously unmount mobile menu drawer before smooth scrolling in `Nav.tsx`

- **File**: [src/features/navigation/Nav.tsx](file:///home/lauri/github/swe-portfolio-website-2/src/features/navigation/Nav.tsx)
- **Action**: UPDATE
- **Implement**:
  1. Import `flushSync` from `'react-dom'`.
  2. Refactor `closeMenu` or section/logo click handlers so that when `isOpen` is `true`, setting `isOpen` to `false` is wrapped in `flushSync(() => setIsOpen(false))`.
  3. Ensure that when `handleSectionClick` runs on mobile with the menu open, the drawer DOM element `#mobile-menu` is unmounted synchronously before `element.scrollIntoView({ behavior: 'smooth' })` is executed.
  4. Ensure `handleLogoClick` also flushes menu closure synchronously if `isOpen` is `true` before `window.scrollTo({ top: 0, behavior: 'smooth' })`.
  5. Preserve all existing desktop navigation, hash updating (`history.pushState`), and cross-page navigation (`isHome === false`) behavior.
- **Mirror**: `src/features/navigation/Nav.tsx:18-30`
- **Validate**: `npm run lint && npm run build`

---

## Validation

```bash
# Type check and Production Build
npm run build

# Code formatting and Linting
npm run lint
```

---

## End-to-End Verification

1. **Mobile Menu Section Landing Accuracy (Viewport 375px)**:
   - Start local preview server with `npm run preview`.
   - Set viewport to 375px width (e.g. `ax.sh mobile` or DevTools viewport `375x812`).
   - Open home page `/`.
   - Tap `MENU` button to expand mobile drawer.
   - Tap `ABOUT` link in the drawer.
   - Verify that:
     - `#mobile-menu` closes.
     - URL hash updates to `/#about`.
     - The top edge of section `#about` (`about.getBoundingClientRect().top`) lands exactly at the bottom edge of sticky `<nav>` (`nav.getBoundingClientRect().bottom`, offset by 84px), within 2px precision.
   - Repeat for `WORK` (`/#work`) and `CONTACT` (`/#contact`).

2. **Logo and Desktop Verification**:
   - Verify tapping logo (`laanhema.dev`) in open mobile menu closes drawer and scrolls to top (`scrollY === 0`).
   - Verify desktop navigation (`≥768px`) links (`Work`, `About`, `Contact`, `Blog`) operate without errors.
   - Verify cross-page navigation from `/blog` to `/#work` lands correctly.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Calling `flushSync` when menu is already closed (`isOpen === false`) could cause unnecessary React sync lifecycle flushes. | Check `if (isOpen)` before calling `flushSync(() => setIsOpen(false))`, or only flush state when `isOpen` is currently `true`. |
| Unmounting drawer synchronously might cause abrupt visual frame drop if drawer has closing animation. | The mobile drawer currently has no CSS transition/animation (`{isOpen && <div ...>}`); instant unmount matches existing state toggle behavior. |

---

## Open Questions

None. The root cause is identified, and the technical approach (`flushSync`) directly resolves the asynchronous layout shift before scroll calculation.

---

## Acceptance Criteria

- [ ] On `/` at a 375px-wide viewport, tapping Work, About and Contact in the open mobile menu ends with each section's top edge within 2px of the bottom of the sticky nav.
- [ ] The mobile menu closes when a section link is tapped.
- [ ] The URL hash still updates to the tapped section (`#work`, `#about`, `#contact`).
- [ ] Desktop nav links and cross-page links from `/blog` keep working as before.
- [ ] `npm run lint` and `npm run build` pass.
