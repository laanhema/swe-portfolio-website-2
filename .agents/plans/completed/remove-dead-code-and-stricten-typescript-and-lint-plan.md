# Plan: Remove Dead Code, Avoidable Type Casts, and Stricten TypeScript and Lint Settings

## Summary

This plan executes the technical cleanup batch identified in the React/TS code review of 2026-10-13 (GitHub issue #94, findings R2, R6, R7, T2, T6, and X2). It eliminates dead code that never executes (the DOM table-wrapping effect in `BlogPost.tsx`, the `useInRouterContext` fallback link in `ProjectCard.tsx`, and the unused barrel file `src/features/blog/components/index.ts`), deletes unused Vite template files (`src/App.css`, `src/index.css`, `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`), renames the package from `temp-dir` to `swe-portfolio-website-2` in `package.json` and `package-lock.json`, replaces avoidable `as` type casts and non-null assertions with runtime type narrowing (`instanceof`, standard DOM types, and explicit null checks), and enables strict compiler options (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) in `tsconfig.app.json` alongside ESLint's `strictTypeChecked` preset with `projectService`. The changes are strictly internal code quality improvements with zero visual or behavioral regressions.

## User Story

As a software engineer maintaining the portfolio website,
I want dead code, avoidable type assertions, and legacy template artifacts removed, and strict TypeScript and ESLint rules enforced,
So that the codebase remains maintainable, strictly typed, and guarded against regressions without altering any visitor-facing behavior.

## Metadata

| Field | Value |
|-------|-------|
| Type | REFACTOR |
| Complexity | MEDIUM |
| Systems Affected | `src/features/blog/BlogPost.tsx`, `src/features/showcase/ProjectCard.tsx`, `src/features/blog/components/index.ts`, `src/App.tsx`, `src/features/navigation/Nav.tsx`, `src/main.tsx`, `src/features/contact/ContactForm.tsx`, `src/hooks/useGsapAnimations.ts`, `tsconfig.app.json`, `eslint.config.js`, `package.json`, `package-lock.json` |
| GitHub Issue | #94 |
| PRD Phase | N/A |
| Prototype Patch | N/A |

---

## Environment Findings

| Probe | Result |
|-------|--------|
| Baseline `npm run check` | Passes (exit 0; `eslint .`, `check:design`, `check:agents`, `tsc -b && vite build` all clean). |
| TypeScript Compiler Options Probe | `tsc` runs cleanly (0 errors) on current codebase when `noUncheckedIndexedAccess: true` and `exactOptionalPropertyTypes: true` are enabled in `tsconfig.app.json`. |
| ESLint `strictTypeChecked` Probe | 13 errors found across 5 files: 1 non-null assertion at `main.tsx:7` (`@typescript-eslint/no-non-null-assertion`), 11 void returns from arrow functions (`@typescript-eslint/no-confusing-void-expression` in `App.tsx`, `ContactForm.tsx`, `Nav.tsx`, `useGsapAnimations.ts`), and 1 unnecessary template literal at `App.tsx:270` (`@typescript-eslint/no-unnecessary-template-expression`). `vite.config.ts` produces 0 errors. |
| Consistent Type Assertions Probe | `@typescript-eslint/consistent-type-assertions` with `assertionStyle: 'never'` flags lines 57, 58, 118, 129 in `App.tsx` and line 28 in `Nav.tsx`, while correctly permitting `as const` at `App.tsx:69`. |
| Dead Code & Template Files Audit | `src/App.css`, `src/index.css`, `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, and `src/features/blog/components/index.ts` have zero inbound imports or references in the source or docs. |
| Blog Post Table Audit | All 4 tables in `src/features/blog/data/posts.ts` (lines 26, 138, 237, 352) are pre-wrapped in `<div class="brutal-table-wrapper">`. Removing the DOM query/wrap in `BlogPost.tsx` is completely safe. |

---

## Patterns to Follow

### Type Narrowing with Instanceof (T2)
```tsx
// SOURCE: src/App.tsx:55-57
const navEntries = performance.getEntriesByType('navigation');
isPageReload = navEntries.length > 0
  ? navEntries[0] instanceof PerformanceNavigationTiming && navEntries[0].type === 'reload'
  : performance.navigation?.type === 1;
```

### Event Object Narrowing (T2)
```tsx
// SOURCE: src/features/navigation/Nav.tsx:27-30
const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
  if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType) {
    e.currentTarget.blur();
  }
  setIsOpen((prev) => !prev);
};
```

### Root Element Null Guard (T2)
```tsx
// SOURCE: src/main.tsx:7-11
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### Void Expression in Callback Braces (T6)
```tsx
// SOURCE: src/App.tsx:84 & :88
inputs.forEach((type) => {
  window.removeEventListener(type, stop);
});
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/App.css` | DELETE | Delete unused default Vite CSS template file. |
| `src/index.css` | DELETE | Delete unused default Vite CSS template file. |
| `src/assets/hero.png` | DELETE | Delete unused default template graphic. |
| `src/assets/react.svg` | DELETE | Delete unused default React logo SVG. |
| `src/assets/vite.svg` | DELETE | Delete unused default Vite logo SVG. |
| `src/features/blog/components/index.ts` | DELETE | Delete unused blog components barrel file (R7). |
| `package.json` | UPDATE | Rename package from `"temp-dir"` to `"swe-portfolio-website-2"` (X2). |
| `package-lock.json` | UPDATE | Sync package name change to lockfile. |
| `src/features/blog/BlogPost.tsx` | UPDATE | Remove redundant table-wrapping effect and unused `contentRef` / `useRef` (R2). |
| `src/features/showcase/ProjectCard.tsx` | UPDATE | Remove redundant `useInRouterContext` hook and fallback anchor tag (R6). |
| `src/App.tsx` | UPDATE | Replace avoidable casts at lines 57, 58, 118, 129; fix void expression and template literal lint errors (T2, T6). |
| `src/features/navigation/Nav.tsx` | UPDATE | Remove avoidable `as PointerEvent` cast; fix void expression lint errors in callbacks (T2, T6). |
| `src/main.tsx` | UPDATE | Replace non-null assertion `!` with explicit null guard and error throw (T2, T6). |
| `src/features/contact/ContactForm.tsx` | UPDATE | Add braces to form submit handler to satisfy `no-confusing-void-expression` (T6). |
| `src/hooks/useGsapAnimations.ts` | UPDATE | Add braces to `forEach` cleanup callback to satisfy `no-confusing-void-expression` (T6). |
| `tsconfig.app.json` | UPDATE | Enable `"noUncheckedIndexedAccess": true` and `"exactOptionalPropertyTypes": true` (T6). |
| `eslint.config.js` | UPDATE | Upgrade to `tseslint.configs.strictTypeChecked`, enable `projectService`, and add `@typescript-eslint/consistent-type-assertions` rule (T6). |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Delete Unused Template and Barrel Files

