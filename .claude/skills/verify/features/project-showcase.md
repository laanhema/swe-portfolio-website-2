# Project showcase

The `SELECTED WORKS.` section (`#work`) on `/` shows four colored project cards: GymBro App, Tralla, Froots Smoothie App, and Distill Design Scraper. Each card has a description, tech badges, a `CODE` link to its GitHub repo, and a `READ STORY` link to its blog post.

## Sub-features

- `showcase-cards`: the four cards render with their h3 title, description, and tech badges.
- `showcase-code-link`: `CODE` points at the project's repo and opens in a new tab.
- `showcase-read-story`: `READ STORY` routes in-app to `/blog/<slug>` with the page at the top.
- `showcase-layout`: the grid has two columns at `md` and up, with odd cards offset down. It has one column on mobile.

## How to get to it (user POV)

- Scroll down `/`, or click `Work` or `VIEW WORK`.

## Driving it with ax.sh

Preconditions:

- Doctor is healthy, `ax.sh desktop` is set, and `ax.sh open /` has run.

- **Cards.** Run `ax.sh aria "$RUN_DIR/showcase.aria.txt"`. The file has `heading "GYMBRO APP" level="3"`, `"TRALLA"`, `"FROOTS SMOOTHIE APP"`, and `"DISTILL DESIGN SCRAPER"`.
- **Code links.** Run `ax.sh has 'link "CODE" url=".*github.com/laanhema/tralla"'`, and repeat for `jamktiko/gymbroapp`, `jamktiko/smoothie_testi`, and `laanhema/distill-design-scraper`. Each prints a matching line. Do not click them.
- **Read story.** Run `ax.sh click 'link "READ STORY" url=.*/blog/tralla'`, then `ax.sh state`. The output shows `"path": "/blog/tralla"`, `"h1": "Rebuilding Trello with Angular and SignalStore."`, and `"scrollY": 0`.
- **Hover/press match (desktop).** Run `ax.sh desktop`, `ax.sh open /`, then `ax.sh buttons`. Every line ends in `ok`, every `transform=` reads `matrix(1, 0, 0, 1, -3, -3)` with `translate=none` and a `6px 6px` shadow, and the command exits 0 (#56).
- **Layout.** Run `ax.sh click 'link "VIEW WORK"'`, then `sleep 1.2; ax.sh shot "$RUN_DIR/showcase-desktop.png"`. Repeat after `ax.sh mobile` and `ax.sh open /`.

## Gotchas

- Every card has a `CODE` link and a `READ STORY` link. Always add `url=` to the pattern, or you click GymBro's.
- Cards fade in on scroll. A screenshot taken before the scroll animation finishes shows half-transparent cards.
- A browser session started before `ax.sh` launched Chrome with a mouse reports `(hover: none)`. `ax.sh buttons` then prints `NO-HOVER`. Run `ax.sh stop` and retry.
- Card data lives in `PROJECTS` in `src/App.tsx`. If a `postSlug` is missing from `BLOG_POSTS`, `READ STORY` lands on the blog 404.
