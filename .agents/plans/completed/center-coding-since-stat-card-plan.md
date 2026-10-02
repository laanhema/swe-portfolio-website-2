# Plan: Center "2019 Coding Since" Stat Card Content on Mobile View

## Summary

Update the flexbox alignment of the yellow "2019 Coding Since" metric stat card in the About section of `src/App.tsx`. Currently, the card container uses `flex flex-col justify-center`, which centers content vertically but leaves horizontal alignment as default left-aligned (`items-stretch` / `text-left`), creating visually unbalanced spacing inside the aspect-square card on mobile viewports. Adding `items-center text-center` ensures both the "2019" year number and "Coding Since" label are centered horizontally and vertically inside the bounding box, satisfying mobile responsiveness and maintaining harmony with adjacent stat cards.

## User Story

As a visitor viewing the portfolio on a mobile device,
I want the "2019 Coding Since" metric card text to be centered both horizontally and vertically within its yellow bounding box,
So that the card layout appears balanced, intentional, and aesthetically consistent with the site's neo-brutalist design.

## Metadata

| Field | Value |
|---|---|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/App.tsx` |
| GitHub Issue | #5 |

---

## Patterns to Follow

### Stat Cards in About Section
```tsx
// SOURCE: src/App.tsx:153-168
<div className='flex-1 grid grid-cols-2 gap-6 animate-on-scroll w-full'>
  <div className='bg-[#facc15] text-[#121212] brutal-border p-6 aspect-square flex flex-col justify-center'>
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
| `src/App.tsx` | UPDATE | Add `items-center text-center` to the yellow "2019 Coding Since" card container class list. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update alignment classes on yellow stat card in `src/App.tsx`
- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Locate the yellow stat card container (`bg-[#facc15]`) at line 154:
    ```tsx
    <div className='bg-[#facc15] text-[#121212] brutal-border p-6 aspect-square flex flex-col justify-center'>
      <span className='text-5xl font-bold mb-2'>2019</span>
      <span className='text-xl font-bold uppercase'>Coding Since</span>
    </div>
    ```
  - Update `className` to:
    ```tsx
    <div className='bg-[#facc15] text-[#121212] brutal-border p-6 aspect-square flex flex-col items-center justify-center text-center'>
      <span className='text-5xl font-bold mb-2'>2019</span>
      <span className='text-xl font-bold uppercase'>Coding Since</span>
    </div>
    ```
- **Mirror**: `src/App.tsx:153-168`
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

1. Run `npm run build` and verify TypeScript compilation and Vite bundling succeed with 0 errors.
2. Run `npm run lint` and verify ESLint reports 0 errors and 0 warnings.
3. Check responsive layout and element alignment:
   - On mobile viewports (<768px, e.g., 375px), ensure "2019" and "Coding Since" are centered horizontally and vertically inside the yellow aspect-square box.
   - On desktop viewports (>=768px), ensure the card remains centered and harmonious with the adjacent orange and cyan cards.
   - Verify that spacing and padding inside the card remain visually balanced without clipping or overflowing.

---

## Risks

| Risk | Mitigation |
|---|---|
| Layout shift or disharmony with adjacent cards | The card's outer dimensions are fixed by `aspect-square` within the CSS grid; centering only affects internal content alignment. |

---

## Open Questions

None. PRD line 216 and Issue #5 clearly specify centered alignment on all devices for the yellow card.

---

## Acceptance Criteria

- [ ] "2019" and "Coding Since" text are properly centered inside the yellow box on mobile view.
- [ ] Spacing and padding remain visually balanced inside the aspect-square card.
- [ ] Card layout remains harmonious with adjacent stat cards ("25 Public Repos" and contributions).
- [ ] `npm run build` and `npm run lint` pass with 0 errors.
