// Fails when AGENTS.md states something the repository no longer backs up: a path that does not exist,
// a dependency version or npm script that package.json does not have, or a colour missing from global.css.
// AGENTS.md loads into every agent's context, so a stale line there misleads every run.
// A gitignored path (TODO.md) is skipped, because a fresh checkout does not have it.
// Usage: node scripts/check-agents-md.mjs [file]   (default AGENTS.md)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const FILE = process.argv[2] ?? 'AGENTS.md';
const lines = readFileSync(FILE, 'utf8').split('\n');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const css = readFileSync('src/styles/global.css', 'utf8');
const files = execFileSync('git', ['ls-files', '-co', '--exclude-standard'], { encoding: 'utf8' }).split('\n').filter(Boolean);
const ignored = (p) => { try { execFileSync('git', ['check-ignore', '-q', p]); return true; } catch { return false; } };
const glob = (p) => new RegExp(`^${p.replace(/[.+^$()|[\]{}]/g, '\\$&').replace(/\*/g, '[^/]+')}$`);
const found = (p) => (p.includes('*') ? files.some((f) => glob(p).test(f)) : existsSync(p)) || ignored(p);

const FILENAME = /^[\w.-]+\.(tsx?|css|md|json|html|svg|mjs|js|sh|yaml)$/;
const stale = [];
const tree = []; // directory names of the tree diagram, by depth
let checked = 0;
const check = (ok, i, message) => { checked++; if (!ok) stale.push(`${FILE}:${i + 1}: ${message}`); };

lines.forEach((line, i) => {
  // Tree diagram: each level is four columns, and the first line is the repository root.
  const entry = line.match(/^((?:[│ ] {3})*)[├└]── (\S+)/);
  if (entry) {
    const depth = entry[1].length / 4;
    tree.length = depth;
    const path = join(...tree, entry[2]);
    if (entry[2].endsWith('/')) tree.push(entry[2]);
    return check(found(path), i, `tree entry ${path} does not exist`);
  }
  // Tech stack row: a package name, then its version range in backticks.
  const row = line.match(/^\| `?([^`|]+?)`? `([~^]?\d[\w.-]*)` \|/);
  if (row) {
    const name = [row[1], row[1].toLowerCase().replace(/ /g, '-'), row[1].toLowerCase().replace(/ /g, '')].find((n) => n in deps);
    return check(name && deps[name] === row[2], i, name ? `${name} is ${deps[name]} in package.json, not ${row[2]}` : `no package named ${row[1]} in package.json`);
  }
  for (const [, script] of line.matchAll(/npm run ([\w:-]+)/g)) check(script in pkg.scripts, i, `package.json has no script "${script}"`);
  for (const [hex] of line.matchAll(/#[0-9a-f]{6}\b/gi)) check(css.includes(hex), i, `${hex} is not in src/styles/global.css`);
  // A path is a slash-separated run that is backticked, or ends in a file extension or a slash.
  const spans = new Set([...line.matchAll(/`([^`\s]+)`/g)].map((m) => m[1]));
  for (const [, raw] of line.matchAll(/(?<![\w/@.:-])(\.?[\w-]+(?:\/[\w.*@-]+)+\/?)/g)) {
    const path = raw.replace(/\.+$/, ''); // a sentence's full stop is not part of the path
    if (!(spans.has(path) || path.endsWith('/') || FILENAME.test(basename(path)))) continue;
    check(found(path), i, `path ${path} does not exist`);
  }
  for (const span of spans) if (FILENAME.test(span)) check(files.some((f) => basename(f) === span) || ignored(span), i, `no file named ${span}`);
});

if (stale.length) {
  console.error(`agents-md: ${stale.length} stale claim(s):\n${stale.join('\n')}`);
  process.exit(1);
}
console.log(`agents-md: ${checked} paths, versions, scripts and colours all match the repository`);
