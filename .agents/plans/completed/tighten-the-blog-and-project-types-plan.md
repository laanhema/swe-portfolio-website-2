# Plan: Tighten the Blog and Project Types

## Summary

This plan tightens the blog and project type definitions identified in the React/TypeScript code review of 2026-10-13 (GitHub issue #95, findings T1, T4, and T5). It requires `post: BlogPost` on `PostCard` and `ArticleHeader` while eliminating loose per-field optional props, ensuring unpopulated cards or headers fail compilation. It introduces an extracted `PostSlug` union derived from `BLOG_POSTS as const satisfies readonly BlogPost[]` and enforces it on `ProjectCardProps.postSlug` and `PROJECTS satisfies readonly ProjectCardProps[]`, causing any non-existent post slug to fail `npm run build`. It cleans up the `BlogPost` data model by removing `projectTitle`, eliminating duplicate `excerpt` text in favor of `summary`, removing duplicate `displayDate` strings in favor of a centralized UTC `formatDate` utility, and updating the design system `PostCard/README.md` documentation. All changes are strictly type-safety and code-quality enhancements with zero visual or runtime regressions.

## User Story

As a software engineer maintaining the portfolio website,
I want the compiler to strictly enforce blog post data requirements and project-to-blog slug relationships,
So that missing card data, duplicate model fields, and broken project article links are prevented at compile time.

## Metadata

| Field | Value |
|-------|-------|
| Type | REFACTOR |
| Complexity | MEDIUM |
| Systems Affected | `src/features/blog/types.ts`, `src/features/blog/formatDate.ts`, `src/features/blog/data/posts.ts`, `src/features/blog/components/PostCard.tsx`, `src/features/blog/components/ArticleHeader.tsx`, `src/features/blog/BlogIndex.tsx`, `src/features/showcase/ProjectCard.tsx`, `src/App.tsx`, `.agents/design-system/laanhema-design-system/components/PostCard/README.md` |
| GitHub Issue | #95 |
| PRD Phase | N/A |
| Prototype Patch | N/A |

---

## Environment Findings

| Probe | Result |
|-------|--------|
| Baseline `npm run check` | Passes cleanly (exit 0; `eslint .`, `check:design`, `check:agents`, `tsc -b && vite build` all succeed). |
| Existing Date Formatting Probe | All 4 posts in `src/features/blog/data/posts.ts` have `date` and `displayDate` (`2026-09-18` -> `Sep 18, 2026`, `2026-08-30` -> `Aug 30, 2026`, `2026-08-05` -> `Aug 5, 2026`, `2026-07-12` -> `Jul 12, 2026`). A module-level `new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })` reproduces all 4 strings with 100% fidelity. |
| Blog Post Text Audit | In all 4 posts in `src/features/blog/data/posts.ts`, `summary` and `excerpt` are character-for-character identical. `projectTitle` is never read anywhere across `src/`. |
| Call Site Audit for `PostCard` & `ArticleHeader` | `PostCard` is called exclusively in `src/features/blog/BlogIndex.tsx:37-41`. `ArticleHeader` is called exclusively in `src/features/blog/BlogPost.tsx:81`. Both already pass `post={post}`. `BlogIndex.tsx:39` additionally passes redundant `backgroundColor={post.accentColor}`. |
| Type Enforcement Probe | Deriving `type PostSlug = (typeof BLOG_POSTS)[number]['slug']` from `BLOG_POSTS as const satisfies readonly BlogPost[]` correctly infers `'tralla' | 'distill-design-scraper' | 'froots-smoothie-app' | 'gymbro-app'`. Any mismatched slug in `PROJECTS` causes `tsc -b` to fail with error TS2322. |
| Type-Only Import Verification | `verbatimModuleSyntax` is enabled in `tsconfig.app.json`. Using `import type { PostSlug }` in `ProjectCard.tsx` and `import type { ProjectCardProps }` in `App.tsx` guarantees zero runtime JS import emissions, preventing `posts.ts` from leaking into the home page bundle. |

---

## Patterns to Follow

### Module-Level Date Formatter (T5)
```ts
// SOURCE: src/features/blog/formatDate.ts
const blogDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (dateString: string): string =>
  blogDateFormatter.format(new Date(dateString));
```

### Const Assertion with Satisfies for Literal Narrowing (T4)
```ts
// SOURCE: src/features/blog/data/posts.ts
export const BLOG_POSTS = [
  // ...
] as const satisfies readonly BlogPost[];

export type PostSlug = (typeof BLOG_POSTS)[number]['slug'];
```

### Type-Safe Projects Array (T4)
```ts
// SOURCE: src/App.tsx
import type { ProjectCardProps } from './features/showcase/ProjectCard';

const PROJECTS = [
  // ...
] as const satisfies readonly ProjectCardProps[];
```

### Strict Component Props Interface (T1)
```tsx
// SOURCE: src/features/blog/components/PostCard.tsx
export interface PostCardProps {
  post: BlogPost;
  className?: string;
}
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/features/blog/formatDate.ts` | CREATE | Centralize UTC blog date formatting utility with module-level `Intl.DateTimeFormat`. |
| `src/features/blog/types.ts` | UPDATE | Remove `projectTitle`, `displayDate`, and `excerpt`; retain `summary: string`; type `tags: readonly string[]`. |
| `src/features/blog/data/posts.ts` | UPDATE | Remove `projectTitle`, `displayDate`, and `excerpt` from all posts; apply `as const satisfies readonly BlogPost[]`; export `PostSlug` type. |
| `src/features/blog/components/ArticleHeader.tsx` | UPDATE | Require `post: BlogPost`; drop loose per-field props; format date via `formatDate(post.date)`; render `post.summary`. |
| `src/features/blog/components/PostCard.tsx` | UPDATE | Require `post: BlogPost`; drop loose per-field props; use `post.accentColor`, `formatDate(post.date)`, and `post.summary`. |
| `src/features/blog/BlogIndex.tsx` | UPDATE | Remove redundant `backgroundColor={post.accentColor}` prop from `<PostCard />`. |
| `src/features/showcase/ProjectCard.tsx` | UPDATE | Import `type { PostSlug }`; type `postSlug?: PostSlug;` and `techStack: readonly string[];`. |
| `src/App.tsx` | UPDATE | Import `type { ProjectCardProps }`; apply `as const satisfies readonly ProjectCardProps[]` to `PROJECTS`. |
| `.agents/design-system/laanhema-design-system/components/PostCard/README.md` | UPDATE | Update props documentation to specify required `post: BlogPost` and optional `className`. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Create Date Formatting Utility

- **File**: `src/features/blog/formatDate.ts`
- **Action**: CREATE
- **Implement**: Create a module-level `Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })` instance and export `formatDate(dateString: string): string`.
- **Mirror**: `src/components/playPress.ts:1-12` (standalone lightweight helper in TypeScript)
- **Validate**: `node -e 'import("./src/features/blog/formatDate.ts").catch(() => {});' || npx tsx -e 'import { formatDate } from "./src/features/blog/formatDate.ts"; if (formatDate("2026-09-18") !== "Sep 18, 2026") throw new Error("date format mismatch");'`

### Task 2: Tighten BlogPost Interface

- **File**: `src/features/blog/types.ts`
- **Action**: UPDATE
- **Implement**: 
  - Remove `projectTitle: string;`
  - Remove `displayDate: string;`
  - Remove `excerpt: string;`
  - Keep `summary: string;`
  - Update `tags: readonly string[];`
- **Mirror**: `src/features/blog/types.ts:1-16`
- **Validate**: `npx tsc -b --noEmit`

### Task 3: Streamline BLOG_POSTS Dataset and Export PostSlug

- **File**: `src/features/blog/data/posts.ts`
- **Action**: UPDATE
- **Implement**:
  - Remove `projectTitle`, `displayDate`, and `excerpt` from all four blog post definitions (`tralla`, `distill-design-scraper`, `froots-smoothie-app`, `gymbro-app`).
  - Declare `BLOG_POSTS` with `as const satisfies readonly BlogPost[]`.
  - Export `type PostSlug = (typeof BLOG_POSTS)[number]['slug'];`.
- **Mirror**: `src/features/blog/data/posts.ts:1-25`
- **Validate**: `npx tsc -b --noEmit`

### Task 4: Tighten ArticleHeader Component Props

- **File**: `src/features/blog/components/ArticleHeader.tsx`
- **Action**: UPDATE
- **Implement**:
  - Update `ArticleHeaderProps` to `{ post: BlogPost; className?: string; }`.
  - Import `formatDate` from `../formatDate`.
  - Destructure fields directly from `post` (`title`, `titleHighlight`, `tags`, `author`, `date`, `readingTime`, `summary`).
  - Compute `displayDate` via `formatDate(date)`.
  - Preserve `renderTitle()` implementation unchanged as agreed in review findings.
- **Mirror**: `src/features/blog/components/ArticleHeader.tsx:1-38`
- **Validate**: `npx tsc -b --noEmit`

### Task 5: Tighten PostCard Component Props & Clean Up BlogIndex

- **File**: `src/features/blog/components/PostCard.tsx` and `src/features/blog/BlogIndex.tsx`
- **Action**: UPDATE
- **Implement**:
  - In `PostCard.tsx`: Update `PostCardProps` to `{ post: BlogPost; className?: string; }`.
  - In `PostCard.tsx`: Import `formatDate` from `../formatDate`.
  - In `PostCard.tsx`: Use `post.accentColor` directly for background color (with `|| '#ffffff'` fallback if needed).
  - In `PostCard.tsx`: Render `{post.summary}` in place of `excerpt` and `{formatDate(post.date)}` in `<time dateTime={post.date}>`.
  - In `BlogIndex.tsx`: Remove `backgroundColor={post.accentColor}` at line 39 so it passes only `post={post}` and `className="animate-on-scroll"`.
- **Mirror**: `src/features/blog/components/PostCard.tsx:20-52`
- **Validate**: `npx tsc -b --noEmit`

### Task 6: Type ProjectCard Props with PostSlug

- **File**: `src/features/showcase/ProjectCard.tsx`
- **Action**: UPDATE
- **Implement**:
  - Import `type { PostSlug }` from `../blog/data/posts`.
  - Update `techStack: readonly string[];` in `ProjectCardProps`.
  - Update `postSlug?: PostSlug;` in `ProjectCardProps`.
- **Mirror**: `src/features/showcase/ProjectCard.tsx:6-13`
- **Validate**: `npx tsc -b --noEmit`

### Task 7: Enforce Typed PROJECTS in App.tsx

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Import `type { ProjectCardProps }` from `./features/showcase/ProjectCard`.
  - Annotate `PROJECTS` with `as const satisfies readonly ProjectCardProps[]`.
- **Mirror**: `src/App.tsx:13-50`
- **Validate**: `npm run build`

### Task 8: Update Design System PostCard Documentation

- **File**: `.agents/design-system/laanhema-design-system/components/PostCard/README.md`
- **Action**: UPDATE
- **Implement**: Update line 7 to describe the required `post: BlogPost` prop and optional `className` instead of the legacy individual field props.
- **Mirror**: `.agents/design-system/laanhema-design-system/components/PostCard/README.md:1-8`
- **Validate**: `npm run check:design`

### Task 9: Full Verification and Negative Compilation Testing

- **File**: `src/App.tsx` & `src/features/blog/BlogIndex.tsx`
- **Action**: UPDATE (probe & revert)
- **Implement**:
  - Run full pipeline: `npm run check`.
  - Verify negative probe 1: Temporarily use `<PostCard />` without `post` in `BlogIndex.tsx` and assert `npm run build` fails with TS2741. Revert probe.
  - Verify negative probe 2: Temporarily change a `postSlug` in `App.tsx` to `'non-existent-slug'` and assert `npm run build` fails with TS2322. Revert probe.
  - Re-run `npm run check` to confirm final green baseline.
- **Mirror**: `scripts/check-design-system.mjs:1-35`
- **Validate**: `npm run check`

---

## Validation

```bash
# Type check and Production Vite Build
npm run build

# Code Quality and ESLint Rules
npm run lint

# Design System Class Strings Consistency
npm run check:design

# AGENTS.md Path and Token Consistency
npm run check:agents

# Comprehensive Validation Pipeline
npm run check
```

---

## End-to-End Verification

1. **Static Build Verification**: Run `npm run check` to verify linting, design system documentation checks, `AGENTS.md` synchronization, TypeScript compilation, and production Vite bundling all pass with exit code 0.
2. **Negative Type Probe (AC1)**: Test that calling `<PostCard />` or `<ArticleHeader />` without a `post` prop fails `npm run build` with `error TS2741: Property 'post' is missing in type '{}' but required in type 'PostCardProps'`.
3. **Negative Slug Probe (AC2)**: Test that changing any `postSlug` in `PROJECTS` to `'invalid-slug'` fails `npm run build` with `error TS2322: Type '"invalid-slug"' is not assignable to type 'PostSlug | undefined'`.
4. **Visual & Routing Parity Check**:
   - Preview production build using `npm run preview`.
   - Navigate to `/` (home page): Verify 4 project cards render with their respective accent colors, tech badges, "Code" links, and "Read Story" links. Click each "Read Story" button and verify it navigates cleanly to the corresponding post article route (`/blog/tralla`, `/blog/gymbro-app`, `/blog/froots-smoothie-app`, `/blog/distill-design-scraper`).
   - Navigate to `/blog`: Verify all 4 posts render in the staggered grid with their exact expected formatted dates (`Sep 18, 2026`, `Aug 30, 2026`, `Aug 5, 2026`, `Jul 12, 2026`), summaries, tags, and reading times.
   - Click each article in `/blog`: Verify `ArticleHeader` displays the exact expected title with orange accent highlight, author byline, formatted date, reading time, and summary blockquote.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Inadvertently bundling `posts.ts` into the home page entry chunk | Use `import type { PostSlug }` in `ProjectCard.tsx` and `import type { ProjectCardProps }` in `App.tsx`. With `verbatimModuleSyntax: true`, type imports are completely erased from emit, ensuring zero bundle leakage ahead of issue #97. (In-scope) |
| Localized date shifting across client timezones | Construct `Intl.DateTimeFormat` with explicit `timeZone: 'UTC'` and `en-US` locale in `src/features/blog/formatDate.ts`, guaranteeing identical output strings across all geographic user locations. (In-scope) |
| Breaking design system class check in `check-design-system.mjs` | Avoid introducing phantom class spans in `.agents/design-system/laanhema-design-system/components/PostCard/README.md`. Verify with `npm run check:design`. (In-scope) |
| Readonly array incompatibilities when spreading `project` into `ProjectCard` | Declare `techStack: readonly string[];` in `ProjectCardProps` and `tags: readonly string[];` in `BlogPost` so `as const` object literals satisfy interfaces without mutable array friction. (In-scope) |

---

## Open Questions

- **Color Palette Typing**: Technical note T4 notes that accent colors (`color`, `accentColor`) could optionally be typed as a union of the 4 brand palette hex values (`'#ff3e00' | '#00e5ff' | '#facc15' | '#a855f7'`).
  - *Proposed Default*: Keep `color: string` and `accentColor: string` for this issue to remain focused on the blog and project types specified in the acceptance criteria, avoiding unnecessary churn or over-constraining future project additions.

---

## Acceptance Criteria

- [ ] `PostCard` and `ArticleHeader` take a required `post: BlogPost` and no per-field props, so `<PostCard />` without `post` fails to compile.
- [ ] A `postSlug` in `PROJECTS` that matches no post in `BLOG_POSTS` fails `npm run build`.
- [ ] The `BlogPost` type has no `projectTitle` and stores the post date once and the summary text once; dates and text on `/blog` and the post pages read as before.
- [ ] The design-system `components/PostCard/README.md` describes the new props.
- [ ] `npm run check` passes.
