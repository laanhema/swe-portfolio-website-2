# Plan: Fix Alignment and Row Wrapping of Hero Social Icon Boxes

## Summary

Resolve intermittent alignment and line-wrapping issues with the hero section's social media icon buttons (GitHub, Twitter, LinkedIn) in `src/App.tsx`. The social icons container currently lacks explicit alignment and nowrap constraints (`flex gap-4`), and its parent container (`flex flex-wrap gap-6 animate-on-scroll`) does not set vertical item alignment (`items-center`), allowing cross-axis stretching between the "View Work" CTA and the social button group, as well as potential wrapping of the icons onto multiple lines. Setting `items-center` on the parent container, `items-center flex-nowrap` on the social icon buttons container, and `flex items-center justify-center` on each icon button anchor tag ensures the social icons consistently form a clean, single horizontal line that centers harmoniously alongside the "View Work" CTA button on both desktop and mobile viewports.

## User Story

As a visitor viewing the portfolio across different viewport sizes,
I want the hero social icon buttons (GitHub, Twitter, LinkedIn) to always form a single straight horizontal row that vertically aligns with the "View Work" CTA,
So that the hero section displays a polished, high-craft, and consistent layout without awkward line wrapping or baseline misalignment.

## Metadata

| Field | Value |
|---|---|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/App.tsx` |
| GitHub Issue | #6 |

---

## Patterns to Follow

### Hero Action & Social Buttons in `src/App.tsx`
```tsx
// SOURCE: src/App.tsx:84-120
<div className='flex flex-wrap gap-6 animate-on-scroll'>
  <a
    href='#work'
    className='bg-[#121212] text-white px-8 py-4 text-xl font-bold uppercase brutal-shadow brutal-shadow-hover'
  >
    View Work
  </a>
  <div className='flex gap-4'>
    <a
      href='https://github.com/laanhema'
      target='_blank'
      rel='noopener noreferrer'
      className='bg-white brutal-border p-4 brutal-shadow brutal-shadow-hover text-[#121212]'
      aria-label='GitHub'
    >
      <GithubIcon />
    </a>
    <a
      href='https://twitter.com'
      target='_blank'
      rel='noopener noreferrer'
      className='bg-white brutal-border p-4 brutal-shadow brutal-shadow-hover text-[#121212]'
      aria-label='Twitter'
    >
      <TwitterIcon />
    </a>
    <a
      href='https://www.linkedin.com/in/laanhema'
      target='_blank'
      rel='noopener noreferrer'
      className='bg-white brutal-border p-4 brutal-shadow brutal-shadow-hover text-[#121212]'
      aria-label='LinkedIn'
    >
      <LinkedinIcon />
    </a>
  </div>
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
| `src/App.tsx` | UPDATE | Add `items-center` to hero CTA wrapper, add `items-center flex-nowrap` to social container, and add `flex items-center justify-center` to social icon link buttons. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update flex layout and alignment classes in `src/App.tsx`
- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Update the parent wrapper at line 84:
    - Change `<div className='flex flex-wrap gap-6 animate-on-scroll'>` to `<div className='flex flex-wrap items-center gap-6 animate-on-scroll'>`.
  - Update the social icon container at line 91:
    - Change `<div className='flex gap-4'>` to `<div className='flex items-center gap-4 flex-nowrap'>`.
  - Ensure each social link `<a>` tag has `flex items-center justify-center`:
    - `className='bg-white brutal-border p-4 brutal-shadow brutal-shadow-hover text-[#121212] flex items-center justify-center'`
- **Mirror**: `src/App.tsx:84-120` and `src/features/showcase/ProjectCard.tsx:54`
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

1. Run `npm run build` and verify TypeScript compilation and Vite production bundling succeed with 0 errors.
2. Run `npm run lint` and verify ESLint reports 0 errors and 0 warnings.
3. Check responsive layout and element alignment across viewports:
   - On wide desktop viewports (>=1024px), verify the "View Work" CTA and the 3 social icon buttons are centered along the horizontal axis on a single row.
   - On intermediate / tablet viewports (640px–1024px), verify the 3 social buttons remain in a straight horizontal line.
   - On narrow mobile viewports (320px–480px), if the CTA and social buttons wrap, verify the 3 social buttons stay in a single row without wrapping amongst themselves.
   - Verify brutalist hover offset (`brutal-shadow-hover`) and active press states function without clipping or permanent layout displacement.

---

## Risks

| Risk | Mitigation |
|---|---|
| Unintended overflow on extremely narrow viewports (e.g. 320px) | `View Work` + gap + 3 icon buttons wraps naturally via `flex-wrap` on the outer container. The 3 icon buttons combined with gaps occupy only ~224px, fitting well within 320px screen width. |

---

## Open Questions

None. PRD, TODO.md:5, and GitHub Issue #6 technical notes explicitly describe the required `items-center` and `flex-nowrap` layout fix.

---

## Acceptance Criteria

- [ ] All hero social icon buttons stay in a single, straight horizontal row without unexpected wrapping or offsets.
- [ ] Social icon group aligns properly with the "View Work" CTA button on both desktop and mobile viewports.
- [ ] Brutalist hover offsets and shadows do not cause permanent layout shift or clipping.
- [ ] `npm run build` and `npm run lint` pass with 0 errors.
