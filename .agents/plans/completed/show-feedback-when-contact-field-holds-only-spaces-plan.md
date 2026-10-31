# Plan: Show Feedback When Contact Field Holds Only Spaces

## Summary

When a visitor enters only whitespace in the Name or Message fields of the contact form, HTML5 `required` constraint validation passes because the field values are non-empty strings. In `src/features/contact/ContactForm.tsx`, `handleSubmit` then trims each field, finds `trimmedName` or `trimmedMessage` empty, and silently returns without providing any feedback to the user. We will update `handleSubmit` to validate trimmed values: when Name or Message is whitespace-only, the component will set a custom validation error (`setCustomValidity('Please fill out this field.')`) on the offending control (`HTMLInputElement` / `HTMLTextAreaElement`, safely narrowed with `instanceof`) and report the error with `reportValidity()`. Custom validity will be cleared on input via `onInput` listeners on both fields (and cleared before evaluation on submit) so typing immediately restores the field's valid state. We will also update `.claude/skills/verify/scripts/ax.sh` to test whitespace-only Name and Message submissions alongside empty and valid submissions, and update the verification feature documentation.

## User Story

As a portfolio visitor,
I want the contact form to display a validation message when I submit only spaces in the Name or Message fields,
So that I understand why my message was not submitted and what needs correction.

## Metadata

| Field | Value |
|-------|-------|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/features/contact/ContactForm.tsx`, `.claude/skills/verify/scripts/ax.sh`, `.claude/skills/verify/features/contact.md` |
| GitHub Issue | #111 |
| PRD Phase | N/A |
| Prototype Patch | N/A |

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/features/contact/ContactForm.tsx` | UPDATE | Set custom validity on whitespace-only fields, trigger `reportValidity()`, and clear custom validity on `onInput`. |
| `.claude/skills/verify/scripts/ax.sh` | UPDATE | Extend `submit` command to test whitespace-only Name and Message field submissions. |
| `.claude/skills/verify/features/contact.md` | UPDATE | Document whitespace validation assertions in `ax.sh submit` verification recipe. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Add custom validity and input clearing to ContactForm

- **File**: `src/features/contact/ContactForm.tsx`
- **Action**: UPDATE
- **Implement**:
  1. In `handleSubmit(e: React.SyntheticEvent<HTMLFormElement>)`:
     - Access the form element: `const form = e.currentTarget;`
     - Access `nameInput` via `form.elements.namedItem('name')` and `messageInput` via `form.elements.namedItem('message')`.
     - Clear existing custom validity on both elements if they match `instanceof HTMLInputElement` / `instanceof HTMLTextAreaElement` by calling `.setCustomValidity('')`.
     - After extracting and trimming `name`, `email`, and `message`, check if `trimmedName` or `trimmedMessage` is empty while `name` or `message` is non-empty.
     - If `!trimmedName` and `nameInput instanceof HTMLInputElement`, set `nameInput.setCustomValidity('Please fill out this field.')`.
     - If `!trimmedMessage` and `messageInput instanceof HTMLTextAreaElement`, set `messageInput.setCustomValidity('Please fill out this field.')`.
     - If `!trimmedName || !trimmedMessage || !trimmedEmail`:
       - Call `form.reportValidity();` (which focuses and displays the validation bubble on the first invalid field).
       - Return early to prevent mailto dispatch.
  2. On `<input id="name" ...>`:
     - Add `onInput={(e) => { e.currentTarget.setCustomValidity(''); }}` to clear custom error when user edits the field.
  3. On `<textarea id="message" ...>`:
     - Add `onInput={(e) => { e.currentTarget.setCustomValidity(''); }}` to clear custom error when user edits the field.
  4. Ensure zero type assertions (`as Type`) are used (strict ESLint compliance).
  5. Retain all existing Tailwind classes and `onPointerDown={playPress}`.
- **Mirror**: `src/features/contact/ContactForm.tsx:6-28`
- **Validate**: `npm run check`

### Task 2: Extend ax.sh submit to check whitespace-only submissions

