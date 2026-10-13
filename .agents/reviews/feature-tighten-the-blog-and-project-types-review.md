# Code Review: feature/tighten-the-blog-and-project-types

**Scope**: branch `feature/tighten-the-blog-and-project-types` (tied to issue #95)
**Recommendation**: APPROVE WITH NITS

## Summary

Reviewed the blog and project type tightening changes on branch `feature/tighten-the-blog-and-project-types` against GitHub issue #95 acceptance criteria and review findings T1, T4, and T5. The changes require `post: BlogPost` on `PostCard` and `ArticleHeader`, enforce compile-time validation on `PROJECTS` `postSlug` via an extracted `PostSlug` union, remove redundant fields (`projectTitle`, `displayDate`, `excerpt`) from `BlogPost` and `BLOG_POSTS`, introduce a centralized UTC `formatDate` utility, and update the design system documentation for `PostCard`. All files were reviewed in full and verified against acceptance criteria and project guidelines.

## Issues Found

### Critical
None

### High Priority
None

### Medium Priority
None

### Suggestions (Low)
- **L1** `.agents/design-system/laanhema-design-system/components/ArticleHeader/README.md:6` — The "Provide" documentation line still lists legacy individual field props rather than the new required `post: BlogPost` prop. **Why:** While only `PostCard/README.md` was explicitly specified in the issue #95 acceptance criteria, updating `ArticleHeader/README.md` maintains documentation consistency across design-system components following the component prop tightening. **Fix:** Update line 6 of `ArticleHeader/README.md` to describe required `post: BlogPost` and optional `className` matching `PostCard/README.md`.

**Noted, not a finding**: The `titleHighlight` convention and string-matching logic in `ArticleHeader.tsx:18-55` remain as they are per author-approved assumption in issue #95 technical notes.

## Validation Results

| Check | Status | Notes |
|-------|--------|-------|
| Build / Type Check | PASS | `npm run build` (`tsc -b && vite build`) — host linux |
| Warnings | NONE | Real compiler and linter warning gates (`tsc -b`, `eslint .`) clean with 0 warnings |
| Lint | PASS | `npm run lint` (`eslint .`) — host linux |
| Tests | PASS | `npm run check` (runs `lint`, `check:design`, `check:agents`, and `build`) — host linux |
| UI verification | PASS | `.claude/skills/verify/scripts/ax.sh all` (tables on all blog posts, nav across routes, button lifts, cursor styles, hero glows) across desktop (1280x900) and mobile (375x812) viewports, plus manual DOM inspections on `/blog` and `/blog/tralla` (`.temp/verify/runs/20261013-160525/`) — host linux |

## What's Good

- `PostCard` and `ArticleHeader` prop definitions are clean and strict, requiring `post: BlogPost` and rejecting unpopulated invocations at compile time.
- `PostSlug` union derived from `BLOG_POSTS as const satisfies readonly BlogPost[]` provides compile-time guarantee that every `postSlug` configured in `PROJECTS` corresponds to an existing blog article.
- Use of `import type` in `ProjectCard.tsx` and `App.tsx` prevents runtime bundling of `posts.ts` into the home page entry chunk under `verbatimModuleSyntax`.
- Module-level `Intl.DateTimeFormat` with explicit `timeZone: 'UTC'` centralizes date formatting while preserving exact output strings across all timezones.
- Duplicate data fields (`projectTitle`, `displayDate`, `excerpt`) successfully eliminated across data models and datasets without any visual or runtime regressions.
- All repository validation gates (`check:design`, `check:agents`, `npm run check`) pass cleanly.

## Recommendation

The changes satisfy all acceptance criteria for issue #95. Fix the minor documentation nit L1 in `ArticleHeader/README.md` via `/fix-findings .agents/reviews/feature-tighten-the-blog-and-project-types-review.md L1` or approve as-is and proceed with merge.
