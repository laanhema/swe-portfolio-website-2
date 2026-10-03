# Plan: Adjust Letter-Spacing for "Robust" Headline to Fix S and T Kerning

## Summary

Adjust the letter-spacing on the outlined word "Robust" in the hero display headline (`src/App.tsx`) to eliminate visual collision and overlapping stroke edges between the letters "S" and "T". The parent `<h1>` applies `tracking-tighter` (`-0.05em`), which compresses letter spacing. When combined with the hollow outline stroke (`-webkit-text-stroke: 3px` on desktop and `1.5px` on mobile), the rightward top curve of "S" and the leftward top crossbar of "T" sit too close together or collide. We will apply `tracking-normal` (or `letter-spacing: 0 / normal`) specifically to the stroked "Robust" `<span>` (and define it in `.text-stroke-robust` in `src/styles/global.css`) so that "S" and "T" have clear, comfortable kerning across all viewports while preserving the bold brutalist headline aesthetic.

## User Story

As a visitor viewing the portfolio hero section on any device,
I want the letters "S" and "T" in the outlined word "ROBUST" to have clean, readable spacing,
So that the headline typography looks polished, legible, and intentional without awkward glyph collisions.

## Metadata

| Field | Value |
|---|---|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/App.tsx`, `src/styles/global.css` |
| GitHub Issue | #59 |

---

## Patterns to Follow

### Hero Headline Element
```tsx
// SOURCE: src/App.tsx:105-112
<h1 className='text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.85] tracking-tighter mb-10 animate-on-scroll'>
  Building <br />
  <span className='text-transparent text-stroke-robust'>
    Robust
  </span>{' '}
  <br />
  Systems.
</h1>
```

### Component Styling in global.css
```css
// SOURCE: src/styles/global.css:55-63
.text-stroke-robust {
  -webkit-text-stroke: 1.5px var(--color-text-primary);
}

@media (min-width: 768px) {
  .text-stroke-robust {
    -webkit-text-stroke: 3px var(--color-text-primary);
  }
}
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
| `src/styles/global.css` | UPDATE | Add `letter-spacing: normal;` (or explicit 0/normal letter-spacing) to `.text-stroke-robust` so outlined stroked glyphs have sufficient kerning without inheriting `-0.05em` (`tracking-tighter`). |
| `src/App.tsx` | UPDATE | Add `tracking-normal` utility class to the "Robust" `<span>` for explicit utility parity and clarity. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update `.text-stroke-robust` in `src/styles/global.css` and `src/App.tsx`
- **File**: `src/styles/global.css` and `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - In `src/styles/global.css`, add `letter-spacing: normal;` to `.text-stroke-robust` to override the inherited `tracking-tighter` from the parent `<h1>`.
  - In `src/App.tsx`, update `<span className='text-transparent text-stroke-robust'>` to `<span className='text-transparent text-stroke-robust tracking-normal'>`.
- **Mirror**: `src/styles/global.css:55-63`, `src/App.tsx:107-109`
- **Validate**: `npm run build`

### Task 2: Visual and Responsive Verification
- **File**: Browser preview / visual testing
- **Action**: VERIFY
- **Implement**:
  - Test across mobile (<768px, e.g. 375px), tablet (768px), and desktop (1024px, 1280px+).
  - Verify that the gap between the top curve of "S" and the top bar of "T" in "ROBUST" has clean separation and no stroke collision.
  - Verify that the overall headline remains cohesive and visually balanced with "Building" and "Systems.".
- **Validate**: Visual inspection

### Task 3: Lint and Production Build Validation
- **File**: Workspace
- **Action**: VALIDATE
- **Implement**:
  - Run `npm run lint` and verify 0 errors and 0 warnings.
  - Run `npm run build` and verify clean TypeScript type-check and Vite production build.
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

1. Run `npm run build` to confirm TypeScript compilation (`tsc -b`) and Vite production bundle succeed without errors.
2. Run `npm run lint` to confirm ESLint checks pass with 0 errors and 0 warnings.
3. Check hero headline rendering:
   - In mobile view: "Robust" with 1.5px stroke renders "S" and "T" clearly separated.
   - In desktop view: "Robust" with 3px stroke renders "S" and "T" without overlapping borders.
   - Letters in "Robust" remain transparent with dark stroke.

---

## Risks

| Risk | Mitigation |
|---|---|
| Resetting letter-spacing to `normal` might look too loose compared to `tracking-tighter` on "Building" and "Systems." | Because `Robust` has a stroked outline, the stroke adds 1.5px/3px visual expansion around glyph edges, which naturally tightens the optical spacing. Setting `letter-spacing: normal` provides the exact optical balance needed. |

---

## Open Questions

None. The issue description, acceptance criteria, and technical notes are fully specified.

---

## Acceptance Criteria

- [x] Letters "S" and "T" in "Robust" headline have clear, comfortable visual spacing without colliding or overlapping.
- [x] Stroke outline (`text-stroke-robust`) renders cleanly without overlapping stroke edges between "S" and "T".
- [x] Visual weight and brutalist aesthetic of the display headline are preserved across mobile, tablet, and desktop viewports.
- [x] `npm run lint` and `npm run build` pass with 0 errors.
