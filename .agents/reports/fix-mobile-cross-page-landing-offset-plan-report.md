# Implementation Report

**Plan**: `.agents/plans/completed/fix-mobile-cross-page-landing-offset-plan.md`
**Branch**: `feature/fix-mobile-cross-page-landing-offset`
**Status**: COMPLETE (uncommitted, per project git policy)
**Issue**: #63

## Summary

Cross-page landings from `/blog` and `/blog/:slug` to `/#work`, `/#about` and `/#contact` now end with the section's top edge flush under the sticky nav (0px offset in all 30 mobile runs), and they stay there when a late reflow happens above the target.

- `html` gets `scroll-padding-top: 84px` (72px at `md`+), equal to the sticky nav height. Every `scrollIntoView` caller (cross-page landing, `VIEW WORK`, desktop nav links) now stops at the nav bottom instead of behind the nav.
- After an initial hash landing, `HomePage` holds the anchor. A `ResizeObserver` on the page root re-scrolls the target instantly on any layout resize. It stops at the first `wheel`, `touchstart`, `keydown` or `pointerdown`, or after `ANCHOR_HOLD_MS = 2000`.
- The initial-landing check is now StrictMode-safe. A re-run for the URL the effect already landed on counts as the initial landing, so the dev double-invoke re-installs the hold instead of taking the smooth path.

## Cause write-up (for the PR description)

**The re-wrap did not reproduce.** I ran 30 instrumented runs on HeadlessChrome 154 at 375x812 DPR 2 against unchanged code (HEAD `bd072e5`). The hero intro paragraph stayed at 308px in every frame of every run, and no run recorded a height change (`changes=[]`).

- 6 warm runs (dev server, `/blog` and `/blog/tralla` × work/about/contact). The latin Noto Sans face was already loaded at tap time, and no `loadingdone` event fired during the landing.
- 24 cold-cache runs (production preview, a fresh isolated browser profile per run, a cache-busted URL, Slow 3G + 4× CPU, `SETTLE=0`). The cache was cold in every run: `document.fonts.status` was `loading` with no faces loaded when the blog page opened. The latin face finished 1590–1661ms after the blog page opened. At HomePage mount, `document.fonts.check('500 20px "Noto Sans Variable"')` was already `true` in all 24 runs. In one extra raw-timeline run, the font finished at +1616ms and HomePage mounted at +8998ms. The scripted snapshot-then-tap path is too slow under throttling to land inside the cold-font window.

So I cannot name the trigger of the reported 28–61px re-wrap. What I measured:

1. **Deterministic offset (the main failure).** No `scroll-padding-top` or `scroll-margin-top` existed, so every landing put the section top at viewport `y = 0`, 84px under the mobile nav. Baseline: `landing=FAIL (secTop-navB=-84px)` in 30/30 runs.
2. **Late shifts are not corrected by scroll anchoring.** Planning showed (E8–E10) that a reflow above the target in the first frame after the scroll is corrected, but one 30ms or more later is not. GSAP transforms are not the cause. Without the fix, the simulated 308→227px re-wrap left the section 81–82px out of place. With the fix, the same simulated re-wrap at 0, 30, 250 and 1200ms lands at 0px (E2E step 4).
3. **Font swap (`font-display: swap`).** Ruled out on the warm path, because the blog page has already loaded the same latin font file. Possible only if the tap lands before a cold font finishes loading (about 1.6s on Slow 3G here). Not observed in any run. On this host a swap would not change the wrap anyway: the fallback `system-ui` also measures 308px (planning E6).

The anchor hold covers any late reflow above the target, whatever its trigger. If the reporter's Chrome build reproduces the re-wrap, re-run `.temp/verify/runs/issue63-investigation/run.sh` there to name the trigger.

Evidence: `.temp/verify/runs/20261006-132547/baseline-before.txt`, `.temp/verify/runs/20261006-133405/{cold-try.txt,cold-more.txt,cold-raw-timeline.txt,cause.txt}` (gitignored).

## Tasks Completed

| # | Task | File | Status |
|---|------|------|--------|
| 1 | Investigation gate (30 baseline runs incl. 24 cold Slow 3G) → row "no re-wrap in ≥30 runs" | `.temp/.../cause.txt` | ✅ |
| 2 | `scroll-padding-top` 84px / 72px at `md`+ | `src/styles/global.css` | ✅ |
| 3 | StrictMode-safe initial-landing detection | `src/App.tsx` | ✅ (see deviation 1) |
| 4 | `holdAnchor` + `ANCHOR_HOLD_MS` + root ref | `src/App.tsx` | ✅ |
| 5 | Replace stale gotchas | `.claude/skills/verify/features/section-navigation.md` | ✅ |
| 6 | Full validation + E2E | — | ✅ |

