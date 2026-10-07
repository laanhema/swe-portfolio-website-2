# Implementation Report

**Plan**: `.agents/plans/completed/sync-design-system-button-strings-plan.md`
**Branch**: `feature/sync-design-system-button-strings`
**Status**: COMPLETE (uncommitted, see Deviations)

## Summary

A docs-only sync for #91. Every button class string in the design-system `components/*/preview.html` files and `Button/README.md` now matches the shipped code byte for byte: Send Message (`ContactForm.tsx:61`), Code / Read Story (`ProjectCard.tsx:56,67,75`), Mobile Menu (`Nav.tsx:117`), View Work (`App.tsx:179`) and the social icon buttons (`App.tsx:188,198`). Labels and card buttons follow what the code renders. The Button preview's "Live Demo" and the Homepage preview's "Download APK" / "Live Demo" are now "Read Story", and the Tralla and Distill cards in the Homepage preview gained their missing Read Story button, because every project in `App.tsx` has a `postSlug`. Code-card GitHub icons gained `shrink-0`. `DESIGN.md:51` (Menu press rule) now names the `data-pressed:` twins, and two stale card-hover usage notes in `tokens.json` (spacing `1`, `shadow-brutal-press`) were updated. Nothing under `src/` changed.

## Tasks Completed

| # | Task | File | Status |
|---|------|------|--------|
| 1 | Scratch drift check, run on HEAD (fails: 9 FAIL lines, stale list, exit 1, no EMPTY) | `$SCRATCH/check-ds-buttons.sh` (outside repo) | ✅ |
| 2 | Button README Mobile Menu string (MENU minus `md:hidden`, plus `data-pressed` note); Button preview VIEW, SEND (in a `w-80` column), CODE + `shrink-0` icon, STORY "Read Story", MENU minus `md:hidden` | `components/Button/README.md`, `components/Button/preview.html` | ✅ |
| 3 | Send Message → SEND | `ContactSection`, `FormField`, `BlogArticle`, `Homepage` previews | ✅ |
| 4 | Card pairs → CODE/STORY; Homepage labels → Read Story; Read Story added to Tralla and Distill | `ProjectCard/preview.html`, `Homepage/preview.html` | ✅ |
| 5 | Mobile Menu → full MENU (with `md:hidden`) | `NavBar`, `MobileMenu`, `Homepage`, `BlogIndex`, `BlogArticle` previews | ✅ |
| 6 | View Work → VIEW, social anchors → SOCIAL | `Hero`, `Homepage`, `SocialIconButton` previews | ✅ |
| 7 | Menu press rule gains `data-pressed:`; tokens.json spacing `1` and `shadow-brutal-press` notes | `DESIGN.md`, `tokens.json` | ✅ |
| 8 | Full validation and E2E; commits | — | ✅ validation / ⚠️ commits not made (see Deviations) |

## Validation Results

| Check | Result |
|-------|--------|
| `npm run lint` | ✅ exit 0 |
| `npm run build` (`tsc -b && vite build`) | ✅ exit 0, built in 443ms |
| Tests | No unit-test runner in the project. The scratch drift check stands in (below). |
| Drift check on HEAD (before) | ✅ fails as expected: SEND/CODE/STORY/MENU/MENU_NOMD/VIEW/SOCIAL=0, READ_STORY_LABEL=2, `FAIL README menu`, stale list, exit 1, no `EMPTY` lines |
| Drift check after | ✅ all `ok`: SEND=5, CODE=7, STORY=7, MENU=5, MENU_NOMD=1, VIEW=3, SOCIAL=9, READ_STORY_LABEL=7, README menu, README send, no stale fragments; exit 0 |
| Per-task greps (Tasks 2-7) | ✅ all print the expected 0 / empty / 4; `tokens.json` parses as JSON |
| `src/` untouched (`git diff --quiet main -- src`) | ✅ |
| Only design-system files changed | ✅ The `git diff --name-only main` filter also lists `.agents/issues/todo-issues.md`, which is the pre-existing, unrelated working-tree change (left untouched, as instructed) |
| E2E: Button preview (headless, 1280px) | ✅ Labels View Work, Send Message, Code, Read Story, Menu. All `cursor: pointer` (Send Message was `default` at HEAD), all ending in `rgb(18, 18, 18) 6px 6px 0px 0px`. Send Message is 320px wide. The screenshot shows the white Code (with icon) next to the ink Read Story. |
| E2E: Homepage preview | ✅ 19 anchors, 4 × Read Story, all four card rows have 2 children and no overflow, no page horizontal overflow at 1280px; full-page screenshot looked right |
| E2E: NavBar, MobileMenu, ContactSection previews | ✅ No visible breakage at 1280px. MobileMenu at 375px shows the Close button (`display: block`, pointer, 6px shadow) and the drawer. |

