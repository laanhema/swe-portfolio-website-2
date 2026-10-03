# Plan: Build BlogIndex Page with Field Notes Header and Staggered Post Grid

## Summary

Implement the main blog listing page (`src/features/blog/BlogIndex.tsx`) for `laanhema.dev` matching the design system specification in `.agents/design-system/laanhema-design-system/components/BlogIndex/preview.html`. The page renders a sticky navigation bar, a high-contrast Neo-Brutalist "Field Notes." H1 header with accent styling and descriptive subtitle, a 2-column staggered post grid mapping over `BLOG_POSTS` where odd-indexed items are offset using `md:translate-y-16`, the first card is highlighted with the cyan accent fill (`#00e5ff`) while subsequent cards use clean white backgrounds (`#ffffff`), and a dark neo-brutalist footer. The component also mounts `useGsapAnimations()` for scroll entrance animations and resets window scroll to top on initial page load.

## User Story

As a visitor exploring the portfolio,
I want to browse all engineering devlogs and write-ups on a dedicated `/blog` index page with a staggered brutalist grid layout and smooth entrance animations,
So that I can quickly discover insights and deep-dives into flagship projects.

## Metadata

| Field | Value |
|---|---|
| Type | FEATURE |
| Complexity | LOW |
| Systems Affected | `src/features/blog/BlogIndex.tsx` |
| GitHub Issue | #39 |

---

## Patterns to Follow

### Design System BlogIndex Pattern
```html
// SOURCE: .agents/design-system/laanhema-design-system/components/BlogIndex/preview.html:12-32
<main class='py-24 px-6 md:px-12'><div class='max-w-6xl mx-auto'>
<div class='flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0 mb-16'>
  <h1 class='text-6xl md:text-8xl font-bold uppercase tracking-tighter'>Field <br /> <span class='text-[#ff3e00]'>Notes.</span></h1>
  <p class='max-w-sm text-xl font-bold pb-4'>Write-ups from the projects: what worked, what broke, what I&apos;d do again.</p>
</div>
<div class="grid md:grid-cols-2 gap-10">
  <article class="brutal-border brutal-shadow brutal-shadow-hover p-6 md:p-8 flex flex-col gap-4 h-full" style="background-color: #00e5ff">
  ...
  </article>
  <div class="md:translate-y-16">
    <article class="brutal-border brutal-shadow brutal-shadow-hover p-6 md:p-8 flex flex-col gap-4 h-full" style="background-color: #ffffff">
    ...
    </article>
  </div>
</div>
</div></main>
```

### Staggered Grid Pattern
```tsx
// SOURCE: src/App.tsx:199-206
<div className='grid md:grid-cols-2 gap-10'>
  {PROJECTS.map((project, index) => (
    <div
      key={project.title}
      className={`${index % 2 === 1 ? 'md:translate-y-16' : ''}`}
    >
      <ProjectCard {...project} />
    </div>
  ))}
</div>
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `src/features/blog/BlogIndex.tsx` | CREATE | Main blog listing page with Field Notes header, staggered post grid, sticky nav, footer, and GSAP animations |

---

## Tasks

### Task 1: Create `src/features/blog/BlogIndex.tsx`

- **File**: `src/features/blog/BlogIndex.tsx`
- **Action**: CREATE
- **Implement**:
  - Reset scroll position to top on mount (`window.scrollTo(0, 0)`).
  - Mount `useGsapAnimations()`.
  - Render sticky `<Nav />` at the top.
  - Render `<main className="py-24 px-6 md:px-12 min-h-screen bg-[#f8f9fa]">` containing a `<div className="max-w-6xl mx-auto">`.
  - Render the "Field Notes." section display heading:
    - Container: `flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0 mb-16 animate-on-scroll`.
    - H1: `text-6xl md:text-8xl font-bold uppercase tracking-tighter` with `Field <br /> <span className="text-[#ff3e00]">Notes.</span>`.
    - Subtitle: `max-w-sm text-xl font-bold pb-4` with copy `Write-ups from the projects: what worked, what broke, what I'd do again.`.
  - Render the 2-column post grid:
    - Container: `grid md:grid-cols-2 gap-10`.
    - Map over `BLOG_POSTS` from `src/features/blog/data/posts`:
      - Wrap each item in `<div key={post.slug} className={index % 2 === 1 ? 'md:translate-y-16' : ''}>`.
      - Render `<PostCard post={post} featured={index === 0} backgroundColor={index === 0 ? '#00e5ff' : '#ffffff'} className="animate-on-scroll" />`.
  - Render the neo-brutalist footer:
    - Container: `bg-[#121212] text-white py-12 px-6 md:px-12 border-t-4 border-white mt-24`.
    - Inner container: `max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6`.
    - Brand: `text-2xl font-bold uppercase tracking-tighter` with `Dev<span className="text-[#ff3e00]">.</span>Portfolio`.
    - Copyright: `font-bold` with current year.
    - Social links with `target="_blank"` and `rel="noopener noreferrer"`.
- **Mirror**: `.agents/design-system/laanhema-design-system/components/BlogIndex/preview.html`
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

1. Verify `BlogIndex.tsx` compiles with zero TypeScript errors during `npm run build`.
2. Verify ESLint passes with zero warnings or errors.
3. Test rendering or importing `BlogIndex` to ensure no broken dependencies.

---

## Risks

| Risk | Mitigation |
|---|---|
| Router context needed for `<Link>` elements inside `PostCard` | `PostCard` uses React Router `Link`, which works within `<BrowserRouter>` when routed |
| Stagger offset (`md:translate-y-16`) could cause overlap with footer on short grids | Added bottom padding to `<main>` and margin top to footer so offset cards do not collide |

---

## Acceptance Criteria

- [ ] `BlogIndex.tsx` renders the "Field Notes." H1 header with accent styling and descriptive subtitle.
- [ ] Posts are mapped into a 2-column grid (`grid md:grid-cols-2 gap-10`) with odd-numbered cards offset via `md:translate-y-16`.
- [ ] The first card is styled with the featured cyan accent fill (`#00e5ff`) and subsequent cards use white backgrounds.
- [ ] Navigation bar and footer are present, and `useGsapAnimations()` is mounted.
- [ ] Window scroll resets to top on initial page load.
- [ ] `npm run lint` and `npm run build` pass with zero errors.
