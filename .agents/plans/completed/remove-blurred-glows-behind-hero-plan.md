# Plan: Remove the Blurred Glows Behind the Hero

## Summary

The hero section (`<header>` in `src/App.tsx:149-152`) currently renders two soft, blurred background glow elements: an orange glow (`bg-[#ff3e00] blur-[120px]`) at the top right and a cyan glow (`bg-[#00e5ff] blur-[150px]`) at the bottom left. This plan removes both blurred `<div>` elements from `src/App.tsx` while keeping all hero layout, padding, grid alignment, and GSAP scroll-entrance animations intact (including preserving `overflow-hidden` on the `<header>` element). It also updates the design system documentation in `.agents/design-system/laanhema-design-system/DESIGN.md` and `.agents/design-system/laanhema-design-system/components/Hero/README.md` to eliminate references to hero glows/blobs. Finally, it adds a mandatory end-to-end verification subcommand `ax.sh hero` to `.claude/skills/verify/scripts/ax.sh` and updates the `/verify` skill documentation (`SKILL.md` and `features/section-navigation.md`).

## User Story

As a portfolio visitor,
I want the main page hero section to present a clean, high-contrast neo-brutalist aesthetic without soft background color glows,
So that the hero visuals align consistently with the site's crisp, ink-bordered design language.

## Metadata

| Field | Value |
|-------|-------|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/App.tsx`, `.agents/design-system/laanhema-design-system/DESIGN.md`, `.agents/design-system/laanhema-design-system/components/Hero/README.md`, `.claude/skills/verify/scripts/ax.sh`, `.claude/skills/verify/SKILL.md`, `.claude/skills/verify/features/section-navigation.md` |
| GitHub Issue | #88 |
| PRD Phase | N/A |

---

## Environment Findings

| Probe | Result |
|-------|--------|
| Baseline `npm run lint` | Passes (exit 0, clean output) |
| Baseline `npm run build` | Passes (`tsc -b && vite build`, exit 0) |
| Verification Harness | `.claude/skills/verify/scripts/verify-server.sh` and `.claude/skills/verify/scripts/ax.sh` driven via `chrome-devtools-axi` |
| Pre-fix Glow Status | `src/App.tsx:150-151` contains two `<div>` elements with `blur-[120px]` and `blur-[150px]` inside `<header>`. Their computed `filter` style contains `blur(...)`. |
| Uncommitted changes constraint | `.agents/issues/todo-issues.md` has uncommitted changes that are off-limits (do not revert or stage). |

---

## Patterns to Follow

### Hero Layout Container (Keep overflow-hidden & spacing)
```tsx
// SOURCE: src/App.tsx:149
<header className='pt-16 md:pt-20 xl:pt-24 pb-16 md:pb-20 px-6 md:px-12 flex flex-col items-start min-h-[85vh] justify-center relative overflow-hidden'>
```

### ax.sh Verification Command Pattern
```bash
# SOURCE: .claude/skills/verify/scripts/ax.sh:50-54
  nav)
    out="$(axi eval "(() => { ... })()" \
      | sed -n 's/^result: //p' | python3 -c 'import json,sys; print(json.loads(json.loads(sys.stdin.read())))')"
    echo "$out"
    ! grep -q WRONG-FONT <<<"$out" ;;
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `.claude/skills/verify/scripts/ax.sh` | UPDATE | Add `ax.sh hero` subcommand to check for blurred elements in the hero `<header>` across `desktop` and `mobile` viewports, and update script usage range. |
| `.claude/skills/verify/SKILL.md` | UPDATE | Document `ax.sh hero` subcommand in usage summary and helper table. |
| `.claude/skills/verify/features/section-navigation.md` | UPDATE | Update hero verification instructions to document `ax.sh hero`. |
| `src/App.tsx` | UPDATE | Remove the two blurred glow `<div>` elements (lines 150-151) from the hero `<header>`. |
| `.agents/design-system/laanhema-design-system/DESIGN.md` | UPDATE | Remove mentions of hero blurred glows/blobs in rules 4, 5, and the Colour section. |
| `.agents/design-system/laanhema-design-system/components/Hero/README.md` | UPDATE | Update Hero README description to remove mention of blurred blobs. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Add E2E Verification Subcommand (`ax.sh hero`) and Update Verification Skill Docs

- **Files**: `.claude/skills/verify/scripts/ax.sh`, `.claude/skills/verify/SKILL.md`, `.claude/skills/verify/features/section-navigation.md`
- **Action**: UPDATE
- **Implement**:
  1. In `.claude/skills/verify/scripts/ax.sh`:
     - Add usage doc comment line: `#   ax.sh hero                      check hero header across desktop and mobile viewports; exit 1 if any element has computed filter containing blur`.
     - Update usage printer line from `sed -n '2,17p' "$0"` to `sed -n '2,18p' "$0"`.
     - Implement `hero)` case block:
       ```bash
  hero)
    out=""
    for vp in desktop mobile; do
      "$0" "$vp" >/dev/null
      "$0" open / >/dev/null
      res="$(axi eval "(() => { const hero = document.querySelector('header'); if (!hero) return 'HERO MISSING'; const elements = [...hero.querySelectorAll('*')]; const blurred = elements.filter(el => getComputedStyle(el).filter.includes('blur')); return blurred.length === 0 ? 'hero glows: NONE ok' : 'HERO BLUR FOUND: ' + blurred.map(el => el.className).join(' | '); })()" \
        | sed -n 's/^result: //p' | python3 -c 'import json,sys; print(json.loads(json.loads(sys.stdin.read())))')"
      out+="$vp: $res"$'\n'
    done
    echo -n "$out"
    ! grep -q HERO <<<"$out" ;;
       ```
  2. In `.claude/skills/verify/SKILL.md`:
     - Add `$A hero` to the Drive section examples and the Helpers table.
  3. In `.claude/skills/verify/features/section-navigation.md`:
     - Document `ax.sh hero` under verification steps for hero section.
