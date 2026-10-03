# Plan: Build BlogPost Article Page Replicating Design System Preview

## Summary

Implement the dynamic single blog article page (`src/features/blog/BlogPost.tsx`) for `laanhema.dev` replicating the design system specification in `.agents/design-system/laanhema-design-system/components/BlogArticle/preview.html`. The page retrieves the post slug from route parameters via `useParams()`, matches it against `BLOG_POSTS`, and renders the complete neo-brutalist article view: sticky navigation (`Nav`), article metadata header (`ArticleHeader`), raw formatted body content inside `<div className="max-w-4xl mx-auto"><div className="brutal-prose" dangerouslySetInnerHTML={{ __html: post.content }} /></div>`, a seamless transition into `<ContactForm />`, and the standard dark footer. If the requested slug is not found in `BLOG_POSTS`, the page renders a high-contrast brutalist 404 fallback ("Post Not Found") with a button linking back to `/blog`. Entrance animations are initialized via `useGsapAnimations()` and the window scroll position is reset to the top whenever the route or slug changes.

## User Story

As a portfolio visitor,
I want to read deep-dive engineering articles and project case studies at `/blog/:slug` with authentic brutalist formatting, code snippets, blockquotes, and direct contact options,
So that I can learn about Lauri Makkonen's technical decisions and get in touch easily.

## Metadata

| Field | Value |
|---|---|
| Type | FEATURE |
| Complexity | LOW |
| Systems Affected | `src/features/blog/BlogPost.tsx` |
| GitHub Issue | #40 |

---

## Patterns to Follow

### Design System BlogArticle Preview Pattern
```html
// SOURCE: .agents/design-system/laanhema-design-system/components/BlogArticle/preview.html:12-33
<main class="px-6 md:px-12 pb-24"><header class="max-w-4xl mx-auto pt-16 md:pt-20 pb-12">
  <a href="#blog" class="inline-flex items-center gap-2 font-bold uppercase tracking-wider mb-10 hover:underline decoration-4 underline-offset-4 decoration-[#ff3e00]">&larr; All posts</a>
  <div class="flex flex-wrap gap-2 mb-6"><span class="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase">Angular</span><span class="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase">NgRx</span></div>
  <h1 class="text-5xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tighter mb-8">NgRx SignalStore patterns I keep <span class="text-[#ff3e00]">reaching for.</span></h1>
  <div class="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-wider mb-10"><span>Lauri Makkonen</span><span aria-hidden="true">/</span><time datetime="2026-09-18">Sep 18, 2026</time><span aria-hidden="true">/</span><span>8 min read</span></div>
  <p class="text-xl md:text-2xl font-medium border-l-8 border-[#ff3e00] pl-6">How Tralla&apos;s board state stayed small: feature stores, computed selectors and the one rule I&apos;d break again.</p>
</header><div class="max-w-4xl mx-auto"><div class="brutal-prose">
  <p>Tralla started as a weekend Kanban clone and grew into the project where I finally stopped fighting state management...</p>
  ...
</div></div></main>
<section id="contact" class="py-24 px-6 md:px-12 bg-white border-t-4 border-[#121212]">
...
</section>
```

### Blog Index Pattern / GSAP & Scroll
```tsx
// SOURCE: src/features/blog/BlogIndex.tsx:7-16
export const BlogIndex: React.FC = () => {
  useGsapAnimations();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#121212] flex flex-col font-sans selection:bg-[#ff3e00] selection:text-white">
      <Nav />
      ...
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/features/blog/BlogPost.tsx` | CREATE | Article view component with route param matching, ArticleHeader, brutal-prose HTML content, 404 fallback, ContactForm, and Footer. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Create `src/features/blog/BlogPost.tsx` Component

