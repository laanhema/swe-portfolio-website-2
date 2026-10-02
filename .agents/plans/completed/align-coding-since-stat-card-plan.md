# Plan: Align "2019 Coding Since" Stat Card Text With Surrounding Cards

## Summary

In the About section of `src/App.tsx`, the yellow "2019 Coding Since" stat card container currently uses `items-center text-center`, centering both the number and label horizontally. In contrast, the adjacent stat cards ("25 Public Repos" and "2000+ GitHub Contributions This Year") use left-aligned text within `flex flex-col justify-center`. This creates visual disharmony across the stat card group. We will update the yellow card's classes from `flex flex-col items-center justify-center text-center` to `flex flex-col justify-center`, matching the surrounding cards' alignment and visual balance on desktop and mobile viewports.

## User Story

As a visitor viewing the portfolio on desktop or mobile,
I want the text inside the "2019 Coding Since" stat card to be left-aligned consistently with the adjacent stat cards,
So that all stat cards exhibit visual harmony, balance, and intentional neo-brutalist styling.

## Metadata

| Field | Value |
|---|---|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/App.tsx` |
| GitHub Issue | #28 |

---

## Patterns to Follow

### Stat Cards in About Section
```tsx
// SOURCE: src/App.tsx:167-182
<div className='flex-1 grid grid-cols-2 gap-6 animate-on-scroll w-full'>
  <div className='bg-[#facc15] text-[#121212] brutal-border p-6 aspect-square flex flex-col items-center justify-center text-center'>
    <span className='text-5xl font-bold mb-2'>2019</span>
    <span className='text-xl font-bold uppercase'>Coding Since</span>
  </div>
  <div className='bg-[#ff3e00] text-[#121212] brutal-border p-6 aspect-square flex flex-col justify-center translate-y-8'>
    <span className='text-5xl font-bold mb-2'>25</span>
    <span className='text-xl font-bold uppercase'>Public Repos</span>
  </div>
  <div className='col-span-2 mt-8 bg-[#00e5ff] text-[#121212] brutal-border p-6 flex flex-col justify-center'>
    <span className='text-5xl font-bold mb-2'>2000+</span>
    <span className='text-xl font-bold uppercase'>
      GitHub Contributions This Year
    </span>
  </div>
</div>
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
| `src/App.tsx` | UPDATE | Remove `items-center text-center` from the yellow stat card container so it defaults to left-aligned text like adjacent cards. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update yellow stat card alignment in `src/App.tsx`
- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Locate the yellow card container at line 168:
    ```tsx
    <div className='bg-[#facc15] text-[#121212] brutal-border p-6 aspect-square flex flex-col items-center justify-center text-center'>
      <span className='text-5xl font-bold mb-2'>2019</span>
      <span className='text-xl font-bold uppercase'>Coding Since</span>
    </div>
    ```
  - Update `className` to:
    ```tsx
    <div className='bg-[#facc15] text-[#121212] brutal-border p-6 aspect-square flex flex-col justify-center'>
      <span className='text-5xl font-bold mb-2'>2019</span>
      <span className='text-xl font-bold uppercase'>Coding Since</span>
    </div>
    ```
- **Mirror**: `src/App.tsx:172` (`bg-[#ff3e00] text-[#121212] brutal-border p-6 aspect-square flex flex-col justify-center translate-y-8`)
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

1. Run `npm run lint` and verify 0 errors and 0 warnings.
2. Run `npm run build` and verify TypeScript compilation and Vite production build succeed cleanly.
3. Verify visual alignment and responsive layout:
   - On mobile viewports (e.g. 320px–375px), ensure "2019" and "Coding Since" are left-aligned inside the yellow aspect-square container, matching the adjacent "25 Public Repos" card.
   - On tablet/desktop viewports (>=768px), verify visual harmony across all three stat cards (yellow, orange, and cyan).
   - Ensure text does not clip or overflow card boundaries.

---

## Risks

| Risk | Mitigation |
|---|---|
| Narrow mobile viewport text wrapping on "Coding Since" | The container has `p-6` and `aspect-square`. "Coding Since" wraps cleanly if needed or fits in uppercase without clipping, identical to adjacent card behavior. |

---

## Open Questions

None. Issue #28 and TODO.md:14 explicitly define the desired left-alignment to match surrounding cards.

---

## Acceptance Criteria

- [ ] "2019" and "Coding Since" text inside the yellow stat card are left-aligned to match the other stat cards.
- [ ] Text spacing, padding, and font sizes render cleanly without clipping or misaligning on mobile viewports.
- [ ] Visual harmony across all three stat cards is maintained on both desktop and mobile screens.
- [ ] `npm run lint` and `npm run build` pass with zero errors.
