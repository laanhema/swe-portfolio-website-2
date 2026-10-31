# Code Review: feature/keep-mobile-menu-aria-controls-target-in-dom

**Scope**: branch feature/keep-mobile-menu-aria-controls-target-in-dom
**Recommendation**: APPROVE

## Summary

Reviewed branch `feature/keep-mobile-menu-aria-controls-target-in-dom` changes against default branch `main`, implementing the fix for issue #112. The implementation updates `src/features/navigation/Nav.tsx` to unconditionally render `<div id='mobile-menu'>` with `hidden={!isOpen}` instead of conditionally mounting it, and updates `.claude/skills/verify/features/mobile-menu.md`. Working-tree changes in `.agents/issues/todo-issues.md` were identified as unrelated per caller instruction and left untouched/excluded from review.

Acceptance criteria verification:
- **`aria-controls` never references a missing id: either the drawer stays in the DOM while closed, or the attribute is set only while the drawer is open**: Met. Evaluated the DOM via `chrome-devtools-axi eval` while the menu is closed; `button[aria-controls="mobile-menu"]` is present and resolves to `#mobile-menu` in the DOM with `hidden === true` and computed display `none`.
- **When the drawer is closed, its links are neither focusable nor in the accessibility tree, so `ax.sh has 'link "WORK"'` fails at the mobile viewport**: Met. Ran `.claude/skills/verify/scripts/ax.sh has 'link "WORK"'` in closed state on a 375x812 viewport, which exited with code 1 (not in accessibility tree). DOM inspection also confirmed `offsetParent === null` and `activeElement !== link` for all drawer links upon attempted focus.
- **The toggle and the drawer links behave as before, and the mobile-menu recipe of the verify skill passes, including the #64 overshoot case**: Met. Executed the complete mobile menu test recipe: open drawer (`menuExpanded: "true"`), section navigation to `#contact` with synchronous collapse via `flushSync` preventing overshoot (`diff: -0.5px` offset to sticky nav), logo reset to top, close toggle, blog navigation, touch tap emulation, and 320px narrow layout check (`menu-320.png`). Full suite `ax.sh all` passed with `all: ok`.
- **`npm run check` passes**: Met. `npm run check` (running `eslint`, `check:design`, `check:agents`, and `tsc -b && vite build`) passed cleanly with 0 errors and 0 warnings.

## Issues Found

### Critical
None

### High Priority
None

### Medium Priority
None

### Suggestions (Low)
None

## Validation Results

| Check | Status | Notes |
|-------|--------|-------|
| Build / Type Check | PASS | `npm run build` (`tsc -b && vite build`) — host; production bundle built cleanly in 584ms with 0 errors |
| Warnings | NONE | Real warnings gate verified via `npm run check` (`eslint .` and `tsc -b`); 0 warnings emitted |
| Lint | PASS | `npm run lint` (`eslint .`) — host; clean exit code 0 |
| Tests | PASS | Design-system check (45 documented class strings) and AGENTS.md check (87 claims) passed; full browser test suite `.claude/skills/verify/scripts/ax.sh all` passed (table widths, nav fonts/dimensions, hover lift, cursor styles, contact mailto dispatch, hero blur check) — host |
| UI verification | PASS | Verified `mobile-menu` recipes using `verify-server.sh` and `ax.sh` across viewports 320x640 and 375x812; visual proof captured to `.temp/verify/runs/20261031-170321/menu-320.png` and `menu-contact.png` |

## What's Good

- Clean, standard-compliant solution: keeps `#mobile-menu` in the DOM using HTML5 `hidden={!isOpen}`, satisfying ARIA reference integrity while Tailwind v4's preflight rule `[hidden]:where(:not([hidden='until-found'])) { display: none !important; }` guarantees proper visual and accessibility exclusion when closed.
- Preserves the `flushSync` synchronous state update in `closeMenu()`, ensuring layout measurements in `scrollToSection()` calculate exact target offsets without overshoot (#64).
- Verification recipe documentation in `.claude/skills/verify/features/mobile-menu.md` is updated accurately.

## Recommendation

Ready to merge. Branch is clean and all checks pass without findings.
