# laanhema.dev design system

This package documents the neo-brutalist look that laanhema.dev already has. Your site doesn't need to "install" it, because the site *is* this design. Use it as the reference whenever you add something new, such as a blog, so the new parts match the existing ones.

## What's inside

| Path | What it is |
|---|---|
| `index.html` | Open in a browser to browse every component preview. |
| `DESIGN.md` | The brand book: signature moves, writing rules, colour, type, states, layout, motion, known contrast issues. |
| `BUILDING-PAGES.md` | Checklist for new pages, plus the blog list and post layouts. |
| `tokens.json` | Every value (colours, type scale, spacing, borders, shadows, breakpoints), with notes on where each one is used. |
| `styles/tokens.css` | The same values as CSS variables, plus the Noto Sans `@font-face`. |
| `styles/brutal-prose.css` | **The one new piece of code.** Blog article styling to paste into `global.css`. |
| `styles/bundle.css` | Compiled Tailwind CSS used by the previews. You don't need it in the site. |
| `components/<Name>/` | `preview.html` (open it in a browser) and `README.md` (the exact class strings and what to provide). |
| `assets/`, `fonts/` | The icons, portrait and font file. |

## How to use it

1. **Put it in the repo.** Copy this folder to `swe-portfolio-website-2/docs/design-system/`, or to `.agents/design-system/` next to your PRD. That way it's versioned with the code.
2. **Point your coding agent at it.** Add one line to your agent instructions (for example `CLAUDE.md` or `AGENTS.md`):
   > Follow `docs/design-system/DESIGN.md` and `BUILDING-PAGES.md` for any UI work. Reuse the class strings in `docs/design-system/components/*/README.md`.
3. **When you build the blog:**
   - paste `styles/brutal-prose.css` into `src/styles/global.css`;
   - wrap each post body in `<div class="brutal-prose">`;
   - build the list and post pages from the PostCard, ArticleHeader, BlogIndex and BlogArticle guides.
4. **Optional tidy-ups** listed at the end of `BUILDING-PAGES.md`:
   - add the cyan, yellow and purple colours to `@theme`;
   - fix the contrast misses;
   - change the footer name and favicon.

The live, browsable version is the "laanhema.dev Neo-Brutalist" design system artifact on claude.ai.
