# Section navigation

The sticky nav bar and the hero `VIEW WORK` button take the visitor to the Work, About, and Contact sections of the homepage. On the homepage they smooth-scroll in place and push a `#hash`. On a blog page they route to `/#<section>` and then scroll. The logo returns to the top of `/`.

## Sub-features

- `nav-section-scroll`: desktop `Work`, `About`, and `Contact` scroll to `#work`, `#about`, and `#contact` and set the hash.
- `nav-view-work`: the hero `VIEW WORK` button scrolls to `#work` and sets `#work`.
- `nav-logo-top`: the `laanhema.dev - Back to top` logo scrolls to the top of `/`.
- `nav-cross-page`: from `/blog` or `/blog/:slug`, the section links land on `/` scrolled to the section.
- `nav-blog-link`: `Blog` routes to `/blog` with the page scrolled to the top.
- `nav-reload-reset`: reloading `/#work` clears the hash and starts at the top.

## How to get to it (user POV)

- Click `Work`, `About`, `Blog`, or `Contact` in the desktop nav bar (viewport `md`, 768px, and wider).
- Click `VIEW WORK` in the homepage hero.
- Click the `LAANHEMA.DEV` logo on any page.
- Use the same links from the nav bar on `/blog` and `/blog/:slug`.
- On mobile, use the drawer. See [mobile-menu.md](./mobile-menu.md).

## Driving it with ax.sh

Preconditions:

- Doctor is healthy, `ax.sh desktop` is set, and `ax.sh open /` has run.

- **Section link.** Run `ax.sh click 'link "About" url=.*#about'`, then `sleep 1.2; ax.sh state`. The output shows `"path": "/"`, `"hash": "#about"`, and a `scrollY` far above 0.
- **View Work.** Run `ax.sh open /`, then `ax.sh click 'link "VIEW WORK"'`, then `sleep 1.2; ax.sh state`. The output shows `"hash": "#work"` and `scrollY` > 0. The screenshot shows the `SELECTED WORKS.` heading under the sticky nav.
- **Logo.** Starting from a scrolled state, run `ax.sh click 'link "laanhema.dev - Back to top"'`, then `sleep 1.2; ax.sh state`. The output shows `"scrollY": 0`.
- **Cross-page.** Run `ax.sh open /blog`, then `ax.sh click 'link "Work" url=.*/#work'`, then `sleep 1.5; ax.sh state`. The output shows `"path": "/"`, `"hash": "#work"`, and `scrollY` > 0. A screenshot taken right after the click already shows the target section, with no hero (issue #58).
- **Blog link.** Run `ax.sh click 'link "Blog" url=.*/blog$'`, then `ax.sh state`. The output shows `"path": "/blog"`, `"h1": "Field  Notes."`, and `"scrollY": 0`.
- **Proof.** Run `ax.sh shot "$RUN_DIR/nav-<sub-feature>.png"` after each step.

## Gotchas

- Desktop links are `display:none` below 768px, so on mobile they are absent from the snapshot. Use the drawer there.
- Section links land with the section top at the nav bottom: `section.getBoundingClientRect().top` equals `nav.getBoundingClientRect().bottom` (84px on mobile, 72px at `md`+), set by `scroll-padding-top` on `html`. Read both with `chrome-devtools-axi eval` (read-only); a difference over 2px is a regression of issue #63.
- `nav-reload-reset` requires a real reload. `ax.sh open /#work` is a fresh navigation, not a reload. Use `chrome-devtools-axi eval "location.reload()"` (with the session env set), then read `state`.
- Cross-page section links are client-side router navigations (no document reload), and `HomePage` jumps to the hash in a layout effect before first paint. A full reload or a visible hero on a cross-page click is a regression of issue #58.
- After a cross-page landing, `HomePage` re-anchors the target on any layout resize for up to 2s, or until the first wheel, touch, key, or pointer input, so a late reflow above the target does not move it (issue #63).
