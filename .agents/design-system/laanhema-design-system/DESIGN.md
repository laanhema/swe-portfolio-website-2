The neo-brutalist look of **laanhema.dev** as it ships today: thick ink borders, hard offset shadows, heavy uppercase Noto Sans, flat colour blocks and square corners. Every value here comes from `src/styles/global.css` and the components in `laanhema/swe-portfolio-website-2`. Use it to keep new pages (blog, case studies) consistent with the one-pager.

## The five signature moves

Every new element should use at least the first three:

1. **A 4px ink border.** `.brutal-border` (`border-4 border-text-primary`, the `border-4` token in `text-primary`) goes on every card, button, tag, input and image.
2. **A hard offset shadow.** `.brutal-shadow` (`shadow-brutal`: 6px 6px, no blur, `text-primary`) goes on anything you can click or anything that's a card. Shadows are never blurred and never coloured.
3. **Bold uppercase type.** Headings, buttons, labels, tags and nav are `font-bold uppercase` in Noto Sans. Display headings also get `tracking-tighter` and tight leading.
4. **Flat saturated fills.** Use `accent`, `accent-cyan`, `accent-yellow` or `accent-purple` as whole-block backgrounds with ink text on top. No gradients and no tints, except the two blurred blobs behind the hero.
5. **Square corners.** Use `radius-none` everywhere. `rounded-full` is only for the hero blobs.

## Content fundamentals

- **Voice.** First person, confident and plain: "I've been coding since 2019…", "Drop a message if you want to chat." Address the reader as "you" only in calls to action.
- **Headings** are short, uppercase and **end with a period**: "Building Robust Systems.", "The Dev Behind The Code.", "Selected Works.", "Let's Build Something Epic." Break them over 2–3 lines with `<br />`.
- **Highlight one word per heading.** Use `text-[#ff3e00]` on light grounds, `text-[#00e5ff]` on the dark band, or the outlined `text-transparent text-stroke-robust` in the hero only. Never highlight two words.
- **Paragraphs** are sentence case and `font-medium`, never uppercase.
- **Buttons and labels** are 1–2 uppercase words: "View Work", "Code", "Live Demo", "Download APK", "Send Message".
- **Numbers** are set big and bare: "2019", "25", "2000+". The caption goes underneath in uppercase.
- No emoji, no exclamation marks.

## Colour

