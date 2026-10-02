Sticky top bar with the wordmark and anchor links. Hand-written from `src/features/navigation/Nav.tsx`.

- Bar: `sticky top-0 z-50 w-full bg-[#f8f9fa] border-b-4 border-[#121212]`. Inner row: `py-4 px-6 md:px-12 flex justify-between items-center`.
- Wordmark: `text-2xl md:text-3xl font-bold uppercase tracking-tighter` with the dot in `text-[#ff3e00]`.
- Desktop links (`hidden md:flex gap-8 text-lg font-bold`): each link is `relative group` and has a `h-1` accent bar that grows `w-0 → group-hover:w-full`.
- **Provide:** the link list. To add "Blog", insert it before "Contact" in both this bar and **MobileMenu**. On sub-pages, point the anchors to `/#work` and the others.
