# Stories from TODO.md

- **Source File**: `TODO.md`
- **Generated Date**: 2026-10-02
- **Repository**: `laanhema/swe-portfolio-website-2`

### Skipped Tasks
- Tasks 1–13 (`TODO.md:1-13`): Already tracked as GitHub issues #2 through #14 (`[TODO-1]` through `[TODO-13]`) and marked complete.
- Tasks 14–16 (`TODO.md:14-16`): Already tracked as GitHub issues #28 through #30 (`[TODO-14]` through `[TODO-16]`).

---

## [TODO-1] Fix mobile view top bar menu button functionality

**GitHub**: #2
**Type**: Bug
**GitHub Label**: bug
**Priority**: Medium
**Complexity**: Small
**Phase**: Backlog
**Labels**: bug, frontend, mobile
**Source**: `TODO.md:1` — "- [ ] In mobile view top bar "menu" button doesn't do anything."

### Description

In mobile view, clicking the "Menu" button in the navigation bar does nothing because no click handler or drawer state is implemented. The button should toggle an open/closed mobile navigation menu displaying links to Work, About, and Contact.

### Acceptance Criteria

- [ ] Clicking the "Menu" button toggles the mobile navigation menu open and closed.
- [ ] Navigation links (Work, About, Contact) are visible and functional within the mobile menu.
- [ ] Selecting a navigation link automatically closes the mobile menu and scrolls to the target section.
- [ ] Mobile menu button includes appropriate accessibility attributes (`aria-expanded`, `aria-label`).

### Technical Notes

- Key implementation details: Add state (`const [isOpen, setIsOpen] = useState(false)`) to toggle mobile navigation overlay/drawer.
- Files likely to be modified: `src/features/navigation/Nav.tsx`.
- Patterns to follow: Retain brutalist styling (`brutal-border`, high-contrast borders and shadows).
- Assumptions made: A full-width dropdown or sliding drawer beneath the navbar matching the existing styling is desired.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-2] Replace hero description placeholder text with personalized values

**GitHub**: #3
**Type**: Enhancement
**GitHub Label**: enhancement
**Priority**: Medium
**Complexity**: Small
**Phase**: Backlog
**Labels**: enhancement, frontend
**Source**: `TODO.md:2` — "- [ ] Hero text "I specialize in architecting..." needs to be replaced. It is a placeholder text. Perhaps it could be something from my previous sent job applications? There are quite a bit of values of mine that could be made into a paragraph or two."

### Description

The current hero description text ("I specialize in architecting scalable backend services...") is placeholder copy. It needs to be replaced with a concise, personalized summary reflecting actual developer background, experience, and core engineering values.

### Acceptance Criteria

- [ ] Placeholder text in the hero section is replaced with personalized copy highlighting real developer values and background.
- [ ] Left border accent (`border-[#ff3e00]`) and responsive typography (`text-xl md:text-2xl`) remain preserved.
- [ ] Copy reads naturally across mobile, tablet, and desktop viewports without awkward overflow.

### Technical Notes

- Key implementation details: Replace the text inside the hero paragraph element.
- Files likely to be modified: `src/App.tsx`.
- Patterns to follow: Consistent typography and voice with the About section ("The dev behind the code").
- Assumptions made: The user has draft text or values from previous job applications to incorporate.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-3] Adjust "Robust" outline stroke thickness on mobile view

**GitHub**: #4
**Type**: Bug
**GitHub Label**: bug
**Priority**: Medium
**Complexity**: Small
**Phase**: Backlog
**Labels**: bug, frontend, mobile
**Source**: `TODO.md:3` — "- [ ] "Robust" text is too bold on mobile view. It should be roughlt same thickness in mobile and on desktop view."

### Description

The stroked outline on the word "Robust" in the hero header uses a fixed 3px stroke, which appears disproportionately thick and heavy on mobile screens due to smaller base font size. The stroke width needs to be adjusted responsively so visual thickness feels consistent across desktop and mobile.

### Acceptance Criteria

- [ ] "Robust" outline stroke width is scaled down for mobile screens (e.g., 1.5px to 2px on mobile vs 3px on desktop).
- [ ] Outline remains crisp, hollow, and legible across all screen sizes.
- [ ] Visual weight of "Robust" matches the surrounding headline font weight.

### Technical Notes

- Key implementation details: Use responsive styling or CSS class for `WebkitTextStroke` rather than hardcoded inline `3px`.
- Files likely to be modified: `src/App.tsx`, `src/index.css`.
- Patterns to follow: Maintain the transparent text fill with dark stroke brutalist aesthetic.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-4] Center "2019 Coding Since" stat card content on mobile view

**GitHub**: #5
**Type**: Bug
**GitHub Label**: bug
**Priority**: Medium
**Complexity**: Small
**Phase**: Backlog
**Labels**: bug, frontend, mobile
**Source**: `TODO.md:4` — "- [ ] The "2019 coding since", text isnt centered around the box yellow box around it (on mobile view)."

