# Plan: Fix "Selected Works" Heading Alignment on Mobile View

## Summary

Update the "Selected Works" section heading container in `src/App.tsx` so that its heading and subtitle text are left-aligned on mobile viewports while preserving the clean side-by-side alignment on desktop viewports. Currently, the heading container uses `items-end` without a breakpoint prefix (`className='flex flex-col md:flex-row justify-between items-end mb-16 animate-on-scroll'`), causing the entire column to right-align on mobile screens. By updating the alignment classes to `items-start md:items-end` and introducing appropriate spacing (e.g. `gap-4 md:gap-0`), the section title and description will be consistently left-aligned on mobile—matching earlier sections like "The Dev Behind The Code"—while retaining the expected bottom-aligned spread layout on larger displays.

## User Story

As a visitor viewing the portfolio on a mobile device,
I want the "Selected Works" section heading to be left-aligned with its subtitle neatly underneath,
So that the visual rhythm and section header typography remain consistent across the entire portfolio.

## Metadata

| Field | Value |
|---|---|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/App.tsx` |
| GitHub Issue | #8 |

---

## Patterns to Follow

### Showcase Section Header in `src/App.tsx`
```tsx
// SOURCE: src/App.tsx:174-184
<div className='max-w-6xl mx-auto'>
  <div className='flex flex-col md:flex-row justify-between items-end mb-16 animate-on-scroll'>
    <h2 className='text-6xl md:text-8xl font-bold uppercase tracking-tighter'>
      Selected <br /> <span className='text-[#ff3e00]'>Works.</span>
    </h2>
    <p className='max-w-sm text-xl font-bold pb-4'>
      A curated selection of my recent open-source and commercial
      projects.
    </p>
  </div>
```

### Preceding Section Header Pattern in `src/App.tsx`
```tsx
// SOURCE: src/App.tsx:140-152
<div className='flex-1 animate-on-scroll'>
  <h2 className='text-5xl md:text-7xl font-bold uppercase mb-8'>
    The <span className='text-[#00e5ff]'>Dev</span> <br /> Behind{' '}
    <br /> The Code.
  </h2>
  <p className='text-xl leading-relaxed font-medium'>
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
| `src/App.tsx` | UPDATE | Change section heading container alignment from `items-end` to `items-start md:items-end` and adjust gap/spacing for clean mobile stacking. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update "Selected Works" Heading Container Alignment in `src/App.tsx`
- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Locate the showcase section heading container (around line 175).
  - Update `className='flex flex-col md:flex-row justify-between items-end mb-16 animate-on-scroll'`
  - to `className='flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0 mb-16 animate-on-scroll'`.
  - Ensure the `<h2>` and `<p>` tags render cleanly on both mobile and desktop viewports with no unwanted alignment side-effects.
- **Mirror**: `src/App.tsx:174-184`
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

1. Run `npm run build` to verify clean compilation with TypeScript and Vite.
2. Run `npm run lint` to ensure ESLint rules pass without warnings or errors.
3. Review responsive layout styling to verify `items-start` applies on mobile (< 768px) and `md:items-end` applies on desktop (>= 768px).

---

## Risks

| Risk | Mitigation |
|---|---|
| Subtitle spacing looks awkward or misaligned on mobile | Include `gap-4 md:gap-0` so there is clean, natural breathing room between `h2` and `p` on mobile while keeping desktop spacing untouched. |

---

## Acceptance Criteria

- [ ] "Selected Works" heading is left-aligned on mobile screens, matching preceding headings.
- [ ] Desktop alignment continues to display cleanly with heading on the left and subtitle on the right.
- [ ] Subtitle text aligns properly beneath the heading on mobile without awkward gaps.
- [ ] Type check passes (`npm run build`).
- [ ] Lint check passes (`npm run lint`).
