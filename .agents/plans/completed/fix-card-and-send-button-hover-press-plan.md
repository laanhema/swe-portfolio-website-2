# Plan: Make "Code", "Read Story" and "Send Message" Hover and Press Like "View Work"

## Summary

The hero "View Work" button and the GitHub/LinkedIn social buttons share one interaction recipe. They use `shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation` and `onPointerDown={playPress}`, so on a real-hover device they lift `translate(-3px,-3px)` and keep the 6px shadow, and they play a Web Animations API press on pointerdown. The project card's "Code" and "Read Story" buttons (`src/features/showcase/ProjectCard.tsx`, three elements) and the contact form's "Send Message" button (`src/features/contact/ContactForm.tsx`) use the older Tailwind `hover:-translate-y-1 hover:translate-x-1` recipe instead. That recipe moves the button 4px up and to the right. The card pair also shrinks its shadow to 2px, and "Send Message" presses only through `.brutal-shadow:active`. The fix replaces those class strings with the reference recipe and adds `playPress` plus `touch-manipulation` to "Send Message". The design-system `Button/README.md` and the `DESIGN.md` state rules are updated to match. The mandatory e2e check is a new `ax.sh buttons` subcommand. It hovers VIEW WORK, the first card's CODE and READ STORY, and SEND MESSAGE on the desktop viewport, and it exits 1 unless all four compute the same `transform`, `translate` and `box-shadow`. The check needs one harness change first: headless Chrome reports `(hover: none)`, so `ax.sh` must launch Chrome with a hover-capable pointer, as described below.

## User Story

As a visitor to laanhema.dev,
I want every primary button to lift and press the same way,
So that the site feels consistent and every button gives the same tactile feedback on desktop and on touch.

## Metadata

| Field | Value |
|-------|-------|
| Type | BUG_FIX |
| Complexity | MEDIUM (the code change is small; the e2e harness needs a hover-capable browser) |
| Systems Affected | `src/features/showcase/ProjectCard.tsx`, `src/features/contact/ContactForm.tsx`, design-system Button docs, `/verify` skill (`ax.sh`, feature recipes, `SKILL.md`) |
| GitHub Issue | #56 (scope from the later "Scope changed" comment, which replaces the earlier technical notes) |
| Related | #86 (cursor-pointer on Send Message), #87 (first tap on Send Message ignored on mobile). Both touch the same button and neither blocks this one. |
| PRD Phase | N/A |

---

## Environment Findings

| Probe | Result |
|-------|--------|
| Baseline `npm run lint` | Passes, with 0 problems |
| Baseline `npm run build` | Passes (`tsc -b && vite build`, built in about 0.5s) |
| Test runner | None. There are no unit tests. The proof is the `/verify` harness (`ax.sh`, `chrome-devtools-axi`). |
| Headless verify Chrome, default launch | `matchMedia('(hover: hover)')` is **false**, `(pointer: none)` is **true**, and `maxTouchPoints` is 0, even after `ax.sh desktop`. Every `@media (hover: hover)` rule is dead in the harness today. |
| Launch with `CHROME_DEVTOOLS_AXI_CHROME_ARGS="--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4"` | `(hover: hover)` and `(pointer: fine)` are **true** on desktop. After `ax.sh mobile` (touch emulation), both are **false**. After `ax.sh desktop` again, both are **true**. This gives a real-mouse desktop and a hover-less touch phone in one session. |
| Tailwind v4 `hover:` variant (built CSS) | It is emitted inside `@media (hover:hover){…}`, the same media gate as `.brutal-shadow-hover` (`src/styles/global.css:59-64`). |
| Forward references to `#56` | Only `TODO.md:19` (the source line). There are no placeholders in `src/`, `.claude/` or prior plans. |

### Bug reproduction (verify harness, dev server, desktop 1280x900, hover-capable launch, HEAD 690da3e)

The steps were: hover each button with `chrome-devtools-axi hover @uid`, wait 1.2s, hover again (the first hover scrolls and starts the GSAP fade-in), wait 0.4s, then read `getComputedStyle` of the `a`/`button` that matches `:hover`. The four transparent Tailwind ring layers (`rgba(0, 0, 0, 0) 0px 0px 0px 0px, ×4`) are written below as `[4 rings] +`.

