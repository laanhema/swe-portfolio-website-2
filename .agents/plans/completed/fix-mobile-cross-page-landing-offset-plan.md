# Plan: Fix Mobile Cross-Page Section Landings Settling Below the Section Top

## Summary

A cross-page landing from `/blog` or `/blog/:slug` to `/#work`, `/#about` or `/#contact` must end with the section's top edge at the bottom of the sticky nav, and it must stay there. Two separate defects stop this. The first is deterministic and was measured during planning: `HomePage` calls `scrollIntoView()` with no nav offset, so every landing puts the section top at viewport `y = 0`. That is 84px under the nav on mobile (72px at `md`+), which fails the issue's "within 2px of the nav bottom" criterion on every run. The second is the intermittent defect the issue reports: a layout shift above the target after the scroll has been set. Chrome's scroll anchoring corrects that shift only when it happens in the first frame after the scroll. A shift 30ms or more later is not corrected (measured below). The fix has three parts: (1) add `scroll-padding-top` equal to the nav height on `html`; (2) after an initial hash landing, briefly hold the anchor, re-scrolling it instantly whenever the page's layout resizes, and stop at the first user input or after a short window; (3) make that landing logic correct under React StrictMode. The hold does not depend on the cause, so it covers a font swap, a re-wrap and any other late shift. Task 1 is still an explicit investigation gate, because the issue requires the re-wrap's root cause in the PR description and the re-wrap did not reproduce during planning.

## User Story

As a visitor reading a blog post on my phone,
I want to tap Work, About or Contact in the menu and land exactly at the top of that section,
So that the page doesn't open part-way into the section and I don't have to scroll back up to find its heading.

## Metadata

| Field | Value |
|-------|-------|
| Type | BUG_FIX |
| Complexity | MEDIUM |
| Systems Affected | `src/App.tsx` (`HomePage` landing effect), `src/styles/global.css` (base `html` rules), `.claude/skills/verify/features/section-navigation.md` (stale gotchas) |
| GitHub Issue | #63 (supersedes the remaining part of #58; shares the "within 2px of the nav bottom" target with #64) |

---

## Environment Findings (probed during planning, 2026-10-06)

| Probe | Result |
|-------|--------|
| Browser used by `/verify` | `HeadlessChrome/154.0.0.0` (Linux), `ax.sh mobile` = `375x812x2,mobile,touch` |
| Baseline `npm run lint` | clean (0 problems) |
| Baseline `npm run build` | passes (`tsc -b && vite build`, JS 400.24 kB / CSS 33.95 kB) |
| Test runner | none configured (`package.json` scripts: `dev`, `build`, `lint`, `preview`). Proof is browser-only through `/verify`. |
| Sticky nav height (`nav.getBoundingClientRect().height`) | **84px** at 320px, 375px and 767px; **72px** at 768px and 1280px |
| Existing nav offset for anchors | none: `grep -rn "scroll-m\|scroll-margin\|scroll-padding" src` finds no matches |
| `@fontsource-variable/noto-sans` `font-display` | `swap` on all 16 `@font-face` rules (`node_modules/@fontsource-variable/noto-sans/index.css`) |
| Font imported | `src/main.tsx:3` (`import '@fontsource-variable/noto-sans'`); `body` font stack `'Noto Sans Variable', system-ui, sans-serif` (`src/styles/global.css:29`) |
| `src/index.css` | not imported anywhere (dead file); ignore its `system-ui` stacks |
| Investigation harness | `.temp/verify/runs/issue63-investigation/` (gitignored): `instr.js`, `run.sh`, `parse.py` plus raw result logs. `instr.js` is reproduced in the Appendix in case the directory is gone. |

### Root-cause evidence gathered during planning

All runs used the real user path (`ax.sh mobile`, open `/blog` or `/blog/tralla`, tap `MENU`, then tap `WORK`, `ABOUT` or `CONTACT`). `instr.js` is installed on the blog page before the tap and records the paragraph height, font state, section top, nav bottom and `scrollY` at mount, on every `ResizeObserver` callback, on 12 rAFs, and at +1.5s.