### Description

In the about section, the text inside the yellow "2019 Coding Since" stat card is misaligned and not centered within its bounding box on mobile viewports. The layout should ensure both the year number and label are centered horizontally and vertically inside the box.

### Acceptance Criteria

- [ ] "2019" and "Coding Since" text are properly centered inside the yellow box on mobile view.
- [ ] Spacing and padding remain visually balanced inside the aspect-square card.
- [ ] Card layout remains harmonious with adjacent stat cards ("25 Public Repos" and contributions).

### Technical Notes

- Key implementation details: Update flexbox alignment on the card (`items-center text-center` or responsive alignment).
- Files likely to be modified: `src/App.tsx`.
- Patterns to follow: Match card styling across all stat blocks in the about section.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-5] Fix alignment and row wrapping of hero social icon boxes

**GitHub**: #6
**Type**: Bug
**GitHub Label**: bug
**Priority**: Medium
**Complexity**: Small
**Phase**: Backlog
**Labels**: bug, frontend
**Source**: `TODO.md:5` — "- [ ] Hero social icon boxes arent lined up properly. They should make a straight line. This happens sometimes, sometimes they are just correctly placed..."

### Description

The hero section's social media icon buttons (GitHub, Twitter, LinkedIn) occasionally break alignment or do not form a clean, straight row alongside the "View Work" CTA depending on screen width. The button containers need consistent vertical alignment and flex layout rules.

### Acceptance Criteria

- [ ] All hero social icon buttons stay in a single, straight horizontal row without unexpected wrapping or offsets.
- [ ] Social icon group aligns properly with the "View Work" CTA button on both desktop and mobile viewports.
- [ ] Brutalist hover offsets and shadows do not cause permanent layout shift or clipping.

### Technical Notes

- Key implementation details: Set explicit alignment (`items-center`) and prevent unintended wrap (`flex-nowrap`) within the icon button container.
- Files likely to be modified: `src/App.tsx`.
- Patterns to follow: Brutal button styling and GSAP scroll animation compatibility.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-6] Reposition hero portrait image higher above the fold

**GitHub**: #7
**Type**: Enhancement
**GitHub Label**: enhancement
**Priority**: Medium
**Complexity**: Small
**Phase**: Backlog
**Labels**: enhancement, frontend
**Source**: `TODO.md:6` — "- [ ] Perhaps the hero picture could be a tiny bit higher. When a user lands on this page it"

### Description

The hero portrait image sits slightly too low when a user first lands on the page, pushing it partially below the optimal viewport fold. The hero layout and vertical spacing should be tuned so the portrait is prominently visible immediately upon loading.

### Acceptance Criteria

- [ ] Hero portrait is shifted higher in the viewport layout for faster visual impact upon landing.
- [ ] Spacing between navbar, hero text, and portrait remains balanced and aesthetically pleasing.
- [ ] Responsive layout gracefully transitions between desktop side-by-side view and mobile stacked view.

### Technical Notes

- Key implementation details: Adjust hero header padding (`pt-32 pb-24`) and flex alignment (`xl:items-center` / `xl:items-start`), or container margin/offset.
- Files likely to be modified: `src/App.tsx`.
- Patterns to follow: Responsive layout rules using Tailwind utility classes.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-7] Fix "Selected Works" heading alignment on mobile view

**GitHub**: #8
**Type**: Bug
**GitHub Label**: bug
**Priority**: Medium
**Complexity**: Small
**Phase**: Backlog
**Labels**: bug, frontend, mobile
**Source**: `TODO.md:7` — "- [ ] "Selected works" text is misaligned on mobile. It should line up similarly as on desktop. Either on the left-hand side of the screen or in the center of the screen. I would prefer it to line up similarly as the previous headers on the site such as "The dev behind the code." and "Building robust systems.""

### Description

In mobile view, the "Selected Works" section heading is right-aligned due to `items-end` on a column flex container, which is inconsistent with the left-aligned section titles earlier on the page ("Building Robust Systems", "The Dev Behind The Code"). The mobile heading alignment should be left-aligned to match the site's overall layout.

### Acceptance Criteria

- [ ] "Selected Works" heading is left-aligned on mobile screens, matching preceding headings.
- [ ] Desktop alignment continues to display cleanly with heading on the left and subtitle on the right.
- [ ] Subtitle text aligns properly beneath the heading on mobile without awkward gaps.

### Technical Notes

- Key implementation details: Update container alignment from `items-end` to `items-start md:items-end`.
- Files likely to be modified: `src/App.tsx`.
- Patterns to follow: Consistent section header styling across the portfolio.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-8] Update showcase section subtitle text

**GitHub**: #9
**Type**: Enhancement
**GitHub Label**: enhancement
**Priority**: Low
**Complexity**: Small
**Phase**: Backlog
**Labels**: enhancement, frontend
**Source**: `TODO.md:8` — "- [ ] "A curated selection of my recent open-source and commercial projects." text has to be changed. Better would be "A curated selection of my recent projects."

