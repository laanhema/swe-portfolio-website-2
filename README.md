# laanhema.dev — Software Engineer Portfolio Website

A high-performance, single-page portfolio web application built with React 19, TypeScript, Vite 8, Tailwind CSS v4, and GSAP. It serves as the professional digital presence and personal brand platform for Lauri Makkonen, a full-stack software engineer active since 2019. The application showcases full-stack engineering proficiency, architectural judgment, and craftsmanship in building interactive, high-reliability software using a bold Neo-Brutalist design language.

For full project specifications and requirements, see the [Product Requirements Document](.agents/PRDs/PRD.md).

## Highlights

- Neo-brutalist aesthetic with high-contrast typography, 4px solid borders, and tactile drop shadows
- Responsive navigation bar with desktop anchors and mobile drawer menu
- Hero section with custom typography, engineering values narrative, social links, and author portrait
- Engineering experience metrics highlighting track record since 2019 and 2000+ GitHub contributions
- Curated project showcase featuring 4 flagship applications with concise tech stack badges and live demo / APK links
- Direct contact hub featuring quick email outreach and interactive messaging form
- Smooth scroll-triggered reveal animations powered by GSAP

## Tech Stack

| Component | Technology | Version |
| --- | --- | --- |
| Frontend Framework | React | ^19.2.7 |
| Language | TypeScript | ~6.0.2 |
| Build Tool & Dev Server | Vite | ^8.1.1 |
| Styling | Tailwind CSS (with `@tailwindcss/vite`) | ^4.3.2 |
| Animation | GSAP | ^3.15.0 |
| Typography | @fontsource-variable/noto-sans | ^5.3.0 |
| Linting | ESLint | ^10.6.0 |

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
npm install
```

### Development

Start the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

### Building for Production

Type-check and build the production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint across the codebase:

```bash
npm run lint
```

## Featured Projects

The portfolio showcases four flagship applications:

- **GymBro App**: Gamified gym-tracker app for Android with workout sessions, XP progression, and unlockable achievements. (Angular, Ionic, Express, MongoDB) — [Source](https://github.com/jamktiko/gymbroapp) | [Download APK](https://staticwebsiteforgymbroapp.s3.eu-north-1.amazonaws.com/index.html)
- **Tralla**: Trello-like Kanban board application built with Angular. (Angular, Taiga UI, NgRx SignalStore) — [Source](https://github.com/laanhema/tralla)
- **Froots Smoothie App**: Smoothie recipe app for browsing recipes with nutritional info and custom blends. (Svelte, TypeScript, Tailwind) — [Source](https://github.com/jamktiko/smoothie_testi) | [Live Demo](https://froots-smoothies.netlify.app/)
- **Distill Design Scraper**: Web developer tool that scrapes color schemes, fonts, layouts, and components from any website. (Next.js, React, Playwright, Sharp, Culori, Zod) — [Source](https://github.com/laanhema/distill-design-scraper)

## Out of Scope

The following capabilities are deferred to post-MVP releases:

- Server-side contact form dispatch API (MVP uses client-side mailto protocol)
- Technical blogging engine / CMS integration
- Live GitHub API dynamic data polling
- Dark / light mode toggle switch
- Full case study deep-dive subpages

## Project Layout

```
swe-portfolio-website-2/
├── .agents/
│   ├── PRDs/
│   │   └── PRD.md                      # Product Requirements Document
│   └── stories/
│       └── todo-stories.md             # Issue & backlog story tracking
├── public/
│   ├── favicon.svg
│   └── CNAME                           # Custom domain configuration (laanhema.dev)
├── src/
│   ├── assets/                         # Static image assets (e.g. portrait)
│   ├── components/                     # Shared presentational UI (icons)
│   ├── features/
│   │   ├── contact/                    # Contact section & form
│   │   ├── navigation/                 # Navigation bar & mobile drawer
│   │   └── showcase/                   # Project showcase cards
│   ├── hooks/                          # Custom hooks (GSAP animations)
│   ├── styles/                         # Global Tailwind styles & design tokens
│   ├── App.tsx                         # Main portfolio layout orchestrator
│   └── main.tsx                        # React application entry point
├── index.html                          # Entry HTML
├── package.json                        # Project metadata & scripts
├── tsconfig.json                       # TypeScript compiler references
└── vite.config.ts                      # Vite build configuration
```

## Documentation Links

- [Product Requirements Document (PRD)](.agents/PRDs/PRD.md)
- [Backlog Task Stories](.agents/stories/todo-stories.md)
- [Original Task List](TODO.md)
