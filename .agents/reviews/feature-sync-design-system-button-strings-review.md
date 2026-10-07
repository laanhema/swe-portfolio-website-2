# Code Review: feature/sync-design-system-button-strings

**Scope**: branch `feature/sync-design-system-button-strings` vs merge base `c035d9c` (main), all uncommitted. Checked against issue #91. The unrelated `.agents/issues/todo-issues.md` change is excluded.
**Recommendation**: APPROVE WITH NITS

## Summary

This is a docs-only sync of the design-system button strings: 14 files under `.agents/design-system/laanhema-design-system/`, plus the untracked plan and implementation report. Every button and link class string in `components/*/preview.html` and `Button/README.md` now matches the code byte for byte. I checked this by pulling each `className` from `ContactForm.tsx:61`, `ProjectCard.tsx:56,67`, `Nav.tsx:117` and `App.tsx:179,188`. Then I listed every distinct `<a>`/`<button>` class string in the previews, and none is left over. All five acceptance criteria are met. The only findings are two Low accuracy nits in the `tokens.json` usage notes that were rewritten. I skimmed the plan file but did not review it line by line.

## Acceptance criteria (#91)

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Send Message in ContactSection, Homepage and Button previews matches `ContactForm.tsx`, with the #56 classes and `cursor-pointer` | Met | The exact `ContactForm.tsx:61` string appears 5 times: `ContactSection/preview.html:17`, `Homepage/preview.html:96`, `Button/preview.html:7`, plus FormField:9 and BlogArticle:46 |
| 2 | Code / Read Story card buttons in the Button preview match `ProjectCard.tsx`, labelled "Read Story" | Met | `Button/preview.html:9-10` match `ProjectCard.tsx:56,67` exactly. The label is "Read Story", and the icon gained `shrink-0` as in the code |
| 3 | Mobile Menu in Button README and preview matches `Nav.tsx`, with `data-pressed:`, `touch-manipulation` and `cursor-pointer` | Met | `Button/README.md:6` and `Button/preview.html:12` equal `Nav.tsx:117` minus `md:hidden`, and the README says `md:hidden` is added in the nav. The 5 nav previews carry the full string |
| 4 | Every other preview and README checked, and drift fixed or listed in the PR | Met | View Work and the social icon buttons were also fixed (Hero, Homepage, SocialIconButton). Drift that isn't a class string is listed under "Found but not fixed" in `.agents/reports/sync-design-system-button-strings-plan-report.md`. That list has to go into the PR body |
| 5 | Only design-system files change, and lint and build pass | Met | `git diff --quiet main -- src` passes. Outside the design system, the only diff is the excluded `todo-issues.md`. Lint and build pass (below) |

## Issues Found

### Critical
None

### High Priority
None

### Medium Priority
None

### Suggestions (Low)

- **L1** `.agents/design-system/laanhema-design-system/tokens.json:334` — The new `shadow-brutal-press` note says "every button keeps the 6px shadow on hover (`brutal-shadow-hover`) and presses to 0 with `playPress`", but that is not true for the Mobile Menu. It has no hover lift and presses with `active:`/`data-pressed:` `translate-x-1 translate-y-1 shadow-none` (`Nav.tsx:117`). It is also not true for the 404 CTA (`BlogPost.tsx:55`). **Why:** agents treat `tokens.json` as authoritative, and this claim contradicts `DESIGN.md:51` and `Button/README.md:6`. **Fix:** narrow it, for example "Not used by any button since #56: the CTA, submit, card and social buttons keep the 6px shadow on hover and press to 0 with `playPress`. Kept for reference only."
- **L2** `.agents/design-system/laanhema-design-system/tokens.json:245` — The `space-1` note now lists only "tag padding-y". Step `1` is still used by the Mobile Menu press (`active:`/`data-pressed:translate-x-1 translate-y-1`, `Nav.tsx:117`). **Why:** the edit removed the stale card-hover use but left out this remaining one, so the "where each one is used" notes (`README.md:12`) are incomplete. **Fix:** "`1` — tag padding-y, Mobile Menu press nudge (`translate-x-1 translate-y-1`)."

**Noted, not a finding**: The plan scoped these out and the implementation report lists them as follow-ups, which AC 4 allows ("listed in the PR"):
- `DESIGN.md:19` still uses "Live Demo" and "Download APK" as label examples.
- Twitter anchors remain in the previews and `DESIGN.md`.
- `BlogPost.tsx:55` uses the pre-#56 CTA recipe in code.
- The BlogArticle back-link hover is out of sync.
- The ContactSection preview copy is out of date.
- `styles/bundle.css` lacks `transition-[transform,box-shadow]`, `duration-*`, `touch-manipulation` and `data-pressed:*`, so those classes do nothing in the static previews. `shadow-brutal`, `brutal-shadow-hover`, `cursor-pointer`, `shrink-0`, `px-3`, `leading-tight`, `w-80` and `mt-4` are present.

The changes are still uncommitted, and the implementation comment on #91 was not posted because of GitHub errors.

## Validation Results

| Check | Status | Notes |
|-------|--------|-------|
| Build / Type Check | PASS | `npm run build` (`tsc -b && vite build`) on the host, exit 0, built in 473ms |
| Warnings | NONE | No TS or Vite warnings in the build output |
| Lint | PASS | `npm run lint` (`eslint .`), exit 0 |
| Tests | N/A | The project has no test runner. Instead, an ad-hoc byte comparison of each code `className` against the previews found SEND=5, CODE=7, STORY=7, MENU=5 (+1 without `md:hidden`), VIEW=3 and SOCIAL=9, and no other button class strings in any preview. `tokens.json` parses as JSON |
| `src/` untouched | PASS | `git diff --quiet main -- src` |

## What's Good

- Strings were copied from the code mechanically, with counts asserted, so there is no near-miss drift. Every class string in the previews now corresponds to a real `className`.
- The work went past the named files where it should have. It fixed View Work and the social buttons with the same stale recipe, and added the missing Read Story buttons for Tralla and Distill to match `App.tsx` (every project has a `postSlug`).
- `DESIGN.md:51` and `Button/README.md:6` now explain why the Menu needs `data-pressed:`, which stops a future "cleanup" from deleting those classes.
- The report keeps a clear follow-up list for the drift it did not fix.

## Recommendation

Merge after optionally fixing L1 and L2 (one-line wording edits in `tokens.json`). Commit only the 14 design-system paths (plus the plan and report if wanted), never `.agents/issues/todo-issues.md`. Copy the report's "Found but not fixed" table into the PR body to satisfy AC 4, and file follow-up issues for `BlogPost.tsx:55` and the Twitter removal.