### Description

The showcase section subtitle currently reads "A curated selection of my recent open-source and commercial projects." It should be updated to the cleaner, more concise phrase "A curated selection of my recent projects."

### Acceptance Criteria

- [ ] Subtitle text in `#work` section is updated to "A curated selection of my recent projects."
- [ ] Font size, boldness, and responsive styling are preserved.

### Technical Notes

- Key implementation details: Update string in paragraph element inside `#work` section.
- Files likely to be modified: `src/App.tsx`.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-9] Fix email link overflow and stack mail icon above address on mobile view

**GitHub**: #10
**Type**: Bug
**GitHub Label**: bug
**Priority**: Medium
**Complexity**: Small
**Phase**: Backlog
**Labels**: bug, frontend, mobile
**Source**: `TODO.md:9` — "- [ ] My email address gets truncated on mobile view which looks sloppy. Make the text ever so slightly smaller + make the mail glyph to be pushed on top of it on mobile view. On desktop I think it looks fine."

### Description

The email address link in the contact section gets truncated or breaks awkwardly on narrow mobile viewports. On mobile screens, the mail icon should be positioned above the email address, and the font size should be slightly reduced so the address fits comfortably without truncation.

### Acceptance Criteria

- [ ] Mail icon stacks vertically above the email address on mobile screens, and stays inline on desktop screens.
- [ ] Email address text size is reduced on mobile (e.g. `text-lg` or `text-xl` on mobile, `text-2xl` on desktop) to prevent truncation.
- [ ] Email link remains fully interactive with valid `mailto:` protocol and hover effects.

### Technical Notes

- Key implementation details: Update layout to `flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-lg sm:text-2xl`.
- Files likely to be modified: `src/features/contact/ContactForm.tsx`.
- Patterns to follow: Responsive Tailwind utilities.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-10] Update contact section heading to "Let's Build Something Awesome."

**GitHub**: #11
**Type**: Enhancement
**GitHub Label**: enhancement
**Priority**: Low
**Complexity**: Small
**Phase**: Backlog
**Labels**: enhancement, frontend
**Source**: `TODO.md:10` — "- [ ] Change text "Lets build something epic." to "Lets build something awesome.""

### Description

The contact section heading currently reads "Let's Build Something Epic." Change this text to "Let's Build Something Awesome." to match preferred portfolio copy.

### Acceptance Criteria

- [ ] Heading text in contact section is updated to "Let's Build Something Awesome."
- [ ] Orange accent styling on the final word (`<span className="text-[#ff3e00]">Awesome.</span>`) is maintained.
- [ ] Heading hierarchy, typography scale, and scroll animation classes remain unchanged.

### Technical Notes

- Key implementation details: Update heading text in `ContactForm.tsx:9`.
- Files likely to be modified: `src/features/contact/ContactForm.tsx`.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-11] Update contact section introductory paragraph copy

**GitHub**: #12
**Type**: Enhancement
**GitHub Label**: enhancement
**Priority**: Low
**Complexity**: Small
**Phase**: Backlog
**Labels**: enhancement, frontend
**Source**: `TODO.md:11` — "- [ ] Change the paragraph next to the mailing section from "I'm currently open to new opportunities, freelance projects, and open source collaborations. Drop a message if you want to chat." to "I'm currently open to new job offers! Drop a message and lets chat about it.""

### Description

Update the introductory paragraph next to the email contact area to specifically state availability for new job offers instead of general opportunities and freelance projects.

### Acceptance Criteria

- [ ] Contact paragraph text is changed to "I'm currently open to new job offers! Drop a message and lets chat about it."
- [ ] Text styling, font weight, and spacing remain consistent with the design system.

### Technical Notes

- Key implementation details: Update paragraph text in `ContactForm.tsx:15`.
- Files likely to be modified: `src/features/contact/ContactForm.tsx`.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-12] Fix "Download APK" button text alignment and wrapping in ProjectCard

**GitHub**: #13
**Type**: Bug
**GitHub Label**: bug
**Priority**: Medium
**Complexity**: Small
**Phase**: Backlog
**Labels**: bug, frontend
**Source**: `TODO.md:12` — "- [ ] "Download APK" text is misaligned. I have a hunch the text inside the box gets misaligned if it doesn't properly fit inside the box."

### Description

In the GymBro App project card, the "Download APK" action button text becomes misaligned when the container narrows or text doesn't fit neatly. The button styling needs to guarantee centered text alignment, proper line-height, and appropriate padding/whitespace behavior.

### Acceptance Criteria

- [ ] "Download APK" label is perfectly centered horizontally and vertically within its button.
- [ ] Button handles variable text lengths cleanly without overflowing or misaligning on smaller screens.
- [ ] Action buttons maintain consistent height and alignment across all project cards.

