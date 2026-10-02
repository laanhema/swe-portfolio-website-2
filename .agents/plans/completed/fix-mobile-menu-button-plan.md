# Plan: Fix Mobile View Top Bar Menu Button Functionality

## Summary

Implement the mobile navigation menu drawer in `Nav.tsx`. Add toggle state (`isOpen`) and toggle handlers, apply accessibility attributes (`aria-expanded`, `aria-label`, `aria-controls`), render a responsive dropdown menu drawer beneath the navbar matching the Neo-Brutalist design language (`brutal-border`, high-contrast styling), wire up navigation links (Work, About, Contact), and ensure clicking a link smoothly scrolls to the target section while automatically closing the mobile drawer.

## User Story

As a mobile visitor browsing the portfolio on a phone or small screen,
I want to click the "Menu" button in the top bar to open a navigation drawer with links to Work, About, and Contact,
So that I can easily navigate across different sections of the website.

## Metadata

| Field | Value |
|---|---|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/features/navigation/Nav.tsx` |
| GitHub Issue | #2 |

---

## Patterns to Follow

### Naming
```tsx
// SOURCE: src/features/navigation/Nav.tsx:3
const Nav: React.FC = () => {
```

### Component & Styling
```tsx
// SOURCE: src/features/navigation/Nav.tsx:5, 34-39
<nav className='sticky top-0 z-50 w-full bg-[#f8f9fa] border-b-4 border-[#121212] py-4 px-6 md:px-12 flex justify-between items-center'>
...
<button
  className='md:hidden brutal-border px-4 py-2 font-bold uppercase bg-[#ff3e00] text-white brutal-shadow active:translate-x-1 active:translate-y-1 active:shadow-none transition-all'
  aria-label='Menu'
>
  Menu
</button>
```

### Error Handling
React standard hook & event handling: standard state management with `useState(false)`.

### Tests / Validation
```bash
# SOURCE: package.json:8-9
npm run lint
npm run build
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `src/features/navigation/Nav.tsx` | UPDATE | Add `isOpen` state, toggle button click handler, accessibility attributes, and mobile navigation drawer with auto-closing links. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Add mobile menu toggle state and accessibility attributes to Nav button
- **File**: `src/features/navigation/Nav.tsx`
- **Action**: UPDATE
- **Implement**:
  - Import `useState` from React.
  - Initialize state: `const [isOpen, setIsOpen] = useState(false);`
  - Define `toggleMenu` and `closeMenu` helper callbacks.
  - Update the mobile button:
    - Add `onClick={toggleMenu}`.
    - Set `aria-expanded={isOpen}`.
    - Set `aria-label={isOpen ? 'Close menu' : 'Open menu'}`.
    - Set `aria-controls='mobile-menu'`.
    - Dynamic text: `{isOpen ? 'Close' : 'Menu'}`.
- **Mirror**: `src/features/navigation/Nav.tsx:34-39`
- **Validate**: `npm run lint && npm run build`

### Task 2: Render mobile navigation menu drawer matching Neo-Brutalist design
- **File**: `src/features/navigation/Nav.tsx`
- **Action**: UPDATE
- **Implement**:
  - Adjust container structure in `Nav.tsx` so the root element `<nav>` is sticky top-0, containing the top bar and conditionally rendering the mobile drawer (`id='mobile-menu'`) when `isOpen` is true.
  - Render mobile links for Work (`#work`), About (`#about`), and Contact (`#contact`).
  - Add `onClick={closeMenu}` to each mobile navigation link so navigating automatically closes the menu drawer.
  - Style with Neo-Brutalist design: border-t-4 border-text-primary, bold uppercase typography, hover transition colors to `#ff3e00`.
- **Mirror**: `src/features/navigation/Nav.tsx:11-32`
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

1. Run `npm run build` and ensure TypeScript compilation and Vite packaging succeed with 0 errors.
2. Run `npm run lint` and ensure ESLint reports 0 errors and 0 warnings.
3. Verify in browser / responsive emulator:
   - At desktop viewports (>= 768px / `md` breakpoint), the mobile menu button and mobile drawer are hidden, desktop nav links are visible.
   - At mobile viewports (< 768px), the "Menu" button is visible and desktop nav links are hidden.
   - Clicking "Menu" toggles `aria-expanded="true"` and displays the mobile navigation drawer.
   - The drawer displays Work, About, and Contact links.
   - Clicking any link closes the mobile drawer and navigates to the section.
   - Clicking "Close" collapses the drawer and resets `aria-expanded="false"`.

---

## Risks

| Risk | Mitigation |
|---|---|
| Sticky positioning or layout shifting when mobile drawer opens | Keep `<nav>` sticky with `w-full bg-[#f8f9fa] border-b-4 border-[#121212]`, containing both top bar and the collapsible menu container. |
| Anchor click on mobile doesn't close drawer if default navigation occurs | Attach `onClick={closeMenu}` directly on each `<a>` tag so React handles state update while normal anchor scroll occurs. |

---

## Acceptance Criteria

- [ ] Clicking the "Menu" button toggles the mobile navigation menu open and closed.
- [ ] Navigation links (Work, About, Contact) are visible and functional within the mobile menu.
- [ ] Selecting a navigation link automatically closes the mobile menu and scrolls to the target section.
- [ ] Mobile menu button includes appropriate accessibility attributes (`aria-expanded`, `aria-label`).
- [ ] Type check and build pass (`npm run build`).
- [ ] Lint passes (`npm run lint`).
