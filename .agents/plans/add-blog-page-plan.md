# Plan: Add Blog Page and Project Devlogs

## Summary

Add a dedicated Blog section to laanhema.dev, creating a 4th tab ("Blog") in the navigation bar and converting the project showcase cards into two-button pairs ("Code" + "Read Story"). The blog includes an index page (`/blog`) with a staggered post grid under the "Field Notes." display heading, and individual post pages (`/blog/:slug`) replicating the design system's `BlogArticle/preview.html` 1:1 with `.brutal-prose` styling. Direct hard-refreshes and subpage loads are supported on GitHub Pages using React Router HTML5 URLs with a lightweight SPA 404 redirect.

## User Story

As a visitor and potential employer/collaborator,
I want to read detailed technical write-ups and devlogs for each featured project directly on the site,
So that I can understand the engineer's technical choices, problem-solving abilities, architecture decisions, and learning experiences.

## Metadata

| Field | Value |
|---|---|
| Type | NEW_CAPABILITY / ENHANCEMENT |
| Complexity | MEDIUM |
| Systems Affected | `src/App.tsx`, `src/features/navigation/Nav.tsx`, `src/features/showcase/ProjectCard.tsx`, `src/styles/global.css`, `index.html`, `package.json`, `src/features/blog/*` |
| GitHub Issue | #30 |

---

## Patterns to Follow

### Existing Navigation Links in `src/features/navigation/Nav.tsx`
```tsx
// SOURCE: src/features/navigation/Nav.tsx:25-47
<div className='hidden md:flex gap-8 text-lg font-bold'>
  <a
    href='#work'
    className='hover:text-[#ff3e00] transition-colors relative group'
  >
    Work
    <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
  </a>
  <a
    href='#about'
    className='hover:text-[#ff3e00] transition-colors relative group'
  >
    About
    <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
  </a>
  <a
    href='#contact'
    className='hover:text-[#ff3e00] transition-colors relative group'
  >
    Contact
    <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
  </a>
</div>
```