### Technical Notes

- Key implementation details: Ensure button container has `text-center`, `justify-center`, `items-center`, and appropriate padding/whitespace rules.
- Files likely to be modified: `src/features/showcase/ProjectCard.tsx`.
- Patterns to follow: Brutalist button layout and hover effects.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-13] Shorten project tags and refine GymBro App tech stack badges

**GitHub**: #14
**Type**: Enhancement
**GitHub Label**: enhancement
**Priority**: Low
**Complexity**: Small
**Phase**: Backlog
**Labels**: enhancement, frontend
**Source**: `TODO.md:13` — "- [ ] For the projects and their tags - I would prefer to not have long tag names. For example for GymBro App the tags should be: Angular, Ionic, Express, MongoDB."

### Description

Project tags currently include long descriptive labels such as "Angular + Ionic Frontend" and "Express REST API Backend". Shorten tags to clean, concise technology names (specifically: Angular, Ionic, Express, MongoDB for GymBro App) to make project cards cleaner and more readable.

### Acceptance Criteria

- [ ] GymBro App `techStack` updated to `['Angular', 'Ionic', 'Express', 'MongoDB']`.
- [ ] Other project tags in `PROJECTS` verified to ensure all tech badges are concise without redundant words.
- [ ] Badges wrap and display neatly inside `ProjectCard`.

### Technical Notes

- Key implementation details: Modify `techStack` array for GymBro App in `PROJECTS` constant.
- Files likely to be modified: `src/App.tsx`.
- Patterns to follow: Consistent tag styling with white background and black brutalist border.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-14] Align "2019 Coding Since" stat card text with surrounding cards

**GitHub**: #28
**Type**: Enhancement
**GitHub Label**: enhancement
**Priority**: Medium
**Complexity**: Small
**Phase**: Backlog
**Labels**: enhancement, frontend, mobile
**Source**: `TODO.md:14` — "- [ ] The text \"2019 coding since\" doesnt look good. It is centered unlike the other boxes texts around it. I would prefer if the text was aligned in similar fashion as the elements around it. Just make sure it looks good on mobile also."

### Description

In the About section, the text inside the yellow "2019 Coding Since" stat card is currently centered (`items-center text-center`), whereas the adjacent stat cards ("25 Public Repos" and "2000+ GitHub Contributions This Year") are left-aligned. Update the alignment of the 2019 stat card to match the surrounding cards consistently on desktop and mobile viewports.

### Acceptance Criteria

- [ ] "2019" and "Coding Since" text inside the yellow stat card are left-aligned to match the other stat cards.
- [ ] Text spacing, padding, and font sizes render cleanly without clipping or misaligning on mobile viewports.
- [ ] Visual harmony across all three stat cards is maintained on both desktop and mobile screens.

### Technical Notes

- Key implementation details: Adjust flex alignment and text alignment classes on the yellow card (`bg-[#facc15]`) in `src/App.tsx`, replacing `items-center text-center` with alignment matching adjacent cards (e.g., `flex flex-col justify-center`).
- Files likely to be modified: `src/App.tsx`.
- Patterns to follow: Consistent neo-brutalist styling with `brutal-border` and responsive padding.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-15] Make navbar brand logo text clickable to reload or scroll to top

**GitHub**: #29
**Type**: Feature
**GitHub Label**: enhancement
**Priority**: Medium
**Complexity**: Small
**Phase**: Backlog
**Labels**: enhancement, frontend
**Source**: `TODO.md:15` — "- [ ] Add the top bar \"laanhema.dev\" text as clickable, and it will be a link that redirects to # (reloads the page)."

### Description

The "laanhema.dev" brand title in the top navigation bar is currently a static `div`. It should be an interactive anchor link targeting `#` (or top of page) so clicking it redirects/scrolls to the top and reloads the view.

### Acceptance Criteria

- [ ] The "laanhema.dev" brand text in the top navigation bar is wrapped in or converted to an accessible clickable link targeting `#`.
- [ ] Clicking the link smoothly scrolls or navigates to the top of the page.
- [ ] Neo-brutalist styling, typography size, uppercase styling, and orange period accent (`text-[#ff3e00]`) remain visually intact.
- [ ] Hover and focus states feel responsive and consistent with other navbar elements.

### Technical Notes

- Key implementation details: Change the `div` containing `laanhema.dev` in `src/features/navigation/Nav.tsx` to an anchor (`<a>`) tag with `href="#"`.
- Files likely to be modified: `src/features/navigation/Nav.tsx`.
- Patterns to follow: Retain sticky navbar styling and brutalist font hierarchy.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-16] Add blog post button link to selected project cards

**GitHub**: #30
**Type**: Feature
**GitHub Label**: enhancement
**Priority**: Medium
**Complexity**: Medium
**Phase**: Backlog
**Labels**: enhancement, frontend
**Source**: `TODO.md:16` — "- [ ] I would like to add a button to the selected projects that will take to a blog post where I could tell more about the project. I haven't documented my own thoughts and learning experiences about these projects anywhere so that would be super valuable, way more valuable than just listing them here. This might potentially mean some big changes."

