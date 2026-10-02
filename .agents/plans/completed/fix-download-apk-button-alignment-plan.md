# Plan: Fix "Download APK" Button Text Alignment and Wrapping in ProjectCard

## Summary

Update the action button styling in `src/features/showcase/ProjectCard.tsx` to ensure button labels—specifically the "Download APK" button on the GymBro App card—are always centered horizontally and vertically, even when text wraps onto multiple lines on narrower viewports or mobile screens. Adding `text-center`, `leading-tight`, and horizontal padding (`px-3`) to both the repository/code and live action buttons ensures that multi-line text within the flex container maintains proper center alignment, prevents text touching borders, and ensures both action buttons maintain clean, consistent height and alignment across all project cards.

## User Story

As a visitor viewing project cards on mobile or narrower viewports,
I want the "Download APK" and other action button labels to be cleanly centered and properly formatted,
So that the action buttons look polished, professional, and consistent with the site's neo-brutalist aesthetic.

## Metadata

| Field | Value |
|---|---|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/features/showcase/ProjectCard.tsx` |
| GitHub Issue | #13 |

---

## Patterns to Follow

### Existing Button Layout in `src/features/showcase/ProjectCard.tsx`
```tsx
// SOURCE: src/features/showcase/ProjectCard.tsx:49-70
<div className="flex gap-4 mt-auto">
  <a 
    href={repoUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex-1 bg-white brutal-border py-3 flex items-center justify-center gap-2 font-bold uppercase brutal-shadow hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#121212] transition-all"
  >
    <GithubIcon className="w-5 h-5" />
    <span>Code</span>
  </a>
  
  {liveUrl && (
    <a 
      href={liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 bg-[#121212] text-white border-4 border-[#121212] py-3 flex items-center justify-center font-bold uppercase brutal-shadow hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#121212] transition-all"
    >
      {liveLabel}
    </a>
  )}
</div>
```

### Validation Commands
```bash
# SOURCE: package.json:8-9
npm run lint
npm run build
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `src/features/showcase/ProjectCard.tsx` | UPDATE | Add `text-center`, `leading-tight`, `px-3`, and `shrink-0` on icon to ensure proper alignment and wrapping behavior for action buttons. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update Action Button Styles in `ProjectCard.tsx`

- **File**: `src/features/showcase/ProjectCard.tsx`
- **Action**: UPDATE
- **Implement**:
  - In `repoUrl` anchor: add `text-center`, `leading-tight`, and `px-3` to `className`. Add `shrink-0` to `<GithubIcon>`.
  - In `liveUrl` anchor: add `text-center`, `leading-tight`, and `px-3` to `className`. Wrap `{liveLabel}` in a `<span>` or keep as centered text node.
- **Mirror**: `src/features/showcase/ProjectCard.tsx:49-70`
- **Validate**: `npm run lint && npm run build`

### Task 2: Validate Build and Lint

- **File**: N/A
- **Action**: VALIDATE
- **Implement**: Run ESLint and TypeScript/Vite build to verify there are no compilation or lint errors.
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

1. Verify TypeScript compilation and Vite production build pass cleanly with `npm run build`.
2. Verify ESLint passes cleanly with `npm run lint`.
3. Verify that on narrow viewports where "Download APK" wraps to two lines ("DOWNLOAD" / "APK"), both lines remain centered horizontally and vertically within the button container.
4. Verify that the adjacent "Code" button remains vertically centered and stretches to match the height of the row.

---

## Risks

| Risk | Mitigation |
|---|---|
| Excessive padding could cause premature wrapping on mobile screens | Use compact horizontal padding `px-3` (12px) paired with `leading-tight` so wrapping only occurs when width truly requires it, and looks intentional. |

---

## Acceptance Criteria

- [ ] "Download APK" label is perfectly centered horizontally and vertically within its button.
- [ ] Button handles variable text lengths cleanly without overflowing or misaligning on smaller screens.
- [ ] Action buttons maintain consistent height and alignment across all project cards.
- [ ] `npm run lint` passes without errors or warnings.
- [ ] `npm run build` compiles successfully.
