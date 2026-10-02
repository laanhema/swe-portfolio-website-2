# Plan: Fix Email Link Overflow and Stack Mail Icon on Mobile View

## Summary

Resolve email address link overflow and awkward line wrapping on mobile viewports within `src/features/contact/ContactForm.tsx`. Update the email link container from a fixed horizontal inline-flex layout (`inline-flex items-center gap-3 text-2xl ...`) to a responsive layout (`inline-flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-lg sm:text-2xl ...`). This places the `MailIcon` glyph vertically above the email address on mobile viewports, reduces the mobile font size from `text-2xl` to `text-lg`, and preserves the original inline horizontal layout and `text-2xl` sizing on desktop viewports (`sm:` breakpoint and above).

## User Story

As a mobile visitor viewing the portfolio contact section,
I want the email link to stack the mail icon above the address and use an appropriately scaled font size,
So that the email address is clean, readable, and does not truncate or overflow on narrow screens.

## Metadata

| Field | Value |
|---|---|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/features/contact/ContactForm.tsx` |
| GitHub Issue | #10 |

---

## Patterns to Follow

### Existing Email Link in `src/features/contact/ContactForm.tsx`
```tsx
// SOURCE: src/features/contact/ContactForm.tsx:18-24
<a 
  href="mailto:lahmakkonen@gmail.com" 
  className="inline-flex items-center gap-3 text-2xl font-bold uppercase break-all hover:text-[#ff3e00] transition-colors"
>
  <MailIcon className="w-8 h-8" />
  lahmakkonen@gmail.com
</a>
```

### Target Responsive Pattern
```tsx
<a 
  href="mailto:lahmakkonen@gmail.com" 
  className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-bold uppercase break-all hover:text-[#ff3e00] transition-colors"
>
  <MailIcon className="w-8 h-8 shrink-0" />
  lahmakkonen@gmail.com
</a>
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
| `src/features/contact/ContactForm.tsx` | UPDATE | Apply responsive stacking, font sizing, and flex alignment to the email anchor link. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update Email Link Classes in `src/features/contact/ContactForm.tsx`
- **File**: `src/features/contact/ContactForm.tsx`
- **Action**: UPDATE
- **Implement**:
  - Locate the `<a>` tag with `href="mailto:lahmakkonen@gmail.com"` around line 18.
  - Update `className` to:
    ```tsx
    inline-flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-bold uppercase break-all hover:text-[#ff3e00] transition-colors
    ```
  - Ensure `MailIcon` has `w-8 h-8 shrink-0` to maintain crisp icon sizing.
  - Maintain the existing `href="mailto:lahmakkonen@gmail.com"` and inner address text.
- **Mirror**: `src/features/contact/ContactForm.tsx:18-24`
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

1. Run `npm run build` to verify clean TypeScript compilation and Vite bundling.
2. Run `npm run lint` to verify zero ESLint errors or warnings.
3. Verify that on mobile viewports (< 640px):
   - Mail icon glyph stacks above the address `lahmakkonen@gmail.com`.
   - Font size uses `text-lg`, avoiding horizontal truncation.
4. Verify that on desktop viewports (>= 640px):
   - Mail icon and address remain inline horizontally with `text-2xl` font size.
   - Hover transition and mailto protocol remain functional.

---

## Risks

| Risk | Mitigation |
|---|---|
| Text overflow on ultra-narrow viewports (e.g. 320px) | Retain `break-all` on the anchor link and drop mobile text size to `text-lg`. |
| Icon squishing when wrapping | Add `shrink-0` to `MailIcon`. |

---

## Acceptance Criteria

- [ ] Mail icon stacks vertically above the email address on mobile screens, and stays inline on desktop screens.
- [ ] Email address text size is reduced on mobile (`text-lg` on mobile, `text-2xl` on desktop) to prevent truncation.
- [ ] Email link remains fully interactive with valid `mailto:` protocol and hover effects.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` compiles with 0 errors.
