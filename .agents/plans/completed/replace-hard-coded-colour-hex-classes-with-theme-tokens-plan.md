# Plan: Replace Hard-Coded Colour Hex Classes with Theme Tokens

## Summary

In preparation for runtime light/dark theme switching (#114), this refactor eliminates all 96 arbitrary Tailwind colour hex classes (`[#hex]`) across 10 files in `src/` and transitions them to the `@theme` semantic tokens already established in `src/styles/global.css`. Specifically, hard-coded values (`bg-[#121212]`, `text-[#ff3e00]`, `bg-[#f8f9fa]`, `text-[#00e5ff]`, `bg-[#facc15]`, etc.) are mapped to their corresponding `@theme` utilities (`bg-text-primary`, `text-accent`, `bg-bg-primary`, `text-accent-cyan`, `bg-accent-yellow`, etc.). Furthermore, `--shadow-brutal` and active press shadows in `global.css` and `playPress.ts` are updated to reference `var(--color-text-primary)`, and post accent colour properties are aligned with theme variables. The design-system component documentation (`README.md` and `preview.html`) is synchronized in lockstep to keep `scripts/check-design-system.mjs` green, ensuring zero visual deviation on `/`, `/blog`, and `/blog/tralla` while establishing full token-based styling.

## User Story

As a software engineer maintaining the portfolio website,
I want all UI component colours and brutalist shadows to use semantic `@theme` tokens instead of hard-coded hex classes,
So that runtime theme switching (such as dark mode in #114) can dynamically alter the palette without requiring component-level refactoring.

## Metadata

| Field | Value |
|---|---|
| Type | REFACTOR |
| Complexity | MEDIUM |
| Systems Affected | `src/styles/global.css`, `src/components/`, `src/features/`, `.agents/design-system/laanhema-design-system/` |
| GitHub Issue | #113 |
| PRD Phase | N/A |
| Prototype Patch | N/A |

---

## Environment Findings

| Probe | Command / Check | Result |
|---|---|---|
| Baseline full check | `npm run check` | PASS (lint, check:design, check:agents, build all green) |
| Verify harness suite | `.claude/skills/verify/scripts/ax.sh all` | PASS (tables, nav, buttons hover lift, cursor, submit, hero tests green) |
| Hard-coded hex class count on HEAD | `grep -rnE '\[#[0-9a-fA-F]{3,8}\]' src/ \| wc -l` | RED / 96 occurrences across 10 files |
| Post-refactor expected hex class count | `! grep -rnE '\[#[0-9a-fA-F]{3,8}\]' src/` | GREEN / 0 occurrences remaining |

---

## Patterns to Follow

### Naming
```css
// SOURCE: src/styles/global.css:3-15
@theme {
  --color-bg-primary: #f8f9fa;
  --color-text-primary: #121212;
  --color-accent: #ff3e00;
  --color-accent-cyan: #00e5ff;
  --color-accent-yellow: #facc15;
  --color-accent-purple: #a855f7;

  --font-sans: 'Noto Sans Variable', system-ui, sans-serif;

  --shadow-brutal: 6px 6px 0px 0px #121212;
  --shadow-brutal-sm: 3px 3px 0px 0px #121212;
}
```

```css
// SOURCE: src/styles/global.css:45-47
@layer components {
  .brutal-border {
    @apply border-4 border-text-primary;
  }
```

### Error Handling & Form Validity
```tsx
// SOURCE: src/features/contact/ContactForm.tsx:87-89
onInput={(e) => {
  e.currentTarget.setCustomValidity('');
}}
```

### Verification & Documentation Checks
```javascript
// SOURCE: scripts/check-design-system.mjs:20-29
readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
  for (const [, span] of line.matchAll(/`([^`]+)`/g)) {
    const tokens = span.split(/\s+/).filter((t) => t !== '…');
    if (tokens.length < 2 || !tokens.every((t) => TOKEN.test(t)) || PLACEHOLDER.test(span)) continue;
    checked++;
    const missing = span.split('…').map((part) => part.trim()).filter((part) => part && !source.includes(part));
    if (missing.length) stale.push(`${file}:${i + 1}: \`${missing.join('` and `')}\``);
  }
});
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `src/styles/global.css` | UPDATE | Point `--shadow-brutal`, `--shadow-brutal-sm`, and press shadow to `var(--color-text-primary)`; replace `hover:bg-[#facc15]` with `hover:bg-accent-yellow`. |
| `src/components/Footer.tsx` | UPDATE | Replace `bg-[#121212]` and `hover:text-[#ff3e00]` with `bg-text-primary` and `hover:text-accent`. |
| `src/components/playPress.ts` | UPDATE | Update keyframe `boxShadow` from `#121212` to `var(--color-text-primary)`. |
| `src/features/navigation/Nav.tsx` | UPDATE | Replace 8 instances of `bg-[#f8f9fa]`, `border-[#121212]`, `text-[#ff3e00]`, and `bg-[#ff3e00]` with semantic tokens. |
| `src/features/contact/ContactForm.tsx` | UPDATE | Replace 7 instances of `border-[#121212]`, `text-[#ff3e00]`, `bg-[#f8f9fa]`, and `bg-[#ff3e00]` with semantic tokens. |
| `src/App.tsx` | UPDATE | Replace 11 instances of hex classes in hero, about, and showcase sections; update `PROJECTS` `color` properties to CSS variable tokens. |
| `src/features/showcase/ProjectCard.tsx` | UPDATE | Replace `bg-[#121212]` and `border-[#121212]` on the Code button with `bg-text-primary` and `border-text-primary`. |
| `src/features/blog/BlogIndex.tsx` | UPDATE | Replace `bg-[#f8f9fa]`, `text-[#121212]`, `selection:bg-[#ff3e00]`, and `text-[#ff3e00]` with semantic tokens. |
| `src/features/blog/BlogPost.tsx` | UPDATE | Replace 5 instances of hex classes in 404 block and main layout wrapper with semantic tokens. |
| `src/features/blog/components/ArticleHeader.tsx` | UPDATE | Replace 6 instances of `text-[#ff3e00]`, `hover:text-[#ff3e00]`, `bg-[#ff3e00]`, and `border-[#ff3e00]` with `text-accent`, `bg-accent`, `border-accent`. |
| `src/features/blog/data/posts.ts` | UPDATE | Replace 51 inline HTML syntax highlight classes (`text-[#00e5ff]`, `text-[#facc15]`, `text-[#ff3e00]`) with `text-accent-cyan`, `text-accent-yellow`, `text-accent`; update `accentColor` values to CSS variables. |
| `.agents/design-system/laanhema-design-system/components/*/README.md` | UPDATE | Update 12 component documentation files to use semantic token classes so `check-design-system.mjs` passes. |
| `.agents/design-system/laanhema-design-system/components/*/preview.html` | UPDATE | Update component preview HTML templates to match updated class names. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update global CSS shadow and prose hover tokens
- **File**: `src/styles/global.css`
- **Action**: UPDATE
- **Implement**:
  1. In `src/styles/global.css:13-14`, update `--shadow-brutal` and `--shadow-brutal-sm` to use `var(--color-text-primary)`:
     `--shadow-brutal: 6px 6px 0px 0px var(--color-text-primary);`
     `--shadow-brutal-sm: 3px 3px 0px 0px var(--color-text-primary);`
  2. In `src/styles/global.css:56`, update the active/data-pressed box-shadow:
     `box-shadow: 0px 0px 0px 0px var(--color-text-primary);`
  3. In `src/styles/global.css:83`, replace `.brutal-prose a` hover class `hover:bg-[#facc15]` with `hover:bg-accent-yellow`.
  4. Preserve all `@theme` `--color-*` hex declarations so `scripts/check-agents-md.mjs` continues to pass.
