# Plan: Update ProjectCard to 2-Button Layout with Code and Read Story Links

## Summary

Refactor `src/features/showcase/ProjectCard.tsx` action buttons from "Code" + "Live Demo" to a standardized 2-button layout ("Code" linking to GitHub repository, "Read Story" linking to `/blog/:slug`), and update `PROJECTS` in `src/App.tsx` to pass the corresponding `postSlug` for all four showcased projects (`gymbro-app`, `tralla`, `froots-smoothie-app`, `distill-design-scraper`). Both buttons sit side-by-side using `flex-1`, ensuring responsive layout without wrapping or overflow on narrow mobile screens (320px–375px). React Router navigation is used via `Link` when inside a router context (falling back to standard anchor tags when unrouted), adhering to neo-brutalist styling rules.

## User Story

As a portfolio visitor,
I want each project card to offer direct links to both the source code and the in-depth project story/blog post,
So that I can quickly inspect the repository or read the detailed technical case study from the portfolio homepage.

## Metadata

| Field | Value |
|---|---|
| Type | REFACTOR / ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/features/showcase/ProjectCard.tsx`, `src/App.tsx` |
| GitHub Issue | #42 |

---

## Patterns to Follow

### Existing Action Button Layout
```tsx
// SOURCE: src/features/showcase/ProjectCard.tsx:49-70
<div className="flex gap-4 mt-auto">
  <a 
    href={repoUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex-1 bg-white brutal-border py-3 px-3 flex items-center justify-center gap-2 font-bold uppercase text-center leading-tight brutal-shadow hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#121212] transition-all"
  >
    <GithubIcon className="w-5 h-5 shrink-0" />
    <span>Code</span>
  </a>
  ...
</div>
```

### React Router Safe Context Pattern
```tsx
// SOURCE: src/features/navigation/Nav.tsx:2, 163-169
import { useInRouterContext, Link } from 'react-router';

// Supports rendering both inside and outside React Router context gracefully
```

### Blog Post Slugs
```ts
// SOURCE: src/features/blog/data/posts.ts:5, 82, 157, 234
'gymbro-app'
'tralla'
'froots-smoothie-app'
'distill-design-scraper'
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/features/showcase/ProjectCard.tsx` | UPDATE | Refactor `ProjectCardProps` to replace `liveUrl`/`liveLabel` with `postSlug?: string`, and update action buttons to 2-button layout ("Code" + "Read Story"). |
| `src/App.tsx` | UPDATE | Update `PROJECTS` dataset to replace `liveUrl`/`liveLabel` with `postSlug` for all 4 projects. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update `src/features/showcase/ProjectCard.tsx`

- **File**: `src/features/showcase/ProjectCard.tsx`
- **Action**: UPDATE
- **Implement**:
  - Update `ProjectCardProps` interface:
    - Remove `liveUrl?: string;` and `liveLabel?: string;`
    - Add `postSlug?: string;`
  - Import `useInRouterContext` and `Link` from `react-router`.
  - In component:
    - Check router context: `const inRouter = useInRouterContext();`
    - Retain Button 1 ("Code"): `<a>` with `target="_blank"`, `rel="noopener noreferrer"`, GitHub icon with `shrink-0`, and label "Code".
    - Update Button 2 ("Read Story"): When `postSlug` is provided, render a link to `/blog/${postSlug}` with styling `flex-1 bg-[#121212] text-white border-4 border-[#121212] py-3 px-3 flex items-center justify-center font-bold uppercase text-center leading-tight brutal-shadow hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#121212] transition-all`. If `inRouter` is true, render `<Link to={`/blog/${postSlug}`} ...>`, otherwise render `<a href={`/blog/${postSlug}`} ...>`.
    - Ensure both buttons use `flex-1 py-3 px-3 text-center leading-tight` and sit side-by-side in `<div className="flex gap-4 mt-auto">`.
- **Mirror**: `src/features/showcase/ProjectCard.tsx:49-70` and `src/features/navigation/Nav.tsx:30-47`
- **Validate**: `npm run lint && npm run build`

### Task 2: Update `PROJECTS` Dataset in `src/App.tsx`

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - In `PROJECTS`:
    - `GymBro App`: Remove `liveUrl` and `liveLabel`. Add `postSlug: 'gymbro-app'`.
    - `Tralla`: Add `postSlug: 'tralla'`.
    - `Froots Smoothie App`: Remove `liveUrl`. Add `postSlug: 'froots-smoothie-app'`.
    - `Distill Design Scraper`: Add `postSlug: 'distill-design-scraper'`.
- **Mirror**: `src/features/blog/data/posts.ts` slugs
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

1. Run `npm run lint` and verify 0 ESLint errors.
2. Run `npm run build` and verify TypeScript compilation and Vite bundling succeed without errors.
3. Verify `ProjectCardProps` signature only expects `postSlug?: string` and no longer contains `liveUrl` or `liveLabel`.
4. Verify all 4 project cards in `PROJECTS` provide their respective `postSlug`.
5. Verify on narrow viewport (320px–375px) that "Code" and "Read Story" buttons sit side-by-side without overflowing or wrapping out of line.
6. Verify "Code" button opens GitHub repository in a new tab with `rel="noopener noreferrer"`.
7. Verify "Read Story" button links to `/blog/:slug`.

---

## Risks

| Risk | Mitigation |
|---|---|
| `<Link>` throws invariant violation if used outside `<Router>` | Use `useInRouterContext()` to detect if a Router is present and render `<Link>` if true, or fallback cleanly to `<a href="...">` if unrouted. |
| Button text wrapping awkwardly on narrow mobile screens (320px) | Both buttons use `flex-1 py-3 px-3 text-center leading-tight` inside `flex gap-4`, ensuring proper vertical centering and equal flex distribution. |

---

## Acceptance Criteria

- [ ] `ProjectCardProps` replaces `liveUrl` and `liveLabel` with `postSlug?: string`.
- [ ] "Code" button links externally to GitHub repository with GitHub icon and opens in a new tab.
- [ ] "Read Story" button links internally to `/blog/${postSlug}` using React Router navigation.
- [ ] Buttons sit side-by-side using `flex-1` and do not wrap or overflow on narrow mobile screens (320px–375px).
- [ ] `PROJECTS` in `src/App.tsx` is updated with corresponding slugs for all four projects.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` passes with 0 errors.
