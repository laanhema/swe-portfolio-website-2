# Plan: Split Blog Routes Out of Home Page Bundle and Scope GSAP Animations

## Summary

This plan addresses React/TypeScript code review findings R1 and R4 from GitHub issue #97 (TODO-49). Currently, the entire website ships in a single 397 kB JavaScript chunk (136 kB gzip), because `App.tsx` statically imports `BlogIndex` and `BlogPost`, pulling 29 kB of blog post HTML strings from `posts.ts` into the initial home page bundle. In addition, `useGsapAnimations.ts` calls `ScrollTrigger.getAll().forEach(trigger => trigger.kill())` on unmount, destroying all ScrollTriggers throughout the application rather than only its own and leaving inline opacity and transform styles on the elements, while also ignoring user preferences for reduced motion. This plan converts `BlogIndex` and `BlogPost` to dynamic lazy imports with `React.lazy` wrapped in a `<Suspense fallback={null}>` boundary in `App.tsx`, refactors `useGsapAnimations` to use `gsap.matchMedia()` conditioned on `(prefers-reduced-motion: no-preference)` with instance-scoped `.revert()` cleanup, validates bundle size reduction, and ensures smooth, accessible route transitions.

## User Story

As a visitor accessing the portfolio website,
I want the home page to load with only the code necessary for its view and respect my accessibility motion preferences,
So that initial page loads are faster, unnecessary data downloads are avoided, and scroll reveal animations do not trigger when reduced motion is preferred.

## Metadata

| Field | Value |
|-------|-------|
| Type | ENHANCEMENT |
| Complexity | MEDIUM |
| Systems Affected | `src/App.tsx`, `src/hooks/useGsapAnimations.ts` |
| GitHub Issue | #97 |
| PRD Phase | N/A |
| Prototype Patch | `.agents/plans/split-blog-routes-and-scope-gsap-animations-prototype.patch` |

---

## Environment Findings

| Probe | Result |
|-------|--------|
| Baseline Build & Bundle Size | On `main` (commit `2713b38`), `npm run build` outputs a single entry chunk `dist/assets/index-*.js` of **397.16 kB (135.53 kB gzip)**. |
| Prototype Build & Bundle Size | With code-split blog routes, `dist/assets/index-*.js` shrinks to **364.08 kB (124.58 kB gzip)**, saving **33.08 kB uncompressed (10.95 kB gzip)** from the initial entry chunk. |
| Blog Content Isolation | The blog post content from `src/features/blog/data/posts.ts` (e.g. string "Ditching bloated project boards") is completely absent from `index-*.js` and isolated in the lazy chunk `dist/assets/useScrollReset-*.js` (28.27 kB). |
| Validation Pipeline | `npm run check` (`eslint .`, `node scripts/check-design-system.mjs`, `node scripts/check-agents-md.mjs`, `tsc -b && vite build`) passes with exit code 0. |
| GSAP matchMedia & Context Behavior | `gsap.matchMedia()` creates and manages internal `Context` instances under the hood. Calling `mm.revert()` reverts all tweens, restores inline element styles, and cleans up media query listeners without affecting external ScrollTrigger instances. |

---

## Patterns to Follow

### Route-Level Lazy Import and Suspense
```tsx
// SOURCE: src/App.tsx:1-15
import { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';

const BlogIndex = lazy(() => import('./features/blog/BlogIndex'));
const BlogPost = lazy(() => import('./features/blog/BlogPost'));
```

### Type-Only Blog Feature Imports
```tsx
// SOURCE: src/features/showcase/ProjectCard.tsx:5
import type { PostSlug } from '../blog/data/posts';
```

### Layout Effect Lifecycle and Scoped Animation Cleanup
```tsx
// SOURCE: src/hooks/useGsapAnimations.ts:7-39
export const useGsapAnimations = () => {
  useLayoutEffect(() => {
    // layout effect lifecycle setup
    return () => {
      // clean up animations scoped to this instance
    };
  }, []);
};
```

---

## Files to Change

| File | Action | Purpose | Patch Covered? |
|------|--------|---------|----------------|
| `src/App.tsx` | UPDATE | Split `BlogIndex` and `BlogPost` with `React.lazy`, wrap route table in `<Suspense fallback={null}>`. | Yes |
| `src/hooks/useGsapAnimations.ts` | UPDATE | Replace global `ScrollTrigger.getAll().kill()` with `gsap.matchMedia()` conditioned on `(prefers-reduced-motion: no-preference)` and call `mm.revert()`. | Yes |

---

## Tasks

Execute in order. Each task is atomic and verifiable. Note: the prototype patch `.agents/plans/split-blog-routes-and-scope-gsap-animations-prototype.patch` contains the core implementation; tasks below cover verification, boundary checks, and documentation.