- **Mirror**: `src/styles/global.css:45-47`
- **Validate**: `npm run build && npm run check:agents`

### Task 2: Replace hex classes in shared layout components (Footer, Nav, playPress)
- **File**: `src/components/Footer.tsx`, `src/features/navigation/Nav.tsx`, `src/components/playPress.ts`
- **Action**: UPDATE
- **Implement**:
  1. In `src/components/Footer.tsx`:
     - Line 10: `bg-[#121212]` -> `bg-text-primary`
     - Line 14: `text-[#ff3e00]` -> `text-accent`
     - Lines 24, 32: `hover:text-[#ff3e00]` -> `hover:text-accent`
  2. In `src/features/navigation/Nav.tsx`:
     - Line 60: `bg-[#f8f9fa] border-b-4 border-[#121212]` -> `bg-bg-primary border-b-4 border-text-primary`
     - Line 65: `hover:text-[#ff3e00]` -> `hover:text-accent`, `focus-visible:outline-[#ff3e00]` -> `focus-visible:outline-accent`
     - Line 68: `text-[#ff3e00]` -> `text-accent`
     - Line 86: `hover:text-[#ff3e00]` -> `hover:text-accent`
     - Line 89: `bg-[#ff3e00]` -> `bg-accent`
     - Line 103: `bg-[#ff3e00]` -> `bg-accent`
     - Line 116: `border-t-4 border-[#121212] bg-[#f8f9fa]` -> `border-t-4 border-text-primary bg-bg-primary`
     - Line 131: `border-[#121212]` -> `border-text-primary`, `hover:text-[#ff3e00]` -> `hover:text-accent`
  3. In `src/components/playPress.ts`:
     - Line 6: `boxShadow: '0px 0px 0px 0px #121212'` -> `boxShadow: '0px 0px 0px 0px var(--color-text-primary)'`
