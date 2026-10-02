Opening section: kicker, outlined headline, accent-barred lede, CTA row and portrait. Hand-written from `src/App.tsx`.

- Section: `min-h-[85vh]`, vertically centred, with two blurred blobs behind it (orange at top right, cyan at bottom left, `opacity-20 -z-10`).
- Headline: `display-hero` with `leading-[0.85] tracking-tighter`. The middle word is outlined (`text-transparent text-stroke-robust`, 1.5px stroke, 3px from md up).
- Lede: `text-xl md:text-2xl max-w-2xl font-medium border-l-8 border-[#ff3e00] pl-6`.
- Portrait: `xl:w-[34%]` beside the text from 1280px, stacked below it (max-w-md) under that width.
- Use it only on the home page. Other pages open with a **SectionHeading**-style h1 instead.