### Task 1: Verify Code Splitting in App.tsx

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**: Ensure `BlogIndex` and `BlogPost` are loaded on demand via `React.lazy(() => import(...))` and no static value import remains for the blog feature. Wrap the `<Routes>` hierarchy within `<Suspense fallback={null}>`. Ensure any blog imports for typing remain strictly `import type`.
- **Mirror**: `src/features/showcase/ProjectCard.tsx:5`
- **Validate**: `npm run build` (verify `BlogIndex` and `BlogPost` generate distinct chunks under `dist/assets/`).

### Task 2: Verify GSAP Scoped Cleanup and Reduced Motion in useGsapAnimations.ts

- **File**: `src/hooks/useGsapAnimations.ts`
- **Action**: UPDATE
- **Implement**: Wrap the `.animate-on-scroll` queries and `gsap.fromTo` animation creation inside `mm.add('(prefers-reduced-motion: no-preference)', ...)`. In the cleanup return function, call `mm.revert()`. Ensure `ScrollTrigger.getAll()` is no longer called.
- **Mirror**: `src/hooks/useGsapAnimations.ts:7-39`
- **Validate**: `npm run lint` and `npm run build`

### Task 3: Execute Full Repository Verification

- **File**: `package.json`
- **Action**: VALIDATE
- **Implement**: Run full validation suite (`npm run check`) to ensure ESLint, design system token checks, AGENTS.md assertions, and TypeScript compilation all succeed.
- **Mirror**: `package.json:12`
- **Validate**: `npm run check`

---

## Validation

```bash
# Type check and production build
npm run build

# Lint
npm run lint

# Design system, AGENTS.md consistency and build
npm run check
```

## End-to-End Verification

1. **Bundle Split Verification**:
   - Run `npm run build`.
   - Inspect `dist/assets/`:
     - Confirm `index-*.js` is smaller than 397 kB (expected ~364 kB).
     - Confirm separate chunks for `BlogIndex-*.js`, `BlogPost-*.js`, and shared data `useScrollReset-*.js` are emitted.
   - Run a string check to ensure post text from `src/features/blog/data/posts.ts` is not present in `dist/assets/index-*.js`.

2. **Route Navigation & Suspense**:
   - Run `npm run preview`.
   - Load `/` in browser: home page displays instantly with all sections.
   - Click "Blog" link: navigates to `/blog` without layout flash or jump.
   - Click a post card (e.g. `Tralla`): navigates to `/blog/tralla` and loads article with scroll reset to top.
   - Directly refresh `/blog` and `/blog/gymbro-app`: verify direct loads work properly.

3. **Reduced Motion Verification**:
   - In browser DevTools Rendering tab, emulate `prefers-reduced-motion: reduce`.
   - Reload home page: verify all `.animate-on-scroll` elements are fully visible immediately with normal opacity and position, and no scroll-triggered translation or fade occurs.
   - Switch back to `prefers-reduced-motion: no-preference`: verify scroll animations function normally.

4. **Scoped GSAP Cleanup**:
   - Navigate from `/` to `/blog` and back to `/`: verify ScrollTriggers on `/` re-mount cleanly and navigation does not produce detached trigger errors.

---

## Risks

| Risk | Mitigation | Scope |
|------|------------|-------|
| Suspense fallback flash during route transition | Using `fallback={null}` prevents rendering awkward interim skeleton flashes on short chunk loads, while the body background `#f8f9fa` prevents white flashes. | In-scope |
| Elements staying hidden when user prefers reduced motion | Because `.animate-on-scroll` has no hiding CSS in stylesheets and `fromTo` is skipped under `prefers-reduced-motion: reduce`, elements remain in their natural visible layout. | In-scope |
| Inadvertent bundling of `posts.ts` into main chunk via type imports | Keep blog imports in `App.tsx` and `ProjectCard.tsx` strictly as `import type`. TypeScript erases type-only imports during compilation. | In-scope |
| Layout jump on lazy route landing before scroll reset | `useScrollReset` uses `useLayoutEffect`, running synchronously before browser paint when the lazy route component mounts. | In-scope |

---

## Open Questions

None. The implementation details, fallback strategy, and GSAP matchMedia conventions adhere strictly to author guidelines and issue #97 requirements.

---

## Acceptance Criteria

- [ ] `BlogIndex` and `BlogPost` load with `React.lazy`, and the post content in `posts.ts` is not in the JavaScript the home page loads.
- [ ] The entry chunk is smaller than today's 402 kB (136 kB gzip), with before and after sizes in the PR.
- [ ] `useGsapAnimations` reverts only the animations it created (a `gsap.context()`) and no longer calls `ScrollTrigger.getAll()`.
- [ ] With `prefers-reduced-motion: reduce`, `.animate-on-scroll` elements are visible and do not animate.
- [ ] `/blog` and `/blog/:slug` work on direct load and in-app navigation, and `npm run check` passes.