| # | Experiment | Runs | Result |
|---|-----------|------|--------|
| E1 | Dev server, 5 × {`/blog`, `/blog/tralla`} × {work, about, contact} | 30 | Hero paragraph **308px in every frame, no re-wrap**. `document.fonts.status === 'loaded'`, the latin face (`U+0-FF…`) is already loaded at tap time, `check('500 20px "Noto Sans Variable"')` is true at mount, and no `loadingdone` fires during the landing. `secTop = 0`, `navB = 84`, so the landing is **84px under the nav in every run**. |
| E2 | Same, clicking right after the page opens (`SETTLE=0`) | 6 | Same as E1 |
| E3 | Production preview build (`start preview`), `SETTLE=0.3` | 30 | Same as E1 |
| E4 | Desktop → open `/blog` → switch to mobile → tap | 3 | The latin face was **not** loaded when the blog page opened. It loaded 673–683ms later, which was still before `HomePage` mounted, because `ax.sh click` snapshots first. Paragraph stayed at 308px. |
| E5 | `emulate --network "Slow 3G" --cpu 4`, cold `/blog/tralla` | 3 | Font status `loading` on the cold run; `loadingdone` came 921ms after open, still before the mount. No re-wrap. The `ax.sh` tap is too slow to land inside the cold-font window. |
| E6 | Paragraph height at 375px by forced `font-family` | — | `Noto Sans Variable` = 308px, `system-ui` = 308px (on this Fedora host `system-ui` resolves to Noto Sans), `sans-serif` = 252px, `serif` = 252px. **No stack gives the reported 280px.** The reporter's environment had different text metrics. |
| E7 | DPR 1, 2, 3 and non-mobile 375px | — | 308px each time; DPR is not a factor |
| E8 | Simulated re-wrap (`p.style.fontSize = '18px'`, 308 → 227px) at varying delays after mount | 18 | Shift in the **first rAF**: corrected by scroll anchoring (`secTop` stays 0). Shift at **30, 100, 250, 500 or 1200ms**: **not corrected**, and the section ends 81–82px up (`secTop - navB` = −165/−166 against −84 at baseline). |
| E9 | Same as E8 on `/` directly, at +500ms and +1500ms | 2 | Not corrected either. Computed `overflow-anchor` is `auto` on `html` and `body`. |
| E10 | E9 with every `.animate-on-scroll` forced to `transform: none !important` | 1 | Still not corrected, so GSAP transform tweens are **not** what suppresses scroll anchoring. GSAP's `ScrollTrigger.js` has no `overflow-anchor` handling. |

**Conclusions recorded for the PR:**

1. The issue's acceptance target fails deterministically, independent of the re-wrap. With no `scroll-padding-top` / `scroll-margin-top`, the section top lands under the 84px nav.
2. The intermittent symptom (28–61px) is a late layout shift above the target that scroll anchoring does not correct (E8, E9). Whether the user sees it depends on when the shift happens: first frame means corrected, any later frame means not corrected. This fits "varies between runs and between Chrome builds".
3. The font-swap hypothesis is **unconfirmed and unlikely on the warm path**. On a cross-page landing the blog page has already loaded the same latin font file (E1–E3). A swap is possible only when the tap happens within about 1s of the first blog page load on a cold cache (E4, E5), and on this host it would not change the wrap anyway (E6). The reporter's 280px matches no font stack here, so their re-wrap trigger is specific to their environment. Task 1 decides how to word this.

---

## Patterns to Follow

### Initial-landing scroll in a layout effect (the code being changed)
```tsx
// SOURCE: src/App.tsx:64-88
const hasMounted = useRef(false);

// Layout effect so the first scroll lands before paint and the hero never flashes.
useLayoutEffect(() => {
  const behavior: ScrollBehavior = hasMounted.current ? 'smooth' : 'instant';
  hasMounted.current = true;

  if (isPageReload) { /* ...reset to top, return... */ }

  if (location.hash) {
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior });
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }
}, [location.pathname, location.hash]);
```

### Effect cleanup pattern
```ts
// SOURCE: src/hooks/useGsapAnimations.ts:8-37
useLayoutEffect(() => {
  // ...set up observers/tweens...
  return () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
}, []);
```

### Base-layer `html` rules (where the nav offset goes)
```css
/* SOURCE: src/styles/global.css:15-25 */
@layer base {
  html {
    scroll-behavior: smooth;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
```

### Naming
- Module constants: `UPPER_SNAKE_CASE` (`PROJECTS`, `src/App.tsx:12`). Module-level mutable flag with a one-line comment: `isPageReload` (`src/App.tsx:51-58`).
- Errors: none thrown on this path. DOM lookups use optional chaining (`getElementById(...)?.scrollIntoView`, `src/App.tsx:85`). Keep that style and don't add guards for impossible states.

