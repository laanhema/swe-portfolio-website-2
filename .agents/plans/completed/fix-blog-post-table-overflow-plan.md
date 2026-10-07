# Plan: Fix Blog Post Table Overflow and Responsiveness on Mobile Viewports

## Summary

This plan addresses issue #74, where multi-column HTML tables rendered inside blog posts (`.brutal-prose`) overflow horizontally past page boundaries on narrow mobile viewports (320px–375px). We will implement a responsive table wrapper class (`.brutal-table-wrapper`) in `src/styles/global.css` with `overflow-x-auto` and `-webkit-overflow-scrolling: touch`, wrap existing tables in `src/features/blog/data/posts.ts`, and add DOM/wrapper post-processing or fallback handling in `src/features/blog/BlogPost.tsx` to ensure all current and future blog post tables scroll horizontally on mobile while retaining their 4px brutalist border styling and full width on desktop.

## User Story

As a mobile reader viewing blog posts on narrow viewports,
I want multi-column tables to fit within the viewport boundaries and scroll horizontally,
So that the page layout remains unclipped and clean while table data stays easily readable.

## Metadata

| Field | Value |
|-------|-------|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/styles/global.css`, `src/features/blog/BlogPost.tsx`, `src/features/blog/data/posts.ts` |
| GitHub Issue | #74 |
| PRD Phase | N/A |

---

## Patterns to Follow

### Naming
```css
// SOURCE: src/styles/global.css:88
.brutal-prose pre { @apply border-4 border-text-primary shadow-brutal bg-text-primary text-white p-6 overflow-x-auto font-mono text-[15px] leading-[1.7] font-normal; }
```

### Table Styling
```css
// SOURCE: src/styles/global.css:92-94
.brutal-prose table { @apply w-full border-4 border-text-primary text-base; }
.brutal-prose th { @apply bg-text-primary text-white uppercase text-left font-bold p-3; }
.brutal-prose td { @apply border-t-2 border-text-primary p-3; }
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/styles/global.css` | UPDATE | Add `.brutal-table-wrapper` with `overflow-x-auto` and `-webkit-overflow-scrolling: touch`, and adjust table styles to ensure full-width horizontal scrollability |
| `src/features/blog/data/posts.ts` | UPDATE | Wrap all `<table>...</table>` elements in `<div className="brutal-table-wrapper">` containers |
| `src/features/blog/BlogPost.tsx` | UPDATE | Ensure any rendered table within `.brutal-prose` is wrapped or styled dynamically for horizontal scrolling |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Add Table Scroll Wrapper Styles to Global CSS

- **File**: `src/styles/global.css`
- **Action**: UPDATE
- **Implement**: 
  - Add `.brutal-table-wrapper` class within `@layer utilities` or `.brutal-prose` utility block:
    ```css
    .brutal-table-wrapper {
      @apply w-full overflow-x-auto my-6;
      -webkit-overflow-scrolling: touch;
    }
    ```
  - Update `.brutal-prose table` styling to include `min-w-full` so tables don't collapse narrower than parent width inside scroll containers:
    ```css
    .brutal-prose table { @apply w-full min-w-full border-4 border-text-primary text-base; }
    ```
- **Mirror**: `src/styles/global.css:88` (mirroring `overflow-x-auto` pattern on `pre` code blocks)
- **Validate**: `npm run build && npm run lint`

### Task 2: Wrap Blog Post HTML Tables in Data File

- **File**: `src/features/blog/data/posts.ts`
- **Action**: UPDATE
- **Implement**: 
  - Wrap each `<table>...</table>` block across all blog posts (`tralla`, `design-brief-generator`, `sykli`, `lah-makkonen-homepage`) in `<div class="brutal-table-wrapper">...</div>`.
- **Mirror**: `src/features/blog/data/posts.ts:26-56`
- **Validate**: `npm run build && npm run lint`

### Task 3: Add Automatic Fallback Table Wrapping in BlogPost Component

- **File**: `src/features/blog/BlogPost.tsx`
- **Action**: UPDATE
- **Implement**:
  - In `BlogPost`, add a `useEffect` hook (or DOM ref transformation) targeting table elements within `.brutal-prose` that are not already enclosed in a `.brutal-table-wrapper` or `overflow-x-auto` element, automatically wrapping them.
  - This guarantees any third-party or future markdown HTML tables rendered dynamically remain responsive.
- **Mirror**: `src/features/blog/BlogPost.tsx:15-17`
- **Validate**: `npm run build && npm run lint`

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint
```

## End-to-End Verification

1. Run `npm run dev` to launch Vite dev server headlessly/locally.
2. Open blog post pages with tables (e.g. `/blog/tralla`, `/blog/sykli`, `/blog/design-brief-generator`, `/blog/lah-makkonen-homepage`) at mobile viewport dimensions (320px, 375px width).
3. Verify that table borders, headers, and text do not overflow or clip past page boundaries.
4. Verify that tables can be scrolled horizontally on mobile viewports while keeping page margins intact.
5. Verify that desktop layout (>768px) retains full width table presentation and brutalist border styling (`border-4 border-text-primary`).

---

## Risks

| Risk | Mitigation |
|------|------------|
| Table 4px border cut off at right scroll boundary inside overflow container | Set `min-w-full` on `.brutal-prose table` and ensure wrapper element has sufficient margin and clear padding so border renders intact |
| Dynamically injected HTML tables missing container wrapper | Implement `useEffect` DOM post-processing fallback in `BlogPost.tsx` to auto-wrap unwrapped `<table>` tags |

---

## Acceptance Criteria

- [ ] Blog post tables fit properly within view on mobile screens without overflowing the page layout or clipping content.
- [ ] Tables within `.brutal-prose` on blog posts are wrapped in or styled with responsive horizontal scrolling (`overflow-x-auto`).
- [ ] Table borders, headers, and cell content remain fully readable on narrow mobile screens (320px–375px) without breaking page container boundaries.
- [ ] Desktop table presentation retains full width and brutalist border styling (`border-4 border-text-primary`).
- [ ] `npm run lint` and `npm run build` pass cleanly.
