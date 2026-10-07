# Code Review: feature/fix-card-and-send-button-hover-press

**Scope**: branch `feature/fix-card-and-send-button-hover-press` vs merge base `690da3e` (3 commits + untracked plan/report), checked against issue #56 (the "Scope changed" comment's technical notes)
**Recommendation**: APPROVE WITH NITS

## Summary

The branch moves "Code", both "Read Story" variants (`ProjectCard.tsx`) and "Send Message" (`ContactForm.tsx`) to the View Work recipe (`shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation` + `onPointerDown={playPress}`), adds a hover-capable Chrome and an `ax.sh buttons` e2e check to the verify harness, and updates `Button/README.md`, `DESIGN.md` and the verify skill docs. All seven acceptance criteria are met, and I re-ran the e2e check myself against both the pre-fix commit and the branch tip. The unrelated uncommitted change to `.agents/issues/todo-issues.md` was excluded from the review.

## Issues Found

### Critical
None

### High Priority
None

### Medium Priority
None

### Suggestions (Low)

- **L1** `.claude/skills/verify/features/contact.md:25` (same text in `.claude/skills/verify/features/project-showcase.md:25`) — the new recipe says "Run `ax.sh desktop`, `ax.sh open /`, then `ax.sh buttons`", but on a fresh browser session `ax.sh desktop` exits 1 with no output because no page is open (`SKILL.md:48`: "run before desktop/mobile, which fail with no page open"). **Why:** the same files' new Gotcha ("Run `ax.sh stop` and retry") and the new `SKILL.md:66` bullet ("run `ax.sh stop` once") both lead straight into a fresh session, where following the recipe literally fails at its first step. I reproduced this: after `ax.sh stop`, `ax.sh desktop` returned `d=1` silently, and `ax.sh open /` followed by `ax.sh desktop` worked. **Fix:** reorder to "Run `ax.sh open /`, `ax.sh desktop`, `ax.sh open /`, then `ax.sh buttons`" (or "`ax.sh open /` then `ax.sh desktop`"), matching `SKILL.md:48`.

**Noted, not a finding**: the "Send Message" button still shows `cursor: default`, because #86 (`cursor-pointer`) is open and has not landed, so the issue's "keep it if it has landed" note does not apply. The `BlogPost.tsx:55` "← BACK TO ALL POSTS" button still uses the old `hover:-translate-y-1 hover:translate-x-1` recipe. The design-system `preview.html` files, `tokens.json` and `styles/tokens.css` (`--shadow-brutal-press`) are stale. These three were scoped out as follow-ups in the implementation report, and issue #56 names neither in its scope nor requires follow-ups to be filed. The keyboard press (Space/Enter) on "Send Message" no longer plays the `:active` press, but this matches View Work and the social buttons, which the issue defines as the reference.

## Acceptance Criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Mouse hover lifts 3px up-left and keeps the 6px shadow | Met | `ax.sh buttons` on the branch: all four `transform=matrix(1, 0, 0, 1, -3, -3) translate=none shadow=… 6px 6px … ok`, exit 0 |
| 2 | Same press on desktop click and mobile tap | Met | `ProjectCard.tsx:57,68,76` and `ContactForm.tsx:62` use `onPointerDown={playPress}`. A pointerdown on SEND MESSAGE on the mobile viewport gave `getAnimations().length === 1` |
| 3 | No sticky hover on touch | Met | Mobile viewport: `(hover: hover)` is false, all buttons read `transform: none`, and SEND MESSAGE read `none/none` with 0 animations after a tap, with path unchanged (`/#contact`) |
| 4 | View Work, social buttons and layouts unchanged | Met | `src/App.tsx` and `global.css` are untouched. Only the class strings on the three buttons changed |
| 5 | `Button/README.md` "Card pair" / "Accent submit" match | Met | `Button/README.md:4-5` strings match `ContactForm.tsx:61` and `ProjectCard.tsx:56,67,75` |
| 6 | `ax.sh` e2e check fails before and passes after, and is documented | Met | Run on `7f5497c` (check only, pre-fix src): CODE / READ STORY / SEND MESSAGE `MISMATCH`, exit 1. Branch tip: exit 0. Documented in `project-showcase.md:25`, `contact.md:25` and the `SKILL.md:54,101` helper table |
| 7 | `npm run lint` and `npm run build` pass | Met | See below |

## Validation Results

| Check | Status | Notes |
|-------|--------|-------|
| Build / Type Check | PASS | `npm run build` (`tsc -b && vite build`) on the host |
| Warnings | NONE | No TS or Vite warnings in the build output |
| Lint | PASS | `npm run lint` (eslint), 0 problems |
| Tests | PASS | No unit-test runner in the project. E2E: `ax.sh buttons` exit 0 on the branch tip (dev server, port 5199) and exit 1 (3× `MISMATCH`) on pre-fix commit `7f5497c`, served from a throwaway scratch worktree on port 5299. I also probed the mobile viewport by hand (`eval`-dispatched pointerdown plus `ax.sh click`). The harness and both servers were stopped afterwards, and the worktree was removed |

## What's Good

- The fix is minimal and exact: the three class strings are byte-for-byte the View Work recipe, and "Send Message" gains the same `playPress` handler.
- The e2e check is strict and fails closed. It compares the full `transform`, `translate` and multi-layer `box-shadow` against VIEW WORK, guards against a vacuous match (`NOT-LIFTED`), against a browser without hover (`NO-HOVER`) and against hovering the wrong element (`WRONG-TARGET`). It landed in its own commit before the fix, so its "fails before" claim can be checked.
- `CHROME_DEVTOOLS_AXI_CHROME_ARGS` is a real, documented option of the installed `chrome-devtools-axi` (`dist/src/bridge.js:571`). The unset-only `${VAR-…}` default lets users opt out with an empty value.
- The usage printer's existing off-by-one (`sed -n '2,16p'` printed `set -euo pipefail`) is now correct.

## Recommendation

Approve. L1 is an optional doc reorder that can be fixed with `/fix-findings` before merge, or left as is.
