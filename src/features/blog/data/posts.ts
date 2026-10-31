import type { BlogPost } from '../types';

export const BLOG_POSTS = [
  {
    slug: 'tralla',
    title: 'Rebuilding Trello with Angular and SignalStore',
    titleHighlight: 'SignalStore.',
    summary:
      'Replacing slow, paywalled project boards with a lightweight Kanban app built in Angular and SignalStore.',
    author: 'Lauri Makkonen',
    date: '2026-09-18',
    readingTime: '6 min read',
    tags: ['Angular', 'NgRx', 'SignalStore', 'TypeScript'],
    accentColor: 'var(--color-accent-cyan)',
    content: `<p>I rely on Kanban boards every day. A flat to-do list doesn&apos;t show what&apos;s actually in progress or stuck. But tools like Trello keep locking basic features behind paid plans, and commercial boards feel sluggish.</p>
<p>Tralla started because I wanted a fast, focused board for my own workflow. No enterprise upsells, just columns and cards that move when you tell them to.</p>

<h2>Architectural foundation: mobile-first</h2>
<p>I built Tralla mobile-first. If navigation and headers work on a phone screen, expanding them to a monitor takes very little effort. Doing it the other way around usually means rewriting half the layout.</p>
<p>Instead of building inputs and dialogs from scratch, I pulled in Taiga UI (<code>TuiElements</code>) styled with LESS. That gave me accessible buttons, inputs, and modals so I could spend my time on state management instead of reinventing form controls.</p>

<div class="brutal-table-wrapper">
<table>
  <thead>
    <tr>
      <th>Component</th>
      <th>Technology</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Frontend Framework</strong></td>
      <td>Angular + TypeScript</td>
      <td>Standalone architecture with signals and control flow</td>
    </tr>
    <tr>
      <td><strong>State Management</strong></td>
      <td>NgRx SignalStore</td>
      <td>Central store for boards, lists, and tasks</td>
    </tr>
    <tr>
      <td><strong>UI Components</strong></td>
      <td>Taiga UI</td>
      <td>Inputs, buttons, and dialogs</td>
    </tr>
    <tr>
      <td><strong>Styling Engine</strong></td>
      <td>LESS</td>
      <td>Modular component styling</td>
    </tr>
  </tbody>
</table>
</div>

<h2>Managing state with NgRx SignalStore</h2>
<p>Boards with nested columns and drag-and-drop cards turn into a mess of mutable references quickly if state isn&apos;t centralized. I used NgRx SignalStore as a singleton store for the whole board.</p>
<p>Instead of mutating arrays in place, state changes go through store actions and <code>patchState</code>. That keeps mutations in one place and makes board state predictable.</p>

<pre><code><span class="text-gray-400">// creates a new task</span>
<span class="text-accent-cyan">createNewTask</span>(boardId: <span class="text-accent-yellow">number</span>, listId: <span class="text-accent-yellow">number</span>) {
  <span class="text-accent">const</span> currentTasks = <span class="text-accent">this</span>.<span class="text-accent-cyan">getTasksByListId</span>(boardId, listId);
  <span class="text-accent">const</span> lastUsedId = currentTasks.length &gt; <span class="text-accent-yellow">0</span> ? currentTasks[currentTasks.length - <span class="text-accent-yellow">1</span>].tid : <span class="text-accent-yellow">1</span>;

  <span class="text-accent">const</span> newTask: <span class="text-accent-yellow">ITask</span> = {
    tid: lastUsedId + <span class="text-accent-yellow">1</span>,
    title: <span class="text-accent-yellow">''</span>,
    taskDone: <span class="text-accent">false</span>,
  };

  <span class="text-accent">const</span> update = store.<span class="text-accent-cyan">boards</span>().<span class="text-accent-cyan">map</span>((x) =&gt; {
    <span class="text-accent">if</span> (x.bid !== boardId) <span class="text-accent">return</span> x;

    <span class="text-accent">return</span> {
      ...x,
      content: x.content.<span class="text-accent-cyan">map</span>((x) =&gt; {
        <span class="text-accent">if</span> (x.lid !== listId) <span class="text-accent">return</span> x;

        <span class="text-accent">return</span> {
          ...x,
          content: [...currentTasks, newTask],
        };
      }),
    };
  });

  <span class="text-accent-cyan">patchState</span>(store, { boards: update });
}</code></pre>

<h2>Modern Angular features</h2>
<p>Tralla was my testbed for recent Angular features:</p>
<ul>
  <li>Built-in control flow (<code>@if</code>, <code>@else</code>, <code>@for</code>) and signal primitives replaced older RxJS patterns in templates.</li>
  <li>Signal-based inputs pass data down to child components cleanly.</li>
  <li>Two-way <code>[(ngModel)]</code> bindings handle inline title edits, paired with dynamic class bindings for visual state.</li>
  <li><code>ActivatedRoute</code> and <code>routerLink</code> switch boards in the top navigation without full page reloads.</li>
  <li><code>HttpClient</code> handles async API calls with RxJS streams.</li>
</ul>

<h2>What comes next</h2>
<p>The frontend and local store work well. The next steps are:</p>
<ol>
  <li>Writing a backend service for sync and user accounts, weighing Express and MongoDB against MySQL.</li>
  <li>Deploying the frontend to production.</li>
</ol>`,
  },
  {
    slug: 'distill-design-scraper',
    title: 'Scraping design tokens with Playwright and Culori',
    titleHighlight: 'Culori.',
    summary:
      'Rendering a live page, sampling computed colors, and clustering them into a design palette with Playwright and Culori.',
    author: 'Lauri Makkonen',
    date: '2026-08-30',
    readingTime: '5 min read',
    tags: ['Next.js', 'Playwright', 'Culori', 'Design Tokens'],
    accentColor: 'var(--color-accent-purple)',
    content: `<p>I started Distill Design Scraper in summer 2026. It was my first project built mainly with AI coding agents. Instead of writing every line manually, I spent most of my time directing agent workflows: structuring context, building prompt skills, and verifying generated code against live sites.</p>

<h2>Extracting design tokens from real sites</h2>
<p>When you find a site with great visual polish, inspecting its styles by hand is painful. Sifting through utility classes, CSS variables, and bundled stylesheets takes hours, and copying raw CSS doesn&apos;t show you the underlying design rules.</p>
<p>Distill automates that breakdown:</p>
<ul>
  <li>It visits a target site in headless Chromium, samples computed styles across the DOM tree, and takes a full-page screenshot.</li>
  <li>Instead of copying stylesheet code, it turns computed values into a structured Markdown design spec covering typography, spacing, and colors.</li>
  <li>You can use that spec as a design brief or hand it to a coding agent as styling rules for a new project.</li>
</ul>

<div class="brutal-table-wrapper">
<table>
  <thead>
    <tr>
      <th>Component</th>
      <th>Technology</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Web Scraping Engine</strong></td>
      <td>Playwright (Chromium)</td>
      <td>DOM style evaluation and full-page screenshot capture</td>
    </tr>
    <tr>
      <td><strong>Color Science Engine</strong></td>
      <td>Culori</td>
      <td>CIELAB color conversion and Delta-E distance clustering</td>
    </tr>
    <tr>
      <td><strong>Design Synthesis</strong></td>
      <td>Multimodal LLMs (BYOK)</td>
      <td>Generates Markdown design specs from rendered data and screenshots</td>
    </tr>
    <tr>
      <td><strong>Frontend UI</strong></td>
      <td>Next.js + TypeScript</td>
      <td>Interface for target inspection and palette review</td>
    </tr>
    <tr>
      <td><strong>Local Deployment</strong></td>
      <td>Docker</td>
      <td>Local container so API keys stay on your machine</td>
    </tr>
  </tbody>
</table>
</div>

<h2>Color clustering: why naive hex matching fails</h2>
<p>Pulling a clean palette from a website sounds simple until you inspect real production CSS. Semi-transparent overlays, box shadows, anti-aliased borders, and CSS variables mean a single landing page can easily return over a thousand hex values.</p>
<p>Simple RGB distance math fails because human eyes do not perceive color differences linearly. Two shades that look nearly identical to a computer can look visibly different to a person, and vice versa. Distill works around this in three steps:</p>
<ol>
  <li>Playwright evaluates computed styles directly on rendered DOM elements.</li>
  <li>Extracted colors are converted from sRGB into the perceptual CIELAB color space.</li>
  <li>Culori calculates Delta-E color differences to group raw color swatches into semantic roles like background, surface, text, and accent.</li>
</ol>

<pre><code><span class="text-gray-400">/** Nearest palette role for a measured CSS color, or null if nothing is close enough. */</span>
<span class="text-accent">export function</span> <span class="text-accent-cyan">nearestPaletteRole</span>(
  colorValue: <span class="text-accent-yellow">string</span>,
  palette: <span class="text-accent-yellow">Palette</span>,
): <span class="text-accent-yellow">ColorRole</span> | <span class="text-accent">null</span> {
  <span class="text-accent">const</span> parsed = <span class="text-accent-cyan">parseColor</span>(colorValue);
  <span class="text-accent">if</span> (!parsed) <span class="text-accent">return null</span>;

  <span class="text-accent">let</span> best: <span class="text-accent-yellow">ColorRole</span> | <span class="text-accent">null</span> = <span class="text-accent">null</span>;
  <span class="text-accent">let</span> bestDist = <span class="text-accent-yellow">Infinity</span>;
  <span class="text-accent">for</span> (<span class="text-accent">const</span> swatch <span class="text-accent">of</span> palette.colors) {
    <span class="text-accent">const</span> swatchColor = <span class="text-accent-cyan">parseColor</span>(swatch.hex);
    <span class="text-accent">if</span> (!swatchColor) <span class="text-accent">continue</span>;
    <span class="text-accent">const</span> dist = <span class="text-accent-cyan">deltaE</span>(parsed, swatchColor);
    <span class="text-accent">if</span> (dist &lt; bestDist &amp;&amp; swatch.role) {
      bestDist = dist;
      best = swatch.role;
    }
  }
  <span class="text-accent">return</span> bestDist &lt;= ROLE_MATCH_DELTA_E ? best : <span class="text-accent">null</span>;
}</code></pre>

<h2>Deployment plans</h2>
<p>Distill is still an active project. The next step is making it easy for other people to run.</p>
<p>The vision analysis step requires an LLM API key. Asking people to paste private API keys into a hosted public web app is a bad idea. A self-hosted Docker container is a safer fit because keys stay on the user&apos;s machine.</p>`,
  },
  {
    slug: 'froots-smoothie-app',
    title: 'Svelte reactivity and nutritional math in Froots',
    titleHighlight: 'Froots.',
    summary:
      'Building a snappy nutritional calculator with Svelte runes and keeping UI state simple without a backend.',
    author: 'Lauri Makkonen',
    date: '2026-08-05',
    readingTime: '6 min read',
    tags: ['Svelte', 'TypeScript', 'Tailwind', 'State'],
    accentColor: 'var(--color-accent-yellow)',
    content: `<p>Froots is a smoothie recipe app built by our student team. You can look up nutritional stats for different ingredients, mix your own recipes, and save custom blends.</p>

<h2>Sprint structure</h2>
<p>We had four weeks to take the project from zero to a deployed app. As lead developer, I managed the repository, reviewed pull requests, and kept merges from breaking main.</p>
<p>We split our four-person team in two:</p>
<ul>
  <li>Two teammates designed UI in Figma, built branding, and handled project documentation.</li>
  <li>Two of us handled frontend implementation, state management, and API calls.</li>
</ul>
<p>We used a Trello board for daily tasks and ran a short retro every Friday to check what was left.</p>

<div class="brutal-table-wrapper">
<table>
  <thead>
    <tr>
      <th>Phase</th>
      <th>Timeline</th>
      <th>Deliverables</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Planning</strong></td>
      <td>Week 1</td>
      <td>Concept experimentation and architecture</td>
    </tr>
    <tr>
      <td><strong>Core Build</strong></td>
      <td>Weeks 2&ndash;3</td>
      <td>Implementation, component layout, and API calls</td>
    </tr>
    <tr>
      <td><strong>Launch</strong></td>
      <td>Week 4</td>
      <td>Video demo, slide deck, documentation, and Netlify deployment</td>
    </tr>
  </tbody>
</table>
</div>

<h2>Building with Svelte 5 by hand</h2>
<p>We picked Svelte 5, TypeScript, and Tailwind. Svelte 5 had just been released, and its runes syntax was brand new. Because AI models had almost no training data on runes yet, they kept generating broken Svelte 4 code. We had to write and debug almost everything by hand, only using AI for repetitive JSON formatting.</p>
<p>Writing Svelte 5 manually turned out to be the best way to understand its reactive model:</p>
<ul>
  <li>Runes like <code>$state</code>, <code>$derived</code>, <code>$derived.by</code>, and <code>$effect</code> handle reactivity without compiler magic.</li>
  <li>Component props pass cleanly with <code>$props</code> and <code>$bindable()</code>.</li>
  <li>Snippets, <code>@if</code>, <code>@render</code>, and <code>{#each}</code> blocks make templates readable.</li>
  <li><code>$inspect</code> provides reactive console logging without manual subscriptions.</li>
  <li><code>svelte/transition</code> handles animations without external libraries.</li>
</ul>

<h2>Data fetching and local storage</h2>
<p>We connected the FruityVice API to fetch nutritional data for fruits.</p>
<p>Our team had not taken backend courses yet, so we handled persistence directly in the browser:</p>
<ul>
  <li>Default recipes live in a bundled JSON file.</li>
  <li>On first visit, the app seeds those recipes into <code>LocalStorage</code>.</li>
  <li>When a user creates a new smoothie or changes amounts, the update saves directly to <code>LocalStorage</code>.</li>
</ul>
<p>Recipes persist across reloads without needing a server or database.</p>

<pre><code><span class="text-gray-400">// luo uuden smoothien ja uuden smoothieKortin ja lis&auml;&auml; kummatkin globaleihin taulukoihin + poistuu takaisin etusivulle</span>
<span class="text-accent">function</span> <span class="text-accent-cyan">createSmoothie</span>() {
  <span class="text-accent">const</span> maxId = globalSmoothies
    .<span class="text-accent-cyan">get</span>()
    .<span class="text-accent-cyan">reduce</span>((max, smoothie) =&gt; (smoothie.id &gt; max ? smoothie.id : max), -<span class="text-accent-yellow">1</span>);
  <span class="text-accent">const</span> newSmoothie: <span class="text-accent-yellow">Smoothie</span> = {
    id: maxId + <span class="text-accent-yellow">1</span>,
    name: uudenSmoothienNimi,
    ingredients: uudenSmoothienIngredients,
    ingredientsAmount: uudenSmoothienIngredientsAmounts,
    pic: <span class="text-accent-yellow">"/images/default-faded-leaf.jpg"</span>,
    preparationTimeMinutes: uudenSmoothienValmistusaika,
    notes: uudenSmoothienNotet,
  };

  <span class="text-accent-cyan">luoSmoothieKortti</span>(newSmoothie, <span class="text-accent">true</span>);
  globalSmoothies.<span class="text-accent-cyan">get</span>().<span class="text-accent-cyan">unshift</span>(newSmoothie);
  <span class="text-gray-400">// p&auml;ivitet&auml;&auml;n localStoragen muuttuja smoothiesLS</span>
  localStorage.<span class="text-accent-cyan">setItem</span>(<span class="text-accent-yellow">"smoothiesLS"</span>, JSON.<span class="text-accent-cyan">stringify</span>(globalSmoothies.<span class="text-accent-cyan">get</span>()));
  <span class="text-accent-cyan">homePage</span>();
}</code></pre>

<h2>What broke and what we learned</h2>
<p>Several things went wrong during development:</p>
<ol>
  <li>A missing <code>await</code> broke rendering. During initial API work, an un-awaited call ran half-sync and half-async. Svelte updated the view before data arrived, blanking the recipe list.</li>
  <li>Heavy images slowed down page loads. The build still has noticeable load delay because we bundled raw photos. It was a clear reminder to convert photos to WebP and compress them before bundling.</li>
  <li>Chrome and Firefox rendered background images differently, proving why cross-browser testing matters during early development.</li>
  <li>I spent too much time heads-down in the editor and should have communicated more with teammates during tricky integration days.</li>
  <li>Starting with a small MVP kept us on schedule. Getting the core calculator working early gave us time to build mobile layouts, squash responsive bugs, and sneak in a Rickroll easter egg before deploying to Netlify.</li>
</ol>

<h2>Final takeaways</h2>
<p>Shipping on a brand new framework under a four-week deadline was demanding, but seeing the whole thing run cleanly made the effort worth it.</p>`,
  },
  {
    slug: 'gymbro-app',
    title: 'Shipping an Android APK from an S3 bucket',
    titleHighlight: 'S3 bucket.',
    summary:
      'Shipping an Android workout tracker with Ionic and Angular, distributing the APK from S3, and managing team scope.',
    author: 'Lauri Makkonen',
    date: '2026-07-12',
    readingTime: '5 min read',
    tags: ['Ionic', 'Angular', 'Express', 'AWS'],
    accentColor: 'var(--color-accent)',
    content: `<p>GymBro was a five-person student project where we wanted to turn workout logging into an RPG. Finishing an exercise session awards XP, raises your level, and unlocks achievements. The idea was to make consistent gym tracking feel rewarding rather than repetitive.</p>

<h2>Core application features</h2>
<p>GymBro covers the main tools you need during training:</p>
<ul>
  <li>Custom workout routines with user-defined exercises and sets.</li>
  <li>Live workout tracking with built-in rest timers and a calendar log.</li>
  <li>Volume and personal record charts powered by Chart.js to track progress across muscle groups.</li>
  <li>A high-contrast dark and yellow theme that stays legible in dim gym lighting.</li>
</ul>

<h2>Full-stack mobile setup</h2>
<p>To build an Android app without maintaining separate native codebases, we used Ionic Capacitor with Angular and generated an APK.</p>
<p>The architecture supports user logins, synced workout logs, and stats tracking:</p>

<div class="brutal-table-wrapper">
<table>
  <thead>
    <tr>
      <th>System Layer</th>
      <th>Technology</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Mobile Client</strong></td>
      <td>Ionic Capacitor + Angular</td>
      <td>Hybrid mobile app compiled into an installable Android APK</td>
    </tr>
    <tr>
      <td><strong>Backend API</strong></td>
      <td>Node.js + Express</td>
      <td>REST endpoints for workout logging, XP calculations, and accounts</td>
    </tr>
    <tr>
      <td><strong>Database</strong></td>
      <td>MongoDB Atlas</td>
      <td>Document store with Mongoose schemas matching frontend data models</td>
    </tr>
    <tr>
      <td><strong>Authentication</strong></td>
      <td>Google OAuth + JWT</td>
      <td>Token verification middleware, HTTP interceptors, and route guards</td>
    </tr>
    <tr>
      <td><strong>Data Analytics</strong></td>
      <td>Chart.js</td>
      <td>Volume, PR, and muscle group charts</td>
    </tr>
    <tr>
      <td><strong>Cloud &amp; Hosting</strong></td>
      <td>AWS</td>
      <td>API hosting and deployment</td>
    </tr>
  </tbody>
</table>
</div>

<h2>Managing a team while using AI coding tools</h2>
<p>We used AI coding tools for boilerplate, which changed how I spent my time as project lead. Instead of writing every CRUD route and data transform by hand, I spent more time reviewing PRs, checking in on teammates, and unblocking people when work stalled. It made the role feel much more like coordinating an engineering team than just churning out syntax.</p>

<pre><code><span class="text-accent">const</span> jwt = <span class="text-accent-cyan">require</span>(<span class="text-accent-yellow">"jsonwebtoken"</span>);

<span class="text-accent">const</span> <span class="text-accent-cyan">verifyToken</span> = (req, res, next) =&gt; {
  <span class="text-accent">try</span> {
    <span class="text-accent">const</span> authHeader =
      req.headers[<span class="text-accent-yellow">"authorization"</span>] || req.headers[<span class="text-accent-yellow">"Authorization"</span>];
    <span class="text-accent">if</span> (!authHeader || !authHeader.<span class="text-accent-cyan">startsWith</span>(<span class="text-accent-yellow">"Bearer "</span>)) {
      <span class="text-accent">return</span> res.<span class="text-accent-cyan">status</span>(<span class="text-accent-yellow">401</span>).<span class="text-accent-cyan">json</span>({ error: <span class="text-accent-yellow">"Unauthorized"</span> });
    }

    <span class="text-accent">const</span> token = authHeader.<span class="text-accent-cyan">split</span>(<span class="text-accent-yellow">" "</span>)[<span class="text-accent-yellow">1</span>];
    <span class="text-accent">const</span> decoded = jwt.<span class="text-accent-cyan">verify</span>(token, process.env.JWT_SECRET);
    req.user = decoded;
    <span class="text-accent-cyan">next</span>();
  } <span class="text-accent">catch</span> {
    <span class="text-accent">return</span> res.<span class="text-accent-cyan">status</span>(<span class="text-accent-yellow">401</span>).<span class="text-accent-cyan">json</span>({ error: <span class="text-accent-yellow">"Invalid token."</span> });
  }
};

module.exports = verifyToken;</code></pre>

<h2>Deployment bugs and scope creep</h2>
<p>We ran into several messy problems along the way:</p>
<ol>
  <li>A broken CI/CD trigger stopped everyone. Mid-sprint, team branches started failing against the API. After hours of debugging, we found the issue in our AWS script: deploys only ran when files inside the backend directory changed. An earlier broken build had slipped in, and later merges had never replaced it.</li>
  <li>Skipping early planning cost us a full day. We started writing components before settling on screen navigation. Two weeks in, screens didn&apos;t connect logically, and the entire team had to stop coding for a day to map out user flows on a whiteboard.</li>
  <li>Scope creep caught up with us. Adding level curves, custom charts, rest timers, and achievement badges expanded the backlog. We ended up working through the final weekend to fix layout bugs before the deadline.</li>
</ol>

<h2>Reflections</h2>
<p>Seeing the APK install and run smoothly on our phones made the crunch worth it, and navigating those setbacks taught us a lot about team planning and deployment discipline.</p>`,
  },
] as const satisfies readonly BlogPost[];

export type PostSlug = (typeof BLOG_POSTS)[number]['slug'];
