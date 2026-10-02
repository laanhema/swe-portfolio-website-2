**Addition.** One blog post in a list: date and reading time, title, excerpt and topic tags, built from the ProjectCard vocabulary.

- Shell: `brutal-border brutal-shadow brutal-shadow-hover p-6 md:p-8 flex flex-col gap-4 h-full`. The fill is white, or an accent for the featured (newest) post.
- Meta row: `<time datetime>` / reading time, `text-sm font-bold uppercase tracking-wider`.
- Title: `heading-card` style, linked, with `hover:underline decoration-4 underline-offset-4`.
- Excerpt: `text-lg font-medium leading-relaxed`. Tags reuse **TechTag** and sit at the bottom (`mt-auto`).
- **Provide:** `title`, `slug`, `date`, `readingTime`, `excerpt`, `tags[]`, and `featured?`.