- **File**: `src/App.css`, `src/index.css`, `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/features/blog/components/index.ts`
- **Action**: DELETE
- **Implement**: Remove the 5 unused template files in `src/` and `src/assets/` plus the unused barrel file `src/features/blog/components/index.ts`.
- **Mirror**: `scripts/check-agents-md.mjs:15-18` (verifies files tracked by git)
- **Validate**: `npm run check:design && npm run check:agents && npm run build`

### Task 2: Update Package Name in `package.json` and `package-lock.json`

- **File**: `package.json`, `package-lock.json`
- **Action**: UPDATE
- **Implement**:
  - In `package.json`, change `"name": "temp-dir"` to `"name": "swe-portfolio-website-2"`.
  - Update `package-lock.json` root package name and `packages[""]` name to match, or run `npm install --package-lock-only`.
- **Mirror**: `AGENTS.md:9` (already refers to `swe-portfolio-website-2`)
- **Validate**: `npm run check:agents`

### Task 3: Remove Dead Table-Wrapping Effect and Unused Ref in `src/features/blog/BlogPost.tsx`

- **File**: `src/features/blog/BlogPost.tsx`
- **Action**: UPDATE
- **Implement**:
  - Remove `useRef` from `import React, { useEffect, useRef } from 'react';` so it becomes `import React, { useEffect } from 'react';`.
  - Remove `const contentRef = useRef<HTMLDivElement>(null);` at line 12.
  - Simplify `useEffect` at lines 16-35: keep `window.scrollTo(0, 0);` and remove lines 19-34 (table query and DOM wrapping). The effect becomes:
    ```tsx
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [slug]);
    ```
  - Remove `ref={contentRef}` from the article content wrapper `<div>` at line 102.
- **Mirror**: `src/features/blog/BlogIndex.tsx:1-12`
- **Validate**: `npm run build`

### Task 4: Remove `useInRouterContext` Fallback in `src/features/showcase/ProjectCard.tsx`

