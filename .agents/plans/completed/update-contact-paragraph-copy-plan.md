# Plan: Update Contact Section Introductory Paragraph Copy

## Summary

Update the introductory paragraph copy in the contact section (`src/features/contact/ContactForm.tsx`) to state availability for new job offers instead of general opportunities and freelance projects. This satisfies issue #12 and item 11 in `TODO.md`. The text is updated from `"I'm currently open to new opportunities, freelance projects, and open source collaborations. Drop a message if you want to chat."` to `"I'm currently open to new job offers! Drop a message and lets chat about it."`, retaining all styling (`text-xl font-bold mb-8`) and JSX entity encoding (`I&apos;m`).

## User Story

As a hiring manager or recruiter visiting the contact section,
I want the introductory paragraph to explicitly state availability for new job offers,
So that I know Lauri is actively open to full-time job offers and am encouraged to reach out.

## Metadata

| Field | Value |
|---|---|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/features/contact/ContactForm.tsx` |
| GitHub Issue | #12 |

---

## Patterns to Follow

### Existing Paragraph in `src/features/contact/ContactForm.tsx`
```tsx
// SOURCE: src/features/contact/ContactForm.tsx:14-16
<p className="text-xl font-bold mb-8">
  I&apos;m currently open to new opportunities, freelance projects, and open source collaborations. Drop a message if you want to chat.
</p>
```

### Target Paragraph
```tsx
<p className="text-xl font-bold mb-8">
  I&apos;m currently open to new job offers! Drop a message and lets chat about it.
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
| `src/features/contact/ContactForm.tsx` | UPDATE | Update the paragraph copy next to the email contact area to state availability for new job offers. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update Paragraph Copy in `src/features/contact/ContactForm.tsx`
- **File**: `src/features/contact/ContactForm.tsx`
- **Action**: UPDATE
- **Implement**:
  - In line 15, replace `I&apos;m currently open to new opportunities, freelance projects, and open source collaborations. Drop a message if you want to chat.` with `I&apos;m currently open to new job offers! Drop a message and lets chat about it.`.
  - Maintain the enclosing `<p className="text-xl font-bold mb-8">` element and surrounding markup.
- **Mirror**: `src/features/contact/ContactForm.tsx:14-16`
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
3. Verify that `src/features/contact/ContactForm.tsx` contains the exact copy: `I&apos;m currently open to new job offers! Drop a message and lets chat about it.` with className `text-xl font-bold mb-8`.

---

## Risks

| Risk | Mitigation |
|---|---|
| Unescaped single quote in JSX causing lint/parse error | Use `I&apos;m` to properly escape the apostrophe in JSX conforming to ESLint `react/no-unescaped-entities`. |

---

## Open Questions

None. The issue description and `TODO.md` provide the exact target text and constraints.

---

## Acceptance Criteria

- [ ] Contact paragraph text is changed to "I'm currently open to new job offers! Drop a message and lets chat about it."
- [ ] Text styling, font weight, and spacing remain consistent with the design system (`text-xl font-bold mb-8`).
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` compiles with 0 errors.
