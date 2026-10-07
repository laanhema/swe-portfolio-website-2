The site's four button treatments, all bold uppercase in a brutal box. Hand-written from `src/App.tsx`, `ProjectCard.tsx`, `ContactForm.tsx` and `Nav.tsx`.

- **Primary CTA** (View Work): `bg-[#121212] text-white px-8 py-4 text-xl font-bold uppercase shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover touch-manipulation`. Use one per view. It has no border, because the ink fill is its own edge.
- **Accent submit** (Send Message): `bg-[#ff3e00] text-white brutal-border py-4 font-bold uppercase text-xl brutal-shadow hover:-translate-y-1 hover:translate-x-1 transition-all`. Use it for form submits. It is full width inside forms.
- **Card pair** (Code / Live Demo): `flex-1` buttons in a `flex gap-4`. Code is white with a 20px GitHub icon. Live Demo or Download APK is the ink fill. Both use `py-3 … shadow-brutal hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#121212] transition-all duration-75 touch-manipulation`.
- **Mobile Menu**: `brutal-border px-4 py-2 font-bold uppercase bg-[#ff3e00] text-white brutal-shadow active:translate-x-1 active:translate-y-1 active:shadow-none`. Its white 16px label on orange is 3.53:1 (below AA). Prefer `text-[#121212]` in new uses.
- **Press:** the Primary CTA and the card pair pass `onPointerDown={playPress}` from `src/components/playPress.ts`. Mobile browsers often skip `:active` on a tap, so these buttons play the press with the Web Animations API instead.
- **Provide:** an `<a>` for navigation and a `<button>` for actions, with a 1–2 word uppercase label.
