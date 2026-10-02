A label above a brutal input or textarea. Hand-written from `ContactForm.tsx`.

- Wrapper: `flex flex-col gap-2`. Label: `font-bold uppercase tracking-wider` with `htmlFor`.
- Input: `brutal-border p-4 bg-[#f8f9fa] focus:outline-none focus:bg-white focus:brutal-shadow transition-all`. Textareas add `resize-none` and `rows={4}`. The preview shows the Email field in its focused state.
- Errors aren't designed yet. Use ink text with an `accent` 4px border and a written message, never colour alone.