## Files Changed

All under `.agents/design-system/laanhema-design-system/`.

| File | Action | Lines |
|------|--------|-------|
| `DESIGN.md` | UPDATE | +1/-1 |
| `tokens.json` | UPDATE | +2/-2 |
| `components/Button/README.md` | UPDATE | +1/-1 |
| `components/Button/preview.html` | UPDATE | +5/-5 |
| `components/BlogArticle/preview.html` | UPDATE | +2/-2 |
| `components/BlogIndex/preview.html` | UPDATE | +1/-1 |
| `components/ContactSection/preview.html` | UPDATE | +1/-1 |
| `components/FormField/preview.html` | UPDATE | +1/-1 |
| `components/Hero/preview.html` | UPDATE | +4/-4 |
| `components/Homepage/preview.html` | UPDATE | +14/-14 |
| `components/MobileMenu/preview.html` | UPDATE | +1/-1 |
| `components/NavBar/preview.html` | UPDATE | +1/-1 |
| `components/ProjectCard/preview.html` | UPDATE | +4/-4 |
| `components/SocialIconButton/preview.html` | UPDATE | +3/-3 |

## Deviations from Plan

- **No commits.** Task 8 says to commit by explicit path. The `git add` + `git commit` call was denied by the session's permission classifier, so all changes are **uncommitted** on `feature/sync-design-system-button-strings`. Nothing was staged. To commit them, stage only the 14 design-system paths above (never `.agents/issues/todo-issues.md`), for example as the two `docs(design-system): … (#91)` commits the plan proposes.
- **Issue #91 comment not posted.** GitHub returned server errors on every route: `gh issue comment` (GraphQL "Something went wrong"), the REST `gh api …/issues/91/comments` ("unexpected end of JSON input", twice) and the MCP tool (`500`). The comment list was checked, and no duplicate was created. The issue stays open with its labels unchanged. Post the implementation comment manually once GitHub recovers.
- **Edit mechanism.** The class swaps went through a scratch Python script (outside the repo) that asserted each old string's exact count per file before replacing it, and asserted that the canonical strings equal the code's `className` values. The result matches the plan's per-line instructions.
- Open questions were resolved with the plan's defaults, per the invoking request: `md:hidden` is left out of the Button README/preview Menu string, `styles/bundle.css` was not rebuilt, the Twitter anchors stay (classes synced only), and `src/` is untouched.

## Found but not fixed (follow-ups for the PR / new issues)

| Location | Drift | Suggested follow-up |
|---|---|---|
| `src/features/blog/BlogPost.tsx:55` | The "Back to All Posts" 404 CTA still uses the pre-#56 recipe **in the code** | Code issue: apply the #56 recipe (`shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation` + `playPress`) |
| Twitter links in the `Hero`, `Homepage`, `SocialIconButton` (preview + README "Provide" line), `Footer`, `BlogIndex` and `BlogArticle` previews, and in `DESIGN.md` | The code removed Twitter/X | One issue to remove Twitter from the design system |
| `DESIGN.md:19` | Writing-rule examples still say "Live Demo" and "Download APK" | Update the copy examples |
| `BlogArticle/preview.html:13` | The back link uses `hover:underline …`, while `ArticleHeader.tsx:82` uses the text-colour + underline-bar sweep | Sync the text-link treatment |
| `styles/bundle.css` | Lacks `transition-[transform,box-shadow]`, `duration-100/75`, `touch-manipulation` and `data-pressed:*`, so these are no-ops in the previews (instant hover lift, no `data-pressed` demo) | Optional: rebuild with Tailwind 4.3.x over `components/**/*.html` |
| `ContactSection/preview.html` | "Epic." heading and old paragraph copy | Content sync with `ContactForm.tsx` |

## Tests Written

There's no test framework, and per the skill none was introduced. The proof is the scratch drift check `check-ds-buttons.sh` (in the session scratchpad, not the repo). It pulls the canonical strings live from `src/` by line number, asserts exact occurrence counts across all previews, checks the Button README, and greps for every stale fragment. It failed on HEAD (exit 1) and passes after the change (exit 0). Headless renders of the Button, Homepage, NavBar, MobileMenu (1280px and 375px) and ContactSection previews add to it.
