# Plan: Share One Footer, One Scroll-Reset Hook and One Set of Nav Helpers

## Summary

This plan addresses React/TypeScript code review findings R3, R5, and R7 from GitHub issue #96 (TODO-48). Currently, the site footer markup is duplicated four times across `App.tsx`, `BlogIndex.tsx`, and `BlogPost.tsx` (in both article and 404 states), and the copy in `App.tsx` lacks `target="_blank"` and `rel="noopener noreferrer"`. Scroll reset on route entry is implemented three different ways, running after paint on blog pages (`useEffect`). In addition, the section-scrolling implementation and navigation link definitions are duplicated between `Nav.tsx` and `App.tsx`. This plan extracts a reusable presentational `Footer` component in `src/components/Footer.tsx`, introduces a layout-effect-driven `useScrollReset` hook in `src/hooks/useScrollReset.ts` running before browser paint, centralizes navigation links and smooth section scrolling in `src/features/navigation/navHelpers.ts`, updates `App.tsx`, `BlogIndex.tsx`, `BlogPost.tsx`, and `Nav.tsx` to consume these shared primitives, and updates `AGENTS.md` to document the new key files and layout.

## User Story

As a software engineer maintaining the portfolio website,
I want single shared implementations of the footer, scroll-reset hook, section-scroller, and navigation link definitions,
So that external link attributes, before-paint scroll resets, section navigation behavior, and menu link configurations remain strictly consistent and DRY across all routes.

## Metadata

| Field | Value |
|-------|-------|
| Type | REFACTOR |
| Complexity | MEDIUM |
| Systems Affected | `src/components/Footer.tsx`, `src/hooks/useScrollReset.ts`, `src/features/navigation/navHelpers.ts`, `src/features/navigation/Nav.tsx`, `src/App.tsx`, `src/features/blog/BlogIndex.tsx`, `src/features/blog/BlogPost.tsx`, `AGENTS.md` |
| GitHub Issue | #96 |
| PRD Phase | N/A |
| Prototype Patch | None |

---

## Environment Findings

| Probe | Result |
|-------|--------|
| Baseline `npm run check` | Passes cleanly (exit 0; `eslint .`, `node scripts/check-design-system.mjs`, `node scripts/check-agents-md.mjs`, and `tsc -b && vite build` all succeed). |
| Design System Class Verification | `scripts/check-design-system.mjs` verifies 45 documented class strings. The footer classes `bg-[#121212] text-white py-12 px-6 md:px-12 border-t-4 border-white`, `max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6`, `hover:text-[#ff3e00] transition-colors`, and `flex gap-6 font-bold uppercase` documented in `.agents/design-system/laanhema-design-system/components/Footer/README.md` will be preserved verbatim in `src/components/Footer.tsx`. |
| Agents MD Doc Verification | `scripts/check-agents-md.mjs` verifies file paths, tree entries, and key files against Git index. Documenting `src/components/Footer.tsx` in `AGENTS.md` passes cleanly once `Footer.tsx` is created. |
| Mobile Menu Drawer Animation Ordering | `Nav.tsx:35-41` closes the mobile menu with `flushSync` prior to scrolling (`#64` fix). Calling `closeMenu()` before `scrollToSection(targetId)` in `Nav.tsx:handleSectionClick` preserves this timing constraint. |
| Anchor Hold & Landing Integrity | `HomePage` in `src/App.tsx:102-137` contains dedicated `useLayoutEffect` logic for initial landing and anchor holding (`#63`). This logic remains untouched. |

---

## Patterns to Follow

### Component Interface and Props
```tsx
// SOURCE: src/features/showcase/ProjectCard.tsx:4-14
export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  // ...
};
```

### Mobile-Safe FlushSync & Navigation Action
```tsx
// SOURCE: src/features/navigation/Nav.tsx:35-41
  const closeMenu = () => {
    if (isOpen) {
      flushSync(() => {
        setIsOpen(false);
      });
    }
  };
```

### Before-Paint Layout Effect
```tsx
// SOURCE: src/App.tsx:108-115
  useLayoutEffect(() => {
    // Layout effect so the first scroll lands before paint and the hero never flashes.
    window.scrollTo(0, 0);
  }, [pathname]);
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/components/Footer.tsx` | CREATE | Single shared footer component with compliant `target="_blank"` and `rel="noopener noreferrer"` attributes on external links, accepting optional `className`. |
| `src/hooks/useScrollReset.ts` | CREATE | Single shared hook executing `window.scrollTo(0, 0)` synchronously before paint via `useLayoutEffect` triggered on route `pathname` changes. |
| `src/features/navigation/navHelpers.ts` | CREATE | Centralized `NAV_LINKS` definition array and shared `scrollToSection(targetId: string)` helper. |
| `src/features/navigation/Nav.tsx` | UPDATE | Render desktop and mobile menus from shared `NAV_LINKS` list and delegate smooth scrolling to `scrollToSection`. |
| `src/App.tsx` | UPDATE | Replace inline footer with `<Footer />`, delegate `handleViewWork` to `scrollToSection('work')`. |
| `src/features/blog/BlogIndex.tsx` | UPDATE | Replace inline `useEffect` with `useScrollReset()`, replace inline footer markup with `<Footer className="mt-24" />`. |
| `src/features/blog/BlogPost.tsx` | UPDATE | Replace inline `useEffect` with `useScrollReset()`, replace inline footer markup in both article view and 404 view with `<Footer />`. |
| `AGENTS.md` | UPDATE | Document `Footer.tsx` in directory layout and Key Files table. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Create Shared Footer Component

