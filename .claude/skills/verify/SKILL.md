---
name: verify
description: Launch and drive the laanhema.dev portfolio (React/Vite single-page site with routes /, /blog, /blog/:slug) in an isolated headless Chrome, and capture screenshot + accessibility-snapshot proof. Use to prove a UI change works in the real app — nav/section scrolling, mobile menu, project cards, blog pages, contact section — instead of trusting lint/build alone.
---

# Verify laanhema.dev

The only surface is a static web UI. There is no backend, API, CLI, or database: the "contact form" never submits, and contact goes through a `mailto:` link. Every proof is a browser proof: you drive real clicks and record the resulting URL, scroll position, and what is on screen.

Two helper scripts do all the work. Run them from the repo root:

- `.claude/skills/verify/scripts/verify-server.sh`: starts, checks, and stops a Vite server that this run owns.
- `.claude/skills/verify/scripts/ax.sh`: drives `chrome-devtools-axi` in its own browser session (`CHROME_DEVTOOLS_AXI_SESSION=verify`), so it never touches the user's Chrome.

Feature recipes live in [`features/README.md`](features/README.md). Read the matching feature file before you drive anything.

## Launch

```bash
S=.claude/skills/verify/scripts/verify-server.sh
A=.claude/skills/verify/scripts/ax.sh

$S start            # Vite dev server (HMR, uses the working tree as-is)
# or
$S start preview    # npm run build, then vite preview of dist/ (production bundle)
```

The server is ready when `start` prints `ready: http://127.0.0.1:5199 ...` and then `RUN_DIR=...`. Before printing, it checks that `/` returns HTML with `<title>laanhema.dev</title>`. Copy `RUN_DIR` into your shell (`RUN_DIR=<printed path>`) and save every artifact there.

- Port: `5199` with `--strictPort`. Set `VERIFY_PORT=<n>` to change it. `start` refuses to run when another process owns the port, or when this script already has an instance running. Never drive a server you did not start, such as the user's own `npm run dev` on 5173.
- No env vars, seed data, or auth are needed. The content is hard-coded in `src/App.tsx` (`PROJECTS`) and `src/features/blog/data/posts.ts` (`BLOG_POSTS`).
- Use `preview` when the change touches the build output, `public/`, or `index.html`. Use `dev` for everything else.
- Server log: `.temp/verify/server.log`. Build log in preview mode: `.temp/verify/build.log`.

Isolation: only one instance per checkout, because the pid file lives in `.temp/verify/`. To run a second checkout or worktree at the same time, give it a different `VERIFY_PORT` and a different `CHROME_DEVTOOLS_AXI_SESSION`.

## Doctor

```bash
$S doctor
```

This check is read-only. It confirms that the recorded pid is alive, that the listener on the port belongs to our process group, and that `/`, `/blog`, and `/blog/tralla` all serve the app shell. It then prints the git HEAD and flags uncommitted changes in `src/`. Run it first, and again whenever something looks wrong. If it prints `doctor: UNHEALTHY`, do not drive the app. Read `.temp/verify/server.log`, then run `$S stop` and `$S start`.

## Drive

```bash
$A open /blog                                         # navigate (path is relative to the server); run before desktop/mobile, which fail with no page open
$A desktop                                            # 1280x900 viewport (default-ish)
$A mobile                                             # 375x812 mobile+touch viewport
$A click 'link "READ STORY" url=.*/blog/tralla'       # fresh snapshot + click first matching line
$A has 'heading "POST NOT FOUND\."'                   # assert a node exists (exit 1 if not)
$A state                                              # {"path","hash","scrollY","h1","menuExpanded"}
$A buttons                                            # hover VIEW WORK, CODE, READ STORY, SEND MESSAGE; exit 1 unless they lift alike (#56)
$A cursor                                             # read SEND MESSAGE's and the form fields' computed cursor; exit 1 unless pointer / text (#86)
$A hero                                               # check hero header across desktop and mobile viewports; exit 1 if any blur found
$A aria "$RUN_DIR/<name>.aria.txt"                    # full accessibility snapshot to a file
$A shot "$RUN_DIR/<name>.png" [--full-page]           # screenshot
```

The handles are lines from the accessibility snapshot, matched with an extended regex. To see what is available, run `CHROME_DEVTOOLS_AXI_SESSION=verify chrome-devtools-axi snapshot --full`. Rules:

- **Match the accessible name exactly as the snapshot prints it.** CSS `uppercase` changes the name. Desktop nav links are `"Work"`, `"About"`, `"Blog"`, and `"Contact"`. The mobile drawer shows the same links as `"WORK"`, `"ABOUT"`, `"BLOG"`, and `"CONTACT"`. Buttons and cards appear as `"VIEW WORK"`, `"READ STORY"`, `"CODE"`, and `"← ALL POSTS"`. Headings are upper-cased in the tree, but `state` reports `h1` from `textContent`, which keeps the source casing.
- **Disambiguate repeated names by URL.** For example, use `link "CODE" url=".*github.com/laanhema/tralla"`, or `link "READ STORY" url=.*/blog/gymbro-app`.
- **Never reuse a raw `@gN:...` ref.** Refs carry a generation tag and go stale after the next snapshot. `ax.sh click` takes the snapshot and clicks in a single step for this reason.
- Smooth scrolling and GSAP fade-ins run for about 0.8s. Run `sleep 1.2` after a click that scrolls, before you read `state` or take a screenshot.
- `ax.sh click` takes about 3s (it snapshots first), and the click lands at the end of that time, so the next command starts at an unknown delay after it. To test a short time window after a click, such as the 2s anchor hold (#63), do the click, the change, and the measurement in one async `eval`, and say in the report that the probe used `eval` instead of the user path.
- `ax.sh` launches the verify Chrome with a mouse (`--blink-settings=primaryHoverType=2,…`), so `desktop` matches `(hover: hover)` and `mobile` (touch) does not. After `ax.sh click`, the mouse rests on the clicked element, so desktop screenshots show real hover states. The flag applies only when the session's browser starts: after pulling this change, run `ax.sh stop` once. To override it, export `CHROME_DEVTOOLS_AXI_CHROME_ARGS` yourself (set it empty for the old pointer-less browser).
- External links (GitHub, LinkedIn, project repos) open new tabs. Assert their `url=` in the snapshot. Do not click them.
- `ax.sh` cannot touch-tap a link, follow the new tab, and return. To prove that a press style resets after that round trip, drive a separate headless Chrome over CDP: `Input.dispatchTouchEvent` for the tap, `Target.closeTarget` on the popup, then `CSS.forcePseudoState` with `active` to model a browser that leaves `:active` set. Save the script in `$RUN_DIR` so the proof can be rerun.

## Evidence

Artifacts go in `$RUN_DIR` (`.temp/verify/runs/<timestamp>/`). The path is gitignored through `.temp/`, and cleanup never deletes it. A proof for each behavior includes:

1. **Action**: the `click:` line that `ax.sh click` printed, which records the exact node you clicked. Keep it in your report.
2. **Resulting state**: the `ax.sh state` JSON, which shows the URL path, the hash, `scrollY`, the h1, and the menu state. A scroll proof needs `scrollY` to change and the hash to match. A screen alone is not proof.
3. **Visual**: `ax.sh shot "$RUN_DIR/<feature>-<step>.png"`. Open the PNG with the Read tool and check it. Elements below the fold have `opacity:0` until GSAP reveals them, so a `--full-page` shot shows blank regions. That is not a bug.
4. **Structure**, when text or links matter: `ax.sh aria "$RUN_DIR/<feature>-<step>.aria.txt"`.

Standards:

- Drive the real user path: nav links, buttons, and cards. Do not use `eval` to call `scrollIntoView` or to set `location`. Use `eval` and `state` only to read.
- For a responsive change, prove both viewports (`$A desktop` and `$A mobile`). Mobile widths from 320px to 375px are where this site breaks (AGENTS.md). For 320px, run `chrome-devtools-axi emulate --viewport "320x640x2,mobile,touch"` with the session env set.
- Side effects: there are none. Nothing is persisted, and the form `onSubmit` calls `preventDefault`. The contact proof is the `mailto:` href, not a sent message.
- In dev mode the page shows your working tree. Run `doctor`, which prints the git HEAD and any uncommitted changes, so the proof records which code it ran against.

## Cleanup

```bash
$A stop      # stop the verify browser session (only that session's bridge)
$S stop      # kill the process group recorded in .temp/verify/server.pid, nothing else
ls "$RUN_DIR"  # evidence must still be here
```

`stop` kills only the pid this script started, together with its process group, which includes Vite's children. Never `pkill node` or `pkill vite`, because the user may have their own dev server running. Run both stop commands after every failed attempt too. Delete old run directories under `.temp/verify/runs/` only when the user asks you to.

## Helpers

| Script | Invocation |
| --- | --- |
| `scripts/verify-server.sh` | `start [dev\|preview]`, `doctor`, `stop` |
| `scripts/ax.sh` | `open <path>`, `click '<regex>'`, `has '<regex>'`, `state`, `shot <png> [--full-page]`, `aria <txt>`, `tables`, `nav`, `buttons`, `cursor`, `hero`, `mobile`, `desktop`, `stop` |

Run either script with no arguments to print its usage.