| Button | `transform` | `translate` | `box-shadow` | transition |
|--------|-------------|-------------|--------------|------------|
| VIEW WORK (reference) | `matrix(1, 0, 0, 1, -3, -3)` | `none` | `[4 rings] + rgb(18, 18, 18) 6px 6px 0px 0px` | `transform, box-shadow 0.1s` |
| CODE (GymBro) | `none` | `4px -4px` | `[4 rings] + rgb(18, 18, 18) 2px 2px 0px 0px` | `all 0.075s` |
| READ STORY (GymBro) | `none` | `4px -4px` | `[4 rings] + rgb(18, 18, 18) 2px 2px 0px 0px` | `all 0.075s` |
| SEND MESSAGE | `none` | `4px -4px` | `rgb(18, 18, 18) 6px 6px 0px 0px` (plain `.brutal-shadow`, no ring layers) | `all 0.15s` |

On the mobile viewport (375x812, touch), all four read `transform=none translate=none shadow=…6px 6px` while the mouse sits on them. `(hover: hover)` is false there, so neither recipe applies.

The bug reproduces against the AC's own metric. `transform` and `box-shadow` differ from VIEW WORK on all three target buttons. A check written to the AC fails on HEAD.

**Discrepancies with the issue text:**

- The issue says the buggy buttons move "up and to the right". They do, but by **4px** (`translate-x-1` / `-translate-y-1` = 0.25rem). The reference lift is 3px.
- Tailwind v4 classes use the CSS `translate` property, not `transform`. A check that compares `transform` alone sees `none` on the buggy buttons. It still fails on HEAD, because VIEW WORK reads `matrix(…-3, -3)`. The check also compares `translate`, so that a future `hover:translate-*` class on top of `brutal-shadow-hover` can't slip past it.
- The issue says "on touch screens their hover sticks after a tap". In Tailwind v4 the old `hover:` classes are already gated by `@media (hover: hover)`, the same gate the reference uses. On a pure-touch device (`hover: none`), neither recipe can stick. A sticky lift is possible only on devices that report `hover: hover` while being tapped (some Android or hybrid devices), and there the reference recipe behaves the same way. The real touch gap is the **press**. "Send Message" relies on `.brutal-shadow:active`, which mobile browsers skip or leave stuck (`src/components/playPress.ts:3-4`). Moving it to `playPress` closes that gap.

---

## Patterns to Follow

### Reference button recipe (copy verbatim)
```tsx
// SOURCE: src/App.tsx:175-182
<a
  href='#work'
  onClick={handleViewWork}
  onPointerDown={playPress}
  className='bg-[#121212] text-white px-8 py-4 text-xl font-bold uppercase shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation'
>
```

### Hover gate and old press rule
```css
/* SOURCE: src/styles/global.css:53-64 */
.brutal-shadow:active,
.brutal-shadow[data-pressed] {
  box-shadow: 0px 0px 0px 0px #121212;
  transform: translate(6px, 6px);
}

@media (hover: hover) {
  .brutal-shadow-hover:hover {
    box-shadow: var(--shadow-brutal);
    transform: translate(-3px, -3px);
  }
}
```
"Send Message" must swap `brutal-shadow` for `shadow-brutal` (the Tailwind utility). That removes the `:active` press, which `playPress` replaces, and puts its box-shadow in the same utility composite format as View Work. Do **not** edit `global.css`. `.brutal-shadow` is still used by cards, the portrait, `BlogPost.tsx` and the mobile menu button.

### Press handler
```ts
// SOURCE: src/components/playPress.ts:1-11
import type React from 'react';
const PRESS_KEYFRAMES: Keyframe[] = [
  { transform: 'translate(6px, 6px)', boxShadow: '0px 0px 0px 0px #121212', offset: 0.4 },
];
export const playPress = (e: React.PointerEvent<HTMLElement>) => {
  e.currentTarget.animate(PRESS_KEYFRAMES, { duration: 200, easing: 'ease-out' });
};
```
Import it as `import { playPress } from '../../components/playPress';` (`src/features/showcase/ProjectCard.tsx:4`).

### ax.sh check style (eval → JSON-decode → marker grep → exit code)
```bash
# SOURCE: .claude/skills/verify/scripts/ax.sh:41-45 (nav), :36-40 (tables)
  nav)
    out="$(axi eval "(() => { … return 'logo=' + … + (ok ? ' ok' : ' WRONG-FONT'); })()" \
      | sed -n 's/^result: //p' | python3 -c 'import json,sys; print(json.loads(json.loads(sys.stdin.read())))')"
    echo "$out"
    ! grep -q WRONG-FONT <<<"$out" ;;
```
The usage block is printed with `sed -n '2,16p' "$0"` (`ax.sh:52`). Adding one usage line means bumping that to `'2,17p'`.

