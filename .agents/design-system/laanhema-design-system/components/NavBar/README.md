Sticky top bar with the wordmark and anchor links. Hand-written from `src/features/navigation/Nav.tsx`.

- Bar: `sticky top-0 z-50 w-full bg-bg-primary border-b-4 border-text-primary`. Inner row: `py-4 px-6 md:px-12 flex justify-between items-center`.
- Wordmark: `text-2xl md:text-3xl font-bold uppercase tracking-tighter` with the dot in `text-accent`.
- Desktop links (`hidden md:flex gap-8 text-lg font-bold`): each link is `relative group` and has a `h-1` accent bar that grows `w-0 → group-hover:w-full`.
- **Provide:** the link list. To add a link, insert it in `NAV_LINKS` (`src/features/navigation/navHelpers.ts`). This bar and **MobileMenu** both render from it. On sub-pages, point the anchors to `/#work` and the others.
