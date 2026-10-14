# Project guide

laanhema.dev is the personal portfolio and technical devlog of full-stack engineer Lauri Makkonen. It runs as a client-side React 19 single-page app built with TypeScript, Vite 8, and Tailwind CSS v4.

Instead of another cookie-cutter template with soft pastels and rounded cards, the site uses a sharp Neo-Brutalist style with 4px black borders, hard 6px offset drop shadows (#121212), high-contrast type, and snappy button clicks. There is no backend server, no database, and no bloated component library. The entire build compiles into static files deployed directly to GitHub Pages with self-hosted fonts and zero external CDN calls.

## Big picture

Hiring managers spend maybe twenty seconds on a portfolio. If the site takes three seconds to load, breaks on a phone, or hides its source code behind dead links, they close the tab. This codebase exists to give technical recruiters and engineering leads immediate proof of work. They can skim four featured projects, jump straight to the GitHub repos, read in-depth devlogs, or get in touch.

The app splits into two main experiences. The homepage holds the hero, experience numbers, project cards, and contact form. The blog route (`/blog`) and article pages (`/blog/:slug`) host project devlogs with code snippets and responsive tables.

Hosting a single-page app on static GitHub Pages creates a routing headache. When someone reloads `/blog/gymbro-app`, GitHub Pages looks for that physical path, fails, and returns `public/404.html`. To fix this without running a Node server, an inline script in `public/404.html` grabs the path, writes it to `sessionStorage`, and redirects to `/`. Then `index.html` reads `sessionStorage` and swaps the browser URL back before React Router boots. It works cleanly and costs nothing to host.

Mobile touch behaviour has its own quirks. Mobile Safari and Chromium often drop `:active` states on quick taps or leave buttons stuck in a pressed state when a tap triggers navigation. To make interactions feel solid, `src/components/playPress.ts` hooks into `pointerdown` and runs a 200ms Web Animations API keyframe sequence on clickable elements. It guarantees the button visually depresses and springs back every single time.

## Codebase map

The codebase avoids monolithic page files and deep inheritance trees. Everything is organized around features and focused utilities. Key files and directories:

- `index.html` is the entry shell. It restores deep-link paths saved by the 404 handler and resets scroll restoration on page reloads so visitors do not get dumped halfway down the page.
- `public/404.html` handles the GitHub Pages SPA redirect trick. It catches direct URLs, writes them to `sessionStorage`, and bounces users back to the root index.
- `public/CNAME` pins the custom domain `laanhema.dev` for GitHub Pages.
- `src/main.tsx` mounts the React tree in strict mode and imports the local variable font package and global styling.
- `src/App.tsx` controls client routes, defines the project list, and keeps scroll anchors locked during late font and image reflows.
- `src/assets/lauri-makkonen-portrait.jpg` is the author portrait displayed above the fold in the hero.
- `src/components/Footer.tsx` handles the bottom bar with copyright, branding, and social links.
- `src/components/Icons.tsx` keeps raw SVGs for GitHub, LinkedIn, and email. No 5MB icon package needed.
- `src/components/playPress.ts` runs a 200ms tactile press animation via the Web Animations API on mobile pointerdown events.
- `src/features/navigation/Nav.tsx` builds the sticky top bar, handles anchor clicks, and controls the mobile slide-down drawer.
- `src/features/navigation/navHelpers.ts` holds the route list and the smooth-scrolling helper that syncs the URL hash.
- `src/features/showcase/ProjectCard.tsx` renders individual project cards with colored borders, tech tags, and links to code and devlogs.
- `src/features/contact/ContactForm.tsx` reads form fields through native `FormData` and generates a prefilled `mailto:` link. No server backend required.
- `src/features/blog/BlogIndex.tsx` lists devlogs in a staggered responsive grid with read times and tag filters.
- `src/features/blog/BlogPost.tsx` renders the article view using `.brutal-prose` typography, with a dedicated 404 card if a slug is missing.
- `src/features/blog/components/ArticleHeader.tsx` formats article titles, publication dates, and back-navigation links.
- `src/features/blog/components/PostCard.tsx` formats post preview cards on the blog listing page.
- `src/features/blog/data/posts.ts` holds the article content and metadata as typed TypeScript objects.
- `src/features/blog/formatDate.ts` parses ISO dates into human-readable month and year text.
- `src/features/blog/types.ts` defines TypeScript interfaces for articles and frontmatter fields.
- `src/hooks/useGsapAnimations.ts` mounts GSAP ScrollTrigger reveals, running only when visitors have not asked for reduced motion.
- `src/hooks/useScrollReset.ts` kicks the window scroll back to (0, 0) on route changes.
- `src/styles/global.css` configures Tailwind v4 tokens, brutalist shadows, scroll offsets, and article typography rules.
- `scripts/check-agents-md.mjs` verifies that every path, version, npm script, and hex code in `AGENTS.md` matches the code.
- `scripts/check-design-system.mjs` verifies that every Tailwind class string documented in design system READMEs actually appears in `src/`.
- `.github/workflows/check.yaml` runs linting, documentation checks, and production builds on pull requests.
- `.github/workflows/deploy.yaml` builds and publishes the production bundle to GitHub Pages on every push to `main`.
- `vite.config.ts` wires the React and Tailwind v4 plugins into Vite.
- `eslint.config.js` sets up ESLint with strict type checking and forbids type assertions.

## Tech stack and design decisions

Every architectural decision here favors static reliability, near-instant load times, and zero maintenance overhead.

### Framework and runtime

The app uses React 19.2.7 and TypeScript 6.0.2 on Vite 8.1.1. React 19 brings concurrent rendering without extra state libraries. Strict TypeScript compiler checks paired with ESLint `strictTypeChecked` enforce solid code quality. The lint configuration sets `@typescript-eslint/consistent-type-assertions` to `never`. That rule outlaws quick-and-dirty `as Type` casts. Code must narrow types with explicit type guards instead.

### Runtime dependencies

The project keeps dependencies down to seven runtime packages:

- `@fontsource-variable/noto-sans` (^5.3.0) bundles font files directly in the repository. It cuts out Google Fonts network round-trips, prevents layout shifts, and removes third-party tracking.
- `@tailwindcss/vite` (^4.3.2) ties Tailwind CSS v4 into Vite for fast style compilation.
- `gsap` (^3.15.0) handles scroll-triggered entrance reveals, wired through `prefers-reduced-motion` so accessibility settings stay respected.
- `react` (^19.2.7) renders the component tree.
- `react-dom` (^19.2.7) handles DOM updates.
- `react-router` (^8.4.0) routes between the homepage and devlog views without full page refreshes.
- `tailwindcss` (^4.3.2) generates utility styling from CSS theme tokens.

### Styling and design tokens

Tailwind CSS v4 handles styling entirely in CSS through `src/styles/global.css`. There is no `tailwind.config.js`. Instead, theme variables live in a clean `@theme` block defining an off-white canvas (`#f8f9fa`), near-black text (`#121212`), four accents (orange `#ff3e00`, cyan `#00e5ff`, yellow `#facc15`, purple `#a855f7`), and hard offset drop shadows (`6px 6px 0px 0px #121212`).

Components use utilities directly or rely on brutalist primitives like `.brutal-border` (4px solid dark border) and `.brutal-shadow`. For devlog articles, `.brutal-prose` provides customized typography for headers, tables, code blocks, and blockquotes without pulling in the heavy `@tailwindcss/typography` plugin.

### Single-page navigation and scroll anchoring

Combining multi-page routes with intra-page section anchors often causes subtle layout bugs. Because the sticky navbar sits at the top of the viewport, smooth scrolls would slide section headers underneath the bar without compensation. `src/styles/global.css` solves this by setting `scroll-padding-top` to match the exact mobile and desktop navbar heights.

Another tricky edge case happens when deep-linking into an anchor from outside. While fonts swap and portrait images load, the page reflows, shoving the anchor target out of alignment. `src/App.tsx` fixes this with a custom `holdAnchor` helper. It watches root dimensions with a `ResizeObserver` for 2000ms after landing and snaps the target back into place until the user touches, scrolls, or presses a key.

### Static content and state architecture

There is no database, no headless CMS, and no state store like Redux or Zustand. Devlog posts live directly in `src/features/blog/data/posts.ts` as typed TypeScript objects. Updating an article happens through regular git pull requests with full compiler verification.

State stays local. Menu toggle flags live in `src/features/navigation/Nav.tsx`, and contact form submissions parse input through the browser `FormData` API in `src/features/contact/ContactForm.tsx`.

## Development and testing

### Scripts

The project defines these npm scripts in `package.json`:

```bash
npm run dev           # Start Vite local development server with hot module replacement
npm run build         # Type-check TypeScript with tsc and compile production bundle into dist/
npm run lint          # Run ESLint with strict type rules across all source files
npm run check:design  # Verify that all CSS classes documented in design system READMEs exist in src/
npm run check:agents  # Verify that AGENTS.md paths, package versions, and color tokens match code
npm run check         # Execute lint, design check, AGENTS.md check, and production build in sequence
npm run preview       # Serve the compiled dist/ directory locally to preview production build
```

### GitHub Pages deployment

The build produces a purely static output folder in `dist/`. No Docker containers, base images, or long-running processes are required. GitHub Actions manages the pipeline:

- `.github/workflows/check.yaml` runs on every pull request, installing dependencies with `npm ci` on Node.js 22 and running `npm run check`.
- `.github/workflows/deploy.yaml` triggers on pushes to `main`. It runs `npm run check`, packages the `dist/` folder, and deploys it to GitHub Pages for `laanhema.dev`.

Automated scripts in `scripts/check-agents-md.mjs` and `scripts/check-design-system.mjs` act as guard rails. If someone renames a class in the code or updates a package version without updating documentation, the check script fails and blocks deployment.

## Security and deployment

Static single-page apps have a minimal attack surface, but client applications still face web security risks:

- Cross-site scripting. `src/features/contact/ContactForm.tsx` never injects user input back into the page HTML. Inputs are read through FormData, validated, URI-encoded, and handed off to a mailto link. Devlog HTML in `src/features/blog/data/posts.ts` is static, authored locally in the codebase, and verified at build time.
- Reverse tab-nabbing. Outbound links pointing to GitHub and LinkedIn specify `target="_blank"` with `rel="noopener noreferrer"`. This stops external pages from hijacking window navigation.
- Supply chain and privacy. The app loads no external tracking pixels, analytics bundles, or CDN fonts. The font files are bundled locally through `@fontsource-variable/noto-sans`. This stops font providers from logging visitor IP addresses.
- Build integrity. GitHub Actions workflows use pinned actions (`actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`) and install dependencies strictly with `npm ci` against exact checksums in `package-lock.json`.