### Tests
- There is no test framework. Behavior is proven with `/verify` (see `.claude/skills/verify/SKILL.md` and `features/section-navigation.md`) together with the measurement harness in the Appendix.

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/styles/global.css` | UPDATE | `html { scroll-padding-top: 84px }`, and `72px` at `min-width: 768px`, so every `scrollIntoView` lands the section top at the nav bottom |
| `src/App.tsx` | UPDATE | StrictMode-safe initial-landing detection; a short-lived anchor hold that re-scrolls the target on layout resize after an initial hash landing |
| `.claude/skills/verify/features/section-navigation.md` | UPDATE | Replace the two now-wrong gotchas (`top` equal to 0 under the nav; the 28–61px re-wrap) with the new landing assertion |

No files are created. `.agents/stories/todo-stories.md` has an unrelated uncommitted change. **Do not touch, stage or revert it.**

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Investigation gate. Pin the re-wrap cause before choosing the fix variant

- **File**: none (read-only). Evidence goes in `$RUN_DIR` and later in the PR description.
- **Action**: INVESTIGATE
- **Implement**:
  1. Start the verify server (`$S start`, then `$S doctor`), run `$A open /blog` and `$A mobile`. If `.temp/verify/runs/issue63-investigation/` is missing, recreate `instr.js` from the Appendix.
  2. Re-run the baseline: `for f in /blog /blog/tralla; do for t in work about contact; do .temp/verify/runs/issue63-investigation/run.sh $f $t; done; done`. Expected on unchanged code: `landing=FAIL (secTop-navB=-84px)` with no `changes=[…]` entries. This confirms the deterministic part again.
  3. Try to catch the real re-wrap. Run a cold first load with `CHROME_DEVTOOLS_AXI_SESSION=verify chrome-devtools-axi emulate --viewport "375x812x2,mobile,touch" --network "Slow 3G" --cpu 4` and a cache-busting query (`$A open "/blog?c=$RANDOM"`), then `SETTLE=0`. For each run where `changes=[…]` is non-empty, read the `ro` / `rafN` rows around the change.
- **Decision criteria** (record which row applies in `$RUN_DIR/cause.txt`):

  | Observation at the frame where `pH` changes | Cause | Fix variant |
  |---|---|---|
  | `check` flips `false → true`, or a `fonts-loadingdone` event lands between `mo-first` and the change | Web-font swap (`font-display: swap`) on a cold cache | Tasks 2–4 as written. Do **not** add a `<link rel=preload>` (Vite hashes the woff2 name; that is a separate perf change). Cite E4/E5 and the run. |
  | `check` is true throughout and `cw` / `pW` changes | Container width change (scrollbar or viewport) | Tasks 2–4 as written. Name the width source in the PR. |
  | Neither font nor width changes, but `pH` changes | Another late reflow (for example text autosizing or a Chrome build difference) | Tasks 2–4 as written. Describe it as "late reflow above the target, trigger X". |
  | **No re-wrap in at least 30 runs (expected, matches planning)** | Not reproducible on Chrome 154 | Tasks 2–4 as written. In the PR, state the confirmed mechanism (scroll anchoring corrects only first-frame shifts: E8–E10), the confirmed deterministic offset (E1–E3), and that the font-swap trigger is ruled out on the warm path and possible only in a cold-cache window (E4–E6), with the harness runs as evidence. See Open Question 1. |

  Every row leads to the same code change because the anchor hold does not depend on the cause. The gate decides what the PR description says and whether a follow-up is needed. Stop and raise it with the owner only if the data shows the shift happens **below** the target, which the hold would not cover.
- **Validate**: `$RUN_DIR/cause.txt` names one row and lists the run lines that support it.

### Task 2: Offset anchor scrolls by the sticky nav height

- **File**: `src/styles/global.css`
- **Action**: UPDATE
- **Implement**: In the existing `@layer base { html { … } }` block (lines 16-18), add `scroll-padding-top: 84px;` with a short comment (`/* = sticky nav height (Nav.tsx); keep in sync */`). Add `@media (min-width: 768px) { html { scroll-padding-top: 72px; } }` next to the existing reduced-motion media block. `scroll-padding` on the root element applies to the viewport scroller, so `scrollIntoView` in `App.tsx:85`, `App.tsx:95` (`VIEW WORK`) and `Nav.tsx:24` all pick it up without JS changes. `window.scrollTo({ top: 0 })` is unaffected.
- **Why CSS, not per-section `scroll-mt-*`**: one rule covers all three sections (`#about` and `#work` in `App.tsx`, `#contact` in `ContactForm.tsx:6`) and every caller, and it is the same offset that #64 needs.
- **Mirror**: `src/styles/global.css:15-25`
- **Validate**: `npm run build`. Then re-run the Task 1 harness for one target: expect `secTop-navB=0px`.

