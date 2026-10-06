# Mobile menu

Below the `md` breakpoint, the nav bar collapses to an orange `MENU` button. The button opens a drawer (`#mobile-menu`) with `WORK`, `ABOUT`, `BLOG`, and `CONTACT`. Choosing a link closes the drawer and navigates or scrolls.

## Sub-features

- `menu-toggle`: `Open menu` expands the drawer, and `Close menu` collapses it (`aria-expanded` flips).
- `menu-section-link`: `WORK`, `ABOUT`, and `CONTACT` close the drawer and scroll to the section, setting the hash.
- `menu-blog-link`: `BLOG` closes the drawer and routes to `/blog`.
- `menu-narrow-layout`: at 320px and 375px, the logo and button do not overlap or wrap.

## How to get to it (user POV)

- On a phone-sized viewport, tap `MENU` in the top-right of any page.

## Driving it with ax.sh

Preconditions:

- Doctor is healthy. Run `ax.sh mobile`, then `ax.sh open /`. Set the viewport before you open the page, so the layout is mobile from the first paint.

- **Open.** Run `ax.sh click 'button "Open menu"'`, then `ax.sh state`. The output shows `"menuExpanded": "true"`. `ax.sh has 'link "CONTACT" url=.*#contact'` succeeds.
- **Section link.** Run `ax.sh click 'link "CONTACT"'`, then `sleep 1.2; ax.sh state`. The output shows `"hash": "#contact"`, `scrollY` > 0, and `"menuExpanded": "false"`. The screenshot shows the contact form under a `MENU` button.
- **Close.** Reopen the drawer, then run `ax.sh click 'button "Close menu"'`, then `ax.sh state`. The output shows `"menuExpanded": "false"`. `ax.sh has 'link "WORK"'` fails.
- **Blog.** Reopen the drawer, then run `ax.sh click 'link "BLOG"'`, then `ax.sh state`. The output shows `"path": "/blog"` and `"menuExpanded": "false"`.
- **Narrow layout.** Run `CHROME_DEVTOOLS_AXI_SESSION=verify chrome-devtools-axi emulate --viewport "320x640x2,mobile,touch"`, then `ax.sh open /`, then `ax.sh shot "$RUN_DIR/menu-320.png"`. Read the PNG and confirm the logo and the `MENU` button sit on one row.

## Gotchas

- Drawer link names are upper-case (`"WORK"`), but the desktop names are `"Work"`. A pattern for one viewport silently misses the other.
- The button's accessible name toggles between `Open menu` and `Close menu`. Its visible text is `MENU` or `CLOSE`.
- `menuExpanded` in `state` reads the button even on desktop, where the button is hidden, so it reports `"false"` there. That value means nothing on desktop.
