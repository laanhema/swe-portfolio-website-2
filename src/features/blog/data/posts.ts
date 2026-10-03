import type { BlogPost } from '../types';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'tralla',
    projectTitle: 'Tralla',
    title: 'NgRx SignalStore patterns I keep reaching for',
    titleHighlight: 'reaching for.',
    summary:
      "How Tralla's board state stayed small: feature stores, computed selectors and the one rule I'd break again.",
    author: 'Lauri Makkonen',
    date: '2026-09-18',
    displayDate: 'Sep 18, 2026',
    readingTime: '8 min read',
    excerpt:
      "How Tralla's board state stayed small: feature stores, computed selectors and the one rule I'd break again.",
    tags: ['Angular', 'NgRx', 'SignalStore', 'TypeScript'],
    accentColor: '#00e5ff',
    content: `<p>Tralla started as a weekend Kanban clone and grew into the project where I finally stopped fighting state management. Building drag-and-drop boards often collapses into mutation chaos, but Angular's signal primitives and NgRx SignalStore gave the board predictable structure without the ceremonial boilerplate of classic Redux.</p>

<h2>One store per feature</h2>
<p>The architectural rule I established early was simple: if two components need the same data, it belongs in a store; if only one component needs it, it remains local component state. Angular's signals guide covers the primitives, while SignalStore brings composable state slices, methods, and lifecycle hooks into a single declarative tree.</p>

<ul>
  <li>Feature stores rather than a single monolithic global store</li>
  <li>Computed selectors for all derived properties and aggregations</li>
  <li>Dedicated methods for state transitions—never call <code>patchState</code> directly from template components</li>
  <li>Immutable updates wrapped with immutability helpers</li>
</ul>

<pre><code><span class="text-[#ff3e00]">export const</span> BoardStore = <span class="text-[#00e5ff]">signalStore</span>(
  <span class="text-[#00e5ff]">withState</span>({ columns: [] <span class="text-[#ff3e00]">as</span> <span class="text-[#facc15]">Column</span>[] }),
  <span class="text-[#00e5ff]">withComputed</span>(({ columns }) =&gt; ({
    cardCount: <span class="text-[#00e5ff]">computed</span>(() =&gt; columns().<span class="text-[#00e5ff]">reduce</span>((n, c) =&gt; n + c.cards.length, <span class="text-[#facc15]">0</span>)),
    columnsWithWipLimit: <span class="text-[#00e5ff]">computed</span>(() =&gt; columns().<span class="text-[#00e5ff]">filter</span>(c =&gt; c.wipLimit &gt; <span class="text-[#facc15]">0</span>)),
  })),
  <span class="text-[#00e5ff]">withMethods</span>((store) =&gt; ({
    moveCard(cardId: <span class="text-[#facc15]">string</span>, targetColumnId: <span class="text-[#facc15]">string</span>, targetIndex: <span class="text-[#facc15]">number</span>) {
      <span class="text-[#00e5ff]">patchState</span>(store, (state) =&gt; {
        <span class="text-[#00e5ff]">return</span> transferCard(state.columns, cardId, targetColumnId, targetIndex);
      });
    },
  }))
);</code></pre>

<blockquote>Derived state is a bug you haven't written yet. Always compute it.</blockquote>

<h3>When I broke the rule for optimistic updates</h3>
<p>Drag-and-drop operations demand instant visual feedback. Waiting for backend validation or full tree reconciliations during mouse movement causes frame drops. To solve this, the column component temporarily maintains a short-lived projection of its cards during drag interactions before the store commits the final drop event.</p>

<table>
  <thead>
    <tr>
      <th>Pattern</th>
      <th>Where Applied</th>
      <th>Benefit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>withComputed</code></td>
      <td>Card counts, WIP warnings, search filters</td>
      <td>Zero manual cache invalidation bugs</td>
    </tr>
    <tr>
      <td><code>withMethods</code></td>
      <td>Card moves, column reordering, archiving</td>
      <td>Enforces unidirectional data flow</td>
    </tr>
    <tr>
      <td><code>rxMethod</code></td>
      <td>Persistence sync &amp; network debouncing</td>
      <td>Declarative async side effects with clean teardown</td>
    </tr>
  </tbody>
</table>

<h2>Takeaways</h2>
<p>SignalStore hits the sweet spot between lightweight reactivity and enterprise-grade maintainability. By separating state queries into pure signals and mutations into distinct store methods, Tralla avoided the sprawling reducer files of older NgRx implementations while keeping card reordering 100% testable.</p>`,
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
    readingTime: '6 min read',
    excerpt:
      'Inside Distill: rendering a page, sampling every computed colour and clustering them into a palette.',
    tags: ['Next.js', 'Playwright', 'Culori', 'Design Tokens'],
    accentColor: '#a855f7',
    content: `<p>Extracting a visual design system from an arbitrary website sounds straightforward until you inspect modern production frontends: CSS variables nested within shadow DOMs, canvas overlays, and dozens of near-identical hex codes generated by transparency gradients. Distill automates this reverse-engineering pipeline by combining headless browser execution with color science.</p>

<h2>Evaluating the live DOM tree</h2>
<p>Regex matching raw stylesheets doesn't work because dynamic CSS-in-JS and build-time CSS modules obscure actual rendered values. Instead, Distill launches a headless Chromium instance via Playwright, waits for network idle, and executes an in-page evaluation script that inspects every visible element's computed styles.</p>

<ul>
  <li>Inspect <code>window.getComputedStyle(element)</code> across all visible DOM nodes</li>
  <li>Filter out transparent backgrounds and elements with zero bounding box area</li>
  <li>Weight sampled colors by their viewport surface area to prioritize prominent palette tones</li>
  <li>Capture typography rules (font families, weights, scale ratios) concurrently</li>
</ul>

<pre><code><span class="text-[#ff3e00]">const</span> sampledColors = <span class="text-[#ff3e00]">await</span> page.<span class="text-[#00e5ff]">evaluate</span>(() =&gt; {
  <span class="text-[#ff3e00]">const</span> elements = Array.<span class="text-[#00e5ff]">from</span>(document.<span class="text-[#00e5ff]">querySelectorAll</span>(<span class="text-[#facc15]">'*'</span>));
  <span class="text-[#ff3e00]">return</span> elements.<span class="text-[#00e5ff]">map</span>((el) =&gt; {
    <span class="text-[#ff3e00]">const</span> style = window.<span class="text-[#00e5ff]">getComputedStyle</span>(el);
    <span class="text-[#ff3e00]">const</span> rect = el.<span class="text-[#00e5ff]">getBoundingClientRect</span>();
    <span class="text-[#00e5ff]">return</span> {
      color: style.color,
      background: style.backgroundColor,
      area: rect.width * rect.height,
    };
  }).<span class="text-[#00e5ff]">filter</span>(entry =&gt; entry.area &gt; <span class="text-[#facc15]">0</span>);
});</code></pre>

<blockquote>Human perception does not perceive RGB linearly. Color distance must be calculated in perceptual color spaces like CIELAB.</blockquote>

<h3>Clustering palette swatches with Culori</h3>
<p>A single landing page can easily return 1,200 unique hex codes due to shadows and anti-aliasing. Using Culori's implementation of CIELAB and Delta-E (CMC / 2000), Distill clusters perceptually identical colors into coherent primary, surface, and accent tokens.</p>

<table>
  <thead>
    <tr>
      <th>Stage</th>
      <th>Tool</th>
      <th>Latency / Trade-off</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>DOM Rendering</td>
      <td>Playwright Chromium</td>
      <td>~1.2s per URL, cached across sessions</td>
    </tr>
    <tr>
      <td>Color Science</td>
      <td>Culori Delta-E (CIE2000)</td>
      <td>O(n log n) k-means clustering in memory</td>
    </tr>
    <tr>
      <td>Token Export</td>
      <td>Next.js Server Actions</td>
      <td>Instant JSON and Tailwind config generation</td>
    </tr>
  </tbody>
</table>

<h2>Architecture Lessons</h2>
<p>Running headless browsers in serverless environments brings cold start challenges and memory caps. Moving the browser automation into containerized background workers and streaming token extraction results via Next.js Server Actions resulted in a resilient user experience that turns any live website into reusable design tokens in seconds.</p>`,
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
    content: `<p>Froots was born from a simple annoyance: most smoothie apps either overwhelm you with bloated social feeds or fail to calculate real-time nutritional values when you tweak ingredient ratios. I wanted a fast, tactile web tool where changing 50 grams of blueberries instantly updates calories, macronutrient splits, and glycemic indexes across the entire interface.</p>

<h2>Why Svelte excelled for instant reactivity</h2>
<p>When computing formulas across dozens of interrelated ingredients, virtual DOM overhead can quickly become bottlenecked by excessive re-render cycles. Svelte compiles reactivity into fine-grained DOM surgical updates, making real-time calculations feel effortless and immediate.</p>

<ul>
  <li>Runes provide explicit, signal-based reactive state with zero boilerplate</li>
  <li>Derived calculations execute synchronously without complex memoization hooks</li>
  <li>Zero virtual DOM reconciliation layer means ultra-low latency on mobile devices</li>
  <li>Clean Tailwind integration gives punchy visual feedback on nutritional thresholds</li>
</ul>

<pre><code><span class="text-[#ff3e00]">let</span> ingredients = <span class="text-[#00e5ff]">$state</span>([
  { id: <span class="text-[#facc15]">'spinach'</span>, name: <span class="text-[#facc15]">'Baby Spinach'</span>, grams: <span class="text-[#facc15]">60</span>, kcalPer100g: <span class="text-[#facc15]">23</span>, protein: <span class="text-[#facc15]">2.9</span> },
  { id: <span class="text-[#facc15]">'banana'</span>, name: <span class="text-[#facc15]">'Banana'</span>, grams: <span class="text-[#facc15]">120</span>, kcalPer100g: <span class="text-[#facc15]">89</span>, protein: <span class="text-[#facc15]">1.1</span> },
]);

<span class="text-[#ff3e00]">let</span> totalNutrition = <span class="text-[#00e5ff]">$derived</span>(
  ingredients.<span class="text-[#00e5ff]">reduce</span>((acc, item) =&gt; {
    <span class="text-[#ff3e00]">const</span> ratio = item.grams / <span class="text-[#facc15]">100</span>;
    <span class="text-[#00e5ff]">return</span> {
      calories: acc.calories + item.kcalPer100g * ratio,
      protein: acc.protein + item.protein * ratio,
    };
  }, { calories: <span class="text-[#facc15]">0</span>, protein: <span class="text-[#facc15]">0</span> })
);</code></pre>

<blockquote>The best state management is the state management you never have to configure.</blockquote>

<h3>Balancing accuracy with snappy UX</h3>
<p>Nutritional calculations require handling unit conversions (grams, ounces, milliliters) and rounding errors gracefully. The calculation engine separates raw decimal precision from formatted presentation values, preventing jittery layout shifts as users drag proportion sliders.</p>

<table>
  <thead>
    <tr>
      <th>Ingredient Type</th>
      <th>Base Unit</th>
      <th>Macro Density Factor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Leafy Greens</td>
      <td>Weight (g)</td>
      <td>Low calorie, high micronutrient density</td>
    </tr>
    <tr>
      <td>Frozen Fruits</td>
      <td>Weight (g)</td>
      <td>Natural fructose &amp; fiber balancing</td>
    </tr>
    <tr>
      <td>Liquid Bases</td>
      <td>Volume (ml)</td>
      <td>Density-adjusted viscosity multiplier</td>
    </tr>
  </tbody>
</table>

<h2>Simplicity as an Architectural Priority</h2>
<p>Working with Svelte reaffirmed that choosing the right tool for the job beats default industry inertia. By avoiding over-engineered global state libraries and letting Svelte's compiler do the heavy lifting, Froots delivers a sub-50KB bundle that boots instantly and reacts without a single stutter.</p>`,
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
    content: `<p>GymBro was created to solve a personal frustration with existing workout trackers: excessive subscriptions, clunky logging flows during rest periods, and no genuine sense of progression. I wanted an RPG-style gamification loop where every bench press, squat, and pull-up translates directly into experience points, leveling up character attributes.</p>

<h2>Hybrid mobile with Ionic and Angular</h2>
<p>To move quickly without maintaining dual Swift and Kotlin codebases, I built GymBro on Ionic Capacitor with Angular. This allowed rapid web prototyping while delivering native device capabilities such as local SQLite offline storage, haptic feedback during timers, and background workout session preservation.</p>

<ul>
  <li>Angular modular architecture separating workout routines from character leveling mechanics</li>
  <li>Capacitor plugins providing direct access to native vibration motors and screen wake locks</li>
  <li>Node.js / Express backend with MongoDB managing user profiles and synced workout logs</li>
  <li>Offline-first SQLite caching so gym sessions never suffer from dead basement signal</li>
</ul>

<pre><code><span class="text-[#ff3e00]">export class</span> <span class="text-[#facc15]">WorkoutSessionService</span> {
  <span class="text-[#00e5ff]">async</span> finishSession(session: <span class="text-[#facc15]">WorkoutSession</span>): <span class="text-[#facc15]">Promise</span>&lt;<span class="text-[#facc15]">XpReward</span>&gt; {
    <span class="text-[#ff3e00]">const</span> calculatedXp = <span class="text-[#ff3e00]">this</span>.<span class="text-[#00e5ff]">calculateVolumeXp</span>(session.exercises);
    <span class="text-[#ff3e00]">await</span> <span class="text-[#ff3e00]">this</span>.storage.<span class="text-[#00e5ff]">saveLocalSession</span>({ ...session, xpEarned: calculatedXp });
    <span class="text-[#ff3e00]">this</span>.haptics.<span class="text-[#00e5ff]">vibrateLevelUpPattern</span>();
    <span class="text-[#00e5ff]">return</span> <span class="text-[#ff3e00]">this</span>.syncQueue.<span class="text-[#00e5ff]">enqueueForSync</span>(session);
  }
}</code></pre>

<blockquote>If your mobile app relies on gym basement Wi-Fi to save a workout set, your user will delete it on day two. Build offline-first.</blockquote>

<h3>Distributing signed APKs via Amazon S3</h3>
<p>Rather than dealing with the Google Play Store console review queues during early testing, I configured a direct APK distribution pipeline. GitHub Actions builds the Android release bundle, signs it with a production keystore, and deploys the APK alongside a download landing page directly to an Amazon S3 static bucket.</p>

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
      <td>Mobile Core</td>
      <td>Ionic + Capacitor</td>
      <td>Cross-platform runtime &amp; native bridges</td>
    </tr>
    <tr>
      <td>Local Storage</td>
      <td>Capacitor SQLite</td>
      <td>Guaranteed offline workout logging</td>
    </tr>
    <tr>
      <td>Cloud Distribution</td>
      <td>AWS S3 + CloudFront</td>
      <td>Zero-friction direct APK downloads</td>
    </tr>
  </tbody>
</table>

<h2>What I'd change with a formal store release</h2>
<p>While direct APK delivery was fantastic for rapid alpha feedback, Android's security warnings on sideloaded packages create friction for mainstream users. For a production release, moving to Google Play App Bundles (.aab) with automated fastlane deployment would eliminate security prompts and enable automated in-app delta updates.</p>`,
  },
];