- **File**: `.claude/skills/verify/scripts/ax.sh`
- **Action**: UPDATE
- **Implement**:
  1. In `submit)` block (lines 102-130), after the `empty submit` check and before the valid submit check:
     - Test whitespace Name: fill `NAME` with `'   '`, `EMAIL` with `'jane@example.com'`, `MESSAGE` with `'Hello & welcome?'`. Click `SEND MESSAGE`.
     - Read the form state: assert no navigation occurred and `invalid` contains `"name"`.
     - Test whitespace Message: fill `NAME` with `'Jane Smith'`, `EMAIL` with `'jane@example.com'`, `MESSAGE` with `'   '`. Click `SEND MESSAGE`.
     - Read the form state: assert no navigation occurred and `invalid` contains `"message"`.
     - Continue with the valid submit check: fill `MESSAGE` with `'Hello & welcome?'`. Click `SEND MESSAGE`. Assert navigation to prefilled `mailto:` URL.
  2. Print `spaces submit: name blocked=ok message blocked=ok`.
  3. Ensure exit code is 1 if any check fails.
- **Mirror**: `.claude/skills/verify/scripts/ax.sh:112-130`
- **Validate**: `bash -n .claude/skills/verify/scripts/ax.sh`

### Task 3: Update contact verification feature documentation

- **File**: `.claude/skills/verify/features/contact.md`
- **Action**: UPDATE
- **Implement**:
  1. In section `## Driving it with ax.sh` under `- **Submit.**`:
     - Update the description to reflect that `ax.sh submit` tests empty submission, whitespace-only Name submission, whitespace-only Message submission, and valid submission.
- **Mirror**: `.claude/skills/verify/features/contact.md:25`
- **Validate**: `git diff .claude/skills/verify/features/contact.md`

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint

# Design & Agents Checks
npm run check:design && npm run check:agents

# Full gate check
npm run check

# Reproduction command (harness submit check):
# Red before Task 1 (fails on whitespace test), Green after Task 1 & Task 2
.claude/skills/verify/scripts/verify-server.sh start && .claude/skills/verify/scripts/ax.sh submit
```

## End-to-End Verification

1. **Verify Server & Browser Check**:
   - Start verify server: `.claude/skills/verify/scripts/verify-server.sh start`
   - Run submission probe: `.claude/skills/verify/scripts/ax.sh submit`
   - Confirm output verifies:
     - `empty submit: navigations=0 invalid=name,email,message ok`
     - `spaces submit: name blocked=ok message blocked=ok`
     - `valid submit: mailto:lahmakkonen@gmail.com?subject=Contact%20from%20Jane%20Smith&body=... ok`
   - Run post-page submit check: `.claude/skills/verify/scripts/ax.sh submit /blog/tralla`
   - Stop verify server: `.claude/skills/verify/scripts/verify-server.sh stop`

2. **Quality & Formatting Checks**:
   - Run `npm run check` to verify ESLint, TypeScript types, design tokens, and build output.

## Risks

| Risk | Mitigation | In-Scope / Out-of-Scope |
|------|------------|-------------------------|
| Custom validity error remains stuck after user types valid input | Clear custom validity in `onInput` handlers on Name and Message elements, and at start of `handleSubmit` | In-Scope |
| Strict type assertions ESLint rule triggers on form element casting | Use `instanceof HTMLInputElement` and `instanceof HTMLTextAreaElement` runtime narrowing without `as` | In-Scope |
| Email field with whitespace | `type="email"` automatically strips whitespace per HTML5 specification, failing native `required` | In-Scope (verified) |

## Acceptance Criteria

- [ ] With Name set to only spaces and the other fields valid, `SEND MESSAGE` does not navigate and shows a validation message on the Name field.
- [ ] With Message set to only spaces and the other fields valid, `SEND MESSAGE` does not navigate and shows a validation message on the Message field.
- [ ] After the field is corrected, a valid submit still opens the same prefilled `mailto:` URL, and `ax.sh submit` passes.
- [ ] `npm run check` passes.