- **File**: `src/components/Footer.tsx`
- **Action**: CREATE
- **Implement**: Create `Footer.tsx` exporting `Footer` and `FooterProps`. Render footer container with `bg-[#121212] text-white py-12 px-6 md:px-12 border-t-4 border-white`, brand `Dev.Portfolio`, copyright with `new Date().getFullYear()`, and external links for GitHub (`https://github.com/laanhema`) and LinkedIn (`https://www.linkedin.com/in/laanhema`). Ensure all external links include `target="_blank"` and `rel="noopener noreferrer"`. Support optional `className` prop appended to outer `footer` element.
- **Mirror**: `src/features/blog/BlogIndex.tsx:48-75` and `src/components/Icons.tsx`
- **Validate**: `npm run check`

### Task 2: Create Shared Scroll-Reset Hook

- **File**: `src/hooks/useScrollReset.ts`
- **Action**: CREATE
- **Implement**: Create `useScrollReset.ts` exporting `useScrollReset(): void`. Hook reads `useLocation().pathname` from `react-router` and runs `useLayoutEffect(() => { window.scrollTo(0, 0); }, [pathname])` to ensure scroll positions reset synchronously before browser paint without layout flash.
- **Mirror**: `src/hooks/useGsapAnimations.ts` and `src/App.tsx:107-137`
- **Validate**: `npm run check`

### Task 3: Create Centralized Navigation Helpers and Link Model

- **File**: `src/features/navigation/navHelpers.ts`
- **Action**: CREATE
- **Implement**: Create `navHelpers.ts` exporting:
  1. `interface NavLinkItem { readonly label: string; readonly to: string; readonly sectionId?: string; }`
  2. `NAV_LINKS: readonly NavLinkItem[]` containing:
     - `{ label: 'Work', to: '/#work', sectionId: 'work' }`
     - `{ label: 'About', to: '/#about', sectionId: 'about' }`
     - `{ label: 'Blog', to: '/blog' }`
     - `{ label: 'Contact', to: '/#contact', sectionId: 'contact' }`
  3. `scrollToSection(targetId: string): void`: looks up `document.getElementById(targetId)`, calls `element.scrollIntoView({ behavior: 'smooth' })`, and pushes `#${targetId}` to history if `window.location.hash !== #${targetId}`.
- **Mirror**: `src/features/navigation/Nav.tsx:48-62` and `src/App.tsx:139-148`
- **Validate**: `npm run check`

### Task 4: Refactor Nav.tsx to Use Shared Helpers and Links

- **File**: `src/features/navigation/Nav.tsx`
- **Action**: UPDATE
- **Implement**: Import `NAV_LINKS` and `scrollToSection` from `./navHelpers`. Refactor `handleSectionClick` to call `closeMenu()` followed by `if (isHome) { e.preventDefault(); scrollToSection(targetId); }`. Refactor desktop navigation (`hidden md:flex gap-8 text-lg font-bold`) to map over `NAV_LINKS`. Refactor mobile drawer (`#mobile-menu`) to map over `NAV_LINKS`, using `border-b-2 border-[#121212]` on all items except the last, calling `handleSectionClick(e, link.sectionId)` for section links and `closeMenu` for route links.
- **Mirror**: `src/features/navigation/Nav.tsx:64-165`
- **Validate**: `npm run check`

### Task 5: Refactor App.tsx to Use Shared Footer and scrollToSection

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**: Import `Footer` from `./components/Footer` and `scrollToSection` from `./features/navigation/navHelpers`. Refactor `handleViewWork` to `e.preventDefault(); scrollToSection('work');`. Replace inline `<footer className='bg-[#121212]...'>` block (lines 288-312) with `<Footer />`. Leave `HomePage`'s `useLayoutEffect` anchor-holding logic untouched.
- **Mirror**: `src/App.tsx:139-148, 288-312`
- **Validate**: `npm run check`

### Task 6: Refactor BlogIndex.tsx to Use Shared Hook and Footer

- **File**: `src/features/blog/BlogIndex.tsx`
- **Action**: UPDATE
- **Implement**: Import `Footer` from '../../components/Footer' and `useScrollReset` from '../../hooks/useScrollReset'. Remove unused `useEffect` import. Replace `useEffect(() => { window.scrollTo(0, 0); }, []);` with `useScrollReset();`. Replace inline `footer` element (lines 48-75) with `<Footer className="mt-24" />`.
- **Mirror**: `src/features/blog/BlogIndex.tsx:7-13, 47-76`
- **Validate**: `npm run check`

