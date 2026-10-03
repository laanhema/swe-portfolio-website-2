# Plan: Remove Twitter / X Buttons and Social Links Across the Site

## Summary

Remove Twitter/X social links, buttons, and icons across the entire site. The developer does not use Twitter/X. This includes removing the Twitter/X button from the hero section social icon group in `src/App.tsx`, removing the Twitter links from the site footers (`src/App.tsx`, `src/features/blog/BlogIndex.tsx`, and `src/features/blog/BlogPost.tsx`), and removing the unused `TwitterIcon` export from `src/components/Icons.tsx`.

## User Story

As a portfolio owner,
I want to eliminate Twitter/X links and buttons across my portfolio,
So that visitors are only directed to the platforms I actually use (GitHub, LinkedIn, and direct contact).

## Metadata

| Field | Value |
|---|---|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/App.tsx`, `src/features/blog/BlogIndex.tsx`, `src/features/blog/BlogPost.tsx`, `src/components/Icons.tsx` |
| GitHub Issue | #57 |

---

## Patterns to Follow

### Hero Social Links Group
```tsx
// SOURCE: src/App.tsx:128-155
<div className='flex items-center gap-4 flex-nowrap'>
  <a
    href='https://github.com/laanhema'
    target='_blank'
    rel='noopener noreferrer'
    className='bg-white brutal-border p-4 brutal-shadow brutal-shadow-hover text-[#121212] flex items-center justify-center'
    aria-label='GitHub'
  >
    <GithubIcon />
  </a>
  {/* Remaining icons maintain identical brutal-border, p-4, brutal-shadow brutal-shadow-hover */}
</div>
```

### Footer Social Links
```tsx
// SOURCE: src/App.tsx:246-265, src/features/blog/BlogIndex.tsx:58-83, src/features/blog/BlogPost.tsx:52-77, 108-133
<div className='flex gap-6 font-bold uppercase'>
  <a
    href='https://github.com/laanhema'
    target='_blank'
    rel='noopener noreferrer'
    className='hover:text-[#ff3e00] transition-colors'
  >
    GitHub
  </a>
  <a
    href='https://www.linkedin.com/in/laanhema'
    target='_blank'
    rel='noopener noreferrer'
    className='hover:text-[#ff3e00] transition-colors'
  >
    LinkedIn
  </a>
</div>
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/App.tsx` | UPDATE | Remove `TwitterIcon` from imports, remove Twitter button from hero social links, remove Twitter link from footer navigation. |
| `src/features/blog/BlogIndex.tsx` | UPDATE | Remove Twitter link from footer navigation. |
| `src/features/blog/BlogPost.tsx` | UPDATE | Remove Twitter link from 404 footer navigation and main article footer navigation. |
| `src/components/Icons.tsx` | UPDATE | Remove unused `TwitterIcon` SVG component export. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update `src/App.tsx`

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Remove `TwitterIcon` from imports on line 9 (`import { GithubIcon, LinkedinIcon } from './components/Icons';`).
  - In hero section (around lines 138-146), remove the anchor tag for Twitter (`href='https://twitter.com'`, `aria-label='Twitter'`).
  - In footer section (around lines 253-258), remove the anchor tag for Twitter (`href='https://twitter.com'`).
  - Ensure remaining hero icons (GitHub, LinkedIn) retain clean horizontal alignment, spacing (`gap-4 flex-nowrap`), and brutalist borders/shadows.
- **Mirror**: `src/App.tsx:128-155`
- **Validate**: `npm run lint`

### Task 2: Update `src/features/blog/BlogIndex.tsx`

- **File**: `src/features/blog/BlogIndex.tsx`
- **Action**: UPDATE
- **Implement**:
  - In footer navigation (around lines 67-74), remove the anchor tag for Twitter (`href="https://twitter.com"`).
  - Retain GitHub and LinkedIn links with `gap-6 font-bold uppercase` layout.
- **Mirror**: `src/features/blog/BlogIndex.tsx:58-83`
- **Validate**: `npm run lint`

### Task 3: Update `src/features/blog/BlogPost.tsx`

- **File**: `src/features/blog/BlogPost.tsx`
- **Action**: UPDATE
- **Implement**:
  - In the 404 state footer (around lines 61-68), remove the Twitter anchor tag.
  - In the main article view footer (around lines 117-124), remove the Twitter anchor tag.
  - Retain GitHub and LinkedIn links in both footers.
- **Mirror**: `src/features/blog/BlogPost.tsx:52-77`, `108-133`
- **Validate**: `npm run lint`

### Task 4: Update `src/components/Icons.tsx`

- **File**: `src/components/Icons.tsx`
- **Action**: UPDATE
- **Implement**:
  - Remove `TwitterIcon` export (`export const TwitterIcon = ...`).
  - Keep `GithubIcon`, `LinkedinIcon`, and `MailIcon`.
- **Mirror**: `src/components/Icons.tsx`
- **Validate**: `npm run lint && npm run build`

---

## Validation

```bash
# Type check and Production Build
npm run build

# Lint
npm run lint
```

## End-to-End Verification

1. Verify `npm run lint` passes with 0 errors and 0 warnings.
2. Verify `npm run build` succeeds cleanly.
3. Grep for `Twitter`, `twitter`, `x.com` across `src/` to confirm zero remaining occurrences.
4. Verify hero section layout in `src/App.tsx` has two social buttons (GitHub and LinkedIn) properly styled.

---

## Risks

| Risk | Mitigation | In-Scope / Out-of-Scope |
|---|---|---|
| Broken imports if other components use `TwitterIcon` | Audited codebase — only `App.tsx` previously imported `TwitterIcon`. Removed in Task 1. | In-Scope |
| Alignment or layout shift in hero section | Hero container uses `flex items-center gap-4 flex-nowrap`. Removing one item maintains consistent flex layout. | In-Scope |

---

## Open Questions

None. The requirements from Issue #57 and TODO.md:20 are completely clear and unambiguous.

---

## Acceptance Criteria

- [ ] Remove Twitter/X icon button from hero social links in `src/App.tsx`.
- [ ] Remaining hero social links (GitHub, LinkedIn) maintain clean horizontal alignment, spacing, and brutalist borders/shadows.
- [ ] Remove Twitter link from footer navigation in `src/App.tsx`, `src/features/blog/BlogIndex.tsx`, and `src/features/blog/BlogPost.tsx`.
- [ ] Clean up unused `TwitterIcon` imports and remove `TwitterIcon` in `src/components/Icons.tsx`.
- [ ] `npm run lint` and `npm run build` pass with zero errors.