### Task 3: Make initial-landing detection StrictMode-safe

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**: Replace `hasMounted = useRef(false)` with `landedKey = useRef<string | null>(null)`. Inside the effect: `const isInitialLanding = landedKey.current === null || landedKey.current === location.key; landedKey.current = location.key; const behavior: ScrollBehavior = isInitialLanding ? 'instant' : 'smooth';`.
- **Why**: in dev, `<StrictMode>` (`src/main.tsx:8`) runs mount → cleanup → mount on layout effects. With the current boolean, the second run already sees `hasMounted.current === true`, takes the `'smooth'` path, and would not reinstall the Task 4 hold that the first cleanup removed. Keying on `location.key` treats the StrictMode re-run of the same navigation as the initial landing, while a later back/forward navigation (new key) still smooth-scrolls. Production behavior is unchanged.
- **Mirror**: `src/App.tsx:64-70`
- **Validate**: `npm run lint && npm run build`

### Task 4: Hold the anchor while the landing settles

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Add a `ref` to the page root `<div className='min-h-screen'>` (`App.tsx:103`). Any reflow above the target changes this element's height.
  - Add a module-level constant `ANCHOR_HOLD_MS = 2000` with a one-line comment: Chrome's scroll anchoring only corrects shifts in the first frame, so late reflows (for example a font swap) would push the target away (#63).
  - Add a small module-level helper next to `isPageReload`, for example `holdAnchor(target: HTMLElement, root: HTMLElement): () => void`. It creates a `ResizeObserver` on `root` whose callback runs `target.scrollIntoView({ behavior: 'instant' })`. It stops (disconnects, clears the timeout, removes listeners) after `ANCHOR_HOLD_MS` or on the first `wheel`, `touchstart`, `keydown` or `pointerdown` on `window` (passive listeners), and returns that stop function.
  - In the effect, on the `location.hash` branch, when `isInitialLanding` is true and the target exists, call `scrollIntoView({ behavior })` as today, then `return holdAnchor(target, rootRef.current)`. Do not install the hold on the `'smooth'` path, on the reload path or on the no-hash path.
- **Why this works**: `ResizeObserver` callbacks run after layout and before paint in the same frame. The re-anchor therefore runs before the shifted frame is painted, and the user sees no jump. The observer's first callback on `observe()` re-scrolls to the same spot, which is idempotent. The hold ends at the user's first input, so it never fights a manual scroll.
- **Keep**: the `isPageReload` branch and the `useLayoutEffect` timing unchanged. Those are the #58 hero-flash fix.
- **Mirror**: cleanup style of `src/hooks/useGsapAnimations.ts:34-37`. Use optional chaining as in `src/App.tsx:85`.
- **Validate**: `npm run lint && npm run build`

### Task 5: Update the verify recipe's stale gotchas

