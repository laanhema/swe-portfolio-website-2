# Implementation Report

**Plan**: `.agents/plans/completed/fix-card-and-send-button-hover-press-plan.md`
**Branch**: `feature/fix-card-and-send-button-hover-press`
**Status**: COMPLETE
**GitHub Issue**: #56

## Summary

The project card's "Code" and "Read Story" buttons and the contact form's "Send Message" button now use the same hover and press recipe as "View Work": `shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation` with `onPointerDown={playPress}`. On a mouse hover all four lift `translate(-3px,-3px)` and keep the 6px shadow. A tap or click plays the `playPress` Web Animations press. "Send Message" no longer relies on `.brutal-shadow:active`.

The verify harness gained a hover-capable browser and an `ax.sh buttons` check. It hovers VIEW WORK, CODE, READ STORY and SEND MESSAGE with real CDP mouse moves and exits 1 unless all four compute the same `transform`, `translate` and `box-shadow`. The check landed first in its own commit, and it fails on the pre-fix code.

## Commits

| Commit | Message |
|--------|---------|
| `7f5497c` | `test(verify): add a hover/press match check for card and submit buttons (#56)` (fails on HEAD 690da3e) |
| `b599c38` | `fix(buttons): make Code, Read Story and Send Message hover and press like View Work (#56)` |
| `b755c12` | `docs(design-system): document the shared button hover/press recipe (#56)` |

Nothing was pushed. `.agents/issues/todo-issues.md` (an unrelated pre-existing change) was not touched or staged.

## Tasks Completed

| # | Task | File | Status |
|---|------|------|--------|
| 1 | Hover-capable Chrome by default (env-overridable) + `ax.sh buttons` | `.claude/skills/verify/scripts/ax.sh` | ✅ |
| 2 | Card pair uses the reference recipe (3 class strings) | `src/features/showcase/ProjectCard.tsx` | ✅ |
| 3 | Send Message: `shadow-brutal`, reference hover, `touch-manipulation`, `playPress` | `src/features/contact/ContactForm.tsx` | ✅ |
| 4 | Accent submit / Card pair / Press docs; DESIGN.md hover + press rules | `Button/README.md`, `DESIGN.md` | ✅ |
| 5 | Document the check | `features/project-showcase.md`, `features/contact.md`, `SKILL.md` | ✅ |
| 6 | Full validation + e2e | (run evidence) | ✅ |

## Validation Results

| Check | Result |
|-------|--------|
| `npm run lint` | ✅ (0 problems) |
| `npm run build` (`tsc -b && vite build`) | ✅ |
| Unit tests | N/A (no test runner in the project; the e2e harness is the gate) |
| `ax.sh buttons` on pre-fix `src/` (commit 7f5497c) | ✅ fails as expected: exit 1, CODE / READ STORY / SEND MESSAGE `MISMATCH` |
| `ax.sh buttons` after the fix | ✅ exit 0, four `ok` lines |

Evidence directory: `.temp/verify/runs/20261007-185647/` (gitignored). `doctor` reported `git: 690da3e` for the before run and `git: 7f5497c +uncommitted src changes` for the after runs.

### E2E 1: fails before, passes after

Before (`buttons-before.txt`, exit=1):

```
VIEW WORK transform=matrix(1, 0, 0, 1, -3, -3) translate=none shadow=rgb(18, 18, 18) 6px 6px 0px 0px ok
CODE transform=none translate=4px -4px shadow=rgb(18, 18, 18) 2px 2px 0px 0px MISMATCH
READ STORY transform=none translate=4px -4px shadow=rgb(18, 18, 18) 2px 2px 0px 0px MISMATCH
SEND MESSAGE transform=none translate=4px -4px shadow=rgb(18, 18, 18) 6px 6px 0px 0px MISMATCH
```

After (`buttons-after.txt`, `buttons-after-final.txt`, exit=0):

```
VIEW WORK transform=matrix(1, 0, 0, 1, -3, -3) translate=none shadow=rgb(18, 18, 18) 6px 6px 0px 0px ok
CODE transform=matrix(1, 0, 0, 1, -3, -3) translate=none shadow=rgb(18, 18, 18) 6px 6px 0px 0px ok
READ STORY transform=matrix(1, 0, 0, 1, -3, -3) translate=none shadow=rgb(18, 18, 18) 6px 6px 0px 0px ok
SEND MESSAGE transform=matrix(1, 0, 0, 1, -3, -3) translate=none shadow=rgb(18, 18, 18) 6px 6px 0px 0px ok
```

The status compares the full five-layer `box-shadow` string. The printed `shadow=` is only the last layer.

### E2E 2: hover visual (desktop)

`contact-send-hover-desktop.png` and `showcase-code-hover-desktop.png`: the hovered button sits up-left with the full shadow visible bottom-right. GymBro CODE is visibly offset compared with its un-hovered READ STORY neighbour. ✅

### E2E 3: press

- Desktop (`press-desktop.txt`, via `eval`): a bubbling `pointerdown` on each of VIEW WORK, CODE, READ STORY and SEND MESSAGE returns `["translate(6px, 6px)"]` for all four. ✅ This probe used `eval` to dispatch the event, not the user path.
- Mobile real touch tap (`send-touch-tap.mjs` / `send-touch-tap.txt`): a separate headless Chrome at 375x812 mobile+touch, `(hover: hover)` false. CDP `Input.dispatchTouchEvent` touchStart/touchEnd on SEND MESSAGE gives `anims: 1`, keyframe `translate(6px, 6px)`, `submits: 1`, path `/` and hash `""` unchanged, and `transform: none`, `translate: none`, 0 running animations 250ms later. ✅ Setup scrolled the button into view with an `eval` `scrollIntoView`, and only the tap itself is on the user path.

