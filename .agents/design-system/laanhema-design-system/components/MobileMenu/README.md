The below-768px nav: an orange Menu/Close toggle and a full-width drawer. Hand-written from `Nav.tsx`.

- Toggle: see **Button** → Mobile Menu. It needs `aria-expanded`, `aria-controls="mobile-menu"` and an `aria-label` of "Open menu" or "Close menu".
- Drawer: `md:hidden border-t-4 border-[#121212] bg-[#f8f9fa] px-6 py-6 flex flex-col gap-4 text-xl font-bold uppercase tracking-wide`. Links are separated by `border-b-2` rules, and the last link has none.
- Selecting a link closes the drawer.
