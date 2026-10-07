# Plan: Show a Pointer Cursor on the "Send Message" Button

## Summary

When a mouse hovers over the contact form's "Send Message" `<button>` (`src/features/contact/ContactForm.tsx:59-65`), the computed cursor is `default`, so the arrow cursor shows. Tailwind v4 dropped v3's preflight rule that gave buttons `cursor: pointer`, so buttons now fall back to the browser's default arrow. The only other `<button>` in `src/` is the mobile Menu button (`src/features/navigation/Nav.tsx:110-123`), and it already ends its class string with `cursor-pointer`. Every other CTA is an `<a>` or `Link`, and those get a pointer from the browser. The fix appends `cursor-pointer` to the Send Message class string and to the matching "Accent submit" class string in the design-system `Button/README.md`. The mandatory e2e proof is a new `ax.sh cursor` subcommand, written like `ax.sh nav`. It reads the computed `cursor` of `SEND MESSAGE` on the desktop viewport and exits 1 unless the value is `pointer`. It also reads the NAME, EMAIL and MESSAGE fields and exits 1 unless each is `text`, which covers the "inputs still show a text cursor" AC. The check is documented in the contact feature recipe and in the `SKILL.md` helper table.

## User Story

As a visitor using a mouse on laanhema.dev,
I want the "Send Message" button to show a pointer cursor,
So that it looks clickable like every other button and link on the site.

## Metadata

| Field | Value |
|-------|-------|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/features/contact/ContactForm.tsx`, design-system `Button/README.md`, `/verify` skill (`ax.sh`, `features/contact.md`, `SKILL.md`) |
| GitHub Issue | #86 |
| Related | #56 (merged in 852b644, which gave this button its current hover/press recipe). #87 (closed, same button). Neither blocks this issue. Plan against current `main`. |
| PRD Phase | N/A |

---

## Environment Findings

| Probe | Result |
|-------|--------|
| Baseline `npm run lint` | Passes (exit 0, no problems) at 852b644 |
| Baseline `npm run build` | Passes (`tsc -b && vite build`, built in about 0.5s) at 852b644 |
| Test runner | None. There are no unit tests. The proof is the `/verify` harness (`ax.sh` over `chrome-devtools-axi`, session `verify`). |
| Verify harness | `verify-server.sh start` (dev) is ready on 5199. `doctor: HEALTHY`, git 852b644, and only `.agents/issues/todo-issues.md` is dirty. |
| Hover-capable launch | After `ax.sh desktop`, `matchMedia('(hover: hover)')` and `(pointer: fine)` are both **true**. `ax.sh` has launched Chrome with a mouse by default since #56. Computed `cursor` doesn't depend on these media features, but the check is still meant to run on the desktop viewport, as the AC requires. |
| Forward references to `#86` | `.agents/plans/completed/fix-card-and-send-button-hover-press-plan.md:21,207,302` says "if #86 has landed, keep its `cursor-pointer` and **append it at the end**". `.agents/reviews/feature-fix-card-and-send-button-hover-press-review.md:25` notes that Send Message still computes `cursor: default` pending #86. There are no placeholders in `src/` or `.claude/`. |

### Bug reproduction (verify harness, dev server, desktop 1280x900, HEAD 852b644)

Each value is `getComputedStyle(el).cursor`, read with `chrome-devtools-axi eval` after `ax.sh open /; ax.sh desktop; ax.sh open /`.

| Element | Computed `cursor` | Expected after fix |
|---------|-------------------|--------------------|
| `SEND MESSAGE` (`#contact button[type=submit]`) | **`default`** | `pointer` |
| `SEND MESSAGE` on `/blog/tralla` (same `ContactForm` component) | **`default`** | `pointer` |
| `#name`, `#email`, `#message` | `text` | `text` (unchanged) |
| Mobile Menu button (`cursor-pointer` reference) | `pointer` | `pointer` (unchanged) |
| `SEND MESSAGE` with `cursor-pointer` added through `classList` (read-only probe, reverted in the same `eval`) | `pointer` | n/a. This confirms the utility is already in the built CSS (Nav uses it) and wins over the default. |

The bug reproduces against the AC's own metric, so a check written to the AC fails on HEAD.

