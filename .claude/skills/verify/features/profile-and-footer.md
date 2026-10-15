# Profile and footer

The top of `/` introduces the developer. The hero has the `BUILDING ROBUST SYSTEMS.` h1, an intro paragraph, the `VIEW WORK` button, GitHub and LinkedIn icon links, and a portrait. The black About section (`#about`, `THE DEV BEHIND THE CODE.`) has a short bio and three stat tiles. Every page ends with the same footer: a `DEV.PORTFOLIO` mark, a copyright line, and `GITHUB` and `LINKEDIN` text links.

## Sub-features

- `profile-hero-links`: the hero `GitHub` and `LinkedIn` icon links point at `https://github.com/laanhema` and `https://www.linkedin.com/in/laanhema` and open in a new tab. A touch tap plays the `playPress` press and leaves the link at rest.
- `profile-portrait`: the portrait renders as `image "Lauri Makkonen"`.
- `profile-about`: `#about` shows the `THE DEV BEHIND THE CODE.` h2, the bio, and the tiles `2019 CODING SINCE`, `25 PUBLIC REPOS`, and `2000+ GITHUB CONTRIBUTIONS THIS YEAR`.
- `footer-links`: the footer (`contentinfo`) on `/`, `/blog`, and `/blog/:slug` has `GITHUB` and `LINKEDIN` links to the same two profiles, opening in a new tab.

## How to get to it (user POV)

- Open `/`: the hero is the first screen.
- Click `About` in the nav, or `ABOUT` in the mobile drawer.
- Scroll to the bottom of any page for the footer.

## Driving it with ax.sh

Preconditions:

- Doctor is healthy, and `ax.sh open /` has run.

- **Hero links.** Run `ax.sh has 'link "GitHub" url="https://github.com/laanhema"'` and `ax.sh has 'link "LinkedIn" url="https://www.linkedin.com/in/laanhema"'`. Each prints a matching line. Do not click them.
- **Hero tap.** Run `ax.sh tap 'link "GitHub" url="https://github.com/laanhema'`. It ends with `: ok` and exits 0, the JSON shows `"anims":["translate(6px, 6px)"]` and `"transform":"none"` under `after`, and `popups` lists the GitHub URL.
- **Portrait.** Run `ax.sh has 'image "Lauri Makkonen"'`.
- **About.** Run `ax.sh aria "$RUN_DIR/profile.aria.txt"`. The file has `heading "THE DEV BEHIND THE CODE." level="2"` and the `CODING SINCE`, `PUBLIC REPOS`, and `GITHUB CONTRIBUTIONS THIS YEAR` texts.
- **Footer.** In the same file, the `contentinfo` node holds `link "GITHUB" url="https://github.com/laanhema"` and `link "LINKEDIN" url="https://www.linkedin.com/in/laanhema"`. Repeat `ax.sh has 'link "GITHUB"'` on `/blog` and `/blog/tralla`.

## Gotchas

- The hero and footer link to the same profiles under different names: the hero icon links are `"GitHub"` and `"LinkedIn"` (from `aria-label`), and the footer links are `"GITHUB"` and `"LINKEDIN"` (CSS `uppercase`). The patterns are case-sensitive, so each one matches only its own pair.
- The About numbers are hard-coded in `src/App.tsx`, not fetched from GitHub. Do not report a stale count as a broken fetch.
- The footer links have no `playPress` and no brutalist shadow, only a hover colour, so `ax.sh tap` on them reports no press animation.
