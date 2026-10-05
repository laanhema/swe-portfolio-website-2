import type { BlogPost } from '../types';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'tralla',
    projectTitle: 'Tralla',
    title: 'Rebuilding Trello with Angular and SignalStore',
    titleHighlight: 'SignalStore.',
    summary:
      'Ditching bloated project boards to build a distraction-free Kanban app with SignalStore and Taiga UI.',
    author: 'Lauri Makkonen',
    date: '2026-09-18',
    displayDate: 'Sep 18, 2026',
    readingTime: '6 min read',
    excerpt:
      'Ditching bloated project boards to build a distraction-free Kanban app with SignalStore and Taiga UI.',
    tags: ['Angular', 'NgRx', 'SignalStore', 'TypeScript'],
    accentColor: '#00e5ff',
    content: `<p>Kanban boards have become one of the most critical daily instruments in my development toolkit. Far beyond simple to-do lists, a well-structured board provides spatial clarity over complex, concurrent tasks.</p>
<p>However, industry standards like Atlassian&apos;s Trello have increasingly placed core functionality behind enterprise paywalls. Tralla began as an unabashedly personal project born out of that frustration: I wanted to build a lean, distraction-free Kanban web application tailored precisely to my own workflow, retaining the features I use every day.</p>

<h2>Architectural Foundation: Mobile-First</h2>
<p>Having absorbed the lessons of past projects, I kicked off Tralla with a strict Minimum Viable Product (MVP) and a mobile-first design strategy. If you get your core header and navigation responsive from day one, scaling layouts across tablets and desktops becomes remarkably easier.</p>
<p>To keep my momentum focused on reactive state architecture rather than re-implementing basic UI primitives, I integrated the Taiga UI component library <code>TuiElements</code>. Styled with modular LESS stylesheets, Taiga UI provided clean, accessible inputs, buttons, and dialogs right out of the box, allowing me to focus directly on data flow and state management.</p>

<table>
  <thead>
    <tr>
      <th>Component</th>
      <th>Technology</th>
      <th>Role &amp; Architecture Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Frontend Framework</strong></td>
      <td>Angular + TypeScript</td>
      <td>Modern standalone architecture with native signals and control flow</td>
    </tr>
    <tr>
      <td><strong>State Management</strong></td>
      <td>NgRx SignalStore</td>
      <td>Centralized reactive store managing boards, lists and tasks</td>
    </tr>
    <tr>
      <td><strong>UI Components</strong></td>
      <td>Taiga UI</td>
      <td>Accessible inputs, buttons, and dialogs</td>
    </tr>
    <tr>
      <td><strong>Styling Engine</strong></td>
      <td>LESS</td>
      <td>Modular component styling and design customization</td>
    </tr>
  </tbody>
</table>

<h2>Taming State with NgRx SignalStore</h2>
<p>Interactive boards with nested columns and drag-and-drop tasks can rapidly degrade into a tangle of mutable references and hard-to-trace bugs. To keep my sanity, I adopted NgRx SignalStore to establish a single, authoritative source of truth.</p>
<p>The board store operates as a globally accessible singleton service managing boards, lists, and tasks. Instead of mutating arrays in place, state updates are strictly dispatched through store actions and <code>patchState</code>.</p>

<pre><code><span class="text-gray-400">// creates a new task</span>
<span class="text-[#00e5ff]">createNewTask</span>(boardId: <span class="text-[#facc15]">number</span>, listId: <span class="text-[#facc15]">number</span>) {
  <span class="text-[#ff3e00]">const</span> currentTasks = <span class="text-[#ff3e00]">this</span>.<span class="text-[#00e5ff]">getTasksByListId</span>(boardId, listId);
  <span class="text-[#ff3e00]">const</span> lastUsedId = currentTasks.length &gt; <span class="text-[#facc15]">0</span> ? currentTasks[currentTasks.length - <span class="text-[#facc15]">1</span>].tid : <span class="text-[#facc15]">1</span>;

  <span class="text-[#ff3e00]">const</span> newTask: <span class="text-[#facc15]">ITask</span> = {
    tid: lastUsedId + <span class="text-[#facc15]">1</span>,
    title: <span class="text-[#facc15]">''</span>,
    taskDone: <span class="text-[#ff3e00]">false</span>,
  };

  <span class="text-[#ff3e00]">const</span> update = store.<span class="text-[#00e5ff]">boards</span>().<span class="text-[#00e5ff]">map</span>((x) =&gt; {
    <span class="text-[#ff3e00]">if</span> (x.bid !== boardId) <span class="text-[#ff3e00]">return</span> x;

    <span class="text-[#ff3e00]">return</span> {
      ...x,
      content: x.content.<span class="text-[#00e5ff]">map</span>((x) =&gt; {
        <span class="text-[#ff3e00]">if</span> (x.lid !== listId) <span class="text-[#ff3e00]">return</span> x;

        <span class="text-[#ff3e00]">return</span> {
          ...x,
          content: [...currentTasks, newTask],
        };
      }),
    };
  });

  <span class="text-[#00e5ff]">patchState</span>(store, { boards: update });
}</code></pre>

<h2>Modern Angular Mechanics</h2>
<p>Tralla has served as a proving ground for modern Angular concepts:</p>
<ul>
  <li><strong>Reactivity &amp; Control Flow:</strong> Embracing Angular&apos;s new built-in control flow <code>@if</code>, <code>@else</code>, <code>@for</code> alongside signal primitives and reactive <code>effects</code>.</li>
  <li><strong>Moving Data Between Components:</strong> Using property binding and signal-based inputs as props to pass data down to child components.</li>
  <li><strong>Form Binding:</strong> Combining <code>[(ngModel)]</code> two-way bindings for rapid in-place text edits with dynamic property and class bindings for interactive styling.</li>
  <li><strong>Routing:</strong> Setting up <code>ActivatedRoute</code> and <code>routerLink</code> within the top navigation bar to switch between distinct project boards without page reloads.</li>
  <li><strong>Data Fetching:</strong> Utilizing Angular&apos;s <code>HttpClient</code> and RxJS <code>Observable</code> streams to handle asynchronous operations flexibly.</li>
</ul>

<h2>What&apos;s Next for Tralla</h2>
<p>While the frontend interface and local SignalStore logic are stable, Tralla is still an evolving project. The immediate roadmap includes:</p>
<ol>
  <li>Building out a dedicated backend service to handle remote synchronization and user profiles (currently deciding between a Node.js/Express + MongoDB stack or revisiting relational modeling with MySQL).</li>
  <li>Packaging and deploying the frontend to production.</li>
</ol>`,
  },
  {
    slug: 'distill-design-scraper',
    projectTitle: 'Distill Design Scraper',
    title: 'Scraping design tokens with Playwright and Culori',
    titleHighlight: 'Culori.',
    summary:
      'Inside Distill: rendering a page, sampling every computed colour and clustering them into a palette.',
    author: 'Lauri Makkonen',
    date: '2026-08-30',
    displayDate: 'Aug 30, 2026',
    readingTime: '5 min read',
    excerpt:
      'Inside Distill: rendering a page, sampling every computed colour and clustering them into a palette.',
    tags: ['Next.js', 'Playwright', 'Culori', 'Design Tokens'],
    accentColor: '#a855f7',
    content: `<p>Started in the summer of 2026, Distill Design Scraper marks a fundamental shift in how I build software: it is my first project developed entirely through an agentic software engineering methodology.</p>
<p>Rather than writing all implementation code by hand, this project became an exploration in working at a higher level of abstraction: managing context windows, optimizing token consumption, crafting reusable prompt skills, and dynamically selecting the right AI model for each specific subtask. Throughout this project, I relied extensively on Claude Opus 4.8 (high) within Claude Code to rapidly architect, test, and iterate on different versions of the application.</p>

<h2>The Problem: Extracting Design Intelligence</h2>
<p>Every designer knows the feeling of starting a brand new project and seeking visual inspiration from existing digital products. However, manually inspecting stylesheets to deconstruct a design system is tedious, while blindly copying code is uninspiring.</p>
<p>Distill was conceived to automate this reverse-engineering pipeline:</p>
<ul>
  <li>The tool analyzes a target website (or infers layout from a visual screenshot) to capture the &ldquo;big picture&rdquo; macro-structure - examining layout hierarchies, spacing cadences, and colors.</li>
  <li>Instead of plagiarizing implementation code, it synthesizes rendered public data into clean, structured Markdown specifications.</li>
  <li>These generated design briefs can be handed directly to human product designers or fed into autonomous AI coding agents as project guardrails.</li>
</ul>

<table>
  <thead>
    <tr>
      <th>Component</th>
      <th>Technology</th>
      <th>Role &amp; Architecture Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Web Scraping Engine</strong></td>
      <td>Playwright (Chromium)</td>
      <td>Live DOM style evaluation and visual screenshot capture</td>
    </tr>
    <tr>
      <td><strong>Color Science Engine</strong></td>
      <td>Culori</td>
      <td>CIELAB perceptual space conversion and Delta-E distance clustering</td>
    </tr>
    <tr>
      <td><strong>Design Synthesis</strong></td>
      <td>Multimodal LLMs (BYOK)</td>
      <td>Ingests rendered data and screenshots to generate structured Markdown specifications</td>
    </tr>
    <tr>
      <td><strong>Frontend UI</strong></td>
      <td>Next.js + TypeScript</td>
      <td>Minimal, practical interface for target inspection and palette review</td>
    </tr>
    <tr>
      <td><strong>Local Deployment</strong></td>
      <td>Docker</td>
      <td>Self-hosted sandbox ensuring external API keys remain private</td>
    </tr>
  </tbody>
</table>

<h2>Color Science: Why Simple Hex Matching Fails</h2>
<p>Extracting a clean color palette from a live webpage sounds trivial until you run into real-world production CSS: semi-transparent overlays, box shadows, border anti-aliasing, and dynamic CSS-in-JS variables. A single landing page can easily render over a thousand distinct hex codes.</p>
<p>Furthermore, naive Euclidean RGB distance formulas fail because human vision perceives color non-linearly. To solve this:</p>
<ol>
  <li>Distill leverages Playwright to run headless Chromium instances, evaluating computed styles directly in the live DOM.</li>
  <li>Extracted colors are mapped into the perceptual CIELAB color space.</li>
  <li>Using the Culori color library and Delta-E color-difference algorithms, raw sampled swatches are mathematically clustered into unified semantic roles (such as primary, background, surface, and accent tokens).</li>
</ol>

<pre><code><span class="text-gray-400">/** Nearest palette role for a measured CSS color, or null if nothing is close enough. */</span>
<span class="text-[#ff3e00]">export function</span> <span class="text-[#00e5ff]">nearestPaletteRole</span>(
  colorValue: <span class="text-[#facc15]">string</span>,
  palette: <span class="text-[#facc15]">Palette</span>,
): <span class="text-[#facc15]">ColorRole</span> | <span class="text-[#ff3e00]">null</span> {
  <span class="text-[#ff3e00]">const</span> parsed = <span class="text-[#00e5ff]">parseColor</span>(colorValue);
  <span class="text-[#ff3e00]">if</span> (!parsed) <span class="text-[#ff3e00]">return null</span>;

  <span class="text-[#ff3e00]">let</span> best: <span class="text-[#facc15]">ColorRole</span> | <span class="text-[#ff3e00]">null</span> = <span class="text-[#ff3e00]">null</span>;
  <span class="text-[#ff3e00]">let</span> bestDist = <span class="text-[#facc15]">Infinity</span>;
  <span class="text-[#ff3e00]">for</span> (<span class="text-[#ff3e00]">const</span> swatch <span class="text-[#ff3e00]">of</span> palette.colors) {
    <span class="text-[#ff3e00]">const</span> swatchColor = <span class="text-[#00e5ff]">parseColor</span>(swatch.hex);
    <span class="text-[#ff3e00]">if</span> (!swatchColor) <span class="text-[#ff3e00]">continue</span>;
    <span class="text-[#ff3e00]">const</span> dist = <span class="text-[#00e5ff]">deltaE</span>(parsed, swatchColor);
    <span class="text-[#ff3e00]">if</span> (dist &lt; bestDist &amp;&amp; swatch.role) {
      bestDist = dist;
      best = swatch.role;
    }
  }
  <span class="text-[#ff3e00]">return</span> bestDist &lt;= ROLE_MATCH_DELTA_E ? best : <span class="text-[#ff3e00]">null</span>;
}</code></pre>

<h2>The Road Ahead</h2>
<p>Distill continues to move forward as an active work in progress. Right now, I am exploring different deployment options so others can easily run and use the tool.</p>
<p>The main consideration revolves around the vision analysis pipeline, which requires an external API key. Expecting users to paste their private API keys into a hosted public frontend is something I want to avoid. Because of this, providing a local Docker instance looks like a much better option - it allows users to keep their API keys completely private on their own machines without having to trust an external web host.</p>`,
  },
  {
    slug: 'froots-smoothie-app',
    projectTitle: 'Froots Smoothie App',
    title: 'Svelte reactivity and nutritional math in Froots',
    titleHighlight: 'Froots.',
    summary:
      'Building a snappy nutritional calculator with Svelte runes and keeping UI state delightfully simple.',
    author: 'Lauri Makkonen',
    date: '2026-08-05',
    displayDate: 'Aug 5, 2026',
    readingTime: '6 min read',
    excerpt:
      'Building a snappy nutritional calculator with Svelte runes and keeping UI state delightfully simple.',
    tags: ['Svelte', 'TypeScript', 'Tailwind', 'State'],
    accentColor: '#facc15',
    content: `<p>Our goal with Froots was to create a smoothie recipe app that is fun, fresh, and accessible to users of all ages. The app allows users to browse a collection of smoothie recipes complete with nutritional information, and also create and save their own recipes.</p>

<h2>Sprint Breakdown</h2>
<p>We were given a four-week sprint to take Froots from initial concept to a fully deployed application. As the lead developer, my core responsibilities centered around managing our Git repository, enforcing a disciplined feature-branch workflow, reviewing pull requests, and orchestrating code integration.</p>
<p>To keep momentum high, we split our four-person team down the middle:</p>
<ul>
  <li><strong>Two teammates</strong> focused on UI/UX design in Figma, branding, and comprehensive project documentation.</li>
  <li><strong>Two developers</strong> (including myself) handled application architecture, state management, and core implementation.</li>
</ul>
<p>We tracked daily work using a Trello Kanban board and held formal retrospective meetings at the end of each week to assess our progress and outline the game plan for the upcoming sprint.</p>
<table>
  <thead>
    <tr>
      <th>Phase</th>
      <th>Timeline</th>
      <th>Focus &amp; Key Deliverables</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Planning</strong></td>
      <td>Week 1</td>
      <td>Brainstorming, concept experimentation, and architectural planning</td>
    </tr>
    <tr>
      <td><strong>Core Build</strong></td>
      <td>Weeks 2&ndash;3</td>
      <td>Heavy implementation, component construction, and data pipeline integration</td>
    </tr>
    <tr>
      <td><strong>Launch</strong></td>
      <td>Week 4</td>
      <td>Marketing video, presentation decks, documentation, and post-project reflections</td>
    </tr>
  </tbody>
</table>

<h2>Crafting Svelte 5 by Hand</h2>
<p>We chose to build Froots using Svelte 5 and TypeScript, styled with Tailwind CSS. Svelte 5 had only recently been released when we started. Because the framework&apos;s new runes system was so fresh, large language models had virtually no training data on Svelte 5 syntax. As a result, nearly every line of code had to be written and debugged by hand. We restricted AI tooling strictly to mechanical data work, such as refactoring recipe JSON schemas, where deterministic formatting could be safely automated.</p>
<p>Diving headfirst into Svelte 5 gave me a profound appreciation for modern frontend reactivity. Over the course of the project, I developed hands-on mastery with:</p>
<ul>
  <li>State runes <code>$state</code>, <code>$derived</code>, <code>$derived.by</code>, and <code>$effect</code> to build reactive state variables.</li>
  <li>Moving data between components with <code>$props</code> and <code>$bindable()</code>.</li>
  <li>Modern templating constructs, including snippets, <code>@if</code>, <code>@render</code>, and <code>{#each}</code> blocks.</li>
  <li>Effortless reactive console logging using <code>$inspect</code> during development.</li>
  <li>Smooth layout animations with <code>svelte/transition</code>.</li>
</ul>

<h2>Asynchronous Data and Client-Side Persistence</h2>
<p>One of the project&apos;s core requirements was fetching external data asynchronously. We integrated the FruityVice API to retrieve dynamic nutritional profiles for a wide spectrum of fruits.</p>
<p>Because our team had not yet ventured into backend web development at that point in our studies, we leaned into a pragmatic, offline-first persistence strategy:</p>
<ul>
  <li>Default smoothie recipes are bundled in a static JSON file.</li>
  <li>On initialization, recipes are seeded into the browser&apos;s <code>LocalStorage</code>.</li>
  <li>Whenever a user invents a new smoothie or customizes ingredient quantities, the updated collection is pushed directly to <code>LocalStorage</code>.</li>
</ul>
<p>This design gave users immediate data persistence across browser reloads without requiring an external database.</p>

<pre><code><span class="text-gray-400">// luo uuden smoothien ja uuden smoothieKortin ja lis&auml;&auml; kummatkin globaleihin taulukoihin + poistuu takaisin etusivulle</span>
<span class="text-[#ff3e00]">function</span> <span class="text-[#00e5ff]">createSmoothie</span>() {
  <span class="text-[#ff3e00]">const</span> maxId = globalSmoothies
    .<span class="text-[#00e5ff]">get</span>()
    .<span class="text-[#00e5ff]">reduce</span>((max, smoothie) =&gt; (smoothie.id &gt; max ? smoothie.id : max), -<span class="text-[#facc15]">1</span>);
  <span class="text-[#ff3e00]">const</span> newSmoothie: <span class="text-[#facc15]">Smoothie</span> = {
    id: maxId + <span class="text-[#facc15]">1</span>,
    name: uudenSmoothienNimi,
    ingredients: uudenSmoothienIngredients,
    ingredientsAmount: uudenSmoothienIngredientsAmounts,
    pic: <span class="text-[#facc15]">"/images/default-faded-leaf.jpg"</span>,
    preparationTimeMinutes: uudenSmoothienValmistusaika,
    notes: uudenSmoothienNotet,
  };

  <span class="text-[#00e5ff]">luoSmoothieKortti</span>(newSmoothie, <span class="text-[#ff3e00]">true</span>);
  globalSmoothies.<span class="text-[#00e5ff]">get</span>().<span class="text-[#00e5ff]">unshift</span>(newSmoothie);
  <span class="text-gray-400">// p&auml;ivitet&auml;&auml;n localStoragen muuttuja smoothiesLS</span>
  localStorage.<span class="text-[#00e5ff]">setItem</span>(<span class="text-[#facc15]">"smoothiesLS"</span>, JSON.<span class="text-[#00e5ff]">stringify</span>(globalSmoothies.<span class="text-[#00e5ff]">get</span>()));
  <span class="text-[#00e5ff]">homePage</span>();
}</code></pre>

<h2>Roadblocks, Bugs, and Hard-Earned Lessons</h2>
<p>No project is complete without technical hurdles, and Froots provided several invaluable lessons:</p>
<ol>
  <li><strong>The Asynchronous Timing Trap:</strong> During our initial API integration, a subtle keyword omission caused our data fetch to execute half-asynchronously and half-synchronously. This desynchronized Svelte&apos;s reactive updates (execution ticks fell out of alignment) and broke the recipe rendering pipeline.</li>
  <li><strong>The Hidden Weight of Images:</strong> Even today, the current build still suffers from noticeable load latency caused entirely by uncompressed image assets. Images are almost always the heaviest assets in any web application. This project was a clear lesson for me: always convert photographic assets to modern formats like WebP or compressed JPG, and compress them as small as possible before bundling.</li>
  <li><strong>Cross-Browser Layout Quirks:</strong> We encountered unexpected styling inconsistencies where Chrome and Firefox rendered our background images differently, reinforcing the necessity of testing against multiple browser engines during development.</li>
  <li><strong>Balancing Technical Focus with Leadership:</strong> Looking back on my collaboration, I realized that I occasionally dove too deep into the code at the expense of step-back communication with my teammates. While our delivery was successful, it highlighted an area of personal growth on my part.</li>
  <li><strong>The Power of the MVP:</strong> Froots proved why starting with a strict Minimum Viable Product is non-negotiable. Establishing core features first gave us the breathing room to build responsive, mobile-first layouts, fight scope creep, and even sneak in a hidden Rickroll easter egg for attentive users before deploying the final build to Netlify.</li>
</ol>

<h2>Final Takeaways</h2>
<p>I could not be prouder of how Froots turned out or how hard our team worked. Everyone pulled their weight, and navigating bleeding-edge framework releases under tight deadlines taught me how to embrace uncertainty with confidence.</p>`,
  },
  {
    slug: 'gymbro-app',
    projectTitle: 'GymBro App',
    title: 'Shipping an Android APK from an S3 bucket',
    titleHighlight: 'S3 bucket.',
    summary:
      "The low-budget distribution path behind GymBro, and what I'd do with a real store listing.",
    author: 'Lauri Makkonen',
    date: '2026-07-12',
    displayDate: 'Jul 12, 2026',
    readingTime: '5 min read',
    excerpt:
      "The low-budget distribution path behind GymBro, and what I'd do with a real store listing.",
    tags: ['Ionic', 'Angular', 'Express', 'AWS'],
    accentColor: '#ff3e00',
    content: `<p>With GymBro, our five-person team set out to inject genuine RPG gamification into the workout experience. Every completed exercise session rewards the user with experience points, advances their level, and unlocks achievements. By pairing session tracking with visual progression, GymBro turns grueling gym consistency into an engaging habit.</p>

<h2>A Feature-Packed Architecture</h2>
<p>GymBro was designed as a comprehensive workout companion:</p>
<ul>
  <li><strong>Custom Training Programs:</strong> Users can construct personalized training programs and add custom moves.</li>
  <li><strong>Active Session Tracking:</strong> Session logging with a customizable rest timer and interactive calendar views.</li>
  <li><strong>Data Analytics:</strong> Deep performance visualization powered by Chart.js, enabling lifters to review personal records and assess training balance across different muscle groups.</li>
  <li><strong>Fitting Aesthetic:</strong> Designed in a high-contrast dark-and-yellow color scheme that feels right at home in dimly lit basement gyms.</li>
</ul>

<h2>Full-Stack Engineering from Ground Up</h2>
<p>To ship an Android-compatible application quickly without maintaining separate native codebases, we built a hybrid mobile client using Ionic Capacitor with Angular, bundling the final artifact into an installable Android APK.</p>
<p>The full-stack architecture was built from the ground up to support authenticated session logging and persistent stats tracking:</p>

<table>
  <thead>
    <tr>
      <th>System Layer</th>
      <th>Technology</th>
      <th>Role &amp; Architecture Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Mobile Client</strong></td>
      <td>Ionic Capacitor + Angular</td>
      <td>Cross-platform hybrid app bundled into installable Android APK</td>
    </tr>
    <tr>
      <td><strong>Backend API</strong></td>
      <td>Node.js + Express</td>
      <td>REST endpoints for workout logging, XP engine, and user accounts</td>
    </tr>
    <tr>
      <td><strong>Database</strong></td>
      <td>MongoDB Atlas</td>
      <td>Cloud document store with custom Mongoose schemas mirroring frontend models</td>
    </tr>
    <tr>
      <td><strong>Authentication</strong></td>
      <td>Google OAuth + JWT</td>
      <td>Secure token verification middleware, HTTP interceptors, and route guards</td>
    </tr>
    <tr>
      <td><strong>Data Analytics</strong></td>
      <td>Chart.js</td>
      <td>Dynamic volume, PR tracking, and muscle group balance charts</td>
    </tr>
    <tr>
      <td><strong>Cloud &amp; Hosting</strong></td>
      <td>AWS</td>
      <td>Cloud hosting and production backend API deployment</td>
    </tr>
  </tbody>
</table>

<h2>Leadership and Team Dynamics</h2>
<p>In this project, our team made extensive use of AI coding agents, which had an unexpected and welcome impact on my role as project lead. By offloading boilerplate scaffolding and repetitive syntax transformations to agents, I was liberated from being perpetually trapped in code editors.</p>
<p>This extra bandwidth allowed me to focus on the human side of leadership: checking in regularly with teammates, unblocking peers, reviewing architectural direction, and maintaining an encouraging, social team atmosphere. It was a transformative leadership experience that helped me grow significantly as both an engineer and a teammate.</p>

<pre><code><span class="text-[#ff3e00]">const</span> jwt = <span class="text-[#00e5ff]">require</span>(<span class="text-[#facc15]">"jsonwebtoken"</span>);

<span class="text-[#ff3e00]">const</span> <span class="text-[#00e5ff]">verifyToken</span> = (req, res, next) =&gt; {
  <span class="text-[#ff3e00]">try</span> {
    <span class="text-[#ff3e00]">const</span> authHeader =
      req.headers[<span class="text-[#facc15]">"authorization"</span>] || req.headers[<span class="text-[#facc15]">"Authorization"</span>];
    <span class="text-[#ff3e00]">if</span> (!authHeader || !authHeader.<span class="text-[#00e5ff]">startsWith</span>(<span class="text-[#facc15]">"Bearer "</span>)) {
      <span class="text-[#ff3e00]">return</span> res.<span class="text-[#00e5ff]">status</span>(<span class="text-[#facc15]">401</span>).<span class="text-[#00e5ff]">json</span>({ error: <span class="text-[#facc15]">"Unauthorized"</span> });
    }

    <span class="text-[#ff3e00]">const</span> token = authHeader.<span class="text-[#00e5ff]">split</span>(<span class="text-[#facc15]">" "</span>)[<span class="text-[#facc15]">1</span>];
    <span class="text-[#ff3e00]">const</span> decoded = jwt.<span class="text-[#00e5ff]">verify</span>(token, process.env.JWT_SECRET);
    req.user = decoded;
    <span class="text-[#00e5ff]">next</span>();
  } <span class="text-[#ff3e00]">catch</span> {
    <span class="text-[#ff3e00]">return</span> res.<span class="text-[#00e5ff]">status</span>(<span class="text-[#facc15]">401</span>).<span class="text-[#00e5ff]">json</span>({ error: <span class="text-[#facc15]">"Invalid token."</span> });
  }
};

module.exports = verifyToken;</code></pre>

<h2>CI/CD Mishaps and Scope Creep</h2>
<p>Ambitious projects inevitably encounter turbulence, and GymBro gave us our share of trial by fire:</p>
<ol>
  <li><strong>The CI/CD Deployment Bug:</strong> Halfway into our sprint, development ground to a halt when all team branches suddenly stopped working. After hours of hair-pulling debugging, we discovered the culprit in our AWS CI/CD script: the deployment trigger only fired when files inside the backend directory changed, rather than on every merge to <code>main</code>. A faulty backend version had slipped into production unmonitored while our local branches assumed they were hitting stable APIs.</li>
  <li><strong>The Cost of Lax Early Planning:</strong> We initially approached our frontend design too casually. Early in our sprint, the lack of architectural clarity caught up with us, forcing our entire team to halt development for a full day to realign on UI layout and screen flow. While the pivot saved the project, it proved that thorough upfront documentation pays massive dividends.</li>
  <li><strong>The Infamous Scope Creep:</strong> With achievements, level curves, custom charts, break timers, and dozens of distinct views, our feature set ballooned. Even during the final week, our team was working through the weekend to polish styles and resolve layout quirks before submission.</li>
</ol>

<h2>Reflections</h2>
<p>Despite the weekend crunch and the CI/CD firefighting, GymBro was an overwhelming success. Our team demonstrated remarkable grit, every member stepped up to deliver their piece, and seeing our gamified APK running smoothly on real Android devices made every hour of effort worthwhile.</p>`,
  },
];