### Existing Card Action Button Pair in `src/features/showcase/ProjectCard.tsx`
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
  
  {liveUrl && (
    <a 
      href={liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 bg-[#121212] text-white border-4 border-[#121212] py-3 px-3 flex items-center justify-center font-bold uppercase text-center leading-tight brutal-shadow hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#121212] transition-all"
    >
      <span>{liveLabel}</span>
    </a>
  )}
</div>
```

### Design System `.brutal-prose` in `.agents/design-system/laanhema-design-system/styles/brutal-prose.css`
```css
// SOURCE: .agents/design-system/laanhema-design-system/styles/brutal-prose.css:4-23
@layer components {
  .brutal-prose { @apply max-w-3xl text-lg md:text-xl leading-relaxed font-medium; }
  .brutal-prose > * + * { @apply mt-6; }
  .brutal-prose h2 { @apply mt-16 text-3xl md:text-4xl font-bold uppercase leading-tight tracking-tight; }
  .brutal-prose h3 { @apply mt-12 text-2xl font-bold uppercase tracking-tight; }
  .brutal-prose h2 + *, .brutal-prose h3 + * { @apply mt-4; }
  .brutal-prose a { @apply font-bold underline decoration-4 underline-offset-4 decoration-accent hover:bg-[#facc15]; }
  .brutal-prose strong { @apply font-bold; }
  .brutal-prose ul { @apply list-[square] pl-6 marker:text-accent; }
  .brutal-prose ol { @apply list-decimal pl-6 marker:font-bold; }
  .brutal-prose li + li { @apply mt-2; }
  .brutal-prose blockquote { @apply border-l-8 border-accent pl-6 text-2xl font-bold leading-snug; }
  .brutal-prose :not(pre) > code { @apply font-mono text-[0.85em] bg-white border-2 border-text-primary px-1.5 py-0.5; }
  .brutal-prose pre { @apply border-4 border-text-primary shadow-brutal bg-text-primary text-white p-6 overflow-x-auto font-mono text-[15px] leading-[1.7] font-normal; }
  .brutal-prose hr { @apply border-0 border-t-4 border-text-primary my-16; }
  .brutal-prose figure img { @apply border-4 border-text-primary shadow-brutal w-full; }
  .brutal-prose figcaption { @apply mt-4 text-sm font-bold uppercase tracking-wider; }
  .brutal-prose table { @apply w-full border-4 border-text-primary text-base; }
  .brutal-prose th { @apply bg-text-primary text-white uppercase text-left font-bold p-3; }
  .brutal-prose td { @apply border-t-2 border-text-primary p-3; }
}
```

### Blog Article Layout in `.agents/design-system/laanhema-design-system/components/BlogArticle/preview.html`
```html
// SOURCE: .agents/design-system/laanhema-design-system/components/BlogArticle/preview.html:12-33
<main class="px-6 md:px-12 pb-24"><header class="max-w-4xl mx-auto pt-16 md:pt-20 pb-12">
  <a href="#blog" class="inline-flex items-center gap-2 font-bold uppercase tracking-wider mb-10 hover:underline decoration-4 underline-offset-4 decoration-[#ff3e00]">&larr; All posts</a>
  <div class="flex flex-wrap gap-2 mb-6"><span class="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase">Angular</span><span class="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase">NgRx</span></div>
  <h1 class="text-5xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tighter mb-8">NgRx SignalStore patterns I keep <span class="text-[#ff3e00]">reaching for.</span></h1>
  <div class="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-wider mb-10"><span>Lauri Makkonen</span><span aria-hidden="true">/</span><time datetime="2026-09-18">Sep 18, 2026</time><span aria-hidden="true">/</span><span>8 min read</span></div>
  <p class="text-xl md:text-2xl font-medium border-l-8 border-[#ff3e00] pl-6">How Tralla's board state stayed small: feature stores, computed selectors and the one rule I'd break again.</p>
</header><div class="max-w-4xl mx-auto"><div class="brutal-prose">
  <!-- Content -->
</div></div></main>
<section id="contact" ...>
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `package.json` | UPDATE | Add `react-router` dependency for declarative client-side routing. |
| `src/styles/global.css` | UPDATE | Add `@theme` tokens (`--color-accent-cyan`, `--color-accent-yellow`, `--color-accent-purple`) and paste `.brutal-prose` styles. |
| `public/404.html` | CREATE | GitHub Pages SPA redirection script to preserve deep links on hard refresh. |
| `index.html` | UPDATE | Add SPA redirect resolution script in `<head>` to restore deep paths from 404 redirect. |
| `src/features/blog/types.ts` | CREATE | TypeScript interface definitions for `BlogPost`. |
| `src/features/blog/data/posts.ts` | CREATE | Static data registry for the 4 project blog posts (GymBro App, Tralla, Froots, Distill). |
| `src/features/blog/components/PostCard.tsx` | CREATE | Reusable blog card matching `.agents/design-system/laanhema-design-system/components/PostCard/README.md`. |
| `src/features/blog/components/ArticleHeader.tsx` | CREATE | Article header component matching `BlogArticle/preview.html`. |
| `src/features/blog/BlogIndex.tsx` | CREATE | Blog listing view with "Field Notes." header and staggered 2-column PostCard grid. |
| `src/features/blog/BlogPost.tsx` | CREATE | Individual article view matching `BlogArticle/preview.html` 1:1 with Contact CTA and Footer. |
| `src/features/navigation/Nav.tsx` | UPDATE | Add "Blog" to desktop and mobile menus, support cross-page anchor routing (`/#work`, `/#about`, `/#contact`), link brand to `/`. |
| `src/features/showcase/ProjectCard.tsx` | UPDATE | Replace "Live Demo" button with "Read Story" button linking to `/blog/:slug`. |
| `src/App.tsx` | UPDATE | Set up React Router routes (`/`, `/blog`, `/blog/:slug`), extract `HomePage` layout, update `PROJECTS` with `postSlug`. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Add Design Tokens and `.brutal-prose` to `src/styles/global.css` (#35)

- **File**: `src/styles/global.css`
- **Action**: UPDATE
- **Implement**:
  - Add accent colors to `@theme`:
    ```css
    --color-accent-cyan: #00e5ff;
    --color-accent-yellow: #facc15;
    --color-accent-purple: #a855f7;
    ```
  - Append `.brutal-prose` component layer styles copied directly from `.agents/design-system/laanhema-design-system/styles/brutal-prose.css`.
- **Mirror**: `.agents/design-system/laanhema-design-system/styles/brutal-prose.css:1-23`
- **Validate**: `npm run build`

### Task 2: Install `react-router` and Configure GitHub Pages SPA Redirection (#36)

- **File**: `package.json`, `public/404.html`, `index.html`
- **Action**: UPDATE / CREATE
- **Implement**:
  - Install `react-router` via `npm install react-router`.
  - Create `public/404.html` with standard redirect script that stores current path in `sessionStorage` or query string (`?p=...`) and redirects to `/`.
  - Add lightweight restoration script to `index.html` `<head>` that restores the redirect path into browser history.
- **Mirror**: Standard GitHub Pages SPA single-page routing pattern.
- **Validate**: `npm run build`

### Task 3: Create Blog Data Models and Initial 4 Project Posts (#37)

- **File**: `src/features/blog/types.ts`, `src/features/blog/data/posts.ts`
- **Action**: CREATE
- **Implement**:
  - In `src/features/blog/types.ts`, export `BlogPost` interface containing `slug`, `projectTitle`, `title`, `titleHighlight`, `summary`, `author`, `date`, `displayDate`, `readingTime`, `excerpt`, `tags`, `accentColor`, and `content`.
  - In `src/features/blog/data/posts.ts`, define and export `BLOG_POSTS: BlogPost[]` with initial devlogs for:
    1. `gymbro-app`: Gamified gym tracker, Android APK distribution via S3 bucket, Ionic/Angular/Express architecture, mobile challenges.
    2. `tralla`: Kanban board, NgRx SignalStore patterns, computed state management, optimistic UI updates.
    3. `froots-smoothie-app`: Svelte reactivity, Tailwind utility design, nutritional calculator algorithms, lessons from simplicity.
    4. `distill-design-scraper`: Playwright DOM scraping, Culori color clustering, design token extraction, Next.js server actions.
- **Mirror**: `.agents/design-system/laanhema-design-system/components/BlogIndex/preview.html:17-32`
- **Validate**: `npm run lint && npm run build`

### Task 4: Create Reusable `PostCard` and `ArticleHeader` Components (#38)

- **File**: `src/features/blog/components/PostCard.tsx`, `src/features/blog/components/ArticleHeader.tsx`
- **Action**: CREATE
- **Implement**:
  - `PostCard.tsx`:
    - Display date and reading time (`text-sm font-bold uppercase tracking-wider`).
    - Linked title in `heading-card` style with `hover:underline decoration-4 underline-offset-4`.
    - Excerpt in `text-lg font-medium leading-relaxed`.
    - Topic tags at bottom (`mt-auto`) using `bg-white brutal-border px-3 py-1 text-sm font-bold uppercase`.
    - Container styling: `brutal-border brutal-shadow brutal-shadow-hover p-6 md:p-8 flex flex-col gap-4 h-full`, supporting custom background color (featured accent or white).
  - `ArticleHeader.tsx`:
    - Link `← All posts` targeting `/blog` (`inline-flex items-center gap-2 font-bold uppercase tracking-wider mb-10 hover:underline decoration-4 underline-offset-4 decoration-[#ff3e00]`).
    - Topic tags row.
    - `h1` (`text-5xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tighter mb-8`) with the last phrase wrapped in `text-[#ff3e00]`.
    - Byline row: `<span>Lauri Makkonen</span><span aria-hidden="true">/</span><time datetime={date}>{displayDate}</time><span aria-hidden="true">/</span><span>{readingTime}</span>`.
    - Lede summary: `text-xl md:text-2xl font-medium border-l-8 border-[#ff3e00] pl-6`.
- **Mirror**: `.agents/design-system/laanhema-design-system/components/PostCard/preview.html` and `.agents/design-system/laanhema-design-system/components/BlogArticle/preview.html:12-18`
- **Validate**: `npm run lint && npm run build`

### Task 5: Build `BlogIndex.tsx` Page (#39)

- **File**: `src/features/blog/BlogIndex.tsx`
- **Action**: CREATE
- **Implement**:
  - Header with `SectionHeading` pattern:
    - Display `h1`: `Field <br /> <span className="text-[#ff3e00]">Notes.</span>` (`text-6xl md:text-8xl font-bold uppercase tracking-tighter`).
    - Subtitle: `Write-ups from the projects: what worked, what broke, what I'd do again.` (`max-w-sm text-xl font-bold pb-4`).
  - Staggered 2-column grid (`grid md:grid-cols-2 gap-10` with odd index items having `md:translate-y-16`).
  - Map over `BLOG_POSTS`, rendering `PostCard` for each. First post featured with cyan fill (`#00e5ff`), others white (`#ffffff`).
  - Include sticky `Nav`, call `useGsapAnimations()`, and include `Footer`.
- **Mirror**: `.agents/design-system/laanhema-design-system/components/BlogIndex/preview.html`
- **Validate**: `npm run lint && npm run build`

### Task 6: Build `BlogPost.tsx` Page (1:1 with `BlogArticle/preview.html`) (#40)

- **File**: `src/features/blog/BlogPost.tsx`
- **Action**: CREATE
- **Implement**:
  - Retrieve slug from route parameters via `useParams()`.
  - Lookup post from `BLOG_POSTS`. If not found, display a brutalist 404 box with a link back to `/blog`.
  - Render `Nav`.
  - Render `<main className="px-6 md:px-12 pb-24">`.
  - Render `ArticleHeader` with post metadata.
  - Render `<div className="max-w-4xl mx-auto"><div className="brutal-prose">` containing post content (paragraphs, headings, blockquotes, lists, tables, syntax-colored code blocks).
  - Transition directly into `<ContactForm />` (the white contact section with `border-t-4 border-[#121212]`).
  - Render `Footer`.
  - Call `useGsapAnimations()` and ensure window scrolls to top on mount.
- **Mirror**: `.agents/design-system/laanhema-design-system/components/BlogArticle/preview.html:1-60`
- **Validate**: `npm run lint && npm run build`

### Task 7: Update `src/features/navigation/Nav.tsx` (#41)

- **File**: `src/features/navigation/Nav.tsx`
- **Action**: UPDATE
- **Implement**:
  - Insert "Blog" link between "About" and "Contact" in both desktop navigation and mobile drawer.
  - Determine if the current route is `/` or a subpage using React Router `useLocation()`.
  - If on `/`, links use `#work`, `#about`, `/blog`, `#contact`.
  - If on `/blog` or `/blog/:slug`, links use `/#work`, `/#about`, `/blog`, `/#contact`.
  - Update brand logo `laanhema.dev` to link to `/` (using React Router `Link` or anchor with client navigation).
- **Mirror**: `.agents/design-system/laanhema-design-system/components/NavBar/README.md:5-6`
- **Validate**: `npm run lint && npm run build`

### Task 8: Update `ProjectCard.tsx` to 2-Button Layout ("Code" + "Read Story") (#42)

- **File**: `src/features/showcase/ProjectCard.tsx`, `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Update `ProjectCardProps`: replace `liveUrl` / `liveLabel` with `postSlug?: string`.
  - Button 1: "Code" linking to GitHub repo (`bg-white brutal-border py-3 px-3 flex items-center justify-center gap-2 font-bold uppercase text-center leading-tight brutal-shadow hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#121212] transition-all`).
  - Button 2: "Read Story" linking to `/blog/${postSlug}` (`bg-[#121212] text-white border-4 border-[#121212] py-3 px-3 flex items-center justify-center font-bold uppercase text-center leading-tight brutal-shadow hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#121212] transition-all`).
  - Update `PROJECTS` in `src/App.tsx` to assign the respective `postSlug` (`gymbro-app`, `tralla`, `froots-smoothie-app`, `distill-design-scraper`).
- **Mirror**: `src/features/showcase/ProjectCard.tsx:49-70`
- **Validate**: `npm run lint && npm run build`

### Task 9: Configure React Router in `src/App.tsx` and Extract `HomePage` (#43)

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Extract the existing single-page landing content into a `HomePage` component.
  - Wrap the application in `BrowserRouter` (or render `<Routes>`).
  - Define routes:
    - `<Route path="/" element={<HomePage />} />`
    - `<Route path="/blog" element={<BlogIndex />} />`
    - `<Route path="/blog/:slug" element={<BlogPost />} />`
- **Mirror**: React Router standard declarative route definitions.
- **Validate**: `npm run lint && npm run build`

### Task 10: Run Full Build and Lint Validation (#44)

- **File**: N/A
- **Action**: VALIDATE
- **Implement**: Run ESLint and TypeScript/Vite production build to ensure 0 lint errors and successful compilation.
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
3. Start the dev server (`npm run dev`) or preview (`npm run preview`) and verify:
   - **Top Bar**:
     - "Blog" appears between "About" and "Contact" in the top bar and in the mobile menu drawer.
     - Clicking "Blog" navigates to `/blog`.
     - In `/blog`, clicking "Work" navigates back to `/#work` and scrolls to Selected Works.
     - Brand logo `laanhema.dev` navigates back to `/`.
   - **Showcase Cards**:
     - All 4 project cards show exactly 2 buttons ("Code" and "Read Story").
     - On narrow mobile viewports (320px–375px), buttons sit cleanly side-by-side without overflowing or wrapping.
     - Clicking "Read Story" on any project card takes the user directly to `/blog/:slug`.
   - **Blog Index (`/blog`)**:
     - Displays "Field Notes." header with orange period and subtitle.
     - Displays cards in a staggered 2-column layout.
     - Featured post has cyan fill; older posts have white fill.
   - **Blog Article (`/blog/:slug`)**:
     - Exactly matches `BlogArticle/preview.html` 1:1.
     - Displays "← All posts" back link, topic tags, uppercase H1 with orange accent, byline with reading time, and hero lede quote summary.
     - Formatted body in `.brutal-prose` with headers, code blocks, and lists.
     - Ends with the Contact section and Footer.
   - **Direct Page Refresh**:
     - Refreshing `/blog` or `/blog/tralla` reloads cleanly without 404ing.

---

## Risks

| Risk | Mitigation | In-Scope / Out-of-Scope |
|---|---|---|
| GitHub Pages 404 on hard reload of `/blog/:slug` | Add `public/404.html` redirect and `index.html` restoration script so deep links restore cleanly. | In-scope |
| Anchor navigation across routes (`/#work` vs `#work`) | `Nav.tsx` checks route and prefixes `#` with `/` when on blog pages. | In-scope |
| GSAP animations not triggering on route change | Call `useGsapAnimations()` inside `BlogIndex` and `BlogPost` lifecycle. | In-scope |
| Button wrapping on mobile with 2 buttons | Fixed 2-button layout (`flex-1` side-by-side) preserves existing tested layout. | In-scope |

---

## Acceptance Criteria

- [ ] All 10 tasks completed in order.
- [ ] React Router configured with HTML5 URLs (`/`, `/blog`, `/blog/:slug`).
- [ ] `public/404.html` SPA fallback script prevents 404 errors on GitHub Pages reloads.
- [ ] "Blog" appears as the 4th item in desktop and mobile navigation.
- [ ] Project cards feature exactly 2 buttons: "Code" and "Read Story".
- [ ] Blog index page renders "Field Notes." header and staggered 2-column grid.
- [ ] Blog article view replicates `BlogArticle/preview.html` 1:1 with `.brutal-prose` styling.
- [ ] Initial 4 project devlogs populated for GymBro App, Tralla, Froots Smoothie App, and Distill Design Scraper.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` succeeds with 0 errors.
