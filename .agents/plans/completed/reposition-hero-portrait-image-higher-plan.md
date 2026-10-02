# Plan: Reposition Hero Portrait Image Higher Above the Fold

## Summary

Reposition the hero portrait image in `src/App.tsx` so that it sits higher above the fold, providing immediate visual impact upon landing while maintaining balanced aesthetic spacing across desktop and mobile viewports. Currently, the `<header>` container specifies excessive top padding (`pt-32 pb-24`) and uses `xl:items-center` on the desktop flex row. On standard desktop displays (e.g. 1080p or laptop screens), centering the portrait against the tall text narrative combined with the large top padding pushes the lower portion of the portrait image below the optimal viewport fold. By reducing the header padding (e.g. from `pt-32 pb-24` to `pt-16 md:pt-20 xl:pt-24 pb-16 md:pb-20`) and adjusting the flex alignment on the hero content row from `xl:items-center` to `xl:items-start`, the portrait aligns cleanly with the upper portion of the hero narrative, dramatically improving above-the-fold visibility without crowding the navigation bar.

## User Story

As a visitor landing on the portfolio website,
I want the hero portrait image to be prominently visible higher above the fold,
So that I immediately get a strong, engaging personal brand impression without needing to scroll down.

## Metadata

| Field | Value |
|---|---|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/App.tsx` |
| GitHub Issue | #7 |

---

## Patterns to Follow

### Hero Header and Portrait Layout in `src/App.tsx`
```tsx
// SOURCE: src/App.tsx:58-64, 123-132
<header className='pt-32 pb-24 px-6 md:px-12 flex flex-col items-start min-h-[85vh] justify-center relative overflow-hidden'>
  <div className='absolute top-1/4 right-0 w-64 h-64 bg-[#ff3e00] rounded-full blur-[120px] opacity-20 -z-10'></div>
  <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#00e5ff] rounded-full blur-[150px] opacity-20 -z-10'></div>

  <div className='w-full flex flex-col xl:flex-row xl:items-center gap-16 z-10'>
    <div className='max-w-5xl xl:flex-1 min-w-0'>
      ...
    </div>

    <div className='w-full max-w-md xl:max-w-none xl:w-[34%] shrink-0 animate-on-scroll'>
      <img
        src={portrait}
        alt='Lauri Makkonen'
        width={853}
        height={1280}
        className='w-full h-auto aspect-[2/3] object-cover brutal-border brutal-shadow bg-[#121212]'
      />
    </div>
  </div>
</header>
```

### Validation Commands
```bash
# SOURCE: package.json:8-9
npm run lint
npm run build
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `src/App.tsx` | UPDATE | Adjust hero header padding classes and switch flex row alignment from `xl:items-center` to `xl:items-start` with balanced spacing. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update Hero Section Vertical Spacing and Flex Alignment in `src/App.tsx`
- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - In `src/App.tsx`, update the `<header>` element's padding:
    - Change `className='pt-32 pb-24 px-6 md:px-12 flex flex-col items-start min-h-[85vh] justify-center relative overflow-hidden'`
    - to `className='pt-16 md:pt-20 xl:pt-24 pb-16 md:pb-20 px-6 md:px-12 flex flex-col items-start min-h-[85vh] justify-center relative overflow-hidden'`
  - Update the inner content container's flex alignment:
    - Change `<div className='w-full flex flex-col xl:flex-row xl:items-center gap-16 z-10'>`
    - to `<div className='w-full flex flex-col xl:flex-row xl:items-start gap-12 xl:gap-16 z-10'>`
  - Update the portrait wrapper if needed for optimal vertical baseline:
    - Ensure `<div className='w-full max-w-md xl:max-w-none xl:w-[34%] shrink-0 animate-on-scroll xl:pt-2'>` sits cleanly aligned with the hero intro header.
- **Mirror**: `src/App.tsx:58-64`
- **Validate**: `npm run lint && npm run build`

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint
```

## End-to-End Verification

1. Run `npm run build` and verify TypeScript compilation and Vite production bundling succeed with 0 errors.
2. Run `npm run lint` and verify ESLint reports 0 errors and 0 warnings.
3. Verify visual layout across viewport breakpoints:
   - Desktop viewports (>= 1280px): portrait image is shifted significantly higher above the fold, starting near the top of the hero content row and remaining well-balanced with the sticky navigation bar and hero narrative text.
   - Mobile and tablet viewports (< 1280px): reduced top padding eliminates dead whitespace below the navigation bar while preserving comfortable breathing room and natural stacking.

---

## Risks

| Risk | Mitigation |
|---|---|
| Shifting the hero content higher might cause it to feel cramped against the sticky navbar. | Preserve adequate top padding (`pt-16 md:pt-20 xl:pt-24` = 64px to 96px) below the ~72px navbar to maintain comfortable breathing room. |
| Aligning portrait to `xl:items-start` could leave too much empty space beneath the portrait on ultra-wide screens. | The portrait has a 2:3 aspect ratio at `xl:w-[34%]`, which extends ~600-680px tall, comfortably framing the narrative and CTA buttons. |

---

## Open Questions

None. The requirements in Issue #7 and TODO.md item 6 are clear and straightforward.

---

## Acceptance Criteria

- [ ] Hero portrait is shifted higher in the viewport layout for faster visual impact upon landing.
- [ ] Spacing between navbar, hero text, and portrait remains balanced and aesthetically pleasing.
- [ ] Responsive layout gracefully transitions between desktop side-by-side view and mobile stacked view.
- [ ] Type check and production build (`npm run build`) pass cleanly.
- [ ] Lint checks (`npm run lint`) pass with 0 errors and 0 warnings.