### E2E 4: no sticky hover on touch

`buttons-mobile.txt` (375x812 mobile+touch, real mouse moves onto each button): all four read `transform=none translate=none shadow=… 6px 6px`, and each prints `NO-HOVER`, which also proves the guard fails closed (exit 1). The hovered labels matched the targets. `showcase-mobile.png` and `contact-mobile.png` show nothing lifted and an unchanged layout. ✅

The AC "on the touch viewport, nothing stays lifted after a tap" is met by **parity with the reference buttons**. All four now use the same `(hover: hover)` gate through `.brutal-shadow-hover` and the same `playPress` press as View Work and the social buttons. In Tailwind v4 the old `hover:` classes were already gated by `(hover: hover)`, so the visible touch improvement is the `playPress` press on Send Message, which replaces the unreliable `:active`.

### E2E 5: unchanged behaviour (`unchanged-behavior.txt`)

- `has 'link "CODE" url=".*github.com/laanhema/tralla"'` → matches. ✅
- `click 'button "SEND MESSAGE"'` → `{"path": "/", "hash": ""}`, unchanged. ✅
- `click 'link "READ STORY" url=.*/blog/tralla'` → `{"path": "/blog/tralla", "scrollY": 0, "h1": "Rebuilding Trello with Angular and SignalStore."}`. ✅
- `git diff --stat 690da3e..HEAD` has no `src/App.tsx`, so VIEW WORK and the social buttons are unchanged in source. ✅
- Card layout: two columns with the odd-card offset on desktop (`showcase-code-hover-desktop.png`), one column on mobile (`showcase-mobile.png`). ✅
- Contact form at 320px (`contact-320.png`): the full-width button with its shadow fits inside the viewport. ✅

### E2E 6: cleanup

`ax.sh stop` → `status: stopped`. `verify-server.sh stop` → `stopped pid 303016`. The evidence is kept in `RUN_DIR`.

## Files Changed

| File | Action | Lines |
|------|--------|-------|
| `.claude/skills/verify/scripts/ax.sh` | UPDATE | +37/-0 |
| `src/features/showcase/ProjectCard.tsx` | UPDATE | +3/-3 |
| `src/features/contact/ContactForm.tsx` | UPDATE | +3/-1 |
| `.agents/design-system/laanhema-design-system/components/Button/README.md` | UPDATE | +3/-3 |
| `.agents/design-system/laanhema-design-system/DESIGN.md` | UPDATE | +2/-3 |
| `.claude/skills/verify/features/project-showcase.md` | UPDATE | +2/-0 |
| `.claude/skills/verify/features/contact.md` | UPDATE | +3/-0 |
| `.claude/skills/verify/SKILL.md` | UPDATE | +3/-1 |

## Deviations from Plan

1. **Usage printer stays `sed -n '2,16p'`, not `'2,17p'`.** The original `'2,16p'` was already off by one: it printed the `set -euo pipefail` line. With the added usage line, `'2,16p'` covers exactly the usage block, while `'2,17p'` would have kept printing `set`.
2. **Env override uses `${CHROME_DEVTOOLS_AXI_CHROME_ARGS-…}` (unset-only) instead of `:-`.** This way an explicitly empty value is honoured as "use the old pointer-less browser", which is the owner's requested override. It is documented in `ax.sh` and `SKILL.md`.
3. **The touch-tap probe reads the animations from a `window` `pointerdown` listener.** A target-phase listener's microtask runs before React's root-delegated `onPointerDown` for a trusted event, so it read `0` animations. That was a probe bug, not an app bug. The fixed probe, and a note in `contact.md`, use a `window` bubble listener.
4. **Docs commit scope.** The plan allowed the docs in the fix commit or a separate `docs(design-system): …` commit. A separate commit was used, and it also carries the verify-skill docs (`SKILL.md`, the feature recipes).
5. **The `SKILL.md` Drive bullet also notes** that after `ax.sh click` the mouse rests on the clicked element, so desktop screenshots show hover states. This is the plan's Risks mitigation ("Mention it in SKILL.md").

Owner decisions applied: the hover-capable launch is the `ax.sh` default for every check, overridable by env, with `ax.sh stop` needed once. Design-system `preview.html` files and `tokens.json` are untouched (follow-up). #86 (`cursor-pointer`) has not landed, so none was added. The blog 404 "← BACK TO ALL POSTS" button (`BlogPost.tsx:55`), which uses the same old recipe, was left alone as an out-of-scope follow-up.

## Tests Written

| Test | Cases |
|------|-------|
| `.claude/skills/verify/scripts/ax.sh buttons` (committed e2e check) | VIEW WORK must lift to `matrix(1, 0, 0, 1, -3, -3)` (`NOT-LIFTED` guard); CODE, READ STORY, SEND MESSAGE must match its full `transform`/`translate`/`box-shadow` (`MISMATCH`); `(hover: hover)` must be true (`NO-HOVER` guard, exercised on the mobile viewport); the hovered control must be the expected label (`WRONG-TARGET`) |
| `.temp/verify/runs/20261007-185647/send-touch-tap.mjs` (run evidence, gitignored) | A real CDP touch tap on SEND MESSAGE: one `playPress` animation, a submit fires, path and hash unchanged, no residual transform after 250ms |

There is no unit-test framework in the project, and none was introduced.

## Follow-ups

- `BlogPost.tsx:55` "← BACK TO ALL POSTS" still uses `brutal-shadow hover:-translate-y-1 hover:translate-x-1 transition-all`.
- Design-system `preview.html` files and `tokens.json` (`shadow-brutal-press`) still show the old recipe.
- #87 (first tap on Send Message ignored on mobile): check whether it still reproduces now that `:active`/`brutal-shadow` is gone from the button. The headless touch tap here submitted on the first tap.
