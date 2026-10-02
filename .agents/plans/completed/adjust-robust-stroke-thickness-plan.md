# Plan: Adjust "Robust" Outline Stroke Thickness on Mobile View

## Summary

Adjust the stroked outline on the word "Robust" in the hero headline (`src/App.tsx`) to be responsive instead of a fixed inline `3px` stroke. Introduce a dedicated CSS component class `.text-stroke-robust` in `src/styles/global.css` that applies a scaled-down 1.5px stroke on mobile screens and a 3px stroke on desktop viewports (768px+). Replace the inline `style={{ WebkitTextStroke: '3px #121212' }}` attribute in `src/App.tsx` with `.text-stroke-robust`, ensuring the outline remains crisp, hollow, and legible while matching surrounding font weight across all screen sizes.

## User Story

As a mobile visitor browsing the portfolio website,
I want the stroked "Robust" text in the hero headline to have a balanced outline stroke thickness,
So that the hollow letters remain crisp and legible without appearing disproportionately thick or heavy compared to the surrounding text.

## Metadata

| Field | Value |
|---|---|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/styles/global.css`, `src/App.tsx` |
| GitHub Issue | #4 |

---

## Patterns to Follow

### Component Styling & Neo-Brutalist Utility Classes
```css
// SOURCE: src/styles/global.css:22-26
@layer components {
  .brutal-border {
    @apply border-4 border-text-primary;
  }
  ...
}
```

### Hero Headline Element
```tsx
// SOURCE: src/App.tsx:68-78
<h1 className='text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.85] tracking-tighter mb-10 animate-on-scroll'>
  Building <br />
  <span
    className='text-transparent'
    style={{ WebkitTextStroke: '3px #121212' }}
  >
    Robust
  </span>{' '}
  <br />
  Systems.
</h1>
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
| `src/styles/global.css` | UPDATE | Add `.text-stroke-robust` class in `@layer components` with responsive `-webkit-text-stroke` (1.5px on mobile, 3px on desktop md: 768px+). |
| `src/App.tsx` | UPDATE | Replace inline `style={{ WebkitTextStroke: '3px #121212' }}` on "Robust" `<span>` with the `text-stroke-robust` CSS class. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Add `.text-stroke-robust` responsive utility in `src/styles/global.css`
- **File**: `src/styles/global.css`
- **Action**: UPDATE
- **Implement**:
  - Add `.text-stroke-robust` to `@layer components`:
    ```css
    .text-stroke-robust {
      -webkit-text-stroke: 1.5px var(--color-text-primary);
    }

    @media (min-width: 768px) {
      .text-stroke-robust {
        -webkit-text-stroke: 3px var(--color-text-primary);
      }
    }
    ```
  - Preserve all existing styles (`.brutal-border`, `.brutal-shadow`, etc.).
- **Mirror**: `src/styles/global.css:22-41`
- **Validate**: `npm run build`

### Task 2: Update "Robust" `<span>` in `src/App.tsx`
- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Locate `<span className='text-transparent' style={{ WebkitTextStroke: '3px #121212' }}>Robust</span>` around line 70-75.
  - Remove the inline `style` prop.
  - Update `className` to `'text-transparent text-stroke-robust'`.
- **Mirror**: `src/App.tsx:70-75`
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

1. Run `npm run build` and ensure TypeScript compilation and Vite bundling complete with 0 errors.
2. Run `npm run lint` and verify ESLint reports 0 errors and 0 warnings.
3. Verify responsive behavior across viewports:
   - On mobile viewports (<768px, e.g., 375px): verify computed `-webkit-text-stroke-width` is `1.5px`, letters in "Robust" are hollow, crisp, and inner bowls are clearly legible.
   - On desktop viewports (>=768px): verify computed `-webkit-text-stroke-width` is `3px`, matching the bold headline aesthetic.
   - Verify text remains transparent with dark primary border stroke color (`#121212`).

---

## Risks

| Risk | Mitigation |
|---|---|
| Inconsistent rendering across browsers for `-webkit-text-stroke` | Use standard vendor-prefixed `-webkit-text-stroke` with fallback color token `var(--color-text-primary)`. |
| Tailwind v4 layer ordering overriding custom classes | Place `.text-stroke-robust` inside `@layer components` alongside existing `.brutal-*` utility classes. |

---

## Open Questions

None. The requirements in Issue #4 and technical notes are explicit and straightforward.

---

## Acceptance Criteria

- [ ] "Robust" outline stroke width is scaled down for mobile screens (1.5px on mobile vs 3px on desktop).
- [ ] Outline remains crisp, hollow, and legible across all screen sizes.
- [ ] Visual weight of "Robust" matches the surrounding headline font weight.
- [ ] Inline style is removed from `src/App.tsx` and moved to a responsive CSS class in `src/styles/global.css`.
- [ ] `npm run build` and `npm run lint` pass with 0 errors.
