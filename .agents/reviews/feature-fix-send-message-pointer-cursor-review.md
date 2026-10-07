# Code Review: feature/fix-send-message-pointer-cursor

**Scope**: branch `feature/fix-send-message-pointer-cursor` vs merge base `852b644` (4 commits `e73a991..111d711`, plus the untracked plan and implementation report), checked against issue #86
**Recommendation**: APPROVE

## Summary

The branch appends `cursor-pointer` to the contact form's "Send Message" button (`src/features/contact/ContactForm.tsx:61`), mirrors it in the design-system "Accent submit" string (`.agents/design-system/laanhema-design-system/components/Button/README.md:4`), and adds an `ax.sh cursor` verify check (`.claude/skills/verify/scripts/ax.sh:86-92`) that is documented in `features/contact.md` and `SKILL.md`. All five acceptance criteria of #86 are met and independently re-verified: the check exits 1 on the pre-fix commit and 0 on the branch, and fails closed when the contact section is absent. `.agents/issues/todo-issues.md` has an unrelated uncommitted change and was excluded from the review.

## Acceptance Criteria (#86)

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Hovering "Send Message" with a mouse shows a pointer cursor | MET | `ax.sh cursor` on `/` and `/blog/tralla` (desktop 1280x900): `SEND MESSAGE cursor=pointer ok` |
| Inputs still show a text cursor; hover lift and shadow unchanged | MET | `NAME`/`EMAIL`/`MESSAGE cursor=text ok`; `ax.sh buttons` exits 0 with all four `transform=matrix(1, 0, 0, 1, -3, -3) translate=none shadow=rgb(18, 18, 18) 6px 6px 0px 0px ok` |
| "Accent submit" string in `Button/README.md` includes the cursor change | MET | `Button/README.md:4` ends in `touch-manipulation cursor-pointer`, matching `ContactForm.tsx:61` minus `mt-4` |
| Mandatory e2e check in `ax.sh`, fails before / passes after, documented in recipe and helper table | MET | Pre-fix worktree at `852b644`: `SEND MESSAGE cursor=default NOT-POINTER`, exit 1. Branch: exit 0. Documented at `features/contact.md:10,27,36` and `SKILL.md:55,102` |
| `npm run lint` and `npm run build` pass | MET | Both exit 0 |

## Issues Found

### Critical
None

### High Priority
None

### Medium Priority
None

### Suggestions (Low)
None

**Noted, not a finding**: the design-system `preview.html` files (`Button`, `ContactSection`, `FormField`, `Homepage`, `BlogArticle`) still carry the pre-#56 Send Message string without `cursor-pointer`, and `Button/README.md:6` (Mobile Menu) has drifted from `Nav.tsx` (missing `cursor-pointer`, `data-pressed:*`, `duration-75`, `touch-manipulation`). Both are pre-existing drift that the plan explicitly scoped out; the AC names only the "Accent submit" string. The issue's technical note says Tailwind v4 preflight "resets `button` to `cursor: default`"; the plan and implementation comment correct this (v4 dropped v3's `button { cursor: pointer }`, so the UA default applies), which is accurate per `node_modules/tailwindcss/preflight.css`.

## Validation Results

| Check | Status | Notes |
|-------|--------|-------|
| Build / Type Check | PASS | `npm run build` (`tsc -b && vite build`) on host, exit 0 |
| Warnings | NONE | No TypeScript or Vite warnings in build output |
| Lint | PASS | `npm run lint` (`eslint .`), exit 0, no problems |
| Tests | PASS | No unit-test runner in the project. E2E via `/verify` harness (dev server, headless Chrome with mouse, desktop 1280x900): `ax.sh cursor` exit 0 on `/` and `/blog/tralla`; `ax.sh buttons` exit 0 (4/4 ok); `ax.sh cursor` on pre-fix `852b644` (throwaway worktree in scratchpad, port 5299) exit 1 with `cursor=default NOT-POINTER`; fail-closed probe on `/blog/does-not-exist` prints `SEND MESSAGE cursor=? MISSING`, exit 1. `bash -n ax.sh` ok; usage printer (`2,17p`) ends at the `stop` line. No skipped or env-guarded checks. Server, browser session, and worktree were stopped/removed afterwards. |

## What's Good

- Minimal, targeted fix that mirrors the existing `Nav.tsx` pattern (`cursor-pointer` appended after `touch-manipulation`).
- Test-first commit ordering (`e73a991` before `5264750`), with the check proven red on the unfixed code.
- The check reads the computed style rather than relying on screenshots (which never show the OS cursor), guards the field cursors as a regression check for AC 2, and fails closed with a `MISSING` marker on pages without the contact section.
- The check follows the existing `ax.sh nav`/`tables` style (single `eval`, JSON-decode pipe, marker grep for the exit code), and the usage-printer range was bumped correctly.
- Root-cause description was corrected against the installed Tailwind preflight instead of copied from the issue.

## Recommendation

Ready to merge. Consider a follow-up issue for the stale design-system `preview.html` Send Message strings and the drifted Mobile Menu string in `Button/README.md`.
