// Real touch tap on one control at 375x812 mobile+touch, for press and tap bugs (#56, #71-#74).
// chrome-devtools-axi has no touch input, so this drives its own headless Chrome over CDP.
// Run it through `ax.sh tap`, which sets BASE:
//   node touch-tap.mjs '<snapshot regex>' [path] [--stuck-active]
// The regex matches lines shaped like the axi snapshot: link "CODE" url="https://github.com/laanhema/tralla"
// Prints one JSON line {target, before, after, popups} and a verdict line; exits 1 on NO-MATCH, MISSED
// (the tap never reached the control) or NOT-AT-REST (a transform or animation is left 700ms after the tap).
// --stuck-active then forces :active on the control, to model a browser that leaves it set after a tap
// opens a new tab (#72), and adds the resulting computed style as after.stuckActive.
// HOLD=<ms> sets how long the finger stays down (default 80).
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const stuckActive = args.includes('--stuck-active');
const [pattern, path = '/'] = args.filter((a) => a !== '--stuck-active');
if (!pattern) { console.error("usage: touch-tap.mjs '<snapshot regex>' [path] [--stuck-active]"); process.exit(2); }

const BASE = process.env.BASE ?? 'http://127.0.0.1:5199';
const HOLD = Number(process.env.HOLD ?? 80);
const profile = mkdtempSync(join(tmpdir(), 'touch-tap-'));
// Port 0 lets Chrome pick a free port and write it to DevToolsActivePort, so parallel runs never collide.
const chrome = spawn('google-chrome', ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let code = 1;
let ws;
try {
  let http, targets;
  for (let i = 0; i < 50 && !targets; i++) {
    await sleep(200);
    try { http = `http://127.0.0.1:${readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]}`; } catch { continue; }
    targets = await fetch(`${http}/json/list`).then((r) => r.json()).catch(() => undefined);
  }
  if (!targets) throw new Error('headless Chrome did not start');
  const page = targets.find((t) => t.type === 'page');
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (d) => (d.error ? rej(new Error(`${method}: ${d.error.message}`)) : res(d.result))); ws.send(JSON.stringify({ id: i, method, params })); });

  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Page.enable');
  await send('Page.navigate', { url: BASE + path });
  await sleep(1500);

  const { nodes } = await send('Accessibility.getFullAXTree');
  const lines = nodes.filter((n) => !n.ignored && n.backendDOMNodeId && n.name?.value).map((n) => {
    const url = n.properties?.find((p) => p.name === 'url')?.value.value;
    return { backendNodeId: n.backendDOMNodeId, line: `${n.role.value} "${n.name.value}"${url ? ` url="${url}"` : ''}` };
  });
  const target = lines.find((l) => new RegExp(pattern).test(l.line));
  if (!target) {
    console.error(`NO-MATCH: no line matches: ${pattern}`);
    console.error(lines.filter((l) => /^(link|button) /.test(l.line)).map((l) => `  ${l.line}`).join('\n'));
  } else {
    const { object } = await send('DOM.resolveNode', { backendNodeId: target.backendNodeId });
    const call = async (fn) => (await send('Runtime.callFunctionOn', { objectId: object.objectId, functionDeclaration: fn.toString(), returnByValue: true })).result.value;

    // Instant scroll is read-only setup (the tap below is the user path); the wait lets GSAP reveal the section.
    await call(function () { this.scrollIntoView({ block: 'center', behavior: 'instant' }); });
    await sleep(1500);
    const before = await call(function () {
      const pos = () => { const r = this.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY]; };
      const [x0, y0] = pos();
      const t0 = performance.now();
      const s = (window.__tap = { events: [], anims: null, frames: 0, pressedFrames: 0, maxShift: 0 });
      for (const type of ['pointerdown', 'pointerup', 'click']) this.addEventListener(type, () => s.events.push(type), { capture: true });
      // Read the animations from window: a listener on the control itself runs before React's root handler starts playPress.
      window.addEventListener('pointerdown', () => { s.anims = this.getAnimations().map((a) => a.effect.getKeyframes()[0]?.transform ?? null); }, { once: true });
      const tick = () => {
        if (this.isConnected) {
          const [x, y] = pos();
          const d = Math.max(Math.abs(x - x0), Math.abs(y - y0));
          s.frames++;
          if (d > 0.5) s.pressedFrames++;
          s.maxShift = Math.max(s.maxShift, +d.toFixed(1));
        }
        if (performance.now() - t0 < 900) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      const r = this.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, path: location.pathname, hash: location.hash, scrollY: Math.round(scrollY), hover: matchMedia('(hover: hover)').matches };
    });

    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: before.x, y: before.y }] });
    await sleep(HOLD);
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await sleep(700);

    // A target=_blank link opens a new tab; close it so the run leaves nothing behind.
    const popups = (await fetch(`${http}/json/list`).then((r) => r.json())).filter((t) => t.type === 'page' && t.id !== page.id);
    for (const p of popups) await fetch(`${http}/json/close/${p.id}`);

    const read = function () {
      const cs = getComputedStyle(this);
      return { attached: this.isConnected, ...window.__tap, path: location.pathname, hash: location.hash, scrollY: Math.round(scrollY), menuExpanded: document.querySelector('button[aria-controls=mobile-menu]')?.getAttribute('aria-expanded') ?? null, transform: cs.transform, translate: cs.translate, boxShadow: cs.boxShadow, running: this.getAnimations().length, active: this.matches(':active') };
    };
    const after = await call(read);
    if (stuckActive && after.attached) {
      await send('DOM.enable');
      await send('CSS.enable');
      await send('DOM.getDocument');
      const { nodeId } = await send('DOM.requestNode', { objectId: object.objectId });
      await send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: ['active'] });
      await sleep(300);
      const { transform, translate, boxShadow } = await call(read);
      after.stuckActive = { transform, translate, boxShadow };
    }

    const verdict = !after.events.includes('pointerdown') ? 'MISSED'
      : after.attached && (after.transform !== 'none' || after.translate !== 'none' || after.running !== 0) ? 'NOT-AT-REST'
      : 'ok';
    console.log(JSON.stringify({ target: target.line, before, after, popups: popups.map((p) => p.url) }));
    console.log(`tap ${target.line}: ${verdict}`);
    code = verdict === 'ok' ? 0 : 1;
  }
} finally {
  ws?.close();
  chrome.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true });
}
process.exit(code);