### Recipe documentation style
```md
<!-- SOURCE: .claude/skills/verify/features/blog.md:30 (added by d9fb999 for #75) -->
- **Nav matches home (mobile).** Run `ax.sh mobile`, then `ax.sh nav` on `/`, `/blog`, `/blog/tralla`, and `/blog/does-not-exist`. Every line ends in `ok`, the `logo=` and `menu=` boxes match `/`, and each command exits 0 (#75).
```

### Commit pattern (test first, then fix)
`d9fb999 test(verify): add a nav font check across routes (#75)` → `3cb3ece fix(styles): … (#75)`. The check lands in its own commit, and that commit's message records that the check fails on the pre-fix code.

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `.claude/skills/verify/scripts/ax.sh` | UPDATE | Launch the verify Chrome with a hover-capable pointer by default, and add the `buttons` subcommand with its usage line. |
| `src/features/showcase/ProjectCard.tsx` | UPDATE | Swap the hover/transition classes on Code, Read Story `Link` and Read Story `a` (lines 56, 67, 75) for the reference recipe. |
| `src/features/contact/ContactForm.tsx` | UPDATE | "Send Message": `brutal-shadow` → `shadow-brutal`, the reference hover/transition, `touch-manipulation`, and `onPointerDown={playPress}`. |
| `.agents/design-system/laanhema-design-system/components/Button/README.md` | UPDATE | Change the "Accent submit" and "Card pair" class strings, extend the Press bullet to Accent submit, and rename the card pair's ink button "Read Story". |
| `.agents/design-system/laanhema-design-system/DESIGN.md` | UPDATE | Lines 50-52: one hover rule for all buttons, and the press rule now names `playPress`, so the governing doc doesn't contradict the code. |
| `.claude/skills/verify/features/project-showcase.md` | UPDATE | Add a "Hover/press match" step and a gotcha. |
| `.claude/skills/verify/features/contact.md` | UPDATE | Add a "Hover/press match" step and a "Press" step. |
| `.claude/skills/verify/SKILL.md` | UPDATE | Helpers table (`buttons`), a Drive example, and a note on the hover-capable desktop. |

Not touched: `src/App.tsx`, `src/styles/global.css`, `src/components/playPress.ts`, `Nav.tsx`, and `.agents/issues/todo-issues.md`, which has an unrelated uncommitted change. Do not stage it.

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Give the verify browser a real mouse, and add `ax.sh buttons` (proves the bug first)

- **File**: `.claude/skills/verify/scripts/ax.sh`
- **Action**: UPDATE
- **Implement**:
  1. After `export CHROME_DEVTOOLS_AXI_SESSION=…`, add a default that keeps any value the caller already set:
     ```bash
     # Headless Chrome reports (hover: none) / (pointer: none), which disables every @media (hover: hover) rule.
     # Launch it with a mouse so `desktop` behaves like a desktop; `mobile` (touch emulation) still reports hover: none.
     # Only applies when the session's browser starts: run `ax.sh stop` once to pick it up.
     export CHROME_DEVTOOLS_AXI_CHROME_ARGS="${CHROME_DEVTOOLS_AXI_CHROME_ARGS:---blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4}"
     ```
  2. Add the usage line under `nav`:
     `#   ax.sh buttons                     hover VIEW WORK, the first card's CODE and READ STORY, and SEND MESSAGE; exit 1 unless all four lift the same (#56)`
     Then bump the usage printer to `sed -n '2,17p' "$0"`.
  3. Add a `buttons)` case. For each of `link "VIEW WORK"`, `link "CODE"`, `link "READ STORY"`, `button "SEND MESSAGE"`, in that order:
     - Take a fresh snapshot, `grep -E -m1` the pattern, and `axi hover "@<uid>"`. Then `sleep 1.2`. The hover scrolls the target into view, and GSAP slides its `.animate-on-scroll` parent up by 50px for 0.8s.
     - Take a fresh snapshot again and hover again (refs are generation-tagged, so never reuse the first uid). Then `sleep 0.4`, which is longer than the 100ms transition.
     - `axi eval` a reader. It finds the hovered control as `[...document.querySelectorAll('a,button')].filter(x => x.matches(':hover')).pop()` and returns `label|hoverMedia|transform|translate|boxShadow`. The label is `textContent.trim().toUpperCase()` and hoverMedia is `matchMedia('(hover: hover)').matches`. Decode it with the same `sed | python3` pipe as `nav`.
  4. Compare in a small inline `python3`, with VIEW WORK as row 0. Print one line per button: `<LABEL> transform=… translate=… shadow=<last shadow layer> <status>`. Status values:
     - `NO-HOVER` when `hoverMedia` is false. The browser was started without step 1, so run `ax.sh stop` and retry.
     - `WRONG-TARGET` when the label is not the expected `VIEW WORK` / `CODE` / `READ STORY` / `SEND MESSAGE`. The mouse landed on something else.
     - `NOT-LIFTED` on row 0 when VIEW WORK's transform is not `matrix(1, 0, 0, 1, -3, -3)`. This guards against a vacuous pass where nothing hovers.
     - `MISMATCH` when the full `transform`, `translate` or `box-shadow` string differs from row 0.
     - `ok` otherwise.
     Exit 1 if any line is not `ok`, in the same `! grep -q -E 'NO-HOVER|WRONG-TARGET|NOT-LIFTED|MISMATCH'` style as `nav`.
  5. The check reads state and drives the mouse only through `hover` (a real CDP mouse move). It does not use `eval` to fake `:hover`, which keeps it on the user path.
