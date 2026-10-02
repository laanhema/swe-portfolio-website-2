# AGENTS.md

This file provides guidance to agents when working with code in this repository.

Follow .agents/design-system/laanhema-design-system/DESIGN.md and BUILDING-PAGES.md for any UI work, and reuse the class strings in .agents/design-system/laanhema-design-system/components/*/README.md.

## Project Overview

`swe-portfolio-website-2` (`laanhema.dev`) is a high-performance, single-page portfolio web application built with React 19, TypeScript, Vite 8, Tailwind CSS v4, and GSAP. It serves as the professional digital presence and personal brand showcase for full-stack software engineer Lauri Makkonen, active since 2019. The application uses a bold Neo-Brutalist design language (4px borders, hard offset drop-shadows, high-contrast typography, and vivid accent colors) to showcase flagship software projects, highlight engineering experience, and provide direct recruiter outreach paths.

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| React `^19.2.7` | UI component library |
| TypeScript `~6.0.2` | Static type safety and strict compiler checks |
| Vite `^8.1.1` | Build tool, dev server, and HMR |
| Tailwind CSS `^4.3.2` | Utility-first styling with `@tailwindcss/vite` |
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
```

---

## Architecture & Directory Layout

The codebase follows a feature-sliced architecture where components are grouped by domain rather than flat categories:

```
swe-portfolio-website-2/
├── .agents/
│   ├── PRDs/
│   │   └── PRD.md                      # Product Requirements Document
│   └── stories/
│       └── todo-stories.md             # Issue & backlog story tracking
├── public/
│   ├── favicon.svg                     # Site favicon
│   └── CNAME                           # Custom domain configuration (laanhema.dev)
├── src/
│   ├── assets/                         # Static media (e.g., portrait image)
│   ├── components/                     # Shared presentational UI (Icons.tsx)
│   ├── features/                       # Domain feature modules
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
- **CSS Utility Classes**: kebab-case (`brutal-border`, `brutal-shadow`, `animate-on-scroll`).
- **Constants**: UPPER_SNAKE_CASE (`PROJECTS`).

### Neo-Brutalist Styling
- Use `.brutal-border` for all brutalist elements (maps to `border-4 border-text-primary`).
- Use `.brutal-shadow` (`6px 6px 0px 0px #121212`) and `.brutal-shadow-hover` (`translate(-3px, -3px)`) for clickable cards and buttons.
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

### Animations
- Elements requiring entrance animations should use the class `.animate-on-scroll`.
- Centralize GSAP animation logic in `src/hooks/useGsapAnimations.ts` to ensure clean lifecycle mounting and cleanup.

---

## Validation Checklist

Run before committing any changes:

```bash
# Verify no lint errors
npm run lint

# Verify TypeScript compilation and production build
npm run build
```

---

## Key Files

| File | Purpose |
| --- | --- |
| `src/App.tsx` | Main layout container, hero narrative, and project showcase data |
| `src/styles/global.css` | Tailwind v4 `@theme` tokens and neo-brutalist utility classes |
| `src/features/navigation/Nav.tsx` | Sticky navbar and mobile drawer menu |
| `src/features/showcase/ProjectCard.tsx` | Reusable project card with tech badges and action links |
| `src/features/contact/ContactForm.tsx` | Contact section and messaging form |
| `src/hooks/useGsapAnimations.ts` | GSAP ScrollTrigger setup and cleanup |
| `.agents/PRDs/PRD.md` | Authoritative Product Requirements Document |

---

## On-Demand Context

| Topic | File |
| --- | --- |
| Product Requirements Document | [`.agents/PRDs/PRD.md`](.agents/PRDs/PRD.md) |
| Backlog Tasks & Stories | [`.agents/stories/todo-stories.md`](.agents/stories/todo-stories.md) |
| Task List | [`TODO.md`](TODO.md) |

---

## Notes

- **Static Site Nature**: The MVP contact CTA uses `mailto:lahmakkonen@gmail.com`; serverless form dispatch is deferred to post-MVP.
- **Mobile First**: Pay special attention to narrow mobile viewports (320px–375px) where text truncation, button wrapping, and alignment bugs frequently surface.
