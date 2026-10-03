# Code Review: feature/update-projectcard-to-2-button-layout

**Scope**: Branch `feature/update-projectcard-to-2-button-layout` against `main`
**Recommendation**: APPROVE

## Summary

Reviewed changes in `src/features/showcase/ProjectCard.tsx`, `src/App.tsx`, and associated design system files. The action buttons have been refactored into a standardized 2-button layout ("Code" linking to GitHub and "Read Story" linking to `/blog/:slug`). All four projects in `src/App.tsx` now provide their corresponding `postSlug`. The buttons sit side-by-side using `flex-1 py-3 px-3 text-center leading-tight` without wrapping or overflowing on narrow mobile screens (320px–375px), and React Router navigation is handled safely with `useInRouterContext()`.

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

| Check | Status |
|---|---|
| Type Check (`tsc -b`) | PASS |
| Build (`vite build`) | PASS |
| Lint (`eslint .`) | PASS |

## What's Good

- `ProjectCardProps` cleanly eliminates deprecated `liveUrl` and `liveLabel` properties in favor of `postSlug?: string`.
- Standardized 2-button layout across all project cards with consistent brutalist styling (`brutal-border`, `brutal-shadow`, hover transitions).
- Safe integration with React Router: uses `useInRouterContext()` to render `<Link>` when in router context and `<a href>` when outside router context.
- Buttons sit side-by-side with `flex-1` and responsive padding and line height, preventing mobile overflow.
- Design system documentation and preview files updated to match the implementation.

## Recommendation

Ready to merge. All acceptance criteria for issue #42 are satisfied and validation checks are clean.