### Task 7: Refactor BlogPost.tsx to Use Shared Hook and Footer

- **File**: `src/features/blog/BlogPost.tsx`
- **Action**: UPDATE
- **Implement**: Import `Footer` from '../../components/Footer' and `useScrollReset` from '../../hooks/useScrollReset'. Remove unused `useEffect` import. Replace `useEffect(() => { window.scrollTo(0, 0); }, [slug]);` with `useScrollReset();`. Replace inline footer in 404 branch (lines 44-71) with `<Footer />`. Replace inline footer in main article branch (lines 92-119) with `<Footer />`.
- **Mirror**: `src/features/blog/BlogPost.tsx:9-18, 44-71, 92-119`
- **Validate**: `npm run check`

### Task 8: Update AGENTS.md Layout and Key Files

- **File**: `AGENTS.md`
- **Action**: UPDATE
- **Implement**: Update the directory layout diagram to document `Footer.tsx` under `src/components/`. Add `src/components/Footer.tsx` to Key Files table (`| src/components/Footer.tsx | Site-wide footer with brand mark, copyright, and social links |`).
- **Mirror**: `AGENTS.md:65, 126-138`
- **Validate**: `npm run check`

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint

# Design system and AGENTS.md checks + full build
npm run check
```

## End-to-End Verification

1. **Clean Project Validation**:
   - Run `npm run check` to verify ESLint, design system token checks (`check:design`), AGENTS.md consistency (`check:agents`), and TypeScript compilation (`tsc -b && vite build`) all exit 0.
2. **Section Navigation and Mobile Menu**:
   - Start preview server with `npm run preview`.
   - On desktop viewport: verify clicking "Work", "About", and "Contact" smoothly scrolls to `#work`, `#about`, and `#contact` without page reloads.
   - On desktop viewport: verify clicking "View Work" in Hero scrolls to `#work`.
   - On desktop viewport: verify clicking "Blog" transitions to `/blog` with scroll position reset to top.
   - On mobile viewport: open drawer via "Menu", verify "Work", "About", "Blog", and "Contact" links render, verify clicking a section link closes drawer via `flushSync` and smoothly scrolls to section.
3. **Blog Scroll Reset**:
   - Scroll down on `/blog`, click into any article (e.g. `/blog/tralla`), verify scroll position resets to top before first paint without visual flicker.
   - Click "← All Posts", verify `/blog` opens scrolled to top.
   - Navigate to non-existent post `/blog/non-existent-article`, verify 404 card renders with shared `<Footer />`.
4. **Footer External Link Attributes**:
   - Inspect footer links (GitHub and LinkedIn) across `/`, `/blog`, `/blog/tralla`, and `/blog/404`: verify every anchor contains `target="_blank"` and `rel="noopener noreferrer"`.

---

## Risks

| Risk | Mitigation | Scope |
|------|------------|-------|
| Design system class check regression: `scripts/check-design-system.mjs` fails if class strings in `Footer/README.md`, `NavBar/README.md`, or `MobileMenu/README.md` disappear from `src/`. | Preserve exact class strings `bg-[#121212] text-white py-12 px-6 md:px-12 border-t-4 border-white`, `max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6`, `hover:text-[#ff3e00] transition-colors`, and `flex gap-6 font-bold uppercase` in `Footer.tsx` and preserve drawer container classes in `Nav.tsx`. | In-scope |
| Documentation check regression: `scripts/check-agents-md.mjs` fails if referenced file path does not exist on disk. | Create `src/components/Footer.tsx` before updating `AGENTS.md` so that `check:agents` validates existing paths. | In-scope |
| Mobile menu animation race condition (#64): drawer scroll offset shifting if closed asynchronously. | Preserve `closeMenu()` call (which invokes `flushSync`) prior to `scrollToSection(targetId)` in `handleSectionClick`. | In-scope |
| Disturbance of anchor-holding and initial landing logic (#63) in `App.tsx:102-137`. | Restrict `App.tsx` changes to `handleViewWork` and the footer markup; leave `HomePage`'s `useLayoutEffect` untouched. | In-scope |

---

## Open Questions

None. All implementation specifics, layout considerations, and component locations align with existing architectural conventions and author-approved specifications noted in issue #96 and TODO-48.

---

## Acceptance Criteria

- [ ] One `Footer` component renders on the home page, the blog index, the post page and the post-not-found view; the footer markup exists once in `src/`.
- [ ] Every external link in the footer has `target="_blank"` and `rel="noopener noreferrer"`.
- [ ] The blog index and the post page reset scroll through one shared hook that runs before paint.
- [ ] The scroll-to-section logic exists once, used by the nav links and the "View Work" button, and the desktop and mobile menus render from one list of links.
- [ ] `npm run check` passes, and the `/verify` section-navigation, mobile-menu and blog checks pass.
