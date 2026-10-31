White closing section with a pitch, the email link and the contact form. Hand-written from `src/features/contact/ContactForm.tsx`.

- Section: `py-24 px-6 md:px-12 bg-white border-t-4 border-text-primary`, at `max-w-4xl`. The heading is `heading-section` with the accent word "Awesome.".
- Email link: `text-lg sm:text-2xl font-bold uppercase break-all` with a 32px Mail icon. The icon stacks above the address below 640px.
- The form is **FormField**s plus the accent submit **Button**. On submit it opens the visitor's mail client with a prefilled `mailto:` (name, email and message in the body). Nothing is sent to a server.
- Reuse it at the end of blog posts.