**Discrepancy with the issue's technical notes:** the notes say "the Tailwind v4 preflight resets `button` to `cursor: default`". `node_modules/tailwindcss/preflight.css` has no `cursor` rule for buttons, only a Safari spin-button note at line 379. What actually happened is that Tailwind v4 *removed* v3's `button { cursor: pointer }`, so the browser's own default (`default`) applies. The fix is the same either way. Record this in the PR so the root cause is described accurately.

---

## Patterns to Follow

### Pointer cursor on a `<button>` (append at the end of the class string)
```tsx
// SOURCE: src/features/navigation/Nav.tsx:117
className='md:hidden brutal-border px-4 py-2 font-bold uppercase bg-[#ff3e00] text-white brutal-shadow active:translate-x-1 ... transition-all duration-75 touch-manipulation cursor-pointer'
```

### Current Send Message button (the target)
```tsx
// SOURCE: src/features/contact/ContactForm.tsx:59-65
<button 
  type="submit"
  className="mt-4 bg-[#ff3e00] text-white brutal-border py-4 font-bold uppercase text-xl shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation"
  onPointerDown={playPress}
>
  Send Message
</button>
```

### ax.sh check style (eval → JSON-decode → marker grep → exit code)
```bash
# SOURCE: .claude/skills/verify/scripts/ax.sh:49-53 (nav)
  nav)
    out="$(axi eval "(() => { … return 'logo=' + box(logo) + … + (ok ? ' ok' : ' WRONG-FONT'); })()" \
      | sed -n 's/^result: //p' | python3 -c 'import json,sys; print(json.loads(json.loads(sys.stdin.read())))')"
    echo "$out"
    ! grep -q WRONG-FONT <<<"$out" ;;
```
The usage block is `ax.sh:5-16`, and the printer is `sed -n '2,16p' "$0"` (`ax.sh:89`). Adding one usage line means bumping it to `'2,17p'`.

### Recipe documentation style
```md
<!-- SOURCE: .claude/skills/verify/features/contact.md:25 (added for #56) -->
- **Hover/press match (desktop).** Run `ax.sh open /`, `ax.sh desktop`, `ax.sh open /`, then `ax.sh buttons`. Every line ends in `ok`, … and the command exits 0 (#56).
```

### Commit pattern (test first, then fix)
`7f5497c test(verify): add a hover/press match check for card and submit buttons (#56)` → `b599c38 fix(buttons): … (#56)` → `b755c12 docs(design-system): … (#56)`. The check lands in its own commit, and that commit's body records that the check fails on the pre-fix code.

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `.claude/skills/verify/scripts/ax.sh` | UPDATE | Add the `cursor` subcommand and its usage line, and bump the usage printer range. |
| `src/features/contact/ContactForm.tsx` | UPDATE | Append `cursor-pointer` to the Send Message class string (line 61). |
| `.agents/design-system/laanhema-design-system/components/Button/README.md` | UPDATE | Append `cursor-pointer` to the "Accent submit" class string (line 4). |
| `.claude/skills/verify/features/contact.md` | UPDATE | Add a sub-feature line and a "Pointer cursor (desktop)" driving step. |
| `.claude/skills/verify/SKILL.md` | UPDATE | Add a Drive example (`$A cursor`) and add `cursor` to the Helpers table `ax.sh` row. |

Not touched: `src/styles/global.css` (no global `button { cursor: pointer }` rule, see Open Questions), `Nav.tsx`, `DESIGN.md`, the design-system `preview.html` files, and `.agents/issues/todo-issues.md`, which has an unrelated uncommitted change and must never be staged, reverted or edited.

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Add `ax.sh cursor` (proves the bug first)