## Validation Results

| Check | Result |
|-------|--------|
| Type check + build (`npm run build`) | ✅ (JS 400.71 kB, CSS 34.04 kB) |
| Lint (`npm run lint`) | ✅ 0 problems |
| Tests | n/a (no test framework; browser proof below) |
| E2E 3: 30 mobile cross-page landings | ✅ 30/30 `landing=PASS (secTop-navB=0px)` and `heroHiddenAtMount=PASS`, 5/5 for each of /blog→work, /blog→about, /blog→contact, /blog/tralla→work, /blog/tralla→about, /blog/tralla→contact (baseline before the fix: 30/30 FAIL at −84px) |
| E2E 4: simulated late re-wrap (308→227px) at 0/30/250/1200ms × 3 targets | ✅ 12/12 `landing=PASS (secTop-navB=0px)` |
| E2E 5: #58 hero flash | ✅ screenshots taken right after tapping ABOUT and WORK show the nav, then the section, with no hero text or portrait. `heroBottom ≤ navB` at mount in all 42 runs (About: heroBottom=84, navB=84) |
| E2E 6: desktop | ✅ cross-page Work: 0px (navB=72). In-page About and VIEW WORK: 0px. Smooth scroll still animates (29 and 38 intermediate scroll events) |
| E2E 7: reload reset | ✅ `/#work` → reload → `"hash": ""`, `"scrollY": 0` |
| E2E 8: hold releases on input | ✅ trusted PageDown at +1681ms, late reflow at +1900ms: scroll stays at the user's 2053 (no snap back). Control without input: re-anchored to aboutTop=84 |

Evidence: `.temp/verify/runs/20261006-134955/` (`landing-mobile.txt`, `landing-simulated-shift.txt`, `cross-page-{about,work}-mobile.png`, `desktop.txt`, `reload-and-hold.txt`).

## Files Changed

| File | Action | Lines |
|------|--------|-------|
| `src/App.tsx` | UPDATE | +35/-5 |
| `src/styles/global.css` | UPDATE | +8/-0 |
| `.claude/skills/verify/features/section-navigation.md` | UPDATE | +2/-2 |

`.agents/stories/todo-stories.md` has a pre-existing uncommitted change and was left untouched.

## Deviations from Plan

1. **Task 3 keys on `pathname + hash`, not `location.key`.** Reading `location.key` in the effect makes `react-hooks/exhaustive-deps` require it as a dependency. Adding it would re-run the effect on same-URL navigations. React Router turns a Link to the current URL into a replace with a new key, so a logo click on `/` would get an instant `scrollTo(0)` instead of its smooth scroll. The effect only re-runs when `pathname` or `hash` changes, so a run for the URL it already landed on can only be StrictMode's re-run. That gives the same behavior with no lint suppression.
2. **Cold-cache runs used `start preview`, not the dev server.** Under Slow 3G the unbundled dev module graph did not load within `chrome-devtools-axi`'s 60s open timeout (`error: No page is currently selected`). The production bundle is also what laanhema.dev serves. The 6 warm runs and all E2E runs used the dev server, as the plan specifies.
3. **Cold cache came from a fresh browser profile, not only a cache-busting query.** `$A stop` before each run gives a new isolated profile. A `?c=$RANDOM` query does not bust the hashed font URL. Each cold run confirmed `fontsAtInstall=loading faces=''`.
4. **E2E 8 used a trusted `press PageDown` with an in-page timeline, not `chrome-devtools-axi scroll down` + `state`.** `scroll down` dispatches no wheel, touch, key or pointer event, and CLI round trips put it past the 2s window (+2197ms), so it could not test the release. The probe (scratch, deleted) logged the trusted keydown at +1681ms, applied a late reflow at +1900ms, and compared against a control run with no input.

## Tests Written

No test framework is configured (AGENTS.md: lint + build is the gate), so none was added. The behavior is proven through `/verify` with the plan's harness (`.temp/verify/runs/issue63-investigation/run.sh`, gitignored) and a scratch hold-release probe. `holdAnchor` has no unit test. Its behavior is covered end to end by E2E steps 4 and 8.
