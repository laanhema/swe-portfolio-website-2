# Plan: Create Blog Data Models and Initial Project Post Entries

## Summary

Define the TypeScript domain models for the portfolio's technical blog and author the four flagship project devlogs (`gymbro-app`, `tralla`, `froots-smoothie-app`, and `distill-design-scraper`). These devlogs capture real-world engineering experiences, trade-offs, architecture decisions, and code snippets, styled for the brutalist typography and prose system.

## User Story

As a recruiter or engineer visiting laanhema.dev,
I want to read in-depth technical write-ups and post entries for Lauri's featured projects,
So that I can evaluate his architectural decision-making, technical depth, and engineering craftsmanship.

## Metadata

| Field | Value |
|---|---|
| Type | FEATURE |
| Complexity | LOW |
| Systems Affected | `src/features/blog/types.ts`, `src/features/blog/data/posts.ts` |
| GitHub Issue | #37 |

---

## Patterns to Follow

### Design System PostCard Pattern
```html
// SOURCE: .agents/design-system/laanhema-design-system/components/BlogIndex/preview.html:17-32
<article class="brutal-border brutal-shadow brutal-shadow-hover p-6 md:p-8 flex flex-col gap-4 h-full" style="background-color: #00e5ff">
  <div class="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-wider"><time datetime="2026-09-18">Sep 18, 2026</time><span aria-hidden="true">/</span><span>8 min read</span></div>
  <h3 class="text-3xl md:text-4xl font-bold uppercase leading-tight tracking-tight"><a href="#" class="hover:underline decoration-4 underline-offset-4">NgRx SignalStore patterns I keep reaching for</a></h3>
  <p class="text-lg font-medium leading-relaxed">How Tralla's board state stayed small: feature stores, computed selectors and the one rule I'd break again.</p>
  <div class="flex flex-wrap gap-2 mt-auto pt-2"><span class="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase">Angular</span><span class="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase">NgRx</span></div>
</article>
```

### Design System ArticleHeader & Brutal Prose Pattern
```html
// SOURCE: .agents/design-system/laanhema-design-system/components/BlogArticle/preview.html:12-33
<h1 class="text-5xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tighter mb-8">NgRx SignalStore patterns I keep <span class="text-[#ff3e00]">reaching for.</span></h1>
<div class="brutal-prose">
  <p>...</p>
  <h2>One store per feature</h2>
  <pre><code>...</code></pre>
  <blockquote>Derived state is a bug you haven't written yet. Compute it.</blockquote>
  <table>...</table>
</div>
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `src/features/blog/types.ts` | CREATE | Export `BlogPost` interface defining metadata, tags, and article content |
| `src/features/blog/data/posts.ts` | CREATE | Export `BLOG_POSTS: BlogPost[]` array containing 4 detailed project write-ups |

---

## Tasks

### Task 1: Create `src/features/blog/types.ts`

- **File**: `src/features/blog/types.ts`
- **Action**: CREATE
- **Implement**:
  Define and export the `BlogPost` TypeScript interface:
  - `slug`: unique URL identifier string (`gymbro-app`, `tralla`, `froots-smoothie-app`, `distill-design-scraper`)
  - `projectTitle`: matching name in `PROJECTS` (e.g. `Tralla`, `GymBro App`)
  - `title`: complete article title
  - `titleHighlight`: substring at the end styled with orange accent highlight
  - `summary`: lede summary paragraph displayed with left border accent
  - `author`: author name string (`Lauri Makkonen`)
  - `date`: ISO 8601 date string (`YYYY-MM-DD`)
  - `displayDate`: formatted human date string (`Sep 18, 2026`)
  - `readingTime`: estimated reading duration (`8 min read`)
  - `excerpt`: short excerpt for index listing card
  - `tags`: string array of technology / topic badges
  - `accentColor`: hex color code for featured card background or accents
  - `content`: rich HTML string containing article body (paragraphs, headings, code snippets, blockquotes, tables)
- **Validate**: `npm run build`

### Task 2: Create `src/features/blog/data/posts.ts`

- **File**: `src/features/blog/data/posts.ts`
- **Action**: CREATE
- **Implement**:
  Define and export `BLOG_POSTS: BlogPost[]` containing authentic engineering devlogs for:
  1. `tralla`: NgRx SignalStore patterns, computed state vs patchState, optimistic UI drag-and-drop.
  2. `distill-design-scraper`: Playwright headless DOM extraction, Culori CIELAB color clustering, Next.js server actions.
  3. `froots-smoothie-app`: Svelte 5 runes reactivity, real-time nutritional recalculation algorithms, lightweight client-side state.
  4. `gymbro-app`: Hybrid mobile development with Ionic & Angular, Express/Mongo backend, distributing signed APKs via S3 bucket.
  Ensure chronological ordering (most recent first) matching the design system index preview.
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

1. Verify `src/features/blog/types.ts` exports `BlogPost` interface with all 13 required fields.
2. Verify `src/features/blog/data/posts.ts` exports `BLOG_POSTS` with 4 entries matching the required project slugs.
3. Validate compilation and linting via `npm run lint` and `npm run build`.

---

## Risks

| Risk | Mitigation |
|---|---|
| Mismatched field names between types and future component consumption | Follow exact property names specified in `.agents/plans/add-blog-page-plan.md` and design system specs. |
| Incompatible HTML formatting with `.brutal-prose` styles | Use semantic HTML tags (`h2`, `h3`, `p`, `ul`, `li`, `pre`, `code`, `blockquote`, `table`) matching `.brutal-prose` CSS rules. |

---

## Acceptance Criteria

- [ ] `src/features/blog/types.ts` defines and exports the `BlogPost` interface (`slug`, `projectTitle`, `title`, `titleHighlight`, `summary`, `author`, `date`, `displayDate`, `readingTime`, `excerpt`, `tags`, `accentColor`, `content`).
- [ ] `src/features/blog/data/posts.ts` defines and exports `BLOG_POSTS: BlogPost[]` containing all 4 featured devlogs.
- [ ] Each post includes rich, formatted content (sections, code snippets, lists, quotes) reflecting authentic engineering details.
- [ ] `npm run lint` and `npm run build` pass with zero type errors.
