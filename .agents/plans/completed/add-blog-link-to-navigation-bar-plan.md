# Plan: Add Blog Link to Navigation Bar and Support Cross-Page Anchor Routing

## Summary

Update `src/features/navigation/Nav.tsx` to insert a "Blog" navigation item between "About" and "Contact" across both desktop navigation and the mobile drawer menu, update the brand wordmark (`laanhema.dev`) to link to `/` with smooth scroll-to-top behavior, and implement route-aware anchor link resolution via React Router's `useLocation()` hook. When viewing the home page (`/`), internal section links target `#work`, `#about`, and `#contact` directly. When viewing `/blog` or `/blog/:slug`, section links target `/#work`, `/#about`, and `/#contact` so clicking them navigates back to the home page's anchored sections. When selecting any navigation link or the brand logo, the mobile drawer closes automatically.

## User Story

As a portfolio visitor navigating between project showcases and blog articles,
I want consistent navigation in the navbar and mobile menu with functional links back to home sections and the blog index,
So that I can seamlessly explore work, about, blog articles, and contact from any page on the site.

## Metadata

| Field | Value |
|---|---|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/features/navigation/Nav.tsx` |
| GitHub Issue | #41 |

---

## Patterns to Follow

### Design System NavBar Desktop Links Pattern
```html
// SOURCE: .agents/design-system/laanhema-design-system/components/NavBar/preview.html:8
<div class='hidden md:flex gap-8 text-lg font-bold'>
  <a href='#work' class='hover:text-[#ff3e00] transition-colors relative group'>
    Work
    <span class='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
  </a>
  <a href='#about' class='hover:text-[#ff3e00] transition-colors relative group'>
    About
    <span class='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
  </a>
  <a href='#contact' class='hover:text-[#ff3e00] transition-colors relative group'>
    Contact
    <span class='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
  </a>
</div>
```

### Design System MobileMenu Drawer Pattern
```html
// SOURCE: .agents/design-system/laanhema-design-system/components/MobileMenu/preview.html:10-14
<div id='mobile-menu' class='md:hidden border-t-4 border-[#121212] bg-[#f8f9fa] px-6 py-6 flex flex-col gap-4 text-xl font-bold uppercase tracking-wide'>
  <a href='#work' class='py-2 border-b-2 border-[#121212] hover:text-[#ff3e00] transition-colors'>Work</a>
  <a href='#about' class='py-2 border-b-2 border-[#121212] hover:text-[#ff3e00] transition-colors'>About</a>
  <a href='#contact' class='py-2 hover:text-[#ff3e00] transition-colors'>Contact</a>
</div>
```

### React Router Safe Location Pattern
```tsx
// SOURCE: react-router exports & hooks pattern
import { useLocation, useInRouterContext, Link } from 'react-router';
// Check router context and safely extract location.pathname
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/features/navigation/Nav.tsx` | UPDATE | Add Blog link, path-aware anchor routing, brand logo link to `/`, and auto-close drawer behavior. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update `src/features/navigation/Nav.tsx`

- **File**: `src/features/navigation/Nav.tsx`
- **Action**: UPDATE
- **Implement**:
  - Import `useLocation`, `useInRouterContext`, and `Link` from `react-router`.
  - Handle both in-router and outside-router contexts gracefully:
    - Check `const inRouter = useInRouterContext()`.
    - When `inRouter` is true, delegate to an inner component calling `useLocation()` to detect `location.pathname`.
    - When `inRouter` is false (e.g. standalone test or pre-routed mount), fall back to `window.location.pathname` or `'/'`.
  - Determine `const isHome = pathname === '/'`.
  - Compute navigation targets:
    - Work: `isHome ? '#work' : '/#work'`
    - About: `isHome ? '#about' : '/#about'`
    - Blog: `'/blog'`
    - Contact: `isHome ? '#contact' : '/#contact'`
  - Update Brand Logo:
    - Link targets `/`.
    - If `inRouter`: render `<Link to="/" ...>` with `onClick` calling `closeMenu()` and `window.scrollTo({ top: 0, behavior: 'smooth' })`.
    - If not in router: render `<a href="/" ...>` with the same `onClick`.
  - Update Desktop Navigation (`hidden md:flex gap-8 text-lg font-bold`):
    - Order: Work → About → Blog → Contact.
    - Work: `href={workHref}` with brutalist hover accent underline.
    - About: `href={aboutHref}` with brutalist hover accent underline.
    - Blog: When `inRouter`, render `<Link to="/blog" ...>` (otherwise `<a href="/blog" ...>`) with brutalist hover accent underline.
    - Contact: `href={contactHref}` with brutalist hover accent underline.
  - Update Mobile Menu Drawer (`#mobile-menu`):
    - Order: Work → About → Blog → Contact.
    - Work: `href={workHref}`, `onClick={closeMenu}`, with `border-b-2 border-[#121212]`.
    - About: `href={aboutHref}`, `onClick={closeMenu}`, with `border-b-2 border-[#121212]`.
    - Blog: `to="/blog"` (or `href="/blog"`), `onClick={closeMenu}`, with `border-b-2 border-[#121212]`.
    - Contact: `href={contactHref}`, `onClick={closeMenu}`, without bottom border (last item).
  - Ensure all links call `closeMenu()` when clicked.
- **Mirror**: `.agents/design-system/laanhema-design-system/components/NavBar/README.md:5-6` and `.agents/design-system/laanhema-design-system/components/MobileMenu/README.md:4-5`
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

1. Run `npm run lint` and verify zero ESLint errors.
2. Run `npm run build` and verify TypeScript compilation and Vite bundling succeed without errors.
3. Verify that on `/`, navigation links target `#work`, `#about`, `/blog`, `#contact`.
4. Verify that on `/blog` or `/blog/:slug`, navigation links target `/#work`, `/#about`, `/blog`, `/#contact`.
5. Verify that brand logo links to `/` and scrolls to top.
6. Verify that clicking any navigation link in the mobile drawer closes the drawer.

---

## Risks

| Risk | Mitigation |
|---|---|
| `useLocation()` threw if called outside `<BrowserRouter>` in unrouted context | Use `useInRouterContext()` wrapper pattern to ensure `useLocation()` is only invoked within a Router context while falling back cleanly to `window.location.pathname`. |
| Cross-page anchor navigation (e.g. `/#work`) not scrolling to target section after page load | Anchors targeting `/#work` reload or land on `/` with hash `#work`, which the browser natively scrolls to; `App.tsx` navigation reload handler preserves user hash jumps. |

---

## Acceptance Criteria

- [ ] "Blog" appears between "About" and "Contact" in desktop navigation and in the mobile drawer menu.
- [ ] Brand logo `laanhema.dev` links to `/` and scrolls to top.
- [ ] On `/`, navigation links target `#work`, `#about`, `/blog`, `#contact`.
- [ ] On `/blog` or `/blog/:slug`, navigation links target `/#work`, `/#about`, `/blog`, `/#contact` using `useLocation()` detection.
- [ ] Mobile drawer automatically closes when any link is selected.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` passes with 0 errors.
