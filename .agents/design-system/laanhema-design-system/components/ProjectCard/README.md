A showcased project as a flat colour block: title, description, tech tags and a Code / Live action pair. Hand-written from `src/features/showcase/ProjectCard.tsx`.

- **Props** (from `ProjectCardProps`):
  - `title`
  - `description`
  - `techStack: string[]`
  - `repoUrl`
  - `liveUrl?`
  - `liveLabel?` (default "Live Demo"; GymBro uses "Download APK")
  - `color` (the fill, from the accent rotation)
- Shell: `brutal-border brutal-shadow p-6 md:p-8 flex flex-col h-full`, with `style={{ backgroundColor: color }}`. All text is ink.
- Grid: `grid md:grid-cols-2 gap-10`, with every second card wrapped in `md:translate-y-16`.
- Purple (#a855f7) holds ink text at 4.73:1. Keep descriptions `font-medium` or bolder.
