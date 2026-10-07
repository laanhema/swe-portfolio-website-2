# Plan: Bring the Design-System Button Strings Back in Line with the Code

## Summary

AGENTS.md tells agents to copy class strings from `.agents/design-system/laanhema-design-system/components/*/`. Several of those files still carry button strings from before #56 (hover/press recipe) and #86 (pointer cursor), plus a Mobile Menu string that predates the `data-pressed` press fix (#71). Copying them would undo those fixes. This is a docs-only sync: every button class string in the design-system previews and READMEs is replaced by the **exact** string from the code (`ContactForm.tsx:61`, `ProjectCard.tsx:56,67`, `Nav.tsx:117`, `App.tsx:179,188`). Labels and card buttons are corrected to what the code renders (all four projects have a `postSlug`, so every card shows "Code" + "Read Story"). The issue names Send Message, the card pair and the Mobile Menu. The audit for AC 4 also found the same stale recipe on View Work and the social icon buttons in the Hero/Homepage/SocialIconButton previews, so those are fixed too. Three governing-doc lines that still prescribe the old strings (`DESIGN.md:51`, `tokens.json` shadow-brutal-press and spacing-1 usage notes) get one-line updates. Content drift that isn't a button class string (the Twitter links, "Live Demo"/"Download APK" in DESIGN.md's writing examples, the BlogArticle back-link hover, and a pre-#56 CTA inside `src/features/blog/BlogPost.tsx`) goes on a list in the PR rather than being fixed here. No file under `src/` changes. The proof is a scratch check script that counts each canonical code string in the design system and greps for every stale fragment, plus a headless render of the edited previews.

## User Story

As an agent (or Lauri) building new UI from the design system,
I want every button class string in `components/*/README.md` and `preview.html` to match the shipped code,
So that copying them can't bring back the old hover, press and cursor behavior that #56, #71 and #86 fixed.

## Metadata

| Field | Value |
|-------|-------|
| Type | REFACTOR (docs-only sync) |
| Complexity | LOW |
| Systems Affected | Design system only: `components/{Button,ContactSection,FormField,BlogArticle,BlogIndex,Homepage,Hero,SocialIconButton,ProjectCard,NavBar,MobileMenu}/…`, `DESIGN.md`, `tokens.json` |
| GitHub Issue | #91 |
| Related | #56 (hover/press recipe), #86 (Send Message `cursor-pointer`), #71 (Menu `data-pressed`). All merged. Nothing blocks this issue. |
| PRD Phase | N/A |

---

## Environment Findings

