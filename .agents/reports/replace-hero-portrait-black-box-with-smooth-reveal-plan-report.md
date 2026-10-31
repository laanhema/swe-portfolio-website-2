# Implementation Report

**Plan**: `.agents/plans/completed/replace-hero-portrait-black-box-with-smooth-reveal-plan.md`
**Branch**: `feature/replace-hero-portrait-black-box-with-smooth-reveal`
**Status**: COMPLETE

## Summary

Replaced the solid black box background (`bg-[#121212]`) on the hero portrait with a framed placeholder slot matching the canvas background (`#f8f9fa` / `var(--color-bg-primary)`) that smoothly reveals the portrait image via a CSS opacity transition once loaded. The solution respects `prefers-reduced-motion` with instant display (`motion-reduce:transition-none`), preserves the exact 2:3 aspect ratio without layout shift (CLS = 0), and separates the image reveal from GSAP's scroll entrance animation on the outer wrapper.

## Tasks Completed

| # | Task | File | Status |
|---|------|------|--------|
| 1 | Encapsulate Hero Portrait with Placeholder and Smooth Fade-in | `src/App.tsx` | PASS |
| 2 | Validate Build, Lint, and Design Rules | `src/App.tsx` | PASS |

## Validation Results

| Check | Result | Command / environment |
|-------|--------|-----------------------|
| Type check & Build | PASS | `npm run build` (`tsc -b && vite build`) — host |
| Lint | PASS | `npm run lint` (`eslint .`) — host |
| Design System Check | PASS (45 documented class strings verified) | `npm run check:design` (`node scripts/check-design-system.mjs`) — host |
| AGENTS.md Parity Check | PASS (87 items verified) | `npm run check:agents` (`node scripts/check-agents-md.mjs`) — host |
| All-in-one Check | PASS | `npm run check` — host |
| End-to-End Verification | PASS | `.claude/skills/verify/scripts/ax.sh all` (tables, nav, buttons, cursor, submit, and hero across desktop and mobile viewports) |

## Files Changed

| File | Action | Lines |
|------|--------|-------|
| `src/App.tsx` | UPDATE | +34/-10 |
| `.agents/issues/todo-issues.md` | PRE-EXISTING | Uncommitted tracked changes retained untouched |

## Deviations from Plan

- Used the `#f8f9fa` canvas background with brutalist border and smooth fade reveal directly rather than embedding a separate inlined blurred thumbnail image element, avoiding conflict with the neo-brutalist hero verification check (`ax.sh hero` which asserts that no element in `<header>` has CSS `blur`). This cleanly meets the acceptance criterion ("a placeholder that matches the page (a light or blurred preview), not a solid black box") while adhering strictly to the design system constraints.

## Tests Written

| Test File | Test Cases |
|-----------|------------|
| N/A | Static presentation UI component without unit test harness; verified via `npm run check` and the headless Chrome E2E test suite `.claude/skills/verify/scripts/ax.sh all`. |
