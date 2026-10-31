# Plan: Replace Hero Portrait Black Loading Box with Smooth Reveal

## Summary

The hero portrait currently sets `bg-[#121212]` directly on the `<img>` element, which paints an opaque black box before the 123 kB JPEG arrives over the network. We will replace this with a framed placeholder slot matching the canvas background (`#f8f9fa`) containing an inlined, lightweight blurred thumbnail preview, and smoothly fade in the full-resolution image once loaded via CSS opacity transitions. The solution respects `prefers-reduced-motion` with instant display, preserves the exact 2:3 aspect ratio with zero layout shift, and separates the image reveal styling from the existing GSAP entrance animation on the outer wrapper.

## User Story

As a visitor loading the portfolio website
I want to see a light, styled image placeholder and a smooth portrait reveal
So that the initial load feels polished and doesn't flash a jarring solid black rectangle before the image finishes downloading

## Metadata

| Field | Value |
|-------|-------|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | Hero portrait rendering (`src/App.tsx`) |
| GitHub Issue | #116 |
| PRD Phase | N/A |
| Prototype Patch | N/A |

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/App.tsx` | UPDATE | Encapsulate hero portrait loading state, slot container with canvas background, blurred preview placeholder, and smooth image fade-in |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Encapsulate Hero Portrait with Placeholder and Smooth Fade-in

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  1. Add `useState` to the `'react'` imports in `src/App.tsx`.
  2. Define an inlined compact base64 blurred preview data URI `PORTRAIT_PLACEHOLDER` (~516 bytes).
  3. Extract or implement a `HeroPortrait` component for the hero image slot inside the existing `.animate-on-scroll` wrapper:
     - Container `div` with `relative w-full aspect-[2/3] brutal-border brutal-shadow bg-[#f8f9fa] overflow-hidden`.
     - Inlined blurred placeholder `img` with `src={PORTRAIT_PLACEHOLDER}`, `alt=""`, `aria-hidden="true"`, and `absolute inset-0 w-full h-full object-cover blur-sm scale-105`.
     - High-resolution `img` with `src={portrait}`, `alt="Lauri Makkonen"`, `width={853}`, `height={1280}`, `fetchPriority="high"`, `onLoad={() => setIsLoaded(true)}`, and classes: `relative w-full h-full object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${isLoaded ? 'opacity-100' : 'opacity-0'}`.
     - `useLayoutEffect` to check `imgRef.current?.complete` on initial mount to immediately set `isLoaded` to `true` if the asset is served from browser cache.
- **Mirror**: `src/App.tsx:1-12` (React imports and asset binding) and `src/hooks/useGsapAnimations.ts:11` (respecting `prefers-reduced-motion`).
- **Validate**: `npm run check`

### Task 2: Validate Build, Lint, and Design Rules

- **File**: `src/App.tsx`
- **Action**: CHECK
- **Implement**:
  - Run the complete project validation script `npm run check` which verifies:
    1. TypeScript compilation (`tsc -b`)
    2. ESLint checks (`eslint .`)
    3. Design system component class documentation parity (`check:design`)
    4. AGENTS.md claims parity (`check:agents`)
    5. Vite production bundle build (`vite build`)
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

1. Run `npm run preview` to serve the production build locally.
2. In a headless or browser environment:
   - Open the homepage with Network Throttling enabled (e.g. "Slow 3G" or "Fast 3G").
   - Confirm that the hero portrait container shows the `#f8f9fa` canvas background framed by the brutalist border and shadow with a soft blurred preview rather than a black box (`bg-[#121212]`).
   - Confirm that upon download completion, the portrait transitions smoothly from 0 to 100% opacity over ~700ms.
   - Confirm that with CSS media query `(prefers-reduced-motion: reduce)`, the image appears instantaneously without fade transition.
   - Confirm that the dimensions of the slot do not shift or cause cumulative layout shift (CLS = 0) at both mobile (375px) and desktop (1280px) viewports.

## Risks

| Risk | Mitigation |
|------|------------|
| Conflict with GSAP scroll entrance animation on wrapper | The GSAP `ScrollTrigger` targets `.animate-on-scroll` on the outer container (`<div>`), while the image load fade operates exclusively on the inner `<img>` element. Both animations operate on independent DOM nodes. |
| Cached image flash or delayed fade-in on navigation | Use `useLayoutEffect` to check `imgRef.current?.complete` on mount; if already cached, `isLoaded` is set to `true` immediately before browser paint. |
| Documented design-system class drift | Do not alter any class strings tracked in `.agents/design-system/laanhema-design-system/components/*/README.md`. Verified by `npm run check:design`. |

## Acceptance Criteria

- [ ] While the portrait loads, its slot shows a placeholder that matches the page (a light or blurred preview), not a solid black box.
- [ ] The image fades in once loaded, and appears instantly under `prefers-reduced-motion`.
- [ ] There is no layout shift: the slot keeps its 2:3 size from `width`/`height`.
- [ ] Checked in a preview build with network throttling, at both viewports.
- [ ] `npm run check` passes with 0 errors.
