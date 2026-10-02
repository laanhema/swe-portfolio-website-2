# Plan: Shorten Project Tags and Refine GymBro App Tech Stack Badges

## Summary

Update the `techStack` array for "GymBro App" in `PROJECTS` (`src/App.tsx`) from `['Angular + Ionic Frontend', 'Express REST API Backend', 'MongoDB']` to `['Angular', 'Ionic', 'Express', 'MongoDB']`. Also audit all other project entries in `PROJECTS` to verify that their tech stack tags are concise technology names without redundant descriptors, ensuring all project badges wrap and display neatly inside `ProjectCard`.

## User Story

As a visitor reviewing the portfolio project cards,
I want project tags to be clean, concise technology names instead of long descriptive labels,
So that the badges are easy to read, wrap neatly, and maintain the clean neo-brutalist aesthetic of the project cards.

## Metadata

| Field | Value |
|---|---|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/App.tsx`, `src/features/showcase/ProjectCard.tsx` |
| GitHub Issue | #14 |

---

## Patterns to Follow

### Existing `PROJECTS` Array in `src/App.tsx`
```tsx
// SOURCE: src/App.tsx:8-23
const PROJECTS = [
  {
    title: 'GymBro App',
    description:
      'Gamified gym-tracker app for Android with workout sessions, XP progression, and unlockable achievements.',
    techStack: [
      'Angular + Ionic Frontend',
      'Express REST API Backend',
      'MongoDB',
    ],
    repoUrl: 'https://github.com/jamktiko/gymbroapp',
    liveUrl:
      'https://staticwebsiteforgymbroapp.s3.eu-north-1.amazonaws.com/index.html',
    liveLabel: 'Download APK',
    color: '#ff3e00', // Orange accent
  },
  // ...
];
```

### Tag Rendering in `src/features/showcase/ProjectCard.tsx`
```tsx
// SOURCE: src/features/showcase/ProjectCard.tsx:37-46
<div className="flex flex-wrap gap-2 mb-8">
  {techStack.map((tech) => (
    <span 
      key={tech} 
      className="bg-white brutal-border px-3 py-1 text-sm font-bold uppercase"
    >
      {tech}
    </span>
  ))}
</div>
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `src/App.tsx` | UPDATE | Shorten GymBro App `techStack` tags to `['Angular', 'Ionic', 'Express', 'MongoDB']`. Verify other projects remain concise. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Update GymBro App `techStack` in `src/App.tsx`

- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**: Replace `'Angular + Ionic Frontend'` and `'Express REST API Backend'` in the GymBro App `techStack` array with `'Angular'`, `'Ionic'`, and `'Express'`. The full array will be `['Angular', 'Ionic', 'Express', 'MongoDB']`.
- **Mirror**: Existing `PROJECTS` array definition in `src/App.tsx:8-49`
- **Validate**: `npm run lint && npm run build`

### Task 2: Validate Build and Lint

- **File**: N/A
- **Action**: VALIDATE
- **Implement**: Run ESLint and TypeScript/Vite build to verify there are no compilation or lint errors.
- **Validate**: `npm run lint && npm run build`

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint
```

## End-to-End Verification

1. Run `npm run build` and ensure TypeScript compilation and Vite bundling succeed without errors.
2. Run `npm run lint` and verify no ESLint warnings or errors exist.
3. Verify that the GymBro App project card displays four discrete badges: `ANGULAR`, `IONIC`, `EXPRESS`, `MONGODB`.
4. Verify that each badge is styled with `bg-white brutal-border px-3 py-1 text-sm font-bold uppercase` and wraps neatly inside the card container.
5. Verify other project cards (`Tralla`, `Froots Smoothie App`, `Distill Design Scraper`) display their concise tech badges as expected.

---

## Risks

| Risk | Mitigation |
|---|---|
| Card layout shift with 4 badges instead of 3 | Badges use `flex-wrap gap-2` with small tag padding, which wraps neatly within the card's `flex-grow` container. |

---

## Acceptance Criteria

- [ ] GymBro App `techStack` updated to `['Angular', 'Ionic', 'Express', 'MongoDB']`.
- [ ] Other project tags in `PROJECTS` verified to ensure all tech badges are concise without redundant words.
- [ ] Badges wrap and display neatly inside `ProjectCard`.
- [ ] `npm run lint` passes without errors or warnings.
- [ ] `npm run build` compiles successfully.
