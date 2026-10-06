# Code Review: feature/fix-mobile-cross-page-landing-offset

**Scope**: Branch `feature/fix-mobile-cross-page-landing-offset` vs `main` (no commits yet; uncommitted changes to `src/App.tsx`, `src/styles/global.css`, `.claude/skills/verify/features/section-navigation.md`, plus untracked plan and implementation report). Issue #63. `.agents/stories/todo-stories.md` is excluded (unrelated change).
**Recommendation**: APPROVE WITH NITS

## Summary

The change adds `scroll-padding-top` equal to the sticky nav height, a short-lived `ResizeObserver` anchor hold after an initial hash landing, and StrictMode-safe initial-landing detection. The fix is small and matches the plan, and the deviation from it (keying on `pathname + hash` instead of `location.key`) is well reasoned and correct, because the effect only re-runs when those deps change. Lint and build pass, and a browser spot check confirmed flush landings and the reload reset. The findings below are all Low.

## Issues Found

### Critical
None

### High Priority
None

### Medium Priority
None

### Suggestions (Low)

1. **`src/styles/global.css:19-24`: the hard-coded px offsets and the `768px` breakpoint stop tracking the nav when the browser's default font size is not 16px.**
   The nav height mixes rem (`py-4`, `py-2`, `text-2xl`/`text-3xl` line heights) and px (4px borders). Tailwind v4's `md` is `48rem`, but the media query is `min-width: 768px`. Measured with a 20px root font size: nav height is 92px, while `scroll-padding-top` stays 84px, so the section lands 8px under the nav. That is outside the issue's 2px tolerance. With a larger default font, the 768px query also switches to 72px while the nav is still in its mobile layout.
   *Recommendation*: use `@media (min-width: 48rem)` to match `md`, and express the values as `calc(4.5rem + 12px)` (mobile) and `calc(4.25rem + 4px)` (`md`+). Both equal 84px and 72px at 16px. A JS-measured `--nav-h` also works, but the plan rejected it as heavier.

2. **`src/App.tsx:61-62`: the comment presents a page-specific observation as general Chrome behavior.**
   "Chrome's scroll anchoring only corrects layout shifts in the first frame after a scroll" is broader than the evidence. Scroll anchoring exists to correct late shifts above the viewport. In a probe on this branch, a shift made 300ms after a plain `scrollBy(0, 10)`, long after the hold had ended, was not corrected either (`#work` top 84 → 2.7px). So anchoring looks suppressed on this page, not limited to the first frame. The fix is still right. Only the stated reason is unproven, and it can mislead a future maintainer. The verify gotcha in `section-navigation.md` doesn't repeat the claim.
   *Recommendation*: reword it as observed behavior, for example "Scroll anchoring does not correct later reflows above the target on this page (measured, #63), so ...".

3. **`src/App.tsx:67`: the hold's release inputs don't include a desktop scrollbar drag.**
   `wheel`, `touchstart`, `keydown` and `pointerdown` cover touch, wheel, keyboard and in-page clicks. Chrome may not dispatch `pointerdown` for a drag on the root viewport scrollbar, though. If a reflow happens during such a drag inside the 2s window, the hold snaps the page back. This needs a desktop scrollbar drag plus a late reflow within 2s, so the impact is marginal.
   *Recommendation*: optional. Release on a `scroll` event whose `scrollY` differs from the position the hold last set. Otherwise leave it as is and note it.

**Noted, not a finding** (scoped out or accepted in the plan):
- The 84/72px values drifting if the nav markup changes (the plan accepted this, and the CSS comment points to `Nav.tsx`).
- Mobile drawer links on `/` overshooting because the drawer collapses after the scroll (issue #64, out of scope).
- The re-wrap trigger stays unreproduced. The PR documents the mechanism instead (plan Open Question 1).
- Font-swap FOUT / `preload` (out of scope).

## Validation Results

| Check | Status |
|-------|--------|
| Type Check (`npm run build`, `tsc -b && vite build`) | PASS (JS 400.71 kB, CSS 34.04 kB) |
| Lint (`npm run lint`) | PASS (0 problems) |
| Tests | N/A: no test framework is configured (AGENTS.md gate is lint + build) |
| Browser spot check (own `/verify` dev server on :5199, mobile 375x812) | PASS: `/blog/tralla` → drawer `CONTACT` lands with section top 83.5px vs nav bottom 84px at +2.5s. WORK/ABOUT/CONTACT all routed with the correct hash. Reloading `/#work` twice in dev (StrictMode) gives `hash: ""`, `scrollY: 0` |

The implementation report's 30/30 mobile landings, 12/12 simulated late re-wraps, desktop landings and hold-release run were not re-run in full. The spot check above is consistent with them.

## What's Good

- The deterministic 84px offset is fixed in CSS, so every `scrollIntoView` caller (cross-page, `VIEW WORK`, desktop nav) benefits without JS changes.
- `holdAnchor` is small and self-contained. Its cleanup is idempotent (`disconnect`, `clearTimeout`, remove listeners) and is returned straight from the layout effect, so unmount and re-navigation tear it down correctly.
- The StrictMode reasoning is correct. `pathname + hash` is unambiguous, because a pathname can't contain `#`, and the run-for-same-URL check holds only on StrictMode's re-run. The report explains why `location.key` would have regressed the logo click.
- The hold is limited to the initial instant landing, so smooth in-page navigation is untouched, and the #58 hero-flash timing (`useLayoutEffect`, reload branch) is preserved.
- The verify recipe's stale gotchas were replaced with a measurable assertion tied to #63.

## Recommendation

Mergeable as is. Before or after merge, consider the rem-based offset and breakpoint (Low 1) and the comment rewording (Low 2). Low 3 is optional.