- **Mirror**: `src/styles/global.css:45-47`
- **Validate**: `npm run build`

### Task 3: Replace hex classes in homepage, showcase, and contact form
- **File**: `src/App.tsx`, `src/features/showcase/ProjectCard.tsx`, `src/features/contact/ContactForm.tsx`
- **Action**: UPDATE
- **Implement**:
  1. In `src/App.tsx`:
     - Lines 25, 34, 43, 52: update `PROJECTS` `color` values from literal hex strings to `'var(--color-accent)'`, `'var(--color-accent-cyan)'`, `'var(--color-accent-yellow)'`, `'var(--color-accent-purple)'`.
     - Line 104: `bg-[#f8f9fa]` -> `bg-bg-primary`
     - Line 175: `border-[#ff3e00]` -> `border-accent`
     - Line 187: `bg-[#121212]` -> `bg-text-primary`
     - Lines 196, 206: `text-[#121212]` -> `text-text-primary`
     - Line 223: `bg-[#121212] text-white border-y-4 border-[#121212]` -> `bg-text-primary text-white border-y-4 border-text-primary`
     - Line 228: `text-[#00e5ff]` -> `text-accent-cyan`
     - Line 239: `bg-[#facc15] text-[#121212]` -> `bg-accent-yellow text-text-primary`
     - Line 243: `bg-[#ff3e00] text-[#121212]` -> `bg-accent text-text-primary`
     - Line 247: `bg-[#00e5ff] text-[#121212]` -> `bg-accent-cyan text-text-primary`
     - Line 262: `text-[#ff3e00]` -> `text-accent`
  2. In `src/features/showcase/ProjectCard.tsx`:
     - Line 66: `bg-[#121212] text-white border-4 border-[#121212]` -> `bg-text-primary text-white border-4 border-text-primary`
  3. In `src/features/contact/ContactForm.tsx`:
     - Line 55: `border-[#121212]` -> `border-text-primary`
     - Line 58: `text-[#ff3e00]` -> `text-accent`
     - Line 69: `hover:text-[#ff3e00]` -> `hover:text-accent`
     - Lines 85, 101, 114: `bg-[#f8f9fa]` -> `bg-bg-primary`
     - Line 124: `bg-[#ff3e00]` -> `bg-accent`