### Description

Currently, project cards in the showcase section only provide links to "Code" (GitHub repo) and "Live Demo". Add support for an optional blog post / case study button that links to an external or dedicated writeup where the developer shares learning experiences, architectural thoughts, and project context.

### Acceptance Criteria

- [ ] `ProjectCardProps` interface supports an optional `articleUrl` or `postUrl` (and optional label like "Read Post" / "Article").
- [ ] When a post URL is provided, an interactive button renders alongside "Code" and "Live Demo" buttons.
- [ ] Action buttons wrap and align cleanly on narrow mobile screens (320px–375px) as well as desktop viewports without overflowing or breaking layout.
- [ ] Button styling conforms to the neo-brutalist design language (`brutal-border`, `brutal-shadow`, high-contrast styling).
- [ ] External post links open safely with `target="_blank"` and `rel="noopener noreferrer"`.

### Technical Notes

- Key implementation details: Extend `ProjectCardProps` in `src/features/showcase/ProjectCard.tsx` with an optional blog/post URL property, add the button UI, and update project data in `src/App.tsx`.
- Files likely to be modified: `src/features/showcase/ProjectCard.tsx`, `src/App.tsx`.
- Patterns to follow: Mobile-first responsive flex/grid button container to prevent wrapping issues when up to three buttons are present on a card.

### Dependencies

- Blocked by: None
- Blocks: None

---

## [TODO-17] Fix website defaulting to #work hash on page refresh

**GitHub**: #31
**Type**: Bug
**GitHub Label**: bug
**Priority**: Medium
**Complexity**: Small
**Phase**: Backlog
**Labels**: bug, frontend
**Source**: `TODO.md:17` — "- [ ] Why does the website default to refresh to url laanhema.dev/#work always. This is annoying."

### Description

When navigating the website, clicking anchor links like "View Work" or "Work" appends `#work` to the browser URL. When the user subsequently refreshes the page, the browser retains `#work` in the address bar and auto-scrolls down to the `#work` section instead of loading from the top hero section. Investigate and resolve this behavior so page reloads land cleanly at the top of the site or handle hash navigation without sticky scrolling.

### Acceptance Criteria

- [ ] Identify root cause of why page refresh defaults to or maintains `#work` hash.
- [ ] Ensure refreshing the page loads at the top of the website (hero section) unless the user explicitly navigates directly with a hash.
- [ ] In-page smooth scrolling to `#work`, `#about`, and `#contact` continues to function properly when clicking navigation and hero buttons.
- [ ] Browser history and back/forward navigation behavior remain predictable and clean.

### Technical Notes

- Key implementation details: Check window scroll restoration (`history.scrollRestoration = 'manual'`), clean hash behavior upon refresh or reload (e.g. stripping or resetting hash on fresh loads / `beforeunload` or on mount), or replacing hash state with `history.replaceState` when appropriate.
- Files likely to be modified: `src/App.tsx`, `src/features/navigation/Nav.tsx`, `index.html`.
- Patterns to follow: Preserve standard anchor navigation while preventing unwanted persistent hash locks across browser reloads.
- Assumptions made: The user wants refreshing the page to show the top hero section rather than jumping straight to `#work`.

### Dependencies

- Blocked by: None
- Blocks: None

---

# Stories from .agents/plans/add-blog-page-plan.md

- **Source File**: `.agents/plans/add-blog-page-plan.md`
- **Generated Date**: 2026-10-03
- **Repository**: `laanhema/swe-portfolio-website-2`

### Skipped Tasks
- None (all 10 plan tasks from `add-blog-page-plan.md` mapped to issues TODO-18 through TODO-27).

---

## [TODO-18] Add design tokens and .brutal-prose typography styles to global.css

**GitHub**: #35
**Type**: Technical
**GitHub Label**: technical
**Priority**: High
**Complexity**: Small
**Phase**: Blog Foundation
**Labels**: technical, frontend
**Source**: `.agents/plans/add-blog-page-plan.md:148` — "Task 1: Add Design Tokens and `.brutal-prose` to `src/styles/global.css`"

### Description

Add missing `@theme` color tokens (`--color-accent-cyan`, `--color-accent-yellow`, `--color-accent-purple`) and integrate the complete `.brutal-prose` typography styling layer into `src/styles/global.css` so that blog posts, markdown formatting, headings, code blocks, tables, and blockquotes render in the neo-brutalist style.

### Acceptance Criteria

