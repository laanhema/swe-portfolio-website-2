# Plan: Add Design Tokens and .brutal-prose Typography Styles to global.css

## Summary

Add the missing `@theme` color tokens (`--color-accent-cyan: #00e5ff`, `--color-accent-yellow: #facc15`, `--color-accent-purple: #a855f7`) and integrate the complete `.brutal-prose` typography styling layer into `src/styles/global.css`. This equips the application with the complete neo-brutalist styling foundation required for markdown formatting, blog posts, devlogs, headings, lists, tables, blockquotes, and code blocks as specified in the design system.

## User Story

As a developer and site visitor,
I want the global stylesheet to include the design system's accent color tokens and `.brutal-prose` typography rules,
So that rich content, technical write-ups, and devlog articles render with consistent neo-brutalist aesthetics across all viewport sizes.

## Metadata

| Field | Value |
|---|---|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/styles/global.css` |
| GitHub Issue | #35 |

---

## Patterns to Follow

### Design System Token Definitions
```css
// SOURCE: .agents/design-system/laanhema-design-system/DESIGN.md:27
// Accent rotation for card fills: accent (#ff3e00) -> accent-cyan (#00e5ff) -> accent-yellow (#facc15) -> accent-purple (#a855f7)
```

### Existing `@theme` Block in `src/styles/global.css`
```css
// SOURCE: src/styles/global.css:3-10
@theme {
  --color-bg-primary: #f8f9fa;
  --color-text-primary: #121212;
  --color-accent: #ff3e00;

  --shadow-brutal: 6px 6px 0px 0px #121212;
  --shadow-brutal-sm: 3px 3px 0px 0px #121212;
}
```

### Reference `.brutal-prose` Stylesheet
```css
// SOURCE: .agents/design-system/laanhema-design-system/styles/brutal-prose.css:4-23
@layer components {
  .brutal-prose { @apply max-w-3xl text-lg md:text-xl leading-relaxed font-medium; }
  .brutal-prose > * + * { @apply mt-6; }
  .brutal-prose h2 { @apply mt-16 text-3xl md:text-4xl font-bold uppercase leading-tight tracking-tight; }
  .brutal-prose h3 { @apply mt-12 text-2xl font-bold uppercase tracking-tight; }
  .brutal-prose h2 + *, .brutal-prose h3 + * { @apply mt-4; }
  .brutal-prose a { @apply font-bold underline decoration-4 underline-offset-4 decoration-accent hover:bg-[#facc15]; }
  .brutal-prose strong { @apply font-bold; }
  .brutal-prose ul { @apply list-[square] pl-6 marker:text-accent; }
  .brutal-prose ol { @apply list-decimal pl-6 marker:font-bold; }
  .brutal-prose li + li { @apply mt-2; }
  .brutal-prose blockquote { @apply border-l-8 border-accent pl-6 text-2xl font-bold leading-snug; }
  .brutal-prose :not(pre) > code { @apply font-mono text-[0.85em] bg-white border-2 border-text-primary px-1.5 py-0.5; }
  .brutal-prose pre { @apply border-4 border-text-primary shadow-brutal bg-text-primary text-white p-6 overflow-x-auto font-mono text-[15px] leading-[1.7] font-normal; }
  .brutal-prose hr { @apply border-0 border-t-4 border-text-primary my-16; }
  .brutal-prose figure img { @apply border-4 border-text-primary shadow-brutal w-full; }
  .brutal-prose figcaption { @apply mt-4 text-sm font-bold uppercase tracking-wider; }
  .brutal-prose table { @apply w-full border-4 border-text-primary text-base; }
  .brutal-prose th { @apply bg-text-primary text-white uppercase text-left font-bold p-3; }
  .brutal-prose td { @apply border-t-2 border-text-primary p-3; }
}
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `src/styles/global.css` | UPDATE | Add accent tokens to `@theme` and add `.brutal-prose` rules to `@layer components`. |

---

## Tasks

### Task 1: Add Accent Color Tokens to `@theme` in `src/styles/global.css`

- **File**: `src/styles/global.css`
- **Action**: UPDATE
- **Implement**:
  Add `--color-accent-cyan: #00e5ff;`, `--color-accent-yellow: #facc15;`, and `--color-accent-purple: #a855f7;` inside the `@theme` block.
- **Validate**: `npm run build`

### Task 2: Add `.brutal-prose` Component Classes to `src/styles/global.css`

- **File**: `src/styles/global.css`
- **Action**: UPDATE
- **Implement**:
  Incorporate the `.brutal-prose` typography utility declarations into `@layer components` in `src/styles/global.css`.
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

1. Run `npm run build` and ensure Tailwind v4 compiles CSS without warnings or syntax errors.
2. Verify that generated `dist/assets/index-*.css` contains `--color-accent-cyan`, `--color-accent-yellow`, `--color-accent-purple`, and `.brutal-prose` rules.

---

## Risks

| Risk | Mitigation |
|---|---|
| Tailwind v4 `@apply` errors with `@theme` values or custom utilities | Verified that existing classes in `global.css` already use `@apply border-4 border-text-primary;` and `@theme` provides tokens cleanly. Test with `npm run build`. |

---

## Acceptance Criteria

- [ ] `--color-accent-cyan: #00e5ff`, `--color-accent-yellow: #facc15`, and `--color-accent-purple: #a855f7` are added to `@theme` in `src/styles/global.css`.
- [ ] `.brutal-prose` component styles are copied directly into `@layer components` in `src/styles/global.css`.
- [ ] Headings, blockquotes, inline code, preformatted code blocks, tables, and links within `.brutal-prose` conform to the design system specification.
- [ ] `npm run lint` and `npm run build` compile without errors or warnings.
