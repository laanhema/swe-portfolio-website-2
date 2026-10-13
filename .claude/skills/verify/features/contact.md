# Contact

The `LET'S BUILD SOMETHING AWESOME.` section (`#contact`) appears at the bottom of `/` and below every blog post. It offers a `mailto:lahmakkonen@gmail.com` link and a Name, Email, and Message form. All three fields are required. `SEND MESSAGE` with valid values opens the visitor's mail client with a prefilled draft (`mailto:lahmakkonen@gmail.com?subject=Contact from <name>&body=…`). Nothing is sent to a server.

## Sub-features

- `contact-mailto`: the email link's href is `mailto:lahmakkonen@gmail.com`, and the address does not overflow at 320px.
- `contact-form-fields`: the `NAME`, `EMAIL`, and `MESSAGE` textboxes are labelled and accept typing.
- `contact-submit-mailto`: `SEND MESSAGE` with an empty or invalid field is blocked by the browser's validation. With all three fields valid, it navigates to a `mailto:` URL that carries the name in the subject and the name, email, and message in the body, URL-encoded. The page URL stays the same.
- `contact-submit-cursor`: on a mouse device, `SEND MESSAGE` shows a pointer cursor, and the NAME, EMAIL, and MESSAGE fields show a text cursor.

## How to get to it (user POV)

- Click `Contact` in the nav or `CONTACT` in the drawer, scroll to the bottom of `/`, or scroll to the end of any blog post.

## Driving it with ax.sh

Preconditions:

- Doctor is healthy, and `ax.sh open /` has run.

- **Reach.** Run `ax.sh click 'link "Contact" url=.*#contact'`, then `sleep 1.2; ax.sh state`. The output shows `"hash": "#contact"`.
- **Mailto.** Run `ax.sh has 'link "LAHMAKKONEN@GMAIL.COM" url="mailto:lahmakkonen@gmail.com"'`. It prints the line. Do not click it, because that opens a mail client.
- **Fields.** Run `CHROME_DEVTOOLS_AXI_SESSION=verify chrome-devtools-axi snapshot --full | grep -E 'textbox "(NAME|EMAIL|MESSAGE)"'` to find the uids, then run `chrome-devtools-axi fill @<uid> "Test"` (with the session env set) immediately, before the next snapshot.
- **Submit.** Run `ax.sh submit`. It opens `/`, clicks `SEND MESSAGE` on the empty form, fills the three fields, and clicks again. It prints `empty submit: navigations=0 invalid=name,email,message ok` and `valid submit: mailto:lahmakkonen@gmail.com?subject=Contact%20from%20Jane%20Smith&body=… ok`, and it exits 0. Run `ax.sh submit /blog/tralla` for the copy below a post. `ax.sh state` afterwards shows the same path.
- **Hover/press match (desktop).** Run `ax.sh open /`, `ax.sh desktop`, `ax.sh open /`, then `ax.sh buttons`. Every line ends in `ok`, `SEND MESSAGE` is compared against `VIEW WORK`, every `transform=` reads `matrix(1, 0, 0, 1, -3, -3)` with `translate=none` and a `6px 6px` shadow, and the command exits 0 (#56).
- **Pointer cursor (desktop).** Run `ax.sh open /`, `ax.sh desktop`, `ax.sh open /`, then `ax.sh cursor`. It prints `SEND MESSAGE cursor=pointer ok` and `NAME`/`EMAIL`/`MESSAGE cursor=text ok`, and it exits 0. On the pre-fix code it prints `cursor=default NOT-POINTER` and exits 1 (#86).
- **Press.** Run `ax.sh tap 'button "SEND MESSAGE"'`. It ends with `tap button "SEND MESSAGE": ok` and exits 0, and the JSON shows `"anims":["translate(6px, 6px)"]` (`playPress`), `"events":["pointerdown","pointerup","click"]`, and the same `path` and `hash` before and after. The form is empty in that tap, so the browser blocks the submit and scrolls to the `NAME` field.
- **Narrow.** Run `ax.sh mobile`, `ax.sh open /#contact`, `sleep 1.2`, and then `ax.sh shot "$RUN_DIR/contact-mobile.png"`. Check that the email address wraps inside the viewport.

## Gotchas

- Do not report the form as "sending" anything. It only opens a draft in the visitor's mail client, and nothing is delivered by the site. Serverless dispatch is post-MVP (AGENTS.md).
- Do not click `SEND MESSAGE` on a filled form with `ax.sh click`. The `mailto:` navigation goes to the system mail handler. `ax.sh submit` cancels it in a `navigate` listener and prints the URL instead, so that probe uses `eval` to observe, not to drive.
- A browser session started before `ax.sh` launched Chrome with a mouse reports `(hover: none)`. `ax.sh buttons` then prints `NO-HOVER`. Run `ax.sh stop` and retry.
- Filling fields needs fresh uids. `ax.sh` has no `fill` wrapper, so run the snapshot and the fill back to back.
- `ax.sh cursor` reads the computed style, so it shows the cursor a mouse would get without hovering. A screenshot never shows the mouse cursor, so the `cursor` output is the proof.