| Probe | Result |
|-------|--------|
| Baseline `npm run lint` | Passes (exit 0) at c035d9c |
| Baseline `npm run build` | Passes (`tsc -b && vite build`, built in about 0.4s) at c035d9c |
| Test runner | None. Nothing in the build or lint reads `.agents/`, so they only prove `src/` is untouched. The real check is the scratch script in End-to-End Verification. |
| Preview rendering | The previews are static HTML that link `../../styles/tokens.css` and `../../styles/bundle.css` (a **precompiled** Tailwind v4.3.3 snapshot, a single minified line). They open fine as `file://` in the `/verify` headless browser: `chrome-devtools-axi open file://…/Button/preview.html` worked, with `(hover: hover)` true under ax.sh's Chrome args. |
| Bundle coverage of the new classes | `bundle.css` **has** `.shadow-brutal`, `.brutal-shadow-hover:hover`, `.cursor-pointer`, `.px-3`, `.leading-tight`, `.shrink-0` and `md:hidden`. It **lacks** `transition-[transform,box-shadow]`, `duration-100`, `duration-75`, `touch-manipulation` and the `data-pressed:*` variants, so in the previews those classes are no-ops. The rest look (6px shadow, border, colours, pointer cursor) and the hover lift still render correctly. See Risks and Open Question 1. |
| Baseline preview computed styles (Button preview, HEAD) | Send Message `cursor=default` with `transition: all 0.15s`. Code, Live Demo and Menu use `transition: all 0.15s` (the pre-#56 `transition-all`). All have a 6px shadow at rest. |
| Drift-check dry run | The Task 1 script, run on c035d9c, prints no `EMPTY` lines (all six code line numbers resolve), `FAIL` for every count (SEND/CODE/STORY/MENU/VIEW/SOCIAL=0, READ_STORY_LABEL=2), a stale list covering every inventory row except `tokens.json:245` (which Task 7's grep covers), and exits 1. `README send` is already `ok` (#86). |
| Forward references to `#91` | Only `.agents/issues/todo-issues.md:1591` (the issue's own entry, off-limits) and `TODO.md:36`. There are no placeholders in `src/` or in prior plans. Prior plans `fix-card-and-send-button-hover-press-plan.md:304,311` and `fix-send-message-pointer-cursor-plan.md:241-242` deliberately left this drift as a follow-up, and that follow-up is this issue. |
| Issue-stated line numbers | All re-checked at c035d9c: `ContactSection/preview.html:17`, `Homepage/preview.html:96`, `Button/preview.html:7,9-10,12`, `Button/README.md:6` and `Nav.tsx:117`. The issue comment says `Button/preview.html:12` lacks `cursor-pointer` in the README only, and that holds: the preview already has `cursor-pointer` but lacks `data-pressed:*`, `duration-75` and `touch-manipulation`. |

### Drift inventory (audit for AC 4, HEAD c035d9c)

The canonical strings come from the code. The labels used below are those in the Patterns section.

| Design-system location | Element | Current | Fix |
|---|---|---|---|
| `Button/preview.html:7` | Send Message | pre-#56 recipe (`brutal-shadow hover:-translate-y-1 hover:translate-x-1 transition-all`), `px-8`, no `cursor-pointer` | SEND, in a `w-80` column wrapper |
| `ContactSection/preview.html:17` | Send Message | pre-#56, no cursor | SEND |
| `Homepage/preview.html:96` | Send Message | pre-#56, no cursor | SEND |
| `FormField/preview.html:9` | Send Message | pre-#56, no cursor | SEND (not named in the issue, found by the audit) |
| `BlogArticle/preview.html:46` | Send Message | pre-#56, no cursor | SEND (found by the audit) |
| `Button/preview.html:9-10` | Code / "Live Demo" | pre-#56 recipe with `hover:shadow-[2px…]`; no `px-3 text-center leading-tight`; icon without `shrink-0`; bare label "Live Demo" | CODE + STORY, icon `w-5 h-5 shrink-0`, `<span>Code</span>` / `<span>Read Story</span>` |
| `ProjectCard/preview.html:12-13,22-23` | Code / Read Story ×2 | pre-#56 recipe (layout classes already right) | CODE / STORY |
| `Homepage/preview.html:51-52,61,71-72,81` | the four cards' buttons | pre-#56 recipe, no `px-3 text-center leading-tight`, icons without `shrink-0`; card 1 says "Download APK", card 3 says "Live Demo", and cards 2 and 4 (Tralla, Distill) have **no** second button (blank lines 62 and 82) | CODE + STORY on all four cards (`App.tsx:20,29,38,47`: every project has a `postSlug`) |
| `Button/README.md:6` | Mobile Menu | lacks `data-pressed:*`, `transition-all duration-75 touch-manipulation cursor-pointer` | MENU minus `md:hidden`, plus a short note on `data-pressed` |
| `Button/preview.html:12` | Mobile Menu | lacks `data-pressed:*`, `duration-75`, `touch-manipulation` | MENU minus `md:hidden` |
| `NavBar:9`, `MobileMenu:8`, `Homepage:9`, `BlogIndex:9`, `BlogArticle:9` (`preview.html`) | Mobile Menu | same as above | MENU (with `md:hidden`) |
| `Button/preview.html:6`, `Hero/preview.html:13`, `Homepage/preview.html:19` | View Work | `brutal-shadow brutal-shadow-hover` (pre-#56, no transition or touch classes) | VIEW (found by the audit) |
| `Hero/preview.html:14-16`, `Homepage/preview.html:20-22`, `SocialIconButton/preview.html:6-8` | social icon buttons | `brutal-shadow brutal-shadow-hover`, no `touch-manipulation` | SOCIAL (found by the audit; also applied to the Twitter anchors, see Risks) |
| `DESIGN.md:51` | Menu press rule | names only the `active:` classes | add the `data-pressed:` twins |
| `tokens.json:334` (`shadow-brutal-press`) | usage note | says card Code/Live buttons use `hover:shadow-[2px_2px_0px_0px_#121212]` | say no button uses it since #56 |
| `tokens.json:245` (spacing `1`) | usage note | "card-button hover nudge (`-translate-y-1 translate-x-1`)" | drop that clause |

Already correct (no change): `Button/README.md:3-5,7` (View Work, Accent submit, card pair and Press, updated by #56/#86), `SocialIconButton/README.md:3-4`, `PostCard/README.md:3` and `BlogIndex/preview.html:17` (`brutal-border brutal-shadow brutal-shadow-hover …` equals `PostCard.tsx:50`), and `FormField` inputs.

### Found but not fixed (list in the PR)

| Location | Drift | Why it's not fixed here |
|---|---|---|
| `src/features/blog/BlogPost.tsx:55` | The "Back to All Posts" 404 CTA still uses the pre-#56 recipe **in the code** | The AC forbids `src/` changes. This needs a code follow-up issue. |
| Twitter links in `Hero`, `Homepage`, `SocialIconButton` (preview + README "Provide" line), `Footer`, `BlogIndex`, `BlogArticle` previews and `DESIGN.md` | The code removed Twitter/X (see `remove-twitter-x-buttons-and-social-links-plan.md`) | This is content drift across 8 files, not a class-string mismatch. Only the Twitter anchors' class strings are synced. |
| `DESIGN.md:19` | Writing-rule examples still say "Live Demo" and "Download APK" | It's a copy example, not a class string |
| `BlogArticle/preview.html:13` | The back link uses `hover:underline …`, while `ArticleHeader.tsx:82` uses the text-colour + underline-bar sweep | It's a text link, not a button |
| `styles/bundle.css` | Lacks several utilities the synced strings use | See Open Question 1 |

---

## Patterns to Follow

### Canonical strings (the source of truth is the code; copy byte for byte)

```text
// SEND: src/features/contact/ContactForm.tsx:61
mt-4 bg-[#ff3e00] text-white brutal-border py-4 font-bold uppercase text-xl shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation cursor-pointer

// CODE: src/features/showcase/ProjectCard.tsx:56 (icon: GithubIcon className="w-5 h-5 shrink-0", label <span>Code</span>)
flex-1 bg-white brutal-border py-3 px-3 flex items-center justify-center gap-2 font-bold uppercase text-center leading-tight shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation

// STORY: src/features/showcase/ProjectCard.tsx:67 and :75 (label <span>Read Story</span>)
flex-1 bg-[#121212] text-white border-4 border-[#121212] py-3 px-3 flex items-center justify-center font-bold uppercase text-center leading-tight shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation

// MENU: src/features/navigation/Nav.tsx:117
md:hidden brutal-border px-4 py-2 font-bold uppercase bg-[#ff3e00] text-white brutal-shadow active:translate-x-1 active:translate-y-1 active:shadow-none data-pressed:translate-x-1 data-pressed:translate-y-1 data-pressed:shadow-none transition-all duration-75 touch-manipulation cursor-pointer

// VIEW: src/App.tsx:179
bg-[#121212] text-white px-8 py-4 text-xl font-bold uppercase shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation

// SOCIAL: src/App.tsx:188 and :198
bg-white brutal-border p-4 shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover text-[#121212] flex items-center justify-center touch-manipulation
```

### Context-only class convention (set by #56/#86)

`Button/README.md:4` drops the layout-only `mt-4` from the SEND string (`fix-send-message-pointer-cursor-plan.md:170`). Apply the same rule to the Button **README and Button preview** Mobile Menu, which drop `md:hidden`. The Button preview renders at desktop width, where `md:hidden` would hide the button, and visibility is the NavBar/MobileMenu's concern. Every **page-context** preview (NavBar, MobileMenu, Homepage, BlogIndex, BlogArticle) keeps the full MENU string with `md:hidden`. The **previews** keep SEND's `mt-4` byte for byte, because inside a column wrapper it's harmless and it keeps the counts in the check exact.

### Edit style

The previews mix `'` and `"` quoting per file. Keep each element's existing quote character, its other attributes (`href`, `type`, `aria-*`) and its inner SVG untouched. Replace only the `class` value, plus the labels and icon class named in the inventory. The README bullets keep their bold-label + backtick style.

### Commit pattern (from #86)

`docs(design-system): …` commits, staged by explicit path (`43c52b3 docs(design-system): add cursor-pointer to the accent submit button (#86)`).

---

## Files to Change

All paths are under `.agents/design-system/laanhema-design-system/`.

| File | Action | Purpose |
|------|--------|---------|
| `components/Button/README.md` | UPDATE | Mobile Menu bullet → MENU minus `md:hidden` plus a `data-pressed` note |
| `components/Button/preview.html` | UPDATE | VIEW, SEND (wrapped), CODE/STORY with "Read Story", MENU minus `md:hidden` |
| `components/ContactSection/preview.html` | UPDATE | SEND |
| `components/FormField/preview.html` | UPDATE | SEND |
| `components/BlogArticle/preview.html` | UPDATE | SEND, MENU |
| `components/Homepage/preview.html` | UPDATE | MENU, VIEW, SOCIAL ×3, four card pairs (CODE + STORY), SEND |
| `components/ProjectCard/preview.html` | UPDATE | CODE/STORY ×2 |
| `components/Hero/preview.html` | UPDATE | VIEW, SOCIAL ×3 |
| `components/SocialIconButton/preview.html` | UPDATE | SOCIAL ×3 |
| `components/NavBar/preview.html` | UPDATE | MENU |
| `components/MobileMenu/preview.html` | UPDATE | MENU |
| `components/BlogIndex/preview.html` | UPDATE | MENU |
| `DESIGN.md` | UPDATE | Line 51: Menu press rule gains the `data-pressed:` classes |
| `tokens.json` | UPDATE | Lines 245 and 334: drop the stale card-button hover usage notes |

Not touched: anything under `src/`, `styles/bundle.css` (Open Question 1), `index.html`, the other component folders, and `.agents/issues/todo-issues.md` (an unrelated uncommitted change that must never be staged, reverted or edited).

---

## Tasks

Execute in order. Each task is atomic and verifiable. Run every command from the repo root, with `DS=.agents/design-system/laanhema-design-system`.

### Task 1: Write the scratch drift check (it fails on HEAD)

- **File**: `$SCRATCH/check-ds-buttons.sh`, in the session scratchpad and **not** in the repo
- **Action**: CREATE (scratch)
- **Implement**: the script below. It pulls each canonical string from the code by line number, counts its exact occurrences in the design system, and greps for every stale fragment.
  ```bash
  #!/usr/bin/env bash
  # usage: check-ds-buttons.sh <repo-root>
  set -u; cd "$1"; C=.agents/design-system/laanhema-design-system/components; fail=0
  cls() { sed -n "${2}p" "$1" | grep -o -E "className=['\"][^'\"]*['\"]" | sed -E "s/^className=['\"]//; s/['\"]$//"; }
  SEND=$(cls src/features/contact/ContactForm.tsx 61)
  CODE=$(cls src/features/showcase/ProjectCard.tsx 56)
  STORY=$(cls src/features/showcase/ProjectCard.tsx 67)
  MENU=$(cls src/features/navigation/Nav.tsx 117); MENU_NOMD=${MENU#md:hidden }
  VIEW=$(cls src/App.tsx 179); SOCIAL=$(cls src/App.tsx 188)
  for v in SEND CODE STORY MENU VIEW SOCIAL; do [[ -n ${!v} ]] || { echo "EMPTY $v (line moved?)"; fail=1; }; done
  count() { cat $C/*/preview.html | grep -o -F -- "$1" | wc -l; }
  expect() { local got; got=$(count "$2"); [[ $got == "$3" ]] && echo "ok   $1=$got" || { echo "FAIL $1=$got want $3"; fail=1; }; }
  expect SEND "class=\"$SEND\"" 5          # Button, ContactSection, Homepage, FormField, BlogArticle
  expect CODE "$CODE\"" 7                  # Button 1, ProjectCard 2, Homepage 4
  expect STORY "$STORY\"" 7
  expect MENU "'$MENU'" 5                  # NavBar, MobileMenu, Homepage, BlogIndex, BlogArticle
  expect MENU_NOMD "class='$MENU_NOMD'" 1  # Button preview
  expect VIEW "'$VIEW'" 3                  # Button, Hero, Homepage
  expect SOCIAL "'$SOCIAL'" 9              # Hero 3, Homepage 3, SocialIconButton 3
  expect READ_STORY_LABEL '<span>Read Story</span>' 7
  grep -q -F -- "\`$MENU_NOMD\`" $C/Button/README.md && echo "ok   README menu" || { echo "FAIL README menu"; fail=1; }
  grep -q -F -- "\`${SEND#mt-4 }\`" $C/Button/README.md && echo "ok   README send" || { echo "FAIL README send"; fail=1; }
  stale=$(grep -rn -E "hover:-translate-y-1|hover:shadow-\[2px|>Live Demo<|Download APK|active:shadow-none transition-all cursor-pointer|(uppercase|p-4) brutal-shadow brutal-shadow-hover|class=\"w-5 h-5\"" $C \
          .agents/design-system/laanhema-design-system/DESIGN.md .agents/design-system/laanhema-design-system/tokens.json | grep -v 'DESIGN.md:19:')
  [[ -z $stale ]] && echo "ok   no stale fragments" || { echo "FAIL stale:"; echo "$stale"; fail=1; }
  exit $fail
  ```
  Notes: the quote characters in the `expect` patterns follow each file's current quoting (SEND uses `"` everywhere; MENU, VIEW and SOCIAL use `'`; CODE and STORY use `"`, so the pattern anchors only on the closing quote). If an edit has to change an element's quote style, change the pattern rather than the file's quoting. `DESIGN.md:19` ("Live Demo", "Download APK" as writing examples) is excluded on purpose (see "Found but not fixed").
- **Validate**: `bash $SCRATCH/check-ds-buttons.sh "$PWD"; echo exit=$?` on **unedited** HEAD. Expect several `FAIL` lines (SEND=0, CODE=0, MENU=0, …), a non-empty stale list and `exit=1`. Save the output as `$SCRATCH/ds-check-before.txt`. Also confirm that no `EMPTY` line printed, which proves the code line numbers are right.

### Task 2: Button component (README + preview)

- **File**: `components/Button/README.md`
- **Action**: UPDATE
- **Implement**: Line 6 (**Mobile Menu**) becomes:
  `- **Mobile Menu**: \`brutal-border px-4 py-2 font-bold uppercase bg-[#ff3e00] text-white brutal-shadow active:translate-x-1 active:translate-y-1 active:shadow-none data-pressed:translate-x-1 data-pressed:translate-y-1 data-pressed:shadow-none transition-all duration-75 touch-manipulation cursor-pointer\`, plus \`md:hidden\` in the nav. \`Nav.tsx\` sets \`data-pressed\` from pointer events and holds it for at least 150ms, because mobile browsers skip \`:active\` on a quick tap. Its white 16px label on orange is 3.53:1 (below AA). Prefer \`text-[#121212]\` in new uses.`
  Leave lines 1-5, 7 and 8 alone; they already match the code.
- **File**: `components/Button/preview.html`
- **Action**: UPDATE
- **Implement**:
  - Line 6 (View Work): `class='…'` → VIEW.
  - Line 7 (Send Message): wrap it as `<div class="flex flex-col w-80"><button type="submit" class="SEND">Send Message</button></div>`. The wrapper replaces the old standalone `px-8`, so the button shows full width as it does in the form.
  - Line 9 (Code): class → CODE. The SVG's `class="w-5 h-5"` → `class="w-5 h-5 shrink-0"`. Keep `<span>Code</span>`.
  - Line 10: class → STORY. The label `Live Demo` → `<span>Read Story</span>`.
  - Line 12 (Menu): class → MENU minus the leading `md:hidden `.
- **Mirror**: `components/ProjectCard/preview.html:12-13` (card pair markup), `src/features/showcase/ProjectCard.tsx:52-79`
- **Validate**: `grep -c -E "hover:-translate|Live Demo|w-5 h-5\"" $DS/components/Button/preview.html` prints `0`.

### Task 3: Send Message in the other previews

- **Files**: `components/ContactSection/preview.html:17`, `components/FormField/preview.html:9`, `components/BlogArticle/preview.html:46`, `components/Homepage/preview.html:96`
- **Action**: UPDATE
- **Implement**: In each `<button type="submit" class="…">Send Message</button>`, replace the class value with SEND (including `mt-4`). Change nothing else in these forms. The ContactSection preview's "Epic." heading and old paragraph copy are content drift and out of scope.
- **Validate**: `grep -rc 'brutal-shadow hover:-translate-y-1 hover:translate-x-1 transition-all' $DS/components` shows 0 for all four files.

### Task 4: Card pairs in ProjectCard and Homepage previews

- **File**: `components/ProjectCard/preview.html`
- **Action**: UPDATE
- **Implement**: Lines 12 and 22 get CODE, and lines 13 and 23 get STORY. Labels and icons are already correct.
- **File**: `components/Homepage/preview.html`
- **Action**: UPDATE
- **Implement**:
  - Lines 51, 61, 71 and 81 (Code): class → CODE, SVG class → `w-5 h-5 shrink-0`.
  - Lines 52 and 72: class → STORY, label (`Download APK` / `Live Demo`) → `<span>Read Story</span>`.
  - Lines 62 and 82 (blank, inside Tralla's and Distill's `flex gap-4 mt-auto` rows): insert `    <a href="#" class="STORY"><span>Read Story</span></a>`, so every card matches `App.tsx`, where all four projects have a `postSlug`.
- **Mirror**: `src/features/showcase/ProjectCard.tsx:52-79`, `src/App.tsx:13-48`
- **Validate**: `grep -c '<span>Read Story</span>' $DS/components/Homepage/preview.html` prints `4`.

### Task 5: Mobile Menu in the page-context previews

- **Files**: `components/NavBar/preview.html:9`, `components/MobileMenu/preview.html:8`, `components/Homepage/preview.html:9`, `components/BlogIndex/preview.html:9`, `components/BlogArticle/preview.html:9`
- **Action**: UPDATE
- **Implement**: Replace each `class='md:hidden … transition-all cursor-pointer'` with the full MENU string (keeping `md:hidden`). Keep `aria-label`, `aria-expanded`, `aria-controls` and the Menu/Close label.
- **Validate**: `grep -rl "active:shadow-none transition-all cursor-pointer" $DS/components` prints nothing.

### Task 6: View Work and social icon buttons

- **Files**: `components/Hero/preview.html:13-16`, `components/Homepage/preview.html:19-22`, `components/SocialIconButton/preview.html:6-8`
- **Action**: UPDATE
- **Implement**: View Work anchors → VIEW. The GitHub, Twitter and LinkedIn anchors → SOCIAL. Keep `href`, `aria-label` and the SVGs. The Twitter anchors stay; their removal is listed for the PR.
- **Mirror**: `src/App.tsx:174-205`, `components/SocialIconButton/README.md:3` (already the SOCIAL string)
- **Validate**: `grep -rn -E "(uppercase|p-4) brutal-shadow brutal-shadow-hover" $DS/components` prints nothing.

### Task 7: Governing docs that still prescribe old button strings

- **File**: `DESIGN.md`
- **Action**: UPDATE
- **Implement**: In line 51, change "The mobile menu uses a smaller press: `active:translate-x-1 active:translate-y-1 active:shadow-none`." to "The mobile menu uses a smaller press: `active:translate-x-1 active:translate-y-1 active:shadow-none` plus the same three under `data-pressed:`, which `Nav.tsx` sets from pointer events because mobile browsers skip `:active` on taps." Leave the rest of the line as is.
- **File**: `tokens.json`
- **Action**: UPDATE
- **Implement**:
  - Line 245: `"\`1\` — tag padding-y, card-button hover nudge (\`-translate-y-1 translate-x-1\`)."` → `"\`1\` — tag padding-y."`
  - Line 334 (`shadow-brutal-press`): `"Arbitrary \`hover:shadow-[2px_2px_0px_0px_#121212]\` on the card Code / Live buttons: the shadow shrinks as the button moves toward it."` → `"Not used by any button since #56: every button keeps the 6px shadow on hover (\`brutal-shadow-hover\`) and presses to 0 with \`playPress\`. Kept for reference only."`
  - Keep the JSON valid.
- **Validate**: `python3 -c "import json;json.load(open('$DS/tokens.json'))"` exits 0. `grep -n "hover:shadow-\[2px\|-translate-y-1" $DS/tokens.json $DS/DESIGN.md` prints nothing.

### Task 8: Full validation, e2e proof and commits

- Run the Validation block and the End-to-End Verification below.
- Commit by explicit path, for example:
  - `docs(design-system): sync button previews and README with the code (#91)` (all `components/…` files)
  - `docs(design-system): update menu press rule and stale card-hover token notes (#91)` (`DESIGN.md`, `tokens.json`)
  
  One combined commit is also fine.
- **Never** stage `.agents/issues/todo-issues.md`. Run `git status -s` before each commit.
- The PR body lists the "Found but not fixed" table (AC 4), in particular the `BlogPost.tsx:55` code drift, as a candidate follow-up issue.

---

## Validation

```bash
# Lint
npm run lint

# Type check + production build
npm run build

# Tests: there is no unit-test runner. The design-system check is the scratch script below.
bash "$SCRATCH/check-ds-buttons.sh" "$PWD"

# AC 5: only design-system files changed
git diff --name-only main | grep -v '^\.agents/design-system/laanhema-design-system/' || echo "only design-system files"
git diff --quiet main -- src && echo "src untouched"
```

Start green and stay green. Lint and build pass at c035d9c.

## End-to-End Verification

1. **Fails before, passes after.** `$SCRATCH/ds-check-before.txt` (Task 1, HEAD) shows `FAIL` lines and exit 1. After Tasks 2-7, `bash $SCRATCH/check-ds-buttons.sh "$PWD" | tee $SCRATCH/ds-check-after.txt` prints only `ok` lines (SEND=5, CODE=7, STORY=7, MENU=5, MENU_NOMD=1, VIEW=3, SOCIAL=9, READ_STORY_LABEL=7, README menu/send, no stale fragments) and exits 0.
2. **Previews still render (headless, no app server needed).** Use the `/verify` browser session, which is isolated from the user's Chrome:
   ```bash
   export CHROME_DEVTOOLS_AXI_SESSION=verify CHROME_DEVTOOLS_AXI_CHROME_ARGS=--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4
   P="file://$PWD/.agents/design-system/laanhema-design-system/components"
   chrome-devtools-axi open "$P/Button/preview.html"
   chrome-devtools-axi eval "JSON.stringify([...document.querySelectorAll('a,button')].map(e=>[e.textContent.trim(), getComputedStyle(e).cursor, getComputedStyle(e).boxShadow]))"
   ```
   Expect labels `View Work`, `Send Message`, `Code`, `Read Story`, `Menu`. Every one shows `cursor` `pointer` (Send Message read `default` before) and `rgb(18, 18, 18) 6px 6px 0px 0px`. Then `chrome-devtools-axi screenshot "$SCRATCH/button-preview.png"` and read the PNG: Send Message is full width in its 320px column, and the card pair sits side by side with the white Code (with icon) next to the ink Read Story.
3. **Homepage preview.** `chrome-devtools-axi open "$P/Homepage/preview.html"`, then eval `document.querySelectorAll('a').length` and `[...document.querySelectorAll('a')].filter(a=>a.textContent.trim()==='Read Story').length`. The second is `4`. Take a full-page screenshot to `$SCRATCH/homepage-preview.png` and check that all four project cards show the two-button row with no overflow at 1280px. Repeat the open plus screenshot for `NavBar`, `MobileMenu` and `ContactSection` and look for anything visibly broken. A no-op class from the stale `bundle.css` can't break the layout, but this confirms it.
4. **Code untouched.** The Validation block's `git diff` lines show only design-system paths, and `npm run lint` / `npm run build` exit 0.
5. **Cleanup.** `chrome-devtools-axi stop`. The scratch files stay outside the repo.

---

## Risks

| Risk | Mitigation | Scope |
|------|------------|-------|
| `bundle.css` lacks `transition-[transform,box-shadow]`, `duration-100/75`, `touch-manipulation` and `data-pressed:*`, so those classes are no-ops in the previews. The previews then show an instant (untransitioned) hover lift, and the Menu's `data-pressed` press isn't demonstrable. | The issue is about strings agents copy, which come from the code. The rest look, the hover lift and the cursor all render with the existing bundle (probed). Note it in the PR and leave regeneration to Open Question 1. | Out of scope (flag only) |
| Hand edits drift from the code again by a typo or a dropped class. | The Task 1 script compares byte for byte against strings pulled live from `src/`, with exact expected counts per file set. | In scope |
| Code line numbers in the script go stale if `src/` changes before implementation. | The script prints `EMPTY <name>` and fails when a line has no `className`. Re-locate with `grep -n` and update the line number. | In scope |
| Adding "Read Story" buttons to the Tralla and Distill cards in the Homepage preview changes what the preview shows, beyond a class swap. | It mirrors the code: all four projects in `App.tsx` have a `postSlug`, so the live page shows both buttons on every card. It's covered by AC 4 ("button strings that differ from the code"). | In scope |
| The Twitter anchors keep getting synced classes even though the code removed Twitter. | List the Twitter drift (8 files) in the PR as a follow-up. Removing it here would widen a class-string sync into a content change. | Out of scope (flag only) |
| `BlogPost.tsx:55`'s 404 CTA still uses the pre-#56 recipe in the code itself. | `src/` changes are forbidden by AC 5. List it in the PR as a follow-up code issue. | Out of scope (flag only) |
| The unrelated dirty `.agents/issues/todo-issues.md` gets swept into a commit. | Stage explicit paths only and check `git status -s` before each commit. | In scope |

---

## Open Questions

1. **Regenerate `styles/bundle.css`?** Default: **no**. Nothing in the repo builds it (no `@tailwindcss/cli` in `package.json`, and `README.md` calls it the "Compiled Tailwind CSS used by the previews"). Regenerating would need a new tool or a one-off `npx` download. The string sync is what protects the code. If the owner wants the previews to show the exact transitions and `data-pressed` press, a follow-up can rebuild the bundle with Tailwind 4.3.x over `components/**/*.html`.
2. **Remove the Twitter buttons and links from the design system now?** Default: no. List them in the PR (see "Found but not fixed"). Proposed follow-up: one issue that removes Twitter from the previews, `SocialIconButton/README.md:5` and `DESIGN.md`.
3. **`md:hidden` in the Button README/preview Mobile Menu string?** Default: omit it, with a "plus `md:hidden` in the nav" note, following the #86 convention that dropped the layout-only `mt-4` from the Accent submit string. If the owner prefers the README string to be byte-identical to `Nav.tsx:117`, prepend `md:hidden ` and drop the note. The check script's `README menu` line then needs `$MENU` instead of `$MENU_NOMD`.

---

## Acceptance Criteria

- [ ] Send Message in `ContactSection`, `Homepage` and `Button` previews (and also `FormField` and `BlogArticle`) uses the exact `ContactForm.tsx:61` classes, including the #56 recipe and `cursor-pointer`.
- [ ] The Button preview's card pair matches `ProjectCard.tsx` (CODE/STORY strings, `shrink-0` icon, "Read Story" label). The ProjectCard and Homepage previews match too.
- [ ] The Mobile Menu string in `Button/README.md` and `Button/preview.html` matches `Nav.tsx:117` (minus `md:hidden`, per the convention), including `data-pressed:*` and `touch-manipulation cursor-pointer`. The page-context previews carry the full string.
- [ ] Every other `components/*/preview.html` and `README.md` was audited. View Work and the social buttons are fixed, and the non-class drift is listed in the PR.
- [ ] `check-ds-buttons.sh` exits 1 on c035d9c and 0 after the change.
- [ ] Only design-system files change. `src/` is untouched, and `npm run lint` and `npm run build` pass.
- [ ] `.agents/issues/todo-issues.md` is untouched and unstaged.
