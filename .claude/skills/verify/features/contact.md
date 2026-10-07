# Contact

The `LET'S BUILD SOMETHING AWESOME.` section (`#contact`) appears at the bottom of `/` and below every blog post. It offers a `mailto:lahmakkonen@gmail.com` link and a Name, Email, and Message form. The form is an MVP stub: `SEND MESSAGE` does nothing (`preventDefault`), and nothing is sent anywhere.

## Sub-features

- `contact-mailto`: the email link's href is `mailto:lahmakkonen@gmail.com`, and the address does not overflow at 320px.
- `contact-form-fields`: the `NAME`, `EMAIL`, and `MESSAGE` textboxes are labelled and accept typing.
- `contact-submit-noop`: `SEND MESSAGE` keeps the user on the page with the URL unchanged.
- `contact-submit-cursor`: on a mouse device, `SEND MESSAGE` shows a pointer cursor, and the NAME, EMAIL, and MESSAGE fields show a text cursor.

## How to get to it (user POV)

- Click `Contact` in the nav or `CONTACT` in the drawer, scroll to the bottom of `/`, or scroll to the end of any blog post.

## Driving it with ax.sh

Preconditions:

- Doctor is healthy, and `ax.sh open /` has run.

- **Reach.** Run `ax.sh click 'link "Contact" url=.*#contact'`, then `sleep 1.2; ax.sh state`. The output shows `"hash": "#contact"`.
- **Mailto.** Run `ax.sh has 'link "LAHMAKKONEN@GMAIL.COM" url="mailto:lahmakkonen@gmail.com"'`. It prints the line. Do not click it, because that opens a mail client.
- **Fields.** Run `CHROME_DEVTOOLS_AXI_SESSION=verify chrome-devtools-axi snapshot --full | grep -E 'textbox "(NAME|EMAIL|MESSAGE)"'` to find the uids, then run `chrome-devtools-axi fill @<uid> "Test"` (with the session env set) immediately, before the next snapshot.
- **Submit no-op.** Run `ax.sh click 'button "SEND MESSAGE"'`, then `ax.sh state`. The path and hash are unchanged, and no navigation happens.
- **Hover/press match (desktop).** Run `ax.sh open /`, `ax.sh desktop`, `ax.sh open /`, then `ax.sh buttons`. Every line ends in `ok`, `SEND MESSAGE` is compared against `VIEW WORK`, every `transform=` reads `matrix(1, 0, 0, 1, -3, -3)` with `translate=none` and a `6px 6px` shadow, and the command exits 0 (#56).
- **Pointer cursor (desktop).** Run `ax.sh open /`, `ax.sh desktop`, `ax.sh open /`, then `ax.sh cursor`. It prints `SEND MESSAGE cursor=pointer ok` and `NAME`/`EMAIL`/`MESSAGE cursor=text ok`, and it exits 0. On the pre-fix code it prints `cursor=default NOT-POINTER` and exits 1 (#86).
- **Press.** In one `eval`, dispatch `new PointerEvent('pointerdown', {bubbles: true})` on the `SEND MESSAGE` button and return its `getAnimations().length`. Expect `1` (`playPress`, `translate(6px, 6px)`). Say in the report that this probe used `eval`. A real touch tap needs CDP `Input.dispatchTouchEvent` (see `SKILL.md`); read the animations from a `window` `pointerdown` listener, because a listener on the button itself runs before React's root handler.
- **Narrow.** Run `ax.sh mobile`, `ax.sh open /#contact`, `sleep 1.2`, and then `ax.sh shot "$RUN_DIR/contact-mobile.png"`. Check that the email address wraps inside the viewport.

## Gotchas

- Do not report the form as "sending" anything. The message is not delivered anywhere. Serverless dispatch is post-MVP (AGENTS.md).
- A browser session started before `ax.sh` launched Chrome with a mouse reports `(hover: none)`. `ax.sh buttons` then prints `NO-HOVER`. Run `ax.sh stop` and retry.
- Filling fields needs fresh uids. `ax.sh` has no `fill` wrapper, so run the snapshot and the fill back to back.
- `ax.sh cursor` reads the computed style, so it shows the cursor a mouse would get without hovering. A screenshot never shows the mouse cursor, so the `cursor` output is the proof.
