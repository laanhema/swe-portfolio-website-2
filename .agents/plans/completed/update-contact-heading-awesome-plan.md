# Plan: Update Contact Section Heading to "Let's Build Something Awesome."

## Summary

Update the contact section heading in `src/features/contact/ContactForm.tsx` from "Let's Build Something Epic." to "Let's Build Something Awesome." This fulfills issue #11 and item 10 in `TODO.md` while preserving the uppercase styling, line break `<br/>`, orange accent highlight `<span className="text-[#ff3e00]">Awesome.</span>`, typography scale (`text-5xl md:text-7xl font-bold uppercase mb-12`), and `.animate-on-scroll` class.

## User Story

As a visitor reaching the contact section of the portfolio,
I want the heading to read "Let's Build Something Awesome.",
So that the section title aligns with the owner's updated brand copy and maintains the vibrant orange accent styling.

## Metadata

| Field | Value |
|---|---|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/features/contact/ContactForm.tsx` |
| GitHub Issue | #11 |

---

## Patterns to Follow

### Existing Heading in `src/features/contact/ContactForm.tsx`
```tsx
// SOURCE: src/features/contact/ContactForm.tsx:8-10
<h2 className="text-5xl md:text-7xl font-bold uppercase mb-12 animate-on-scroll">
  Let&apos;s Build <br/> Something <span className="text-[#ff3e00]">Epic.</span>
</h2>
```

### Target Heading
```tsx
<h2 className="text-5xl md:text-7xl font-bold uppercase mb-12 animate-on-scroll">
  Let&apos;s Build <br/> Something <span className="text-[#ff3e00]">Awesome.</span>
</h2>
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
| `src/features/contact/ContactForm.tsx` | UPDATE | Update the heading text replacing "Epic." with "Awesome." while keeping the orange accent span. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update Heading Text in `src/features/contact/ContactForm.tsx`
- **File**: `src/features/contact/ContactForm.tsx`
- **Action**: UPDATE
- **Implement**:
  - In line 9, change `<span className="text-[#ff3e00]">Epic.</span>` to `<span className="text-[#ff3e00]">Awesome.</span>`.
  - Ensure `Let&apos;s Build <br/> Something ` remains intact.
  - Ensure all classes (`text-5xl md:text-7xl font-bold uppercase mb-12 animate-on-scroll`) remain untouched.
- **Mirror**: `src/features/contact/ContactForm.tsx:8-10`
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

1. Run `npm run build` to verify clean TypeScript compilation and bundle creation.
2. Run `npm run lint` to verify zero ESLint errors and warnings.
3. Verify that line 9 in `src/features/contact/ContactForm.tsx` renders `Awesome.` inside the `#ff3e00` span.

---

## Risks

| Risk | Mitigation |
|---|---|
| Broken JSX entity or closing tag | Verify precise replacement of `Epic.` with `Awesome.` within the span. |

---

## Acceptance Criteria

- [ ] Contact section heading text is updated to "Let's Build Something Awesome."
- [ ] Orange accent styling on the final word (`<span className="text-[#ff3e00]">Awesome.</span>`) is maintained.
- [ ] Heading hierarchy, typography scale, and scroll animation classes remain unchanged.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` compiles with 0 errors.
