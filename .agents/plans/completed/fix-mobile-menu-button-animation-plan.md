# Plan: Fix Intermittent Failure of Mobile Navbar Menu Button Click Animation

## Summary

On mobile viewports (e.g. 375px wide), tapping the sticky navbar "Menu" button occasionally fails to execute the visual press/click animation (`active:translate-x-1 active:translate-y-1 active:shadow-none transition-all`), especially after scrolling down the page and back up to the top. While the drawer opens/closes, the tactile button press animation is skipped or visually suppressed. This occurs because mobile WebKit/Blink browsers retain sticky `:hover`/`:focus` states after touch-scroll gestures, touch-scroll momentum suppresses `:active` pseudo-class matching, 300ms touch delay / transition timing on `transition-all` delays transformation frames, and React's text node update (`'Menu'` -> `'Close'`) on `onClick` interrupts the CSS transition before paint. The planned fix updates `src/features/navigation/Nav.tsx` (and `src/styles/global.css` if necessary) by applying `touch-action: manipulation` to prevent touch gesture delays, explicitly handling active press feedback and resetting stuck focus/hover states on touch/click, ensuring the brutalist press animation (`active:translate-x-1 active:translate-y-1 active:shadow-none`) reliably triggers on every tap regardless of prior scroll operations, while preserving drawer toggling and accessibility attributes (`aria-expanded`).

## User Story

As a mobile site visitor,
I want the navbar menu button to reliably show its tactile press animation whenever I tap it,
So that I receive clear visual feedback that my tap interaction was registered, even after scrolling through the page.

## Metadata

