# Plan: Configure React Router in App.tsx and Extract HomePage

## Summary

Configure declarative client-side routing in `src/App.tsx` using React Router (`BrowserRouter`, `Routes`, `Route`), extract the existing single-page landing content into a dedicated `HomePage` component, and mount routes for `/` (`HomePage`), `/blog` (`BlogIndex`), `/blog/:slug` (`BlogPost`), and a wildcard redirect for undefined paths. Ensure that `useGsapAnimations` is properly initialized on page mount, reload scroll reset logic remains functional, and hash navigation behavior (`#work`, `#about`, `#contact`) smoothly operates across route transitions.

## User Story

As a visitor exploring the portfolio and blog,
I want seamless client-side navigation between the homepage, the blog index, and individual blog posts,
So that I can explore projects, field notes, and case studies with fast transitions and working anchor links without full page reloads.

## Metadata

| Field | Value |
|---|---|
| Type | REFACTOR / ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/App.tsx` |
| GitHub Issue | #43 |

---

## Patterns to Follow

### React Router Declarative Routing
```tsx
// SOURCE: react-router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Blog Route Exports
```tsx
// SOURCE: src/features/blog/BlogIndex.tsx:7, src/features/blog/BlogPost.tsx:9
export const BlogIndex: React.FC = () => { ... }
export const BlogPost: React.FC = () => { ... }
```

### GSAP Lifecycle Pattern
```tsx
// SOURCE: src/features/blog/BlogIndex.tsx:8, src/features/blog/BlogPost.tsx:13
useGsapAnimations();
```

### Reload & Hash Navigation Pattern
```tsx
// SOURCE: src/App.tsx:51-66, src/features/navigation/Nav.tsx:15-20
const location = useLocation();

useEffect(() => {
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

  if (location.hash) {
    const id = location.hash.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }
}, [location.pathname, location.hash]);
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `src/App.tsx` | UPDATE | Extract `HomePage` component containing hero, about, works, contact, footer, GSAP animation init, reload scroll reset, and hash transition handler; wrap `App` in `BrowserRouter` and declare routes for `/`, `/blog`, `/blog/:slug`. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Extract `HomePage` Component and Configure React Router in `src/App.tsx`

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Import `BrowserRouter`, `Routes`, `Route`, `Navigate`, `useLocation` from `'react-router'`.
  - Import `BlogIndex` from `'./features/blog/BlogIndex'`.
  - Import `BlogPost` from `'./features/blog/BlogPost'`.
  - Extract the existing landing page JSX into `export const HomePage: React.FC = () => { ... }`.
  - In `HomePage`:
    - Call `useGsapAnimations()`.
    - Retrieve `location = useLocation()`.
    - Implement `useEffect` handling reload scroll reset and cross-route hash navigation (`location.hash` -> `scrollIntoView({ behavior: 'smooth' })`).
    - Render `<Nav />`, `<header>` (Hero), `<section id="about">`, `<section id="work">`, `<ContactForm />`, and `<footer>`.
  - In `App`:
    - Render `<BrowserRouter>` wrapping `<Routes>`.
    - Define `<Route path="/" element={<HomePage />} />`.
    - Define `<Route path="/blog" element={<BlogIndex />} />`.
    - Define `<Route path="/blog/:slug" element={<BlogPost />} />`.
    - Define `<Route path="*" element={<Navigate to="/" replace />} />`.
- **Mirror**: React Router standard declarative route definitions and `src/features/blog/BlogIndex.tsx`.
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

1. Run `npm run build` and ensure TypeScript compilation and Vite bundling succeed with zero warnings or errors.
2. Run `npm run lint` and verify zero ESLint errors.
3. Start the dev server (`npm run dev`) or preview (`npm run preview`) and test:
   - Root `/` displays the full homepage (`HomePage`) with Hero, About, Selected Works, Contact, and Footer.
   - Navigating to `/blog` displays `BlogIndex` with field notes cards.
   - Navigating to `/blog/gymbro-app` displays `BlogPost` with article header and markdown content.
   - From `/blog`, clicking "Work" navigates to `/#work` and smoothly scrolls to the `#work` section.
   - From `/blog`, clicking "About" navigates to `/#about` and smoothly scrolls to `#about`.
   - Reloading `/` or `/#work` resets scroll to the top of the page cleanly.

---

## Risks

| Risk | Mitigation |
|---|---|
| Double scroll restoration or conflict between native hash jump and smooth scroll | Check `isReload` first to preserve reload reset to top; use element `scrollIntoView({ behavior: 'smooth' })` when `location.hash` is present. |
| GSAP animation triggers accumulating on route changes | `useGsapAnimations` already cleans up `ScrollTrigger.getAll().forEach((trigger) => trigger.kill())` on component unmount. |

---

## Acceptance Criteria

- [ ] Application is wrapped in React Router (`BrowserRouter` or route provider).
- [ ] Existing landing page content (hero, about, selected works, contact, footer) is cleanly organized as `HomePage`.
- [ ] Routes are declared for `/` (`HomePage`), `/blog` (`BlogIndex`), and `/blog/:slug` (`BlogPost`).
- [ ] Hash navigation behavior (`#work`, `#about`, `#contact`) smoothly functions across route transitions.
- [ ] TypeScript compilation (`npm run build`) passes with 0 errors.
- [ ] ESLint (`npm run lint`) passes with 0 errors.
