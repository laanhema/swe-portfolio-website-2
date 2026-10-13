# Code Review: feature/split-blog-routes-and-scope-gsap-animations

**Scope**: branch `feature/split-blog-routes-and-scope-gsap-animations` (uncommitted working tree vs merge-base `2713b38`)
**Recommendation**: APPROVE

## Summary

Reviewed the implementation of GitHub issue #97 (`[TODO-49] Split the blog routes out of the home page bundle and scope the GSAP animations`) across `src/App.tsx` and `src/hooks/useGsapAnimations.ts`. The changes cleanly code-split `BlogIndex` and `BlogPost` routes using `React.lazy` and `<Suspense fallback={null}>`, isolating the 28.27 kB blog content into on-demand chunks and reducing the main entry chunk from 402 kB to 364.08 kB (124.58 kB gzip). Additionally, `useGsapAnimations` now encapsulates animations inside `gsap.matchMedia()` targeting `(prefers-reduced-motion: no-preference)` with instance-scoped `mm.revert()` cleanup, properly respecting accessibility preferences and eliminating global `ScrollTrigger.getAll().kill()` calls.

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
| Build / Type Check | PASS | `npm run check` (`tsc -b && vite build`) on host; entry bundle `index-*.js` 364.08 kB (124.58 kB gzip) |
| Warnings | NONE | Zero compiler or build warnings produced |
| Lint | PASS | `eslint .`, `node scripts/check-design-system.mjs`, `node scripts/check-agents-md.mjs` via `npm run check` on host |
| Tests | PASS | 5/5 automated headless Chrome CDP test assertions passed (reduced motion emulation, lazy bundle isolation, in-app navigation, direct route load, scoped cleanup); no unit test runner defined in `package.json` |
| UI verification | PASS | `.claude/skills/verify/scripts/ax.sh all` on preview server (port 5199), desktop (1280x900) & mobile (375x812), all tables, nav, buttons, cursor, hero checks passed |

## What's Good

- Route code-splitting via `React.lazy` successfully moved the heavy blog dataset (`posts.ts`) out of the initial payload into a shared lazy chunk (`useScrollReset-*.js`), achieving a 38.21 kB (11.28 kB gzip) reduction on the home page bundle.
- Replaced destructive global ScrollTrigger killing (`ScrollTrigger.getAll().forEach(t => t.kill())`) with matchMedia scoped revert (`mm.revert()`), preventing interference with other animation triggers across the application.
- `prefers-reduced-motion: reduce` preference is properly respected, ensuring `.animate-on-scroll` elements remain immediately visible at default opacity and without inline transform offsets.
- Full compliance with repository patterns, TypeScript typing, and design system rules.

## Recommendation

Ready to merge. Changes meet all acceptance criteria of issue #97 and pass all validation gates.