| Field | Value |
|-------|-------|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/features/navigation/Nav.tsx`, `src/styles/global.css` |
| GitHub Issue | #71 |
| PRD Phase | N/A |

---

## Environment Findings

| Probe | Result |
|-------|--------|
| Baseline `npm run lint` | Passes cleanly (0 errors, 0 warnings) |
| Baseline `npm run build` | Passes cleanly (`tsc -b && vite build`) |
| Sticky nav layout | `sticky top-0 z-50 w-full bg-[#f8f9fa] border-b-4 border-[#121212]` (`src/features/navigation/Nav.tsx:40`) |
| Current Menu Button styling | `className='md:hidden brutal-border px-4 py-2 font-bold uppercase bg-[#ff3e00] text-white brutal-shadow active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer'` (`src/features/navigation/Nav.tsx:87-95`) |
| Global `.brutal-shadow` active styling | `transition: transform 0.1s ease, box-shadow 0.1s ease;` and `.brutal-shadow:active { box-shadow: 0px 0px 0px 0px #121212; transform: translate(6px, 6px); }` (`src/styles/global.css:48-56`) |
| Test runner | None configured in `package.json` (`dev`, `build`, `lint`, `preview`). Verification is browser-driven. |

---

## Patterns to Follow

### Mobile Menu Button in Nav.tsx
```tsx
// SOURCE: src/features/navigation/Nav.tsx:87-95
<button
  onClick={toggleMenu}
  className='md:hidden brutal-border px-4 py-2 font-bold uppercase bg-[#ff3e00] text-white brutal-shadow active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer'
  aria-label={isOpen ? 'Close menu' : 'Open menu'}
  aria-expanded={isOpen}
  aria-controls='mobile-menu'
>
  {isOpen ? 'Close' : 'Menu'}
</button>
```

### Brutalist Active Shadow Utility in global.css
```css
/* SOURCE: src/styles/global.css:48-56 */
.brutal-shadow {
  box-shadow: var(--shadow-brutal);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.brutal-shadow:active {
  box-shadow: 0px 0px 0px 0px #121212;
  transform: translate(6px, 6px);
}
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/features/navigation/Nav.tsx` | UPDATE | Add `touch-action: manipulation`, refine active/press styling, and ensure touch/click interactions blur focus or clear sticky states so the click animation triggers reliably on every tap. |
| `src/styles/global.css` | UPDATE | (Optional/if needed) Refine brutal shadow active utility or touch interaction classes to ensure reliable press animation on touch devices. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Refine Mobile Navbar Menu Button Touch & Active Press Animation in `Nav.tsx`

- **File**: [src/features/navigation/Nav.tsx](file:///home/lauri/github/swe-portfolio-website-2/src/features/navigation/Nav.tsx)
- **Action**: UPDATE
- **Implement**:
  1. Add `touch-action-manipulation` (or `[touch-action:manipulation]`) to the menu `<button>` element to eliminate mobile browser touch gesture delays.
  2. Ensure the active animation uses fast, predictable transitions (`duration-75` or `transition: transform 0.1s ease, box-shadow 0.1s ease`) and aligns Tailwind active utilities (`active:translate-x-1 active:translate-y-1 active:shadow-none` or `.brutal-shadow:active`) so transform offsets and shadow collapse execute cleanly on touch tap.
  3. Handle button focus/blur during touch/click interaction (e.g. calling `(e.currentTarget as HTMLElement).blur()` or managing touch start/end events) to prevent sticky `:hover`/`:focus` states from suppressing `:active` state visual feedback after scrolling.
  4. Preserve all accessibility attributes (`aria-expanded`, `aria-label`, `aria-controls`) and drawer toggling functionality (`isOpen` state and `flushSync` drawer closure).
- **Mirror**: `src/features/navigation/Nav.tsx:87-95`
- **Validate**: `npm run lint && npm run build`

---

## Validation

```bash
# Type check and Production Build
npm run build

# Code formatting and Linting
npm run lint
```

---

## End-to-End Verification

1. **Mobile Menu Button Press Animation Consistency**:
   - Run `npm run preview` to launch local production server.
   - Open browser at mobile viewport width (e.g. 375px wide).
   - Scroll down the page past Hero and About sections to the bottom.
   - Scroll back up to the very top of the page.
   - Tap the "Menu" button.
   - Verify that:
     - The button immediately performs its tactile press animation (shifts translation down-right and collapses shadow).
     - The mobile menu drawer opens reliably.
     - `aria-expanded` updates to `true`.
   - Tap "Close" button.
   - Verify the press animation runs again, drawer closes, and `aria-expanded` updates to `false`.
   - Repeat the scroll-down, scroll-up, tap cycle multiple times (5+ times) to confirm 100% animation reliability with no missing frames or stuck states.

2. **Lint & Build Verification**:
   - Run `npm run lint` and verify 0 errors.
   - Run `npm run build` and verify successful TypeScript compilation and Vite bundle creation.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Calling `e.currentTarget.blur()` on click might disrupt keyboard focus navigation for screen reader / keyboard users. | Only trigger blur on mouse/touch pointer events or reset focus via CSS `@media (hover: hover)` / touch event handlers without removing keyboard focus indicator styling (`focus-visible:outline...`). |
| Overriding `:active` CSS transition with JavaScript event state could introduce redundant re-renders. | Rely primarily on CSS `touch-action: manipulation`, proper specificity, and clean `:active`/`:focus` state transitions to achieve native performance without excess re-renders. |

---

## Open Questions

None. The root cause (mobile touch scroll momentum & sticky focus/hover suppressing `:active` CSS transitions) is identified and resolved via `touch-action` and CSS active/focus state optimization.

---

## Acceptance Criteria

- [ ] Button opens/closes the menu drawer reliably.
- [ ] Button reliably runs its press/click animation even after scrolling down and back up to the top.
- [ ] Active and transition styling on the menu button (`active:translate-x-1 active:translate-y-1 active:shadow-none transition-all`) triggers predictably on touch after scroll operations.
- [ ] Any stuck or conflicting hover/focus states after touch scroll are reset so tap feedback is immediately visible.
- [ ] Mobile navigation drawer toggling functionality and accessibility attributes (`aria-expanded`) remain fully functional.
- [ ] `npm run lint` and `npm run build` pass without errors.
