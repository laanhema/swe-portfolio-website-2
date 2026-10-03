# Plan: Run Full Build and Lint Validation for Blog Feature

## Summary

Run full ESLint checks, TypeScript compilation, and Vite production bundle generation to validate that the entire blog feature and SPA routing setup compiles cleanly with 0 warnings, 0 errors, clean module resolutions, and valid production assets including `dist/404.html`. Mark all acceptance criteria and tasks in `.agents/plans/add-blog-page-plan.md` as completed and archive `add-blog-page-plan.md` to `.agents/plans/completed/`.

## User Story

As a maintainer and developer,
I want to run complete static analysis, type checking, and production bundling across the entire codebase,
So that I can verify that all blog components, routing configurations, and SPA fallback assets are production-ready with zero errors.

## Metadata

| Field | Value |
|---|---|
| Type | QUALITY ASSURANCE / VALIDATION |
| Complexity | LOW |
| Systems Affected | Build & Validation pipeline (`npm run lint`, `tsc`, `vite build`), `.agents/plans/add-blog-page-plan.md` |
| GitHub Issue | #44 |

---

## Patterns to Follow

### Validation Scripts
```json
// SOURCE: package.json:6-10
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

### Static Asset & SPA Fallback Output
```bash
// SOURCE: dist/404.html, dist/index.html
dist/index.html
dist/404.html
dist/assets/*.js
dist/assets/*.css
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `.agents/plans/add-blog-page-plan.md` | UPDATE / ARCHIVE | Mark tasks and acceptance criteria as completed, then archive to `.agents/plans/completed/add-blog-page-plan.md` |

---

## Tasks

### Task 1: Verify Lint and Production Build
- **Action**: VALIDATE
- **Implement**: Execute `npm run lint` and `npm run build` to verify 0 errors, 0 warnings, clean type-checking, and generation of `dist/` bundle assets including `dist/404.html`.
- **Validate**: `npm run lint && npm run build`

### Task 2: Complete and Archive Blog Feature Plan
- **File**: `.agents/plans/add-blog-page-plan.md`
- **Action**: UPDATE & ARCHIVE
- **Implement**: Check off all task items and acceptance criteria in `.agents/plans/add-blog-page-plan.md` to reflect complete delivery of the blog feature (Tasks 1-10), and move the file into `.agents/plans/completed/add-blog-page-plan.md`.
- **Validate**: `test -f .agents/plans/completed/add-blog-page-plan.md && ! test -f .agents/plans/add-blog-page-plan.md`

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint

# Dist Check
ls -la dist/index.html dist/404.html
```

## End-to-End Verification

1. Run `npm run lint` and ensure output has 0 warnings and 0 errors.
2. Run `npm run build` and ensure `tsc -b && vite build` succeeds cleanly.
3. Verify `dist/` contains `index.html`, `404.html`, `CNAME`, `favicon.svg`, and hashed CSS/JS chunks.
4. Verify that SPA fallback in `dist/404.html` exists and mirrors `public/404.html`.

---

## Risks

| Risk | Mitigation | In-Scope / Out-of-Scope |
|---|---|---|
| Unreferenced components or unused imports in blog feature | ESLint and TypeScript compiler catch any unused or misconfigured imports | In-scope |
| Missing SPA fallback `404.html` in production build | Vite copies `public/404.html` into `dist/404.html` automatically during build | In-scope |

---

## Open Questions

None.

---

## Acceptance Criteria

- [ ] All tasks completed.
- [ ] `npm run lint` passes with 0 warnings and 0 errors.
- [ ] `npm run build` succeeds with 0 TypeScript compiler errors.
- [ ] Vite production bundle output in `dist/` contains valid bundles and `404.html`.
- [ ] Parent blog feature plan `.agents/plans/add-blog-page-plan.md` updated and archived to `.agents/plans/completed/`.