- **Mirror**: `src/features/showcase/ProjectCard.tsx:43`
- **Validate**: `npm run build`

### Task 4: Replace hex classes in blog views, components, and post content
- **File**: `src/features/blog/BlogIndex.tsx`, `src/features/blog/BlogPost.tsx`, `src/features/blog/components/ArticleHeader.tsx`, `src/features/blog/data/posts.ts`
- **Action**: UPDATE
- **Implement**:
  1. In `src/features/blog/BlogIndex.tsx`:
     - Line 14: `bg-[#f8f9fa] text-[#121212] ... selection:bg-[#ff3e00]` -> `bg-bg-primary text-text-primary ... selection:bg-accent`
     - Line 22: `text-[#ff3e00]` -> `text-accent`
  2. In `src/features/blog/BlogPost.tsx`:
     - Lines 20, 49: `bg-[#f8f9fa] text-[#121212] ... selection:bg-[#ff3e00]` -> `bg-bg-primary text-text-primary ... selection:bg-accent`
     - Line 25: `bg-[#ff3e00]` -> `bg-accent`
     - Line 29: `text-[#ff3e00]` -> `text-accent`
     - Line 36: `bg-[#ff3e00]` -> `bg-accent`
  3. In `src/features/blog/components/ArticleHeader.tsx`:
     - Lines 32, 44, 52: `text-[#ff3e00]` -> `text-accent`
     - Line 61: `hover:text-[#ff3e00]` -> `hover:text-accent`
     - Line 64: `bg-[#ff3e00]` -> `bg-accent`
     - Line 90: `border-[#ff3e00]` -> `border-accent`
  4. In `src/features/blog/data/posts.ts`:
     - Lines 14, 117, 213, 320: update `accentColor` values to `'var(--color-accent-cyan)'`, `'var(--color-accent-purple)'`, `'var(--color-accent-yellow)'`, `'var(--color-accent)'`.
     - In lines 61-90, 178-196, 276-294, 383-398: replace all 51 inline HTML syntax highlight classes:
       `text-[#00e5ff]` -> `text-accent-cyan`
       `text-[#facc15]` -> `text-accent-yellow`
       `text-[#ff3e00]` -> `text-accent`
- **Mirror**: `src/features/blog/BlogIndex.tsx:14`
- **Validate**: `! grep -rnE '\[#[0-9a-fA-F]{3,8}\]' src/`

### Task 5: Synchronize design-system component READMEs and preview HTML
- **File**: `.agents/design-system/laanhema-design-system/components/*/README.md`, `.agents/design-system/laanhema-design-system/components/*/preview.html`
- **Action**: UPDATE
- **Implement**:
  1. Update class strings in the 12 component documentation READMEs:
     - `AboutSection/README.md`: `bg-[#121212]` -> `bg-text-primary`, `border-[#121212]` -> `border-text-primary`, `text-[#00e5ff]` -> `text-accent-cyan`
     - `ArticleHeader/README.md`: `text-[#ff3e00]` -> `text-accent`, `border-[#ff3e00]` -> `border-accent`
     - `Button/README.md`: `bg-[#121212]` -> `bg-text-primary`, `bg-[#ff3e00]` -> `bg-accent`, `text-[#121212]` -> `text-text-primary`
     - `ContactSection/README.md`: `border-[#121212]` -> `border-text-primary`
     - `Footer/README.md`: `bg-[#121212]` -> `bg-text-primary`, `hover:text-[#ff3e00]` -> `hover:text-accent`
     - `FormField/README.md`: `bg-[#f8f9fa]` -> `bg-bg-primary`
     - `Hero/README.md`: `border-[#ff3e00]` -> `border-accent`
     - `MobileMenu/README.md`: `border-[#121212]` -> `border-text-primary`, `bg-[#f8f9fa]` -> `bg-bg-primary`, `hover:text-[#ff3e00]` -> `hover:text-accent`
     - `NavBar/README.md`: `bg-[#f8f9fa]` -> `bg-bg-primary`, `border-[#121212]` -> `border-text-primary`, `text-[#ff3e00]` -> `text-accent`, `bg-[#ff3e00]` -> `bg-accent`, `hover:text-[#ff3e00]` -> `hover:text-accent`
     - `SectionHeading/README.md`: `text-[#ff3e00]` -> `text-accent`
     - `SocialIconButton/README.md`: `text-[#121212]` -> `text-text-primary`
     - `StatTile/README.md`: `text-[#121212]` -> `text-text-primary`
  2. Update corresponding `preview.html` files across those component directories to reflect the updated class names.
  3. Ensure `npm run check:design` passes with 0 stale class strings.