- `bg-primary` (#f8f9fa) is the page canvas. `text-primary` (#121212) is all text, all borders, all shadows and the dark bands. `white` (#ffffff) is for raised elements: the contact section, tags, icon buttons and focused inputs.
- **Section grounds alternate.** The order is canvas (hero), ink band (About), canvas (Work), white (Contact), ink (footer). Each seam gets a 4px border: `border-y-4`, `border-t-4`, and a white `border-t-4` on the footer.
- **Accent rotation for card fills.** Use `accent` → `accent-cyan` → `accent-yellow` → `accent-purple`, in showcase order, and repeat the cycle for more items. Text on any fill is `text-primary`.
- **`accent` as text** is only for words 24px or larger, or 19px bold or larger. It reads at 3.35:1 on `bg-primary` and 3.53:1 on `white`. For smaller links, use ink text with an accent underline (`decoration-[#ff3e00]`), not orange text.
- The hero's cyan and orange blobs use `blur-[120px]`/`blur-[150px]` at `opacity-20` behind the content (`-z-10`). They are the only soft element. Don't add more.

### Known contrast misses (kept as shipped)

- **Nav and footer link hover** (`hover:text-[#ff3e00]`) at 18px bold: 3.35:1 on the canvas, below AA. On the footer's ink ground it reads 5.3:1, which passes.
- **The mobile "Menu" button**: a white 16px bold label on `accent` reads 3.53:1, below AA. "Send Message" passes because it is 20px bold (large text).
- **The contact email link hover** at the mobile size (18px): 3.53:1.
- **The fix, if you want it:** use `text-[#121212]` on an `accent` fill (5.3:1), and switch link hovers to an accent underline instead of accent text.

## Typography

- **One family.** The site uses only Noto Sans Variable (`@fontsource-variable/noto-sans`, weights 100–900) at weights `500` (`font-medium`) and `700` (`font-bold`). Nothing else.
- Use the type scale under Typography. Each style's usage note gives the exact Tailwind classes and the responsive steps:
  - **Display:** `display-hero` 60→96→128px with leading 0.85; `display-section` 60→96px; `heading-section` 48→72px; `heading-card` 30→36px.
  - **Text:** `eyebrow`, `lede`, `body-lg`, `body`, `button-lg`, `button`, `tag`, `stat-label`.
- **Display headings** are always `font-bold uppercase` with `tracking-tighter`, plus `leading-[0.85]` for the hero.
- **Mono (blog addition).** Code uses Tailwind's `font-mono` system stack (`code` style). No mono web font is loaded.

## Borders, shadows and states

- **Rest:** `brutal-border brutal-shadow` (6px shadow).
- **Hover, large buttons and icon buttons:** `brutal-shadow-hover` lifts the element `translate(-3px,-3px)`. The shadow stays.
- **Hover, card buttons:** `hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#121212]` (`shadow-brutal-press`). The button slides toward its shadow.
- **Press:** `.brutal-shadow:active` moves `translate(6px,6px)` with no shadow, so the element sits in its own shadow. The mobile menu uses a smaller press: `active:translate-x-1 active:translate-y-1 active:shadow-none`.
- **Focus (inputs):** `focus:outline-none focus:bg-white focus:brutal-shadow`. Links and buttons rely on the browser's default focus ring. Don't remove it.
- **Nav link hover:** a 4px `accent` bar grows from 0 to full width under the link (`h-1 w-0 → group-hover:w-full`).
- Transitions are 0.1s ease on shadows and Tailwind's default 150ms on colours and transforms.

## Layout

- **Gutters:** `px-6` on mobile, `md:px-12` from 768px up.
- **Content width:** `max-w-6xl mx-auto` (`container`, 1152px). Contact and the blog article use `max-w-4xl` (896px). The hero text column uses `max-w-5xl`.
- **Section padding:** `py-24` for About and Contact, `py-32` for Work. The hero is `min-h-[85vh]`, vertically centred.
- **Grids** go two-up from `md`. Project cards use `gap-10`, and every second card is staggered with `md:translate-y-16`. The stat tiles stagger too (`translate-y-8`, `mt-8`).
- **Breakpoints:** `md` 768px (two columns, desktop nav), `lg` 1024px (128px hero type), `xl` 1280px (hero portrait beside the text at 34% width).

## Motion

- Anything with `.animate-on-scroll` gets one GSAP ScrollTrigger reveal (`useGsapAnimations`): from `y: 50, opacity: 0` to `y: 0, opacity: 1`, `duration: 0.8`, `ease: 'power3.out'`, starting at `top 85%`, `toggleActions: 'play none none reverse'`.
- **On a new page:** add `animate-on-scroll` to each heading, paragraph group, grid and card, and call `useGsapAnimations()` once in the page component.
- Not yet done: `prefers-reduced-motion` (the PRD asks for it). Wrap the hook's body in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`.

## Imagery

- The only photo is the portrait (**Photography**). It is shown 2:3, `object-cover`, with `brutal-border brutal-shadow` on a `bg-[#121212]` placeholder.
- **Images in posts** follow the same rule: full width, a 4px border and a 6px shadow, with an uppercase bold caption underneath. No rounded corners and no drop-shadow blur.

## Iconography

- There are four Lucide-style stroke icons, copied exactly from `src/components/Icons.tsx` (**Icons**): GitHub, Twitter, LinkedIn and Mail. They use a 24px grid, a 2px stroke, round caps and joins, and `stroke="currentColor"`.
- **Sizes:** 24px in social buttons (inside `p-4` white brutal boxes), 20px (`w-5 h-5`) in the card Code button, and 32px (`w-8 h-8`) beside the contact email.
- For new icons, use Lucide at the same 2px stroke. No filled icons and no emoji.

## Logo

- There's no logo mark. The wordmark is type: `laanhema<span class="text-[#ff3e00]">.</span>dev`, set in `logo` style (`font-bold uppercase tracking-tighter`).
- The footer currently reads "Dev.Portfolio" in the same treatment. Consider changing it to the domain so the brand is consistent.
- `public/favicon.svg` is still Vite's default lightning mark, not a brand asset. A square of `accent` with an ink "L" in a 4px border would match the system.

## Not synced

- **Fonts:** only the Latin subset of Noto Sans Variable is included. The site also loads the Cyrillic, Greek and Latin-ext subsets through fontsource.
- **Unused file:** `src/index.css` is Vite's starter stylesheet with its own tokens (`--accent: #aa3bff` and others). It isn't imported by `main.tsx`, so it's left out. It's safe to delete from the repo.
- **Components:** they are hand-written static renditions of `Nav.tsx`, `ProjectCard.tsx`, `ContactForm.tsx` and the sections in `App.tsx`. They use the same Tailwind class strings, compiled into `components/bundle.css`. The React components themselves weren't built or run.
- **Blog components:** PostCard, ArticleHeader, Prose, BlogIndex and BlogArticle are **additions**. They are composed only from the moves above. See **Building new pages**.