- [ ] `--color-accent-cyan: #00e5ff`, `--color-accent-yellow: #facc15`, and `--color-accent-purple: #a855f7` are added to the `@theme` block in `src/styles/global.css`.
- [ ] `.brutal-prose` component styles are copied directly from `.agents/design-system/laanhema-design-system/styles/brutal-prose.css` into the `@layer components` section.
- [ ] Headings, blockquotes, inline code, preformatted code blocks, tables, and links within `.brutal-prose` conform to the design system specification.
- [ ] `npm run build` compiles without CSS or Tailwind v4 syntax errors.

### Technical Notes

- Files to modify: `src/styles/global.css`.
- Reference: `.agents/design-system/laanhema-design-system/styles/brutal-prose.css:1-23`.
- Tailwind v4 uses `@theme` and `@layer components`. Ensure `@apply` directives work cleanly with existing `@theme` definitions.

### Dependencies

- Blocked by: None
- Blocks: #38 ([TODO-21]), #40 ([TODO-23])

---

## [TODO-19] Install react-router and configure GitHub Pages SPA redirection

**GitHub**: #36
**Type**: Technical
**GitHub Label**: technical
**Priority**: High
**Complexity**: Small
**Phase**: Blog Foundation
**Labels**: technical, frontend
**Source**: `.agents/plans/add-blog-page-plan.md:163` — "Task 2: Install `react-router` and Configure GitHub Pages SPA Redirection"

### Description

Install `react-router` for client-side routing and implement the standard GitHub Pages single-page application redirect mechanism (`public/404.html` and `index.html` restoration script) to support direct deep link loading and browser refreshes on subpaths like `/blog` and `/blog/:slug`.

### Acceptance Criteria

- [ ] `react-router` is added to `dependencies` in `package.json` and cleanly installed.
- [ ] `public/404.html` is created with a redirection script that stores the requested path in `sessionStorage` (or query string) and redirects to `/`.
- [ ] `index.html` includes a lightweight restoration script in `<head>` that parses the redirect and restores browser history to the requested deep route.
- [ ] `npm run build` builds the client application and includes `404.html` in the Vite production output.

### Technical Notes

- Files to modify/create: `package.json`, `public/404.html`, `index.html`.
- Pattern: Standard GitHub Pages SPA single-page routing pattern.
- Ensure script does not break local dev server HMR or Vite preview.

### Dependencies

- Blocked by: None
- Blocks: #39 ([TODO-22]), #40 ([TODO-23]), #41 ([TODO-24]), #43 ([TODO-26])

---

## [TODO-20] Create blog data models and initial project post entries

**GitHub**: #37
**Type**: Feature
**GitHub Label**: enhancement
**Priority**: High
**Complexity**: Medium
**Phase**: Blog Content & Components
**Labels**: enhancement, frontend
**Source**: `.agents/plans/add-blog-page-plan.md:174` — "Task 3: Create Blog Data Models and Initial 4 Project Posts"

### Description

Define TypeScript interfaces for blog articles and author the initial four technical devlogs for the featured projects (GymBro App, Tralla, Froots Smoothie App, Distill Design Scraper) covering technical choices, architecture decisions, and lessons learned.

### Acceptance Criteria

- [ ] `src/features/blog/types.ts` defines and exports the `BlogPost` interface (`slug`, `projectTitle`, `title`, `titleHighlight`, `summary`, `author`, `date`, `displayDate`, `readingTime`, `excerpt`, `tags`, `accentColor`, `content`).
- [ ] `src/features/blog/data/posts.ts` defines and exports `BLOG_POSTS: BlogPost[]` containing all 4 featured devlogs.
- [ ] Each post includes rich, formatted content (sections, code snippets, lists, quotes) reflecting authentic engineering details.
- [ ] `npm run lint` and `npm run build` pass with zero type errors.

### Technical Notes

- Files to create: `src/features/blog/types.ts`, `src/features/blog/data/posts.ts`.
- Project slugs: `gymbro-app`, `tralla`, `froots-smoothie-app`, `distill-design-scraper`.
- Reference: `.agents/design-system/laanhema-design-system/components/BlogIndex/preview.html:17-32`.

### Dependencies

- Blocked by: None
- Blocks: #39 ([TODO-22]), #40 ([TODO-23]), #42 ([TODO-25])

---

## [TODO-21] Create reusable PostCard and ArticleHeader components

**GitHub**: #38
**Type**: Feature
**GitHub Label**: enhancement
**Priority**: Medium
**Complexity**: Medium
**Phase**: Blog Content & Components
**Labels**: enhancement, frontend
**Source**: `.agents/plans/add-blog-page-plan.md:188` — "Task 4: Create Reusable `PostCard` and `ArticleHeader` Components"

### Description

Implement reusable presentational components for the blog: `PostCard` for previewing articles within grids with tags, date, and reading time, and `ArticleHeader` for individual post pages with breadcrumbs, uppercase titles with colored emphasis, byline, and lede quote callout.

### Acceptance Criteria

