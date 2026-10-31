# Plan: Keep Mobile Menu aria-controls Target in DOM

## Summary

The mobile navigation menu button in `src/features/navigation/Nav.tsx` always sets `aria-controls="mobile-menu"`, but `#mobile-menu` was conditionally rendered with `{isOpen && (<div id="mobile-menu" ...>)}`. When the drawer was closed (`isOpen === false`), `#mobile-menu` was absent from the DOM, resulting in a broken ARIA reference for screen readers and accessibility tooling. We will update `Nav.tsx` to always render `<div id="mobile-menu">` in the DOM, applying HTML's `hidden={!isOpen}` attribute. Because Tailwind CSS v4's preflight enforces `[hidden]:where(:not([hidden='until-found'])) { display: none !important; }`, the drawer element is collapsed and excluded from the accessibility tree and keyboard tab sequence when closed, while maintaining `#mobile-menu` in the DOM so `aria-controls="mobile-menu"` always resolves. In addition, existing `flushSync` handling in `closeMenu()` ensures the drawer collapses synchronously before scroll target measurement, preserving the fix for #64.

## User Story

As a screen reader user on a mobile viewport,
I want the mobile menu button's `aria-controls` attribute to always reference an existing element in the DOM,
So that my assistive technology does not encounter a broken reference when navigating the header.

## Metadata

| Field | Value |
|-------|-------|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | `src/features/navigation/Nav.tsx`, `.claude/skills/verify/features/mobile-menu.md` |
| GitHub Issue | #112 |
| PRD Phase | N/A |
| Prototype Patch | N/A |

---

## Environment Findings

| Probe | Command / Check | Result |
|-------|-----------------|--------|
| Baseline full check | `npm run check` | PASS (lint, check:design, check:agents, build all green) |
| Bug reproduction on HEAD | Verify `#mobile-menu` resolution while closed | RED (`Error: Missing target: null` — `button[aria-controls=mobile-menu]` present, `#mobile-menu` absent from DOM) |
| Post-fix expected state | Verify `#mobile-menu` resolution while closed | GREEN (`button[aria-controls=mobile-menu]` present, `#mobile-menu` present, `target.hidden === true`) |

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/features/navigation/Nav.tsx` | UPDATE | Always render `#mobile-menu` in the DOM with `hidden={!isOpen}` instead of conditional rendering. |
| `.claude/skills/verify/features/mobile-menu.md` | UPDATE | Document that `#mobile-menu` remains in the DOM with `hidden` when closed. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Always render mobile menu drawer with hidden attribute when closed

- **File**: `src/features/navigation/Nav.tsx`
- **Action**: UPDATE
- **Implement**:
  1. In `src/features/navigation/Nav.tsx:112-138`, replace the conditional `{isOpen && (<div id='mobile-menu' ...>...</div>)}` with unconditional rendering of `<div id='mobile-menu' hidden={!isOpen} className='md:hidden border-t-4 border-[#121212] bg-[#f8f9fa] px-6 py-6 flex flex-col gap-4 text-xl font-bold uppercase tracking-wide'>...</div>`.
  2. Keep all inner links, keys, styling classes, and `handleSectionClick` / `closeMenu` logic intact.
  3. Ensure no type assertions (`as Type`) are used and strict type checks pass.
- **Mirror**: `src/features/navigation/Nav.tsx:60-140`
- **Validate**: `npm run check`

### Task 2: Update mobile menu verification documentation

- **File**: `.claude/skills/verify/features/mobile-menu.md`
- **Action**: UPDATE
- **Implement**:
  1. In `.claude/skills/verify/features/mobile-menu.md`, update the `menu-toggle` sub-feature and close description to document that `#mobile-menu` stays in the DOM with the `hidden` attribute when closed, keeping `aria-controls` resolvable while removing links from the accessibility tree.
- **Mirror**: `.claude/skills/verify/features/mobile-menu.md:5-10`
- **Validate**: `npm run check`

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint

# Design & agent docs checks
npm run check:design && npm run check:agents

# Full gate check
npm run check

# Reproduction command (proves aria-controls target exists in DOM while closed):
# Red before Task 1 (fails with "Missing target: null"), Green after Task 1
.claude/skills/verify/scripts/verify-server.sh start && (CHROME_DEVTOOLS_AXI_SESSION=verify chrome-devtools-axi open http://127.0.0.1:5199/ >/dev/null && CHROME_DEVTOOLS_AXI_SESSION=verify chrome-devtools-axi eval "(() => { const btn = document.querySelector('button[aria-controls=mobile-menu]'); const target = document.getElementById(btn.getAttribute('aria-controls')); if (!btn || !target) throw new Error('Missing target: ' + target); return true; })()"; code=$?; .claude/skills/verify/scripts/verify-server.sh stop >/dev/null; exit $code)
```

## End-to-End Verification

1. Start test server: `.claude/skills/verify/scripts/verify-server.sh start`
2. Configure mobile emulation:
   - `CHROME_DEVTOOLS_AXI_SESSION=verify chrome-devtools-axi open http://127.0.0.1:5199/`
   - `.claude/skills/verify/scripts/ax.sh mobile`
   - `.claude/skills/verify/scripts/ax.sh open /`
3. Verify closed drawer state:
   - Check `button[aria-controls=mobile-menu]` has `aria-expanded="false"`.
   - Check `#mobile-menu` is present in DOM and `target.hidden === true`.
   - Run `.claude/skills/verify/scripts/ax.sh has 'link "WORK"'`: must exit with code 1 (fails because links are excluded from accessibility tree).
4. Verify drawer open state:
   - Run `.claude/skills/verify/scripts/ax.sh click 'button "Open menu"'`
   - Run `.claude/skills/verify/scripts/ax.sh state`: verify `"menuExpanded": "true"`.
   - Run `.claude/skills/verify/scripts/ax.sh has 'link "WORK"'`: must succeed (exit 0).
   - Check `#mobile-menu` in DOM has `hidden === false`.
5. Verify section navigation and #64 drawer collapse:
   - Run `.claude/skills/verify/scripts/ax.sh click 'link "CONTACT"'`
   - Wait 1.2s and run `.claude/skills/verify/scripts/ax.sh state`: verify `"hash": "#contact"`, `"menuExpanded": "false"`, and `scrollY > 0`.
   - Check `#mobile-menu` in DOM has `hidden === true`.
6. Run complete verify suite:
   - Run `.claude/skills/verify/scripts/ax.sh all`
7. Stop test server:
   - Run `.claude/skills/verify/scripts/verify-server.sh stop`

## Risks

| Risk | Mitigation |
|------|------------|
| CSS specificity: `flex` class overriding `[hidden]` | Tailwind CSS v4 preflight applies `[hidden]:where(:not([hidden='until-found'])) { display: none !important; }`, preventing `flex` from displaying the element when `hidden` is present. |
| Inaccurate scroll target calculation if closed drawer retains height | `flushSync` in `closeMenu()` synchronously commits `isOpen = false` and adds `hidden` before `scrollToSection()` runs layout measurements. |
| Design system class string mismatch | No class names are changed on `#mobile-menu`; `scripts/check-design-system.mjs` continues to pass cleanly. |

## Acceptance Criteria

- [ ] `aria-controls` never references a missing id: the drawer `#mobile-menu` stays in the DOM while closed with `hidden` attribute.
- [ ] When the drawer is closed, its links are neither focusable nor in the accessibility tree, so `ax.sh has 'link "WORK"'` fails at the mobile viewport.
- [ ] The toggle and the drawer links behave as before, and the mobile-menu recipe of the verify skill passes, including the #64 overshoot case.
- [ ] `npm run check` passes.
