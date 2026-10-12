// Fails when a class string documented in a design-system component README no longer appears in src/.
// Agents copy those strings into new UI (AGENTS.md), so a stale one spreads the old styling.
// A class string is a backticked span of two or more Tailwind-shaped tokens; `…` stands for classes
// left out, and each side of it must appear verbatim. A span with a placeholder such as `bg-[accent]`
// is skipped. Usage: node scripts/check-design-system.mjs
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const COMPONENTS = '.agents/design-system/laanhema-design-system/components';
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
const source = walk('src').filter((f) => /\.(tsx?|css)$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n');

const TOKEN = /^[a-z0-9][a-z0-9-]*(:[a-z0-9-]+)*(-?\[[#a-z0-9,.%-]+\])?$/;
const PLACEHOLDER = /\[[a-z]+\]/;
let checked = 0;
const stale = [];
for (const dir of readdirSync(COMPONENTS).sort()) {
  const file = join(COMPONENTS, dir, 'README.md');
  if (!existsSync(file)) continue;
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    for (const [, span] of line.matchAll(/`([^`]+)`/g)) {
      const tokens = span.split(/\s+/).filter((t) => t !== '…');
      if (tokens.length < 2 || !tokens.every((t) => TOKEN.test(t)) || PLACEHOLDER.test(span)) continue;
      checked++;
      const missing = span.split('…').map((part) => part.trim()).filter((part) => part && !source.includes(part));
      if (missing.length) stale.push(`${file}:${i + 1}: \`${missing.join('` and `')}\``);
    }
  });
}
if (stale.length) {
  console.error(`design-system: ${stale.length} documented class string(s) not found in src/:\n${stale.join('\n')}`);
  process.exit(1);
}
console.log(`design-system: ${checked} documented class strings all appear in src/`);
