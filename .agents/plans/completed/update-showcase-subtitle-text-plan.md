# Plan: Update Showcase Section Subtitle Text

## Summary

Update the showcase section subtitle in `src/App.tsx` from "A curated selection of my recent open-source and commercial projects." to the more concise, refined copy "A curated selection of my recent projects." This directly fulfills issue #9 and item 8 in `TODO.md` while maintaining all existing font sizing (`text-xl font-bold pb-4 max-w-sm`), neo-brutalist typography, and responsive layout styling.

## User Story

As a visitor exploring the portfolio's project showcase,
I want the section subtitle to read "A curated selection of my recent projects.",
So that the description is concise, direct, and matches the owner's updated brand tone.

## Metadata

| Field | Value |
|---|---|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/App.tsx` |
| GitHub Issue | #9 |

---

## Patterns to Follow

### Showcase Section Subtitle in `src/App.tsx`
```tsx
// SOURCE: src/App.tsx:179-182
<p className='max-w-sm text-xl font-bold pb-4'>
  A curated selection of my recent open-source and commercial
  projects.
</p>
```

### Target Pattern
```tsx
<p className='max-w-sm text-xl font-bold pb-4'>
  A curated selection of my recent projects.
</p>
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
| `src/App.tsx` | UPDATE | Update the subtitle copy inside the `<p>` element of the showcase section (`#work`). |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update Showcase Subtitle String in `src/App.tsx`
- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Locate the subtitle `<p>` element in `#work` section around line 179.
  - Update the inner text from:
    ```tsx
    A curated selection of my recent open-source and commercial
    projects.
    ```
    to:
    ```tsx
    A curated selection of my recent projects.
    ```
  - Keep classes `className='max-w-sm text-xl font-bold pb-4'` unchanged.
- **Mirror**: `src/App.tsx:179-182`
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
2. Run `npm run lint` to ensure ESLint passes with 0 errors and 0 warnings.
3. Confirm `#work` section subtitle text renders "A curated selection of my recent projects." with existing styling intact.

---

## Risks

| Risk | Mitigation |
|---|---|
| Accidental whitespace/layout changes | Keep exact class attributes and structure, altering only the text node. |

---

## Acceptance Criteria

- [ ] Subtitle text in `#work` section is updated to "A curated selection of my recent projects."
- [ ] Font size, boldness, and responsive styling are preserved.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` compiles with 0 errors.
