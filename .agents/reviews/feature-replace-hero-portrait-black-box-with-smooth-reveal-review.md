# Code Review: feature/replace-hero-portrait-black-box-with-smooth-reveal

**Scope**: branch `feature/replace-hero-portrait-black-box-with-smooth-reveal` vs merge-base `22e2425` (including uncommitted working tree changes)  
**Recommendation**: APPROVE

## Summary

Reviewed changes to the hero portrait on branch `feature/replace-hero-portrait-black-box-with-smooth-reveal` implementing GitHub issue #116. The implementation encapsulates the hero image inside a dedicated `HeroPortrait` component in `src/App.tsx`, replacing the solid black box background (`bg-[#121212]`) with a brutalist framed slot matching the canvas background (`#f8f9fa`), smooth opacity reveal upon load completion, and instantaneous display under `prefers-reduced-motion`. Uncommitted changes in `.agents/issues/todo-issues.md` were caller-designated as unrelated and off-limits, and were excluded from this review scope.

Acceptance criteria verification for issue #116:
- **While the portrait loads, its slot shows a placeholder that matches the page (a light or blurred preview), not a solid black box**: Met. Verified via Slow 3G network throttling in headless Chrome; the placeholder slot displays the canvas background (`rgb(248, 249, 250)` / `#f8f9fa`) framed with `brutal-border` and `brutal-shadow` while the image downloads (`complete === false`, `opacity: 0`).
- **The image fades in once loaded, and appears instantly under `prefers-reduced-motion`**: Met. Verified `transition-opacity duration-700 ease-out` on `<img>` element with `motion-reduce:transition-none`, confirmed compiled in production CSS under `@media (prefers-reduced-motion: reduce)`.
- **There is no layout shift: the slot keeps its 2:3 size from `width`/`height`**: Met. Verified container bounding rect ratio is strictly 0.6667 (2:3) both during loading and after completion across viewports; CLS = 0.
- **Checked in a preview build with network throttling, at both viewports**: Met. Production build served on preview port 5199, throttled to Slow 3G, and verified at 1280x900 (desktop) and 375x812 (mobile) viewports.

## Issues Found

### Critical
None

### High Priority
None

### Medium Priority
None

### Suggestions (Low)
None

## Validation Results

| Check | Status | Notes |
|-------|--------|-------|
| Build / Type Check | PASS | `npm run check` (`tsc -b && vite build`) — host |
| Warnings | NONE | Compiler and lint warnings gate clean via `npm run check` |
| Lint | PASS | `npm run check` (`eslint .`, `node scripts/check-design-system.mjs`, `node scripts/check-agents-md.mjs`) — host |
| Tests | PASS | UI test suite `.claude/skills/verify/scripts/ax.sh all` (tables, nav, buttons, cursor, submit, hero) — all passed |
| UI verification | PASS | `.claude/skills/verify/scripts/ax.sh` (`all`, `desktop`, `mobile`); preview build with Slow 3G network throttling; viewports 1280x900 and 375x812; captures `.temp/verify/runs/20261031-155552/hero-desktop.png`, `.temp/verify/runs/20261031-155552/hero-mobile.png`, `.temp/verify/runs/20261031-155552/hero-loading-slow3g.png` |

## What's Good

- Clean component encapsulation in `src/App.tsx` (`HeroPortrait`) without unnecessary external dependencies or complex state.
- Separation of animation concerns: the GSAP `.animate-on-scroll` trigger remains on the outer wrapper `div`, while the CSS image reveal transition operates on the inner `img`, completely avoiding animation conflicts.
- Handles cached images cleanly: `useLayoutEffect` checks `imgRef.current?.complete` on initial render to prevent opacity flash when loaded from cache.
- Adheres to design-system principles by styling the loading placeholder container with neo-brutalist border and offset drop shadow while avoiding CSS filter blur in `<header>`.

## Recommendation

Ready to merge. Run `/issue-flow-done 116` with the branch checked out to complete the issue workflow.