- **File**: `src/features/blog/BlogPost.tsx`
- **Action**: CREATE
- **Implement**:
  - Import `useParams`, `Link` from `react-router`.
  - Import `useEffect` from `react`.
  - Import `Nav` from `../navigation/Nav`.
  - Import `ContactForm` from `../contact/ContactForm`.
  - Import `ArticleHeader` from `./components/ArticleHeader`.
  - Import `BLOG_POSTS` from `./data/posts`.
  - Import `useGsapAnimations` from `../../hooks/useGsapAnimations`.
  - Extract `slug` using `useParams<{ slug: string }>()`.
  - Query `const post = BLOG_POSTS.find((p) => p.slug === slug)`.
  - Call `useGsapAnimations()`.
  - Reset scroll `useEffect(() => { window.scrollTo(0, 0); }, [slug])`.
  - If `!post`:
    - Render brutalist "Post Not Found" view with `Nav`, accessible container `<main className="px-6 md:px-12 py-24 flex-1 flex items-center justify-center">`, brutalist card with `brutal-border brutal-shadow bg-white p-8 md:p-12 text-center max-w-xl`, heading `Post Not Found`, descriptive message, and a Link `to="/blog"` (`inline-block bg-[#ff3e00] text-white font-bold uppercase px-8 py-4 brutal-border brutal-shadow hover:-translate-y-1 hover:translate-x-1 transition-all mt-6`). Conclude with standard Footer.
  - If `post` found:
    - Render container `min-h-screen bg-[#f8f9fa] text-[#121212] flex flex-col font-sans selection:bg-[#ff3e00] selection:text-white`.
    - Render `Nav`.
    - Render `<main className="px-6 md:px-12 pb-24 flex-1">`.
    - Render `<ArticleHeader post={post} />`.
    - Render `<div className="max-w-4xl mx-auto"><div className="brutal-prose" dangerouslySetInnerHTML={{ __html: post.content }} /></div>`.
    - Render `<ContactForm />`.
    - Render standard footer matching `BlogIndex.tsx`.
  - Export `BlogPost` as named export and default export.
- **Mirror**: `.agents/design-system/laanhema-design-system/components/BlogArticle/preview.html:1-60` and `src/features/blog/BlogIndex.tsx:1-91`
- **Validate**: `npm run lint && npm run build`

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint
```

---

## End-to-End Verification

1. Create a temporary scratch verification script using `npx tsx` that imports `BlogPost` and tests React SSR rendering for:
   - Known slug (`slug = "tralla"`): verifies ArticleHeader, title highlight, tags, `.brutal-prose`, `dangerouslySetInnerHTML` content, `<section id="contact"`, and footer.
   - Unknown slug (`slug = "non-existent"`): verifies 404 state "Post Not Found" and link to `/blog`.
2. Clean up temporary scratch script.
3. Confirm `npm run lint` and `npm run build` pass with zero warnings/errors.

---

## Risks

| Risk | Mitigation |
|------|------------|
| HTML content from `BLOG_POSTS` containing raw markup causing React rendering errors | `BLOG_POSTS` content is already validated and sanitarily authored in `src/features/blog/data/posts.ts`; render via `dangerouslySetInnerHTML={{ __html: post.content }}` inside `.brutal-prose`. |
| Missing or undefined route param leading to runtime crashes | Use fallback check `const post = slug ? BLOG_POSTS.find((p) => p.slug === slug) : undefined;` to guarantee safe fallback to 404 state. |

---

## Open Questions

None. Spec and design system previews are complete and authoritative.

---

## Acceptance Criteria

- [ ] `BlogPost.tsx` retrieves the post slug from route params using `useParams()` and matches it against `BLOG_POSTS`.
- [ ] Non-existent slugs render an accessible brutalist "Post Not Found" fallback with a button back to `/blog`.
- [ ] Article renders `ArticleHeader`, followed by `.brutal-prose` body content enclosed in `<div className="max-w-4xl mx-auto">`.
- [ ] Page smoothly concludes with `<ContactForm />` and the site footer.
- [ ] Page mounts `useGsapAnimations()` and resets window scroll to top on route change.
- [ ] Build and lint pass cleanly.