- **File**: `.claude/skills/verify/features/section-navigation.md`
- **Action**: UPDATE
- **Implement**: Replace the gotcha at line 38 ("`#work` lands with `getBoundingClientRect().top` equal to 0 …") with: section links land with the section top at the nav bottom (`section.getBoundingClientRect().top` equals `nav.getBoundingClientRect().bottom`, 84px on mobile and 72px at `md`+), measured with `chrome-devtools-axi eval` (read-only). Delete the line 41 gotcha (the 28–61px re-wrap) and replace it with one line saying that late reflows above the target are re-anchored for up to 2s after a cross-page landing (#63).
- **Validate**: re-read the file and check that every statement matches the measured behavior from the End-to-End section.

### Task 6: Full validation and PR evidence

- **Action**: VALIDATE
- **Implement**: run the Validation and End-to-End sections. Put the Task 1 cause write-up, the E1–E10 table (or a link to it) and the before/after harness RESULT lines in the PR description.
- **Validate**: all commands below pass. All 30 E2E runs print `landing=PASS` and `heroHiddenAtMount=PASS`.

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint

# Tests
# none configured — browser proof via /verify (below)
```

## End-to-End Verification

Use the `/verify` skill (`S=.claude/skills/verify/scripts/verify-server.sh`, `A=.claude/skills/verify/scripts/ax.sh`, `H=.temp/verify/runs/issue63-investigation`).

1. `$S start` then `$S doctor` (must print `HEALTHY` and show the uncommitted `src/` changes).
2. `$A open /blog` and `$A mobile` (375×812).
3. **Acceptance runs (AC 2 and 3)**: `for i in 1 2 3 4 5; do for f in /blog /blog/tralla; do for t in work about contact; do $H/run.sh $f $t; done; done; done | tee $RUN_DIR/landing-mobile.txt`. Expected: 30/30 `landing=PASS (secTop-navB=0px)` (tolerance ±2px) and `heroHiddenAtMount=PASS`.
4. **Guard proof (the intermittent case)**: `for d in 0 30 250 1200; do for t in work about contact; do SIM=true SIMDELAY=$d $H/run.sh /blog $t; done; done | tee $RUN_DIR/landing-simulated-shift.txt`. This applies the 308 → 227px re-wrap the planning baseline could not survive (E8). Expected: every line `landing=PASS`. Before the fix, delays of 30ms or more ended at −165px.
5. **Hero-flash regression (AC 4)**: `$A open /blog`, tap `MENU` then `ABOUT` (`#about` sits directly under the hero, so it is the worst case), and immediately `$A shot $RUN_DIR/cross-page-about-mobile.png`. Read the PNG: the nav, then the black About section, with no hero text or portrait. Repeat for `WORK`.
6. **Desktop**: `$A desktop`, `$A open /blog`, `$A click 'link "Work" url=.*/#work'`, `sleep 1.5`, then `chrome-devtools-axi eval "Math.round(document.getElementById('work').getBoundingClientRect().top - document.querySelector('nav').getBoundingClientRect().bottom)"` (with the session env set). Expected `0`. Repeat on `/` with the in-page `About` link and `VIEW WORK`: expect `0` after `sleep 1.2`, and the smooth scroll still animates.
7. **Reload reset unchanged**: open `/#work` → `chrome-devtools-axi eval "location.reload()"` → `$A state` shows `"hash": ""` and `"scrollY": 0`.
8. **Hold releases on input**: after a cross-page landing, `chrome-devtools-axi scroll down` within 2s, then `$A state`. `scrollY` must keep the user's scroll and not snap back.
9. Cleanup: `$A stop`, then `$S stop`.

---

## Risks

| Risk | Mitigation | Scope |
|------|------------|-------|
| Hard-coded 84px / 72px drifts if the nav markup changes (padding, logo size, button). | The CSS comment points to `Nav.tsx`. E2E step 3 and step 6 measure the offset at both breakpoints. A JS-measured `--nav-h` variable would add a ResizeObserver to `Nav` for no current gain. | In scope (comment + measurement) |
| The anchor hold fights a user who scrolls during the first 2s. | It stops on `wheel`, `touchstart`, `keydown` and `pointerdown`. E2E step 8 proves this. | In scope |
| StrictMode double-invoke drops the hold in dev (cleanup runs, and the second run takes the smooth path). | Task 3 keys "initial landing" on `location.key`. | In scope |
| `scroll-padding-top` changes in-page desktop landings too (`VIEW WORK`, desktop nav). | This is the intended effect: they now stop under the nav instead of behind it. Checked in E2E step 6. | In scope |
| Mobile drawer links on `/` still overshoot, because the drawer collapses after the scroll target is computed. | This is #64 (TODO-34) and is separate. Task 2's padding is a prerequisite #64 can reuse. Don't change `Nav.tsx` here. | **Out of scope**, flag only |
| A reflow **below** the target (for example an image decoding) also fires the observer. | Re-scrolling to the same target is idempotent, so there is no visible effect. | In scope (no action) |
| The real re-wrap trigger stays unreproduced, so the PR "cause" is the mechanism and not the exact trigger. | Task 1's decision table plus E8–E10 evidence. Raised as Open Question 1. | Flag |
| Font-swap race on a cold cache (FOUT on any route). | The hold covers the scroll side effect. A `<link rel=preload>` or `font-display` change is a separate performance and branding decision. | **Out of scope**, flag only |

---

## Open Questions

1. **What counts as "cause identified" if the re-wrap does not reproduce?** In 69 instrumented runs on Chrome 154 the paragraph never re-wrapped, and no font stack produces the reported 280px. *Proposed default:* the PR documents (a) the deterministic 84px nav offset, (b) the confirmed mechanism, which is that Chrome's scroll anchoring corrects only first-frame shifts (E8–E10), and (c) that the font-swap trigger is ruled out on the warm cross-page path and possible only in a cold-cache window under 1s. The owner then accepts that as meeting AC 1, or re-runs Task 1 on the Chrome build where they saw it.
2. **Hold window length.** *Proposed default:* `ANCHOR_HOLD_MS = 2000`. A cold font loaded in 921ms under Slow 3G (E5), and the input listeners end the hold early anyway. Raise it if the owner wants to cover slower networks.
3. **Offset target.** The issue says the "section's top edge within 2px of the bottom of the sticky nav". This plan reads it as the section's outer top edge, including `#about`'s `border-y-4` and `#contact`'s `border-t-4`, so the border sits flush under the nav's own 4px bottom border. *Proposed default:* keep it. Use a few px less padding only if the owner wants the borders to overlap.

---

## Acceptance Criteria

- [ ] All tasks completed
- [ ] `npm run lint` passes
- [ ] `npm run build` passes (type check included)
- [ ] 30/30 mobile cross-page runs land within 2px of the nav bottom (`/blog` and `/blog/tralla` × `#work`, `#about`, `#contact` × 5)
- [ ] Simulated late re-wrap at 0, 30, 250 and 1200ms still lands within 2px
- [ ] No hero frame is visible on a cross-page landing (#58 does not regress)
- [ ] Re-wrap cause (or the documented mechanism, per Open Question 1) is in the PR description
- [ ] Follows existing patterns (layout-effect landing, effect cleanup, base-layer CSS)
- [ ] `.agents/stories/todo-stories.md` untouched by this change

---

## Appendix: `instr.js` (measurement harness, read-only)

Installed with `chrome-devtools-axi eval "(window.__target='<id>', window.__simulateShift=<bool>, window.__simDelay=<ms>, <this file>)"` on the blog page **before** tapping the link. Read it back with `chrome-devtools-axi eval "JSON.stringify(window.__L)"`. `run.sh` and `parse.py` in the same directory wrap this and print one summary plus one `RESULT … landing=PASS|FAIL … heroHiddenAtMount=PASS|FAIL` line per run. `landing` means `|secTop − navB| ≤ 2` at +1.5s. `heroHiddenAtMount` means `header.bottom ≤ nav.bottom` at first mount.

```js
(() => {
  const L = window.__L = [];
  const t0 = performance.now();
  const faces = () => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.unicodeRange.slice(0, 12)).join('|');
  L.push({ ev: 'install', fonts: document.fonts.status, loaded: faces(), cw: document.documentElement.clientWidth, iw: innerWidth });
  document.fonts.addEventListener('loadingdone', e => L.push({ ev: 'fonts-loadingdone', t: Math.round(performance.now() - t0), faces: e.fontfaces.map(f => f.unicodeRange.slice(0, 12)).join('|') }));
  const snap = (ev) => {
    const p = [...document.querySelectorAll('header p')].find(e => e.textContent.trim().startsWith('Full-stack'));
    const sec = document.getElementById(window.__target || 'work');
    const nav = document.querySelector('nav');
    return { ev, t: Math.round(performance.now() - t0), pH: p && p.getBoundingClientRect().height, pW: p && Math.round(p.getBoundingClientRect().width), ff: p && getComputedStyle(p).fontFamily.slice(0, 20), check: document.fonts.check('500 20px "Noto Sans Variable"', 'Full-stack'), fonts: document.fonts.status, cw: document.documentElement.clientWidth, secTop: sec && Math.round(sec.getBoundingClientRect().top), navB: nav && Math.round(nav.getBoundingClientRect().bottom), sY: Math.round(scrollY), heroBottom: Math.round(document.querySelector('header').getBoundingClientRect().bottom) };
  };
  let seen = false;
  const mo = new MutationObserver(() => {
    const p = [...document.querySelectorAll('header p')].find(e => e.textContent.trim().startsWith('Full-stack'));
    if (!p || seen) return;
    seen = true; mo.disconnect();
    L.push(snap('mo-first'));
    // Optional: simulate the reported one-frame re-wrap to prove the re-anchor hold works.
    if (window.__simulateShift) { const go = () => { p.style.fontSize = '18px'; L.push(snap('simulated-shift')); }; window.__simDelay ? setTimeout(go, window.__simDelay) : requestAnimationFrame(go); }
    new ResizeObserver(() => L.push(snap('ro'))).observe(p);
    let n = 0; const f = () => { L.push(snap('raf' + n)); if (++n < 12) requestAnimationFrame(f); }; requestAnimationFrame(f);
    setTimeout(() => L.push(snap('t+1500')), 1500);
  });
  mo.observe(document.body, { childList: true, subtree: true });
  return 'installed';
})()
```