- **Mirror**: `.claude/skills/verify/scripts/ax.sh:50-54`
- **Validate**: Run `$S start dev` and `$A hero`. Verify that `ax.sh hero` exits 1 on current pre-fix code (finding `HERO BLUR FOUND`).

### Task 2: Remove Blurred Glow Elements from Hero in `src/App.tsx`

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Remove lines 150-151:
    ```tsx
    <div className='absolute top-1/4 right-0 w-64 h-64 bg-[#ff3e00] rounded-full blur-[120px] opacity-20 -z-10'></div>
    <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#00e5ff] rounded-full blur-[150px] opacity-20 -z-10'></div>
    ```
  - Preserve the `<header>` element class list (`pt-16 md:pt-20 xl:pt-24 pb-16 md:pb-20 px-6 md:px-12 flex flex-col items-start min-h-[85vh] justify-center relative overflow-hidden`), hero typography, content hierarchy, and GSAP scroll entrance animations.
- **Mirror**: `src/App.tsx:149-153`
- **Validate**: Run `ax.sh hero` to verify it exits 0 with `hero glows: NONE ok` on both desktop and mobile viewports. Run `npm run lint` and `npm run build`.

### Task 3: Update Design System Documentation

- **Files**: `.agents/design-system/laanhema-design-system/DESIGN.md`, `.agents/design-system/laanhema-design-system/components/Hero/README.md`
- **Action**: UPDATE
- **Implement**:
  1. In `.agents/design-system/laanhema-design-system/DESIGN.md`:
     - Rule 4 (line 10): Update "No gradients and no tints, except the two blurred blobs behind the hero." -> "No gradients, tints, or blurred glows."
     - Rule 5 (line 11): Update "Use `radius-none` everywhere. `rounded-full` is only for the hero blobs." -> "Use `radius-none` everywhere."
     - Colour section (line 29): Remove or update sentence "The hero's cyan and orange blobs use `blur-[120px]`/`blur-[150px]` at `opacity-20` behind the content (`-z-10`). They are the only soft element. Don't add more." -> "No element uses blur or gradients."
  2. In `.agents/design-system/laanhema-design-system/components/Hero/README.md`:
     - Line 3: Update "- Section: `min-h-[85vh]`, vertically centred, with two blurred blobs behind it (orange at top right, cyan at bottom left, `opacity-20 -z-10`)." -> "- Section: `min-h-[85vh]`, vertically centred."
- **Mirror**: `.agents/design-system/laanhema-design-system/DESIGN.md`
- **Validate**: `git diff .agents/design-system/` to confirm accurate text updates.

---

## Validation

```bash
# Type check & Build
npm run build

# Lint
npm run lint

# End-to-End Harness Check
.claude/skills/verify/scripts/verify-server.sh start dev
.claude/skills/verify/scripts/ax.sh hero
.claude/skills/verify/scripts/verify-server.sh stop
```

---

## End-to-End Verification

1. Launch dev server using `.claude/skills/verify/scripts/verify-server.sh start dev`.
2. Run `.claude/skills/verify/scripts/ax.sh hero`.
3. Assert output reports `desktop: hero glows: NONE ok` and `mobile: hero glows: NONE ok` with exit code 0.
4. Take desktop and mobile screenshots (`ax.sh shot "$RUN_DIR/hero-desktop.png"` and `ax.sh shot "$RUN_DIR/hero-mobile.png"`) to visually verify hero layout remains intact without color glows.
5. Stop verify server using `.claude/skills/verify/scripts/verify-server.sh stop`.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Unintended layout/overflow break if `overflow-hidden` is removed | **In Scope**: Keep `overflow-hidden` on the hero `<header>` element class string to ensure entrance animations and section boundaries behave identically. |
| Documentation drift if design system docs still mention hero blobs | **In Scope**: Update `DESIGN.md` (rules 4, 5, Colour section) and `Hero/README.md` to remove all references to hero blurred glows. |
| Harness false positive if non-hero elements use blur | **In Scope**: Target `ax.sh hero` evaluation specifically to elements inside `document.querySelector('header')`. |

---

## Open Questions

- None. (Technical notes confirm that "blue" and "red" refer to cyan `#00e5ff` and orange `#ff3e00` blur divs in `src/App.tsx:150-151`, and removing both fulfills all ACs.)

---

## Acceptance Criteria

- [ ] Neither orange nor cyan blurred glow appears on the main page at any screen size.
- [ ] Hero layout, spacing, and entrance animations stay unchanged (`overflow-hidden` preserved).
- [ ] `DESIGN.md` and Hero component `README.md` no longer describe hero glows/blobs.
- [ ] Mandatory e2e check `ax.sh hero` added to `.claude/skills/verify/scripts/ax.sh`, documented in `SKILL.md` and `features/section-navigation.md`.
- [ ] `ax.sh hero` fails on pre-fix code and passes on post-fix code across desktop and mobile viewports.
- [ ] `npm run lint` and `npm run build` pass cleanly.