- **Mirror**: `scripts/check-design-system.mjs:20-29`
- **Validate**: `npm run check:design`

### Task 6: Run full verification suite and screenshot visual comparison
- **File**: `src/`, `.agents/plans/`
- **Action**: CHECK
- **Implement**:
  1. Run `npm run check` to verify lint, check:design, check:agents, and Vite production bundle.
  2. Start test server: `.claude/skills/verify/scripts/verify-server.sh start`.
  3. Run `.claude/skills/verify/scripts/ax.sh all` to verify all end-to-end accessibility, navigation, hover lift, and button checks pass.
  4. Capture desktop and mobile screenshots of `/`, `/blog`, and `/blog/tralla` and verify identical visual rendering.
  5. Stop test server: `.claude/skills/verify/scripts/verify-server.sh stop`.
- **Mirror**: `.claude/skills/verify/scripts/ax.sh:22`
- **Validate**: `npm run check && .claude/skills/verify/scripts/verify-server.sh start && (.claude/skills/verify/scripts/ax.sh all; code=$?; .claude/skills/verify/scripts/verify-server.sh stop; exit $code)`

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint

# Design system and AGENTS.md documentation checks
npm run check:design && npm run check:agents

# Full gate check (lint, check:design, check:agents, build)
npm run check

# Hex class check (red before refactor, green after refactor):
# Must output 0 matches and exit 0
! grep -rnE '\[#[0-9a-fA-F]{3,8}\]' src/

