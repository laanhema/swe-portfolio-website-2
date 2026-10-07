# Plan: Fix Social Link Buttons Freezing in Hover State on Mobile Touch

## Summary

On mobile devices and touchscreens, tapping the social link buttons (GitHub and LinkedIn) in the hero section (`src/App.tsx`) leaves them stuck in their `:hover` transformed state (`translate(-3px, -3px)`). Mobile browsers emulate hover on touch and retain the active hover state after touch interaction ends, causing clicked social buttons to remain offset relative to unclicked buttons in the row. The planned fix scopes `.brutal-shadow-hover:hover` in `src/styles/global.css` within `@media (hover: hover)` media queries so hover translations are suppressed on primary touch input devices. Additionally, active press feedback (`active:translate-x-1 active:translate-y-1 active:shadow-none duration-75 touch-manipulation`) will be added to the hero social link buttons in `src/App.tsx` matching the established mobile button animation pattern from #73. This ensures social link buttons reset smoothly to their resting alignment after tap while preserving tactile press feedback and external navigation (`target="_blank" rel="noopener noreferrer"`).

## User Story

As a mobile site visitor,
I want the GitHub and LinkedIn social link buttons in the hero section to reset to their default aligned position after I tap them,
So that the social link buttons remain neatly aligned without persistent offsets or layout freezing.

## Metadata

| Field | Value |
|-------|-------|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/styles/global.css`, `src/App.tsx` |
| GitHub Issue | #72 |
| PRD Phase | N/A |

---

## Environment Findings

| Probe | Result |
|-------|--------|
| Baseline `npm run lint` | Passes cleanly (0 errors, 0 warnings) |
| Baseline `npm run build` | Passes cleanly (`tsc -b && vite build`) |
| Current `.brutal-shadow-hover:hover` CSS rule | `box-shadow: var(--shadow-brutal); transform: translate(-3px, -3px);` (`src/styles/global.css:58-61`) |
| Hero Social Buttons | `className='bg-white brutal-border p-4 brutal-shadow brutal-shadow-hover text-[#121212] flex items-center justify-center'` (`src/App.tsx:186,195`) |
| Established Active Mobile Pattern | `active:translate-x-1 active:translate-y-1 active:shadow-none duration-75 touch-manipulation` (`src/features/navigation/Nav.tsx:94`, `src/App.tsx:177`) |

---

## Patterns to Follow

### Hover Media Query Guarding
```css
/* SOURCE: src/styles/global.css:58-61 */
@media (hover: hover) {
  .brutal-shadow-hover:hover {
    box-shadow: var(--shadow-brutal);
    transform: translate(-3px, -3px);
  }
}
```

### Established Mobile Active Press Pattern
```tsx
// SOURCE: src/App.tsx:177
<a
  href='#work'
  onClick={handleViewWork}
  className='bg-[#121212] text-white px-8 py-4 text-xl font-bold uppercase brutal-shadow brutal-shadow-hover active:translate-x-1 active:translate-y-1 active:shadow-none duration-75 touch-manipulation'
>
  View Work
</a>
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/styles/global.css` | UPDATE | Scope `.brutal-shadow-hover:hover` inside `@media (hover: hover)` so mouse-emulated hover states on touch screens do not persist post-tap. |
| `src/App.tsx` | UPDATE | Add `active:translate-x-1 active:translate-y-1 active:shadow-none duration-75 touch-manipulation` to GitHub and LinkedIn social link buttons for responsive mobile active press feedback. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Scope `.brutal-shadow-hover` inside `@media (hover: hover)` media query in `src/styles/global.css`

- **File**: [src/styles/global.css](file:///home/lauri/github/swe-portfolio-website-2/src/styles/global.css)
- **Action**: UPDATE
- **Implement**:
  1. Locate `.brutal-shadow-hover:hover` in `src/styles/global.css` (lines 58-61).
  2. Wrap `.brutal-shadow-hover:hover` with `@media (hover: hover) { ... }`.
  3. Verify desktop hover effects remain functional while preventing touch devices from freezing elements in a sticky `:hover` state.
- **Mirror**: `src/styles/global.css:22-26` (media query styling in base layer)
- **Validate**: `npm run lint && npm run build`

### Task 2: Add active press and touch manipulation classes to Hero social link buttons in `src/App.tsx`

- **File**: [src/App.tsx](file:///home/lauri/github/swe-portfolio-website-2/src/App.tsx)
- **Action**: UPDATE
- **Implement**:
  1. Locate GitHub and LinkedIn social `<a>` elements in the Hero section (lines 182-200).
  2. Add `active:translate-x-1 active:translate-y-1 active:shadow-none duration-75 touch-manipulation` to both anchor elements' `className` attributes.
  3. Verify external navigation (`target="_blank" rel="noopener noreferrer"`) and accessibility labels (`aria-label`) remain intact.
- **Mirror**: `src/App.tsx:177`
- **Validate**: `npm run lint && npm run build`

---

## Validation

```bash
# Type check and Production Build
npm run build

# Lint check
npm run lint
```

## End-to-End Verification

1. Run production build (`npm run build`) and launch preview server (`npm run preview`).
2. Open site in Chrome DevTools using mobile device simulation (e.g. Pixel 7 or iPhone 14 touch emulation).
3. Tap the GitHub social link icon button in the Hero section. Verify:
   - Button depresses visually on active tap (`translate-x-1 translate-y-1 shadow-none`).
   - GitHub profile link opens in a new tab.
   - When returning focus to the page, the GitHub button has smoothly reset back to its default resting position (`translate(0,0)`), aligning perfectly with the LinkedIn button.
4. Tap the LinkedIn social link icon button and verify identical touch-active press and clean resting alignment behavior.
5. Switch DevTools back to desktop pointer mode and verify hover transformations (`translate(-3px, -3px)`) continue working as expected on mouse hover.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Browsers without `@media (hover: hover)` media query support | Modern mobile and desktop browsers (iOS Safari, Chrome, Firefox, Edge) universally support media feature `hover: hover`. Desktop mouse pointers will evaluate true for hover, while touch screens evaluate false. |
| Potential regression on desktop hover for `PostCard` or hero buttons | `.brutal-shadow-hover:hover` inside `@media (hover: hover)` explicitly targets devices capable of hovering, preserving desktop hover visual fidelity. |

---

## Open Questions

None. Acceptance criteria and technical notes in Issue #72 fully specify the requirement.

---

## Acceptance Criteria

- [ ] Social link button animation resets to the default visual state after click/touch so that all buttons line up nicely.
- [ ] Tapping social link buttons (GitHub, LinkedIn) on touch devices does not leave them stuck in the hover translate state (`translate(-3px, -3px)`).
- [ ] Hover transforms in `.brutal-shadow-hover` are scoped to `@media (hover: hover)`.
- [ ] Social buttons return to their aligned default position without persistent offsets or gaps.
- [ ] External navigation to social profiles continues to function with `target="_blank"` and `rel="noopener noreferrer"`.
- [ ] `npm run lint` and `npm run build` pass cleanly.
