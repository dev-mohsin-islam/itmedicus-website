/**
 * WCAG contrast audit.
 *
 * Walks every element that carries its own text on a set of representative
 * pages, resolves the effective background (compositing rgba layers and
 * approximating gradient stops), and reports anything below AA.
 *
 *   node tools/contrast.mjs
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] || 'http://127.0.0.1:5180';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9337;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const PAGES = [
  '/', '/about/', '/products/', '/products/dims/', '/services/',
  '/industries/', '/insights/', '/insights/offline-first-healthcare-applications/',
  '/careers/', '/contact/', '/privacy/', '/404.html',
];

const proc = spawn(
  CHROME,
  [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--force-device-scale-factor=1', `--remote-debugging-port=${PORT}`,
    '--user-data-dir=' + path.join(root, 'qa', '.chrome-contrast'), 'about:blank',
  ],
  { stdio: 'ignore' }
);

for (let i = 0; i < 80; i++) {
  await wait(250);
  try { if ((await fetch(`http://127.0.0.1:${PORT}/json/version`)).ok) break; } catch {}
}

const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener('open', res, { once: true });
  ws.addEventListener('error', rej, { once: true });
});

let id = 0;
const pending = new Map();
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const n = ++id;
    pending.set(n, { resolve, reject });
    ws.send(JSON.stringify({ id: n, method, params }));
  });

await send('Page.enable');
await send('Runtime.enable');

/* Runs in the page. */
const AUDIT = `(() => {
  const parse = (s) => {
    const m = s.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map(v => parseFloat(v));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };

  const firstGradientStops = (img) => {
    const out = [];
    const re = /rgba?\\([^)]+\\)/g;
    let m;
    while ((m = re.exec(img)) && out.length < 3) out.push(parse(m[0]));
    return out.filter(Boolean);
  };

  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });

  const lum = (c) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };

  const ratio = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  function effectiveBg(el, fg) {
    let node = el;
    let stack = [];
    while (node && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      const bg = parse(cs.backgroundColor);
      if (bg && bg.a > 0.92) {
        stack.push(bg);
        break;
      }
      if (bg && bg.a > 0.02) stack.push(bg);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        const stops = firstGradientStops(cs.backgroundImage);
        // A gradient painted in the text colour is the underline trick, not a
        // background — ignore it so the walk continues to the real surface.
        const isUnderline =
          stops.length && fg &&
          Math.abs(stops[0].r - fg.r) < 10 &&
          Math.abs(stops[0].g - fg.g) < 10 &&
          Math.abs(stops[0].b - fg.b) < 10;
        if (stops.length && !isUnderline) {
          stack.push(stops[0]);
          break;
        }
      }
      node = node.parentElement;
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return base;
  }

  const results = [];
  const all = document.querySelectorAll('body *');
  for (const el of all) {
    const hasText = Array.from(el.childNodes).some(
      (n) => n.nodeType === 3 && n.textContent.trim().length > 1
    );
    if (!hasText) continue;

    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.25) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) continue;
    if (el.closest('.sr-only')) continue;

    const fg = parse(cs.color);
    if (!fg || fg.a < 0.15) continue; // decorative outline / hidden text
    const bg = effectiveBg(el, fg);
    const c = ratio(over(fg, bg), bg);

    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const min = large ? 3 : 4.5;

    if (c < min) {
      results.push({
        sel: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className
          ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : ''),
        text: el.textContent.trim().slice(0, 42),
        ratio: Math.round(c * 100) / 100,
        need: min,
        size: Math.round(size),
      });
    }
  }
  return results;
})()`;

const summary = [];

for (const route of PAGES) {
  await send('Page.navigate', { url: BASE + route });
  await wait(900);
  await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in'))`,
  });
  await wait(250);
  const { result, exceptionDetails } = await send('Runtime.evaluate', {
    expression: AUDIT, returnByValue: true,
  });
  if (exceptionDetails) {
    console.log('  eval error', route, exceptionDetails.text);
    continue;
  }
  const failures = result.value || [];
  summary.push({ route, failures });
  console.log(`${failures.length ? 'FAIL' : ' ok '} ${route.padEnd(52)} ${failures.length} below AA`);
  for (const f of failures.slice(0, 6)) {
    console.log(`        ${f.ratio}:1 (needs ${f.need}) ${f.size}px  ${f.sel}  “${f.text}”`);
  }
}

const total = summary.reduce((n, s) => n + s.failures.length, 0);
console.log(`\n${total} contrast issue(s) across ${summary.length} pages\n`);

ws.close();
proc.kill('SIGKILL');
process.exit(0);