- [ ] `PostCard.tsx` renders article date, reading time, linked title, excerpt, and tech badges in neo-brutalist cards with `.brutal-shadow-hover`.
- [ ] `PostCard` supports custom background color props (cyan `#00e5ff` for featured card, white for standard).
- [ ] `ArticleHeader.tsx` renders `← All posts` link back to `/blog`, topic tags, responsive H1 with highlighted phrase, author byline with date/reading time, and thick-bordered lede quote.
- [ ] All components conform to `.agents/design-system/laanhema-design-system/components/PostCard/README.md` and `BlogArticle/preview.html`.

### Technical Notes

- Files to create: `src/features/blog/components/PostCard.tsx`, `src/features/blog/components/ArticleHeader.tsx`.
- Use React Router `Link` for internal navigation without full page reload.

### Dependencies

- Blocked by: #35 ([TODO-18])
- Blocks: #39 ([TODO-22]), #40 ([TODO-23])

---

## [TODO-22] Build BlogIndex page with Field Notes header and staggered post grid

**GitHub**: #39
**Type**: Feature
**GitHub Label**: enhancement
**Priority**: Medium
**Complexity**: Medium
**Phase**: Blog Pages
**Labels**: enhancement, frontend
**Source**: `.agents/plans/add-blog-page-plan.md:208` — "Task 5: Build `BlogIndex.tsx` Page"

### Description

Build the main blog index route (`/blog`) featuring the "Field Notes." section display heading, a 2-column staggered card layout, sticky navigation bar, and GSAP scroll entrance animations.

### Acceptance Criteria

- [ ] `BlogIndex.tsx` renders the "Field Notes." H1 header with accent styling and descriptive subtitle.
- [ ] Posts are mapped into a 2-column grid (`grid md:grid-cols-2 gap-10`) with odd-numbered cards offset via `md:translate-y-16`.
- [ ] The first card is styled with the featured cyan accent fill (`#00e5ff`) and subsequent cards use white backgrounds.
- [ ] Navigation bar and footer are present, and `useGsapAnimations()` is mounted.

### Technical Notes

- Files to create: `src/features/blog/BlogIndex.tsx`.
- Reference: `.agents/design-system/laanhema-design-system/components/BlogIndex/preview.html`.
- Ensure window scroll resets to top on initial page load.

### Dependencies

- Blocked by: #36 ([TODO-19]), #37 ([TODO-20]), #38 ([TODO-21])
- Blocks: #43 ([TODO-26])

---

## [TODO-23] Build BlogPost article page replicating design system preview

**GitHub**: #40
**Type**: Feature
**GitHub Label**: enhancement
**Priority**: Medium
**Complexity**: Medium
**Phase**: Blog Pages
**Labels**: enhancement, frontend
**Source**: `.agents/plans/add-blog-page-plan.md:222` — "Task 6: Build `BlogPost.tsx` Page (1:1 with `BlogArticle/preview.html`)"

### Description

Build the dynamic individual blog article route (`/blog/:slug`) replicating `BlogArticle/preview.html` 1:1, rendering the article header, `.brutal-prose` formatted body content, a brutalist 404 state for unknown slugs, and seamlessly transitioning into the Contact section.

### Acceptance Criteria

- [ ] `BlogPost.tsx` retrieves the post slug from route params using `useParams()` and matches it against `BLOG_POSTS`.
- [ ] Non-existent slugs render an accessible brutalist "Post Not Found" fallback with a button back to `/blog`.
- [ ] Article renders `ArticleHeader`, followed by `.brutal-prose` body content enclosed in `<div className="max-w-4xl mx-auto">`.
- [ ] Page smoothly concludes with `<ContactForm />` and the site footer.
- [ ] Page mounts `useGsapAnimations()` and resets window scroll to top on route change.

### Technical Notes

- Files to create: `src/features/blog/BlogPost.tsx`.
- Reference: `.agents/design-system/laanhema-design-system/components/BlogArticle/preview.html:1-60`.
- Content should support headings, code blocks, lists, and quotes formatted with `.brutal-prose`.

### Dependencies

- Blocked by: #35 ([TODO-18]), #36 ([TODO-19]), #37 ([TODO-20]), #38 ([TODO-21])
- Blocks: #43 ([TODO-26])

---

## [TODO-24] Add Blog link to navigation bar and support cross-page anchor routing

**GitHub**: #41
**Type**: Feature
**GitHub Label**: enhancement
**Priority**: Medium
**Complexity**: Small
**Phase**: Navigation & Integration
**Labels**: enhancement, frontend, mobile
**Source**: `.agents/plans/add-blog-page-plan.md:239` — "Task 7: Update `src/features/navigation/Nav.tsx`"

### Description

Update `Nav.tsx` to insert a "Blog" link between "About" and "Contact" in both desktop and mobile drawer menus, update the brand logo to navigate to `/`, and implement path-aware anchor routing so clicking "Work" or "About" from `/blog` navigates back to `/#work` and `/#about`.

### Acceptance Criteria