# End-to-end verification harness suite:
.claude/skills/verify/scripts/verify-server.sh start && (.claude/skills/verify/scripts/ax.sh all; code=$?; .claude/skills/verify/scripts/verify-server.sh stop; exit $code)
```

## End-to-End Verification

1. Start test server: `.claude/skills/verify/scripts/verify-server.sh start`
2. Run automated verification suite: `.claude/skills/verify/scripts/ax.sh all`
   - Confirms all blog post tables fit within container widths without overflow.
   - Confirms navigation bar logo, menu button bounding boxes, and Noto Sans font.
   - Confirms button hover transforms (`translate(-3px, -3px)`) and 6px text-primary shadows for VIEW WORK, CODE, READ STORY, SEND MESSAGE.
   - Confirms computed cursor values (button: pointer, form fields: text).
   - Confirms contact form empty/spaces submit blocking and valid submit encoding.
   - Confirms no blurred glows on hero header at desktop and mobile viewports.
3. Capture visual comparison screenshots:
   - Desktop viewport (1280x900):
     - `.claude/skills/verify/scripts/ax.sh desktop`
     - `.claude/skills/verify/scripts/ax.sh open /` -> `.claude/skills/verify/scripts/ax.sh shot .temp/verify/after-home-desktop.png`
     - `.claude/skills/verify/scripts/ax.sh open /blog` -> `.claude/skills/verify/scripts/ax.sh shot .temp/verify/after-blog-desktop.png`
     - `.claude/skills/verify/scripts/ax.sh open /blog/tralla` -> `.claude/skills/verify/scripts/ax.sh shot .temp/verify/after-tralla-desktop.png`
   - Mobile viewport (375x812):
     - `.claude/skills/verify/scripts/ax.sh mobile`
     - `.claude/skills/verify/scripts/ax.sh open /` -> `.claude/skills/verify/scripts/ax.sh shot .temp/verify/after-home-mobile.png`
     - `.claude/skills/verify/scripts/ax.sh open /blog` -> `.claude/skills/verify/scripts/ax.sh shot .temp/verify/after-blog-mobile.png`
     - `.claude/skills/verify/scripts/ax.sh open /blog/tralla` -> `.claude/skills/verify/scripts/ax.sh shot .temp/verify/after-tralla-mobile.png`
   - Verify that all rendered pages match pixel-for-pixel with the pre-refactor rendering.
4. Stop test server: `.claude/skills/verify/scripts/verify-server.sh stop`

## Risks

| Risk | Mitigation | Scope |
|---|---|---|
| Tailwind CSS v4 token utility mapping mismatch | Tailwind CSS v4 automatically maps `--color-bg-primary` to `bg-bg-primary`, `--color-text-primary` to `text-text-primary`/`border-text-primary`, `--color-accent` to `text-accent`/`bg-accent`/`selection:bg-accent`. `npm run build` runs `tsc -b` and Vite bundle to ensure every class compiles correctly. | In-scope |
| `check:design` fails due to stale README class strings | `scripts/check-design-system.mjs` verifies every multi-token class string in `.agents/design-system/laanhema-design-system/components/*/README.md` against `src/`. Task 5 updates all documented class strings and preview files simultaneously. | In-scope |
| `check:agents` fails if hex palette values are removed from global.css | `scripts/check-agents-md.mjs` line 43 specifically asserts that the 6 hex palette strings from `AGENTS.md` exist in `src/styles/global.css`. The `@theme` block in `global.css` retains its hex definitions, satisfying both `check-agents-md.mjs` and runtime token resolution. | In-scope |
| Web Animations API shadow in `playPress.ts` failing with CSS variable | Modern Web Animations API and CSS style resolution support `var(--color-text-primary)`. Verified with baseline tests. | In-scope |
| Accidental modification of tracked issue file | `.agents/issues/todo-issues.md` has unrelated uncommitted changes. It will not be staged, edited, or reverted. | In-scope |

## Open Questions

- **Post accent colour & project card color property values**: In `src/features/blog/data/posts.ts` and `src/App.tsx`, card backgrounds use inline `style={{ backgroundColor: ... }}` referencing hex literals (`#00e5ff`, `#a855f7`, `#facc15`, `#ff3e00`). Should these also be converted to CSS variable strings (`var(--color-accent-cyan)`, etc.)?
  - *Proposed Default*: Yes. Converting them to `var(--color-accent-*)` allows card background colors to adapt when theme tokens change in dark mode (#114), and CSS variables in inline styles evaluate to identical hex colours in light mode with no visual regression.

## Acceptance Criteria

- [ ] All 6 tasks completed in order.
- [ ] No `[#hex]` colour classes remain anywhere in `src/` (`! grep -rnE '\[#[0-9a-fA-F]{3,8}\]' src/` exits 0).
- [ ] Components use the `@theme` semantic tokens defined in `src/styles/global.css`.
- [ ] `--shadow-brutal` and `--shadow-brutal-sm` use `var(--color-text-primary)`.
- [ ] `.agents/design-system/laanhema-design-system/components/*/README.md` and previews are updated to match the token classes.
- [ ] `npm run check` passes cleanly (lint, check:design, check:agents, build).
- [ ] `.claude/skills/verify/scripts/ax.sh all` passes cleanly with test server running.
- [ ] Visual rendering on `/`, `/blog`, and `/blog/tralla` across desktop and mobile viewports remains identical.
