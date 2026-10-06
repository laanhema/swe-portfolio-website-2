# Plan: Add navbar-style underline hover effect to the "All posts" link

## Summary

Update the "← All posts" link in `ArticleHeader.tsx` and its design system preview HTML to use the desktop navigation bar's animated underline hover effect (`relative group` on the link container and a nested `absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full` span element). This replaces the static CSS `hover:underline` with a dynamic 4px orange bar growing from left to right on hover across the entire link, aligning hover feedback across the site while maintaining visible focus indicators.

## User Story

As a blog reader navigating article pages on laanhema.dev,
I want the "← All posts" back link to feature the same animated underline hover effect as the primary navigation bar,
So that hover feedback is visually consistent across the portfolio application.

## Metadata

| Field | Value |
|---|---|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/features/blog/components/ArticleHeader.tsx`, `.agents/design-system/laanhema-design-system/components/ArticleHeader/preview.html` |
| GitHub Issue | #66 |
| PRD Phase | N/A |

---

## Patterns to Follow

### Navigation Bar Underline Pattern
```tsx
// SOURCE: src/features/navigation/Nav.tsx:46-53
<Link
  to='/#work'
  onClick={(e) => handleSectionClick(e, 'work')}
  className='hover:text-[#ff3e00] transition-colors relative group'
>
  Work
  <span className='absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full'></span>
</Link>
```

### Current ArticleHeader Link Pattern
```tsx
// SOURCE: src/features/blog/components/ArticleHeader.tsx:80-85
<Link
  to="/blog"
  className="inline-flex items-center gap-2 font-bold uppercase tracking-wider mb-10 hover:underline decoration-4 underline-offset-4 decoration-[#ff3e00]"
>
  ← All posts
</Link>
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `src/features/blog/components/ArticleHeader.tsx` | UPDATE | Replace static hover underline with `relative group` and nested animated underline span |
| `.agents/design-system/laanhema-design-system/components/ArticleHeader/preview.html` | UPDATE | Update design system preview HTML markup to match updated component classes |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update `ArticleHeader.tsx` component

- **File**: `src/features/blog/components/ArticleHeader.tsx`
- **Action**: UPDATE
- **Implement**:
  - Remove `hover:underline decoration-4 underline-offset-4 decoration-[#ff3e00]` from the `<Link to="/blog">` `className`.
  - Add `relative group` to the `<Link to="/blog">` `className` (resulting in `className="inline-flex items-center gap-2 font-bold uppercase tracking-wider mb-10 relative group"`).
  - Append `<span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full"></span>` inside the `<Link>` container.
- **Mirror**: `src/features/navigation/Nav.tsx:46-53`
- **Validate**: `npm run lint && npm run build`

### Task 2: Update `preview.html` in design system

- **File**: `.agents/design-system/laanhema-design-system/components/ArticleHeader/preview.html`
- **Action**: UPDATE
- **Implement**:
  - Update line 6 `<a>` element: replace `class="inline-flex items-center gap-2 font-bold uppercase tracking-wider mb-10 hover:underline decoration-4 underline-offset-4 decoration-[#ff3e00]"` with `class="inline-flex items-center gap-2 font-bold uppercase tracking-wider mb-10 relative group"`.
  - Append `<span class="absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full"></span>` inside the `<a>` element before `</a>`.
- **Mirror**: `.agents/design-system/laanhema-design-system/components/NavBar/preview.html`
- **Validate**: `npm run build`

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint
```

## End-to-End Verification

1. Execute `npm run lint` and `npm run build` to confirm TypeScript compilation and ESLint pass without warnings or errors.
2. Inspect `ArticleHeader.tsx` and `preview.html` to confirm removal of `hover:underline` classes and inclusion of `relative group` with the `absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full` span element.

---

## Risks

| Risk | Mitigation |
|---|---|
| Absolutely positioned underline span alters flex alignment or height | `absolute -bottom-1 left-0` positions the bar outside normal inline-flex flow without affecting layout spacing |
| Accidental inclusion of text color change (`hover:text-[#ff3e00]`) | Explicitly omit text color transition on hover as specified in issue #66 technical notes |

---

## Open Questions

None. Spec and technical notes explicitly specify copying the navbar underline effect (`relative group` + nested span) without copying `hover:text-[#ff3e00]`.

---

## Acceptance Criteria

- [ ] Hovering "← All posts" grows a 4px (`h-1`) orange bar from left to full width beneath the link, matching the desktop navbar links.
- [ ] The current `hover:underline decoration-4 …` underline is removed, so only the animated bar shows.
- [ ] The link keeps a visible keyboard focus indicator.
- [ ] The ArticleHeader `preview.html` in the design system reflects the new class strings.
- [ ] `npm run lint` and `npm run build` pass.