- [ ] "Blog" appears between "About" and "Contact" in desktop navigation and in the mobile drawer menu.
- [ ] Brand logo `laanhema.dev` links to `/` and scrolls to top.
- [ ] On `/`, navigation links target `#work`, `#about`, `/blog`, `#contact`.
- [ ] On `/blog` or `/blog/:slug`, navigation links target `/#work`, `/#about`, `/blog`, `/#contact` using `useLocation()` detection.
- [ ] Mobile drawer automatically closes when any link is selected.

### Technical Notes

- Files to modify: `src/features/navigation/Nav.tsx`.
- Use React Router `Link` or path detection via `useLocation()`.
- Maintain brutalist styling and hover underlines.

### Dependencies

- Blocked by: #36 ([TODO-19])
- Blocks: #43 ([TODO-26])

---

## [TODO-25] Update ProjectCard to 2-button layout with Code and Read Story links

**GitHub**: #42
**Type**: Feature
**GitHub Label**: enhancement
**Priority**: Medium
**Complexity**: Small
**Phase**: Navigation & Integration
**Labels**: enhancement, frontend, mobile
**Source**: `.agents/plans/add-blog-page-plan.md:252` — "Task 8: Update `ProjectCard.tsx` to 2-Button Layout (\"Code\" + \"Read Story\")"

### Description

Refactor `ProjectCard.tsx` action buttons from "Code" + "Live Demo" to a standardized 2-button layout ("Code" linking to GitHub repo, "Read Story" linking to `/blog/:slug`), and update project datasets to pass `postSlug`.

### Acceptance Criteria

- [ ] `ProjectCardProps` replaces `liveUrl` and `liveLabel` with `postSlug?: string`.
- [ ] "Code" button links externally to GitHub repository with GitHub icon and opens in a new tab.
- [ ] "Read Story" button links internally to `/blog/${postSlug}` using React Router navigation.
- [ ] Buttons sit side-by-side using `flex-1` and do not wrap or overflow on narrow mobile screens (320px–375px).
- [ ] `PROJECTS` in `src/App.tsx` is updated with corresponding slugs for all four projects.

### Technical Notes

- Files to modify: `src/features/showcase/ProjectCard.tsx`, `src/App.tsx`.
- Slugs: `gymbro-app`, `tralla`, `froots-smoothie-app`, `distill-design-scraper`.

### Dependencies

- Blocked by: #37 ([TODO-20])
- Blocks: #43 ([TODO-26])

---

## [TODO-26] Configure React Router in App.tsx and extract HomePage component

**GitHub**: #43
**Type**: Feature
**GitHub Label**: enhancement
**Priority**: Medium
**Complexity**: Medium
**Phase**: Navigation & Integration
**Labels**: enhancement, frontend
**Source**: `.agents/plans/add-blog-page-plan.md:264` — "Task 9: Configure React Router in `src/App.tsx` and Extract `HomePage`"

### Description

Configure declarative client-side routing in `App.tsx` using React Router, extract the existing landing page into a dedicated `HomePage` component, and mount routes for `/`, `/blog`, and `/blog/:slug`.

### Acceptance Criteria

- [ ] Application is wrapped in React Router (`BrowserRouter` or route provider).
- [ ] Existing landing page content (hero, about, selected works, contact, footer) is cleanly organized as `HomePage`.
- [ ] Routes are declared for `/` (`HomePage`), `/blog` (`BlogIndex`), and `/blog/:slug` (`BlogPost`).
- [ ] Hash navigation behavior (`#work`, `#about`, `#contact`) smoothly functions across route transitions.

### Technical Notes

- Files to modify: `src/App.tsx`.
- Ensure reload scroll behavior and `useGsapAnimations` are appropriately initialized.

### Dependencies

- Blocked by: #36 ([TODO-19]), #39 ([TODO-22]), #40 ([TODO-23]), #41 ([TODO-24]), #42 ([TODO-25])
- Blocks: #44 ([TODO-27])

---

## [TODO-27] Run full build and lint validation for blog feature

**GitHub**: #44
**Type**: Technical
**GitHub Label**: technical
**Priority**: Low
**Complexity**: Small
**Phase**: Quality Assurance
**Labels**: technical
**Source**: `.agents/plans/add-blog-page-plan.md:278` — "Task 10: Run Full Build and Lint Validation"

### Description

Run full TypeScript compilation, ESLint check, and Vite production bundle build to verify zero errors, clean type resolution, and successful generation of all production assets and SPA fallback files.

### Acceptance Criteria

- [ ] `npm run lint` passes with 0 warnings and 0 errors.
- [ ] `npm run build` succeeds with 0 TypeScript compiler errors.
- [ ] Vite production bundle output in `dist/` contains valid bundles and `404.html`.

### Technical Notes

- Validate with `npm run lint && npm run build`.
- Ensure all imported types, hooks, and routing packages resolve cleanly.

### Dependencies

- Blocked by: #43 ([TODO-26])
- Blocks: None


