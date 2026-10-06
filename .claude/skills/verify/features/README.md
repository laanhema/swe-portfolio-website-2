# laanhema.dev verification map

This directory is the maintained list of user-facing behaviors in laanhema.dev. Read this index before you drive the app, then follow the matching feature file as the recipe. The site has a single surface: a static React SPA with the routes `/`, `/blog`, `/blog/:slug`, and `*`, which redirects to `/`.

## Baseline preconditions

- Start the server with `.claude/skills/verify/scripts/verify-server.sh start` and record the printed `RUN_DIR`.
- `verify-server.sh doctor` prints `doctor: HEALTHY`.
- Every browser command goes through `.claude/skills/verify/scripts/ax.sh`, which runs in the isolated `verify` Chrome session.
- Start on the desktop viewport (`ax.sh desktop`) unless the recipe says mobile.

## Driving conventions

- Match snapshot lines by role, accessible name, and URL. Never match by coordinates or a stale `@g` ref.
- Accessible names follow CSS `uppercase`. Desktop nav uses `Work`. The mobile drawer and buttons use `WORK` and `READ STORY`.
- Wait about 1.2s after anything that smooth-scrolls or animates before you read `state` or take a screenshot.
- Never click external links. Assert their `url=` instead. The snapshot prints URLs in quotes (`url="https://..."`), so write `url=".*<fragment>`.

## Proof and skip reporting

- For each step, keep the `click:` line, the `state` JSON, and a screenshot in `$RUN_DIR`.
- Record the feature ID and the entry point next to each artifact name, for example `nav-section-scroll-desktop-work.png`.
- If you skip an entry point, such as a mobile path or a cross-page path, say so. Do not count a path you skipped as verified through another path.

## Feature entry contract

Each feature file has an H1, one descriptive paragraph, and then four H2 sections in this order: `Sub-features`, `How to get to it (user POV)`, `Driving it with ax.sh`, and `Gotchas`.

## Features

- [Section navigation](./section-navigation.md): nav bar links, the logo, and the hero `VIEW WORK` button, scrolling to `#work`, `#about`, and `#contact` both on the homepage and from blog pages.
- [Mobile menu](./mobile-menu.md): the `Menu`/`Close` drawer below the `md` breakpoint.
- [Project showcase](./project-showcase.md): the four project cards with their tech badges, `CODE` repo links, and `READ STORY` links.
- [Blog](./blog.md): the `/blog` index, `/blog/:slug` articles, the back link, and the 404 for unknown slugs.
- [Contact](./contact.md): the `mailto:` CTA and the non-submitting message form.