- **Mirror**: `.claude/skills/verify/scripts/ax.sh:23-29` (snapshot → uid → act), `:41-45` (eval → decode → marker → exit code)
- **Validate** (on the **unfixed** code):
  ```bash
  S=.claude/skills/verify/scripts/verify-server.sh; A=.claude/skills/verify/scripts/ax.sh
  $A stop; $S start          # copy RUN_DIR; $A stop ensures the new launch args apply
  $A open /; $A desktop; $A open /
  $A buttons; echo "exit=$?"  # EXPECT: VIEW WORK ok; CODE/READ STORY/SEND MESSAGE MISMATCH; exit=1
  ```
  Save the output to `$RUN_DIR/buttons-before.txt`. Commit only `ax.sh` as `test(verify): add a hover/press match check for card and submit buttons (#56)`, and say in the body that the check fails on HEAD.

### Task 2: Card pair uses the reference recipe

- **File**: `src/features/showcase/ProjectCard.tsx`
- **Action**: UPDATE
- **Implement**: In all three class strings (Code `a` at line 56, Read Story `Link` at line 67, Read Story `a` at line 75), replace
  `shadow-brutal hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#121212] transition-all duration-75 touch-manipulation`
  with
  `shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation`.
  Leave every other class (`flex-1 … leading-tight`, fills, borders) and `onPointerDown={playPress}` unchanged. The card `article` keeps `brutal-shadow` and gets no hover. Its layout must not change.
- **Mirror**: `src/App.tsx:179`
- **Validate**: `npm run lint && npm run build`

### Task 3: "Send Message" uses the reference recipe and `playPress`

- **File**: `src/features/contact/ContactForm.tsx`
- **Action**: UPDATE
- **Implement**:
  1. Add `import { playPress } from '../../components/playPress';` after the `MailIcon` import.
  2. Change the button's class string from
     `mt-4 bg-[#ff3e00] text-white brutal-border py-4 font-bold uppercase text-xl brutal-shadow hover:-translate-y-1 hover:translate-x-1 transition-all`
     to
     `mt-4 bg-[#ff3e00] text-white brutal-border py-4 font-bold uppercase text-xl shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation`.
     If #86 has landed by then, keep its `cursor-pointer` and append it at the end.
  3. Add `onPointerDown={playPress}` to the `<button>`. Keep `type="submit"`, and keep the form's `onSubmit={(e) => e.preventDefault()}`.
  4. Don't touch the inputs' `focus:brutal-shadow`.
- **Mirror**: `src/App.tsx:175-182`, `src/features/showcase/ProjectCard.tsx:56-57`
- **Validate**: `npm run lint && npm run build`, then `$A open /; $A desktop; $A open /; $A buttons` → four `ok` lines and exit 0. Save the output to `$RUN_DIR/buttons-after.txt`.

