# Plan: Replace Hero Description Placeholder Text with Personalized Values

## Summary

Replace the generic placeholder paragraph in the hero section of `src/App.tsx` with personalized, authentic developer copy that highlights Lauri Makkonen's background (active since 2019), core engineering philosophy, and values (technical rigor, dependable architectures, clear communication, craftsmanship from concept to delivery). Preserve the left border accent (`border-[#ff3e00]`), responsive typography (`text-xl md:text-2xl`), animation trigger (`animate-on-scroll`), and defensive responsive container styling.

## User Story

As a technical recruiter or hiring manager landing on `laanhema.dev`,
I want to read an authentic personal summary of the engineer's background and core values rather than generic placeholder text,
So that I can immediately understand their professional identity, engineering philosophy, and experience level.

## Metadata

| Field | Value |
|---|---|
| Type | ENHANCEMENT |
| Complexity | LOW |
| Systems Affected | `src/App.tsx` |
| GitHub Issue | #3 |

---

## Patterns to Follow

### Component & Styling
```tsx
// SOURCE: src/App.tsx:79-82
<p className='text-xl md:text-2xl max-w-2xl font-medium mb-12 border-l-8 border-[#ff3e00] pl-6 animate-on-scroll'>
  ...
</p>
```

### Tone & Voice Mirror
```tsx
// SOURCE: src/App.tsx:146-151
<p className='text-xl leading-relaxed font-medium'>
  I&apos;ve been coding since 2019, specializing in full-stack web
  development and project leadership. I combine technical skill
  with professional soft skills to take projects from idea to
  delivery.
</p>
```

### Tests / Validation
```bash
# SOURCE: package.json:8-9
npm run lint
npm run build
```

---

## Files to Change

| File | Action | Purpose |
|---|---|---|
| `src/App.tsx` | UPDATE | Replace generic hero paragraph placeholder text with personalized values copy while maintaining styling, classes, and responsive behavior. |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: Replace hero description text with personalized developer values copy
- **File**: `src/App.tsx`
- **Action**: UPDATE
- **Implement**:
  - Replace the placeholder text in the hero `<p>` tag (`border-l-8 border-[#ff3e00]`):
    - Old: `"I specialize in architecting scalable backend services and crafting highly interactive, performant frontend experiences."`
    - New: `"Full-stack software engineer dedicated to building dependable systems and high-craft digital experiences. Since 2019, I've paired technical rigor with clear communication to take software from concept to production with maintainable architecture, performance, and attention to detail."` (using `&apos;` for apostrophe per ESLint react rules).
  - Verify container attributes (`text-xl md:text-2xl max-w-2xl font-medium mb-12 border-l-8 border-[#ff3e00] pl-6 animate-on-scroll`) are untouched.
- **Mirror**: `src/App.tsx:79-82` and `src/App.tsx:146-151`
- **Validate**: `npm run lint && npm run build`

---

## Validation

```bash
# Type check / Build
npm run build

# Lint
npm run lint
```

## End-to-End Verification

1. Run `npm run build` and ensure TypeScript compiler and Vite bundling complete with 0 errors.
2. Run `npm run lint` and verify ESLint reports 0 errors and 0 warnings (especially ensuring proper apostrophe escaping e.g. `&apos;`).
3. Verify in browser / responsive emulator across mobile (375px), tablet (768px), and desktop (1280px+):
   - Hero copy displays the personalized text clearly.
   - Left orange accent border (`border-[#ff3e00]`) renders with correct spacing (`pl-6`).
   - Typography scales responsively (`text-xl` on mobile to `text-2xl` on desktop).
   - No awkward word breaks or horizontal overflow on small screens.

---

## Risks

| Risk | Mitigation |
|---|---|
| Unescaped apostrophe in JSX (`I've` vs `I&apos;ve`) failing ESLint `react/no-unescaped-entities` | Use `I&apos;ve` in the JSX copy and run `npm run lint` immediately to verify. |
| Text expansion causing visual clash with portrait or CTA buttons on small mobile screens | Keep paragraph within `max-w-2xl` and test layout at 375px/390px viewports. |

---

## Open Questions

None. The tone and background match the PRD and About section.

---

## Acceptance Criteria

- [ ] Placeholder text in the hero section is replaced with personalized copy highlighting real developer values and background.
- [ ] Left border accent (`border-[#ff3e00]`) and responsive typography (`text-xl md:text-2xl`) remain preserved.
- [ ] Copy reads naturally across mobile, tablet, and desktop viewports without awkward overflow.
- [ ] Type check and build pass (`npm run build`).
- [ ] Lint passes (`npm run lint`).
