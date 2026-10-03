# Plan: Create Reusable PostCard and ArticleHeader Components

## Summary

Implement reusable presentational components for the portfolio blog: `PostCard` for rendering article previews in listings and grids (supporting custom card background colors such as `#00e5ff` for featured cards and `#ffffff` for standard cards, metadata rows, linked titles, excerpts, and tech badges with brutal-shadow-hover), and `ArticleHeader` for individual post pages (featuring a back link to `/blog`, topic tags, high-impact responsive H1 with accent phrase highlight, author byline with date/reading time, and a thick-bordered lede quote callout).

## User Story

As a visitor exploring laanhema.dev,
I want consistent, high-contrast, responsive neo-brutalist preview cards in the blog index and an expressive article header on post pages,
So that I can scan recent technical write-ups and comfortably read in-depth devlogs.

## Metadata

| Field | Value |
|---|---|
| Type | FEATURE |
| Complexity | LOW |
| Systems Affected | `src/features/blog/components/PostCard.tsx`, `src/features/blog/components/ArticleHeader.tsx` |
| GitHub Issue | #38 |

---

## Patterns to Follow

### Design System PostCard Pattern
```html
// SOURCE: .agents/design-system/laanhema-design-system/components/PostCard/preview.html:5-15
<article class="brutal-border brutal-shadow brutal-shadow-hover p-6 md:p-8 flex flex-col gap-4 h-full" style="background-color: #00e5ff">
  <div class="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-wider"><time datetime="2026-09-18">Sep 18, 2026</time><span aria-hidden="true">/</span><span>8 min read</span></div>
  <h3 class="text-3xl md:text-4xl font-bold uppercase leading-tight tracking-tight"><a href="#" class="hover:underline decoration-4 underline-offset-4">NgRx SignalStore patterns I keep reaching for</a></h3>
  <p class="text-lg font-medium leading-relaxed">How Tralla's board state stayed small: feature stores, computed selectors and the one rule I'd break again.</p>
  <div class="flex flex-wrap gap-2 mt-auto pt-2"><span class="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase">Angular</span><span class="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase">NgRx</span></div>
</article>
```

### Design System ArticleHeader Pattern
```html
// SOURCE: .agents/design-system/laanhema-design-system/components/ArticleHeader/preview.html:5-11
<header class="max-w-4xl mx-auto pt-16 md:pt-20 pb-12">
  <a href="#blog" class="inline-flex items-center gap-2 font-bold uppercase tracking-wider mb-10 hover:underline decoration-4 underline-offset-4 decoration-[#ff3e00]">&larr; All posts</a>
  <div class="flex flex-wrap gap-2 mb-6"><span class="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase">Angular</span><span class="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase">NgRx</span></div>
  <h1 class="text-5xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tighter mb-8">NgRx SignalStore patterns I keep <span class="text-[#ff3e00]">reaching for.</span></h1>
  <div class="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-wider mb-10"><span>Lauri Makkonen</span><span aria-hidden="true">/</span><time datetime="2026-09-18">Sep 18, 2026</time><span aria-hidden="true">/</span><span>8 min read</span></div>
  <p class="text-xl md:text-2xl font-medium border-l-8 border-[#ff3e00] pl-6">How Tralla&apos;s board state stayed small: feature stores, computed selectors and the one rule I&apos;d break again.</p>
</header>
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `src/features/blog/components/PostCard.tsx` | CREATE | Reusable blog card component for post listings |
| `src/features/blog/components/ArticleHeader.tsx` | CREATE | Reusable post header with back link, byline, tags, title highlight, and lede |

---

## Tasks

### Task 1: Create `src/features/blog/components/PostCard.tsx`

- **File**: `src/features/blog/components/PostCard.tsx`
- **Action**: CREATE
- **Implement**:
  - Accept props for `slug`, `title`, `date`, `displayDate`, `readingTime`, `excerpt`, `tags`, `backgroundColor`, `color`, `featured`, `className`, or optional `post: BlogPost`.
  - Background defaults to `#ffffff` (or `#00e5ff` / `post.accentColor` when `featured` is true or custom background/color is supplied).
  - Shell container: `brutal-border brutal-shadow brutal-shadow-hover p-6 md:p-8 flex flex-col gap-4 h-full`.
  - Date and reading time row: `<div className="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-wider">` with `<time dateTime={date}>{displayDate || date}</time>`, `<span aria-hidden="true">/</span>`, and reading time span.
  - Linked title: `<h3 className="text-3xl md:text-4xl font-bold uppercase leading-tight tracking-tight">` containing `<Link to={`/blog/${slug}`} className="hover:underline decoration-4 underline-offset-4">`.
  - Excerpt paragraph: `<p className="text-lg font-medium leading-relaxed">{excerpt}</p>`.
  - Tech badges row: `<div className="flex flex-wrap gap-2 mt-auto pt-2">` with each tag rendered as `<span key={tag} className="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase">{tag}</span>`.
- **Validate**: `npm run build`

### Task 2: Create `src/features/blog/components/ArticleHeader.tsx`

- **File**: `src/features/blog/components/ArticleHeader.tsx`
- **Action**: CREATE
- **Implement**:
  - Accept props for `title`, `titleHighlight`, `tags`, `author`, `date`, `displayDate`, `readingTime`, `summary`, `className`, or optional `post: BlogPost`.
  - Container: `<header className="max-w-4xl mx-auto pt-16 md:pt-20 pb-12">`.
  - Back link: `<Link to="/blog" className="inline-flex items-center gap-2 font-bold uppercase tracking-wider mb-10 hover:underline decoration-4 underline-offset-4 decoration-[#ff3e00]">← All posts</Link>`.
  - Tags row: `<div className="flex flex-wrap gap-2 mb-6">` with `<span className="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase">` per tag.
  - H1 title: `<h1 className="text-5xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tighter mb-8">` with the `titleHighlight` phrase highlighted in `<span className="text-[#ff3e00]">`.
  - Byline row: `<div className="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-wider mb-10">` with author, date time element, and reading time.
  - Summary / lede callout: `<p className="text-xl md:text-2xl font-medium border-l-8 border-[#ff3e00] pl-6">{summary}</p>`.
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

Verify build completes without errors, and verify with a node or test render that `PostCard` and `ArticleHeader` can be imported and compiled cleanly.

---

## Risks

| Risk | Mitigation |
|---|---|
| React Router `Link` requires router context in unit tests or when rendered in isolation | Components import `Link` from `react-router` and use standard SPA routing properties |
| Long titles or tags wrapping awkwardly on narrow screens | Use `flex-wrap` and responsive text sizing (`text-3xl md:text-4xl`, `text-5xl md:text-7xl`) |

---

## Acceptance Criteria

- [ ] `PostCard.tsx` renders article date, reading time, linked title, excerpt, and tech badges in neo-brutalist cards with `.brutal-shadow-hover`.
- [ ] `PostCard` supports custom background color props (cyan `#00e5ff` for featured card, white for standard).
- [ ] `ArticleHeader.tsx` renders `← All posts` link back to `/blog`, topic tags, responsive H1 with highlighted phrase, author byline with date/reading time, and thick-bordered lede quote.
- [ ] All components conform to `.agents/design-system/laanhema-design-system/components/PostCard/README.md` and `BlogArticle/preview.html`.
- [ ] `npm run lint` and `npm run build` pass with zero errors.