### Task 4: Design-system docs match the new classes

- **File**: `.agents/design-system/laanhema-design-system/components/Button/README.md`
- **Action**: UPDATE
- **Implement**:
  - **Accent submit (Send Message)**: `bg-[#ff3e00] text-white brutal-border py-4 font-bold uppercase text-xl shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation`. Keep "Use it for form submits. It is full width inside forms."
  - **Card pair (Code / Read Story)**: `Read Story` is the ink fill, so drop "Live Demo or Download APK", which no longer exists in `ProjectCard.tsx`. Both use `py-3 … shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation`.
  - **Press**: "the Primary CTA, the accent submit and the card pair pass `onPointerDown={playPress}` …".
- **File**: `.agents/design-system/laanhema-design-system/DESIGN.md`
- **Action**: UPDATE
- **Implement**: lines 50-52 only.
  - Merge the two hover bullets into one: "**Hover, buttons:** `brutal-shadow-hover` lifts the element `translate(-3px,-3px)` and keeps the 6px shadow. It only applies under `@media (hover: hover)`, so a tap never leaves it lifted. Pair it with `shadow-brutal transition-[transform,box-shadow] duration-100`."
  - Press bullet: "Buttons play the press with `onPointerDown={playPress}` (`translate(6px,6px)` with no shadow, so the element sits in its own shadow). `.brutal-shadow:active` does the same in CSS for non-button boxes. The mobile menu uses a smaller press …" (keep the rest).
- **Mirror**: the existing **Primary CTA** bullet (`Button/README.md:3`)
- **Validate**: `grep -n "hover:-translate-y-1\|hover:shadow-\[2px" .agents/design-system/laanhema-design-system/components/Button/README.md .agents/design-system/laanhema-design-system/DESIGN.md` prints nothing.

### Task 5: Document the check in the verify skill

- **File**: `.claude/skills/verify/features/project-showcase.md`
- **Action**: UPDATE
- **Implement**: Under "Driving it with ax.sh", after **Read story**, add:
  `- **Hover/press match (desktop).** Run `ax.sh desktop`, `ax.sh open /`, then `ax.sh buttons`. Every line ends in `ok`, every `transform=` reads `matrix(1, 0, 0, 1, -3, -3)` with `translate=none` and a `6px 6px` shadow, and the command exits 0 (#56).`
  Under Gotchas, add: "A browser session started before `ax.sh` launched Chrome with a mouse reports `(hover: none)`. `ax.sh buttons` then prints `NO-HOVER`. Run `ax.sh stop` and retry."
- **File**: `.claude/skills/verify/features/contact.md`
- **Action**: UPDATE
- **Implement**: After **Submit no-op**, add the same **Hover/press match (desktop)** bullet, which covers `SEND MESSAGE` against `VIEW WORK`. Also add a **Press** bullet: in one `eval`, dispatch `new PointerEvent('pointerdown', {bubbles: true})` on the Send Message button and return `getAnimations().length`. Expect `1`. Say in the report that this probe used `eval`. A real touch tap needs CDP `Input.dispatchTouchEvent`, as `SKILL.md` describes.
- **File**: `.claude/skills/verify/SKILL.md`
- **Action**: UPDATE
- **Implement**:
  - In the Drive block, add `$A buttons   # hover VIEW WORK, CODE, READ STORY, SEND MESSAGE; exit 1 unless they lift alike (#56)`.
  - Add a Drive bullet: "`ax.sh` launches the verify Chrome with a mouse (`--blink-settings=…HoverType=2…`), so `desktop` matches `(hover: hover)` and `mobile` (touch) does not. The flag applies only when the session's browser starts. After pulling this change, run `ax.sh stop` once."
  - In the Helpers table `ax.sh` row, add `buttons`. The row also lacks the existing `tables` and `nav`, so add them in the same cell.
- **Validate**: Read each file back. Check that the feature entry contract (H1, a paragraph, and the four H2s in order) is intact (`features/README.md`).

### Task 6: Full validation and e2e proof

- Run the Validation block and the End-to-End Verification below. Commit the fix as `fix(buttons): make Code, Read Story and Send Message hover and press like View Work (#56)`, plus the docs, either in that commit or in a separate `docs(design-system): …` commit. Never stage `.agents/issues/todo-issues.md`.

---

## Validation

