# AGENTS.md

This file provides guidance to agents when working with code in this repository.

Follow .agents/design-system/laanhema-design-system/DESIGN.md and BUILDING-PAGES.md for any UI work, and reuse the class strings in .agents/design-system/laanhema-design-system/components/*/README.md.

## Project Overview

`swe-portfolio-website-2` (`laanhema.dev`) is a portfolio web application built with React 19, TypeScript, Vite 8, Tailwind CSS v4, and GSAP. It presents the projects, experience, and contact details of full-stack software engineer Lauri Makkonen, active since 2019. The application uses a Neo-Brutalist design language (4px borders, hard offset drop-shadows, high-contrast typography, and vivid accent colors) across responsive viewports.

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| React `^19.2.7` | UI component library |
| TypeScript `~6.0.2` | Static type safety and strict compiler checks |
| Vite `^8.1.1` | Build tool, dev server, and HMR |
| Tailwind CSS `^4.3.2` | Utility-first styling with `@tailwindcss/vite` |
| React Router `^8.4.0` | Client-side routing for SPA and blog devlogs |
| GSAP `^3.15.0` | Scroll-triggered entrance animations |
| `@fontsource-variable/noto-sans` `^5.3.0` | Self-hosted typography |
| ESLint `^10.6.0` | Code quality and style linting |

---

## Commands

```bash
# Development
npm run dev

# Build (Type-check and Vite bundle)
npm run build

# Preview Production Build
npm run preview

# Lint
npm run lint

# Lint, docs checks and build (what the pull-request and deploy workflows run)
npm run check
```

---

## Architecture & Directory Layout

The codebase follows a feature-sliced architecture where components are grouped by domain rather than flat categories:

```
swe-portfolio-website-2/
├── .agents/
│   ├── PRDs/
│   │   └── PRD.md                      # Product Requirements Document
│   └── issues/
│       └── todo-issues.md             # Issue & backlog tracking
├── public/
│   ├── favicon.svg                     # Site favicon
│   └── CNAME                           # Custom domain configuration (laanhema.dev)
├── src/
│   ├── assets/                         # Static media (e.g., portrait image)
│   ├── components/                     # Shared presentational UI (Footer.tsx, Icons.tsx, playPress.ts)
│   ├── features/                       # Domain feature modules
│   │   ├── blog/                       # Blog index, post views & data models
│   │   ├── contact/                    # Contact section & interactive form
│   │   ├── navigation/                 # Navigation bar & mobile menu drawer
│   │   └── showcase/                   # Featured project cards
│   ├── hooks/                          # Custom React hooks (useGsapAnimations.ts)
│   ├── styles/                         # CSS layers & design tokens (global.css)
│   ├── App.tsx                         # Main layout orchestrator & project dataset
│   └── main.tsx                        # React application root
├── index.html                          # Entry HTML
├── package.json                        # Dependencies & scripts
├── tsconfig.app.json                   # Client TypeScript compiler settings
├── tsconfig.json                       # TypeScript project references
└── vite.config.ts                      # Vite build configuration
```

---

## Code Patterns & Conventions

### Naming Conventions
- **Components**: PascalCase (`Nav.tsx`, `ProjectCard.tsx`, `ContactForm.tsx`).
- **Custom Hooks**: camelCase prefixed with `use` (`useGsapAnimations.ts`).
- **CSS Utility Classes**: kebab-case (`brutal-border`, `brutal-shadow`, `animate-on-scroll`, `brutal-prose`).
- **Constants**: UPPER_SNAKE_CASE (`PROJECTS`).

### Neo-Brutalist Styling
- Use `.brutal-border` for all brutalist elements (maps to `border-4 border-text-primary`).
- Use `.brutal-shadow` (`6px 6px 0px 0px #121212`) and `.brutal-shadow-hover` (`translate(-3px, -3px)`) for clickable cards and buttons.
- Use `.brutal-prose` for article / blog typography styling.
- Design palette tokens:
  - Background Canvas: `#f8f9fa`
  - Text Primary: `#121212`
  - Orange Accent: `#ff3e00`
  - Cyan Accent: `#00e5ff`
  - Yellow Accent: `#facc15`
  - Purple Accent: `#a855f7`

### Component Guidelines
- Define explicit TypeScript interfaces for props (e.g. `interface ProjectCardProps`).
- External links must always include `target="_blank"` and `rel="noopener noreferrer"`.
- Keep layout responsive with mobile-first Tailwind utilities (`flex-col md:flex-row`, `px-6 md:px-12`).
- On mobile/touch viewports, wire button presses via `onPointerDown={playPress}` from `src/components/playPress.ts` because mobile browsers may skip `:active` or freeze hover states.

### Animations
- Elements requiring entrance animations should use the class `.animate-on-scroll`.
- Centralize GSAP animation logic in `src/hooks/useGsapAnimations.ts` to ensure clean lifecycle mounting and cleanup.

---

## Validation Checklist

Run before committing any changes:

```bash
# Lint, check the design-system READMEs and this file against the code, and build
npm run check
```

`npm run check` fails when a class string in a design-system component README no longer appears in `src/`, or when a path, dependency version, npm script or colour in this file no longer matches the repository. Update the README or this file in the same change as the code.

---

## Key Files

| File | Purpose |
| --- | --- |
| `src/App.tsx` | Main layout container, route setup, and project showcase data |
| `src/styles/global.css` | Tailwind v4 `@theme` tokens, brutalist utilities, and prose styles |
| `src/features/navigation/Nav.tsx` | Sticky navbar and mobile drawer menu |
| `src/features/showcase/ProjectCard.tsx` | Reusable project card with tech badges and action links |
| `src/features/blog/BlogIndex.tsx` | Devlog index page listing articles |
| `src/features/blog/BlogPost.tsx` | Full-page article reader for project deep dives |
| `src/features/contact/ContactForm.tsx` | Contact section and messaging form |
| `src/components/Footer.tsx` | Site-wide footer with brand mark, copyright, and social links |
| `src/components/playPress.ts` | Mobile-friendly pointerdown press animation helper |
| `src/hooks/useGsapAnimations.ts` | GSAP ScrollTrigger setup and cleanup |
| `.agents/PRDs/PRD.md` | Authoritative Product Requirements Document |

---

## On-Demand Context

| Topic | File |
| --- | --- |
| Product Requirements Document | [`.agents/PRDs/PRD.md`](.agents/PRDs/PRD.md) |
| Backlog Tasks & Issues | [`.agents/issues/todo-issues.md`](.agents/issues/todo-issues.md) |
| Task List | [`TODO.md`](TODO.md) |

---

## Notes

- **Static Site Nature**: The MVP contact CTA uses `mailto:lahmakkonen@gmail.com`; serverless form dispatch is deferred to post-MVP.
- **Mobile First**: Pay special attention to narrow mobile viewports (320px–375px) where text truncation, button wrapping, and alignment bugs frequently surface.
