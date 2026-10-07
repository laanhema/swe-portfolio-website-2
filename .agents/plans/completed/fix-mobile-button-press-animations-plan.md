# Plan: Add Mobile Button Press and Hover Animations to "View Work", "Code", and "Read Story" Buttons

## Summary

On mobile viewports and touch devices, tapping the "View Work" hero CTA button in `src/App.tsx` as well as the "Code" and "Read Story" action buttons in `src/features/showcase/ProjectCard.tsx` currently lacks tactile active/press visual feedback. While desktop interactions rely on hover effects, mobile touch devices experience missing or suppressed press animations due to sticky touch `:hover` states, lack of `:active` pseudo-class transformation rules, and browser touch gesture delays. The planned fix updates `src/App.tsx` and `src/features/showcase/ProjectCard.tsx` by applying explicit active brutalist press utilities (`active:translate-x-1 active:translate-y-1 active:shadow-none duration-75 touch-manipulation`) matching the established menu button pattern in `src/features/navigation/Nav.tsx`. This ensures tactile press feedback on mobile touch while preserving smooth scrolling to `#work` and client-side navigation to GitHub and `/blog/:slug`.

## User Story

As a mobile site visitor,
I want the "View Work", "Code", and "Read Story" action buttons to provide clear tactile press animation when tapped,
So that I receive immediate visual feedback confirming my tap interaction.

## Metadata

| Field | Value |
|-------|-------|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/App.tsx`, `src/features/showcase/ProjectCard.tsx` |
| GitHub Issue | #73 |
| PRD Phase | N/A |

---

## Environment Findings

| Probe | Result |
|-------|--------|
| Baseline `npm run lint` | Passes cleanly (0 errors, 0 warnings) |
| Baseline `npm run build` | Passes cleanly (`tsc -b && vite build`) |
| Hero "View Work" CTA | `className='bg-[#121212] text-white px-8 py-4 text-xl font-bold uppercase brutal-shadow brutal-shadow-hover'` (`src/App.tsx:177`) |
| ProjectCard "Code" & "Read Story" buttons | `className="... brutal-shadow hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#121212] transition-all"` (`src/features/showcase/ProjectCard.tsx:55,65,72`) |
| Established Mobile Active Press Pattern | `active:translate-x-1 active:translate-y-1 active:shadow-none duration-75 touch-manipulation` (`src/features/navigation/Nav.tsx:94`) |
| Global `.brutal-shadow:active` Utility | `box-shadow: 0px 0px 0px 0px #121212; transform: translate(6px, 6px);` (`src/styles/global.css:53-56`) |

---

## Patterns to Follow

### Mobile Menu Active Press Pattern
```tsx
// SOURCE: src/features/navigation/Nav.tsx:94
<button
  onClick={toggleMenu}
  className='md:hidden brutal-border px-4 py-2 font-bold uppercase bg-[#ff3e00] text-white brutal-shadow active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-75 touch-manipulation cursor-pointer'
  aria-label={isOpen ? 'Close menu' : 'Open menu'}
  aria-expanded={isOpen}
  aria-controls='mobile-menu'
>
  {isOpen ? 'Close' : 'Menu'}
</button>
```

### Global Brutal Shadow Active Rule
```css
/* SOURCE: src/styles/global.css:53-56 */
.brutal-shadow:active {
  box-shadow: 0px 0px 0px 0px #121212;
  transform: translate(6px, 6px);
}
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/App.tsx` | UPDATE | Add `active:translate-x-1 active:translate-y-1 active:shadow-none duration-75 touch-manipulation` to the "View Work" hero CTA `<a>` link. |
| `src/features/showcase/ProjectCard.tsx` | UPDATE | Add `active:translate-x-1 active:translate-y-1 active:shadow-none duration-75 touch-manipulation` to "Code" `<a>` link and "Read Story" `<Link>` / `<a>` elements. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Add Mobile Active Press & Touch Manipulation to "View Work" Button in `src/App.tsx`

- **File**: [src/App.tsx](file:///home/lauri/github/swe-portfolio-website-2/src/App.tsx)
- **Action**: UPDATE
- **Implement**:
  1. Locate the "View Work" hero anchor tag (`<a href='#work' onClick={handleViewWork} ...>`).
  2. Add `active:translate-x-1 active:translate-y-1 active:shadow-none duration-75 touch-manipulation` to its `className` list.
  3. Ensure smooth scroll behavior in `handleViewWork` remains unaffected.
- **Mirror**: `src/features/navigation/Nav.tsx:94`
- **Validate**: `npm run lint && npm run build`

### Task 2: Add Mobile Active Press & Touch Manipulation to "Code" and "Read Story" Buttons in `src/features/showcase/ProjectCard.tsx`

- **File**: [src/features/showcase/ProjectCard.tsx](file:///home/lauri/github/swe-portfolio-website-2/src/features/showcase/ProjectCard.tsx)
- **Action**: UPDATE
- **Implement**:
  1. Locate the "Code" action link (`<a href={repoUrl} ...>`).
  2. Add `active:translate-x-1 active:translate-y-1 active:shadow-none duration-75 touch-manipulation` to its `className`.
  3. Locate both the `<Link to={...}>` and `<a>` implementations for "Read Story".
  4. Add `active:translate-x-1 active:translate-y-1 active:shadow-none duration-75 touch-manipulation` to their `className` attributes.
  5. Ensure external repo navigation and internal blog routing remain fully functional.
- **Mirror**: `src/features/navigation/Nav.tsx:94`
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

1. Start development server (`npm run dev`) or production preview (`npm run build && npm run preview`).
2. Open site on a mobile device or Chrome DevTools Mobile Viewport (e.g. iPhone / Pixel 375px width).
3. Tap "View Work" in the Hero section: observe button depresses (`translate-x-1 translate-y-1 shadow-none`) during press and page smoothly scrolls down to `#work`.
4. Tap "Code" on any Project Card: observe button depresses visually on touch and opens GitHub repository link in a new tab.
5. Tap "Read Story" on a Project Card with a blog post: observe button depresses visually on touch and navigates cleanly to `/blog/:slug`.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Mobile touch browsers retaining sticky `:hover` states | `touch-manipulation` (`[touch-action:manipulation]`) eliminates touch delays, while `active:translate-x-1 active:translate-y-1 active:shadow-none` ensures the active press state cleanly overrides hover transformations on tap. |
| Transition timing delaying press response on fast taps | Explicit `duration-75` utility ensures ultra-responsive (75ms) visual state changes on tap/touch-down. |

---

## Open Questions

None. Spec requirements and acceptance criteria are clear.

---

## Acceptance Criteria

- [ ] "View work", "Code", and "Read story" action buttons provide visible tactile animation on mobile.
- [ ] "View Work" CTA button in hero section provides a visible press/active animation on mobile touch (`active:translate-x-1 active:translate-y-1 active:shadow-none`).
- [ ] "Code" and "Read Story" action buttons in `ProjectCard` provide consistent tactile press/active feedback on mobile touch.
- [ ] Smooth scrolling to `#work` on "View Work" click remains intact.
- [ ] Card navigation to GitHub and `/blog/:slug` remains functional.
- [ ] `npm run lint` and `npm run build` pass cleanly.