- **File**: `.claude/skills/verify/scripts/ax.sh`
- **Action**: UPDATE
- **Implement**:
  1. Add a usage line directly under the `buttons` line (`ax.sh:14`):
     `#   ax.sh cursor                      print SEND MESSAGE's and the form fields' computed cursor; exit 1 unless the button is pointer and the fields are text (#86)`
     Then change the usage printer at the bottom from `sed -n '2,16p' "$0"` to `sed -n '2,17p' "$0"`.
  2. Add a `cursor)` case after `buttons)` and before `aria)`. Use one `axi eval` that returns a newline-joined report:
     ```js
     (() => {
       const btn = [...document.querySelectorAll('#contact button')].find(b => b.textContent.trim().toUpperCase() === 'SEND MESSAGE');
       if (!btn) return 'SEND MESSAGE cursor=? MISSING';
       const rows = [];
       const c = getComputedStyle(btn).cursor;
       rows.push('SEND MESSAGE cursor=' + c + (c === 'pointer' ? ' ok' : ' NOT-POINTER'));
       for (const id of ['name', 'email', 'message']) {
         const el = document.getElementById(id);
         const v = el ? getComputedStyle(el).cursor : '?';
         rows.push(id.toUpperCase() + ' cursor=' + v + (!el ? ' MISSING' : v === 'text' ? ' ok' : ' NOT-TEXT'));
       }
       return rows.join('\n');
     })()
     ```
     Decode it with the same `| sed -n 's/^result: //p' | python3 -c 'import json,sys; print(json.loads(json.loads(sys.stdin.read())))'` pipe as `nav`/`tables`. In the bash double-quoted string, write the JS newline as `'\\n'`, as `tables` does at `ax.sh:45`.
  3. `echo "$out"`, then `! grep -q -E 'NOT-POINTER|NOT-TEXT|MISSING' <<<"$out"`. The `MISSING` marker makes the check fail closed if it runs on a page without the contact section or before `ax.sh open`.
  4. The check only reads, through `eval`. It needs no hover, because computed `cursor` comes from the cascade and not from `:hover`. That's why no hover/GSAP waits are needed, unlike `buttons`.
- **Mirror**: `.claude/skills/verify/scripts/ax.sh:44-53` (`tables`, `nav`)
- **Validate** (on the **unfixed** code):
  ```bash
  S=.claude/skills/verify/scripts/verify-server.sh; A=.claude/skills/verify/scripts/ax.sh
  $S start; RUN_DIR=<printed>; $S doctor
  $A open /; $A desktop; $A open /
  $A cursor | tee "$RUN_DIR/cursor-before.txt"; echo "exit=${PIPESTATUS[0]}"
  # EXPECT: "SEND MESSAGE cursor=default NOT-POINTER", NAME/EMAIL/MESSAGE "cursor=text ok", exit=1
  bash -n .claude/skills/verify/scripts/ax.sh; $A | tail -3   # syntax ok; usage now ends with the stop line
  ```
  Commit only `ax.sh`, as `test(verify): add a pointer-cursor check for Send Message (#86)`, and say in the body that the check exits 1 on 852b644 (`cursor=default`).

### Task 2: Give "Send Message" a pointer cursor

- **File**: `src/features/contact/ContactForm.tsx`
- **Action**: UPDATE
- **Implement**: On line 61, append ` cursor-pointer` at the **end** of the class string, after `touch-manipulation`. The result is:
  `mt-4 bg-[#ff3e00] text-white brutal-border py-4 font-bold uppercase text-xl shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation cursor-pointer`
  Change nothing else. Keep `type="submit"`, `onPointerDown={playPress}`, the form's `onSubmit={(e) => e.preventDefault()}`, and every input class string. The form still doesn't send anything (out of scope, AGENTS.md "Static Site Nature").
- **Mirror**: `src/features/navigation/Nav.tsx:117` (`… touch-manipulation cursor-pointer`)
- **Validate**: `npm run lint && npm run build`, then `$A open /; $A desktop; $A open /; $A cursor`. Expect four `ok` lines and exit 0. Save the output to `$RUN_DIR/cursor-after.txt`.

### Task 3: Design-system "Accent submit" string matches

- **File**: `.agents/design-system/laanhema-design-system/components/Button/README.md`
- **Action**: UPDATE
- **Implement**: In line 4 (**Accent submit**), append ` cursor-pointer` inside the backticks, after `touch-manipulation`, so the string matches `ContactForm.tsx:61` exactly. Leave the other bullets alone. In particular, don't edit the Mobile Menu string on line 6, even though it lacks the `cursor-pointer` that `Nav.tsx` has. That drift is out of scope (see Risks).
- **Mirror**: the existing bullet's wording and backtick style
- **Validate**: `diff <(grep -o 'mt-4 bg-\[#ff3e00\][^"]*' src/features/contact/ContactForm.tsx | sed 's/^mt-4 //') <(grep -o 'bg-\[#ff3e00\] text-white brutal-border py-4[^`]*' .agents/design-system/laanhema-design-system/components/Button/README.md)` prints nothing. The README string is the component string without the layout-only `mt-4`, the same convention #56 used.

### Task 4: Document the check in the verify skill

