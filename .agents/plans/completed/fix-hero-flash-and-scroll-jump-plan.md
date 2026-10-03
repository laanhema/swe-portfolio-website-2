# Plan: Fix Hero Flash and Scroll Jump When Navigating from Blog to Homepage Section Anchors

## Summary

Resolve the split-second hero image/text animation flash and scroll jump that occurs when navigating from a blog route (`/blog` or `/blog/:slug`) back to home page section anchors (`/#work`, `/#about`, `/#contact`). Currently, the home page mounts with scroll position 0, triggering GSAP ScrollTrigger entrance animations for the hero section before a deferred `useEffect` smoothly scrolls down to the target section. Additionally, navigation links in `Nav.tsx` use plain `<a>` tags with `/#...` hrefs that trigger full page reloads rather than seamless client-side SPA navigation. We will update `Nav.tsx` to use React Router `<Link>` for cross-route anchor links while retaining `<a>` for in-page anchors, and update `src/hooks/useGsapAnimations.ts` and `src/App.tsx` to position the viewport at the target anchor before paint in `useLayoutEffect`, settling elements above the target section in their resting state (`y: 0, opacity: 1`) so that hero entrance animations never abruptly trigger or flash during cross-page anchor transitions.

## User Story

As a user browsing a project blog post or the blog index,
I want to click "Work", "About", or "Contact" in the navigation bar and land directly at that section,
So that the navigation feels instantaneous and polished without an unsightly flash of the hero section or a delayed scroll jump.

## Metadata

| Field | Value |
|---|---|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/features/navigation/Nav.tsx`, `src/hooks/useGsapAnimations.ts`, `src/App.tsx` |
| GitHub Issue | #58 |

---

## Patterns to Follow

### Navigation Link Routing Pattern
```tsx
// SOURCE: src/features/navigation/Nav.tsx:65-74
{inRouter ? (
  <Link
    to={blogHref}
    className='hover:text-[#ff3e00] transition-colors relative group'
  >
    Blog
    <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
  </Link>
) : (
  <a
    href={blogHref}
    className='hover:text-[#ff3e00] transition-colors relative group'
  >
    Blog
    <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
  </a>
)}
```

### GSAP Animation & Cleanup Pattern
```ts
// SOURCE: src/hooks/useGsapAnimations.ts:7-38
export const useGsapAnimations = () => {
  useLayoutEffect(() => {
    const elements = gsap.utils.toArray<HTMLElement>('.animate-on-scroll');

    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
};
```

### Reload Guard Pattern
```tsx
// SOURCE: src/App.tsx:56-70
const navEntries = performance.getEntriesByType('navigation');
const isReload = navEntries.length > 0
  ? (navEntries[0] as PerformanceNavigationTiming).type === 'reload'
  : (performance.navigation && performance.navigation.type === 1);

if (isReload) {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  return;
}
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/features/navigation/Nav.tsx` | UPDATE | Use `<Link to="/#...">` for cross-route anchor navigation when `!isHome` and `inRouter`; keep `<a href="#...">` when `isHome` for in-page smooth navigation |
| `src/hooks/useGsapAnimations.ts` | UPDATE | Accept target hash parameter; perform pre-paint instant scroll and suppress entrance animations on preceding elements when mounting with an anchor hash |
| `src/App.tsx` | UPDATE | Pass `location.hash` to `useGsapAnimations`; adjust mount scroll effect to avoid redundant smooth-scroll jumps on cross-page anchor entries |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update Navigation Links in `Nav.tsx` for Cross-Route SPA Routing

- **File**: `src/features/navigation/Nav.tsx`
- **Action**: UPDATE
- **Implement**:
  - In `NavView`, distinguish between in-page navigation (`isHome`) and cross-route navigation (`!isHome`).
  - For desktop navigation items ("Work", "About", "Contact"):
    - When `inRouter` is true and `!isHome`: render `<Link to={href}>` (where `href` is `/#work`, `/#about`, `/#contact`).
    - When `isHome` is true (or `!inRouter`): render `<a href={href}>` (where `href` is `#work`, `#about`, `#contact`).
  - For mobile navigation drawer items ("Work", "About", "Contact"):
    - Similarly render `<Link to={href} onClick={closeMenu}>` when `inRouter && !isHome`, and `<a href={href} onClick={closeMenu}>` when `isHome`.
- **Validate**: `npm run build && npm run lint`

### Task 2: Update `useGsapAnimations` to Handle Pre-Paint Anchor Positioning and Animation Suppression

- **File**: `src/hooks/useGsapAnimations.ts`
- **Action**: UPDATE
- **Implement**:
  - Accept an optional parameter `targetHash?: string`.
  - In `useLayoutEffect`, check if `targetHash` contains a valid ID (e.g. `#work` -> `work`).
  - If a valid target element exists:
    - Temporarily set `document.documentElement.style.scrollBehavior = 'auto'`.
    - Position the viewport instantly at the target element (`element.scrollIntoView({ behavior: 'instant' })`).
    - Restore original `scrollBehavior`.
    - Identify elements before the target element in DOM order (`element.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING`).
    - For elements preceding the target section (such as the Hero section): set their resting state immediately via `gsap.set(el, { y: 0, opacity: 1 })` without creating an entrance ScrollTrigger, preventing any flash or animation execution above the viewport.
    - For elements at or following the target section: register the standard ScrollTrigger entrance animations.
  - If no `targetHash` is provided (or element is not found): register standard ScrollTrigger animations on all `.animate-on-scroll` elements.
  - Call `ScrollTrigger.refresh()`.
- **Validate**: `npm run build && npm run lint`

### Task 3: Refactor Scroll and Lifecycle Coordination in `src/App.tsx`

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Pass `location.hash` to `useGsapAnimations(location.hash)`.
  - In `HomePage`, track initial mount state using a ref (`isInitialMountRef`).
  - On initial mount: if `location.hash` is present and not a reload, skip the deferred smooth-scroll in `useEffect` because `useLayoutEffect` has already positioned the viewport cleanly before paint.
  - On subsequent hash changes while remaining mounted on `/` (in-page navigation): perform smooth scrolling to the target element.
- **Validate**: `npm run build && npm run lint`

### Task 4: End-to-End Build and Lint Verification

- **Command**: `npm run lint && npm run build`
- **Validate**: 0 TypeScript errors, 0 ESLint warnings or errors, successful Vite build.