- **File**: `src/features/showcase/ProjectCard.tsx`
- **Action**: UPDATE
- **Implement**:
  - In `import { useInRouterContext, Link } from 'react-router';`, remove `useInRouterContext`.
  - Remove `const inRouter = useInRouterContext();` at line 23.
  - At lines 63-81, replace the ternary `inRouter ? <Link ...> : <a ...>` with just the `<Link>` element:
    ```tsx
    {postSlug && (
      <Link 
        to={`/blog/${postSlug}`}
        className="flex-1 bg-[#121212] text-white border-4 border-[#121212] py-3 px-3 flex items-center justify-center font-bold uppercase text-center leading-tight shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation"
        onPointerDown={playPress}
      >
        <span>Read Story</span>
      </Link>
    )}
    ```
- **Mirror**: `src/features/showcase/ProjectCard.tsx:65-71`
- **Validate**: `npm run check:design && npm run build`

### Task 5: Eliminate Avoidable Type Casts in `src/App.tsx`, `src/features/navigation/Nav.tsx`, and `src/main.tsx`

- **File**: `src/App.tsx`, `src/features/navigation/Nav.tsx`, `src/main.tsx`
- **Action**: UPDATE
- **Implement**:
  - In `src/App.tsx`:
    - At lines 55-58, replace `(navEntries[0] as PerformanceNavigationTiming).type === 'reload'` and the double cast `(performance as unknown as { navigation?: { type?: number } }).navigation?.type === 1` with runtime type narrowing:
      ```ts
      const navEntries = performance.getEntriesByType('navigation');
      isPageReload = navEntries.length > 0
        ? navEntries[0] instanceof PerformanceNavigationTiming && navEntries[0].type === 'reload'
        : performance.navigation?.type === 1;
      ```
    - At line 118 and line 129, remove `as ScrollBehavior`: change `behavior: 'instant' as ScrollBehavior` to `behavior: 'instant'`.
  - In `src/features/navigation/Nav.tsx`:
    - Change line 27 `toggleMenu = (e?: React.MouseEvent<HTMLButtonElement>) => {` to `toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {`.
    - Change line 28 `if (e && (e.nativeEvent as PointerEvent).pointerType) {` to:
      ```ts
      if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType) {
      ```
  - In `src/main.tsx`:
    - Replace line 7 `createRoot(document.getElementById('root')!).render(` with:
      ```ts
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        throw new Error('Root element not found');
      }

      createRoot(rootElement).render(
      ```
- **Mirror**: `src/App.tsx:72` (uses `{ behavior: 'instant' }` without cast)
- **Validate**: `npm run build`

### Task 6: Enable Stricter Compiler Options in `tsconfig.app.json`

- **File**: `tsconfig.app.json`
- **Action**: UPDATE
- **Implement**:
  - Under `compilerOptions`, add:
    ```json
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    ```
- **Mirror**: `tsconfig.app.json:19-24`
- **Validate**: `npm run build`

### Task 7: Fix ESLint Void-Expression and Template Issues Across Source Files

- **File**: `src/App.tsx`, `src/features/contact/ContactForm.tsx`, `src/features/navigation/Nav.tsx`, `src/hooks/useGsapAnimations.ts`
- **Action**: UPDATE
- **Implement**:
  - In `src/App.tsx`:
    - Line 84: change `inputs.forEach((type) => window.removeEventListener(type, stop));` to `inputs.forEach((type) => { window.removeEventListener(type, stop); });`.
    - Line 88: change `inputs.forEach((type) => window.addEventListener(type, stop, { passive: true }));` to `inputs.forEach((type) => { window.addEventListener(type, stop, { passive: true }); });`.
    - Line 270: change `className={`${index % 2 === 1 ? 'md:translate-y-16' : ''}`}` to `className={index % 2 === 1 ? 'md:translate-y-16' : undefined}`.
  - In `src/features/contact/ContactForm.tsx`:
    - Line 28: change `onSubmit={(e) => e.preventDefault()}` to `onSubmit={(e) => { e.preventDefault(); }}`.
  - In `src/features/navigation/Nav.tsx`:
    - Line 24: change `releaseTimer.current = window.setTimeout(() => setIsPressed(false), Math.max(0, remaining));` to `releaseTimer.current = window.setTimeout(() => { setIsPressed(false); }, Math.max(0, remaining));`.
    - Lines 78, 86, 101, 134, 141, 155: wrap `handleSectionClick` calls in block braces `{ handleSectionClick(e, '...'); }`.
  - In `src/hooks/useGsapAnimations.ts`:
    - Line 35: change `ScrollTrigger.getAll().forEach((trigger) => trigger.kill());` to `ScrollTrigger.getAll().forEach((trigger) => { trigger.kill(); });`.
- **Mirror**: `src/App.tsx:77-80`
- **Validate**: `npm run build`

### Task 8: Configure `strictTypeChecked` and Type-Aware Linting in `eslint.config.js`

