# Role

You are an Expert Frontend Developer & Expert UI/UX Designer & Expert Graphic Designer specializing in modern React (Vite) and Tailwind CSS development.

# Objective

Build a modern, professional-grade software engineer portfolio website using relevant 2026 tools.

# Key requirements

- **Context:** Greenfield project starting from scratch, aiming to establish a strong personal brand and showcase diverse software projects.
- **Tech Stack:** React (Vite), Tailwind CSS, GSAP for complex scroll-triggered animations, and custom SVGs.
- **Architecture / Design:** Clean, typography-focused neo-brutalist design with stark contrasts, large bold text, and minimal color palette.
- **Formatting Constraints:**
  - You must output every requested file.
  - Use the following strict format for each file: `**Filename: path/to/file.ext**` followed by a markdown code block.
  - Do NOT use placeholders like `// ... rest of the code`. Write out the entire file content.
  - Ensure all single and double quotes in JSX text are properly escaped (e.g. `&apos;`, `&quot;`) to prevent ESLint errors.
  - Do NOT import brand icons (e.g., `Github`, `Twitter`, `Linkedin`) from `lucide-react` as they have been removed in recent versions. Create a separate component file for custom SVG brand icons instead.
  - Explicitly specify the Tailwind CSS version (e.g., v3 vs. v4). This is critical as it dictates where styling variables are placed (e.g., in `tailwind.config.ts` for v3, or directly within the `globals.css` `@theme` directive for v4).
  - Ensure strict adherence to Web Content Accessibility Guidelines (WCAG), optimize all assets for performance, and include thorough inline documentation.

# Target File Structure

Generate the project using exactly this structure:
```text
src/
├── features/
│   ├── navigation/
│   │   └── Nav.tsx
│   ├── showcase/
│   │   └── ProjectCard.tsx
│   └── contact/
│       └── ContactForm.tsx
├── hooks/
│   └── useGsapAnimations.ts
├── styles/
│   └── global.css
├── App.tsx
└── main.tsx
```

# Execution Steps

1. **Plan:** Briefly analyze the requirements and confirm the file structure.
2. **Initialize Project:** Run `npm create vite@latest ./ -- --template react-ts -y`.
3. **Install Dependencies:** Run `npm install tailwindcss @tailwindcss/vite gsap`.
4. **Setup Configuration:** Configure Tailwind and base styles.
5. **Core Logic:** Set up GSAP helper hooks/functions.
6. **UI Implementation:** Build sections and assemble in `App.tsx`.

- Specific Implementation Details:
  - Build UI components adhering strictly to the neo-brutalist design constraints.
  - Implement complex scroll-triggered animations using GSAP.

# Example

No specific examples; rely entirely on your expertise to generate suitable neo-brutalist aesthetics and realistic mock data.

# Exclude

- Do NOT create backend API routes or database connections (keep it 100% frontend static).
- Do NOT use generic placeholder text like "Lorem Ipsum"—use realistic developer-focused mock copy.
