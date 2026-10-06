# Contact

The `LET'S BUILD SOMETHING AWESOME.` section (`#contact`) appears at the bottom of `/` and below every blog post. It offers a `mailto:lahmakkonen@gmail.com` link and a Name, Email, and Message form. The form is an MVP stub: `SEND MESSAGE` does nothing (`preventDefault`), and nothing is sent anywhere.

## Sub-features

- `contact-mailto`: the email link's href is `mailto:lahmakkonen@gmail.com`, and the address does not overflow at 320px.
- `contact-form-fields`: the `NAME`, `EMAIL`, and `MESSAGE` textboxes are labelled and accept typing.
- `contact-submit-noop`: `SEND MESSAGE` keeps the user on the page with the URL unchanged.

## How to get to it (user POV)

- Click `Contact` in the nav or `CONTACT` in the drawer, scroll to the bottom of `/`, or scroll to the end of any blog post.

## Driving it with ax.sh

Preconditions:

- Doctor is healthy, and `ax.sh open /` has run.

- **Reach.** Run `ax.sh click 'link "Contact" url=.*#contact'`, then `sleep 1.2; ax.sh state`. The output shows `"hash": "#contact"`.
- **Mailto.** Run `ax.sh has 'link "LAHMAKKONEN@GMAIL.COM" url="mailto:lahmakkonen@gmail.com"'`. It prints the line. Do not click it, because that opens a mail client.
- **Fields.** Run `CHROME_DEVTOOLS_AXI_SESSION=verify chrome-devtools-axi snapshot --full | grep -E 'textbox "(NAME|EMAIL|MESSAGE)"'` to find the uids, then run `chrome-devtools-axi fill @<uid> "Test"` (with the session env set) immediately, before the next snapshot.
- **Submit no-op.** Run `ax.sh click 'button "SEND MESSAGE"'`, then `ax.sh state`. The path and hash are unchanged, and no navigation happens.
- **Narrow.** Run `ax.sh mobile`, `ax.sh open /#contact`, `sleep 1.2`, and then `ax.sh shot "$RUN_DIR/contact-mobile.png"`. Check that the email address wraps inside the viewport.

## Gotchas

- Do not report the form as "sending" anything. The message is not delivered anywhere. Serverless dispatch is post-MVP (AGENTS.md).
- Filling fields needs fresh uids. `ax.sh` has no `fill` wrapper, so run the snapshot and the fill back to back.
