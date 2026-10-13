# laanhema.dev: Software Engineer Portfolio Website

Personal portfolio website for Lauri Makkonen, built with React 19, TypeScript, Vite 8, Tailwind CSS v4, and GSAP. It uses a Neo-Brutalist design (4px borders, hard drop shadows, and high-contrast typography) to present projects, experience since 2019, and contact details.

For specifications and requirements, see the [Product Requirements Document](.agents/PRDs/PRD.md).

## Highlights

- Neo-brutalist styling with high-contrast typography, 4px solid borders, and offset drop shadows
- Responsive navbar with desktop section anchors, page routing, and a mobile drawer
- Hero section with engineering background, social links (GitHub, LinkedIn), and portrait
- Experience stats showing work since 2019 and 2000+ GitHub contributions
- Project grid with tech stack badges and links to source code and devlogs
- Devlog section with write-ups on four major projects
- Contact section with email link and prefilled message form
- Scroll-triggered entrance animations powered by GSAP

## Tech Stack

| Component | Technology | Version |
| --- | --- | --- |
| Frontend Framework | React | ^19.2.7 |
| Language | TypeScript | ~6.0.2 |
| Build Tool & Dev Server | Vite | ^8.1.1 |
| Client Routing | React Router | ^8.4.0 |
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

### Checking before a commit

Run lint, the documentation checks (design-system class strings and `AGENTS.md` against the code) and the production build in one command. The pull-request and deploy workflows run the same command:

```bash
npm run check
```

## Featured Projects

Four applications in the portfolio:

- **GymBro App**: Gamified gym-tracker app for Android with workout sessions, XP progression, and unlockable achievements. (Angular, Ionic, Express, MongoDB) - [Source](https://github.com/jamktiko/gymbroapp) | [Read Story](https://laanhema.dev/blog/gymbro-app)
- **Tralla**: Trello-like Kanban board application built with Angular. (Angular, Taiga UI, NgRx SignalStore) - [Source](https://github.com/laanhema/tralla) | [Read Story](https://laanhema.dev/blog/tralla)
- **Froots Smoothie App**: Smoothie recipe app for browsing recipes with nutritional info and custom blends. (Svelte, TypeScript, Tailwind) - [Source](https://github.com/jamktiko/smoothie_testi) | [Read Story](https://laanhema.dev/blog/froots-smoothie-app)
- **Distill Design Scraper**: Web developer tool that scrapes color schemes, fonts, layouts, and components from any website. (Next.js, React, Playwright, Sharp, Culori, Zod) - [Source](https://github.com/laanhema/distill-design-scraper) | [Read Story](https://laanhema.dev/blog/distill-design-scraper)

## Out of Scope

The following capabilities are deferred to post-MVP releases:

- Server-side contact form dispatch API (MVP uses client-side mailto protocol)
- Live GitHub API dynamic data polling
- Dark / light mode toggle switch

## Project Layout

```
swe-portfolio-website-2/
├── .agents/
│   ├── PRDs/
│   │   └── PRD.md                      # Product Requirements Document
│   └── issues/
│       └── todo-issues.md             # Issue & backlog tracking
├── public/
│   ├── favicon.svg
│   └── CNAME                           # Custom domain configuration (laanhema.dev)
├── src/
│   ├── assets/                         # Static image assets (e.g. portrait)
│   ├── components/                     # Shared UI (Icons.tsx, playPress.ts)
│   ├── features/
│   │   ├── blog/                       # Devlogs index and post article views
│   │   ├── contact/                    # Contact section & form
│   │   ├── navigation/                 # Navigation bar & mobile drawer
│   │   └── showcase/                   # Project showcase cards
│   ├── hooks/                          # Custom hooks (GSAP animations)
│   ├── styles/                         # Global Tailwind styles & design tokens
│   ├── App.tsx                         # Main portfolio layout orchestrator & router
│   └── main.tsx                        # React application entry point
├── index.html                          # Entry HTML
├── package.json                        # Project metadata & scripts
├── tsconfig.json                       # TypeScript compiler references
└── vite.config.ts                      # Vite build configuration
```

## Documentation Links

- [Product Requirements Document (PRD)](.agents/PRDs/PRD.md)
- [Tracked Issues](.agents/issues/todo-issues.md)
- [Task List](TODO.md)
