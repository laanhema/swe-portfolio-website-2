# Plan: Make the Contact Form Open a Prefilled Email on Submit

## Summary

This plan addresses finding X1 from the React/TypeScript code review (GitHub issue #99, TODO-51). Currently, `src/features/contact/ContactForm.tsx` has a form submit handler that only calls `e.preventDefault()`, leaving "Send Message" as a no-op that appears broken to visitors. Because real serverless form dispatch is deferred to post-MVP (per `AGENTS.md`), the form will construct a prefilled `mailto:` link using `new FormData(e.currentTarget)` and navigate to it via `window.location.href`. The inputs (`name`, `email`, and `message`) will receive `name`, `autoComplete`, and `required` attributes so native browser validation prevents empty submissions, while keeping the button's exact class string and `playPress` animation intact.

## User Story

As a portfolio visitor,
I want submitting the contact form to open my email client with my name, email, and message prefilled,
So that I can seamlessly send an email to Lauri without copying and pasting my inputs.

## Metadata

| Field | Value |
|-------|-------|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/features/contact/ContactForm.tsx` |
| GitHub Issue | #99 |
| PRD Phase | N/A |
| Prototype Patch | N/A |

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/features/contact/ContactForm.tsx` | UPDATE | Add `name`, `autoComplete`, and `required` attributes to inputs and textarea; implement `onSubmit` handler to open prefilled `mailto:` link. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Add form attributes and implement prefilled mailto submit handler

- **File**: `src/features/contact/ContactForm.tsx`
- **Action**: UPDATE
- **Implement**:
  1. Add `name="name"`, `autoComplete="name"`, and `required` to the Name `<input>`.
  2. Add `name="email"`, `autoComplete="email"`, and `required` to the Email `<input>`.
  3. Add `name="message"`, `autoComplete="off"`, and `required` to the Message `<textarea>`.
  4. Implement `handleSubmit` on `<form onSubmit={handleSubmit}>`:
     - Call `e.preventDefault()`.
     - Extract values via `const formData = new FormData(e.currentTarget);`.
     - Read and trim `name`, `email`, and `message`.
     - Validate presence: if any field is empty, return early.
     - Build subject line: `encodeURIComponent(`Contact from ${name}`)`.
     - Build body: `encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)`.
     - Set `window.location.href = `mailto:lahmakkonen@gmail.com?subject=${subject}&body=${body}`;`.
  5. Preserve the button's exact class string, `type="submit"`, and `onPointerDown={playPress}`.
- **Mirror**: `src/features/contact/ContactForm.tsx:19-25`
- **Validate**: `npm run check`

---

## Validation

```bash
# Type check, lint, design-system checks, and build
npm run check
```

## End-to-End Verification

1. **Static Validation**:
   - Run `npm run check` to verify ESLint, design-system class strings, AGENTS.md integrity, and Vite build pass with 0 errors.
2. **Form Input Attributes Inspection**:
   - Verify `name`, `email`, and `message` fields have their respective `name`, `autoComplete`, and `required` attributes in the rendered DOM.
3. **Empty Submission & Validation Prevention**:
   - In a browser session, leave one or more fields blank and click "Send Message".
   - Verify browser validation triggers on the empty field and `window.location.href` is not set to `mailto:`.
4. **Valid Submission & Mailto Generation**:
   - Fill in Name: "Jane Doe", Email: "jane@example.com", Message: "Hello world".
   - Submit the form.
   - Verify `window.location.href` is updated to `mailto:lahmakkonen@gmail.com?subject=Contact%20from%20Jane%20Doe&body=Name%3A%20Jane%20Doe%0AEmail%3A%20jane%40example.com%0A%0AMessage%3A%0AHello%20world`.
5. **Button Interaction**:
   - Verify the button maintains `cursor: pointer` styling and the `playPress` pointerdown animation continues to trigger properly.

## Acceptance Criteria

- [ ] Submitting the form opens the visitor's mail client with a new message to the site's contact address (`lahmakkonen@gmail.com`).
- [ ] The name, email, and message from the form are in the subject and body, URL-encoded.
- [ ] Name, email, and message are required; submitting with one empty shows the browser's validation message and opens nothing.
- [ ] The inputs have `name` and `autocomplete` attributes.
- [ ] `npm run check` passes, and the button's press animation still plays.