```bash
# Lint
npm run lint

# Type check + production build
npm run build

# Tests: there is no unit-test runner. The mandatory e2e check is `ax.sh buttons` (below).
```

Start green and stay green. Both lint and build pass at 690da3e.

## End-to-End Verification

All steps run through the `/verify` harness. Record `doctor` output (git HEAD plus dirty `src/`) with the evidence.

```bash
S=.claude/skills/verify/scripts/verify-server.sh; A=.claude/skills/verify/scripts/ax.sh
$A stop; $S start; RUN_DIR=<printed>; $S doctor
```

1. **Fails before, passes after (AC: mandatory e2e).** On a pre-fix checkout of `src/` (Task 1 commit only), `$A open /; $A desktop; $A open /; $A buttons` exits **1**, with CODE/READ STORY/SEND MESSAGE `MISMATCH`. Save `$RUN_DIR/buttons-before.txt`. After Tasks 2-3, the same command exits **0** with four `ok` lines, each `transform=matrix(1, 0, 0, 1, -3, -3) translate=none shadow=rgb(18, 18, 18) 6px 6px 0px 0px`. Save `$RUN_DIR/buttons-after.txt`.
2. **Hover visual (desktop).** After the hover on SEND MESSAGE that `buttons` leaves in place, run `$A shot "$RUN_DIR/contact-send-hover-desktop.png"`. Then hover CODE again (snapshot → `chrome-devtools-axi hover @uid` → `sleep 0.4`) and take `$A shot "$RUN_DIR/showcase-code-hover-desktop.png"`. Read both PNGs. The button should be lifted up-left with the full shadow visible on the bottom-right.
3. **Press (desktop click + mobile tap).** For each of CODE (GymBro), READ STORY (GymBro) and SEND MESSAGE, one `eval` dispatches a bubbling `pointerdown` and returns `el.getAnimations().map(a => a.effect.getKeyframes()[0]?.transform)`. Expect `["translate(6px, 6px)"]`, the same as VIEW WORK. For a real touch tap on SEND MESSAGE on `$A mobile`, drive CDP `Input.dispatchTouchEvent` (touchStart/touchEnd) from a script saved in `$RUN_DIR` (the #72 recipe in `SKILL.md`). Expect one `playPress` animation, a submit that leaves `path`/`hash` unchanged, and computed `transform` back to `none` after 250ms.
4. **No sticky hover on touch.** On `$A mobile; $A open /`, hover each of the four buttons (mouse moves still reach the page) and read computed `transform`. All four read `none`, because `(hover: hover)` is false. Then take `$A shot "$RUN_DIR/showcase-mobile.png"` and `$A shot "$RUN_DIR/contact-mobile.png"` after scrolling to each section.
5. **Unchanged behavior.**
   - `$A click 'link "READ STORY" url=.*/blog/tralla'` then `$A state` → `"path": "/blog/tralla"`, `"scrollY": 0`.
   - `$A has 'link "CODE" url=".*github.com/laanhema/tralla"'` → matches.
   - `$A click 'button "SEND MESSAGE"'` then `$A state` → path and hash unchanged.
   - VIEW WORK and the social buttons are unchanged in source (`git diff --stat` shows no `App.tsx`).
   - Card layout at desktop and mobile: follow the project-showcase **Layout** step.
   - The contact form at 320px: `chrome-devtools-axi emulate --viewport "320x640x2,mobile,touch"`, then a shot.
6. **Cleanup.** `$A stop; $S stop; ls "$RUN_DIR"`.

---

## Risks

| Risk | Mitigation | Scope |
|------|------------|-------|
| Headless Chrome reports `(hover: none)`, so a check written exactly as the AC states (hover + compare) passes vacuously for transform on the card pair, and every hover rule is dead. | `ax.sh` launches Chrome with `--blink-settings=primaryHoverType=2,…` (verified in this session: hover true on desktop, false on mobile touch). `buttons` fails closed with `NO-HOVER` and `NOT-LIFTED` guards. | In scope |
| An existing `verify` browser session was launched without the new flag. | `buttons` prints `NO-HOVER` and exits 1. SKILL.md and the gotcha say to run `ax.sh stop` once. | In scope |
| The default mouse launch changes other desktop recipes: after `ax.sh click`, the mouse rests on the clicked element, so screenshots now show real hover states. | This matches a real desktop and doesn't affect any existing assertion (`state`, `has`, `nav`, `tables`). Mention it in SKILL.md. A caller can override it by setting `CHROME_DEVTOOLS_AXI_CHROME_ARGS`. | In scope (doc only) |
| The hover scrolls the target into view, and the GSAP `y: 50 → 0` entrance moves it out from under the mouse, so the read hits the wrong element or nothing. | Hover, wait 1.2s, re-hover, then read. `WRONG-TARGET` catches a missed landing by label. This was verified in the reproduction probe. | In scope |
| `GSAP toggleActions: … reverse`: returning to VIEW WORK after scrolling down would reverse the bottom sections. | VIEW WORK is hovered first, and the order runs strictly top-to-bottom. | In scope |
| Box-shadow string format: `.brutal-shadow` computes a single layer, while the `shadow-brutal` utility computes five layers (four transparent rings). | Send Message must use `shadow-brutal` like the reference, which is also what makes the full-string compare pass. Don't loosen the check to compare only the last layer. | In scope |
| Removing `brutal-shadow` from Send Message drops its `:active` press. | `onPointerDown={playPress}` replaces it, which is the same path as the reference buttons. Keyboard Enter/Space submits without a press animation, the same as View Work today. | In scope |
| #86 (`cursor-pointer`) and #87 (first tap ignored) edit the same `<button>`. | Whichever lands later rebases. Keep `cursor-pointer` if present. Note in the PR whether #87 still reproduces after this change (the issue suggests sticky hover or `:active` may be the cause). Don't attempt the #87 fix here. | Out of scope (flag only) |
| `BlogPost.tsx:55` ("← BACK TO ALL POSTS" on the blog 404) uses the same old `brutal-shadow hover:-translate-y-1 hover:translate-x-1 transition-all` recipe. | The issue names only three buttons, so mention it as a follow-up in the PR. | Out of scope |
| Design-system `preview.html` files (`Button`, `ProjectCard`, `ContactSection`, `FormField`, `Homepage`, `BlogArticle`) and `tokens.json` (`shadow-brutal-press` usage) still show the old recipe. They are already stale for View Work and the social buttons too. | The AC names only `Button/README.md`. `DESIGN.md` is updated because AGENTS.md makes it the governing rule. Leave the previews and tokens. | Out of scope (see Open Questions) |

---

## Open Questions

1. **Global `ax.sh` mouse launch versus a per-check setting.** Default: make it the `ax.sh` default, overridable through the env var, so that every desktop proof sees real `(hover: hover)` behavior. The alternative is to apply the flag only for `buttons`, but that isn't possible without restarting the shared session. If the owner prefers the old pointer-less browser for other recipes, `buttons` alone could require the caller to export the flag and `ax.sh stop` first.
2. **Design-system previews and `tokens.json`.** Default: leave them for a follow-up, because the AC scopes the doc change to `Button/README.md` and the previews are already out of date for the reference buttons. Updating them now would grow the diff into six HTML files.
3. **"Sticky hover on touch" claim.** The measurements show the old `hover:` classes are already gated by `(hover: hover)` in Tailwind v4, so the fix doesn't change touch hover on `hover: none` devices. The visible touch improvement is the `playPress` press on Send Message. Default: say this in the PR and treat the AC as met by parity with the reference (same media gate, same press).

---

## Acceptance Criteria

- [ ] On a mouse hover, "Code", "Read Story" and "Send Message" lift 3px up and to the left (`matrix(1, 0, 0, 1, -3, -3)`, `translate: none`) and keep the full 6px shadow, the same as "View Work" and the social buttons.
- [ ] Pressing any of them plays the `playPress` animation (`translate(6px, 6px)`, no shadow) on both a desktop click and a mobile tap.
- [ ] On the touch viewport, nothing stays lifted or moved after a tap.
- [ ] "View Work", the social buttons, the card layout and the contact form layout are unchanged.
- [ ] The "Card pair" and "Accent submit" class strings in `Button/README.md` match the new classes, and `DESIGN.md` no longer prescribes the old card-button hover.
- [ ] `ax.sh buttons` exits 1 on the pre-fix code and 0 after the fix. It is documented in `project-showcase.md`, in `contact.md`, and in the `SKILL.md` helper table.
- [ ] `npm run lint` and `npm run build` pass.
- [ ] Follows existing patterns (`src/App.tsx:175-182`, `ax.sh nav`).