- **File**: `eslint.config.js`
- **Action**: UPDATE
- **Implement**:
  - In `eslint.config.js`:
    - Replace `tseslint.configs.recommended` with `tseslint.configs.strictTypeChecked`.
    - In `languageOptions`, add `parserOptions`:
      ```js
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      ```
    - In `rules`, add `@typescript-eslint/consistent-type-assertions` to enforce no type assertions (disallowing `as` casts while permitting `as const`):
      ```js
      rules: {
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          {
            assertionStyle: 'never',
          },
        ],
      },
      ```
- **Mirror**: `eslint.config.js:10-21`
- **Validate**: `npm run lint`

### Task 9: Full Verification Run

- **File**: Entire repository
- **Action**: VERIFY
- **Implement**:
  - Run `npm run check` to verify linting, design system class strings, `AGENTS.md` consistency, and build bundle generation.
  - Run the verify server and headless accessibility checks to ensure no visual regressions on blog tables.
- **Mirror**: `AGENTS.md:121-123`
- **Validate**: `npm run check`

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint

# Design System & Documentation checks
npm run check:design
npm run check:agents

# Comprehensive CI check
npm run check
```

## End-to-End Verification

1. Start the verification server:
   ```bash
   .claude/skills/verify/scripts/verify-server.sh start dev
   ```
2. Run the full verification suite covering tables, navigation, buttons, cursor, and hero:
   ```bash
   .claude/skills/verify/scripts/ax.sh all
   ```
   Confirm that all checks pass (exit 0), including `ax.sh tables` verifying that blog post tables do not overflow their containers on mobile or desktop viewports.
3. Verify mobile horizontal scrolling for tables:
   ```bash
   .claude/skills/verify/scripts/ax.sh mobile
   .claude/skills/verify/scripts/ax.sh open /blog/tralla
   .claude/skills/verify/scripts/ax.sh tables
   ```
4. Stop the verification server:
   ```bash
   .claude/skills/verify/scripts/verify-server.sh stop
   ```

---

## Risks

| Risk | Mitigation | In / Out of Scope |
|------|------------|-------------------|
| `noUncheckedIndexedAccess: true` or `exactOptionalPropertyTypes: true` causes compilation errors on unindexed access | Pre-tested with exploratory probe; current codebase compiles with 0 errors under both flags. | In-scope |
| ESLint type-aware linting fails on files outside `tsconfig` references | `tsconfig.json` references `tsconfig.app.json` (covers `src/`) and `tsconfig.node.json` (covers `vite.config.ts`). Verified in probe. | In-scope |
| Deleting `src/features/blog/components/index.ts` breaks component imports | Verified via grep that nothing imports the barrel; components are imported directly from `./components/PostCard` and `./components/ArticleHeader`. | In-scope |
| Removing table-wrapping effect causes mobile table layout overflow | Verified in `posts.ts` that all 4 post tables are already wrapped in `<div class="brutal-table-wrapper">`. End-to-end verified via `ax.sh tables`. | In-scope |
| Package rename leaves `package-lock.json` out of sync | Lockfile update is explicitly included in Task 2. | In-scope |

---

## Open Questions

- Should `@typescript-eslint/consistent-type-assertions` with `assertionStyle: 'never'` be enabled in `eslint.config.js`?
  - Proposed Default: Yes. The acceptance criteria state that `src/` has no type cast other than `as const`. While `strictTypeChecked` does not include this rule, adding `@typescript-eslint/consistent-type-assertions: ['error', { assertionStyle: 'never' }]` enforces the criterion in CI while allowing `as const` assertions.
- Should `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` be added to `tsconfig.node.json` as well?
  - Proposed Default: No. The issue acceptance criteria specifically require them in `tsconfig.app.json`. `tsconfig.node.json` only compiles `vite.config.ts`. Keeping it strictly scoped to `tsconfig.app.json` satisfies the criteria with minimal blast radius.

---

## Acceptance Criteria

- [ ] The table-wrapping code in the `BlogPost.tsx` effect, the `useInRouterContext` fallback link in `ProjectCard.tsx`, and `src/features/blog/components/index.ts` are removed.
- [ ] `src/` has no type cast other than `as const`, and `main.tsx` has no non-null assertion.
- [ ] `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` are on in `tsconfig.app.json`, and ESLint runs the `strictTypeChecked` preset with no errors.
- [ ] `src/App.css`, `src/index.css`, `src/assets/hero.png`, `src/assets/react.svg`, and `src/assets/vite.svg` are deleted, and `package.json` is named `swe-portfolio-website-2`.
- [ ] `npm run check` passes, and the pages look and behave as before, including blog tables scrolling sideways on mobile.
