# Stories from TODO.md

- **Source File**: `TODO.md`
- **Generated Date**: 2026-10-02
- **Repository**: `laanhema/swe-portfolio-website-2`

### Skipped Tasks
_None. All 13 items in TODO.md were open tasks and have been converted to issues._

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
