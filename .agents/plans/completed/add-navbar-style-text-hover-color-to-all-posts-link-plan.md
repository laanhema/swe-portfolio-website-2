# Plan: Add navbar-style text hover color to the "All posts" link

## Summary

Update the "← All posts" link in `ArticleHeader.tsx` and its design system preview HTML to include the desktop navigation bar's hover text color and transition (`hover:text-[#ff3e00] transition-colors`). This complements the animated underline bar added in issue #66, ensuring that the back link has identical hover styling (both orange text color change and orange animated underline) to the site's primary navigation header links.

## User Story

As a blog reader viewing article pages on laanhema.dev,
I want the "← All posts" back link to turn orange on hover just like the header navbar links,
So that hover feedback and styling are visually uniform across all navigation links on the site.

## Metadata

| Field | Value |
|---|---|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/features/blog/components/ArticleHeader.tsx`, `.agents/design-system/laanhema-design-system/components/ArticleHeader/preview.html` |
| GitHub Issue | #68 |
| PRD Phase | N/A |

---

## Patterns to Follow

### Navigation Bar Link Hover Pattern
```tsx
// SOURCE: src/features/navigation/Nav.tsx:49-53
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
// SOURCE: src/features/blog/components/ArticleHeader.tsx:80-86
<Link
  to="/blog"
  className="inline-flex items-center gap-2 font-bold uppercase tracking-wider mb-10 relative group"
>
  ← All posts
  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full"></span>
</Link>
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `src/features/blog/components/ArticleHeader.tsx` | UPDATE | Add `hover:text-[#ff3e00] transition-colors` to the "← All posts" `<Link>` element |
| `.agents/design-system/laanhema-design-system/components/ArticleHeader/preview.html` | UPDATE | Add `hover:text-[#ff3e00] transition-colors` to the preview `<a>` element |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update `ArticleHeader.tsx` component

- **File**: `src/features/blog/components/ArticleHeader.tsx`
- **Action**: UPDATE
- **Implement**:
  - Add `hover:text-[#ff3e00] transition-colors` to the `<Link to="/blog">` `className` (resulting in `className="inline-flex items-center gap-2 font-bold uppercase tracking-wider mb-10 hover:text-[#ff3e00] transition-colors relative group"`).
  - Preserve the nested animated underline `<span>` element (`<span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#ff3e00] transition-all group-hover:w-full"></span>`).
- **Mirror**: `src/features/navigation/Nav.tsx:49-53`
- **Validate**: `npm run lint && npm run build`

### Task 2: Update `preview.html` in design system

- **File**: `.agents/design-system/laanhema-design-system/components/ArticleHeader/preview.html`
- **Action**: UPDATE
- **Implement**:
  - Update line 6 `<a>` element: add `hover:text-[#ff3e00] transition-colors` to the class list (resulting in `class="inline-flex items-center gap-2 font-bold uppercase tracking-wider mb-10 hover:text-[#ff3e00] transition-colors relative group"`).
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
2. Inspect `ArticleHeader.tsx` and `preview.html` to verify that `hover:text-[#ff3e00] transition-colors` is present on the "← All posts" link alongside `relative group` and the nested underline `<span>`.

---

## Risks

| Risk | Mitigation |
|---|---|
| Hovering the link conflicts between text color transition and underline expansion animation | Both use standard CSS transitions (`transition-colors` on the parent text and `transition-all` on the child span) and animate harmoniously, matching `Nav.tsx` |

---

## Open Questions

None. Spec and acceptance criteria from issue #68 explicitly specify matching the navbar text hover styling (`#ff3e00` with transition).

---

## Acceptance Criteria

- [ ] Hovering the "← All posts" link changes the link text color to `#ff3e00` with a smooth color transition (`hover:text-[#ff3e00] transition-colors`), matching the desktop navbar links.
- [ ] The existing animated orange underline hover effect (`h-1 bg-[#ff3e00]`) remains intact and animates concurrently with the text color change.
- [ ] Keyboard focus styling remains accessible and visible (`focus-visible`).
- [ ] The ArticleHeader `preview.html` in the design system is updated to include the matching classes.
- [ ] `npm run lint` and `npm run build` pass without errors.
