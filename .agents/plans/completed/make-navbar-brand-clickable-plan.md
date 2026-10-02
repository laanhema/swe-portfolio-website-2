# Plan: Make Navbar Brand Logo Text Clickable to Reload or Scroll to Top

## Summary

Convert the static `laanhema.dev` brand container in `src/features/navigation/Nav.tsx` from a `div` into an interactive anchor (`<a>`) element targeting `#`. The link will retain full neo-brutalist typography, sizing, and the signature `#ff3e00` period accent, while adding responsive hover and focus transitions consistent with the navigation links. When clicked, it will smoothly scroll to the top of the page, close the mobile drawer if open, and update navigation to `#`.

## User Story

As a visitor navigating the portfolio,
I want the "laanhema.dev" brand title in the top navigation bar to be a clickable link,
So that I can quickly return or scroll back to the top of the page from anywhere on the site.

## Metadata

| Field | Value |
|---|---|
| Type | FEATURE / ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/features/navigation/Nav.tsx` |
| GitHub Issue | #29 |

---

## Patterns to Follow

### Existing Navbar Links in `src/features/navigation/Nav.tsx`
```tsx
// SOURCE: src/features/navigation/Nav.tsx:18-24
<a
  href='#work'
  className='hover:text-[#ff3e00] transition-colors relative group'
>
  Work
  <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
</a>
```

### Current Brand Text Container in `src/features/navigation/Nav.tsx`
```tsx
// SOURCE: src/features/navigation/Nav.tsx:12-14
<div className='text-2xl md:text-3xl font-bold uppercase tracking-tighter'>
  laanhema<span className='text-[#ff3e00]'>.</span>dev
</div>
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `src/features/navigation/Nav.tsx` | UPDATE | Change static brand `div` to accessible `<a>` tag with `href="#"`, smooth scroll behavior, menu close handler, and hover/focus styles. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update Brand Text Container to Clickable Anchor in `src/features/navigation/Nav.tsx`

- **File**: `src/features/navigation/Nav.tsx`
- **Action**: UPDATE
- **Implement**: 
  - Change the `div` wrapper for `laanhema.dev` to an `<a>` tag with `href="#"`.
  - Add an accessible `aria-label="laanhema.dev - Back to top"`.
  - Add `onClick` handler that invokes `closeMenu()` and `window.scrollTo({ top: 0, behavior: 'smooth' })`.
  - Apply neo-brutalist styling: `text-2xl md:text-3xl font-bold uppercase tracking-tighter hover:text-[#ff3e00] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff3e00]`.
  - Maintain the orange dot accent `<span className='text-[#ff3e00]'>.</span>`.
- **Mirror**: `src/features/navigation/Nav.tsx:18-39` (navbar anchor patterns)
- **Validate**: `npm run lint && npm run build`

### Task 2: Validate Build and Lint

- **File**: N/A
- **Action**: VALIDATE
- **Implement**: Run ESLint and TypeScript/Vite build to verify there are no compilation or lint errors.
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

1. Run `npm run build` and ensure TypeScript compilation and Vite bundling succeed without errors.
2. Run `npm run lint` and verify no ESLint warnings or errors exist.
3. Start the dev server (`npm run dev`) or preview (`npm run preview`) and inspect `Nav.tsx`:
   - Verify the brand element is an anchor tag (`<a>`) with `href="#"`.
   - Verify the brand element has accessible name / aria-label.
   - Verify typography remains bold uppercase with the orange dot intact.
   - Verify hovering over the brand element activates the hover color transition.
   - Verify clicking the brand link scrolls smoothly to the top and closes the mobile drawer if open.

---

## Risks

| Risk | Mitigation |
|---|---|
| Click default jump behavior vs smooth scrolling | Anchor keeps `href="#"` for standard browser navigation while `onClick` triggers `window.scrollTo({ top: 0, behavior: 'smooth' })` for smooth scroll experience. |
| Mobile menu remains open when brand is clicked | The `onClick` handler calls `closeMenu()` to ensure the mobile menu drawer collapses. |

---

## Acceptance Criteria

- [ ] The "laanhema.dev" brand text in the top navigation bar is wrapped in or converted to an accessible clickable link targeting `#`.
- [ ] Clicking the link smoothly scrolls or navigates to the top of the page.
- [ ] Neo-brutalist styling, typography size, uppercase styling, and orange period accent (`text-[#ff3e00]`) remain visually intact.
- [ ] Hover and focus states feel responsive and consistent with other navbar elements.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` succeeds with 0 errors.