- **File**: `.claude/skills/verify/features/contact.md`
- **Action**: UPDATE
- **Implement**:
  - Under `## Sub-features`, add: `` - `contact-submit-cursor`: on a mouse device, `SEND MESSAGE` shows a pointer cursor, and the NAME, EMAIL, and MESSAGE fields show a text cursor. ``
  - Under `## Driving it with ax.sh`, directly after the **Hover/press match (desktop)** bullet, add:
    `` - **Pointer cursor (desktop).** Run `ax.sh open /`, `ax.sh desktop`, `ax.sh open /`, then `ax.sh cursor`. It prints `SEND MESSAGE cursor=pointer ok` and `NAME`/`EMAIL`/`MESSAGE cursor=text ok`, and it exits 0. On the pre-fix code it prints `cursor=default NOT-POINTER` and exits 1 (#86). ``
  - Under `## Gotchas`, add: "`ax.sh cursor` reads the computed style, so it shows the cursor a mouse would get without hovering. A screenshot never shows the mouse cursor, so the `cursor` output is the proof."
- **File**: `.claude/skills/verify/SKILL.md`
- **Action**: UPDATE
- **Implement**:
  - In the Drive code block, under the `$A buttons` line (line 54), add:
    `$A cursor                                             # read SEND MESSAGE's and the form fields' computed cursor; exit 1 unless pointer / text (#86)`
  - In the Helpers table (line 101), add `cursor` after `buttons` in the `ax.sh` cell.
- **Validate**: Read both files back. The feature entry contract (an H1, one paragraph, then `Sub-features`, `How to get to it (user POV)`, `Driving it with ax.sh`, `Gotchas` in order, per `features/README.md`) is intact. `grep -c cursor .claude/skills/verify/SKILL.md` is at least 2.

### Task 5: Full validation, e2e proof, and commits

- Run the Validation block and the End-to-End Verification below.
- Commit the fix as `fix(contact): show a pointer cursor on Send Message (#86)` (ContactForm.tsx), then `docs(design-system): add cursor-pointer to the accent submit button (#86)` (Button/README.md) and `docs(verify): document the Send Message cursor check (#86)` (contact.md and SKILL.md). Folding the docs into the fix commit is also fine.
- Stage files by explicit path only. **Never** stage `.agents/issues/todo-issues.md`. Check `git status -s` before each commit.

---

## Validation

```bash
# Lint
npm run lint

# Type check + production build
npm run build

# Tests: there is no unit-test runner. The mandatory e2e check is `ax.sh cursor` (below).
```

Start green and stay green. Both lint and build pass at 852b644.

## End-to-End Verification

All steps run through the `/verify` harness on the dev server. Record the `doctor` output (git HEAD plus dirty `src/`) with the evidence.

```bash
S=.claude/skills/verify/scripts/verify-server.sh; A=.claude/skills/verify/scripts/ax.sh
$S start; RUN_DIR=<printed>; $S doctor
```

1. **Fails before, passes after (AC: mandatory e2e).** With only the Task 1 commit applied (`src/` at 852b644), `$A open /; $A desktop; $A open /; $A cursor` exits **1** with `SEND MESSAGE cursor=default NOT-POINTER`. Save `$RUN_DIR/cursor-before.txt`. After Task 2, the same command exits **0** with `SEND MESSAGE cursor=pointer ok`, and `NAME`/`EMAIL`/`MESSAGE cursor=text ok`. Save `$RUN_DIR/cursor-after.txt`.
2. **Same component on a blog post.** `$A open /blog/tralla`, then `$A cursor` → exit 0. `BlogPost` renders the same `ContactForm`. Before the fix it read `default` there too.
3. **Hover lift and shadow unchanged (AC 2).** `$A open /; $A desktop; $A open /; $A buttons` → four `ok` lines, and `SEND MESSAGE transform=matrix(1, 0, 0, 1, -3, -3) translate=none shadow=rgb(18, 18, 18) 6px 6px 0px 0px ok`, exit 0. This matches the #56 result, so `cursor-pointer` didn't disturb the hover recipe. Save `$RUN_DIR/buttons-after.txt`.
4. **Visual (desktop).** After step 3, the mouse rests on SEND MESSAGE, so `$A shot "$RUN_DIR/contact-send-hover-desktop.png"`. Read the PNG and check that the button is lifted and the layout is unchanged. Screenshots don't show the OS cursor, so the cursor proof is step 1's output, not the image.
5. **Unchanged behavior.**
   - `$A click 'button "SEND MESSAGE"'` then `$A state` → path and hash unchanged (the submit is still a no-op).
   - `$A has 'link "LAHMAKKONEN@GMAIL.COM" url="mailto:lahmakkonen@gmail.com"'` → it matches.
   - `$A mobile; $A open /#contact; sleep 1.2; $A shot "$RUN_DIR/contact-mobile.png"`. The layout is identical (a cursor doesn't affect layout, and touch devices show no cursor).
   - `git diff --stat main` lists only the five files in Files to Change.
6. **Cleanup.** `$A stop; $S stop; ls "$RUN_DIR"`.

---

## Risks

| Risk | Mitigation | Scope |
|------|------------|-------|
| A check that hovers and inspects the screen can't see the OS cursor, because headless screenshots never render it. | The check reads `getComputedStyle(btn).cursor`, which the browser uses to pick the cursor. That's the metric the AC names. | In scope |
| The check passes vacuously when the contact section isn't on the page (wrong route, or no `open` yet). | The `MISSING` marker fails it closed. The recipe always runs `ax.sh open /` first. | In scope |
| Adding the class disturbs the #56 hover/press recipe. | `cursor-pointer` sets only `cursor`. E2E step 3 reruns `ax.sh buttons` as a regression guard. | In scope |
| A future `<button>` hits the same Tailwind v4 default-cursor gap. | Today the only `<button>`s in `src/` are Send Message and the Menu button (`grep -rn "<button" src`), and both will have `cursor-pointer`. A global base rule is a bigger design choice, see Open Questions. | Out of scope (flag only) |
| Design-system `preview.html` files (`Button`, `ContactSection`, `FormField`, `Homepage`, `BlogArticle`) still show the pre-#56 Send Message string, without `cursor-pointer`. | The AC names only `Button/README.md`, and #56 left these previews stale on purpose. Mention it in the PR as a follow-up. | Out of scope |
| `Button/README.md`'s **Mobile Menu** string (line 6) lacks the `cursor-pointer`, `data-pressed:*`, `duration-75` and `touch-manipulation` that `Nav.tsx:117` has. | This is pre-existing drift unrelated to #86, so leave it alone and mention it in the PR. | Out of scope |
| The unrelated dirty `.agents/issues/todo-issues.md` gets swept into a commit. | Stage explicit paths only, and check `git status -s` before each commit. | In scope |

---

## Open Questions

1. **Per-button class versus a global base rule.** Default: add `cursor-pointer` per button. The issue, the AC ("Accent submit" string includes the cursor change) and the existing Nav pattern all point to the class. A `@layer base { button:not(:disabled) { cursor: pointer } }` in `global.css` would cover future buttons but changes the base layer for the whole site. Leave that for the owner.
2. **Should `DESIGN.md` gain a rule ("`<button>`s add `cursor-pointer`; Tailwind v4 leaves them on the default arrow")?** Default: no, because the AC scopes the doc change to `Button/README.md`, and the class string there is what AGENTS.md says to reuse. A one-line addition under "Borders, shadows and states" would be cheap if the owner wants it.
3. **Accept `auto` as well as `text` for the fields?** Default: require `text`, which is what Chrome computes today for `input`/`textarea`. A field cursor that drifted to anything else (for example a blanket `cursor-pointer` on the form) should fail the AC 2 guard.

---

## Acceptance Criteria

- [ ] On a mouse device, hovering "Send Message" shows a pointer cursor (computed `cursor: pointer`) on `/` and on blog posts.
- [ ] NAME, EMAIL and MESSAGE still compute `cursor: text`. `ax.sh buttons` still exits 0 with Send Message's hover lift and shadow unchanged.
- [ ] The "Accent submit" class string in `Button/README.md` includes `cursor-pointer` and matches `ContactForm.tsx` (minus `mt-4`).
- [ ] `ax.sh cursor` exits 1 on the pre-fix code and 0 after the fix. It is documented in `features/contact.md` and in the `SKILL.md` Drive block and helper table.
- [ ] `npm run lint` and `npm run build` pass.
- [ ] `.agents/issues/todo-issues.md` is untouched and unstaged.
- [ ] Follows existing patterns (`Nav.tsx:117` cursor placement, `ax.sh nav` check style).
