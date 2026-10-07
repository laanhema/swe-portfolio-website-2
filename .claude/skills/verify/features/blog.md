# Blog

`/blog` ("FIELD NOTES.") lists one colored post card for each project. Each card shows a date, a reading time, a title link, an excerpt, and tags. `/blog/:slug` renders the article: a `← ALL POSTS` back link, tags, the title with its orange highlight, the author, date, and reading time, a summary, and the HTML body. A contact section follows the article. An unknown slug shows a `POST NOT FOUND.` 404 card.

## Sub-features

- `blog-index`: `/blog` lists the posts `tralla`, `distill-design-scraper`, `froots-smoothie-app`, and `gymbro-app` as title links.
- `blog-open-post`: a post card's title link routes to `/blog/<slug>`, which opens at the top.
- `blog-article`: the article header and body render, including h2s and tables from `content`. Below `md`, tables stack each row into a block so they fit the column without sideways scrolling (#74).
- `blog-back`: `← ALL POSTS` returns to `/blog`.
- `blog-404`: `/blog/<unknown>` shows `POST NOT FOUND.` with `← BACK TO ALL POSTS`.
- `blog-deep-link`: loading `/blog/<slug>` directly serves the post. Dev and preview use Vite's SPA fallback. Production on GitHub Pages uses `public/404.html`.

## How to get to it (user POV)

- Click `Blog` in the nav, or `BLOG` in the mobile drawer.
- Click `READ STORY` on a project card.
- Open a `/blog/<slug>` URL directly.

## Driving it with ax.sh

Preconditions:

- Doctor is healthy, `ax.sh desktop` is set, and `ax.sh open /blog` has run.

- **Index.** Run `ax.sh state`. The output shows `"path": "/blog"` and `"h1": "Field  Notes."` (with two spaces, because of the `<br/>`). Run `ax.sh aria "$RUN_DIR/blog-index.aria.txt"`. The file has four `link "..." url=.*/blog/<slug>` lines.
- **Open post.** Run `ax.sh click 'link "REBUILDING TRELLO WITH ANGULAR AND SIGNALSTORE"'`, then `ax.sh state`. The output shows `"path": "/blog/tralla"`, `"h1": "Rebuilding Trello with Angular and SignalStore."`, and `"scrollY": 0`.
- **Article.** Run `ax.sh has 'heading "REBUILDING TRELLO WITH ANGULAR AND SIGNALSTORE\." level="1"'`, then `ax.sh has 'link "← ALL POSTS"'`. Take `ax.sh shot "$RUN_DIR/blog-post-tralla.png"`.
- **Tables fit (mobile).** For each slug, run `ax.sh open /blog/<slug>`, `ax.sh mobile`, then `ax.sh tables`. Every line ends in `fits` and the command exits 0. Repeat at 320px with `chrome-devtools-axi emulate --viewport "320x640x2,mobile,touch"`. Take `ax.sh shot` after scrolling the table into view, because a fitting table can still read badly.
- **Nav matches home (mobile).** Run `ax.sh mobile`, then `ax.sh nav` on `/`, `/blog`, `/blog/tralla`, and `/blog/does-not-exist`. Every line ends in `ok`, the `logo=` and `menu=` boxes match `/`, and each command exits 0 (#75).
- **Back.** Run `ax.sh click 'link "← ALL POSTS"'`, then `ax.sh state`. The output shows `"path": "/blog"`.
- **404.** Run `ax.sh open /blog/does-not-exist`, then `ax.sh state`. The output shows `"h1": "Post Not Found."`. `ax.sh has 'link "← BACK TO ALL POSTS"'` succeeds.
- **Deep link.** Run `ax.sh open /blog/gymbro-app`, then `ax.sh state`. The output shows `"path": "/blog/gymbro-app"` and the GymBro post's h1. To check the GitHub Pages redirect, use `verify-server.sh start preview`. Note that `vite preview` also uses SPA fallback and never serves `404.html`, so this check cannot prove the Pages redirect locally.

## Gotchas

- Post titles in the tree are upper-cased (`"REBUILDING TRELLO ..."`), but `state.h1` keeps the source casing.
- An unknown top-level path such as `/foo` redirects to `/`, not to the blog 404.
- This host's `system-ui` is Noto Sans, so a page that falls back to the system font renders at the same size here as on `/`. On a phone it does not. Trust the `font=` field from `ax.sh nav`, not equal boxes.
- Article HTML comes from `content` strings rendered with `dangerouslySetInnerHTML`. Check tables and code blocks visually, at both viewports.
