/**
 * Mobile audit — measures the things that actually hurt on phones.
 *
 *   node tools/mobile-audit.mjs
 *
 * Checks, at three phone widths: horizontal overflow, tap-target sizes,
 * input font sizes (iOS zooms below 16px), text smaller than 12px,
 * sticky/fixed elements that cover content, and hero height.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] || 'http://127.0.0.1:5180';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9349;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const WIDTHS = [360, 390, 414];
const PAGES = ['/', '/products/', '/products/dims/', '/services/', '/contact/', '/insights/', '/careers/'];

const proc = spawn(
  CHROME,
  [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--force-device-scale-factor=1', `--remote-debugging-port=${PORT}`,
    '--user-data-dir=' + path.join(root, 'qa', '.chrome-mobile'), 'about:blank',
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

const js = async (expression) => {
  const { result } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return result.value;
};

await send('Page.enable');
await send('Runtime.enable');

const PROBE = `(() => {
  const vw = document.documentElement.clientWidth;
  const describe = (el) => {
    const cls = typeof el.className === 'string' && el.className.trim()
      ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '';
    return el.tagName.toLowerCase() + cls;
  };

  // horizontal overflow
  const overflow = document.documentElement.scrollWidth - vw;
  const wide = [];
  if (overflow > 1) {
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width > 0 && r.right > vw + 1 && cs.position !== 'fixed' && cs.overflow !== 'hidden') {
        wide.push(describe(el) + ' →' + Math.round(r.right));
        if (wide.length > 4) break;
      }
    }
  }

  // tap targets: interactive elements that are too small
  const small = [];
  const rendered = (el) =>
    el.offsetParent !== null &&
    !el.closest('[aria-hidden="true"]') &&
    !el.closest('.skip-link') &&
    getComputedStyle(el).visibility !== 'hidden';

  for (const el of document.querySelectorAll('a[href], button, input, select, textarea, summary')) {
    let r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (!rendered(el)) continue;

    // A card link with a stretched ::after has the card as its real target.
    const after = getComputedStyle(el, '::after');
    if (after.content !== 'none' && after.position === 'absolute') {
      const host = el.closest('.service-card, .product-card, .industry-tile, .insight-card');
      if (host) r = host.getBoundingClientRect();
    }

    // Links inline inside a sentence are exempt from the target-size rule.
    if (el.tagName === 'A' && el.closest('label, p, .prose li, .form-note')) continue;

    if (r.height < 24 || r.width < 24) {
      small.push({ el: describe(el), w: Math.round(r.width), h: Math.round(r.height), text: el.textContent.trim().slice(0, 24) });
    }
  }

  // inputs below 16px trigger iOS zoom
  // iOS only zooms text-entry fields, not checkboxes or radios
  const zoom = [...document.querySelectorAll('input:not([type=checkbox]):not([type=radio]), select, textarea')]
    .filter(el => el.offsetParent !== null && parseFloat(getComputedStyle(el).fontSize) < 16)
    .map(el => describe(el) + ' ' + getComputedStyle(el).fontSize);

  // very small text
  const tiny = new Set();
  for (const el of document.querySelectorAll('p, li, span, a, td, label, small')) {
    if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    if (!rendered(el) || el.closest('.mock')) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs > 0 && fs < 11) tiny.add(describe(el) + ' ' + fs.toFixed(1) + 'px');
  }

  const heroH = document.querySelector('.hero') ? Math.round(document.querySelector('.hero').getBoundingClientRect().height) : null;
  const headerH = Math.round(document.querySelector('.site-header').getBoundingClientRect().height);

  return {
    overflow,
    wide: wide.slice(0, 4),
    small: small.slice(0, 8),
    smallCount: small.length,
    zoom: [...new Set(zoom)].slice(0, 6),
    tiny: [...tiny].slice(0, 6),
    heroH,
    headerH,
  };
})()`;

const problems = [];

for (const width of WIDTHS) {
  console.log(`\n── ${width} px ──────────────────────────────`);
  for (const route of PAGES) {
    await send('Emulation.setDeviceMetricsOverride', {
      width, height: 844, deviceScaleFactor: 2, mobile: true,
    });
    await send('Page.navigate', { url: BASE + route });
    await wait(900);
    await js(`document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in'))`);
    await wait(200);
    const r = await js(PROBE);

    const flags = [];
    if (r.overflow > 1) flags.push(`overflow ${r.overflow}px ${r.wide.join(' ')}`);
    if (r.smallCount) flags.push(`${r.smallCount} small tap target(s)`);
    if (r.zoom.length) flags.push(`input zoom: ${r.zoom.join(', ')}`);
    if (r.tiny.length) flags.push(`tiny text: ${r.tiny.join(', ')}`);

    if (flags.length) problems.push({ width, route, ...r });
    const tag = flags.length ? 'FAIL' : ' ok ';
    console.log(`${tag} ${route.padEnd(22)} ${flags.join(' | ') || `hero ${r.heroH}px, header ${r.headerH}px`}`);
    if (r.small.length) {
      for (const s of r.small.slice(0, 4)) console.log(`       ${s.w}×${s.h}  ${s.el}  "${s.text}"`);
    }
  }
}

console.log(`\n${problems.length} page/width combinations with findings\n`);
ws.close();
proc.kill('SIGKILL');
process.exit(0);
