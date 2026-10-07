Square white icon links to the social profiles. Hand-written from `src/App.tsx`.

- Class string: `bg-white brutal-border p-4 shadow-brutal transition-[transform,box-shadow] duration-100 brutal-shadow-hover text-[#121212] flex items-center justify-center touch-manipulation`. The box is 64px with a 24px icon.
- **Press:** pass `onPointerDown={playPress}` from `src/components/playPress.ts`. It plays the press with the Web Animations API instead of `:active`, so every tap runs to the end and the button always comes back to rest, even after the link opens a new tab.
- **Provide:** `href`, `aria-label` ("GitHub", "Twitter", "LinkedIn") and an icon from **Icons** with `stroke="currentColor"`.
- Lay them out in `flex items-center gap-4 flex-nowrap`, next to the primary CTA.
