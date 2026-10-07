# Building new pages

How to add a page, such as a blog, case studies or a uses page, without drifting from the one-pager. Use the blog as the worked example. The **BlogIndex** and **BlogArticle** previews show the result.

## Checklist for any new page

- [ ] The page starts with **NavBar**, unchanged, and ends with **Footer**. Add the new link (for example "Blog") to both desktop and mobile nav. On sub-pages, anchors become `/#work`, `/#about`, `/#contact`.
- [ ] The first heading is a display heading (`text-6xl md:text-8xl font-bold uppercase tracking-tighter`) that ends with a period and has one `text-[#ff3e00]` word.
- [ ] Content sits in `px-6 md:px-12` and `max-w-6xl mx-auto` for lists, or `max-w-4xl` for reading.
- [ ] Every card and every image has `brutal-border brutal-shadow`. Every clickable box also has `brutal-shadow-hover`.
- [ ] Card fills follow the accent rotation (`#ff3e00` → `#00e5ff` → `#facc15` → `#a855f7`), or use white for the quieter list items.
- [ ] Section seams get `border-y-4` / `border-t-4` in ink. At most one dark (`bg-[#121212] text-white`) band per page, plus the footer.
- [ ] Blocks that should reveal get `animate-on-scroll`, and the page calls `useGsapAnimations()`.
- [ ] Small links are ink text with an accent underline, not orange text.

## Blog index (`/blog`)

- **Header:** use the SectionHeading pattern as the page `h1` (for example "Field <br/> <span class='text-[#ff3e00]'>Notes.</span>"), with a one-line `max-w-sm text-xl font-bold` subtitle on the right.
- **List:** **PostCard**s in `grid md:grid-cols-2 gap-10`, with every second card staggered (`md:translate-y-16`) like the showcase.
- The newest post is **featured**: it uses an accent fill (rotate per post). Older posts use white fills.
- PostCard anatomy:
  - a meta row: `<time>` / reading time, `text-sm font-bold uppercase tracking-wider`
  - a title in `heading-card` style, linked
  - an excerpt in `text-lg font-medium leading-relaxed`
  - topic tags, reusing **TechTag** exactly
- The whole card lifts on hover with `brutal-shadow-hover`.

## Blog post (`/blog/:slug`)

- **ArticleHeader**, in `max-w-4xl`, top to bottom:
  - a "← All posts" back link (bold uppercase, accent underline on hover)
  - topic tags
  - the `h1` (`text-5xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tighter`, last word or phrase in accent)
  - a byline row (author / date / reading time)
  - a summary in the hero lede treatment: `text-xl md:text-2xl font-medium border-l-8 border-[#ff3e00] pl-6`
- **Body:** wrap the rendered Markdown/MDX in `<div class="brutal-prose">`. It styles plain HTML (h2, h3, p, a, lists, code, pre, blockquote, table, figure, hr), so posts need no per-element classes.
- **End of post:** reuse **ContactSection** as the call to action, then the Footer.

## `.brutal-prose`: paste into `src/styles/global.css`

```css
@layer components {
  .brutal-prose { @apply max-w-3xl text-lg md:text-xl leading-relaxed font-medium; }
  .brutal-prose > * + * { @apply mt-6; }
  .brutal-prose h2 { @apply mt-16 text-3xl md:text-4xl font-bold uppercase leading-tight tracking-tight; }
  .brutal-prose h3 { @apply mt-12 text-2xl font-bold uppercase tracking-tight; }
  .brutal-prose h2 + *, .brutal-prose h3 + * { @apply mt-4; }
  .brutal-prose a { @apply font-bold underline decoration-4 underline-offset-4 decoration-accent hover:bg-[#facc15]; }
  .brutal-prose strong { @apply font-bold; }
  .brutal-prose ul { @apply list-[square] pl-6 marker:text-accent; }
  .brutal-prose ol { @apply list-decimal pl-6 marker:font-bold; }
  .brutal-prose li + li { @apply mt-2; }
  .brutal-prose blockquote { @apply border-l-8 border-accent pl-6 text-2xl font-bold leading-snug; }
  .brutal-prose :not(pre) > code { @apply font-mono text-[0.85em] bg-white border-2 border-text-primary px-1.5 py-0.5; }
  .brutal-prose pre { @apply border-4 border-text-primary shadow-brutal bg-text-primary text-white p-6 overflow-x-auto font-mono text-[15px] leading-[1.7] font-normal; }
  .brutal-prose hr { @apply border-0 border-t-4 border-text-primary my-16; }
  .brutal-prose figure img { @apply border-4 border-text-primary shadow-brutal w-full; }
  .brutal-prose figcaption { @apply mt-4 text-sm font-bold uppercase tracking-wider; }
  .brutal-prose table { @apply w-full border-4 border-text-primary text-base; }
  .brutal-prose th { @apply bg-text-primary text-white uppercase text-left font-bold p-3; }
  .brutal-prose td { @apply border-t-2 border-text-primary p-3; }
  .brutal-prose thead { @apply max-md:sr-only; }
  .brutal-prose :is(table, tbody, tr, td) { @apply max-md:block; }
  .brutal-prose td { @apply max-md:border-t-0; }
  .brutal-prose td:first-child { @apply max-md:bg-text-primary max-md:text-white max-md:uppercase; }
  .brutal-prose td + td + td { @apply max-md:pt-0; }
}
```

- The body is 18px, then 20px from `md`, at `font-medium`, with a max line length of `max-w-3xl` (about 70 characters).
- **h2** reuses the card-title style. **h3** is one step smaller. Both are uppercase bold.
- **Links:** bold ink text with a 4px `accent` underline. On hover they get a yellow highlight block.
- **Lists:** square markers in `accent`.
- **Blockquote:** the hero lede bar (`border-l-8` accent) with 24px bold text.
- **Inline code:** white with a 2px ink border. **Code blocks:** ink panels with a 4px border and a 6px shadow, like the About band turned into a card.
- **Tables:** a 4px frame and an ink header row with white uppercase labels. Below `md`, each row stacks into a block led by its first cell as an ink bar, and the header row is visually hidden. A three-column table cannot fit a 272px to 327px column without breaking words.
- **Figures:** bordered and shadowed images with an uppercase caption.

## Code highlighting

Code blocks are `#121212` with white text. Map a highlighter theme (Shiki, Prism) to the brand accents. All of these pass AA on ink:

| Token | Colour | Contrast on #121212 |
|---|---|---|
| keywords, operators | `#ff3e00` | 5.3:1 |
| functions, tags | `#00e5ff` | 12.2:1 |
| types, numbers, constants | `#facc15` | 12.2:1 |
| strings | `#a855f7` | 4.7:1 |
| plain text, punctuation | `#ffffff` | 18.7:1 |
| comments | `#f8f9fa` at 60% opacity | ≈ 7:1 |

## Optional tidy-up before the blog grows

- Promote the literal accent hexes to `@theme` so new code can write `bg-accent-cyan` instead of `bg-[#00e5ff]`. The PRD already names them:

```css
@theme {
  --color-accent-cyan: #00e5ff;
  --color-accent-yellow: #facc15;
  --color-accent-purple: #a855f7;
}
```

- Turn the repeated class strings into `@utility` rules (Tailwind v4) or small React components:
  - `btn-primary` (the View Work string)
  - `btn-card` (Code)
  - `tag` (the TechTag string)
  - `card` (`brutal-border brutal-shadow p-6 md:p-8 flex flex-col`)
