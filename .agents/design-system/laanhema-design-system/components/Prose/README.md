**Addition.** `.brutal-prose`: styles a post's HTML in the brutal language, so posts need no per-element classes.

- Wrap the post body: `<div class="brutal-prose">{content}</div>`. The CSS is in `src/styles/global.css`, and **Building new pages** shows it.
- It covers h2, h3, paragraphs, links (accent underline), square-marker lists, blockquote (accent bar), inline code (2px box), code blocks (ink panel with brutal shadow), tables (ink header), figures and hr.
- Highlight code with the accent mapping in **Building new pages** → Code highlighting.
